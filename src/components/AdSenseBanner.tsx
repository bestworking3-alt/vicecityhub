import React from 'react';
import { Radio, ExternalLink, ShieldCheck } from 'lucide-react';

interface AdSenseBannerProps {
  slotType: 'leaderboard' | 'infeed' | 'sticky-bottom' | 'rectangle';
  adClient?: string;
  adSlot?: string;
  className?: string;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slotType = 'leaderboard',
  adClient = 'ca-pub-XXXXXXXXXXXXXXXX',
  adSlot = '1234567890',
  className = '',
}) => {
  if (slotType === 'leaderboard') {
    return (
      <div className={`w-full max-w-5xl mx-auto my-6 p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 relative overflow-hidden ${className}`}>
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-2 px-1">
          <span className="flex items-center gap-1">
            <Radio className="w-3 h-3 text-cyan-400" />
            <span>SPONSORED ADVERTISEMENT</span>
          </span>
          <span>GOOGLE ADSENSE · 728x90 RESPONSIVE</span>
        </div>

        {/* AdSense Unit Container */}
        <div className="min-h-[90px] w-full rounded-xl bg-gradient-to-r from-zinc-900 via-[#13111c] to-zinc-900 border border-zinc-800/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-950/80 border border-pink-500/40 flex items-center justify-center shrink-0">
              <span className="font-['Chakra_Petch'] font-bold text-pink-400 text-lg">G2A</span>
            </div>
            <div>
              <div className="text-xs font-mono text-pink-400 font-semibold uppercase">GTA 6 PRE-ORDER &amp; GAME KEY VAULT</div>
              <div className="font-['Chakra_Petch'] font-bold text-white text-sm sm:text-base">
                GTA V, Shark Cards &amp; Next-Gen Console Wallet Codes
              </div>
              <div className="text-[11px] text-zinc-400 hidden sm:block">
                Slam-dunk savings on authorized game keys, Xbox Live, PSN cards &amp; Steam wallet funds instantly.
              </div>
            </div>
          </div>

          <a
            href="https://www.g2a.com/n/y56"
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-[0_0_12px_rgba(236,72,153,0.4)] transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>CHECK G2A DEALS</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  if (slotType === 'infeed') {
    return (
      <div className={`col-span-full my-4 p-4 rounded-2xl bg-zinc-950 border-2 border-dashed border-zinc-800 relative overflow-hidden ${className}`}>
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-2">
          <span>ADVERTISEMENT</span>
          <span>NATIVE IN-FEED BANNER</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs font-mono text-emerald-400 font-bold">G2A GOLDMINE DISCOUNT VAULT</div>
            <h4 className="text-base font-bold text-white font-['Chakra_Petch']">
              Xbox Live, PlayStation Network &amp; Steam Digital Gift Cards
            </h4>
            <p className="text-xs text-zinc-400">
              Top up your digital balance instantly for secure pre-orders, subscriptions, and game package keys at massive discount.
            </p>
          </div>
          <a
            href="https://www.g2a.com/n/y56"
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)] whitespace-nowrap cursor-pointer"
          >
            <span>GET G2A DISCOUNTS</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center ${className}`}>
      <div className="text-[9px] font-mono text-zinc-500 uppercase">Advertisement</div>
      <div className="text-xs text-zinc-400 font-mono py-2">Google AdSense Space [Slot: {adSlot}]</div>
    </div>
  );
};
