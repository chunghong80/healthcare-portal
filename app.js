// Data Models
const clientConfigs = {
  kyobo: {
    id: "kyobo",
    name: "교보생명",
    serviceName: "교보생명",
    csNumber: "1588-1001",
    clientLink: "",
    dasomLink: "",
    themeColor: "#2F4A9A",
    themeColorRgb: "47, 74, 154",
    logoText: "교보생명 헬스케어",
    heroText: {
      title: "건강한 내일을 위한 첫걸음",
      subtitle: "교보생명 전용 헬스케어 포털에서 제공하는 프리미엄 건강 관리 서비스를 지금 바로 경험해보세요."
    },
    menuLabels: {
      healthConsulting: "교보 건강상담",
      hospitalGuide: "맞춤 병원안내",
      medicalAppt: "교보 진료예약",
      checkupAppt: "프리미엄 건강검진",
      healthInfo: "건강 매거진",
      psyCare: "마음 힐링케어",
      serviceGuide: "서비스 안내"
    },
    features: {
      showPsyCare: true, // 심리케어 노출
      guideType: "full_catalog"
    }
  },
  dasom: {
    id: "dasom",
    name: "교보다솜케어",
    serviceName: "교보다솜케어",
    csNumber: "1588-1002",
    clientLink: "",
    dasomLink: "",
    themeColor: "#17B890",
    themeColorRgb: "23, 184, 144",
    logoText: "교보다솜케어",
    heroText: {
      title: "더 건강한 삶, 교보다솜케어",
      subtitle: "고객님의 평생 건강 파트너, 교보다솜케어가 프리미엄 서비스를 시작합니다."
    },
    menuLabels: {
      healthConsulting: "건강상담",
      hospitalGuide: "병원안내",
      medicalAppt: "진료예약",
      checkupAppt: "건강검진 우대예약",
      healthInfo: "건강정보",
      psyCare: "심리상담",
      serviceGuide: "서비스 안내"
    },
    features: {
      showPsyCare: false, // 심리케어 미노출
      guideType: "subscribed_only"
    }
  },
  other: {
    id: "other",
    name: "A기업(제휴사)",
    serviceName: "A기업",
    csNumber: "1588-1003",
    clientLink: "",
    dasomLink: "",
    themeColor: "#5b21b6",
    themeColorRgb: "91, 33, 182",
    logoText: "A기업 복지라운지",
    heroText: {
      title: "임직원 복지 라운지",
      subtitle: "A기업 임직원만을 위한 프리미엄 건강 관리 혜택을 만나보세요."
    },
    menuLabels: {
      healthConsulting: "임직원 건강상담",
      hospitalGuide: "제휴 병원안내",
      medicalAppt: "진료예약",
      checkupAppt: "종합건강검진",
      healthInfo: "오피스 헬스매거진",
      psyCare: "마음건강클리닉",
      serviceGuide: "서비스 안내"
    },
    features: {
      showPsyCare: true,
      guideType: "subscribed_only"
    }
  }
};

// Users (Mock Data)
const mockUsers = {
  // 유저 1: 다중 기업 (교보생명 포함) -> 로그인시 고객사 선택창 노출
  user_multi: {
    name: "홍길동",
    clients: ["kyobo", "dasom", "other"],
    tiers: { kyobo: ["기본플랜", "VIP플랜"], dasom: ["통합등급"], other: ["임직원 1등급"] }
  },
  // 유저 2: 교보다솜케어 단일 기업 -> 바로 이동
  user_single_dasom: {
    name: "이다솜",
    clients: ["dasom"],
    tiers: { dasom: ["우대등급"] }
  },
  // 유저 3: 다른 회사 단일 기업
  user_single_other: {
    name: "김제휴",
    clients: ["other"],
    tiers: { other: ["임원급"] }
  }
};

// Application State
let state = {
  currentUser: null,
  activeClient: null,
  route: window.location.hash || '#/'
};

