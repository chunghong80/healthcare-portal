/**
 * Health Check Support Policy Management Module (검진정책관리)
 * Standalone high-fidelity interactive prototype with localStorage synchronization.
 */

// --- Initial Sample Data ---
(function initSamplePolicies() {
  const saved = localStorage.getItem('hc_checkup_policies');
  if (saved) return;

  const defaultPolicies = [
    {
      id: "policy_1",
      partnerName: "카카오",
      tierName: "임원 종합검진",
      supportMethod: "company", // company, premium, voucher, integrated_voucher
      supportType: "fixed", // fixed, full, basic
      amount: 1200000,
      applyYear: "2025",
      resAvail: "Y", // Y, N
      reserveStart: "2025-01-01",
      reserveEnd: "2025-12-31",
      checkupStart: "2025-01-01",
      checkupEnd: "2025-12-31",
      hospitalsCount: 15,
      packagesCount: 32,
      voucherUse: "-",
      status: "사용", // 사용, 미사용
      selectedTiers: ["임직원 종합검진", "임원 특별패키지"],
      selectedPackages: ["임원 특별 건강검진(남)", "임원 특별 건강검진(여)"],
      familyLimitType: "unlimited", // unlimited, limited
      familyLimitNum: 1,
      familyRelations: ["배우자", "부모"]
    },
    {
      id: "policy_2",
      partnerName: "카카오",
      tierName: "가족 우대할인",
      supportMethod: "premium",
      supportType: "fixed",
      amount: 0,
      applyYear: "2025",
      resAvail: "Y",
      reserveStart: "2025-01-01",
      reserveEnd: "2025-12-31",
      checkupStart: "2025-01-01",
      checkupEnd: "2025-12-31",
      hospitalsCount: 12,
      packagesCount: 28,
      voucherUse: "-",
      status: "사용",
      selectedTiers: ["가족 우대할인"],
      selectedPackages: ["가족 기본 건강검진(남)", "가족 기본 건강검진(여)"],
      familyLimitType: "limited",
      familyLimitNum: 2,
      familyRelations: ["배우자", "부모", "자녀"]
    },
    {
      id: "policy_3",
      partnerName: "네이버",
      tierName: "가족 우대할인",
      supportMethod: "premium",
      supportType: "fixed",
      amount: 0,
      applyYear: "2025",
      resAvail: "Y",
      reserveStart: "2025-03-01",
      reserveEnd: "2025-12-31",
      checkupStart: "2025-03-01",
      checkupEnd: "2025-12-31",
      hospitalsCount: 8,
      packagesCount: 16,
      voucherUse: "-",
      status: "사용",
      selectedTiers: ["가족 우대할인"],
      selectedPackages: ["가족 기본 건강검진(남)"],
      familyLimitType: "limited",
      familyLimitNum: 1,
      familyRelations: ["배우자"]
    },
    {
      id: "policy_4",
      partnerName: "삼성전자",
      tierName: "신규 입사자 패키지",
      supportMethod: "voucher",
      supportType: "fixed",
      amount: 500000,
      applyYear: "2025",
      resAvail: "Y",
      reserveStart: "2025-01-01",
      reserveEnd: "2027-12-31",
      checkupStart: "2025-01-01",
      checkupEnd: "2027-12-31",
      hospitalsCount: 10,
      packagesCount: 24,
      voucherUse: "사용",
      status: "미사용",
      selectedTiers: ["신규 입사자 패키지"],
      selectedPackages: ["직원 기본 종합검진(남)", "직원 기본 종합검진(여)"],
      familyLimitType: "unlimited",
      familyLimitNum: 1,
      familyRelations: []
    }
  ];

  localStorage.setItem('hc_checkup_policies', JSON.stringify(defaultPolicies));
})();

// Helper functions to manage localStorage data
function getPolicies() {
  return JSON.parse(localStorage.getItem('hc_checkup_policies') || '[]');
}

function savePolicies(policies) {
  localStorage.setItem('hc_checkup_policies', JSON.stringify(policies));
}

// Global active view state
window.currentPolicyMode = 'create';
window.editingPolicyId = null;

// Dual list modal temporary states
let tempSelectedTiers = [];
let tempSelectedPackages = [];

