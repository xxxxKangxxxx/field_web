# API Overview

## 기본 정보
- **Base URL (Local)**: `http://localhost:4002/api`
- **인증 방식**: Bearer Token (`Authorization: Bearer <JWT>`)
- **Content-Type**: `application/json` (파일 업로드는 `multipart/form-data`)

---

## 📌 모듈별 엔드포인트

### 🔐 Auth (인증)
| Method | Path | 권한 | 설명 |
|--------|------|------|------|
| POST | `/auth/register` | Public | 회원가입 |
| POST | `/auth/login` | Public | 로그인 (JWT 발급) |
| POST | `/auth/logout` | JWT | 로그아웃 |
| GET | `/auth/me` | JWT | 내 정보 조회 |

### 📤 Upload (S3 파일 업로드)
| Method | Path | 권한 | 설명 | 파일 필드명 |
|--------|------|------|------|------------|
| POST | `/upload/test` | JWT | 테스트 업로드 | `file` |
| POST | `/upload/camp` | JWT | 캠프 포스터 업로드 | `file` |
| POST | `/upload/news` | JWT | 뉴스 파일 업로드 | `file` |

### 🏕️ Camps (캠프)
| Method | Path | 권한 | 설명 | 파일 필드명 |
|--------|------|------|------|------------|
| GET | `/camps` | Public | 전체 캠프 목록 | - |
| GET | `/camps/:id` | Public | 특정 캠프 조회 | - |
| POST | `/camps` | Admin | 캠프 생성 | `posterImage` |
| PUT | `/camps/:id` | Admin | 캠프 수정 | `posterImage` (선택) |
| DELETE | `/camps/:id` | Admin | 캠프 삭제 | - |

### 📰 News (뉴스/소식)
| Method | Path | 권한 | 설명 | 파일 필드명 |
|--------|------|------|------|------------|
| GET | `/news?category=<monthly\|career\|notice>` | Public | 뉴스 목록 (카테고리 필터) | - |
| GET | `/news/:id` | Public | 특정 뉴스 조회 | - |
| POST | `/news` | Admin | 뉴스 생성 | `file` (선택) |
| PUT | `/news/:id` | Admin | 뉴스 수정 | `file` (선택) |
| DELETE | `/news/:id` | Admin | 뉴스 삭제 | - |

### 📢 Recruits (모집 공고)
| Method | Path | 권한 | 설명 |
|--------|------|------|------|
| GET | `/recruits` 또는 `/recruit` | Public | 전체 모집 일정 |
| GET | `/recruits/all` 또는 `/recruit/all` | Public | 전체 모집 일정 (alias) |
| GET | `/recruits/active` 또는 `/recruit/active` | Public | 활성화된 모집 일정 |
| GET | `/recruits/:id` 또는 `/recruit/:id` | Public | 특정 모집 일정 조회 |
| POST | `/recruits` 또는 `/recruit` | Admin | 모집 일정 생성 |
| PUT | `/recruits/:id` 또는 `/recruit/:id` | Admin | 모집 일정 수정 |
| DELETE | `/recruits/:id` 또는 `/recruit/:id` | Admin | 모집 일정 삭제 |

### 📞 Contacts (문의 접수)
| Method | Path | 권한 | 설명 |
|--------|------|------|------|
| POST | `/contacts` | Public | 문의 접수 |
| GET | `/contacts` | Admin | 전체 문의 목록 |

### ❓ Questions (FAQ)
| Method | Path | 권한 | 설명 |
|--------|------|------|------|
| GET | `/questions` | Public | FAQ 목록 |
| POST | `/questions` | Admin | FAQ 생성 |
| DELETE | `/questions/:id` | Admin | FAQ 삭제 |

