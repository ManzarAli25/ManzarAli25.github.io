# Project Corner Wojaks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current project grid with seven accurate, directly linked projects and seven custom transparent top-right Wojak interaction assets.

**Architecture:** Keep the existing single-file portfolio architecture in `index.html`, with structural contracts in Node and alpha contracts in PowerShell. Project-specific art is stored under `assets/projects/`; CSS owns the corner reveal and reduced-motion behavior, while JavaScript is limited to internal LegalEase/DialogSum dialogs and existing navigation/reveal observers.

**Tech Stack:** Static HTML, CSS, browser JavaScript, Node's built-in test runner, PowerShell/.NET image inspection, built-in ImageGen, Chrome browser verification.

**Spec:** `docs/superpowers/specs/2026-08-29-project-corner-wojaks-design.md`

## Global Constraints

- The project order is LegalEase, Watch, Elenchus, LalaScore, TRNSIT Kolachi, AgentRed, DialogSum.
- CyberProof and Skinly Cure must be removed.
- All visuals use only black, white, and grayscale.
- Generated project assets must be real RGBA PNGs with transparent corners; a checkerboard preview is not evidence of alpha.
- External destinations open in a new tab with `target="_blank"` and `rel="noreferrer"`.
- LegalEase must not link to the expired `legalease.site` domain.
- LegalEase and DialogSum use accessible native dialogs.
- Project art is hidden at rest on pointer-capable devices and appears on hover and `:focus-within` from the top-right corner.
- Touch layouts show a restrained static crop.
- `prefers-reduced-motion: reduce` removes positional animation.
- Preserve obvious primary navigation and the existing Education/about voice.

---

### Task 1: Lock the Seven-Project Contract

**Files:**
- Modify: `tests/portfolio.test.mjs`
- Test: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: current `index.html` as a UTF-8 string.
- Produces: a contract for project count, names, ordering, destinations, safe external-link attributes, internal-dialog triggers, and corner-asset references.

- [ ] **Step 1: Replace the current project-specific assertions with the new failing contract**

```js
const projectOrder = ['LegalEase', 'Watch', 'Elenchus', 'LalaScore', 'TRNSIT Kolachi', 'AgentRed', 'DialogSum'];
const positions = projectOrder.map(name => html.indexOf(`<h3>${name}</h3>`));
assert.equal(positions.filter(position => position >= 0).length, 7);
assert.deepEqual([...positions].sort((a, b) => a - b), positions);
assert.equal((html.match(/<article class="project/g) || []).length, 7);
assert.doesNotMatch(html, /CyberProof|Skinly Cure/);

const destinations = [
  'https://github.com/ManzarAli25/watch-it',
  'https://github.com/ManzarAli25/elenchus',
  'https://lalascore.lol/',
  'https://github.com/ManzarAli25/TRNSIT-KOLACHI',
  'https://github.com/ManzarAli25/AgentRed',
];
for (const href of destinations) {
  const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  assert.match(html, new RegExp(`<a[^>]+href="${escaped}"[^>]+target="_blank"[^>]+rel="noreferrer"`, 'i'));
}
assert.doesNotMatch(html, /href="https:\/\/legalease\.site/);
assert.match(html, /data-project="legalease"/);
assert.match(html, /data-project="dialogsum"/);

for (const slug of ['legalease','watch','elenchus','lalascore','trnsit','agentred','dialogsum']) {
  assert.match(html, new RegExp(`assets/projects/${slug}-corner\\.png`));
}
```

- [ ] **Step 2: Run the contract and verify it fails on the current six-project grid**

Run: `node --test tests/portfolio.test.mjs`

Expected: FAIL because Watch, Elenchus, LalaScore, and the seven corner assets are absent while CyberProof and Skinly Cure remain.

- [ ] **Step 3: Commit the failing contract**

```powershell
git add -- tests/portfolio.test.mjs
git commit -m "test: define seven-project portfolio contract"
```

---

### Task 2: Generate and Validate Seven Project Corner Assets

**Files:**
- Create: `assets/projects/legalease-corner.png`
- Create: `assets/projects/watch-corner.png`
- Create: `assets/projects/elenchus-corner.png`
- Create: `assets/projects/lalascore-corner.png`
- Create: `assets/projects/trnsit-corner.png`
- Create: `assets/projects/agentred-corner.png`
- Create: `assets/projects/dialogsum-corner.png`
- Modify: `tests/check-transparent-backgrounds.ps1`
- Reuse: `scripts/remove-checkerboard.ps1`

