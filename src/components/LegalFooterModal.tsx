import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert, Key, Mail, Scale, Check } from 'lucide-react';
import { sound } from '../utils/soundEngine';

export type LegalTab = 'privacy' | 'disclaimer' | 'contact';

interface LegalFooterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: LegalTab;
  setActiveTab: (tab: LegalTab) => void;
}

export const LegalFooterModal: React.FC<LegalFooterModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        sound.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const tabs = [
    {
      id: 'privacy' as LegalTab,
      label: 'Privacy Policy',
      icon: Key,
      color: 'text-pink-400 border-pink-500/30',
      activeColor: 'bg-pink-500/10 text-pink-400 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)]',
    },
    {
      id: 'disclaimer' as LegalTab,
      label: 'Affiliate & Fair Use',
      icon: ShieldAlert,
      color: 'text-cyan-400 border-cyan-500/30',
      activeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    },
    {
      id: 'contact' as LegalTab,
      label: 'Contact & DMCA',
      icon: Mail,
      color: 'text-emerald-400 border-emerald-500/30',
      activeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
            className="relative w-full max-w-2xl bg-[#0d0c12]/95 border-2 border-zinc-800 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(236,72,153,0.15)] flex flex-col max-h-[85vh]"
          >
            {/* Holographic Header Line */}
            <div className="h-1 w-full bg-gradient-to-r from-pink-500 via-cyan-400 to-emerald-400 animate-pulse" />

            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-pink-400 animate-pulse" />
                <h3 className="text-lg font-bold text-white font-['Chakra_Petch'] uppercase tracking-wider">
                  LEGAL COMPLIANCE PORTAL
                </h3>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-pink-500 hover:bg-pink-500/10 transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive Tabs Strip */}
            <div className="px-5 sm:px-6 pt-4 pb-2 border-b border-zinc-800/40 bg-zinc-950/40 flex gap-2 overflow-x-auto scrollbar-none">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveTab(tab.id);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase border cursor-pointer transition-all shrink-0 ${
                      isActive ? tab.activeColor : 'bg-zinc-900/55 text-zinc-400 border-zinc-800/85 hover:text-zinc-200 hover:bg-zinc-800/40'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm text-zinc-300 font-sans leading-relaxed">
              <AnimatePresence mode="wait">
                {activeTab === 'privacy' && (
                  <motion.div
                    key="privacy"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-xl bg-pink-500/5 border border-pink-500/20">
                      <h4 className="text-sm font-bold text-pink-400 font-['Chakra_Petch'] uppercase tracking-wider mb-2">
                        PRIVACY &amp; DATA HARVESTING REPORT
                      </h4>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        We prioritize absolute user privacy and data security. The GTA VI Launch Engine operates fully transparently in the client-side context.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-emerald-400" />
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs block font-mono uppercase">Zero Personal Data Collection</span>
                          <span className="text-xs text-zinc-400">We do not solicit, harvest, transmit, or store any personal data, emails (except explicit support communications), ip addresses, or user identifiers.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-emerald-400" />
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs block font-mono uppercase">Standard Analytics Cookies</span>
                          <span className="text-xs text-zinc-400">We utilize standard, secure web analytics cookies to inspect generalized traffic performance metrics (such as geographical region distribution, browser agent types, and overall conversion volumes) to improve utility response rates.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-emerald-400" />
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs block font-mono uppercase">Third-Party Storefront Navigation</span>
                          <span className="text-xs text-zinc-400">When navigating external partner storefronts (GamersGate, G2A) via embedded inventory links, those merchant channels apply their own transactional, referral, and security cookies. Refer to their standard terms for details.</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'disclaimer' && (
                  <motion.div
                    key="disclaimer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-4 font-sans"
                  >
                    <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                      <h4 className="text-sm font-bold text-cyan-400 font-['Chakra_Petch'] uppercase tracking-wider mb-2">
                        AFFILIATE &amp; FAIR USE DISCLAIMER
                      </h4>
                      <p className="text-xs text-zinc-200 leading-relaxed font-semibold">
                        This website is a fan-made utility companion and is NOT affiliated with, sponsored by, or endorsed by Rockstar Games or Take-Two Interactive. All GTA trademarks belong to their respective owners. We may earn a merchant commission from qualifying purchases via partner links (GamersGate, G2A) at zero extra cost to the user.
                      </p>
                    </div>

                    <div className="space-y-3 text-xs text-zinc-400 leading-relaxed">
                      <p>
                        All game titles, characters, images, publisher logos, soundscapes, and references remain the exclusive intellectual properties of their respective registered title holders. The GTA Companion Hub uses references strictly for educational, informational, and enthusiast-driven fan utility purposes under standard Fair Use doctrines.
                      </p>
                      <p>
                        Referral connections to digital key platforms (GamersGate and G2A) are implemented via authorized affiliate partner platforms. Purchases made on those independent portals help fund our independent server hosting costs.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'contact' && (
                  <motion.div
                    key="contact"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                      <h4 className="text-sm font-bold text-emerald-400 font-['Chakra_Petch'] uppercase tracking-wider mb-2">
                        CONTACT &amp; DMCA INQUIRIES
                      </h4>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        For intellectual property clearances, copyright compliance notices, cheat code revision suggestions, or custom engine optimization queries, contact our lead companion engineer at our official registry node:
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#111] border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                          <Mail className="w-5 h-5 animate-pulse" />
                        </div>
                        <div className="text-center sm:text-left">
                          <div className="text-xs text-zinc-400 font-mono">SUPPORT &amp; INTAKE INBOX</div>
                          <div className="font-bold font-mono text-sm text-emerald-300 selection:bg-emerald-500 selection:text-white">
                            bestworking3@gmail.com
                          </div>
                        </div>
                      </div>
                      <a
                        href="mailto:bestworking3@gmail.com"
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-mono font-bold text-xs text-white uppercase flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                      >
                        <span>Send Transmission</span>
                      </a>
                    </div>

                    <div className="text-xs text-zinc-500 leading-relaxed">
                      <span className="font-bold text-zinc-400 block mb-1">DMCA Notice Handling:</span>
                      We respect intellectual property rights. If you identify any asset or metadata published in error, please transmit a formal request containing details of the original copyright, and our engineers will verify and remove the content within 48 business hours.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Action */}
            <div className="p-4 sm:p-5 border-t border-zinc-800/80 bg-zinc-950/60 flex items-center justify-end">
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-pink-600 hover:to-cyan-500 border border-zinc-800 text-zinc-300 hover:text-white font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-sm hover:shadow-[0_0_20px_rgba(236,72,153,0.35)] cursor-pointer"
              >
                <span>CLOSE ENGINE PORT</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
