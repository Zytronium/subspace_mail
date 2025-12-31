'use client';
import { useEffect, useState } from 'react';
import { useEmailStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Frame } from '@/components/ui/frame';
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
      <AppFrame className="bg-slate-950 text-white">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-4xl font-bold gradient-text mb-4">Subspace Mail</h1>
            <p className="text-gray-400">Please run in Electron environment</p>
          </div>
        </div>
      </AppFrame>
    );
  }

  if (accounts.length === 0 || showAccountSetup) {
    return (
      <AppFrame>
        <AccountSetup onClose={() => setShowAccountSetup(false)} />
      </AppFrame>
    );
  }

  return (
    <AppFrame className="bg-background text-white">
      {/* Custom Title Bar */}
      <div className="relative h-12 drag-region">
        <Frame
          paths={JSON.parse(
            '[{"show":true,"style":{"strokeWidth":"1","stroke":"rgba(255,255,255,0.1)","fill":"transparent"},"path":[["M","0","100%"],["L","100%","100%"]]}]'
          )}
        >
          <div className="flex items-center justify-between w-full">
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
                variant="success"
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
        </Frame>
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
    </AppFrame>
  );
}