**Interfaces:**
- Consumes: one ImageGen prompt per project and the shared black-and-white character style.
- Produces: seven RGBA PNG files named exactly as listed above; every corner alpha is `0` and the foreground contains opaque pixels.

- [ ] **Step 1: Extend the alpha test before generating files**

```powershell
$projectTargets = @(
    'legalease-corner.png', 'watch-corner.png', 'elenchus-corner.png',
    'lalascore-corner.png', 'trnsit-corner.png', 'agentred-corner.png',
    'dialogsum-corner.png'
)
foreach ($name in $projectTargets) {
    $path = Join-Path "$PSScriptRoot\..\assets\projects" $name
    if (-not (Test-Path -LiteralPath $path)) { throw "missing project art: $name" }
    $bitmap = [System.Drawing.Bitmap]::FromFile($path)
    try {
        $corners = @($bitmap.GetPixel(0,0).A,$bitmap.GetPixel($bitmap.Width-1,0).A,$bitmap.GetPixel(0,$bitmap.Height-1).A,$bitmap.GetPixel($bitmap.Width-1,$bitmap.Height-1).A)
        if ($corners | Where-Object { $_ -ne 0 }) { throw "$name has opaque corners" }
        $opaqueFound = $false
        for ($y = 0; $y -lt $bitmap.Height -and -not $opaqueFound; $y += 24) {
            for ($x = 0; $x -lt $bitmap.Width; $x += 24) {
                if ($bitmap.GetPixel($x,$y).A -gt 200) { $opaqueFound = $true; break }
            }
        }
        if (-not $opaqueFound) { throw "$name has no opaque foreground" }
    } finally { $bitmap.Dispose() }
}
```

- [ ] **Step 2: Run the alpha contract and verify missing-file failure**

Run: `powershell -NoProfile -ExecutionPolicy Bypass -File tests/check-transparent-backgrounds.ps1`

Expected: FAIL with `missing project art: legalease-corner.png`.

- [ ] **Step 3: Generate LegalEase and Watch in two separate built-in ImageGen calls**

LegalEase prompt:

```text
Use case: stylized-concept
Asset type: transparent top-right corner reveal for a monochrome portfolio project card
Primary request: an anxious ordinary client Wojak facing a calm lawyer Wojak who holds a legal document, with small balanced scales between them
Style/medium: bold hand-inked black-and-white Wojak illustration matching the existing curly-haired portfolio character system
Composition/framing: compact diagonal composition; figures enter from the lower-left and visually point toward the top-right corner; readable at 220 CSS pixels
Color palette: black, white, grayscale only
Constraints: genuine RGBA transparency outside the figures; all four corner pixels alpha 0; no rectangular scene; no checkerboard; no readable text; no logos; no watermark
```

Watch prompt:

```text
Use case: stylized-concept
Asset type: transparent top-right corner reveal for a monochrome portfolio project card
Primary request: an observer Wojak with several tasteful stylized eyes studying a short filmstrip that transforms into a clean structured event timeline
Style/medium: bold hand-inked black-and-white Wojak illustration
Composition/framing: compact diagonal corner-peek composition entering from lower-left toward top-right; legible at 220 CSS pixels
Color palette: black, white, grayscale only
Constraints: genuine RGBA transparency; all four corner pixels alpha 0; no checkerboard; no background rectangle; no readable text; no logos; no watermark
```

- [ ] **Step 4: Generate Elenchus and LalaScore in separate ImageGen calls**

Elenchus prompt:

```text
Use case: stylized-concept
Asset type: transparent top-right project-card corner reveal
Primary request: skeptical philosopher-detective Wojak holding a magnifying glass and comparing two visibly contradictory evidence sheets
Style/medium: bold monochrome Wojak ink drawing
Composition/framing: diagonal corner-peek, lower-left toward top-right, compact and readable at 220 CSS pixels
Color palette: black, white, grayscale only
Constraints: genuine RGBA transparency; corners alpha 0; no checkerboard; no scene rectangle; no readable text; no logos; no watermark
```

LalaScore prompt:

