import { useMemo, useRef, useState } from 'preact/hooks';
import type { ChoiceOption, ChoiceQuestion, DrillItem, DrillType } from '../lib/types';
import { shuffle } from '../lib/scheduler';
import { Dual, Explanation, Term } from './Term';

export interface DrillResult {
  score: number;
  ttd_ms?: number;
}

interface Props {
  drill: DrillItem;
  onComplete: (r: DrillResult) => void;
  /** Blitz: skip follow-up questions and keep it terse. */
  blitz?: boolean;
}

const prettyRole = (role: string) => role.replace(/_/g, ' ');

export const TYPE_LABEL: Record<DrillType, string> = {
  anatomical_dissection: 'Anatomical Dissection',
  bathtub_puzzle: 'Bathtub in the Wild',
  isomorphic_match: 'Isomorphic Match',
  leverage_triage: 'Leverage Triage',
};

const HOW_TO: Record<DrillType, string> = {
  anatomical_dissection: 'Read the instruction, then click the sentence it asks for. The passage then labels each sentence’s structural role (stock, inflow, delay…). Answer the follow-up if there is one, and read the Anatomy at the end.',
  bathtub_puzzle: 'No charts: work it out from the rates in the text. Answer the questions in order. At the end the ledger shows the stock arithmetic. The trick is always the same: a stock changes by inflow minus outflow, whatever the headlines say.',
  isomorphic_match: 'Read the source story and find its skeleton: what accumulates, what drains it, what loop or threshold makes it fail. Then pick the one candidate from another field with the same skeleton. They are all disasters; only one has the same plumbing.',
  leverage_triage: 'Three steps: name the archetype, state what the system is actually producing (POSIWID), then choose the intervention with the highest leverage. Each policy option shows its Meadows number afterwards (12 is weakest, 1 strongest).',
};

const SEEN_KEY = 'sf.seen_drill_types';
function firstTimeFor(type: string): boolean {
  try {
    const seen: string[] = JSON.parse(localStorage.getItem(SEEN_KEY) ?? '[]');
    if (seen.includes(type)) return false;
    localStorage.setItem(SEEN_KEY, JSON.stringify([...seen, type]));
    return true;
  } catch {
    return false;
  }
}

function HowTo({ type }: { type: DrillType }) {
  const [open] = useState(() => firstTimeFor(type));
  return (
    <details class="howto" open={open}>
      <summary>How this drill works</summary>
      <p>{HOW_TO[type]} <a href="#/guide">Full guide</a></p>
    </details>
  );
}

export function DrillHeader({ drill }: { drill: DrillItem }) {
  return (
    <div class="drill-head">
      <div>
        <div class="eyebrow">{TYPE_LABEL[drill.drill_type]} · {drill.domain ?? 'General'} · difficulty {drill.difficulty_elo}</div>
        <h2 style={{ margin: '4px 0 0' }}><Dual formal={drill.register_tags.formal} intuitive={drill.register_tags.intuitive} /></h2>
      </div>
      <div class="tags">{drill.taxonomy_nodes.map((n) => <span class="tag"><Term node={n} /></span>)}</div>
    </div>
  );
}

export function DrillPlayer({ drill, onComplete, blitz }: Props) {
  // Remount per drill so internal state resets cleanly.
  return <Inner key={drill.id} drill={drill} onComplete={onComplete} blitz={blitz} />;
}

function Inner({ drill, onComplete, blitz }: Props) {
  const [done, setDone] = useState(false);
  const finish = (r: DrillResult) => {
    setDone(true);
    onComplete(r);
  };
  return (
    <div>
      <DrillHeader drill={drill} />
      {!blitz && <HowTo type={drill.drill_type} />}
      <p class="prompt">{drill.prompt_instruction}</p>
      {drill.drill_type === 'anatomical_dissection' && <Dissection drill={drill} onFinish={finish} blitz={blitz} />}
      {drill.drill_type === 'bathtub_puzzle' && <Steps drill={drill} onFinish={finish} variant="bathtub" done={done} />}
      {drill.drill_type === 'leverage_triage' && <Steps drill={drill} onFinish={finish} variant="triage" done={done} />}
      {drill.drill_type === 'isomorphic_match' && <Isomorphic drill={drill} onFinish={finish} blitz={blitz} />}
      {done && !blitz && (
        <div class="result">
          <hr class="hr" />
          <div class="eyebrow">Anatomy</div>
          <Explanation formal={drill.explanation_formal} intuitive={drill.explanation_intuitive} />
        </div>
      )}
    </div>
  );
}

