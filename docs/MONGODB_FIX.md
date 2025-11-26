# MongoDB 인증 오류 해결 가이드

## 문제: Authentication failed

MongoDB 컨테이너의 인증 설정이 잘못되어 발생하는 문제입니다.

## 해결 방법

### 방법 1: MongoDB 컨테이너 재생성 (권장)

```bash
# 1. MongoDB 컨테이너 중지 및 삭제
docker-compose stop mongodb
docker-compose rm -f mongodb

# 2. MongoDB 볼륨 삭제 (데이터 초기화)
docker volume rm field_web_mongodb_data field_web_mongodb_config

# 3. MongoDB 재생성
docker-compose up -d mongodb

# 4. MongoDB가 준비될 때까지 대기 (약 10초)
sleep 10

# 5. 연결 테스트
docker exec field-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin --eval "db.adminCommand('ping')"
```

### 방법 2: 인증 없이 연결 (개발 환경용, 보안상 권장하지 않음)

만약 데이터를 유지하면서 빠르게 해결하려면:

```bash
# 1. MongoDB 컨테이너 중지
docker-compose stop mongodb

# 2. docker-compose.yml에서 인증 관련 환경변수 제거 후 재시작
# 또는 MongoDB를 인증 없이 실행하도록 설정 변경
```

## 확인

재생성 후 다음 명령으로 확인:

```bash
# MongoDB 연결 테스트
docker exec field-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin --eval "db.adminCommand('ping')"

# 성공 시 출력: { ok: 1 }
```

## 주의사항

- 볼륨을 삭제하면 **모든 데이터가 삭제**됩니다
- 프로덕션 환경에서는 절대 사용하지 마세요
- 개발 환경에서만 사용하세요

