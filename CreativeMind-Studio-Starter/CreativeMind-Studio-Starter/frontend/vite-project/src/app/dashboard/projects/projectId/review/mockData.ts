/**
 * mockData.ts — Review & Approval Room mock data
 * Final quality-control and governance center for CreativeMind Studio
 */

// ─── Enums & Types ─────────────────────────────────────────────────────────

export type ReviewStatus =
  | 'pending'
  | 'in-review'
  | 'changes-requested'
  | 'approved'
  | 'blocked';

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type RiskRating = 'approved' | 'conditions-apply' | 'replace-or-obtain' | 'unknown';

export type CategoryId =
  | 'research-accuracy'
  | 'script-quality'
  | 'editorial-quality'
  | 'brand-safety'
  | 'ethical-review'
  | 'copyright-licence'
  | 'platform-policy'
  | 'final-approval';

export type ApprovalStepState = 'required' | 'optional' | 'skipped' | 'locked';

// ─── Review Category ────────────────────────────────────────────────────────

export interface ReviewCategory {
  id: CategoryId;
  label: string;
  icon: string;
  description: string;
  completionPercent: number;
  pendingCount: number;
  assignedReviewer: string;
  reviewerInitials: string;
  reviewerColor: string;
  riskSummary: string;
  riskRating: RiskRating;
  stepState: ApprovalStepState;
}

export const REVIEW_CATEGORIES: ReviewCategory[] = [
  {
    id: 'research-accuracy',
    label: 'Research Accuracy',
    icon: 'microscope',
    description: 'Fact-checking, source validation, and statistical accuracy.',
    completionPercent: 100,
    pendingCount: 0,
    assignedReviewer: 'Dr. Priya Mehta',
    reviewerInitials: 'PM',
    reviewerColor: '#06B6D4',
    riskSummary: 'All 12 claims verified. 2 upgraded to Tier-1 sources.',
    riskRating: 'approved',
    stepState: 'required',
  },
  {
    id: 'script-quality',
    label: 'Script Quality',
    icon: 'file-text',
    description: 'Narrative structure, tone, readability, and messaging clarity.',
    completionPercent: 85,
    pendingCount: 2,
    assignedReviewer: 'James Rafferty',
    reviewerInitials: 'JR',
    reviewerColor: '#8B5CF6',
    riskSummary: '2 sections require rewording. CTA language under review.',
    riskRating: 'conditions-apply',
    stepState: 'required',
  },
  {
    id: 'editorial-quality',
    label: 'Editorial Quality',
    icon: 'edit-3',
    description: 'Grammar, consistency, phrasing, and editorial standards.',
    completionPercent: 90,
    pendingCount: 1,
    assignedReviewer: 'Sarah Kim',
    reviewerInitials: 'SK',
    reviewerColor: '#10B981',
    riskSummary: 'Minor phrasing inconsistencies in scenes 2–3. One flagged for review.',
    riskRating: 'conditions-apply',
    stepState: 'required',
  },
  {
    id: 'brand-safety',
    label: 'Brand Safety',
    icon: 'shield',
    description: 'Brand tone, visual identity compliance, and messaging safety.',
    completionPercent: 100,
    pendingCount: 0,
    assignedReviewer: 'Carlos Vega',
    reviewerInitials: 'CV',
    reviewerColor: '#3B82F6',
    riskSummary: 'All brand guidelines met. Logo usage and color palette approved.',
    riskRating: 'approved',
    stepState: 'required',
  },
  {
    id: 'ethical-review',
    label: 'Ethical Review',
    icon: 'balance-scale',
    description: 'Sensitivity, representation, and ethical sourcing.',
    completionPercent: 60,
    pendingCount: 3,
    assignedReviewer: 'Amara Osei',
    reviewerInitials: 'AO',
    reviewerColor: '#F59E0B',
    riskSummary: 'Community representation review ongoing. 3 items need clarification.',
    riskRating: 'conditions-apply',
    stepState: 'required',
  },
  {
    id: 'copyright-licence',
    label: 'Copyright & Licence',
    icon: 'copyright',
    description: 'Asset licences, attribution requirements, and usage rights.',
    completionPercent: 45,
    pendingCount: 4,
    assignedReviewer: 'Legal Team',
    reviewerInitials: 'LT',
    reviewerColor: '#EF4444',
    riskSummary: '2 assets require replacement or licence purchase. 4 awaiting proof.',
    riskRating: 'replace-or-obtain',
    stepState: 'required',
  },
  {
    id: 'platform-policy',
    label: 'Platform Policy',
    icon: 'monitor-check',
    description: 'YouTube, platform-specific guidelines, and community standards.',
    completionPercent: 75,
    pendingCount: 1,
    assignedReviewer: 'Mia Torres',
    reviewerInitials: 'MT',
    reviewerColor: '#EC4899',
    riskSummary: 'Thumbnail text density may trigger demonetisation. Under review.',
    riskRating: 'conditions-apply',
    stepState: 'required',
  },
  {
    id: 'final-approval',
    label: 'Final Project Approval',
    icon: 'check-circle',
    description: 'Executive sign-off and production readiness certification.',
    completionPercent: 0,
    pendingCount: 1,
    assignedReviewer: 'Executive Producer',
    reviewerInitials: 'EP',
    reviewerColor: '#94A3B8',
    riskSummary: 'Blocked — 3 upstream approvals still pending.',
    riskRating: 'unknown',
    stepState: 'locked',
  },
];

