// Content for the Crisis Desk (spec §4): domains, scenarios, the Linear
// Interventionist personas, and the menu of hidden systemic landmines.

export const DESK_DOMAINS = [
  'Civic & Urban Policy',
  'Macroeconomics & Markets',
  'Organisational & Process Management',
  'Ecological & Resource Systems',
  'Everyday Human & Social Systems',
] as const;
export type DeskDomain = (typeof DESK_DOMAINS)[number];

export interface Scenario {
  domain: DeskDomain;
  title: string;
  /** The chronic problem the opponent will pitch a fix for. */
  problem: string;
}

export const SCENARIOS: Scenario[] = [
  { domain: 'Civic & Urban Policy', title: 'Gridlock on the Ring Road', problem: 'Rush-hour congestion on the city’s ring road has worsened every year for a decade, and businesses are complaining.' },
  { domain: 'Civic & Urban Policy', title: 'Rising Homelessness', problem: 'The number of families in emergency accommodation has doubled in three years and the council’s budget is overspent.' },
  { domain: 'Civic & Urban Policy', title: 'A&E Backlog', problem: 'Ambulances queue for hours outside the city hospital every winter, and the backlog is spreading into spring.' },
  { domain: 'Macroeconomics & Markets', title: 'Unaffordable Housing', problem: 'House prices have risen three times faster than wages for fifteen years, and young people are leaving the region.' },
  { domain: 'Macroeconomics & Markets', title: 'Food Price Spike', problem: 'Staple food prices have jumped 25% in a year after a poor harvest, and there is political pressure to act.' },
  { domain: 'Macroeconomics & Markets', title: 'Small-Business Closures', problem: 'High-street shops are closing faster than at any time in twenty years, and town centres are emptying.' },
  { domain: 'Organisational & Process Management', title: 'Missed Release Dates', problem: 'A software company has missed its last six release dates, and its biggest customer is threatening to leave.' },
  { domain: 'Organisational & Process Management', title: 'Call-Centre Burnout', problem: 'Staff turnover in the call centre has reached 60% a year, and waiting times are climbing.' },
  { domain: 'Organisational & Process Management', title: 'Ballooning Cloud Costs', problem: 'The company’s cloud bill has grown 60% a year and the board wants it under control.' },
  { domain: 'Ecological & Resource Systems', title: 'Recurring River Floods', problem: 'A river town has flooded three times in eight years, each time worse than the last.' },
  { domain: 'Ecological & Resource Systems', title: 'Collapsing Fish Stocks', problem: 'The regional cod catch is half what it was a decade ago, and fishing communities are struggling.' },
  { domain: 'Ecological & Resource Systems', title: 'Summer Water Shortages', problem: 'The water company has imposed hosepipe bans four summers out of the last five.' },
  { domain: 'Everyday Human & Social Systems', title: 'The Volunteer Drain', problem: 'A community sports club is losing volunteers every season, and the remaining ones are exhausted.' },
  { domain: 'Everyday Human & Social Systems', title: 'Falling Grades', problem: 'A teenager’s school grades have fallen for two years, and their parents want a plan.' },
  { domain: 'Everyday Human & Social Systems', title: 'The Household Chore War', problem: 'A shared house has argued about chores for months; two housemates are threatening to move out.' },
];

export interface Landmine {
  id: string;
  label: string;
  /** Taxonomy node the user is tested on when this landmine is loaded. */
  node: string;
  /** How the opponent builds it into the policy, without naming it. */
  instruction: string;
}

