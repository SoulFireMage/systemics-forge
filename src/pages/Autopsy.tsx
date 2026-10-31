import { useState } from 'preact/hooks';
import { AUTOPSIES, AUTOPSY_LIMIT } from '../data/forge';
import { Busy, SaveButton, ScoreBox, SelfCheck, VerdictLine } from '../components/ForgeBits';
import { Term } from '../components/Term';
import { autopsyScore, judgeAutopsy, wordCount, type AutopsyGrade } from '../lib/judges';
import type { NodeDelta } from '../lib/telemetry';
import { apiKey, recordOutcome, saveItem, settings } from '../state/store';

const DIFFICULTY = 1400;

export function Autopsy() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * AUTOPSIES.length));
  const item = AUTOPSIES[idx];
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [grade, setGrade] = useState<AutopsyGrade | null>(null);
  const [selfMode, setSelfMode] = useState(false);
  const [result, setResult] = useState<{ score: number; deltas: NodeDelta[]; mode: 'judge' | 'self' } | null>(null);
  const words = wordCount(answer);

  const next = () => { setIdx((idx + 1) % AUTOPSIES.length); setAnswer(''); setGrade(null); setResult(null); setSelfMode(false); setError(''); };

  const record = (score: number, mode: 'judge' | 'self') => {
    const deltas = recordOutcome({ kind: 'forge', item_id: item.id, nodes: item.nodes, difficulty: DIFFICULTY, score, weight: mode === 'judge' ? 0.5 : 0.25 });
    setResult({ score, deltas, mode });
  };

  const submit = async () => {
    if (!apiKey.value) { setSelfMode(true); return; }
    setBusy(true); setError('');
    try {
      const g = await judgeAutopsy({ apiKey: apiKey.value, model: settings.value.judge_model, item, answer, limit: AUTOPSY_LIMIT });
      setGrade(g);
      record(autopsyScore(g, words, AUTOPSY_LIMIT), 'judge');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const locked = !!grade || selfMode;

  return (
    <div>
      <div class="eyebrow"><a href="#/forge">Forge</a> · Watch the output</div>
      <h1>The POSIWID &amp; Iceberg Autopsy</h1>
      <section class="panel">
        <div class="drill-head"><h3 style={{ margin: 0 }}>{item.title}</h3>{!locked && <button class="btn-quiet" onClick={next} disabled={busy}>Another statement →</button>}</div>
        <blockquote class="statement">{item.statement}</blockquote>
        <p style={{ marginTop: '14px' }}>In <strong>under {AUTOPSY_LIMIT} words</strong>:</p>
        <ol style={{ marginTop: 0 }}>
          <li>state the system’s <strong>true purpose</strong> under POSIWID: what it reliably produces, not what it says it wants;</li>
          <li>trace the <strong>perverse loop</strong> that connects the measure to the behaviour, as a closed chain;</li>
          <li>name the <strong>unstated mental model</strong> keeping the broken rule alive.</li>
        </ol>
      </section>
      <section class="panel">
        <div class="drill-head"><label for="au-answer">Your autopsy</label><span class={`mono ${words > AUTOPSY_LIMIT ? 'down' : 'muted'}`}>{words} / {AUTOPSY_LIMIT} words</span></div>
        <textarea id="au-answer" value={answer} disabled={locked} style={{ minHeight: '140px' }} onInput={(e) => setAnswer((e.target as HTMLTextAreaElement).value)} />
        {!locked && (
          <div class="btn-row">
            <button class="btn-primary" disabled={!answer.trim() || busy} onClick={submit}>{apiKey.value ? 'Submit to the judge' : 'Compare & self-check'}</button>
          </div>
        )}
      </section>
      {error && <div class="notice bad">{error}</div>}
      {busy && <Busy label="The judge is reading…" />}
      {grade && (
        <section class="panel">
          <VerdictLine label="True purpose (POSIWID)" verdict={grade.purpose} note={grade.purpose_note} />
          <VerdictLine label="Perverse loop traced and closed" verdict={grade.loop_traced} note={grade.loop_note} />
          <VerdictLine label="Unstated mental model" verdict={grade.mental_model} note={grade.mental_model_note} />
          {words > AUTOPSY_LIMIT && <p class="down mono" style={{ fontSize: '0.8rem' }}>Over {AUTOPSY_LIMIT} words: 15% penalty.</p>}
          <p><span class="eyebrow">Judge’s version · </span><em>{grade.better_version}</em></p>
        </section>
      )}
      {locked && (
        <section class="panel">
          <div class="eyebrow">Reference autopsy</div>
          <p><em>{item.exemplar}</em></p>
          <dl class="ref">
            <dt>Purpose</dt><dd>{item.true_purpose}</dd>
            <dt>Loop</dt><dd>{item.perverse_loop}</dd>
            <dt>Mental model</dt><dd>{item.mental_model}</dd>
          </dl>
          <div class="tags">{item.nodes.map((d) => <span class="tag"><Term node={d} /></span>)}</div>
        </section>
      )}
      {selfMode && !result && (
        <SelfCheck
          items={['I stated a purpose read from the outputs, not the mission statement', 'My loop closes: its last link feeds back to its first', 'I named a belief, not just a behaviour', `It is under ${AUTOPSY_LIMIT} words`]}
          onSubmit={(s) => record(s, 'self')}
        />
      )}
      {result && (
        <>
          <ScoreBox score={result.score} deltas={result.deltas} mode={result.mode} />
          <div class="btn-row">
            <button class="btn-primary" onClick={next}>Next statement</button>
            <SaveButton onSave={() => saveItem({ kind: 'autopsy', title: item.title, content: answer })} />
          </div>
        </>
      )}
    </div>
  );
}
