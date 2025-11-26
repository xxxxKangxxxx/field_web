# MongoDB 연결 문제 해결 가이드

## 문제
MongoDB 컨테이너 내부에서 `mongosh`로 연결은 성공하지만, 호스트에서 Node.js로 연결할 때 인증 실패가 발생합니다.

## 해결 방법

### 방법 1: 인증 없이 연결 (개발 환경용, 권장)

`.env` 파일의 `MONGO_URI`를 다음과 같이 변경:

```env
# 로컬 개발용 (인증 없이)
MONGO_URI=mongodb://localhost:27017/field_db
```

그리고 `docker-compose.yml`에서 MongoDB 인증 관련 환경변수를 제거:

```yaml
mongodb:
  image: mongo:7
  container_name: field-mongodb
  restart: unless-stopped
  ports:
    - "27017:27017"
  environment:
    # 인증 관련 환경변수 제거
    MONGO_INITDB_DATABASE: field_db
  volumes:
    - mongodb_data:/data/db
    - mongodb_config:/data/configdb
```

### 방법 2: MongoDB 컨테이너 재생성

```bash
# 1. MongoDB 컨테이너와 볼륨 삭제
docker-compose stop mongodb
docker-compose rm -f mongodb
docker volume rm field_web_mongodb_data field_web_mongodb_config

# 2. docker-compose.yml 수정 (인증 제거)

# 3. MongoDB 재생성
docker-compose up -d mongodb

# 4. 서버 재시작
cd server-nestjs
npm run start:dev
```

## 확인

연결이 성공하면 다음 로그가 표시됩니다:
```
🔗 MongoDB 연결 시도: mongodb://localhost:27017/field_db
[Nest] LOG [MongooseModule] MongooseModule dependencies initialized
🚀 Nest.js 서버 실행 중: http://localhost:4002
```

## 주의사항

- **개발 환경에서만** 인증 없이 실행하세요
- **프로덕션 환경**에서는 MongoDB Atlas를 사용하므로 문제없습니다
- 로컬 개발 환경은 외부에서 접근할 수 없으므로 보안 문제는 없습니다

