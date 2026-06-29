/**
 * Hospital Reservation Schedule and Deadline Management (병원별 일정/마감 관리)
 * Overhauled code with interactive Tree Category checklist, repeating weekday filters,
 * top filter bar, and Monthly/Yearly view toggles.
 */

// --- Global States ---
let currentHosp = "pohang";
let currentYear = 2026;
let currentMonth = 6;
let viewMode = "month"; // "month" or "year"

// Airbnb style range selection variables (Date strings: "YYYY-MM-DD")
let rangeStart = null;
let rangeEnd = null;

// Weekdays selected for repeating filter (0 = Sun, 1 = Mon, ..., 6 = Sat)
let selectedWeekdays = new Set();

// Local memory representation of schedules
// Structure: { [hospId]: { [year]: { [month]: { [day]: { status: 'avail'|'closed'|'holiday', closedTests: [] } } } } }
let scheduleData = {};

const HOSP_NAMES = {
  pohang: "포항세명기독병원",
  "green-gn": "GC녹십자아이메드 강남센터",
  "kmi-yyd": "KMI 한국의학연구소 여의도"
};

const CHECKUP_LABELS = {
  colon_all: "대장내시경 전체",
  colon_sleep: "대장내시경(수면)",
  colon_nonsleep: "대장내시경(비수면)",
  stomach_all: "위내시경 전체",
  stomach_sleep: "위내시경(수면)",
  stomach_nonsleep: "위내시경(비수면)",
  mri_all: "MRI 전체",
  mri_brain: "뇌 MRI",
  mri_liver: "간 MRI",
  mri_neck: "경추 MRI",
  mri_spine: "요추 MRI"
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  setupEventListeners();
  syncFiltersFromDropdowns();
  
  // Set default initial range selection to 2026-06-01 to 2026-06-30
  rangeStart = "2026-06-01";
  rangeEnd = "2026-06-30";
  document.getElementById("start-date-input").value = rangeStart;
  document.getElementById("end-date-input").value = rangeEnd;
  
  initTreeCheckboxes();
  updateWeekdayButtonsState();
  renderAll();
  setupOptionTreeListeners();
});

// --- Data Loading & Mock Defaults ---
function loadData() {
  const saved = localStorage.getItem("hc_hospital_schedules");
  if (saved) {
    try {
      scheduleData = JSON.parse(saved);
      return;
    } catch (e) {
      console.error("Failed to parse saved schedule data:", e);
    }
  }
  
  // Set default initial mock data for 2026 Pohang Hospital to match user screenshot EXACTLY
  initializeDefaultMockData();
}

function initializeDefaultMockData() {
  scheduleData = {
    pohang: {
      2026: {}
    }
  };

  // Pre-fill 12 months for 2026 Pohang
  for (let m = 1; m <= 12; m++) {
    scheduleData.pohang[2026][m] = {};
    const daysInMonth = new Date(2026, m, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(2026, m - 1, d);
      const dayOfWeek = dateObj.getDay();

      if (dayOfWeek === 0) {
        // Sundays are Holidays (7, 14, 21, 28 etc)
        scheduleData.pohang[2026][m][d] = { status: "holiday", closedTests: [] };
      } else if (m === 6 && [1, 3, 8, 11, 17, 22, 25, 29].includes(d)) {
        // June closed days (Grey badge in mockup)
        scheduleData.pohang[2026][m][d] = { status: "closed", closedTests: [] };
      } else if (m === 6 && [2, 6, 9, 13, 16, 20, 23, 27, 30].includes(d)) {
        // June available days with some closed items
        scheduleData.pohang[2026][m][d] = { 
          status: "avail", 
          closedTests: ["colon_sleep", "mri_brain"] 
        };
      } else {
        // Regular available days
        scheduleData.pohang[2026][m][d] = { status: "avail", closedTests: [] };
      }
    }
  }
  
  saveDataToStorage(false); // Silent save
}

function saveDataToStorage(showToastMsg = true) {
  localStorage.setItem("hc_hospital_schedules", JSON.stringify(scheduleData));
  if (showToastMsg) {
    showToast("병원 예약 일정 설정이 성공적으로 저장되었습니다!");
  }
}

