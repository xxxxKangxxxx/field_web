// server-nestjs/src/camps/camps.controller.ts
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { CampsService } from './camps.service';
  import { CreateCampDto, UpdateCampDto } from './dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { AdminGuard } from '../auth/guards/admin.guard';
  
  @Controller('camps')
  export class CampsController {
    constructor(private readonly campsService: CampsService) {}
  
    /**
     * 모든 캠프 조회
     * GET /camps
     * 공개 API (인증 불필요)
     */
    @Get()
    async findAll() {
      return this.campsService.findAll();
    }
  
    /**
     * 특정 캠프 조회
     * GET /camps/:id
     * 공개 API (인증 불필요)
     */
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.campsService.findOne(id);
    }
  
    /**
     * 캠프 생성
     * POST /camps
     * 관리자 전용 (JWT + Admin Guard)
     */
    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('posterImage'))
    async create(
        @Body() createCampDto: CreateCampDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
                    new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|png|gif)$/ }),
                ],
            }),
        )
        posterFile: Express.Multer.File,
    ) {

        if (typeof createCampDto.timeline === 'string') {
            try {
                createCampDto.timeline = JSON.parse(createCampDto.timeline as any);
            } catch (error) {
                throw new BadRequestException('timeline 형식이 올바르지 않습니다.');
            }
        }
        return this.campsService.create(createCampDto, posterFile);
    }
  
    /**
     * 캠프 수정
     * PUT /camps/:id
     * 관리자 전용 (JWT + Admin Guard)
     */
    @Put(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('posterImage'))
    async update(
      @Param('id') id: string,
      @Body() updateCampDto: UpdateCampDto,
      @UploadedFile()
      posterFile?: Express.Multer.File,
    ) {
      // 파일이 있는 경우 검증
      if (posterFile) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (posterFile.size > maxSize) {
          throw new BadRequestException('파일 크기는 5MB를 초과할 수 없습니다.');
        }
  
        const allowedTypes = /^image\/(jpeg|jpg|png|gif)$/;
        if (!allowedTypes.test(posterFile.mimetype)) {
          throw new BadRequestException('이미지 파일만 업로드 가능합니다.');
        }
      }
  
      // timeline이 문자열로 들어온 경우 파싱
      if (updateCampDto.timeline && typeof updateCampDto.timeline === 'string') {
        try {
          updateCampDto.timeline = JSON.parse(updateCampDto.timeline as any);
        } catch (error) {
          throw new BadRequestException('timeline 형식이 올바르지 않습니다.');
        }
      }
  
      // 숫자 필드 변환
      if (updateCampDto.year && typeof updateCampDto.year === 'string') {
        updateCampDto.year = parseInt(updateCampDto.year as any, 10);
      }
      if (
        updateCampDto.participants &&
        typeof updateCampDto.participants === 'string'
      ) {
        updateCampDto.participants = parseInt(
          updateCampDto.participants as any,
          10,
        );
      }
  
      return this.campsService.update(id, updateCampDto, posterFile);
    }
  
    /**
     * 캠프 삭제
     * DELETE /camps/:id
     * 관리자 전용 (JWT + Admin Guard)
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async remove(@Param('id') id: string) {
      await this.campsService.remove(id);
      return { message: '캠프가 삭제되었습니다.' };
    }
  }