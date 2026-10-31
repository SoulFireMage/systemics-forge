import { useState } from 'preact/hooks';
import { DOMAIN_CARDS, prettyElement, SEEDS, skeletonElements, type IsomorphicPromptSeed } from '../data/forge';
import { Busy, SaveButton, ScoreBox, SelfCheck, VerdictLine } from '../components/ForgeBits';
import { Term } from '../components/Term';
import { BASE_FORBIDDEN, findJargon, jargonRuns } from '../lib/jargon';
import { judgeTransposition, sentenceCount, transpositionScore, type TranspositionGrade } from '../lib/judges';
import { shuffle } from '../lib/scheduler';
import type { NodeDelta } from '../lib/telemetry';
import { apiKey, recordOutcome, saveItem, settings } from '../state/store';

function deal(seed?: IsomorphicPromptSeed) {
  const s = seed ?? SEEDS[Math.floor(Math.random() * SEEDS.length)];
  const deck = DOMAIN_CARDS.filter((c) => c !== s.source_example.domain);
  return { seed: s, cards: shuffle(deck).slice(0, 2) };
}

function Highlighted({ text, forbidden }: { text: string; forbidden: string[] }) {
  const hits = findJargon(text, forbidden);
  if (!hits.length) return null;
  return (
    <div class="jargon-preview" aria-live="polite">
      <div class="eyebrow down">Zero-Jargon Rule: {hits.length} forbidden word{hits.length > 1 ? 's' : ''}</div>
      <p style={{ margin: '4px 0 0' }}>{jargonRuns(text, hits).map((r) => (r.hit ? <mark>{r.text}</mark> : r.text))}</p>
    </div>
  );
}

