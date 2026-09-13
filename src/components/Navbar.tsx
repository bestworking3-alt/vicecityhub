import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  Volume2, 
  VolumeX, 
  Gamepad2, 
  PhoneCall, 
  Sparkles,
  Radio,
  Clock,
  HardDrive
} from 'lucide-react';
import { sound } from '../utils/soundEngine';

export type NavTabType = 'launch' | 'cheats' | 'dialer' | 'ssd';

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [viceTime, setViceTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setViceTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSoundToggle = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const navItems = [
    { id: 'launch', label: 'Launch', icon: Sparkles },
    { id: 'cheats', label: 'Cheats', icon: Gamepad2 },
    { id: 'dialer', label: 'iFruit', icon: PhoneCall },
    { id: 'ssd', label: 'Hardware', icon: HardDrive },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0a0a0c]/90 border-b border-zinc-800/80 transition-all">
      {/* Top micro-bar with status */}
      <div className="bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-cyan-950/40 border-b border-zinc-800/40 px-4 py-1 flex items-center justify-between text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            RAGE 9 ENGINE ONLINE
          </span>
          <span className="hidden sm:inline-block text-zinc-600">|</span>
          <span className="hidden sm:flex items-center gap-1 text-zinc-300">
            <Radio className="w-3 h-3 text-pink-400 animate-pulse" />
            STATE OF LEONIDA FREQ: 98.4 FM
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-cyan-300">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>VICE CITY {viceTime}</span>
          </div>
          <button
            id="audio-toggle-btn"
            onClick={handleSoundToggle}
            aria-label="Toggle Web Audio SFX"
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700/70 hover:border-pink-500/50 text-zinc-300 hover:text-pink-300 transition-all cursor-pointer"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3 h-3 text-rose-400" />
                <span className="text-[10px] uppercase font-bold text-rose-400">SFX OFF</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] uppercase font-bold text-emerald-400">SFX ON</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div 
          onClick={() => {
            sound.playClick(600, 300);
            setActiveTab('launch');
          }}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-500 p-0.5 shadow-[0_0_15px_rgba(236,72,153,0.4)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all">
            <div className="w-full h-full bg-[#0a0a0c] rounded-[10px] flex items-center justify-center">
              <span className="font-['Chakra_Petch'] font-black text-xl tracking-tighter bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
                VI
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Chakra_Petch'] font-bold text-lg tracking-wider text-white group-hover:text-pink-400 transition-colors">
                GTA VI
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 uppercase font-semibold">
                LAUNCH ENGINE
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden xl:block">19 Nov 2026 Countdown &amp; Cheats Hub</p>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900/90 border border-zinc-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => {
                  sound.playClick(700, 350);
                  setActiveTab(item.id);
                }}
                className={`relative px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer font-['Chakra_Petch'] tracking-wide
                  ${isActive 
                    ? 'text-white bg-gradient-to-r from-pink-600/40 via-purple-600/40 to-cyan-600/40 border border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.35)]' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-pink-400' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 rounded-lg border border-pink-500/40 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Launch Target Pill */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-cyan-500/30">
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            <div className="text-xs">
              <span className="text-zinc-400">Target Launch: </span>
              <span className="font-mono font-bold text-cyan-300">19 NOV 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Tab Bar (4 Tabs) */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 bg-zinc-950/95 border-t border-zinc-800/80 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-mobile-${item.id}`}
              onClick={() => {
                sound.playClick(650, 300);
                setActiveTab(item.id);
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all
                ${isActive 
                  ? 'text-pink-400 bg-pink-950/40 border border-pink-500/40 font-bold' 
                  : 'text-zinc-400 hover:text-zinc-200'
                }
              `}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
