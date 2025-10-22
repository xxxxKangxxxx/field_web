# 🐳 FIELD 프로젝트 Docker 개발 환경 가이드

## 📋 개요

이 프로젝트는 Docker Compose를 사용하여 로컬 개발 환경을 구성합니다.
필요한 서비스만 선택적으로 실행하여 리소스를 절약하고 개발에 집중할 수 있습니다.

## 🎯 서비스 구성

| 서비스 | 포트 | 용도 |
|--------|------|------|
| `frontend` | 5173 | React 프론트엔드 (Vite) |
| `backend` | 4002 | Nest.js 백엔드 (신규) |
| `backend-legacy` | 4001 | Express 백엔드 (기존) |
| `mongodb` | 27017 | MongoDB 데이터베이스 |
| `mongo-express` | 8081 | DB 관리 GUI |

## 🚀 빠른 시작

### 사전 준비

- Docker Desktop 설치 필수
- `docker-scripts.sh` 실행 권한 부여: `chmod +x docker-scripts.sh`

### 시나리오별 실행

#### 시나리오 A: Nest.js 개발 (가장 일반적)

**목적**: Nest.js API 개발 및 DB 연동  
**실행 서비스**: backend, mongodb, mongo-express

```bash
# 방법 1: 스크립트 사용
./docker-scripts.sh a

# 방법 2: Docker Compose 직접 사용
docker-compose up -d backend mongodb mongo-express
```

**접속 정보**:
- Nest.js API: http://localhost:4002
- MongoDB: localhost:27017
- Mongo Express: http://localhost:8081 (admin/admin)

---

#### 시나리오 B: 프론트-백엔드 통합 테스트

**목적**: 프론트엔드와 Nest.js API 통신 검증  
**실행 서비스**: frontend, backend, mongodb

```bash
# 방법 1: 스크립트 사용
./docker-scripts.sh b

# 방법 2: Docker Compose 직접 사용
docker-compose up -d frontend backend mongodb
```

**접속 정보**:
- Frontend: http://localhost:5173
- Nest.js API: http://localhost:4002
- MongoDB: localhost:27017

---

#### 시나리오 C: 전체 서비스 (구/신 서버 비교)

**목적**: Express와 Nest.js 동시 실행 및 비교  
**실행 서비스**: 모든 서비스 (5개)

```bash
# 방법 1: 스크립트 사용
./docker-scripts.sh c

# 방법 2: Docker Compose 직접 사용
docker-compose up -d
```

**접속 정보**:
- Frontend: http://localhost:5173
- Nest.js API (신규): http://localhost:4002
- Express API (기존): http://localhost:4001
- MongoDB: localhost:27017
- Mongo Express: http://localhost:8081 (admin/admin)

---

## 🛠 관리 명령어

### 서비스 중지

```bash
# 방법 1: 스크립트 사용
./docker-scripts.sh stop

# 방법 2: Docker Compose 직접 사용
docker-compose down
```

### 로그 확인

```bash
# 모든 서비스 로그
./docker-scripts.sh logs

# 특정 서비스 로그
./docker-scripts.sh logs backend
./docker-scripts.sh logs frontend

# Docker Compose 직접 사용
docker-compose logs -f backend
```

### 이미지 재빌드

코드 변경 후 Docker 이미지를 다시 빌드해야 할 때:

```bash
# 방법 1: 스크립트 사용
./docker-scripts.sh rebuild

# 방법 2: Docker Compose 직접 사용
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 전체 정리 (컨테이너, 볼륨, 이미지 삭제)

```bash
# 방법 1: 스크립트 사용
./docker-scripts.sh clean

# 방법 2: Docker Compose 직접 사용
docker-compose down -v --rmi all
```

---

## 🔧 트러블슈팅

### 1. 포트 충돌 오류

**증상**: `Error: bind: address already in use`

**해결**:
```bash
# 사용 중인 포트 확인 (macOS)
lsof -i :4002
lsof -i :5173

# 프로세스 종료
kill -9 [PID]
```

### 2. MongoDB 연결 실패

**증상**: `MongooseServerSelectionError`

**해결**:
```bash
# MongoDB 컨테이너 재시작
docker-compose restart mongodb

# MongoDB 로그 확인
docker-compose logs mongodb
```

### 3. 핫 리로드가 작동하지 않음

**증상**: 코드 변경이 반영되지 않음

**해결**:
- Docker Desktop의 **File Sharing** 설정 확인
- 프로젝트 폴더가 공유 경로에 포함되어 있는지 확인

### 4. 이미지 빌드 실패

**증상**: `npm install` 중 오류

**해결**:
```bash
# Docker 캐시 삭제 후 재빌드
docker-compose build --no-cache
```

---

## 📚 추가 정보

### MongoDB 접속 정보

- **호스트**: localhost (호스트에서) 또는 mongodb (컨테이너 내부에서)
- **포트**: 27017
- **유저**: admin
- **비밀번호**: admin123
- **데이터베이스**: field_db
- **Connection String**: `mongodb://admin:admin123@localhost:27017/field_db?authSource=admin`

### Mongo Express 접속

- **URL**: http://localhost:8081
- **유저**: admin
- **비밀번호**: admin

### 개발 워크플로우 권장사항

1. **일반 개발**: 시나리오 A 사용 (리소스 절약)
2. **통합 테스트**: 시나리오 B 사용
3. **API 비교**: 시나리오 C 사용 (필요할 때만)
4. **작업 종료**: 항상 `docker-compose down`으로 정리

---

## 🚨 주의사항

1. **프로덕션 배포 시**: 이 Docker Compose는 로컬 개발 전용입니다.
2. **환경변수**: `.env` 파일의 민감한 정보는 절대 커밋하지 마세요.
3. **볼륨 데이터**: `docker-compose down -v`는 DB 데이터를 삭제합니다.
4. **파일 업로드**: 로컬 환경에서는 `uploads/` 폴더 사용, AWS 환경에서는 S3 사용

---

## 🆘 도움말

```bash
# 스크립트 도움말 보기
./docker-scripts.sh

# Docker Compose 도움말
docker-compose --help
```

문제가 해결되지 않으면 팀 리더에게 문의하세요!

