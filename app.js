// Data Models (Default/Fallback)
const clientConfigs = {
  kyobo: {
    id: "kyobo", name: "교보생명 ", serviceName: "교보헬스케어", csNumber: "1588-7524", clientLink: "https://www.kyobo.com", dasomLink: "", themeColor: "#2F4A9A", themeColorRgb: "47, 74, 154", logoText: "교보생명 헬스케어",
    tiers: ["종합등급 1호", "헬스케어서비스", "헬스케어Ⅱ", "New헬스케어서비스", "New헬스케어 건강특화형"],
    heroText: { title: "삶을 사랑하는 마음, 건강까지 함께합니다.", subtitle: "든든한 건강 파트너, 교보생명 헬스케어서비스를 지금 이용해 보세요.", csNumber: "1588-7524" }, menus: []
  },
  dasom: {
    id: "dasom", name: "교보다솜케어", serviceName: "교보다솜케어", csNumber: "1588-1002", clientLink: "", dasomLink: "", themeColor: "#17B890", themeColorRgb: "23, 184, 144", logoText: "교보다솜케어",
    tiers: ["통합등급", "우대등급"],
    heroText: { title: "더 건강한 삶, 교보다솜케어", subtitle: "고객님의 평생 건강 파트너, 교보다솜케어가 프리미엄 서비스를 시작합니다.", csNumber: "1588-1002" }, menus: []
  },
  other: {
    id: "other", name: "A기업(제휴사)", serviceName: "A기업", csNumber: "1588-1003", clientLink: "", dasomLink: "", themeColor: "#5b21b6", themeColorRgb: "91, 33, 182", logoText: "A기업 복지라운지",
    tiers: ["임직원 1등급", "임원급"],
    heroText: { title: "임직원 복지 라운지", subtitle: "A기업 임직원만을 위한 프리미엄 건강 관리 혜택을 만나보세요.", csNumber: "1588-1003" }, menus: []
  }
};

window.showCheckupSupportModal = function () {
  if (document.getElementById('checkup-support-modal')) return;

  const modalHtml = `
    <div id="checkup-support-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 100000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); animation: fadeIn 0.2s ease;">
      <div style="background: white; border-radius: 20px; width: 90%; max-width: 420px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.2); animation: slideUp 0.3s ease;">
        <div style="padding: 32px 24px; text-align: center;">
          <div style="width: 64px; height: 64px; background: #f0fdf4; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto;">
            <svg width="32" height="32" fill="none" stroke="#16a34a" stroke-width="2.5" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h3 style="font-size: 19px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0;">회사지원 확인</h3>
          <p style="font-size: 14.5px; color: #475569; margin: 0 0 28px 0; font-weight: 600; line-height: 1.5;">회사지원 건강검진이신가요?</p>
          <div style="display: flex; gap: 12px; justify-content: center;">
            <button onclick="window.handleCheckupSupportChoice(false)" style="flex: 1; padding: 12px; background: #eff6ff; color: #2563eb; font-size: 15px; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#dbeafe'" onmouseout="this.style.background='#eff6ff'">아니요(우대예약)</button>
            <button onclick="window.handleCheckupSupportChoice(true)" style="flex: 1; padding: 12px; background: #2563eb; color: white; font-size: 15px; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'">네(회사지원)</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.handleCheckupSupportChoice = function (isCompanySupport) {
  const modal = document.getElementById('checkup-support-modal');
  if (modal) modal.remove();
  
  sessionStorage.setItem('isCompanySupport', isCompanySupport ? 'true' : 'false');
  window.location.hash = '#/portal/' + state.activeClient.id + '/' + state.activeSite.siteId + '/checkupAppt/' + (isCompanySupport ? 'checkupCorporate' : 'checkupPreferred');
};

const defaultMenus = [
  { id: "serviceGuide", defaultLabel: "서비스 안내", label: "서비스 안내", isVisible: true, children: [] },
  {
    id: "healthConsulting", defaultLabel: "건강상담", label: "건강상담", isVisible: true, children: [
      { id: "consultApply", defaultLabel: "건강상담 신청", label: "건강상담 신청", isVisible: false, children: [] },
      { id: "consultHistory", defaultLabel: "전화상담 및 온라인 문의 이력", label: "전화상담 및 온라인 문의 이력", isVisible: true, children: [] }
    ]
  },
  {
    id: "hospitalGuide", defaultLabel: "병원안내", label: "병원안내", isVisible: true, children: [
      { id: "search", defaultLabel: "병원검색", label: "병원검색", isVisible: true, children: [] },
      { id: "expert", defaultLabel: "명의안내", label: "병원 및 명의안내", isVisible: true, children: [
        { id: "history", defaultLabel: "상담 신청 이력", label: "상담 신청 이력", isVisible: true, children: [] }
      ] }
    ]
  },
  {
    id: "medicalAppt", defaultLabel: "진료예약", label: "진료예약", isVisible: true, children: [
      { id: "history", defaultLabel: "상담 신청 이력", label: "상담 신청 이력", isVisible: true, children: [] }
    ]
  },
  {
    id: "checkupAppt", defaultLabel: "건강검진", label: "건강검진", isVisible: true, children: [
      { id: "checkupPreferred", defaultLabel: "건강검진 우대예약", label: "건강검진 우대예약", isVisible: true, children: [] },
      { id: "checkupCorporate", defaultLabel: "회사지원 건강검진", label: "회사지원 건강검진", isVisible: true, children: [] },
      { id: "checkupHistory", defaultLabel: "건강검진 신청이력", label: "건강검진 신청이력", isVisible: true, children: [] }
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
    id: "psyCare", defaultLabel: "마음 힐링케어", label: "마음 힐링케어", isVisible: true, children: [
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

const BRAND_DEFAULTS = {
  themeColor: "#17B890",
  themeColorRgb: "23, 184, 144",
  menuTextColor: "#5f6368",
  providerName: "교보다솜케어",
  providerLink: "#",
  logoImage: null
};

function getMenuPath(subId, fallback) {
  const client = state.activeClient;
  if (!client) return `${fallback}/${subId}`;
  const activeSite = state.activeSite || client.sites[0];
  const menus = activeSite?.menus || [];
  for (const m of menus) {
    if (m.children) {
      const child = m.children.find(c => c.id === subId);
      if (child) {
        return `${m.id}/${child.id}`;
      }
    }
  }
  return `${fallback}/${subId}`;
}

function getParentMenuLabel(subId, fallback) {
  const client = state.activeClient;
  if (!client) return fallback;
  const activeSite = state.activeSite || client.sites[0];
  const menus = activeSite?.menus || [];
  for (const m of menus) {
    if (m.children) {
      const child = m.children.find(c => c.id === subId);
      if (child) {
        return m.label;
      }
    }
  }
  return fallback;
}

const mockUsers = {
  user_multi: {
    id: "user_multi",
    name: "홍길동",
    birth: "1985.06.12",
    gender: "남성",
    phone: "010-5678-1234",
    email: "hong@naver.com",
    address: "서울특별시 종로구 인사동 10길 12, 3층",
    clients: ["kyobo", "dasom", "other"],
    tiers: { kyobo: ["기본플랜", "VIP플랜"], dasom: ["통합등급"], other: ["임직원 1등급"] }
  },
  user_single_dasom: {
    id: "user_single_dasom",
    name: "이다솜",
    birth: "1990.04.28",
    gender: "여성",
    phone: "010-9876-5432",
    email: "dasom@gmail.com",
    address: "서울특별시 마포구 마포대로 56",
    clients: ["dasom"],
    tiers: { dasom: ["우대등급"] }
  },
  user_single_other: {
    id: "user_single_other",
    name: "김제휴",
    birth: "1978.11.03",
    gender: "남성",
    phone: "010-4321-8765",
    email: "jeseong@naver.com",
    address: "경기도 성남시 분당구 정자일로 95",
    clients: ["other"],
    tiers: { other: ["임원급"] }
  }
};

let state = { currentUser: null, activeClient: null, route: window.location.hash || '#/' };

window.handleLocationSearch = function() {
  const modalId = 'location-consent-modal';
  if (document.getElementById(modalId)) return;

  const modalHtml = `
    <div id="${modalId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
      <div style="background: white; border-radius: 16px; padding: 32px; width: 100%; max-width: 400px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); text-align: center; animation: modalFadeIn 0.3s ease-out;">
        <div style="width: 56px; height: 56px; border-radius: 28px; background: #e0e7ff; color: #2F4A9A; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
          <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>
        </div>
        <h3 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #1e293b;">위치 정보 수집 동의</h3>
        <p style="margin: 0 0 24px 0; font-size: 15px; color: #64748b; line-height: 1.5; word-break: keep-all;">
          현재 위치를 사용하여 반경 5~10km 이내의 제휴 검진병원을 검색하시겠습니까?
        </p>
        <div style="display: flex; gap: 12px;">
          <button id="${modalId}-btn-no" style="flex: 1; padding: 14px; border-radius: 8px; border: none; background: #f1f5f9; color: #475569; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">거부</button>
          <button id="${modalId}-btn-yes" style="flex: 1; padding: 14px; border-radius: 8px; border: none; background: #2F4A9A; color: white; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#1e3a8a'" onmouseout="this.style.background='#2F4A9A'">동의</button>
        </div>
      </div>
      <style>@keyframes modalFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }</style>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const processConsent = (consent) => {
    const logEntry = {
      LOG_ID: 'LOG_' + Date.now(),
      MEMBER_ID: state.currentUser ? state.currentUser.name : 'user_' + Math.floor(Math.random() * 9000 + 1000),
      CONSENT_YN: consent ? 'Y' : 'N',
      CONSENT_DATETIME: new Date().toLocaleString('ko-KR'),
      SERVICE_TYPE: '건강검진 우대예약',
      SCREEN_ID: '검진병원 검색 메인',
      PURPOSE: '주변 제휴 검진병원 조회',
      CLIENT_IP: '192.168.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255),
      USER_AGENT: navigator.userAgent,
      CREATED_AT: new Date().toLocaleString('ko-KR')
    };

    const logs = JSON.parse(localStorage.getItem('locationLogs') || '[]');
    logs.unshift(logEntry);
    localStorage.setItem('locationLogs', JSON.stringify(logs));

    document.getElementById(modalId).remove();

    if (consent) {
      alert("위치 정보 제공에 동의하셨습니다.\n(현재는 예시 동작으로, 실제 위치 기반 검색 결과는 향후 연동됩니다.)");
    }
  };

  document.getElementById(`${modalId}-btn-yes`).onclick = () => processConsent(true);
  document.getElementById(`${modalId}-btn-no`).onclick = () => processConsent(false);
};

window.handleHospitalAction = function(event, hospitalName, pkg) {
  const btn = event.target.closest('.hospital-action-btn');
  if (!btn) return;
  const action = btn.getAttribute('data-action');
  if (action === 'info') window.showHospitalInfoModal(hospitalName, 'info');
  else if (action === 'checkup') window.showHospitalInfoModal(hospitalName, 'checkup');
  else if (action === 'schedule') window.showScheduleModal(hospitalName);
  else if (action === 'reserve') {
    sessionStorage.setItem('selectedHospital', hospitalName + ' - ' + pkg);
    const activeSub = state.activeSubId || '';
    const activeMenu = state.activeMenuId || '';
    const menuObj = state.activeClient && state.activeSite ? state.activeSite.menus.find(m => m.id === activeMenu) : null;
    const subObj = menuObj && menuObj.children ? menuObj.children.find(c => c.id === activeSub) : null;
    const pageTitle = subObj ? subObj.label : '';
    const isCompanySupport = activeSub === 'checkupCorporate' || activeSub === 'checkupWelfare' || decodeURIComponent(activeSub).includes('회사지원') || (pageTitle && pageTitle.includes('회사지원'));
    sessionStorage.setItem('isCompanySupport', isCompanySupport ? 'true' : 'false');
    window.location.hash = '#/portal/' + state.activeClient.id + '/' + state.activeSite.siteId + '/' + state.activeMenuId + '/consent';
  }
};

window.showHospitalInfoModal = function(hospitalName, defaultTab = 'info') {
  const modalId = 'hospital-info-modal';
  if (document.getElementById(modalId)) return;

  const modalHtml = `
    <div id="${modalId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
      <div style="background: white; border-radius: 12px; width: 100%; max-width: 960px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); animation: modalFadeIn 0.3s ease-out; display: flex; flex-direction: column; position: relative;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 32px; border-bottom: 1px solid #e2e8f0; flex-shrink: 0;">
          <h2 style="margin: 0; font-size: 22px; font-weight: 800; color: #0f172a;">${hospitalName}</h2>
          <button onclick="document.getElementById('${modalId}').remove()" style="background: none; border: none; cursor: pointer; color: #64748b; padding: 4px; transition: color 0.2s;" onmouseover="this.style.color='#0f172a'" onmouseout="this.style.color='#64748b'">
            <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Main Tabs -->
        <div style="display: flex; border-bottom: 1px solid #e2e8f0; padding: 0 32px; background: #fff; flex-shrink: 0;">
          <button id="${modalId}-tab-info" style="flex: 1; padding: 20px 0; background: none; border: none; border-bottom: 3px solid ${defaultTab === 'info' ? '#2563eb' : 'transparent'}; color: ${defaultTab === 'info' ? '#2563eb' : '#64748b'}; font-size: 16px; font-weight: ${defaultTab === 'info' ? '800' : '600'}; cursor: pointer; transition: all 0.2s;">병원정보</button>
          <button id="${modalId}-tab-checkup" style="flex: 1; padding: 20px 0; background: none; border: none; border-bottom: 3px solid ${defaultTab === 'checkup' ? '#2563eb' : 'transparent'}; color: ${defaultTab === 'checkup' ? '#2563eb' : '#64748b'}; font-size: 16px; font-weight: ${defaultTab === 'checkup' ? '800' : '600'}; cursor: pointer; transition: all 0.2s;">검진항목</button>
        </div>

        <!-- Tab Content Container -->
        <div style="display: flex; flex-direction: column; overflow-y: auto; background: #fafaf9; flex: 1;">
          
          <!-- === Hospital Info View === -->
          <div id="${modalId}-view-info" style="display: ${defaultTab === 'info' ? 'block' : 'none'}; padding: 32px;">
            <!-- Top Card -->
            <div style="background: white; border-radius: 16px; padding: 32px; display: flex; gap: 32px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
              <div style="flex: 1;">
                <h1 style="margin: 0 0 12px 0; font-size: 28px; font-weight: 800; color: #0f172a;">${hospitalName}</h1>
                <p style="margin: 0 0 32px 0; font-size: 15px; color: #475569; line-height: 1.6;">정확한 진단과 따뜻한 마음으로<br>건강한 삶을 함께합니다.</p>
                
                <div style="display: flex; flex-direction: column; gap: 16px;">
                  <div style="display: flex; gap: 16px; align-items: flex-start;">
                    <div style="color: #3b82f6; display: flex; align-items: center; gap: 8px; width: 100px; font-weight: 700; font-size: 14px;">
                      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path></svg> 대표번호
                    </div>
                    <div style="color: #2563eb; font-weight: 700; font-size: 15px;">054-289-1722</div>
                  </div>
                  <div style="display: flex; gap: 16px; align-items: flex-start;">
                    <div style="color: #3b82f6; display: flex; align-items: center; gap: 8px; width: 100px; font-weight: 700; font-size: 14px;">
                      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> 주소
                    </div>
                    <div style="color: #475569; font-size: 15px;">경북 포항시 남구 포스코대로 351</div>
                  </div>
                  <div style="display: flex; gap: 16px; align-items: flex-start;">
                    <div style="color: #3b82f6; display: flex; align-items: center; gap: 8px; width: 100px; font-weight: 700; font-size: 14px;">
                      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path></svg> 홈페이지
                    </div>
                    <div style="color: #2563eb; font-size: 15px; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                      http://healthscreen.phgidok.com <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path></svg>
                    </div>
                  </div>
                  <div style="display: flex; gap: 16px; align-items: flex-start;">
                    <div style="color: #3b82f6; display: flex; align-items: center; gap: 8px; width: 100px; font-weight: 700; font-size: 14px;">
                      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg> 오시는 길
                    </div>
                    <div style="color: #475569; font-size: 15px;">버스 : KT(세명기독병원) 정류장 하차 (도보 3분)</div>
                  </div>
                </div>
              </div>
              
              <div style="flex: 1.2; border-radius: 12px; overflow: hidden; background: #f1f5f9; display: flex; align-items: center; justify-content: center; min-height: 260px; position: relative;">
                <svg width="80" height="80" fill="none" stroke="#cbd5e1" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="M21 15l-5-5L5 21"></path></svg>
                <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.5); color: white; font-size: 12px; padding: 6px 10px; border-radius: 4px;">사무포털 등록 병원 전경 영역</div>
              </div>
            </div>

            <!-- Bottom Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
              <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px;">
                <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 800; color: #0f172a;">약도</h3>
                <div style="width: 100%; height: 200px; background: #e0f2fe; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; position: relative; border: 1px solid #bae6fd;">
                   <svg width="48" height="48" fill="none" stroke="#7dd3fc" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                   <div style="position: absolute; bottom: 12px; color: #38bdf8; font-size: 13px; font-weight: 700;">카카오/네이버 지도 연동 영역</div>
                </div>
                <div style="background: #f8fafc; padding: 14px 16px; border-radius: 8px; display: flex; gap: 12px; align-items: center; border: 1px solid #f1f5f9;">
                   <svg width="20" height="20" fill="none" stroke="#3b82f6" stroke-width="2" viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                   <span style="font-size: 14px; color: #475569; font-weight: 500;">버스 : KT(세명기독병원) 정류장 하차 (도보 3분)</span>
                </div>
              </div>
              
              <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px;">
                <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 800; color: #0f172a;">병원 안내사항</h3>
                <div style="font-size: 15px; color: #475569; line-height: 1.8; word-break: keep-all;">
                  ${hospitalName}은(는) 1984년 개원 이래 지역민과 함께해온 종합병원입니다.<br><br>
                  최첨단 의료장비와 풍부한 임상 경험을 갖춘 의료진이 협력하여 정확한 진단과 최적의 치료를 제공합니다.<br><br>
                  환자 중심의 의료 서비스와 따뜻한 마음으로 건강한 삶을 함께 만들어 가겠습니다.
                </div>
              </div>
            </div>
          </div>

          <!-- === Checkup Items View === -->
          <div id="${modalId}-view-checkup" style="display: ${defaultTab === 'checkup' ? 'block' : 'none'}; padding: 32px; background: white;">
            <!-- Sub Tabs (Blue Segment) -->
            <div style="display: flex; border: 1px solid #2563eb; border-radius: 0px; overflow: hidden; margin-bottom: 20px;">
              <button id="${modalId}-sub-basic" style="flex: 1; padding: 14px 0; font-size: 15px; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s; background: #2563eb; color: white; border-right: 1px solid #2563eb;">기본 검사항목</button>
              <button id="${modalId}-sub-optional" style="flex: 1; padding: 14px 0; font-size: 15px; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s; background: white; color: #475569; border-right: 1px solid #2563eb;">선택 검사항목</button>
              <button id="${modalId}-sub-additional" style="flex: 1; padding: 14px 0; font-size: 15px; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s; background: white; color: #475569;">추가 검사항목</button>
            </div>

            <!-- Descriptive Text -->
            <ul id="${modalId}-desc-basic" style="margin: 0 0 20px 0; padding-left: 20px; color: #334155; font-size: 14px; font-weight: 600; line-height: 1.6;">
              <li style="list-style-type: disc;">본 검진패키지에는 다음의 검사항목이 모두 포함됩니다.</li>
            </ul>
            <ul id="${modalId}-desc-optional" style="margin: 0 0 20px 0; padding-left: 20px; color: #334155; font-size: 14px; font-weight: 600; line-height: 1.6; display: none;">
              <li style="list-style-type: disc;">선택 그룹별 지정된 개수의 항목을 선택할 수 있습니다.</li>
            </ul>
            <ul id="${modalId}-desc-additional" style="margin: 0 0 20px 0; padding-left: 20px; color: #334155; font-size: 14px; font-weight: 600; line-height: 1.6; display: none;">
              <li style="list-style-type: disc;">추가검사는 개인이 추가 비용을 들여 병원에서 직접 결제하시고 검사를 받으실 수 있는 항목입니다.</li>
              <li style="list-style-type: disc;">병원 패키지에 따라 추가검사는 기본 검사 항목에 포함된 경우가 있으니, 선택 시 유의하시기 바랍니다.</li>
              <li style="list-style-type: disc;">기본검사항목에 포함되어 있는 항목은 추가 비용이 발생되지 않습니다.</li>
            </ul>

            <!-- Table 1: Basic -->
            <div class="responsive-table-wrapper">
              <table id="${modalId}-table-basic" style="width: 100%; border-collapse: collapse; text-align: center; font-size: 14px; border-top: 2px solid #cbd5e1; margin-bottom: 16px;">
              <thead style="background: #f8fafc; font-weight: 700; color: #334155;">
                <tr>
                  <th style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; width: 15%;">구분</th>
                  <th style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; width: 25%;">검사항목</th>
                  <th style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; width: 45%;">항목설명</th>
                  <th style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; width: 15%;">비고</th>
                </tr>
              </thead>
              <tbody style="color: #475569;">
                <tr>
                  <td rowspan="5" style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 700; vertical-align: middle;">신체계측</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0;">신장</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; text-align: left;">신체의 길이나 발육을 나타내는 대표적인 기준</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0;">체중</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; text-align: left;">하루 동안에도 변동하며, 음식물섭취, 배설 등의 조건에 의해 변화</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0;">허리둘레</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; text-align: left;">허리둘레측정</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0;">비만도</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; text-align: left;">과다한 체지방을 가진 상태를 의미</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">문진</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; text-align: left;">과거병력 및 현재의 신체 상태 체크</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 700; vertical-align: middle;">체성분분석</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">체성분검사</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; text-align: left;">근육량, 체지방량, 수분량 등 신체균형</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 700; vertical-align: middle;">안과검사</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">시력, 안저, 안압</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; text-align: left;">근시/원시, 안저 혈관 변화, 녹내장, 안압상승</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 2px solid #cbd5e1; border-right: 1px solid #e2e8f0; font-weight: 700; vertical-align: middle;">심전도검사</td>
                  <td style="padding: 10px; border-bottom: 2px solid #cbd5e1; border-right: 1px solid #e2e8f0;">심전도</td>
                  <td style="padding: 10px; border-bottom: 2px solid #cbd5e1; border-right: 1px solid #e2e8f0; text-align: left;">협심증, 심근경색, 심실대비, 부정맥 등</td>
                  <td style="padding: 10px; border-bottom: 2px solid #cbd5e1;"></td>
                </tr>
              </tbody>
            </table>
          </div>

            <!-- Table 2: Optional -->
            <div class="responsive-table-wrapper">
              <table id="${modalId}-table-optional" style="width: 100%; border-collapse: collapse; text-align: center; font-size: 14px; border-top: 2px solid #cbd5e1; display: none; margin-bottom: 16px;">
              <thead style="background: #f8fafc; font-weight: 700; color: #334155;">
                <tr>
                  <th style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; width: 12%;">그룹</th>
                  <th style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; width: 15%;">구분</th>
                  <th style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; width: 20%;">검사항목</th>
                  <th style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; width: 43%;">항목설명</th>
                  <th style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; width: 10%;">비고</th>
                </tr>
              </thead>
              <tbody style="color: #475569;">
                <tr>
                  <td rowspan="2" style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 700; vertical-align: middle;">선택 A 1가지 선택</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; vertical-align: middle;">소화기검사</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0;">위내시경(비수면)</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; text-align: left;">식도염,위염,위궤양,십이지장염-비수면으로 검사 진행. 수면검사로 희망 시 위수면비 추가선택</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; vertical-align: middle;">소화기검사</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">위내시경(수면)</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; text-align: left;">수면유도제 투여 후 검사 진행. 식도염,위염,위궤양,십이지장염</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"></td>
                </tr>
                
                <tr>
                  <td rowspan="10" style="padding: 10px; border-bottom: 2px solid #cbd5e1; border-right: 1px solid #e2e8f0; font-weight: 700; vertical-align: middle;">선택 B 2가지 선택</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; vertical-align: middle;">골다공증검사</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0;">비타민D검사</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; text-align: left;">Vitamin D 결핍 검사</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; vertical-align: middle;">초음파</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0;">골반초음파</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; text-align: left;">자궁근종, 자궁내막질환, 난소낭종, 난소암</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #ef4444; font-weight: 600;">여성</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; vertical-align: middle;">초음파</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0;">경부초음파</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; text-align: left;">경부임파선,이하선 등</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; vertical-align: middle;">초음파</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0;">갑상선초음파</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; text-align: left;">갑상선암,갑상선결절</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; vertical-align: middle;">초음파</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0;">경동맥초음파</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; text-align: left;">경동맥협착증,심혈관질환 등</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; vertical-align: middle;">초음파</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0;">상복부초음파</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; text-align: left;">간,신장,비장,담낭,췌장 질환 검사</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; vertical-align: middle;">초음파</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0;">전립선초음파(남)</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; text-align: left;">전립선암,전립선비대증 등</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; vertical-align: middle;">초음파</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0;">방광초음파</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; text-align: left;">방광암 등</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; vertical-align: middle;">혈액특화검사</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0;">비타민B12검사</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; text-align: left;">빈혈,만성염증 등</td>
                  <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 2px solid #cbd5e1; border-right: 1px solid #e2e8f0; vertical-align: middle;">호르몬검사</td>
                  <td style="padding: 10px; border-bottom: 2px solid #cbd5e1; border-right: 1px solid #e2e8f0;">남성호르몬검사<br>(Testosterone)</td>
                  <td style="padding: 10px; border-bottom: 2px solid #cbd5e1; border-right: 1px solid #e2e8f0; text-align: left;">성선기능저하증, 뇌하수체기능저하증</td>
                  <td style="padding: 10px; border-bottom: 2px solid #cbd5e1;"></td>
                </tr>
              </tbody>
            </table>
          </div>

            <!-- Table 3: Additional -->
            <div class="responsive-table-wrapper">
              <table id="${modalId}-table-additional" style="width: 100%; border-collapse: collapse; text-align: center; font-size: 14px; border-top: 2px solid #cbd5e1; display: none; margin-bottom: 16px;">
              <thead style="background: #f8fafc; font-weight: 700; color: #334155;">
                <tr>
                  <th style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; width: 30%;">검사항목</th>
                  <th style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; width: 50%;">항목설명</th>
                  <th style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; width: 20%;">금액</th>
                </tr>
              </thead>
              <tbody style="color: #475569;">
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 700; color: #1e293b;">항산화 및 염분 대사증후군 검사</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; text-align: left;">고지혈증, 당뇨병, 고혈압, 내장 비만에 대한 평가</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #2563eb;">₩250,000</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 700; color: #1e293b;">수면추가(위내시경 선택시)</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; text-align: left;">위내시경 진행시 수면비용<br><span style="font-size:12px; color:#94a3b8;">※ 단독선택불가, 반드시 검사항목이 포함되어 있어야함</span></td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #2563eb;">₩40,000</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 700; color: #1e293b;">수면추가(대장내시경 선택시)</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; text-align: left;">대장내시경 진행시 수면비용<br><span style="font-size:12px; color:#94a3b8;">※ 단독선택불가, 반드시 검사항목이 포함되어 있어야함</span></td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #2563eb;">₩50,000</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 700; color: #1e293b;">경동맥초음파</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; text-align: left;">경동맥경화, 폐쇄성혈관질환</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #2563eb;">₩72,000</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 700; color: #1e293b;">심장초음파</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; text-align: left;">부정맥, 협심증, 심근경색증, 심장기능장애</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #2563eb;">₩120,000</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 2px solid #cbd5e1; border-right: 1px solid #e2e8f0; font-weight: 700; color: #1e293b;">유방초음파(여)</td>
                  <td style="padding: 12px; border-bottom: 2px solid #cbd5e1; border-right: 1px solid #e2e8f0; text-align: left;">유방암, 섬유선종, 유방내 각종질환</td>
                  <td style="padding: 12px; border-bottom: 2px solid #cbd5e1; font-weight: 700; color: #2563eb;">₩90,000</td>
                </tr>
              </tbody>
            </table>
          </div>
          </div>
          
        </div>

        <!-- Footer Button -->
        <div style="padding: 24px; border-top: 1px solid #e2e8f0; display: flex; justify-content: center; background: white; border-radius: 0 0 12px 12px; flex-shrink: 0;">
          <button onclick="document.getElementById('${modalId}').remove()" style="width: 240px; padding: 16px; background: #2563eb; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 800; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'">닫기</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // JS Logic for Main Tabs
  const tabInfoBtn = document.getElementById(`${modalId}-tab-info`);
  const tabCheckupBtn = document.getElementById(`${modalId}-tab-checkup`);
  const viewInfo = document.getElementById(`${modalId}-view-info`);
  const viewCheckup = document.getElementById(`${modalId}-view-checkup`);

  tabInfoBtn.onclick = () => {
    viewInfo.style.display = 'block';
    viewCheckup.style.display = 'none';
    tabInfoBtn.style.borderBottomColor = '#2563eb';
    tabInfoBtn.style.color = '#2563eb';
    tabInfoBtn.style.fontWeight = '800';
    tabCheckupBtn.style.borderBottomColor = 'transparent';
    tabCheckupBtn.style.color = '#64748b';
    tabCheckupBtn.style.fontWeight = '600';
  };

  tabCheckupBtn.onclick = () => {
    viewInfo.style.display = 'none';
    viewCheckup.style.display = 'block';
    tabCheckupBtn.style.borderBottomColor = '#2563eb';
    tabCheckupBtn.style.color = '#2563eb';
    tabCheckupBtn.style.fontWeight = '800';
    tabInfoBtn.style.borderBottomColor = 'transparent';
    tabInfoBtn.style.color = '#64748b';
    tabInfoBtn.style.fontWeight = '600';
  };

  // JS Logic for Sub Tabs
  const subBasicBtn = document.getElementById(`${modalId}-sub-basic`);
  const subOptionalBtn = document.getElementById(`${modalId}-sub-optional`);
  const subAdditionalBtn = document.getElementById(`${modalId}-sub-additional`);

  const descBasic = document.getElementById(`${modalId}-desc-basic`);
  const descOptional = document.getElementById(`${modalId}-desc-optional`);
  const descAdditional = document.getElementById(`${modalId}-desc-additional`);

  const tableBasic = document.getElementById(`${modalId}-table-basic`);
  const tableOptional = document.getElementById(`${modalId}-table-optional`);
  const tableAdditional = document.getElementById(`${modalId}-table-additional`);

  const resetSubTabs = () => {
    [subBasicBtn, subOptionalBtn, subAdditionalBtn].forEach(btn => {
      btn.style.background = 'white';
      btn.style.color = '#475569';
    });
    [descBasic, descOptional, descAdditional].forEach(el => el.style.display = 'none');
    [tableBasic, tableOptional, tableAdditional].forEach(el => el.style.display = 'none');
  };

  subBasicBtn.onclick = () => {
    resetSubTabs();
    subBasicBtn.style.background = '#2563eb';
    subBasicBtn.style.color = 'white';
    descBasic.style.display = 'block';
    tableBasic.style.display = 'table';
  };

  subOptionalBtn.onclick = () => {
    resetSubTabs();
    subOptionalBtn.style.background = '#2563eb';
    subOptionalBtn.style.color = 'white';
    descOptional.style.display = 'block';
    tableOptional.style.display = 'table';
  };

  subAdditionalBtn.onclick = () => {
    resetSubTabs();
    subAdditionalBtn.style.background = '#2563eb';
    subAdditionalBtn.style.color = 'white';
    descAdditional.style.display = 'block';
    tableAdditional.style.display = 'table';
  };
};

window.showScheduleModal = function(hospitalName) {
  const modalId = 'hospital-schedule-modal';
  if (document.getElementById(modalId)) return;

  // 예약 가능한 월 세팅 (가상 데이터: 현재 달력이 모두 마감일 경우, 6월로 이동)
  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  
  const mockAvailableMonth = 5; // 6월 (0-indexed)
  if (currentMonth < mockAvailableMonth && currentYear === 2026) {
    currentMonth = mockAvailableMonth;
  }
  if (currentMonth > 11 && currentYear === 2026) {
    currentMonth = 11;
  }

  const renderCalendar = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let daysHtml = '';
    
    // 빈 칸 (첫 날 이전)
    for (let i = 0; i < firstDay; i++) {
      daysHtml += `<div style="background: #f8fafc; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; min-height: 110px;"></div>`;
    }
    
    // 날짜 렌더링
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSunday = date.getDay() === 0;
      const isSaturday = date.getDay() === 6;
      
      let dayColor = '#334155';
      if (isSunday) dayColor = '#ef4444';
      if (isSaturday) dayColor = '#3b82f6';

      let statusHtml = '';
      let isAvailable = false;
      
      const status = window.getCheckupDateStatus(year, month + 1, day);
      if (status.type === 'holiday') {
        statusHtml = `<div style="color: #ef4444; font-size: 13px; font-weight: 700; margin-top: 6px;">휴일</div>`;
      } else if (status.type === 'available') {
        isAvailable = true;
        statusHtml = `
          <div style="background: #3b82f6; color: white; display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; margin-top: 6px; margin-bottom: 4px;">예약가능</div>
        `;
      } else if (status.type === 'partial') {
        isAvailable = true;
        const closedText = status.closedItems.map(item => `<div style="color: #64748b; font-size: 11px; margin-top: 2px; letter-spacing: -0.5px;">• ${item} 마감</div>`).join('');
        statusHtml = `
          <div style="background: #3b82f6; color: white; display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; margin-top: 6px; margin-bottom: 4px;">예약가능</div>
          ${closedText}
        `;
      } else {
        statusHtml = `<div style="color: #94a3b8; font-size: 13px; font-weight: 700; margin-top: 6px; text-decoration: line-through;">예약마감</div>`;
      }

      const bgStyle = isAvailable ? 'background: #eff6ff;' : 'background: white;';
      
      daysHtml += `
        <div style="padding: 12px; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; min-height: 110px; display: flex; flex-direction: column; align-items: flex-start; ${bgStyle}">
          <div style="color: ${dayColor}; font-size: 14px; font-weight: 700;">${day}</div>
          ${statusHtml}
        </div>
      `;
    }

    return `
      <div style="display: grid; grid-template-columns: repeat(7, 1fr); border-top: 2px solid #2563eb; border-left: 1px solid #e2e8f0;">
        <!-- Header -->
        ${['일', '월', '화', '수', '목', '금', '토'].map((d, i) => `<div style="padding: 12px 0; text-align: center; font-weight: 800; font-size: 14px; color: ${i===0?'#ef4444':i===6?'#3b82f6':'#334155'}; background: #f8fafc; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">${d}</div>`).join('')}
        <!-- Days -->
        ${daysHtml}
      </div>
    `;
  };

  const updateNavButtons = () => {
    const prevBtn = document.getElementById(`${modalId}-prev`);
    const nextBtn = document.getElementById(`${modalId}-next`);
    if (prevBtn) {
      if (currentYear === 2026 && currentMonth <= 5) prevBtn.style.visibility = 'hidden';
      else prevBtn.style.visibility = 'visible';
    }
    if (nextBtn) {
      if (currentYear === 2026 && currentMonth >= 11) nextBtn.style.visibility = 'hidden';
      else nextBtn.style.visibility = 'visible';
    }
  };

  const updateCalendar = (y, m) => {
    document.getElementById(`${modalId}-calendar-body`).innerHTML = renderCalendar(y, m);
    document.getElementById(`${modalId}-month-title`).innerText = `${y}년 ${m + 1}월`;
    updateNavButtons();
  };

  const modalHtml = `
    <div id="${modalId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
      <div style="background: white; border-radius: 12px; width: 100%; max-width: 900px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); animation: modalFadeIn 0.3s ease-out; display: flex; flex-direction: column;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 32px; border-bottom: 1px solid #e2e8f0; flex-shrink: 0;">
          <h2 style="margin: 0; font-size: 22px; font-weight: 800; color: #0f172a;">${hospitalName} 예약 일정</h2>
          <button onclick="document.getElementById('${modalId}').remove()" style="background: none; border: none; cursor: pointer; color: #64748b; padding: 4px; transition: color 0.2s;" onmouseover="this.style.color='#0f172a'" onmouseout="this.style.color='#64748b'">
            <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Content -->
        <div style="padding: 32px; background: #fafaf9; flex: 1; display: flex; flex-direction: column; gap: 24px;">
          
          <div style="background: white; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <!-- Calendar Nav -->
            <div style="display: flex; justify-content: center; align-items: center; gap: 24px; margin-bottom: 24px;">
              <button id="${modalId}-prev" style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; color: #64748b; padding: 8px; display: flex; transition: all 0.2s;" onmouseover="this.style.background='#f8fafc'"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"></path></svg></button>
              <h3 id="${modalId}-month-title" style="margin: 0; font-size: 22px; font-weight: 800; color: #0f172a; min-width: 140px; text-align: center;">${currentYear}년 ${currentMonth + 1}월</h3>
              <button id="${modalId}-next" style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; color: #64748b; padding: 8px; display: flex; transition: all 0.2s;" onmouseover="this.style.background='#f8fafc'"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg></button>
            </div>
            
            <div style="margin-bottom: 16px; font-size: 13px; color: #64748b; display: flex; justify-content: space-between; align-items: flex-end;">
              <div style="font-weight: 600;">* 원하시는 예약가능 날짜를 확인해주세요. (특정 검사 마감 여부 포함)</div>
              <div style="display: flex; gap: 16px; align-items: center; font-weight: 600;">
                <span style="display: flex; align-items: center; gap: 6px;"><div style="width:12px; height:12px; border-radius:4px; background:#3b82f6;"></div> 예약가능</span>
                <span style="display: flex; align-items: center; gap: 6px;"><div style="width:12px; height:12px; border-radius:4px; background:#94a3b8;"></div> 예약마감</span>
                <span style="display: flex; align-items: center; gap: 6px;"><div style="width:12px; height:12px; border-radius:4px; background:#ef4444;"></div> 휴일</span>
              </div>
            </div>

            <!-- Calendar Body -->
            <div id="${modalId}-calendar-body">
              ${renderCalendar(currentYear, currentMonth)}
            </div>
          </div>

        </div>

        <!-- Footer Button -->
        <div style="padding: 24px; border-top: 1px solid #e2e8f0; display: flex; justify-content: center; background: white; border-radius: 0 0 12px 12px; flex-shrink: 0;">
          <button onclick="document.getElementById('${modalId}').remove()" style="width: 240px; padding: 16px; background: #2563eb; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 800; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'">닫기</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  updateNavButtons();

  document.getElementById(`${modalId}-prev`).onclick = () => {
    if (currentYear === 2026 && currentMonth <= 5) return;
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    updateCalendar(currentYear, currentMonth);
  };

  document.getElementById(`${modalId}-next`).onclick = () => {
    if (currentYear === 2026 && currentMonth >= 11) return;
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    updateCalendar(currentYear, currentMonth);
  };
};

function getTierName(tier) {
  if (!tier) return "";
  if (typeof tier === 'string') return tier;
  if (typeof tier === 'object') {
    return tier.name || tier.tierName || tier.label || tier.id || String(tier);
  }
  return String(tier);
}

function getSortedAccessibleSites(client, userTiers) {
  if (!client || !client.sites) return [];
  const sites = client.sites.filter(site =>
    site.mappedTiers.some(t => {
      const tStr = getTierName(t);
      return userTiers.some(ut => getTierName(ut) === tStr);
    })
  );

  sites.sort((a, b) => {
    const getMinTierIndex = (site) => {
      if (!site.mappedTiers || site.mappedTiers.length === 0) return 999;
      const indices = site.mappedTiers
        .map(t => {
          const tStr = getTierName(t);
          return client.tiers ? client.tiers.map(getTierName).indexOf(tStr) : -1;
        })
        .filter(idx => idx !== -1);
      return indices.length > 0 ? Math.min(...indices) : 999;
    };
    return getMinTierIndex(a) - getMinTierIndex(b);
  });

  return sites;
}

function loadSavedConfigs() {
  try {
    const savedData = localStorage.getItem('hc_portal_data');
    let parsed = null;
    if (savedData) {
      try { parsed = JSON.parse(savedData); } catch (e) { }
    }

    if (parsed) {
      Object.keys(parsed).forEach(id => {
        const client = parsed[id];
        if (client.sites) {
          client.sites.forEach(site => {
            if (site.menus) {
              const healthMenu = site.menus.find(m => m.id === 'healthInfo');
              if (healthMenu && healthMenu.children) {
                const hasCustom = healthMenu.children.some(c => c.label === '분야별 건강정보' && c.id !== 'categoryInfo');
                if (hasCustom) {
                  healthMenu.children = healthMenu.children.filter(c => c.id !== 'categoryInfo');
                }
              }
            }
          });
        }
        if (!clientConfigs[id]) {
          clientConfigs[id] = parsed[id];
        }
      });
      try { localStorage.setItem('hc_portal_data', JSON.stringify(parsed)); } catch(e) {}
    }

    Object.keys(clientConfigs).forEach(id => {
      const client = clientConfigs[id];
      if (parsed && parsed[id]) {
        if (parsed[id].sites && parsed[id].sites.length > 0) {
          client.sites = parsed[id].sites;
          client.tiers = parsed[id].tiers || client.tiers;
          client.name = parsed[id].name || client.name;
          client.serviceName = parsed[id].serviceName || client.serviceName;
          client.csNumber = parsed[id].csNumber || client.csNumber;
        } else {
          const currentMenus = parsed[id].menus || client.menus || JSON.parse(JSON.stringify(defaultMenus));
          const defaultSite = {
            siteId: "default",
            siteName: "기본 사이트",
            mappedTiers: [...(parsed[id].tiers || client.tiers || [])],
            logoImage: parsed[id].logoImage || client.logoImage || null,
            themeColor: parsed[id].themeColor || client.themeColor || BRAND_DEFAULTS.themeColor,
            themeColorRgb: parsed[id].themeColorRgb || client.themeColorRgb || BRAND_DEFAULTS.themeColorRgb,
            menuTextColor: parsed[id].menuTextColor || client.menuTextColor || BRAND_DEFAULTS.menuTextColor,
            heroText: parsed[id].heroText || client.heroText || { title: "건강한 내일을 위한 첫걸음", subtitle: "교보생명 전용 헬스케어 포털에서 제공하는 프리미엄 건강 관리 서비스를 지금 바로 경험해보세요." },
            serviceName: parsed[id].serviceName || client.serviceName || client.name || "",
            csNumber: parsed[id].csNumber || client.csNumber || "",
            name: parsed[id].name || client.name || "",
            clientLink: parsed[id].clientLink || client.clientLink || "",
            providerName: parsed[id].providerName || client.providerName || BRAND_DEFAULTS.providerName,
            providerLink: parsed[id].providerLink || client.providerLink || BRAND_DEFAULTS.providerLink,
            menus: currentMenus
          };
          client.sites = [defaultSite];
          client.tiers = parsed[id].tiers || client.tiers;
        }
      } else {
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
          menus: JSON.parse(JSON.stringify(defaultMenus))
        };
        client.sites = [defaultSite];
      }

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
          } else if (checkupApptMenu && checkupApptMenu.children) {
            if (!checkupApptMenu.children.some(c => c.id === 'checkupPreferred')) {
              checkupApptMenu.children.push({ id: "checkupPreferred", defaultLabel: "건강검진 우대예약", label: "건강검진 우대예약", isVisible: true, children: [] });
            }
            if (!checkupApptMenu.children.some(c => c.id === 'checkupHistory')) {
              checkupApptMenu.children.push({ id: "checkupHistory", defaultLabel: "건강검진 신청이력", label: "건강검진 신청이력", isVisible: true, children: [] });
            }
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
    });

    syncAllClientMenus(clientConfigs);

    // Dynamically sync mock users with the loaded client configs and tiers!
    // 1. 홍길동 (user_multi) gets ALL clients and ALL tiers
    mockUsers.user_multi.clients = Object.keys(clientConfigs);
    mockUsers.user_multi.tiers = {};
    Object.keys(clientConfigs).forEach(id => {
      mockUsers.user_multi.tiers[id] = [...(clientConfigs[id].tiers || [])];
    });

    // 2. 이다솜 (user_single_dasom) gets all tiers of dasom, and other clients' tiers too to ensure no-match logic is safe
    mockUsers.user_single_dasom.clients = ["dasom"];
    mockUsers.user_single_dasom.tiers = {};
    Object.keys(clientConfigs).forEach(id => {
      mockUsers.user_single_dasom.tiers[id] = [...(clientConfigs[id].tiers || [])];
      if (id === 'dasom') {
        mockUsers.user_single_dasom.clients = ['dasom'];
      }
    });

    // 3. 김제휴 (user_single_other) gets all tiers of other
    mockUsers.user_single_other.clients = ["other"];
    mockUsers.user_single_other.tiers = {};
    Object.keys(clientConfigs).forEach(id => {
      mockUsers.user_single_other.tiers[id] = [...(clientConfigs[id].tiers || [])];
    });

    // Load saved email / portalId configurations and seed mock data
    Object.keys(mockUsers).forEach(userId => {
      const savedEmail = localStorage.getItem('hc_user_email_' + userId);
      if (savedEmail) {
        mockUsers[userId].email = savedEmail;
      }
      const savedAddress = localStorage.getItem('hc_user_address_' + userId);
      if (savedAddress) {
        mockUsers[userId].address = savedAddress;
      }
      const savedPortalId = localStorage.getItem('hc_portal_id_' + userId);
      if (savedPortalId) {
        mockUsers[userId].portalId = savedPortalId;
      }
    });
    seedMyPageMockData();
  } catch (error) {
    console.error("Incompatible client config, resetting localStorage key", error);
    try { localStorage.removeItem('hc_portal_data'); } catch (e) { }
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
}
loadSavedConfigs();

let app = null;

function render() {
  app = document.getElementById('app');
  if (!app) {
    // If DOM is not fully ready, wait for DOMContentLoaded
    window.addEventListener('DOMContentLoaded', render);
    return;
  }
  app.innerHTML = '';
  if (state.route === '#/' || state.route === '' || state.route === '#') renderLogin();
  else if (state.route === '#/select') renderClientSelect();
  else if (state.route.startsWith('#/portal/')) {
    if (!state.currentUser) { window.location.hash = '#/'; return; }
    const parts = state.route.split('/');
    const clientId = parts[2];
    const client = clientConfigs[clientId];

    if (client) {
      state.activeClient = client;

      const siteId = parts[3];
      const matchingSite = client.sites.find(s => s.siteId === siteId);

      if (matchingSite) {
        state.activeSite = matchingSite;
        state.activeMenuId = parts[4] || null;
        state.activeSubId = parts[5] || null;
        state.activeSubSubId = parts[6] || null;
      } else {
        const userTiers = state.currentUser ? (state.currentUser.tiers[clientId] || []) : [];
        const accessibleSites = getSortedAccessibleSites(client, userTiers);
        state.activeSite = accessibleSites[0] || client.sites[0];

        state.activeMenuId = parts[3] || null;
        state.activeSubId = parts[4] || null;
        state.activeSubSubId = parts[5] || null;
      }

      applyTheme(state.activeSite);
      renderPortal();
    } else {
      window.location.hash = '#/';
    }
  }
}

window.addEventListener('hashchange', () => { state.route = window.location.hash; render(); });

window.login = function (userId) {
  state.currentUser = mockUsers[userId];

  let totalSites = 0;
  let singleClient = null;
  let singleSite = null;

  state.currentUser.clients.forEach(clientId => {
    const client = clientConfigs[clientId];
    const userTiers = state.currentUser.tiers[clientId] || [];
    const accessibleSites = getSortedAccessibleSites(client, userTiers);
    totalSites += accessibleSites.length;
    if (accessibleSites.length > 0) {
      singleClient = client;
      singleSite = accessibleSites[0];
    }
  });

  if (totalSites === 1 && singleClient && singleSite) {
    state.activeClient = singleClient;
    state.activeSite = singleSite;
    window.location.hash = `#/portal/${singleClient.id}/${singleSite.siteId}`;
  } else {
    window.location.hash = '#/select';
  }
};

window.logout = function () {
  state.currentUser = null; state.activeClient = null; state.activeSite = null;
  window.location.hash = '#/';
  document.documentElement.style.removeProperty('--theme-color');
  document.documentElement.style.removeProperty('--theme-color-rgb');
};

window.toggleConsultingForm = function () {
  const form = document.getElementById('consulting-form-area');
  if (form) {
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    if (form.style.display === 'block') {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

window.toggleMedicalApptForm = function () {
  const form = document.getElementById('medical-appt-form-area');
  if (form) {
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    if (form.style.display === 'block') {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

window.toggleExpertConsultingForm = function () {
  const form = document.getElementById('expert-consulting-form-area');
  if (form) {
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    if (form.style.display === 'block') {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

window.toggleCheckupDesignForm = function () {
  const designForm = document.getElementById('checkup-design-form-area');
  const directForm = document.getElementById('checkup-direct-form-area');
  if (designForm) {
    if (directForm) directForm.style.display = 'none';
    designForm.style.display = designForm.style.display === 'none' ? 'block' : 'none';
    if (designForm.style.display === 'block') {
      designForm.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

window.toggleCheckupDirectForm = function () {
  const designForm = document.getElementById('checkup-design-form-area');
  const directForm = document.getElementById('checkup-direct-form-area');
  if (directForm) {
    if (designForm) designForm.style.display = 'none';
    directForm.style.display = directForm.style.display === 'none' ? 'block' : 'none';
    if (directForm.style.display === 'block') {
      directForm.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

window.updateCheckupConsultType = function (type) {
  const phoneFields = document.getElementById('checkup-phone-fields');
  const guidanceBox = document.getElementById('checkup-guidance-box');
  const dateInput = document.getElementById('checkup-date');

  if (type === 'phone') {
    if (phoneFields) phoneFields.style.display = 'grid';
    if (dateInput) dateInput.required = true;
    if (guidanceBox) {
      guidanceBox.innerHTML = `
        <i style="display: block; margin-bottom: 6px; font-style: normal; font-weight: 700; color: #1e293b;">상담 가능 시간은 평일 오전 9시 ~ 오후 6시입니다.</i>
        <i style="display: block; font-style: normal;">상담을 원하시는 날짜와 시간대를 선택하시고, 상담받고 싶은 내용을 간단히 작성해 주세요. 남겨주신 내용을 확인한 후 간호사가 직접 전화드리겠습니다.</i>
      `;
    }
  } else {
    if (phoneFields) phoneFields.style.display = 'none';
    if (dateInput) dateInput.required = false;
    if (guidanceBox) {
      guidanceBox.innerHTML = `
        <i style="display: block; margin-bottom: 6px; font-style: normal; font-weight: 700; color: #1e293b;">온라인 문의 안내</i>
        <i style="display: block; font-style: normal;">상담받고 싶은 내용을 작성해 주세요. 접수된 문의는 확인 후 영업일 기준 3일 이내에 온라인으로 답변드리겠습니다.</i>
      `;
    }
  }
};

window.submitCheckupDesign = function () {
  const name = document.getElementById('checkup-name').value;
  const phone = document.getElementById('checkup-phone').value;
  const date = document.getElementById('checkup-date')?.value;
  const time = document.getElementById('checkup-time')?.value;
  const memo = document.getElementById('checkup-memo').value;
  const type = document.querySelector('input[name="checkup-consult-type"]:checked')?.value || 'phone';

  if (type === 'phone') {
    if (!phone || !date || !memo) {
      alert('연락처, 상담 희망 일자, 건강 우려사항을 모두 입력해주세요.');
      return;
    }
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    if (date < todayStr) {
      showModal('신청 불가', '과거 날짜로는 상담을 신청하실 수 없습니다. 오늘 이후의 날짜를 선택해주세요.');
      return;
    }
  } else {
    if (!phone || !memo) {
      alert('연락처와 문의 내용을 모두 입력해주세요.');
      return;
    }
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const inquiries = JSON.parse(localStorage.getItem('hc_inquiries') || '[]');
  const newEntry = {
    id: Date.now(),
    clientId: state.activeClient.id,
    userId: state.currentUser.id,
    userName: state.currentUser.name,
    type: type,
    category: '건강검진',
    title: type === 'phone' ? '건강검진 전화상담 신청' : '건강검진 온라인 문의 신청',
    content: type === 'phone'
      ? `[전화상담 신청]\n성함: ${name}\n연락처: ${phone}\n상담시간대: ${time}\n\n[상담/요청 내용]\n${memo}`
      : `[온라인 문의 신청]\n성함: ${name}\n연락처: ${phone}\n\n[상담/요청 내용]\n${memo}`,
    date: todayStr,
    status: '접수완료',
    answer: null,
    answerDate: null,
    consultDate: type === 'phone' ? date : null,
    consultTime: type === 'phone' ? time : null
  };

  inquiries.push(newEntry);
  localStorage.setItem('hc_inquiries', JSON.stringify(inquiries));

  if (type === 'phone') {
    showToast('건강검진 전화상담 신청이 접수되었습니다.');
  } else {
    showToast('건강검진 온라인 문의가 접수되었습니다.');
  }
  setTimeout(() => {
    let targetHash = `#/portal/${state.activeClient.id}/${state.activeSite.siteId}/checkupAppt/checkupHistory`;
    const site = state.activeClient.sites.find(s => s.siteId === state.activeSite.siteId);
    const checkupMenu = site?.menus?.find(m => m.id === 'checkupAppt');
    if (checkupMenu && checkupMenu.children) {
        for (const sub of checkupMenu.children) {
            if (sub.id === 'checkupHistory' || sub.label?.includes('신청이력')) {
                targetHash = `#/portal/${state.activeClient.id}/${state.activeSite.siteId}/checkupAppt/${sub.id}`;
                break;
            }
            if (sub.children && sub.children.some(c => c.id === 'checkupHistory' || c.label?.includes('신청이력'))) {
                const subSub = sub.children.find(c => c.id === 'checkupHistory' || c.label?.includes('신청이력'));
                targetHash = `#/portal/${state.activeClient.id}/${state.activeSite.siteId}/checkupAppt/${sub.id}/${subSub.id}`;
                break;
            }
        }
    }
    window.location.hash = targetHash;
  }, 1500);
};

window.submitCheckupDirect = function () {
  const centerSelect = document.getElementById('direct-checkup-center');
  const centerText = centerSelect.options[centerSelect.selectedIndex].text;
  const packageSelect = document.getElementById('direct-checkup-package');
  const packageText = packageSelect.options[packageSelect.selectedIndex].text;
  const date = document.getElementById('direct-checkup-date').value;
  const extra = document.getElementById('direct-checkup-extra').value || '없음';

  if (!date) {
    alert('검진 희망 일자를 선택해주세요.');
    return;
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Past date validation
  if (date < todayStr) {
    showModal('신청 불가', '과거 날짜로는 예약을 신청하실 수 없습니다. 오늘 이후의 날짜를 선택해주세요.');
    return;
  }

  const inquiries = JSON.parse(localStorage.getItem('hc_inquiries') || '[]');
  const newEntry = {
    id: Date.now(),
    clientId: state.activeClient.id,
    userId: state.currentUser.id,
    userName: state.currentUser.name,
    type: 'online',
    category: '건강검진',
    title: '건강검진 간편 예약 신청',
    content: `[직접선택 간편 예약]\n예약 검진 센터: ${centerText}\n선택 패키지: ${packageText}\n희망 검진일자: ${date}\n\n[추가 요청사항]\n${extra}`,
    date: todayStr,
    status: '접수완료',
    answer: null,
    answerDate: null
  };

  inquiries.push(newEntry);
  localStorage.setItem('hc_inquiries', JSON.stringify(inquiries));

  showToast('건강검진 간편 예약 신청이 성공적으로 등록되었습니다.');
  setTimeout(() => {
    let targetHash = `#/portal/${state.activeClient.id}/${state.activeSite.siteId}/checkupAppt/checkupHistory`;
    const site = state.activeClient.sites.find(s => s.siteId === state.activeSite.siteId);
    const checkupMenu = site?.menus?.find(m => m.id === 'checkupAppt');
    if (checkupMenu && checkupMenu.children) {
        for (const sub of checkupMenu.children) {
            if (sub.id === 'checkupHistory' || sub.label?.includes('신청이력')) {
                targetHash = `#/portal/${state.activeClient.id}/${state.activeSite.siteId}/checkupAppt/${sub.id}`;
                break;
            }
            if (sub.children && sub.children.some(c => c.id === 'checkupHistory' || c.label?.includes('신청이력'))) {
                const subSub = sub.children.find(c => c.id === 'checkupHistory' || c.label?.includes('신청이력'));
                targetHash = `#/portal/${state.activeClient.id}/${state.activeSite.siteId}/checkupAppt/${sub.id}/${subSub.id}`;
                break;
            }
        }
    }
    window.location.hash = targetHash;
  }, 1500);
};

window.submitConsulting = function () {
  const type = document.querySelector('input[name="consult-type"]:checked').value;
  const memo = document.getElementById('consult-memo').value;

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentHour = now.getHours();

  let category = '건강상담';
  const menus = state.activeClient?.menus || [];
  const activeMenu = state.activeMenuId ? menus.find(m => m.id === state.activeMenuId) : null;
  const menuLabel = activeMenu ? activeMenu.label : '';
  if (state.activeSubId === 'appt') {
    category = '진료예약';
  } else if (state.activeSubId === 'expert') {
    category = '병원안내';
  } else if (state.activeMenuId === 'hospitalGuide' || menuLabel.includes('병원안내')) {
    category = '병원안내';
  } else if (state.activeMenuId === 'medicalAppt' || menuLabel.includes('진료예약')) {
    category = '진료예약';
  }

  const historySub = activeMenu?.children?.find(c => c.id.toLowerCase().includes('history') || c.label.includes('이력') || c.label.includes('내역'));
  const historySubId = historySub ? historySub.id : (state.activeMenuId === 'medicalAppt' ? 'history' : 'consultHistory');

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
      category: category,
      title: (state.activeMenuId === 'medicalAppt' || state.activeSubId === 'appt') ? '진료예약 상담 신청' : ((state.activeMenuId === 'hospitalGuide' || state.activeSubId === 'expert') ? '병원안내 상담 신청' : '전화 건강상담 신청'),
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
      window.location.hash = `#/portal/${state.activeClient.id}/${state.activeSite.siteId}/${state.activeMenuId}/${historySubId}`;
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
      category: category,
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
    window.location.hash = `#/portal/${state.activeClient.id}/${state.activeSite.siteId}/${state.activeMenuId}/${historySubId}`;
  }
};

window.showModal = function (title, message) {
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

window.closeModal = function () {
  const modal = document.getElementById('custom-modal');
  if (modal) {
    modal.style.opacity = '0';
    modal.querySelector('div').style.transform = 'translateY(20px)';
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
};

window.updateConsultType = function (type) {
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

window.showToast = function (message) {
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

window.handleCheckupSelection = function(checkbox, groupId, max) {
  const group = document.getElementById(groupId);
  if (!group) return;
  const checkedBoxes = group.querySelectorAll('input[type="checkbox"]:checked');
  if (checkbox.checked && checkedBoxes.length > max) {
    checkbox.checked = false;
    window.showToast('최대 ' + max + '개까지 선택 가능합니다.');
    return;
  }
  const countDisplay = document.getElementById(groupId === 'group-A' ? 'count-A' : 'count-B');
  if (countDisplay) {
    countDisplay.innerText = checkedBoxes.length + '/' + max + ' 선택';
  }
};

window.toggleInquiryForm = function () {
  const form = document.getElementById('inquiry-form-area');
  if (form) {
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    if (form.style.display === 'block') {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

window.submitInquiry = function () {
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
    type: 'online',
    category: '건강상담',
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
  window.location.hash = `#/portal/${state.activeClient.id}/${state.activeSite.siteId}/onlineInquiry`;
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
        <p>당신의 건강을 위한 프리미엄 건강케어 서비스</p>
        <button class="auth-btn btn-primary" onclick="login('user_multi')">포털 로그인 (홍길동 - 다중기업)</button>
        <button class="auth-btn btn-secondary" onclick="login('user_single_dasom')">포털 로그인 (이다솜 - 단일기업)</button>
      </div>
    </div>
  `;
}

function renderClientSelect() {
  if (!state.currentUser) { window.location.hash = '#/'; return; }

  let cardsHtml = '';
  state.currentUser.clients.forEach(clientId => {
    const client = clientConfigs[clientId];
    const userTiers = state.currentUser.tiers[clientId] || [];
    const accessibleSites = getSortedAccessibleSites(client, userTiers);

    accessibleSites.forEach(site => {
      const activeColor = site.themeColor || "#17B890";

      cardsHtml += `
        <div class="client-card premium-card" onclick="selectBridgeSite('${client.id}', '${site.siteId}')" style="
          border: 2px solid #cbd5e1;
          border-radius: 16px;
          padding: 24px;
          background: white;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        ">
          <div style="position:absolute; top:0; left:0; right:0; height:6px; background:${activeColor};"></div>
          
          <div class="client-logo-placeholder" style="
            width: 64px;
            height: 64px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin-bottom: 16px;
            background-color: rgba(${site.themeColorRgb || '23,184,144'}, 0.1);
            color: ${activeColor};
            border: 1px solid rgba(${site.themeColorRgb || '23,184,144'}, 0.2);
            font-weight: 700;
          ">
            ${site.logoImage ? `<img src="${site.logoImage}" style="max-width:100%; max-height:100%; object-fit:contain;">` : client.name.charAt(0)}
          </div>
          
          <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">${site.siteName}</h3>
          <span style="font-size:12px; color:${activeColor}; background:rgba(${site.themeColorRgb || '23,184,144'}, 0.1); padding:4px 10px; border-radius:12px; font-weight:600; margin-bottom:12px;">
            ${client.name}
          </span>
          <p style="font-size: 13px; color: #64748b; line-height: 1.5; flex-grow: 1;">
            ${(site.heroText && site.heroText.title) || '프리미엄 헬스케어 포털 서비스'}
          </p>
          
          <div class="card-btn" style="
            margin-top: 20px;
            width: 100%;
            padding: 10px;
            border-radius: 8px;
            background: #f1f5f9;
            color: #475569;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s;
          ">
            접속하기 &rarr;
          </div>
        </div>
      `;
    });
  });

  app.innerHTML = `
    <div class="auth-wrapper fade-in" style="background: radial-gradient(circle at 50% 50%, #eff6ff 0%, #f8fafc 100%);">
      <div class="auth-card" style="max-width: 800px; padding: 48px; width: 90%;">
        <div style="text-align:center; margin-bottom:32px;">
          <h1 style="font-size: 26px; font-weight: 800; color:#0f172a; letter-spacing:-0.5px;">접속할 사이트 선택</h1>
          <p style="color:#64748b; font-size:14px; margin-top:8px;">권한이 부여된 고객사 및 맞춤형 웰니스 포털 사이트를 선택해주세요.</p>
        </div>
        <div class="client-select-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:24px;">
          ${cardsHtml}
        </div>
        <div style="text-align:center; margin-top:40px;">
          <button class="logout-btn" style="background:#f1f5f9; color:#475569; border:1px solid #cbd5e1; font-weight:600; padding:10px 24px; border-radius:8px;" onclick="logout()">돌아가기 (로그아웃)</button>
        </div>
      </div>
    </div>
  `;
}

window.selectBridgeSite = function (clientId, siteId) {
  state.activeClient = clientConfigs[clientId];
  state.activeSite = state.activeClient.sites.find(s => s.siteId === siteId) || state.activeClient.sites[0];
  window.location.hash = `#/portal/${clientId}/${siteId}`;
};

function filterMenusForUser(menus, userTiers) {
  return menus
    .filter(menu => {
      if (menu.isVisible === false) return false;
      if (menu.exposedTiers && menu.exposedTiers.length > 0) {
        const hasAccess = menu.exposedTiers.some(tier => {
          const tierStr = getTierName(tier);
          return userTiers.some(ut => getTierName(ut) === tierStr);
        });
        if (!hasAccess) return false;
      }
      return true;
    })
    .map(menu => {
      const clone = { ...menu };
      if (clone.children && clone.children.length > 0) {
        clone.children = filterMenusForUser(clone.children, userTiers);
      }
      return clone;
    });
}

// Helper for Provided Services customized premium fallbacks
function getProvidedServiceOrDefault(clientId, tierName) {
  const data = JSON.parse(localStorage.getItem('hc_provided_services') || '{}');
  const key = `${clientId}|${tierName}`;
  
  if (data[key] && data[key].exposureYn === 'Y' && data[key].sections) {
    return data[key];
  }

  const client = clientConfigs[clientId] || { name: '헬스케어', csNumber: '1588-7545', themeColor: '#17B890', themeColorRgb: '23, 184, 144' };
  const clientName = client.name.split('(')[0].trim();
  const themeColor = client.themeColor || '#17B890';
  const themeColorRgb = client.themeColorRgb || '23, 184, 144';
  const csNumber = client.csNumber || '1588-7545';

  const isPremiumTier = tierName.includes('VIP') || tierName.includes('우대') || tierName.includes('임원') || tierName.includes('1등급');

  const introTitle = isPremiumTier 
    ? `${clientName} 전용 프리미엄 ${tierName} 케어` 
    : `건강할 땐 건강관리, 아플 땐 치료지원까지 꼼꼼하게`;
  
  const introSub = isPremiumTier
    ? `최고의 자산인 건강을 위해, 차별화된 고품격 의학 자문 및 원스톱 VIP 에스코트 서비스를 지원합니다.`
    : `${clientName}만의 사내복지 통합건강관리서비스로 임직원과 가족의 건강한 삶을 함께합니다.`;

  const bannerBg = isPremiumTier
    ? `linear-gradient(135deg, ${themeColor} 0%, #0f172a 100%)`
    : `linear-gradient(135deg, ${themeColor} 0%, #1e293b 100%)`;

  const introHtml = `
    <div style="position: relative; width: 100%; min-height: 190px; background: ${bannerBg}; border-radius: 16px; padding: 32px; color: white; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); overflow: hidden; margin-bottom: 24px;">
      <div style="position: relative; z-index: 2; max-width: 60%;">
        <div style="font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.85); margin-bottom: 8px; letter-spacing: 1px; text-transform: uppercase;">HEALTHCARE SERVICE</div>
        <h2 style="font-size: 26px; font-weight: 800; margin: 0 0 12px 0; letter-spacing: -1px; line-height: 1.3;">${introTitle}</h2>
        <p style="font-size: 14.5px; margin: 0; opacity: 0.95; line-height: 1.6; font-weight: 500;">
          ${introSub}
        </p>
      </div>
      <div style="position: relative; z-index: 2; width: 35%; display: flex; justify-content: flex-end; align-items: center; pointer-events: none;">
        <div style="width: 120px; height: 120px; border-radius: 50%; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255, 255, 255, 0.25); box-shadow: 0 8px 32px 0 rgba(0,0,0,0.15);">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            <path d="M12 5v14"/>
            <path d="M9 9h6"/>
          </svg>
        </div>
      </div>
      <div style="position: absolute; width: 300px; height: 300px; border-radius: 50%; background: ${themeColor}; filter: blur(80px); top: -100px; right: -50px; opacity: 0.35; z-index: 1;"></div>
    </div>
  `;

  const csHtml = `
    <div style="position: relative; width: 100%; border: 1px solid #e2e8f0; border-radius: 16px; background: white; padding: 24px 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; border-left: 5px solid ${themeColor}; transition: all 0.3s ease;">
      <div style="display: flex; align-items: center; gap: 20px;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(${themeColorRgb}, 0.1); display: flex; align-items: center; justify-content: center; color: ${themeColor}; border: 1px solid rgba(${themeColorRgb}, 0.15);">
          <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
        </div>
        <div>
          <div style="font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 4px; letter-spacing: 0.5px;">${clientName} 헬스케어서비스 고객센터</div>
          <div style="font-size: 26px; font-weight: 900; color: #1e293b; letter-spacing: -0.5px; display:flex; align-items:center; gap:8px;">
            ${csNumber}
            <span style="font-size:13.5px; font-weight:500; color:#94a3b8; margin-left: 8px;">평일 09:00 ~ 18:00 (토/일/공휴일 휴무)</span>
          </div>
        </div>
      </div>
      <a href="tel:${csNumber.replace(/-/g, '')}" style="background: ${themeColor}; color: white; padding: 12px 28px; border-radius: 10px; font-size: 15px; font-weight: 800; text-decoration: none; box-shadow: 0 4px 14px rgba(${themeColorRgb}, 0.25); transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 8px;">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
        고객센터 연결
      </a>
    </div>
  `;

  const tabs = [
    {
      title: "평상시 서비스",
      html: `
        <div style="display: flex; gap: 32px; align-items: center;">
          <div style="flex: 1; min-width: 0;">
            <h3 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 24px;">🏠</span> 평상시 일상 속 건강케어
            </h3>
            <p style="font-size: 15px; color: #475569; line-height: 1.7; margin-bottom: 24px;">
              일상의 안심을 채워드립니다. 전담 헬스케어센터를 통해 간호사 및 전문 의료진과 간편하게 건강 상담을 진행할 수 있으며, 24시간 항시 대기 응급의료지원망을 전격 지원합니다.
            </p>
            <div style="background: rgba(${themeColorRgb}, 0.04); border: 1px solid rgba(${themeColorRgb}, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <div style="font-weight: 800; font-size: 15px; color: #1e293b; margin-bottom: 10px;">🏥 주요 서비스 상세 혜택</div>
              <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.8;">
                <li><strong>24시간 상시 의료 상담</strong>: 야간 및 공휴일 긴급 질환 발생 시 전문간호사 1:1 상담</li>
                <li><strong>맞춤 진료과 가이드</strong>: 내과, 외과, 산부인과, 안과 등 14개 전문과별 최적 진료과 추천</li>
                <li><strong>자가관리 코칭</strong>: 일상 건강검진 수치 해설 및 영양/운동 피드백 가이드 제공</li>
              </ul>
            </div>
            <div style="display: inline-flex; align-items: center; gap: 12px; background: #f1f5f9; padding: 12px 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <svg width="18" height="18" fill="none" stroke="#2563eb" stroke-width="2.5" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              <div style="font-size: 13.5px; color: #334155; font-weight: 700;">건강상담 문의 <span style="color:#2563eb; font-weight:800; margin-left:4px;">${csNumber}</span></div>
            </div>
          </div>
          <div style="width: 40%; flex-shrink: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600" style="width: 100%; height: auto; display: block; object-fit: cover; aspect-ratio: 4/3;">
          </div>
        </div>
      `
    },
    {
      title: "주요질병 진단 시",
      html: `
        <div style="display: flex; gap: 32px; align-items: center;">
          <div style="flex: 1; min-width: 0;">
            <h3 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 24px;">➕</span> 주요질병 진단 시 명의 예약 및 에스코트
            </h3>
            <p style="font-size: 15px; color: #475569; line-height: 1.7; margin-bottom: 24px;">
              중대질병 진단 또는 고난도 수술 필요 시, 가장 신속하고 정확하게 치료를 받으실 수 있도록 국내 우수 의료진 연계 서비스 및 입퇴원 케어를 일체 대행해 드립니다.
            </p>
            <div style="background: rgba(${themeColorRgb}, 0.04); border: 1px solid rgba(${themeColorRgb}, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <div style="font-weight: 800; font-size: 15px; color: #1e293b; margin-bottom: 10px;">🏥 주요 서비스 상세 혜택</div>
              <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.8;">
                <li><strong>대형병원 명의 추천 및 진료예약</strong>: 국내 5대 상급종합병원 분야별 최적의 권위자 진료 추천 및 우선 예약 대행</li>
                <li><strong>전문 간호사 병원 에스코트</strong>: 진료 당일, 전문 간호사가 동행하여 진료 접수, 수납, 약 처방 등 밀착 동행 안내 (VIP/우대 회원 혜택)</li>
                <li><strong>해외 전문 소견 지원</strong>: 국내 난치 판정 시 글로벌 대형 의료기관 2차 정밀 판독 자문 리포트 발급 연계</li>
              </ul>
            </div>
            <div style="display: inline-flex; align-items: center; gap: 12px; background: #f1f5f9; padding: 12px 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <svg width="18" height="18" fill="none" stroke="#2563eb" stroke-width="2.5" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              <div style="font-size: 13.5px; color: #334155; font-weight: 700;">명의 예약 문의 <span style="color:#2563eb; font-weight:800; margin-left:4px;">${csNumber}</span></div>
            </div>
          </div>
          <div style="width: 40%; flex-shrink: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            <img src="https://images.unsplash.com/photo-1582750433449-649350141f2f?auto=format&fit=crop&q=80&w=600" style="width: 100%; height: auto; display: block; object-fit: cover; aspect-ratio: 4/3;">
          </div>
        </div>
      `
    },
    {
      title: "건강검진",
      html: `
        <div style="display: flex; gap: 32px; align-items: center;">
          <div style="flex: 1; min-width: 0;">
            <h3 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 24px;">💓</span> 건강검진 우대 예약 혜택
            </h3>
            <p style="font-size: 15px; color: #475569; line-height: 1.7; margin-bottom: 24px;">
              전국 100여 개 우수 대학병원 및 검진 전문 센터 네트워크를 구축하고 있습니다. 최저 우대 요금 할인 혜택부터 위/대장 내시경 특별 우대 혜택을 제공합니다.
            </p>
            <div style="background: rgba(${themeColorRgb}, 0.04); border: 1px solid rgba(${themeColorRgb}, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <div style="font-weight: 800; font-size: 15px; color: #1e293b; margin-bottom: 10px;">🏥 주요 서비스 상세 혜택</div>
              <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.8;">
                <li><strong>검진 할인율 지원</strong>: 일반 소비자가 대비 최대 30%~50% 우대 할인된 맞춤형 건강검진 패키지 제공</li>
                <li><strong>내시경 수면비 지원</strong>: 위 및 대장 수면 내시경 선택 시 수면 추가 비용 전액 무상 지원</li>
                <li><strong>스마트 예약/상담 솔루션</strong>: 검진 항목 변경, 연령대별/성별 정밀 선택 가이드 및 실시간 검진 예약 대행</li>
              </ul>
            </div>
            <div style="display: inline-flex; align-items: center; gap: 12px; background: #f1f5f9; padding: 12px 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <svg width="18" height="18" fill="none" stroke="#2563eb" stroke-width="2.5" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              <div style="font-size: 13.5px; color: #334155; font-weight: 700;">검진 예약 문의 <span style="color:#2563eb; font-weight:800; margin-left:4px;">${csNumber}</span></div>
            </div>
          </div>
          <div style="width: 40%; flex-shrink: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            <img src="https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=600" style="width: 100%; height: auto; display: block; object-fit: cover; aspect-ratio: 4/3;">
          </div>
        </div>
      `
    },
    {
      title: "심리상담",
      html: `
        <div style="display: flex; gap: 32px; align-items: center;">
          <div style="flex: 1; min-width: 0;">
            <h3 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 24px;">💬</span> 마음의 평온을 위한 심리상담
            </h3>
            <p style="font-size: 15px; color: #475569; line-height: 1.7; margin-bottom: 24px;">
              보이지 않는 스트레스와 정서적 불안까지 어루만집니다. 가정, 직장, 대인 관계 등 지친 현대인을 위한 맞춤형 1:1 대면/비대면 마음 케어를 무상으로 지원합니다.
            </p>
            <div style="background: rgba(${themeColorRgb}, 0.04); border: 1px solid rgba(${themeColorRgb}, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <div style="font-weight: 800; font-size: 15px; color: #1e293b; margin-bottom: 10px;">🏥 주요 서비스 상세 혜택</div>
              <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.8;">
                <li><strong>대면 심리 상담</strong>: 전국 주요 연계 심리상담 센터(허그맘 등) 대면 심리 자문 지원 (연 2회 무료 제공)</li>
                <li><strong>온라인/전화 자문</strong>: 대기 시간 없는 모바일 마음 힐링 서비스 및 전화 심리 코칭 프로그램</li>
                <li><strong>정서 진단 프로그램</strong>: 스트레스 지수 자가 측정, 우울감 척도 분석 및 심도 분석 리포트 발급</li>
              </ul>
            </div>
            <div style="display: inline-flex; align-items: center; gap: 12px; background: #f1f5f9; padding: 12px 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <svg width="18" height="18" fill="none" stroke="#2563eb" stroke-width="2.5" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              <div style="font-size: 13.5px; color: #334155; font-weight: 700;">심리상담 신청 <span style="color:#2563eb; font-weight:800; margin-left:4px;">${csNumber}</span></div>
            </div>
          </div>
          <div style="width: 40%; flex-shrink: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600" style="width: 100%; height: auto; display: block; object-fit: cover; aspect-ratio: 4/3;">
          </div>
        </div>
      `
    },
    {
      title: "만성질환 관리",
      html: `
        <div style="display: flex; gap: 32px; align-items: center;">
          <div style="flex: 1; min-width: 0;">
            <h3 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 24px;">🛡️</span> 만성질환 1:1 라이프케어 코칭
            </h3>
            <p style="font-size: 15px; color: #475569; line-height: 1.7; margin-bottom: 24px;">
              고혈압, 당뇨 등 지속 관리가 필수적인 만성질환군 회원님들을 위해 IT 웨어러블 디바이스 연동 정밀 상시 추적 서비스 및 운동/식단 코칭을 무상으로 지원합니다.
            </p>
            <div style="background: rgba(${themeColorRgb}, 0.04); border: 1px solid rgba(${themeColorRgb}, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <div style="font-weight: 800; font-size: 15px; color: #1e293b; margin-bottom: 10px;">🏥 주요 서비스 상세 혜택</div>
              <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.8;">
                <li><strong>웨어러블 기기 연동 관리</strong>: 연계 전용 스마트 헬스밴드 및 혈당 측정기 제공 (대상자 한정) 및 데이터 상시 동기화</li>
                <li><strong>전담 의료진 라이프 케어</strong>: 전담 간호사 및 임상 영양사가 매월 식생활 습관 모니터링 및 1:1 유선 해설 피드백</li>
                <li><strong>응급 핫라인 지원</strong>: 일상 수치 이상 급변 감지 시 전담 핫라인 알람 발생 및 병원 응급 안내 연동</li>
              </ul>
            </div>
            <div style="display: inline-flex; align-items: center; gap: 12px; background: #f1f5f9; padding: 12px 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <svg width="18" height="18" fill="none" stroke="#2563eb" stroke-width="2.5" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              <div style="font-size: 13.5px; color: #334155; font-weight: 700;">질환관리 문의 <span style="color:#2563eb; font-weight:800; margin-left:4px;">${csNumber}</span></div>
            </div>
          </div>
          <div style="width: 40%; flex-shrink: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            <img src="https://images.unsplash.com/photo-1510017808638-a59b571d2227?auto=format&fit=crop&q=80&w=600" style="width: 100%; height: auto; display: block; object-fit: cover; aspect-ratio: 4/3;">
          </div>
        </div>
      `
    }
  ];

  return {
    clientId,
    tierName,
    exposureYn: 'Y',
    sections: {
      intro: introHtml,
      csGuide: csHtml,
      tabs: tabs
    }
  };
}

window.switchPortalServiceTab = function(idx) {
  state.activeServiceGuideTabIdx = idx;
  render();
};

window.scrollPortalTabs = function(direction) {
  const wrapper = document.querySelector('.portal-service-tab-btn-wrapper');
  if (wrapper) {
    wrapper.scrollBy({ left: direction * 150, behavior: 'smooth' });
  }
};

function renderPortal() {
  const client = state.activeClient;
  const activeSite = state.activeSite || client.sites[0];

  const userTiers = state.currentUser ? (state.currentUser.tiers[client.id] || []) : [];

  // Inject children for serviceGuide dynamically before filtering
  const serviceGuideMenu = (activeSite.menus || []).find(m => m.id === 'serviceGuide');
  if (serviceGuideMenu) {
    serviceGuideMenu.children = [
      {
        id: "myServices",
        label: "내가 가입한 서비스",
        isVisible: true,
        children: userTiers.map(tier => {
          const tName = getTierName(tier);
          return {
            id: encodeURIComponent(tName),
            label: tName,
            isVisible: true,
            children: []
          };
        })
      },
      {
        id: "allServices",
        label: "전체 서비스",
        isVisible: true,
        children: (client.tiers || []).map(tier => {
          const tName = getTierName(tier);
          return {
            id: encodeURIComponent(tName),
            label: tName,
            isVisible: true,
            children: []
          };
        })
      }
    ];
  }

  // Redirection logic for healthInfo submenus
  if (state.activeMenuId === 'healthInfo' && !state.activeSubId) {
    const healthMenu = (activeSite.menus || []).find(m => m.id === 'healthInfo');
    if (healthMenu && healthMenu.children && healthMenu.children.length > 0) {
      const firstChild = healthMenu.children.find(c => c.isVisible);
      if (firstChild) {
        window.location.hash = `#/portal/${client.id}/${activeSite.siteId}/healthInfo/${firstChild.id}`;
        return;
      }
    }
    window.location.hash = `#/portal/${client.id}/${activeSite.siteId}/healthInfo/categoryInfo`;
    return;
  }

  // Redirection logic for service guide submenus
  if (state.activeMenuId === 'serviceGuide') {
    if (!state.activeSubId) {
      if (userTiers.length > 0) {
        const tName = getTierName(userTiers[0]);
        window.location.hash = `#/portal/${client.id}/${activeSite.siteId}/serviceGuide/myServices/${encodeURIComponent(tName)}`;
        return;
      } else if (client.tiers && client.tiers.length > 0) {
        const tName = getTierName(client.tiers[0]);
        window.location.hash = `#/portal/${client.id}/${activeSite.siteId}/serviceGuide/allServices/${encodeURIComponent(tName)}`;
        return;
      }
    } else if (state.activeSubId === 'myServices' && !state.activeSubSubId) {
      if (userTiers.length > 0) {
        const tName = getTierName(userTiers[0]);
        window.location.hash = `#/portal/${client.id}/${activeSite.siteId}/serviceGuide/myServices/${encodeURIComponent(tName)}`;
        return;
      }
    } else if (state.activeSubId === 'allServices' && !state.activeSubSubId) {
      if (client.tiers && client.tiers.length > 0) {
        const tName = getTierName(client.tiers[0]);
        window.location.hash = `#/portal/${client.id}/${activeSite.siteId}/serviceGuide/allServices/${encodeURIComponent(tName)}`;
        return;
      }
    }
  }

  const visibleMenus = filterMenusForUser(activeSite.menus || [], userTiers);

  // Render Site Selector dropdown if multiple accessible sites exist
  const accessibleSites = getSortedAccessibleSites(client, userTiers);

  let siteSelectorHtml = '';
  if (accessibleSites.length > 1) {
    siteSelectorHtml = `
      <div class="site-selector" style="position:relative; margin-right:12px;">
        <select onchange="selectBridgeSite('${client.id}', this.value)" style="
          padding: 6px 12px;
          font-size: 13px;
          font-weight: 600;
          color: var(--theme-color);
          background: rgba(var(--theme-color-rgb), 0.08);
          border: 1px solid rgba(var(--theme-color-rgb), 0.2);
          border-radius: 6px;
          cursor: pointer;
          outline: none;
        ">
          ${accessibleSites.map(s => `
            <option value="${s.siteId}" ${s.siteId === activeSite.siteId ? 'selected' : ''}>🌐 ${s.siteName}</option>
          `).join('')}
        </select>
      </div>
    `;
  }

  // GNB HTML (1st depth only)
  const gnbHtml = visibleMenus.map(m => `
    <a href="#/portal/${client.id}/${activeSite.siteId}/${m.id}" class="${state.activeMenuId === m.id ? 'active' : ''}">${m.label}</a>
  `).join('');

  // Mega Menu Panel (shows all children levels)
  const megaMenuHtml = `
    <div class="mega-menu-panel" id="mega-menu">
      <div class="container mega-menu-content">
        ${visibleMenus.map(m => `
          <div class="mega-column">
            <div class="mega-title" onclick="window.location.hash='#/portal/${client.id}/${activeSite.siteId}/${m.id}'" style="cursor:pointer;">${m.label}</div>
            <ul class="mega-list">
              ${(m.children || []).map(c2 => `
                <li class="mega-item">
                  <a href="#/portal/${client.id}/${activeSite.siteId}/${m.id}/${c2.id}">${c2.label}</a>
                  <ul class="mega-list-inner">
                    ${(c2.children || []).map(c3 => `
                      <li class="mega-item depth-3"><a href="#/portal/${client.id}/${activeSite.siteId}/${m.id}/${c2.id}/${c3.id}">${c3.label}</a></li>
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
          <h2 style="margin-top:0;">${activeSite.heroText.title}</h2>
          <p>${activeSite.heroText.subtitle}</p>
        </div>
      </div>
      <div class="quick-menu-grid">
         <div class="quick-card" onclick="window.location.hash='#/portal/${client.id}/${activeSite.siteId}/hospitalGuide'">
            <h3>병원 찾기</h3>
            <p>내 주변 제휴 병원 및 명의 검색</p>
         </div>
         <div class="quick-card" onclick="window.location.hash='#/portal/${client.id}/${activeSite.siteId}/healthConsulting'">
            <h3>상담 신청</h3>
            <p>의료진과 1:1 건강 상담</p>
         </div>
         <div class="quick-card" onclick="window.location.hash='#/portal/${client.id}/${activeSite.siteId}/checkupAppt'">
            <h3>검진 예약</h3>
            <p>프리미엄 가족 건강검진 예약</p>
         </div>
      </div>
    `;
  } else {
    // SUBPAGE VIEW
    let sidebarHtml = visibleMenus.map(m => {
      const isActive = state.activeMenuId === m.id;
      return `
        <li class="sidebar-group ${isActive ? 'active' : ''}">
          <div class="sidebar-group-header" onclick="window.location.hash='#/portal/${client.id}/${activeSite.siteId}/${m.id}'">
            ${m.label}
          </div>
          ${isActive && m.children && m.children.length > 0 ? `
            <ul class="sidebar-sub-list">
              ${m.children.map(sm => `
                <li class="sidebar-sub-item ${state.activeSubId === sm.id ? 'active' : ''}">
                  <a href="#/portal/${client.id}/${activeSite.siteId}/${m.id}/${sm.id}">${sm.label}</a>
                  ${state.activeSubId === sm.id && sm.children && sm.children.length > 0 ? `
                    <ul class="sidebar-inner-list">
                      ${sm.children.map(c3 => `
                        <li class="sidebar-inner-item ${state.activeSubSubId === c3.id ? 'active' : ''}">
                          <a href="#/portal/${client.id}/${activeSite.siteId}/${m.id}/${sm.id}/${c3.id}">${c3.label}</a>
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
    const pageTitle = activeSubSub?.label || activeSub?.label || activeMenu?.label || '';
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

    const isConsultingGroup = state.activeMenuId === 'healthConsulting' || activeMenu?.id === 'healthConsulting' || pageTitle.includes('상담') || pageTitle.includes('진료예약') || pageTitle.includes('병원안내');
    const isHistoryPage = state.activeSubId === 'consultHistory' || activeSub?.id === 'consultHistory' || state.activeSubId === 'history' || activeSub?.id === 'history' || ((pageTitle.includes('이력') || pageTitle.includes('내역')) && !pageTitle.includes('검진'));
    const isCheckupHistoryPage = state.activeSubId === 'checkupHistory' || activeSub?.id === 'checkupHistory' || state.activeSubSubId === 'checkupHistory' || activeSubSub?.id === 'checkupHistory' || pageTitle.includes('신청이력');
    const isSearchGroup = state.activeMenuId === 'search' || activeMenu?.id === 'search' || pageTitle.includes('병원검색');
    const isCheckupGroup = state.activeMenuId === 'checkupAppt' || activeMenu?.id === 'checkupAppt' || pageTitle.includes('건강검진');
    const isServiceGuideGroup = state.activeMenuId === 'serviceGuide';

    const isCategoryInfoPage = state.activeSubId === 'categoryInfo' || activeSub?.label === '분야별 건강정보';
    const isContentSubscribePage = state.activeSubId === 'contentSubscribe' || activeSub?.label === '건강콘텐츠 구독';
    const isPsyColumnPage = state.activeSubId === 'psyColumn' || activeSub?.label === '심리칼럼';
    const isSelfDiagnosisPage = state.activeSubId === 'selfDiagnosis' || activeSub?.label === '자가진단';
    const isAsmrVideoPage = state.activeSubId === 'asmrVideo' || activeSub?.label === '힐링 ASMR 영상';

    if (isCategoryInfoPage) {
      detailContentHtml = renderCategoryHealthInfo();
    } else if (isContentSubscribePage) {
      detailContentHtml = renderContentSubscribe();
    } else if (isPsyColumnPage) {
      detailContentHtml = renderPsyColumn();
    } else if (isSelfDiagnosisPage) {
      detailContentHtml = renderSelfDiagnosis();
    } else if (isAsmrVideoPage) {
      detailContentHtml = renderAsmrVideoPage();
    } else if (state.activeMenuId === 'mypage') {
      detailContentHtml = renderMyPage();
    } else if (isServiceGuideGroup) {
      const activeTierName = state.activeSubSubId ? decodeURIComponent(state.activeSubSubId) : '';
      
      // Ensure state active tab reset on tier change
      if (state.lastServiceGuideKey !== `${client.id}|${activeTierName}`) {
        state.activeServiceGuideTabIdx = 0;
        state.lastServiceGuideKey = `${client.id}|${activeTierName}`;
      }

      if (typeof state.activeServiceGuideTabIdx === 'undefined') {
        state.activeServiceGuideTabIdx = 0;
      }

      const service = getProvidedServiceOrDefault(client.id, activeTierName);
      const serviceTabs = service.sections.tabs || [];
      const currentTab = serviceTabs[state.activeServiceGuideTabIdx] || serviceTabs[0];

      const tabStyles = `
        <style>
          .portal-service-tab-btn {
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 700;
            border: 1px solid #cbd5e1;
            border-bottom: none;
            background: #f8fafc;
            color: #475569;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            border-bottom-left-radius: 0px;
            border-bottom-right-radius: 0px;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            position: relative;
            z-index: 1;
            margin-bottom: -1px;
            height: 48px;
            box-sizing: border-box;
          }
          .portal-service-tab-btn:hover {
            background: #eff6ff;
            color: var(--theme-color);
            border-color: rgba(var(--theme-color-rgb), 0.3);
            border-bottom: none;
          }
          .portal-service-tab-btn.active {
            background: var(--theme-color);
            color: white !important;
            border: 1px solid var(--theme-color);
            border-bottom: 1px solid var(--theme-color);
            z-index: 3;
            box-shadow: none;
          }
          .portal-service-tab-btn.active::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--theme-color);
            z-index: 4;
          }
          .portal-service-tab-btn-wrapper {
            display: flex;
            gap: 4px;
            overflow-x: auto;
            padding: 0 4px;
            margin: 0;
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
            flex-grow: 1;
          }
          .portal-service-tab-btn-wrapper::-webkit-scrollbar {
            display: none; /* Chrome, Safari and Opera */
          }
        </style>
      `;

      detailContentHtml = `
        ${tabStyles}
        <div style="display:flex; flex-direction:column; gap:24px; animation: fadeIn 0.4s ease-out;">
          
          <!-- 1. Intro Banner -->
          <div style="width:100%;">
            ${service.sections.intro}
          </div>

          <!-- 2. CS Card -->
          <div style="width:100%;">
            ${service.sections.csGuide}
          </div>

          <!-- 3. Tabs Area -->
          <div style="width:100%; margin-top: 12px;">
            <div style="font-size:17px; font-weight:800; color:#0f172a; margin-bottom:16px; display:flex; align-items:center; gap:8px;">
              <span style="display:inline-block; width:4px; height:18px; background:var(--theme-color); border-radius:100px;"></span>
              서비스 주요내용
            </div>

            <!-- Dynamic Tab Buttons & Nav Controls -->
            <div style="display: flex; align-items: flex-end; justify-content: space-between; border-bottom: 1px solid #cbd5e1; margin-bottom: 0; width: 100%; position: relative; z-index: 2;">
              <div class="portal-service-tab-btn-wrapper">
                ${serviceTabs.map((tab, idx) => {
                  let iconSvg = '';
                  let iconColor = '';
                  if (tab.title.includes('평상시') || tab.title.includes('일상')) {
                    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
                    iconColor = '#f97316'; // Orange
                  } else if (tab.title.includes('질병') || tab.title.includes('진단') || tab.title.includes('명의') || tab.title.includes('케어')) {
                    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
                    iconColor = '#8b5cf6'; // Purple
                  } else if (tab.title.includes('검진')) {
                    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
                    iconColor = '#ec4899'; // Pink
                  } else if (tab.title.includes('심리')) {
                    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
                    iconColor = '#a855f7'; // Light Purple
                  } else {
                    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
                    iconColor = '#3b82f6'; // Blue
                  }

                  const isActive = idx === state.activeServiceGuideTabIdx;
                  const finalIconColor = isActive ? 'white' : iconColor;

                  return `
                    <button onclick="window.switchPortalServiceTab(${idx})" class="portal-service-tab-btn ${isActive ? 'active':''}" id="portal-service-tab-btn-${idx}">
                      <span class="portal-service-tab-icon" style="color: ${finalIconColor}; display: inline-flex; align-items: center;">${iconSvg}</span>
                      <span>${tab.title}</span>
                    </button>
                  `;
                }).join('')}
              </div>
              
              <!-- Tab Scroll Navigation Arrows -->
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px; padding-bottom: 4px; flex-shrink: 0; position: relative; z-index: 10; margin-left: 16px;">
                <button onclick="window.scrollPortalTabs(-1)" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid #cbd5e1; background: #fff; color: #94a3b8; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.color='var(--theme-color)'; this.style.borderColor='rgba(var(--theme-color-rgb), 0.3)';" onmouseout="this.style.color='#94a3b8'; this.style.borderColor='#cbd5e1';">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <button onclick="window.scrollPortalTabs(1)" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid #cbd5e1; background: #fff; color: #475569; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.05);" onmouseover="this.style.color='var(--theme-color)'; this.style.borderColor='rgba(var(--theme-color-rgb), 0.3)';" onmouseout="this.style.color='#475569'; this.style.borderColor='#cbd5e1';">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>

            <!-- Tab Content Panel -->
            <div style="background:#fff; border:1px solid #cbd5e1; border-top-left-radius: ${state.activeServiceGuideTabIdx === 0 ? '0' : '16px'}; border-top-right-radius: 16px; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; padding:32px; min-height:280px; box-shadow:0 10px 25px rgba(0,0,0,0.02); position:relative; overflow:hidden; z-index:1; margin-top:-1px;">
              ${currentTab ? currentTab.html : '<div style="padding:40px; text-align:center; color:#94a3b8;">제공 내용이 없습니다.</div>'}
            </div>
          </div>

        </div>
      `;
    } else if (isHistoryPage) {
      const allInquiries = JSON.parse(localStorage.getItem('hc_inquiries') || '[]');

      let currentCategory = '건강상담';
      if (state.activeMenuId === 'hospitalGuide' || activeMenu?.id === 'hospitalGuide' || (activeMenu?.label && activeMenu.label.includes('병원안내'))) {
        currentCategory = '병원안내';
      } else if (state.activeMenuId === 'medicalAppt' || activeMenu?.id === 'medicalAppt' || (activeMenu?.label && activeMenu.label.includes('진료예약'))) {
        currentCategory = '진료예약';
      } else if (state.activeMenuId === 'checkupAppt' || activeMenu?.id === 'checkupAppt' || (activeMenu?.label && activeMenu.label.includes('건강검진'))) {
        currentCategory = '건강검진';
      }

      const myInquiries = allInquiries.filter(iq => {
        const isMatchUser = iq.userId === state.currentUser.id && iq.clientId === client.id;
        if (!isMatchUser) return false;

        const itemCategory = iq.category || '건강상담';
        return itemCategory === currentCategory;
      }).reverse();

      const categoryColors = {
        '건강상담': { bg: 'rgba(59, 130, 246, 0.1)', text: '#1d4ed8' }, // Blue
        '병원안내': { bg: 'rgba(16, 185, 129, 0.1)', text: '#047857' }, // Green
        '진료예약': { bg: 'rgba(124, 58, 237, 0.1)', text: '#6d28d9' }, // Purple
        '건강검진': { bg: 'rgba(219, 39, 119, 0.1)', text: '#db2777' }  // Pink
      };

      detailContentHtml = `
        <div class="inquiry-notice" style="padding:20px; background:rgba(var(--theme-color-rgb), 0.05); border-radius:12px; margin-bottom:32px; border-left:4px solid var(--theme-color);">
          <p style="color:#1e293b; font-weight:700; font-size:16px; margin-bottom:4px;">📋 나의 ${currentCategory} 신청/문의 이력</p>
          <p style="color:#64748b; font-size:14px;">고객님께서 신청하신 ${currentCategory} 분야의 전화상담 및 문의 이력입니다. <br/>로그인하신 계정으로 등록된 해당 이력을 확인하실 수 있습니다.</p>
        </div>
        
        <div class="history-list-container">
          <div class="history-header">
            <div>서비스분류</div>
            <div>문의유형</div>
            <div>등록일</div>
            <div style="text-align:left; padding-left:20px;">내용</div>
            <div>상담희망일자</div>
            <div>상담희망시간</div>
            <div>상담상태</div>
          </div>
          
          ${myInquiries.length === 0 ? `
            <div style="padding:60px; text-align:center; color:#94a3b8; border-bottom:1px solid #e2e8f0;">신청하신 ${currentCategory} 상담 및 문의 내역이 없습니다.</div>
          ` : myInquiries.map(item => {
        const statusClass = item.status === '완료' || item.status === '답변완료' ? 'status-complete' :
          item.status === '취소' ? 'status-cancel' : 'status-request';
        const statusLabel = item.status === '완료' || item.status === '답변완료' ? '완료' :
          item.status === '취소' ? '취소' : '신청';
        const cat = item.category || '건강상담';
        const colors = categoryColors[cat] || categoryColors['건강상담'];

        return `
              <div class="history-row" onclick="this.classList.toggle('expanded')">
                <div class="history-row-main">
                  <div><span style="background:${colors.bg}; color:${colors.text}; padding:4px 10px; border-radius:100px; font-size:12px; font-weight:700; display:inline-block;">${cat}</span></div>
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
    } else if (isCheckupHistoryPage) {
      if (!window.requestCancelCheckup) {
        window.requestCancelCheckup = (id) => {
          if(confirm("건강검진 예약을 취소하시겠습니까?\n(취소요청 후 관리자가 병원 확인을 거쳐 최종 취소처리됩니다.)")) {
            let hist = JSON.parse(localStorage.getItem('hc_checkup_history') || '[]');
            const idx = hist.findIndex(h => h.id === id);
            if (idx !== -1) {
              hist[idx].status = '취소요청';
              localStorage.setItem('hc_checkup_history', JSON.stringify(hist));
              alert("취소 요청이 접수되었습니다. 관리자 확인 후 결과가 안내됩니다.");
              render();
            }
          }
        };
      }

      let checkupHistories = JSON.parse(localStorage.getItem('hc_checkup_history') || 'null');
      if (!checkupHistories) {
        checkupHistories = [
          {
            id: 'chk-001',
            userId: 'user1',
            pkgName: '서울종합검진센터 - 프리미엄형',
            supportType: '건강검진 우대예약',
            applyDate: '2026-05-10',
            wishDate1: '2026-06-01',
            wishDate2: '2026-06-08',
            selectedTests: '대장내시경, 심장초음파',
            extraTests: '수면, 비타민D',
            confirmDate: '2026-06-01',
            targetName: '홍길동',
            targetBirthGender: '19800101 / 남성',
            targetPhone: '010-1234-5678',
            targetAddress: '서울시 강남구 테헤란로 123',
            status: '확정',
            reservationConfirmedDate: '2026-05-15',
            personalCost: '₩300,000'
          },
          {
            id: 'chk-002',
            userId: 'user1',
            pkgName: '우리허브병원 - 기본형',
            supportType: '회사지원',
            applyDate: '2026-05-18',
            wishDate1: '2026-06-15',
            wishDate2: '2026-06-20',
            selectedTests: '위내시경',
            extraTests: '수면',
            confirmDate: '',
            targetName: '홍지민',
            targetBirthGender: '20100825 / 여성',
            targetPhone: '010-9876-5432',
            targetAddress: '서울시 서초구 방배로 45',
            status: '신청',
            reservationConfirmedDate: '',
            personalCost: '₩200,000'
          }
        ];
        localStorage.setItem('hc_checkup_history', JSON.stringify(checkupHistories));
      }

      // Filter by current user
      if (state.currentUser) {
        checkupHistories = checkupHistories.filter(h => h.userId === state.currentUser.id || !h.userId);
      }

      // State setup for filter
      window.checkupFilter = window.checkupFilter || '전체';
      if (!window.setCheckupFilter) {
        window.setCheckupFilter = (status) => {
          window.checkupFilter = status;
          render();
        };
      }
      
      if (!window.toggleCheckupDetail) {
        window.toggleCheckupDetail = (btnElement, detailRowId) => {
          const detailRow = document.getElementById(detailRowId);
          if (detailRow.style.display === 'none') {
            detailRow.style.display = 'table-row';
            btnElement.innerText = '접기';
            btnElement.style.background = '#f1f5f9';
            btnElement.style.color = '#475569';
            btnElement.style.borderColor = '#cbd5e1';
          } else {
            detailRow.style.display = 'none';
            btnElement.innerText = '상세보기';
            btnElement.style.background = 'white';
            btnElement.style.color = '#64748b';
            btnElement.style.borderColor = '#e2e8f0';
          }
        };
      }

      let filteredHistories = checkupHistories;
      if (window.checkupFilter !== '전체') {
        const filterMap = {
           '신청': '신청',
           '예약 확정': '확정',
           '취소요청': '취소요청',
           '취소완료': '취소완료'
        };
        filteredHistories = checkupHistories.filter(h => h.status === filterMap[window.checkupFilter]);
      }

      const tabs = ['전체', '신청', '예약 확정', '취소요청', '취소완료'];
      const tabsHtml = tabs.map(tab => `
        <button onclick="window.setCheckupFilter('${tab}')" style="padding:10px 20px; font-size:15px; font-weight:700; border:none; background:${window.checkupFilter === tab ? '#2563eb' : 'transparent'}; color:${window.checkupFilter === tab ? 'white' : '#64748b'}; border-radius:8px; cursor:pointer; transition:all 0.2s;">
          ${tab}
        </button>
      `).join('');

      detailContentHtml = `
        <style>
          .checkup-history-table { width:100%; border-collapse:collapse; font-size:14px; text-align:center; background:white; border-radius:12px; overflow:hidden; border:1px solid #e2e8f0; }
          .checkup-history-table th { background:#f8fafc; padding:16px 12px; color:#475569; font-weight:700; border-bottom:1px solid #e2e8f0; border-top:none; }
          .checkup-history-table td { padding:16px 12px; border-bottom:1px solid #e2e8f0; color:#1e293b; vertical-align:middle; }
          .checkup-history-table tr.main-row:hover { background:#f1f5f9; }
          .status-badge { display:inline-block; padding:6px 12px; border-radius:100px; font-size:13px; font-weight:700; }
          .status-badge.신청 { background:#e0f2fe; color:#0284c7; }
          .status-badge.확정 { background:#dcfce7; color:#16a34a; }
          .status-badge.취소요청 { background:#ffedd5; color:#ea580c; }
          .status-badge.취소완료 { background:#f1f5f9; color:#64748b; }
          .detail-panel { text-align:left; padding:24px; background:#f8fafc; }
          .detail-section-title { font-size:15px; font-weight:700; color:#2563eb; margin-bottom:16px; display:flex; align-items:center; }
          .detail-grid { display:grid; grid-template-columns: 1fr 1.5fr 1fr 1fr; gap:24px; }
          .detail-col { border-right:1px solid #e2e8f0; padding-right:24px; }
          .detail-col:last-child { border-right:none; padding-right:0; }
          .detail-row-item { display:flex; margin-bottom:12px; font-size:14px; }
          .detail-row-item .lbl { width:100px; color:#64748b; font-weight:600; flex-shrink:0; }
          .detail-row-item .val { color:#1e293b; font-weight:700; }
          .detail-list { padding-left:20px; margin:0; color:#1e293b; font-weight:600; line-height:1.6; }
          .detail-list li { margin-bottom:6px; }
        </style>
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
          <div>
            <h2 style="font-size:24px; font-weight:800; color:#0f172a; margin-bottom:8px;">건강검진 신청이력</h2>
            <p style="color:#64748b; font-size:15px;">신청하신 검진 내역과 진행상황을 확인하실 수 있습니다.</p>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; background:white; padding:8px; border-radius:12px; border:1px solid #e2e8f0;">
          <div style="display:flex; gap:4px;">
            ${tabsHtml}
          </div>
          <div style="display:flex; gap:8px;">
            <input type="date" value="2025-04-20" style="padding:10px 16px; border:1px solid #cbd5e1; border-radius:8px; color:#475569; font-family:inherit; outline:none;" disabled>
            <span style="color:#94a3b8; line-height:40px;">~</span>
            <input type="date" value="2025-05-20" style="padding:10px 16px; border:1px solid #cbd5e1; border-radius:8px; color:#475569; font-family:inherit; outline:none;" disabled>
            <input type="text" placeholder="검진패키지명, 검진대상자명으로 검색" style="padding:10px 16px; width:260px; border:1px solid #cbd5e1; border-radius:8px; outline:none; font-family:inherit;" disabled>
          </div>
        </div>

        <div style="overflow-x:auto;">
          <table class="checkup-history-table">
            <thead>
              <tr>
                <th style="width:120px;">신청일 (등록일)</th>
                <th>검진패키지명</th>
                <th>검진대상자</th>
                <th>희망일 1</th>
                <th>희망일 2</th>
                <th>선택검사</th>
                <th>추가검사</th>
                <th>처리단계</th>
                <th>예약확정일</th>
                <th style="width:100px;">관리</th>
              </tr>
            </thead>
            <tbody>
              ${filteredHistories.length === 0 ? `<tr><td colspan="10" style="padding:60px; color:#94a3b8;">해당 조건의 신청이력이 없습니다.</td></tr>` : filteredHistories.map((chk, index) => {
                const statusClass = chk.status === '확정' ? '확정' : (chk.status === '신청' ? '신청' : (chk.status === '취소요청' ? '취소요청' : '취소완료'));
                const displayStatus = chk.status === '확정' ? '예약 확정' : chk.status;
                const trId = 'detail-' + chk.id;
                
                return `
                <tr class="main-row">
                  <td>
                    <div style="font-weight:700;">${chk.applyDate}</div>
                    <div style="color:#94a3b8; font-size:12px; margin-top:4px;">오전 10:35</div>
                  </td>
                  <td style="text-align:left; font-weight:700;">
                    <div style="color:#0f172a;">${chk.pkgName.split('-')[0].trim()}</div>
                    <div style="color:#64748b; font-size:13px; margin-top:4px; font-weight:600;">${chk.pkgName.split('-')[1]?.trim() || ''}</div>
                  </td>
                  <td style="text-align:left;">
                    <div style="font-weight:700; color:#0f172a;">${chk.targetName}</div>
                    <div style="color:#64748b; font-size:12px; margin-top:4px;">${chk.targetBirthGender.split('/')[0].trim()} / ${chk.targetBirthGender.split('/')[1]?.trim() || ''}</div>
                  </td>
                  <td style="font-weight:600; color:#475569;">${chk.wishDate1}</td>
                  <td style="font-weight:600; color:#475569;">${chk.wishDate2 || '-'}</td>
                  <td style="color:#64748b; font-size:13px;">${chk.selectedTests || '-'}</td>
                  <td style="color:#64748b; font-size:13px;">${chk.extraTests || '-'}</td>
                  <td><span class="status-badge ${statusClass}">${displayStatus}</span></td>
                  <td style="font-weight:700; color:#1e293b;">${chk.reservationConfirmedDate || '-'}</td>
                  <td>
                    <button onclick="window.toggleCheckupDetail(this, '${trId}')" style="padding:6px 12px; background:white; border:1px solid #e2e8f0; color:#64748b; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer; transition:all 0.2s;">상세보기</button>
                  </td>
                </tr>
                <tr id="${trId}" style="display:none; background:#f8fafc;">
                  <td colspan="10" style="padding:0; text-align:left; border-bottom: 2px solid #cbd5e1;">
                    <div class="detail-panel">
                      <div style="font-size:16px; font-weight:800; color:#0f172a; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid #e2e8f0; display:flex; align-items:center;">
                        신청 상세내역 <span style="margin:0 12px; color:#cbd5e1;">|</span> <span style="font-weight:600; color:#64748b;">${chk.pkgName} (개인결제비용: ${chk.personalCost || (chk.pkgName.includes('기본형') ? '₩200,000' : '₩300,000')})</span>
                      </div>
                      <div class="detail-grid">
                        <div class="detail-col">
                          <div class="detail-section-title">신청 정보</div>
                          <div class="detail-row-item"><span class="lbl">신청일</span><span class="val">${chk.applyDate} 10:35</span></div>
                          <div class="detail-row-item"><span class="lbl">희망일 1</span><span class="val">${chk.wishDate1}</span></div>
                          <div class="detail-row-item"><span class="lbl">희망일 2</span><span class="val">${chk.wishDate2 || '-'}</span></div>
                          <div class="detail-row-item" style="align-items:center;">
                            <span class="lbl">처리단계</span>
                            <div style="display:flex; gap:8px;">
                              <span class="status-badge ${statusClass}" style="padding:4px 10px; font-size:12px;">${displayStatus}</span>
                              ${(chk.status === '신청' || chk.status === '확정') ? `
                              <button onclick="window.requestCancelCheckup('${chk.id}')" style="padding:4px 10px; background:white; border:1px solid #ef4444; color:#ef4444; border-radius:100px; font-size:12px; font-weight:700; cursor:pointer;">취소 요청</button>
                              ` : ''}
                            </div>
                          </div>
                        </div>
                        <div class="detail-col">
                          <div class="detail-section-title">검진대상자 정보</div>
                          <div class="detail-row-item"><span class="lbl">성명</span><span class="val">${chk.targetName}</span></div>
                          <div class="detail-row-item"><span class="lbl">생년월일/성별</span><span class="val">${chk.targetBirthGender}</span></div>
                          <div class="detail-row-item"><span class="lbl">휴대폰번호</span><span class="val">${chk.targetPhone}</span></div>
                          <div class="detail-row-item"><span class="lbl">주소</span><span class="val" style="line-height:1.5;">${chk.targetAddress}</span></div>
                        </div>
                        <div class="detail-col">
                          <div class="detail-section-title">선택검사</div>
                          <ul class="detail-list">
                            ${chk.selectedTests ? chk.selectedTests.split(',').map(t => `<li>${t.trim()}</li>`).join('') : '<li>-</li>'}
                          </ul>
                        </div>
                        <div class="detail-col">
                          <div class="detail-section-title">추가검사</div>
                          <ul class="detail-list">
                            ${chk.extraTests ? chk.extraTests.split(',').map(t => `<li>${t.trim()}</li>`).join('') : '<li>-</li>'}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
        } else if (isConsultingGroup) {
      const tabs = [
        { id: 'general', label: '건강상담', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>', color: '#3b82f6' },
        { id: 'appt', label: '진료예약', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>', color: '#8b5cf6' },
        { id: 'expert', label: '병원안내', icon: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>', color: '#10b981' }
      ];

      const currentTab = state.activeSubId || 'general';

      const renderTabNav = () => `
        <style>
          .hc-tab-btn {
            flex: 1; padding: 14px 16px; font-size: 15px; font-weight: 700; border: 1px solid #cbd5e1; border-bottom: none;
            background: #f8fafc; color: #475569; border-top-left-radius: 12px; border-top-right-radius: 12px;
            cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
            position: relative; z-index: 1; margin-bottom: -1px; height: 54px;
          }
          .hc-tab-btn:hover {
            background: #eff6ff; color: var(--theme-color); border-color: rgba(var(--theme-color-rgb), 0.3);
          }
          .hc-tab-btn.active {
            background: var(--theme-color); color: white !important; border-color: var(--theme-color); z-index: 3;
          }
          .hc-tab-btn.active::after {
            content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: var(--theme-color); z-index: 4;
          }
        </style>
        <div style="display:flex; width:100%; border-bottom:1px solid #cbd5e1; margin-bottom:0;">
          ${tabs.map(t => `
            <button onclick="window.location.hash='#/portal/${client.id}/${activeSite.siteId}/healthConsulting/${t.id}'" 
                    class="hc-tab-btn ${currentTab === t.id ? 'active' : ''}">
              <span style="color:${currentTab === t.id ? 'white' : t.color}; display:flex; align-items:center;">${t.icon}</span>
              ${t.label}
            </button>
          `).join('')}
        </div>
      `;

      let tabContent = '';
      if (currentTab === 'general') {
        tabContent = `
          <div style="padding:32px; background:white; border:1px solid #cbd5e1; border-top:none; border-bottom-left-radius:16px; border-bottom-right-radius:16px; animation:fadeIn 0.3s ease;">
            <div class="consulting-info" style="margin-bottom:32px;">
              <img src="./images/health_counseling.png" class="content-hero-img" alt="건강상담" onerror="this.src='https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200'">
              <h3 style="font-size:22px; font-weight:800; color:#1e293b; margin-bottom:16px;">건강상담 서비스</h3>
              <p style="color:#334155; line-height:1.8; font-size:16px; margin-bottom:24px;">
                건강에 대한 궁금증부터 생활습관 관리까지, 다양한 분야의 전문가가 맞춤형 상담을 제공합니다.
              </p>
              <div style="background:#f1f5f9; padding:20px; border-radius:12px; margin-bottom:32px; font-size:14px; color:#475569; line-height:1.7;">
                간호사, 영양사, 운동처방사는 물론 내과·소아과·피부과·안과·치과 등 각 분야 전문의 상담을 통해 일상 속 건강 고민을 편리하게 상담받으실 수 있습니다.
              </div>
              <button class="auth-btn btn-primary" style="padding:16px 40px; font-size:18px; width:auto; border-radius:12px;" onclick="toggleConsultingForm()">건강상담 신청하기</button>
            </div>
            
            <div id="consulting-form-area" style="display:none; padding-top:32px; border-top:1px solid #e2e8f0; animation: fadeIn 0.4s ease;">
              <h4 style="margin-bottom:20px; font-size:18px; color:#1e293b; font-weight:700;">상담 신청 정보 입력</h4>
              <div class="consult-type-selector" style="margin-bottom:20px;">
                <label class="custom-radio">
                  <input type="radio" name="consult-type" value="phone" checked onclick="updateConsultType('phone')">
                  <span class="radio-mark"></span> 전화상담
                </label>
                <label class="custom-radio">
                  <input type="radio" name="consult-type" value="online" onclick="updateConsultType('online')">
                  <span class="radio-mark"></span> 온라인 문의
                </label>
              </div>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:20px;">
                <div class="form-group">
                  <label class="form-label" style="display:block; margin-bottom:8px; font-weight:600;">상담 희망 일자</label>
                  <input type="date" id="consult-date" class="form-input" min="${new Date().toISOString().split('T')[0]}" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:8px;">
                </div>
                <div class="form-group">
                  <label class="form-label" style="display:block; margin-bottom:8px; font-weight:600;">상담 희망 시간</label>
                  <select id="consult-time" class="form-input" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:8px; background:white;">
                    <option value="anytime">전일 (언제든 통화 가능)</option>
                    <option value="09:00">09:00</option><option value="10:00">10:00</option><option value="11:00">11:00</option><option value="12:00">12:00</option>
                    <option value="13:00">13:00</option><option value="14:00">14:00</option><option value="15:00">15:00</option><option value="16:00">16:00</option><option value="17:00">17:00</option>
                  </select>
                </div>
              </div>
              <div class="form-group" style="margin-bottom:24px;">
                <label class="form-label" style="display:block; margin-bottom:8px; font-weight:600;">상담 내용</label>
                <textarea id="consult-memo" class="form-input" placeholder="상담하실 내용을 간단히 적어주세요." style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:8px; min-height:120px; resize:vertical;"></textarea>
              </div>
              <button class="auth-btn btn-primary" style="width:100%; padding:16px; border-radius:12px;" onclick="submitConsulting()">신청 완료</button>
            </div>
          </div>
        `;
      } else if (currentTab === 'appt') {
        tabContent = `
          <div style="padding:32px; background:white; border:1px solid #cbd5e1; border-top:none; border-bottom-left-radius:16px; border-bottom-right-radius:16px; animation:fadeIn 0.3s ease;">
            <div class="hg-hero">
              <div class="hg-hero-content">
                <div class="hg-hero-badge">📅 진료예약 서비스</div>
                <div class="hg-hero-title">꼭 필요한 진료,<br/><span style="color:#2F4A9A;">정확한 의료진</span>에게 빠르게 연결해드립니다</div>
                <div class="hg-hero-subtitle">건강검진 결과 또는 증상에 따라 상급병원 진료가 필요한 경우,<br/>간호사가 상태 및 소견을 검토하여 적절한 진료과와<br/>전문의료진의 진료예약을 지원해드립니다.</div>
              </div>
              <div style="flex-shrink:0;">
                <img src="./images/medical_appt_hero.png" alt="진료예약" style="max-height:220px;" onerror="this.style.display='none'">
              </div>
            </div>

            <div class="hg-how-to-title" style="text-align:center; font-size:20px; font-weight:700; color:#1e293b; margin:48px 0 24px; position:relative;">
              <span style="color:#2F4A9A;">•</span> 이런 경우 사용하세요 <span style="color:#2F4A9A;">•</span>
            </div>

            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:16px; margin-bottom:48px;">
              <div style="background:white; border:1px solid #cbd5e1; border-radius:16px; padding:24px 16px; text-align:center; box-shadow:0 4px 6px rgba(0,0,0,0.02); transition:all 0.3s ease;">
                <div style="width:64px; height:64px; margin:0 auto 16px; background:#f1f5f9; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#2F4A9A;">
                  <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                </div>
                <div style="font-weight:600; color:#334155; font-size:15px; line-height:1.4;">건강검진에서<br/>정밀검사 권고를<br/>받은 경우</div>
              </div>
              <div style="background:white; border:1px solid #cbd5e1; border-radius:16px; padding:24px 16px; text-align:center; box-shadow:0 4px 6px rgba(0,0,0,0.02); transition:all 0.3s ease;">
                <div style="width:64px; height:64px; margin:0 auto 16px; background:#f1f5f9; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#2F4A9A;">
                  <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"></path></svg>
                </div>
                <div style="font-weight:600; color:#334155; font-size:15px; line-height:1.4;">여러 병원을 다녀도<br/>원인을 찾기 어려운<br/>경우</div>
              </div>
              <div style="background:white; border:1px solid #cbd5e1; border-radius:16px; padding:24px 16px; text-align:center; box-shadow:0 4px 6px rgba(0,0,0,0.02); transition:all 0.3s ease;">
                <div style="width:64px; height:64px; margin:0 auto 16px; background:#f1f5f9; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#2F4A9A;">
                  <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </div>
                <div style="font-weight:600; color:#334155; font-size:15px; line-height:1.4;">상급병원 진료가<br/>필요한 경우</div>
              </div>
              <div style="background:white; border:1px solid #cbd5e1; border-radius:16px; padding:24px 16px; text-align:center; box-shadow:0 4px 6px rgba(0,0,0,0.02); transition:all 0.3s ease;">
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
                  <input type="date" id="consult-date" class="form-input" min="${new Date().toISOString().split('T')[0]}" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:8px;">
                </div>
                <div class="form-group">
                  <label class="form-label" style="display:block; margin-bottom:8px; font-weight:600;">상담 희망 시간</label>
                  <select id="consult-time" class="form-input" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:8px; background:white;">
                    <option value="anytime">전일 (언제든 통화 가능)</option>
                    ${Array.from({ length: 9 }, (_, i) => 9 + i).map(h => `<option value="${h}:00">${h < 10 ? '0' + h : h}:00</option>`).join('')}
                  </select>
                </div>
              </div>

              <div class="form-group" style="margin-bottom:24px;">
                <label class="form-label" style="display:block; margin-bottom:8px; font-weight:600;">증상 및 상담 내용</label>
                <textarea id="consult-memo" class="form-input" placeholder="현재 겪고 계신 증상이나 검진 결과 등 상담하실 내용을 간단히 적어주세요." style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:8px; min-height:120px; resize:vertical;"></textarea>
              </div>

              <button class="auth-btn btn-primary" style="width:100%; padding:16px;" onclick="submitConsulting()">신청 완료</button>
            </div>
          </div>
        `;
      } else if (currentTab === 'expert') {
        tabContent = `
          <div style="padding:32px; background:white; border:1px solid #cbd5e1; border-top:none; border-bottom-left-radius:16px; border-bottom-right-radius:16px; animation:fadeIn 0.3s ease;">
            <div class="consulting-info" style="margin-bottom:32px;">
              <div class="hg-hero-badge" style="background:#dcfce7; color:#15803d; padding:6px 12px; border-radius:6px; font-weight:700; font-size:14px; display:inline-block; margin-bottom:16px;">병원안내 서비스</div>
              <h3 style="font-size:22px; font-weight:800; color:#1e293b; margin-bottom:16px;">최적의 병원과 전문의료진을 안내해 드립니다</h3>
              <p style="color:#334155; line-height:1.8; font-size:16px; margin-bottom:24px;">
                건강 상태와 증상에 따라 간호사가 적절한 병원과 의료진을 매칭하여 추천해 드립니다. 
              </p>
              
              <div style="display:flex; justify-content:space-between; align-items:center; margin:30px 0; background:#f8fafc; padding:24px; border-radius:12px; border:1px solid #e2e8f0;">
                <div style="text-align:center; flex:1;">
                  <div style="width:48px; height:48px; margin:0 auto 10px; background:#dcfce7; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#16a34a;">📞</div>
                  <div style="font-weight:700; font-size:13px;">전화상담 신청</div>
                </div>
                <div style="color:#cbd5e1; font-size:16px;">▶</div>
                <div style="text-align:center; flex:1;">
                  <div style="width:48px; height:48px; margin:0 auto 10px; background:#dcfce7; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#16a34a;">👩‍⚕️</div>
                  <div style="font-weight:700; font-size:13px;">간호사 상담</div>
                </div>
                <div style="color:#cbd5e1; font-size:16px;">▶</div>
                <div style="text-align:center; flex:1;">
                  <div style="width:48px; height:48px; margin:0 auto 10px; background:#dcfce7; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#16a34a;">🩺</div>
                  <div style="font-weight:700; font-size:13px;">증상 확인</div>
                </div>
                <div style="color:#cbd5e1; font-size:16px;">▶</div>
                <div style="text-align:center; flex:1;">
                  <div style="width:48px; height:48px; margin:0 auto 10px; background:#dcfce7; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#16a34a;">🏥</div>
                  <div style="font-weight:700; font-size:13px;">병원 안내</div>
                </div>
              </div>
              
              <button class="auth-btn btn-primary" style="background:#10b981; padding:16px 40px; font-size:18px; width:auto; border-radius:12px; box-shadow:0 4px 12px rgba(16,185,129,0.3);" onclick="document.getElementById('expert-form-area').style.display='block'">상담 신청하기</button>
            </div>
            
            <div id="expert-form-area" style="display:none; padding-top:32px; border-top:1px solid #e2e8f0; animation: fadeIn 0.4s ease;">
              <h4 style="margin-bottom:20px; font-size:18px; color:#1e293b; font-weight:700;">전문의료진 안내 상담 신청</h4>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:20px;">
                <div class="form-group">
                  <label class="form-label" style="display:block; margin-bottom:8px; font-weight:600;">상담 희망 일자</label>
                  <input type="date" id="consult-date" class="form-input" min="${new Date().toISOString().split('T')[0]}" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:8px;">
                </div>
                <div class="form-group">
                  <label class="form-label" style="display:block; margin-bottom:8px; font-weight:600;">상담 희망 시간</label>
                  <select id="consult-time" class="form-input" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:8px; background:white;">
                    <option value="anytime">전일 (언제든 통화 가능)</option>
                    <option value="09:00">09:00</option><option value="10:00">10:00</option><option value="11:00">11:00</option><option value="12:00">12:00</option>
                    <option value="13:00">13:00</option><option value="14:00">14:00</option><option value="15:00">15:00</option><option value="16:00">16:00</option><option value="17:00">17:00</option>
                  </select>
                </div>
              </div>
              <div class="form-group" style="margin-bottom:24px;">
                <label class="form-label" style="display:block; margin-bottom:8px; font-weight:600;">증상 내용</label>
                <textarea id="consult-memo" class="form-input" placeholder="안내받고 싶으신 진료 분야나 현재의 증상을 자세히 적어주세요." style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:8px; min-height:120px; resize:vertical;"></textarea>
              </div>
              <button class="auth-btn btn-primary" style="background:#10b981; width:100%; padding:16px; border-radius:12px;" onclick="submitConsulting()">상담 신청 완료</button>
            </div>
          </div>
        `;
      }

      detailContentHtml = `
        <div style="max-width:900px; margin:0 auto; padding:20px 0;">
          ${renderTabNav()}
          ${tabContent}
        </div>
      `;

      } else if (isSearchGroup) {
        detailContentHtml = `
          <div class="hospital-search-wrapper" style="animation: fadeIn 0.4s ease;">
            
            <!-- Header Block -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
              <div>
                <h3 style="font-size:24px; font-weight:700; color:#1e293b; margin:0 0 8px 0;">병원 검색</h3>
                <p style="color:#64748b; font-size:14px; margin:0;">지역, 진료과, 병원 종별 등 다양한 조건으로 원하시는 병원을 검색할 수 있습니다.</p>
              </div>
              <div style="display:flex; align-items:center; gap:16px;">
                <button style="display:flex; align-items:center; gap:6px; background:white; border:1px solid #cbd5e1; padding:8px 16px; border-radius:20px; font-size:13px; font-weight:600; color:#475569; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.05); outline:none;">
                  <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg>
                  검색 이용 안내
                </button>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" style="opacity:0.85; flex-shrink:0;">
                  <rect x="15" y="15" width="30" height="35" rx="4" fill="#bfdbfe"/>
                  <rect x="27" y="5" width="6" height="15" fill="#3b82f6"/>
                  <rect x="22" y="10" width="16" height="5" fill="#3b82f6"/>
                  <rect x="20" y="20" width="6" height="6" rx="1" fill="white"/>
                  <rect x="34" y="20" width="6" height="6" rx="1" fill="white"/>
                  <rect x="20" y="30" width="6" height="6" rx="1" fill="white"/>
                  <rect x="34" y="30" width="6" height="6" rx="1" fill="white"/>
                  <rect x="27" y="40" width="6" height="10" fill="#3b82f6"/>
                  <circle cx="50" cy="15" r="8" fill="rgba(var(--theme-color-rgb), 0.1)"/>
                  <circle cx="50" cy="15" r="4" fill="var(--theme-color)"/>
                </svg>
              </div>
            </div>

            <!-- Filter Panel -->
            <div style="background:white; border:1px solid #e2e8f0; border-radius:16px; padding:32px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05); margin-bottom:32px;">
              
              <!-- Address Search Title & Tabs -->
              <div style="margin-bottom:24px;">
                <h4 style="font-size:16px; font-weight:700; color:#1e293b; margin:0 0 16px 0;">주소 검색</h4>
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">
                  <div style="display:flex; gap:16px;">
                    <button style="background:none; border:none; color:var(--theme-color); font-weight:700; font-size:14px; border-bottom:3px solid var(--theme-color); padding-bottom:10px; cursor:pointer; position:relative; bottom:-11px;">주소별 검색</button>
                    <button style="background:none; border:none; color:#94a3b8; font-weight:600; font-size:14px; padding-bottom:10px; cursor:pointer; position:relative; bottom:-11px;">도로명 검색</button>
                  </div>
                  <label style="display:flex; align-items:center; gap:8px; font-size:13px; color:#475569; cursor:pointer;">
                    <input type="checkbox" style="width:16px; height:16px; accent-color:var(--theme-color);">
                    현재 위치로 검색
                  </label>
                </div>
              </div>

              <!-- Address Dropdowns Row -->
              <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1.2fr; gap:16px; margin-bottom:32px;">
                <div>
                  <select style="width:100%; padding:14px; border:1px solid #cbd5e1; border-radius:8px; background:white; font-size:14px; font-weight:500; color:#1e293b; outline:none; cursor:pointer;">
                    <option>서울특별시</option>
                  </select>
                </div>
                <div>
                  <select style="width:100%; padding:14px; border:1px solid #cbd5e1; border-radius:8px; background:white; font-size:14px; font-weight:500; color:#1e293b; outline:none; cursor:pointer;">
                    <option>강남구</option>
                  </select>
                </div>
                <div>
                  <select style="width:100%; padding:14px; border:1px solid #cbd5e1; border-radius:8px; background:white; font-size:14px; font-weight:500; color:#1e293b; outline:none; cursor:pointer;">
                    <option>역삼동</option>
                  </select>
                </div>
                <div>
                  <input type="text" value="테헤란로 123" placeholder="상세 주소 입력 (선택) 예) 테헤란로 123" style="width:100%; padding:14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; outline:none; color:#1e293b;">
                </div>
              </div>

              <!-- Category Grid (Speciality, Area, Tiers) -->
              <div style="display:grid; grid-template-columns:1.2fr 1.2fr 1fr; gap:24px; border-top:1px solid #e2e8f0; padding-top:24px; margin-bottom:32px;">
                
                <!-- Speciality Column -->
                <div style="border-right:1px solid #f1f5f9; padding-right:20px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <h5 style="margin:0; font-size:14px; font-weight:700; color:#1e293b; display:flex; align-items:center; gap:4px;">
                      진료과 선택
                      <span style="display:inline-flex; align-items:center; justify-content:center; width:16px; height:16px; border-radius:50%; background:#e2e8f0; color:#64748b; font-size:10px; font-weight:bold; cursor:pointer;">?</span>
                    </h5>
                    <button style="background:#f1f5f9; border:none; border-radius:4px; padding:4px 8px; font-size:11px; font-weight:600; color:#64748b; cursor:pointer;">전체 선택</button>
                  </div>
                  
                  <!-- Speciality Search -->
                  <div style="position:relative; margin-bottom:12px;">
                    <input type="text" placeholder="진료과 검색" style="width:100%; padding:8px 12px 8px 32px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px; outline:none;">
                    <span style="position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#94a3b8; font-size:12px;">🔍</span>
                  </div>

                  <!-- Speciality Checkboxes -->
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; max-height:180px; overflow-y:auto; padding-right:6px;">
                    ${['내과', '외과', '정형외과', '신경과', '신경외과', '소아청소년과', '산부인과', '안과', '이비인후과', '피부과', '정신건강의학과', '재활의학과', '영상의학과', '응급의학과', '가정의학과', '기타'].map(spec => `
                      <label style="display:flex; align-items:center; gap:8px; font-size:13px; color:#475569; cursor:pointer; padding:2px 0;">
                        <input type="checkbox" style="width:15px; height:15px; accent-color:var(--theme-color);" ${spec === '정형외과' ? 'checked' : ''}>
                        ${spec}
                      </label>
                    `).join('')}
                  </div>
                </div>

                <!-- Specific Area Column -->
                <div style="border-right:1px solid #f1f5f9; padding-right:20px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <h5 style="margin:0; font-size:14px; font-weight:700; color:#1e293b;">특정 분야 선택 (선택)</h5>
                    <button style="background:#f1f5f9; border:none; border-radius:4px; padding:4px 8px; font-size:11px; font-weight:600; color:#64748b; cursor:pointer;">전체 선택</button>
                  </div>

                  <!-- Specific Area Checkboxes -->
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; max-height:220px; overflow-y:auto; padding-right:6px;">
                    ${['암센터', '심뇌혈관센터', '소화기센터', '관절센터', '척추센터', '뇌신경센터', '심장센터', '호흡기센터', '건강검진센터', '난임센터', '통증센터', '기타'].map(area => `
                      <label style="display:flex; align-items:center; gap:8px; font-size:13px; color:#475569; cursor:pointer; padding:2px 0;">
                        <input type="checkbox" style="width:15px; height:15px; accent-color:var(--theme-color);" ${area === '관절센터' ? 'checked' : ''}>
                        ${area}
                      </label>
                    `).join('')}
                  </div>
                </div>

                <!-- Hospital Tier Column -->
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <h5 style="margin:0; font-size:14px; font-weight:700; color:#1e293b;">병원 종별(규모별) 선택</h5>
                    <button style="background:#f1f5f9; border:none; border-radius:4px; padding:4px 8px; font-size:11px; font-weight:600; color:#64748b; cursor:pointer;">전체 선택</button>
                  </div>

                  <!-- Hospital Tiers Checkboxes -->
                  <div style="display:grid; grid-template-columns:1fr; gap:8px; max-height:220px; overflow-y:auto;">
                    ${['상급종합병원', '종합병원', '병원', '의원', '요양병원', '치과병원', '한방병원', '보건기관'].map(tier => `
                      <label style="display:flex; align-items:center; gap:8px; font-size:13px; color:#475569; cursor:pointer; padding:2px 0;">
                        <input type="checkbox" style="width:15px; height:15px; accent-color:var(--theme-color);" ${tier === '상급종합병원' ? 'checked' : ''}>
                        ${tier}
                      </label>
                    `).join('')}
                  </div>
                </div>

              </div>

              <!-- Reset & Search Buttons -->
              <div style="display:flex; justify-content:center; gap:12px; border-top:1px solid #f1f5f9; padding-top:24px;">
                <button style="display:flex; align-items:center; gap:6px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:12px 30px; font-size:14px; font-weight:600; color:#475569; cursor:pointer; transition:background 0.2s; outline:none;">
                  <span>초기화</span>
                </button>
                <button class="auth-btn btn-primary" style="margin:0; width:auto; padding:12px 40px; font-size:14px; font-weight:700; border-radius:8px;">
                  검색하기
                </button>
              </div>

            </div>

            <!-- Result Section Title -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
              <h4 style="margin:0; font-size:18px; font-weight:700; color:#1e293b;">검색 결과 <span style="color:var(--theme-color);">125</span>건</h4>
              <div style="display:flex; gap:10px; align-items:center;">
                <select style="padding:6px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px; background:white; outline:none;">
                  <option>정확도순</option>
                  <option>거리순</option>
                </select>
                <button style="display:flex; align-items:center; gap:4px; background:white; border:1px solid #cbd5e1; border-radius:6px; padding:6px 12px; font-size:13px; color:#475569; font-weight:600; cursor:pointer;">
                  <span>📍 지도에서 보기</span>
                </button>
                <button style="display:flex; align-items:center; gap:4px; background:white; border:1px solid #cbd5e1; border-radius:6px; padding:6px 12px; font-size:13px; color:#475569; font-weight:600; cursor:pointer;">
                  <span>📥 목록 다운로드</span>
                </button>
              </div>
            </div>

            <!-- Two-Column Results Grid (List + Map) -->
            <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:24px; align-items:start;">
              
              <!-- Left: Result Cards List -->
              <div style="display:grid; gap:16px;">
                
                <!-- Card 1 -->
                <div style="background:white; border:1px solid #e2e8f0; border-radius:12px; padding:24px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 4px rgba(0,0,0,0.02); transition:transform 0.2s, box-shadow 0.2s; cursor:pointer;" onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 16px -1px rgba(0,0,0,0.05)';" onmouseleave="this.style.transform='none'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.02)';">
                  <div style="display:flex; gap:16px; align-items:flex-start;">
                    <!-- Blue circular badge -->
                    <div style="width:24px; height:24px; border-radius:50%; background:#2563eb; color:white; font-size:12px; font-weight:bold; display:flex; align-items:center; justify-content:center; flex-shrink:0;">1</div>
                    <div>
                      <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                        <h5 style="margin:0; font-size:17px; font-weight:700; color:#1e293b;">OO대학교병원</h5>
                        <span style="background:#eff6ff; color:#2563eb; font-size:11px; font-weight:700; padding:2px 6px; border-radius:4px;">상급종합병원</span>
                      </div>
                      <p style="margin:0 0 8px 0; font-size:13px; color:#64748b; display:flex; align-items:center; gap:4px;">
                        📍 서울 강남구 테헤란로 123
                      </p>
                      <p style="margin:0 0 4px 0; font-size:13px; color:#475569;">
                        <strong style="color:#1e293b;">진료과:</strong> 내과, 외과, 정형외과, 신경외과, 소아청소년과 외 12개
                      </p>
                      <p style="margin:0; font-size:13px; color:#475569;">
                        <strong style="color:#1e293b;">특성화:</strong> 관절센터, 심뇌혈관센터
                      </p>
                    </div>
                  </div>
                  <div style="text-align:right; flex-shrink:0;">
                    <div style="font-size:14px; font-weight:700; color:#2563eb; margin-bottom:12px;">1.2km</div>
                    <button class="auth-btn btn-secondary" style="margin:0; padding:8px 16px; font-size:13px;" onclick="window.location.hash='#/portal/${client.id}/healthConsulting'">상세보기</button>
                  </div>
                </div>

                <!-- Card 2 -->
                <div style="background:white; border:1px solid #e2e8f0; border-radius:12px; padding:24px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 4px rgba(0,0,0,0.02); transition:transform 0.2s, box-shadow 0.2s; cursor:pointer;" onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 16px -1px rgba(0,0,0,0.05)';" onmouseleave="this.style.transform='none'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.02)';">
                  <div style="display:flex; gap:16px; align-items:flex-start;">
                    <div style="width:24px; height:24px; border-radius:50%; background:#2563eb; color:white; font-size:12px; font-weight:bold; display:flex; align-items:center; justify-content:center; flex-shrink:0;">2</div>
                    <div>
                      <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                        <h5 style="margin:0; font-size:17px; font-weight:700; color:#1e293b;">△△종합병원</h5>
                        <span style="background:#f0fdf4; color:#16a34a; font-size:11px; font-weight:700; padding:2px 6px; border-radius:4px;">종합병원</span>
                      </div>
                      <p style="margin:0 0 8px 0; font-size:13px; color:#64748b; display:flex; align-items:center; gap:4px;">
                        📍 서울 강남구 봉은사로 456
                      </p>
                      <p style="margin:0 0 4px 0; font-size:13px; color:#475569;">
                        <strong style="color:#1e293b;">진료과:</strong> 내과, 정형외과, 신경과, 재활의학과 외 8개
                      </p>
                      <p style="margin:0; font-size:13px; color:#475569;">
                        <strong style="color:#1e293b;">특성화:</strong> 관절센터, 척추센터
                      </p>
                    </div>
                  </div>
                  <div style="text-align:right; flex-shrink:0;">
                    <div style="font-size:14px; font-weight:700; color:#2563eb; margin-bottom:12px;">2.4km</div>
                    <button class="auth-btn btn-secondary" style="margin:0; padding:8px 16px; font-size:13px;" onclick="window.location.hash='#/portal/${client.id}/healthConsulting'">상세보기</button>
                  </div>
                </div>

                <!-- Card 3 -->
                <div style="background:white; border:1px solid #e2e8f0; border-radius:12px; padding:24px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 4px rgba(0,0,0,0.02); transition:transform 0.2s, box-shadow 0.2s; cursor:pointer;" onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 16px -1px rgba(0,0,0,0.05)';" onmouseleave="this.style.transform='none'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.02)';">
                  <div style="display:flex; gap:16px; align-items:flex-start;">
                    <div style="width:24px; height:24px; border-radius:50%; background:#2563eb; color:white; font-size:12px; font-weight:bold; display:flex; align-items:center; justify-content:center; flex-shrink:0;">3</div>
                    <div>
                      <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                        <h5 style="margin:0; font-size:17px; font-weight:700; color:#1e293b;">ㅁㅁ병원</h5>
                        <span style="background:#fdf2f8; color:#db2777; font-size:11px; font-weight:700; padding:2px 6px; border-radius:4px;">병원</span>
                      </div>
                      <p style="margin:0 0 8px 0; font-size:13px; color:#64748b; display:flex; align-items:center; gap:4px;">
                        📍 서울 강남구 언주로 789
                      </p>
                      <p style="margin:0 0 4px 0; font-size:13px; color:#475569;">
                        <strong style="color:#1e293b;">진료과:</strong> 내과, 정형외과, 마취통증의학과 외 5개
                      </p>
                      <p style="margin:0; font-size:13px; color:#475569;">
                        <strong style="color:#1e293b;">특성화:</strong> 통증센터
                      </p>
                    </div>
                  </div>
                  <div style="text-align:right; flex-shrink:0;">
                    <div style="font-size:14px; font-weight:700; color:#2563eb; margin-bottom:12px;">3.1km</div>
                    <button class="auth-btn btn-secondary" style="margin:0; padding:8px 16px; font-size:13px;" onclick="window.location.hash='#/portal/${client.id}/healthConsulting'">상세보기</button>
                  </div>
                </div>

              </div>

              <!-- Right: Interactive Vector Map Panel -->
              <div style="background:white; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05); position:sticky; top:20px;">
                <!-- Map Header Control -->
                <div style="background:#1e293b; color:white; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; font-size:13px; font-weight:600;">
                  <span>📍 강남구 역삼동 주변</span>
                  <button style="background:rgba(255,255,255,0.15); border:none; border-radius:4px; padding:4px 8px; color:white; font-size:11px; font-weight:600; cursor:pointer;">
                    검색 결과 범위 재설정
                  </button>
                </div>

                <!-- High-Fidelity Canvas/Grid Map Mockup -->
                <div style="height:380px; background:#f4f3f0; position:relative; overflow:hidden; border-bottom:1px solid #e2e8f0;">
                  <!-- Abstract Road Lines in Map -->
                  <div style="position:absolute; width:100%; height:100%; background-image: 
                    linear-gradient(90deg, transparent 49%, #e4e2db 50%, #e4e2db 52%, transparent 53%),
                    linear-gradient(0deg, transparent 49%, #e4e2db 50%, #e4e2db 52%, transparent 53%),
                    linear-gradient(45deg, transparent 39%, #eae8e1 40%, #eae8e1 42%, transparent 43%),
                    linear-gradient(-45deg, transparent 59%, #eae8e1 60%, #eae8e1 62%, transparent 63%);
                    background-size: 160px 160px; opacity:0.85;"></div>
                  
                  <!-- Green Park Shapes in Map -->
                  <div style="position:absolute; left:20%; top:15%; width:90px; height:80px; background:#d2f1d2; border-radius:24px; filter:blur(4px); opacity:0.65;"></div>
                  <div style="position:absolute; right:15%; bottom:20%; width:110px; height:90px; background:#d2f1d2; border-radius:30px; filter:blur(4px); opacity:0.65;"></div>
                  
                  <!-- Blue Han-River Han-River Grid at the top -->
                  <div style="position:absolute; width:100%; height:45px; top:0; background:#cde1f9; opacity:0.7; border-bottom:2px solid #b9d3f7;">
                    <div style="position:absolute; bottom:6px; left:20px; font-size:10px; font-weight:bold; color:#789cc7; letter-spacing:4px;">HAN RIVER (한강)</div>
                  </div>

                  <!-- Scattered Map Pins (corresponds to results and clusters) -->
                  <!-- Pin 1 -->
                  <div style="position:absolute; left:35%; top:45%; transform:translate(-50%, -50%); text-align:center;">
                    <div style="width:28px; height:28px; border-radius:50%; background:#2563eb; color:white; font-size:12px; font-weight:bold; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 3px 6px rgba(0,0,0,0.3); z-index:10; cursor:pointer;">1</div>
                    <div style="width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:8px solid #2563eb; margin: -2px auto 0; z-index:10;"></div>
                    <div style="background:rgba(30,41,59,0.85); color:white; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:600; margin-top:2px; white-space:nowrap; box-shadow:0 2px 4px rgba(0,0,0,0.15);">OO대학교병원</div>
                  </div>

                  <!-- Pin 2 -->
                  <div style="position:absolute; left:65%; top:65%; transform:translate(-50%, -50%); text-align:center;">
                    <div style="width:28px; height:28px; border-radius:50%; background:#16a34a; color:white; font-size:12px; font-weight:bold; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 3px 6px rgba(0,0,0,0.3); z-index:10; cursor:pointer;">2</div>
                    <div style="width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:8px solid #16a34a; margin: -2px auto 0; z-index:10;"></div>
                    <div style="background:rgba(30,41,59,0.85); color:white; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:600; margin-top:2px; white-space:nowrap; box-shadow:0 2px 4px rgba(0,0,0,0.15);">△△종합병원</div>
                  </div>

                  <!-- Pin 3 -->
                  <div style="position:absolute; left:48%; top:80%; transform:translate(-50%, -50%); text-align:center;">
                    <div style="width:28px; height:28px; border-radius:50%; background:#db2777; color:white; font-size:12px; font-weight:bold; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 3px 6px rgba(0,0,0,0.3); z-index:10; cursor:pointer;">3</div>
                    <div style="width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:8px solid #db2777; margin: -2px auto 0; z-index:10;"></div>
                    <div style="background:rgba(30,41,59,0.85); color:white; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:600; margin-top:2px; white-space:nowrap; box-shadow:0 2px 4px rgba(0,0,0,0.15);">ㅁㅁ병원</div>
                  </div>

                  <!-- Cluster Pin 13 -->
                  <div style="position:absolute; left:25%; top:68%; transform:translate(-50%, -50%);">
                    <div style="width:22px; height:22px; border-radius:50%; background:rgba(37,99,235,0.75); color:white; font-size:10px; font-weight:bold; display:flex; align-items:center; justify-content:center; border:1px solid white; cursor:pointer;">13</div>
                  </div>

                  <!-- Cluster Pin 38 -->
                  <div style="position:absolute; left:75%; top:35%; transform:translate(-50%, -50%);">
                    <div style="width:22px; height:22px; border-radius:50%; background:rgba(22,163,74,0.75); color:white; font-size:10px; font-weight:bold; display:flex; align-items:center; justify-content:center; border:1px solid white; cursor:pointer;">38</div>
                  </div>

                  <!-- Cluster Pin 19 -->
                  <div style="position:absolute; left:55%; top:50%; transform:translate(-50%, -50%);">
                    <div style="width:22px; height:22px; border-radius:50%; background:rgba(219,39,119,0.75); color:white; font-size:10px; font-weight:bold; display:flex; align-items:center; justify-content:center; border:1px solid white; cursor:pointer;">19</div>
                  </div>

                  <!-- Map Zoom Widget -->
                  <div style="position:absolute; right:12px; top:12px; display:flex; flex-direction:column; gap:4px; background:white; border-radius:6px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.15); border:1px solid #cbd5e1; z-index:20;">
                    <button style="width:30px; height:30px; border:none; background:white; font-size:16px; font-weight:bold; color:#475569; cursor:pointer; display:flex; align-items:center; justify-content:center; border-bottom:1px solid #f1f5f9;">+</button>
                    <button style="width:30px; height:30px; border:none; background:white; font-size:16px; font-weight:bold; color:#475569; cursor:pointer; display:flex; align-items:center; justify-content:center; border-bottom:1px solid #f1f5f9;">-</button>
                    <button style="width:30px; height:30px; border:none; background:white; font-size:14px; color:#475569; cursor:pointer; display:flex; align-items:center; justify-content:center;">🎯</button>
                  </div>
                </div>

                <!-- Map Legend -->
                <div style="background:#f8fafc; padding:12px 16px; display:flex; justify-content:space-between; gap:10px; font-size:11px; font-weight:600; color:#475569;">
                  <span style="display:flex; align-items:center; gap:4px;"><span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#2563eb;"></span> 상급종합병원</span>
                  <span style="display:flex; align-items:center; gap:4px;"><span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#16a34a;"></span> 종합병원</span>
                  <span style="display:flex; align-items:center; gap:4px;"><span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#db2777;"></span> 병원</span>
                  <span style="display:flex; align-items:center; gap:4px;"><span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#7c3aed;"></span> 의원</span>
                  <span style="display:flex; align-items:center; gap:4px;"><span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#f97316;"></span> 보건기관</span>
                </div>
              </div>

            </div>

          </div>
        `;
    } else if (isCheckupGroup) {
      if (!state.activeSubId) {
          detailContentHtml = `          <div class="checkup-wrapper fade-in" style="animation: fadeIn 0.4s ease;">
            <h3 style="font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 12px; margin-top: 0;">건강검진 예약</h3>
            <p style="color: #334155; line-height: 1.6; font-size: 15px; margin-bottom: 16px;">
              건강검진, 나에게 맞게 직접 선택하거나 전문가와 함께 설계하세요<br/>
              고객의 건강 상태와 필요에 따라 직접 검진을 선택할 수도, 전문 상담 간호사의 도움을 받아 맞춤형 검진을 설계할 수도 있는 건강검진 서비스를 제공합니다.
            </p>
            <p style="color: #64748b; line-height: 1.6; font-size: 14px; margin-bottom: 24px; padding: 24px; background: #f1f5f9; border-radius: 8px; margin-top: 0;">
              연령, 성별, 가족력, 생활습관 등을 고려한 전문 상담부터 원하는 병원과 검진 패키지를 직접 비교하고 예약하는 간편한 신청까지.<br/>
              고객의 방식으로 맞는 건강검진 경험을 제공합니다.
            </p>
            <button class="auth-btn btn-primary" style="padding: 12px 24px; font-size: 15px; font-weight: 700; width: auto; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer;" onclick="window.showCheckupSupportModal()">건강검진 예약하기</button>

            <!-- Form Area: 전화상담 신청 -->
            <div id="checkup-design-form-area" style="margin-top: 40px; padding-top: 40px; border-top: 1px solid #e2e8f0; animation: fadeIn 0.4s ease;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h4 style="font-size: 18px; font-weight: 700; color: #1e293b; margin: 0;">전화상담 신청</h4>
                <button class="auth-btn btn-secondary" style="margin: 0; padding: 6px 12px; font-size: 13px; font-weight: 600; background: white; border: 1px solid #cbd5e1; border-radius: 6px; color: #475569; cursor: pointer;" onclick="window.location.hash='#/portal/' + state.activeClient.id + '/' + state.activeSite.siteId + '/checkupAppt/checkupHistory'">상담 문의 이력</button>
              </div>
              <p style="color: #64748b; font-size: 14px; margin-bottom: 24px; margin-top: 0;">평소 염려되시는 부위나 건강검진 관련 목적을 기반으로 전문 간호사의 개별 상담 전화 프로세스가 연계됩니다.</p>

              <div class="consult-type-selector" style="margin-bottom: 20px; display: flex; gap: 24px;">
                <label class="custom-radio" style="display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #334155; cursor: pointer;">
                  <input type="radio" name="checkup-consult-type" value="phone" checked onclick="window.updateCheckupConsultType('phone')" style="width: 16px; height: 16px; accent-color: #2563eb;">
                  전화상담 신청
                </label>
                <label class="custom-radio" style="display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #334155; cursor: pointer;">
                  <input type="radio" name="checkup-consult-type" value="online" onclick="window.updateCheckupConsultType('online')" style="width: 16px; height: 16px; accent-color: #2563eb;">
                  온라인 문의 신청
                </label>
              </div>

              <div id="checkup-guidance-box" class="consulting-guide-box" style="margin-bottom: 24px; padding: 16px 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #475569;">
                <i style="display: block; margin-bottom: 6px; font-style: normal; font-weight: 700; color: #1e293b;">상담 가능 시간은 평일 오전 9시 ~ 오후 6시입니다.</i>
                <i style="display: block; font-style: normal;">상담을 원하시는 날짜와 시간대를 선택하시고, 상담받고 싶은 내용을 간단히 작성해 주세요. 남겨주신 내용을 확인한 후 간호사가 직접 전화드리겠습니다.</i>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div class="form-group">
                  <label style="display: block; margin-bottom: 8px; font-weight: 600; font-size: 14px; color: #334155;">상담 고객 성함</label>
                  <input type="text" id="checkup-name" class="form-input" value="${state.currentUser.name}" readonly style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; background: #f1f5f9; font-size: 14px; color: #64748b; outline: none;">
                </div>
                <div class="form-group">
                  <label style="display: block; margin-bottom: 8px; font-weight: 600; font-size: 14px; color: #334155;">연락처 (핸드폰)</label>
                  <input type="tel" id="checkup-phone" class="form-input" placeholder="상담을 수신할 연락처를 입력해 주세요." style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
                </div>
              </div>

              <div id="checkup-phone-fields" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div class="form-group">
                  <label style="display: block; margin-bottom: 8px; font-weight: 600; font-size: 14px; color: #334155;">상담 희망 일자</label>
                  <input type="date" id="checkup-date" class="form-input" min="${new Date().toISOString().split('T')[0]}" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
                </div>
                <div class="form-group">
                  <label style="display: block; margin-bottom: 8px; font-weight: 600; font-size: 14px; color: #334155;">상담 희망 시간</label>
                  <select id="checkup-time" class="form-input" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; background: white; font-size: 14px; outline: none;">
                    <option value="anytime">전일 (언제든 통화 가능)</option>
                    <option value="09:00">09:00</option><option value="10:00">10:00</option><option value="11:00">11:00</option><option value="12:00">12:00</option>
                    <option value="13:00">13:00</option><option value="14:00">14:00</option><option value="15:00">15:00</option><option value="16:00">16:00</option><option value="17:00">17:00</option>
                  </select>
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 24px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; font-size: 14px; color: #334155;">염려되시는 건강 우려사항 / 가족력 / 이전 질환 등</label>
                <textarea id="checkup-memo" class="form-input" placeholder="예) 최근 혈압이 높아져 심혈관 정밀검사가 필요합니다 / 암 가족력이 있습니다" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; min-height: 120px; resize: vertical; font-size: 14px; outline: none;"></textarea>
              </div>

              <button onclick="submitCheckupDesign()" class="auth-btn btn-primary" style="width: 100%; padding: 14px; background: #2563eb; color: white; border: none; font-weight: 700; border-radius: 8px; font-size: 15px; cursor: pointer;">신청하기</button>
            </div>
          </div>

        `;      } else if (state.activeSubId === 'checkupPreferred' || decodeURIComponent(state.activeSubId || '').includes('우대예약') || pageTitle.includes('우대예약') || state.activeSubId === 'checkupCorporate' || state.activeSubId === 'checkupWelfare' || decodeURIComponent(state.activeSubId || '').includes('회사지원') || pageTitle.includes('회사지원')) {
        const isCompanySupport = state.activeSubId === 'checkupCorporate' || state.activeSubId === 'checkupWelfare' || decodeURIComponent(state.activeSubId || '').includes('회사지원') || pageTitle.includes('회사지원');
        
        const bannerBadgeHtml = isCompanySupport ? '회사지원 건강검진' : '건강검진 우대예약';
        const bannerTitleHtml = isCompanySupport ? `
          <div style="font-size: 32px; font-weight: 850; color: #0f172a; line-height: 1.35; letter-spacing: -1px; margin-bottom: 16px; margin-top: 0;">
            제휴 병원의 건강검진 프로그램을<br/><span style="color: #2F4A9A;">회사 지원 혜택과 함께 이용해보세요.</span>
          </div>
          <div style="font-size: 16px; color: #475569; line-height: 1.6; white-space: pre-line;">
            기업 복지 혜택이 적용된 건강검진 서비스를 제공하며,
            간편한 예약과 편리한 검진 이용을 지원합니다.
          </div>
        ` : `
          <div style="font-size: 32px; font-weight: 850; color: #0f172a; line-height: 1.35; letter-spacing: -1px; margin-bottom: 16px; margin-top: 0;">
            다양한 제휴 병원의<br/>건강검진 프로그램을<br/><span style="color: #2F4A9A;">우대 혜택과 함께 편리하게 이용해보세요.</span>
          </div>
          <div style="font-size: 16px; color: #475569; line-height: 1.6;">
            검진 비용은 고객이 병원에 직접 결제하며,<br/>예약 및 이용 편의를 제공합니다.
          </div>
        `;

        const hospitals = [
          { num: 1, name: '포항세명기독병원', pkg: '기본형', price: '350,000', discount: '20%', loc: '강북구' },
          { num: 2, name: '우리허브병원', pkg: '정밀형', price: '300,000', discount: '15%', loc: '송파구' },
          { num: 3, name: '안동병원', pkg: '프리미엄형', price: '300,000', discount: '10%', loc: '종로구' },
          { num: 4, name: '강남베스트병원', pkg: '기본형', price: '280,000', discount: '20%', loc: '강남구' },
          { num: 5, name: '서울프라임검진센터', pkg: 'VIP형', price: '270,000', discount: '18%', loc: '서초구' },
          { num: 6, name: '부산시티병원', pkg: '정밀형', price: '260,000', discount: '15%', loc: '부산진구' },
          { num: 7, name: '대구웰니스병원', pkg: '기본형', price: '250,000', discount: '12%', loc: '수성구' },
          { num: 8, name: '인천메디컬센터', pkg: '프리미엄형', price: '240,000', discount: '10%', loc: '연수구' }
        ];

        const hospitalGridHtml = hospitals.map(h => {
          let displayPrice = h.price;
          if (isCompanySupport) {
            const originalVal = parseInt(h.price.replace(/,/g, ''), 10);
            const newVal = Math.max(0, originalVal - 300000);
            displayPrice = newVal.toLocaleString();
          }
          return `
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; position: relative; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); transition: transform 0.2s; cursor: pointer;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
              <!-- Number Badge -->
              <div style="position: absolute; top: 24px; left: 24px; background: #2F4A9A; color: white; width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; z-index: 1;">${h.num}</div>
              
              <div style="display: flex; gap: 20px; margin-bottom: 24px;">
                <!-- Image Placeholder -->
                <div style="width: 120px; height: 120px; border-radius: 12px; background: #f1f5f9; overflow: hidden; flex-shrink: 0; position: relative;">
                  <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #cbd5e1;">
                    <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="M21 15l-5-5L5 21"></path></svg>
                  </div>
                </div>
                
                <!-- Info -->
                <div style="flex: 1; padding-top: 4px;">
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <h4 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0;">${h.name} <span style="font-size: 15px; color: #64748b; font-weight: 600;">- ${h.pkg}</span></h4>
                  </div>
                  
                  <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 12px;">
                    <span style="font-size: 20px; font-weight: 800; color: #2F4A9A;">${displayPrice}원</span>
                  </div>
                  
                  <div style="display: flex; align-items: center; gap: 12px; font-size: 13px; color: #64748b;">
                    <span style="display: flex; align-items: center; gap: 4px;"><svg width="14" height="14" fill="none" stroke="#3b82f6" stroke-width="2" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"></rect><path d="M10 10h4v4h-4z"></path></svg> 주차가능</span>
                    <span style="display: flex; align-items: center; gap: 4px;"><svg width="14" height="14" fill="none" stroke="#94a3b8" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> ${h.loc}</span>
                  </div>
                  
                  <div style="margin-top: 12px; color: #2563eb; font-size: 13px; font-weight: 700; line-height: 1.5;">
                    2026년 대장내시경 마감
                  </div>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div style="display: flex; gap: 8px;" onclick="window.handleHospitalAction(event, '${h.name}', '${h.pkg}')">
                <button class="hospital-action-btn" data-action="info" style="flex: 1; padding: 10px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">병원정보</button>
                <button class="hospital-action-btn" data-action="checkup" style="flex: 1; padding: 10px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">검진항목</button>
                <button class="hospital-action-btn" data-action="schedule" style="flex: 1; padding: 10px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">일정보기</button>
                <button class="hospital-action-btn" data-action="reserve" style="flex: 1; padding: 10px; background: #2F4A9A; border: 1px solid #2F4A9A; border-radius: 8px; font-size: 13px; font-weight: 700; color: white; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#1e3a8a'" onmouseout="this.style.background='#2F4A9A'">검진예약</button>
              </div>
            </div>
          `;
        }).join('');

        detailContentHtml = `
          <div class="cp-wrapper fade-in" style="animation: fadeIn 0.4s ease;">
            
            <!-- Hero Banner -->
            <div class="cp-hero" style="background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%); border-radius: 20px; padding: 48px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; position: relative; overflow: hidden; border: 1px solid #e2e8f0;">
              <div style="flex: 1; z-index: 2;">
                <div style="display: inline-flex; align-items: center; gap: 6px; background: white; color: #3b82f6; font-weight: 700; font-size: 14px; padding: 8px 16px; border-radius: 20px; margin-bottom: 16px; border: 1px solid #bfdbfe; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                  <span style="color: #3b82f6;">★</span> ${bannerBadgeHtml}
                </div>
                ${bannerTitleHtml}
              </div>
              <div style="flex-shrink: 0; z-index: 2;">
                <img src="./images/checkup_preferred_hero.png" alt="${bannerBadgeHtml}" style="max-height: 240px; border-radius: 12px;" onerror="this.style.display='none'">
              </div>
            </div>
            <!-- Search Filter Bar (Advanced UI matching mockup) -->
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 20px; margin-bottom: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
              
              <!-- Row 1: Area, Date, Tests -->
              <div style="display: flex; gap: 16px; align-items: flex-start;">
                
                <!-- Region -->
                <div style="flex: 1;">
                  <div style="font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 6px;">지역</div>
                  <select class="form-input" style="width: 100%; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; color: #1e293b; background: #fff; cursor: pointer;">
                    <option>전체</option>
                  </select>
                </div>
                
                <!-- Region Detail -->
                <div style="flex: 1;">
                  <div style="font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 6px;">지역상세</div>
                  <select class="form-input" style="width: 100%; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; color: #1e293b; background: #fff; cursor: pointer;">
                    <option>전체</option>
                  </select>
                </div>
                
                <!-- Date -->
                <div style="flex: 1.5;">
                  <div style="font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 6px;">희망일자</div>
                  <div style="position: relative;">
                    <input type="text" placeholder="검사 희망일자 선택" onfocus="this.type='date'" onblur="if(!this.value) this.type='text'" style="width: 100%; padding: 12px 40px 12px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; color: #475569; background: #fff; cursor: pointer; outline: none;">
                    <svg width="20" height="20" fill="none" stroke="#64748b" stroke-width="2" viewBox="0 0 24 24" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none;">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                </div>
                
                <!-- Desired Test -->
                <div style="flex: 2;">
                  <div style="font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 6px;">희망검사 (복수선택)</div>
                  <div style="position: relative;">
                    <div style="width: 100%; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; background: #fff; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="const m=this.nextElementSibling; m.style.display=m.style.display==='block'?'none':'block';">
                      <span style="color: #475569;">검사선택안함 (클릭하여 선택)</span>
                      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
                    </div>
                    <!-- Dropdown List -->
                    <div style="display: none; position: absolute; top: 100%; left: 0; width: 100%; margin-top: 4px; background: white; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); z-index: 100; max-height: 200px; overflow-y: auto;">
                      ${['NK세포활성도', '대장내시경', '위내시경', '상복부초음파', '갑상선초음파', '전립선초음파(남)', '골반초음파(여)', '신장초음파', '폐CT', '뇌MRI'].map(test => `
                        <label style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; cursor: pointer; border-bottom: 1px solid #f1f5f9; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">
                          <input type="checkbox" style="cursor: pointer;">
                          <span style="font-size: 14px; color: #334155;">${test}</span>
                        </label>
                      `).join('')}
                    </div>
                  </div>
                  <!-- Selected Tags Area -->
                  <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;">
                    <span style="background: #e0e7ff; color: #2563eb; font-size: 12px; font-weight: 700; padding: 6px 10px; border-radius: 12px; display: inline-flex; align-items: center; gap: 4px;">대장내시경 <span style="cursor: pointer; opacity: 0.7;">&times;</span></span>
                    <span style="background: #e0e7ff; color: #2563eb; font-size: 12px; font-weight: 700; padding: 6px 10px; border-radius: 12px; display: inline-flex; align-items: center; gap: 4px;">상복부초음파 <span style="cursor: pointer; opacity: 0.7;">&times;</span></span>
                  </div>
                </div>
              </div>

              <!-- Row 2: Bottom Search & Buttons -->
              <div style="display: flex; gap: 12px; align-items: center;">
                <div style="flex: 1; position: relative;">
                  <input type="text" placeholder="병원명으로 검색하세요." style="width: 100%; padding: 14px 16px 14px 48px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; outline: none;">
                  <svg width="20" height="20" fill="none" stroke="#64748b" stroke-width="2" viewBox="0 0 24 24" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%);">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                  </svg>
                </div>
                <div style="flex-shrink: 0; display: flex; gap: 8px;">
                  <button onclick="window.handleLocationSearch()" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 20px; background: white; border: 1px solid #bfdbfe; color: #2F4A9A; font-weight: 700; border-radius: 8px; font-size: 15px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    내 주변 검색
                  </button>
                  <button style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 32px; background: #2563eb; border: 1px solid #2563eb; color: white; font-weight: 700; border-radius: 8px; font-size: 15px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="M21 21l-4.35-4.35"></path>
                    </svg>
                    검색
                  </button>
                </div>
              </div>
            </div>

            <!-- List Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <div style="font-size: 16px; color: #475569;">검색 결과 <span style="font-weight: 800; color: #1e293b;">127건</span></div>
              <select style="padding: 8px 16px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; color: #475569; background: white; cursor: pointer; outline: none;">
                <option>우대율 높은 순</option>
              </select>
            </div>

            <!-- Hospital Grid -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 40px;">
              ${hospitalGridHtml}
            </div>

            <!-- Footer Banner -->
            <div style="background: #f0f7ff; border-radius: 12px; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); color: #3b82f6;">
                  <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 10h18"></path><circle cx="17" cy="15" r="1" fill="currentColor"></circle></svg>
                </div>
                <div>
                  <div style="font-weight: 800; color: #0f172a; font-size: 16px; margin-bottom: 4px;">검진 비용은 고객이 병원에 직접 결제합니다.</div>
                  <div style="font-size: 14px; color: #64748b;">표시된 비용은 각 의료기관의 우대가가 적용된 금액이며, 예약 확정 후 병원에서 직접 결제해주세요.</div>
                </div>
              </div>
              <div style="color: #94a3b8;">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg>
              </div>
            </div>

          </div>
        `;
      } else if (state.activeSubId === 'consent') {
        detailContentHtml = `
          <div class="consent-wrapper fade-in" style="animation: fadeIn 0.4s ease; max-width: 600px; margin: 0 auto; padding: 40px 0;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
              <span style="background: #2563eb; color: white; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 4px;">STEP 1</span>
              <span style="font-size: 14px; font-weight: 700; color: #475569;">약관 및 개인정보 동의</span>
            </div>
            <h2 style="font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1.4; margin-bottom: 12px;">
              건강검진 예약 서비스를<br/>이용하기 위해 아래 동의가 필요합니다.
            </h2>
            <p style="font-size: 15px; color: #64748b; margin-bottom: 40px;">모든 필수 항목에 동의해야 다음 단계로 이동할 수 있습니다.</p>


            <div style="display: flex; flex-direction: column; gap: 12px;">
              <!-- Accordion 1 -->
              <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: white;">
                <label style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; cursor: pointer; user-select: none;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <input type="checkbox" class="consent-req-chk" style="width: 20px; height: 20px; accent-color: #2563eb;" onchange="window.toggleConsentDetail(this, 'detail-1')">
                    <span style="font-size: 15px; font-weight: 700; color: #334155;"><span style="color: #ef4444;">[필수]</span> 개인정보 수집 및 이용 동의</span>
                  </div>
                  <svg id="icon-1" width="20" height="20" fill="none" stroke="#94a3b8" stroke-width="2" viewBox="0 0 24 24" style="transition: transform 0.2s;"><path d="M6 9l6 6 6-6"></path></svg>
                </label>
                <div id="detail-1" style="display: none; padding: 0 20px 20px; border-top: 1px solid #e2e8f0; background: #f8fafc;">
                   <div style="padding-top: 16px; font-size: 13px; color: #475569; line-height: 1.6; max-height: 200px; overflow-y: auto;">
                     건강검진 우대예약 서비스 제공을 위해 아래와 같이 개인정보를 수집·이용합니다.<br><br>
                     1) 수집 및 이용 목적<br>
                     - 건강검진 우대예약 신청 및 접수<br>
                     - 검진기관 예약 진행 및 본인 확인<br>
                     - 예약 일정 안내 및 상담 서비스 제공<br>
                     - 예약 변경 및 취소 처리<br>
                     - 고객사 및 제휴서비스 이용 고객 대상 건강검진 서비스 운영 및 관리<br><br>
                     2) 수집 항목<br>
                     [필수항목]<br>
                     - 이름, 생년월일, 성별, 휴대전화번호, 이메일 주소, 검진 물품 수령 주소, 고객사명 또는 제휴서비스 정보, 회원/멤버십 가입 여부 및 신청자와의 관계, 희망 검진기관, 희망 예약일시<br><br>
                     [서비스 이용 과정에서 자동 생성 정보]<br>
                     - 접속 IP, 쿠키(Cookie), 접속 로그, 기기정보, 브라우저 정보<br><br>
                     3) 보유 및 이용기간<br>
                     - 정보 제공 동의일로부터 5년<br>
                     - 단, 기업소속인 경우 기업과의 계약기간까지<br><br>
                     4) 동의 거부 권리 및 불이익 안내<br>
                     이용자는 개인정보 수집·이용 동의를 거부할 권리가 있습니다.<br>
                     다만, 필수항목에 대한 동의를 거부할 경우 건강검진 우대예약 서비스 이용이 제한될 수 있습니다.
                   </div>
                </div>
              </div>

              <!-- Accordion 2 -->
              <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: white;">
                <label style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; cursor: pointer; user-select: none;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <input type="checkbox" class="consent-req-chk" style="width: 20px; height: 20px; accent-color: #2563eb;" onchange="window.toggleConsentDetail(this, 'detail-2')">
                    <span style="font-size: 15px; font-weight: 700; color: #334155;"><span style="color: #ef4444;">[필수]</span> 민감정보 수집 및 이용 동의</span>
                  </div>
                  <svg id="icon-2" width="20" height="20" fill="none" stroke="#94a3b8" stroke-width="2" viewBox="0 0 24 24" style="transition: transform 0.2s;"><path d="M6 9l6 6 6-6"></path></svg>
                </label>
                <div id="detail-2" style="display: none; padding: 0 20px 20px; border-top: 1px solid #e2e8f0; background: #f8fafc;">
                   <div style="padding-top: 16px; font-size: 13px; color: #475569; line-height: 1.6; max-height: 200px; overflow-y: auto;">
                     건강검진 우대예약 서비스 제공을 위해 아래와 같이 민감정보를 수집·이용합니다.<br><br>
                     1) 수집 및 이용 목적<br>
                     - 건강검진 예약 진행<br>
                     - 검진 가능 여부 확인<br>
                     - 검진 항목 상담 및 예약 서비스 제공<br>
                     - 검진 관련 고객 응대<br><br>
                     2) 수집 항목<br>
                     [민감정보]<br>
                     - 건강검진 희망 항목, 문진 정보, 질환 관련 정보, 건강 상태 관련 정보, 기타 건강검진 예약 진행에 필요한 정보<br><br>
                     3) 보유 및 이용기간<br>
                     수집된 민감정보는 건강검진 예약 서비스 제공 완료 후 1년간 보관하며, 관계 법령에 따라 보관이 필요한 경우 해당 법령에서 정한 기간 동안 보관합니다.<br><br>
                     4) 동의 거부 권리 및 불이익 안내<br>
                     이용자는 민감정보 수집·이용 동의를 거부할 권리가 있습니다.<br>
                     다만, 동의를 거부할 경우 건강검진 우대예약 서비스 이용이 제한될 수 있습니다.
                   </div>
                </div>
              </div>

              <!-- Accordion 3 -->
              <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: white;">
                <label style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; cursor: pointer; user-select: none;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <input type="checkbox" class="consent-req-chk" style="width: 20px; height: 20px; accent-color: #2563eb;" onchange="window.toggleConsentDetail(this, 'detail-3')">
                    <span style="font-size: 15px; font-weight: 700; color: #334155;"><span style="color: #ef4444;">[필수]</span> 개인정보 제3자 제공 동의</span>
                  </div>
                  <svg id="icon-3" width="20" height="20" fill="none" stroke="#94a3b8" stroke-width="2" viewBox="0 0 24 24" style="transition: transform 0.2s;"><path d="M6 9l6 6 6-6"></path></svg>
                </label>
                <div id="detail-3" style="display: none; padding: 0 20px 20px; border-top: 1px solid #e2e8f0; background: #f8fafc;">
                   <div style="padding-top: 16px; font-size: 13px; color: #475569; line-height: 1.6; max-height: 200px; overflow-y: auto;">
                     회사는 건강검진 예약 진행을 위하여 아래와 같이 개인정보를 제3자에게 제공합니다.<br><br>
                     1) 제공받는 자<br>
                     - 제휴 건강검진기관 및 병원 (예약 신청 검진기관)<br><br>
                     2) 제공 목적<br>
                     - 건강검진 예약 접수 및 진행, 예약 확인 및 본인 확인, 검진 일정 안내 및 상담 진행<br><br>
                     3) 제공 항목<br>
                     - 이름, 생년월일, 성별, 휴대전화번호, 이메일 주소, 검진 물품 수령 주소, 고객사명 또는 제휴서비스 정보, 회원/멤버십 가입 여부 및 신청자와의 관계, 희망 검진기관, 희망 예약일시<br><br>
                     4) 보유 및 이용기간<br>
                     제공된 개인정보는 건강검진 예약 및 검진 시행 완료 시까지 보관·이용되며, 관계 법령에 따라 보관이 필요한 경우 해당 법령에서 정한 기간 동안 보관합니다.<br><br>
                     5) 동의 거부 권리 및 불이익 안내<br>
                     이용자는 개인정보 제3자 제공 동의를 거부할 권리가 있습니다.<br>
                     다만, 동의를 거부할 경우 건강검진 우대예약 서비스 이용이 제한될 수 있습니다.
                   </div>
                </div>
              </div>

              <!-- Accordion 4 -->
              <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: white;">
                <label style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; cursor: pointer; user-select: none;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <input type="checkbox" class="consent-req-chk" style="width: 20px; height: 20px; accent-color: #2563eb;" onchange="window.toggleConsentDetail(this, 'detail-4')">
                    <span style="font-size: 15px; font-weight: 700; color: #334155;"><span style="color: #ef4444;">[필수]</span> 민감정보 제3자 제공 동의</span>
                  </div>
                  <svg id="icon-4" width="20" height="20" fill="none" stroke="#94a3b8" stroke-width="2" viewBox="0 0 24 24" style="transition: transform 0.2s;"><path d="M6 9l6 6 6-6"></path></svg>
                </label>
                <div id="detail-4" style="display: none; padding: 0 20px 20px; border-top: 1px solid #e2e8f0; background: #f8fafc;">
                   <div style="padding-top: 16px; font-size: 13px; color: #475569; line-height: 1.6; max-height: 200px; overflow-y: auto;">
                     회사는 건강검진 예약 진행을 위하여 아래와 같이 민감정보를 제3자에게 제공합니다.<br><br>
                     1) 제공받는 자<br>
                     - 제휴 건강검진기관 및 병원(예약 신청 검진기관)<br><br>
                     2) 제공 목적<br>
                     - 건강검진 예약 진행, 검진 가능 여부 확인, 검진 항목 상담 및 예약 서비스 제공<br><br>
                     3) 제공 항목<br>
                     - 건강검진 희망 항목, 문진 정보, 질환 관련 정보, 건강 상태 관련 정보, 기타 건강검진 예약 진행에 필요한 정보<br><br>
                     4) 보유 및 이용기간<br>
                     제공된 민감정보는 건강검진 예약 및 검진 진행 완료 시까지 보관·이용되며, 관계 법령에 따라 보관이 필요한 경우 해당 법령에서 정한 기간 동안 보관합니다.<br><br>
                     5) 동의 거부 권리 및 불이익 안내<br>
                     이용자는 민감정보 제3자 제공 동의를 거부할 권리가 있습니다.<br>
                     다만, 동의를 거부할 경우 건강검진 우대예약 서비스 이용이 제한될 수 있습니다.
                   </div>
                </div>
              </div>
            </div>
            <div style="font-size: 16px; font-weight: 800; color: #1e293b; margin-top: 24px; display: flex; align-items: center; gap: 8px; border-top: 1px solid #e2e8f0; padding-top: 24px;">
              <input type="checkbox" id="chk-all-consent" style="width: 22px; height: 22px; accent-color: #2563eb; cursor: pointer;" onchange="window.toggleAllConsent(this.checked)">
              <label for="chk-all-consent" style="cursor: pointer; font-size: 16px;">전체 약관에 동의합니다.</label>
            </div>

            <div style="display: flex; gap: 12px; margin-top: 24px;">
              <button onclick="window.history.back()" style="flex: 1; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; color: #475569; font-size: 16px; font-weight: 700; cursor: pointer;">이전</button>
              <button id="btn-next-consent" disabled onclick="window.submitCheckupConsent()" style="flex: 1; padding: 16px; border-radius: 8px; border: none; background: #94a3b8; color: white; font-size: 16px; font-weight: 700; cursor: not-allowed; transition: background 0.2s;">다음</button>
            </div>
          </div>
        `;
      } else if (state.activeSubId === 'checkup-target') {
        const hospitalName = sessionStorage.getItem('selectedHospital') || '선택된 병원 없음';
        detailContentHtml = `
          <div class="target-wrapper fade-in" style="animation: fadeIn 0.4s ease; max-width: 600px; margin: 0 auto; padding: 40px 0;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
              <span style="background: #2563eb; color: white; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 4px;">STEP 2</span>
              <span style="font-size: 14px; font-weight: 700; color: #475569;">검진대상자 선택</span>
            </div>
            <h2 style="font-size: 24px; font-weight: 800; color: #0f172a; line-height: 1.4; margin-bottom: 24px;">
              [${hospitalName}]<br/>검진대상자의 정보를 입력해주세요.
            </h2>
            
            <div style="display: flex; flex-direction: column; gap: 24px;">
              <!-- 검진신청자 -->
              <div>
                <label style="display: block; font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">검진신청자 <span style="color: #ef4444;">*</span></label>
                <input type="text" value="${state.currentUser ? state.currentUser.name : ''}" readonly style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #f8fafc; font-size: 15px; color: #475569;">
              </div>
              
              <!-- 검진대상자 -->
              <div>
                <label style="display: block; font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">검진대상자 <span style="color: #ef4444;">*</span></label>
                <input type="text" id="target-name" placeholder="실명 입력" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 15px; color: #0f172a; margin-bottom: 12px;">
                <div style="display: flex; gap: 16px;">
                  <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                    <input type="radio" name="target-type" value="self" onclick="window.toggleCheckupTarget('self')" style="width: 18px; height: 18px; accent-color: #17B890;">
                    <span style="font-size: 14px; color: #334155;">검진신청자와 동일</span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                    <input type="radio" name="target-type" value="family" onclick="window.toggleCheckupTarget('family')" style="width: 18px; height: 18px; accent-color: #17B890;">
                    <span style="font-size: 14px; color: #334155;">가족</span>
                  </label>
                </div>
              </div>
              
              <!-- 추가 정보 -->
              <div id="target-info-fields" style="display: none; flex-direction: column; gap: 24px;">
                <div>
                  <label style="display: block; font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">생년월일 <span style="color: #ef4444;">*</span></label>
                  <input type="text" id="target-birth" placeholder="생년월일 8자리" maxlength="8" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 15px; color: #0f172a; margin-bottom: 12px;">
                  <div style="display: flex; gap: 16px;">
                    <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                      <input type="radio" name="target-gender" value="M" style="width: 18px; height: 18px; accent-color: #17B890;">
                      <span style="font-size: 14px; color: #334155;">남성</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                      <input type="radio" name="target-gender" value="F" style="width: 18px; height: 18px; accent-color: #17B890;">
                      <span style="font-size: 14px; color: #334155;">여성</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label style="display: block; font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">휴대폰번호 <span style="color: #ef4444;">*</span></label>
                  <input type="text" id="target-phone" placeholder="'-' 없이 입력" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 15px; color: #0f172a;">
                </div>
                
                <div>
                  <label style="display: block; font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">주소 <span style="color: #ef4444;">*</span></label>
                  <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                    <input type="text" id="target-addr1" readonly style="flex: 1; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #f8fafc; font-size: 15px; color: #0f172a;">
                    <button style="padding: 0 16px; border: 1px solid #64748b; background: white; border-radius: 6px; font-size: 14px; color: #334155; cursor: pointer;">주소찾기</button>
                  </div>
                  <input type="text" id="target-addr2" placeholder="상세 주소 입력" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 15px; color: #0f172a;">
                </div>
              </div>
            </div>

            <div style="display: flex; gap: 12px; margin-top: 40px;">
              <button onclick="window.history.back()" style="flex: 1; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; color: #475569; font-size: 16px; font-weight: 700; cursor: pointer;">이전 단계</button>
              <button onclick="if(window.saveCheckupTargetInfo) window.saveCheckupTargetInfo(); window.location.hash='#/portal/${state.activeClient.id}/${state.activeSite.siteId}/${state.activeMenuId}/checkup-items';" style="flex: 1; padding: 16px; border-radius: 8px; border: none; background: #2563eb; color: white; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.2s;">다음 단계</button>
            </div>
          </div>
        `;
      } else if (state.activeSubId === 'checkup-items') {
        detailContentHtml = `
          <div class="items-wrapper fade-in" style="animation: fadeIn 0.4s ease; max-width: 900px; margin: 0 auto; padding: 40px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="background: #2563eb; color: white; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 4px;">STEP 3</span>
                <span style="font-size: 14px; font-weight: 700; color: #475569;">검진항목 선택</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <button onclick="window.showPastHistoryModal()" style="padding: 8px 16px; background: white; color: #1e293b; font-size: 14px; font-weight: 700; border: 1px solid #cbd5e1; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                  과거검진신청이력
                </button>
              </div>
            </div>

            <!-- 기본검사 -->
            <div style="border: 1px solid #e2e8f0; border-radius: 12px; background: white; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
              <div style="padding: 24px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="const d = this.parentElement.querySelector('.basic-detail'); d.style.display = d.style.display === 'none' ? 'block' : 'none';">
                <div>
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                    <h3 style="margin: 0; font-size: 20px; font-weight: 800; color: #0f172a;">기본검사</h3>
                  </div>
                  <div style="font-size: 14px; color: #64748b;">상품에 포함된 기본 검사 항목입니다.</div>
                </div>
                <div style="display: flex; align-items: center; gap: 16px;">
                  <span style="font-size: 14px; font-weight: 600; color: #475569;">총 95항목</span>
                  <svg width="24" height="24" fill="none" stroke="#94a3b8" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
                </div>
              </div>
              
              <!-- 상시 노출 영역 (장비검사) -->
              <div style="padding: 0 24px 24px;">
                <div style="font-size: 15px; font-weight: 700; color: #334155; margin-bottom: 16px; display: flex; align-items: center; gap: 6px;">
                  <span style="background: #e0f2fe; color: #2563eb; font-size: 12px; font-weight: 700; padding: 4px 8px; border-radius: 12px;">기본항목에 포함된 장비검사</span> <svg width="16" height="16" fill="none" stroke="#94a3b8" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 12px;">
                  <span style="padding: 12px 16px; border: 1px solid #f1f5f9; border-radius: 8px; font-size: 14px; font-weight: 600; color: #475569; background: white;">위장조영 촬영(UGI)</span>
                  <span style="padding: 12px 16px; border: 1px solid #f1f5f9; border-radius: 8px; font-size: 14px; font-weight: 600; color: #475569; background: white;">갑상선 초음파</span>
                  <span style="padding: 12px 16px; border: 1px solid #f1f5f9; border-radius: 8px; font-size: 14px; font-weight: 600; color: #475569; background: white;">심장 초음파</span>
                  <span style="padding: 12px 16px; border: 1px solid #f1f5f9; border-radius: 8px; font-size: 14px; font-weight: 600; color: #475569; background: white;">복부 초음파</span>
                  <span style="padding: 12px 16px; border: 1px solid #f1f5f9; border-radius: 8px; font-size: 14px; font-weight: 600; color: #475569; background: white;">유방 초음파(여)</span>
                  <span style="padding: 12px 16px; border: 1px solid #f1f5f9; border-radius: 8px; font-size: 14px; font-weight: 600; color: #475569; background: white;">전립선 초음파(남)</span>
                  <span style="padding: 12px 16px; border: 1px solid #f1f5f9; border-radius: 8px; font-size: 14px; font-weight: 600; color: #475569; background: white;">신장 초음파</span>
                </div>
              </div>

              <!-- 아코디언 상세 영역 -->
              <div class="basic-detail" style="display: none; padding: 0; border-top: 1px solid #e2e8f0; background: #f8fafc;">
                 <div style="padding: 24px;">
                   <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #334155; font-size: 14px; font-weight: 600; line-height: 1.6;">
                     <li style="list-style-type: disc;">본 검진패키지에는 다음의 검사항목이 모두 포함됩니다.</li>
                   </ul>
                   <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 14px; border-top: 2px solid #cbd5e1; background: white;">
                     <thead style="background: #f8fafc; font-weight: 700; color: #334155;">
                       <tr>
                         <th style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; width: 15%;">구분</th>
                         <th style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; width: 25%;">검사항목</th>
                         <th style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; width: 45%;">항목설명</th>
                         <th style="padding: 12px 8px; border-bottom: 1px solid #e2e8f0; width: 15%;">비고</th>
                       </tr>
                     </thead>
                     <tbody style="color: #475569;">
                       <tr>
                         <td rowspan="5" style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 700; vertical-align: middle;">신체계측</td>
                         <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0;">신장</td>
                         <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; text-align: left;">신체의 길이나 발육을 나타내는 대표적인 기준</td>
                         <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"></td>
                       </tr>
                       <tr>
                         <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0;">체중</td>
                         <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; text-align: left;">하루 동안에도 변동하며, 음식물섭취, 배설 등의 조건에 의해 변화</td>
                         <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"></td>
                       </tr>
                       <tr>
                         <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0;">허리둘레</td>
                         <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; text-align: left;">허리둘레측정</td>
                         <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"></td>
                       </tr>
                       <tr>
                         <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0;">비만도</td>
                         <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; border-right: 1px solid #e2e8f0; text-align: left;">과다한 체지방을 가진 상태를 의미</td>
                         <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"></td>
                       </tr>
                       <tr>
                         <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">문진</td>
                         <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; text-align: left;">과거병력 및 현재의 신체 상태 체크</td>
                         <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"></td>
                       </tr>
                       <tr>
                         <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 700; vertical-align: middle;">체성분분석</td>
                         <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">체성분검사</td>
                         <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; text-align: left;">근육량, 체지방량, 수분량 등 신체균형</td>
                         <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"></td>
                       </tr>
                       <tr>
                         <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 700; vertical-align: middle;">안과검사</td>
                         <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">시력, 안저, 안압</td>
                         <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; text-align: left;">근시/원시, 안저 혈관 변화, 녹내장, 안압상승</td>
                         <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"></td>
                       </tr>
                       <tr>
                         <td style="padding: 10px; border-bottom: 2px solid #cbd5e1; border-right: 1px solid #e2e8f0; font-weight: 700; vertical-align: middle;">심전도검사</td>
                         <td style="padding: 10px; border-bottom: 2px solid #cbd5e1; border-right: 1px solid #e2e8f0;">심전도</td>
                         <td style="padding: 10px; border-bottom: 2px solid #cbd5e1; border-right: 1px solid #e2e8f0; text-align: left;">협심증, 심근경색, 심실대비, 부정맥 등</td>
                         <td style="padding: 10px; border-bottom: 2px solid #cbd5e1;"></td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
              </div>
            </div>

            <style>
              .rec-tag { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; cursor: help; position: relative; }
              .rec-tag.strong { color: #ef4444; background: #fef2f2; border: 1px solid #fca5a5; }
              .rec-tag.rec { color: #3b82f6; background: #eff6ff; border: 1px solid #93c5fd; }
              .rec-tag.ref { color: #64748b; background: #f8fafc; border: 1px solid #cbd5e1; }
              .rec-tooltip-container { position: relative; display: inline-flex; align-items: center; }
              .rec-tooltip-content { visibility: hidden; opacity: 0; background-color: white; color: #334155; text-align: left; border-radius: 8px; padding: 12px; position: absolute; z-index: 10; bottom: 125%; left: 50%; transform: translateX(-50%); width: max-content; max-width: 280px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; font-size: 13px; font-weight: 400; line-height: 1.5; transition: opacity 0.2s, visibility 0.2s; cursor: default; }
              .rec-tooltip-content::after { content: ""; position: absolute; top: 100%; left: 50%; margin-left: -6px; border-width: 6px; border-style: solid; border-color: white transparent transparent transparent; }
              .rec-tooltip-container:hover .rec-tooltip-content { visibility: visible; opacity: 1; }
            </style>
            <!-- 선택검사 -->
            <div style="border: 1px solid #e2e8f0; border-radius: 12px; background: white; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
              <div style="padding: 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 800; color: #0f172a;">선택검사</h3>
                  <div style="font-size: 14px; color: #64748b;">그룹별로 지정된 개수만큼 선택할 수 있습니다.</div>
                </div>
                <div style="display: flex; align-items: center; gap: 16px;">
                  <span style="font-size: 14px; color: #64748b;">전체 선택 가능 <span style="font-weight: 800; color: #2563eb; font-size: 16px;">3/3</span></span>
                  <svg width="24" height="24" fill="none" stroke="#94a3b8" stroke-width="2" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"></path></svg>
                </div>
              </div>
              
              <div style="padding: 16px 24px 24px; display: flex; flex-direction: column; gap: 16px;">
                <!-- 선택 A 그룹 -->
                <div id="group-A" style="border: 1px solid #f1f5f9; border-radius: 8px;">
                  <div style="padding: 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <div style="width: 28px; height: 28px; border-radius: 50%; background: #8b5cf6; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px;">A</div>
                      <span style="font-size: 16px; font-weight: 800; color: #1e293b;">선택 A <svg width="16" height="16" fill="none" stroke="#94a3b8" stroke-width="2" viewBox="0 0 24 24" style="vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg></span>
                      <span style="font-size: 14px; color: #94a3b8; margin-left: 16px;">1개 선택</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <span id="count-A" style="font-size: 14px; font-weight: 700; color: #2563eb;">0/1 선택</span>
                      <svg width="20" height="20" fill="none" stroke="#94a3b8" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
                    </div>
                  </div>
                  <div style="display: none; padding: 0 20px 20px; border-top: 1px solid #f1f5f9;">
                     <div style="padding-top: 16px; display: flex; flex-direction: column; gap: 12px;">
                       <label style="display: flex; align-items: flex-start; gap: 12px; cursor: pointer; padding: 12px; border: 1px solid #f1f5f9; border-radius: 8px;">
                         <input type="checkbox" onchange="window.handleCheckupSelection(this, 'group-A', 1)" style="width: 20px; height: 20px; accent-color: #2563eb; margin-top: 2px;">
                         <div>
                           <div style="font-size: 15px; color: #1e293b; font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 8px;">
                             위내시경(수면) 
                             <div class="rec-tooltip-container">
                               <span class="rec-tag strong">강력추천 <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>
                               <div class="rec-tooltip-content">
                                 <div style="color: #ef4444; font-weight: 700; margin-bottom: 4px;">강력추천</div>
                                 30대 이상부터 위염, 위궤양, 역류성 식도염 등 위장질환의 조기 발견에 도움이 됩니다.<br>수면 검사를 통해 보다 편안하고 정확한 검사가 가능합니다.
                               </div>
                             </div>
                           </div>
                           <div style="font-size: 13px; color: #64748b;">수면유도제 투여 후 검사 진행. 식도염, 위염, 위궤양 확인</div>
                         </div>
                       </label>
                       <label style="display: flex; align-items: flex-start; gap: 12px; cursor: pointer; padding: 12px; border: 1px solid #f1f5f9; border-radius: 8px;">
                         <input type="checkbox" onchange="window.handleCheckupSelection(this, 'group-A', 1)" style="width: 20px; height: 20px; accent-color: #2563eb; margin-top: 2px;">
                         <div>
                           <div style="font-size: 15px; color: #1e293b; font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 8px;">
                             위내시경(비수면) 
                             <div class="rec-tooltip-container">
                               <span class="rec-tag rec">추천 <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>
                               <div class="rec-tooltip-content">
                                 <div style="color: #3b82f6; font-weight: 700; margin-bottom: 4px;">추천</div>
                                 식도염, 위염, 위궤양 등 위장질환 확인에 도움이 되는 검사입니다.
                               </div>
                             </div>
                           </div>
                           <div style="font-size: 13px; color: #64748b;">식도염, 위염, 위궤양, 심이지장염 확인</div>
                         </div>
                       </label>
                     </div>
                  </div>
                </div>

                <!-- 선택 B 그룹 -->
                <div id="group-B" style="border: 1px solid #f1f5f9; border-radius: 8px;">
                  <div style="padding: 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <div style="width: 28px; height: 28px; border-radius: 50%; background: #3b82f6; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px;">B</div>
                      <span style="font-size: 16px; font-weight: 800; color: #1e293b;">선택 B <svg width="16" height="16" fill="none" stroke="#94a3b8" stroke-width="2" viewBox="0 0 24 24" style="vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg></span>
                      <span style="font-size: 14px; color: #94a3b8; margin-left: 16px;">2개 선택</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <span id="count-B" style="font-size: 14px; font-weight: 700; color: #2563eb;">0/2 선택</span>
                      <svg width="20" height="20" fill="none" stroke="#94a3b8" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
                    </div>
                  </div>
                  <div style="display: none; padding: 0 20px 20px; border-top: 1px solid #f1f5f9;">
                     <div style="padding-top: 16px; display: flex; flex-direction: column; gap: 12px;">
                       <label style="display: flex; align-items: flex-start; gap: 12px; cursor: pointer; padding: 12px; border: 1px solid #f1f5f9; border-radius: 8px;">
                         <input type="checkbox" onchange="window.handleCheckupSelection(this, 'group-B', 2)" style="width: 20px; height: 20px; accent-color: #2563eb; margin-top: 2px;">
                         <div>
                           <div style="font-size: 15px; color: #1e293b; font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 8px;">
                             대장내시경(수면) 
                             <div class="rec-tooltip-container">
                               <span class="rec-tag strong">강력추천 <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>
                               <div class="rec-tooltip-content">
                                 <div style="color: #ef4444; font-weight: 700; margin-bottom: 4px;">강력추천</div>
                                 40대 이후 대장용종 발생 가능성이 증가합니다.<br>대장암의 조기 발견을 위해 정기적인 검사를 권장합니다.
                               </div>
                             </div>
                           </div>
                           <div style="font-size: 13px; color: #64748b;">수면유도제 투여 후 검사 진행. 대장용종, 대장염, 대장암 등 확인</div>
                         </div>
                       </label>
                       <label style="display: flex; align-items: flex-start; gap: 12px; cursor: pointer; padding: 12px; border: 1px solid #f1f5f9; border-radius: 8px;">
                         <input type="checkbox" onchange="window.handleCheckupSelection(this, 'group-B', 2)" style="width: 20px; height: 20px; accent-color: #2563eb; margin-top: 2px;">
                         <div>
                           <div style="font-size: 15px; color: #1e293b; font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 8px;">
                             복부초음파 
                             <div class="rec-tooltip-container">
                               <span class="rec-tag rec">추천 <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>
                               <div class="rec-tooltip-content">
                                 <div style="color: #3b82f6; font-weight: 700; margin-bottom: 4px;">추천</div>
                                 음주 또는 비만이 있는 경우 지방간, 담낭질환 확인에 도움이 됩니다.
                               </div>
                             </div>
                           </div>
                           <div style="font-size: 13px; color: #64748b;">간, 담낭, 췌장, 비장, 신장 등의 이상 확인</div>
                         </div>
                       </label>
                       <label style="display: flex; align-items: flex-start; gap: 12px; cursor: pointer; padding: 12px; border: 1px solid #f1f5f9; border-radius: 8px;">
                         <input type="checkbox" onchange="window.handleCheckupSelection(this, 'group-B', 2)" style="width: 20px; height: 20px; accent-color: #2563eb; margin-top: 2px;">
                         <div>
                           <div style="font-size: 15px; color: #1e293b; font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 8px;">
                             갑상선초음파 
                             <div class="rec-tooltip-container">
                               <span class="rec-tag ref">참고 <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>
                               <div class="rec-tooltip-content">
                                 <div style="color: #64748b; font-weight: 700; margin-bottom: 4px;">참고</div>
                                 갑상선 질환의 조기 발견을 위해 도움이 되는 검사입니다.
                               </div>
                             </div>
                           </div>
                           <div style="font-size: 13px; color: #64748b;">갑상선 결절, 갑상선염 등 확인</div>
                         </div>
                       </label>
                     </div>
                  </div>
                </div>
              </div>
              
              <!-- 범례 -->
              <div style="padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; display: flex; gap: 24px; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="rec-tag strong" style="font-size: 11px;">강력추천</span>
                  <span style="font-size: 12px; color: #475569;">연령/성별/생활습관에 기반하여 검진의학 가이드라인상 우선 권장되는 검사입니다.</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="rec-tag rec" style="font-size: 11px;">추천</span>
                  <span style="font-size: 12px; color: #475569;">개인 특성에 따라 도움이 될 수 있는 검사입니다.</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="rec-tag ref" style="font-size: 11px;">참고</span>
                  <span style="font-size: 12px; color: #475569;">상황에 따라 고려할 수 있는 검사입니다.</span>
                </div>
              </div>
            </div>

            <!-- 추가검사 -->
            <div style="border: 1px solid #e2e8f0; border-radius: 12px; background: white; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
              <div style="padding: 24px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
                <div>
                  <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 800; color: #0f172a;">추가검사</h3>
                  <div style="font-size: 14px; color: #64748b; line-height: 1.5;">원하시는 검사를 자유롭게 추가할 수 있습니다.<br>선택한 항목의 비용은 총 결제 예정 금액에 반영됩니다.</div>
                </div>
                <div style="display: flex; align-items: center; gap: 16px;">
                  <span style="font-size: 15px; color: #2563eb; font-weight: 700;">선택한 추가검사 0개</span>
                  <svg width="24" height="24" fill="none" stroke="#94a3b8" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
                </div>
              </div>
              <div style="display: none; padding: 0 24px 24px; border-top: 1px solid #f1f5f9;">
                <div style="padding-top: 20px; display: flex; flex-direction: column; gap: 16px;">
                   <label style="display: flex; justify-content: space-between; align-items: flex-start; cursor: pointer; padding: 12px; border: 1px solid #f1f5f9; border-radius: 8px;">
                     <div style="display: flex; align-items: flex-start; gap: 12px;">
                       <input type="checkbox" style="width: 20px; height: 20px; accent-color: #2563eb; margin-top: 2px;">
                       <div>
                         <div style="font-size: 15px; color: #1e293b; font-weight: 700; margin-bottom: 4px;">알레르기 마스트검사 (108종)</div>
                         <div style="font-size: 13px; color: #64748b;">호흡기, 식품 알레르기 등 108종 원인물질 검사 <span style="color: #ef4444; font-weight: 600;">선택</span></div>
                       </div>
                     </div>
                     <span style="font-size: 15px; color: #0f172a; font-weight: 700; margin-top: 2px;">100,000원</span>
                   </label>
                   <label style="display: flex; justify-content: space-between; align-items: flex-start; cursor: pointer; padding: 12px; border: 1px solid #f1f5f9; border-radius: 8px;">
                     <div style="display: flex; align-items: flex-start; gap: 12px;">
                       <input type="checkbox" style="width: 20px; height: 20px; accent-color: #2563eb; margin-top: 2px;">
                       <div>
                         <div style="font-size: 15px; color: #1e293b; font-weight: 700; margin-bottom: 4px;">NK세포 활성도 검사</div>
                         <div style="font-size: 13px; color: #64748b;">체내 면역세포 활성도 측정을 통한 면역력 확인</div>
                       </div>
                     </div>
                     <span style="font-size: 15px; color: #0f172a; font-weight: 700; margin-top: 2px;">120,000원</span>
                   </label>
                   <label style="display: flex; justify-content: space-between; align-items: flex-start; cursor: pointer; padding: 12px; border: 1px solid #f1f5f9; border-radius: 8px;">
                     <div style="display: flex; align-items: flex-start; gap: 12px;">
                       <input type="checkbox" style="width: 20px; height: 20px; accent-color: #2563eb; margin-top: 2px;">
                       <div>
                         <div style="font-size: 15px; color: #1e293b; font-weight: 700; margin-bottom: 4px;">수면추가(위내시경 선택시)</div>
                         <div style="font-size: 13px; color: #64748b;">위내시경 진행시 수면비용 <span style="color: #ef4444; font-weight: 600;">※ 단독선택불가</span></div>
                       </div>
                     </div>
                     <span style="font-size: 15px; color: #0f172a; font-weight: 700; margin-top: 2px;">40,000원</span>
                   </label>
                </div>
              </div>
            </div>

            <div style="display: flex; gap: 12px; margin-top: 40px;">
              <button onclick="window.history.back()" style="flex: 1; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; color: #475569; font-size: 16px; font-weight: 700; cursor: pointer;">이전 단계</button>
              <button onclick="
                const aChecked = document.querySelectorAll('#group-A input:checked').length;
                const bChecked = document.querySelectorAll('#group-B input:checked').length;
                if(aChecked !== 1) {
                  window.showToast('선택 A 그룹에서 1개를 선택해주세요.');
                  return;
                }
                if(bChecked !== 2) {
                  window.showToast('선택 B 그룹에서 2개를 선택해주세요.');
                  return;
                }
                window.location.hash='#/portal/${state.activeClient.id}/${state.activeSite.siteId}/${state.activeMenuId}/checkup-date';
              " style="flex: 1; padding: 16px; border-radius: 8px; border: none; background: #2563eb; color: white; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.2s;">다음 단계</button>
            </div>
          </div>
        `;
      } else if (state.activeSubId === 'checkup-date') {
        detailContentHtml = `
          <div class="date-wrapper fade-in" style="animation: fadeIn 0.4s ease; max-width: 900px; margin: 0 auto; padding: 40px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="background: #2563eb; color: white; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 4px;">STEP 4</span>
                <span style="font-size: 14px; font-weight: 700; color: #475569;">검진 희망일 선택</span>
              </div>
            </div>
            <h2 style="font-size: 24px; font-weight: 800; color: #0f172a; line-height: 1.4; margin-bottom: 24px;">
              원하시는 검진 일자를 2개 선택해주세요.<br>
              <span style="font-size: 15px; color: #64748b; font-weight: 400;">선택하신 항목들에 대한 가장 빠른 예약 가능일 기준입니다.</span>
            </h2>

            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); overflow: hidden; margin-bottom: 24px;">
              <div style="padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0;">
                <button id="step4-prev-btn" onclick="window.prevStep4Month()" style="background: none; border: none; cursor: pointer; color: #64748b;"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"></path></svg></button>
                <div id="step4-month-title" style="font-size: 18px; font-weight: 800; color: #0f172a;">2026년 6월</div>
                <button id="step4-next-btn" onclick="window.nextStep4Month()" style="background: none; border: none; cursor: pointer; color: #64748b;"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg></button>
              </div>
              
              <div id="checkup-date-calendar"></div>
            </div>

            <div style="display: flex; gap: 16px; margin-bottom: 40px;">
              <div style="flex: 1;">
                <label style="display: block; font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">검진희망일 1순위 <span style="color: #ef4444;">*</span></label>
                <input type="text" id="wish-date-1" readonly placeholder="달력에서 날짜를 선택해주세요" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #f8fafc; font-size: 15px; color: #0f172a;">
              </div>
              <div style="flex: 1;">
                <label style="display: block; font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">검진희망일 2순위 <span style="color: #ef4444;">*</span></label>
                <input type="text" id="wish-date-2" readonly placeholder="달력에서 날짜를 선택해주세요" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #f8fafc; font-size: 15px; color: #0f172a;">
              </div>
            </div>

            <div style="display: flex; gap: 12px;">
              <button onclick="window.history.back()" style="flex: 1; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; color: #475569; font-size: 16px; font-weight: 700; cursor: pointer;">이전 단계</button>
              <button onclick="if(!document.getElementById('wish-date-1').value || !document.getElementById('wish-date-2').value) { window.showToast('검진희망일 2개를 모두 선택해주세요.'); return; } window.location.hash='#/portal/${state.activeClient.id}/${state.activeSite.siteId}/${state.activeMenuId}/checkup-summary';" style="flex: 1; padding: 16px; border-radius: 8px; border: none; background: #2563eb; color: white; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.2s;">다음 단계</button>
            </div>
          </div>
        `;
      } else if (state.activeSubId === 'checkup-summary') {
        const isCompanySupport = sessionStorage.getItem('isCompanySupport') === 'true';
        detailContentHtml = `
          <div class="summary-wrapper fade-in" style="animation: fadeIn 0.4s ease; max-width: 900px; margin: 0 auto; padding: 40px 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="background: #2563eb; color: white; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 4px;">STEP 5</span>
                <span style="font-size: 14px; font-weight: 700; color: #475569;">'예약정보 및 결제비용' 안내</span>
              </div>
            </div>
            <h2 style="font-size: 24px; font-weight: 800; color: #0f172a; line-height: 1.4; margin-bottom: 24px;">
              선택하신 검진 내역을 확인해주세요.
            </h2>

            <!-- 검진대상자 정보 카드 -->
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); margin-bottom: 24px; padding: 24px;">
              <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 16px;">검진대상자 정보</h3>
              <div style="display: flex; flex-direction: column; gap: 12px; font-size: 15px;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #64748b; width: 120px;">대상자명</span>
                  <span style="color: #1e293b; font-weight: 600; flex: 1;" id="summary-target-name">-</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #64748b; width: 120px;">관계</span>
                  <span style="color: #1e293b; font-weight: 600; flex: 1;" id="summary-target-type">-</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #64748b; width: 120px;">생년월일 / 성별</span>
                  <span style="color: #1e293b; font-weight: 600; flex: 1;" id="summary-target-birth-gender">-</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #64748b; width: 120px;">휴대폰번호</span>
                  <span style="color: #1e293b; font-weight: 600; flex: 1;" id="summary-target-phone">-</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #64748b; width: 120px;">주소</span>
                  <span style="color: #1e293b; font-weight: 600; flex: 1;" id="summary-target-address">-</span>
                </div>
              </div>
            </div>

            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); margin-bottom: 24px; padding: 24px;">
              <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 16px;">검진선택사항</h3>
              <div style="display: flex; flex-direction: column; gap: 12px; font-size: 15px;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #64748b; width: 120px;">패키지명</span>
                  <span style="color: #1e293b; font-weight: 600; flex: 1;">종합건강검진</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #64748b; width: 120px;">선택검사</span>
                  <span style="color: #1e293b; font-weight: 600; flex: 1;">위내시경(수면), 대장내시경(수면), 복부초음파</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #64748b; width: 120px;">추가검사</span>
                  <span style="color: #1e293b; font-weight: 600; flex: 1;">선택 안함</span>
                </div>
                <div style="border-top: 1px solid #f1f5f9; margin: 8px 0;"></div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #64748b; width: 120px;">희망일 1순위</span>
                  <span style="color: #1e293b; font-weight: 600; flex: 1;" id="summary-date-1"></span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #64748b; width: 120px;">희망일 2순위</span>
                  <span style="color: #1e293b; font-weight: 600; flex: 1;" id="summary-date-2"></span>
                </div>
              </div>
            </div>

            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); margin-bottom: 40px; padding: 24px;">
              <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 16px;">결제금액</h3>
              
              <div style="display: flex; flex-direction: column; gap: 16px; font-size: 15px;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px;">
                  <span style="color: #475569; font-weight: 600;">기본검진비용</span>
                  <span style="color: #3b82f6; font-weight: 800;">₩300,000</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px;">
                  <span style="color: #475569; font-weight: 600;">추가 검사비</span>
                  <span style="color: #3b82f6; font-weight: 800;">₩0</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #475569; font-weight: 600;">개인결제비용</span>
                  <span style="color: #16a34a; font-weight: 800; font-size: 18px;">₩300,000</span>
                </div>
              </div>
            </div>

            <div style="display: flex; gap: 12px;">
              <button onclick="window.history.back()" style="flex: 1; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; color: #475569; font-size: 16px; font-weight: 700; cursor: pointer;">이전 단계</button>
              <button onclick="
                let hist = JSON.parse(localStorage.getItem('hc_checkup_history') || '[]');
                hist.unshift({
                    id: 'chk-' + Date.now(),
                    userId: '${state.currentUser ? state.currentUser.id : ''}',
                    pkgName: '우리허브병원 - 기본형',
                    supportType: '${isCompanySupport ? '회사지원' : '건강검진 우대예약'}',
                    applyDate: new Date().toISOString().split('T')[0],
                    wishDate1: (window.selectedWishDates && window.selectedWishDates[0]) ? window.selectedWishDates[0] : '2026-06-30',
                    wishDate2: (window.selectedWishDates && window.selectedWishDates[1]) ? window.selectedWishDates[1] : '',
                    selectedTests: '-',
                    extraTests: '-',
                    confirmDate: '',
                    targetName: window.getCheckupTargetData ? window.getCheckupTargetData().name : '${state.currentUser ? state.currentUser.name : ''}',
                    targetBirthGender: window.getCheckupTargetData ? (window.getCheckupTargetData().birth + ' / ' + (window.getCheckupTargetData().gender === 'M' ? '남성' : window.getCheckupTargetData().gender === 'F' ? '여성' : '-')) : '19850101 / 남성',
                    targetPhone: window.getCheckupTargetData ? window.getCheckupTargetData().phone : '010-0000-0000',
                    targetAddress: window.getCheckupTargetData ? ((window.getCheckupTargetData().addr1 || '') + ' ' + (window.getCheckupTargetData().addr2 || '')).trim() || '-' : '-',
                    status: '신청',
                    reservationConfirmedDate: '',
                    personalCost: '₩200,000'
                });
                localStorage.setItem('hc_checkup_history', JSON.stringify(hist));
                
                // Find correct path for checkupHistory
                let targetHash = '#/portal/${state.activeClient.id}/${state.activeSite.siteId}/checkupAppt/checkupHistory';
                const site = state.activeClient.sites.find(s => s.siteId === state.activeSite.siteId);
                const checkupMenu = site?.menus?.find(m => m.id === 'checkupAppt');
                if (checkupMenu && checkupMenu.children) {
                    for (const sub of checkupMenu.children) {
                        if (sub.id === 'checkupHistory' || sub.label?.includes('신청이력')) {
                            targetHash = '#/portal/${state.activeClient.id}/${state.activeSite.siteId}/checkupAppt/' + sub.id;
                            break;
                        }
                        if (sub.children && sub.children.some(c => c.id === 'checkupHistory' || c.label?.includes('신청이력'))) {
                            const subSub = sub.children.find(c => c.id === 'checkupHistory' || c.label?.includes('신청이력'));
                            targetHash = '#/portal/${state.activeClient.id}/${state.activeSite.siteId}/checkupAppt/' + sub.id + '/' + subSub.id;
                            break;
                        }
                    }
                }
                alert('예약 신청이 성공적으로 완료되었습니다.\\n신청이력 화면으로 이동합니다.');
                window.location.hash = targetHash;
              " style="flex: 1; padding: 16px; border-radius: 8px; border: none; background: #2563eb; color: white; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.2s;">예약신청완료</button>
            </div>
          </div>
        `;
      }
    }

    if (state.activeMenuId === 'mypage') {
      contentHtml = `
        <div class="mypage-wrapper" style="max-width: 1000px; margin: 0 auto; padding: 40px 20px; box-sizing: border-box; animation: fadeIn 0.4s ease-out;">
          ${detailContentHtml}
        </div>
      `;
    } else {
      contentHtml = `
        <div class="subpage-wrapper">
          <aside class="sidebar">
            <ul class="sidebar-tree">${sidebarHtml}</ul>
          </aside>
          <section class="subpage-content fade-in">
            <div class="breadcrumb-nav" style="margin-bottom:20px; font-size:14px; color:#64748b;">
              홈 &nbsp;/&nbsp; ${visibleMenus.find(m => m.id === state.activeMenuId)?.label || ''}
              ${state.activeSubId ? `&nbsp;/&nbsp; ${visibleMenus.find(m => m.id === state.activeMenuId)?.children.find(c => c.id === state.activeSubId)?.label || ''}` : ''}
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
  }

  app.innerHTML = `
    <div style="display:flex; flex-direction:column; min-height:100vh;">
      <header class="header">
        <div class="container header-content">
          <div class="logo-area" onclick="window.location.hash='#/portal/${client.id}/${activeSite.siteId}'" style="cursor:pointer;">
            ${activeSite.logoImage ?
      `<img src="${activeSite.logoImage}" style="height:32px; width:auto; object-fit:contain;">` :
      `<span style="font-weight:800; font-size:18px; color:var(--theme-color);">${activeSite.serviceName || client.name}</span>`
    }
          </div>
          <nav class="gnb" onmouseenter="document.getElementById('mega-menu').classList.add('active')" onmouseleave="document.getElementById('mega-menu').classList.remove('active')">
            ${gnbHtml}
          </nav>
          ${megaMenuHtml}
          <div class="user-profile" style="display:flex; align-items:center;">
            ${siteSelectorHtml}
            <span style="font-weight: 500; margin-right:12px; cursor:pointer;" onclick="window.location.hash='#/portal/${client.id}/${activeSite.siteId}/mypage'">${state.currentUser.name} 님</span>
            <button class="logout-btn" onclick="window.location.hash='#/portal/${client.id}/${activeSite.siteId}/mypage'" style="margin-right:12px;">마이페이지</button>
            <button class="logout-btn" onclick="logout()">로그아웃</button>
          </div>
        </div>
      </header>
      <main class="dashboard container" style="flex:1;">${contentHtml}</main>
      <footer class="footer">
        <div class="container footer-content" style="text-align:center;">
          <div class="cs-info" style="margin-bottom:32px;">
            <span class="cs-title">${activeSite.serviceName} 고객센터</span>
            <span class="cs-number">${activeSite.csNumber}</span>
          </div>
          
          <div class="footer-nav" style="padding:16px 0; margin-bottom:24px;">
            <a href="${activeSite.clientLink || '#'}" target="_blank" style="color:#1e293b; text-decoration:none; font-weight:600; margin:0 12px;">${activeSite.name}</a>
            <span style="color:#cbd5e1;">|</span>
            <a href="${activeSite.providerLink || '#'}" target="_blank" style="color:#1e293b; text-decoration:none; font-weight:600; margin:0 12px;">${activeSite.providerName || '교보다솜케어'}</a>
            <span style="color:#cbd5e1;">|</span>
            <a href="#" style="color:#1e293b; text-decoration:none; font-weight:600; margin:0 12px;">개인정보처리방침</a>
            <span style="color:#cbd5e1;">|</span>
            <a href="#" style="color:#1e293b; text-decoration:none; font-weight:600; margin:0 12px;">이용약관</a>
          </div>
          
          <div class="footer-disclaimer" style="color:#64748b; font-size:14px; line-height:1.6; margin-bottom:16px;">
            본 서비스는 ${activeSite.name}와(과) 제휴한 ${activeSite.providerName || '교보다솜케어'}에서 제공합니다.
          </div>
          
          <div class="footer-copyright" style="font-size:12px; color:#94a3b8;">
            © ${activeSite.providerName || '교보다솜케어'}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  `;

  if (state.activeSubId === 'checkup-date') {
    setTimeout(window.renderStep4Calendar, 50);
  } else if (state.activeSubId === 'checkup-target') {
    setTimeout(window.loadCheckupTargetInfo, 50);
  } else if (state.activeSubId === 'checkup-summary') {
    setTimeout(function() {
      const dates = window.selectedWishDates || [];
      const el1 = document.getElementById('summary-date-1');
      const el2 = document.getElementById('summary-date-2');
      if (el1) el1.innerText = dates[0] || '미선택';
      if (el2) el2.innerText = dates[1] || '미선택';

      const targetData = window.getCheckupTargetData ? window.getCheckupTargetData() : {};
      const elTargetName = document.getElementById('summary-target-name');
      const elTargetType = document.getElementById('summary-target-type');
      const elTargetBirthGender = document.getElementById('summary-target-birth-gender');
      const elTargetPhone = document.getElementById('summary-target-phone');
      const elTargetAddress = document.getElementById('summary-target-address');

      if (elTargetName) elTargetName.innerText = targetData.name || '-';
      if (elTargetType) elTargetType.innerText = targetData.type === 'self' ? '본인' : '가족';
      if (elTargetBirthGender) {
        elTargetBirthGender.innerText = (targetData.birth ? targetData.birth : '-') + ' / ' + (targetData.gender === 'M' ? '남성' : targetData.gender === 'F' ? '여성' : '-');
      }
      if (elTargetPhone) elTargetPhone.innerText = targetData.phone || '-';
      if (elTargetAddress) {
        elTargetAddress.innerText = ((targetData.addr1 || '') + ' ' + (targetData.addr2 || '')).trim() || '-';
      }
    }, 50);
  }
}

window.getCheckupDateStatus = function(year, month, day) {
  const date = new Date(year, month - 1, day);
  const dow = date.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
  
  if (dow === 0) {
    return { type: 'holiday', title: '휴무일', closedItems: [] };
  }
  
  // Specific national holidays in 2026:
  // 8/15 (광복절), 10/3 (개천절), 10/9 (한글날), 12/25 (기독탄신일)
  // Chuseok 2026: 9/24, 9/25, 9/26
  if ((month === 8 && day === 15) || 
      (month === 10 && (day === 3 || day === 9)) || 
      (month === 12 && day === 25) ||
      (month === 9 && (day === 24 || day === 25))) {
    return { type: 'holiday', title: '휴무일', closedItems: [] };
  }

  if (year !== 2026 || month < 6 || month > 12) {
    return { type: 'closed', title: '예약마감', closedItems: [] };
  }

  if (month === 6) {
    if ([2, 9, 10, 16, 23, 29].includes(day)) {
      return { type: 'partial', title: '일부항목 마감', closedItems: ['대장내시경', '유방초음파'] };
    }
    if ([17, 18, 22, 24, 25, 30].includes(day)) {
      return { type: 'available', title: '예약가능', closedItems: [] };
    }
    return { type: 'closed', title: '예약마감', closedItems: [] };
  }

  if (dow === 2 || dow === 3 || dow === 4) {
    if (day % 2 === 1) {
      return { type: 'partial', title: '일부항목 마감', closedItems: ['대장내시경'] };
    } else {
      return { type: 'available', title: '예약가능', closedItems: [] };
    }
  }
  
  if (dow === 5) {
    if (day % 4 === 0) {
      return { type: 'partial', title: '일부항목 마감', closedItems: ['대장내시경', '유방초음파'] };
    }
  }

  return { type: 'closed', title: '예약마감', closedItems: [] };
};

window.selectedWishDates = [];
window.currentStep4Year = 2026;
window.currentStep4Month = 6;

window.prevStep4Month = function() {
  if (window.currentStep4Year === 2026 && window.currentStep4Month <= 6) return;
  window.currentStep4Month--;
  if (window.currentStep4Month < 1) {
    window.currentStep4Month = 12;
    window.currentStep4Year--;
  }
  window.renderStep4Calendar();
};

window.nextStep4Month = function() {
  if (window.currentStep4Year === 2026 && window.currentStep4Month >= 12) return;
  window.currentStep4Month++;
  if (window.currentStep4Month > 12) {
    window.currentStep4Month = 1;
    window.currentStep4Year++;
  }
  window.renderStep4Calendar();
};

window.toggleWishDate = function(y, m, d) {
  const selectedDate = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + 7);
  
  if (selectedDate < minDate) {
    window.showToast('원활한 예약을 위해 최소 7일 이후로 선택해주세요.');
    return;
  }

  const dateStr = y + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0');
  const idx = window.selectedWishDates.indexOf(dateStr);
  if (idx > -1) {
    window.selectedWishDates.splice(idx, 1);
  } else {
    if (window.selectedWishDates.length >= 2) {
      window.showToast('최대 2개의 날짜만 선택 가능합니다.');
      return;
    }
    window.selectedWishDates.push(dateStr);
  }
  
  document.getElementById('wish-date-1').value = window.selectedWishDates[0] || '';
  document.getElementById('wish-date-2').value = window.selectedWishDates[1] || '';
  
  window.renderStep4Calendar();
};

window.renderStep4Calendar = function() {
  if (window.selectedWishDates && window.selectedWishDates.length > 0) {
    if (!window.hasInitializedStep4Month) {
      const parts = window.selectedWishDates[0].split('-');
      window.currentStep4Year = parseInt(parts[0], 10);
      window.currentStep4Month = parseInt(parts[1], 10);
      window.hasInitializedStep4Month = true;
    }
  } else {
    if (!window.currentStep4Year || !window.currentStep4Month) {
      window.currentStep4Year = 2026;
      window.currentStep4Month = 6;
    }
  }

  const y = window.currentStep4Year;
  const m = window.currentStep4Month;
  const firstDay = new Date(y, m - 1, 1).getDay();
  const daysInMonth = new Date(y, m, 0).getDate();
  
  const titleEl = document.getElementById('step4-month-title');
  if (titleEl) {
    titleEl.innerText = y + '년 ' + m + '월';
  }
  
  const prevBtn = document.getElementById('step4-prev-btn');
  const nextBtn = document.getElementById('step4-next-btn');
  if (prevBtn) {
    if (y === 2026 && m <= 6) prevBtn.style.visibility = 'hidden';
    else prevBtn.style.visibility = 'visible';
  }
  if (nextBtn) {
    if (y === 2026 && m >= 12) nextBtn.style.visibility = 'hidden';
    else nextBtn.style.visibility = 'visible';
  }

  let html = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); border-top: 2px solid #2563eb; border-left: 1px solid #e2e8f0;">';
  ['일', '월', '화', '수', '목', '금', '토'].forEach((d, i) => {
    html += '<div style="padding: 12px 0; text-align: center; font-weight: 800; font-size: 14px; color: ' + (i===0?'#ef4444':i===6?'#3b82f6':'#334155') + '; background: #f8fafc; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">'+d+'</div>';
  });
  
  for (let i = 0; i < firstDay; i++) {
    html += '<div style="background: #f8fafc; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; min-height: 110px;"></div>';
  }
  
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = y + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    const isSelected = window.selectedWishDates.includes(dateStr);
    const isSunday = new Date(y, m - 1, d).getDay() === 0;
    const isSaturday = new Date(y, m - 1, d).getDay() === 6;
    
    let dayColor = '#334155';
    if (isSunday) dayColor = '#ef4444';
    if (isSaturday) dayColor = '#3b82f6';
    
    const status = window.getCheckupDateStatus(y, m, d);
    let isAvailable = false;
    let statusHtml = '';
    
    if (status.type === 'holiday') {
      statusHtml = '<div style="color: #ef4444; font-size: 13px; font-weight: 700; margin-top: 6px;">휴일</div>';
    } else if (status.type === 'available') {
      isAvailable = true;
      statusHtml = '<div style="background: #3b82f6; color: white; display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; margin-top: 6px;">예약가능</div>';
    } else if (status.type === 'partial') {
      isAvailable = true;
      const closedList = status.closedItems.map(item => `· ${item} 마감`).join('<br>');
      statusHtml = `<div style="background: #3b82f6; color: white; display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; margin-top: 6px;">예약가능</div><div style="font-size:11px; color:#64748b; margin-top:4px; line-height: 1.4;">${closedList}</div>`;
    } else {
      statusHtml = '<div style="color: #94a3b8; font-size: 13px; font-weight: 700; margin-top: 6px; text-decoration: line-through;">예약마감</div>';
    }
    
    const bgStyle = isSelected ? 'background: #dbeafe; border: 2px solid #2563eb; border-radius: 8px;' : (isAvailable ? 'background: #eff6ff; cursor: pointer;' : 'background: white;');
    const clickAttr = isAvailable ? 'onclick="window.toggleWishDate('+y+', '+m+', '+d+')"' : '';
    
    html += '<div ' + clickAttr + ' style="padding: 12px; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; min-height: 110px; display: flex; flex-direction: column; align-items: flex-start; transition: all 0.2s; ' + bgStyle + '"><div style="color: ' + dayColor + '; font-size: 14px; font-weight: 700;">' + d + '</div>' + statusHtml + '</div>';
  }
  
  html += '</div>';
  const container = document.getElementById('checkup-date-calendar');
  if (container) container.innerHTML = html;
};

window.toggleConsentDetail = function(chk, detailId) {
  const detail = document.getElementById(detailId);
  const iconId = detailId.replace('detail', 'icon');
  const icon = document.getElementById(iconId);
  if (chk.checked) {
    detail.style.display = 'block';
    detail.parentElement.style.border = '1px solid #bfdbfe';
    icon.style.transform = 'rotate(180deg)';
    icon.setAttribute('stroke', '#3b82f6');
  } else {
    detail.style.display = 'none';
    detail.parentElement.style.border = '1px solid #e2e8f0';
    icon.style.transform = 'rotate(0deg)';
    icon.setAttribute('stroke', '#94a3b8');
  }
  
  // Check if all checked
  const checkboxes = document.querySelectorAll('.consent-req-chk');
  const allChecked = Array.from(checkboxes).every(c => c.checked);
  
  const allChk = document.getElementById('chk-all-consent');
  if (allChk) {
    allChk.checked = allChecked;
  }

  const btn = document.getElementById('btn-next-consent');
  if (allChecked) {
    btn.disabled = false;
    btn.style.background = '#2563eb';
    btn.style.cursor = 'pointer';
  } else {
    btn.disabled = true;
    btn.style.background = '#94a3b8';
    btn.style.cursor = 'not-allowed';
  }
};

window.toggleAllConsent = function(checked) {
  const checkboxes = document.querySelectorAll('.consent-req-chk');
  checkboxes.forEach((chk, idx) => {
    if (chk.checked !== checked) {
      chk.checked = checked;
      window.toggleConsentDetail(chk, 'detail-' + (idx + 1));
    }
  });
};

window.submitCheckupConsent = function() {
  const logs = JSON.parse(localStorage.getItem('checkupConsentLogs') || '[]');
  const logEntry = {
    LOG_ID: 'C_LOG_' + Date.now(),
    MEMBER_ID: state.currentUser ? state.currentUser.name : 'user_' + Math.floor(Math.random() * 9000 + 1000),
    CONSENT_YN: 'Y',
    CONSENT_DATETIME: new Date().toLocaleString('ko-KR'),
    SERVICE_TYPE: '건강검진 우대예약',
    SCREEN_ID: '동의서 작성',
    PURPOSE: '개인 및 민감정보 수집/제공 동의',
    CLIENT_IP: '192.168.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255),
    USER_AGENT: navigator.userAgent,
    CREATED_AT: new Date().toLocaleString('ko-KR')
  };
  logs.unshift(logEntry);
  localStorage.setItem('checkupConsentLogs', JSON.stringify(logs));

  window.location.hash = '#/portal/' + state.activeClient.id + '/' + state.activeSite.siteId + '/' + state.activeMenuId + '/checkup-target';
};

window.saveCheckupTargetInfo = function() {
  const nameInput = document.getElementById('target-name');
  const typeRadio = document.querySelector('input[name="target-type"]:checked');
  const birthInput = document.getElementById('target-birth');
  const genderRadio = document.querySelector('input[name="target-gender"]:checked');
  const phoneInput = document.getElementById('target-phone');
  const addr1Input = document.getElementById('target-addr1');
  const addr2Input = document.getElementById('target-addr2');

  const targetInfo = {
    name: nameInput ? nameInput.value : '',
    type: typeRadio ? typeRadio.value : '',
    birth: birthInput ? birthInput.value : '',
    gender: genderRadio ? genderRadio.value : '',
    phone: phoneInput ? phoneInput.value : '',
    addr1: addr1Input ? addr1Input.value : '',
    addr2: addr2Input ? addr2Input.value : ''
  };

  sessionStorage.setItem('checkup_target_info', JSON.stringify(targetInfo));
};

window.loadCheckupTargetInfo = function() {
  const targetInfoStr = sessionStorage.getItem('checkup_target_info');
  if (!targetInfoStr) return;
  
  try {
    const targetInfo = JSON.parse(targetInfoStr);
    const nameInput = document.getElementById('target-name');
    const typeRadios = document.querySelectorAll('input[name="target-type"]');
    const birthInput = document.getElementById('target-birth');
    const genderRadios = document.querySelectorAll('input[name="target-gender"]');
    const phoneInput = document.getElementById('target-phone');
    const addr1Input = document.getElementById('target-addr1');
    const addr2Input = document.getElementById('target-addr2');
    const infoFields = document.getElementById('target-info-fields');

    if (nameInput && targetInfo.name !== undefined) nameInput.value = targetInfo.name;
    
    if (targetInfo.type) {
      typeRadios.forEach(el => {
        if (el.value === targetInfo.type) el.checked = true;
      });
      if (infoFields) infoFields.style.display = 'flex';
      
      if (targetInfo.type === 'self') {
        if (nameInput) {
          nameInput.readOnly = true;
          nameInput.style.background = '#f8fafc';
        }
        if (birthInput) {
          birthInput.readOnly = true;
          birthInput.style.background = '#f8fafc';
        }
        genderRadios.forEach(el => el.disabled = true);
      }
    }
    
    if (birthInput && targetInfo.birth !== undefined) birthInput.value = targetInfo.birth;
    
    if (targetInfo.gender) {
      genderRadios.forEach(el => {
        if (el.value === targetInfo.gender) el.checked = true;
      });
    }
    
    if (phoneInput && targetInfo.phone !== undefined) phoneInput.value = targetInfo.phone;
    if (addr1Input && targetInfo.addr1 !== undefined) addr1Input.value = targetInfo.addr1;
    if (addr2Input && targetInfo.addr2 !== undefined) addr2Input.value = targetInfo.addr2;
  } catch (e) {
    console.error('Error loading checkup target info:', e);
  }
};

window.getCheckupTargetData = function() {
  const targetInfoStr = sessionStorage.getItem('checkup_target_info');
  if (targetInfoStr) {
    try {
      return JSON.parse(targetInfoStr);
    } catch(e) {}
  }
  return {
    name: (state && state.currentUser) ? state.currentUser.name : '홍길동',
    type: 'self',
    birth: '19800101',
    gender: 'M',
    phone: '010-1234-5678',
    addr1: '서울시 강남구 테헤란로',
    addr2: '101호'
  };
};

window.toggleCheckupTarget = function(type) {
  const infoFields = document.getElementById('target-info-fields');
  const nameInput = document.getElementById('target-name');
  const birthInput = document.getElementById('target-birth');
  const genderRadios = document.querySelectorAll('input[name="target-gender"]');
  const phoneInput = document.getElementById('target-phone');
  const addr1Input = document.getElementById('target-addr1');
  const addr2Input = document.getElementById('target-addr2');
  
  infoFields.style.display = 'flex';
  
  if (type === 'self') {
    nameInput.value = state.currentUser ? state.currentUser.name : '';
    nameInput.readOnly = true;
    nameInput.style.background = '#f8fafc';
    
    birthInput.value = '19800101';
    birthInput.readOnly = true;
    birthInput.style.background = '#f8fafc';
    
    genderRadios.forEach(el => {
      if (el.value === 'M') el.checked = true;
      el.disabled = true;
    });
    
    phoneInput.value = '01012345678';
    phoneInput.readOnly = false;
    phoneInput.style.background = 'white';
    
    addr1Input.value = '서울시 강남구 테헤란로';
    addr2Input.value = '101호';
    addr2Input.readOnly = false;
    addr2Input.style.background = 'white';
  } else {
    nameInput.value = '';
    nameInput.readOnly = false;
    nameInput.style.background = 'white';
    
    birthInput.value = '';
    birthInput.readOnly = false;
    birthInput.style.background = 'white';
    
    genderRadios.forEach(el => {
      el.checked = false;
      el.disabled = false;
    });
    
    phoneInput.value = '';
    phoneInput.readOnly = false;
    phoneInput.style.background = 'white';
    
    addr1Input.value = '';
    addr2Input.value = '';
    addr2Input.readOnly = false;
    addr2Input.style.background = 'white';
  }
};

window.showPastHistoryModal = function() {
  const modalId = 'past-history-modal';
  if (document.getElementById(modalId)) document.getElementById(modalId).remove();

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4, currentYear - 5]; 
  
  let activeTab = 'self'; 
  let selectedYear = '2025';

  const modalHtml = `
    <div id="${modalId}" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; justify-content: center; align-items: center;">
      <div style="background: white; width: 900px; max-height: 90vh; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
        
        <div style="padding: 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #0f172a;">과거 검진이력</h2>
          <svg onclick="document.getElementById('${modalId}').remove()" width="24" height="24" fill="none" stroke="#64748b" stroke-width="2" viewBox="0 0 24 24" style="cursor: pointer;"><path d="M6 18L18 6M6 6l12 12"></path></svg>
        </div>

        <div style="padding: 24px; overflow-y: auto; flex: 1; background: #f8fafc;">
          
          <div style="display: flex; border-bottom: 1px solid #e2e8f0; margin-bottom: 24px;">
            <button id="${modalId}-tab-self" style="flex: 1; padding: 12px; background: #1e3a8a; color: white; border: none; font-size: 16px; font-weight: 700; cursor: pointer;">본인 신청</button>
            <button id="${modalId}-tab-family" style="flex: 1; padding: 12px; background: white; color: #64748b; border: 1px solid #e2e8f0; border-bottom: none; font-size: 16px; font-weight: 700; cursor: pointer;">가족 신청</button>
          </div>

          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
            <span style="font-size: 15px; font-weight: 700; color: #1e293b;">검진년도 선택</span>
            <select id="${modalId}-year" style="padding: 8px 32px 8px 12px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 15px; color: #1e293b; outline: none; appearance: none; background: url('data:image/svg+xml;utf8,<svg fill=\\'none\\' stroke=\\'%2364748b\\' stroke-width=\\'2\\' viewBox=\\'0 0 24 24\\' xmlns=\\'http://www.w3.org/2000/svg\\'><path d=\\'M6 9l6 6 6-6\\'></path></svg>') no-repeat right 8px center; background-size: 16px; background-color: white;">
              <option value="2025" selected>2025년</option>
              <option value="2024">2024년</option>
              <option value="2023">2023년</option>
              <option value="2022">2022년</option>
              <option value="2021">2021년</option>
            </select>
            <span style="font-size: 13px; color: #64748b;">* 최근 5년까지 조회 가능합니다. 신청 취소한 이력은 조회되지 않으며 최종 확정된 이력만 불러옵니다.</span>
          </div>

          <div id="${modalId}-content">
          </div>

        </div>

        <div style="padding: 24px; border-top: 1px solid #e2e8f0; display: flex; justify-content: center; background: white;">
          <button onclick="document.getElementById('${modalId}').remove()" style="padding: 12px 40px; background: white; color: #334155; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer;">닫기</button>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const tabSelf = document.getElementById(`${modalId}-tab-self`);
  const tabFamily = document.getElementById(`${modalId}-tab-family`);
  const yearSelect = document.getElementById(`${modalId}-year`);
  const contentArea = document.getElementById(`${modalId}-content`);

  const renderContent = () => {
    const emptyStateHtml = `
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 60px 20px; text-align: center; background: white;">
        <div style="width: 80px; height: 80px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
          <svg width="40" height="40" fill="none" stroke="#64748b" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path><circle cx="16" cy="16" r="4" stroke="#475569"></circle><path d="M19 19l2 2" stroke="#475569"></path></svg>
        </div>
        <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">${selectedYear}년 검진이력이 없습니다.</h3>
        <p style="font-size: 14px; color: #64748b; margin: 0;">다른 연도를 선택하시거나, 최근 5년 이내의 검진이력을 확인해 주세요.</p>
      </div>
    `;

    if (activeTab === 'self') {
      if (selectedYear !== '2025') {
        contentArea.innerHTML = emptyStateHtml;
      } else {
        contentArea.innerHTML = `
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="padding: 16px 24px; background: white; font-size: 16px; font-weight: 800; color: #0f172a; border-bottom: 1px solid #e2e8f0;">
              ${selectedYear}년 검진내역
            </div>
            <div style="padding: 16px 24px; display: flex; align-items: center; gap: 24px; font-size: 14px; color: #475569; border-bottom: 1px solid #e2e8f0; background: white;">
              <span>검진확정일 <span style="color: #cbd5e1; margin: 0 8px;">|</span> ${selectedYear}-05-20</span>
              <span>검진센터 <span style="color: #cbd5e1; margin: 0 8px;">|</span> 서울종합검진센터</span>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; text-align: center; background: white;">
              <tbody>
                <tr style="background: #f8fafc;">
                  <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 700; width: 20%; color: #334155;">검진 패키지명</td>
                  <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; text-align: left; font-weight: 600; width: 40%; color: #334155;">프리미엄 종합검진 패키지</td>
                  <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 700; width: 15%; color: #334155;">총 비용</td>
                  <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; font-weight: 800; color: #2563eb; width: 25%; text-align: right;">1,250,000원</td>
                </tr>
              </tbody>
            </table>
            <table style="width: 100%; border-collapse: collapse; text-align: center; background: white;">
              <thead>
                <tr style="background: #f1f5f9;">
                  <th style="padding: 12px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; color: #2563eb; font-weight: 700; font-size: 14px; width: 33.3%;">기본검사(장비검사)</th>
                  <th style="padding: 12px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; color: #1e293b; font-weight: 700; font-size: 14px; width: 33.3%;">선택검사</th>
                  <th style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: 700; font-size: 14px; width: 33.3%;">추가검사</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; text-align: left; vertical-align: top; line-height: 1.8; font-size: 14px; color: #334155;">
                    • 위내시경<br>• 복부초음파<br>• 흉부 X-ray<br>• 심전도<br>• 골밀도검사<br>• 안저촬영
                  </td>
                  <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; text-align: left; vertical-align: top; line-height: 1.8; font-size: 14px; color: #334155;">
                    • 대장내시경<br>• 갑상선초음파<br>• 심장초음파<br>• 경동맥초음파<br>• 저선량 폐CT
                  </td>
                  <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; text-align: left; vertical-align: top; line-height: 1.8; font-size: 14px; color: #334155;">
                    • 비타민 D<br>• 전립선특이항원(PSA)<br>• CA 19-9
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        `;
      }
    } else {
      if (selectedYear !== '2024') {
        contentArea.innerHTML = emptyStateHtml;
      } else {
      contentArea.innerHTML = `
        <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
          <div style="padding: 16px 24px; background: white; font-size: 16px; font-weight: 800; color: #0f172a; border-bottom: 1px solid #e2e8f0;">
            ${selectedYear}년 가족 검진이력
          </div>
          
          <!-- Family Member 1 -->
          <div style="padding: 16px 24px; display: flex; align-items: center; gap: 24px; font-size: 14px; color: #475569; border-bottom: 1px solid #e2e8f0; background: white;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 24px; height: 24px; background: #2563eb; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px;">1</span>
              <span style="font-size: 16px; font-weight: 800; color: #0f172a;">홍길동 (배우자)</span>
            </div>
            <span>생년월일 1985-03-15</span> <span style="color: #cbd5e1;">|</span>
            <span>검진확정일 ${selectedYear}-05-20</span> <span style="color: #cbd5e1;">|</span>
            <span>검진센터 서울종합검진센터</span>
          </div>

          <table style="width: 100%; border-collapse: collapse; text-align: center; background: white;">
            <tbody>
              <tr style="background: #f8fafc;">
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 700; width: 20%; color: #334155;">검진 패키지명</td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; text-align: left; font-weight: 600; width: 40%; color: #334155;">프리미엄 종합검진 패키지</td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 700; width: 15%; color: #334155;">총 비용</td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; font-weight: 800; color: #2563eb; width: 25%; text-align: right;">1,250,000원</td>
              </tr>
            </tbody>
          </table>
          <table style="width: 100%; border-collapse: collapse; text-align: center; background: white;">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="padding: 12px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; color: #2563eb; font-weight: 700; font-size: 14px; width: 33.3%;">기본검사(장비검사)</th>
                <th style="padding: 12px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; color: #1e293b; font-weight: 700; font-size: 14px; width: 33.3%;">선택검사</th>
                <th style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: 700; font-size: 14px; width: 33.3%;">추가검사</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; text-align: left; vertical-align: top; line-height: 1.8; font-size: 14px; color: #334155;">
                  • 위내시경<br>• 복부초음파<br>• 흉부 X-ray<br>• 심전도<br>• 골밀도검사<br>• 안저촬영
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; text-align: left; vertical-align: top; line-height: 1.8; font-size: 14px; color: #334155;">
                  • 대장내시경<br>• 갑상선초음파<br>• 심장초음파
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; text-align: left; vertical-align: top; line-height: 1.8; font-size: 14px; color: #334155;">
                  • 비타민 D<br>• 전립선특이항원(PSA)<br>• CA 19-9
                </td>
              </tr>
            </tbody>
          </table>
          
          <div style="height: 8px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;"></div>

          <!-- Family Member 2 -->
          <div style="padding: 16px 24px; display: flex; align-items: center; gap: 24px; font-size: 14px; color: #475569; border-bottom: 1px solid #e2e8f0; background: white;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 24px; height: 24px; background: #2563eb; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px;">2</span>
              <span style="font-size: 16px; font-weight: 800; color: #0f172a;">홍지민 (자녀)</span>
            </div>
            <span>생년월일 2010-08-25</span> <span style="color: #cbd5e1;">|</span>
            <span>검진확정일 ${selectedYear}-05-20</span> <span style="color: #cbd5e1;">|</span>
            <span>검진센터 서울종합검진센터</span>
          </div>

          <table style="width: 100%; border-collapse: collapse; text-align: center; background: white;">
            <tbody>
              <tr style="background: #f8fafc;">
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 700; width: 20%; color: #334155;">검진 패키지명</td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; text-align: left; font-weight: 600; width: 40%; color: #334155;">일반 종합검진 패키지</td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-weight: 700; width: 15%; color: #334155;">총 비용</td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; font-weight: 800; color: #2563eb; width: 25%; text-align: right;">650,000원</td>
              </tr>
            </tbody>
          </table>
          <table style="width: 100%; border-collapse: collapse; text-align: center; background: white;">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="padding: 12px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; color: #2563eb; font-weight: 700; font-size: 14px; width: 33.3%;">기본검사(장비검사)</th>
                <th style="padding: 12px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; color: #1e293b; font-weight: 700; font-size: 14px; width: 33.3%;">선택검사</th>
                <th style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: 700; font-size: 14px; width: 33.3%;">추가검사</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; text-align: left; vertical-align: top; line-height: 1.8; font-size: 14px; color: #334155;">
                  • 복부초음파<br>• 흉부 X-ray
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; text-align: left; vertical-align: top; line-height: 1.8; font-size: 14px; color: #334155;">
                  • 성장판 검사(X-ray)
                </td>
                <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; text-align: left; vertical-align: top; line-height: 1.8; font-size: 14px; color: #334155;">
                  • 비타민 D
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
      }
    }
  };

  const updateTabs = () => {
    if (activeTab === 'self') {
      tabSelf.style.background = '#1e3a8a';
      tabSelf.style.color = 'white';
      tabSelf.style.border = 'none';
      
      tabFamily.style.background = 'white';
      tabFamily.style.color = '#64748b';
      tabFamily.style.border = '1px solid #e2e8f0';
      tabFamily.style.borderBottom = 'none';
    } else {
      tabFamily.style.background = '#1e3a8a';
      tabFamily.style.color = 'white';
      tabFamily.style.border = 'none';
      
      tabSelf.style.background = 'white';
      tabSelf.style.color = '#64748b';
      tabSelf.style.border = '1px solid #e2e8f0';
      tabSelf.style.borderBottom = 'none';
    }
    renderContent();
  };

  tabSelf.onclick = () => { activeTab = 'self'; updateTabs(); };
  tabFamily.onclick = () => { activeTab = 'family'; updateTabs(); };
  yearSelect.onchange = (e) => { selectedYear = e.target.value; renderContent(); };

  updateTabs();
};


// ==========================================
// 건강정보 > 분야별 건강정보 (Health Information by Category)
// ==========================================

if (!window.healthCategories) {
  const savedCategories = localStorage.getItem('hc_health_categories');
  if (savedCategories) {
    window.healthCategories = JSON.parse(savedCategories);
  } else {
    window.healthCategories = [
      { id: 'women', label: '여성건강', icon: 'women_health' },
      { id: 'men', label: '남성건강', icon: 'men_health' },
      { id: 'senior', label: '노인건강', icon: 'senior_health' },
      { id: 'child', label: '어린이건강', icon: 'child_health' },
      { id: 'pregnancy', label: '임신과 출산', icon: 'pregnancy' },
      { id: 'obesity', label: '비만', icon: 'obesity' },
      { id: 'alcohol', label: '술과 담배', icon: 'alcohol' },
      { id: 'cancer', label: '암정보', icon: 'cancer' },
      { id: 'dementia', label: '치매예방', icon: 'dementia' }
    ];
    localStorage.setItem('hc_health_categories', JSON.stringify(window.healthCategories));
  }
}

if (typeof window.activeHealthCategoryIdx === 'undefined') {
  window.activeHealthCategoryIdx = 0;
}
if (typeof window.healthSortType === 'undefined') {
  window.healthSortType = 'latest';
}
if (typeof window.visibleHealthPostCount === 'undefined') {
  window.visibleHealthPostCount = 5;
}
if (typeof window.selectedHealthPostId === 'undefined') {
  window.selectedHealthPostId = null;
}

window.getHealthPostImage = function(postId, categoryId) {
  const images = {
    women: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    men: "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?auto=format&fit=crop&w=1200&q=80",
    senior: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80",
    child: "https://images.unsplash.com/photo-1471286174240-e729b5e79e05?auto=format&fit=crop&w=1200&q=80",
    pregnancy: "https://images.unsplash.com/photo-1518104593124-ac2e82a5eb9d?auto=format&fit=crop&w=1200&q=80",
    obesity: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
    alcohol: "https://images.unsplash.com/photo-1527137341206-efe28d54d930?auto=format&fit=crop&w=1200&q=80",
    cancer: "https://images.unsplash.com/photo-1579684389782-64d84b5e901d?auto=format&fit=crop&w=1200&q=80",
    dementia: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80"
  };
  return images[categoryId] || "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80";
};

window.getHealthPostDetailedText = function(post) {
  if (post.details) return post.details;

  const detailsMap = {
    w1: `
      <p>빈혈은 혈액 내 적혈구 수나 헤모글로빈 농도가 정상치보다 낮아져 몸의 각 조직에 충분한 산소를 공급하지 못하는 상태를 말합니다. 특히 가임기 여성의 약 30%가 겪을 정도로 흔한 질환입니다.</p>
      
      <h5 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 20px 0 10px 0;">빈혈이 여성에게 자주 발생하는 주된 원인</h5>
      <p>가장 흔한 원인은 '철결핍성 빈혈'입니다. 매월 발생하는 생리로 인한 혈액 손실, 임신과 출산 과정에서의 철분 요구량 급증, 극단적인 다이어트로 인한 철분 섭취 부족 등이 주요 원인입니다.</p>
      
      <h5 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 20px 0 10px 0;">주요 증상 및 자가 진단</h5>
      <p>피로감과 전신 쇠약감이 대표적이며, 조금만 움직여도 숨이 차거나 가슴이 두근거립니다. 피부가 창백해지고 손톱이 쉽게 갈라지거나 숟가락 모양으로 휠 수 있으며, 집중력 저하, 어지러움, 두통 등도 동반됩니다.</p>
      
      <h5 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 20px 0 10px 0;">효과적인 예방 및 식습관 수칙</h5>
      <ol style="padding-left: 20px; line-height: 1.8;">
        <li><strong>철분이 풍부한 식품 섭취:</strong> 붉은 살코기, 간, 굴, 달걀노른자, 시금치, 미역 등을 자주 섭취하세요.</li>
        <li><strong>비타민 C 동시 섭취:</strong> 비타민 C는 철분의 체내 흡수율을 2~3배 높여줍니다. 신선한 과일과 채소를 함께 드세요.</li>
        <li><strong>식후 차/커피 제한:</strong> 차의 탄닌 성분과 커피의 카페인은 철분 흡수를 방해하므로, 식사 전후 1시간 내에는 피하는 것이 좋습니다.</li>
      </ol>
    `,
    w2: `
      <p>갱년기는 여성의 난소 기능이 노화되면서 여성호르몬 분비가 급격히 감소하고, 이로 인해 생리 폐경을 전후한 수년간의 과도기를 뜻합니다. 보통 40대 중후반에 시작하여 신체적, 정신적으로 급격한 변화를 겪게 됩니다.</p>
      
      <h5 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 20px 0 10px 0;">주요 신체 및 심리 증상</h5>
      <p>가장 흔한 급성 증상은 '안면홍조'와 '발한'입니다. 갑자기 얼굴과 상체가 화끈거리며 땀이 비 오듯 쏟아집니다. 또한 호르몬 변화로 인한 자율신경 불균형으로 불면증, 감정 변화(우울감, 짜증), 기억력 감퇴 등을 겪게 되며, 장기적으로는 골다공증과 심혈관 질환 위험이 증가합니다.</p>
      
      <h5 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 20px 0 10px 0;">명쾌한 관리 가이드</h5>
      <ul style="padding-left: 20px; line-height: 1.8;">
        <li><strong>규칙적인 유산소 및 근력 운동:</strong> 뼈 건강을 지키고 우울감을 낮추는 데 걷기, 자전거, 요가가 훌륭한 대안입니다.</li>
        <li><strong>식습관 개선:</strong> 콩, 석류 등 천연 식물성 에스트로겐이 풍부한 식품과 칼슘, 비타민D를 충분히 섭취하세요.</li>
        <li><strong>적절한 수면 환경:</strong> 방을 시원하게 유지하고 얇은 옷을 여러 겹 입어 체온 변화에 대처하세요.</li>
      </ul>
    `,
    p1: `
      <p>임신 기간 동안 엄마와 태아의 건강 상태를 모니터링하고 발생할 수 있는 위험 요소를 사전에 예방하기 위해 주기적인 산전 검사는 필수적입니다. 임신 주수별로 받아야 하는 주요 검사 항목들을 정리했습니다.</p>
      
      <h5 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 20px 0 10px 0;">초기 (1주 ~ 11주)</h5>
      <p>임신 사실을 확인하고 태아의 착상태를 확인하는 시기입니다. 초음파 검사를 통해 아기집의 위치와 태아 심장박동을 관찰하며, 산모의 건강 상태 분석을 위한 기초 혈액검사, 소변검사, 자궁경부암 검사 등이 이루어집니다.</p>
      
      <h5 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 20px 0 10px 0;">중기 (12주 ~ 28주)</h5>
      <p>태아가 안정적으로 자라는 시기로 기형아 검사가 중점적으로 진행됩니다. 11~13주경 입체초음파로 목덜미 투명대를 측정하고, 15~20주경 2차 기형아 검사(쿼드 검사 등)를 진행합니다. 또한 24~28주 사이에는 산모에게 위험할 수 있는 임신성 당뇨 검사(임당 검사)를 받게 됩니다.</p>
      
      <h5 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 20px 0 10px 0;">후기 (29주 ~ 출산)</h5>
      <p>출산을 대비하여 태아의 위치와 크기, 양수의 양을 수시로 체크하며 태동 검사를 실시합니다. 임신 중독증 발병 여부를 감시하기 위해 방문 시마다 혈압과 단백뇨를 검사합니다.</p>
    `
  };

  const defaultDetail = `
    <p>${post.summary}</p>
    <p>본 정보는 독자들의 이해를 돕기 위해 작성된 일반적인 건강 관리 가이드라인입니다. 개개인의 고유한 체질과 기존 기저 질환, 현재의 신체 상태에 따라 효과적인 관리법과 영양 섭취 기준은 크게 다를 수 있습니다.</p>
    <h5 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 20px 0 10px 0;">일상에서의 주요 수칙</h5>
    <p>균형 잡힌 식단과 하루 30분 이상의 가벼운 유산소 운동을 실천하고, 스트레스를 조절하며 규칙적으로 수면을 취하는 것은 모든 건강 관리의 가장 기본적이고 강력한 기초입니다.</p>
    <p>만약 일상생활에 지장을 줄 정도의 심한 통증이나 갑작스러운 이상 증상이 지속된다면, 민간요법이나 인터넷 검색에만 의존하지 마시고 즉시 가까운 병원을 찾아 전문 의료진의 진료와 정밀 검사를 받으시길 권장합니다.</p>
  `;

  return detailsMap[post.id] || defaultDetail;
};

window.viewHealthPost = function(postId) {
  const allPosts = [];
  Object.keys(window.healthPosts).forEach(catId => {
    allPosts.push(...window.healthPosts[catId]);
  });
  const post = allPosts.find(p => p.id === postId);
  if (post) {
    post.views = (post.views || 0) + 1;
    
    // Save updated posts back to localStorage
    localStorage.setItem('hc_health_posts_by_cat', JSON.stringify(window.healthPosts));

    // Find the category label
    let postCategory = window.healthCategories.find(cat => {
      const posts = window.healthPosts[cat.id] || [];
      return posts.some(p => p.id === post.id);
    });
    const catLabel = postCategory ? postCategory.label : '기타';
    
    // Record click log
    try {
      const logs = JSON.parse(localStorage.getItem('hc_health_clicks_log') || '[]');
      const now = new Date();
      
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const clickDate = `${yyyy}-${mm}-${dd}`;
      
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      const clickTime = `${hh}:${min}:${ss}`;

      const clientName = state.activeClient ? (state.activeClient.name || state.activeClient.id) : '일반고객';
      const clientId = state.activeClient ? state.activeClient.id : 'unknown';
      const userName = state.currentUser ? state.currentUser.name : '비회원';

      logs.push({
        id: 'click_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        clickDate: clickDate,
        clickTime: clickTime,
        postId: postId,
        postTitle: post.title,
        categoryId: postCategory ? postCategory.id : 'unknown',
        categoryLabel: catLabel,
        clientId: clientId,
        clientName: clientName,
        userName: userName
      });
      localStorage.setItem('hc_health_clicks_log', JSON.stringify(logs));
    } catch(e) {
      console.error('Failed to log health post click:', e);
    }
  }
  window.selectedHealthPostId = postId;
  render();
};

window.backToHealthList = function() {
  window.selectedHealthPostId = null;
  render();
};

if (!window.healthPosts) {
  const savedPosts = localStorage.getItem('hc_health_posts_by_cat');
  if (savedPosts) {
    window.healthPosts = JSON.parse(savedPosts);
  } else {
    window.healthPosts = {
      women: [
        { id: 'w1', title: '여성에게 자주 발생하는 빈혈, 원인과 예방법', summary: '빈혈은 여성에게 흔하게 나타나는 질환 중 하나입니다. 특히 생리, 임신, 출산 등으로 인해 철분이 부족해지기 쉬우며, 피로감, 어지러움, 두통 등의 증상을 유발할 수 있습니다. 균형 잡힌 식사와 적절한 철분 섭취가 중요합니다.', date: '2024.05.20', views: 1254 },
        { id: 'w2', title: '갱년기 증상, 이렇게 관리해보세요', summary: '갱년기는 여성의 삶에서 자연스러운 변화 과정입니다. 안면홍조, 불면, 우울감 등이 나타날 수 있으며, 규칙적인 운동과 건강한 식습관, 스트레스 관리가 증상 완화에 도움이 됩니다.', date: '2024.05.18', views: 982 },
        { id: 'w3', title: '자궁경부암 예방접종, 언제 맞아야 할까요?', summary: '자궁경부암은 예방이 가능한 대표적인 암입니다. HPV 예방접종은 성 경험 전 접종이 가장 효과적이며, 정기적인 검진도 매우 중요합니다.', date: '2024.05.15', views: 1102 },
        { id: 'w4', title: '여성 건강을 위한 필수 영양소', summary: '여성의 건강 유지를 위해서는 철분, 칼슘, 비타민D, 엽산 등의 섭취가 중요합니다. 연령대별로 필요한 영양소를 확인하고, 식단을 통해 골고루 섭취하세요.', date: '2024.05.12', views: 843 },
        { id: 'w5', title: '생리통 완화에 도움이 되는 생활습관', summary: '생리통은 많은 여성들이 겪는 불편함입니다. 따뜻한 찜질, 가벼운 스트레칭, 카페인 줄이기 등의 생활습관 개선으로 통증을 완화할 수 있습니다.', date: '2024.05.10', views: 732 },
        { id: 'w6', title: '여성 유방 건강과 자가 진단법', summary: '유방암은 유방 건강을 해치는 주된 원인 중 하나입니다. 한 달에 한 번 생리가 끝난 후 3~5일 사이에 유방을 만져보며 멍울이 있는지 정기적으로 확인하는 습관이 필요합니다.', date: '2024.05.05', views: 612 }
      ],
      men: [
        { id: 'm1', title: '남성 갱년기 극복을 위한 생활 수칙', summary: '남성도 나이가 들면서 테스토스테론 호르몬 감소로 갱년기를 겪을 수 있습니다. 무기력감, 근력 저하 등이 나타나며 규칙적인 근력 운동과 충분한 수면이 예방에 필수적입니다.', date: '2024.05.19', views: 884 },
        { id: 'm2', title: '전립선비대증, 방치하면 안 되는 이유', summary: '전립선비대증은 50대 이상 남성에게 흔한 질환으로, 소변 줄기가 약해지거나 자주 마려운 증상을 보입니다. 초기 치료를 통해 요폐 등의 합병증을 막아야 합니다.', date: '2024.05.16', views: 941 },
        { id: 'm3', title: '젊은 탈모 환자 급증, 원인과 치료법은?', summary: '탈모는 유전적 요인 외에도 스트레스, 영양 불균형 등으로 발생합니다. 조기 진단과 치료약 복용이 가장 효과적이며 자가 치료에 의존하지 말아야 합니다.', date: '2024.05.14', views: 1205 },
        { id: 'm4', title: '남성의 심장 건강을 지키는 식습관', summary: '심혈관 질환은 남성 사망 원인의 큰 비중을 차지합니다. 포화지방 섭취를 줄이고 오메가-3가 풍부한 생선과 채소 위주의 식단을 구성하는 것이 도움이 됩니다.', date: '2024.05.11', views: 654 }
      ],
      senior: [
        { id: 's1', title: '어르신 낙상 사고 예방을 위한 가정 내 환경 개선', summary: '노년기 낙상은 단순한 골절을 넘어 심각한 합병증으로 이어질 수 있습니다. 화장실 미끄럼 방지 매트 설치, 문턱 제거, 야간 조명 설치가 필수적입니다.', date: '2024.05.21', views: 1109 },
        { id: 's2', title: '근감소증 예방을 위한 단백질 섭취 가이드', summary: '나이가 들면서 근육량이 급격히 감소하는 근감소증은 낙상과 대사질환의 원인이 됩니다. 매끼 단백질을 섭취하고 가벼운 저항성 운동을 병행해야 합니다.', date: '2024.05.17', views: 823 },
        { id: 's3', title: '노년기 외로움과 우울증 대처 방법', summary: '음퇴와 사회적 관계 축소는 노인 우울증의 주원인입니다. 주기적인 야외 활동과 지역 커뮤니티 참여, 가족들과의 대화가 정신 건강을 지켜줍니다.', date: '2024.05.13', views: 592 }
      ],
      child: [
        { id: 'c1', title: '우리 아이 면역력 키우는 5가지 습관', summary: '환절기마다 감기에 걸리는 아이를 위해 충분한 수면, 균형 잡힌 영양 섭취, 실내 습도 조절, 주기적인 야외 활동 등으로 기초 면역력을 높여주어야 합니다.', date: '2024.05.20', views: 1045 },
        { id: 'c2', title: '소아 비만 예방을 위한 가족 식습관 개선', summary: '소아 비만은 성인 비만으로 이어질 확률이 매우 높습니다. 패스트푸드를 줄이고 온 가족이 함께 식사하며 천천히 먹는 습관을 기르는 것이 좋습니다.', date: '2024.05.15', views: 765 },
        { id: 'c3', title: '어린이 스마트폰 증후군과 눈 건강 지키기', summary: '과도한 스마트폰 사용은 소아 약시나 안구건조증의 원인이 됩니다. 20분 사용 후 20초간 먼 곳을 바라보게 하고, 하루 사용 시간을 제한해야 합니다.', date: '2024.05.10', views: 912 }
      ],
      pregnancy: [
        { id: 'p1', title: '임신 주수별 필수 검사 리스트', summary: '건강한 출산을 위해 주수별 기형아 검사, 정밀 초음파, 임신성 당뇨 검사 등을 제때 받아야 합니다. 시기별 필수 검사 일정을 미리 체크해보세요.', date: '2024.05.22', views: 1354 },
        { id: 'p2', title: '임산부에게 좋은 음식과 피해야 할 음식', summary: '엽산이 풍부한 녹색 채소, 철분이 많은 붉은 고기는 임산부에게 유익합니다. 반면 날생선, 익히지 않은 고기, 과도한 카페인은 주의가 필요합니다.', date: '2024.05.18', views: 1102 },
        { id: 'p3', title: '산후 우울증 극복을 위한 가족의 역할', summary: '급격한 호르몬 변화와 육아 스트레스로 많은 산모들이 산후 우울증을 겪습니다. 남편의 적극적인 육아 참여와 정서적 지지가 가장 큰 약입니다.', date: '2024.05.14', views: 832 }
      ],
      obesity: [
        { id: 'o1', title: '요요 현상 없는 지속 가능한 다이어트 비법', summary: '무리한 굶기 다이어트는 기초대사량을 떨어뜨려 요요를 유발합니다. 주당 0.5kg 감량을 목표로 규칙적인 삼시 세끼와 근력 운동을 유지하는 것이 핵심입니다.', date: '2024.05.20', views: 1421 },
        { id: 'o2', title: '마른 비만의 위험성과 자가 진단법', summary: '몸무게는 정상이지만 체지방률이 높은 마른 비만은 고혈압, 당뇨 등 대사질환의 위험이 더 큽니다. 근육량 부족이 원인이므로 근력 운동이 필수적입니다.', date: '2024.05.16', views: 1184 },
        { id: 'o3', title: '식욕을 조절하는 호르몬 다스리기', summary: '포만감을 느끼게 하는 렙틴과 식욕을 돋우는 그렐린 호르몬은 수면 부족과 스트레스 시 균형이 깨집니다. 하루 7시간 이상 숙면하는 것이 중요합니다.', date: '2024.05.11', views: 954 }
      ],
      alcohol: [
        { id: 'a1', title: '금연 성공률을 높이는 실천 가이드', summary: '금연은 혼자 힘으로 성공하기 어렵습니다. 금연클리닉 방문, 니코틴 대체요법 사용, 물 자주 마시기 등 구체적인 계획을 세우고 주변에 선언하세요.', date: '2024.05.21', views: 978 },
        { id: 'a2', title: '숙취 해소에 좋은 음식과 잘못된 상식', summary: '숙취 해소에는 아스파라긴산이 풍부한 콩나물국이나 북어국이 좋습니다. 꿀물도 수분과 당분을 공급해 주지만, 해장술이나 매운 짬뽕은 위벽을 자극하므로 피해야 합니다.', date: '2024.05.17', views: 1120 },
        { id: 'a3', title: '알코올이 뇌 건강에 미치는 악영향', summary: '지속적인 과음은 뇌 세포를 손상시켜 기억력 저하와 알코올성 치매를 유발할 수 있습니다. 건강을 지키기 위한 주당 적정 음주량을 알아봅니다.', date: '2024.05.12', views: 812 }
      ],
      cancer: [
        { id: 'can1', title: '국가 5대 암 검진 주기와 대상자 확인하기', summary: '위암, 대장암, 간암, 유방암, 자궁경부암은 조기에 발견하면 완치율이 매우 높습니다. 연령별, 성별 검진 주기를 놓치지 말고 신청하세요.', date: '2024.05.22', views: 1532 },
        { id: 'can2', title: '항암 치료 중 식사 요령과 영양 관리', summary: '항암 치료 중에는 구토, 입맛 변화 등으로 영양 결핍이 오기 쉽습니다. 조금씩 자주 섭취하고, 고단백·고칼로리 식단으로 체력을 유지하는 것이 최우선입니다.', date: '2024.05.19', views: 994 },
        { id: 'can3', title: '암을 예방하는 건강한 생활 습관 10계명', summary: '암 예방의 첫걸음은 생활습관 개선입니다. 금연, 절주, 싱겁게 먹기, 주 5회 운동, 정기 검진 등 일상에서 실천 가능한 예방 수칙을 소개합니다.', date: '2024.05.15', views: 1204 }
      ],
      dementia: [
        { id: 'd1', title: '초로기 치매란? 젊다고 안심할 수 없는 이유', summary: '65세 미만에 발병하는 초로기 치매는 진행 속도가 빠르고 인지장애 외에도 성격 변화가 먼저 나타날 수 있습니다. 조기 발견을 위한 자가진단 항목을 소개합니다.', date: '2024.05.20', views: 1402 },
        { id: 'd2', title: '치매 예방에 좋은 \'뇌 훈련\' 생활 습관', summary: '독서, 일기 쓰기, 새로운 언어 배우기 등 뇌를 끊임없이 자극하는 활동은 인지 예비능을 높여 치매 발병을 늦춰줍니다. 매일 실천할 수 있는 훈련법을 알아봅니다.', date: '2024.05.17', views: 1245 },
        { id: 'd3', title: '치매를 예방하는 지중해식 식단의 효과', summary: '올리브유, 견과류, 신선한 야채와 생선 위주의 지중해식 식단은 뇌 혈관 건강을 지키고 치매 위험을 30% 이상 낮춰준다는 연구 결과가 있습니다.', date: '2024.05.13', views: 1025 }
      ]
    };
    localStorage.setItem('hc_health_posts_by_cat', JSON.stringify(window.healthPosts));
  }
}

window.getHealthIcon = function(iconType) {
  if (iconType && iconType.length <= 4) {
    return `
      <div style="
        width: 48px; 
        height: 48px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 28px; 
        background: rgba(var(--theme-color-rgb), 0.08); 
        border-radius: 50%;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.03);
      ">
        ${iconType}
      </div>
    `;
  }

  switch(iconType) {
    case 'women_health':
      return `
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="18" r="10" stroke="#f472b6" stroke-width="3" stroke-linecap="round"/>
          <path d="M24 28V42M18 35H30" stroke="#f472b6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 18C12 11.3726 17.3726 6 24 6" stroke="#ec4899" stroke-width="3" stroke-linecap="round"/>
        </svg>
      `;
    case 'men_health':
      return `
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="28" r="10" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
          <path d="M27 21L38 10M30 10H38V18" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20 18C25.5228 18 30 22.4772 30 28" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/>
        </svg>
      `;
    case 'senior_health':
      return `
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 28C16 22 20.5 17 24 17C27.5 17 32 22 32 28" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round"/>
          <circle cx="17" cy="30" r="4" stroke="#a78bfa" stroke-width="2"/>
          <circle cx="31" cy="30" r="4" stroke="#a78bfa" stroke-width="2"/>
          <path d="M21 30H27" stroke="#8b5cf6" stroke-width="2"/>
          <path d="M24 8V17M20 11H28" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round"/>
        </svg>
      `;
    case 'child_health':
      return `
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="20" r="9" stroke="#10b981" stroke-width="3"/>
          <path d="M14 36C14 30.5 18.5 29 24 29C29.5 29 34 30.5 34 36" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
          <path d="M20 16C20 16 22 18 24 18C26 18 28 16 28 16" stroke="#059669" stroke-width="2" stroke-linecap="round"/>
          <circle cx="16" cy="10" r="2" fill="#10b981"/>
          <circle cx="32" cy="10" r="2" fill="#10b981"/>
        </svg>
      `;
    case 'pregnancy':
      return `
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 8C20 11 18 13 18 15C18 19 25 21 25 27C25 32 20 37 20 40" stroke="#f97316" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M25 21C29.4183 21 33 24.5817 33 29C33 33.4183 29.4183 37 25 37" stroke="#ea580c" stroke-width="3" stroke-linecap="round"/>
          <path d="M23 29C23 27.9 23.9 27 25 27C26.1 27 27 27.9 27 29C27 30.1 26.1 31 25 31" fill="#f97316"/>
        </svg>
      `;
    case 'obesity':
      return `
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="10" width="32" height="28" rx="6" stroke="#06b6d4" stroke-width="3"/>
          <circle cx="24" cy="24" r="8" stroke="#06b6d4" stroke-width="3"/>
          <path d="M24 24L28 18" stroke="#0891b2" stroke-width="3" stroke-linecap="round"/>
          <path d="M14 10V14M34 10V14" stroke="#06b6d4" stroke-width="2"/>
        </svg>
      `;
    case 'alcohol':
      return `
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 10H24V28H16V10Z" stroke="#f59e0b" stroke-width="3" stroke-linejoin="round"/>
          <path d="M20 10V6H20" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
          <path d="M28 24H38V28H28" stroke="#b45309" stroke-width="2" stroke-linecap="round"/>
          <path d="M38 24L38 32" stroke="#b45309" stroke-width="2" stroke-linecap="round"/>
          <line x1="33" y1="28" x2="33" y2="34" stroke="#d97706" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;
    case 'cancer':
      return `
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 40C16 30 20 22 24 14C28 22 32 30 32 40" stroke="#a855f7" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M14 30C18 30 21 22 24 14C27 22 30 30 34 30" stroke="#a855f7" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    case 'dementia':
      return `
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 40C17.5 40 14 36 14 29C14 26 15 24 17 22C16 18 19 12 24 12C29 12 32 18 31 22C33 24 34 26 34 29C34 36 30.5 40 24 40Z" stroke="#ec4899" stroke-width="3" stroke-linejoin="round"/>
          <path d="M24 12V40" stroke="#ec4899" stroke-width="2"/>
          <path d="M19 28H29" stroke="#db2777" stroke-width="2"/>
        </svg>
      `;
    case 'plus':
      return `
        <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 10V38M10 24H38" stroke="#64748b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    default:
      return `
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="14" width="28" height="24" rx="4" stroke="var(--theme-color)" stroke-width="3"/>
          <path d="M24 8V14M18 10H30" stroke="var(--theme-color)" stroke-width="3" stroke-linecap="round"/>
          <path d="M24 20V32M18 26H30" stroke="var(--theme-color)" stroke-width="3" stroke-linecap="round"/>
        </svg>
      `;
  }
};

window.renderCategoryHealthInfo = function() {
  const currentCategory = window.healthCategories[window.activeHealthCategoryIdx];
  if (!currentCategory) return '<div>선택된 카테고리가 없습니다.</div>';

  if (window.selectedHealthPostId) {
    const allPosts = [];
    Object.keys(window.healthPosts).forEach(catId => {
      allPosts.push(...window.healthPosts[catId]);
    });
    const post = allPosts.find(p => p.id === window.selectedHealthPostId);
    if (post) {
      let postCategory = window.healthCategories.find(cat => {
        const posts = window.healthPosts[cat.id] || [];
        return posts.some(p => p.id === post.id);
      }) || currentCategory;

      const imgUrl = window.getHealthPostImage(post.id, postCategory.id);
      const detailBodyHtml = window.getHealthPostDetailedText(post);

      return `
        <div class="health-post-detail-container" style="animation: fadeIn 0.4s ease-out; background: #fff; padding: 0;">
          <!-- Breadcrumbs and Back Button -->
          <div style="margin-bottom: 24px;">
            <button onclick="window.backToHealthList()" style="
              display: flex;
              align-items: center;
              gap: 8px;
              background: none;
              border: none;
              color: var(--theme-color);
              font-size: 15px;
              font-weight: 700;
              cursor: pointer;
              padding: 0;
              transition: transform 0.2s ease;
            "
            onmouseover="this.style.transform='translateX(-4px)';"
            onmouseout="this.style.transform='none';">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              목록으로 돌아가기
            </button>
          </div>

          <!-- Article Header -->
          <div style="margin-bottom: 24px; border-bottom: 2px solid #0f172a; padding-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <span style="
                background: rgba(var(--theme-color-rgb), 0.1);
                color: var(--theme-color);
                font-size: 12px;
                font-weight: 800;
                padding: 4px 10px;
                border-radius: 20px;
                letter-spacing: -0.3px;
              ">${postCategory.label}</span>
            </div>
            <h2 style="
              margin: 0 0 16px 0;
              font-size: 28px;
              font-weight: 850;
              color: #0f172a;
              line-height: 1.35;
              letter-spacing: -0.8px;
            ">${post.title}</h2>
            <div style="
              display: flex;
              align-items: center;
              gap: 16px;
              font-size: 14px;
              color: #94a3b8;
              font-weight: 600;
            ">
              <span>작성일 ${post.date}</span>
              <span style="width: 1px; height: 12px; background: #cbd5e1;"></span>
              <span>조회수 ${post.views.toLocaleString()}회</span>
            </div>
          </div>

          <!-- Feature Image -->
          <div style="
            width: 100%;
            height: 380px;
            border-radius: 16px;
            overflow: hidden;
            margin-bottom: 32px;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
          ">
            <img src="${imgUrl}" alt="${post.title}" style="
              width: 100%;
              height: 100%;
              object-fit: cover;
            ">
          </div>

          <!-- Article Body -->
          <div style="
            font-size: 16px;
            color: #334155;
            line-height: 1.8;
            letter-spacing: -0.3px;
            word-break: keep-all;
            margin-bottom: 40px;
          ">
            ${detailBodyHtml}
          </div>

          <!-- Bottom Actions -->
          <div style="
            border-top: 1px solid #e2e8f0;
            padding-top: 24px;
            display: flex;
            justify-content: center;
          ">
            <button onclick="window.backToHealthList()" style="
              padding: 12px 32px;
              background: #0f172a;
              color: #fff;
              border: none;
              border-radius: 8px;
              font-size: 15px;
              font-weight: 700;
              cursor: pointer;
              transition: opacity 0.2s ease;
            "
            onmouseover="this.style.opacity='0.9';"
            onmouseout="this.style.opacity='1';">목록으로</button>
          </div>
        </div>
      `;
    }
  }

  let categoryPosts = window.healthPosts[currentCategory.id] || [];

  if (window.healthSortType === 'latest') {
    categoryPosts.sort((a, b) => b.date.localeCompare(a.date));
  } else if (window.healthSortType === 'popular') {
    categoryPosts.sort((a, b) => b.views - a.views);
  } else if (window.healthSortType === 'alphabet') {
    categoryPosts.sort((a, b) => a.title.localeCompare(b.title));
  }

  const totalPosts = categoryPosts.length;
  const visiblePosts = categoryPosts.slice(0, window.visibleHealthPostCount);

  const cardsHtml = window.healthCategories.map((cat, idx) => {
    const isActive = idx === window.activeHealthCategoryIdx;
    const cardBorderColor = isActive ? 'var(--theme-color)' : '#cbd5e1';
    const cardBgColor = isActive ? 'rgba(var(--theme-color-rgb), 0.04)' : '#fff';
    const cardTextColor = isActive ? 'var(--theme-color)' : '#334155';
    const activeClass = isActive ? 'active-health-card' : '';

    return `
      <div class="health-category-card ${activeClass}" 
           onclick="window.selectHealthCategory(${idx})" 
           style="
             border: 1.5px solid ${cardBorderColor};
             background-color: ${cardBgColor};
             color: ${cardTextColor};
             border-radius: 16px;
             padding: 24px;
             display: flex;
             flex-direction: column;
             align-items: center;
             justify-content: center;
             gap: 12px;
             cursor: pointer;
             transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
             min-height: 140px;
             box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.01);
           "
           onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 20px -8px rgba(var(--theme-color-rgb), 0.15)';"
           onmouseout="this.style.transform='none'; this.style.boxShadow='none';">
        <div class="health-category-icon" style="transition: transform 0.25s ease;">
          ${window.getHealthIcon(cat.icon)}
        </div>
        <div style="font-weight: 700; font-size: 15px; letter-spacing: -0.3px; text-align: center;">${cat.label}</div>
      </div>
    `;
  }).join('');

  const gridHtml = `
    <div style="
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 18px;
      margin-bottom: 24px;
    ">
      ${cardsHtml}
    </div>
  `;

  const latestSelected = window.healthSortType === 'latest' ? 'selected' : '';
  const popularSelected = window.healthSortType === 'popular' ? 'selected' : '';
  const alphabetSelected = window.healthSortType === 'alphabet' ? 'selected' : '';

  const postsHtml = visiblePosts.map(post => {
    return `
      <div class="health-post-row" style="
        background: #fff;
        border: 1px solid #f1f5f9;
        border-bottom: 1.5px solid #e2e8f0;
        padding: 24px;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        gap: 10px;
        position: relative;
        cursor: pointer;
      "
      onclick="window.viewHealthPost('${post.id}')"
      onmouseover="this.style.backgroundColor='#fafafa';"
      onmouseout="this.style.backgroundColor='#fff';">
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        ">
          <h4 style="
            margin: 0;
            font-size: 17px;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.4;
            letter-spacing: -0.3px;
          ">${post.title}</h4>
          <div style="
            font-size: 13px;
            color: #94a3b8;
            font-weight: 600;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 12px;
          ">
            <span>${post.date}</span>
            <span style="width: 1px; height: 12px; background: #e2e8f0;"></span>
            <span style="color: #64748b;">조회수 ${post.views.toLocaleString()}</span>
          </div>
        </div>
        <p style="
          margin: 0;
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
          word-break: keep-all;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        ">${post.summary}</p>
      </div>
    `;
  }).join('');

  const hasMore = totalPosts > window.visibleHealthPostCount;
  const showMoreBtnHtml = hasMore ? `
    <div style="display: flex; justify-content: center; margin-top: 24px;">
      <button onclick="window.showMorePosts()" style="
        width: 100%;
        padding: 16px;
        background: #fff;
        border: 1.5px solid #cbd5e1;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 700;
        color: #475569;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: all 0.2s ease;
      "
      onmouseover="this.style.background='#f8fafc'; this.style.borderColor='#94a3b8';"
      onmouseout="this.style.background='#fff'; this.style.borderColor='#cbd5e1';">
        더보기 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
    </div>
  ` : '';

  return `
    <div class="health-info-container" style="animation: fadeIn 0.4s ease-out;">
      
      <style>
        .health-category-card.active-health-card {
          border-color: var(--theme-color) !important;
          background-color: rgba(var(--theme-color-rgb), 0.03) !important;
          box-shadow: 0 8px 16px -4px rgba(var(--theme-color-rgb), 0.12) !important;
        }
        .health-category-card.active-health-card .health-category-icon {
          transform: scale(1.08);
        }
      </style>

      <p style="color: #64748b; font-size: 15px; margin: -20px 0 24px 0; line-height: 1.5; font-weight: 500;">다양한 건강정보를 분야별로 확인하실 수 있습니다.</p>

      <div style="
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        padding: 32px;
        box-shadow: 0 4px 20px -2px rgba(0,0,0,0.03);
        margin-bottom: 32px;
      ">
        <div style="display: flex; justify-content: flex-end; font-size: 13px; color: #64748b; font-weight: 600; margin-bottom: 16px;">
          원하는 분야를 선택하시면 관련 정보를 확인하실 수 있습니다.
        </div>
        ${gridHtml}
      </div>

      <div style="margin-bottom: 16px;">
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0 16px 0;
          border-bottom: 2px solid #0f172a;
          margin-bottom: 0px;
        ">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="width: 4px; height: 18px; background: var(--theme-color); border-radius: 10px; display: inline-block;"></span>
            <span style="font-size: 18px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">${currentCategory.label}</span>
            <span style="font-size: 14px; font-weight: 600; color: #64748b; margin-left: 6px;">총 ${totalPosts}건</span>
          </div>

          <div>
            <select onchange="window.sortHealthPosts(this.value)" style="
              padding: 8px 16px;
              border: 1px solid #cbd5e1;
              border-radius: 6px;
              font-size: 13px;
              font-weight: 700;
              color: #475569;
              background: #fff;
              outline: none;
              cursor: pointer;
            ">
              <option value="latest" ${latestSelected}>최신순</option>
              <option value="popular" ${popularSelected}>인기순</option>
              <option value="alphabet" ${alphabetSelected}>가나다순</option>
            </select>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; background: #fff; border-radius: 0 0 12px 12px; overflow: hidden; border: 1px solid #e2e8f0; border-top: none;">
          ${postsHtml || `
            <div style="padding: 60px; text-align: center; color: #94a3b8; font-weight: 600; font-size: 15px;">
              등록된 건강정보가 없습니다.
            </div>
          `}
        </div>

        ${showMoreBtnHtml}
      </div>

      <div style="margin-top: 32px; display: flex; align-items: flex-start; gap: 8px; color: #94a3b8; font-size: 12px; font-weight: 500; line-height: 1.5;">
        <span>*</span>
        <div>제공되는 건강정보는 참고용이며, 질병의 진단 및 치료를 대체할 수 없습니다.</div>
      </div>

    </div>
  `;
};

window.selectHealthCategory = function(index) {
  window.activeHealthCategoryIdx = index;
  window.visibleHealthPostCount = 5;
  window.selectedHealthPostId = null;
  render();
};

window.sortHealthPosts = function(sortType) {
  window.healthSortType = sortType;
  render();
};

window.showMorePosts = function() {
  window.visibleHealthPostCount += 5;
  render();
};

// ==========================================
// 건강콘텐츠 구독 기능 (Health Content Subscriptions)
// ==========================================

const SUBSCRIBE_DATA = {
  disease_prevention: {
    title: "질병예방관리 프로그램",
    desc: "고혈압, 당뇨 등 주요 질환의 예방과 관리를 위한 정보와 생활 습관 개선 가이드를 제공합니다.",
    icon: "🌱",
    color: "#16a34a",
    colorRgb: "22, 163, 74",
    cycleDesc: "주 1회 / 월 1회",
    contents: [
      { id: "dp_hyper", name: "고혈압 예방과 관리", desc: "혈압 관리의 중요성과 생활 습관 개선 방법, 식단·운동 가이드를 제공합니다.", cycle: "주 1회", duration: "4주", premium: false },
      { id: "dp_diab", name: "당뇨병 예방과 관리", desc: "혈당 관리의 핵심 정보와 식습관, 운동, 합변증 예방 방법을 안내합니다.", cycle: "주 1회", duration: "8주", premium: false },
      { id: "dp_lipid", name: "이상지질혈증 관리", desc: "콜레스테롤과 중성지방 관리 방법 및 심혈관 질환 예방 정보를 제공합니다.", cycle: "주 1회", duration: "8주", premium: false },
      { id: "dp_obesity", name: "비만 관리 프로그램", desc: "체중 관리의 원칙과 식사·운동 가이드, 체중 감량 팁을 제공합니다.", cycle: "주 1회", duration: "12주", premium: false },
      { id: "dp_liver", name: "간 건강 관리", desc: "간 기능 보호와 지방간 예방, 간에 좋은 식습관과 생활 습관을 안내합니다.", cycle: "월 1회", duration: "6개월", premium: true },
      { id: "dp_smoke", name: "금연 프로그램", desc: "금연의 필요성과 금연 성공 전략, 흡연이 건강에 미치는 영향 정보를 제공합니다.", cycle: "주 1회", duration: "8주", premium: false },
      { id: "dp_stress", name: "스트레스 관리", desc: "스트레스의 원인과 관리법, 마음 건강을 위한 실천 가이드를 제공합니다.", cycle: "주 1회", duration: "4주", premium: false }
    ]
  },
  pregnancy: {
    title: "임신/출산 정보 알림 & 맞춤관리",
    desc: "임신 및 출산에 필요한 맞춤 정보와 주기별 관리 가이드를 제공합니다.",
    icon: "🤰",
    color: "#22c55e",
    colorRgb: "34, 197, 94",
    cycleDesc: "주 1회 / 월 1회",
    contents: [
      { id: "preg_guide", name: "임신 주차별 맞춤 알림", desc: "임신 주차별 태아 발달과 모체의 변화, 필수 영양소 정보를 가이드합니다.", cycle: "주 1회", duration: "40주", premium: false },
      { id: "preg_recovery", name: "출산 조리 & 신체 회복", desc: "산후 신체 회복을 돕는 영양 식단, 산후 우울증 극복과 가벼운 운동법을 소개합니다.", cycle: "주 1회", duration: "8주", premium: false },
      { id: "preg_baby", name: "신생아 돌보기 및 모유수유", desc: "초보 부모를 위한 신생아 수면, 목욕, 예방접종 및 모유수유 실전 팁을 안내합니다.", cycle: "주 1회", duration: "12주", premium: false },
      { id: "preg_child", name: "영유아 시기별 건강관리", desc: "만 5세까지 영유아의 시기별 신체적, 정서적 발달 체크리스트를 제공합니다.", cycle: "월 1회", duration: "60개월", premium: true }
    ]
  },
  health_promotion: {
    title: "건강증진 프로그램",
    desc: "피부관리, 금연, 스트레스 관리, 체중관리 등 건강한 삶을 위한 다양한 정보를 제공합니다.",
    icon: "💙",
    color: "#3b82f6",
    colorRgb: "59, 130, 246",
    cycleDesc: "주 1회 / 월 1회",
    contents: [
      { id: "hp_immunity", name: "환절기 면역력 강화 코칭", desc: "면역력 저하 자가 진단 및 체온 유지법, 면역력에 탁월한 제철 보양 식단을 추천합니다.", cycle: "주 1회", duration: "4주", premium: false },
      { id: "hp_sleep", name: "꿀잠 솔루션 (수면 케어)", desc: "불면증 원인 분석, 올바른 수면 위생 및 수면 환경 개선을 위한 힐링 스트레칭을 제공합니다.", cycle: "주 1회", duration: "8주", premium: false },
      { id: "hp_skin", name: "디톡스 및 피부 건강 케어", desc: "노화 예방, 피부 장벽 보호를 위한 식습관과 홈케어 마사지 및 체내 독소 배출 가이드를 제안합니다.", cycle: "주 1회", duration: "6주", premium: false },
      { id: "hp_fatigue", name: "만성 피로 타파 가이드", desc: "만성 피로의 원인 진단과 생체 리듬 회복, 활력 충전을 위한 에너지 영양 요법을 처방합니다.", cycle: "주 1회", duration: "8주", premium: true }
    ]
  },
  checkup_guide: {
    title: "검진/사후관리 가이드",
    desc: "건강검진 결과 활용법과 사후관리 방법을 안내하여 건강한 삶을 유지하도록 도와드립니다.",
    icon: "☑",
    color: "#8b5cf6",
    colorRgb: "139, 92, 246",
    cycleDesc: "주 1회 / 월 1회",
    contents: [
      { id: "cg_result", name: "건강검진 결과 백서", desc: "복잡한 검진 수치들을 일반인의 눈높이에 맞추어 핵심 설명과 질환 위험도를 안내합니다.", cycle: "주 1회", duration: "4주", premium: false },
      { id: "cg_scope", name: "위/대장 내시경 사후 관리", desc: "용종 제거 후 자극 없는 식사 가이드 및 일상 생활 주의사항을 설명합니다.", cycle: "주 1회", duration: "4주", premium: false },
      { id: "cg_metabolic", name: "대사증후군 탈출 프로그램", desc: "복부비만, 고혈압, 당뇨 등 대사증후군 위험 인자를 해소하기 위한 핏 트레이닝 가이드입니다.", cycle: "주 1회", duration: "8주", premium: false },
      { id: "cg_joint", name: "관절 자가 재활 프로그램", desc: "인공관절 수술 또는 관절 통증 후 집에서 안전하게 수행할 수 있는 재활 스트레칭을 코칭합니다.", cycle: "주 1회", duration: "4주", premium: true }
    ]
  },
  exercise_nutrition: {
    title: "운동/영양/생활습관 관리",
    desc: "운동, 영양, 생활습관 개선을 위한 실천 가이드와 팁을 제공합니다.",
    icon: "🏃",
    color: "#f97316",
    colorRgb: "249, 115, 22",
    cycleDesc: "주 1회 / 월 1회",
    contents: [
      { id: "en_core", name: "하루 10분 홈트레이닝 코어 운동", desc: "기초 체력을 단련하고 자세를 바로잡는 무리 없는 전신 근력 운동 루틴을 코칭합니다.", cycle: "주 1회", duration: "8주", premium: false },
      { id: "en_joint", name: "어깨/고관절/무릎 관절 강화", desc: "3대 관절 부위를 부드럽고 튼튼하게 만들어 통증을 예방하는 5분 관절 체조입니다.", cycle: "주 1회", duration: "4주", premium: false },
      { id: "en_recipe", name: "저염/저당 식단 레시피", desc: "성인병 예방을 위해 나트륨과 당분을 줄인 맛있는 건강 밥상 조리법을 공유합니다.", cycle: "주 1회", duration: "12주", premium: false },
      { id: "en_stretching", name: "직장인을 위한 오피스 스트레칭", desc: "거북목, 허리 통증을 예방할 수 있는 사무실 밀착형 스트레칭을 매일 가이드합니다.", cycle: "주 1회", duration: "6주", premium: false },
      { id: "en_gut", name: "소화기 힐링 및 장 건강 요법", desc: "만성 소화불량 및 변비 개선에 탁월한 식이섬유 섭취 가이드와 장 마사지 요법을 제공합니다.", cycle: "월 1회", duration: "6개월", premium: true }
    ]
  }
};

function getSubscribedContents() {
  try {
    return JSON.parse(localStorage.getItem('hc_subscribed_contents') || '[]');
  } catch (e) {
    return [];
  }
}

function setSubscribedContents(subs) {
  try {
    localStorage.setItem('hc_subscribed_contents', JSON.stringify(subs));
  } catch (e) {}
}

function isPremiumUser() {
  const client = state.activeClient;
  const userTiers = state.currentUser ? (state.currentUser.tiers[client.id] || []) : [];
  return userTiers.some(t => {
    const tName = typeof t === 'object' ? (t.name || t.label || t.id || '') : String(t);
    return tName.includes('VIP') || tName.includes('우대') || tName.includes('임원') || tName.includes('프리미어') || tName.includes('프레스티지') || tName.includes('플래티넘');
  });
}

function getRequiredPremiumTierName(clientId) {
  if (clientId === 'kyobo') return 'VIP플랜';
  if (clientId === 'dasom') return '우대등급';
  if (clientId === 'other') return '임원급';
  return 'VIP 등급';
}

window.toggleSubscribe = function(contentId) {
  const subs = getSubscribedContents();
  if (!subs.includes(contentId)) {
    subs.push(contentId);
    setSubscribedContents(subs);
    showToast('구독 신청이 완료되었습니다.');
    render();
  }
};

window.cancelSubscribe = function(contentId) {
  const subs = getSubscribedContents();
  const idx = subs.indexOf(contentId);
  if (idx !== -1) {
    if (confirm('구독을 취소하시겠습니까?')) {
      subs.splice(idx, 1);
      setSubscribedContents(subs);
      showToast('구독이 취소되었습니다.');
      render();
    }
  }
};

window.renderContentSubscribe = function() {
  const client = state.activeClient;
  const activeSite = state.activeSite || client.sites[0];
  const topicKey = state.activeSubSubId;
  const isPremium = isPremiumUser();
  const premiumTierLabel = getRequiredPremiumTierName(client.id);

  // Dynamic Styles injection (Scoped with .portal-subscribe- namespace)
  const stylesHtml = `
    <style>
      .portal-subscribe-container {
        animation: fadeIn 0.4s ease-out;
      }
      .portal-subscribe-title-section {
        text-align: center;
        padding: 40px 0 32px 0;
      }
      .portal-subscribe-title {
        font-size: 32px;
        font-weight: 800;
        color: #0f172a;
        margin: 0;
        letter-spacing: -1.0px;
      }
      .portal-subscribe-subtitle {
        font-size: 15px;
        color: #64748b;
        margin-top: 16px;
        line-height: 1.6;
        font-weight: 500;
      }
      .portal-subscribe-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 24px 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        margin-bottom: 16px;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.005);
      }
      .portal-subscribe-card:hover {
        transform: translateY(-2.5px);
        box-shadow: 0 12px 24px -6px rgba(0,0,0,0.06);
        border-color: rgba(var(--theme-color-rgb), 0.25);
      }
      .portal-subscribe-card-left {
        display: flex;
        align-items: center;
        flex: 1;
      }
      .portal-subscribe-icon-wrapper {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        flex-shrink: 0;
        transition: transform 0.25s ease;
      }
      .portal-subscribe-card:hover .portal-subscribe-icon-wrapper {
        transform: scale(1.08);
      }
      .portal-subscribe-info {
        margin-left: 24px;
        text-align: left;
      }
      .portal-subscribe-card-title {
        font-size: 19px;
        font-weight: 800;
        color: #1e293b;
        margin: 0;
        letter-spacing: -0.5px;
      }
      .portal-subscribe-card-desc {
        font-size: 14px;
        color: #64748b;
        margin-top: 6px;
        line-height: 1.5;
        font-weight: 500;
      }
      .portal-subscribe-card-right {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .portal-subscribe-badge-pill {
        padding: 8px 18px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .portal-subscribe-chevron {
        font-size: 20px;
        font-weight: 800;
        color: #94a3b8;
        transition: transform 0.2s;
      }
      .portal-subscribe-card:hover .portal-subscribe-chevron {
        transform: translateX(4px);
        color: var(--theme-color);
      }
      
      /* Detail Table Styles */
      .portal-subscribe-table-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        box-shadow: 0 4px 20px -2px rgba(0,0,0,0.03);
        overflow: hidden;
        margin-top: 16px;
      }
      .portal-subscribe-table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
      }
      .portal-subscribe-table th {
        background: #f8fafc;
        padding: 18px 24px;
        font-size: 13.5px;
        font-weight: 700;
        color: #475569;
        border-bottom: 2px solid #e2e8f0;
      }
      .portal-subscribe-table td {
        padding: 22px 24px;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;
      }
      .portal-subscribe-table tr:last-child td {
        border-bottom: none;
      }
      .portal-subscribe-content-title {
        font-size: 15.5px;
        font-weight: 800;
        color: #1e293b;
        margin: 0;
        letter-spacing: -0.3px;
      }
      .portal-subscribe-content-desc {
        font-size: 13px;
        color: #64748b;
        margin-top: 5px;
        line-height: 1.55;
        font-weight: 500;
      }
      
      /* Buttons */
      .portal-subscribe-btn-action {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 108px;
        height: 38px;
        border-radius: 6px;
        font-weight: 700;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s ease;
        box-sizing: border-box;
      }
      .portal-subscribe-btn-action.btn-apply {
        border: 1.5px solid var(--theme-color);
        color: var(--theme-color);
        background: #ffffff;
      }
      .portal-subscribe-btn-action.btn-apply:hover {
        background: var(--theme-color);
        color: #ffffff;
      }
      .portal-subscribe-btn-action.btn-active {
        background: #22c55e;
        color: #ffffff;
        border: none;
        cursor: default;
      }
      .portal-subscribe-btn-cancel {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 108px;
        height: 30px;
        border-radius: 6px;
        font-weight: 700;
        font-size: 12px;
        cursor: pointer;
        border: 1px solid #cbd5e1;
        color: #64748b;
        background: #ffffff;
        margin-top: 6px;
        transition: all 0.2s ease;
        box-sizing: border-box;
        text-decoration: none;
      }
      .portal-subscribe-btn-cancel:hover {
        border-color: #f43f5e;
        color: #f43f5e;
        background: #fff1f2;
      }
      .portal-subscribe-lock-badge {
        background: #fee2e2;
        color: #ef4444;
        border: 1px solid #fecaca;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 800;
        display: inline-flex;
        align-items: center;
        gap: 3px;
        margin-bottom: 6px;
      }
      .portal-subscribe-btn-action.btn-disabled {
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        color: #94a3b8;
        cursor: not-allowed;
      }
      
      /* Bottom Banner */
      .portal-subscribe-notice-banner {
        background: rgba(var(--theme-color-rgb), 0.03);
        border: 1px solid rgba(var(--theme-color-rgb), 0.12);
        border-radius: 14px;
        padding: 20px 24px;
        display: flex;
        align-items: flex-start;
        gap: 14px;
        margin-top: 32px;
      }
      .portal-subscribe-notice-icon {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--theme-color);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 800;
        flex-shrink: 0;
        margin-top: 2px;
      }
      .portal-subscribe-notice-text {
        font-size: 13.5px;
        color: #475569;
        font-weight: 600;
        line-height: 1.6;
        text-align: left;
      }
    </style>
  `;

  // Check if viewing a specific topic detail
  if (topicKey && SUBSCRIBE_DATA[topicKey]) {
    const topicData = SUBSCRIBE_DATA[topicKey];
    const subscribed = getSubscribedContents();

    // Render breadcrumbs
    const breadcrumbHtml = `
      <div style="display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: #64748b; font-weight: 600; margin-bottom: 24px; letter-spacing: -0.3px;">
        <span style="cursor: pointer; display: flex; align-items: center; gap: 4px;" onclick="window.location.hash='#/portal/${client.id}/${activeSite.siteId}'">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Home
        </span>
        <span style="color:#cbd5e1; font-weight:normal;">&gt;</span>
        <span>건강정보</span>
        <span style="color:#cbd5e1; font-weight:normal;">&gt;</span>
        <span style="cursor: pointer;" onclick="window.location.hash='#/portal/${client.id}/${activeSite.siteId}/healthInfo/contentSubscribe'">건강콘텐츠 구독</span>
        <span style="color:#cbd5e1; font-weight:normal;">&gt;</span>
        <span style="color: #0f172a; font-weight: 800;">${topicData.title}</span>
      </div>
    `;

    // Detail Header
    const detailHeaderHtml = `
      <div style="
        display: flex;
        align-items: center;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        padding: 32px;
        box-shadow: 0 4px 20px -2px rgba(0,0,0,0.03);
        margin-bottom: 32px;
        text-align: left;
      ">
        <div style="
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(${topicData.colorRgb}, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          flex-shrink: 0;
        ">${topicData.icon}</div>
        <div style="margin-left: 28px;">
          <h1 style="font-size: 26px; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.5px;">${topicData.title}</h1>
          <p style="font-size: 15px; color: #64748b; margin-top: 8px; line-height: 1.5; font-weight: 500; letter-spacing: -0.2px;">${topicData.desc}</p>
        </div>
      </div>
    `;

    // Filter contents based on premium grade eligibility
    const eligibleContents = topicData.contents.filter(item => {
      // If it's a premium item, only show it to premium users
      if (item.premium && !isPremium) return false;
      return true;
    });

    // Build Contents Rows
    const rowsHtml = eligibleContents.map(item => {
      const isSubscribed = subscribed.includes(item.id);
      const isPremiumLock = item.premium && !isPremium;

      let btnCellHtml = '';
      if (isPremiumLock) {
        btnCellHtml = `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <span class="portal-subscribe-lock-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 11V7a5 5 0 0 0-10 0v4"></path><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M12 15v3"></path></svg>
              ${premiumTierLabel} 전용
            </span>
            <button class="portal-subscribe-btn-action btn-disabled" disabled>구독 신청</button>
          </div>
        `;
      } else if (isSubscribed) {
        btnCellHtml = `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <button class="portal-subscribe-btn-action btn-active">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
              구독중
            </button>
            <button onclick="window.cancelSubscribe('${item.id}')" class="portal-subscribe-btn-cancel">취소</button>
          </div>
        `;
      } else {
        btnCellHtml = `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <button onclick="window.toggleSubscribe('${item.id}')" class="portal-subscribe-btn-action btn-apply">구독 신청</button>
          </div>
        `;
      }

      return `
        <tr>
          <td>
            <div style="display: flex; align-items: flex-start; gap: 14px; text-align: left;">
              <div style="
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: rgba(${topicData.colorRgb}, 0.05);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                flex-shrink: 0;
                margin-top: 2px;
              ">${topicData.icon}</div>
              <div>
                <h3 class="portal-subscribe-content-title">${item.name}</h3>
                <p class="portal-subscribe-content-desc">${item.desc}</p>
              </div>
            </div>
          </td>
          <td style="text-align: center; font-size: 14px; color: #475569; font-weight: 700;">${item.cycle}</td>
          <td style="text-align: center; font-size: 14px; color: #475569; font-weight: 700;">${item.duration}</td>
          <td style="text-align: center; width: 140px;">${btnCellHtml}</td>
        </tr>
      `;
    }).join('');

    const tableHtml = `
      <div style="text-align: left; margin-top: 32px; margin-bottom: 8px;">
        <h2 style="font-size: 19px; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.5px;">콘텐츠 목록</h2>
        <p style="font-size: 13.5px; color: #64748b; margin-top: 4px; font-weight: 500;">원하시는 콘텐츠를 선택하여 구독 신청하실 수 있습니다.</p>
      </div>
      <div class="portal-subscribe-table-card">
        <table class="portal-subscribe-table">
          <thead>
            <tr>
              <th style="text-align: left;">콘텐츠명</th>
              <th style="text-align: center; width: 120px;">발송 주기</th>
              <th style="text-align: center; width: 120px;">총 발송 기간</th>
              <th style="text-align: center; width: 140px;">신청</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;

    // Bottom notice banner
    const bannerHtml = `
      <div class="portal-subscribe-notice-banner">
        <div class="portal-subscribe-notice-icon">i</div>
        <div class="portal-subscribe-notice-text">
          구독 신청하신 콘텐츠는 선택한 주기와 기간에 맞춰 정기적으로 발송됩니다.<br>
          여러 콘텐츠를 동시에 구독하실 수 있으며, 언제든지 취소하실 수 있습니다.
        </div>
      </div>
    `;

    return `
      ${stylesHtml}
      <div class="portal-subscribe-container">
        ${breadcrumbHtml}
        ${detailHeaderHtml}
        ${tableHtml}
        ${bannerHtml}
        
        <!-- 목록 버튼 (좌측하단) -->
        <div style="margin-top: 32px; display: flex; justify-content: flex-start;">
          <button onclick="window.location.hash='#/portal/${client.id}/${activeSite.siteId}/healthInfo/contentSubscribe'" style="
            padding: 12px 32px;
            background: #0f172a;
            color: #ffffff;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition: opacity 0.2s ease;
          "
          onmouseover="this.style.opacity='0.9';"
          onmouseout="this.style.opacity='1';">목록</button>
        </div>
      </div>
    `;
  } else {
    // 1단계: 주제 선택 메인 화면 (First Image Layout)
    const breadcrumbHtml = `
      <div style="display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: #64748b; font-weight: 600; margin-bottom: 24px; letter-spacing: -0.3px;">
        <span style="cursor: pointer; display: flex; align-items: center; gap: 4px;" onclick="window.location.hash='#/portal/${client.id}/${activeSite.siteId}'">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Home
        </span>
        <span style="color:#cbd5e1; font-weight:normal;">&gt;</span>
        <span>건강정보</span>
        <span style="color:#cbd5e1; font-weight:normal;">&gt;</span>
        <span style="color: #0f172a; font-weight: 800;">건강콘텐츠 구독</span>
      </div>
    `;

    const titleSectionHtml = `
      <div class="portal-subscribe-title-section">
        <h1 class="portal-subscribe-title">건강콘텐츠 구독</h1>
        <p class="portal-subscribe-subtitle">
          건강한 생활을 위한 맞춤형 정보를 구독해 보세요.<br>
          관심 있는 프로그램을 선택하시면, 정기적으로 유용한 정보를 받아보실 수 있습니다.
        </p>
      </div>
    `;

    // Render 5 categories cards
    const cardsHtml = Object.keys(SUBSCRIBE_DATA).map(key => {
      const topic = SUBSCRIBE_DATA[key];
      
      // Card click hash navigation
      const clickHash = `#/portal/${client.id}/${activeSite.siteId}/healthInfo/contentSubscribe/${key}`;
      
      // Dynamic inline styles for card pills based on theme
      const pillStyle = `
        border: 1px solid rgba(${topic.colorRgb}, 0.2);
        background: rgba(${topic.colorRgb}, 0.04);
        color: ${topic.color};
      `;

      const iconStyle = `
        background: rgba(${topic.colorRgb}, 0.07);
        border: 1px solid rgba(${topic.colorRgb}, 0.15);
      `;

      return `
        <div onclick="window.location.hash='${clickHash}'" class="portal-subscribe-card">
          <div class="portal-subscribe-card-left">
            <div class="portal-subscribe-icon-wrapper" style="${iconStyle}">
              ${topic.icon}
            </div>
            <div class="portal-subscribe-info">
              <h2 class="portal-subscribe-card-title">${topic.title}</h2>
              <p class="portal-subscribe-card-desc">${topic.desc}</p>
            </div>
          </div>
          <div class="portal-subscribe-card-right">
            <span class="portal-subscribe-badge-pill" style="${pillStyle}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-top:-1px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              ${topic.cycleDesc}
            </span>
            <span class="portal-subscribe-chevron">&gt;</span>
          </div>
        </div>
      `;
    }).join('');

    const bannerHtml = `
      <div class="portal-subscribe-notice-banner">
        <div class="portal-subscribe-notice-icon">i</div>
        <div class="portal-subscribe-notice-text">
          구독을 신청하시면 선택한 주기와 기간에 맞춰 콘텐츠가 정기적으로 발송됩니다.<br>
          여러 프로그램을 동시에 구독하실 수 있으며, 언제든지 변경 또는 해지하실 수 있습니다.
        </div>
      </div>
    `;

    return `
      ${stylesHtml}
      <div class="portal-subscribe-container">
        ${breadcrumbHtml}
        ${titleSectionHtml}
        <div style="margin-top: 16px;">
          ${cardsHtml}
        </div>
        ${bannerHtml}
      </div>
    `;
  }
};

// ==========================================
// 심리칼럼 데이터 & 렌더러 (Psychology Columns)
// ==========================================
const PSY_COLUMNS = [
  {
    id: "pr1",
    category: "자존감/관계",
    categoryKey: "relationship",
    title: "타인의 시선에서 자유로워지는 자존감 리셋 법칙",
    summary: "남들의 시선에 갇혀 나를 잃어버리고 있다면, 자존감을 회복해야 할 때입니다. 타인의 기준이 아닌 나 자신의 내면의 목소리에 집중하는 자존감 리셋 법칙.",
    date: "2026.06.01",
    views: 1532,
    author: "최유진 가족상담 전문가",
    bgGradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    content: `
      <h3 style="font-size:20px; font-weight:800; color:#0f172a; margin-top:24px; margin-bottom:12px;">타인의 평가라는 감옥</h3>
      <p style="font-size:15px; color:#334155; line-height:1.7; margin-bottom:16px;">우리는 종종 '남들이 나를 어떻게 생각할까?'라는 고민에 사로잡혀 정작 내가 원하는 것과 감정을 억누릅니다. 자존감은 타인의 칭찬이나 인정에서 오는 것이 아니라, 내 존재 자체를 스스로 수용할 때 비로소 튼튼해집니다.</p>
      
      <h3 style="font-size:20px; font-weight:800; color:#0f172a; margin-top:24px; margin-bottom:12px;">나와의 화해를 시작하는 법</h3>
      <p style="font-size:15px; color:#334155; line-height:1.7; margin-bottom:16px;">자존감을 세우기 위한 첫 단계는 나의 불완전함을 있는 그대로 인정하는 것입니다. 실수할 수 있고, 부족할 수 있음을 받아들이세요. 거울 속 나를 향해 '오늘도 애썼어', '괜찮아'라는 따뜻한 지지의 한마디를 건네며 나 자신과의 다정한 친구가 되어보세요.</p>
    `
  },
  {
    id: "pr2",
    category: "스트레스/우울",
    categoryKey: "stress",
    title: "이유 없는 무기력증과 계절성 우울증 극복하기",
    summary: "일조량이 변하는 환절기나 겨울철에 유독 무기력하고 우울함을 느낀다면 계절성 우울증을 의심해볼 수 있습니다. 생체 리듬을 바로잡고 활력을 되찾는 방법.",
    date: "2026.06.02",
    views: 942,
    author: "김현아 정신건강의학과 교수",
    bgGradient: "linear-gradient(135deg, #3b82f6 0%, #ec4899 100%)",
    content: `
      <h3 style="font-size:20px; font-weight:800; color:#0f172a; margin-top:24px; margin-bottom:12px;">일조량 감소와 마음의 변화</h3>
      <p style="font-size:15px; color:#334155; line-height:1.7; margin-bottom:16px;">일조량이 줄어드는 가을이나 겨울, 혹은 장마철에는 뇌에서 분비되는 신경전달물질인 세로토닌이 감소하게 됩니다. 세로토닌은 행복감과 안정을 느끼게 해주는 호르몬이기 때문에, 이것이 부족해지면 이유 없는 무기력, 수면 장애, 우울감이 찾아옵니다.</p>
      
      <h3 style="font-size:20px; font-weight:800; color:#0f172a; margin-top:24px; margin-bottom:12px;">가장 간단하면서도 강력한 처방: 햇볕 샤워</h3>
      <p style="font-size:15px; color:#334155; line-height:1.7; margin-bottom:16px;">이러한 계절성 우울증을 이기는 가장 효과적인 치료제는 자연이 주는 '햇볕'입니다. 오전 10시에서 오후 2시 사이, 하루 20~30분간 야외에서 햇볕을 쬐며 걷는 '햇볕 샤워'를 실천해 보세요. 피부를 통한 비타민 D 합성을 돕고 뇌의 멜라토닌 분비를 조절해 생체 리듬을 즉시 바로잡아 줍니다.</p>
    `
  },
  {
    id: "pr3",
    category: "마음챙김/명상",
    categoryKey: "mindfulness",
    title: "하루 5분, 복잡한 생각을 비우는 호흡 명상",
    summary: "스트레스가 가득 차 숨이 막힐 것 같을 때, 뇌 피로를 덜어주는 간단한 호흡 명상 가이드. 5분 투자로 마음의 평화를 되찾으세요.",
    date: "2026.06.03",
    views: 1205,
    author: "박민우 마인드풀니스 지도자",
    bgGradient: "linear-gradient(135deg, #10b981 0%, #065f46 100%)",
    content: `
      <h3 style="font-size:20px; font-weight:800; color:#0f172a; margin-top:24px; margin-bottom:12px;">왜 지금 호흡 명상인가?</h3>
      <p style="font-size:15px; color:#334155; line-height:1.7; margin-bottom:16px;">우리의 뇌는 깨어 있는 동안 수많은 정보와 잡념에 시달립니다. 호흡 명상은 오직 들숨과 날숨에 집중함으로써 과부하가 걸린 전두엽을 휴식하게 만듭니다.</p>
      
      <h3 style="font-size:20px; font-weight:800; color:#0f172a; margin-top:24px; margin-bottom:12px;">시작하는 방법: 4-7-8 호흡법</h3>
      <p style="font-size:15px; color:#334155; line-height:1.7; margin-bottom:16px;">조용한 곳에 바르게 앉아 눈을 감습니다. 4초간 코로 숨을 들이마시고, 7초간 숨을 참은 뒤, 8초간 입으로 천천히 내쉽니다. 이를 4회 반복하는 것만으로 부교감 신경이 활성화되어 긴장이 풀립니다.</p>
    `
  }
];

window.renderPsyColumn = function() {
  const client = state.activeClient;
  const activeSite = state.activeSite || client.sites[0];
  const postId = state.activeSubSubId;

  const stylesHtml = `
    <style>
      .psy-column-container { animation: fadeIn 0.4s ease-out; }
      .psy-column-title-section { text-align: center; padding: 32px 0 24px 0; }
      .psy-column-title { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0; }
      .psy-column-subtitle { font-size: 15px; color: #64748b; margin-top: 12px; line-height: 1.6; }
      .psy-column-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; margin-top: 32px; }
      .psy-column-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; }
      .psy-column-card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
      .psy-column-card-image { height: 160px; position: relative; }
      .psy-column-card-image-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.3)); }
      .psy-column-card-category { position: absolute; top: 12px; left: 12px; background: rgba(255,255,255,0.9); color: #0f172a; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; }
      .psy-column-card-body { padding: 20px; display: flex; flex-direction: column; flex-grow: 1; }
      .psy-column-card-title { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0; line-height: 1.4; }
      .psy-column-card-summary { font-size: 13.5px; color: #475569; line-height: 1.6; margin: 0 0 20px 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; flex-grow: 1; }
      .psy-column-card-footer { display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8; font-weight: 500; border-top: 1px solid #f1f5f9; padding-top: 12px; }
      .psy-column-detail-container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; border: 1px solid #e2e8f0; }
      .psy-column-detail-header { border-bottom: 1px solid #f1f5f9; padding-bottom: 24px; margin-bottom: 32px; }
      .psy-column-detail-category { display: inline-block; padding: 6px 12px; background: rgba(var(--theme-color-rgb), 0.1); color: var(--theme-color); border-radius: 6px; font-size: 13px; font-weight: 700; margin-bottom: 16px; }
      .psy-column-detail-title { font-size: 30px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0; line-height: 1.3; }
      .psy-column-detail-meta { display: flex; justify-content: space-between; font-size: 14px; color: #64748b; }
      .psy-column-detail-body { color: #334155; font-size: 16px; line-height: 1.8; }
    </style>
  `;

  if (postId) {
    const post = PSY_COLUMNS.find(p => p.id === postId);
    if (!post) {
      window.location.hash = `#/portal/${client.id}/${activeSite.siteId}/${getMenuPath("psyColumn", "healthInfo")}`;
      return '';
    }

    if (!state[`viewed_psy_${postId}`]) {
      post.views += 1;
      state[`viewed_psy_${postId}`] = true;
    }

    const breadcrumbHtml = `
      <div style="display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: #64748b; font-weight: 600; margin-bottom: 24px; letter-spacing: -0.3px;">
        <span style="cursor: pointer; display: flex; align-items: center; gap: 4px;" onclick="window.location.hash='#/portal/${client.id}/${activeSite.siteId}'">Home</span>
        <span style="color:#cbd5e1; font-weight:normal;">&gt;</span>
        <span>${getParentMenuLabel('psyColumn', '건강정보')}</span>
        <span style="color:#cbd5e1; font-weight:normal;">&gt;</span>
        <span style="cursor: pointer;" onclick="window.location.hash='#/portal/${client.id}/${activeSite.siteId}/${getMenuPath("psyColumn", "healthInfo")}'">심리칼럼</span>
        <span style="color:#cbd5e1; font-weight:normal;">&gt;</span>
        <span style="color: #0f172a; font-weight: 800;">칼럼 상세</span>
      </div>
    `;

    return `
      ${stylesHtml}
      <div class="psy-column-container">
        ${breadcrumbHtml}
        <div class="psy-column-detail-container">
          <div class="psy-column-detail-header">
            <span class="psy-column-detail-category">${post.category}</span>
            <h1 class="psy-column-detail-title">${post.title}</h1>
            <div class="psy-column-detail-meta">
              <span>작성자: ${post.author}</span>
              <span>등록일: ${post.date} &nbsp;|&nbsp; 조회수: ${post.views}</span>
            </div>
          </div>
          <div class="psy-column-detail-body">
            <div style="width:100%; height:260px; background:${post.bgGradient}; border-radius:12px; margin-bottom:32px;"></div>
            ${post.content}
          </div>
          <div style="margin-top:40px; padding-top:24px; border-top:1px solid #f1f5f9; display:flex; justify-content:center;">
            <button onclick="window.location.hash='#/portal/${client.id}/${activeSite.siteId}/${getMenuPath("psyColumn", "healthInfo")}'" style="padding:12px 32px; background:#0f172a; color:white; border:none; border-radius:8px; font-weight:700; cursor:pointer;">목록으로</button>
          </div>
        </div>
      </div>
    `;
  } else {
    const breadcrumbHtml = `
      <div style="display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: #64748b; font-weight: 600; margin-bottom: 24px; letter-spacing: -0.3px;">
        <span style="cursor: pointer; display: flex; align-items: center; gap: 4px;" onclick="window.location.hash='#/portal/${client.id}/${activeSite.siteId}'">Home</span>
        <span style="color:#cbd5e1; font-weight:normal;">&gt;</span>
        <span>${getParentMenuLabel('psyColumn', '건강정보')}</span>
        <span style="color:#cbd5e1; font-weight:normal;">&gt;</span>
        <span style="color: #0f172a; font-weight: 800;">심리칼럼</span>
      </div>
    `;

    const titleSectionHtml = `
      <div class="psy-column-title-section">
        <h1 class="psy-column-title">심리칼럼</h1>
        <p class="psy-column-subtitle">마음의 건강을 위한 분야별 심리 전문가들의 깊이 있는 조언 and 칼럼을 만나보세요.</p>
      </div>
    `;

    const cardsHtml = PSY_COLUMNS.map(p => {
      const clickHash = `#/portal/${client.id}/${activeSite.siteId}/${getMenuPath("psyColumn", "healthInfo")}/${p.id}`;
      return `
        <div onclick="window.location.hash='${clickHash}'" class="psy-column-card">
          <div class="psy-column-card-image" style="background: ${p.bgGradient};">
            <div class="psy-column-card-image-overlay"></div>
            <span class="psy-column-card-category">${p.category}</span>
          </div>
          <div class="psy-column-card-body">
            <h2 class="psy-column-card-title">${p.title}</h2>
            <p class="psy-column-card-summary">${p.summary}</p>
            <div class="psy-column-card-footer">
              <span>${p.author}</span>
              <span>조회수 ${p.views}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      ${stylesHtml}
      <div class="psy-column-container">
        ${breadcrumbHtml}
        ${titleSectionHtml}
        <div class="psy-column-card-grid">
          ${cardsHtml}
        </div>
      </div>
    `;
  }
};

// ==========================================
// 자가진단 데이터 & 렌더러 (Self Diagnosis)
// ==========================================
const DIAG_ITEMS = {
  stress: {
    title: "스트레스 자가진단 (PSS)",
    desc: "최근 한 달 동안 일상에서 느낀 스트레스의 수준을 자가 진단합니다.",
    questions: [
      "최근 한 달 동안, 예상치 못한 일로 당황한 적이 얼마나 있었습니까?",
      "최근 한 달 동안, 인생에서 중요한 일들을 조절할 수 없다고 느낀 적이 얼마나 있었습니까?",
      "최근 한 달 동안, 신경이 예민해지고 스트레스를 받았다고 느낀 적이 얼마나 있었습니까?",
      "최근 한 달 동안, 개인적인 문제를 다루는 데 있어서 자신감을 잃은 적이 얼마나 있었습니까?",
      "최근 한 달 동안, 일들이 당신의 뜻대로 진행되지 않는다고 느낀 적이 얼마나 있었습니까?",
      "최근 한 달 동안, 일상적인 대처 능력을 넘어서는 과부하를 느낀 적이 얼마나 있었습니까?",
      "최근 한 달 동안, 당신의 통제 범위 밖의 일로 화가 난 적이 얼마나 있었습니까?"
    ],
    options: ["전혀 없음 (0점)", "거의 없음 (1점)", "가끔 있음 (2점)", "자주 있음 (3점)", "거의 항상 (4점)"],
    scores: [0, 1, 2, 3, 4],
    getFeedback: (score) => {
      if (score <= 10) return { status: "정상 (낮은 스트레스)", color: "#10b981", desc: "고객님의 현재 스트레스 수준은 매우 안정적입니다. 일상의 긴장과 스트레스를 잘 조절하고 있습니다." };
      if (score <= 18) return { status: "주의 (중간 스트레스)", color: "#f59e0b", desc: "일상적인 수준보다 약간 높은 스트레스를 겪고 계십니다. 충분한 휴식과 스트레스 해소를 위한 취미 활동이 권장됩니다." };
      return { status: "위험 (높은 스트레스)", color: "#ef4444", desc: "심각한 과부하 상태입니다. 전문적인 심리 상담이나 의료기관을 통해 스트레스 해소와 마음 관리를 시도하시길 강력히 권장합니다." };
    }
  },
  depression: {
    title: "우울증 자가진단 (PHQ-9)",
    desc: "최근 2주 동안 느꼈던 마음 상태를 점검하여 우울증 가능성을 선별합니다.",
    questions: [
      "일 또는 여가 활동에 흥미나 즐거움을 느끼지 못함",
      "기분이 가라앉거나, 우울하거나, 희망이 없다고 느낌",
      "잠들기가 어렵거나 자주 깨며, 혹은 너무 많이 잠",
      "평소보다 피로감을 느끼고 기운이 없다고 느낌",
      "입맛이 없거나, 반대로 너무 많이 먹음",
      "자신을 부정적으로 보거나, 실패자로 느끼거나, 가족을 실망시켰다고 느낌",
      "신문 읽기나 TV 시청 등 일상적인 일에 집중하기가 어려움",
      "남들이 알아챌 정도로 행동이나 말이 느려지거나, 반대로 너무 초조해서 가만히 있지 못함",
      "차라리 죽는 게 낫겠다는 생각이 들거나 어떤 식으로든 자해하고 싶다고 느낌"
    ],
    options: ["전혀 없음 (0점)", "3~7일 간 (1점)", "8~12일 간 (2점)", "거의 매일 (3점)"],
    scores: [0, 1, 2, 3],
    getFeedback: (score) => {
      if (score <= 4) return { status: "정상 (안정)", color: "#10b981", desc: "마음의 우울감이 낮고 안정적입니다. 일상적인 스트레스를 양호하게 해소하고 있는 상태입니다." };
      if (score <= 9) return { status: "가벼운 우울", color: "#f59e0b", desc: "다소 가벼운 우울감이 감지되었습니다. 충분한 수면을 취하고 가벼운 신체 활동이나 걷기 등의 운동을 꾸준히 해보세요." };
      if (score <= 19) return { status: "중간 정도 우울", color: "#f97316", desc: "어느 정도 지속적인 우울감이 나타나고 있습니다. 전문가와의 대면 또는 모바일 상담을 통해 어려움을 털어놓아 보시길 권장합니다." };
      return { status: "심한 우울", color: "#ef4444", desc: "매우 높은 수준의 우울과 무기력을 느끼고 있습니다. 전문 심리 상담이나 임상 전문가와의 조속한 심층 진료를 통해 체계적인 보살핌을 받는 것이 매우 필요합니다." };
    }
  },
  burnout: {
    title: "번아웃 증후군 진단",
    desc: "업무와 일상의 과도한 피로로 신체적, 정신적 에너지가 소진되었는지 확인합니다.",
    questions: [
      "아침에 일어날 때 몸이 무겁고 출근하기 싫다는 생각이 듭니까?",
      "업무 중 쉽게 피로를 느끼고 짜증이 늘어났습니까?",
      "일을 마칠 때쯤이면 극심한 에너지가 소진되는 느낌을 받습니까?",
      "직장 생활이나 업무의 의미에 대해 의구심이 자주 드나요?",
      "최근 기억력이 나빠지고 집중이 잘 안 됩니까?",
      "두통, 소화불량 등 이유 없는 신체적 증상이 자주 생기나요?"
    ],
    options: ["전혀 아니다 (1점)", "약간 그렇다 (2점)", "자주 그렇다 (3점)", "매우 그렇다 (4점)"],
    scores: [1, 2, 3, 4],
    getFeedback: (score) => {
      if (score <= 10) return { status: "양호함", color: "#10b981", desc: "업무와 생활 간의 균형이 양호하며 신체적, 정신적 피로 수준이 낮은 상태입니다." };
      if (score <= 18) return { status: "피로 경고", color: "#f59e0b", desc: "다소 높은 번아웃 징후가 나타나고 있습니다. 과로를 줄이고 일시적으로 업무와 차단된 개인적인 휴식 시간을 가지셔야 합니다." };
      return { status: "소진 상태 (번아웃)", color: "#ef4444", desc: "심각한 소진 상태입니다. 누적된 신체적, 심리적 피로가 극에 달했습니다. 업무량을 조절하거나 휴가를 신청하고 전문가의 지지를 꼭 받으세요." };
    }
  }
};

window.startSelfDiag = function(testId) {
  state.selfDiagTestId = testId;
  state.selfDiagAnswers = {};
  state.selfDiagResult = null;
  render();
};

window.setSelfDiagAnswer = function(qIdx, val) {
  state.selfDiagAnswers = state.selfDiagAnswers || {};
  state.selfDiagAnswers[qIdx] = parseInt(val);
  render();
};

window.submitSelfDiag = function(testId) {
  const test = DIAG_ITEMS[testId];
  const answers = state.selfDiagAnswers || {};
  
  for (let i = 0; i < test.questions.length; i++) {
    if (typeof answers[i] === 'undefined') {
      window.showToast?.('모든 문항에 답변해주세요.') || alert('모든 문항에 답변해주세요.');
      return;
    }
  }

  let score = 0;
  for (let i = 0; i < test.questions.length; i++) {
    score += answers[i];
  }

  state.selfDiagResult = {
    score: score,
    maxScore: test.questions.length * Math.max(...test.scores),
    feedback: test.getFeedback(score)
  };
  render();
};

window.renderSelfDiagnosis = function() {
  const client = state.activeClient;
  const activeSite = state.activeSite || client.sites[0];
  const testId = state.selfDiagTestId;

  const stylesHtml = `
    <style>
      .diag-container { animation: fadeIn 0.4s ease-out; }
      .diag-title-section { text-align: center; padding: 32px 0 24px 0; }
      .diag-title { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0; }
      .diag-subtitle { font-size: 15px; color: #64748b; margin-top: 12px; line-height: 1.6; }
      .diag-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; margin-top: 32px; }
      .diag-card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; justify-content: space-between; min-height: 200px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
      .diag-card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); border-color: var(--theme-color); }
      .diag-card-title { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0; }
      .diag-card-desc { font-size: 14px; color: #64748b; line-height: 1.6; margin: 0 0 24px 0; flex-grow: 1; }
      .diag-card-btn { padding: 10px 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; color: #0f172a; font-size: 14px; font-weight: 700; cursor: pointer; text-align: center; transition: all 0.2s; }
      .diag-card:hover .diag-card-btn { background: var(--theme-color); color: white; border-color: var(--theme-color); }
      
      .diag-q-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 16px; }
      .diag-q-text { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 16px 0; line-height: 1.5; }
      .diag-options-grid { display: flex; flex-direction: column; gap: 8px; }
      .diag-opt-btn { padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 8px; text-align: left; font-size: 14px; font-weight: 600; color: #475569; background: white; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: space-between; }
      .diag-opt-btn:hover { background: #f8fafc; border-color: #94a3b8; }
      .diag-opt-btn.selected { background: rgba(var(--theme-color-rgb), 0.08); border-color: var(--theme-color); color: var(--theme-color); }
      .diag-opt-circle { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #cbd5e1; display: inline-block; position: relative; }
      .diag-opt-btn.selected .diag-opt-circle { border-color: var(--theme-color); background: var(--theme-color); }
      .diag-opt-btn.selected .diag-opt-circle::after { content: ''; position: absolute; top: 4px; left: 4px; width: 6px; height: 6px; border-radius: 50%; background: white; }

      .diag-result-card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.02); }
      .diag-score-badge { display: inline-flex; flex-direction: column; align-items: center; justify-content: center; width: 140px; height: 140px; border-radius: 50%; border: 6px solid #f1f5f9; margin-bottom: 24px; }
      .diag-score-val { font-size: 40px; font-weight: 900; color: #0f172a; line-height: 1; }
      .diag-score-max { font-size: 14px; color: #94a3b8; margin-top: 4px; }
    </style>
  `;

  if (testId) {
    const test = DIAG_ITEMS[testId];
    if (!test) {
      state.selfDiagTestId = null;
      render();
      return '';
    }

    const breadcrumbHtml = `
      <div style="display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: #64748b; font-weight: 600; margin-bottom: 24px; letter-spacing: -0.3px;">
        <span style="cursor: pointer; display: flex; align-items: center; gap: 4px;" onclick="window.location.hash='#/portal/${client.id}/${activeSite.siteId}'">Home</span>
        <span style="color:#cbd5e1; font-weight:normal;">&gt;</span>
        <span>${getParentMenuLabel('selfDiagnosis', '건강정보')}</span>
        <span style="color:#cbd5e1; font-weight:normal;">&gt;</span>
        <span style="cursor: pointer;" onclick="state.selfDiagTestId = null; render();">자가진단</span>
        <span style="color:#cbd5e1; font-weight:normal;">&gt;</span>
        <span style="color: #0f172a; font-weight: 800;">진단 진행</span>
      </div>
    `;

    if (state.selfDiagResult) {
      const result = state.selfDiagResult;
      return `
        ${stylesHtml}
        <div class="diag-container">
          ${breadcrumbHtml}
          <div class="diag-result-card" style="max-width: 600px; margin: 0 auto;">
            <div style="font-size: 18px; font-weight: 700; color: #64748b; margin-bottom: 8px;">${test.title} 결과</div>
            
            <div class="diag-score-badge" style="border-color: ${result.feedback.color};">
              <span class="diag-score-val" style="color: ${result.feedback.color};">${result.score}</span>
              <span class="diag-score-max">/ ${result.maxScore} 점</span>
            </div>
            
            <h2 style="font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 16px 0;">나의 상태: <span style="color: ${result.feedback.color};">${result.feedback.status}</span></h2>
            <p style="font-size: 15px; color: #475569; line-height: 1.7; margin: 0 auto 32px auto; max-width: 480px; word-break: keep-all;">
              ${result.feedback.desc}
            </p>
            
            <div style="display: flex; gap: 12px; justify-content: center;">
              <button onclick="window.startSelfDiag('${testId}')" style="padding: 14px 28px; background: white; border: 1px solid #cbd5e1; border-radius: 8px; color: #475569; font-weight: 700; cursor: pointer; transition: background 0.2s;">다시 테스트하기</button>
              <button onclick="state.selfDiagTestId = null; state.selfDiagResult = null; render();" style="padding: 14px 28px; background: #0f172a; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">자가진단 목록</button>
            </div>
          </div>
        </div>
      `;
    }

    const answers = state.selfDiagAnswers || {};
    const questionsHtml = test.questions.map((q, qIdx) => {
      const selectedVal = answers[qIdx];
      const optionsHtml = test.options.map((opt, oIdx) => {
        const val = test.scores[oIdx];
        const isSelected = selectedVal === val;
        return `
          <button onclick="window.setSelfDiagAnswer(${qIdx}, ${val})" class="diag-opt-btn ${isSelected ? 'selected' : ''}">
            <span>${opt}</span>
            <span class="diag-opt-circle"></span>
          </button>
        `;
      }).join('');

      return `
        <div class="diag-q-card">
          <h3 class="diag-q-text">${qIdx + 1}. ${q}</h3>
          <div class="diag-options-grid">${optionsHtml}</div>
        </div>
      `;
    }).join('');

    return `
      ${stylesHtml}
      <div class="diag-container">
        ${breadcrumbHtml}
        <div style="max-width: 700px; margin: 0 auto;">
          <h2 style="font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 24px; text-align: center;">${test.title}</h2>
          <div>
            ${questionsHtml}
          </div>
          <div style="margin-top: 32px; display: flex; gap: 12px;">
            <button onclick="state.selfDiagTestId = null; render();" style="flex: 1; padding: 16px; border: 1px solid #cbd5e1; border-radius: 8px; background: white; color: #475569; font-weight: 700; cursor: pointer;">취소</button>
            <button onclick="window.submitSelfDiag('${testId}')" style="flex: 2; padding: 16px; border: none; border-radius: 8px; background: var(--theme-color); color: white; font-weight: 700; cursor: pointer;">결과 확인하기</button>
          </div>
        </div>
      </div>
    `;
  } else {
    const breadcrumbHtml = `
      <div style="display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: #64748b; font-weight: 600; margin-bottom: 24px; letter-spacing: -0.3px;">
        <span style="cursor: pointer; display: flex; align-items: center; gap: 4px;" onclick="window.location.hash='#/portal/${client.id}/${activeSite.siteId}'">Home</span>
        <span style="color:#cbd5e1; font-weight:normal;">&gt;</span>
        <span>${getParentMenuLabel('selfDiagnosis', '건강정보')}</span>
        <span style="color:#cbd5e1; font-weight:normal;">&gt;</span>
        <span style="color: #0f172a; font-weight: 800;">자가진단</span>
      </div>
    `;

    const titleSectionHtml = `
      <div class="diag-title-section">
        <h1 class="diag-title">마음 자가진단</h1>
        <p class="diag-subtitle">현재 마음 건강 상태를 객관적으로 평가하고 스스로 케어하는 첫걸음을 떼보세요.</p>
      </div>
    `;

    const cardsHtml = Object.keys(DIAG_ITEMS).map(key => {
      const test = DIAG_ITEMS[key];
      return `
        <div onclick="window.startSelfDiag('${key}')" class="diag-card">
          <div>
            <h2 class="diag-card-title">${test.title}</h2>
            <p class="diag-card-desc">${test.desc}</p>
          </div>
          <button class="diag-card-btn">진단 시작하기</button>
        </div>
      `;
    }).join('');

    return `
      ${stylesHtml}
      <div class="diag-container">
        ${breadcrumbHtml}
        ${titleSectionHtml}
        <div class="diag-grid">
          ${cardsHtml}
        </div>
      </div>
    `;
  }
};

// ==========================================
// 힐링 ASMR 영상 기능 (Healing ASMR Videos)
// ==========================================
window.asmrViewMode = window.asmrViewMode || 'grid';
window.asmrActiveTag = window.asmrActiveTag || '전체';
window.asmrSortBy = window.asmrSortBy || 'latest';
window.asmrSearchQuery = window.asmrSearchQuery || '';

window.setAsmrTag = function(tag) {
  window.asmrActiveTag = tag;
  render();
};

window.setAsmrSort = function(sortVal) {
  window.asmrSortBy = sortVal;
  render();
};

window.toggleAsmrViewMode = function(mode) {
  window.asmrViewMode = mode;
  render();
};

window.handleAsmrSearch = function() {
  const q = document.getElementById('asmr-search-input').value;
  window.asmrSearchQuery = q;
  render();
};

window.openAsmrPlayerModal = function(videoId) {
  const vids = JSON.parse(localStorage.getItem('hc_archive_videos') || '[]');
  const video = vids.find(v => v.id === videoId);
  if (!video) return;

  video.views = (video.views || 0) + 1;
  const updatedVids = vids.map(v => v.id === videoId ? video : v);
  localStorage.setItem('hc_archive_videos', JSON.stringify(updatedVids));

  const modalId = 'asmr-player-modal';
  if (document.getElementById(modalId)) return;

  const visualizerBars = Array.from({ length: 15 }).map(() => {
    const delay = (Math.random() * 0.8).toFixed(2);
    const dur = (0.5 + Math.random() * 0.5).toFixed(2);
    return `<div style="width: 4px; height: 30px; background: var(--theme-color); border-radius: 2px; animation: bounce ${dur}s ease-in-out ${delay}s infinite alternate;"></div>`;
  }).join('');

  const modalHtml = `
    <div id="${modalId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15,23,42,0.85); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);">
      <div style="background: #1e293b; color: white; border-radius: 16px; padding: 0; width: 100%; max-width: 680px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); overflow: hidden; position: relative;">
        
        <div style="padding: 20px 24px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #f1f5f9; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; max-width: 80%;">${video.title}</h3>
          <button onclick="window.closeAsmrPlayerModal()" style="background: none; border: none; color: #94a3b8; font-size: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94a3b8'">×</button>
        </div>

        <div style="position: relative; width: 100%; height: 360px; background: #0f172a; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 20px;">
          <div style="position: relative; width: 140px; height: 140px; border-radius: 50%; background: radial-gradient(circle, rgba(var(--theme-color-rgb), 0.2) 0%, rgba(15,23,42,0) 70%); display: flex; align-items: center; justify-content: center;">
            <div id="asmr-disk" style="width: 110px; height: 110px; border-radius: 50%; background: #334155; border: 4px solid var(--theme-color); box-shadow: 0 0 20px rgba(var(--theme-color-rgb), 0.4); display: flex; align-items: center; justify-content: center; transition: transform 0.5s ease; animation: rotateDisk 12s linear infinite; animation-play-state: running;">
              <svg width="40" height="40" fill="white" viewBox="0 0 24 24"><path d="M12 3v9.28a4.39 4.39 0 1 0 2 3.72V7h5V3h-7z"/></svg>
            </div>
          </div>

          <div id="asmr-visualizer" style="display: flex; gap: 4px; align-items: flex-end; height: 40px; opacity: 1;">
            ${visualizerBars}
          </div>

          <div style="width: 100%; padding: 0 24px; box-sizing: border-box; position: absolute; bottom: 0; left: 0; background: linear-gradient(to top, rgba(15,23,42,0.9), transparent); padding-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              <span id="asmr-time-cur" style="font-size: 12px; color: #cbd5e1; font-family: monospace;">00:00</span>
              <div style="flex: 1; height: 6px; background: #475569; border-radius: 3px; position: relative; cursor: pointer;" onclick="window.seekAsmrMock(event)">
                <div id="asmr-progress-bar" style="width: 0%; height: 100%; background: var(--theme-color); border-radius: 3px; position: absolute; top:0; left:0;"></div>
              </div>
              <span style="font-size: 12px; color: #cbd5e1; font-family: monospace;">${video.duration || '00:05:00'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; gap: 16px; align-items: center;">
                <button id="asmr-play-btn" onclick="window.toggleAsmrMockPlay()" style="background: none; border: none; color: white; cursor: pointer; display: flex; align-items: center;">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                </button>
                <button onclick="window.restartAsmrMock()" style="background: none; border: none; color: #cbd5e1; cursor: pointer; display: flex; align-items: center;" title="처음부터">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0-.57-8.38l5.67-5.67"/></svg>
                </button>
              </div>
              <div style="display: flex; gap: 12px; font-size: 13px; color: #cbd5e1; align-items: center;">
                <span>반복 재생: <b>${video.loop || '사용'}</b></span>
                <span>음질: <span style="color: var(--theme-color); font-weight:700;">HQ 320kbps</span></span>
              </div>
            </div>
          </div>
        </div>

        <div style="padding: 24px; background: #1e293b;">
          <p style="margin: 0 0 16px 0; font-size: 14.5px; color: #cbd5e1; line-height: 1.6; word-break: keep-all;">${video.description}</p>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${(video.keywords || '').split(',').map(kw => `
              <span style="font-size: 12px; color: #94a3b8; background: #334155; padding: 4px 10px; border-radius: 6px; font-weight:600;"># ${kw.trim()}</span>
            `).join('')}
          </div>
        </div>
      </div>
      
      <style>
        @keyframes rotateDisk { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce { from { height: 5px; } to { height: 35px; } }
      </style>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  let curSeconds = 0;
  const durParts = (video.duration || '00:05:00').split(':').map(Number);
  const totalSeconds = durParts[0] * 3600 + durParts[1] * 60 + durParts[2];
  
  window.asmrIntervalId = setInterval(() => {
    const disk = document.getElementById('asmr-disk');
    
    if (disk && disk.style.animationPlayState === 'running') {
      curSeconds += 1;
      if (curSeconds > totalSeconds) {
        if (video.loop === '사용') {
          curSeconds = 0;
        } else {
          window.toggleAsmrMockPlay();
          curSeconds = totalSeconds;
        }
      }
      
      const displayMin = String(Math.floor(curSeconds / 60)).padStart(2, '0');
      const displaySec = String(curSeconds % 60).padStart(2, '0');
      const curTimeEl = document.getElementById('asmr-time-cur');
      if (curTimeEl) curTimeEl.innerText = `${displayMin}:${displaySec}`;
      
      const pct = (curSeconds / totalSeconds) * 100;
      const barEl = document.getElementById('asmr-progress-bar');
      if (barEl) barEl.style.width = pct + '%';
    }
  }, 1000);

  window.toggleAsmrMockPlay = function() {
    const disk = document.getElementById('asmr-disk');
    const playBtn = document.getElementById('asmr-play-btn');
    const visualizer = document.getElementById('asmr-visualizer');
    if (!disk) return;
    
    if (disk.style.animationPlayState === 'running') {
      disk.style.animationPlayState = 'paused';
      if (visualizer) visualizer.style.opacity = '0.3';
      if (playBtn) playBtn.innerHTML = `<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
    } else {
      disk.style.animationPlayState = 'running';
      if (visualizer) visualizer.style.opacity = '1';
      if (playBtn) playBtn.innerHTML = `<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
    }
  };

  window.restartAsmrMock = function() {
    curSeconds = 0;
    const curTimeEl = document.getElementById('asmr-time-cur');
    if (curTimeEl) curTimeEl.innerText = `00:00`;
    const barEl = document.getElementById('asmr-progress-bar');
    if (barEl) barEl.style.width = '0%';
  };

  window.seekAsmrMock = function(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = clickX / rect.width;
    curSeconds = Math.floor(pct * totalSeconds);
    
    const displayMin = String(Math.floor(curSeconds / 60)).padStart(2, '0');
    const displaySec = String(curSeconds % 60).padStart(2, '0');
    const curTimeEl = document.getElementById('asmr-time-cur');
    if (curTimeEl) curTimeEl.innerText = `${displayMin}:${displaySec}`;
    
    const barEl = document.getElementById('asmr-progress-bar');
    if (barEl) barEl.style.width = (pct * 100) + '%';
  };

  window.closeAsmrPlayerModal = function() {
    clearInterval(window.asmrIntervalId);
    const m = document.getElementById(modalId);
    if (m) m.remove();
    render();
  };
};

window.renderAsmrVideoPage = function() {
  const client = state.activeClient;
  const activeSite = state.activeSite || client.sites[0];

  const videos = JSON.parse(localStorage.getItem('hc_archive_videos') || '[]');
  
  const allTags = new Set(['전체']);
  videos.forEach(v => {
    if (v.keywords) {
      v.keywords.split(',').forEach(kw => {
        const t = kw.trim();
        if (t) allTags.add(t);
      });
    }
  });
  const tagsList = Array.from(allTags).slice(0, 10);

  let filtered = videos.filter(v => v.status === '게시' && v.exposure === '노출');

  if (window.asmrSearchQuery) {
    const q = window.asmrSearchQuery.toLowerCase();
    filtered = filtered.filter(v => 
      v.title.toLowerCase().includes(q) || 
      v.description.toLowerCase().includes(q) || 
      (v.keywords && v.keywords.toLowerCase().includes(q))
    );
  }

  if (window.asmrActiveTag !== '전체') {
    filtered = filtered.filter(v => v.keywords && v.keywords.includes(window.asmrActiveTag));
  }

  if (window.asmrSortBy === 'latest') {
    filtered.sort((a,b) => new Date(b.regDate) - new Date(a.regDate));
  } else if (window.asmrSortBy === 'views') {
    filtered.sort((a,b) => (b.views || 0) - (a.views || 0));
  } else if (window.asmrSortBy === 'title') {
    filtered.sort((a,b) => a.title.localeCompare(b.title));
  }

  const stylesHtml = `
    <style>
      .asmr-container { animation: fadeIn 0.4s ease-out; }
      .asmr-title-section { text-align: center; padding: 32px 0 24px 0; }
      .asmr-title { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0; }
      .asmr-subtitle { font-size: 15px; color: #64748b; margin-top: 12px; line-height: 1.6; }
      .asmr-controls { display: flex; flex-direction: column; gap: 16px; background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px; }
      .asmr-tags-row { display: flex; flex-wrap: wrap; gap: 8px; }
      .asmr-tag-pill { padding: 8px 16px; border: 1px solid #cbd5e1; border-radius: 100px; font-size: 13.5px; font-weight: 600; color: #475569; background: white; cursor: pointer; transition: all 0.15s; }
      .asmr-tag-pill:hover { background: #f8fafc; border-color: #94a3b8; }
      .asmr-tag-pill.active { background: var(--theme-color); border-color: var(--theme-color); color: white; }
      
      .asmr-search-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
      .asmr-search-box { display: flex; align-items: center; background: white; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; max-width: 320px; width: 100%; height: 42px; }
      .asmr-search-input { border: none; padding: 8px 12px; font-size: 14px; font-family: inherit; outline: none; flex-grow: 1; }
      .asmr-search-btn { border: none; background: #f1f5f9; padding: 0 16px; height: 100%; color: #475569; font-weight: 700; cursor: pointer; font-size: 13.5px; border-left: 1px solid #cbd5e1; }
      
      .asmr-sort-box { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #475569; }
      .asmr-sort-select { padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: inherit; font-size: 14px; outline: none; background: white; cursor: pointer; }
      
      .asmr-view-toggle { display: flex; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; background: white; }
      .asmr-toggle-btn { border: none; background: white; padding: 8px 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #64748b; }
      .asmr-toggle-btn.active { background: #f1f5f9; color: var(--theme-color); font-weight: 700; }

      .asmr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
      .asmr-grid-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; }
      .asmr-grid-card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.06); }
      .asmr-thumb-container { width: 100%; height: 160px; position: relative; background: #0f172a; overflow: hidden; }
      .asmr-play-overlay { position: absolute; inset: 0; background: rgba(15,23,42,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
      .asmr-grid-card:hover .asmr-play-overlay { opacity: 1; }
      .asmr-duration-badge { position: absolute; bottom: 8px; right: 8px; background: rgba(15,23,42,0.85); color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 700; font-family: monospace; }
      .asmr-card-info { padding: 18px; display: flex; flex-direction: column; flex-grow: 1; }
      .asmr-card-title { font-size: 16.5px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0; line-height: 1.4; }
      .asmr-card-desc { font-size: 13px; color: #64748b; line-height: 1.5; margin: 0 0 16px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex-grow: 1; }
      .asmr-card-meta { display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; font-weight: 500; border-top: 1px solid #f8fafc; padding-top: 8px; }

      .asmr-list { display: flex; flex-direction: column; gap: 16px; }
      .asmr-list-row { display: flex; background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.2s ease; height: 120px; }
      .asmr-list-row:hover { border-color: var(--theme-color); box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
      .asmr-list-thumb { width: 200px; height: 100%; position: relative; background: #0f172a; flex-shrink: 0; }
      .asmr-list-info { padding: 16px 20px; display: flex; flex-direction: column; justify-content: space-between; flex-grow: 1; }
    </style>
  `;

  const breadcrumbHtml = `
    <div style="display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: #64748b; font-weight: 600; margin-bottom: 24px; letter-spacing: -0.3px;">
      <span style="cursor: pointer; display: flex; align-items: center; gap: 4px;" onclick="window.location.hash='#/portal/${client.id}/${activeSite.siteId}'">Home</span>
      <span style="color:#cbd5e1; font-weight:normal;">&gt;</span>
      <span>심리케어</span>
      <span style="color:#cbd5e1; font-weight:normal;">&gt;</span>
      <span style="color: #0f172a; font-weight: 800;">힐링 ASMR 영상</span>
    </div>
  `;

  const titleSectionHtml = `
    <div class="asmr-title-section">
      <h1 class="asmr-title">힐링 ASMR 영상</h1>
      <p class="asmr-subtitle">스트레스 해소와 마음의 이완을 위한 다채로운 자연의 소리와 명상 백색소음을 감상해 보세요.</p>
    </div>
  `;

  const tagsHtml = tagsList.map(tag => `
    <button onclick="window.setAsmrTag('${tag}')" class="asmr-tag-pill ${window.asmrActiveTag === tag ? 'active' : ''}">${tag}</button>
  `).join('');

  const gridHtml = `
    <div class="asmr-grid">
      ${filtered.map(v => `
        <div onclick="window.openAsmrPlayerModal('${v.id}')" class="asmr-grid-card">
          <div class="asmr-thumb-container">
            ${v.thumb}
            <div class="asmr-play-overlay">
              <svg width="48" height="48" fill="white" viewBox="0 0 24 24" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <span class="asmr-duration-badge">${v.duration || '00:05:00'}</span>
          </div>
          <div class="asmr-card-info">
            <h2 class="asmr-card-title">${v.title}</h2>
            <p class="asmr-card-desc">${v.description}</p>
            <div class="asmr-card-meta">
              <span>조회수 ${v.views || 0}회</span>
              <span>${v.regDate.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  const listHtml = `
    <div class="asmr-list">
      ${filtered.map(v => `
        <div onclick="window.openAsmrPlayerModal('${v.id}')" class="asmr-list-row">
          <div class="asmr-list-thumb">
            ${v.thumb}
            <div class="asmr-play-overlay" style="opacity:1; background:rgba(0,0,0,0.1);">
              <svg width="36" height="36" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <span class="asmr-duration-badge">${v.duration || '00:05:00'}</span>
          </div>
          <div class="asmr-list-info">
            <div>
              <h2 class="asmr-card-title" style="margin-bottom:4px;">${v.title}</h2>
              <p class="asmr-card-desc" style="-webkit-line-clamp: 1; margin-bottom: 0;">${v.description}</p>
            </div>
            <div class="asmr-card-meta" style="border:none; padding:0;">
              <span>조회수 ${v.views || 0}회 &nbsp;•&nbsp; ${v.regDate.split(' ')[0]}</span>
              <span style="color:var(--theme-color); font-weight:700;">감상하기 ></span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  return `
    ${stylesHtml}
    <div class="asmr-container">
      ${breadcrumbHtml}
      ${titleSectionHtml}
      
      <div class="asmr-controls">
        <div class="asmr-tags-row">
          ${tagsHtml}
        </div>
        <div class="asmr-search-row">
          <div class="asmr-search-box">
            <input type="text" id="asmr-search-input" value="${window.asmrSearchQuery}" placeholder="영상 제목, 해시태그 검색..." class="asmr-search-input" onkeyup="if(event.key === 'Enter') window.handleAsmrSearch()">
            <button onclick="window.handleAsmrSearch()" class="asmr-search-btn">검색</button>
          </div>
          <div style="display:flex; align-items:center; gap:16px;">
            <div class="asmr-sort-box">
              <span>정렬</span>
              <select class="asmr-sort-select" onchange="window.setAsmrSort(this.value)">
                <option value="latest" ${window.asmrSortBy === 'latest' ? 'selected' : ''}>최신순</option>
                <option value="views" ${window.asmrSortBy === 'views' ? 'selected' : ''}>인기순</option>
                <option value="title" ${window.asmrSortBy === 'title' ? 'selected' : ''}>제목순</option>
              </select>
            </div>
            <div class="asmr-view-toggle">
              <button onclick="window.toggleAsmrViewMode('grid')" class="asmr-toggle-btn ${window.asmrViewMode === 'grid' ? 'active' : ''}" title="그리드 뷰">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
              </button>
              <button onclick="window.toggleAsmrViewMode('list')" class="asmr-toggle-btn ${window.asmrViewMode === 'list' ? 'active' : ''}" title="리스트 뷰">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        ${window.asmrViewMode === 'grid' ? gridHtml : listHtml}
      </div>
    </div>
  `;
};

// ==========================================
// 마이페이지 (My Page)
// ==========================================
function seedMyPageMockData() {
  if (!localStorage.getItem('hc_inquiries')) {
    const defaultInquiries = [
      {
        id: 'iq-1',
        userId: 'user_multi',
        clientId: 'kyobo',
        category: '전화상담',
        type: 'phone',
        content: '건강상담을 신청합니다. 최근 혈압이 불규칙적으로 측정되어 걱정이 많습니다. 평소 관리법과 주의사항에 대해 자세한 안내와 설명 부탁드립니다.',
        date: '2026-06-10',
        status: '완료',
        consultDate: '2026-06-12',
        consultTime: '14:00',
        answer: '홍길동 고객님, 안녕하세요. 담당 헬스케어 매니저입니다.\\n신청해주신 시간대에 맞추어 전화 통화로 자세한 일상 속 혈압 조절 방법(저염 식습관, 유산소 운동 주기 등)에 대해 친절히 안내를 도와드렸습니다. 궁금한 점이 생기시면 언제든 다시 문의주시기 바랍니다.',
        answerDate: '2026-06-11 10:30:00'
      },
      {
        id: 'iq-2',
        userId: 'user_multi',
        clientId: 'kyobo',
        category: '온라인문의',
        type: 'online',
        content: '최근 두통이 지속적으로 발생하는데 정밀 건강검진을 받아야 할 타이밍일까요? 관련해서 자세히 가이드 주시면 감사하겠습니다.',
        date: '2026-06-12',
        status: '답변완료',
        consultDate: '-',
        consultTime: '-',
        answer: '고객님 안녕하세요.\\n지속적인 두통은 스트레스나 피로에 의해서도 나타날 수 있지만 원인이 다양하므로, 가급적 빠른 시일 내에 제휴 의료기관을 통한 신경과 전문의 정밀 진단 또는 뇌 MRA/MRI를 포함한 건강검진을 받아보시는 것을 적극 권장합니다.',
        answerDate: '2026-06-13 14:15:00'
      }
    ];
    localStorage.setItem('hc_inquiries', JSON.stringify(defaultInquiries));
  }

  if (!localStorage.getItem('sub_subscribers')) {
    const defaultSubscribers = [
      {
        id: 'sub-1',
        custName: '홍길동',
        progName: '고지혈증 예방 관리 프로그램',
        catName: '심혈관질환',
        cycle: '주 1회',
        duration: '4주',
        applyDate: '2026-06-01',
        status: '구독중'
      },
      {
        id: 'sub-2',
        custName: '홍길동',
        progName: '하루 10분 스트레칭',
        catName: '생활습관 개선',
        cycle: '주 3회',
        duration: '8주',
        applyDate: '2026-05-15',
        status: '구독중'
      }
    ];
    localStorage.setItem('sub_subscribers', JSON.stringify(defaultSubscribers));
  }
}

function getMyPageHistory() {
  const user = state.currentUser;
  const client = state.activeClient;
  
  if (!user) return [];
  
  // 1. General inquiries
  const allInquiries = JSON.parse(localStorage.getItem('hc_inquiries') || '[]');
  const generalHistory = allInquiries.filter(iq => iq.userId === user.id && iq.clientId === client.id).map(iq => ({
    id: 'general-' + iq.id,
    itemType: 'general',
    category: iq.category || (iq.type === 'phone' ? '전화상담' : '온라인문의'),
    title: iq.content.split('\n')[0] || '상담 문의',
    date: iq.date || '2026-06-10',
    status: iq.status || '신청',
    details: iq
  }));

  // 2. Checkups
  const checkupHistory = JSON.parse(localStorage.getItem('hc_checkup_history') || '[]');
  const checkupHistoryMapped = checkupHistory.filter(chk => chk.userId === user.id).map(chk => ({
    id: 'checkup-' + chk.id,
    itemType: 'checkup',
    category: '건강검진',
    title: chk.pkgName || '종합건강검진',
    date: chk.applyDate || '2026-06-10',
    status: chk.status || '신청',
    details: {
      ...chk,
      supportType: chk.supportType || (chk.pkgName.includes('프리미엄') ? '건강검진 우대예약' : '회사지원')
    }
  }));

  // 3. Subscriptions
  // Local subs
  const localSubs = JSON.parse(localStorage.getItem('hc_subscribed_contents') || '[]');
  const localSubsMapped = localSubs.map(contentId => {
    let title = contentId;
    let category = '건강콘텐츠';
    let cycle = '주 1회';
    let duration = '4주';

    for (const topicKey in SUBSCRIBE_DATA) {
      const topic = SUBSCRIBE_DATA[topicKey];
      const item = topic.contents.find(c => c.id === contentId);
      if (item) {
        title = item.name;
        category = topic.title;
        cycle = item.cycle;
        duration = item.duration;
        break;
      }
    }
    const total = parseInt(duration) || 4;
    const curr = Math.min(total, 3);
    return {
      id: 'sub-local-' + contentId,
      itemType: 'subscription',
      category: category,
      title: title,
      date: '2026-06-01',
      status: '구독중',
      details: { id: contentId, type: 'local', title, category, cycle, duration, currTerm: curr, totalTerms: total }
    };
  });

  // Admin subs
  const subPrograms = JSON.parse(localStorage.getItem('sub_programs') || '[]');
  const adminSubs = JSON.parse(localStorage.getItem('sub_subscribers') || '[]');
  const adminSubsMapped = adminSubs.filter(s => s.custName === user.name && s.status !== '구독취소').map(s => {
    const prog = subPrograms.find(p => p.id === s.progId || p.name === s.progName);
    const totalTerms = prog ? prog.totalTerms : (parseInt(s.duration) || 4);
    const currTermNum = parseInt(s.currTerm) || 2;
    return {
      id: 'sub-admin-' + s.id,
      itemType: 'subscription',
      category: s.catName || '구독콘텐츠',
      title: s.progName || '구독 프로그램',
      date: s.applyDate || '2026-06-01',
      status: s.status || '구독중',
      details: { id: s.id, type: 'admin', title: s.progName, category: s.catName, cycle: s.cycle, duration: s.duration, currTerm: currTermNum, totalTerms: totalTerms }
    };
  });

  const allHistory = [...generalHistory, ...checkupHistoryMapped, ...localSubsMapped, ...adminSubsMapped];

  // Filter for last 5 years
  const cutoffDate = new Date();
  cutoffDate.setFullYear(cutoffDate.getFullYear() - 5);
  
  const filteredHistory = allHistory.filter(item => {
    const d = new Date(item.date);
    return d >= cutoffDate;
  });

  // Sort by date desc
  filteredHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

  return filteredHistory;
}

window.renderMyPage = function() {
  const user = state.currentUser;
  const client = state.activeClient;
  const activeSite = state.activeSite || client.sites[0];
  
  if (!user) {
    return `<div style="padding:80px; text-align:center; color:#64748b; font-size:16px;">로그인이 필요합니다.</div>`;
  }

  const name = user.name || "-";
  const birth = user.birth || "1985.06.12";
  const gender = user.gender || "남성";
  const phone = user.phone || "010-5678-1234";
  const email = user.email || "";
  const address = user.address || "서울특별시 종로구 인사동 10길 12, 3층";

  window.mypageMainTab = window.mypageMainTab || 'profile';
  window.mypageHistoryTab = window.mypageHistoryTab || 'all';
  window.mypageHistoryPage = window.mypageHistoryPage || 1;

  // Compute history counts
  const allFiltered = getMyPageHistory();
  const countAll = allFiltered.length;
  const countGeneral = allFiltered.filter(item => item.itemType === 'general').length;
  const countCheckup = allFiltered.filter(item => item.itemType === 'checkup').length;
  const countSubscription = allFiltered.filter(item => item.itemType === 'subscription').length;

  let activeFiltered = allFiltered;
  if (window.mypageHistoryTab !== 'all') {
    activeFiltered = allFiltered.filter(item => item.itemType === window.mypageHistoryTab);
  }

  // Pagination
  const itemsPerPage = 5;
  const totalItems = activeFiltered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  if (window.mypageHistoryPage > totalPages) {
    window.mypageHistoryPage = totalPages;
  }
  if (window.mypageHistoryPage < 1) {
    window.mypageHistoryPage = 1;
  }
  
  const startIndex = (window.mypageHistoryPage - 1) * itemsPerPage;
  const paginatedItems = activeFiltered.slice(startIndex, startIndex + itemsPerPage);

  // HTML content generation
  let tabContentHtml = '';
  
  if (window.mypageMainTab === 'profile') {
    // ACCOUNT CARD
    let accountCardHtml = '';
    const registeredId = user.portalId || localStorage.getItem('hc_portal_id_' + user.id);
    
    if (registeredId) {
      accountCardHtml = `
        <div class="mypage-card" style="margin-top: 24px;">
          <h3 class="mypage-card-title">
            <svg width="20" height="20" fill="none" stroke="var(--theme-color)" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 11 2 2 4-4"/></svg>
            계정정보
          </h3>
          
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; font-size: 14px; color: #1e40af; font-weight: 600; text-align: left; display: flex; align-items: center; gap: 10px;">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            아이디가 등록되어 있습니다. 비밀번호를 변경하여 계정을 안전하게 관리하세요.
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; align-items: end;">
            <div style="display:flex; flex-direction:column; gap:6px;">
              <span class="mypage-label">아이디</span>
              <div class="mypage-value-disabled" style="font-weight: 700; color: #0f172a; border-color: #cbd5e1; height: 46px; display: flex; align-items: center;">${registeredId}</div>
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              <span class="mypage-label">계정 상태</span>
              <div style="display:flex; align-items:center; height:46px;">
                <span style="background: #dcfce7; color: #16a34a; font-size: 13px; font-weight: 800; padding: 8px 16px; border-radius: 8px;">생성완료</span>
              </div>
            </div>
            <div style="display:flex; justify-content:flex-end;">
              <button onclick="window.openChangePasswordModal()" class="mypage-btn-secondary" style="height: 46px; width: 100%; font-weight: 700; border: 1px solid #cbd5e1; background: white; color: #475569; padding: 0 24px; border-radius: 8px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">비밀번호 변경</button>
            </div>
          </div>
        </div>
      `;
    } else {
      accountCardHtml = `
        <div class="mypage-card" style="margin-top: 24px;">
          <h3 class="mypage-card-title">
            <svg width="20" height="20" fill="none" stroke="var(--theme-color)" stroke-width="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>
            계정정보
          </h3>
          
          <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; font-size: 14px; color: #c2410c; font-weight: 600; text-align: left; display: flex; align-items: center; gap: 10px;">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            등록된 아이디가 없습니다. 아이디와 비밀번호를 설정하여 로그인 계정을 생성해 주세요.
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; align-items: end; margin-bottom: 20px;">
            <div style="display:flex; flex-direction:column; gap:6px;">
              <span class="mypage-label">아이디</span>
              <input type="text" id="mypage-new-id" placeholder="아이디 입력 (4자 이상)" style="padding:12px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; outline:none; font-family:inherit; height: 46px; box-sizing: border-box;">
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              <span class="mypage-label">비밀번호</span>
              <input type="password" id="mypage-new-pw" placeholder="비밀번호 입력 (8자 이상)" style="padding:12px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; outline:none; font-family:inherit; height: 46px; box-sizing: border-box;">
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              <span class="mypage-label">비밀번호 확인</span>
              <input type="password" id="mypage-new-pw-confirm" placeholder="비밀번호 재입력" style="padding:12px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; outline:none; font-family:inherit; height: 46px; box-sizing: border-box;">
            </div>
          </div>
          
          <div style="display:flex; justify-content:flex-end;">
            <button onclick="window.saveMyPageAccountInfo()" class="mypage-btn-primary" style="padding:12px 36px; border-radius:8px; font-weight:700; font-size:15px; cursor:pointer;">계정 생성</button>
          </div>
        </div>
      `;
    }

    tabContentHtml = `
      <div style="animation: fadeIn 0.3s ease-out;">
        <div class="mypage-card">
          <h3 class="mypage-card-title">
            <svg width="20" height="20" fill="none" stroke="var(--theme-color)" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            기본 개인정보
          </h3>
          <p style="font-size: 12.5px; color: #ef4444; margin-top: -12px; margin-bottom: 24px; font-weight: 700; text-align: left;">
            * 기본 개인정보(이름, 생년월일, 성별, 휴대폰 번호)는 연동 정보로 직접 수정할 수 없습니다.
          </p>
          
          <div style="display:flex; flex-direction:column; gap:20px;">
            <!-- 3-column row: Name, Birthdate, Gender -->
            <div class="personal-info-grid">
              <div style="display:flex; flex-direction:column; gap:6px;">
                <span class="mypage-label">이름</span>
                <div class="mypage-value-disabled" style="height: 46px; display: flex; align-items: center;">${name}</div>
              </div>
              <div style="display:flex; flex-direction:column; gap:6px;">
                <span class="mypage-label">생년월일</span>
                <div class="mypage-value-disabled" style="height: 46px; display: flex; align-items: center;">${birth}</div>
              </div>
              <div style="display:flex; flex-direction:column; gap:6px;">
                <span class="mypage-label">성별</span>
                <div class="mypage-value-disabled" style="height: 46px; display: flex; align-items: center;">${gender}</div>
              </div>
            </div>
            
            <!-- 2-column row: Phone, Email -->
            <div class="personal-info-grid-2">
              <div style="display:flex; flex-direction:column; gap:6px;">
                <span class="mypage-label">휴대폰 번호</span>
                <div class="mypage-value-disabled" style="height: 46px; display: flex; align-items: center;">${phone}</div>
              </div>
              <div style="display:flex; flex-direction:column; gap:6px;">
                <span class="mypage-label">이메일 주소 (선택)</span>
                <div style="display:flex; gap:8px; align-items:center;">
                  <input type="email" id="mypage-email" value="${email}" placeholder="이메일을 입력해주세요" style="flex:1; padding:12px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; outline:none; font-family:inherit; height: 46px; box-sizing: border-box;">
                  <span class="mypage-verify-badge">인증완료</span>
                  <button onclick="window.resendVerificationEmail()" class="mypage-btn-secondary" style="white-space:nowrap; padding:0 18px; height: 46px; font-size:13.5px; font-weight:700; border:1px solid #cbd5e1; background:white; color:#475569; border-radius:8px; cursor:pointer; box-sizing: border-box; transition: all 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">인증메일 재발송</button>
                </div>
              </div>
            </div>
            
            <!-- 1-column row: Address -->
            <div class="personal-info-grid-1">
              <div style="display:flex; flex-direction:column; gap:6px;">
                <span class="mypage-label">주소</span>
                <input type="text" id="mypage-address" value="${address}" placeholder="주소를 입력해주세요" style="width: 100%; padding:12px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; outline:none; font-family:inherit; height: 46px; box-sizing: border-box;">
              </div>
            </div>
          </div>
          
          <div style="display:flex; justify-content:flex-end; margin-top:28px;">
            <button onclick="window.saveMyPageGeneralInfo()" class="mypage-btn-primary" style="padding:12px 36px; border-radius:8px; font-weight:700; font-size:15px; cursor:pointer;">저장하기</button>
          </div>
        </div>
        
        <!-- Account Card -->
        ${accountCardHtml}
        
        <div style="margin-top: 24px; font-size: 13.5px; color: #94a3b8; line-height: 1.6; text-align: left;">
          <p style="margin: 4px 0; display: flex; align-items: center; gap: 6px;">• 이름, 생년월일, 성별, 휴대폰 번호 등 일부 정보는 연동된 정보이므로 마이페이지에서 직접 수정할 수 없습니다.</p>
          <p style="margin: 4px 0; display: flex; align-items: center; gap: 6px;">• 포털 계정을 생성하시면 최초 인증 이후 편리하게 로그인이 가능합니다.</p>
        </div>
      </div>
    `;
  } else if (window.mypageMainTab === 'history') {
    // Separate all filtered items by category
    const generalItemsAll = allFiltered.filter(item => item.itemType === 'general');
    const checkupItemsAll = allFiltered.filter(item => item.itemType === 'checkup');
    const subscriptionItemsAll = allFiltered.filter(item => item.itemType === 'subscription');

    // Helper to render pagination
    const renderHistoryPagination = (totalPages) => {
      if (totalPages <= 1) return '';
      return `
        <div style="display:flex; justify-content:center; align-items:center; gap:8px; margin-top:32px;">
          <button onclick="window.changeHistoryPage(${window.mypageHistoryPage - 1})" ${window.mypageHistoryPage === 1 ? 'disabled' : ''} style="display:flex; align-items:center; justify-content:center; width:36px; height:36px; border:1px solid #e2e8f0; background:white; border-radius:8px; cursor:${window.mypageHistoryPage === 1 ? 'not-allowed' : 'pointer'}; opacity:${window.mypageHistoryPage === 1 ? 0.4 : 1};">
            <svg width="16" height="16" fill="none" stroke="#64748b" stroke-width="2.5" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
            <button onclick="window.changeHistoryPage(${p})" style="width:36px; height:36px; border:none; background:${window.mypageHistoryPage === p ? 'var(--theme-color)' : 'transparent'};${window.mypageHistoryPage === p ? 'color:white !important;' : 'color:#475569;'} font-weight:700; border-radius:8px; cursor:pointer;">
              ${p}
            </button>
          `).join('')}
          
          <button onclick="window.changeHistoryPage(${window.mypageHistoryPage + 1})" ${window.mypageHistoryPage === totalPages ? 'disabled' : ''} style="display:flex; align-items:center; justify-content:center; width:36px; height:36px; border:1px solid #e2e8f0; background:white; border-radius:8px; cursor:${window.mypageHistoryPage === totalPages ? 'not-allowed' : 'pointer'}; opacity:${window.mypageHistoryPage === totalPages ? 0.4 : 1};">
            <svg width="16" height="16" fill="none" stroke="#64748b" stroke-width="2.5" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      `;
    };

    // Helper to render General history table (상담신청이력)
    const renderGeneralHistoryTable = (items, isStacked = false) => {
      const showTitleHtml = isStacked ? `<h4 style="font-size: 16px; font-weight: 800; color: #1e293b; margin: 24px 0 12px 0; text-align: left;">상담신청이력</h4>` : '';
      return `
        <div class="history-list-container" style="margin-top: 16px; margin-bottom: 32px; width: 100%;">
          ${showTitleHtml}
          <div class="history-header">
            <div>서비스분류</div>
            <div>문의유형</div>
            <div>등록일</div>
            <div style="text-align:left; padding-left:20px;">내용</div>
            <div>상담희망일자</div>
            <div>상담희망시간</div>
            <div>상담상태</div>
          </div>
          ${items.length === 0 ? `
            <div style="padding:40px; text-align:center; color:#94a3b8; border-bottom:1px solid #e2e8f0; background: white; font-size:14px;">신청하신 상담 및 문의 내역이 없습니다.</div>
          ` : items.map(item => {
            const isExpanded = window.mypageExpandedItems && window.mypageExpandedItems[item.id];
            let statusClass = 'status-request';
            let statusLabel = item.status;
            
            if (item.status === '완료' || item.status === '답변완료') {
              statusClass = 'status-complete';
              statusLabel = '완료';
            } else if (item.status === '취소') {
              statusClass = 'status-cancel';
              statusLabel = '취소';
            } else {
              statusLabel = '신청';
            }

            const typeLabel = item.details.type === 'phone' ? '전화상담' : '온라인문의';
            const categoryColors = {
              '건강상담': { bg: 'rgba(59, 130, 246, 0.1)', text: '#1d4ed8' },
              '병원안내': { bg: 'rgba(16, 185, 129, 0.1)', text: '#047857' },
              '진료예약': { bg: 'rgba(124, 58, 237, 0.1)', text: '#6d28d9' },
              '건강검진': { bg: 'rgba(219, 39, 119, 0.1)', text: '#db2777' }
            };
            const colors = categoryColors[item.category] || categoryColors['건강상담'];

            return `
              <div class="history-row ${isExpanded ? 'expanded' : ''}" onclick="window.toggleMyPageHistoryDetail('${item.id}')">
                <div class="history-row-main">
                  <div><span style="background:${colors.bg}; color:${colors.text}; padding:4px 10px; border-radius:100px; font-size:12px; font-weight:700; display:inline-block;">${item.category}</span></div>
                  <div><span style="color:${item.details.type === 'phone' ? '#2F4A9A' : '#17B890'}; font-weight:600;">${typeLabel}</span></div>
                  <div>${item.date}</div>
                  <div class="history-row-content" style="text-align:left; padding-left:20px;">${item.details.content}</div>
                  <div>${item.details.consultDate || '-'}</div>
                  <div>${item.details.consultTime === 'anytime' ? '전일(상시)' : (item.details.consultTime || '-')}</div>
                  <div><span class="history-status-badge ${statusClass}">${statusLabel}</span></div>
                </div>
                <div class="history-detail-area" style="display: ${isExpanded ? 'block' : 'none'};">
                  <div class="history-detail-q" style="text-align:left;">
                    <p style="font-weight:700; margin-bottom:8px; color:#1e293b;">Q. 상담 및 문의내용</p>
                    <p style="white-space: pre-wrap; color:#475569; margin:0;">${item.details.content}</p>
                  </div>
                  ${item.details.answer ? `
                    <div class="history-detail-a" style="text-align:left; margin-top:12px; padding:16px; background:rgba(var(--theme-color-rgb), 0.03); border:1px solid rgba(var(--theme-color-rgb), 0.1); border-radius:8px;">
                      <div class="answer-label" style="font-weight:700; color:var(--theme-color); margin-bottom:8px;">A. 전문가 답변</div>
                      <div class="answer-text" style="white-space: pre-wrap; color:#334155;">${item.details.answer}</div>
                      ${item.details.answerDate ? `<p style="margin:8px 0 0 0; font-size:11.5px; color:#94a3b8; text-align:right;">답변일시: ${item.details.answerDate}</p>` : ''}
                    </div>
                  ` : `
                    <div style="padding:16px; background:#fff; border-radius:8px; border:1px dashed #cbd5e1; color:#94a3b8; font-size:13px; text-align:center; margin-top:12px;">
                      담당 헬스케어 매니저가 상담 내용을 확인하고 있습니다.
                    </div>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    };

    // Helper to render Checkup history table (건강검진 신청이력)
    const renderCheckupHistoryTable = (items, isStacked = false) => {
      const showTitleHtml = isStacked ? `<h4 style="font-size: 16px; font-weight: 800; color: #1e293b; margin: 24px 0 12px 0; text-align: left;">건강검진 신청이력</h4>` : '';
      return `
        <div style="overflow-x:auto; margin-top: 16px; margin-bottom: 32px; width: 100%;">
          ${showTitleHtml}
          <table class="checkup-history-table" style="width:100%; border-collapse:collapse; font-size:13.5px; text-align:center; background:white;">
            <thead>
              <tr>
                <th style="width:120px;">신청일 (등록일)</th>
                <th style="width:120px;">지원구분</th>
                <th>검진패키지명</th>
                <th>검진대상자</th>
                <th>희망일 1</th>
                <th>희망일 2</th>
                <th>선택검사</th>
                <th>추가검사</th>
                <th>처리단계</th>
                <th>예약확정일</th>
                <th style="width:100px;">관리</th>
              </tr>
            </thead>
            <tbody>
              ${items.length === 0 ? `
                <tr><td colspan="11" style="padding:40px; color:#94a3b8; border-bottom:1px solid #e2e8f0; font-size:14px; background: white;">신청하신 건강검진 내역이 없습니다.</td></tr>
              ` : items.map(item => {
                const chk = item.details;
                const statusClass = chk.status === '확정' ? '확정' : (chk.status === '신청' ? '신청' : (chk.status === '취소요청' ? '취소요청' : '취소완료'));
                const displayStatus = chk.status === '확정' ? '예약 확정' : chk.status;
                const trId = 'mypage-chk-detail-' + chk.id;
                const isExpanded = window.mypageExpandedItems && window.mypageExpandedItems[item.id];
                
                let supportType = chk.supportType || (chk.pkgName.includes('프리미엄') ? '건강검진 우대예약' : '회사지원');
                let supportColor = supportType === '회사지원' ? '#1e40af' : '#0f766e';
                let supportBg = supportType === '회사지원' ? '#eff6ff' : '#f0fdf4';

                return `
                <tr class="main-row" style="cursor:pointer;" onclick="window.toggleMyPageHistoryDetail('${item.id}')">
                  <td>
                    <div style="font-weight:700;">${chk.applyDate}</div>
                    <div style="color:#94a3b8; font-size:12px; margin-top:4px;">오전 10:35</div>
                  </td>
                  <td>
                    <span style="background:${supportBg}; color:${supportColor}; padding:4px 8px; border-radius:6px; font-size:12px; font-weight:700; display:inline-block; border: 1px solid rgba(0,0,0,0.05);">${supportType}</span>
                  </td>
                  <td style="text-align:left; font-weight:700;">
                    <div style="color:#0f172a;">${chk.pkgName.split('-')[0].trim()}</div>
                    <div style="color:#64748b; font-size:13px; margin-top:4px; font-weight:600;">${chk.pkgName.split('-')[1]?.trim() || ''}</div>
                  </td>
                  <td style="text-align:left;">
                    <div style="font-weight:700; color:#0f172a;">${chk.targetName}</div>
                    <div style="color:#64748b; font-size:12px; margin-top:4px;">${chk.targetBirthGender.split('/')[0].trim()} / ${chk.targetBirthGender.split('/')[1]?.trim() || ''}</div>
                  </td>
                  <td style="font-weight:600; color:#475569;">${chk.wishDate1}</td>
                  <td style="font-weight:600; color:#475569;">${chk.wishDate2 || '-'}</td>
                  <td style="color:#64748b; font-size:13px;">${chk.selectedTests || '-'}</td>
                  <td style="color:#64748b; font-size:13px;">${chk.extraTests || '-'}</td>
                  <td><span class="status-badge ${statusClass}">${displayStatus}</span></td>
                  <td style="font-weight:700; color:#1e293b;">${chk.reservationConfirmedDate || '-'}</td>
                  <td onclick="event.stopPropagation();">
                    <button onclick="window.toggleMyPageHistoryDetail('${item.id}')" style="padding:6px 12px; background:white; border:1px solid #e2e8f0; color:#64748b; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer; transition:all 0.2s;">
                      ${isExpanded ? '접기' : '상세보기'}
                    </button>
                  </td>
                </tr>
                <tr id="${trId}" style="display:${isExpanded ? 'table-row' : 'none'}; background:#f8fafc;">
                  <td colspan="11" style="padding:0; text-align:left; border-bottom: 2px solid #cbd5e1;">
                    <div class="detail-panel" style="padding:24px;">
                      <div style="font-size:16px; font-weight:800; color:#0f172a; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid #e2e8f0; display:flex; align-items:center;">
                        신청 상세내역 <span style="margin:0 12px; color:#cbd5e1;">|</span> <span style="font-weight:600; color:#64748b;">${chk.pkgName} (개인결제비용: ${chk.personalCost || (chk.pkgName.includes('기본형') ? '₩200,000' : '₩300,000')})</span>
                      </div>
                      <div class="detail-grid" style="display:grid; grid-template-columns: 1fr 1.5fr 1fr 1fr; gap:24px;">
                        <div class="detail-col" style="border-right:1px solid #e2e8f0; padding-right:24px;">
                          <div class="detail-section-title" style="font-size:15px; font-weight:700; color:#2563eb; margin-bottom:16px;">신청 정보</div>
                          <div class="detail-row-item" style="display:flex; margin-bottom:12px; font-size:14px;"><span class="lbl" style="width:100px; color:#64748b; font-weight:600;">신청구분</span><span class="val" style="color:#1e293b; font-weight:700;">${supportType}</span></div>
                          <div class="detail-row-item" style="display:flex; margin-bottom:12px; font-size:14px;"><span class="lbl" style="width:100px; color:#64748b; font-weight:600;">신청일</span><span class="val" style="color:#1e293b; font-weight:700;">${chk.applyDate} 10:35</span></div>
                          <div class="detail-row-item" style="display:flex; margin-bottom:12px; font-size:14px;"><span class="lbl" style="width:100px; color:#64748b; font-weight:600;">희망일 1</span><span class="val" style="color:#1e293b; font-weight:700;">${chk.wishDate1}</span></div>
                          <div class="detail-row-item" style="display:flex; margin-bottom:12px; font-size:14px;"><span class="lbl" style="width:100px; color:#64748b; font-weight:600;">희망일 2</span><span class="val" style="color:#1e293b; font-weight:700;">${chk.wishDate2 || '-'}</span></div>
                          <div class="detail-row-item" style="display:flex; align-items:center; font-size:14px;">
                            <span class="lbl" style="width:100px; color:#64748b; font-weight:600;">처리단계</span>
                            <div style="display:flex; gap:8px;">
                              <span class="status-badge ${statusClass}" style="padding:4px 10px; font-size:12px;">${displayStatus}</span>
                              ${chk.status !== '취소요청' && chk.status !== '취소' && chk.status !== '취소완료' ? `
                              <button onclick="window.requestCancelCheckupFromMyPage('${chk.id}')" style="padding:4px 10px; background:white; border:1px solid #ef4444; color:#ef4444; border-radius:100px; font-size:12px; font-weight:700; cursor:pointer;">취소 요청</button>
                              ` : ''}
                            </div>
                          </div>
                        </div>
                        <div class="detail-col" style="border-right:1px solid #e2e8f0; padding-right:24px;">
                          <div class="detail-section-title" style="font-size:15px; font-weight:700; color:#2563eb; margin-bottom:16px;">검진대상자 정보</div>
                          <div class="detail-row-item" style="display:flex; margin-bottom:12px; font-size:14px;"><span class="lbl" style="width:100px; color:#64748b; font-weight:600;">성명</span><span class="val" style="color:#1e293b; font-weight:700;">${chk.targetName}</span></div>
                          <div class="detail-row-item" style="display:flex; margin-bottom:12px; font-size:14px;"><span class="lbl" style="width:100px; color:#64748b; font-weight:600;">생년월일/성별</span><span class="val" style="color:#1e293b; font-weight:700;">${chk.targetBirthGender}</span></div>
                          <div class="detail-row-item" style="display:flex; margin-bottom:12px; font-size:14px;"><span class="lbl" style="width:100px; color:#64748b; font-weight:600;">휴대폰번호</span><span class="val" style="color:#1e293b; font-weight:700;">${chk.targetPhone}</span></div>
                          <div class="detail-row-item" style="display:flex; margin-bottom:12px; font-size:14px;"><span class="lbl" style="width:100px; color:#64748b; font-weight:600;">주소</span><span class="val" style="color:#1e293b; font-weight:700; line-height:1.5;">${chk.targetAddress}</span></div>
                        </div>
                        <div class="detail-col" style="border-right:1px solid #e2e8f0; padding-right:24px;">
                          <div class="detail-section-title" style="font-size:15px; font-weight:700; color:#2563eb; margin-bottom:16px;">선택검사</div>
                          <ul class="detail-list" style="padding-left:20px; margin:0; color:#1e293b; font-weight:600; line-height:1.6;">
                            ${chk.selectedTests ? chk.selectedTests.split(',').map(t => `<li>${t.trim()}</li>`).join('') : '<li>-</li>'}
                          </ul>
                        </div>
                        <div class="detail-col">
                          <div class="detail-section-title" style="font-size:15px; font-weight:700; color:#2563eb; margin-bottom:16px;">추가검사</div>
                          <ul class="detail-list" style="padding-left:20px; margin:0; color:#1e293b; font-weight:600; line-height:1.6;">
                            ${chk.extraTests ? chk.extraTests.split(',').map(t => `<li>${t.trim()}</li>`).join('') : '<li>-</li>'}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    };

    // Helper to render Subscription history table (구독서비스 신청이력)
    const renderSubscriptionHistoryTable = (items, isStacked = false) => {
      const showTitleHtml = isStacked ? `<h4 style="font-size: 16px; font-weight: 800; color: #1e293b; margin: 24px 0 12px 0; text-align: left;">구독서비스 신청이력</h4>` : '';
      return `
        <div style="overflow-x:auto; margin-top: 16px; margin-bottom: 32px; width: 100%;">
          ${showTitleHtml}
          <table class="checkup-history-table" style="width:100%; border-collapse:collapse; font-size:13.5px; text-align:center; background:white;">
            <thead>
              <tr>
                <th style="width:120px;">카테고리</th>
                <th>콘텐츠명</th>
                <th>신청일</th>
                <th>현재진행차수</th>
                <th>총 차수</th>
                <th>신청상태</th>
                <th style="width:150px;">관리</th>
              </tr>
            </thead>
            <tbody>
              ${items.length === 0 ? `
                <tr><td colspan="7" style="padding:40px; color:#94a3b8; border-bottom:1px solid #e2e8f0; font-size:14px; background: white;">신청하신 구독서비스 내역이 없습니다.</td></tr>
              ` : items.map(item => {
                const isExpanded = window.mypageExpandedItems && window.mypageExpandedItems[item.id];
                
                let statusLabel = '구독중';
                let statusClass = '신청';
                if (item.status === '구독취소' || item.status === '구독해지' || item.status === '취소') {
                  statusLabel = '취소';
                  statusClass = '취소완료';
                } else if (item.status === '구독완료' || item.status === '완료') {
                  statusLabel = '완료';
                  statusClass = '확정';
                }

                const isCancelled = statusLabel === '취소';

                return `
                <tr class="main-row" style="cursor:pointer;" onclick="window.toggleMyPageHistoryDetail('${item.id}')">
                  <td>
                    <span style="background:#f3e8ff; color:#6b21a8; padding:4px 8px; border-radius:6px; font-size:12px; font-weight:700; display:inline-block;">${item.category}</span>
                  </td>
                  <td style="text-align:left; font-weight:700; color:#0f172a;">${item.title}</td>
                  <td>${item.date}</td>
                  <td style="font-weight:700; color:#2563eb;">${item.details.currTerm || '1'}차</td>
                  <td style="font-weight:700; color:#475569;">${item.details.totalTerms || '4'}차</td>
                  <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
                  <td onclick="event.stopPropagation();">
                    <div style="display:flex; gap:6px; justify-content:center;">
                      <button onclick="window.toggleMyPageHistoryDetail('${item.id}')" style="padding:6px 10px; background:white; border:1px solid #e2e8f0; color:#64748b; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer; transition:all 0.2s;">
                        ${isExpanded ? '접기' : '상세보기'}
                      </button>
                      ${!isCancelled ? `
                        <button onclick="window.cancelMyPageSubscription('${item.details.type}', '${item.details.id}')" style="padding:6px 10px; border:1px solid #fca5a5; background:white; color:#ef4444; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='#fef2f2';" onmouseout="this.style.background='white';">
                          구독 해지
                        </button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
                <tr style="display:${isExpanded ? 'table-row' : 'none'}; background:#f8fafc;">
                  <td colspan="7" style="padding:0; text-align:left; border-bottom: 2px solid #cbd5e1;">
                    <div style="padding:16px 24px; display:flex; justify-content:space-between; align-items:center;">
                      <div>
                        <span style="font-size:12px; color:#64748b; font-weight:600; display:block; margin-bottom:4px;">구독 상세정보</span>
                        <span style="font-size:13.5px; font-weight:700; color:#1e293b;">
                          주기: ${item.details.cycle || '주 1회'} / 기간: ${item.details.duration || '4주'} (진행률: ${Math.round(((item.details.currTerm || 1) / (item.details.totalTerms || 4)) * 100)}%)
                        </span>
                      </div>
                      <div style="font-size:13px; color:#64748b; font-weight:600;">
                        상태: <span style="color:${isCancelled ? '#ef4444' : '#16a34a'}; font-weight:700;">${isCancelled ? '구독 해지됨' : '정상 구독 중'}</span>
                      </div>
                    </div>
                  </td>
                </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    };

    let paginationHtml = '';
    let tableHtml = '';

    if (window.mypageHistoryTab === 'general') {
      const itemsPerPage = 5;
      const totalItems = generalItemsAll.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
      if (window.mypageHistoryPage > totalPages) window.mypageHistoryPage = totalPages;
      if (window.mypageHistoryPage < 1) window.mypageHistoryPage = 1;
      const startIndex = (window.mypageHistoryPage - 1) * itemsPerPage;
      const paginatedGeneral = generalItemsAll.slice(startIndex, startIndex + itemsPerPage);

      paginationHtml = renderHistoryPagination(totalPages);
      tableHtml = renderGeneralHistoryTable(paginatedGeneral);
    } else if (window.mypageHistoryTab === 'checkup') {
      const itemsPerPage = 5;
      const totalItems = checkupItemsAll.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
      if (window.mypageHistoryPage > totalPages) window.mypageHistoryPage = totalPages;
      if (window.mypageHistoryPage < 1) window.mypageHistoryPage = 1;
      const startIndex = (window.mypageHistoryPage - 1) * itemsPerPage;
      const paginatedCheckup = checkupItemsAll.slice(startIndex, startIndex + itemsPerPage);

      paginationHtml = renderHistoryPagination(totalPages);
      tableHtml = renderCheckupHistoryTable(paginatedCheckup);
    } else if (window.mypageHistoryTab === 'subscription') {
      const itemsPerPage = 5;
      const totalItems = subscriptionItemsAll.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
      if (window.mypageHistoryPage > totalPages) window.mypageHistoryPage = totalPages;
      if (window.mypageHistoryPage < 1) window.mypageHistoryPage = 1;
      const startIndex = (window.mypageHistoryPage - 1) * itemsPerPage;
      const paginatedSubscription = subscriptionItemsAll.slice(startIndex, startIndex + itemsPerPage);

      paginationHtml = renderHistoryPagination(totalPages);
      tableHtml = renderSubscriptionHistoryTable(paginatedSubscription);
    } else {
      // 'all' tab
      const itemsPerPage = 5;
      const totalItems = allFiltered.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
      if (window.mypageHistoryPage > totalPages) window.mypageHistoryPage = totalPages;
      if (window.mypageHistoryPage < 1) window.mypageHistoryPage = 1;
      const startIndex = (window.mypageHistoryPage - 1) * itemsPerPage;
      const paginatedItems = allFiltered.slice(startIndex, startIndex + itemsPerPage);

      const paginatedGeneral = paginatedItems.filter(item => item.itemType === 'general');
      const paginatedCheckup = paginatedItems.filter(item => item.itemType === 'checkup');
      const paginatedSubscription = paginatedItems.filter(item => item.itemType === 'subscription');

      paginationHtml = renderHistoryPagination(totalPages);
      tableHtml = `
        ${renderGeneralHistoryTable(paginatedGeneral, true)}
        ${renderCheckupHistoryTable(paginatedCheckup, true)}
        ${renderSubscriptionHistoryTable(paginatedSubscription, true)}
      `;
    }

    tabContentHtml = `
      <div style="animation: fadeIn 0.3s ease-out;">
        <!-- Sub tabs pills -->
        <div class="mypage-sub-tabs" style="display:flex; gap:8px; margin-bottom:24px; overflow-x:auto; padding-bottom:8px;">
          <button onclick="window.switchMyPageHistoryTab('all')" class="mypage-pill-btn ${window.mypageHistoryTab === 'all' ? 'active' : ''}">
            전체 <span class="mypage-pill-count">${countAll}</span>
          </button>
          <button onclick="window.switchMyPageHistoryTab('general')" class="mypage-pill-btn ${window.mypageHistoryTab === 'general' ? 'active' : ''}">
            상담신청이력 <span class="mypage-pill-count">${countGeneral}</span>
          </button>
          <button onclick="window.switchMyPageHistoryTab('checkup')" class="mypage-pill-btn ${window.mypageHistoryTab === 'checkup' ? 'active' : ''}">
            건강검진 신청이력 <span class="mypage-pill-count">${countCheckup}</span>
          </button>
          <button onclick="window.switchMyPageHistoryTab('subscription')" class="mypage-pill-btn ${window.mypageHistoryTab === 'subscription' ? 'active' : ''}">
            구독서비스 신청이력 <span class="mypage-pill-count">${countSubscription}</span>
          </button>
        </div>
        
        <div style="min-height: 350px;">
          ${tableHtml}
        </div>
        
        ${paginationHtml}
        
        <div style="margin-top: 32px; font-size: 13.5px; color: #94a3b8; line-height: 1.6; text-align: left; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          <p style="margin: 4px 0;">• 최근 5년간의 신청 내역을 확인할 수 있습니다.</p>
          <p style="margin: 4px 0;">• 이전 내역 조회나 상세 진행 상황 확인은 헬스케어 고객센터로 문의해 주시기 바랍니다.</p>
        </div>
      </div>
    `;
  }

  const stylesHtml = `
    <style>
      .mypage-container {
        padding: 24px 0;
        animation: fadeIn 0.4s ease-out;
      }
      .mypage-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        padding: 28px;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01);
        text-align: left;
      }
      .mypage-card-title {
        font-size: 18px;
        font-weight: 800;
        color: #0f172a;
        margin-top: 0;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .mypage-label {
        font-size: 13px;
        font-weight: 700;
        color: #64748b;
        margin-bottom: 6px;
        display: block;
      }
      .mypage-value-disabled {
        padding: 12px 14px;
        background: #f8fafc;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        font-size: 14px;
        color: #64748b;
        cursor: not-allowed;
        font-weight: 600;
        width: 100%;
        box-sizing: border-box;
      }
      .mypage-btn-primary {
        padding: 12px 24px;
        background: var(--theme-color);
        border: none;
        border-radius: 8px;
        color: white;
        font-size: 14.5px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .mypage-btn-primary:hover {
        filter: brightness(0.95);
      }
      .mypage-verify-badge {
        background: #dcfce7;
        color: #16a34a;
        font-size: 12.5px;
        font-weight: 800;
        padding: 10px 14px;
        border-radius: 8px;
        white-space: nowrap;
      }
      .personal-info-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }
      .personal-info-grid-2 {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      .personal-info-grid-1 {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .mypage-pill-btn {
        padding: 10px 18px;
        font-size: 14px;
        font-weight: 700;
        border-radius: 100px;
        border: 1px solid #e2e8f0;
        background: white;
        color: #64748b;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s;
        white-space: nowrap;
      }
      .mypage-pill-btn:hover {
        background: #f8fafc;
        color: #0f172a;
      }
      .mypage-pill-btn.active {
        background: var(--theme-color);
        border-color: var(--theme-color);
        color: white;
      }
      .mypage-pill-count {
        font-size: 11px;
        font-weight: 800;
        background: #cbd5e1;
        color: #475569;
        padding: 2px 6px;
        border-radius: 100px;
      }
      .mypage-pill-btn.active .mypage-pill-count {
        background: white;
        color: var(--theme-color);
      }
      
      .mypage-history-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01);
        margin-bottom: 16px;
        transition: all 0.2s ease;
      }
      .mypage-history-card:hover {
        border-color: rgba(var(--theme-color-rgb), 0.3);
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.04);
      }
      .mypage-tag-category {
        font-size: 12px;
        font-weight: 800;
        padding: 4px 10px;
        border-radius: 100px;
      }
      .mypage-status-badge {
        font-size: 12px;
        font-weight: 800;
        padding: 4px 10px;
        border-radius: 100px;
        display: inline-block;
      }
      .mypage-status-badge.status-complete {
        background: #dcfce7;
        color: #16a34a;
      }
      .mypage-status-badge.status-request {
        background: #e0f2fe;
        color: #0284c7;
      }
      .mypage-status-badge.status-cancel {
        background: #f1f5f9;
        color: #64748b;
      }
      
      .mypage-history-content {
        font-size: 15px;
        color: #1e293b;
        font-weight: 700;
        line-height: 1.5;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
      }
      .mypage-history-card.expanded .mypage-history-content {
        white-space: normal;
      }
      
      .mypage-history-footer {
        display: flex;
        gap: 16px;
        font-size: 13px;
        color: #64748b;
        margin-top: 8px;
      }
      
      /* Checkup and general history table styles for MyPage */
      .checkup-history-table { width:100%; border-collapse:collapse; font-size:13.5px; text-align:center; background:white; border-radius:12px; overflow:hidden; border:1px solid #e2e8f0; }
      .checkup-history-table th { background:#f8fafc; padding:14px 10px; color:#475569; font-weight:700; border-bottom:1px solid #e2e8f0; border-top:none; font-size:13px; }
      .checkup-history-table td { padding:14px 10px; border-bottom:1px solid #e2e8f0; color:#1e293b; vertical-align:middle; }
      .checkup-history-table tr.main-row:hover { background:#f8fafc; }
      .checkup-history-table .status-badge { display:inline-block; padding:4px 10px; border-radius:100px; font-size:12.5px; font-weight:700; }
      .checkup-history-table .status-badge.신청 { background:#e0f2fe; color:#0284c7; }
      .checkup-history-table .status-badge.확정 { background:#dcfce7; color:#16a34a; }
      .checkup-history-table .status-badge.취소요청 { background:#ffedd5; color:#ea580c; }
      .checkup-history-table .status-badge.취소완료 { background:#f1f5f9; color:#64748b; }
      .checkup-history-table .status-badge.취소대기 { background:#ffedd5; color:#ea580c; }
      .detail-panel { text-align:left; padding:20px; background:#f8fafc; }
      .detail-section-title { font-size:14.5px; font-weight:700; color:#2563eb; margin-bottom:12px; display:flex; align-items:center; }
      .detail-grid { display:grid; grid-template-columns: 1fr 1.5fr 1fr 1fr; gap:20px; }
      .detail-col { border-right:1px solid #e2e8f0; padding-right:20px; }
      .detail-col:last-child { border-right:none; padding-right:0; }
      .detail-row-item { display:flex; margin-bottom:10px; font-size:13.5px; }
      .detail-row-item .lbl { width:90px; color:#64748b; font-weight:600; flex-shrink:0; }
      .detail-row-item .val { color:#1e293b; font-weight:700; }
      .detail-list { padding-left:18px; margin:0; color:#1e293b; font-weight:600; line-height:1.5; font-size:13px; }
      .detail-list li { margin-bottom:4px; }
    </style>
  `;

  return `
    ${stylesHtml}
    <div class="mypage-container">
      <!-- Breadcrumb -->
      <div style="display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: #64748b; font-weight: 600; margin-bottom: 24px; letter-spacing: -0.3px;">
        <span style="cursor: pointer; display: flex; align-items: center; gap: 4px;" onclick="window.location.hash='#/portal/${client.id}/${activeSite.siteId}'">Home</span>
        <span style="color:#cbd5e1; font-weight:normal;">&gt;</span>
        <span style="color: #0f172a; font-weight: 800;">마이페이지</span>
      </div>

      <!-- Title area -->
      <div style="margin-bottom: 32px; text-align: left;">
        <h1 style="font-size: 28px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0;">마이페이지</h1>
        <p style="font-size: 15px; color: #64748b; margin: 0;">계정 관리 및 서비스 신청 내역을 확인할 수 있습니다.</p>
      </div>

      <!-- Segmented main tabs -->
      <div class="mypage-main-tab-bar" style="display:flex; border-bottom:2px solid #cbd5e1; margin-bottom:32px; gap: 8px;">
        <button onclick="window.switchMyPageMainTab('profile')" class="mypage-main-tab-btn ${window.mypageMainTab === 'profile' ? 'active' : ''}" style="padding:14px 28px; font-size:16px; font-weight:800; border:none; background:transparent; border-bottom:3px solid ${window.mypageMainTab === 'profile' ? 'var(--theme-color)' : 'transparent'}; color:${window.mypageMainTab === 'profile' ? 'var(--theme-color)' : '#64748b'}; cursor:pointer; transition:all 0.15s; position:relative; margin-bottom:-2px;">
          개인정보
        </button>
        <button onclick="window.switchMyPageMainTab('history')" class="mypage-main-tab-btn ${window.mypageMainTab === 'history' ? 'active' : ''}" style="padding:14px 28px; font-size:16px; font-weight:800; border:none; background:transparent; border-bottom:3px solid ${window.mypageMainTab === 'history' ? 'var(--theme-color)' : 'transparent'}; color:${window.mypageMainTab === 'history' ? 'var(--theme-color)' : '#64748b'}; cursor:pointer; transition:all 0.15s; position:relative; margin-bottom:-2px;">
          신청이력
        </button>
      </div>

      <!-- Tab contents -->
      <div>
        ${tabContentHtml}
      </div>
    </div>
  `;
};

window.switchMyPageMainTab = function(tab) {
  window.mypageMainTab = tab;
  window.mypageHistoryPage = 1;
  render();
};

window.switchMyPageHistoryTab = function(tab) {
  window.mypageHistoryTab = tab;
  window.mypageHistoryPage = 1;
  render();
};

window.changeHistoryPage = function(page) {
  window.mypageHistoryPage = page;
  render();
};

window.toggleMyPageHistoryDetail = function(id) {
  window.mypageExpandedItems = window.mypageExpandedItems || {};
  window.mypageExpandedItems[id] = !window.mypageExpandedItems[id];
  render();
};

window.saveMyPageGeneralInfo = function() {
  const emailInput = document.getElementById('mypage-email');
  const addressInput = document.getElementById('mypage-address');
  const user = state.currentUser;
  
  if (emailInput) {
    const emailValue = emailInput.value.trim();
    if (emailValue && !emailValue.includes('@')) {
      alert('올바른 이메일 형식을 입력해 주세요.');
      return;
    }
    user.email = emailValue;
    localStorage.setItem('hc_user_email_' + user.id, emailValue);
  }
  
  if (addressInput) {
    const addressValue = addressInput.value.trim();
    user.address = addressValue;
    localStorage.setItem('hc_user_address_' + user.id, addressValue);
  }
  
  alert('개인정보가 저장되었습니다.');
  render();
};

window.resendVerificationEmail = function() {
  const emailInput = document.getElementById('mypage-email');
  const emailValue = emailInput ? emailInput.value.trim() : '';
  if (!emailValue) {
    alert('이메일 주소를 먼저 입력해 주세요.');
    return;
  }
  alert(emailValue + ' 주소로 인증 메일이 재발송되었습니다.');
};

window.saveMyPageAccountInfo = function() {
  const newId = document.getElementById('mypage-new-id').value;
  const newPw = document.getElementById('mypage-new-pw').value;
  const newPwConfirm = document.getElementById('mypage-new-pw-confirm').value;
  
  if (!newId || newId.length < 4) {
    alert('아이디는 4자 이상 입력해 주세요.');
    return;
  }
  if (!newPw || newPw.length < 8) {
    alert('비밀번호는 8자 이상 입력해 주세요.');
    return;
  }
  if (newPw !== newPwConfirm) {
    alert('비밀번호 확인이 일치하지 않습니다.');
    return;
  }
  
  const user = state.currentUser;
  user.portalId = newId;
  localStorage.setItem('hc_portal_id_' + user.id, newId);
  localStorage.setItem('hc_portal_pw_' + user.id, newPw);
  
  alert('성공적으로 계정이 생성되었습니다.');
  render();
};

window.openChangePasswordModal = function() {
  const modalId = 'mypage-password-modal';
  if (document.getElementById(modalId)) return;
  
  const modalHtml = `
    <div id="${modalId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
      <div style="background: white; border-radius: 16px; padding: 32px; width: 100%; max-width: 440px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); text-align: left; animation: modalFadeIn 0.3s ease-out;">
        <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 800; color: #0f172a; display:flex; align-items:center; gap:8px;">
          <svg width="22" height="22" fill="none" stroke="var(--theme-color)" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          비밀번호 변경
        </h3>
        
        <form onsubmit="window.submitChangePortalPassword(event)" style="display:flex; flex-direction:column; gap:16px;">
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label class="mypage-label" style="font-size:13px;">현재 비밀번호</label>
            <input type="password" id="modal-curr-pw" required placeholder="현재 비밀번호 입력" style="padding:12px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; outline:none; font-family:inherit;">
          </div>
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label class="mypage-label" style="font-size:13px;">새 비밀번호</label>
            <input type="password" id="modal-new-pw" required placeholder="영문, 숫자, 특수문자 포함 8자 이상" style="padding:12px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; outline:none; font-family:inherit;">
          </div>
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label class="mypage-label" style="font-size:13px;">새 비밀번호 확인</label>
            <input type="password" id="modal-new-pw-confirm" required placeholder="새 비밀번호 재입력" style="padding:12px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; outline:none; font-family:inherit;">
          </div>
          
          <div style="display: flex; gap: 12px; margin-top: 12px;">
            <button type="button" onclick="window.closeChangePasswordModal()" style="flex: 1; padding: 14px; border-radius: 8px; border: 1px solid #cbd5e1; background: white; color: #475569; font-size: 15px; font-weight: 700; cursor: pointer;">취소</button>
            <button type="submit" style="flex: 1; padding: 14px; border-radius: 8px; border: none; background: var(--theme-color); color: white; font-size: 15px; font-weight: 700; cursor: pointer;">변경하기</button>
          </div>
        </form>
      </div>
      <style>@keyframes modalFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }</style>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.closeChangePasswordModal = function() {
  const modal = document.getElementById('mypage-password-modal');
  if (modal) modal.remove();
};

window.submitChangePortalPassword = function(event) {
  event.preventDefault();
  const currPw = document.getElementById('modal-curr-pw').value;
  const newPw = document.getElementById('modal-new-pw').value;
  const newPwConfirm = document.getElementById('modal-new-pw-confirm').value;
  
  if (newPw.length < 8) {
    alert('새 비밀번호는 8자 이상이어야 합니다.');
    return;
  }
  if (newPw !== newPwConfirm) {
    alert('새 비밀번호가 일치하지 않습니다.');
    return;
  }
  
  const user = state.currentUser;
  localStorage.setItem('hc_portal_pw_' + user.id, newPw);
  
  alert('비밀번호가 성공적으로 변경되었습니다.');
  window.closeChangePasswordModal();
  render();
};

window.cancelMyPageSubscription = function(type, id) {
  if (confirm('구독을 해지하시겠습니까?')) {
    if (type === 'local') {
      let localSubs = JSON.parse(localStorage.getItem('hc_subscribed_contents') || '[]');
      localSubs = localSubs.filter(subId => subId !== id);
      localStorage.setItem('hc_subscribed_contents', JSON.stringify(localSubs));
    } else {
      let adminSubs = JSON.parse(localStorage.getItem('sub_subscribers') || '[]');
      const idx = adminSubs.findIndex(s => s.id === id);
      if (idx !== -1) {
        adminSubs[idx].status = '구독취소';
        localStorage.setItem('sub_subscribers', JSON.stringify(adminSubs));
      }
    }
    alert('구독이 해지되었습니다.');
    render();
  }
};

window.requestCancelCheckupFromMyPage = function(id) {
  if (confirm('예약을 취소하시겠습니까?\\n(취소신청이 전달되며 최종 확정 시 취소 완료 처리됩니다.)')) {
    let hist = JSON.parse(localStorage.getItem('hc_checkup_history') || '[]');
    const idx = hist.findIndex(h => h.id === id);
    if (idx !== -1) {
      hist[idx].status = '취소요청';
      localStorage.setItem('hc_checkup_history', JSON.stringify(hist));
      alert('예약 취소 신청이 완료되었습니다.');
      render();
    }
  }
};

render();



