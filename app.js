// Data Models (Default/Fallback)
const clientConfigs = {
  kyobo: {
    id: "kyobo", name: "교보생명", serviceName: "교보생명", csNumber: "1588-1001", clientLink: "", dasomLink: "", themeColor: "#2F4A9A", themeColorRgb: "47, 74, 154", logoText: "교보생명 헬스케어",
    tiers: ["기본플랜", "VIP플랜"],
    heroText: { title: "건강한 내일을 위한 첫걸음", subtitle: "교보생명 전용 헬스케어 포털에서 제공하는 프리미엄 건강 관리 서비스를 지금 바로 경험해보세요.", csNumber: "1588-1001" }, menus: []
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

const defaultMenus = [
  { id: "serviceGuide", label: "서비스 안내", isVisible: true, children: [] },
  {
    id: "healthConsulting", label: "건강상담", isVisible: true, children: [
      { id: "consultApply", label: "건강상담 신청", isVisible: true, children: [] },
      { id: "consultHistory", label: "전화상담 및 온라인 문의 이력", isVisible: true, children: [] }
    ]
  },
  {
    id: "hospitalGuide", label: "병원안내", isVisible: true, children: [
      { id: "search", label: "병원검색", isVisible: true, children: [] },
      { id: "expert", label: "명의안내", isVisible: true, children: [] }
    ]
  },
  {
    id: "medicalAppt", label: "진료예약", isVisible: true, children: [
      { id: "history", label: "상담 신청 이력", isVisible: true, children: [] }
    ]
  },
  {
    id: "checkupAppt", label: "건강검진 예약", isVisible: true, children: [
      { id: "checkupHistory", label: "건강검진 신청이력", isVisible: true, children: [] }
    ]
  },
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
            <table id="${modalId}-table-basic" style="width: 100%; border-collapse: collapse; text-align: center; font-size: 14px; border-top: 2px solid #cbd5e1;">
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

            <!-- Table 2: Optional -->
            <table id="${modalId}-table-optional" style="width: 100%; border-collapse: collapse; text-align: center; font-size: 14px; border-top: 2px solid #cbd5e1; display: none;">
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

            <!-- Table 3: Additional -->
            <table id="${modalId}-table-additional" style="width: 100%; border-collapse: collapse; text-align: center; font-size: 14px; border-top: 2px solid #cbd5e1; display: none;">
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
      
      // Mock Logic for June 2026 (시안 데이터 기반)
      if (month === 5 && year === 2026) {
        if (isSunday) {
          statusHtml = `<div style="color: #ef4444; font-size: 13px; font-weight: 700; margin-top: 6px;">휴일</div>`;
        } else if ([2, 9, 10, 16, 17, 18, 23, 24, 29, 30].includes(day)) {
          isAvailable = true;
          statusHtml = `
            <div style="background: #3b82f6; color: white; display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; margin-top: 6px; margin-bottom: 4px;">예약가능</div>
            <div style="color: #64748b; font-size: 11px; margin-top: 2px; letter-spacing: -0.5px;">• 대장내시경 마감</div>
            <div style="color: #64748b; font-size: 11px; margin-top: 2px; letter-spacing: -0.5px;">• 유방초음파 마감</div>
          `;
        } else {
          statusHtml = `<div style="color: #94a3b8; font-size: 13px; font-weight: 700; margin-top: 6px; text-decoration: line-through;">예약마감</div>`;
        }
      } else {
        // 기본은 모두 마감 처리
        if (isSunday) {
          statusHtml = `<div style="color: #ef4444; font-size: 13px; font-weight: 700; margin-top: 6px;">휴일</div>`;
        } else {
          statusHtml = `<div style="color: #94a3b8; font-size: 13px; font-weight: 700; margin-top: 6px; text-decoration: line-through;">예약마감</div>`;
        }
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

  const updateCalendar = (y, m) => {
    document.getElementById(`${modalId}-calendar-body`).innerHTML = renderCalendar(y, m);
    document.getElementById(`${modalId}-month-title`).innerText = `${y}년 ${m + 1}월`;
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

  document.getElementById(`${modalId}-prev`).onclick = () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    updateCalendar(currentYear, currentMonth);
  };

  document.getElementById(`${modalId}-next`).onclick = () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    updateCalendar(currentYear, currentMonth);
  };
};

function getSortedAccessibleSites(client, userTiers) {
  if (!client || !client.sites) return [];
  const sites = client.sites.filter(site =>
    site.mappedTiers.some(t => userTiers.includes(t))
  );

  sites.sort((a, b) => {
    const getMinTierIndex = (site) => {
      if (!site.mappedTiers || site.mappedTiers.length === 0) return 999;
      const indices = site.mappedTiers
        .map(t => client.tiers ? client.tiers.indexOf(t) : -1)
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
        if (!clientConfigs[id]) {
          clientConfigs[id] = parsed[id];
        }
      });
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
          if (checkupApptMenu) {
            if (!checkupApptMenu.children) checkupApptMenu.children = [];
            if (checkupApptMenu.children.length === 0) {
              checkupApptMenu.children.push({ id: "checkupPreferred", defaultLabel: "건강검진 우대예약", label: "건강검진 우대예약", isVisible: true, children: [] });
            }
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

window.submitCheckupDesign = function () {
  const name = document.getElementById('checkup-name').value;
  const phone = document.getElementById('checkup-phone').value;
  const date = document.getElementById('checkup-date').value;
  const time = document.getElementById('checkup-time').value;
  const memo = document.getElementById('checkup-memo').value;

  if (!phone || !date || !memo) {
    alert('연락처, 상담 희망 일자, 건강 우려사항을 모두 입력해주세요.');
    return;
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Past date validation
  if (date < todayStr) {
    showModal('신청 불가', '과거 날짜로는 상담을 신청하실 수 없습니다. 오늘 이후의 날짜를 선택해주세요.');
    return;
  }

  const inquiries = JSON.parse(localStorage.getItem('hc_inquiries') || '[]');
  const newEntry = {
    id: Date.now(),
    clientId: state.activeClient.id,
    userId: state.currentUser.id,
    userName: state.currentUser.name,
    type: 'phone',
    category: '건강검진',
    title: '건강검진 전문가 맞춤 설계 신청',
    content: `[자가진단 상담 신청]\n성함: ${name}\n연락처: ${phone}\n상담시간대: ${time === 'anytime' ? '전일' : (time === 'morning' ? '오전' : '오후')}\n\n[상담/요청 내용]\n${memo}`,
    date: todayStr,
    status: '접수완료',
    answer: null,
    answerDate: null,
    consultDate: date,
    consultTime: time === 'anytime' ? 'anytime' : (time === 'morning' ? '09:00~12:00' : '13:00~18:00')
  };

  inquiries.push(newEntry);
  localStorage.setItem('hc_inquiries', JSON.stringify(inquiries));

  showToast('전문가 건강검진 맞춤설계 신청이 접수되었습니다.');
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
  if (state.activeMenuId === 'hospitalGuide' || menuLabel.includes('병원안내')) {
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
      title: state.activeMenuId === 'medicalAppt' ? '진료예약 상담 신청' : (state.activeMenuId === 'hospitalGuide' ? '병원안내 상담 신청' : '전화 건강상담 신청'),
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
        const hasAccess = menu.exposedTiers.some(tier => userTiers.includes(tier));
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

function renderPortal() {
  const client = state.activeClient;
  const activeSite = state.activeSite || client.sites[0];

  const userTiers = state.currentUser ? (state.currentUser.tiers[client.id] || []) : [];
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

    const isConsultingGroup = state.activeMenuId === 'healthConsulting' || activeMenu?.id === 'healthConsulting' || pageTitle.includes('상담');
    const isHistoryPage = state.activeSubId === 'consultHistory' || activeSub?.id === 'consultHistory' || pageTitle.includes('상담 이력') || pageTitle.includes('문의 내역') || state.activeSubId === 'history' || activeSub?.id === 'history';
    const isCheckupHistoryPage = state.activeSubId === 'checkupHistory' || activeSub?.id === 'checkupHistory' || state.activeSubSubId === 'checkupHistory' || activeSubSub?.id === 'checkupHistory' || pageTitle.includes('신청이력');
    const isHospitalGuideGroup = state.activeMenuId === 'hospitalGuide' || activeMenu?.id === 'hospitalGuide' || pageTitle.includes('병원안내');
    const isMedicalApptGroup = state.activeMenuId === 'medicalAppt' || activeMenu?.id === 'medicalAppt' || pageTitle.includes('진료예약');
    const isCheckupGroup = state.activeMenuId === 'checkupAppt' || activeMenu?.id === 'checkupAppt' || pageTitle.includes('건강검진');

    if (isHistoryPage) {
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
            reservationConfirmedDate: '2026-05-15'
          },
          {
            id: 'chk-002',
            userId: 'user1',
            pkgName: '우리허브병원 - 기본형',
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
            reservationConfirmedDate: ''
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
                        신청 상세내역 <span style="margin:0 12px; color:#cbd5e1;">|</span> <span style="font-weight:600; color:#64748b;">${chk.pkgName}</span>
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
                  ${Array.from({ length: 9 }, (_, i) => 9 + i).map(h => `<option value="${h}:00">${h < 10 ? '0' + h : h}:00</option>`).join('')}
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
      } else if (state.activeSubId === expertSubId) {
        detailContentHtml = `
          <div class="hg-card-green-large" style="background: rgba(var(--theme-color-rgb), 0.03); border: 2px solid var(--theme-color); border-radius: 16px; padding: 40px; margin-bottom: 40px; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 30px;">
              <div>
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                  <span style="background: var(--theme-color); color: white; padding: 6px 12px; border-radius: 6px; font-weight: 700; font-size: 16px;">02</span>
                  <h3 style="margin: 0; font-size: 24px; font-weight: 700; color: #1e293b;">전문가 상담을 통해 안내받으세요</h3>
                </div>
                <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 30px;">
                  건강 상태와 증상에 따라 간호사가 적절한 병원과 전문의료진을 안내해드립니다.
                </p>
              </div>
              <div class="agent-illustration" style="flex-shrink: 0;">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="45" fill="rgba(var(--theme-color-rgb), 0.1)"/>
                  <circle cx="50" cy="40" r="15" fill="#fbcfe8" />
                  <path d="M35 40c0-8 6-15 15-15s15 7 15 15c0 2-2 4-4 4s-3-2-3-4a8 8 0 00-16 0c0 2-1 4-3 4s-4-2-4-4z" fill="#1e293b"/>
                  <path d="M25 80c0-15 10-22 25-22s25 7 25 22H25z" fill="var(--theme-color)" />
                  <path d="M33 40c0-10 8-17 17-17s17 7 17 17" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>
                  <rect x="30" y="36" width="6" height="10" rx="3" fill="#1e293b" />
                  <rect x="64" y="36" width="6" height="10" rx="3" fill="#1e293b" />
                  <path d="M33 44c0 4 3 6 7 6" stroke="#64748b" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
            </div>

            <!-- Step flow matching the image -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 40px 0; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
               <div style="text-align: center; flex: 1;">
                 <div style="width: 56px; height: 56px; margin: 0 auto 12px; background: rgba(var(--theme-color-rgb), 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--theme-color);">
                   <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                 </div>
                 <div style="font-weight: 600; color: #334155; font-size: 14px;">전화상담 신청</div>
               </div>
               <div style="color: #cbd5e1; font-size: 18px; font-weight: bold;">▶</div>
               <div style="text-align: center; flex: 1;">
                 <div style="width: 56px; height: 56px; margin: 0 auto 12px; background: rgba(var(--theme-color-rgb), 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--theme-color);">
                   <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                 </div>
                 <div style="font-weight: 600; color: #334155; font-size: 14px;">간호사 상담</div>
               </div>
               <div style="color: #cbd5e1; font-size: 18px; font-weight: bold;">▶</div>
               <div style="text-align: center; flex: 1;">
                 <div style="width: 56px; height: 56px; margin: 0 auto 12px; background: rgba(var(--theme-color-rgb), 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--theme-color);">
                   <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                 </div>
                 <div style="font-weight: 600; color: #334155; font-size: 14px;">증상 및 상태 확인</div>
               </div>
               <div style="color: #cbd5e1; font-size: 18px; font-weight: bold;">▶</div>
               <div style="text-align: center; flex: 1;">
                 <div style="width: 56px; height: 56px; margin: 0 auto 12px; background: rgba(var(--theme-color-rgb), 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--theme-color);">
                   <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                 </div>
                 <div style="font-weight: 600; color: #334155; font-size: 14px;">병원 및 의료진 안내</div>
               </div>
            </div>

            <button class="auth-btn btn-primary" style="width: 100%; padding: 20px; font-size: 20px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 12px; border-radius: 12px; background: var(--theme-color); color: white; border: none; cursor: pointer;" onclick="toggleExpertConsultingForm()">
              상담 신청하기 &gt;
            </button>
          </div>

          <!-- Phone Consultation Request Form Area -->
          <div id="expert-consulting-form-area" style="display:none; margin-top:40px; padding:40px; background:#f8fafc; border-radius:16px; border:1.5px solid #e2e8f0; animation: fadeIn 0.4s ease;">
            <h3 style="margin-bottom:24px; font-size:20px; color:#1e293b;">명의안내 전문가 상담 신청</h3>
            
            <input type="radio" name="consult-type" value="phone" checked style="display:none;">

            <div class="consulting-guide-box" style="margin-bottom:24px; padding:20px; background:#fff; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; line-height:1.6; color:#475569;">
              <i style="display:block; margin-bottom:6px; font-style:normal;">• 상담 가능 시간은 평일 오전 9시 ~ 오후 6시입니다.</i>
              <i style="display:block; margin-bottom:6px; font-style:normal;">• 상담을 원하시는 날짜 and 시간대를 선택하시고, 상담받고 싶은 내용을 간단히 작성해 주세요.</i>
              <i style="display:block; font-style:normal;">• 남겨주신 내용을 확인한 후 전문 간호사가 직접 전화드리겠습니다.</i>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:24px;">
              <div class="form-group">
                <label class="form-label" style="display:block; margin-bottom:8px; font-weight:600; color:#334155;">상담 희망 일자</label>
                <input type="date" id="consult-date" class="form-input" min="${new Date().toISOString().split('T')[0]}" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px; font-size:15px;">
              </div>
              <div class="form-group">
                <label class="form-label" style="display:block; margin-bottom:8px; font-weight:600; color:#334155;">상담 희망 시간</label>
                <select id="consult-time" class="form-input" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px; background:white; font-size:15px;">
                  <option value="anytime">전일 (언제든 통화 가능)</option>
                  ${Array.from({ length: 9 }, (_, i) => 9 + i).map(h => `<option value="${h}:00">${h < 10 ? '0' + h : h}:00</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="form-group" style="margin-bottom:28px;">
              <label class="form-label" style="display:block; margin-bottom:8px; font-weight:600; color:#334155;">상담 및 문의 내용</label>
              <textarea id="consult-memo" class="form-input" placeholder="원하시는 병원이나 겪고 계신 증상 등을 적어주세요." style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px; min-height:120px; resize:vertical; font-size:15px;"></textarea>
            </div>

            <button class="auth-btn btn-primary" style="width:100%; padding:16px; font-size:16px; font-weight:700;" onclick="submitConsulting()">신청 완료</button>
          </div>

          <div class="hg-footer-note" style="margin-top:24px;">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4M12 16h.01"></path></svg>
            <div>본 서비스는 의료행위가 아닌 의료정보 안내 및 진료 연계 지원 서비스입니다.<br/>최종 진단 및 치료 여부는 의료진의 판단에 따라 결정됩니다.</div>
          </div>
        `;
      } else if (state.activeSubId === searchSubId) {
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
      }

    } else if (isMedicalApptGroup) {
      if (!state.activeSubId) {
        detailContentHtml = `
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
                <input type="date" id="consult-date" class="form-input" min="${new Date().toISOString().split('T')[0]}" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px;">
              </div>
              <div class="form-group">
                <label class="form-label" style="display:block; margin-bottom:8px; font-weight:600;">상담 희망 시간</label>
                <select id="consult-time" class="form-input" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px; background:white;">
                  <option value="anytime">전일 (언제든 통화 가능)</option>
                  ${Array.from({ length: 9 }, (_, i) => 9 + i).map(h => `<option value="${h}:00">${h < 10 ? '0' + h : h}:00</option>`).join('')}
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
    } else if (isCheckupGroup) {
      if (!state.activeSubId) {
        detailContentHtml = `
          <div class="checkup-wrapper fade-in" style="animation: fadeIn 0.4s ease;">
          <!-- Hero Banner -->
          <div style="background: radial-gradient(circle at 100% 0%, rgba(var(--theme-color-rgb), 0.08) 0%, rgba(255,255,255,0) 70%), linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%); border-radius: 20px; padding: 48px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; gap: 40px; margin-bottom: 40px; position: relative; overflow: hidden; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.03);">
            <!-- Left Content -->
            <div style="flex: 1; z-index: 2;">
              <h2 style="font-size: 32px; font-weight: 850; color: #0f172a; line-height: 1.35; letter-spacing: -1px; margin-bottom: 24px; margin-top: 0;">
                건강검진, <br/>
                <span style="color: var(--theme-color);">나에게 맞게 직접 선택</span>하거나 <br/>
                <span style="color: var(--secondary-color);">전문가와 함께 설계</span>하세요
              </h2>
              
              <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 8px;">
                <div style="display: flex; gap: 16px; align-items: flex-start;">
                  <div style="width: 4px; height: 50px; background: var(--theme-color); border-radius: 4px; flex-shrink: 0; margin-top: 4px;"></div>
                  <p style="font-size: 15px; color: #475569; line-height: 1.65; margin: 0;">
                    고객의 건강 상태와 필요에 따라 <br/>
                    <span style="color: #0f172a; font-weight: 600;">직접 검진을 선택</span>할 수도, <span style="color: #0f172a; font-weight: 600;">전문 상담 간호사의 도움</span>을 받아 <br/>
                    <span style="color: var(--secondary-color); font-weight: 700;">맞춤형 검진을 설계</span>할 수도 있는 건강검진 서비스를 제공합니다.
                  </p>
                </div>
                <div style="display: flex; gap: 16px; align-items: flex-start;">
                  <div style="width: 4px; height: 50px; background: var(--secondary-color); border-radius: 4px; flex-shrink: 0; margin-top: 4px;"></div>
                  <p style="font-size: 15px; color: #475569; line-height: 1.65; margin: 0;">
                    연령, 성별, 가족력, 생활습관 등을 고려한 전문 상담부터 <br/>
                    원하는 병원과 검진 패키지를 직접 비교하고 <br/>
                    예약하는 <span style="color: var(--theme-color); font-weight: 700;">간편한 신청</span>까지.
                  </p>
                </div>
              </div>
              
              <p style="font-size: 17px; font-weight: 700; color: #1e293b; margin-top: 24px; border-bottom: 2px solid rgba(var(--theme-color-rgb), 0.1); padding-bottom: 12px; display: inline-block; margin-bottom: 0;">
                고객의 방식에 맞는 건강검진 경험을 제공합니다.
              </p>
            </div>
            
            <!-- Right Vector Graphic -->
            <div style="flex-shrink: 0; z-index: 2; position: relative;">
              <div style="width: 320px; height: 260px; background: white; border-radius: 20px; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; overflow: hidden; background-image: radial-gradient(circle at 50% 50%, #f8fafc, #f1f5f9);">
                <div style="position: absolute; top: 16px; right: 20px; font-size: 12px; font-weight: bold; color: #2F4A9A; display: flex; flex-direction: column; align-items: flex-end; opacity: 0.85;">
                  <span>교보생명 KYOBO</span>
                  <span style="font-size: 10px; font-weight: 600; color: #17B890; margin-top:-2px;">헬스케어</span>
                </div>
                
                <svg width="220" height="220" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="45" fill="rgba(47, 74, 154, 0.05)" />
                  <circle cx="50" cy="50" r="35" fill="rgba(23, 184, 144, 0.05)" />
                  <circle cx="38" cy="42" r="12" fill="#fed7aa" />
                  <path d="M28 42c0-5 4-9 10-9s10 4 10 9" fill="#1e293b" />
                  <rect x="34" y="38" width="8" height="4" fill="#1e293b" />
                  <path d="M18 75c0-12 8-18 20-18s20 6 20 18H18z" fill="#2F4A9A" />
                  <path d="M38 52c-4 0-7 3-7 7s3 7 7 7 7-3 7-7-3-7-7-7z" fill="white" />
                  <circle cx="38" cy="59" r="4" fill="#17B890" />
                  
                  <circle cx="68" cy="48" r="10" fill="#fbcfe8" />
                  <path d="M58 48c0-4 4-8 10-8s10 4 10 8" fill="#475569" />
                  <path d="M52 80c0-10 6-15 16-15s16 5 16 15H52z" fill="#e2e8f0" />
                  
                  <rect x="42" y="50" width="22" height="15" rx="2" fill="white" stroke="#64748b" stroke-width="1.5" transform="rotate(-10 53 57.5)"/>
                  <line x1="46" y1="54" x2="60" y2="51" stroke="#3b82f6" stroke-width="1" transform="rotate(-10 53 57.5)"/>
                  <line x1="46" y1="57" x2="56" y2="55" stroke="#cbd5e1" stroke-width="1" transform="rotate(-10 53 57.5)"/>
                  <line x1="46" y1="60" x2="52" y2="59" stroke="#cbd5e1" stroke-width="1" transform="rotate(-10 53 57.5)"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Two Columns / Path Selector -->
          <div style="display: flex; align-items: stretch; justify-content: space-between; gap: 24px; margin-bottom: 40px; position: relative;">
            
            <!-- Path 1 Card: 전문가 맞춤 설계 -->
            <div style="flex: 1; background: white; border: 1px solid #cbd5e1; border-radius: 16px; padding: 36px; display: flex; flex-direction: column; align-items: center; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.02); transition: all 0.3s ease; position: relative; overflow: hidden; cursor:pointer;" onclick="toggleCheckupDesignForm()">
              <div style="position: absolute; top: 0; left: 0; right: 0; height: 8px; background: var(--secondary-color);"></div>
              
              <!-- Icon Container -->
              <div style="width: 80px; height: 80px; border-radius: 50%; background: rgba(23, 184, 144, 0.1); border: 2px solid rgba(23, 184, 144, 0.2); color: var(--secondary-color); display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4"></circle>
                  <path d="M18 21a6 6 0 00-12 0"></path>
                  <path d="M12 2v2M9 3.5l1 1M15 3.5l-1 1" stroke-linecap="round"></path>
                </svg>
              </div>
              
              <h3 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 12px; margin-top: 0;">전문가와 함께 맞춤 설계</h3>
              <p style="font-size: 14.5px; color: #64748b; line-height: 1.6; flex-grow: 1; max-width: 320px; margin-bottom: 0; margin-top: 0;">
                전문 상담 간호사가 연령, 성별, 가족력, 생활습관 등을 분석하여 나에게 꼭 맞는 검진을 설계해드립니다.
              </p>
            </div>

            <!-- Path 2 Card: 직접 선택하고 간편 예약 -->
            <div style="flex: 1; background: white; border: 1px solid #cbd5e1; border-radius: 16px; padding: 36px; display: flex; flex-direction: column; align-items: center; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.02); transition: all 0.3s ease; position: relative; overflow: hidden; cursor:pointer;" onclick="toggleCheckupDirectForm()">
              <div style="position: absolute; top: 0; left: 0; right: 0; height: 8px; background: var(--theme-color);"></div>
              
              <!-- Icon Container -->
              <div style="width: 80px; height: 80px; border-radius: 50%; background: rgba(47, 74, 154, 0.1); border: 2px solid rgba(47, 74, 154, 0.2); color: var(--theme-color); display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                  <rect x="2" y="3" width="20" height="14" rx="2" stroke-linecap="round"></rect>
                  <path d="M8 21h8M12 17v4" stroke-linecap="round"></path>
                  <path d="M9 10l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </div>
              
              <h3 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 12px; margin-top: 0;">직접 선택하고 간편하게 예약</h3>
              <p style="font-size: 14.5px; color: #64748b; line-height: 1.6; flex-grow: 1; max-width: 320px; margin-bottom: 0; margin-top: 0;">
                원하는 병원과 검진 패키지를 비교하고 내게 필요한 검사를 직접 선택하여 간편하게 예약할 수 있습니다.
              </p>
            </div>

          </div>

          <!-- Form Area 1: 전문가 설계 -->
          <div id="checkup-design-form-area" style="display:none; margin-bottom: 48px; padding: 40px; background: #f8fafc; border: 2px solid var(--secondary-color); border-radius: 16px; animation: fadeIn 0.4s ease;">
            <h3 style="margin-bottom: 8px; font-size: 22px; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 8px; margin-top: 0;">
              👩‍⚕️ 전문가 맞춤 설계 신청 (자가 진단)
            </h3>
            <p style="color: #64748b; font-size: 14px; margin-bottom: 28px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 12px; margin-top: 0;">
              평소 염려되시는 부위나 건강검진 관련 목적을 기반으로 전문 간호사의 개별 상담 전화 프로세스가 연계됩니다.
            </p>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div class="form-group">
                <label style="display:block; margin-bottom:8px; font-weight:700; color:#334155; font-size:14px;">상담 고객 성함</label>
                <input type="text" id="checkup-name" class="form-input" value="${state.currentUser.name}" readonly style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px; background:#f1f5f9; font-size:15px;">
              </div>
              <div class="form-group">
                <label style="display:block; margin-bottom:8px; font-weight:700; color:#334155; font-size:14px;">연락처 (핸드폰)</label>
                <input type="tel" id="checkup-phone" class="form-input" placeholder="상담을 수신할 연락처를 입력해 주세요." style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px; font-size:15px;">
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div class="form-group">
                <label style="display:block; margin-bottom:8px; font-weight:700; color:#334155; font-size:14px;">상담 희망 일자</label>
                <input type="date" id="checkup-date" class="form-input" min="${new Date().toISOString().split('T')[0]}" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px; font-size:15px;">
              </div>
              <div class="form-group">
                <label style="display:block; margin-bottom:8px; font-weight:700; color:#334155; font-size:14px;">상담 희망 시간대</label>
                <select id="checkup-time" class="form-input" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px; background:white; font-size:15px;">
                  <option value="anytime">전일 언제나 가능</option>
                  <option value="morning">오전 시간대 (09:00 ~ 12:00)</option>
                  <option value="afternoon">오후 시간대 (13:00 ~ 18:00)</option>
                </select>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 28px;">
              <label style="display:block; margin-bottom:8px; font-weight:700; color:#334155; font-size:14px;">염려되시는 건강 우려사항 / 가족력 / 이전 질환 등</label>
              <textarea id="checkup-memo" class="form-input" placeholder="예) 최근 혈압이 높아져 심혈관 정밀검사가 필요합니다 / 암 가족력이 있습니다" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px; min-height:100px; resize:vertical; font-size:15px;"></textarea>
            </div>

            <button onclick="submitCheckupDesign()" class="auth-btn btn-primary" style="background: var(--secondary-color); color: white; border: none; font-weight: 700; padding: 16px; border-radius: 8px; width: 100%; cursor: pointer;">
              전문가 설계 신청 완료
            </button>
          </div>

          <!-- Form Area 2: 직접 선택하고 간편 예약 -->
          <div id="checkup-direct-form-area" style="display:none; margin-bottom: 48px; padding: 40px; background: #f8fafc; border: 2px solid var(--theme-color); border-radius: 16px; animation: fadeIn 0.4s ease;">
            <h3 style="margin-bottom: 8px; font-size: 22px; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 8px; margin-top: 0;">
              🏥 직접 선택하고 간편하게 예약
            </h3>
            <p style="color: #64748b; font-size: 14px; margin-bottom: 28px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 12px; margin-top: 0;">
              전국의 제휴 검진센터 및 패키지 가격을 직접 비교하고 검진 패키지를 간편하게 직접 예약합니다.
            </p>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div class="form-group">
                <label style="display:block; margin-bottom:8px; font-weight:700; color:#334155; font-size:14px;">예약 검진 센터</label>
                <select id="direct-checkup-center" class="form-input" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px; background:white; font-size:15px;">
                  <option value="center1">서울종합검진센터 (강남점)</option>
                  <option value="center2">중앙웰니스검진센터 (강북점)</option>
                  <option value="center3">교보 프리미엄 제휴 메디컬 센터</option>
                </select>
              </div>
              <div class="form-group">
                <label style="display:block; margin-bottom:8px; font-weight:700; color:#334155; font-size:14px;">검진 패키지 선택</label>
                <select id="direct-checkup-package" class="form-input" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px; background:white; font-size:15px;">
                  <option value="basic">기본형 웰니스 검진 패키지 (연령별 필수)</option>
                  <option value="premium">실버/골드 프리미엄 정밀 검진 패키지 (소화기/심혈관 특화)</option>
                  <option value="expert">VIP 명의형 웰니스 정밀 종합검진 (DNA 유전자 분석 포함)</option>
                </select>
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div class="form-group">
                <label style="display:block; margin-bottom:8px; font-weight:700; color:#334155; font-size:14px;">검진 희망 일자</label>
                <input type="date" id="direct-checkup-date" class="form-input" min="${new Date().toISOString().split('T')[0]}" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px; font-size:15px;">
              </div>
              <div class="form-group">
                <label style="display:block; margin-bottom:8px; font-weight:700; color:#334155; font-size:14px;">추가 요청사항 (선택)</label>
                <input type="text" id="direct-checkup-extra" class="form-input" placeholder="예) 위/대장 수면 내시경 추가" style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:6px; font-size:15px;">
              </div>
            </div>

            <button onclick="submitCheckupDirect()" class="auth-btn btn-primary" style="background: var(--theme-color); color: white; border: none; font-weight: 700; padding: 16px; border-radius: 8px; width: 100%; cursor: pointer;">
              검진 예약 직접 신청 완료
            </button>
          </div>

          <!-- Key Benefits Bottom Row (The 4 columns matching the image) -->
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
              
              <!-- Benefit 1 -->
              <div style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 12px; border-right: 1px solid #f1f5f9;">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: #eff6ff; color: #2F4A9A; display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke-linecap="round"></path>
                  </svg>
                </div>
                <h4 style="font-size: 14px; font-weight: 800; color: #1e293b; margin-bottom: 4px; margin-top: 0;">개인 맞춤 건강 상담</h4>
                <span style="font-size: 12px; color: #64748b;">성별/연령 분석 케어</span>
              </div>

              <!-- Benefit 2 -->
              <div style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 12px; border-right: 1px solid #f1f5f9;">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: #f0fdf4; color: #16a34a; display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </div>
                <h4 style="font-size: 14px; font-weight: 800; color: #1e293b; margin-bottom: 4px; margin-top: 0;">과잉검사 없는 합리적 설계</h4>
                <span style="font-size: 12px; color: #64748b;">투명하고 실속있는 구성</span>
              </div>

              <!-- Benefit 3 -->
              <div style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 12px; border-right: 1px solid #f1f5f9;">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: #fff7ed; color: #ea580c; display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </div>
                <h4 style="font-size: 14px; font-weight: 800; color: #1e293b; margin-bottom: 4px; margin-top: 0;">전국 병원 비교 및 예약</h4>
                <span style="font-size: 12px; color: #64748b;">제휴 네트워크 연계 지원</span>
              </div>

              <!-- Benefit 4 -->
              <div style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 12px;">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: #fdf2f8; color: #db2777; display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
                  <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </div>
                <h4 style="font-size: 14px; font-weight: 800; color: #1e293b; margin-bottom: 4px; margin-top: 0;">간편한 신청 및 관리</h4>
                <span style="font-size: 12px; color: #64748b;">원스톱 예약 케어 매니저</span>
              </div>

            </div>
          </div>

        </div>
      `;
      } else if (state.activeSubId === 'checkupPreferred' || decodeURIComponent(state.activeSubId || '').includes('우대예약') || pageTitle.includes('우대예약')) {
        detailContentHtml = `
          <div class="cp-wrapper fade-in" style="animation: fadeIn 0.4s ease;">
            
            <!-- Hero Banner -->
            <div class="cp-hero" style="background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%); border-radius: 20px; padding: 48px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; position: relative; overflow: hidden; border: 1px solid #e2e8f0;">
              <div style="flex: 1; z-index: 2;">
                <div style="display: inline-flex; align-items: center; gap: 6px; background: white; color: #3b82f6; font-weight: 700; font-size: 14px; padding: 8px 16px; border-radius: 20px; margin-bottom: 16px; border: 1px solid #bfdbfe; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                  <span style="color: #3b82f6;">★</span> 건강검진 우대예약
                </div>
                <div style="font-size: 32px; font-weight: 850; color: #0f172a; line-height: 1.35; letter-spacing: -1px; margin-bottom: 16px; margin-top: 0;">
                  다양한 제휴 병원의<br/>건강검진 프로그램을<br/><span style="color: #2F4A9A;">우대 혜택과 함께 편리하게 이용해보세요.</span>
                </div>
                <div style="font-size: 16px; color: #475569; line-height: 1.6;">
                  검진 비용은 고객이 병원에 직접 결제하며,<br/>예약 및 이용 편의를 제공합니다.
                </div>
              </div>
              <div style="flex-shrink: 0; z-index: 2;">
                <img src="./images/checkup_preferred_hero.png" alt="건강검진 우대예약" style="max-height: 240px; border-radius: 12px;" onerror="this.style.display='none'">
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
              ${[
                { num: 1, name: '포항세명기독병원', pkg: '기본형', price: '350,000', discount: '20%', loc: '강북구' },
                { num: 2, name: '우리허브병원', pkg: '정밀형', price: '300,000', discount: '15%', loc: '송파구' },
                { num: 3, name: '안동병원', pkg: '프리미엄형', price: '300,000', discount: '10%', loc: '종로구' },
                { num: 4, name: '강남베스트병원', pkg: '기본형', price: '280,000', discount: '20%', loc: '강남구' },
                { num: 5, name: '서울프라임검진센터', pkg: 'VIP형', price: '270,000', discount: '18%', loc: '서초구' },
                { num: 6, name: '부산시티병원', pkg: '정밀형', price: '260,000', discount: '15%', loc: '부산진구' },
                { num: 7, name: '대구웰니스병원', pkg: '기본형', price: '250,000', discount: '12%', loc: '수성구' },
                { num: 8, name: '인천메디컬센터', pkg: '프리미엄형', price: '240,000', discount: '10%', loc: '연수구' }
              ].map(h => `
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
                        <span style="font-size: 20px; font-weight: 800; color: #2F4A9A;">${h.price}원</span>
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
              `).join('')}
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
              <button onclick="window.location.hash='#/portal/${state.activeClient.id}/${state.activeSite.siteId}/${state.activeMenuId}/checkup-items';" style="flex: 1; padding: 16px; border-radius: 8px; border: none; background: #2563eb; color: white; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.2s;">다음 단계</button>
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
                <button style="background: none; border: none; cursor: pointer; color: #64748b;"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"></path></svg></button>
                <div style="font-size: 18px; font-weight: 800; color: #0f172a;">2026년 6월</div>
                <button style="background: none; border: none; cursor: pointer; color: #64748b;"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg></button>
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
                    applyDate: new Date().toISOString().split('T')[0],
                    wishDate1: '2026-06-30',
                    wishDate2: '',
                    selectedTests: '-',
                    extraTests: '-',
                    confirmDate: '',
                    targetName: '${state.currentUser ? state.currentUser.name : ''}',
                    targetBirthGender: '19850101 / 남성',
                    targetPhone: '010-0000-0000',
                    targetAddress: '-',
                    status: '신청',
                    reservationConfirmedDate: ''
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
            <span style="font-weight: 500; margin-right:12px;">${state.currentUser.name} 님</span>
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
  } else if (state.activeSubId === 'checkup-summary') {
    setTimeout(function() {
      const dates = window.selectedWishDates || [];
      const el1 = document.getElementById('summary-date-1');
      const el2 = document.getElementById('summary-date-2');
      if (el1) el1.innerText = dates[0] || '미선택';
      if (el2) el2.innerText = dates[1] || '미선택';
    }, 50);
  }
}

window.selectedWishDates = [];
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
  const y = 2026;
  const m = 6;
  const firstDay = new Date(y, m - 1, 1).getDay();
  const daysInMonth = new Date(y, m, 0).getDate();
  
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
    
    let isAvailable = false;
    let statusHtml = '';
    
    if (isSunday) {
      statusHtml = '<div style="color: #ef4444; font-size: 13px; font-weight: 700; margin-top: 6px;">휴일</div>';
    } else if ([2, 9, 10, 16, 17, 18, 23, 24, 29, 30].includes(d)) {
      isAvailable = true;
      statusHtml = '<div style="background: #3b82f6; color: white; display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; margin-top: 6px;">예약가능</div><div style="font-size:11px; color:#64748b; margin-top:4px; line-height: 1.4;">· 대장내시경 마감<br>· 유방초음파 마감</div>';
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

render();
