/**
 * Subscription Content Management Module (subscription.js)
 * Implements the administrative interface, Category/Program/Content configuration,
 * shuttle box modal for grade assignments, client subscription list with date-range filters,
 * and utilisation statistics dashboard.
 */

// Global state variables
let currentView = 'setting'; // 'setting', 'status', 'stats'
let currentCategoryFilter = '';
let selectedCategoryForTiers = null;

// Settings Sub-views drill down state
let currentSettingViewMode = 'category'; // 'category', 'program', 'content'
let selectedCategoryId = null; // for program list
let selectedProgramId = null; // for content list

// Shuttle Box state
let shuttleAvailable = [];
let shuttleSelected = [];
let checkedAvailableIds = []; // Track checkbox states for available list (left)
let checkedSelectedIds = []; // Track checkbox states for selected list (right)
let shuttleSearchQuery = '';

// Pagination for Subscriber list
let subscriberCurrentPage = 1;
let subscriberPageSize = 10;

// Initialize all mock data in LocalStorage if not exists
(function initSubscriptionMockData() {
  // Versioning migration check for v3 schema
  const version = localStorage.getItem('sub_programs_version');
  if (version !== 'v3') {
    localStorage.removeItem('sub_programs');
    localStorage.removeItem('sub_contents');
    localStorage.removeItem('sub_subscribers');
    localStorage.setItem('sub_programs_version', 'v3');
  }

  // 1. Core Grades (Tiers) - Generate exactly 51 corporate tiers
  const savedGrades = localStorage.getItem('sub_grades');
  let grades = [];
  if (!savedGrades) {
    grades.push({ id: "g_1", name: "헬스케어 VIP플랜" });
    grades.push({ id: "g_2", name: "헬스케어 기본플랜" });
    grades.push({ id: "g_3", name: "교보다솜케어 통합등급" });
    grades.push({ id: "g_4", name: "교보다솜케어 우대등급" });
    grades.push({ id: "g_5", name: "A기업 임원급" });
    grades.push({ id: "g_6", name: "A기업 임직원 1등급" });
    
    const extraCompanies = [
      "BNK자산운용", "U+유모바일", "리멤버앤컴퍼니", "브라이트스타트", 
      "법무법인 율촌", "케이파트너스", "오늘 회계법인", "교보문고", 
      "삼성생명", "현대해상", "KB손해보험", "신한라이프", "한화생명"
    ];
    for (let i = 7; i <= 51; i++) {
      const company = extraCompanies[i % extraCompanies.length];
      const type = ["프리미엄", "패밀리", "일반형", "특화형", "스탠다드", "골드", "실버"][i % 7];
      grades.push({ id: `g_${i}`, name: `${company} ${type} 등급` });
    }
    localStorage.setItem('sub_grades', JSON.stringify(grades));
  } else {
    grades = JSON.parse(savedGrades);
  }

  // 2. Categories
  const savedCategories = localStorage.getItem('sub_categories');
  if (!savedCategories) {
    const defaultCategories = [
      { id: "cat_1", name: "질병예방관리", desc: "만성질환 예방 및 관리", note: "만성질환 관련 예방 및 건강관리 콘텐츠", tiers: ["g_1", "g_2", "g_3", "g_4", "g_5", "g_6", "g_7"] },
      { id: "cat_2", name: "운동관리", desc: "운동 습관 형성 및 관리", note: "운동 계획 및 실천 가이드 콘텐츠", tiers: ["g_1", "g_2", "g_3"] },
      { id: "cat_3", name: "영양관리", desc: "올바른 식습관 관리", note: "영양 정보 및 식단 관리 콘텐츠", tiers: ["g_1", "g_2", "g_4", "g_6"] },
      { id: "cat_4", name: "정신건강", desc: "심리적 안정 및 회복", note: "스트레스 관리 및 마음건강 콘텐츠", tiers: ["g_1", "g_2", "g_5"] },
      { id: "cat_5", name: "여성건강", desc: "여성 건강 관리", note: "여성 특화 건강정보 및 관리 콘텐츠", tiers: ["g_2", "g_3", "g_7"] },
      { id: "cat_6", name: "시니어건강", desc: "시니어 건강 관리", note: "시니어 맞춤 건강정보 및 관리 콘텐츠", tiers: ["g_1", "g_4", "g_5"] }
    ];
    
    // Distribute remaining grades among categories to make counts realistic
    for (let i = 0; i < grades.length; i++) {
      if (!defaultCategories[0].tiers.includes(grades[i].id)) {
        defaultCategories[0].tiers.push(grades[i].id);
      }
      if (i % 2 === 0 && !defaultCategories[1].tiers.includes(grades[i].id)) {
        defaultCategories[1].tiers.push(grades[i].id);
      }
      if (i % 3 === 0 && !defaultCategories[2].tiers.includes(grades[i].id)) {
        defaultCategories[2].tiers.push(grades[i].id);
      }
      if (i % 4 === 0 && !defaultCategories[3].tiers.includes(grades[i].id)) {
        defaultCategories[3].tiers.push(grades[i].id);
      }
      if (i % 5 === 0 && !defaultCategories[4].tiers.includes(grades[i].id)) {
        defaultCategories[4].tiers.push(grades[i].id);
      }
      if (i % 6 === 0 && !defaultCategories[5].tiers.includes(grades[i].id)) {
        defaultCategories[5].tiers.push(grades[i].id);
      }
    }
    localStorage.setItem('sub_categories', JSON.stringify(defaultCategories));
  }

  // 3. Programs
  const savedPrograms = localStorage.getItem('sub_programs');
  let defaultPrograms = [];
  if (!savedPrograms) {
    defaultPrograms = [
      // 질병예방관리 (6건)
      { id: "prog_1", catId: "cat_1", name: "고혈압 관리 프로그램", desc: "고혈압 예방과 관리를 위한 생활습관과 식단, 운동 정보를 제공합니다.", period: "주", totalTerms: 12, sendYn: "노출", termSelectYn: "가능", note: "중장년층 집중 추천" },
      { id: "prog_2", catId: "cat_1", name: "당뇨 관리 프로그램", desc: "당뇨병의 이해와 혈당 관리, 식단, 운동 정보를 제공합니다.", period: "주", totalTerms: 16, sendYn: "노출", termSelectYn: "가능", note: "영양관리와 유기적 연동" },
      { id: "prog_3", catId: "cat_1", name: "이상지질혈증 관리 프로그램", desc: "콜레스테롤 관리와 건강한 생활습관을 안내합니다.", period: "주", totalTerms: 12, sendYn: "노출", termSelectYn: "가능", note: "의학 자문 포함" },
      { id: "prog_4", catId: "cat_1", name: "비만 관리 프로그램", desc: "체중 관리와 건강한 식습관, 운동 가이드를 제공합니다.", period: "주", totalTerms: 10, sendYn: "노출", termSelectYn: "가능", note: "자가 진단 위주" },
      { id: "prog_5", catId: "cat_1", name: "스트레스 관리 프로그램", desc: "스트레스 해소법과 마음건강을 위한 정보를 제공합니다.", period: "월", totalTerms: 4, sendYn: "미노출", termSelectYn: "불가능", note: "특화 플랜 전용" },
      { id: "prog_6", catId: "cat_1", name: "금연 프로그램", desc: "금연을 위한 실천 가이드와 금연 성공 노하우를 제공합니다.", period: "주", totalTerms: 8, sendYn: "미노출", termSelectYn: "가능", note: "자가 진단 위주" },
      
      // 운동관리 (3건)
      { id: "prog_7", catId: "cat_2", name: "하루 1만보 걷기 챌린지", desc: "유산소 운동 기초 체력 단련 및 올바른 걷기 스텝 교정", period: "주", totalTerms: 12, sendYn: "노출", termSelectYn: "가능", note: "리워드 연동 가능" },
      { id: "prog_8", catId: "cat_2", name: "코어 근육 강화 홈트레이닝", desc: "허리 통증 완화 및 기초 대사량 상승을 위한 실내 코어 운동", period: "주", totalTerms: 16, sendYn: "노출", termSelectYn: "가능", note: "실시간 비디오 링크 제공" },
      { id: "prog_9", catId: "cat_2", name: "자세 교정 및 힐링 스트레칭", desc: "오피스 증후군 완화를 위한 어깨/목 관절 스트레칭 프로그램", period: "주", totalTerms: 10, sendYn: "노출", termSelectYn: "가능", note: "사무직 최적화 코스" },
      
      // 영양관리 (4건)
      { id: "prog_10", catId: "cat_3", name: "저염식 건강 식단 구성법", desc: "염분 섭취를 줄이고 맛을 살리는 건강한 조리 꿀팁 및 제안", period: "주", totalTerms: 12, sendYn: "노출", termSelectYn: "가능", note: "나트륨 배출 가이드" },
      { id: "prog_11", catId: "cat_3", name: "대사증후군 조절 식이요법", desc: "중성지방 하락 및 허리둘레 감소를 돕는 똑똑한 탄수화물 섭취법", period: "주", totalTerms: 16, sendYn: "노출", termSelectYn: "가능", note: "체중 감량 병행" },
      { id: "prog_12", catId: "cat_3", name: "올바른 단백질 섭취 규칙", desc: "근손실 방지를 위한 나이별/체중별 하루 단백질 권장량 가이드", period: "주", totalTerms: 12, sendYn: "노출", termSelectYn: "가능", note: "식물성 단백질 위주" },
      { id: "prog_13", catId: "cat_3", name: "제철 채소 섭취 캘린더", desc: "비타민 and 미네랄이 풍부한 계절별 슈퍼푸드 조리 제안", period: "월", totalTerms: 8, sendYn: "노출", termSelectYn: "가능", note: "가족 영양식 특화" },

      // 정신건강 (3건)
      { id: "prog_14", catId: "cat_4", name: "마인드풀니스 명상 가이드", desc: "하루 10분, 뇌를 쉬게 하는 초보자용 명상 기법 및 호흡법", period: "주", totalTerms: 12, sendYn: "노출", termSelectYn: "가능", note: "음원 스트리밍 연동" },
      { id: "prog_15", catId: "cat_4", name: "불면증 극복 수면 수칙", desc: "생체 리듬을 되찾고 깊은 수면을 유도하는 숙면 환경 조성법", period: "주", totalTerms: 16, sendYn: "노출", termSelectYn: "가능", note: "자가 체크리스트 제공" },
      { id: "prog_16", catId: "cat_4", name: "직무 스트레스 조절 훈련", desc: "감정 노동 및 과도한 업무 중압감을 이겨내는 심리 정서 자가 훈련", period: "주", totalTerms: 12, sendYn: "노출", termSelectYn: "가능", note: "전문 상담 연계" },

      // 여성건강 (2건)
      { id: "prog_17", catId: "cat_5", name: "생애주기별 여성 건강 가이드", desc: "여성의 나이별 필수 건강검진 항목 및 호르몬 관리 수칙", period: "주", totalTerms: 10, sendYn: "노출", termSelectYn: "가능", note: "여성 특화 맞춤 정보" },
      { id: "prog_18", catId: "cat_5", name: "갱년기 활력 회복 솔루션", desc: "안면 홍조, 골다공증 예방을 위한 여성 호르몬 식품 및 생활 팁", period: "주", totalTerms: 12, sendYn: "노출", termSelectYn: "가능", note: "4050 여성 필수 구독" },

      // 시니어건강 (2건)
      { id: "prog_19", catId: "cat_6", name: "퇴행성 관절염 통증 완화 운동법", desc: "무릎 및 척추 관절을 지탱하는 하체 근육 단련 안전 운동", period: "주", totalTerms: 12, sendYn: "노출", termSelectYn: "가능", note: "저강도 반복형 코치" },
      { id: "prog_20", catId: "cat_6", name: "뇌 활성화 인지 건강 훈련", desc: "치매 예방과 단기 기억력 감퇴를 막는 좌뇌/우뇌 퍼즐 훈련 프로그램", period: "주", totalTerms: 12, sendYn: "노출", termSelectYn: "가능", note: "매치 게임 포함" }
    ];
    localStorage.setItem('sub_programs', JSON.stringify(defaultPrograms));
  } else {
    defaultPrograms = JSON.parse(savedPrograms);
  }

  // 4. Contents
  const savedContents = localStorage.getItem('sub_contents');
  if (!savedContents) {
    const defaultContents = [];
    defaultPrograms.forEach(prog => {
      const terms = prog.totalTerms || 4;
      for (let s = 1; s <= terms; s++) {
        defaultContents.push({
          id: `cont_${prog.id}_${s}`,
          progId: prog.id,
          seq: `${s}회차`,
          day: `${s}회차 발송`,
          title: `[${prog.name}] 제 ${s}강 건강 가이드`,
          dateCreated: "2026-05-20",
          body: `📣 오늘의 중요 건강 미션\n\n이 정보는 ${prog.name} 구독 프로그램의 ${s}회차 공식 콘텐츠입니다. 아래의 수칙을 하루 한 번 실천하고 가뿐한 하루를 만들어 보세요!\n\n1. 아침 공복에 따뜻한 물 한 잔 마시기\n2. 가벼운 보행 시 허리를 곧게 펴고 발꿈치부터 딛기\n3. 식단에 푸른 잎 채소 섭취량 20% 늘리기\n\n*본 의학 정보는 서울 종합 건강 증진 연구소의 정식 자문을 득한 자료입니다.`
        });
      }
    });
    localStorage.setItem('sub_contents', JSON.stringify(defaultContents));
  }

  // 5. Subscribers (Seed 55 active/cancelled/completed subscribers)
  const savedSubscribers = localStorage.getItem('sub_subscribers');
  if (!savedSubscribers) {
    const sampleSubscribers = [];
    const clientList = [
      { name: "교보생명", tier: "VIP플랜" },
      { name: "교보생명", tier: "기본플랜" },
      { name: "교보다솜케어", tier: "통합등급" },
      { name: "교보다솜케어", tier: "우대등급" },
      { name: "A기업", tier: "임직원 1등급" },
      { name: "A기업", tier: "임원급" },
      { name: "BNK자산운용", tier: "프리미엄 등급" },
      { name: "U+유모바일", tier: "특화형 등급" }
    ];
    
    const KoreanNames = [
      "홍길동", "이영희", "김철수", "박민수", "최지우", "정우성", "이지은", "강하늘", 
      "최진혁", "임윤아", "송중기", "송혜교", "조인성", "한효주", "박서준", "김태리", 
      "이병헌", "손예진", "현빈", "전지현", "공유", "김고은", "유재석", "강호동", 
      "신동엽", "이효리", "성시경", "아이유", "수지", "박보검", "이준기", "서강준"
    ];

    const categories = [
      { id: "cat_1", name: "질병예방관리", progId: "prog_1", progName: "고혈압 관리 프로그램" },
      { id: "cat_2", name: "운동관리", progId: "prog_7", progName: "하루 1만보 걷기 챌린지" },
      { id: "cat_3", name: "영양관리", progId: "prog_10", progName: "저염식 건강 식단 구성법" },
      { id: "cat_4", name: "정신건강", progId: "prog_14", progName: "마인드풀니스 명상 가이드" },
      { id: "cat_5", name: "여성건강", progId: "prog_17", progName: "생애주기별 여성 건강 가이드" },
      { id: "cat_6", name: "시니어건강", progId: "prog_19", progName: "퇴행성 관절염 통증 완화 운동법" }
    ];

    const statuses = ["구독중", "구독중", "구독중", "구독취소", "구독완료"];

    for (let i = 1; i <= 55; i++) {
      const client = clientList[i % clientList.length];
      const name = KoreanNames[i % KoreanNames.length] + (i > KoreanNames.length ? "B" : "");
      const cat = categories[i % categories.length];
      const status = statuses[i % statuses.length];
      
      // Calculate realistic dates
      const applyDay = i % 25 + 1;
      const applyDate = `2026-05-${applyDay < 10 ? '0' + applyDay : applyDay}`;
      const startDate = `2026-05-${applyDay + 1 < 10 ? '0' + (applyDay + 1) : applyDay + 1}`;
      
      // Ended date if completed or cancelled
      let endDate = '';
      if (status === '구독완료') {
        endDate = `2026-06-01`;
      } else if (status === '구독취소') {
        const cancelDay = applyDay + 3;
        endDate = `2026-05-${cancelDay < 10 ? '0' + cancelDay : cancelDay}`;
      }

      const progObj = defaultPrograms.find(p => p.id === cat.progId);
      const progTerms = progObj ? progObj.totalTerms : 4;
      const currTermNum = (i % progTerms) + 1;

      sampleSubscribers.push({
        id: `subscr_${i}`,
        clientName: client.name,
        custName: name,
        tierName: client.tier,
        catId: cat.id,
        catName: cat.name,
        progId: cat.progId,
        progName: cat.progName,
        applyDate: applyDate,
        startDate: startDate,
        endDate: endDate,
        currTerm: `${currTermNum}차`,
        status: status
      });
    }
    localStorage.setItem('sub_subscribers', JSON.stringify(sampleSubscribers));
  }
})();

