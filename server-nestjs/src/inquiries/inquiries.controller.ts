// server-nestjs/src/inquiries/inquiries.controller.ts
import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { Request as ExpressRequest } from 'express';
  import { InquiriesService } from './inquiries.service';
  import { CreateInquiryDto } from './dto/create-inquiry.dto';
  import { UpdateStatusDto } from './dto/update-status.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { AdminGuard } from '../auth/guards/admin.guard';
  import { JwtPayload } from '../auth/strategies/jwt.strategy';

  interface RequestWithUser extends ExpressRequest {
    user: JwtPayload; // Strategy의 validate()가 반환하는 값의 타입
  }
  
  @Controller('inquiries')
  export class InquiriesController {
    constructor(private readonly inquiriesService: InquiriesService) {}
  
    @Get()
    @UseGuards(JwtAuthGuard, AdminGuard)
    async findAll() {
      return this.inquiriesService.findAll();
    }
  
    @Get('my')
    @UseGuards(JwtAuthGuard)
    async findMy(@Request() req: RequestWithUser) {
      return this.inquiriesService.findByEmail(req.user.email);
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.inquiriesService.findOne(id);
    }
  
    @Post()
    async create(@Body() createInquiryDto: CreateInquiryDto) {
      return this.inquiriesService.create(createInquiryDto);
    }
  
    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async updateStatus(
      @Param('id') id: string,
      @Body() updateStatusDto: UpdateStatusDto,
    ) {
      return this.inquiriesService.updateStatus(id, updateStatusDto);
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async remove(@Param('id') id: string) {
      await this.inquiriesService.remove(id);
      return { message: '문의사항이 성공적으로 삭제되었습니다.' };
    }
  }