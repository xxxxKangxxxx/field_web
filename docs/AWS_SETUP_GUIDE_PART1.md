# ☁️ AWS 인프라 구축 가이드 - Part 1: 공용 리소스

## 📋 목차

1. [MongoDB Atlas 설정](#1-mongodb-atlas-설정)
2. [AWS S3 버킷 설정](#2-aws-s3-버킷-설정)
3. [IAM 사용자 생성](#3-iam-사용자-생성)
4. [환경변수 업데이트](#4-환경변수-업데이트)

---

## 1. MongoDB Atlas 설정

### 🎯 목적
로컬 MongoDB 컨테이너를 대체할 프로덕션용 클라우드 데이터베이스 구축

### 1-1. MongoDB Atlas 계정 생성

1. **웹사이트 접속**
   - https://www.mongodb.com/cloud/atlas/register 접속
   - 이메일 또는 Google 계정으로 가입

2. **Organization 생성**
   - Organization Name: `FIELD-Project`
   - Cloud Service: `MongoDB Atlas` 선택

### 1-2. 클러스터 생성

1. **Create a Deployment 클릭**

2. **Cluster Tier 선택**
   - **무료 테스트용**: M0 Sandbox (FREE)
     - 512MB 스토리지
     - 개발 및 테스트에 적합
   
   - **프로덕션용**: M10 이상 권장
     - M10: 월 $57 (2GB RAM, 10GB 스토리지)
     - M20: 월 $119 (4GB RAM, 20GB 스토리지)

3. **Cloud Provider & Region 선택**
   ```
   Cloud Provider: AWS
   Region: ap-northeast-2 (Seoul)
   ```
   > ⚠️ **중요**: AWS Seoul 리전을 선택하여 지연 시간 최소화

4. **Cluster Name 설정**
   ```
   Cluster Name: field-cluster
   ```

5. **Create Deployment 클릭**

### 1-3. 데이터베이스 사용자 생성

1. **Security > Database Access** 메뉴 이동

2. **Add New Database User 클릭**
   ```
   Authentication Method: Password
   Username: field_admin
   Password: [강력한 비밀번호 생성 - 저장 필수!]
   
   Database User Privileges:
   ✅ Built-in Role: Atlas admin
   ```

3. **Add User 클릭**

### 1-4. 네트워크 액세스 설정

> 🚨 **보안 경고**: 절대 `0.0.0.0/0` (모든 IP 허용)을 사용하지 마세요!

1. **Security > Network Access** 메뉴 이동

2. **Add IP Address 클릭**

#### 로컬 개발 환경

팀원 개개인의 IP를 개별 등록:

```
Access List Entry: [내 IP 주소] (예: 123.45.67.89/32)
Comment: [개발자 이름] - 사무실/집
```

**내 IP 확인 방법**:
```bash
curl ifconfig.me
# 또는
curl https://api.ipify.org
```

각 팀원이 자신의 IP를 등록해야 합니다.

#### 프로덕션 환경 (AWS)

**방법 1: EC2 Elastic IP (권장)**

EC2 인스턴스에 고정 IP(Elastic IP)를 할당하고 등록:

```
Access List Entry: [EC2 Elastic IP]/32
Comment: Production EC2 - Elastic IP
```

**방법 2: NAT Gateway IP**

프라이빗 서브넷 사용 시 NAT Gateway의 퍼블릭 IP:

```
Access List Entry: [NAT Gateway IP]/32
Comment: Production - NAT Gateway
```

**방법 3: AWS VPC Peering (엔터프라이즈)**

MongoDB Atlas에서 AWS VPC Peering 설정:
- MongoDB Atlas > Network Access > Peering
- AWS VPC와 직접 연결 (가장 안전)

3. **Confirm 클릭**

> ⚠️ **주의**: IP 주소가 변경되면 (예: 재부팅, ISP 변경) MongoDB 연결이 끊깁니다.  
> Elastic IP 사용을 강력히 권장합니다.

### 1-5. Connection String 확인

1. **Database > Clusters** 메뉴에서 `field-cluster` 선택

2. **Connect 버튼 클릭**

3. **Connect your application 선택**

4. **Driver 선택**
   ```
   Driver: Node.js
   Version: 6.0 or later
   ```

5. **Connection String 복사** (예시)
   ```
   mongodb+srv://field_admin:<password>@field-cluster.xxxxx.mongodb.net/field_db?retryWrites=true&w=majority
   ```

6. **`<password>` 부분을 실제 비밀번호로 교체**
   ```
   mongodb+srv://field_admin:YOUR_ACTUAL_PASSWORD@field-cluster.xxxxx.mongodb.net/field_db?retryWrites=true&w=majority
   ```

### 1-6. 데이터베이스 생성

1. **Database > Browse Collections** 클릭

2. **Create Database 클릭**
   ```
   Database Name: field_db
   Collection Name: users
   ```

3. **Create 클릭**

---

## 2. AWS S3 버킷 설정

### 🎯 목적
로컬 `uploads/` 폴더를 대체할 파일 스토리지 구축

### 2-1. AWS Management Console 접속

1. https://aws.amazon.com/console/ 접속
2. AWS 계정으로 로그인
3. 리전을 **아시아 태평양 (서울) ap-northeast-2**로 선택

### 2-2. S3 버킷 생성

1. **S3 서비스 검색 및 접속**

2. **버킷 만들기 클릭**

3. **일반 구성**
   ```
   버킷 이름: field-uploads-prod
   AWS 리전: 아시아 태평양(서울) ap-northeast-2
   ```
   
   > ⚠️ **버킷 이름 규칙**:
   > - 전 세계적으로 고유해야 함
   > - 소문자, 숫자, 하이픈(-)만 사용
   > - 예: `field-uploads-prod-20250421`

4. **객체 소유권**
   ```
   ✅ ACL 비활성화됨 (권장)
   ```

5. **이 버킷의 퍼블릭 액세스 차단 설정**
   
   **공개 파일 저장 시 (캠프 포스터, 뉴스 이미지 등)**:
   ```
   ❌ 모든 퍼블릭 액세스 차단 (체크 해제)
   ✅ 위 설정으로 인해 이 버킷과 그 안의 객체가 퍼블릭 상태가 될 수 있음을 알고 있습니다. (확인 필수)
   ```

   **비공개 파일 저장 시 (사용자 프로필 등)**:
   ```
   ✅ 모든 퍼블릭 액세스 차단 (체크)
   ```

6. **버킷 버전 관리**
   ```
   ❌ 비활성화 (비용 절감)
   ```

7. **태그 (선택 사항)**
   ```
   키: Project
   값: FIELD
   ```

8. **버킷 만들기 클릭**

### 2-3. 버킷 CORS 설정

파일 업로드를 위해 CORS 설정이 필요합니다.

1. **생성한 버킷 선택** (`field-uploads-prod`)

2. **권한 탭 클릭**

3. **CORS(Cross-origin resource sharing) 섹션에서 편집 클릭**

4. **다음 JSON 입력**:

```json
[
  {
    "AllowedHeaders": [
      "*"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://iefield.com",
      "https://www.iefield.com"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

5. **변경 사항 저장 클릭**

### 2-4. 버킷 정책 설정 (공개 읽기 권한)

공개적으로 접근 가능한 파일의 경우 버킷 정책 설정이 필요합니다.

1. **권한 탭 > 버킷 정책 > 편집 클릭**

2. **다음 JSON 입력** (버킷 이름 수정 필수):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::field-uploads-prod/*"
    }
  ]
}
```

> ⚠️ **중요**: `field-uploads-prod`를 실제 생성한 버킷 이름으로 변경하세요!

3. **변경 사항 저장 클릭**

### 2-5. 폴더 구조 생성 (선택 사항)

1. **버킷 내부로 이동**

2. **폴더 만들기 클릭**하여 다음 폴더들 생성:
   ```
   camp-posters/
   news/
   profiles/
   reviews/
   ```

---

## 3. IAM 사용자 생성

### 🎯 목적
Nest.js 애플리케이션이 S3에 파일을 업로드할 수 있도록 AWS 자격 증명 생성

### 3-1. IAM 서비스 접속

1. AWS Console에서 **IAM 서비스 검색**

2. **사용자 > 사용자 생성 클릭**

### 3-2. 사용자 세부 정보

```
사용자 이름: field-s3-uploader
AWS 액세스 유형: ✅ 액세스 키 - 프로그래밍 방식 액세스
```

### 3-3. 권한 설정

1. **직접 정책 연결 선택**

2. **정책 생성 클릭** (새 탭이 열림)

3. **JSON 탭 선택 후 다음 입력**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:GetObjectAcl",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::field-uploads-prod/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::field-uploads-prod"
    }
  ]
}
```

4. **정책 이름**: `FieldS3UploadPolicy`

5. **정책 생성 클릭**

6. **이전 탭으로 돌아가서** 새로고침 후 `FieldS3UploadPolicy` 검색 및 선택

### 3-4. 검토 및 생성

1. **사용자 생성 클릭**

2. **액세스 키 ID와 비밀 액세스 키 저장** (절대 분실 금지!)
   ```
   Access Key ID: AKIAIOSFODNN7EXAMPLE
   Secret Access Key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   ```

   > 🚨 **매우 중요**: 
   > - 비밀 액세스 키는 이 화면에서만 확인 가능
   > - .csv 파일 다운로드 권장
   > - 절대 GitHub에 커밋하지 말 것!

---

## 4. 환경변수 업데이트

### 4-1. Nest.js 환경변수 업데이트

`server-nestjs/.env` 파일을 다음과 같이 수정:

```env
# 서버 설정
PORT=4002
NODE_ENV=production

# MongoDB Atlas (프로덕션)
MONGO_URI=mongodb+srv://field_admin:YOUR_PASSWORD@field-cluster.xxxxx.mongodb.net/field_db?retryWrites=true&w=majority

# JWT 설정
JWT_SECRET=your-production-jwt-secret-key-very-strong-and-random
JWT_EXPIRES_IN=7d

# AWS S3 설정 (프로덕션)
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET_NAME=field-uploads-prod
```

### 4-2. 로컬 개발용 환경변수

로컬에서는 여전히 Docker MongoDB를 사용할 수 있도록 별도 `.env.local` 파일 생성:

```env
# server-nestjs/.env.local

# 서버 설정
PORT=4002
NODE_ENV=development

# MongoDB (로컬 Docker)
MONGO_URI=mongodb://admin:admin123@mongodb:27017/field_db?authSource=admin

# JWT 설정
JWT_SECRET=field-dev-secret-key-2025
JWT_EXPIRES_IN=7d

# AWS S3 설정 (로컬 개발 시 비활성화 또는 테스트 버킷 사용)
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
```

---

## ✅ 설정 검증 체크리스트

### MongoDB Atlas
- [ ] 클러스터 생성 완료
- [ ] 데이터베이스 사용자 생성 완료
- [ ] 네트워크 액세스 설정 완료
- [ ] Connection String 복사 및 저장
- [ ] `field_db` 데이터베이스 생성 완료

### AWS S3
- [ ] 버킷 생성 완료
- [ ] CORS 설정 완료
- [ ] 버킷 정책 설정 완료 (공개 파일의 경우)
- [ ] 폴더 구조 생성 완료

### IAM 사용자
- [ ] IAM 사용자 생성 완료
- [ ] S3 정책 연결 완료
- [ ] Access Key ID 저장
- [ ] Secret Access Key 저장

### 환경변수
- [ ] `.env` 파일 업데이트 완료
- [ ] MongoDB Atlas Connection String 입력
- [ ] AWS 자격 증명 입력
- [ ] S3 버킷 이름 입력

---

## 🧪 연결 테스트

### MongoDB Atlas 연결 테스트

로컬에서 테스트:

```bash
cd server-nestjs
npm run start:dev
```

로그에서 다음 메시지 확인:
```
✅ MongoDB 연결 성공!
```

### S3 업로드 테스트

Nest.js에서 간단한 테스트 스크립트 실행:

```typescript
// server-nestjs/test-s3.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function testUpload() {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: 'test/test-file.txt',
    Body: 'Hello from FIELD project!',
  });

  try {
    await s3Client.send(command);
    console.log('✅ S3 업로드 성공!');
  } catch (error) {
    console.error('❌ S3 업로드 실패:', error);
  }
}

