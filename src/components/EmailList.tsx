'use client';

import { useEmailStore } from '@/lib/store';

export default function EmailList() {
  const { emails, selectedEmail, setSelectedEmail, isLoading } = useEmailStore();

  const formatDate = (date: Date) => {
    try {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

      if (diffInSeconds < 60) return 'just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      return new Date(date).toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  };

  const extractName = (emailString: string) => {
    const match = emailString.match(/^(.*?)\s*</);
    return match ? match[1].trim() : emailString.split('@')[0];
  };

  if (isLoading) {
    return (
      <div className="w-96 border-r border-white/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading emails...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 bg-black/10 border-r border-white/10 flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search emails..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <svg
            className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {emails.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p>No emails</p>
              <p className="text-sm">Try refreshing or check your connection</p>
            </div>
          </div>
        ) : (
          emails.map((email) => (
            <button
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={`w-full p-4 border-b border-white/5 hover:bg-white/5 transition text-left ${
                selectedEmail?.id === email.id ? 'bg-white/10' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {email.unread && <div className="unread-dot mt-2"></div>}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-semibold truncate ${email.unread ? 'text-white' : 'text-gray-300'}`}>
                      {extractName(email.from)}
                    </span>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {formatDate(email.date)}
                    </span>
                  </div>
                  <div className={`text-sm mb-1 truncate ${email.unread ? 'font-medium' : 'text-gray-400'}`}>
                    {email.subject || '(No Subject)'}
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-2">
                    {email.snippet}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
