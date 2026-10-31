// LLM judge rubrics. Each judge fills a checklist of discrete criteria; the
// score is computed here from the checklist, not taken as a free 0–100 number,
// to keep noisy grading from swinging ratings.

import { skeletonElements, type AutopsyItem, type IsomorphicPromptSeed, type UpgradeItem } from '../data/forge';
import { LANDMINE_MAP } from '../data/desk';
import { chat, chatJson, type ChatMessage } from './openrouter';

export type Verdict = 'pass' | 'partial' | 'fail';
const VERDICT = { type: 'string', enum: ['pass', 'partial', 'fail'] };
const v2n = (v: Verdict) => (v === 'pass' ? 1 : v === 'partial' ? 0.5 : 0);

export const wordCount = (s: string) => (s.trim().match(/\S+/g) ?? []).length;
export const sentenceCount = (s: string) => (s.trim().match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? []).filter((x) => x.trim()).length;

const JUDGE_SYSTEM = `You are a strict, fair judge of systems thinking (System Dynamics, cybernetics and Donella Meadows’ leverage points). You grade against the rubric only. You are not impressed by length, eloquence or buzzwords that ignore the task. Notes are one or two sentences, concrete, and quote the user’s words where useful. Use British spelling.`;

const obj = (properties: Record<string, unknown>) => ({
  type: 'object',
  additionalProperties: false,
  required: Object.keys(properties),
  properties,
});

// ── Isomorphic Transposition Workbench ─────────────────────

export interface ElementGrade {
  element: string;
  verdict: Verdict;
  note: string;
}
export interface TranspositionCardGrade {
  card: string;
  elements: ElementGrade[];
  realism: Verdict;
  realism_note: string;
  jargon_found: string[];
  better_version: string;
}
export interface TranspositionGrade {
  cards: TranspositionCardGrade[];
  overall_comment: string;
}

const transpositionSchema = obj({
  cards: {
    type: 'array',
    items: obj({
      card: { type: 'string' },
      elements: { type: 'array', items: obj({ element: { type: 'string' }, verdict: VERDICT, note: { type: 'string' } }) },
      realism: VERDICT,
      realism_note: { type: 'string' },
      jargon_found: { type: 'array', items: { type: 'string' } },
      better_version: { type: 'string' },
    }),
  },
  overall_comment: { type: 'string' },
});

export function transpositionScore(g: TranspositionCardGrade): number {
  const el = g.elements.length ? g.elements.reduce((s, e) => s + v2n(e.verdict), 0) / g.elements.length : 0;
  return Math.max(0, 0.75 * el + 0.25 * v2n(g.realism) - 0.1 * g.jargon_found.length);
}

export function judgeTransposition(o: {
  apiKey: string; model: string; seed: IsomorphicPromptSeed; cards: string[]; answers: string[]; forbidden: string[];
}): Promise<TranspositionGrade> {
  const elements = skeletonElements(o.seed.skeleton_spec);
  const items = o.cards.map((c, i) => `Domain card: ${c}\nUser’s narrative: """${o.answers[i] ?? ''}"""`).join('\n\n');
  return chatJson<TranspositionGrade>({
    apiKey: o.apiKey, model: o.model, schemaName: 'transposition_grade', schema: transpositionSchema,
    system: JUDGE_SYSTEM,
    user: `SYSTEMIC SKELETON: ${o.seed.title}
Elements every narrative must instantiate:
${elements.map(([k, v]) => `- ${k}: ${v}`).join('\n')}

Reference vignette in another domain (${o.seed.source_example.domain}): "${o.seed.source_example.text}"

The user wrote a 3–5 sentence narrative for each domain card below, in plain, concrete domain language. ZERO-JARGON RULE: they may not use systems vocabulary (${o.forbidden.join(', ')}). The structure must be unmistakable from the concrete story alone.

For each card, grade:
- elements: one entry per skeleton element above, in the same order, with "element" copied exactly from the key. pass = clearly and correctly present in the story, with the right causal direction and, where relevant, the right timing; partial = gestured at, vague or with the wrong polarity; fail = absent.
- realism: pass if the story is plausible and natural for that domain; partial if contrived; fail if it doesn’t really belong to the domain.
- jargon_found: any systems jargon the user used anyway (empty list if none).
- better_version: a model 3–5 sentence narrative for that card that nails every element without jargon.

Return the cards in the same order, with "card" copied exactly.

${items}`,
    check: (x: any) => {
      if (!Array.isArray(x?.cards) || x.cards.length !== o.cards.length) return `expected ${o.cards.length} cards`;
      for (const c of x.cards) if (!Array.isArray(c?.elements) || c.elements.length !== elements.length) return `each card needs exactly ${elements.length} element grades`;
      return null;
    },
  });
}

