/**
 * mockData.ts — Complete realistic mock data for the Script & Story Room.
 *
 * ⚠️  SIMULATED DATA — Not live. Used for UI development and demonstration only.
 */

import type {
  ScriptRoomData,
  StoryWriter,
  ScriptBlock,
  LinkedSource,
  BlockInspectorData,
} from './types';

// ─── Writers ──────────────────────────────────────────────────────────────────

const WRITERS: StoryWriter[] = [
  { id: 'w1', name: 'NarratorAI',   initials: 'NA', color: '#8B5CF6', isAi: true  },
  { id: 'w2', name: 'Layla Hassan', initials: 'LH', color: '#06B6D4', isAi: false },
  { id: 'w3', name: 'Marco Vitali', initials: 'MV', color: '#10B981', isAi: false },
  { id: 'w4', name: 'ScriptBot',    initials: 'SB', color: '#F59E0B', isAi: true  },
];

// ─── Linked sources ───────────────────────────────────────────────────────────

const LINKED_SOURCES: Record<string, LinkedSource> = {
  ls1: {
    id: 'ls1',
    title: 'AI-Assisted Mammography: Lancet Meta-Analysis',
    publisher: 'The Lancet Digital Health',
    page: 'p. 12',
    confidenceScore: 92,
    verificationStatus: 'verified',
    url: 'https://www.thelancet.com/journals/landig',
  },
  ls2: {
    id: 'ls2',
    title: 'FDA AI Device Approval Summary 2023',
    publisher: 'U.S. FDA',
    page: 'p. 4',
    confidenceScore: 96,
    verificationStatus: 'verified',
    url: 'https://www.fda.gov/medical-devices',
  },
  ls3: {
    id: 'ls3',
    title: 'Global Healthcare AI Market 2024–2030',
    publisher: 'Grand View Research',
    page: 'p. 7',
    confidenceScore: 74,
    verificationStatus: 'partially-supported',
    url: 'https://www.grandviewresearch.com',
  },
  ls4: {
    id: 'ls4',
    title: 'Algorithmic Fairness in AI Diagnostics',
    publisher: 'Nature Medicine',
    page: 'p. 6',
    confidenceScore: 89,
    verificationStatus: 'contested',
    url: 'https://www.nature.com/articles/s41591-022',
  },
  ls5: {
    id: 'ls5',
    title: 'Dr. Eric Topol on Limits of AI in Practice',
    publisher: 'STAT News',
    confidenceScore: 78,
    verificationStatus: 'verified',
    url: 'https://www.statnews.com/2023/12/14',
  },
  ls6: {
    id: 'ls6',
    title: 'Stanford Robotic Surgery Outcomes 2023',
    publisher: 'J. of American College of Surgeons',
    page: 'p. 8',
    confidenceScore: 91,
    verificationStatus: 'verified',
    url: 'https://www.journalacs.org',
  },
};

// ─── Script blocks ────────────────────────────────────────────────────────────

