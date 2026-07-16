$ErrorActionPreference = "Stop"

$appContent = Get-Content -Path m_app.js -Raw -Encoding UTF8

$targetConditionals = @'
    const isConsultingGroup = state.activeMenuId === 'healthConsulting' || activeMenu?.id === 'healthConsulting' || pageTitle.includes('상담');
    const isHistoryPage = state.activeSubId === 'consultHistory' || activeSub?.id === 'consultHistory' || state.activeSubId === 'history' || activeSub?.id === 'history' || ((pageTitle.includes('이력') || pageTitle.includes('내역')) && !pageTitle.includes('검진'));
    const isCheckupHistoryPage = state.activeSubId === 'checkupHistory' || activeSub?.id === 'checkupHistory' || state.activeSubSubId === 'checkupHistory' || activeSubSub?.id === 'checkupHistory' || pageTitle.includes('신청이력');
    const isHospitalGuideGroup = state.activeMenuId === 'hospitalGuide' || activeMenu?.id === 'hospitalGuide' || pageTitle.includes('병원안내');
    const isMedicalApptGroup = state.activeMenuId === 'medicalAppt' || activeMenu?.id === 'medicalAppt' || pageTitle.includes('진료예약');
    const isCheckupGroup = state.activeMenuId === 'checkupAppt' || activeMenu?.id === 'checkupAppt' || pageTitle.includes('건강검진');
'@

$replConditionals = @'
    const isConsultingGroup = state.activeMenuId === 'healthConsulting' || activeMenu?.id === 'healthConsulting' || pageTitle.includes('상담') || pageTitle.includes('진료예약') || pageTitle.includes('병원안내');
    const isHistoryPage = state.activeSubId === 'consultHistory' || activeSub?.id === 'consultHistory' || state.activeSubId === 'history' || activeSub?.id === 'history' || ((pageTitle.includes('이력') || pageTitle.includes('내역')) && !pageTitle.includes('검진'));
    const isCheckupHistoryPage = state.activeSubId === 'checkupHistory' || activeSub?.id === 'checkupHistory' || state.activeSubSubId === 'checkupHistory' || activeSubSub?.id === 'checkupHistory' || pageTitle.includes('신청이력');
    const isSearchGroup = state.activeMenuId === 'search' || activeMenu?.id === 'search' || pageTitle.includes('병원검색');
    const isCheckupGroup = state.activeMenuId === 'checkupAppt' || activeMenu?.id === 'checkupAppt' || pageTitle.includes('건강검진');
'@

if ($appContent.Contains($targetConditionals)) {
    $appContent = $appContent.Replace($targetConditionals, $replConditionals)
} else {
    $targetConditionalsLf = $targetConditionals.Replace("`r`n", "`n")
    $replConditionalsLf = $replConditionals.Replace("`r`n", "`n")
    $appContent = $appContent.Replace($targetConditionalsLf, $replConditionalsLf)
}

$startMarker = "} else if (isConsultingGroup) {"
$endMarker = "} else if (state.activeSubId === searchSubId) {"

$startIndex = $appContent.IndexOf($startMarker)
$endIndex = $appContent.IndexOf($endMarker, $startIndex)