// Data helper functions
function getCategories() { return JSON.parse(localStorage.getItem('sub_categories') || '[]'); }
function saveCategories(data) { localStorage.setItem('sub_categories', JSON.stringify(data)); }
function getPrograms() { return JSON.parse(localStorage.getItem('sub_programs') || '[]'); }
function savePrograms(data) { localStorage.setItem('sub_programs', JSON.stringify(data)); }
function getContents() { return JSON.parse(localStorage.getItem('sub_contents') || '[]'); }
function saveContents(data) { localStorage.setItem('sub_contents', JSON.stringify(data)); }
function getSubscribers() { return JSON.parse(localStorage.getItem('sub_subscribers') || '[]'); }
function saveSubscribers(data) { localStorage.setItem('sub_subscribers', JSON.stringify(data)); }
function getGrades() { return JSON.parse(localStorage.getItem('sub_grades') || '[]'); }

// Dynamic horizontal registration flow diagram
window.getRegistrationFlowHtml = function(activeStep) {
  const step1Style = activeStep === 1 
    ? 'background: #eff6ff; color: #0045c4; border: 1px solid #bfdbfe; font-weight: 800;' 
    : 'background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; font-weight: 600;';
  const step2Style = activeStep === 2 
    ? 'background: #eff6ff; color: #0045c4; border: 1px solid #bfdbfe; font-weight: 800;' 
    : 'background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; font-weight: 600;';
  const step3Style = activeStep === 3 
    ? 'background: #eff6ff; color: #0045c4; border: 1px solid #bfdbfe; font-weight: 800;' 
    : 'background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; font-weight: 600;';

  const num1Bg = activeStep === 1 ? 'background: #0045c4; color: white;' : 'background: #cbd5e1; color: #475569;';
  const num2Bg = activeStep === 2 ? 'background: #0045c4; color: white;' : 'background: #cbd5e1; color: #475569;';
  const num3Bg = activeStep === 3 ? 'background: #0045c4; color: white;' : 'background: #cbd5e1; color: #475569;';

  return `
    <div class="registration-flow" style="display: flex; align-items: center; gap: 16px; background: white; border: 1px solid #e2e8f0; padding: 10px 20px; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); width: fit-content; margin-top: -8px;">
      <div style="font-size: 13px; font-weight: 700; color: #475569; display: flex; align-items: center; gap: 6px; margin-right: 8px;">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" style="color: #0045c4;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
        등록 순서
      </div>
      
      <div class="flow-step" style="display: flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 8px; ${step1Style}">
        <span class="step-num" style="display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; font-size: 11px; font-weight: 800; ${num1Bg}">1</span>
        <span style="font-size: 13px;">카테고리 등록</span>
      </div>
      
      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" style="color: #cbd5e1;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
      
      <div class="flow-step" style="display: flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 8px; ${step2Style}">
        <span class="step-num" style="display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; font-size: 11px; font-weight: 800; ${num2Bg}">2</span>
        <span style="font-size: 13px;">프로그램명 등록</span>
      </div>
      
      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24" style="color: #cbd5e1;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
      
      <div class="flow-step" style="display: flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 8px; ${step3Style}">
        <span class="step-num" style="display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; font-size: 11px; font-weight: 800; ${num3Bg}">3</span>
        <span style="font-size: 13px;">콘텐츠 등록</span>
      </div>
    </div>
  `;
};

// Sidebar sub-submenu highlight helper
window.updateSidebarActiveStates = function() {
  document.querySelectorAll('.nav-item-sub').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item-sub-sub').forEach(el => el.classList.remove('active'));
  
  const activeMenuBtn = document.getElementById(`menu-${currentView}-btn`);
  if (activeMenuBtn) {
    activeMenuBtn.classList.add('active');
  }
};

// UI View Switcher
window.navigateToSubscriptionView = function(viewId) {
  currentView = viewId;
  
  if (viewId === 'setting') {
    currentSettingViewMode = 'category'; // reset setting state
  }

  // Update sidebar active class
  window.updateSidebarActiveStates();

  // Update Breadcrumb
  const breadcrumb = document.getElementById('breadcrumb-area');
  if (breadcrumb) {
    if (viewId === 'setting') {
      breadcrumb.innerHTML = `사무포털 <span class="separator">&gt;</span> 구독콘텐츠 관리 <span class="separator">&gt;</span> <strong>구독용 콘텐츠 설정</strong>`;
    } else if (viewId === 'status') {
      breadcrumb.innerHTML = `사무포털 <span class="separator">&gt;</span> 구독콘텐츠 관리 <span class="separator">&gt;</span> <strong>구독 신청 현황</strong>`;
    } else if (viewId === 'stats') {
      breadcrumb.innerHTML = `사무포털 <span class="separator">&gt;</span> 구독콘텐츠 관리 <span class="separator">&gt;</span> <strong>이용 통계</strong>`;
    }
  }

  const container = document.getElementById('admin-main-view');
  if (!container) return;

  if (viewId === 'setting') {
    window.renderSettingView(container);
  } else if (viewId === 'status') {
    window.renderStatusView(container);
  } else if (viewId === 'stats') {
    window.renderStatsView(container);
  }

  // Update floating list button state
  window.updateFloatingListBtn();
};

// Floating Action Button Helper functions
window.updateFloatingListBtn = function() {
  const btn = document.getElementById('floating-list-btn');
  if (!btn) return;
  if (currentView === 'setting' && (currentSettingViewMode === 'program' || currentSettingViewMode === 'content')) {
    btn.style.display = 'flex';
  } else {
    btn.style.display = 'none';
  }
};

window.handleFloatingListBtnClick = function() {
  if (currentView === 'setting') {
    if (currentSettingViewMode === 'content') {
      window.goBackToPrograms();
    } else if (currentSettingViewMode === 'program') {
      window.goBackToCategories();
    }
  }
};

// Global Toast Alert Sim
window.showToast = function(msg, isError = false) {
  const tc = document.getElementById('toast-container');
  if (!tc) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (isError) {
    toast.style.borderLeft = '4px solid #ef4444';
  }
  toast.innerHTML = `
    <div class="toast-icon" style="color: ${isError ? '#ef4444' : '#0045c4'}">${isError ? '✗' : '✓'}</div>
    <div class="toast-msg">${msg}</div>
  `;
  tc.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.4s ease-out forwards';
    setTimeout(() => toast.remove(), 400);
  }, 2500);
};

// Character count indicator updater
window.updateCharCount = function(inputId, countId, limit) {
  const input = document.getElementById(inputId);
  const indicator = document.getElementById(countId);
  if (input && indicator) {
    const len = input.value.length;
    indicator.innerText = `${len}/${limit}`;
    if (len >= limit) {
      indicator.style.color = '#ef4444';
      indicator.style.fontWeight = 'bold';
    } else {
      indicator.style.color = '#64748b';
      indicator.style.fontWeight = 'normal';
    }
  }
};

// =========================================================================
// VIEW 1: 구독용 콘텐츠 설정 (Category, Program, Content levels)
// =========================================================================

window.renderSettingView = function(container) {
  if (currentSettingViewMode === 'category') {
    renderCategoryList(container);
  } else if (currentSettingViewMode === 'program') {
    renderProgramList(container);
  } else if (currentSettingViewMode === 'content') {
    renderContentList(container);
  }
};

