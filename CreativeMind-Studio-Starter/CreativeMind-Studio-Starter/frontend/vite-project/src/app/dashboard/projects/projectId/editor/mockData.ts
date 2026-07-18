/**
 * mockData.ts — Video Editor Workspace mock data
 * Timeline Planning & Production Guidance for CreativeMind Studio
 */

export type VisualType =
  | 'Talking Head'
  | 'Documentary'
  | 'Interview'
  | 'B-roll Montage'
  | 'Motion Graphics'
  | 'Screen Recording'
  | 'Archival Footage'
  | 'Text Explainer';

export type EditingStatus =
  | 'not-started'
  | 'in-progress'
  | 'review'
  | 'approved'
  | 'blocked';

export type AssetReadiness = 'ready' | 'partial' | 'missing' | 'at-risk';

export type PacingLevel = 'slow' | 'medium' | 'fast';

export interface ShotItem {
  id: string;
  description: string;
  cameraMovement: string;
  framing: string;
  duration: number;
}

export interface SourceRef {
  id: string;
  title: string;
  author: string;
  page: string;
  confidence: number;
  verified: boolean;
  url?: string;
}

export interface AssetItem {
  id: string;
  name: string;
  type: 'footage' | 'image' | 'audio' | 'graphic' | 'sfx';
  status: 'approved' | 'missing' | 'copyright-risk' | 'ai-generated';
  license: string;
  downloadStatus: 'downloaded' | 'pending' | 'unavailable';
  size?: string;
  suggestedAlternative?: string;
}

export interface Comment {
  id: string;
  author: string;
  authorInitials: string;
  authorColor: string;
  text: string;
  timestamp: string;
  resolved: boolean;
  mentions: string[];
}

export interface HistoryEntry {
  id: string;
  action: string;
  detail: string;
  user: string;
  timestamp: string;
}

export interface MotionGraphicItem {
  id: string;
  type: 'lower-third' | 'chart' | 'map' | 'kinetic-text' | 'callout' | 'animation';
  name: string;
  complexity: 'simple' | 'moderate' | 'complex';
  status: 'ready' | 'in-progress' | 'pending';
}

export interface SoundItem {
  id: string;
  type: 'music' | 'sfx' | 'ambience';
  name: string;
  duration: string;
  cuePoint: string;
  duckingNote?: string;
}

export interface Scene {
  id: string;
  sceneNumber: number;
  title: string;
  estimatedDuration: number; // seconds
  linkedAssetsCount: number;
  narrationSummary: string;
  visualType: VisualType;
  assetReadiness: AssetReadiness;
  editingStatus: EditingStatus;
  assignedEditor: string;
  warningCount: number;
  pacing: PacingLevel;
  emotionalIntensity: number; // 0-100
  informationDensity: number; // 0-100
  timecode: string;
  shots: ShotItem[];
  voiceoverScript: string;
  readingTime: string;
  emphasisNotes: string;
  pauseMarkers: string[];
  citationLinks: SourceRef[];
  assets: AssetItem[];
  motionGraphics: MotionGraphicItem[];
  sounds: SoundItem[];
  lightingNotes: string;
  colorGradeDirection: string;
  comments: Comment[];
  history: HistoryEntry[];
  patternInterruption: boolean;
  missingVisualWarning: boolean;
  copyrightRiskMarker: boolean;
}

// ─── Scenes ──────────────────────────────────────────────────────────────────

