/**
 * Provided Services Management Module
 * Implements the administrative interface, Target Grade Select Modal, 
 * MS Office-level drag-and-resize canvas editor, dynamic tabs, HTML/CSS toggles,
 * and PC/Mobile Preview Modal.
 */

// Initialize Sample Data in LocalStorage if not exists
(function initSampleData() {
  const saved = localStorage.getItem('hc_provided_services');
  if (saved) return;

  const defaultServices = {
    "kyobo|기본플랜": {
      clientId: "kyobo",
      tierName: "기본플랜",
      exposureYn: "Y",
      lastModified: "2026-05-29 10:24:15",
      writer: "신은준",
      sections: {
        intro: `<div style="position: relative; width: 100%; height: 180px; background: linear-gradient(135deg, #17B890 0%, #0d9488 100%); border-radius: 12px; padding: 24px; color: white; display: flex; flex-direction: column; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
  <h2 style="font-size: 26px; font-weight: 800; margin: 0 0 10px 0; letter-spacing: -1px;">교보생명 건강관리의 시작, 기본플랜 헬스케어</h2>
  <p style="font-size: 15px; margin: 0; opacity: 0.9; line-height: 1.6; font-weight: 500;">
    건강할 때 예방부터 아플 때 전문 치료지원까지 든든하게!<br>
    교보생명 기본플랜 회원만을 위한 핵심 건강 케어를 지금 바로 누려보세요.
  </p>
</div>`,
        csGuide: `<div style="position: relative; width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; background: white; padding: 20px 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-between;">
  <div style="display: flex; align-items: center; gap: 16px;">
    <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(23, 184, 144, 0.1); display: flex; align-items: center; justify-content: center; color: #17B890;">
      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
    </div>
    <div>
      <div style="font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 2px;">교보생명 헬스케어 전용 콜센터</div>
      <div style="font-size: 20px; font-weight: 800; color: #1e293b;">1588-1001</div>
    </div>
  </div>
  <a href="tel:15881001" style="background: #17B890; color: white; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 700; text-decoration: none; transition: background 0.2s;">전화 연결</a>
</div>`,
        tabs: [
          {
            title: "평상시 건강관리",
            html: `<div style="position: relative; width: 100%; min-height: 280px; padding: 20px; background: #fafaf9; border-radius: 12px; border: 1px dashed #cbd5e1;">
  <h4 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px;">🩺 일상의 안심을 위한 다솜 헬스케어</h4>
  <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
    가벼운 증상 상담부터 병원 추천, 예약 대행까지 24시간 간호사 전담 의료상담을 무료로 제공해 드립니다.
  </p>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center;">
      <div style="font-size: 24px; margin-bottom: 8px;">👩‍⚕️</div>
      <div style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 4px;">24시 의료진 상담</div>
      <div style="font-size: 12px; color: #64748b;">주말/공휴일 항시 대기</div>
    </div>
    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center;">
      <div style="font-size: 24px; margin-bottom: 8px;">🏥</div>
      <div style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 4px;">진료예약 및 명의안내</div>
      <div style="font-size: 12px; color: #64748b;">전국 대형 종합병원 연동</div>
    </div>
    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center;">
      <div style="font-size: 24px; margin-bottom: 8px;">🚗</div>
      <div style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 4px;">병원 이송 차량지원</div>
      <div style="font-size: 12px; color: #64748b;">서울/수도권 구급차 연 1회</div>
    </div>
  </div>
</div>`
          },
          {
            title: "검진 우대예약",
            html: `<div style="position: relative; width: 100%; min-height: 250px; padding: 20px; background: white; border: 1px solid #e2e8f0; border-radius: 12px;">
  <h4 style="font-size: 18px; font-weight: 800; color: #0284c7; margin-top: 0; margin-bottom: 12px;">✨ 전국 제휴 건강검진 네트워크 우대 혜택</h4>
  <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
    전국 100여 개 우수 검진 센터와의 제휴를 통하여 일반 소비자가 대비 최대 30~50% 우대된 맞춤 패키지 요금을 제공합니다.
  </p>
  <div style="border-left: 4px solid #0284c7; padding-left: 16px; margin-bottom: 20px;">
    <div style="font-weight: 700; font-size: 15px; color: #0f172a; margin-bottom: 4px;">기본플랜 특별 혜택</div>
    <div style="font-size: 13px; color: #64748b;">위내시경 수면비 지원 / 기본 종합검진 20% 자동 우대할인</div>
  </div>
</div>`
          }
        ]
      }
    },
    "kyobo|VIP플랜": {
      clientId: "kyobo",
      tierName: "VIP플랜",
      exposureYn: "Y",
      lastModified: "2026-05-29 11:45:00",
      writer: "신은준",
      sections: {
        intro: `<div style="position: relative; width: 100%; height: 200px; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); border-radius: 12px; padding: 32px; color: white; display: flex; flex-direction: column; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
  <span style="align-self: flex-start; background: #e0f2fe; color: #0369a1; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 100px; margin-bottom: 12px;">PREMIUM VIP SERVICE</span>
  <h2 style="font-size: 28px; font-weight: 800; margin: 0 0 8px 0; letter-spacing: -1px;">교보생명 VIP 전용 헬스케어 포털</h2>
  <p style="font-size: 15px; margin: 0; opacity: 0.9; line-height: 1.6; font-weight: 500;">
    최고의 자산인 건강을 위해, 검증된 고품격 맞춤 의학 자문 및 원스톱 VIP 에스코트 서비스를 지원합니다.
  </p>
</div>`,
        csGuide: `<div style="position: relative; width: 100%; border: 1px solid #bfdbfe; border-radius: 12px; background: #eff6ff; padding: 20px 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-between;">
  <div style="display: flex; align-items: center; gap: 16px;">
    <div style="width: 48px; height: 48px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; color: #1e3a8a; border: 1px solid #bfdbfe;">
      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
    </div>
    <div>
      <div style="font-size: 12px; font-weight: 700; color: #2563eb; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px;">VIP 전용 직통 프리미엄 라인</div>
      <div style="font-size: 22px; font-weight: 900; color: #1e3a8a;">1588-9999</div>
    </div>
  </div>
  <a href="tel:15889999" style="background: #1e3a8a; color: white; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 800; text-decoration: none; transition: background 0.2s;">전담 간호사 연결</a>
</div>`,
        tabs: [
          {
            title: "VIP 의료 케어",
            html: `<div style="position: relative; width: 100%; min-height: 300px; padding: 24px; background: white; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
  <h4 style="font-size: 18px; font-weight: 800; color: #1e3a8a; margin-top: 0; margin-bottom: 16px;">👑 VIP 회원 특별 에스코트 케어</h4>
  <ul style="padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8; font-weight: 500;">
    <li style="margin-bottom: 8px;"><strong style="color:#0f172a;">차별화된 명의 진료 매칭</strong>: 국내 5대 대형병원 전임 자문위원 및 국내 분야별 주치의급 전문의 우선 매칭</li>
    <li style="margin-bottom: 8px;"><strong style="color:#0f172a;">종합병원 에스코트 서비스</strong>: 대형 병원 진료 당일, 전문 간호사가 동행하여 접수부터 수납, 약 처방까지 밀착 안내(연 3회)</li>
    <li style="margin-bottom: 8px;"><strong style="color:#0f172a;">해외 2차 소견 서비스</strong>: 국내외 희귀/난치 질환 판정 시 글로벌 우수 의료기관의 추가 정밀 진단 판독 및 치료 자문 리포트 무료 발급</li>
  </ul>
</div>`
          },
          {
            title: "검진 특화 지원",
            html: `<div style="position: relative; width: 100%; min-height: 250px; padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
  <h4 style="font-size: 18px; font-weight: 800; color: #1e3a8a; margin-top: 0; margin-bottom: 12px;">🌟 고품격 프리미엄 건강진단 혜택</h4>
  <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
    최첨단 정밀 검진 장비를 갖춘 국내 최정상급 대학병원 및 종합 검진 전문기관에서 차별화된 VIP 전용 코스를 적용받습니다.
  </p>
  <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
    <div style="font-weight: 700; font-size: 14px; color: #0f172a; margin-bottom: 6px;">VIP 특전 사항</div>
    <div style="font-size: 13px; color: #64748b; line-height: 1.5;">
      • PET-CT, 뇌MRI 등 정밀 영상 검사 패키지 우대 지원<br>
      • 동행 전문 가이드 및 대기 시간 없는 1:1 VIP 패스트트랙 진행
    </div>
  </div>
</div>`
          }
        ]
      }
    }
  };

  localStorage.setItem('hc_provided_services', JSON.stringify(defaultServices));
})();

// Helper function to get current provided services data
function getProvidedServicesData() {
  return JSON.parse(localStorage.getItem('hc_provided_services') || '{}');
}

// Helper to save provided services data
function saveProvidedServicesData(data) {
  localStorage.setItem('hc_provided_services', JSON.stringify(data));
}