testUpload();
```

실행:
```bash
npx ts-node test-s3.ts
```

---

## 🎉 완료!

**Part 1 (공용 리소스)** 설정이 완료되었습니다!

**다음 단계**: [Part 2 - ALB, Target Group, Auto Scaling 설정](./AWS_SETUP_GUIDE_PART2.md)

---

## 💰 비용 추정

### 무료 티어 (첫 12개월)
- MongoDB Atlas M0: **무료** (영구)
- AWS S3: 5GB 저장소 **무료**
- IAM: **무료**

### 프로덕션 환경 (월별 예상)
- MongoDB Atlas M10: **$57**
- S3 저장소 (50GB): **$1.15**
- S3 데이터 전송 (50GB): **$4.50**
- **총 예상: 약 $63/월**

---

## 🔐 보안 권장사항

1. **절대 커밋하지 말 것**:
   - `.env` 파일
   - AWS Access Key
   - MongoDB 비밀번호

2. **정기적으로 변경**:
   - JWT_SECRET
   - 데이터베이스 비밀번호
   - AWS Access Key (3개월마다)

3. **IAM 권한 최소화**:
   - 필요한 S3 버킷에만 액세스
   - `s3:*` 같은 와일드카드 권한 지양

4. **MongoDB Atlas IP 화이트리스트**:
   - 프로덕션에서는 `0.0.0.0/0` 사용 금지
   - 실제 EC2 인스턴스 IP만 허용

---

**작성일**: 2025-10-21  
**버전**: 1.0.0  
**다음 문서**: [AWS_SETUP_GUIDE_PART2.md](./AWS_SETUP_GUIDE_PART2.md)