export const SCENES: Scene[] = [
  {
    id: 'sc-001',
    sceneNumber: 1,
    title: 'Opening Hook — The Problem',
    estimatedDuration: 45,
    linkedAssetsCount: 6,
    narrationSummary: 'Every year, 2.3 billion people lack access to clean water. We open on stark documentary footage of water scarcity.',
    visualType: 'Documentary',
    assetReadiness: 'ready',
    editingStatus: 'approved',
    assignedEditor: 'Mia Torres',
    warningCount: 0,
    pacing: 'fast',
    emotionalIntensity: 88,
    informationDensity: 45,
    timecode: '00:00:00',
    shots: [
      { id: 's1', description: 'Aerial drone shot of dry riverbed', cameraMovement: 'Slow push-in', framing: 'Wide', duration: 8 },
      { id: 's2', description: 'Close-up of cracked earth texture', cameraMovement: 'Static', framing: 'Macro', duration: 4 },
      { id: 's3', description: 'Children walking to distant water source', cameraMovement: 'Tracking shot', framing: 'Medium wide', duration: 12 },
      { id: 's4', description: 'Title card animation over black', cameraMovement: 'N/A', framing: 'Full frame', duration: 5 },
    ],
    voiceoverScript: 'Two point three billion. That\'s not a statistic — it\'s a crisis unfolding in real time. Every morning, families make impossible choices. Today, that changes.',
    readingTime: '0:42',
    emphasisNotes: 'Heavy stress on "Two point three billion". Pause after "real time."',
    pauseMarkers: ['After "impossible choices" — 1.2s pause', 'Before "Today" — 0.8s pause'],
    citationLinks: [
      { id: 'ref1', title: 'WHO Water Sanitation Report 2023', author: 'World Health Organization', page: '12', confidence: 98, verified: true, url: 'https://who.int' },
      { id: 'ref2', title: 'Global Water Crisis Index', author: 'UNICEF', page: '7', confidence: 94, verified: true },
    ],
    assets: [
      { id: 'a1', name: 'Drone_Riverbed_4K.mp4', type: 'footage', status: 'approved', license: 'Creative Commons', downloadStatus: 'downloaded', size: '2.3 GB' },
      { id: 'a2', name: 'Cracked_Earth_Macro.mp4', type: 'footage', status: 'approved', license: 'Purchased', downloadStatus: 'downloaded', size: '890 MB' },
      { id: 'a3', name: 'Children_Walk_Stock.mp4', type: 'footage', status: 'copyright-risk', license: 'Getty Images', downloadStatus: 'downloaded', size: '1.2 GB', suggestedAlternative: 'UNICEF Open Media Library' },
      { id: 'a4', name: 'Intro_Music_Epic.wav', type: 'audio', status: 'approved', license: 'Artlist', downloadStatus: 'downloaded', size: '45 MB' },
    ],
    motionGraphics: [
      { id: 'mg1', type: 'kinetic-text', name: '2.3 Billion Counter', complexity: 'moderate', status: 'ready' },
      { id: 'mg2', type: 'lower-third', name: 'Documentary Title Card', complexity: 'simple', status: 'ready' },
    ],
    sounds: [
      { id: 'snd1', type: 'music', name: 'Epic Intro — Understated', duration: '0:45', cuePoint: '00:00:00', duckingNote: 'Duck to -18dB under VO' },
      { id: 'snd2', type: 'ambience', name: 'Desert Wind Ambience', duration: '0:45', cuePoint: '00:00:03' },
    ],
    lightingNotes: 'Harsh midday sun, high contrast. No color correction on raw documentary footage.',
    colorGradeDirection: 'Desaturated, cool tones. Teal and orange split-toning. Cinematique look.',
    comments: [
      { id: 'c1', author: 'James R.', authorInitials: 'JR', authorColor: '#8B5CF6', text: 'The drone shot is incredible. Should we add a slight vignette?', timestamp: '2 hours ago', resolved: false, mentions: ['@Mia'] },
      { id: 'c2', author: 'Mia Torres', authorInitials: 'MT', authorColor: '#10B981', text: 'Yes! Already noted in color grade. Will apply in DaVinci.', timestamp: '1 hour ago', resolved: true, mentions: [] },
    ],
    history: [
      { id: 'h1', action: 'Duration changed', detail: 'From 38s → 45s', user: 'Mia Torres', timestamp: '3 hours ago' },
      { id: 'h2', action: 'Approved for editing', detail: 'Scene locked for production', user: 'James R.', timestamp: '1 hour ago' },
    ],
    patternInterruption: false,
    missingVisualWarning: false,
    copyrightRiskMarker: true,
  },
  {
    id: 'sc-002',
    sceneNumber: 2,
    title: 'Introducing the Innovation',
    estimatedDuration: 60,
    linkedAssetsCount: 8,
    narrationSummary: 'We reveal the solar-powered atmospheric water generator. Interview with lead engineer Dr. Amara Osei.',
    visualType: 'Interview',
    assetReadiness: 'partial',
    editingStatus: 'in-progress',
    assignedEditor: 'Carlos Vega',
    warningCount: 2,
    pacing: 'medium',
    emotionalIntensity: 62,
    informationDensity: 78,
    timecode: '00:00:45',
    shots: [
      { id: 's5', description: 'Interview setup — Dr. Osei at lab', cameraMovement: 'Static with rack focus', framing: 'Medium close-up', duration: 20 },
      { id: 's6', description: 'B-roll of device operation', cameraMovement: 'Handheld slow pan', framing: 'Medium', duration: 15 },
      { id: 's7', description: 'Technical diagram animation', cameraMovement: 'N/A', framing: 'Full frame', duration: 10 },
    ],
    voiceoverScript: 'Dr. Amara Osei has spent fifteen years developing a device that pulls drinking water directly from air. Using solar power alone.',
    readingTime: '0:55',
    emphasisNotes: 'Emphasize "directly from air." Let interview audio breathe.',
    pauseMarkers: ['After "fifteen years" — 0.5s pause'],
    citationLinks: [
      { id: 'ref3', title: 'Atmospheric Water Generation — MIT Review', author: 'MIT Technology Review', page: '23', confidence: 91, verified: true },
      { id: 'ref4', title: 'Solar-Powered AWG Efficiency Study', author: 'Dr. A. Osei et al.', page: '1', confidence: 97, verified: false },
    ],
    assets: [
      { id: 'a5', name: 'Interview_DrOsei_RAW_A.mp4', type: 'footage', status: 'approved', license: 'Owned', downloadStatus: 'downloaded', size: '4.1 GB' },
      { id: 'a6', name: 'Device_Broll_Lab.mp4', type: 'footage', status: 'approved', license: 'Owned', downloadStatus: 'downloaded', size: '2.8 GB' },
      { id: 'a7', name: 'Technical_Diagram_v2.ae', type: 'graphic', status: 'approved', license: 'Owned', downloadStatus: 'downloaded', size: '120 MB' },
      { id: 'a8', name: 'Lab_Wide_Shot.mp4', type: 'footage', status: 'missing', license: 'Owned', downloadStatus: 'unavailable', size: '—', suggestedAlternative: 'Use B-roll from Day 2 shoot' },
      { id: 'a9', name: 'Interview_Music_Neutral.wav', type: 'audio', status: 'approved', license: 'Artlist', downloadStatus: 'downloaded', size: '32 MB' },
    ],
    motionGraphics: [
      { id: 'mg3', type: 'lower-third', name: 'Dr. Amara Osei — Lead Engineer', complexity: 'simple', status: 'ready' },
      { id: 'mg4', type: 'chart', name: 'Water Output per Hour Chart', complexity: 'moderate', status: 'in-progress' },
      { id: 'mg5', type: 'animation', name: 'Device Exploded View', complexity: 'complex', status: 'pending' },
    ],
    sounds: [
      { id: 'snd3', type: 'music', name: 'Thoughtful Ambient', duration: '1:00', cuePoint: '00:00:45', duckingNote: 'Duck to -24dB under interview audio' },
      { id: 'snd4', type: 'sfx', name: 'Lab Ambience Loop', duration: '1:00', cuePoint: '00:00:48' },
    ],
    lightingNotes: '3-point interview lighting. Key light at 45°. Warm practical lights in background.',
    colorGradeDirection: 'Warm, hopeful tones. Slight LUT applied: "Lab Warm v3". Skin tone preservation priority.',
    comments: [
      { id: 'c3', author: 'Carlos Vega', authorInitials: 'CV', authorColor: '#3B82F6', text: 'Missing the wide shot of the lab. Need to flag this with the production team.', timestamp: '5 hours ago', resolved: false, mentions: ['@James'] },
      { id: 'c4', author: 'Sarah K.', authorInitials: 'SK', authorColor: '#F59E0B', text: 'The Device Exploded View animation is still being built by motion team.', timestamp: '4 hours ago', resolved: false, mentions: ['@Carlos'] },
    ],
    history: [
      { id: 'h3', action: 'Asset replaced', detail: 'Interview_DrOsei_v1.mp4 → Interview_DrOsei_RAW_A.mp4', user: 'Carlos Vega', timestamp: '6 hours ago' },
      { id: 'h4', action: 'Duration changed', detail: 'From 55s → 60s', user: 'Carlos Vega', timestamp: '4 hours ago' },
    ],
    patternInterruption: true,
    missingVisualWarning: true,
    copyrightRiskMarker: false,
  },
  {
    id: 'sc-003',
    sceneNumber: 3,
    title: 'How It Works — Explainer',
    estimatedDuration: 75,
    linkedAssetsCount: 10,
    narrationSummary: 'Step-by-step motion graphics explainer of the condensation-to-clean-water process.',
    visualType: 'Motion Graphics',
    assetReadiness: 'partial',
    editingStatus: 'in-progress',
    assignedEditor: 'Mia Torres',
    warningCount: 1,
    pacing: 'medium',
    emotionalIntensity: 45,
    informationDensity: 95,
    timecode: '00:01:45',
    shots: [
      { id: 's8', description: 'Animated cross-section of device', cameraMovement: 'N/A', framing: 'Full frame', duration: 20 },
      { id: 's9', description: 'Step 1: Air intake diagram', cameraMovement: 'N/A', framing: 'Full frame', duration: 15 },
      { id: 's10', description: 'Step 2: Condensation process', cameraMovement: 'N/A', framing: 'Full frame', duration: 15 },
      { id: 's11', description: 'Step 3: Filtration and output', cameraMovement: 'N/A', framing: 'Full frame', duration: 15 },
      { id: 's12', description: 'Comparison: AWG vs Traditional', cameraMovement: 'N/A', framing: 'Full frame', duration: 10 },
    ],
    voiceoverScript: 'The device works in three stages. First: humid air is drawn in through advanced polymer filters. Second: proprietary nano-condensation technology extracts moisture. Third: a six-stage purification system produces water that exceeds WHO standards.',
    readingTime: '1:10',
    emphasisNotes: 'Number each step with a slight pause. Technical terms should be spoken deliberately.',
    pauseMarkers: ['Before "First" — 0.3s', 'Before "Second" — 0.3s', 'Before "Third" — 0.3s'],
    citationLinks: [
      { id: 'ref5', title: 'WHO Drinking Water Quality Guidelines', author: 'WHO', page: '34', confidence: 100, verified: true },
      { id: 'ref6', title: 'Nano-condensation Patent Application', author: 'Osei Technologies', page: '2', confidence: 88, verified: false },
    ],
    assets: [
      { id: 'a10', name: 'AWG_Explainer_v3.ae', type: 'graphic', status: 'ai-generated', license: 'AI Generated', downloadStatus: 'downloaded', size: '340 MB' },
      { id: 'a11', name: 'Step1_Diagram.svg', type: 'graphic', status: 'approved', license: 'Owned', downloadStatus: 'downloaded', size: '2 MB' },
      { id: 'a12', name: 'Step2_Animation.mp4', type: 'footage', status: 'approved', license: 'Owned', downloadStatus: 'downloaded', size: '560 MB' },
      { id: 'a13', name: 'Comparison_Chart.svg', type: 'graphic', status: 'missing', license: 'Owned', downloadStatus: 'unavailable', size: '—', suggestedAlternative: 'Use Recharts-generated export' },
    ],
    motionGraphics: [
      { id: 'mg6', type: 'animation', name: 'AWG Cross-Section 3D', complexity: 'complex', status: 'in-progress' },
      { id: 'mg7', type: 'chart', name: 'Efficiency Comparison', complexity: 'moderate', status: 'pending' },
      { id: 'mg8', type: 'kinetic-text', name: 'Step Callouts', complexity: 'simple', status: 'ready' },
      { id: 'mg9', type: 'callout', name: 'WHO Standards Callout', complexity: 'simple', status: 'ready' },
    ],
    sounds: [
      { id: 'snd5', type: 'music', name: 'Tech Minimal Piano', duration: '1:15', cuePoint: '00:01:45' },
      { id: 'snd6', type: 'sfx', name: 'Whoosh Transitions', duration: '0:02', cuePoint: 'on-each-step' },
    ],
    lightingNotes: 'N/A — pure motion graphics scene.',
    colorGradeDirection: 'Brand palette: electric blue and white on dark navy background. High contrast for legibility.',
    comments: [
      { id: 'c5', author: 'Mia Torres', authorInitials: 'MT', authorColor: '#10B981', text: 'Step 3 animation is not matching the timing of the VO. Need to adjust.', timestamp: '1 day ago', resolved: false, mentions: ['@Motion Team'] },
    ],
    history: [
      { id: 'h5', action: 'Scene reordered', detail: 'Moved from position 4 → position 3', user: 'James R.', timestamp: '2 days ago' },
      { id: 'h6', action: 'Duration changed', detail: 'From 65s → 75s (added comparison section)', user: 'Mia Torres', timestamp: '1 day ago' },
    ],
    patternInterruption: false,
    missingVisualWarning: true,
    copyrightRiskMarker: false,
  },
  {
    id: 'sc-004',
    sceneNumber: 4,
    title: 'Real-World Impact',
    estimatedDuration: 55,
    linkedAssetsCount: 7,
    narrationSummary: 'Documentary footage from pilot deployment in rural Kenya. Community testimonials.',
    visualType: 'Documentary',
    assetReadiness: 'ready',
    editingStatus: 'review',
    assignedEditor: 'Carlos Vega',
    warningCount: 0,
    pacing: 'slow',
    emotionalIntensity: 92,
    informationDensity: 38,
    timecode: '00:03:00',
    shots: [
      { id: 's13', description: 'Village wide shot, golden hour', cameraMovement: 'Slow push-in', framing: 'Wide', duration: 8 },
      { id: 's14', description: 'Testimonial: Village Elder', cameraMovement: 'Static', framing: 'Medium close-up', duration: 18 },
      { id: 's15', description: 'Children drinking from tap', cameraMovement: 'Handheld', framing: 'Close-up', duration: 10 },
      { id: 's16', description: 'Data overlay on map of Kenya', cameraMovement: 'N/A', framing: 'Full frame', duration: 8 },
    ],
    voiceoverScript: 'In Nakuru County, Kenya, 847 families now have clean water on demand. We spoke with the community.',
    readingTime: '0:50',
    emphasisNotes: 'Gentle delivery. Let the emotional weight land without rushing.',
    pauseMarkers: ['After village elder finishes — 2s pause', 'Before "on demand" — 0.5s'],
    citationLinks: [
      { id: 'ref7', title: 'AWG Pilot Deployment Report — Kenya 2023', author: 'Osei Technologies', page: '8', confidence: 99, verified: true },
    ],
    assets: [
      { id: 'a14', name: 'Kenya_Village_GoldenHour.mp4', type: 'footage', status: 'approved', license: 'Owned', downloadStatus: 'downloaded', size: '3.2 GB' },
      { id: 'a15', name: 'Testimonial_Elder_v2.mp4', type: 'footage', status: 'approved', license: 'Owned', downloadStatus: 'downloaded', size: '1.8 GB' },
      { id: 'a16', name: 'Kenya_Map_Overlay.ae', type: 'graphic', status: 'approved', license: 'Owned', downloadStatus: 'downloaded', size: '180 MB' },
    ],
    motionGraphics: [
      { id: 'mg10', type: 'map', name: 'Kenya Impact Map', complexity: 'moderate', status: 'ready' },
      { id: 'mg11', type: 'lower-third', name: 'Village Elder Name Card', complexity: 'simple', status: 'ready' },
    ],
    sounds: [
      { id: 'snd7', type: 'music', name: 'Emotional Strings — Hope', duration: '0:55', cuePoint: '00:03:00', duckingNote: 'Swell at children moment' },
      { id: 'snd8', type: 'ambience', name: 'African Village Ambience', duration: '0:55', cuePoint: '00:03:02' },
    ],
    lightingNotes: 'Natural golden hour light. No artificial lighting corrections needed.',
    colorGradeDirection: 'Warm golden tones. Lifted shadows. High emotion grade — REC 709 with slight orange lift.',
    comments: [],
    history: [
      { id: 'h7', action: 'Approved for editing', detail: 'All assets verified and approved', user: 'James R.', timestamp: '5 hours ago' },
    ],
    patternInterruption: false,
    missingVisualWarning: false,
    copyrightRiskMarker: false,
  },
  {
    id: 'sc-005',
    sceneNumber: 5,
    title: 'Scaling the Solution',
    estimatedDuration: 50,
    linkedAssetsCount: 5,
    narrationSummary: 'B-roll montage of manufacturing, logistics, and global rollout plans.',
    visualType: 'B-roll Montage',
    assetReadiness: 'at-risk',
    editingStatus: 'not-started',
    assignedEditor: 'Unassigned',
    warningCount: 3,
    pacing: 'fast',
    emotionalIntensity: 70,
    informationDensity: 60,
    timecode: '00:03:55',
    shots: [
      { id: 's17', description: 'Factory floor montage', cameraMovement: 'Various', framing: 'Various', duration: 20 },
      { id: 's18', description: 'Shipping container loading', cameraMovement: 'Crane shot', framing: 'Wide', duration: 10 },
      { id: 's19', description: 'World map with deployment markers', cameraMovement: 'N/A', framing: 'Full frame', duration: 12 },
    ],
    voiceoverScript: 'By 2026, the plan is to deploy ten thousand units across thirty-two countries. The infrastructure already exists.',
    readingTime: '0:48',
    emphasisNotes: 'Upbeat, forward-looking tone. Confidence in delivery.',
    pauseMarkers: [],
    citationLinks: [
      { id: 'ref8', title: 'Global Deployment Strategy 2025–2027', author: 'Osei Technologies', page: '15', confidence: 85, verified: false },
    ],
    assets: [
      { id: 'a17', name: 'Factory_Montage_4K.mp4', type: 'footage', status: 'missing', license: 'Owned', downloadStatus: 'unavailable', size: '—', suggestedAlternative: 'Commission stock footage from Storyblocks' },
      { id: 'a18', name: 'World_Map_Animation.ae', type: 'graphic', status: 'ai-generated', license: 'AI Generated', downloadStatus: 'pending', size: '—' },
      { id: 'a19', name: 'Shipping_Broll.mp4', type: 'footage', status: 'copyright-risk', license: 'Shutterstock', downloadStatus: 'downloaded', size: '1.1 GB', suggestedAlternative: 'Find royalty-free equivalent' },
    ],
    motionGraphics: [
      { id: 'mg12', type: 'map', name: 'Global Deployment Map', complexity: 'complex', status: 'pending' },
      { id: 'mg13', type: 'kinetic-text', name: '10,000 Units Counter', complexity: 'simple', status: 'pending' },
    ],
    sounds: [
      { id: 'snd9', type: 'music', name: 'Momentum Build — Electronic', duration: '0:50', cuePoint: '00:03:55' },
    ],
    lightingNotes: 'Factory shots: industrial fluorescent. Should be corrected to neutral white balance.',
    colorGradeDirection: 'Energetic, slightly cool. High contrast. Speed ramp moments at cut points.',
    comments: [
      { id: 'c6', author: 'James R.', authorInitials: 'JR', authorColor: '#8B5CF6', text: 'This scene needs an editor ASAP. Three warnings and no one assigned.', timestamp: '3 hours ago', resolved: false, mentions: ['@Carlos', '@Mia'] },
    ],
    history: [
      { id: 'h8', action: 'Scene reordered', detail: 'Moved to position 5 from 6', user: 'Mia Torres', timestamp: '1 day ago' },
    ],
    patternInterruption: true,
    missingVisualWarning: true,
    copyrightRiskMarker: true,
  },
  {
    id: 'sc-006',
    sceneNumber: 6,
    title: 'Call to Action',
    estimatedDuration: 30,
    linkedAssetsCount: 4,
    narrationSummary: 'Direct address to camera. Funding call, subscribe ask, and closing brand identity.',
    visualType: 'Talking Head',
    assetReadiness: 'ready',
    editingStatus: 'not-started',
    assignedEditor: 'Mia Torres',
    warningCount: 0,
    pacing: 'medium',
    emotionalIntensity: 75,
    informationDensity: 40,
    timecode: '00:04:45',
    shots: [
      { id: 's20', description: 'Host direct address, clean background', cameraMovement: 'Slow push-in', framing: 'Medium close-up', duration: 20 },
      { id: 's21', description: 'End card with subscribe button', cameraMovement: 'N/A', framing: 'Full frame', duration: 10 },
    ],
    voiceoverScript: 'You just witnessed the future of water. If this moved you, share it. Link in the description to support the Osei Technologies deployment fund.',
    readingTime: '0:28',
    emphasisNotes: '"You just witnessed" — direct, personal. Build to "share it."',
    pauseMarkers: ['After "future of water" — 1s pause'],
    citationLinks: [],
    assets: [
      { id: 'a20', name: 'Host_CTA_Take3.mp4', type: 'footage', status: 'approved', license: 'Owned', downloadStatus: 'downloaded', size: '780 MB' },
      { id: 'a21', name: 'EndCard_Template_v4.ae', type: 'graphic', status: 'approved', license: 'Owned', downloadStatus: 'downloaded', size: '45 MB' },
      { id: 'a22', name: 'Outro_Music.wav', type: 'audio', status: 'approved', license: 'Artlist', downloadStatus: 'downloaded', size: '28 MB' },
    ],
    motionGraphics: [
      { id: 'mg14', type: 'lower-third', name: 'Fund Link Callout', complexity: 'simple', status: 'ready' },
      { id: 'mg15', type: 'callout', name: 'Subscribe Animation', complexity: 'simple', status: 'ready' },
    ],
    sounds: [
      { id: 'snd10', type: 'music', name: 'Outro — Hopeful Resolve', duration: '0:30', cuePoint: '00:04:45' },
    ],
    lightingNotes: 'Studio setup. Soft box key light. Clean neutral background.',
    colorGradeDirection: 'Match scene 1 grade but warmer. Brand colors for end card.',
    comments: [],
    history: [],
    patternInterruption: false,
    missingVisualWarning: false,
    copyrightRiskMarker: false,
  },
];

