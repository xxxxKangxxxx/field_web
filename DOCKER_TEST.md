# 🧪 Docker Compose 환경 테스트 가이드

## 📋 테스트 체크리스트

### 1️⃣ 시나리오 A 테스트 (Nest.js 개발 환경)

```bash
# 1. 서비스 실행
./docker-scripts.sh a

# 2. 컨테이너 상태 확인
docker ps
```

#### ✅ 확인 사항

- [ ] **backend** 컨테이너가 `Up` 상태
- [ ] **mongodb** 컨테이너가 `Up` 상태
- [ ] **mongo-express** 컨테이너가 `Up` 상태

```bash
# 3. Nest.js 서버 접속 테스트
curl http://localhost:4002

# 예상 응답: HTML 또는 "Cannot GET /" (정상)
```

```bash
# 4. Mongo Express 접속 테스트
open http://localhost:8081
# 또는 브라우저에서 http://localhost:8081 접속
# 로그인: admin / admin
```

#### ✅ 확인 사항

- [ ] Nest.js 서버 응답 확인
- [ ] Mongo Express 로그인 성공
- [ ] `field_db` 데이터베이스 표시 확인

```bash
# 5. 로그 확인
./docker-scripts.sh logs backend

# 예상 로그:
# "🚀 Nest.js 서버 실행 중: http://localhost:4002"
# "✅ MongoDB 연결 성공!" (예상)
```

```bash
# 6. 서비스 중지
./docker-scripts.sh stop
```

---

### 2️⃣ 시나리오 B 테스트 (프론트-백엔드 통합)

```bash
# 1. 서비스 실행
./docker-scripts.sh b

# 2. 컨테이너 상태 확인
docker ps
```

#### ✅ 확인 사항

- [ ] **frontend** 컨테이너가 `Up` 상태
- [ ] **backend** 컨테이너가 `Up` 상태
- [ ] **mongodb** 컨테이너가 `Up` 상태

```bash
# 3. Frontend 접속 테스트
open http://localhost:5173
```

#### ✅ 확인 사항

- [ ] React 앱이 정상적으로 로드됨
- [ ] 브라우저 콘솔에 에러 없음
- [ ] API 호출 시 `localhost:4002`로 요청됨

```bash
# 4. 서비스 중지
./docker-scripts.sh stop
```

---

### 3️⃣ 시나리오 C 테스트 (전체 서비스)

```bash
# 1. 서비스 실행
./docker-scripts.sh c

# 2. 컨테이너 상태 확인
docker ps

# 5개의 컨테이너가 모두 Up 상태여야 함
```

#### ✅ 확인 사항

- [ ] **frontend** 컨테이너가 `Up` 상태
- [ ] **backend** (Nest.js) 컨테이너가 `Up` 상태
- [ ] **backend-legacy** (Express) 컨테이너가 `Up` 상태
- [ ] **mongodb** 컨테이너가 `Up` 상태
- [ ] **mongo-express** 컨테이너가 `Up` 상태

```bash
# 3. 두 백엔드 서버 비교
curl http://localhost:4001  # Express
curl http://localhost:4002  # Nest.js
```

#### ✅ 확인 사항

- [ ] Express 서버 (4001) 응답: `<h1>Server is Okay<h1>` (오타 포함)
- [ ] Nest.js 서버 (4002) 응답: 정상

```bash
# 4. 서비스 중지
./docker-scripts.sh stop
```

---

## 🐛 트러블슈팅 테스트

### 테스트 1: 핫 리로드 확인 (Nest.js)

```bash
# 1. 시나리오 A 실행
./docker-scripts.sh a

# 2. 코드 수정
# server-nestjs/src/app.service.ts 파일 수정
# getHello() 메서드의 반환 문자열 변경

# 3. 로그 확인 (자동 재시작 확인)
./docker-scripts.sh logs backend

# 예상: "File change detected. Starting incremental compilation..."

# 4. 변경 확인
curl http://localhost:4002
```

### 테스트 2: MongoDB 데이터 영속성

```bash
# 1. 서비스 실행
./docker-scripts.sh a

# 2. Mongo Express에서 컬렉션 생성
# http://localhost:8081 접속 후 테스트 데이터 입력

# 3. 서비스 중지 (볼륨은 유지)
./docker-scripts.sh stop

# 4. 서비스 재시작
./docker-scripts.sh a

# 5. Mongo Express에서 데이터 확인
# http://localhost:8081 접속 후 데이터가 유지되는지 확인
```

#### ✅ 확인 사항

- [ ] 데이터가 그대로 유지됨 (볼륨 작동 확인)

### 테스트 3: 네트워크 통신 확인

```bash
# 1. 시나리오 B 실행
./docker-scripts.sh b

# 2. Backend 컨테이너 내부 접속
docker exec -it field-backend-nestjs sh

# 3. MongoDB 연결 테스트 (컨테이너 내부에서)
ping mongodb

# 예상: mongodb 호스트가 ping 응답

# 4. 종료
exit
```

---

## 📊 성능 테스트 (선택)

### CPU 및 메모리 사용량 확인

```bash
# 전체 서비스 실행 후
docker stats

# 각 컨테이너의 CPU, 메모리 사용량 실시간 확인
```

#### 예상 리소스 사용량

| 서비스 | CPU | 메모리 |
|--------|-----|--------|
| mongodb | ~1% | ~100MB |
| mongo-express | ~0.5% | ~50MB |
| backend (Nest.js) | ~2% | ~150MB |
| backend-legacy | ~1% | ~100MB |
| frontend | ~1% | ~80MB |

---

## ✅ 최종 검증 체크리스트

완료된 항목에 체크하세요:

### 기본 설정
- [ ] Docker Desktop 설치 완료
- [ ] `docker-scripts.sh` 실행 권한 부여
- [ ] 모든 `.env` 파일 생성 확인

### 시나리오 A (Nest.js 개발)
- [ ] 3개 컨테이너 정상 실행
- [ ] Nest.js 서버 응답 확인
- [ ] Mongo Express 접속 성공
- [ ] MongoDB 연결 확인

### 시나리오 B (통합 테스트)
- [ ] 3개 컨테이너 정상 실행
- [ ] Frontend 로드 성공
- [ ] Frontend-Backend 통신 확인

### 시나리오 C (전체)
- [ ] 5개 컨테이너 정상 실행
- [ ] Express (4001) 응답 확인
- [ ] Nest.js (4002) 응답 확인
- [ ] 두 서버 동시 작동 확인

### 추가 기능
- [ ] 핫 리로드 작동 확인
- [ ] 데이터 영속성 확인
- [ ] 네트워크 통신 확인

---

## 🚨 테스트 실패 시 조치

### 1. 모든 컨테이너 정리 후 재시작

```bash
# 전체 정리
./docker-scripts.sh clean

# 이미지 재빌드
docker-compose build --no-cache

# 재실행
./docker-scripts.sh a
```

### 2. 로그 수집

```bash
# 모든 서비스 로그 파일로 저장
docker-compose logs > docker-logs.txt

# 특정 서비스 로그
docker-compose logs backend > backend-logs.txt
```

### 3. 네트워크 리셋

```bash
# Docker 네트워크 확인
docker network ls

# 불필요한 네트워크 정리
docker network prune
```

---

## 📞 지원

모든 테스트가 완료되면 **1단계 (로컬 개발 환경 구축)** 완료!  
다음 단계: **2단계 (AWS 인프라 구축)** 진행

문제 발생 시:
1. `docker-logs.txt` 파일 생성
2. 오류 메시지 스크린샷
3. 팀 리더에게 문의

