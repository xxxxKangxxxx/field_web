// server-nestjs/src/auth/strategies/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt'; // 👈 StrategyOptions 임포트 제거
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  department: string;
  position: string;
  isAdmin: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET이 .env 파일에 설정되지 않았습니다!');
    }

    // [수정] super() 생성자에 'passReqToCallback: false'를 명시
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: false, // 👈 [수정] 이 줄을 추가하여 오류 해결
    }); // 👈 [수정] 'as StrategyOptions' 캐스팅 제거
  }

  /**
   * JWT 검증 (passReqToCallback: false 이므로 payload만 받음)
   */
  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.id);

    if (!user) {
      throw new UnauthorizedException(
        '유효하지 않은 토큰이거나 사용자를 찾을 수 없습니다.',
      );
    }

    // req.user에 저장될 데이터 반환
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      department: user.department,
      position: user.position,
      isAdmin: user.isAdmin,
    };
  }
}