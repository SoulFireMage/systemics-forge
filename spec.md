Domain & Functional Specification: The Systems Thinking & Leverage Forge
1. Domain Philosophy & Core Pedagogical Engine
This platform trains users to extract systemic structures, quantitative stock-flow dynamics, behavioral archetypes, and high-leverage interventions directly from messy written narratives.
Rather than requiring node-and-link canvas drawing (deferred to a future phase), all training is anchored in Prose-to-Structure Extraction and Isomorphic Translation. The goal is to build the cognitive reflex of reading a linear, event-driven narrative (a news report, policy pitch, organizational post-mortem, or historical vignette) and immediately seeing the underlying plumbing: the accumulations, rates of change, hidden delays, closed loops, and perverse incentives.
1.1 Dual-Register Terminology Toggle
Just as rhetoric pairs classical and street terminology, every systems concept in the taxonomy stores two labels, selectable or displayed side-by-side:
 * Formal / Cybernetic Register: The canonical terminology from System Dynamics, Cybernetics, and Organizational Theory (e.g., Stock-Flow Failure, Balancing Feedback with Phase Lag, Shifting the Burden, POSIWID, Ashby's Requisite Variety, Parameter Tweaking).
 * Street / Intuitive Register: Plain-English structural metaphors (e.g., The Bathtub Trap, The Shower Temperature Overshoot, Addiction to Quick Fixes, Ignore the Motto / Watch the Output, Regulator Overload, Pushing on a String).
1.2 Shared Architectural Pattern (Brief Reference for Agent)
 * Inherits the exact persistence, telemetry, ELO/FSRS decay tracking, local-first + optional cloud sync, client-side OpenRouter API key management, and Admin Drill Generator studio patterns established in the Rhetoric Forge specification.
2. The 4-Wing Systems Taxonomy (The Syllabus)
Every drill, diagnostic tree, and sparring evaluation maps to specific sub-nodes across four wings. Each node tracks an independent Skill Rating (ELO: Default 1200) and FSRS Spaced-Repetition Stability.
| Wing | Granularity Level | Core Sub-Nodes (Formal Register / Intuitive Register) |
|---|---|---|
| I. The Atomic Grammar (Plumbing & Time) | Nouns, verbs, and quantitative intuition | • Stock vs. Flow Dissection: Identifying persistent accumulations (what remains if time freezes) vs. rates of change.
• Sterman’s Bathtub Paradox: Distinguishing a falling inflow from a falling stock (recognizing when a stock is still rising despite a slowing inflow).
• Buffers & Shock Absorbers: How large stocks stabilize systems vs. how they mask early decay and create sluggish response times.
• The Two Engines: Reinforcing Loops (compounding/runaway snowballs) vs. Balancing Loops (goal-seeking thermostats/resistance).
• Delays & Oscillations: Material vs. Information/Perception delays; how a balancing loop + delay causes overshoot and oscillation.
• Non-Linearity & Shifting Dominance: Liebig’s Law of the Minimum; recognizing when a system hits a ceiling because the binding constraint shifted. |
| II. The Pathology Lab (System Archetypes) | Recurring structural traps ("Molecules") | • Fixes That Fail (Policy Resistance): Symptomatic fixes that trigger delayed counter-loops, worsening the original state.
• Shifting the Burden (Atrophying the Core): Quick patches that weaken the system’s native self-correcting capacity.
• Eroding Goals (Boiling Frog / Drift to Low Performance): Closing a performance gap by quietly lowering the standard rather than improving the state.
• Escalation & Tragedy of the Commons: Coupled loops where individually rational optimization guarantees collective depletion or arms races.
• Success to the Successful: Competitive exclusion loops where early advantage compounds via structural resource capture.
• Rule Beating & Goodhart’s Law: Gaming the metric while subverting the actual systemic purpose. |
| III. Epistemic & Observer Hygiene | Mental model traps & boundary errors | • The Iceberg Translation: Moving upward from Single Event → Temporal Pattern → Systemic Structure → Underlying Mental Model.
• POSIWID (Purpose = Output): Deducing a system’s true goal strictly from its invariant outputs, ignoring stated intentions or rhetoric.
• Boundary Critique (No "Side Effects"): Identifying where an observer drew a system boundary too narrowly to excuse predictable downstream consequences as "unforeseen side effects."
• Linear Attribution Bias: Rejecting single-villain or single-cause explanations for emergent multi-loop failures.
• Requisite Variety (Ashby’s Law): Recognizing when a rigid controller lacks the flexibility to govern a high-variance environment. |
| IV. Strategic Intervention (Meadows’ Leverage) | Redesigning structure & incentives | • Low-Leverage Trap (#12 - Constants & Numbers): Spotting interventions that merely tweak parameters (budgets, quotas, tax rates) without altering loops.
• Physical & Temporal Tuning (#11–#9): Resizing buffers, redesigning physical stock-and-flow plumbing, and shortening delay lengths.
• Loop Engineering (#8 & #7): Strengthening corrective balancing loops or introducing friction/circuit-breakers to slow runaway reinforcing loops.
• Information Flow Rewiring (#6): Routing real-time feedback directly to decision-makers who were previously insulated from consequences.
• Rules & Incentives (#5): Rewriting institutional payoffs, property rights, and accountability boundaries.
• Goals & Paradigms (#4–#1): Shifting the overarching system objective, enabling self-organization, or overturning the foundational paradigm. |
3. Core Training Modules & Prose Drill Mechanics
3.1 Tier 1: Deterministic Micro-Drills (Zero API Cost)
Fast, client-side drills operating on pre-compiled JSON narratives.
 * Anatomical Prose Dissection (Span Highlighting):
   * Mechanic: The user reads a 3-to-6 sentence realistic passage (e.g., a municipal water shortage report, a software engineering post-mortem, a historical inflation crisis, or a hospital wait-time memo).
   * Tasks (Varied by Prompt):
     * Stock/Flow Tagging: Click the exact phrase representing the Stock, the Inflow, or the Outflow.
     * Delay Sniping: Highlight the clause where an Information Delay or Material Delay is causing actors to overreact to outdated system states.
     * Boundary Exposure: Highlight the sentence where the author dismisses an endogenous loop consequence as an "external side effect."
 * The "Bathtub in the Wild" (Quantitative Intuition Puzzles):
   * Mechanic: Present a realistic prose report containing embedded rates of change (e.g., "New defect reports dropped by 35% this quarter while patch deployments held steady at 50 per week...").
   * Task: Without charts, the user must determine: (a) Is the underlying stock currently rising, falling, or peaking? (b) Which specific piece of flow data is missing if the text is ambiguous? (c) At what exact condition will the stock reach its maximum peak?
 * Isomorphic Match (Skeleton Recognition):
   * Mechanic: Present a short source narrative describing a systemic failure in one domain (e.g., Ecology: Suppressing minor brushfires for decades allows underbrush stock to accumulate until a catastrophic crown fire occurs).
   * Task: Present 4 short candidate narratives from completely alien domains (e.g., Macroeconomics, Personal Relationships, Software Maintenance, Public Health). All four describe disasters, but only one has the exact same underlying stock-buffer-threshold structure. The user selects the structural twin.
 * Leverage Ranking & Triage (Diagnostic Tree):
   * Mechanic: Given a chronic systemic problem in prose, the user steps through a 3-stage diagnostic tree:
     * Step 1: Diagnose the active Archetype (e.g., Shifting the Burden).
     * Step 2: Identify the POSIWID reality (what the current system is actually optimized to produce).
     * Step 3: Evaluate 4 proposed policy interventions, tagging the one that operates at the highest Meadows Leverage Point (e.g., choosing Information Flow #6 or Incentive Rule #5 over Parameter Tweaking #12).
3.2 Tier 2: The Generative Forge (BYOK OpenRouter Evaluation)
Free-form analytical and translation drills evaluated via structured JSON LLM rubrics.
 * The Isomorphic Transposition Workbench (Systems "Mr. Potato Head"):
   * Mechanic: The engine deals the user a Systemic Skeleton (e.g., Archetype: Escalation + Eroding Goals | Delay: 6-Month Perception Lag) along with a brief reference vignette showing how it works in Geopolitics. It then deals 2 Random Domain Cards (e.g., Card 1: Local Retail Price War, Card 2: Household Chore Resentment).
   * Task: The user must write a 3-to-5 sentence narrative for each domain card that accurately instantiates every element of the systemic skeleton in natural, realistic prose.
   * Constraint: Zero-Jargon Rule. The user is forbidden from using words like "stock," "flow," "feedback loop," "balancing," or "archetype." They must describe the concrete domain reality so clearly that the structure is unmistakable.
   * Evaluation: The LLM Judge verifies that the stock, flows, loop polarity, and delay are structurally present and isomorphic to the prompt.
 * The POSIWID & Iceberg Autopsy:
   * Mechanic: Present a bloated, self-justifying institutional statement or news excerpt lamenting a "surprising failure" (e.g., a university lamenting grade inflation, or a company lamenting that a bug-bounty metric led to trivial ticket spam).
   * Task: In under 80 words, the user must: (a) State the system's true purpose under POSIWID, (b) explicitly trace the perverse feedback loop (Goodhart's Law / Rule Beating) connecting the metric to the behavior, and (c) name the unstated mental model keeping the broken rule alive.
 * The Leverage Upgrade (Intervention Rewrite):
   * Mechanic: Present a classic low-leverage policy proposal (e.g., "To stop hospital emergency rooms from backing up, we will fine ambulance crews when handovers take longer than 15 minutes and increase the triage target quota by 10%.").
   * Task: Rewrite the intervention in 2–3 sentences by stripping out the low-leverage parameter/punishment tweaks (#12) and replacing them with a specific structural redesign targeting Buffers (#11), Information Flows (#6), or Rules/Incentives (#5) (e.g., addressing downstream ward bed outflow constraints rather than punishing the inflow valve).
4. The Crisis Desk (The Adversarial Sparring Room)
The systems-thinking counterpart to The Fencing Salle. Instead of debating a sophist over rhetoric, the user sits across from The Linear Interventionist—a persuasive, decisive policymaker, executive, or reformer pitching an emotionally appealing, commonsense "fix" to a complex problem.
4.1 Pre-Session Configuration
 * Sparring Mode Toggle:
   * Blind Autopsy: The opponent pitches a policy intervention containing 2–3 hidden systemic landmines (e.g., Induced Demand, Shifting the Burden, Stock-Flow Confusion, or a Hidden Material Delay). The user doesn't know which traps are loaded until the post-session debrief and earns bonus ELO for exposing them before the opponent's policy is ratified.
   * Targeted Calibration: The user selects specific low-ELO or decaying nodes from their telemetry radar, and the opponent constructs a scenario specifically designed to test those blind spots.
 * Domain Selector: Civic & Urban Policy, Macroeconomics & Markets, Organizational & Process Management, Ecological & Resource Systems, or Everyday Human & Social Systems.
 * Round Structure: 3 to 5 exchanges, capped at 130 words per turn to enforce concise structural diagnosis.
4.2 Dual-Agent Architecture (The Interventionist + The Chief Cyberneticist)
 * The Opponent Persona (The Linear Interventionist):
   * Instructed to argue forcefully for linear, event-level solutions. Uses plausible surface logic, cites short-term symptomatic improvements, dismisses downstream loop effects as "unrelated externalities," confuses slowing inflows with shrinking stocks, and pushes hard for low-leverage parameter tweaks (quotas, subsidies, bans, fines).
 * The Arbiter Persona (The Chief Cyberneticist):
   * Evaluates each exchange against the 5-Axis Systems Scorecard and returns structured JSON feedback and ELO deltas.
4.3 The Crisis Desk Scorecard (5-Axis Evaluation)
 * Stock, Flow & Delay Precision: Did the user accurately distinguish accumulations from rates and pinpoint where time delays will cause oscillation or overshoot?
 * Loop & Archetype Diagnosis: Did the user trace the second- and third-order feedback loops that the opponent's "fix" will trigger (e.g., exposing Fixes That Fail or Induced Demand)?
 * Boundary & POSIWID Clarity: Did the user expand the artificially narrow boundary of the opponent's proposal and articulate what the system's incentives will actually produce in practice?
 * Leverage Elevation: Did the user successfully counter-propose a higher-leverage intervention (moving up Meadows' hierarchy from #12 numbers toward #6–#3 structural/information/rule changes)?
 * Clarity & Jargon Translation: Did the user explain the systemic dynamics in crisp, undeniable domain language rather than hiding behind abstract textbook buzzwords?
5. Reference Data Schemas for Coding Agent
5.1 Deterministic Systems Drill Schema (SystemsDrillItem)
{
  "id": "sys_w1_0018",
  "tier": "deterministic",
  "drill_type": "anatomical_dissection | bathtub_puzzle | isomorphic_match | leverage_triage",
  "taxonomy_nodes": ["sterman_bathtub_paradox", "stock_flow_dissection"],
  "difficulty_elo": 1320,
  "register_tags": {
    "formal": "Stock-Flow Failure / Non-Zero Net Inflow",
    "intuitive": "The Bathtub Trap (Slowing the Faucet != Draining the Tub)"
  },
  "prompt_instruction": "Click the sentence where the author commits the Bathtub Fallacy—confusing a drop in the inflow rate with a drop in the total stock.",
  "passage_segments": [
    { "id": "s1", "text": "For the past two years, our municipal housing court cleared exactly 200 eviction cases per month while 400 new cases were filed monthly.", "system_role": "baseline_flows" },
    { "id": "s2", "text": "Following our mediation reform in January, new monthly filings have dropped sharply from 400 down to 250 per month.", "system_role": "inflow_deceleration" },
    { "id": "s3", "text": "Because new filings have fallen by nearly 40%, the total backlog of families waiting for a court date is finally shrinking.", "system_role": "target_bathtub_error" },
    { "id": "s4", "text": "Court staffing and monthly case clearances remain unchanged at 200 per month.", "system_role": "outflow_constraint" }
  ],
  "correct_target_id": "s3",
  "follow_up_question": {
    "question": "Based strictly on the numbers in the passage, what is actually happening to the total backlog (the Stock) right now?",
    "options": [
      { "id": "o1", "text": "The backlog is shrinking by 150 cases per month.", "is_correct": false, "feedback": "150 is the reduction in the *inflow rate* (from 400 to 250), not the net change in the stock." },
      { "id": "o2", "text": "The backlog is still growing by 50 cases every single month.", "is_correct": true, "feedback": "Exact. Inflow (250/mo) still exceeds Outflow (200/mo). Slowing the faucet only slows how fast the tub fills; the water level still rises." }
    ]
  },
  "explanation_formal": "A stock accumulates the net difference between inflow and outflow over time. As long as Inflow (250) exceeds Outflow (200), the first derivative of the Stock remains positive (+50/month), even though the second derivative (change in inflow) is negative.",
  "explanation_intuitive": "If a bathtub drains at 200 gallons an hour and you turn the faucet down from 400 to 250 gallons an hour, the water level is still rising by 50 gallons an hour. It only stops rising when inflow drops to 200 or below."
}


5.2 Generative Isomorphic Transposition Schema (IsomorphicPromptSeed)
{
  "id": "iso_forge_009",
  "taxonomy_nodes": ["archetype_shifting_the_burden", "delay_atrophy"],
  "difficulty_elo": 1450,
  "skeleton_spec": {
    "core_symptom": "Recurring acute performance or resource gap",
    "quick_fix_loop": "Balancing loop that immediately masks or relieves the symptom",
    "side_effect_loop": "Delayed reinforcing loop where reliance on the quick fix atrophies the native baseline capacity, increasing future dependence",
    "forbidden_words": ["stock", "flow", "loop", "balancing", "reinforcing", "archetype", "atrophy", "system"]
  },
  "source_example": {
    "domain": "Agronomy & Soil Health",
    "text": "When crop yields dip due to compacted, microbe-poor soil, a farm applies heavy doses of synthetic nitrogen. Harvest weight rebounds that autumn, removing the urgency to rotate cover crops or rebuild organic matter. Without root humus, the soil's water retention and microbial life die off further, forcing the farm to buy 30% more synthetic fertilizer the following spring just to hit the same yield."
  },
  "target_domain_cards": [
    "Team Management & Code Reviews",
    "Municipal Transit & Road Maintenance"
  ]
}


6. Agent Implementation Adjustments (Delta from Rhetoric Spec)
When adapting the Rhetoric codebase/architecture pattern to build this platform, the coding agent only needs to swap the following domain-specific layers:
 * Seed Taxonomy & Dual-Register Dictionary: Load the 4-Wing Systems Taxonomy (Formal / Cybernetic vs. Street / Intuitive labels).
 * Tier 1 Player Addition (Bathtub Puzzle & Isomorphic Match): Add the two specialized deterministic card layouts alongside the standard Span Dissection and Diagnostic Tree players.
 * Tier 2 Zero-Jargon Validator: In the Isomorphic Transposition Workbench, include a fast client-side pre-check that highlights and blocks any forbidden_words (systems jargon) before the user submits their prose to the OpenRouter Judge.
 * The Crisis Desk Prompts: Replace the Fencing Salle Opponent/Arbiter system prompts with The Linear Interventionist and The Chief Cyberneticist rubrics, mapping post-session scores to the 5 Systems Axes.