export const LANDMINES: Landmine[] = [
  { id: 'induced_demand', label: 'Induced Demand', node: 'archetype_fixes_that_fail',
    instruction: 'Make the centrepiece a capacity increase (more lanes, beds, servers, staff, supply) whose quick relief will attract more demand and refill the gap within a year or two.' },
  { id: 'shifting_burden', label: 'Shifting the Burden', node: 'archetype_shifting_the_burden',
    instruction: 'Rely on an outside quick fix (contractors, subsidies, a rescue fund, an expert team) that will make the people or organisation dependent on it and let their own capacity wither.' },
  { id: 'stock_flow_confusion', label: 'Stock-Flow Confusion', node: 'sterman_bathtub_paradox',
    instruction: 'Cite a falling rate of new cases (fewer new arrivals, applications, complaints, emissions) as proof that the accumulated problem itself is already shrinking.' },
  { id: 'hidden_material_delay', label: 'Hidden Material Delay', node: 'delays_oscillation',
    instruction: 'Push for strong, immediate action whose physical effects arrive months or years later, insist that results should be visible within weeks, and promise to scale up further if they are not.' },
  { id: 'eroding_goal', label: 'Eroding Goals', node: 'archetype_eroding_goals',
    instruction: 'Propose “more realistic” targets that quietly lower the standard so the policy can be declared a success.' },
  { id: 'metric_target', label: 'Goodhart Target', node: 'goodhart_rule_beating',
    instruction: 'Propose paying, ranking or promoting people on a simple, countable metric that can easily be gamed without serving the real purpose.' },
  { id: 'narrow_boundary', label: 'Narrow Boundary', node: 'boundary_critique',
    instruction: 'Dismiss a predictable knock-on consequence of the policy as an “unrelated externality” or “someone else’s department”.' },
  { id: 'single_villain', label: 'Single Villain', node: 'linear_attribution_bias',
    instruction: 'Blame one group, person or factor as the sole cause, and make punishing or removing them the core of the plan.' },
  { id: 'parameter_tweak', label: 'Parameter Tweak', node: 'leverage_parameters',
    instruction: 'Push hard for a bigger number (a budget, fine, quota, subsidy, cap or ban) as if it were the whole solution.' },
  { id: 'commons_grab', label: 'Commons Grab', node: 'archetype_tragedy_commons',
    instruction: 'Propose letting every party take more of a shared, limited resource, stressing how clearly each one benefits.' },
  { id: 'escalation_match', label: 'Match the Rival', node: 'archetype_escalation',
    instruction: 'Insist that the only responsible move is to match or beat a rival’s latest move (prices, pay, spending, features).' },
  { id: 'rigid_controller', label: 'One-Size-Fits-All', node: 'requisite_variety',
    instruction: 'Propose one uniform rule, script or process to handle a problem whose cases vary enormously.' },
];

export const LANDMINE_MAP: Record<string, Landmine> = Object.fromEntries(LANDMINES.map((t) => [t.id, t]));

export interface Persona {
  id: string;
  name: string;
  description: string;
  voice: string;
  difficulty: number;
  favoured: string[];
}

export const PERSONAS: Persona[] = [
  { id: 'councillor', name: 'The Well-Meaning Councillor', difficulty: 1250,
    description: 'Friendly, practical, wants to be seen doing something.',
    voice: 'Warm and plain-spoken; appeals to common sense and to “what residents are telling me”; impatient with theory.',
    favoured: ['parameter_tweak', 'stock_flow_confusion', 'induced_demand', 'eroding_goal'] },
  { id: 'minister', name: 'The Decisive Minister', difficulty: 1450,
    description: 'Polished, confident, allergic to delay.',
    voice: 'Crisp soundbites, “action this day”, cites headline figures confidently, treats caution as dithering.',
    favoured: ['parameter_tweak', 'stock_flow_confusion', 'narrow_boundary', 'hidden_material_delay', 'induced_demand'] },
  { id: 'ceo', name: 'The Turnaround CEO', difficulty: 1400,
    description: 'Metrics-driven, results-now, loves a dashboard.',
    voice: 'Brisk corporate register, KPIs and accountability, “what gets measured gets managed”, quick to name underperformers.',
    favoured: ['metric_target', 'single_villain', 'eroding_goal', 'parameter_tweak', 'escalation_match'] },
  { id: 'reformer', name: 'The Crusading Reformer', difficulty: 1500,
    description: 'Morally urgent, sure of the cause, impatient with nuance.',
    voice: 'Passionate, vivid anecdotes, frames objections as excuses for inaction, wants a clear villain and a bold fix.',
    favoured: ['single_villain', 'shifting_burden', 'rigid_controller', 'narrow_boundary', 'hidden_material_delay'] },
  { id: 'consultant', name: 'The Growth Consultant', difficulty: 1550,
    description: 'Slick, framework-heavy, always has a case study.',
    voice: 'Fluent jargon of strategy decks, confident case studies from elsewhere, frames everything as an opportunity to scale.',
    favoured: ['induced_demand', 'commons_grab', 'escalation_match', 'stock_flow_confusion', 'shifting_burden'] },
];

/** Which taxonomy nodes each Crisis Desk axis feeds. */
export const AXIS_NODES: Record<string, string[]> = {
  stock_flow_delay: ['stock_flow_dissection', 'delays_oscillation'],
  loop_archetype: ['reinforcing_vs_balancing', 'archetype_fixes_that_fail'],
  boundary_posiwid: ['boundary_critique', 'posiwid'],
  leverage: ['leverage_parameters', 'leverage_rules_incentives'],
  clarity: ['iceberg_translation'],
};
