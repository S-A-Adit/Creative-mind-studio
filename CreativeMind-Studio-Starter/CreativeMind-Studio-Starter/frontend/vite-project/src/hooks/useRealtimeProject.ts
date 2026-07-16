/**
 * useRealtimeProject — mock-driven realtime hook.
 *
 * Architecture is transport-agnostic. Replace the mock emission loop with any of:
 *   • WebSocket  →  new WebSocket(url)
 *   • SSE        →  new EventSource(url)
 *   • Socket.io  →  io(url)
 *
 * The public API (subscribeToEvent, simulateEvent, state shape) stays identical.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ActivityPayload,
  AgentUpdatePayload,
  AssetProcessingPayload,
  CommentPayload,
  ConnectionStatus,
  PresencePayload,
  RealtimeEvent,
  RealtimeEventType,
  RealtimeProjectState,
  ResearchProgressPayload,
  UseRealtimeProjectReturn,
} from '../types/shell';

// ─── Mock data generators ────────────────────────────────────────────────────

const MOCK_AGENTS: AgentUpdatePayload[] = [
  { agentId: 'strategy-agent', agentName: 'Strategy Agent', status: 'running', progress: 62, message: 'Analyzing content pillars…' },
  { agentId: 'research-agent', agentName: 'Research Agent', status: 'idle', progress: 100, message: 'Standby' },
  { agentId: 'script-agent', agentName: 'Script Agent', status: 'idle', progress: 0 },
];

const MOCK_PRESENCE: PresencePayload[] = [
  { userId: 'u1', userName: 'Alex Rivera', activeSection: 'strategy-room' },
  { userId: 'u2', userName: 'Jordan Kim', activeSection: 'research-lab' },
];

const MOCK_ACTIVITY: ActivityPayload[] = [
  { actorName: 'Alex Rivera', action: 'updated strategy brief', target: 'Q4 Campaign', timestamp: Date.now() - 1200000 },
  { actorName: 'AI Agent', action: 'completed research scan', target: '14 sources', timestamp: Date.now() - 600000 },
];

function buildInitialState(): RealtimeProjectState {
  const agentMap: Record<string, AgentUpdatePayload> = {};
  MOCK_AGENTS.forEach((a) => (agentMap[a.agentId] = a));

  return {
    connectionStatus: 'connecting',
    presenceUsers: [...MOCK_PRESENCE],
    latestActivity: [...MOCK_ACTIVITY],
    agentUpdates: agentMap,
    researchProgress: {},
    assetProcessing: {},
    recentComments: [],
    events: [],
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useRealtimeProject(projectId: string): UseRealtimeProjectReturn {
  const [state, setState] = useState<RealtimeProjectState>(buildInitialState);

  // Handler registry: eventType → Set<handler>
  const handlersRef = useRef<Map<RealtimeEventType, Set<(payload: unknown) => void>>>(new Map());

  // Emit event to state + registered handlers
  const emitEvent = useCallback((event: RealtimeEvent) => {
    setState((prev) => ({
      ...prev,
      events: [event, ...prev.events].slice(0, 100),
    }));

    const handlers = handlersRef.current.get(event.type);
    handlers?.forEach((h) => h(event.payload));

    // Merge into structured state slices
    setState((prev) => {
      switch (event.type) {
        case 'agent-update': {
          const p = event.payload as AgentUpdatePayload;
          return { ...prev, agentUpdates: { ...prev.agentUpdates, [p.agentId]: p } };
        }
        case 'presence': {
          const p = event.payload as PresencePayload;
          const existing = prev.presenceUsers.filter((u) => u.userId !== p.userId);
          return { ...prev, presenceUsers: [...existing, p] };
        }
        case 'activity': {
          const p = event.payload as ActivityPayload;
          return { ...prev, latestActivity: [p, ...prev.latestActivity].slice(0, 20) };
        }
        case 'research-progress': {
          const p = event.payload as ResearchProgressPayload;
          return { ...prev, researchProgress: { ...prev.researchProgress, [p.queryId]: p } };
        }
        case 'asset-processing': {
          const p = event.payload as AssetProcessingPayload;
          return { ...prev, assetProcessing: { ...prev.assetProcessing, [p.assetId]: p } };
        }
        case 'comment': {
          const p = event.payload as CommentPayload;
          return { ...prev, recentComments: [p, ...prev.recentComments].slice(0, 50) };
        }
        case 'connection-status': {
          const p = event.payload as { status: ConnectionStatus };
          return { ...prev, connectionStatus: p.status };
        }
        default:
          return prev;
      }
    });
  }, []);

  // Subscribe to a specific event type; returns unsubscribe fn
  const subscribeToEvent = useCallback(
    <T>(type: RealtimeEventType, handler: (payload: T) => void): (() => void) => {
      if (!handlersRef.current.has(type)) {
        handlersRef.current.set(type, new Set());
      }
      const set = handlersRef.current.get(type)!;
      const typedHandler = handler as (payload: unknown) => void;
      set.add(typedHandler);
      return () => set.delete(typedHandler);
    },
    []
  );

  // Allow components/tests to inject custom events
  const simulateEvent = useCallback(
    (event: RealtimeEvent) => emitEvent(event),
    [emitEvent]
  );

  const disconnect = useCallback(() => {
    setState((prev) => ({ ...prev, connectionStatus: 'disconnected' }));
  }, []);

  const reconnect = useCallback(() => {
    setState((prev) => ({ ...prev, connectionStatus: 'connecting' }));
    setTimeout(() => {
      setState((prev) => ({ ...prev, connectionStatus: 'connected' }));
    }, 1200);
  }, []);

  // ── Mock event loop (replace this block with real transport) ───────────────
  useEffect(() => {
    if (!projectId) return;

    // Simulate initial connection
    const connectTimer = setTimeout(() => {
      emitEvent({
        type: 'connection-status',
        payload: { status: 'connected' },
        timestamp: Date.now(),
        projectId,
      });
    }, 800);

    // Simulate periodic agent progress updates
    const agentTimer = setInterval(() => {
      const agents = Object.values(buildInitialState().agentUpdates);
      const agent = agents[Math.floor(Math.random() * agents.length)];
      const nextProgress = Math.min((agent.progress ?? 0) + Math.random() * 8, 100);
      emitEvent({
        type: 'agent-update',
        payload: {
          ...agent,
          status: nextProgress >= 100 ? 'completed' : 'running',
          progress: Math.round(nextProgress),
          message: nextProgress >= 100 ? 'Task completed' : `Processing… ${Math.round(nextProgress)}%`,
        } satisfies AgentUpdatePayload,
        timestamp: Date.now(),
        projectId,
      });
    }, 5000);

    // Simulate presence heartbeats
    const presenceTimer = setInterval(() => {
      const sections = ['strategy-room', 'research-lab', 'editor-workspace', 'asset-room'];
      MOCK_PRESENCE.forEach((user) => {
        emitEvent({
          type: 'presence',
          payload: {
            ...user,
            activeSection: sections[Math.floor(Math.random() * sections.length)],
          } satisfies PresencePayload,
          timestamp: Date.now(),
          projectId,
        });
      });
    }, 10000);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(agentTimer);
      clearInterval(presenceTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return {
    ...state,
    subscribeToEvent,
    simulateEvent,
    disconnect,
    reconnect,
  };
}
