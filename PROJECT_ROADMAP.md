# 🚀 FIELD 프로젝트 - Express to Nest.js 마이그레이션 로드맵

## 📌 프로젝트 개요

**목표**: Express 백엔드를 Nest.js로 무중단 마이그레이션  
**전략**: 병렬 인프라 구축 → 테스트 → 트래픽 전환  
**기간**: 약 4주

---

## 🗂️ 프로젝트 구조

```
field_web/
├── frontend/                    # React + Vite 프론트엔드
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
├── server/                      # Express 백엔드 (Legacy)
│   ├── Dockerfile
│   ├── app.js
│   └── controllers/
├── server-nestjs/              # Nest.js 백엔드 (신규) ⭐
│   ├── Dockerfile
│   ├── src/
│   │   ├── main.ts
│   │   └── app.module.ts
│   └── .env
├── docker-compose.yml          # 로컬 개발 환경
├── docker-scripts.sh           # Docker 관리 스크립트
├── .github/
│   └── workflows/
│       ├── deploy-nestjs.yml    # Nest.js CI/CD
│       └── deploy-frontend.yml  # Frontend CI/CD
└── docs/                       # 문서
    ├── AWS_SETUP_GUIDE_PART1.md
    ├── AWS_SETUP_GUIDE_PART2.md
    ├── AWS_SECRETS_MANAGEMENT.md  ⭐ 필독
    ├── DEPLOYMENT_GUIDE.md
    ├── DOCKER_GUIDE.md
    ├── DOCKER_TEST.md
    └── RISKS_AND_CONSIDERATIONS.md  ⚠️ 배포 전 필수
```

---

## 🚨 주요 고려사항

**⚠️ 배포 전 필수 확인**: [RISKS_AND_CONSIDERATIONS.md](./docs/RISKS_AND_CONSIDERATIONS.md)

### CRITICAL - 모두 해결됨 ✅

1. **EC2 비밀번호 관리**
   - ✅ AWS SSM Parameter Store 사용
   - 📄 [AWS_SECRETS_MANAGEMENT.md](./docs/AWS_SECRETS_MANAGEMENT.md)

2. **Dockerfile 빌드 오류**
   - ✅ devDependencies 포함하도록 수정

### HIGH - 개발 시 필수 구현

3. **S3 파일 업로드** ⚠️
   - 로컬 폴더 저장 절대 금지
   - multer-s3로 S3 직접 업로드 구현 필수

### MEDIUM - 모두 해결됨 ✅

4. **MongoDB Atlas 보안** ✅
5. **CloudWatch 로그 수집** ✅

---

## 📚 문서 가이드

### 🐳 로컬 개발

| 문서 | 설명 | 대상 |
|------|------|------|
| [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) | Docker Compose 사용법 | 모든 개발자 |
| [DOCKER_TEST.md](./DOCKER_TEST.md) | Docker 환경 테스트 가이드 | 개발자 |

### ☁️ AWS 인프라 구축

| 문서 | 설명 | 대상 |
|------|------|------|
| [AWS_SETUP_GUIDE_PART1.md](./docs/AWS_SETUP_GUIDE_PART1.md) | MongoDB Atlas & S3 설정 | DevOps |
| [AWS_SETUP_GUIDE_PART2.md](./docs/AWS_SETUP_GUIDE_PART2.md) | ALB, ASG, ECR 설정 | DevOps |

### 🚀 배포

| 문서 | 설명 | 대상 |
|------|------|------|
| [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) | CI/CD 및 트래픽 전환 가이드 | DevOps, 팀 리더 |

---

## 🎯 3단계 로드맵

### 1️⃣ 단계: 로컬 개발 환경 구축 ✅

**목표**: Docker Compose로 유연한 개발 환경 구성

#### 완료된 작업
- ✅ Nest.js 프로젝트 초기 설정
  - TypeScript, MongoDB, JWT 인증, S3 업로드 설정
  - 패키지: bcryptjs, multer-s3, class-validator 등

