/**
 * Forty — Analytics module
 * Discipline score, streak, completion %, mood trends
 */

const S = window.FortyStorage || {};
const parseDate = S.parseDate || (() => null);
const todayString = S.todayString || (() => new Date().toISOString().slice(0, 10));

/**
 * Discipline Score =
 * (Fast consistency * 0.4) + (Prayer * 0.3) + (Scripture * 0.3)
 */
function disciplineScore(data) {
  const logs = data.logs || [];
  if (logs.length === 0) return { score: null, label: '—' };

  let fastSum = 0, prayerSum = 0, scriptureSum = 0;
  let days = 0;
  const start = parseDate(data.startDate);
  if (!start) return { score: null, label: '—' };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 40; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    if (d > today) break;

    const dateStr = d.toISOString().slice(0, 10);
    const log = logs.find((l) => l.date === dateStr);
    days++;
    fastSum += log?.fast ? 1 : 0;
    prayerSum += log?.prayer ? 1 : 0;
    scriptureSum += log?.scripture ? 1 : 0;
  }

  if (days === 0) return { score: null, label: '—' };

  const fastPct = fastSum / days;
  const prayerPct = prayerSum / days;
  const scripturePct = scriptureSum / days;
  const score = Math.round(
    (fastPct * 0.4 + prayerPct * 0.3 + scripturePct * 0.3) * 100
  );

  const label = score >= 90 ? 'Focused' : score >= 70 ? 'Steadfast' : score >= 50 ? 'Growing' : 'Beginning';
  return { score, label };
}

/**
 * Compute current streak (consecutive days with at least fast or prayer)
 */
function computeStreak(data) {
  const logs = data.logs || [];
  if (logs.length === 0) return 0;

  const sorted = [...logs].sort((a, b) => (a.date > b.date ? -1 : 1));
  const today = todayString();
  let streak = 0;

  // Check if today is logged
  const todayLog = sorted.find((l) => l.date === today);
  const hasToday = todayLog && (todayLog.fast || todayLog.prayer || todayLog.scripture);

  const start = parseDate(data.startDate);
  if (!start) return 0;

  // Walk backwards from today
  for (let i = 0; i < 40; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const log = logs.find((l) => l.date === dateStr);
    const hasLog = log && (log.fast || log.prayer || log.scripture);

    if (hasLog) streak++;
    else if (i === 0) {
      // Today not logged – can still count backwards but not today
      continue;
    } else break;
  }

  return streak;
}

/**
 * Weekly completion % (last 7 days)
 */
function weeklyCompletion(data) {
  const logs = data.logs || [];
  if (logs.length === 0) return 0;

  let completed = 0;
  let total = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const log = logs.find((l) => l.date === dateStr);
    if (log) {
      total++;
      if (log.fast || log.prayer || log.scripture) completed++;
    }
  }
  return total === 0 ? 0 : Math.round((completed / total) * 100);
}

/**
 * Most common failure day (day of week 0–6)
 */
function failureDayOfWeek(data) {
  const logs = data.logs || [];
  const failures = logs.filter((l) => !l.fast && !l.prayer && !l.scripture);
  if (failures.length === 0) return null;

  const dayCount = [0, 0, 0, 0, 0, 0, 0];
  failures.forEach((l) => {
    const d = new Date(l.date);
    dayCount[d.getDay()]++;
  });
  const max = Math.max(...dayCount);
  const idx = dayCount.indexOf(max);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[idx];
}

/**
 * Streak history for chart (last 14 days)
 */
function streakHistoryData(data) {
  const result = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const log = (data.logs || []).find((l) => l.date === dateStr);
    const count = log ? [log.fast, log.prayer, log.scripture].filter(Boolean).length : 0;
    result.push({ date: dateStr, value: count, max: 3 });
  }
  return result;
}

/**
 * Mood distribution for chart
 */
function moodTrendData(data) {
  const logs = data.logs || [];
  const counts = { peaceful: 0, grateful: 0, neutral: 0, struggling: 0, tempted: 0 };
  logs.forEach((l) => {
    if (l.mood && counts[l.mood] !== undefined) counts[l.mood]++;
  });
  return counts;
}

/**
 * Mood vs discipline: avg discipline score when in each mood
 */
function moodVsDiscipline(data) {
  const logs = (data.logs || []).filter((l) => l.mood && l.mood !== 'neutral');
  if (logs.length === 0) return null;
  const byMood = {};
  logs.forEach((l) => {
    if (!byMood[l.mood]) byMood[l.mood] = { sum: 0, count: 0 };
    const score = [l.fast, l.prayer, l.scripture].filter(Boolean).length;
    byMood[l.mood].sum += score;
    byMood[l.mood].count++;
  });
  const result = {};
  Object.keys(byMood).forEach((m) => {
    result[m] = Math.round((byMood[m].sum / byMood[m].count / 3) * 100);
  });
  return result;
}

/**
 * Best time of day to log (from loggedAt)
 */
function bestLogTime(data) {
  const logs = (data.logs || []).filter((l) => l.loggedAt);
  if (logs.length === 0) return null;
  const hours = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  logs.forEach((l) => {
    try {
      const d = new Date(l.loggedAt);
      hours[d.getHours()]++;
    } catch (_) {}
  });
  const max = Math.max(...hours);
  if (max === 0) return null;
  const idx = hours.indexOf(max);
  const labels = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'];
  return labels[idx];
}

window.FortyAnalytics = {
  disciplineScore,
  computeStreak,
  weeklyCompletion,
  failureDayOfWeek,
  streakHistoryData,
  moodTrendData,
  moodVsDiscipline,
  bestLogTime
};
