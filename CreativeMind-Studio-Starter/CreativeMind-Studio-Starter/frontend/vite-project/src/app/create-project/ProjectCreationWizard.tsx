/**
 * ProjectCreationWizard.tsx — Full-page multi-step project creation wizard.
 *
 * Layout:
 *   ┌─────────────────────────────────────────────────┐
 *   │  Page header (title + autosave status)           │
 *   │  StepProgressBar                                 │
 *   ├──────────────────────────────┬──────────────────-┤
 *   │  Step content (3/5 width)    │  Right sidebar    │
 *   │                              │  (2/5 width)      │
 *   │  WizardBottomActions         │                   │
 *   └──────────────────────────────┴──────────────────-┘
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderPlus, X } from 'lucide-react';
import { StepProgressBar } from './components/StepProgressBar';
import { Step1BasicInfo } from './components/Step1BasicInfo';
import { Step2CreativeIdea } from './components/Step2CreativeIdea';
import { Step3TeamResources } from './components/Step3TeamResources';
import { Step4StartOptions } from './components/Step4StartOptions';
import { WizardRightSidebar } from './components/WizardRightSidebar';
import { WizardBottomActions } from './components/WizardBottomActions';
import { useProjectWizard } from './useProjectWizard';
import { WIZARD_STEPS } from './mockData';
import { ease } from '../../lib/motion-constants';

// ─── Step transition variants ─────────────────────────────────────────────────

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -48 : 48,
    opacity: 0,
  }),
};

const stepTransition = {
  duration: 0.28,
  ease: ease.snappy,
};

// ─── Component ────────────────────────────────────────────────────────────────

interface ProjectCreationWizardProps {
  onClose?: () => void;
  onProjectCreated?: () => void;
}

export const ProjectCreationWizard: React.FC<ProjectCreationWizardProps> = ({
  onClose,
  onProjectCreated,
}) => {
  const [direction, setDirection] = React.useState(1);

  const wizard = useProjectWizard(() => {
    onProjectCreated?.();
  });

  // Wrap nav methods to track slide direction
  const handleNext = React.useCallback(() => {
    setDirection(1);
    wizard.goNext();
  }, [wizard]);

  const handleBack = React.useCallback(() => {
    setDirection(-1);
    wizard.goBack();
  }, [wizard]);

  const handleStepClick = React.useCallback(
    (step: typeof wizard.currentStep) => {
      setDirection(step > wizard.currentStep ? 1 : -1);
      wizard.goToStep(step);
    },
    [wizard]
  );

  // ── Render active step ──────────────────────────────────────────────────────

  const renderStep = () => {
    switch (wizard.currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            data={wizard.formData.step1}
            errors={wizard.errors}
            onChange={wizard.updateStep1}
          />
        );
      case 2:
        return (
          <Step2CreativeIdea
            data={wizard.formData.step2}
            errors={wizard.errors}
            onChange={wizard.updateStep2}
          />
        );
      case 3:
        return (
          <Step3TeamResources
            data={wizard.formData.step3}
            onAddTeamMember={wizard.addTeamMember}
            onRemoveTeamMember={wizard.removeTeamMember}
            onAddReferenceLink={wizard.addReferenceLink}
            onRemoveReferenceLink={wizard.removeReferenceLink}
            onAddFile={wizard.addUploadedFile}
            onRemoveFile={wizard.removeUploadedFile}
          />
        );
      case 4:
        return (
          <Step4StartOptions
            data={wizard.formData.step4}
            errors={wizard.errors}
            onChange={wizard.updateStep4}
          />
        );
    }
  };

  // ── Step labels ─────────────────────────────────────────────────────────────

  const activeStepMeta = WIZARD_STEPS.find(s => s.id === wizard.currentStep);

  return (
    <div className="min-h-full bg-[#07070A] flex flex-col">
      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 sticky top-0 z-20 bg-[#07070A]/95 backdrop-blur-sm
        border-b border-white/[0.07] px-6 lg:px-8 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          {/* Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-9 h-9 rounded-[10px]
              bg-gradient-to-br from-[#7C3AED]/30 to-[#9D6CFF]/10
              border border-[#8B5CF6]/25 flex items-center justify-center">
              <FolderPlus className="w-4.5 h-4.5 text-[#9D6CFF]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[15px] font-semibold text-slate-100 leading-tight">
                New Project
              </h1>
              {activeStepMeta && (
                <p className="text-[11px] text-slate-600 font-mono truncate">
                  Step {wizard.currentStep} — {activeStepMeta.label}
                </p>
              )}
            </div>
          </div>

          {/* Close */}
          {onClose && (
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="flex-shrink-0 w-8 h-8 rounded-[8px] bg-white/[0.04] border border-white/[0.08]
                flex items-center justify-center text-slate-500 hover:text-slate-200
                hover:bg-white/[0.08] transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
              aria-label="Close wizard"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* ── Progress bar ─────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-6 lg:px-8 py-5 border-b border-white/[0.05]">
        <div className="max-w-[1400px] mx-auto">
          <StepProgressBar
            steps={WIZARD_STEPS}
            currentStep={wizard.currentStep}
            onStepClick={handleStepClick}
          />
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="flex-1 px-6 lg:px-8 py-6 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-[1fr_320px]
          2xl:grid-cols-[1fr_360px] gap-6 xl:gap-8 items-start">

          {/* ── Main form area ── */}
          <div className="flex flex-col gap-6 min-w-0">
            {/* Animated step content */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={wizard.currentStep}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={stepTransition}
                >
                  {/* Step meta heading */}
                  {activeStepMeta && (
                    <motion.div
                      className="mb-5"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, delay: 0.05, ease: ease.gentle }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">
                          Step {wizard.currentStep} of {WIZARD_STEPS.length}
                        </span>
                      </div>
                      <h2 className="text-[20px] font-bold text-slate-100">
                        {activeStepMeta.label}
                      </h2>
                      <p className="text-[13px] text-slate-500 mt-0.5">
                        {activeStepMeta.description}
                      </p>
                    </motion.div>
                  )}

                  {/* Step form */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.08 }}
                  >
                    {renderStep()}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom actions */}
            <WizardBottomActions
              currentStep={wizard.currentStep}
              totalSteps={WIZARD_STEPS.length}
              isSubmitting={wizard.isSubmitting}
              isDirty={wizard.isDirty}
              autosaveStatus={wizard.autosaveStatus}
              onBack={handleBack}
              onNext={handleNext}
              onSaveDraft={wizard.saveDraft}
              onCreateProject={wizard.submitProject}
            />
          </div>

          {/* ── Right Sidebar ── */}
          <aside className="hidden xl:block sticky top-[5.5rem]">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15, ease: ease.snappy }}
            >
              <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest mb-3">
                Live Preview
              </p>
              <WizardRightSidebar formData={wizard.formData} />
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
};
