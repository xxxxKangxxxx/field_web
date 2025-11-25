// server-nestjs/src/reviews/reviews.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async findAll(): Promise<ReviewDocument[]> {
    return this.reviewModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByCamp(campId: string): Promise<ReviewDocument[]> {
    return this.reviewModel.find({ campId }).sort({ createdAt: -1 }).exec();
  }

  async create(campId: string, createReviewDto: CreateReviewDto): Promise<ReviewDocument> {
    const newReview = new this.reviewModel({
      ...createReviewDto,
      campId,
    });
    return newReview.save();
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<ReviewDocument> {
    const updated = await this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('해당 리뷰를 찾을 수 없습니다.');
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('삭제할 리뷰를 찾을 수 없습니다.');
    }
  }
}