- ✅ Dockerfile 작성 (3개)
  - `server-nestjs/Dockerfile`: Nest.js 멀티스테이지 빌드
  - `frontend/Dockerfile`: React + Nginx
  - `server/Dockerfile`: Express Legacy

- ✅ docker-compose.yml 작성 (5개 서비스)
  ```yaml
  - frontend (5173)
  - backend (Nest.js, 4002)
  - backend-legacy (Express, 4001)
  - mongodb (27017)
  - mongo-express (8081)
  ```

- ✅ 환경변수 및 테스트 설정

#### 사용 방법

```bash
# 시나리오 A: Nest.js 개발
./docker-scripts.sh a

# 시나리오 B: 프론트-백엔드 통합 테스트
./docker-scripts.sh b

# 시나리오 C: 전체 서비스 (구/신 비교)
./docker-scripts.sh c
```

---

### 2️⃣ 단계: AWS 클라우드 인프라 구축 ✅

**목표**: 기존 서비스 무중단, 병렬 인프라 구축

#### 완료된 작업

##### Part 1: 공용 리소스
- ✅ MongoDB Atlas 설정 가이드
  - 클러스터 생성, 사용자 설정, Connection String
- ✅ AWS S3 버킷 설정 가이드
  - 버킷 생성, CORS, 버킷 정책
- ✅ IAM 사용자 생성 가이드
  - S3 업로드 권한 정책

##### Part 2: 백엔드 인프라
- ✅ VPC 및 네트워크 설정 가이드
- ✅ 보안 그룹 생성 가이드 (ALB, Nest.js, Express)
- ✅ AMI 준비 가이드 (Docker 설치, 시작 스크립트)
- ✅ 시작 템플릿 생성 가이드
- ✅ Target Group 생성 가이드
  - `tg-nestjs` (4002)
  - `tg-legacy-express` (4001)
- ✅ ALB 생성 가이드
  - 도메인 기반 라우팅 규칙
- ✅ Auto Scaling Group 생성 가이드
  - `asg-nestjs` (자동 확장/축소)
- ✅ Route 53 도메인 설정 가이드
  - `new-api.iefield.com` (테스트용)
- ✅ ECR 리포지토리 생성 가이드

#### 아키텍처

```
Internet
   ↓
[Route 53]
   |
   ├─ new-api.iefield.com (Nest.js) ✨
   └─ api.iefield.com (Express) 🔄
   ↓
[ALB - field-alb]
   |
   ├─ [tg-nestjs] → [asg-nestjs] → Nest.js Instances
   └─ [tg-legacy-express] → Express Instances
   ↓
[MongoDB Atlas] + [AWS S3]
```

---

### 3️⃣ 단계: CI/CD 및 트래픽 전환 ✅

**목표**: git push로 자동 배포, 1분 내 트래픽 전환

#### 완료된 작업

##### CI/CD 파이프라인
- ✅ GitHub Actions - Nest.js
  ```
  server-nestjs/ 변경 감지
    → Docker 빌드
    → ECR 푸시
    → ASG 인스턴스 새로 고침
  ```

- ✅ GitHub Actions - Frontend
  ```
  frontend/ 변경 감지
    → React 빌드
    → S3 업로드
    → CloudFront 캐시 무효화
  ```

##### 배포 가이드
- ✅ GitHub Secrets 설정 방법
- ✅ 첫 배포 실행 가이드
- ✅ 배포 검증 체크리스트
- ✅ 트래픽 전환 절차 (1분)
- ✅ 롤백 절차 (긴급 복구)
- ✅ 모니터링 설정 (CloudWatch)

#### 트래픽 전환 프로세스

```
1. new-api.iefield.com 테스트 (1-2주)
   ↓
2. 모든 기능 검증 완료
   ↓
3. ALB 리스너 규칙 수정 (1분)
   api.iefield.com: tg-legacy-express → tg-nestjs
   ↓
4. 실시간 모니터링 (1주)
   ↓
5. Legacy 리소스 제거 (안정화 후)
```

