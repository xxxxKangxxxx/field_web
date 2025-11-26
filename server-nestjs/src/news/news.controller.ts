// server-nestjs/src/news/news.controller.ts
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Request,
    BadRequestException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { NewsService } from './news.service';
  import { CreateNewsDto, UpdateNewsDto } from './dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { AdminGuard } from '../auth/guards/admin.guard';
  import { Request as ExpressRequest } from 'express'; // 👈 [수정 1] Express Request 타입 임포트
  import { JwtPayload } from '../auth/strategies/jwt.strategy'; // 👈 [수정 2] JwtPayload 타입 임포트
  
  // 👈 [수정 3] req.user 타입을 포함하는 커스텀 Request 타입 정의
  interface RequestWithUser extends ExpressRequest {
    user: JwtPayload;
  }
  
  @Controller('news')
  export class NewsController {
    constructor(private readonly newsService: NewsService) {}
  
    /**
     * 모든 뉴스 조회
     * GET /news
     * 공개 API (인증 불필요)
     */
    @Get()
    async findAll(@Query('category') category?: string) {
      return this.newsService.findAll(category);
    }
  
    /**
     * 특정 뉴스 조회
     * GET /news/:id
     * 공개 API (인증 불필요)
     */
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.newsService.findOne(id);
    }
  
    /**
     * 뉴스 생성
     * POST /news
     * 관리자 전용 (JWT + Admin Guard)
     * 파일 업로드 선택사항 (최대 10MB)
     */
    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('file'))
    async create(
      @Body() createNewsDto: CreateNewsDto,
      @Request() req: RequestWithUser,
      @UploadedFile() file?: Express.Multer.File,
    ) {
      console.log('뉴스 생성 요청 받음');
      console.log('요청 본문:', createNewsDto);
      
      // 파일명 인코딩 문제 해결
      if (file) {
        // 파일명이 latin1로 잘못 인코딩된 경우를 UTF-8로 변환
        try {
          const buffer = Buffer.from(file.originalname, 'latin1');
          file.originalname = buffer.toString('utf8');
        } catch (e) {
          // 변환 실패 시 원본 사용
          console.warn('파일명 인코딩 변환 실패:', e);
        }
        
        console.log('파일 정보:', {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          fieldname: file.fieldname
        });

        // 파일 크기 검증 (10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new BadRequestException('파일 크기는 10MB를 초과할 수 없습니다.');
        }
      } else {
        console.log('파일 없음');
      }
  
      return this.newsService.create(createNewsDto, req.user.id, file);
    }
  
    /**
     * 뉴스 수정
     * PUT /news/:id
     * 관리자 전용 (JWT + Admin Guard)
     * 파일 업로드 선택사항 (최대 10MB)
     */
    @Put(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('file'))
    async update(
      @Param('id') id: string,
      @Body() updateNewsDto: UpdateNewsDto,
      @UploadedFile() file?: Express.Multer.File,
    ) {
      console.log('뉴스 수정 요청 받음:', id);
      console.log('요청 본문:', updateNewsDto);
      
      // 파일명 인코딩 문제 해결
      if (file) {
        // 파일명이 latin1로 잘못 인코딩된 경우를 UTF-8로 변환
        try {
          const buffer = Buffer.from(file.originalname, 'latin1');
          file.originalname = buffer.toString('utf8');
        } catch (e) {
          // 변환 실패 시 원본 사용
          console.warn('파일명 인코딩 변환 실패:', e);
        }
        
        console.log('파일 정보:', {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          fieldname: file.fieldname
        });

        // 파일 크기 검증 (10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new BadRequestException('파일 크기는 10MB를 초과할 수 없습니다.');
        }
      } else {
        console.log('파일 없음');
      }
  
      return this.newsService.update(id, updateNewsDto, file);
    }
  
    /**
     * 뉴스 삭제
     * DELETE /news/:id
     * 관리자 전용 (JWT + Admin Guard)
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async remove(@Param('id') id: string) {
      await this.newsService.remove(id);
      return { message: '뉴스가 삭제되었습니다.' };
    }
  }