// server-nestjs/src/news/dto/update-news.dto.ts
import { IsString, IsIn, IsOptional } from 'class-validator';

export class UpdateNewsDto {
  @IsOptional()
  @IsString({ message: '제목은 문자열이어야 합니다.' })
  title?: string;

  @IsOptional()
  @IsString({ message: '내용은 문자열이어야 합니다.' })
  content?: string;

  @IsOptional()
  @IsIn(['monthly', 'career', 'notice'], {
    message: '카테고리는 monthly, career, notice 중 하나여야 합니다.',
  })
  category?: string;
}