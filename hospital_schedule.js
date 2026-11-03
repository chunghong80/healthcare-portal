/* Hospital schedule editor. Storage adapter remains local until the service API is connected. */
const SCHEDULE_KEY = 'hc_hospital_schedules';
const KIND_NAMES = { holiday: '휴일', day: '일자마감', items: '특정항목마감' };
const HOSPITAL_ALIASES = { h1: 'green-gn', h2: 'kmi-yyd' };
const DEFAULT_HOSPITALS = [
  { id: 'pohang', name: '포항세명기독병원' },
  { id: 'green-gn', name: 'GC녹십자아이메드 강남센터' },
  { id: 'kmi-yyd', name: 'KMI 한국의학연구소 여의도' }
];
const EXAMPLE_ITEMS = [
  { code: 'DEMO_CT_CHEST', name: '흉부 CT', closureCheckYn: 'Y', closureType: 'CT' },
  { code: 'DEMO_CT_BRAIN', name: '뇌 CT', closureCheckYn: 'Y', closureType: 'CT' },
  { code: 'C029002', name: '위내시경(수면)', closureCheckYn: 'Y', closureType: '내시경' },
  { code: 'C029003', name: '위내시경(비수면)', closureCheckYn: 'Y', closureType: '내시경' },
  { code: 'C029004', name: '대장내시경(수면)', closureCheckYn: 'Y', closureType: '내시경' },
  { code: 'C030002', name: '유방초음파(여)', closureCheckYn: 'Y', closureType: '초음파' },
  { code: 'C030003', name: '갑상선초음파', closureCheckYn: 'Y', closureType: '초음파' },
  { code: 'C030006', name: '경동맥초음파', closureCheckYn: 'Y', closureType: '초음파' },
  { code: 'C030007', name: '복부초음파', closureCheckYn: 'Y', closureType: '초음파' },
  { code: 'C028003', name: '파노라마촬영', closureCheckYn: 'N', closureType: 'X-ray' }
];
const EXAMPLE_PACKAGES = [
  { hospitalId: 'pohang', year: 2026, items: { basic: ['C028003','C029002','C029003'], optional: ['C029004','C030002','C030003','C030006','C030007'] } },
  { hospitalId: 'pohang', year: 2026, items: { basic: ['C029002'], optional: ['C030003'] } },
  { hospitalId: 'green-gn', year: 2026, items: { basic: ['C029002','C029003'], optional: ['C030003','C030007'] } },
  { hospitalId: 'kmi-yyd', year: 2026, items: { basic: ['C029004'], optional: ['C030002','C030006'] } },
  { hospitalId: 'pohang', year: 2027, items: { basic: ['C029002','C029003'], optional: ['C030007'] } }
];
EXAMPLE_PACKAGES.forEach(pkg => pkg.items.optional.push('DEMO_CT_CHEST', 'DEMO_CT_BRAIN'));
const LEGACY_CODES = { stomach_sleep: ['C029002'], stomach_nonsleep: ['C029003'], stomach_all: ['C029002','C029003'], colon_sleep: ['C029004'], colon_all: ['C029004','colon_nonsleep'], mri_all: ['mri_brain','mri_liver','mri_neck','mri_spine'] };
const LEGACY_NAMES = { colon_nonsleep:'대장내시경(비수면)',mri_brain:'뇌 MRI',mri_liver:'간 MRI',mri_neck:'경추 MRI',mri_spine:'요추 MRI' };
const canonicalHospital = id => HOSPITAL_ALIASES[String(id)] || String(id);
const escapeSchedule = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const copySchedule = value => JSON.parse(JSON.stringify(value));
const dateKey = date => date.toISOString().slice(0, 10);
function parseScheduleDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
  const date = new Date(value + 'T00:00:00.000Z');
  return Number.isNaN(date.getTime()) || dateKey(date) !== value ? null : date;
}
function rangeDates(start, end, weekdays = []) {
  const first = parseScheduleDate(start), last = parseScheduleDate(end);
  if (!first || !last || start > end) throw new Error('시작일과 종료일을 올바르게 입력해 주세요. 시작일은 종료일보다 늦을 수 없습니다.');
  const days = [];
  for (let date = first; date <= last; date.setUTCDate(date.getUTCDate() + 1)) {
    if (!weekdays.length || weekdays.includes(date.getUTCDay())) days.push(dateKey(date));
  }
  if (!days.length) throw new Error('선택한 기간에 해당 요일이 없습니다.');
  return days;
}
function normalizeScheduleDay(raw = {}) {
  return {
    holidayOverride: typeof raw.holidayOverride === 'boolean' ? raw.holidayOverride : null,
    holiday: raw.holiday ?? (raw.status === 'holiday'),
    dayClosed: raw.dayClosed ?? (raw.status === 'closed'),
    closedTests: [...new Set((Array.isArray(raw.closedTests) ? raw.closedTests : []).flatMap(code => LEGACY_CODES[code] || [String(code)]))]
  };
}
function normalizeScheduleStore(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('일정 데이터 형식을 확인해 주세요.');
  const output = { __meta: { revision: raw.__meta?.revision || 0, history: raw.__meta?.history || [] } };
  for (const [hospital, years] of Object.entries(raw)) {
    if (hospital === '__meta') continue;
    if (!years || typeof years !== 'object') throw new Error('병원 일정 데이터를 확인해 주세요.');
    const key = canonicalHospital(hospital);
    output[key] ||= {};
    for (const [year, months] of Object.entries(years)) {
      output[key][year] ||= {};
      for (const [month, days] of Object.entries(months)) {
        output[key][year][month] ||= {};
        for (const [day, config] of Object.entries(days)) output[key][year][month][day] = normalizeScheduleDay(config);
      }
    }
  }
  return output;
}
function readScheduleDay(store, hospital, date) {
  const [year, month, day] = date.split('-').map(Number);
  return normalizeScheduleDay(store[canonicalHospital(hospital)]?.[year]?.[month]?.[day]);
}
function setScheduleDay(store, hospital, date, day) {
  const [year, month, number] = date.split('-').map(Number), key = canonicalHospital(hospital);
  store[key] ||= {}; store[key][year] ||= {}; store[key][year][month] ||= {};
  // Keep the previous status field readable while retaining independent restrictions.
  store[key][year][month][number] = { ...day, status: day.holiday ? 'holiday' : day.dayClosed ? 'closed' : 'avail' };
}
function applyScheduleOperation(store, operation) {
  for (const date of operation.dates) {
    const day = readScheduleDay(store, operation.hospital, date);
    const enabled = operation.action === 'set';
    if (operation.kind === 'holiday') { day.holiday = enabled; day.holidayOverride = enabled; }
    else if (operation.kind === 'day') day.dayClosed = enabled;
    else if (operation.kind === 'items') day.closedTests = enabled
      ? [...new Set([...day.closedTests, ...operation.codes])]
      : day.closedTests.filter(code => !operation.codes.includes(code));
    setScheduleDay(store, operation.hospital, date, day);
  }
  return store;
}
function packageCodes(pkg) {
  const items = pkg.items || {};
  const references = Array.isArray(items) ? items : [...(items.basic || []), ...(items.optional || [])];
  return references.map(item => String(typeof item === 'object' ? (item.code ?? item.id) : item));
}
function eligibleScheduleItems(hospital, year, items, packages) {
  const codes = new Set(packages.filter(pkg => canonicalHospital(pkg.hospitalId) === canonicalHospital(hospital) && String(pkg.year) === String(year)).flatMap(packageCodes));
  const unique = new Map();
  for (const item of items) {
    const code = String(item.code ?? item.id);
    if (codes.has(code) && item.closureCheckYn === 'Y' && item.closureType && item.name) unique.set(code, { code, name: item.name, type: item.closureType });
  }
  return [...unique.values()];
}
function schedulerHoliday(hospital, date, scheduler) {
  const rule = scheduler[canonicalHospital(hospital)] || scheduler[Object.keys(HOSPITAL_ALIASES).find(id => HOSPITAL_ALIASES[id] === canonicalHospital(hospital))] || {};
  return (rule.dates || []).includes(date) || (rule.weekdays || []).includes(parseScheduleDate(date).getUTCDay());
}
function effectiveSchedule(day, baseHoliday = false) {
  if (day.holidayOverride === true || (day.holidayOverride !== false && (baseHoliday || day.holiday))) return 'holiday';
  if (day.dayClosed) return 'day';
  return day.closedTests.length ? 'items' : 'available';
}
function scheduleItemLabels(codes, items) {
  const types = new Map();
  items.forEach(item => { if (!types.has(item.type)) types.set(item.type, []); types.get(item.type).push(item); });
  const remaining = new Set(codes), labels = [];
  for (const [type, children] of types) {
    if (children.every(item => remaining.has(item.code))) {
      labels.push(type + ' 마감'); children.forEach(item => remaining.delete(item.code));
    }
  }
  for (const code of remaining) labels.push((items.find(item => item.code === code)?.name || EXAMPLE_ITEMS.find(item => item.code === code)?.name || LEGACY_NAMES[code] || code) + ' 마감');
  return labels;
}

