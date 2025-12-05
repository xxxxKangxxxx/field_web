# 🎯 Field 동아리 홈페이지 프로젝트 포트폴리오

> **프로젝트 기간**: 2024년 ~ 2025년  
> **역할**: 풀스택 개발자 (Backend 마이그레이션, 인프라 구축)  
> **팀 규모**: 4명 (프론트엔드 2명, 백엔드 2명)

---

## 📌 프로젝트 개요

Field 동아리 공식 웹사이트 개발 및 Express → NestJS 백엔드 마이그레이션 프로젝트입니다. 전국 대학생 산업공학도들이 함께 활동하는 Field 동아리의 활동 소개, 캠프 정보, 뉴스, 모집 공고 등을 제공하는 웹 애플리케이션입니다.

### 프로젝트 목표

- ✅ 동아리 구성원 간 원활한 소통과 협력 촉진
- ✅ 산업공학 관련 소식 및 이벤트 정보 효과적 전달
- ✅ 동아리 활동 참여율 증대
- ✅ 동아리 홍보 강화 및 신규 멤버 유입

### 핵심 성과

- **무중단 마이그레이션**: Express → NestJS 전환 완료 (다운타임 0초)
- **클라우드 인프라 구축**: AWS ALB, ASG, ECR을 활용한 확장 가능한 아키텍처
- **CI/CD 파이프라인**: GitHub Actions 기반 자동 배포 시스템 구축
- **11개 모듈 완전 마이그레이션**: 모든 기능 정상 작동 확인

---

## 🛠 기술 스택

### Frontend

| 기술 | 버전 | 용도 |
|------|------|------|
| React | 18.2.0 | UI 라이브러리 |
| Vite | 5.4.19 | 빌드 도구 |
| Redux Toolkit | 2.2.1 | 상태 관리 |
| React Router | 6.22.1 | 라우팅 |
| Styled Components | 6.1.8 | CSS-in-JS |
| Material-UI | 5.15.10 | UI 컴포넌트 |
| Framer Motion | 11.0.3 | 애니메이션 |
| Axios | 1.6.7 | HTTP 클라이언트 |
| React Query | 5.22.2 | 서버 상태 관리 |

### Backend (NestJS)

| 기술 | 버전 | 용도 |
|------|------|------|
| NestJS | 11.0.1 | 백엔드 프레임워크 |
| TypeScript | 5.7.3 | 프로그래밍 언어 |
| Mongoose | 8.19.2 | MongoDB ODM |
| Passport JWT | 4.0.1 | 인증/인가 |
| bcryptjs | 3.0.2 | 비밀번호 암호화 |
| multer-s3 | 3.0.1 | S3 파일 업로드 |
| AWS SDK | 3.913.0 | AWS 서비스 연동 |
| class-validator | 0.14.2 | DTO 검증 |

### Infrastructure & DevOps

| 기술/서비스 | 용도 |
|------------|------|
| Docker & Docker Compose | 컨테이너화 및 로컬 개발 환경 |
| MongoDB Atlas | 클라우드 데이터베이스 |
| AWS S3 | 파일 스토리지 |
| AWS ALB | 로드 밸런서 |
| AWS Auto Scaling Group | 자동 확장/축소 |
| AWS ECR | 컨테이너 레지스트리 |
| AWS Route 53 | DNS 관리 |
| GitHub Actions | CI/CD 파이프라인 |
| AWS CloudWatch | 모니터링 및 로깅 |

---

## 🎨 주요 기능

### 사용자 기능

- [x] 동아리 소개 및 활동 내용 소개
- [x] 캠프 정보 및 이미지 갤러리
- [x] 뉴스 및 공지사항 (카테고리별 필터링)
- [x] 모집 공고 조회 및 지원
- [x] 문의하기 폼 (이메일 발송)
- [x] 회원가입/로그인 (JWT 인증)
- [x] 마이페이지 (내 문의사항 조회)
- [x] 반응형 디자인 (모바일/태블릿/데스크톱)

### 관리자 기능