// ── POSIWID & Iceberg Autopsy ─────────────────────────────

export interface AutopsyGrade {
  purpose: Verdict;
  purpose_note: string;
  loop_traced: Verdict;
  loop_note: string;
  mental_model: Verdict;
  mental_model_note: string;
  better_version: string;
}

const autopsySchema = obj({
  purpose: VERDICT,
  purpose_note: { type: 'string' },
  loop_traced: VERDICT,
  loop_note: { type: 'string' },
  mental_model: VERDICT,
  mental_model_note: { type: 'string' },
  better_version: { type: 'string' },
});

export function autopsyScore(g: AutopsyGrade, words: number, limit: number): number {
  const s = 0.35 * v2n(g.purpose) + 0.4 * v2n(g.loop_traced) + 0.25 * v2n(g.mental_model);
  return words > limit ? s * 0.85 : s;
}

export function judgeAutopsy(o: { apiKey: string; model: string; item: AutopsyItem; answer: string; limit: number }): Promise<AutopsyGrade> {
  return chatJson<AutopsyGrade>({
    apiKey: o.apiKey, model: o.model, schemaName: 'autopsy_grade', schema: autopsySchema,
    system: JUDGE_SYSTEM,
    user: `INSTITUTIONAL STATEMENT (self-justifying, lamenting a “surprising” failure):
"""${o.item.statement}"""

Reference analysis, for your calibration only (accept any equivalent, well-reasoned answer):
- True purpose under POSIWID: ${o.item.true_purpose}
- Perverse loop: ${o.item.perverse_loop}
- Unstated mental model: ${o.item.mental_model}

The user had to, in under ${o.limit} words: (a) state the system’s true purpose under POSIWID (read from what it reliably produces, not its stated aims, and without imputing malice); (b) explicitly trace the perverse feedback loop (Goodhart’s Law / rule beating) that connects the measure to the behaviour, as a closed causal chain; (c) name the unstated mental model keeping the broken rule alive.

USER’S ANSWER (${wordCount(o.answer)} words):
"""${o.answer}"""

Grade each part. A loop only passes if it closes (the end of the chain feeds back to its start). better_version is a model answer under ${o.limit} words.`,
  });
}

// ── The Leverage Upgrade ──────────────────────────────────

export interface UpgradeGrade {
  removed_low_leverage: Verdict;
  removed_note: string;
  structural_target: Verdict;
  target_level: string;
  target_note: string;
  addresses_constraint: Verdict;
  constraint_note: string;
  specificity: Verdict;
  specificity_note: string;
  better_version: string;
}

const upgradeSchema = obj({
  removed_low_leverage: VERDICT,
  removed_note: { type: 'string' },
  structural_target: VERDICT,
  target_level: { type: 'string', enum: ['#11 buffers', '#10 stock-flow structure', '#9 delays', '#8–#7 loops', '#6 information flows', '#5 rules & incentives', '#4–#1 goals & paradigms', '#12 parameters', 'unclear'] },
  target_note: { type: 'string' },
  addresses_constraint: VERDICT,
  constraint_note: { type: 'string' },
  specificity: VERDICT,
  specificity_note: { type: 'string' },
  better_version: { type: 'string' },
});

export function upgradeScore(g: UpgradeGrade, sentences: number): number {
  const s = 0.2 * v2n(g.removed_low_leverage) + 0.3 * v2n(g.structural_target) + 0.3 * v2n(g.addresses_constraint) + 0.2 * v2n(g.specificity);
  return sentences > 3 ? s * 0.9 : s;
}

export function judgeUpgrade(o: { apiKey: string; model: string; item: UpgradeItem; answer: string }): Promise<UpgradeGrade> {
  return chatJson<UpgradeGrade>({
    apiKey: o.apiKey, model: o.model, schemaName: 'upgrade_grade', schema: upgradeSchema,
    system: JUDGE_SYSTEM,
    user: `LOW-LEVERAGE POLICY PROPOSAL: """${o.item.proposal}"""
Low-leverage elements in it: ${o.item.low_leverage.join('; ')}.
Reference binding constraint (for calibration; accept any well-argued equivalent): ${o.item.binding_constraint}

The user had to rewrite the intervention in 2–3 sentences: strip out the low-leverage parameter and punishment tweaks (Meadows #12), and replace them with a specific structural redesign targeting buffers (#11), information flows (#6) or rules and incentives (#5), aimed at the real constraint rather than the visible symptom.

USER’S REWRITE (${sentenceCount(o.answer)} sentences):
"""${o.answer}"""

Grade:
- removed_low_leverage: are the #12 tweaks and punishments gone (or explicitly replaced)?
- structural_target: is the replacement a genuine structural change? target_level: the highest Meadows level it actually operates at.
- addresses_constraint: does it act on the binding constraint or the loop producing the problem, not just the symptom?
- specificity: is it concrete enough to implement (who does what, what changes)?
- better_version: a model rewrite in 2–3 sentences.`,
  });
}

