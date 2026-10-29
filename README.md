# SuGang · T07

T06 최종 커밋 `83f28e7`에서 이어집니다. 브랜치 `t07-auth`, 기준 태그 `t06-submission-83f28e7`.

## 실행

`pnpm install` 후 `.env.local`에 DATABASE_URL, 32자 이상 무작위 BETTER_AUTH_SECRET, BETTER_AUTH_URL을 설정합니다. 예제 파일에는 비밀값이 없습니다.

인증 마이그레이션: `node --env-file=.env.local node_modules/tsx/dist/cli.mjs scripts/migrate-auth.ts`

로컬 실행: `pnpm dev --port 3007` (BETTER_AUTH_URL은 http://127.0.0.1:3007).

## 구현

- Better Auth 1.7.10 이메일 가입·로그인·로그아웃, scrypt 해시, 서버 DB 세션(3일), 로그인 시도 제한.
- 미로그인 첫 화면은 로그인 화면. API는 화면과 별개로 세션을 검사합니다.
- t07_ 전용 인증/공간/자료/요청 테이블. T06 공개 자료와 완전히 분리합니다.
- 모든 목록·저장·내보내기는 세션 user.id를 사용합니다. 주소·헤더·본문으로 다른 소유자를 지정하면 404.
- 남의 항목 GET/PATCH/DELETE는 404, 변경 전후 양쪽 자료 건수 유지.
- 비밀번호 변경 시 다른 세션 취소 후 현재 세션도 로그아웃. 계정 삭제는 자료·요청·인증·세션을 FK cascade로 삭제.
- 서버 내보내기에는 현재 계정의 자료만 포함하며 비밀번호·세션은 포함하지 않습니다.

## 확인

`pnpm typecheck`, `pnpm test`, `pnpm build`.

`node --env-file=.env.local scripts/auth-check.cjs`는 Playwright가 필요합니다. 임시 두 계정으로 실제 Neon 검증 후 계정/자료를 정리하고, 비밀값을 가린 결과를 docs/auth-verification.json에 저장합니다.

## T06 자료 이전

소유자 이메일을 지정받고 실제 가입한 뒤 개발자가 `scripts/import-t06.ts 이메일`을 실행합니다. 기존 계정 자료가 있으면 덮어쓰지 않습니다. 임의의 첫 가입자에게 공용 자료를 주지 않습니다. T06 원본은 보존하며 서버에서 지정 계정으로 스냅샷을 복사합니다. 사용자가 지정한 테스트 관리자 계정으로 T06 자료 15개를 복사했습니다. 원본은 보존됩니다.

## 공개 배포

Vercel 프로젝트 `sugang-t07`, 브랜치 `t07-auth`. 설정·환경변수·확인 순서는 docs/deploy-vercel.md. DATABASE_URL은 사용자가 Vercel 대시보드에 직접 입력합니다(저장소·채팅에 넣지 않음).

## 5일 관찰 화면

Goal 탭 아래 `5일 관찰`. 1일차 날짜를 고르면 다섯 날짜의 실제 학습 시간(분) 또는 완료 To-do(개), 기록한 날 합계와 식, 5일 평균을 보여줍니다. 기록 없는 날은 0이 아니라 미기록. 규칙은 lib/observation.ts 주석과 docs/five-day-log.md에 같은 문장으로 있습니다.

## 아직 남은 것

DATABASE_URL 입력 후 공개 주소에서 HTTPS 쿠키·교차 요청 재검증, Google OAuth 키 설정 및 실제 연동 확인, 실제 5일 사용과 2일차 후~3일차 전 규칙 변경, 집계 수동 대조, 최종 제출 설명서. 개발용 QA 데이터를 실제 사용 기록으로 제출하지 않습니다.

인증 메일, 비밀번호 분실 재설정, MFA는 미구현입니다. 따라서 이메일 소유 확인과 계정 복구가 아직 제한되며 최종 설명서에 공개합니다.

## 가입·소셜 로그인
일반 가입은 /signup, 로그인은 /login에서 제공합니다. Google 공급자·버튼은 구현했으며 현재 OAuth 키 등록이 필요합니다. docs/google-login-setup.md를 참고하세요. 관리자 역할은 서버에서 부여하며 일반 가입으로 선택할 수 없습니다.
