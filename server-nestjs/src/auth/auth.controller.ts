// server-nestjs/src/auth/auth.controller.ts
import {
    Controller,
    Post,
    Get,
    Body,
    UseGuards,
    Request,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Request as ExpressRequest } from 'express'; // 👈 [수정 1] Express의 Request 타입 임포트
  import { AuthService } from './auth.service';
  import { RegisterDto, LoginDto } from './dto';
  import { SendVerificationDto } from './dto/send-verification.dto';
  import { VerifyEmailDto } from './dto/verify-email.dto';
  import { ForgotPasswordDto } from './dto/forgot-password.dto';
  import { ResetPasswordDto } from './dto/reset-password.dto';
  import { JwtAuthGuard } from './guards';
  import { JwtPayload } from './strategies/jwt.strategy'; // 👈 [수정 2] Strategy의 Payload 타입 임포트
  
  // 👈 [수정 3] req.user 타입을 포함하는 커스텀 Request 타입 정의
  interface RequestWithUser extends ExpressRequest {
    user: JwtPayload; // Strategy의 validate()가 반환하는 값의 타입
  }
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}

    /**
     * 인증번호 발송 (회원가입용)
     * POST /auth/send-verification
     */
    @Post('send-verification')
    async sendVerification(@Body() sendVerificationDto: SendVerificationDto) {
      return this.authService.sendVerification(sendVerificationDto.email, false);
    }

    /**
     * 인증번호 발송 (비밀번호 변경용)
     * POST /auth/send-password-verification
     * JWT 인증 필요
     */
    @UseGuards(JwtAuthGuard)
    @Post('send-password-verification')
    async sendPasswordVerification(@Request() req: RequestWithUser) {
      // 로그인한 사용자의 이메일로 인증번호 발송
      return this.authService.sendVerification(req.user.email, true);
    }

    /**
     * 인증번호 확인
     * POST /auth/verify-email
     */
    @Post('verify-email')
    async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
      return this.authService.verifyEmail(verifyEmailDto.email, verifyEmailDto.code);
    }
  
    /**
     * 회원가입
     * POST /auth/register
     */
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
      return this.authService.register(registerDto);
    }
  
    /**
     * 로그인
     * POST /auth/login
     */
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
      return this.authService.login(loginDto);
    }
  
    /**
     * 로그아웃
     * POST /auth/logout
     * JWT 인증 필요
     */
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Request() req: RequestWithUser) {
      return this.authService.logout(req.user.id);
    }
  
    /**
     * 내 정보 조회
     * GET /auth/me
     * JWT 인증 필요
     */
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@Request() req: RequestWithUser) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('인증 토큰이 없습니다.');
        }

        return this.authService.getMe(req.user.id, token);
    }

    /**
     * 비밀번호 찾기 - 인증번호 발송
     * POST /auth/forgot-password
     */
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
      return this.authService.forgotPassword(forgotPasswordDto.email);
    }

    /**
     * 비밀번호 재설정
     * POST /auth/reset-password
     */
    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
      return this.authService.resetPassword(
        resetPasswordDto.email,
        resetPasswordDto.code,
        resetPasswordDto.newPassword,
      );
    }
  }