// Core data shapes. SystemsDrillItem follows spec §5.1, extended with `steps`
// (bathtub puzzles and leverage triage), `source_narrative`/`candidates`
// (isomorphic match) and an optional `ledger` revealed after a bathtub puzzle.

export type WingId = 'plumbing' | 'pathology' | 'epistemic' | 'leverage';
/** Terminology register: formal (cybernetic) names, intuitive (street) names, or both. */
export type Register = 'dual' | 'formal' | 'intuitive';

export interface TaxonomyNode {
  id: string;
  wing: WingId;
  group: string;
  formal: string;
  intuitive: string;
  summary: string;
  /** Source, attribution or terminology caveats. */
  note?: string;
}

export interface Wing {
  id: WingId;
  numeral: string;
  title: string;
  focus: string;
}

export type DrillType = 'anatomical_dissection' | 'bathtub_puzzle' | 'isomorphic_match' | 'leverage_triage';

export interface PassageSegment {
  id: string;
  text: string;
  /** Structural role shown in the feedback overlay, e.g. stock, inflow, information_delay, target_bathtub_error. */
  system_role: string;
  note?: string;
}

export interface ChoiceOption {
  id: string;
  text: string;
  is_correct: boolean;
  feedback: string;
  /** Leverage triage: the Meadows leverage point (12 = weakest … 1 = strongest) this option operates at. */
  leverage_point?: number;
}

export interface ChoiceQuestion {
  question: string;
  options: ChoiceOption[];
}

export interface TreeStep extends ChoiceQuestion {
  id: string;
  label: string;
}

export interface Narrative {
  domain: string;
  text: string;
}

export interface Candidate extends Narrative {
  id: string;
  is_correct: boolean;
  feedback: string;
}

export interface LedgerLine {
  label: string;
  value: string;
}

export interface DrillItem {
  id: string;
  tier: 'deterministic';
  drill_type: DrillType;
  taxonomy_nodes: string[];
  difficulty_elo: number;
  domain?: string;
  register_tags: { formal: string; intuitive: string };
  prompt_instruction: string;
  passage_segments?: PassageSegment[];
  correct_target_id?: string;
  follow_up_question?: ChoiceQuestion;
  /** Bathtub puzzle and leverage triage: sequential questions. */
  steps?: TreeStep[];
  /** Bathtub puzzle: the worked stock arithmetic, revealed at the end. */
  ledger?: LedgerLine[];
  /** Isomorphic match: the source story and its four alien-domain candidates. */
  source_narrative?: Narrative;
  candidates?: Candidate[];
  explanation_formal: string;
  explanation_intuitive: string;
  /** Where the drill came from: bundled seed or the cloud bank. */
  source?: 'seed' | 'cloud';
}

export interface NodeMastery {
  /** Glicko-2 rating on the familiar ELO scale (default 1200). */
  elo: number;
  /** Glicko rating deviation: how unsure we are of `elo`. */
  rd: number;
  vol: number;
  attempts: number;
  last_practiced: string | null;
  /** FSRS-lite memory stability, in days. */
  stability_days: number;
}

export interface AttemptRecord {
  id: string;
  date: string;
  kind: 'drill' | 'forge' | 'desk' | 'blitz';
  item_id: string;
  nodes: string[];
  score: number;
  /** Time-to-detection for deterministic drills, in ms. */
  ttd_ms?: number;
}

/** The Crisis Desk's five axes, each 0–100. */
export interface DeskScores {
  stock_flow_delay: number;
  loop_archetype: number;
  boundary_posiwid: number;
  leverage: number;
  clarity: number;
}

export interface DeskSummary {
  session_id: string;
  date: string;
  mode: 'blind_autopsy' | 'targeted_calibration';
  domain: string;
  scenario: string;
  persona: string;
  hidden_landmines: string[];
  exposed_landmines: string[];
  /** Landmines exposed before the policy was ratified (the closing turn). */
  exposed_before_ratification: string[];
  scores: DeskScores;
  verdict?: string;
}

export interface SavedItem {
  id: string;
  date: string;
  kind: 'transposition' | 'autopsy' | 'upgrade';
  title: string;
  content: string;
}

export interface UserTelemetry {
  user_id: string;
  preferred_register: Register;
  global_elo: number;
  node_mastery: Record<string, NodeMastery>;
  desk_history: DeskSummary[];
  attempt_log: AttemptRecord[];
  saved_items: SavedItem[];
  updated_at: string;
}

export interface Settings {
  theme: 'auto' | 'light' | 'dark';
  register: Register;
  judge_model: string;
  opponent_model: string;
  word_cap: number;
}