// ─── Review Item ────────────────────────────────────────────────────────────

export interface LinkedClaim {
  id: string;
  text: string;
  sceneId: string;
  confidence: number;
  verified: boolean;
}

export interface LinkedSource {
  id: string;
  title: string;
  author: string;
  type: string;
  url?: string;
}

export interface RevisionEntry {
  id: string;
  action: string;
  detail: string;
  user: string;
  timestamp: string;
}

export interface ReviewItem {
  id: string;
  categoryId: CategoryId;
  reviewerName: string;
  reviewerInitials: string;
  reviewerColor: string;
  reviewerRole: string;
  status: ReviewStatus;
  severity: SeverityLevel;
  comment: string;
  linkedClaim: string;
  linkedScene: string;
  linkedAsset: string;
  suggestedAction: string;
  timestamp: string;
  detailedComment: string;
  linkedClaims: LinkedClaim[];
  linkedSources: LinkedSource[];
  linkedAssets: string[];
  linkedScriptSections: string[];
  recommendedActions: string[];
  revisionHistory: RevisionEntry[];
}

export const REVIEW_ITEMS: ReviewItem[] = [
  {
    id: 'rv-001',
    categoryId: 'research-accuracy',
    reviewerName: 'Dr. Priya Mehta',
    reviewerInitials: 'PM',
    reviewerColor: '#06B6D4',
    reviewerRole: 'Chief Research Officer',
    status: 'approved',
    severity: 'info',
    comment: 'All WHO water statistics verified against 2023 annual report. Confidence score upgraded to 98%.',
    linkedClaim: 'WHO: 2.3 billion people lack clean water access',
    linkedScene: 'Scene 01 — Opening Hook',
    linkedAsset: 'WHO_WaterReport_2023.pdf',
    suggestedAction: 'No action required. Approved for production.',
    timestamp: '2 hours ago',
    detailedComment: 'The primary statistic "2.3 billion people lack clean water" has been cross-referenced against the WHO/UNICEF Joint Monitoring Programme 2023 report (page 12) and the UNICEF State of the World\'s Children report (page 7). Both sources corroborate the figure within a 2% variance. The figure was also validated against the World Bank Development Indicators database. Confidence rating: 98%. Source tier: Tier 1 (UN Agency). Recommend inclusion of the year qualifier in on-screen text for precision.',
    linkedClaims: [
      { id: 'cl-01', text: '2.3 billion people lack clean water access (2023)', sceneId: 'sc-001', confidence: 98, verified: true },
      { id: 'cl-02', text: 'Water scarcity affects 40% of global population seasonally', sceneId: 'sc-001', confidence: 92, verified: true },
    ],
    linkedSources: [
      { id: 'src-01', title: 'WHO/UNICEF JMP Progress Report 2023', author: 'World Health Organization', type: 'UN Report', url: 'https://who.int' },
      { id: 'src-02', title: 'State of the World\'s Children', author: 'UNICEF', type: 'Annual Report' },
    ],
    linkedAssets: ['WHO_WaterReport_2023.pdf', 'UNICEF_Data_2023.xlsx'],
    linkedScriptSections: ['Section 1.1 — Opening narration', 'Section 1.3 — Statistic display'],
    recommendedActions: ['Add year qualifier to on-screen stat text', 'Include source citation overlay'],
    revisionHistory: [
      { id: 'rh-01', action: 'Claim verified', detail: 'WHO 2023 report cross-referenced', user: 'Dr. Priya Mehta', timestamp: '3 hours ago' },
      { id: 'rh-02', action: 'Status changed', detail: 'In Review → Approved', user: 'Dr. Priya Mehta', timestamp: '2 hours ago' },
    ],
  },
  {
    id: 'rv-002',
    categoryId: 'script-quality',
    reviewerName: 'James Rafferty',
    reviewerInitials: 'JR',
    reviewerColor: '#8B5CF6',
    reviewerRole: 'Senior Script Editor',
    status: 'changes-requested',
    severity: 'medium',
    comment: 'CTA language "You just witnessed the future" is hyperbolic. Recommend toning down to meet editorial standards.',
    linkedClaim: 'Scene 6 CTA language review',
    linkedScene: 'Scene 06 — Call to Action',
    linkedAsset: 'Script_v4_Final.docx',
    suggestedAction: 'Revise CTA opening line. Soften superlative claims. Present to editorial for re-review.',
    timestamp: '4 hours ago',
    detailedComment: 'The CTA in Scene 6 opens with "You just witnessed the future of water" which uses an absolute superlative that may be perceived as hyperbole by informed viewers, potentially undermining credibility. Additionally, the phrase "the future" implies exclusivity of solution which is misleading — multiple AWG initiatives exist globally. Recommend rewriting as "You\'ve just seen one powerful solution to the global water crisis." The fund link language also needs a disclaimer that it is a third-party funding platform.',
    linkedClaims: [
      { id: 'cl-03', text: '"Future of water" claim — unqualified superlative', sceneId: 'sc-006', confidence: 40, verified: false },
    ],
    linkedSources: [
      { id: 'src-03', title: 'CreativeMind Editorial Standards v2.1', author: 'Editorial Board', type: 'Internal Policy' },
    ],
    linkedAssets: ['Script_v4_Final.docx', 'CTA_Scene6_Draft.txt'],
    linkedScriptSections: ['Section 6.1 — CTA opening', 'Section 6.3 — Fund link copy'],
    recommendedActions: [
      'Rewrite "future of water" → "a solution to the water crisis"',
      'Add third-party disclaimer to fund link',
      'Re-submit for editorial review after changes',
    ],
    revisionHistory: [
      { id: 'rh-03', action: 'Review assigned', detail: 'Assigned to James Rafferty', user: 'System', timestamp: '6 hours ago' },
      { id: 'rh-04', action: 'Changes requested', detail: 'Hyperbolic CTA language flagged', user: 'James Rafferty', timestamp: '4 hours ago' },
    ],
  },
  {
    id: 'rv-003',
    categoryId: 'editorial-quality',
    reviewerName: 'Sarah Kim',
    reviewerInitials: 'SK',
    reviewerColor: '#10B981',
    reviewerRole: 'Managing Editor',
    status: 'in-review',
    severity: 'low',
    comment: 'Scene 3 narration uses inconsistent terminology between "atmospheric water generation" and "moisture harvesting". Standardise terminology throughout.',
    linkedClaim: 'Terminology consistency — AWG definition',
    linkedScene: 'Scene 03 — How It Works',
    linkedAsset: 'Script_v4_Final.docx',
    suggestedAction: 'Standardise all references to "Atmospheric Water Generation (AWG)" on first use, then "AWG" thereafter.',
    timestamp: '5 hours ago',
    detailedComment: 'The script alternates between three terms for the same technology: "atmospheric water generation", "moisture harvesting", and "air-to-water technology". This inconsistency may confuse viewers and weaken the perceived authority of the content. Technical accuracy review confirms the standard industry term is "Atmospheric Water Generation (AWG)". All three usages should be standardised per the first instance convention used in the voiceover script.',
    linkedClaims: [],
    linkedSources: [
      { id: 'src-04', title: 'AWG Industry Terminology Standard 2022', author: 'IDA Water Technology Council', type: 'Industry Standard' },
    ],
    linkedAssets: ['Script_v4_Final.docx'],
    linkedScriptSections: ['Section 3.1', 'Section 3.2', 'Section 3.4'],
    recommendedActions: [
      'Replace "moisture harvesting" with "AWG"',
      'Replace "air-to-water technology" with "AWG"',
      'Add parenthetical on first use: "Atmospheric Water Generation (AWG)"',
    ],
    revisionHistory: [
      { id: 'rh-05', action: 'Review started', detail: 'Editorial pass initiated', user: 'Sarah Kim', timestamp: '5 hours ago' },
    ],
  },
  {
    id: 'rv-004',
    categoryId: 'brand-safety',
    reviewerName: 'Carlos Vega',
    reviewerInitials: 'CV',
    reviewerColor: '#3B82F6',
    reviewerRole: 'Brand Director',
    status: 'approved',
    severity: 'info',
    comment: 'Full brand safety audit passed. Logo, color palette, typography, and tone all comply with brand guidelines v3.2.',
    linkedClaim: 'Brand identity compliance check',
    linkedScene: 'All scenes',
    linkedAsset: 'BrandGuide_v3.2.pdf',
    suggestedAction: 'No action required. Approved.',
    timestamp: '1 day ago',
    detailedComment: 'Complete brand safety audit has been performed across all 6 scenes. Verified: logo usage (correct clearspace and no distortion), color palette (all hex codes within approved range), typography (Inter and Space Grotesk only), tone of voice (empowering, factual, not alarmist), and music mood (approved "Hopeful/Inspiring" category). No brand safety violations detected. Content is cleared for final production.',
    linkedClaims: [],
    linkedSources: [
      { id: 'src-05', title: 'CreativeMind Brand Guidelines v3.2', author: 'Brand Team', type: 'Internal Guide' },
    ],
    linkedAssets: ['BrandGuide_v3.2.pdf', 'LogoUsage_Approval.png'],
    linkedScriptSections: ['All sections'],
    recommendedActions: [],
    revisionHistory: [
      { id: 'rh-06', action: 'Audit completed', detail: 'Full brand safety audit passed', user: 'Carlos Vega', timestamp: '1 day ago' },
      { id: 'rh-07', action: 'Approved', detail: 'Brand safety cleared', user: 'Carlos Vega', timestamp: '1 day ago' },
    ],
  },
  {
    id: 'rv-005',
    categoryId: 'ethical-review',
    reviewerName: 'Amara Osei',
    reviewerInitials: 'AO',
    reviewerColor: '#F59E0B',
    reviewerRole: 'Ethics & Inclusion Advisor',
    status: 'changes-requested',
    severity: 'high',
    comment: 'Scene 4 shows documentary footage of Kenyan village without confirmed community consent documentation on file.',
    linkedClaim: 'Community consent — Nakuru County deployment footage',
    linkedScene: 'Scene 04 — Real-World Impact',
    linkedAsset: 'Kenya_Village_GoldenHour.mp4',
    suggestedAction: 'Obtain signed community consent release or replace footage with alternative that has confirmed consent documentation.',
    timestamp: '6 hours ago',
    detailedComment: 'Scene 4 features documentary footage of families and a village elder from Nakuru County, Kenya. Standard ethical practice requires documented informed consent from all identifiable individuals and community leadership. The production team has not provided consent documentation for this footage on file in the asset room. This is a HIGH severity issue — publishing identifiable individuals without consent exposes the production to reputational risk and potential legal liability. Additionally, the "hero-saviour" narrative framing should be reviewed to ensure it centres community agency rather than external intervention.',
    linkedClaims: [
      { id: 'cl-04', text: '847 families in Nakuru County have clean water on demand', sceneId: 'sc-004', confidence: 85, verified: false },
    ],
    linkedSources: [
      { id: 'src-06', title: 'CreativeMind Ethical Content Guidelines', author: 'Ethics Board', type: 'Internal Policy' },
      { id: 'src-07', title: 'Video Ethics — Community Consent Standards', author: 'IJNet', type: 'Industry Standard' },
    ],
    linkedAssets: ['Kenya_Village_GoldenHour.mp4', 'Testimonial_Elder_v2.mp4'],
    linkedScriptSections: ['Section 4.1 — Village sequence', 'Section 4.2 — Testimonial'],
    recommendedActions: [
      'Obtain signed community consent form for all identifiable individuals',
      'Document consent in the asset room under "Consent_Kenya_Shoot"',
      'Review and revise narrative framing to centre community agency',
      'If consent cannot be obtained, source alternative footage with confirmed consent',
    ],
    revisionHistory: [
      { id: 'rh-08', action: 'Issue raised', detail: 'Missing consent documentation flagged', user: 'Amara Osei', timestamp: '6 hours ago' },
      { id: 'rh-09', action: 'Severity escalated', detail: 'Low → High severity', user: 'Amara Osei', timestamp: '6 hours ago' },
    ],
  },
  {
    id: 'rv-006',
    categoryId: 'copyright-licence',
    reviewerName: 'Legal Team',
    reviewerInitials: 'LT',
    reviewerColor: '#EF4444',
    reviewerRole: 'Rights & Licensing',
    status: 'blocked',
    severity: 'critical',
    comment: 'Getty Images footage (Children_Walk_Stock.mp4) is editorial-use only. Commercial publication requires separate licence or replacement.',
    linkedClaim: 'Commercial licence required — Getty stock footage',
    linkedScene: 'Scene 01 — Opening Hook',
    linkedAsset: 'Children_Walk_Stock.mp4',
    suggestedAction: 'Purchase commercial licence from Getty (est. $450–$1,200) or replace with UNICEF Open Media Library equivalent (free, CC-BY).',
    timestamp: '8 hours ago',
    detailedComment: 'The footage "Children_Walk_Stock.mp4" is sourced from Getty Images under an Editorial Use licence (Licence #GI-2024-1847-E). Editorial licences explicitly prohibit commercial use, advertising, or revenue-generating distribution. YouTube monetisation and branded content qualify as commercial use under Getty\'s terms. Production must either: (1) purchase a commercial rights-managed licence from Getty — estimated cost $450–$1,200 depending on territory and duration — or (2) replace with functionally equivalent footage from UNICEF\'s Open Media Library (OML), which is licensed under CC-BY 4.0 for commercial use with attribution. The Shutterstock shipping footage (Shipping_Broll.mp4 in Scene 5) also carries identical risk and must be resolved simultaneously.',
    linkedClaims: [],
    linkedSources: [
      { id: 'src-08', title: 'Getty Images Editorial Licence Terms', author: 'Getty Images', type: 'Licence Agreement' },
      { id: 'src-09', title: 'UNICEF Open Media Library — Usage Rights', author: 'UNICEF', type: 'Licence Terms' },
    ],
    linkedAssets: ['Children_Walk_Stock.mp4', 'Shipping_Broll.mp4'],
    linkedScriptSections: ['Section 1.2 — Documentary sequence'],
    recommendedActions: [
      'Option A: Purchase Getty commercial licence (est. $450–$1,200)',
      'Option B: Replace with UNICEF OML footage (free, CC-BY 4.0)',
      'Resolve Shipping_Broll.mp4 simultaneously (same risk category)',
      'Store licence proof in asset room before final approval',
    ],
    revisionHistory: [
      { id: 'rh-10', action: 'Issue identified', detail: 'Editorial-only licence detected', user: 'Legal Team', timestamp: '8 hours ago' },
      { id: 'rh-11', action: 'Status set to Blocked', detail: 'Licence mismatch — commercial use', user: 'Legal Team', timestamp: '8 hours ago' },
    ],
  },
  {
    id: 'rv-007',
    categoryId: 'platform-policy',
    reviewerName: 'Mia Torres',
    reviewerInitials: 'MT',
    reviewerColor: '#EC4899',
    reviewerRole: 'Platform Strategy Lead',
    status: 'in-review',
    severity: 'medium',
    comment: 'Thumbnail text density exceeds YouTube\'s recommended maximum. May reduce CTR and trigger algorithmic demotion.',
    linkedClaim: 'YouTube thumbnail best-practice compliance',
    linkedScene: 'Thumbnail & end card',
    linkedAsset: 'EndCard_Template_v4.ae',
    suggestedAction: 'Reduce thumbnail text to 30% of frame area. Use single strong keyword. Test 3 A/B variants before publication.',
    timestamp: '3 hours ago',
    detailedComment: 'Current thumbnail design includes full title text (18 words), subtitle, and logo watermark, covering approximately 65% of the thumbnail frame. YouTube\'s Creator Academy guidelines recommend maximum 20–30% text coverage for optimal CTR. Additionally, the description meta contains 47 hashtags which exceeds YouTube\'s recommended maximum of 15 and may be penalised by the search algorithm. The video description also references a third-party funding link on line 1 — YouTube policy restricts promotional links in the first 100 characters. These issues collectively risk algorithmic suppression at launch.',
    linkedClaims: [],
    linkedSources: [
      { id: 'src-10', title: 'YouTube Creator Academy — Thumbnails', author: 'YouTube', type: 'Platform Policy' },
      { id: 'src-11', title: 'YouTube Hashtag Policy 2024', author: 'YouTube', type: 'Platform Policy' },
    ],
    linkedAssets: ['Thumbnail_v3.psd', 'EndCard_Template_v4.ae'],
    linkedScriptSections: ['Description copy draft', 'End card sequence'],
    recommendedActions: [
      'Reduce thumbnail text to ≤30% frame coverage',
      'Limit hashtags to 8–10 most relevant',
      'Move fund link to position 3+ in description',
      'Create 3 A/B thumbnail variants for testing',
    ],
    revisionHistory: [
      { id: 'rh-12', action: 'Policy audit', detail: 'YouTube policy compliance check initiated', user: 'Mia Torres', timestamp: '3 hours ago' },
    ],
  },
  {
    id: 'rv-008',
    categoryId: 'final-approval',
    reviewerName: 'Executive Producer',
    reviewerInitials: 'EP',
    reviewerColor: '#94A3B8',
    reviewerRole: 'Executive Producer',
    status: 'pending',
    severity: 'info',
    comment: 'Final approval locked pending resolution of: copyright issues (Scene 1, 5), ethical review items, and platform policy compliance.',
    linkedClaim: 'Production readiness gate',
    linkedScene: 'All scenes',
    linkedAsset: 'All assets',
    suggestedAction: 'Resolve all CRITICAL and HIGH severity items before requesting final executive approval.',
    timestamp: '1 day ago',
    detailedComment: 'Final approval cannot proceed until all upstream approval gates are cleared. Current blockers: (1) Copyright & Licence — 2 assets require replacement or commercial licence, (2) Ethical Review — community consent documentation required for Scene 4, (3) Platform Policy — thumbnail and description revisions required. Once these 3 items are resolved, the executive sign-off workflow will be unlocked. Estimated resolution time: 2–3 business days pending legal counsel response on Getty licence pricing.',
    linkedClaims: [],
    linkedSources: [],
    linkedAssets: ['All project assets'],
    linkedScriptSections: ['All sections'],
    recommendedActions: [
      'Resolve rv-006: Getty licence or footage replacement',
      'Resolve rv-005: Obtain community consent documentation',
      'Resolve rv-007: Thumbnail and description revisions',
      'Then: Request executive approval sign-off',
    ],
    revisionHistory: [
      { id: 'rh-13', action: 'Gate created', detail: 'Final approval gate initialised', user: 'System', timestamp: '1 day ago' },
    ],
  },
];

