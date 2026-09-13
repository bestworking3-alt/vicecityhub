import React from 'react';
import { motion } from 'motion/react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { ControllerPlatform } from '../types';
import { sound } from '../utils/soundEngine';

interface ControllerButtonBadgeProps {
  button: string;
  platform: ControllerPlatform;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onPress?: (button: string) => void;
  isActive?: boolean;
}

export const ControllerButtonBadge: React.FC<ControllerButtonBadgeProps> = ({
  button,
  platform,
  size = 'md',
  interactive = false,
  onPress,
  isActive = false,
}) => {
  const normalized = button.toUpperCase().trim();

  // Size mapping
  const sizeClasses = {
    sm: 'min-w-[24px] h-6 px-1.5 text-xs font-mono',
    md: 'min-w-[32px] h-8 px-2 text-xs md:text-sm font-mono',
    lg: 'min-w-[42px] h-10 px-3 text-sm md:text-base font-mono font-bold',
  }[size];

  // Colors & visual styling based on platform and button token
  let bgGradient = 'bg-zinc-800/90 text-zinc-100 border-zinc-700/80 shadow-sm';
  let symbol: React.ReactNode = normalized;

  // D-pad handling
  if (normalized === 'UP') {
    symbol = <ArrowUp className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />;
    bgGradient = 'bg-zinc-900 border-cyan-500/40 text-cyan-300';
  } else if (normalized === 'DOWN') {
    symbol = <ArrowDown className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />;
    bgGradient = 'bg-zinc-900 border-cyan-500/40 text-cyan-300';
  } else if (normalized === 'LEFT') {
    symbol = <ArrowLeft className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />;
    bgGradient = 'bg-zinc-900 border-cyan-500/40 text-cyan-300';
  } else if (normalized === 'RIGHT') {
    symbol = <ArrowRight className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />;
    bgGradient = 'bg-zinc-900 border-cyan-500/40 text-cyan-300';
  }
  // PS5 face buttons
  else if (platform === 'ps5' || normalized === 'CROSS' || normalized === 'X' && platform === 'ps5') {
    if (normalized === 'TRIANGLE') {
      symbol = <span className="text-emerald-400 font-bold">▲</span>;
      bgGradient = 'bg-zinc-900/90 border-emerald-500/50 text-emerald-400';
    } else if (normalized === 'CIRCLE') {
      symbol = <span className="text-rose-400 font-bold">●</span>;
      bgGradient = 'bg-zinc-900/90 border-rose-500/50 text-rose-400';
    } else if (normalized === 'CROSS' || normalized === 'X') {
      symbol = <span className="text-blue-400 font-bold">✕</span>;
      bgGradient = 'bg-zinc-900/90 border-blue-500/50 text-blue-400';
    } else if (normalized === 'SQUARE') {
      symbol = <span className="text-pink-400 font-bold">■</span>;
      bgGradient = 'bg-zinc-900/90 border-pink-500/50 text-pink-400';
    } else if (['L1', 'R1', 'L2', 'R2'].includes(normalized)) {
      bgGradient = 'bg-zinc-800/90 border-zinc-600 text-zinc-200';
    } else if (['L3', 'R3'].includes(normalized)) {
      bgGradient = 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300';
    }
  }
  // Xbox buttons
  else if (platform === 'xbox') {
    if (normalized === 'A') {
      bgGradient = 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300 font-bold';
    } else if (normalized === 'B') {
      bgGradient = 'bg-rose-950/80 border-rose-500/80 text-rose-300 font-bold';
    } else if (normalized === 'X') {
      bgGradient = 'bg-blue-950/80 border-blue-500/80 text-blue-300 font-bold';
    } else if (normalized === 'Y') {
      bgGradient = 'bg-amber-950/80 border-amber-500/80 text-amber-300 font-bold';
    } else if (['LB', 'RB', 'LT', 'RT'].includes(normalized)) {
      bgGradient = 'bg-zinc-800/90 border-zinc-600 text-zinc-200';
    } else if (['LS', 'RS'].includes(normalized)) {
      bgGradient = 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300';
    }
  }

  const handleClick = () => {
    if (interactive && onPress) {
      sound.playButtonTone();
      onPress(normalized);
    }
  };

  return (
    <motion.button
      type="button"
      whileHover={interactive ? { scale: 1.08, y: -1 } : undefined}
      whileTap={interactive ? { scale: 0.94 } : undefined}
      onClick={handleClick}
      disabled={!interactive}
      className={`inline-flex items-center justify-center rounded-md border font-semibold tracking-wider transition-all select-none
        ${sizeClasses} ${bgGradient}
        ${isActive ? 'ring-2 ring-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.6)] scale-105' : ''}
        ${interactive ? 'cursor-pointer hover:brightness-125' : 'cursor-default'}
      `}
    >
      {symbol}
    </motion.button>
  );
};
