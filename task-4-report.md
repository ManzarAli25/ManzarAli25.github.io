# Task 4 Report

Implemented the CSS-only top-right project-card interaction from the approved Project Corner Wojaks spec.

- Added an expanding top-right bracket and absolutely positioned, layered project art that is hidden at rest on hover-capable devices.
- Reveals the art for both `:hover` and `:focus-within`, with restrained project-number, title, and CTA transforms plus a left-to-right CTA underline.
- Keeps content and CTAs above the decorative art, disables pointer events on decorative layers, and retains the existing high-contrast `:focus-visible` outline.
- Shows a low-opacity static crop on non-hover devices and removes project positional transforms and transitions for reduced motion.
- Removed every `.expression-reveal` rule while preserving the hero/about styles, scroll reveal behavior, and primary navigation.
- Added the Task 4 interaction contract assertions. The no-animation assertion uses whole-word matching so the forbidden term `elastic` does not falsely match existing `Elasticsearch` copy.

TDD evidence:

- RED: `node --test tests/portfolio.test.mjs` failed on the missing `.project:hover .project-corner-art` selector before the CSS change.
- GREEN: the same command passed after the interaction CSS was implemented.

Verification:

- `node --test tests/portfolio.test.mjs` — 1 test passed, 0 failed.
- `powershell -NoProfile -ExecutionPolicy Bypass -File tests/check-transparent-backgrounds.ps1` — passed for 6 supporting assets and 7 project assets.
- Extracted inline JavaScript with the brief's PowerShell procedure and ran `node --check` — passed.
- `rg -n "expression-reveal" index.html` — no matches.
- Source inspection confirmed seven layered `.project-corner-art` elements, the unchanged primary navigation, and the existing high-contrast focus rule.
- `git diff --check` — passed; Git emitted only its Windows LF-to-CRLF working-copy notices.

Task 5 Chrome/rendered verification was intentionally not performed.

## Review round 1: reduced-motion geometry

Review found that the reduced-motion rule removed transitions and text/CTA transforms but still allowed the normal hover/focus cascade to expand the corner bracket and draw the CTA underline instantly. That made the state change immediate, but not opacity-only.

A focused contract was added first and failed on the missing reduced-motion bracket reset. The media rule now keeps the bracket at `3rem × 3rem`, keeps the CTA underline at `right:100%`, and explicitly pins art, project-number, title, and CTA transforms to `none`. The art opacity reveal remains active; normal hover/focus and touch rules were not changed.
