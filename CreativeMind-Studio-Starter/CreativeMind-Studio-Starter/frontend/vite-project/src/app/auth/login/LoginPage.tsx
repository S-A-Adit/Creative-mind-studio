/**
 * LoginPage — email + password authentication page.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { FormField } from '../components/FormField';
import { SubmitButton } from '../components/SubmitButton';
import { SocialButton } from '../components/SocialButton';
import { AuthDivider } from '../components/AuthDivider';

interface LoginFormState {
  email: string;
  password: string;
  remember: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  form?: string;
}

const _ease = [0.22, 1, 0.36, 1] as const;
void _ease;

function validate(values: LoginFormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.email) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = 'Enter a valid email address.';
  if (!values.password) errors.password = 'Password is required.';
  else if (values.password.length < 8)
    errors.password = 'Password must be at least 8 characters.';
  return errors;
}

interface LoginPageProps {
  onNavigate?: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [form, setForm] = useState<LoginFormState>({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successState, setSuccessState] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (touched[name]) {
      const updated = { ...form, [name]: type === 'checkbox' ? checked : value };
      setErrors(validate(updated));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = { email: true, password: true };
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    setFormError('');

    // Simulate async auth
    await new Promise((r) => setTimeout(r, 1400));

    // Demo: wrong password simulation
    if (form.password === 'wrongpass') {
      setFormError('Invalid email or password. Please try again.');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setSuccessState(true);

    // Navigate to app after brief success moment
    setTimeout(() => onNavigate?.('dashboard'), 1200);
  };

  return (
    <AuthLayout>
      <div className="p-8 md:p-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-white tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-slate-400 text-[14px] leading-relaxed">
            Sign in to your CreativeMind workspace.
          </p>
        </div>

        {/* Social buttons */}
        <div className="flex flex-col gap-2.5 mb-5">
          <SocialButton provider="google" />
          <SocialButton provider="github" />
        </div>

        <AuthDivider />

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-4">
          {/* Global error */}
          <AnimatePresence>
            {formError && (
              <motion.div
                key="form-error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                role="alert"
                className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-[13px]"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {formError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success banner */}
          <AnimatePresence>
            {successState && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[13px]"
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Signed in successfully — redirecting…
              </motion.div>
            )}
          </AnimatePresence>

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

          <FormField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password ? errors.password : undefined}
            placeholder="••••••••"
            autoComplete="current-password"
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          {/* Remember + Forgot row */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-[#7C3AED] focus:ring-[#7C3AED]/30 cursor-pointer"
              />
              <span className="text-[13px] text-slate-400 group-hover:text-slate-300 transition-colors select-none">
                Remember me
              </span>
            </label>
            <button
              type="button"
              onClick={() => onNavigate?.('forgot-password')}
              className="text-[13px] text-[#9D6CFF] hover:text-white transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <SubmitButton
            label="Sign In"
            isLoading={isLoading}
            disabled={successState}
          />
        </form>

        {/* Footer link */}
        <p className="mt-6 text-center text-[13px] text-slate-500">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate?.('register')}
            className="text-[#9D6CFF] hover:text-white font-medium transition-colors"
          >
            Create one free
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};