// Load saved config from admin portal if exists
function loadSavedConfigs() {
  const savedData = localStorage.getItem('hc_portal_data');
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      for(let k in parsed) {
        if(clientConfigs[k]) {
          clientConfigs[k].menuLabels = parsed[k].menuLabels || clientConfigs[k].menuLabels;
          clientConfigs[k].heroText = parsed[k].heroText || clientConfigs[k].heroText;
          clientConfigs[k].menuVisibility = parsed[k].menuVisibility || {};
          clientConfigs[k].customMenus = parsed[k].customMenus || {};
          if (parsed[k].serviceName !== undefined) clientConfigs[k].serviceName = parsed[k].serviceName;
          if (parsed[k].csNumber !== undefined) clientConfigs[k].csNumber = parsed[k].csNumber;
          if (parsed[k].clientLink !== undefined) clientConfigs[k].clientLink = parsed[k].clientLink;
          if (parsed[k].dasomLink !== undefined) clientConfigs[k].dasomLink = parsed[k].dasomLink;
        }
      }
    } catch(e) {}
  }
}
loadSavedConfigs();

const app = document.getElementById('app');

function render() {
  app.innerHTML = '';
  
  if (state.route === '#/' || state.route === '') {
    renderLogin();
  } else if (state.route === '#/select') {
    renderClientSelect();
  } else if (state.route.startsWith('#/portal/')) {
    const parts = state.route.split('/');
    const clientId = parts[2];
    state.activeMenuId = parts[3] || null; // ex: healthConsulting
    state.activeSubId = parts[4] || null; // ex: myService
    if(clientConfigs[clientId]) {
      state.activeClient = clientConfigs[clientId];
      applyTheme(state.activeClient);
      renderPortal();
    } else {
      window.location.hash = '#/';
    }
  }
}

// Router Event Listener
window.addEventListener('hashchange', () => {
  state.route = window.location.hash;
  render();
});

// App logic
window.login = function(userId) {
  state.currentUser = mockUsers[userId];
  const clients = state.currentUser.clients;
  
  // 조건 1&2: 복수 고객사이면 무조건 선택화면으로. 단일이면 바로 포털로.
  if (clients.length > 1) {
    window.location.hash = '#/select';
  } else {
    window.location.hash = `#/portal/${clients[0]}`;
  }
};

window.handleSSO = function() {
  // SSO 환경을 모사하여 로그인 (복수 가입자 모사)
  login('user_multi');
};

window.logout = function() {
  state.currentUser = null;
  state.activeClient = null;
  window.location.hash = '#/';
  
  // Remove CSS Custom Properties
  document.documentElement.style.removeProperty('--theme-color');
  document.documentElement.style.removeProperty('--theme-color-rgb');
};

function applyTheme(client) {
  document.documentElement.style.setProperty('--theme-color', client.themeColor);
  document.documentElement.style.setProperty('--theme-color-rgb', client.themeColorRgb);
}

// UI Components
function renderLogin() {
  app.innerHTML = `
    <div class="auth-wrapper fade-in">
      <div class="auth-card">
        <h1>통합 헬스케어 포털</h1>
        <p>당신의 건강을 위한 프리미엄 케어 서비스</p>
        
        <button class="auth-btn btn-primary" onclick="login('user_multi')">
          포털 로그인 (홍길동 - 다중기업)
        </button>
        <button class="auth-btn btn-secondary" onclick="login('user_single_dasom')">
          포털 로그인 (이다솜 - 단일기업)
        </button>
        <div style="margin: 24px 0; border-bottom: 1px solid #e2e8f0; position:relative;">
          <span style="position:absolute; top:-10px; left:50%; transform:translateX(-50%); background:#fff; padding:0 10px; font-size:12px; color:var(--text-secondary);">또는</span>
        </div>
        <button class="auth-btn btn-primary" style="background-color: #17B890; box-shadow: 0 4px 14px rgba(23,184,144,0.4);" onclick="handleSSO()">
          교보다솜케어 홈페이지 연동(SSO) 로그인
        </button>
      </div>
    </div>
  `;
}