// ─── Rights Audit Table ─────────────────────────────────────────────────────

export type RiskRatingRow = 'low' | 'medium' | 'high' | 'critical';

export interface AuditRow {
  id: string;
  asset: string;
  assetType: string;
  licence: string;
  commercialUse: boolean | 'conditional';
  attributionRequired: boolean;
  modificationAllowed: boolean | 'conditional';
  publisher: string;
  proofStored: boolean;
  riskRating: RiskRatingRow;
  notes?: string;
}

export const AUDIT_ROWS: AuditRow[] = [
  { id: 'au-01', asset: 'Drone_Riverbed_4K.mp4', assetType: 'footage', licence: 'Creative Commons CC-BY', commercialUse: true, attributionRequired: true, modificationAllowed: true, publisher: 'Pexels', proofStored: true, riskRating: 'low' },
  { id: 'au-02', asset: 'Children_Walk_Stock.mp4', assetType: 'footage', licence: 'Getty Editorial Only', commercialUse: false, attributionRequired: true, modificationAllowed: false, publisher: 'Getty Images', proofStored: true, riskRating: 'critical', notes: 'Commercial use BLOCKED — requires licence upgrade or replacement' },
  { id: 'au-03', asset: 'Interview_DrOsei_RAW_A.mp4', assetType: 'footage', licence: 'Owned — Talent Release', commercialUse: true, attributionRequired: false, modificationAllowed: true, publisher: 'CreativeMind Studios', proofStored: true, riskRating: 'low' },
  { id: 'au-04', asset: 'Technical_Diagram_v2.ae', assetType: 'graphic', licence: 'Owned — Original Work', commercialUse: true, attributionRequired: false, modificationAllowed: true, publisher: 'CreativeMind Studios', proofStored: true, riskRating: 'low' },
  { id: 'au-05', asset: 'AWG_Explainer_v3.ae', assetType: 'graphic', licence: 'AI Generated — Midjourney ToS', commercialUse: 'conditional', attributionRequired: false, modificationAllowed: true, publisher: 'Midjourney', proofStored: false, riskRating: 'medium', notes: 'Pro plan required for commercial use. Verify subscription tier.' },
  { id: 'au-06', asset: 'Kenya_Village_GoldenHour.mp4', assetType: 'footage', licence: 'Owned — Consent Required', commercialUse: 'conditional', attributionRequired: false, modificationAllowed: true, publisher: 'CreativeMind Studios', proofStored: false, riskRating: 'high', notes: 'Community consent documentation MISSING' },
  { id: 'au-07', asset: 'Intro_Music_Epic.wav', assetType: 'audio', licence: 'Artlist Annual Licence', commercialUse: true, attributionRequired: false, modificationAllowed: true, publisher: 'Artlist', proofStored: true, riskRating: 'low' },
  { id: 'au-08', asset: 'Shipping_Broll.mp4', assetType: 'footage', licence: 'Shutterstock Standard', commercialUse: 'conditional', attributionRequired: false, modificationAllowed: false, publisher: 'Shutterstock', proofStored: true, riskRating: 'high', notes: 'Standard licence excludes broadcast. Confirm distribution channel scope.' },
  { id: 'au-09', asset: 'World_Map_Animation.ae', assetType: 'graphic', licence: 'AI Generated — pending', commercialUse: 'conditional', attributionRequired: false, modificationAllowed: true, publisher: 'Unknown', proofStored: false, riskRating: 'medium', notes: 'Licence not yet determined for AI-generated asset.' },
  { id: 'au-10', asset: 'Host_CTA_Take3.mp4', assetType: 'footage', licence: 'Owned — Talent Release', commercialUse: true, attributionRequired: false, modificationAllowed: true, publisher: 'CreativeMind Studios', proofStored: true, riskRating: 'low' },
  { id: 'au-11', asset: 'EndCard_Template_v4.ae', assetType: 'graphic', licence: 'Owned — Original Work', commercialUse: true, attributionRequired: false, modificationAllowed: true, publisher: 'CreativeMind Studios', proofStored: true, riskRating: 'low' },
  { id: 'au-12', asset: 'Testimonial_Elder_v2.mp4', assetType: 'footage', licence: 'Owned — Consent Required', commercialUse: 'conditional', attributionRequired: false, modificationAllowed: false, publisher: 'CreativeMind Studios', proofStored: false, riskRating: 'critical', notes: 'Identifiable individual — consent documentation MISSING' },
];

