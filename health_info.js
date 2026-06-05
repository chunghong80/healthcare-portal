// --- Global Variables & State ---
let activeTabId = 'categories';
let healthCategories = [];
let healthPosts = {};
let clickLogs = [];
let activeCategoryFilter = 'all';

// Editor state
let activeEditPost = null; // null if creating a new post
let currentEditorCategoryId = '';
let canvasEditorModes = { content: 'editor' };

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  switchMainTab('categories');
});

// Switch Main tabs
window.switchMainTab = function(tabId) {
  activeTabId = tabId;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick').includes(tabId));
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === `tab-${tabId}`);
  });

  if (tabId === 'categories') {
    renderCategoriesTab();
  } else if (tabId === 'articles') {
    renderArticlesTab();
  } else if (tabId === 'statistics') {
    renderStatisticsTab();
  }
};

// --- Icon and Details Helpers ---
function getHealthIcon(iconType) {
  if (iconType && iconType.length <= 4) {
    return `
      <div style="
        width: 36px; 
        height: 36px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 20px; 
        background: rgba(14, 165, 233, 0.08); 
        border-radius: 50%;
        margin: 0 auto;
      ">
        ${iconType}
      </div>
    `;
  }

  switch(iconType) {
    case 'women_health':
      return `
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block; margin:0 auto;">
          <circle cx="24" cy="18" r="10" stroke="#f472b6" stroke-width="3" stroke-linecap="round"/>
          <path d="M24 28V42M18 35H30" stroke="#f472b6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 18C12 11.3726 17.3726 6 24 6" stroke="#ec4899" stroke-width="3" stroke-linecap="round"/>
        </svg>
      `;
    case 'men_health':
      return `
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block; margin:0 auto;">
          <circle cx="20" cy="28" r="10" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
          <path d="M27 21L38 10M30 10H38V18" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20 18C25.5228 18 30 22.4772 30 28" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/>
        </svg>
      `;
    case 'senior_health':
      return `
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block; margin:0 auto;">
          <path d="M16 28C16 22 20.5 17 24 17C27.5 17 32 22 32 28" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round"/>
          <circle cx="17" cy="30" r="4" stroke="#a78bfa" stroke-width="2"/>
          <circle cx="31" cy="30" r="4" stroke="#a78bfa" stroke-width="2"/>
          <path d="M21 30H27" stroke="#8b5cf6" stroke-width="2"/>
          <path d="M24 8V17M20 11H28" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round"/>
        </svg>
      `;
    case 'child_health':
      return `
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block; margin:0 auto;">
          <circle cx="24" cy="20" r="9" stroke="#10b981" stroke-width="3"/>
          <path d="M14 36C14 30.5 18.5 29 24 29C29.5 29 34 30.5 34 36" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
          <path d="M20 16C20 16 22 18 24 18C26 18 28 16 28 16" stroke="#059669" stroke-width="2" stroke-linecap="round"/>
          <circle cx="16" cy="10" r="2" fill="#10b981"/>
          <circle cx="32" cy="10" r="2" fill="#10b981"/>
        </svg>
      `;
    case 'pregnancy':
      return `
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block; margin:0 auto;">
          <path d="M20 8C20 11 18 13 18 15C18 19 25 21 25 27C25 32 20 37 20 40" stroke="#f97316" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M25 21C29.4183 21 33 24.5817 33 29C33 33.4183 29.4183 37 25 37" stroke="#ea580c" stroke-width="3" stroke-linecap="round"/>
          <path d="M23 29C23 27.9 23.9 27 25 27C26.1 27 27 27.9 27 29C27 30.1 26.1 31 25 31" fill="#f97316"/>
        </svg>
      `;
    case 'obesity':
      return `
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block; margin:0 auto;">
          <rect x="8" y="10" width="32" height="28" rx="6" stroke="#06b6d4" stroke-width="3"/>
          <circle cx="24" cy="24" r="8" stroke="#06b6d4" stroke-width="3"/>
          <path d="M24 24L28 18" stroke="#0891b2" stroke-width="3" stroke-linecap="round"/>
          <path d="M14 10V14M34 10V14" stroke="#06b6d4" stroke-width="2"/>
        </svg>
      `;
    case 'alcohol':
      return `
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block; margin:0 auto;">
          <path d="M16 10H24V28H16V10Z" stroke="#f59e0b" stroke-width="3" stroke-linejoin="round"/>
          <path d="M20 10V6H20" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
          <path d="M28 24H38V28H28" stroke="#b45309" stroke-width="2" stroke-linecap="round"/>
          <path d="M38 24L38 32" stroke="#b45309" stroke-width="2" stroke-linecap="round"/>
          <line x1="33" y1="28" x2="33" y2="34" stroke="#d97706" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;
    case 'cancer':
      return `
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block; margin:0 auto;">
          <path d="M16 40C16 30 20 22 24 14C28 22 32 30 32 40" stroke="#a855f7" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M14 30C18 30 21 22 24 14C27 22 30 30 34 30" stroke="#a855f7" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    case 'dementia':
      return `
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block; margin:0 auto;">
          <path d="M24 40C17.5 40 14 36 14 29C14 26 15 24 17 22C16 18 19 12 24 12C29 12 32 18 31 22C33 24 34 26 34 29C34 36 30.5 40 24 40Z" stroke="#ec4899" stroke-width="3" stroke-linejoin="round"/>
          <path d="M24 12V40" stroke="#ec4899" stroke-width="2"/>
          <path d="M19 28H29" stroke="#db2777" stroke-width="2"/>
        </svg>
      `;
    default:
      return `
        <div style="
          width: 36px; 
          height: 36px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 20px; 
          background: rgba(148, 163, 184, 0.08); 
          border-radius: 50%;
          margin: 0 auto;
        ">
          📂
        </div>
      `;
  }
}

function getFallbackDetailHTML(summary) {
  return `
    <p>${summary}</p>
    <p>본 정보는 독자들의 이해를 돕기 위해 작성된 일반적인 건강 관리 가이드라인입니다. 개개인의 고유한 체질과 기존 기저 질환, 현재의 신체 상태에 따라 효과적인 관리법과 영양 섭취 기준은 크게 다를 수 있습니다.</p>
    <h5 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 20px 0 10px 0;">일상에서의 주요 수칙</h5>
    <p>균형 잡힌 식단과 하루 30분 이상의 가벼운 유산소 운동을 실천하고, 스트레스를 조절하며 규칙적으로 수면을 취하는 것은 모든 건강 관리의 가장 기본적이고 강력한 기초입니다.</p>
    <p>만약 일상생활에 지장을 줄 정도의 심한 통증이나 갑작스러운 이상 증상이 지속된다면, 민간요법이나 인터넷 검색에만 의존하지 마시고 즉시 가까운 병원을 찾아 전문 의료진의 진료와 정밀 검사를 받으시길 권장합니다.</p>
  `;
}