// -------------------------------------------------------------
// MAIN ENTRY: Render list view of registered services
// -------------------------------------------------------------
window.renderProvidedServices = function(container) {
  const data = getProvidedServicesData();
  const listItems = [];

  // Group client options from adminClientConfigs to show beautiful names
  const clientMap = {};
  if (typeof adminClientConfigs !== 'undefined') {
    Object.values(adminClientConfigs).forEach(c => {
      clientMap[c.id] = c.name.split('(')[0].trim();
    });
  } else {
    clientMap['kyobo'] = '교보생명';
    clientMap['dasom'] = '교보다솜케어';
    clientMap['other'] = 'A기업';
  }

  // Populate listItems
  Object.keys(data).forEach(key => {
    const item = data[key];
    listItems.push({
      key: key,
      clientId: item.clientId,
      clientName: clientMap[item.clientId] || item.clientId,
      tierName: item.tierName,
      exposureYn: item.exposureYn || 'Y',
      lastModified: item.lastModified || '2026-05-29 12:00:00',
      writer: item.writer || '관리자'
    });
  });

  // Render Table rows
  let rowsHtml = '';
  if (listItems.length === 0) {
    rowsHtml = `<tr><td colspan="6" style="text-align:center; padding:40px; color:#64748b;">등록된 제공서비스 정보가 없습니다. 신규등록을 진행해주세요.</td></tr>`;
  } else {
    listItems.forEach((item, index) => {
      const isExposed = item.exposureYn === 'Y';
      rowsHtml += `
        <tr onclick="window.editProvidedService('${item.key}')" style="cursor:pointer; transition: background 0.2s;" onmouseover="this.style.backgroundColor='#f8fafc'" onmouseout="this.style.backgroundColor='transparent'">
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:13px; text-align:center; color:#64748b;">${index + 1}</td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:700; color:#1e293b;">${item.clientName}</td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:600; color:#2563eb;">${item.tierName}</td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:13px; text-align:center;">
            <span style="display:inline-block; padding:4px 10px; border-radius:100px; font-size:12px; font-weight:700; background:${isExposed ? '#dcfce7':'#fee2e2'}; color:${isExposed ? '#166534':'#991b1b'};">
              ${isExposed ? '노출' : '미노출'}
            </span>
          </td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:13px; text-align:center; color:#64748b;">${item.lastModified}</td>
          <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:13px; text-align:center; font-weight:500; color:#334155;">${item.writer}</td>
        </tr>
      `;
    });
  }

  container.innerHTML = `
    <div class="page-header" style="margin-bottom:24px;">
      <div>
        <h1 class="page-title">제공서비스 관리</h1>
        <p class="page-subtitle">고객사 등급별 제공서비스 안내 화면에 노출될 소개글, 고객센터, 탭별 주요내용을 맞춤 설계하고 관리합니다.</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" onclick="window.openSearchGradeModal()" style="display:flex; gap:6px; align-items:center;">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
          신규 등록
        </button>
      </div>
    </div>

    <!-- Search/Filter Area -->
    <div class="config-card" style="padding: 16px 24px; margin-bottom: 24px;">
      <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
        <span style="font-size:14px; font-weight:700; color:#334155;">서비스 등급</span>
        <select id="search-filter-type" class="form-input" style="width: 160px; padding:8px 12px;">
          <option value="group">서비스등급그룹</option>
          <option value="client">제휴사명</option>
        </select>
        <div style="position:relative; flex:1; min-width:280px; display:flex;">
          <input type="text" id="search-filter-keyword" class="form-input" placeholder="검색어를 입력하세요." style="padding:8px 16px; border-radius:6px 0 0 6px;" onkeyup="if(event.key==='Enter') window.filterProvidedServicesList()">
          <button onclick="window.filterProvidedServicesList()" style="background:#2563eb; color:white; border:none; padding:0 20px; border-radius:0 6px 6px 0; cursor:pointer; display:flex; align-items:center; justify-content:center;">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </button>
        </div>
      </div>
    </div>

    <div class="config-card">
      <div class="card-header" style="background:#fff; border-bottom:1px solid #e2e8f0; padding:16px 24px;">
        <h2 class="card-title" style="font-size:15px; font-weight:700;">등록된 제공서비스 리스트 (총 ${listItems.length}건)</h2>
      </div>
      <div class="card-body" style="padding:0; overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; text-align:left;">
          <thead style="background:#f8fafc; border-bottom:1px solid #e2e8f0;">
            <tr>
              <th style="width:60px; padding:16px; font-size:13px; font-weight:700; color:#475569; text-align:center;">No</th>
              <th style="padding:16px; font-size:13px; font-weight:700; color:#475569;">제휴사명</th>
              <th style="padding:16px; font-size:13px; font-weight:700; color:#475569;">서비스 등급명</th>
              <th style="width:120px; padding:16px; font-size:13px; font-weight:700; color:#475569; text-align:center;">노출 여부</th>
              <th style="width:200px; padding:16px; font-size:13px; font-weight:700; color:#475569; text-align:center;">최종수정일시</th>
              <th style="width:150px; padding:16px; font-size:13px; font-weight:700; color:#475569; text-align:center;">작성자</th>
            </tr>
          </thead>
          <tbody id="provided-services-tbody">
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

// Filter search table
window.filterProvidedServicesList = function() {
  const type = document.getElementById('search-filter-type').value;
  const keyword = document.getElementById('search-filter-keyword').value.toLowerCase().trim();
  const tbody = document.getElementById('provided-services-tbody');
  if (!tbody) return;

  const data = getProvidedServicesData();
  const clientMap = {};
  if (typeof adminClientConfigs !== 'undefined') {
    Object.values(adminClientConfigs).forEach(c => clientMap[c.id] = c.name.split('(')[0].trim());
  } else {
    clientMap['kyobo'] = '교보생명';
    clientMap['dasom'] = '교보다솜케어';
    clientMap['other'] = 'A기업';
  }

  const filtered = [];
  Object.keys(data).forEach(key => {
    const item = data[key];
    const clientName = clientMap[item.clientId] || item.clientId;
    const matchesClient = clientName.toLowerCase().includes(keyword);
    const matchesTier = item.tierName.toLowerCase().includes(keyword);

    if (!keyword || (type === 'group' && matchesTier) || (type === 'client' && matchesClient)) {
      filtered.push({ key, item, clientName });
    }
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:40px; color:#64748b;">검색 조건에 맞는 정보가 없습니다.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((f, index) => {
    const isExposed = f.item.exposureYn === 'Y';
    return `
      <tr onclick="window.editProvidedService('${f.key}')" style="cursor:pointer; transition: background 0.2s;" onmouseover="this.style.backgroundColor='#f8fafc'" onmouseout="this.style.backgroundColor='transparent'">
        <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:13px; text-align:center; color:#64748b;">${index + 1}</td>
        <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:700; color:#1e293b;">${f.clientName}</td>
        <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:600; color:#2563eb;">${f.item.tierName}</td>
        <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:13px; text-align:center;">
          <span style="display:inline-block; padding:4px 10px; border-radius:100px; font-size:12px; font-weight:700; background:${isExposed ? '#dcfce7':'#fee2e2'}; color:${isExposed ? '#166534':'#991b1b'};">
            ${isExposed ? '노출' : '미노출'}
          </span>
        </td>
        <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:13px; text-align:center; color:#64748b;">${f.item.lastModified || '2026-05-29 12:00:00'}</td>
        <td style="padding:16px; border-bottom:1px solid #e2e8f0; font-size:13px; text-align:center; font-weight:500; color:#334155;">${f.item.writer || '관리자'}</td>
      </tr>
    `;
  }).join('');
};

// -------------------------------------------------------------
// SELECT MODAL: Search & Select Target Grade to Register
// -------------------------------------------------------------
window.openSearchGradeModal = function() {
  const modalId = 'grade-search-modal';
  if (document.getElementById(modalId)) return;

  // Extract all available tiers dynamically from adminClientConfigs or fallback defaults
  const availableGrades = [];
  const clientMap = {};
  
  if (typeof adminClientConfigs !== 'undefined') {
    Object.values(adminClientConfigs).forEach(client => {
      const clientName = client.name.split('(')[0].trim();
      clientMap[client.id] = clientName;
      if (client.tiers) {
        client.tiers.forEach(tier => {
          availableGrades.push({
            clientId: client.id,
            clientName: clientName,
            tierName: tier
          });
        });
      }
    });
  } else {
    // Hardcoded Fallbacks if adminClientConfigs is missing
    availableGrades.push(
      { clientId: "kyobo", clientName: "교보생명", tierName: "기본플랜" },
      { clientId: "kyobo", clientName: "교보생명", tierName: "VIP플랜" },
      { clientId: "dasom", clientName: "교보다솜케어", tierName: "통합등급" },
      { clientId: "dasom", clientName: "교보다솜케어", tierName: "우대등급" },
      { clientId: "other", clientName: "A기업", tierName: "임직원 1등급" },
      { clientId: "other", clientName: "A기업", tierName: "임원급" }
    );
  }

  // Include some other simulated clients to enrich search results matching the dropdown dropdown in the mockup
  const extraMockGrades = [
    { clientId: "bnk", clientName: "BNK자산운용", tierName: "교보New헬스케어서비스 임특화형" },
    { clientId: "kyobo_special", clientName: "교보New헬스케어", tierName: "교보New헬스케어서비스 건강특화형" },
    { clientId: "kyobo_cardio", clientName: "교보New헬스케어", tierName: "교보New헬스케어서비스 뇌-심장특화형" },
    { clientId: "umobile", clientName: "U+유모바일", tierName: "교보New헬스케어서비스 치매-간병특화형" },
    { clientId: "remember", clientName: "리멤버앤컴퍼니", tierName: "교보New헬스케어서비스 프레스티지" },
    { clientId: "bright", clientName: "브라이트스타트", tierName: "교보New헬스케어서비스 프리미어" },
    { clientId: "yulchon", clientName: "법무법인 율촌", tierName: "교보건강코칭" },
    { clientId: "kpartners", clientName: "케이파트너스", tierName: "교보단체에듀케어서비스" },
    { clientId: "today_acct", clientName: "오늘 회계법인", tierName: "교보미니헬스케어서비스" },
    { clientId: "kyobobook", clientName: "교보문고", tierName: "교보미니헬스케어서비스2" }
  ];

  // Merge lists securely ensuring no duplicates on (clientId + tierName)
  extraMockGrades.forEach(extra => {
    if (!availableGrades.some(g => g.clientId === extra.clientId && g.tierName === extra.tierName)) {
      availableGrades.push(extra);
    }
  });

  const modal = document.createElement("div");
  modal.id = modalId;
  modal.style = "position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px);";
  
  modal.innerHTML = `
    <div class="config-card" style="background:white; width:650px; border-radius:12px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);">
      <div class="card-header" style="padding:16px 24px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
        <h2 style="font-size:16px; font-weight:700; margin:0;">신규 제공서비스 대상 등급 선택</h2>
        <button style="background:none; border:none; font-size:24px; cursor:pointer; color:#64748b; line-height:1;" onclick="window.closeSearchGradeModal()">&times;</button>
      </div>
      
      <div style="padding:20px; display:flex; flex-direction:column; gap:16px;">
        <div style="display:flex; gap:10px;">
          <select id="modal-search-type" class="form-input" style="width:120px; padding:8px 12px; font-size:13px;">
            <option value="all">전체검색</option>
            <option value="client">제휴사명</option>
            <option value="tier">등급명</option>
          </select>
          <input type="text" id="modal-search-keyword" class="form-input" placeholder="제휴사 또는 서비스등급명을 입력하세요." style="flex:1; padding:8px 12px; font-size:13px;" onkeyup="window.searchGradesInModal()">
        </div>

        <div style="border:1px solid #cbd5e1; border-radius:6px; height:280px; overflow-y:auto; background:#fff;">
          <table style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:#f8fafc; border-bottom:1px solid #e2e8f0; position:sticky; top:0;">
              <tr>
                <th style="padding:10px 16px; font-weight:700; color:#475569;">제휴사명</th>
                <th style="padding:10px 16px; font-weight:700; color:#475569;">서비스 등급명</th>
              </tr>
            </thead>
            <tbody id="modal-grades-tbody">
              <!-- JS Injected rows -->
            </tbody>
          </table>
        </div>
      </div>

      <div style="padding:16px 24px; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:12px; background:#f8fafc;">
        <button class="btn btn-secondary" style="padding:8px 20px; border-radius:6px;" onclick="window.closeSearchGradeModal()">취소</button>
        <button class="btn btn-primary" id="modal-select-confirm-btn" style="padding:8px 20px; border-radius:6px;" disabled>선택 등록</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Keep state of selected item
  let selectedItem = null;

  window.closeSearchGradeModal = function() {
    modal.remove();
  };

  window.searchGradesInModal = function() {
    const type = document.getElementById('modal-search-type').value;
    const keyword = document.getElementById('modal-search-keyword').value.toLowerCase().trim();
    const tbody = document.getElementById('modal-grades-tbody');
    if (!tbody) return;

    const filtered = availableGrades.filter(g => {
      const matchClient = g.clientName.toLowerCase().includes(keyword);
      const matchTier = g.tierName.toLowerCase().includes(keyword);
      if (!keyword) return true;
      if (type === 'client') return matchClient;
      if (type === 'tier') return matchTier;
      return matchClient || matchTier;
    });

    tbody.innerHTML = filtered.map(g => `
      <tr class="modal-grade-row" data-client-id="${g.clientId}" data-client-name="${g.clientName}" data-tier-name="${g.tierName}" style="cursor:pointer; transition: background 0.15s; border-bottom:1px solid #f1f5f9;">
        <td style="padding:10px 16px; font-weight:600; color:#334155;">${g.clientName}</td>
        <td style="padding:10px 16px; font-weight:600; color:#2563eb;">${g.tierName}</td>
      </tr>
    `).join('');

    // Rebind click events
    const rows = tbody.querySelectorAll('.modal-grade-row');
    rows.forEach(row => {
      row.addEventListener('click', () => {
        rows.forEach(r => r.style.backgroundColor = 'transparent');
        row.style.backgroundColor = '#eff6ff';
        selectedItem = {
          clientId: row.dataset.clientId,
          clientName: row.dataset.clientName,
          tierName: row.dataset.tierName
        };
        document.getElementById('modal-select-confirm-btn').disabled = false;
      });

      row.addEventListener('dblclick', () => {
        selectedItem = {
          clientId: row.dataset.clientId,
          clientName: row.dataset.clientName,
          tierName: row.dataset.tierName
        };
        confirmSelection();
      });
    });
  };

  function confirmSelection() {
    if (!selectedItem) return;
    window.closeSearchGradeModal();
    const key = `${selectedItem.clientId}|${selectedItem.tierName}`;
    window.openProvidedServicesEditor(key, selectedItem.clientId, selectedItem.tierName);
  }

  document.getElementById('modal-select-confirm-btn').onclick = confirmSelection;

  // Trigger initial search
  window.searchGradesInModal();
};


