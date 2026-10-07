import { memories } from './media.js';
import { syncPlayback, isMotionPaused, setMotionPaused } from '../../shared/motion.js';

export function initSlide() {
  const root = document.querySelector('[data-slide4]');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = 'true';
  const image = root.querySelector('[data-hero-image]');
  const video = root.querySelector('[data-hero-video]');
  const viewport = root.querySelector('[data-viewport]');
  const track = root.querySelector('[data-track]');
  const status = root.querySelector('[data-media-status]');
  const previous = root.querySelector('[data-prev]');
  const next = root.querySelector('[data-next]');
  const watch = root.querySelector('[data-watch]');
  let selected = 0;
  function step(direction) { select(selected + direction, true); }
  let request = 0;
  let drag;
  let dragged = false;
  function loadSelectedVideo() {
    const item = memories[selected];
    if (root.hidden || document.hidden || item.type !== 'video' || isMotionPaused()) return;
    if (video.getAttribute('src') === item.src) {
      if (video.readyState >= 2) { video.dataset.active = 'true'; video.classList.add('is-active'); syncPlayback(); }
      return;
    }
    status.textContent = `Loading ${item.title}…`;
    video.src = item.src;
    video.load();
  }
  const cards = memories.map((item, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'media-card';
    card.setAttribute('aria-label', `${item.type === 'video' ? 'Play' : 'Show'} ${item.title}`);
    const thumb = document.createElement('img');
    thumb.src = item.poster || item.src;
    thumb.alt = '';
    thumb.loading = 'lazy';
    thumb.decoding = 'async';
    thumb.draggable = false;
    card.append(thumb);
    if (item.type === 'video') {
      const play = document.createElement('span');
      play.className = 'media-card__play';
      play.textContent = '▶';
      play.setAttribute('aria-hidden', 'true');
      card.append(play);
    }
    card.addEventListener('click', () => select(index, true));
    return card;
  });
  track.replaceChildren(...cards);

  async function select(index, reveal = false) {
    if (!Number.isInteger(index)) return;
    selected = Math.max(0, Math.min(memories.length - 1, index));
    const item = memories[selected];
    const ticket = ++request;
    video.pause();
    video.dataset.active = 'false';
    video.classList.remove('is-active');
    status.textContent = '';
    cards.forEach((card, i) => {
      card.classList.toggle('is-active', i === selected);
      card.setAttribute('aria-pressed', String(i === selected));
    });
    previous.disabled = selected === 0;
    next.disabled = selected === memories.length - 1;
    if (reveal) viewport.scrollTo({ left: cards[selected].offsetLeft - (viewport.clientWidth - cards[selected].clientWidth) / 2, behavior: isMotionPaused() ? 'auto' : 'smooth' });
    const poster = new Image();
    poster.src = item.poster || item.src;
    try { await poster.decode(); } catch {
      if (ticket === request) status.textContent = 'This memory could not load. Please select another.';
      return;
    }
    if (ticket !== request) return;
    image.src = poster.src;
    image.alt = item.title;
    image.style.objectPosition = item.position || 'center';
    image.classList.add('is-active');
    if (item.type === 'video') {
      video.poster = item.poster;
      video.style.objectPosition = item.position || 'center';
      video.setAttribute('aria-label', item.title);
      loadSelectedVideo();
    } else {
      video.removeAttribute('src');
      video.load();
    }
    syncPlayback();
  }
  video.addEventListener('loadeddata', () => {
    const item = memories[selected];
    if (item.type !== 'video' || video.currentSrc !== item.src) return;
    video.dataset.active = 'true';
    video.classList.add('is-active');
    status.textContent = '';
    syncPlayback();
  });
  video.addEventListener('error', () => {
    if (memories[selected].type !== 'video') return;
    video.dataset.active = 'false';
    video.classList.remove('is-active');
    status.textContent = 'Video unavailable. The original poster is shown.';
  });
  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  root.querySelector('[data-watch]').addEventListener('click', () => {
    const index = memories.findIndex((item, i) => i >= selected && item.type === 'video');
    setMotionPaused(false);
    select(index < 0 ? memories.findIndex((item, i) => item.type === 'video') : index, true);
  });
  viewport.addEventListener('keydown', event => {
    const direction = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (direction) { event.preventDefault(); step(direction); }
    if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); select(event.key === 'Home' ? 0 : memories.length - 1, true); }
  });
  viewport.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, left: viewport.scrollLeft };
    dragged = false;
  });
  viewport.addEventListener('pointermove', event => {
    if (!drag) return;
    if (Math.abs(event.clientX - drag.x) > 8 && !dragged) {
      dragged = true;
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add('is-dragging');
    }
    if (dragged) viewport.scrollLeft = drag.left - (event.clientX - drag.x);
  });
  function endDrag() { drag = undefined; viewport.classList.remove('is-dragging'); }
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('lostpointercapture', endDrag);
  viewport.addEventListener('pointerleave', () => { if (!dragged) endDrag(); });
  viewport.addEventListener('click', event => {
    if (dragged) { event.preventDefault(); event.stopPropagation(); dragged = false; }
  }, true);
  viewport.addEventListener('dragstart', event => event.preventDefault());
  document.addEventListener('birthday:motionchange', loadSelectedVideo);
  new MutationObserver(loadSelectedVideo).observe(root, { attributes: true, attributeFilter: ['hidden'] });
  document.addEventListener('visibilitychange', loadSelectedVideo);
  select(0);
}




