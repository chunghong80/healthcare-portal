try {
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
  kyobo: { id: "kyobo", name: "교보생명", serviceName: "교보생명 헬스케어", csNumber: "1588-7524", clientLink: "https://www.kyobo.com", dasomLink: "", tiers: ["VIP", "골드", "실버"], heroText: { title: "삶을 사랑하는 마음, 건강까지 함께합니다.", subtitle: "든든한 건강 파트너, 교보생명 헬스케어서비스를 지금 이용해 보세요." }, menus: [] },
  dasom: { id: "dasom", name: "교보다솜케어", serviceName: "교보다솜헬스케어", csNumber: "1588-1002", clientLink: "", dasomLink: "", tiers: ["통합등급", "우대등급"], heroText: { title: "더 건강한 삶, 교보다솜케어", subtitle: "고객님의 평생 건강 파트너, 교보다솜케어가 프리미엄 서비스를 시작합니다." }, menus: [] },
  gs: { id: "gs", name: "GS리테일", serviceName: "교보다솜헬스케어", csNumber: "1588-1002", clientLink: "", dasomLink: "", tiers: ["임직원", "경영진", "파트너", "협력사"], heroText: { title: "더 건강한 삶, 교보다솜케어", subtitle: "고객님의 평생 건강 파트너, 교보다솜케어가 프리미엄 서비스를 시작합니다." }, menus: [] },
  other: { id: "other", name: "A기업", serviceName: "교보다솜헬스케어", csNumber: "1588-1003", clientLink: "", dasomLink: "", tiers: ["BASIC", "PREMIUM"], heroText: { title: "임직원 복지 라운지", subtitle: "A기업 임직원만을 위한 프리미엄 건강 관리 혜택을 만나보세요." }, menus: [] },
  b_corp: { id: "b_corp", name: "B기업", serviceName: "교보다솜헬스케어", csNumber: "1588-1004", clientLink: "", dasomLink: "", tiers: ["GOLD", "VIP", "VVIP"], heroText: { title: "B기업 헬스케어", subtitle: "B기업 임직원 맞춤형 건강 관리 포털" }, menus: [] },
  c_corp: { id: "c_corp", name: "C기업", serviceName: "C기업 헬스케어", csNumber: "1588-1005", clientLink: "", dasomLink: "", tiers: ["임직원"], heroText: { title: "C기업 헬스케어 포털", subtitle: "C기업 전용 건강 지원 서비스" }, menus: [] },
  d_corp: { id: "d_corp", name: "D기업", serviceName: "D기업 헬스케어", csNumber: "1588-1006", clientLink: "", dasomLink: "", tiers: ["BASIC", "STANDARD", "DELUXE"], heroText: { title: "D기업 헬스케어 포털", subtitle: "D기업 임직원 점검 서비스" }, menus: [] },
  e_corp: { id: "e_corp", name: "E기업", serviceName: "교보다솜헬스케어", csNumber: "1588-1007", clientLink: "", dasomLink: "", tiers: ["VIP", "GOLD", "SILVER", "BRONZE", "SPECIAL"], heroText: { title: "E기업 다솜 헬스케어", subtitle: "E기업 임직원 전용 혜택" }, menus: [] },
  f_corp: { id: "f_corp", name: "F기업", serviceName: "F기업 헬스케어", csNumber: "1588-1008", clientLink: "", dasomLink: "", tiers: ["BASIC", "PREMIUM"], heroText: { title: "F기업 헬스케어", subtitle: "F기업 임직원 건강 포털" }, menus: [] },
  g_corp: { id: "g_corp", name: "G기업", serviceName: "G기업 헬스케어", csNumber: "1588-1009", clientLink: "", dasomLink: "", tiers: ["임직원", "우대"], heroText: { title: "G기업 헬스케어", subtitle: "G기업 임직원 건강 포털" }, menus: [] },
  h_corp: { id: "h_corp", name: "H기업", serviceName: "교보다솜헬스케어", csNumber: "1588-1010", clientLink: "", dasomLink: "", tiers: ["GOLD", "SILVER"], heroText: { title: "H기업 다솜 헬스케어", subtitle: "H기업 임직원 복지 라운지" }, menus: [] },
  i_corp: { id: "i_corp", name: "I기업", serviceName: "교보다솜헬스케어", csNumber: "1588-1011", clientLink: "", dasomLink: "", tiers: ["BASIC", "STANDARD", "PREMIUM"], heroText: { title: "I기업 다솜 헬스케어", subtitle: "I기업 임직원 포털" }, menus: [] },
  j_corp: { id: "j_corp", name: "J기업", serviceName: "교보다솜헬스케어", csNumber: "1588-1012", clientLink: "", dasomLink: "", tiers: ["VIP", "VVIP"], heroText: { title: "J기업 다솜 헬스케어", subtitle: "J기업 프리미엄 케어" }, menus: [] },
  k_corp: { id: "k_corp", name: "K기업", serviceName: "교보다솜헬스케어", csNumber: "1588-1013", clientLink: "", dasomLink: "", tiers: ["임직원", "가족", "파트너"], heroText: { title: "K기업 다솜 헬스케어", subtitle: "K기업 임직원 서비스" }, menus: [] },
  l_corp: { id: "l_corp", name: "L기업", serviceName: "교보다솜헬스케어", csNumber: "1588-1014", clientLink: "", dasomLink: "", tiers: ["BASIC", "PREMIUM"], heroText: { title: "L기업 다솜 헬스케어", subtitle: "L기업 임직원 서비스" }, menus: [] },
  m_corp: { id: "m_corp", name: "M기업", serviceName: "교보다솜헬스케어", csNumber: "1588-1015", clientLink: "", dasomLink: "", tiers: ["GOLD", "VIP"], heroText: { title: "M기업 다솜 헬스케어", subtitle: "M기업 임직원 서비스" }, menus: [] },
  n_corp: { id: "n_corp", name: "N기업", serviceName: "교보다솜헬스케어", csNumber: "1588-1016", clientLink: "", dasomLink: "", tiers: ["VIP", "GOLD", "SILVER", "BRONZE"], heroText: { title: "N기업 다솜 헬스케어", subtitle: "N기업 임직원 서비스" }, menus: [] },
  o_corp: { id: "o_corp", name: "O기업", serviceName: "교보다솜헬스케어", csNumber: "1588-1017", clientLink: "", dasomLink: "", tiers: ["임직원", "임원"], heroText: { title: "O기업 다솜 헬스케어", subtitle: "O기업 임직원 서비스" }, menus: [] },
  p_corp: { id: "p_corp", name: "P기업", serviceName: "교보다솜헬스케어", csNumber: "1588-1018", clientLink: "", dasomLink: "", tiers: ["BASIC", "STANDARD", "DELUXE"], heroText: { title: "P기업 다솜 헬스케어", subtitle: "P기업 임직원 서비스" }, menus: [] },
  q_corp: { id: "q_corp", name: "Q기업", serviceName: "교보다솜헬스케어", csNumber: "1588-1019", clientLink: "", dasomLink: "", tiers: ["GOLD", "VIP"], heroText: { title: "Q기업 다솜 헬스케어", subtitle: "Q기업 임직원 서비스" }, menus: [] },
  r_corp: { id: "r_corp", name: "R기업", serviceName: "교보다솜헬스케어", csNumber: "1588-1020", clientLink: "", dasomLink: "", tiers: ["VIP", "GOLD", "SILVER"], heroText: { title: "R기업 다솜 헬스케어", subtitle: "R기업 임직원 서비스" }, menus: [] },
  s_corp: { id: "s_corp", name: "S기업", serviceName: "교보다솜헬스케어", csNumber: "1588-1021", clientLink: "", dasomLink: "", tiers: ["임직원", "가족"], heroText: { title: "S기업 다솜 헬스케어", subtitle: "S기업 임직원 서비스" }, menus: [] },
  t_corp: { id: "t_corp", name: "T기업", serviceName: "교보다솜헬스케어", csNumber: "1588-1022", clientLink: "", dasomLink: "", tiers: ["BASIC", "PREMIUM"], heroText: { title: "T기업 다솜 헬스케어", subtitle: "T기업 임직원 서비스" }, menus: [] },
  u_corp: { id: "u_corp", name: "U기업", serviceName: "교보다솜헬스케어", csNumber: "1588-1023", clientLink: "", dasomLink: "", tiers: ["GOLD", "VIP", "VVIP"], heroText: { title: "U기업 다솜 헬스케어", subtitle: "U기업 임직원 서비스" }, menus: [] },
  v_corp: { id: "v_corp", name: "V기업", serviceName: "교보다솜헬스케어", csNumber: "1588-1024", clientLink: "", dasomLink: "", tiers: ["VIP", "골드"], heroText: { title: "V기업 다솜 헬스케어", subtitle: "V기업 임직원 서비스" }, menus: [] }
};

