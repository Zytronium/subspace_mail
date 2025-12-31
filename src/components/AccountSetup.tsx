'use client';

import { useState } from 'react';
import { useEmailStore } from '@/lib/store';
import type { Account, ImapConfig } from '@/lib/types';

interface AccountSetupProps {
  onClose: () => void;
}

export default function AccountSetup({ onClose }: AccountSetupProps) {
  const { addAccount, saveAccounts } = useEmailStore();
  const [accountType, setAccountType] = useState<'gmail' | 'outlook' | 'yahoo' | 'imap'>('gmail');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // IMAP form state
  const [imapConfig, setImapConfig] = useState<ImapConfig>({
    host: '',
    port: 993,
    user: '',
    password: '',
    tls: true,
    smtpHost: '',
    smtpPort: 587,
    smtpSecure: false,
  });

  const handleOAuthSetup = async (type: 'gmail' | 'outlook' | 'yahoo') => {
    setLoading(true);
    setError(null);

    try {
      let result;

      switch (type) {
        case 'gmail':
          result = await window.electron.gmail.authenticate();
          break;
        case 'outlook':
          result = await window.electron.outlook.authenticate();
          break;
        case 'yahoo':
          result = await window.electron.yahoo.authenticate();
          break;
      }

      if (result.success) {
        const newAccount: Account = {
          id: `${type}-${Date.now()}`,
          type,
          email: 'user@example.com', // Would come from OAuth response
          isActive: true,
        };

        addAccount(newAccount);
        await saveAccounts();
        onClose();
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const handleImapSetup = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await window.electron.imap.connect(imapConfig);

      if (result.success) {
        const newAccount: Account = {
          id: `imap-${Date.now()}`,
          type: 'imap',
          email: imapConfig.user,
          isActive: true,
          config: imapConfig,
        };

        addAccount(newAccount);
        await saveAccounts();
        onClose();
      } else {
        setError(result.error || 'Connection failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 p-8">
      <div className="w-full max-w-2xl glass rounded-2xl p-8 animate-fade-in">
        <h1 className="text-3xl font-bold gradient-text mb-2">Add Email Account</h1>
        <p className="text-gray-400 mb-8">Connect your email account to get started</p>

        {/* Account Type Selector */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { type: 'gmail', name: 'Gmail', icon: '📧' },
            { type: 'outlook', name: 'Outlook', icon: '📨' },
            { type: 'yahoo', name: 'Yahoo', icon: '📬' },
            { type: 'imap', name: 'Custom', icon: '⚙️' },
          ].map((option) => (
            <button
              key={option.type}
              onClick={() => setAccountType(option.type as any)}
              className={`p-4 rounded-xl border-2 transition ${
                accountType === option.type
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="text-4xl mb-2">{option.icon}</div>
              <div className="text-sm font-medium">{option.name}</div>
            </button>
          ))}
        </div>

        {/* Setup Forms */}
        {accountType !== 'imap' ? (
          <div className="space-y-4">
            <div className="glass-dark rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">
                {accountType.charAt(0).toUpperCase() + accountType.slice(1)} Authentication
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Click below to authenticate with your {accountType} account
              </p>
              <button
                onClick={() => handleOAuthSetup(accountType)}
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : `Connect ${accountType.charAt(0).toUpperCase() + accountType.slice(1)}`}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={imapConfig.user}
                  onChange={(e) => setImapConfig({ ...imapConfig, user: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={imapConfig.password}
                  onChange={(e) => setImapConfig({ ...imapConfig, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">IMAP Host</label>
                <input
                  type="text"
                  value={imapConfig.host}
                  onChange={(e) => setImapConfig({ ...imapConfig, host: e.target.value })}
                  placeholder="imap.example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Port</label>
                <input
                  type="number"
                  value={imapConfig.port}
                  onChange={(e) => setImapConfig({ ...imapConfig, port: parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">SMTP Host (optional)</label>
                <input
                  type="text"
                  value={imapConfig.smtpHost}
                  onChange={(e) => setImapConfig({ ...imapConfig, smtpHost: e.target.value })}
                  placeholder="smtp.example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">SMTP Port</label>
                <input
                  type="number"
                  value={imapConfig.smtpPort}
                  onChange={(e) => setImapConfig({ ...imapConfig, smtpPort: parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <button
              onClick={handleImapSetup}
              disabled={loading || !imapConfig.host || !imapConfig.user || !imapConfig.password}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 text-sm text-gray-400 hover:text-white transition"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
