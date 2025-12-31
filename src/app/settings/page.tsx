'use client';

import { useEmailStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { SwitchRoot, SwitchControl, SwitchThumb, SwitchLabel, SwitchHiddenInput } from '@/components/ui/switch';
import { AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { App_frame as AppFrame } from '@/components/ui/app_frame';
import { Mail, Palette, Info, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function Settings() {
  const { accounts, removeAccount } = useEmailStore();
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      <AppFrame className="opacity-20" />

      <div className="relative z-10 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="secondary" className="px-3 py-2">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold gradient-text">Settings</h1>
          </div>

          <AccordionRoot collapsible className="space-y-4">
            {/* Accounts Section */}
            <AccordionItem value="accounts">
              <AccordionTrigger>
                <Mail className="size-5 mr-2" />
                Accounts
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-4">
                  {accounts.length === 0 ? (
                    <p className="text-gray-400">No accounts configured</p>
                  ) : (
                    accounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            {account.email[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{account.email}</div>
                            <div className="text-sm text-gray-400 capitalize">
                              {account.type}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => removeAccount(account.id)}
                          className="px-4 py-2"
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Appearance Section */}
            <AccordionItem value="appearance">
              <AccordionTrigger>
                <Palette className="size-5 mr-2" />
                Appearance
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <SwitchRoot checked={darkMode} onCheckedChange={(e) => setDarkMode(e.checked)}>
                    <SwitchControl>
                      <SwitchThumb />
                    </SwitchControl>
                    <SwitchLabel>
                      <div>
                        <div className="font-medium">Dark Mode</div>
                        <div className="text-sm text-gray-400">
                          {darkMode ? 'Currently active' : 'Currently inactive'}
                        </div>
                      </div>
                    </SwitchLabel>
                    <SwitchHiddenInput />
                  </SwitchRoot>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* About Section */}
            <AccordionItem value="about">
              <AccordionTrigger>
                <Info className="size-5 mr-2" />
                About
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm text-gray-400 pt-4">
                  <div>Version 1.0.0</div>
                  <div>Built with Next.js + Electron</div>
                  <div>Powered by Subspace Mail UI Components</div>
                  <div>© 2025 Subspace Mail</div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>
        </div>
      </div>
    </div>
  );
}