// ─── Media Bin ────────────────────────────────────────────────────────────────

export interface MediaBinSummary {
  approved: number;
  missing: number;
  copyrightRisk: number;
  aiGenerated: number;
  music: number;
  sfx: number;
}

export const MEDIA_BIN: MediaBinSummary = {
  approved: 18,
  missing: 4,
  copyrightRisk: 2,
  aiGenerated: 3,
  music: 7,
  sfx: 9,
};

// ─── Timeline Tracks ──────────────────────────────────────────────────────────

export type TrackType =
  | 'Video'
  | 'B-roll'
  | 'Graphics'
  | 'Text'
  | 'Voiceover'
  | 'Music'
  | 'Sound Effects'
  | 'Citation Overlays';

export interface TimelineTrack {
  id: string;
  type: TrackType;
  color: string;
  bgColor: string;
}

export const TIMELINE_TRACKS: TimelineTrack[] = [
  { id: 'track-video', type: 'Video', color: '#8B5CF6', bgColor: 'rgba(139,92,246,0.15)' },
  { id: 'track-broll', type: 'B-roll', color: '#3B82F6', bgColor: 'rgba(59,130,246,0.15)' },
  { id: 'track-graphics', type: 'Graphics', color: '#10B981', bgColor: 'rgba(16,185,129,0.15)' },
  { id: 'track-text', type: 'Text', color: '#F59E0B', bgColor: 'rgba(245,158,11,0.15)' },
  { id: 'track-vo', type: 'Voiceover', color: '#06B6D4', bgColor: 'rgba(6,182,212,0.15)' },
  { id: 'track-music', type: 'Music', color: '#EC4899', bgColor: 'rgba(236,72,153,0.15)' },
  { id: 'track-sfx', type: 'Sound Effects', color: '#F97316', bgColor: 'rgba(249,115,22,0.15)' },
  { id: 'track-citations', type: 'Citation Overlays', color: '#94A3B8', bgColor: 'rgba(148,163,184,0.15)' },
];

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface AnalyticsPoint {
  time: number; // seconds
  emotionalIntensity: number;
  informationDensity: number;
  pacing: number; // 0=slow, 50=medium, 100=fast
}

