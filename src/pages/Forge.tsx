import { apiKey, settings, telemetry } from '../state/store';

export function Forge() {
  const saved = telemetry.value.saved_items;
  return (
    <div>
      <div class="eyebrow">Tier 2 · BYOK OpenRouter evaluation</div>
      <h1>The Generative Forge</h1>
      <p class="muted" style={{ maxWidth: '65ch' }}>
        Free-form analysis and translation, judged against strict, checklist-based rubrics. The score is computed from the checklist rather
        than taken from the model as a free number, and Forge results move your ratings at half weight, because AI judges are noisier than
        right-or-wrong drills.
      </p>
      {!apiKey.value ? (
        <div class="notice">No OpenRouter key is set, so the Forge runs in <strong>self-check mode</strong>: you compare your work with a reference answer and tick a checklist (quarter-weight ratings). <a href="#/settings">Add a key</a> for AI judging.</div>
      ) : (
        <div class="notice good">Judging with <code>{settings.value.judge_model}</code>. Change it in <a href="#/settings">Settings</a>.</div>
      )}
      <div class="grid grid-3">
        <a class="card" href="#/forge/transposition" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div class="eyebrow">Systems “Mr. Potato Head”</div>
          <h3>Isomorphic Transposition</h3>
          <p class="grow muted">One systemic skeleton, two random domain cards. Write each story so the structure is unmistakable, with zero jargon.</p>
        </a>
        <a class="card" href="#/forge/autopsy" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div class="eyebrow">Watch the output</div>
          <h3>POSIWID &amp; Iceberg Autopsy</h3>
          <p class="grow muted">A self-justifying statement about a “surprising failure”. In 80 words: true purpose, perverse loop, hidden mental model.</p>
        </a>
        <a class="card" href="#/forge/upgrade" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div class="eyebrow">Intervention rewrite</div>
          <h3>The Leverage Upgrade</h3>
          <p class="grow muted">Strip the fines and quotas out of a low-leverage policy and replace them with a structural redesign.</p>
        </a>
      </div>
      {saved.length > 0 && (
        <section class="panel" style={{ marginTop: '18px' }}>
          <h2>Saved pieces</h2>
          {[...saved].reverse().map((s) => (
            <details style={{ borderBottom: '1px solid var(--rule)', padding: '6px 0' }}>
              <summary>{s.title} <span class="muted mono" style={{ fontSize: '0.72rem' }}>{s.kind} · {new Date(s.date).toLocaleDateString()}</span></summary>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--serif)' }}>{s.content}</pre>
            </details>
          ))}
        </section>
      )}
    </div>
  );
}
