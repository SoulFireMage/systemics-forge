// Admin Drill Generator: batch-synthesises candidate drills in the app's schema.

import { NODE_MAP } from '../data/taxonomy';
import { SEED_DRILLS } from '../data/drills';
import { chatJson } from './openrouter';
import type { DrillItem, DrillType } from './types';
import { validateDrill } from './validate';

export interface GenParams {
  apiKey: string;
  model: string;
  nodes: string[];
  drillType: DrillType;
  difficulty: number;
  domain: string;
  count: number;
}

const TYPE_RULES: Record<DrillType, string> = {
  anatomical_dissection: `"anatomical_dissection": a realistic 3-to-6 sentence passage (a municipal report, an engineering post-mortem, a historical vignette, a hospital memo…) in passage_segments, each {id: "s1"…, text, system_role, optional note}. system_role names the sentence's structural role, e.g. stock, inflow, outflow, information_delay, material_delay, boundary_error, target_bathtub_error. Exactly one segment is the target, named by correct_target_id. Usually include a follow_up_question with 3–4 options (exactly one is_correct) whose distractors fail in instructive ways. Omit steps, ledger, source_narrative and candidates.`,
  bathtub_puzzle: `"bathtub_puzzle": a short realistic report in passage_segments with embedded rates of change and no charts. "steps": 2–3 sequential questions {id, label, question, options}, exactly one correct option each, typically (a) is the stock rising, falling or peaking right now, (b) which flow figure is missing if the text is ambiguous, or (c) at what exact condition will the stock peak (inflow = outflow). Include "ledger": 3–5 {label, value} lines showing the worked arithmetic. CHECK EVERY NUMBER. Omit correct_target_id, source_narrative and candidates.`,
  isomorphic_match: `"isomorphic_match": "source_narrative" {domain, text}: a 2–4 sentence systemic failure in one domain. "candidates": exactly 4 {id: "c1"…, domain, text, is_correct, feedback}, each from a completely different domain from the source and each other. All four describe disasters, but exactly one has the same underlying structure (stocks, loop polarity, delays, thresholds); the distractors have different structures (e.g. escalation, a reinforcing contagion loop, a single point failure) and each feedback names that structure. Optionally a follow_up_question asking for the shared skeleton. Omit passage_segments, steps and correct_target_id.`,
  leverage_triage: `"leverage_triage": a chronic problem in prose in passage_segments, plus exactly 3 "steps" {id, label, question, options} with 4 options each and exactly one correct: (1) label "Archetype": diagnose the active archetype; (2) label "POSIWID": what the system is actually optimised to produce, as opposed to its stated aim; (3) label "Leverage": four proposed interventions, EVERY option carrying "leverage_point" (Meadows' number, 12 = constants/parameters … 1 = transcending paradigms), the correct one having the lowest number (highest leverage) and also being genuinely the best on its merits. Omit correct_target_id, source_narrative and candidates.`,
};

export async function generateDrills(p: GenParams): Promise<{ drill: DrillItem; errors: string[] }[]> {
  const example = SEED_DRILLS.find((d) => d.drill_type === p.drillType)!;
  const { source: _s, ...exampleClean } = example;
  const nodeList = p.nodes.map((id) => `${id} = ${NODE_MAP[id].formal} / ${NODE_MAP[id].intuitive}: ${NODE_MAP[id].summary}`).join('\n');
  const res = await chatJson<{ drills: DrillItem[] }>({
    apiKey: p.apiKey,
    model: p.model,
    strict: false,
    temperature: 0.8,
    maxTokens: 8000,
    schemaName: 'drill_batch',
    schema: { type: 'object', properties: { drills: { type: 'array', items: { type: 'object' } } }, required: ['drills'] },
    system: `You are an expert teacher of systems thinking (System Dynamics, cybernetics, system archetypes and Donella Meadows’ leverage points), writing training drills for an app. Your drills are accurate (correct stock-flow arithmetic, correct loop polarities, no contested or wrong labels), realistic, concise and pedagogically sharp. Distractors are plausible and each one fails for a reason worth learning. Use British spelling.`,
    user: `Write ${p.count} new drill(s) as {"drills": [...]}.

Drill type: ${TYPE_RULES[p.drillType]}

Target skill nodes (taxonomy_nodes must use these ids; put the primary one first):
${nodeList}

Difficulty: about ${p.difficulty} on an ELO-style scale (1000 = clear-cut beginner case, 1400 = subtle, 1800 = expert discrimination between near neighbours).
Domain flavour: ${p.domain}.

Every drill needs: id (lowercase, digits and underscores), tier "deterministic", drill_type, taxonomy_nodes, difficulty_elo, domain, register_tags {formal, intuitive}, prompt_instruction, explanation_formal (formal / cybernetic terminology) and explanation_intuitive (plain-English structural metaphor).

Here is one complete example of this type, for format only (do not copy its content):
${JSON.stringify(exampleClean, null, 2)}`,
    check: (x: any) => (Array.isArray(x?.drills) && x.drills.length ? null : 'expected a non-empty "drills" array'),
  });
  const stamp = Date.now().toString(36);
  return res.drills.map((raw, i) => {
    const drill: DrillItem = {
      ...raw,
      tier: 'deterministic',
      drill_type: p.drillType,
      difficulty_elo: Number(raw.difficulty_elo) || p.difficulty,
      id: `gen_${stamp}_${i + 1}`,
    };
    return { drill, errors: validateDrill(drill) };
  });
}