// -------------------------------------------------------------
// EDITOR WORKSPACE: Edit screen & Interactive elements
// -------------------------------------------------------------
let currentEditorKey = null;
let currentEditorClientId = null;
let currentEditorTierName = null;
let activeEditorTabIdx = 0;
let serviceEditorTabs = []; // { title: '...', html: '...' }

// Trigger editing for an existing service
window.editProvidedService = function(key) {
  const data = getProvidedServicesData();
  const item = data[key];
  if (!item) return;
  window.openProvidedServicesEditor(key, item.clientId, item.tierName);
};

// Main editor screen renderer
window.openProvidedServicesEditor = function(key, clientId, tierName) {
  currentEditorKey = key;
  currentEditorClientId = clientId;
  currentEditorTierName = tierName;

  const data = getProvidedServicesData();
  const service = data[key] || {
    clientId: clientId,
    tierName: tierName,
    exposureYn: "Y",
    sections: {
      intro: "",
      csGuide: "",
      tabs: []
    }
  };

  // Initialize tabs from existing data or set default
  serviceEditorTabs = service.sections.tabs ? JSON.parse(JSON.stringify(service.sections.tabs)) : [];
  if (serviceEditorTabs.length === 0) {
    serviceEditorTabs.push({ title: "평상시 서비스", html: "" });
  }
  activeEditorTabIdx = 0;

  // Set breadcrumb path
  const breadcrumb = document.querySelector('.breadcrumb');
  if (breadcrumb) {
    breadcrumb.innerHTML = `사무포털 <span class='separator'>></span> 헬스케어포털 관리 <span class='separator'>></span> 제공서비스 관리 <span class='separator'>></span> <strong>등록 및 수정</strong>`;
  }

  const container = document.getElementById('admin-main-view');
  if (!container) return;

  // Build the full HTML structure for the editor
  container.innerHTML = `
    <!-- Top Bar with Buttons -->
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; border-bottom:1px solid #e2e8f0; padding-bottom:16px;">
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:20px; font-weight:800; color:#0f172a;">제공서비스 관리</span>
        <span style="background:#eff6ff; color:#2563eb; font-size:13px; font-weight:700; padding:4px 10px; border-radius:100px; border:1px solid #bfdbfe;">
          ${tierName}
        </span>
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-secondary" onclick="window.previewProvidedService()" style="background:#fff; border:1px solid #cbd5e1; font-weight:700; color:#475569; display:flex; gap:6px; align-items:center;">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          미리보기
        </button>
      </div>
    </div>

    <!-- Info Block -->
    <div class="config-card" style="padding:20px; margin-bottom:24px; display:flex; justify-content:space-between; align-items:center;">
      <div style="display:flex; align-items:center; gap:20px;">
        <div>
          <span class="form-label" style="margin-bottom:4px; font-size:12px;">서비스 등급명</span>
          <div style="font-size:15px; font-weight:700; color:#0f172a;">${tierName}</div>
        </div>
        <div style="width:1px; height:32px; background:#e2e8f0;"></div>
        <button class="btn btn-secondary btn-sm" onclick="window.loadSampleTemplate()" style="padding:6px 12px; font-size:12px; background:#fff; border:1px solid #cbd5e1;">
          기존 서비스 불러오기 (샘플 템플릿)
        </button>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-size:13px; font-weight:700; color:#475569;">노출 여부</span>
        <label class="switch">
          <input type="checkbox" id="editor-exposure-toggle" ${service.exposureYn === 'Y' ? 'checked':''}>
          <span class="slider"></span>
        </label>
      </div>
    </div>

    <!-- Editors Area -->
    <div style="display:flex; flex-direction:column; gap:24px;">
      
      <!-- 1. 서비스 소개 (Fixed) -->
      <div class="config-card">
        <div class="card-header" style="background:#fafaf9; border-bottom:1px solid #e2e8f0; padding:16px 24px; display:flex; justify-content:space-between; align-items:center;">
          <h3 class="card-title" style="font-size:14px; font-weight:700; color:#0f172a;">1. 서비스 소개 <span style="color:#ef4444;">*</span></h3>
          <div style="display:flex; background:#e2e8f0; border-radius:6px; padding:2px;">
            <button class="btn btn-sm" id="btn-toggle-editor-mode-intro" onclick="window.switchEditorMode('intro', 'editor')" style="padding:4px 10px; font-size:11px; background:#2563eb; color:white; border-radius:4px;">에디터 모드</button>
            <button class="btn btn-sm" id="btn-toggle-html-mode-intro" onclick="window.switchEditorMode('intro', 'html')" style="padding:4px 10px; font-size:11px; background:transparent; color:#475569; border-radius:4px;">HTML 모드</button>
          </div>
        </div>
        <div class="card-body" style="padding:20px;">
          <!-- Custom Interactive Rich Editor -->
          ${window.renderCanvasEditorMarkup('intro', service.sections.intro)}
        </div>
      </div>

      <!-- 2. 헬스케어 고객센터 안내 (Fixed) -->
      <div class="config-card">
        <div class="card-header" style="background:#fafaf9; border-bottom:1px solid #e2e8f0; padding:16px 24px; display:flex; justify-content:space-between; align-items:center;">
          <h3 class="card-title" style="font-size:14px; font-weight:700; color:#0f172a;">2. 헬스케어 고객센터 안내 <span style="color:#ef4444;">*</span></h3>
          <div style="display:flex; background:#e2e8f0; border-radius:6px; padding:2px;">
            <button class="btn btn-sm" id="btn-toggle-editor-mode-cs" onclick="window.switchEditorMode('cs', 'editor')" style="padding:4px 10px; font-size:11px; background:#2563eb; color:white; border-radius:4px;">에디터 모드</button>
            <button class="btn btn-sm" id="btn-toggle-html-mode-cs" onclick="window.switchEditorMode('cs', 'html')" style="padding:4px 10px; font-size:11px; background:transparent; color:#475569; border-radius:4px;">HTML 모드</button>
          </div>
        </div>
        <div class="card-body" style="padding:20px;">
          ${window.renderCanvasEditorMarkup('cs', service.sections.csGuide)}
        </div>
      </div>

      <!-- 3. 서비스 주요내용 (Tabs up to 10) -->
      <div class="config-card">
        <div class="card-header" style="background:#fafaf9; border-bottom:1px solid #e2e8f0; padding:16px 24px; display:flex; justify-content:space-between; align-items:center;">
          <h3 class="card-title" style="font-size:14px; font-weight:700; color:#0f172a;">3. 서비스 주요내용 영역 (탭 설정) <span style="color:#ef4444;">*</span></h3>
          <button class="btn btn-secondary btn-sm" onclick="window.openTabManagerModal()" style="background:#fff; border:1px solid #cbd5e1; display:flex; gap:4px; align-items:center;">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            탭 관리
          </button>
        </div>
        <div class="card-body" style="padding:20px;">
          <!-- Tab Buttons Row -->
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #e2e8f0; padding-bottom:8px; margin-bottom:20px; overflow-x:auto;">
            <div id="editor-tabs-bar" style="display:flex; gap:6px;">
              <!-- Tab buttons dynamically rendered here -->
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.addEditorNewTab()" style="flex-shrink:0; background:#f8fafc; border:1px dashed #cbd5e1; color:#2563eb; font-weight:700;">
              + 탭 추가
            </button>
          </div>

          <!-- Active Tab Editor Info -->
          <div style="display:flex; align-items:center; gap:16px; margin-bottom:16px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:10px 16px;">
            <span style="font-weight:700; color:#1e3a8a; font-size:13px;" id="editor-active-tab-num-lbl">Tab 1</span>
            <input type="text" id="editor-active-tab-title-input" class="form-input" style="width:240px; padding:6px 12px; font-size:13px; font-weight:700;" oninput="window.updateActiveTabTitle(this.value)">
            <span style="font-size:12px; color:#64748b;">* 탭 제목을 직접 기입하시면 동적으로 변경됩니다.</span>
            <div style="flex:1;"></div>
            <div style="display:flex; background:#e2e8f0; border-radius:6px; padding:2px;">
              <button class="btn btn-sm" id="btn-toggle-editor-mode-tabs" onclick="window.switchEditorMode('tabs', 'editor')" style="padding:4px 10px; font-size:11px; background:#2563eb; color:white; border-radius:4px;">에디터 모드</button>
              <button class="btn btn-sm" id="btn-toggle-html-mode-tabs" onclick="window.switchEditorMode('tabs', 'html')" style="padding:4px 10px; font-size:11px; background:transparent; color:#475569; border-radius:4px;">HTML 모드</button>
            </div>
          </div>

          <!-- Tab Wysiwyg Editor -->
          <div id="tab-editor-container">
            ${window.renderCanvasEditorMarkup('tabs', '')}
          </div>
          <div style="font-size:12px; color:#94a3b8; margin-top:8px; text-align:right;">
            * 탭은 최대 10개까지 등록 가능합니다.
          </div>
        </div>
      </div>

      <!-- Bottom Buttons Area -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:24px; padding-top:16px; border-top:1px solid #e2e8f0;">
        <div>
          <button class="btn btn-secondary" onclick="window.cancelProvidedServicesEdit()" style="background:#fff; border:1px solid #cbd5e1; font-weight:700; color:#475569; display:flex; gap:6px; align-items:center;">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            목록
          </button>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-secondary" onclick="window.cancelProvidedServicesEdit()" style="background:#f1f5f9; border:none; font-weight:700; color:#475569;">취소</button>
          <button class="btn btn-primary" onclick="window.saveProvidedServices()" style="background:#2563eb; font-weight:700; color:#fff;">저장</button>
        </div>
      </div>

    </div>
  `;

  // Initialize and bind all custom canvas rich-editor scripts
  window.initializeCanvasEditor('intro');
  window.initializeCanvasEditor('cs');
  window.initializeCanvasEditor('tabs');

  // Load active tab content
  window.refreshTabButtonsBar();
  window.loadTabEditorIndex(0);
};

// -------------------------------------------------------------
// MS OFFICE-LEVEL WYSIWYG CANVAS EDITOR LOGIC
// -------------------------------------------------------------
let canvasEditorModes = { intro: 'editor', cs: 'editor', tabs: 'editor' };

