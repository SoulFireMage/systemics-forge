// Zero-Jargon Rule (spec §3.2, §6): a fast client-side pre-check that finds
// forbidden systems vocabulary before anything is sent to the judge.

/** Always forbidden in the Transposition Workbench, on top of each seed's own list. */
export const BASE_FORBIDDEN = [
  'stock', 'flow', 'loop', 'balancing', 'reinforcing', 'archetype', 'atrophy', 'system',
  'feedback', 'leverage', 'oscillation', 'overshoot', 'buffer', 'posiwid', 'goodhart',
];

export interface JargonHit {
  word: string;
  index: number;
  length: number;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Match a forbidden word and its common inflections (stocks, looped, flowing, atrophied…). */
function patternFor(word: string): RegExp {
  const w = escape(word.toLowerCase());
  const stem = w.endsWith('y') ? `${w.slice(0, -1)}(?:y|ies|ied|ying)` : `${w}(?:s|es|ed|ing|ic|ical|ically)?`;
  return new RegExp(`\\b${stem}\\b`, 'gi');
}

export function findJargon(text: string, forbidden: string[]): JargonHit[] {
  const words = [...new Set([...BASE_FORBIDDEN, ...forbidden].map((w) => w.toLowerCase().trim()).filter(Boolean))];
  const hits: JargonHit[] = [];
  for (const word of words) {
    for (const m of text.matchAll(patternFor(word))) hits.push({ word, index: m.index ?? 0, length: m[0].length });
  }
  return hits.sort((a, b) => a.index - b.index);
}

/** Split text into plain and flagged runs, for highlighting. */
export function jargonRuns(text: string, hits: JargonHit[]): { text: string; hit: boolean }[] {
  const out: { text: string; hit: boolean }[] = [];
  let at = 0;
  for (const h of hits) {
    if (h.index < at) continue;
    if (h.index > at) out.push({ text: text.slice(at, h.index), hit: false });
    out.push({ text: text.slice(h.index, h.index + h.length), hit: true });
    at = h.index + h.length;
  }
  if (at < text.length) out.push({ text: text.slice(at), hit: false });
  return out;
}
