import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
for (const label of ['Work', 'Projects', 'About', 'Contact']) {
  assert.match(html, new RegExp(`href=["']#[^"']+["'][^>]*>\\s*${label}\\s*<`, 'i'), `missing obvious ${label} navigation`);
}
assert.match(html, /font-family:\s*["']ABC Diatype["'],\s*["']Helvetica Neue["'],\s*Arial,\s*sans-serif/i);
assert.doesNotMatch(html, /#[a-f\d]{6}/gi, 'six-digit colors are forbidden');
assert.match(html, /<details[^>]*class=["'][^"']*lore/i);
assert.match(html, /view the lore/i);
assert.match(html, /prefers-reduced-motion:\s*reduce/i);
assert.match(html, /role=["']dialog["']/i);
assert.match(html, /aria-modal=["']true["']/i);

const assets = ['wojak-hero.png','wojak-neutral.png','wojak-happy.png','wojak-night.png','wojak-crying.png','wojak-notes.png','wojak-cool.png'];
for (const asset of assets) {
  assert.ok(existsSync(new URL(`../assets/${asset}`, import.meta.url)), `missing assets/${asset}`);
}
assert.match(html, /assets\/wojak-hero\.png/, 'hero artwork should remain in use');
assert.match(html, /class=["'][^"']*project-corner-art/i);
assert.match(html, /\.project:hover \.project-corner-art/);
assert.match(html, /\.project:focus-within \.project-corner-art/);
assert.match(html, /\.corner-bracket/);
assert.match(html, /@media\(hover:none\)/);
assert.match(html, /@media\(prefers-reduced-motion:reduce\)/);
const reducedMotionCss = html.slice(html.indexOf('@media(prefers-reduced-motion:reduce)'), html.indexOf('</style>'));
assert.match(reducedMotionCss, /\.project:hover \.corner-bracket,\.project:focus-within \.corner-bracket\{width:3rem;height:3rem\}/);
assert.match(reducedMotionCss, /\.project:hover \.project-corner-art,\.project:focus-within \.project-corner-art,[^{]+\{transform:none\}/);
assert.match(reducedMotionCss, /\.project-link:hover::after,\.project-link:focus-visible::after\{right:100%\}/);
assert.doesNotMatch(html, /\b(?:bounce|elastic|parallax)\b/i);
assert.doesNotMatch(html, /return to spawn|enter discourse|open side quest|see receipts|inspect pixels/i);
assert.match(html, /View project/);
assert.match(html, /id=["']education["']/i);
assert.match(html, /structured experiment in learning under constraints/i);
assert.match(html, /Navigating Karachi’s public transport is opaque/i);
const projectOrder = ['LegalEase', 'Watch', 'Elenchus', 'LalaScore', 'TRNSIT Kolachi', 'AgentRed', 'DialogSum'];
const positions = projectOrder.map(name => html.indexOf(`<h3>${name}</h3>`));
assert.equal(positions.filter(position => position >= 0).length, 7);
assert.deepEqual([...positions].sort((a, b) => a - b), positions);
assert.equal((html.match(/<article class="project/g) || []).length, 7);
assert.doesNotMatch(html, /CyberProof|Skinly Cure/);

const destinations = [
  ['Watch', 'https://github.com/ManzarAli25/watch-it', 'View Watch project on GitHub (opens in new tab)'],
  ['Elenchus', 'https://github.com/ManzarAli25/elenchus', 'View Elenchus project on GitHub (opens in new tab)'],
  ['LalaScore', 'https://lalascore.lol/', 'View LalaScore live site (opens in new tab)'],
  ['TRNSIT Kolachi', 'https://github.com/ManzarAli25/TRNSIT-KOLACHI', 'View TRNSIT Kolachi project on GitHub (opens in new tab)'],
  ['AgentRed', 'https://github.com/ManzarAli25/AgentRed', 'View AgentRed project on GitHub (opens in new tab)'],
];
const projectArticle = name => {
  const heading = `<h3>${name}</h3>`;
  const headingIndex = html.indexOf(heading);
  assert.notEqual(headingIndex, -1, `missing project heading for ${name}`);
  const start = html.lastIndexOf('<article class="project', headingIndex);
  const end = html.indexOf('</article>', headingIndex);
  assert.ok(start >= 0 && end > headingIndex, `missing bounded project article for ${name}`);
  const article = html.slice(start, end + '</article>'.length);
  assert.equal((article.match(/<article\b/gi) || []).length, 1, `${name} extraction crossed an article boundary`);
  return article;
};
for (const [name, href, label] of destinations) {
  const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const article = projectArticle(name);
  assert.match(article, new RegExp(`<a[^>]+href="${escaped}"[^>]+target="_blank"[^>]+rel="noreferrer"[^>]+aria-label="${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'i'));
  assert.equal((html.match(new RegExp(`href="${escaped}"`, 'g')) || []).length, 1, `${href} must occur exactly once`);
}
assert.match(projectArticle('Watch'), /scene-aware sampling[\s\S]*on-demand frame inspection[\s\S]*per-call cost reporting/i);
assert.match(projectArticle('Elenchus'), /independent evidence lanes[\s\S]*adjudicates/i);
assert.match(projectArticle('LalaScore'), /public signals[\s\S]*anonymous community evidence[\s\S]*due-process/i);
assert.doesNotMatch(html, /href="https:\/\/legalease\.site/);
assert.match(projectArticle('LegalEase'), /<button[^>]+data-project="legalease"/i);
assert.match(projectArticle('DialogSum'), /<button[^>]+data-project="dialogsum"/i);
assert.match(html, /id="modalStack"/);
assert.match(html, /id="modalStatus"/);
assert.match(html, /legalease:[\s\S]*stack:[\s\S]*status:/i);
assert.match(html, /dialogsum:[\s\S]*stack:[\s\S]*status:/i);

const cornerSlugs = ['legalease','watch','elenchus','lalascore','trnsit','agentred','dialogsum'];
const cornerReferences = html.match(/assets\/projects\/[^"'\s]+-corner\.png/g) || [];
assert.equal(cornerReferences.length, cornerSlugs.length);
for (const slug of cornerSlugs) {
  assert.equal(cornerReferences.filter(reference => reference === `assets/projects/${slug}-corner.png`).length, 1);
}
assert.match(html, /IntersectionObserver/);
assert.match(html, /aria-current/);
assert.doesNotMatch(html, /projects_screenshots\//);

console.log('portfolio contract passed');
