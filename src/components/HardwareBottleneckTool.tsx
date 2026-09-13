import React, { useState } from 'react';
import { 
  HardDrive, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Monitor, 
  Gauge, 
  Tv, 
  Zap
} from 'lucide-react';
import { sound } from '../utils/soundEngine';
import { AFFILIATE_LINKS } from '../config/affiliates';

interface ConsolePreset {
  id: string;
  name: string;
  totalStorage: number;
  usableStorage: number;
  platform: 'ps5' | 'xbox';
  defaultFree: number;
}

interface GPUSpec {
  id: string;
  name: string;
  vram: number;
  score: number;
  tier: 'Enthusiast' | 'High' | 'Mid' | 'Entry' | 'Bottleneck';
}

interface CPUSpec {
  id: string;
  name: string;
  cores: number;
  score: number;
  tier: 'Enthusiast' | 'High' | 'Mid' | 'Entry';
}

export const HardwareBottleneckTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'console' | 'pc'>('console');

  // CONSOLE ANALYZER STATE
  const consolePresets: ConsolePreset[] = [
    { id: 'ps5_slim', name: 'PlayStation 5 Slim (1TB)', totalStorage: 1000, usableStorage: 848, platform: 'ps5', defaultFree: 220 },
    { id: 'ps5_pro', name: 'PlayStation 5 Pro (2TB)', totalStorage: 2000, usableStorage: 1890, platform: 'ps5', defaultFree: 950 },
    { id: 'ps5_base', name: 'PlayStation 5 (Original 825GB)', totalStorage: 825, usableStorage: 667, platform: 'ps5', defaultFree: 140 },
    { id: 'xbox_x', name: 'Xbox Series X (1TB)', totalStorage: 1000, usableStorage: 802, platform: 'xbox', defaultFree: 210 },
    { id: 'xbox_s', name: 'Xbox Series S (512GB)', totalStorage: 512, usableStorage: 364, platform: 'xbox', defaultFree: 95 },
  ];

  const [selectedConsole, setSelectedConsole] = useState<ConsolePreset>(consolePresets[0]);
  const [currentFreeSpace, setCurrentFreeSpace] = useState<number>(consolePresets[0].defaultFree);
  const [include4KTextures, setInclude4KTextures] = useState<boolean>(false);
  const [includeCaptureBuffer, setIncludeCaptureBuffer] = useState<boolean>(false);

  // GTA 6 Storage Calculations
  const BASE_GTA6_FOOTPRINT = 180; // GB
  const TEXTURE_PACK_FOOTPRINT = include4KTextures ? 45 : 0;
  const BUFFER_FOOTPRINT = includeCaptureBuffer ? 25 : 0;

  const totalRequiredSpace = BASE_GTA6_FOOTPRINT + TEXTURE_PACK_FOOTPRINT + BUFFER_FOOTPRINT;
  const remainingSpaceAfterInstall = currentFreeSpace - totalRequiredSpace;
  const isBottlenecked = remainingSpaceAfterInstall < 0;
  const isTight = !isBottlenecked && remainingSpaceAfterInstall < 45;

  // PC READINESS CHECKER STATE
  const gpuList: GPUSpec[] = [
    { id: 'rtx_4090', name: 'NVIDIA GeForce RTX 4090 (24GB)', vram: 24, score: 100, tier: 'Enthusiast' },
    { id: 'rtx_4080s', name: 'NVIDIA GeForce RTX 4080 Super (16GB)', vram: 16, score: 90, tier: 'Enthusiast' },
    { id: 'rx_7900xtx', name: 'AMD Radeon RX 7900 XTX (24GB)', vram: 24, score: 88, tier: 'Enthusiast' },
    { id: 'rtx_4070ti', name: 'NVIDIA GeForce RTX 4070 Ti Super (16GB)', vram: 16, score: 82, tier: 'High' },
    { id: 'rtx_4070', name: 'NVIDIA GeForce RTX 4070 (12GB)', vram: 12, score: 74, tier: 'High' },
    { id: 'rx_6700xt', name: 'AMD Radeon RX 6700 XT (12GB)', vram: 12, score: 60, tier: 'Mid' },
    { id: 'rtx_4060', name: 'NVIDIA GeForce RTX 4060 (8GB)', vram: 8, score: 52, tier: 'Mid' },
    { id: 'rtx_3060', name: 'NVIDIA GeForce RTX 3060 (12GB)', vram: 12, score: 46, tier: 'Mid' },
    { id: 'rtx_2060', name: 'NVIDIA GeForce RTX 2060 (6GB)', vram: 6, score: 32, tier: 'Entry' },
    { id: 'gtx_1660s', name: 'NVIDIA GeForce GTX 1660 Super (6GB)', vram: 6, score: 22, tier: 'Bottleneck' },
  ];

  const cpuList: CPUSpec[] = [
    { id: 'r7_7800x3d', name: 'AMD Ryzen 7 7800X3D (8-Core 3D V-Cache)', cores: 8, score: 100, tier: 'Enthusiast' },
    { id: 'i9_14900k', name: 'Intel Core i9-14900K (24-Core)', cores: 24, score: 98, tier: 'Enthusiast' },
    { id: 'r7_5800x3d', name: 'AMD Ryzen 7 5800X3D (8-Core)', cores: 8, score: 84, tier: 'High' },
    { id: 'i5_13600k', name: 'Intel Core i5-13600K (14-Core)', cores: 14, score: 80, tier: 'High' },
    { id: 'r5_5600x', name: 'AMD Ryzen 5 5600X (6-Core)', cores: 6, score: 62, tier: 'Mid' },
    { id: 'i5_12400f', name: 'Intel Core i5-12400F (6-Core)', cores: 6, score: 60, tier: 'Mid' },
    { id: 'i5_8400', name: 'Intel Core i5-8400 (6-Core Legacy)', cores: 6, score: 28, tier: 'Entry' },
  ];

  const [selectedGpu, setSelectedGpu] = useState<GPUSpec>(gpuList[3]);
  const [selectedCpu, setSelectedCpu] = useState<CPUSpec>(cpuList[2]);
  const [selectedRam, setSelectedRam] = useState<number>(32);
  const [selectedDriveType, setSelectedDriveType] = useState<'nvme_gen4' | 'sata_ssd' | 'hdd'>('nvme_gen4');

  // PC Performance Calculation
  const calculatePcReadiness = () => {
    const gpuWeight = selectedGpu.score * 0.55;
    const cpuWeight = selectedCpu.score * 0.25;
    const ramScore = selectedRam >= 32 ? 100 : selectedRam >= 16 ? 75 : 30;
    const ramWeight = ramScore * 0.12;
    const driveScore = selectedDriveType === 'nvme_gen4' ? 100 : selectedDriveType === 'sata_ssd' ? 60 : 10;
    const driveWeight = driveScore * 0.08;

    const totalScore = Math.round(gpuWeight + cpuWeight + ramWeight + driveWeight);

    let fpsTarget = '';
    let resolution = '';
    let verdict = '';
    let bottleneckWarning = '';

    if (totalScore >= 85) {
      resolution = '4K (3840x2160) Ultra + Ray Tracing';
      fpsTarget = '75 - 90+ FPS';
      verdict = 'ENTHUSIAST GRADE: ZERO BOTTLENECK';
    } else if (totalScore >= 70) {
      resolution = '1440p (2560x1440) High + Ray Tracing';
      fpsTarget = '60 - 75 FPS';
      verdict = 'HIGH PERFORMANCE: FLUID 60FPS';
    } else if (totalScore >= 50) {
      resolution = '1080p (1920x1080) Medium Quality';
      fpsTarget = '45 - 60 FPS';
      verdict = 'PLAYABLE: BALANCED COMPANION SETUP';
    } else {
      resolution = '1080p Low Settings with Dynamic FSR/DLSS';
      fpsTarget = '28 - 38 FPS';
      verdict = 'BOTTLENECK DETECTED: UPGRADE RECOMMENDED';
    }

    if (selectedRam < 16) {
      bottleneckWarning = 'CRITICAL: 8GB RAM will trigger severe paging stutters in Vice City.';
    } else if (selectedDriveType === 'hdd') {
      bottleneckWarning = 'CRITICAL: Mechanical HDD cannot keep up with RAGE 9 streaming.';
    } else if (selectedGpu.vram < 8) {
      bottleneckWarning = 'WARNING: <8GB VRAM will force low-resolution texture streaming.';
    }

    return { totalScore, fpsTarget, resolution, verdict, bottleneckWarning };
  };

  const pcResults = calculatePcReadiness();

  const handleConsoleChange = (preset: ConsolePreset) => {
    sound.playToggle();
    setSelectedConsole(preset);
    setCurrentFreeSpace(preset.defaultFree);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Mode Switcher */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
              <HardDrive className="w-4 h-4" />
              <span>Diagnostic Hardware Matrix</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Chakra_Petch']">
              180GB STORAGE &amp; PC BOTTLENECK CALCULATOR
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Verify if your PlayStation 5, Xbox Series X|S internal drive or PC rig can install GTA 6 without bottlenecking.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1.5 rounded-2xl bg-zinc-950 border border-zinc-800 gap-1.5 self-start md:self-auto">
            <button
              onClick={() => {
                sound.playToggle();
                setActiveTab('console');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-['Chakra_Petch'] tracking-wide transition-all flex items-center gap-2 cursor-pointer
                ${activeTab === 'console'
                  ? 'bg-cyan-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }
              `}
            >
              <Tv className="w-4 h-4" />
              <span>Console Storage (PS5 / Xbox)</span>
            </button>

            <button
              onClick={() => {
                sound.playToggle();
                setActiveTab('pc');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-['Chakra_Petch'] tracking-wide transition-all flex items-center gap-2 cursor-pointer
                ${activeTab === 'pc'
                  ? 'bg-pink-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }
              `}
            >
              <Monitor className="w-4 h-4" />
              <span>PC FPS Readiness</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: CONSOLE STORAGE ANALYZER */}
      {activeTab === 'console' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Console Configuration */}
            <div className="lg:col-span-2 space-y-6 bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8">
              <div className="space-y-3">
                <label className="text-xs font-mono text-zinc-400 uppercase font-bold flex items-center gap-1.5">
                  <Tv className="w-4 h-4 text-cyan-400" />
                  <span>Select Target Gaming Console:</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {consolePresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleConsoleChange(preset)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between
                        ${selectedConsole.id === preset.id
                          ? 'bg-cyan-950/60 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                          : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700'
                        }
                      `}
                    >
                      <div className="font-bold text-sm text-white font-['Chakra_Petch']">
                        {preset.name}
                      </div>
                      <div className="text-[11px] font-mono text-zinc-400 mt-1 flex items-center justify-between">
                        <span>Factory: {preset.totalStorage}GB</span>
                        <span className="text-cyan-400">Usable: ~{preset.usableStorage}GB</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Free Space Slider */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400 font-bold uppercase">Estimated Free Storage Space:</span>
                  <span className="text-cyan-300 font-bold font-mono text-sm px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                    {currentFreeSpace} GB Free
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={selectedConsole.usableStorage}
                  value={currentFreeSpace}
                  onChange={(e) => setCurrentFreeSpace(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-zinc-950 h-2.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>0 GB (Full Drive)</span>
                  <span>{selectedConsole.usableStorage} GB (Fresh Console)</span>
                </div>
              </div>

              {/* Optional Pack Toggles */}
              <div className="space-y-3 pt-2 border-t border-zinc-800">
                <div className="text-xs font-mono text-zinc-400 uppercase font-bold">
                  Include Optional Content Packs:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 cursor-pointer hover:border-zinc-700">
                    <input
                      type="checkbox"
                      checked={include4KTextures}
                      onChange={(e) => {
                        sound.playToggle();
                        setInclude4KTextures(e.target.checked);
                      }}
                      className="w-4 h-4 accent-pink-500 rounded"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-white">4K High-Res Textures</div>
                      <div className="text-zinc-500 font-mono text-[10px]">+45 GB Footprint</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 cursor-pointer hover:border-zinc-700">
                    <input
                      type="checkbox"
                      checked={includeCaptureBuffer}
                      onChange={(e) => {
                        sound.playToggle();
                        setIncludeCaptureBuffer(e.target.checked);
                      }}
                      className="w-4 h-4 accent-cyan-500 rounded"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-white">4K HDR Gameplay Buffer</div>
                      <div className="text-zinc-500 font-mono text-[10px]">+25 GB Buffer</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Verdict & Gauge */}
            <div className="space-y-6 flex flex-col justify-between bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8">
              <div className="space-y-4">
                <div className="text-xs font-mono text-zinc-400 uppercase font-bold flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-pink-400" />
                  <span>Storage Bottleneck Verdict:</span>
                </div>

                {/* Verdict Box */}
                <div className={`p-4 rounded-2xl border flex items-start gap-3
                  ${isBottlenecked
                    ? 'bg-rose-950/70 border-rose-500 text-rose-300'
                    : isTight
                    ? 'bg-amber-950/70 border-amber-500 text-amber-300'
                    : 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                  }
                `}>
                  {isBottlenecked ? (
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  ) : isTight ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold font-['Chakra_Petch'] text-sm">
                      {isBottlenecked
                        ? 'CRITICAL STORAGE BOTTLENECK'
                        : isTight
                        ? 'CAUTION: TIGHT STORAGE MARGIN'
                        : 'STORAGE READY: AMPLE CAPACITY'}
                    </div>
                    <div className="text-xs mt-1 leading-relaxed opacity-90">
                      {isBottlenecked
                        ? `You are short by ${Math.abs(remainingSpaceAfterInstall)} GB. You must delete existing games or install an M.2 NVMe SSD.`
                        : isTight
                        ? `Only ${remainingSpaceAfterInstall} GB will remain after install. System updates and save files will be constrained.`
                        : `You will have ${remainingSpaceAfterInstall} GB remaining after installing GTA 6's estimated ${totalRequiredSpace} GB footprint.`}
                    </div>
                  </div>
                </div>

                {/* Required vs Available Specs */}
                <div className="space-y-2 pt-2 text-xs font-mono">
                  <div className="flex justify-between py-1.5 border-b border-zinc-800 text-zinc-400">
                    <span>Base GTA 6 Install:</span>
                    <span className="text-white font-bold">{BASE_GTA6_FOOTPRINT} GB</span>
                  </div>
                  {include4KTextures && (
                    <div className="flex justify-between py-1.5 border-b border-zinc-800 text-zinc-400">
                      <span>4K Texture Assets:</span>
                      <span className="text-pink-400 font-bold">+45 GB</span>
                    </div>
                  )}
                  {includeCaptureBuffer && (
                    <div className="flex justify-between py-1.5 border-b border-zinc-800 text-zinc-400">
                      <span>Gameplay Buffer:</span>
                      <span className="text-cyan-400 font-bold">+25 GB</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 text-sm text-white font-bold border-t border-zinc-700">
                    <span>Total Required:</span>
                    <span className="text-pink-400">{totalRequiredSpace} GB</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Contextual Hardware Recommendation */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="text-[11px] font-mono text-pink-400 uppercase flex items-center justify-between font-bold">
                  <span>GAMERSGATE PARTNER PROMO</span>
                  <span className="text-pink-400 font-bold">OFFICIAL KEYS</span>
                </div>
                <div className="space-y-2">
                  <div className="font-bold text-sm text-white font-['Chakra_Petch']">
                    Official PC &amp; Rockstar Games Partner Deals
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Get up to 70% off Grand Theft Auto V, Shark Cards, and upcoming PC editions through our verified storefront alliance.
                  </p>
                  <a
                    href={AFFILIATE_LINKS.gamersgate.storefront}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.4)]"
                  >
                    <span>BROWSE GAMING DEALS ↗</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Dual-Store Savings Block (G2A Discount Vault) */}
              <div className="space-y-3 mt-4">
                <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  ⚡ G2A GOLDMINE DISCOUNT VAULT
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Card 1 */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold mb-1">XBOX KEYS &amp; ACCESS</div>
                      <h4 className="font-bold text-xs text-white font-['Chakra_Petch']">
                        Xbox Game Pass Ultimate &amp; Console Keys
                      </h4>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        Unlock access to hundreds of premium multiplayer matches and launch days at maximum discount.
                      </p>
                    </div>
                    <a
                      href={AFFILIATE_LINKS.g2a.gamepass_ultimate}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      className="w-full py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/50 text-emerald-300 hover:text-white font-mono text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Check Pass Deals ↗</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Card 2 */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-pink-500/50 transition-all flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[10px] font-mono text-pink-400 uppercase font-bold mb-1">PSN WALLET</div>
                      <h4 className="font-bold text-xs text-white font-['Chakra_Petch']">
                        PlayStation Network (PSN) Digital Wallet Cards
                      </h4>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        Securely top-up your PlayStation credit balance for digital games and Day-1 GTA 6 preload preorders.
                      </p>
                    </div>
                    <a
                      href={AFFILIATE_LINKS.g2a.playstation_keys}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      className="w-full py-2 rounded-lg bg-pink-600/20 hover:bg-pink-600 border border-pink-500/50 text-pink-300 hover:text-white font-mono text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Top-Up PSN Wallet ↗</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Card 3 */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold mb-1">G2A PLUS VIP</div>
                      <h4 className="font-bold text-xs text-white font-['Chakra_Petch']">
                        G2A Plus VIP Game Pass (Extra 10% Off)
                      </h4>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        Activate VIP privileges to grab extra discount codes, mystery game keys, and lower service fees.
                      </p>
                    </div>
                    <a
                      href={AFFILIATE_LINKS.g2a.g2a_plus_pass}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      className="w-full py-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 border border-cyan-500/50 text-cyan-300 hover:text-white font-mono text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Get G2A Plus ↗</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PC FPS READINESS CHECKER */}
      {activeTab === 'pc' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Hardware Selectors */}
            <div className="lg:col-span-2 space-y-5 bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8">
              {/* GPU Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 uppercase font-bold flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-pink-400" />
                  <span>Graphics Processing Unit (GPU):</span>
                </label>
                <select
                  value={selectedGpu.id}
                  onChange={(e) => {
                    sound.playToggle();
                    const found = gpuList.find((g) => g.id === e.target.value);
                    if (found) setSelectedGpu(found);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-pink-500 rounded-xl p-3 text-sm text-white font-mono focus:outline-none"
                >
                  {gpuList.map((gpu) => (
                    <option key={gpu.id} value={gpu.id}>
                      {gpu.name} — Tier: {gpu.tier}
                    </option>
                  ))}
                </select>
              </div>

              {/* CPU Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 uppercase font-bold flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Central Processor (CPU):</span>
                </label>
                <select
                  value={selectedCpu.id}
                  onChange={(e) => {
                    sound.playToggle();
                    const found = cpuList.find((c) => c.id === e.target.value);
                    if (found) setSelectedCpu(found);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded-xl p-3 text-sm text-white font-mono focus:outline-none"
                >
                  {cpuList.map((cpu) => (
                    <option key={cpu.id} value={cpu.id}>
                      {cpu.name} — Tier: {cpu.tier}
                    </option>
                  ))}
                </select>
              </div>

              {/* System RAM Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 uppercase font-bold flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>System Memory (RAM):</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[8, 16, 32, 64].map((ramGb) => (
                    <button
                      key={ramGb}
                      onClick={() => {
                        sound.playToggle();
                        setSelectedRam(ramGb);
                      }}
                      className={`py-2.5 rounded-xl border text-center font-mono text-xs font-bold transition-all cursor-pointer
                        ${selectedRam === ramGb
                          ? 'bg-amber-600/30 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                          : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:text-white'
                        }
                      `}
                    >
                      {ramGb} GB RAM
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage Drive Type */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 uppercase font-bold flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-emerald-400" />
                  <span>Storage Medium:</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'nvme_gen4', label: 'PCIe Gen4 NVMe' },
                    { id: 'sata_ssd', label: 'SATA SSD (550MB/s)' },
                    { id: 'hdd', label: 'Mechanical HDD' },
                  ].map((drive) => (
                    <button
                      key={drive.id}
                      onClick={() => {
                        sound.playToggle();
                        setSelectedDriveType(drive.id as any);
                      }}
                      className={`py-2.5 px-2 rounded-xl border text-center font-mono text-[11px] font-bold transition-all cursor-pointer truncate
                        ${selectedDriveType === drive.id
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                          : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:text-white'
                        }
                      `}
                    >
                      {drive.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right PC Performance Breakdown */}
            <div className="space-y-6 flex flex-col justify-between bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400 uppercase font-bold">RAGE 9 Readiness Score</span>
                  <span className="text-2xl font-black font-mono text-pink-400">
                    {pcResults.totalScore}/100
                  </span>
                </div>

                {/* Score Progress Bar */}
                <div className="w-full h-3 rounded-full bg-zinc-950 overflow-hidden border border-zinc-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-pink-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${pcResults.totalScore}%` }}
                  />
                </div>

                {/* Target Resolution & FPS Output */}
                <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 space-y-3">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">Target Resolution:</div>
                    <div className="text-sm font-bold text-white font-['Chakra_Petch']">
                      {pcResults.resolution}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">Estimated Frame Rate:</div>
                    <div className="text-xl font-black text-emerald-400 font-mono">
                      {pcResults.fpsTarget}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">Verdict:</div>
                    <div className="text-xs font-bold font-mono text-pink-300">
                      {pcResults.verdict}
                    </div>
                  </div>
                </div>

                {/* Warning Alert if Bottlenecked */}
                {pcResults.bottleneckWarning && (
                  <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/50 text-amber-300 text-xs font-mono flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{pcResults.bottleneckWarning}</span>
                  </div>
                )}
              </div>

              {/* PC Upgrade Suggestion -> GamersGate Partner promo */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="text-[10px] font-mono text-pink-400 uppercase flex items-center justify-between font-bold">
                  <span>GAMERSGATE EXCLUSIVE PARTNER</span>
                  <span className="text-pink-400 font-bold">PC SAVINGS</span>
                </div>
                <div className="space-y-2">
                  <div className="font-bold text-xs text-white font-['Chakra_Petch']">
                    Official PC &amp; Rockstar Games Partner Deals
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Slam-dunk savings on authorized Rockstar Social Club releases, game packages, and digital items.
                  </p>
                  <a
                    href="https://www.gamersgate.com/?aff=80239c4b86b02d5c9a7afd1b27c31c68417a7f5a"
                    target="_blank"
                    rel="nofollow sponsored"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.4)]"
                  >
                    <span>BROWSE GAMING DEALS ↗</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
