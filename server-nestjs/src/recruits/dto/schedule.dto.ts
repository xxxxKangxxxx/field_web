// server-nestjs/src/recruits/dto/schedule.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class ScheduleDto {
  @IsString({ message: '제목은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '제목은 필수 입력값입니다.' })
  title: string;

  @IsString({ message: '날짜는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '날짜는 필수 입력값입니다.' })
  date: string;
}