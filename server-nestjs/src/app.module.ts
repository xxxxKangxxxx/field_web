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
import { ContactsModule } from './contacts/contacts.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ProfilesModule } from './profiles/profiles.module';
import { QuestionsModule } from './questions/questions.module';

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
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        if (!uri) {
          throw new Error('MONGO_URI가 .env 파일에 설정되지 않았습니다!');
        }
        
        // URI에 이미 authSource가 포함되어 있으면 옵션에서 제거
        // Mongoose는 URI의 쿼리 파라미터를 우선시하므로 옵션과 중복되면 충돌할 수 있음
        const options: any = {
          // 연결 옵션
          retryWrites: true,
          w: 'majority',
          // 연결 풀 설정
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        };
        
        // URI에 authSource가 없을 때만 옵션으로 추가
        if (!uri.includes('authSource=')) {
          options.authSource = 'admin';
        }
        
        return {
          uri,
          ...options,
        };
      },
    }),

    // 기능 모듈들
    UploadModule,
    UsersModule,
    AuthModule,
    CampsModule,
    NewsModule,
    RecruitsModule,
    ContactsModule,
    InquiriesModule,
    ReviewsModule,
    ProfilesModule,
    QuestionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}