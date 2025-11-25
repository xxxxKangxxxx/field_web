// server-nestjs/src/inquiries/schemas/inquiry.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InquiryDocument = Inquiry & Document;

@Schema({ timestamps: true })
export class Inquiry {
  @Prop({
    required: true,
    enum: ['general', 'business', 'support', 'other'],
  })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({
    enum: ['pending', 'inProgress', 'completed'],
    default: 'pending',
  })
  status: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const InquirySchema = SchemaFactory.createForClass(Inquiry);