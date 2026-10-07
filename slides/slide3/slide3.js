import { isMotionPaused } from '../../shared/motion.js';
export function initSlide() {
  const root = document.querySelector('[data-slide3]');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = 'true';
  let visible = false;
  function syncAnimals() {
    root.dataset.animalsPlaying = String(visible && !root.hidden && !document.hidden && !isMotionPaused());
  }
  const observer = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    syncAnimals();
  }, { threshold: .1 });
  observer.observe(root);
  document.addEventListener('birthday:motionchange', syncAnimals);
  document.addEventListener('visibilitychange', syncAnimals);
  new MutationObserver(syncAnimals).observe(root, { attributes: true, attributeFilter: ['hidden'] });
  syncAnimals();
}
