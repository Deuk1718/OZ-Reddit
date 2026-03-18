# OZ-Reddit MVP PRD

**작성일**: 2026-03-18
**원본 PRD**: `pm-skills/docs/OZ-reddit/03-PRD.md`
**목표**: 최소 기능으로 "커뮤니티에서 글을 쓰고, 투표하고, 댓글로 토론한다"는 핵심 경험을 검증

---

## 1. MVP 범위 원칙

- **포함**: 사용자가 커뮤니티 게시판을 이용하는 가장 기본적인 루프 (가입 → 글 읽기 → 글 쓰기 → 투표 → 댓글)
- **제외**: 모더레이션, 카르마, 검색, 알림, 이미지 업로드 등은 MVP 이후로 미룸
- **기준**: 이 기능이 없으면 서비스 자체가 성립하지 않는가?

---

## 2. MVP 핵심 기능 (6개)

| # | 기능 | 설명 | 비고 |
|---|------|------|------|
| M01 | **회원가입/로그인** | 이메일+비밀번호 가입. 소셜 로그인은 MVP 이후. | 원본 F01 축소 |
| M02 | **서브레딧 생성/조회** | 이름+설명으로 커뮤니티 생성. 유형은 Public만. | 원본 F02 축소 |
| M03 | **게시글 작성/피드** | Text 게시글만 지원. 제목+본문. Hot/New 정렬. 페이지네이션. | 원본 F04+F05 통합 축소 |
| M04 | **게시글 상세 보기** | 본문 + 댓글 목록 표시 | 원본 F06 |
| M05 | **댓글 시스템** | 댓글 작성 + 대댓글(1단계 중첩). 정렬은 New만. | 원본 F07 축소 |
| M06 | **투표 시스템** | 게시글/댓글에 Upvote/Downvote. 점수 표시. | 원본 F08 |

### MVP에서 제외한 P0 기능과 사유

| 원본 | 기능 | 제외 사유 |
|------|------|----------|
| F03 | 서브레딧 구독/탈퇴 | 없어도 서브레딧 직접 방문으로 이용 가능. 맞춤 피드는 MVP 이후. |
| F09 | 카르마 시스템 | 투표 점수만 보여주면 충분. 별도 카르마 집계는 MVP 이후. |
| F10 | 사용자 프로필 | 닉네임 표시만으로 충분. 프로필 페이지는 MVP 이후. |
| F11 | 검색 | 서브레딧 목록 브라우징으로 대체. 검색은 MVP 이후. |
| F12 | 모더레이션 | 작성자 본인 삭제만 지원. 관리 도구는 MVP 이후. |

---

## 3. 사용자 시나리오 (Core Loop)

```
1. 가입/로그인
2. 홈 피드에서 전체 게시글 탐색 (Hot/New)
3. 서브레딧 목록에서 관심 커뮤니티 선택
4. 게시글 읽기 → Upvote/Downvote
5. 댓글 작성 → 대댓글로 토론
6. 새 게시글 작성 (서브레딧 선택 → 제목/본문 입력)
7. 새 서브레딧 생성 (커뮤니티가 없을 경우)
```

---

## 4. 데이터베이스 스키마 (MVP)

```sql
-- Users
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      VARCHAR(30) UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Subreddits
CREATE TABLE subreddits (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(21) UNIQUE NOT NULL,
  description   TEXT,
  created_by    UUID REFERENCES users(id),
  member_count  INTEGER DEFAULT 0,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Posts
CREATE TABLE posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         VARCHAR(300) NOT NULL,
  body          TEXT,
  author_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  subreddit_id  UUID REFERENCES subreddits(id) ON DELETE CASCADE,
  score         INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- Comments (1단계 중첩)
CREATE TABLE comments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  body          TEXT NOT NULL,
  author_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  post_id       UUID REFERENCES posts(id) ON DELETE CASCADE,
  parent_id     UUID REFERENCES comments(id) ON DELETE CASCADE,
  score         INTEGER DEFAULT 0,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Votes
CREATE TABLE votes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  target_type VARCHAR(10) NOT NULL,       -- 'post' | 'comment'
  target_id   UUID NOT NULL,
  value       SMALLINT NOT NULL CHECK (value IN (-1, 1)),
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- Indexes
CREATE INDEX idx_posts_subreddit ON posts(subreddit_id, created_at DESC);
CREATE INDEX idx_posts_score ON posts(score DESC);
CREATE INDEX idx_comments_post ON comments(post_id, created_at);
CREATE INDEX idx_votes_target ON votes(target_type, target_id);
```

---

## 5. API 엔드포인트 (MVP)