// Return the visual canvas editor HTML markup
window.renderCanvasEditorMarkup = function(id, initialHtml) {
  return `
    <div class="canvas-editor-wrapper" id="canvas-wrapper-${id}" style="display:flex; flex-direction:column; gap:10px;">
      
      <!-- Toolbar -->
      <div class="editor-toolbar" style="border:1px solid #cbd5e1; border-bottom:none; border-radius:8px 8px 0 0; background:#f8fafc; padding:8px 12px; display:flex; flex-wrap:wrap; gap:6px; align-items:center;">
        
        <!-- Text commands -->
        <button class="editor-btn" onclick="window.execCanvasCmd('${id}', 'bold')" style="font-weight:bold; width:32px;" title="굵게">B</button>
        <button class="editor-btn" onclick="window.execCanvasCmd('${id}', 'italic')" style="font-style:italic; width:32px;" title="기울임">I</button>
        <button class="editor-btn" onclick="window.execCanvasCmd('${id}', 'underline')" style="text-decoration:underline; width:32px;" title="밑줄">U</button>
        
        <div style="width:1px; height:20px; background:#cbd5e1; margin:0 4px;"></div>

        <!-- Font Size selection -->
        <select onchange="window.execCanvasCmd('${id}', 'fontSize', this.value)" style="padding:4px; font-size:12px; border:1px solid #cbd5e1; border-radius:4px;">
          <option value="13px">13px</option>
          <option value="14px" selected>14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
          <option value="32px">32px</option>
        </select>

        <!-- Font Color selection -->
        <select onchange="window.execCanvasCmd('${id}', 'foreColor', this.value)" style="padding:4px; font-size:12px; border:1px solid #cbd5e1; border-radius:4px;">
          <option value="#0f172a" style="color:#0f172a;">검은색</option>
          <option value="#2563eb" style="color:#2563eb;">파란색</option>
          <option value="#17B890" style="color:#17B890;">민트색</option>
          <option value="#ef4444" style="color:#ef4444;">빨간색</option>
          <option value="#f59e0b" style="color:#f59e0b;">오렌지색</option>
          <option value="#10b981" style="color:#10b981;">녹색</option>
          <option value="#7c3aed" style="color:#7c3aed;">보라색</option>
          <option value="#ffffff" style="color:#cccccc; background:#000;">흰색</option>
        </select>

        <!-- Align commands -->
        <button class="editor-btn" onclick="window.execCanvasCmd('${id}', 'align', 'left')" title="왼쪽 정렬">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 10H3M21 6H3M21 14H3M17 18H3"/></svg>
        </button>
        <button class="editor-btn" onclick="window.execCanvasCmd('${id}', 'align', 'center')" title="가운데 정렬">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10H6M21 6H3M21 14H3M18 18H6"/></svg>
        </button>
        <button class="editor-btn" onclick="window.execCanvasCmd('${id}', 'align', 'right')" title="오른쪽 정렬">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10H7M21 6H3M21 14H3M21 18H7"/></svg>
        </button>

        <div style="width:1px; height:20px; background:#cbd5e1; margin:0 4px;"></div>

        <!-- Add Elements commands -->
        <button class="editor-btn" onclick="window.addCanvasShape('${id}', 'rect')" style="font-size:11px; padding:4px 6px; font-weight:700; color:#3b82f6;" title="직사각형 추가">+ ⬛ 사각형</button>
        <button class="editor-btn" onclick="window.addCanvasShape('${id}', 'roundrect')" style="font-size:11px; padding:4px 6px; font-weight:700; color:#0369a1;" title="둥근 사각형 추가">+ ▢ 둥근사각형</button>
        <button class="editor-btn" onclick="window.addCanvasShape('${id}', 'oval')" style="font-size:11px; padding:4px 6px; font-weight:700; color:#10b981;" title="타원형 추가">+ 🔴 타원형</button>
        <button class="editor-btn" onclick="window.addCanvasShape('${id}', 'arrow')" style="font-size:11px; padding:4px 6px; font-weight:700; color:#f59e0b;" title="화살표 추가">+ ➡️ 화살표</button>
        <button class="editor-btn" onclick="window.addCanvasShape('${id}', 'callout')" style="font-size:11px; padding:4px 6px; font-weight:700; color:#7c3aed;" title="말풍선 추가">+ 💬 말풍선</button>
        
        <div style="width:1px; height:20px; background:#cbd5e1; margin:0 4px;"></div>

        <!-- Shape Styling Toolbar Controls -->
        <span style="font-size:11px; font-weight:700; color:#64748b; margin-left:4px;">도형스타일:</span>
        
        <!-- Shape Fill Color Dropdown -->
        <select id="shape-style-bg-${id}" onchange="window.applyShapeStyle('${id}', 'bg', this.value)" style="padding:4px; font-size:11px; border:1px solid #cbd5e1; border-radius:4px; font-weight:600;" title="도형 채우기 색">
          <option value="#eff6ff" style="background:#eff6ff; color:#1e3a8a;">배경: 연청</option>
          <option value="#ecfdf5" style="background:#ecfdf5; color:#065f46;">배경: 연녹</option>
          <option value="#fffbeb" style="background:#fffbeb; color:#78350f;">배경: 연황</option>
          <option value="#f3e8ff" style="background:#f3e8ff; color:#5b21b6;">배경: 연자</option>
          <option value="#fef2f2" style="background:#fef2f2; color:#991b1b;">배경: 연적</option>
          <option value="#ffffff" style="background:#ffffff; color:#334155;">배경: 흰색</option>
          <option value="#000000" style="background:#000000; color:#ffffff;">배경: 검정</option>
        </select>

        <!-- Shape Border Color Dropdown -->
        <select id="shape-style-border-${id}" onchange="window.applyShapeStyle('${id}', 'borderColor', this.value)" style="padding:4px; font-size:11px; border:1px solid #cbd5e1; border-radius:4px; font-weight:600;" title="도형 테두리 색">
          <option value="#2563eb" style="color:#2563eb;">테두리: 청색</option>
          <option value="#10b981" style="color:#10b981;">테두리: 녹색</option>
          <option value="#f59e0b" style="color:#f59e0b;">테두리: 황색</option>
          <option value="#7c3aed" style="color:#7c3aed;">테두리: 자색</option>
          <option value="#ef4444" style="color:#ef4444;">테두리: 적색</option>
          <option value="#cbd5e1" style="color:#64748b;">테두리: 회색</option>
          <option value="none" style="color:#94a3b8;">테두리: 없음</option>
        </select>

        <!-- Shape Border Thickness Dropdown -->
        <select id="shape-style-thickness-${id}" onchange="window.applyShapeStyle('${id}', 'borderWidth', this.value)" style="padding:4px; font-size:11px; border:1px solid #cbd5e1; border-radius:4px; font-weight:600;" title="도형 테두리 두께">
          <option value="1">선: 얇게(1px)</option>
          <option value="2" selected>선: 보통(2px)</option>
          <option value="4">선: 두껍게(4px)</option>
          <option value="6">선: 아주두껍게(6px)</option>
          <option value="0">선: 없음(0px)</option>
        </select>

        <!-- Shape Text Color Dropdown -->
        <select id="shape-style-textcolor-${id}" onchange="window.applyShapeStyle('${id}', 'textColor', this.value)" style="padding:4px; font-size:11px; border:1px solid #cbd5e1; border-radius:4px; font-weight:600;" title="도형 글자 색">
          <option value="#1e293b" style="color:#1e293b;">글씨: 진회색</option>
          <option value="#2563eb" style="color:#2563eb;">글씨: 파란색</option>
          <option value="#10b981" style="color:#10b981;">글씨: 녹색</option>
          <option value="#ef4444" style="color:#ef4444;">글씨: 빨간색</option>
          <option value="#ffffff" style="color:#cccccc; background:#000;">글씨: 흰색</option>
        </select>

        <div style="width:1px; height:20px; background:#cbd5e1; margin:0 4px;"></div>

        <!-- Image Upload wrapper -->
        <div class="image-upload-wrapper" style="position:relative; display:inline-block;">
          <button class="editor-btn" style="font-size:11px; padding:4px 8px; font-weight:700; color:#db2777;" title="이미지 파일 첨부">+ 📷 이미지</button>
          <input type="file" accept="image/*" class="image-upload-input" onchange="window.handleCanvasImageUpload('${id}', this)" style="position:absolute; inset:0; opacity:0; cursor:pointer; width:100%;">
        </div>

        <div style="flex:1;"></div>

        <button class="editor-btn" onclick="window.deleteActiveCanvasElement('${id}')" style="background:#fee2e2; border-color:#fca5a5; color:#991b1b; padding:4px 8px; font-size:11px; font-weight:700;" title="선택된 도형/이미지 삭제">🗑️ 삭제</button>
      </div>

      <!-- Editor Content Workspace (Visual mode) -->
      <div class="canvas-workspace" id="canvas-workspace-${id}" style="position:relative; width:100%; height:${(id === 'intro' || id === 'cs') ? '175px' : '350px'}; background:#fff; border:1px solid #cbd5e1; border-radius:0 0 8px 8px; overflow:hidden; box-shadow:inset 0 2px 4px rgba(0,0,0,0.02);">
        <!-- Inline Rich Editable text background area -->
        <div class="canvas-text-bg" id="canvas-text-bg-${id}" contenteditable="true" style="position:absolute; inset:0; padding:20px; outline:none; line-height:1.6; font-size:14px; font-family:inherit; overflow-y:auto; z-index:1;">
          <!-- Initial static HTML parsed/injected here -->
        </div>

        <!-- Draggable shapes/images layered above the text background -->
        <div class="canvas-layers-container" id="canvas-layers-${id}" style="position:absolute; inset:0; pointer-events:none; z-index:2; overflow:hidden;">
          <!-- Absolutely positioned draggable objects -->
        </div>
      </div>

      <!-- HTML Mode textarea editor (Raw source) -->
      <textarea class="editor-textarea" id="canvas-html-textarea-${id}" style="display:none; width:100%; height:${(id === 'intro' || id === 'cs') ? '175px' : '350px'}; padding:16px; border:1px solid #cbd5e1; border-radius:0 0 8px 8px; background:#1e293b; color:#f8fafc; font-family:Consolas, Monaco, monospace; font-size:13px; line-height:1.5; outline:none; resize:vertical;"></textarea>

    </div>
  `;
};

// Initialize listeners for canvas dragging and resizing
window.initializeCanvasEditor = function(id) {
  const workspace = document.getElementById(`canvas-workspace-${id}`);
  const layers = document.getElementById(`canvas-layers-${id}`);
  const textBg = document.getElementById(`canvas-text-bg-${id}`);
  
  if (!workspace || !layers) return;

  // Track select/deselect element clicking on workspace blank space
  workspace.addEventListener('mousedown', (e) => {
    if (e.target === workspace || e.target === textBg || e.target === layers) {
      window.deselectAllCanvasElements(id);
    }
  });

  // Track key events inside text background to sync selection
  textBg.addEventListener('input', () => {
    // Event placeholder
  });
};

// Deselect all selected objects
window.deselectAllCanvasElements = function(id) {
  const layers = document.getElementById(`canvas-layers-${id}`);
  if (!layers) return;
  layers.querySelectorAll('.canvas-element').forEach(el => {
    el.classList.remove('selected');
    el.style.border = 'none';
    const knobs = el.querySelectorAll('.resize-knob');
    knobs.forEach(k => k.style.display = 'none');
    const rKnobs = el.querySelectorAll('.roundness-knob');
    rKnobs.forEach(k => k.style.display = 'none');
  });
};

