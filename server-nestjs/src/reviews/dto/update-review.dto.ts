// server-nestjs/src/reviews/dto/update-review.dto.ts
import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;
}