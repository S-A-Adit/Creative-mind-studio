/**
 * NotificationPreferences.tsx — Settings slide-over panel
 *
 * Allows enabling/disabling notification categories and delivery options.
 * Slides in from the right using AnimatePresence.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings2, X, ClipboardCheck, AtSign, Bot,
  CheckCircle2, Clock, BookOpen, Radio, Mail, Smartphone, Volume2,
} from 'lucide-react';
import type { NotificationPreferences } from '../types';

// ─── Toggle row ───────────────────────────────────────────────────────────────

interface ToggleRowProps {
  icon:       React.ReactNode;
  label:      string;
  description:string;
  value:      boolean;
  onChange:   (v: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ icon, label, description, value, onChange }) => (
  <div className="flex items-center gap-3 py-3.5 border-b border-white/[0.05] last:border-0">
    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-500 flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[13px] font-sans font-medium text-slate-200">{label}</p>
      <p className="text-[11px] text-slate-600 font-sans mt-0.5 leading-snug">{description}</p>
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5.5 rounded-full p-0.5 flex-shrink-0 transition-colors duration-250 focus:outline-none
        ${value ? 'bg-brand-purple' : 'bg-white/[0.12]'}`}
      style={{ height: '22px' }}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        className="w-4 h-4 bg-white rounded-full shadow-sm"
        style={{ translateX: value ? '20px' : '0px' }}
      />
    </button>
  </div>
);

// ─── Section header ───────────────────────────────────────────────────────────

const SectionHeader: React.FC<{ label: string }> = ({ label }) => (
  <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-600 font-mono mb-1 pt-1">
    {label}
  </p>
);

// ─── Props ────────────────────────────────────────────────────────────────────

interface NotificationPreferencesProps {
  isOpen:      boolean;
  prefs:       NotificationPreferences;
  onChange:    (key: keyof NotificationPreferences, value: boolean) => void;
  onClose:     () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const NotificationPreferencesPanel: React.FC<NotificationPreferencesProps> = ({
  isOpen, prefs, onChange, onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="fixed right-0 top-0 bottom-0 w-80 md:w-96 bg-[#0F0F1C] border-l border-white/[0.08] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4.5 border-b border-white/[0.07]" style={{ paddingTop: '18px', paddingBottom: '18px' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-brand-purple/15 border border-brand-purple/20 flex items-center justify-center">
                  <Settings2 className="w-3.5 h-3.5 text-brand-electric" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-slate-100 text-[13.5px] tracking-wide">Notification Preferences</h2>
                  <p className="text-[11px] text-slate-600 font-mono">Control what you see and how</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.07] flex items-center justify-center text-slate-500 hover:text-slate-200 transition-colors duration-150"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

              {/* ── Notification categories ── */}
              <div className="bg-white/[0.025] border border-white/[0.06] rounded-xl px-4 py-3">
                <SectionHeader label="Notification Types" />
                <ToggleRow
                  icon={<ClipboardCheck className="w-4 h-4" />}
                  label="Assignments"
                  description="When tasks or projects are assigned to you"
                  value={prefs.assignments}
                  onChange={v => onChange('assignments', v)}
                />
                <ToggleRow
                  icon={<AtSign className="w-4 h-4" />}
                  label="Mentions"
                  description="When someone @mentions you in a comment"
                  value={prefs.mentions}
                  onChange={v => onChange('mentions', v)}
                />
                <ToggleRow
                  icon={<Bot className="w-4 h-4" />}
                  label="AI Agents"
                  description="When an AI agent completes or fails a task"
                  value={prefs.aiAgents}
                  onChange={v => onChange('aiAgents', v)}
                />
                <ToggleRow
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  label="Approvals"
                  description="Approval requests and sign-off notifications"
                  value={prefs.approvals}
                  onChange={v => onChange('approvals', v)}
                />
                <ToggleRow
                  icon={<Clock className="w-4 h-4" />}
                  label="Deadlines"
                  description="Upcoming and overdue delivery alerts"
                  value={prefs.deadlines}
                  onChange={v => onChange('deadlines', v)}
                />
                <ToggleRow
                  icon={<BookOpen className="w-4 h-4" />}
                  label="Research Updates"
                  description="Source verifications and research completions"
                  value={prefs.researchUpdates}
                  onChange={v => onChange('researchUpdates', v)}
                />
                <ToggleRow
                  icon={<Radio className="w-4 h-4" />}
                  label="Publication Updates"
                  description="Published content and scheduling confirmations"
                  value={prefs.publicationUpdates}
                  onChange={v => onChange('publicationUpdates', v)}
                />
              </div>

              {/* ── Delivery options ── */}
              <div className="bg-white/[0.025] border border-white/[0.06] rounded-xl px-4 py-3">
                <SectionHeader label="Delivery" />
                <ToggleRow
                  icon={<Mail className="w-4 h-4" />}
                  label="Email Digest"
                  description="Daily summary delivered to your inbox"
                  value={prefs.emailDigest}
                  onChange={v => onChange('emailDigest', v)}
                />
                <ToggleRow
                  icon={<Smartphone className="w-4 h-4" />}
                  label="Push Notifications"
                  description="Browser or mobile push alerts"
                  value={prefs.pushNotifications}
                  onChange={v => onChange('pushNotifications', v)}
                />
                <ToggleRow
                  icon={<Volume2 className="w-4 h-4" />}
                  label="Sound"
                  description="Play a sound for critical notifications"
                  value={prefs.sound}
                  onChange={v => onChange('sound', v)}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-white/[0.06] flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-brand-purple/80 hover:bg-brand-purple text-white text-[12.5px] font-semibold font-sans transition-colors duration-150"
              >
                Save Preferences
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