// ─── Approval Checklist ─────────────────────────────────────────────────────

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  status: 'approved' | 'pending' | 'failed' | 'in-progress';
  stepState: ApprovalStepState;
  reviewer: string;
  completedAt?: string;
  blockers?: string[];
}

export const APPROVAL_CHECKLIST: ChecklistItem[] = [
  { id: 'chk-01', label: 'Research Approved', description: 'All factual claims verified by Chief Research Officer.', status: 'approved', stepState: 'required', reviewer: 'Dr. Priya Mehta', completedAt: '2 hours ago' },
  { id: 'chk-02', label: 'Script Approved', description: 'Script quality, narrative, and messaging cleared by senior editor.', status: 'in-progress', stepState: 'required', reviewer: 'James Rafferty', blockers: ['CTA language revision pending'] },
  { id: 'chk-03', label: 'Editorial Approved', description: 'Grammar, consistency, and editorial standards met.', status: 'in-progress', stepState: 'required', reviewer: 'Sarah Kim', blockers: ['Terminology standardisation in progress'] },
  { id: 'chk-04', label: 'Brand Safety Passed', description: 'All brand guidelines and tone-of-voice standards met.', status: 'approved', stepState: 'required', reviewer: 'Carlos Vega', completedAt: '1 day ago' },
  { id: 'chk-05', label: 'Ethical Review Passed', description: 'Sensitivity, representation, and community consent verified.', status: 'failed', stepState: 'required', reviewer: 'Amara Osei', blockers: ['Community consent documentation missing for Scene 4', 'Narrative framing review outstanding'] },
  { id: 'chk-06', label: 'Copyright Cleared', description: 'All asset licences verified for commercial distribution.', status: 'failed', stepState: 'required', reviewer: 'Legal Team', blockers: ['Getty footage requires commercial licence or replacement', 'Community consent missing for 2 footage assets', 'Proof-of-licence not stored for AI assets'] },
  { id: 'chk-07', label: 'Platform Policy Passed', description: 'YouTube and target platform policies reviewed and met.', status: 'in-progress', stepState: 'required', reviewer: 'Mia Torres', blockers: ['Thumbnail text density exceeds recommendation', 'Hashtag count to be reduced'] },
  { id: 'chk-08', label: 'Assets Approved', description: 'All linked assets reviewed and cleared by asset team.', status: 'in-progress', stepState: 'required', reviewer: 'Asset Team', blockers: ['2 assets pending replacement', '3 assets missing proof-of-licence'] },
  { id: 'chk-09', label: 'Sources Verified', description: 'All cited sources cross-referenced and confidence scores assigned.', status: 'approved', stepState: 'required', reviewer: 'Dr. Priya Mehta', completedAt: '3 hours ago' },
];

