// server-nestjs/src/auth/verification.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Verification, VerificationDocument } from './schemas/verification.schema';

@Injectable()
export class VerificationService {
  constructor(
    @InjectModel(Verification.name) private verificationModel: Model<VerificationDocument>,
  ) {}

  /**
   * 인증번호 생성 및 저장 (MongoDB)
   */
  async createVerification(email: string, code: string): Promise<void> {
    // 기존에 해당 이메일로 발송된 코드가 있다면 삭제
    await this.verificationModel.deleteMany({ email });

    // MongoDB에 저장 (TTL 인덱스 덕분에 5분 뒤 자동 삭제됨)
    await this.verificationModel.create({
      email,
      code,
      verified: false,
      // createdAt은 자동 생성됨
    });
  }

  /**
   * 인증번호 검증
   */
  async verifyCode(email: string, code: string): Promise<boolean> {
    // DB에서 해당 이메일의 인증 데이터 조회
    const verification = await this.verificationModel.findOne({ email });

    // 데이터가 없으면 (이미 만료되어 삭제되었거나, 요청한 적 없음)
    if (!verification) {
      throw new BadRequestException('인증번호가 발송되지 않았거나 만료되었습니다. 다시 발송해주세요.');
    }

    // 이미 인증된 이메일인지 확인
    if (verification.verified) {
      throw new BadRequestException('이미 인증된 이메일입니다.');
    }

    // 코드 일치 여부 확인
    if (verification.code !== code) {
      throw new BadRequestException('인증번호가 일치하지 않습니다.');
    }

    // 인증 성공 - verified 플래그를 true로 업데이트
    await this.verificationModel.updateOne(
      { _id: verification._id },
      { verified: true },
    );

    return true;
  }

  /**
   * 이메일 인증 완료 여부 확인
   */
  async isVerified(email: string): Promise<boolean> {
    const verification = await this.verificationModel.findOne({ email });
    return verification?.verified === true;
  }

  /**
   * 인증 완료 후 삭제 (회원가입 완료 시)
   */
  async deleteVerification(email: string): Promise<void> {
    await this.verificationModel.deleteOne({ email });
  }
}

