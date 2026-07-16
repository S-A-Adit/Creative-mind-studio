import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, IconButton } from './Buttons';
import { TextInput, Textarea, Select, SearchInput } from './Inputs';
import { GlassCard, DashboardCard, StatCard, AgentCard, FeatureCard } from './Card';
import { Badge, StatusBadge, ProgressBar, CircularProgress, LoadingSpinner } from './Status';
import { Sidebar, TopNavbar, type BreadcrumbItem } from './Navigation';
import { Alert, Tooltip, Modal, Toast, type ToastItem } from './Feedback';
import { SectionContainer, PageHeader, Divider } from './Layouts';
import {
  Info, Sparkles, Copy, Sliders, Terminal, ShieldCheck, Zap, Laptop, ArrowRight, MessageSquareCode,
  Settings, X,
} from 'lucide-react';

export const Showcase: React.FC = () => {
  // Navigation & General App State
  const [activeSidebarTab, setActiveSidebarTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Interactive component states
  const [primaryLoading, setPrimaryLoading] = useState(false);
  const [agent1Active, setAgent1Active] = useState(true);
  const [agent2Active, setAgent2Active] = useState(false);
  const [progressVal, setProgressVal] = useState(68);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputText, setInputText] = useState('Executive Command');
  const [selectVal, setSelectVal] = useState('tier-premium');
  
  // Toast List State
  const [toasts, setToasts] = useState<ToastItem[]>([
    { id: '1', message: 'Design tokens synchronized with tailwind config.', variant: 'success' }
  ]);
  
  // Alert dismiss states
  const [showInfoAlert, setShowInfoAlert] = useState(true);

  const triggerToast = (message: string, variant: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, variant }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    triggerToast(`Token "${token}" copied to clipboard!`, 'success');
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'CreativeMind Studio' },
    { label: 'Design System' },
    { label: activeSidebarTab.toUpperCase() }
  ];

  // Quick helper to search components
  const matchesSearch = (text: string) => {
    if (!searchQuery) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="flex min-h-screen bg-brand-bg text-slate-100 selection:bg-brand-purple/30 selection:text-white relative">
      
      {/* Absolute Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-purple/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />
      
      {/* Decorative Grid Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

      {/* Reusable Sidebar Navigation */}
      <Sidebar 
        activeId={activeSidebarTab} 
        onItemSelect={(id) => {
          setActiveSidebarTab(id);
          triggerToast(`Navigated to section: ${id}`, 'info');
        }}
        collapsed={isSidebarCollapsed}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        
        {/* Reusable Top Navbar */}
        <TopNavbar 
          breadcrumbs={breadcrumbs} 
          onMenuToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Dynamic App Content Body */}
        <main className="flex-grow">
          <SectionContainer padded={true}>
            
            {/* Page Header */}
            <PageHeader 
              title="CreativeMind Design System" 
              description="A majestic, high-fidelity design engine for modern AI-powered software interfaces. Explore and interact with premium glassmorphic cards, glowing status triggers, elegant inputs, and motion-based layout components."
              actions={
                <div className="flex items-center gap-2">
                  <div className="w-56 hidden md:block">
                    <SearchInput 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search design assets..." 
                    />
                  </div>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    leftIcon={<Sparkles className="w-4 h-4" />}
                    onClick={() => {
                      setPrimaryLoading(true);
                      triggerToast('Compiling custom design assets...', 'info');
                      setTimeout(() => {
                        setPrimaryLoading(false);
                        triggerToast('System tokens compiled successfully!', 'success');
                      }, 1500);
                    }}
                    isLoading={primaryLoading}
                  >
                    Compile Tokens
                  </Button>
                </div>
              }
            />

            {/* Design Tokens quick info bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-mono text-slate-500 tracking-wider">DARK BACKDROP</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-mono font-bold text-slate-200">#0B1020</span>
                  <button 
                    onClick={() => handleCopyToken('#0B1020')}
                    className="p-1 hover:bg-slate-900 rounded text-slate-500 hover:text-white cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-mono text-slate-500 tracking-wider">ELECTRIC ACCENT</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-mono font-bold text-slate-200">#8B5CF6</span>
                  <button 
                    onClick={() => handleCopyToken('#8B5CF6')}
                    className="p-1 hover:bg-slate-900 rounded text-slate-500 hover:text-white cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-mono text-slate-500 tracking-wider">BORDER GLOW</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-mono font-bold text-slate-200">shadow-glass</span>
                  <button 
                    onClick={() => handleCopyToken('shadow-glass')}
                    className="p-1 hover:bg-slate-900 rounded text-slate-500 hover:text-white cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-mono text-slate-500 tracking-wider">ROUNDING FACTOR</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-mono font-bold text-slate-200">16px - 20px</span>
                  <button 
                    onClick={() => handleCopyToken('rounded-2xl')}
                    className="p-1 hover:bg-slate-900 rounded text-slate-500 hover:text-white cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Live Search Alert feedback */}
            {searchQuery && (
              <div className="mb-6">
                <Alert variant="info" title="Filtering Components">
                  Showing design system assets matching "<span className="font-mono text-brand-electric font-semibold">{searchQuery}</span>". Clear the search to view all elements.
                </Alert>
              </div>
            )}

            {/* MAIN DEMO SECTIONS */}
            <div className="space-y-12">
              
              {/* SECTION 1: BUTTONS & INPUTS */}
              {matchesSearch("button") || matchesSearch("input") || matchesSearch("textarea") || matchesSearch("select") ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-brand-purple/10 text-brand-electric border border-brand-purple/20">
                        <MessageSquareCode className="w-4.5 h-4.5" />
                      </div>
                      <h2 className="font-display font-semibold text-lg tracking-wide text-slate-100">
                        Interactive Action Blocks (Buttons & Inputs)
                      </h2>
                    </div>
                    <Badge variant="purple">SYSTEM CORE</Badge>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Buttons Showcase Card */}
                    <DashboardCard 
                      title="Button Variants & Scales" 
                      subtitle="Premium interactions equipped with responsive hover glows, active tap scales, and loading support."
                      footer="Design token properties: hover:scale-102 font-sans rounded-xl tracking-wide"
                    >
                      <div className="flex flex-col gap-6">
                        {/* Variant Row */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Button Variants</span>
                          <div className="flex flex-wrap items-center gap-3">
                            <Button variant="primary" onClick={() => triggerToast('Primary button activated!', 'success')}>
                              Primary
                            </Button>
                            <Button variant="secondary" onClick={() => triggerToast('Secondary action triggered.', 'info')}>
                              Secondary
                            </Button>
                            <Button variant="ghost" onClick={() => triggerToast('Ghost action triggered.', 'info')}>
                              Ghost
                            </Button>
                            <Button variant="danger" onClick={() => triggerToast('Danger warning approved.', 'error')}>
                              Danger
                            </Button>
                          </div>
                        </div>

                        {/* Scales & Icons Row */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Scales & Icon Integrations</span>
                          <div className="flex flex-wrap items-center gap-3">
                            <Button variant="primary" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                              Small Spark
                            </Button>
                            <Button variant="secondary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                              Proceed Standard
                            </Button>
                            <Button variant="primary" size="lg" className="shadow-glow-purple">
                              Spacious Executive
                            </Button>
                          </div>
                        </div>

                        {/* Icon-Only Buttons */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Icon Buttons</span>
                          <div className="flex items-center gap-3">
                            <Tooltip content="Launch Standard Core" position="top">
                              <IconButton icon={<Zap className="w-4.5 h-4.5" />} variant="primary" />
                            </Tooltip>
                            <Tooltip content="Configure Systems" position="top">
                              <IconButton icon={<Settings className="w-4.5 h-4.5" />} variant="secondary" />
                            </Tooltip>
                            <Tooltip content="Danger Action" position="top">
                              <IconButton icon={<X className="w-4.5 h-4.5" />} variant="danger" />
                            </Tooltip>
                            <Tooltip content="Ghost Toggle" position="top">
                              <IconButton icon={<Laptop className="w-4.5 h-4.5" />} variant="ghost" />
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </DashboardCard>

                    {/* Inputs Showcase Card */}
                    <DashboardCard 
                      title="Form Input Systems" 
                      subtitle="Minimalist styling with deep background shading, glowing outline focus, helper text, and validation states."
                      footer="Design token properties: bg-slate-950/50 border-slate-800/80 rounded-xl"
                    >
                      <div className="flex flex-col gap-5">
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <TextInput 
                            label="Cognitive Core Label" 
                            placeholder="Enter core designation..." 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            helperText="Must match system host guidelines"
                          />
                          <TextInput 
                            label="Security Exception State" 
                            placeholder="Type value..." 
                            defaultValue="INVALID_TOKEN_KEY"
                            error="Provided key lacks executive security permissions"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Select 
                            label="Execution Workspace"
                            value={selectVal}
                            onChange={(e) => {
                              setSelectVal(e.target.value);
                              triggerToast(`Workspace shifted: ${e.target.value}`, 'success');
                            }}
                            options={[
                              { value: 'tier-standard', label: 'Standard Deck (US-EAST)' },
                              { value: 'tier-premium', label: 'Premium Executive Suite' },
                              { value: 'tier-isolated', label: 'Isolated Space sandbox' },
                            ]}
                          />
                          <SearchInput 
                            label="Interactive Filter"
                            placeholder="Filter dashboard elements..." 
                          />
                        </div>

                        <Textarea 
                          label="Prompt Core Instructions" 
                          placeholder="Describe instructions for creative intelligence generation..." 
                          defaultValue="Analyze workspace data structure and format all outputs utilizing spacious, minimalist margins. Keep colors centered around executive dark navies and electric violet elements."
                        />

                      </div>
                    </DashboardCard>

                  </div>
                </div>
              ) : null}

              {/* SECTION 2: CARDS & LAYOUT */}
              {matchesSearch("card") || matchesSearch("stat") || matchesSearch("agent") || matchesSearch("feature") || matchesSearch("layout") ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-brand-purple/10 text-brand-electric border border-brand-purple/20">
                        <Laptop className="w-4.5 h-4.5" />
                      </div>
                      <h2 className="font-display font-semibold text-lg tracking-wide text-slate-100">
                        Visual Backdrops & Bento Cards
                      </h2>
                    </div>
                    <Badge variant="cyan">BENTO GRID</Badge>
                  </div>

                  {/* Stat Cards Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                      title="Cognitive Bandwidth" 
                      value="4,821.5 Gb" 
                      trend={12.4} 
                      trendLabel="vs yesterday" 
                      icon={<Zap className="w-5 h-5" />}
                    />
                    <StatCard 
                      title="Creative Yield" 
                      value="92.48%" 
                      trend={4.2} 
                      trendLabel="vs last epoch" 
                      icon={<Sparkles className="w-5 h-5" />}
                    />
                    <StatCard 
                      title="Process Latency" 
                      value="18 ms" 
                      trend={-15.8} 
                      trendLabel="lower is better" 
                      icon={<ShieldCheck className="w-5 h-5" />}
                    />
                  </div>

                  {/* Agent and Feature card grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Glass Card & Features */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                      <GlassCard glow={true}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-brand-electric font-semibold uppercase tracking-wider">
                              Executive Strategy Ambient Card
                            </span>
                            <h3 className="font-display font-bold text-xl text-white tracking-wide">
                              Design system focused entirely on visual clarity.
                            </h3>
                            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                              This glassmorphic container implements an ultra-smooth backdrop blur and custom glowing borders. The top edge features an elegant 1px white/violet gradient light strip.
                            </p>
                          </div>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => setIsModalOpen(true)}
                          >
                            Open Strategy Deck
                          </Button>
                        </div>
                      </GlassCard>

                      {/* Feature Card Side-by-Side */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FeatureCard 
                          title="Framer Motion Integration" 
                          description="Components react seamlessly to user actions with spring-loaded feedback loops."
                          icon={<Sparkles className="w-5 h-5" />}
                          badge="Animation"
                        />
                        <FeatureCard 
                          title="Custom SVG Glyphs" 
                          description="Engineered to adapt beautifully to scale while retaining sharp resolution borders."
                          icon={<Terminal className="w-5 h-5" />}
                          badge="Resolution"
                        />
                      </div>
                    </div>

                    {/* AI Agent Cards */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                      <div className="p-1">
                        <h3 className="font-display font-semibold text-xs text-slate-400 uppercase tracking-widest mb-3">
                          Interactive AI Agents
                        </h3>
                        <div className="flex flex-col gap-4">
                          <AgentCard 
                            name="MindForge-V4" 
                            role="Creative Synthesizer" 
                            model="Gemini 2.5 Omni" 
                            status="active"
                            isActive={agent1Active}
                            onToggleActive={() => {
                              setAgent1Active(!agent1Active);
                              triggerToast(`Agent MindForge-V4 ${!agent1Active ? 're-engaged' : 'suspended'}.`, !agent1Active ? 'success' : 'error');
                            }}
                          />
                          <AgentCard 
                            name="StrategyScribe" 
                            role="Executive Analyst" 
                            model="Gemini Flash Pro" 
                            status="idle"
                            isActive={agent2Active}
                            onToggleActive={() => {
                              setAgent2Active(!agent2Active);
                              triggerToast(`Agent StrategyScribe ${!agent2Active ? 're-engaged' : 'suspended'}.`, !agent2Active ? 'success' : 'error');
                            }}
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ) : null}

              {/* SECTION 3: STATUS & FEEDBACK */}
              {matchesSearch("status") || matchesSearch("progress") || matchesSearch("badge") || matchesSearch("modal") || matchesSearch("toast") || matchesSearch("alert") ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-brand-purple/10 text-brand-electric border border-brand-purple/20">
                        <Sliders className="w-4.5 h-4.5" />
                      </div>
                      <h2 className="font-display font-semibold text-lg tracking-wide text-slate-100">
                        Status Metrics & System Overlays
                      </h2>
                    </div>
                    <Badge variant="emerald">CORE TELEMETRY</Badge>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Status Showcase Card */}
                    <DashboardCard 
                      title="Metrics & Dial Elements" 
                      subtitle="Utilize precise visualizers for processing statuses, capacities, and load values."
                      action={
                        <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800/80">
                          <span className="text-[10px] font-mono text-slate-500 font-bold">LOAD DIAL</span>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={progressVal}
                            onChange={(e) => setProgressVal(Number(e.target.value))}
                            className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                          />
                        </div>
                      }
                      footer="Interactive: Adjust the LOAD DIAL slider to witness real-time progress transitions."
                    >
                      <div className="flex flex-col gap-6">
                        
                        {/* Badges Container */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Badge Categories</span>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="purple">Purple Token</Badge>
                            <Badge variant="cyan" outline={true}>Cyan Outline</Badge>
                            <Badge variant="emerald">Emerald Success</Badge>
                            <Badge variant="amber">Amber Check</Badge>
                            <Badge variant="rose">Rose Alert</Badge>
                            <Badge variant="slate" outline={true}>Slate Standard</Badge>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pulsing Status Badges</span>
                          <div className="flex flex-wrap items-center gap-3">
                            <StatusBadge status="online" />
                            <StatusBadge status="maintenance" />
                            <StatusBadge status="warning" />
                            <StatusBadge status="offline" />
                          </div>
                        </div>

                        {/* Progress Indicators */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                          <div className="sm:col-span-2">
                            <ProgressBar value={progressVal} label="Isolated RAM Load" />
                          </div>
                          <div className="flex items-center justify-center">
                            <CircularProgress value={progressVal} size={72} strokeWidth={7} />
                          </div>
                        </div>

                        {/* Spinners */}
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <LoadingSpinner size="sm" />
                            <span className="text-xs text-slate-500 font-mono">Initializing</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <LoadingSpinner size="md" />
                            <span className="text-xs text-slate-500 font-mono">Synchronizing</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <LoadingSpinner size="lg" />
                            <span className="text-xs text-slate-500 font-mono">Compiling Model</span>
                          </div>
                        </div>

                      </div>
                    </DashboardCard>

                    {/* Feedback Showcase Card */}
                    <DashboardCard 
                      title="System Overlays & Alerts" 
                      subtitle="Interactive controls to deploy overlays, trigger system dialogs, and render notices."
                      footer="Interactive: Tap 'Trigger Success Toast' to dispatch standard system-wide toast overlays."
                    >
                      <div className="flex flex-col gap-5">
                        
                        {/* Alert Blocks */}
                        <AnimatePresence>
                          {showInfoAlert && (
                            <motion.div
                              exit={{ opacity: 0, height: 0, marginTop: 0, overflow: 'hidden' }}
                              transition={{ duration: 0.3 }}
                            >
                              <Alert 
                                variant="info" 
                                title="Executive Security Shield Enabled"
                                onClose={() => setShowInfoAlert(false)}
                              >
                                All API requests and creative pipelines are fully isolated. Standard OAuth keys remain strictly hidden on the server.
                              </Alert>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Alert variant="success" title="Backup Complete">
                            All custom design system tokens committed securely.
                          </Alert>
                          <Alert variant="warning" title="Workspace Warning">
                            Creative storage is nearing 85% allocated threshold.
                          </Alert>
                        </div>

                        <Divider label="Overlay Trigger Platform" />

                        {/* Interactive triggers */}
                        <div className="flex flex-wrap items-center gap-3">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            leftIcon={<Info className="w-4 h-4" />}
                            onClick={() => setIsModalOpen(true)}
                          >
                            Launch Executive Modal
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm"
                            leftIcon={<Sparkles className="w-4 h-4 animate-bounce" />}
                            onClick={() => triggerToast('Successfully updated executive strategy configurations.', 'success')}
                          >
                            Trigger Success Toast
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => triggerToast('Process failed: Out of isolated memory.', 'error')}
                          >
                            Trigger Error Toast
                          </Button>
                        </div>

                      </div>
                    </DashboardCard>

                  </div>
                </div>
              ) : null}

              {/* SECTION 4: DESIGN SYSTEM GUIDELINE MANUAL */}
              <div className="bg-gradient-to-br from-slate-950/80 to-brand-card/25 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-purple/10 to-transparent rounded-tr-2xl pointer-events-none" />
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-brand-electric">
                    <Terminal className="w-5 h-5" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest">Architectural Guidelines</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white tracking-wide">
                    CreativeMind Studio Executive Suite Standards
                  </h3>
                  <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                    This playground serves as the definitive UI library for our Premium AI platform. High-performance design consists of consistent borders (<span className="text-brand-electric font-mono">border-slate-800/80</span>), unified glassmorphic depth (<span className="text-brand-electric font-mono">bg-slate-950/40 backdrop-blur-md</span>), premium typography, and spring-driven feedback micro-interactions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-800/60 pt-6">
                  <div className="space-y-2">
                    <span className="inline-flex p-2 rounded-xl bg-slate-900 border border-slate-800 text-brand-electric text-xs font-mono font-bold">01</span>
                    <h4 className="text-sm font-semibold text-slate-200">Anti-AI-Slop & Humble UI</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Lacks simulated ports, pseudo-terminal loops, or robotic margin credits. Human, readable labels are preferred to enhance absolute aesthetic honesty.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <span className="inline-flex p-2 rounded-xl bg-slate-900 border border-slate-800 text-brand-electric text-xs font-mono font-bold">02</span>
                    <h4 className="text-sm font-semibold text-slate-200">Desktop-First Density</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Optimized with spacious grid cards, deep structural panels, and responsive cursor hover shadows to empower maximum executive productivity.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <span className="inline-flex p-2 rounded-xl bg-slate-900 border border-slate-800 text-brand-electric text-xs font-mono font-bold">03</span>
                    <h4 className="text-sm font-semibold text-slate-200">State-Safe Local Loops</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Constructed using primitive dependencies inside React effects, eliminating render feedback locks while maintaining absolute reliability.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </SectionContainer>
        </main>
      </div>

      {/* REUSABLE INTERACTIVE MODAL */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="MindForge Strategy Engine"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Close Viewport
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              leftIcon={<Sparkles className="w-4 h-4" />}
              onClick={() => {
                setIsModalOpen(false);
                triggerToast('Isolated strategy configurations successfully approved.', 'success');
              }}
            >
              Approve Strategy
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-brand-purple/10 border border-brand-purple/20 text-brand-electric shrink-0">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100 font-sans uppercase">A.I. Model designated core active</h4>
              <p className="text-xs text-slate-400 mt-0.5">Connected to host: <span className="font-mono text-brand-electric">gemini-2.5-flash</span></p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            You are editing the executive strategy protocols of the CreativeMind Studio. These changes affect the token parameters, output categories, and isolated memory thresholds of your background AI agents. Ensure all parameters align with security regulations before final compile approval.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <TextInput label="Isolated Host designation" defaultValue="CREATIVE_MIND_CORE" size="sm" />
            <Select 
              label="Intellect Buffer Level" 
              options={[
                { value: '1', label: 'Tier 1 - Standard' },
                { value: '2', label: 'Tier 2 - Superior' },
                { value: '3', label: 'Tier 3 - Executive Max' }
              ]} 
            />
          </div>
        </div>
      </Modal>

      {/* FLOATING REAL-TIME TOASTS LIST */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast toast={toast} onDismiss={removeToast} />
            </div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
};
