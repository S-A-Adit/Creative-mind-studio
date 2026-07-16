/**
 * StrategyWarRoomPage.tsx — The flagship AI Executive Boardroom page.
 *
 * DESKTOP : Three-column layout
 *   LEFT   (320px, fixed) — Concept Brief + Strategy Controls
 *   CENTER (flex-1)       — Agent roster + Live Debate Timeline + Consensus Meter
 *   RIGHT  (320px, fixed) — Scorecards + Decision Ledger + Right Panel
 *
 * TABLET  : Two-column (left+center | right collapses to tab)
 * MOBILE  : Four-tab interface (Brief | Debate | Score | Decision)
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords,
  FileText,
  MessageSquare,
  BarChart3,
  CheckSquare,
  Plus,
  ExternalLink,
  BookOpen,
  Users,
  Target,
  DollarSign,
  Clock,
  Monitor,
  Link2,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useLayout } from '../../../../../lib/useLayout';
import { AgentCard } from './components/AgentCard';
import { DebateTimeline } from './components/DebateTimeline';
import { ConsensusMeter } from './components/ConsensusMeter';
import { ScorecardsGrid } from './components/ScoreCard';
import { DecisionLedger } from './components/DecisionLedger';
import { StrategyControls } from './components/StrategyControls';
import { EthicsStatus, RightDecisionPanel } from './components/EthicsStatus';
import { MOCK_WAR_ROOM } from './mockData';
import type { DebateRunState, DebateMessage } from './types';

// ─── Shared ease ─────────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Mobile tabs ─────────────────────────────────────────────────────────────
type MobileTab = 'brief' | 'debate' | 'score' | 'decision';

const MOBILE_TABS: Array<{ id: MobileTab; label: string; icon: React.ReactNode }> = [
  { id: 'brief',    label: 'Brief',    icon: <FileText className="w-4 h-4" />    },
  { id: 'debate',   label: 'Debate',   icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'score',    label: 'Score',    icon: <BarChart3 className="w-4 h-4" />  },
  { id: 'decision', label: 'Decision', icon: <CheckSquare className="w-4 h-4" /> },
];

// ─── Concept brief panel ──────────────────────────────────────────────────────

const BriefField: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-2.5 py-2.5 border-b border-white/[0.05] last:border-0">
    <span className="text-slate-700 flex-shrink-0 mt-0.5">{icon}</span>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-[12px] text-slate-300 leading-relaxed">{value}</p>
    </div>
  </div>
);

const ConceptBriefPanel: React.FC = () => {
  const { brief } = MOCK_WAR_ROOM;
  return (
    <div className="space-y-1">
      <BriefField icon={<Zap className="w-3.5 h-3.5" />}    label="Raw Idea"    value={brief.rawIdea} />
      <BriefField icon={<Users className="w-3.5 h-3.5" />}  label="Audience"   value={brief.targetAudience} />
      <BriefField icon={<Monitor className="w-3.5 h-3.5" />} label="Platform"  value={brief.platform} />
      <BriefField icon={<Target className="w-3.5 h-3.5" />} label="Goal"       value={brief.goal} />
      <BriefField icon={<DollarSign className="w-3.5 h-3.5" />} label="Budget" value={brief.budget} />
      <BriefField icon={<Clock className="w-3.5 h-3.5" />}  label="Timeline"   value={brief.timeline} />

      {/* References */}
      {brief.references.length > 0 && (
        <div className="pt-2">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3 h-3" /> References
          </p>
          <div className="space-y-1.5">
            {brief.references.map(ref => (
              <a
                key={ref.label}
                href={ref.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[11px] text-[#9D6CFF] hover:text-white
                  transition-colors duration-150 group"
              >
                <Link2 className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{ref.label}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Panel wrapper ────────────────────────────────────────────────────────────

const Panel: React.FC<{
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  noPad?: boolean;
}> = ({ title, subtitle, action, children, className = '', glowColor, noPad }) => (
  <div
    className={`rounded-2xl border border-white/[0.07] bg-[#10101A]/80 backdrop-blur-sm overflow-hidden ${className}`}
    style={glowColor ? { boxShadow: `0 0 30px ${glowColor}15` } : undefined}
  >
    {(title || subtitle || action) && (
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div>
          {title && <h3 className="font-display font-semibold text-[14px] text-white tracking-tight">{title}</h3>}
          {subtitle && <p className="text-[11px] text-slate-500 font-mono mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    )}
    <div className={noPad ? '' : 'p-5'}>{children}</div>
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────

interface StrategyWarRoomPageProps {
  onBack?: () => void;
  onContinueToResearch?: () => void;
}

export const StrategyWarRoomPage: React.FC<StrategyWarRoomPageProps> = ({
  onBack,
  onContinueToResearch,
}) => {
  const { setBreadcrumbs, setPrimaryAction, setActiveNavId } = useLayout();
  const [mobileTab, setMobileTab] = useState<MobileTab>('debate');
  const [runState, setRunState] = useState<DebateRunState>(MOCK_WAR_ROOM.debate.runState);
  const [messages, setMessages] = useState<DebateMessage[]>(MOCK_WAR_ROOM.debate.messages);
  const [elapsed, setElapsed] = useState(MOCK_WAR_ROOM.debate.elapsedSeconds);
  const [consensus, setConsensus] = useState(MOCK_WAR_ROOM.debate.consensusPct);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Shell integration
  useEffect(() => {
    setActiveNavId('strategy-room');
    setBreadcrumbs([
      { label: 'Projects', href: '#' },
      { label: MOCK_WAR_ROOM.brief.projectTitle, href: '#' },
      { label: 'Strategy War Room' },
    ]);
    setPrimaryAction({
      label: 'Export Strategy',
      icon: <ExternalLink className="w-3.5 h-3.5" />,
      onClick: () => {},
    });
    return () => setPrimaryAction(null);
  }, [setBreadcrumbs, setPrimaryAction, setActiveNavId]);

  // Live timer when running
  useEffect(() => {
    if (runState === 'running') {
      timerRef.current = setInterval(() => {
        setElapsed(e => e + 1);
        setConsensus(c => Math.min(100, c + 0.02));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [runState]);

  const handleStart = useCallback(() => setRunState('running'), []);
  const handlePause = useCallback(() => setRunState('paused'), []);
  const handleStop  = useCallback(() => setRunState('idle'), []);
  const handleAccept = useCallback(() => setRunState('complete'), []);

  const handleFollowUp = useCallback((question: string) => {
    const newMsg: DebateMessage = {
      id: `msg-fu-${Date.now()}`,
      agentId: 'creative-director',
      type: 'response',
      round: MOCK_WAR_ROOM.debate.currentRound,
      timestamp: new Date(),
      message: `[Follow-up injected]: "${question}" — the board will respond in the next round.`,
      confidence: 90,
      evidences: [],
    };
    setMessages(prev => [...prev, newMsg]);
  }, []);

  const liveAgents = MOCK_WAR_ROOM.agents.filter(
    a => (a.status === 'thinking' || a.status === 'responding') && runState === 'running'
  );
  const ethicsAgent = MOCK_WAR_ROOM.agents.find(a => a.id === 'ethics-auditor');

  const debateState = {
    ...MOCK_WAR_ROOM.debate,
    messages,
    elapsedSeconds: elapsed,
    consensusPct: Math.round(consensus),
  };

  // ── Left Column ─────────────────────────────────────────────────────────────
  const LeftColumn = (
    <div className="flex flex-col gap-5 h-full overflow-y-auto">
      {/* Brief */}
      <Panel
        title="Concept Brief"
        subtitle={MOCK_WAR_ROOM.brief.projectTitle}
        action={
          <button type="button" className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
            Edit <ChevronRight className="w-3 h-3" />
          </button>
        }
        glowColor="#8B5CF6"
      >
        <ConceptBriefPanel />
      </Panel>

      {/* Controls */}
      <Panel title="Strategy Controls" subtitle="Run · Pause · Direct the Board">
        <StrategyControls
          runState={runState}
          onStart={handleStart}
          onPause={handlePause}
          onStop={handleStop}
          onAskFollowUp={handleFollowUp}
          onChallenge={() => {}}
          onNextRound={() => {}}
          onCompareVersions={() => {}}
          onAccept={handleAccept}
          onPivot={() => {}}
        />
      </Panel>
    </div>
  );

  // ── Center Column ───────────────────────────────────────────────────────────
  const CenterColumn = (
    <div className="flex flex-col gap-5 h-full min-h-0">
      {/* Consensus meter */}
      <Panel title="Debate Progress" subtitle={`Round ${debateState.currentRound} · ${debateState.stage.replace(/-/g, ' ')}`} glowColor="#8B5CF6">
        <ConsensusMeter debate={debateState} />
      </Panel>

      {/* Agent roster */}
      <Panel
        title="Board of Directors"
        subtitle={`${MOCK_WAR_ROOM.agents.length} AI Specialists`}
        action={
          <div className="flex items-center gap-1.5">
            {liveAgents.length > 0 && (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="flex items-center gap-1.5 text-[11px] font-mono text-[#9D6CFF] px-2.5 py-1 rounded-lg bg-[#7C3AED]/10 border border-[#7C3AED]/20"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#9D6CFF] animate-pulse" />
                {liveAgents.length} live
              </motion.span>
            )}
          </div>
        }
        noPad
      >
        <div className="p-4 grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5">
          {MOCK_WAR_ROOM.agents.map((agent, i) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              index={i}
              isActive={runState === 'running' && (agent.status === 'thinking' || agent.status === 'responding')}
              compact
            />
          ))}
        </div>
      </Panel>

      {/* Debate timeline */}
      <Panel
        title="Live Strategy Debate"
        subtitle="Executive AI Boardroom — Professional discussion timeline"
        action={
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-emerald-400 font-mono">
              {runState === 'running' ? 'Live' : runState === 'paused' ? 'Paused' : runState === 'complete' ? 'Complete' : 'Ready'}
            </span>
          </div>
        }
        className="flex-1 min-h-0"
        noPad
        glowColor={runState === 'running' ? '#8B5CF6' : undefined}
      >
        <div className="p-5 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          <DebateTimeline
            messages={messages}
            agents={MOCK_WAR_ROOM.agents}
            activeAgents={liveAgents}
          />
        </div>
      </Panel>
    </div>
  );

  // ── Right Column ────────────────────────────────────────────────────────────
  const RightColumn = (
    <div className="flex flex-col gap-5 h-full overflow-y-auto">
      {/* Scorecards */}
      <Panel
        title="Live Scorecards"
        subtitle="AI-scored · updates each round"
        action={<span className="text-[10px] font-mono text-slate-600">{MOCK_WAR_ROOM.scorecards.length} metrics</span>}
      >
        <ScorecardsGrid
          scorecards={MOCK_WAR_ROOM.scorecards}
          agents={MOCK_WAR_ROOM.agents}
        />
      </Panel>

      {/* Ethics */}
      <EthicsStatus ethicsAgent={ethicsAgent} />

      {/* Decision ledger */}
      <Panel noPad className="overflow-hidden">
        <div className="p-5">
          <DecisionLedger
            entries={MOCK_WAR_ROOM.ledger}
            agents={MOCK_WAR_ROOM.agents}
          />
        </div>
      </Panel>

      {/* Right decision panel */}
      <RightDecisionPanel
        decision={MOCK_WAR_ROOM.decision}
        agents={MOCK_WAR_ROOM.agents}
        onContinueToResearch={onContinueToResearch}
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: EASE }}
      className="w-full min-h-full flex flex-col bg-[#07070A]"
    >
      {/* ── Page header bar ── */}
      <div className="flex-shrink-0 sticky top-0 z-30 bg-[#07070A]/95 backdrop-blur-sm
        border-b border-white/[0.07] px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-[12px] text-slate-500 hover:text-slate-300 transition-colors font-mono flex-shrink-0"
            >
              ←
            </button>
          )}

          {/* War Room title badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#7C3AED]/40 to-[#9D6CFF]/20
              border border-[#8B5CF6]/30 flex items-center justify-center flex-shrink-0">
              <Swords className="w-4 h-4 text-[#9D6CFF]" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display font-bold text-[15px] text-white leading-tight">Strategy War Room</h1>
              <p className="text-[10px] font-mono text-slate-600 truncate hidden sm:block">
                {MOCK_WAR_ROOM.brief.projectTitle}
              </p>
            </div>
          </div>

          {/* Live indicator */}
          <AnimatePresence>
            {runState === 'running' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                  bg-[#7C3AED]/10 border border-[#7C3AED]/20"
              >
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-[#9D6CFF]"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[11px] font-mono text-[#9D6CFF]">Board in Session</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Consensus chip */}
          <div className="ml-auto hidden sm:flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-600">Consensus</span>
            <span
              className="font-display font-bold text-[15px]"
              style={{
                color: consensus >= 80 ? '#10B981' : consensus >= 60 ? '#F59E0B' : '#EF4444',
              }}
            >
              {Math.round(consensus)}%
            </span>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="flex xl:hidden gap-1 mt-3 overflow-x-auto">
          {MOBILE_TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMobileTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-medium
                flex-shrink-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]
                ${mobileTab === tab.id
                  ? 'bg-[#7C3AED]/20 border border-[#8B5CF6]/30 text-[#9D6CFF]'
                  : 'border border-white/[0.07] text-slate-500 hover:text-slate-300 hover:border-white/[0.13]'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Desktop three-column body ── */}
      <div className="flex-1 hidden xl:grid grid-cols-[320px_1fr_320px] 2xl:grid-cols-[360px_1fr_360px] gap-0 overflow-hidden">
        {/* Left */}
        <div className="border-r border-white/[0.06] overflow-y-auto p-5 space-y-5">
          {LeftColumn}
        </div>
        {/* Center */}
        <div className="overflow-y-auto p-5 space-y-5">
          {CenterColumn}
        </div>
        {/* Right */}
        <div className="border-l border-white/[0.06] overflow-y-auto p-5 space-y-5">
          {RightColumn}
        </div>
      </div>

      {/* ── Tablet two-column body (md – xl) ── */}
      <div className="flex-1 hidden md:grid xl:hidden grid-cols-2 gap-0 overflow-hidden">
        <div className="border-r border-white/[0.06] overflow-y-auto p-5 space-y-5">
          {LeftColumn}
        </div>
        <div className="overflow-y-auto p-5 space-y-5">
          {CenterColumn}
        </div>
      </div>

      {/* ── Mobile single-column with tabs ── */}
      <div className="flex-1 md:hidden overflow-y-auto p-4 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={mobileTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            {mobileTab === 'brief' && (
              <div className="space-y-5">
                <Panel title="Concept Brief" subtitle={MOCK_WAR_ROOM.brief.projectTitle}>
                  <ConceptBriefPanel />
                </Panel>
                <Panel title="Strategy Controls">
                  <StrategyControls
                    runState={runState}
                    onStart={handleStart}
                    onPause={handlePause}
                    onStop={handleStop}
                    onAskFollowUp={handleFollowUp}
                    onChallenge={() => {}}
                    onNextRound={() => {}}
                    onCompareVersions={() => {}}
                    onAccept={handleAccept}
                    onPivot={() => {}}
                  />
                </Panel>
              </div>
            )}
            {mobileTab === 'debate' && (
              <div className="space-y-5">
                <Panel title="Debate Progress">
                  <ConsensusMeter debate={debateState} />
                </Panel>
                <Panel title="Board" noPad>
                  <div className="p-4 grid grid-cols-2 gap-2">
                    {MOCK_WAR_ROOM.agents.map((a, i) => (
                      <AgentCard key={a.id} agent={a} index={i} compact />
                    ))}
                  </div>
                </Panel>
                <Panel title="Live Debate" noPad>
                  <div className="p-4">
                    <DebateTimeline messages={messages} agents={MOCK_WAR_ROOM.agents} activeAgents={liveAgents} />
                  </div>
                </Panel>
              </div>
            )}
            {mobileTab === 'score' && (
              <div className="space-y-5">
                <Panel title="Live Scorecards">
                  <ScorecardsGrid scorecards={MOCK_WAR_ROOM.scorecards} agents={MOCK_WAR_ROOM.agents} />
                </Panel>
                <EthicsStatus ethicsAgent={ethicsAgent} />
              </div>
            )}
            {mobileTab === 'decision' && (
              <div className="space-y-5">
                <Panel>
                  <DecisionLedger entries={MOCK_WAR_ROOM.ledger} agents={MOCK_WAR_ROOM.agents} />
                </Panel>
                <RightDecisionPanel
                  decision={MOCK_WAR_ROOM.decision}
                  agents={MOCK_WAR_ROOM.agents}
                  onContinueToResearch={onContinueToResearch}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
