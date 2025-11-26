# 🔐 MongoDB에서 최상위 관리자 권한 부여 (빠른 가이드)

로컬 테스트를 위해 MongoDB에서 직접 일반 회원 계정을 최상위 관리자로 만드는 방법입니다.

## 📋 방법 1: MongoDB Shell 사용 (권장)

### 1단계: MongoDB 컨테이너 접속

```bash
docker exec -it field-mongodb mongosh field_db
```

### 2단계: 사용자 목록 확인

```javascript
// 모든 사용자 조회
db.users.find({}, {email: 1, name: 1, isSuperAdmin: 1, isAdmin: 1}).pretty()

// 특정 이메일로 사용자 찾기
db.users.findOne({email: "user@example.com"})
```

### 3단계: 최상위 관리자 권한 부여

```javascript
// 방법 A: 이메일로 찾아서 업데이트
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { isSuperAdmin: true } }
)

// 방법 B: 이름으로 찾아서 업데이트
db.users.updateOne(
  { name: "사용자이름" },
  { $set: { isSuperAdmin: true } }
)

// 방법 C: _id로 찾아서 업데이트
db.users.updateOne(
  { _id: ObjectId("507f1f77bcf86cd799439011") },
  { $set: { isSuperAdmin: true } }
)
```

### 4단계: 확인

```javascript
// 업데이트 확인
db.users.findOne({email: "user@example.com"}, {email: 1, name: 1, isSuperAdmin: 1})
```

### 5단계: MongoDB Shell 종료

```javascript
exit
```

---

## 📋 방법 2: 한 줄 명령어 사용

터미널에서 직접 실행:

```bash
# 이메일로 찾아서 최상위 관리자 권한 부여
docker exec field-mongodb mongosh field_db --eval 'db.users.updateOne({email: "user@example.com"}, {$set: {isSuperAdmin: true}})' --quiet

# 확인
docker exec field-mongodb mongosh field_db --eval 'db.users.findOne({email: "user@example.com"}, {email: 1, name: 1, isSuperAdmin: 1})' --quiet
```

---

## 📋 방법 3: Mongo Express 사용 (GUI)

1. **Mongo Express 접속**: http://localhost:8081
   - Username: `admin`
   - Password: `admin`

2. **데이터베이스 선택**: `field_db`

3. **컬렉션 선택**: `users`

4. **사용자 찾기**: 이메일 또는 이름으로 검색

5. **편집**: 
   - 사용자 문서 클릭
   - `isSuperAdmin` 필드를 `true`로 변경
   - 저장

---

## 🔍 현재 사용자 확인

```bash
# 모든 사용자 목록 (이메일, 이름, 권한만)
docker exec field-mongodb mongosh field_db --eval 'db.users.find({}, {email: 1, name: 1, isSuperAdmin: 1, isAdmin: 1, position: 1}).pretty()' --quiet
```

---

## ✅ 테스트 확인

권한 부여 후:

1. **로그아웃** (기존 세션 종료)
2. **다시 로그인**
3. **헤더 메뉴 확인**: "사용자 관리" 메뉴가 보이는지 확인
4. **사용자 관리 페이지 접속**: `/admin/users` 접속 가능한지 확인

---

## 🔄 권한 제거 (테스트 후)

```bash
# 최상위 관리자 권한 제거
docker exec field-mongodb mongosh field_db --eval 'db.users.updateOne({email: "user@example.com"}, {$set: {isSuperAdmin: false}})' --quiet
```

---

## 💡 팁

### 여러 사용자를 한 번에 확인

```javascript
// MongoDB Shell에서
db.users.find({}, {
  email: 1,
  name: 1,
  isSuperAdmin: 1,
  isAdmin: 1,
  position: 1,
  department: 1
}).sort({createdAt: -1}).pretty()
```

### 모든 최상위 관리자 확인

```javascript
db.users.find({isSuperAdmin: true}, {email: 1, name: 1}).pretty()
```

