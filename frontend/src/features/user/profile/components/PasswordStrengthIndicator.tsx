import React from 'react';

const labels = ['Weak', 'Fair', 'Good', 'Strong'];
const colors = ['bg-rose-500', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-500'];

const scorePassword = (password: string) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

export const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  if (!password) return null;
  const score = scorePassword(password);

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={`h-1 flex-1 rounded-full ${index < score ? colors[score - 1] : 'bg-white/10'}`} />
        ))}
      </div>
      <p className="text-xs text-gray-500">Password strength: <span className="text-gray-300">{labels[Math.max(0, score - 1)] || 'Too weak'}</span></p>
    </div>
  );
};
