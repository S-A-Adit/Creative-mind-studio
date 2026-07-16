/**
 * RegisterPage — new user sign-up.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { FormField } from '../components/FormField';
import { SubmitButton } from '../components/SubmitButton';
import { SocialButton } from '../components/SocialButton';
import { AuthDivider } from '../components/AuthDivider';

interface RegisterForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeTerms?: string;
}

function validate(v: RegisterForm): FormErrors {
  const e: FormErrors = {};
  if (!v.fullName.trim()) e.fullName = 'Full name is required.';
  else if (v.fullName.trim().length < 2) e.fullName = 'Name must be at least 2 characters.';

  if (!v.email) e.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Enter a valid email.';

  if (!v.password) e.password = 'Password is required.';
  else if (v.password.length < 8) e.password = 'Password must be at least 8 characters.';

  if (!v.confirmPassword) e.confirmPassword = 'Please confirm your password.';
  else if (v.password !== v.confirmPassword) e.confirmPassword = 'Passwords do not match.';

  if (!v.agreeTerms) e.agreeTerms = 'You must agree to the Terms of Service.';
  return e;
}

const strengthLabel = (pwd: string) => {
  if (!pwd) return null;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { label: 'Weak', color: '#EF4444', width: '20%' };
  if (score <= 2) return { label: 'Fair', color: '#F59E0B', width: '45%' };
  if (score <= 3) return { label: 'Good', color: '#3B82F6', width: '70%' };
  return { label: 'Strong', color: '#10B981', width: '100%' };
};

interface RegisterPageProps {
  onNavigate?: (page: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const [form, setForm] = useState<RegisterForm>({
    fullName: '', email: '', password: '', confirmPassword: '', agreeTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const updated = { ...form, [name]: type === 'checkbox' ? checked : value };
    setForm(updated);
    if (touched[name]) setErrors(validate(updated));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((p) => ({ ...p, [e.target.name]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(
      Object.keys(form).map((k) => [k, true])
    );
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setIsLoading(false);
    setSuccess(true);
    setTimeout(() => onNavigate?.('verify-email'), 1200);
  };

  const strength = strengthLabel(form.password);

  return (
    <AuthLayout>
      <div className="p-8 md:p-10">
        {/* Header */}
        <div className="mb-7">
          <h1 className="font-display font-bold text-2xl text-white tracking-tight mb-2">
            Create your account
          </h1>
          <p className="text-slate-400 text-[14px] leading-relaxed">
            Start your free trial — no credit card required.
          </p>
        </div>

        {/* Social */}
        <div className="flex flex-col gap-2.5 mb-5">
          <SocialButton provider="google" />
          <SocialButton provider="github" />
        </div>

        <AuthDivider />

        <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-4">
          {/* Success */}
          <AnimatePresence>
            {success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[13px]"
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Account created — check your email to verify.
              </motion.div>
            )}
          </AnimatePresence>

          <FormField
            label="Full Name"
            name="fullName"
            type="text"
            value={form.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.fullName ? errors.fullName : undefined}
            success={touched.fullName && !errors.fullName && !!form.fullName}
            placeholder="Alex Chen"
            autoComplete="name"
            leftIcon={<User className="w-4 h-4" />}
            required
          />

          <FormField
            label="Email address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : undefined}
            success={touched.email && !errors.email && !!form.email}
            placeholder="you@example.com"
            autoComplete="email"
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <div className="flex flex-col gap-1.5">
            <FormField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password ? errors.password : undefined}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />
            {/* Password strength bar */}
            {form.password && strength && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2"
              >
                <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    animate={{ width: strength.width }}
                    transition={{ duration: 0.3 }}
                    style={{ backgroundColor: strength.color }}
                  />
                </div>
                <span className="text-[10px] font-mono" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </motion.div>
            )}
          </div>

          <FormField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
            success={
              touched.confirmPassword &&
              !errors.confirmPassword &&
              !!form.confirmPassword &&
              form.password === form.confirmPassword
            }
            placeholder="Re-enter your password"
            autoComplete="new-password"
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          {/* Terms */}
          <div className="flex flex-col gap-1">
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={form.agreeTerms}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-[#7C3AED] focus:ring-[#7C3AED]/30 cursor-pointer flex-shrink-0"
              />
              <span className="text-[12px] text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed select-none">
                I agree to the{' '}
                <button type="button" className="text-[#9D6CFF] hover:underline">Terms of Service</button>
                {' '}and{' '}
                <button type="button" className="text-[#9D6CFF] hover:underline">Privacy Policy</button>
              </span>
            </label>
            <AnimatePresence>
              {touched.agreeTerms && errors.agreeTerms && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-[11px] text-red-400 ml-6.5"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.agreeTerms}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <SubmitButton label="Create Account" isLoading={isLoading} disabled={success} />
        </form>

        <p className="mt-6 text-center text-[13px] text-slate-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate?.('login')}
            className="text-[#9D6CFF] hover:text-white font-medium transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};
