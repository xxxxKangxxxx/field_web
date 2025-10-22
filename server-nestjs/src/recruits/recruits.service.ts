// server-nestjs/src/recruits/recruits.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recruit, RecruitDocument } from './schemas/recruits.schema';
import { CreateRecruitDto, UpdateRecruitDto } from './dto';

@Injectable()
export class RecruitsService {
  constructor(
    @InjectModel(Recruit.name) private recruitModel: Model<RecruitDocument>,
  ) {}

  /**
   * 모든 모집 일정 조회 (연도, 시즌 내림차순)
   */
  async findAll(): Promise<RecruitDocument[]> {
    return this.recruitModel
      .find()
      .sort({ year: -1, season: -1 })
      .select('-__v')
      .exec();
  }

  /**
   * 활성화된 모집 일정만 조회
   */
  async findActive(): Promise<RecruitDocument> {
    const recruit = await this.recruitModel
      .findOne({ isActive: true })
      .sort({ year: -1, season: -1 })
      .select('-__v')
      .exec();

    if (!recruit) {
      throw new NotFoundException('현재 진행 중인 모집이 없습니다.');
    }

    return recruit;
  }

  /**
   * 특정 모집 일정 조회
   */
  async findOne(id: string): Promise<RecruitDocument> {
    const recruit = await this.recruitModel.findById(id).select('-__v').exec();

    if (!recruit) {
      throw new NotFoundException('해당 모집 일정을 찾을 수 없습니다.');
    }

    return recruit;
  }

  /**
   * 모집 일정 생성
   * isActive가 true면 기존 활성화된 일정을 모두 비활성화
   */
  async create(createRecruitDto: CreateRecruitDto): Promise<RecruitDocument> {
    // 새로운 일정을 활성화할 경우, 기존의 활성화된 일정을 비활성화
    if (createRecruitDto.isActive) {
      await this.recruitModel.updateMany({}, { isActive: false });
    }

    const newRecruit = new this.recruitModel(createRecruitDto);
    return newRecruit.save();
  }

  /**
   * 모집 일정 수정
   * isActive를 true로 변경하면 다른 모든 일정을 비활성화
   */
  async update(
    id: string,
    updateRecruitDto: UpdateRecruitDto,
  ): Promise<RecruitDocument> {
    // 이 일정을 활성화할 경우, 다른 모든 일정을 비활성화
    if (updateRecruitDto.isActive) {
      await this.recruitModel.updateMany({ _id: { $ne: id } }, { isActive: false });
    }

    const updatedRecruit = await this.recruitModel
      .findByIdAndUpdate(id, updateRecruitDto, {
        new: true,
        runValidators: true,
      })
      .select('-__v')
      .exec();

    if (!updatedRecruit) {
      throw new NotFoundException('해당 모집 일정을 찾을 수 없습니다.');
    }

    return updatedRecruit;
  }

  /**
   * 모집 일정 삭제
   */
  async remove(id: string): Promise<void> {
    const recruit = await this.recruitModel.findById(id).exec();

    if (!recruit) {
      throw new NotFoundException('삭제할 모집 일정을 찾을 수 없습니다.');
    }

    await recruit.deleteOne();
  }
}