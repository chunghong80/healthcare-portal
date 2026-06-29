/**
 * Unified Admin Management System
 * Consolidates all admin functionalities into a single SPA logic.
 */

// --- Global Defaults ---
const BRAND_DEFAULTS = {
  themeColor: "#17B890",
  themeColorRgb: "23, 184, 144",
  menuTextColor: "#5f6368",
  providerName: "교보다솜케어",
  providerLink: "#",
  logoImage: null
};

// --- Global State ---
let adminClientConfigs = {
  kyobo: { id: "kyobo", name: "교보생명 (kyobo)", serviceName: "교보생명", csNumber: "1588-1001", clientLink: "", dasomLink: "", tiers: ["기본플랜", "VIP플랜"], heroText: { title: "삶을 사랑하는 마음, 건강까지 함께합니다.", subtitle: "든든한 건강 파트너, 교보생명 헬스케어서비스를 지금 이용해 보세요." }, menus: [] },
  dasom: { id: "dasom", name: "교보다솜케어 (dasom)", serviceName: "교보다솜케어", csNumber: "1588-1002", clientLink: "", dasomLink: "", tiers: ["통합등급", "우대등급"], heroText: { title: "더 건강한 삶, 교보다솜케어", subtitle: "고객님의 평생 건강 파트너, 교보다솜케어가 프리미엄 서비스를 시작합니다." }, menus: [] },
  other: { id: "other", name: "A기업 (제휴사)", serviceName: "A기업", csNumber: "1588-1003", clientLink: "", dasomLink: "", tiers: ["임직원 1등급", "임원급"], heroText: { title: "임직원 복지 라운지", subtitle: "A기업 임직원만을 위한 프리미엄 건강 관리 혜택을 만나보세요." }, menus: [] }
};

const defaultMenus = [
  { id: "serviceGuide", defaultLabel: "서비스 안내", label: "서비스 안내", isVisible: true, children: [] },
  { id: "healthConsulting", defaultLabel: "건강상담", label: "건강상담", isVisible: true, children: [
    { id: "consultApply", defaultLabel: "건강상담 신청", label: "건강상담 신청", isVisible: true, children: [] },
    { id: "consultHistory", defaultLabel: "전화상담 및 온라인 문의 이력", label: "전화상담 및 온라인 문의 이력", isVisible: true, children: [] }
  ] },
  { id: "hospitalGuide", defaultLabel: "병원안내", label: "병원안내", isVisible: true, children: [
    { id: "search", defaultLabel: "병원검색", label: "병원검색", isVisible: true, children: [] },
    { id: "expert", defaultLabel: "명의안내", label: "명의안내", isVisible: true, children: [] }
  ] },
  { id: "medicalAppt", defaultLabel: "진료예약", label: "진료예약", isVisible: true, children: [
    { id: "history", defaultLabel: "상담 신청 이력", label: "상담 신청 이력", isVisible: true, children: [] }
  ] },
  { id: "checkupAppt", defaultLabel: "건강검진", label: "건강검진", isVisible: true, children: [
    { id: "checkupPreferred", defaultLabel: "건강검진 우대예약", label: "건강검진 우대예약", isVisible: true, children: [] },
    { id: "checkupHistory", defaultLabel: "건강검진 신청이력", label: "건강검진 신청이력", isVisible: true, children: [] }
  ] },
  { id: "healthInfo", defaultLabel: "건강정보", label: "건강정보", isVisible: true, children: [
    { id: "categoryInfo", defaultLabel: "분야별 건강정보", label: "분야별 건강정보", isVisible: true, children: [] },
    { id: "contentSubscribe", defaultLabel: "건강콘텐츠 구독", label: "건강콘텐츠 구독", isVisible: true, children: [] },
    { id: "psyColumn", defaultLabel: "심리칼럼", label: "심리칼럼", isVisible: true, children: [] },
    { id: "selfDiagnosis", defaultLabel: "자가진단", label: "자가진단", isVisible: true, children: [] },
    { id: "healthNews", defaultLabel: "건강뉴스", label: "건강뉴스", isVisible: true, children: [] }
  ] },
  { id: "psyCare", defaultLabel: "마음 힐링케어", label: "마음 힐링케어", isVisible: true, children: [
    { id: "asmrVideo", defaultLabel: "힐링 ASMR 영상", label: "힐링 ASMR 영상", isVisible: true, children: [] }
  ] }
];

const healthCategories = ["기초검사", "혈액검사", "초음파", "내시경", "암진단", "심혈관", "여성/남성", "유전자", "식이요법", "심리/스트레스"];
let healthPosts = [];
let healthCurrentPage = 1;
const HEALTH_ITEMS_PER_PAGE = 10;
let healthIsHtmlMode = false;
let healthCurrentEditId = null;

let hospitals = [];
let hospitalEditingId = null;

let packages = [];
let packageEditingId = null;
let currentPackageItems = { basic: [], optional: [] };

let masterItems = [];
let itemEditingId = null;

let currentClientId = "kyobo";
let currentSiteId = "default";
let currentView = "menu-settings";

// --- Initialization ---
function initializeAdmin() {
  try {
    loadAllData();
    setupNavigation();
    
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    if (viewParam) {
      currentView = viewParam;
    }
    
    if (currentView === 'health-info') {
      window.location.href = 'health_info.html';
      return;
    }
    navigateTo(currentView);
  } catch (error) {
    alert("어드민 초기화 에러 감지!\n\n메시지: " + error.message + "\n스택: " + error.stack);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAdmin);
} else {
  initializeAdmin();
}

function loadAllData() {
  try {
    // 1. Client Configs
    const savedClients = localStorage.getItem('hc_portal_data');
    if (savedClients) {
      try {
        const parsed = JSON.parse(savedClients);
        for(let k in parsed) {
          if(adminClientConfigs[k]) {
            adminClientConfigs[k] = { ...adminClientConfigs[k], ...parsed[k] };
          }
        }
      } catch(e) {}
    }
    
    // Migration & Default initialization
    Object.values(adminClientConfigs).forEach(client => {
      if (!client.sites || client.sites.length === 0) {
        let currentMenus = client.menus;
        if (!currentMenus || currentMenus.length === 0) {
          if (client.menuLabels) {
            currentMenus = defaultMenus.map(m => ({
              ...m,
              defaultLabel: m.defaultLabel,
              label: client.menuLabels[m.id] || m.label,
              isVisible: client.menuVisibility ? client.menuVisibility[m.id] !== false : true
            }));
          } else {
            currentMenus = JSON.parse(JSON.stringify(defaultMenus));
          }
        }
        
        const defaultSite = {
          siteId: "default",
          siteName: "기본 사이트",
          mappedTiers: [...(client.tiers || [])],
          logoImage: client.logoImage || null,
          themeColor: client.themeColor || BRAND_DEFAULTS.themeColor,
          themeColorRgb: client.themeColorRgb || BRAND_DEFAULTS.themeColorRgb,
          menuTextColor: client.menuTextColor || BRAND_DEFAULTS.menuTextColor,
          heroText: client.heroText || { title: "건강한 내일을 위한 첫걸음", subtitle: "교보생명 전용 헬스케어 포털에서 제공하는 프리미엄 건강 관리 서비스를 지금 바로 경험해보세요." },
          serviceName: client.serviceName || client.name || "",
          csNumber: client.csNumber || "",
          name: client.name || "",
          clientLink: client.clientLink || "",
          providerName: client.providerName || BRAND_DEFAULTS.providerName,
          providerLink: client.providerLink || BRAND_DEFAULTS.providerLink,
          menus: currentMenus
        };
        client.sites = [defaultSite];
      } else {
        client.sites.forEach(site => {
          if (!site) return;
          if (!site.menus || site.menus.length === 0) {
            site.menus = JSON.parse(JSON.stringify(defaultMenus));
          } else {
            const sgIndex = site.menus.findIndex(m => m.id === 'serviceGuide');
            if (sgIndex > 0) {
              const sg = site.menus.splice(sgIndex, 1)[0];
              site.menus.unshift(sg);
            }
          }
          if (!site.mappedTiers) {
            site.mappedTiers = [...(client.tiers || [])];
          }
        });
        
        client.sites.forEach(site => {
          if (site.menus) {
            const checkupApptMenu = site.menus.find(m => m.id === 'checkupAppt');
            if (checkupApptMenu && (!checkupApptMenu.children || checkupApptMenu.children.length === 0)) {
              checkupApptMenu.children = [
                { id: "checkupPreferred", defaultLabel: "건강검진 우대예약", label: "건강검진 우대예약", isVisible: true, children: [] },
                { id: "checkupHistory", defaultLabel: "건강검진 신청이력", label: "건강검진 신청이력", isVisible: true, children: [] }
              ];
            }
            
            const healthMenu = site.menus.find(m => m.id === 'healthInfo');
            if (healthMenu) {
              if (!healthMenu.children) healthMenu.children = [];
              
              // 1. Normalize IDs based on labels
              healthMenu.children.forEach(child => {
                const lbl = child.label || child.defaultLabel || '';
                if (lbl.includes('분야별')) {
                  child.id = 'categoryInfo';
                } else if (lbl.includes('구독') || lbl.includes('콘텐츠')) {
                  child.id = 'contentSubscribe';
                } else if (lbl.includes('심리칼럼') || lbl.includes('칼럼')) {
                  child.id = 'psyColumn';
                } else if (lbl.includes('자가진단') || lbl.includes('진단')) {
                  child.id = 'selfDiagnosis';
                } else if (lbl.includes('뉴스')) {
                  child.id = 'healthNews';
                }
              });
              
              // 2. Deduplicate children by ID
              const uniqueChildren = [];
              const seenIds = new Set();
              healthMenu.children.forEach(child => {
                const targetId = child.id;
                if (targetId === 'categoryInfo' || targetId === 'contentSubscribe' || targetId === 'psyColumn' || targetId === 'selfDiagnosis' || targetId === 'healthNews') {
                  if (!seenIds.has(targetId)) {
                    seenIds.add(targetId);
                    uniqueChildren.push(child);
                  }
                } else {
                  uniqueChildren.push(child);
                }
              });
              
              // 3. Ensure standard submenus exist
              if (!seenIds.has('categoryInfo')) {
                uniqueChildren.push({ id: "categoryInfo", defaultLabel: "분야별 건강정보", label: "분야별 건강정보", isVisible: true, children: [] });
              }
              if (!seenIds.has('contentSubscribe')) {
                uniqueChildren.push({ id: "contentSubscribe", defaultLabel: "건강콘텐츠 구독", label: "건강콘텐츠 구독", isVisible: true, children: [] });
              }
              if (!seenIds.has('psyColumn')) {
                uniqueChildren.push({ id: "psyColumn", defaultLabel: "심리칼럼", label: "심리칼럼", isVisible: true, children: [] });
              }
              if (!seenIds.has('selfDiagnosis')) {
                uniqueChildren.push({ id: "selfDiagnosis", defaultLabel: "자가진단", label: "자가진단", isVisible: true, children: [] });
              }
              if (!seenIds.has('healthNews')) {
                uniqueChildren.push({ id: "healthNews", defaultLabel: "건강뉴스", label: "건강뉴스", isVisible: true, children: [] });
              }
              
              healthMenu.children = uniqueChildren;
            }

            const psyCareMenu = site.menus.find(m => m.id === 'psyCare');
            if (psyCareMenu) {
              if (!psyCareMenu.children) psyCareMenu.children = [];
              
              psyCareMenu.children.forEach(child => {
                const lbl = child.label || child.defaultLabel || '';
                if (lbl.includes('ASMR') || lbl.includes('영상') || lbl.includes('힐링')) {
                  child.id = 'asmrVideo';
                }
              });

              const uniquePsyChildren = [];
              const seenPsyIds = new Set();
              psyCareMenu.children.forEach(child => {
                const targetId = child.id;
                if (targetId === 'asmrVideo') {
                  if (!seenPsyIds.has(targetId)) {
                    seenPsyIds.add(targetId);
                    uniquePsyChildren.push(child);
                  }
                } else {
                  uniquePsyChildren.push(child);
                }
              });

              if (!seenPsyIds.has('asmrVideo')) {
                uniquePsyChildren.push({ id: "asmrVideo", defaultLabel: "힐링 ASMR 영상", label: "힐링 ASMR 영상", isVisible: true, children: [] });
              }

              psyCareMenu.children = uniquePsyChildren;
            }
          }
        });
      }
    });
    syncAllClientMenus(adminClientConfigs);
  } catch (error) {
    console.error("Admin data migration failed, purging localStorage key.", error);
    try { localStorage.removeItem('hc_portal_data'); } catch (e) {}
  }
}

