// server-nestjs/src/camps/camps.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Camp, CampDocument } from './schemas/camp.schema';
import { CreateCampDto, UpdateCampDto } from './dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class CampsService {
  constructor(
    @InjectModel(Camp.name) private campModel: Model<CampDocument>,
    private uploadService: UploadService, // UploadService 주입
  ) {}

  /**
   * 모든 캠프 조회 (연도 내림차순)
   */
  async findAll(): Promise<any[]> {
    const camps = await this.campModel.find().sort({ year: -1 }).exec();

    // 각 캠프의 posterImageKey를 실제 URL로 변환하여 반환
    return camps.map((camp) => ({
      _id: camp._id,
      year: camp.year,
      topic: camp.topic,
      // uploadService를 사용하여 URL 생성
      posterImage: this.uploadService.getFileUrl(camp.posterImageKey),
      timeline: camp.timeline,
      description: camp.description,
      location: camp.location,
      participants: camp.participants,
      createdAt: camp.createdAt,
      updatedAt: camp.updatedAt,
    }));
  }

  /**
   * 특정 캠프 조회
   */
  async findOne(id: string): Promise<any> {
    const camp = await this.campModel.findById(id).exec();

    if (!camp) {
      throw new NotFoundException('해당 캠프를 찾을 수 없습니다.');
    }

    return {
      _id: camp._id,
      year: camp.year,
      topic: camp.topic,
      // uploadService를 사용하여 URL 생성
      posterImage: this.uploadService.getFileUrl(camp.posterImageKey),
      timeline: camp.timeline,
      description: camp.description,
      location: camp.location,
      participants: camp.participants,
      createdAt: camp.createdAt,
      updatedAt: camp.updatedAt,
    };
  }

  /**
   * 캠프 생성 (S3 포스터 업로드 포함)
   */
  async create(
    createCampDto: CreateCampDto,
    posterFile: Express.Multer.File,
  ): Promise<any> {
    if (!posterFile) {
      throw new BadRequestException('포스터 이미지는 필수입니다.');
    }

    // S3에 포스터 업로드하고 key 반환 받기
    const { key, url } = await this.uploadService.uploadFile(posterFile, 'camps');

    try {
      // DB에는 S3 key 저장
      const newCamp = new this.campModel({
        ...createCampDto,
        posterImageKey: key, // URL 대신 key 저장
      });

      const savedCamp = await newCamp.save();

      // 응답 시에는 key를 URL로 변환하여 전달
      return {
        _id: savedCamp._id,
        year: savedCamp.year,
        topic: savedCamp.topic,
        posterImage: url, // 업로드 시 반환받은 url 사용
        timeline: savedCamp.timeline,
        description: savedCamp.description,
        location: savedCamp.location,
        participants: savedCamp.participants,
        createdAt: savedCamp.createdAt,
        updatedAt: savedCamp.updatedAt,
      };
    } catch (error) {
      // DB 저장 실패 시 업로드된 S3 파일 삭제 (롤백)
      await this.uploadService.deleteFile(key);
      console.error('캠프 생성 실패:', error);
      throw new Error('캠프 생성 중 오류가 발생했습니다.'); // 또는 더 구체적인 에러
    }
  }

  /**
   * 캠프 수정 (포스터 변경 시 기존 S3 파일 삭제)
   */
  async update(
    id: string,
    updateCampDto: UpdateCampDto,
    posterFile?: Express.Multer.File, // 포스터 파일은 선택적
  ): Promise<any> {
    const camp = await this.campModel.findById(id).exec();

    if (!camp) {
      throw new NotFoundException('수정할 캠프를 찾을 수 없습니다.');
    }

    let newPosterKey = camp.posterImageKey; // 기본값은 기존 키
    let newPosterUrl: string | null = this.uploadService.getFileUrl(newPosterKey); // 기본값은 기존 URL

    // 새로운 포스터 파일이 제공된 경우에만 S3 작업 수행
    if (posterFile) {
      // 기존 S3 파일 삭제 (키가 존재할 경우에만)
      if (camp.posterImageKey) {
        await this.uploadService.deleteFile(camp.posterImageKey);
      }

      // 새 파일 업로드
      const { key, url } = await this.uploadService.uploadFile(posterFile, 'camps');
      newPosterKey = key; // 새로운 키로 업데이트
      newPosterUrl = url; // 새로운 URL로 업데이트
    }

    try {
      // DB 업데이트 (posterImageKey 업데이트)
      const updatedCamp = await this.campModel
        .findByIdAndUpdate(
          id,
          {
            ...updateCampDto,
            posterImageKey: newPosterKey, // 새로운 키로 업데이트
          },
          { new: true, runValidators: true }, // 업데이트된 문서 반환 및 유효성 검사 실행
        )
        .exec();

      // 💡 [수정] 업데이트 결과가 null인지 명시적으로 확인
      if (!updatedCamp) {
        // 이 경우는 매우 드물지만 (업데이트 직전에 삭제된 경우 등) 처리
        throw new NotFoundException('캠프 업데이트 중 문서를 찾지 못했습니다.');
      }

      // 응답 시에는 URL 포함
      return {
        _id: updatedCamp._id,
        year: updatedCamp.year,
        topic: updatedCamp.topic,
        posterImage: newPosterUrl, // 업데이트된 URL 사용
        timeline: updatedCamp.timeline,
        description: updatedCamp.description,
        location: updatedCamp.location,
        participants: updatedCamp.participants,
        createdAt: updatedCamp.createdAt,
        updatedAt: updatedCamp.updatedAt,
      };
    } catch (error) {
      // DB 업데이트 실패 시 새로 업로드한 파일 삭제 (롤백)
      // (기존 파일은 이미 삭제되었거나 원래 없었을 수 있음)
      if (posterFile && newPosterKey !== camp.posterImageKey) {
        await this.uploadService.deleteFile(newPosterKey);
      }
      console.error('캠프 수정 실패:', error);
      throw new Error('캠프 수정 중 오류가 발생했습니다.'); // 또는 더 구체적인 에러
    }
  }

  /**
   * 캠프 삭제 (S3 파일도 함께 삭제)
   */
  async remove(id: string): Promise<void> {
    const camp = await this.campModel.findById(id).exec();

    if (!camp) {
      throw new NotFoundException('삭제할 캠프를 찾을 수 없습니다.');
    }

    // S3에서 포스터 이미지 삭제 (키가 존재할 경우에만)
    if (camp.posterImageKey) {
      await this.uploadService.deleteFile(camp.posterImageKey);
    }

    // MongoDB에서 캠프 문서 삭제
    const result = await this.campModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      // 혹시 모를 동시성 문제 대비
      throw new NotFoundException('삭제할 캠프를 찾을 수 없습니다.');
    }
  }
}