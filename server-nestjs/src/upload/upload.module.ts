// server-nestjs/src/upload/upload.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

@Module({
  imports: [ConfigModule], // [개선 6] 필수!
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService], // 다른 모듈에서 사용 가능
})
export class UploadModule {}