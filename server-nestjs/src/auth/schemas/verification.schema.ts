import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VerificationDocument = Verification & Document;

@Schema({ timestamps: true })
export class Verification {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  code: string;

  @Prop({ default: false })
  verified: boolean;

  // ⭐ 핵심: createdAt 필드에 TTL 인덱스 설정
  // expireAfterSeconds: 300 (300초 = 5분 뒤 자동 삭제)
  @Prop({ expires: 300 })
  createdAt: Date;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);

// TTL 인덱스 명시적 설정 (5분 후 자동 삭제)
VerificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