// 1.1 Category List View (Mockup matched)
function renderCategoryList(container) {
  const categories = getCategories();
  const programs = getPrograms();
  const grades = getGrades();
  const searchVal = currentCategoryFilter.toLowerCase().trim();
  
  // Filtered categories
  const filtered = categories.filter(c => {
    return !searchVal || c.name.toLowerCase().includes(searchVal);
  });

  // Calculate programs and tiers count per category
  const listItems = filtered.map(cat => {
    const catProgs = programs.filter(p => p.catId === cat.id);
    const selectedGrades = grades.filter(g => cat.tiers && cat.tiers.includes(g.id));
    
    // Formatting: e.g. "헬스케어 외 50개 (51개)"
    let tierText = "지정 등급 없음";
    if (selectedGrades.length > 0) {
      const firstLabel = selectedGrades[0].name.split(' ')[0]; // E.g., '헬스케어' or '교보다솜케어'
      if (selectedGrades.length > 1) {
        tierText = `${firstLabel} 외 ${selectedGrades.length - 1}개 (${selectedGrades.length}개)`;
      } else {
        tierText = `${selectedGrades[0].name} (1개)`;
      }
    }

    return {
      id: cat.id,
      name: cat.name,
      desc: cat.desc,
      note: cat.note || '-',
      programCount: `${catProgs.length}건`,
      tierLabel: tierText,
      tierCount: selectedGrades.length
    };
  });

  // Construct Table rows
  let rowsHtml = '';
  if (listItems.length === 0) {
    rowsHtml = `<tr><td colspan="7" style="text-align:center; padding:40px; color:#64748b;">검색된 카테고리가 없습니다. 신규 등록을 진행해 주세요.</td></tr>`;
  } else {
    listItems.forEach((item, index) => {
      rowsHtml += `
        <tr onclick="window.drillDownToPrograms('${item.id}', '${item.name}')" style="cursor: pointer; transition: background 0.15s;">
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:13px; text-align:center; color:#64748b;">${index + 1}</td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:700;">
            <a href="javascript:void(0)" onclick="event.stopPropagation(); window.drillDownToPrograms('${item.id}', '${item.name}')" style="color:#0045c4; text-decoration:none; border-bottom:1px solid rgba(0,69,196,0.2); padding-bottom:1px;">${item.name}</a>
          </td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:13px; color:#334155;">${item.desc}</td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:13px; text-align:center; font-weight:600; color:#334155;">${item.programCount}</td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:13px; color:#334155;">
            <span style="display:inline-flex; align-items:center;" onclick="event.stopPropagation();">
              ${item.tierLabel}
              <span class="tooltip-trigger" title="이용가능 등급 목록 전체: ${item.tierCount}개 플랜 적용">i</span>
            </span>
          </td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:13px; color:#64748b; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${item.note}</td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; text-align:center;">
            <div style="display:flex; gap:6px; justify-content:center;">
              <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); window.openTierModal('${item.id}')" style="padding:4px 10px; font-size:12px; background:#fff; border:1px solid #cbd5e1; font-weight:600;">등급관리</button>
              <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); window.openCategoryDrawer('${item.id}')" style="padding:4px 10px; font-size:12px; background:#fff; border:1px solid #cbd5e1;">수정</button>
              <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); window.deleteCategory('${item.id}')" style="padding:4px 10px; font-size:12px; background:#fff; border:1px solid #cbd5e1; color:#ef4444;">삭제</button>
            </div>
          </td>
        </tr>
      `;
    });
  }

  container.innerHTML = `
    <!-- Page Header (Mockup match) -->
    <div class="page-header" style="margin-bottom: 24px;">
      <div>
        <h1 class="page-title" style="display:inline-flex; align-items:center; gap:8px;">
          구독용 콘텐츠 설정 
          <span class="tooltip-trigger" style="width:20px; height:20px; font-size:12px;" title="구독 가능한 카테고리, 프로그램, 콘텐츠를 설정하고 발송주기를 정의합니다.">i</span>
        </h1>
        <p class="page-subtitle" style="margin-top:4px;">카테고리명을 클릭하면 해당 카테고리의 구독용 콘텐츠를 관리할 수 있습니다.</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" onclick="window.openCategoryDrawer()" style="background:#0045c4; display:flex; gap:6px; align-items:center; font-weight:700;">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
          카테고리 등록
        </button>
      </div>
    </div>

    ${window.getRegistrationFlowHtml(1)}

    <!-- Search Card (Mockup match) -->
    <div class="config-card" style="padding: 16px 24px; margin-bottom: 24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:14px; font-weight:700; color:#334155;">카테고리명</span>
        <input type="text" id="category-search-input" class="form-input" style="width:280px; padding:8px 12px; font-size:13px;" placeholder="카테고리명을 입력하세요." value="${currentCategoryFilter}" onkeyup="if(event.key==='Enter') window.searchCategories()">
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-primary" onclick="window.searchCategories()" style="background:#0045c4; padding:8px 20px; font-size:13px;">조회</button>
        <button class="btn btn-secondary" onclick="window.resetCategorySearch()" style="background:#fff; border:1px solid #cbd5e1; padding:8px 20px; font-size:13px;">초기화</button>
      </div>
    </div>

    <!-- Category List Title -->
    <div style="font-size: 16px; font-weight: 700; color: #334155; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" style="color: #0045c4;"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
      카테고리 목록
    </div>


    <!-- Categories Data Table (Mockup match) -->
    <div class="config-card" style="margin-bottom: 32px;">
      <div class="card-body" style="padding:0; overflow-x:auto;">
        <table class="data-table" style="width:100%;">
          <thead>
            <tr>
              <th style="width:50px; text-align:center;">No.</th>
              <th style="width:180px;">카테고리명</th>
              <th>카테고리 설명</th>
              <th style="width:100px; text-align:center;">프로그램수</th>
              <th style="width:250px;">이용가능 등급명 및 수</th>
              <th style="width:250px;">비고 (관리용 특징)</th>
              <th style="width:220px; text-align:center;">관리</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
      <!-- Table Footer Card Area with pagination -->
      <div style="padding:16px 24px; background:#fff; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:13px; color:#64748b; font-weight:600;">전체 ${filtered.length}건</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <!-- Pagination Buttons Simulator -->
          <div style="display:inline-flex; border:1px solid #e2e8f0; border-radius:6px; overflow:hidden;">
            <button style="padding:6px 12px; background:#fff; border:none; cursor:pointer; font-size:12px; color:#94a3b8;" disabled>&laquo;</button>
            <button style="padding:6px 12px; background:#fff; border:none; cursor:pointer; font-size:12px; color:#94a3b8;" disabled>&lt;</button>
            <button style="padding:6px 12px; background:#0045c4; border:none; font-weight:700; color:white; font-size:12px;">1</button>
            <button style="padding:6px 12px; background:#fff; border:none; cursor:pointer; font-size:12px; color:#94a3b8;" disabled>&gt;</button>
            <button style="padding:6px 12px; background:#fff; border:none; cursor:pointer; font-size:12px; color:#94a3b8;" disabled>&raquo;</button>
          </div>
          <select class="form-select" style="min-width:auto; width:120px; padding:6px 12px; font-size:12px;" disabled>
            <option>10개씩 보기</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Bottom Guidelines Box -->
    <div class="instructions-box">
      <div class="instructions-title">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        안내사항
      </div>
      <ul class="instructions-list">
        <li>• 카테고리 등록 후 이용가능 등급을 설정해야 구독 대상자에게 노출됩니다.</li>
        <li>• 프로그램은 카테고리 선택 후 등록할 수 있습니다.</li>
      </ul>
    </div>
  `;
}

// 1.1 Actions
window.searchCategories = function() {
  const input = document.getElementById('category-search-input');
  if (input) {
    currentCategoryFilter = input.value;
    navigateToSubscriptionView('setting');
  }
};

window.resetCategorySearch = function() {
  currentCategoryFilter = '';
  navigateToSubscriptionView('setting');
};

// Drill down to Program list view
window.drillDownToPrograms = function(catId, catName) {
  selectedCategoryId = catId;
  currentSettingViewMode = 'program';
  
  // Update breadcrumb
  const breadcrumb = document.getElementById('breadcrumb-area');
  if (breadcrumb) {
    breadcrumb.innerHTML = `사무포털 <span class="separator">&gt;</span> 구독콘텐츠 관리 <span class="separator">&gt;</span> 구독용 콘텐츠 설정 <span class="separator">&gt;</span> <strong>${catName} (프로그램 목록)</strong>`;
  }
  
  const container = document.getElementById('admin-main-view');
  renderProgramList(container);
  window.updateFloatingListBtn();
  if (window.updateSidebarActiveStates) window.updateSidebarActiveStates();
};

// Drawer Handlers: Category
window.openCategoryDrawer = function(catId = null) {
  const overlay = document.getElementById('category-drawer-overlay');
  const drawer = document.getElementById('category-drawer');
  const titleEl = document.getElementById('category-drawer-title');
  const form = document.getElementById('category-form');
  
  // Elements
  const editId = document.getElementById('category-edit-id');
  const nameInput = document.getElementById('drawer-category-name');
  const descInput = document.getElementById('drawer-category-desc');
  const noteInput = document.getElementById('drawer-category-note');
  
  if (catId) {
    titleEl.innerText = "카테고리 수정";
    const categories = getCategories();
    const cat = categories.find(c => c.id === catId);
    if (cat) {
      editId.value = cat.id;
      nameInput.value = cat.name;
      descInput.value = cat.desc;
      noteInput.value = cat.note || '';
    }
  } else {
    titleEl.innerText = "카테고리 등록";
    form.reset();
    editId.value = '';
  }
  
  overlay.classList.add('open');
  drawer.classList.add('open');
  
  // Trigger initial char counts
  window.updateCharCount('drawer-category-name', 'name-char-count', 50);
  window.updateCharCount('drawer-category-desc', 'desc-char-count', 200);
  window.updateCharCount('drawer-category-note', 'note-char-count', 200);
};

window.closeCategoryDrawer = function() {
  document.getElementById('category-drawer-overlay').classList.remove('open');
  document.getElementById('category-drawer').classList.remove('open');
};

window.saveCategory = function() {
  const editId = document.getElementById('category-edit-id').value;
  const name = document.getElementById('drawer-category-name').value.trim();
  const desc = document.getElementById('drawer-category-desc').value.trim();
  const note = document.getElementById('drawer-category-note').value.trim();
  
  if (!name) {
    window.showToast("카테고리명을 입력해 주세요.", true);
    return;
  }
  if (!desc) {
    window.showToast("카테고리 설명을 입력해 주세요.", true);
    return;
  }
  
  let categories = getCategories();
  if (editId) {
    // Modify
    const idx = categories.findIndex(c => c.id === editId);
    if (idx !== -1) {
      categories[idx].name = name;
      categories[idx].desc = desc;
      categories[idx].note = note;
    }
    window.showToast("카테고리가 수정되었습니다.");
  } else {
    // Add new
    const newId = `cat_${Date.now()}`;
    categories.push({
      id: newId,
      name: name,
      desc: desc,
      note: note,
      tiers: [] // No tiers initially (Requires Shuttle box configuration)
    });
    window.showToast("새로운 카테고리가 등록되었습니다. 이용가능 등급을 설정해 주세요.");
  }
  
  saveCategories(categories);
  window.closeCategoryDrawer();
  navigateToSubscriptionView('setting');
};

let categoryToDeleteId = null;

window.deleteCategory = function(catId) {
  categoryToDeleteId = catId;
  const categories = getCategories();
  const cat = categories.find(c => c.id === catId);
  if (!cat) return;
  
  const nameEl = document.getElementById('delete-confirm-cat-name');
  if (nameEl) {
    nameEl.innerText = cat.name;
  }
  
  const modal = document.getElementById('delete-confirm-modal-overlay');
  if (modal) {
    modal.classList.add('open');
  }
};

window.closeDeleteConfirmModal = function() {
  const modal = document.getElementById('delete-confirm-modal-overlay');
  if (modal) {
    modal.classList.remove('open');
  }
  categoryToDeleteId = null;
};

