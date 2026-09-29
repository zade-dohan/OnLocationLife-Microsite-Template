# Migration Summary — Caprock → On Location Properties Theme

## Files created

**Theme root**
- `src/theme.json`, `src/fields.json`
- `src/IMPLEMENTATION_PLAN.md`, `src/README.md`, `src/QA_CHECKLIST.md`, `src/MIGRATION_SUMMARY.md` (this file)

**Templates**
- `src/templates/base.html` — shared layout (head, theme CSS-variable bridge, header/footer module includes, JS)
- `src/templates/home.html` — page template, extends `base.html`, drag-and-drop `main_content` area

**Modules** (each with `fields.json`, `meta.json`, `module.html`)
- `src/modules/header.module`
- `src/modules/footer.module`
- `src/modules/hero.module`
- `src/modules/intro.module`
- `src/modules/video.module`
- `src/modules/amenities.module`
- `src/modules/coming-soon.module`
- `src/modules/accordion.module`
- `src/modules/split-content.module` (reused for both Housing and Dining)
- `src/modules/final-cta.module`

**Assets**
- `src/css/theme.css` (ported from `Caprock/caprock.css`)
- `src/js/theme.js` (ported from the inline `<script>` in `Caprock/caprock.html`)
- `src/fonts/*` — copied from `Caprock/fonts/`
- `src/images/*` — copied from `Caprock/images/`

## Files removed

- `src/templates/basic-template.html`, `src/css/basic-template.css` — placeholder scaffold from before this task, superseded by the Caprock-derived theme.

## Files changed

- None outside `src/`. **`Caprock/` was not modified.**

## Assets migrated

All 14 images and 3 font files from `Caprock/images/` and `Caprock/fonts/` were copied verbatim into `src/images/` and `src/fonts/` (byte-for-byte copy, no re-encoding/re-compression).

## Modules created — field counts

| Module | Fields (top-level) | Repeaters |
| - | - | - |
| header | 3 | nav_links |
| footer | 6 | columns → links |
| hero | 10 | — |
| intro | 5 | — |
| video | 4 | — |
| amenities | 6 | items (icon/title/text) |
| coming-soon | 4 | items (title/text) |
| accordion | 5 | items (title/content) |
| split-content | 9 | gallery, feature_list |
| final-cta | 8 | contact_items |

## Theme fields created

`src/fields.json` — 4 groups (Brand, Typography, Buttons, Layout), 18 total settings, all using theme-safe field types (`color`, `choice`, `number`, `boolean`). Defaults match the exact Caprock design values (hex colors, font names, spacing).

## Known limitations

- Theme settings are account-wide; if two properties need simultaneously different color/font defaults, either duplicate the theme or drive those differences from module-level fields instead (see README).
- Not visually verified in the live HubSpot page editor — only `hs cms upload` JSON/HubL validation has been run (see QA_CHECKLIST.md for the outstanding manual checks).
- The video module uses a plain embed-URL text field rather than a dedicated video field type, matching the source's direct iframe embed.
- Copyright year in the footer is a static editable text field, not computed dynamically (matches source behavior).

## What could not be validated locally

- Rendered visual parity (desktop/tablet/mobile) against the static Caprock site — requires opening the uploaded template in an actual HubSpot page/content editor or preview, which wasn't available in this environment.
- Cross-browser/iOS Safari behavior of the `background-attachment: fixed` parallax sections.
- Whether `get_asset_url`-based relative image paths in module field defaults (e.g. `"../images/x.jpg"`) resolve to correct hosted URLs at runtime — the upload itself succeeded, which implies HubSpot accepted the paths, but the rendered `<img src>` output wasn't inspected post-upload.

## Validation performed

- Iteratively uploaded the theme via `hs.cmd cms upload src onlocationlife-microsite` against the connected dev-only HubSpot account (Caprock [standard], id 49612384) — the same destination folder created earlier in this session, not a guessed production path.
- Fixed, in order, four real validation failures surfaced by that upload:
  1. Invalid module `meta.json` categories (must be an uppercase enum value).
  2. Invalid field type `"textarea"` (not a supported HubSpot field type — replaced with `"text"` + `allow_new_line`).
  3. Reserved field names `label` and `body` used as module field `name` values (renamed to `title`/`content`).
  4. Theme-level `fields.json` rejecting `text`/`image` field types (only `color`/`choice`/`number`/`boolean` are valid at theme scope — moved logo fields to the header/footer modules).
- Final upload completed with no errors.
