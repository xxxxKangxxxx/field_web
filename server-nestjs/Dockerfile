# ========================================
# Stage 1: 빌드 단계
# ========================================
FROM node:20-alpine AS builder

WORKDIR /app

# 의존성 파일 복사 및 설치 (devDependencies 포함 - 빌드에 필요)
COPY package*.json ./
RUN npm ci && npm cache clean --force

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# ========================================
# Stage 2: 프로덕션 단계
# ========================================
FROM node:20-alpine AS production

WORKDIR /app

# 프로덕션 의존성만 설치
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# 빌드된 파일만 복사
COPY --from=builder /app/dist ./dist

# 환경변수 기본값 설정
ENV NODE_ENV=production
ENV PORT=4002

# 포트 노출
EXPOSE 4002

# 서버 실행
CMD ["node", "dist/src/main"]

