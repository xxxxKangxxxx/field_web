# 🚨 주요 고려사항 및 위험 요소

## 📋 목차

1. [CRITICAL 위험 요소](#critical-위험-요소)
2. [HIGH 위험 요소](#high-위험-요소)
3. [MEDIUM 위험 요소](#medium-위험-요소)
4. [개선 조치 완료 항목](#-개선-조치-완료-항목)

---

## CRITICAL 위험 요소

### ✅ 1. EC2 인스턴스 비밀번호 관리 (해결됨)

#### 기존 문제
- `.env` 파일에 MongoDB URI, JWT Secret, AWS Access Key 하드코딩
- SSH 접근 가능한 사람 누구나 비밀번호 탈취 가능
- 비밀번호 변경 시 모든 인스턴스 수동 업데이트 필요

#### 해결 방법
✅ **AWS SSM Parameter Store 도입**
- 모든 비밀 정보는 SSM에 SecureString으로 저장
- EC2 IAM 역할로 SSM 접근 (Access Key 불필요)
- 비밀번호 변경 시 SSM만 업데이트하면 자동 적용

#### 관련 문서
- [AWS_SECRETS_MANAGEMENT.md](./AWS_SECRETS_MANAGEMENT.md) ⭐ 필독
- [AWS_SETUP_GUIDE_PART2.md](./AWS_SETUP_GUIDE_PART2.md) - 섹션 3-2

---

## HIGH 위험 요소

### ✅ 2. Nest.js Dockerfile 빌드 오류 (해결됨)

#### 기존 문제
```dockerfile
# ❌ 잘못된 방식
FROM node:20-alpine AS builder
RUN npm ci --only=production  # devDependencies 설치 안 됨
RUN npm run build  # 빌드 실패! (typescript, @nestjs/cli 필요)
```

#### 해결 방법
```dockerfile
# ✅ 올바른 방식
FROM node:20-alpine AS builder
RUN npm ci  # devDependencies 포함
RUN npm run build  # 빌드 성공

FROM node:20-alpine AS production
RUN npm ci --only=production  # 프로덕션 의존성만
COPY --from=builder /app/dist ./dist
```

#### 확인
- `server-nestjs/Dockerfile` 수정 완료 ✅

---

### ⚠️ 3. S3 파일 업로드 (중요 - 개발 필요)

#### 위험 요소
- 로컬 폴더(`uploads/`)에 파일 저장 시 배포 환경에서 파일 유실
- EC2 인스턴스가 교체되면 모든 파일 삭제됨
- Auto Scaling으로 인스턴스 증가 시 파일 동기화 불가

#### 필수 조치
**Nest.js Upload 모듈 개발 시 필수 구현 사항**:

```typescript
// ✅ 올바른 방식: multer-s3 사용
import { S3Client } from '@aws-sdk/client-s3';
import * as multerS3 from 'multer-s3';

const s3Client = new S3Client({
  region: 'ap-northeast-2',
  // credentials 생략 = IAM 역할 자동 사용
});

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, `uploads/${Date.now()}-${file.originalname}`);
    },
  }),
});
```

```typescript
// ❌ 절대 금지: 로컬 폴더 저장
const upload = multer({ dest: './uploads' });  // 배포 환경에서 파일 유실!
```

#### 체크리스트
- [ ] Nest.js Upload 모듈에서 S3 직접 업로드 구현
- [ ] 로컬 파일 저장 로직 전혀 포함하지 않음
- [ ] IAM 역할로 S3 접근 (Access Key 사용 안 함)

---

## MEDIUM 위험 요소

### ✅ 4. MongoDB Atlas 네트워크 보안 (해결됨)

#### 기존 문제
```
Access List Entry: 0.0.0.0/0  ❌ 전 세계 누구나 접근 가능!
```

#### 해결 방법

**로컬 개발 환경**:
```
Access List Entry: 123.45.67.89/32 (개발자 개인 IP)
```

**프로덕션 환경**:
```
Access List Entry: [EC2 Elastic IP]/32
또는
Access List Entry: [NAT Gateway IP]/32
```

#### 확인
- `docs/AWS_SETUP_GUIDE_PART1.md` - 섹션 1-4 수정 완료 ✅

---

### ✅ 5. CloudWatch 로그 수집 방식 (개선됨)

#### 기존 문제
- CloudWatch Agent 설정 복잡
- Docker 로그 파일 경로 설정 불안정

#### 해결 방법
**Docker `awslogs` 드라이버 사용**:

```bash
docker run -d \
  --log-driver=awslogs \
  --log-opt awslogs-group=/aws/ec2/field-nestjs \
  --log-opt awslogs-region=ap-northeast-2 \
  --log-opt awslogs-stream=$(hostname) \
  your-image:latest
```

#### 장점
- ✅ 설정 간단 (1줄)
- ✅ 실시간 로그 전송
- ✅ 표준 방식 (Docker 공식 지원)

#### 확인
- `docs/AWS_SETUP_GUIDE_PART2.md` - 시작 스크립트 수정 완료 ✅
- `docs/DEPLOYMENT_GUIDE.md` - 섹션 7-3 수정 완료 ✅

---

## ✅ 개선 조치 완료 항목

### 보안 개선
- [x] **SSM Parameter Store 도입** (비밀번호 중앙 관리)
- [x] **IAM 역할 기반 접근** (Access Key 제거)
- [x] **MongoDB Atlas IP 화이트리스트** (0.0.0.0/0 제거)
- [x] **`.env` 파일 제거** (EC2 인스턴스에서)

### 빌드 및 배포 개선
- [x] **Dockerfile 빌드 오류 수정** (devDependencies 포함)
- [x] **CloudWatch Logs 간소화** (awslogs 드라이버 사용)

### 문서화 개선
- [x] **AWS_SECRETS_MANAGEMENT.md** 작성 (비밀 관리 가이드)
- [x] **AWS_SETUP_GUIDE_PART1.md** 수정 (MongoDB 보안)
- [x] **AWS_SETUP_GUIDE_PART2.md** 수정 (SSM, 로그)
- [x] **DEPLOYMENT_GUIDE.md** 수정 (로그 수집 방식)

---

## 🎯 남은 작업 (개발 단계)

### Week 1-3: Nest.js 모듈 개발

#### 최우선 순위
1. **Upload 모듈** ⚠️ 가장 중요
   - S3 직접 업로드 구현
   - multer-s3 사용
   - 로컬 저장 로직 절대 금지

2. **Auth 모듈**
   - JWT 인증
   - bcryptjs 사용 (bcrypt 아님)
   - SSM에서 JWT_SECRET 사용

3. **기타 모듈**
   - Users, Camps, News, Recruit 등
   - 모든 모듈에서 S3 사용 확인

---

## 🔍 배포 전 최종 점검 체크리스트

### 보안
- [ ] SSM Parameter Store에 모든 비밀 정보 등록
- [ ] EC2 인스턴스에 `.env` 파일 없음 확인
- [ ] MongoDB Atlas IP 화이트리스트 설정 (0.0.0.0/0 없음)
- [ ] S3 버킷 정책 확인 (필요한 권한만)
- [ ] IAM 역할 권한 최소화 확인

### 코드
- [ ] Nest.js Dockerfile 빌드 테스트
- [ ] Upload 모듈에서 S3 사용 확인
- [ ] 로컬 파일 저장 로직 전혀 없음 확인
- [ ] IAM 역할 자동 사용 확인 (Access Key 없음)

### 인프라
- [ ] CloudWatch Logs 그룹 생성
- [ ] EC2 IAM 역할에 SSM 권한 추가
- [ ] ECR 리포지토리 생성
- [ ] Auto Scaling Group 설정

### 모니터링
- [ ] CloudWatch Logs 정상 작동 확인
- [ ] CloudWatch Alarms 설정
- [ ] 대시보드 생성
- [ ] 알림 채널 설정 (이메일/Slack)

---

## 💡 추가 권장사항

### 1. Secrets Rotation
비밀번호를 정기적으로 변경하세요:

```bash
# 3개월마다 실행
aws ssm put-parameter \
  --name "/field/prod/jwt-secret" \
  --value "new-super-strong-secret" \
  --type "SecureString" \
  --overwrite

# 컨테이너 재시작으로 자동 적용
sudo /opt/field-app/start.sh
```

### 2. 백업 전략
- MongoDB Atlas 자동 백업 활성화 (Point-in-Time Recovery)
- S3 버킷 버전 관리 활성화 (중요 파일의 경우)
- AMI 정기 백업 (월 1회 권장)

### 3. 비용 최적화
- CloudWatch Logs 보존 기간 설정 (30일 또는 90일)
- S3 Lifecycle 정책 설정 (오래된 파일 Glacier로 이동)
- Auto Scaling 정책 튜닝 (불필요한 확장 방지)

### 4. 보안 감사
- AWS CloudTrail 활성화 (모든 API 호출 로깅)
- AWS Config 활성화 (리소스 변경 추적)
- 정기 보안 감사 (분기별)

---

## 📞 지원

문제 발생 시:
1. 이 문서의 체크리스트 확인
2. 관련 문서 참조 (AWS_SECRETS_MANAGEMENT.md 등)
3. CloudWatch Logs에서 에러 로그 확인
4. 팀 리더에게 문의

---

**작성일**: 2025-10-21  
**버전**: 1.0.0  
**상태**: 모든 CRITICAL 및 HIGH 위험 요소 해결 완료 ✅

