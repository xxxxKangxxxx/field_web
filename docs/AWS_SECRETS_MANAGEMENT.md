# 🔐 AWS Secrets 관리 가이드 (SSM Parameter Store)

## 🚨 중요: 프로덕션 비밀번호 관리

**절대 금지**: EC2 인스턴스의 `.env` 파일에 비밀번호 저장  
**권장 방식**: AWS Systems Manager (SSM) Parameter Store 사용

---

## 📋 목차

1. [SSM Parameter Store 설정](#1-ssm-parameter-store-설정)
2. [IAM 역할 권한 추가](#2-iam-역할-권한-추가)
3. [시작 스크립트 수정](#3-시작-스크립트-수정)
4. [Nest.js AWS SDK 설정](#4-nestjs-aws-sdk-설정)
5. [보안 검증](#5-보안-검증)

---

## 1. SSM Parameter Store 설정

### 1-1. AWS Console에서 Parameter 생성

1. **AWS Console > Systems Manager > Parameter Store**

2. **파라미터 생성 클릭**

#### 파라미터 1: MongoDB URI

```
이름: /field/prod/mongodb-uri
유형: SecureString (암호화)
KMS 키: alias/aws/ssm (기본값)
값: mongodb+srv://field_admin:YOUR_PASSWORD@field-cluster.xxxxx.mongodb.net/field_db?retryWrites=true&w=majority
설명: MongoDB Atlas connection string for production
```

#### 파라미터 2: JWT Secret

```
이름: /field/prod/jwt-secret
유형: SecureString
KMS 키: alias/aws/ssm
값: your-super-strong-random-jwt-secret-key-min-32-chars
설명: JWT signing secret for authentication
```

#### 파라미터 3: AWS S3 Bucket Name

```
이름: /field/prod/s3-bucket-name
유형: String (일반 문자열)
값: field-uploads-prod
설명: S3 bucket name for file uploads
```

#### 파라미터 4: Node Environment

```
이름: /field/prod/node-env
유형: String
값: production
설명: Node.js environment setting
```

### 1-2. AWS CLI로 Parameter 생성 (선택 사항)

```bash
# MongoDB URI (SecureString)
aws ssm put-parameter \
  --name "/field/prod/mongodb-uri" \
  --value "mongodb+srv://field_admin:YOUR_PASSWORD@field-cluster.xxxxx.mongodb.net/field_db?retryWrites=true&w=majority" \
  --type "SecureString" \
  --description "MongoDB Atlas connection string" \
  --region ap-northeast-2

# JWT Secret (SecureString)
aws ssm put-parameter \
  --name "/field/prod/jwt-secret" \
  --value "your-super-strong-random-jwt-secret-key-min-32-chars" \
  --type "SecureString" \
  --description "JWT signing secret" \
  --region ap-northeast-2

# S3 Bucket Name (String)
aws ssm put-parameter \
  --name "/field/prod/s3-bucket-name" \
  --value "field-uploads-prod" \
  --type "String" \
  --description "S3 bucket name" \
  --region ap-northeast-2

# Node Environment (String)
aws ssm put-parameter \
  --name "/field/prod/node-env" \
  --value "production" \
  --type "String" \
  --description "Node.js environment" \
  --region ap-northeast-2
```

---

## 2. IAM 역할 권한 추가

### 2-1. EC2 IAM 역할 수정

`AWS_SETUP_GUIDE_PART2.md`의 4-7에서 생성한 `field-ec2-role`에 SSM 권한 추가:

1. **IAM > 역할 > field-ec2-role 선택**

2. **권한 추가 > 정책 연결**

3. **정책 생성 (커스텀)**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter",
        "ssm:GetParameters",
        "ssm:GetParametersByPath"
      ],
      "Resource": [
        "arn:aws:ssm:ap-northeast-2:*:parameter/field/prod/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt"
      ],
      "Resource": [
        "arn:aws:kms:ap-northeast-2:*:key/*"
      ],
      "Condition": {
        "StringEquals": {
          "kms:ViaService": [
            "ssm.ap-northeast-2.amazonaws.com"
          ]
        }
      }
    }
  ]
}
```

4. **정책 이름**: `FieldSSMReadPolicy`

5. **field-ec2-role에 연결**

### 2-2. 최종 IAM 역할 권한 목록

`field-ec2-role`에 연결된 정책:
- ✅ `AmazonEC2ContainerRegistryReadOnly` (ECR 이미지 pull)
- ✅ `CloudWatchLogsFullAccess` (로그 전송)
- ✅ `FieldSSMReadPolicy` (SSM Parameter 읽기) ⭐ 새로 추가

---

## 3. 시작 스크립트 수정

### 3-1. SSM에서 Parameter 가져오기

`/opt/field-app/start.sh` 파일을 다음과 같이 수정:

```bash
#!/bin/bash
set -e

cd /opt/field-app

# AWS 리전 설정
AWS_REGION="ap-northeast-2"

echo "📦 SSM Parameter Store에서 환경변수 가져오는 중..."

# SSM에서 파라미터 가져오기
MONGO_URI=$(aws ssm get-parameter \
  --name "/field/prod/mongodb-uri" \
  --with-decryption \
  --region $AWS_REGION \
  --query "Parameter.Value" \
  --output text)

JWT_SECRET=$(aws ssm get-parameter \
  --name "/field/prod/jwt-secret" \
  --with-decryption \
  --region $AWS_REGION \
  --query "Parameter.Value" \
  --output text)

S3_BUCKET_NAME=$(aws ssm get-parameter \
  --name "/field/prod/s3-bucket-name" \
  --region $AWS_REGION \
  --query "Parameter.Value" \
  --output text)

NODE_ENV=$(aws ssm get-parameter \
  --name "/field/prod/node-env" \
  --region $AWS_REGION \
  --query "Parameter.Value" \
  --output text)

echo "✅ 환경변수 로드 완료"

# ECR 로그인 (IAM 역할 자동 사용)
echo "🔐 ECR 로그인 중..."
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin [AWS-ACCOUNT-ID].dkr.ecr.$AWS_REGION.amazonaws.com

# 최신 이미지 pull
echo "📥 최신 Docker 이미지 다운로드 중..."
docker pull [AWS-ACCOUNT-ID].dkr.ecr.$AWS_REGION.amazonaws.com/field-nestjs:latest

# 기존 컨테이너 중지 및 제거
echo "🛑 기존 컨테이너 중지 중..."
docker stop field-nestjs 2>/dev/null || true
docker rm field-nestjs 2>/dev/null || true

# 새 컨테이너 실행 (환경변수 직접 주입, .env 파일 사용 안 함!)
echo "🚀 새 컨테이너 시작 중..."
docker run -d \
  --name field-nestjs \
  --restart unless-stopped \
  -p 4002:4002 \
  -e NODE_ENV="$NODE_ENV" \
  -e PORT=4002 \
  -e MONGO_URI="$MONGO_URI" \
  -e JWT_SECRET="$JWT_SECRET" \
  -e JWT_EXPIRES_IN="7d" \
  -e AWS_REGION="$AWS_REGION" \
  -e AWS_S3_BUCKET_NAME="$S3_BUCKET_NAME" \
  --log-driver=awslogs \
  --log-opt awslogs-group=/aws/ec2/field-nestjs \
  --log-opt awslogs-region=$AWS_REGION \
  --log-opt awslogs-stream=$(hostname) \
  [AWS-ACCOUNT-ID].dkr.ecr.$AWS_REGION.amazonaws.com/field-nestjs:latest

echo "✅ Nest.js 서버 시작 완료"
echo "📊 로그 확인: docker logs field-nestjs -f"
```

### 3-2. 스크립트 배포

SSH로 EC2 인스턴스에 접속하여 위 스크립트로 업데이트:

```bash
ssh -i field-keypair.pem ec2-user@[인스턴스-IP]

# 기존 .env 파일 삭제 (보안)
sudo rm -f /opt/field-app/.env

# start.sh 수정
sudo nano /opt/field-app/start.sh
# (위 내용 붙여넣기 후 저장)

# 실행 권한 확인
sudo chmod +x /opt/field-app/start.sh

# 테스트 실행
sudo /opt/field-app/start.sh
```

---

## 4. Nest.js AWS SDK 설정

### 4-1. IAM 역할 자동 사용

Nest.js 앱에서 S3 업로드 시 **AWS_ACCESS_KEY를 절대 사용하지 마세요**.  
EC2 인스턴스의 IAM 역할이 자동으로 사용됩니다.

#### 올바른 S3 Client 설정 (server-nestjs)

```typescript
// server-nestjs/src/upload/upload.service.ts

import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;

  constructor(private configService: ConfigService) {
    // AWS_ACCESS_KEY 필요 없음! IAM 역할이 자동으로 사용됨
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION', 'ap-northeast-2'),
      // credentials 옵션 없음 = IAM 역할 자동 사용
    });
  }

  // S3 업로드 로직...
}
```

### 4-2. 환경변수 제거

`server-nestjs/.env.example`에서 AWS 자격 증명 제거:

```env
# 서버 설정
PORT=4002
NODE_ENV=production