const defaultMenus = [
  { id: "serviceGuide", defaultLabel: "서비스 안내", label: "서비스 안내", isVisible: true, children: [] },
  {
    id: "healthConsulting", defaultLabel: "상담·예약 신청", label: "상담·예약 신청", isVisible: true, children: [
      { id: "general", defaultLabel: "일반 건강상담", label: "일반 건강상담", isVisible: false, children: [] },
      { id: "appt", defaultLabel: "진료예약", label: "진료예약", isVisible: false, children: [] },
      { id: "expert", defaultLabel: "병원 및 전문의료진 안내", label: "병원 및 전문의료진 안내", isVisible: false, children: [] }
    ]
  },
  {
    id: "search", defaultLabel: "병원검색", label: "병원검색", isVisible: true, children: []
  },
  {
    id: "checkupAppt", defaultLabel: "건강검진 예약", label: "건강검진 예약", isVisible: true, children: [
      { id: "checkupPreferred", defaultLabel: "건강검진 우대예약", label: "건강검진 우대예약", isVisible: false, children: [] },
      { id: "checkupCorporate", defaultLabel: "회사지원 건강검진", label: "회사지원 건강검진", isVisible: false, children: [] }
    ]
  },
  {
    id: "healthInfo", defaultLabel: "건강정보", label: "건강정보", isVisible: true, children: [
      { id: "categoryInfo", defaultLabel: "분야별 건강정보", label: "분야별 건강정보", isVisible: true, children: [] },
      { id: "contentSubscribe", defaultLabel: "건강콘텐츠 구독", label: "건강콘텐츠 구독", isVisible: true, children: [] },
      { id: "healthNews", defaultLabel: "건강뉴스", label: "건강뉴스", isVisible: true, children: [] },
      { id: "selfDiagnosis", defaultLabel: "키성장 예측 및 비만 자가진단", label: "키성장 예측 및 비만 자가진단", isVisible: true, children: [] }
    ]
  },
  {
    id: "psyCare", defaultLabel: "심리케어", label: "심리케어", isVisible: true, children: [
      { id: "psyColumn", defaultLabel: "심리칼럼", label: "심리칼럼", isVisible: true, children: [] },
      { id: "selfDiagnosisGroup", defaultLabel: "자가진단", label: "자가진단", isVisible: true, children: [
        { id: "cognitiveDiag", defaultLabel: "인지기능 자가진단", label: "치매자가진단", isVisible: true, children: [] },
        { id: "depressionDiag", defaultLabel: "우울증 자가진단", label: "우울증 자가진단", isVisible: true, children: [] },
        { id: "childAdhdDiag", defaultLabel: "소아 ADHD 자가진단", label: "소아 ADHD 자가진단", isVisible: true, children: [] },
        { id: "childDepressionDiag", defaultLabel: "소아 우울증 자가진단 ", label: "소아 우울증 자가진단 ", isVisible: true, children: [] }
      ] },
      { id: "asmrVideo", defaultLabel: "힐링 ASMR 영상", label: "힐링 ASMR 영상", isVisible: true, children: [] }
    ]
  }
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
    if (adminClientConfigs.dasom) {
      adminClientConfigs.dasom.name = "교보다솜케어";
    }
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
        
        let siteName = "교보다솜헬스케어";
        let siteUrl = "https://kyobodasomcare.com/health";
        let siteType = "공통";
        let status = "active";

        if (client.id === "kyobo") {
          siteName = "교보생명 헬스케어";
          siteUrl = "https://kyobodasomcare.com/health/kyobo";
          siteType = "분기";
        } else if (client.id === "c_corp") {
          siteName = "C기업 헬스케어";
          siteUrl = "https://kyobodasomcare.com/health/c-corp";
          siteType = "분기";
        } else if (client.id === "d_corp") {
          siteName = "D기업 헬스케어";
          siteUrl = "https://kyobodasomcare.com/health/d-corp";
          siteType = "분기";
          status = "inactive";
        } else if (client.id === "f_corp") {
          siteName = "F기업 헬스케어";
          siteUrl = "https://kyobodasomcare.com/health/f-corp";
          siteType = "분기";
        } else if (client.id === "g_corp") {
          siteName = "G기업 헬스케어";
          siteUrl = "https://kyobodasomcare.com/health/g-corp";
          siteType = "분기";
        } else if (client.id === "u_corp") {
          status = "inactive";
        }

        const defaultSite = {
          siteId: siteType === "공통" ? "kyobodasom_common" : (client.id + "_site"),
          siteName: siteName,
          siteUrl: siteUrl,
          siteType: siteType,
          status: status,
          isCommonSite: siteType === "공통",
          isSuperSite: client.id === "dasom",
          mappedTiers: [...(client.tiers || [])],
          logoImage: client.logoImage || null,
          themeColor: client.themeColor || BRAND_DEFAULTS.themeColor,
          themeColorRgb: client.themeColorRgb || BRAND_DEFAULTS.themeColorRgb,
          menuTextColor: client.menuTextColor || BRAND_DEFAULTS.menuTextColor,
          heroText: client.heroText || { title: (client.name || "") + " 헬스케어", subtitle: "고객님의 평생 건강 파트너 서비스" },
          serviceName: client.serviceName || client.name || "",
          csNumber: client.csNumber || "1588-1004",
          name: client.name || "",
          clientLink: client.clientLink || "",
          providerName: client.providerName || BRAND_DEFAULTS.providerName,
          providerLink: client.providerLink || BRAND_DEFAULTS.providerLink,
          menus: currentMenus
        };
        client.sites = [defaultSite];
      } else {
        client.sites.forEach(site => {
          if (client.id === "dasom") {
            if (site.siteId === "default" && (site.siteName === "기본 사이트" || !site.siteName)) {
              site.siteName = "교보다솜헬스케어";
            }
            site.isCommonSite = true;
            site.isSuperSite = true;
          } else {
            site.isCommonSite = false;
            site.isSuperSite = false;
            if (site.siteName === "교보다솜헬스케어") {
              site.siteName = "기본 사이트";
            }
          }
          if (site.menus && Array.isArray(site.menus)) {
            // Clean up old menus and ensure search exists
            site.menus = site.menus.filter(m => m.id !== 'hospitalGuide' && m.id !== 'medicalAppt');
            if (!site.menus.some(m => m.id === 'search')) {
              const hcIdx = site.menus.findIndex(m => m.id === 'healthConsulting');
              if (hcIdx !== -1) {
                site.menus.splice(hcIdx + 1, 0, { id: "search", defaultLabel: "병원검색", label: "병원검색", isVisible: true, children: [] });
              } else {
                site.menus.push({ id: "search", defaultLabel: "병원검색", label: "병원검색", isVisible: true, children: [] });
              }
            }

            // Force update checkupAppt children
            const checkupApptMenu = site.menus.find(m => m.id === 'checkupAppt');
            if (checkupApptMenu) {
              checkupApptMenu.defaultLabel = "건강검진 예약";
              checkupApptMenu.label = "건강검진 예약";
              checkupApptMenu.children = [
                { id: "checkupPreferred", defaultLabel: "건강검진 우대예약", label: "건강검진 우대예약", isVisible: false, children: [] },
                { id: "checkupCorporate", defaultLabel: "회사지원 건강검진", label: "회사지원 건강검진", isVisible: false, children: [] }
              ];
            }

            // Force update healthConsulting children
            const healthConsultingMenu = site.menus.find(m => m.id === 'healthConsulting');
            if (healthConsultingMenu) {
              healthConsultingMenu.defaultLabel = "상담·예약 신청";
              healthConsultingMenu.label = "상담·예약 신청";
              healthConsultingMenu.children = [
                { id: "general", defaultLabel: "일반 건강상담", label: "일반 건강상담", isVisible: false, children: [] },
                { id: "appt", defaultLabel: "진료예약", label: "진료예약", isVisible: false, children: [] },
                { id: "expert", defaultLabel: "병원 및 전문의료진 안내", label: "병원 및 전문의료진 안내", isVisible: false, children: [] }
              ];
            }

            // Force update psyCare label
            const psyCareMenu = site.menus.find(m => m.id === 'psyCare');
            if (psyCareMenu) {
              psyCareMenu.defaultLabel = "심리케어";
              psyCareMenu.label = "심리케어";
            }
          }
        });
        
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
    if (!list || !Array.isArray(list)) return null;
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

// --- Unsaved Changes Guard for Menu Settings ---
window.isMenuSettingsDirty = false;

window.markMenuSettingsDirty = function() {
  if (currentView === 'menu-settings') {
    window.isMenuSettingsDirty = true;
  }
};

function setupNavigation() {
  const navItems = document.querySelectorAll('.sidebar-nav a, .nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const view = item.getAttribute('data-view');

      if (currentView === 'menu-settings' && window.isMenuSettingsDirty) {
        const confirmLeave = confirm("⚠️ 최상단의 [변경사항 저장] 버튼을 누르지 않으면 전체 수정 적용한 게 반영되지 않습니다.\n\n저장하지 않고 이 페이지를 나가시겠습니까?");
        if (!confirmLeave) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }

      if (view) {
        e.preventDefault();
        navigateTo(view);
      }
    });
  });

  window.addEventListener('beforeunload', (e) => {
    if (currentView === 'menu-settings' && window.isMenuSettingsDirty) {
      e.preventDefault();
      e.returnValue = '최상단의 [변경사항 저장] 버튼을 누르지 않으면 전체 수정 적용이 반영되지 않습니다.';
      return e.returnValue;
    }
  });

  document.addEventListener('input', (e) => {
    if (currentView === 'menu-settings') {
      window.isMenuSettingsDirty = true;
    }
  });
  document.addEventListener('change', (e) => {
    if (currentView === 'menu-settings') {
      window.isMenuSettingsDirty = true;
    }
  });
}

window.navigateTo = function(viewId) {
  if (currentView === 'menu-settings' && viewId !== 'menu-settings' && window.isMenuSettingsDirty) {
    const confirmLeave = confirm("⚠️ 최상단의 [변경사항 저장] 버튼을 누르지 않으면 전체 수정 적용한 게 반영되지 않습니다.\n\n저장하지 않고 이 페이지를 나가시겠습니까?");
    if (!confirmLeave) {
      return;
    }
  }

  currentView = viewId;
  if (viewId === 'menu-settings') {
    window.isMenuSettingsDirty = false;
    window.menuSettingsSubView = 'list';
  }
  
  // Update UI active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-view') === viewId);
  });

  const container = document.getElementById('admin-main-view');
  if (!container) return;

  // Update Breadcrumb
  const breadcrumb = document.querySelector('.breadcrumb');
  let pathText = "사무포털 <span class='separator'>></span> ";
  if (viewId === 'menu-settings') {
    if (window.menuSettingsSubView === 'list') {
      pathText += "메뉴설정 <span class='separator'>></span> <strong>사이트 관리</strong>";
    } else {
      const activeClient = adminClientConfigs[currentClientId];
      const activeSite = activeClient?.sites?.find(s => s.siteId === currentSiteId) || activeClient?.sites?.[0];
      const activeSiteName = activeSite ? activeSite.siteName : '';
      pathText += `메뉴설정 <span class='separator'>></span> <a href='javascript:void(0)' onclick='showSiteList()' style='color:#64748b; text-decoration:none;'>사이트 관리</a> <span class='separator'>></span> <strong>메뉴 구성 및 노출관리 (${activeSiteName})</strong>`;
    }
  }
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

// --- View: Menu Settings & Site Management ---
window.menuSettingsSubView = 'list'; // 'list' | 'editor'

function renderMenuSettings(container) {
  if (window.menuSettingsSubView === 'list') {
    renderSiteManagementList(container);
  } else {
    renderMenuSettingsEditor(container);
  }
}

window.showSiteList = function() {
  if (window.isMenuSettingsDirty) {
    const confirmLeave = confirm("⚠️ 최상단의 [변경사항 저장] 버튼을 누르지 않으면 전체 수정 적용한 게 반영되지 않습니다.\n\n저장하지 않고 사이트 목록으로 이동하시겠습니까?");
    if (!confirmLeave) return;
  }
  window.isMenuSettingsDirty = false;
  window.menuSettingsSubView = 'list';
  const container = document.getElementById('admin-main-view');
  if (container) renderMenuSettings(container);
  
  const breadcrumb = document.querySelector('.breadcrumb');
  if (breadcrumb) {
    breadcrumb.innerHTML = "사무포털 <span class='separator'>></span> 메뉴설정 <span class='separator'>></span> <strong>사이트 관리</strong>";
  }
};

