// server-nestjs/src/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength, IsIn } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;

  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @MinLength(4, { message: '비밀번호는 최소 4자 이상이어야 합니다.' })
  password: string;

  @IsString({ message: '이름은 문자열이어야 합니다.' })
  name: string;

  @IsIn(['대외협력부', '총기획단', '기획부', '컴페티션부', '홍보부'], {
    message: '유효하지 않은 소속입니다.',
  })
  department: string;

  @IsIn(
    [
      '대외협력부장',
      '단장',
      '부단장',
      '기획부장',
      '컴페티션부장',
      '홍보부장',
      '부원',
    ],
    {
      message: '유효하지 않은 직책입니다.',
    },
  )
  position: string;
}