# MongoDB (SSM Parameter Store에서 가져옴)
# MONGO_URI는 환경변수로 주입되므로 여기 불필요

# JWT (SSM Parameter Store에서 가져옴)
# JWT_SECRET는 환경변수로 주입되므로 여기 불필요

# AWS S3 설정 (IAM 역할 자동 사용)
AWS_REGION=ap-northeast-2
# AWS_S3_BUCKET_NAME은 SSM에서 가져옴

# ❌ 절대 포함하지 말 것:
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
```

---

## 5. 보안 검증

### 5-1. EC2 인스턴스 점검

```bash
# EC2 인스턴스 접속
ssh -i field-keypair.pem ec2-user@[인스턴스-IP]

# .env 파일 존재 여부 확인 (없어야 정상)
ls -la /opt/field-app/.env
# 출력: No such file or directory (정상)

# Docker 컨테이너 환경변수 확인 (값 노출 주의)
docker inspect field-nestjs --format='{{range .Config.Env}}{{println .}}{{end}}' | grep -E 'MONGO|JWT'
# MONGO_URI와 JWT_SECRET이 올바르게 설정되었는지 확인
```

### 5-2. SSM Parameter 접근 테스트

```bash
# EC2 인스턴스에서 SSM Parameter 가져오기 테스트
aws ssm get-parameter \
  --name "/field/prod/mongodb-uri" \
  --with-decryption \
  --region ap-northeast-2