const BLOCKS: ScriptBlock[] = [
  // ── HOOK ──
  {
    id: 'b1', sectionId: 'sec-hook', sceneNumber: 1, type: 'visual-direction',
    content: 'OPEN ON: Black screen. A single beep of a heart monitor. Then — a hospital corridor, 3:47 AM. Fluorescent lights flicker. An ER nurse runs past camera.',
    approvalStatus: 'approved', wordCount: 38, estimatedDurationSec: 8,
    commentCount: 1, comments: [
      { id: 'c1', author: WRITERS[1], text: 'Strong visual. Consider adding ambient sound note.', timestamp: '2h ago', resolved: false },
    ], version: 2, aiRewritten: false,
  },
  {
    id: 'b2', sectionId: 'sec-hook', sceneNumber: 1, type: 'narration',
    content: 'In 2023, a software algorithm made a diagnosis that three specialist physicians had missed — for four consecutive months. The patient lived.',
    approvalStatus: 'approved', wordCount: 28, estimatedDurationSec: 10,
    linkedSourceId: 'ls1', claimStatus: 'verified',
    claimText: 'AI caught a missed diagnosis over a four-month period in a documented clinical case.',
    commentCount: 0, comments: [], version: 3, aiRewritten: false,
  },
  {
    id: 'b3', sectionId: 'sec-hook', sceneNumber: 1, type: 'on-screen-text',
    content: 'THE RISE OF AI IN HEALTHCARE\n\nA CreativeMind Studio Documentary',
    approvalStatus: 'approved', wordCount: 12, estimatedDurationSec: 4,
    commentCount: 0, comments: [], version: 1,
  },

  // ── SETUP ──
  {
    id: 'b4', sectionId: 'sec-setup', sceneNumber: 2, type: 'narration',
    content: "For most of human history, medicine was a craft mastered over decades. A doctor's intuition, sharpened by thousands of cases, was the closest thing to a diagnostic algorithm that existed.",
    approvalStatus: 'approved', wordCount: 36, estimatedDurationSec: 13,
    commentCount: 2, comments: [
      { id: 'c2', author: WRITERS[0], text: 'Consider cutting "for most of human history" — jumps right in stronger.', timestamp: '1h ago', resolved: false },
      { id: 'c3', author: WRITERS[2], text: 'Agree with NA — the second sentence is the real hook.', timestamp: '45m ago', resolved: false },
    ], version: 4, aiRewritten: true,
  },
  {
    id: 'b5', sectionId: 'sec-setup', sceneNumber: 2, type: 'visual-direction',
    content: 'CUT TO: Archival footage — 1950s radiology room. Doctor holding X-ray film up to a light box. INTERCUT WITH: Modern radiologist at dual-monitor workstation.',
    approvalStatus: 'pending', wordCount: 32, estimatedDurationSec: 9,
    commentCount: 0, comments: [], version: 1,
  },
  {
    id: 'b6', sectionId: 'sec-setup', sceneNumber: 3, type: 'narration',
    content: 'As of October 2023, the U.S. FDA had authorised 692 AI and machine learning-enabled medical devices. Seventy-five percent were in radiology alone.',
    approvalStatus: 'approved', wordCount: 31, estimatedDurationSec: 11,
    linkedSourceId: 'ls2', claimStatus: 'verified',
    claimText: '692 AI/ML-enabled medical devices authorised by FDA as of Oct 2023; 75% in radiology.',
    commentCount: 0, comments: [], version: 2,
  },
  {
    id: 'b7', sectionId: 'sec-setup', sceneNumber: 3, type: 'sound-direction',
    content: 'MUSIC: Begin low, measured score. Single piano note under narration. Build slowly over next 45 seconds toward a minor tension chord.',
    approvalStatus: 'pending', wordCount: 28, estimatedDurationSec: 3,
    commentCount: 1, comments: [
      { id: 'c4', author: WRITERS[3], text: 'Reference Hans Zimmer – Interstellar "Day One" as mood guide.', timestamp: '30m ago', resolved: true },
    ], version: 1,
  },

  // ── CONFLICT ──
  {
    id: 'b8', sectionId: 'sec-conflict', sceneNumber: 4, type: 'interview',
    content: '"The problem is not whether AI can read a scan better than a radiologist in a controlled study — the problem is whether it can perform in the messy, real-world hospital environment with incomplete data, poor lighting, and patient motion artifacts."',
    speakerName: 'Dr. Eric Topol, Scripps Research Translational Institute',
    approvalStatus: 'approved', wordCount: 51, estimatedDurationSec: 18,
    linkedSourceId: 'ls5', claimStatus: 'verified',
    claimText: 'Expert critique: real-world performance gap for AI diagnostics.',
    commentCount: 0, comments: [], version: 2,
  },
  {
    id: 'b9', sectionId: 'sec-conflict', sceneNumber: 4, type: 'narration',
    content: 'And there is a darker finding. A 2022 study in Nature Medicine showed that three of nine AI skin-cancer classifiers failed minimum performance thresholds for patients with darker skin tones — a bias baked into the training data.',
    approvalStatus: 'needs-revision', wordCount: 44, estimatedDurationSec: 15,
    linkedSourceId: 'ls4', claimStatus: 'contested',
    claimText: 'AI dermatology classifiers underperform on darker skin tones (2022 data — contested by 2023 updates).',
    commentCount: 3, comments: [
      { id: 'c5', author: WRITERS[1], text: '⚠️ This is CONTESTED — 2023 studies show improvement on newer models. Need update citation.', timestamp: '3h ago', resolved: false },
      { id: 'c6', author: WRITERS[0], text: 'Flag this for fact-check review before approval.', timestamp: '2h ago', resolved: false },
      { id: 'c7', author: WRITERS[2], text: 'Agreed — qualify with "in 2022 models" to be accurate.', timestamp: '1h ago', resolved: false },
    ], version: 3, aiRewritten: false,
    suggestions: [
      'Add qualifier: "in 2022 classifier models" to avoid misleading current AI state.',
      'Insert follow-up sentence: "Newer 2023 models have shown improved equity metrics."',
    ],
  },
  {
    id: 'b10', sectionId: 'sec-conflict', sceneNumber: 5, type: 'dialogue',
    content: 'If we deploy systems that work brilliantly for some patients and fail others — we haven\'t solved healthcare. We\'ve digitised its inequalities.',
    speakerName: 'Dr. Aisha Ndoye (Composite — simulated)',
    approvalStatus: 'pending', wordCount: 30, estimatedDurationSec: 11,
    commentCount: 0, comments: [], version: 1,
  },

  // ── DEVELOPMENT ──
  {
    id: 'b11', sectionId: 'sec-development', sceneNumber: 6, type: 'narration',
    content: 'Yet in parallel, the evidence for AI\'s potential is stacking up. At Stanford Medical Center, AI-assisted laparoscopic procedures delivered a 23 percent reduction in post-operative complications.',
    approvalStatus: 'approved', wordCount: 36, estimatedDurationSec: 13,
    linkedSourceId: 'ls6', claimStatus: 'verified',
    claimText: '23% reduction in post-op complications in AI-assisted laparoscopic procedures at Stanford.',
    commentCount: 0, comments: [], version: 2,
  },
  {
    id: 'b12', sectionId: 'sec-development', sceneNumber: 6, type: 'visual-direction',
    content: 'CUT TO: Operating theatre — overhead drone shot. Robotic arm moving with precision. Surgeon at console. Data overlay on screen: "Procedure Confidence: 97.2%"',
    approvalStatus: 'pending', wordCount: 29, estimatedDurationSec: 7,
    commentCount: 0, comments: [], version: 1,
  },
  {
    id: 'b13', sectionId: 'sec-development', sceneNumber: 7, type: 'narration',
    content: 'The global market for healthcare AI was valued at 22.45 billion US dollars in 2023. By 2030, projections suggest that figure could reach 187 billion — a compound annual growth rate of 36 percent.',
    approvalStatus: 'pending', wordCount: 40, estimatedDurationSec: 14,
    linkedSourceId: 'ls3', claimStatus: 'partially-supported',
    claimText: 'Healthcare AI market projected at 36.1% CAGR through 2030 (market research estimate — methodology not fully disclosed).',
    commentCount: 1, comments: [
      { id: 'c8', author: WRITERS[3], text: 'Source is partially supported — cross-verify with McKinsey or WHO data.', timestamp: '4h ago', resolved: false },
    ], version: 2,
    suggestions: [
      'Add "according to market research firm Grand View Research" to attribute the projection.',
      'Consider adding WHO or McKinsey secondary verification.',
    ],
  },

  // ── REVEAL ──
  {
    id: 'b14', sectionId: 'sec-reveal', sceneNumber: 8, type: 'narration',
    content: 'Here is what the numbers cannot capture: somewhere between the training data and the clinical outcome sits a human being — a patient who trusted a machine they never saw with a life they cannot replace.',
    approvalStatus: 'pending', wordCount: 42, estimatedDurationSec: 15,
    commentCount: 2, comments: [
      { id: 'c9', author: WRITERS[1], text: 'This is the emotional core. Protect it — no AI rewrites here.', timestamp: '1h ago', resolved: false },
      { id: 'c10', author: WRITERS[0], text: '💯 Strongest line in the script. Lock this.', timestamp: '50m ago', resolved: true },
    ], version: 1, aiRewritten: false,
  },
  {
    id: 'b15', sectionId: 'sec-reveal', sceneNumber: 8, type: 'citation',
    content: 'FDA (2023): 692 AI/ML devices cleared. Lancet Digital Health (Jan 2024): AI mammography sensitivity 81.0% vs. 80.1% (two radiologists). Stanford JACS (Aug 2023): 23% reduction post-op complications.',
    approvalStatus: 'approved', wordCount: 36, estimatedDurationSec: 6,
    commentCount: 0, comments: [], version: 1,
  },

  // ── RESOLUTION ──
  {
    id: 'b16', sectionId: 'sec-resolution', sceneNumber: 9, type: 'narration',
    content: 'The honest answer is that artificial intelligence in healthcare is neither a saviour nor a threat. It is a tool — and like every tool in medicine, its quality depends entirely on who built it, who trained it, and who decides when to trust it.',
    approvalStatus: 'review', wordCount: 48, estimatedDurationSec: 17,
    commentCount: 1, comments: [
      { id: 'c11', author: WRITERS[2], text: 'Excellent closing. Possibly move "who decides when to trust it" to the final CTA?', timestamp: '2h ago', resolved: false },
    ], version: 2,
  },
  {
    id: 'b17', sectionId: 'sec-resolution', sceneNumber: 9, type: 'visual-direction',
    content: "SLOW PULL BACK: From close-up of AI diagnostic screen \u2192 to the doctor's face \u2192 to the patient's hand. Fade to near-black. Single point of white light.",
    approvalStatus: 'pending', wordCount: 30, estimatedDurationSec: 8,
    commentCount: 0, comments: [], version: 1,
  },

  // ── CTA ──
  {
    id: 'b18', sectionId: 'sec-cta', sceneNumber: 10, type: 'narration',
    content: 'The algorithms are learning faster than the regulations designed to govern them. The question is no longer whether AI will transform healthcare. The question is who gets to decide how.',
    approvalStatus: 'pending', wordCount: 36, estimatedDurationSec: 13,
    commentCount: 0, comments: [], version: 1,
  },
  {
    id: 'b19', sectionId: 'sec-cta', sceneNumber: 10, type: 'on-screen-text',
    content: 'WHAT HAPPENS NEXT\nIS UP TO ALL OF US.',
    approvalStatus: 'pending', wordCount: 8, estimatedDurationSec: 5,
    commentCount: 0, comments: [], version: 1,
  },
  {
    id: 'b20', sectionId: 'sec-cta', sceneNumber: 10, type: 'editor-note',
    content: '[ EDITOR NOTE ] Review final card design with brand team. Confirm CMS / social cut-down versions required. End card: subscribe prompt + series link. Duration target: 14–16 min total.',
    approvalStatus: 'pending', wordCount: 35, estimatedDurationSec: 0,
    commentCount: 0, comments: [], version: 1,
  },
];

