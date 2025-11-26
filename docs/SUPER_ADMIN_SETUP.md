# 🔐 최상위 관리자 계정 생성 가이드

최상위 관리자 시스템을 로컬에서 테스트하기 위한 가이드입니다.

## 📋 목차

1. [최상위 관리자란?](#1-최상위-관리자란)
2. [최상위 관리자 계정 생성 방법](#2-최상위-관리자-계정-생성-방법)
3. [테스트 시나리오](#3-테스트-시나리오)

---

## 1. 최상위 관리자란?

최상위 관리자(`isSuperAdmin: true`)는 다음 권한을 가집니다:

- ✅ **다른 사용자의 소속(department)과 직책(position) 수정 가능**
- ✅ **모든 사용자 목록 조회 가능** (`GET /api/users`)
- ✅ **모든 사용자 정보 수정 가능** (`PUT /api/users/:id`)
- ✅ **사용자 삭제 가능** (`DELETE /api/users/:id`)
- ✅ **본인의 모든 정보 수정 가능** (소속, 직책 포함)

일반 사용자는:
- ❌ 다른 사용자의 소속/직책 수정 불가
- ✅ 본인의 이름, 비밀번호만 수정 가능

---

## 2. 최상위 관리자 계정 생성 방법

### 방법 1: 스크립트 사용 (권장)

1. **백엔드 서버가 실행 중이어야 합니다** (Docker 또는 `npm run start:dev`)

2. **스크립트 실행**:
   ```bash
   cd server-nestjs
   npm run create-super-admin
   ```

3. **입력 정보**:
   - 이메일
   - 이름
   - 비밀번호 (최소 4자)
   - 소속 (대외협력부/총기획단/기획부/컴페티션부/홍보부)
   - 직책 (대외협력부장/단장/부단장/기획부장/컴페티션부장/홍보부장/부원)

4. **기존 계정에 권한 부여**:
   - 이미 존재하는 이메일을 입력하면, 최상위 관리자 권한을 부여할지 물어봅니다.

### 방법 2: MongoDB에서 직접 수정

#### 2-1. MongoDB Compass 사용

1. **MongoDB Compass 실행**
   - Connection String: `mongodb://admin:admin123@localhost:27017/field_db?authSource=admin`

2. **데이터베이스 선택**: `field_db`

3. **컬렉션 선택**: `users`

4. **사용자 찾기**: 이메일로 검색

5. **수정**:
   ```json
   {
     "isSuperAdmin": true
   }
   ```
   - `isSuperAdmin` 필드를 `true`로 변경

#### 2-2. MongoDB Shell 사용

```bash
# MongoDB 컨테이너 접속
docker exec -it field-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin

# 데이터베이스 선택
use field_db

# 사용자 찾기
db.users.find({ email: "your-email@example.com" })

# 최상위 관리자 권한 부여
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { isSuperAdmin: true } }
)

# 확인
db.users.findOne({ email: "your-email@example.com" })
```

#### 2-3. Mongo Express 사용

1. **Mongo Express 접속**: http://localhost:8081
   - Username: `admin`
   - Password: `admin`

2. **데이터베이스 선택**: `field_db`

3. **컬렉션 선택**: `users`

4. **사용자 찾기 및 수정**:
   - 사용자를 찾아서 편집
   - `isSuperAdmin` 필드를 `true`로 변경
   - 저장

---

## 3. 테스트 시나리오

### 시나리오 1: 최상위 관리자로 다른 사용자 정보 수정

1. **최상위 관리자로 로그인**
   - 프론트엔드: http://localhost:5173
   - 로그인 후 헤더의 사용자 메뉴에서 "사용자 관리" 클릭

2. **사용자 목록 확인**
   - `/admin/users` 페이지에서 모든 사용자 목록 확인

3. **사용자 정보 수정**
   - 사용자 행의 "수정" 버튼 클릭
   - 소속, 직책, 이름, 비밀번호 수정 가능
   - 저장

### 시나리오 2: 일반 사용자로 본인 정보 수정

1. **일반 사용자로 로그인** (최상위 관리자가 아닌 계정)

2. **내 정보 페이지 접속**
   - `/mypage` 페이지 접속

3. **정보 수정 시도**
   - "정보 수정" 버튼 클릭
   - 소속/직책 필드는 **읽기 전용**으로 표시됨
   - 이름과 비밀번호만 수정 가능

### 시나리오 3: 최상위 관리자로 본인 정보 수정

1. **최상위 관리자로 로그인**

2. **내 정보 페이지 접속**
   - `/mypage` 페이지 접속

3. **정보 수정**
   - "정보 수정" 버튼 클릭
   - 소속, 직책, 이름, 비밀번호 모두 수정 가능

### 시나리오 4: API 직접 테스트

#### 최상위 관리자로 모든 사용자 조회
```bash
# 토큰은 로그인 후 받은 JWT 토큰
curl -X GET http://localhost:4002/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 최상위 관리자로 다른 사용자 정보 수정
```bash
curl -X PUT http://localhost:4002/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "수정된 이름",
    "department": "기획부",
    "position": "기획부장"
  }'
```

#### 일반 사용자로 본인 정보 수정 (소속/직책 수정 불가)
```bash
curl -X PUT http://localhost:4002/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "수정된 이름",
    "password": "newpassword",
    "confirmPassword": "newpassword"
  }'
```

#### 일반 사용자가 다른 사용자 정보 수정 시도 (실패해야 함)
```bash
curl -X PUT http://localhost:4002/api/users/OTHER_USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "department": "기획부"
  }'
# 응답: 403 Forbidden - 최상위 관리자 권한이 필요합니다.
```

---

## 🔍 확인 사항

### 백엔드 확인

1. **User 스키마에 `isSuperAdmin` 필드가 있는지 확인**
   - `server-nestjs/src/users/schemas/user.schema.ts`

2. **SuperAdminGuard가 제대로 작동하는지 확인**
   - `server-nestjs/src/auth/guards/super-admin.guard.ts`

3. **UsersController의 엔드포인트가 올바르게 보호되는지 확인**
   - `server-nestjs/src/users/users.controller.ts`

### 프론트엔드 확인

1. **MyPage에서 소속/직책 수정 권한이 올바르게 제한되는지 확인**
   - `frontend/src/pages/MyPage.jsx`

2. **UserManager 페이지가 SuperAdmin만 접근 가능한지 확인**
   - `frontend/src/pages/admin/UserManager.jsx`
   - `frontend/src/components/PrivateRoute.jsx`

3. **헤더에 "사용자 관리" 메뉴가 SuperAdmin에게만 표시되는지 확인**
   - `frontend/src/layout/Header/Header.jsx`

---

## 🚨 주의사항

1. **프로덕션 환경에서는 최상위 관리자 계정을 신중하게 관리하세요.**
2. **최상위 관리자 권한은 최소한의 인원에게만 부여하세요.**
3. **로컬 테스트 후 반드시 권한을 제거하거나, 테스트 계정을 삭제하세요.**

---

## 📝 추가 정보

- **백엔드 API 문서**: `docs/API_OVERVIEW.md`
- **인증 시스템**: `server-nestjs/src/auth/`
- **사용자 관리**: `server-nestjs/src/users/`