function syncAllClientMenus(configs) {
  const kyoboClient = configs.kyobo;
  if (!kyoboClient || !kyoboClient.sites || kyoboClient.sites.length === 0) return;
  const masterMenus = kyoboClient.sites[0].menus;
  if (!masterMenus) return;

  function projectMenuTree(masterList, targetList) {
    return masterList.map(masterMenu => {
      const targetMenu = findMenuInList(targetList, masterMenu.id);
      const isVisible = targetMenu ? targetMenu.isVisible : false;
      const label = masterMenu.label;
      const defaultLabel = masterMenu.defaultLabel || masterMenu.label;
      
      const newMenu = {
        id: masterMenu.id,
        defaultLabel: defaultLabel,
        label: label,
        isVisible: isVisible,
        children: []
      };
      
      if (masterMenu.children && masterMenu.children.length > 0) {
        newMenu.children = projectMenuTree(masterMenu.children, targetList || []);
      }
      return newMenu;
    });
  }

  function findMenuInList(list, id) {
    if (!list) return null;
    for (let m of list) {
      if (m.id === id) return m;
      if (m.children) {
        const found = findMenuInList(m.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  Object.keys(configs).forEach(clientId => {
    const client = configs[clientId];
    if (!client.sites) return;
    client.sites.forEach(site => {
      if (clientId === 'kyobo' && site.siteId === 'default') {
        return;
      }
      site.menus = projectMenuTree(masterMenus, site.menus || []);
    });
  });

  // 2. Health Posts
  const savedHealth = localStorage.getItem('hc_health_posts');
  if (savedHealth) { healthPosts = JSON.parse(savedHealth); }
  else {
    healthPosts = Array.from({length: 15}, (_, i) => ({
      id: `post_${Date.now()}_${i}`,
      title: `테스트 건강 정보 게시글 ${15 - i}`,
      category: healthCategories[i % healthCategories.length],
      content: `<p>건강 매거진 테스트 내용입니다. (${15 - i})</p>`,
      date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
    }));
  }

  // 3. Hospitals
  const savedHosp = localStorage.getItem('hc_hospitals');
  if (savedHosp) { hospitals = JSON.parse(savedHosp); }
  else {
    hospitals = [
      { id: 'h1', name: 'GC녹십자아이메드 강남센터', bizno: '123-45-67890', addr: '서울 서초구 서초대로 38길 12', phone: '02-1234-5678', resName: '김예약', resPhone: '010-1111-2222', conName: '이정산', conPhone: '010-3333-4444', intro: '최고의 의료진과 최신 장비로 정확한 건강검진을 제공합니다.' },
      { id: 'h2', name: 'KMI 한국의학연구소 여의도', bizno: '987-65-43210', addr: '서울 영등포구 국제금융로 10', phone: '02-9876-5432', resName: '박의료', resPhone: '010-5555-6666', conName: '최결제', conPhone: '010-7777-8888', intro: '신뢰할 수 있는 건강검진 전문 기관입니다.' }
    ];
  }

  // 4. Packages
  const savedPkgs = localStorage.getItem('hc_packages');
  if (savedPkgs) { packages = JSON.parse(savedPkgs); }

  // 5. Master Items
  const savedItems = localStorage.getItem('hc_checkup_items');
  if (savedItems) { masterItems = JSON.parse(savedItems); }
  else {
    masterItems = [
      { id: 1, large: '기초검사', medium: '신체계측', small: '체중/신장', name: '신장, 체중, 비만도(BMI)', desc: '기본적인 신체 정보 측정' },
      { id: 2, large: '기초검사', medium: '시력/청력', small: '시력', name: '교정시력 측정', desc: '안과 기본 검사' },
      { id: 3, large: '혈액검사', medium: '간기능', small: '간세포', name: 'AST, ALT, γ-GTP', desc: '간 수치 확인' },
      { id: 4, large: '초음파', medium: '상복부', small: '5대장기', name: '상복부 초음파 (간, 담낭, 췌장, 비장, 신장)', desc: '복부 주요 장기 확인' },
      { id: 5, large: '내시경', medium: '위내시경', small: '일반/수면', name: '위내시경 (수면 선택 가능)', desc: '식도, 위, 십이지장 관찰' }
    ];
  }
}

// --- Router ---
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const view = item.getAttribute('data-view');
      if (view) {
        e.preventDefault();
        navigateTo(view);
      }
    });
  });
}

window.navigateTo = function(viewId) {
  currentView = viewId;
  
  // Update UI active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-view') === viewId);
  });

  const container = document.getElementById('admin-main-view');
  if (!container) return;

  // Update Breadcrumb
  const breadcrumb = document.querySelector('.breadcrumb');
  let pathText = "사무포털 <span class='separator'>></span> ";
  if (viewId === 'menu-settings') pathText += "헬스케어포털 관리 <span class='separator'>></span> <strong>포털 메뉴설정</strong>";
  else if (viewId === 'client-management') pathText += "헬스케어포털 관리 <span class='separator'>></span> <strong>고객사 및 등급 관리</strong>";
  else if (viewId === 'health-info') pathText += "헬스케어포털 관리 <span class='separator'>></span> <strong>건강정보 관리</strong>";
  else if (viewId === 'online-inquiry') pathText += "헬스케어포털 관리 <span class='separator'>></span> <strong>온라인 문의 관리</strong>";
  else if (viewId === 'checkup-history') pathText += "건강검진 관리 <span class='separator'>></span> <strong>검진 예약 관리</strong>";
  else if (viewId === 'hospitals') pathText += "건강검진 관리 <span class='separator'>></span> <strong>제휴 병원 관리</strong>";
  else if (viewId === 'packages') pathText += "건강검진 관리 <span class='separator'>></span> <strong>검진 패키지 관리</strong>";
  else if (viewId === 'items') pathText += "건강검진 관리 <span class='separator'>></span> <strong>검진 항목 관리</strong>";
  else if (viewId === 'location-logs') pathText += "대시보드 <span class='separator'>></span> <strong>위치정보 동의 로그</strong>";
  else if (viewId === 'checkup-consent-logs') pathText += "대시보드 <span class='separator'>></span> <strong>건강검진 동의 이력</strong>";
  breadcrumb.innerHTML = pathText;

  renderView(viewId);
};

function renderView(viewId) {
  const container = document.getElementById('admin-main-view');
  container.innerHTML = ''; // Clear

  if (viewId === 'menu-settings') renderMenuSettings(container);
  else if (viewId === 'client-management') renderClientManagement(container);
  else if (viewId === 'health-info') renderHealthInfo(container);
  else if (viewId === 'online-inquiry') renderOnlineInquiryView(container);
  else if (viewId === 'checkup-history') renderCheckupHistoryAdmin(container);
  else if (viewId === 'hospitals') renderHospitals(container);
  else if (viewId === 'packages') renderPackages(container);
  else if (viewId === 'items') renderItemsView(container);
  else if (viewId === 'location-logs') renderLocationLogs(container);
  else if (viewId === 'checkup-consent-logs') renderCheckupConsentLogs(container);
  else renderDashboard(container);
}

