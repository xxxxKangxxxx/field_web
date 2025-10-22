// server-nestjs/src/news/news.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News, NewsDocument } from './schemas/news.schemas';
import { CreateNewsDto, UpdateNewsDto } from './dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
    private uploadService: UploadService,
  ) {}

  /**
   * 모든 뉴스 조회 (생성일 내림차순)
   */
  async findAll(): Promise<any[]> {
    const newsList = await this.newsModel
      .find()
      .sort({ createdAt: -1 })
      .populate('author', 'name department')
      .exec();

    return newsList.map((news) => ({
      _id: news._id,
      title: news.title,
      content: news.content,
      category: news.category,
      author: news.author,
      fileUrl: news.fileKey ? this.uploadService.getFileUrl(news.fileKey) : null,
      fileName: news.fileName,
      fileType: news.fileType,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
    }));
  }

  /**
   * 특정 뉴스 조회
   */
  async findOne(id: string): Promise<any> {
    const news = await this.newsModel
      .findById(id)
      .populate('author', 'name department')
      .exec();

    if (!news) {
      throw new NotFoundException('뉴스를 찾을 수 없습니다.');
    }

    return {
      _id: news._id,
      title: news.title,
      content: news.content,
      category: news.category,
      author: news.author,
      fileUrl: news.fileKey ? this.uploadService.getFileUrl(news.fileKey) : null,
      fileName: news.fileName,
      fileType: news.fileType,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
    };
  }

  /**
   * 뉴스 생성 (파일 업로드 선택사항)
   */
  async create(
    createNewsDto: CreateNewsDto,
    authorId: string,
    file?: Express.Multer.File,
  ): Promise<any> {
    let fileKey: string | null = null;
    let fileName: string | null = null;
    let fileType: string | null = null;

    // 파일이 있는 경우 S3 업로드
    if (file) {
      const uploadResult = await this.uploadService.uploadFile(file, 'news');
      fileKey = uploadResult.key;
      fileName = file.originalname;
      fileType = file.mimetype;
    }

    try {
      const newNews = new this.newsModel({
        ...createNewsDto,
        author: authorId,
        fileKey,
        fileName,
        fileType,
      });

      const savedNews = await newNews.save();
      await savedNews.populate('author', 'name department');

      return {
        _id: savedNews._id,
        title: savedNews.title,
        content: savedNews.content,
        category: savedNews.category,
        author: savedNews.author,
        fileUrl: fileKey ? this.uploadService.getFileUrl(fileKey) : null,
        fileName: savedNews.fileName,
        fileType: savedNews.fileType,
        createdAt: savedNews.createdAt,
        updatedAt: savedNews.updatedAt,
      };
    } catch (error) {
      // 뉴스 생성 실패 시 업로드된 S3 파일 삭제
      if (fileKey) {
        await this.uploadService.deleteFile(fileKey);
      }
      throw error;
    }
  }

  /**
   * 뉴스 수정 (파일 변경 선택사항)
   */
  async update(
    id: string,
    updateNewsDto: UpdateNewsDto,
    file?: Express.Multer.File,
  ): Promise<any> {
    const news = await this.newsModel.findById(id).exec();

    if (!news) {
      throw new NotFoundException('뉴스를 찾을 수 없습니다.');
    }

    let newFileKey = news.fileKey;
    let newFileName = news.fileName;
    let newFileType = news.fileType;

    // 새로운 파일이 제공된 경우
    if (file) {
      // 기존 S3 파일 삭제
      if (news.fileKey) {
        await this.uploadService.deleteFile(news.fileKey);
      }

      // 새 파일 업로드
      const uploadResult = await this.uploadService.uploadFile(file, 'news');
      newFileKey = uploadResult.key;
      newFileName = file.originalname;
      newFileType = file.mimetype;
    }

    try {
      const updatedNews = await this.newsModel
        .findByIdAndUpdate(
          id,
          {
            ...updateNewsDto,
            fileKey: newFileKey,
            fileName: newFileName,
            fileType: newFileType,
          },
          { new: true, runValidators: true },
        )
        .populate('author', 'name department')
        .exec();

    if (!updatedNews) {
      throw new NotFoundException('뉴스를 찾을 수 없습니다.');
    }

      return {
        _id: updatedNews._id,
        title: updatedNews.title,
        content: updatedNews.content,
        category: updatedNews.category,
        author: updatedNews.author,
        fileUrl: newFileKey ? this.uploadService.getFileUrl(newFileKey) : null,
        fileName: updatedNews.fileName,
        fileType: updatedNews.fileType,
        createdAt: updatedNews.createdAt,
        updatedAt: updatedNews.updatedAt,
      };
    } catch (error) {
      // 업데이트 실패 시 새로 업로드한 파일 삭제
      if (file && newFileKey !== news.fileKey) {
        await this.uploadService.deleteFile(newFileKey);
      }
      throw error;
    }
  }

  /**
   * 뉴스 삭제 (S3 파일도 함께 삭제)
   */
  async remove(id: string): Promise<void> {
    const news = await this.newsModel.findById(id).exec();

    if (!news) {
      throw new NotFoundException('삭제할 뉴스를 찾을 수 없습니다.');
    }

    // S3에서 파일 삭제 (있는 경우)
    if (news.fileKey) {
      await this.uploadService.deleteFile(news.fileKey);
    }

    // MongoDB에서 뉴스 문서 삭제
    await news.deleteOne();
  }
}