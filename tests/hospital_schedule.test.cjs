const { test } = require('node:test');
const assert = require('node:assert/strict');
const rules = require('../hospital_schedule.js');
const date = '2026-11-03';
const operation = (kind, action, codes = []) => ({ hospital: 'pohang', kind, action, dates: [date], codes });
const empty = () => rules.normalizeScheduleStore({});

test('inclusive ranges support single dates, year boundaries, leap days and weekdays', () => {
  assert.deepEqual(rules.rangeDates(date, date), [date]);
  assert.equal(rules.rangeDates('2026-12-31', '2027-01-02').length, 3);
  assert.equal(rules.rangeDates('2028-02-28', '2028-03-01').length, 3);
  assert.deepEqual(rules.rangeDates('2026-11-01', '2026-11-14', [0]), ['2026-11-01', '2026-11-08']);
});
test('invalid and reversed dates and empty weekday matches are rejected', () => {
  for (const args of [['2026-11-04', date], ['2026-02-30', '2026-03-01'], ['', date], [date, date, [0]]]) {
    assert.throws(() => rules.rangeDates(...args));
  }
});
test('holiday, day and item restrictions are independently retained and released', () => {
  const store = empty();
  rules.applyScheduleOperation(store, operation('items', 'set', ['C029002', 'C029003']));
  rules.applyScheduleOperation(store, operation('day', 'set'));
  rules.applyScheduleOperation(store, operation('holiday', 'set'));
  assert.equal(rules.effectiveSchedule(rules.readScheduleDay(store, 'pohang', date)), 'holiday');
  rules.applyScheduleOperation(store, operation('holiday', 'release'));
  assert.equal(rules.effectiveSchedule(rules.readScheduleDay(store, 'pohang', date)), 'day');
  rules.applyScheduleOperation(store, operation('day', 'release'));
  assert.equal(rules.effectiveSchedule(rules.readScheduleDay(store, 'pohang', date)), 'items');
  assert.deepEqual(rules.readScheduleDay(store, 'pohang', date).closedTests, ['C029002', 'C029003']);
});
test('selecting all target items never closes a whole day or another hospital', () => {
  const store = empty();
  const codes = rules.EXAMPLE_ITEMS.filter(item => item.closureCheckYn === 'Y').map(item => item.code);
  rules.applyScheduleOperation(store, operation('items', 'set', codes));
  assert.equal(rules.readScheduleDay(store, 'pohang', date).dayClosed, false);
  assert.equal(rules.effectiveSchedule(rules.readScheduleDay(store, 'pohang', date)), 'items');
  assert.equal(rules.effectiveSchedule(rules.readScheduleDay(store, 'green-gn', date)), 'available');
});
test('releasing one item retains other items and holidays', () => {
  const store = empty();
  rules.applyScheduleOperation(store, operation('holiday', 'set'));
  rules.applyScheduleOperation(store, operation('items', 'set', ['C029002', 'C030007']));
  rules.applyScheduleOperation(store, operation('items', 'release', ['C029002']));
  const day = rules.readScheduleDay(store, 'pohang', date);
  assert.equal(day.holiday, true);
  assert.deepEqual(day.closedTests, ['C030007']);
});
test('targets require hospital, year, package membership and Y and are deduplicated', () => {
  const items = rules.eligibleScheduleItems('pohang', 2026, rules.EXAMPLE_ITEMS, rules.EXAMPLE_PACKAGES);
  assert.equal(items.length, 9);
  assert.equal(new Set(items.map(item => item.code)).size, 9);
  assert.ok(!items.some(item => item.code === 'C028003'));
  assert.equal(rules.eligibleScheduleItems('pohang', 2027, rules.EXAMPLE_ITEMS, rules.EXAMPLE_PACKAGES).length, 5);
  assert.equal(rules.eligibleScheduleItems('pohang', 2025, rules.EXAMPLE_ITEMS, rules.EXAMPLE_PACKAGES).length, 0);
  assert.equal(rules.eligibleScheduleItems('h1', 2026, rules.EXAMPLE_ITEMS, rules.EXAMPLE_PACKAGES).length, 6);
});
test('complete groups use one parent label; partial groups show the selected item', () => {
  const items = rules.eligibleScheduleItems('pohang', 2026, rules.EXAMPLE_ITEMS, rules.EXAMPLE_PACKAGES);
  assert.deepEqual(rules.scheduleItemLabels(['C029002', 'C029003', 'C029004'], items), ['내시경 마감']);
  assert.deepEqual(rules.scheduleItemLabels(['C029002'], items), ['위내시경(수면) 마감']);
});
test('scheduler holidays cannot be cleared by releasing custom holidays', () => {
  assert.equal(rules.schedulerHoliday('pohang', '2026-11-01', { pohang: { weekdays: [0] } }), true);
  assert.equal(rules.schedulerHoliday('pohang', date, { pohang: { dates: [date] } }), true);
  assert.equal(rules.effectiveSchedule(rules.normalizeScheduleDay(), true), 'holiday');
});
test('legacy dates and codes remain readable', () => {
  const store = rules.normalizeScheduleStore({ pohang: { 2026: { 11: { 3: { status: 'closed', closedTests: ['stomach_all'] } } } } });
  const day = rules.readScheduleDay(store, 'pohang', date);
  assert.equal(day.dayClosed, true);
  assert.deepEqual(day.closedTests, ['C029002', 'C029003']);
});

test('hospital holiday release overrides scheduler on selected dates only and survives reload', () => {
 const store=empty();
 rules.applyScheduleOperation(store,{hospital:'pohang',kind:'holiday',action:'release',dates:['2026-11-01','2026-11-15'],codes:[]});
 const loaded=rules.normalizeScheduleStore(JSON.parse(JSON.stringify(store)));
 assert.equal(rules.effectiveSchedule(rules.readScheduleDay(loaded,'pohang','2026-11-01'),true),'available');
 assert.equal(rules.effectiveSchedule(rules.readScheduleDay(loaded,'pohang','2026-11-08'),true),'holiday');
 rules.applyScheduleOperation(loaded,{hospital:'pohang',kind:'day',action:'set',dates:['2026-11-01','2026-11-08'],codes:[]});
 assert.equal(rules.effectiveSchedule(rules.readScheduleDay(loaded,'pohang','2026-11-01'),true),'day');
 assert.equal(rules.effectiveSchedule(rules.readScheduleDay(loaded,'pohang','2026-11-08'),true),'holiday');
 rules.applyScheduleOperation(loaded,{hospital:'pohang',kind:'holiday',action:'set',dates:['2026-11-01'],codes:[]});
 assert.equal(rules.effectiveSchedule(rules.readScheduleDay(loaded,'pohang','2026-11-01'),true),'holiday');
});