export function Transposition() {
  const [hand, setHand] = useState(() => deal());
  const [answers, setAnswers] = useState(['', '']);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [grade, setGrade] = useState<TranspositionGrade | null>(null);
  const [selfMode, setSelfMode] = useState(false);
  const [result, setResult] = useState<{ score: number; deltas: NodeDelta[]; mode: 'judge' | 'self' } | null>(null);

  const { seed, cards } = hand;
  const forbidden = seed.skeleton_spec.forbidden_words;
  const elements = skeletonElements(seed.skeleton_spec);
  const jargon = answers.map((a) => findJargon(a, forbidden));
  const counts = answers.map(sentenceCount);
  const ready = answers.every((a) => a.trim().length > 0) && jargon.every((j) => j.length === 0);

  const reset = (keepSeed = false) => {
    setHand(deal(keepSeed ? seed : undefined));
    setAnswers(['', '']); setGrade(null); setResult(null); setSelfMode(false); setError('');
  };

  const record = (scores: number[], mode: 'judge' | 'self') => {
    const weight = mode === 'judge' ? 0.5 : 0.25;
    const deltas = cards.flatMap((c, i) =>
      recordOutcome({ kind: 'forge', item_id: `transposition:${seed.id}:${c}`, nodes: seed.taxonomy_nodes, difficulty: seed.difficulty_elo, score: scores[i], weight }));
    setResult({ score: scores.reduce((a, b) => a + b, 0) / scores.length, deltas, mode });
  };

  const submit = async () => {
    if (!apiKey.value) { setSelfMode(true); return; }
    setBusy(true); setError('');
    try {
      const g = await judgeTransposition({ apiKey: apiKey.value, model: settings.value.judge_model, seed, cards, answers, forbidden });
      setGrade(g);
      record(g.cards.map(transpositionScore), 'judge');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const locked = !!grade || selfMode;

  return (
    <div>
      <div class="eyebrow"><a href="#/forge">Forge</a> · Systems “Mr. Potato Head”</div>
      <h1>Isomorphic Transposition Workbench</h1>
      <section class="panel">
        <div class="drill-head">
          <div>
            <div class="eyebrow">The skeleton</div>
            <h2 style={{ margin: '2px 0 0' }}>{seed.title}</h2>
          </div>
          {!locked && <button class="btn-quiet" onClick={() => reset()} disabled={busy}>Deal a new skeleton →</button>}
        </div>
        <div class="tags" style={{ margin: '6px 0 10px' }}>{seed.taxonomy_nodes.map((n) => <span class="tag"><Term node={n} /></span>)}</div>
        <ul class="skeleton">
          {elements.map(([k, v]) => <li><strong>{prettyElement(k)}:</strong> {v}</li>)}
        </ul>
        <div class="source-card" style={{ marginTop: '12px' }}>
          <div class="eyebrow">How it works in {seed.source_example.domain}</div>
          <p style={{ margin: '4px 0 0' }}>{seed.source_example.text}</p>
        </div>
        <p class="muted" style={{ fontSize: '0.92rem', marginTop: '12px' }}>
          Write <strong>3–5 sentences</strong> for each domain card that instantiate <em>every</em> element above in natural, realistic prose.{' '}
          <strong>Zero-Jargon Rule:</strong> no systems vocabulary. Forbidden here, with their plurals and variants: <span class="mono" style={{ fontSize: '0.8rem' }}>{[...new Set([...forbidden, ...BASE_FORBIDDEN])].join(', ')}</span>
        </p>
      </section>
      {cards.map((c, i) => (
        <section class="panel">
          <div class="drill-head">
            <h3 style={{ margin: 0 }}>Domain card {i + 1}: {c}</h3>
            <span class={`mono ${counts[i] > 5 || (answers[i].trim() && counts[i] < 3) ? 'down' : 'muted'}`}>{answers[i].trim() ? counts[i] : 0} sentence{counts[i] === 1 && answers[i].trim() ? '' : 's'}</span>
          </div>
          <textarea value={answers[i]} disabled={locked} aria-label={`Your narrative for ${c}`} style={{ minHeight: '130px' }}
            onInput={(e) => setAnswers(answers.map((a, j) => (j === i ? (e.target as HTMLTextAreaElement).value : a)))} />
          {!locked && <Highlighted text={answers[i]} forbidden={forbidden} />}
          {grade?.cards[i] && (
            <div style={{ marginTop: '10px' }}>
              {grade.cards[i].elements.map((e) => <VerdictLine label={prettyElement(e.element)} verdict={e.verdict} note={e.note} />)}
              <VerdictLine label="Realism in this domain" verdict={grade.cards[i].realism} note={grade.cards[i].realism_note} />
              {grade.cards[i].jargon_found.length > 0 && <p class="down mono" style={{ fontSize: '0.8rem' }}>Jargon: {grade.cards[i].jargon_found.join(', ')}</p>}
              <p><span class="eyebrow">Judge’s version · </span><em>{grade.cards[i].better_version}</em></p>
              <p class="mono muted" style={{ fontSize: '0.78rem' }}>Card score {Math.round(transpositionScore(grade.cards[i]) * 100)}%</p>
            </div>
          )}
        </section>
      ))}
      {error && <div class="notice bad">{error}</div>}
      {busy && <Busy label="The judge is checking the skeleton…" />}
      {!locked && (
        <div class="btn-row">
          <button class="btn-primary" disabled={!ready || busy} onClick={submit}>{apiKey.value ? 'Submit to the judge' : 'Self-check'}</button>
          <button onClick={() => reset(true)} disabled={busy}>New domain cards</button>
          {jargon.some((j) => j.length) && <span class="down mono" style={{ alignSelf: 'center', fontSize: '0.8rem' }}>Remove the highlighted jargon to submit.</span>}
        </div>
      )}
      {selfMode && !result && (
        <SelfCheck
          items={cards.flatMap((c) => [...elements.map(([k]) => `${c}: “${prettyElement(k)}” is unmistakable in my story`), `${c}: it reads as a real story from that domain`])}
          onSubmit={(s) => record(cards.map(() => s), 'self')}
        />
      )}
      {grade?.overall_comment && <div class="notice">{grade.overall_comment}</div>}
      {result && (
        <>
          <ScoreBox score={result.score} deltas={result.deltas} mode={result.mode} />
          <div class="btn-row">
            <button class="btn-primary" onClick={() => reset()}>New skeleton</button>
            <SaveButton onSave={() => saveItem({ kind: 'transposition', title: `${seed.title}: ${cards.join(' / ')}`, content: cards.map((c, i) => `${c}:\n${answers[i]}`).join('\n\n') })} />
          </div>
        </>
      )}
    </div>
  );
}
