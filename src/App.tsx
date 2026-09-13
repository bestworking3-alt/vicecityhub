/**
 * GTA 6 Launch Engine & Companion Hub - Master Application Root
 * @license Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar, NavTabType } from './components/Navbar';
import { LaunchCountdownEngine } from './components/LaunchCountdownEngine';
import { InteractiveCheatSheetEngine } from './components/InteractiveCheatSheetEngine';
import { HardwareBottleneckTool } from './components/HardwareBottleneckTool';
import { InGameCellPhoneDialer } from './components/InGameCellPhoneDialer';
import { Footer } from './components/Footer';
import { LegalFooterModal, LegalTab } from './components/LegalFooterModal';

const VALID_TABS: NavTabType[] = ['launch', 'cheats', 'dialer', 'ssd'];

export default function App() {
  // Parse initial tab from URL hash with fallback to 'launch'
  const getTabFromHash = (): NavTabType => {
    if (typeof window === 'undefined') return 'launch';
    const hash = window.location.hash.replace('#', '').toLowerCase() as NavTabType;
    return VALID_TABS.includes(hash) ? hash : 'launch';
  };

  const [activeTab, setActiveTabState] = useState<NavTabType>(getTabFromHash);
  const [dialerPreloadNumber, setDialerPreloadNumber] = useState<string>('');
  
  // Compliance modal states
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState<LegalTab>('privacy');

  // Synchronize state changes with URL hash and browser history
  const setActiveTab = useCallback((tab: NavTabType) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      if (window.location.hash !== `#${tab}`) {
        window.history.pushState(null, '', `#${tab}`);
      }
    }
  }, []);

  // Listen to browser Back / Forward buttons (popstate & hashchange)
  useEffect(() => {
    const handleHashChange = () => {
      const currentTab = getTabFromHash();
      setActiveTabState(currentTab);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    // Initial hash sync if root URL loaded with empty hash
    if (!window.location.hash) {
      window.history.replaceState(null, '', '#launch');
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Persistent bridge to route dialed numbers directly to the cell phone dialer tab
  const handleSendToDialer = (phoneNumber: string) => {
    setDialerPreloadNumber(phoneNumber);
    setActiveTab('dialer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 flex flex-col justify-between selection:bg-pink-500 selection:text-white font-['Outfit',sans-serif]">
      {/* Top Cyber Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container with Smooth Motion Transitions */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex-1 w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'launch' && (
            <motion.div
              key="launch"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            >
              <LaunchCountdownEngine
                onNavigateToCheats={() => setActiveTab('cheats')}
                onNavigateToDialer={() => setActiveTab('dialer')}
                onNavigateToSSD={() => setActiveTab('ssd')}
              />
            </motion.div>
          )}

          {activeTab === 'cheats' && (
            <motion.div
              key="cheats"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            >
              <InteractiveCheatSheetEngine
                onSendToDialer={handleSendToDialer}
                affiliateTag="YOUR_TAG_HERE"
              />
            </motion.div>
          )}

          {activeTab === 'dialer' && (
            <motion.div
              key="dialer"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            >
              <InGameCellPhoneDialer initialDialNumber={dialerPreloadNumber} />
            </motion.div>
          )}

          {activeTab === 'ssd' && (
            <motion.div
              key="ssd"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            >
              <HardwareBottleneckTool />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Cyberpunk Footer with Deeplink Hashes and Full Legal Non-Affiliation Disclaimers */}
      <Footer
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLegalTab={(tab) => {
          setActiveLegalTab(tab);
          setIsLegalOpen(true);
        }}
      />

      {/* Interactive Compliance Portal Modal */}
      <LegalFooterModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        activeTab={activeLegalTab}
        setActiveTab={setActiveLegalTab}
      />
    </div>
  );
}
