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
  ['Watch', 'https://github.com/ManzarAli25/watch-it'],
  ['Elenchus', 'https://github.com/ManzarAli25/elenchus'],
  ['LalaScore', 'https://lalascore.lol/'],
  ['TRNSIT Kolachi', 'https://github.com/ManzarAli25/TRNSIT-KOLACHI'],
  ['AgentRed', 'https://github.com/ManzarAli25/AgentRed'],
];
const projectArticle = name => {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = html.match(new RegExp(`<article class="project[^>]*>[\\s\\S]*?<h3>${escapedName}</h3>[\\s\\S]*?</article>`, 'i'));
  assert.ok(match, `missing project article for ${name}`);
  return match[0];
};
for (const [name, href] of destinations) {
  const escaped = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  assert.match(projectArticle(name), new RegExp(`<a[^>]+href="${escaped}"[^>]+target="_blank"[^>]+rel="noreferrer"`, 'i'));
}
assert.doesNotMatch(html, /href="https:\/\/legalease\.site/);
assert.match(projectArticle('LegalEase'), /<button[^>]+data-project="legalease"/i);
assert.match(projectArticle('DialogSum'), /<button[^>]+data-project="dialogsum"/i);

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
