#!/bin/bash

# FIELD 프로젝트 Docker Compose 실행 스크립트

echo "======================================"
echo "FIELD Docker Compose 관리 스크립트"
echo "======================================"
echo ""

case "$1" in
  "scenario-a"|"a")
    echo "📦 시나리오 A: Nest.js 개발 환경 실행"
    echo "   서비스: backend (Nest.js), mongodb, mongo-express"
    docker-compose up -d backend mongodb mongo-express
    echo ""
    echo "✅ 접속 정보:"
    echo "   - Nest.js API: http://localhost:4002"
    echo "   - MongoDB: localhost:27017"
    echo "   - Mongo Express: http://localhost:8081 (admin/admin)"
    ;;
  
  "scenario-b"|"b")
    echo "📦 시나리오 B: 프론트-백엔드 통합 테스트"
    echo "   서비스: frontend, backend (Nest.js), mongodb"
    docker-compose up -d frontend backend mongodb
    echo ""
    echo "✅ 접속 정보:"
    echo "   - Frontend: http://localhost:5173"
    echo "   - Nest.js API: http://localhost:4002"
    echo "   - MongoDB: localhost:27017"
    ;;
  
  "scenario-c"|"c")
    echo "📦 시나리오 C: 전체 서비스 실행 (구/신 서버 비교)"
    echo "   서비스: 모든 서비스 (5개)"
    docker-compose up -d
    echo ""
    echo "✅ 접속 정보:"
    echo "   - Frontend: http://localhost:5173"
    echo "   - Nest.js API (신규): http://localhost:4002"
    echo "   - Express API (기존): http://localhost:4001"
    echo "   - MongoDB: localhost:27017"
    echo "   - Mongo Express: http://localhost:8081 (admin/admin)"
    ;;
  
  "down"|"stop")
    echo "🛑 모든 서비스 중지 및 제거"
    docker-compose down
    echo "✅ 모든 서비스가 중지되었습니다."
    ;;
  
  "logs")
    if [ -z "$2" ]; then
      echo "📋 모든 서비스 로그 보기"
      docker-compose logs -f
    else
      echo "📋 $2 서비스 로그 보기"
      docker-compose logs -f "$2"
    fi
    ;;
  
  "rebuild")
    echo "🔨 이미지 재빌드 및 재시작"
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    echo "✅ 재빌드 완료!"
    ;;
  
  "clean")
    echo "🧹 모든 컨테이너, 볼륨, 이미지 정리"
    docker-compose down -v --rmi all
    echo "✅ 정리 완료!"
    ;;
  
  *)
    echo "사용법: ./docker-scripts.sh [명령어]"
    echo ""
    echo "명령어:"
    echo "  scenario-a, a      - Nest.js 개발 환경 (백엔드 + DB + DB GUI)"
    echo "  scenario-b, b      - 통합 테스트 (프론트 + 백엔드 + DB)"
    echo "  scenario-c, c      - 전체 실행 (모든 서비스)"
    echo "  down, stop         - 모든 서비스 중지"
    echo "  logs [서비스명]     - 로그 보기"
    echo "  rebuild            - 이미지 재빌드"
    echo "  clean              - 전체 정리"
    echo ""
    echo "예시:"
    echo "  ./docker-scripts.sh a          # 시나리오 A 실행"
    echo "  ./docker-scripts.sh logs backend  # backend 로그 보기"
    ;;
esac

