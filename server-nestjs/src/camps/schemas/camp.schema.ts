// server-nestjs/src/camps/schemas/camp.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CampDocument = Camp & Document;

// Timeline 서브 스키마
class Timeline {
  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  event: string;
}

@Schema({ timestamps: true })
export class Camp {
  @Prop({ required: [true, '연도는 필수 입력값입니다.'] })
  year: number;

  @Prop({ required: [true, '주제는 필수 입력값입니다.'] })
  topic: string;

  @Prop({ required: [true, '포스터 이미지는 필수입니다.'] })
  posterImageKey: string; // S3 키만 저장 (예: "camps/1234567890-abc.jpg")

  @Prop({ type: [Timeline], default: [] })
  timeline: Timeline[];

  @Prop({ required: [true, '캠프 설명은 필수 입력값입니다.'] })
  description: string;

  @Prop({ required: [true, '캠프 장소는 필수 입력값입니다.'] })
  location: string;

  @Prop({ required: [true, '참가자 수는 필수 입력값입니다.'] })
  participants: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CampSchema = SchemaFactory.createForClass(Camp);