export const ANALYTICS_CURVE: AnalyticsPoint[] = [
  { time: 0, emotionalIntensity: 88, informationDensity: 45, pacing: 100 },
  { time: 10, emotionalIntensity: 82, informationDensity: 50, pacing: 90 },
  { time: 20, emotionalIntensity: 78, informationDensity: 55, pacing: 85 },
  { time: 45, emotionalIntensity: 62, informationDensity: 78, pacing: 50 },
  { time: 60, emotionalIntensity: 55, informationDensity: 82, pacing: 45 },
  { time: 105, emotionalIntensity: 45, informationDensity: 95, pacing: 50 },
  { time: 150, emotionalIntensity: 40, informationDensity: 90, pacing: 45 },
  { time: 180, emotionalIntensity: 92, informationDensity: 38, pacing: 20 },
  { time: 210, emotionalIntensity: 88, informationDensity: 35, pacing: 25 },
  { time: 235, emotionalIntensity: 70, informationDensity: 60, pacing: 90 },
  { time: 270, emotionalIntensity: 65, informationDensity: 65, pacing: 85 },
  { time: 285, emotionalIntensity: 75, informationDensity: 40, pacing: 50 },
  { time: 315, emotionalIntensity: 72, informationDensity: 38, pacing: 55 },
];