// --- View: Location Logs ---
function renderLocationLogs(container) {
  const logs = JSON.parse(localStorage.getItem('locationLogs') || '[]');
  
  let rowsHtml = logs.length === 0 
    ? '<tr><td colspan="10" style="text-align: center; padding: 40px; color: #64748b; font-size:14px;">저장된 로그 내역이 없습니다.</td></tr>'
    : logs.map(log => `
      <tr>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px;">${log.LOG_ID}</td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:600;">${log.MEMBER_ID}</td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px; text-align:center;"><span style="display:inline-block; padding:4px 8px; border-radius:4px; font-weight:600; font-size:13px; background:${log.CONSENT_YN==='Y'?'#dcfce7':'#fee2e2'}; color:${log.CONSENT_YN==='Y'?'#166534':'#991b1b'};">${log.CONSENT_YN}</span></td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px;">${log.CONSENT_DATETIME}</td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px;">${log.SERVICE_TYPE}</td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px;">${log.SCREEN_ID}</td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px;">${log.PURPOSE}</td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px;">${log.CLIENT_IP}</td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:13px; max-width:150px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${log.USER_AGENT}">${log.USER_AGENT}</td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px;">${log.CREATED_AT}</td>
      </tr>
    `).join('');

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">위치정보 동의 로그 조회</h1>
        <p class="page-subtitle">서비스 내에서 수집된 사용자 위치정보 제공 동의/거부 이력을 확인합니다.</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" onclick="if(confirm('모든 로그를 삭제하시겠습니까?')) { localStorage.removeItem('locationLogs'); navigateTo('location-logs'); }">전체 로그 삭제</button>
      </div>
    </div>
    
    <div class="config-card">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <h2 class="card-title">로그 목록 (총 ${logs.length}건)</h2>
        <div style="display:flex; gap:8px;">
          <select class="form-input" style="width: 150px; font-size:14px; height:40px;">
            <option value="ALL">전체 상태</option>
            <option value="Y">동의(Y)</option>
            <option value="N">거부(N)</option>
          </select>
        </div>
      </div>
      <div class="card-body" style="padding:0; overflow-x:auto;">
        <table style="width:100%; min-width:1200px; border-collapse:collapse; text-align:left;">
          <thead style="background:#f8fafc; border-bottom:2px solid #e2e8f0;">
            <tr>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">LOG_ID</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">MEMBER_ID</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569; text-align:center;">동의여부</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">동의/거부일시</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">서비스 구분</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">요청 화면</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">이용 목적</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">CLIENT_IP</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">USER_AGENT</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">생성일시</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// --- View: Checkup Consent Logs ---
function renderCheckupConsentLogs(container) {
  const logs = JSON.parse(localStorage.getItem('checkupConsentLogs') || '[]');
  
  let rowsHtml = logs.length === 0 
    ? '<tr><td colspan="10" style="text-align: center; padding: 40px; color: #64748b; font-size:14px;">저장된 로그 내역이 없습니다.</td></tr>'
    : logs.map(log => `
      <tr>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px;">${log.LOG_ID}</td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:600;">${log.MEMBER_ID}</td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px; text-align:center;"><span style="display:inline-block; padding:4px 8px; border-radius:4px; font-weight:600; font-size:13px; background:${log.CONSENT_YN==='Y'?'#dcfce7':'#fee2e2'}; color:${log.CONSENT_YN==='Y'?'#166534':'#991b1b'};">${log.CONSENT_YN}</span></td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px;">${log.CONSENT_DATETIME}</td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px;">${log.SERVICE_TYPE}</td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px;">${log.SCREEN_ID}</td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px;">${log.PURPOSE}</td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px;">${log.CLIENT_IP}</td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:13px; max-width:150px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${log.USER_AGENT}">${log.USER_AGENT}</td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px;">${log.CREATED_AT}</td>
      </tr>
    `).join('');

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">건강검진 동의 이력 조회</h1>
        <p class="page-subtitle">서비스 내에서 수집된 건강검진 우대예약 관련 약관 동의 이력을 확인합니다.</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" onclick="if(confirm('모든 로그를 삭제하시겠습니까?')) { localStorage.removeItem('checkupConsentLogs'); navigateTo('checkup-consent-logs'); }">전체 로그 삭제</button>
      </div>
    </div>
    
    <div class="config-card">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <h2 class="card-title">로그 목록 (총 ${logs.length}건)</h2>
        <div style="display:flex; gap:8px;">
          <select class="form-input" style="width: 150px; font-size:14px; height:40px;">
            <option value="ALL">전체 상태</option>
            <option value="Y">동의(Y)</option>
            <option value="N">거부(N)</option>
          </select>
        </div>
      </div>
      <div class="card-body" style="padding:0; overflow-x:auto;">
        <table style="width:100%; min-width:1200px; border-collapse:collapse; text-align:left;">
          <thead style="background:#f8fafc; border-bottom:2px solid #e2e8f0;">
            <tr>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">LOG_ID</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">MEMBER_ID</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569; text-align:center;">동의여부</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">동의/거부일시</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">서비스 구분</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">요청 화면</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">이용 목적</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">CLIENT_IP</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">USER_AGENT</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">생성일시</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// --- View: Checkup History Admin ---
function renderCheckupHistoryAdmin(container) {
  const checkupHistories = JSON.parse(localStorage.getItem('hc_checkup_history') || '[]');
  
  window.updateCheckupAdminStatus = function(id, newStatus) {
    if(confirm('상태를 ' + newStatus + '(으)로 변경하시겠습니까?')) {
      const hist = JSON.parse(localStorage.getItem('hc_checkup_history') || '[]');
      const idx = hist.findIndex(h => h.id === id);
      if (idx !== -1) {
        hist[idx].status = newStatus;
        if (newStatus === '확정') {
          hist[idx].confirmDate = hist[idx].wishDate1; 
          hist[idx].reservationConfirmedDate = new Date().toISOString().split('T')[0];
        }
        localStorage.setItem('hc_checkup_history', JSON.stringify(hist));
        renderCheckupHistoryAdmin(document.getElementById('admin-main-view'));
      }
    }
  };

  let rowsHtml = checkupHistories.length === 0 
    ? '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #64748b; font-size:14px;">신청된 검진 내역이 없습니다.</td></tr>'
    : checkupHistories.map(chk => {
      const statusColor = chk.status === '확정' ? '#2563eb' : (chk.status === '신청' ? '#17B890' : (chk.status === '취소요청' ? '#f59e0b' : '#94a3b8'));
      return `
      <tr>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px;">${chk.id}</td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:600;">${chk.targetName}</td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px;">${chk.applyDate}</td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px;">${chk.pkgName}</td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px;">${chk.wishDate1} / ${chk.wishDate2 || '-'}</td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px; text-align:center;">
          <span style="display:inline-block; padding:4px 8px; border-radius:4px; font-weight:600; font-size:13px; background:${statusColor}22; color:${statusColor};">${chk.status}</span>
        </td>
        <td style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:14px; text-align:center;">
          <select onchange="window.updateCheckupAdminStatus('${chk.id}', this.value)" style="padding:4px; font-size:13px; cursor: pointer; border: 1px solid #cbd5e1; border-radius: 4px; height: 32px;">
            <option value="신청" ${chk.status === '신청' ? 'selected' : ''}>신청</option>
            <option value="확정" ${chk.status === '확정' ? 'selected' : ''}>확정</option>
            <option value="취소요청" ${chk.status === '취소요청' ? 'selected' : ''}>취소요청</option>
            <option value="취소" ${chk.status === '취소' ? 'selected' : ''}>취소</option>
          </select>
        </td>
      </tr>
    `}).join('');

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">검진 예약 관리</h1>
        <p class="page-subtitle">사용자가 신청한 건강검진 내역을 확인하고 상태를 관리합니다.</p>
      </div>
    </div>
    
    <div class="config-card">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <h2 class="card-title">신청 목록 (총 ${checkupHistories.length}건)</h2>
      </div>
      <div class="card-body" style="padding:0; overflow-x:auto;">
        <table style="width:100%; min-width:1000px; border-collapse:collapse; text-align:left;">
          <thead style="background:#f8fafc; border-bottom:2px solid #e2e8f0;">
            <tr>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">신청ID</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">대상자</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">신청일</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">검진패키지</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569;">희망일 1/2</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569; text-align:center;">상태</th>
              <th style="padding:12px; font-size:14px; font-weight:600; color:#475569; text-align:center;">상태변경</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;
}


// --- View: Dashboard ---
function renderDashboard(container) {
  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">종합 현황 대시보드</h1>
        <p class="page-subtitle">헬스케어 포털의 주요 지표를 한눈에 확인합니다.</p>
      </div>
    </div>
    <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:20px; margin-top:20px;">
       <div class="config-card" style="padding:24px; text-align:center;">
          <div style="font-size:14px; color:#64748b; margin-bottom:8px;">등록 고객사</div>
          <div style="font-size:24px; font-weight:700;">${Object.keys(adminClientConfigs).length}개</div>
       </div>
       <div class="config-card" style="padding:24px; text-align:center;">
          <div style="font-size:14px; color:#64748b; margin-bottom:8px;">제휴 병원</div>
          <div style="font-size:24px; font-weight:700;">${hospitals.length}개</div>
       </div>
       <div class="config-card" style="padding:24px; text-align:center;">
          <div style="font-size:14px; color:#64748b; margin-bottom:8px;">검진 패키지</div>
          <div style="font-size:24px; font-weight:700;">${packages.length}개</div>
       </div>
       <div class="config-card" style="padding:24px; text-align:center;">
          <div style="font-size:14px; color:#64748b; margin-bottom:8px;">건강 매거진</div>
          <div style="font-size:24px; font-weight:700;">${healthPosts.length}개</div>
       </div>
    </div>
    <div class="config-card" style="margin-top:24px;">
       <div class="card-header"><h2 class="card-title">최근 등록 게시글</h2></div>
       <div class="card-body" style="padding:0;">
          <table class="health-table" style="width:100%;">
             <tbody>
                ${healthPosts.slice(0, 5).map(p => `
                   <tr>
                      <td><span class="badge-cat badge-basic">${p.category}</span></td>
                      <td style="font-weight:600;">${p.title}</td>
                      <td style="color:#64748b; text-align:right;">${p.date}</td>
                   </tr>
                `).join('')}
             </tbody>
          </table>
       </div>
    </div>
  `;
}

// --- View: Menu Settings ---
function renderMenuSettings(container) {
  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">메뉴 구성 및 노출 관리</h1>
        <p class="page-subtitle">3단계 계층 구조로 포털 메뉴를 구성하고 노출 여부를 설정합니다.</p>
      </div>
      <button class="btn btn-primary" onclick="saveMenuSettings()">변경사항 저장</button>
    </div>

    <div class="config-card">
      <div class="card-header" style="flex-direction:column; align-items:stretch; gap:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h2 class="card-title">고객사 및 사이트 선택</h2>
          <select id="client-select" class="form-select" onchange="loadClientSettings()"></select>
        </div>
        <div id="site-tabs-area"></div>
      </div>
      <div class="card-body">
        <div class="menu-tree-header" style="display:grid; grid-template-columns: 1.2fr 1.2fr 100px 280px; padding: 12px 16px; background:#f8fafc; font-weight:600; font-size:13px; border-radius:8px; margin-bottom:12px; gap:12px;">
           <span>기본 메뉴명</span>
           <span>고객사별 메뉴명</span>
           <span style="text-align:center;">노출여부</span>
           <span style="text-align:right;">관리</span>
        </div>
        <div id="menu-tree-container"></div>
        <button class="btn" style="border: 1px dashed #cbd5e1; width: 100%; margin-top: 16px; height:48px;" onclick="addTopMenu()">+ 최상위 메뉴 추가</button>
      </div>
    </div>

    <div class="config-card" style="margin-top: 24px;">
      <div class="card-header"><h2 class="card-title">헤더 및 브랜드 설정</h2></div>
      <div class="card-body">
        <div class="menu-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
          <div class="form-group" style="grid-column: span 2; margin-bottom: 8px;">
            <label class="form-label" style="font-weight:600; color:#334155;">사이트명 (상단 탭 및 브릿지 페이지 노출 명칭)</label>
            <input type="text" id="input-siteName" class="form-input" placeholder="예: 기본 사이트">
          </div>
          <div class="form-group">
            <label class="form-label">서비스 로고 (SVG/이미지)</label>
            <div style="display:flex; gap:12px; align-items:center;">
              <div id="logo-preview" style="width:48px; height:48px; background:#f1f5f9; border-radius:8px; display:flex; align-items:center; justify-content:center; overflow:hidden; border:1px solid #e2e8f0;">
                <span style="font-size:10px; color:#94a3b8;">No Logo</span>
              </div>
              <input type="file" id="input-logoFile" class="form-input" accept=".svg,image/*" onchange="handleLogoUpload(this)" style="padding:8px;">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">포인트 컬러 1 (버튼/로그인 배경)</label>
            <div style="display:flex; gap:8px;">
              <div id="preview-themeColor" style="width:40px; height:40px; border-radius:4px; border:1px solid #e2e8f0; flex-shrink:0;"></div>
              <input type="text" id="input-themeColor" class="form-input" placeholder="#000000" oninput="updateColorPreview('themeColor', this.value)">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">포인트 컬러 2 (메뉴/CS번호 색상)</label>
            <div style="display:flex; gap:8px;">
              <div id="preview-menuTextColor" style="width:40px; height:40px; border-radius:4px; border:1px solid #e2e8f0; flex-shrink:0;"></div>
              <input type="text" id="input-menuTextColor" class="form-input" placeholder="#000000" oninput="updateColorPreview('menuTextColor', this.value)">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="config-card" style="margin-top: 24px;">
      <div class="card-header"><h2 class="card-title">메인화면 및 푸터 설정</h2></div>
      <div class="card-body">
        <div class="menu-grid">
          <div class="form-group"><label class="form-label">메인 타이틀</label><input id="input-heroTitle" class="form-input"></div>
          <div class="form-group"><label class="form-label">서브 텍스트</label><textarea id="input-heroSubtitle" class="form-input" rows="2"></textarea></div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-top:16px;">
            <div class="form-group"><label class="form-label">고객센터명</label><input id="input-csName" class="form-input"></div>
            <div class="form-group"><label class="form-label">전화번호</label><input id="input-csNumber" class="form-input"></div>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-top:16px;">
            <div class="form-group"><label class="form-label">고객사 명칭</label><input id="input-clientName" class="form-input" placeholder="예: 교보생명보험주식회사"></div>
            <div class="form-group"><label class="form-label">고객사 링크 (URL)</label><input id="input-clientLink" class="form-input" placeholder="https://..."></div>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-top:16px;">
            <div class="form-group"><label class="form-label">제공사 명칭</label><input id="input-providerName" class="form-input" placeholder="예: 교보다솜케어"></div>
            <div class="form-group"><label class="form-label">제공사 링크 (URL)</label><input id="input-providerLink" class="form-input" placeholder="https://..."></div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  const select = document.getElementById("client-select");
  Object.values(adminClientConfigs).forEach(client => {
    const opt = document.createElement("option");
    opt.value = client.id; opt.textContent = client.name;
    if(client.id === currentClientId) opt.selected = true;
    select.appendChild(opt);
  });

  loadClientSettings();
}

window.loadClientSettings = function() {
  const clientSelectEl = document.getElementById("client-select");
  if (!clientSelectEl) return;
  currentClientId = clientSelectEl.value;
  const client = adminClientConfigs[currentClientId];
  if (!client) {
    console.error("Client not found for ID:", currentClientId);
    return;
  }
  
  // Render Site Tabs
  renderSiteTabs(client);
  
  const activeSite = client.sites ? (client.sites.find(s => s.siteId === currentSiteId) || client.sites[0]) : null;
  if (!activeSite) {
    console.error("No active site found for client:", currentClientId);
    return;
  }
  currentSiteId = activeSite.siteId; // Normalize

  const container = document.getElementById("menu-tree-container");
  if (container) {
    container.innerHTML = '';
    if (activeSite.menus) {
      renderMenuLevel(activeSite.menus, container, 1);
    }
  }

  const siteNameEl = document.getElementById('input-siteName');
  if (siteNameEl) siteNameEl.value = activeSite.siteName || '';

  const heroTitleEl = document.getElementById('input-heroTitle');
  if (heroTitleEl) heroTitleEl.value = (activeSite.heroText && activeSite.heroText.title) || '';

  const heroSubtitleEl = document.getElementById('input-heroSubtitle');
  if (heroSubtitleEl) heroSubtitleEl.value = (activeSite.heroText && activeSite.heroText.subtitle) || '';

  const csNameEl = document.getElementById('input-csName');
  if (csNameEl) csNameEl.value = activeSite.serviceName || '';

  const csNumberEl = document.getElementById('input-csNumber');
  if (csNumberEl) csNumberEl.value = activeSite.csNumber || '';

  const clientNameEl = document.getElementById('input-clientName');
  if (clientNameEl) clientNameEl.value = activeSite.name || '';

  const clientLinkEl = document.getElementById('input-clientLink');
  if (clientLinkEl) clientLinkEl.value = activeSite.clientLink || '';

  const providerNameEl = document.getElementById('input-providerName');
  if (providerNameEl) providerNameEl.value = activeSite.providerName || BRAND_DEFAULTS.providerName;

  const providerLinkEl = document.getElementById('input-providerLink');
  if (providerLinkEl) providerLinkEl.value = activeSite.providerLink || BRAND_DEFAULTS.providerLink;
  
  // Branding settings
  const themeColorEl = document.getElementById('input-themeColor');
  if (themeColorEl) themeColorEl.value = activeSite.themeColor || BRAND_DEFAULTS.themeColor;

  const previewThemeColorEl = document.getElementById('preview-themeColor');
  if (previewThemeColorEl) previewThemeColorEl.style.backgroundColor = activeSite.themeColor || BRAND_DEFAULTS.themeColor;
  
  const menuTextColorEl = document.getElementById('input-menuTextColor');
  if (menuTextColorEl) menuTextColorEl.value = activeSite.menuTextColor || BRAND_DEFAULTS.menuTextColor;

  const previewMenuTextColorEl = document.getElementById('preview-menuTextColor');
  if (previewMenuTextColorEl) previewMenuTextColorEl.style.backgroundColor = activeSite.menuTextColor || BRAND_DEFAULTS.menuTextColor;
  
  const preview = document.getElementById('logo-preview');
  if (preview) {
    if (activeSite.logoImage) {
      preview.innerHTML = `<img src="${activeSite.logoImage}" style="max-width:100%; max-height:100%; object-fit:contain;">`;
    } else {
      preview.innerHTML = `<span style="font-size:10px; color:#94a3b8;">No Logo</span>`;
    }
  }
};

window.updateColorPreview = function(id, val) {
  const preview = document.getElementById(`preview-${id}`);
  if (preview) {
    // Basic HEX validation check to update preview
    if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
      preview.style.backgroundColor = val;
    }
  }
};

window.handleLogoUpload = function(input) {
  const file = input.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const base64 = e.target.result;
    const client = adminClientConfigs[currentClientId];
    const activeSite = client.sites.find(s => s.siteId === currentSiteId) || client.sites[0];
    client.logoImage = base64;
    activeSite.logoImage = base64;
    document.getElementById('logo-preview').innerHTML = `<img src="${base64}" style="max-width:100%; max-height:100%; object-fit:contain;">`;
  };
  reader.readAsDataURL(file);
};

function renderMenuLevel(menus, container, depth) {
  menus.forEach((menu, index) => {
    const item = document.createElement('div');
    item.className = `menu-tree-item depth-${depth}`;
    item.innerHTML = `
      <div class="menu-item-row ${!menu.isVisible ? 'disabled' : ''}" style="display:grid; grid-template-columns: 1.2fr 1.2fr 100px 280px; align-items:center; gap:12px;">
        <div class="menu-info">
          <div class="depth-indicator">${'—'.repeat(depth - 1)}</div>
          <input type="text" class="form-input default-label-input" value="${menu.defaultLabel || menu.label}" onchange="updateMenuDefaultLabel('${menu.id}', this.value)" placeholder="기본 명칭">
        </div>
        <div class="menu-info">
          <input type="text" class="form-input" value="${menu.label}" onchange="updateMenuLabel('${menu.id}', this.value)" placeholder="고객사 노출 명칭">
        </div>
        <div class="menu-action" style="justify-content:center;">
          <label class="switch">
            <input type="checkbox" ${menu.isVisible ? 'checked' : ''} onchange="toggleMenuVisibility('${menu.id}', this.checked)">
            <span class="slider"></span>
          </label>
        </div>
        <div class="menu-management" style="text-align:right; display:flex; justify-content:flex-end; gap:4px; align-items:center;">
          ${depth < 3 ? `<button class="btn btn-sm" onclick="addSubMenu('${menu.id}', ${depth})">+ 하위</button>` : ''}
          <button class="btn btn-sm" style="background:#f1f5f9; color:#475569; border:1px solid #cbd5e1;" onclick="openMenuRBACModal('${menu.id}')">⚙️ 노출 조건</button>
          <button class="btn btn-sm" style="color:#ef4444;" onclick="deleteMenu('${menu.id}')">삭제</button>
        </div>
      </div>
      <div id="children-${menu.id}" class="menu-children-container"></div>
    `;
    container.appendChild(item);
    
    if (menu.children && menu.children.length > 0) {
      renderMenuLevel(menu.children, item.querySelector(`#children-${menu.id}`), depth + 1);
    }
  });
}

window.updateMenuLabel = function(id, val) {
  Object.keys(adminClientConfigs).forEach(clientId => {
    adminClientConfigs[clientId].sites.forEach(site => {
      const menu = findMenuById(site.menus, id);
      if (menu) menu.label = val;
    });
  });
};

window.updateMenuDefaultLabel = function(id, val) {
  Object.keys(adminClientConfigs).forEach(clientId => {
    adminClientConfigs[clientId].sites.forEach(site => {
      const menu = findMenuById(site.menus, id);
      if (menu) menu.defaultLabel = val;
    });
  });
};

window.toggleMenuVisibility = function(id, checked) {
  const client = adminClientConfigs[currentClientId];
  const activeSite = client.sites.find(s => s.siteId === currentSiteId) || client.sites[0];
  const menu = findMenuById(activeSite.menus, id);
  if(menu) {
    menu.isVisible = checked;
    if (!checked) {
      const setChildrenInvisible = (m) => {
        if (m.children) {
          m.children.forEach(child => {
            child.isVisible = false;
            setChildrenInvisible(child);
          });
        }
      };
      setChildrenInvisible(menu);
    }
    loadClientSettings(); // Re-render to update disabled states
  }
};

window.addTopMenu = function() {
  const newId = 'm_' + Date.now();
  const newMenu = {
    id: newId, defaultLabel: '새 메뉴', label: '새 메뉴', isVisible: false, children: []
  };
  
  Object.keys(adminClientConfigs).forEach(clientId => {
    adminClientConfigs[clientId].sites.forEach(site => {
      const cloned = JSON.parse(JSON.stringify(newMenu));
      if (clientId === currentClientId && site.siteId === currentSiteId) {
        cloned.isVisible = true;
      }
      site.menus.push(cloned);
    });
  });
  
  loadClientSettings();
};

window.addSubMenu = function(parentId, depth) {
  if (depth >= 3) return;
  const newId = 'm_' + Date.now();
  const newSubMenu = {
    id: newId, defaultLabel: '새 하위 메뉴', label: '새 하위 메뉴', isVisible: false, children: []
  };
  
  Object.keys(adminClientConfigs).forEach(clientId => {
    adminClientConfigs[clientId].sites.forEach(site => {
      const parent = findMenuById(site.menus, parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        const cloned = JSON.parse(JSON.stringify(newSubMenu));
        if (clientId === currentClientId && site.siteId === currentSiteId) {
          cloned.isVisible = true;
        }
        parent.children.push(cloned);
      }
    });
  });
  
  loadClientSettings();
};