// ─── Scenes ───────────────────────────────────────────────────────────────────

const SCENES = [
  { id: 'sc1', sectionId: 'sec-hook',        sceneNumber: 1,  title: 'Emergency Room — 3:47 AM',        description: 'ER corridor cold open, heart monitor, nurse running', estimatedDurationSec: 22, approvalStatus: 'approved'     as const, linkedAssets: 3, linkedSources: 1, thumbnailGradient: 'from-[#1F2937] to-[#0F172A]' },
  { id: 'sc2', sectionId: 'sec-setup',       sceneNumber: 2,  title: 'History of Medicine — Archive',   description: 'Archival 1950s radiology intercutting modern workstation', estimatedDurationSec: 22, approvalStatus: 'scripted'  as const, linkedAssets: 4, linkedSources: 2, thumbnailGradient: 'from-[#1E3A5F] to-[#1E40AF]' },
  { id: 'sc3', sectionId: 'sec-setup',       sceneNumber: 3,  title: 'FDA Data Motion Graphics',        description: 'Statistics animation: 692 AI devices, 75% radiology', estimatedDurationSec: 14, approvalStatus: 'approved'     as const, linkedAssets: 2, linkedSources: 1, thumbnailGradient: 'from-[#1E40AF] to-[#2563EB]' },
  { id: 'sc4', sectionId: 'sec-conflict',    sceneNumber: 4,  title: 'Interview — Dr. Eric Topol',      description: 'Talking head. Scripps Research. Two camera setup.', estimatedDurationSec: 29, approvalStatus: 'approved'       as const, linkedAssets: 2, linkedSources: 1, thumbnailGradient: 'from-[#134E4A] to-[#0F766E]' },
  { id: 'sc5', sectionId: 'sec-conflict',    sceneNumber: 5,  title: 'Skin Tone Bias — Data Vis',       description: 'Animated data comparison. Fitzpatrick scale distribution.', estimatedDurationSec: 26, approvalStatus: 'needs-revision' as const, linkedAssets: 1, linkedSources: 1, thumbnailGradient: 'from-[#7C2D12] to-[#C2410C]' },
  { id: 'sc6', sectionId: 'sec-development', sceneNumber: 6,  title: 'Stanford Operating Theatre',      description: 'Drone + close-up. Robotic surgery. Data overlay.', estimatedDurationSec: 20, approvalStatus: 'scripted'        as const, linkedAssets: 3, linkedSources: 1, thumbnailGradient: 'from-[#065F46] to-[#059669]' },
  { id: 'sc7', sectionId: 'sec-development', sceneNumber: 7,  title: 'Market Growth — Infographic',     description: '$22B → $187B projection. Animated bar chart.', estimatedDurationSec: 14, approvalStatus: 'scripted'           as const, linkedAssets: 1, linkedSources: 1, thumbnailGradient: 'from-[#78350F] to-[#B45309]' },
  { id: 'sc8', sectionId: 'sec-reveal',      sceneNumber: 8,  title: 'Human Moment — Close-Up',         description: 'Patient\'s hand, doctor\'s face, AI screen. Emotional pull-back.', estimatedDurationSec: 21, approvalStatus: 'not-started' as const, linkedAssets: 0, linkedSources: 3, thumbnailGradient: 'from-[#312E81] to-[#4338CA]' },
  { id: 'sc9', sectionId: 'sec-resolution',  sceneNumber: 9,  title: 'Resolution — White Light Fade',   description: 'Slow pull-back from screen → doctor → patient → fade.', estimatedDurationSec: 25, approvalStatus: 'not-started' as const, linkedAssets: 0, linkedSources: 0, thumbnailGradient: 'from-[#1F2937] to-[#374151]' },
  { id: 'sc10',sectionId: 'sec-cta',         sceneNumber: 10, title: 'End Card — CTA',                  description: 'Title card + subscribe prompt + series link.', estimatedDurationSec: 18, approvalStatus: 'not-started'       as const, linkedAssets: 2, linkedSources: 0, thumbnailGradient: 'from-[#581C87] to-[#7C3AED]' },
];

