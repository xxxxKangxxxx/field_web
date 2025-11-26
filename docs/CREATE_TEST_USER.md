# 👤 테스트용 일반 회원 계정 생성 가이드

일반 회원 계정을 생성하여 최상위 관리자와 일반 사용자의 차이를 테스트하는 방법입니다.

## 📋 방법 1: 프론트엔드에서 회원가입 (권장)

### 1단계: 회원가입 페이지 접속

1. **프론트엔드 실행**: http://localhost:5173
2. **회원가입 페이지로 이동**: http://localhost:5173/signup

### 2단계: 회원가입 진행

1. **이메일 입력** (예: `test@field.com`)
2. **인증번호 발송** 클릭
3. **이메일에서 인증번호 확인** (Gmail 등에서 확인)
4. **인증번호 입력**
5. **나머지 정보 입력**:
   - 이름: 테스트 사용자
   - 비밀번호: test1234
   - 소속: 기획부
   - 직책: 부원
6. **회원가입 완료**

### 3단계: 테스트

1. **로그아웃** (최상위 관리자 계정에서)
2. **일반 회원 계정으로 로그인**
3. **내 정보 페이지** (`/mypage`) 접속
4. **정보 수정** 클릭
5. **소속/직책이 읽기 전용인지 확인** ✅
6. **사용자 관리 메뉴가 보이지 않는지 확인** ✅

---

## 📋 방법 2: MongoDB에서 직접 생성 (빠른 테스트용)

이메일 인증 없이 빠르게 테스트 계정을 만들고 싶을 때:

### 1단계: MongoDB Shell 접속

```bash
docker exec -it field-mongodb mongosh field_db
```

### 2단계: 사용자 생성

```javascript
// 비밀번호 해싱을 위해 bcrypt 필요
// 하지만 간단한 테스트를 위해 스크립트 사용 권장

// 대신 아래 스크립트 사용 (방법 3 참고)
```

### 3단계: MongoDB Shell 종료

```javascript
exit
```

---

## 📋 방법 3: 테스트 계정 생성 스크립트 사용 (가장 빠름)

### 스크립트 생성

`server-nestjs/scripts/create-test-user.ts` 파일 생성:

```typescript
// server-nestjs/scripts/create-test-user.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';

async function createTestUser() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    const user = await usersService.create({
      email: 'test@field.com',
      password: 'test1234',
      name: '테스트 사용자',
      department: '기획부',
      position: '부원',
    });

    console.log('✅ 테스트 계정이 생성되었습니다!');
    console.log(`   이메일: ${user.email}`);
    console.log(`   이름: ${user.name}`);
    console.log(`   소속: ${user.department}`);
    console.log(`   직책: ${user.position}`);
    console.log(`   권한: 일반 사용자\n`);
  } catch (error) {
    if (error.message.includes('이미 사용 중인 이메일')) {
      console.log('⚠️  이미 존재하는 이메일입니다.');
      console.log('   다른 이메일을 사용하거나 기존 계정을 사용하세요.');
    } else {
      console.error('❌ 오류 발생:', error.message);
    }
  }

  await app.close();
  process.exit(0);
}

createTestUser();
```

### 스크립트 실행

```bash
cd server-nestjs
npm run create-test-user
```

---

## 📋 방법 4: MongoDB에서 직접 생성 (bcrypt 해싱 포함)

### 1단계: 비밀번호 해시 생성

Node.js로 비밀번호 해시 생성:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('test1234', 10).then(hash => console.log('Hashed password:', hash));"
```

### 2단계: MongoDB에 사용자 생성

```bash
# 해시된 비밀번호를 복사한 후
docker exec field-mongodb mongosh field_db --eval "
db.users.insertOne({
  email: 'test@field.com',
  password: 'HASHED_PASSWORD_HERE', // 위에서 생성한 해시
  name: '테스트 사용자',
  department: '기획부',
  position: '부원',
  isAdmin: false,
  isSuperAdmin: false,
  activeToken: null,
  createdAt: new Date(),
  updatedAt: new Date()
})
" --quiet
```

---

## ✅ 테스트 시나리오

### 시나리오 1: 일반 사용자로 로그인

1. **일반 회원 계정으로 로그인**
   - 이메일: `test@field.com`
   - 비밀번호: `test1234`

2. **내 정보 페이지 확인** (`/mypage`)
   - 소속/직책이 **읽기 전용**인지 확인
   - 이름, 비밀번호만 수정 가능한지 확인

3. **헤더 메뉴 확인**
   - "사용자 관리" 메뉴가 **보이지 않는지** 확인

4. **사용자 관리 페이지 직접 접속 시도**
   - `/admin/users` 접속 시도
   - 접근 거부되거나 홈으로 리다이렉트되는지 확인

### 시나리오 2: 최상위 관리자와 비교

1. **최상위 관리자로 로그인**
2. **내 정보 페이지 확인**
   - 소속/직책 수정 가능한지 확인
3. **사용자 관리 페이지 접속**
   - 모든 사용자 목록 확인
   - 일반 사용자 정보 수정 가능한지 확인

---

## 🔍 현재 사용자 목록 확인

```bash
# 모든 사용자 조회
docker exec field-mongodb mongosh field_db --eval 'db.users.find({}, {email: 1, name: 1, isSuperAdmin: 1, isAdmin: 1, position: 1}).pretty()' --quiet
```

---

## 💡 팁

### 여러 테스트 계정 생성

```bash
# 스크립트를 여러 번 실행하되, 이메일만 변경
# 또는 MongoDB에서 직접 여러 계정 생성
```

### 테스트 계정 삭제

```bash
# 특정 사용자 삭제
docker exec field-mongodb mongosh field_db --eval 'db.users.deleteOne({email: "test@field.com"})' --quiet
```

