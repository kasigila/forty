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
  }

  // ═══════════════════════════════════════════════════════════
  // DAILY CHECK-IN
  // ═══════════════════════════════════════════════════════════
  function renderCheckin() {
    data = S.load();
    const today = S.todayString();
    const log = S.getOrCreateLogForToday(data);

    document.getElementById('checkin-date').textContent = U.formatDate(today);
    document.getElementById('toggle-fast').checked = log.fast;
    document.getElementById('toggle-prayer').checked = log.prayer;
    document.getElementById('toggle-scripture').checked = log.scripture;
    document.getElementById('checkin-reflection').value = log.reflection || '';

    document.querySelectorAll('.mood-btn').forEach((btn) => {
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
    if (!result.ok) return;

    data = S.load();
    const newStreak = A.computeStreak(data);

    U.successAnimation(document.getElementById('btn-save-checkin'));
    if (newStreak < prevStreak && prevStreak > 0) {
      document.querySelector('.streak-display')?.classList.add('broken');
    }
    renderDashboard();
  }

  // ═══════════════════════════════════════════════════════════
  // ANALYTICS
  // ═══════════════════════════════════════════════════════════
  function renderAnalytics() {
    data = S.load();
    const { score, label } = A.disciplineScore(data);
    const weeklyPct = A.weeklyCompletion(data);
    const failureDay = A.failureDayOfWeek(data) || '—';
    const streakData = A.streakHistoryData(data);
    const moodData = A.moodTrendData(data);

    document.getElementById('discipline-score').textContent = score ?? '—';
    document.getElementById('discipline-label').textContent = label;
    document.getElementById('weekly-pct').textContent = weeklyPct + '%';
    document.getElementById('failure-day').textContent = failureDay;

    const streakChart = document.getElementById('streak-chart');
    streakChart.innerHTML = '';
    const maxVal = Math.max(...streakData.map((d) => d.value), 1);
    streakData.forEach((d) => {
      const bar = document.createElement('div');
      bar.className = 'streak-bar' + (d.value === 0 ? ' empty' : '');
      bar.style.height = `${(d.value / 3) * 100}%`;
      streakChart.appendChild(bar);
    });

    const moodChart = document.getElementById('mood-chart');
    moodChart.innerHTML = '';
    const moodMax = Math.max(...Object.values(moodData), 1);
    const moodLabelsMap = { peaceful: '☼', grateful: '♥', neutral: '◎', struggling: '◐', tempted: '◔' };
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
      lbl.textContent = moodLabelsMap[m];
      lbl.title = m;
      wrap.appendChild(lbl);
      moodChart.appendChild(wrap);
    });
  }

  // ═══════════════════════════════════════════════════════════
  // JOURNAL
  // ═══════════════════════════════════════════════════════════
  function renderJournal() {
    const logs = [...(data.logs || [])].filter((l) => l.reflection).sort((a, b) => (a.date > b.date ? -1 : 1));
    const container = document.getElementById('journal-timeline');
    container.innerHTML = '';

    if (logs.length === 0) {
      container.innerHTML = '<p class="journal-empty">No reflections yet. Log your first check-in with a reflection.</p>';
      return;
    }

    logs.forEach((log) => {
      const entry = document.createElement('div');
      entry.className = 'journal-entry';
      entry.dataset.date = log.date;
      entry.innerHTML = `
        <div class="journal-entry-header">
          <span class="journal-entry-date">${U.formatDate(log.date)}</span>
          <span class="journal-entry-mood">${U.getMoodIcon(log.mood)}</span>
        </div>
        <p class="journal-entry-snippet">${escapeHtml((log.reflection || '').slice(0, 120))}${(log.reflection || '').length > 120 ? '…' : ''}</p>
        <div class="journal-entry-expanded hidden"></div>
      `;
      const snippet = entry.querySelector('.journal-entry-snippet');
      const expanded = entry.querySelector('.journal-entry-expanded');
      entry.querySelector('.journal-entry-header').addEventListener('click', () => {
        const isExpanded = entry.classList.toggle('expanded');
        expanded.classList.toggle('hidden', !isExpanded);
        if (isExpanded) expanded.textContent = log.reflection || '';
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
    startBreathingTimer();
  }

  function closeEmergency() {
    document.getElementById('emergency-overlay').classList.add('hidden');
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
    document.getElementById('toggle-dark').checked = data.theme === 'dark';
    document.querySelectorAll('#settings .tone-btn').forEach((btn) => {
      btn.classList.toggle('selected', btn.dataset.tone === data.toneMode);
    });
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

  function editCommitments() {
    data = S.load();
    const givingUp = prompt('What are you giving up?', data.commitments?.givingUp || '');
    const adding = prompt('What are you adding?', data.commitments?.adding || '');
    if (givingUp !== null) data.commitments = { ...data.commitments, givingUp: String(givingUp) };
    if (adding !== null) data.commitments = { ...data.commitments, adding: String(adding) };
    S.save(data);
  }

  // ═══════════════════════════════════════════════════════════
  // ROUTING & TABS
  // ═══════════════════════════════════════════════════════════
  function onPanelChange(panelId) {
    if (panelId === 'dashboard') renderDashboard();
    if (panelId === 'checkin') renderCheckin();
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
      U.show(document.getElementById('easter-summary'));
      document.getElementById('easter-summary').classList.remove('hidden');
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
    R.initRouter({
      onRoute(view, panel) {
        const id = panel || view;
        if (['dashboard', 'checkin', 'analytics', 'journal', 'settings'].includes(id)) {
          Forty.setActivePanel(id);
        }
      }
    });

    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        window.location.hash = tab;
      });
    });

    function openCheckinModal() {
      renderCheckin();
      U.show(document.getElementById('checkin-modal'));
      document.getElementById('checkin-modal').classList.remove('hidden');
    }
    function closeCheckinModal() {
      U.hide(document.getElementById('checkin-modal'));
      document.getElementById('checkin-modal').classList.add('hidden');
    }

    document.getElementById('btn-log-today')?.addEventListener('click', openCheckinModal);
    document.getElementById('btn-open-checkin-modal')?.addEventListener('click', openCheckinModal);

    document.getElementById('btn-save-checkin')?.addEventListener('click', (e) => {
      U.ripple(e, e.target);
      saveCheckin();
      closeCheckinModal();
    });

    document.querySelectorAll('[data-close-modal]').forEach((el) => {
      el.addEventListener('click', closeCheckinModal);
    });

    document.querySelectorAll('.emergency-trigger').forEach((el) => {
      el.addEventListener('click', openEmergency);
    });

    document.getElementById('emergency-close')?.addEventListener('click', closeEmergency);

    document.getElementById('emergency-overlay')?.querySelector('.emergency-content')?.addEventListener('click', (e) => {
      if (e.target.id === 'emergency-close') closeEmergency();
    });

    document.getElementById('btn-export')?.addEventListener('click', exportData);
    document.getElementById('export-data')?.addEventListener('click', (e) => { e.preventDefault(); exportData(); });

    document.getElementById('toggle-dark')?.addEventListener('change', toggleDark);

    document.getElementById('reset-lent')?.addEventListener('click', (e) => {
      e.preventDefault();
      resetLent();
    });

    document.getElementById('edit-commitments')?.addEventListener('click', (e) => {
      e.preventDefault();
      editCommitments();
    });

    document.getElementById('easter-dismiss')?.addEventListener('click', () => {
      U.hide(document.getElementById('easter-summary'));
      document.getElementById('easter-summary').classList.add('hidden');
    });

    document.querySelectorAll('#mood-selector .mood-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#mood-selector .mood-btn').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });

    document.querySelectorAll('#settings .tone-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#settings .tone-btn').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        data.toneMode = btn.dataset.tone;
        S.save(data);
      });
    });

    // Ripple on primary buttons
    document.querySelectorAll('.btn-primary').forEach((btn) => {
      btn.addEventListener('click', (e) => U.ripple(e, btn));
    });

    renderDashboard();
    checkEasterSummary();

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