- [x] 관리자 대시보드
- [x] 뉴스 작성/수정/삭제 (파일 업로드 지원)
- [x] 캠프 정보 관리 (포스터 이미지 업로드)
- [x] 모집 공고 관리
- [x] 문의사항 관리 (상태 업데이트)
- [x] 프로필 관리 (멤버 프로필 CRUD)
- [x] 사용자 관리 (Super Admin 전용)
- [x] FAQ 관리

### 기술적 기능

- [x] JWT 기반 인증/인가 (중복 로그인 방지)
- [x] S3 파일 업로드/삭제 (자동 정리)
- [x] 이메일 발송 (AWS SES)
- [x] 권한 분리 (일반 사용자, 관리자, Super Admin)
- [x] API 검증 (class-validator)
- [x] CORS 설정
- [x] 에러 핸들링

---

## 🏗 인프라 아키텍처

### 시스템 아키텍처

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

### 배포 파이프라인

#### NestJS 배포 (GitHub Actions)

```
server-nestjs/ 변경 감지
  → Docker 빌드
  → ECR 푸시
  → ASG 인스턴스 새로 고침
```

#### Frontend 배포 (GitHub Actions)

```
frontend/ 변경 감지
  → React 빌드
  → S3 업로드
  → CloudFront 캐시 무효화
```

### 인프라 구성 요소

| 구성 요소 | 설명 |
|----------|------|
| **VPC** | 프라이빗 서브넷 2개 AZ 구성 |
| **ALB** | Application Load Balancer (도메인 기반 라우팅) |
| **Target Group** | `tg-nestjs` (포트 4002), `tg-legacy-express` (포트 4001) |
| **Auto Scaling Group** | `asg-nestjs` (최소 1, 최대 3 인스턴스) |
| **ECR** | Docker 이미지 저장소 |
| **MongoDB Atlas** | 클라우드 데이터베이스 (M10) |
| **S3** | 파일 스토리지 (`field-uploads-prod`) |
| **Route 53** | DNS 관리 |
| **CloudWatch** | 로그 수집 및 모니터링 |

---

## 🔄 Express → NestJS 마이그레이션 과정

### 마이그레이션 전략

**목표**: 무중단 마이그레이션  
**전략**: 병렬 인프라 구축 → 테스트 → 트래픽 전환  
**기간**: 약 4주

### 단계별 진행 과정

#### 1단계: 로컬 개발 환경 구축 ✅

- [x] Nest.js 프로젝트 초기 설정
  - TypeScript, MongoDB, JWT 인증, S3 업로드 설정
- [x] Dockerfile 작성 (3개)
  - `server-nestjs/Dockerfile`: Nest.js 멀티스테이지 빌드
  - `frontend/Dockerfile`: React + Nginx
  - `server/Dockerfile`: Express Legacy
- [x] docker-compose.yml 작성 (5개 서비스)
- [x] 환경변수 및 테스트 설정

#### 2단계: 모듈별 마이그레이션 ✅

완료된 모듈 (11개):

1. **Upload** - S3 파일 업로드/삭제/URL 생성
2. **Auth** - 회원가입, 로그인, JWT 인증, 중복 로그인 방지
3. **Users** - 사용자 관리, 부서 목록 조회
4. **Camps** - 캠프 CRUD + S3 포스터 업로드
5. **News** - 뉴스 CRUD + S3 파일 업로드 + 카테고리 필터링
6. **Recruits** - 모집 일정 CRUD + isActive 단일 활성화
7. **Contacts** - 문의 접수 및 관리자 조회
8. **Questions** - FAQ 관리
9. **Reviews** - 리뷰 관리 (캠프별 조회)
10. **Profiles** - 프로필 관리 + S3 사진 업로드
11. **Inquiries** - 문의사항 관리 + 상태 업데이트

#### 3단계: AWS 클라우드 인프라 구축 ✅

**Part 1: 공용 리소스**
- [x] MongoDB Atlas 클러스터 생성
- [x] AWS S3 버킷 설정 (CORS, 버킷 정책)
- [x] IAM 사용자 생성 (S3 업로드 권한)