---

## ⚡ 빠른 시작

### 로컬 개발 시작

```bash
# 1. 리포지토리 클론
git clone https://github.com/your-org/field_web.git
cd field_web

# 2. Docker Compose 실행
./docker-scripts.sh a  # Nest.js 개발 환경

# 3. 접속 확인
# Nest.js API: http://localhost:4002
# Mongo Express: http://localhost:8081 (admin/admin)
```

### AWS 배포 시작

```bash
# 1. AWS 인프라 구축 (가이드 따라 진행)
# - docs/AWS_SETUP_GUIDE_PART1.md
# - docs/AWS_SETUP_GUIDE_PART2.md

# 2. GitHub Secrets 설정
# AWS_ACCESS_KEY_ID
# AWS_SECRET_ACCESS_KEY
# AWS_ACCOUNT_ID

# 3. 코드 Push
git add .
git commit -m "feat: Add new feature"
git push origin main

# 4. GitHub Actions에서 자동 배포 확인
```

---

## 🛠️ 기술 스택

### Frontend
- **React** 18.2.0
- **Vite** 5.4.19
- **Redux Toolkit** 2.2.1
- **Axios** 1.6.7
- **Material-UI** 5.15.10

### Backend (Nest.js) ⭐
- **NestJS** 11.0.1
- **TypeScript** 5.7.3
- **Mongoose** 8.19.2
- **Passport JWT** 4.0.1
- **bcryptjs** 3.0.2
- **multer-s3** 3.0.1
- **AWS SDK** 3.913.0

### Backend (Express - Legacy)
- **Express** 5.1.0
- **Mongoose** 8.13.2
- **bcrypt** 6.0.0
- **jsonwebtoken** 9.0.2
- **multer** 2.0.1

### Database & Storage
- **MongoDB Atlas** (클라우드 DB)
- **AWS S3** (파일 스토리지)

### DevOps
- **Docker** & **Docker Compose**
- **GitHub Actions** (CI/CD)
- **AWS ECR** (컨테이너 레지스트리)
- **AWS ALB** (로드 밸런서)
- **AWS Auto Scaling** (자동 확장)
- **AWS CloudWatch** (모니터링)

---

## 📊 프로젝트 현황

### ✅ 완료된 작업 (100%)

#### 1단계 (로컬 개발 환경)
- [x] Nest.js 프로젝트 초기 설정
- [x] Dockerfile 작성 (3개)
- [x] docker-compose.yml 작성
- [x] 환경변수 설정 및 테스트

#### 2단계 (AWS 인프라)
- [x] MongoDB Atlas & S3 가이드
- [x] ALB, Target Group, ASG 가이드
- [x] Route 53 & ECR 가이드

#### 3단계 (CI/CD)
- [x] Nest.js CI/CD workflow
- [x] Frontend CI/CD workflow
- [x] 배포 및 전환 가이드

---

## 🎯 다음 단계 (구현 필요)

### Week 1-3: Nest.js 모듈 개발
```
[ ] Auth 모듈 (JWT 인증)
[ ] Users 모듈 (사용자 관리)
[ ] Camps 모듈 (캠프 정보)
[ ] News 모듈 (뉴스 게시판)
[ ] Recruit 모듈 (리크루팅)
[ ] Contact 모듈 (문의)
[ ] Reviews 모듈 (후기)
[ ] Profiles 모듈 (프로필)
[ ] Questions 모듈 (질문)
[ ] Inquiries 모듈 (문의 관리)
[ ] Upload 모듈 (S3 파일 업로드) ⚠️ 중요
```

### Week 4: 배포 및 전환
```
[ ] AWS 인프라 구축 (가이드 따라 진행)
[ ] GitHub Secrets 설정
[ ] CI/CD 파이프라인 테스트
[ ] new-api.iefield.com 배포
[ ] 기능 검증 및 테스트
[ ] 트래픽 전환 (api.iefield.com)
[ ] 모니터링 및 안정화
```

---

## 💰 예상 비용

