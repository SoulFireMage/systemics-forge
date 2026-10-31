import { Dual } from '../components/Term';

const FIRST_DRILL = '#/drill/sys_w1_0018';

const toc = [
  ['start', 'Start here'],
  ['wings', 'What you’re training'],
  ['drills', 'The four drill types'],
  ['sessions', 'Calibration & Blitz'],
  ['forge', 'The Generative Forge'],
  ['desk', 'The Crisis Desk'],
  ['leverage', 'About the leverage numbers'],
  ['ratings', 'Ratings & readiness'],
  ['registers', 'Formal and intuitive names'],
  ['data', 'Your data, keys & costs'],
] as const;

const jump = (id: string) => (e: Event) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export function Guide() {
  return (
    <div>
      <div class="eyebrow">Guide</div>
      <h1>How to use the Forge</h1>
      <p class="muted" style={{ maxWidth: '65ch' }}>
        A field manual: read it front to back in ten minutes, or jump to the part you need.
      </p>
      <nav class="panel" aria-label="Guide contents">
        <div class="tags">{toc.map(([id, label]) => <a class="tag" href={`#/guide`} onClick={jump(id)}>{label}</a>)}</div>
      </nav>

      <section class="panel" id="start">
        <h2>Start here</h2>
        <p>
          The whole app trains one reflex: reading an ordinary, event-by-event story (a news report, a policy pitch, a post-mortem) and
          seeing the plumbing underneath: what is piling up, what is filling and draining it, which delays fool people, which loops close, and
          which incentives are perverse.
        </p>
        <ol>
          <li><strong>Try one drill.</strong> <a href={FIRST_DRILL}>This one</a> takes a minute: spot where a report mistakes a slower tap for a draining bath.</li>
          <li><strong>Run a Daily Calibration.</strong> Eight mixed drills chosen for you. The first few runs map your strengths across all four wings.</li>
          <li><strong>Look at Telemetry.</strong> You’ll see a rating per skill and which ones need revisiting.</li>
          <li><strong>When you want to write, not just spot,</strong> open the Forge. When you want to argue against a persuasive policymaker, take a seat at the Crisis Desk. Both work best with an OpenRouter key (see <a href="#/guide" onClick={jump('data')}>below</a>).</li>
        </ol>
        <a class="btn btn-primary" href={FIRST_DRILL}>Try the first drill</a>
      </section>

      <section class="panel" id="wings">
        <h2>What you’re training</h2>
        <p>Every exercise maps onto one skill tree with four wings. Each skill (a <em>node</em>) has its own rating.</p>
        <ul>
          <li><strong>I. The Atomic Grammar:</strong> stocks versus flows, the bathtub trap, buffers, the two kinds of loop (snowball and thermostat), delays and overshoot, and the shortest-stave rule.</li>
          <li><strong>II. The Pathology Lab:</strong> the recurring traps (system archetypes): Fixes That Fail, Shifting the Burden, Eroding Goals, Escalation, the Tragedy of the Commons, Success to the Successful, and gaming the scoreboard.</li>
          <li><strong>III. Epistemic &amp; Observer Hygiene:</strong> the iceberg, POSIWID (judge a system by what it does), boundary critique (no such thing as a side effect), the single-villain trap, and Ashby’s law.</li>
          <li><strong>IV. Strategic Intervention:</strong> Donella Meadows’ leverage points, from tweaking numbers (#12) up to changing goals and paradigms (#3–#1).</li>
        </ul>
        <p>The <a href="#/codex">Codex</a> lists every node with a one-line definition and source notes.</p>
      </section>

      <section class="panel" id="drills">
        <h2>The four drill types</h2>
        <p class="muted">These are free and work offline. Feedback is instant and exact, because there is a right answer.</p>
        <h3>Anatomical Dissection</h3>
        <p>
          Read a short realistic passage and <strong>click the sentence</strong> the prompt asks for: the stock, the outflow, the clause where a delay
          fools people, or the line that waves away a predictable consequence as a “side effect”. The passage then labels every sentence’s
          structural role. Most have a follow-up question. The timer measures your <em>time to detection</em>.
        </p>
        <h3>Bathtub in the Wild</h3>
        <p>
          A report with rates buried in the prose. No charts: work out whether the underlying stock is rising, falling or peaking, which
          figure is missing if you can’t tell, and exactly when it will peak. The ledger at the end shows the arithmetic. The rule never
          changes: <em>a stock changes by inflow minus outflow</em>, whatever the headline says.
        </p>
        <h3>Isomorphic Match</h3>
        <p>
          A source story from one field and four disasters from completely different fields. Only one has the same skeleton: the same
          accumulation, the same loop, the same threshold. The others are deliberately close: they are disasters too, just with different plumbing.
        </p>
        <h3>Leverage Triage</h3>
        <p>
          A chronic problem in three steps: name the archetype, say what the system is actually producing (POSIWID), then pick the
          intervention with the highest leverage. After you answer, every option shows its Meadows number.
        </p>
        <p>After every drill, the <strong>Anatomy</strong> section explains the answer in formal terms, intuitive terms, or both.</p>
      </section>

      <section class="panel" id="sessions">
        <h2>Calibration &amp; Blitz</h2>
        <p>
          <strong>Daily Calibration</strong> picks eight drills, each aimed at a different weak or fading skill, pitched where you should succeed roughly two times in three.
          That’s hard enough to learn from and easy enough to keep going.
        </p>
        <p>
          <strong>Blitz</strong> is rapid-fire dissections and isomorphic matches with no follow-ups. Consecutive hits raise a multiplier and faster spotting scores more.
          Three misses end the run. Use it to build speed once accuracy is there.
        </p>
      </section>

      <section class="panel" id="forge">
        <h2>The Generative Forge</h2>
        <p>Here you write. An AI judge grades your work against a fixed checklist, and your score is computed from that checklist.</p>
        <ul>
          <li><strong>Isomorphic Transposition:</strong> you’re dealt a systemic skeleton (for example Shifting the Burden), a reference story, and two random domain cards. Write 3–5 sentences per card that contain every element of the skeleton. The <strong>Zero-Jargon Rule</strong> blocks words like “stock”, “loop” and “system” before you can submit: the structure has to be unmistakable from the concrete story alone.</li>
          <li><strong>POSIWID &amp; Iceberg Autopsy:</strong> a self-justifying institutional statement lamenting a “surprising” failure. In under 80 words: the system’s true purpose, the perverse loop that produces the failure (as a closed chain), and the unstated belief keeping it alive.</li>
          <li><strong>The Leverage Upgrade:</strong> a low-leverage policy full of fines and quotas. Rewrite it in 2–3 sentences as a structural redesign aimed at a buffer, an information flow or a rule, and at the real constraint rather than where the symptom shows.</li>
        </ul>
        <p>
          With no key, the Forge runs in <strong>self-check mode</strong>: you see a reference answer and tick an honest checklist.
          Either way, you can save pieces you’re proud of.
        </p>
      </section>

      <section class="panel" id="desk">
        <h2>The Crisis Desk</h2>
        <ol>
          <li><strong>Choose a mode.</strong> <em>Blind Autopsy</em> hides the policy’s landmines until the debrief and gives bonus rating for exposing them before the final exchange. <em>Targeted Calibration</em> lets you, or your weakest skills, choose which landmines you face.</li>
          <li><strong>Pick a domain and a crisis</strong>, or describe your own.</li>
          <li><strong>Face the Linear Interventionist.</strong> A confident policymaker pitches an appealing fix with two or three hidden flaws: induced demand, stock-flow confusion, a hidden delay, a gameable target, a single villain, and so on. You get 3–5 exchanges of up to 130 words each.</li>
          <li><strong>Flag what you spot</strong> (privately), or better, expose it in your own words, in plain domain language rather than buzzwords. Exposing <em>and</em> defusing a landmine earns the most.</li>
          <li><strong>Read the scorecard.</strong> The Chief Cyberneticist scores five axes (stock, flow &amp; delay precision; loop &amp; archetype diagnosis; boundary &amp; POSIWID clarity; leverage elevation; clarity &amp; jargon translation), reveals the landmines, and decides whether the policy was blocked, amended or ratified.</li>
        </ol>
      </section>

      <section class="panel" id="leverage">
        <h2>About the leverage numbers</h2>
        <p>
          Meadows numbered her twelve places to intervene from #12 (constants and parameters, the weakest) to #1 (the power to transcend paradigms).
          The drills use her numbering because it’s a powerful habit of mind: always ask whether a fix just turns a dial or changes the structure.
        </p>
        <p class="muted">
          But treat it as a rule of thumb, not a law. Meadows called the list tentative, and a well-chosen parameter can sometimes beat a
          poorly designed rule. The drills are written so the right answer is also the best answer on its merits, and the Anatomy explains why.
        </p>
      </section>

      <section class="panel" id="ratings">
        <h2>Ratings &amp; readiness</h2>
        <p><strong>The short version:</strong> every skill has a chess-style rating starting at 1200. Beat a hard drill and it rises a lot; miss an easy one and it falls. The “±” next to it shrinks as the app grows more sure of you.</p>
        <details>
          <summary style={{ cursor: 'pointer' }}><strong>The step-by-step version</strong></summary>
          <ol>
            <li>Each drill has a difficulty on the same scale (1000 is clear-cut, 1400 subtle, 1800 expert).</li>
            <li>Before you answer, the app predicts your chance of success from the gap between your rating and the drill’s.</li>
            <li>Afterwards, your rating moves by <em>(actual result − predicted result)</em>, scaled by how uncertain your rating still is. This is the Glicko-2 system.</li>
            <li>Partial results count: two of three triage steps scores 0.67.</li>
            <li>Evidence is weighted by reliability: right-or-wrong drills count fully, AI-judged work half, self-checks a quarter.</li>
          </ol>
        </details>
        <p style={{ marginTop: '12px' }}>
          <strong>Readiness</strong> (the coloured bar) estimates how fresh each skill is, using a forgetting curve that flattens each time you succeed after a gap.
          Green is fresh; amber and red mean it’s time to revisit. It’s a guide to what to practise, not a precise measure of memory.
        </p>
      </section>

      <section class="panel" id="registers">
        <h2>Formal and intuitive names</h2>
        <p>
          Every skill has two names, for example <Dual formal="Balancing Feedback with Phase Lag" intuitive="The Shower Temperature Overshoot" /> and{' '}
          <Dual formal="Requisite Variety" intuitive="Regulator Overload" />.
          The <strong>Formal / Both / Intuitive</strong> switch at the top changes every label and explanation in the app.
          Learning both is the point: formal names let you look things up, and intuitive names make them usable in a meeting.
        </p>
      </section>

      <section class="panel" id="data">
        <h2>Your data, keys &amp; costs</h2>
        <ul>
          <li><strong>No account needed.</strong> Progress is saved in this browser. <a href="#/account">Signing in</a> syncs it across devices, and anything you did while signed out is merged in.</li>
          <li><strong>OpenRouter key:</strong> the Forge judge and the Crisis Desk use AI models through your own <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer">OpenRouter</a> key, added in <a href="#/settings">Settings</a>. It stays in this browser and is only ever sent to OpenRouter. Set a spending limit on the key.</li>
          <li><strong>Costs</strong> depend on the model you pick. A Forge grading is one call; a 3-exchange Crisis Desk session is four calls (three policymaker turns plus the arbiter). With a small, fast model that’s typically under a penny per grading and a few pence per session. Check the model’s price on OpenRouter.</li>
          <li><strong>Backups:</strong> Settings → Export JSON saves everything except your key. Import merges rather than overwrites.</li>
        </ul>
      </section>
    </div>
  );
}
