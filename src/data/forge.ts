// Content for the Generative Forge (Tier 2).

// ── Isomorphic Transposition Workbench (spec §3.2, schema §5.2) ──

export interface SkeletonSpec {
  /** Systems jargon the user may not use for this seed (added to the base list). */
  forbidden_words: string[];
  /** Every other key is a structural element the narrative must instantiate. */
  [element: string]: string | string[];
}

export interface IsomorphicPromptSeed {
  id: string;
  title: string;
  taxonomy_nodes: string[];
  difficulty_elo: number;
  skeleton_spec: SkeletonSpec;
  source_example: { domain: string; text: string };
  /** Suggested cards; the workbench deals two at random from the whole deck. */
  target_domain_cards: string[];
}

export const skeletonElements = (s: SkeletonSpec): [string, string][] =>
  Object.entries(s).filter(([k, v]) => k !== 'forbidden_words' && typeof v === 'string') as [string, string][];

export const prettyElement = (k: string) => k.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());

export const SEEDS: IsomorphicPromptSeed[] = [
  {
    id: 'iso_forge_009',
    title: 'Shifting the Burden',
    taxonomy_nodes: ['archetype_shifting_the_burden', 'delays_oscillation'],
    difficulty_elo: 1450,
    skeleton_spec: {
      core_symptom: 'Recurring acute performance or resource gap',
      quick_fix_loop: 'Balancing loop that immediately masks or relieves the symptom',
      side_effect_loop: 'Delayed reinforcing loop where reliance on the quick fix atrophies the native baseline capacity, increasing future dependence',
      forbidden_words: ['stock', 'flow', 'loop', 'balancing', 'reinforcing', 'archetype', 'atrophy', 'system'],
    },
    source_example: {
      domain: 'Agronomy & Soil Health',
      text: 'When crop yields dip due to compacted, microbe-poor soil, a farm applies heavy doses of synthetic nitrogen. Harvest weight rebounds that autumn, removing the urgency to rotate cover crops or rebuild organic matter. Without root humus, the soil’s water retention and microbial life die off further, forcing the farm to buy 30% more synthetic fertiliser the following spring just to hit the same yield.',
    },
    target_domain_cards: ['Team Management & Code Reviews', 'Municipal Transit & Road Maintenance'],
  },
  {
    id: 'iso_forge_fixes',
    title: 'Fixes That Fail',
    taxonomy_nodes: ['archetype_fixes_that_fail', 'delays_oscillation'],
    difficulty_elo: 1350,
    skeleton_spec: {
      problem_symptom: 'A recurring problem that hurts now',
      fix: 'A fix that relieves the symptom quickly and visibly',
      delayed_side_effect: 'An unintended consequence of the fix that arrives later',
      worsening: 'The side effect feeds the original problem, so it returns worse and invites more of the same fix',
      forbidden_words: ['fix that fails', 'unintended consequence', 'side effect'],
    },
    source_example: {
      domain: 'Medicine',
      text: 'Someone with frequent headaches takes painkillers most days. The pain eases within an hour, every time. After some months, the daily pills themselves start triggering “rebound” headaches, so the person takes more pills, more often, and the headaches become near-constant.',
    },
    target_domain_cards: ['Restaurant Kitchen', 'Family Budget'],
  },
  {
    id: 'iso_forge_escalation',
    title: 'Escalation + Eroding Goals',
    taxonomy_nodes: ['archetype_escalation', 'archetype_eroding_goals', 'delays_oscillation'],
    difficulty_elo: 1550,
    skeleton_spec: {
      relative_goal: 'Each party defines “enough” relative to the other’s position',
      coupled_response: 'Each party’s move to get ahead is the other’s reason to move',
      perception_lag: 'Each side sees the other’s moves about six months late, so it reacts to a position the rival has already left behind',
      eroding_standard: 'What counts as an “acceptable” cost quietly drifts as each round normalises the last',
      forbidden_words: ['escalation', 'escalate', 'arms race', 'eroding', 'lag'],
    },
    source_example: {
      domain: 'Geopolitics',
      text: 'Two neighbouring states judge each other’s naval strength from intelligence estimates that arrive about six months late. Each orders enough new ships to stay ahead of the last estimate, so each is always reacting to a rival that has already moved on. Year by year, both governments redefine an “acceptable” defence budget upwards, from 2% of national income to 3%, then 4%, until nobody remembers when 2% seemed plenty.',
    },
    target_domain_cards: ['Local Retail Price War', 'Household Chore Resentment'],
  },
  {
    id: 'iso_forge_commons',
    title: 'Tragedy of the Commons',
    taxonomy_nodes: ['archetype_tragedy_commons'],
    difficulty_elo: 1350,
    skeleton_spec: {
      shared_resource: 'A limited resource many people draw on, which regenerates slowly or not at all',
      private_gain: 'Each user gains the full benefit of taking a little more',
      spread_cost: 'The cost of depletion is shared by everyone, so it barely registers for any one user',
      collapse: 'Use keeps rising until the resource fails for all',
      forbidden_words: ['commons', 'tragedy', 'externality', 'depletion'],
    },
    source_example: {
      domain: 'Groundwater',
      text: 'Farmers in a dry valley each sink their own wells into one shared aquifer. A farmer who pumps a bit more grows a bit more, and the drop in the water table is spread across the whole valley. Everyone pumps more each year, the wells get deeper and deeper, and then the shallow ones run dry together.',
    },
    target_domain_cards: ['Office Kitchen Fridge', 'Open-Source Project Maintainers'],
  },
  {
    id: 'iso_forge_success',
    title: 'Success to the Successful',
    taxonomy_nodes: ['archetype_success_to_successful', 'linear_attribution_bias'],
    difficulty_elo: 1400,
    skeleton_spec: {
      shared_pool: 'A limited pool of resources two activities compete for',
      allocation_rule: 'Resources go to whichever activity did better last time',
      compounding: 'The winner’s extra resources make it win again; the loser’s shrinking share makes it lose again',
      misreading: 'Observers conclude the loser was simply worse',
      forbidden_words: ['rich get richer', 'winner takes all', 'compounding'],
    },
    source_example: {
      domain: 'School Funding',
      text: 'Two primary schools serve the same town. The one with better results is more popular, so it fills its places and its funding, which follows pupils, rises. It hires the best teachers and its results rise again. The other school loses pupils, money and staff, and a report concludes it is “a failing school”.',
    },
    target_domain_cards: ['Football Club Youth Academy', 'University Research Funding'],
  },
  {
    id: 'iso_forge_goodhart',
    title: 'Rule Beating (Goodhart)',
    taxonomy_nodes: ['goodhart_rule_beating', 'posiwid'],
    difficulty_elo: 1300,
    skeleton_spec: {
      real_purpose: 'What the organisation actually wants',
      proxy_measure: 'A countable stand-in that is rewarded',
      gaming_path: 'A cheaper way to raise the measure without serving the purpose',
      purpose_lost: 'The measure improves while the real purpose gets worse',
      forbidden_words: ['metric', 'kpi', 'target', 'gaming', 'proxy', 'incentive'],
    },
    source_example: {
      domain: 'Call Centres',
      text: 'A call centre rewards agents for keeping average calls under four minutes. Agents start transferring difficult callers or quietly ending long calls. Average call time falls, the same customers ring back two or three times, and total calls go up.',
    },
    target_domain_cards: ['Restaurant Kitchen', 'School Homework Policy'],
  },
  {
    id: 'iso_forge_brushfire',
    title: 'Suppressed Release → Threshold',
    taxonomy_nodes: ['buffers_shock_absorbers', 'archetype_fixes_that_fail'],
    difficulty_elo: 1500,
    skeleton_spec: {
      accumulation: 'Something that builds up quietly over time',
      small_releases: 'Small, frequent events that used to keep it in check',
      suppression: 'Well-meant prevention of every small release',
      threshold_release: 'The build-up crosses a threshold and releases all at once, far worse than any small event',
      forbidden_words: ['threshold', 'accumulate', 'accumulation', 'tipping point'],
    },
    source_example: {
      domain: 'Ecology',
      text: 'For decades, rangers put out every small brushfire. Without those small burns, dead wood and undergrowth piled up year after year. When a fire finally escaped, it had so much fuel that it became a crown fire that destroyed the whole forest.',
    },
    target_domain_cards: ['Friendship Group Chat', 'Apartment Building Maintenance'],
  },
  {
    id: 'iso_forge_overshoot',
    title: 'Delayed Correction (Overshoot)',
    taxonomy_nodes: ['delays_oscillation', 'reinforcing_vs_balancing'],
    difficulty_elo: 1300,
    skeleton_spec: {
      goal_gap: 'A gap between how things are and how someone wants them',
      corrective_action: 'Action taken to close the gap',
      delay: 'A long wait between acting and seeing the result',
      overshoot: 'More action piles up during the wait, so the result overshoots and swings the other way',
      forbidden_words: ['delay', 'overcorrect', 'overcorrection', 'lag'],
    },
    source_example: {
      domain: 'Housing Markets',
      text: 'Rents spike, so developers start hundreds of new flats. They take three years to finish, and by then demand has cooled, so a glut of empty flats drives rents down. Developers stop building, and three years later rents spike again.',
    },
    target_domain_cards: ['Hospital Ward Staffing', 'Small Bakery'],
  },
];

