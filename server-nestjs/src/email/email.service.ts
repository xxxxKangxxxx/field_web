// server-nestjs/src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private sesClient: SESv2Client | null = null;

  constructor(private configService: ConfigService) {
    // EMAIL_PROVIDER가 'ses'일 때만 SES 클라이언트 초기화
    const emailProvider = this.configService.get<string>('EMAIL_PROVIDER', 'smtp');
    
    if (emailProvider === 'ses') {
      const region = this.configService.get<string>('AWS_SES_REGION', 'ap-northeast-2');
      this.sesClient = new SESv2Client({ region });
    }
  }

  /**
   * Transporter 초기화 (필요할 때만)
   */
  private getTransporter(): nodemailer.Transporter {
    if (!this.transporter) {
      const smtpUser = this.configService.get<string>('SMTP_USER');
      const smtpPass = this.configService.get<string>('SMTP_PASS');
      
      if (!smtpUser || !smtpPass) {
        throw new Error('SMTP 설정이 필요합니다. SMTP_USER와 SMTP_PASS를 .env 파일에 설정해주세요.');
      }

      // 개발 환경에서는 Gmail SMTP 또는 다른 SMTP 서버 사용
      // 프로덕션에서는 AWS SES 사용 권장
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com'),
        port: this.configService.get<number>('SMTP_PORT', 587),
        secure: false, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    }
    return this.transporter;
  }

  /**
   * 6자리 인증번호 생성
   */
  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * 인증번호 이메일 발송
   */
  async sendVerificationEmail(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    const emailProvider = this.configService.get<string>('EMAIL_PROVIDER', 'smtp');
    
    if (emailProvider === 'ses') {
      // AWS SES 사용
      await this.sendViaSES(email, verificationCode);
    } else {
      // 기존 SMTP 사용
      await this.sendViaSMTP(email, verificationCode);
    }
  }

  /**
   * AWS SES를 통한 이메일 발송
   */
  private async sendViaSES(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    if (!this.sesClient) {
      throw new Error('SES 클라이언트가 초기화되지 않았습니다.');
    }

    const fromEmail = this.configService.get<string>(
      'AWS_SES_FROM_EMAIL',
      'noreply@iefield.com',
    );

    const params = {
      FromEmailAddress: fromEmail,
      Destination: {
        ToAddresses: [email],
      },
      Content: {
        Simple: {
          Subject: {
            Data: '[FIELD] 이메일 인증번호',
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #333;">이메일 인증</h2>
                  <p>안녕하세요, FIELD입니다.</p>
                  <p>회원가입을 위한 이메일 인증번호는 다음과 같습니다:</p>
                  <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                    <h1 style="color: #FFD700; font-size: 32px; margin: 0; letter-spacing: 8px;">${verificationCode}</h1>
                  </div>
                  <p style="color: #666; font-size: 12px;">이 인증번호는 5분간 유효합니다.</p>
                  <p style="color: #666; font-size: 12px;">본인이 요청하지 않은 경우 이 메일을 무시하셔도 됩니다.</p>
                </div>
              `,
              Charset: 'UTF-8',
            },
          },
        },
      },
    };

    try {
      const command = new SendEmailCommand(params);
      await this.sesClient.send(command);
    } catch (error) {
      console.error('SES 이메일 발송 실패:', error);
      throw new Error('이메일 발송에 실패했습니다.');
    }
  }

  /**
   * SMTP를 통한 이메일 발송
   */
  private async sendViaSMTP(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('SMTP_FROM', 'noreply@iefield.com'),
      to: email,
      subject: '[FIELD] 이메일 인증번호',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">이메일 인증</h2>
          <p>안녕하세요, FIELD입니다.</p>
          <p>회원가입을 위한 이메일 인증번호는 다음과 같습니다:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #FFD700; font-size: 32px; margin: 0; letter-spacing: 8px;">${verificationCode}</h1>
          </div>
          <p style="color: #666; font-size: 12px;">이 인증번호는 5분간 유효합니다.</p>
          <p style="color: #666; font-size: 12px;">본인이 요청하지 않은 경우 이 메일을 무시하셔도 됩니다.</p>
        </div>
      `,
    };

    try {
      const transporter = this.getTransporter();
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('이메일 발송 실패:', error);
      throw new Error('이메일 발송에 실패했습니다.');
    }
  }
}