let savedSchedule, draftSchedule, scheduleSources, baselineScheduleRaw;
let pendingScheduleChanges = [];
let scheduleHospital = 'pohang', scheduleYear = 2026, scheduleMonth = 11, selectedScheduleDate = null;
let scheduleSelectedCodes = new Set();
let scheduleSelectedDates = new Set();
const scheduleElement = id => document.getElementById(id);
function scheduleReadJSON(key, fallback) {
  const value = localStorage.getItem(key);
  return value === null ? fallback : JSON.parse(value);
}
function loadScheduleSources() {
  const storedHospitals = scheduleReadJSON('hc_hospitals', DEFAULT_HOSPITALS);
  const hospitals = (storedHospitals.length ? storedHospitals : DEFAULT_HOSPITALS).map(hospital => ({ ...hospital, id: canonicalHospital(hospital.id) }));
  let items = scheduleReadJSON('hc_checkup_items', []);
  let packages = scheduleReadJSON('hc_packages', []);
  if (!Array.isArray(items) || !Array.isArray(packages)) throw new Error('병원·패키지 정보를 확인해 주세요.');
  const example = !packages.some(pkg => eligibleScheduleItems(pkg.hospitalId, pkg.year, items, packages).length);
  if (example) {
    items = EXAMPLE_ITEMS;
    const year = Number(new Intl.DateTimeFormat('sv-SE', { timeZone:'Asia/Seoul' }).format(new Date()).slice(0,4));
    packages = hospitals.flatMap(hospital => [year-1,year,year+1].map(value => ({ hospitalId: hospital.id, year: value, items: { basic: ['C028003'], optional: EXAMPLE_ITEMS.filter(item => item.closureCheckYn === 'Y').map(item => item.code) } })));
  }
  const scheduler = scheduleReadJSON('hc_holiday_scheduler', example ? Object.fromEntries(hospitals.map(h => [h.id, { weekdays: [0] }])) : {});
  return { example, hospitals, items, packages, scheduler };
}

