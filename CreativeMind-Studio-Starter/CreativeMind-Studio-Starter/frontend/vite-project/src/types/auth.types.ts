/**
 * auth.types.ts
 *
 * Authentication, session, and token types for CreativeMind Studio.
 * Compatible with JWT-based auth and OAuth provider flows.
 */

import type { ID, UUID, Timestamp, URLString } from './common.types';

// ─── Auth provider ────────────────────────────────────────────────────────────

export type AuthProvider = 'email' | 'google' | 'github' | 'microsoft' | 'apple';

// ─── JWT token ────────────────────────────────────────────────────────────────

/** Decoded JWT access token claims */
export interface AccessTokenClaims {
  readonly sub:         UUID;       // user ID
  readonly email:       string;
  readonly workspaceId: UUID;
  readonly role:        string;
  readonly iat:         number;     // issued-at (epoch seconds)
  readonly exp:         number;     // expiry (epoch seconds)
  readonly jti:         UUID;       // unique token ID
}

/** Stored token pair */
export interface TokenPair {
  readonly accessToken:  string;
  readonly refreshToken: string;
  readonly expiresAt:    Timestamp;
  readonly tokenType:    'Bearer';
}

// ─── Session ──────────────────────────────────────────────────────────────────

/** Active session metadata */
export interface Session {
  readonly sessionId:  UUID;
  readonly userId:     ID;
  readonly workspaceId:ID;
  readonly deviceId:   string;
  readonly userAgent:  string;
  readonly ipAddress:  string;
  readonly createdAt:  Timestamp;
  readonly lastSeenAt: Timestamp;
  readonly expiresAt:  Timestamp;
  readonly isActive:   boolean;
}

// ─── Auth context ─────────────────────────────────────────────────────────────

/** Runtime auth state held in React context / global store */
export interface AuthState {
  isAuthenticated:    boolean;
  isLoading:          boolean;
  userId:             ID | null;
  workspaceId:        ID | null;
  accessToken:        string | null;
  tokenExpiresAt:     Timestamp | null;
  sessionId:          UUID | null;
}

// ─── API request/response payloads ───────────────────────────────────────────

export interface LoginRequest {
  email:    string;
  password: string;
  remember?:boolean;
}

export interface LoginResponse {
  readonly tokens: TokenPair;
  readonly userId: ID;
}

export interface RegisterRequest {
  name:          string;
  email:         string;
  password:      string;
  workspaceName: string;
  inviteCode?:   string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token:    string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface OAuthCallbackRequest {
  provider: AuthProvider;
  code:     string;
  state?:   string;
}

// ─── Invite ───────────────────────────────────────────────────────────────────

export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled';

export interface WorkspaceInvitation {
  readonly id:              ID;
  readonly email:           string;
  readonly workspaceId:     ID;
  readonly workspaceName:   string;
  readonly invitedBy:       string;
  readonly invitedByAvatar: string;
  readonly invitedAt:       Timestamp;
  readonly expiresAt:       Timestamp;
  readonly status:          InvitationStatus;
  readonly role:            string;
  readonly inviteUrl:       URLString;
}

export interface AcceptInvitationRequest {
  inviteCode: string;
}
