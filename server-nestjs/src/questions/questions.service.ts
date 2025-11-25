// server-nestjs/src/questions/questions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async findAll(): Promise<QuestionDocument[]> {
    return this.questionModel.find().sort({ createdAt: -1 }).exec();
  }

  async create(createQuestionDto: CreateQuestionDto): Promise<QuestionDocument> {
    const newQuestion = new this.questionModel(createQuestionDto);
    return newQuestion.save();
  }

  async remove(id: string): Promise<void> {
    const question = await this.questionModel.findByIdAndDelete(id).exec();
    if (!question) {
      throw new NotFoundException('해당 질문을 찾을 수 없습니다.');
    }
  }
}