window.deleteMenu = function(id) {
  if(confirm("이 메뉴와 모든 하위 메뉴를 삭제하시겠습니까?")) {
    Object.keys(adminClientConfigs).forEach(clientId => {
      adminClientConfigs[clientId].sites.forEach(site => {
        site.menus = removeMenuById(site.menus, id);
      });
    });
    loadClientSettings();
  }
};

function findMenuById(menus, id) {
  for(let m of menus) {
    if(m.id === id) return m;
    if(m.children) {
      const found = findMenuById(m.children, id);
      if(found) return found;
    }
  }
  return null;
}

function removeMenuById(menus, id) {
  return menus.filter(m => {
    if(m.id === id) return false;
    if(m.children) m.children = removeMenuById(m.children, id);
    return true;
  });
}

window.saveMenuSettings = function() {
  const client = adminClientConfigs[currentClientId];
  const activeSite = client.sites.find(s => s.siteId === currentSiteId) || client.sites[0];
  
  const siteNameInput = document.getElementById('input-siteName');
  if (siteNameInput) {
    const nameVal = siteNameInput.value.trim();
    if (nameVal) {
      activeSite.siteName = nameVal;
    }
  }
  
  activeSite.heroText.title = document.getElementById('input-heroTitle').value;
  activeSite.heroText.subtitle = document.getElementById('input-heroSubtitle').value;
  activeSite.serviceName = document.getElementById('input-csName').value;
  activeSite.csNumber = document.getElementById('input-csNumber').value;
  activeSite.name = document.getElementById('input-clientName').value;
  activeSite.clientLink = document.getElementById('input-clientLink').value;
  activeSite.providerName = document.getElementById('input-providerName').value;
  activeSite.providerLink = document.getElementById('input-providerLink').value;
  
  activeSite.themeColor = document.getElementById('input-themeColor').value;
  activeSite.menuTextColor = document.getElementById('input-menuTextColor').value;
  
  const hex = activeSite.themeColor.replace('#', '');
  const r = parseInt(hex.substring(0,2), 16);
  const g = parseInt(hex.substring(2,4), 16);
  const b = parseInt(hex.substring(4,6), 16);
  activeSite.themeColorRgb = `${r}, ${g}, ${b}`;

  localStorage.setItem('hc_portal_data', JSON.stringify(adminClientConfigs));
  renderSiteTabs(client); // Immediately update tabs!
  showToast("사이트 구성과 설정이 완료되어 저장되었습니다.");
};

window.renderSiteTabs = function(client) {
  const tabsArea = document.getElementById("site-tabs-area");
  if (!tabsArea) return;
  
  const activeSite = client.sites.find(s => s.siteId === currentSiteId) || client.sites[0];
  const activeColor = activeSite.themeColor || "#17B890";
  
  tabsArea.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #e2e8f0; margin-top:8px; padding-bottom:8px;">
      <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:4px;">
        ${client.sites.map(site => `
          <button class="site-tab-btn" onclick="selectSiteTab('${site.siteId}')" title="${site.siteId === currentSiteId ? '클릭하여 사이트명 및 등급 수정 (셔틀 박스)' : '클릭하여 사이트로 전환'}" style="
            background: ${site.siteId === currentSiteId ? 'rgba(23,184,144,0.1)' : 'white'};
            border: 1.5px solid ${site.siteId === currentSiteId ? activeColor : '#cbd5e1'};
            color: ${site.siteId === currentSiteId ? activeColor : '#475569'};
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            outline: none;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
          ">
            <span>🌐 ${site.siteName} ${site.siteId === currentSiteId ? '✏️' : ''}</span>
            <span style="font-size:10px; opacity:0.8; background:#f1f5f9; padding:2px 6px; border-radius:10px; color:#64748b;">
              ${site.mappedTiers.length}등급
            </span>
          </button>
        `).join('')}
        <button onclick="openAddSiteModal()" style="
          background: #f8fafc;
          border: 1.5px dashed #cbd5e1;
          color: #64748b;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          outline: none;
        ">+ 사이트 추가</button>
      </div>
      ${client.sites.length > 1 ? `
        <button class="btn btn-sm" style="color:#ef4444; border:1px solid #fee2e2; background:#fff5f5; font-size:12px; padding:6px 12px; border-radius:6px; cursor:pointer;" onclick="deleteActiveSite()">
          🗑️ 현재 사이트 삭제
        </button>
      ` : ''}
    </div>
  `;
};

window.selectSiteTab = function(siteId) {
  if (currentSiteId === siteId) {
    window.openEditSiteModal(siteId);
  } else {
    currentSiteId = siteId;
    loadClientSettings();
  }
};

window.openEditSiteModal = function(siteId) {
  const client = adminClientConfigs[currentClientId];
  const site = client.sites.find(s => s.siteId === siteId);
  if (!site) return;

  // Calculate used tiers by other sites
  const usedByOthers = new Set();
  (client.sites || []).forEach(s => {
    if (s.siteId !== siteId) {
      (s.mappedTiers || []).forEach(t => {
        const name = typeof t === 'object' ? (t.name || t.id) : t;
        usedByOthers.add(name);
      });
    }
  });

  const allTiersMapped = (client.tiers || []).map(t => {
    const name = typeof t === 'object' ? (t.name || t.id) : t;
    return {
      name: name,
      isUsedByOther: usedByOthers.has(name)
    };
  });

  const currentlyMapped = (site.mappedTiers || []).map(t => {
    return typeof t === 'object' ? (t.name || t.id) : t;
  });

  window.editSiteShuttleState = {
    siteId: siteId,
    left: allTiersMapped.filter(t => !t.isUsedByOther && !currentlyMapped.includes(t.name)),
    leftUsed: allTiersMapped.filter(t => t.isUsedByOther),
    right: currentlyMapped.map(name => ({ name })),
    leftSearch: "",
    rightSearch: ""
  };

  const modal = document.createElement("div");
  modal.id = "edit-site-modal";
  modal.style = "position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px;";
  modal.innerHTML = `
    <div class="config-card" style="width:100%; max-width:700px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border-radius:12px; overflow:hidden;">
      <div class="card-header">
        <h2 class="card-title">사이트 정보 및 등급 수정</h2>
      </div>
      <div class="card-body">
        <div class="form-group" style="margin-bottom:16px;">
          <label class="form-label" style="font-weight:600; color:#334155; margin-bottom:8px; display:block;">사이트명</label>
          <input type="text" id="edit-site-name" class="form-input" value="${site.siteName}" placeholder="예: 프리미엄 회원 사이트" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px; font-size:14px;">
        </div>
        <div class="form-group" style="margin-bottom:24px;">
          <label class="form-label" style="font-weight:600; color:#334155; margin-bottom:8px; display:block;">접근 허용 등급 선택 (Shuttle Box)</label>
          
          <div class="shuttle-box" style="display: flex; gap: 12px; align-items: stretch; margin-top: 8px;">
            <!-- Left List Panel -->
            <div class="shuttle-panel" style="flex: 1; border: 1px solid #cbd5e1; border-radius: 8px; background: white; display: flex; flex-direction: column; height: 260px; overflow: hidden;">
              <div style="padding: 8px 12px; background: #f8fafc; border-bottom: 1px solid #cbd5e1; font-weight: 600; font-size: 14px; color: #334155;">
                전체 서비스 등급 목록
              </div>
              <div style="padding: 8px; border-bottom: 1px solid #e2e8f0; background:#fff;">
                <input type="text" placeholder="등급 검색..." style="width: 100%; padding: 6px 10px; font-size: 14px; border: 1px solid #cbd5e1; border-radius: 4px; outline: none;" oninput="filterEditSiteLeft(this.value)">
              </div>
              <div id="edit-site-shuttle-left" style="flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 6px; background:#f8fafc;">
                <!-- Dynamic left items -->
              </div>
            </div>

            <!-- Middle Action Buttons -->
            <div class="shuttle-actions" style="display: flex; flex-direction: column; justify-content: center; gap: 12px; width: 80px; align-items: center; padding: 0 4px;">
              <button type="button" class="btn btn-sm" onclick="moveEditSiteTiers('add')" style="width: 100%; font-size: 14px; font-weight: 600; padding: 10px 4px; display: flex; align-items: center; justify-content: center; gap: 2px; background:#17B890; color:white; border:none; border-radius:6px; cursor:pointer;">
                추가 ▶
              </button>
              <button type="button" class="btn btn-sm" onclick="moveEditSiteTiers('remove')" style="width: 100%; font-size: 14px; font-weight: 600; padding: 10px 4px; display: flex; align-items: center; justify-content: center; gap: 2px; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; border-radius:6px; cursor:pointer;">
                ◀ 제거
              </button>
            </div>

            <!-- Right List Panel -->
            <div class="shuttle-panel" style="flex: 1; border: 1px solid #cbd5e1; border-radius: 8px; background: white; display: flex; flex-direction: column; height: 260px; overflow: hidden;">
              <div style="padding: 8px 12px; background: #f8fafc; border-bottom: 1px solid #cbd5e1; font-weight: 600; font-size: 14px; color: #334155;">
                접속 허용할 등급 목록
              </div>
              <div style="padding: 8px; border-bottom: 1px solid #e2e8f0; background:#fff;">
                <input type="text" placeholder="등급 검색..." style="width: 100%; padding: 6px 10px; font-size: 14px; border: 1px solid #cbd5e1; border-radius: 4px; outline: none;" oninput="filterEditSiteRight(this.value)">
              </div>
              <div id="edit-site-shuttle-right" style="flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 6px; background:#f8fafc;">
                <!-- Dynamic right items -->
              </div>
            </div>
          </div>
          
          <p style="font-size:12px; color:#64748b; margin-top:8px;">* 선택된 등급의 회원만 이 사이트로 진입이 가능해집니다. 이미 다른 사이트에 지정된 등급은 좌측 목록에서 비활성화되어 중복 매핑이 방지됩니다.</p>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:8px;">
          <button class="btn" onclick="closeEditSiteModal()">취소</button>
          <button class="btn btn-primary" onclick="submitEditSite()">저장하기</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  window.renderEditSiteShuttle();
};

window.filterEditSiteLeft = function(val) {
  window.editSiteShuttleState.leftSearch = val;
  window.renderEditSiteShuttle();
};

window.filterEditSiteRight = function(val) {
  window.editSiteShuttleState.rightSearch = val;
  window.renderEditSiteShuttle();
};

window.renderEditSiteShuttle = function() {
  const leftContainer = document.getElementById("edit-site-shuttle-left");
  const rightContainer = document.getElementById("edit-site-shuttle-right");
  if (!leftContainer || !rightContainer) return;

  const leftSearchText = (window.editSiteShuttleState.leftSearch || "").toLowerCase();
  const rightSearchText = (window.editSiteShuttleState.rightSearch || "").toLowerCase();

  // Render Left
  let leftHtml = "";
  
  // 1. Available active
  const filteredActiveLeft = window.editSiteShuttleState.left.filter(t => 
    t.name.toLowerCase().includes(leftSearchText)
  );
  filteredActiveLeft.forEach(t => {
    leftHtml += `
      <label style="display:flex; align-items:center; gap:8px; padding:6px 8px; font-size:13px; color:#475569; cursor:pointer; margin:0; background:#fff; border-radius:4px; border:1px solid #e2e8f0; user-select:none;">
        <input type="checkbox" class="edit-site-left-chk" value="${t.name}" style="width:14px; height:14px; accent-color:#17B890;">
        <span style="font-weight:500;">${t.name}</span>
      </label>
    `;
  });

  // 2. Disabled used
  const filteredUsedLeft = window.editSiteShuttleState.leftUsed.filter(t => 
    t.name.toLowerCase().includes(leftSearchText)
  );
  filteredUsedLeft.forEach(t => {
    leftHtml += `
      <label style="display:flex; align-items:center; gap:8px; padding:6px 8px; font-size:13px; color:#94a3b8; cursor:not-allowed; margin:0; background:#f8fafc; border-radius:4px; border:1px dashed #cbd5e1; opacity:0.75; user-select:none;">
        <input type="checkbox" disabled checked style="width:14px; height:14px; cursor:not-allowed; opacity:0.5;">
        <span style="text-decoration:line-through; font-weight:500;">${t.name}</span>
        <span style="font-size:10px; color:#f97316; background:#fff7ed; padding:1px 6px; border-radius:4px; margin-left:auto; border:1px solid #ffedd5;">다른 사이트 지정됨</span>
      </label>
    `;
  });

  if (leftHtml === "") {
    leftHtml = `<div style="text-align:center; color:#94a3b8; font-size:12px; margin-top:20px;">검색 결과 또는 전체 등급이 없습니다.</div>`;
  }
  leftContainer.innerHTML = leftHtml;

  // Render Right
  let rightHtml = "";
  const filteredRight = window.editSiteShuttleState.right.filter(t => 
    t.name.toLowerCase().includes(rightSearchText)
  );
  filteredRight.forEach(t => {
    rightHtml += `
      <label style="display:flex; align-items:center; gap:8px; padding:6px 8px; font-size:13px; color:#475569; cursor:pointer; margin:0; background:#fff; border-radius:4px; border:1px solid #e2e8f0; user-select:none;">
        <input type="checkbox" class="edit-site-right-chk" value="${t.name}" style="width:14px; height:14px; accent-color:#17B890;">
        <span style="font-weight:500;">${t.name}</span>
      </label>
    `;
  });

  if (rightHtml === "") {
    rightHtml = `<div style="text-align:center; color:#94a3b8; font-size:12px; margin-top:20px;">선택된 등급이 없습니다.<br/>(좌측에서 선택 후 추가)</div>`;
  }
  rightContainer.innerHTML = rightHtml;
};

