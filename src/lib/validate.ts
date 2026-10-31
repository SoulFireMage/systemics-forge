// Structural checks for drills: used by the test suite on the seed bank and by
// the Admin Studio before anything is committed to the global bank.

import { NODE_MAP } from '../data/taxonomy';
import type { ChoiceQuestion, DrillItem } from './types';

function checkQuestion(q: ChoiceQuestion | undefined, where: string, errs: string[]) {
  if (!q) return;
  if (!q.question?.trim()) errs.push(`${where}: missing question text`);
  if (!Array.isArray(q.options) || q.options.length < 2) {
    errs.push(`${where}: needs at least 2 options`);
    return;
  }
  const correct = q.options.filter((o) => o.is_correct).length;
  if (correct !== 1) errs.push(`${where}: exactly one option must be correct (found ${correct})`);
  const ids = new Set<string>();
  for (const o of q.options) {
    if (!o.id || ids.has(o.id)) errs.push(`${where}: option ids must be present and unique`);
    ids.add(o.id);
    if (!o.text?.trim()) errs.push(`${where}: option ${o.id} has no text`);
    if (!o.feedback?.trim()) errs.push(`${where}: option ${o.id} has no feedback`);
    if (o.leverage_point != null && !(Number.isInteger(o.leverage_point) && o.leverage_point >= 1 && o.leverage_point <= 12)) {
      errs.push(`${where}: option ${o.id} leverage_point must be an integer 1–12`);
    }
  }
}

function checkSteps(d: DrillItem, min: number, errs: string[]) {
  if (!Array.isArray(d.steps) || d.steps.length < min) errs.push(`${d.drill_type} needs at least ${min} steps`);
  const ids = new Set<string>();
  (d.steps ?? []).forEach((s, i) => {
    if (!s.id || ids.has(s.id)) errs.push(`step ${i + 1}: id must be present and unique`);
    ids.add(s.id);
    if (!s.label?.trim()) errs.push(`step ${i + 1}: missing label`);
    checkQuestion(s, `step ${i + 1}`, errs);
  });
}

export function validateDrill(d: DrillItem): string[] {
  const errs: string[] = [];
  if (!d || typeof d !== 'object') return ['not an object'];
  if (!/^[a-z0-9_]+$/.test(d.id ?? '')) errs.push('id must be lowercase letters, digits and underscores');
  if (d.tier !== 'deterministic') errs.push('tier must be "deterministic"');
  if (!Array.isArray(d.taxonomy_nodes) || !d.taxonomy_nodes.length) errs.push('taxonomy_nodes must be a non-empty array');
  for (const id of d.taxonomy_nodes ?? []) if (!NODE_MAP[id]) errs.push(`unknown taxonomy node "${id}"`);
  if (!(d.difficulty_elo >= 800 && d.difficulty_elo <= 2000)) errs.push('difficulty_elo must be 800–2000');
  if (!d.register_tags?.formal || !d.register_tags?.intuitive) errs.push('register_tags needs formal and intuitive');
  if (!d.prompt_instruction?.trim()) errs.push('missing prompt_instruction');
  if (!d.explanation_formal?.trim() || !d.explanation_intuitive?.trim()) errs.push('needs both explanations');

  const segIds = new Set<string>();
  for (const s of d.passage_segments ?? []) {
    if (!s.id || segIds.has(s.id)) errs.push('segment ids must be present and unique');
    segIds.add(s.id);
    if (!s.text?.trim()) errs.push(`segment ${s.id} is empty`);
    if (!s.system_role) errs.push(`segment ${s.id} has no system_role`);
  }

  switch (d.drill_type) {
    case 'anatomical_dissection':
      if ((d.passage_segments?.length ?? 0) < 3) errs.push('dissection needs at least 3 segments');
      if (!d.correct_target_id || !segIds.has(d.correct_target_id)) errs.push('correct_target_id must name a segment');
      checkQuestion(d.follow_up_question, 'follow_up_question', errs);
      break;
    case 'bathtub_puzzle':
      if ((d.passage_segments?.length ?? 0) < 1) errs.push('bathtub puzzle needs a passage');
      checkSteps(d, 2, errs);
      for (const l of d.ledger ?? []) if (!l.label?.trim() || !l.value?.trim()) errs.push('ledger lines need a label and a value');
      break;
    case 'leverage_triage':
      if ((d.passage_segments?.length ?? 0) < 1) errs.push('leverage triage needs a passage');
      checkSteps(d, 3, errs);
      {
        const last = d.steps?.[d.steps.length - 1];
        if (last && last.options.some((o) => o.leverage_point == null)) errs.push('the final triage step must give every option a leverage_point');
        if (last && last.options.length) {
          const best = Math.min(...last.options.map((o) => o.leverage_point ?? 99));
          const correct = last.options.find((o) => o.is_correct);
          if (correct && correct.leverage_point !== best) errs.push('the correct final option must be the highest-leverage (lowest-numbered) one');
        }
      }
      break;
    case 'isomorphic_match': {
      if (!d.source_narrative?.text?.trim() || !d.source_narrative?.domain?.trim()) errs.push('isomorphic match needs a source_narrative with domain and text');
      const c = d.candidates ?? [];
      if (c.length < 3) errs.push('isomorphic match needs at least 3 candidates');
      if (c.filter((x) => x.is_correct).length !== 1) errs.push('exactly one candidate must be correct');
      const ids = new Set<string>();
      for (const x of c) {
        if (!x.id || ids.has(x.id)) errs.push('candidate ids must be present and unique');
        ids.add(x.id);
        if (!x.domain?.trim() || !x.text?.trim()) errs.push(`candidate ${x.id} needs a domain and text`);
        if (!x.feedback?.trim()) errs.push(`candidate ${x.id} has no feedback`);
      }
      const domains = new Set([d.source_narrative?.domain, ...c.map((x) => x.domain)]);
      if (domains.size !== c.length + 1) errs.push('source and candidates must all come from different domains');
      checkQuestion(d.follow_up_question, 'follow_up_question', errs);
      break;
    }
    default:
      errs.push(`unknown drill_type "${(d as DrillItem).drill_type}"`);
  }
  return errs;
}