window.confirmDeleteCategory = function() {
  if (!categoryToDeleteId) return;
  
  const catId = categoryToDeleteId;
  let categories = getCategories();
  categories = categories.filter(c => c.id !== catId);
  saveCategories(categories);
  
  // Cascading delete programs and contents
  let programs = getPrograms();
  const deletedProgs = programs.filter(p => p.catId === catId);
  programs = programs.filter(p => p.catId !== catId);
  savePrograms(programs);
  
  let contents = getContents();
  deletedProgs.forEach(prog => {
    contents = contents.filter(c => c.progId !== prog.id);
  });
  saveContents(contents);

  window.showToast("카테고리가 정상적으로 삭제되었습니다.");
  
  window.closeDeleteConfirmModal();
  navigateToSubscriptionView('setting');
};


// =========================================================================
// SHUTTLE BOX DUAL LIST COMPONENT (Grade management modal)
// =========================================================================
// State managed via global variables at the top of the file

window.openTierModal = function(catId) {
  selectedCategoryForTiers = catId;
  const categories = getCategories();
  const cat = categories.find(c => c.id === catId);
  if (!cat) return;
  
  document.getElementById('tier-modal-title').innerText = `[${cat.name}] 이용가능 등급 설정 (셔틀박스)`;
  
  const allGrades = getGrades();
  const activeTiers = cat.tiers || [];
  
  // Set shuttle arrays
  shuttleSelected = allGrades.filter(g => activeTiers.includes(g.id));
  shuttleAvailable = allGrades.filter(g => !activeTiers.includes(g.id));
  
  // Reset checks & search filter
  checkedAvailableIds = [];
  checkedSelectedIds = [];
  shuttleSearchQuery = '';
  const searchInput = document.getElementById('shuttle-search-input');
  if (searchInput) searchInput.value = '';

  // Reset check all DOM state
  const leftAll = document.getElementById('shuttle-left-select-all');
  const rightAll = document.getElementById('shuttle-right-select-all');
  if (leftAll) leftAll.checked = false;
  if (rightAll) rightAll.checked = false;
  
  // Open Modal
  document.getElementById('tier-modal-overlay').classList.add('open');
  
  renderShuttleLists();
};

window.closeTierModal = function() {
  document.getElementById('tier-modal-overlay').classList.remove('open');
  selectedCategoryForTiers = null;
};

// Search Filter
window.filterShuttleTiers = function(query) {
  shuttleSearchQuery = query;
  renderShuttleLists();
};

// Checkbox select all toggle
window.toggleShuttleSelectAll = function(side, isChecked) {
  if (side === 'left') {
    const visibleAvailable = shuttleAvailable.filter(g => 
      !shuttleSearchQuery || g.name.toLowerCase().includes(shuttleSearchQuery.toLowerCase().trim())
    );
    if (isChecked) {
      visibleAvailable.forEach(item => {
        if (!checkedAvailableIds.includes(item.id)) {
          checkedAvailableIds.push(item.id);
        }
      });
    } else {
      visibleAvailable.forEach(item => {
        checkedAvailableIds = checkedAvailableIds.filter(id => id !== item.id);
      });
    }
  } else {
    // Selected side (right) is not filtered by search query
    if (isChecked) {
      checkedSelectedIds = shuttleSelected.map(g => g.id);
    } else {
      checkedSelectedIds = [];
    }
  }
  renderShuttleLists();
};

// Toggle single checkbox or row click check state
window.toggleCheckState = function(id, side) {
  if (side === 'left') {
    const idx = checkedAvailableIds.indexOf(id);
    if (idx > -1) {
      checkedAvailableIds.splice(idx, 1);
    } else {
      checkedAvailableIds.push(id);
    }
  } else {
    const idx = checkedSelectedIds.indexOf(id);
    if (idx > -1) {
      checkedSelectedIds.splice(idx, 1);
    } else {
      checkedSelectedIds.push(id);
    }
  }
  renderShuttleLists();
};

window.doubleClickShuttle = function(id, direction) {
  if (direction === 'right') {
    // Quick move double clicked item to selected list
    const item = shuttleAvailable.find(g => g.id === id);
    if (item) {
      shuttleSelected.push(item);
      shuttleAvailable = shuttleAvailable.filter(g => g.id !== id);
      checkedAvailableIds = checkedAvailableIds.filter(checkedId => checkedId !== id);
    }
  } else {
    // Quick move double clicked item to available list
    const item = shuttleSelected.find(g => g.id === id);
    if (item) {
      shuttleAvailable.push(item);
      shuttleSelected = shuttleSelected.filter(g => g.id !== id);
      checkedSelectedIds = checkedSelectedIds.filter(checkedId => checkedId !== id);
    }
  }
  renderShuttleLists();
};

// Render left & right panes in Shuttle box
function renderShuttleLists() {
  const leftList = document.getElementById('shuttle-available-list');
  const rightList = document.getElementById('shuttle-selected-list');
  
  if (!leftList || !rightList) return;
  
  // Sort alphabetically
  shuttleAvailable.sort((a,b) => a.name.localeCompare(b.name));
  shuttleSelected.sort((a,b) => a.name.localeCompare(b.name));

  // Filter Available list by search query
  const visibleAvailable = shuttleAvailable.filter(g => 
    !shuttleSearchQuery || g.name.toLowerCase().includes(shuttleSearchQuery.toLowerCase().trim())
  );

  // Update check all headers checkbox state
  const leftAll = document.getElementById('shuttle-left-select-all');
  if (leftAll) {
    leftAll.checked = visibleAvailable.length > 0 && visibleAvailable.every(g => checkedAvailableIds.includes(g.id));
  }
  const rightAll = document.getElementById('shuttle-right-select-all');
  if (rightAll) {
    rightAll.checked = shuttleSelected.length > 0 && shuttleSelected.every(g => checkedSelectedIds.includes(g.id));
  }

  // Left List Items (with checkboxes)
  leftList.innerHTML = visibleAvailable.map(item => {
    const isChecked = checkedAvailableIds.includes(item.id);
    return `
      <div class="shuttle-item ${isChecked ? 'selected' : ''}" 
           style="display:flex; align-items:center; gap:8px;"
           onclick="window.toggleCheckState('${item.id}', 'left')"
           ondblclick="event.stopPropagation(); window.doubleClickShuttle('${item.id}', 'right')">
        <input type="checkbox" style="cursor:pointer;" ${isChecked ? 'checked' : ''} onclick="event.stopPropagation(); window.toggleCheckState('${item.id}', 'left')">
        <span style="user-select:none; cursor:pointer;">${item.name}</span>
      </div>
    `;
  }).join('');

  // Right List Items (with checkboxes)
  rightList.innerHTML = shuttleSelected.map(item => {
    const isChecked = checkedSelectedIds.includes(item.id);
    return `
      <div class="shuttle-item ${isChecked ? 'selected' : ''}" 
           style="display:flex; align-items:center; gap:8px;"
           onclick="window.toggleCheckState('${item.id}', 'right')"
           ondblclick="event.stopPropagation(); window.doubleClickShuttle('${item.id}', 'left')">
        <input type="checkbox" style="cursor:pointer;" ${isChecked ? 'checked' : ''} onclick="event.stopPropagation(); window.toggleCheckState('${item.id}', 'right')">
        <span style="user-select:none; cursor:pointer;">${item.name}</span>
      </div>
    `;
  }).join('');

  // Update counts
  document.getElementById('shuttle-available-count').innerText = shuttleAvailable.length;
  document.getElementById('shuttle-selected-count').innerText = shuttleSelected.length;
  
  // Hide warning if selection > 0
  const warning = document.getElementById('shuttle-empty-warning');
  if (shuttleSelected.length > 0) {
    warning.style.display = 'none';
  } else {
    warning.style.display = 'block';
  }

  // Disable controls unless items checked
  updateShuttleButtonState();
}

window.moveSelectedTiers = function(direction) {
  if (direction === 'right') {
    if (checkedAvailableIds.length === 0) return;
    const itemsToMove = shuttleAvailable.filter(g => checkedAvailableIds.includes(g.id));
    shuttleSelected = [...shuttleSelected, ...itemsToMove];
    shuttleAvailable = shuttleAvailable.filter(g => !checkedAvailableIds.includes(g.id));
    checkedAvailableIds = []; // Reset check ids
  } else {
    if (checkedSelectedIds.length === 0) return;
    const itemsToMove = shuttleSelected.filter(g => checkedSelectedIds.includes(g.id));
    shuttleAvailable = [...shuttleAvailable, ...itemsToMove];
    shuttleSelected = shuttleSelected.filter(g => !checkedSelectedIds.includes(g.id));
    checkedSelectedIds = []; // Reset check ids
  }
  
  renderShuttleLists();
};

window.moveAllTiers = function(direction) {
  if (direction === 'right') {
    shuttleSelected = [...shuttleSelected, ...shuttleAvailable];
    shuttleAvailable = [];
    checkedAvailableIds = [];
  } else {
    shuttleAvailable = [...shuttleAvailable, ...shuttleSelected];
    shuttleSelected = [];
    checkedSelectedIds = [];
  }
  
  renderShuttleLists();
};

function updateShuttleButtonState() {
  document.getElementById('shuttle-move-right').disabled = checkedAvailableIds.length === 0;
  document.getElementById('shuttle-move-left').disabled = checkedSelectedIds.length === 0;
  document.getElementById('shuttle-move-all-right').disabled = shuttleAvailable.length === 0;
  document.getElementById('shuttle-move-all-left').disabled = shuttleSelected.length === 0;
}

window.saveTiersForCategory = function() {
  if (shuttleSelected.length === 0) {
    window.showToast("적어도 한 개 이상의 등급을 선택해야 저장할 수 있습니다.", true);
    return;
  }
  
  const categories = getCategories();
  const idx = categories.findIndex(c => c.id === selectedCategoryForTiers);
  if (idx !== -1) {
    categories[idx].tiers = shuttleSelected.map(g => g.id);
    saveCategories(categories);
    window.showToast(`등급 설정이 변경되었습니다. (총 ${shuttleSelected.length}개 등급 적용)`);
  }
  
  window.closeTierModal();
  navigateToSubscriptionView('setting');
};

// =========================================================================
// VIEW 1.2: 프로그램 목록 화면 (Drill-Down Level 2)
// =========================================================================

