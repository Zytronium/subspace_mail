'use client';

import { useEmailStore } from '@/lib/store';

interface SidebarProps {
  onAddAccount: () => void;
}

export default function Sidebar({ onAddAccount }: SidebarProps) {
  const { accounts, activeAccount, setActiveAccount, setIsComposing } = useEmailStore();

  return (
    <div className="w-64 bg-black/20 border-r border-white/10 flex flex-col">
      {/* Compose Button */}
      <div className="p-4">
        <button
          onClick={() => setIsComposing(true)}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Compose
        </button>
      </div>

      {/* Folders */}
      <div className="flex-1 overflow-y-auto px-2">
        <div className="mb-4">
          <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Folders
          </div>
          {[
            { name: 'Inbox', icon: '📥', count: 12 },
            { name: 'Starred', icon: '⭐', count: 3 },
            { name: 'Sent', icon: '📤', count: 45 },
            { name: 'Drafts', icon: '📝', count: 2 },
            { name: 'Spam', icon: '🚫', count: 8 },
            { name: 'Trash', icon: '🗑️', count: 15 },
          ].map((folder) => (
            <button
              key={folder.name}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 transition group"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{folder.icon}</span>
                <span className="text-sm font-medium">{folder.name}</span>
              </div>
              {folder.count > 0 && (
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                  {folder.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Accounts */}
        <div className="mb-4">
          <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Accounts
          </div>
          {accounts.map((account) => (
            <button
              key={account.id}
              onClick={() => setActiveAccount(account)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                activeAccount?.id === account.id
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'hover:bg-white/10'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                {account.email[0].toUpperCase()}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <div className="text-sm font-medium truncate">{account.name || account.email}</div>
                <div className="text-xs text-gray-400 truncate">{account.type}</div>
              </div>
            </button>
          ))}

          <button
            onClick={onAddAccount}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition mt-2"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-sm font-medium">Add Account</span>
          </button>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-gray-400">
          {activeAccount ? (
            <>
              <div className="font-medium text-white mb-1">Connected</div>
              <div className="truncate">{activeAccount.email}</div>
            </>
          ) : (
            'No account selected'
          )}
        </div>
      </div>
    </div>
  );
}
