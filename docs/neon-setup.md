# Neon 처음 연결하기

## 1. Neon에서 연결 문자열 복사

1. Neon 프로젝트를 열고 Connect를 누른다.
2. Postgres database 탭, production 브랜치, neondb, neondb_owner를 선택한다.
3. Connection pooling을 켜고 메뉴는 Connection string으로 둔다.
4. Copy snippet으로 복사한다. 값은 postgresql://로 시작한다.

## 2. 로컬 설정 파일에 붙여 넣기

프로젝트 폴더의 .env.local을 연다. 위치:
C:/Users/samsung/Desktop/joohoe/skt_aleph/work/t06/.env.local

DATABASE_URL= 뒤에 복사한 전체 문자열을 넣고 저장한다. psql 명령은 넣지 않는다. 별표로 가려진 화면 문자열을 직접 타이핑하지 않고 Copy snippet을 사용한다. 이 값은 DB 비밀번호를 포함하므로 채팅·노션·Git에 올리지 않는다.

## 3. 테이블 준비와 서버 재시작

저장 후 에이전트에게 저장했다고 알려주면 아래 작업을 진행할 수 있다. 직접 실행하려면 프로젝트 폴더 터미널에서:

```sh
pnpm db:migrate
pnpm build
pnpm start --port 3001
```

기존 서버가 실행 중이면 먼저 종료한다. 마이그레이션은 002_app.sql과 003_calendar.sql을 순서대로 적용한다. 이전 초안 001_initial.sql은 실행하지 않는다. 이미 적용된 구조에 재실행할 수 있다.

## 4. 저장 여부 확인

http://127.0.0.1:3001 을 새로고침한다. 미리보기 안내가 없어지고 하단에 서버 DB 연결됨이 나타나야 한다. 활동 하나를 저장하고 새로고침하여 같은 값이 유지되는지 확인한다. 이후 내보내기로 ID·날짜·분 단위까지 확인한다.

테이블 생성만으로 사이트가 외부에 배포되는 것은 아니다. 현재 주소는 이 컴퓨터에서만 접근하는 로컬 주소다.
