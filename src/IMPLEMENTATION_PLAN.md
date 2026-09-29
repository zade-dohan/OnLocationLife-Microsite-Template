# Implementation Plan — Caprock → On Location Properties Theme

## 1. Audit summary

**Source (`Caprock/`, untouched):**
- `caprock.html` — single static HubL page: header/nav, hero, intro, video (Vimeo iframe), amenities grid (4 items), coming soon grid (3 items), community code of conduct accordion (5 items), housing split section (image carousel + 9-item feature list), dining split section (single image, reversed), final CTA/contact section (3 contact items), footer (brand + 3 link columns).
- `caprock.css` (~1330 lines) — already namespaced with a `ms-` prefix, uses CSS custom properties for brand tokens (`--gold`, `--evergreen`, `--black`, etc.) and 3 custom `@font-face` fonts (Empera, Gelica, Gotham).
- `fonts/` — `empera-regular.otf`, `Gelica-Regular.otf`, `Gotham Book.otf`.
- `images/` — 14 files (hero bg, emblem, logos, amenities bg, housing gallery x3, dining photo, CTA bg, footer/"managed by" logos).
- Inline `<script>` — mobile nav toggle, accordion, and an auto-advancing image carousel, all using `querySelectorAll`/`forEach` (already safe for multiple instances).

**Existing `src/` (before this work):** a placeholder scaffold (`templates/basic-template.html`, `css/basic-template.css`) unrelated to Caprock content — replaced.

**Key findings:**
- Anchor targets used by the nav (`#ms-intro`, `#ms-life-on-site`, `#ms-housing`, `#ms-contact`) map to the Intro, Amenities, Housing, and Final CTA sections respectively — preserved as a `section_id` field on those modules.
- Housing and Dining are the same visual "split" pattern (image + copy, optional reversed layout) — modeled as **one** reusable module (`split-content.module`) used twice with different field overrides, instead of two separate modules.
- No default HubSpot module covers the button/CTA UI in the source design (verified against the HubSpot/cms-theme-boilerplate reference repo — it also ships its own custom `button.module` rather than using `@hubspot/button`). CTAs are implemented as plain `<a class="ms-btn">` links.

## 2. Theme directory structure

```
src/
  theme.json            theme metadata + preview template
  fields.json            theme-level style settings (Brand/Typography/Buttons/Layout)
  css/theme.css           ported Caprock stylesheet (class names unchanged)
  js/theme.js             ported nav/accordion/carousel behavior
  fonts/                  Empera, Gelica, Gotham (copied from Caprock/fonts)
  images/                 all Caprock images (copied from Caprock/images)
  modules/
    header.module/        structural, placed directly in base.html (not draggable)
    footer.module/         structural, placed directly in base.html (not draggable)
    hero.module/           draggable, main_content
    intro.module/          draggable, main_content (anchor: ms-intro)
    video.module/          draggable, main_content
    amenities.module/      draggable, main_content (anchor: ms-life-on-site)
    coming-soon.module/    draggable, main_content
    accordion.module/      draggable, main_content (Community Code of Conduct)
    split-content.module/  draggable, main_content — reused for Housing (anchor: ms-housing) and Dining
    final-cta.module/      draggable, main_content (anchor: ms-contact)
  templates/
    base.html              shared layout: head, theme CSS-variable bridge, header/footer modules, JS
    home.html               extends base.html; dnd_area with all content modules pre-populated with placeholder copy
```

## 3. Module field summary