// --- Data Loading & Saving ---
function loadData() {
  // 1. Categories
  const savedCategories = localStorage.getItem('hc_health_categories');
  let loadedCategories = null;
  try {
    if (savedCategories) {
      loadedCategories = JSON.parse(savedCategories);
    }
  } catch (e) {
    console.error('Error parsing categories:', e);
  }

  // Detect if categories are old (e.g. fewer than 9 categories, or using old Korean icons)
  const isOldCategories = !loadedCategories || 
    loadedCategories.length < 9 || 
    loadedCategories.some(cat => cat.icon === '여성건강' || cat.icon === '남성건강' || cat.icon === '노인건강');

  if (isOldCategories) {
    healthCategories = [
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
    localStorage.setItem('hc_health_categories', JSON.stringify(healthCategories));
  } else {
    healthCategories = loadedCategories;
  }

  // 2. Posts
  const savedPosts = localStorage.getItem('hc_health_posts_by_cat');
  let loadedPosts = null;
  try {
    if (savedPosts) {
      loadedPosts = JSON.parse(savedPosts);
    }
  } catch (e) {
    console.error('Error parsing posts:', e);
  }

  // Detect if posts are old (e.g. missing some of the 9 categories)
  const isOldPosts = !loadedPosts || 
    Object.keys(loadedPosts).length < 9 || 
    !loadedPosts.child || 
    !loadedPosts.pregnancy || 
    !loadedPosts.obesity || 
    !loadedPosts.alcohol || 
    !loadedPosts.cancer || 
    !loadedPosts.dementia;

  if (isOldPosts || isOldCategories) {
    healthPosts = {
      women: [
        { 
          id: 'w1', 
          title: '여성에게 자주 발생하는 빈혈, 원인과 예방법', 
          summary: '빈혈은 여성에게 흔하게 나타나는 질환 중 하나입니다. 특히 생리, 임신, 출산 등으로 인해 철분이 부족해지기 쉬우며, 피로감, 어지러움, 두통 등의 증상을 유발할 수 있습니다. 균형 잡힌 식사와 적절한 철분 섭취가 중요합니다.', 
          date: '2026-06-03', 
          views: 1254, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: `
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
          `
        },
        { 
          id: 'w2', 
          title: '갱년기 증상, 이렇게 관리해보세요', 
          summary: '갱년기는 여성의 삶에서 자연스러운 변화 과정입니다. 안면홍조, 불면, 우울감 등이 나타날 수 있으며, 규칙적인 운동과 건강한 식습관, 스트레스 관리가 증상 완화에 도움이 됩니다.', 
          date: '2026-06-04', 
          views: 982, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: `
            <p>갱년기는 여성의 난소 기능이 노화되면서 여성호르몬 분비가 급격히 감소하고, 이로 인해 생리 폐경을 전후한 수년간의 과도기를 뜻합니다. 보통 40대 중후반에 시작하여 신체적, 정신적으로 급격한 변화를 겪게 됩니다.</p>
            <h5 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 20px 0 10px 0;">주요 신체 및 심리 증상</h5>
            <p>가장 흔한 급성 증상은 '안면홍조'와 '발한'입니다. 갑자기 얼굴과 상체가 화끈거리며 땀이 비 오듯 쏟아집니다. 또한 호르몬 변화로 인한 자율신경 불균형으로 불면증, 감정 변화(우울감, 짜증), 기억력 감퇴 등을 겪게 되며, 장기적으로는 골다공증과 심혈관 질환 위험이 증가합니다.</p>
            <h5 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 20px 0 10px 0;">명쾌한 관리 가이드</h5>
            <ul style="padding-left: 20px; line-height: 1.8;">
              <li><strong>규칙적인 유산소 및 근력 운동:</strong> 뼈 건강을 지키고 우울감을 낮추는 데 걷기, 자전거, 요가가 훌륭한 대안입니다.</li>
              <li><strong>식습관 개선:</strong> 콩, 석류 등 천연 식물성 에스트로겐이 풍부한 식품과 칼슘, 비타민D를 충분히 섭취하세요.</li>
              <li><strong>적절한 수면 환경:</strong> 방을 시원하게 유지하고 얇은 옷을 여러 겹 입어 체온 변화에 대처하세요.</li>
            </ul>
          `
        },
        { 
          id: 'w3', 
          title: '자궁경부암 예방접종, 언제 맞아야 할까요?', 
          summary: '자궁경부암은 예방이 가능한 대표적인 암입니다. HPV 예방접종은 성 경험 전 접종이 가장 효과적이며, 정기적인 검진도 매우 중요합니다.', 
          date: '2026-06-01', 
          views: 1102, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('자궁경부암은 예방이 가능한 대표적인 암입니다. HPV 예방접종은 성 경험 전 접종이 가장 효과적이며, 정기적인 검진도 매우 중요합니다.')
        },
        { 
          id: 'w4', 
          title: '여성 건강을 위한 필수 영양소', 
          summary: '여성의 건강 유지를 위해서는 철분, 칼슘, 비타민D, 엽산 등의 섭취가 중요합니다. 연령대별로 필요한 영양소를 확인하고, 식단을 통해 골고루 섭취하세요.', 
          date: '2026-05-28', 
          views: 843, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('여성의 건강 유지를 위해서는 철분, 칼슘, 비타민D, 엽산 등의 섭취가 중요합니다. 연령대별로 필요한 영양소를 확인하고, 식단을 통해 골고루 섭취하세요.')
        },
        { 
          id: 'w5', 
          title: '생리통 완화에 도움이 되는 생활습관', 
          summary: '생리통은 많은 여성들이 겪는 불편함입니다. 따뜻한 찜질, 가벼운 스트레칭, 카페인 줄이기 등의 생활습관 개선으로 통증을 완화할 수 있습니다.', 
          date: '2026-05-25', 
          views: 732, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('생리통은 많은 여성들이 겪는 불편함입니다. 따뜻한 찜질, 가벼운 스트레칭, 카페인 줄이기 등의 생활습관 개선으로 통증을 완화할 수 있습니다.')
        },
        { 
          id: 'w6', 
          title: '여성 유방 건강과 자가 진단법', 
          summary: '유방암은 유방 건강을 해치는 주된 원인 중 하나입니다. 한 달에 한 번 생리가 끝난 후 3~5일 사이에 유방을 만져보며 멍울이 있는지 정기적으로 확인하는 습관이 필요합니다.', 
          date: '2026-05-20', 
          views: 612, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('유방암은 유방 건강을 해치는 주된 원인 중 하나입니다. 한 달에 한 번 생리가 끝난 후 3~5일 사이에 유방을 만져보며 멍울이 있는지 정기적으로 확인하는 습관이 필요합니다.')
        }
      ],
      men: [
        { 
          id: 'm1', 
          title: '남성 갱년기 극복을 위한 생활 수칙', 
          summary: '남성도 나이가 들면서 테스토스테론 호르몬 감소로 갱년기를 겪을 수 있습니다. 무기력감, 근력 저하 등이 나타나며 규칙적인 근력 운동과 충분한 수면이 예방에 필수적입니다.', 
          date: '2026-06-04', 
          views: 884, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('남성도 나이가 들면서 테스토스테론 호르몬 감소로 갱년기를 겪을 수 있습니다. 무기력감, 근력 저하 등이 나타나며 규칙적인 근력 운동과 충분한 수면이 예방에 필수적입니다.')
        },
        { 
          id: 'm2', 
          title: '전립선비대증, 방치하면 안 되는 이유', 
          summary: '전립선비대증은 50대 이상 남성에게 흔한 질환으로, 소변 줄기가 약해지거나 자주 마려운 증상을 보입니다. 초기 치료를 통해 요폐 등의 합병증을 막아야 합니다.', 
          date: '2026-06-01', 
          views: 941, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('전립선비대증은 50대 이상 남성에게 흔한 질환으로, 소변 줄기가 약해지거나 자주 마려운 증상을 보입니다. 초기 치료를 통해 요폐 등의 합병증을 막아야 합니다.')
        },
        { 
          id: 'm3', 
          title: '젊은 탈모 환자 급증, 원인과 치료법은?', 
          summary: '탈모는 유전적 요인 외에도 스트레스, 영양 불균형 등으로 발생합니다. 조기 진단과 치료약 복용이 가장 효과적이며 자가 치료에 의존하지 말아야 합니다.', 
          date: '2026-05-29', 
          views: 1205, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('탈모는 유전적 요인 외에도 스트레스, 영양 불균형 등으로 발생합니다. 조기 진단과 치료약 복용이 가장 효과적이며 자가 치료에 의존하지 말아야 합니다.')
        },
        { 
          id: 'm4', 
          title: '남성의 심장 건강을 지키는 식습관', 
          summary: '심혈관 질환은 남성 사망 원인의 큰 비중을 차지합니다. 포화지방 섭취를 줄이고 오메가-3가 풍부한 생선과 채소 위주의 식단을 구성하는 것이 도움이 됩니다.', 
          date: '2026-05-26', 
          views: 654, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('심혈관 질환은 남성 사망 원인의 큰 비중을 차지합니다. 포화지방 섭취를 줄이고 오메가-3가 풍부한 생선과 채소 위주의 식단을 구성하는 것이 도움이 됩니다.')
        }
      ],
      senior: [
        { 
          id: 's1', 
          title: '어르신 낙상 사고 예방을 위한 가정 내 환경 개선', 
          summary: '노년기 낙상은 단순한 골절을 넘어 심각한 합병증으로 이어질 수 있습니다. 화장실 미끄럼 방지 매트 설치, 문턱 제거, 야간 조명 설치가 필수적입니다.', 
          date: '2026-06-05', 
          views: 1109, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('노년기 낙상은 단순한 골절을 넘어 심각한 합병증으로 이어질 수 있습니다. 화장실 미끄럼 방지 매트 설치, 문턱 제거, 야간 조명 설치가 필수적입니다.')
        },
        { 
          id: 's2', 
          title: '근감소증 예방을 위한 단백질 섭취 가이드', 
          summary: '나이가 들면서 근육량이 급격히 감소하는 근감소증은 낙상과 대사질환의 원인이 됩니다. 매끼 단백질을 섭취하고 가벼운 저항성 운동을 병행해야 합니다.', 
          date: '2026-06-02', 
          views: 823, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('나이가 들면서 근육량이 급격히 감소하는 근감소증은 낙상과 대사질환의 원인이 됩니다. 매끼 단백질을 섭취하고 가벼운 저항성 운동을 병행해야 합니다.')
        },
        { 
          id: 's3', 
          title: '노년기 외로움과 우울증 대처 방법', 
          summary: '은퇴와 사회적 관계 축소는 노인 우울증의 주원인입니다. 주기적인 야외 활동과 지역 커뮤니티 참여, 가족들과의 대화가 정신 건강을 지켜줍니다.', 
          date: '2026-05-30', 
          views: 592, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('은퇴와 사회적 관계 축소는 노인 우울증의 주원인입니다. 주기적인 야외 활동과 지역 커뮤니티 참여, 가족들과의 대화가 정신 건강을 지켜줍니다.')
        }
      ],
      child: [
        { 
          id: 'c1', 
          title: '우리 아이 면역력 키우는 5가지 습관', 
          summary: '환절기마다 감기에 걸리는 아이를 위해 충분한 수면, 균형 잡힌 영양 섭취, 실내 습도 조절, 주기적인 야외 활동 등으로 기초 면역력을 높여주어야 합니다.', 
          date: '2026-06-04', 
          views: 1045, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('환절기마다 감기에 걸리는 아이를 위해 충분한 수면, 균형 잡힌 영양 섭취, 실내 습도 조절, 주기적인 야외 활동 등으로 기초 면역력을 높여주어야 합니다.')
        },
        { 
          id: 'c2', 
          title: '소아 비만 예방을 위한 가족 식습관 개선', 
          summary: '소아 비만은 성인 비만으로 이어질 확률이 매우 높습니다. 패스트푸드를 줄이고 온 가족이 함께 식사하며 천천히 먹는 습관을 기르는 것이 좋습니다.', 
          date: '2026-05-30', 
          views: 765, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('소아 비만은 성인 비만으로 이어질 확률이 매우 높습니다. 패스트푸드를 줄이고 온 가족이 함께 식사하며 천천히 먹는 습관을 기르는 것이 좋습니다.')
        },
        { 
          id: 'c3', 
          title: '어린이 스마트폰 증후군과 눈 건강 지키기', 
          summary: '과도한 스마트폰 사용은 소아 약시나 안구건조증의 원인이 됩니다. 20분 사용 후 20초간 먼 곳을 바라보게 하고, 하루 사용 시간을 제한해야 합니다.', 
          date: '2026-05-25', 
          views: 912, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('과도한 스마트폰 사용은 소아 약시나 안구건조증의 원인이 됩니다. 20분 사용 후 20초간 먼 곳을 바라보게 하고, 하루 사용 시간을 제한해야 합니다.')
        }
      ],
      pregnancy: [
        { 
          id: 'p1', 
          title: '임신 주수별 필수 검사 리스트', 
          summary: '건강한 출산을 위해 주수별 기형아 검사, 정밀 초음파, 임신성 당뇨 검사 등을 제때 받아야 합니다. 시기별 필수 검사 일정을 미리 체크해보세요.', 
          date: '2026-06-05', 
          views: 1354, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: `
            <p>임신 기간 동안 엄마와 태아의 건강 상태를 모니터링하고 발생할 수 있는 위험 요소를 사전에 예방하기 위해 주기적인 산전 검사는 필수적입니다. 임신 주수별로 받아야 하는 주요 검사 항목들을 정리했습니다.</p>
            <h5 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 20px 0 10px 0;">초기 (1주 ~ 11주)</h5>
            <p>임신 사실을 확인하고 태아의 착상태를 확인하는 시기입니다. 초음파 검사를 통해 아기집의 위치와 태아 심장박동을 관찰하며, 산모의 건강 상태 분석을 위한 기초 혈액검사, 소변검사, 자궁경부암 검사 등이 이루어집니다.</p>
            <h5 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 20px 0 10px 0;">중기 (12주 ~ 28주)</h5>
            <p>태아가 안정적으로 자라는 시기로 기형아 검사가 중점적으로 진행됩니다. 11~13주경 입체초음파로 목덜미 투명대를 측정하고, 15~20주경 2차 기형아 검사(쿼드 검사 등)를 진행합니다. 또한 24~28주 사이에는 산모에게 위험할 수 있는 임신성 당뇨 검사(임당 검사)를 받게 됩니다.</p>
            <h5 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 20px 0 10px 0;">후기 (29주 ~ 출산)</h5>
            <p>출산을 대비하여 태아의 위치와 크기, 양수의 양을 수시로 체크하며 태동 검사를 실시합니다. 임신 중독증 발병 여부를 감시하기 위해 방문 시마다 혈압과 단백뇨를 검사합니다.</p>
          `
        },
        { 
          id: 'p2', 
          title: '임산부에게 좋은 음식과 피해야 할 음식', 
          summary: '엽산이 풍부한 녹색 채소, 철분이 많은 붉은 고기는 임산부에게 유익합니다. 반면 날생선, 익히지 않은 고기, 과도한 카페인은 주의가 필요합니다.', 
          date: '2026-06-02', 
          views: 1102, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('엽산이 풍부한 녹색 채소, 철분이 많은 붉은 고기는 임산부에게 유익합니다. 반면 날생선, 익히지 않은 고기, 과도한 카페인은 주의가 필요합니다.')
        },
        { 
          id: 'p3', 
          title: '산후 우울증 극복을 위한 가족의 역할', 
          summary: '급격한 호르몬 변화와 육아 스트레스로 많은 산모들이 산후 우울증을 겪습니다. 남편의 적극적인 육아 참여와 정서적 지지가 가장 큰 약입니다.', 
          date: '2026-05-28', 
          views: 832, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('급격한 호르몬 변화와 육아 스트레스로 많은 산모들이 산후 우울증을 겪습니다. 남편의 적극적인 육아 참여와 정서적 지지가 가장 큰 약입니다.')
        }
      ],
      obesity: [
        { 
          id: 'o1', 
          title: '요요 현상 없는 지속 가능한 다이어트 비법', 
          summary: '무리한 굶기 다이어트는 기초대사량을 떨어뜨려 요요를 유발합니다. 주당 0.5kg 감량을 목표로 규칙적인 삼시 세끼와 근력 운동을 유지하는 것이 핵심입니다.', 
          date: '2026-06-03', 
          views: 1421, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('무리한 굶기 다이어트는 기초대사량을 떨어뜨려 요요를 유발합니다. 주당 0.5kg 감량을 목표로 규칙적인 삼시 세끼와 근력 운동을 유지하는 것이 핵심입니다.')
        },
        { 
          id: 'o2', 
          title: '마른 비만의 위험성과 자가 진단법', 
          summary: '몸무게는 정상이지만 체지방률이 높은 마른 비만은 고혈압, 당뇨 등 대사질환의 위험이 더 큽니다. 근육량 부족이 원인이므로 근력 운동이 필수적입니다.', 
          date: '2026-05-30', 
          views: 1184, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('몸무게는 정상이지만 체지방률이 높은 마른 비만은 고혈압, 당뇨 등 대사질환의 위험이 더 큽니다. 근육량 부족이 원인이므로 근력 운동이 필수적입니다.')
        },
        { 
          id: 'o3', 
          title: '식욕을 조절하는 호르몬 다스리기', 
          summary: '포만감을 느끼게 하는 렙틴과 식욕을 돋우는 그렐린 호르몬은 수면 부족과 스트레스 시 균형이 깨집니다. 하루 7시간 이상 숙면하는 것이 중요합니다.', 
          date: '2026-05-25', 
          views: 954, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('포만감을 느끼게 하는 렙틴과 식욕을 돋우는 그렐린 호르몬은 수면 부족과 스트레스 시 균형이 깨집니다. 하루 7시간 이상 숙면하는 것이 중요합니다.')
        }
      ],
      alcohol: [
        { 
          id: 'a1', 
          title: '금연 성공률을 높이는 실천 가이드', 
          summary: '금연은 혼자 힘으로 성공하기 어렵습니다. 금연클리닉 방문, 니코틴 대체요법 사용, 물 자주 마시기 등 구체적인 계획을 세우고 주변에 선언하세요.', 
          date: '2026-06-04', 
          views: 978, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('금연은 혼자 힘으로 성공하기 어렵습니다. 금연클리닉 방문, 니코틴 대체요법 사용, 물 자주 마시기 등 구체적인 계획을 세우고 주변에 선언하세요.')
        },
        { 
          id: 'a2', 
          title: '숙취 해소에 좋은 음식과 잘못된 상식', 
          summary: '숙취 해소에는 아스파라긴산이 풍부한 콩나물국이나 북어국이 좋습니다. 꿀물도 수분과 당분을 공급해 주지만, 해장술이나 매운 짬뽕은 위벽을 자극하므로 피해야 합니다.', 
          date: '2026-05-31', 
          views: 1120, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('숙취 해소에는 아스파라긴산이 풍부한 콩나물국이나 북어국이 좋습니다. 꿀물도 수분과 당분을 공급해 주지만, 해장술이나 매운 짬뽕은 위벽을 자극하므로 피해야 합니다.')
        },
        { 
          id: 'a3', 
          title: '알코올이 뇌 건강에 미치는 악영향', 
          summary: '지속적인 과음은 뇌 세포를 손상시켜 기억력 저하와 알코올성 치매를 유발할 수 있습니다. 건강을 지키기 위한 주당 적정 음주량을 알아봅니다.', 
          date: '2026-05-26', 
          views: 812, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('지속적인 과음은 뇌 세포를 손상시켜 기억력 저하와 알코올성 치매를 유발할 수 있습니다. 건강을 지키기 위한 주당 적정 음주량을 알아봅니다.')
        }
      ],
      cancer: [
        { 
          id: 'can1', 
          title: '국가 5대 암 검진 주기와 대상자 확인하기', 
          summary: '위암, 대장암, 간암, 유방암, 자궁경부암은 조기에 발견하면 완치율이 매우 높습니다. 연령별, 성별 검진 주기를 놓치지 말고 신청하세요.', 
          date: '2026-06-05', 
          views: 1532, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('위암, 대장암, 간암, 유방암, 자궁경부암은 조기에 발견하면 완치율이 매우 높습니다. 연령별, 성별 검진 주기를 놓치지 말고 신청하세요.')
        },
        { 
          id: 'can2', 
          title: '항암 치료 중 식사 요령과 영양 관리', 
          summary: '항암 치료 중에는 구토, 입맛 변화 등으로 영양 결핍이 오기 쉽습니다. 조금씩 자주 섭취하고, 고단백·고칼로리 식단으로 체력을 유지하는 것이 최우선입니다.', 
          date: '2026-06-02', 
          views: 994, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('항암 치료 중에는 구토, 입맛 변화 등으로 영양 결핍이 오기 쉽습니다. 조금씩 자주 섭취하고, 고단백·고칼로리 식단으로 체력을 유지하는 것이 최우선입니다.')
        },
        { 
          id: 'can3', 
          title: '암을 예방하는 건강한 생활 습관 10계명', 
          summary: '암 예방의 첫걸음은 생활습관 개선입니다. 금연, 절주, 싱겁게 먹기, 주 5회 운동, 정기 검진 등 일상에서 실천 가능한 예방 수칙을 소개합니다.', 
          date: '2026-05-28', 
          views: 1204, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('암 예방의 첫걸음은 생활습관 개선입니다. 금연, 절주, 싱겁게 먹기, 주 5회 운동, 정기 검진 등 일상에서 실천 가능한 예방 수칙을 소개합니다.')
        }
      ],
      dementia: [
        { 
          id: 'd1', 
          title: '초로기 치매란? 젊다고 안심할 수 없는 이유', 
          summary: '65세 미만에 발병하는 초로기 치매는 진행 속도가 빠르고 인지장애 외에도 성격 변화가 먼저 나타날 수 있습니다. 조기 발견을 위한 자가진단 항목을 소개합니다.', 
          date: '2026-06-03', 
          views: 1402, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('65세 미만에 발병하는 초로기 치매는 진행 속도가 빠르고 인지장애 외에도 성격 변화가 먼저 나타날 수 있습니다. 조기 발견을 위한 자가진단 항목을 소개합니다.')
        },
        { 
          id: 'd2', 
          title: '치매 예방에 좋은 \'뇌 훈련\' 생활 습관', 
          summary: '독서, 일기 쓰기, 새로운 언어 배우기 등 뇌를 끊임없이 자극하는 활동은 인지 예비능을 높여 치매 발병을 늦춰줍니다. 매일 실천할 수 있는 훈련법을 알아봅니다.', 
          date: '2026-05-31', 
          views: 1245, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('독서, 일기 쓰기, 새로운 언어 배우기 등 뇌를 끊임없이 자극하는 활동은 인지 예비능을 높여 치매 발병을 늦춰줍니다. 매일 실천할 수 있는 훈련법을 알아봅니다.')
        },
        { 
          id: 'd3', 
          title: '치매를 예방하는 지중해식 식단의 효과', 
          summary: '올리브유, 견과류, 신선한 야채와 생선 위주의 지중해식 식단은 뇌 혈관 건강을 지키고 치매 위험을 30% 이상 낮춰준다는 연구 결과가 있습니다.', 
          date: '2026-05-26', 
          views: 1025, 
          regUser: 'Admin', 
          modUser: 'Admin',
          details: getFallbackDetailHTML('올리브유, 견과류, 신선한 야채와 생선 위주의 지중해식 식단은 뇌 혈관 건강을 지키고 치매 위험을 30% 이상 낮춰준다는 연구 결과가 있습니다.')
        }
      ]
    };
    localStorage.setItem('hc_health_posts_by_cat', JSON.stringify(healthPosts));
  }
}

  // 3. Click Logs
  const savedLogs = localStorage.getItem('hc_health_clicks_log');
  if (savedLogs) {
    clickLogs = JSON.parse(savedLogs);
  } else {
    // Generate mock click logs stretching back 3 days to simulate activity
    const now = new Date();
    const clients = [
      { id: 'kyobo', name: '교보생명' },
      { id: 'dasom', name: '교보다솜케어' },
      { id: 'other', name: 'A기업' }
    ];
    const users = ['홍길동', '김영희', '이철수', '박민수', '최성호'];
    
    clickLogs = [];
    // Loop over past 3 days
    for (let dayOffset = 0; dayOffset <= 3; dayOffset++) {
      const clickDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
      const yyyy = clickDate.getFullYear();
      const mm = String(clickDate.getMonth() + 1).padStart(2, '0');
      const dd = String(clickDate.getDate()).padStart(2, '0');
      const formattedDate = `${yyyy}-${mm}-${dd}`;

      // Generate 5-8 clicks per day
      const clickCount = 5 + Math.floor(Math.random() * 4);
      for (let j = 0; j < clickCount; j++) {
        const client = clients[Math.floor(Math.random() * clients.length)];
        const user = users[Math.floor(Math.random() * users.length)];
        
        // Pick random category and post
        const catIds = Object.keys(healthPosts);
        const catId = catIds[Math.floor(Math.random() * catIds.length)];
        const category = healthCategories.find(c => c.id === catId);
        const catLabel = category ? category.label : '기타';
        const postsInCat = healthPosts[catId] || [];
        const post = postsInCat.length > 0 ? postsInCat[Math.floor(Math.random() * postsInCat.length)] : { id: 'w1', title: '여성에게 자주 발생하는 빈혈' };

        const hh = String(Math.floor(Math.random() * 12) + 9).padStart(2, '0');
        const min = String(Math.floor(Math.random() * 60)).padStart(2, '0');
        const ss = String(Math.floor(Math.random() * 60)).padStart(2, '0');

        clickLogs.push({
          id: `click_mock_${formattedDate}_${j}`,
          clickDate: formattedDate,
          clickTime: `${hh}:${min}:${ss}`,
          postId: post.id,
          postTitle: post.title,
          categoryId: catId,
          categoryLabel: catLabel,
          clientId: client.id,
          clientName: client.name,
          userName: user
        });
      }
    }
    // Sort logs descending
    clickLogs.sort((a, b) => {
      const dateA = a.clickDate + ' ' + a.clickTime;
      const dateB = b.clickDate + ' ' + b.clickTime;
      return dateB.localeCompare(dateA);
    });
    localStorage.setItem('hc_health_clicks_log', JSON.stringify(clickLogs));
  }
}

