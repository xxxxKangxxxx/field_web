// server-nestjs/src/news/schemas/news.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NewsDocument = News & Document;

@Schema({ timestamps: true })
export class News {
  @Prop({ required: [true, '제목은 필수 입력값입니다.'] })
  title: string;

  @Prop({ required: [true, '내용은 필수 입력값입니다.'] })
  content: string;

  @Prop({
    required: [true, '카테고리는 필수 입력값입니다.'],
    enum: {
      values: ['monthly', 'career', 'notice'],
      message: '유효하지 않은 카테고리입니다.',
    },
  })
  category: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop()
  fileKey: string; // S3 키 (예: "news/1234567890-abc.pdf")

  @Prop()
  fileName: string; // 원본 파일명

  @Prop()
  fileType: string; // MIME 타입 (예: "application/pdf")

  createdAt?: Date;
  updatedAt?: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);