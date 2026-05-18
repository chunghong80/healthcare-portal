// Data Models (Default/Fallback)
const clientConfigs = {
  kyobo: { id: "kyobo", name: "교보생명", serviceName: "교보생명", csNumber: "1588-1001", clientLink: "", dasomLink: "", themeColor: "#2F4A9A", themeColorRgb: "47, 74, 154", logoText: "교보생명 헬스케어",
    tiers: [{ id: "basic", label: "기본플랜", priority: 1 }, { id: "vip", label: "VIP플랜", priority: 2 }],
    heroText: { default: { title: "건강한 내일을 위한 첫걸음", subtitle: "교보생명 전용 헬스케어 포털에서 제공하는 프리미엄 건강 관리 서비스를 지금 바로 경험해보세요.", csNumber: "1588-1001" } }, menus: [] },
  dasom: { id: "dasom", name: "교보다솜케어", serviceName: "교보다솜케어", csNumber: "1588-1002", clientLink: "", dasomLink: "", themeColor: "#17B890", themeColorRgb: "23, 184, 144", logoText: "교보다솜케어",
    tiers: [{ id: "standard", label: "통합등급", priority: 1 }, { id: "premium", label: "우대등급", priority: 2 }],
    heroText: { default: { title: "더 건강한 삶, 교보다솜케어", subtitle: "고객님의 평생 건강 파트너, 교보다솜케어가 프리미엄 서비스를 시작합니다.", csNumber: "1588-1002" } }, menus: [] },
  other: { id: "other", name: "A기업(제휴사)", serviceName: "A기업", csNumber: "1588-1003", clientLink: "", dasomLink: "", themeColor: "#5b21b6", themeColorRgb: "91, 33, 182", logoText: "A기업 복지라운지",
    tiers: [{ id: "emp1", label: "임직원 1등급", priority: 1 }, { id: "exec", label: "임원급", priority: 2 }],
    heroText: { default: { title: "임직원 복지 라운지", subtitle: "A기업 임직원만을 위한 프리미엄 건강 관리 혜택을 만나보세요.", csNumber: "1588-1003" } }, menus: [] }
};
��(제휴사)", serviceName: "A기업", csNumber: "1588-1003", clientLink: "", dasomLink: "", themeColor: "#5b21b6", themeColorRgb: "91, 33, 182", logoText: "A기업 복지라운지", heroText: { title: "임직원 복지 라운지", subtitle: "A기업 임직원만을 위한 프리미엄 건강 관리 혜택을 만나보세요." }, menus: [] }
};

const defaultMenus = [
  { id: "serviceGuide", label: "서비스 안내", isVisible: true, children: [] },
  { id: "healthConsulting", label: "건강상담", isVisible: true, children: [
    { id: "consultApply", label: "건강상담 신청", isVisible: true, children: [] },
    { id: "consultHistory", label: "전화상담 및 온라인 문의 이력", isVisible: true, children: [] }
  ] },
  { id: "hospitalGuide", label: "병원안내", isVisible: true, children: [
    { id: "search", label: "병원검색", isVisible: true, children: [] },
    { id: "expert", label: "명의안내", isVisible: true, children: [] }
  ] },
  { id: "medicalAppt", label: "진료예약", isVisible: true, children: [] },
  { id: "checkupAppt", label: "건강검진 예약", isVisible: true, children: [] },
  { id: "healthInfo", label: "건강정보", isVisible: true, children: [] },
  { id: "psyCare", label: "심리케어", isVisible: true, children: [] }
];

const BRAND_DEFAULTS = {
  themeColor: "#17B890",
  themeColorRgb: "23, 184, 144",
  menuTextColor: "#5f6368",
  providerName: "교보다솜케어",
  providerLink: "#",
  logoImage: null
};

const mockUsers = {
  user_multi: { name: "홍길동", clients: ["kyobo", "dasom", "other"], tiers: { kyobo: ["basic", "vip"], dasom: ["standard"], other: ["emp1"] } },
  user_single_dasom: { name: "이다솜", clients: ["dasom"], tiers: { dasom: ["premium"] } },
  user_single_other: { name: "김제휴", clients: ["other"], tiers: { other: ["exec"] } }
};

let state = { currentUser: null, activeClient: null, route: window.location.hash || '#/' };

function loadSavedConfigs() {
  const savedData = localStorage.getItem('hc_portal_data');
  let parsed = null;
  if (savedData) {
    try { parsed = JSON.parse(savedData); } catch(e) {}
  }

  Object.keys(clientConfigs).forEach(id => {
    const client = clientConfigs[id];
    if (parsed && parsed[id]) {
      client.menus = parsed[id].menus || client.menus;
      client.heroText = parsed[id].heroText || client.heroText;
      client.serviceName = parsed[id].serviceName || client.serviceName;
      client.csNumber = parsed[id].csNumber || client.csNumber;
      client.logoImage = parsed[id].logoImage || client.logoImage || BRAND_DEFAULTS.logoImage;
      client.themeColor = parsed[id].themeColor || client.themeColor || BRAND_DEFAULTS.themeColor;
      client.menuTextColor = parsed[id].menuTextColor || client.menuTextColor || BRAND_DEFAULTS.menuTextColor;
      client.name = parsed[id].name || client.name;
      client.clientLink = parsed[id].clientLink || client.clientLink;
      client.providerName = parsed[id].providerName || client.providerName || BRAND_DEFAULTS.providerName;
      client.providerLink = parsed[id].providerLink || client.providerLink || BRAND_DEFAULTS.providerLink;
      
      // Calculate themeColorRgb if not present
      if (client.themeColor) {
        const hex = client.themeColor.replace('#', '');
        const r = parseInt(hex.substring(0,2), 16);
        const g = parseInt(hex.substring(2,4), 16);
        const b = parseInt(hex.substring(4,6), 16);
        client.themeColorRgb = `${r}, ${g}, ${b}`;
      }
    }
    
    // Merge tiers from saved data
    if (parsed && parsed[id]?.tiers) client.tiers = parsed[id].tiers;
    // Migrate flat heroText → per-tier
    if (client.heroText && client.heroText.title !== undefined) {
      client.heroText = { default: { title: client.heroText.title, subtitle: client.heroText.subtitle, csNumber: client.csNumber || '' } };
    }
    if (parsed && parsed[id]?.heroText && parsed[id].heroText.default !== undefined) {
      client.heroText = parsed[id].heroText;
    }
    // Fallback to default menus if empty
    if (!client.menus || client.menus.length === 0) {
      client.menus = JSON.parse(JSON.stringify(defaultMenus));
    } else {
      // Reorder: ensure serviceGuide is first if it exists
      const sgIndex = client.menus.findIndex(m => m.id === 'serviceGuide');
      if (sgIndex > 0) {
        const sg = client.menus.splice(sgIndex, 1)[0];
        client.menus.unshift(sg);
      }
    }
  });
}
loadSavedConfigs();

