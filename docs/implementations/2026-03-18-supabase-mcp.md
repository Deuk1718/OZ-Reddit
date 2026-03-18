# Supabase MCP 설정 기록

## 구현 날짜

- 2026-03-18

## 기능 설명

- Codex 전역 설정에 Supabase MCP 서버 연결 상태를 점검했다
- `~/.codex/config.toml` 에 Supabase MCP URL이 등록되어 있음을 확인했다
- 원격 MCP 사용을 위해 `[features] rmcp_client = true` 를 추가했다
- `codex mcp login supabase` 를 실행해 Supabase OAuth 로그인을 완료했다

## 주요 결정 사항

- 현재 Supabase MCP 대상 프로젝트는 `pqzlqcmcvvilbgysodyu` 를 유지한다
- 프로젝트 내부 코드가 아니라 Codex 전역 설정 파일을 수정하는 작업이므로, 저장소에는 체크리스트와 구현 기록만 남긴다
- 현재 진행 중인 Codex 앱 세션에서는 MCP 리소스 핸드셰이크가 즉시 갱신되지 않을 수 있어 앱 재시작 후 최종 조회 검증을 권장한다

## 파일 목록

- `docs/checklists/2026-03-18-supabase-mcp-checklist.md`
- `docs/implementations/2026-03-18-supabase-mcp.md`
- `~/.codex/config.toml`
