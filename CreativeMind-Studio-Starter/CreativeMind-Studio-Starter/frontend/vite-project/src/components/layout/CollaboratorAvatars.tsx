/**
 * CollaboratorAvatars — compact presence display for the top header.
 * Shows up to `max` user avatars with an overflow count.
 */

import React from 'react';

interface CollaboratorAvatarsProps {
  users: { userId: string; userName: string; avatarUrl?: string }[];
  max?: number;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

const COLORS = [
  '#7C3AED', '#4F46E5', '#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#06B6D4',
];

export const CollaboratorAvatars: React.FC<CollaboratorAvatarsProps> = ({
  users,
  max = 4,
}) => {
  const visible = users.slice(0, max);
  const overflow = users.length - max;

  if (users.length === 0) return null;

  return (
    <div
      className="flex items-center"
      aria-label={`${users.length} collaborator${users.length !== 1 ? 's' : ''} online`}
      role="group"
    >
      {visible.map((user, idx) => {
        const bg = COLORS[idx % COLORS.length];
        return (
          <div
            key={user.userId}
            title={user.userName}
            aria-label={user.userName}
            className="w-7 h-7 rounded-full border-2 border-[#07070A] flex items-center justify-center
              text-[10px] font-semibold text-white flex-shrink-0 -ml-1.5 first:ml-0
              relative overflow-hidden transition-transform duration-150 hover:z-10 hover:scale-110"
            style={{ backgroundColor: bg }}
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.userName}
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(user.userName)
            )}

            {/* Online dot */}
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500
              border border-[#07070A]" aria-hidden="true" />
          </div>
        );
      })}

      {overflow > 0 && (
        <div
          className="w-7 h-7 rounded-full border-2 border-[#07070A] bg-[#1B1B2A]
            flex items-center justify-center text-[10px] font-semibold text-slate-400 -ml-1.5"
          aria-label={`${overflow} more`}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
};
