# On Location Properties Theme

A reusable HubSpot CMS theme derived from the static Caprock site (`../Caprock`), rebuilt as drag-and-drop-editable modules so the same code can power Caprock, Roman, and future On Location properties without duplicating templates.

## Folder structure

```
src/
  theme.json          theme metadata
  fields.json         theme-level settings (Brand / Typography / Buttons / Layout)
  css/theme.css        stylesheet (ported from Caprock, class names unchanged)
  js/theme.js          nav toggle, accordion, and carousel behavior
  fonts/, images/      brand assets
  modules/             one folder per reusable section (see IMPLEMENTATION_PLAN.md)
  templates/
    base.html           shared head/header/footer layout
    caprock-home.html    the page template (extends base.html)
```

## Uploading / developing locally

This account is already connected via `hs.cmd init`. From the repo root:

```powershell
# one-time or after any change
hs.cmd cms upload src onlocationlife-microsite

# continuous sync while developing
hs.cmd cms watch src onlocationlife-microsite
```

`onlocationlife-microsite` is the folder name in the HubSpot Design Manager — rename it if you want a different destination (e.g. per-environment).

## Creating a page from the template

1. In HubSpot: **Marketing → Website → Website Pages → Create**.
2. Choose the **Caprock Home** template (label set in `caprock-home.html`).
3. The page starts fully populated with the Caprock copy/images/layout — edit any module in place.

## Changing branding (per property)

Go to the page's **Settings → Design** (theme settings) to change:
- Brand colors (accent, secondary, backgrounds, text)
- Typography (heading/accent/body font choice, base size, line height)
- Button colors and corner radius
- Max content width and section spacing

These become CSS custom properties (`--gold`, `--font-empera`, `--btn-primary-bg`, etc.) consumed by every module automatically — no code changes needed.

## Changing content and images

Every section is a module in the page's drag-and-drop area — click it in the content editor to edit its fields (text, images, repeaters like nav links, amenities, footer columns, etc.). Modules can be reordered, duplicated, or removed; removing a module removes only that section.

## Creating another property site (e.g. Roman)

1. Create a new page from the **Caprock Home** template.
2. Update the header/footer modules (logo, nav links, tagline) and every content module's copy/images for the new property.
3. Adjust theme settings (or use a separate theme settings group / domain, if Roman should have its own color scheme independent of Caprock) — theme settings currently apply account-wide, so if Roman needs different defaults, consider adjusting field values per-page rather than at the theme level, since HubSpot theme settings are shared across all pages using this theme in one account.

No new modules or templates need to be created for a new property — only content.

## Anchor links

The primary nav (`header` module) and footer links point to `#cap-intro`, `#cap-life-on-site`, `#cap-housing`, and `#cap-contact`. Those IDs are set via each module's `section_id` field:
- Intro → `cap-intro`
- Amenities ("Life on Site") → `cap-life-on-site`
- Housing (split-content) → `cap-housing`
- Final CTA → `cap-contact`

**If you reorder or remove these modules, the anchors still work as long as the `section_id` field values are unchanged.** If you delete one of these modules, update or remove the corresponding nav/footer link.

## Global vs. page-specific settings

- **Global (theme settings):** brand colors, fonts, button styling, layout spacing — shared across every page using this theme in the account.
- **Page-specific (module fields):** all text, images, links, and repeaters — set per page/module instance, safe to differ between Caprock, Roman, etc.
- Header and footer are placed directly in `base.html` as regular (non-global-partial) modules, so editing one page's header/footer does not affect any other page.

## Known limitations

- Theme settings (colors/fonts) are account-wide, not per-page — if two properties need entirely different palettes live in the same HubSpot account at the same time, duplicate the theme folder for the second property, or drive the differing values from module-level fields instead.
- Not yet visually verified inside the live HubSpot page editor (only validated via `hs cms upload`, which checks JSON/HubL correctness, not rendered pixels). See `QA_CHECKLIST.md`.
- The video section renders a raw iframe embed URL (matches the source Vimeo embed) rather than a native HubSpot video field.
