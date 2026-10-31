import { describe, expect, it } from 'vitest';
import { SEED_DRILLS } from '../src/data/drills';
import { NODES } from '../src/data/taxonomy';
import { validateDrill } from '../src/lib/validate';
import { glickoUpdate, winProbability } from '../src/lib/rating';
import { nextStability, retrievability } from '../src/lib/memory';
import { applyOutcome, emptyTelemetry, mergeTelemetry } from '../src/lib/telemetry';
import { extractJson } from '../src/lib/openrouter';
import { calibrationQueue } from '../src/lib/scheduler';
import { findJargon } from '../src/lib/jargon';

describe('seed drill bank', () => {
  it('every drill passes structural validation', () => {
    const problems = SEED_DRILLS.flatMap((d) => validateDrill(d).map((e) => `${d.id}: ${e}`));
    expect(problems).toEqual([]);
  });
  it('ids are unique', () => {
    const ids = SEED_DRILLS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('covers all four wings and every drill type', () => {
    const wings = new Set(SEED_DRILLS.flatMap((d) => d.taxonomy_nodes.map((n) => NODES.find((x) => x.id === n)!.wing)));
    expect(wings.size).toBe(4);
    const types = new Set(SEED_DRILLS.map((d) => d.drill_type));
    expect(types).toEqual(new Set(['anatomical_dissection', 'bathtub_puzzle', 'isomorphic_match', 'leverage_triage']));
  });
  it('every taxonomy node is trained by at least one seed drill', () => {
    const covered = new Set(SEED_DRILLS.flatMap((d) => d.taxonomy_nodes));
    expect(NODES.filter((n) => !covered.has(n.id)).map((n) => n.id)).toEqual([]);
  });
  it('includes the spec reference drill verbatim (sys_w1_0018)', () => {
    const d = SEED_DRILLS.find((x) => x.id === 'sys_w1_0018')!;
    expect(d.correct_target_id).toBe('s3');
    expect(d.follow_up_question!.options.find((o) => o.is_correct)!.text).toMatch(/growing by 50/);
  });
  it('taxonomy node ids are unique', () => {
    expect(new Set(NODES.map((n) => n.id)).size).toBe(NODES.length);
  });
});

describe('Glicko-2', () => {
  it('reproduces Glickman’s worked example direction and magnitude', () => {
    // Paper example uses 3 games; for one game vs 1400/RD30 a win must raise rating and shrink RD.
    const r = glickoUpdate({ elo: 1500, rd: 200, vol: 0.06 }, 1400, 1, { opponentRd: 30 });
    expect(r.elo).toBeGreaterThan(1500);
    expect(r.elo).toBeLessThan(1600);
    expect(r.rd).toBeLessThan(200);
  });
  it('a loss lowers rating; weight damps the change', () => {
    const full = glickoUpdate({ elo: 1200, rd: 350, vol: 0.06 }, 1200, 0);
    const half = glickoUpdate({ elo: 1200, rd: 350, vol: 0.06 }, 1200, 0, { weight: 0.5 });
    expect(full.elo).toBeLessThan(1200);
    expect(1200 - half.elo).toBeCloseTo((1200 - full.elo) / 2, 5);
  });
  it('win probability is 0.5 against an equal opponent', () => {
    expect(winProbability(1300, 1300)).toBeCloseTo(0.5, 6);
  });
});

describe('FSRS-lite', () => {
  it('R(S,S) = 0.9', () => {
    expect(retrievability(10, 10)).toBeCloseTo(0.9, 6);
  });
  it('success grows stability, failure shrinks it', () => {
    const tenDaysAgo = new Date(Date.now() - 10 * 86_400_000).toISOString();
    expect(nextStability(5, tenDaysAgo, 1)).toBeGreaterThan(5);
    expect(nextStability(5, tenDaysAgo, 0)).toBeLessThan(5);
  });
});

describe('telemetry', () => {
  it('applies an outcome to every valid node', () => {
    const { telemetry, deltas } = applyOutcome(emptyTelemetry(), {
      kind: 'drill', item_id: 'x', nodes: ['posiwid', 'boundary_critique', 'not_a_node'], difficulty: 1200, score: 1,
    });
    expect(deltas.map((d) => d.node)).toEqual(['posiwid', 'boundary_critique']);
    expect(telemetry.node_mastery.posiwid.elo).toBeGreaterThan(1200);
    // Secondary node receives a smaller share of the evidence.
    expect(telemetry.node_mastery.boundary_critique.elo).toBeLessThan(telemetry.node_mastery.posiwid.elo);
    expect(telemetry.attempt_log).toHaveLength(1);
  });
  it('merge keeps the most recently practised node and unions history', () => {
    const a = applyOutcome(emptyTelemetry(), { kind: 'drill', item_id: 'a', nodes: ['posiwid'], difficulty: 1200, score: 1 }, new Date('2026-01-01')).telemetry;
    const b = applyOutcome(emptyTelemetry(), { kind: 'drill', item_id: 'b', nodes: ['posiwid'], difficulty: 1200, score: 0 }, new Date('2026-02-01')).telemetry;
    const m = mergeTelemetry(a, b, 'u1');
    expect(m.node_mastery.posiwid.elo).toBe(b.node_mastery.posiwid.elo);
    expect(m.attempt_log.map((x) => x.item_id)).toEqual(['a', 'b']);
    expect(m.user_id).toBe('u1');
    expect(mergeTelemetry(b, a).node_mastery.posiwid.elo).toBe(b.node_mastery.posiwid.elo);
  });
});

describe('scheduler', () => {
  it('builds a calibration queue of distinct drills', () => {
    const q = calibrationQueue(SEED_DRILLS, emptyTelemetry(), 8);
    expect(q).toHaveLength(8);
    expect(new Set(q.map((d) => d.id)).size).toBe(8);
  });
});

describe('extractJson', () => {
  it('pulls JSON out of fenced or chatty replies', () => {
    expect(extractJson('Sure!\n```json\n{"a": {"b": "}"}}\n```')).toEqual({ a: { b: '}' } });
    expect(extractJson('Result: {"x": 1} done')).toEqual({ x: 1 });
  });
});

describe('zero-jargon validator', () => {
  it('flags forbidden words and their inflections, case-insensitively', () => {
    const hits = findJargon('Stocks piled up; the Loop looped; systemic flows flowed.', []);
    expect(hits.map((h) => h.word)).toEqual(['stock', 'loop', 'loop', 'system', 'flow', 'flow']);
  });
  it('does not flag innocent words that merely contain a forbidden stem', () => {
    expect(findJargon('A loophole in the stockpile of flowers.', [])).toEqual([]);
  });
  it('handles -y words and seed-specific phrases', () => {
    expect(findJargon('Their skills atrophied; an arms race began.', ['arms race']).map((h) => h.word)).toEqual(['atrophy', 'arms race']);
  });
});

describe('forge content', async () => {
  const { SEEDS, AUTOPSIES, AUTOPSY_LIMIT, UPGRADES, skeletonElements } = await import('../src/data/forge');
  const { wordCount, sentenceCount } = await import('../src/lib/judges');
  it('autopsy reference answers respect the word limit they teach', () => {
    for (const a of AUTOPSIES) expect(wordCount(a.exemplar), a.id).toBeLessThanOrEqual(AUTOPSY_LIMIT);
  });
  it('upgrade reference answers are 2–3 sentences', () => {
    for (const u of UPGRADES) {
      const n = sentenceCount(u.exemplar);
      expect(n, u.id).toBeGreaterThanOrEqual(2);
      expect(n, u.id).toBeLessThanOrEqual(3);
    }
  });
  it('every skeleton seed has at least three elements and a forbidden list', () => {
    for (const s of SEEDS) {
      expect(skeletonElements(s.skeleton_spec).length, s.id).toBeGreaterThanOrEqual(3);
      expect(Array.isArray(s.skeleton_spec.forbidden_words), s.id).toBe(true);
    }
  });
  it('source vignettes obey their own zero-jargon rule', () => {
    for (const s of SEEDS) expect(findJargon(s.source_example.text, s.skeleton_spec.forbidden_words).map((h) => h.word), s.id).toEqual([]);
  });
  it('forge and crisis desk content only references real taxonomy nodes', async () => {
    const { LANDMINES, AXIS_NODES, PERSONAS, LANDMINE_MAP } = await import('../src/data/desk');
    const ids = [...SEEDS.flatMap((s) => s.taxonomy_nodes), ...AUTOPSIES.flatMap((a) => a.nodes), ...UPGRADES.flatMap((u) => u.nodes), ...LANDMINES.map((t) => t.node), ...Object.values(AXIS_NODES).flat()];
    expect(ids.filter((id) => !NODES.some((n) => n.id === id))).toEqual([]);
    expect(PERSONAS.flatMap((p) => p.favoured).filter((id) => !LANDMINE_MAP[id])).toEqual([]);
  });
});