window.moveEditSiteTiers = function(action) {
  if (action === 'add') {
    const checked = Array.from(document.querySelectorAll('.edit-site-left-chk:checked')).map(el => el.value);
    if (checked.length === 0) {
      alert("추가할 등급을 좌측 목록에서 선택해 주세요.");
      return;
    }
    
    // Safety check
    const alreadyUsed = checked.filter(name => window.editSiteShuttleState.leftUsed.some(u => u.name === name));
    if (alreadyUsed.length > 0) {
      alert(`이미 다른 사이트에 지정된 등급(${alreadyUsed.join(", ")})은 중복 지정할 수 없습니다.`);
      return;
    }

    checked.forEach(name => {
      const idx = window.editSiteShuttleState.left.findIndex(t => t.name === name);
      if (idx !== -1) {
        const item = window.editSiteShuttleState.left.splice(idx, 1)[0];
        window.editSiteShuttleState.right.push(item);
      }
    });
  } else if (action === 'remove') {
    const checked = Array.from(document.querySelectorAll('.edit-site-right-chk:checked')).map(el => el.value);
    if (checked.length === 0) {
      alert("제거할 등급을 우측 목록에서 선택해 주세요.");
      return;
    }

    checked.forEach(name => {
      const idx = window.editSiteShuttleState.right.findIndex(t => t.name === name);
      if (idx !== -1) {
        const item = window.editSiteShuttleState.right.splice(idx, 1)[0];
        window.editSiteShuttleState.left.push(item);
      }
    });
  }
  
  window.renderEditSiteShuttle();
};

window.closeEditSiteModal = function() {
  const modal = document.getElementById("edit-site-modal");
  if (modal) modal.remove();
};

window.submitEditSite = function() {
  const name = document.getElementById("edit-site-name").value.trim();
  if (!name) {
    alert("사이트명을 입력해 주세요.");
    return;
  }
  
  const mappedTiers = window.editSiteShuttleState.right.map(t => t.name);
  if (mappedTiers.length === 0) {
    alert("사이트에 최소 하나의 접근 등급을 추가해 주세요.");
    return;
  }
  
  const client = adminClientConfigs[currentClientId];
  const site = client.sites.find(s => s.siteId === window.editSiteShuttleState.siteId);
  if (site) {
    site.siteName = name;
    site.mappedTiers = mappedTiers;
  }
  
  closeEditSiteModal();
  loadClientSettings();
  showToast(`사이트 '${name}'의 설정이 저장되었습니다.`);
};

window.openAddSiteModal = function() {
  const client = adminClientConfigs[currentClientId];
  
  // Calculate which tiers are already mapped to another site
  const usedTiers = new Set();
  (client.sites || []).forEach(s => {
    (s.mappedTiers || []).forEach(t => {
      const name = typeof t === 'object' ? (t.name || t.id) : t;
      usedTiers.add(name);
    });
  });
  
  const allTiersMapped = (client.tiers || []).map(t => {
    const name = typeof t === 'object' ? (t.name || t.id) : t;
    return {
      name: name,
      isUsed: usedTiers.has(name)
    };
  });

  window.addSiteShuttleState = {
    left: allTiersMapped.filter(t => !t.isUsed),
    leftUsed: allTiersMapped.filter(t => t.isUsed),
    right: [],
    leftSearch: "",
    rightSearch: ""
  };

  const modal = document.createElement("div");
  modal.id = "add-site-modal";
  modal.style = "position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px;";
  modal.innerHTML = `
    <div class="config-card" style="width:100%; max-width:700px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border-radius:12px; overflow:hidden;">
      <div class="card-header">
        <h2 class="card-title">신규 사이트 추가</h2>
      </div>
      <div class="card-body">
        <div class="form-group" style="margin-bottom:16px;">
          <label class="form-label" style="font-weight:600; color:#334155; margin-bottom:8px; display:block;">사이트명</label>
          <input type="text" id="new-site-name" class="form-input" placeholder="예: 프리미엄 회원 사이트" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px; font-size:14px;">
        </div>
        <div class="form-group" style="margin-bottom:24px;">
          <label class="form-label" style="font-weight:600; color:#334155; margin-bottom:8px; display:block;">접근 허용 등급 선택 (Shuttle Box)</label>
          
          <div class="shuttle-box" style="display: flex; gap: 12px; align-items: stretch; margin-top: 8px;">
            <!-- Left List Panel -->
            <div class="shuttle-panel" style="flex: 1; border: 1px solid #cbd5e1; border-radius: 8px; background: white; display: flex; flex-direction: column; height: 260px; overflow: hidden;">
              <div style="padding: 8px 12px; background: #f8fafc; border-bottom: 1px solid #cbd5e1; font-weight: 600; font-size: 14px; color: #334155;">
                전체 서비스 등급 목록
              </div>
              <div style="padding: 8px; border-bottom: 1px solid #e2e8f0; background:#fff;">
                <input type="text" placeholder="등급 검색..." style="width: 100%; padding: 6px 10px; font-size: 14px; border: 1px solid #cbd5e1; border-radius: 4px; outline: none;" oninput="filterAddSiteLeft(this.value)">
              </div>
              <div id="add-site-shuttle-left" style="flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 6px; background:#f8fafc;">
                <!-- Dynamic left items -->
              </div>
            </div>

            <!-- Middle Action Buttons -->
            <div class="shuttle-actions" style="display: flex; flex-direction: column; justify-content: center; gap: 12px; width: 80px; align-items: center; padding: 0 4px;">
              <button type="button" class="btn btn-sm" onclick="moveAddSiteTiers('add')" style="width: 100%; font-size: 14px; font-weight: 600; padding: 10px 4px; display: flex; align-items: center; justify-content: center; gap: 2px; background:#17B890; color:white; border:none; border-radius:6px; cursor:pointer;">
                추가 ▶
              </button>
              <button type="button" class="btn btn-sm" onclick="moveAddSiteTiers('remove')" style="width: 100%; font-size: 14px; font-weight: 600; padding: 10px 4px; display: flex; align-items: center; justify-content: center; gap: 2px; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; border-radius:6px; cursor:pointer;">
                ◀ 제거
              </button>
            </div>

            <!-- Right List Panel -->
            <div class="shuttle-panel" style="flex: 1; border: 1px solid #cbd5e1; border-radius: 8px; background: white; display: flex; flex-direction: column; height: 260px; overflow: hidden;">
              <div style="padding: 8px 12px; background: #f8fafc; border-bottom: 1px solid #cbd5e1; font-weight: 600; font-size: 14px; color: #334155;">
                접속 허용할 등급 목록
              </div>
              <div style="padding: 8px; border-bottom: 1px solid #e2e8f0; background:#fff;">
                <input type="text" placeholder="등급 검색..." style="width: 100%; padding: 6px 10px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 4px; outline: none;" oninput="filterAddSiteRight(this.value)">
              </div>
              <div id="add-site-shuttle-right" style="flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 6px; background:#f8fafc;">
                <!-- Dynamic right items -->
              </div>
            </div>
          </div>
          
          <p style="font-size:12px; color:#64748b; margin-top:8px;">* 선택된 등급의 회원만 이 사이트로 진입이 가능해집니다. 이미 다른 사이트에 지정된 등급은 좌측 목록에서 비활성화되어 중복 매핑이 방지됩니다.</p>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:8px;">
          <button class="btn" onclick="closeAddSiteModal()">취소</button>
          <button class="btn btn-primary" onclick="submitAddSite()">추가하기</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  window.renderAddSiteShuttle();
};

window.filterAddSiteLeft = function(val) {
  window.addSiteShuttleState.leftSearch = val;
  window.renderAddSiteShuttle();
};

window.filterAddSiteRight = function(val) {
  window.addSiteShuttleState.rightSearch = val;
  window.renderAddSiteShuttle();
};

window.renderAddSiteShuttle = function() {
  const leftContainer = document.getElementById("add-site-shuttle-left");
  const rightContainer = document.getElementById("add-site-shuttle-right");
  if (!leftContainer || !rightContainer) return;

  const leftSearchText = (window.addSiteShuttleState.leftSearch || "").toLowerCase();
  const rightSearchText = (window.addSiteShuttleState.rightSearch || "").toLowerCase();

  // Render Left
  let leftHtml = "";
  
  // 1. Available active
  const filteredActiveLeft = window.addSiteShuttleState.left.filter(t => 
    t.name.toLowerCase().includes(leftSearchText)
  );
  filteredActiveLeft.forEach(t => {
    leftHtml += `
      <label style="display:flex; align-items:center; gap:8px; padding:6px 8px; font-size:14px; color:#475569; cursor:pointer; margin:0; background:#fff; border-radius:4px; border:1px solid #e2e8f0; user-select:none;">
        <input type="checkbox" class="add-site-left-chk" value="${t.name}" style="width:14px; height:14px; accent-color:#17B890;">
        <span style="font-weight:500;">${t.name}</span>
      </label>
    `;
  });

  // 2. Disabled used
  const filteredUsedLeft = window.addSiteShuttleState.leftUsed.filter(t => 
    t.name.toLowerCase().includes(leftSearchText)
  );
  filteredUsedLeft.forEach(t => {
    leftHtml += `
      <label style="display:flex; align-items:center; gap:8px; padding:6px 8px; font-size:14px; color:#94a3b8; cursor:not-allowed; margin:0; background:#f8fafc; border-radius:4px; border:1px dashed #cbd5e1; opacity:0.75; user-select:none;">
        <input type="checkbox" disabled checked style="width:14px; height:14px; cursor:not-allowed; opacity:0.5;">
        <span style="text-decoration:line-through; font-weight:500;">${t.name}</span>
        <span style="font-size:11px; color:#f97316; background:#fff7ed; padding:1px 6px; border-radius:4px; margin-left:auto; border:1px solid #ffedd5;">다른 사이트 지정됨</span>
      </label>
    `;
  });

  if (leftHtml === "") {
    leftHtml = `<div style="text-align:center; color:#94a3b8; font-size:13px; margin-top:20px;">검색 결과 또는 전체 등급이 없습니다.</div>`;
  }
  leftContainer.innerHTML = leftHtml;

  // Render Right
  let rightHtml = "";
  const filteredRight = window.addSiteShuttleState.right.filter(t => 
    t.name.toLowerCase().includes(rightSearchText)
  );
  filteredRight.forEach(t => {
    rightHtml += `
      <label style="display:flex; align-items:center; gap:8px; padding:6px 8px; font-size:14px; color:#475569; cursor:pointer; margin:0; background:#fff; border-radius:4px; border:1px solid #e2e8f0; user-select:none;">
        <input type="checkbox" class="add-site-right-chk" value="${t.name}" style="width:14px; height:14px; accent-color:#17B890;">
        <span style="font-weight:500;">${t.name}</span>
      </label>
    `;
  });

  if (rightHtml === "") {
    rightHtml = `<div style="text-align:center; color:#94a3b8; font-size:13px; margin-top:20px;">선택된 등급이 없습니다.<br/>(좌측에서 선택 후 추가)</div>`;
  }
  rightContainer.innerHTML = rightHtml;
};

window.moveAddSiteTiers = function(action) {
  if (action === 'add') {
    const checked = Array.from(document.querySelectorAll('.add-site-left-chk:checked')).map(el => el.value);
    if (checked.length === 0) {
      alert("추가할 등급을 좌측 목록에서 선택해 주세요.");
      return;
    }
    
    // Safety check for used list
    const alreadyUsed = checked.filter(name => window.addSiteShuttleState.leftUsed.some(u => u.name === name));
    if (alreadyUsed.length > 0) {
      alert(`이미 다른 사이트에 지정된 등급(${alreadyUsed.join(", ")})은 중복 지정할 수 없습니다.`);
      return;
    }

    checked.forEach(name => {
      const idx = window.addSiteShuttleState.left.findIndex(t => t.name === name);
      if (idx !== -1) {
        const item = window.addSiteShuttleState.left.splice(idx, 1)[0];
        window.addSiteShuttleState.right.push(item);
      }
    });
  } else if (action === 'remove') {
    const checked = Array.from(document.querySelectorAll('.add-site-right-chk:checked')).map(el => el.value);
    if (checked.length === 0) {
      alert("제거할 등급을 우측 목록에서 선택해 주세요.");
      return;
    }

    checked.forEach(name => {
      const idx = window.addSiteShuttleState.right.findIndex(t => t.name === name);
      if (idx !== -1) {
        const item = window.addSiteShuttleState.right.splice(idx, 1)[0];
        window.addSiteShuttleState.left.push(item);
      }
    });
  }
  
  window.renderAddSiteShuttle();
};

window.closeAddSiteModal = function() {
  const modal = document.getElementById("add-site-modal");
  if (modal) modal.remove();
};

window.submitAddSite = function() {
  const name = document.getElementById("new-site-name").value.trim();
  if (!name) {
    alert("사이트명을 입력해 주세요.");
    return;
  }
  
  const mappedTiers = window.addSiteShuttleState.right.map(t => t.name);
  if (mappedTiers.length === 0) {
    alert("사이트에 최소 하나의 접근 등급을 추가해 주세요.");
    return;
  }
  
  const client = adminClientConfigs[currentClientId];
  const newSiteId = "site_" + Date.now();
  
  const defaultSite = client.sites[0] || {};
  const newSite = {
    siteId: newSiteId,
    siteName: name,
    mappedTiers: mappedTiers,
    logoImage: defaultSite.logoImage || null,
    themeColor: defaultSite.themeColor || BRAND_DEFAULTS.themeColor,
    themeColorRgb: defaultSite.themeColorRgb || BRAND_DEFAULTS.themeColorRgb,
    menuTextColor: defaultSite.menuTextColor || BRAND_DEFAULTS.menuTextColor,
    heroText: { title: name + "에 오신 것을 환영합니다", subtitle: "고객님을 위한 특별한 혜택과 정보를 제공합니다." },
    serviceName: defaultSite.serviceName || client.serviceName || client.name || "",
    csNumber: defaultSite.csNumber || client.csNumber || "",
    name: defaultSite.name || client.name || "",
    clientLink: defaultSite.clientLink || "",
    providerName: defaultSite.providerName || BRAND_DEFAULTS.providerName,
    providerLink: defaultSite.providerLink || BRAND_DEFAULTS.providerLink,
    menus: JSON.parse(JSON.stringify(defaultMenus))
  };
  
  client.sites.push(newSite);
  currentSiteId = newSiteId;
  closeAddSiteModal();
  loadClientSettings();
  showToast(`신규 사이트 '${name}'가 추가되었습니다.`);
};

window.deleteActiveSite = function() {
  const client = adminClientConfigs[currentClientId];
  if (client.sites.length <= 1) {
    alert("최소 1개의 사이트는 유지되어야 합니다.");
    return;
  }
  
  const activeSite = client.sites.find(s => s.siteId === currentSiteId);
  if (confirm(`현재 사이트 '${activeSite.siteName}'를 정말로 삭제하시겠습니까?\n이 사이트의 모든 메뉴 구성 및 브랜드 디자인 정보가 함께 영구 삭제됩니다.`)) {
    client.sites = client.sites.filter(s => s.siteId !== currentSiteId);
    currentSiteId = client.sites[0].siteId;
    loadClientSettings();
    showToast("선택한 사이트가 삭제되었습니다.");
  }
};

window.openMenuRBACModal = function(menuId) {
  const client = adminClientConfigs[currentClientId];
  const activeSite = client.sites.find(s => s.siteId === currentSiteId) || client.sites[0];
  const menu = findMenuById(activeSite.menus, menuId);
  if (!menu) return;
  
  const allSiteTiers = (activeSite.mappedTiers || []).map(t => {
    return typeof t === 'object' ? (t.name || t.id) : t;
  });
  const exposed = (menu.exposedTiers || []).map(t => {
    return typeof t === 'object' ? (t.name || t.id) : t;
  });

  window.rbacShuttleState = {
    left: allSiteTiers.filter(t => !exposed.includes(t)).map(name => ({ name })),
    right: exposed.map(name => ({ name })),
    leftSearch: "",
    rightSearch: ""
  };

  const modal = document.createElement("div");
  modal.id = "menu-rbac-modal";
  modal.style = "position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px;";
  modal.innerHTML = `
    <div class="config-card" style="width:100%; max-width:640px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border-radius:12px; overflow:hidden;">
      <div class="card-header" style="border-bottom:1px solid #e2e8f0; background:#f8fafc; padding:16px 24px;">
        <h2 class="card-title" style="font-size:16px; font-weight:700; color:#1e293b; margin:0;">⚙️ '${menu.label || menu.defaultLabel}' 노출 조건 설정</h2>
      </div>
      <div class="card-body" style="padding:24px;">
        <div style="margin-bottom:16px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:12px; font-size:13px; color:#1e3a8a; line-height:1.5;">
          <strong>합집합(OR) 노출 원칙:</strong><br/>
          선택한 등급 중 <u>하나라도 보유한 사용자</u>에게만 이 메뉴가 노출됩니다.<br/>
          아무것도 선택하지 않으면 해당 사이트에 접근 가능한 <strong>모든 회원에게 공통 노출</strong>됩니다.
        </div>
        
        <div style="font-weight:600; font-size:14px; color:#334155; margin-bottom:12px;">노출 허용 등급 선택 (Shuttle Box)</div>
        
        <div class="shuttle-box" style="display: flex; gap: 12px; align-items: stretch; margin-top: 8px;">
          <!-- Left List Panel -->
          <div class="shuttle-panel" style="flex: 1; border: 1px solid #cbd5e1; border-radius: 8px; background: white; display: flex; flex-direction: column; height: 260px; overflow: hidden;">
            <div style="padding: 8px 12px; background: #f8fafc; border-bottom: 1px solid #cbd5e1; font-weight: 600; font-size: 13px; color: #334155;">
              전체 사이트 권한 등급
            </div>
            <div style="padding: 8px; border-bottom: 1px solid #e2e8f0; background:#fff;">
              <input type="text" placeholder="등급 검색..." style="width: 100%; padding: 6px 10px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 4px; outline: none;" oninput="filterRbacLeft(this.value)">
            </div>
            <div id="rbac-shuttle-left" style="flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 6px; background:#f8fafc;">
              <!-- Dynamic left items -->
            </div>
          </div>

          <!-- Middle Action Buttons -->
          <div class="shuttle-actions" style="display: flex; flex-direction: column; justify-content: center; gap: 12px; width: 80px; align-items: center; padding: 0 4px;">
            <button type="button" class="btn btn-sm" onclick="moveRbacTiers('add')" style="width: 100%; font-size: 13px; font-weight: 600; padding: 10px 4px; display: flex; align-items: center; justify-content: center; gap: 2px; background:${activeSite.themeColor || '#17B890'}; color:white; border:none; border-radius:6px; cursor:pointer;">
              추가 ▶
            </button>
            <button type="button" class="btn btn-sm" onclick="moveRbacTiers('remove')" style="width: 100%; font-size: 13px; font-weight: 600; padding: 10px 4px; display: flex; align-items: center; justify-content: center; gap: 2px; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; border-radius:6px; cursor:pointer;">
              ◀ 제거
            </button>
          </div>

          <!-- Right List Panel -->
          <div class="shuttle-panel" style="flex: 1; border: 1px solid #cbd5e1; border-radius: 8px; background: white; display: flex; flex-direction: column; height: 260px; overflow: hidden;">
            <div style="padding: 8px 12px; background: #f8fafc; border-bottom: 1px solid #cbd5e1; font-weight: 600; font-size: 13px; color: #334155;">
              노출 허용할 등급 목록
            </div>
            <div style="padding: 8px; border-bottom: 1px solid #e2e8f0; background:#fff;">
              <input type="text" placeholder="등급 검색..." style="width: 100%; padding: 6px 10px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 4px; outline: none;" oninput="filterRbacRight(this.value)">
            </div>
            <div id="rbac-shuttle-right" style="flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 6px; background:#f8fafc;">
              <!-- Dynamic right items -->
            </div>
          </div>
        </div>
        
        <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:24px;">
          <button class="btn btn-secondary btn-sm" onclick="closeMenuRBACModal()">취소</button>
          <button class="btn btn-primary btn-sm" style="background:${activeSite.themeColor || '#17B890'}; border:none;" onclick="submitMenuRBAC('${menuId}')">조건 저장</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  window.renderRbacShuttle();
};

