// server-nestjs/src/upload/upload.controller.ts

import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
    UseGuards,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { UploadService } from './upload.service';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // TODO: Auth 모듈 구현 후 활성화
  
  @Controller('upload')
  @UseGuards(JwtAuthGuard) // TODO: Auth 모듈 구현 후 활성화 (현재는 주석)
  export class UploadController {
    constructor(private readonly uploadService: UploadService) {}
  
    /**
     * 테스트용 파일 업로드
     * POST /upload/test
     */
    @Post('test')
    @UseInterceptors(FileInterceptor('file'))
    async uploadTestFile(
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
            new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|png|gif)$/ }),
          ],
        }),
      )
      file: Express.Multer.File,
    ) {
      if (!file) {
        throw new BadRequestException('파일이 업로드되지 않았습니다.');
      }
  
      // [개선 1] { key, url } 객체 받기
      const { key, url } = await this.uploadService.uploadFile(file, 'test');
  
      return {
        message: '파일 업로드 성공',
        key, // DB에 저장할 값
        url, // 미리보기용 전체 URL
      };
    }
  
    /**
     * 캠프 포스터 업로드
     * POST /upload/camp
     */
    @Post('camp')
    @UseInterceptors(FileInterceptor('file'))
    async uploadCampPoster(
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
            new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|png|gif)$/ }),
          ],
        }),
      )
      file: Express.Multer.File,
    ) {
      const { key, url } = await this.uploadService.uploadFile(file, 'camps');
  
      return {
        message: '캠프 포스터 업로드 성공',
        key, // DB에 저장
        url, // 미리보기
      };
    }
  
    /**
     * 뉴스 이미지 업로드
     * POST /upload/news
     */
    @Post('news')
    @UseInterceptors(FileInterceptor('file'))
    async uploadNewsImage(
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
            new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|png|gif)$/ }),
          ],
        }),
      )
      file: Express.Multer.File,
    ) {
      const { key, url } = await this.uploadService.uploadFile(file, 'news');
  
      return {
        message: '뉴스 이미지 업로드 성공',
        key, // DB에 저장
        url, // 미리보기
      };
    }
  }