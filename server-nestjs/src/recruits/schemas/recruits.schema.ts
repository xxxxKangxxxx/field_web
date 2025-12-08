// server-nestjs/src/recruits/schemas/recruit.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecruitDocument = Recruit & Document;

// Schedule 서브 스키마
class Schedule {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  date: string;
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