/**
 * SubmitButton — primary CTA for auth forms.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight } from 'lucide-react';

interface SubmitButtonProps {
  label: string;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  label,
  isLoading = false,
  disabled = false,
  icon,
}) => (
  <motion.button
    type="submit"
    whileHover={{ scale: disabled || isLoading ? 1 : 1.015 }}
    whileTap={{ scale: disabled || isLoading ? 1 : 0.985 }}
    disabled={disabled || isLoading}
    className="relative w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl
      bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white text-[14px] font-semibold
      shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:shadow-[0_4px_28px_rgba(139,92,246,0.5)]
      transition-shadow duration-200 disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
  >
    {/* Shimmer overlay */}
    <span className="absolute inset-0 bg-white/[0.08] opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    {isLoading ? (
      <Loader2 className="w-4 h-4 animate-spin" />
    ) : (
      icon ?? <ArrowRight className="w-4 h-4" />
    )}
    <span className="relative z-10">{isLoading ? 'Please wait…' : label}</span>
  </motion.button>
);
