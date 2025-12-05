import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '인증번호를 입력해주세요.' })
  code: string;

  @IsString()
  @IsNotEmpty({ message: '새 비밀번호를 입력해주세요.' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/, {
    message: '비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다.',
  })
  newPassword: string;
}

