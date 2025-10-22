// server-nestjs/src/camps/dto/timeline.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class TimelineDto {
  @IsString({ message: '날짜는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '날짜는 필수 입력값입니다.' })
  date: string;

  @IsString({ message: '이벤트는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '이벤트는 필수 입력값입니다.' })
  event: string;
}