function saveData() {
  localStorage.setItem('hc_health_categories', JSON.stringify(healthCategories));
  localStorage.setItem('hc_health_posts_by_cat', JSON.stringify(healthPosts));
}

// --- Tab 1: Category Management ---
function renderCategoriesTab() {
  const container = document.getElementById('tab-categories');
  if (!container) return;

  let rowsHtml = '';
  healthCategories.forEach((cat, index) => {
    const postCount = (healthPosts[cat.id] || []).length;
    rowsHtml += `
      <tr>
        <td style="font-weight:600;">${index + 1}</td>
        <td style="text-align: center; width: 80px; vertical-align: middle;">${getHealthIcon(cat.icon)}</td>
        <td style="font-weight:700; color:var(--primary-color);">${cat.id}</td>
        <td style="font-weight:700;">${cat.label}</td>
        <td><span class="badge-premium badge-primary">${postCount} 개</span></td>
        <td>
          <button class="btn btn-sm" onclick="editCategoryForm('${cat.id}')">수정</button>
          <button class="btn btn-sm" style="color:#ef4444;" onclick="deleteCategory('${cat.id}')">삭제</button>
        </td>
      </tr>
    `;
  });

  container.innerHTML = `
    <div class="category-mgmt-layout">
      <!-- Left side: Category List -->
      <div class="config-card">
        <div class="card-header">
          <h2 class="card-title">카테고리 목록</h2>
          <span style="font-size: 13px; color: #64748b;">* 카테고리를 삭제하면 해당 카테고리 내의 모든 건강정보글이 삭제될 수 있습니다.</span>
        </div>
        <div class="card-body" style="padding: 0; overflow-x: auto;">
          <table class="premium-table">
            <thead>
              <tr>
                <th width="60">번호</th>
                <th width="80" style="text-align: center;">아이콘</th>
                <th>카테고리 ID (영문)</th>
                <th>카테고리명 (한글)</th>
                <th>게시글 수</th>
                <th width="140">관리</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml ? rowsHtml : '<tr><td colspan="6" style="text-align:center; padding:32px; color:#64748b;">등록된 카테고리가 없습니다.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right side: Add/Edit Form -->
      <div class="config-card" id="category-form-card">
        <div class="card-header" style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
          <h2 class="card-title" id="cat-form-title">➕ 신규 카테고리 등록</h2>
        </div>
        <div class="card-body" style="padding: 24px;">
          <form id="category-form" onsubmit="saveCategory(event)">
            <input type="hidden" id="edit-cat-mode" value="create">
            <input type="hidden" id="original-cat-id" value="">

            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" style="font-weight: 700; margin-bottom: 6px;">카테고리 ID (영문 소문자) <span style="color:#ef4444;">*</span></label>
              <input type="text" id="cat-id-input" class="form-input" placeholder="예: women, diet, sleep" required style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
            </div>

            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" style="font-weight: 700; margin-bottom: 6px;">카테고리명 (한글) <span style="color:#ef4444;">*</span></label>
              <input type="text" id="cat-label-input" class="form-input" placeholder="예: 식습관 개선, 여성건강" required style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
            </div>

            <div class="form-group" style="margin-bottom: 24px;">
              <label class="form-label" style="font-weight: 700; margin-bottom: 6px;">아이콘 (이모지 또는 한글레이블) <span style="color:#ef4444;">*</span></label>
              <input type="text" id="cat-icon-input" class="form-input" placeholder="예: 🍏, 🧘‍♀️, 혹은 아이콘 명칭" required style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px;">
              <span style="font-size: 11px; color:#94a3b8; margin-top: 4px; display:block;">고객용 포털에서 탭으로 렌더링될 때 표시되는 아이콘입니다.</span>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:8px;">
              <button type="button" class="btn btn-secondary" onclick="resetCategoryForm()" style="padding: 8px 16px; border-radius: 6px;">초기화</button>
              <button type="submit" class="btn btn-primary" style="padding: 8px 24px; border-radius: 6px; background:var(--primary-color); border:none; color:white; font-weight:700;">카테고리 저장</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}

window.resetCategoryForm = function() {
  const title = document.getElementById('cat-form-title');
  const mode = document.getElementById('edit-cat-mode');
  const origId = document.getElementById('original-cat-id');
  const catIdInput = document.getElementById('cat-id-input');
  const catLabelInput = document.getElementById('cat-label-input');
  const catIconInput = document.getElementById('cat-icon-input');

  if (title) title.innerText = '➕ 신규 카테고리 등록';
  if (mode) mode.value = 'create';
  if (origId) origId.value = '';
  if (catIdInput) { catIdInput.value = ''; catIdInput.disabled = false; }
  if (catLabelInput) catLabelInput.value = '';
  if (catIconInput) catIconInput.value = '';
};

window.editCategoryForm = function(catId) {
  const cat = healthCategories.find(c => c.id === catId);
  if (!cat) return;

  const title = document.getElementById('cat-form-title');
  const mode = document.getElementById('edit-cat-mode');
  const origId = document.getElementById('original-cat-id');
  const catIdInput = document.getElementById('cat-id-input');
  const catLabelInput = document.getElementById('cat-label-input');
  const catIconInput = document.getElementById('cat-icon-input');

  if (title) title.innerText = '✏️ 카테고리 수정';
  if (mode) mode.value = 'edit';
  if (origId) origId.value = catId;
  if (catIdInput) { catIdInput.value = cat.id; catIdInput.disabled = true; } // ID modification locked
  if (catLabelInput) catLabelInput.value = cat.label;
  if (catIconInput) catIconInput.value = cat.icon || '';
};

window.saveCategory = function(event) {
  event.preventDefault();

  const mode = document.getElementById('edit-cat-mode').value;
  const origId = document.getElementById('original-cat-id').value;
  const catId = document.getElementById('cat-id-input').value.trim().toLowerCase();
  const catLabel = document.getElementById('cat-label-input').value.trim();
  const catIcon = document.getElementById('cat-icon-input').value.trim();

  // Validate ID format (letters/numbers only)
  if (!/^[a-z0-9_-]+$/.test(catId)) {
    alert("카테고리 ID는 영문 소문자, 숫자, 하이픈(-) 및 언더바(_)만 사용 가능합니다.");
    return;
  }

  if (mode === 'create') {
    // Check duplication
    if (healthCategories.some(c => c.id === catId)) {
      alert("이미 존재하는 카테고리 ID입니다.");
      return;
    }
    healthCategories.push({ id: catId, label: catLabel, icon: catIcon });
    healthPosts[catId] = []; // Initialize empty array for posts
  } else {
    // Edit mode
    const cat = healthCategories.find(c => c.id === origId);
    if (cat) {
      cat.label = catLabel;
      cat.icon = catIcon;
    }
  }

  saveData();
  resetCategoryForm();
  renderCategoriesTab();
  showToast("카테고리가 성공적으로 저장되었습니다.");
};

window.deleteCategory = function(catId) {
  const cat = healthCategories.find(c => c.id === catId);
  if (!cat) return;

  const postCount = (healthPosts[catId] || []).length;
  const confirmMsg = postCount > 0 
    ? `'${cat.label}' 카테고리를 정말 삭제하시겠습니까?\n내부에 속한 게시글 ${postCount}개도 함께 영구 삭제됩니다.`
    : `'${cat.label}' 카테고리를 정말 삭제하시겠습니까?`;

  if (confirm(confirmMsg)) {
    healthCategories = healthCategories.filter(c => c.id !== catId);
    delete healthPosts[catId];
    saveData();
    renderCategoriesTab();
    showToast("카테고리가 삭제되었습니다.");
  }
};

// --- Tab 2: Articles Management ---
function renderArticlesTab() {
  const container = document.getElementById('tab-articles');
  if (!container) return;

  // Render main articles frame
  container.innerHTML = `
    <div id="articles-list-view">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-weight:700; font-size:14px; color:#475569;">카테고리 필터:</span>
          <select id="article-cat-select" class="form-input" style="width:200px; padding:6px 10px; font-size:13px; border-radius:6px; border:1px solid #cbd5e1;" onchange="filterArticlesByCategory(this.value)">
            <option value="all" ${activeCategoryFilter === 'all' ? 'selected' : ''}>전체 카테고리</option>
            ${healthCategories.map(c => `<option value="${c.id}" ${activeCategoryFilter === c.id ? 'selected' : ''}>${c.label} (${c.id})</option>`).join('')}
          </select>
        </div>
        <button class="btn btn-primary" onclick="openArticleEditor()" style="background:var(--primary-color); color:white; border:none; padding:8px 16px; font-weight:700; border-radius:6px; cursor:pointer;">
          새 건강정보 등록
        </button>
      </div>

      <div class="config-card">
        <div class="card-body" style="padding: 0; overflow-x: auto;">
          <table class="premium-table">
            <thead>
              <tr>
                <th width="70">ID</th>
                <th width="150">카테고리</th>
                <th>제목</th>
                <th width="140">등록일/수정일</th>
                <th width="120">등록자/수정자</th>
                <th width="100">조회수</th>
                <th width="120">관리</th>
              </tr>
            </thead>
            <tbody id="articles-table-body">
              <!-- Dynamically rendered rows -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Dynamic Article Editor Wrapper -->
    <div id="articles-editor-view" style="display:none;">
    </div>
  `;

  renderArticlesTable();
}

window.filterArticlesByCategory = function(catId) {
  activeCategoryFilter = catId;
  renderArticlesTable();
};

function renderArticlesTable() {
  const tbody = document.getElementById('articles-table-body');
  if (!tbody) return;

  let allFiltered = [];
  if (activeCategoryFilter === 'all') {
    Object.keys(healthPosts).forEach(catId => {
      const posts = healthPosts[catId] || [];
      posts.forEach(p => {
        allFiltered.push({ ...p, catId });
      });
    });
  } else {
    const posts = healthPosts[activeCategoryFilter] || [];
    posts.forEach(p => {
      allFiltered.push({ ...p, catId: activeCategoryFilter });
    });
  }

  // Sort by date descending
  allFiltered.sort((a, b) => b.date.localeCompare(a.date));

  let rowsHtml = '';
  allFiltered.forEach(post => {
    const category = healthCategories.find(c => c.id === post.catId);
    const catLabel = category ? category.label : '기타';

    rowsHtml += `
      <tr>
        <td style="color:#64748b; font-family:monospace;">${post.id}</td>
        <td><span class="badge-premium badge-primary">${catLabel}</span></td>
        <td style="font-weight:700; cursor:pointer; color:#0f172a;" onclick="openArticleEditor('${post.catId}', '${post.id}')" title="제목을 눌러 편집하기">
          ${post.title}
        </td>
        <td style="color:#64748b; font-size:13px;">${post.date}</td>
        <td style="font-size:13px; font-weight:500;">
          ${post.regUser || '관리자'}<span style="color:#cbd5e1; margin:0 4px;">/</span>${post.modUser || '관리자'}
        </td>
        <td style="font-weight:700; color:#475569;">${post.views || 0}</td>
        <td>
          <button class="btn btn-sm" onclick="openArticleEditor('${post.catId}', '${post.id}')">수정</button>
          <button class="btn btn-sm" style="color:#ef4444;" onclick="deleteArticle('${post.catId}', '${post.id}')">삭제</button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = rowsHtml ? rowsHtml : '<tr><td colspan="7" style="text-align:center; padding:48px; color:#64748b;">등록된 건강정보가 없습니다.</td></tr>';
}

