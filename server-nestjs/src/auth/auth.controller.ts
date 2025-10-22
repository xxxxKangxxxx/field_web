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
  }