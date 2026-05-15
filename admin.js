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
  kyobo: { id: "kyobo", name: "교보생명 (kyobo)", serviceName: "교보생명", csNumber: "1588-1001", clientLink: "", dasomLink: "", tiers: ["기본플랜", "VIP플랜"], heroText: { title: "건강한 내일을 위한 첫걸음", subtitle: "교보생명 전용 헬스케어 포털에서 제공하는 프리미엄 건강 관리 서비스를 지금 바로 경험해보세요." }, menus: [] },
  dasom: { id: "dasom", name: "교보다솜케어 (dasom)", serviceName: "교보다솜케어", csNumber: "1588-1002", clientLink: "", dasomLink: "", tiers: ["통합등급", "우대등급"], heroText: { title: "더 건강한 삶, 교보다솜케어", subtitle: "고객님의 평생 건강 파트너, 교보다솜케어가 프리미엄 서비스를 시작합니다." }, menus: [] },
  other: { id: "other", name: "A기업 (제휴사)", serviceName: "A기업", csNumber: "1588-1003", clientLink: "", dasomLink: "", tiers: ["임직원 1등급", "임원급"], heroText: { title: "임직원 복지 라운지", subtitle: "A기업 임직원만을 위한 프리미엄 건강 관리 혜택을 만나보세요." }, menus: [] }
};

const defaultMenus = [
  { id: "serviceGuide", defaultLabel: "서비스 안내", label: "서비스 안내", isVisible: true, children: [] },
  { id: "healthConsulting", defaultLabel: "건강상담", label: "건강상담", isVisible: true, children: [] },
  { id: "hospitalGuide", defaultLabel: "병원안내", label: "병원안내", isVisible: true, children: [] },
  { id: "medicalAppt", defaultLabel: "진료예약", label: "진료예약", isVisible: true, children: [] },
  { id: "checkupAppt", defaultLabel: "건강검진 예약", label: "건강검진 예약", isVisible: true, children: [] },
  { id: "healthInfo", defaultLabel: "건강정보", label: "건강정보", isVisible: true, children: [] },
  { id: "psyCare", defaultLabel: "심리케어", label: "심리케어", isVisible: true, children: [] }
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
let currentView = "menu-settings";

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  loadAllData();
  setupNavigation();
  navigateTo(currentView);
});

function loadAllData() {
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
    if (!client.menus || client.menus.length === 0) {
      // Migrate from old structure if possible, else use default
      if (client.menuLabels) {
        client.menus = defaultMenus.map(m => ({
          ...m,
          defaultLabel: m.defaultLabel,
          label: client.menuLabels[m.id] || m.label,
          isVisible: client.menuVisibility ? client.menuVisibility[m.id] !== false : true
        }));
      } else {
        client.menus = JSON.parse(JSON.stringify(defaultMenus));
      }
    } else {
      // Reorder: ensure serviceGuide is first if it exists
      const sgIndex = client.menus.findIndex(m => m.id === 'serviceGuide');
      if (sgIndex > 0) {
        const sg = client.menus.splice(sgIndex, 1)[0];
        client.menus.unshift(sg);
      }
    }
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
  if (savedItems) { items = JSON.parse(savedItems); masterItems = items; }
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
  else if (viewId === 'health-info') pathText += "헬스케어포털 관리 <span class='separator'>></span> <strong>건강정보 관리</strong>";
  else if (viewId === 'online-inquiry') pathText += "헬스케어포털 관리 <span class='separator'>></span> <strong>온라인 문의 관리</strong>";
  else if (viewId === 'hospitals') pathText += "건강검진 관리 <span class='separator'>></span> <strong>제휴 병원 관리</strong>";
  else if (viewId === 'packages') pathText += "건강검진 관리 <span class='separator'>></span> <strong>검진 패키지 관리</strong>";
  else if (viewId === 'items') pathText += "건강검진 관리 <span class='separator'>></span> <strong>검진 항목 관리</strong>";
  breadcrumb.innerHTML = pathText;

  renderView(viewId);
};

