import { useState } from 'preact/hooks';
import { UPGRADES } from '../data/forge';
import { Busy, SaveButton, ScoreBox, SelfCheck, VerdictLine } from '../components/ForgeBits';
import { Term } from '../components/Term';
import { judgeUpgrade, sentenceCount, upgradeScore, type UpgradeGrade } from '../lib/judges';
import type { NodeDelta } from '../lib/telemetry';
import { apiKey, recordOutcome, saveItem, settings } from '../state/store';

const DIFFICULTY = 1400;

export function Upgrade() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * UPGRADES.length));
  const item = UPGRADES[idx];
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [grade, setGrade] = useState<UpgradeGrade | null>(null);
  const [selfMode, setSelfMode] = useState(false);
  const [result, setResult] = useState<{ score: number; deltas: NodeDelta[]; mode: 'judge' | 'self' } | null>(null);
  const sentences = answer.trim() ? sentenceCount(answer) : 0;

  const next = () => { setIdx((idx + 1) % UPGRADES.length); setAnswer(''); setGrade(null); setResult(null); setSelfMode(false); setError(''); };

  const record = (score: number, mode: 'judge' | 'self') => {
    const deltas = recordOutcome({ kind: 'forge', item_id: item.id, nodes: item.nodes, difficulty: DIFFICULTY, score, weight: mode === 'judge' ? 0.5 : 0.25 });
    setResult({ score, deltas, mode });
  };

  const submit = async () => {
    if (!apiKey.value) { setSelfMode(true); return; }
    setBusy(true); setError('');
    try {
      const g = await judgeUpgrade({ apiKey: apiKey.value, model: settings.value.judge_model, item, answer });
      setGrade(g);
      record(upgradeScore(g, sentences), 'judge');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const locked = !!grade || selfMode;

  return (
    <div>
      <div class="eyebrow"><a href="#/forge">Forge</a> · Intervention rewrite</div>
      <h1>The Leverage Upgrade</h1>
      <section class="panel">
        <div class="drill-head"><h3 style={{ margin: 0 }}>{item.title}</h3>{!locked && <button class="btn-quiet" onClick={next} disabled={busy}>Another proposal →</button>}</div>
        <blockquote class="statement">{item.proposal}</blockquote>
        <p style={{ marginTop: '14px' }}>Rewrite the intervention in <strong>2–3 sentences</strong>:</p>
        <ul style={{ marginTop: 0 }}>
          <li>strip out the low-leverage parameter and punishment tweaks (#12);</li>
          <li>replace them with a <em>specific</em> structural redesign targeting <strong>buffers (#11)</strong>, <strong>information flows (#6)</strong> or <strong>rules &amp; incentives (#5)</strong>;</li>
          <li>aim at the real constraint, not the valve where the symptom shows up.</li>
        </ul>
      </section>
      <section class="panel">
        <div class="drill-head"><label for="up-answer">Your upgrade</label><span class={`mono ${sentences > 3 ? 'down' : 'muted'}`}>{sentences} sentence{sentences === 1 ? '' : 's'}</span></div>
        <textarea id="up-answer" value={answer} disabled={locked} style={{ minHeight: '120px' }} onInput={(e) => setAnswer((e.target as HTMLTextAreaElement).value)} />
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
          <VerdictLine label="Low-leverage tweaks removed" verdict={grade.removed_low_leverage} note={grade.removed_note} />
          <VerdictLine label={`Structural target (${grade.target_level})`} verdict={grade.structural_target} note={grade.target_note} />
          <VerdictLine label="Acts on the binding constraint" verdict={grade.addresses_constraint} note={grade.constraint_note} />
          <VerdictLine label="Specific enough to implement" verdict={grade.specificity} note={grade.specificity_note} />
          {sentences > 3 && <p class="down mono" style={{ fontSize: '0.8rem' }}>More than 3 sentences: 10% penalty.</p>}
          <p><span class="eyebrow">Judge’s version · </span><em>{grade.better_version}</em></p>
        </section>
      )}
      {locked && (
        <section class="panel">
          <div class="eyebrow">Reference upgrade</div>
          <p><em>{item.exemplar}</em></p>
          <dl class="ref">
            <dt>Low leverage in the original</dt><dd>{item.low_leverage.join('; ')}</dd>
            <dt>The real constraint</dt><dd>{item.binding_constraint}</dd>
          </dl>
          <div class="tags">{item.nodes.map((d) => <span class="tag"><Term node={d} /></span>)}</div>
        </section>
      )}
      {selfMode && !result && (
        <SelfCheck
          items={['I removed every fine, quota and budget tweak', 'My replacement changes a buffer, an information flow or a rule', 'It acts on the real constraint, not where the symptom appears', 'Someone could implement it from what I wrote', 'It is 2–3 sentences']}
          onSubmit={(s) => record(s, 'self')}
        />
      )}
      {result && (
        <>
          <ScoreBox score={result.score} deltas={result.deltas} mode={result.mode} />
          <div class="btn-row">
            <button class="btn-primary" onClick={next}>Next proposal</button>
            <SaveButton onSave={() => saveItem({ kind: 'upgrade', title: item.title, content: answer })} />
          </div>
        </>
      )}
    </div>
  );
}