window.deleteArticle = function(catId, postId) {
  if (confirm("이 건강정보 게시글을 정말 삭제하시겠습니까?")) {
    const posts = healthPosts[catId] || [];
    healthPosts[catId] = posts.filter(p => p.id !== postId);
    saveData();
    renderArticlesTable();
    showToast("게시글이 삭제되었습니다.");
  }
};

// --- WYSIWYG visual editor engine ---
window.openArticleEditor = function(catId = '', postId = '') {
  document.getElementById('articles-list-view').style.display = 'none';
  const editorView = document.getElementById('articles-editor-view');
  editorView.style.display = 'block';

  let post = null;
  if (postId && catId) {
    const list = healthPosts[catId] || [];
    post = list.find(p => p.id === postId);
  }

  activeEditPost = post;
  currentEditorCategoryId = catId || (healthCategories[0] ? healthCategories[0].id : '');

  // If editing, use existing post content (HTML). If editing mock post without custom detail, extract default or empty.
  let initialHtml = '';
  if (post) {
    initialHtml = post.details || post.content || '';
    if (!initialHtml.includes('provided-service-fluid-frame') && !initialHtml.includes('provided-service-text-bg')) {
      // Wrap simple content in fluid frame for editor compatibility
      initialHtml = `
        <div class="provided-service-fluid-frame" style="position:relative; width:100%; padding-bottom:35%; min-height:350px; background:#fff; overflow:hidden;">
          <div class="provided-service-text-bg" style="position:absolute; inset:0; padding:20px; line-height:1.6; font-size:14px; overflow-y:auto; z-index:1;">
            ${initialHtml || '<p>여기에 본문 내용을 기입하세요.</p>'}
          </div>
          <div class="provided-service-overlay-layers" style="position:absolute; inset:0; pointer-events:none; z-index:2;"></div>
        </div>
      `.trim();
    }
  } else {
    initialHtml = `
      <div class="provided-service-fluid-frame" style="position:relative; width:100%; padding-bottom:35%; min-height:350px; background:#fff; overflow:hidden;">
        <div class="provided-service-text-bg" style="position:absolute; inset:0; padding:20px; line-height:1.6; font-size:14px; overflow-y:auto; z-index:1;">
          <p>여기에 본문 내용을 기입하세요. 상단 에디터 툴바를 이용해 서식을 지정하거나 도형, 이미지를 추가할 수 있습니다.</p>
        </div>
        <div class="provided-service-overlay-layers" style="position:absolute; inset:0; pointer-events:none; z-index:2;"></div>
      </div>
    `.trim();
  }

  // Draw full editor interface
  editorView.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; padding-bottom:12px; border-bottom:1px solid #e2e8f0;">
      <div>
        <h2 style="font-size:18px; font-weight:800; color:#0f172a; margin:0;">
          ${post ? '✏️ 건강정보 수정' : '➕ 신규 건강정보 등록'}
        </h2>
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-secondary" onclick="closeArticleEditor()">취소</button>
        <button class="btn btn-primary" onclick="saveArticle()" style="background:var(--primary-color); color:white; border:none; font-weight:700;">저장하기</button>
      </div>
    </div>

    <div class="config-card" style="margin-bottom:24px;">
      <div class="card-body" style="padding:24px; display:flex; flex-direction:column; gap:16px;">
        <!-- Meta Row -->
        <div style="display:grid; grid-template-columns:1fr 2fr 1.5fr; gap:16px;">
          <div class="form-group">
            <label class="form-label" style="font-weight:700; margin-bottom:6px; display:block;">카테고리 선택</label>
            <select id="edit-post-cat" class="form-input" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px; outline:none;" ${post ? 'disabled' : ''}>
              ${healthCategories.map(c => `<option value="${c.id}" ${currentEditorCategoryId === c.id ? 'selected' : ''}>${c.label}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" style="font-weight:700; margin-bottom:6px; display:block;">게시글 제목 <span style="color:#ef4444;">*</span></label>
            <input type="text" id="edit-post-title" class="form-input" placeholder="제목을 기입하세요" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px; font-weight:700;" value="${post ? post.title : ''}" required>
          </div>
          <div class="form-group">
            <label class="form-label" style="font-weight:700; margin-bottom:6px; display:block;">등록자/수정자 ID <span style="color:#ef4444;">*</span></label>
            <input type="text" id="edit-post-author" class="form-input" placeholder="예: Admin" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px;" value="${post ? (post.modUser || 'Admin') : 'Admin'}" required>
          </div>
        </div>

        <!-- Editor Title -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
          <h3 style="font-size:14px; font-weight:700; color:#0f172a; margin:0;">상세 내용 본문 편집 (에디터/HTML/CSS 동시 제공)</h3>
          <div style="display:flex; background:#e2e8f0; border-radius:6px; padding:2px;">
            <button class="btn btn-sm" id="btn-toggle-editor-mode-content" onclick="switchEditorMode('content', 'editor')" style="padding:4px 10px; font-size:11px; background:var(--primary-color); color:white; border-radius:4px;">에디터 모드</button>
            <button class="btn btn-sm" id="btn-toggle-html-mode-content" onclick="switchEditorMode('content', 'html')" style="padding:4px 10px; font-size:11px; background:transparent; color:#475569; border-radius:4px;">HTML 모드</button>
          </div>
        </div>

        <!-- Custom Editor Markup -->
        ${renderCanvasEditorMarkup('content', initialHtml)}
      </div>
    </div>
  `;

  // Bind click & drag/resize events
  initializeCanvasEditor('content');
  parseHtmlToCanvasWorkspace('content', initialHtml);
  canvasEditorModes['content'] = 'editor';
};

window.closeArticleEditor = function() {
  document.getElementById('articles-editor-view').style.display = 'none';
  document.getElementById('articles-list-view').style.display = 'block';
  renderArticlesTable();
};

// Return custom canvas editor markup
function renderCanvasEditorMarkup(id, initialHtml) {
  return `
    <div class="canvas-editor-wrapper" id="canvas-wrapper-${id}" style="display:flex; flex-direction:column; gap:1px; border: 1px solid #cbd5e1; border-radius: 8px;">
      
      <!-- Toolbar -->
      <div class="editor-toolbar" style="border-bottom:1px solid #e2e8f0; background:#f8fafc; padding:8px 12px; display:flex; flex-wrap:wrap; gap:6px; align-items:center;">
        
        <!-- Text style commands -->
        <button class="editor-btn" onclick="execCanvasCmd('${id}', 'bold')" style="font-weight:bold; width:32px;" title="굵게">B</button>
        <button class="editor-btn" onclick="execCanvasCmd('${id}', 'italic')" style="font-style:italic; width:32px;" title="기울임">I</button>
        <button class="editor-btn" onclick="execCanvasCmd('${id}', 'underline')" style="text-decoration:underline; width:32px;" title="밑줄">U</button>
        
        <div style="width:1px; height:20px; background:#cbd5e1; margin:0 4px;"></div>

        <!-- Font Size -->
        <select onchange="execCanvasCmd('${id}', 'fontSize', this.value)" style="padding:4px; font-size:12px; border:1px solid #cbd5e1; border-radius:4px; outline:none; background:white;">
          <option value="13px">13px</option>
          <option value="14px" selected>14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
        </select>

        <!-- Font Color -->
        <select onchange="execCanvasCmd('${id}', 'foreColor', this.value)" style="padding:4px; font-size:12px; border:1px solid #cbd5e1; border-radius:4px; outline:none; background:white;">
          <option value="#0f172a" style="color:#0f172a;">검은색</option>
          <option value="#2563eb" style="color:#2563eb;">파란색</option>
          <option value="#17B890" style="color:#17B890;">민트색</option>
          <option value="#ef4444" style="color:#ef4444;">빨간색</option>
          <option value="#f59e0b" style="color:#f59e0b;">오렌지색</option>
          <option value="#7c3aed" style="color:#7c3aed;">보라색</option>
        </select>

        <!-- Alignments -->
        <button class="editor-btn" onclick="execCanvasCmd('${id}', 'align', 'left')" title="왼쪽 정렬">◀</button>
        <button class="editor-btn" onclick="execCanvasCmd('${id}', 'align', 'center')" title="가운데 정렬">■</button>
        <button class="editor-btn" onclick="execCanvasCmd('${id}', 'align', 'right')" title="오른쪽 정렬">▶</button>

        <div style="width:1px; height:20px; background:#cbd5e1; margin:0 4px;"></div>

        <!-- Add Shapes -->
        <button class="editor-btn" onclick="addCanvasShape('${id}', 'rect')" style="color:#2563eb;" title="직사각형">+ ⬛ 사각형</button>
        <button class="editor-btn" onclick="addCanvasShape('${id}', 'roundrect')" style="color:#0369a1;" title="둥근 사각형">+ ▢ 둥근사각형</button>
        <button class="editor-btn" onclick="addCanvasShape('${id}', 'oval')" style="color:#10b981;" title="타원">+ 🔴 타원</button>
        <button class="editor-btn" onclick="addCanvasShape('${id}', 'arrow')" style="color:#f59e0b;" title="화살표">+ ➡️ 화살표</button>
        <button class="editor-btn" onclick="addCanvasShape('${id}', 'callout')" style="color:#7c3aed;" title="말풍선">+ 💬 말풍선</button>
        
        <div style="width:1px; height:20px; background:#cbd5e1; margin:0 4px;"></div>

        <!-- Shape Styling controls -->
        <select id="shape-style-bg-${id}" onchange="applyShapeStyle('${id}', 'bg', this.value)" style="padding:4px; font-size:11px; border:1px solid #cbd5e1; border-radius:4px; outline:none; background:white;" title="배경색">
          <option value="#eff6ff" style="background:#eff6ff;">연청색</option>
          <option value="#ecfdf5" style="background:#ecfdf5;">연녹색</option>
          <option value="#fffbeb" style="background:#fffbeb;">연황색</option>
          <option value="#fef2f2" style="background:#fef2f2;">연적색</option>
          <option value="#ffffff" style="background:#ffffff;">흰색</option>
          <option value="#000000" style="background:#000000; color:#fff;">검정색</option>
        </select>

        <select id="shape-style-border-${id}" onchange="applyShapeStyle('${id}', 'borderColor', this.value)" style="padding:4px; font-size:11px; border:1px solid #cbd5e1; border-radius:4px; outline:none; background:white;" title="테두리색">
          <option value="#2563eb" style="color:#2563eb;">테두리: 청색</option>
          <option value="#10b981" style="color:#10b981;">테두리: 녹색</option>
          <option value="#f59e0b" style="color:#f59e0b;">테두리: 황색</option>
          <option value="#ef4444" style="color:#ef4444;">테두리: 적색</option>
          <option value="none">테두리: 없음</option>
        </select>

        <select id="shape-style-textcolor-${id}" onchange="applyShapeStyle('${id}', 'textColor', this.value)" style="padding:4px; font-size:11px; border:1px solid #cbd5e1; border-radius:4px; outline:none; background:white;" title="글씨색">
          <option value="#1e293b">글씨: 어두운회색</option>
          <option value="#2563eb" style="color:#2563eb;">글씨: 파란색</option>
          <option value="#ef4444" style="color:#ef4444;">글씨: 빨간색</option>
          <option value="#ffffff" style="background:#000; color:#fff;">글씨: 흰색</option>
        </select>

        <div style="width:1px; height:20px; background:#cbd5e1; margin:0 4px;"></div>

        <!-- Image Upload -->
        <div style="position:relative; display:inline-block;">
          <button class="editor-btn" style="color:#db2777;">+ 📷 이미지</button>
          <input type="file" accept="image/*" onchange="handleCanvasImageUpload('${id}', this)" style="position:absolute; inset:0; opacity:0; cursor:pointer; width:100%;">
        </div>

        <div style="flex:1;"></div>
        <button class="editor-btn" onclick="deleteActiveCanvasElement('${id}')" style="background:#fee2e2; border-color:#fca5a5; color:#991b1b; font-weight:700;">🗑️ 삭제</button>
      </div>

      <!-- Visual Editor Area -->
      <div id="canvas-workspace-${id}" style="position:relative; width:100%; height:450px; background:#fff; overflow:hidden; cursor:default;">
        <!-- Background Text -->
        <div id="canvas-text-bg-${id}" contenteditable="true" style="position:absolute; inset:0; padding:24px; outline:none; line-height:1.7; font-size:14px; overflow-y:auto; z-index:1;">
        </div>
        <!-- Overlays Layer -->
        <div id="canvas-layers-${id}" style="position:absolute; inset:0; pointer-events:none; z-index:2; overflow:hidden;">
        </div>
      </div>

      <!-- Raw HTML Code Editor -->
      <textarea id="canvas-html-textarea-${id}" style="display:none; width:100%; height:450px; padding:16px; border:none; background:#1e293b; color:#f8fafc; font-family:Consolas, monospace; font-size:13px; line-height:1.5; outline:none; resize:none; box-sizing:border-box;"></textarea>
    </div>
  `;
}

// Visual editor engine logic
window.initializeCanvasEditor = function(id) {
  const workspace = document.getElementById(`canvas-workspace-${id}`);
  const layers = document.getElementById(`canvas-layers-${id}`);
  const textBg = document.getElementById(`canvas-text-bg-${id}`);
  
  if (!workspace || !layers) return;

  workspace.addEventListener('mousedown', (e) => {
    if (e.target === workspace || e.target === textBg || e.target === layers) {
      deselectAllCanvasElements(id);
    }
  });
};

window.deselectAllCanvasElements = function(id) {
  const layers = document.getElementById(`canvas-layers-${id}`);
  if (!layers) return;
  layers.querySelectorAll('.canvas-element').forEach(el => {
    el.classList.remove('selected');
    el.style.border = 'none';
    el.querySelectorAll('.resize-knob').forEach(k => k.style.display = 'none');
  });
};

window.execCanvasCmd = function(id, cmd, value = null) {
  // If in HTML mode, do nothing
  if (canvasEditorModes[id] === 'html') return;

  const textBg = document.getElementById(`canvas-text-bg-${id}`);
  if (!textBg) return;
  textBg.focus();

  if (cmd === 'align') {
    document.execCommand(value === 'center' ? 'justifyCenter' : (value === 'right' ? 'justifyRight' : 'justifyLeft'), false, null);
  } else if (cmd === 'fontSize') {
    // Basic font size formatting
    document.execCommand('fontSize', false, '3'); // standard medium
    // Find selected text and style it directly to value (e.g. 18px)
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = value;
      range.surroundContents(span);
    }
  } else if (cmd === 'foreColor') {
    document.execCommand('foreColor', false, value);
  } else {
    document.execCommand(cmd, false, null);
  }
};

window.bindCanvasDragResize = function(id, el) {
  const workspace = document.getElementById(`canvas-workspace-${id}`);
  let isDrag = false;
  let isSize = false;
  let sizeDir = '';
  let startX, startY, startW, startH, startL, startT;

  el.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('resize-knob')) {
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

    deselectAllCanvasElements(id);
    el.classList.add('selected');
    el.style.border = '2px dashed var(--primary-color)';
    el.querySelectorAll('.resize-knob').forEach(k => k.style.display = 'block');

    // Update styling toolbar values if shape
    if (el.dataset.type === 'shape') {
      const svgTag = el.querySelector('svg rect, svg ellipse, svg path');
      if (svgTag) {
        const bg = svgTag.getAttribute('fill') || '';
        const border = svgTag.getAttribute('stroke') || '';
        document.getElementById(`shape-style-bg-${id}`).value = bg;
        document.getElementById(`shape-style-border-${id}`).value = border;
      }
      const textEl = el.querySelector('.element-text-area');
      if (textEl) {
        const color = window.getComputedStyle(textEl).color;
        // Simple helper to parse color
        document.getElementById(`shape-style-textcolor-${id}`).value = color === 'rgb(255, 255, 255)' ? '#ffffff' : (color === 'rgb(37, 99, 235)' ? '#2563eb' : '#1e293b');
      }
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (isDrag) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      let newL = startL + dx;
      let newT = startT + dy;

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
      if (sizeDir.includes('w')) { newW = startW - dx; newL = startL + dx; }
      if (sizeDir.includes('s')) newH = startH + dy;
      if (sizeDir.includes('n')) { newH = startH - dy; newT = startT + dy; }

      if (newW > 40 && newL >= 0 && newL + newW <= workspace.offsetWidth) {
        el.style.width = `${newW}px`;
        el.style.left = `${newL}px`;
      }
      if (newH > 30 && newT >= 0 && newT + newH <= workspace.offsetHeight) {
        el.style.height = `${newH}px`;
        el.style.top = `${newT}px`;
      }
    }
  });

  document.addEventListener('mouseup', () => {
    isDrag = false;
    isSize = false;
  });
};

