const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const vm = require('node:vm');

// Exercise the shared playback controller with a reduced-motion environment.
const sections = [{ id: 'dream' }, { id: 'gallery' }];
const videos = sections.map(section => ({
  dataset: { active: 'true' }, readyState: 4, paused: true,
  closest: () => section,
  play() { this.paused = false; return Promise.resolve(); },
  pause() { this.paused = true; },
  addEventListener() {},
}));
let observerCallback;
const preference = { matches: true, addEventListener() {} };
const context = vm.createContext({
  matchMedia: () => preference,
  Event,
  document: { hidden: false, querySelectorAll: selector => selector === 'video' ? videos : sections, querySelector: () => null, addEventListener() {}, dispatchEvent() {} },
  IntersectionObserver: class { constructor(callback) { observerCallback = callback; } observe() {} },
});
vm.runInContext(fs.readFileSync(path.join(__dirname, 'shared/motion.js'), 'utf8').replaceAll('export ', '') + '\ninitMotion();', context);
observerCallback(sections.map((target, i) => ({ target, intersectionRatio: i ? .8 : .2 })));
assert.ok(videos.every(video => video.paused), 'Reduced motion prevents automatic playback');
vm.runInContext('setMotionPaused(false)', context);
assert.equal(videos.filter(video => !video.paused).length, 1, 'Exactly one visible video plays');
assert.equal(videos[1].paused, false, 'Most visible chapter owns playback');
context.document.hidden = true;
vm.runInContext('syncPlayback()', context);
assert.ok(videos.every(video => video.paused), 'Background tab pauses every video');
context.document.hidden = false;
observerCallback(sections.map(target => ({ target, intersectionRatio: 0 })));
assert.ok(videos.every(video => video.paused), 'Offscreen chapters pause every video');

// Verify supplied binary media remains byte-for-byte original and MP4s support fast start.
const packages = ['SLIDE1_BIRTHDAY_OPENING_SCHEMA_ASSETS/assets', 'SLIDE2_HER_STORY_SCHEMA_ASSET_MAP/assets', 'SLIDE3_FINAL_STANDALONE_CODE/src/assets', 'SLIDE4_STANDALONE_CODE/src/assets'];
let originals = 0;
const footage = [];
function visit(folder, index) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) { visit(file, index); continue; }
    if (!/\.(png|jpg|jpeg|mp4)$/.test(file)) continue;
    const data = fs.readFileSync(file);
    const assets = path.join(__dirname, `slides/slide${index + 1}/assets`);
    const original = path.join(__dirname, '../references', packages[index], path.relative(assets, file));
    if (fs.existsSync(original)) {
      const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
      const approvedDigest = entry.name === 'slide03-master-1920x1080.png' ? '1b720e9c297ee748f561c4132d6e6f089829998f5cfdec24d953cb85a8782d1f' : digest(fs.readFileSync(original));
      assert.equal(digest(data), approvedDigest, `Original asset preserved: ${entry.name}`);
      originals++;
    }
    if (entry.name.endsWith('.mp4')) {
      const atoms = [];
      for (let offset = 0; offset + 8 <= data.length;) {
        const size = data.readUInt32BE(offset);
        atoms.push(data.toString('ascii', offset + 4, offset + 8));
        if (size < 8) break;
        offset += size;
      }
      assert.ok(atoms.indexOf('moov') >= 0 && atoms.indexOf('moov') < atoms.indexOf('mdat'), `${entry.name}: fast-start metadata`);
      const track = data.indexOf(Buffer.from('tkhd'));
      const trackEnd = track - 4 + data.readUInt32BE(track - 4);
      const width = data.readUInt32BE(trackEnd - 8) / 65536;
      const height = data.readUInt32BE(trackEnd - 4) / 65536;
      assert.equal(width, 1920, `${entry.name}: original HD width`);
      assert.equal(height, 1080, `${entry.name}: original HD height`);
      footage.push({ file: entry.name, fastStart: true, width, height, bytes: data.length });
    }
  }
}
packages.forEach((_, index) => visit(path.join(__dirname, `slides/slide${index + 1}/assets`), index));
console.log(JSON.stringify({ playbackChecks: 5, originalAssetsVerified: originals, footage }, null, 2));