### 인증
| Method | Endpoint | 설명 |
|--------|---------|------|
| POST | `/api/auth/register` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/logout` | 로그아웃 |
| GET | `/api/auth/me` | 현재 사용자 정보 |

### 서브레딧
| Method | Endpoint | 설명 |
|--------|---------|------|
| GET | `/api/subreddits` | 서브레딧 목록 |
| POST | `/api/subreddits` | 서브레딧 생성 |
| GET | `/api/subreddits/:name` | 서브레딧 상세 |

### 게시글
| Method | Endpoint | 설명 |
|--------|---------|------|
| GET | `/api/posts` | 피드 (query: sort, subreddit) |
| POST | `/api/posts` | 게시글 작성 |
| GET | `/api/posts/:id` | 게시글 상세 |
| DELETE | `/api/posts/:id` | 게시글 삭제 (본인만) |

### 댓글
| Method | Endpoint | 설명 |
|--------|---------|------|
| GET | `/api/posts/:id/comments` | 댓글 목록 |
| POST | `/api/posts/:id/comments` | 댓글 작성 |
| DELETE | `/api/comments/:id` | 댓글 삭제 (본인만) |

### 투표
| Method | Endpoint | 설명 |
|--------|---------|------|
| POST | `/api/votes` | 투표 (body: target_type, target_id, value) |
| DELETE | `/api/votes/:target_type/:target_id` | 투표 취소 |

---

## 6. 기술 스택 (MVP)

| 영역 | 기술 | 선택 이유 |
|------|------|----------|
| 프레임워크 | **Next.js 14+ (App Router)** | SSR + API Routes 통합, 풀스택 단일 프로젝트 |
| 언어 | **TypeScript** | 타입 안전성 |
| 스타일링 | **Tailwind CSS** | 빠른 UI 구축 |
| ORM | **Prisma** | 타입 안전 쿼리, 마이그레이션 관리 |
| DB | **PostgreSQL** | 관계형 데이터에 최적 |
| 인증 | **NextAuth.js** | Next.js 네이티브 통합, Credentials Provider |
| 배포 | **Vercel + Supabase (DB)** | 무료 티어로 MVP 운영 가능 |

### MVP에서 제외한 기술

| 기술 | 제외 사유 |
|------|----------|
| Redis | MVP 트래픽에서는 DB 직접 조회로 충분 |
| S3/Cloudinary | 이미지 업로드 미지원 |
| React Query | Next.js Server Components + fetch로 대체 |
| Zustand | 서버 컴포넌트 중심이라 클라이언트 상태 최소화 |

---

## 7. 페이지 구조 (MVP)

```
/                       → 홈 피드 (전체 게시글, Hot/New 정렬)
/login                  → 로그인
/register               → 회원가입
/r/[name]               → 서브레딧 피드
/r/[name]/submit        → 게시글 작성
/r/[name]/[postId]      → 게시글 상세 + 댓글
/subreddits             → 서브레딧 목록
/subreddits/create      → 서브레딧 생성
```

---

## 8. MVP 개발 일정 (2주)

| 일정 | 작업 |
|------|------|
| **Day 1-2** | 프로젝트 세팅 (Next.js, Prisma, PostgreSQL, NextAuth) + DB 스키마 |
| **Day 3-4** | 인증 (회원가입, 로그인, 로그아웃) + 레이아웃/네비게이션 |
| **Day 5-6** | 서브레딧 생성/목록/상세 |
| **Day 7-8** | 게시글 CRUD + 피드 (Hot/New 정렬) |
| **Day 9-10** | 댓글 시스템 (작성, 대댓글 1단계) |
| **Day 11-12** | 투표 시스템 (Upvote/Downvote, 낙관적 업데이트) |
| **Day 13** | UI 다듬기, 에러 처리, 로딩 상태 |
| **Day 14** | 배포 (Vercel + Supabase) + 시드 데이터 |

---

## 9. MVP 성공 기준

| 기준 | 설명 |
|------|------|
| 핵심 루프 작동 | 가입 → 서브레딧 생성 → 글 작성 → 투표 → 댓글의 전체 플로우가 에러 없이 동작 |
| 피드 정렬 | Hot/New 정렬이 의도대로 동작 |
| 투표 반영 | 투표 시 점수가 즉시 UI에 반영 (낙관적 업데이트) |
| 배포 완료 | 퍼블릭 URL로 접근 가능 |

---

## 10. MVP 이후 우선순위

| 순서 | 기능 | 사유 |
|------|------|------|
| 1 | 서브레딧 구독 + 맞춤 홈 피드 | 개인화된 경험 → 리텐션 핵심 |
| 2 | 사용자 프로필 | 정체성 + 활동 이력 → 커뮤니티 참여 동기 |
| 3 | 검색 | 콘텐츠 양 증가 시 필수 |
| 4 | 알림 시스템 | 재방문 유도 |
| 5 | 모더레이션 도구 | 커뮤니티 규모 커지면 필수 |
| 6 | 다크 모드 + 반응형 | UX 개선 |
