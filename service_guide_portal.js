/**
 * Customer Portal Service Guide Rendering Module
 * Detects the logged-in user's active client and membership tier,
 * reads the registered provided-service configurations from localStorage,
 * and renders a high-quality responsive page with dynamic tabs and styled layouts.
 */

window.renderServiceGuidePortal = function(container) {
  if (!container) return;

  const client = typeof state !== 'undefined' && state.activeClient ? state.activeClient : { id: 'kyobo', name: '교보생명' };
  const user = typeof state !== 'undefined' && state.currentUser ? state.currentUser : { id: 'user1', name: '홍길동', tiers: { kyobo: ['기본플랜'] } };
  
  // Find current user's tiers for active client
  const userTiers = user.tiers && user.tiers[client.id] ? user.tiers[client.id] : [];
  
  // Search registered service guide data matching user's tier
  const data = JSON.parse(localStorage.getItem('hc_provided_services') || '{}');
  let matchedService = null;
  let matchedKey = '';

  const getTierName = (t) => {
    if (!t) return "";
    if (typeof t === 'string') return t;
    if (typeof t === 'object') {
      return t.name || t.tierName || t.label || t.id || String(t);
    }
    return String(t);
  };

  for (let tier of userTiers) {
    const tName = getTierName(tier);
    const key = `${client.id}|${tName}`;
    if (data[key] && data[key].exposureYn === 'Y') {
      matchedService = data[key];
      matchedKey = key;
      break;
    }
  }

  // Fallback: If no custom service is registered, load default template based on client
  if (!matchedService) {
    const clientName = client.name.split('(')[0].trim();
    const defaultTier = userTiers[0] ? getTierName(userTiers[0]) : '기본등급';
    
    matchedService = {
      clientId: client.id,
      tierName: defaultTier,
      exposureYn: "Y",
      sections: {
        intro: `
          <div style="position: relative; width: 100%; height: 180px; background: linear-gradient(135deg, #17B890 0%, #0f172a 100%); border-radius: 12px; padding: 24px; color: white; display: flex; flex-direction: column; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
            <h2 style="font-size: 24px; font-weight: 800; margin: 0 0 10px 0; letter-spacing: -1px;">${clientName} 임직원형 헬스케어서비스</h2>
            <p style="font-size: 14.5px; margin: 0; opacity: 0.95; line-height: 1.6; font-weight: 500;">
              평상시 건강 유지 관리부터 중대 질병 진단 시 전문 진료 예약까지 든든하게!<br>
              ${clientName} 회원전용 헬스케어 라운지 서비스를 만나보세요.
            </p>
          </div>
        `,
        csGuide: `
          <div style="position: relative; width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; background: white; padding: 20px 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(23, 184, 144, 0.1); display: flex; align-items: center; justify-content: center; color: #17B890;">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </div>
              <div>
                <div style="font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 2px;">헬스케어서비스 콜센터</div>
                <div style="font-size: 20px; font-weight: 800; color: #1e293b;">${clientName} 고객센터</div>
              </div>
            </div>
            <div style="font-size: 24px; font-weight: 900; color: #2563eb; letter-spacing: -0.5px;">1588-7545</div>
          </div>
        `,
        tabs: [
          {
            title: "평상시 일상 속 건강케어",
            html: `
              <div class="provided-service-fluid-frame" style="position:relative; width:100%; padding-bottom:35%; min-height:300px; background:#fff; overflow:hidden;">
                <div class="provided-service-text-bg" style="position:absolute; inset:0; padding:20px; line-height:1.6; font-size:14px; overflow-y:auto; z-index:1;">
                  <h3 style="font-size: 20px; font-weight: 800; color: #7c2d12; margin-top:0; margin-bottom:12px;">평상시 서비스</h3>
                  <p style="font-weight: 800; font-size: 15px; color: #0f172a; margin-bottom: 8px;">👩‍⚕️ 건강상담</p>
                  <p style="font-size: 13.5px; color: #475569; max-width: 60%;">
                    전담 헬스케어센터(1588-7545)를 통해 전문간호사와 간편하게 건강 상담을 진행할 수 있으며, 24시간 항시 대기 의료상담망을 전격 지원합니다.
                  </p>
                </div>
                <div class="provided-service-overlay-layers" style="position:absolute; inset:0; pointer-events:none; z-index:2;">
                  <div class="responsive-overlay-image" style="position:absolute; left:62%; top:15%; width:32%; height:70%; z-index:10; border-radius:12px; overflow:hidden; box-shadow:0 10px 15px -3px rgba(0,0,0,0.05);">
                    <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600" style="width:100%; height:100%; object-fit:cover; display:block;">
                  </div>
                </div>
              </div>
            `
          }
        ]
      }
    };
  }

  const serviceTabs = matchedService.sections.tabs || [];
  
  // Render main portal template structure
  container.innerHTML = `
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

    <div style="display:flex; flex-direction:column; gap:32px; animation: fadeIn 0.4s ease-out;">
      
      <!-- 1. 서비스 소개 Banner -->
      <div id="portal-service-intro-container" style="width:100%;">
        ${matchedService.sections.intro}
      </div>

      <!-- 2. 고객센터 안내 Card -->
      <div id="portal-service-cs-container" style="width:100%;">
        ${matchedService.sections.csGuide}
      </div>

      <!-- 3. 서비스 주요내용 Tabbed Area -->
      <div style="width:100%;">
        <div style="font-size:16px; font-weight:800; color:#0f172a; margin-bottom:16px; display:flex; align-items:center; gap:8px;">
          <span style="display:inline-block; width:4px; height:16px; background:var(--theme-color); border-radius:100px;"></span>
          서비스 주요내용
        </div>

        <!-- Dynamic horizontal tab buttons & Nav Controls -->
        <div style="display: flex; align-items: flex-end; justify-content: space-between; border-bottom: 1px solid #cbd5e1; margin-bottom: 0; width: 100%; position: relative; z-index: 2;">
          <div class="portal-service-tab-btn-wrapper" id="portal-service-tabs-bar">
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

              const isActive = idx === 0;
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

        <!-- Dynamic active tab content panel -->
        <div id="portal-service-tab-content-panel" style="background:#fff; border:1px solid #cbd5e1; border-top-left-radius: 0px; border-top-right-radius: 16px; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; padding:24px; min-height:300px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.02); position:relative; overflow:hidden; z-index:1; margin-top:-1px;">
          ${serviceTabs[0] ? serviceTabs[0].html : '<div style="padding:40px; text-align:center; color:#94a3b8;">제공 내용이 없습니다.</div>'}
        </div>
      </div>

    </div>
  `;

  // Function to switch active tab contents dynamically
  window.switchPortalServiceTab = function(idx) {
    const tabs = matchedService.sections.tabs || [];
    if (idx < 0 || idx >= tabs.length) return;

    // Toggle button active classes and SVG colors
    const buttons = container.querySelectorAll('.portal-service-tab-btn');
    buttons.forEach((btn, i) => {
      const iconSpan = btn.querySelector('.portal-service-tab-icon');
      if (i === idx) {
        btn.classList.add('active');
        if (iconSpan) iconSpan.style.color = 'white';
      } else {
        btn.classList.remove('active');
        if (iconSpan) {
          const tabTitle = tabs[i].title;
          let iconColor = '#3b82f6';
          if (tabTitle.includes('평상시') || tabTitle.includes('일상')) iconColor = '#f97316';
          else if (tabTitle.includes('질병') || tabTitle.includes('진단') || tabTitle.includes('명의') || tabTitle.includes('케어')) iconColor = '#8b5cf6';
          else if (tabTitle.includes('검진')) iconColor = '#ec4899';
          else if (tabTitle.includes('심리')) iconColor = '#a855f7';
          iconSpan.style.color = iconColor;
        }
      }
    });

    // Inject selected HTML content
    const panel = document.getElementById('portal-service-tab-content-panel');
    if (panel) {
      panel.innerHTML = tabs[idx].html;
      panel.style.borderTopLeftRadius = (idx === 0) ? '0px' : '16px';
      
      // Make layered overlays interactive or adjust styles if needed
      // (E.g. disabling pointer-events inside the layers in the portal guarantees standard scrolling)
      const layers = panel.querySelector('.provided-service-overlay-layers');
      if (layers) {
        layers.style.pointerEvents = 'none';
      }
    }
  };

  window.scrollPortalTabs = function(direction) {
    const wrapper = container.querySelector('.portal-service-tab-btn-wrapper');
    if (wrapper) {
      wrapper.scrollBy({ left: direction * 150, behavior: 'smooth' });
    }
  };
};
