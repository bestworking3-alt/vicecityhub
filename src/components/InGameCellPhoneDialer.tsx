import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  PhoneOff, 
  Delete, 
  BookOpen, 
  Clock, 
  ShieldCheck, 
  Check, 
  Copy, 
  Sparkles, 
  Volume2, 
  Radio, 
  Signal, 
  Battery, 
  Wifi, 
  Search,
  Crosshair
} from 'lucide-react';
import { GTA5_VERIFIED_CHEATS } from '../data/cheats';
import { GTA5Cheat } from '../types';
import { sound } from '../utils/soundEngine';
import { AFFILIATE_LINKS } from '../config/affiliates';

interface InGameCellPhoneDialerProps {
  initialDialNumber?: string;
}

export const InGameCellPhoneDialer: React.FC<InGameCellPhoneDialerProps> = ({
  initialDialNumber = '',
}) => {
  const [dialedNumber, setDialedNumber] = useState<string>(initialDialNumber);
  const [phoneTab, setPhoneTab] = useState<'keypad' | 'contacts' | 'recent'>('keypad');
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<string>('');
  const [activeCheatResult, setActiveCheatResult] = useState<GTA5Cheat | null>(null);
  const [callHistory, setCallHistory] = useState<{ number: string; timestamp: string; cheatName?: string }[]>([
    { number: '1-999-724-654-5537', timestamp: '10:42 PM', cheatName: 'Invincibility (God Mode)' },
    { number: '1-999-887-853', timestamp: '09:15 PM', cheatName: 'Max Health & Armor' },
  ]);
  const [searchContact, setSearchContact] = useState<string>('');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const keypadButtons = [
    { num: '1', sub: '.,-' },
    { num: '2', sub: 'ABC' },
    { num: '3', sub: 'DEF' },
    { num: '4', sub: 'GHI' },
    { num: '5', sub: 'JKL' },
    { num: '6', sub: 'MNO' },
    { num: '7', sub: 'PQRS' },
    { num: '8', sub: 'TUV' },
    { num: '9', sub: 'WXYZ' },
    { num: '*', sub: 'SYS' },
    { num: '0', sub: '+' },
    { num: '#', sub: 'CODE' },
  ];

  const handleDigitPress = (digit: string) => {
    sound.playDTMF(digit);
    if (dialedNumber.length < 22) {
      setDialedNumber((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    sound.playClick(400, 200, 0.03);
    setDialedNumber((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    sound.playClick(300, 150, 0.04);
    setDialedNumber('');
    setActiveCheatResult(null);
  };

  const normalizePhone = (str: string) => str.replace(/[^0-9]/g, '');

  const handleCall = () => {
    if (!dialedNumber) {
      sound.playError();
      return;
    }

    sound.playButtonTone(880);
    setIsCalling(true);
    setCallStatus('CONNECTING TO LEONIDA SATELLITE RELAY...');

    const rawInput = normalizePhone(dialedNumber);

    // Look for matching verified cheat
    const matched = GTA5_VERIFIED_CHEATS.find(
      (c) => normalizePhone(c.phone) === rawInput || normalizePhone(c.phoneRaw) === rawInput
    );

    setTimeout(() => {
      if (matched) {
        sound.playCheatSuccess();
        setCallStatus('CHEAT CODE CONFIRMED · ACTIVATED');
        setActiveCheatResult(matched);
        setCallHistory((prev) => [
          { number: dialedNumber, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), cheatName: matched.name },
          ...prev.slice(0, 8),
        ]);
      } else {
        sound.playError();
        setCallStatus('UNKNOWN LEONIDA FREQUENCY');
        setActiveCheatResult(null);
      }
    }, 1200);
  };

  const handleEndCall = () => {
    sound.playClick(450, 200);
    setIsCalling(false);
    setCallStatus('');
    setActiveCheatResult(null);
  };

  const handleSpeedDial = (cheat: GTA5Cheat) => {
    sound.playClick(750, 400);
    setDialedNumber(cheat.phone);
    setPhoneTab('keypad');
  };

  const handleCopy = (num: string) => {
    sound.playToggle();
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const filteredContacts = GTA5_VERIFIED_CHEATS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchContact.toLowerCase()) ||
      c.category.toLowerCase().includes(searchContact.toLowerCase()) ||
      c.pcCode.toLowerCase().includes(searchContact.toLowerCase()) ||
      c.phone.includes(searchContact)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-12">
      {/* Left Column: Interactive Simulated Smartphone */}
      <div className="lg:col-span-5 flex justify-center">
        <div className="relative w-full max-w-[340px] sm:max-w-[360px] bg-zinc-950 rounded-[42px] border-4 border-zinc-800 shadow-[0_0_45px_rgba(236,72,153,0.3)] p-3 overflow-hidden ring-1 ring-pink-500/30">
          {/* Top Speaker and Camera Island */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-zinc-900 rounded-full flex items-center justify-center gap-2 border border-zinc-800 z-30">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-cyan-400"></div>
            </div>
            <div className="w-10 h-1 rounded-full bg-zinc-700"></div>
          </div>

          {/* Smartphone Screen Inner */}
          <div className="bg-gradient-to-b from-[#13111c] via-[#0d0c14] to-[#09080e] rounded-[34px] overflow-hidden pt-7 pb-4 px-4 min-h-[600px] flex flex-col justify-between border border-zinc-800/80 relative">
            {/* Status Bar */}
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pb-3 border-b border-zinc-800/40">
              <span className="font-bold text-white flex items-center gap-1">
                <Radio className="w-3 h-3 text-pink-400" />
                iFruit 6G
              </span>
              <div className="flex items-center gap-2 text-zinc-400">
                <Wifi className="w-3 h-3 text-cyan-400" />
                <Signal className="w-3 h-3 text-emerald-400" />
                <span className="flex items-center gap-0.5 text-zinc-300">
                  <Battery className="w-3.5 h-3.5 text-pink-400" />
                  100%
                </span>
              </div>
            </div>

            {/* In-Call Active State Overlay */}
            <AnimatePresence>
              {isCalling ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 flex flex-col justify-between py-6 text-center z-20"
                >
                  <div className="space-y-3">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-500 mx-auto p-1 shadow-[0_0_25px_rgba(236,72,153,0.5)]">
                      <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center">
                        <Phone className="w-8 h-8 text-pink-400 animate-pulse" />
                      </div>
                    </div>

                    <div className="font-mono text-xl font-bold text-white tracking-widest">
                      {dialedNumber}
                    </div>

                    <div className="text-xs font-mono text-cyan-400 animate-pulse uppercase">
                      {callStatus}
                    </div>
                  </div>

                  {activeCheatResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-emerald-950/80 border border-emerald-500/60 rounded-xl p-3 text-left space-y-1 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    >
                      <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold uppercase">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>{activeCheatResult.name}</span>
                      </div>
                      <p className="text-[11px] text-zinc-300">
                        {activeCheatResult.description}
                      </p>
                      <div className="text-[10px] font-mono text-cyan-300 pt-1">
                        Duration: {activeCheatResult.duration}
                      </div>
                    </motion.div>
                  )}

                  <div className="pt-4 flex justify-center">
                    <button
                      onClick={handleEndCall}
                      className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.6)] active:scale-90 transition-all cursor-pointer"
                    >
                      <PhoneOff className="w-7 h-7" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Standard Screen Mode (Keypad / Contacts / Recent) */
                <div className="flex-1 flex flex-col justify-between pt-2">
                  {/* Phone Header Navigation */}
                  <div className="flex rounded-xl bg-zinc-900/90 border border-zinc-800 p-1 mb-3">
                    <button
                      onClick={() => {
                        sound.playToggle();
                        setPhoneTab('keypad');
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer
                        ${phoneTab === 'keypad' ? 'bg-pink-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}
                      `}
                    >
                      <span>Keypad</span>
                    </button>
                    <button
                      onClick={() => {
                        sound.playToggle();
                        setPhoneTab('contacts');
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer
                        ${phoneTab === 'contacts' ? 'bg-pink-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}
                      `}
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Cheats</span>
                    </button>
                    <button
                      onClick={() => {
                        sound.playToggle();
                        setPhoneTab('recent');
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer
                        ${phoneTab === 'recent' ? 'bg-pink-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}
                      `}
                    >
                      <Clock className="w-3 h-3" />
                      <span>History</span>
                    </button>
                  </div>

                  {phoneTab === 'keypad' && (
                    <div className="flex-1 flex flex-col justify-between">
                      {/* Dialed Display */}
                      <div className="h-14 flex items-center justify-between px-2 bg-zinc-950/70 border border-zinc-800/80 rounded-xl mb-3">
                        <div className="font-mono text-lg sm:text-xl font-bold text-cyan-300 tracking-wider overflow-x-auto whitespace-nowrap scrollbar-none">
                          {dialedNumber || <span className="text-zinc-600 font-normal text-sm">Enter 1-999-...</span>}
                        </div>
                        {dialedNumber && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={handleBackspace}
                              aria-label="Backspace"
                              className="p-1.5 text-zinc-400 hover:text-rose-400 cursor-pointer"
                            >
                              <Delete className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 3x4 Grid Dialpad */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                        {keypadButtons.map((btn) => (
                          <motion.button
                            key={btn.num}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => handleDigitPress(btn.num)}
                            className="h-13 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-pink-500/50 hover:bg-zinc-850 flex flex-col items-center justify-center text-white transition-all shadow-sm active:bg-pink-950/60 cursor-pointer"
                          >
                            <span className="font-['Chakra_Petch'] text-xl font-bold leading-none">{btn.num}</span>
                            <span className="text-[9px] font-mono text-zinc-500 tracking-wider uppercase mt-0.5">{btn.sub}</span>
                          </motion.button>
                        ))}
                      </div>

                      {/* Call and Clear Actions */}
                      <div className="flex items-center justify-around pt-3">
                        <button
                          onClick={handleClear}
                          className="px-3 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 cursor-pointer"
                        >
                          Clear
                        </button>

                        <motion.button
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={handleCall}
                          className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-pointer"
                        >
                          <Phone className="w-6 h-6" />
                        </motion.button>

                        <button
                          onClick={() => handleSpeedDial(GTA5_VERIFIED_CHEATS[0])}
                          className="px-3 py-2 rounded-xl text-xs font-mono text-pink-400 hover:text-pink-300 hover:bg-pink-950/40 cursor-pointer"
                        >
                          GodMode
                        </button>
                      </div>
                    </div>
                  )}

                  {phoneTab === 'contacts' && (
                    <div className="flex-1 flex flex-col h-[400px]">
                      <div className="relative mb-2">
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          placeholder="Search cheat contacts..."
                          value={searchContact}
                          onChange={(e) => setSearchContact(e.target.value)}
                          className="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500/60"
                        />
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[350px]">
                        {filteredContacts.map((cheat) => (
                          <div
                            key={cheat.id}
                            className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-2.5 flex items-center justify-between hover:border-pink-500/40 transition-all"
                          >
                            <div className="truncate mr-2">
                              <div className="font-semibold text-xs text-white truncate">{cheat.name}</div>
                              <div className="font-mono text-[10px] text-cyan-400">{cheat.phone}</div>
                            </div>
                            <button
                              onClick={() => handleSpeedDial(cheat)}
                              className="px-2.5 py-1 rounded-lg bg-pink-600/30 hover:bg-pink-600 text-pink-300 hover:text-white text-[10px] font-mono font-bold border border-pink-500/40 transition-all cursor-pointer"
                            >
                              DIAL
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {phoneTab === 'recent' && (
                    <div className="flex-1 flex flex-col h-[400px] overflow-y-auto space-y-2 pr-1">
                      {callHistory.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs font-semibold text-white">{item.cheatName || 'Direct Dial'}</div>
                            <div className="font-mono text-[10px] text-zinc-400">{item.number}</div>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-mono text-zinc-500">{item.timestamp}</span>
                            <div className="mt-1">
                              <button
                                onClick={() => {
                                  setDialedNumber(item.number);
                                  setPhoneTab('keypad');
                                }}
                                className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer"
                              >
                                Redial
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>

            {/* Bottom Home Indicator */}
            <div className="w-28 h-1 bg-zinc-700 rounded-full mx-auto mt-2"></div>
          </div>
        </div>
      </div>

      {/* Right Column: In-Game Phone Cheats Directory & Instructions */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-400" />
              <h2 className="text-xl font-bold text-white font-['Chakra_Petch']">
                IN-GAME CELL PHONE CHEAT SYSTEM
              </h2>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
              DTMF SYNTHESIZED
            </span>
          </div>

          <p className="text-zinc-300 text-sm leading-relaxed">
            In Grand Theft Auto, pull up the in-game cell phone (D-pad UP or Middle Mouse Click), navigate to Contacts, press the keypad toggle (Square on PS / X on Xbox / Space on PC), and dial these verified Rockstar satellite hotline codes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-3">
              <div className="text-xs text-zinc-400 font-mono">1-999 Prefix</div>
              <div className="text-sm font-bold text-pink-400 font-['Chakra_Petch']">Rockstar Hotlines</div>
              <p className="text-[11px] text-zinc-400 mt-1">
                All modern GTA cell cheats start with the 1-999 satellite prefix followed by alphanumeric mnemonic spellings.
              </p>
            </div>

            <div className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-3">
              <div className="text-xs text-zinc-400 font-mono">Audio Synthesizer</div>
              <div className="text-sm font-bold text-cyan-400 font-['Chakra_Petch']">Dual-Tone Multi-Frequency</div>
              <p className="text-[11px] text-zinc-400 mt-1">
                This companion simulates authentic DTMF dual sine oscillators (697Hz-1477Hz) for authentic retro phone feedback.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Speed-Dial Verified Hotlist */}
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-['Chakra_Petch'] flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-emerald-400" />
              <span>VERIFIED SPEED-DIAL HOTCODES</span>
            </h3>
            <span className="text-xs font-mono text-zinc-400">15+ Hotlines</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {GTA5_VERIFIED_CHEATS.slice(0, 10).map((cheat) => (
              <div
                key={cheat.id}
                className="bg-zinc-900/60 border border-zinc-800/80 hover:border-pink-500/50 rounded-xl p-3 flex items-center justify-between transition-all group"
              >
                <div>
                  <div className="font-semibold text-xs text-zinc-100 group-hover:text-pink-300 transition-colors">
                    {cheat.name}
                  </div>
                  <div className="font-mono text-[11px] text-cyan-400 mt-0.5">
                    {cheat.phone}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">
                    Word: {cheat.pcCode}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(cheat.phone)}
                    title="Copy Phone Number"
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer"
                  >
                    {copiedNumber === cheat.phone ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleSpeedDial(cheat)}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/50 text-emerald-300 hover:text-white text-xs font-mono font-bold transition-all cursor-pointer"
                  >
                    LOAD
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cyberpunk partner quick-link strip */}
        <div className="p-4 rounded-xl bg-[#13111c]/90 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="text-zinc-500 uppercase font-bold text-[10px] tracking-wider">
            🛰️ NETWORK ALLIANCE PARTNERS:
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <a
              href={AFFILIATE_LINKS.gamersgate.storefront}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 transition-colors font-bold flex items-center gap-1 hover:underline"
            >
              <span>[🎮 Official PC Store]</span>
            </a>
            <span className="text-zinc-700">|</span>
            <a
              href={AFFILIATE_LINKS.g2a.gift_cards_cash}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold flex items-center gap-1 hover:underline"
            >
              <span>[🎁 Game Gift Cards]</span>
            </a>
            <span className="text-zinc-700">|</span>
            <a
              href={AFFILIATE_LINKS.g2a.summer_vault}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors font-bold flex items-center gap-1 hover:underline"
            >
              <span>[⚡ Mystery Key Vault]</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