function renderProgramList(container) {
  const programs = getPrograms();
  const categories = getCategories();
  const currentCat = categories.find(c => c.id === selectedCategoryId);
  if (!currentCat) return;

  const catProgs = programs.filter(p => p.catId === selectedCategoryId);
  
  let rowsHtml = '';
  if (catProgs.length === 0) {
    rowsHtml = `<tr><td colspan="8" style="text-align:center; padding:40px; color:#64748b;">이 카테고리에 등록된 프로그램이 없습니다. 신규 프로그램을 등록해 주세요.</td></tr>`;
  } else {
    catProgs.forEach((prog, index) => {
      const sendPillClass = prog.sendYn === "노출" ? "pill-green" : "pill-gray";
      const termSelectPillClass = prog.termSelectYn === "가능" ? "pill-blue" : "pill-gray";

      rowsHtml += `
        <tr onclick="window.drillDownToContents('${prog.id}', '${prog.name}')" style="cursor: pointer; transition: background 0.15s;">
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:13px; text-align:center; color:#64748b;">${index + 1}</td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:700;">
            <a href="javascript:void(0)" onclick="event.stopPropagation(); window.drillDownToContents('${prog.id}', '${prog.name}')" style="color:#0045c4; text-decoration:none; border-bottom:1px solid rgba(0,69,196,0.2); padding-bottom:1px;">${prog.name}</a>
          </td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:13px; color:#334155;">${prog.desc}</td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:13px; text-align:center; font-weight:600; color:#334155;">${prog.period}</td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:13px; text-align:center; font-weight:600; color:#334155;">${prog.totalTerms}차</td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; text-align:center;">
            <span class="pill ${sendPillClass}">${prog.sendYn || '미노출'}</span>
          </td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; text-align:center;">
            <span class="pill ${termSelectPillClass}">${prog.termSelectYn || '불가능'}</span>
          </td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; text-align:center;">
            <div style="display:flex; gap:6px; justify-content:center;">
              <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); window.openProgramModal('${prog.id}')" style="padding:4px 10px; font-size:12px; background:#fff; border:1px solid #cbd5e1; color:#0045c4; font-weight:700;">수정</button>
              <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); window.deleteProgram('${prog.id}')" style="padding:4px 10px; font-size:12px; background:#fff; border:1px solid #cbd5e1; color:#ef4444; font-weight:700;">삭제</button>
            </div>
          </td>
        </tr>
      `;
    });
  }

  container.innerHTML = `
    <!-- Sub Breadcrumb & Header Actions -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; border-bottom:1px solid #cbd5e1; padding-bottom:16px;">
      <div>
        <h2 style="font-size:20px; font-weight:800; color:#0f172a; display:inline-flex; align-items:center; gap:8px;">
          ${currentCat.name} 
          <span style="font-size:13px; font-weight:500; color:#64748b;">(프로그램 목록)</span>
        </h2>
        <p style="font-size:13px; color:#64748b; margin-top:4px;">${currentCat.name} 카테고리에 등록된 프로그램 목록입니다.</p>
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-primary" onclick="window.openProgramModal()" style="background:#0045c4; font-weight:700; height:40px; padding:0 20px; display:inline-flex; align-items:center; justify-content:center; gap:6px; border:none; border-radius:6px; color:white; cursor:pointer;">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
          프로그램 등록
        </button>
      </div>
    </div>

    ${window.getRegistrationFlowHtml(2)}

    <!-- Programs Grid -->
    <div class="config-card" style="margin-bottom:32px;">
      <div class="card-body" style="padding:0;">
        <table class="data-table" style="width:100%;">
          <thead>
            <tr>
              <th style="width:60px; text-align:center;">No.</th>
              <th style="width:220px;">프로그램명</th>
              <th>프로그램 설명</th>
              <th style="width:100px; text-align:center;">발송주기</th>
              <th style="width:100px; text-align:center;">차수</th>
              <th style="width:120px; text-align:center;">노출여부</th>
              <th style="width:120px; text-align:center;">차수선택</th>
              <th style="width:160px; text-align:center;">관리</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Bottom Controls -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 20px; padding:0 8px;">
      <button class="btn btn-secondary" onclick="window.goBackToCategories()" style="background:#fff; border:1px solid #cbd5e1; color:#0f172a; padding:8px 16px; font-size:13px; font-weight:500; display:inline-flex; align-items:center; gap:6px; cursor:pointer;">
        &larr; 이전
      </button>
      
      <div style="display:inline-flex; border:1px solid #e2e8f0; border-radius:6px; overflow:hidden;">
        <button style="padding:6px 12px; background:#fff; border:none; cursor:pointer; font-size:12px; color:#94a3b8;" disabled>&laquo;</button>
        <button style="padding:6px 12px; background:#fff; border:none; cursor:pointer; font-size:12px; color:#94a3b8;" disabled>&lt;</button>
        <button style="padding:6px 12px; background:#0045c4; border:none; font-weight:700; color:white; font-size:12px;">1</button>
        <button style="padding:6px 12px; background:#fff; border:none; cursor:pointer; font-size:12px; color:#94a3b8;" disabled>&gt;</button>
        <button style="padding:6px 12px; background:#fff; border:none; cursor:pointer; font-size:12px; color:#94a3b8;" disabled>&raquo;</button>
      </div>
      
      <div>
        <select class="form-select" style="min-width:auto; width:120px; padding:6px 12px; font-size:12px; height:34px;" disabled>
          <option>10개씩 보기</option>
        </select>
      </div>
    </div>
  `;
}

window.goBackToCategories = function() {
  currentSettingViewMode = 'category';
  selectedCategoryId = null;
  navigateToSubscriptionView('setting');
};

// Program modal popup handles
window.openProgramModal = function(progId = null) {
  const overlay = document.getElementById('program-modal-overlay');
  const titleEl = document.getElementById('program-modal-title');
  const form = document.getElementById('program-form');
  
  const editId = document.getElementById('program-edit-id');
  const catIdField = document.getElementById('program-category-id');
  const nameInput = document.getElementById('drawer-program-name');
  const descInput = document.getElementById('drawer-program-desc');
  const sendYnLabel = document.getElementById('program-send-yn-label');
  
  catIdField.value = selectedCategoryId;

  // Generate Terms dropdown: 1~100 options
  const termsSelect = document.getElementById('program-terms-select');
  if (termsSelect) {
    let optionsHtml = '<option value="" disabled selected>차수를 선택하세요. (1~100)</option>';
    for (let i = 1; i <= 100; i++) {
      optionsHtml += `<option value="${i}">${i}차</option>`;
    }
    termsSelect.innerHTML = optionsHtml;
  }
  
  if (progId) {
    titleEl.innerText = "프로그램 수정";
    if (sendYnLabel) {
      sendYnLabel.innerHTML = `발송여부 <span class="field-required">*</span>`;
    }
    const progs = getPrograms();
    const prog = progs.find(p => p.id === progId);
    if (prog) {
      editId.value = prog.id;
      nameInput.value = prog.name;
      descInput.value = prog.desc;
      
      // Select radio period
      const periodRadio = document.querySelector(`input[name="program-period"][value="${prog.period}"]`);
      if (periodRadio) periodRadio.checked = true;

      // Select term option
      if (termsSelect) {
        termsSelect.value = prog.totalTerms || "";
      }

      // Select radio sendYn
      const sendRadio = document.querySelector(`input[name="program-send-yn"][value="${prog.sendYn || '노출'}"]`);
      if (sendRadio) sendRadio.checked = true;

      // Select radio termSelectYn
      const termSelectRadio = document.querySelector(`input[name="program-term-select-yn"][value="${prog.termSelectYn || '가능'}"]`);
      if (termSelectRadio) termSelectRadio.checked = true;
    }
  } else {
    titleEl.innerText = "프로그램 등록";
    if (sendYnLabel) {
      sendYnLabel.innerHTML = `노출여부 <span class="field-required">*</span>`;
    }
    form.reset();
    editId.value = '';
    
    // Default radio resets
    const defPeriodRadio = document.querySelector('input[name="program-period"][value="주"]');
    if (defPeriodRadio) defPeriodRadio.checked = true;

    const defSendRadio = document.querySelector('input[name="program-send-yn"][value="노출"]');
    if (defSendRadio) defSendRadio.checked = true;

    const defTermSelectRadio = document.querySelector('input[name="program-term-select-yn"][value="가능"]');
    if (defTermSelectRadio) defTermSelectRadio.checked = true;
  }
  
  overlay.classList.add('open');
  
  window.updateCharCount('drawer-program-name', 'prog-name-char-count', 100);
  window.updateCharCount('drawer-program-desc', 'prog-desc-char-count', 300);
};

window.closeProgramModal = function() {
  document.getElementById('program-modal-overlay').classList.remove('open');
};

window.saveProgram = function() {
  const editId = document.getElementById('program-edit-id').value;
  const catId = document.getElementById('program-category-id').value;
  const name = document.getElementById('drawer-program-name').value.trim();
  const desc = document.getElementById('drawer-program-desc').value.trim();
  
  const periodRadio = document.querySelector('input[name="program-period"]:checked');
  const period = periodRadio ? periodRadio.value : "주";

  const termsSelect = document.getElementById('program-terms-select');
  const totalTermsVal = termsSelect ? termsSelect.value : "";

  const sendRadio = document.querySelector('input[name="program-send-yn"]:checked');
  const sendYn = sendRadio ? sendRadio.value : "노출";

  const termSelectRadio = document.querySelector('input[name="program-term-select-yn"]:checked');
  const termSelectYn = termSelectRadio ? termSelectRadio.value : "가능";
  
  if (!name) {
    window.showToast("프로그램명을 입력해 주세요.", true);
    return;
  }
  if (!desc) {
    window.showToast("프로그램 설명을 입력해 주세요.", true);
    return;
  }
  if (!totalTermsVal) {
    window.showToast("차수를 선택해 주세요.", true);
    return;
  }
  
  const totalTerms = parseInt(totalTermsVal) || 4;

  let programs = getPrograms();
  if (editId) {
    const idx = programs.findIndex(p => p.id === editId);
    if (idx !== -1) {
      programs[idx].name = name;
      programs[idx].period = period;
      programs[idx].desc = desc;
      programs[idx].totalTerms = totalTerms;
      programs[idx].sendYn = sendYn;
      programs[idx].termSelectYn = termSelectYn;
    }
    window.showToast("프로그램이 수정되었습니다.");
  } else {
    const newId = `prog_${Date.now()}`;
    programs.push({
      id: newId,
      catId: catId,
      name: name,
      period: period,
      desc: desc,
      totalTerms: totalTerms,
      sendYn: sendYn,
      termSelectYn: termSelectYn,
      note: ""
    });
    
    // Automatically generate contents for the new program to prevent errors (initialized as blank)
    let contents = getContents();
    for (let s = 1; s <= totalTerms; s++) {
      contents.push({
        id: `cont_${newId}_${s}`,
        progId: newId,
        seq: `${s}회차`,
        day: `${s}회차 발송`,
        title: "",
        dateCreated: new Date().toISOString().split('T')[0],
        body: ""
      });
    }
    saveContents(contents);
    window.showToast("신규 프로그램이 성공적으로 등록되었습니다.");
  }
  
  savePrograms(programs);
  window.closeProgramModal();
  
  // Re-render
  const container = document.getElementById('admin-main-view');
  renderProgramList(container);
};

window.deleteProgram = function(progId) {
  if (confirm("정말로 이 프로그램을 삭제하시겠습니까?\n프로그램에 연결된 모든 회차별 세부 콘텐츠도 함께 삭제됩니다.")) {
    let programs = getPrograms();
    programs = programs.filter(p => p.id !== progId);
    savePrograms(programs);
    
    // Delete linked contents
    let contents = getContents();
    contents = contents.filter(c => c.progId !== progId);
    saveContents(contents);
    
    window.showToast("프로그램이 삭제되었습니다.");
    
    const container = document.getElementById('admin-main-view');
    renderProgramList(container);
  }
};

// =========================================================================
// VIEW 1.3: 세부 콘텐츠 목록 (Drill-Down Level 3 - Simple preview implementation)
// =========================================================================

window.drillDownToContents = function(progId, progName) {
  selectedProgramId = progId;
  currentSettingViewMode = 'content';
  
  const programs = getPrograms();
  const prog = programs.find(p => p.id === progId);
  const categories = getCategories();
  const catName = categories.find(c => c.id === prog.catId)?.name || '';

  // Update breadcrumb
  const breadcrumb = document.getElementById('breadcrumb-area');
  if (breadcrumb) {
    breadcrumb.innerHTML = `사무포털 <span class="separator">&gt;</span> 구독콘텐츠 관리 <span class="separator">&gt;</span> 구독용 콘텐츠 설정 <span class="separator">&gt;</span> ${catName} <span class="separator">&gt;</span> <strong>${progName} (콘텐츠 목록)</strong>`;
  }
  
  const container = document.getElementById('admin-main-view');
  renderContentList(container);
  window.updateFloatingListBtn();
  if (window.updateSidebarActiveStates) window.updateSidebarActiveStates();
};

