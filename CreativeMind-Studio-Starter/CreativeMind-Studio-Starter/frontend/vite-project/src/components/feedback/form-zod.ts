/**
 * form-zod.ts — Zod schemas + useZodForm hook
 *
 * Provides:
 *   - Ready-made Zod schemas for every major CreativeMind Studio form
 *   - useZodForm hook  — thin wrapper around useForm + zodResolver with
 *     server error support, autosave-ready architecture, and unsaved
 *     change tracking
 */

import { z } from 'zod';
import { useForm, type UseFormProps, type FieldValues, type DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback } from 'react';

// ─── Reusable field schemas ───────────────────────────────────────────────────

const requiredString = (label: string) =>
  z.string().min(1, `${label} is required`);

const optionalUrl = z
  .string()
  .url('Must be a valid URL')
  .optional()
  .or(z.literal(''));

// ─── Project form ──────────────────────────────────────────────────────────────

export const projectFormSchema = z.object({
  name:        requiredString('Project name').max(80, 'Max 80 characters'),
  description: z.string().max(500, 'Max 500 characters').optional(),
  type:        z.enum(['video', 'shorts', 'documentary', 'campaign', 'series']),
  platform:    z.array(z.string()).min(1, 'Select at least one platform'),
  deadline:    z.date({ required_error: 'Deadline is required' }),
  assignees:   z.array(z.string()).optional(),
  budget:      z.string().optional(),
  tags:        z.array(z.string()).max(10, 'Max 10 tags').optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

// ─── Research question form ────────────────────────────────────────────────────

export const researchFormSchema = z.object({
  question:    requiredString('Question').max(280, 'Max 280 characters'),
  context:     z.string().max(1000, 'Max 1000 characters').optional(),
  priority:    z.enum(['low', 'normal', 'high', 'critical']).default('normal'),
  sourceUrls:  z.array(z.string().url('Must be a valid URL')).optional(),
  assignedTo:  z.string().optional(),
  dueDate:     z.date().optional(),
});

export type ResearchFormValues = z.infer<typeof researchFormSchema>;

// ─── Script form ───────────────────────────────────────────────────────────────

export const scriptFormSchema = z.object({
  title:       requiredString('Title').max(120, 'Max 120 characters'),
  hook:        z.string().min(10, 'Hook must be at least 10 characters').max(500),
  body:        z.string().min(50, 'Body must be at least 50 characters'),
  callToAction:z.string().max(160, 'Max 160 characters').optional(),
  duration:    z.number().min(15, 'Min 15 seconds').max(7200, 'Max 2 hours').optional(),
  tone:        z.enum(['conversational', 'authoritative', 'inspirational', 'educational', 'humorous']),
  notes:       z.string().max(500).optional(),
});

export type ScriptFormValues = z.infer<typeof scriptFormSchema>;

// ─── Invite member form ────────────────────────────────────────────────────────

export const inviteMemberSchema = z.object({
  email:   z.string().email('Must be a valid email address'),
  role:    z.enum([
    'workspace-owner', 'project-lead', 'creative-strategist',
    'researcher', 'scriptwriter', 'video-editor',
    'marketing-member', 'reviewer', 'viewer',
  ]),
  message: z.string().max(300, 'Max 300 characters').optional(),
  projectIds: z.array(z.string()).optional(),
});

export type InviteMemberValues = z.infer<typeof inviteMemberSchema>;

// ─── Asset upload form ─────────────────────────────────────────────────────────

export const assetUploadSchema = z.object({
  name:        requiredString('Asset name').max(120),
  description: z.string().max(300).optional(),
  tags:        z.array(z.string()).max(20).optional(),
  projectId:   z.string().optional(),
  sourceUrl:   optionalUrl,
  license:     z.enum(['owned', 'licensed', 'creative-commons', 'public-domain']).default('owned'),
});

export type AssetUploadValues = z.infer<typeof assetUploadSchema>;

// ─── Notification preferences form ────────────────────────────────────────────

export const notificationPrefsSchema = z.object({
  assignments:       z.boolean(),
  mentions:          z.boolean(),
  aiAgents:          z.boolean(),
  approvals:         z.boolean(),
  deadlines:         z.boolean(),
  researchUpdates:   z.boolean(),
  publicationUpdates:z.boolean(),
  emailDigest:       z.boolean(),
  pushNotifications: z.boolean(),
  sound:             z.boolean(),
});

export type NotificationPrefsValues = z.infer<typeof notificationPrefsSchema>;

// ─── useZodForm ────────────────────────────────────────────────────────────────

interface UseZodFormOptions<TValues extends FieldValues, TSchema extends z.ZodType<TValues>> {
  schema:            TSchema;
  defaultValues?:    DefaultValues<TValues>;
  /** Autosave callback — called on valid dirty changes after `autosaveDelay` ms */
  onAutosave?:       (values: TValues) => Promise<void>;
  autosaveDelay?:    number;
  /** React Hook Form options to pass through */
  formOptions?:      Omit<UseFormProps<TValues>, 'resolver' | 'defaultValues'>;
}

interface UseZodFormReturn<TValues extends FieldValues> {
  form:           ReturnType<typeof useForm<TValues>>;
  serverError:    string | null;
  setServerError: (err: string | null) => void;
  serverSuccess:  string | null;
  setServerSuccess:(msg: string | null) => void;
  isSubmitting:   boolean;
  /** Wrap your submit handler — clears server error, sets submitting state */
  handleSubmit:   (onValid: (values: TValues) => Promise<void>) => (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function useZodForm<
  TValues extends FieldValues,
  TSchema extends z.ZodType<TValues>,
>({
  schema,
  defaultValues,
  onAutosave,
  autosaveDelay = 2000,
  formOptions = {},
}: UseZodFormOptions<TValues, TSchema>): UseZodFormReturn<TValues> {

  const form = useForm<TValues>({
    resolver:  zodResolver(schema),
    defaultValues,
    mode:      'onBlur',
    ...formOptions,
  });

  const [serverError,   setServerError]   = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const [isSubmitting,  setIsSubmitting]  = useState(false);

  // Autosave: subscribe to value changes
  // (call onAutosave when form is dirty and valid)
  const autosaveTimer = { current: 0 as ReturnType<typeof setTimeout> };

  if (onAutosave) {
    form.watch(() => {
      if (!form.formState.isDirty) return;
      clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(async () => {
        const valid = await form.trigger();
        if (valid) {
          const values = form.getValues();
          await onAutosave(values).catch(() => {/* silent autosave failure */});
        }
      }, autosaveDelay);
    });
  }

  const handleSubmit = useCallback(
    (onValid: (values: TValues) => Promise<void>) =>
      form.handleSubmit(async (values) => {
        setServerError(null);
        setServerSuccess(null);
        setIsSubmitting(true);
        try {
          await onValid(values);
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
          setServerError(msg);
        } finally {
          setIsSubmitting(false);
        }
      }),
    [form],
  );

  return {
    form,
    serverError,
    setServerError,
    serverSuccess,
    setServerSuccess,
    isSubmitting,
    handleSubmit,
  };
}