// Get current user's tier IDs for the active client
function getCurrentTierIds() {
  if (!state.currentUser || !state.activeClient) return [];
  const urlParams = new URLSearchParams(window.location.search);
  const urlTier = urlParams.get('tier');
  if (urlTier) return [urlTier];
  return state.currentUser.tiers?.[state.activeClient.id] || [];
}

// Resolve the best heroText for the current user's tiers
function resolveHeroText(client) {
  const userTierIds = getCurrentTierIds();
  const tiers = client.tiers || [];
  // Find the highest-priority tier the user has that has a custom heroText
  const matchedTiers = tiers
    .filter(t => userTierIds.includes(t.id) && client.heroText[t.id])
    .sort((a, b) => b.priority - a.priority);
  if (matchedTiers.length > 0) return client.heroText[matchedTiers[0].id];
  return client.heroText?.default || { title: '', subtitle: '', csNumber: client.csNumber || '' };
}

// Filter menus by the user's tiers (allowedTiers: [] means all)
function filterMenusByTier(menus) {
  const userTierIds = getCurrentTierIds();
  return menus
    .filter(m => !m.allowedTiers || m.allowedTiers.length === 0 || m.allowedTiers.some(t => userTierIds.includes(t)))
    .map(m => ({ ...m, children: m.children ? filterMenusByTier(m.children) : [] }));
}

const app = document.getElementById('app');

function render() {
  app.innerHTML = '';
  if (state.route === '#/' || state.route === '') renderLogin();
  else if (state.route === '#/select') renderClientSelect();
  else if (state.route.startsWith('#/portal/')) {
    const parts = state.route.split('/');
    const clientId = parts[2];
    state.activeMenuId = parts[3] || null;
    state.activeSubId = parts[4] || null;
    state.activeSubSubId = parts[5] || null;
    if(clientConfigs[clientId]) {
      state.activeClient = clientConfigs[clientId];
      applyTheme(state.activeClient);
      renderPortal();
    } else { window.location.hash = '#/'; }
  }
}

window.addEventListener('hashchange', () => { state.route = window.location.hash; render(); });

window.login = function(userId) {
  state.currentUser = mockUsers[userId];
  const clients = state.currentUser.clients;
  if (clients.length > 1) window.location.hash = '#/select';
  else window.location.hash = `#/portal/${clients[0]}`;
};

window.logout = function() {
  state.currentUser = null; state.activeClient = null;
  window.location.hash = '#/';
  document.documentElement.style.removeProperty('--theme-color');
  document.documentElement.style.removeProperty('--theme-color-rgb');
};