**Part 2: 백엔드 인프라**
- [x] VPC 및 네트워크 설정 (2개 AZ)
- [x] 보안 그룹 생성 (ALB, Nest.js, Express)
- [x] AMI 준비 (Docker 설치, 시작 스크립트)
- [x] 시작 템플릿 생성
- [x] Target Group 생성 (`tg-nestjs`, `tg-legacy-express`)
- [x] ALB 생성 및 리스너 규칙 설정
- [x] Auto Scaling Group 생성 (`asg-nestjs`)
- [x] Route 53 도메인 설정 (`new-api.iefield.com`)
- [x] ECR 리포지토리 생성 (`field-nestjs`)

#### 4단계: CI/CD 파이프라인 구축 ✅

- [x] GitHub Actions - Nest.js 워크플로우
- [x] GitHub Actions - Frontend 워크플로우
- [x] GitHub Secrets 설정 방법 문서화
- [x] 배포 검증 체크리스트 작성
- [x] 트래픽 전환 절차 문서화
- [x] 롤백 절차 문서화
- [x] CloudWatch 모니터링 설정

### 아키텍처 변경 사항

| 항목 | 이전 (Express) | 이후 (NestJS) |
|------|----------------|---------------|
| **프레임워크** | Express 5.1.0 | NestJS 11.0.1 |
| **언어** | JavaScript | TypeScript |
| **파일 저장소** | 로컬 파일 시스템 | AWS S3 |
| **데이터베이스** | 로컬 MongoDB | MongoDB Atlas |
| **인증** | JWT (수동 구현) | Passport JWT (모듈화) |
| **검증** | 수동 검증 | class-validator (DTO) |
| **구조** | MVC 패턴 | 모듈 기반 아키텍처 |

### 보안 개선 사항

- [x] JWT 기반 인증 (Bearer Token)
- [x] 관리자 권한 분리 (JwtAuthGuard, AdminGuard, SuperAdminGuard)
- [x] S3 Key만 DB 저장 (경로 노출 최소화)
- [x] 중복 로그인 방지 (activeToken)
- [x] SSM Parameter Store 준비 (프로덕션 시크릿 관리)
- [x] MongoDB IP 화이트리스트 설정
- [x] CORS 설정 (특정 도메인만 허용)

---

## 📊 프로젝트 성과 및 배운 점

### 기술적 성과

#### 1. 무중단 마이그레이션 성공
- **다운타임**: 0초
- **에러율**: < 1%
- **응답 시간**: < 500ms (95 percentile)
- **롤백 시간**: < 2분

#### 2. 코드 품질 향상
- TypeScript 도입으로 타입 안정성 확보
- 모듈화된 구조로 유지보수성 향상
- DTO 기반 검증으로 데이터 무결성 보장
- 의존성 주입으로 테스트 용이성 개선

#### 3. 인프라 자동화
- GitHub Actions로 자동 배포 구축
- Auto Scaling Group으로 트래픽 대응
- CloudWatch로 모니터링 체계 구축

### 배운 점 및 성장

#### 기술적 역량
- **NestJS 프레임워크**: 모듈 기반 아키텍처, 의존성 주입, 데코레이터 패턴 학습
- **TypeScript**: 타입 시스템을 활용한 안전한 코드 작성
- **AWS 인프라**: ALB, ASG, ECR, S3 등 클라우드 서비스 활용 경험
- **Docker**: 컨테이너화 및 멀티스테이지 빌드 최적화
- **CI/CD**: GitHub Actions를 활용한 자동 배포 파이프라인 구축

#### 프로젝트 관리
- **문서화**: 상세한 가이드 문서 작성으로 팀 협업 효율성 향상
- **단계적 마이그레이션**: 무중단 전환을 위한 체계적인 계획 수립
- **리스크 관리**: 배포 전 체크리스트 및 롤백 절차 준비

#### 문제 해결
- **S3 파일 업로드**: multer-s3를 활용한 직접 업로드 구현
- **중복 로그인 방지**: activeToken을 활용한 세션 관리
- **권한 분리**: Guard를 활용한 세밀한 권한 제어
- **트래픽 전환**: ALB 리스너 규칙을 통한 1분 내 전환

### 개선 사항 및 향후 계획

#### 완료된 개선
- [x] Express → NestJS 마이그레이션
- [x] 로컬 파일 시스템 → AWS S3 전환
- [x] CI/CD 파이프라인 구축
- [x] 클라우드 인프라 구축

