import React from 'react';
import { motion } from 'framer-motion';
import {
  Terminal, Sparkles, LayoutDashboard, Cpu, Database,
  Settings, Bell, ChevronRight, Menu, Activity, HelpCircle,
} from 'lucide-react';

// 1. Breadcrumbs
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  items: BreadcrumbItem[];
  onItemClick?: (item: BreadcrumbItem) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  onItemClick,
  className = '',
  ...props
}) => {
  return (
    <nav className={`flex items-center text-xs font-mono tracking-wider ${className}`} {...props}>
      <ol className="flex items-center space-x-1.5 text-slate-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <li>
                <button
                  type="button"
                  onClick={() => !isLast && onItemClick && onItemClick(item)}
                  className={`transition-colors duration-200 outline-none ${
                    isLast 
                      ? 'text-brand-electric font-semibold' 
                      : 'hover:text-slate-200 cursor-pointer'
                  }`}
                  disabled={isLast}
                >
                  {item.label}
                </button>
              </li>
              {!isLast && (
                <ChevronRight className="w-3 h-3 text-slate-700 select-none" />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

// 2. Top Navbar
export interface TopNavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  breadcrumbs: BreadcrumbItem[];
  notificationCount?: number;
  userEmail?: string;
  onMenuToggle?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  breadcrumbs,
  notificationCount = 3,
  userEmail = "executive@creativemind.studio",
  onMenuToggle,
  className = '',
  ...props
}) => {
  return (
    <header
      className={`h-16 border-b border-slate-800/60 bg-brand-bg/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 ${className}`}
      {...props}
    >
      <div className="flex items-center gap-4">
        {onMenuToggle && (
          <button 
            onClick={onMenuToggle}
            className="md:hidden text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Breadcrumb items={breadcrumbs} />
      </div>

      <div className="flex items-center gap-4">
        {/* Connection Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-900/60 border border-slate-800/60 px-2.5 py-1 rounded-full text-[10px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>SECURE CORE CONNECTED</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-slate-900/50 cursor-pointer">
          <Bell className="w-4.5 h-4.5" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-purple shadow-sm" />
          )}
        </button>

        {/* User Info Capsule */}
        <div className="flex items-center gap-2.5 bg-slate-950/60 border border-slate-800/80 p-1.5 pr-3.5 rounded-xl">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-brand-violet to-brand-purple flex items-center justify-center text-xs font-bold text-white">
            E
          </div>
          <span className="text-[11px] font-mono font-medium text-slate-400 hidden sm:inline">
            {userEmail}
          </span>
        </div>
      </div>
    </header>
  );
};

// 3. Sidebar
export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  activeId: string;
  onItemSelect: (id: string) => void;
  items?: SidebarItem[];
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeId,
  onItemSelect,
  items = [
    { id: 'dashboard', label: 'Executive Deck', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'cognitive', label: 'Cognitive Engine', icon: <Cpu className="w-4 h-4" /> },
    { id: 'vault', label: 'Memory Vault', icon: <Database className="w-4 h-4" /> },
    { id: 'analytics', label: 'Core Telemetry', icon: <Activity className="w-4 h-4" /> },
    { id: 'settings', label: 'System Settings', icon: <Settings className="w-4 h-4" /> },
  ],
  collapsed = false,
  className = '',
  ...props
}) => {
  return (
    <aside
      className={`border-r border-slate-800/60 bg-slate-950/40 flex flex-col h-screen sticky top-0 transition-all duration-300 z-50 ${
        collapsed ? 'w-16' : 'w-64'
      } ${className}`}
      {...props}
    >
      {/* Brand Logo Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/40">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-brand-violet to-brand-purple shadow-lg border border-brand-purple/20">
          <Terminal className="w-4 h-4 text-brand-electric" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-display font-semibold text-xs tracking-wider text-white uppercase">
              CreativeMind
            </span>
            <span className="text-[9px] font-mono font-semibold tracking-widest text-brand-electric/80">
              STUDIO
            </span>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onItemSelect(item.id)}
              className={`w-full flex items-center rounded-xl p-2.5 transition-all duration-300 relative group cursor-pointer text-left outline-none`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSidebarIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-brand-purple/15 to-transparent border-l-2 border-brand-purple rounded-xl"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              <div className={`relative z-10 flex items-center ${collapsed ? 'justify-center w-full' : 'gap-3'}`}>
                <span className={`transition-colors duration-300 ${
                  isActive ? 'text-brand-electric' : 'text-slate-500 group-hover:text-slate-300'
                }`}>
                  {item.icon}
                </span>
                
                {!collapsed && (
                  <span className={`text-xs font-semibold tracking-wide font-sans transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}>
                    {item.label}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Branding or Help */}
      <div className="p-4 border-t border-slate-800/40 flex flex-col gap-3">
        {!collapsed && (
          <div className="bg-gradient-to-br from-brand-purple/10 to-transparent border border-brand-purple/20 rounded-xl p-3 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-electric tracking-wide uppercase">
              <Sparkles className="w-3 h-3 text-brand-electric" />
              <span>Executive Tier</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Unlocked: Pro design controls & cloud workspace storage.
            </p>
          </div>
        )}
        <div className={`flex items-center text-xs text-slate-500 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <span className="font-mono text-[10px]">VER: 4.1.2-beta</span>
          )}
          <HelpCircle className="w-4 h-4 hover:text-slate-300 cursor-pointer" />
        </div>
      </div>
    </aside>
  );
};
