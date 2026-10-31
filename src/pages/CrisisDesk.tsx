import { useEffect, useRef, useState } from 'preact/hooks';
import { AXIS_NODES, DESK_DOMAINS, LANDMINE_MAP, LANDMINES, PERSONAS, SCENARIOS, type DeskDomain, type Persona, type Scenario } from '../data/desk';
import { Busy } from '../components/ForgeBits';
import { Deltas } from '../components/Deltas';
import { Term } from '../components/Term';
import { arbitrate, axisFinal, AXIS_CRITERIA, opponentSystem, opponentTurn, wordCount, type AxisKey, type DeskScorecard } from '../lib/judges';
import type { ChatMessage } from '../lib/openrouter';
import { nodePriorities, shuffle } from '../lib/scheduler';
import type { NodeDelta } from '../lib/telemetry';
import type { DeskScores } from '../lib/types';
import { addDeskSession, apiKey, recordOutcome, settings, storeTranscript, telemetry, updateSettings } from '../state/store';

interface Turn { speaker: 'opponent' | 'user'; round: number; text: string; flagged?: string[] }
interface SessionConfig {
  id: string;
  mode: 'blind_autopsy' | 'targeted_calibration';
  scenario: Scenario;
  rounds: number;
  persona: Persona;
  landmines: string[];
  wordCap: number;
}

const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)];

function loadLandmines(persona: Persona, targeted: string[]): string[] {
  if (targeted.length) return targeted.slice(0, 3);
  const n = Math.random() < 0.5 ? 2 : 3;
  return shuffle(persona.favoured).slice(0, n);
}

/** Exposing and defusing are both rewarded; exposing early in blind mode earns a bonus on top. */
const landmineScore = (exposed: boolean, defused: boolean) => (exposed && defused ? 1 : defused ? 0.65 : exposed ? 0.5 : 0);

export function CrisisDesk() {
  const [config, setConfig] = useState<SessionConfig | null>(null);
  if (!apiKey.value) {
    return (
      <div>
        <div class="eyebrow">The adversarial sparring room</div>
        <h1>The Crisis Desk</h1>
        <div class="notice">The Crisis Desk needs an OpenRouter key, because the policymaker and the Chief Cyberneticist are language models. <a href="#/settings">Add your key in Settings</a>. It stays in this browser.</div>
      </div>
    );
  }
  return config ? <Session config={config} onExit={() => setConfig(null)} /> : <Setup onStart={setConfig} />;
}

// ── Pre-session configuration ─────────────────────────────