// --- Setup Checkbox Tree Interactivity ---
function setupOptionTreeListeners() {
  // Parent check triggers child checks
  document.querySelectorAll(".parent-cb").forEach(parent => {
    parent.addEventListener("change", (e) => {
      const category = parent.dataset.target;
      const checked = parent.checked;
      const children = document.querySelectorAll(`.child-cb[data-parent="${category}"]`);
      children.forEach(child => {
        child.checked = checked;
      });
      updateSelectedCount();
    });
  });

  // Child check updates parent check state
  document.querySelectorAll(".child-cb").forEach(child => {
    child.addEventListener("change", (e) => {
      const category = child.dataset.parent;
      const siblings = document.querySelectorAll(`.child-cb[data-parent="${category}"]`);
      const checkedSiblings = document.querySelectorAll(`.child-cb[data-parent="${category}"]:checked`);
      const parent = document.querySelector(`.parent-cb[data-target="${category}"]`);
      
      if (checkedSiblings.length === siblings.length) {
        parent.checked = true;
        parent.indeterminate = false;
      } else if (checkedSiblings.length === 0) {
        parent.checked = false;
        parent.indeterminate = false;
      } else {
        parent.checked = false;
        parent.indeterminate = true;
      }
      updateSelectedCount();
    });
  });

  // Tree Node row caret toggle collapses tree
  document.querySelectorAll(".tree-node-row").forEach(row => {
    const caret = row.querySelector(".tree-caret");
    const childrenDiv = row.nextElementSibling;

    row.addEventListener("click", (e) => {
      // Prevent collapse when clicking directly on checkbox or checkbox labels
      if (e.target.tagName === "INPUT" || e.target.closest(".tree-label")) {
        return;
      }

      caret.classList.toggle("collapsed");
      if (caret.classList.contains("collapsed")) {
        childrenDiv.style.display = "none";
        caret.innerText = "▶";
      } else {
        childrenDiv.style.display = "flex";
        caret.innerText = "▼";
      }
    });
  });

  // Search feature for checkups tree
  document.getElementById("tree-search-input").addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const parents = document.querySelectorAll(".tree-parent");

    parents.forEach(parent => {
      const childrenRows = parent.querySelectorAll(".tree-child-row");
      let visibleChildren = 0;

      childrenRows.forEach(row => {
        const text = row.querySelector(".tree-text").innerText.toLowerCase();
        if (text.includes(query)) {
          row.style.display = "flex";
          visibleChildren++;
        } else {
          row.style.display = "none";
        }
      });

      const parentText = parent.querySelector(".tree-node-row .tree-text").innerText.toLowerCase();
      if (visibleChildren > 0 || parentText.includes(query)) {
        parent.style.display = "block";
      } else {
        parent.style.display = "none";
      }
    });
  });

  // Reset tree selections
  document.getElementById("btn-reset-tree").addEventListener("click", () => {
    document.querySelectorAll(".tree-cb").forEach(cb => {
      cb.checked = false;
      cb.indeterminate = false;
    });
    updateSelectedCount();
    showToast("검사항목 선택이 모두 해제되었습니다.");
  });

  // Confirm selection button
  document.getElementById("btn-confirm-selection").addEventListener("click", () => {
    const checked = [];
    document.querySelectorAll(".child-cb:checked").forEach(cb => {
      const label = cb.nextElementSibling.innerText;
      checked.push(label);
    });
    if (checked.length === 0) {
      alert("선택된 검사 항목이 없습니다. 좌측에서 항목을 체크하세요.");
    } else {
      alert(`[선택 확인] 총 ${checked.length}개 항목:\n- ` + checked.join("\n- "));
    }
  });
}

