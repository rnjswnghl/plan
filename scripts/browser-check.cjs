const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3000');await page.getByText('미리보기 · DB 연결이 준비되지 않았습니다.',{exact:false}).waitFor();
 await page.getByRole('button',{name:'＋ 카테고리',exact:true}).click();await page.getByLabel('카테고리 이름').fill('커리어');await page.getByRole('button',{name:'미리보기에 적용'}).click();
 await page.getByRole('button',{name:'＋ 활동 등록'}).click();await page.getByLabel('활동 이름').fill('코딩테스트');await page.getByLabel('내가 정한 목표').fill('문제 풀이 습관 만들기');await page.getByLabel('카테고리 (선택)').selectOption({label:'커리어'});await page.getByRole('button',{name:'미리보기에 적용'}).click();
 await page.getByRole('button',{name:'시간표 시작하기 →'}).click();
 await page.getByRole('button',{name:'＋ 시간 배치',exact:true}).click();await page.getByLabel('시작',{exact:true}).fill('10:00');await page.getByLabel('종료',{exact:true}).fill('11:00');await page.getByRole('button',{name:'미리보기에 적용'}).click();await page.getByRole('button',{name:'코딩테스트 10:00–11:00'}).waitFor();
 fs.mkdirSync('test-results',{recursive:true});await page.screenshot({path:'test-results/timetable.png',fullPage:true});
 await page.locator('nav').getByRole('button',{name:'할 일'}).click();await page.getByRole('button',{name:'＋ 할 일',exact:true}).click();await page.getByRole('textbox',{name:'할 일',exact:true}).fill('<script>window.injected=true</script>');await page.getByLabel('예상 시간 (분)').fill('45');await page.getByRole('button',{name:'미리보기에 적용'}).click();assert.equal(await page.evaluate(()=>window.injected),undefined);
 await page.getByRole('button',{name:'기록',exact:true}).click();await page.getByLabel('시작 시각 (서울)').fill('2026-10-14T10:00');await page.getByLabel('종료 시각 (서울)').fill('2026-10-14T11:00');await page.getByLabel('실제 공부 시간 (휴식 제외, 분)').fill('60');await page.getByLabel('막힌 이유').fill('경계 조건');await page.getByLabel('짧은 일지').fill('복습할 내용을 찾았다.');await page.getByRole('button',{name:'미리보기에 적용'}).click();
 await page.getByRole('checkbox').check();await page.locator('nav').getByRole('button',{name:'돌아보기'}).click();assert.match(await page.locator('.time-summary').innerText(),/45분[\s\S]*60분[\s\S]*\+15분/);
 await page.getByRole('button',{name:'회고 작성'}).click();await page.getByLabel('다음 계획에서 고칠 점 한 줄').fill('복습 15분 확보');await page.getByRole('button',{name:'미리보기에 적용'}).click();await page.getByRole('button',{name:'개선점을 다음 계획으로 →'}).click();await page.getByText('이번 주의 개선점: 복습 15분 확보').waitFor();
 await page.setViewportSize({width:390,height:844});await page.locator('nav').getByRole('button',{name:'시간표'}).click();await page.screenshot({path:'test-results/mobile.png',fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false);
 await page.reload();await page.getByText('나만의 학기를 시작해요').waitFor();assert.equal(errors.length,0,errors.join('\n'));console.log('Browser checks passed: onboarding, timetable, todo, script text, journal, review, next plan, mobile, preview reset.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

