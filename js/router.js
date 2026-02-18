/**
 * Forty — SPA Router
 * Hash-based internal routing
 */

function initRouter(handlers) {
  function handleHash() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    const [view, panel] = hash.split('/');
    handlers.onRoute && handlers.onRoute(view, panel);
  }

  window.addEventListener('hashchange', handleHash);
  handleHash();
}

/**
 * Navigate to a route
 */
function navigate(view, panel) {
  const hash = panel ? `#${view}/${panel}` : `#${view}`;
  window.location.hash = hash;
}

window.FortyRouter = { initRouter, navigate };
