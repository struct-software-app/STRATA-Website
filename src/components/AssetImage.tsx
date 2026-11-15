import React, { useLayoutEffect, useRef, useState } from 'react';
import { useData } from '../context/DataContext';
import { resolveAssetUrl } from '../lib/url';

export interface AssetImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fit?: 'contain' | 'cover';
  position?: string;
  fallback?: React.ReactNode;
}

const FILTER_CLASS_RE = /\b(?:filter|brightness-0|invert)\b/g;

function stripFilterClasses(classes: string): string {
  return classes.replace(FILTER_CLASS_RE, '').replace(/\s+/g, ' ').trim();
}

export const AssetImage: React.FC<AssetImageProps> = ({
  src,
  alt,
  className = '',
  fit = 'contain',
  position = 'center',
  fallback,
}) => {
  const { loading } = useData();
  const resolvedSrc = resolveAssetUrl(src).trim();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useLayoutEffect(() => {
    if (!resolvedSrc) {
      setLoaded(false);
      setFailed(false);
      return;
    }

    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setLoaded(true);
      setFailed(false);
    } else {
      setLoaded(false);
      setFailed(false);
    }
  }, [resolvedSrc]);

  const isMissing = (!loading && !resolvedSrc) || failed;
  if (isMissing) {
    const cleanClass = stripFilterClasses(className);
    return (
      <div className={`${cleanClass} bg-transparent overflow-hidden rounded-none`.trim()}>
        {fallback ?? null}
      </div>
    );
  }

  const isBlack = (!resolvedSrc && loading) || (Boolean(resolvedSrc) && !loaded && !failed);
  const wrapperClass = isBlack
    ? `${stripFilterClasses(className)} bg-black overflow-hidden rounded-none`.trim()
    : `${className} bg-transparent overflow-hidden rounded-none`.trim();

  return (
    <div className={wrapperClass}>
      {resolvedSrc ? (
        <img
          ref={imgRef}
          src={resolvedSrc}
          alt={alt}
          draggable={false}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={{ objectPosition: position }}
          className={`w-full h-full ${fit === 'cover' ? 'object-cover' : 'object-contain'} transition-opacity duration-150 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : null}
    </div>
  );
};
