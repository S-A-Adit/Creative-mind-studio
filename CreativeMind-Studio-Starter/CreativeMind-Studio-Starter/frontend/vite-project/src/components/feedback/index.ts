/**
 * index.ts — Feedback & Form System barrel export
 *
 * Import anything from:
 *   import { ... } from '@/components/feedback'
 * or
 *   import { ... } from '../components/feedback'
 */

// ─── Toast system ─────────────────────────────────────────────────────────────
export type { ToastVariant, ToastOptions, ToastEntry } from './toast';
export { ToastProvider, useToast } from './toast';
export { ToastContainer } from './ToastContainer';

// ─── Skeleton loaders ─────────────────────────────────────────────────────────
export { Shimmer } from './Skeletons';
export {
  CardSkeleton,
  TableSkeleton,
  ChartSkeleton,
  TimelineSkeleton,
  ListSkeleton,
  FormSkeleton,
  KpiSkeleton,
  PageSkeleton,
} from './Skeletons';
// Primitives (from shared)
export { Skeleton, SkeletonText } from '../shared/LoadingSkeleton';

// ─── Error states ─────────────────────────────────────────────────────────────
export type { ErrorType, ErrorStateProps } from './ErrorStates';
export {
  ErrorState,
  NetworkError,
  ApiError,
  UnauthorizedError,
  NotFoundError,
  ServerError,
  OfflineState,
  PartialDataState,
} from './ErrorStates';

// ─── Empty states ─────────────────────────────────────────────────────────────
export type { EmptyAction, EmptyStateProps } from './EmptyStates';
export {
  EmptyState,
  EmptyProjects,
  EmptyAssets,
  EmptyNotifications,
  EmptyResearch,
  EmptyEvidence,
  EmptyTeam,
  EmptyScripts,
  EmptyAnalytics,
  EmptySearchResults,
} from './EmptyStates';

// ─── Form primitives ──────────────────────────────────────────────────────────
export {
  FormRoot,
  FormSection,
  FormField,
  FormError,
  FormSuccess,
  Input,
  Textarea,
  SelectField,
  Checkbox,
  RadioGroup,
} from './form-primitives';

// ─── Form advanced inputs ─────────────────────────────────────────────────────
export type { MultiSelectOption } from './form-advanced';
export {
  MultiSelect,
  AsyncSelect,
  FileUpload,
  DatePicker,
  RichTextField,
} from './form-advanced';

// ─── Form pickers ─────────────────────────────────────────────────────────────
export type { UserOption, SourceOption, AssetOption } from './form-pickers';
export {
  UserPicker,
  SourcePicker,
  AssetPicker,
} from './form-pickers';

// ─── Zod schemas + useZodForm ─────────────────────────────────────────────────
export type {
  ProjectFormValues,
  ResearchFormValues,
  ScriptFormValues,
  InviteMemberValues,
  AssetUploadValues,
  NotificationPrefsValues,
} from './form-zod';
export {
  projectFormSchema,
  researchFormSchema,
  scriptFormSchema,
  inviteMemberSchema,
  assetUploadSchema,
  notificationPrefsSchema,
  useZodForm,
} from './form-zod';
