# QA Checklist — On Location Properties Theme

## HubSpot validation (automated, completed)
- [x] `hs cms upload src onlocationlife-microsite` completes with no errors (fixed: invalid module categories, `textarea` field type, reserved field names `label`/`body`, theme-level `text`/`image` fields).
- [ ] Open the theme in the Design Manager and confirm no red warning icons on any module/template.
- [ ] Run any available marketplace/module validation (`hs cms module marketplace-validate`) if the theme will ever be distributed.

## Desktop checks (manual, in the page editor / preview)
- [ ] Header: logo displays, nav links scroll to the correct anchors, sticky-on-scroll behavior works.
- [ ] Hero: background image, emblem, eyebrow/title/subtitle/intro copy, and CTA button render and link correctly.
- [ ] Intro, Video, Amenities (4 icons), Coming Soon (3 items), Accordion (5 items expand/collapse) all match the source layout.
- [ ] Housing: carousel arrows/dots work, auto-advances, 9-item feature list displays in 2 columns.
- [ ] Dining: single image, reversed layout (image right, text left).
- [ ] Final CTA: background image, 3 contact items with correct links (mailto, maps, careers).
- [ ] Footer: logo, tagline, "Managed by" logo, 3 link columns, copyright line.
- [ ] All theme-setting colors/fonts propagate (change one in Design Manager theme settings and confirm it updates on the page).

## Tablet checks (~768–1024px)
- [ ] Nav collapses to the mobile toggle at the same breakpoint as the source (`64rem`/1024px).
- [ ] Housing/Dining split sections stack to single column below `64rem`.
- [ ] Amenities grid drops from 2 to 1 column below `40rem`; confirm no premature wrapping at tablet width.
- [ ] Coming Soon grid: 3 → 2 → 1 columns at the right breakpoints.

## Mobile checks (<600px)
- [ ] Mobile nav overlay opens/closes via the hamburger button and Escape key; body scroll locks while open.
- [ ] Hero text and CTA button remain legible with no overflow.
- [ ] Carousel remains swipe/tap operable (prev/next buttons, dot indicators) at narrow widths.
- [ ] No horizontal scroll/overflow on any section.
- [ ] Touch targets (nav toggle, accordion triggers, carousel controls) are large enough to tap comfortably.

## Accessibility checks
- [ ] Skip-to-content link is the first focusable element and jumps to `#main`.
- [ ] Heading order is logical (single `<h1>` in hero, `<h2>`s per section, no skipped levels).
- [ ] All interactive controls (nav toggle, accordion triggers, carousel buttons) are keyboard-operable with visible focus states.
- [ ] Decorative images (`aria-hidden="true"`, empty `alt=""`) vs. informative images (editable alt text) are correctly distinguished.
- [ ] `prefers-reduced-motion: reduce` disables/shortens animations.
- [ ] Color contrast checked against the actual theme-setting defaults (not just assumed from the source).

## Content-editor checks
- [ ] Every module can be added, removed, and reordered in the `main_content` drag-and-drop area without breaking layout.
- [ ] Optional/empty repeaters (Coming Soon items, footer columns, feature list) collapse cleanly with no empty containers or stray borders.
- [ ] Repeater "sorting label" fields (module list previews) show meaningful text, not blank rows.
- [ ] Hiding the hero CTA (`show_cta = false`) removes the button without layout gaps.

## New-property cloning checks (e.g. Roman)
- [ ] Create a second page from the `Home` template and confirm it starts with the theme's default placeholder content (expected — override per property).
- [ ] Change header/footer logo, nav links, and every module's copy/images for the new property; confirm no residual Caprock-only hardcoded values remain.
- [ ] Confirm changing theme settings (colors/fonts) does not unexpectedly affect the Caprock page if Roman needs different values (see README's "Known limitations" on account-wide theme settings).

## Remaining manual HubSpot checks
- [ ] Verify `get_asset_url`-resolved image/font paths actually resolve to hosted CDN URLs after upload (spot check a few `<img src>`/`@font-face` URLs in the rendered HTML).
- [ ] Confirm the "Home" template appears in the template picker and its screenshot/preview loads.
- [ ] Confirm SEO fields (`page_meta.html_title`, `meta_description`) are editable per page and populate the `<title>`/meta description/OG tags.
- [ ] Cross-browser check (Safari/iOS in particular, for the `background-attachment: fixed` parallax sections, which iOS Safari handles differently).
