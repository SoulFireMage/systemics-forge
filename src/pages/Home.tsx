import { useState } from 'preact/hooks';
import { WINGS } from '../data/taxonomy';
import { allDrills, apiKey, profile, telemetry } from '../state/store';

const WELCOME_KEY = 'sf.welcome_dismissed';
const readDismissed = () => {
  try {
    return localStorage.getItem(WELCOME_KEY) === '1';
  } catch {
    return false;
  }
};

function Welcome({ onDismiss }: { onDismiss: () => void }) {
  return (
    <section class="panel welcome" aria-label="Start here">
      <div class="drill-head">
        <div class="eyebrow">New here? Start with these three steps</div>
        <button class="btn-quiet" onClick={onDismiss} aria-label="Dismiss welcome">Dismiss ✕</button>
      </div>
      <ol class="steps">
        <li>
          <strong>Try one drill</strong>
          <span class="muted">One minute: spot where a report mistakes a slower tap for a draining bath.</span>
          <a class="btn btn-primary" href="#/drill/sys_w1_0018">First drill</a>
        </li>
        <li>
          <strong>Run a Daily Calibration</strong>
          <span class="muted">Eight mixed drills that map your strengths across all four wings.</span>
          <a class="btn" href="#/calibrate">Calibrate</a>
        </li>
        <li>
          <strong>Read the Guide</strong>
          <span class="muted">Ten minutes: drill types, the Forge, the Crisis Desk, and how ratings work.</span>
          <a class="btn" href="#/guide">Open the Guide</a>
        </li>
      </ol>
    </section>
  );
}

export function Home() {
  const t = telemetry.value;
  const attempts = t.attempt_log.length;
  const [dismissed, setDismissed] = useState(readDismissed);
  const dismiss = () => {
    try {
      localStorage.setItem(WELCOME_KEY, '1');
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };
  return (
    <div>
      {!dismissed && attempts < 10 && <Welcome onDismiss={dismiss} />}
      <section class="panel" style={{ padding: '28px 24px' }}>
        <div class="eyebrow">A training hall for systems thinking</div>
        <h1 style={{ fontSize: '2.3rem', margin: '6px 0 10px' }}>Read the story. See the plumbing.</h1>
        <p style={{ maxWidth: '62ch' }}>
          Drills that build one reflex: reading a messy, event-by-event narrative and seeing what accumulates, what drains it, where the
          delays hide, which loops close, and where the real leverage is. Then test it against a persuasive policymaker with a loaded “fix”.
        </p>
        <div class="btn-row">
          <a class="btn btn-primary" href="#/calibrate">Daily Calibration Run</a>
          <a class="btn" href="#/train">Browse {allDrills.value.length} drills</a>
          <a class="btn" href="#/blitz">Blitz</a>
          <a class="btn btn-quiet" href="#/guide">How it works →</a>
        </div>
        <div class="stats" style={{ marginTop: '22px' }}>
          <div class="stat"><div class="n">{t.global_elo}</div><div class="l">Overall rating</div></div>
          <div class="stat"><div class="n">{attempts}</div><div class="l">Attempts logged</div></div>
          <div class="stat"><div class="n">{t.desk_history.length}</div><div class="l">Crisis Desk sessions</div></div>
        </div>
      </section>

      <div class="grid grid-3">
        <a class="card" href="#/train" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div class="eyebrow">Tier 1 · free, offline</div>
          <h3>Deterministic drills</h3>
          <p class="grow muted">Anatomical dissection, bathtub puzzles, isomorphic matches and leverage triage. Instant, exact feedback.</p>
        </a>
        <a class="card" href="#/forge" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div class="eyebrow">Tier 2 · your OpenRouter key</div>
          <h3>The Generative Forge</h3>
          <p class="grow muted">Isomorphic transposition under the zero-jargon rule, POSIWID autopsies and leverage upgrades, judged against strict rubrics.</p>
        </a>
        <a class="card" href="#/desk" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div class="eyebrow">The sparring room</div>
          <h3>The Crisis Desk</h3>
          <p class="grow muted">A Linear Interventionist pitches a fix with hidden landmines. Expose them before it’s ratified; a Chief Cyberneticist scores five axes.</p>
        </a>
      </div>

      <section class="panel" style={{ marginTop: '18px' }}>
        <h2>The four wings</h2>
        <div class="grid grid-2">
          {WINGS.map((w) => (
            <div>
              <div class="eyebrow">Wing {w.numeral}</div>
              <h3 style={{ margin: '2px 0' }}>{w.title}</h3>
              <p class="muted" style={{ margin: 0 }}>{w.focus}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '16px' }}><a href="#/codex">Open the Codex</a> for every skill node, with formal and intuitive names and source notes.</p>
      </section>

      <p class="muted" style={{ fontSize: '0.9rem' }}>
        Progress is saved in this browser.{' '}
        {profile.value ? 'Signed in, so it also syncs to your account.' : <><a href="#/account">Sign in</a> to sync across devices.</>}{' '}
        {!apiKey.value && <>The Forge and the Crisis Desk need an <a href="#/settings">OpenRouter key</a>; it never leaves this browser except to call OpenRouter.</>}
      </p>
    </div>
  );
}
