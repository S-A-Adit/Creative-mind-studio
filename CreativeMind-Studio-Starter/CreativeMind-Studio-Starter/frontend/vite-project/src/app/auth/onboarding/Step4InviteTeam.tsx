/**
 * Step4InviteTeam — onboarding step 4: Invite team members.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Plus, X, ArrowRight, ArrowLeft, CheckCircle2, UserPlus } from 'lucide-react';

const _ease = [0.22, 1, 0.36, 1] as const;
void _ease;

const ROLE_OPTIONS = ['Editor', 'Viewer', 'Admin', 'Researcher', 'Scriptwriter'];

interface InviteEntry {
  id: string;
  email: string;
  role: string;
  error?: string;
}

function validateEmail(email: string): string {
  if (!email) return 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email.';
  return '';
}

interface Step4Props {
  onNext: (invites: { email: string; role: string }[]) => void;
  onBack: () => void;
  onSkip: () => void;
}

export const Step4InviteTeam: React.FC<Step4Props> = ({ onNext, onBack, onSkip }) => {
  const [entries, setEntries] = useState<InviteEntry[]>([
    { id: '1', email: '', role: 'Editor', error: undefined },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const addEntry = () => {
    setEntries((prev) => [...prev, { id: Date.now().toString(), email: '', role: 'Editor' }]);
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const updateEntry = (id: string, field: 'email' | 'role', value: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, [field]: value, error: field === 'email' ? undefined : e.error }
          : e
      )
    );
  };

  const handleSend = async () => {
    // Validate
    const validated = entries.map((e) => ({ ...e, error: validateEmail(e.email) }));
    setEntries(validated);
    const hasErrors = validated.some((e) => e.error);
    if (hasErrors) return;

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    setSent(true);
    setTimeout(() => onNext(entries.map(({ email, role }) => ({ email, role }))), 1200);
  };

  const filledCount = entries.filter((e) => e.email.trim()).length;

  return (
    <div className="px-8 pb-8">
      <div className="mb-7">
        <h2 className="font-display font-bold text-xl text-white tracking-tight mb-1.5">
          Invite your team
        </h2>
        <p className="text-slate-400 text-[14px] leading-relaxed">
          Great creative work is collaborative. Add teammates now or skip and do it later.
        </p>
      </div>

      {/* Success */}
      <AnimatePresence>
        {sent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[13px] mb-4"
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            Invitations sent! Moving to next step…
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite rows */}
      <div className="space-y-2.5 mb-4">
        <AnimatePresence initial={false}>
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start gap-2">
                {/* Email input */}
                <div className="flex-1 relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input
                    type="email"
                    value={entry.email}
                    onChange={(e) => updateEntry(entry.id, 'email', e.target.value)}
                    placeholder={`teammate${i + 1}@example.com`}
                    className={`w-full bg-slate-950/50 text-slate-200 border ${
                      entry.error ? 'border-red-500/50' : 'border-slate-800/80 focus:border-[#7C3AED]/60'
                    } rounded-xl py-2.5 pl-10 pr-4 text-sm placeholder-slate-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20`}
                  />
                  {entry.error && (
                    <p className="text-[10px] text-red-400 mt-1 ml-1">{entry.error}</p>
                  )}
                </div>

                {/* Role selector */}
                <div className="relative w-32 flex-shrink-0">
                  <select
                    value={entry.role}
                    onChange={(e) => updateEntry(entry.id, 'role', e.target.value)}
                    className="w-full bg-slate-950/60 text-slate-200 text-sm border border-slate-800/80 rounded-xl py-2.5 pl-3 pr-7 appearance-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]/60 cursor-pointer transition-all"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r} className="bg-slate-950">
                        {r}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] pointer-events-none">
                    ▼
                  </span>
                </div>

                {/* Remove */}
                {entries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(entry.id)}
                    className="flex-shrink-0 mt-1.5 w-8 h-8 rounded-lg border border-white/[0.07] text-slate-600 hover:text-red-400 hover:border-red-500/25 hover:bg-red-500/08 transition-all flex items-center justify-center"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add another */}
      {entries.length < 5 && (
        <button
          type="button"
          onClick={addEntry}
          className="flex items-center gap-2 text-[13px] text-slate-500 hover:text-[#9D6CFF] transition-colors mb-6"
        >
          <Plus className="w-3.5 h-3.5" />
          Add another person
        </button>
      )}

      {/* Summary */}
      {filledCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 p-3 rounded-xl bg-[#7C3AED]/08 border border-[#7C3AED]/15 mb-5"
        >
          <UserPlus className="w-4 h-4 text-[#9D6CFF] flex-shrink-0" />
          <p className="text-[12px] text-slate-400">
            <span className="text-white font-semibold">{filledCount}</span>{' '}
            invitation{filledCount > 1 ? 's' : ''} ready to send.
          </p>
        </motion.div>
      )}

      {/* Nav */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-white/[0.08] text-slate-400 text-[13px] hover:text-white hover:border-white/[0.15] hover:bg-white/[0.04] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <div className="flex flex-1 gap-2">
          <button
            type="button"
            onClick={onSkip}
            className="flex-1 py-2.5 rounded-xl border border-white/[0.07] text-slate-500 text-[13px] hover:text-slate-300 hover:border-white/[0.12] transition-all"
          >
            Skip for now
          </button>
          <motion.button
            type="button"
            whileHover={{ scale: filledCount > 0 ? 1.015 : 1 }}
            whileTap={{ scale: filledCount > 0 ? 0.985 : 1 }}
            onClick={handleSend}
            disabled={isLoading || sent || filledCount === 0}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white text-[13px] font-semibold shadow-[0_4px_16px_rgba(124,58,237,0.3)] hover:shadow-[0_4px_24px_rgba(139,92,246,0.45)] transition-shadow disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <>
                Send Invites
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};
