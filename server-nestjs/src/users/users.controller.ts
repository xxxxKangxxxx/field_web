// server-nestjs/src/users/users.controller.ts
import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';
import { JwtPayload } from '../auth/strategies/jwt.strategy';
import { VerificationService } from '../auth/verification.service';

interface RequestWithUser extends ExpressRequest {
  user: JwtPayload;
}

@Controller(['users', ''])
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly verificationService: VerificationService,
  ) {}

  @Get('departments')
  getDepartments() {
    return ['대외협력부', '총기획단', '기획부', '컴페티션부', '홍보부'];
  }

  /**
   * 모든 사용자 조회 (SuperAdmin 전용)
   * GET /api/users
   */
  @Get()
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      message: '사용자 목록 조회 성공',
      users: users.map((user) => ({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        department: user.department,
        position: user.position,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
        createdAt: user.createdAt,
      })),
    };
  }

  /**
   * 본인 프로필 수정
   * PUT /api/users/profile
   * 일반 사용자: 이름, 비밀번호만 수정 가능
   * SuperAdmin: 모든 정보 수정 가능
   */
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const user = req.user;

    // 비밀번호 변경 시 이메일 인증 완료 여부 확인
    if (updateProfileDto.password) {
      const isVerified = await this.verificationService.isVerified(user.email);
      if (!isVerified) {
        throw new BadRequestException('비밀번호 변경을 위해 이메일 인증을 완료해주세요.');
      }
    }

    // 비밀번호 확인
    if (updateProfileDto.password && updateProfileDto.password !== updateProfileDto.confirmPassword) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    // SuperAdmin인 경우 모든 정보 수정 가능
    if (user.isSuperAdmin) {
      const updateData: any = {};
      if (updateProfileDto.name) updateData.name = updateProfileDto.name;
      if (updateProfileDto.password) {
        updateData.password = updateProfileDto.password;
        // 비밀번호 변경 완료 후 인증 정보 삭제
        await this.verificationService.deleteVerification(user.email);
      }
      if (updateProfileDto.department !== undefined) updateData.department = updateProfileDto.department;
      if (updateProfileDto.position !== undefined) {
        updateData.position = updateProfileDto.position;
        // position 변경 시 isAdmin 자동 업데이트
        updateData.isAdmin =
          updateProfileDto.position.includes('부장') ||
          updateProfileDto.position === '단장' ||
          updateProfileDto.position === '부단장';
      }
      
      const updatedUser = await this.usersService.updateUser(user.id, updateData);
      return {
        message: '프로필이 수정되었습니다.',
        user: {
          email: updatedUser.email,
          name: updatedUser.name,
          department: updatedUser.department,
          position: updatedUser.position,
          isAdmin: updatedUser.isAdmin,
          isSuperAdmin: updatedUser.isSuperAdmin,
        },
      };
    }

    // 일반 사용자는 이름, 비밀번호만 수정 가능
    const updateData: any = {};
    if (updateProfileDto.name) updateData.name = updateProfileDto.name;
    if (updateProfileDto.password) {
      updateData.password = updateProfileDto.password;
      // 비밀번호 변경 완료 후 인증 정보 삭제
      await this.verificationService.deleteVerification(user.email);
    }

    const updatedUser = await this.usersService.updateProfile(user.id, updateData);
    return {
      message: '프로필이 수정되었습니다.',
      user: {
        email: updatedUser.email,
        name: updatedUser.name,
        department: updatedUser.department,
        position: updatedUser.position,
        isAdmin: updatedUser.isAdmin,
        isSuperAdmin: updatedUser.isSuperAdmin,
      },
    };
  }

  /**
   * 사용자 정보 수정 (SuperAdmin 전용)
   * PUT /api/users/:id
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const updateData: any = {};
    if (updateUserDto.name !== undefined) updateData.name = updateUserDto.name;
    if (updateUserDto.password !== undefined) updateData.password = updateUserDto.password;
    if (updateUserDto.department !== undefined) updateData.department = updateUserDto.department;
    if (updateUserDto.position !== undefined) {
      updateData.position = updateUserDto.position;
      // position 변경 시 isAdmin 자동 업데이트
      updateData.isAdmin =
        updateUserDto.position.includes('부장') ||
        updateUserDto.position === '단장' ||
        updateUserDto.position === '부단장';
    }

    const updatedUser = await this.usersService.updateUser(id, updateData);
    return {
      message: '사용자 정보가 수정되었습니다.',
      user: {
        email: updatedUser.email,
        name: updatedUser.name,
        department: updatedUser.department,
        position: updatedUser.position,
        isAdmin: updatedUser.isAdmin,
        isSuperAdmin: updatedUser.isSuperAdmin,
      },
    };
  }

  /**
   * 사용자 삭제 (SuperAdmin 전용)
   * DELETE /api/users/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async deleteUser(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    await this.usersService.deleteUser(id);
    return { message: '사용자가 삭제되었습니다.' };
  }
}