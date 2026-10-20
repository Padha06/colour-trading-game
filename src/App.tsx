import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/views/HomeView';
import { GamesView } from './components/views/GamesView';
import { PromotionView } from './components/views/PromotionView';
import { WalletView } from './components/views/WalletView';
import { AccountView } from './components/views/AccountView';
import { DepositModal } from './components/modals/DepositModal';
import { WithdrawModal } from './components/modals/WithdrawModal';
import { AdminModal } from './components/modals/AdminModal';
import { WinAnnouncementModal } from './components/modals/WinAnnouncementModal';
import { MyBetsModal } from './components/modals/MyBetsModal';

const MainAppContent: React.FC = () => {
  const { activeTab } = useGame();

  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [myBetsOpen, setMyBetsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 flex justify-center">
      {/* Mobile Frame Container (max-w-md on desktop, 100% on mobile) */}
      <div className="w-full max-w-md min-h-screen bg-[#0b1120] flex flex-col shadow-2xl relative border-x border-slate-800/60">
        
        {/* Header */}
        <Header 
          onOpenDeposit={() => setDepositOpen(true)}
          onOpenAdmin={() => setAdminOpen(true)}
          onOpenMyBets={() => setMyBetsOpen(true)}
        />

        {/* Scrollable View Content */}
        <main className="flex-1 p-3.5 overflow-y-auto">
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'games' && <GamesView />}
          {activeTab === 'promotion' && <PromotionView />}
          {activeTab === 'wallet' && (
            <WalletView 
              onOpenDeposit={() => setDepositOpen(true)}
              onOpenWithdraw={() => setWithdrawOpen(true)}
            />
          )}
          {activeTab === 'account' && <AccountView />}
        </main>

        {/* Fixed Bottom Navigation Buttons */}
        <BottomNav />

        {/* Global Modals */}
        <DepositModal 
          isOpen={depositOpen} 
          onClose={() => setDepositOpen(false)} 
        />
        
        <WithdrawModal 
          isOpen={withdrawOpen} 
          onClose={() => setWithdrawOpen(false)} 
        />
        
        <AdminModal 
          isOpen={adminOpen} 
          onClose={() => setAdminOpen(false)} 
        />

        <MyBetsModal 
          isOpen={myBetsOpen}
          onClose={() => setMyBetsOpen(false)}
        />

        <WinAnnouncementModal />
      </div>
    </div>
  );
};

export function App() {
  return (
    <GameProvider>
      <MainAppContent />
    </GameProvider>
  );
}

export default App;
