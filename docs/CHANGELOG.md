# Changelog — 2026-10-05

Added root package.json (Vite as the sole direct development dependency), vite.config.js, .gitignore and documentation. Updated package-lock.json with a real reproducible dependency lock.

Vite serves localhost:5173, builds five HTML entry points, regenerates existing slide templates, and reloads template edits. Build output includes referenced media only and preserves source files. node_modules/dist are excluded from source version control.

Fixed production media resolution in slides/slide4/media.js and slides/slide3/slide3.js using static URL literals. Removed the stale data-src HTML path. Fixed standalone chapter routing in shared/app.js to use the configured root URL rather than a bundled module location. check.cjs skips node_modules/dist and handles the Vite configuration's Node imports. Restored missing Slide 3 footage from the original reference archive.

No images, footage, or existing directories were deleted. Existing generated index.html pages were regenerated using their original build.cjs templates. No ZIP was created or updated.

Added slides/slide1/slide1.js for its opening chapter ID, imported by shared navigation. All four slides now have an independent HTML template, CSS and JavaScript module.

2026-10-05 artwork revision: Slide 1 uses viewport-sized minimal cover framing on desktop and uncropped contain on mobile portrait. Slide 3 uses the new supplied image as a static composition; original media preserved. Removed Slide 3 video playback and entry animation. Matched the real opaque Explore button to its printed artwork footprint to resolve the double shape.

2026-10-05 animal animation revision: added two sibling layered PNG assets; added grass repair mask and four dinosaur spans in Slide 3 template. Updated slide3.css for stationary full-viewport edge fill and subtle individual animal movement; updated slide3.js to synchronize visibility, pause and reduced-motion state. No personal photograph or original asset was overwritten.

2026-10-05 duplicate background fix: replaced Slide 3 full-image backdrop with a stationary sky/grass color gradient. Removed repeated stars and mushrooms at viewport edges while retaining the uncropped foreground and independent dinosaur animations.

2026-10-05 Slide 3 viewport/feet fix: stage and poster fill both viewport axes without cropping or extra backdrop. The composition adapts its aspect ratio to the screen. Expanded stegosaurus repair region, corrected sprite crop and replaced drifting/rotation with subtle bottom-anchored breathing, keeping body and feet together.

2026-10-06 background/QA revision: added original bouquet-sky and dusty-plum PNG backgrounds, applied scoped Slide 2 palette from Gambar 3. Fixed shared Pause handling for chapter transitions and hidden-chapter Slide 4 media loading. Verified build/path/media checks, desktop/mobile navigation, all gallery items, video pause/resume and drag rail. See QA_REPORT.md for tests and limits.

2026-10-06 Slide 2 hero: copied both user-supplied transparent PNGs unchanged as hero-rest-transparent.png and hero-peace-transparent.png; updated section.html references/alt text; removed opaque portrait container background and rounded frame. Dusty Plum background and pose effects retained. No image generation or personal-photo edits.

2026-10-06 Slide 2 reference composition: added unchanged supplied screenshot as story-approved-reference.png, displayed its right-hand scrapbook crop through CSS. Enlarged hero, cream/peach heading, spacing, buttons and scoped brand/navigation. Existing transparent peace pose and hover/tap behavior retained. No raster generation or face edits.

2026-10-07 corrected target: scrapbook composition belongs to Slide 2. Restored Slide 3 Dream World HTML, CSS and dinosaur visibility/pause controller. Slide 2 now uses supplied collage background and one separate unchanged transparent rest portrait; removed top navbar, brand and headline, retained left negative space; I love you so is a handwritten HTML note overlay. Original PNGs retained without modification.

2026-10-07 Slide 2 full viewport: removed contain-stage side bands; background fills both axes, portrait keeps native proportions. Added corrected romance text with cream serif headline and existing handwritten font, responsive message placement. No new assets or dependencies.

2026-10-07 Slide 4 framing: right-edge cover hero (56% desktop), per-media focal points, feathered left media edge and separate dark-to-clear hero gradient. Bouquet and copy gradient retained. Rail constrained to lower-left 59% desktop, full width mobile. Mobile videos use a wider, shorter area to reduce face cropping. Restored two missing referenced MP4s from original reference assets. CTA/text/navigation retained.

### Slide 4 gradient and clean thumbnails — 2026-10-07
- Lightened the central bouquet gradient while retaining dark left and bottom areas, and softened the hero media transition.
- Removed thumbnail title/series elements and their CSS; accessible memory names and playback controls remain.