function renderView(viewId) {
  const container = document.getElementById('admin-main-view');
  container.innerHTML = ''; // Clear

  if (viewId === 'menu-settings') renderMenuSettings(container);
  else if (viewId === 'health-info') renderHealthInfo(container);
  else if (viewId === 'online-inquiry') renderOnlineInquiryView(container);
  else if (viewId === 'hospitals') renderHospitals(container);
  else if (viewId === 'packages') renderPackages(container);
  else if (viewId === 'items') renderItemsView(container);
  else renderDashboard(container);
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
      <div class="card-header">
        <h2 class="card-title">고객사 선택</h2>
        <select id="client-select" class="form-select" onchange="loadClientSettings()"></select>
      </div>
      <div class="card-body">
        <div class="menu-tree-header" style="display:grid; grid-template-columns: 1fr 1fr 100px 200px; padding: 12px 16px; background:#f8fafc; font-weight:600; font-size:13px; border-radius:8px; margin-bottom:12px; gap:12px;">
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
  currentClientId = document.getElementById("client-select").value;
  const config = adminClientConfigs[currentClientId];
  const container = document.getElementById("menu-tree-container");
  
  container.innerHTML = '';
  renderMenuLevel(config.menus, container, 1);

  document.getElementById('input-heroTitle').value = config.heroText.title;
  document.getElementById('input-heroSubtitle').value = config.heroText.subtitle;
  document.getElementById('input-csName').value = config.serviceName || '';
  document.getElementById('input-csNumber').value = config.csNumber || '';
  document.getElementById('input-clientName').value = config.name || '';
  document.getElementById('input-clientLink').value = config.clientLink || '';
  document.getElementById('input-providerName').value = config.providerName || BRAND_DEFAULTS.providerName;
  document.getElementById('input-providerLink').value = config.providerLink || BRAND_DEFAULTS.providerLink;
  
  // Branding settings
  document.getElementById('input-themeColor').value = config.themeColor || BRAND_DEFAULTS.themeColor;
  document.getElementById('preview-themeColor').style.backgroundColor = config.themeColor || BRAND_DEFAULTS.themeColor;
  
  document.getElementById('input-menuTextColor').value = config.menuTextColor || BRAND_DEFAULTS.menuTextColor;
  document.getElementById('preview-menuTextColor').style.backgroundColor = config.menuTextColor || BRAND_DEFAULTS.menuTextColor;
  
  const preview = document.getElementById('logo-preview');
  if (config.logoImage) {
    preview.innerHTML = `<img src="${config.logoImage}" style="max-width:100%; max-height:100%; object-fit:contain;">`;
  } else {
    preview.innerHTML = `<span style="font-size:10px; color:#94a3b8;">No Logo</span>`;
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
    adminClientConfigs[currentClientId].logoImage = base64;
    document.getElementById('logo-preview').innerHTML = `<img src="${base64}" style="max-width:100%; max-height:100%; object-fit:contain;">`;
  };
  reader.readAsDataURL(file);
};

function renderMenuLevel(menus, container, depth) {
  menus.forEach((menu, index) => {
    const item = document.createElement('div');
    item.className = `menu-tree-item depth-${depth}`;
    item.innerHTML = `
      <div class="menu-item-row ${!menu.isVisible ? 'disabled' : ''}">
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
        <div class="menu-management" style="text-align:right;">
          ${depth < 3 ? `<button class="btn btn-sm" onclick="addSubMenu('${menu.id}', ${depth})">+ 하위</button>` : ''}
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
  const menu = findMenuById(adminClientConfigs[currentClientId].menus, id);
  if(menu) menu.label = val;
};

window.updateMenuDefaultLabel = function(id, val) {
  const menu = findMenuById(adminClientConfigs[currentClientId].menus, id);
  if(menu) menu.defaultLabel = val;
};

window.toggleMenuVisibility = function(id, checked) {
  const menu = findMenuById(adminClientConfigs[currentClientId].menus, id);
  if(menu) {
    menu.isVisible = checked;
    loadClientSettings(); // Re-render to update disabled states
  }
};

window.addTopMenu = function() {
  adminClientConfigs[currentClientId].menus.push({
    id: 'm_' + Date.now(), defaultLabel: '새 메뉴', label: '새 메뉴', isVisible: true, children: []
  });
  loadClientSettings();
};

window.addSubMenu = function(parentId, depth) {
  const parent = findMenuById(adminClientConfigs[currentClientId].menus, parentId);
  if(parent && depth < 3) {
    if(!parent.children) parent.children = [];
    parent.children.push({
      id: 'm_' + Date.now(), defaultLabel: '새 하위 메뉴', label: '새 하위 메뉴', isVisible: true, children: []
    });
    loadClientSettings();
  }
};

window.deleteMenu = function(id) {
  if(confirm("이 메뉴와 모든 하위 메뉴를 삭제하시겠습니까?")) {
    adminClientConfigs[currentClientId].menus = removeMenuById(adminClientConfigs[currentClientId].menus, id);
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
  const config = adminClientConfigs[currentClientId];
  config.heroText.title = document.getElementById('input-heroTitle').value;
  config.heroText.subtitle = document.getElementById('input-heroSubtitle').value;
  config.serviceName = document.getElementById('input-csName').value;
  config.csNumber = document.getElementById('input-csNumber').value;
  config.name = document.getElementById('input-clientName').value;
  config.clientLink = document.getElementById('input-clientLink').value;
  config.providerName = document.getElementById('input-providerName').value;
  config.providerLink = document.getElementById('input-providerLink').value;
  
  config.themeColor = document.getElementById('input-themeColor').value;
  config.menuTextColor = document.getElementById('input-menuTextColor').value;
  
  // Calculate RGB for transparency support
  const hex = config.themeColor.replace('#', '');
  const r = parseInt(hex.substring(0,2), 16);
  const g = parseInt(hex.substring(2,4), 16);
  const b = parseInt(hex.substring(4,6), 16);
  config.themeColorRgb = `${r}, ${g}, ${b}`;

  localStorage.setItem('hc_portal_data', JSON.stringify(adminClientConfigs));
  showToast("메뉴 구조와 설정이 저장되었습니다.");
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
              <th>작성자</th>
              <th>제목</th>
              <th>작성일</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            ${inquiries.length === 0 ? `
              <tr><td colspan="7" style="text-align:center; padding:40px; color:#94a3b8;">접수된 문의 내역이 없습니다.</td></tr>
            ` : inquiries.map(item => `
              <tr>
                <td>${item.id}</td>
                <td><span class="badge" style="background:#e2e8f0; color:#475569;">${item.clientId}</span></td>
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
            `).reverse().join('')}
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
