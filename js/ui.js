/**
 * Forty — UI utilities
 * Ripple, transitions, modal helpers
 */

/**
 * Add ripple effect on button click
 */
function ripple(e, el) {
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  el.style.setProperty('--x', `${x}px`);
  el.style.setProperty('--y', `${y}px`);
}

/**
 * Show element (remove hidden)
 */
function show(el) {
  if (!el) return;
  el.classList.remove('hidden');
}

/**
 * Hide element
 */
function hide(el) {
  if (!el) return;
  el.classList.add('hidden');
}

/**
 * Toggle panel visibility
 */
function setActivePanel(panelId) {
  document.querySelectorAll('[data-panel]').forEach((p) => p.classList.remove('active'));
  const panel = document.querySelector(`[data-panel="${panelId}"]`);
  if (panel) panel.classList.add('active');

  document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
  const tab = document.querySelector(`[data-tab="${panelId}"]`);
  if (tab) tab.classList.add('active');
}

/**
 * Format date for display
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Mood icon map
 */
const MOOD_ICONS = {
  peaceful: '☼',
  grateful: '♥',
  neutral: '◎',
  struggling: '◐',
  tempted: '◔'
};

function getMoodIcon(mood) {
  return MOOD_ICONS[mood] || '◎';
}

/**
 * Trigger success animation
 */
function successAnimation(el) {
  if (!el) return;
  el.classList.add('success-animate');
  setTimeout(() => el.classList.remove('success-animate'), 350);
}

window.FortyUI = {
  ripple,
  show,
  hide,
  setActivePanel,
  formatDate,
  getMoodIcon,
  successAnimation,
  MOOD_ICONS
};
