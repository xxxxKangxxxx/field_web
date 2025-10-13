# Field Web

Field 동아리 공식 웹사이트 프로젝트입니다.

## 📋 프로젝트 개요

Field 동아리의 활동 소개, 캠프 정보, 뉴스, 모집 공고 등을 제공하는 웹 애플리케이션입니다.

## 🛠 기술 스택

### Frontend
- **React 18.2** - UI 라이브러리
- **Vite** - 빌드 도구
- **Redux Toolkit** - 상태 관리
- **React Router v6** - 라우팅
- **Styled Components** - CSS-in-JS
- **Material-UI (MUI)** - UI 컴포넌트 라이브러리
- **Framer Motion** - 애니메이션
- **Axios** - HTTP 클라이언트
- **React Query** - 서버 상태 관리

### Backend
- **Node.js** - 런타임 환경
- **Express 5** - 웹 프레임워크
- **MongoDB** - 데이터베이스
- **Mongoose** - ODM (Object Data Modeling)
- **JWT** - 인증/인가
- **Bcrypt** - 비밀번호 암호화
- **Multer** - 파일 업로드

## 📁 프로젝트 구조

```
field_web/
├── frontend/           # React 프론트엔드
│   ├── src/
│   │   ├── components/ # 재사용 가능한 컴포넌트
│   │   ├── pages/      # 페이지 컴포넌트
│   │   ├── redux/      # Redux 스토어 및 슬라이스
│   │   ├── api/        # API 설정
│   │   ├── utils/      # 유틸리티 함수
│   │   └── layout/     # 레이아웃 컴포넌트
│   └── public/         # 정적 파일
│
└── server/             # Node.js 백엔드
    ├── controllers/    # 비즈니스 로직
    ├── models/         # Mongoose 모델
    ├── routes/         # API 라우트
    ├── middleware/     # 미들웨어
    └── uploads/        # 업로드된 파일
```

## 🚀 시작하기

### 사전 요구사항

- Node.js (v16 이상)
- MongoDB
- npm 또는 pnpm

### 설치 및 실행

#### 1. 저장소 클론

```bash
git clone <repository-url>
cd field_web
```

#### 2. Backend 설정

```bash
cd server
npm install

# .env 파일 생성
echo "MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development" > .env

# 서버 실행
npm start
```

서버가 `http://localhost:4001`에서 실행됩니다.

#### 3. Frontend 설정

```bash
cd ../frontend
npm install  # 또는 pnpm install

# 개발 서버 실행
npm run dev
```

프론트엔드가 `http://localhost:5173`에서 실행됩니다.

## 📡 주요 API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/verify` - 토큰 검증

### 캠프
- `GET /api/camps` - 캠프 목록 조회
- `POST /api/camps` - 캠프 생성 (관리자)
- `PUT /api/camps/:id` - 캠프 수정 (관리자)
- `DELETE /api/camps/:id` - 캠프 삭제 (관리자)

### 뉴스
- `GET /api/news` - 뉴스 목록 조회
- `GET /api/news/:id` - 뉴스 상세 조회
- `POST /api/news` - 뉴스 작성 (관리자)

### 모집
- `GET /api/recruit` - 모집 공고 조회
- `POST /api/recruit` - 모집 공고 작성 (관리자)

### 문의
- `POST /api/contact` - 문의 등록
- `GET /api/inquiries` - 문의 목록 조회 (관리자)

## 🎨 주요 기능

- ✅ 동아리 소개 및 활동 내용
- ✅ 캠프 정보 및 이미지 갤러리
- ✅ 뉴스 및 공지사항
- ✅ 모집 공고 관리
- ✅ 문의하기 폼
- ✅ 관리자 대시보드
- ✅ 회원 인증 시스템
- ✅ 반응형 디자인

## 🔐 환경 변수

### Backend (.env)

```env
MONGO_URI=mongodb://localhost:27017/field_web
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

## 📝 개발 스크립트

### Frontend

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 미리보기
npm run lint     # ESLint 실행
```

### Backend

```bash
npm start        # 서버 실행
npm test         # 테스트 실행 (구현 필요)
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 Field 동아리의 소유입니다.

## 📞 문의

프로젝트 관련 문의사항이 있으시면 Field 동아리로 연락 주세요.