function renderClientSelect() {
  if (!state.currentUser) {
    window.location.hash = '#/';
    return;
  }
  
  const clients = state.currentUser.clients.map(id => clientConfigs[id]);
  
  const clientCards = clients.map(client => `
    <div class="client-card" onclick="window.location.hash='#/portal/${client.id}'">
      <div class="client-logo-placeholder" style="background-color: rgba(${client.themeColorRgb}, 0.1); color: ${client.themeColor}; border: 1px solid rgba(${client.themeColorRgb}, 0.2);">
        ${client.name.charAt(0)}
      </div>
      <h3>${client.name}</h3>
      <p style="font-size:13px; color:var(--text-secondary); margin-top:8px;">접속하기 &rarr;</p>
    </div>
  `).join('');

  app.innerHTML = `
    <div class="auth-wrapper fade-in">
      <div class="auth-card" style="max-width: 600px; padding: 48px;">
        <h1 style="font-size: 24px;">접속할 서비스 선택</h1>
        <p>${state.currentUser.name}님은 여러 고객사에 소속되어 있습니다.<br/>이용하실 전용 포털을 선택해주세요.</p>
        
        <div class="client-select-grid">
          ${clientCards}
        </div>
        
        <button class="logout-btn" style="margin-top: 32px;" onclick="logout()">돌아가기 (로그아웃)</button>
      </div>
    </div>
  `;
}

