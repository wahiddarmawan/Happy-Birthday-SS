import { chapterId as openingId } from '../slides/slide1/slide1.js';
import { initMotion, syncPlayback, isMotionPaused } from './motion.js';
import { initSlide as initPortrait } from '../slides/slide2/slide2.js';
import { initSlide as initDream } from '../slides/slide3/slide3.js';
import { initSlide as initMemories } from '../slides/slide4/slide4.js';

const chapters = [openingId, 'her-story', 'dream-world', 'sweet-moments'];
const mainUrl = new URL((import.meta.env?.BASE_URL || '/') + 'index.html', location.origin);
let current = -1;
let transition;
const sections = [...document.querySelectorAll('main > section[id]')];
function showChapter(focus = false) {
  const active = sections.find(section => `#${section.id}` === location.hash) || sections[0];
  const index = chapters.indexOf(active.id);
  transition?.cancel();
  if (active.id !== 'dream-world' && current >= 0 && index !== current && !isMotionPaused()) {
    transition = active.animate([{ transform: 'translateX(' + (index > current ? '100%' : '-100%') + ')' }, { transform: 'translateX(0)' }], { duration: 360, easing: 'cubic-bezier(.22,.61,.36,1)' });
  }
  current = index;
  document.querySelector('[data-slide-prev]').disabled = index === 0;
  document.querySelector('[data-slide-next]').disabled = index === chapters.length - 1;
  document.querySelector('[data-slide-position]').textContent = (index + 1) + ' / ' + chapters.length;
  sections.forEach(section => { section.hidden = section !== active; });
  document.querySelectorAll('.moments-menu').forEach(menu => { menu.open = false; });
  document.querySelectorAll('.chapter-nav a').forEach(link => {
    if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  if (focus) { active.setAttribute('tabindex', '-1'); active.focus({ preventScroll: true }); }
  document.querySelector('.skip-link').href = '#' + active.id;
  syncPlayback();
}
showChapter();
initMotion();
initPortrait();
initDream();
initMemories();
window.addEventListener('hashchange', () => showChapter(true));
document.addEventListener('click', event => {
  const link = event.target.closest('a[href]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const destination = new URL(link.href);
  const target = sections.find(section => `#${section.id}` === destination.hash);
  if (destination.origin !== location.origin || destination.pathname !== location.pathname || !target) return;
  event.preventDefault();
  if (location.hash !== destination.hash) location.hash = destination.hash;
  else showChapter(true);
});


function moveSlide(direction) {
  const id = chapters[current + direction];
  if (!id) return;
  if (sections.some(section => section.id === id)) location.hash = id;
  else location.href = mainUrl.href + '#' + id;
}
document.querySelector('[data-slide-prev]').addEventListener('click', () => moveSlide(-1));
document.querySelector('[data-slide-next]').addEventListener('click', () => moveSlide(1));
document.addEventListener('keydown', event => {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
  const direction = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
  if (direction) { event.preventDefault(); moveSlide(direction); }
});



// One audio player outside the chapters keeps the song continuous during navigation.
const soundtrack = new Audio(new URL('./audio/happy-birthday.mp3', import.meta.url).href);
soundtrack.loop = true;
soundtrack.controls = true;
soundtrack.preload = 'auto';
soundtrack.className = 'soundtrack';
soundtrack.setAttribute('aria-label', 'Birthday background music');
document.body.append(soundtrack);
function startSoundtrack(event) {
  if (event.target.closest('audio')) return;
  soundtrack.play().then(() => {
    document.removeEventListener('pointerdown', startSoundtrack);
    document.removeEventListener('keydown', startSoundtrack);
  }).catch(() => {}); // Retry on the next interaction if autoplay is blocked.
}
document.addEventListener('pointerdown', startSoundtrack);
document.addEventListener('keydown', startSoundtrack);