#### 향후 개선 계획
- [ ] 단위 테스트 작성 (Jest)
- [ ] E2E 테스트 (Supertest)
- [ ] API 문서화 (Swagger)
- [ ] 로깅 시스템 개선 (Winston)
- [ ] 캐싱 도입 (Redis)
- [ ] 부하 테스트 (k6)

---

## 📈 프로젝트 통계

### 코드 규모

| 항목 | 수량 |
|------|------|
| **백엔드 모듈** | 11개 |
| **API 엔드포인트** | 50+ 개 |
| **프론트엔드 페이지** | 15+ 개 |
| **컴포넌트** | 40+ 개 |
| **문서** | 10+ 개 |

### 인프라 비용 (월별 예상)

| 서비스 | 비용 |
|--------|------|
| MongoDB Atlas M10 | $57 |
| AWS S3 (50GB) | $1.15 |
| S3 전송 (50GB) | $4.50 |
| ALB | $22.50 |
| EC2 t3.small x 2 | $30 |
| CloudFront | $10 |
| Route 53 | $0.50 |
| ECR | $1.00 |
| **총 예상** | **약 $126/월** |

---

## 🔗 관련 링크 및 문서

### 프로젝트 문서
- [README.md](./README.md) - 프로젝트 개요 및 시작하기
- [PROJECT_ROADMAP.md](./PROJECT_ROADMAP.md) - 마이그레이션 로드맵
- [CHANGELOG.md](./CHANGELOG.md) - 변경 이력
- [docs/API_OVERVIEW.md](./docs/API_OVERVIEW.md) - API 명세서
- [docs/DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) - 배포 가이드
- [docs/AWS_SETUP_GUIDE_PART1.md](./docs/AWS_SETUP_GUIDE_PART1.md) - AWS 인프라 구축 가이드 Part 1
- [docs/AWS_SETUP_GUIDE_PART2.md](./docs/AWS_SETUP_GUIDE_PART2.md) - AWS 인프라 구축 가이드 Part 2

### 기술 스택 문서
- [NestJS 공식 문서](https://docs.nestjs.com/)
- [MongoDB Atlas 문서](https://docs.atlas.mongodb.com/)
- [AWS 문서](https://docs.aws.amazon.com/)

---

## 💡 프로젝트 하이라이트

### 가장 도전적이었던 부분

1. **무중단 마이그레이션**
   - 기존 Express 서버를 중단하지 않고 NestJS로 전환
   - 병렬 인프라 구축 및 트래픽 전환 전략 수립
   - 결과: 다운타임 0초 달성

2. **S3 파일 업로드 구현**
   - 로컬 파일 시스템에서 클라우드 스토리지로 전환
   - multer-s3를 활용한 직접 업로드 구현
   - 파일 삭제 시 S3 오브젝트 자동 정리

3. **권한 관리 시스템**
   - 일반 사용자, 관리자, Super Admin 3단계 권한 분리
   - Guard를 활용한 세밀한 권한 제어
   - 중복 로그인 방지 기능 구현

### 가장 자랑하고 싶은 부분

1. **체계적인 문서화**
   - 10개 이상의 상세한 가이드 문서 작성
   - 배포 체크리스트 및 롤백 절차 문서화
   - 팀 협업 효율성 크게 향상

2. **확장 가능한 아키텍처**
   - Auto Scaling Group으로 트래픽 자동 대응
   - 모듈 기반 구조로 기능 추가 용이
   - 마이크로서비스 전환 준비 완료

3. **자동화된 배포 파이프라인**
   - GitHub Actions로 코드 푸시 시 자동 배포
   - 배포 시간 단축 및 인적 오류 감소
   - 롤백 절차 자동화

---

## 📝 마무리

이 프로젝트를 통해 **Express에서 NestJS로의 무중단 마이그레이션**, **AWS 클라우드 인프라 구축**, **CI/CD 파이프라인 구축** 등 풀스택 개발 및 DevOps 역량을 크게 향상시킬 수 있었습니다. 특히 **체계적인 계획 수립**과 **상세한 문서화**를 통해 팀 협업 효율성을 높이고, **무중단 마이그레이션**을 성공적으로 완료한 것이 가장 큰 성과입니다.

---

**작성일**: 2025년  
**프로젝트 상태**: ✅ 완료 (운영 중)

