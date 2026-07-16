/**
 * EmailVerificationPage — prompts user to verify their email address.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, RefreshCw, CheckCircle2, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';

interface EmailVerificationPageProps {
  email?: string;
  onNavigate?: (page: string) => void;
}

export const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({
  email = 'alex@example.com',
  onNavigate,
}) => {
  const [resending, setResending] = useState(false);
  const [resentSuccess, setResentSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setResentSuccess(false);
    await new Promise((r) => setTimeout(r, 1400));
    setResending(false);
    setResentSuccess(true);
    setCountdown(60);
    setTimeout(() => setResentSuccess(false), 4000);
  };

  return (
    <AuthLayout>
      <div className="p-8 md:p-10 text-center">
        {/* Illustration */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          {/* Pulsing rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-[#7C3AED]/20"
              animate={{ scale: [1, 1.25 + i * 0.15], opacity: [0.5, 0] }}
              transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[#7C3AED]/15 border border-[#7C3AED]/30 flex items-center justify-center">
              <Mail className="w-7 h-7 text-[#9D6CFF]" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-display font-bold text-2xl text-white tracking-tight mb-3">
          Verify your email
        </h1>
        <p className="text-slate-400 text-[14px] leading-relaxed mb-2">
          We sent a verification link to
        </p>
        <p className="text-[#9D6CFF] font-semibold text-[15px] mb-6">{email}</p>
        <p className="text-slate-500 text-[13px] leading-relaxed max-w-xs mx-auto mb-8">
          Click the link in your email to activate your account. The link expires in 24 hours.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          {/* Resend button */}
          <motion.button
            type="button"
            whileHover={{ scale: countdown > 0 ? 1 : 1.015 }}
            whileTap={{ scale: countdown > 0 ? 1 : 0.985 }}
            onClick={handleResend}
            disabled={countdown > 0 || resending}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white text-[14px] font-semibold shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_4px_28px_rgba(139,92,246,0.45)] transition-shadow disabled:opacity-60 disabled:pointer-events-none"
          >
            {resending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {resending
              ? 'Resending…'
              : countdown > 0
              ? `Resend in ${countdown}s`
              : "Resend verification email"}
          </motion.button>

          {/* Success feedback */}
          <AnimatePresence>
            {resentSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 text-emerald-400 text-[13px]"
              >
                <CheckCircle2 className="w-4 h-4" />
                Verification email sent!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Change email */}
          <button
            type="button"
            onClick={() => onNavigate?.('register')}
            className="text-[13px] text-slate-500 hover:text-slate-300 transition-colors"
          >
            Use a different email address
          </button>

          {/* Back to login */}
          <button
            type="button"
            onClick={() => onNavigate?.('login')}
            className="inline-flex items-center justify-center gap-1.5 text-[13px] text-slate-600 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </button>
        </div>

        {/* Helper note */}
        <p className="mt-8 text-[11px] text-slate-700 font-mono max-w-xs mx-auto leading-relaxed">
          Can't find the email? Check your spam or junk folder. If you still need help, contact{' '}
          <button type="button" className="text-[#7C3AED]/70 hover:text-[#9D6CFF] transition-colors">
            support@creativemind.studio
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};