function renderContentList(container) {
  const contents = getContents();
  const programs = getPrograms();
  const prog = programs.find(p => p.id === selectedProgramId);
  if (!prog) return;

  const progContents = contents.filter(c => c.progId === selectedProgramId);
  // Sort by sequence or days
  progContents.sort((a, b) => {
    const seqA = parseInt(a.seq) || 0;
    const seqB = parseInt(b.seq) || 0;
    return seqA - seqB;
  });

  let rowsHtml = '';
  if (progContents.length === 0) {
    rowsHtml = `<tr><td colspan="5" style="text-align:center; padding:40px; color:#64748b;">등록된 회차별 세부 콘텐츠가 없습니다. 첫 콘텐츠를 등록해 주세요.</td></tr>`;
  } else {
    progContents.forEach((cont, index) => {
      rowsHtml += `
        <tr>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:13px; text-align:center; color:#64748b;">${cont.seq}</td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:700; color:#334155;">${cont.title}</td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:13px; text-align:center; font-weight:600; color:#0f5cf2;">${cont.day}</td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:13px; text-align:center; color:#64748b;">${cont.dateCreated}</td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; text-align:center;">
            <div style="display:flex; gap:6px; justify-content:center;">
              <button class="btn btn-secondary btn-sm" onclick="window.viewContentDetailModal('${cont.id}')" style="padding:4px 10px; font-size:12px; background:#fff; border:1px solid #cbd5e1; color:#0045c4; font-weight:700;">미리보기</button>
              <button class="btn btn-secondary btn-sm" onclick="window.openContentDrawer('${cont.id}')" style="padding:4px 10px; font-size:12px; background:#fff; border:1px solid #cbd5e1; color:#334155; font-weight:700;">수정</button>
              <button class="btn btn-secondary btn-sm" onclick="window.deleteContent('${cont.id}')" style="padding:4px 10px; font-size:12px; background:#fff; border:1px solid #cbd5e1; color:#ef4444; font-weight:700;">삭제</button>
            </div>
          </td>
        </tr>
      `;
    });
  }

  container.innerHTML = `
    <!-- Level 3 Header -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; border-bottom:1px solid #cbd5e1; padding-bottom:16px;">
      <div>
        <h2 style="font-size:20px; font-weight:800; color:#0f172a; display:inline-flex; align-items:center; gap:8px;">
          ${prog.name}
          <span style="font-size:13px; font-weight:500; color:#64748b;">(콘텐츠 회차 관리)</span>
        </h2>
        <p style="font-size:13px; color:#64748b; margin-top:4px;">* 프로그램 구독자에게 발송될 회차별 LMS 발송 본문을 편집합니다.</p>
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-primary" onclick="window.openContentDrawer()" style="background:#0045c4; font-weight:700;">+ 콘텐츠 등록</button>
      </div>
    </div>

    ${window.getRegistrationFlowHtml(3)}

    <!-- Contents list Table -->
    <div class="config-card" style="margin-bottom:32px;">
      <div class="card-body" style="padding:0;">
        <table class="data-table" style="width:100%;">
          <thead>
            <tr>
              <th style="width:90px; text-align:center;">회차</th>
              <th>콘텐츠 제목</th>
              <th style="width:140px; text-align:center;">발송 시점</th>
              <th style="width:160px; text-align:center;">등록일자</th>
              <th style="width:220px; text-align:center;">관리</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Bottom Controls -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 20px; padding:0 8px;">
      <button class="btn btn-secondary" onclick="window.goBackToPrograms()" style="background:#fff; border:1px solid #cbd5e1; color:#0f172a; padding:8px 16px; font-size:13px; font-weight:500; display:inline-flex; align-items:center; gap:6px; cursor:pointer;">
        &larr; 이전
      </button>
      
      <div style="display:inline-flex; border:1px solid #e2e8f0; border-radius:6px; overflow:hidden;">
        <button style="padding:6px 12px; background:#fff; border:none; cursor:pointer; font-size:12px; color:#94a3b8;" disabled>&laquo;</button>
        <button style="padding:6px 12px; background:#fff; border:none; cursor:pointer; font-size:12px; color:#94a3b8;" disabled>&lt;</button>
        <button style="padding:6px 12px; background:#0045c4; border:none; font-weight:700; color:white; font-size:12px;">1</button>
        <button style="padding:6px 12px; background:#fff; border:none; cursor:pointer; font-size:12px; color:#94a3b8;" disabled>&gt;</button>
        <button style="padding:6px 12px; background:#fff; border:none; cursor:pointer; font-size:12px; color:#94a3b8;" disabled>&raquo;</button>
      </div>
      
      <div>
        <select class="form-select" style="min-width:auto; width:120px; padding:6px 12px; font-size:12px; height:34px;" disabled>
          <option>10개씩 보기</option>
        </select>
      </div>
    </div>
  `;
}

window.goBackToPrograms = function() {
  currentSettingViewMode = 'program';
  selectedProgramId = null;
  // Breadcrumb reconstruction
  const categories = getCategories();
  const cat = categories.find(c => c.id === selectedCategoryId);
  window.drillDownToPrograms(selectedCategoryId, cat ? cat.name : '');
};

// Simplified Content Registration/Edit Drawer
window.openContentDrawer = function(contId = null) {
  // Rather than making complex drawer markup in HTML, we will load or update dynamic drawer components.
  // Wait, let's check if we can reuse the category or program drawers, or define a modal.
  // We can open a simple modal dynamically to perform content edits!
  const modalId = 'dynamic-content-modal';
  let modal = document.getElementById(modalId);
  if (modal) modal.remove();

  let title = "새 콘텐츠 등록";
  let seq = "";
  let day = "";
  let contTitle = "";
  let body = "";

  if (contId) {
    title = "콘텐츠 수정";
    const contents = getContents();
    const cont = contents.find(c => c.id === contId);
    if (cont) {
      seq = cont.seq;
      day = cont.day;
      contTitle = cont.title;
      body = cont.body;
    }
  }

  modal = document.createElement('div');
  modal.id = modalId;
  modal.className = 'modal-overlay open';
  modal.style.zIndex = '300';
  modal.innerHTML = `
    <div class="modal-content" style="width: 780px;">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="drawer-close-btn" style="font-size:20px;" onclick="document.getElementById('${modalId}').remove()">&times;</button>
      </div>
      <div style="padding:20px; display:flex; flex-direction:column; gap:16px;">
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
          <div>
            <label class="form-label">회차 <span class="field-required">*</span></label>
            <input type="text" id="m-content-seq" class="form-input" placeholder="예: 1회차" value="${seq}">
          </div>
          <div>
            <label class="form-label">발송 시점 <span class="field-required">*</span></label>
            <input type="text" id="m-content-day" class="form-input" placeholder="예: 1일차" value="${day}">
          </div>
        </div>
        <div>
          <label class="form-label">콘텐츠 제목 <span class="field-required">*</span></label>
          <input type="text" id="m-content-title" class="form-input" placeholder="콘텐츠 제목을 입력하세요." value="${contTitle}">
        </div>
        <div>
          <label class="form-label">LMS 발송 내용 <span class="field-required">*</span></label>
          <textarea id="m-content-body" class="form-input" style="height:250px; font-family:sans-serif;" placeholder="LMS로 발송할 텍스트 내용을 입력하세요.">${body}</textarea>
        </div>
      </div>
      <div class="drawer-footer">
        <button class="btn btn-secondary" onclick="document.getElementById('${modalId}').remove()">취소</button>
        <button class="btn btn-primary" style="background:#0045c4;" onclick="window.saveContentItem('${contId || ''}')">저장</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};

window.saveContentItem = function(contId) {
  const seq = document.getElementById('m-content-seq').value.trim();
  const day = document.getElementById('m-content-day').value.trim();
  const title = document.getElementById('m-content-title').value.trim();
  const body = document.getElementById('m-content-body').value.trim();

  if (!seq || !day || !title || !body) {
    window.showToast("모든 필수 입력값을 기입해 주세요.", true);
    return;
  }

  let contents = getContents();
  if (contId) {
    // Edit
    const idx = contents.findIndex(c => c.id === contId);
    if (idx !== -1) {
      contents[idx].seq = seq;
      contents[idx].day = day;
      contents[idx].title = title;
      contents[idx].body = body;
    }
    window.showToast("콘텐츠가 정상 수정되었습니다.");
  } else {
    // New
    contents.push({
      id: `cont_${selectedProgramId}_${Date.now()}`,
      progId: selectedProgramId,
      seq: seq,
      day: day,
      title: title,
      dateCreated: new Date().toISOString().split('T')[0],
      body: body
    });
    window.showToast("신규 회차 콘텐츠가 추가되었습니다.");
  }

  saveContents(contents);
  document.getElementById('dynamic-content-modal').remove();
  
  // Re-render list
  const container = document.getElementById('admin-main-view');
  renderContentList(container);
};

window.deleteContent = function(contId) {
  if (confirm("정말로 이 회차 콘텐츠를 삭제하시겠습니까?")) {
    let contents = getContents();
    contents = contents.filter(c => c.id !== contId);
    saveContents(contents);
    window.showToast("콘텐츠가 삭제되었습니다.");
    
    const container = document.getElementById('admin-main-view');
    renderContentList(container);
  }
};

// Rich Preview modal for LMS contents
window.viewContentDetailModal = function(contId) {
  const contents = getContents();
  const cont = contents.find(c => c.id === contId);
  if (!cont) return;

  const modalId = 'preview-content-modal';
  const modal = document.createElement('div');
  modal.id = modalId;
  modal.className = 'modal-overlay open';
  modal.style.zIndex = '300';
  modal.innerHTML = `
    <div class="modal-content" style="width: 550px;">
      <div class="modal-header" style="background:#0045c4; color:white;">
        <h3 style="color:white;">💬 모바일 LMS 발송 미리보기</h3>
        <button class="drawer-close-btn" style="color:white;" onclick="document.getElementById('${modalId}').remove()">&times;</button>
      </div>
      <div style="padding:24px; background:#f1f5f9; display:flex; justify-content:center;">
        <!-- Simulated smartphone screen -->
        <div style="width:360px; min-height:500px; max-height: 600px; overflow-y:auto; background:white; border:12px solid #0f172a; border-radius:36px; padding:16px; box-shadow:0 15px 30px rgba(0,0,0,0.15);">
          <!-- Top notch -->
          <div style="width:110px; height:18px; background:#0f172a; border-radius:0 0 12px 12px; margin:-16px auto 16px auto;"></div>
          <!-- Title header -->
          <div style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; margin-bottom:12px;">
            <div style="font-size:11px; color:#94a3b8; font-weight:700; text-transform:uppercase;">LMS 수신 메시지</div>
            <div style="font-size:15px; font-weight:800; color:#0f172a; margin-top:2px;">헬스케어 포털</div>
          </div>
          <!-- LMS Text Body -->
          <div style="white-space: pre-wrap; font-family: Pretendard, sans-serif; font-size: 13px; color: #334155; line-height: 1.6; padding: 4px;">${cont.body || '(LMS 발송 내용이 비어 있습니다. 콘텐츠를 등록해 주세요.)'}</div>
        </div>
      </div>
      <div class="drawer-footer">
        <button class="btn btn-secondary" style="width:100%;" onclick="document.getElementById('${modalId}').remove()">미리보기 닫기</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};

// =========================================================================
// VIEW 2: 구독 신청 현황 (Subscribers grid & Actions)
// =========================================================================

// Keep filter states
let filterStartDateFrom = '';
let filterStartDateTo = '';
let filterEndDateFrom = '';
let filterEndDateTo = '';
let filterCategory = 'all';
let filterStatus = 'all';
let filterCriteria = 'custName'; // 'custName', 'progName', 'currTerm'
let filterKeyword = '';