// ─── Inspector map ────────────────────────────────────────────────────────────

const buildInspector = (block: ScriptBlock): BlockInspectorData => ({
  block,
  linkedSources: block.linkedSourceId ? [LINKED_SOURCES[block.linkedSourceId]] : [],
  evidenceStrength: block.linkedSourceId
    ? (LINKED_SOURCES[block.linkedSourceId]?.confidenceScore ?? 0)
    : 0,
  relatedResearch: block.linkedSourceId
    ? ['Research Lab: Source Evidence', 'Virality Twin: Structural DNA']
    : [],
  reviewerNotes: block.comments
    .filter(c => !c.resolved)
    .map(c => `${c.author.name}: ${c.text}`),
  suggestedImprovements: block.suggestions ?? [],
});

const INSPECTOR_MAP: Record<string, BlockInspectorData> = Object.fromEntries(
  BLOCKS.map(b => [b.id, buildInspector(b)])
);

// ─── Emotional curve ──────────────────────────────────────────────────────────

const EMOTIONAL_CURVE = [
  { stage: 'Hook',        intensity: 82, curiosity: 90, tension: 55, engagement: 88 },
  { stage: 'Setup',       intensity: 55, curiosity: 78, tension: 30, engagement: 68 },
  { stage: 'Conflict',    intensity: 72, curiosity: 65, tension: 85, engagement: 76 },
  { stage: 'Development', intensity: 60, curiosity: 70, tension: 60, engagement: 72 },
  { stage: 'Reveal',      intensity: 90, curiosity: 58, tension: 78, engagement: 94 },
  { stage: 'Resolution',  intensity: 75, curiosity: 45, tension: 40, engagement: 85 },
  { stage: 'CTA',         intensity: 68, curiosity: 55, tension: 35, engagement: 80 },
];