```text
Use case: stylized-concept
Asset type: transparent top-right project-card corner reveal
Primary request: smug corporate-manager Wojak peeking over a clipboard, surrounded by subtle visual motifs of a clock, attendance sheet, after-hours phone, and forced office-family pose
Style/medium: bold monochrome Wojak ink drawing with dry satirical tone
Composition/framing: diagonal corner-peek, lower-left toward top-right, compact at 220 CSS pixels
Color palette: black, white, grayscale only
Constraints: genuine RGBA transparency; corners alpha 0; no checkerboard; no readable words; no logos; no background rectangle; no watermark
```

- [ ] **Step 5: Generate TRNSIT, AgentRed, and DialogSum in separate ImageGen calls**

TRNSIT prompt:

```text
Use case: stylized-concept
Asset type: transparent top-right project-card corner reveal
Primary request: confused Karachi commuter Wojak holding a chaotic route map while a clear bus-stop path and simple bus silhouette resolve beside him
Style/medium: bold monochrome Wojak ink drawing
Composition/framing: diagonal corner-peek, lower-left toward top-right, compact at 220 CSS pixels
Color palette: black, white, grayscale only
Constraints: genuine RGBA transparency; corners alpha 0; no checkerboard; no readable text; no logos; no background rectangle; no watermark
```

AgentRed prompt:

```text
Use case: stylized-concept
Asset type: transparent top-right project-card corner reveal
Primary request: a classic confident Chad Wojak facing a nervous Virgin Wojak, opposing speech bubbles between them, with a small impartial judge marker above
Style/medium: bold monochrome meme-native Wojak ink drawing
Composition/framing: tight face-off entering diagonally from lower-left toward top-right, readable at 220 CSS pixels
Color palette: black, white, grayscale only
Constraints: genuine RGBA transparency; corners alpha 0; no checkerboard; no readable text; no logos; no background rectangle; no watermark
```

DialogSum prompt:

```text
Use case: stylized-concept
Asset type: transparent top-right project-card corner reveal
Primary request: overwhelmed Wojak surrounded by many overlapping speech bubbles, compressing them through a funnel into one clean concise note
Style/medium: bold monochrome Wojak ink drawing
Composition/framing: diagonal corner-peek, lower-left toward top-right, compact at 220 CSS pixels
Color palette: black, white, grayscale only
Constraints: genuine RGBA transparency; corners alpha 0; no checkerboard; no readable text; no logos; no background rectangle; no watermark
```

- [ ] **Step 6: Copy generated outputs into `assets/projects/` and run the alpha contract**

Run: `powershell -NoProfile -ExecutionPolicy Bypass -File tests/check-transparent-backgrounds.ps1`

Expected: PASS for the existing six supporting assets and all seven new project assets. If any generated file is opaque with a bright checkerboard, run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/remove-checkerboard.ps1 -AssetsPath assets/projects
```

Then rerun the alpha contract. Do not accept preview appearance as evidence.

- [ ] **Step 7: Visually inspect all seven files**

Use `view_image` on every file and confirm subject integrity, project relevance, top-right composition, detached-detail preservation, and lack of visible grid artifacts.

- [ ] **Step 8: Commit the asset set and alpha contract**

```powershell
git add -- assets/projects tests/check-transparent-backgrounds.ps1
git commit -m "feat: add project-specific corner wojaks"
```

---

### Task 3: Replace the Project Data, Copy, and Destinations

**Files:**
- Modify: `index.html`
- Test: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: seven asset paths from Task 2 and project copy/destinations from the spec.
- Produces: seven `.project` articles; five public anchors; two `button[data-project]` internal-dialog triggers.

- [ ] **Step 1: Replace the six current project articles with seven cards in the specified order**

Use this public-link structure for Watch, Elenchus, LalaScore, TRNSIT, and AgentRed:

```html
<article class="project reveal">
  <span class="corner-bracket" aria-hidden="true"></span>
  <span class="eyebrow">002 / AGENT VISION</span>
  <div>
    <h3>Watch</h3>
    <p>Coding agents can reason over text and images but are effectively blind to screen recordings. I built an MCP server that turns local or hosted videos into compact structured event timelines, with scene-aware sampling, on-demand frame inspection, caching, and per-call cost reporting.</p>
    <div class="tags"><span class="tag">MCP</span><span class="tag">Python</span><span class="tag">Vision</span></div>
    <a class="project-link" href="https://github.com/ManzarAli25/watch-it" target="_blank" rel="noreferrer">View project ↗</a>
  </div>
  <img class="project-corner-art" src="assets/projects/watch-corner.png" alt="" loading="lazy">
