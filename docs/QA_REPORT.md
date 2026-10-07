# QA report — Vite configuration, 2026-10-05

## Tested

- npm install in Birthday: succeeded, 15 installed packages, 0 reported vulnerabilities. Sole direct development dependency: Vite 8.3.2. Host Node 24.18.0.
- npm run dev: localhost:5173, strictPort, successful startup.
- npm run build: succeeded, main HTML plus four standalone HTML entry points and referenced original assets bundled.
- npm run preview: localhost:4175, successful startup.
- npm run check: 23 source files, zero missing paths, JS syntax passed. Dependency/build directories excluded from source scanning.
- npm run qa:media: 5 playback controller checks, 19 original/current-master asset hashes verified, 4 supplied 1920x1080 MP4 files verified with fast-start metadata.
- In-app browser desktop: all four chapters load on development and production origins. Opening artwork, both scrapbook portraits, Dream World poster/footage and six Sweet Moments media entries load.
- Slide 4: all three videos reach readyState 4 on both dev and production; production paths point to emitted hashed MP4 assets. Watch Now and card selection verified.
- Previous/Next slide buttons, keyboard arrows, pose toggle and standalone Slide 4 → main Slide 3 route verified. No application console errors observed.
- Production at 390x844: each of the four chapters has document dimensions within the viewport; no horizontal or vertical page overflow.

## Modified files / resolved problems

See CHANGELOG.md. Fixed missing npm manifest, invalid empty dependency lock, missing Slide 3 footage, production dynamic-URL assets, stale video data-src, bundled module-relative HTML routing and source checker traversing npm dependencies. Original design/layout modules retained.

## Scope and limits

No new Figma fidelity review or redesign was performed; approved images/personal media were preserved. The user's latest uploaded poster is retained. Testing used the in-app browser, not a full Safari/Firefox/device matrix. No critical issue was observed in the tested flows; untested combinations are not marked passed.

The root remains Birthday with existing slides/shared directories rather than creating Birthday-Final/src, following direct-run/minimal-change requirements. No archive was created or modified. Original unused reference assets remain preserved in source; Vite emits only referenced media. node_modules and dist are generated local folders excluded by .gitignore. Existing historical QA screenshots/reports remain untouched.

## Artwork revision
Build/path checks passed. Browser checked Slide 3 at 1912x907 and 390x844: supplied static PNG loaded, no video element, one Explore link, no page overflow. Explore navigates to Slide 4. Slide 1 framing and CTA reviewed at desktop/mobile; min-height/intrinsic-image sizing corrected so the CTA stays in the viewport. Original videos are retained but not used on Slide 3.

## Slide 3 animal layers
Build/check passed. In-app browser at 1912x907: original foreground preserved at contain size, no document overflow, four animal CSS transforms running, background animationName none and poster transform none. Pause stops all four; resume works; leaving Slide 3 sets animalsPlaying false. At 390x844 no page overflow. Console application errors: none. Reduced-motion CSS/code inspected; browser preference emulation was not performed. See SLIDE3_LAYERS.md for built-in generation prompts and assets.

Production preview also verified: repair PNG loads at naturalWidth1671, sprite resolves to bundled hashed PNG, animal animations run, Explore navigates to Slide 4; no application console errors.

## Slide 3 duplicate background fix
Build and source path check passed. Browser at 1912x907: visually verified no repeated edge artwork; backdrop is a gradient with no image URL, four animal animation states running, no document overflow and no console errors.

## Slide 3 full viewport and feet
Build and path check passed. Browser desktop 1912x907: stage covers viewport; no document overflow or console errors. Reviewed dinosaur crop and grounded motion. Pause stops all four animations and resume works. Portrait visual fidelity has not been validated for this revision; full-axis fill changes the artwork aspect ratio on nonmatching screens.

## Background update and QA audit — 2026-10-06

Changes:
- Slide 2 uses Master/Gambar 2.png, copied unchanged to assets/background/dusty-plum.png. Local palette: #2C2430 deep plum, #3A2B36 plum mauve, #F1E4D8 cream, #D87A98 pink, #8A7868 taupe. Original portrait artwork retained.
- Slide 4 uses Master/Gambar 1.png, copied unchanged to assets/background/bouquet-sky.png. Personal hero photos/videos, rail and text remain intact. Existing gradient retains text contrast.
- Shared transitions now respect Pause motion. Slide 4 video loading waits for an active visible chapter and resumes when it becomes visible; no hidden-chapter video download is started by the motion toggle.