function initTreeCheckboxes() {
  // Pre-check colon children
  document.querySelectorAll(`.child-cb[data-parent="colon"]`).forEach(cb => cb.checked = true);
  document.querySelector(`.parent-cb[data-target="colon"]`).checked = true;

  // Pre-check stomach children
  document.querySelectorAll(`.child-cb[data-parent="stomach"]`).forEach(cb => cb.checked = true);
  document.querySelector(`.parent-cb[data-target="stomach"]`).checked = true;

  // Pre-check some mri children
  document.querySelector(`.child-cb[value="mri_all"]`).checked = true;
  document.querySelector(`.child-cb[value="mri_brain"]`).checked = true;
  
  // Set indeterminate for parent mri
  document.querySelector(`.parent-cb[data-target="mri"]`).indeterminate = true;

  updateSelectedCount();
}

function updateSelectedCount() {
  const checked = document.querySelectorAll(".child-cb:checked").length;
  document.getElementById("selected-items-count").innerText = checked;
}

// --- Setup Event Listeners ---
function setupEventListeners() {
  // Dropdown filter changes
  document.getElementById("hosp-select").addEventListener("change", (e) => {
    currentHosp = e.target.value;
    clearRangeSelection();
    renderAll();
  });

  // Date inputs change
  document.getElementById("start-date-input").addEventListener("change", handleDateInputsChange);
  document.getElementById("end-date-input").addEventListener("change", handleDateInputsChange);

  // View mode switcher (Monthly vs Yearly)
  document.getElementById("view-mode-select").addEventListener("change", (e) => {
    viewMode = e.target.value;
    const navLabel = document.getElementById("calendar-month-label");
    
    if (viewMode === "year") {
      document.getElementById("admin-calendar-grid").style.display = "none";
      document.getElementById("admin-calendar-yearly-grid").style.display = "grid";
      navLabel.innerText = `${currentYear}년`;
    } else {
      document.getElementById("admin-calendar-grid").style.display = "grid";
      document.getElementById("admin-calendar-yearly-grid").style.display = "none";
      navLabel.innerText = `${currentYear}년 ${currentMonth}월`;
    }
    renderAll();
  });

  // Calendar navigation arrows
  document.getElementById("btn-prev-month").addEventListener("click", () => {
    navigateCalendar(-1);
  });
  
  document.getElementById("btn-next-month").addEventListener("click", () => {
    navigateCalendar(1);
  });

  // Quick Range buttons
  document.querySelectorAll(".btn-quick").forEach(btn => {
    btn.addEventListener("click", handleQuickRangeClick);
  });

  // Weekday toggle buttons
  document.querySelectorAll(".btn-weekday").forEach(btn => {
    btn.addEventListener("click", handleWeekdayToggle);
  });

  // Action Apply buttons
  document.getElementById("btn-apply-avail").addEventListener("click", () => applyStatus("avail"));
  document.getElementById("btn-apply-closed").addEventListener("click", () => applyStatus("closed"));
  document.getElementById("btn-apply-holiday").addEventListener("click", () => applyStatus("holiday"));

  // Copy previous settings
  document.getElementById("btn-copy-prev").addEventListener("click", copyPrevMonthSettings);

  // Save Settings button
  document.getElementById("btn-save-all").addEventListener("click", () => {
    saveDataToStorage(true);
  });

  // View applied history (Demonstrative modal/alert)
  document.getElementById("btn-view-history").addEventListener("click", () => {
    alert("최근 설정 이력:\n1. 2026-06-01 ~ 2026-06-30 기간 내 대장/위내시경 마감 설정 적용 완료\n2. 매주 일요일 공휴일 지정 자동화");
  });
}

function syncFiltersFromDropdowns() {
  currentHosp = document.getElementById("hosp-select").value;
}

// --- Quick Date Range Handlers ---
function handleQuickRangeClick(e) {
  const btn = e.currentTarget;
  document.querySelectorAll(".btn-quick").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  const range = btn.dataset.range;
  const today = new Date();
  let start = new Date(today);
  let end = new Date(today);

  if (range === "1m") {
    end.setMonth(today.getMonth() + 1);
  } else if (range === "3m") {
    end.setMonth(today.getMonth() + 3);
  } else if (range === "6m") {
    end.setMonth(today.getMonth() + 6);
  } else if (range === "1y") {
    end.setFullYear(today.getFullYear() + 1);
  }

  rangeStart = formatDateStr(start);
  rangeEnd = formatDateStr(end);

  document.getElementById("start-date-input").value = rangeStart;
  document.getElementById("end-date-input").value = rangeEnd;

  // Jump monthly calendar to start date's year/month
  currentYear = start.getFullYear();
  currentMonth = start.getMonth() + 1;

  updateWeekdayButtonsState();
  renderAll();
  updateHighlights();
}

