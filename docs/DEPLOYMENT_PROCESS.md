# 🚀 배포 프로세스 가이드

## ⚠️ 중요: .env 파일은 Git에 푸시하지 않습니다!

`.env` 파일은 `.gitignore`에 포함되어 있어서 Git에 푸시되지 않습니다.  
프로덕션 환경에서는 **AWS SSM Parameter Store**를 사용합니다.

---

## 📋 배포 전 체크리스트

### 1. 로컬 개발 환경 (변경 불필요)

로컬 개발용 `.env` 파일은 그대로 유지:
```env
# 로컬 개발용 (인증 없이)
MONGO_URI=mongodb://localhost:27017/field_db
```

### 2. 프로덕션 환경 (AWS SSM Parameter Store 사용)

프로덕션에서는 `.env` 파일을 사용하지 않고, **AWS SSM Parameter Store**에서 환경변수를 가져옵니다.

---

## 🔄 배포 프로세스

### Step 1: 코드 변경 및 커밋

```bash
# 1. 코드 변경
# 2. 변경사항 커밋
git add .
git commit -m "최상위 관리자 시스템 구현"

# 3. GitHub에 푸시
git push origin main
```

> ⚠️ **주의**: `.env` 파일은 자동으로 제외됩니다 (`.gitignore`에 포함)

### Step 2: AWS SSM Parameter Store 확인/업데이트

MongoDB Atlas URI가 변경되었다면 SSM Parameter Store를 업데이트:

#### 방법 1: AWS Console 사용

1. **AWS Console > Systems Manager > Parameter Store**
2. `/field/prod/mongodb-uri` 파라미터 찾기
3. **편집** 클릭
4. MongoDB Atlas URI 입력:
   ```
   mongodb+srv://mongo-kym:Field0719field0719FIELD@sfac-kym.isbg3hy.mongodb.net/field_db?appName=field_web&retryWrites=true&w=majority
   ```
5. **저장**

#### 방법 2: AWS CLI 사용

```bash
aws ssm put-parameter \
  --name "/field/prod/mongodb-uri" \
  --value "mongodb+srv://mongo-kym:Field0719field0719FIELD@sfac-kym.isbg3hy.mongodb.net/field_db?appName=field_web&retryWrites=true&w=majority" \
  --type "SecureString" \
  --overwrite \
  --region ap-northeast-2
```

### Step 3: Docker 이미지 빌드 및 푸시

```bash
# 1. ECR 로그인
aws ecr get-login-password --region ap-northeast-2 | \
  docker login --username AWS --password-stdin 058264290801.dkr.ecr.ap-northeast-2.amazonaws.com

# 2. 이미지 빌드
cd server-nestjs
docker build -t field-nestjs:latest .

# 3. 이미지 태깅
docker tag field-nestjs:latest 058264290801.dkr.ecr.ap-northeast-2.amazonaws.com/field-nestjs:latest

# 4. ECR에 푸시
docker push 058264290801.dkr.ecr.ap-northeast-2.amazonaws.com/field-nestjs:latest
```

### Step 4: EC2 인스턴스 자동 업데이트

Auto Scaling Group이 설정되어 있다면:
- 새 인스턴스가 자동으로 최신 이미지를 pull하여 실행됩니다
- `start.sh` 스크립트가 SSM Parameter Store에서 환경변수를 가져옵니다

---

## 🔍 환경변수 관리 비교

### 로컬 개발 환경

```
server-nestjs/.env 파일
├── MONGO_URI=mongodb://localhost:27017/field_db
├── JWT_SECRET=field-dev-secret-key-2025
└── ...
```

### 프로덕션 환경 (AWS)

```
AWS SSM Parameter Store
├── /field/prod/mongodb-uri (SecureString)
├── /field/prod/jwt-secret (SecureString)
├── /field/prod/s3-bucket-name (String)
└── ...

EC2 인스턴스의 start.sh 스크립트
└── SSM에서 환경변수 가져와서 Docker 컨테이너에 주입
```

---

## ✅ 배포 확인

### 1. SSM Parameter 확인

```bash
# SSM Parameter 값 확인 (마스킹됨)
aws ssm get-parameter \
  --name "/field/prod/mongodb-uri" \
  --with-decryption \
  --region ap-northeast-2 \
  --query "Parameter.Value" \
  --output text
```

### 2. EC2 인스턴스 로그 확인

```bash
# CloudWatch Logs 확인
aws logs tail /aws/ec2/field-nestjs --follow --region ap-northeast-2

# 또는 EC2 인스턴스에 직접 접속
ssh -i field-keypair.pem ec2-user@[EC2-IP]
docker logs field-nestjs -f
```

### 3. API 테스트

```bash
# 헬스 체크
curl https://api.iefield.com/api

# 인증 테스트
curl -X POST https://api.iefield.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234"}'
```

---

## 🚨 주의사항

### ❌ 하지 말아야 할 것

1. **`.env` 파일을 Git에 푸시하지 마세요**
   - `.gitignore`에 포함되어 있지만, 실수로 추가하지 않도록 주의

2. **EC2 인스턴스에 `.env` 파일을 직접 생성하지 마세요**
   - SSM Parameter Store를 사용해야 합니다

3. **비밀번호를 코드에 하드코딩하지 마세요**
   - 모든 비밀 정보는 SSM Parameter Store에 저장

### ✅ 올바른 방법

1. **로컬 개발**: `.env` 파일 사용 (Git에 푸시 안 됨)
2. **프로덕션**: SSM Parameter Store 사용
3. **변경사항**: SSM Parameter Store만 업데이트

---

## 📚 관련 문서

- [AWS Secrets 관리 가이드](./AWS_SECRETS_MANAGEMENT.md)
- [AWS 인프라 구축 가이드 Part 2](./AWS_SETUP_GUIDE_PART2.md)
- [로컬 개발 환경 가이드](./LOCAL_DEVELOPMENT.md)