function Setup({ onStart }: { onStart: (c: SessionConfig) => void }) {
  const [mode, setMode] = useState<SessionConfig['mode']>('blind_autopsy');
  const [domain, setDomain] = useState<DeskDomain | 'any'>('any');
  const [scenarioTitle, setScenarioTitle] = useState<string>('random');
  const [custom, setCustom] = useState('');
  const [rounds, setRounds] = useState(3);
  const [personaId, setPersonaId] = useState<string>('random');
  const [targets, setTargets] = useState<string[]>([]);
  const wordCap = settings.value.word_cap;
  const pool = SCENARIOS.filter((s) => domain === 'any' || s.domain === domain);

  const weakest = () => {
    const prio = new Map(nodePriorities(telemetry.value).map((p) => [p.node, p.priority]));
    const ranked = [...LANDMINES].sort((a, b) => (prio.get(b.node) ?? 0) - (prio.get(a.node) ?? 0));
    setTargets(ranked.slice(0, 3).map((t) => t.id));
  };
  const toggle = (id: string) => setTargets(targets.includes(id) ? targets.filter((x) => x !== id) : targets.length >= 3 ? targets : [...targets, id]);

  const start = () => {
    const persona = personaId === 'random' ? pick(PERSONAS) : PERSONAS.find((p) => p.id === personaId)!;
    let scenario: Scenario = scenarioTitle === 'random' ? pick(pool) : SCENARIOS.find((s) => s.title === scenarioTitle) ?? pick(pool);
    if (custom.trim()) scenario = { domain: domain === 'any' ? scenario.domain : domain, title: 'Your scenario', problem: custom.trim() };
    onStart({
      id: `desk_${Date.now().toString(36)}`,
      mode, scenario, rounds, persona, wordCap,
      landmines: loadLandmines(persona, mode === 'targeted_calibration' ? targets : []),
    });
  };

  return (
    <div>
      <div class="eyebrow">The adversarial sparring room</div>
      <h1>The Crisis Desk</h1>
      <p class="muted" style={{ maxWidth: '65ch' }}>
        Across the desk sits a Linear Interventionist: a persuasive policymaker pitching a common-sense “fix” built on two or three
        hidden systemic landmines. Diagnose them before the policy is ratified. The Chief Cyberneticist scores you on five axes when it’s over.
      </p>
      <section class="panel">
        <h3>Sparring mode</h3>
        <div class="seg" role="group" aria-label="Sparring mode">
          <button aria-pressed={mode === 'blind_autopsy'} onClick={() => setMode('blind_autopsy')}>Blind Autopsy</button>
          <button aria-pressed={mode === 'targeted_calibration'} onClick={() => setMode('targeted_calibration')}>Targeted Calibration</button>
        </div>
        <p class="muted" style={{ fontSize: '0.92rem', marginTop: '8px' }}>
          {mode === 'blind_autopsy'
            ? 'You won’t know which landmines are loaded until the debrief. Expose them during the session, in your words or with the private flags, for bonus rating.'
            : 'Choose up to three landmines to be tested on, or let your telemetry pick your weakest and most decayed skills. You still have to spot them.'}
        </p>
        {mode === 'targeted_calibration' && (
          <>
            <div class="btn-row" style={{ marginTop: 0, marginBottom: '8px' }}><button onClick={weakest}>Choose from my weakest skills</button></div>
            <div class="tags">
              {LANDMINES.map((t) => (
                <button class="tag" aria-pressed={targets.includes(t.id)} onClick={() => toggle(t.id)} title={t.instruction}
                  style={targets.includes(t.id) ? { background: 'var(--brass-soft)', borderColor: 'var(--brass)' } : undefined}>
                  {t.label}
                </button>
              ))}
            </div>
          </>
        )}
      </section>
      <section class="panel">
        <h3>The brief</h3>
        <div class="grid grid-2">
          <div class="field">
            <label for="domain">Domain</label>
            <select id="domain" value={domain} onChange={(e) => { setDomain((e.target as HTMLSelectElement).value as DeskDomain | 'any'); setScenarioTitle('random'); }}>
              <option value="any">Any domain</option>
              {DESK_DOMAINS.map((d) => <option value={d}>{d}</option>)}
            </select>
          </div>
          <div class="field">
            <label for="scenario">Crisis</label>
            <select id="scenario" value={scenarioTitle} onChange={(e) => setScenarioTitle((e.target as HTMLSelectElement).value)}>
              <option value="random">Random crisis</option>
              {pool.map((s) => <option value={s.title}>{s.title}</option>)}
            </select>
          </div>
        </div>
        {scenarioTitle !== 'random' && <p class="muted" style={{ fontSize: '0.92rem', marginTop: 0 }}>{SCENARIOS.find((s) => s.title === scenarioTitle)?.problem}</p>}
        <div class="field">
          <label for="custom">…or describe your own crisis</label>
          <input id="custom" type="text" value={custom} placeholder="A chronic problem someone wants a quick fix for…" onInput={(e) => setCustom((e.target as HTMLInputElement).value)} />
        </div>
        <div class="grid grid-3">
          <div>
            <label>Exchanges</label>
            <div class="seg" role="group" aria-label="Exchanges">
              {[3, 4, 5].map((n) => <button aria-pressed={rounds === n} onClick={() => setRounds(n)}>{n}</button>)}
            </div>
          </div>
          <div>
            <label for="cap">Word ceiling per turn</label>
            <input id="cap" type="number" min={60} max={300} step={10} value={wordCap} style={{ maxWidth: '110px' }}
              onChange={(e) => updateSettings({ word_cap: Math.max(60, Math.min(300, Number((e.target as HTMLInputElement).value) || 130)) })} />
          </div>
          <div class="field" style={{ margin: 0 }}>
            <label for="persona">Opponent</label>
            <select id="persona" value={personaId} onChange={(e) => setPersonaId((e.target as HTMLSelectElement).value)}>
              <option value="random">Random Interventionist</option>
              {PERSONAS.map((p) => <option value={p.id}>{p.name} ({p.difficulty})</option>)}
            </select>
          </div>
        </div>
        {personaId !== 'random' && <p class="muted" style={{ fontSize: '0.9rem', marginTop: '6px' }}>{PERSONAS.find((p) => p.id === personaId)?.description}</p>}
        <div class="btn-row">
          <button class="btn-primary" onClick={start} disabled={mode === 'targeted_calibration' && targets.length === 0}>Take your seat</button>
        </div>
        <p class="muted mono" style={{ fontSize: '0.72rem', marginTop: '10px' }}>Policymaker: {settings.value.opponent_model} · Chief Cyberneticist: {settings.value.judge_model}</p>
      </section>
    </div>
  );
}

