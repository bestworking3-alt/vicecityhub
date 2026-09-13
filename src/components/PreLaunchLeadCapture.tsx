import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Send, 
  CheckCircle2, 
  Mail, 
  Sparkles, 
  ShieldCheck, 
  Radio, 
  Flame,
  Zap,
  Check
} from 'lucide-react';
import { sound } from '../utils/soundEngine';

export const PreLaunchLeadCapture: React.FC = () => {
  const [leadMode, setLeadMode] = useState<'email' | 'telegram'>('email');
  const [inputValue, setInputValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [memberNumber, setMemberNumber] = useState<number>(48219);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gta6_lead_subscribed');
      if (saved) {
        setIsSubscribed(true);
        const parsed = JSON.parse(saved);
        if (parsed.memberNumber) setMemberNumber(parsed.memberNumber);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      sound.playError();
      setErrorMsg('Please enter your email address or Telegram handle.');
      return;
    }

    if (leadMode === 'email' && !inputValue.includes('@')) {
      sound.playError();
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);
    sound.playClick(600, 300);

    setTimeout(() => {
      const assignedNumber = Math.floor(48000 + Math.random() * 5000);
      setMemberNumber(assignedNumber);
      setIsSubmitting(false);
      setIsSubscribed(true);
      sound.playCheatSuccess();

      try {
        localStorage.setItem(
          'gta6_lead_subscribed',
          JSON.stringify({ value: inputValue, mode: leadMode, memberNumber: assignedNumber, date: new Date().toISOString() })
        );
      } catch {
        // ignore
      }
    }, 800);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#170e24] via-[#100f1c] to-[#0a1520] border-2 border-pink-500/50 p-6 sm:p-8 shadow-[0_0_40px_rgba(236,72,153,0.25)]">
      {/* Decorative cyber grid accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/80 border border-pink-500/50 text-pink-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Bell className="w-3.5 h-3.5 text-pink-400 animate-bounce" />
              <span>PRE-LAUNCH FAST DISPATCH SYNDICATE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Chakra_Petch'] leading-tight">
              Get 100% verified GTA 6 codes within 10 minutes of release
            </h2>
            <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl font-light">
              Don't waste time on fake spam combos. Our dataminers and launch testers will dispatch verified controller combinations, cell phone numbers, and unlock sequences straight to your inbox or Telegram.
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-end text-right">
            <span className="font-mono text-xs text-zinc-400">REGISTERED SYNDICATE</span>
            <span className="font-['Chakra_Petch'] text-2xl font-black text-cyan-400">
              {memberNumber.toLocaleString()} PLAYERS
            </span>
          </div>
        </div>

        {/* Form or Subscribed State */}
        <AnimatePresence mode="wait">
          {isSubscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-950/70 border border-emerald-500/60 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-sm text-white font-['Chakra_Petch']">
                    DISPATCH TRANSMISSION LOCKED · VIP SYNDICATE #{memberNumber}
                  </div>
                  <div className="text-xs text-emerald-300">
                    You will receive instant push notifications as soon as GTA 6 servers go live on 19 November 2026.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-400/50 text-[11px] font-mono text-emerald-200 font-bold">
                  ✓ PRIORITY QUEUE ACTIVE
                </span>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playToggle();
                    setLeadMode('email');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer
                    ${leadMode === 'email'
                      ? 'bg-pink-600 text-white shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }
                  `}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Dispatch</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playToggle();
                    setLeadMode('telegram');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer
                    ${leadMode === 'telegram'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }
                  `}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram Alert</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <input
                    type={leadMode === 'email' ? 'email' : 'text'}
                    placeholder={leadMode === 'email' ? 'Enter your gamer email address...' : 'Enter your @telegram_username...'}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="w-full bg-zinc-950/90 border border-zinc-700 focus:border-pink-500 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-pink-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:shadow-[0_0_30px_rgba(236,72,153,0.8)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>{isSubmitting ? 'ENROLLING...' : 'GET DAY-1 CODES'}</span>
                </button>
              </div>

              {errorMsg && (
                <div className="text-xs font-mono text-rose-400">
                  {errorMsg}
                </div>
              )}

              <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Zero spam
                </span>
                <span>•</span>
                <span>Direct encrypted webhook dispatch</span>
                <span>•</span>
                <span>Unsubscribe anytime</span>
              </div>
            </form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