// ─── Versions ─────────────────────────────────────────────────────────────────

const VERSIONS = [
  { id: 'v3', label: 'v3.0 — Research Pass',   timestamp: '2025-01-28 14:32', author: WRITERS[1], changeCount: 23, isCurrent: true  },
  { id: 'v2', label: 'v2.1 — AI Review Draft',  timestamp: '2025-01-27 09:15', author: WRITERS[0], changeCount: 41, isCurrent: false },
  { id: 'v1', label: 'v1.0 — First Draft',      timestamp: '2025-01-25 17:44', author: WRITERS[3], changeCount: 0,  isCurrent: false },
];

// ─── Root export ──────────────────────────────────────────────────────────────

export const MOCK_SCRIPT_ROOM: ScriptRoomData = {
  meta: {
    projectTitle: 'The Rise of AI in Healthcare',
    totalWords: BLOCKS.reduce((a, b) => a + b.wordCount, 0),
    estimatedReadingTimeSec: BLOCKS.reduce((a, b) => a + b.estimatedDurationSec, 0),
    estimatedVoiceoverSec:   BLOCKS.filter(b => b.type === 'narration' || b.type === 'dialogue' || b.type === 'interview')
                                   .reduce((a, b) => a + b.estimatedDurationSec, 0),
    totalScenes: SCENES.length,
    approvedBlocks: BLOCKS.filter(b => b.approvalStatus === 'approved').length,
    totalBlocks: BLOCKS.length,
    completionPercent: Math.round((BLOCKS.filter(b => b.approvalStatus === 'approved').length / BLOCKS.length) * 100),
    lastSavedAt: '2m ago',
  },
  writers: WRITERS,
  sections: [
    { id: 'sec-hook',        stage: 'hook',        title: 'Hook',        synopsis: 'Cold open — ER at 3:47 AM. AI diagnosis that saved a life.',        status: 'approved',     sceneCount: 1, estimatedDurationSec: 22,  completionPercent: 100, assignedWriter: WRITERS[1], linkedSourceIds: ['ls1'],        blockIds: ['b1','b2','b3'] },
    { id: 'sec-setup',       stage: 'setup',       title: 'Setup',       synopsis: 'History of medicine meets AI revolution. FDA data.',                status: 'approved',     sceneCount: 2, estimatedDurationSec: 58,  completionPercent: 90,  assignedWriter: WRITERS[1], linkedSourceIds: ['ls2'],        blockIds: ['b4','b5','b6','b7'] },
    { id: 'sec-conflict',    stage: 'conflict',    title: 'Conflict',    synopsis: 'Expert critique + racial bias study. Real-world limitations.',      status: 'needs-revision', sceneCount: 2, estimatedDurationSec: 74, completionPercent: 55,  assignedWriter: WRITERS[2], linkedSourceIds: ['ls4','ls5'],  blockIds: ['b8','b9','b10'] },
    { id: 'sec-development', stage: 'development', title: 'Development', synopsis: 'Surgery outcomes + market growth. Building the case.',              status: 'in-progress',  sceneCount: 2, estimatedDurationSec: 48,  completionPercent: 65,  assignedWriter: WRITERS[0], linkedSourceIds: ['ls3','ls6'],  blockIds: ['b11','b12','b13'] },
    { id: 'sec-reveal',      stage: 'reveal',      title: 'Reveal',      synopsis: 'The human cost. What numbers cannot capture.',                      status: 'in-progress',  sceneCount: 1, estimatedDurationSec: 42,  completionPercent: 40,  assignedWriter: WRITERS[1], linkedSourceIds: ['ls1','ls2','ls6'], blockIds: ['b14','b15'] },
    { id: 'sec-resolution',  stage: 'resolution',  title: 'Resolution',  synopsis: 'AI is a tool. The quality depends on who builds and trusts it.',    status: 'draft',        sceneCount: 1, estimatedDurationSec: 50,  completionPercent: 25,  assignedWriter: WRITERS[2], linkedSourceIds: [],             blockIds: ['b16','b17'] },
    { id: 'sec-cta',         stage: 'cta',         title: 'CTA',         synopsis: 'Algorithms outpacing regulation. Who decides?',                     status: 'not-started',  sceneCount: 1, estimatedDurationSec: 36,  completionPercent: 0,   assignedWriter: WRITERS[3], linkedSourceIds: [],             blockIds: ['b18','b19','b20'] },
  ],
  blocks: BLOCKS,
  scenes: SCENES,
  emotionalCurve: EMOTIONAL_CURVE,
  versions: VERSIONS,
  linkedSources: LINKED_SOURCES,
  inspectorMap: INSPECTOR_MAP,
};
