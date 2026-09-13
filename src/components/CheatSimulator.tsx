import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Gamepad2, 
  Star, 
  Copy, 
  Check, 
  Phone, 
  Terminal, 
  Play, 
  RotateCcw, 
  ShieldAlert, 
  Sparkles, 
  Flame, 
  Crosshair, 
  Car, 
  Zap, 
  Compass,
  CheckCircle2,
  AlertTriangle,
  Send
} from 'lucide-react';
import { GTA5_VERIFIED_CHEATS } from '../data/cheats';
import { GTA5Cheat, ControllerPlatform } from '../types';
import { ControllerButtonBadge } from './ControllerButtonBadge';
import { sound } from '../utils/soundEngine';

interface CheatSimulatorProps {
  onSendToDialer?: (phoneNumber: string) => void;
}

export const CheatSimulator: React.FC<CheatSimulatorProps> = ({ onSendToDialer }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePlatform, setActivePlatform] = useState<ControllerPlatform>('ps5');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gta6_favorite_cheats');
      return saved ? JSON.parse(saved) : ['gta5_god_mode', 'gta5_max_health_armor', 'gta5_spawn_buzzard'];
    } catch {
      return ['gta5_god_mode', 'gta5_max_health_armor'];
    }
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Interactive Virtual Gamepad Simulator State
  const [targetCheatForTesting, setTargetCheatForTesting] = useState<GTA5Cheat | null>(GTA5_VERIFIED_CHEATS[0]);
  const [currentInputSequence, setCurrentInputSequence] = useState<string[]>([]);
  const [simulatorStatus, setSimulatorStatus] = useState<'idle' | 'in_progress' | 'success' | 'failed'>('idle');

  const categories = [
    'All',
    'Favorites',
    'Combat & Survival',
    'Police & Wanted',
    'Vehicles & Aircraft',
    'Player Perks',
    'World & Physics',
  ];

  const toggleFavorite = (id: string) => {
    sound.playToggle();
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('gta6_favorite_cheats', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleCopyCode = (cheat: GTA5Cheat) => {
    sound.playClick();
    let textToCopy = '';
    if (activePlatform === 'ps5') textToCopy = cheat.ps5.join(' - ');
    else if (activePlatform === 'xbox') textToCopy = cheat.xbox.join(' - ');
    else if (activePlatform === 'phone') textToCopy = cheat.phone;
    else textToCopy = cheat.pcCode;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(cheat.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Interactive Controller Input Tester
  const handleVirtualButtonPress = (btn: string) => {
    if (!targetCheatForTesting) return;

    sound.playButtonTone(activePlatform === 'ps5' ? 560 : 620);
    const newSeq = [...currentInputSequence, btn];
    setCurrentInputSequence(newSeq);

    const expectedSeq = activePlatform === 'ps5' ? targetCheatForTesting.ps5 : targetCheatForTesting.xbox;

    // Check if current sequence matches target so far
    let isMatching = true;
    for (let i = 0; i < newSeq.length; i++) {
      if (newSeq[i] !== expectedSeq[i]) {
        isMatching = false;
        break;
      }
    }

    if (!isMatching) {
      sound.playError();
      setSimulatorStatus('failed');
      setTimeout(() => {
        setCurrentInputSequence([]);
        setSimulatorStatus('idle');
      }, 1000);
    } else if (newSeq.length === expectedSeq.length) {
      sound.playCheatSuccess();
      setSimulatorStatus('success');
    } else {
      setSimulatorStatus('in_progress');
    }
  };

  const resetSimulator = () => {
    sound.playClick(350, 200);
    setCurrentInputSequence([]);
    setSimulatorStatus('idle');
  };

  const selectCheatForPractice = (cheat: GTA5Cheat) => {
    sound.playClick(700, 400);
    setTargetCheatForTesting(cheat);
    setCurrentInputSequence([]);
    setSimulatorStatus('idle');
    // Scroll smoothly to simulator pad
    document.getElementById('virtual-gamepad-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredCheats = GTA5_VERIFIED_CHEATS.filter((cheat) => {
    const matchesSearch =
      cheat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cheat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cheat.pcCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cheat.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cheat.phone.includes(searchQuery);

    if (!matchesSearch) return false;

    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Favorites') return favorites.includes(cheat.id);
    return cheat.category === selectedCategory;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Controls */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-pink-400 text-xs font-mono uppercase tracking-wider mb-1">
              <Gamepad2 className="w-4 h-4" />
              <span>Full Verified Database (15+ Codes)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Chakra_Petch']">
              GTA 5 & 6 CHEAT CODES REPOSITORY
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Cross-platform button combinations with PS5 DualSense, Xbox Series X, In-Game Phone Hotline & PC console commands.
            </p>
          </div>

          {/* Platform Switcher Buttons */}
          <div className="flex items-center p-1.5 rounded-xl bg-zinc-950 border border-zinc-800 gap-1">
            <button
              onClick={() => {
                sound.playToggle();
                setActivePlatform('ps5');
                resetSimulator();
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer
                ${activePlatform === 'ps5' 
                  ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }
              `}
            >
              <span>PS5 / PS4</span>
            </button>

            <button
              onClick={() => {
                sound.playToggle();
                setActivePlatform('xbox');
                resetSimulator();
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer
                ${activePlatform === 'xbox' 
                  ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }
              `}
            >
              <span>XBOX</span>
            </button>

            <button
              onClick={() => {
                sound.playToggle();
                setActivePlatform('phone');
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer
                ${activePlatform === 'phone' 
                  ? 'bg-pink-600 text-white shadow-[0_0_12px_rgba(236,72,153,0.5)]' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }
              `}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>PHONE</span>
            </button>

            <button
              onClick={() => {
                sound.playToggle();
                setActivePlatform('pc');
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer
                ${activePlatform === 'pc' 
                  ? 'bg-cyan-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.5)]' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }
              `}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>PC</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Category Filter Pills */}
        <div className="space-y-4 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by cheat name (e.g. God Mode, Buzzard, Comet, Weapons), PC word, or hotline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500/80 focus:ring-1 focus:ring-pink-500/50 transition-all font-mono"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sound.playToggle();
                  setSelectedCategory(cat);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer
                  ${selectedCategory === cat
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-[0_0_12px_rgba(236,72,153,0.4)]'
                    : 'bg-zinc-950/60 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                  }
                `}
              >
                {cat === 'Favorites' && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Virtual Controller Practice Pad */}
      <div 
        id="virtual-gamepad-section"
        className="bg-gradient-to-br from-zinc-950 via-[#0e0d16] to-[#0a0a0c] border border-pink-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_0_30px_rgba(236,72,153,0.15)] relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-pink-500 animate-ping"></div>
            <h3 className="text-lg font-bold text-white font-['Chakra_Petch'] flex items-center gap-2">
              <span>LIVE CONTROLLER SIMULATOR & COMBO TRAINER</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-500/40">
                ACTIVE: {targetCheatForTesting?.name.toUpperCase()}
              </span>
            </h3>
          </div>

          <button
            onClick={resetSimulator}
            className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET INPUTS</span>
          </button>
        </div>

        {/* Target Sequence vs Current Sequence Comparison */}
        {targetCheatForTesting && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 sm:p-5">
            <div>
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                Expected Sequence ({activePlatform === 'ps5' ? 'PS5 / DualSense' : activePlatform === 'xbox' ? 'Xbox Series X' : 'Buttons'}):
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {(activePlatform === 'xbox' ? targetCheatForTesting.xbox : targetCheatForTesting.ps5).map((btn, idx) => (
                  <ControllerButtonBadge
                    key={idx}
                    button={btn}
                    platform={activePlatform}
                    size="md"
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Your Real-Time Input Sequence:</span>
                <span className="text-[10px]">
                  {currentInputSequence.length} / {(activePlatform === 'xbox' ? targetCheatForTesting.xbox : targetCheatForTesting.ps5).length}
                </span>
              </div>
              <div className="min-h-[38px] flex flex-wrap items-center gap-1.5 p-2 bg-zinc-950/80 rounded-lg border border-zinc-800">
                {currentInputSequence.length === 0 ? (
                  <span className="text-xs font-mono text-zinc-600">
                    Tap the virtual controller buttons below to test combination timing...
                  </span>
                ) : (
                  currentInputSequence.map((btn, idx) => (
                    <ControllerButtonBadge
                      key={idx}
                      button={btn}
                      platform={activePlatform}
                      size="sm"
                      isActive={idx === currentInputSequence.length - 1}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Status Alert Banner */}
        <AnimatePresence>
          {simulatorStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/90 to-teal-950/90 border-2 border-emerald-400 text-emerald-200 flex items-center justify-between shadow-[0_0_25px_rgba(16,185,129,0.5)]"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-bounce" />
                <div>
                  <div className="font-bold text-sm font-['Chakra_Petch']">
                    CHEAT CODE ACTIVATED: {targetCheatForTesting?.name}
                  </div>
                  <div className="text-xs text-emerald-300/90">
                    {targetCheatForTesting?.description}
                  </div>
                </div>
              </div>
              <button
                onClick={resetSimulator}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold cursor-pointer"
              >
                TEST NEXT
              </button>
            </motion.div>
          )}

          {simulatorStatus === 'failed' && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3 rounded-xl bg-rose-950/90 border border-rose-500/60 text-rose-200 flex items-center gap-2 text-xs font-mono"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Input sequence mismatch! Auto-resetting controller buffer...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Virtual Gamepad Touchpad / Buttons Palette */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            Interactive Controller Input Palette (Click / Tap to Input):
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-900/70 border border-zinc-800 rounded-xl p-4">
            {/* D-Pad */}
            <div className="space-y-1.5 text-center">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Directional Pad</div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {['UP', 'DOWN', 'LEFT', 'RIGHT'].map((btn) => (
                  <ControllerButtonBadge
                    key={btn}
                    button={btn}
                    platform={activePlatform}
                    size="md"
                    interactive
                    onPress={handleVirtualButtonPress}
                  />
                ))}
              </div>
            </div>

            {/* Face Buttons */}
            <div className="space-y-1.5 text-center">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Action Face Buttons</div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {(activePlatform === 'ps5'
                  ? ['CROSS', 'CIRCLE', 'SQUARE', 'TRIANGLE']
                  : ['A', 'B', 'X', 'Y']
                ).map((btn) => (
                  <ControllerButtonBadge
                    key={btn}
                    button={btn}
                    platform={activePlatform}
                    size="md"
                    interactive
                    onPress={handleVirtualButtonPress}
                  />
                ))}
              </div>
            </div>

            {/* Bumpers & Triggers */}
            <div className="space-y-1.5 text-center">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Shoulders & Triggers</div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {(activePlatform === 'ps5'
                  ? ['L1', 'R1', 'L2', 'R2']
                  : ['LB', 'RB', 'LT', 'RT']
                ).map((btn) => (
                  <ControllerButtonBadge
                    key={btn}
                    button={btn}
                    platform={activePlatform}
                    size="md"
                    interactive
                    onPress={handleVirtualButtonPress}
                  />
                ))}
              </div>
            </div>

            {/* Thumbsticks */}
            <div className="space-y-1.5 text-center">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Thumbsticks</div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {(activePlatform === 'ps5' ? ['L3', 'R3'] : ['LS', 'RS']).map((btn) => (
                  <ControllerButtonBadge
                    key={btn}
                    button={btn}
                    platform={activePlatform}
                    size="md"
                    interactive
                    onPress={handleVirtualButtonPress}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cheats Card Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-mono text-zinc-400">
            Showing <span className="text-white font-bold">{filteredCheats.length}</span> verified cheat codes
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCheats.map((cheat) => {
            const isFav = favorites.includes(cheat.id);
            const isTarget = targetCheatForTesting?.id === cheat.id;

            return (
              <motion.div
                key={cheat.id}
                layout
                className={`bg-zinc-900/80 border rounded-2xl p-5 space-y-4 transition-all hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]
                  ${isTarget ? 'border-pink-500/80 ring-1 ring-pink-500/40 bg-zinc-900' : 'border-zinc-800 hover:border-zinc-700'}
                `}
              >
                {/* Top card bar */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-zinc-950 border border-zinc-700 text-zinc-300">
                        {cheat.category}
                      </span>
                      <span className="text-[11px] font-mono text-cyan-400">
                        ⏱ {cheat.duration}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white font-['Chakra_Petch'] mt-1">
                      {cheat.name}
                    </h4>
                  </div>

                  <button
                    onClick={() => toggleFavorite(cheat.id)}
                    aria-label="Bookmark cheat"
                    className="p-1.5 rounded-lg bg-zinc-950/80 border border-zinc-800 hover:border-amber-400 text-zinc-400 hover:text-amber-400 transition-all cursor-pointer"
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'text-amber-400 fill-amber-400' : ''}`} />
                  </button>
                </div>

                <p className="text-zinc-300 text-sm leading-relaxed">
                  {cheat.description}
                </p>

                {cheat.warning && (
                  <div className="text-[11px] font-mono text-amber-300/90 bg-amber-950/30 border border-amber-500/30 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{cheat.warning}</span>
                  </div>
                )}

                {/* Platform specific code representation */}
                <div className="space-y-2 pt-1 border-t border-zinc-800/80">
                  {activePlatform === 'ps5' && (
                    <div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase mb-1.5">PS5 / PS4 Button String:</div>
                      <div className="flex flex-wrap items-center gap-1">
                        {cheat.ps5.map((btn, idx) => (
                          <ControllerButtonBadge
                            key={idx}
                            button={btn}
                            platform="ps5"
                            size="sm"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {activePlatform === 'xbox' && (
                    <div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase mb-1.5">Xbox Series X|S Button String:</div>
                      <div className="flex flex-wrap items-center gap-1">
                        {cheat.xbox.map((btn, idx) => (
                          <ControllerButtonBadge
                            key={idx}
                            button={btn}
                            platform="xbox"
                            size="sm"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {activePlatform === 'phone' && (
                    <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-800">
                      <div>
                        <div className="text-[10px] font-mono text-zinc-500">In-Game Satellite Hotline</div>
                        <div className="font-mono text-sm font-bold text-pink-400">{cheat.phone}</div>
                      </div>
                      {onSendToDialer && (
                        <button
                          onClick={() => {
                            sound.playClick();
                            onSendToDialer(cheat.phone);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-pink-600/30 hover:bg-pink-600 text-pink-300 hover:text-white border border-pink-500/40 text-xs font-mono flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Send className="w-3 h-3" />
                          <span>SEND TO DIALER</span>
                        </button>
                      )}
                    </div>
                  )}

                  {activePlatform === 'pc' && (
                    <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-800">
                      <div>
                        <div className="text-[10px] font-mono text-zinc-500">PC Console Command (~ key)</div>
                        <div className="font-mono text-sm font-bold text-cyan-400">{cheat.pcCode}</div>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">Type in Dev Console</span>
                    </div>
                  )}
                </div>

                {/* Bottom Card Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => selectCheatForPractice(cheat)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-pink-500/40 hover:bg-pink-950/40 text-pink-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                    <span>PRACTICE IN SIMULATOR</span>
                  </button>

                  <button
                    onClick={() => handleCopyCode(cheat)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedId === cheat.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
