# Authentication implementation record · T07

## ① 무엇으로 붙였나
Better Auth 1.7.10, PostgreSQL(Neon), 이메일/비밀번호, 서버 DB 세션. 비밀번호는 라이브러리 기본 scrypt(계정별 salt)입니다.

## ② 왜 골랐나
Next.js 공식 통합 경로와 가입·로그인·로그아웃·세션 취소·계정 삭제가 있어 인증/암호화를 직접 구현하는 범위를 줄입니다. 직접 구현 방식은 암호화와 세션 무효화 오류 위험 때문에 제외했습니다. 외부 OAuth 전용 서비스는 제공자 계정 없이 심사할 수 있는 이메일 가입 흐름을 우선하기 위해 제외했습니다.
공식 근거: https://better-auth.com/docs/installation , https://better-auth.com/docs/concepts/session-management , https://better-auth.com/docs/authentication/email-password .

## ③ 어디를 어떻게 고쳤나
lib/auth.ts: 인증과 해시·세션 만료 설정. app/api/auth/[...all]/route.ts: 라이브러리 인증 엔드포인트. app/page.tsx: 서버 세션이 없는 경우 AuthGate만 렌더링. lib/authorization.ts: 세션 검사 및 다른 소유자 지정 거절. app/api/state/route.ts·app/api/items/[kind]/[id]/route.ts·app/api/export/route.ts: API별 서버 검사. lib/db.ts: 모든 SQL의 workspace_id는 세션 user.id로 한정. db/005_private.sql: 사용자 삭제 시 자료와 요청도 cascade 삭제.

세션은 DB에 존재하고 만료되지 않은지를 매 요청 확인합니다. cookieCache는 껐습니다. 세션 수명은 발급 후 3일, 자동 갱신은 하지 않습니다. 쿠키는 HttpOnly/SameSite이며 HTTPS 배포 시 Secure입니다. 서명용 비밀은 서버 환경변수에만 보관합니다.

## ④ 안 열리는 것을 확인한 기록
실행 결과 docs/auth-verification.json. 익명 GET 401, 로그인 GET 200, 로그아웃한 쿠키를 재전송한 같은 GET 401. 양쪽 계정에서 상대 항목 GET/PATCH/DELETE 404. 거절 후 각 계정 자료 3개로 유지, 목록에는 자기 항목만 포함. URL·본문 소유자 변조도 404. 내보내기는 자기 자료만 포함. 비밀번호 변경 후 이전 세션 거절. 삭제 후 자료 0개 및 GET 401. 동일 비밀번호 두 계정의 저장 해시가 서로 다름을 확인했습니다. 쿠키·비밀번호 원문은 결과 파일에 남기지 않습니다.

## ⑤ AI와 나
AI: 인증 통합·자료 분리 구현 및 검증 초안. 사용자: SuGang 방향·수정 요구, T06에 이어 T07 진행 결정. 사용자 판단과 AI 제안 미채택 사례는 이후 실제 선택을 확인해서 보충합니다.

## ⑥ 아직 못 막은 것
이메일 소유 확인·분실 재설정·MFA 미구현. 이메일을 확인하지 않으면 다른 사람의 이메일로 가입할 수 있고 분실 시 계정 복구 수단이 없습니다. T07은 아직 로컬 검증 단계이며 공개 배포의 HTTPS 쿠키·라우팅은 별도 검증이 필요합니다. 5일 실제 기록과 이전 계정 데이터 이전은 아직 완료하지 않았습니다.
