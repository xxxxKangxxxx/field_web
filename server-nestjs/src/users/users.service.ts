// server-nestjs/src/users/users.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';

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
    memberType: string;
    generation?: number;
    department?: string;
    position?: string;
  }): Promise<UserDocument> {
    // 이메일 중복 체크
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    // isAdmin 자동 설정 (부장, 단장, 부단장)
    const isAdmin = userData.position
      ? userData.position.includes('부장') ||
        userData.position === '단장' ||
        userData.position === '부단장'
      : false;

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
   * 모든 사용자 조회 (SuperAdmin용)
   */
  async findAll(): Promise<UserDocument[]> {
    return this.userModel
      .find()
      .select('-password -activeToken')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * 본인 프로필 수정 (일반 사용자용: 이름, 비밀번호만)
   */
  async updateProfile(
    userId: string,
    updateData: {
      name?: string;
      password?: string;
    },
  ): Promise<UserDocument> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const updateFields: any = {};
    if (updateData.name) {
      updateFields.name = updateData.name;
    }
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateFields, { new: true })
      .select('-password -activeToken')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return updatedUser;
  }

  /**
   * 사용자 정보 수정 (SuperAdmin용: 모든 정보 수정 가능)
   */
  async updateUser(
    userId: string,
    updateData: {
      name?: string;
      password?: string;
      department?: string;
      position?: string;
    },
  ): Promise<UserDocument> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const updateFields: any = {};
    if (updateData.name !== undefined) {
      updateFields.name = updateData.name;
    }
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(updateData.password, salt);
    }
    if (updateData.department !== undefined) {
      updateFields.department = updateData.department;
    }
    if (updateData.position !== undefined) {
      updateFields.position = updateData.position;
      
      // position 변경 시 isAdmin 자동 업데이트
      updateFields.isAdmin =
        updateData.position.includes('부장') ||
        updateData.position === '단장' ||
        updateData.position === '부단장';
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateFields, { new: true })
      .select('-password -activeToken')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return updatedUser;
  }

  /**
   * 사용자 삭제 (SuperAdmin용)
   */
  async deleteUser(userId: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    await this.userModel.findByIdAndDelete(userId).exec();
  }

  /**
   * 비밀번호 직접 업데이트 (비밀번호 재설정용)
   */
  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
    }).exec();
  }
}