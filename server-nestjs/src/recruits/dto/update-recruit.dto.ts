// server-nestjs/src/recruits/dto/update-recruit.dto.ts
import {
    IsNumber,
    IsIn,
    IsArray,
    ValidateNested,
    IsBoolean,
    IsOptional,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ScheduleDto } from './schedule.dto';
  
  export class UpdateRecruitDto {
    @IsOptional()
    @IsNumber({}, { message: '연도는 숫자여야 합니다.' })
    year?: number;
  
    @IsOptional()
    @IsIn(['상반기', '하반기'], {
      message: '시즌은 상반기 또는 하반기여야 합니다.',
    })
    season?: string;
  
    @IsOptional()
    @IsArray({ message: '일정은 배열이어야 합니다.' })
    @ValidateNested({ each: true })
    @Type(() => ScheduleDto)
    schedules?: ScheduleDto[];
  
    @IsOptional()
    @IsBoolean({ message: 'isActive는 boolean이어야 합니다.' })
    isActive?: boolean;
  }