// ─── Editor Guidance Cards ────────────────────────────────────────────────────

export interface GuidanceCard {
  id: string;
  category: string;
  icon: string;
  title: string;
  suggestion: string;
  whySuggested: string;
  expectedImpact: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  timeEstimate: string;
}

export const EDITOR_GUIDANCE: GuidanceCard[] = [
  {
    id: 'g1',
    category: 'Transition',
    icon: 'zap',
    title: 'Match Cut: Water to Lab',
    suggestion: 'Use a shape match cut from the cracked earth texture to the circular device intake.',
    whySuggested: 'Visual rhyme creates a powerful cognitive bridge between problem and solution.',
    expectedImpact: 'Increases emotional resonance at scene 1→2 transition by connecting problem to hope.',
    difficulty: 'Moderate',
    timeEstimate: '15 min',
  },
  {
    id: 'g2',
    category: 'Camera Movement',
    icon: 'video',
    title: 'Slow Push-In on Testimonial',
    suggestion: 'Apply a very subtle digital push-in (1.01× over 18s) during the village elder testimonial.',
    whySuggested: 'Maintains intimacy while creating subtle kinetic energy for a 20-second static shot.',
    expectedImpact: 'Prevents viewer attention drop on long static interview shots.',
    difficulty: 'Easy',
    timeEstimate: '5 min',
  },
  {
    id: 'g3',
    category: 'Color Grade',
    icon: 'palette',
    title: 'Contrast Bridge Between Scenes',
    suggestion: 'Add a brief (8-frame) color temperature shift when transitioning from cold documentary to warm interview.',
    whySuggested: 'Current grade creates an abrupt visual jump that may feel jarring.',
    expectedImpact: 'Smooth visual continuity while preserving distinct emotional tones per scene.',
    difficulty: 'Easy',
    timeEstimate: '10 min',
  },
  {
    id: 'g4',
    category: 'Typography',
    icon: 'type',
    title: 'Use Kinetic Counter for Statistics',
    suggestion: 'Animate the "2.3 billion" stat as a counting-up number rather than static text.',
    whySuggested: 'Research shows animated statistics increase retention by up to 38% vs. static text.',
    expectedImpact: 'Higher viewer engagement and better retention of key data point.',
    difficulty: 'Moderate',
    timeEstimate: '20 min',
  },
  {
    id: 'g5',
    category: 'Sound Design',
    icon: 'volume-2',
    title: 'Add Subtle Water Ambience',
    suggestion: 'Layer a very quiet water droplet ambience (-36dB) throughout the explainer section.',
    whySuggested: 'Subconscious sound anchoring reinforces the subject matter without distraction.',
    expectedImpact: 'Increases thematic coherence and viewer immersion during technical content.',
    difficulty: 'Easy',
    timeEstimate: '8 min',
  },
  {
    id: 'g6',
    category: 'Motion Graphics',
    icon: 'layers',
    title: 'Speed Ramp at Montage Start',
    suggestion: 'Apply a speed ramp (0.5× → 1× over 12 frames) at the beginning of the B-roll montage.',
    whySuggested: 'Creates a kinetic entrance to the high-energy scaling section.',
    expectedImpact: 'Signals tonal shift to "action mode" and increases perceived production value.',
    difficulty: 'Moderate',
    timeEstimate: '12 min',
  },
  {
    id: 'g7',
    category: 'B-roll',
    icon: 'film',
    title: 'Alternative: Artlist Marketplace',
    suggestion: 'Replace the Shutterstock shipping footage with Artlist Stock "logistics-industrial" collection.',
    whySuggested: 'Current footage carries copyright risk. Artlist is already licensed in project.',
    expectedImpact: 'Eliminates copyright risk flag. Artlist footage quality matches existing grade.',
    difficulty: 'Easy',
    timeEstimate: '30 min',
  },
];

// ─── Project metadata ─────────────────────────────────────────────────────────

export const PROJECT_META = {
  title: 'The Water Revolution',
  totalDuration: 315, // seconds
  totalScenes: 6,
  productionDate: 'Jan 15, 2025',
  targetPlatform: 'YouTube',
  targetDuration: '5:00–6:00',
  status: 'In Production',
  completionPercent: 58,
};
