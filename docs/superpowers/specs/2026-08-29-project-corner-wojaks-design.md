# Project Corner Wojaks Redesign

## Objective

Redesign the portfolio project section so each project has accurate human-written context, a working destination, and a custom monochrome Wojak illustration that appears as a restrained interaction reward. The site must remain professionally scannable when idle.

## Project Set

The section contains seven projects in this order:

1. LegalEase
2. Watch
3. Elenchus
4. LalaScore
5. TRNSIT Kolachi
6. AgentRed
7. DialogSum

CyberProof is removed and replaced by Elenchus. Skinly Cure is removed and replaced by Watch. LalaScore is added. DialogSum remains as the research project.

## Destinations and Click Behavior

| Project | Destination | Action |
| --- | --- | --- |
| LegalEase | No public destination; domain expired and repository is private | `Read private case study` opens an accessible internal dialog |
| Watch | `https://github.com/ManzarAli25/watch-it` | `View project ↗` opens a new tab |
| Elenchus | `https://github.com/ManzarAli25/elenchus` | `View project ↗` opens a new tab |
| LalaScore | `https://lalascore.lol/` | `View project ↗` opens a new tab |
| TRNSIT Kolachi | `https://github.com/ManzarAli25/TRNSIT-KOLACHI` | `View project ↗` opens a new tab |
| AgentRed | `https://github.com/ManzarAli25/AgentRed` | `View project ↗` opens a new tab |
| DialogSum | No new URL supplied | `Read project notes` opens an accessible internal dialog |

External links use `target="_blank"` and `rel="noreferrer"`. Cards themselves are not nested links; the explicit CTA is the activation target. This preserves selection, keyboard behavior, and clear intent.

## Project Copy

Descriptions use a problem-first structure: real-world problem, what Manzar built, then the meaningful technical or product distinction.

### LegalEase

Legal information in Pakistan is fragmented, inaccessible, and expensive for non-lawyers. Manzar built an AI-first advisory platform grounded in Pakistani law that answers law-specific questions and escalates complex cases to real lawyers. It was developed with input from Kazi Associates, reached Stage 3 at FICS (NUST), and was presented at ICISCT '25.

### Watch

Coding agents can reason over text and images but are effectively blind to screen recordings. Watch is an MCP server that turns local or hosted videos into compact, structured event timelines, with scene-aware sampling, on-demand frame inspection, caching, and per-call cost reporting.

### Elenchus

Complex agent investigations often collapse framing, evidence gathering, and judgment into one confident pass. Elenchus separates those epistemic jobs: it challenges the initial framing, dispatches independent evidence lanes, and adjudicates what the findings establish, contradict, retract, or leave unresolved.

### LalaScore

Workplace dysfunction is usually experienced privately and marketed away publicly. LalaScore investigates companies through public signals and anonymous community evidence, producing a sourced “corporate bullshit index” around micromanagement, unpaid overtime, attendance obsession, and related patterns while preserving due-process language.

### TRNSIT Kolachi

Navigating Karachi public transport is opaque, fragmented, and difficult to use while moving. TRNSIT Kolachi reduces the trip to search, comparable route options, and a step-by-step journey timeline with large tap targets and service-specific visual cues.

### AgentRed

Online discourse is polarized but difficult to analyze at scale. AgentRed retrieves opposing Reddit positions, extracts the debate axis and arguments, runs support and counter agents across multiple rounds, then uses a judge chain to crown the stronger “Chad” argument and weaker “Virgin” argument.

### DialogSum

Dialogue summarization systems trade accuracy for efficiency without a single obvious tuning strategy. This project compares full FLAN-T5 fine-tuning, LoRA, and prompt tuning against ROUGE metrics and human baselines to make those trade-offs concrete.

## Illustration System

Generate seven separate PNG assets using the built-in ImageGen tool, one call per project. Each is a genuinely transparent monochrome raster illustration designed specifically for the top-right corner of its card.

Shared invariants:

- Pure black, white, and grayscale.
- Transparent RGBA background; no checkerboard baked into pixels.
- Bold hand-inked Wojak linework consistent with the portfolio character system.
- Composition enters diagonally from the bottom-left of the asset toward its top-right edge so it appears to emerge through the card corner.
- No logos, readable product names, watermarks, colored pixels, full rectangular backgrounds, or unrelated props.
- Keep the important silhouette legible at approximately 220 CSS pixels wide.
- Validate actual alpha after generation; if the generator bakes a checkerboard, run the existing edge-connected background-removal script and revalidate.

