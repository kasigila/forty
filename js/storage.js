/**
 * Forty — LocalStorage module
 * Handles all persistence with a clean data schema
 */

const STORAGE_KEY = 'forty_app_data';

const DEFAULT_DATA = {
  startDate: null,
  commitments: {
    givingUp: '',
    adding: ''
  },
  whyText: '',
  toneMode: 'gentle',
  logs: [],
  streak: 0,
  theme: 'light',
  prayerIntentions: [],
  reminderTime: null,
  fastingSchedule: 'all',
  journalEntries: []
};

/**
 * Get today's date string (YYYY-MM-DD) in local timezone
 */
function todayString() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

/**
 * Parse date string to Date object
 */
function parseDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Load persisted data
 */
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...JSON.parse(JSON.stringify(DEFAULT_DATA)) };
    const data = JSON.parse(raw);
    return {
      ...DEFAULT_DATA,
      ...data,
      commitments: { ...DEFAULT_DATA.commitments, ...(data.commitments || {}) },
      prayerIntentions: data.prayerIntentions || [],
      journalEntries: data.journalEntries || []
    };
  } catch (e) {
    return { ...JSON.parse(JSON.stringify(DEFAULT_DATA)) };
  }
}

/**
 * Save data to localStorage
 */
function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get current day number (1–40)
 */
function currentDay(data) {
  const start = parseDate(data.startDate);
  if (!start) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  const diff = Math.floor((today - start) / (24 * 60 * 60 * 1000));
  if (diff < 0) return 0;
  if (diff >= 40) return 40;
  return diff + 1;
}

/**
 * Check if a date is in the past (locked)
 */
function isDateLocked(dateStr) {
  const d = parseDate(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d < today;
}

/**
 * Get log for a specific date
 */
function getLogForDate(data, dateStr) {
  return (data.logs || []).find((l) => l.date === dateStr) || null;
}

/**
 * Ensure log exists for date and return it (for editing today only)
 */
function getOrCreateLogForToday(data) {
  const today = todayString();
  let log = getLogForDate(data, today);
  if (!log) {
    log = {
      date: today,
      fast: false,
      prayer: false,
      scripture: false,
      mood: 'neutral',
      reflection: ''
    };
  }
  return log;
}

/**
 * Upsert log for a date (only allows today; previous days are locked for check-in)
 */
function saveLog(data, log) {
  const today = todayString();
  if (log.date !== today) return { ok: false, reason: 'locked' };

  const logs = [...(data.logs || [])];
  const logWithTime = { ...log, loggedAt: new Date().toISOString() };
  const idx = logs.findIndex((l) => l.date === log.date);
  if (idx >= 0) logs[idx] = logWithTime;
  else logs.push(logWithTime);

  logs.sort((a, b) => (a.date > b.date ? -1 : 1));
  return save({ ...data, logs }) ? { ok: true } : { ok: false, reason: 'save' };
}

/**
 * Save or update a journal entry (reflection) for any date
 * Optional: scriptureRef for scripture journaling
 */
function saveJournalEntry(data, dateStr, reflection, mood, scriptureRef) {
  const logs = [...(data.logs || [])];
  const idx = logs.findIndex((l) => l.date === dateStr);
  const base = idx >= 0 ? { ...logs[idx] } : { date: dateStr, fast: false, prayer: false, scripture: false, mood: 'neutral', reflection: '' };
  const entry = { ...base, date: dateStr, reflection: (reflection || '').trim(), mood: mood || base.mood };
  if (scriptureRef) entry.scriptureRef = scriptureRef;
  if (idx >= 0) logs[idx] = entry;
  else logs.push(entry);
  logs.sort((a, b) => (a.date > b.date ? -1 : 1));
  return save({ ...data, logs });
}

/**
 * Merge imported data with existing (for import flow)
 */
function mergeImport(existingData, imported) {
  if (!imported || typeof imported !== 'object') return null;
  const merged = { ...existingData };
  if (imported.startDate) merged.startDate = imported.startDate;
  if (imported.commitments) merged.commitments = { ...(merged.commitments || {}), ...imported.commitments };
  if (imported.whyText) merged.whyText = imported.whyText;
  if (Array.isArray(imported.logs) && imported.logs.length > 0) {
    const existingDates = new Set((merged.logs || []).map((l) => l.date));
    imported.logs.forEach((l) => {
      if (!existingDates.has(l.date)) {
        merged.logs = merged.logs || [];
        merged.logs.push(l);
        existingDates.add(l.date);
      }
    });
    if (merged.logs) merged.logs.sort((a, b) => (a.date > b.date ? -1 : 1));
  }
  return merged;
}

/**
 * Reset all data (for "Reset Lent")
 */
function reset() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    return false;
  }
}

// Export for use in app
window.FortyStorage = {
  load,
  save,
  todayString,
  parseDate,
  currentDay,
  isDateLocked,
  getLogForDate,
  getOrCreateLogForToday,
  saveLog,
  saveJournalEntry,
  mergeImport,
  reset,
  DEFAULT_DATA
};
