import React from 'react';
import { Sparkles, Shield, HardDrive, Gamepad2, PhoneCall, Scale } from 'lucide-react';
import { sound } from '../utils/soundEngine';
import { NavTabType } from './Navbar';
import { LegalTab } from './LegalFooterModal';

interface FooterProps {
  onSelectTab: (tab: NavTabType) => void;
  onOpenLegalTab: (tab: LegalTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenLegalTab }) => {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#070709] text-zinc-400 text-xs font-mono py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="font-['Chakra_Petch'] font-black text-xl text-white tracking-wider">
                GTA VI <span className="bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">LAUNCH ENGINE</span>
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-md font-sans">
              The high-performance cyberpunk tactical companion hub for GTA 6. Verified legacy controller cheats, real-time DTMF satellite dialer, and 180GB hardware readiness calculator.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>100% Client-Side Web Audio DSP Synthesizer Active</span>
            </div>
          </div>

          {/* Quick Hub Navigation */}
          <div className="space-y-2">
            <div className="text-white font-bold uppercase tracking-wider text-xs font-['Chakra_Petch']">
              Engine Modules
            </div>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <button
                  onClick={() => {
                    sound.playClick();
                    onSelectTab('launch');
                  }}
                  className="hover:text-pink-400 transition-colors cursor-pointer flex items-center gap-1.5 text-xs text-left"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span>Launch Countdown Engine (19 Nov 2026)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sound.playClick();
                    onSelectTab('cheats');
                  }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1.5 text-xs text-left"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Interactive Cheat Sheet Engine (Verified)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sound.playClick();
                    onSelectTab('dialer');
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5 text-xs text-left"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>iFruit DTMF Phone Dialer Simulator</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    sound.playClick();
                    onSelectTab('ssd');
                  }}
                  className="hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs text-left"
                >
                  <HardDrive className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Storage &amp; Hardware Bottleneck Tool</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Disclaimer */}
          <div className="space-y-2">
            <div className="text-white font-bold uppercase tracking-wider text-xs font-['Chakra_Petch'] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-pink-400" />
              <span>Independent Fan Utility</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
              This application is an independent fan utility and enthusiast companion tool not affiliated with, endorsed by, sponsored by, or associated with Rockstar Games, Inc. or Take-Two Interactive Software, Inc.
            </p>
            <p className="text-[10px] text-zinc-500 leading-relaxed font-sans pt-1">
              Grand Theft Auto, GTA 6, GTA 5, Vice City, and all associated logos are trademarks or registered trademarks of Rockstar Games / Take-Two Interactive.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div className="flex flex-col gap-1.5 text-center sm:text-left">
            <div>© 2026 GTA 6 Companion Hub · Independent Fan Engineering</div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1 text-zinc-400">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenLegalTab('privacy');
                }}
                className="hover:text-pink-400 transition-colors cursor-pointer hover:underline"
              >
                Privacy Policy
              </button>
              <span className="text-zinc-700 select-none">·</span>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenLegalTab('disclaimer');
                }}
                className="hover:text-cyan-400 transition-colors cursor-pointer hover:underline"
              >
                Affiliate &amp; Fair Use Disclaimer
              </button>
              <span className="text-zinc-700 select-none">·</span>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenLegalTab('contact');
                }}
                className="hover:text-emerald-400 transition-colors cursor-pointer hover:underline"
              >
                Contact &amp; DMCA
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400 bg-zinc-950/60 border border-zinc-900 px-3 py-1.5 rounded-lg">
            <Scale className="w-3.5 h-3.5 text-pink-500" />
            <span className="text-[10px] uppercase font-bold tracking-wider">COMPLIANCE PORTAL ACTIVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