// ── Choice question (shared by follow-ups and steps) ──

function LeverageBadge({ o }: { o: ChoiceOption }) {
  if (o.leverage_point == null) return null;
  const tier = o.leverage_point >= 10 ? 'low' : o.leverage_point >= 6 ? 'mid' : 'high';
  return <span class={`lp lp-${tier}`} title={`Meadows leverage point #${o.leverage_point} (12 weakest, 1 strongest)`}>#{o.leverage_point}</span>;
}

function Question({ q, onAnswer, label }: { q: ChoiceQuestion; onAnswer: (correct: boolean) => void; label?: string }) {
  const [picked, setPicked] = useState<string | null>(null);
  const options = useMemo(() => shuffle(q.options), [q]);
  return (
    <div style={{ marginTop: '16px' }}>
      {label && <div class="step-label">{label}</div>}
      <div style={{ fontWeight: 500 }}>{q.question}</div>
      <div class="options" role="list">
        {options.map((o) => {
          const cls = !picked ? '' : o.is_correct ? 'correct' : picked === o.id ? 'wrong' : 'dim';
          return (
            <div role="listitem">
              <button
                class={`option ${cls}`}
                style={{ width: '100%' }}
                disabled={!!picked}
                aria-pressed={picked === o.id}
                onClick={() => {
                  setPicked(o.id);
                  onAnswer(o.is_correct);
                }}
              >
                {picked && <LeverageBadge o={o} />}{o.text}
              </button>
              {picked && (picked === o.id || o.is_correct || o.leverage_point != null) && (
                <div class="feedback">{o.is_correct ? '✓ ' : picked === o.id ? '✗ ' : ''}{o.feedback}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Anatomical dissection ────────────────

function Dissection({ drill, onFinish, blitz }: { drill: DrillItem; onFinish: (r: DrillResult) => void; blitz?: boolean }) {
  const start = useRef(performance.now());
  const [picked, setPicked] = useState<string | null>(null);
  const [ttd, setTtd] = useState<number | undefined>();
  const segs = drill.passage_segments ?? [];
  const hit = picked === drill.correct_target_id;
  const followUp = !blitz ? drill.follow_up_question : undefined;

  const pick = (id: string) => {
    if (picked) return;
    const t = performance.now() - start.current;
    setPicked(id);
    setTtd(t);
    if (!followUp) onFinish({ score: id === drill.correct_target_id ? 1 : 0, ttd_ms: t });
  };

  return (
    <div>
      <div class="passage" aria-label="Passage: choose a sentence">
        {segs.map((s) => {
          const cls = !picked ? '' : s.id === drill.correct_target_id ? 'correct' : s.id === picked ? 'wrong' : '';
          return (
            <>
              <span
                class={`seg-span ${picked ? 'locked' : ''} ${cls}`}
                role="button"
                tabIndex={picked ? -1 : 0}
                onClick={() => pick(s.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), pick(s.id))}
                title={picked ? (s.note ?? prettyRole(s.system_role)) : undefined}
              >
                {s.text}
                {picked && <span class="role">{prettyRole(s.system_role)}</span>}
              </span>{' '}
            </>
          );
        })}
      </div>
      {picked && (
        <div class={`notice ${hit ? 'good' : 'bad'}`}>
          {hit ? 'Correct.' : 'Not quite. The highlighted green span is the target.'}
          {ttd != null && <span class="mono"> · time to detection {(ttd / 1000).toFixed(1)}s</span>}
        </div>
      )}
      {picked && followUp && (
        <Question q={followUp} label="Follow-up" onAnswer={(ok) => onFinish({ score: (hit ? 0.6 : 0) + (ok ? 0.4 : 0), ttd_ms: ttd })} />
      )}
    </div>
  );
}

// ── Bathtub puzzle & leverage triage (sequential steps) ──

function Steps({ drill, onFinish, variant, done }: { drill: DrillItem; onFinish: (r: DrillResult) => void; variant: 'bathtub' | 'triage'; done: boolean }) {
  const steps = drill.steps ?? [];
  const [answers, setAnswers] = useState<boolean[]>([]);
  const start = useRef(performance.now());
  const firstAt = useRef<number | undefined>(undefined);
  const answer = (ok: boolean) => {
    if (firstAt.current == null) firstAt.current = performance.now() - start.current;
    const next = [...answers, ok];
    setAnswers(next);
    if (next.length === steps.length) onFinish({ score: next.filter(Boolean).length / steps.length, ttd_ms: firstAt.current });
  };
  return (
    <div>
      <div class={`passage lines ${variant === 'bathtub' ? 'report' : ''}`}>
        {variant === 'bathtub' && <div class="eyebrow" style={{ marginBottom: '6px' }}>The report</div>}
        {(drill.passage_segments ?? []).map((s) => <div>{s.text}</div>)}
      </div>
      {steps.slice(0, answers.length + 1).map((s, i) => (
        <Question key={s.id} q={s} label={`Step ${i + 1} of ${steps.length} · ${s.label}`} onAnswer={i === answers.length ? answer : () => undefined} />
      ))}
      {answers.length === steps.length && (
        <div class="notice">{answers.filter(Boolean).length} of {steps.length} steps correct.</div>
      )}
      {done && variant === 'bathtub' && drill.ledger?.length ? (
        <table class="ledger" aria-label="Stock ledger">
          <caption class="eyebrow">The ledger</caption>
          <tbody>{drill.ledger.map((l) => <tr><th scope="row">{l.label}</th><td class="mono">{l.value}</td></tr>)}</tbody>
        </table>
      ) : null}
    </div>
  );
}

// ── Isomorphic match ─────────────────────

function Isomorphic({ drill, onFinish, blitz }: { drill: DrillItem; onFinish: (r: DrillResult) => void; blitz?: boolean }) {
  const start = useRef(performance.now());
  const candidates = useMemo(() => shuffle(drill.candidates ?? []), [drill]);
  const [picked, setPicked] = useState<string | null>(null);
  const [ttd, setTtd] = useState<number | undefined>();
  const followUp = !blitz ? drill.follow_up_question : undefined;
  const hit = !!candidates.find((c) => c.id === picked)?.is_correct;

  const pick = (id: string) => {
    if (picked) return;
    const t = performance.now() - start.current;
    setPicked(id);
    setTtd(t);
    const ok = !!candidates.find((c) => c.id === id)?.is_correct;
    if (!followUp) onFinish({ score: ok ? 1 : 0, ttd_ms: t });
  };

  return (
    <div>
      <div class="source-card">
        <div class="eyebrow">Source · {drill.source_narrative?.domain}</div>
        <p style={{ margin: '4px 0 0' }}>{drill.source_narrative?.text}</p>
      </div>
      <div class="eyebrow" style={{ margin: '14px 0 6px' }}>Which of these has the same skeleton?</div>
      <div class="grid grid-2 candidates">
        {candidates.map((c) => {
          const cls = !picked ? '' : c.is_correct ? 'correct' : picked === c.id ? 'wrong' : 'dim';
          return (
            <div>
              <button class={`option candidate ${cls}`} disabled={!!picked} aria-pressed={picked === c.id} onClick={() => pick(c.id)}>
                <span class="eyebrow">{c.domain}</span>
                <span style={{ display: 'block', marginTop: '4px' }}>{c.text}</span>
              </button>
              {picked && <div class="feedback">{c.is_correct ? '✓ ' : picked === c.id ? '✗ ' : ''}{c.feedback}</div>}
            </div>
          );
        })}
      </div>
      {picked && (
        <div class={`notice ${hit ? 'good' : 'bad'}`}>
          {hit ? 'Structural twin found.' : 'Not that one. The green card is the structural twin.'}
          {ttd != null && <span class="mono"> · {(ttd / 1000).toFixed(1)}s</span>}
        </div>
      )}
      {picked && followUp && (
        <Question q={followUp} label="Follow-up" onAnswer={(ok) => onFinish({ score: (hit ? 0.7 : 0) + (ok ? 0.3 : 0), ttd_ms: ttd })} />
      )}
    </div>
  );
}
