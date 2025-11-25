// server-nestjs/src/profiles/profiles.controller.ts
import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ProfilesService } from './profiles.service';
  import { CreateProfileDto } from './dto/create-profile.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { AdminGuard } from '../auth/guards/admin.guard';
  
  @Controller('profiles')
  export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) {}
  
    @Get()
    async findAll() {
      return this.profilesService.findAll();
    }
  
    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('photo'))
    async create(
      @Body() createProfileDto: CreateProfileDto,
      @UploadedFile() photo?: Express.Multer.File,
    ) {
      if (photo && photo.size > 5 * 1024 * 1024) {
        throw new BadRequestException('파일 크기는 5MB를 초과할 수 없습니다.');
      }
  
      return this.profilesService.create(createProfileDto, photo);
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async remove(@Param('id') id: string) {
      await this.profilesService.remove(id);
      return { message: '프로필 삭제 완료' };
    }
  }