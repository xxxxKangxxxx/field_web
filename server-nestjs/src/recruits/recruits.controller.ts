// server-nestjs/src/recruits/recruits.controller.ts
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    BadRequestException,
  } from '@nestjs/common';
  import { RecruitsService } from './recruits.service';
  import { CreateRecruitDto, UpdateRecruitDto } from './dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { AdminGuard } from '../auth/guards/admin.guard';
  
  @Controller('recruits')
  export class RecruitsController {
    constructor(private readonly recruitsService: RecruitsService) {}
  
    /**
     * 모든 모집 일정 조회
     * GET /recruits
     * 공개 API (인증 불필요)
     */
    @Get()
    async findAll() {
      return this.recruitsService.findAll();
    }
  
    /**
     * 활성화된 모집 일정 조회
     * GET /recruits/active
     * 공개 API (인증 불필요)
     */
    @Get('active')
    async findActive() {
      return this.recruitsService.findActive();
    }
  
    /**
     * 특정 모집 일정 조회
     * GET /recruits/:id
     * 공개 API (인증 불필요)
     */
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.recruitsService.findOne(id);
    }
  
    /**
     * 모집 일정 생성
     * POST /recruits
     * 관리자 전용 (JWT + Admin Guard)
     */
    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    async create(@Body() createRecruitDto: CreateRecruitDto) {
      // schedules가 문자열로 들어온 경우 파싱
      if (typeof createRecruitDto.schedules === 'string') {
        try {
          createRecruitDto.schedules = JSON.parse(
            createRecruitDto.schedules as any,
          );
        } catch (error) {
          throw new BadRequestException('schedules 형식이 올바르지 않습니다.');
        }
      }
  
      return this.recruitsService.create(createRecruitDto);
    }
  
    /**
     * 모집 일정 수정
     * PUT /recruits/:id
     * 관리자 전용 (JWT + Admin Guard)
     */
    @Put(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async update(
      @Param('id') id: string,
      @Body() updateRecruitDto: UpdateRecruitDto,
    ) {
      // schedules가 문자열로 들어온 경우 파싱
      if (
        updateRecruitDto.schedules &&
        typeof updateRecruitDto.schedules === 'string'
      ) {
        try {
          updateRecruitDto.schedules = JSON.parse(
            updateRecruitDto.schedules as any,
          );
        } catch (error) {
          throw new BadRequestException('schedules 형식이 올바르지 않습니다.');
        }
      }
  
      return this.recruitsService.update(id, updateRecruitDto);
    }
  
    /**
     * 모집 일정 삭제
     * DELETE /recruits/:id
     * 관리자 전용 (JWT + Admin Guard)
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async remove(@Param('id') id: string) {
      await this.recruitsService.remove(id);
      return { message: '모집 일정이 삭제되었습니다.' };
    }
  }