if ($startIndex -ge 0 -and $endIndex -gt $startIndex) {
    $prefix = $appContent.Substring(0, $startIndex)
    $suffix = $appContent.Substring($endIndex)
    
    $newConsultingBlock = @'
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
            flex: 1; padding: 12px 10px; font-size: 14px; font-weight: 700; border: 1px solid #cbd5e1; border-bottom: none;
            background: #f8fafc; color: #475569; border-top-left-radius: 12px; border-top-right-radius: 12px;
            cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px;
            position: relative; z-index: 1; margin-bottom: -1px; height: 50px;
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
          <div style="padding:24px 20px; background:white; border:1px solid #cbd5e1; border-top:none; border-bottom-left-radius:16px; border-bottom-right-radius:16px; animation:fadeIn 0.3s ease;">
            <div class="consulting-info" style="margin-bottom:24px;">
              <img src="./images/health_counseling.png" class="content-hero-img" alt="건강상담" onerror="this.src='https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200'" style="width:100%; border-radius:12px; margin-bottom:20px;">
              <h3 style="font-size:20px; font-weight:800; color:#1e293b; margin-bottom:16px;">건강상담 서비스</h3>
              <p style="color:#334155; line-height:1.6; font-size:15px; margin-bottom:20px;">
                건강에 대한 궁금증부터 생활습관 관리까지, 다양한 분야의 전문가가 맞춤형 상담을 제공합니다.
              </p>
              <div style="background:#f1f5f9; padding:16px; border-radius:12px; margin-bottom:24px; font-size:13px; color:#475569; line-height:1.6;">
                간호사, 영양사, 운동처방사는 물론 각 분야 전문의 상담을 통해 일상 속 건강 고민을 편리하게 상담받으실 수 있습니다.
              </div>
              <button class="auth-btn btn-primary" style="padding:14px; font-size:16px; width:100%; border-radius:12px;" onclick="toggleConsultingForm()">건강상담 신청하기</button>
            </div>
            
            <div id="consulting-form-area" style="display:none; padding-top:24px; border-top:1px solid #e2e8f0; animation: fadeIn 0.4s ease;">
              <h4 style="margin-bottom:16px; font-size:16px; color:#1e293b; font-weight:700;">상담 신청 정보 입력</h4>
              <div class="consult-type-selector" style="margin-bottom:16px; display:flex; gap:16px;">
                <label class="custom-radio">
                  <input type="radio" name="consult-type" value="phone" checked onclick="updateConsultType('phone')">
                  <span class="radio-mark"></span> 전화상담
                </label>
                <label class="custom-radio">
                  <input type="radio" name="consult-type" value="online" onclick="updateConsultType('online')">
                  <span class="radio-mark"></span> 온라인 문의
                </label>
              </div>
              <div style="display:grid; grid-template-columns: 1fr; gap:16px; margin-bottom:16px;">
                <div class="form-group">
                  <label class="form-label" style="display:block; margin-bottom:6px; font-weight:600; font-size:14px;">상담 희망 일자</label>
                  <input type="date" id="consult-date" class="form-input" min="${new Date().toISOString().split('T')[0]}" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:8px;">
                </div>
                <div class="form-group">
                  <label class="form-label" style="display:block; margin-bottom:6px; font-weight:600; font-size:14px;">상담 희망 시간</label>
                  <select id="consult-time" class="form-input" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:8px; background:white;">
                    <option value="anytime">전일 (언제든 통화 가능)</option>
                    <option value="09:00">09:00</option><option value="10:00">10:00</option><option value="11:00">11:00</option><option value="12:00">12:00</option>
                    <option value="13:00">13:00</option><option value="14:00">14:00</option><option value="15:00">15:00</option><option value="16:00">16:00</option><option value="17:00">17:00</option>
                  </select>
                </div>
              </div>
              <div class="form-group" style="margin-bottom:20px;">
                <label class="form-label" style="display:block; margin-bottom:6px; font-weight:600; font-size:14px;">상담 내용</label>
                <textarea id="consult-memo" class="form-input" placeholder="상담하실 내용을 적어주세요." style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:8px; min-height:100px; resize:vertical;"></textarea>
              </div>
              <button class="auth-btn btn-primary" style="width:100%; padding:14px; border-radius:12px; font-size:16px;" onclick="submitConsulting()">신청 완료</button>
            </div>
          </div>
        `;
      } else if (currentTab === 'appt') {
        tabContent = `
          <div style="padding:24px 20px; background:white; border:1px solid #cbd5e1; border-top:none; border-bottom-left-radius:16px; border-bottom-right-radius:16px; animation:fadeIn 0.3s ease;">
            <div class="consulting-info" style="margin-bottom:24px;">
              <div class="hg-hero-badge" style="background:#f3e8ff; color:#7e22ce; padding:4px 10px; border-radius:6px; font-weight:700; font-size:13px; display:inline-block; margin-bottom:12px;">진료예약 서비스</div>
              <h3 style="font-size:20px; font-weight:800; color:#1e293b; margin-bottom:16px;">원활하고 빠른 진료예약을 도와드립니다</h3>
              <p style="color:#334155; line-height:1.6; font-size:15px; margin-bottom:20px;">
                원하시는 병원과 의료진을 선택하시면 신속하게 예약을 대행해 드립니다.
              </p>
              <div style="background:#f8fafc; padding:16px; border-radius:12px; margin-bottom:24px; font-size:13px; color:#475569; line-height:1.6; border-left:4px solid #8b5cf6;">
                협력 병원 네트워크를 통해 우선 예약 혜택을 제공합니다. (단, 병원 사정에 따라 일정이 지연될 수 있습니다.)
              </div>
              <button class="auth-btn btn-primary" style="background:#8b5cf6; padding:14px; font-size:16px; width:100%; border-radius:12px; box-shadow:0 4px 12px rgba(139,92,246,0.3);" onclick="document.getElementById('appt-form-area').style.display='block'">진료예약 신청하기</button>
            </div>
            
            <div id="appt-form-area" style="display:none; padding-top:24px; border-top:1px solid #e2e8f0; animation: fadeIn 0.4s ease;">
              <h4 style="margin-bottom:16px; font-size:16px; color:#1e293b; font-weight:700;">진료예약 정보 입력</h4>
              <div style="display:grid; grid-template-columns: 1fr; gap:16px; margin-bottom:16px;">
                <div class="form-group">
                  <label class="form-label" style="display:block; margin-bottom:6px; font-weight:600; font-size:14px;">희망 진료일자</label>
                  <input type="date" id="consult-date" class="form-input" min="${new Date().toISOString().split('T')[0]}" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:8px;">
                </div>
                <div class="form-group">
                  <label class="form-label" style="display:block; margin-bottom:6px; font-weight:600; font-size:14px;">선호 시간대</label>
                  <select id="consult-time" class="form-input" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:8px; background:white;">
                    <option value="anytime">상관없음</option>
                    <option value="morning">오전 (09:00~12:00)</option>
                    <option value="afternoon">오후 (13:00~17:00)</option>
                  </select>
                </div>
              </div>
              <div class="form-group" style="margin-bottom:20px;">
                <label class="form-label" style="display:block; margin-bottom:6px; font-weight:600; font-size:14px;">증상 및 희망 병원</label>
                <textarea id="consult-memo" class="form-input" placeholder="증상이나 희망하시는 특정 병원을 적어주세요." style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:8px; min-height:100px; resize:vertical;"></textarea>
              </div>
              <button class="auth-btn btn-primary" style="background:#8b5cf6; width:100%; padding:14px; border-radius:12px; font-size:16px;" onclick="submitConsulting()">예약 대행 신청 완료</button>
            </div>
          </div>
        `;
      } else if (currentTab === 'expert') {
        tabContent = `
          <div style="padding:24px 20px; background:white; border:1px solid #cbd5e1; border-top:none; border-bottom-left-radius:16px; border-bottom-right-radius:16px; animation:fadeIn 0.3s ease;">
            <div class="consulting-info" style="margin-bottom:24px;">
              <div class="hg-hero-badge" style="background:#dcfce7; color:#15803d; padding:4px 10px; border-radius:6px; font-weight:700; font-size:13px; display:inline-block; margin-bottom:12px;">병원안내 서비스</div>
              <h3 style="font-size:20px; font-weight:800; color:#1e293b; margin-bottom:16px;">최적의 병원과 전문의료진을 안내해 드립니다</h3>
              <p style="color:#334155; line-height:1.6; font-size:15px; margin-bottom:20px;">
                건강 상태와 증상에 따라 간호사가 적절한 병원과 의료진을 추천해 드립니다. 
              </p>
              
              <div style="display:flex; justify-content:space-between; align-items:center; margin:20px 0; background:#f8fafc; padding:16px; border-radius:12px; border:1px solid #e2e8f0;">
                <div style="text-align:center; flex:1;">
                  <div style="width:40px; height:40px; margin:0 auto 8px; background:#dcfce7; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#16a34a; font-size:18px;">📞</div>
                  <div style="font-weight:700; font-size:11px;">상담 신청</div>
                </div>
                <div style="color:#cbd5e1; font-size:12px;">▶</div>
                <div style="text-align:center; flex:1;">
                  <div style="width:40px; height:40px; margin:0 auto 8px; background:#dcfce7; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#16a34a; font-size:18px;">👩‍⚕️</div>
                  <div style="font-weight:700; font-size:11px;">간호사 상담</div>
                </div>
                <div style="color:#cbd5e1; font-size:12px;">▶</div>
                <div style="text-align:center; flex:1;">
                  <div style="width:40px; height:40px; margin:0 auto 8px; background:#dcfce7; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#16a34a; font-size:18px;">🏥</div>
                  <div style="font-weight:700; font-size:11px;">병원 안내</div>
                </div>
              </div>
              
              <button class="auth-btn btn-primary" style="background:#10b981; padding:14px; font-size:16px; width:100%; border-radius:12px; box-shadow:0 4px 12px rgba(16,185,129,0.3);" onclick="document.getElementById('expert-form-area').style.display='block'">상담 신청하기</button>
            </div>
            
            <div id="expert-form-area" style="display:none; padding-top:24px; border-top:1px solid #e2e8f0; animation: fadeIn 0.4s ease;">
              <h4 style="margin-bottom:16px; font-size:16px; color:#1e293b; font-weight:700;">전문의료진 안내 상담 신청</h4>
              <div style="display:grid; grid-template-columns: 1fr; gap:16px; margin-bottom:16px;">
                <div class="form-group">
                  <label class="form-label" style="display:block; margin-bottom:6px; font-weight:600; font-size:14px;">상담 희망 일자</label>
                  <input type="date" id="consult-date" class="form-input" min="${new Date().toISOString().split('T')[0]}" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:8px;">
                </div>
                <div class="form-group">
                  <label class="form-label" style="display:block; margin-bottom:6px; font-weight:600; font-size:14px;">상담 희망 시간</label>
                  <select id="consult-time" class="form-input" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:8px; background:white;">
                    <option value="anytime">전일 (언제든 통화 가능)</option>
                    <option value="09:00">09:00</option><option value="10:00">10:00</option><option value="11:00">11:00</option><option value="12:00">12:00</option>
                    <option value="13:00">13:00</option><option value="14:00">14:00</option><option value="15:00">15:00</option><option value="16:00">16:00</option><option value="17:00">17:00</option>
                  </select>
                </div>
              </div>
              <div class="form-group" style="margin-bottom:20px;">
                <label class="form-label" style="display:block; margin-bottom:6px; font-weight:600; font-size:14px;">증상 내용</label>
                <textarea id="consult-memo" class="form-input" placeholder="안내받고 싶으신 진료 분야나 증상을 적어주세요." style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:8px; min-height:100px; resize:vertical;"></textarea>
              </div>
              <button class="auth-btn btn-primary" style="background:#10b981; width:100%; padding:14px; border-radius:12px; font-size:16px;" onclick="submitConsulting()">상담 신청 완료</button>
            </div>
          </div>
        `;
      }

      detailContentHtml = `
        <div style="max-width:900px; margin:0 auto; padding:16px 0;">
          ${renderTabNav()}
          ${tabContent}
        </div>
      `;
'@

    $appContent = $prefix + $newConsultingBlock + "`r`n" + $suffix
    [System.IO.File]::WriteAllText("m_app.js", $appContent, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "m_app.js tabs successfully applied!"
} else {
    Write-Host "Could not find start or end markers for isConsultingGroup block!"
}