# 성공 시 JSON 형식으로 Parameter 값 반환
```

### 5-3. S3 업로드 테스트 (IAM 역할 확인)

```bash
# EC2 인스턴스에서 S3 업로드 테스트
echo "test file" > /tmp/test.txt
aws s3 cp /tmp/test.txt s3://field-uploads-prod/test/test.txt

# 성공 시: upload: /tmp/test.txt to s3://field-uploads-prod/test/test.txt
```

---

## 📊 비교: 기존 vs 개선

### ❌ 기존 방식 (보안 위험)

```bash
# /opt/field-app/.env 파일
MONGO_URI=mongodb+srv://user:PASSWORD@...
JWT_SECRET=my-secret
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI...
```

**위험**:
- SSH 접근 가능한 사람 누구나 비밀번호 탈취 가능
- 비밀번호 변경 시 모든 인스턴스 수동 업데이트 필요
- Git에 실수로 커밋될 위험
- AWS Access Key 하드코딩 (IAM 역할 무용지물)

### ✅ 개선 방식 (SSM Parameter Store)

```bash
# SSM Parameter Store (중앙 관리)
/field/prod/mongodb-uri (SecureString, 암호화)
/field/prod/jwt-secret (SecureString, 암호화)
/field/prod/s3-bucket-name (String)

# EC2 인스턴스
- .env 파일 없음
- IAM 역할로 SSM 접근
- 비밀번호는 메모리에만 존재
```

**장점**:
- ✅ 중앙화된 비밀 관리
- ✅ 암호화 저장 (KMS)
- ✅ 접근 로그 추적 가능
- ✅ 비밀번호 변경 시 Parameter만 업데이트, 컨테이너 재시작만 하면 됨
- ✅ IAM 역할 기반 접근 제어
- ✅ Git 커밋 위험 제로

---

## 🔄 비밀번호 변경 절차

### SSM 방식 (간단)

```bash
# 1. SSM Parameter 업데이트
aws ssm put-parameter \
  --name "/field/prod/mongodb-uri" \
  --value "new-mongodb-connection-string" \
  --type "SecureString" \
  --overwrite \
  --region ap-northeast-2

# 2. EC2 인스턴스에서 컨테이너 재시작
ssh -i field-keypair.pem ec2-user@[인스턴스-IP]
sudo /opt/field-app/start.sh

# 완료! 새 비밀번호 자동 적용
```

### 기존 방식 (복잡)

```bash
# 1. 모든 EC2 인스턴스에 접속 (5대면 5번 반복)
ssh -i field-keypair.pem ec2-user@[인스턴스-1-IP]
sudo nano /opt/field-app/.env  # 수동 편집
sudo /opt/field-app/start.sh

# 2. 다음 인스턴스...
ssh -i field-keypair.pem ec2-user@[인스턴스-2-IP]
...
# (반복)
```

---

## ✅ 최종 체크리스트

### SSM Parameter Store
- [ ] `/field/prod/mongodb-uri` 생성 (SecureString)
- [ ] `/field/prod/jwt-secret` 생성 (SecureString)
- [ ] `/field/prod/s3-bucket-name` 생성 (String)
- [ ] `/field/prod/node-env` 생성 (String)

### IAM 권한
- [ ] `field-ec2-role`에 `FieldSSMReadPolicy` 연결
- [ ] SSM 접근 권한 테스트 완료
- [ ] S3 업로드 권한 테스트 완료 (IAM 역할)

### EC2 인스턴스
- [ ] `/opt/field-app/.env` 파일 삭제
- [ ] `/opt/field-app/start.sh` 업데이트 (SSM 사용)
- [ ] CloudWatch Logs 드라이버 설정
- [ ] 컨테이너 시작 테스트 완료

### Nest.js 앱
- [ ] S3 Client에서 credentials 옵션 제거 (IAM 역할 사용)
- [ ] `.env.example`에서 AWS Access Key 제거
- [ ] Upload 모듈에서 multer-s3 사용 확인

---

## 🎉 완료!

이제 프로덕션 환경의 비밀번호가 안전하게 관리됩니다!

**주요 개선 사항**:
1. ✅ 비밀번호 중앙 관리 (SSM Parameter Store)
2. ✅ 암호화 저장 (AWS KMS)
3. ✅ IAM 역할 기반 접근
4. ✅ .env 파일 제거 (보안 위험 제거)
5. ✅ 비밀번호 변경 간소화

---

**작성일**: 2025-10-21  
**버전**: 1.0.0  
**관련 문서**: 
- [AWS_SETUP_GUIDE_PART2.md](./AWS_SETUP_GUIDE_PART2.md)
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

