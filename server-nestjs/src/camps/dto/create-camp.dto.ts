// server-nestjs/src/camps/dto/create-camp.dto.ts
import {
    IsNumber,
    IsString,
    IsNotEmpty,
    IsArray,
    ValidateNested,
    Min,
  } from 'class-validator';
  import { Type, Transform } from 'class-transformer';
  import { TimelineDto } from './timeline.dto';
  
  export class CreateCampDto {
    @Transform(({ value }) => {
      return typeof value === 'string' ? parseInt(value, 10) : value;
    })
    @IsNumber({}, { message: '연도는 숫자여야 합니다.' })
    @IsNotEmpty({ message: '연도는 필수 입력값입니다.' })
    year: number;
  
    @IsString({ message: '주제는 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '주제는 필수 입력값입니다.' })
    topic: string;

    @Transform(({ value }) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return value;
    })
  
    @IsArray({ message: '타임라인은 배열이어야 합니다.' })
    @ValidateNested({ each: true })
    @Type(() => TimelineDto)
    timeline: TimelineDto[];
  
    @IsString({ message: '설명은 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '캠프 설명은 필수 입력값입니다.' })
    description: string;
  
    @IsString({ message: '장소는 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '캠프 장소는 필수 입력값입니다.' })
    location: string;
  
    @Transform(({ value }) => {
      return typeof value === 'string' ? parseInt(value, 10) : value;
    })
    @IsNumber({}, { message: '참가자 수는 숫자여야 합니다.' })
    @Min(1, { message: '참가자 수는 최소 1명 이상이어야 합니다.' })
    participants: number;
  }