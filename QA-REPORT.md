# QA — viewport and Sweet Moments update (2026-10-04)

Modified source: shared/app.js, shared/base.css, shared/motion.js, shared/fonts/NothingYouCouldDo.ttf + OFL.txt, slides/slide1/slide1.css, slides/slide2/slide2.css, slides/slide3/section.html + slide3.css, slides/slide4/section.html + slide4.css + slide4.js + media.js, serve.cjs, qa-media.cjs, README.md. Generated main and four standalone index.html files rebuilt. Restored missing Slide 3 MP4 from the original archive. Kept the user's newer Slide 3 master and PNG poster; SHA check now verifies that approved local master.

Resolved: cumulative page height, trailing motion-control scroll, oversized mobile layouts, fixed 800px Slide 4 minimum, artwork aspect mismatch, broken JPG poster path, missing Slide 3 video, serif Slide 4 heading, landscape thumbnail cards, duplicate card titles, search/filtered rail navigation, hidden-video playback, and expanded chapter menu persisting between slides.

Validation:
- build.cjs: pass; main + four independent pages generated.
- check.cjs: 21 files, zero missing asset paths; JavaScript syntax valid.
- qa-media.cjs: five playback checks; 19 supplied/current master assets verified; four original 1920x1080 videos with fast-start metadata, unchanged bytes.
- Browser viewport matrix: all four chapters at 1448x1086, 1366x768, 390x844, 320x568, 844x390. All 20 combinations: document scroll dimensions equal viewport dimensions, tested headings/artwork/CTAs/rail within viewport.
- Browser: pose toggle, chapter links, menu, Watch Now, video readyState 4/playback, hidden chapter pause, rail Next/End, search matching/empty/reset verified. No application console errors observed.
- Original artwork remains uncropped with a full-viewport blurred backdrop on Slides 1/3; Slide 4 uses original photos, so its cafe surroundings differ from the supplied mockup. Six available media entries are accurately counted.

Screenshot: qa/slide4-viewport-desktop.jpg.

## Revisi fokus Slide 4 dan navigasi horizontal
Modified: slides/slide4/section.html, slide4.css, slide4.js; shared/app.js, base.css; build.cjs and generated pages. Removed toolbar/search/avatar and stale search logic/styles. Changed rating to 1+, removed memory count, added romance sentence. Hero images and videos use contain for the full original frame. Added previous/next slide controls, 1/4 indicator and ArrowLeft/ArrowRight horizontal transitions (reduced-motion aware), with gallery keyboard priority and standalone routing.
Validation: build and path checks passed; original media/playback checks passed. Slide 4 at 1912x907, 390x844, 320x568, 844x390: no document overflow and copy/rail/controls inside viewport. Keyboard traversed 4→3→2→1 and 1→2→3→4; endpoint controls disabled. Watch Now readyState4/playing; gallery arrow changes media without changing chapter. Standalone Slide 4 previous control opens main Slide 3. Console errors: zero.