window.renderStatusView = function(container) {
  const subscribers = getSubscribers();
  const categories = getCategories();
  
  // 1. FILTERING LOGIC
  const filtered = subscribers.filter(sub => {
    // 1.1 Start date filter (From-To)
    if (filterStartDateFrom && sub.startDate < filterStartDateFrom) return false;
    if (filterStartDateTo && sub.startDate > filterStartDateTo) return false;

    // 1.2 End date filter (From-To)
    if (filterEndDateFrom) {
      if (!sub.endDate || sub.endDate < filterEndDateFrom) return false;
    }
    if (filterEndDateTo) {
      if (!sub.endDate || sub.endDate > filterEndDateTo) return false;
    }

    // 1.3 Category filter
    if (filterCategory !== 'all' && sub.catId !== filterCategory) return false;

    // 1.4 Status filter
    if (filterStatus !== 'all' && sub.status !== filterStatus) return false;

    // 1.5 Keyword filter (custName, progName, currTerm)
    if (filterKeyword) {
      const targetVal = String(sub[filterCriteria] || '').toLowerCase();
      if (!targetVal.includes(filterKeyword.toLowerCase().trim())) return false;
    }

    return true;
  });

  // Sort by apply date desc
  filtered.sort((a,b) => b.applyDate.localeCompare(a.applyDate));

  // 2. PAGINATION
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / subscriberPageSize) || 1;
  if (subscriberCurrentPage > totalPages) {
    subscriberCurrentPage = totalPages;
  }
  const startIndex = (subscriberCurrentPage - 1) * subscriberPageSize;
  const paginated = filtered.slice(startIndex, startIndex + subscriberPageSize);

  // Table rows HTML
  let rowsHtml = '';
  if (paginated.length === 0) {
    rowsHtml = `<tr><td colspan="10" style="text-align:center; padding:40px; color:#64748b;">조건에 부합하는 구독 신청 현황이 없습니다.</td></tr>`;
  } else {
    paginated.forEach((sub, index) => {
      // Check if status is cancelled
      const isCancelled = sub.status === '구독취소';
      const statusStyle = isCancelled 
        ? 'color: #ef4444; font-weight: 700;' 
        : 'color: #334155; font-weight: 500;';

      // Cancel button visible ONLY when status is "구독중"
      const cancelBtnHtml = sub.status === '구독중' 
        ? `<button class="btn btn-primary btn-sm" onclick="window.cancelUserSubscription('${sub.id}')" style="background-color: #071224; color: #ffffff; border: none; font-size: 13px; padding: 6px 12px; border-radius: 4px; font-weight: 700; cursor: pointer; transition: background 0.15s;" onmouseover="this.style.backgroundColor='#13243d'" onmouseout="this.style.backgroundColor='#071224'">구독취소</button>` 
        : `<span style="color:#94a3b8; font-size:14px;">-</span>`;

      rowsHtml += `
        <tr>
          <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:700; color:#334155;">${sub.clientName}</td>
          <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:600; color:#0f172a;">${sub.custName}</td>
          <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:14px; color:#475569;">${sub.catName}</td>
          <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:600; color:#334155;">${sub.progName}</td>
          <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:14px; text-align:center; color:#64748b;">${sub.applyDate}</td>
          <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:14px; text-align:center; color:#334155; font-weight:500;">${sub.startDate || '-'}</td>
          <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:14px; text-align:center; color:#334155; font-weight:500;">${sub.endDate || '-'}</td>
          <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:14px; text-align:center; font-weight:700; color:#0045c4;">${sub.currTerm}</td>
          <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; text-align:center; font-size:14px; ${statusStyle}">
            ${sub.status}
          </td>
          <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; text-align:center;">
            ${cancelBtnHtml}
          </td>
        </tr>
      `;
    });
  }

  // Categories select dropdown options
  const catOptions = categories.map(cat => `
    <option value="${cat.id}" ${filterCategory === cat.id ? 'selected' : ''}>${cat.name}</option>
  `).join('');

  container.innerHTML = `
    <!-- Header Title -->
    <div class="page-header" style="margin-bottom: 24px;">
      <div>
        <h1 class="page-title">구독 신청 현황</h1>
        <p class="page-subtitle">고객사 임직원이 실제 신청하여 가동 중인 구독 서비스 목록을 통합 조회하고 제어합니다.</p>
      </div>
    </div>

    <!-- Search/Filter Area -->
    <div class="config-card" style="padding: 24px; margin-bottom: 24px;">
      <!-- Grid Filter Fields -->
      <div class="filter-grid">
        <!-- 1. 시작일 range -->
        <div class="filter-item filter-item-half">
          <label class="filter-label">시작일</label>
          <div class="date-range-container">
            <input type="date" id="f-start-date-from" class="form-input" style="padding:8px 12px; font-size:14px; height:40px;" value="${filterStartDateFrom}">
            <span style="color:#94a3b8;">~</span>
            <input type="date" id="f-start-date-to" class="form-input" style="padding:8px 12px; font-size:14px; height:40px;" value="${filterStartDateTo}">
          </div>
        </div>
        
        <!-- 2. 종료일 range -->
        <div class="filter-item filter-item-half">
          <label class="filter-label">종료일</label>
          <div class="date-range-container">
            <input type="date" id="f-end-date-from" class="form-input" style="padding:8px 12px; font-size:14px; height:40px;" value="${filterEndDateFrom}">
            <span style="color:#94a3b8;">~</span>
            <input type="date" id="f-end-date-to" class="form-input" style="padding:8px 12px; font-size:14px; height:40px;" value="${filterEndDateTo}">
          </div>
        </div>

        <!-- 3. 카테고리별 -->
        <div class="filter-item filter-item-quarter">
          <label class="filter-label">카테고리</label>
          <select id="f-category" class="form-select" style="width:100%; min-width:auto; padding:8px 12px; font-size:14px; height:40px;">
            <option value="all" ${filterCategory === 'all' ? 'selected':''}>전체 카테고리</option>
            ${catOptions}
          </select>
        </div>

        <!-- 4. 구독 상태별 -->
        <div class="filter-item filter-item-quarter">
          <label class="filter-label">구독 상태</label>
          <select id="f-status" class="form-select" style="width:100%; min-width:auto; padding:8px 12px; font-size:14px; height:40px;">
            <option value="all" ${filterStatus === 'all' ? 'selected':''}>전체 상태</option>
            <option value="구독중" ${filterStatus === '구독중' ? 'selected':''}>구독중</option>
            <option value="구독취소" ${filterStatus === '구독취소' ? 'selected':''}>구독취소</option>
            <option value="구독완료" ${filterStatus === '구독완료' ? 'selected':''}>구독완료</option>
          </select>
        </div>

        <!-- 5. 특정 검색 기준 + 키워드 -->
        <div class="filter-item filter-item-half">
          <label class="filter-label">검색 조건</label>
          <div style="display:flex; gap:8px;">
            <select id="f-criteria" class="form-select" style="width:130px; min-width:auto; padding:8px 12px; font-size:14px; height:40px;">
              <option value="custName" ${filterCriteria === 'custName' ? 'selected':''}>고객명</option>
              <option value="progName" ${filterCriteria === 'progName' ? 'selected':''}>프로그램명</option>
              <option value="currTerm" ${filterCriteria === 'currTerm' ? 'selected':''}>차수</option>
            </select>
            <input type="text" id="f-keyword" class="form-input" style="padding:8px 12px; font-size:14px; height:40px;" placeholder="검색어를 입력하세요." value="${filterKeyword}" onkeyup="if(event.key==='Enter') window.submitSubscriberFilters()">
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px solid #f1f5f9; padding-top:16px;">
        <button class="btn btn-secondary" onclick="window.resetSubscriberFilters()" style="background:#fff; border:1px solid #cbd5e1; padding:8px 20px; font-size:13px; font-weight:600;">초기화</button>
        <button class="btn btn-primary" onclick="window.submitSubscriberFilters()" style="background:#0045c4; padding:8px 32px; font-size:13px; font-weight:700;">검색 조회</button>
      </div>
    </div>

    <!-- Subscriber Table -->
    <div class="config-card">
      <div class="card-header" style="background:#fff; border-bottom:1px solid #e2e8f0; padding:16px 24px;">
        <h2 class="card-title" style="font-size:15px; font-weight:700;">구독 고객 리스트 (총 ${totalItems}건)</h2>
      </div>
      <div class="card-body" style="padding:0; overflow-x:auto;">
        <table class="data-table" style="width:100%; border-collapse:collapse; white-space:nowrap;">
          <thead>
            <tr>
              <th style="padding:12px 16px; font-size:13px; font-weight:600; color:#475569;">제휴사명</th>
              <th style="padding:12px 16px; font-size:13px; font-weight:600; color:#475569;">고객명</th>
              <th style="padding:12px 16px; font-size:13px; font-weight:600; color:#475569;">카테고리명</th>
              <th style="padding:12px 16px; font-size:13px; font-weight:600; color:#475569;">프로그램명</th>
              <th style="padding:12px 16px; font-size:13px; font-weight:600; color:#475569; text-align:center; width:110px;">신청일</th>
              <th style="padding:12px 16px; font-size:13px; font-weight:600; color:#475569; text-align:center; width:110px;">시작일</th>
              <th style="padding:12px 16px; font-size:13px; font-weight:600; color:#475569; text-align:center; width:110px;">종료일</th>
              <th style="padding:12px 16px; font-size:13px; font-weight:600; color:#475569; text-align:center; width:80px;">현재 차수</th>
              <th style="padding:12px 16px; font-size:13px; font-weight:600; color:#475569; text-align:center; width:100px;">구독상태</th>
              <th style="padding:12px 16px; font-size:13px; font-weight:600; color:#475569; text-align:center; width:100px;">구독취소</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
      
      <!-- Pagination Footer -->
      <div style="padding:16px 24px; background:#fff; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:13px; color:#64748b; font-weight:600;">
          검색결과 ${startIndex + 1} ~ ${Math.min(startIndex + subscriberPageSize, totalItems)}건 (전체 ${totalItems}건)
        </span>
        <div style="display:flex; align-items:center; gap:8px;">
          <!-- Pagination Buttons -->
          <div style="display:inline-flex; border:1px solid #e2e8f0; border-radius:6px; overflow:hidden;">
            <button onclick="window.navigateSubscriberPage(1)" style="padding:6px 12px; background:#fff; border:none; cursor:pointer; font-size:12px; color:#475569;" ${subscriberCurrentPage === 1 ? 'disabled':''}>&laquo;</button>
            <button onclick="window.navigateSubscriberPage(${subscriberCurrentPage - 1})" style="padding:6px 12px; background:#fff; border:none; cursor:pointer; font-size:12px; color:#475569;" ${subscriberCurrentPage === 1 ? 'disabled':''}>&lt;</button>
            
            ${generatePaginationNumbers(totalPages)}
            
            <button onclick="window.navigateSubscriberPage(${subscriberCurrentPage + 1})" style="padding:6px 12px; background:#fff; border:none; cursor:pointer; font-size:12px; color:#475569;" ${subscriberCurrentPage === totalPages ? 'disabled':''}>&gt;</button>
            <button onclick="window.navigateSubscriberPage(${totalPages})" style="padding:6px 12px; background:#fff; border:none; cursor:pointer; font-size:12px; color:#475569;" ${subscriberCurrentPage === totalPages ? 'disabled':''}>&raquo;</button>
          </div>
          <select id="sub-page-size-select" class="form-select" style="min-width:auto; width:120px; padding:6px 12px; font-size:12px;" onchange="window.changeSubscriberPageSize(this.value)">
            <option value="10" ${subscriberPageSize === 10 ? 'selected':''}>10개씩 보기</option>
            <option value="20" ${subscriberPageSize === 20 ? 'selected':''}>20개씩 보기</option>
            <option value="50" ${subscriberPageSize === 50 ? 'selected':''}>50개씩 보기</option>
          </select>
        </div>
      </div>
    </div>
  `;
};

// Generate numbered page buttons
function generatePaginationNumbers(totalPages) {
  let html = '';
  const maxButtons = 5;
  let startPage = Math.max(1, subscriberCurrentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }
  
  for (let p = startPage; p <= endPage; p++) {
    const isActive = p === subscriberCurrentPage;
    html += `
      <button onclick="window.navigateSubscriberPage(${p})" 
              style="padding:6px 12px; background:${isActive ? '#0045c4':'#fff'}; border:none; font-weight:${isActive ? '700':'500'}; color:${isActive ? '#fff':'#475569'}; cursor:pointer; font-size:12px;">
        ${p}
      </button>
    `;
  }
  return html;
}

window.navigateSubscriberPage = function(pageNum) {
  subscriberCurrentPage = pageNum;
  window.navigateToSubscriptionView('status');
};

window.changeSubscriberPageSize = function(size) {
  subscriberPageSize = parseInt(size) || 10;
  subscriberCurrentPage = 1;
  window.navigateToSubscriptionView('status');
};

// Bind filter submissions
window.submitSubscriberFilters = function() {
  filterStartDateFrom = document.getElementById('f-start-date-from').value;
  filterStartDateTo = document.getElementById('f-start-date-to').value;
  filterEndDateFrom = document.getElementById('f-end-date-from').value;
  filterEndDateTo = document.getElementById('f-end-date-to').value;
  filterCategory = document.getElementById('f-category').value;
  filterStatus = document.getElementById('f-status').value;
  filterCriteria = document.getElementById('f-criteria').value;
  filterKeyword = document.getElementById('f-keyword').value;
  
  subscriberCurrentPage = 1;
  window.navigateToSubscriptionView('status');
};

window.resetSubscriberFilters = function() {
  filterStartDateFrom = '';
  filterStartDateTo = '';
  filterEndDateFrom = '';
  filterEndDateTo = '';
  filterCategory = 'all';
  filterStatus = 'all';
  filterCriteria = 'custName';
  filterKeyword = '';
  
  subscriberCurrentPage = 1;
  window.navigateToSubscriptionView('status');
};

