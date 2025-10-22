// server-nestjs/src/users/users.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * 이메일로 사용자 찾기
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  /**
   * ID로 사용자 찾기
   */
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  /**
   * 새 사용자 생성
   */
  async create(userData: {
    email: string;
    password: string;
    name: string;
    department: string;
    position: string;
  }): Promise<UserDocument> {
    // 이메일 중복 체크
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    // isAdmin 자동 설정 (부장, 단장, 부단장)
    const isAdmin =
      userData.position.includes('부장') ||
      userData.position === '단장' ||
      userData.position === '부단장';

    const newUser = new this.userModel({
      ...userData,
      isAdmin,
    });

    return newUser.save();
  }

  /**
   * activeToken 업데이트
   */
  async updateActiveToken(
    userId: string,
    token: string | null,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { activeToken: token });
  }

  /**
   * 모든 사용자 조회 (관리자용)
   */
  async findAll(): Promise<UserDocument[]> {
    return this.userModel
      .find()
      .select('-password -activeToken')
      .sort({ createdAt: -1 })
      .exec();
  }
}