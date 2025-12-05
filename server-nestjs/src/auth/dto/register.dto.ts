// server-nestjs/src/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength, IsIn, IsOptional, IsNumber, Min, Max, ValidateIf } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;

  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @MinLength(4, { message: '비밀번호는 최소 4자 이상이어야 합니다.' })
  password: string;

  @IsString({ message: '이름은 문자열이어야 합니다.' })
  name: string;

  @IsIn(['FIELD', 'GENERAL'], {
    message: '유효하지 않은 회원 유형입니다.',
  })
  memberType: string;

  @ValidateIf(o => o.memberType === 'FIELD')
  @IsNumber({}, { message: '기수는 숫자여야 합니다.' })
  @Min(1, { message: '기수는 1 이상이어야 합니다.' })
  @Max(18, { message: '기수는 18 이하여야 합니다.' })
  generation?: number;

  @ValidateIf(o => o.memberType === 'FIELD')
  @IsIn(['대외협력부', '총기획단', '기획부', '컴페티션부', '홍보부'], {
    message: '유효하지 않은 소속입니다.',
  })
  department?: string;

  @ValidateIf(o => o.memberType === 'FIELD')
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
  position?: string;
}