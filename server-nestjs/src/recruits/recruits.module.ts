// server-nestjs/src/recruits/recruits.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecruitsController } from './recruits.controller';
import { RecruitsService } from './recruits.service';
import { Recruit, RecruitSchema } from './schemas/recruits.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recruit.name, schema: RecruitSchema }]),
    AuthModule, // JWT 인증을 위해
  ],
  controllers: [RecruitsController],
  providers: [RecruitsService],
  exports: [RecruitsService],
})
export class RecruitsModule {}