window.toggleConsultingForm = function() {
  const form = document.getElementById('consulting-form-area');
  if (form) {
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    if (form.style.display === 'block') {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

window.toggleMedicalApptForm = function() {
  const form = document.getElementById('medical-appt-form-area');
  if (form) {
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    if (form.style.display === 'block') {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

window.submitConsulting = function() {
  const type = document.querySelector('input[name="consult-type"]:checked').value;
  const memo = document.getElementById('consult-memo').value;
  
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentHour = now.getHours();

  if (type === 'phone') {
    const date = document.getElementById('consult-date').value;
    const time = document.getElementById('consult-time').value;
    
    if (!date || !memo) {
      alert('상담 신청 일자와 요청 내용을 입력해주세요.');
      return;
    }

    // Past date validation
    if (date < todayStr) {
      showModal('신청 불가', '과거 날짜로는 상담을 신청하실 수 없습니다. 오늘 이후의 날짜를 선택해주세요.');
      return;
    }

    // Today but past time validation
    if (date === todayStr && time !== 'anytime') {
      const selectedHour = parseInt(time.split(':')[0]);
      if (selectedHour <= currentHour) {
        showModal('신청 불가', '현재 시간 이전으로는 상담을 신청하실 수 없습니다. 현재 시간 이후의 상담 시간을 선택해주세요.');
        return;
      }
    }

    const inquiries = JSON.parse(localStorage.getItem('hc_inquiries') || '[]');
    const newEntry = {
      id: Date.now(),
      clientId: state.activeClient.id,
      userId: state.currentUser.id,
      userName: state.currentUser.name,
      type: type,
      title: '전화 건강상담 신청',
      content: memo,
      date: todayStr,
      status: '접수완료',
      answer: null,
      answerDate: null,
      consultDate: date,
      consultTime: time
    };
    
    inquiries.push(newEntry);
    localStorage.setItem('hc_inquiries', JSON.stringify(inquiries));
    
    showToast('전화상담신청이 등록되었습니다.');
    setTimeout(() => {
      window.location.hash = `#/portal/${state.activeClient.id}/healthConsulting/consultHistory`;
    }, 1500);
  } else {
    if (!memo) {
      alert('문의 내용을 입력해주세요.');
      return;
    }
    const inquiries = JSON.parse(localStorage.getItem('hc_inquiries') || '[]');
    const newEntry = {
      id: Date.now(),
      clientId: state.activeClient.id,
      userId: state.currentUser.id,
      userName: state.currentUser.name,
      type: type,
      title: '온라인 건강 문의',
      content: memo,
      date: todayStr,
      status: '접수완료',
      answer: null,
      answerDate: null
    };
    inquiries.push(newEntry);
    localStorage.setItem('hc_inquiries', JSON.stringify(inquiries));
    
    alert('문의가 등록되었습니다.\n문의 등록 후 3일 이내에 답변이 등록됩니다.');
    window.location.hash = `#/portal/${state.activeClient.id}/healthConsulting/consultHistory`;
  }
};

window.showModal = function(title, message) {
  let modal = document.getElementById('custom-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'custom-modal';
    modal.className = 'modal-overlay';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:10000; opacity:0; transition:opacity 0.3s ease;';
    document.body.appendChild(modal);
  }
  
  modal.innerHTML = `
    <div style="background:white; padding:32px; border-radius:16px; max-width:400px; width:90%; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1); transform:translateY(20px); transition:transform 0.3s ease;">
      <h3 style="margin-top:0; margin-bottom:16px; font-size:20px; color:#ef4444;">${title}</h3>
      <p style="color:#475569; line-height:1.6; margin-bottom:24px;">${message}</p>
      <button onclick="closeModal()" class="auth-btn btn-primary" style="margin-bottom:0;">확인</button>
    </div>
  `;
  
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.style.opacity = '1';
    modal.querySelector('div').style.transform = 'translateY(0)';
  }, 10);
};

window.closeModal = function() {
  const modal = document.getElementById('custom-modal');
  if (modal) {
    modal.style.opacity = '0';
    modal.querySelector('div').style.transform = 'translateY(20px)';
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
};

window.updateConsultType = function(type) {
  const phoneFields = document.getElementById('phone-only-fields');
  const guidanceBox = document.getElementById('consult-guidance-box');
  const dateInput = document.getElementById('consult-date');
  
  if (type === 'phone') {
    phoneFields.style.display = 'grid';
    dateInput.required = true;
    if (guidanceBox) {
      guidanceBox.innerHTML = `
        <i>상담 가능 시간은 평일 오전 9시 ~ 오후 6시입니다.</i>
        <i>상담을 원하시는 날짜와 시간대를 선택하시고, 상담받고 싶은 내용을 간단히 작성해 주세요.</i>
        <i>남겨주신 내용을 확인한 후 간호사가 직접 전화드리겠습니다.</i>
      `;
    }
  } else {
    phoneFields.style.display = 'none';
    dateInput.required = false;
    if (guidanceBox) {
      guidanceBox.innerHTML = `
        <i>상담받고 싶은 내용을 작성해 주세요.</i>
        <i>접수된 문의는 확인 후 영업일 기준 3일 이내에 온라인으로 답변드리겠습니다.</i>
      `;
    }
  }
};

window.showToast = function(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast-container';
    document.body.appendChild(toast);
  }
  
  toast.innerHTML = `
    <svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
    <span>${message}</span>
  `;
  
  setTimeout(() => toast.classList.add('active'), 100);
  setTimeout(() => toast.classList.remove('active'), 3000);
};

window.toggleInquiryForm = function() {
  const form = document.getElementById('inquiry-form-area');
  if (form) {
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    if (form.style.display === 'block') {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

window.submitInquiry = function() {
  const title = document.getElementById('inquiry-title').value;
  const content = document.getElementById('inquiry-content').value;
  
  if (!title || !content) {
    alert('제목과 문의 내용을 모두 입력해주세요.');
    return;
  }
  
  const inquiries = JSON.parse(localStorage.getItem('hc_inquiries') || '[]');
  const newInquiry = {
    id: Date.now(),
    clientId: state.activeClient.id,
    userId: state.currentUser.id,
    userName: state.currentUser.name,
    title: title,
    content: content,
    date: new Date().toISOString().split('T')[0],
    status: '대기',
    answer: null,
    answerDate: null
  };
  
  inquiries.push(newInquiry);
  localStorage.setItem('hc_inquiries', JSON.stringify(inquiries));
  
  alert('문의가 정상적으로 등록되었습니다.\n영업일 기준 3일 이내에 답변해 드리겠습니다.');
  window.location.hash = `#/portal/${state.activeClient.id}/onlineInquiry`;
  render();
};

function applyTheme(client) {
  document.documentElement.style.setProperty('--theme-color', client.themeColor);
  document.documentElement.style.setProperty('--theme-color-rgb', client.themeColorRgb);
  
  if (client.menuTextColor) {
    document.documentElement.style.setProperty('--menu-text', client.menuTextColor);
    document.documentElement.style.setProperty('--secondary-color', client.menuTextColor);
  }
}

function renderLogin() {
  app.innerHTML = `
    <div class="auth-wrapper fade-in">
      <div class="auth-card">
        <h1>통합 헬스케어 포털</h1>
        <p>당신의 건강을 위한 프리미엄 케어 서비스</p>
        <button class="auth-btn btn-primary" onclick="login('user_multi')">포털 로그인 (홍길동 - 다중기업)</button>
        <button class="auth-btn btn-secondary" onclick="login('user_single_dasom')">포털 로그인 (이다솜 - 단일기업)</button>
      </div>
    </div>
  `;
}

function renderClientSelect() {
  if (!state.currentUser) { window.location.hash = '#/'; return; }
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
        <div class="client-select-grid">${clientCards}</div>
        <button class="logout-btn" style="margin-top: 32px;" onclick="logout()">돌아가기 (로그아웃)</button>
      </div>
    </div>
  `;
}

function renderPortal() {
  const client = state.activeClient;
  const menus = client.menus || [];
  // Filter only top-level menus that are set to visible
  const visibleMenus = menus.filter(m => m.isVisible !== false);

  // GNB HTML (1st depth only)
  const gnbHtml = visibleMenus.map(m => `
    <a href="#/portal/${client.id}/${m.id}" class="${state.activeMenuId === m.id ? 'active' : ''}">${m.label}</a>
  `).join('');

  // Mega Menu Panel (shows all children levels)
  const megaMenuHtml = `
    <div class="mega-menu-panel" id="mega-menu">
      <div class="container mega-menu-content">
        ${visibleMenus.map(m => `
          <div class="mega-column">
            <div class="mega-title" onclick="window.location.hash='#/portal/${client.id}/${m.id}'" style="cursor:pointer;">${m.label}</div>
            <ul class="mega-list">
              ${(m.children || []).filter(c => c.isVisible !== false).map(c2 => `
                <li class="mega-item">
                  <a href="#/portal/${client.id}/${m.id}/${c2.id}">${c2.label}</a>
                  <ul class="mega-list-inner">
                    ${(c2.children || []).filter(c3 => c3.isVisible !== false).map(c3 => `
                      <li class="mega-item depth-3"><a href="#/portal/${client.id}/${m.id}/${c2.id}/${c3.id}">${c3.label}</a></li>
                    `).join('')}
                  </ul>
                </li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  let contentHtml = '';
  if (!state.activeMenuId) {
    // DASHBOARD VIEW
    contentHtml = `
      <div class="hero-section">
        <div class="hero-content">
          <h2 style="margin-top:0;">${client.heroText.title}</h2>
          <p>${client.heroText.subtitle}</p>
        </div>
      </div>
      <div class="quick-menu-grid">
         <div class="quick-card" onclick="window.location.hash='#/portal/${client.id}/hospitalGuide'">
            <h3>병원 찾기</h3>
            <p>내 주변 제휴 병원 및 명의 검색</p>
         </div>
         <div class="quick-card" onclick="window.location.hash='#/portal/${client.id}/healthConsulting'">
            <h3>상담 신청</h3>
            <p>의료진과 1:1 건강 상담</p>
         </div>
         <div class="quick-card" onclick="window.location.hash='#/portal/${client.id}/checkupAppt'">
            <h3>검진 예약</h3>
            <p>프리미엄 가족 건강검진 예약</p>
         </div>
      </div>
    `;
  } else {
    // SUBPAGE VIEW
    // Sidebar: Show all top-level menus, but only expand the active one
    let sidebarHtml = visibleMenus.map(m => {
      const isActive = state.activeMenuId === m.id;
      return `
        <li class="sidebar-group ${isActive ? 'active' : ''}">
          <div class="sidebar-group-header" onclick="window.location.hash='#/portal/${client.id}/${m.id}'">
            ${m.label}
          </div>
          ${isActive && m.children && m.children.length > 0 ? `
            <ul class="sidebar-sub-list">
              ${m.children.filter(c => c.isVisible !== false).map(sm => `
                <li class="sidebar-sub-item ${state.activeSubId === sm.id ? 'active' : ''}">
                  <a href="#/portal/${client.id}/${m.id}/${sm.id}">${sm.label}</a>
                  ${state.activeSubId === sm.id && sm.children && sm.children.length > 0 ? `
                    <ul class="sidebar-inner-list">
                      ${sm.children.filter(c => c.isVisible !== false).map(c3 => `
                        <li class="sidebar-inner-item ${state.activeSubSubId === c3.id ? 'active' : ''}">
                          <a href="#/portal/${client.id}/${m.id}/${sm.id}/${c3.id}">${c3.label}</a>
                        </li>
                      `).join('')}
                    </ul>
                  ` : ''}
                </li>
              `).join('')}
            </ul>
          ` : ''}
        </li>
      `;
    }).join('');

    // Content Logic
    const activeMenu = visibleMenus.find(m => m.id === state.activeMenuId);
    const activeSub = activeMenu?.children?.find(c => c.id === state.activeSubId);
    const activeSubSub = activeSub?.children?.find(c => c.id === state.activeSubSubId);
    const pageTitle = activeSubSub?.label || activeSub?.label || activeMenu?.label;
    let detailContentHtml = `
       <p style="color:#475569; line-height:1.8; font-size:16px;">
          고객님을 위한 맞춤형 헬스케어 서비스를 제공합니다. <br/>
          현재 선택하신 메뉴에 대한 상세 정보를 이 영역에서 확인하실 수 있습니다.
       </p>
       <div style="margin-top:40px; padding:30px; background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">
          <h4 style="margin-bottom:12px; color:#1e293b;">안내 사항</h4>
          <p style="font-size:14px; color:#64748b;">좌측의 전체 메뉴 트리를 통해 다른 서비스로 간편하게 이동하실 수 있습니다. 활성화된 메뉴는 자동으로 펼쳐져 현재 위치를 직관적으로 보여줍니다.</p>
       </div>
    `;

    const isConsultingGroup = state.activeMenuId === 'healthConsulting' || activeMenu?.id === 'healthConsulting' || pageTitle.includes('상담');
    const isHistoryPage = state.activeSubId === 'consultHistory' || activeSub?.id === 'consultHistory' || pageTitle.includes('이력') || pageTitle.includes('내역');
    const isHospitalGuideGroup = state.activeMenuId === 'hospitalGuide' || activeMenu?.id === 'hospitalGuide' || pageTitle.includes('병원안내');
    const isMedicalApptGroup = state.activeMenuId === 'medicalAppt' || activeMenu?.id === 'medicalAppt' || pageTitle.includes('진료예약');

    if (isConsultingGroup) {
      if (isHistoryPage) {
        const allInquiries = JSON.parse(localStorage.getItem('hc_inquiries') || '[]');
        const myInquiries = allInquiries.filter(iq => iq.userId === state.currentUser.id && iq.clientId === client.id).reverse();

        detailContentHtml = `
          <div class="inquiry-notice" style="padding:20px; background:rgba(var(--theme-color-rgb), 0.05); border-radius:12px; margin-bottom:32px; border-left:4px solid var(--theme-color);">
            <p style="color:#1e293b; font-weight:700; font-size:16px; margin-bottom:4px;">📋 나의 상담/문의 이력</p>
            <p style="color:#64748b; font-size:14px;">고객님께서 신청하신 전화상담 및 온라인 문의 이력입니다. <br/>로그인하신 계정으로 등록된 모든 이력을 확인하실 수 있습니다.</p>
          </div>
          
          <div class="history-list-container">
            <div class="history-header">
              <div>문의유형</div>
              <div>등록일</div>
              <div style="text-align:left; padding-left:20px;">내용</div>
              <div>상담희망일자</div>
              <div>상담희망시간</div>
              <div>상담상태</div>
            </div>
            
            ${myInquiries.length === 0 ? `
              <div style="padding:60px; text-align:center; color:#94a3b8; border-bottom:1px solid #e2e8f0;">신청하신 상담 및 문의 내역이 없습니다.</div>
            ` : myInquiries.map(item => {
              const statusClass = item.status === '완료' || item.status === '답변완료' ? 'status-complete' : 
                                item.status === '취소' ? 'status-cancel' : 'status-request';
              const statusLabel = item.status === '완료' || item.status === '답변완료' ? '완료' : 
                                item.status === '취소' ? '취소' : '신청';
              
              return `
                <div class="history-row" onclick="this.classList.toggle('expanded')">
                  <div class="history-row-main">
                    <div><span style="color:${item.type === 'phone' ? '#2F4A9A' : '#17B890'}; font-weight:600;">${item.type === 'phone' ? '전화상담' : '온라인문의'}</span></div>
                    <div>${item.date}</div>
                    <div class="history-row-content">${item.content}</div>
                    <div>${item.consultDate || '-'}</div>
                    <div>${item.consultTime === 'anytime' ? '전일(상시)' : (item.consultTime || '-')}</div>
                    <div><span class="history-status-badge ${statusClass}">${statusLabel}</span></div>
                  </div>
                  <div class="history-detail-area">
                    <div class="history-detail-q">
                      <p style="font-weight:700; margin-bottom:8px;">Q. 상담 및 문의내용</p>
                      <p style="white-space: pre-wrap;">${item.content}</p>
                    </div>
                    ${item.answer ? `
                      <div class="history-detail-a">
                        <div class="answer-label">답변내용</div>
                        <div class="answer-text">${item.answer}</div>
                        ${item.answerDate ? `<p style="margin-top:8px; font-size:12px; color:#94a3b8;">답변일시: ${item.answerDate}</p>` : ''}
                      </div>
                    ` : `
                      <div style="padding:16px; background:#fff; border-radius:8px; border:1px dashed #cbd5e1; color:#94a3b8; font-size:13px; text-align:center;">
                        담당 전문가가 상담 내용을 확인하고 있습니다.
                      </div>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      } else {
        // Default to Application Form (if subId is 'consultApply' or null)
        detailContentHtml = `
          <div class="consulting-info" style="margin-bottom:40px;">
            <img src="./images/health_counseling.png" class="content-hero-img" alt="건강상담" onerror="this.src='https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200'">
            <p style="color:#334155; line-height:1.8; font-size:17px; margin-bottom:24px;">
              건강에 대한 궁금증부터 생활습관 관리까지,<br/>
              다양한 분야의 전문가가 함께하는 맞춤형 건강상담 서비스를 제공합니다.
            </p>
            <p style="color:#64748b; line-height:1.8; font-size:15px; margin-bottom:32px; padding:24px; background:#f1f5f9; border-radius:8px;">
              간호사, 영양사, 운동처방사는 물론<br/>
              내과·소아과·피부과·안과·치과·신경외과·산부인과 등 각 분야 전문의 상담을 통해<br/>
              일상 속 건강 고민과 생활관리 방향을 편리하게 상담받으실 수 있습니다.
            </p>
            <button class="auth-btn btn-primary" style="padding:16px 40px; font-size:18px; width:auto;" onclick="toggleConsultingForm()">건강상담 신청하기</button>
          </div>
          
          <div id="consulting-form-area" style="display:none; margin-top:40px; padding-top:40px; border-top:1px solid #e2e8f0; animation: fadeIn 0.4s ease;">
            <h3 style="margin-bottom:24px; font-size:20px; color:#1e293b;">상담 신청 정보 입력</h3>
            
            <div class="consult-type-selector">
              <label class="custom-radio">
                <input type="radio" name="consult-type" value="phone" checked onclick="updateConsultType('phone')">
                <span class="radio-mark"></span>
                전화상담신청
              </label>
              <label class="custom-radio">
                <input type="radio" name="consult-type" value="online" onclick="updateConsultType('online')">
                <span class="radio-mark"></span>
                온라인 문의 신청
              </label>
            </div>

            <div id="consult-guidance-box" class="consulting-guide-box">
              <i>상담 가능 시간은 평일 오전 9시 ~ 오후 6시입니다.</i>
              <i>상담을 원하시는 날짜와 시간대를 선택하시고, 상담받고 싶은 내용을 간단히 작성해 주세요.</i>
              <i>남겨주신 내용을 확인한 후 간호사가 직접 전화드리겠습니다.</i>
            </div>

            <div id="phone-only-fields" style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:20px;">
              <div class="form-group">
                <label class="form-label" style="display:block; margin-bottom:8px; font-weight:600;">상담 희망 일자</label>
                <input type="date" id="consult-date" class="form-input" min="${new Date().toISOString().split('T')[0]}" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px;">
              </div>
              <div class="form-group">
                <label class="form-label" style="display:block; margin-bottom:8px; font-weight:600;">상담 희망 시간</label>
                <select id="consult-time" class="form-input" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px; background:white;">
                  <option value="anytime">전일 (언제든 통화 가능)</option>
                  ${Array.from({length: 9}, (_, i) => 9 + i).map(h => `<option value="${h}:00">${h < 10 ? '0'+h : h}:00</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="form-group" style="margin-bottom:24px;">
              <label class="form-label" style="display:block; margin-bottom:8px; font-weight:600;">상담 및 문의 내용</label>
              <textarea id="consult-memo" class="form-input" placeholder="상담 및 문의하실 내용을 간단히 적어주세요." style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px; min-height:120px; resize:vertical;"></textarea>
            </div>

            <button class="auth-btn btn-primary" style="width:100%; padding:16px;" onclick="submitConsulting()">신청 완료</button>
          </div>
        `;
      }
    } else if (isHospitalGuideGroup) {
      const hgMenu = visibleMenus.find(m => m.id === 'hospitalGuide' || m.label.includes('병원안내'));
      const searchSubId = hgMenu?.children?.find(c => c.label.includes('검색'))?.id || 'search';
      const expertSubId = hgMenu?.children?.find(c => c.label.includes('명의'))?.id || 'expert';
      const hgMenuId = hgMenu ? hgMenu.id : 'hospitalGuide';

      if (!state.activeSubId) {
        detailContentHtml = `
        <div class="hg-hero">
          <div class="hg-hero-content">
            <div class="hg-hero-badge">병원안내 서비스</div>
            <div class="hg-hero-title">건강 고민이 있을 때,<br/>적절한 병원과 의료진을 안내해드립니다.</div>
            <div class="hg-hero-subtitle">직접 검색으로 찾거나, 전문가 상담을 통해 나에게 맞는 병원과<br/>전문의료진 정보를 안내받으세요.</div>
          </div>
          <div style="flex-shrink:0;">
            <img src="./images/hospital_guide_hero.png" alt="병원안내" style="max-height:220px;" onerror="this.style.display='none'">
          </div>
        </div>

        <div class="hg-how-to-title">이렇게 이용하실 수 있습니다</div>

        <div class="hg-cards-wrapper">
          <div class="hg-card hg-card-blue">
            <div class="hg-card-header">
              <span class="hg-card-num-blue">01</span>
              <div class="hg-card-title">원하는 병원을 직접 찾아보세요</div>
            </div>
            <div class="hg-card-desc">지역, 진료과목, 병원 규모 등 다양한 조건으로<br/>의료기관 정보를 검색할 수 있습니다.</div>
            <div class="hg-card-icons">
              <div class="hg-icon-item">
                <div class="hg-icon-circle blue">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path><circle cx="12" cy="9" r="2.5"></circle></svg>
                </div>
                <div class="hg-icon-label">지역별 검색</div>
              </div>
              <div class="hg-icon-item">
                <div class="hg-icon-circle blue">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                </div>
                <div class="hg-icon-label">진료과목 검색</div>
              </div>
              <div class="hg-icon-item">
                <div class="hg-icon-circle blue">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 9h6M9 13h6M9 17h6"></path></svg>
                </div>
                <div class="hg-icon-label">병원 규모 검색</div>
              </div>
            </div>
            <button class="hg-card-btn blue" onclick="window.location.hash='#/portal/${client.id}/${hgMenuId}/${searchSubId}'">병원검색 바로가기 &gt;</button>
          </div>

          <div class="hg-or-badge">OR</div>

          <div class="hg-card hg-card-green">
            <div class="hg-card-header">
              <span class="hg-card-num-green">02</span>
              <div class="hg-card-title">전문가 상담을 통해 안내받으세요</div>
            </div>
            <div class="hg-card-desc">건강 상태와 증상에 따라 간호사가 적절한<br/>병원과 전문의료진을 안내해드립니다.</div>
            <div class="hg-card-icons">
              <div class="hg-icon-item">
                <div class="hg-icon-circle green">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path></svg>
                </div>
                <div class="hg-icon-label">전화상담 신청</div>
              </div>
              <div class="hg-icon-arrow">▶</div>
              <div class="hg-icon-item">
                <div class="hg-icon-circle green">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path></svg>
                </div>
                <div class="hg-icon-label">간호사 상담</div>
              </div>
              <div class="hg-icon-arrow">▶</div>
              <div class="hg-icon-item">
                <div class="hg-icon-circle green">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg>
                </div>
                <div class="hg-icon-label">증상 및 상태 확인</div>
              </div>
              <div class="hg-icon-arrow">▶</div>
              <div class="hg-icon-item">
                <div class="hg-icon-circle green">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <div class="hg-icon-label">병원 및<br/>의료진 안내</div>
              </div>
            </div>
            <button class="hg-card-btn green" onclick="window.location.hash='#/portal/${client.id}/${hgMenuId}/${expertSubId}'">상담 신청하기 &gt;</button>
          </div>
        </div>

        <div class="hg-footer-note">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4M12 16h.01"></path></svg>
          <div>본 서비스는 의료행위가 아닌 의료정보 안내 및 진료 연계 지원 서비스입니다.<br/>최종 진단 및 치료 여부는 의료진의 판단에 따라 결정됩니다.</div>
        </div>
      `;
      }
    } else if (isMedicalApptGroup) {
      if (!state.activeSubId) {
        detailContentHtml = `
          <div class="hg-hero" style="background:#f0f7ff; align-items:center; border-radius:12px; margin-bottom:40px; padding:40px; display:flex;">
            <div class="hg-hero-content" style="flex:1;">
              <div class="hg-hero-badge" style="display:inline-flex; align-items:center; gap:6px; color:#2F4A9A; font-weight:700; background:white; padding:6px 12px; border-radius:20px; font-size:14px; margin-bottom:16px; border:1px solid #bfdbfe;">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> 진료예약 서비스
              </div>
              <div class="hg-hero-title" style="font-size:32px; font-weight:800; color:#1e293b; margin-bottom:16px; line-height:1.4;">
                꼭 필요한 진료,<br/><span style="color:#2F4A9A;">정확한 의료진</span>에게 빠르게 연결해드립니다
              </div>
              <div class="hg-hero-subtitle" style="font-size:16px; color:#475569; line-height:1.6;">
                건강검진 결과 또는 증상에 따라 상급병원 진료가 필요한 경우,<br/>간호사가 상태 및 소견을 검토하여 적절한 진료과와<br/>전문의료진의 진료예약을 지원해드립니다.
              </div>
            </div>
            <div style="flex-shrink:0;">
              <img src="./images/medical_appt_hero.png" alt="진료예약" style="max-height:260px;" onerror="this.style.display='none'">
            </div>
          </div>

          <div class="hg-how-to-title" style="text-align:center; font-size:20px; font-weight:700; color:#1e293b; margin:48px 0 24px; position:relative;">
            <span style="color:#2F4A9A;">•</span> 이런 경우 사용하세요 <span style="color:#2F4A9A;">•</span>
          </div>

          <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:16px; margin-bottom:48px;">
            <div style="background:white; border:1px solid #e2e8f0; border-radius:12px; padding:24px 16px; text-align:center;">
              <div style="width:64px; height:64px; margin:0 auto 16px; background:#f1f5f9; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#2F4A9A;">
                <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
              </div>
              <div style="font-weight:600; color:#334155; font-size:15px; line-height:1.4;">건강검진에서<br/>정밀검사 권고를<br/>받은 경우</div>
            </div>
            <div style="background:white; border:1px solid #e2e8f0; border-radius:12px; padding:24px 16px; text-align:center;">
              <div style="width:64px; height:64px; margin:0 auto 16px; background:#f1f5f9; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#2F4A9A;">
                <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"></path></svg>
              </div>
              <div style="font-weight:600; color:#334155; font-size:15px; line-height:1.4;">여러 병원을 다녀도<br/>원인을 찾기 어려운<br/>경우</div>
            </div>
            <div style="background:white; border:1px solid #e2e8f0; border-radius:12px; padding:24px 16px; text-align:center;">
              <div style="width:64px; height:64px; margin:0 auto 16px; background:#f1f5f9; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#2F4A9A;">
                <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <div style="font-weight:600; color:#334155; font-size:15px; line-height:1.4;">상급병원 진료가<br/>필요한 경우</div>
            </div>
            <div style="background:white; border:1px solid #e2e8f0; border-radius:12px; padding:24px 16px; text-align:center;">
              <div style="width:64px; height:64px; margin:0 auto 16px; background:#f1f5f9; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#2F4A9A;">
                <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
              </div>
              <div style="font-weight:600; color:#334155; font-size:15px; line-height:1.4;">어떤 진료과를<br/>가야 할지<br/>어려운 경우</div>
            </div>
          </div>

          <div class="hg-how-to-title" style="text-align:center; font-size:20px; font-weight:700; color:#1e293b; margin:48px 0 24px;">
            <span style="color:#2F4A9A;">•</span> 서비스 진행 절차 <span style="color:#2F4A9A;">•</span>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:48px; position:relative;">
            <div style="position:absolute; top:32px; left:10%; right:10%; height:2px; background:repeating-linear-gradient(90deg, #cbd5e1, #cbd5e1 4px, transparent 4px, transparent 8px); z-index:0;"></div>
            
            <div style="text-align:center; flex:1; position:relative; z-index:1; padding:0 10px;">
              <div style="width:64px; height:64px; margin:0 auto 16px; background:white; border-radius:50%; border:2px solid #2F4A9A; display:flex; align-items:center; justify-content:center; color:#2F4A9A; position:relative;">
                <span style="position:absolute; top:-10px; left:-10px; background:#2F4A9A; color:white; width:24px; height:24px; border-radius:50%; font-size:13px; font-weight:bold; display:flex; align-items:center; justify-content:center;">1</span>
                <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              </div>
              <div style="font-weight:700; color:#1e293b; font-size:15px; margin-bottom:8px;">상담 신청</div>
              <div style="font-size:13px; color:#64748b;">전화로 상담을<br/>신청합니다.</div>
            </div>

            <div style="text-align:center; flex:1; position:relative; z-index:1; padding:0 10px;">
              <div style="width:64px; height:64px; margin:0 auto 16px; background:white; border-radius:50%; border:2px solid #2F4A9A; display:flex; align-items:center; justify-content:center; color:#2F4A9A; position:relative;">
                <span style="position:absolute; top:-10px; left:-10px; background:#2F4A9A; color:white; width:24px; height:24px; border-radius:50%; font-size:13px; font-weight:bold; display:flex; align-items:center; justify-content:center;">2</span>
                <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
              </div>
              <div style="font-weight:700; color:#1e293b; font-size:15px; margin-bottom:8px;">건강검진 결과 및<br/>증상 확인</div>
              <div style="font-size:13px; color:#64748b;">검사 결과 및 증상<br/>정보를 전달해 주세요.</div>
            </div>

            <div style="text-align:center; flex:1; position:relative; z-index:1; padding:0 10px;">
              <div style="width:64px; height:64px; margin:0 auto 16px; background:white; border-radius:50%; border:2px solid #2F4A9A; display:flex; align-items:center; justify-content:center; color:#2F4A9A; position:relative;">
                <span style="position:absolute; top:-10px; left:-10px; background:#2F4A9A; color:white; width:24px; height:24px; border-radius:50%; font-size:13px; font-weight:bold; display:flex; align-items:center; justify-content:center;">3</span>
                <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <div style="font-weight:700; color:#1e293b; font-size:15px; margin-bottom:8px;">간호사 상담 진행</div>
              <div style="font-size:13px; color:#64748b;">간호사가 상태 및 소견을<br/>꼼꼼히 확인합니다.</div>
            </div>

            <div style="text-align:center; flex:1; position:relative; z-index:1; padding:0 10px;">
              <div style="width:64px; height:64px; margin:0 auto 16px; background:white; border-radius:50%; border:2px solid #2F4A9A; display:flex; align-items:center; justify-content:center; color:#2F4A9A; position:relative;">
                <span style="position:absolute; top:-10px; left:-10px; background:#2F4A9A; color:white; width:24px; height:24px; border-radius:50%; font-size:13px; font-weight:bold; display:flex; align-items:center; justify-content:center;">4</span>
                <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6M9 16h6"></path></svg>
              </div>
              <div style="font-weight:700; color:#1e293b; font-size:15px; margin-bottom:8px;">적절한 진료과 및<br/>의료진 검토</div>
              <div style="font-size:13px; color:#64748b;">가장 적합한 진료과와<br/>전문의료진을 검토합니다.</div>
            </div>

            <div style="text-align:center; flex:1; position:relative; z-index:1; padding:0 10px;">
              <div style="width:64px; height:64px; margin:0 auto 16px; background:white; border-radius:50%; border:2px solid #2F4A9A; display:flex; align-items:center; justify-content:center; color:#2F4A9A; position:relative;">
                <span style="position:absolute; top:-10px; left:-10px; background:#2F4A9A; color:white; width:24px; height:24px; border-radius:50%; font-size:13px; font-weight:bold; display:flex; align-items:center; justify-content:center;">5</span>
                <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <div style="font-weight:700; color:#1e293b; font-size:15px; margin-bottom:8px;">상급병원<br/>진료예약 지원</div>
              <div style="font-size:13px; color:#64748b;">원하는 일정에 맞춰<br/>진료예약을 도와드립니다.</div>
            </div>
          </div>

          <button class="auth-btn btn-primary" style="width:100%; padding:20px; font-size:20px; font-weight:700; display:flex; align-items:center; justify-content:center; gap:12px; border-radius:12px; background:#2563eb; color:white; border:none; cursor:pointer;" onclick="toggleMedicalApptForm()">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path></svg>
            <div style="text-align:left;">
              상담 신청하기 &gt;
              <div style="font-size:14px; font-weight:400; opacity:0.9; margin-top:4px;">전문 간호사가 친절하게 상담해드립니다.</div>
            </div>
          </button>

          <div class="hg-footer-note" style="margin-top:24px; padding:16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; display:flex; align-items:center; gap:12px; color:#64748b; font-size:13px;">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4M12 16h.01"></path></svg>
            <div>본 서비스는 의료행위가 아닌 의료정보 안내 및 진료 연계 지원 서비스입니다.<br/>최종 진단 및 치료 여부는 의료진의 판단에 따라 결정됩니다.</div>
          </div>

          <div id="medical-appt-form-area" style="display:none; margin-top:40px; padding-top:40px; border-top:1px solid #e2e8f0; animation: fadeIn 0.4s ease;">
            <h3 style="margin-bottom:24px; font-size:20px; color:#1e293b;">진료예약 상담 신청 정보 입력</h3>
            
            <!-- Hidden radio button to force 'phone' type for existing submitConsulting logic -->
            <input type="radio" name="consult-type" value="phone" checked style="display:none;">

            <div id="consult-guidance-box" class="consulting-guide-box">
              <i>상담 가능 시간은 평일 오전 9시 ~ 오후 6시입니다.</i>
              <i>상담을 원하시는 날짜와 시간대를 선택하시고, 현재 겪고 계신 증상이나 상담받고 싶은 내용을 간단히 작성해 주세요.</i>
              <i>남겨주신 내용을 확인한 후 간호사가 직접 전화드리겠습니다.</i>
            </div>

            <div id="phone-only-fields" style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:20px;">
              <div class="form-group">
                <label class="form-label" style="display:block; margin-bottom:8px; font-weight:600;">상담 희망 일자</label>
                <input type="date" id="consult-date" class="form-input" min="${new Date().toISOString().split('T')[0]}" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px;">
              </div>
              <div class="form-group">
                <label class="form-label" style="display:block; margin-bottom:8px; font-weight:600;">상담 희망 시간</label>
                <select id="consult-time" class="form-input" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px; background:white;">
                  <option value="anytime">전일 (언제든 통화 가능)</option>
                  ${Array.from({length: 9}, (_, i) => 9 + i).map(h => `<option value="${h}:00">${h < 10 ? '0'+h : h}:00</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="form-group" style="margin-bottom:24px;">
              <label class="form-label" style="display:block; margin-bottom:8px; font-weight:600;">증상 및 상담 내용</label>
              <textarea id="consult-memo" class="form-input" placeholder="현재 겪고 계신 증상이나 검진 결과 등 상담하실 내용을 간단히 적어주세요." style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px; min-height:120px; resize:vertical;"></textarea>
            </div>

            <button class="auth-btn btn-primary" style="width:100%; padding:16px;" onclick="submitConsulting()">신청 완료</button>
          </div>
        `;
      }
    }

    contentHtml = `
      <div class="subpage-wrapper">
        <aside class="sidebar">
          <ul class="sidebar-tree">${sidebarHtml}</ul>
        </aside>
        <section class="subpage-content fade-in">
          <div class="breadcrumb-nav" style="margin-bottom:20px; font-size:14px; color:#64748b;">
            홈 &nbsp;/&nbsp; ${visibleMenus.find(m => m.id === state.activeMenuId)?.label}
            ${state.activeSubId ? `&nbsp;/&nbsp; ${visibleMenus.find(m => m.id === state.activeMenuId)?.children.find(c => c.id === state.activeSubId)?.label}` : ''}
          </div>
          <div class="guide-content-box">
             <h2 style="font-size:26px; font-weight:700; color:#1e293b;">${pageTitle}</h2>
             <div style="width:40px; height:4px; background:var(--theme-color); margin:20px 0 30px;"></div>
             ${detailContentHtml}
          </div>
        </section>
      </div>
    `;
  }

  app.innerHTML = `
    <div style="display:flex; flex-direction:column; min-height:100vh;">
      <header class="header">
        <div class="container header-content">
          <div class="logo-area" onclick="window.location.hash='#/portal/${client.id}'">
            ${client.logoImage ? 
              `<img src="${client.logoImage}" style="height:32px; width:auto; object-fit:contain;">` : 
              `<svg style="width:28px; height:28px; color:var(--theme-color);" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
            }
          </div>
          <nav class="gnb" onmouseenter="document.getElementById('mega-menu').classList.add('active')" onmouseleave="document.getElementById('mega-menu').classList.remove('active')">
            ${gnbHtml}
          </nav>
          ${megaMenuHtml}
          <div class="user-profile">
            <span style="font-weight: 500;">${state.currentUser.name} 님</span>
            <button class="logout-btn" onclick="logout()">로그아웃</button>
          </div>
        </div>
      </header>
      <main class="dashboard container" style="flex:1;">${contentHtml}</main>
      <footer class="footer">
        <div class="container footer-content" style="text-align:center;">
          <div class="cs-info" style="margin-bottom:32px;">
            <span class="cs-title">${client.serviceName} 고객센터</span>
            <span class="cs-number">${client.csNumber}</span>
          </div>
          
          <div class="footer-nav" style="padding:16px 0; margin-bottom:24px;">
            <a href="${client.clientLink || '#'}" target="_blank" style="color:#1e293b; text-decoration:none; font-weight:600; margin:0 12px;">${client.name}</a>
            <span style="color:#cbd5e1;">|</span>
            <a href="${client.providerLink || '#'}" target="_blank" style="color:#1e293b; text-decoration:none; font-weight:600; margin:0 12px;">${client.providerName || '교보다솜케어'}</a>
            <span style="color:#cbd5e1;">|</span>
            <a href="#" style="color:#1e293b; text-decoration:none; font-weight:600; margin:0 12px;">개인정보처리방침</a>
            <span style="color:#cbd5e1;">|</span>
            <a href="#" style="color:#1e293b; text-decoration:none; font-weight:600; margin:0 12px;">이용약관</a>
          </div>
          
          <div class="footer-disclaimer" style="color:#64748b; font-size:14px; line-height:1.6; margin-bottom:16px;">
            본 서비스는 ${client.name}와(과) 제휴한 ${client.providerName || '교보다솜케어'}에서 제공합니다.
          </div>
          
          <div class="footer-copyright" style="font-size:12px; color:#94a3b8;">
            © ${client.providerName || '교보다솜케어'}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  `;
}

render();
