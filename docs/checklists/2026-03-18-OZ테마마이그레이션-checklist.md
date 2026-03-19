# OZ 테마 디자인 마이그레이션 체크리스트

**작성일**: 2026-03-18

## 1단계: 디자인 토큰 교체 (Foundation)
- [x] `globals.css` — CSS 변수 OZ 다크 테마로 교체
- [x] `globals.css` — `@media (prefers-color-scheme: dark)` 제거
- [x] `globals.css` — html 배경 gradient OZ radial-gradient로 교체
- [x] `globals.css` — glass-morphism 유틸리티 CSS 추가
- [x] `globals.css` — `@theme inline`에 새 변수 등록
- [x] `layout.tsx` — Space Grotesk 폰트로 교체
- [x] `layout.tsx` — Material Symbols Outlined CDN `<link>` 추가

## 2단계: 레이아웃 구조 변경
- [x] `AppHeader.tsx` — glass-nav + Material Symbols 아이콘
- [x] 신규 `LeftSidebar.tsx` — 피드 메뉴 + 최근 커뮤니티
- [x] 신규 `MobileBottomNav.tsx` — 모바일 하단 네비게이션

## 3단계: 공통 컴포넌트 리스타일
- [x] `PostCard.tsx` — glass-card + Material Symbols 투표 아이콘
- [x] `FeedPagination.tsx` — glass 버튼
- [x] `CreatePostForm.tsx` — glass input
- [x] `DeletePostButton.tsx` — 스타일 통일
- [x] `CommentThreadList.tsx` — thread-line gradient, OP 배지
- [x] `CommentComposer.tsx` — glass textarea, gradient 버튼
- [x] `DeleteCommentButton.tsx` — 스타일 통일

## 4단계: 피드 페이지 리스타일
- [x] `page.tsx` (홈) — 3컬럼 + LeftSidebar, glass 히어로
- [x] `r/[name]/page.tsx` — OZ gradient 헤더, glass 사이드바
- [x] `subreddits/page.tsx` — glass 커뮤니티 카드

## 5단계: 상세 페이지 리스타일
- [x] `r/[name]/[postId]/page.tsx` — 세로 투표 glow, glass 본문, 사이드바
- [x] `r/[name]/submit/page.tsx` — glass 폼, gradient CTA

## 6단계: 인증 페이지 리디자인
- [x] `login/page.tsx` — 풀스크린 immersive, glass-card 중앙 폼
- [x] `register/page.tsx` — 풀스크린 immersive, glass-card 중앙 폼
- [x] `register/interests/page.tsx` — glow pill 버튼
- [x] `LoginForm.tsx` — glass input 스타일
- [x] `RegisterForm.tsx` — glass input, 2컬럼 배치
- [x] `InterestPicker.tsx` — glow 선택 상태
- [x] `layout.tsx` — 인증 페이지에서 풀스크린 fixed overlay로 AppHeader 자연스럽게 가림

## 7단계: 최종 정리 및 검증
- [x] `CreateSubredditForm.tsx` — glass 스타일
- [x] `SignOutButton.tsx` — 스타일 통일
- [x] `subreddits/create/page.tsx` — glass 스타일
- [x] 하드코딩 rgba 값 전수 교체 확인 (이전 `rgba(74,48,242`, `rgba(40,13,140`, `rgba(118,99,242` → 제거)
- [x] `npm run build` 성공 확인
