// server-nestjs/src/inquiries/inquiries.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inquiry, InquiryDocument } from './schemas/inquiry.schema';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectModel(Inquiry.name) private inquiryModel: Model<InquiryDocument>,
  ) {}

  async findAll(): Promise<InquiryDocument[]> {
    return this.inquiryModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByEmail(email: string): Promise<InquiryDocument[]> {
    return this.inquiryModel.find({ email }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<InquiryDocument> {
    const inquiry = await this.inquiryModel.findById(id).exec();
    if (!inquiry) {
      throw new NotFoundException('문의사항을 찾을 수 없습니다.');
    }
    return inquiry;
  }

  async create(createInquiryDto: CreateInquiryDto): Promise<InquiryDocument> {
    const newInquiry = new this.inquiryModel({
      ...createInquiryDto,
      status: 'pending',
    });
    return newInquiry.save();
  }

  async updateStatus(id: string, updateStatusDto: UpdateStatusDto): Promise<InquiryDocument> {
    const updated = await this.inquiryModel
      .findByIdAndUpdate(id, { status: updateStatusDto.status }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('문의사항을 찾을 수 없습니다.');
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.inquiryModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('문의사항을 찾을 수 없습니다.');
    }
  }
}