// ── The session ───────────────────────────────────────────

function Session({ config, onExit }: { config: SessionConfig; onExit: () => void }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState('');
  const [flags, setFlags] = useState<string[]>([]);
  const [busy, setBusy] = useState<string>('');
  const [error, setError] = useState('');
  const [card, setCard] = useState<DeskScorecard | null>(null);
  const [deltas, setDeltas] = useState<NodeDelta[]>([]);
  const abort = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const userTurns = turns.filter((t) => t.speaker === 'user').length;
  const round = Math.min(config.rounds, userTurns + 1);
  const awaitingUser = turns.length > 0 && turns[turns.length - 1].speaker === 'opponent';
  const finished = userTurns >= config.rounds;
  const words = wordCount(draft);

  const history = (ts: Turn[]): ChatMessage[] => [
    { role: 'user', content: '(The chair invites the policymaker to present the proposal.)' },
    ...ts.map<ChatMessage>((t) => ({ role: t.speaker === 'opponent' ? 'assistant' : 'user', content: t.text })),
  ];

  const opponentMove = async (ts: Turn[], r: number) => {
    abort.current = new AbortController();
    setBusy('The policymaker is responding…'); setError('');
    try {
      const system = opponentSystem({
        personaName: config.persona.name, personaVoice: config.persona.voice, domain: config.scenario.domain, problem: config.scenario.problem,
        round: r, rounds: config.rounds, landmineInstructions: config.landmines.map((id) => LANDMINE_MAP[id].instruction), wordCap: config.wordCap,
      });
      const text = await opponentTurn({ apiKey: apiKey.value, model: settings.value.opponent_model, system, history: history(ts), signal: abort.current.signal });
      setTurns([...ts, { speaker: 'opponent', round: r, text: text.trim() }]);
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setError((e as Error).message);
    } finally {
      setBusy('');
    }
  };

  useEffect(() => {
    void opponentMove([], 1);
    return () => abort.current?.abort();
  }, []);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), [turns.length, busy]);

  const judge = async (ts: Turn[]) => {
    abort.current = new AbortController();
    setBusy('The Chief Cyberneticist is reviewing the session…'); setError('');
    try {
      const sc = await arbitrate({
        apiKey: apiKey.value, model: settings.value.judge_model, domain: config.scenario.domain, problem: config.scenario.problem,
        transcript: ts, landmines: config.landmines, signal: abort.current.signal,
      });
      setCard(sc);
      finalise(ts, sc);
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setError((e as Error).message);
    } finally {
      setBusy('');
    }
  };

  const finalise = (ts: Turn[], sc: DeskScorecard) => {
    const scores: DeskScores = {
      stock_flow_delay: axisFinal(sc.stock_flow_delay), loop_archetype: axisFinal(sc.loop_archetype),
      boundary_posiwid: axisFinal(sc.boundary_posiwid), leverage: axisFinal(sc.leverage), clarity: axisFinal(sc.clarity),
    };
    const difficulty = config.persona.difficulty;
    const all: NodeDelta[] = [];
    for (const [axis, nodes] of Object.entries(AXIS_NODES)) {
      all.push(...recordOutcome({ kind: 'desk', item_id: `${config.id}:${axis}`, nodes, score: scores[axis as keyof DeskScores] / 100, difficulty, weight: 0.5, opponentRd: 120 }));
    }
    const flaggedRound = new Map<string, number>();
    for (const t of ts) for (const f of t.flagged ?? []) if (!flaggedRound.has(f)) flaggedRound.set(f, t.round);
    const exposed: string[] = [];
    const early: string[] = [];
    for (const id of config.landmines) {
      const f = sc.landmines.find((x) => x.landmine_id === id);
      const firstRound = Math.min(flaggedRound.get(id) ?? Infinity, f?.exposed_by_user && f.first_exposed_round > 0 ? f.first_exposed_round : Infinity);
      const isExposed = Number.isFinite(firstRound) || !!f?.exposed_by_user;
      if (isExposed) exposed.push(id);
      // "Before ratification" = exposed before the closing exchange, while the policy could still be stopped.
      if (Number.isFinite(firstRound) && firstRound < config.rounds) early.push(id);
      const node = LANDMINE_MAP[id].node;
      all.push(...recordOutcome({ kind: 'desk', item_id: `${config.id}:${id}`, nodes: [node], score: landmineScore(isExposed, !!f?.defused), difficulty, weight: 0.5, opponentRd: 120 }));
      if (config.mode === 'blind_autopsy' && early.includes(id)) {
        all.push(...recordOutcome({ kind: 'desk', item_id: `${config.id}:${id}:bonus`, nodes: [node], score: 1, difficulty, weight: 0.25, opponentRd: 120 }));
      }
    }
    setDeltas(all);
    addDeskSession({
      session_id: config.id, date: new Date().toISOString(), mode: config.mode, domain: config.scenario.domain, scenario: config.scenario.title,
      persona: config.persona.name, hidden_landmines: config.landmines, exposed_landmines: exposed, exposed_before_ratification: early,
      scores, verdict: sc.policy_outcome,
    });
    storeTranscript({ session_id: config.id, turns: ts, scorecard: sc });
  };

  const send = async () => {
    const next = [...turns, { speaker: 'user' as const, round, text: draft.trim(), flagged: flags.length ? flags : undefined }];
    setTurns(next);
    setDraft('');
    setFlags([]);
    if (next.filter((t) => t.speaker === 'user').length >= config.rounds) await judge(next);
    else await opponentMove(next, round + 1);
  };

  const retry = () => (finished ? judge(turns) : opponentMove(turns, turns.filter((t) => t.speaker === 'opponent').length + 1));

  return (
    <div>
      <div class="drill-head">
        <div>
          <div class="eyebrow">{config.mode === 'blind_autopsy' ? 'Blind Autopsy' : 'Targeted Calibration'} · {config.scenario.domain} · Exchange {round} of {config.rounds}</div>
          <h2 style={{ margin: '4px 0' }}>{config.scenario.title}</h2>
          <div class="muted" style={{ fontSize: '0.95rem' }}>{config.scenario.problem} · vs {config.persona.name}</div>
        </div>
        <button class="btn-quiet" onClick={() => { abort.current?.abort(); onExit(); }}>{card ? 'New session' : 'Leave the desk'}</button>
      </div>

      <div class="transcript" aria-live="polite">
        {turns.map((t) => (
          <div class={`turn ${t.speaker}`}>
            <div class="who">{t.speaker === 'opponent' ? config.persona.name : 'You'} · exchange {t.round}
              {t.flagged && <span> · flagged: {t.flagged.map((f) => LANDMINE_MAP[f]?.label).join(', ')}</span>}
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{t.text}</div>
          </div>
        ))}
      </div>
      <div ref={endRef} />
      {busy && <Busy label={busy} />}
      {error && (
        <div class="notice bad">{error} <button style={{ marginLeft: '8px' }} onClick={retry}>Retry</button></div>
      )}

      {awaitingUser && !finished && !busy && (
        <section class="panel" style={{ marginTop: '16px' }}>
          <div class="drill-head">
            <label for="reply">Your reply, exchange {round}{round === config.rounds ? ' (last chance before ratification)' : ''}</label>
            <span class={`mono ${words > config.wordCap ? 'down' : 'muted'}`}>{words} / {config.wordCap} words</span>
          </div>
          <textarea id="reply" value={draft} style={{ minHeight: '130px' }} onInput={(e) => setDraft((e.target as HTMLTextAreaElement).value)} />
          <details style={{ marginTop: '10px' }}>
            <summary class="mono" style={{ fontSize: '0.8rem', cursor: 'pointer' }}>
              Flag a landmine you’ve spotted in the policy{flags.length ? ` (${flags.length})` : ''}
            </summary>
            <div class="tags" style={{ marginTop: '8px' }}>
              {LANDMINES.map((t) => (
                <button class="tag" aria-pressed={flags.includes(t.id)} onClick={() => setFlags(flags.includes(t.id) ? flags.filter((f) => f !== t.id) : [...flags, t.id])}
                  style={flags.includes(t.id) ? { background: 'var(--brass-soft)', borderColor: 'var(--brass)' } : undefined}>
                  {t.label}
                </button>
              ))}
            </div>
            <p class="muted" style={{ fontSize: '0.82rem' }}>Flags are private to the Chief Cyberneticist. Exposing a flaw in your own words counts too, and is usually more persuasive.</p>
          </details>
          <div class="btn-row">
            <button class="btn-primary" disabled={!draft.trim() || words > config.wordCap} onClick={send}>
              {userTurns + 1 >= config.rounds ? 'Deliver final response & call the vote' : 'Respond'}
            </button>
          </div>
        </section>
      )}

      {card && <ScorecardView card={card} config={config} deltas={deltas} turns={turns} />}
    </div>
  );
}

