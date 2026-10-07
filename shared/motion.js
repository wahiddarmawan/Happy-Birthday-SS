const preference = matchMedia('(prefers-reduced-motion: reduce)');
let paused = preference.matches;
let initialized = false;
let button;
let videos = [];
const visibility = new Map();

export function isMotionPaused() { return paused; }
export function setMotionPaused(value) {
  paused = value;
  syncPlayback();
  document.dispatchEvent(new Event('birthday:motionchange'));
}
export function syncPlayback() {
  const candidates = videos.filter(video => video.dataset.active === 'true' && !video.closest('main > section').hidden && video.readyState >= 2 && (visibility.get(video.closest('main > section')) || 0) > .1);
  const chosen = candidates.sort((a, b) => visibility.get(b.closest('main > section')) - visibility.get(a.closest('main > section')))[0];
  videos.forEach(video => {
    if (video === chosen && !paused && !document.hidden) {
      if (video.paused) video.play().catch(() => {});
    } else video.pause();
  });
  if (button) {
    button.textContent = paused ? 'Play motion' : 'Pause motion';
    button.setAttribute('aria-pressed', String(paused));
  }
}
export function initMotion() {
  if (initialized) return;
  initialized = true;
  videos = [...document.querySelectorAll('video')];
  button = document.querySelector('[data-motion]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => visibility.set(entry.target, entry.intersectionRatio));
    syncPlayback();
  }, { threshold: [0, .1, .25, .5, .75, 1] });
  document.querySelectorAll('main > section').forEach(section => observer.observe(section));
  videos.forEach(video => video.addEventListener('loadeddata', syncPlayback));
  button?.addEventListener('click', () => setMotionPaused(!paused));
  preference.addEventListener('change', event => setMotionPaused(event.matches));
  document.addEventListener('visibilitychange', syncPlayback);
  syncPlayback();
}

