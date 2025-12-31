'use client';

import { useEmailStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { MenuRoot, MenuTrigger, MenuPositioner, MenuContent, MenuItem } from '@/components/ui/menu';
import { Inbox, Send, Archive, Trash2, Settings, Plus, ChevronDown } from 'lucide-react';
import { router } from "next/dist/client";

interface SidebarProps {
  onAddAccount: () => void;
}

export default function Sidebar({ onAddAccount }: SidebarProps) {
  const { accounts, activeAccount, setActiveAccount, setIsComposing } = useEmailStore();

  const folders = [
    { name: 'Inbox', icon: Inbox, count: 12 },
    { name: 'Sent', icon: Send, count: 0 },
    { name: 'Archive', icon: Archive, count: 45 },
    { name: 'Trash', icon: Trash2, count: 3 },
  ];

  return (
    <div className="w-64 bg-black/40 border-r border-white/10 flex flex-col">
      {/* Account Selector */}
      <div className="p-4 border-b border-white/10">
        <MenuRoot>
          <MenuTrigger className="w-full">
            <div className="flex items-center gap-2 text-left">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                {activeAccount?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {activeAccount?.email || 'No account'}
                </div>
                <div className="text-xs text-gray-400">
                  {activeAccount?.type || 'Select account'}
                </div>
              </div>
            </div>
          </MenuTrigger>

          <MenuPositioner>
            <MenuContent>
              {accounts.map((account) => (
                <MenuItem
                  key={account.id}
                  asChild
                >
                  <div onClick={() => setActiveAccount(account)}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                        {account.email[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate">{account.email}</div>
                        <div className="text-xs text-gray-400">{account.type}</div>
                      </div>
                    </div>
                  </div>
                </MenuItem>
              ))}
              <MenuItem asChild>
                <div onClick={onAddAccount} className="border-t border-white/10 pt-2 mt-2">
                  <Plus className="size-4 mr-2" />
                  Add Account
                </div>
              </MenuItem>
            </MenuContent>
          </MenuPositioner>
        </MenuRoot>
      </div>

      {/* Compose Button */}
      <div className="p-4">
        <Button
          variant="default"
          className="w-full"
          onClick={() => setIsComposing(true)}
        >
          <Plus className="size-4 mr-2" />
          Compose
        </Button>
      </div>

      {/* Folders */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 space-y-1">
          {folders.map((folder) => (
            <button
              key={folder.name}
              className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-white/10 transition group"
            >
              <folder.icon className="size-5 text-blue-400 group-hover:text-blue-300" />
              <span className="flex-1 text-left">{folder.name}</span>
              {folder.count > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                  {folder.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-white/10">
        <Button
          variant="secondary"
          shape="simple"
          className="w-full"
          onClick={() => {window.location.href = "/settings"; router.reload();}}
        >
          <Settings className="size-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
}
