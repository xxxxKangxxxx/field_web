// server-nestjs/src/auth/dto/verify-email.dto.ts
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '인증번호는 필수 입력 항목입니다.' })
  @Length(6, 6, { message: '인증번호는 6자리여야 합니다.' })
  code: string;
}