// ─── Activity Timeline ──────────────────────────────────────────────────────

export type ActivityType =
  | 'approved'
  | 'rejected'
  | 'changes-requested'
  | 'comment'
  | 'assigned'
  | 'blocked'
  | 'resolved'
  | 'started';

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  detail: string;
  user: string;
  userInitials: string;
  userColor: string;
  timestamp: string;
  categoryId?: CategoryId;
}

export const ACTIVITY_TIMELINE: ActivityEvent[] = [
  { id: 'act-01', type: 'approved', title: 'Research approved', detail: 'All 12 claims verified against Tier-1 sources. Confidence avg: 96%.', user: 'Dr. Priya Mehta', userInitials: 'PM', userColor: '#06B6D4', timestamp: '2 hours ago', categoryId: 'research-accuracy' },
  { id: 'act-02', type: 'approved', title: 'Sources verified', detail: '9 sources cross-referenced. All confidence scores above 88%.', user: 'Dr. Priya Mehta', userInitials: 'PM', userColor: '#06B6D4', timestamp: '3 hours ago', categoryId: 'research-accuracy' },
  { id: 'act-03', type: 'changes-requested', title: 'Script changes requested', detail: 'CTA language flagged as hyperbolic. Revision required before approval.', user: 'James Rafferty', userInitials: 'JR', userColor: '#8B5CF6', timestamp: '4 hours ago', categoryId: 'script-quality' },
  { id: 'act-04', type: 'started', title: 'Editorial review started', detail: 'Terminology consistency check initiated across all 6 scenes.', user: 'Sarah Kim', userInitials: 'SK', userColor: '#10B981', timestamp: '5 hours ago', categoryId: 'editorial-quality' },
  { id: 'act-05', type: 'blocked', title: 'Copyright issue detected', detail: 'Getty editorial licence does not cover commercial YouTube publication.', user: 'Legal Team', userInitials: 'LT', userColor: '#EF4444', timestamp: '8 hours ago', categoryId: 'copyright-licence' },
  { id: 'act-06', type: 'changes-requested', title: 'Ethical review — consent missing', detail: 'Community consent documentation required for Kenya documentary footage.', user: 'Amara Osei', userInitials: 'AO', userColor: '#F59E0B', timestamp: '6 hours ago', categoryId: 'ethical-review' },
  { id: 'act-07', type: 'approved', title: 'Brand safety cleared', detail: 'All brand guidelines met. Logo, colour, and tone approved.', user: 'Carlos Vega', userInitials: 'CV', userColor: '#3B82F6', timestamp: '1 day ago', categoryId: 'brand-safety' },
  { id: 'act-08', type: 'comment', title: 'Platform policy audit started', detail: 'Thumbnail and description compliance review underway for YouTube.', user: 'Mia Torres', userInitials: 'MT', userColor: '#EC4899', timestamp: '3 hours ago', categoryId: 'platform-policy' },
  { id: 'act-09', type: 'assigned', title: 'Final approval gate created', detail: 'Executive sign-off gate initialised. Locked until upstream items resolved.', user: 'System', userInitials: 'SY', userColor: '#94A3B8', timestamp: '1 day ago', categoryId: 'final-approval' },
];