window.filterRbacLeft = function(val) {
  window.rbacShuttleState.leftSearch = val;
  window.renderRbacShuttle();
};

window.filterRbacRight = function(val) {
  window.rbacShuttleState.rightSearch = val;
  window.renderRbacShuttle();
};

window.renderRbacShuttle = function() {
  const leftContainer = document.getElementById("rbac-shuttle-left");
  const rightContainer = document.getElementById("rbac-shuttle-right");
  if (!leftContainer || !rightContainer) return;

  const leftSearchText = (window.rbacShuttleState.leftSearch || "").toLowerCase();
  const rightSearchText = (window.rbacShuttleState.rightSearch || "").toLowerCase();

  // Render Left
  let leftHtml = "";
  const filteredLeft = window.rbacShuttleState.left.filter(t => 
    t.name.toLowerCase().includes(leftSearchText)
  );
  filteredLeft.forEach(t => {
    leftHtml += `
      <label style="display:flex; align-items:center; gap:8px; padding:6px 8px; font-size:13px; color:#475569; cursor:pointer; margin:0; background:#fff; border-radius:4px; border:1px solid #e2e8f0; user-select:none;">
        <input type="checkbox" class="rbac-left-chk" value="${t.name}" style="width:14px; height:14px; accent-color:#17B890;">
        <span style="font-weight:500;">${t.name}</span>
      </label>
    `;
  });

  if (leftHtml === "") {
    leftHtml = `<div style="text-align:center; color:#94a3b8; font-size:12px; margin-top:20px;">검색 결과 또는 전체 등급이 없습니다.</div>`;
  }
  leftContainer.innerHTML = leftHtml;

  // Render Right
  let rightHtml = "";
  const filteredRight = window.rbacShuttleState.right.filter(t => 
    t.name.toLowerCase().includes(rightSearchText)
  );
  filteredRight.forEach(t => {
    rightHtml += `
      <label style="display:flex; align-items:center; gap:8px; padding:6px 8px; font-size:13px; color:#475569; cursor:pointer; margin:0; background:#fff; border-radius:4px; border:1px solid #e2e8f0; user-select:none;">
        <input type="checkbox" class="rbac-right-chk" value="${t.name}" style="width:14px; height:14px; accent-color:#17B890;">
        <span style="font-weight:500;">${t.name}</span>
      </label>
    `;
  });

  if (rightHtml === "") {
    rightHtml = `<div style="text-align:center; color:#94a3b8; font-size:12px; margin-top:20px;">선택된 등급이 없습니다.<br/>(좌측에서 선택 후 추가)</div>`;
  }
  rightContainer.innerHTML = rightHtml;
};

window.moveRbacTiers = function(action) {
  if (action === 'add') {
    const checked = Array.from(document.querySelectorAll('.rbac-left-chk:checked')).map(el => el.value);
    if (checked.length === 0) {
      alert("추가할 등급을 좌측 목록에서 선택해 주세요.");
      return;
    }

    checked.forEach(name => {
      const idx = window.rbacShuttleState.left.findIndex(t => t.name === name);
      if (idx !== -1) {
        const item = window.rbacShuttleState.left.splice(idx, 1)[0];
        window.rbacShuttleState.right.push(item);
      }
    });
  } else if (action === 'remove') {
    const checked = Array.from(document.querySelectorAll('.rbac-right-chk:checked')).map(el => el.value);
    if (checked.length === 0) {
      alert("제거할 등급을 우측 목록에서 선택해 주세요.");
      return;
    }

    checked.forEach(name => {
      const idx = window.rbacShuttleState.right.findIndex(t => t.name === name);
      if (idx !== -1) {
        const item = window.rbacShuttleState.right.splice(idx, 1)[0];
        window.rbacShuttleState.left.push(item);
      }
    });
  }
  
  window.renderRbacShuttle();
};

window.closeMenuRBACModal = function() {
  const modal = document.getElementById("menu-rbac-modal");
  if (modal) modal.remove();
};

window.submitMenuRBAC = function(menuId) {
  const client = adminClientConfigs[currentClientId];
  const activeSite = client.sites.find(s => s.siteId === currentSiteId) || client.sites[0];
  const menu = findMenuById(activeSite.menus, menuId);
  if (!menu) return;
  
  const selectedTiers = window.rbacShuttleState.right.map(t => t.name);
  
  menu.exposedTiers = selectedTiers;
  closeMenuRBACModal();
  showToast(`'${menu.label}'의 노출 등급 조건이 설정되었습니다.`);
};

// --- View: Health Info ---
function renderHealthInfo(container) {
  container.innerHTML = `
    <div id="health-list-view">
      <div class="page-header">
        <div><h1 class="page-title">건강 매거진 관리</h1><p class="page-subtitle">건강정보 게시글을 관리합니다.</p></div>
        <button class="btn btn-primary" onclick="showHealthEditor()">새 글 등록</button>
      </div>
      <div class="config-card">
        <div class="card-header">
          <h2 class="card-title">게시글 목록</h2>
          <select id="health-cat-filter" class="form-select" style="min-width:180px;" onchange="healthFilterPosts()"></select>
        </div>
        <div class="card-body" style="padding:0;">
          <table class="health-table" style="width:100%;">
            <thead><tr><th width="80">번호</th><th width="150">카테고리</th><th>제목</th><th width="120">작성일</th><th width="150">관리</th></tr></thead>
            <tbody id="health-posts-body"></tbody>
          </table>
          <div class="pagination" id="health-pagination"></div>
        </div>
      </div>
    </div>
    <div id="health-editor-view" style="display:none;">
       <!-- Content via showHealthEditor -->
    </div>
  `;

  const filter = document.getElementById('health-cat-filter');
  filter.innerHTML = '<option value="all">전체 카테고리</option>';
  healthCategories.forEach(c => filter.innerHTML += `<option value="${c}">${c}</option>`);

  renderHealthPosts();
}

window.renderHealthPosts = function() {
  const tbody = document.getElementById('health-posts-body');
  const cat = document.getElementById('health-cat-filter').value;
  let filtered = healthPosts;
  if(cat !== 'all') filtered = healthPosts.filter(p => p.category === cat);

  const total = filtered.length;
  const pages = Math.ceil(total / HEALTH_ITEMS_PER_PAGE) || 1;
  const start = (healthCurrentPage - 1) * HEALTH_ITEMS_PER_PAGE;
  const items = filtered.slice(start, start + HEALTH_ITEMS_PER_PAGE);

  tbody.innerHTML = items.length ? '' : '<tr><td colspan="5" style="text-align:center; padding:32px;">데이터가 없습니다.</td></tr>';
  items.forEach((p, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${total - start - i}</td>
        <td><span class="badge-cat badge-basic">${p.category}</span></td>
        <td style="font-weight:600;">${p.title}</td>
        <td style="color:#64748b;">${p.date}</td>
        <td>
          <button class="btn btn-sm" onclick="editHealthPost('${p.id}')">수정</button>
          <button class="btn btn-sm" style="color:#ef4444;" onclick="deleteHealthPost('${p.id}')">삭제</button>
        </td>
      </tr>
    `;
  });

  const pagin = document.getElementById('health-pagination');
  pagin.innerHTML = '';
  for(let i=1; i<=pages; i++) {
    const btn = document.createElement('button');
    btn.className = `page-btn ${i === healthCurrentPage ? 'active' : ''}`;
    btn.textContent = i;
    btn.onclick = () => { healthCurrentPage = i; renderHealthPosts(); };
    pagin.appendChild(btn);
  }
};

window.healthFilterPosts = function() { healthCurrentPage = 1; renderHealthPosts(); };

window.showHealthEditor = function(id = null) {
  healthCurrentEditId = id;
  const post = id ? healthPosts.find(p => p.id === id) : null;

  document.getElementById('health-list-view').style.display = 'none';
  const editorView = document.getElementById('health-editor-view');
  editorView.style.display = 'block';
  editorView.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title">${id ? '게시글 수정' : '새 게시글 등록'}</h1></div>
      <div>
        <button class="btn" style="margin-right:8px;" onclick="hideHealthEditor()">취소</button>
        <button class="btn btn-primary" onclick="saveHealthPost()">저장하기</button>
      </div>
    </div>
    <div class="config-card">
      <div class="card-body">
        <div style="display:flex; gap:16px; margin-bottom:16px;">
          <select id="h-post-cat" class="form-select" style="flex:1;"></select>
          <input id="h-post-title" class="form-input" style="flex:3;" placeholder="제목을 입력하세요" value="${post ? post.title : ''}">
        </div>
        <div class="editor-toolbar">
          <button class="editor-btn" onclick="execCmd('bold')">B</button>
          <button class="editor-btn" onclick="execCmd('italic')">I</button>
          <button class="editor-btn" onclick="execCmd('underline')">U</button>
          <button class="editor-btn" onclick="execCmd('justifyLeft')">L</button>
          <button class="editor-btn" onclick="execCmd('justifyCenter')">C</button>
        </div>
        <div id="h-visual-editor" class="editor-content" contenteditable="true" style="border:1px solid #e2e8f0; padding:16px;">${post ? post.content : ''}</div>
      </div>
    </div>
  `;
  const catSel = document.getElementById('h-post-cat');
  healthCategories.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    if(post && post.category === c) opt.selected = true;
    catSel.appendChild(opt);
  });
};

