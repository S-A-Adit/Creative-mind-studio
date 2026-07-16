/**
 * useProjectWizard.ts — Central state management hook for the Project Creation Wizard.
 *
 * Manages:
 * - Step navigation
 * - Form data for all 4 steps
 * - Validation
 * - Autosave simulation
 * - File upload management
 */

import { useState, useCallback, useRef } from 'react';
import type {
  WizardStepId,
  ProjectWizardData,
  ValidationErrors,
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
  UploadedFile,
  TeamMember,
  ReferenceLink,
} from './types';

// ─── Default form state ───────────────────────────────────────────────────────

const DEFAULT_STEP1: Step1Data = {
  projectTitle: '',
  description: '',
  contentCategory: '',
  targetPlatform: '',
  targetAudience: '',
  primaryGoal: '',
};

const DEFAULT_STEP2: Step2Data = {
  rawIdea: '',
  desiredDuration: '',
  tone: '',
  language: '',
  deadline: '',
};

const DEFAULT_STEP3: Step3Data = {
  teamMembers: [],
  referenceLinks: [],
  uploadedFiles: [],
};

const DEFAULT_STEP4: Step4Data = {
  selectedStartOption: null,
};

const DEFAULT_WIZARD_DATA: ProjectWizardData = {
  step1: DEFAULT_STEP1,
  step2: DEFAULT_STEP2,
  step3: DEFAULT_STEP3,
  step4: DEFAULT_STEP4,
};

// ─── Validation helpers ───────────────────────────────────────────────────────

function validateStep1(data: Step1Data): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!data.projectTitle.trim()) errors.projectTitle = 'Project title is required';
  else if (data.projectTitle.trim().length < 3) errors.projectTitle = 'Title must be at least 3 characters';
  if (!data.contentCategory) errors.contentCategory = 'Please select a content category';
  if (!data.targetPlatform) errors.targetPlatform = 'Please select a target platform';
  return errors;
}

function validateStep2(data: Step2Data): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!data.rawIdea.trim()) errors.rawIdea = 'Please describe your idea';
  else if (data.rawIdea.trim().length < 10) errors.rawIdea = 'Please provide more detail (10+ characters)';
  if (!data.tone) errors.tone = 'Please select a tone';
  if (!data.language) errors.language = 'Please select a language';
  return errors;
}

function validateStep3(_data: Step3Data): ValidationErrors {
  // Step 3 is optional — no required fields
  return {};
}

function validateStep4(data: Step4Data): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!data.selectedStartOption) errors.selectedStartOption = 'Please choose how to start your project';
  return errors;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseProjectWizardReturn {
  // State
  currentStep: WizardStepId;
  formData: ProjectWizardData;
  errors: ValidationErrors;
  isSubmitting: boolean;
  isDirty: boolean;
  autosaveStatus: 'idle' | 'saving' | 'saved';

  // Navigation
  goToStep: (step: WizardStepId) => void;
  goNext: () => void;
  goBack: () => void;

  // Step 1 updates
  updateStep1: (patch: Partial<Step1Data>) => void;

  // Step 2 updates
  updateStep2: (patch: Partial<Step2Data>) => void;

  // Step 3 updates
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  removeTeamMember: (id: string) => void;
  addReferenceLink: (link: Omit<ReferenceLink, 'id'>) => void;
  removeReferenceLink: (id: string) => void;
  addUploadedFile: (file: Omit<UploadedFile, 'id' | 'uploadedAt'>) => void;
  removeUploadedFile: (id: string) => void;

  // Step 4 updates
  updateStep4: (patch: Partial<Step4Data>) => void;

  // Actions
  saveDraft: () => void;
  submitProject: () => void;
}

