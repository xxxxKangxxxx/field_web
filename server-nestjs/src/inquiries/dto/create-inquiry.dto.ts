// server-nestjs/src/inquiries/dto/create-inquiry.dto.ts
import { IsString, IsEmail, IsNotEmpty, IsIn } from 'class-validator';

export class CreateInquiryDto {
  @IsIn(['general', 'business', 'support', 'other'])
  type: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}