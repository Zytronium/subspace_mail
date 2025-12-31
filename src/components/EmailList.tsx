'use client';

import { useEmailStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Frame } from '@/components/ui/frame';
import { RefreshCw, Search } from 'lucide-react';
import { useState } from 'react';

export default function EmailList() {
  const { emails, selectedEmail, setSelectedEmail, fetchEmails, isLoading } = useEmailStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmails = emails.filter((email) => {
    const query = searchQuery.toLowerCase();
    return (
      email.subject.toLowerCase().includes(query) ||
      email.from.toLowerCase().includes(query) ||
      email.snippet.toLowerCase().includes(query)
    );
  });

  const formatDate = (date: Date) => {
    const now = new Date();
    const emailDate = new Date(date);
    const diffInHours = (now.getTime() - emailDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return emailDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    } else if (diffInHours < 168) {
      return emailDate.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return emailDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <div className="w-96 flex flex-col h-full relative">
      <Frame
        className="size-full flex flex-col"
        paths={JSON.parse(
          '[{"show":true,"style":{"strokeWidth":"1","stroke":"rgba(255,255,255,0.1)","fill":"rgba(0,0,0,0.3)"},"path":[["M","0","0"],["L","100%","0"],["L","100%","100%"],["L","0","100%"],["L","0","0"]]}]'
        )}
        padding={false}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative">
            <Frame
              paths={JSON.parse(
                '[{"show":true,"style":{"strokeWidth":"1","stroke":"rgba(255,255,255,0.1)","fill":"transparent"},"path":[["M","0","100%"],["L","100%","100%"]]}]'
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xl font-bold flex-1">Inbox</h2>
                <Button
                  shape="flat"
                  variant="secondary"
                  onClick={() => fetchEmails()}
                  disabled={isLoading}
                  className="px-3 py-1.5"
                >
                  <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search emails..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Frame>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto px-4 py-2">
            {filteredEmails.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <p className="text-lg mb-2">No emails found</p>
                  <p className="text-sm">
                    {searchQuery
                      ? 'Try a different search query'
                      : 'Your inbox is empty'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredEmails.map((email) => (
                  <button
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`w-full text-left p-4 transition hover:bg-white/5 relative ${
                      selectedEmail?.id === email.id ? 'bg-white/10' : ''
                    }`}
                  >
                    <Frame
                      paths={JSON.parse(
                        '[{"show":true,"style":{"strokeWidth":"1","stroke":"rgba(255,255,255,0.05)","fill":"transparent"},"path":[["M","0","100%"],["L","100%","100%"]]}]'
                      )}
                      padding={false}
                    />
                    <div className="flex items-start gap-3 relative z-10">
                      {email.unread && <div className="unread-dot mt-2" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between mb-1">
                          <span
                            className={`font-medium truncate ${
                              email.unread ? 'text-white' : 'text-gray-300'
                            }`}
                          >
                            {email.from}
                          </span>
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                            {formatDate(email.date)}
                          </span>
                        </div>
                        <div
                          className={`text-sm mb-1 truncate ${
                            email.unread ? 'font-medium' : ''
                          }`}
                        >
                          {email.subject}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {email.snippet}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Frame>
    </div>
  );
}