Validation performed:
- npm run build: PASS; npm run check: PASS, 23 files, no missing references.
- npm run qa:media: PASS; 5 playback checks, 19 original asset checks; all four preserved HD MP4s are 1920x1080 with fast-start metadata.
- In-app browser desktop 1440x900: inspected both backgrounds, palette, loaded portraits; pose toggle works; opening CTA, Next/Previous and keyboard arrows navigate chapters 1–4.
- All 6 gallery items exercised. Good Company, Us Always and Silly Days reach readyState 4 and play locally; image selection clears video source. Pause/resume verified; offscreen video pauses; Pause stops all four dinosaur animations. Rail arrows remain enabled/disabled at appropriate endpoints.
- Mobile 390x844: all four chapters have no document overflow; opening/Dream World CTA, Watch Now and rail stay inside viewport. Rail Home/End works without changing chapter; drag scrolls 150px and does not activate a card.
- No application console errors observed. No persistent loading message or noticeable playback/navigation stall observed on localhost. Posters stay visible during video loading.

Limits: no throttled-network timing, real touch device, Safari/Firefox or reduced-motion browser emulation performed. Local observations cannot guarantee delay-free remote HD streaming. Existing Slide 3 full-axis image fill changes artwork proportions on portrait screens; this audit retained the previously requested full view. Generated dinosaur artwork has whole-body breathing, not articulated walking. Original personal/master assets are untouched; no ZIP or deployment.

Modified source: slides/slide2/slide2.css, slides/slide4/slide4.css, slides/slide4/slide4.js, shared/app.js. Added two background PNGs. build.cjs regenerated main/standalone HTML. Documentation updated in docs/CHANGELOG.md and docs/QA_REPORT.md.

## Slide 2 transparent hero replacement
Both supplied images are 1024x1536 ARGB PNGs with transparent corners; used directly without image editing/generation. Build and path check passed. In-app browser at 1440x900 and 390x844: both images load at naturalWidth1024, transparent container blends with background, toggle and portrait click switch pose; no page overflow or console errors. Existing hover handlers and 0.3s opacity transition retained. Physical touch/hover-device matrix was not repeated.

## Slide 2 scrapbook reference revision
Browser 1672x941 and 390x844: right-hand supplied scrapbook composition reviewed, no duplicated screenshot navigation/text in hero crop; pose button switches to retained transparent peace pose, no document overflow or console errors. Build/path checks passed. CSS clips reference artwork without modifying its pixels; screenshot cropping is not a fully reconstructed editable collage. Text/buttons/navigation remain real HTML.

## Target correction: Slide 2
Build and path check passed (23 files, no missing references). Browser 1672x941: Slide 2 scrapbook photo/background separate and notes visible; top navbar absent. Next navigation restores Slide 3 master PNG (naturalWidth1672) and four animated dinosaurs. PNG inputs remain high quality originals. Flat exported composition PNG not generated; the note is a separate HTML/CSS layer, not baked into the background.

## Slide 2 full view / romance
Build/path checks pass. Browser 1912x907 and 390x844 reviewed: full viewport stage, no page overflow or console errors; message and portrait visible without overlap. Full-axis background fill adapts collage aspect ratio, visibly stretching ornaments on portrait screens; portrait itself uses contain and remains undistorted. Text baked into supplied PNG remains original; new HTML note/message uses existing Birthday Note font.

## Slide 4 blended hero revision
Build and source check passed. Browser 1672x941: face and dessert visible, hero reaches right edge, bouquet remains on left, cover mode and media focal points verified. Watch Now reaches readyState4 and plays; no persistent loading status or console errors. Browser 390x844: viewport dimensions match slide, no document overflow. Rail remains below mobile hero. Original media retained; source/reference restore added missing matcha-dates-romance and us-always-romance MP4s. Other browser/device matrix not repeated.

### Slide 4 gradient and clean thumbnails — 2026-10-07
- PASS: npm run build; npm run check (23 files, no missing paths).
- PASS: browser at 1672x941 and 390x844, no document overflow; six cards, zero title/series elements.
- PASS: Watch Now selects Good Company; video readyState 4 and playing. No captured console errors.
- Visually inspected desktop gradient and clean thumbnail rail.
