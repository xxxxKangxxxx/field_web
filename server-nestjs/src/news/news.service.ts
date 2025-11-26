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
  async findAll(category?: string): Promise<any[]> {
    const filter = category ? { category } : {};
    
    const newsList = await this.newsModel
      .find(filter)
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
      try {
        // 파일명 인코딩 문제 해결
        let decodedFileName = file.originalname;
        
        // 여러 인코딩 방식 시도
        try {
          // 1. URL 디코딩 시도
          decodedFileName = decodeURIComponent(file.originalname);
        } catch (e) {
          // 2. Buffer를 사용한 UTF-8 디코딩 시도
          try {
            // 파일명이 잘못 인코딩된 경우를 대비해 Buffer로 변환 후 디코딩
            const buffer = Buffer.from(file.originalname, 'latin1');
            decodedFileName = buffer.toString('utf8');
          } catch (e2) {
            // 3. 모든 시도 실패 시 원본 사용
            decodedFileName = file.originalname;
          }
        }
        
        console.log('원본 파일명:', file.originalname);
        console.log('디코딩된 파일명:', decodedFileName);
        console.log('파일 업로드 시작:', decodedFileName, file.size, 'bytes');
        
        const uploadResult = await this.uploadService.uploadFile(file, 'news');
        fileKey = uploadResult.key;
        fileName = decodedFileName;
        fileType = file.mimetype;
        console.log('파일 업로드 완료:', fileKey);
      } catch (error) {
        console.error('파일 업로드 실패:', error);
        throw error;
      }
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
      // 파일명 인코딩 문제 해결
      let decodedFileName = file.originalname;
      
      // 여러 인코딩 방식 시도
      try {
        // 1. URL 디코딩 시도
        decodedFileName = decodeURIComponent(file.originalname);
      } catch (e) {
        // 2. Buffer를 사용한 UTF-8 디코딩 시도
        try {
          // 파일명이 잘못 인코딩된 경우를 대비해 Buffer로 변환 후 디코딩
          const buffer = Buffer.from(file.originalname, 'latin1');
          decodedFileName = buffer.toString('utf8');
        } catch (e2) {
          // 3. 모든 시도 실패 시 원본 사용
          decodedFileName = file.originalname;
        }
      }
      
      const uploadResult = await this.uploadService.uploadFile(file, 'news');
      newFileKey = uploadResult.key;
      newFileName = decodedFileName;
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