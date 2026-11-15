import React, { useLayoutEffect, useRef, useState } from 'react';
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
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useLayoutEffect(() => {
    setFailed(false);
    const img = imgRef.current;
    if (avatarUrl && img && img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
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
          ref={imgRef}
          src={avatarUrl}
          alt=""
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`w-full h-full object-cover transition-opacity duration-200 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        <span
          className="font-semibold leading-none text-white"
          style={{ fontSize: Math.round(size * 0.38) }}
        >
          {initials}
        </span>
      )}
    </div>
  );
};
