/**
 * Forty — A Lent Companion
 * Main application entry and orchestration
 */

(function () {
  'use strict';

  const S = window.FortyStorage;
  const A = window.FortyAnalytics;
  const U = window.FortyUI;
  const R = window.FortyRouter;
  const C = window.FortyContent || {};

  // ═══════════════════════════════════════════════════════════
  // SCRIPTURES (40 verses)
  // ═══════════════════════════════════════════════════════════
  const SCRIPTURES = [
    { text: 'Create in me a clean heart, O God, and renew a right spirit within me.', ref: 'Psalm 51:10' },
    { text: 'For I know the plans I have for you, declares the Lord, plans for welfare and not for evil.', ref: 'Jeremiah 29:11' },
    { text: 'Be still, and know that I am God.', ref: 'Psalm 46:10' },
    { text: 'The Lord is near to the brokenhearted and saves the crushed in spirit.', ref: 'Psalm 34:18' },
    { text: 'Trust in the Lord with all your heart, and do not lean on your own understanding.', ref: 'Proverbs 3:5' },
    { text: 'And he said to all, "If anyone would come after me, let him deny himself and take up his cross daily."', ref: 'Luke 9:23' },
    { text: 'For where your treasure is, there your heart will be also.', ref: 'Matthew 6:21' },
    { text: 'But seek first the kingdom of God and his righteousness, and all these things will be added to you.', ref: 'Matthew 6:33' },
    { text: 'Come to me, all who labor and are heavy laden, and I will give you rest.', ref: 'Matthew 11:28' },
    { text: 'The steadfast love of the Lord never ceases; his mercies never come to an end.', ref: 'Lamentations 3:22' },
    { text: 'Rejoice in the Lord always; again I will say, rejoice.', ref: 'Philippians 4:4' },
    { text: 'I can do all things through him who strengthens me.', ref: 'Philippians 4:13' },
    { text: 'Let us not grow weary of doing good, for in due season we will reap, if we do not give up.', ref: 'Galatians 6:9' },
    { text: 'And we know that for those who love God all things work together for good.', ref: 'Romans 8:28' },
    { text: 'Jesus said to him, "I am the way, and the truth, and the life."', ref: 'John 14:6' },
    { text: 'Peace I leave with you; my peace I give to you.', ref: 'John 14:27' },
    { text: 'Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you.', ref: 'Matthew 7:7' },
    { text: 'Blessed are the pure in heart, for they shall see God.', ref: 'Matthew 5:8' },
    { text: 'For God so loved the world, that he gave his only Son.', ref: 'John 3:16' },
    { text: 'The Lord is my shepherd; I shall not want.', ref: 'Psalm 23:1' },
    { text: 'Even though I walk through the valley of the shadow of death, I will fear no evil.', ref: 'Psalm 23:4' },
    { text: 'Cast all your anxieties on him, because he cares for you.', ref: '1 Peter 5:7' },
    { text: 'And my God will supply every need of yours according to his riches in glory in Christ Jesus.', ref: 'Philippians 4:19' },
    { text: 'Fear not, for I am with you; be not dismayed, for I am your God.', ref: 'Isaiah 41:10' },
    { text: 'The Lord is my strength and my shield; in him my heart trusts.', ref: 'Psalm 28:7' },
    { text: 'Wait for the Lord; be strong, and let your heart take courage.', ref: 'Psalm 27:14' },
    { text: 'Draw near to God, and he will draw near to you.', ref: 'James 4:8' },
    { text: 'For we walk by faith, not by sight.', ref: '2 Corinthians 5:7' },
    { text: 'Let the words of my mouth and the meditation of my heart be acceptable in your sight.', ref: 'Psalm 19:14' },
    { text: 'He has told you, O man, what is good; and what does the Lord require of you but to do justice, and to love kindness.', ref: 'Micah 6:8' },
    { text: 'The Lord is gracious and merciful, slow to anger and abounding in steadfast love.', ref: 'Psalm 145:8' },
    { text: 'But they who wait for the Lord shall renew their strength.', ref: 'Isaiah 40:31' },
    { text: 'For I am sure that neither death nor life... shall separate us from the love of God.', ref: 'Romans 8:38-39' },
    { text: 'Therefore, if anyone is in Christ, he is a new creation.', ref: '2 Corinthians 5:17' },
    { text: 'Greater love has no one than this, that someone lay down his life for his friends.', ref: 'John 15:13' },
    { text: 'A new commandment I give to you, that you love one another.', ref: 'John 13:34' },
    { text: 'The Lord will keep you from all evil; he will keep your life.', ref: 'Psalm 121:7' },
    { text: 'O Lord, you have searched me and known me.', ref: 'Psalm 139:1' },
    { text: 'The Lord is good, a stronghold in the day of trouble.', ref: 'Nahum 1:7' },
    { text: 'And behold, I am with you always, to the end of the age.', ref: 'Matthew 28:20' }
  ];

  // ═══════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════
  let data = S.load();

  // ═══════════════════════════════════════════════════════════
  // ONBOARDING
  // ═══════════════════════════════════════════════════════════
  const STEPS = ['welcome', 'dates', 'commitments', 'why', 'tone'];
  let currentStep = 0;

  function showOnboardingStep(stepIndex) {
    document.querySelectorAll('.onboarding-step').forEach((el) => el.classList.add('hidden'));
    const step = document.querySelector(`[data-step="${STEPS[stepIndex]}"]`);
    if (step) step.classList.remove('hidden');

    document.querySelectorAll('.step-dot').forEach((d, i) => {
      d.classList.toggle('active', i === stepIndex);
    });
    currentStep = stepIndex;
  }

  function completeOnboarding() {
    const startDate = document.getElementById('start-date')?.value;
    const givingUp = document.getElementById('giving-up')?.value?.trim() || '';
    const adding = document.getElementById('adding')?.value?.trim() || '';
    const whyText = document.getElementById('why-text')?.value?.trim() || '';
    const toneBtn = document.querySelector('.tone-btn.selected, .tone-btn[data-selected="true"]');
    const toneMode = toneBtn?.dataset.tone || 'gentle';

    data = {
      ...data,
      startDate: startDate || data.startDate,
      commitments: { givingUp, adding },
      whyText: whyText || data.whyText,
      toneMode
    };
    S.save(data);
    U.hide(document.getElementById('onboarding'));
    U.show(document.getElementById('main-app'));
    initMainApp();
    Forty.setActivePanel('dashboard');
    renderDashboard();
  }

  function initOnboarding() {
    const dateInput = document.getElementById('start-date');
    if (dateInput && !dateInput.value) {
      const ashWed = getAshWednesday(new Date().getFullYear());
      if (ashWed) dateInput.value = ashWed;
    }
    document.querySelectorAll('[data-next]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        U.ripple(e, btn);
        if (currentStep === 1) {
          const dateVal = document.getElementById('start-date')?.value;
          if (!dateVal) {
            U.toast('Please select a start date', 'error');
            return;
          }
        }
        if (currentStep === STEPS.length - 1) {
          completeOnboarding();
        } else {
          showOnboardingStep(currentStep + 1);
        }
      });
    });

    document.querySelectorAll('.tone-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tone-btn').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        btn.setAttribute('data-selected', 'true');
      });
    });

    showOnboardingStep(0);
  }

  // ═══════════════════════════════════════════════════════════
  // DASHBOARD
  // ═══════════════════════════════════════════════════════════
  function getAshWednesday(year) {
    const easter = getEasterSunday(year);
    const ashWed = new Date(easter);
    ashWed.setDate(ashWed.getDate() - 46);
    return ashWed.toISOString().slice(0, 10);
  }
  function getEasterSunday(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  }

  function getScriptureForDay(day) {
    const idx = (day ? day - 1 : 0) % SCRIPTURES.length;
    return SCRIPTURES[idx];
  }

  function renderDashboard() {
    data = S.load();
    const day = S.currentDay(data);
    const scripture = getScriptureForDay(day);

    const hasCommitments = !!(data.commitments?.givingUp?.trim() || data.commitments?.adding?.trim());
    const givingUpEl = document.getElementById('giving-up-line');
    const addingEl = document.getElementById('adding-line');
    if (givingUpEl) givingUpEl.textContent = data.commitments?.givingUp?.trim() ? 'Giving up: ' + data.commitments.givingUp.trim() : '';
    if (addingEl) addingEl.textContent = data.commitments?.adding?.trim() ? 'Adding: ' + data.commitments.adding.trim() : '';
    const cr = document.getElementById('commitments-reminder');
    if (cr) cr.style.display = hasCommitments ? 'block' : 'none';

    const dayNumEl = document.getElementById('day-num');
    const ringFill = document.querySelector('.ring-fill');
    const streakEl = document.getElementById('streak-value');
    const streakWrap = document.querySelector('.streak-display');
    const scriptureTextEl = document.getElementById('scripture-text');
    const scriptureRefEl = document.getElementById('scripture-ref');

    if (dayNumEl) dayNumEl.textContent = day ?? '—';
    const circumference = 2 * Math.PI * 54;
    const progress = day != null ? (day / 40) * circumference : 0;
    if (ringFill) ringFill.style.strokeDashoffset = circumference - progress;

    const streak = A.computeStreak(data);
    if (streakEl) streakEl.textContent = streak;
    if (streakWrap) streakWrap.classList.toggle('broken', streak === 0 && (data.logs || []).length > 0);

    if (scripture && scriptureTextEl) scriptureTextEl.textContent = scripture.text;
    if (scripture && scriptureRefEl) scriptureRefEl.textContent = scripture.ref;

    const promptEl = document.getElementById('daily-prompt');
    const wisdomEl = document.getElementById('wisdom-text');
    if (promptEl && C.DAILY_PROMPTS) {
      const promptIdx = Math.min((day ? day - 1 : 0), C.DAILY_PROMPTS.length - 1);
      promptEl.textContent = C.DAILY_PROMPTS[promptIdx] || '';
    }
    if (wisdomEl && C.WISDOM_OF_THE_DAY) {
      const wisdomIdx = Math.min((day ? day - 1 : 0), C.WISDOM_OF_THE_DAY.length - 1);
      wisdomEl.textContent = C.WISDOM_OF_THE_DAY[wisdomIdx] || '';
    }

    const intentions = data.prayerIntentions || [];
    const compactEl = document.getElementById('prayer-intentions-compact');
    if (compactEl) {
      if (intentions.length === 0) {
        compactEl.innerHTML = '';
        compactEl.style.display = 'none';
      } else {
        compactEl.style.display = 'block';
        compactEl.innerHTML = '<h3 class="prompt-heading">Prayer intentions</h3><ul class="intentions-list">' +
          intentions.slice(0, 3).map((i) => '<li>' + escapeHtml(i) + '</li>').join('') +
          (intentions.length > 3 ? '<li class="muted">+' + (intentions.length - 3) + ' more</li>' : '') + '</ul>';
      }
    }

  }

  // ═══════════════════════════════════════════════════════════
  // DAILY CHECK-IN
  // ═══════════════════════════════════════════════════════════
  function renderCheckin() {
    data = S.load();
    const today = S.todayString();
    const log = S.getOrCreateLogForToday(data);

    const dateEl = document.getElementById('checkin-date');
    const fastEl = document.getElementById('toggle-fast');
    const prayerEl = document.getElementById('toggle-prayer');
    const scriptureEl = document.getElementById('toggle-scripture');
    const reflectionEl = document.getElementById('checkin-reflection');
    if (dateEl) dateEl.textContent = U.formatDate(today);
    if (fastEl) fastEl.checked = log.fast;
    if (prayerEl) prayerEl.checked = log.prayer;
    if (scriptureEl) scriptureEl.checked = log.scripture;
    if (reflectionEl) reflectionEl.value = log.reflection || '';

    document.querySelectorAll('#mood-selector .mood-btn').forEach((btn) => {
      btn.classList.toggle('selected', btn.dataset.mood === log.mood);
    });
  }

  function saveCheckin() {
    data = S.load();
    const today = S.todayString();
    const prevStreak = A.computeStreak(data);
    const log = {
      date: today,
      fast: document.getElementById('toggle-fast').checked,
      prayer: document.getElementById('toggle-prayer').checked,
      scripture: document.getElementById('toggle-scripture').checked,
      mood: document.querySelector('.mood-btn.selected')?.dataset.mood || 'neutral',
      reflection: document.getElementById('checkin-reflection').value?.trim() || ''
    };

    const result = S.saveLog(data, log);
    if (!result.ok) {
      U.toast('Could not save. Please try again.', 'error');
      return;
    }

    data = S.load();
    U.toast('Check-in saved');
    const newStreak = A.computeStreak(data);

    U.successAnimation(document.getElementById('btn-save-checkin'));
    if (newStreak < prevStreak && prevStreak > 0) {
      document.querySelector('.streak-display')?.classList.add('broken');
    }
    renderDashboard();
  }

  // ═══════════════════════════════════════════════════════════
  // CALENDAR
  // ═══════════════════════════════════════════════════════════
  function renderCalendar() {
    data = S.load();
    const start = S.parseDate(data.startDate);
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (!start) {
      grid.innerHTML = '<p class="muted">Set your start date in onboarding.</p>';
      return;
    }
    const lit = C.getLiturgicalDates ? C.getLiturgicalDates(data.startDate) : { keyDates: [] };
    const keyDateMap = {};
    (lit.keyDates || []).forEach((kd) => { keyDateMap[kd.date] = kd.label; });
    for (let i = 0; i < 40; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const log = S.getLogForDate(data, dateStr);
      const dayNum = i + 1;
      const isToday = dateStr === S.todayString();
      const isFuture = d > new Date();
      const label = keyDateMap[dateStr] || 'Day ' + dayNum;
      const cell = document.createElement('div');
      cell.className = 'calendar-cell' + (isToday ? ' today' : '') + (isFuture ? ' future' : '') + (log && (log.fast || log.prayer || log.scripture) ? ' logged' : '');
      cell.title = label + (log ? ' – logged' : '');
      cell.innerHTML = '<span class="cal-day">' + dayNum + '</span><span class="cal-date">' + d.getDate() + '</span>' + (keyDateMap[dateStr] ? '<span class="cal-key">' + escapeHtml(keyDateMap[dateStr]) + '</span>' : '');
      grid.appendChild(cell);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // ANALYTICS
  // ═══════════════════════════════════════════════════════════
  function renderAnalytics() {
    data = S.load();
    const els = {
      score: document.getElementById('discipline-score'),
      label: document.getElementById('discipline-label'),
      weekly: document.getElementById('weekly-pct'),
      failure: document.getElementById('failure-day'),
      streakChart: document.getElementById('streak-chart'),
      moodChart: document.getElementById('mood-chart')
    };
    if (!els.score || !els.streakChart) return;

    const { score, label } = A.disciplineScore(data);
    const weeklyPct = A.weeklyCompletion(data);
    const failureDay = A.failureDayOfWeek(data) || '—';
    const streakData = A.streakHistoryData(data);
    const moodData = A.moodTrendData(data);
    const hasLogs = (data.logs || []).length > 0;

    els.score.textContent = score ?? '—';
    els.label.textContent = hasLogs ? label : 'Log check-ins to see your score';
    els.weekly.textContent = hasLogs ? weeklyPct + '%' : '—';
    els.failure.textContent = failureDay;

    const streakChart = els.streakChart;
    streakChart.innerHTML = '';
    streakData.forEach((d) => {
      const wrap = document.createElement('div');
      wrap.className = 'streak-bar-wrap';
      const bar = document.createElement('div');
      bar.className = 'streak-bar' + (d.value === 0 ? ' empty' : '');
      bar.style.height = `${(d.value / 3) * 100}%`;
      bar.title = `${d.date}: ${d.value}/3`;
      wrap.appendChild(bar);
      const lbl = document.createElement('span');
      lbl.className = 'streak-bar-label';
      lbl.textContent = new Date(d.date).getDate();
      wrap.appendChild(lbl);
      streakChart.appendChild(wrap);
    });

    const moodChart = els.moodChart;
    moodChart.innerHTML = '';
    const moodMax = Math.max(...Object.values(moodData), 1);
    const moodLabelsMap = { peaceful: 'fa-solid fa-sun', grateful: 'fa-solid fa-heart', neutral: 'fa-regular fa-circle', struggling: 'fa-solid fa-cloud', tempted: 'fa-solid fa-moon' };
    ['peaceful', 'grateful', 'neutral', 'struggling', 'tempted'].forEach((m) => {
      const wrap = document.createElement('div');
      wrap.className = 'mood-bar-wrap';
      const bar = document.createElement('div');
      bar.className = 'mood-bar';
      bar.style.height = `${(moodData[m] || 0) / moodMax * 80}px`;
      bar.title = `${m}: ${moodData[m] || 0}`;
      wrap.appendChild(bar);
      const lbl = document.createElement('span');
      lbl.className = 'mood-chart-label';
      lbl.innerHTML = `<i class="${moodLabelsMap[m]}"></i>`;
      lbl.title = m;
      wrap.appendChild(lbl);
      moodChart.appendChild(wrap);
    });

    const moodDiscipline = A.moodVsDiscipline ? A.moodVsDiscipline(data) : null;
    const moodDisciplineEl = document.getElementById('mood-discipline-chart');
    if (moodDisciplineEl) {
      moodDisciplineEl.innerHTML = '';
      if (moodDiscipline && Object.keys(moodDiscipline).length > 0) {
        Object.entries(moodDiscipline).forEach(([mood, pct]) => {
          const wrap = document.createElement('div');
          wrap.className = 'mood-disc-wrap';
          wrap.innerHTML = '<span class="mood-disc-label">' + mood + '</span><div class="mood-disc-bar-wrap"><div class="mood-disc-bar" style="width:' + pct + '%"></div></div><span class="mood-disc-pct">' + pct + '%</span>';
          moodDisciplineEl.appendChild(wrap);
        });
      } else {
        moodDisciplineEl.innerHTML = '<p class="muted">Log check-ins with mood to see correlations.</p>';
      }
    }

    const bestTime = A.bestLogTime ? A.bestLogTime(data) : null;
    const bestTimeEl = document.getElementById('best-time');
    if (bestTimeEl) bestTimeEl.textContent = bestTime || '—';
  }

  // ═══════════════════════════════════════════════════════════
  // JOURNAL
  // ═══════════════════════════════════════════════════════════
  function renderJournal() {
    const logs = [...(data.logs || [])].sort((a, b) => (a.date > b.date ? -1 : 1));
    const container = document.getElementById('journal-timeline');
    container.innerHTML = '';

    if (logs.length === 0) {
      container.innerHTML = '<div class="journal-empty"><i class="fa-regular fa-book-open"></i><p>No entries yet.</p><p class="journal-empty-hint">Log your first check-in from the Log tab.</p></div>';
      return;
    }

    logs.forEach((log) => {
      const entry = document.createElement('div');
      entry.className = 'journal-entry';
      entry.dataset.date = log.date;
      const hasReflection = !!(log.reflection && log.reflection.trim());
      const scriptureRef = log.scriptureRef ? '<cite class="journal-scripture-ref">' + escapeHtml(log.scriptureRef) + '</cite>' : '';
      const snippetText = hasReflection ? escapeHtml((log.reflection || '').slice(0, 120)) + ((log.reflection || '').length > 120 ? '…' : '') : 'No reflection written';
      entry.innerHTML = `
        <div class="journal-entry-header">
          <span class="journal-entry-date">${U.formatDate(log.date)}</span>
          <span class="journal-entry-mood">${U.getMoodIcon(log.mood)}</span>
        </div>
        ${scriptureRef}
        <p class="journal-entry-snippet ${!hasReflection ? 'muted' : ''}">${snippetText}</p>
        <div class="journal-entry-expanded hidden"></div>
      `;
      const expanded = entry.querySelector('.journal-entry-expanded');
      entry.querySelector('.journal-entry-header').addEventListener('click', () => {
        const isExpanded = entry.classList.toggle('expanded');
        expanded.classList.toggle('hidden', !isExpanded);
        if (isExpanded) expanded.textContent = log.reflection || 'No reflection written';
      });
      container.appendChild(entry);
    });
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `forty-export-${S.todayString()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // ═══════════════════════════════════════════════════════════
  // EMERGENCY MODE
  // ═══════════════════════════════════════════════════════════
  function openEmergency() {
    data = S.load();
    const verse = SCRIPTURES[Math.floor(Math.random() * SCRIPTURES.length)];
    document.getElementById('emergency-scripture').textContent = verse.text;
    document.getElementById('emergency-ref').textContent = verse.ref;
    document.getElementById('emergency-why-text').textContent = data.whyText || 'Remember why you began.';
    U.show(document.getElementById('emergency-overlay'));
    document.getElementById('emergency-overlay').classList.remove('hidden');
    U.lockBodyScroll(true);
    startBreathingTimer();
  }

  function closeEmergency() {
    document.getElementById('emergency-overlay').classList.add('hidden');
    U.lockBodyScroll(false);
    stopBreathingTimer();
  }

  let breathInterval;
  function startBreathingTimer() {
    const circle = document.getElementById('breath-circle');
    const label = document.getElementById('breath-label');
    let count = 60;
    let phase = 'in';

    document.getElementById('breath-countdown').textContent = count;

    breathInterval = setInterval(() => {
      count--;
      document.getElementById('breath-countdown').textContent = count;
      if (count <= 0) clearInterval(breathInterval);
    }, 1000);

    const breathCycle = setInterval(() => {
      if (phase === 'in') {
        circle?.classList.add('expand');
        label.textContent = 'Breathe in';
        phase = 'out';
      } else {
        circle?.classList.remove('expand');
        label.textContent = 'Breathe out';
        phase = 'in';
      }
    }, 4000);
    window._breathCycle = breathCycle;
  }

  function stopBreathingTimer() {
    clearInterval(breathInterval);
    clearInterval(window._breathCycle);
    document.getElementById('breath-circle')?.classList.remove('expand');
    document.getElementById('breath-label').textContent = 'Breathe in';
  }

  // ═══════════════════════════════════════════════════════════
  // SETTINGS
  // ═══════════════════════════════════════════════════════════
  function renderSettings() {
    data = S.load();
    const toggleDarkEl = document.getElementById('toggle-dark');
    const givingUpEl = document.getElementById('settings-giving-up');
    const addingEl = document.getElementById('settings-adding');
    const reminderEl = document.getElementById('reminder-time');
    const fastingEl = document.getElementById('fasting-schedule');
    if (toggleDarkEl) toggleDarkEl.checked = data.theme === 'dark';
    if (givingUpEl) givingUpEl.textContent = data.commitments?.givingUp ? 'Giving up: ' + data.commitments.givingUp : 'Not set';
    if (addingEl) addingEl.textContent = data.commitments?.adding ? 'Adding: ' + data.commitments.adding : 'Not set';
    if (reminderEl) reminderEl.value = data.reminderTime || '';
    if (fastingEl) fastingEl.value = data.fastingSchedule || 'all';
    document.querySelectorAll('#settings .tone-btn').forEach((btn) => {
      btn.classList.toggle('selected', btn.dataset.tone === data.toneMode);
    });
    renderPrayerIntentions();
  }

  function toggleDark() {
    data = S.load();
    data.theme = document.getElementById('toggle-dark').checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', data.theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = data.theme === 'dark' ? '#1A1A1A' : '#6E7F5F';
    S.save(data);
  }

  function resetLent() {
    if (!confirm('Reset all Lent data? This cannot be undone.')) return;
    S.reset();
    location.reload();
  }

  function openEditCommitmentsModal() {
    data = S.load();
    document.getElementById('edit-giving-up').value = data.commitments?.givingUp || '';
    document.getElementById('edit-adding').value = data.commitments?.adding || '';
    const modal = document.getElementById('edit-commitments-modal');
    U.show(modal);
    modal.classList.remove('hidden');
    U.lockBodyScroll(true);
  }
  function closeEditCommitmentsModal() {
    U.hide(document.getElementById('edit-commitments-modal'));
    document.getElementById('edit-commitments-modal').classList.add('hidden');
    U.lockBodyScroll(false);
  }
  function saveCommitments() {
    data = S.load();
    data.commitments = {
      givingUp: document.getElementById('edit-giving-up').value.trim(),
      adding: document.getElementById('edit-adding').value.trim()
    };
    S.save(data);
    closeEditCommitmentsModal();
    renderSettings();
    renderDashboard();
    U.toast('Commitments updated');
  }

  function openJournalEntryModal() {
    U.lockBodyScroll(true);
    data = S.load();
    const start = S.parseDate(data.startDate);
    const dateInput = document.getElementById('journal-entry-date');
    dateInput.value = S.todayString();
    if (start) {
      const min = new Date(start);
      const max = new Date(start);
      max.setDate(max.getDate() + 39);
      dateInput.min = min.toISOString().slice(0, 10);
      dateInput.max = max.toISOString().slice(0, 10);
    }
    document.getElementById('journal-entry-reflection').value = '';
    const scriptureInput = document.getElementById('journal-entry-scripture');
    if (scriptureInput) scriptureInput.value = '';
    document.querySelectorAll('#journal-mood-selector .mood-btn').forEach((b) => b.classList.remove('selected'));
    const neutral = document.querySelector('#journal-mood-selector .mood-btn[data-mood="neutral"]');
    if (neutral) neutral.classList.add('selected');
    const jModal = document.getElementById('journal-entry-modal');
    U.show(jModal);
    jModal.classList.remove('hidden');
  }
  function closeJournalEntryModal() {
    U.hide(document.getElementById('journal-entry-modal'));
    document.getElementById('journal-entry-modal').classList.add('hidden');
    U.lockBodyScroll(false);
  }
  function saveJournalEntry() {
    const dateStr = document.getElementById('journal-entry-date').value;
    const reflection = document.getElementById('journal-entry-reflection').value.trim();
    const scriptureRef = document.getElementById('journal-entry-scripture')?.value?.trim() || '';
    const moodBtn = document.querySelector('#journal-mood-selector .mood-btn.selected');
    const mood = moodBtn?.dataset.mood || 'neutral';
    if (!dateStr) return;
    data = S.load();
    if (S.saveJournalEntry(data, dateStr, reflection, mood, scriptureRef || undefined)) {
      closeJournalEntryModal();
      renderJournal();
      U.toast('Journal entry saved');
    } else {
      U.toast('Could not save entry.', 'error');
    }
  }

  function saveVerseToJournal() {
    const scripture = getScriptureForDay(S.currentDay(data));
    if (!scripture) return;
    const today = S.todayString();
    data = S.load();
    const existing = S.getLogForDate(data, today);
    const reflection = (existing?.reflection || '').trim();
    const newReflection = reflection ? reflection + '\n\n— ' + scripture.text + ' (' + scripture.ref + ')' : '— ' + scripture.text + ' (' + scripture.ref + ')';
    if (S.saveJournalEntry(data, today, newReflection, existing?.mood || 'neutral', scripture.ref)) {
      U.toast('Verse saved to journal');
      renderJournal();
    }
  }

  function openStationsModal() {
    if (!C.STATIONS) return;
    const body = document.getElementById('stations-body');
    body.innerHTML = C.STATIONS.map((s) => '<div class="station-item"><span class="station-num">' + s.n + '</span><h4>' + escapeHtml(s.title) + '</h4><p class="station-prayer">' + escapeHtml(s.prayer) + '</p></div>').join('');
    const modal = document.getElementById('stations-modal');
    U.show(modal);
    modal.classList.remove('hidden');
    U.lockBodyScroll(true);
  }

  function closeStationsModal() {
    document.getElementById('stations-modal').classList.add('hidden');
    U.lockBodyScroll(false);
  }

  function checkMilestones() {
    const day = S.currentDay(data);
    const seen = JSON.parse(localStorage.getItem('forty_milestones_seen') || '[]');
    const milestones = [10, 20, 30];
    const hit = milestones.find((m) => m === day && !seen.includes(m));
    if (!hit) return;
    seen.push(hit);
    localStorage.setItem('forty_milestones_seen', JSON.stringify(seen));
    const titles = { 10: 'One quarter done', 20: 'Halfway there', 30: 'Three quarters complete' };
    const msgs = { 10: 'You\'ve shown up for 10 days. Keep going.', 20: '20 days of faithfulness. You\'re halfway through.', 30: '30 days. You\'re almost there.' };
    document.getElementById('milestone-title').textContent = titles[hit];
    document.getElementById('milestone-message').textContent = msgs[hit];
    const modal = document.getElementById('milestone-modal');
    U.show(modal);
    modal.classList.remove('hidden');
    U.lockBodyScroll(true);
  }

  function closeMilestoneModal() {
    document.getElementById('milestone-modal').classList.add('hidden');
    U.lockBodyScroll(false);
  }

  function openShareModal() {
    data = S.load();
    const day = S.currentDay(data);
    const { score, label } = A.disciplineScore(data);
    const streak = A.computeStreak(data);
    const total = (data.logs || []).length;
    const text = `Forty — Lent Companion\n\nDay ${day || 0} of 40\nStreak: ${streak} days\nDiscipline: ${score ?? '—'}% (${label || ''})\nCheck-ins: ${total}\n\nTracked with Forty — A Lent Companion`;
    document.getElementById('share-text').value = text;
    const modal = document.getElementById('share-modal');
    U.show(modal);
    modal.classList.remove('hidden');
    U.lockBodyScroll(true);
  }

  function closeShareModal() {
    document.getElementById('share-modal').classList.add('hidden');
    U.lockBodyScroll(false);
  }

  function copyShare() {
    const ta = document.getElementById('share-text');
    ta.select();
    document.execCommand('copy');
    U.toast('Copied to clipboard');
  }

  function addPrayerIntention() {
    const input = document.getElementById('prayer-intention-input');
    const text = input?.value?.trim();
    if (!text) return;
    data = S.load();
    data.prayerIntentions = [...(data.prayerIntentions || []), text];
    S.save(data);
    input.value = '';
    renderSettings();
    renderDashboard();
    U.toast('Prayer intention added');
  }

  function removePrayerIntention(idx) {
    data = S.load();
    const list = [...(data.prayerIntentions || [])];
    list.splice(idx, 1);
    data.prayerIntentions = list;
    S.save(data);
    renderSettings();
    renderDashboard();
    U.toast('Prayer intention removed');
  }

  function renderPrayerIntentions() {
    const list = document.getElementById('prayer-intentions-list');
    if (!list) return;
    const intentions = data.prayerIntentions || [];
    list.innerHTML = intentions.length === 0 ? '<p class="muted">No prayer intentions yet.</p>' : intentions.map((item, i) => '<div class="prayer-item"><span>' + escapeHtml(item) + '</span><button type="button" class="btn-text btn-remove" data-prayer-idx="' + i + '" aria-label="Remove">×</button></div>').join('');
  }

  function importData() {
    const input = document.getElementById('import-file-input');
    input.value = '';
    input.click();
  }

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        data = S.load();
        const merged = S.mergeImport(data, imported);
        if (!merged) {
          U.toast('Invalid import file.', 'error');
          return;
        }
        S.save(merged);
        data = merged;
        renderDashboard();
        renderJournal();
        renderSettings();
        renderAnalytics();
        renderCalendar();
        U.toast('Data imported successfully');
      } catch (_) {
        U.toast('Could not parse import file.', 'error');
      }
    };
    reader.readAsText(file);
  }

  function setupReminder() {
    const timeEl = document.getElementById('reminder-time');
    if (!timeEl) return;
    data = S.load();
    timeEl.value = data.reminderTime || '';
    const check = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const t = data.reminderTime;
      if (t && t === h + ':' + m) {
        if (Notification.permission === 'granted') {
          new Notification('Forty — Lent Companion', { body: 'Time for your daily check-in.', icon: './assets/icons/icon-192.png' });
        }
        data.lastReminder = new Date().toISOString().slice(0, 10);
        S.save(data);
      }
    };
    setInterval(check, 60000);
  }

  function saveReminderTime() {
    data = S.load();
    data.reminderTime = document.getElementById('reminder-time')?.value || null;
    S.save(data);
  }

  function saveFastingSchedule() {
    data = S.load();
    data.fastingSchedule = document.getElementById('fasting-schedule')?.value || 'all';
    S.save(data);
  }

  // ═══════════════════════════════════════════════════════════
  // ROUTING & TABS
  // ═══════════════════════════════════════════════════════════
  function renderCheckinPanel() {
    data = S.load();
    const today = S.todayString();
    const log = S.getLogForDate(data, today);
    const statusEl = document.getElementById('today-status');
    if (!log) {
      statusEl.innerHTML = '<p class="today-status-msg">Not logged yet.</p>';
    } else {
      const parts = [];
      if (log.fast) parts.push('<i class="fa-solid fa-check"></i> Fast');
      else parts.push('<i class="fa-regular fa-circle"></i> Fast');
      if (log.prayer) parts.push('<i class="fa-solid fa-check"></i> Prayer');
      else parts.push('<i class="fa-regular fa-circle"></i> Prayer');
      if (log.scripture) parts.push('<i class="fa-solid fa-check"></i> Scripture');
      else parts.push('<i class="fa-regular fa-circle"></i> Scripture');
      statusEl.innerHTML = '<p class="today-status-msg">' + parts.join(' &nbsp; ') + '</p>';
    }
  }

  function onPanelChange(panelId) {
    if (panelId === 'dashboard') renderDashboard();
    if (panelId === 'checkin') renderCheckinPanel();
    if (panelId === 'calendar') renderCalendar();
    if (panelId === 'analytics') renderAnalytics();
    if (panelId === 'journal') renderJournal();
    if (panelId === 'settings') renderSettings();
  }

  // ═══════════════════════════════════════════════════════════
  // EASTER SUMMARY
  // ═══════════════════════════════════════════════════════════
  function checkEasterSummary() {
    const day = S.currentDay(data);
    if (day === 40) {
      const easter = document.getElementById('easter-summary');
      U.show(easter);
      easter.classList.remove('hidden');
      U.lockBodyScroll(true);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════════════════════
  const Forty = {
    setActivePanel(panelId) {
      U.setActivePanel(panelId);
      onPanelChange(panelId);
    }
  };
  window.Forty = Forty;

  function initMainApp() {
    window.location.hash = window.location.hash || 'dashboard';

    const tabBar = document.querySelector('.tab-bar');
    if (tabBar) {
      tabBar.addEventListener('click', (e) => {
        const tabBtn = e.target.closest('.tab-btn');
        if (tabBtn && tabBtn.dataset.tab) {
          e.preventDefault();
          e.stopPropagation();
          Forty.setActivePanel(tabBtn.dataset.tab);
          window.location.hash = tabBtn.dataset.tab;
        }
      });
    }

    R.initRouter({
      onRoute(view, panel) {
        const id = panel || view;
        if (['dashboard', 'checkin', 'calendar', 'analytics', 'journal', 'settings'].includes(id)) {
          Forty.setActivePanel(id);
        }
      }
    });

    document.body.addEventListener('click', (e) => {
      const closeModal = e.target.closest('[data-close-modal]');
      if (closeModal) {
        e.preventDefault();
        closeCheckinModal();
        return;
      }
      const emergencyBtn = e.target.closest('.emergency-trigger');
      if (emergencyBtn) {
        e.preventDefault();
        openEmergency();
        return;
      }
      const moodBtn = e.target.closest('#mood-selector .mood-btn');
      if (moodBtn) {
        e.preventDefault();
        document.querySelectorAll('#mood-selector .mood-btn').forEach((b) => b.classList.remove('selected'));
        moodBtn.classList.add('selected');
        return;
      }
      const toneBtn = e.target.closest('#settings .tone-btn');
      if (toneBtn) {
        e.preventDefault();
        document.querySelectorAll('#settings .tone-btn').forEach((b) => {
          b.classList.remove('selected');
          b.removeAttribute('aria-selected');
        });
        toneBtn.classList.add('selected');
        toneBtn.setAttribute('aria-selected', 'true');
        data = S.load();
        data.toneMode = toneBtn.dataset.tone;
        S.save(data);
        return;
      }
      if (e.target.id === 'btn-save-verse' || e.target.closest('#btn-save-verse')) {
        e.preventDefault();
        saveVerseToJournal();
        return;
      }
      if (e.target.id === 'btn-stations' || e.target.closest('#btn-stations')) {
        e.preventDefault();
        openStationsModal();
        return;
      }
      if (e.target.closest('[data-close-stations]')) {
        e.preventDefault();
        closeStationsModal();
        return;
      }
      if (e.target.closest('[data-close-milestone]') || e.target.id === 'milestone-dismiss') {
        e.preventDefault();
        closeMilestoneModal();
        return;
      }
      if (e.target.id === 'btn-share-completion' || e.target.closest('#btn-share-completion')) {
        e.preventDefault();
        openShareModal();
        return;
      }
      if (e.target.closest('[data-close-share]')) {
        e.preventDefault();
        closeShareModal();
        return;
      }
      if (e.target.id === 'btn-copy-share' || e.target.closest('#btn-copy-share')) {
        e.preventDefault();
        copyShare();
        return;
      }
      if (e.target.id === 'btn-add-prayer' || e.target.closest('#btn-add-prayer')) {
        e.preventDefault();
        addPrayerIntention();
        return;
      }
      const prayerRemove = e.target.closest('[data-prayer-idx]');
      if (prayerRemove) {
        e.preventDefault();
        removePrayerIntention(parseInt(prayerRemove.dataset.prayerIdx, 10));
        return;
      }
      if (e.target.id === 'import-data' || e.target.closest('#import-data')) {
        e.preventDefault();
        importData();
        return;
      }
      if (e.target.id === 'btn-log-today' || e.target.closest('#btn-log-today')) {
        e.preventDefault();
        openCheckinModal();
        return;
      }
      if (e.target.id === 'btn-open-checkin-modal' || e.target.closest('#btn-open-checkin-modal')) {
        e.preventDefault();
        openCheckinModal();
        return;
      }
      if (e.target.id === 'btn-export' || e.target.closest('#btn-export')) {
        e.preventDefault();
        exportData();
        return;
      }
      if (e.target.id === 'export-data' || e.target.closest('#export-data')) {
        e.preventDefault();
        exportData();
        return;
      }
      const editCommitmentsBtn = e.target.closest('#edit-commitments');
      if (editCommitmentsBtn) {
        e.preventDefault();
        e.stopPropagation();
        openEditCommitmentsModal();
        return;
      }
      if (e.target.closest('[data-close-edit-commitments]')) {
        e.preventDefault();
        closeEditCommitmentsModal();
        return;
      }
      const journalMoodBtn = e.target.closest('#journal-mood-selector .mood-btn');
      if (journalMoodBtn) {
        e.preventDefault();
        document.querySelectorAll('#journal-mood-selector .mood-btn').forEach((b) => b.classList.remove('selected'));
        journalMoodBtn.classList.add('selected');
        return;
      }
      if (e.target.id === 'btn-new-journal-entry' || e.target.closest('#btn-new-journal-entry')) {
        e.preventDefault();
        openJournalEntryModal();
        return;
      }
      if (e.target.closest('[data-close-journal-entry]')) {
        e.preventDefault();
        closeJournalEntryModal();
        return;
      }
      if (e.target.id === 'btn-save-journal-entry' || e.target.closest('#btn-save-journal-entry')) {
        e.preventDefault();
        saveJournalEntry();
        return;
      }
      if (e.target.id === 'btn-save-commitments' || e.target.closest('#btn-save-commitments')) {
        e.preventDefault();
        saveCommitments();
        return;
      }
      if (e.target.closest('[data-close-easter]')) {
        e.preventDefault();
        U.hide(document.getElementById('easter-summary'));
        document.getElementById('easter-summary').classList.add('hidden');
        U.lockBodyScroll(false);
        return;
      }
      if (e.target.id === 'reset-lent' || e.target.closest('#reset-lent')) {
        e.preventDefault();
        resetLent();
        return;
      }
      if (e.target.id === 'btn-save-checkin' || e.target.closest('#btn-save-checkin')) {
        e.preventDefault();
        U.ripple(e, e.target.closest('#btn-save-checkin') || e.target);
        saveCheckin();
        closeCheckinModal();
        return;
      }
      if (e.target.id === 'emergency-close' || e.target.closest('#emergency-close')) {
        e.preventDefault();
        closeEmergency();
        return;
      }
    });

    function openCheckinModal() {
      renderCheckin();
      const modal = document.getElementById('checkin-modal');
      U.show(modal);
      modal.classList.remove('hidden');
      U.lockBodyScroll(true);
    }
    function closeCheckinModal() {
      U.hide(document.getElementById('checkin-modal'));
      document.getElementById('checkin-modal').classList.add('hidden');
      U.lockBodyScroll(false);
    }

    document.body.addEventListener('change', (e) => {
      if (e.target.id === 'toggle-dark') toggleDark();
      if (e.target.id === 'reminder-time') {
        saveReminderTime();
        if (e.target.value && 'Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission().catch(() => {});
        }
      }
      if (e.target.id === 'fasting-schedule') saveFastingSchedule();
    });

    document.getElementById('import-file-input')?.addEventListener('change', handleImport);

    document.getElementById('prayer-intention-input')?.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') { ev.preventDefault(); addPrayerIntention(); }
    });

    renderDashboard();
    checkEasterSummary();
    checkMilestones();

    // PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  }

  function init() {
    data = S.load();

    document.documentElement.setAttribute('data-theme', data.theme || 'light');

    if (!data.startDate) {
      U.show(document.getElementById('onboarding'));
      U.hide(document.getElementById('main-app'));
      initOnboarding();
      return;
    }

    U.hide(document.getElementById('onboarding'));
    U.show(document.getElementById('main-app'));
    initMainApp();

    renderDashboard();
    checkEasterSummary();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