</article>
```

Repeat the structure with exact spec copy and these mappings:

```text
LegalEase        button data-project="legalease"              assets/projects/legalease-corner.png
Watch            https://github.com/ManzarAli25/watch-it       assets/projects/watch-corner.png
Elenchus         https://github.com/ManzarAli25/elenchus       assets/projects/elenchus-corner.png
LalaScore        https://lalascore.lol/                        assets/projects/lalascore-corner.png
TRNSIT Kolachi   https://github.com/ManzarAli25/TRNSIT-KOLACHI assets/projects/trnsit-corner.png
AgentRed         https://github.com/ManzarAli25/AgentRed        assets/projects/agentred-corner.png
DialogSum        button data-project="dialogsum"               assets/projects/dialogsum-corner.png
```

- [ ] **Step 2: Update the `projects` JavaScript object to only the two internal projects**

```js
const projects = {
  legalease: {
    i: '001 / LEGAL AI · PRIVATE',
    t: 'LegalEase',
    d: 'Legal information in Pakistan is fragmented, inaccessible, and expensive for non-lawyers. I built an AI-first advisory platform grounded in Pakistani law that answers law-specific questions and escalates complex cases to real lawyers. Developed with input from Kazi Associates, it reached Stage 3 at FICS (NUST) and was presented at ICISCT ’25.'
  },
  dialogsum: {
    i: '007 / RESEARCH',
    t: 'DialogSum',
    d: 'I compared full FLAN-T5 fine-tuning, LoRA, and prompt tuning against ROUGE metrics and human baselines to make the accuracy-versus-efficiency trade-off concrete.'
  }
};
```

- [ ] **Step 3: Run the portfolio contract**

Run: `node --test tests/portfolio.test.mjs`

Expected: PASS for project count, ordering, copy markers, destinations, safe link attributes, removed projects, internal triggers, and asset references.

- [ ] **Step 4: Commit the project content and links**

```powershell
git add -- index.html tests/portfolio.test.mjs
git commit -m "feat: replace portfolio project lineup"
```

---

### Task 4: Implement the Top-Right Corner Interaction

**Files:**
- Modify: `index.html`
- Modify: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: `.project`, `.corner-bracket`, `.project-link`, and `.project-corner-art` markup from Task 3.
- Produces: CSS-only hover/focus/touch/reduced-motion states; no additional JavaScript API.

- [ ] **Step 1: Add failing interaction selectors to the contract**

```js
assert.match(html, /\.project:hover \.project-corner-art/);
assert.match(html, /\.project:focus-within \.project-corner-art/);
assert.match(html, /\.corner-bracket/);
assert.match(html, /@media\(hover:none\)/);
assert.match(html, /@media\(prefers-reduced-motion:reduce\)/);
assert.doesNotMatch(html, /bounce|elastic|parallax/i);
```

- [ ] **Step 2: Run the contract and verify selector failure**

Run: `node --test tests/portfolio.test.mjs`

Expected: FAIL because `.project-corner-art` and `.corner-bracket` interaction CSS is absent.

- [ ] **Step 3: Add the minimal interaction CSS**

```css
.corner-bracket{position:absolute;top:0;right:0;width:3rem;height:3rem;border-top:2px solid;border-right:2px solid;transition:width .24s ease,height .24s ease}
.project-corner-art{position:absolute;right:-.75rem;top:-.75rem;width:min(38%,230px);max-height:72%;object-fit:contain;object-position:top right;opacity:0;transform:translate(1rem,-1rem);transition:opacity .22s ease,transform .28s ease;pointer-events:none;z-index:1}
.project>div,.project>.eyebrow{position:relative;z-index:2}
.project:hover .corner-bracket,.project:focus-within .corner-bracket{width:5rem;height:5rem}
.project:hover .project-corner-art,.project:focus-within .project-corner-art{opacity:.24;transform:translate(0,0)}
.project-link{display:inline-block;position:relative;text-decoration:none;font-weight:800;text-transform:uppercase}
.project-link::after{content:"";position:absolute;left:0;right:100%;bottom:-.2rem;height:2px;background:currentColor;transition:right .22s ease}
.project-link:hover::after,.project-link:focus-visible::after{right:0}
@media(hover:none){.project-corner-art{opacity:.1;transform:none}}
@media(prefers-reduced-motion:reduce){.project-corner-art{transform:none}.corner-bracket,.project-corner-art,.project-link::after{transition:none}}
```

- [ ] **Step 4: Remove superseded `.expression-reveal` rules and references**

Delete the old `.expression-reveal`, `.project:hover .expression-reveal`, `.project:focus-within .expression-reveal`, and touch override selectors. Confirm `rg -n "expression-reveal" index.html` returns no matches.

- [ ] **Step 5: Run the contract and JavaScript syntax check**

```powershell
node --test tests/portfolio.test.mjs
$html = Get-Content -Raw index.html
$script = [regex]::Match($html, '<script>([\s\S]*?)</script>').Groups[1].Value
Set-Content -LiteralPath ([System.IO.Path]::GetTempPath() + 'portfolio-inline.js') -Value $script
node --check ([System.IO.Path]::GetTempPath() + 'portfolio-inline.js')
```

Expected: both commands exit `0`.

- [ ] **Step 6: Commit the interaction system**

```powershell
git add -- index.html tests/portfolio.test.mjs
git commit -m "feat: reveal project art from card corners"
```

---

### Task 5: Verify Rendered Behavior and Final State

**Files:**
- Modify only if verification exposes a defect: `index.html`, `tests/portfolio.test.mjs`, `tests/check-transparent-backgrounds.ps1`

**Interfaces:**
- Consumes: completed static portfolio at `http://127.0.0.1:4173/`.
- Produces: verified Chrome behavior at desktop and mobile widths with no console errors.

