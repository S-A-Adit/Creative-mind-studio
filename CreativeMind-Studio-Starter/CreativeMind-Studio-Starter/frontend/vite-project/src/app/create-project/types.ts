/**
 * types.ts — All TypeScript types for the Project Creation Flow.
 */

// ─── Step IDs ─────────────────────────────────────────────────────────────────

export type WizardStepId = 1 | 2 | 3 | 4;

export interface WizardStep {
  id: WizardStepId;
  label: string;
  description: string;
}

// ─── Step 1 — Basic Information ───────────────────────────────────────────────

export type ContentCategory =
  | 'youtube'
  | 'podcast'
  | 'blog'
  | 'social-media'
  | 'newsletter'
  | 'documentary'
  | 'advertisement'
  | 'other';

export type TargetPlatform =
  | 'youtube'
  | 'instagram'
  | 'tiktok'
  | 'twitter-x'
  | 'linkedin'
  | 'spotify'
  | 'website'
  | 'other';

export type PrimaryGoal =
  | 'brand-awareness'
  | 'lead-generation'
  | 'education'
  | 'entertainment'
  | 'community-building'
  | 'sales'
  | 'thought-leadership'
  | 'other';

export interface Step1Data {
  projectTitle: string;
  description: string;
  contentCategory: ContentCategory | '';
  targetPlatform: TargetPlatform | '';
  targetAudience: string;
  primaryGoal: PrimaryGoal | '';
}

// ─── Step 2 — Creative Idea ───────────────────────────────────────────────────

export type ToneOption =
  | 'professional'
  | 'casual'
  | 'humorous'
  | 'educational'
  | 'inspirational'
  | 'controversial'
  | 'storytelling'
  | 'documentary';

export type LanguageOption =
  | 'english'
  | 'arabic'
  | 'spanish'
  | 'french'
  | 'german'
  | 'portuguese'
  | 'japanese'
  | 'chinese';

export type DurationOption =
  | 'under-1min'
  | '1-3min'
  | '3-10min'
  | '10-20min'
  | '20-60min'
  | 'over-60min';

export interface Step2Data {
  rawIdea: string;
  desiredDuration: DurationOption | '';
  tone: ToneOption | '';
  language: LanguageOption | '';
  deadline: string;
}

// ─── Step 3 — Team & Resources ───────────────────────────────────────────────

export interface TeamMember {
  id: string;
  email: string;
  role: 'editor' | 'viewer' | 'admin';
}

export interface ReferenceLink {
  id: string;
  url: string;
  label: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  category: 'research' | 'document' | 'brand-kit';
}

export interface Step3Data {
  teamMembers: TeamMember[];
  referenceLinks: ReferenceLink[];
  uploadedFiles: UploadedFile[];
}

// ─── Step 4 — Start Options ───────────────────────────────────────────────────

export type StartOptionId =
  | 'blank'
  | 'template'
  | 'import-script'
  | 'upload-research'
  | 'simple-idea';

export interface Step4Data {
  selectedStartOption: StartOptionId | null;
}

// ─── Combined Wizard Form Data ────────────────────────────────────────────────

export interface ProjectWizardData {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
}

// ─── Validation ───────────────────────────────────────────────────────────────

export type ValidationErrors = Partial<Record<string, string>>;

// ─── Right Sidebar ────────────────────────────────────────────────────────────

export interface SuggestedAgent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'ready' | 'standby' | 'queued';
}

export interface WorkflowStage {
  id: string;
  label: string;
  durationDays: number;
  status: 'planned' | 'active' | 'blocked';
}