// Cancel subscription Action (for "구독중" users ONLY)
window.cancelUserSubscription = function(subscrId) {
  if (confirm("정말로 해당 고객의 구독을 취소 처리하시겠습니까?\n취소 시 상태가 '구독취소'로 전환되며 발송 일정이 중단됩니다.")) {
    const subscribers = getSubscribers();
    const idx = subscribers.findIndex(s => s.id === subscrId);
    if (idx !== -1) {
      subscribers[idx].status = '구독취소';
      // Set end date to today
      subscribers[idx].endDate = new Date().toISOString().split('T')[0];
      saveSubscribers(subscribers);
      
      window.showToast(`${subscribers[idx].custName} 님의 구독이 정상 취소되었습니다.`);
      window.navigateToSubscriptionView('status');
    }
  }
};

// =========================================================================
// VIEW 3: 이용 통계 (Usage Dashboard with dynamic CSS visual elements)
// =========================================================================

window.renderStatsView = function(container) {
  const subscribers = getSubscribers();
  const categories = getCategories();
  const programs = getPrograms();

  // 1. Calculate general numbers
  const totalSubs = subscribers.length;
  const activeSubs = subscribers.filter(s => s.status === '구독중').length;
  const cancelSubs = subscribers.filter(s => s.status === '구독취소').length;
  const compSubs = subscribers.filter(s => s.status === '구독완료').length;
  
  // Formula: Active subscriptions ratio
  const activeRatio = totalSubs > 0 ? Math.round((activeSubs / totalSubs) * 100) : 0;
  
  // Seeding access rates or open rates (Simulated average)
  const averageOpenRate = 78.5; // percent

  // 2. Category-wise distribution for Donut Chart
  const categoryStats = categories.map((cat, index) => {
    const catSubs = subscribers.filter(s => s.catId === cat.id);
    const percentage = totalSubs > 0 ? Math.round((catSubs.length / totalSubs) * 100) : 0;
    
    // Aesthetic Harmonious HSL colors for charts
    const colors = [
      '#0045c4', // deep blue
      '#10b981', // emerald green
      '#f59e0b', // amber yellow
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#06b6d4'  // cyan
    ];

    return {
      name: cat.name,
      count: catSubs.length,
      percentage: percentage,
      color: colors[index % colors.length]
    };
  });

  // Sort categories by volume desc
  categoryStats.sort((a,b) => b.count - a.count);

  // Donut SVG conic-gradient math helper
  // CSS conic-gradient needs accumulating percentages: "color1 0% 15%, color2 15% 45%, ..."
  let accumPercent = 0;
  const gradientSlices = categoryStats.map(c => {
    const start = accumPercent;
    accumPercent += c.percentage;
    return `${c.color} ${start}% ${accumPercent}%`;
  });
  
  // Fallback for empty
  const donutGradientStyle = totalSubs > 0 
    ? `background: conic-gradient(${gradientSlices.join(', ')})`
    : `background: #cbd5e1`;

  // 3. Program-wise ranking top 5 for horizontal bar rank chart
  const programStats = programs.map(prog => {
    const progSubs = subscribers.filter(s => s.progId === prog.id);
    return {
      name: prog.name,
      catName: categories.find(c => c.id === prog.catId)?.name || '',
      count: progSubs.length
    };
  });
  
  programStats.sort((a,b) => b.count - a.count);
  const topPrograms = programStats.slice(0, 5);
  const maxProgCount = topPrograms.length > 0 ? topPrograms[0].count : 1;

  // Generate top program bars HTML
  let barChartHtml = '';
  topPrograms.forEach((p, idx) => {
    const percentWidth = Math.round((p.count / maxProgCount) * 100);
    // HSL rotating color gradients for bars
    const barColor = `linear-gradient(90deg, hsl(${210 + (idx * 25)}, 85%, 55%) 0%, hsl(${210 + (idx * 25)}, 85%, 65%) 100%)`;
    
    barChartHtml += `
      <div class="bar-rank-item">
        <div class="bar-rank-header">
          <span>${idx + 1}. [${p.catName}] ${p.name}</span>
          <span>${p.count}명</span>
        </div>
        <div class="bar-rank-track">
          <div class="bar-rank-fill" style="width: ${percentWidth}%; background: ${barColor};"></div>
        </div>
      </div>
    `;
  });

  container.innerHTML = `
    <!-- Header -->
    <div class="page-header" style="margin-bottom: 24px;">
      <div>
        <h1 class="page-title">이용 통계</h1>
        <p class="page-subtitle">카테고리 및 구독 프로그램별 신청 비중과 주요 이용 지표를 시각화하여 모니터링합니다.</p>
      </div>
    </div>

    <!-- Stat Dashboard Card Grid -->
    <div class="stat-card-grid">
      <div class="stat-card">
        <div class="stat-card-label">누적 신청 건수</div>
        <div class="stat-card-val">${totalSubs}건</div>
        <div class="stat-card-desc">포털 론칭 이래 전체 누적 수</div>
      </div>
      <div class="stat-card color-2">
        <div class="stat-card-label">현재 구독중 고객</div>
        <div class="stat-card-val" style="color:#10b981;">${activeSubs}명</div>
        <div class="stat-card-desc">실시간 발송 대상자 비율: ${activeRatio}%</div>
      </div>
      <div class="stat-card color-3">
        <div class="stat-card-label">해지 / 완료 고객</div>
        <div class="stat-card-val" style="color:#f59e0b;">${cancelSubs + compSubs}명</div>
        <div class="stat-card-desc">취소: ${cancelSubs}명 | 정상완료: ${compSubs}명</div>
      </div>
      <div class="stat-card color-4">
        <div class="stat-card-label">평균 콘텐츠 오픈율</div>
        <div class="stat-card-val" style="color:#8b5cf6;">${averageOpenRate}%</div>
        <div class="stat-card-desc">모바일 푸시 링크 클릭율 기준</div>
      </div>
    </div>

    <!-- Charts Container Grid -->
    <div class="stats-visual-grid">
      <!-- 1. Donut Chart: Category Share -->
      <div class="config-card">
        <div class="card-header" style="background:#fff; border-bottom:1px solid #e2e8f0; padding:16px 24px;">
          <h3 class="card-title" style="font-size:14px; font-weight:700;">카테고리별 구독 비중</h3>
        </div>
        <div class="card-body">
          <div class="donut-chart-container">
            <!-- Conic gradient circle donut representation -->
            <div class="donut-graphic" style="${donutGradientStyle}; border-radius:50%; box-shadow:inset 0 0 10px rgba(0,0,0,0.05);">
              <!-- Center hollow cover for donut effect -->
              <div style="position:absolute; inset:35px; background:white; border-radius:50%; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:center;">
                <div class="donut-text">
                  <div class="donut-text-val">${activeSubs}명</div>
                  <div class="donut-text-lbl">구독중</div>
                </div>
              </div>
            </div>
            
            <!-- Legends list -->
            <div class="chart-legend">
              ${categoryStats.map(c => `
                <div class="legend-item">
                  <div class="legend-label-group">
                    <span class="legend-color-dot" style="background: ${c.color}"></span>
                    <span>${c.name}</span>
                  </div>
                  <span class="legend-val">${c.count}명 (${c.percentage}%)</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Bar Chart: TOP 5 Programs -->
      <div class="config-card">
        <div class="card-header" style="background:#fff; border-bottom:1px solid #e2e8f0; padding:16px 24px;">
          <h3 class="card-title" style="font-size:14px; font-weight:700;">인기 구독 프로그램 TOP 5</h3>
        </div>
        <div class="card-body" style="padding: 24px 32px;">
          <div class="bar-rank-list">
            ${barChartHtml}
          </div>
        </div>
      </div>
    </div>

    <!-- Trend line graphic SVG representing daily tracking stats -->
    <div class="config-card" style="margin-bottom:32px;">
      <div class="card-header" style="background:#fff; border-bottom:1px solid #e2e8f0; padding:16px 24px;">
        <h3 class="card-title" style="font-size:14px; font-weight:700;">최근 7일간 일별 구독 신청 추이 (시뮬레이터)</h3>
      </div>
      <div class="card-body" style="padding:24px 32px; display:flex; flex-direction:column; gap:20px; align-items:center;">
        <!-- Clean vector svg line graph -->
        <svg viewBox="0 0 800 200" style="width:100%; max-height:160px; background:#fafafa; border-radius:8px; border:1px solid #e2e8f0;">
          <!-- Grid lines -->
          <line x1="50" y1="30" x2="750" y2="30" stroke="#e2e8f0" stroke-dasharray="4" />
          <line x1="50" y1="80" x2="750" y2="80" stroke="#e2e8f0" stroke-dasharray="4" />
          <line x1="50" y1="130" x2="750" y2="130" stroke="#e2e8f0" stroke-dasharray="4" />
          <line x1="50" y1="170" x2="750" y2="170" stroke="#cbd5e1" stroke-width="1.5" />
          
          <!-- Access data points: (Day, Subscribes) -->
          <!-- 5/29: 12, 5/30: 15, 5/31: 9, 6/01: 22, 6/02: 18, 6/03: 25, 6/04: 31 -->
          <!-- Coordinates mapping: X (100, 200, 300, 400, 500, 600, 700) -->
          <!-- Coordinates mapping: Y (calculated: 170 - (Val * 4)) -->
          <path d="M 100 122 L 200 110 L 300 134 L 400 82 L 500 98 L 600 70 L 700 46" 
                fill="none" stroke="url(#line-gradient)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                
          <!-- Glow area under line -->
          <path d="M 100 122 L 200 110 L 300 134 L 400 82 L 500 98 L 600 70 L 700 46 L 700 170 L 100 170 Z" 
                fill="url(#area-gradient)" opacity="0.15" />

          <!-- Circular Dots -->
          <circle cx="100" cy="122" r="6" fill="#0045c4" stroke="#fff" stroke-width="2" />
          <circle cx="200" cy="110" r="6" fill="#0045c4" stroke="#fff" stroke-width="2" />
          <circle cx="300" cy="134" r="6" fill="#0045c4" stroke="#fff" stroke-width="2" />
          <circle cx="400" cy="82" r="6" fill="#0045c4" stroke="#fff" stroke-width="2" />
          <circle cx="500" cy="98" r="6" fill="#0045c4" stroke="#fff" stroke-width="2" />
          <circle cx="600" cy="70" r="6" fill="#0045c4" stroke="#fff" stroke-width="2" />
          <circle cx="700" cy="46" r="6" fill="#0045c4" stroke="#fff" stroke-width="2" />

          <!-- Y Axis Labels -->
          <text x="25" y="35" fill="#94a3b8" font-size="10" font-weight="700">30건</text>
          <text x="25" y="85" fill="#94a3b8" font-size="10" font-weight="700">20건</text>
          <text x="25" y="135" fill="#94a3b8" font-size="10" font-weight="700">10건</text>
          
          <!-- X Axis Labels -->
          <text x="100" y="188" fill="#64748b" font-size="11" font-weight="600" text-anchor="middle">05/29 (금)</text>
          <text x="200" y="188" fill="#64748b" font-size="11" font-weight="600" text-anchor="middle">05/30 (토)</text>
          <text x="300" y="188" fill="#64748b" font-size="11" font-weight="600" text-anchor="middle">05/31 (일)</text>
          <text x="400" y="188" fill="#64748b" font-size="11" font-weight="600" text-anchor="middle">06/01 (월)</text>
          <text x="500" y="188" fill="#64748b" font-size="11" font-weight="600" text-anchor="middle">06/02 (화)</text>
          <text x="600" y="188" fill="#64748b" font-size="11" font-weight="600" text-anchor="middle">06/03 (수)</text>
          <text x="700" y="188" fill="#0045c4" font-size="11" font-weight="700" text-anchor="middle">06/04 (오늘)</text>
          
          <!-- Gradients definition -->
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#0052e0" />
              <stop offset="100%" stop-color="#00d2ff" />
            </linearGradient>
            <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0052e0" />
              <stop offset="100%" stop-color="#fff" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  `;
};
