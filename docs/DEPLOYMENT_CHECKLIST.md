# Deployment Checklist

## 🔹 Phase 1: 사전 준비

### 환경변수 및 시크릿
- [ ] `.env.example` 기준으로 프로덕션 환경변수 확정
- [ ] AWS SSM Parameter Store에 시크릿 등록
  - `/field/MONGO_URI`
  - `/field/JWT_SECRET`
  - `/field/JWT_EXPIRES_IN`
  - `/field/AWS_REGION`
  - `/field/AWS_S3_BUCKET_NAME`
  - `/field/AWS_S3_PUBLIC_BASE_URL`

### AWS S3
- [ ] S3 버킷 생성 및 설정 확인
  - 버킷 정책: 퍼블릭 읽기 허용 또는 CloudFront 배포
  - CORS 설정: 업로드/GET 허용
- [ ] 테스트 업로드 확인

### MongoDB Atlas
- [ ] 네트워크 액세스 설정
  - ❌ `0.0.0.0/0` 사용 금지
  - ✅ EC2 Elastic IP 화이트리스트
  - ✅ NAT Gateway IP 화이트리스트
  - ✅ VPC Peering (권장)

---

## 🔹 Phase 2: 컨테이너 이미지

### ECR 설정
- [ ] ECR 리포지토리 생성
```bash
aws ecr create-repository \
  --repository-name field-nest \
  --region ap-northeast-2
```

- [ ] ECR 로그인
```bash
aws ecr get-login-password --region ap-northeast-2 | \
  docker login --username AWS --password-stdin \
  <ACCOUNT_ID>.dkr.ecr.ap-northeast-2.amazonaws.com
```

### Docker 이미지 빌드 및 푸시
- [ ] 프로덕션 이미지 빌드
```bash
cd server-nestjs
docker build -t field-nest -f Dockerfile .
```

- [ ] 이미지 태깅
```bash
docker tag field-nest:latest \
  <ACCOUNT_ID>.dkr.ecr.ap-northeast-2.amazonaws.com/field-nest:latest
```

- [ ] ECR 푸시
```bash
docker push \
  <ACCOUNT_ID>.dkr.ecr.ap-northeast-2.amazonaws.com/field-nest:latest
```

---

## 🔹 Phase 3: AWS 인프라

### 네트워크
- [ ] VPC 생성 또는 기존 VPC 사용
- [ ] 퍼블릭 서브넷 2개 (가용영역 분산)
- [ ] 프라이빗 서브넷 2개 (선택, DB/내부용)
- [ ] 인터넷 게이트웨이 연결
- [ ] 라우팅 테이블 설정

### 보안 그룹
- [ ] ALB 보안 그룹
  - Inbound: 80, 443 (0.0.0.0/0)
- [ ] EC2 보안 그룹
  - Inbound: 4002 (ALB 보안 그룹에서만)
  - Outbound: All

### IAM
- [ ] EC2 IAM Role 생성
  - `AmazonS3FullAccess` (또는 특정 버킷만)
  - `AmazonSSMReadOnlyAccess`
  - `CloudWatchLogsFullAccess`

### Load Balancer
- [ ] Application Load Balancer 생성
  - 리스너: HTTP:80, HTTPS:443 (선택)
- [ ] Target Group 생성
  - 프로토콜: HTTP:4002
  - 헬스체크 경로: `/api`
  - Healthy threshold: 2
  - Unhealthy threshold: 3
  - Interval: 30초

### Auto Scaling
- [ ] Launch Template 생성
  - AMI: Amazon Linux 2023 또는 Ubuntu
  - Instance type: t3.small 이상
  - IAM Role: 위에서 생성한 Role
  - User Data: Docker 설치 + ECR 이미지 실행 스크립트
  - 로그 드라이버: `awslogs` (CloudWatch Logs)
  - SSM에서 환경변수 로드

- [ ] Auto Scaling Group 생성
  - Desired capacity: 2
  - Min: 1, Max: 4
  - Target Group 연결
  - Health check type: ELB