// --- Date Inputs Handlers ---
function handleDateInputsChange() {
  const startVal = document.getElementById("start-date-input").value;
  const endVal = document.getElementById("end-date-input").value;

  rangeStart = startVal || null;
  rangeEnd = endVal || null;

  // Swap dates if start is later than end
  if (rangeStart && rangeEnd && rangeStart > rangeEnd) {
    const temp = rangeStart;
    rangeStart = rangeEnd;
    rangeEnd = temp;
    document.getElementById("start-date-input").value = rangeStart;
    document.getElementById("end-date-input").value = rangeEnd;
  }

  // Auto-navigate calendar to start date if possible
  if (rangeStart) {
    const parts = rangeStart.split("-");
    currentYear = parseInt(parts[0]);
    currentMonth = parseInt(parts[1]);
  }

  updateWeekdayButtonsState();
  renderAll();
  updateHighlights();
}

function updateWeekdayButtonsState() {
  const buttons = document.querySelectorAll(".btn-weekday");
  if (rangeStart && rangeEnd) {
    buttons.forEach(btn => {
      btn.removeAttribute("disabled");
      btn.removeAttribute("data-tooltip");
    });
  } else {
    buttons.forEach(btn => {
      btn.setAttribute("disabled", "true");
      btn.setAttribute("data-tooltip", "기간 설정 후 선택 가능");
      btn.classList.remove("active");
    });
    selectedWeekdays.clear();
  }
}

// --- Weekday Repeat Filter Handlers ---
function handleWeekdayToggle(e) {
  const btn = e.currentTarget;
  const day = btn.dataset.day;

  if (day === "all") {
    const allActive = btn.classList.contains("active");
    document.querySelectorAll(".btn-weekday").forEach(b => {
      if (b.dataset.day !== "all") {
        if (allActive) {
          b.classList.remove("active");
          selectedWeekdays.delete(parseInt(b.dataset.day));
        } else {
          b.classList.add("active");
          selectedWeekdays.add(parseInt(b.dataset.day));
        }
      }
    });
    btn.classList.toggle("active");
  } else {
    btn.classList.toggle("active");
    const dayNum = parseInt(day);
    if (selectedWeekdays.has(dayNum)) {
      selectedWeekdays.delete(dayNum);
    } else {
      selectedWeekdays.add(dayNum);
    }

    // Sync "all" button state
    const allBtn = document.querySelector('.btn-weekday[data-day="all"]');
    if (selectedWeekdays.size === 7) {
      allBtn.classList.add("active");
    } else {
      allBtn.classList.remove("active");
    }
  }
}

// --- Calendar Navigation ---
function navigateCalendar(dir) {
  if (viewMode === "year") {
    // Navigate years
    currentYear += dir;
    document.getElementById("calendar-month-label").innerText = `${currentYear}년`;
  } else {
    // Navigate months
    currentMonth += dir;
    if (currentMonth < 1) {
      currentMonth = 12;
      currentYear -= 1;
    } else if (currentMonth > 12) {
      currentMonth = 1;
      currentYear += 1;
    }
    document.getElementById("calendar-month-label").innerText = `${currentYear}년 ${currentMonth}월`;
  }
  renderAll();
  updateHighlights();
}

function clearRangeSelection() {
  rangeStart = null;
  rangeEnd = null;
  document.getElementById("start-date-input").value = "";
  document.getElementById("end-date-input").value = "";
  document.querySelectorAll(".btn-quick").forEach(b => b.classList.remove("active"));
  updateWeekdayButtonsState();
  updateHighlights();
}