- [ ] **Step 1: Run the full non-browser verification suite**

```powershell
node --test tests/portfolio.test.mjs
powershell -NoProfile -ExecutionPolicy Bypass -File tests/check-transparent-backgrounds.ps1
git diff --check
```

Expected: all tests pass, all thirteen generated/supporting assets satisfy alpha checks, and `git diff --check` reports no errors.

- [ ] **Step 2: Start or reuse the local server and refresh Chrome**

Run: `python -m http.server 4173`

Open `http://127.0.0.1:4173/#projects` in Chrome and keep the tab marked as the user-facing deliverable.

- [ ] **Step 3: Verify desktop project behavior in Chrome**

At the normal viewport confirm:

```text
project cards = 7
visible project-corner-art at rest = 0
hover first card visible project-corner-art = 1
focus second card visible project-corner-art = 1
LegalEase CTA opens dialog
Escape closes dialog
Watch href = https://github.com/ManzarAli25/watch-it
Elenchus href = https://github.com/ManzarAli25/elenchus
LalaScore href = https://lalascore.lol/
TRNSIT href = https://github.com/ManzarAli25/TRNSIT-KOLACHI
AgentRed href = https://github.com/ManzarAli25/AgentRed
```

Use DOM snapshots for element ground truth and screenshots for corner-art placement. Check browser console logs with `tab.dev.logs({levels:['error','warning']})`; expected result is an empty list.

- [ ] **Step 4: Verify mobile/touch layout**

Use the browser viewport capability at `390 × 844`. Confirm cards stack, art remains a low-opacity top-right crop, no title/CTA is obscured, no horizontal overflow exists, and internal dialogs fit the viewport. Reset the viewport override after testing.

- [ ] **Step 5: Verify reduced motion**

If browser capability supports reduced-motion emulation, enable it and confirm the art reveals without translation. Otherwise inspect computed CSS rules and record that the media rule removes transitions and transforms.

- [ ] **Step 6: Fix any discovered defect using a fresh failing regression test**

For every defect, add the smallest assertion to `tests/portfolio.test.mjs` or `tests/check-transparent-backgrounds.ps1`, run it to observe failure, make the minimal implementation change, then rerun the full suite.

- [ ] **Step 7: Commit final verification fixes if any**

```powershell
git add -- index.html tests assets/projects
git commit -m "fix: polish project corner interactions"
```

- [ ] **Step 8: Report completion with evidence**

Report the final test counts, alpha results, Chrome interaction results, final asset paths, exact ImageGen prompt set, and any known limitation. Do not claim deployment because publishing is outside this plan.