window.addCanvasShape = function(id, shapeType) {
  const layers = document.getElementById(`canvas-layers-${id}`);
  if (!layers) return;

  const el = document.createElement('div');
  el.className = 'canvas-element selected';
  el.dataset.type = 'shape';
  el.dataset.shape = shapeType;
  el.style = `position:absolute; left:80px; top:80px; width:160px; height:90px; z-index:10; pointer-events:auto; border:2px dashed var(--primary-color); cursor:move;`;

  let svgContent = '';
  if (shapeType === 'rect') {
    svgContent = `<svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" style="display:block;"><rect x="2" y="2" width="96" height="96" fill="#eff6ff" stroke="#2563eb" stroke-width="2" rx="0"/></svg>`;
  } else if (shapeType === 'roundrect') {
    svgContent = `<svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" style="display:block;"><rect x="2" y="2" width="96" height="96" fill="#eff6ff" stroke="#2563eb" stroke-width="2" rx="12"/></svg>`;
  } else if (shapeType === 'oval') {
    svgContent = `<svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" style="display:block;"><ellipse cx="50" cy="50" rx="46" ry="46" fill="#ecfdf5" stroke="#10b981" stroke-width="2"/></svg>`;
  } else if (shapeType === 'arrow') {
    svgContent = `<svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" style="display:block;"><path d="M 5,35 H 65 V 15 L 95,50 L 65,85 V 65 H 5 Z" fill="#fffbeb" stroke="#f59e0b" stroke-width="2"/></svg>`;
  } else if (shapeType === 'callout') {
    svgContent = `<svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" style="display:block;"><path d="M 5,5 H 95 V 70 H 45 L 25,95 V 70 H 5 Z" fill="#eff6ff" stroke="#7c3aed" stroke-width="2"/></svg>`;
  }

  el.innerHTML = `
    <div class="element-content-wrapper" style="position:absolute; inset:0; z-index:1;">
      ${svgContent}
    </div>
    <div class="element-text-area" contenteditable="true" style="position:absolute; inset:10px; z-index:2; display:flex; align-items:center; justify-content:center; text-align:center; font-size:12px; font-weight:700; color:#1e293b; outline:none; pointer-events:auto; word-break:break-all;">
      글자 입력
    </div>
    <div class="resize-knob" data-dir="se" style="position:absolute; right:-4px; bottom:-4px; width:8px; height:8px; border-radius:50%; background:var(--primary-color); cursor:nwse-resize; z-index:3;"></div>
    <div class="resize-knob" data-dir="sw" style="position:absolute; left:-4px; bottom:-4px; width:8px; height:8px; border-radius:50%; background:var(--primary-color); cursor:nesw-resize; z-index:3;"></div>
  `;

  deselectAllCanvasElements(id);
  layers.appendChild(el);
  bindCanvasDragResize(id, el);

  // Focus shape text
  setTimeout(() => {
    const textDiv = el.querySelector('.element-text-area');
    if (textDiv) textDiv.focus();
  }, 100);
};