// ── The Crisis Desk ───────────────────────────────────────

export interface OpponentBrief {
  personaName: string;
  personaVoice: string;
  domain: string;
  problem: string;
  round: number;
  rounds: number;
  landmineInstructions: string[];
  wordCap: number;
  targetNote?: string;
}

export function opponentSystem(b: OpponentBrief): string {
  const final = b.round === b.rounds;
  return `You are role-playing a policymaker in a systems-thinking training app. Stay in character for the whole session.

Character: ${b.personaName}, a Linear Interventionist. Voice: ${b.personaVoice}
Domain: ${b.domain}
The problem on the table: ${b.problem}

You are pitching an emotionally appealing, common-sense “fix” for this problem and pushing for it to be ratified. Argue forcefully for linear, event-level solutions. Use plausible surface logic, cite short-term symptomatic improvements, dismiss downstream effects as “unrelated externalities”, and favour decisive parameter changes.

Your policy is SECRETLY built on these systemic landmines. Build each one into the substance of your pitch and defend it when challenged:
${b.landmineInstructions.map((t, i) => `${i + 1}. ${t}`).join('\n')}
${b.targetNote ? `Training focus: ${b.targetNote}\n` : ''}
This is exchange ${b.round} of ${b.rounds}.${b.round === 1 ? ' Open by pitching your policy concretely: what you will do, and why it will work.' : ' Respond directly to what the user just said, concede nothing structural, and press your case.'}${final ? ' This is your final turn: call for the policy to be ratified as it stands, perhaps with a cosmetic tweak.' : ''}

Rules:
- Never name or hint at your landmines, never use systems-thinking vocabulary approvingly, and never break character or mention being an AI, a game or a training exercise.
- Maximum ${b.wordCap} words. Plain prose, no headings, no bullet points, no stage directions.
- Be a genuinely persuasive opponent: confident and reasonable-sounding, never cartoonish.`;
}

export function opponentTurn(o: { apiKey: string; model: string; system: string; history: ChatMessage[]; signal?: AbortSignal }) {
  return chat({ apiKey: o.apiKey, model: o.model, messages: [{ role: 'system', content: o.system }, ...o.history], temperature: 0.8, maxTokens: 450, signal: o.signal });
}

export interface AxisGrade {
  checks: boolean[];
  score: number;
  evidence: string;
}
export interface LandmineFinding {
  landmine_id: string;
  exposed_by_user: boolean;
  first_exposed_round: number;
  defused: boolean;
  note: string;
}
export interface DeskScorecard {
  stock_flow_delay: AxisGrade;
  loop_archetype: AxisGrade;
  boundary_posiwid: AxisGrade;
  leverage: AxisGrade;
  clarity: AxisGrade;
  landmines: LandmineFinding[];
  jargon_count: number;
  key_moment: string;
  top_improvement: string;
  policy_outcome: 'blocked' | 'amended' | 'ratified';
  outcome_reason: string;
}

export type AxisKey = 'stock_flow_delay' | 'loop_archetype' | 'boundary_posiwid' | 'leverage' | 'clarity';

export const AXIS_CRITERIA: Record<AxisKey, { title: string; checks: string[] }> = {
  stock_flow_delay: { title: 'Stock, Flow & Delay Precision', checks: [
    'Distinguished accumulations (stocks) from rates (flows) in the opponent’s claims',
    'Pinpointed at least one delay and what it would do (overshoot, oscillation, false early success)',
    'Made no stock-flow errors of their own',
  ] },
  loop_archetype: { title: 'Loop & Archetype Diagnosis', checks: [
    'Traced at least one second-order feedback loop the “fix” would trigger',
    'Correctly identified a recurring structure (e.g. Fixes That Fail, Shifting the Burden, induced demand)',
    'Explained the direction of each loop (amplifying or correcting) correctly',
  ] },
  boundary_posiwid: { title: 'Boundary & POSIWID Clarity', checks: [
    'Widened an artificially narrow boundary, refusing to let a predictable effect be called a side effect',
    'Said what the system’s incentives would actually produce, as opposed to what was intended',
    'Avoided single-villain or single-cause explanations',
  ] },
  leverage: { title: 'Leverage Elevation', checks: [
    'Exposed at least one low-leverage parameter tweak (#12) for what it is',
    'Counter-proposed a concrete higher-leverage intervention (#11 to #3)',
    'Aimed the counter-proposal at the binding constraint or the loop, not the symptom',
  ] },
  clarity: { title: 'Clarity & Jargon Translation', checks: [
    'Explained the dynamics in concrete domain language a non-specialist would accept',
    'Kept to the point within the word ceiling',
    'Used systems terminology only where it added precision, and translated it when used',
  ] },
};

