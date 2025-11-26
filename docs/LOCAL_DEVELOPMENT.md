# 🛠️ 로컬 개발 환경 가이드

## ⚠️ 중요: 개발 환경 선택

FIELD 프로젝트는 **두 가지 개발 방식**을 지원합니다:

1. **Docker Compose 방식** (전체 서비스 컨테이너화)
2. **하이브리드 방식** (MongoDB만 Docker, 나머지는 로컬 실행) ⭐ **권장**

---

## 🎯 권장 방식: 하이브리드 개발 환경

### 왜 하이브리드 방식을 권장하나요?

- ✅ **핫 리로드가 빠름**: 코드 변경 시 즉시 반영
- ✅ **디버깅이 쉬움**: 로컬에서 직접 실행하여 브레이크포인트 사용 가능
- ✅ **리소스 절약**: Backend/Frontend는 컨테이너 없이 실행
- ✅ **개발 효율성**: 로그 확인 및 에러 추적이 용이

### 실행 방법

#### 1단계: MongoDB만 Docker로 실행

```bash
# MongoDB와 Mongo Express만 실행
docker-compose up -d mongodb mongo-express

# 또는 스크립트 사용 (MongoDB만 실행하는 옵션 추가 필요)
```

**확인**:
- MongoDB: `localhost:27017`
- Mongo Express: http://localhost:8081 (admin/admin)

#### 2단계: Backend 로컬에서 실행

```bash
cd server-nestjs

# 의존성 설치 (처음 한 번만)
npm install

# .env 파일 확인 (로컬 MongoDB URI 설정)
# MONGO_URI=mongodb://admin:admin123@localhost:27017/field_db?authSource=admin

# 서버 실행
npm run start:dev
```

**확인**: http://localhost:4002

#### 3단계: Frontend 로컬에서 실행

```bash
cd frontend

# 의존성 설치 (처음 한 번만)
npm install

# 개발 서버 실행
npm run dev
```

**확인**: http://localhost:5173

---

## 🚫 주의사항: 포트 충돌 방지

### ❌ 하지 말아야 할 것

**Docker Compose로 backend를 실행한 상태에서 로컬 터미널에서 `npm run start:dev`를 실행하면 안 됩니다!**

```
❌ 잘못된 예시:
1. ./docker-scripts.sh a  (backend 컨테이너 실행)
2. cd server-nestjs && npm run start:dev  (로컬에서 또 실행)
   → 포트 4002 충돌! Authentication failed 오류 발생!
```

### ✅ 올바른 방법

**옵션 A: 하이브리드 방식 (권장)**
```bash
# 1. MongoDB만 Docker로 실행
docker-compose up -d mongodb mongo-express

# 2. Backend 로컬에서 실행
cd server-nestjs && npm run start:dev

# 3. Frontend 로컬에서 실행
cd frontend && npm run dev
```

**옵션 B: Docker Compose 방식 (전체 컨테이너화)**
```bash
# 모든 서비스를 Docker로 실행
./docker-scripts.sh a  # 또는 b, c

# 로컬에서는 실행하지 않음!
```

---

## 🔍 현재 실행 중인 서비스 확인

### Docker 컨테이너 확인

```bash
# 실행 중인 컨테이너 확인
docker ps

# 특정 서비스 확인
docker ps | grep backend
docker ps | grep mongodb
```

### 포트 사용 확인

```bash
# macOS/Linux
lsof -i :4002  # Backend 포트
lsof -i :5173  # Frontend 포트
lsof -i :27017 # MongoDB 포트

# Windows
netstat -ano | findstr :4002
```

---

## 🛠️ 문제 해결

### 문제 1: 포트 충돌

**증상**: `Error: listen EADDRINUSE: address already in use :::4002`

**해결**:
```bash
# Docker Compose의 backend 서비스 중지
docker-compose stop backend
# 또는
docker stop field-backend-nestjs

# 그 다음 로컬에서 실행
cd server-nestjs && npm run start:dev
```

### 문제 2: MongoDB 연결 실패

**증상**: `MongoServerError: Authentication failed`

**원인**: 
- Docker Compose로 backend를 실행한 상태에서 로컬에서 또 실행하려고 함
- 또는 MongoDB 컨테이너가 실행되지 않음

**해결**:
```bash
# 1. Docker Compose의 backend 중지
docker-compose stop backend

# 2. MongoDB 컨테이너 확인
docker ps | grep mongodb

# 3. MongoDB가 없다면 실행
docker-compose up -d mongodb

# 4. 로컬에서 backend 실행
cd server-nestjs && npm run start:dev
```

### 문제 3: MongoDB 컨테이너 재생성이 필요한 경우

```bash
# MongoDB 컨테이너와 볼륨 완전 삭제
docker-compose down mongodb
docker volume rm field_web_mongodb_data field_web_mongodb_config

# MongoDB 재생성
docker-compose up -d mongodb
```

---

## 📋 개발 워크플로우 체크리스트

### 하이브리드 방식 (권장)

- [ ] MongoDB 컨테이너 실행 확인 (`docker ps | grep mongodb`)
- [ ] Docker Compose의 backend 서비스 **중지** 확인
- [ ] `.env` 파일의 `MONGO_URI`가 로컬 MongoDB를 가리키는지 확인
- [ ] Backend 로컬에서 실행 (`cd server-nestjs && npm run start:dev`)
- [ ] Frontend 로컬에서 실행 (`cd frontend && npm run dev`)

### Docker Compose 방식

- [ ] `./docker-scripts.sh a` (또는 b, c) 실행
- [ ] 로컬 터미널에서 `npm run start:dev` **실행하지 않음**
- [ ] 컨테이너 로그 확인: `docker-compose logs -f backend`

---

## 💡 개발 팁

### 로그 확인

**하이브리드 방식**:
```bash
# Backend 로그는 터미널에서 직접 확인
# MongoDB 로그
docker-compose logs -f mongodb
```

**Docker Compose 방식**:
```bash
# Backend 로그
docker-compose logs -f backend

# 모든 서비스 로그
docker-compose logs -f
```

### 코드 변경 반영

**하이브리드 방식**:
- Backend: 자동 핫 리로드 (Nest.js watch mode)
- Frontend: 자동 핫 리로드 (Vite HMR)

**Docker Compose 방식**:
- 볼륨 마운트로 자동 반영 (약간 느릴 수 있음)

---

## 🔄 전환 방법

### Docker Compose → 하이브리드 방식

```bash
# 1. Backend 컨테이너 중지
docker-compose stop backend

# 2. MongoDB는 계속 실행 (확인)
docker ps | grep mongodb

# 3. 로컬에서 Backend 실행
cd server-nestjs && npm run start:dev
```

### 하이브리드 → Docker Compose 방식

```bash
# 1. 로컬 Backend/Frontend 프로세스 종료 (Ctrl+C)

# 2. Docker Compose로 전체 실행
./docker-scripts.sh a
```

---

## 📚 관련 문서

- [Docker 가이드](./DOCKER_GUIDE.md)
- [최상위 관리자 설정](./SUPER_ADMIN_SETUP.md)

