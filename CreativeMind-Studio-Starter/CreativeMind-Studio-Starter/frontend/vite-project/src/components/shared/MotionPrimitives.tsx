/**
 * Motion primitives — reusable Framer Motion animation components.
 *
 * All durations are between 150ms and 350ms.
 * Respect prefers-reduced-motion via CSS (set in index.css) and
 * via the `useReducedMotion` hook where needed.
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ease } from '../../lib/motion-constants';

// ─── FadeIn ───────────────────────────────────────────────────────────────────

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.25,
  className,
}) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease: ease.gentle }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── SlideUp ──────────────────────────────────────────────────────────────────

interface SlideUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

export const SlideUp: React.FC<SlideUpProps> = ({
  children,
  delay = 0,
  duration = 0.3,
  distance = 16,
  className,
}) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease: ease.snappy }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── ScaleFade ────────────────────────────────────────────────────────────────

interface ScaleFadeProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const ScaleFade: React.FC<ScaleFadeProps> = ({ children, delay = 0, className }) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, scale: reduced ? 1 : 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : delay, ease: ease.snappy }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── PageTransition (wraps page content) ──────────────────────────────────────

interface PageTransitionProps {
  children: React.ReactNode;
  /** Pass a unique key (usually the route id) so Framer Motion detects changes */
  pageKey?: string;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  pageKey,
  className,
}) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      key={pageKey}
      initial={{ opacity: 0, y: reduced ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduced ? 0 : -6 }}
      transition={{ duration: reduced ? 0 : 0.22, ease: ease.gentle }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── HoverElevation (card hover lift) ────────────────────────────────────────

interface HoverElevationProps {
  children: React.ReactNode;
  lift?: number;
  className?: string;
}

export const HoverElevation: React.FC<HoverElevationProps> = ({
  children,
  lift = 4,
  className,
}) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      whileHover={{ y: reduced ? 0 : -lift, transition: { duration: 0.2 } }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── CardEntrance (staggered list entrance) ───────────────────────────────────

interface CardEntranceProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
}

export const CardEntrance: React.FC<CardEntranceProps> = ({
  children,
  index = 0,
  className,
}) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduced ? 0 : 0.3,
        delay: reduced ? 0 : index * 0.05,
        ease: ease.snappy,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── ProgressAnimation ────────────────────────────────────────────────────────

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
}

export const AnimatedProgressBar: React.FC<ProgressBarProps> = ({ value, className }) => (
  <div className={`h-1.5 w-full rounded-full bg-white/[0.07] overflow-hidden ${className ?? ''}`}>
    <motion.div
      className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9D6CFF]"
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      transition={{ duration: 0.35, ease: ease.snappy }}
    />
  </div>
);

// ─── SidebarCollapseTransition wrapper ────────────────────────────────────────

interface SidebarCollapseProps {
  children: React.ReactNode;
  collapsed: boolean;
}

export const SidebarCollapseWrapper: React.FC<SidebarCollapseProps> = ({
  children,
  collapsed,
}) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      animate={{ width: collapsed ? 64 : 240 }}
      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 32 }}
    >
      {children}
    </motion.div>
  );
};
