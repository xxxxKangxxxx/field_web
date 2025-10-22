// server-nestjs/src/camps/camps.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampsController } from './camps.controller';
import { CampsService } from './camps.service';
import { Camp, CampSchema } from './schemas/camp.schema';
import { UploadModule } from '../upload/upload.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Camp.name, schema: CampSchema }]),
    UploadModule, // S3 업로드를 위해
    AuthModule, // JWT 인증을 위해
  ],
  controllers: [CampsController],
  providers: [CampsService],
  exports: [CampsService],
})
export class CampsModule {}