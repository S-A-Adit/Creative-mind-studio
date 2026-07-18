/**
 * AuthRouter — lightweight in-memory router for all auth/onboarding pages.
 *
 * No external router dependency needed. Pages communicate via the
 * `onNavigate` callback pattern.
 *
 * Valid page ids:
 *   login | register | forgot-password | verify-email | invitation | onboarding | dashboard
 */
import React, { useState } from 'react';
import { LoginPage } from './login/LoginPage';
import { RegisterPage } from './register/RegisterPage';
import { ForgotPasswordPage } from './login/ForgotPasswordPage';
import { EmailVerificationPage } from './login/EmailVerificationPage';
import { TeamInvitationPage } from './login/TeamInvitationPage';
import { OnboardingWizard } from './onboarding/OnboardingWizard';

export type AuthPageId =
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'verify-email'
  | 'invitation'
  | 'onboarding'
  | 'dashboard';

interface AuthRouterProps {
  /** Initial page to show */
  initialPage?: AuthPageId;
  /** Called when auth flow completes and app shell should mount */
  onAuthenticated?: () => void;
}

export const AuthRouter: React.FC<AuthRouterProps> = ({
  initialPage = 'login',
  onAuthenticated,
}) => {
  const [page, setPage] = useState<AuthPageId>(initialPage);
  const [verifyEmail, setVerifyEmail] = useState(''); // eslint-disable-line @typescript-eslint/no-unused-vars

  const navigate = (to: string) => {
    if (to === 'dashboard') {
      onAuthenticated?.();
      return;
    }
    setPage(to as AuthPageId);
  };

  switch (page) {
    case 'login':
      return <LoginPage onNavigate={navigate} />;

    case 'register':
      return (
        <RegisterPage
          onNavigate={(p) => {
            // Capture email for verify-email page
            navigate(p);
          }}
        />
      );

    case 'forgot-password':
      return <ForgotPasswordPage onNavigate={navigate} />;

    case 'verify-email':
      return (
        <EmailVerificationPage
          email={verifyEmail || 'you@example.com'}
          onNavigate={navigate}
        />
      );

    case 'invitation':
      return <TeamInvitationPage onNavigate={navigate} />;

    case 'onboarding':
      return (
        <OnboardingWizard
          onComplete={() => navigate('dashboard')}
        />
      );

    default:
      return <LoginPage onNavigate={navigate} />;
  }
};