Project concepts:

- **LegalEase:** anxious client Wojak facing a calm lawyer Wojak holding a legal document, with small balanced scales.
- **Watch:** observer Wojak with several stylized eyes studying a filmstrip that becomes a structured event timeline.
- **Elenchus:** skeptical philosopher-detective Wojak comparing two contradictory evidence sheets with a magnifying glass.
- **LalaScore:** corporate-manager Wojak peeking over a clipboard surrounded by subtle overtime, attendance, and “family” office motifs without text.
- **TRNSIT Kolachi:** confused commuter Wojak holding a chaotic route map while a clear bus-stop path resolves beside him.
- **AgentRed:** face-off composition between a confident Chad and nervous Virgin Wojak, separated by opposing speech bubbles and a judge marker.
- **DialogSum:** overwhelmed Wojak surrounded by many speech bubbles, compressing them into one clean note.

Final filenames:

- `assets/projects/legalease-corner.png`
- `assets/projects/watch-corner.png`
- `assets/projects/elenchus-corner.png`
- `assets/projects/lalascore-corner.png`
- `assets/projects/trnsit-corner.png`
- `assets/projects/agentred-corner.png`
- `assets/projects/dialogsum-corner.png`

## Card Layout and Interaction

Cards remain a monochrome editorial grid. Each card contains a project number/category, title, problem-first description, technology tags, and explicit CTA.

The top-right corner contains a two-line bracket drawn in CSS. At rest, the custom art is fully hidden and the bracket matches the ordinary border. On hover or keyboard focus within the card:

1. The horizontal and vertical bracket segments extend inward by a small amount.
2. The custom illustration moves approximately 16 pixels into view and fades to a restrained opacity.
3. The project number shifts left to make visual space.
4. The title moves horizontally by no more than 6 pixels.
5. The CTA underline draws from left to right and the arrow moves by no more than 4 pixels.

No bounce, elastic easing, cursor replacement, parallax, rotation loop, or continuous animation is used.

For touch devices without hover, the illustration is shown as a low-opacity static crop so the artwork remains discoverable. For `prefers-reduced-motion: reduce`, state changes are immediate and use opacity only.

## Dialog Behavior

LegalEase and DialogSum use the existing native `dialog` pattern. The dialog contains the longer project description, technical stack, status, and an explicit close control. It does not display a fake live-demo link.

Opening a dialog moves focus into it through native `showModal()`. Escape closes it. Clicking the backdrop closes it. Closing returns focus to the activating CTA through native dialog behavior and stored-trigger focus restoration if required by browser behavior.

## Accessibility

- Hover visuals must also trigger with `:focus-within`.
- Decorative project art uses empty `alt` text.
- All public destinations are real anchors with descriptive accessible names.
- Visual state is not the only indication of clickability.
- Focus outlines remain high contrast.
- Motion respects `prefers-reduced-motion`.
- External links communicate external navigation with the visible arrow.
- Dialogs retain `role="dialog"`, `aria-modal="true"`, and an associated title.

## Error Handling

- LegalEase never points at the expired parked domain.
- Missing illustration files must not hide titles, copy, or CTA controls.
- Generated alpha is checked at file level, not inferred from a checkerboard preview.
- External project availability is verified during implementation, but the portfolio does not proxy or depend on those sites at runtime.

## Verification

Automated contract checks must verify:

- Exactly seven project cards.
- CyberProof and Skinly Cure are absent.
- Watch, Elenchus, and LalaScore descriptions contain project-specific content.
- All five supplied public destinations are present exactly and use safe new-tab attributes.
- LegalEase does not reference `legalease.site`.
- Seven custom project assets exist, are referenced, and have transparent corners with opaque foreground pixels.
- Project art uses the interaction-only corner class.
- Native dialogs remain accessible.
- Reduced-motion CSS exists.

Rendered Chrome checks must verify:

- Artwork is hidden on pointer-capable devices at rest.
- Hovering and focusing each card reveals only that card's artwork.
- Art enters from the top-right border without obscuring copy or CTAs at desktop and mobile widths.
- Public CTAs resolve to the intended URLs.
- LegalEase and DialogSum open internal dialogs.
- Keyboard navigation, Escape-to-close, active navigation, and reduced-motion behavior remain functional.
