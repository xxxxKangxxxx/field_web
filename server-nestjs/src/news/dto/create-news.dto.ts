// server-nestjs/src/news/dto/create-news.dto.ts
import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreateNewsDto {
  @IsString({ message: '제목은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '제목은 필수 입력값입니다.' })
  title: string;

  @IsString({ message: '내용은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '내용은 필수 입력값입니다.' })
  content: string;

  @IsIn(['monthly', 'career', 'notice'], {
    message: '카테고리는 monthly, career, notice 중 하나여야 합니다.',
  })
  category: string;
}