function currentScheduleItems(year = scheduleYear) {
  return eligibleScheduleItems(scheduleHospital, year, scheduleSources.items, scheduleSources.packages);
}
function currentScheduleKind() { return document.querySelector('input[name="schedule-kind"]:checked').value; }
function currentScheduleAction() { return document.querySelector('input[name="schedule-action"]:checked').value; }
function scheduleDateContext(date, store = draftSchedule) {
  const day = readScheduleDay(store, scheduleHospital, date);
  const baseHoliday = schedulerHoliday(scheduleHospital, date, scheduleSources.scheduler);
  return { day, baseHoliday, effective: effectiveSchedule(day, baseHoliday) };
}
function renderScheduleTree() {
  const query = scheduleElement('tree-search-input').value.trim().toLowerCase(), items = currentScheduleItems();
  const groups = [...new Set(items.map(item => item.type))].sort((a,b) => { const order = ['내시경','CT','초음파']; return (order.includes(a) ? order.indexOf(a) : 99) - (order.includes(b) ? order.indexOf(b) : 99); });
  scheduleElement('checkup-tree-container').innerHTML = groups.map((type, index) => {
    const children = items.filter(item => item.type === type);
    const visible = children.filter(item => [type,item.name,item.code].some(value => value.toLowerCase().includes(query)));
    if (!visible.length) return '';
    return `<div class="schedule-item-group"><label><input type="checkbox" data-type-index="${index}" ${children.every(item => scheduleSelectedCodes.has(item.code)) ? 'checked' : ''}><span>${escapeSchedule(type)}</span><small>전체 ${children.length}개</small></label>${visible.map(item => `<label class="schedule-item-row"><input type="checkbox" data-item-code="${escapeSchedule(item.code)}" ${scheduleSelectedCodes.has(item.code) ? 'checked' : ''}><span>${escapeSchedule(item.name)}<small>${escapeSchedule(item.code)}</small></span></label>`).join('')}</div>`;
  }).join('') || `<div class="schedule-empty">${items.length ? '검색 결과가 없습니다.' : '해당 병원·연도의 마감 대상 검사가 없습니다.'}</div>`;
  scheduleElement('checkup-tree-container').querySelectorAll('[data-type-index]').forEach(input => {
    const children = items.filter(item => item.type === groups[Number(input.dataset.typeIndex)]);
    input.indeterminate = children.some(item => scheduleSelectedCodes.has(item.code)) && !input.checked;
    input.addEventListener('change', () => { children.forEach(item => input.checked ? scheduleSelectedCodes.add(item.code) : scheduleSelectedCodes.delete(item.code)); renderScheduleTree(); updateScheduleForm(); });
  });
  scheduleElement('checkup-tree-container').querySelectorAll('[data-item-code]').forEach(input => input.addEventListener('change', () => {
    input.checked ? scheduleSelectedCodes.add(input.dataset.itemCode) : scheduleSelectedCodes.delete(input.dataset.itemCode);
    renderScheduleTree(); updateScheduleForm();
  }));
  scheduleElement('selected-items-count').textContent = scheduleSelectedCodes.size + '개 선택';
}
function updateScheduleForm() {
  const kind = currentScheduleKind(), action = currentScheduleAction(), release = action === 'release';
  scheduleElement('schedule-items-panel').hidden = kind !== 'items';
  document.querySelectorAll('input[name="schedule-action"] + span').forEach((span,index) => span.textContent = KIND_NAMES[kind] + (index ? ' 해제' : ' 설정'));
  const helps = { holiday: release ? '선택한 날짜는 스케줄러 휴일보다 병원의 휴일 해제를 우선합니다. 다른 마감은 유지됩니다.' : '병원 전체 예약을 제한하는 자체 휴일을 추가합니다.', day: release ? '일자마감만 해제합니다. 휴일·항목마감은 유지됩니다.' : '선택한 기간의 병원 전체 예약을 제한합니다.', items: release ? '선택한 검사만 해제합니다. 다른 검사·휴일·일자마감은 유지됩니다.' : '선택한 검사만 예약을 제한하며, 나머지 검사는 유지됩니다.' };
  scheduleElement('schedule-action-help').textContent = helps[kind];
  const label = KIND_NAMES[kind] + (release ? ' 해제' : ' 설정');
  scheduleElement('btn-stage-change').textContent = label + ' 목록에 추가';
  scheduleElement('btn-stage-change').classList.toggle('is-release', release);
  scheduleElement('btn-stage-change').disabled = kind === 'items' && !currentScheduleItems().length;
  const start = scheduleElement('start-date-input').value, end = scheduleElement('end-date-input').value;
  const target = kind === 'items' ? `${scheduleSelectedCodes.size}개 검사` : '병원 전체';
  scheduleElement('schedule-operation-summary').textContent = `${label} · ${target}\n${start || '시작일 미선택'} ~ ${end || '종료일 미선택'}`;
  scheduleElement('schedule-form-error').textContent = '';
  scheduleElement('schedule-selected-dates').textContent = scheduleSelectedDates.size ? '선택한 날짜 (' + scheduleSelectedDates.size + '일): ' + [...scheduleSelectedDates].sort().join(', ') : '달력에서 날짜를 여러 개 선택하거나 시작일·종료일을 입력하세요.';
  if (scheduleSelectedDates.size) scheduleElement('schedule-operation-summary').textContent = label + ' · ' + target + ' · 선택한 ' + scheduleSelectedDates.size + '일';
}
function operationTarget(operation) {
  if (operation.kind !== 'items') return '병원 전체';
  return operation.targetLabels.join(', ');
}
function stageScheduleChange() {
  try {
    const kind = currentScheduleKind(), action = currentScheduleAction();
    const start = scheduleElement('start-date-input').value, end = scheduleElement('end-date-input').value;
    const weekdays = [...document.querySelectorAll('#schedule-weekdays input:checked')].map(input => Number(input.value));
    const multiple = scheduleSelectedDates.size > 0;
    const dates = multiple ? [...scheduleSelectedDates].sort() : rangeDates(start, end, weekdays), codes = [...scheduleSelectedCodes];

    if (kind === 'items') {
      if (!codes.length) throw new Error('마감 설정 또는 해제할 검사를 선택해 주세요.');
      for (const year of new Set(dates.map(date => date.slice(0,4)))) {
        const available = new Set(currentScheduleItems(year).map(item => item.code));
        if (codes.some(code => !available.has(code))) throw new Error(`${year}년 패키지에 선택한 마감 대상 검사가 없습니다. 연도별 대상 확인 후 기간을 나누어 설정해 주세요.`);
      }
    }
    const operation = { id: 'change-' + Date.now() + '-' + Math.random().toString(36).slice(2), hospital: scheduleHospital, hospitalName: scheduleSources.hospitals.find(h => h.id === scheduleHospital)?.name || scheduleHospital, kind, action, start: dates[0], end: dates[dates.length-1], multiple, weekdays: multiple ? [] : weekdays, dates, codes: kind === 'items' ? codes : [], targetLabels: kind === 'items' ? scheduleItemLabels(codes, currentScheduleItems()).map(label => label.replace(/ 마감$/, '')) : [] };
    const overlaps = pendingScheduleChanges.some(previous => previous.hospital === operation.hospital && previous.kind === kind && previous.action !== action && previous.dates.some(date => dates.includes(date)) && (kind !== 'items' || previous.codes.some(code => codes.includes(code))));
    if (overlaps) throw new Error('같은 날짜·대상에 설정과 해제가 겹칩니다. 변경 목록에서 기존 건을 제거한 뒤 추가해 주세요.');
    const hasChange = dates.some(date => {
      const day = readScheduleDay(draftSchedule, scheduleHospital, date);
      return kind === 'holiday' ? day.holidayOverride !== (action === 'set') : kind === 'day' ? day.dayClosed !== (action === 'set') : codes.some(code => day.closedTests.includes(code) !== (action === 'set'));
    });
    if (!hasChange) throw new Error('이미 같은 상태이거나 해제할 설정이 없습니다.');
    pendingScheduleChanges.push(operation);
    rebuildDraftSchedule(); renderSchedulePending(); renderScheduleCalendar(); updateScheduleForm();
    scheduleElement('schedule-notice').textContent = '변경 목록에 추가했습니다. 달력은 저장 전 미리보기이며, 최종 저장 후 반영됩니다.';
  } catch (error) { scheduleElement('schedule-form-error').textContent = error.message; }
}
function rebuildDraftSchedule() {
  draftSchedule = copySchedule(savedSchedule);
  pendingScheduleChanges.forEach(operation => applyScheduleOperation(draftSchedule, operation));
}
function renderSchedulePending() {
  const count = pendingScheduleChanges.length;
  scheduleElement('pending-count').textContent = count + '건';
  scheduleElement('schedule-save-status').textContent = count ? `저장 전 변경 ${count}건` : '저장 전 변경 없음';
  scheduleElement('btn-save-all').disabled = !count;
  scheduleElement('btn-save-all').textContent = count ? `${count}건 최종 저장` : '최종 저장';
  scheduleElement('btn-discard-changes').disabled = !count;
  scheduleElement('schedule-notice').classList.toggle('is-dirty', !!count);
  scheduleElement('schedule-pending-rows').innerHTML = count ? pendingScheduleChanges.map((operation,index) => `<tr><td>${escapeSchedule(operation.hospitalName)}</td><td>${KIND_NAMES[operation.kind]}</td><td>${operation.multiple ? operation.dates.join(', ') : operation.start + ' ~ ' + operation.end}<br><small>${operation.dates.length}일${operation.weekdays.length ? ' · 매주 ' + operation.weekdays.map(day => '일월화수목금토'[day]).join('·') : ''}</small></td><td>${escapeSchedule(operationTarget(operation))}</td><td class="${operation.action === 'set' ? 'set' : 'release'}-label">${operation.action === 'set' ? '설정' : '해제'}</td><td><button type="button" class="btn btn-secondary" data-remove-change="${index}">제거</button></td></tr>`).join('') : '<tr><td colspan="6" class="schedule-empty">추가한 변경이 없습니다. 오른쪽에서 설정 또는 해제할 내용을 추가하세요.</td></tr>';
  scheduleElement('schedule-pending-rows').querySelectorAll('[data-remove-change]').forEach(button => button.addEventListener('click', () => {
    pendingScheduleChanges.splice(Number(button.dataset.removeChange),1); rebuildDraftSchedule(); renderSchedulePending(); renderScheduleCalendar();
    if (!pendingScheduleChanges.length) scheduleElement('schedule-notice').textContent = '저장된 일정입니다. 변경 목록에 추가한 내용은 최종 저장 후 반영됩니다.';
  }));
}
function renderScheduleCalendar() {
  scheduleElement('calendar-month-label').textContent = `${scheduleYear}년 ${scheduleMonth}월`;
  const first = new Date(Date.UTC(scheduleYear, scheduleMonth - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(scheduleYear, scheduleMonth, 0)).getUTCDate();
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone:'Asia/Seoul' }).format(new Date());
  const start = scheduleElement('start-date-input').value, end = scheduleElement('end-date-input').value;
  let html = [...'일월화수목금토'].map(day => `<div class="schedule-calendar-weekday">${day}</div>`).join('');
  html += '<div class="schedule-calendar-cell empty" aria-hidden="true"></div>'.repeat(first);
  for (let number = 1; number <= days; number++) {
    const date = `${scheduleYear}-${String(scheduleMonth).padStart(2,'0')}-${String(number).padStart(2,'0')}`;
    const { day, effective } = scheduleDateContext(date);
    const labels = effective === 'holiday' ? ['휴일'] : effective === 'day' ? ['예약마감'] : effective === 'items' ? scheduleItemLabels(day.closedTests, currentScheduleItems()) : [];
    const visual = effective === 'day' ? 'closed' : effective;
    const pending = pendingScheduleChanges.some(change => change.hospital === scheduleHospital && change.dates.includes(date));
    const weekday = (first + number - 1) % 7;
    const classes = ['schedule-calendar-cell',`is-${visual}`,weekday === 0 ? 'sun' : weekday === 6 ? 'sat' : '',date === today ? 'is-today' : '',scheduleSelectedDates.has(date) ? 'selected' : '',!scheduleSelectedDates.size && start && end && date >= start && date <= end ? 'in-range' : '',pending ? 'has-pending' : ''].join(' ');
    html += `<button type="button" class="${classes}" data-date="${date}" aria-label="${date} ${escapeSchedule(labels.join(', ') || '예약 가능')}${pending ? ' 저장 전 변경' : ''}"><span class="schedule-day-number">${number}</span>${labels.map(label => `<span class="schedule-day-badge ${visual}">${escapeSchedule(label)}</span>`).join('')}</button>`;
  }
  const padding = (7 - ((first + days) % 7)) % 7;
  html += '<div class="schedule-calendar-cell empty" aria-hidden="true"></div>'.repeat(padding);
  scheduleElement('admin-calendar-grid').innerHTML = html;
  scheduleElement('admin-calendar-grid').querySelectorAll('[data-date]').forEach(button => button.addEventListener('click', () => {
    selectedScheduleDate = button.dataset.date;
    scheduleSelectedDates.has(selectedScheduleDate) ? scheduleSelectedDates.delete(selectedScheduleDate) : scheduleSelectedDates.add(selectedScheduleDate);
    scheduleElement('start-date-input').value = ''; scheduleElement('end-date-input').value = '';
    renderScheduleCalendar(); updateScheduleForm();
  }));
  renderScheduleDateDetail();
}
function renderScheduleDateDetail() {
  if (!selectedScheduleDate) { scheduleElement('schedule-day-detail').textContent = '날짜를 선택하면 해당 일자의 설정 내역을 확인할 수 있습니다.'; return; }
  const {day, baseHoliday, effective} = scheduleDateContext(selectedScheduleDate);
  const labels = effective === 'items' ? scheduleItemLabels(day.closedTests,currentScheduleItems()) : [effective === 'day' ? '예약마감' : KIND_NAMES[effective] || '예약 가능'];
  const records = [baseHoliday ? (day.holidayOverride === false ? '스케줄러 휴일 → 병원에서 해당 날짜 휴일 해제' : '스케줄러 휴일') : '',day.holiday ? '병원 자체 휴일' : '',day.dayClosed ? '일자마감' : '',...day.closedTests.map(code => (scheduleSources.items.find(item => String(item.code ?? item.id) === code)?.name || LEGACY_NAMES[code] || code) + ' 마감')].filter(Boolean);
  scheduleElement('schedule-day-detail').innerHTML = `<strong>${selectedScheduleDate} · ${escapeSchedule(labels.join(', '))}</strong>${baseHoliday ? (day.holidayOverride === false ? '<div>병원의 날짜별 휴일 해제를 우선 적용했습니다.</div>' : '<div>내부 휴일 스케줄러 기준 휴일입니다.</div>') : ''}${records.length ? `<details><summary>관리용 개별 설정 확인 (${records.length}건)</summary><ul>${records.map(record=>`<li>${escapeSchedule(record)}</li>`).join('')}</ul><p class="schedule-help">달력에는 우선순위가 가장 높은 상태만 표시됩니다.</p></details>` : '<div>등록된 예약 제한이 없습니다.</div>'}`;
}
function scheduleRefreshContext() {
  scheduleSelectedDates.clear();
  scheduleSelectedCodes.clear(); scheduleElement('tree-search-input').value = '';
  scheduleElement('schedule-year').value = String(scheduleYear);
  renderScheduleTree(); renderScheduleCalendar(); updateScheduleForm();
}
function scheduleOpenDialog(title, body) {
  const dialog = document.createElement('dialog'); dialog.className = 'schedule-dialog';
  dialog.setAttribute('aria-label',title);
  dialog.innerHTML = `<header><h2>${escapeSchedule(title)}</h2><button type="button" class="btn btn-secondary">닫기</button></header>${body}`;
  dialog.querySelector('button').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>dialog.remove(),{once:true}); document.body.appendChild(dialog); dialog.showModal();
}
function saveScheduleChanges() {
  if (!pendingScheduleChanges.length) return;
  try {
    if (localStorage.getItem(SCHEDULE_KEY) !== baselineScheduleRaw) throw new Error('다른 화면에서 일정이 변경되었습니다. 변경 목록을 확인한 뒤 새로고침하여 다시 적용해 주세요.');
    const next = copySchedule(draftSchedule);
    const now = new Date().toISOString();
    next.__meta = { revision: (savedSchedule.__meta.revision || 0) + 1, history: [...(savedSchedule.__meta.history || []), ...pendingScheduleChanges.map(operation => ({ ...operation, savedAt:now }))] };
    const serialized = JSON.stringify(next);
    localStorage.setItem(SCHEDULE_KEY, serialized);
    baselineScheduleRaw = serialized; savedSchedule = next; pendingScheduleChanges = []; rebuildDraftSchedule();
    renderSchedulePending(); renderScheduleCalendar();
    scheduleElement('schedule-notice').textContent = '변경 내용을 저장했습니다. 기존 예약은 유지됩니다.';
  } catch(error) { scheduleElement('schedule-notice').textContent = error.message || '저장하지 못했습니다. 변경 목록을 유지합니다.'; }
}
function initializeScheduleEditor() {
  try {
    scheduleSources = loadScheduleSources(); baselineScheduleRaw = localStorage.getItem(SCHEDULE_KEY);
    savedSchedule = normalizeScheduleStore(baselineScheduleRaw === null ? {} : JSON.parse(baselineScheduleRaw));
    rebuildDraftSchedule();
    const parts = new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul'}).format(new Date()).split('-').map(Number);
    scheduleYear = parts[0]; scheduleMonth = parts[1];
    scheduleHospital = scheduleSources.hospitals.some(h=>h.id==='pohang') ? 'pohang' : scheduleSources.hospitals[0].id;
    scheduleElement('hosp-select').innerHTML = scheduleSources.hospitals.map(h=>`<option value="${escapeSchedule(h.id)}">${escapeSchedule(h.name)}</option>`).join('');
    scheduleElement('hosp-select').value = scheduleHospital;
    const years = [...new Set([scheduleYear-1,scheduleYear,scheduleYear+1,...scheduleSources.packages.map(pkg=>Number(pkg.year))])].filter(year=>Number.isInteger(year)&&year>1900&&year<10000).sort();
    scheduleElement('schedule-year').innerHTML = years.map(year=>`<option value="${year}">${year}년</option>`).join('');
    scheduleElement('schedule-data-label').textContent = scheduleSources.example ? '예시 데이터 · 내시경 / CT / 초음파' : '등록된 병원·패키지 기준';
    scheduleElement('hosp-select').addEventListener('change',event=>{scheduleHospital=event.target.value;selectedScheduleDate=null;scheduleRefreshContext();});
    scheduleElement('schedule-year').addEventListener('change',event=>{scheduleYear=Number(event.target.value);selectedScheduleDate=null;scheduleElement('start-date-input').value='';scheduleElement('end-date-input').value='';scheduleRefreshContext();});
    const navigate = amount => {
      const date = new Date(Date.UTC(scheduleYear,scheduleMonth-1+amount,1)), oldYear=scheduleYear;
      scheduleYear=date.getUTCFullYear();scheduleMonth=date.getUTCMonth()+1;selectedScheduleDate=null;
      if (![...scheduleElement('schedule-year').options].some(option=>option.value===String(scheduleYear))) scheduleElement('schedule-year').add(new Option(scheduleYear+'년',scheduleYear));
      if(oldYear!==scheduleYear)scheduleRefreshContext();else renderScheduleCalendar();
    };
    scheduleElement('btn-prev-month').addEventListener('click',()=>navigate(-1));scheduleElement('btn-next-month').addEventListener('click',()=>navigate(1));
    scheduleElement('btn-calendar-today').addEventListener('click',()=>{scheduleYear=parts[0];scheduleMonth=parts[1];selectedScheduleDate=null;scheduleRefreshContext();});
    document.querySelectorAll('input[name="schedule-kind"], input[name="schedule-action"], #schedule-weekdays input').forEach(input=>input.addEventListener('change',updateScheduleForm));
    ['start-date-input','end-date-input'].forEach(id=>scheduleElement(id).addEventListener('change',()=>{scheduleSelectedDates.clear();updateScheduleForm();renderScheduleCalendar();}));
    scheduleElement('tree-search-input').addEventListener('input',renderScheduleTree);
    scheduleElement('btn-reset-tree').addEventListener('click',()=>{scheduleSelectedCodes.clear();renderScheduleTree();updateScheduleForm();});
    document.querySelectorAll('[data-period]').forEach(button=>button.addEventListener('click',()=>{
      scheduleSelectedDates.clear();
      const first = parseScheduleDate(scheduleElement('start-date-input').value) || new Date(Date.UTC(scheduleYear,scheduleMonth-1,1));
      const last = new Date(first);
      if(button.dataset.period==='week')last.setUTCDate(last.getUTCDate()+6);
      if(['month','quarter'].includes(button.dataset.period)) {
        const months=button.dataset.period==='month'?1:3, targetMonth=first.getUTCMonth()+months;
        const anniversary = new Date(Date.UTC(first.getUTCFullYear(),targetMonth,Math.min(first.getUTCDate(),new Date(Date.UTC(first.getUTCFullYear(),targetMonth+1,0)).getUTCDate())));
        last.setTime(anniversary.getTime()); last.setUTCDate(last.getUTCDate()-1);
      }
      scheduleElement('start-date-input').value=dateKey(first);scheduleElement('end-date-input').value=dateKey(last);updateScheduleForm();renderScheduleCalendar();
    }));
    scheduleElement('btn-clear-dates').addEventListener('click',()=>{scheduleSelectedDates.clear();selectedScheduleDate=null;updateScheduleForm();renderScheduleCalendar();});
    scheduleElement('btn-stage-change').addEventListener('click',stageScheduleChange);
    scheduleElement('btn-save-all').addEventListener('click',saveScheduleChanges);
    scheduleElement('btn-discard-changes').addEventListener('click',()=>{
      if(!confirm('저장 전 변경 내용을 모두 취소하시겠습니까?'))return;
      pendingScheduleChanges=[];rebuildDraftSchedule();renderSchedulePending();renderScheduleCalendar();scheduleElement('schedule-notice').textContent='변경을 취소했습니다. 저장된 일정입니다.';
    });
    scheduleElement('btn-view-history').addEventListener('click',()=>{
      const history=(savedSchedule.__meta.history || []).filter(operation=>operation.hospital===scheduleHospital).slice().reverse();
      scheduleOpenDialog('변경 이력',history.length ? history.map(operation=>`<article class="schedule-history-entry"><strong>${KIND_NAMES[operation.kind]} ${operation.action==='set'?'설정':'해제'} · ${escapeSchedule(operationTarget(operation))}</strong><div>${escapeSchedule(operation.start)} ~ ${escapeSchedule(operation.end)} · ${operation.dates.length}일</div><small>${escapeSchedule(new Date(operation.savedAt).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'}))}</small></article>`).join('') : '<p class="schedule-empty">기록된 변경 이력이 없습니다.</p>');
    });
    window.addEventListener('beforeunload',event=>{if(pendingScheduleChanges.length){event.preventDefault();event.returnValue='';}});
    scheduleRefreshContext();renderSchedulePending();
  } catch(error) {
    scheduleElement('schedule-notice').textContent = '설정 정보를 불러오지 못했습니다. ' + error.message;
    scheduleElement('btn-stage-change').disabled=true;scheduleElement('btn-save-all').disabled=true;
  }
}
if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded',initializeScheduleEditor);
if (typeof module !== 'undefined') module.exports = { rangeDates, normalizeScheduleDay, normalizeScheduleStore, readScheduleDay, applyScheduleOperation, eligibleScheduleItems, effectiveSchedule, scheduleItemLabels, schedulerHoliday, EXAMPLE_ITEMS, EXAMPLE_PACKAGES };
