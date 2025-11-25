# Changelog

## [2025-10-23] Express → Nest.js 마이그레이션 완료

### 🎉 주요 성과
- Express 서버를 Nest.js로 완전 마이그레이션
- 모든 기능 정상 작동 확인
- Frontend-Backend 연동 성공

### ✅ 완료된 모듈 (11개)
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

### 🏗️ 아키텍처 변경
- **이전**: Express + 로컬 파일 시스템
- **이후**: Nest.js + MongoDB Atlas + AWS S3

### 🔐 보안 개선
- JWT 기반 인증 (Bearer Token)
- 관리자 권한 분리 (JwtAuthGuard, AdminGuard)
- S3 Key만 DB 저장 (경로 노출 최소화)
- 중복 로그인 방지 (activeToken)
- SSM Parameter Store 준비 (프로덕션 시크릿 관리)

### 📤 업로드 정책
- DB에는 S3 Key만 저장 (예: `camps/1234567890-abc.jpg`)
- 응답에는 전체 URL 반환 (`AWS_S3_PUBLIC_BASE_URL` + Key)
- CloudFront 도입 시 환경변수만 변경하면 됨
- 파일 삭제 시 S3 오브젝트도 자동 정리

### 🐳 Docker 환경
- 개발용: `Dockerfile.dev` (hot-reload)
- 프로덕션용: `Dockerfile` (multi-stage build)
- Docker Compose: MongoDB, Mongo Express, Nest.js, Frontend
- 환경변수 주입: `env_file: ./server-nestjs/.env`

### 🔧 주요 설정 변경
- 글로벌 API 접두사: `/api` 추가
- ValidationPipe: `enableImplicitConversion` 활성화, `whitelist` 비활성화
- CORS: `localhost:5173`, `localhost:3000` 허용
- Recruits: 단수/복수 경로 모두 지원 (`/recruit`, `/recruits`)
- Users: `/departments` 엔드포인트 추가

### 🗑️ 레거시 정리
- Express 서버 → `server-express-backup/`으로 이동
- `docker-compose.yml`에서 `backend-legacy` 제거
- `.gitignore`에 백업 디렉토리 추가

### 🧪 테스트 완료
- Auth: 회원가입, 로그인, 로그아웃, 내 정보 조회
- Upload: S3 테스트/캠프/뉴스 업로드
- Camps: 생성, 조회, 수정(포스터 변경), 삭제
- News: 생성(파일 포함), 조회, 수정(파일 변경), 삭제
- Recruits: 생성, 활성화된 일정 조회, 삭제
- Frontend: Nest.js 연동 확인 (localhost:4002)

### 📚 문서화
- `server-nestjs/README.md`: Nest.js 서버 가이드
- `server-nestjs/.env.example`: 환경변수 예시
- `docs/API_OVERVIEW.md`: 전체 API 명세
- `docs/DEPLOYMENT_CHECKLIST.md`: 배포 체크리스트
- `CHANGELOG.md`: 변경 이력

### 🔮 다음 단계 (배포)
- AWS 인프라 구축 (VPC, ALB, ASG, Route 53)
- CI/CD 파이프라인 구축 (GitHub Actions)
- 무중단 트래픽 전환
- CloudWatch 모니터링 설정

---

## [이전 버전]

### [2024-xx-xx] 초기 개발
- Express 서버 구축
- MongoDB 연동
- 로컬 파일 시스템 업로드


