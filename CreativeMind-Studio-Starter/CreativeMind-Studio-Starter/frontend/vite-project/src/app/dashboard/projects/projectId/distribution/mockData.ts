/**
 * mockData.ts — Distribution Room realistic mock data
 */

import type {
  MasterContent,
  PlatformAdaptation,
  PlatformId,
} from './types';

// ─── Master Content ───────────────────────────────────────────────────────────

export const MASTER_CONTENT: MasterContent = {
  projectTitle: 'The Hidden Psychology of Viral Content',
  summary:
    'A deep-dive exploration of the cognitive biases, emotional triggers, and structural patterns that cause content to spread exponentially across social networks — backed by neuroscience research and real-world case studies.',
  primaryHook:
    'What if I told you that 94% of viral content triggers just 3 specific emotions — and none of them are happiness?',
  mainScript: `HOOK (0:00–0:30)
Imagine uploading a video you spent 6 months on, only to get 43 views. Meanwhile, a shaky 45-second clip shot on someone's lunch break gets 12 million.

That's not luck. That's psychology.

ACT 1 — THE TRIGGER TRIAD (0:30–3:00)
Researchers at the Wharton School analyzed 7,000 pieces of viral content and found a consistent pattern. Three core emotional states drive shares: awe, anxiety, and amusement. Not happiness — awe.

When we see something that expands our mental model of what's possible, our brain responds with a compulsion to share. It's not altruism. It's cognitive offloading.

ACT 2 — THE ARCHITECTURE OF ATTENTION (3:00–6:30)
Viral content hijacks three neurological systems simultaneously:
1. The novelty-detection system (dopamine spike)
2. The social-comparison system (serotonin regulation)
3. The pattern-completion system (the brain's drive to resolve tension)

The most shared videos introduce a gap in the viewer's knowledge in the first 8 seconds, then spend the rest of the content filling it — but never quite completely.

ACT 3 — PRACTICAL APPLICATION (6:30–9:30)
Here's how to reverse-engineer this for your content:
– Open with a pattern interrupt that creates cognitive dissonance
– Layer in a relatable frustration before the revelation
– Use the "camera turn" technique: show the audience themselves before the solution
– End with a call to identity, not a call to action

CLOSING (9:30–10:00)
The algorithm doesn't make content go viral. Humans do. Your job isn't to beat the algorithm — it's to understand the people behind it.

If this changed how you think about content, share it with someone still stuck making content for views instead of impact.`,
  targetAudience:
    'Content creators, social media strategists, and marketers aged 22–45 who are frustrated with inconsistent reach and want evidence-based frameworks for growth.',
  primaryPlatform: 'youtube',
  estimatedDuration: '10:00',
  thumbnailUrl:
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=640&q=80',
  thumbnailAlt: 'Person looking at glowing data streams representing viral psychology',
  cta: 'Subscribe for weekly breakdowns of what actually drives content performance.',
  approvalStatus: 'approved',
  approvedBy: 'Sarah Chen',
  approvedAt: '2025-01-15T09:42:00Z',
  version: 'v3.2',
  wordCount: 412,
  characterCount: 2847,
};

// ─── Platform Adaptations ─────────────────────────────────────────────────────

const platformMeta: Record<
  PlatformId,
  { name: string; icon: string }
> = {
  youtube:         { name: 'YouTube',         icon: 'youtube' },
  'instagram-reel':{ name: 'Instagram Reel',  icon: 'instagram' },
  'youtube-shorts':{ name: 'YouTube Shorts',  icon: 'youtube' },
  linkedin:        { name: 'LinkedIn',         icon: 'linkedin' },
  'x-thread':      { name: 'X Thread',         icon: 'twitter' },
  newsletter:      { name: 'Newsletter',       icon: 'mail' },
  podcast:         { name: 'Podcast',          icon: 'mic' },
  blog:            { name: 'Blog Post',        icon: 'file-text' },
  carousel:        { name: 'Carousel',         icon: 'layout' },
};