window.enterSiteMenuEditor = function(clientId, siteId) {
  if (clientId) currentClientId = clientId;
  if (siteId) currentSiteId = siteId;
  window.menuSettingsSubView = 'editor';
  window.isMenuSettingsDirty = false;
  const container = document.getElementById('admin-main-view');
  if (container) renderMenuSettings(container);

  const breadcrumb = document.querySelector('.breadcrumb');
  if (breadcrumb) {
    const client = adminClientConfigs[currentClientId];
    const site = client?.sites?.find(s => s.siteId === currentSiteId) || client?.sites?.[0];
    const siteDisplayName = site ? site.siteName : '';
    breadcrumb.innerHTML = `사무포털 <span class='separator'>></span> 메뉴설정 <span class='separator'>></span> <a href='javascript:void(0)' onclick='showSiteList()' style='color:#64748b; text-decoration:none;'>사이트 관리</a> <span class='separator'>></span> <strong>메뉴 구성 및 노출관리 (${siteDisplayName})</strong>`;
  }
};

function renderSiteManagementList(container) {
  const siteRows = [];
  const distinctSiteUrls = new Set();

  Object.values(adminClientConfigs).forEach(client => {
    if (client.sites && client.sites.length > 0) {
      client.sites.forEach(site => {
        let url = site.siteUrl || "";
        if (!url || url.includes("kyobodasomcare.co.kr") || url.includes("kyobolife.co.kr") || url.includes("company.co.kr") || url.includes("othercompany.co.kr")) {
          if (client.id === 'dasom' || site.siteName === '교보다솜헬스케어' || site.isCommonSite || site.siteType === '공통') {
            url = 'https://kyobodasomcare.com/health';
          } else if (client.id === 'kyobo') {
            url = 'https://kyobodasomcare.com/health/kyobo';
          } else if (client.id === 'c_corp') {
            url = 'https://kyobodasomcare.com/health/c-corp';
          } else if (client.id === 'd_corp') {
            url = 'https://kyobodasomcare.com/health/d-corp';
          } else if (client.id === 'f_corp') {
            url = 'https://kyobodasomcare.com/health/f-corp';
          } else if (client.id === 'g_corp') {
            url = 'https://kyobodasomcare.com/health/g-corp';
          } else {
            url = `https://kyobodasomcare.com/health/${client.id}`;
          }
        } else if (!url.startsWith('http')) {
          url = 'https://kyobodasomcare.com/health/' + url.replace(/^\/+/, '');
        }

        let rawClientName = client.name ? client.name.trim() : client.id;
        rawClientName = rawClientName.replace(/\(슈퍼사이트\)/g, '').replace(/\(dasom\)/g, '').replace(/\(제휴사\)/g, '').trim();

        distinctSiteUrls.add(site.siteName || url);
        siteRows.push({
          clientId: client.id,
          clientName: rawClientName,
          siteId: site.siteId,
          siteName: site.siteName || '기본 사이트',
          siteUrl: url,
          siteType: site.siteType || (client.id === 'dasom' || site.isCommonSite || site.siteName === '교보다솜헬스케어' ? '공통' : '분기'),
          mappedTiers: site.mappedTiers || client.tiers || [],
          status: site.status || 'active'
        });
      });
    }
  });

  const totalClients = Object.keys(adminClientConfigs).length;
  const totalSites = distinctSiteUrls.size;

  container.innerHTML = `
    <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
      <div>
        <h1 class="page-title" style="font-size:24px; font-weight:700; color:#1e293b; margin:0 0 4px 0;">사이트 관리</h1>
        <div style="font-size:13px; color:#64748b;">메뉴설정 &gt; 사이트 관리</div>
      </div>
    </div>

    <!-- Stats Section -->
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:24px;">
      <div class="site-mgmt-stat-card">
        <div style="width:56px; height:56px; border-radius:50%; background:#edf2fe; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <svg width="26" height="26" fill="none" stroke="#2563eb" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        </div>
        <div>
          <div style="font-size:14px; color:#64748b; margin-bottom:4px; font-weight:500;">전체 고객사 수</div>
          <div style="font-size:28px; font-weight:700; color:#1e293b;"><span id="stat-client-count">${totalClients}</span><span style="font-size:20px; font-weight:600; margin-left:2px;">개</span></div>
        </div>
      </div>
      <div class="site-mgmt-stat-card">
        <div style="width:56px; height:56px; border-radius:50%; background:#e0f2fe; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <svg width="26" height="26" fill="none" stroke="#0284c7" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
        </div>
        <div>
          <div style="font-size:14px; color:#64748b; margin-bottom:4px; font-weight:500;">전체 사이트 수</div>
          <div style="font-size:28px; font-weight:700; color:#1e293b;"><span id="stat-site-count">${totalSites}</span><span style="font-size:20px; font-weight:600; margin-left:2px;">개</span></div>
        </div>
      </div>
    </div>

    <!-- Filter Card -->
    <div class="site-mgmt-filter-card">
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:16px 32px; margin-bottom:20px;">
        <div style="display:flex; align-items:center;">
          <label style="width:90px; font-size:14px; font-weight:600; color:#334155; flex-shrink:0;">고객사명</label>
          <div style="position:relative; flex:1;">
            <input type="text" id="site-filter-client" class="form-input" placeholder="고객사명을 입력하세요" style="width:100%; padding-right:32px;" onkeyup="if(event.key==='Enter') applySiteListFilters()">
            <svg style="position:absolute; right:10px; top:50%; transform:translateY(-50%); width:16px; height:16px; color:#94a3b8; pointer-events:none;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
        </div>
        <div style="display:flex; align-items:center;">
          <label style="width:90px; font-size:14px; font-weight:600; color:#334155; flex-shrink:0;">사이트명</label>
          <div style="position:relative; flex:1;">
            <input type="text" id="site-filter-name" class="form-input" placeholder="사이트명을 입력하세요" style="width:100%; padding-right:32px;" onkeyup="if(event.key==='Enter') applySiteListFilters()">
            <svg style="position:absolute; right:10px; top:50%; transform:translateY(-50%); width:16px; height:16px; color:#94a3b8; pointer-events:none;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
        </div>
        <div style="display:flex; align-items:center;">
          <label style="width:90px; font-size:14px; font-weight:600; color:#334155; flex-shrink:0;">사이트 구분</label>
          <select id="site-filter-type" class="form-select" style="flex:1;" onchange="applySiteListFilters()">
            <option value="">전체</option>
            <option value="공통">공통</option>
            <option value="분기">분기</option>
          </select>
        </div>
        <div style="display:flex; align-items:center;">
          <label style="width:90px; font-size:14px; font-weight:600; color:#334155; flex-shrink:0;">운영상태</label>
          <select id="site-filter-status" class="form-select" style="flex:1;" onchange="applySiteListFilters()">
            <option value="">전체</option>
            <option value="active">운영</option>
            <option value="inactive">미운영</option>
          </select>
        </div>
        <div style="display:flex; align-items:center;">
          <label style="width:90px; font-size:14px; font-weight:600; color:#334155; flex-shrink:0;">적용등급</label>
          <div style="position:relative; flex:1;">
            <input type="text" id="site-filter-tier" class="form-input" placeholder="등급명을 입력하세요" style="width:100%; padding-right:32px;" onkeyup="if(event.key==='Enter') applySiteListFilters()">
            <svg style="position:absolute; right:10px; top:50%; transform:translateY(-50%); width:16px; height:16px; color:#94a3b8; pointer-events:none;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
        </div>
        <div style="display:flex; align-items:center;">
          <label style="width:90px; font-size:14px; font-weight:600; color:#334155; flex-shrink:0;">URL</label>
          <input type="text" id="site-filter-url" class="form-input" placeholder="URL을 입력하세요" style="flex:1;" onkeyup="if(event.key==='Enter') applySiteListFilters()">
        </div>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:8px;">
        <button class="btn" style="background:#fff; border:1px solid #cbd5e1; color:#475569; padding:8px 20px; font-weight:500;" onclick="resetSiteListFilters()">초기화</button>
        <button class="btn" style="background:#0f2942; color:#fff; padding:8px 24px; font-weight:600;" onclick="applySiteListFilters()">검색</button>
      </div>
    </div>

    <!-- Action Header -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <div style="font-size:15px; color:#334155;">
        총 <strong id="site-list-total-count" style="color:#0f2942;">${siteRows.length}</strong>건
      </div>
      <div style="display:flex; gap:10px;">
        <button class="btn btn-primary" style="background:#0f2942; color:#fff; font-weight:600; padding:9px 18px; display:inline-flex; align-items:center; gap:6px; border:none; border-radius:6px; font-size:14px;" onclick="openAddSiteModalFromList()">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          신규사이트 생성
        </button>
        <button class="btn" style="background:#fff; border:1px solid #cbd5e1; color:#334155; font-weight:500; padding:9px 16px; display:inline-flex; align-items:center; gap:6px; border-radius:6px; font-size:14px;" onclick="exportSiteListExcel()">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          엑셀 다운로드
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="site-mgmt-table-container">
      <table class="site-mgmt-table">
        <thead>
          <tr>
            <th style="width:140px;">고객사명</th>
            <th style="width:160px;">사이트명</th>
            <th style="width:80px;">유형</th>
            <th>접속 URL</th>
            <th style="width:160px;">적용등급</th>
            <th style="width:100px;">운영상태</th>
            <th style="width:110px; min-width:110px;">관리</th>
          </tr>
        </thead>
        <tbody id="site-list-tbody">
        </tbody>
      </table>
    </div>
  `;

  window.allSiteRows = siteRows;
  renderSiteListTableRows(siteRows);
}

