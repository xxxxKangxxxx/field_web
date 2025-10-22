// server-nestjs/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CampsModule } from './camps/camps.module';
import { NewsModule } from './news/news.module';
import { RecruitsModule } from './recruits/recruits.module';

@Module({
  imports: [
    // 환경변수 전역 설정
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MongoDB 연결 설정
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),

    // 기능 모듈들
    UploadModule,
    UsersModule,
    AuthModule,
    CampsModule,
    NewsModule,
    RecruitsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}