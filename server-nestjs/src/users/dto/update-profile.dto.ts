import { IsString, IsOptional, MinLength, IsEnum } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(4, { message: '비밀번호는 최소 4자 이상이어야 합니다.' })
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  confirmPassword?: string;

  @IsOptional()
  @IsEnum(['대외협력부', '총기획단', '기획부', '컴페티션부', '홍보부'], {
    message: '유효하지 않은 소속입니다.',
  })
  department?: string;

  @IsOptional()
  @IsEnum(
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