window.applyShapeStyle = function(id, styleType, value) {
  const layers = document.getElementById(`canvas-layers-${id}`);
  if (!layers) return;
  const activeEl = layers.querySelector('.canvas-element.selected');
  if (!activeEl || activeEl.dataset.type !== 'shape') return;

  const svgTag = activeEl.querySelector('svg rect, svg ellipse, svg path');
  if (!svgTag) return;

  if (styleType === 'bg') {
    svgTag.setAttribute('fill', value);
  } else if (styleType === 'borderColor') {
    svgTag.setAttribute('stroke', value === 'none' ? 'transparent' : value);
  } else if (styleType === 'textColor') {
    const textDiv = activeEl.querySelector('.element-text-area');
    if (textDiv) textDiv.style.color = value;
  }
};

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
    el.style = `position:absolute; left:100px; top:100px; width:200px; height:130px; z-index:10; pointer-events:auto; border:2px dashed var(--primary-color); cursor:move;`;

    el.innerHTML = `
      <div class="element-content-wrapper" style="position:absolute; inset:0; z-index:1; overflow:hidden; border-radius:8px;">
        <img src="${base64Url}" style="width:100%; height:100%; object-fit:cover; display:block;">
      </div>
      <div class="resize-knob" data-dir="se" style="position:absolute; right:-4px; bottom:-4px; width:8px; height:8px; border-radius:50%; background:var(--primary-color); cursor:nwse-resize; z-index:3;"></div>
      <div class="resize-knob" data-dir="sw" style="position:absolute; left:-4px; bottom:-4px; width:8px; height:8px; border-radius:50%; background:var(--primary-color); cursor:nesw-resize; z-index:3;"></div>
    `;

    deselectAllCanvasElements(id);
    layers.appendChild(el);
    bindCanvasDragResize(id, el);
    fileInput.value = ''; // Reset
  };

  reader.readAsDataURL(file);
};