window.renderSiteListTableRows = function(rows) {
  const tbody = document.getElementById('site-list-tbody');
  const countEl = document.getElementById('site-list-total-count');
  if (!tbody) return;

  if (countEl) countEl.textContent = rows.length;

  if (rows.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="padding:40px; text-align:center; color:#94a3b8; font-size:14px;">
          검색 결과가 없습니다.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = rows.map(row => {
    const tiers = Array.isArray(row.mappedTiers) ? row.mappedTiers : [];
    let tierText = "등록 없음";
    if (tiers.length === 1) {
      tierText = typeof tiers[0] === 'object' ? (tiers[0].name || tiers[0].id) : tiers[0];
    } else if (tiers.length > 1) {
      const first = typeof tiers[0] === 'object' ? (tiers[0].name || tiers[0].id) : tiers[0];
      tierText = `${first} 외 ${tiers.length - 1}개`;
    }

    const isOperating = row.status === 'active' || row.status === 'active_operating' || row.status === true || row.status === '운영';
    const statusBadge = isOperating
      ? `<span class="site-status-badge active">운영</span>`
      : `<span class="site-status-badge inactive">미운영</span>`;

    const tiersTooltipStr = tiers.map(t => typeof t === 'object' ? (t.name || t.id) : t).join(', ');
    const siteTypeLabel = row.siteType || (row.clientId === 'dasom' || row.siteName === '교보다솜헬스케어' ? '공통' : '분기');
    const typeBadge = siteTypeLabel === '공통'
      ? `<span style="display:inline-block; padding:3px 10px; border-radius:12px; font-size:12px; font-weight:600; background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe;">공통</span>`
      : `<span style="display:inline-block; padding:3px 10px; border-radius:12px; font-size:12px; font-weight:600; background:#f8fafc; color:#475569; border:1px solid #cbd5e1;">분기</span>`;

    return `
      <tr>
        <td style="font-weight:600; color:#1e293b;">${row.clientName}</td>
        <td>${row.siteName}</td>
        <td>${typeBadge}</td>
        <td>
          <div style="display:inline-flex; align-items:center; gap:8px;">
            <a href="${row.siteUrl}" target="_blank" class="site-url-link">
              ${row.siteUrl}
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
            <button onclick="copyToClipboard('${row.siteUrl}')" style="background:none; border:none; cursor:pointer; color:#94a3b8; padding:2px; display:inline-flex; align-items:center;" title="URL 복사">
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            </button>
          </div>
        </td>
        <td>
          <div style="display:inline-flex; align-items:center; gap:4px; justify-content:center;">
            <span>${tierText}</span>
            ${tiers.length > 0 ? `<span class="tier-info-icon" title="전체 적용등급: ${tiersTooltipStr}" onclick="showTierInfoModal('${row.clientName}', '${row.siteName}', '${tiersTooltipStr}')">ⓘ</span>` : ''}
          </div>
        </td>
        <td>${statusBadge}</td>
        <td style="white-space:nowrap;">
          <button class="btn btn-sm" style="border:1px solid #cbd5e1; background:#fff; color:#334155; padding:6px 20px; border-radius:6px; font-size:13px; font-weight:600; white-space:nowrap; word-break:keep-all; display:inline-block;" onclick="enterSiteMenuEditor('${row.clientId}', '${row.siteId}')">수정</button>
        </td>
      </tr>
    `;
  }).join('');
};

window.applySiteListFilters = function() {
  if (!window.allSiteRows) return;
  const clientFilter = (document.getElementById('site-filter-client')?.value || '').toLowerCase().trim();
  const nameFilter = (document.getElementById('site-filter-name')?.value || '').toLowerCase().trim();
  const typeFilter = (document.getElementById('site-filter-type')?.value || '').trim();
  const statusFilter = (document.getElementById('site-filter-status')?.value || '').trim();
  const tierFilter = (document.getElementById('site-filter-tier')?.value || '').toLowerCase().trim();
  const urlFilter = (document.getElementById('site-filter-url')?.value || '').toLowerCase().trim();

  const filtered = window.allSiteRows.filter(row => {
    if (clientFilter && !row.clientName.toLowerCase().includes(clientFilter)) return false;
    if (nameFilter && !row.siteName.toLowerCase().includes(nameFilter)) return false;
    if (typeFilter && row.siteType !== typeFilter) return false;
    if (statusFilter) {
      const isOperating = row.status === 'active' || row.status === 'active_operating' || row.status === true || row.status === '운영';
      if (statusFilter === 'active' && !isOperating) return false;
      if (statusFilter === 'inactive' && isOperating) return false;
    }
    if (tierFilter) {
      const tiersStr = (row.mappedTiers || []).map(t => typeof t === 'object' ? (t.name || t.id) : t).join(' ').toLowerCase();
      if (!tiersStr.includes(tierFilter)) return false;
    }
    if (urlFilter && !row.siteUrl.toLowerCase().includes(urlFilter)) return false;
    return true;
  });

  renderSiteListTableRows(filtered);
};

window.resetSiteListFilters = function() {
  ['site-filter-client', 'site-filter-name', 'site-filter-tier', 'site-filter-url'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['site-filter-type', 'site-filter-status'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  if (window.allSiteRows) {
    renderSiteListTableRows(window.allSiteRows);
  }
};

window.openAddSiteModalFromList = function() {
  openAddSiteModal();
};

window.copyToClipboard = function(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("접속 URL이 클립보드에 복사되었습니다.");
  }).catch(() => {
    alert("URL: " + text);
  });
};

window.exportSiteListExcel = function() {
  showToast("사이트 목록 엑셀 파일 다운로드가 시작되었습니다.");
};

window.showTierInfoModal = function(clientName, siteName, tiersStr) {
  alert(`[${clientName} - ${siteName}]\n전체 적용 등급 목록:\n- ` + tiersStr.split(', ').join('\n- '));
};

function renderMenuSettingsEditor(container) {
  container.innerHTML = `
    <div class="page-header" style="display:flex; justify-content:space-between; align-items:center;">
      <div style="display:flex; align-items:center; gap:16px;">
        <button class="btn" style="background:#fff; border:1px solid #cbd5e1; color:#334155; padding:8px 14px; font-weight:500; display:inline-flex; align-items:center; gap:6px; border-radius:6px;" onclick="showSiteList()">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          사이트 목록
        </button>
        <div>
          <h1 class="page-title" style="margin:0;">메뉴 구성 및 노출 관리</h1>
          <p class="page-subtitle" style="margin:4px 0 0 0;">3단계 계층 구조로 포털 메뉴를 구성하고 노출 여부를 설정합니다.</p>
        </div>
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
          <div class="form-group" style="margin-bottom: 8px;">
            <label class="form-label" style="font-weight:600; color:#334155;">사이트명 (상단 탭 및 브릿지 페이지 노출 명칭)</label>
            <input type="text" id="input-siteName" class="form-input" placeholder="예: 기본 사이트">
          </div>
          <div class="form-group" style="margin-bottom: 8px;">
            <label class="form-label" style="font-weight:600; color:#334155;">포털 URL명 <span id="site-url-required-badge" style="color:#ef4444; font-size:12px; margin-left:4px;">(분기사이트 필수 등록 요건)</span></label>
            <div style="display:flex; align-items:center; border:1px solid #cbd5e1; border-radius:6px; overflow:hidden; background:#fff;">
              <span style="padding:8px 10px; background:#f1f5f9; color:#64748b; font-size:13px; border-right:1px solid #cbd5e1; user-select:none; white-space:nowrap;">https://kyobodasomcare.com/health/</span>
              <input type="text" id="input-siteUrl" style="flex:1; border:none; padding:8px 12px; font-size:13px; outline:none;" placeholder="branch-a">
            </div>
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

    <div class="config-card" style="margin-top: 24px;">
      <div class="card-header"><h2 class="card-title">사이트 운영 상태 설정</h2></div>
      <div class="card-body">
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
            
            <label id="op-status-active-box" style="display:flex; align-items:flex-start; gap:12px; padding:16px; border:2px solid #2563eb; border-radius:8px; background:#eff6ff; cursor:pointer; transition:all 0.2s;">
              <input type="radio" name="siteOperationStatus" value="active" id="input-opStatus-active" onchange="onOperationStatusChange('active')" style="margin-top:3px; accent-color:#2563eb;">
              <div>
                <div style="font-weight:700; font-size:14px; color:#1e293b; display:flex; align-items:center; gap:6px;">
                  <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#16a34a;"></span>
                  운영
                </div>
                <div style="font-size:13px; color:#475569; margin-top:6px; line-height:1.5;">
                  • URL 접속 가능<br/>
                  • 대상 고객의 브릿지 페이지에 노출
                </div>
              </div>
            </label>

            <label id="op-status-inactive-box" style="display:flex; align-items:flex-start; gap:12px; padding:16px; border:1px solid #cbd5e1; border-radius:8px; background:#fff; cursor:pointer; transition:all 0.2s;">
              <input type="radio" name="siteOperationStatus" value="inactive" id="input-opStatus-inactive" onchange="onOperationStatusChange('inactive')" style="margin-top:3px; accent-color:#2563eb;">
              <div>
                <div style="font-weight:700; font-size:14px; color:#64748b; display:flex; align-items:center; gap:6px;">
                  <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#94a3b8;"></span>
                  미운영
                </div>
                <div style="font-size:13px; color:#64748b; margin-top:6px; line-height:1.5;">
                  • URL 직접 접속 차단<br/>
                  • 브릿지 페이지 미노출<br/>
                  <span style="color:#0284c7; font-size:12px; font-weight:500;">(단, 관리자에서는 기존 고객사·등급·메뉴 설정을 그대로 조회·수정 가능)</span>
                </div>
              </div>
            </label>

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
  setupMenuDragAndDrop();
}

window.onOperationStatusChange = function(status) {
  const activeBox = document.getElementById("op-status-active-box");
  const inactiveBox = document.getElementById("op-status-inactive-box");
  
  if (status === "active") {
    if (activeBox) {
      activeBox.style.border = "2px solid #2563eb";
      activeBox.style.background = "#eff6ff";
    }
    if (inactiveBox) {
      inactiveBox.style.border = "1px solid #cbd5e1";
      inactiveBox.style.background = "#fff";
    }
  } else {
    if (activeBox) {
      activeBox.style.border = "1px solid #cbd5e1";
      activeBox.style.background = "#fff";
    }
    if (inactiveBox) {
      inactiveBox.style.border = "2px solid #ef4444";
      inactiveBox.style.background = "#fef2f2";
    }
  }
};

window.enableDrag = function(e) {
  const item = e.target.closest('.menu-tree-item');
  if (item) {
    item.setAttribute('draggable', 'true');
  }
};

window.disableDrag = function(e) {
  const item = e.target.closest('.menu-tree-item');
  if (item) {
    if (!item.classList.contains('dragging')) {
      item.setAttribute('draggable', 'false');
    }
  }
};

function setupMenuDragAndDrop() {
  const container = document.getElementById("menu-tree-container");
  if (!container) return;

  let draggedItem = null;

  container.addEventListener('dragstart', (e) => {
    const item = e.target.closest('.menu-tree-item');
    if (!item) return;
    draggedItem = item;
    item.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.getAttribute('data-id'));
  });

  container.addEventListener('dragend', (e) => {
    if (draggedItem) {
      draggedItem.classList.remove('dragging');
      draggedItem.setAttribute('draggable', 'false');
      draggedItem = null;
    }
    const items = container.querySelectorAll('.menu-tree-item');
    items.forEach(el => {
      el.classList.remove('drag-over-above', 'drag-over-below', 'drag-over-child');
    });
  });

  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (!draggedItem) return;
    
    const targetItem = e.target.closest('.menu-tree-item');
    if (!targetItem || targetItem === draggedItem) return;
    if (draggedItem.contains(targetItem)) return;

    const row = targetItem.querySelector('.menu-item-row');
    if (!row) return;

    const rect = row.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const height = rect.height;

    // Reset previous dragover classes
    const items = container.querySelectorAll('.menu-tree-item');
    items.forEach(el => {
      if (el !== targetItem) {
        el.classList.remove('drag-over-above', 'drag-over-below', 'drag-over-child');
      }
    });

    const targetDepth = parseInt(targetItem.className.match(/depth-(\d+)/)[1]);

    if (targetDepth < 3 && relativeY > height * 0.33 && relativeY < height * 0.66) {
      targetItem.classList.add('drag-over-child');
      targetItem.classList.remove('drag-over-above', 'drag-over-below');
    } else if (relativeY <= height * 0.5) {
      targetItem.classList.add('drag-over-above');
      targetItem.classList.remove('drag-over-below', 'drag-over-child');
    } else {
      targetItem.classList.add('drag-over-below');
      targetItem.classList.remove('drag-over-above', 'drag-over-child');
    }
  });

  container.addEventListener('drop', (e) => {
    e.preventDefault();
    if (!draggedItem) return;

    const targetItem = e.target.closest('.menu-tree-item');
    if (!targetItem || targetItem === draggedItem) return;
    if (draggedItem.contains(targetItem)) return;

    const row = targetItem.querySelector('.menu-item-row');
    if (!row) return;

    const rect = row.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const height = rect.height;

    const targetDepth = parseInt(targetItem.className.match(/depth-(\d+)/)[1]);

    if (targetDepth < 3 && relativeY > height * 0.33 && relativeY < height * 0.66) {
      // Drop as child
      let childrenContainer = targetItem.querySelector('.menu-children-container');
      if (!childrenContainer) {
        childrenContainer = document.createElement('div');
        childrenContainer.id = `children-${targetItem.getAttribute('data-id')}`;
        childrenContainer.className = 'menu-children-container';
        targetItem.appendChild(childrenContainer);
      }
      childrenContainer.appendChild(draggedItem);
    } else if (relativeY <= height * 0.5) {
      // Drop above target
      targetItem.parentNode.insertBefore(draggedItem, targetItem);
    } else {
      // Drop below target
      targetItem.parentNode.insertBefore(draggedItem, targetItem.nextSibling);
    }

    updateMenuStructureFromDOM();
  });
}

function updateMenuStructureFromDOM() {
  const client = adminClientConfigs[currentClientId];
  const activeSite = client.sites.find(s => s.siteId === currentSiteId) || client.sites[0];
  
  // 1. Flatten all menus to easily look them up by ID
  const flatMenus = {};
  function flat(menus) {
    menus.forEach(m => {
      flatMenus[m.id] = {
        id: m.id,
        defaultLabel: m.defaultLabel,
        label: m.label,
        isVisible: m.isVisible,
        children: []
      };
      if (m.children) flat(m.children);
    });
  }
  flat(activeSite.menus);

  // 2. Build tree from DOM starting from depth 1
  const container = document.getElementById("menu-tree-container");
  if (!container) return;

  function buildTreeFromDOM(el, depth) {
    const items = Array.from(el.children).filter(child => child.classList.contains('menu-tree-item'));
    const levelMenus = [];
    
    items.forEach(item => {
      const menuId = item.getAttribute('data-id');
      const menuObj = flatMenus[menuId];
      if (menuObj) {
        const childrenContainer = item.querySelector('.menu-children-container');
        if (childrenContainer && depth < 3) {
          menuObj.children = buildTreeFromDOM(childrenContainer, depth + 1);
        } else {
          menuObj.children = [];
        }
        levelMenus.push(menuObj);
      }
    });
    return levelMenus;
  }

  const newMenus = buildTreeFromDOM(container, 1);

  // 3. Set the new menu array for the active site
  activeSite.menus = newMenus;

  // 4. Sync menu structural order to all other clients/sites
  Object.keys(adminClientConfigs).forEach(clientId => {
    adminClientConfigs[clientId].sites.forEach(site => {
      if (clientId === currentClientId && site.siteId === currentSiteId) return;
      
      const siteFlatMenus = {};
      function flatSite(menus) {
        menus.forEach(m => {
          siteFlatMenus[m.id] = m;
          if (m.children) flatSite(m.children);
        });
      }
      flatSite(site.menus);

      function reconstruct(refMenus) {
        return refMenus.map(refM => {
          const siteM = siteFlatMenus[refM.id];
          if (siteM) {
            siteM.children = refM.children ? reconstruct(refM.children) : [];
            return siteM;
          }
          return null;
        }).filter(Boolean);
      }

      site.menus = reconstruct(newMenus);
    });
  });

  // 5. Re-render client settings (maintains inputs, updates view depths and icons)
  loadClientSettings();
  setupMenuDragAndDrop();
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

  const siteUrlEl = document.getElementById('input-siteUrl');
  const siteUrlBadge = document.getElementById('site-url-required-badge');
  const isSuperSiteActive = (currentClientId === 'dasom') && (activeSite.isCommonSite || activeSite.isSuperSite || activeSite.siteName === '교보다솜헬스케어');

  if (siteUrlEl) {
    siteUrlEl.value = activeSite.siteUrl || '';
    if (isSuperSiteActive) {
      siteUrlEl.placeholder = "공통 사이트(설정 제외)";
      siteUrlEl.disabled = true;
      if (siteUrlEl.parentElement) siteUrlEl.parentElement.style.background = "#f8fafc";
      siteUrlEl.style.background = "#f8fafc";
      siteUrlEl.style.cursor = "not-allowed";
    } else {
      siteUrlEl.placeholder = "branch-a";
      siteUrlEl.disabled = false;
      if (siteUrlEl.parentElement) siteUrlEl.parentElement.style.background = "#fff";
      siteUrlEl.style.background = "#fff";
      siteUrlEl.style.cursor = "text";
    }
  }

  if (siteUrlBadge) {
    if (isSuperSiteActive) {
      siteUrlBadge.textContent = "(공통 사이트는 포털 URL 입력 제외)";
      siteUrlBadge.style.color = "#64748b";
    } else {
      siteUrlBadge.textContent = "(분기사이트 필수 등록 요건)";
      siteUrlBadge.style.color = "#ef4444";
    }
  }

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

  // Operation Status setting
  const opStatus = activeSite.operationStatus || 'active';
  const activeRadio = document.getElementById('input-opStatus-active');
  const inactiveRadio = document.getElementById('input-opStatus-inactive');
  if (opStatus === 'inactive') {
    if (inactiveRadio) inactiveRadio.checked = true;
    if (window.onOperationStatusChange) window.onOperationStatusChange('inactive');
  } else {
    if (activeRadio) activeRadio.checked = true;
    if (window.onOperationStatusChange) window.onOperationStatusChange('active');
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
    item.setAttribute('data-id', menu.id);
    item.innerHTML = `
      <div class="menu-item-row ${!menu.isVisible ? 'disabled' : ''}" style="display:grid; grid-template-columns: 1.2fr 1.2fr 100px 280px; align-items:center; gap:12px;">
        <div class="menu-tree-info" style="display:flex; align-items:center; gap:8px;">
          <!-- Drag Handle -->
          <div class="drag-handle" style="display:flex; align-items:center; justify-content:center; width:20px; height:20px; cursor:grab; margin-right:4px;" onmousedown="enableDrag(event)" onmouseup="disableDrag(event)" onmouseleave="disableDrag(event)">
            <svg class="drag-handle-icon" width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: #94a3b8; flex-shrink: 0; pointer-events:none;">
              <circle cx="3" cy="3" r="1.5" fill="currentColor"/>
              <circle cx="9" cy="3" r="1.5" fill="currentColor"/>
              <circle cx="3" cy="9" r="1.5" fill="currentColor"/>
              <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
              <circle cx="3" cy="15" r="1.5" fill="currentColor"/>
              <circle cx="9" cy="15" r="1.5" fill="currentColor"/>
            </svg>
          </div>
          <input type="text" class="form-input default-label-input" value="${menu.defaultLabel || menu.label}" onchange="updateMenuDefaultLabel('${menu.id}', this.value)" placeholder="기본 명칭">
        </div>
        <div class="menu-tree-info">
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
  const isSuperSiteActive = (currentClientId === 'dasom') && (activeSite.isCommonSite || activeSite.isSuperSite || activeSite.siteName === '교보다솜헬스케어');
  
  const siteNameInput = document.getElementById('input-siteName');
  if (siteNameInput) {
    const nameVal = siteNameInput.value.trim();
    if (nameVal) {
      activeSite.siteName = nameVal;
    }
  }

  const siteUrlInput = document.getElementById('input-siteUrl');
  if (siteUrlInput && !isSuperSiteActive) {
    const urlVal = siteUrlInput.value.trim();
    if (!urlVal) {
      alert("포털 URL명(분기 경로)은 분기사이트의 필수 등록 요건입니다. (예: branch-a)");
      siteUrlInput.focus();
      return;
    }
    activeSite.siteUrl = urlVal;
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
  window.isMenuSettingsDirty = false;
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
            ${site.operationStatus === 'inactive' ? '<span style="font-size:10px; background:#fef2f2; border:1px solid #fca5a5; padding:2px 6px; border-radius:10px; color:#ef4444; font-weight:700;">미운영</span>' : ''}
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

// --- Super Site (Common Site) Modal & Logic ---
window.openSuperSiteEditModal = function(site) {
  const client = adminClientConfigs[currentClientId];
  if (!client) return;

  const defaultAvailableClients = [
    { id: "kyobo", name: "교보생명", tiers: ["종합등급 1호", "헬스케어서비스", "헬스케어Ⅱ", "New헬스케어서비스", "New헬스케어 건강특화형", "VIP등급", "우대등급", "프리미엄등급", "라이트등급"] },
    { id: "other", name: "A기업", tiers: ["임직원 1등급", "임원급", "일반형", "고급형"] },
    { id: "b_company", name: "B기업", tiers: ["B기업 임직원형", "B기업 우대형"] },
    { id: "c_company", name: "C기업", tiers: ["C기업 기본형", "C기업 골드형"] },
    { id: "d_company", name: "D기업", tiers: ["D기업 임직원형"] },
    { id: "e_company", name: "E기업", tiers: ["E기업 임직원형"] },
    { id: "f_company", name: "F기업", tiers: ["F기업 임직원형"] },
    { id: "g_company", name: "G기업", tiers: ["G기업 임직원형"] },
    { id: "h_company", name: "H기업", tiers: ["H기업 임직원형"] },
    { id: "i_company", name: "I기업", tiers: ["I기업 임직원형"] }
  ];

  Object.values(adminClientConfigs).forEach(c => {
    if (c.id !== 'dasom' && !defaultAvailableClients.some(ac => ac.id === c.id)) {
      defaultAvailableClients.push({
        id: c.id,
        name: c.name || c.serviceName,
        tiers: c.tiers || ["기본등급"]
      });
    }
  });

  const selectedClientIds = site.selectedClientIds && site.selectedClientIds.length > 0 
    ? [...site.selectedClientIds] 
    : ["kyobo", "other", "b_company"];

  const clientTierMap = site.clientTierMap 
    ? JSON.parse(JSON.stringify(site.clientTierMap)) 
    : {
        kyobo: ["종합등급 1호", "헬스케어서비스"],
        other: ["임직원 1등급"],
        b_company: ["B기업 임직원형"]
      };

  window.superSiteState = {
    siteId: site.siteId,
    siteName: site.siteName || "교보다솜헬스케어",
    allClients: defaultAvailableClients,
    selectedClientIds: selectedClientIds,
    clientTierMap: clientTierMap,
    activeClientFilter: "ALL",
    step1Search: "",
    step2LeftSearch: "",
    step2RightSearch: ""
  };

  const modal = document.createElement("div");
  modal.id = "edit-site-modal";
  modal.style = "position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px;";
  
  modal.innerHTML = `
    <div class="config-card" style="width:100%; max-width:820px; max-height:90vh; background:#fff; border-radius:12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); overflow:hidden; display:flex; flex-direction:column;">
      <div class="card-header" style="padding: 20px 24px 16px 24px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0; background:#fff;">
        <h2 class="card-title" style="font-size:18px; font-weight:700; color:#1e293b; margin:0;">사이트 정보 및 등급 수정</h2>
      </div>

      <div class="card-body" style="padding: 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 24px;">
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label class="form-label" style="font-weight:600; color:#334155; font-size:14px; margin:0;">사이트명</label>
          <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
            <input type="text" id="super-site-name" class="form-input" value="${window.superSiteState.siteName}" placeholder="교보다솜헬스케어" style="width:180px; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; font-weight:600; color:#1e293b; background:#fff;">
            <span style="background:#eff6ff; color:#2563eb; font-size:13px; font-weight:600; padding:6px 14px; border-radius:6px; border:1px solid #bfdbfe; display:inline-flex; align-items:center;">공통 이용사이트</span>
            <span style="font-size:13px; color:#64748b;">이 사이트는 분기사이트를 생성하지 않는 고객사들이 이용하는 공통 이용사이트입니다.</span>
          </div>
        </div>

        <hr style="border:none; border-top:1px solid #f1f5f9; margin:0;">

        <div id="super-site-step-1" style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="background:#2563eb; color:white; width:24px; height:24px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-weight:700; font-size:13px;">1</span>
            <span style="font-size:16px; font-weight:700; color:#1e293b;">이용 고객사 선택</span>
          </div>

          <div style="display: grid; grid-template-columns: 160px 1fr; gap: 16px; align-items: start;">
            <div style="font-size: 13px; color: #64748b; line-height: 1.5;">
              이 사이트를 이용할 고객사를 선택합니다.
            </div>

            <div>
              <div class="shuttle-box" style="display: flex; gap: 12px; align-items: stretch;">
                <div class="shuttle-panel" style="flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; background: white; display: flex; flex-direction: column; height: 260px; overflow: hidden;">
                  <div style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-weight: 600; font-size: 13px; color: #334155;">
                    전체 고객사 목록
                  </div>
                  <div style="padding: 8px; border-bottom: 1px solid #e2e8f0; background:#fff;">
                    <input type="text" placeholder="고객사 검색..." style="width: 100%; padding: 6px 10px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 4px; outline: none;" oninput="filterSuperSiteClientsLeft(this.value)">
                  </div>
                  <div id="super-site-clients-left" style="flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 4px; background:#fff;">
                  </div>
                </div>

                <div class="shuttle-actions" style="display: flex; flex-direction: column; justify-content: center; gap: 10px; width: 76px; align-items: center; padding: 0 2px;">
                  <button type="button" class="btn btn-sm" onclick="moveSuperSiteClients('add')" style="width: 100%; font-size: 13px; font-weight: 600; padding: 8px 4px; display: flex; align-items: center; justify-content: center; background:#17B890; color:white; border:none; border-radius:6px; cursor:pointer;">
                    추가 ▶
                  </button>
                  <button type="button" class="btn btn-sm" onclick="moveSuperSiteClients('remove')" style="width: 100%; font-size: 13px; font-weight: 600; padding: 8px 4px; display: flex; align-items: center; justify-content: center; background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; border-radius:6px; cursor:pointer;">
                    ◀ 제거
                  </button>
                </div>

                <div class="shuttle-panel" style="flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; background: white; display: flex; flex-direction: column; height: 260px; overflow: hidden;">
                  <div id="super-site-clients-right-header" style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-weight: 600; font-size: 13px; color: #334155;">
                    선택된 고객사 (${window.superSiteState.selectedClientIds.length})
                  </div>
                  <div id="super-site-clients-right" style="flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 4px; background:#fff;">
                  </div>
                </div>
              </div>

              <div style="display:flex; justify-content:center; margin-top:14px;">
                <button type="button" onclick="completeStep1()" style="background:#2563eb; color:white; font-size:14px; font-weight:600; padding:9px 28px; border:none; border-radius:6px; cursor:pointer; box-shadow: 0 2px 4px rgba(37,99,235,0.2);">
                  선택 완료
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr style="border:none; border-top:1px solid #f1f5f9; margin:0;">

        <div id="super-site-step-2" style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="background:#2563eb; color:white; width:24px; height:24px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-weight:700; font-size:13px;">2</span>
              <span style="font-size:16px; font-weight:700; color:#1e293b;">고객사별 등급 설정</span>
            </div>

            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <label style="font-size:13px; font-weight:600; color:#334155;">설정할 고객사</label>
              <div style="display:inline-flex; align-items:center; gap:6px;">
                <input type="text" id="super-site-client-search" placeholder="고객사 검색..." oninput="onSuperSiteClientSearch(this.value)" style="width:130px; padding:6px 10px; font-size:13px; border:1px solid #cbd5e1; border-radius:6px; outline:none; background:#fff;">
                <select id="super-site-client-filter" onchange="onSuperSiteClientFilterChange(this.value)" style="padding:6.5px 12px; font-size:13px; font-weight:600; border:1px solid #cbd5e1; border-radius:6px; outline:none; background:#fff; min-width:140px;">
                </select>
              </div>
              <span style="font-size:12px; color:#94a3b8;">선택한 고객사의 등급만 노출됩니다.</span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 160px 1fr; gap: 16px; align-items: start;">
            <div style="font-size: 13px; color: #64748b; line-height: 1.5;">
              선택한 각 고객사의 접속 허용 등급을 설정합니다.<br/><br/>
              고객사를 변경하면 해당 고객사의 등급 목록이 표시됩니다.
            </div>

            <div>
              <div class="shuttle-box" style="display: flex; gap: 12px; align-items: stretch;">
                <div class="shuttle-panel" style="flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; background: white; display: flex; flex-direction: column; height: 260px; overflow: hidden;">
                  <div style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-weight: 600; font-size: 13px; color: #334155;">
                    전체 등급 목록
                  </div>
                  <div style="padding: 8px; border-bottom: 1px solid #e2e8f0; background:#fff;">
                    <input type="text" placeholder="등급 검색..." style="width: 100%; padding: 6px 10px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 4px; outline: none;" oninput="filterSuperSiteTiersLeft(this.value)">
                  </div>
                  <div id="super-site-tiers-left" style="flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 4px; background:#fff;">
                  </div>
                </div>

                <div class="shuttle-actions" style="display: flex; flex-direction: column; justify-content: center; gap: 10px; width: 76px; align-items: center; padding: 0 2px;">
                  <button type="button" class="btn btn-sm" onclick="moveSuperSiteTiers('add')" style="width: 100%; font-size: 13px; font-weight: 600; padding: 8px 4px; display: flex; align-items: center; justify-content: center; background:#17B890; color:white; border:none; border-radius:6px; cursor:pointer;">
                    추가 ▶
                  </button>
                  <button type="button" class="btn btn-sm" onclick="moveSuperSiteTiers('remove')" style="width: 100%; font-size: 13px; font-weight: 600; padding: 8px 4px; display: flex; align-items: center; justify-content: center; background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; border-radius:6px; cursor:pointer;">
                    ◀ 제거
                  </button>
                </div>

                <div class="shuttle-panel" style="flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; background: white; display: flex; flex-direction: column; height: 260px; overflow: hidden;">
                  <div id="super-site-tiers-right-header" style="padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-weight: 600; font-size: 13px; color: #334155;">
                    접속 허용 등급 목록 (0)
                  </div>
                  <div style="padding: 8px; border-bottom: 1px solid #e2e8f0; background:#fff;">
                    <input type="text" placeholder="등급 검색..." style="width: 100%; padding: 6px 10px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 4px; outline: none;" oninput="filterSuperSiteTiersRight(this.value)">
                  </div>
                  <div id="super-site-tiers-right" style="flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 4px; background:#fff;">
                  </div>
                </div>
              </div>

              <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 12px 16px; margin-top: 14px; font-size: 12px; color: #0369a1; line-height: 1.6;">
                <div style="font-weight: 700; font-size: 13px; margin-bottom: 4px; display: flex; align-items: center; gap: 4px; color: #0284c7;">
                  <span style="display:inline-block; border-radius:50%; background:#0284c7; color:white; width:16px; height:16px; font-size:11px; text-align:center; line-height:16px;">i</span> 안내
                </div>
                <ul style="margin: 0; padding-left: 16px; list-style-type: disc; color:#0369a1;">
                  <li>고객사를 변경해도 각 고객사의 설정 내용은 유지됩니다.</li>
                  <li>모든 선택 고객사에 대해 1개 이상의 접속 허용 등급을 설정해야 저장할 수 있습니다.</li>
                </ul>
              </div>

              <div style="border: 1px dashed #cbd5e1; border-radius: 8px; padding: 10px 14px; margin-top: 10px; font-size: 12px; color: #64748b; background: #fafafa;">
                <div style="font-weight: 600; color: #475569; margin-bottom: 2px;">저장 시 유의사항</div>
                <div>이미 다른 사이트에 지정된 등급은 좌측 목록에서 비활성화되어 중복 매핑이 방지됩니다.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="padding: 16px 24px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; background: #fff; flex-shrink: 0;">
        <button type="button" class="btn" onclick="scrollToStep1()" style="padding: 8px 18px; font-size: 13px; font-weight: 600; color: #475569; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer;">
          이전 단계
        </button>
        <div style="display: flex; gap: 8px;">
          <button type="button" class="btn" onclick="closeEditSiteModal()" style="padding: 8px 18px; font-size: 13px; font-weight: 600; color: #475569; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer;">
            취소
          </button>
          <button type="button" class="btn btn-primary" onclick="submitSuperSiteEdit()" style="padding: 8px 24px; font-size: 13px; font-weight: 600; color: white; background: #2563eb; border: none; border-radius: 6px; cursor: pointer; box-shadow: 0 2px 4px rgba(37,99,235,0.2);">
            저장하기
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  window.renderSuperSiteStep1();
  window.updateSuperSiteClientDropdownOptions();
  window.renderSuperSiteStep2();
};

window.filterSuperSiteClientsLeft = function(val) {
  window.superSiteState.step1Search = val;
  window.renderSuperSiteStep1();
};

window.renderSuperSiteStep1 = function() {
  const leftContainer = document.getElementById("super-site-clients-left");
  const rightContainer = document.getElementById("super-site-clients-right");
  const rightHeader = document.getElementById("super-site-clients-right-header");
  if (!leftContainer || !rightContainer) return;

  const search = (window.superSiteState.step1Search || "").toLowerCase();
  const selectedIds = window.superSiteState.selectedClientIds;

  let leftHtml = "";
  const availableClients = window.superSiteState.allClients.filter(c => 
    !selectedIds.includes(c.id) && c.name.toLowerCase().includes(search)
  );

  availableClients.forEach(c => {
    leftHtml += `
      <label style="display:flex; align-items:center; gap:8px; padding:6px 8px; font-size:13px; color:#334155; cursor:pointer; margin:0; background:#fff; border-radius:4px; border:1px solid #e2e8f0; user-select:none;">
        <input type="checkbox" class="super-client-left-chk" value="${c.id}" style="width:14px; height:14px; accent-color:#2563eb;">
        <span style="font-weight:600;">${c.name}</span>
      </label>
    `;
  });

  if (leftHtml === "") {
    leftHtml = `<div style="text-align:center; color:#94a3b8; font-size:12px; margin-top:20px;">검색 결과가 없거나 모든 고객사가 선택되었습니다.</div>`;
  }
  leftContainer.innerHTML = leftHtml;

  let rightHtml = "";
  const selectedClients = window.superSiteState.allClients.filter(c => selectedIds.includes(c.id));
  
  if (rightHeader) {
    rightHeader.textContent = `선택된 고객사 (${selectedClients.length})`;
  }

  selectedClients.forEach(c => {
    rightHtml += `
      <div style="display:flex; align-items:center; justify-content:space-between; padding:6px 10px; font-size:13px; color:#334155; background:#fff; border-radius:4px; border:1px solid #e2e8f0; margin:0;">
        <span style="font-weight:600;">${c.name}</span>
        <button type="button" onclick="removeSuperSiteClient('${c.id}')" title="고객사 삭제" style="border:none; background:none; color:#94a3b8; font-size:14px; cursor:pointer; padding:0 4px;">✕</button>
      </div>
    `;
  });

  if (rightHtml === "") {
    rightHtml = `<div style="text-align:center; color:#94a3b8; font-size:12px; margin-top:20px;">선택된 고객사가 없습니다.</div>`;
  }
  rightContainer.innerHTML = rightHtml;
};

window.moveSuperSiteClients = function(action) {
  if (action === 'add') {
    const checked = Array.from(document.querySelectorAll('.super-client-left-chk:checked')).map(el => el.value);
    if (checked.length === 0) {
      alert("추가할 고객사를 좌측 목록에서 선택해 주세요.");
      return;
    }
    checked.forEach(id => {
      if (!window.superSiteState.selectedClientIds.includes(id)) {
        window.superSiteState.selectedClientIds.push(id);
        const clientObj = window.superSiteState.allClients.find(c => c.id === id);
        if (clientObj && clientObj.tiers && clientObj.tiers.length > 0) {
          if (!window.superSiteState.clientTierMap[id]) {
            window.superSiteState.clientTierMap[id] = [clientObj.tiers[0]];
          }
        }
      }
    });
  } else if (action === 'remove') {
    alert("우측 목록의 [✕] 버튼을 눌러 지정된 고객사를 제거할 수 있습니다.");
    return;
  }

  window.renderSuperSiteStep1();
  window.updateSuperSiteClientDropdownOptions();
  window.renderSuperSiteStep2();
};

window.removeSuperSiteClient = function(clientId) {
  window.superSiteState.selectedClientIds = window.superSiteState.selectedClientIds.filter(id => id !== clientId);
  delete window.superSiteState.clientTierMap[clientId];
  if (window.superSiteState.activeClientFilter === clientId) {
    window.superSiteState.activeClientFilter = "ALL";
  }
  window.renderSuperSiteStep1();
  window.updateSuperSiteClientDropdownOptions();
  window.renderSuperSiteStep2();
};

window.completeStep1 = function() {
  if (window.superSiteState.selectedClientIds.length === 0) {
    alert("이 사이트를 이용할 고객사를 최소 1개 이상 선택해 주세요.");
    return;
  }
  window.updateSuperSiteClientDropdownOptions();
  window.renderSuperSiteStep2();
  const step2El = document.getElementById("super-site-step-2");
  if (step2El) {
    step2El.scrollIntoView({ behavior: "smooth" });
  }
};

window.scrollToStep1 = function() {
  const step1El = document.getElementById("super-site-step-1");
  if (step1El) {
    step1El.scrollIntoView({ behavior: "smooth" });
  }
};

window.updateSuperSiteClientDropdownOptions = function(searchQuery) {
  const selectEl = document.getElementById("super-site-client-filter");
  if (!selectEl) return;

  const searchInput = document.getElementById("super-site-client-search");
  const q = (searchQuery !== undefined ? searchQuery : (searchInput ? searchInput.value : "")).toLowerCase();

  const currentVal = window.superSiteState.activeClientFilter;
  let optionsHtml = `<option value="ALL">전체</option>`;

  window.superSiteState.selectedClientIds.forEach(id => {
    const clientObj = window.superSiteState.allClients.find(c => c.id === id);
    const name = clientObj ? clientObj.name : id;
    if (!q || name.toLowerCase().includes(q)) {
      optionsHtml += `<option value="${id}" ${currentVal === id ? 'selected' : ''}>${name}</option>`;
    }
  });

  selectEl.innerHTML = optionsHtml;
};

window.onSuperSiteClientSearch = function(val) {
  window.updateSuperSiteClientDropdownOptions(val);
  const selectEl = document.getElementById("super-site-client-filter");
  if (selectEl) {
    const visibleOpts = Array.from(selectEl.options).map(o => o.value);
    if (!visibleOpts.includes(window.superSiteState.activeClientFilter)) {
      const nextVal = visibleOpts.length > 1 ? visibleOpts[1] : (visibleOpts[0] || "ALL");
      window.superSiteState.activeClientFilter = nextVal;
      selectEl.value = nextVal;
      window.renderSuperSiteStep2();
    }
  }
};

window.onSuperSiteClientFilterChange = function(val) {
  window.superSiteState.activeClientFilter = val;
  window.renderSuperSiteStep2();
};

window.filterSuperSiteTiersLeft = function(val) {
  window.superSiteState.step2LeftSearch = val;
  window.renderSuperSiteStep2();
};

window.filterSuperSiteTiersRight = function(val) {
  window.superSiteState.step2RightSearch = val;
  window.renderSuperSiteStep2();
};

window.renderSuperSiteStep2 = function() {
  const leftContainer = document.getElementById("super-site-tiers-left");
  const rightContainer = document.getElementById("super-site-tiers-right");
  const rightHeader = document.getElementById("super-site-tiers-right-header");
  if (!leftContainer || !rightContainer) return;

  const leftSearch = (window.superSiteState.step2LeftSearch || "").toLowerCase();
  const rightSearch = (window.superSiteState.step2RightSearch || "").toLowerCase();
  const filter = window.superSiteState.activeClientFilter;
  const selectedClientIds = window.superSiteState.selectedClientIds;
  const clientTierMap = window.superSiteState.clientTierMap;

  const targetClientIds = filter === "ALL" ? selectedClientIds : [filter];

  let leftItems = [];
  let rightItems = [];

  targetClientIds.forEach(cId => {
    const clientObj = window.superSiteState.allClients.find(c => c.id === cId);
    if (!clientObj) return;

    const mappedForThisClient = clientTierMap[cId] || [];
    const allTiersForThisClient = clientObj.tiers || [];

    allTiersForThisClient.forEach(tierName => {
      const isMapped = mappedForThisClient.includes(tierName);
      const itemObj = {
        clientId: cId,
        clientName: clientObj.name,
        tierName: tierName
      };

      if (isMapped) {
        rightItems.push(itemObj);
      } else {
        leftItems.push(itemObj);
      }
    });
  });

  const filteredLeft = leftItems.filter(item =>
    item.tierName.toLowerCase().includes(leftSearch) || item.clientName.toLowerCase().includes(leftSearch)
  );

  let leftHtml = "";
  filteredLeft.forEach(item => {
    const clientBadge = filter === "ALL" ? `<span style="font-size:10px; color:#64748b; background:#f1f5f9; padding:1px 6px; border-radius:4px; margin-left:auto;">${item.clientName}</span>` : "";
    leftHtml += `
      <label style="display:flex; align-items:center; gap:8px; padding:6px 8px; font-size:13px; color:#334155; cursor:pointer; margin:0; background:#fff; border-radius:4px; border:1px solid #e2e8f0; user-select:none;">
        <input type="checkbox" class="super-tier-left-chk" value="${item.clientId}:::${item.tierName}" style="width:14px; height:14px; accent-color:#2563eb;">
        <span style="font-weight:600;">${item.tierName}</span>
        ${clientBadge}
      </label>
    `;
  });

  if (leftHtml === "") {
    leftHtml = `<div style="text-align:center; color:#94a3b8; font-size:12px; margin-top:20px;">검색 결과가 없거나 모든 등급이 추가되었습니다.</div>`;
  }
  leftContainer.innerHTML = leftHtml;

  const filteredRight = rightItems.filter(item =>
    item.tierName.toLowerCase().includes(rightSearch) || item.clientName.toLowerCase().includes(rightSearch)
  );

  if (rightHeader) {
    rightHeader.textContent = `접속 허용 등급 목록 (${rightItems.length})`;
  }

  let rightHtml = "";
  filteredRight.forEach(item => {
    const clientBadge = filter === "ALL" ? `<span style="font-size:10px; color:#2563eb; background:#eff6ff; padding:1px 6px; border-radius:4px; margin-left:auto;">${item.clientName}</span>` : "";
    rightHtml += `
      <label style="display:flex; align-items:center; gap:8px; padding:6px 8px; font-size:13px; color:#334155; cursor:pointer; margin:0; background:#fff; border-radius:4px; border:1px solid #e2e8f0; user-select:none;">
        <input type="checkbox" class="super-tier-right-chk" value="${item.clientId}:::${item.tierName}" style="width:14px; height:14px; accent-color:#2563eb;">
        <span style="font-weight:600;">${item.tierName}</span>
        ${clientBadge}
      </label>
    `;
  });

  if (rightHtml === "") {
    rightHtml = `<div style="text-align:center; color:#94a3b8; font-size:12px; margin-top:20px;">선택된 등급이 없습니다.<br/>(좌측에서 선택 후 추가)</div>`;
  }
  rightContainer.innerHTML = rightHtml;
};

window.moveSuperSiteTiers = function(action) {
  if (action === 'add') {
    const checked = Array.from(document.querySelectorAll('.super-tier-left-chk:checked')).map(el => el.value);
    if (checked.length === 0) {
      alert("추가할 등급을 좌측 목록에서 선택해 주세요.");
      return;
    }
    checked.forEach(val => {
      const [cId, tierName] = val.split(":::");
      if (!window.superSiteState.clientTierMap[cId]) {
        window.superSiteState.clientTierMap[cId] = [];
      }
      if (!window.superSiteState.clientTierMap[cId].includes(tierName)) {
        window.superSiteState.clientTierMap[cId].push(tierName);
      }
    });
  } else if (action === 'remove') {
    const checked = Array.from(document.querySelectorAll('.super-tier-right-chk:checked')).map(el => el.value);
    if (checked.length === 0) {
      alert("제거할 등급을 우측 목록에서 선택해 주세요.");
      return;
    }
    checked.forEach(val => {
      const [cId, tierName] = val.split(":::");
      if (window.superSiteState.clientTierMap[cId]) {
        window.superSiteState.clientTierMap[cId] = window.superSiteState.clientTierMap[cId].filter(t => t !== tierName);
      }
    });
  }

  window.renderSuperSiteStep2();
};

window.submitSuperSiteEdit = function() {
  const nameInput = document.getElementById("super-site-name");
  const name = nameInput ? nameInput.value.trim() : "교보다솜헬스케어";

  if (!name) {
    alert("사이트명을 입력해 주세요.");
    return;
  }

  const selectedClientIds = window.superSiteState.selectedClientIds;
  if (selectedClientIds.length === 0) {
    alert("이 사이트를 이용할 고객사를 최소 1개 이상 선택해 주세요.");
    return;
  }

  const missingClients = [];
  selectedClientIds.forEach(cId => {
    const mapped = window.superSiteState.clientTierMap[cId] || [];
    if (mapped.length === 0) {
      const clientObj = window.superSiteState.allClients.find(c => c.id === cId);
      missingClients.push(clientObj ? clientObj.name : cId);
    }
  });

  if (missingClients.length > 0) {
    alert(`모든 선택 고객사에 대해 1개 이상의 접속 허용 등급을 설정해야 저장할 수 있습니다.\n\n[미설정 고객사]: ${missingClients.join(", ")}`);
    return;
  }

  const client = adminClientConfigs[currentClientId];
  const site = client.sites.find(s => s.siteId === window.superSiteState.siteId);
  if (site) {
    site.siteName = name;
    site.selectedClientIds = [...selectedClientIds];
    site.clientTierMap = JSON.parse(JSON.stringify(window.superSiteState.clientTierMap));
    
    const allMappedTiers = Array.from(new Set(Object.values(window.superSiteState.clientTierMap).flat()));
    site.mappedTiers = allMappedTiers;
    site.isCommonSite = true;
    site.isSuperSite = true;
  }

  closeEditSiteModal();
  window.isMenuSettingsDirty = true;
  loadClientSettings();
  showToast(`사이트 '${name}'의 등급 설정이 임시 반영되었습니다. 최상단 [변경사항 저장] 버튼을 누르셔야 전체 적용이 완료됩니다.`);
};

window.openEditSiteModal = function(siteId) {
  const client = adminClientConfigs[currentClientId];
  const site = client.sites.find(s => s.siteId === siteId);
  if (!site) return;

  const isSuperSite = (currentClientId === 'dasom') && (site.isCommonSite || site.isSuperSite || site.siteName === '교보다솜헬스케어');
  if (isSuperSite) {
    window.openSuperSiteEditModal(site);
    return;
  }

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
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:16px;">
          <div class="form-group">
            <label class="form-label" style="font-weight:600; color:#334155; margin-bottom:8px; display:block;">사이트명</label>
            <input type="text" id="edit-site-name" class="form-input" value="${site.siteName}" placeholder="예: 프리미엄 회원 사이트" style="width:100%; padding:10px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:14px;">
          </div>
          <div class="form-group">
            <label class="form-label" style="font-weight:600; color:#334155; margin-bottom:8px; display:block;">포털 URL명 <span style="color:#ef4444; font-size:12px;">(필수)</span></label>
            <div style="display:flex; align-items:center; border:1px solid #cbd5e1; border-radius:6px; overflow:hidden; background:#fff;">
              <span style="padding:10px 10px; background:#f1f5f9; color:#64748b; font-size:13px; border-right:1px solid #cbd5e1; user-select:none; white-space:nowrap;">https://healthcare.co.kr/</span>
              <input type="text" id="edit-site-url" value="${site.siteUrl || ''}" placeholder="branch-a" style="flex:1; border:none; padding:10px 12px; font-size:14px; outline:none;">
            </div>
          </div>
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

  const urlInput = document.getElementById("edit-site-url");
  const siteUrl = urlInput ? urlInput.value.trim() : "";
  if (!siteUrl) {
    alert("포털 URL명(분기 경로)은 분기사이트의 필수 등록 요건입니다. (예: branch-a)");
    if (urlInput) urlInput.focus();
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
    site.siteUrl = siteUrl;
    site.mappedTiers = mappedTiers;
  }
  
  closeEditSiteModal();
  window.isMenuSettingsDirty = true;
  loadClientSettings();
  showToast(`사이트 '${name}'의 등급 설정이 임시 반영되었습니다. 최상단 [변경사항 저장] 버튼을 누르셔야 전체 적용이 완료됩니다.`);
};

window.openAddSiteModal = function() {
  const modal = document.createElement("div");
  modal.id = "add-site-modal";
  modal.style = "position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px;";
  
  const clientOptions = Object.values(adminClientConfigs).map(c => `
    <option value="${c.id}" ${c.id === currentClientId ? 'selected' : ''}>${c.name} (${c.id})</option>
  `).join('');

  modal.innerHTML = `
    <div class="config-card" style="width:100%; max-width:540px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border-radius:12px; overflow:hidden;">
      <div class="card-header" style="background:#f8fafc; padding:18px 24px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
        <h2 class="card-title" style="font-size:18px; font-weight:700; color:#1e293b; margin:0;">신규 사이트 생성</h2>
        <button onclick="closeAddSiteModal()" style="background:none; border:none; font-size:20px; color:#94a3b8; cursor:pointer; line-height:1;">×</button>
      </div>
      <div class="card-body" style="padding:24px;">
        <!-- 1순위: 고객사 선택 -->
        <div class="form-group" style="margin-bottom:20px;">
          <label class="form-label" style="font-weight:700; color:#1e293b; margin-bottom:8px; display:block; font-size:14px;">
            1. 대상 고객사 선택 <span style="color:#ef4444; font-size:12px;">(필수)</span>
          </label>
          <select id="new-site-client" class="form-select" style="width:100%; padding:10px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:14px; font-weight:500; background:#fff; outline:none;">
            ${clientOptions}
          </select>
          <p style="font-size:12px; color:#64748b; margin-top:4px; margin-bottom:0;">* 신규 사이트를 생성할 대상 고객사를 최상단에서 먼저 선택하세요.</p>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:24px;">
          <div class="form-group">
            <label class="form-label" style="font-weight:700; color:#1e293b; margin-bottom:8px; display:block; font-size:14px;">
              2. 사이트명 <span style="color:#ef4444; font-size:12px;">(필수)</span>
            </label>
            <input type="text" id="new-site-name" class="form-input" placeholder="예: 프리미엄 회원 사이트" style="width:100%; padding:10px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:14px; outline:none;">
          </div>
          <div class="form-group">
            <label class="form-label" style="font-weight:700; color:#1e293b; margin-bottom:8px; display:block; font-size:14px;">
              3. 포털 URL명 <span style="color:#ef4444; font-size:12px;">(필수)</span>
            </label>
            <div style="display:flex; align-items:center; border:1px solid #cbd5e1; border-radius:6px; overflow:hidden; background:#fff;">
              <span style="padding:10px 8px; background:#f1f5f9; color:#64748b; font-size:12px; border-right:1px solid #cbd5e1; user-select:none; white-space:nowrap;">https://kyobodasomcare.com/health/</span>
              <input type="text" id="new-site-url" placeholder="branch-a" style="flex:1; border:none; padding:10px 8px; font-size:13px; outline:none; min-width:0;">
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px solid #f1f5f9; padding-top:16px;">
          <button class="btn" style="background:#fff; border:1px solid #cbd5e1; color:#475569; padding:9px 20px; font-weight:500;" onclick="closeAddSiteModal()">취소</button>
          <button class="btn btn-primary" style="background:#0f2942; color:#fff; padding:9px 24px; font-weight:600; border:none;" onclick="submitAddSite()">사이트 생성 및 이동</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};

window.closeAddSiteModal = function() {
  const modal = document.getElementById("add-site-modal");
  if (modal) modal.remove();
};

window.submitAddSite = function() {
  const targetClientId = document.getElementById("new-site-client").value;
  const name = document.getElementById("new-site-name").value.trim();
  if (!name) {
    alert("사이트명을 입력해 주세요.");
    document.getElementById("new-site-name").focus();
    return;
  }

  const urlInput = document.getElementById("new-site-url");
  const siteUrlVal = urlInput ? urlInput.value.trim() : "";
  if (!siteUrlVal) {
    alert("포털 URL명(분기 경로)은 분기사이트의 필수 등록 요건입니다. (예: branch-a)");
    if (urlInput) urlInput.focus();
    return;
  }
  
  const client = adminClientConfigs[targetClientId];
  if (!client) return;

  const newSiteId = "site_" + Date.now();
  const defaultSite = client.sites?.[0] || {};
  
  let formattedUrl = siteUrlVal;
  if (!formattedUrl.startsWith("http")) {
    formattedUrl = `https://kyobodasomcare.com/health/${siteUrlVal.replace(/^\/+/, '')}`;
  }

  const newSite = {
    siteId: newSiteId,
    siteName: name,
    siteUrl: formattedUrl,
    siteType: "분기",
    status: "active",
    mappedTiers: [...(client.tiers || [])],
    logoImage: defaultSite.logoImage || null,
    themeColor: defaultSite.themeColor || BRAND_DEFAULTS.themeColor,
    themeColorRgb: defaultSite.themeColorRgb || BRAND_DEFAULTS.themeColorRgb,
    menuTextColor: defaultSite.menuTextColor || BRAND_DEFAULTS.menuTextColor,
    heroText: { title: name + "에 오신 것을 환영합니다", subtitle: "고객님을 위한 특별한 혜택과 정보를 제공합니다." },
    serviceName: defaultSite.serviceName || client.serviceName || client.name || "",
    csNumber: defaultSite.csNumber || client.csNumber || "1588-1004",
    name: defaultSite.name || client.name || "",
    clientLink: defaultSite.clientLink || "",
    providerName: defaultSite.providerName || BRAND_DEFAULTS.providerName,
    providerLink: defaultSite.providerLink || BRAND_DEFAULTS.providerLink,
    menus: JSON.parse(JSON.stringify(defaultMenus))
  };
  
  if (!client.sites) client.sites = [];
  client.sites.push(newSite);
  
  currentClientId = targetClientId;
  currentSiteId = newSiteId;
  
  closeAddSiteModal();
  showToast(`'${client.name}'의 신규 사이트 '${name}'가 생성되었습니다. 메뉴 설정 화면으로 이동합니다.`);
  enterSiteMenuEditor(targetClientId, newSiteId);
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
} catch (err) {
  alert("admin.js 런타임 에러 감지!\n\n스택:\n" + err.stack);
}
