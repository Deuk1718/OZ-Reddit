# OZ-Reddit 프로젝트 규칙

## 프로젝트 개요

Reddit 클론 MVP. 핵심 기능: 회원가입/로그인, 서브레딧, 게시글, 댓글, 투표.
PRD 상세: @docs/MVP-PRD.md

## 기술 스택

- Next.js 14+ (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Prisma ORM + PostgreSQL (Supabase 연동)
- NextAuth.js (Credentials Provider)

## 언어

- 모든 응답(코드 주석, 커밋 메시지, PR 설명, Claude 응답): 한국어
- 변수/함수/클래스명: 영어

## TypeScript

- `strict: true` 필수
- `any` 타입 사용 금지. `unknown`을 사용하고 타입 가드로 좁힐 것
- 함수 반환 타입 명시 권장
- 타입과 인터페이스는 `types/` 디렉토리 또는 해당 모듈 내 별도 파일로 관리

## 네이밍 컨벤션

- **컴포넌트**: PascalCase (`PostCard`, `VoteButton`)
- **함수/변수**: camelCase (`getPostById`, `commentCount`)
- **타입/인터페이스**: PascalCase + 접미사 없음 (`Post`, `User`, `CreatePostInput`)
- **상수**: UPPER_SNAKE_CASE (`MAX_TITLE_LENGTH`, `API_BASE_URL`)
- **파일명**: 컴포넌트는 PascalCase (`PostCard.tsx`), 유틸/훅은 camelCase (`useVote.ts`, `formatDate.ts`)
- **디렉토리명**: kebab-case (`api-handlers/`, `auth-utils/`)

## Import 순서

그룹 사이에 빈 줄로 구분:

```typescript
// 1. React/Next.js
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. 외부 라이브러리
import { prisma } from '@prisma/client'

// 3. 내부 모듈 (절대경로 alias @/ 사용)
import { PostCard } from '@/components/PostCard'
import { getPostById } from '@/lib/posts'

// 4. 타입 (type-only import)
import type { Post } from '@/types'
```

## 컴포넌트 작성

- Server Component 기본, 클라이언트 상태가 필요할 때만 `'use client'`
- `export default function` 대신 named export 후 별도 default export 지양. 페이지 컴포넌트(`page.tsx`)만 default export
- Props는 인라인 타입 대신 별도 타입 정의

## 클린 아키텍처

레이어 분리 원칙을 따른다. 의존성은 항상 안쪽(도메인)을 향한다.

```
src/
├── domain/          # 엔티티, 비즈니스 규칙 (외부 의존성 없음)
│   ├── entities/    # Post, Comment, User, Vote 등 핵심 엔티티
│   └── rules/       # 투표 중복 검사, 권한 확인 등 비즈니스 규칙
├── application/     # 유스케이스 (domain만 의존)
│   └── use-cases/   # createPost, castVote 등 애플리케이션 로직
├── infrastructure/  # 외부 시스템 구현 (Prisma, NextAuth 등)
│   ├── db/          # Prisma 클라이언트, 리포지토리 구현체
│   └── auth/        # NextAuth 설정
├── app/             # Next.js App Router (프레젠테이션 + API 라우트)
│   └── api/         # API Route Handlers → use-case 호출
├── components/      # UI 컴포넌트
└── lib/             # 공유 유틸리티
```

- **domain**: 순수 TypeScript. Prisma, Next.js 등 프레임워크에 의존하지 않는다
- **application**: 유스케이스 단위로 함수 작성. 리포지토리는 인터페이스로 주입받는다
- **infrastructure**: domain에 정의된 인터페이스의 구현체를 제공한다
- **app/api**: Route Handler는 얇게 유지. 요청 파싱 → use-case 호출 → 응답 반환만 담당

## PDCA 개발 프로세스

모든 구현은 PDCA(Plan-Do-Check-Act) 사이클을 철저히 준수한다.

### Plan (계획)

- 구현 시작 전 반드시 계획을 수립한다
- 계획에 따른 체크리스트를 `docs/checklists/`에 작성한다
- 체크리스트 파일명: `YYYY-MM-DD-기능명-checklist.md` (예: `2026-03-18-인증-checklist.md`)

### Do (실행)

- 체크리스트 항목을 하나씩 완료하며 구현한다
- 에러 발생 시 즉시 `docs/errors/`에 기록한다

### Check (검증)

- 기능 단위(M01~M06) 구현 완료 시 GAP 분석을 수행한다
- 계획 대비 실제 구현의 차이를 `docs/gap-analysis/`에 기록한다

### Act (개선)

- GAP 분석 결과를 바탕으로 개선 사항을 도출하고 다음 사이클에 반영한다

## 문서화 규칙

### 문서 저장 구조

```
docs/
├── checklists/       # 구현 전 체크리스트
├── implementations/  # 기능 구현 완료 기록
├── errors/           # 에러 발생/수정 기록
└── gap-analysis/     # 계획 vs 실제 GAP 분석
```

### 에러 기록 (`docs/errors/`)

- 에러 발생 후 수정한 사항은 반드시 기록한다
- 포함 항목: 에러 내용, 원인, 해결 방법, 재발 방지책
- 파일명: `YYYY-MM-DD-에러요약.md`

### 구현 완료 기록 (`docs/implementations/`)

- 특정 기능의 구현이 끝나면 반드시 기록한다
- 포함 항목: **구현 날짜**, 기능 설명, 주요 결정 사항, 파일 목록
- 파일명: `YYYY-MM-DD-기능명.md`

### GAP 분석 (`docs/gap-analysis/`)

- 기능 단위(M01~M06) 완료 시 계획 대비 실제 구현의 GAP을 분석한다
- 포함 항목: 계획 내용, 실제 구현, 차이점, 원인, 개선 방향
- 파일명: `YYYY-MM-DD-기능명-gap.md`

### 체크리스트 (`docs/checklists/`)

- 계획을 수립하면 반드시 체크리스트 문서를 작성한다
- 체크박스(`- [ ]` / `- [x]`) 형식으로 작성하여 진행 상황을 추적한다
- 파일명: `YYYY-MM-DD-기능명-checklist.md`

## 코드 스타일

- 들여쓰기: 2 spaces
- 세미콜론: 사용하지 않음
- 따옴표: 작은따옴표 (`'`)
- 후행 쉼표: ES5 (`trailing comma`)
- 한 파일에 하나의 컴포넌트