window.deleteActiveCanvasElement = function(id) {
  const layers = document.getElementById(`canvas-layers-${id}`);
  if (!layers) return;
  const activeEl = layers.querySelector('.canvas-element.selected');
  if (activeEl && confirm("선택한 요소(도형/이미지)를 삭제하시겠습니까?")) {
    activeEl.remove();
  }
};

// HTML / Visual mode toggling
window.switchEditorMode = function(id, targetMode) {
  const currentMode = canvasEditorModes[id];
  if (currentMode === targetMode) return;

  const wrapper = document.getElementById(`canvas-wrapper-${id}`);
  const workspace = document.getElementById(`canvas-workspace-${id}`);
  const textarea = document.getElementById(`canvas-html-textarea-${id}`);
  
  const btnEditor = document.getElementById(`btn-toggle-editor-mode-${id}`);
  const btnHtml = document.getElementById(`btn-toggle-html-mode-${id}`);

  if (targetMode === 'html') {
    // Visual -> HTML
    const htmlCode = serializeCanvasWorkspace(id);
    textarea.value = htmlCode;
    workspace.style.display = 'none';
    textarea.style.display = 'block';

    if (btnEditor) { btnEditor.style.background = 'transparent'; btnEditor.style.color = '#475569'; }
    if (btnHtml) { btnHtml.style.background = 'var(--primary-color)'; btnHtml.style.color = 'white'; }
  } else {
    // HTML -> Visual
    const htmlCode = textarea.value;
    parseHtmlToCanvasWorkspace(id, htmlCode);
    workspace.style.display = 'block';
    textarea.style.display = 'none';

    if (btnEditor) { btnEditor.style.background = 'var(--primary-color)'; btnEditor.style.color = 'white'; }
    if (btnHtml) { btnHtml.style.background = 'transparent'; btnHtml.style.color = '#475569'; }
  }

  canvasEditorModes[id] = targetMode;
};

// Serialize the workspace content into responsive HTML (percentages)
window.serializeCanvasWorkspace = function(id) {
  const workspace = document.getElementById(`canvas-workspace-${id}`);
  const textBg = document.getElementById(`canvas-text-bg-${id}`);
  const layers = document.getElementById(`canvas-layers-${id}`);

  if (!workspace || !textBg || !layers) return '';

  const wWidth = workspace.offsetWidth || 1000;
  const wHeight = workspace.offsetHeight || 450;

  const backgroundTextHtml = textBg.innerHTML.trim();
  const elements = layers.querySelectorAll('.canvas-element');
  let layersHtml = '';

  elements.forEach(el => {
    const leftPct = ((el.offsetLeft / wWidth) * 100).toFixed(2);
    const topPct = ((el.offsetTop / wHeight) * 100).toFixed(2);
    const widthPct = ((el.offsetWidth / wWidth) * 100).toFixed(2);
    const heightPct = ((el.offsetHeight / wHeight) * 100).toFixed(2);

    const type = el.dataset.type;

    if (type === 'image') {
      const img = el.querySelector('img');
      const src = img ? img.src : '';
      layersHtml += `
        <div class="responsive-overlay-image" style="position:absolute; left:${leftPct}%; top:${topPct}%; width:${widthPct}%; height:${heightPct}%; z-index:10; border-radius:8px; overflow:hidden; box-shadow:0 4px 6px rgba(0,0,0,0.1);">
          <img src="${src}" style="width:100%; height:100%; object-fit:cover; display:block;">
        </div>
      `;
    } else if (type === 'shape') {
      const shape = el.dataset.shape;
      const text = el.querySelector('.element-text-area').innerHTML.trim();
      const svg = el.querySelector('.element-content-wrapper').innerHTML.trim();
      const textColor = el.querySelector('.element-text-area').style.color || '#1e293b';

      layersHtml += `
        <div class="responsive-overlay-shape" data-shape="${shape}" style="position:absolute; left:${leftPct}%; top:${topPct}%; width:${widthPct}%; height:${heightPct}%; z-index:10;">
          <div style="position:absolute; inset:0; z-index:1;">
            ${svg}
          </div>
          <div style="position:absolute; inset:10px; z-index:2; display:flex; align-items:center; justify-content:center; text-align:center; font-size:12px; font-weight:700; color:${textColor}; outline:none; word-break:break-all;">
            ${text}
          </div>
        </div>
      `;
    }
  });

  return `
<div class="provided-service-fluid-frame" style="position:relative; width:100%; padding-bottom:45%; min-height:450px; background:#fff; overflow:hidden; border: 1px solid #cbd5e1; border-radius: 8px;">
  <div class="provided-service-text-bg" style="position:absolute; inset:0; padding:24px; line-height:1.7; font-size:14px; overflow-y:auto; z-index:1;">
    ${backgroundTextHtml}
  </div>
  <div class="provided-service-overlay-layers" style="position:absolute; inset:0; pointer-events:none; z-index:2;">
    ${layersHtml}
  </div>
</div>
  `.trim();
};