export const PLATFORM_ADAPTATIONS: PlatformAdaptation[] = [
  {
    id: 'adapt-yt',
    platformId: 'youtube',
    platformName: platformMeta['youtube'].name,
    icon: platformMeta['youtube'].icon,
    status: 'approved',
    assignedTo: 'Marcus Reid',
    assignedToInitials: 'MR',
    assignedToColor: '#8B5CF6',
    generatedTitle:
      'The Hidden Psychology Behind Every Viral Video (Backed by Neuroscience)',
    hook: 'What if I told you 94% of viral content triggers just 3 emotions — and none of them are happiness?',
    description:
      'Full-length YouTube essay exploring the cognitive architecture of viral content. SEO-optimised with chapter timestamps, pattern-interrupt thumbnail strategy, and a two-step CTA funnel.',
    estimatedDuration: '10:00',
    aspectRatio: '16:9',
    characterLimit: 5000,
    currentCharacterCount: 3240,
    cta: 'Subscribe + drop your biggest content challenge in the comments.',
    thumbnailStatus: 'approved',
    readinessScore: 96,
    isLocked: false,
    lastUpdated: '2025-01-15T10:12:00Z',
    recommendations: [
      {
        id: 'yt-r1',
        type: 'seo',
        priority: 'high',
        title: 'Add Power Word to Title',
        description: 'Insert "Shocking" or "Proven" before "Psychology" for a 14% CTR lift based on A/B data.',
        applied: false,
      },
      {
        id: 'yt-r2',
        type: 'structure',
        priority: 'medium',
        title: 'Add Chapter Timestamps',
        description: 'Add 6 chapter markers in the description to improve watch time and search ranking.',
        applied: true,
      },
      {
        id: 'yt-r3',
        type: 'engagement',
        priority: 'medium',
        title: 'Tighten First 30s',
        description: 'Move the "12 million views on lunch break" example to the very first line before credits.',
        applied: false,
      },
    ],
  },
  {
    id: 'adapt-ig',
    platformId: 'instagram-reel',
    platformName: platformMeta['instagram-reel'].name,
    icon: platformMeta['instagram-reel'].icon,
    status: 'ready-for-review',
    assignedTo: 'Priya Nair',
    assignedToInitials: 'PN',
    assignedToColor: '#EC4899',
    generatedTitle: '3 emotions make content go viral 🧠',
    hook: 'POV: You discover why 94% of viral videos use the same psychological trick',
    description:
      '60-second hook-first Reel condensing the Trigger Triad into a rapid-fire listicle with text overlays and trending audio cues.',
    estimatedDuration: '0:60',
    aspectRatio: '9:16',
    characterLimit: 2200,
    currentCharacterCount: 1680,
    cta: 'Save this for your next content planning session 🔖',
    thumbnailStatus: 'generating',
    readinessScore: 74,
    isLocked: false,
    lastUpdated: '2025-01-15T09:55:00Z',
    recommendations: [
      {
        id: 'ig-r1',
        type: 'pacing',
        priority: 'high',
        title: 'Increase Pacing',
        description: 'Cut first 3 seconds to 1 second cut-rhythm for better swipe prevention on feed.',
        applied: false,
      },
      {
        id: 'ig-r2',
        type: 'format',
        priority: 'high',
        title: 'Add Auto Captions',
        description: '85% of Instagram Reels are watched without sound. Add bold burn-in captions.',
        applied: false,
      },
      {
        id: 'ig-r3',
        type: 'tone',
        priority: 'low',
        title: 'Shorten Hook',
        description: 'Reduce opening hook to under 7 words for maximum first-frame retention.',
        applied: true,
      },
    ],
  },
  {
    id: 'adapt-yts',
    platformId: 'youtube-shorts',
    platformName: platformMeta['youtube-shorts'].name,
    icon: platformMeta['youtube-shorts'].icon,
    status: 'generating',
    assignedTo: 'Marcus Reid',
    assignedToInitials: 'MR',
    assignedToColor: '#8B5CF6',
    generatedTitle: 'Why your content isn\'t going viral (the real reason)',
    hook: 'The algorithm doesn\'t make videos viral. Your viewers\' brain chemistry does.',
    description:
      '58-second Shorts cut focusing exclusively on the Trigger Triad reveal. Loopable ending optimised for YouTube Shorts\' replay metric.',
    estimatedDuration: '0:58',
    aspectRatio: '9:16',
    characterLimit: 100,
    currentCharacterCount: 68,
    cta: 'Follow for the full breakdown →',
    thumbnailStatus: 'missing',
    readinessScore: 38,
    isLocked: false,
    lastUpdated: '2025-01-15T10:01:00Z',
    recommendations: [
      {
        id: 'yts-r1',
        type: 'format',
        priority: 'high',
        title: 'Create Loopable Ending',
        description: 'Make the final frame match the first frame visually to trigger YouTube\'s replay boost.',
        applied: false,
      },
      {
        id: 'yts-r2',
        type: 'engagement',
        priority: 'medium',
        title: 'Add Pattern Interrupt at 15s',
        description: 'Insert a visual or tonal shift at the 15-second mark to combat the attention drop-off.',
        applied: false,
      },
    ],
  },
  {
    id: 'adapt-li',
    platformId: 'linkedin',
    platformName: platformMeta['linkedin'].name,
    icon: platformMeta['linkedin'].icon,
    status: 'ready-to-publish',
    assignedTo: 'Jordan Wells',
    assignedToInitials: 'JW',
    assignedToColor: '#3B82F6',
    generatedTitle:
      'After studying 7,000 viral posts, I found a pattern most creators miss',
    hook: 'The Wharton School studied 7,000 viral content pieces. Here\'s the uncomfortable truth about what drives shares.',
    description:
      'Long-form LinkedIn article with a professional framing of the research, positioned for marketers and brand strategists. Includes data callouts and actionable takeaways formatted as a 5-point framework.',
    estimatedDuration: '4 min read',
    aspectRatio: '1:1',
    characterLimit: 3000,
    currentCharacterCount: 2890,
    cta: 'What\'s the most counterintuitive content lesson you\'ve learned? Share below.',
    thumbnailStatus: 'ready',
    readinessScore: 92,
    isLocked: true,
    lastUpdated: '2025-01-14T16:30:00Z',
    recommendations: [
      {
        id: 'li-r1',
        type: 'tone',
        priority: 'medium',
        title: 'Add Industry Insight',
        description: 'Reference a recent LinkedIn-specific study to increase professional credibility and dwell time.',
        applied: true,
      },
      {
        id: 'li-r2',
        type: 'structure',
        priority: 'low',
        title: 'Add Numbered Framework',
        description: 'LinkedIn posts with numbered lists (1/ 2/ 3/) get 3.2x more comments.',
        applied: false,
      },
    ],
  },
  {
    id: 'adapt-x',
    platformId: 'x-thread',
    platformName: platformMeta['x-thread'].name,
    icon: platformMeta['x-thread'].icon,
    status: 'draft',
    assignedTo: 'Priya Nair',
    assignedToInitials: 'PN',
    assignedToColor: '#EC4899',
    generatedTitle: 'Thread: The psychology of viral content (12 tweets)',
    hook: 'I spent 3 months studying what makes content go viral.\n\nThe answer isn\'t what you think. 🧵',
    description:
      '12-tweet thread breaking down each section of the master script into punchy, high-information-density tweets. Optimised for retweet-at-tweet-4 pattern.',
    estimatedDuration: '3 min read',
    aspectRatio: 'text',
    characterLimit: 280,
    currentCharacterCount: 271,
    cta: 'RT tweet 1 if this changed how you think about content strategy.',
    thumbnailStatus: 'missing',
    readinessScore: 22,
    isLocked: false,
    lastUpdated: '2025-01-15T08:10:00Z',
    recommendations: [
      {
        id: 'x-r1',
        type: 'engagement',
        priority: 'high',
        title: 'Front-load Value in Tweet 2',
        description: 'Move your strongest data point to tweet 2 to reduce thread abandonment by 40%.',
        applied: false,
      },
      {
        id: 'x-r2',
        type: 'structure',
        priority: 'high',
        title: 'Add "Bookmark bait" Tweet',
        description: 'Insert a resource summary tweet mid-thread to trigger bookmark behavior.',
        applied: false,
      },
    ],
  },
  {
    id: 'adapt-nl',
    platformId: 'newsletter',
    platformName: platformMeta['newsletter'].name,
    icon: platformMeta['newsletter'].icon,
    status: 'ready-for-review',
    assignedTo: 'Jordan Wells',
    assignedToInitials: 'JW',
    assignedToColor: '#3B82F6',
    generatedTitle: 'Issue #47: The 3-Emotion Formula Behind Every Viral Video',
    hook: 'This week\'s deep-dive will change how you plan every piece of content going forward.',
    description:
      'HTML email newsletter with an editorial introduction, research summary, key takeaways formatted as a scannable briefing, and a recommended reading section.',
    estimatedDuration: '6 min read',
    aspectRatio: 'text',
    characterLimit: 10000,
    currentCharacterCount: 4200,
    cta: 'Forward this to one creator who needs to hear it.',
    thumbnailStatus: 'ready',
    readinessScore: 68,
    isLocked: false,
    lastUpdated: '2025-01-15T09:22:00Z',
    recommendations: [
      {
        id: 'nl-r1',
        type: 'structure',
        priority: 'medium',
        title: 'Add TLDR Section',
        description: 'A 3-bullet TLDR at the top increases full-read rate by 28% for newsletters over 4 min.',
        applied: false,
      },
      {
        id: 'nl-r2',
        type: 'engagement',
        priority: 'low',
        title: 'Personalise Subject Line',
        description: 'Test a subject line with a reader pain point rather than the content topic.',
        applied: false,
      },
    ],
  },
  {
    id: 'adapt-pod',
    platformId: 'podcast',
    platformName: platformMeta['podcast'].name,
    icon: platformMeta['podcast'].icon,
    status: 'draft',
    assignedTo: 'Alex Torres',
    assignedToInitials: 'AT',
    assignedToColor: '#10B981',
    generatedTitle: 'Ep. 89 — The Neuroscience of Viral Content',
    hook: 'Today we\'re going deep on something every creator obsesses over but almost nobody gets right: what actually makes content spread.',
    description:
      'Extended 25-minute podcast episode expanding the master script with additional interview-style narration, deeper research context, and audio-first storytelling transitions.',
    estimatedDuration: '25:00',
    aspectRatio: 'audio',
    characterLimit: 20000,
    currentCharacterCount: 6800,
    cta: 'Rate us 5 stars if this episode gave you something actionable.',
    thumbnailStatus: 'ready',
    readinessScore: 30,
    isLocked: false,
    lastUpdated: '2025-01-14T14:00:00Z',
    recommendations: [
      {
        id: 'pod-r1',
        type: 'structure',
        priority: 'high',
        title: 'Expand Narration',
        description: 'The podcast script is only 34% of target length. Expand Act 2 with interview-style counterarguments.',
        applied: false,
      },
      {
        id: 'pod-r2',
        type: 'format',
        priority: 'high',
        title: 'Reduce On-Screen References',
        description: 'Remove 14 instances of "as you can see" and similar video-specific language.',
        applied: false,
      },
      {
        id: 'pod-r3',
        type: 'engagement',
        priority: 'medium',
        title: 'Add Sponsorship Break Position',
        description: 'Insert a natural sponsor break at the 12-minute mark for monetisation.',
        applied: false,
      },
    ],
  },
  {
    id: 'adapt-blog',
    platformId: 'blog',
    platformName: platformMeta['blog'].name,
    icon: platformMeta['blog'].icon,
    status: 'ready-for-review',
    assignedTo: 'Jordan Wells',
    assignedToInitials: 'JW',
    assignedToColor: '#3B82F6',
    generatedTitle:
      'The Neuroscience of Viral Content: What 7,000 Studies Reveal About Why Things Spread',
    hook: 'Virality isn\'t random. After analyzing 7,000 pieces of content, researchers at Wharton identified a repeatable psychological pattern — and it has nothing to do with luck.',
    description:
      'Long-form SEO blog post (~2,400 words) with structured H2/H3 hierarchy, pull quotes, a data table comparing platform virality mechanics, internal linking suggestions, and a key takeaways summary box.',
    estimatedDuration: '9 min read',
    aspectRatio: 'text',
    characterLimit: 15000,
    currentCharacterCount: 11200,
    cta: 'Download the free Viral Content Checklist — link in bio.',
    thumbnailStatus: 'ready',
    readinessScore: 82,
    isLocked: false,
    lastUpdated: '2025-01-15T10:00:00Z',
    recommendations: [
      {
        id: 'blog-r1',
        type: 'seo',
        priority: 'high',
        title: 'Improve H2 Structure',
        description: 'Rewrite H2 headings to include target keywords. Current H2s have 0% keyword density.',
        applied: false,
      },
      {
        id: 'blog-r2',
        type: 'structure',
        priority: 'medium',
        title: 'Add Citation Links',
        description: 'Add 5+ authoritative outbound links to the Wharton study and neuroscience references.',
        applied: false,
      },
      {
        id: 'blog-r3',
        type: 'structure',
        priority: 'medium',
        title: 'Add Summary Section',
        description: 'A TL;DR section at top and a "Key Takeaways" box at bottom improves time-on-page by 22%.',
        applied: false,
      },
    ],
  },
  {
    id: 'adapt-carousel',
    platformId: 'carousel',
    platformName: platformMeta['carousel'].name,
    icon: platformMeta['carousel'].icon,
    status: 'ready-to-publish',
    assignedTo: 'Priya Nair',
    assignedToInitials: 'PN',
    assignedToColor: '#EC4899',
    generatedTitle: '3 emotions → Viral content (slide 1 of 10)',
    hook: 'Scientists studied 7,000 viral posts.\n\nHere\'s the formula they found. 👇',
    description:
      '10-slide carousel breaking down the three emotional triggers as individual slides with a consistent visual design system: dark background, single bold stat per slide, and a final "share if helpful" CTA slide.',
    estimatedDuration: '2 min read',
    aspectRatio: '4:5',
    characterLimit: 2200,
    currentCharacterCount: 1940,
    cta: 'Share this carousel with a fellow creator →',
    thumbnailStatus: 'approved',
    readinessScore: 88,
    isLocked: false,
    lastUpdated: '2025-01-15T09:45:00Z',
    recommendations: [
      {
        id: 'car-r1',
        type: 'engagement',
        priority: 'low',
        title: 'A/B Test Cover Slide',
        description: 'Try a face-forward cover image vs. data-forward cover. Face covers average 18% more saves.',
        applied: false,
      },
    ],
  },
];

// ─── Project Summary Stats ────────────────────────────────────────────────────

export const DISTRIBUTION_PROJECT = {
  projectTitle: MASTER_CONTENT.projectTitle,
  totalPlatforms: PLATFORM_ADAPTATIONS.length,
  approvedCount: PLATFORM_ADAPTATIONS.filter(p => p.status === 'approved').length,
  publishedCount: PLATFORM_ADAPTATIONS.filter(p => p.status === 'published').length,
  readyToPublishCount: PLATFORM_ADAPTATIONS.filter(p => p.status === 'ready-to-publish').length,
  draftCount: PLATFORM_ADAPTATIONS.filter(p => p.status === 'draft').length,
  overallReadiness: Math.round(
    PLATFORM_ADAPTATIONS.reduce((sum, p) => sum + p.readinessScore, 0) /
      PLATFORM_ADAPTATIONS.length
  ),
};
