# Google 로그인 연결

현재 일반 가입·관리자 로그인은 사용 가능하며 Google OAuth 키는 아직 설정되지 않았습니다. Google 실제 로그인 성공은 키 등록 뒤 검증해야 합니다.

1. https://console.cloud.google.com/ 에서 프로젝트를 선택합니다. Google Auth Platform의 Branding / Audience에서 앱 이름, 지원 이메일, External 대상과 필요한 테스트 사용자를 설정합니다.
2. Clients에서 OAuth Client ID를 만들고 Web application을 선택합니다. JavaScript origin은 `http://127.0.0.1:3007`, 승인된 리디렉션 URI는 `http://127.0.0.1:3007/api/auth/callback/google`로 설정합니다. localhost와 127.0.0.1을 섞지 않습니다.
3. 발급된 Client ID와 Secret을 t07/.env.local의 GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET에 입력합니다. Secret은 채팅·Git·Notion에 붙여 넣지 않습니다. 서버를 다시 빌드·재시작하면 Google 버튼이 실제 인증 화면으로 연결됩니다.

배포 후에는 BETTER_AUTH_URL을 확정된 HTTPS 도메인으로 바꾸고 해당 도메인의 `/api/auth/callback/google` URI도 Google Console에 등록해야 합니다.

공식 참고: https://better-auth.com/docs/authentication/google .

## 관리자 계정

역할은 서버 계정의 role=admin으로 저장하며, 일반 가입 요청으로 role을 지정할 수 없습니다. 사용자 요청에 따라 테스트 관리자만 별도 provisioning 스크립트로 생성합니다. 일반 가입은 10자 이상 비밀번호를 유지하고 로그인은 기존 계정 비밀번호를 길이로 배제하지 않습니다. 짧은 테스트 비밀번호는 공개 서비스 전환 전에 계정 설정에서 교체합니다. 실제 값은 문서에 저장하지 않습니다.