// --- Schedule Applier (예약가능, 마감, 휴일 버튼) ---
function applyStatus(status) {
  if (!rangeStart || !rangeEnd) {
    alert("일정을 적용할 기간(시작일 및 종료일)을 먼저 입력하거나 달력에서 드래그하여 선택하세요.");
    return;
  }

  const startDate = new Date(rangeStart);
  const endDate = new Date(rangeEnd);

  // Get selected tree items
  const selectedItems = [];
  document.querySelectorAll(".child-cb:checked").forEach(cb => {
    selectedItems.push(cb.value);
  });

  let currentDate = new Date(startDate);
  let appliedCount = 0;

  while (currentDate <= endDate) {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth() + 1;
    const d = currentDate.getDate();
    const dayOfWeek = currentDate.getDay();

    // Check if weekday filter is matched (or if no weekdays are selected, apply to all)
    if (selectedWeekdays.size === 0 || selectedWeekdays.has(dayOfWeek)) {
      ensureScheduleSpaceForMonth(y, m);
      const dayConfig = scheduleData[currentHosp][y][m][d];

      if (status === "holiday") {
        dayConfig.status = "holiday";
        dayConfig.closedTests = [];
      } else if (status === "closed") {
        // If all 11 items are selected or none is checked, close the whole day
        if (selectedItems.length === 11 || selectedItems.length === 0) {
          dayConfig.status = "closed";
          dayConfig.closedTests = [];
        } else {
          dayConfig.status = "avail";
          // Add items to closedTests uniquely
          selectedItems.forEach(item => {
            if (!dayConfig.closedTests.includes(item)) {
              dayConfig.closedTests.push(item);
            }
          });
        }
      } else if (status === "avail") {
        if (selectedItems.length === 11 || selectedItems.length === 0) {
          dayConfig.status = "avail";
          dayConfig.closedTests = [];
        } else {
          dayConfig.status = "avail";
          // Remove selected items from closedTests
          dayConfig.closedTests = dayConfig.closedTests.filter(item => !selectedItems.includes(item));
        }
      }
      appliedCount++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  renderAll();
  updateHighlights();

  let msg = `[${status === "avail" ? "예약가능" : status === "closed" ? "마감" : "휴일"}] 상태가 ${appliedCount}개 일자에 적용되었습니다.`;
  if (selectedWeekdays.size > 0) {
    msg += " (※ 요일 필터 반복 적용됨)";
  }
  showToast(msg);
}

// --- Admin Range Selection Engine ---
function handleAdminCellClick(dateStr) {
  if (rangeStart === null) {
    rangeStart = dateStr;
    rangeEnd = null;
  } else if (rangeEnd === null) {
    if (dateStr >= rangeStart) {
      rangeEnd = dateStr;
    } else {
      rangeStart = dateStr;
      rangeEnd = null;
    }
  } else {
    rangeStart = dateStr;
    rangeEnd = null;
  }

  document.getElementById("start-date-input").value = rangeStart || "";
  document.getElementById("end-date-input").value = rangeEnd || rangeStart || "";

  updateWeekdayButtonsState();
  updateHighlights();
}

function updateHighlights() {
  const cells = document.querySelectorAll(".admin-day-cell");
  cells.forEach(cell => {
    const d = parseInt(cell.dataset.day);
    if (!d) return;

    const dateStr = formatDateStrFromYMD(currentYear, currentMonth, d);
    cell.classList.remove("range-start", "range-mid", "range-end");

    if (rangeStart !== null && rangeEnd !== null) {
      if (dateStr === rangeStart) {
        cell.classList.add("range-start");
      } else if (dateStr === rangeEnd) {
        cell.classList.add("range-end");
      } else if (dateStr > rangeStart && dateStr < rangeEnd) {
        cell.classList.add("range-mid");
      }
    } else if (rangeStart !== null) {
      if (dateStr === rangeStart) {
        cell.classList.add("range-start", "range-end");
      }
    }
  });
}

// --- Render Operations ---
function renderAll() {
  ensureScheduleSpaceForMonth(currentYear, currentMonth);
  if (viewMode === "year") {
    renderYearlyCalendar();
  } else {
    renderMonthlyCalendar();
  }
}

function ensureScheduleSpaceForMonth(year, month) {
  if (!scheduleData[currentHosp]) {
    scheduleData[currentHosp] = {};
  }
  if (!scheduleData[currentHosp][year]) {
    scheduleData[currentHosp][year] = {};
  }
  if (!scheduleData[currentHosp][year][month]) {
    scheduleData[currentHosp][year][month] = {};
    
    // Automatically generate basic defaults
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month - 1, d);
      const dayOfWeek = dateObj.getDay();
      if (dayOfWeek === 0) {
        scheduleData[currentHosp][year][month][d] = { status: "holiday", closedTests: [] };
      } else {
        scheduleData[currentHosp][year][month][d] = { status: "avail", closedTests: [] };
      }
    }
  }
}