// ─── Configurable approval flow ─────────────────────────────────────────────

export const APPROVAL_FLOW_CONFIG: Record<CategoryId, { stepState: ApprovalStepState; orderIndex: number }> = {
  'research-accuracy': { stepState: 'required', orderIndex: 1 },
  'script-quality':    { stepState: 'required', orderIndex: 2 },
  'editorial-quality': { stepState: 'required', orderIndex: 3 },
  'brand-safety':      { stepState: 'required', orderIndex: 4 },
  'ethical-review':    { stepState: 'required', orderIndex: 5 },
  'copyright-licence': { stepState: 'required', orderIndex: 6 },
  'platform-policy':   { stepState: 'required', orderIndex: 7 },
  'final-approval':    { stepState: 'locked',   orderIndex: 8 },
};

// ─── Project metadata ───────────────────────────────────────────────────────

export const REVIEW_PROJECT = {
  title: 'The Water Revolution',
  version: 'v4.1',
  stage: 'Pre-Production Review',
  totalReviews: REVIEW_ITEMS.length,
  blockedCount: REVIEW_ITEMS.filter(r => r.status === 'blocked').length,
  pendingCount: REVIEW_ITEMS.filter(r => r.status === 'pending' || r.status === 'in-review').length,
  approvedCount: REVIEW_ITEMS.filter(r => r.status === 'approved').length,
  overallReadiness: 38, // % — computed from checklist
  readyToPublish: false,
};