// Make element draggable and resizable
window.bindCanvasDragResize = function(id, el) {
  const workspace = document.getElementById(`canvas-workspace-${id}`);
  
  let isDrag = false;
  let isSize = false;
  let isRoundnessDrag = false;
  let sizeDir = '';
  
  let startX, startY, startW, startH, startL, startT;
  let rStartX = 0, rStartLeft = 0;

  el.addEventListener('mousedown', (e) => {
    // Enable mouse interaction inside elements by allowing focus on text inside them
    if (e.target.classList.contains('roundness-knob')) {
      isRoundnessDrag = true;
      rStartX = e.clientX;
      const svgRect = el.querySelector('svg rect');
      let rx = 12; // default
      if (svgRect) {
        rx = parseFloat(svgRect.getAttribute('rx')) || 0;
      }
      rStartLeft = (rx / 100) * el.offsetWidth;
      e.stopPropagation();
      e.preventDefault();
    } else if (e.target.classList.contains('resize-knob')) {
      isSize = true;
      sizeDir = e.target.dataset.dir;
      startX = e.clientX;
      startY = e.clientY;
      startW = el.offsetWidth;
      startH = el.offsetHeight;
      startL = el.offsetLeft;
      startT = el.offsetTop;
      e.stopPropagation();
      e.preventDefault();
    } else {
      isDrag = true;
      startX = e.clientX;
      startY = e.clientY;
      startL = el.offsetLeft;
      startT = el.offsetTop;
      e.stopPropagation();
    }

    // Mark active element as selected
    window.deselectAllCanvasElements(id);
    el.classList.add('selected');
    el.style.border = '2px dashed #2563eb';
    el.querySelectorAll('.resize-knob').forEach(k => k.style.display = 'block');
    el.querySelectorAll('.roundness-knob').forEach(k => k.style.display = 'block');

    // Update style dropdowns inside toolbar based on current selected element values
    if (el.dataset.type === 'shape') {
      const svgTag = el.querySelector('svg rect, svg ellipse, svg path');
      if (svgTag) {
        const bg = svgTag.getAttribute('fill') || '';
        const border = svgTag.getAttribute('stroke') || '';
        const thickness = svgTag.getAttribute('stroke-width') || '';
        
        const selBg = document.getElementById(`shape-style-bg-${id}`);
        const selBorder = document.getElementById(`shape-style-border-${id}`);
        const selThickness = document.getElementById(`shape-style-thickness-${id}`);
        
        if (selBg) selBg.value = bg;
        if (selBorder) selBorder.value = border;
        if (selThickness) selThickness.value = thickness;
      }

      const textEl = el.querySelector('.element-text-area');
      const selTextC = document.getElementById(`shape-style-textcolor-${id}`);
      if (textEl && selTextC) {
        const textC = window.getComputedStyle(textEl).color;
        // Simple RGB to Hex helper
        const rgbToHex = (rgb) => {
          if (!rgb.startsWith('rgb')) return rgb;
          const match = rgb.match(/\d+/g);
          if (!match) return rgb;
          return "#" + match.slice(0, 3).map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
          }).join('');
        };
        selTextC.value = rgbToHex(textC);
      }
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (isRoundnessDrag) {
      const dx = e.clientX - rStartX;
      let newLeft = rStartLeft + dx;
      const maxLeft = el.offsetWidth / 2;
      if (newLeft < 0) newLeft = 0;
      if (newLeft > maxLeft) newLeft = maxLeft;

      const knob = el.querySelector('.roundness-knob');
      if (knob) {
        knob.style.left = `${newLeft}px`;
      }

      const rxVal = (newLeft / el.offsetWidth) * 100;
      const svgRect = el.querySelector('svg rect');
      if (svgRect) {
        svgRect.setAttribute('rx', rxVal.toFixed(2));
        svgRect.setAttribute('ry', rxVal.toFixed(2));
      }
    } else if (isDrag) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      let newL = startL + dx;
      let newT = startT + dy;

      // Restrict inside workspace dimensions
      if (newL < 0) newL = 0;
      if (newT < 0) newT = 0;
      if (newL + el.offsetWidth > workspace.offsetWidth) newL = workspace.offsetWidth - el.offsetWidth;
      if (newT + el.offsetHeight > workspace.offsetHeight) newT = workspace.offsetHeight - el.offsetHeight;

      el.style.left = `${newL}px`;
      el.style.top = `${newT}px`;
    } else if (isSize) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let newW = startW;
      let newH = startH;
      let newL = startL;
      let newT = startT;

      if (sizeDir.includes('e')) newW = startW + dx;
      if (sizeDir.includes('w')) {
        newW = startW - dx;
        newL = startL + dx;
      }
      if (sizeDir.includes('s')) newH = startH + dy;
      if (sizeDir.includes('n')) {
        newH = startH - dy;
        newT = startT + dy;
      }

      // Safeguard boundaries and minimum sizes
      if (newW > 30 && newL >= 0 && newL + newW <= workspace.offsetWidth) {
        el.style.width = `${newW}px`;
        el.style.left = `${newL}px`;
      }
      if (newH > 30 && newT >= 0 && newT + newH <= workspace.offsetHeight) {
        el.style.height = `${newH}px`;
        el.style.top = `${newT}px`;
      }

      // Update roundness knob's horizontal position relative to the resized width
      const roundnessKnob = el.querySelector('.roundness-knob');
      if (roundnessKnob) {
        const svgRect = el.querySelector('svg rect');
        if (svgRect) {
          const rx = parseFloat(svgRect.getAttribute('rx')) || 0;
          roundnessKnob.style.left = `${(rx / 100) * newW}px`;
        }
      }
    }
  });

  document.addEventListener('mouseup', () => {
    isDrag = false;
    isSize = false;
    isRoundnessDrag = false;
  });
};

// Insert a shape into the active canvas editor
window.addCanvasShape = function(id, shapeType) {
  const layers = document.getElementById(`canvas-layers-${id}`);
  if (!layers) return;

  const el = document.createElement('div');
  el.className = 'canvas-element selected';
  el.dataset.type = 'shape';
  el.dataset.shape = shapeType;
  el.style = `position:absolute; left:80px; top:80px; width:150px; height:100px; z-index:10; pointer-events:auto; border:2px dashed #2563eb; cursor:move;`;

  // Draw vector SVG shape based on type
  let svgContent = '';
  if (shapeType === 'rect') {
    svgContent = `<svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" style="display:block;"><rect x="2" y="2" width="96" height="96" fill="#eff6ff" stroke="#2563eb" stroke-width="2" rx="0"/></svg>`;
  } else if (shapeType === 'roundrect') {
    svgContent = `<svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" style="display:block;"><rect x="2" y="2" width="96" height="96" fill="#eff6ff" stroke="#2563eb" stroke-width="2" rx="12"/></svg>`;
  } else if (shapeType === 'oval') {
    svgContent = `<svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" style="display:block;"><ellipse cx="50" cy="50" rx="47" ry="47" fill="#ecfdf5" stroke="#10b981" stroke-width="2"/></svg>`;
  } else if (shapeType === 'circle') {
    svgContent = `<svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" style="display:block;"><circle cx="50" cy="50" r="47" fill="#ecfdf5" stroke="#10b981" stroke-width="2"/></svg>`;
  } else if (shapeType === 'arrow') {
    svgContent = `<svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" style="display:block;"><path d="M 5,35 H 65 V 15 L 95,50 L 65,85 V 65 H 5 Z" fill="#fffbeb" stroke="#f59e0b" stroke-width="2"/></svg>`;
  } else if (shapeType === 'callout') {
    svgContent = `<svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" style="display:block;"><path d="M 5,5 H 95 V 70 H 45 L 25,95 V 70 H 5 Z" fill="#f3e8ff" stroke="#7c3aed" stroke-width="2" rx="4"/></svg>`;
  }

  let knobHtml = '';
  if (shapeType === 'roundrect') {
    knobHtml = `<div class="roundness-knob" style="position:absolute; left:18px; top:4px; width:8px; height:8px; background:#facc15; border:1px solid #ca8a04; cursor:ew-resize; z-index:4; transform:translate(-50%, -50%) rotate(45deg); display:block;"></div>`;
  }

  // Inject SVG and resize handle knobs
  el.innerHTML = `
    <div class="element-content-wrapper" style="position:absolute; inset:0; z-index:1;">
      ${svgContent}
    </div>
    <div class="element-text-area" contenteditable="true" style="position:absolute; inset:12px; z-index:2; display:flex; align-items:center; justify-content:center; text-align:center; font-size:12px; font-weight:700; color:#1e293b; outline:none; pointer-events:auto; word-break:break-all;">
      도형 글자
    </div>
    <!-- Resize Handles -->
    <div class="resize-knob" data-dir="nw" style="position:absolute; left:-5px; top:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:nwse-resize; z-index:3;"></div>
    <div class="resize-knob" data-dir="ne" style="position:absolute; right:-5px; top:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:nesw-resize; z-index:3;"></div>
    <div class="resize-knob" data-dir="se" style="position:absolute; right:-5px; bottom:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:nwse-resize; z-index:3;"></div>
    <div class="resize-knob" data-dir="sw" style="position:absolute; left:-5px; bottom:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:nesw-resize; z-index:3;"></div>
    <div class="resize-knob" data-dir="n" style="position:absolute; left:calc(50% - 5px); top:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:ns-resize; z-index:3;"></div>
    <div class="resize-knob" data-dir="s" style="position:absolute; left:calc(50% - 5px); bottom:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:ns-resize; z-index:3;"></div>
    <div class="resize-knob" data-dir="e" style="position:absolute; right:-5px; top:calc(50% - 5px); width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:ew-resize; z-index:3;"></div>
    <div class="resize-knob" data-dir="w" style="position:absolute; left:-5px; top:calc(50% - 5px); width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:ew-resize; z-index:3;"></div>
    ${knobHtml}
  `;

  // Deselect previous
  window.deselectAllCanvasElements(id);
  layers.appendChild(el);

  // Bind mouse handlers
  window.bindCanvasDragResize(id, el);

  // Focus the editable text inside the shape immediately
  setTimeout(() => {
    const textDiv = el.querySelector('.element-text-area');
    if (textDiv) textDiv.focus();
  }, 100);
};

// Apply styling to selected shape dynamically
window.applyShapeStyle = function(id, styleType, value) {
  const layers = document.getElementById(`canvas-layers-${id}`);
  if (!layers) return;
  const activeEl = layers.querySelector('.canvas-element.selected');
  if (!activeEl || activeEl.dataset.type !== 'shape') return;

  const svgTag = activeEl.querySelector('svg rect, svg ellipse, svg path, svg circle');
  if (!svgTag) return;

  if (styleType === 'bg') {
    svgTag.setAttribute('fill', value);
  } else if (styleType === 'borderColor') {
    if (value === 'none') {
      svgTag.setAttribute('stroke', 'transparent');
    } else {
      svgTag.setAttribute('stroke', value);
    }
  } else if (styleType === 'borderWidth') {
    svgTag.setAttribute('stroke-width', value);
  } else if (styleType === 'textColor') {
    const textDiv = activeEl.querySelector('.element-text-area');
    if (textDiv) textDiv.style.color = value;
  }
};

// Handle local image uploads base64 conversion and insertion
window.handleCanvasImageUpload = function(id, fileInput) {
  const layers = document.getElementById(`canvas-layers-${id}`);
  if (!layers || !fileInput.files || fileInput.files.length === 0) return;

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const base64Url = e.target.result;
    const el = document.createElement('div');
    el.className = 'canvas-element selected';
    el.dataset.type = 'image';
    el.style = `position:absolute; left:100px; top:100px; width:220px; height:150px; z-index:10; pointer-events:auto; border:2px dashed #2563eb; cursor:move;`;

    el.innerHTML = `
      <div class="element-content-wrapper" style="position:absolute; inset:0; z-index:1; overflow:hidden; border-radius:8px;">
        <img src="${base64Url}" style="width:100%; height:100%; object-fit:cover; display:block;">
      </div>
      <!-- Resize Handles -->
      <div class="resize-knob" data-dir="nw" style="position:absolute; left:-5px; top:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:nwse-resize; z-index:3;"></div>
      <div class="resize-knob" data-dir="ne" style="position:absolute; right:-5px; top:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:nesw-resize; z-index:3;"></div>
      <div class="resize-knob" data-dir="se" style="position:absolute; right:-5px; bottom:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:nwse-resize; z-index:3;"></div>
      <div class="resize-knob" data-dir="sw" style="position:absolute; left:-5px; bottom:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:nesw-resize; z-index:3;"></div>
      <div class="resize-knob" data-dir="n" style="position:absolute; left:calc(50% - 5px); top:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:ns-resize; z-index:3;"></div>
      <div class="resize-knob" data-dir="s" style="position:absolute; left:calc(50% - 5px); bottom:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:ns-resize; z-index:3;"></div>
      <div class="resize-knob" data-dir="e" style="position:absolute; right:-5px; top:calc(50% - 5px); width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:ew-resize; z-index:3;"></div>
      <div class="resize-knob" data-dir="w" style="position:absolute; left:-5px; top:calc(50% - 5px); width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:ew-resize; z-index:3;"></div>
    `;

    window.deselectAllCanvasElements(id);
    layers.appendChild(el);
    window.bindCanvasDragResize(id, el);

    // Reset input
    fileInput.value = '';
  };

  reader.readAsDataURL(file);
};

// Delete selected shapes or images
window.deleteActiveCanvasElement = function(id) {
  const layers = document.getElementById(`canvas-layers-${id}`);
  if (!layers) return;
  const active = layers.querySelector('.canvas-element.selected');
  if (active) {
    active.remove();
  }
};

