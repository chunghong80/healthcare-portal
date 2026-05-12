// Tab switching logic
window.switchTab = function(tabId) {
  // Update buttons
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  // Update content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
    content.classList.remove('fade-in');
  });
  
  const selectedTab = document.getElementById(`tab-${tabId}`);
  selectedTab.classList.add('active');
  // Trigger reflow to restart animation
  void selectedTab.offsetWidth;
  selectedTab.classList.add('fade-in');
};

// Hospital Data Loading Mock
const mockHospitals = {
  'h1': {
    name: 'GC녹십자아이메드 강남센터',
    bizno: '123-45-67890',
    ceo: '홍길동',
    phone: '02-1234-5678',
    addr: '서울 특별시 서초구 서초대로 38길 12',
    resName: '김예약',
    resPhone: '010-1111-2222',
    resEmail: 'res@gcimed.com',
    conName: '이정산',
    conPhone: '010-3333-4444',
    conEmail: 'con@gcimed.com',
    intro: '최고의 의료진과 최신 장비로 정확한 건강검진을 제공합니다.'
  },
  'h2': {
    name: 'KMI 한국의학연구소 여의도',
    bizno: '987-65-43210',
    ceo: '이순신',
    phone: '02-9876-5432',
    addr: '서울 특별시 영등포구 국제금융로 10',
    resName: '박의료',
    resPhone: '010-5555-6666',
    resEmail: 'med@kmi.com',
    conName: '최결제',
    conPhone: '010-7777-8888',
    conEmail: 'pay@kmi.com',
    intro: '신뢰할 수 있는 건강검진 전문 기관입니다.'
  }
};

window.loadHospitalData = function() {
  const sel = document.getElementById('sel-hospital').value;
  if(!sel) {
    clearHospitalForm();
    return;
  }
  
  const data = mockHospitals[sel];
  if(data) {
    document.getElementById('hosp-name').value = data.name;
    document.getElementById('hosp-bizno').value = data.bizno;
    document.getElementById('hosp-ceo').value = data.ceo;
    document.getElementById('hosp-phone').value = data.phone;
    document.getElementById('hosp-addr').value = data.addr;
    document.getElementById('mgr-res-name').value = data.resName;
    document.getElementById('mgr-res-phone').value = data.resPhone;
    document.getElementById('mgr-res-email').value = data.resEmail;
    document.getElementById('mgr-con-name').value = data.conName;
    document.getElementById('mgr-con-phone').value = data.conPhone;
    document.getElementById('mgr-con-email').value = data.conEmail;
    document.getElementById('hosp-intro').value = data.intro;
  }
};

window.clearHospitalForm = function() {
  document.getElementById('sel-hospital').value = '';
  document.querySelectorAll('#tab-hospital input, #tab-hospital textarea').forEach(el => el.value = '');
};

// Dynamic Table Rows Logic
window.addTableRow = function(type) {
  const tbody = document.querySelector(`#table-${type} tbody`);
  const tr = document.createElement('tr');
  
  // Category options mock
  const largeCats = `<option>선택</option><option value="기초">기초검사</option><option value="혈액">혈액검사</option><option value="초음파">초음파</option><option value="내시경">내시경</option>`;
  
  if (type === 'basic') {
    tr.innerHTML = `
      <td><select class="form-select">${largeCats}</select></td>
      <td><input type="text" class="form-input" placeholder="중분류"></td>
      <td><input type="text" class="form-input" placeholder="소분류"></td>
      <td><input type="text" class="form-input" placeholder="검사항목명"></td>
      <td><input type="text" class="form-input" placeholder="설명"></td>
      <td><button class="btn btn-danger btn-sm" onclick="this.closest('tr').remove()">삭제</button></td>
    `;
  } else if (type === 'optional') {
    tr.innerHTML = `
      <td><input type="text" class="form-input" placeholder="A그룹"></td>
      <td><select class="form-select">${largeCats}</select></td>
      <td><input type="text" class="form-input" placeholder="중분류"></td>
      <td><input type="text" class="form-input" placeholder="검사항목명"></td>
      <td><input type="number" class="form-input" placeholder="0"></td>
      <td><input type="text" class="form-input" placeholder="설명"></td>
      <td><button class="btn btn-danger btn-sm" onclick="this.closest('tr').remove()">삭제</button></td>
    `;
  } else if (type === 'additional') {
    tr.innerHTML = `
      <td><select class="form-select">${largeCats}</select></td>
      <td><input type="text" class="form-input" placeholder="중분류"></td>
      <td><input type="text" class="form-input" placeholder="검사항목명"></td>
      <td><input type="number" class="form-input" placeholder="0"></td>
      <td><input type="text" class="form-input" placeholder="설명"></td>
      <td><button class="btn btn-danger btn-sm" onclick="this.closest('tr').remove()">삭제</button></td>
    `;
  }
  
  tbody.appendChild(tr);
};

window.saveCheckupData = function() {
  showToast('등록하신 병원 및 패키지 정보가 성공적으로 저장되었습니다.');
};

function showToast(message) {
  let container = document.getElementById("toast-container");
  if(!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
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
    toast.style.animation = "fadeOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards";
    setTimeout(() => {
      if(container.contains(toast)) {
        container.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// Initialize tables with at least one row
document.addEventListener('DOMContentLoaded', () => {
    addTableRow('basic');
    addTableRow('optional');
    addTableRow('additional');
});