// Parse responsive HTML code back to visual workspace (pixels)
window.parseHtmlToCanvasWorkspace = function(id, htmlCode) {
  const workspace = document.getElementById(`canvas-workspace-${id}`);
  const textBg = document.getElementById(`canvas-text-bg-${id}`);
  const layers = document.getElementById(`canvas-layers-${id}`);

  if (!workspace || !textBg || !layers) return;

  textBg.innerHTML = '';
  layers.innerHTML = '';

  if (!htmlCode || htmlCode.trim() === '') return;

  const temp = document.createElement('div');
  temp.innerHTML = htmlCode;

  const parsedTextBg = temp.querySelector('.provided-service-text-bg');
  if (parsedTextBg) {
    textBg.innerHTML = parsedTextBg.innerHTML;
  } else {
    // raw HTML
    textBg.innerHTML = htmlCode;
    return;
  }

  const parsedLayers = temp.querySelector('.provided-service-overlay-layers');
  if (parsedLayers) {
    const wWidth = workspace.offsetWidth || 1000;
    const wHeight = workspace.offsetHeight || 450;

    // Parse image overlays
    const images = parsedLayers.querySelectorAll('.responsive-overlay-image');
    images.forEach(imgOverlay => {
      const src = imgOverlay.querySelector('img')?.src || '';
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
        <div class="resize-knob" data-dir="se" style="position:absolute; right:-4px; bottom:-4px; width:8px; height:8px; border-radius:50%; background:var(--primary-color); cursor:nwse-resize; z-index:3; display:none;"></div>
        <div class="resize-knob" data-dir="sw" style="position:absolute; left:-4px; bottom:-4px; width:8px; height:8px; border-radius:50%; background:var(--primary-color); cursor:nesw-resize; z-index:3; display:none;"></div>
      `;

      layers.appendChild(el);
      bindCanvasDragResize(id, el);
    });

    // Parse shape overlays
    const shapes = parsedLayers.querySelectorAll('.responsive-overlay-shape');
    shapes.forEach(shapeOverlay => {
      const shapeType = shapeOverlay.dataset.shape || 'rect';
      const textDiv = shapeOverlay.querySelector('div[style*="z-index:2"]');
      const text = textDiv?.innerHTML.trim() || '글자 입력';
      const textColor = textDiv?.style.color || '#1e293b';
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

      el.innerHTML = `
        <div class="element-content-wrapper" style="position:absolute; inset:0; z-index:1;">
          ${svg}
        </div>
        <div class="element-text-area" contenteditable="true" style="position:absolute; inset:10px; z-index:2; display:flex; align-items:center; justify-content:center; text-align:center; font-size:12px; font-weight:700; color:${textColor}; outline:none; pointer-events:auto; word-break:break-all;">
          ${text}
        </div>
        <div class="resize-knob" data-dir="se" style="position:absolute; right:-4px; bottom:-4px; width:8px; height:8px; border-radius:50%; background:var(--primary-color); cursor:nwse-resize; z-index:3; display:none;"></div>
        <div class="resize-knob" data-dir="sw" style="position:absolute; left:-4px; bottom:-4px; width:8px; height:8px; border-radius:50%; background:var(--primary-color); cursor:nesw-resize; z-index:3; display:none;"></div>
      `;

      layers.appendChild(el);
      bindCanvasDragResize(id, el);
    });
  }
};

window.saveArticle = function() {
  const catId = document.getElementById('edit-post-cat').value;
  const title = document.getElementById('edit-post-title').value.trim();
  const author = document.getElementById('edit-post-author').value.trim() || 'Admin';

  if (!title) {
    alert("제목을 입력하세요.");
    return;
  }

  // Get content (from textBg serialized or raw html depending on current mode)
  let contentHtml = '';
  if (canvasEditorModes['content'] === 'html') {
    contentHtml = document.getElementById('canvas-html-textarea-content').value;
  } else {
    contentHtml = serializeCanvasWorkspace('content');
  }

  // Extract a brief summary text for listing
  const temp = document.createElement('div');
  temp.innerHTML = contentHtml;
  const summaryText = (temp.querySelector('.provided-service-text-bg')?.innerText || temp.innerText || '').substring(0, 150) + '...';

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;

  if (activeEditPost) {
    // Edit existing post
    // Wait, did they change the category? In edit mode, category dropdown is disabled, but let's check
    const list = healthPosts[catId] || [];
    const p = list.find(x => x.id === activeEditPost.id);
    if (p) {
      p.title = title;
      p.summary = summaryText;
      p.details = contentHtml;
      p.content = contentHtml; // both fields for compatibility
      p.date = dateStr;
      p.modUser = author;
    }
  } else {
    // Create new post
    const newPostId = 'post_' + Date.now();
    const newPost = {
      id: newPostId,
      title: title,
      summary: summaryText,
      details: contentHtml,
      content: contentHtml,
      date: dateStr,
      views: 0,
      regUser: author,
      modUser: author
    };
    if (!healthPosts[catId]) {
      healthPosts[catId] = [];
    }
    healthPosts[catId].unshift(newPost);
  }

  saveData();
  closeArticleEditor();
  showToast("성공적으로 저장되었습니다.");
};

// --- Tab 3: Statistics / Daily Click Logs ---
let searchStartDate = '';
let searchEndDate = '';
let searchCategory = 'all';
let searchClient = 'all';
let searchKeyword = '';

window.renderStatisticsTab = function() {
  const container = document.getElementById('tab-statistics');
  if (!container) return;

  // Set default dates if empty
  if (!searchStartDate || !searchEndDate) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    
    const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
    const sYyyy = threeDaysAgo.getFullYear();
    const sMm = String(threeDaysAgo.getMonth() + 1).padStart(2, '0');
    const sDd = String(threeDaysAgo.getDate()).padStart(2, '0');

    searchStartDate = `${sYyyy}-${sMm}-${sDd}`;
    searchEndDate = `${yyyy}-${mm}-${dd}`;
  }

  // Calculate stats based on full clickLogs
  const totalClicks = clickLogs.length;
  
  // Find popular article
  const articleClickCounts = {};
  clickLogs.forEach(log => {
    articleClickCounts[log.postTitle] = (articleClickCounts[log.postTitle] || 0) + 1;
  });
  let popularArticle = '-';
  let popularArticleCount = 0;
  Object.keys(articleClickCounts).forEach(title => {
    if (articleClickCounts[title] > popularArticleCount) {
      popularArticle = title;
      popularArticleCount = articleClickCounts[title];
    }
  });

  // Find popular category
  const catClickCounts = {};
  clickLogs.forEach(log => {
    catClickCounts[log.categoryLabel] = (catClickCounts[log.categoryLabel] || 0) + 1;
  });
  let popularCat = '-';
  let popularCatCount = 0;
  Object.keys(catClickCounts).forEach(label => {
    if (catClickCounts[label] > popularCatCount) {
      popularCat = label;
      popularCatCount = catClickCounts[label];
    }
  });

  container.innerHTML = `
    <!-- Stats Cards Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div>
          <div class="stat-label">누적 전체 클릭 수</div>
          <div class="stat-value">${totalClicks} 회</div>
        </div>
        <div class="stat-icon">📊</div>
      </div>
      
      <div class="stat-card" style="grid-column: span 2;">
        <div>
          <div class="stat-label">인기 건강정보 게시글</div>
          <div class="stat-value" style="font-size: 16px; font-weight:700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width:320px;" title="${popularArticle}">
            ${popularArticle}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px; font-weight:600;">클릭 수: ${popularArticleCount}회</div>
        </div>
        <div class="stat-icon" style="background:#e6fcf5; color:#0ca678;">❤️</div>
      </div>

      <div class="stat-card">
        <div>
          <div class="stat-label">가장 활발한 카테고리</div>
          <div class="stat-value">${popularCat}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px; font-weight:600;">클릭 수: ${popularCatCount}회</div>
        </div>
        <div class="stat-icon" style="background:#fff9db; color:#f08c00;">📂</div>
      </div>
    </div>

    <!-- Search Console Panel -->
    <div class="search-panel">
      <div style="font-weight:800; font-size:15px; margin-bottom:14px; color:#1e293b;">🔍 상세 조회수 통계 검색</div>
      
      <div class="search-row">
        <div class="form-group">
          <label class="form-label" style="font-size: 12px; font-weight:700; color:#475569; margin-bottom:4px; display:block;">시작 일자</label>
          <input type="date" id="stats-start-date" class="form-input" style="width:100%; padding:6px 10px; border:1px solid #cbd5e1; border-radius:6px;" value="${searchStartDate}">
        </div>
        
        <div class="form-group">
          <label class="form-label" style="font-size: 12px; font-weight:700; color:#475569; margin-bottom:4px; display:block;">종료 일자</label>
          <input type="date" id="stats-end-date" class="form-input" style="width:100%; padding:6px 10px; border:1px solid #cbd5e1; border-radius:6px;" value="${searchEndDate}">
        </div>

        <div class="form-group">
          <label class="form-label" style="font-size: 12px; font-weight:700; color:#475569; margin-bottom:4px; display:block;">카테고리</label>
          <select id="stats-cat-select" class="form-input" style="width:100%; padding:6px 10px; border:1px solid #cbd5e1; border-radius:6px;">
            <option value="all" ${searchCategory === 'all' ? 'selected' : ''}>전체</option>
            ${healthCategories.map(c => `<option value="${c.id}" ${searchCategory === c.id ? 'selected' : ''}>${c.label}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" style="font-size: 12px; font-weight:700; color:#475569; margin-bottom:4px; display:block;">고객사</label>
          <select id="stats-client-select" class="form-input" style="width:100%; padding:6px 10px; border:1px solid #cbd5e1; border-radius:6px;">
            <option value="all" ${searchClient === 'all' ? 'selected' : ''}>전체</option>
            <option value="kyobo" ${searchClient === 'kyobo' ? 'selected' : ''}>교보생명</option>
            <option value="dasom" ${searchClient === 'dasom' ? 'selected' : ''}>교보다솜케어</option>
            <option value="other" ${searchClient === 'other' ? 'selected' : ''}>A기업</option>
          </select>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="flex:1; margin-right:16px;">
          <input type="text" id="stats-keyword-input" class="form-input" placeholder="게시글 제목 키워드 검색" style="width:100%; max-width:320px; padding:6px 12px; border:1px solid #cbd5e1; border-radius:6px;" value="${searchKeyword}">
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-secondary" onclick="resetStatisticsSearch()" style="padding: 8px 16px; border-radius: 6px;">초기화</button>
          <button class="btn btn-primary" onclick="searchStatisticsLogs()" style="background:var(--primary-color); color:white; border:none; padding: 8px 24px; font-weight:700; border-radius: 6px;">검색하기</button>
        </div>
      </div>
    </div>

    <!-- Search Results Card -->
    <div class="config-card">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <h2 class="card-title">클릭 상세 로그 내역</h2>
        <button class="btn btn-secondary btn-sm" onclick="exportStatsToCsv()" style="display:flex; gap:4px; align-items:center; background:white; border:1px solid #cbd5e1;">
          📥 CSV 내보내기
        </button>
      </div>
      <div class="card-body" style="padding: 0; overflow-x: auto;">
        <table class="premium-table">
          <thead>
            <tr>
              <th width="120">클릭 일자</th>
              <th width="100">시간</th>
              <th>건강정보 게시글 제목</th>
              <th width="140">카테고리</th>
              <th width="150">고객사</th>
              <th width="120">사용자명</th>
            </tr>
          </thead>
          <tbody id="stats-logs-tbody">
            <!-- Filtered rows injected here -->
          </tbody>
        </table>
      </div>
    </div>
  `;

  renderStatsLogsTable();
};

window.searchStatisticsLogs = function() {
  searchStartDate = document.getElementById('stats-start-date').value;
  searchEndDate = document.getElementById('stats-end-date').value;
  searchCategory = document.getElementById('stats-cat-select').value;
  searchClient = document.getElementById('stats-client-select').value;
  searchKeyword = document.getElementById('stats-keyword-input').value.trim();

  renderStatsLogsTable();
};

window.resetStatisticsSearch = function() {
  searchStartDate = '';
  searchEndDate = '';
  searchCategory = 'all';
  searchClient = 'all';
  searchKeyword = '';
  
  renderStatisticsTab();
};

function renderStatsLogsTable() {
  const tbody = document.getElementById('stats-logs-tbody');
  if (!tbody) return;

  const filteredLogs = clickLogs.filter(log => {
    // Date range filter
    if (searchStartDate && log.clickDate < searchStartDate) return false;
    if (searchEndDate && log.clickDate > searchEndDate) return false;
    
    // Category filter
    if (searchCategory !== 'all' && log.categoryId !== searchCategory) return false;
    
    // Client filter
    if (searchClient !== 'all' && log.clientId !== searchClient) return false;
    
    // Keyword search
    if (searchKeyword && !log.postTitle.toLowerCase().includes(searchKeyword.toLowerCase())) return false;

    return true;
  });

  let rowsHtml = '';
  filteredLogs.forEach(log => {
    rowsHtml += `
      <tr>
        <td style="font-weight:600; color:#334155;">${log.clickDate}</td>
        <td style="color:#64748b; font-family:monospace;">${log.clickTime}</td>
        <td style="font-weight:700; color:#0f172a;">${log.postTitle}</td>
        <td><span class="badge-premium badge-primary">${log.categoryLabel}</span></td>
        <td><span class="badge-premium badge-gray">${log.clientName}</span></td>
        <td style="font-weight:600;">${log.userName}</td>
      </tr>
    `;
  });

  tbody.innerHTML = rowsHtml ? rowsHtml : '<tr><td colspan="6" style="text-align:center; padding:48px; color:#64748b;">검색 조건에 맞는 클릭 로그가 없습니다.</td></tr>';
}

window.exportStatsToCsv = function() {
  const filteredLogs = clickLogs.filter(log => {
    if (searchStartDate && log.clickDate < searchStartDate) return false;
    if (searchEndDate && log.clickDate > searchEndDate) return false;
    if (searchCategory !== 'all' && log.categoryId !== searchCategory) return false;
    if (searchClient !== 'all' && log.clientId !== searchClient) return false;
    if (searchKeyword && !log.postTitle.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
    return true;
  });

  if (filteredLogs.length === 0) {
    alert("내보낼 데이터가 없습니다.");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // UTF-8 BOM
  csvContent += "클릭 일자,시간,게시글 제목,카테고리,고객사,사용자명\n";
  
  filteredLogs.forEach(log => {
    const title = log.postTitle.replace(/"/g, '""');
    csvContent += `"${log.clickDate}","${log.clickTime}","${title}","${log.categoryLabel}","${log.clientName}","${log.userName}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `건강정보_조회수_통계_${searchStartDate}_${searchEndDate}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- Common toast simulator ---
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
    <div class="toast-icon">✓</div>
    <span class="toast-msg">${message}</span>
  `;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = "fadeOut 0.3s forwards";
    setTimeout(() => { if(container.contains(toast)) container.removeChild(toast); }, 300);
  }, 2500);
};
