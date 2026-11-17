import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { getInitials, getProfileAvatar } from '../lib/profile';

interface AvatarProps {
  size: number;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ size, className = '' }) => {
  const { user, profile } = useData();
  const avatarUrl = getProfileAvatar(profile, user);
  const initials = getInitials(profile, user);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [avatarUrl]);

  if (user && !profile) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-full bg-black shrink-0 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const showImage = Boolean(avatarUrl) && !failed;

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-full overflow-hidden bg-black text-white flex items-center justify-center shrink-0 select-none ${className}`}
    >
      {showImage ? (
        <img
          src={avatarUrl}
          alt=""
          onError={() => setFailed(true)}
          className="w-full h-full object-cover block"
        />
      ) : (
        <span
          className="font-semibold leading-none text-white select-none"
          style={{ fontSize: Math.round(size * 0.38) }}
        >
          {initials}
        </span>
      )}
    </div>
  );
};