// --- Render Monthly Calendar Grid ---
function renderMonthlyCalendar() {
  const container = document.getElementById("admin-calendar-grid");
  container.innerHTML = "";

  // Add weekday headers
  const headers = ["일", "월", "화", "수", "목", "금", "토"];
  headers.forEach((h, idx) => {
    const el = document.createElement("div");
    el.className = "calendar-day-header";
    if (idx === 0) el.classList.add("sun");
    if (idx === 6) el.classList.add("sat");
    el.innerText = h;
    container.appendChild(el);
  });

  const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const monthData = scheduleData[currentHosp][currentYear][currentMonth];

  // 1. Padding days
  for (let i = 0; i < firstDayIndex; i++) {
    const el = document.createElement("div");
    el.className = "admin-day-cell other-month";
    container.appendChild(el);
  }

  // 2. Active days of month
  for (let d = 1; d <= daysInMonth; d++) {
    const dayConfig = monthData[d] || { status: "avail", closedTests: [] };
    const dateObj = new Date(currentYear, currentMonth - 1, d);
    const dayOfWeek = dateObj.getDay();

    const cell = document.createElement("div");
    cell.className = "admin-day-cell";
    if (dayOfWeek === 0) cell.classList.add("sun");
    if (dayOfWeek === 6) cell.classList.add("sat");
    cell.dataset.day = d;
    
    let statusText = "예약가능";
    let statusClass = "avail";
    if (dayConfig.status === "closed") {
      statusText = "마감";
      statusClass = "closed";
    } else if (dayConfig.status === "holiday") {
      statusText = "휴일";
      statusClass = "holiday";
    }

    let closedTagsHtml = "";
    if (dayConfig.status === "avail" && dayConfig.closedTests && dayConfig.closedTests.length > 0) {
      closedTagsHtml = `<div class="closed-items-list">`;
      dayConfig.closedTests.forEach(test => {
        const label = CHECKUP_LABELS[test] || test;
        closedTagsHtml += `<span class="closed-item-tag" title="${label} 마감">· ${label} 마감</span>`;
      });
      closedTagsHtml += `</div>`;
    }

    cell.innerHTML = `
      <div class="day-num-row">
        <span class="day-num">${d}</span>
        <span class="day-status-badge ${statusClass}">${statusText}</span>
      </div>
      ${closedTagsHtml}
    `;

    const dateStr = formatDateStrFromYMD(currentYear, currentMonth, d);
    cell.addEventListener("click", () => {
      handleAdminCellClick(dateStr);
    });

    container.appendChild(cell);
  }
}

