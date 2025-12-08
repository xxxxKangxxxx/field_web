// server-nestjs/src/recruits/dto/schedule.dto.ts
import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class ScheduleDto {
  @IsString({ message: '제목은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '제목은 필수 입력값입니다.' })
  title: string;

  @IsString({ message: '유형은 문자열이어야 합니다.' })
  @IsIn(['application', 'doc_result', 'interview', 'final_result', 'etc'], {
    message: '유형은 application, doc_result, interview, final_result, etc 중 하나여야 합니다.',
  })
  type: string;

  @IsString({ message: '시작일은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '시작일은 필수 입력값입니다.' })
  startDate: string;

  @IsOptional()
  @IsString({ message: '종료일은 문자열이어야 합니다.' })
  endDate?: string;

  // 레거시 데이터 호환용: 기존 단일 날짜 필드
  @IsOptional()
  @IsString({ message: '날짜는 문자열이어야 합니다.' })
  date?: string;
}