const axisSchema = obj({
  checks: { type: 'array', items: { type: 'boolean' } },
  score: { type: 'integer' },
  evidence: { type: 'string' },
});

const scorecardSchema = obj({
  stock_flow_delay: axisSchema,
  loop_archetype: axisSchema,
  boundary_posiwid: axisSchema,
  leverage: axisSchema,
  clarity: axisSchema,
  landmines: { type: 'array', items: obj({
    landmine_id: { type: 'string' },
    exposed_by_user: { type: 'boolean' },
    first_exposed_round: { type: 'integer' },
    defused: { type: 'boolean' },
    note: { type: 'string' },
  }) },
  jargon_count: { type: 'integer' },
  key_moment: { type: 'string' },
  top_improvement: { type: 'string' },
  policy_outcome: { type: 'string', enum: ['blocked', 'amended', 'ratified'] },
  outcome_reason: { type: 'string' },
});

/** Final 0–100 axis score: the arbiter’s number tempered by its own checklist. */
export function axisFinal(a: AxisGrade): number {
  const met = a.checks.length ? a.checks.filter(Boolean).length / a.checks.length : 0;
  return Math.round(0.5 * Math.min(100, Math.max(0, a.score)) + 50 * met);
}

export function arbitrate(o: {
  apiKey: string; model: string; domain: string; problem: string;
  transcript: { speaker: 'opponent' | 'user'; round: number; text: string; flagged?: string[] }[];
  landmines: string[];
  signal?: AbortSignal;
}): Promise<DeskScorecard> {
  const transcript = o.transcript
    .map((t) => `[Exchange ${t.round}] ${t.speaker === 'user' ? 'USER' : 'POLICYMAKER'}: ${t.text}${t.flagged?.length ? `\n  (User privately flagged: ${t.flagged.map((f) => LANDMINE_MAP[f]?.label ?? f).join(', ')})` : ''}`)
    .join('\n\n');
  const criteria = (Object.entries(AXIS_CRITERIA) as [AxisKey, { title: string; checks: string[] }][])
    .map(([k, v]) => `${k} (${v.title}):\n${v.checks.map((c, i) => `  ${i + 1}. ${c}`).join('\n')}`)
    .join('\n');
  return chatJson<DeskScorecard>({
    apiKey: o.apiKey, model: o.model, schemaName: 'desk_scorecard', schema: scorecardSchema, signal: o.signal,
    system: `${JUDGE_SYSTEM} You are the Chief Cyberneticist presiding over a policy review. You judge ONLY the user’s performance, objectively, whether the policymaker argued well or badly.`,
    user: `Domain: ${o.domain}. Problem: ${o.problem}
A policymaker pitched a “fix”; the user’s job was to diagnose its systemic flaws and counter-propose something better.

The policy secretly contained these landmines: ${o.landmines.map((id) => `${id} (${LANDMINE_MAP[id]?.label}: ${LANDMINE_MAP[id]?.instruction})`).join('; ')}.

TRANSCRIPT:
${transcript}

For each axis, set "checks" to an array of booleans, one per numbered criterion below, in order. Set "score" to 0–100 for that axis overall, and "evidence" to a short quote or observation from the user’s turns.
${criteria}

For "landmines", include one entry per landmine (landmine_id exactly as given): exposed_by_user is true if the user explicitly identified the flaw in their own words or flagged it; first_exposed_round is the exchange number where they first did so (0 if never); defused is true if their argument showed convincingly why it would fail.
jargon_count: the number of times the user hid behind unexplained systems buzzwords.
policy_outcome: “blocked” if the user exposed the policy’s core flaws convincingly, “amended” if they exposed some and forced a partial rethink, “ratified” if the policy would pass essentially as pitched.
key_moment: the user’s best or most decisive moment. top_improvement: the single most useful thing to change next time.`,
    check: (x: any) => {
      for (const k of Object.keys(AXIS_CRITERIA)) {
        if (!Array.isArray(x?.[k]?.checks) || x[k].checks.length !== 3) return `${k}.checks must have exactly 3 booleans`;
      }
      return Array.isArray(x?.landmines) ? null : 'landmines must be an array';
    },
  });
}

