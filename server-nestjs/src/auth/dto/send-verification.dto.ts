// server-nestjs/src/auth/dto/send-verification.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendVerificationDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  email: string;
}