### DNS
- [ ] Route 53 레코드 생성
  - Type: A (Alias)
  - Target: ALB

---

## 🔹 Phase 4: CI/CD

### GitHub Actions
- [ ] 워크플로우 파일 작성 (`.github/workflows/deploy-backend.yml`)
  - Trigger: `push` to `main`
  - Steps:
    1. Checkout
    2. Build & Test
    3. ECR 로그인
    4. Docker 이미지 빌드
    5. ECR 푸시
    6. 배포 (ASG 인스턴스 갱신 또는 SSM Run Command)

- [ ] GitHub Secrets 등록
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION`
  - `ECR_REPOSITORY`

### Smoke Test
- [ ] 배포 후 자동 테스트 Job 추가
  - GET `/api` → 200 응답 확인
  - GET `/api/camps` → 응답 확인

---

## 🔹 Phase 5: 배포 및 검증

### 첫 배포
- [ ] CI/CD 파이프라인 실행 또는 수동 배포
- [ ] EC2 인스턴스 시작 확인
- [ ] Docker 컨테이너 실행 확인 (`docker ps`)

### 헬스체크
- [ ] ALB Target Group 상태: `healthy`
- [ ] CloudWatch Logs 수집 확인

### 기능 테스트
- [ ] API 엔드포인트 호출 테스트
  - GET `/api/camps`
  - POST `/api/auth/login`
  - POST `/api/upload/test` (S3 업로드)
- [ ] MongoDB Atlas 연결 확인
- [ ] S3 파일 업로드/삭제 확인

---

## 🔹 Phase 6: 트래픽 전환 (무중단)

### 병행 운영
- [ ] 기존 Express 서버와 Nest.js 서버 병행 운영 확인
- [ ] 두 서버 모두 정상 작동 확인

### 트래픽 스위칭
- [ ] ALB 리스너 규칙 전환
  - 기존 Express Target Group → Nest.js Target Group
- [ ] 또는 Route 53 가중치 라우팅 (점진적 전환)

### 모니터링
- [ ] 오류율 확인 (CloudWatch Metrics)
- [ ] 응답 시간 확인
- [ ] 5xx 에러 없는지 확인

### 롤백 플랜
- [ ] 문제 발생 시 즉시 기존 Target Group으로 전환
- [ ] 이전 버전 이미지 보관 확인

---

## 🔹 Phase 7: 운영 설정

### CloudWatch
- [ ] 대시보드 생성
  - ALB 메트릭 (요청 수, 응답 시간, 5xx)
  - EC2 메트릭 (CPU, 메모리)
  - 로그 쿼리
- [ ] 알람 설정
  - 5xx 에러율 > 1%
  - Target unhealthy
  - CPU > 80%

### 비용 관리
- [ ] 리소스 태깅
  - Project: FIELD
  - Environment: Production
- [ ] 비용 모니터링 설정

### 백업
- [ ] MongoDB Atlas 자동 백업 확인
- [ ] S3 버전 관리 또는 백업 정책

### 문서화
- [ ] 배포 절차 문서 업데이트
- [ ] 롤백 방법 문서화
- [ ] 트러블슈팅 가이드 작성

---

## 📊 최종 확인

- [ ] 모든 엔드포인트 동작 확인
- [ ] Frontend-Backend 연동 확인
- [ ] S3 업로드/삭제 확인
- [ ] JWT 인증 확인
- [ ] 관리자 권한 확인
- [ ] 로그 수집 확인
- [ ] 헬스체크 통과 확인

---

## 🎯 완료 기준

✅ ALB Target Group이 `healthy` 상태  
✅ 모든 주요 API가 정상 응답  
✅ CloudWatch Logs에 로그 수집됨  
✅ Frontend에서 Backend API 호출 성공  
✅ S3 파일 업로드/다운로드 정상  
✅ MongoDB Atlas 연결 정상  