window.hideHealthEditor = function() {
  document.getElementById('health-editor-view').style.display = 'none';
  document.getElementById('health-list-view').style.display = 'block';
};

window.execCmd = function(cmd) { document.execCommand(cmd, false, null); };

window.saveHealthPost = function() {
  const title = document.getElementById('h-post-title').value.trim();
  const category = document.getElementById('h-post-cat').value;
  const content = document.getElementById('h-visual-editor').innerHTML;
  if(!title) return alert("제목을 입력하세요.");

  if(healthCurrentEditId) {
    const p = healthPosts.find(x => x.id === healthCurrentEditId);
    p.title = title; p.category = category; p.content = content;
  } else {
    healthPosts.unshift({ id: 'post_'+Date.now(), title, category, content, date: new Date().toISOString().split('T')[0] });
  }
  localStorage.setItem('hc_health_posts', JSON.stringify(healthPosts));
  showToast("저장되었습니다.");
  hideHealthEditor();
  renderHealthPosts();
};

window.deleteHealthPost = function(id) {
  if(confirm("삭제하시겠습니까?")) {
    healthPosts = healthPosts.filter(p => p.id !== id);
    localStorage.setItem('hc_health_posts', JSON.stringify(healthPosts));
    renderHealthPosts();
  }
};

// --- View: Hospitals ---
function renderHospitals(container) {
  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title">제휴 병원 관리</h1><p class="page-subtitle">병원 정보를 관리합니다.</p></div>
      <button class="btn btn-primary" onclick="showHospitalEditor()">+ 신규 병원 등록</button>
    </div>
    <div id="hosp-list-grid" class="hosp-grid"></div>
    <div id="hosp-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:100; align-items:center; justify-content:center; padding:20px;">
       <div class="config-card" style="width:100%; max-width:800px;">
          <div class="card-header"><h2 class="card-title" id="hosp-modal-title">병원 등록</h2></div>
          <div class="card-body">
             <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                <div class="form-group"><label class="form-label">병원명</label><input id="modal-h-name" class="form-input"></div>
                <div class="form-group"><label class="form-label">전화번호</label><input id="modal-h-phone" class="form-input"></div>
                <div class="form-group" style="grid-column:1/-1;"><label class="form-label">주소</label><input id="modal-h-addr" class="form-input"></div>
                <div class="form-group"><label class="form-label">예약 담당자</label><input id="modal-h-res" class="form-input"></div>
                <div class="form-group"><label class="form-label">정산 담당자</label><input id="modal-h-con" class="form-input"></div>
             </div>
             <div style="margin-top:24px; display:flex; justify-content:flex-end; gap:8px;">
                <button class="btn" onclick="hideHospitalEditor()">취소</button>
                <button class="btn btn-primary" onclick="saveHospitalData()">저장</button>
             </div>
          </div>
       </div>
    </div>
  `;
  renderHospitalsGrid();
}

function renderHospitalsGrid() {
  const grid = document.getElementById('hosp-list-grid');
  grid.innerHTML = '';
  hospitals.forEach(h => {
    grid.innerHTML += `
      <div class="hosp-card" onclick="showHospitalEditor('${h.id}')">
        <div class="hosp-name">${h.name}</div>
        <div class="hosp-info">${h.addr}</div>
        <div class="hosp-info">${h.phone}</div>
        <div style="margin-top:8px;"><span class="badge-mgr">예약: ${h.resName}</span> <span class="badge-mgr">정산: ${h.conName}</span></div>
        <button class="btn btn-sm" style="position:absolute; top:12px; right:12px; color:#ef4444; border:none;" onclick="event.stopPropagation(); deleteHospitalData('${h.id}')">삭제</button>
      </div>
    `;
  });
}

window.showHospitalEditor = function(id = null) {
  hospitalEditingId = id;
  document.getElementById('hosp-modal').style.display = 'flex';
  if(id) {
    const h = hospitals.find(x => x.id === id);
    document.getElementById('hosp-modal-title').textContent = "병원 정보 수정";
    document.getElementById('modal-h-name').value = h.name;
    document.getElementById('modal-h-phone').value = h.phone;
    document.getElementById('modal-h-addr').value = h.addr;
    document.getElementById('modal-h-res').value = h.resName;
    document.getElementById('modal-h-con').value = h.conName;
  } else {
    document.getElementById('hosp-modal-title').textContent = "신규 병원 등록";
    document.querySelectorAll('#hosp-modal input').forEach(i => i.value = '');
  }
};

window.hideHospitalEditor = function() { document.getElementById('hosp-modal').style.display = 'none'; };

window.saveHospitalData = function() {
  const name = document.getElementById('modal-h-name').value;
  if(!name) return;
  const data = { 
    name, 
    phone: document.getElementById('modal-h-phone').value,
    addr: document.getElementById('modal-h-addr').value,
    resName: document.getElementById('modal-h-res').value,
    conName: document.getElementById('modal-h-con').value
  };
  if(hospitalEditingId) {
    const h = hospitals.find(x => x.id === hospitalEditingId);
    Object.assign(h, data);
  } else {
    hospitals.push({ id: 'h'+Date.now(), ...data });
  }
  localStorage.setItem('hc_hospitals', JSON.stringify(hospitals));
  hideHospitalEditor();
  renderHospitalsGrid();
  showToast("저장되었습니다.");
};

window.deleteHospitalData = function(id) {
  if(confirm("삭제하시겠습니까?")) {
    hospitals = hospitals.filter(x => x.id !== id);
    localStorage.setItem('hc_hospitals', JSON.stringify(hospitals));
    renderHospitalsGrid();
  }
};

// --- View: Packages ---
function renderPackages(container) {
  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title">검진 패키지 관리</h1><p class="page-subtitle">병원별 패키지를 설정합니다.</p></div>
      <button class="btn btn-primary" onclick="showPackageEditor()">+ 신규 패키지 등록</button>
    </div>
    <div class="config-card">
       <div class="card-body" style="padding:0;">
          <table class="item-table" style="width:100%;">
            <thead><tr><th width="80">연도</th><th width="120">구분</th><th width="200">병원</th><th>패키지명</th><th width="100">관리</th></tr></thead>
            <tbody id="pkg-list-body"></tbody>
          </table>
       </div>
    </div>
    <div id="pkg-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:100; align-items:center; justify-content:center; padding:20px;">
       <div class="config-card" style="width:100%; max-width:900px; max-height:90vh; overflow-y:auto;">
          <div class="card-header"><h2 class="card-title">패키지 설정</h2><button class="btn btn-sm" onclick="hidePackageEditor()">닫기</button></div>
          <div class="card-body">
             <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px;">
                <div class="form-group"><label class="form-label">연도</label><select id="p-year" class="form-select"><option>2026</option><option>2025</option></select></div>
                <div class="form-group"><label class="form-label">병원</label><select id="p-hosp" class="form-select"></select></div>
                <div class="form-group"><label class="form-label">구분</label><select id="p-type" class="form-select"><option>B2B</option><option>B2C</option></select></div>
             </div>
             <div class="form-group" style="margin-top:16px;"><label class="form-label">패키지명</label><input id="p-name" class="form-input"></div>
             <div style="margin-top:24px; display:flex; justify-content:flex-end;"><button class="btn btn-primary" onclick="savePackageData()">패키지 저장</button></div>
          </div>
       </div>
    </div>
  `;
  renderPackagesTable();
}

function renderPackagesTable() {
  const tbody = document.getElementById('pkg-list-body');
  tbody.innerHTML = packages.length ? '' : '<tr><td colspan="5" style="text-align:center; padding:32px;">데이터가 없습니다.</td></tr>';
  packages.forEach(p => {
    const h = hospitals.find(x => x.id === p.hospitalId);
    tbody.innerHTML += `
      <tr>
        <td>${p.year}</td>
        <td><span class="badge-cat badge-basic">${p.type}</span></td>
        <td>${h ? h.name : '알수없음'}</td>
        <td style="font-weight:600;">${p.name}</td>
        <td><button class="btn btn-sm" onclick="showPackageEditor('${p.id}')">수정</button></td>
      </tr>
    `;
  });
}

window.showPackageEditor = function(id = null) {
  packageEditingId = id;
  document.getElementById('pkg-modal').style.display = 'flex';
  const hSel = document.getElementById('p-hosp');
  hSel.innerHTML = hospitals.map(h => `<option value="${h.id}">${h.name}</option>`).join('');
  
  if(id) {
    const p = packages.find(x => x.id === id);
    document.getElementById('p-year').value = p.year;
    document.getElementById('p-hosp').value = p.hospitalId;
    document.getElementById('p-type').value = p.type;
    document.getElementById('p-name').value = p.name;
  } else {
    document.getElementById('p-name').value = '';
  }
};

window.hidePackageEditor = function() { document.getElementById('pkg-modal').style.display = 'none'; };

window.savePackageData = function() {
  const name = document.getElementById('p-name').value;
  if(!name) return;
  const data = { 
    year: document.getElementById('p-year').value,
    hospitalId: document.getElementById('p-hosp').value,
    type: document.getElementById('p-type').value,
    name
  };
  if(packageEditingId) {
    const p = packages.find(x => x.id === packageEditingId);
    Object.assign(p, data);
  } else {
    packages.push({ id: 'pkg'+Date.now(), ...data, items: { basic: [], optional: [] } });
  }
  localStorage.setItem('hc_packages', JSON.stringify(packages));
  hidePackageEditor();
  renderPackagesTable();
  showToast("저장되었습니다.");
};

