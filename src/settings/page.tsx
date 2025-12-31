'use client';

import { useEmailStore } from '@/lib/store';

export default function Settings() {
  const { accounts, removeAccount } = useEmailStore();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold gradient-text mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Accounts Section */}
          <section className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Accounts</h2>
            <div className="space-y-3">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      {account.email[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{account.email}</div>
                      <div className="text-sm text-gray-400">{account.type}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeAccount(account.id)}
                    className="px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Appearance Section */}
          <section className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Appearance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Dark Mode</div>
                  <div className="text-sm text-gray-400">Currently active</div>
                </div>
                <div className="w-12 h-6 bg-blue-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <div className="space-y-2 text-sm text-gray-400">
              <div>Version 1.0.0</div>
              <div>Built with Next.js + Electron</div>
              <div>© 2025 Subspace Mail</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
