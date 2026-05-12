// Mock Data for Admin Panel (Similar to app.js structure, representing DB state)
let adminClientConfigs = {
  kyobo: {
    id: "kyobo",
    name: "교보생명 (kyobo)",
    serviceName: "교보생명",
    csNumber: "1588-1001",
    clientLink: "",
    dasomLink: "",
    heroText: {
      title: "건강한 내일을 위한 첫걸음",
      subtitle: "교보생명 전용 헬스케어 포털에서 제공하는 프리미엄 건강 관리 서비스를 지금 바로 경험해보세요."
    },
    menuLabels: {
      healthConsulting: "교보 건강상담",
      hospitalGuide: "맞춤 병원안내",
      medicalAppt: "교보 진료예약",
      checkupAppt: "프리미엄 건강검진",
      healthInfo: "건강 매거진",
      psyCare: "마음 힐링케어",
      serviceGuide: "서비스 안내"
    },
    menuVisibility: {
      healthConsulting: true,
      hospitalGuide: true,
      medicalAppt: true,
      checkupAppt: true,
      healthInfo: true,
      psyCare: true,
      serviceGuide: true
    }
  },
  dasom: {
    id: "dasom",
    name: "교보다솜케어 (dasom)",
    serviceName: "교보다솜케어",
    csNumber: "1588-1002",
    clientLink: "",
    dasomLink: "",
    heroText: {
      title: "더 건강한 삶, 교보다솜케어",
      subtitle: "고객님의 평생 건강 파트너, 교보다솜케어가 프리미엄 서비스를 시작합니다."
    },
    menuLabels: {
      healthConsulting: "건강상담",
      hospitalGuide: "병원안내",
      medicalAppt: "진료예약",
      checkupAppt: "건강검진 우대예약",
      healthInfo: "건강정보",
      psyCare: "심리상담",
      serviceGuide: "서비스 안내"
    },
    menuVisibility: {
      healthConsulting: true,
      hospitalGuide: true,
      medicalAppt: true,
      checkupAppt: true,
      healthInfo: true,
      psyCare: false, // Default hidden for dasom in previous spec
      serviceGuide: true
    }
  },
  other: {
    id: "other",
    name: "A기업 (제휴사)",
    serviceName: "A기업",
    csNumber: "1588-1003",
    clientLink: "",
    dasomLink: "",
    heroText: {
      title: "임직원 복지 라운지",
      subtitle: "A기업 임직원만을 위한 프리미엄 건강 관리 혜택을 만나보세요."
    },
    menuLabels: {
      healthConsulting: "임직원 건강상담",
      hospitalGuide: "제휴 병원안내",
      medicalAppt: "진료예약",
      checkupAppt: "종합건강검진",
      healthInfo: "오피스 헬스매거진",
      psyCare: "마음건강클리닉",
      serviceGuide: "서비스 안내"
    },
    menuVisibility: {
      healthConsulting: true,
      hospitalGuide: true,
      medicalAppt: true,
      checkupAppt: true,
      healthInfo: true,
      psyCare: true,
      serviceGuide: true
    }
  }
};

// Default system menu info
const systemMenus = {
  healthConsulting: { defaultName: "건강상담" },
  hospitalGuide: { defaultName: "병원안내" },
  medicalAppt: { defaultName: "진료예약" },
  checkupAppt: { defaultName: "건강검진 예약" },
  healthInfo: { defaultName: "건강정보" },
  psyCare: { defaultName: "심리케어" },
  serviceGuide: { defaultName: "서비스 안내" }
};

let currentClientId = "kyobo";

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  const savedData = localStorage.getItem('hc_portal_data');
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      // Merge with default mock to ensure no fields are missing
      for(let k in parsed) {
        if(adminClientConfigs[k]) {
          adminClientConfigs[k].menuLabels = parsed[k].menuLabels || adminClientConfigs[k].menuLabels;
          adminClientConfigs[k].heroText = parsed[k].heroText || adminClientConfigs[k].heroText;
          adminClientConfigs[k].menuVisibility = parsed[k].menuVisibility || adminClientConfigs[k].menuVisibility;
          if (parsed[k].serviceName !== undefined) adminClientConfigs[k].serviceName = parsed[k].serviceName;
          if (parsed[k].csNumber !== undefined) adminClientConfigs[k].csNumber = parsed[k].csNumber;
          if (parsed[k].clientLink !== undefined) adminClientConfigs[k].clientLink = parsed[k].clientLink;
          if (parsed[k].dasomLink !== undefined) adminClientConfigs[k].dasomLink = parsed[k].dasomLink;
        }
      }
    } catch(e) {}
  }
  
  initSelect();
  loadClientSettings();
});

function initSelect() {
  const select = document.getElementById("client-select");
  select.innerHTML = "";
  
  Object.values(adminClientConfigs).forEach(client => {
    const option = document.createElement("option");
    option.value = client.id;
    option.textContent = client.name;
    select.appendChild(option);
  });
}