// Text commands in canvas background rich text area
window.execCanvasCmd = function(id, cmd, value = null) {
  const textBg = document.getElementById(`canvas-text-bg-${id}`);
  if (!textBg) return;

  // Restore focus if lost
  textBg.focus();

  if (cmd === 'align') {
    document.execCommand('justify' + value[0].toUpperCase() + value.slice(1), false, null);
  } else if (cmd === 'foreColor') {
    document.execCommand('foreColor', false, value);
  } else if (cmd === 'fontSize') {
    // Custom inline CSS font-size manipulation
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = value;
      range.surroundContents(span);
    }
  } else {
    document.execCommand(cmd, false, null);
  }
};

// -------------------------------------------------------------
// HTML / VISUAL CANVAS MUTATION ENGINE & SERIALIZATION
// -------------------------------------------------------------

// Switch between visual canvas and raw HTML mode
window.switchEditorMode = function(id, targetMode) {
  const currentMode = canvasEditorModes[id];
  if (currentMode === targetMode) return;

  const wrapper = document.getElementById(`canvas-wrapper-${id}`);
  const workspace = document.getElementById(`canvas-workspace-${id}`);
  const textarea = document.getElementById(`canvas-html-textarea-${id}`);
  
  const btnEditor = document.getElementById(`btn-toggle-editor-mode-${id}`);
  const btnHtml = document.getElementById(`btn-toggle-html-mode-${id}`);

  if (targetMode === 'html') {
    // Visual -> HTML code: Serialize workspace
    const htmlCode = window.serializeCanvasWorkspace(id);
    textarea.value = htmlCode;

    workspace.style.display = 'none';
    textarea.style.display = 'block';

    if (btnEditor) { btnEditor.style.background = 'transparent'; btnEditor.style.color = '#475569'; }
    if (btnHtml) { btnHtml.style.background = '#2563eb'; btnHtml.style.color = 'white'; }
  } else {
    // HTML code -> Visual: Parse HTML
    const htmlCode = textarea.value;
    window.parseHtmlToCanvasWorkspace(id, htmlCode);

    workspace.style.display = 'block';
    textarea.style.display = 'none';

    if (btnEditor) { btnEditor.style.background = '#2563eb'; btnEditor.style.color = 'white'; }
    if (btnHtml) { btnHtml.style.background = 'transparent'; btnHtml.style.color = '#475569'; }
  }

  canvasEditorModes[id] = targetMode;
};

// Serialize the canvas workspace content into responsive HTML (using % percentages)
window.serializeCanvasWorkspace = function(id) {
  const workspace = document.getElementById(`canvas-workspace-${id}`);
  const textBg = document.getElementById(`canvas-text-bg-${id}`);
  const layers = document.getElementById(`canvas-layers-${id}`);

  if (!workspace || !textBg || !layers) return '';

  const wWidth = workspace.offsetWidth || 1000;
  const wHeight = workspace.offsetHeight || 350;

  // Extract inline background text HTML
  const backgroundTextHtml = textBg.innerHTML.trim();

  // Extract all draggable overlays
  const elements = layers.querySelectorAll('.canvas-element');
  let layersHtml = '';

  elements.forEach(el => {
    // Convert absolute dimensions to percentage ratios for responsive rendering!
    const leftPct = ((el.offsetLeft / wWidth) * 100).toFixed(2);
    const topPct = ((el.offsetTop / wHeight) * 100).toFixed(2);
    const widthPct = ((el.offsetWidth / wWidth) * 100).toFixed(2);
    const heightPct = ((el.offsetHeight / wHeight) * 100).toFixed(2);

    const type = el.dataset.type;

    if (type === 'image') {
      const img = el.querySelector('img');
      const src = img ? img.src : '';
      layersHtml += `
        <div class="responsive-overlay-image" style="position:absolute; left:${leftPct}%; top:${topPct}%; width:${widthPct}%; height:${heightPct}%; z-index:10; border-radius:8px; overflow:hidden; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
          <img src="${src}" style="width:100%; height:100%; object-fit:cover; display:block;">
        </div>
      `;
    } else if (type === 'shape') {
      const shape = el.dataset.shape;
      const text = el.querySelector('.element-text-area').innerHTML.trim();
      const svg = el.querySelector('.element-content-wrapper').innerHTML.trim();

      layersHtml += `
        <div class="responsive-overlay-shape" data-shape="${shape}" style="position:absolute; left:${leftPct}%; top:${topPct}%; width:${widthPct}%; height:${heightPct}%; z-index:10;">
          <div style="position:absolute; inset:0; z-index:1;">
            ${svg}
          </div>
          <div style="position:absolute; inset:12px; z-index:2; display:flex; align-items:center; justify-content:center; text-align:center; font-size:12px; font-weight:700; color:#1e293b; outline:none; word-break:break-all;">
            ${text}
          </div>
        </div>
      `;
    }
  });

  // Combine together in a responsive fluid parent frame
  return `
<div class="provided-service-fluid-frame" style="position:relative; width:100%; padding-bottom:35%; min-height:350px; background:#fff; overflow:hidden;">
  <div class="provided-service-text-bg" style="position:absolute; inset:0; padding:20px; line-height:1.6; font-size:14px; overflow-y:auto; z-index:1;">
    ${backgroundTextHtml}
  </div>
  <div class="provided-service-overlay-layers" style="position:absolute; inset:0; pointer-events:none; z-index:2;">
    ${layersHtml}
  </div>
</div>
  `.trim();
};

// Parse responsive HTML code back to editor workspace pixel dimensions
window.parseHtmlToCanvasWorkspace = function(id, htmlCode) {
  const workspace = document.getElementById(`canvas-workspace-${id}`);
  const textBg = document.getElementById(`canvas-text-bg-${id}`);
  const layers = document.getElementById(`canvas-layers-${id}`);

  if (!workspace || !textBg || !layers) return;

  // Clear workspace
  textBg.innerHTML = '';
  layers.innerHTML = '';

  if (!htmlCode || htmlCode.trim() === '') return;

  const temp = document.createElement('div');
  temp.innerHTML = htmlCode;

  // Extract background text content
  const parsedTextBg = temp.querySelector('.provided-service-text-bg');
  if (parsedTextBg) {
    textBg.innerHTML = parsedTextBg.innerHTML;
  } else {
    // If it's a simple raw HTML block, insert directly in text background
    textBg.innerHTML = htmlCode;
    return;
  }

  // Extract and layer shapes/images
  const parsedLayers = temp.querySelector('.provided-service-overlay-layers');
  if (parsedLayers) {
    const wWidth = workspace.offsetWidth || 1000;
    const wHeight = workspace.offsetHeight || 350;

    // Parse image overlays
    const images = parsedLayers.querySelectorAll('.responsive-overlay-image');
    images.forEach(imgOverlay => {
      const src = imgOverlay.querySelector('img')?.src || '';
      
      // Calculate pixel size based on percentages
      const left = parseFloat(imgOverlay.style.left) * wWidth / 100;
      const top = parseFloat(imgOverlay.style.top) * wHeight / 100;
      const width = parseFloat(imgOverlay.style.width) * wWidth / 100;
      const height = parseFloat(imgOverlay.style.height) * wHeight / 100;

      const el = document.createElement('div');
      el.className = 'canvas-element';
      el.dataset.type = 'image';
      el.style = `position:absolute; left:${left}px; top:${top}px; width:${width}px; height:${height}px; z-index:10; pointer-events:auto; cursor:move;`;

      el.innerHTML = `
        <div class="element-content-wrapper" style="position:absolute; inset:0; z-index:1; overflow:hidden; border-radius:8px;">
          <img src="${src}" style="width:100%; height:100%; object-fit:cover; display:block;">
        </div>
        <!-- Resize Handles -->
        <div class="resize-knob" data-dir="nw" style="position:absolute; left:-5px; top:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:nwse-resize; z-index:3; display:none;"></div>
        <div class="resize-knob" data-dir="ne" style="position:absolute; right:-5px; top:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:nesw-resize; z-index:3; display:none;"></div>
        <div class="resize-knob" data-dir="se" style="position:absolute; right:-5px; bottom:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:nwse-resize; z-index:3; display:none;"></div>
        <div class="resize-knob" data-dir="sw" style="position:absolute; left:-5px; bottom:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:nesw-resize; z-index:3; display:none;"></div>
        <div class="resize-knob" data-dir="n" style="position:absolute; left:calc(50% - 5px); top:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:ns-resize; z-index:3; display:none;"></div>
        <div class="resize-knob" data-dir="s" style="position:absolute; left:calc(50% - 5px); bottom:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:ns-resize; z-index:3; display:none;"></div>
        <div class="resize-knob" data-dir="e" style="position:absolute; right:-5px; top:calc(50% - 5px); width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:ew-resize; z-index:3; display:none;"></div>
        <div class="resize-knob" data-dir="w" style="position:absolute; left:-5px; top:calc(50% - 5px); width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:ew-resize; z-index:3; display:none;"></div>
      `;

      layers.appendChild(el);
      window.bindCanvasDragResize(id, el);
    });

    // Parse shape overlays
    const shapes = parsedLayers.querySelectorAll('.responsive-overlay-shape');
    shapes.forEach(shapeOverlay => {
      const shapeType = shapeOverlay.dataset.shape || 'rect';
      const text = shapeOverlay.querySelector('div[style*="z-index:2"]')?.innerHTML.trim() || '텍스트 기입';
      const svg = shapeOverlay.querySelector('svg')?.outerHTML || '';

      const left = parseFloat(shapeOverlay.style.left) * wWidth / 100;
      const top = parseFloat(shapeOverlay.style.top) * wHeight / 100;
      const width = parseFloat(shapeOverlay.style.width) * wWidth / 100;
      const height = parseFloat(shapeOverlay.style.height) * wHeight / 100;

      const el = document.createElement('div');
      el.className = 'canvas-element';
      el.dataset.type = 'shape';
      el.dataset.shape = shapeType;
      el.style = `position:absolute; left:${left}px; top:${top}px; width:${width}px; height:${height}px; z-index:10; pointer-events:auto; cursor:move;`;

      let knobHtml = '';
      if (shapeType === 'roundrect') {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svg, 'image/svg+xml');
        const rectTag = svgDoc.querySelector('rect');
        let rxVal = 12; // default
        if (rectTag) {
          rxVal = parseFloat(rectTag.getAttribute('rx')) || 12;
        }
        const knobLeft = (rxVal / 100) * width;
        knobHtml = `<div class="roundness-knob" style="position:absolute; left:${knobLeft}px; top:4px; width:8px; height:8px; background:#facc15; border:1px solid #ca8a04; cursor:ew-resize; z-index:4; transform:translate(-50%, -50%) rotate(45deg); display:none;"></div>`;
      }

      el.innerHTML = `
        <div class="element-content-wrapper" style="position:absolute; inset:0; z-index:1;">
          ${svg}
        </div>
        <div class="element-text-area" contenteditable="true" style="position:absolute; inset:12px; z-index:2; display:flex; align-items:center; justify-content:center; text-align:center; font-size:12px; font-weight:700; color:#1e293b; outline:none; pointer-events:auto; word-break:break-all;">
          ${text}
        </div>
        <!-- Resize Handles -->
        <div class="resize-knob" data-dir="nw" style="position:absolute; left:-5px; top:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:nwse-resize; z-index:3; display:none;"></div>
        <div class="resize-knob" data-dir="ne" style="position:absolute; right:-5px; top:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:nesw-resize; z-index:3; display:none;"></div>
        <div class="resize-knob" data-dir="se" style="position:absolute; right:-5px; bottom:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:nwse-resize; z-index:3; display:none;"></div>
        <div class="resize-knob" data-dir="sw" style="position:absolute; left:-5px; bottom:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:nesw-resize; z-index:3; display:none;"></div>
        <div class="resize-knob" data-dir="n" style="position:absolute; left:calc(50% - 5px); top:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:ns-resize; z-index:3; display:none;"></div>
        <div class="resize-knob" data-dir="s" style="position:absolute; left:calc(50% - 5px); bottom:-5px; width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:ns-resize; z-index:3; display:none;"></div>
        <div class="resize-knob" data-dir="e" style="position:absolute; right:-5px; top:calc(50% - 5px); width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:ew-resize; z-index:3; display:none;"></div>
        <div class="resize-knob" data-dir="w" style="position:absolute; left:-5px; top:calc(50% - 5px); width:10px; height:10px; border-radius:50%; background:#2563eb; cursor:ew-resize; z-index:3; display:none;"></div>
        ${knobHtml}
      `;

      layers.appendChild(el);
      window.bindCanvasDragResize(id, el);
    });
  }
};

