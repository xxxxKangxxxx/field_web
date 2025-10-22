# 🚀 FIELD 프로젝트 배포 및 트래픽 전환 가이드

## 📋 목차

1. [사전 준비](#1-사전-준비)
2. [GitHub Secrets 설정](#2-github-secrets-설정)
3. [첫 배포 실행](#3-첫-배포-실행)
4. [배포 검증](#4-배포-검증)
5. [트래픽 전환](#5-트래픽-전환)
6. [롤백 절차](#6-롤백-절차)
7. [모니터링](#7-모니터링)

---

## 1. 사전 준비

### ✅ 완료해야 할 설정 체크리스트

#### Part 1: 공용 리소스
- [ ] MongoDB Atlas 클러스터 생성 및 Connection String 획득
- [ ] AWS S3 버킷 생성 (`field-uploads-prod`)
- [ ] IAM 사용자 생성 및 Access Key 획득
- [ ] S3 CORS 및 버킷 정책 설정 완료

#### Part 2: 백엔드 인프라
- [ ] VPC 및 서브넷 설정 (최소 2개 AZ)
- [ ] 보안 그룹 생성 (ALB, Nest.js, Express)
- [ ] AMI 생성 (Nest.js 환경 설치 완료)
- [ ] 시작 템플릿 생성
- [ ] Target Group 생성 (`tg-nestjs`, `tg-legacy-express`)
- [ ] ALB 생성 및 리스너 규칙 설정
- [ ] Auto Scaling Group 생성 (`asg-nestjs`)
- [ ] Route 53 레코드 생성 (`new-api.iefield.com`)
- [ ] ECR 리포지토리 생성 (`field-nestjs`)

#### Part 3: Frontend 인프라 (선택 사항)
- [ ] S3 버킷 생성 (`field-frontend-prod`)
- [ ] CloudFront Distribution 생성
- [ ] Route 53 레코드 연결 (`www.iefield.com`)

---

## 2. GitHub Secrets 설정

### 🔐 필수 Secrets

GitHub 리포지토리 설정에서 다음 Secrets를 추가하세요:

**Settings > Secrets and variables > Actions > New repository secret**

| Secret 이름 | 값 | 설명 |
|-------------|-----|------|
| `AWS_ACCESS_KEY_ID` | `AKIAIOSFODNN7EXAMPLE` | IAM 사용자 Access Key ID |
| `AWS_SECRET_ACCESS_KEY` | `wJalrXUtnFEMI/K7MDENG/...` | IAM 사용자 Secret Access Key |
| `AWS_ACCOUNT_ID` | `123456789012` | AWS 계정 ID (12자리) |

### 🔧 추가 환경변수 (workflow 파일에 직접 입력)

`.github/workflows/deploy-nestjs.yml` 파일의 `env` 섹션 확인:

```yaml
env:
  AWS_REGION: ap-northeast-2
  ECR_REPOSITORY: field-nestjs
  ASG_NAME: asg-nestjs # 실제 ASG 이름으로 변경
```

`.github/workflows/deploy-frontend.yml` 파일의 `env` 섹션 확인:

```yaml
env:
  AWS_REGION: ap-northeast-2
  S3_BUCKET: field-frontend-prod # 실제 S3 버킷 이름
  CLOUDFRONT_DISTRIBUTION_ID: E1234567890ABC # CloudFront ID
```

---

## 3. 첫 배포 실행

### 3-1. Nest.js 배포

#### 자동 배포 (권장)

1. **코드 변경 및 커밋**
   ```bash
   cd server-nestjs
   # 코드 수정...
   git add .
   git commit -m "feat: Add user authentication module"
   ```

2. **Main 브랜치에 Push**
   ```bash
   git push origin main
   ```

3. **GitHub Actions 확인**
   - GitHub 리포지토리 > **Actions** 탭 이동
   - "Deploy Nest.js to AWS" 워크플로우 실행 확인
   - 각 단계별 로그 확인

#### 수동 배포

1. GitHub 리포지토리 > **Actions** 탭

2. **Deploy Nest.js to AWS** 선택

3. **Run workflow** 클릭
   ```
   Use workflow from: main
   ```

4. **Run workflow** 버튼 클릭

### 3-2. Frontend 배포

#### 자동 배포

1. **코드 변경 및 커밋**
   ```bash
   cd frontend
   # 코드 수정...
   git add .
   git commit -m "feat: Update homepage design"
   ```

2. **Main 브랜치에 Push**
   ```bash
   git push origin main
   ```

3. **GitHub Actions 확인**
   - "Deploy Frontend to S3 and CloudFront" 워크플로우 실행 확인

---

## 4. 배포 검증

### 4-1. Nest.js 배포 검증

#### Step 1: Auto Scaling Group 확인

```bash
# AWS CLI로 ASG 상태 확인
aws autoscaling describe-auto-scaling-groups \
  --auto-scaling-group-names asg-nestjs \
  --region ap-northeast-2 \
  --query "AutoScalingGroups[0].Instances[*].[InstanceId,HealthStatus,LifecycleState]" \
  --output table
```

예상 출력:
```
-----------------------------------------------------------------
|            DescribeAutoScalingGroups                          |
+----------------------+----------+---------------------------+
|  i-0123456789abcdef0 |  Healthy |  InService               |
|  i-0123456789abcdef1 |  Healthy |  InService               |
+----------------------+----------+---------------------------+
```

#### Step 2: Target Group Health 확인

```bash
# Target Group 헬스 체크
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:ap-northeast-2:123456789012:targetgroup/tg-nestjs/xxxxxxxxxxxxx \
  --region ap-northeast-2
```

예상 상태: `State: healthy`

#### Step 3: API 엔드포인트 테스트

```bash
# 테스트 도메인으로 접속
curl -I https://new-api.iefield.com

# 예상 응답
HTTP/1.1 200 OK
# 또는
HTTP/1.1 404 Not Found (정상 - 루트 경로에 핸들러 없음)
```

```bash
# 실제 API 엔드포인트 테스트 (예: 사용자 목록)
curl https://new-api.iefield.com/api/users
```

#### Step 4: 애플리케이션 로그 확인

EC2 인스턴스에 SSH 접속:

```bash
ssh -i field-keypair.pem ec2-user@[인스턴스-IP]

# Docker 컨테이너 로그 확인
docker logs field-nestjs --tail 100 -f

# 예상 로그:
# "🚀 Nest.js 서버 실행 중: http://localhost:4002"
# "✅ MongoDB 연결 성공!"
```

### 4-2. Frontend 배포 검증

#### Step 1: S3 파일 확인

```bash
# S3 버킷 파일 목록
aws s3 ls s3://field-frontend-prod/ --recursive --human-readable

# 예상 출력:
# index.html
# assets/index-[hash].js
# assets/index-[hash].css
```

#### Step 2: CloudFront 무효화 상태 확인

```bash
aws cloudfront list-invalidations \
  --distribution-id E1234567890ABC \
  --region us-east-1

# 상태: Completed
```

#### Step 3: 웹사이트 접속 테스트

```bash
# 메인 페이지 로드 테스트
curl -I https://iefield.com

# 예상 응답
HTTP/2 200
content-type: text/html
```

브라우저에서 https://iefield.com 접속 및 기능 테스트

---

## 5. 트래픽 전환

### 🎯 목표
`api.iefield.com`의 트래픽을 기존 Express 서버에서 새 Nest.js 서버로 전환

### 5-1. 전환 전 최종 체크

```
✅ 체크리스트:
- [ ] new-api.iefield.com에서 모든 기능 정상 작동 확인
- [ ] 데이터베이스 연결 정상 확인
- [ ] S3 파일 업로드 정상 작동 확인
- [ ] 인증(JWT) 정상 작동 확인
- [ ] 주요 API 엔드포인트 응답 시간 측정
- [ ] 에러 로그 확인 (치명적 에러 없음)
- [ ] 부하 테스트 완료 (선택 사항)
```

### 5-2. ALB 리스너 규칙 수정 (무중단 전환)

#### AWS Console을 통한 전환

1. **EC2 > 로드 밸런서 > field-alb 선택**

2. **리스너 탭 > HTTP:80 리스너 선택**

3. **규칙 보기 클릭**

4. **`api.iefield.com` 규칙 선택 (우선순위 1)**

5. **작업 > 편집 클릭**

6. **"대상 그룹으로 전달" 변경**
   ```
   기존: tg-legacy-express
   새로: tg-nestjs
   ```

7. **저장 클릭**

#### 전환 소요 시간

⏱️ **약 1-2분**
- ALB가 새 규칙을 적용하는 데 수초 소요
- 기존 연결은 유지되며 새 요청만 Nest.js로 라우팅

### 5-3. DNS 전파 확인 (이미 완료)

Route 53에서 `api.iefield.com`은 이미 ALB를 가리키므로 추가 DNS 변경 불필요

### 5-4. 전환 직후 모니터링 (필수)

#### 1) 실시간 로그 모니터링

```bash
# EC2 인스턴스에서
docker logs field-nestjs -f

# CloudWatch Logs 확인 (설정한 경우)
aws logs tail /aws/ec2/field-nestjs --follow
```

#### 2) 에러율 확인

```bash
# ALB 5xx 에러 확인
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApplicationELB \
  --metric-name HTTPCode_Target_5XX_Count \
  --dimensions Name=LoadBalancer,Value=app/field-alb/xxxxxxxxxxxxx \
  --start-time $(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 60 \
  --statistics Sum
```

#### 3) 응답 시간 확인

```bash
# 여러 번 요청하여 응답 시간 측정
for i in {1..10}; do
  curl -o /dev/null -s -w "응답 시간: %{time_total}s\n" https://api.iefield.com
done
```

---

## 6. 롤백 절차

### 🚨 긴급 롤백 (1분 내 복구)

문제 발생 시 즉시 이전 상태로 복구:

1. **EC2 > 로드 밸런서 > field-alb**

2. **리스너 > HTTP:80 > 규칙 보기**

3. **`api.iefield.com` 규칙 선택**

4. **작업 > 편집**

5. **대상 그룹 변경**
   ```
   tg-nestjs → tg-legacy-express (원래대로)
   ```

6. **저장 클릭**

⏱️ **약 1분 내 복구 완료**

### 🔧 부분 롤백 (가중치 기반 트래픽 분산)

점진적 전환을 원할 경우:

1. **ALB 리스너 규칙에서 가중치 기반 라우팅 설정**
   ```
   - tg-nestjs: 50% (신규)
   - tg-legacy-express: 50% (기존)
   ```

2. **문제 없으면 점진적으로 증가**
   ```
   Day 1: 50% / 50%
   Day 2: 70% / 30%
   Day 3: 90% / 10%
   Day 4: 100% / 0%
   ```

---

## 7. 모니터링

### 7-1. CloudWatch 대시보드 (권장)

AWS CloudWatch에서 대시보드 생성:

#### 주요 메트릭

1. **ALB 메트릭**
   - `RequestCount`: 총 요청 수
   - `TargetResponseTime`: 평균 응답 시간
   - `HTTPCode_Target_5XX_Count`: 서버 에러 수
   - `HTTPCode_Target_4XX_Count`: 클라이언트 에러 수

2. **EC2 메트릭**
   - `CPUUtilization`: CPU 사용률
   - `NetworkIn/Out`: 네트워크 트래픽

3. **Auto Scaling 메트릭**
   - `GroupInServiceInstances`: 실행 중인 인스턴스 수
   - `GroupDesiredCapacity`: 원하는 용량

### 7-2. CloudWatch Alarms 설정

#### 알람 1: 높은 에러율

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name field-high-5xx-rate \
  --alarm-description "Alert when 5xx error rate is high" \
  --metric-name HTTPCode_Target_5XX_Count \
  --namespace AWS/ApplicationELB \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1
```

#### 알람 2: 높은 응답 시간

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name field-high-response-time \
  --alarm-description "Alert when response time is high" \
  --metric-name TargetResponseTime \
  --namespace AWS/ApplicationELB \
  --statistic Average \
  --period 60 \
  --threshold 2.0 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

### 7-3. 로그 수집 (CloudWatch Logs)

> 💡 **간소화된 방법**: Docker `awslogs` 드라이버 사용  
> AMI 생성 시 이미 `start.sh`에 설정되어 있습니다.

#### 로그 확인 방법

**방법 1: AWS Console**

1. **CloudWatch > 로그 그룹** 이동
2. `/aws/ec2/field-nestjs` 선택
3. 각 인스턴스별 로그 스트림 확인

**방법 2: AWS CLI**

```bash
# 실시간 로그 확인
aws logs tail /aws/ec2/field-nestjs --follow --region ap-northeast-2

# 특정 인스턴스 로그만 확인
aws logs tail /aws/ec2/field-nestjs --follow \
  --log-stream-names "i-0123456789abcdef0" \
  --region ap-northeast-2

# 최근 1시간 로그 필터링 (에러만)
aws logs filter-log-events \
  --log-group-name /aws/ec2/field-nestjs \
  --filter-pattern "ERROR" \
  --start-time $(date -u -d '1 hour ago' +%s)000 \
  --region ap-northeast-2
```

**방법 3: EC2 인스턴스에서 직접**

```bash
# SSH 접속 후
docker logs field-nestjs -f
```

#### CloudWatch Logs Insights 쿼리 예시

CloudWatch > Logs Insights에서 고급 쿼리:

```sql
# 에러 로그만 추출
fields @timestamp, @message
| filter @message like /ERROR/
| sort @timestamp desc
| limit 100

# 응답 시간 분석 (Nest.js 로그 패턴에 따라 조정)
fields @timestamp, @message
| filter @message like /Request processed/
| parse @message /duration: (?<duration>\d+)ms/
| stats avg(duration), max(duration), min(duration) by bin(5m)

# 특정 API 엔드포인트 호출 추적
fields @timestamp, @message
| filter @message like /POST \/api\/users/
| sort @timestamp desc
```

#### IAM 역할 권한 확인

EC2 인스턴스의 `field-ec2-role`에 CloudWatch Logs 권한이 있는지 확인:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:ap-northeast-2:*:log-group:/aws/ec2/field-nestjs:*"
    }
  ]
}
```

> ✅ `CloudWatchLogsFullAccess` 정책이 이미 연결되어 있다면 추가 설정 불필요

---

## 8. 리소스 정리

### 8-1. Legacy 리소스 제거 (전환 완료 후)

트래픽 전환이 안정적으로 완료되면 (약 1-2주 후):

1. **Auto Scaling Group 제거** (Express Legacy)
   ```bash
   aws autoscaling delete-auto-scaling-group \
     --auto-scaling-group-name asg-legacy-express \
     --force-delete \
     --region ap-northeast-2
   ```

2. **Target Group 제거**
   ```bash
   aws elbv2 delete-target-group \
     --target-group-arn arn:aws:elasticloadbalancing:ap-northeast-2:123456789012:targetgroup/tg-legacy-express/xxxxxxxxxxxxx
   ```

3. **시작 템플릿 제거** (Express용)

4. **AMI 제거** (Express용)

5. **보안 그룹 제거** (`field-express-sg`)

### 8-2. 비용 절감 효과

제거 후 예상 비용 절감:
```
- EC2 인스턴스 (Express) x 2: $30/월 절감
- Auto Scaling: 무료 (리소스 제거로 간접 절감)
- 총 절감: 약 $30-40/월
```

---

## 📊 배포 타임라인 (전체 프로세스)

```
Week 1: 준비 단계
├─ Day 1-2: MongoDB Atlas 및 S3 설정
├─ Day 3-4: AWS 인프라 구축 (VPC, ALB, ASG)
└─ Day 5: ECR 및 Route 53 설정

Week 2-3: 개발 및 테스트
├─ Nest.js 모듈 개발
├─ GitHub Actions 설정
├─ new-api.iefield.com 테스트 배포
└─ 기능 검증 및 버그 수정

Week 4: 트래픽 전환
├─ Day 1-2: 최종 테스트 및 검증
├─ Day 3: 트래픽 전환 (1분)
├─ Day 4-5: 모니터링 및 안정화
└─ Day 6-7: Legacy 리소스 유지 (롤백 대비)

Week 5+: 정리
└─ Legacy 리소스 제거 및 비용 최적화
```

---

## ✅ 배포 완료 체크리스트

### 최종 검증
- [ ] `api.iefield.com`이 Nest.js 서버로 연결됨
- [ ] 모든 API 엔드포인트 정상 작동
- [ ] 프론트엔드-백엔드 통신 정상
- [ ] 파일 업로드 (S3) 정상 작동
- [ ] 인증 시스템 정상 작동
- [ ] 데이터베이스 CRUD 정상
- [ ] 에러율 정상 수준 (< 1%)
- [ ] 응답 시간 정상 수준 (< 500ms)

### 모니터링 설정
- [ ] CloudWatch 대시보드 생성
- [ ] CloudWatch Alarms 설정
- [ ] CloudWatch Logs 수집 설정
- [ ] 알림 채널 설정 (이메일/Slack)

### 문서화
- [ ] API 문서 업데이트
- [ ] 팀 공유 및 교육
- [ ] 롤백 절차 숙지

---

## 🎉 축하합니다!

**Express에서 Nest.js로의 무중단 마이그레이션이 완료되었습니다!**

### 다음 단계
1. 성능 최적화 및 튜닝
2. 추가 기능 개발
3. 모니터링 데이터 분석
4. 비용 최적화

---

**작성일**: 2025-10-21  
**버전**: 1.0.0  
**문의**: 개발팀 리더

