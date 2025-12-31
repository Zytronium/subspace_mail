'use client';

import type { Email } from '@/lib/types';

interface EmailViewerProps {
  email: Email | null;
}

export default function EmailViewer({ email }: EmailViewerProps) {
  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950/50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-400">Select an email to view</p>
        </div>
      </div>
    );
  }

  const extractEmail = (str: string) => {
    const match = str.match(/<(.+?)>/);
    return match ? match[1] : str;
  };

  const extractName = (str: string) => {
    const match = str.match(/^(.*?)\s*</);
    return match ? match[1].trim() : str.split('@')[0];
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950/50 overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/10 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{email.subject || '(No Subject)'}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
                  {extractName(email.from)[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-white">{extractName(email.from)}</div>
                  <div className="text-xs">{extractEmail(email.from)}</div>
                </div>
              </div>
              <div className="text-xs">
                {new Date(email.date).toLocaleString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-white/10 transition" title="Reply">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 transition" title="Forward">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 transition" title="Star">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition" title="Delete">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Recipients */}
        {email.to && (
          <div className="text-sm text-gray-400">
            <span className="font-medium">To:</span> {email.to}
          </div>
        )}
        {email.cc && (
          <div className="text-sm text-gray-400">
            <span className="font-medium">Cc:</span> {email.cc}
          </div>
        )}
      </div>

      {/* Email Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div
          className="email-content prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: email.body }}
        />
      </div>

      {/* Attachments */}
      {email.attachments && email.attachments.length > 0 && (
        <div className="border-t border-white/10 p-6">
          <div className="text-sm font-semibold mb-3">
            Attachments ({email.attachments.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {email.attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <div className="text-sm">
                  <div className="font-medium">{attachment.filename}</div>
                  <div className="text-xs text-gray-400">
                    {(attachment.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