// -------------------------------------------------------------
// MAIN VIEW: Policy List Renderer
// -------------------------------------------------------------
window.renderSupportPolicy = function(container) {
  const policies = getPolicies();
  
  // Calculate summary counts
  const totalCount = policies.length;
  const activeCount = policies.filter(p => p.status === '사용').length;
  const inactiveCount = totalCount - activeCount;
  const companyCount = policies.filter(p => p.supportMethod === 'company').length;
  const premiumCount = policies.filter(p => p.supportMethod === 'premium').length;
  const voucherCount = policies.filter(p => p.supportMethod === 'voucher').length;
  const integratedCount = policies.filter(p => p.supportMethod === 'integrated_voucher').length;

  // Build partner filters
  const partnerSet = new Set(policies.map(p => p.partnerName));
  let partnerOptionsHtml = '<option value="all">전체</option>';
  partnerSet.forEach(p => {
    partnerOptionsHtml += `<option value="${p}">${p}</option>`;
  });

  container.innerHTML = `
    <div class="page-header" style="margin-bottom: 24px;">
      <div>
        <h1 class="page-title">지원정책 목록</h1>
        <p class="page-subtitle">제휴사별 건강검진 지원정책을 조회하고 관리할 수 있습니다.</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" style="background: white; border: 1px solid #cbd5e1; display:flex; gap:6px; align-items:center;" onclick="window.showPolicyGuide()">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          정책 운영 유형 안내
        </button>
        <button class="btn btn-primary" style="display:flex; gap:6px; align-items:center;" onclick="window.navigateTo('support-policy-create', 'create')">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          지원정책(등급) 신규 등록
        </button>
      </div>
    </div>

    <!-- Stats row -->
    <div style="display: flex; gap: 16px; margin-bottom: 24px; overflow-x: auto; padding-bottom: 8px;">
      <div class="config-card" style="flex: 1; min-width: 200px; padding: 24px; display: flex; align-items: center; justify-content: space-between; border-top: 4px solid #3b82f6;">
        <div>
          <div style="font-size: 14px; color: #475569; font-weight: 700; margin-bottom: 8px;">전체 정책</div>
          <div style="font-size: 28px; font-weight: 700; color: #0f172a;" id="summary-total">${totalCount}개</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 4px;">사용 ${activeCount}개 / 미사용 ${inactiveCount}개</div>
        </div>
        <div style="width: 48px; height: 48px; border-radius: 50%; background: #eff6ff; display: flex; align-items: center; justify-content: center; color: #3b82f6;">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </div>
      </div>
      <div class="config-card" style="flex: 1; min-width: 200px; padding: 24px; display: flex; align-items: center; justify-content: space-between; border-top: 4px solid #10b981;">
        <div>
          <div style="font-size: 14px; color: #475569; font-weight: 700; margin-bottom: 8px;">우대예약형</div>
          <div style="font-size: 28px; font-weight: 700; color: #0f172a;">${premiumCount}개</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 4px;">${totalCount > 0 ? ((premiumCount/totalCount)*100).toFixed(1) : 0}%</div>
        </div>
        <div style="width: 48px; height: 48px; border-radius: 50%; background: #dcfce7; display: flex; align-items: center; justify-content: center; color: #10b981;">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
      </div>
      <div class="config-card" style="flex: 1; min-width: 200px; padding: 24px; display: flex; align-items: center; justify-content: space-between; border-top: 4px solid #f97316;">
        <div>
          <div style="font-size: 14px; color: #475569; font-weight: 700; margin-bottom: 8px;">회사지원형</div>
          <div style="font-size: 28px; font-weight: 700; color: #0f172a;">${companyCount}개</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 4px;">${totalCount > 0 ? ((companyCount/totalCount)*100).toFixed(1) : 0}%</div>
        </div>
        <div style="width: 48px; height: 48px; border-radius: 50%; background: #ffedd5; display: flex; align-items: center; justify-content: center; color: #f97316;">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
        </div>
      </div>
      <div class="config-card" style="flex: 1; min-width: 200px; padding: 24px; display: flex; align-items: center; justify-content: space-between; border-top: 4px solid #a855f7;">
        <div>
          <div style="font-size: 14px; color: #475569; font-weight: 700; margin-bottom: 8px;">바우처형</div>
          <div style="font-size: 28px; font-weight: 700; color: #0f172a;">${voucherCount + integratedCount}개</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 4px;">${totalCount > 0 ? (((voucherCount+integratedCount)/totalCount)*100).toFixed(1) : 0}%</div>
        </div>
        <div style="width: 48px; height: 48px; border-radius: 50%; background: #f3e8ff; display: flex; align-items: center; justify-content: center; color: #a855f7;">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
        </div>
      </div>
    </div>

    <!-- Search Filter Area -->
    <div class="config-card" style="padding: 24px; margin-bottom: 24px; font-size: 13px;">
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <!-- Row 1 -->
        <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-weight: 700; width: 60px;">제휴사</span>
            <select id="filter-partner" class="form-input" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; min-width: 140px; background-color: #fff;" onchange="window.filterPoliciesList()">
              ${partnerOptionsHtml}
            </select>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-weight: 700; width: 60px;">운영 유형</span>
            <select id="filter-method" class="form-input" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; min-width: 140px; background-color: #fff;" onchange="window.filterPoliciesList()">
              <option value="all">전체</option>
              <option value="company">회사지원형</option>
              <option value="premium">우대예약형</option>
              <option value="voucher">바우처형</option>
              <option value="integrated_voucher">통합바우처형</option>
            </select>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-weight: 700; width: 50px;">등급명</span>
            <input type="text" id="filter-tier-keyword" placeholder="등급명을 입력하세요" class="form-input" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; min-width: 180px; background-color: #fff;" onkeyup="window.filterPoliciesList()">
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-weight: 700; width: 60px;">적용연도</span>
            <select id="filter-year" class="form-input" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; min-width: 100px; background-color: #fff;" onchange="window.filterPoliciesList()">
              <option value="all">전체</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-weight: 700; width: 40px;">상태</span>
            <select id="filter-status" class="form-input" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; min-width: 100px; background-color: #fff;" onchange="window.filterPoliciesList()">
              <option value="all">전체</option>
              <option value="사용">사용</option>
              <option value="미사용">미사용</option>
            </select>
          </div>
        </div>
        
        <!-- Row 2 -->
        <div style="display: flex; gap: 24px; align-items: center; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-weight: 700; width: 60px;">예약기간</span>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="date" id="filter-reserve-start" class="form-input" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; min-width: 130px; background-color: #fff;" onchange="window.filterPoliciesList()">
              <span style="color: #64748b;">~</span>
              <input type="date" id="filter-reserve-end" class="form-input" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; min-width: 130px; background-color: #fff;" onchange="window.filterPoliciesList()">
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-weight: 700; width: 60px;">검진기간</span>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="date" id="filter-checkup-start" class="form-input" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; min-width: 130px; background-color: #fff;" onchange="window.filterPoliciesList()">
              <span style="color: #64748b;">~</span>
              <input type="date" id="filter-checkup-end" class="form-input" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; min-width: 130px; background-color: #fff;" onchange="window.filterPoliciesList()">
            </div>
          </div>
          
          <div style="display: flex; gap: 8px; margin-left: auto;">
            <button class="btn" style="background: white; border: 1px solid #cbd5e1; color: #475569; padding: 8px 24px; border-radius: 6px; font-weight: 600; cursor:pointer;" onclick="window.resetPoliciesFilter()">초기화</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div style="display: block;">
      <!-- List Area -->
      <div class="config-card">
        <div class="card-header" style="display:flex; justify-content:space-between; align-items:center; padding: 20px; border-bottom: 1px solid #e2e8f0; background:#fff;">
          <div style="display: flex; gap: 8px; align-items: center;">
            <span style="font-size: 16px; font-weight: 700;">전체 목록</span>
            <span style="font-size: 13px; color: #3b82f6; background: #eff6ff; padding: 2px 8px; border-radius: 12px; font-weight: 700;" id="table-total-count">총 ${totalCount}건</span>
          </div>
          <div>
            <button class="btn btn-secondary" style="background: white; border: 1px solid #cbd5e1; display:flex; gap:6px; align-items:center; font-weight:700; color:#2563eb;" onclick="window.copySelectedPolicies()">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="stroke-width:2.5;"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7v8a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-6a2 2 0 00-2 2zM8 7H5a2 2 0 00-2 2v8a2 2 0 002 2h3"></path></svg>
              선택 정책 복사 (연도 이관)
            </button>
          </div>
        </div>
        <div style="overflow-x:auto;">
          <table style="width: 100%; text-align: left; border-collapse: collapse; font-size: 13px; min-width:1100px;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; border-top: 1px solid #e2e8f0; white-space: nowrap;">
                <th style="padding: 12px 20px; width: 40px;"><input type="checkbox" id="policy-select-all" onclick="window.toggleSelectAllPolicies(this.checked)"></th>
                <th style="padding: 12px 8px;">제휴사명</th>
                <th style="padding: 12px 8px;">등급명</th>
                <th style="padding: 12px 8px;">운영 유형</th>
                <th style="padding: 12px 8px; text-align: center;">적용연도</th>
                <th style="padding: 12px 8px; text-align: center;">예약기간</th>
                <th style="padding: 12px 8px; text-align: center;">검진기간</th>
                <th style="padding: 12px 8px; text-align: center;">연결 병원 수</th>
                <th style="padding: 12px 8px; text-align: center;">연결 패키지 수</th>
                <th style="padding: 12px 8px; text-align: center;">바우처 사용</th>
                <th style="padding: 12px 8px; text-align: center;">상태</th>
                <th style="padding: 12px 8px; text-align: center; width:150px;">관리</th>
              </tr>
            </thead>
            <tbody id="policies-tbody">
              <!-- Rendered Dynamically -->
            </tbody>
          </table>
        </div>
        
        <div style="padding: 20px; display: flex; justify-content: center; border-top: 1px solid #e2e8f0;">
          <div style="display: flex; gap: 4px;">
            <button style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid #cbd5e1; border-radius: 4px; background: white; color: #94a3b8;"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
            <button style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid #3b82f6; border-radius: 4px; background: #3b82f6; color: white;">1</button>
            <button style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid #cbd5e1; border-radius: 4px; background: white; color: #475569;">2</button>
            <button style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid #cbd5e1; border-radius: 4px; background: white; color: #475569;">3</button>
            <button style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid #cbd5e1; border-radius: 4px; background: white; color: #475569;"><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Trigger initial list render
  window.filterPoliciesList();
};

// Reset Filter Fields
window.resetPoliciesFilter = function() {
  document.getElementById('filter-partner').value = 'all';
  document.getElementById('filter-method').value = 'all';
  document.getElementById('filter-tier-keyword').value = '';
  document.getElementById('filter-year').value = 'all';
  document.getElementById('filter-status').value = 'all';
  document.getElementById('filter-reserve-start').value = '';
  document.getElementById('filter-reserve-end').value = '';
  document.getElementById('filter-checkup-start').value = '';
  document.getElementById('filter-checkup-end').value = '';
  window.filterPoliciesList();
};

// Filter policy list based on form inputs
window.filterPoliciesList = function() {
  const partner = document.getElementById('filter-partner').value;
  const method = document.getElementById('filter-method').value;
  const keyword = document.getElementById('filter-tier-keyword').value.toLowerCase().trim();
  const year = document.getElementById('filter-year').value;
  const status = document.getElementById('filter-status').value;
  const resStart = document.getElementById('filter-reserve-start').value;
  const resEnd = document.getElementById('filter-reserve-end').value;
  const chkStart = document.getElementById('filter-checkup-start').value;
  const chkEnd = document.getElementById('filter-checkup-end').value;

  const policies = getPolicies();
  const tbody = document.getElementById('policies-tbody');
  if (!tbody) return;

  const filtered = policies.filter(p => {
    if (partner !== 'all' && p.partnerName !== partner) return false;
    if (method !== 'all' && p.supportMethod !== method) return false;
    if (keyword) {
      const matchTierName = p.tierName && p.tierName.toLowerCase().includes(keyword);
      const matchSelectedTiers = p.selectedTiers && p.selectedTiers.some(t => t.toLowerCase().includes(keyword));
      if (!matchTierName && !matchSelectedTiers) return false;
    }
    if (year !== 'all' && !p.applyYear.includes(year)) return false;
    if (status !== 'all' && p.status !== status) return false;
    
    // Dates filtering
    if (resStart && p.reserveStart < resStart) return false;
    if (resEnd && p.reserveEnd > resEnd) return false;
    if (chkStart && p.checkupStart < chkStart) return false;
    if (chkEnd && p.checkupEnd > chkEnd) return false;

    return true;
  });

  document.getElementById('table-total-count').innerText = `총 ${filtered.length}건`;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="12" style="text-align:center; padding:40px; color:#64748b;">조건에 부합하는 정책 데이터가 없습니다.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    let methodBadgeColor = '';
    let methodText = '';
    if (p.supportMethod === 'company') {
      methodBadgeColor = 'background: #ffedd5; color: #c2410c;';
      methodText = '회사지원형';
    } else if (p.supportMethod === 'premium') {
      methodBadgeColor = 'background: #dcfce7; color: #15803d;';
      methodText = '우대예약형';
    } else if (p.supportMethod === 'voucher') {
      methodBadgeColor = 'background: #f3e8ff; color: #7e22ce;';
      methodText = '바우처형';
    } else if (p.supportMethod === 'integrated_voucher') {
      methodBadgeColor = 'background: #cffafe; color: #0891b2;';
      methodText = '통합바우처형';
    }

    const isUse = p.status === '사용';
    const statusBadge = `<span style="background: ${isUse ? '#dcfce7':'#f1f5f9'}; color: ${isUse ? '#15803d':'#475569'}; padding: 2px 8px; border-radius: 12px; font-size: 12px; border: 1px solid ${isUse ? '#bbf7d0':'#e2e8f0'}; font-weight:700;">${p.status}</span>`;

    let voucherBadge = '-';
    if (p.voucherUse === '사용') {
      voucherBadge = `<span style="background: #eff6ff; color: #2563eb; padding: 2px 8px; border-radius: 4px; font-size: 12px; border: 1px solid #bfdbfe; font-weight:700;">사용</span>`;
    }

    let tierNameDisplay = p.tierName;
    let tooltipTitle = '';
    if (p.selectedTiers && p.selectedTiers.length > 0) {
      tooltipTitle = p.selectedTiers.join(', ');
      if (p.selectedTiers.length > 1) {
        tierNameDisplay = `${p.selectedTiers[0]} 외 ${p.selectedTiers.length - 1}건`;
      } else {
        tierNameDisplay = p.selectedTiers[0];
      }
    }

    return `
      <tr style="border-bottom: 1px solid #e2e8f0; text-align: center;" onmouseover="this.style.backgroundColor='#f8fafc'" onmouseout="this.style.backgroundColor='transparent'">
        <td style="padding: 16px 20px;"><input type="checkbox" class="policy-row-chk" data-id="${p.id}" onclick="event.stopPropagation()"></td>
        <td style="padding: 16px 8px; text-align: left; font-weight: 700; color:#1e293b;">${p.partnerName}</td>
        <td style="padding: 16px 8px; text-align: left; font-weight: 600; color:#334155;" title="${tooltipTitle}">${tierNameDisplay}</td>
        <td style="padding: 16px 8px; text-align: left;"><span style="${methodBadgeColor} padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight:700;">${methodText}</span></td>
        <td style="padding: 16px 8px; font-weight:500;">${p.applyYear}</td>
        <td style="padding: 16px 8px; font-size:12px; color:#64748b;">${p.reserveStart} ~<br>${p.reserveEnd}</td>
        <td style="padding: 16px 8px; font-size:12px; color:#64748b;">${p.checkupStart} ~<br>${p.checkupEnd}</td>
        <td style="padding: 16px 8px; font-weight:700; color:#0f172a;">${p.hospitalsCount}</td>
        <td style="padding: 16px 8px; font-weight:700; color:#0f172a;">${p.packagesCount}</td>
        <td style="padding: 16px 8px;">${voucherBadge}</td>
        <td style="padding: 16px 8px;">${statusBadge}</td>
        <td style="padding: 16px 8px; color: #3b82f6; cursor: pointer; white-space: nowrap; font-weight:600; font-size:12px;">
          <span onclick="window.editPolicy('${p.id}')">수정</span> 
          <span style="color:#cbd5e1; margin: 0 4px;">|</span> 
          <span onclick="window.deletePolicy('${p.id}')" style="color:#ef4444;">삭제</span>
        </td>
      </tr>
    `;
  }).join('');
};

// Edit Existing Policy
window.editPolicy = function(id) {
  window.editingPolicyId = id;
  window.navigateTo('support-policy-create', 'edit');
};

// Select All/Deselect All Row Checkboxes
window.toggleSelectAllPolicies = function(checked) {
  document.querySelectorAll('.policy-row-chk').forEach(chk => {
    chk.checked = checked;
  });
};

// Copy Selected Policies (Open modal to select target year)
window.copySelectedPolicies = function() {
  const chks = document.querySelectorAll('.policy-row-chk:checked');
  const selectedIds = Array.from(chks).map(chk => chk.dataset.id);

  if (selectedIds.length === 0) {
    alert("복사할 정책을 좌측 체크박스에서 먼저 선택해주세요.");
    return;
  }

  window.openBulkCopyModal(selectedIds);
};

window.openBulkCopyModal = function(selectedIds) {
  const modalId = 'bulk-copy-modal';
  if (document.getElementById(modalId)) return;

  const policies = getPolicies();
  const selectedPolicies = policies.filter(p => selectedIds.includes(p.id));

  // Determine the default target year suggestion (max + 1)
  let maxYear = 2024;
  selectedPolicies.forEach(p => {
    const y = parseInt(p.applyYear);
    if (!isNaN(y) && y > maxYear) maxYear = y;
  });
  const defaultNextYear = maxYear + 1;

  const modal = document.createElement("div");
  modal.id = modalId;
  modal.style = "position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:2000; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px);";

  modal.innerHTML = `
    <div class="config-card" style="background:white; width:550px; border-radius:12px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1); animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
      <div class="card-header" style="padding:16px 24px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
        <h2 style="font-size:16px; font-weight:700; margin:0;">선택 정책 다른 연도로 복사 (이관)</h2>
        <button style="background:none; border:none; font-size:24px; cursor:pointer; color:#64748b; line-height:1;" onclick="window.closeBulkCopyModal()">&times;</button>
      </div>
      
      <div style="padding:24px; display:flex; flex-direction:column; gap:20px;">
        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:14px; font-size:13px; color:#1e3a8a; line-height:1.5;">
          💡 <strong>총 ${selectedPolicies.length}개</strong>의 정책이 선택되었습니다.<br>
          복사 시 선택한 신규 연도로 동일한 등급 및 패키지 설정이 복사 이관됩니다.
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          <span style="font-weight:700; font-size:14px; color:#334155;">이관 복사할 대상 연도 선택:</span>
          <select id="bulk-copy-target-year" class="form-input" style="padding:10px 14px; border:1px solid #cbd5e1; border-radius:6px; font-size:14px; font-weight:700; background-color:#fff;">
            <option value="2025" ${defaultNextYear === 2025 ? 'selected' : ''}>2025년</option>
            <option value="2026" ${defaultNextYear === 2026 ? 'selected' : ''}>2026년</option>
            <option value="2027" ${defaultNextYear === 2027 ? 'selected' : ''}>2027년</option>
            <option value="2028" ${defaultNextYear === 2028 ? 'selected' : ''}>2028년</option>
            <option value="2029" ${defaultNextYear === 2029 ? 'selected' : ''}>2029년</option>
          </select>
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          <span style="font-weight:700; font-size:13px; color:#475569;">복사 대상 정책 목록:</span>
          <div style="border:1px solid #e2e8f0; border-radius:6px; max-height:150px; overflow-y:auto; background:#f8fafc; padding:8px 12px; display:flex; flex-direction:column; gap:6px;">
            ${selectedPolicies.map(p => `
              <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:500;">
                <span style="color:#0f172a; font-weight:700;">[${p.partnerName}] ${p.tierName}</span>
                <span style="color:#64748b;">(기존: ${p.applyYear}년)</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div style="padding:16px 24px; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:12px; background:#f8fafc;">
        <button class="btn btn-secondary" style="padding:10px 24px; border-radius:6px; font-weight:700;" onclick="window.closeBulkCopyModal()">취소</button>
        <button class="btn btn-primary" style="padding:10px 32px; border-radius:6px; font-weight:700; background:#2563eb;" onclick="window.executeBulkCopy('${selectedIds.join(',')}')">이관 복사 실행</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
};

window.closeBulkCopyModal = function() {
  const modal = document.getElementById("bulk-copy-modal");
  if (modal) modal.remove();
};

window.executeBulkCopy = function(idsStr) {
  const selectedIds = idsStr.split(',');
  const targetYear = document.getElementById('bulk-copy-target-year').value;

  const policies = getPolicies();
  let copyCount = 0;

  selectedIds.forEach(id => {
    const policy = policies.find(p => p.id === id);
    if (policy) {
      const clone = JSON.parse(JSON.stringify(policy));
      clone.id = "policy_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
      clone.applyYear = targetYear;
      
      // Adjust date strings to new year
      clone.reserveStart = clone.reserveStart.replace(/^\d{4}/, targetYear);
      clone.reserveEnd = clone.reserveEnd.replace(/^\d{4}/, targetYear);
      clone.checkupStart = clone.checkupStart.replace(/^\d{4}/, targetYear);
      clone.checkupEnd = clone.checkupEnd.replace(/^\d{4}/, targetYear);

      policies.push(clone);
      copyCount++;
    }
  });

  savePolicies(policies);
  window.closeBulkCopyModal();

  // Reset headers select all checkbox
  const selectAllChk = document.getElementById('policy-select-all');
  if (selectAllChk) selectAllChk.checked = false;

  window.showToast(`${copyCount}개의 정책이 ${targetYear}년도로 이관 복사되었습니다!`);
  window.renderSupportPolicy(document.getElementById('admin-main-view'));
};

// Delete Policy
window.deletePolicy = function(id) {
  if (!confirm("이 정책을 삭제하시겠습니까?")) return;
  let policies = getPolicies();
  policies = policies.filter(p => p.id !== id);
  savePolicies(policies);
  window.showToast("정책이 정상적으로 삭제되었습니다.");
  window.renderSupportPolicy(document.getElementById('admin-main-view'));
};

// Display Type Info Dialog
window.showPolicyGuide = function() {
  alert(
    "[정책 운영 유형 상세 안내]\n\n" +
    "1. 회사지원형: 검진 비용을 회사가 전액 또는 일정 금액(정액)만큼 직접 지원하는 전통적인 복지 혜택 제도입니다.\n\n" +
    "2. 우대예약형: 지원금은 직접 나가지 않지만, 제휴된 협약 패키지 특별 할인 및 예약 대행 우대 혜택을 대상자에게 공급합니다.\n\n" +
    "3. 바우처형: 대상자 계정별로 정해진 가치의 건강 모바일 바우처(쿠폰)를 발급하여, 승인된 한도 내에서 자율 검진을 예매하도록 합니다.\n\n" +
    "4. 통합바우처형: 바우처 자금/예약 한도를 직원 본인과 가족 구성원이 공유하여 유연하게 소모할 수 있도록 통합 설계한 복합 지원책입니다."
  );
};


// -------------------------------------------------------------
// EDITOR VIEW: Policy Creation & Edit Wizard Form
// -------------------------------------------------------------
window.renderSupportPolicyCreate = function(container) {
  const isEdit = window.currentPolicyMode === 'edit';
  const policies = getPolicies();
  const policy = isEdit ? policies.find(p => p.id === window.editingPolicyId) : null;

  const pageTitle = isEdit ? '정책 상세 및 수정' : '신규 정책 등록';
  const pageSubtitle = isEdit ? '기존에 등록된 정책의 내용을 확인하고 세부 설정을 수정합니다.' : '제휴사의 새로운 지원정책을 대상자(본인, 가족)별로 순차적으로 설정합니다.';
  const btnText = isEdit ? '저장' : '등록 완료';
  const alertMsg = isEdit ? '성공적으로 수정되었습니다.' : '신규 정책이 성공적으로 등록되었습니다.';

  // Default parameters or loaded policy details
  const pYear = policy ? policy.applyYear : "2026";
  const pPartner = policy ? policy.partnerName : "";
  const pTierName = policy ? policy.tierName : "";
  const pSupportMethod = policy ? policy.supportMethod : "company";
  const pSupportType = policy ? policy.supportType : "fixed";
  const pAmount = policy ? policy.amount : 0;
  const pResAvail = policy ? policy.resAvail : "Y";
  const pFamilyLimitType = policy ? policy.familyLimitType : "unlimited";
  const pFamilyLimitNum = policy ? policy.familyLimitNum : 1;
  const pReserveStart = policy ? policy.reserveStart : "2026-01-01";
  const pReserveEnd = policy ? policy.reserveEnd : "2026-12-31";
  const pCheckupStart = policy ? policy.checkupStart : "2026-01-01";
  const pCheckupEnd = policy ? policy.checkupEnd : "2026-12-31";

  // Pre-load shuttle states
  tempSelectedTiers = policy ? [...policy.selectedTiers] : ["임직원 종합검진", "가족 우대할인"];
  tempSelectedPackages = policy ? [...policy.selectedPackages] : ["임원 특별 건강검진(남)", "임원 특별 건강검진(여)"];
  const selectedRelations = policy ? [...policy.familyRelations] : ["배우자", "부모"];

  container.innerHTML = `
    <div class="page-header" style="margin-bottom: 24px;">
      <div>
        <h1 class="page-title">${pageTitle}</h1>
        <p class="page-subtitle">${pageSubtitle}</p>
      </div>
    </div>
    
    <div class="config-card" style="padding: 24px; margin-bottom: 24px;">
      <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 20px; color: #1e293b;">STEP 1. 제휴사 및 등급 설정 선택</h2>
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-weight: 600; font-size: 14px; width: 100px;">적용 연도</span>
          <select id="policy-year" class="form-input" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; width: 120px; ${isEdit ? 'background-color: #f1f5f9;' : 'background-color: #fff;'}" ${isEdit ? 'disabled' : ''}>
            <option value="2024" ${pYear === "2024" ? "selected" : ""}>2024</option>
            <option value="2025" ${pYear === "2025" ? "selected" : ""}>2025</option>
            <option value="2026" ${pYear === "2026" ? "selected" : ""}>2026</option>
            <option value="2027" ${pYear === "2027" ? "selected" : ""}>2027</option>
          </select>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-weight: 600; font-size: 14px; width: 100px;">제휴사 선택</span>
          <div style="position: relative;">
            <input type="text" id="policy-partner" list="partner-list" class="form-input" placeholder="제휴사명을 검색하세요" value="${pPartner}" style="padding: 8px 12px 8px 32px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; width: 250px; ${isEdit ? 'background-color: #f1f5f9;' : 'background-color: #fff;'}" ${isEdit ? 'disabled' : ''}>
            <svg width="16" height="16" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" style="position: absolute; left: 10px; top: 10px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <datalist id="partner-list">
              <option value="카카오"></option>
              <option value="카카오페이"></option>
              <option value="카카오뱅크"></option>
              <option value="네이버"></option>
              <option value="네이버클라우드"></option>
              <option value="삼성전자"></option>
              <option value="삼성물산"></option>
              <option value="현대자동차"></option>
            </datalist>
          </div>
        </div>

        <div style="display: flex; gap: 12px; align-items: flex-start;">
          <span style="font-weight: 600; font-size: 14px; width: 100px; padding-top: 8px;">대상 등급</span>
          <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; gap: 8px; align-items: center;">
              <button class="btn btn-secondary" style="background: white; border: 1px solid #cbd5e1; padding: 7px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer;" onclick="window.openTierShuttleModal()">등급 상세 선택 (모달)</button>
              <span style="font-size: 13px; color: #64748b;">현재 <strong style="color:#2563eb;" id="selected-tiers-lbl">${tempSelectedTiers.length}</strong>개의 등급을 선택했습니다.</span>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px;" id="selected-tiers-container">
              ${tempSelectedTiers.map(t => `<span style="background: #eff6ff; color: #1d4ed8; padding: 4px 12px; border-radius: 16px; font-size: 13px; border: 1px solid #bfdbfe;">${t}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Duration Setting Card -->
    <div class="config-card" style="padding: 24px; margin-bottom: 24px;">
      <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 20px; color: #1e293b;">STEP 2. 운영 기간 설정</h2>
      <div style="display: flex; flex-direction: column; gap: 16px; font-size: 14px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <span style="font-weight: 600; width: 100px;">예약 가능 기간</span>
          <input type="date" id="policy-reserve-start" class="form-input" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px;" value="${pReserveStart}">
          <span>~</span>
          <input type="date" id="policy-reserve-end" class="form-input" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px;" value="${pReserveEnd}">
        </div>
        <div style="display: flex; align-items: center; gap: 16px;">
          <span style="font-weight: 600; width: 100px;">검진 수검 기간</span>
          <input type="date" id="policy-checkup-start" class="form-input" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px;" value="${pCheckupStart}">
          <span>~</span>
          <input type="date" id="policy-checkup-end" class="form-input" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px;" value="${pCheckupEnd}">
        </div>
      </div>
    </div>

    <div class="config-card" style="padding: 0; margin-bottom: 24px; overflow: hidden;">
      <div style="padding: 24px 24px 0 24px;">
        <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 20px; color: #1e293b;">STEP 3. 세부 대상자 정책 설정</h2>
        <div style="display: flex; gap: 12px; border-bottom: 1px solid #e2e8f0;" id="policy-tabs">
          <button id="tab-self" onclick="window.switchPolicyTab('self')" style="padding: 12px 24px; background: white; border: none; border-bottom: 2px solid #2563eb; color: #2563eb; font-weight: 700; cursor: pointer; font-size: 14px;">[본인]</button>
          <button id="tab-family" onclick="window.switchPolicyTab('family')" style="padding: 12px 24px; background: transparent; border: none; color: #64748b; font-weight: 600; cursor: pointer; font-size: 14px;">[가족]</button>
        </div>
      </div>
      
      <div style="padding: 24px; background: #f8fafc;">
        <h2 id="step-title" style="font-size: 16px; font-weight: 700; margin-bottom: 20px; color: #1e293b;">STEP 4. [본인] 정책 및 패키지 설정</h2>
        
        <table style="width: 100%; text-align: left; border-collapse: collapse; background: white; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px;">
          <colgroup>
            <col style="width: 180px;">
            <col>
          </colgroup>
          <tbody>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <th style="padding: 16px; background: #f1f5f9; font-weight: 600; color: #334155; border-right: 1px solid #e2e8f0;">예약 가능 여부</th>
              <td style="padding: 16px;">
                <div style="display: flex; gap: 16px;">
                  <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                    <input type="radio" name="res_avail" id="res_avail_y" value="Y" ${pResAvail === "Y" ? "checked" : ""}> 가능
                  </label>
                  <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                    <input type="radio" name="res_avail" id="res_avail_n" value="N" ${pResAvail === "N" ? "checked" : ""}> 불가능
                  </label>
                </div>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <th style="padding: 16px; background: #f1f5f9; font-weight: 600; color: #334155; border-right: 1px solid #e2e8f0;">지원 방식</th>
              <td style="padding: 16px;">
                <select id="support-method" class="form-input" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; min-width: 200px; font-size: 14px; background-color: #fff;" onchange="window.toggleSupportType()">
                  <option value="company" ${pSupportMethod === "company" ? "selected" : ""}>회사지원형</option>
                  <option value="premium" ${pSupportMethod === "premium" ? "selected" : ""}>우대예약형</option>
                  <option value="voucher" ${pSupportMethod === "voucher" ? "selected" : ""}>바우처형</option>
                  <option value="integrated_voucher" ${pSupportMethod === "integrated_voucher" ? "selected" : ""}>통합바우처형</option>
                </select>
              </td>
            </tr>
            <tr id="support-type-row" style="border-bottom: 1px solid #e2e8f0;">
              <th style="padding: 16px; background: #f1f5f9; font-weight: 600; color: #334155; border-right: 1px solid #e2e8f0;">지원 유형</th>
              <td style="padding: 16px;">
                <div style="display: flex; gap: 16px;">
                  <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                    <input type="radio" name="support_type" value="fixed" ${pSupportType === "fixed" ? "checked" : ""} onchange="window.toggleAmountPolicy()"> 정액지원
                  </label>
                  <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                    <input type="radio" name="support_type" value="full" ${pSupportType === "full" ? "checked" : ""} onchange="window.toggleAmountPolicy()"> 전액지원
                  </label>
                  <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                    <input type="radio" name="support_type" value="basic" ${pSupportType === "basic" ? "checked" : ""} onchange="window.toggleAmountPolicy()"> 기본패키지비용 지원
                  </label>
                </div>
              </td>
            </tr>
            <tr id="amount-policy-row" style="border-bottom: 1px solid #e2e8f0;">
              <th style="padding: 16px; background: #f1f5f9; font-weight: 600; color: #334155; border-right: 1px solid #e2e8f0;">금액 정책 (지원금)</th>
              <td style="padding: 16px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <input type="number" id="policy-amount" class="form-input" style="padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; width: 150px; text-align: right;" value="${pAmount}">
                  <span>원</span>
                </div>
              </td>
            </tr>
            <tr id="voucher-policy-row" style="border-bottom: 1px solid #e2e8f0; display: none;">
              <th style="padding: 16px; background: #f1f5f9; font-weight: 600; color: #334155; border-right: 1px solid #e2e8f0;">바우처 설정</th>
              <td style="padding: 16px;">
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <div id="integrated-voucher-notice" style="display: none; padding: 8px 12px; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 4px; color: #92400e; font-size: 13px; font-weight: 600;">
                    ※ 통합바우처 설정 시 바우처 비용과 기간을 가족 구성원 전체가 공유하여 사용합니다.
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 13px; font-weight: 600; width: 100px;">바우처 사용기간</span>
                    <input type="date" id="voucher-start" class="form-input" style="padding: 6px 12px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px;" value="${pReserveStart}">
                    <span>~</span>
                    <input type="date" id="voucher-end" class="form-input" style="padding: 6px 12px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px;" value="${pReserveEnd}">
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 13px; font-weight: 600; width: 100px;">바우처 비용</span>
                    <input type="number" id="voucher-amount" class="form-input" style="padding: 6px 12px; border: 1px solid #cbd5e1; border-radius: 4px; width: 150px; text-align: right;" value="${pAmount}">
                    <span>원</span>
                  </div>
                </div>
              </td>
            </tr>

            <tr id="member-policy-row" style="border-bottom: 1px solid #e2e8f0; display: none;">
              <th style="padding: 16px; background: #f1f5f9; font-weight: 600; color: #334155; border-right: 1px solid #e2e8f0;">가족 인원 정책</th>
              <td style="padding: 16px;">
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <div style="display: flex; align-items: center; gap: 16px;">
                    <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                      <input type="radio" name="family_limit_type" value="unlimited" ${pFamilyLimitType === 'unlimited' ? 'checked':''} onchange="window.toggleFamilyRelation()"> 제한없음
                    </label>
                    <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                      <input type="radio" name="family_limit_type" value="limited" ${pFamilyLimitType === 'limited' ? 'checked':''} onchange="window.toggleFamilyRelation()"> 
                      <select id="family_limit_num" class="form-input" style="padding: 4px 8px; border: 1px solid #cbd5e1; border-radius: 4px; width: 60px; font-size: 13px;" ${pFamilyLimitType === 'unlimited' ? 'disabled':''}>
                        ${[...Array(10).keys()].map(i => `<option value="${i+1}" ${pFamilyLimitNum == i+1 ? 'selected':''}>${i+1}</option>`).join('')}
                      </select> 명 제한
                    </label>
                  </div>
                  <div id="family-relation-box" style="${pFamilyLimitType === 'unlimited' ? 'display: none;':'display:block;'} padding: 12px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px;">
                    <div style="font-size: 13px; font-weight: 600; color: #1e3a8a; margin-bottom: 8px;">허용 관계 선택 (복수 선택)</div>
                    <div style="display: flex; gap: 16px;">
                      <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px;"><input type="checkbox" class="rel-chk" value="배우자" ${selectedRelations.includes("배우자") ? "checked":""}> 배우자</label>
                      <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px;"><input type="checkbox" class="rel-chk" value="부모" ${selectedRelations.includes("부모") ? "checked":""}> 부모</label>
                      <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px;"><input type="checkbox" class="rel-chk" value="형제자매" ${selectedRelations.includes("형제자매") ? "checked":""}> 형제자매</label>
                      <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px;"><input type="checkbox" class="rel-chk" value="자녀" ${selectedRelations.includes("자녀") ? "checked":""}> 자녀</label>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th style="padding: 16px; background: #f1f5f9; font-weight: 600; color: #334155; border-right: 1px solid #e2e8f0;">패키지 정책</th>
              <td style="padding: 16px;">
                <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <button class="btn btn-secondary" style="background: white; border: 1px solid #cbd5e1; padding: 7px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer;" onclick="window.openPackageShuttleModal()">패키지 상세 선택 (모달)</button>
                    <span style="font-size: 13px; color: #64748b;">현재 <strong style="color:#2563eb;" id="selected-pkgs-lbl">${tempSelectedPackages.length}</strong>개의 패키지가 선택되었습니다. (당해년도 기준)</span>
                  </div>
                  <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px;" id="selected-packages-container">
                    ${tempSelectedPackages.map(pkg => `<span style="background: #eff6ff; color: #1d4ed8; padding: 4px 12px; border-radius: 16px; font-size: 13px; border: 1px solid #bfdbfe;">${pkg}</span>`).join('')}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <button class="btn" style="background: white; border: 1px solid #cbd5e1; color: #475569; padding: 10px 24px; border-radius: 6px; font-weight: 600; cursor:pointer; display:flex; gap:6px; align-items:center;" onclick="window.navigateTo('support-policy')">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="stroke-width:2.5;"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        목록
      </button>
      <div style="display: flex; gap: 12px;">
        <button class="btn" style="background: white; border: 1px solid #cbd5e1; color: #475569; padding: 10px 24px; border-radius: 6px; font-weight: 600; cursor:pointer;" onclick="window.navigateTo('support-policy')">취소</button>
        <button class="btn" style="background: #2563eb; color: white; border: none; padding: 10px 32px; border-radius: 6px; font-weight: 600; cursor:pointer;" onclick="window.savePolicyForm('${alertMsg}')">${btnText}</button>
      </div>
    </div>
  `;

  // Trigger form elements toggling to align with loaded data
  window.toggleSupportType();
};

// -------------------------------------------------------------
// EDITOR WIZARD HELPER FUNCTIONS
// -------------------------------------------------------------
window.switchPolicyTab = function(tab) {
  const tabSelf = document.getElementById('tab-self');
  const tabFamily = document.getElementById('tab-family');
  const stepTitle = document.getElementById('step-title');
  const memberPolicyRow = document.getElementById('member-policy-row');
  
  if (tab === 'self') {
    tabSelf.style.borderBottom = '2px solid #2563eb';
    tabSelf.style.color = '#2563eb';
    tabSelf.style.fontWeight = '700';
    tabFamily.style.borderBottom = 'none';
    tabFamily.style.color = '#64748b';
    tabFamily.style.fontWeight = '600';
    stepTitle.innerText = 'STEP 4. [본인] 정책 및 패키지 설정';
    if(memberPolicyRow) memberPolicyRow.style.display = 'none';
  } else {
    tabFamily.style.borderBottom = '2px solid #2563eb';
    tabFamily.style.color = '#2563eb';
    tabFamily.style.fontWeight = '700';
    tabSelf.style.borderBottom = 'none';
    tabSelf.style.color = '#64748b';
    tabSelf.style.fontWeight = '600';
    stepTitle.innerText = 'STEP 4. [가족] 정책 및 패키지 설정';
    if(memberPolicyRow) memberPolicyRow.style.display = 'table-row';
  }
};

window.toggleSupportType = function() {
  const method = document.getElementById('support-method').value;
  const supportTypeRow = document.getElementById('support-type-row');
  const amountPolicyRow = document.getElementById('amount-policy-row');
  const voucherPolicyRow = document.getElementById('voucher-policy-row');
  const integratedNotice = document.getElementById('integrated-voucher-notice');
  
  if (method === 'company') {
    supportTypeRow.style.display = 'table-row';
    amountPolicyRow.style.display = 'table-row';
    voucherPolicyRow.style.display = 'none';
    window.toggleAmountPolicy();
  } else if (method === 'premium') {
    supportTypeRow.style.display = 'none';
    amountPolicyRow.style.display = 'none';
    voucherPolicyRow.style.display = 'none';
  } else if (method === 'voucher') {
    supportTypeRow.style.display = 'none';
    amountPolicyRow.style.display = 'none';
    voucherPolicyRow.style.display = 'table-row';
    integratedNotice.style.display = 'none';
  } else if (method === 'integrated_voucher') {
    supportTypeRow.style.display = 'none';
    amountPolicyRow.style.display = 'none';
    voucherPolicyRow.style.display = 'table-row';
    integratedNotice.style.display = 'block';
  }
};

window.toggleAmountPolicy = function() {
  const supportTypeVal = document.querySelector('input[name="support_type"]:checked').value;
  const amountPolicyRow = document.getElementById('amount-policy-row');
  if (supportTypeVal === 'fixed') {
    amountPolicyRow.style.display = 'table-row';
  } else {
    amountPolicyRow.style.display = 'none';
  }
};

window.toggleFamilyRelation = function() {
  const type = document.querySelector('input[name="family_limit_type"]:checked').value;
  const limitNum = document.getElementById('family_limit_num');
  const relationBox = document.getElementById('family-relation-box');
  if (type === 'limited') {
    limitNum.disabled = false;
    relationBox.style.display = 'block';
  } else {
    limitNum.disabled = true;
    relationBox.style.display = 'none';
  }
};

// -------------------------------------------------------------
// SAVE POLICY FORM
// -------------------------------------------------------------
window.savePolicyForm = function(alertMsg) {
  const partner = document.getElementById('policy-partner').value.trim();
  
  if (!partner) { alert("제휴사를 입력하세요."); return; }
  if (tempSelectedTiers.length === 0) { alert("대상 등급을 하나 이상 선택해 주세요 (등급 상세 선택)."); return; }

  // 대표 등급명은 선택한 대상 등급 중 첫 번째 등급을 자동으로 할당
  const tierName = tempSelectedTiers[0];

  const reserveStart = document.getElementById('policy-reserve-start').value;
  const reserveEnd = document.getElementById('policy-reserve-end').value;
  const checkupStart = document.getElementById('policy-checkup-start').value;
  const checkupEnd = document.getElementById('policy-checkup-end').value;

  const supportMethod = document.getElementById('support-method').value;
  const resAvail = document.querySelector('input[name="res_avail"]:checked').value;

  let amount = 0;
  let supportType = "fixed";

  if (supportMethod === 'company') {
    supportType = document.querySelector('input[name="support_type"]:checked').value;
    if (supportType === 'fixed') {
      amount = Number(document.getElementById('policy-amount').value) || 0;
    }
  } else if (supportMethod === 'voucher' || supportMethod === 'integrated_voucher') {
    amount = Number(document.getElementById('voucher-amount').value) || 0;
  }

  // Family details
  const familyLimitType = document.querySelector('input[name="family_limit_type"]:checked').value;
  const familyLimitNum = Number(document.getElementById('family_limit_num').value) || 1;
  
  const relations = [];
  document.querySelectorAll('.rel-chk:checked').forEach(c => {
    relations.push(c.value);
  });

  const policies = getPolicies();
  
  if (window.currentPolicyMode === 'edit') {
    const idx = policies.findIndex(p => p.id === window.editingPolicyId);
    if (idx !== -1) {
      policies[idx] = {
        ...policies[idx],
        tierName,
        supportMethod,
        supportType,
        amount,
        resAvail,
        reserveStart,
        reserveEnd,
        checkupStart,
        checkupEnd,
        selectedTiers: tempSelectedTiers,
        selectedPackages: tempSelectedPackages,
        familyLimitType,
        familyLimitNum,
        familyRelations: relations
      };
    }
  } else {
    const newPolicy = {
      id: "policy_" + Date.now(),
      partnerName: partner,
      tierName,
      supportMethod,
      supportType,
      amount,
      applyYear: document.getElementById('policy-year').value,
      resAvail,
      reserveStart,
      reserveEnd,
      checkupStart,
      checkupEnd,
      hospitalsCount: 12,
      packagesCount: tempSelectedPackages.length,
      voucherUse: (supportMethod === 'voucher' || supportMethod === 'integrated_voucher') ? '사용' : '-',
      status: "사용",
      selectedTiers: tempSelectedTiers,
      selectedPackages: tempSelectedPackages,
      familyLimitType,
      familyLimitNum,
      familyRelations: relations
    };
    policies.push(newPolicy);
  }

  savePolicies(policies);
  window.showToast(alertMsg);
  window.navigateTo('support-policy');
};


// -------------------------------------------------------------
// DUAL LIST BOX SHUTTLE MODALS (TIER AND PACKAGE SELECTION)
// -------------------------------------------------------------

// Open Target Tier Shuttle Modal
window.openTierShuttleModal = function() {
  const modal = document.createElement("div");
  modal.id = "tier-shuttle-modal";
  modal.style = "position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:2000; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px);";
  
  // High fidelity dual shuttle lists
  const allTiersList = [
    "임직원 종합검진",
    "가족 우대할인",
    "신규 입사자 패키지",
    "장기근속자 우대",
    "VIP 패키지",
    "임직원 배우자 기본검진",
    "파견근로자 기본검진",
    "해외 주재원 패키지"
  ];

  // Keep internal modal state
  let currentModalSelected = [...tempSelectedTiers];

  modal.innerHTML = `
    <div class="config-card" style="background:white; width:800px; border-radius:12px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);">
      <div class="card-header" style="padding:16px 20px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
        <h2 style="font-size:16px; font-weight:700; margin:0;">대상 등급 상세 선택</h2>
        <button style="background:none; border:none; font-size:24px; cursor:pointer; color:#64748b; line-height:1;" onclick="window.closeTierShuttleModal()">&times;</button>
      </div>
      <div style="padding:24px; display:flex; gap:20px; align-items:center;">
        <!-- Left: Available Tiers -->
        <div style="flex:1; display:flex; flex-direction:column; gap:8px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:14px; font-weight:700; color:#334155;">전체 등급</span>
            <button class="btn btn-sm" style="background:white; border:1px solid #cbd5e1; font-size:12px; padding:4px 8px; border-radius:4px; cursor:pointer; font-weight:700;" id="shuttle-tier-all-select">전체 선택</button>
          </div>
          <input type="text" id="shuttle-tier-left-search" class="form-input" placeholder="검색..." style="padding:6px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:13px;" onkeyup="renderTierShuttleLists()">
          <div style="border:1px solid #e2e8f0; border-radius:6px; height:300px; overflow-y:auto; padding:8px; background:#fff;" id="shuttle-tier-left-list">
            <!-- Dynamic elements -->
          </div>
        </div>
        
        <!-- Center: Controls -->
        <div style="display:flex; flex-direction:column; gap:12px;">
          <button style="background:white; border:1px solid #cbd5e1; padding:8px 12px; border-radius:4px; cursor:pointer; color:#475569; font-weight:700;" id="shuttle-tier-move-right">&gt;</button>
          <button style="background:white; border:1px solid #cbd5e1; padding:8px 12px; border-radius:4px; cursor:pointer; color:#475569; font-weight:700;" id="shuttle-tier-move-left">&lt;</button>
        </div>
        
        <!-- Right: Selected Tiers -->
        <div style="flex:1; display:flex; flex-direction:column; gap:8px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:14px; font-weight:700; color:#2563eb;" id="shuttle-tier-right-lbl">선택된 등급 (0)</span>
            <button class="btn btn-sm" style="background:white; border:1px solid #cbd5e1; font-size:12px; padding:4px 8px; border-radius:4px; cursor:pointer; font-weight:700;" id="shuttle-tier-all-deselect">전체 해제</button>
          </div>
          <input type="text" id="shuttle-tier-right-search" class="form-input" placeholder="검색..." style="padding:6px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:13px;" onkeyup="renderTierShuttleLists()">
          <div style="border:1px solid #2563eb; border-radius:6px; height:300px; overflow-y:auto; padding:8px; background:#eff6ff;" id="shuttle-tier-right-list">
            <!-- Dynamic elements -->
          </div>
        </div>
      </div>
      <div style="padding:16px 24px; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:12px; background:#f8fafc;">
        <button class="btn" style="background:white; border:1px solid #cbd5e1; padding:8px 24px; border-radius:6px; font-weight:700; color:#475569; cursor:pointer;" onclick="window.closeTierShuttleModal()">취소</button>
        <button class="btn" style="background:#2563eb; color:white; border:none; padding:8px 24px; border-radius:6px; font-weight:700; cursor:pointer;" id="shuttle-tier-confirm">적용하기</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  let leftSelected = null;
  let rightSelected = null;

  function renderTierShuttleLists() {
    const leftSearch = document.getElementById('shuttle-tier-left-search').value.toLowerCase();
    const rightSearch = document.getElementById('shuttle-tier-right-search').value.toLowerCase();

    const leftContainer = document.getElementById('shuttle-tier-left-list');
    const rightContainer = document.getElementById('shuttle-tier-right-list');

    // Available left = all - currentSelected
    const leftTiers = allTiersList.filter(t => !currentModalSelected.includes(t) && t.toLowerCase().includes(leftSearch));
    const rightTiers = currentModalSelected.filter(t => t.toLowerCase().includes(rightSearch));

    leftContainer.innerHTML = leftTiers.map(t => `<div class="shuttle-item" data-val="${t}" style="padding:8px 12px; font-size:13px; cursor:pointer; border-radius:4px; margin-bottom:2px; font-weight:500;">${t}</div>`).join('');
    rightContainer.innerHTML = rightTiers.map(t => `<div class="shuttle-item" data-val="${t}" style="padding:8px 12px; font-size:13px; cursor:pointer; border-radius:4px; margin-bottom:2px; font-weight:500; background:white; border:1px solid #bfdbfe;">${t}</div>`).join('');
    
    document.getElementById('shuttle-tier-right-lbl').innerText = `선택된 등급 (${currentModalSelected.length})`;

    // Rebind item clicks
    leftContainer.querySelectorAll('.shuttle-item').forEach(item => {
      item.onclick = () => {
        leftContainer.querySelectorAll('.shuttle-item').forEach(i => i.style.backgroundColor = 'transparent');
        item.style.backgroundColor = '#f1f5f9';
        leftSelected = item.dataset.val;
      };
      item.ondblclick = () => {
        currentModalSelected.push(item.dataset.val);
        renderTierShuttleLists();
      };
    });

    rightContainer.querySelectorAll('.shuttle-item').forEach(item => {
      item.onclick = () => {
        rightContainer.querySelectorAll('.shuttle-item').forEach(i => i.style.backgroundColor = 'white');
        item.style.backgroundColor = '#dbeafe';
        rightSelected = item.dataset.val;
      };
      item.ondblclick = () => {
        currentModalSelected = currentModalSelected.filter(t => t !== item.dataset.val);
        renderTierShuttleLists();
      };
    });
  }

  // Button Action Bindings
  document.getElementById('shuttle-tier-move-right').onclick = () => {
    if (leftSelected && !currentModalSelected.includes(leftSelected)) {
      currentModalSelected.push(leftSelected);
      leftSelected = null;
      renderTierShuttleLists();
    }
  };

  document.getElementById('shuttle-tier-move-left').onclick = () => {
    if (rightSelected) {
      currentModalSelected = currentModalSelected.filter(t => t !== rightSelected);
      rightSelected = null;
      renderTierShuttleLists();
    }
  };

  document.getElementById('shuttle-tier-all-select').onclick = () => {
    currentModalSelected = [...allTiersList];
    renderTierShuttleLists();
  };

  document.getElementById('shuttle-tier-all-deselect').onclick = () => {
    currentModalSelected = [];
    renderTierShuttleLists();
  };

  document.getElementById('shuttle-tier-confirm').onclick = () => {
    tempSelectedTiers = [...currentModalSelected];
    
    // Render UI list container
    const c = document.getElementById('selected-tiers-container');
    const lbl = document.getElementById('selected-tiers-lbl');
    if (c) {
      c.innerHTML = tempSelectedTiers.map(t => `<span style="background: #eff6ff; color: #1d4ed8; padding: 4px 12px; border-radius: 16px; font-size: 13px; border: 1px solid #bfdbfe;">${t}</span>`).join('');
    }
    if (lbl) lbl.innerText = tempSelectedTiers.length;

    window.closeTierShuttleModal();
  };

  renderTierShuttleLists();
};

window.closeTierShuttleModal = function() {
  const modal = document.getElementById("tier-shuttle-modal");
  if (modal) modal.remove();
};

// Open Package Shuttle Modal
window.openPackageShuttleModal = function() {
  const modal = document.createElement("div");
  modal.id = "package-shuttle-modal";
  modal.style = "position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:2000; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px);";
  
  const allPkgsList = [
    "직원 기본 종합검진(남)",
    "직원 기본 종합검진(여)",
    "임원 특별 건강검진(남)",
    "임원 특별 건강검진(여)",
    "임원 프리미엄 검진",
    "배우자 정밀 검진패키지",
    "부모님 효도 검진패키지",
    "가족 기본 건강검진(남)",
    "가족 기본 건강검진(여)"
  ];

  let currentModalSelected = [...tempSelectedPackages];

  modal.innerHTML = `
    <div class="config-card" style="background:white; width:800px; border-radius:12px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);">
      <div class="card-header" style="padding:16px 20px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
        <h2 style="font-size:16px; font-weight:700; margin:0;">대상 패키지 상세 선택</h2>
        <button style="background:none; border:none; font-size:24px; cursor:pointer; color:#64748b; line-height:1;" onclick="window.closePackageShuttleModal()">&times;</button>
      </div>
      <div style="padding:12px 24px; background:#fffbeb; border-bottom:1px solid #fef3c7; color:#92400e; font-size:13px; font-weight:700;">
        ※ 기본 조건: 당해년도(2026년) 기준으로 제휴사에 등록된 패키지만 호출됩니다.
      </div>
      <div style="padding:24px; display:flex; gap:20px; align-items:center;">
        <!-- Left: Available Packages -->
        <div style="flex:1; display:flex; flex-direction:column; gap:8px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:14px; font-weight:700; color:#334155;">등록 패키지 목록</span>
            <button class="btn btn-sm" style="background:white; border:1px solid #cbd5e1; font-size:12px; padding:4px 8px; border-radius:4px; cursor:pointer; font-weight:700;" id="shuttle-pkg-all-select">전체 선택</button>
          </div>
          <input type="text" id="shuttle-pkg-left-search" class="form-input" placeholder="패키지명 검색..." style="padding:6px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:13px;" onkeyup="renderPkgShuttleLists()">
          <div style="border:1px solid #e2e8f0; border-radius:6px; height:300px; overflow-y:auto; padding:8px; background:#fff;" id="shuttle-pkg-left-list">
            <!-- Dynamic elements -->
          </div>
        </div>
        
        <!-- Center: Controls -->
        <div style="display:flex; flex-direction:column; gap:12px;">
          <button style="background:white; border:1px solid #cbd5e1; padding:8px 12px; border-radius:4px; cursor:pointer; color:#475569; font-weight:700;" id="shuttle-pkg-move-right">&gt;</button>
          <button style="background:white; border:1px solid #cbd5e1; padding:8px 12px; border-radius:4px; cursor:pointer; color:#475569; font-weight:700;" id="shuttle-pkg-move-left">&lt;</button>
        </div>
        
        <!-- Right: Selected Packages -->
        <div style="flex:1; display:flex; flex-direction:column; gap:8px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:14px; font-weight:700; color:#2563eb;" id="shuttle-pkg-right-lbl">선택된 패키지 (0)</span>
            <button class="btn btn-sm" style="background:white; border:1px solid #cbd5e1; font-size:12px; padding:4px 8px; border-radius:4px; cursor:pointer; font-weight:700;" id="shuttle-pkg-all-deselect">전체 해제</button>
          </div>
          <input type="text" id="shuttle-pkg-right-search" class="form-input" placeholder="패키지명 검색..." style="padding:6px 12px; border:1px solid #cbd5e1; border-radius:4px; font-size:13px;" onkeyup="renderPkgShuttleLists()">
          <div style="border:1px solid #2563eb; border-radius:6px; height:300px; overflow-y:auto; padding:8px; background:#eff6ff;" id="shuttle-pkg-right-list">
            <!-- Dynamic elements -->
          </div>
        </div>
      </div>
      <div style="padding:16px 24px; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:12px; background:#f8fafc;">
        <button class="btn" style="background:white; border:1px solid #cbd5e1; padding:8px 24px; border-radius:6px; font-weight:700; color:#475569; cursor:pointer;" onclick="window.closePackageShuttleModal()">취소</button>
        <button class="btn" style="background:#2563eb; color:white; border:none; padding:8px 24px; border-radius:6px; font-weight:700; cursor:pointer;" id="shuttle-pkg-confirm">적용하기</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  let leftSelected = null;
  let rightSelected = null;

  function renderPkgShuttleLists() {
    const leftSearch = document.getElementById('shuttle-pkg-left-search').value.toLowerCase();
    const rightSearch = document.getElementById('shuttle-pkg-right-search').value.toLowerCase();

    const leftContainer = document.getElementById('shuttle-pkg-left-list');
    const rightContainer = document.getElementById('shuttle-pkg-right-list');

    const leftPkgs = allPkgsList.filter(t => !currentModalSelected.includes(t) && t.toLowerCase().includes(leftSearch));
    const rightPkgs = currentModalSelected.filter(t => t.toLowerCase().includes(rightSearch));

    leftContainer.innerHTML = leftPkgs.map(t => `<div class="shuttle-item" data-val="${t}" style="padding:8px 12px; font-size:13px; cursor:pointer; border-radius:4px; margin-bottom:2px; font-weight:500;">${t}</div>`).join('');
    rightContainer.innerHTML = rightPkgs.map(t => `<div class="shuttle-item" data-val="${t}" style="padding:8px 12px; font-size:13px; cursor:pointer; border-radius:4px; margin-bottom:2px; font-weight:500; background:white; border:1px solid #bfdbfe;">${t}</div>`).join('');
    
    document.getElementById('shuttle-pkg-right-lbl').innerText = `선택된 패키지 (${currentModalSelected.length})`;

    leftContainer.querySelectorAll('.shuttle-item').forEach(item => {
      item.onclick = () => {
        leftContainer.querySelectorAll('.shuttle-item').forEach(i => i.style.backgroundColor = 'transparent');
        item.style.backgroundColor = '#f1f5f9';
        leftSelected = item.dataset.val;
      };
      item.ondblclick = () => {
        currentModalSelected.push(item.dataset.val);
        renderPkgShuttleLists();
      };
    });

    rightContainer.querySelectorAll('.shuttle-item').forEach(item => {
      item.onclick = () => {
        rightContainer.querySelectorAll('.shuttle-item').forEach(i => i.style.backgroundColor = 'white');
        item.style.backgroundColor = '#dbeafe';
        rightSelected = item.dataset.val;
      };
      item.ondblclick = () => {
        currentModalSelected = currentModalSelected.filter(t => t !== item.dataset.val);
        renderPkgShuttleLists();
      };
    });
  }

  document.getElementById('shuttle-pkg-move-right').onclick = () => {
    if (leftSelected && !currentModalSelected.includes(leftSelected)) {
      currentModalSelected.push(leftSelected);
      leftSelected = null;
      renderPkgShuttleLists();
    }
  };

  document.getElementById('shuttle-pkg-move-left').onclick = () => {
    if (rightSelected) {
      currentModalSelected = currentModalSelected.filter(t => t !== rightSelected);
      rightSelected = null;
      renderPkgShuttleLists();
    }
  };

  document.getElementById('shuttle-pkg-all-select').onclick = () => {
    currentModalSelected = [...allPkgsList];
    renderPkgShuttleLists();
  };

  document.getElementById('shuttle-pkg-all-deselect').onclick = () => {
    currentModalSelected = [];
    renderPkgShuttleLists();
  };

  document.getElementById('shuttle-pkg-confirm').onclick = () => {
    tempSelectedPackages = [...currentModalSelected];
    
    const c = document.getElementById('selected-packages-container');
    const lbl = document.getElementById('selected-pkgs-lbl');
    if (c) {
      c.innerHTML = tempSelectedPackages.map(t => `<span style="background: #eff6ff; color: #1d4ed8; padding: 4px 12px; border-radius: 16px; font-size: 13px; border: 1px solid #bfdbfe;">${t}</span>`).join('');
    }
    if (lbl) lbl.innerText = tempSelectedPackages.length;

    window.closePackageShuttleModal();
  };

  renderPkgShuttleLists();
};

window.closePackageShuttleModal = function() {
  const modal = document.getElementById("package-shuttle-modal");
  if (modal) modal.remove();
};
