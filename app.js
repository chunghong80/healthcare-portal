// Data Models (Default/Fallback)
const clientConfigs = {
  kyobo: { id: "kyobo", name: "교보생명", serviceName: "교보생명", csNumber: "1588-1001", clientLink: "", dasomLink: "", themeColor: "#2F4A9A", themeColorRgb: "47, 74, 154", logoText: "교보생명 헬스케어", heroText: { title: "건강한 내일을 위한 첫걸음", subtitle: "교보생명 전용 헬스케어 포털에서 제공하는 프리미엄 건강 관리 서비스를 지금 바로 경험해보세요." }, menus: [] },
  dasom: { id: "dasom", name: "교보다솜케어", serviceName: "교보다솜케어", csNumber: "1588-1002", clientLink: "", dasomLink: "", themeColor: "#17B890", themeColorRgb: "23, 184, 144", logoText: "교보다솜케어", heroText: { title: "더 건강한 삶, 교보다솜케어", subtitle: "고객님의 평생 건강 파트너, 교보다솜케어가 프리미엄 서비스를 시작합니다." }, menus: [] },
  other: { id: "other", name: "A기업(제휴사)", serviceName: "A기업", csNumber: "1588-1003", clientLink: "", dasomLink: "", themeColor: "#5b21b6", themeColorRgb: "91, 33, 182", logoText: "A기업 복지라운지", heroText: { title: "임직원 복지 라운지", subtitle: "A기업 임직원만을 위한 프리미엄 건강 관리 혜택을 만나보세요." }, menus: [] }
};

const defaultMenus = [
  { id: "serviceGuide", label: "서비스 안내", isVisible: true, children: [] },
  { id: "healthConsulting", label: "건강상담", isVisible: true, children: [
    { id: "consultApply", label: "건강상담 신청", isVisible: true, children: [] },
    { id: "consultHistory", label: "전화상담 및 온라인 문의 내역", isVisible: true, children: [] }
  ] },
  { id: "hospitalGuide", label: "병원안내", isVisible: true, children: [] },
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
  user_multi: { name: "홍길동", clients: ["kyobo", "dasom", "other"], tiers: { kyobo: ["기본플랜", "VIP플랜"], dasom: ["통합등급"], other: ["임직원 1등급"] } },
  user_single_dasom: { name: "이다솜", clients: ["dasom"], tiers: { dasom: ["우대등급"] } },
  user_single_other: { name: "김제휴", clients: ["other"], tiers: { other: ["임원급"] } }
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

    if (activeMenu?.label?.includes('상담')) {
      if (activeSub?.label?.includes('이력')) {
        const allInquiries = JSON.parse(localStorage.getItem('hc_inquiries') || '[]');
        const myInquiries = allInquiries.filter(iq => iq.userId === state.currentUser.id && iq.clientId === client.id).reverse();

        detailContentHtml = `
          <div class="inquiry-notice" style="padding:20px; background:rgba(var(--theme-color-rgb), 0.05); border-radius:12px; margin-bottom:32px; border-left:4px solid var(--theme-color);">
            <p style="color:#1e293b; font-weight:700; font-size:16px; margin-bottom:4px;">📋 나의 상담/문의 이력</p>
            <p style="color:#64748b; font-size:14px;">고객님께서 신청하신 전화상담 및 온라인 문의 내역입니다. <br/>로그인하신 계정으로 등록된 모든 이력을 확인하실 수 있습니다.</p>
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
            본 서비스는 ${client.name}와 제휴한 ${client.providerName || '교보다솜케어'}에서 제공합니다.
          </div>
          
          <div class="footer-copyright" style="font-size:12px; color:#94a3b8;">
            © ${client.name} & ${client.providerName || 'Kyobo DasomCare'}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  `;
}

render();