function loadClientSettings() {
  const select = document.getElementById("client-select");
  currentClientId = select.value;
  
  const clientConfig = adminClientConfigs[currentClientId];
  const container = document.getElementById("menu-table-container");
  
  // Reset animation
  container.classList.remove("fade-in");
  void container.offsetWidth; // trigger reflow
  container.classList.add("fade-in");
  
  let html = '<div class="menu-grid">';
  
  Object.keys(systemMenus).forEach(key => {
    const sysName = systemMenus[key].defaultName;
    const customName = clientConfig.menuLabels[key];
    const isVisible = clientConfig.menuVisibility[key];
    
    html += `
      <div class="menu-row ${!isVisible ? 'disabled' : ''}" id="row-${key}">
        <div class="menu-info">
          <span class="menu-id">${key}</span>
          <span class="menu-default-name">${sysName} (기본 명칭)</span>
        </div>
        <div class="menu-input-wrapper">
          <input type="text" class="form-input" id="input-${key}" value="${customName}" placeholder="노출할 메뉴명을 입력하세요" ${!isVisible ? 'disabled' : ''}>
        </div>
        <div class="menu-action">
          <span class="toggle-label" id="label-${key}">${isVisible ? '노출' : '숨김'}</span>
          <label class="switch">
            <input type="checkbox" id="toggle-${key}" ${isVisible ? 'checked' : ''} onchange="toggleVisibility('${key}')">
            <span class="slider"></span>
          </label>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
  
  // Load hero texts
  const heroTitleInput = document.getElementById('input-heroTitle');
  const heroSubtitleInput = document.getElementById('input-heroSubtitle');
  if (heroTitleInput && heroSubtitleInput) {
    heroTitleInput.value = clientConfig.heroText.title;
    heroSubtitleInput.value = clientConfig.heroText.subtitle;
  }
  
  // Load CS and Footer links
  const csNameInput = document.getElementById('input-csName');
  const csNumberInput = document.getElementById('input-csNumber');
  const clientLinkInput = document.getElementById('input-clientLink');
  const dasomLinkInput = document.getElementById('input-dasomLink');
  
  if (csNameInput) csNameInput.value = clientConfig.serviceName || '';
  if (csNumberInput) csNumberInput.value = clientConfig.csNumber || '';
  if (clientLinkInput) clientLinkInput.value = clientConfig.clientLink || '';
  if (dasomLinkInput) dasomLinkInput.value = clientConfig.dasomLink || '';
}

window.toggleVisibility = function(key) {
  const isChecked = document.getElementById(`toggle-${key}`).checked;
  const label = document.getElementById(`label-${key}`);
  const row = document.getElementById(`row-${key}`);
  const input = document.getElementById(`input-${key}`);
  
  if (isChecked) {
    label.textContent = "노출";
    row.classList.remove("disabled");
    input.disabled = false;
  } else {
    label.textContent = "숨김";
    row.classList.add("disabled");
    input.disabled = true;
  }
};

window.saveSettings = function() {
  const clientConfig = adminClientConfigs[currentClientId];
  
  Object.keys(systemMenus).forEach(key => {
    const inputVal = document.getElementById(`input-${key}`).value;
    const isVisible = document.getElementById(`toggle-${key}`).checked;
    
    clientConfig.menuLabels[key] = inputVal;
    clientConfig.menuVisibility[key] = isVisible;
  });
  
  // Save hero texts
  const heroTitleInput = document.getElementById('input-heroTitle');
  const heroSubtitleInput = document.getElementById('input-heroSubtitle');
  if (heroTitleInput && heroSubtitleInput) {
    clientConfig.heroText.title = heroTitleInput.value;
    clientConfig.heroText.subtitle = heroSubtitleInput.value;
  }

  // Save CS and Footer links
  const csNameInput = document.getElementById('input-csName');
  const csNumberInput = document.getElementById('input-csNumber');
  const clientLinkInput = document.getElementById('input-clientLink');
  const dasomLinkInput = document.getElementById('input-dasomLink');
  
  if (csNameInput) clientConfig.serviceName = csNameInput.value;
  if (csNumberInput) clientConfig.csNumber = csNumberInput.value;
  if (clientLinkInput) clientConfig.clientLink = clientLinkInput.value;
  if (dasomLinkInput) clientConfig.dasomLink = dasomLinkInput.value;
  
  localStorage.setItem('hc_portal_data', JSON.stringify(adminClientConfigs));
  
  showToast(`[${clientConfig.name}] 메뉴 설정이 성공적으로 저장되었습니다.`);
};

function showToast(message) {
  const container = document.getElementById("toast-container");
  
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg class="toast-icon" fill="currentColor" viewBox="0 0 20 20" width="24" height="24"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
    <span class="toast-msg">${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.animation = "fadeOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards";
    setTimeout(() => {
      if(container.contains(toast)) {
        container.removeChild(toast);
      }
    }, 300);
  }, 3000);
}
