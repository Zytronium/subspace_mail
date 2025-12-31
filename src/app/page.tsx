'use client';

import { useEffect, useState } from 'react';
import { useEmailStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/Sidebar';
import EmailList from '@/components/EmailList';
import EmailViewer from '@/components/EmailViewer';
import Compose from '@/components/Compose';
import AccountSetup from '@/components/AccountSetup';
import { App_frame as AppFrame } from '@/components/ui/app_frame';

export default function Home() {
  const {
    accounts,
    activeAccount,
    selectedEmail,
    isComposing,
    loadAccounts,
    fetchEmails,
    setIsComposing,
  } = useEmailStore();

  const [showAccountSetup, setShowAccountSetup] = useState(false);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    setIsElectron(typeof window !== 'undefined' && !!window.electron);
    loadAccounts();
  }, [loadAccounts]);

  useEffect(() => {
    if (activeAccount && isElectron) {
      fetchEmails();
    }
  }, [activeAccount, fetchEmails, isElectron]);

  if (!isElectron) {
    return (
      <div className="relative flex items-center justify-center h-screen bg-slate-950 text-white overflow-hidden">
        <AppFrame className="opacity-30" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold gradient-text mb-4">Subspace Mail</h1>
          <p className="text-gray-400">Please run in Electron environment</p>
        </div>
      </div>
    );
  }

  if (accounts.length === 0 || showAccountSetup) {
    return (
      <div className="relative h-screen overflow-hidden">
        <AppFrame className="opacity-20" />
        <AccountSetup onClose={() => setShowAccountSetup(false)} />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-screen bg-slate-950 text-white overflow-hidden">
      {/* Full window animated frame background */}
      <AppFrame className="opacity-20" />

      {/* Content layer - relative z-index to appear above frame */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Custom Title Bar */}
        <div className="flex items-center justify-between h-12 px-4 bg-black/40 border-b border-white/10 drag-region">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-sm font-bold">SM</span>
            </div>
            <span className="text-sm font-semibold">Subspace Mail</span>
          </div>

          <div className="flex items-center gap-2 no-drag">
            <Button
              shape="flat"
              variant="secondary"
              onClick={() => window.electron.window.minimize()}
              className="w-8 h-8 p-0 text-xl flex items-center justify-center"
            >
              −
            </Button>
            <Button
              shape="flat"
              variant="secondary"
              onClick={() => window.electron.window.maximize()}
              className="w-8 h-8 p-0 text-xl flex items-center justify-center"
            >
              □
            </Button>
            <Button
              shape="flat"
              variant="destructive"
              onClick={() => window.electron.window.close()}
              className="w-8 h-8 p-0 text-xl flex items-center justify-center"
            >
              ×
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar onAddAccount={() => setShowAccountSetup(true)} />
          <EmailList />
          {isComposing ? (
            <Compose onClose={() => setIsComposing(false)} />
          ) : (
            <EmailViewer email={selectedEmail} />
          )}
        </div>
      </div>
    </div>
  );
}
