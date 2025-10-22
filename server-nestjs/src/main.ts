// server-nestjs/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정 (프론트엔드와 통신)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // DTO 유효성 검사 전역 설정
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true, // DTO에 정의되지 않은 속성 제거
      // forbidNonWhitelisted: false, // 👈 [수정] true -> false로 변경
      transform: true, // 타입 자동 변환
      transformOptions: {
        enableImplicitConversion: true, // 👈 [추가] 암시적 타입 변환 활성화
      },
    }),
  );

  // Nest.js 서버는 포트 4002 사용 (Express는 4001)
  const port = process.env.PORT || 4002;
  await app.listen(port);
  console.log(`🚀 Nest.js 서버 실행 중: http://localhost:${port}`);
}
bootstrap();