### 개발 환경 (로컬)
- **무료** (Docker만 사용)

### 프로덕션 환경 (월별)

#### 데이터베이스 & 스토리지
- MongoDB Atlas M10: **$57**
- S3 (50GB): **$1.15**
- S3 전송 (50GB): **$4.50**

#### 컴퓨팅
- ALB: **$22.50**
- EC2 t3.small x 2: **$30**
- CloudFront: **$10** (예상)

#### 기타
- Route 53: **$0.50**
- ECR: **$1.00**

**총 예상: 약 $126/월**

#### 프리 티어 활용 시 (첫 12개월)
- MongoDB Atlas M0: **무료** (영구)
- EC2 t3.micro: **무료** (750시간)
- S3: **무료** (5GB)
- ALB: **무료** (750시간)

**첫 12개월: 약 $60/월** (70% 절감)

---

## 🔒 보안 주의사항

### ⚠️ 절대 커밋하지 말 것
```
.env
.env.local
.env.production
AWS Access Keys
MongoDB Connection Strings
JWT Secrets
```

### ✅ 보안 권장사항
1. `.env` 파일은 `.gitignore`에 포함 (완료)
2. GitHub Secrets 사용 (CI/CD용)
3. IAM 권한 최소화 (S3만 접근)
4. MongoDB IP 화이트리스트 (프로덕션)
5. HTTPS 사용 (Let's Encrypt)
6. 정기적인 비밀번호 변경 (3개월)

---

## 🆘 트러블슈팅

### 자주 발생하는 문제

#### 1. Docker 포트 충돌
```bash
# 사용 중인 포트 확인
lsof -i :4002

# 프로세스 종료
kill -9 [PID]
```

#### 2. MongoDB 연결 실패
```bash
# MongoDB 컨테이너 재시작
docker-compose restart mongodb

# 로그 확인
docker-compose logs mongodb
```

#### 3. 배포 실패 (GitHub Actions)
- GitHub Secrets 확인
- AWS 자격 증명 유효성 확인
- ECR 리포지토리 존재 여부 확인

---

## 📞 지원 및 문의

### 문서 위치
- **로컬 개발**: `DOCKER_GUIDE.md`, `DOCKER_TEST.md`
- **AWS 설정**: `docs/AWS_SETUP_GUIDE_PART1.md`, `PART2.md`
- **배포**: `docs/DEPLOYMENT_GUIDE.md`

### 팀 연락처
- **DevOps 담당**: [담당자 이름]
- **백엔드 담당**: [담당자 이름]
- **프론트엔드 담당**: [담당자 이름]

---

## 📈 성과 지표 (KPI)

### 마이그레이션 성공 기준
- [ ] **다운타임**: 0초 (무중단 전환)
- [ ] **에러율**: < 1%
- [ ] **응답 시간**: < 500ms (95 percentile)
- [ ] **롤백 시간**: < 2분
- [ ] **비용 증가**: < 20%

---

## 🎉 프로젝트 완료 후

### 예상 효과
1. **코드 품질 향상**: TypeScript, 모듈화, 테스트 용이
2. **개발 생산성**: NestJS의 강력한 CLI, 데코레이터
3. **유지보수성**: 명확한 구조, 의존성 주입
4. **확장성**: 마이크로서비스 전환 용이
5. **성능**: 최신 Node.js 최적화

### 다음 개선 사항
- [ ] 단위 테스트 작성 (Jest)
- [ ] E2E 테스트 (Supertest)
- [ ] API 문서화 (Swagger)
- [ ] 로깅 시스템 (Winston)
- [ ] 캐싱 (Redis)
- [ ] 부하 테스트 (k6)

---

**프로젝트 시작일**: 2025-10-21  
**예상 완료일**: 2025-11-21 (4주)  
**버전**: 1.0.0  
**작성자**: AI Assistant & Development Team

---

## 📜 라이선스

이 프로젝트는 FIELD 조직의 소유이며, 모든 권리는 보유됩니다.