/** The deck of Random Domain Cards. */
export const DOMAIN_CARDS: string[] = [
  'Local Retail Price War',
  'Household Chore Resentment',
  'Team Management & Code Reviews',
  'Municipal Transit & Road Maintenance',
  'School Homework Policy',
  'Hospital Ward Staffing',
  'Open-Source Project Maintainers',
  'Family Budget',
  'Allotment Society',
  'Football Club Youth Academy',
  'Restaurant Kitchen',
  'Village Cricket Club',
  'Online Gaming Guild',
  'Small Bakery',
  'University Research Funding',
  'Friendship Group Chat',
  'Office Kitchen Fridge',
  'Freelance Designer’s Workload',
  'Apartment Building Maintenance',
  'Dog-Walking Business',
];

// ── POSIWID & Iceberg Autopsy ─────────────────────────────

export interface AutopsyItem {
  id: string;
  title: string;
  statement: string;
  nodes: string[];
  true_purpose: string;
  perverse_loop: string;
  mental_model: string;
  /** Reference answer, under 80 words. */
  exemplar: string;
}

export const AUTOPSY_LIMIT = 80;

export const AUTOPSIES: AutopsyItem[] = [
  {
    id: 'au_grades', title: 'The Grade Inflation Mystery',
    statement: 'Our university remains unwaveringly committed to academic excellence. It is therefore with genuine surprise that we note the proportion of first-class degrees has more than doubled in a decade, while entry standards are unchanged. This is a sector-wide phenomenon whose causes remain poorly understood. We will, as ever, continue to prioritise the student experience, which is reflected in our excellent satisfaction scores and our rising position in the league tables that inform our funding.',
    nodes: ['posiwid', 'goodhart_rule_beating', 'iceberg_translation'],
    true_purpose: 'Producing good degrees and satisfied students, because that is what rankings and funding reward.',
    perverse_loop: 'Higher grades → higher satisfaction and “good degree” rates → better rankings → more applicants and funding → pressure to keep grades high.',
    mental_model: 'Students are customers, and rankings measure quality.',
    exemplar: 'Purpose: to award good degrees to satisfied students, because rankings and funding pay for exactly that. Loop: generous grading lifts satisfaction and “good degree” rates, which lift rankings and income, which raises the stakes on generous grading. Mental model: students are customers and league tables measure excellence. The “mystery” is a reward working as designed.',
  },
  {
    id: 'au_loc', title: 'The Productivity Dashboard',
    statement: 'Since launching our developer productivity dashboard, which celebrates the top committers by lines of code each week, output has risen by over 40%. Leadership is therefore puzzled that release dates keep slipping and the codebase has become harder to change. We are commissioning a review into why our engineers seem less effective despite producing more than ever. We remain confident that what gets measured gets managed.',
    nodes: ['posiwid', 'goodhart_rule_beating', 'iceberg_translation'],
    true_purpose: 'Producing lines of code, which is what is celebrated, rather than working software.',
    perverse_loop: 'Ranking by lines → verbose code and copy-paste → bigger, harder-to-change codebase → slower delivery → more pressure to look productive → more lines.',
    mental_model: '“What gets measured gets managed”: output volume equals productivity.',
    exemplar: 'Purpose: producing lines of code, because that is what gets celebrated. Loop: ranking by lines rewards bloat and copy-paste, which makes the codebase harder to change, which slows releases, which raises pressure to look busy, which means more lines. Mental model: volume is productivity, and anything measured is thereby managed. The dashboard is working; it’s just managing the wrong thing.',
  },
  {
    id: 'au_handle_time', title: 'The Customer Service Paradox',
    statement: 'We are proud that our average call handling time has fallen to under four minutes, comfortably beating our target and the industry benchmark. Agents who hit the target receive a monthly bonus. It is therefore disappointing and frankly hard to explain why total call volumes have risen 30% and customer complaints are at a record high. We are investigating whether customers have simply become more demanding.',
    nodes: ['posiwid', 'goodhart_rule_beating', 'linear_attribution_bias'],
    true_purpose: 'Producing short calls, not resolved problems.',
    perverse_loop: 'Bonus for short calls → agents transfer or cut off hard calls → problems unresolved → customers ring back → more calls and complaints → more pressure to keep calls short.',
    mental_model: 'Efficiency means short transactions; customers are the variable to blame.',
    exemplar: 'Purpose: producing short calls, which is what earns bonuses, not resolved problems. Loop: rewarding speed pushes agents to transfer or cut off hard calls, so problems stay unsolved, customers ring back, volumes climb and pressure for speed grows. Mental model: efficiency means short transactions, and when results disappoint, the customer must be the problem.',
  },
  {
    id: 'au_crime_stats', title: 'The Falling Crime Figures',
    statement: 'Recorded crime in our force area has fallen for the fifth consecutive year, meeting the reduction targets on which officer promotion boards place considerable weight. We are therefore at a loss to explain the steep decline in public confidence revealed by the latest survey. We will be launching a communications campaign to make residents aware of our achievements, as we believe the problem is one of perception.',
    nodes: ['posiwid', 'goodhart_rule_beating', 'boundary_critique'],
    true_purpose: 'Producing low recorded crime figures, which drive promotion, rather than less crime.',
    perverse_loop: 'Promotion tied to recorded-crime falls → reports downgraded or discouraged → victims feel ignored → confidence falls → fewer reports → figures fall further.',
    mental_model: 'The recorded figure is the reality; dissatisfaction is a perception problem.',
    exemplar: 'Purpose: low recorded crime, because promotions reward it, not less actual crime. Loop: target pressure leads officers to downgrade or discourage reports, victims feel dismissed, confidence falls, fewer people report, and the figures fall again. Mental model: the number is the reality, so public distrust must be a communications problem.',
  },
  {
    id: 'au_engagement', title: 'The Trust Deficit',
    statement: 'Our newsroom’s digital strategy has been an outstanding success: page views are up 70% since we began ranking journalists’ stories by clicks and featuring the top performers on the homepage. We are surprised and concerned, however, that reader trust has fallen to its lowest level on record and subscriptions are flat. Industry-wide headwinds and declining attention spans appear to be to blame.',
    nodes: ['posiwid', 'goodhart_rule_beating', 'linear_attribution_bias'],
    true_purpose: 'Producing clicks, which is what is ranked and promoted, rather than trusted journalism.',
    perverse_loop: 'Ranking by clicks → sensational headlines and thin stories → more clicks but less trust → fewer subscribers → more reliance on clicks.',
    mental_model: 'Attention equals value; external headwinds explain internal results.',
    exemplar: 'Purpose: producing clicks, because clicks decide who is ranked and featured. Loop: chasing clicks rewards sensational, thin stories, which win attention but erode trust, which stalls subscriptions, which makes the newsroom lean harder on clicks. Mental model: attention is value, and bad results come from outside headwinds rather than from the ranking itself.',
  },
  {
    id: 'au_trolley', title: 'The Four-Hour Triumph',
    statement: 'Our emergency department now admits or discharges 95% of patients within four hours, meeting the national standard every month this year. It is therefore puzzling that staff report patients waiting up to twelve hours on trolleys in our new Clinical Decision Unit, which opened last spring. We are reviewing whether the unit is being used as intended and have reminded staff of their obligations.',
    nodes: ['posiwid', 'goodhart_rule_beating', 'boundary_critique'],
    true_purpose: 'Stopping the four-hour clock, rather than getting patients the care they need.',
    perverse_loop: 'Four-hour standard → patients moved into a unit outside the clock → target met, so no pressure to fix ward capacity → waits move to the unit and grow.',
    mental_model: 'Meeting the standard is the same as delivering good care; the problem lies in staff behaviour.',
    exemplar: 'Purpose: stopping the four-hour clock, not getting patients a bed. Loop: the target pushes patients into a unit outside the clock, the target is met, so nothing forces a fix to ward capacity, and the hidden waits grow. Mental model: meeting the standard equals good care, so when it doesn’t, blame staff for “misusing” the unit.',
  },
];

