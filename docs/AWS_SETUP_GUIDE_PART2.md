# ☁️ AWS 인프라 구축 가이드 - Part 2: 백엔드 인프라

## 📋 목차

1. [VPC 및 네트워크 설정](#1-vpc-및-네트워크-설정)
2. [보안 그룹 생성](#2-보안-그룹-생성)
3. [AMI 준비 (EC2 이미지)](#3-ami-준비-ec2-이미지)
4. [시작 템플릿 생성](#4-시작-템플릿-생성)
5. [Target Group 생성](#5-target-group-생성)
6. [Application Load Balancer 생성](#6-application-load-balancer-생성)
7. [Auto Scaling Group 생성](#7-auto-scaling-group-생성)
8. [Route 53 도메인 설정](#8-route-53-도메인-설정)
9. [ECR 리포지토리 생성](#9-ecr-리포지토리-생성)

---

## 1. VPC 및 네트워크 설정

### 🎯 목적
EC2 인스턴스와 ALB가 작동할 가상 네트워크 환경 구성

### 1-1. 기본 VPC 확인

1. **VPC 서비스 접속** (AWS Console)

2. **VPC 목록 확인**
   - 기본 VPC가 있다면 사용 가능: `vpc-xxxxx (default)`
   - VPC CIDR: `172.31.0.0/16`

3. **서브넷 확인**
   - **최소 2개의 가용 영역(AZ)에 서브넷 필요**
   - 예시:
     ```
     subnet-xxxxx | ap-northeast-2a | 172.31.0.0/20
     subnet-yyyyy | ap-northeast-2b | 172.31.16.0/20
     subnet-zzzzz | ap-northeast-2c | 172.31.32.0/20
     ```

> ✅ **기본 VPC가 있다면 그대로 사용 가능합니다.**

### 1-2. 커스텀 VPC 생성 (선택 사항)

프로덕션 환경에서는 별도 VPC 권장:

1. **VPC 생성 클릭**

2. **VPC 설정**
   ```
   이름 태그: field-vpc
   IPv4 CIDR 블록: 10.0.0.0/16
   IPv6 CIDR 블록: IPv6 CIDR 블록 없음
   테넌시: 기본값
   ```

3. **퍼블릭 서브넷 생성** (2개 이상의 AZ)
   
   **서브넷 1**:
   ```
   이름: field-public-subnet-2a
   VPC: field-vpc
   가용 영역: ap-northeast-2a
   IPv4 CIDR 블록: 10.0.1.0/24
   ```
   
   **서브넷 2**:
   ```
   이름: field-public-subnet-2b
   VPC: field-vpc
   가용 영역: ap-northeast-2b
   IPv4 CIDR 블록: 10.0.2.0/24
   ```

4. **인터넷 게이트웨이 생성 및 연결**
   - IGW 이름: `field-igw`
   - VPC에 연결: `field-vpc`

5. **라우팅 테이블 설정**
   ```
   대상: 0.0.0.0/0
   타겟: field-igw
   ```

---

## 2. 보안 그룹 생성

### 🎯 목적
EC2 인스턴스와 ALB에 대한 방화벽 규칙 설정

### 2-1. ALB용 보안 그룹

1. **EC2 > 보안 그룹 > 보안 그룹 생성**

2. **기본 세부 정보**
   ```
   보안 그룹 이름: field-alb-sg
   설명: Security group for FIELD Application Load Balancer
   VPC: [사용할 VPC 선택]
   ```

3. **인바운드 규칙**
   
   | 유형 | 프로토콜 | 포트 범위 | 소스 | 설명 |
   |------|----------|-----------|------|------|
   | HTTP | TCP | 80 | 0.0.0.0/0 | Allow HTTP from anywhere |
   | HTTPS | TCP | 443 | 0.0.0.0/0 | Allow HTTPS from anywhere |

4. **아웃바운드 규칙**: 기본값 유지 (모든 트래픽 허용)

### 2-2. Nest.js 서버용 보안 그룹

1. **보안 그룹 생성**
   ```
   보안 그룹 이름: field-nestjs-sg
   설명: Security group for FIELD Nest.js backend servers
   VPC: [사용할 VPC 선택]
   ```

2. **인바운드 규칙**
   
   | 유형 | 프로토콜 | 포트 범위 | 소스 | 설명 |
   |------|----------|-----------|------|------|
   | 사용자 지정 TCP | TCP | 4002 | `field-alb-sg` | Allow traffic from ALB |
   | SSH | TCP | 22 | [내 IP] | SSH access for management |

   > 🔑 **소스에 보안 그룹 ID 사용**: ALB에서만 트래픽을 받도록 제한

### 2-3. Express 레거시 서버용 보안 그룹 (기존)

1. **보안 그룹 생성**
   ```
   보안 그룹 이름: field-express-sg
   설명: Security group for FIELD Express legacy servers
   VPC: [사용할 VPC 선택]
   ```

2. **인바운드 규칙**
   
   | 유형 | 프로토콜 | 포트 범위 | 소스 | 설명 |
   |------|----------|-----------|------|------|
   | 사용자 지정 TCP | TCP | 4001 | `field-alb-sg` | Allow traffic from ALB |
   | SSH | TCP | 22 | [내 IP] | SSH access for management |

---

## 3. AMI 준비 (EC2 이미지)

### 🎯 목적
Nest.js 애플리케이션이 설치된 EC2 인스턴스 이미지 생성

### 3-1. 베이스 EC2 인스턴스 생성

1. **EC2 > 인스턴스 > 인스턴스 시작**

2. **AMI 선택**
   ```
   Amazon Linux 2023 AMI (HVM) - Kernel 6.1
   64비트 (x86)
   ```

3. **인스턴스 유형 선택**
   ```
   t3.micro (프리 티어)
   또는
   t3.small (프로덕션 권장)
   ```

4. **키 페어 생성** (SSH 접속용)
   ```
   키 페어 이름: field-keypair
   키 페어 유형: RSA
   프라이빗 키 파일 형식: .pem
   ```
   > 🔑 **키 페어 다운로드 후 안전하게 보관!**

5. **네트워크 설정**
   ```
   VPC: [사용할 VPC]
   서브넷: [아무 퍼블릭 서브넷]
   퍼블릭 IP 자동 할당: 활성화
   보안 그룹: field-nestjs-sg
   ```

6. **스토리지 구성**
   ```
   크기: 20 GiB
   볼륨 유형: gp3
   ```

7. **인스턴스 시작**

### 3-2. Nest.js 환경 설정

SSH로 인스턴스에 접속:

```bash
chmod 400 field-keypair.pem
ssh -i field-keypair.pem ec2-user@[인스턴스-퍼블릭-IP]
```

#### Docker 설치 및 설정

```bash
# 시스템 업데이트
sudo yum update -y

# Docker 설치
sudo yum install docker -y

# Docker 시작 및 부팅 시 자동 시작 설정
sudo systemctl start docker
sudo systemctl enable docker

# ec2-user를 docker 그룹에 추가
sudo usermod -a -G docker ec2-user

# 로그아웃 후 재접속 (또는 newgrp docker)
exit
```

재접속 후:

```bash
# Docker 설치 확인
docker --version

# Docker Compose 설치
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 설치 확인
docker-compose --version
```

#### CloudWatch Logs 그룹 생성 (필수)

```bash
# CloudWatch Logs 그룹 생성
aws logs create-log-group --log-group-name /aws/ec2/field-nestjs --region ap-northeast-2
```

#### 애플리케이션 디렉토리 준비

```bash
# 애플리케이션 디렉토리 생성 (.env 파일은 생성하지 않음!)
sudo mkdir -p /opt/field-app
sudo chown ec2-user:ec2-user /opt/field-app
cd /opt/field-app
```

> 🚨 **중요**: `.env` 파일을 생성하지 않습니다!  
> 모든 비밀 정보는 **AWS SSM Parameter Store**에서 가져옵니다.  
> 자세한 내용은 [AWS_SECRETS_MANAGEMENT.md](./AWS_SECRETS_MANAGEMENT.md)를 참조하세요.

#### 시작 스크립트 생성 (SSM 사용)

```bash
cat > /opt/field-app/start.sh << 'EOF'
#!/bin/bash
set -e

cd /opt/field-app

# AWS 리전 및 계정 설정
AWS_REGION="ap-northeast-2"
AWS_ACCOUNT_ID="[AWS-ACCOUNT-ID]"  # 실제 계정 ID로 변경
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo "📦 SSM Parameter Store에서 환경변수 가져오는 중..."

# SSM에서 파라미터 가져오기 (IAM 역할 자동 사용)
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
  docker login --username AWS --password-stdin $ECR_REGISTRY

# 최신 이미지 pull
echo "📥 최신 Docker 이미지 다운로드 중..."
docker pull ${ECR_REGISTRY}/field-nestjs:latest

# 기존 컨테이너 중지 및 제거
echo "🛑 기존 컨테이너 중지 중..."
docker stop field-nestjs 2>/dev/null || true
docker rm field-nestjs 2>/dev/null || true

# 새 컨테이너 실행 (환경변수 직접 주입, CloudWatch Logs 사용)
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
  ${ECR_REGISTRY}/field-nestjs:latest

echo "✅ Nest.js 서버 시작 완료"
echo "📊 로그 확인: docker logs field-nestjs -f"
echo "☁️  CloudWatch: https://console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}#logsV2:log-groups/log-group/%2Faws%2Fec2%2Ffield-nestjs"
EOF

chmod +x /opt/field-app/start.sh
```

> 💡 **주요 개선 사항**:
> - ✅ `.env` 파일 제거 (보안 위험 제거)
> - ✅ SSM Parameter Store에서 비밀 정보 가져오기
> - ✅ IAM 역할 자동 사용 (AWS Access Key 불필요)
> - ✅ CloudWatch Logs 자동 전송 (awslogs 드라이버)

#### 시스템 서비스 등록 (자동 시작)

```bash
sudo cat > /etc/systemd/system/field-app.service << 'EOF'
[Unit]
Description=FIELD Nest.js Application
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/field-app
ExecStart=/opt/field-app/start.sh
User=ec2-user
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable field-app.service
```

### 3-3. AMI 생성

1. **EC2 > 인스턴스 선택**

2. **작업 > 이미지 및 템플릿 > 이미지 생성**

3. **이미지 생성 설정**
   ```
   이미지 이름: field-nestjs-ami-v1
   이미지 설명: FIELD Nest.js application with Docker
   재부팅 안 함: ✅ 체크 (다운타임 없음)
   ```

4. **이미지 생성 클릭**

5. **AMI 생성 완료 대기** (5-10분 소요)

---

## 4. 시작 템플릿 생성

### 🎯 목적
Auto Scaling에서 사용할 EC2 인스턴스 설정 템플릿

1. **EC2 > 시작 템플릿 > 시작 템플릿 생성**

2. **시작 템플릿 이름 및 설명**
   ```
   시작 템플릿 이름: field-nestjs-launch-template
   템플릿 버전 설명: Initial version with Nest.js setup
   ```

3. **애플리케이션 및 OS 이미지 (AMI)**
   ```
   내 AMI: field-nestjs-ami-v1 선택
   ```

4. **인스턴스 유형**
   ```
   t3.small (프로덕션 권장)
   또는
   t3.micro (테스트용)
   ```

5. **키 페어**
   ```
   field-keypair
   ```

6. **네트워크 설정**
   ```
   보안 그룹: field-nestjs-sg
   ```

7. **고급 세부 정보**
   
   **IAM 인스턴스 프로파일**: 
   - ECR 접근을 위한 IAM 역할 필요
   - **IAM > 역할 > 역할 만들기**
     ```
     신뢰할 수 있는 엔터티 유형: AWS 서비스
     사용 사례: EC2
     권한 정책:
       - AmazonEC2ContainerRegistryReadOnly
       - CloudWatchLogsFullAccess
     역할 이름: field-ec2-role
     ```
   
   **사용자 데이터** (선택 사항):
   ```bash
   #!/bin/bash
   systemctl start field-app.service
   ```

8. **시작 템플릿 생성 클릭**

---

## 5. Target Group 생성

### 🎯 목적
ALB가 트래픽을 전달할 대상 그룹 생성

### 5-1. Nest.js용 Target Group

1. **EC2 > 로드 밸런싱 > 대상 그룹 > 대상 그룹 생성**

2. **대상 유형 선택**
   ```
   ✅ 인스턴스
   ```

3. **대상 그룹 이름**
   ```
   대상 그룹 이름: tg-nestjs
   프로토콜: HTTP
   포트: 4002
   VPC: [사용할 VPC]
   프로토콜 버전: HTTP1
   ```

4. **상태 검사**
   ```
   상태 검사 프로토콜: HTTP
   상태 검사 경로: /
   
   고급 상태 검사 설정:
   정상 임계 값: 2
   비정상 임계 값: 2
   제한 시간: 5초
   간격: 30초
   성공 코드: 200,404
   ```

5. **대상 그룹 생성 클릭**

   > ⚠️ **아직 대상 등록하지 않음** (Auto Scaling이 자동으로 등록)

### 5-2. Express Legacy용 Target Group (기존)

1. **대상 그룹 생성**
   ```
   대상 그룹 이름: tg-legacy-express
   프로토콜: HTTP
   포트: 4001
   VPC: [사용할 VPC]
   ```

2. **상태 검사**
   ```
   상태 검사 경로: /
   성공 코드: 200
   ```

---

## 6. Application Load Balancer 생성

### 🎯 목적
도메인별로 트래픽을 적절한 Target Group으로 라우팅

### 6-1. ALB 생성

1. **EC2 > 로드 밸런싱 > 로드 밸런서 > 로드 밸런서 생성**

2. **로드 밸런서 유형 선택**
   ```
   ✅ Application Load Balancer
   ```

3. **기본 구성**
   ```
   로드 밸런서 이름: field-alb
   체계: 인터넷 경계
   IP 주소 유형: IPv4
   ```

4. **네트워크 매핑**
   ```
   VPC: [사용할 VPC]
   매핑: 최소 2개의 가용 영역 선택
     ✅ ap-northeast-2a (subnet-xxxxx)
     ✅ ap-northeast-2b (subnet-yyyyy)
   ```

5. **보안 그룹**
   ```
   ✅ field-alb-sg
   ```

6. **리스너 및 라우팅**
   
   **리스너 1: HTTP:80**
   ```
   프로토콜: HTTP
   포트: 80
   기본 작업: tg-legacy-express (임시, 나중에 변경)
   ```

7. **로드 밸런서 생성 클릭**

8. **ALB DNS 이름 확인 및 저장**
   ```
   예시: field-alb-1234567890.ap-northeast-2.elb.amazonaws.com
   ```

### 6-2. 리스너 규칙 추가 (도메인 기반 라우팅)

ALB 생성 완료 후:

1. **field-alb 선택 > 리스너 탭**

2. **HTTP:80 리스너 선택 > 규칙 보기**

3. **규칙 추가 클릭**

   **규칙 1: 기존 도메인 (Express)**
   ```
   조건:
     - 호스트 헤더: api.iefield.com
   
   작업:
     - 대상 그룹으로 전달: tg-legacy-express
   
   우선순위: 1
   ```

   **규칙 2: 새 도메인 (Nest.js)**
   ```
   조건:
     - 호스트 헤더: new-api.iefield.com
   
   작업:
     - 대상 그룹으로 전달: tg-nestjs
   
   우선순위: 2
   ```

4. **저장**

---

## 7. Auto Scaling Group 생성

### 🎯 목적
트래픽에 따라 EC2 인스턴스를 자동으로 증가/감소

### 7-1. Nest.js용 Auto Scaling Group

1. **EC2 > Auto Scaling > Auto Scaling 그룹 > Auto Scaling 그룹 생성**

2. **Auto Scaling 그룹 이름**
   ```
   Auto Scaling 그룹 이름: asg-nestjs
   시작 템플릿: field-nestjs-launch-template
   ```

3. **네트워크**
   ```
   VPC: [사용할 VPC]
   가용 영역 및 서브넷:
     ✅ ap-northeast-2a
     ✅ ap-northeast-2b
   ```

4. **로드 밸런싱**
   ```
   ✅ 기존 로드 밸런서에 연결
   기존 로드 밸런서 대상 그룹: tg-nestjs
   
   ✅ Elastic Load Balancing 상태 검사 켜기
   상태 검사 유예 기간: 300초
   ```

5. **그룹 크기 및 크기 조정**
   ```
   원하는 용량: 2
   최소 용량: 1
   최대 용량: 4
   ```

6. **크기 조정 정책 (선택 사항)**
   
   **대상 추적 크기 조정 정책**:
   ```
   측정치 유형: 평균 CPU 사용률
   대상 값: 70%
   인스턴스 워밍업: 300초
   ```

7. **알림 추가 (선택 사항)**
   - SNS 주제 생성하여 스케일링 이벤트 알림 수신

8. **태그 추가**
   ```
   키: Name
   값: field-nestjs-instance
   ```

9. **Auto Scaling 그룹 생성 클릭**

### 7-2. 배포 확인

1. **EC2 > 인스턴스**에서 새 인스턴스 2개 생성 확인

2. **대상 그룹 (tg-nestjs) > 대상 탭**
   - 상태: `healthy` 확인 (5-10분 소요)

3. **ALB DNS로 접속 테스트**
   ```bash
   curl -H "Host: new-api.iefield.com" http://field-alb-xxxxx.ap-northeast-2.elb.amazonaws.com
   ```

---

## 8. Route 53 도메인 설정

### 🎯 목적
`new-api.iefield.com` 도메인을 ALB로 연결

### 8-1. 호스팅 영역 확인

1. **Route 53 서비스 접속**

2. **호스팅 영역 > iefield.com 선택**

### 8-2. 레코드 생성

1. **레코드 생성 클릭**

2. **레코드 구성**
   ```
   레코드 이름: new-api
   레코드 유형: A - IPv4 주소에 레코드 라우팅
   
   ✅ 별칭 (켜기)
   트래픽 라우팅 대상: Application/Classic Load Balancer에 대한 별칭
   리전: 아시아 태평양(서울) ap-northeast-2
   로드 밸런서: field-alb-xxxxx.ap-northeast-2.elb.amazonaws.com
   
   라우팅 정책: 단순 라우팅
   대상 상태 평가: 아니요
   ```

3. **레코드 생성 클릭**

### 8-3. DNS 전파 확인

```bash
# DNS 조회
nslookup new-api.iefield.com

# 접속 테스트
curl https://new-api.iefield.com
```

> ⏱️ DNS 전파는 최대 48시간 소요 (보통 5-10분)

---

## 9. ECR 리포지토리 생성

### 🎯 목적
Docker 이미지를 저장할 AWS 컨테이너 레지스트리

### 9-1. ECR 리포지토리 생성

1. **ECR 서비스 접속**

2. **프라이빗 리포지토리 생성 클릭**

3. **리포지토리 설정**
   ```
   리포지토리 이름: field-nestjs
   태그 변경 가능성: 비활성화됨
   이미지 스캔 설정: ✅ 푸시할 때 스캔
   암호화 설정: AES-256
   ```

4. **리포지토리 생성 클릭**

5. **리포지토리 URI 저장**
   ```
   예시: 123456789012.dkr.ecr.ap-northeast-2.amazonaws.com/field-nestjs
   ```

### 9-2. ECR 푸시 명령어 확인

리포지토리 선택 후 **푸시 명령 보기** 클릭:

```bash
# 1. ECR 로그인
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.ap-northeast-2.amazonaws.com

# 2. 이미지 빌드
docker build -t field-nestjs .

# 3. 이미지 태그
docker tag field-nestjs:latest 123456789012.dkr.ecr.ap-northeast-2.amazonaws.com/field-nestjs:latest

# 4. 이미지 푸시
docker push 123456789012.dkr.ecr.ap-northeast-2.amazonaws.com/field-nestjs:latest
```

---

## ✅ 설정 검증 체크리스트

### 네트워크 인프라
- [ ] VPC 생성 또는 기본 VPC 확인
- [ ] 최소 2개 AZ에 서브넷 확인
- [ ] 인터넷 게이트웨이 연결 확인

### 보안 그룹
- [ ] `field-alb-sg` 생성 (80, 443 오픈)
- [ ] `field-nestjs-sg` 생성 (4002, 22 제한)
- [ ] `field-express-sg` 생성 (4001, 22 제한)

### EC2 및 AMI
- [ ] 베이스 EC2 인스턴스 생성
- [ ] Docker 설치 완료
- [ ] 환경변수 설정 완료
- [ ] 시작 스크립트 작성 완료
- [ ] AMI 생성 완료

### 시작 템플릿
- [ ] 시작 템플릿 생성 완료
- [ ] IAM 역할 연결 완료
- [ ] 보안 그룹 설정 완료

### Target Group
- [ ] `tg-nestjs` 생성 완료
- [ ] 상태 검사 설정 완료
- [ ] `tg-legacy-express` 생성 완료

### Application Load Balancer
- [ ] ALB 생성 완료
- [ ] 2개 이상 AZ에 배포 확인
- [ ] 리스너 규칙 설정 완료
- [ ] 도메인 기반 라우팅 설정 완료

### Auto Scaling
- [ ] Auto Scaling Group 생성 완료
- [ ] 인스턴스 자동 생성 확인
- [ ] Target Group에 인스턴스 등록 확인
- [ ] 상태 검사 통과 확인 (healthy)

### Route 53
- [ ] `new-api.iefield.com` 레코드 생성
- [ ] ALB 별칭 연결 완료
- [ ] DNS 전파 확인

### ECR
- [ ] ECR 리포지토리 생성 완료
- [ ] 푸시 명령어 확인 및 저장

---

## 🧪 종합 테스트

### 1. 헬스 체크 확인

```bash
# ALB를 통한 헬스 체크
curl -I http://new-api.iefield.com

# 예상 응답: HTTP/1.1 200 OK 또는 404
```

### 2. Auto Scaling 테스트

```bash
# CPU 부하 생성 (EC2 인스턴스 내부에서)
stress --cpu 8 --timeout 600s

# Auto Scaling Group에서 새 인스턴스 생성 확인
```

### 3. 롤링 업데이트 테스트

1. ECR에 새 이미지 푸시
2. Auto Scaling Group에서 인스턴스 새로 고침 시작
3. 무중단 배포 확인

---

## 📊 아키텍처 다이어그램

```
                                      Internet
                                         |
                                         |
                                    [Route 53]
                         new-api.iefield.com | api.iefield.com
                                         |
                                         |
                                    [ALB (field-alb)]
                                    / Port 80, 443 \
                                   /                 \
                          [리스너 규칙]           [리스너 규칙]
                     new-api.iefield.com    api.iefield.com
                              |                      |
                              |                      |
                         [tg-nestjs]          [tg-legacy-express]
                          Port 4002             Port 4001
                              |                      |
                              |                      |
                       [asg-nestjs]          [기존 Express 서버들]
                    /       |       \
                   /        |        \
            [EC2-1]     [EC2-2]    [EC2-3]
         (Nest.js)   (Nest.js)   (Nest.js)
              |           |           |
              +-----+-----+-----+-----+
                    |     |     |
               [MongoDB Atlas]
                    |
               [AWS S3]
```

---

## 🎉 완료!

**Part 2 (백엔드 인프라)** 설정이 완료되었습니다!

**다음 단계**: [Part 3 - CI/CD 파이프라인 구축](../AWS_SETUP_GUIDE_PART3.md)

---

## 💰 비용 추정 (Part 2)

### 프리 티어 (첫 12개월)
- ALB: 750시간 **무료**
- EC2 t3.micro: 750시간 **무료**
- 데이터 전송: 15GB **무료**

### 프로덕션 환경 (월별 예상)
- ALB: **$22.50** (월 750시간 + LCU)
- EC2 t3.small x 2: **$30** (월)
- Auto Scaling: **무료**
- Route 53 호스팅 영역: **$0.50**
- ECR 스토리지 (10GB): **$1.00**
- **총 예상: 약 $54/월**

**Part 1 + Part 2 총합: 약 $117/월**

---

**작성일**: 2025-10-21  
**버전**: 1.0.0  
**이전 문서**: [AWS_SETUP_GUIDE_PART1.md](./AWS_SETUP_GUIDE_PART1.md)  
**다음 문서**: CI/CD 구축 가이드

