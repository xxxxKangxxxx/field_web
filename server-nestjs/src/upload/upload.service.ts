// server-nestjs/src/upload/upload.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;
  private readonly s3BaseUrl: string;

  constructor(private configService: ConfigService) {
    this.region = this.configService.get('AWS_REGION', 'ap-northeast-2');
    this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME', '');
    this.s3BaseUrl = this.configService.get(
      'AWS_S3_PUBLIC_BASE_URL',
      `https://${this.bucketName}.s3.${this.region}.amazonaws.com`,
    );

    const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');

    // S3ClientConfig 타입 명시
    const s3ClientConfig: S3ClientConfig = {
      region: this.region,
    };

    // 둘 다 존재할 때만 credentials 추가
    if (accessKeyId && secretAccessKey) {
      s3ClientConfig.credentials = {
        accessKeyId,
        secretAccessKey,
      };
    }

    this.s3Client = new S3Client(s3ClientConfig);
  }

  /**
   * 파일을 S3에 업로드
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{ key: string; url: string | null }> {
    // S3 설정 확인
    if (!this.bucketName) {
      console.error('AWS_S3_BUCKET_NAME이 설정되지 않았습니다.');
      throw new Error('S3 버킷 이름이 설정되지 않았습니다.');
    }

    const uniqueSuffix =
      Date.now() + '-' + Math.random().toString(36).substring(7);
    const fileExtension = path.extname(file.originalname);
    const key = `${folder}/${uniqueSuffix}${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      console.log(`S3 업로드 시도: ${this.bucketName}/${key}`);
      await this.s3Client.send(command);
      console.log(`S3 업로드 성공: ${key}`);
      const fileUrl = this.getFileUrl(key);
      return { key, url: fileUrl };
    } catch (error) {
      console.error('S3 업로드 실패:', error);
      console.error('에러 상세:', {
        message: error.message,
        code: error.code,
        bucketName: this.bucketName,
        key: key,
      });
      throw new Error(`파일 업로드 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  /**
   * S3에서 파일 삭제
   */
  async deleteFile(key: string): Promise<void> {
    if (!key) {
      return;
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      // 에러 처리
    }
  }

  /**
   * S3 파일의 공개 URL 생성
   */
  getFileUrl(key: string): string | null {
    if (!key) return null;
    return `${this.s3BaseUrl}/${key}`;
  }
}