// ── The Leverage Upgrade ──────────────────────────────────

export interface UpgradeItem {
  id: string;
  title: string;
  proposal: string;
  nodes: string[];
  low_leverage: string[];
  binding_constraint: string;
  /** Reference rewrite: 2–3 sentences. */
  exemplar: string;
}

export const UPGRADES: UpgradeItem[] = [
  {
    id: 'up_ambulance', title: 'Ambulance Handovers',
    proposal: 'To stop hospital emergency rooms from backing up, we will fine ambulance crews when handovers take longer than 15 minutes and increase the triage target quota by 10%.',
    nodes: ['leverage_parameters', 'leverage_rules_incentives', 'shifting_dominance'],
    low_leverage: ['fines on ambulance crews (#12, punishing the inflow valve)', 'a higher triage quota (#12)'],
    binding_constraint: 'Ward beds do not free up because medically fit patients cannot be discharged until social care is in place.',
    exemplar: 'Scrap the fines and the quota: ambulances queue because the department is full of patients waiting for ward beds, which are full of patients waiting for social care. Make the health board and the council jointly accountable, with a pooled budget, for every day a fit patient waits to leave hospital (#5), and show both a live count of those patients (#6).',
  },
  {
    id: 'up_homeless', title: 'Emergency Accommodation',
    proposal: 'To reduce homelessness, the council will increase the budget for emergency bed-and-breakfast rooms by 25% and double fines for landlords who evict without the correct notice.',
    nodes: ['leverage_parameters', 'leverage_information_flows', 'leverage_rules_incentives'],
    low_leverage: ['a bigger B&B budget (#12, paying for the stock rather than the inflow)', 'bigger fines (#12)'],
    binding_constraint: 'Most households become homeless after months of visible warning signs (arrears, notices) that nobody acts on until crisis.',
    exemplar: 'Instead of buying more emergency rooms, cut the inflow: require landlords and housing associations to notify the council at the first missed rent payment, and give the prevention team a duty and a fund to act within a week (#6 and #5). Every family kept in its home is one fewer that needs a B&B room.',
  },
  {
    id: 'up_outages', title: 'Production Outages',
    proposal: 'To reduce production outages, any engineer who causes an incident must write a formal apology to the leadership team, and the on-call rota will be doubled so incidents are fixed faster.',
    nodes: ['leverage_parameters', 'leverage_information_flows', 'linear_attribution_bias'],
    low_leverage: ['punishing individuals (single-villain thinking)', 'doubling the on-call rota (#12, treating the symptom)'],
    binding_constraint: 'Engineers find out their changes are risky only in production, because there is no realistic test environment and incidents are hidden rather than shared.',
    exemplar: 'Drop the apologies, which teach people to hide incidents: replace them with blameless reviews whose findings are shared with every team (#6). Give each team a staging environment that mirrors production and automatic rollback when error rates spike, so risky changes are caught in minutes instead of by customers (#9, #8).',
  },
  {
    id: 'up_meetings', title: 'Meeting Overload',
    proposal: 'To stop meeting overload, all meetings will be capped at 30 minutes and each manager will be limited to ten meetings a week.',
    nodes: ['leverage_parameters', 'leverage_information_flows', 'leverage_rules_incentives'],
    low_leverage: ['a time cap (#12)', 'a meeting quota (#12)'],
    binding_constraint: 'The person who calls a meeting bears none of its cost; attendees’ time is free to the organiser and invisible to everyone.',
    exemplar: 'Rather than capping meetings, show the cost of each one in salary-hours on the invitation itself, so the organiser sees it before sending (#6). And let anyone decline a meeting without a written agenda, with no explanation required, so organisers have to earn attendance (#5).',
  },
  {
    id: 'up_drought', title: 'Summer Drought',
    proposal: 'To get through the drought, the water company will ask households to cut use by 10% and fine anyone caught using a hosepipe.',
    nodes: ['leverage_parameters', 'leverage_information_flows', 'leverage_rules_incentives'],
    low_leverage: ['an appeal for 10% cuts (#12)', 'fines for hosepipe use (#12, enforcement-dependent)'],
    binding_constraint: 'Households cannot see how much water they use, and the price per litre is the same whether they use a little or a lot.',
    exemplar: 'Fit smart meters that show each household its daily use against similar homes nearby, in real time (#6). Then charge a low price for essential use and a steeply higher price above that, so the people using most face the cost of the shortage (#5).',
  },
  {
    id: 'up_stockouts', title: 'Empty Shelves',
    proposal: 'To stop shops running out of stock, store managers will receive a bonus for every month with zero stockouts, and minimum shelf quantities will be raised by 20%.',
    nodes: ['leverage_parameters', 'leverage_information_flows', 'delays_oscillation'],
    low_leverage: ['a stockout bonus (#12, invites hoarding and over-ordering)', 'higher minimum quantities (#12)'],
    binding_constraint: 'Managers reorder by looking at the shelf, not at what is already on the way, so they over-order during the four-week delivery delay and then cut back.',
    exemplar: 'Drop the bonus, which will make managers hoard: show every manager, on the ordering screen, the stock already ordered but not yet delivered, and subtract it automatically from new orders (#6). Shortening the supplier lead time where possible would damp the swings further (#9).',
  },
];