### ⭐ Reviews (리뷰)
| Method | Path | 권한 | 설명 |
|--------|------|------|------|
| GET | `/reviews` | Public | 전체 리뷰 목록 |
| GET | `/reviews/camp/:campId` | Public | 특정 캠프의 리뷰 목록 |
| POST | `/reviews/camp/:campId` | Public | 특정 캠프에 리뷰 작성 |
| PUT | `/reviews/:id` | Public | 리뷰 수정 |
| DELETE | `/reviews/:id` | Public | 리뷰 삭제 |

### 👤 Profiles (프로필)
| Method | Path | 권한 | 설명 | 파일 필드명 |
|--------|------|------|------|------------|
| GET | `/profiles` | Public | 전체 프로필 목록 | - |
| POST | `/profiles` | Admin | 프로필 생성 | `photo` (선택) |
| DELETE | `/profiles/:id` | Admin | 프로필 삭제 | - |

### 💬 Inquiries (문의사항)
| Method | Path | 권한 | 설명 |
|--------|------|------|------|
| GET | `/inquiries` | Admin | 전체 문의사항 목록 |
| GET | `/inquiries/my` | JWT | 내 문의사항 목록 |
| GET | `/inquiries/:id` | Public | 특정 문의사항 조회 |
| POST | `/inquiries` | Public | 문의사항 생성 |
| PATCH | `/inquiries/:id/status` | Admin | 문의사항 상태 변경 |
| DELETE | `/inquiries/:id` | Admin | 문의사항 삭제 |

### 👥 Users (사용자)
| Method | Path | 권한 | 설명 |
|--------|------|------|------|
| GET | `/departments` 또는 `/users/departments` | Public | 부서 목록 조회 |

---

## 🔑 권한 타입

- **Public**: 인증 불필요
- **JWT**: `Authorization: Bearer <token>` 필요
- **Admin**: JWT + 관리자 권한 필요 (부장, 단장, 부단장)

---

## 📤 파일 업로드 규칙

### Multipart Form Data 필드명:
- Camps: `posterImage` (이미지만, 필수, 5MB)
- News: `file` (모든 파일, 선택, 10MB)
- Profiles: `photo` (이미지만, 선택, 5MB)
- Upload: `file` (이미지만, 5MB)

### S3 저장 구조:
- DB에는 S3 Key만 저장 (예: `camps/1234567890-abc.jpg`)
- 응답에는 전체 URL 반환 (`AWS_S3_PUBLIC_BASE_URL` + Key)
- 삭제 시 S3 파일도 자동 삭제

---

## 🔄 Nested 객체 처리

### Timeline (Camps)
```json
{
  "timeline": [
    { "date": "2025-07-01", "event": "오리엔테이션" },
    { "date": "2025-07-02", "event": "강의" }
  ]
}
```
- multipart로 전송 시 JSON 문자열로 변환: `'[{"date":"...","event":"..."}]'`

### Schedules (Recruits)
```json
{
  "schedules": [
    { "title": "서류 접수", "date": "2025-03-01 ~ 2025-03-15" }
  ]
}
```
- multipart로 전송 시 JSON 문자열로 변환

---

## 🚨 에러 응답 형식

```json
{
  "statusCode": 400,
  "message": "에러 메시지" 또는 ["메시지1", "메시지2"],
  "error": "Bad Request"
}
```

---

## 📝 예시 요청

### 회원가입
```bash
curl -X POST http://localhost:4002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@field.com",
    "password": "password123",
    "name": "홍길동",
    "department": "기획부",
    "position": "부원"
  }'
```

### 캠프 생성 (관리자)
```bash
curl -X POST http://localhost:4002/api/camps \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -F "year=2025" \
  -F "topic=AI 캠프" \
  -F "description=AI 학습 캠프" \
  -F "location=서울" \
  -F "participants=50" \
  -F 'timeline=[{"date":"2025-07-01","event":"오리엔테이션"}]' \
  -F "posterImage=@poster.jpg"
```

### 뉴스 조회 (카테고리 필터)
```bash
curl http://localhost:4002/api/news?category=monthly
```