function ScorecardView({ card, config, deltas, turns }: { card: DeskScorecard; config: SessionConfig; deltas: NodeDelta[]; turns: Turn[] }) {
  const axes = Object.entries(AXIS_CRITERIA) as [AxisKey, (typeof AXIS_CRITERIA)[AxisKey]][];
  const outcome = card.policy_outcome === 'blocked' ? 'Policy blocked' : card.policy_outcome === 'amended' ? 'Policy sent back for amendment' : 'Policy ratified as pitched';
  const flagged = new Set(turns.flatMap((t) => t.flagged ?? []));
  return (
    <section class="panel" style={{ marginTop: '18px' }}>
      <div class="eyebrow">The Crisis Desk Scorecard</div>
      <h2>{outcome}</h2>
      <p class="muted">{card.outcome_reason}</p>
      {axes.map(([key, def]) => {
        const a = card[key];
        const score = axisFinal(a);
        return (
          <div style={{ marginBottom: '12px' }}>
            <div class="axis">
              <span>{def.title}</span>
              <div class="bar"><i style={{ width: `${score}%` }} /></div>
              <span class="mono" style={{ textAlign: 'right' }}>{score}</span>
            </div>
            <ul class="checks">{def.checks.map((c, i) => <li class={a.checks[i] ? 'met' : ''}>{c}</li>)}</ul>
            {a.evidence && <div class="feedback" style={{ marginTop: '-6px' }}><em>{a.evidence}</em></div>}
          </div>
        );
      })}
      <p class="muted mono" style={{ fontSize: '0.72rem' }}>Each axis blends the arbiter’s 0–100 score with its own checklist (half each), to damp noisy grading.</p>
      <hr class="hr" />
      <h3>The hidden landmines</h3>
      {config.landmines.map((id) => {
        const f = card.landmines.find((x) => x.landmine_id === id);
        const exposed = !!f?.exposed_by_user || flagged.has(id);
        return (
          <div style={{ marginBottom: '8px' }}>
            <strong>{LANDMINE_MAP[id].label}</strong> <span class="tag"><Term node={LANDMINE_MAP[id].node} /></span>
            <div class="mono" style={{ fontSize: '0.78rem' }}>
              <span class={exposed ? 'up' : 'down'}>{exposed ? `✓ exposed${f?.first_exposed_round ? ` (exchange ${f.first_exposed_round})` : ''}` : '✗ not exposed'}</span> ·{' '}
              <span class={f?.defused ? 'up' : 'down'}>{f?.defused ? '✓ defused' : '✗ not defused'}</span>
            </div>
            {f?.note && <div class="feedback">{f.note}</div>}
          </div>
        );
      })}
      <hr class="hr" />
      <p><strong>Key moment:</strong> {card.key_moment}</p>
      <p><strong>Top improvement:</strong> {card.top_improvement}</p>
      <p class="mono" style={{ fontSize: '0.8rem' }}>Unexplained buzzwords counted: {card.jargon_count}</p>
      {config.mode === 'blind_autopsy' && <p class="muted" style={{ fontSize: '0.85rem' }}>Blind bonus: landmines exposed before the final exchange earn an extra rating boost.</p>}
      <Deltas deltas={deltas} />
    </section>
  );
}