// --- Render Yearly Calendar Grid ---
function renderYearlyCalendar() {
  const container = document.getElementById("admin-calendar-yearly-grid");
  container.innerHTML = "";

  for (let m = 1; m <= 12; m++) {
    ensureScheduleSpaceForMonth(currentYear, m);
    const monthData = scheduleData[currentHosp][currentYear][m];
    const daysInMonth = new Date(currentYear, m, 0).getDate();
    const firstDayIndex = new Date(currentYear, m - 1, 1).getDay();

    // Mini month wrapper
    const monthBox = document.createElement("div");
    monthBox.className = "mini-month-box";
    monthBox.dataset.month = m;

    monthBox.innerHTML = `
      <div class="mini-month-title">${currentYear}년 ${m}월</div>
      <div class="mini-month-days-header">
        <span class="sun">일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span class="sat">토</span>
      </div>
    `;

    const daysGrid = document.createElement("div");
    daysGrid.className = "mini-month-days-grid";

    // 1. Padding days
    for (let i = 0; i < firstDayIndex; i++) {
      const pad = document.createElement("span");
      pad.className = "mini-day-cell other-month";
      daysGrid.appendChild(pad);
    }

    // 2. Active days
    for (let d = 1; d <= daysInMonth; d++) {
      const dayConfig = monthData[d] || { status: "avail", closedTests: [] };
      const dayCell = document.createElement("span");
      dayCell.className = `mini-day-cell ${dayConfig.status}`;
      dayCell.innerText = d;

      // Add tooltip text
      let tooltipMsg = `${m}월 ${d}일: `;
      if (dayConfig.status === "holiday") {
        tooltipMsg += "휴일";
      } else if (dayConfig.status === "closed") {
        tooltipMsg += "예약 마감";
      } else {
        tooltipMsg += "예약 가능";
        if (dayConfig.closedTests.length > 0) {
          const names = dayConfig.closedTests.map(test => CHECKUP_LABELS[test] || test);
          tooltipMsg += ` (${names.join(", ")} 마감)`;
        }
      }
      dayCell.setAttribute("data-tooltip", tooltipMsg);

      daysGrid.appendChild(dayCell);
    }

    monthBox.appendChild(daysGrid);

    // Click on mini calendar switches view to Monthly view of that month
    monthBox.addEventListener("click", () => {
      viewMode = "month";
      currentMonth = m;
      document.getElementById("view-mode-select").value = "month";
      document.getElementById("admin-calendar-grid").style.display = "grid";
      document.getElementById("admin-calendar-yearly-grid").style.display = "none";
      document.getElementById("calendar-month-label").innerText = `${currentYear}년 ${currentMonth}월`;
      renderAll();
      updateHighlights();
    });

    container.appendChild(monthBox);
  }
}

// --- Copy Settings Engine ---
function copyPrevMonthSettings() {
  let prevMonth = currentMonth - 1;
  let prevYear = currentYear;
  if (prevMonth < 1) {
    prevMonth = 12;
    prevYear -= 1;
  }

  const prevData = scheduleData[currentHosp]?.[prevYear]?.[prevMonth];
  if (!prevData) {
    alert(`${prevYear}년 ${prevMonth}월의 기존 설정 데이터가 존재하지 않습니다.`);
    return;
  }

  if (confirm(`${prevYear}년 ${prevMonth}월의 마감 설정을 현재 달(${currentYear}년 ${currentMonth}월)로 복사하시겠습니까?\n(일치하는 날짜까지만 복사됩니다)`)) {
    const daysInCurrent = new Date(currentYear, currentMonth, 0).getDate();
    const daysInPrev = new Date(prevYear, prevMonth, 0).getDate();
    const limit = Math.min(daysInCurrent, daysInPrev);

    for (let d = 1; d <= limit; d++) {
      if (prevData[d]) {
        scheduleData[currentHosp][currentYear][currentMonth][d] = JSON.parse(JSON.stringify(prevData[d]));
      }
    }

    clearRangeSelection();
    renderAll();
    showToast(`${prevYear}년 ${prevMonth}월 설정을 성공적으로 복사해왔습니다.`);
  }
}

// --- Utilities ---
function formatDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDateStrFromYMD(y, m, d) {
  const mStr = String(m).padStart(2, "0");
  const dStr = String(d).padStart(2, "0");
  return `${y}-${mStr}-${dStr}`;
}

// --- Toast Utility ---
function showToast(msg) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `
    <span style="color:#10b981; font-weight:bold;">✓</span>
    <span>${msg}</span>
  `;
  container.appendChild(el);

  setTimeout(() => {
    el.style.animation = "fadeOut 0.4s ease-out forwards";
    setTimeout(() => {
      el.remove();
    }, 400);
  }, 3000);
}
