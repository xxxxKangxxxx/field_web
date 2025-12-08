// server-nestjs/src/recruits/schemas/recruit.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecruitDocument = Recruit & Document;

// Schedule 서브 스키마
class Schedule {
  @Prop({ required: true })
  title: string;

  // 일정 유형: 서류 모집, 서류 합격 발표, 면접, 최종 발표, 기타
  @Prop({
    required: true,
    enum: ['application', 'doc_result', 'interview', 'final_result', 'etc'],
  })
  type: string;

  // 시작일 (YYYY-MM-DD)
  @Prop({ required: true })
  startDate: string;

  // 종료일 (YYYY-MM-DD, 선택값)
  @Prop()
  endDate?: string;

  // 레거시 데이터 호환용 단일 날짜 필드
  @Prop()
  date?: string;
}

@Schema({ timestamps: true })
export class Recruit {
  @Prop({ required: [true, '연도는 필수 입력값입니다.'] })
  year: number;

  @Prop({
    required: [true, '시즌은 필수 입력값입니다.'],
    enum: {
      values: ['상반기', '하반기'],
      message: '시즌은 상반기 또는 하반기여야 합니다.',
    },
  })
  season: string;

  // 모집 기간 (시작일, 종료일) - YYYY-MM-DD 형식 문자열로 저장
  @Prop()
  recruitStartDate?: string;

  @Prop()
  recruitEndDate?: string;

  @Prop({ type: [Schedule], default: [] })
  schedules: Schedule[];

  @Prop({ default: true })
  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const RecruitSchema = SchemaFactory.createForClass(Recruit);