# 📧 AWS SES 이메일 인증 설정 가이드

## 📋 목차

1. [도메인 검증 (Route 53 자동 연동)](#1-도메인-검증-route-53-자동-연동)
2. [개인 이메일 검증 (개발 테스트용)](#2-개인-이메일-검증-개발-테스트용)
3. [샌드박스 모드 해제 요청](#3-샌드박스-모드-해제-요청)
4. [SSM Parameter Store 설정](#4-ssm-parameter-store-설정)
5. [프로덕션 배포 설정](#5-프로덕션-배포-설정)

---

## 1. 도메인 검증 (Route 53 자동 연동)

### 🎯 목적
도메인 전체(`iefield.com`)를 검증하여 나중에 `admin@`, `support@` 등 다양한 이메일 주소를 추가할 때 별도 인증이 필요 없도록 합니다.

### Step 1-1: AWS SES 콘솔 접속

1. **AWS 콘솔 로그인**
2. **리전 선택**: 아시아 태평양 (서울) `ap-northeast-2`
3. **Simple Email Service (SES)** 서비스 선택

### Step 1-2: 도메인 검증 생성

1. 왼쪽 메뉴에서 **"Verified identities"** 클릭
2. **"Create identity"** 버튼 클릭
3. **Identity type**: **"Domain"** 선택
4. **Domain**: `iefield.com` 입력
5. **"Create identity"** 클릭

### Step 1-3: Route 53 자동 연동 (핵심!)

1. 생성 후 화면에서 **"Publish DNS records to Route 53"** 버튼 클릭
2. Route 53 호스팅 영역 선택: `iefield.com`
3. **"Publish DNS records"** 클릭
4. 자동으로 CNAME 레코드 3개가 등록됩니다:
   - DKIM 설정 포함
   - SPF 설정 포함
   - 도메인 검증 설정 포함

### Step 1-4: 검증 상태 확인

1. **"Verified identities"** 페이지로 돌아가기
2. `iefield.com`의 상태가 **"Verified"**로 변경될 때까지 대기 (보통 1-2분)
3. ✅ **"Verified"** 상태가 되면 도메인 검증 완료

> 💡 **장점**: 
> - 나중에 `noreply@iefield.com`, `admin@iefield.com` 등 어떤 이메일 주소든 자동으로 검증됨
> - DKIM, SPF 설정이 자동으로 완료되어 이메일 신뢰도 향상

---

## 2. 개인 이메일 검증 (개발 테스트용)

### 🎯 목적
샌드박스 모드에서는 **받는 사람**의 이메일도 검증되어 있어야 발송이 가능합니다. 개발 중 테스트를 위해 개인 이메일을 검증합니다.

### Step 2-1: 개인 이메일 추가

1. **"Verified identities"** 페이지에서 **"Create identity"** 클릭
2. **Identity type**: **"Email address"** 선택
3. **Email address**: 본인의 Gmail 등 개인 이메일 입력 (예: `your-email@gmail.com`)
4. **"Create identity"** 클릭

### Step 2-2: 이메일 인증

1. 입력한 이메일 주소로 검증 메일 수신
2. 메일의 **"Verify email address"** 링크 클릭
3. AWS 콘솔에서 상태가 **"Verified"**로 변경되는지 확인

> ⚠️ **중요**: 샌드박스 모드에서는 검증된 이메일로만 발송 가능합니다.  
> 테스트 시에는 검증된 개인 이메일을 사용하세요.

---

## 3. 샌드박스 모드 해제 요청

### Step 3-1: 현재 상태 확인

1. 왼쪽 메뉴에서 **"Account dashboard"** 클릭
2. **"Account status"** 섹션 확인
3. **"Sandbox"** 상태인지 확인

### Step 3-2: 프로덕션 액세스 요청

1. **"Account dashboard"**에서 **"Request production access"** 버튼 클릭
2. **"Request production access"** 클릭

### Step 3-3: 요청 양식 작성 (영어로 작성!)

> ⚠️ **중요**: AWS 서포트 팀은 글로벌하게 운영되므로, **영어로 작성**해야 처리가 빠르고 반려되지 않습니다.

#### 필수 입력 항목:

- **Mail Type**: `Transactional` 선택
- **Website URL**: `https://www.iefield.com`
- **Use case description**: 아래 템플릿 사용

#### Use case description (영어 템플릿):

```
We are developing a web application for a coding club named 'FIELD'. 
We need SES to send automated email verification codes (OTP) to users 
during the sign-up process to validate their email addresses. 

We will only send emails to users who have explicitly requested them 
through our sign-up form. We estimate a low volume of emails initially 
(less than 100 emails per day).

Our use case:
- Send 6-digit verification codes to new users during registration
- Users must verify their email before completing sign-up
- All emails are transactional (not marketing or promotional)
- We comply with AWS SES sending policies and best practices
```

- **Compliance**: 모든 체크박스 선택
  - ✅ I have read and agree to the AWS Service Terms
  - ✅ I will not send unsolicited email
  - ✅ I will not send emails to purchased lists

### Step 3-4: 요청 제출

1. **"Submit request"** 클릭
2. 요청 ID 확인 (이메일로도 수신)
3. 승인까지 **24-48시간** 소요 (보통 빠르게 승인됨)

### Step 3-5: 승인 확인

1. **"Account dashboard"**에서 상태 확인
2. **"Production access granted"** 상태로 변경되면 완료
3. 이제 검증되지 않은 이메일로도 발송 가능

---

## 4. SSM Parameter Store 설정

### Step 4-1: AWS Console에서 Parameter 생성

1. **AWS Console > Systems Manager > Parameter Store**
2. **"Create parameter"** 클릭

#### 파라미터 1: Email Provider

```
이름: /field/prod/email-provider
유형: String
값: ses
설명: Email service provider (smtp or ses)
```

#### 파라미터 2: AWS SES Region

```
이름: /field/prod/aws-ses-region
유형: String
값: ap-northeast-2
설명: AWS SES region
```

#### 파라미터 3: AWS SES From Email

```
이름: /field/prod/aws-ses-from-email
유형: String
값: noreply@iefield.com
설명: AWS SES sender email address
```

#### 파라미터 4: Redis Host (ElastiCache)

```
이름: /field/prod/redis-host
유형: String
값: [ElastiCache 엔드포인트]
설명: Redis host for verification codes
```

#### 파라미터 5: Redis Port

```
이름: /field/prod/redis-port
유형: String
값: 6379
설명: Redis port
```

### Step 4-2: AWS CLI로 Parameter 생성 (선택 사항)

```bash
# Email Provider
aws ssm put-parameter \
  --name "/field/prod/email-provider" \
  --value "ses" \
  --type "String" \
  --description "Email service provider" \
  --region ap-northeast-2

# AWS SES Region
aws ssm put-parameter \
  --name "/field/prod/aws-ses-region" \
  --value "ap-northeast-2" \
  --type "String" \
  --description "AWS SES region" \
  --region ap-northeast-2

# AWS SES From Email
aws ssm put-parameter \
  --name "/field/prod/aws-ses-from-email" \
  --value "noreply@iefield.com" \
  --type "String" \
  --description "AWS SES sender email" \
  --region ap-northeast-2

# Redis Host (ElastiCache 엔드포인트로 변경 필요)
aws ssm put-parameter \
  --name "/field/prod/redis-host" \
  --value "your-elasticache-endpoint.cache.amazonaws.com" \
  --type "String" \
  --description "Redis host" \
  --region ap-northeast-2

# Redis Port
aws ssm put-parameter \
  --name "/field/prod/redis-port" \
  --value "6379" \
  --type "String" \
  --description "Redis port" \
  --region ap-northeast-2
```

---

## 5. 프로덕션 배포 설정

### Step 5-1: start.sh 스크립트 수정

EC2 인스턴스의 `/opt/field-app/start.sh` 파일에 다음 환경변수 로드를 추가:

```bash
# Email Provider 설정
EMAIL_PROVIDER=$(aws ssm get-parameter \
  --name "/field/prod/email-provider" \
  --region $AWS_REGION \
  --query "Parameter.Value" \
  --output text)

AWS_SES_REGION=$(aws ssm get-parameter \
  --name "/field/prod/aws-ses-region" \
  --region $AWS_REGION \
  --query "Parameter.Value" \
  --output text)

AWS_SES_FROM_EMAIL=$(aws ssm get-parameter \
  --name "/field/prod/aws-ses-from-email" \
  --region $AWS_REGION \
  --query "Parameter.Value" \
  --output text)

# Redis 설정
REDIS_HOST=$(aws ssm get-parameter \
  --name "/field/prod/redis-host" \
  --region $AWS_REGION \
  --query "Parameter.Value" \
  --output text)

REDIS_PORT=$(aws ssm get-parameter \
  --name "/field/prod/redis-port" \
  --region $AWS_REGION \
  --query "Parameter.Value" \
  --output text)
```

그리고 Docker 컨테이너 실행 시 환경변수로 전달:

```bash
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
  -e EMAIL_PROVIDER="$EMAIL_PROVIDER" \
  -e AWS_SES_REGION="$AWS_SES_REGION" \
  -e AWS_SES_FROM_EMAIL="$AWS_SES_FROM_EMAIL" \
  -e REDIS_HOST="$REDIS_HOST" \
  -e REDIS_PORT="$REDIS_PORT" \
  --log-driver=awslogs \
  --log-opt awslogs-group=/aws/ec2/field-nestjs \
  --log-opt awslogs-region=$AWS_REGION \
  --log-opt awslogs-stream=$(hostname) \
  ${ECR_REGISTRY}/field-nestjs:latest
```

### Step 5-2: IAM 역할 권한 확인

EC2 인스턴스의 IAM 역할에 SES 권한이 있는지 확인:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## ✅ 체크리스트

### AWS SES 설정
- [ ] 도메인 검증 완료 (`iefield.com` - Verified 상태)
- [ ] Route 53 자동 연동 완료 (CNAME 레코드 3개 자동 등록)
- [ ] 개인 이메일 검증 완료 (테스트용)
- [ ] 샌드박스 해제 요청 제출 (영어로 작성)
- [ ] 프로덕션 액세스 승인 완료

### SSM Parameter Store
- [ ] `/field/prod/email-provider` 생성 (값: `ses`)
- [ ] `/field/prod/aws-ses-region` 생성 (값: `ap-northeast-2`)
- [ ] `/field/prod/aws-ses-from-email` 생성 (값: `noreply@iefield.com`)
- [ ] `/field/prod/redis-host` 생성 (ElastiCache 엔드포인트)
- [ ] `/field/prod/redis-port` 생성 (값: `6379`)

### 프로덕션 배포
- [ ] `start.sh` 스크립트에 SES 환경변수 추가
- [ ] IAM 역할에 SES 권한 추가
- [ ] Docker 컨테이너에 환경변수 전달 확인

---

## 🧪 테스트 방법

### 개발 환경 (SMTP)
- `.env` 파일에 `EMAIL_PROVIDER=smtp` 설정
- SMTP로 이메일 발송 테스트

### 프로덕션 환경 (SES)
- SSM Parameter Store에 `EMAIL_PROVIDER=ses` 설정
- EC2 인스턴스에서 컨테이너 재시작
- SES로 이메일 발송 테스트

---

## 📚 참고 문서

- [AWS SES 공식 문서](https://docs.aws.amazon.com/ses/)
- [AWS_SECRETS_MANAGEMENT.md](./AWS_SECRETS_MANAGEMENT.md)
- [AWS_SETUP_GUIDE_PART2.md](./AWS_SETUP_GUIDE_PART2.md)

