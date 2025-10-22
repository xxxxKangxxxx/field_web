// server-nestjs/src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => { 
        
        // .env 파일에서 JWT_SECRET 값을 가져옴
        const secret = configService.get<string>('JWT_SECRET');

        // 값이 없는 경우, 서버 시작 시 에러를 발생
        if (!secret) {
          throw new Error('JWT_SECRET이 .env 파일에 설정되지 않았습니다!');
        }

        // 💡 [수정] expiresIn 값을 'number' 타입으로 가져옵니다.
        // (.env 파일에도 3600, 604800 같은 숫자가 있어야 합니다)
        const expiresIn = configService.get<number>('JWT_EXPIRES_IN', 3600); // 기본값 1시간(3600초)

        // 💡 [수정] return 문이 괄호 안에 있어야 합니다.
        return {
          secret,
          signOptions: {
            expiresIn, // 'number' 타입 전달
          },
        };
      }, 
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}