// --- View: Items ---
function renderItemsView(container) {
  container.innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title">검진 항목 마스터 관리</h1><p class="page-subtitle">패키지 구성에 사용될 공통 항목들을 관리합니다.</p></div>
    </div>
    <div style="display:grid; grid-template-columns:1fr 2fr; gap:24px; align-items:start;">
       <div class="config-card">
          <div class="card-header"><h2 class="card-title" id="item-form-title">항목 등록</h2></div>
          <div class="card-body">
             <div class="form-group"><label class="form-label">대분류</label><select id="i-large" class="form-select"></select></div>
             <div class="form-group" style="margin-top:12px;"><label class="form-label">중분류</label><input id="i-medium" class="form-input"></div>
             <div class="form-group" style="margin-top:12px;"><label class="form-label">검사명</label><input id="i-name" class="form-input"></div>
             <button class="btn btn-primary" style="width:100%; margin-top:24px;" onclick="saveItemData()">저장하기</button>
          </div>
       </div>
       <div class="config-card">
          <div class="card-body" style="padding:0;">
             <table class="item-table" style="width:100%;">
                <thead><tr><th>분류</th><th>검사명</th><th width="80">관리</th></tr></thead>
                <tbody id="items-list-body"></tbody>
             </table>
          </div>
       </div>
    </div>
  `;
  const largeSel = document.getElementById('i-large');
  ["기초검사", "혈액검사", "초음파", "내시경", "암진단"].forEach(c => largeSel.innerHTML += `<option value="${c}">${c}</option>`);
  renderItemsList();
}

function renderItemsList() {
  const tbody = document.getElementById('items-list-body');
  tbody.innerHTML = '';
  masterItems.forEach(i => {
    tbody.innerHTML += `
      <tr>
        <td><span class="badge-cat badge-imaging">${i.large}</span></td>
        <td><strong>${i.name}</strong><div style="font-size:12px; color:#64748b;">${i.medium || ''}</div></td>
        <td><button class="btn btn-sm" style="color:#ef4444;" onclick="deleteItemData('${i.id}')">삭제</button></td>
      </tr>
    `;
  });
}

window.saveItemData = function() {
  const name = document.getElementById('i-name').value;
  if(!name) return;
  masterItems.push({
    id: Date.now(),
    large: document.getElementById('i-large').value,
    medium: document.getElementById('i-medium').value,
    name
  });
  localStorage.setItem('hc_checkup_items', JSON.stringify(masterItems));
  renderItemsList();
  document.getElementById('i-name').value = '';
  showToast("등록되었습니다.");
};

window.deleteItemData = function(id) {
  if(confirm("삭제하시겠습니까?")) {
    masterItems = masterItems.filter(x => x.id != id);
    localStorage.setItem('hc_checkup_items', JSON.stringify(masterItems));
    renderItemsList();
  }
};

// --- Common Utils ---
window.showToast = function(message) {
  let container = document.getElementById("toast-container");
  if(!container) {
    container = document.createElement('div');
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg class="toast-icon" fill="currentColor" viewBox="0 0 20 20" width="24" height="24"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
    <span class="toast-msg">${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = "fadeOut 0.3s forwards";
    setTimeout(() => { if(container.contains(toast)) container.removeChild(toast); }, 300);
  }, 3000);
};

// --- Online Inquiry Management ---
function renderOnlineInquiryView(container) {
  const inquiries = JSON.parse(localStorage.getItem('hc_inquiries') || '[]');

  container.innerHTML = `
    <div class="view-header">
      <h1 class="view-title">온라인 문의 관리</h1>
      <p class="view-subtitle">사용자가 제출한 온라인 문의 내역을 확인하고 답변을 등록합니다.</p>
    </div>

    <div class="card">
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>고객사</th>
              <th>서비스분류</th>
              <th>문의유형</th>
              <th>작성자</th>
              <th>제목</th>
              <th>작성일</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            ${inquiries.length === 0 ? `
              <tr><td colspan="9" style="text-align:center; padding:40px; color:#94a3b8;">접수된 문의 내역이 없습니다.</td></tr>
            ` : inquiries.map(item => {
              const cat = item.category || '건강상담';
              let badgeStyle = 'background:rgba(59, 130, 246, 0.1); color:#1d4ed8;';
              if (cat === '병원안내') {
                badgeStyle = 'background:rgba(16, 185, 129, 0.1); color:#047857;';
              } else if (cat === '진료예약') {
                badgeStyle = 'background:rgba(124, 58, 237, 0.1); color:#6d28d9;';
              }
              const typeLabel = item.type === 'phone' ? '전화상담' : '온라인문의';
              const typeBadgeStyle = item.type === 'phone' ? 'background:rgba(47, 74, 154, 0.1); color:#2F4A9A;' : 'background:rgba(23, 184, 144, 0.1); color:#17B890;';
              return `
                <tr>
                  <td>${item.id}</td>
                  <td><span class="badge" style="background:#e2e8f0; color:#475569;">${item.clientId}</span></td>
                  <td><span class="badge" style="${badgeStyle} font-weight:700;">${cat}</span></td>
                  <td><span class="badge" style="${typeBadgeStyle} font-weight:700;">${typeLabel}</span></td>
                  <td>${item.userName}</td>
                  <td style="font-weight:600;">${item.title}</td>
                  <td>${item.date}</td>
                  <td>
                    <span class="badge" style="background:${item.status === '완료' ? '#17B890' : '#f59e0b'}; color:white; padding:4px 8px; border-radius:4px; font-size:12px;">
                      ${item.status === '완료' ? '답변완료' : '답변대기'}
                    </span>
                  </td>
                  <td>
                    <button class="btn-action" onclick="openAnswerForm(${item.id})">
                      ${item.status === '완료' ? '답변수정' : '답변작성'}
                    </button>
                  </td>
                </tr>
              `;
            }).reverse().join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div id="answer-modal" class="modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:2000; align-items:center; justify-content:center;">
      <div class="card" style="width:600px; max-height:90vh; overflow-y:auto; padding:32px; background:white; border-radius:12px;">
        <h2 style="margin-bottom:24px;">답변 작성</h2>
        <input type="hidden" id="active-inquiry-id">
        <div id="inquiry-preview" style="background:#f8fafc; padding:20px; border-radius:8px; margin-bottom:24px; border:1px solid #e2e8f0;">
          <p style="font-size:12px; color:#64748b; margin-bottom:4px;">문의 내용</p>
          <p id="preview-text" style="font-size:14px; color:#1e293b; line-height:1.6; font-weight:500;"></p>
        </div>
        <div class="form-group">
          <label class="form-label">답변 내용</label>
          <textarea id="admin-answer-text" class="form-input" style="min-height:200px; resize:vertical; width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px;" placeholder="답변 내용을 입력하세요."></textarea>
        </div>
        <div style="display:flex; gap:12px; justify-content:flex-end; margin-top:32px;">
          <button class="btn-secondary" onclick="closeAnswerModal()" style="padding:10px 24px; cursor:pointer;">취소</button>
          <button class="btn-primary" onclick="saveAdminAnswer()" style="padding:10px 32px; cursor:pointer;">답변 저장</button>
        </div>
      </div>
    </div>
  `;
}

window.openAnswerForm = function(id) {
  const modal = document.getElementById('answer-modal');
  const preview = document.getElementById('preview-text');
  const answerInput = document.getElementById('admin-answer-text');
  const idInput = document.getElementById('active-inquiry-id');
  
  const inquiries = JSON.parse(localStorage.getItem('hc_inquiries') || '[]');
  const inquiry = inquiries.find(iq => iq.id === id);
  
  if (inquiry) {
    idInput.value = id;
    preview.innerText = inquiry.content;
    answerInput.value = inquiry.answer || '';
    modal.style.display = 'flex';
  }
};

window.closeAnswerModal = function() {
  document.getElementById('answer-modal').style.display = 'none';
};

window.saveAdminAnswer = function() {
  const id = parseInt(document.getElementById('active-inquiry-id').value);
  const answer = document.getElementById('admin-answer-text').value;
  
  if (!answer) {
    showToast('답변 내용을 입력해주세요.');
    return;
  }
  
  const inquiries = JSON.parse(localStorage.getItem('hc_inquiries') || '[]');
  const idx = inquiries.findIndex(iq => iq.id === id);
  
  if (idx !== -1) {
    inquiries[idx].answer = answer;
    inquiries[idx].status = '완료';
    inquiries[idx].answerDate = new Date().toLocaleString();
    localStorage.setItem('hc_inquiries', JSON.stringify(inquiries));
    
    showToast('답변이 성공적으로 등록되었습니다.');
    closeAnswerModal();
    navigateTo('online-inquiry');
  }
};

window.renderClientManagement = function(container) {
  container.innerHTML = `
    <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
      <div>
        <h1 class="page-title">고객사 및 서비스 등급 관리</h1>
        <p class="page-subtitle">신규 고객사를 추가하고 각 고객사의 서비스 등급(Tiers)을 관리합니다.</p>
      </div>
      <button class="btn btn-primary" onclick="openAddClientModal()">+ 신규 고객사 추가</button>
    </div>

    <div class="client-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:24px;">
      <!-- Dynamic Client Cards -->
    </div>
  `;

  const grid = container.querySelector('.client-grid');
  Object.values(adminClientConfigs).forEach(client => {
    const card = document.createElement('div');
    card.className = 'config-card';
    card.style.cssText = 'border-radius: 12px; border: 1px solid #cbd5e1; background: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow:hidden; display:flex; flex-direction:column; position:relative;';
    
    const primaryColor = client.themeColor || client.sites?.[0]?.themeColor || '#17B890';
    
    card.innerHTML = `
      <div style="height:6px; background:${primaryColor};"></div>
      <div class="card-header" style="padding:20px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h3 style="margin:0; font-size:18px; font-weight:700; color:#1e293b;">${client.name}</h3>
          <span style="font-size:12px; color:#64748b; background:#f1f5f9; padding:2px 8px; border-radius:4px; font-weight:500; margin-top:4px; display:inline-block;">ID: ${client.id}</span>
        </div>
        <button class="btn btn-sm" style="color:#ef4444; border:1px solid #fee2e2; background:#fff5f5;" onclick="deleteClient('${client.id}')">삭제</button>
      </div>
      <div class="card-body" style="padding:20px; flex-grow:1; display:flex; flex-direction:column; gap:16px;">
        <div style="font-size:13px; color:#475569; display:grid; grid-template-columns: 80px 1fr; gap:8px;">
          <span style="font-weight:600; color:#64748b;">서비스명:</span>
          <span>${client.serviceName || client.name}</span>
          <span style="font-weight:600; color:#64748b;">고객센터:</span>
          <span>${client.csNumber || '미등록'}</span>
          <span style="font-weight:600; color:#64748b;">사이트 수:</span>
          <span>${client.sites?.length || 0}개</span>
        </div>

        <div style="border-top:1px solid #f1f5f9; padding-top:16px;">
          <h4 style="margin:0 0 12px 0; font-size:14px; font-weight:700; color:#334155; display:flex; justify-content:space-between; align-items:center;">
            <span>등급 관리 (Tiers)</span>
            <span style="font-size:11px; font-weight:600; color:${primaryColor}; padding:2px 6px; border-radius:10px;">${client.tiers?.length || 0}개 등급</span>
          </h4>
          
          <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px;" id="tiers-list-${client.id}">
            ${(client.tiers || []).map(tier => `
              <span class="badge-cat" style="
                background: #f8fafc;
                border: 1px solid #cbd5e1;
                color: #475569;
                padding: 4px 10px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 4px;
              ">
                ${tier}
                <span onclick="deleteTier('${client.id}', '${tier}')" style="cursor:pointer; color:#ef4444; font-weight:700; font-size:10px; display:inline-block; padding:0 2px;">×</span>
              </span>
            `).join('')}
            ${(client.tiers || []).length === 0 ? '<div style="font-size:12px; color:#94a3b8;">등록된 서비스 등급이 없습니다.</div>' : ''}
          </div>

          <div style="display:flex; gap:6px; margin-top:8px;">
            <input type="text" id="new-tier-input-${client.id}" placeholder="새 등급명 입력" style="flex-grow:1; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px; outline:none;">
            <button class="btn btn-sm btn-primary" onclick="addTier('${client.id}')">추가</button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
};

window.addTier = function(clientId) {
  const input = document.getElementById(`new-tier-input-${clientId}`);
  const val = input ? input.value.trim() : "";
  if (!val) {
    alert("추가할 등급명을 입력해 주세요.");
    return;
  }
  
  const client = adminClientConfigs[clientId];
  if (client) {
    if (!client.tiers) client.tiers = [];
    if (client.tiers.includes(val)) {
      alert("이미 존재하는 등급명입니다.");
      return;
    }
    client.tiers.push(val);
    
    if (client.sites && client.sites.length > 0) {
      const site = client.sites.find(s => s.siteId === 'default') || client.sites[0];
      if (site) {
        if (!site.mappedTiers) site.mappedTiers = [];
        if (!site.mappedTiers.includes(val)) {
          site.mappedTiers.push(val);
        }
      }
    }

    localStorage.setItem('hc_portal_data', JSON.stringify(adminClientConfigs));
    showToast(`'${val}' 등급이 추가되었습니다.`);
    renderView('client-management');
  }
};

window.deleteTier = function(clientId, tierName) {
  if (confirm(`'${tierName}' 등급을 삭제하시겠습니까?\n이 등급에 매핑된 사이트의 접근 권한도 함께 삭제됩니다.`)) {
    const client = adminClientConfigs[clientId];
    if (client && client.tiers) {
      client.tiers = client.tiers.filter(t => t !== tierName);
      
      if (client.sites) {
        client.sites.forEach(site => {
          if (site.mappedTiers) {
            site.mappedTiers = site.mappedTiers.filter(t => t !== tierName);
          }
        });
      }
      
      localStorage.setItem('hc_portal_data', JSON.stringify(adminClientConfigs));
      showToast(`'${tierName}' 등급이 삭제되었습니다.`);
      renderView('client-management');
    }
  }
};

window.deleteClient = function(clientId) {
  if (confirm(`정말로 고객사 '${clientId}'와(과) 연동된 모든 설정/사이트를 통째로 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
    delete adminClientConfigs[clientId];
    localStorage.setItem('hc_portal_data', JSON.stringify(adminClientConfigs));
    showToast(`고객사 '${clientId}'가 삭제되었습니다.`);
    renderView('client-management');
  }
};

window.openAddClientModal = function() {
  const modal = document.createElement("div");
  modal.id = "add-client-modal";
  modal.style = "position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px;";
  modal.innerHTML = `
    <div class="config-card" style="width:100%; max-width:500px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border-radius:12px; overflow:hidden;">
      <div class="card-header" style="padding:20px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
        <h2 class="card-title" style="margin:0; font-size:18px;">신규 고객사 추가</h2>
      </div>
      <div class="card-body" style="padding:20px; display:flex; flex-direction:column; gap:16px; background: white;">
        <div class="form-group">
          <label class="form-label" style="font-weight:600; color:#334155; margin-bottom:6px; display:block;">고객사 ID (영문/숫자만)</label>
          <input type="text" id="add-client-id" class="form-input" placeholder="예: samsung, hyundai" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:6px; font-size:14px; box-sizing:border-box;">
        </div>
        <div class="form-group">
          <label class="form-label" style="font-weight:600; color:#334155; margin-bottom:6px; display:block;">고객사 공식 명칭</label>
          <input type="text" id="add-client-name" class="form-input" placeholder="예: 삼성생명, 현대자동차" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:6px; font-size:14px; box-sizing:border-box;">
        </div>
        <div class="form-group">
          <label class="form-label" style="font-weight:600; color:#334155; margin-bottom:6px; display:block;">포털 서비스명</label>
          <input type="text" id="add-client-service" class="form-input" placeholder="예: 삼성생명 헬스케어" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:6px; font-size:14px; box-sizing:border-box;">
        </div>
        <div class="form-group">
          <label class="form-label" style="font-weight:600; color:#334155; margin-bottom:6px; display:block;">고객센터 전화번호</label>
          <input type="text" id="add-client-cs" class="form-input" placeholder="예: 1588-2002" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:6px; font-size:14px; box-sizing:border-box;">
        </div>
        <div class="form-group">
          <label class="form-label" style="font-weight:600; color:#334155; margin-bottom:6px; display:block;">초기 등급 목록 (쉼표로 구분)</label>
          <input type="text" id="add-client-tiers" class="form-input" placeholder="예: 일반회원, 우수회원, VIP회원" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:6px; font-size:14px; box-sizing:border-box;">
        </div>
        <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:8px;">
          <button class="btn" onclick="closeAddClientModal()">취소</button>
          <button class="btn btn-primary" onclick="submitAddClient()">등록하기</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};

window.closeAddClientModal = function() {
  const modal = document.getElementById("add-client-modal");
  if (modal) modal.remove();
};

window.submitAddClient = function() {
  const id = document.getElementById("add-client-id").value.trim().toLowerCase();
  const name = document.getElementById("add-client-name").value.trim();
  const serviceName = document.getElementById("add-client-service").value.trim();
  const csNumber = document.getElementById("add-client-cs").value.trim();
  const tiersRaw = document.getElementById("add-client-tiers").value.trim();
  
  if (!id || !name || !serviceName || !csNumber) {
    alert("모든 필수 입력 필드를 채워주세요.");
    return;
  }
  
  if (!/^[a-z0-9_]+$/i.test(id)) {
    alert("고객사 ID는 영문 소문자, 숫자, 언더바(_)만 가능합니다.");
    return;
  }
  
  if (adminClientConfigs[id]) {
    alert("이미 존재하는 고객사 ID입니다.");
    return;
  }
  
  const tiersList = tiersRaw ? tiersRaw.split(',').map(t => t.trim()).filter(Boolean) : ["기본등급"];
  
  const newClient = {
    id: id,
    name: name,
    serviceName: serviceName,
    csNumber: csNumber,
    clientLink: "",
    dasomLink: "",
    tiers: tiersList,
    sites: [
      {
        siteId: "default",
        siteName: "기본 사이트",
        mappedTiers: [...tiersList],
        logoImage: null,
        themeColor: BRAND_DEFAULTS.themeColor,
        themeColorRgb: BRAND_DEFAULTS.themeColorRgb,
        menuTextColor: BRAND_DEFAULTS.menuTextColor,
        heroText: { 
          title: "건강한 내일을 위한 첫걸음", 
          subtitle: `${name} 전용 헬스케어 포털에서 제공하는 프리미엄 건강 관리 서비스를 지금 바로 경험해보세요.` 
        },
        serviceName: serviceName,
        csNumber: csNumber,
        name: name,
        clientLink: "",
        providerName: BRAND_DEFAULTS.providerName,
        providerLink: BRAND_DEFAULTS.providerLink,
        menus: JSON.parse(JSON.stringify(defaultMenus))
      }
    ]
  };
  
  adminClientConfigs[id] = newClient;
  localStorage.setItem('hc_portal_data', JSON.stringify(adminClientConfigs));
  
  closeAddClientModal();
  showToast(`신규 고객사 '${name}'(이)가 성공적으로 추가되었습니다.`);
  renderView('client-management');
};
