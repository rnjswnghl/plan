# T07 공개 배포 — Vercel

T06은 ChatGPT 사이트 호스팅(sugang.rnjswnghl.chatgpt.site)에 올렸지만, 그 주소는 해당 호스팅 안에서만 배포할 수 있어 T07은 Vercel로 옮겼다. T06 주소와 자료는 그대로 둔다.

| 항목 | 값 |
| --- | --- |
| Vercel 프로젝트 | `sugang-t07` (팀 rnjswnghl-2373's projects) |
| 소스 | GitHub `rnjswnghl/plan`, 브랜치 `t07-auth` |
| 공개 주소 | https://sugang-t07.vercel.app (배포 후 확정, 바뀌면 BETTER_AUTH_URL도 수정) |
| 런타임 | Node 22, Next.js 16.4.3 |
| 접근 보호 | Vercel Authentication은 Preview에만. 공개 주소는 로그인 없이 시크릿 창에서 열린다(첫 화면은 SuGang 로그인) |

## 환경변수 (Vercel → Settings → Environment Variables)

| 이름 | 상태 | 설명 |
| --- | --- | --- |
| `BETTER_AUTH_SECRET` | 설정됨 (Sensitive) | 세션 서명용 무작위 값. 저장소·문서·노션에 없음 |
| `BETTER_AUTH_URL` | 설정됨 | `https://sugang-t07.vercel.app` |
| `DATABASE_URL` | **사용자 입력 필요** | Neon Connect → Connection string(pooling 켬). 본인이 대시보드에 직접 붙여 넣는다 |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | 선택 | 없으면 Google 버튼은 안내만 표시 |

DATABASE_URL을 넣은 뒤 Deployments에서 최신 배포를 **Redeploy**해야 반영된다. Neon의 t07_ 테이블은 로컬 마이그레이션으로 이미 만들어져 있어 배포 시 추가 마이그레이션은 하지 않는다.

## 배포 후 확인 순서

1. 시크릿 창에서 공개 주소 → 로그인 화면이 바로 열리는지(계정·초대·CAPTCHA 없이).
2. 회원가입 → 빈 시간표 → 새로고침 후 유지.
3. 로그아웃 → 같은 주소의 `/api/state` 401.
4. 개발자 도구에서 쿠키가 `HttpOnly`, `Secure`, `SameSite=Lax`인지.
5. 두 계정으로 `scripts/auth-check.cjs`와 같은 교차 요청(BASE를 공개 주소로) → 404.
