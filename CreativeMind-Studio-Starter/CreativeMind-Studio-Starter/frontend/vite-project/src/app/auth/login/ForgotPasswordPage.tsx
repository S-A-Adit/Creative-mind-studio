/**
 * ForgotPasswordPage — request a password reset link.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { FormField } from '../components/FormField';
import { SubmitButton } from '../components/SubmitButton';

interface ForgotPasswordPageProps {
  onNavigate?: (page: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validateEmail = (val: string) => {
    if (!val) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Enter a valid email.';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (touched) setEmailError(validateEmail(e.target.value));
  };

  const handleBlur = () => {
    setTouched(true);
    setEmailError(validateEmail(email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setIsLoading(false);
    setSent(true);
  };

  return (
    <AuthLayout>
      <div className="p-8 md:p-10">
        {/* Back link */}
        <button
          type="button"
          onClick={() => onNavigate?.('login')}
          className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to sign in
        </button>

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {/* Header */}
              <div className="mb-7">
                <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/15 border border-[#7C3AED]/25 flex items-center justify-center mb-5">
                  <Mail className="w-5 h-5 text-[#9D6CFF]" />
                </div>
                <h1 className="font-display font-bold text-2xl text-white tracking-tight mb-2">
                  Forgot your password?
                </h1>
                <p className="text-slate-400 text-[14px] leading-relaxed">
                  Enter your registered email and we'll send you a secure reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <FormField
                  label="Email address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched ? emailError : undefined}
                  success={touched && !emailError && !!email}
                  placeholder="you@example.com"
                  autoComplete="email"
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                />
                <SubmitButton
                  label="Send Reset Link"
                  isLoading={isLoading}
                  icon={<Send className="w-4 h-4" />}
                />
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-4"
            >
              {/* Success illustration */}
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-pulse" />
                <div className="absolute inset-3 rounded-full bg-emerald-500/15 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
              </div>

              <h2 className="font-display font-bold text-xl text-white mb-3">
                Reset link sent!
              </h2>
              <p className="text-slate-400 text-[14px] leading-relaxed mb-2">
                We've sent a password reset link to
              </p>
              <p className="text-[#9D6CFF] font-medium text-[14px] mb-6">{email}</p>
              <p className="text-slate-500 text-[13px] leading-relaxed mb-8">
                Check your inbox and click the link within 15 minutes. Don't forget to check your spam folder.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => { setSent(false); setEmail(''); setTouched(false); }}
                  className="w-full py-2.5 rounded-xl border border-white/[0.08] text-slate-400 text-[13px] hover:text-white hover:border-white/[0.15] hover:bg-white/[0.04] transition-all duration-200"
                >
                  Try a different email
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate?.('login')}
                  className="text-[13px] text-[#9D6CFF] hover:text-white transition-colors"
                >
                  Return to sign in
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
};
