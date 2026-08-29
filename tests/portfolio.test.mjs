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
  assert.match(html, new RegExp(`assets/${asset.replace('.', '\\.')}`), `${asset} should have a restrained interaction role`);
}
assert.match(html, /class=["'][^"']*expression-reveal/i);
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
assert.match(html, /IntersectionObserver/);
assert.match(html, /aria-current/);
assert.doesNotMatch(html, /projects_screenshots\//);

console.log('portfolio contract passed');