| Module | Key fields | Notes |
| - | - | - |
| `header` | `logo` (image), `logo_link`, `nav_links` (repeater: title, href) | Skip-link + sticky nav + mobile toggle markup baked in |
| `footer` | `logo`, `tagline`, `managed_by_label`, `managed_by_logo`, `columns` (repeater of heading + link repeater), `copyright_text` | 3 columns by default (Explore/Visit/Connect) |
| `hero` | `section_id`, `background_image`, `emblem_image`, `eyebrow`, `title`, `subtitle`, `intro`, `show_cta`, `cta_label`, `cta_link` | `show_cta` boolean hides the button cleanly |
| `intro` | `section_id`, `eyebrow`, `heading`, `lead` (richtext), `content` (richtext) | |
| `video` | `section_id`, `eyebrow`, `heading`, `video_embed_url`, `video_title` | Plain URL field (matches source iframe pattern) |
| `amenities` | `section_id`, `background_image`, `eyebrow`, `heading`, `intro`, `items` (repeater: icon choice, title, text) | Icon choice renders one of 4 inline SVGs from source (bed/dining/transport/shield) |
| `coming-soon` | `section_id`, `eyebrow`, `heading`, `items` (repeater: title, text) | Renders nothing if `items` is empty |
| `accordion` | `section_id`, `eyebrow`, `heading`, `intro`, `items` (repeater: title, content richtext) | Panel IDs namespaced with `module_id` to support multiple instances per page |
| `split-content` | `section_id`, `reverse` (bool), `media_type` (image/carousel), `image`, `gallery` (repeater), `eyebrow`, `heading`, `lead`, `feature_list` (repeater) | Reused for both Housing and Dining via per-instance `dnd_module` overrides in `home.html` |
| `final-cta` | `section_id`, `background_image`, `emblem_image`, `eyebrow`, `heading`, `subtext`, `cta_label`, `cta_link`, `contact_items` (repeater: title, value richtext, href, external) | |

## 4. Theme-level settings (`src/fields.json`)

Only field types HubSpot supports at theme level were used (`color`, `choice`, `number`, `boolean` — plain `text`/`image` fields are rejected by the CMS at theme scope):

- **Brand**: accent, secondary, dark/alt/light background colors, default text colors (defaults = exact Caprock hex values).
- **Typography**: heading/accent/body font *choice* (Empera/Gelica/Gotham plus generic fallbacks), base body size, line height.
- **Buttons**: primary bg/text, secondary (ghost) color, hover accent, corner radius.
- **Layout**: max content width, section spacing (desktop/mobile).

`templates/base.html` prints these as CSS custom properties (`--gold`, `--font-empera`, `--btn-primary-bg`, etc.) in a `<style>` block, which `theme.css`'s existing `var(--token)` usage already consumes — no CSS rewrite was needed beyond the button color tokens. Logos/brand imagery live on the header/footer **module** instances instead (since image fields aren't valid at theme level), which is also the correct multi-property pattern: each property's page gets its own header/footer module content.

## 5. Reuse across properties (Roman, etc.)

- Creating a new property page = create a page from the `Caprock Home` template, then edit module field values (copy, images, links) and theme settings (colors/fonts) — no code or template duplication required.
- `header`/`footer` are placed directly in `base.html` (not as a global partial), so editing one page's header doesn't affect another property's page.

## 6. Accessibility & responsive approach

- Skip-to-content link, semantic `<header>/<main>/<footer>`, single `<h1>` in the hero, heading order preserved per section.
- Existing focus-visible states, reduced-motion query, and `aria-*` attributes on the mobile toggle/accordion/carousel carried over unchanged.
- Responsive breakpoints (`64rem`, `48rem`, `40rem`, source's `63.9375rem` mobile cutoff) preserved verbatim in `theme.css`.

## 7. Assumptions & known limitations

- Field default image `src` values use theme-relative paths (e.g. `"../images/x.jpg"`); HubSpot resolves these to hosted URLs on upload — confirmed working via `hs cms upload`.
- Copyright year is a plain editable text field (not computed), matching the source's hardcoded "2026".
- The video section uses a raw embed URL field rather than a specific oEmbed/video field type, to match the source's direct Vimeo iframe.
- Not yet tested inside the live HubSpot page/content editor UI (drag-and-drop rearrangement, visual regression against the static site) — see `QA_CHECKLIST.md`.
