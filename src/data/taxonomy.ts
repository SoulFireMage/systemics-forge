import type { TaxonomyNode, Wing, WingId } from '../lib/types';

export const WINGS: Wing[] = [
  { id: 'plumbing', numeral: 'I', title: 'The Atomic Grammar', focus: 'Plumbing and time: stocks, flows, loops and delays' },
  { id: 'pathology', numeral: 'II', title: 'The Pathology Lab', focus: 'System archetypes: the recurring structural traps' },
  { id: 'epistemic', numeral: 'III', title: 'Epistemic & Observer Hygiene', focus: 'Mental-model traps and boundary errors' },
  { id: 'leverage', numeral: 'IV', title: 'Strategic Intervention', focus: 'Meadows’ leverage points: redesigning structure and incentives' },
];

const n = (
  id: string, wing: WingId, group: string, formal: string, intuitive: string, summary: string, note?: string,
): TaxonomyNode => ({ id, wing, group, formal, intuitive, summary, note });

export const NODES: TaxonomyNode[] = [
  // ── Wing I: The Atomic Grammar ──────────────────────────
  n('stock_flow_dissection', 'plumbing', 'Stocks & Flows', 'Stock vs. Flow Dissection', 'Freeze-Frame Test',
    'A stock is what is still there if time freezes (water in the tub, cases in the backlog); a flow is a rate per unit of time (litres per minute, filings per month).'),
  n('sterman_bathtub_paradox', 'plumbing', 'Stocks & Flows', 'Stock-Flow Failure (Non-Zero Net Inflow)', 'The Bathtub Trap',
    'A falling inflow is not a falling stock. The stock keeps rising until inflow drops below outflow; it peaks exactly when the two are equal.',
    'Named after Sweeney & Sterman (2000), who found that most MIT graduate students failed simple bathtub problems. Sterman calls the error “correlation heuristic” reasoning.'),
  n('buffers_shock_absorbers', 'plumbing', 'Stocks & Flows', 'Buffers & Stock Stabilisation', 'Shock Absorbers',
    'Large stocks relative to their flows stabilise a system, but they also slow its response and hide decay until it is far advanced.'),
  n('reinforcing_vs_balancing', 'plumbing', 'Feedback', 'Reinforcing vs. Balancing Feedback', 'The Two Engines: Snowball vs. Thermostat',
    'Reinforcing loops amplify change (compounding growth or collapse); balancing loops push a stock towards a goal and resist change.'),
  n('delays_oscillation', 'plumbing', 'Feedback', 'Balancing Feedback with Phase Lag', 'The Shower Temperature Overshoot',
    'A balancing loop acting on delayed information or with delayed effect overshoots and oscillates. Material delays slow the effect; information or perception delays slow the signal.'),
  n('shifting_dominance', 'plumbing', 'Non-Linearity', 'Liebig’s Law & Shifting Loop Dominance', 'The Shortest Stave',
    'Growth is set by the scarcest input. When one constraint is relieved, another becomes binding, and the loop that dominates behaviour changes.',
    'The law of the minimum is usually credited to Liebig but was first stated by Carl Sprengel (1828). “Shifting loop dominance” is System Dynamics terminology.'),

  // ── Wing II: The Pathology Lab ──────────────────────────
  n('archetype_fixes_that_fail', 'pathology', 'Archetypes', 'Fixes That Fail (Policy Resistance)', 'The Backfiring Fix',
    'A fix relieves the symptom quickly but triggers a delayed side-effect loop that brings the problem back, often worse.',
    'The archetypes were catalogued at Innovation Associates and popularised by Senge’s The Fifth Discipline (1990). “Policy resistance” is Sterman’s broader term.'),
  n('archetype_shifting_the_burden', 'pathology', 'Archetypes', 'Shifting the Burden', 'Addiction to Quick Fixes',
    'A symptomatic fix is used instead of the fundamental solution, and reliance on it atrophies the system’s own capacity to solve the problem.'),
  n('archetype_eroding_goals', 'pathology', 'Archetypes', 'Eroding Goals (Drift to Low Performance)', 'The Boiling Frog',
    'A gap between goal and reality is closed by lowering the goal rather than improving reality, so standards drift down a little at a time.'),
  n('archetype_escalation', 'pathology', 'Archetypes', 'Escalation', 'The Arms Race',
    'Two parties each act to stay ahead of the other’s position, so each one’s balancing response becomes the other’s threat, and both escalate.',
    'The spec groups escalation with the tragedy of the commons; they are separate nodes here because their loop structures differ.'),
  n('archetype_tragedy_commons', 'pathology', 'Archetypes', 'Tragedy of the Commons', 'The Overgrazed Field',
    'Each user gains individually from drawing on a shared, limited resource, while the cost of depletion is spread across everyone, so the resource collapses.',
    'From Hardin (1968). Elinor Ostrom showed that many real commons are sustainably self-governed; the archetype describes unmanaged open access.'),
  n('archetype_success_to_successful', 'pathology', 'Archetypes', 'Success to the Successful', 'The Rich Get Richer',
    'Two activities compete for a shared resource. Early success earns more resource, which compounds the advantage until the other is starved.'),
  n('goodhart_rule_beating', 'pathology', 'Archetypes', 'Rule Beating & Goodhart’s Law', 'Gaming the Scoreboard',
    'When a measure becomes a target, people optimise the measure and the real purpose is lost.',
    'Goodhart (1975) wrote about monetary targets; the popular phrasing “when a measure becomes a target…” is Marilyn Strathern’s (1997). Meadows lists rule beating as a system trap.'),

  // ── Wing III: Epistemic & Observer Hygiene ──────────────
  n('iceberg_translation', 'epistemic', 'Seeing Structure', 'The Iceberg Model', 'Look Below the Waterline',
    'Move from a single event, to the pattern over time, to the structure producing the pattern, to the mental model that keeps that structure in place.',
    'A teaching tool common in systems-thinking practice; it has no single agreed originator.'),
  n('posiwid', 'epistemic', 'Seeing Structure', 'POSIWID (The Purpose of a System Is What It Does)', 'Ignore the Motto, Watch the Output',
    'Infer what a system is actually optimised for from what it reliably produces, not from what its owners say it is for.',
    'Coined by cybernetician Stafford Beer. It is a diagnostic stance, not a claim that anyone intends the outcome.'),
  n('boundary_critique', 'epistemic', 'Seeing Structure', 'Boundary Critique', 'There Are No Side Effects',
    'Spot where an analyst drew the system boundary too narrowly, so a predictable, endogenous consequence gets excused as an “unforeseen side effect”.',
    'Boundary critique comes from Churchman and Ulrich’s critical systems heuristics. “There are no side effects, only effects” is Sterman’s line.'),
  n('linear_attribution_bias', 'epistemic', 'Seeing Structure', 'Linear Attribution Bias', 'The Single Villain',
    'Reject single-cause or single-culprit explanations for outcomes that emerge from several interacting loops.'),
  n('requisite_variety', 'epistemic', 'Control', 'Ashby’s Law of Requisite Variety', 'Regulator Overload',
    'A controller can only keep a system steady if it can produce at least as many distinct responses as the disturbances it faces.',
    'From W. Ross Ashby, An Introduction to Cybernetics (1956): “only variety can destroy variety”.'),

  // ── Wing IV: Strategic Intervention ─────────────────────
  n('leverage_parameters', 'leverage', 'Meadows’ Leverage Points', 'Parameter Tweaking (#12 Constants & Numbers)', 'Pushing on a String',
    'Spot interventions that only change numbers (budgets, quotas, fines, tax rates) and leave the loops untouched. They are the most common and usually the weakest.',
    'Numbering follows Donella Meadows, “Leverage Points: Places to Intervene in a System” (1999): 12 is the weakest, 1 the strongest.'),
  n('leverage_physical_temporal', 'leverage', 'Meadows’ Leverage Points', 'Buffers, Plumbing & Delays (#11–#9)', 'Resize the Tank, Shorten the Pipe',
    'Change buffer sizes (#11), the physical stock-and-flow layout (#10), or the length of delays (#9).',
    'Meadows notes that physical structure is often slow and costly to change, and that delays are frequently fixed by physics.'),
  n('leverage_loop_engineering', 'leverage', 'Meadows’ Leverage Points', 'Loop Engineering (#8–#7)', 'Brakes & Circuit-Breakers',
    'Strengthen the balancing loops that correct problems (#8), or slow the gain of runaway reinforcing loops (#7).'),
  n('leverage_information_flows', 'leverage', 'Meadows’ Leverage Points', 'Information Flow Rewiring (#6)', 'Put the Meter Where They Can See It',
    'Route timely feedback to the people whose decisions cause the outcome but who never see it.'),
  n('leverage_rules_incentives', 'leverage', 'Meadows’ Leverage Points', 'Rules & Incentives (#5)', 'Change Who Pays',
    'Rewrite payoffs, rights and accountability so the costs and benefits fall on the people making the decisions.'),
  n('leverage_goals_paradigms', 'leverage', 'Meadows’ Leverage Points', 'Self-Organisation, Goals & Paradigms (#4–#1)', 'Change the Game',
    'Let the system evolve its own structure (#4), change what it is trying to achieve (#3), or change the mindset it grows from (#2–#1).'),
];

export const NODE_MAP: Record<string, TaxonomyNode> = Object.fromEntries(NODES.map((x) => [x.id, x]));

export const nodesByWing = (wing: WingId) => NODES.filter((x) => x.wing === wing);

export const groupsOfWing = (wing: WingId) => {
  const groups: { group: string; nodes: TaxonomyNode[] }[] = [];
  for (const node of nodesByWing(wing)) {
    const g = groups.find((x) => x.group === node.group);
    if (g) g.nodes.push(node);
    else groups.push({ group: node.group, nodes: [node] });
  }
  return groups;
};