// -------------------------------------------------------------
// DYNAMIC TABS STATE MANAGEMENT (UP TO 10 TABS)
// -------------------------------------------------------------

// Refresh tab navigation bar layout
window.refreshTabButtonsBar = function() {
  const bar = document.getElementById('editor-tabs-bar');
  if (!bar) return;

  bar.innerHTML = serviceEditorTabs.map((tab, idx) => {
    const isActive = idx === activeEditorTabIdx;
    return `
      <div style="display:flex; align-items:center; position:relative;">
        <button class="btn btn-sm" onclick="window.loadTabEditorIndex(${idx})" style="padding:8px 16px; font-weight:700; border-radius:6px; font-size:12px; background:${isActive ? '#2563eb':'#fff'}; color:${isActive ? '#fff':'#475569'}; border:1px solid ${isActive ? '#2563eb':'#cbd5e1'}; display:flex; align-items:center; gap:6px;">
          Tab ${idx + 1}. ${tab.title}
          ${serviceEditorTabs.length > 1 ? `
            <span onclick="event.stopPropagation(); window.deleteEditorTab(${idx});" style="font-size:14px; font-weight:800; cursor:pointer; color:${isActive ? '#fff':'#94a3b8'};" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='inherit'">&times;</span>
          `:''}
        </button>
      </div>
    `;
  }).join('');
};

// Load a specific tab index content into visual tab editor
window.loadTabEditorIndex = function(idx) {
  // Save current tab content first
  window.saveCurrentActiveTabHTMLState();

  activeEditorTabIdx = idx;
  const tab = serviceEditorTabs[idx];
  
  // Set tab details in panel
  document.getElementById('editor-active-tab-num-lbl').innerText = `Tab ${idx + 1}`;
  document.getElementById('editor-active-tab-title-input').value = tab.title;

  // Switch back to visual editor mode by default
  canvasEditorModes['tabs'] = 'editor';
  const btnEditor = document.getElementById('btn-toggle-editor-mode-tabs');
  const btnHtml = document.getElementById('btn-toggle-html-mode-tabs');
  const workspace = document.getElementById('canvas-workspace-tabs');
  const textarea = document.getElementById('canvas-html-textarea-tabs');

  if (workspace && textarea) {
    workspace.style.display = 'block';
    textarea.style.display = 'none';
  }
  if (btnEditor) { btnEditor.style.background = '#2563eb'; btnEditor.style.color = 'white'; }
  if (btnHtml) { btnHtml.style.background = 'transparent'; btnHtml.style.color = '#475569'; }

  // Load content
  window.parseHtmlToCanvasWorkspace('tabs', tab.html);

  // Refresh bar
  window.refreshTabButtonsBar();
};

// Add a new tab (Max 10)
window.addEditorNewTab = function() {
  if (serviceEditorTabs.length >= 10) {
    alert("탭은 최대 10개까지만 등록 가능합니다.");
    return;
  }

  // Save current active
  window.saveCurrentActiveTabHTMLState();

  const newIdx = serviceEditorTabs.length;
  serviceEditorTabs.push({
    title: `새 탭 ${newIdx + 1}`,
    html: ""
  });

  window.loadTabEditorIndex(newIdx);
};

// Delete a tab
window.deleteEditorTab = function(idx) {
  if (serviceEditorTabs.length <= 1) {
    alert("최소 1개의 탭은 반드시 유지되어야 합니다.");
    return;
  }

  if (confirm(`'Tab ${idx + 1}. ${serviceEditorTabs[idx].title}' 탭을 삭제하시겠습니까? 삭제된 탭의 내용물은 유실됩니다.`)) {
    serviceEditorTabs.splice(idx, 1);
    
    // Normalize active index
    if (activeEditorTabIdx >= serviceEditorTabs.length) {
      activeEditorTabIdx = serviceEditorTabs.length - 1;
    }
    
    window.loadTabEditorIndex(activeEditorTabIdx);
  }
};

// Sync active tab title live
window.updateActiveTabTitle = function(val) {
  if (activeEditorTabIdx < 0 || activeEditorTabIdx >= serviceEditorTabs.length) return;
  serviceEditorTabs[activeEditorTabIdx].title = val || `탭 ${activeEditorTabIdx + 1}`;
  window.refreshTabButtonsBar();
};

// Save current tab editor state into local array variable
window.saveCurrentActiveTabHTMLState = function() {
  if (activeEditorTabIdx < 0 || activeEditorTabIdx >= serviceEditorTabs.length) return;
  
  const mode = canvasEditorModes['tabs'];
  let html = '';
  if (mode === 'html') {
    html = document.getElementById('canvas-html-textarea-tabs')?.value || '';
  } else {
    html = window.serializeCanvasWorkspace('tabs');
  }

  serviceEditorTabs[activeEditorTabIdx].html = html;
};