function renderPortal() {
  if (!state.currentUser || !state.activeClient) {
    window.location.hash = '#/';
    return;
  }
  
  const client = state.activeClient;
  const menus = client.menuLabels;
  
  // Feather icons (SVG)
  const icons = {
    healthConsulting: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>',
    hospitalGuide: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>',
    medicalAppt: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>',
    checkupAppt: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
    healthInfo: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>',
    psyCare: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>'
  };

  const vis = client.menuVisibility || {};
  const isVisible = (key, defaultShow = true) => vis[key] !== undefined ? vis[key] : defaultShow;
  
  let gnbHtml = '';
  if(isVisible('serviceGuide')) gnbHtml += `<a href="#/portal/${client.id}/serviceGuide" class="${state.activeMenuId === 'serviceGuide' ? 'active' : ''}" style="font-weight: 700;">${menus.serviceGuide}</a>\n`;
  if(isVisible('healthConsulting')) gnbHtml += `<a href="#/portal/${client.id}/healthConsulting" class="${state.activeMenuId === 'healthConsulting' ? 'active' : ''}">${menus.healthConsulting}</a>\n`;
  if(isVisible('hospitalGuide')) gnbHtml += `<a href="#/portal/${client.id}/hospitalGuide" class="${state.activeMenuId === 'hospitalGuide' ? 'active' : ''}">${menus.hospitalGuide}</a>\n`;
  if(isVisible('medicalAppt')) gnbHtml += `<a href="#/portal/${client.id}/medicalAppt" class="${state.activeMenuId === 'medicalAppt' ? 'active' : ''}">${menus.medicalAppt}</a>\n`;
  if(isVisible('checkupAppt')) gnbHtml += `<a href="#/portal/${client.id}/checkupAppt" class="${state.activeMenuId === 'checkupAppt' ? 'active' : ''}">${menus.checkupAppt}</a>\n`;
  if(isVisible('healthInfo')) gnbHtml += `<a href="#/portal/${client.id}/healthInfo" class="${state.activeMenuId === 'healthInfo' ? 'active' : ''}">${menus.healthInfo}</a>\n`;
  
  if (isVisible('psyCare', client.features ? client.features.showPsyCare : true)) {
    gnbHtml += `<a href="#/portal/${client.id}/psyCare" class="${state.activeMenuId === 'psyCare' ? 'active' : ''}">${menus.psyCare}</a>`;
  }

  // Custom Menus
  const customMenus = client.customMenus || {};
  Object.keys(customMenus).forEach(key => {
    const menu = customMenus[key];
    if (menu.isVisible === false) return;
    
    let displayName = menu.defaultName || '추가 메뉴';
    if (menu.nameType === 'by_tier' && state.currentUser.tiers[client.id]) {
      const userTiers = state.currentUser.tiers[client.id];
      for (const tier of userTiers) {
        if (menu.tierNames && menu.tierNames[tier]) {
          displayName = menu.tierNames[tier];
          break;
        }
      }
    }
    
    gnbHtml += `\n            <a href="#/portal/${client.id}/${key}" class="${state.activeMenuId === key ? 'active' : ''}">${displayName}</a>`;
    menus[key] = displayName;
  });

  let dashboardContent = '';
  if (!state.activeMenuId) {
    // 1) Dashboard Layout (Main)
    dashboardContent = `
      <div class="hero-section">
        <div class="hero-content">
          <h2 style="margin-top:0;">${client.heroText.title}</h2>
          <p>${client.heroText.subtitle}</p>
        </div>
      </div>
      
      <h3 style="margin-bottom: 20px; font-size: 22px; color: var(--text-primary);">많이 신청하는 정보 바로가기</h3>
      <div class="quick-menu-grid">
        <div class="quick-card action-card" onclick="window.location.hash='#/portal/${client.id}/hospitalGuide'">
          <div class="icon-wrapper" style="background:#e0f2fe; color:#0284c7;">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <h3>병원 찾기</h3>
          <p>내 주변 제휴 병원 및 명의를 빠르게 검색하세요</p>
        </div>
        <div class="quick-card action-card" onclick="window.location.hash='#/portal/${client.id}/healthConsulting'">
          <div class="icon-wrapper" style="background:#fce7f3; color:#db2777;">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
          </div>
          <h3>상담 신청하기</h3>
          <p>전문 간호사 및 의료진과 1:1 집중 상담</p>
        </div>
        <div class="quick-card action-card" onclick="window.location.hash='#/portal/${client.id}/checkupAppt'">
          <div class="icon-wrapper" style="background:#dcfce7; color:#16a34a;">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3>건강검진 신청하기</h3>
          <p>우대가 적용된 프리미엄 가족 건강검진 예약</p>
        </div>
      </div>
    `;
  } else {
    // 2) Subpage Layout
    const menuTitle = menus[state.activeMenuId] || "서비스";
    
    let mockTree = [];
    if (state.activeMenuId === 'serviceGuide') {
      mockTree = [
        { id: "myService", name: "내가 가입한 서비스" },
        { id: "allService", name: "전체 서비스" }
      ];
    } else if (state.activeMenuId === 'healthConsulting') {
      mockTree = [
        { id: "phone", name: "1:1 전화 건강상담" }
      ];
    } else if (state.activeMenuId === 'hospitalGuide') {
      mockTree = [
        { id: "search", name: "전국 제휴 병원 찾기" }
      ];
    } else {
      mockTree = [
        { id: "default", name: menuTitle + " 안내" }
      ];
    }
    
    if (!state.activeSubId && mockTree.length > 0) {
      state.activeSubId = mockTree[0].id;
    }
    
    let treeHtml = mockTree.map(item => `
      <li class="tree-item ${state.activeSubId === item.id ? 'active' : ''}">
        <a href="#/portal/${client.id}/${state.activeMenuId}/${item.id}">${item.name}</a>
      </li>
    `).join('');

    let detailContentHtml = '';

    if (state.activeMenuId === 'hospitalGuide') {
      detailContentHtml = `
        <h3 style="font-size:20px; margin-bottom:16px;">병원/의료기관 지역별 검색</h3>
        <p style="color:var(--text-secondary); margin-bottom: 24px;">내 주변의 제휴 병원을 시군구 단위 및 진료과목별로 상세하게 검색할 수 있습니다.</p>
        
        <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:24px; border-radius:12px; display:flex; gap:16px; flex-wrap:wrap; align-items:flex-end;">
          <div style="flex:1; min-width:140px;">
            <label style="display:block; font-size:13px; font-weight:600; margin-bottom:8px;">시/도</label>
            <select class="form-input" style="width:100%;">
              <option>서울특별시</option>
              <option>경기도</option>
              <option>부산광역시</option>
            </select>
          </div>
          <div style="flex:1; min-width:140px;">
            <label style="display:block; font-size:13px; font-weight:600; margin-bottom:8px;">시/군/구</label>
            <select class="form-input" style="width:100%;">
              <option>강남구</option>
              <option>서초구</option>
              <option>송파구</option>
            </select>
          </div>
          <div style="flex:1; min-width:140px;">
            <label style="display:block; font-size:13px; font-weight:600; margin-bottom:8px;">읍/면/동</label>
            <select class="form-input" style="width:100%;">
              <option>전체</option>
              <option>역삼동</option>
              <option>삼성동</option>
            </select>
          </div>
          <div style="flex:1; min-width:140px;">
            <label style="display:block; font-size:13px; font-weight:600; margin-bottom:8px;">진료과목</label>
            <select class="form-input" style="width:100%;">
              <option>전체 진료과목</option>
              <option>내과</option>
              <option>외과</option>
              <option>정형외과</option>
              <option>건강검진센터</option>
            </select>
          </div>
          <div>
            <button style="padding:16px 32px; background:var(--theme-color); color:white; border:none; border-radius:8px; font-weight:600; cursor:pointer; height: 50px;">
              검색
            </button>
          </div>
        </div>
        <div style="margin-top:32px; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
          <div style="padding:48px; text-align:center; color:var(--text-secondary);">
             <svg style="width:48px; height:48px; margin:0 auto 16px; opacity:0.5;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             <p>지역 및 진료과목을 선택하고 검색해주세요.</p>
          </div>
        </div>
      `;
    } else {
      let formIntro = '';
      if (state.activeMenuId === 'healthConsulting') {
         formIntro = `전문 간호사, 의사, 영양사 등과 1:1 전화상담을 하는 서비스입니다.<br/>고객님의 건강 상태와 궁금한 점을 전문가가 친절하게 상담해 드립니다.`;
      } else if (state.activeMenuId === 'serviceGuide') {
         if (state.activeSubId === 'allService') {
            formIntro = `본 고객사에서 제공하는 모든 혜택 등급 카탈로그입니다. 궁금한 서비스 혜택이 있으시면 아래 폼을 통해 서비스 상담 신청을 접수해주세요.`;
         } else {
            formIntro = `고객님께서 현재 가입 및 이용 중이신 서비스 혜택 내역입니다. 아래 폼을 통해 상세 서비스 상담 신청을 접수할 수 있습니다.`;
         }
      } else {
         formIntro = `원하시는 날짜와 시간을 지정하여 편하게 신청을 접수해주세요.<br/>전문 상담원이 확인 후 빠른 시일 내에 연락드리겠습니다.`;
      }

      // 오늘 날짜를 YYYY-MM-DD 포맷으로 추출
      const todayDate = new Date();
      // KST 보정 (UTC + 9시간) 혹은 가장 간편한 방식 ISO string prefix 사용
      const year = todayDate.getFullYear();
      const month = String(todayDate.getMonth() + 1).padStart(2, '0');
      const day = String(todayDate.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;
      
      let timeOptions = '';
      // 업무시간 반영: 17~18시 제거. (9~16까지 반복 -> 마지막 타임 16:00~17:00)
      for(let i=9; i<=16; i++) {
        timeOptions += `<option value="${i}:00">${i}:00 ~ ${i+1}:00</option>`;
      }

      let extraContentBlock = '';
      if (state.activeMenuId === 'serviceGuide') {
          const myTiers = state.currentUser.tiers[client.id] || [];
          if (state.activeSubId === 'allService') {
               const mockAllTiers = ["기본플랜", "프리미엄플랜", "VIP플랜", "시그니처플랜"];
               const tierPills = mockAllTiers.map(t => {
                  const isMine = myTiers.includes(t);
                  return `<div class="tier-pill ${isMine ? 'active' : ''}">${t} ${isMine ? '(가입중)' : ''}</div>`;
               }).join('');
              extraContentBlock = `<div style="background:#f1f5f9; padding:24px; border-radius:12px; margin-bottom:24px;">
                <h4 style="margin-bottom:12px; font-size:15px;">${client.name} 전체 이용안내</h4>
                <div style="display:flex; flex-wrap:wrap; gap:8px;">${tierPills}</div></div>`;
          } else {
              extraContentBlock = `<div style="background:#e0f2fe; color:#0369a1; padding:24px; border-radius:12px; margin-bottom:24px; font-weight:600; font-size:16px;">
                내 가입 등급: &nbsp; <span style="font-size:20px; color:var(--theme-color);">${myTiers.join(', ')}</span></div>`;
          }
      }

      detailContentHtml = `
        <h3 style="font-size:20px; margin-bottom:16px;">${menuTitle} 안내 및 신청</h3>
        <p style="color:var(--text-secondary); line-height:1.8; margin-bottom: 24px;">
          ${formIntro}
        </p>

        ${extraContentBlock}

        <div style="margin-bottom: 24px; display:flex; justify-content:center;">
          <button onclick="toggleApplicationForm()" style="padding:14px 40px; background:var(--theme-color); color:white; border:none; border-radius:8px; font-weight:700; cursor:pointer; font-size:16px; box-shadow:var(--shadow-sm); transition: transform 0.2s ease;">
             서비스 신청하기
          </button>
        </div>
        
        <div id="application-form-container" style="display:none; animation: fadeIn 0.4s ease-out; margin-top:32px;">
          <div class="premium-form-container">
            <div class="premium-form-header">
              <h2 class="form-title">전화상담 신청</h2>
              <p class="form-subtitle">전화상담을 신청하시면 전문 상담원이 배정되어 연락을 드립니다.</p>
            </div>
            
            <div class="premium-form-body">
              <div class="form-row">
                <div class="form-label">상담 구분 <span class="required">*</span></div>
                <div class="form-field">
                  <label class="custom-radio">
                    <input type="radio" name="serviceType" value="service" ${state.activeMenuId !== 'healthConsulting' && state.activeMenuId !== 'medicalAppt' ? 'checked' : ''}>
                    <span class="radio-mark"></span> 서비스상담
                  </label>
                  <label class="custom-radio">
                    <input type="radio" name="serviceType" value="health" ${state.activeMenuId==='healthConsulting' ? 'checked' : ''}>
                    <span class="radio-mark"></span> 건강상담
                  </label>
                  <label class="custom-radio">
                    <input type="radio" name="serviceType" value="medical" ${state.activeMenuId==='medicalAppt' ? 'checked' : ''}>
                    <span class="radio-mark"></span> 진료예약상담
                  </label>
                </div>
              </div>

              <div class="form-row">
                <div class="form-label">상담희망일자 <span class="required">*</span></div>
                <div class="form-field">
                  <label class="custom-radio">
                    <input type="radio" name="reqDate" value="any" checked>
                    <span class="radio-mark"></span> 전일가능
                  </label>
                  <div class="radio-with-input">
                    <label class="custom-radio">
                      <input type="radio" name="reqDate" value="specific">
                      <span class="radio-mark"></span>
                    </label>
                    <input type="date" class="premium-input date-input" value="${todayStr}" min="${todayStr}">
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-label">상담희망시간 <span class="required">*</span></div>
                <div class="form-field">
                  <label class="custom-radio">
                    <input type="radio" name="reqTime" value="any" checked>
                    <span class="radio-mark"></span> 전시간가능
                  </label>
                  <div class="radio-with-input">
                    <label class="custom-radio">
                      <input type="radio" name="reqTime" value="specific">
                      <span class="radio-mark"></span>
                    </label>
                    <select class="premium-input time-select">
                      <option value="">HH시 - HH시</option>
                      ${timeOptions}
                    </select>
                  </div>
                </div>
              </div>

              <div class="form-row" style="flex-direction: column; align-items: flex-start; border-bottom: none; padding-bottom: 0;">
                <div class="form-label" style="width: 100%; margin-bottom: 12px;">서비스신청내용 <span class="required">*</span></div>
                <div class="form-field" style="width: 100%;">
                  <textarea class="premium-textarea" id="inquiryContent" placeholder="신청내용을 입력해주세요. (신청내용이 부적절할 경우 예고없이 삭제될 수 있습니다.)" maxlength="1000" onkeyup="document.getElementById('charCountSpan').innerText = this.value.length"></textarea>
                  <div class="char-count">(<span id="charCountSpan">0</span> 자 입력 / 최대 1000자)</div>
                </div>
              </div>
            </div>

            <div class="premium-form-actions">
              <button class="btn-cancel" onclick="toggleApplicationForm()">취소</button>
              <button class="btn-submit" onclick="submitApplication()">신청</button>
            </div>
          </div>
        </div>
      `;
    }

    dashboardContent = `
      <div class="subpage-wrapper">
        <aside class="sidebar">
          <div class="sidebar-title">${menuTitle}</div>
          <ul class="tree-view">
            ${treeHtml}
          </ul>
        </aside>
        <section class="subpage-content fade-in">
          <h2>${menuTitle} 상세조회</h2>
          <div class="guide-content-box" style="margin-top:24px; padding:40px; background:white; border-radius:12px; box-shadow:var(--shadow-sm); border:1px solid #e2e8f0; min-height:400px;">
            ${detailContentHtml}
          </div>
        </section>
      </div>
    `;
  }

  app.innerHTML = `
    <div class="fade-in" style="display:flex; flex-direction:column; min-height:100vh;">
      <header class="header">
        <div class="container header-content">
          <div class="logo-area" onclick="window.location.hash='#/portal/${client.id}'">
            <svg style="width:28px; height:28px; color:var(--theme-color);" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <div class="dynamic-logo" style="color: var(--theme-color);">${client.logoText}</div>
          </div>
          <nav class="gnb">
            ${gnbHtml}
          </nav>
          <div class="user-profile">
            <div class="avatar" style="background:var(--theme-color);">${state.currentUser.name.charAt(0)}</div>
            <span style="font-weight: 500;">${state.currentUser.name} 님</span>
            <button class="logout-btn" onclick="logout()">로그아웃</button>
          </div>
        </div>
      </header>

      <main class="dashboard container" style="flex:1;">
        ${dashboardContent}
      </main>

      <footer class="footer">
        <div class="container footer-content">
          <div class="cs-info">
            <span class="cs-title">${client.serviceName} 고객센터</span>
            <span class="cs-number">${client.csNumber}</span>
            <span class="cs-time">운영시간: 평일 오전 9시 ~ 오후 6시</span>
          </div>
          <div class="footer-links-row">
            <a href="${client.clientLink || 'javascript:void(0)'}" class="footer-link"${client.clientLink ? ' target="_blank"' : ''}>${client.name}</a>
            <span class="divider"></span>
            <a href="${client.dasomLink || 'javascript:void(0)'}" class="footer-link"${client.dasomLink ? ' target="_blank"' : ''}>교보다솜케어</a>
            <span class="divider"></span>
            <a href="javascript:void(0)" class="footer-link" style="font-weight: 600; color: #4b5563;">개인정보처리방침</a>
            <span class="divider"></span>
            <a href="javascript:void(0)" class="footer-link" style="color: #4b5563;">서비스이용약관</a>
            <span class="divider"></span>
            <a href="javascript:void(0)" class="footer-link" style="color: #4b5563;">고객정보취급방침</a>
          </div>
          <div class="footer-copyright">
            ${client.name}과(와) 제휴한 교보다솜케어가 제공합니다.
          </div>
        </div>
      </footer>
    </div>
  `;
}

window.submitApplication = function() {
  if (!state.currentUser) {
    alert("접근이 만료되었거나 로그아웃 되었습니다. 다시 로그인해 주세요.");
    window.location.hash = '#/';
    return;
  }
  
  alert("신청이 정상적으로 완료되었습니다! 전문가가 확인 후 빠른 시일 내에 연락드리겠습니다.");
  
  const form = document.getElementById('application-form-container');
  if(form) form.style.display = 'none'; // 제출 시 폼 숨김 처리
};

window.toggleApplicationForm = function() {
  const form = document.getElementById('application-form-container');
  if (form) {
    if (form.style.display === 'none') {
      form.style.display = 'block';
    } else {
      form.style.display = 'none';
    }
  }
};

// Initial Boot
render();
