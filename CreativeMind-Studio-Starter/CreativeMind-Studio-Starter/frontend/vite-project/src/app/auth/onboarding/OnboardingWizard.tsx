/**
 * OnboardingWizard — orchestrates all 5 onboarding steps.
 *
 * Manages shared state and transitions between steps.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingLayout } from './OnboardingLayout';
import { Step1RoleSelection } from './Step1RoleSelection';
import { Step2ContentTypes } from './Step2ContentTypes';
import { Step3Workspace } from './Step3Workspace';
import { Step4InviteTeam } from './Step4InviteTeam';
import { Step5FirstProject } from './Step5FirstProject';

interface OnboardingData {
  role?: string;
  contentTypes?: string[];
  workspace?: { mode: 'create' | 'join'; name?: string; code?: string };
  invites?: { email: string; role: string }[];
  project?: { name: string; template: string };
}

interface OnboardingWizardProps {
  onComplete?: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1=forward, -1=back
  const [data, setData] = useState<OnboardingData>({});

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 5));
  };
  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleStep1 = (role: string) => {
    setData((d) => ({ ...d, role }));
    goNext();
  };

  const handleStep2 = (contentTypes: string[]) => {
    setData((d) => ({ ...d, contentTypes }));
    goNext();
  };

  const handleStep3 = (workspace: OnboardingData['workspace']) => {
    setData((d) => ({ ...d, workspace }));
    goNext();
  };

  const handleStep4 = (invites: { email: string; role: string }[]) => {
    setData((d) => ({ ...d, invites }));
    goNext();
  };

  const handleStep5 = (project: { name: string; template: string }) => {
    setData((d) => ({ ...d, project }));
    setTimeout(() => onComplete?.(), 1800);
  };

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 24, scale: 0.98 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -24, scale: 0.98 }),
  };

  return (
    <OnboardingLayout currentStep={step}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease }}
        >
          {step === 1 && <Step1RoleSelection onNext={handleStep1} />}
          {step === 2 && (
            <Step2ContentTypes onNext={handleStep2} onBack={goBack} />
          )}
          {step === 3 && (
            <Step3Workspace onNext={handleStep3} onBack={goBack} />
          )}
          {step === 4 && (
            <Step4InviteTeam
              onNext={handleStep4}
              onBack={goBack}
              onSkip={goNext}
            />
          )}
          {step === 5 && (
            <Step5FirstProject onFinish={handleStep5} onBack={goBack} />
          )}
        </motion.div>
      </AnimatePresence>
    </OnboardingLayout>
  );
};
