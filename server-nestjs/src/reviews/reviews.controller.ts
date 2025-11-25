// server-nestjs/src/reviews/reviews.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async findAll() {
    return this.reviewsService.findAll();
  }

  @Get('camp/:campId')
  async findByCamp(@Param('campId') campId: string) {
    return this.reviewsService.findByCamp(campId);
  }

  @Post('camp/:campId')
  async create(
    @Param('campId') campId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(campId, createReviewDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.reviewsService.remove(id);
    return { message: '리뷰 삭제 완료' };
  }
}