// -------------------------------------------------------------
// TAB MANAGER MODAL: Reorder and delete tabs
// -------------------------------------------------------------
window.openTabManagerModal = function() {
  // Sync state first
  window.saveCurrentActiveTabHTMLState();

  const modalId = 'tab-manager-modal';
  if (document.getElementById(modalId)) return;

  const modal = document.createElement("div");
  modal.id = modalId;
  modal.style = "position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px);";

  window.renderTabListInModal = function() {
    const listDiv = document.getElementById('modal-tab-reorder-list');
    if (!listDiv) return;

    listDiv.innerHTML = serviceEditorTabs.map((t, idx) => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border:1px solid #cbd5e1; border-radius:8px; background:white; font-size:13px; font-weight:700;">
        <span style="color:#0f172a;">Tab ${idx + 1}. <strong style="color:#2563eb;">${t.title}</strong></span>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-secondary btn-sm" onclick="window.moveModalTab(${idx}, -1)" ${idx === 0 ? 'disabled':''} style="padding:4px 8px;">▲ 위로</button>
          <button class="btn btn-secondary btn-sm" onclick="window.moveModalTab(${idx}, 1)" ${idx === serviceEditorTabs.length - 1 ? 'disabled':''} style="padding:4px 8px;">▼ 아래로</button>
          <button class="btn btn-sm" onclick="window.deleteModalTab(${idx})" style="background:#fee2e2; color:#991b1b; border:1px solid #fca5a5; padding:4px 8px;">삭제</button>
        </div>
      </div>
    `).join('');
  };

  modal.innerHTML = `
    <div class="config-card" style="background:white; width:500px; border-radius:12px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);">
      <div class="card-header" style="padding:16px 24px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
        <h2 style="font-size:16px; font-weight:700; margin:0;">주요내용 탭 순서/삭제 관리</h2>
        <button style="background:none; border:none; font-size:24px; cursor:pointer; color:#64748b; line-height:1;" onclick="window.closeTabManagerModal()">&times;</button>
      </div>

      <div style="padding:20px; display:flex; flex-direction:column; gap:12px; max-height:400px; overflow-y:auto;" id="modal-tab-reorder-list">
        <!-- Reorder List elements -->
      </div>

      <div style="padding:16px 24px; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; background:#f8fafc;">
        <button class="btn btn-primary" style="padding:8px 24px;" onclick="window.closeTabManagerModal()">확인 및 종료</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  window.renderTabListInModal();

  window.closeTabManagerModal = function() {
    modal.remove();
    // Refresh bar and active editor view
    window.loadTabEditorIndex(activeEditorTabIdx);
  };

  window.moveModalTab = function(idx, dir) {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= serviceEditorTabs.length) return;

    // Swap elements
    const temp = serviceEditorTabs[idx];
    serviceEditorTabs[idx] = serviceEditorTabs[targetIdx];
    serviceEditorTabs[targetIdx] = temp;

    // Adjust active tab pointer if we swapped the currently active one
    if (activeEditorTabIdx === idx) {
      activeEditorTabIdx = targetIdx;
    } else if (activeEditorTabIdx === targetIdx) {
      activeEditorTabIdx = idx;
    }

    window.renderTabListInModal();
  };

  window.deleteModalTab = function(idx) {
    if (serviceEditorTabs.length <= 1) {
      alert("최소 1개의 탭은 유지되어야 합니다.");
      return;
    }

    if (confirm(`'Tab ${idx + 1}. ${serviceEditorTabs[idx].title}' 탭을 삭제하시겠습니까?`)) {
      serviceEditorTabs.splice(idx, 1);
      
      // Normalize active index
      if (activeEditorTabIdx >= serviceEditorTabs.length) {
        activeEditorTabIdx = serviceEditorTabs.length - 1;
      }

      window.renderTabListInModal();
    }
  };
};

// -------------------------------------------------------------
// LOAD SAMPLE TEMPLATE / BULK IMPORTER
// -------------------------------------------------------------
window.loadSampleTemplate = function() {
  if (confirm("샘플 건강관리 안내 디자인 템플릿을 본문에 불러오시겠습니까?\n주의: 현재 입력되어 있는 작성물은 모두 초기화됩니다.")) {
    
    // Set Sample provided service templates
    const clientMap = { kyobo: "교보생명", dasom: "교보다솜케어", other: "A기업" };
    const clientName = clientMap[currentEditorClientId] || "헬스케어포털";

    const sampleIntro = `
<div style="position: relative; width: 100%; height: 180px; background: linear-gradient(135deg, #17B890 0%, #1e3a8a 100%); border-radius: 12px; padding: 24px; color: white; display: flex; flex-direction: column; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
  <h2 style="font-size: 26px; font-weight: 800; margin: 0 0 10px 0; letter-spacing: -1px;">건강할 땐 건강관리, 아플 땐 치료지원까지 꼼꼼하게</h2>
  <p style="font-size: 15px; margin: 0; opacity: 0.9; line-height: 1.6; font-weight: 500;">
    ${clientName} 임직원을 위한 통합 건강관리서비스 전용 라운지입니다.<br>
    전담 코칭팀과 의료 상담망을 구축하여 건강 지킴이가 되어 드립니다.
  </p>
</div>
    `.trim();

    const sampleCs = `
<div style="position: relative; width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; background: white; padding: 20px 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-between;">
  <div style="display: flex; align-items: center; gap: 16px;">
    <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(23, 184, 144, 0.1); display: flex; align-items: center; justify-content: center; color: #17B890;">
      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
    </div>
    <div>
      <div style="font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 2px;">헬스케어서비스를 이용해 보세요.</div>
      <div style="font-size: 20px; font-weight: 800; color: #1e293b;">${clientName} 헬스케어 고객센터</div>
    </div>
  </div>
  <div style="font-size: 24px; font-weight: 900; color: #2563eb; letter-spacing: -0.5px;">1588-7545</div>
</div>
    `.trim();

    const sampleTab1 = `
<div class="provided-service-fluid-frame" style="position:relative; width:100%; padding-bottom:35%; min-height:350px; background:#fff; overflow:hidden;">
  <div class="provided-service-text-bg" style="position:absolute; inset:0; padding:20px; line-height:1.6; font-size:14px; overflow-y:auto; z-index:1;">
    <h3 style="font-size: 20px; font-weight: 800; color: #7c2d12; margin-top:0; margin-bottom:12px;">평상시 일상 속 건강케어</h3>
    <p style="font-weight: 800; font-size: 15px; color: #0f172a; margin-bottom: 8px;">👩‍⚕️ 건강상담</p>
    <p style="font-size: 13.5px; color: #475569; max-width: 60%;">
      ${clientName} 헬스케어센터(1588-7545)를 통해 간호사 상담 접수 후 내과, 외과, 산부인과, 치과 등 <strong style="color:#0f172a;">14개과 진료과목 전문의 전화상담</strong>을 신속하게 무료로 제공해 드립니다.
    </p>
  </div>
  <div class="provided-service-overlay-layers" style="position:absolute; inset:0; pointer-events:none; z-index:2;">
    <!-- Absolutely layered cute medical vector illustration simulated overlay -->
    <div class="responsive-overlay-image" style="position:absolute; left:62%; top:15%; width:32%; height:65%; z-index:10; border-radius:12px; overflow:hidden; box-shadow:0 10px 15px -3px rgba(0,0,0,0.05);">
      <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600" style="width:100%; height:100%; object-fit:cover; display:block;">
    </div>
  </div>
</div>
    `.trim();

    // Ingest into visual editor directly
    window.parseHtmlToCanvasWorkspace('intro', sampleIntro);
    window.parseHtmlToCanvasWorkspace('cs', sampleCs);
    
    // Reset tabs
    serviceEditorTabs = [
      { title: "평상시 서비스", html: sampleTab1 },
      { title: "주요질병 진단 시", html: `<div style="padding:20px;"><h4 style="font-size:16px; font-weight:800; color:#1e293b; margin-top:0;">🏥 중대 질환 치료 에스코트</h4><p style="color:#64748b; font-size:13.5px; line-height:1.6;">암, 심장질환 등 중대 질병 진단 시 전문 간호사 동행 진료 가이드 제공 및 전국 명의 진료 대행 예약을 지원합니다.</p></div>` },
      { title: "건강검진", html: `<div style="padding:20px;"><h4 style="font-size:16px; font-weight:800; color:#0284c7; margin-top:0;">🔍 제휴 건강검진 할인</h4><p style="color:#64748b; font-size:13.5px; line-height:1.6;">전국 우수 제휴 센터 할인율 자동 적용 및 모바일 우대예약 시스템을 통해 간편하게 검진 일정을 관리하세요.</p></div>` }
    ];
    activeEditorTabIdx = 0;
    
    window.refreshTabButtonsBar();
    window.parseHtmlToCanvasWorkspace('tabs', serviceEditorTabs[0].html);

    // Alert toast
    if (typeof showToast !== 'undefined') {
      showToast("샘플 템플릿 로딩이 완료되었습니다.");
    }
  }
};

// -------------------------------------------------------------
// PREVIEW MODAL: Interactive PC/Mobile viewer
// -------------------------------------------------------------
window.previewProvidedService = function() {
  // Sync tabs state
  window.saveCurrentActiveTabHTMLState();

  // Grab data from current canvas states
  const introMode = canvasEditorModes['intro'];
  let introHtml = '';
  if (introMode === 'html') introHtml = document.getElementById('canvas-html-textarea-intro')?.value || '';
  else introHtml = window.serializeCanvasWorkspace('intro');

  const csMode = canvasEditorModes['cs'];
  let csHtml = '';
  if (csMode === 'html') csHtml = document.getElementById('canvas-html-textarea-cs')?.value || '';
  else csHtml = window.serializeCanvasWorkspace('cs');

  // Load preview modal
  const modalId = 'service-preview-modal';
  if (document.getElementById(modalId)) return;

  const modal = document.createElement("div");
  modal.id = modalId;
  modal.style = "position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px);";

  // Build PC & Mobile fluid interactive wrapper
  modal.innerHTML = `
    <div style="background:#fafaf9; width:1050px; height:85vh; border-radius:12px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); animation:modalFadeIn 0.3s ease-out;">
      
      <!-- Top header bar -->
      <div style="padding:16px 24px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; background:#fff; flex-shrink:0;">
        <h2 style="font-size:16px; font-weight:800; margin:0; color:#0f172a;">최종 고객 렌더링 미리보기</h2>
        
        <!-- Toggle viewports -->
        <div style="display:flex; background:#e2e8f0; border-radius:6px; padding:2px;">
          <button class="btn btn-sm" id="preview-btn-pc" onclick="window.switchPreviewViewport('pc')" style="padding:6px 16px; font-size:12px; font-weight:700; background:#2563eb; color:white; border-radius:4px;">💻 PC 모드</button>
          <button class="btn btn-sm" id="preview-btn-mobile" onclick="window.switchPreviewViewport('mobile')" style="padding:6px 16px; font-size:12px; font-weight:700; background:transparent; color:#475569; border-radius:4px;">📱 모바일 모드</button>
        </div>

        <button style="background:none; border:none; font-size:24px; cursor:pointer; color:#64748b; line-height:1;" onclick="window.closePreviewModal()">&times;</button>
      </div>

      <!-- Preview Device Container Frame -->
      <div style="flex:1; overflow:auto; padding:24px; display:flex; align-items:center; justify-content:center; background:#cbd5e1;" id="preview-viewport-frame-wrapper">
        
        <!-- PC simulated shell -->
        <div id="preview-viewport-box" style="width:100%; height:100%; max-width:1000px; background:#fff; border-radius:12px; display:flex; flex-direction:column; overflow:auto; box-shadow:0 10px 15px -3px rgba(0,0,0,0.1); transition:all 0.3s ease;">
          <div style="padding:32px; display:flex; flex-direction:column; gap:24px;">
            
            <!-- 1. Intro -->
            <div class="preview-inject-intro" style="width:100%;">
              ${introHtml}
            </div>

            <!-- 2. CS center -->
            <div class="preview-inject-cs" style="width:100%;">
              ${csHtml}
            </div>

            <!-- 3. Dynamic Tabs section -->
            <div style="width:100%;">
              <!-- Horizontal tab lists & Controls -->
              <div style="display:flex; align-items:flex-end; justify-content:space-between; border-bottom:1px solid #cbd5e1; margin-bottom:0; width:100%; position:relative; z-index:2;">
                <div style="display:flex; gap:4px; overflow-x:auto; padding:0 4px; margin:0;" id="preview-inject-tab-buttons-row">
                  ${serviceEditorTabs.map((t, idx) => {
                    const isActive = idx === 0;
                    return `
                      <button onclick="window.switchPreviewActiveTab(${idx})" class="preview-tab-btn" id="preview-tab-btn-${idx}" style="padding:12px 24px; font-size:14px; font-weight:700; border:1px solid ${isActive ? '#2563eb' : '#cbd5e1'}; border-bottom:none; cursor:pointer; background:${isActive ? '#2563eb':'#f8fafc'}; color:${isActive ? '#fff':'#64748b'}; border-top-left-radius:8px; border-top-right-radius:8px; border-bottom-left-radius:0; border-bottom-right-radius:0; transition:all 0.2s; white-space:nowrap; position:relative; z-index:${isActive ? '3' : '1'}; margin-bottom:-1px; height:48px; box-sizing:border-box;">
                        ${t.title}
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>
              
              <!-- Tab Active Content -->
              <div style="padding:24px; background:#fff; border:1px solid #cbd5e1; border-top-left-radius:0; border-top-right-radius:12px; border-bottom-left-radius:12px; border-bottom-right-radius:12px; min-height:200px; z-index:1; margin-top:-1px;" id="preview-inject-tab-body">
                ${serviceEditorTabs[0]?.html || ''}
              </div>
            </div>

          </div>
        </div>

      </div>

      <div style="padding:16px 24px; border-top:1px solid #e2e8f0; display:flex; justify-content:center; background:#fff; flex-shrink:0;">
        <button class="btn btn-secondary" style="padding:10px 40px; font-size:14px; font-weight:700;" onclick="window.closePreviewModal()">미리보기 닫기</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  window.closePreviewModal = function() {
    modal.remove();
  };

  // Switch viewport width live between PC and Mobile
  window.switchPreviewViewport = function(mode) {
    const box = document.getElementById('preview-viewport-box');
    const btnPc = document.getElementById('preview-btn-pc');
    const btnMobile = document.getElementById('preview-btn-mobile');
    if (!box) return;

    if (mode === 'pc') {
      box.style.width = '100%';
      box.style.maxWidth = '1000px';
      box.style.height = '100%';
      box.style.border = 'none';
      box.style.borderRadius = '12px';

      btnPc.style.background = '#2563eb'; btnPc.style.color = '#fff';
      btnMobile.style.background = 'transparent'; btnMobile.style.color = '#475569';
    } else {
      // Mobile iPhone aspect ratio
      box.style.width = '375px';
      box.style.maxWidth = '375px';
      box.style.height = '667px';
      box.style.border = '12px solid #1e293b'; // simulated phone border
      box.style.borderRadius = '32px';

      btnPc.style.background = 'transparent'; btnPc.style.color = '#475569';
      btnMobile.style.background = '#2563eb'; btnMobile.style.color = '#fff';
    }
  };

  // Switch tab live inside preview modal
  window.switchPreviewActiveTab = function(idx) {
    const buttons = document.querySelectorAll('.preview-tab-btn');
    buttons.forEach((btn, i) => {
      const isSelected = i === idx;
      btn.style.background = isSelected ? '#2563eb':'#f8fafc';
      btn.style.color = isSelected ? '#fff':'#64748b';
      btn.style.borderColor = isSelected ? '#2563eb':'#cbd5e1';
      btn.style.zIndex = isSelected ? '3':'1';
    });

    const body = document.getElementById('preview-inject-tab-body');
    if (body) {
      body.innerHTML = serviceEditorTabs[idx]?.html || '';
      body.style.borderTopLeftRadius = (idx === 0) ? '0px' : '12px';
    }
  };
};

// -------------------------------------------------------------
// SAVE / CANCEL OPERATIONS
// -------------------------------------------------------------

// Trigger Cancel
window.cancelProvidedServicesEdit = function() {
  if (confirm("작성중이던 제공서비스 내역을 저장하지 않고 리스트 화면으로 나가시겠습니까?")) {
    window.navigateTo('provided-services');
  }
};

// Trigger Save
window.saveProvidedServices = function() {
  // Sync tab state first
  window.saveCurrentActiveTabHTMLState();

  const isExposed = document.getElementById('editor-exposure-toggle').checked ? 'Y' : 'N';

  // Grab Intro content
  const introMode = canvasEditorModes['intro'];
  let introHtml = '';
  if (introMode === 'html') introHtml = document.getElementById('canvas-html-textarea-intro')?.value || '';
  else introHtml = window.serializeCanvasWorkspace('intro');

  // Grab CS content
  const csMode = canvasEditorModes['cs'];
  let csHtml = '';
  if (csMode === 'html') csHtml = document.getElementById('canvas-html-textarea-cs')?.value || '';
  else csHtml = window.serializeCanvasWorkspace('cs');

  // Validation checks
  if (!introHtml.trim()) {
    alert("1. 서비스 소개를 상세히 작성해주세요.");
    return;
  }
  if (!csHtml.trim()) {
    alert("2. 헬스케어 고객센터 안내를 작성해주세요.");
    return;
  }
  if (serviceEditorTabs.length === 0 || !serviceEditorTabs[0].title.trim()) {
    alert("3. 최소 1개의 서비스 주요내용 탭을 구성해주세요.");
    return;
  }

  // Get writer name from admin controls if available
  let writerName = 'Admin';
  const profileNameEl = document.querySelector('.user-controls span');
  if (profileNameEl) {
    writerName = profileNameEl.innerText.replace('님', '').trim();
  }

  // Build the saved object structure
  const formattedDateTime = (function() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  })();

  const data = getProvidedServicesData();
  data[currentEditorKey] = {
    clientId: currentEditorClientId,
    tierName: currentEditorTierName,
    exposureYn: isExposed,
    lastModified: formattedDateTime,
    writer: writerName,
    sections: {
      intro: introHtml,
      csGuide: csHtml,
      tabs: serviceEditorTabs
    }
  };

  saveProvidedServicesData(data);

  if (typeof showToast !== 'undefined') {
    showToast("제공서비스 정보가 성공적으로 저장되었습니다.");
  } else {
    alert("제공서비스 정보가 저장되었습니다.");
  }

  // Route back to list view
  setTimeout(() => {
    window.navigateTo('provided-services');
  }, 1200);
};