export function useProjectWizard(onProjectCreated: () => void): UseProjectWizardReturn {
  const [currentStep, setCurrentStep] = useState<WizardStepId>(1);
  const [formData, setFormData] = useState<ProjectWizardData>(DEFAULT_WIZARD_DATA);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Autosave trigger ──────────────────────────────────────────────────────

  const triggerAutosave = useCallback(() => {
    setAutosaveStatus('saving');
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      // In production: persist to backend / localStorage
      setAutosaveStatus('saved');
      setTimeout(() => setAutosaveStatus('idle'), 2000);
    }, 1200);
  }, []);

  // ── Generic field update ──────────────────────────────────────────────────

  const patchData = useCallback(<K extends keyof ProjectWizardData>(
    key: K,
    patch: Partial<ProjectWizardData[K]>
  ) => {
    setFormData(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }));
    setIsDirty(true);
    // Clear related errors
    setErrors(prev => {
      const next = { ...prev };
      Object.keys(patch).forEach(k => delete next[k]);
      return next;
    });
    triggerAutosave();
  }, [triggerAutosave]);

  // ── Step 1 ────────────────────────────────────────────────────────────────

  const updateStep1 = useCallback((patch: Partial<Step1Data>) => {
    patchData('step1', patch);
  }, [patchData]);

  // ── Step 2 ────────────────────────────────────────────────────────────────

  const updateStep2 = useCallback((patch: Partial<Step2Data>) => {
    patchData('step2', patch);
  }, [patchData]);

  // ── Step 3 ────────────────────────────────────────────────────────────────

  const addTeamMember = useCallback((member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = { ...member, id: `tm-${Date.now()}` };
    setFormData(prev => ({
      ...prev,
      step3: { ...prev.step3, teamMembers: [...prev.step3.teamMembers, newMember] },
    }));
    setIsDirty(true);
    triggerAutosave();
  }, [triggerAutosave]);

  const removeTeamMember = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      step3: { ...prev.step3, teamMembers: prev.step3.teamMembers.filter(m => m.id !== id) },
    }));
    setIsDirty(true);
    triggerAutosave();
  }, [triggerAutosave]);

  const addReferenceLink = useCallback((link: Omit<ReferenceLink, 'id'>) => {
    const newLink: ReferenceLink = { ...link, id: `rl-${Date.now()}` };
    setFormData(prev => ({
      ...prev,
      step3: { ...prev.step3, referenceLinks: [...prev.step3.referenceLinks, newLink] },
    }));
    setIsDirty(true);
    triggerAutosave();
  }, [triggerAutosave]);

  const removeReferenceLink = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      step3: { ...prev.step3, referenceLinks: prev.step3.referenceLinks.filter(l => l.id !== id) },
    }));
    setIsDirty(true);
    triggerAutosave();
  }, [triggerAutosave]);

  const addUploadedFile = useCallback((file: Omit<UploadedFile, 'id' | 'uploadedAt'>) => {
    const newFile: UploadedFile = { ...file, id: `uf-${Date.now()}`, uploadedAt: new Date() };
    setFormData(prev => ({
      ...prev,
      step3: { ...prev.step3, uploadedFiles: [...prev.step3.uploadedFiles, newFile] },
    }));
    setIsDirty(true);
    triggerAutosave();
  }, [triggerAutosave]);

  const removeUploadedFile = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      step3: { ...prev.step3, uploadedFiles: prev.step3.uploadedFiles.filter(f => f.id !== id) },
    }));
    setIsDirty(true);
    triggerAutosave();
  }, [triggerAutosave]);

  // ── Step 4 ────────────────────────────────────────────────────────────────

  const updateStep4 = useCallback((patch: Partial<Step4Data>) => {
    patchData('step4', patch);
  }, [patchData]);

  // ── Navigation ────────────────────────────────────────────────────────────

  const validateCurrentStep = useCallback((): boolean => {
    let errs: ValidationErrors = {};
    switch (currentStep) {
      case 1: errs = validateStep1(formData.step1); break;
      case 2: errs = validateStep2(formData.step2); break;
      case 3: errs = validateStep3(formData.step3); break;
      case 4: errs = validateStep4(formData.step4); break;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [currentStep, formData]);

  const goToStep = useCallback((step: WizardStepId) => {
    setErrors({});
    setCurrentStep(step);
  }, []);

  const goNext = useCallback(() => {
    if (!validateCurrentStep()) return;
    if (currentStep < 4) {
      setCurrentStep(prev => (prev + 1) as WizardStepId);
      setErrors({});
    }
  }, [currentStep, validateCurrentStep]);

  const goBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => (prev - 1) as WizardStepId);
      setErrors({});
    }
  }, [currentStep]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const saveDraft = useCallback(() => {
    triggerAutosave();
  }, [triggerAutosave]);

  const submitProject = useCallback(async () => {
    if (!validateCurrentStep()) return;
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1800));
    setIsSubmitting(false);
    onProjectCreated();
  }, [validateCurrentStep, onProjectCreated]);

  return {
    currentStep,
    formData,
    errors,
    isSubmitting,
    isDirty,
    autosaveStatus,
    goToStep,
    goNext,
    goBack,
    updateStep1,
    updateStep2,
    addTeamMember,
    removeTeamMember,
    addReferenceLink,
    removeReferenceLink,
    addUploadedFile,
    removeUploadedFile,
    updateStep4,
    saveDraft,
    submitProject,
  };
}
