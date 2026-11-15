import React from 'react';
import { useData } from '../context/DataContext';
import { AssetImage } from './AssetImage';

interface WalletBalanceProps {
  size?: 'md' | 'lg';
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({ size = 'md' }) => {
  const { walletTokens, branding, loading, formatTokens } = useData();
  const textSize = size === 'lg' ? 'text-2xl' : 'text-lg';
  const iconSize = size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-zinc-500">Wallet</div>
      <div className="mt-1 flex items-center gap-2">
        <span className={`font-mono font-bold text-black ${textSize}`}>
          {formatTokens(walletTokens)}
        </span>
        <span className="sr-only">tokens</span>
        {(loading || branding.storeIcon) && (
          <AssetImage src={branding.storeIcon} alt="" className={`${iconSize} shrink-0`} />
        )}
      </div>
    </div>
  );
};
