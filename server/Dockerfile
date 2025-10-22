# ========================================
# Express Legacy Server Dockerfile
# ========================================
FROM node:20-alpine

WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# 소스 코드 전체 복사
COPY . .

# 환경변수 기본값 설정
ENV NODE_ENV=production
ENV PORT=4001

# 포트 노출
EXPOSE 4001

# 서버 실행
CMD ["npm", "start"]

