// server-nestjs/src/auth/auth.service.ts
import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { UsersService } from '../users/users.service';
  import { EmailService } from '../email/email.service';
  import { VerificationService } from './verification.service';
  import { RegisterDto, LoginDto } from './dto';
  import { UserDocument } from '../users/schemas/user.schema';
  
  @Injectable()
  export class AuthService {
    constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
      private emailService: EmailService,
      private verificationService: VerificationService,
    ) {}
  
    /**
     * 인증번호 발송
     */
    async sendVerification(email: string) {
      // 이미 가입된 이메일인지 확인
      const existingUser = await this.usersService.findByEmail(email);
      if (existingUser) {
        throw new BadRequestException('이미 가입된 이메일입니다.');
      }

      // 인증번호 생성
      const code = this.emailService.generateVerificationCode();

      // 인증번호 저장
      await this.verificationService.createVerification(email, code);

      // 이메일 발송
      await this.emailService.sendVerificationEmail(email, code);

      return {
        message: '인증번호가 발송되었습니다.',
      };
    }

    /**
     * 인증번호 확인
     */
    async verifyEmail(email: string, code: string) {
      const isValid = await this.verificationService.verifyCode(email, code);
      
      if (isValid) {
        return {
          message: '이메일 인증이 완료되었습니다.',
          verified: true,
        };
      }

      throw new BadRequestException('인증번호가 일치하지 않습니다.');
    }

    /**
     * 회원가입
     */
    async register(registerDto: RegisterDto) {
      // 이메일 인증 확인
      if (!(await this.verificationService.isVerified(registerDto.email))) {
        throw new BadRequestException('이메일 인증을 완료해주세요.');
      }

      const user = await this.usersService.create(registerDto);

      // 인증 정보 삭제
      await this.verificationService.deleteVerification(registerDto.email);
  
      return {
        message: '회원가입이 완료되었습니다.',
        user: {
          email: user.email,
          name: user.name,
          department: user.department,
          position: user.position,
          isAdmin: user.isAdmin,
        },
      };
    }
  
    /**
     * 로그인
     */
    async login(loginDto: LoginDto) {
      const { email, password } = loginDto;
  
      // 사용자 확인
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new BadRequestException('등록되지 않은 이메일입니다.');
      }
  
      // 비밀번호 확인
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
      }
  
      // 중복 로그인 체크
      if (user.activeToken) {
        try {
          this.jwtService.verify(user.activeToken);
          throw new BadRequestException(
            '이미 다른 기기에서 로그인되어 있습니다. 먼저 로그아웃해주세요.',
          );
        } catch (err: any) {
          // 토큰이 만료되었다면 계속 진행
          if (err.name !== 'TokenExpiredError' && err.name !== 'JsonWebTokenError') {
            throw err;
          }
        }
      }
  
      // JWT 토큰 생성
      const payload = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        department: user.department,
        position: user.position,
        isAdmin: user.isAdmin,
      };
  
      const token = this.jwtService.sign(payload);
  
      // activeToken 저장
      await this.usersService.updateActiveToken(user._id.toString(), token);
  
      return {
        message: '로그인 성공',
        token,
        user: {
          email: user.email,
          name: user.name,
          department: user.department,
          position: user.position,
          isAdmin: user.isAdmin,
        },
      };
    }
  
    /**
     * 로그아웃
     */
    async logout(userId: string) {
      await this.usersService.updateActiveToken(userId, null);
      return { message: '로그아웃 되었습니다.' };
    }
  
    /**
   * 내 정보 조회
   */
    async getMe(userId: string, requestToken: string) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
        }

        // activeToken 검증 (중복 로그인 방지)
        if (user.activeToken !== requestToken) {
            throw new UnauthorizedException(
                '다른 기기에서 로그인되어 현재 세션이 만료되었습니다.',
            );
        }

        return {
            email: user.email,
            name: user.name,
            department: user.department,
            position: user.position,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
        };
    }
}