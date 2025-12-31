'use client';

import { useState } from 'react';
import { useEmailStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Frame } from '@/components/ui/frame';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SwitchRoot, SwitchControl, SwitchThumb, SwitchLabel, SwitchHiddenInput } from '@/components/ui/switch';
import { AlertRoot, AlertTitle, AlertDescription, AlertCloseTrigger } from '@/components/ui/alert';
import { Mail, Server, AlertCircle } from 'lucide-react';
import type { ImapConfig } from '@/lib/types';

interface AccountSetupProps {
  onClose: () => void;
}

export default function AccountSetup({ onClose }: AccountSetupProps) {
  const { addAccount, saveAccounts, setActiveAccount } = useEmailStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // IMAP form state
  const [imapEmail, setImapEmail] = useState('');
  const [imapHost, setImapHost] = useState('');
  const [imapPort, setImapPort] = useState('993');
  const [imapPassword, setImapPassword] = useState('');
  const [imapTls, setImapTls] = useState(true);
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpSecure, setSmtpSecure] = useState(true);

  const handleGmailAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await window.electron.gmail.authenticate();
      if (result.success) {
        const account = {
          id: Date.now().toString(),
          type: 'gmail' as const,
          email: 'gmail-account',
          isActive: true,
        };
        addAccount(account);
        setActiveAccount(account);
        await saveAccounts();
        onClose();
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImapSetup = async () => {
    if (!imapEmail || !imapHost || !imapPassword) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    const config: ImapConfig = {
      host: imapHost,
      port: parseInt(imapPort),
      user: imapEmail,
      password: imapPassword,
      tls: imapTls,
      smtpHost: smtpHost || undefined,
      smtpPort: smtpPort ? parseInt(smtpPort) : undefined,
      smtpSecure,
    };

    try {
      const result = await window.electron.imap.connect(config);
      if (result.success) {
        const account = {
          id: Date.now().toString(),
          type: 'imap' as const,
          email: imapEmail,
          isActive: true,
          config,
        };
        addAccount(account);
        setActiveAccount(account);
        await saveAccounts();
        onClose();
      } else {
        setError(result.error || 'Connection failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 flex items-center justify-center h-full p-8">
      <div className="w-full max-w-2xl h-fit">
        <Frame
          className="w-full"
          paths={JSON.parse(
            '[{"show":true,"style":{"strokeWidth":"1","stroke":"rgba(255,255,255,0.1)","fill":"rgba(0,0,0,0.4)"},"path":[["M","0","0"],["L","100%","0"],["L","100%","100%"],["L","0","100%"],["L","0","0"]]}]'
          )}
          padding={false}
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold gradient-text mb-2">Subspace Mail</h1>
              <p className="text-gray-400">Connect your email account</p>
            </div>

            {error && (
              <div className="mb-6">
                <AlertRoot>
                  <AlertTitle>
                    <AlertCircle className="size-5 mr-2" />
                    Error
                  </AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                  <AlertCloseTrigger />
                </AlertRoot>
              </div>
            )}

            <TabsRoot defaultValue="gmail">
              <TabsList>
                <TabsTrigger value="gmail">
                  <Mail className="size-4 mr-2" />
                  Gmail
                </TabsTrigger>
                <TabsTrigger value="imap">
                  <Server className="size-4 mr-2" />
                  IMAP/SMTP
                </TabsTrigger>
              </TabsList>

              <TabsContent value="gmail">
                <div className="space-y-4">
                  <p className="text-gray-400 text-sm">
                    Connect your Gmail account using OAuth2 authentication.
                  </p>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={handleGmailAuth}
                    disabled={loading}
                  >
                    <Mail className="size-4 mr-2" />
                    {loading ? 'Connecting...' : 'Connect Gmail'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="imap">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-400">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={imapEmail}
                      onChange={(e) => setImapEmail(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-400">
                        IMAP Host *
                      </label>
                      <Input
                        type="text"
                        placeholder="imap.example.com"
                        value={imapHost}
                        onChange={(e) => setImapHost(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-400">
                        IMAP Port *
                      </label>
                      <Input
                        type="number"
                        placeholder="993"
                        value={imapPort}
                        onChange={(e) => setImapPort(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-400">
                      Password *
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={imapPassword}
                      onChange={(e) => setImapPassword(e.target.value)}
                    />
                  </div>

                  <SwitchRoot checked={imapTls} onCheckedChange={(e) => setImapTls(e.checked)}>
                    <SwitchControl>
                      <SwitchThumb />
                    </SwitchControl>
                    <SwitchLabel>Use TLS/SSL</SwitchLabel>
                    <SwitchHiddenInput />
                  </SwitchRoot>

                  <div className="pt-4 border-t border-white/10 relative">
                    <Frame
                      paths={JSON.parse(
                        '[{"show":true,"style":{"strokeWidth":"1","stroke":"rgba(255,255,255,0.1)","fill":"transparent"},"path":[["M","0","0"],["L","100%","0"]]}]'
                      )}
                      padding={false}
                    />
                    <div className="relative z-10 p-4">
                      <h3 className="text-sm font-medium mb-4 text-gray-300">
                        SMTP Settings (Optional)
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-400">
                            SMTP Host
                          </label>
                          <Input
                            type="text"
                            placeholder="smtp.example.com"
                            value={smtpHost}
                            onChange={(e) => setSmtpHost(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-400">
                            SMTP Port
                          </label>
                          <Input
                            type="number"
                            placeholder="587"
                            value={smtpPort}
                            onChange={(e) => setSmtpPort(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <SwitchRoot checked={smtpSecure} onCheckedChange={(e) => setSmtpSecure(e.checked)}>
                          <SwitchControl>
                            <SwitchThumb />
                          </SwitchControl>
                          <SwitchLabel>Use Secure Connection</SwitchLabel>
                          <SwitchHiddenInput />
                        </SwitchRoot>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="default"
                    className="w-full"
                    onClick={handleImapSetup}
                    disabled={loading}
                  >
                    <Server className="size-4 mr-2" />
                    {loading ? 'Connecting...' : 'Connect IMAP'}
                  </Button>
                </div>
              </TabsContent>
            </TabsRoot>
          </div>
        </Frame>
      </div>
    </div>
  );
}
