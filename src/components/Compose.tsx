'use client';

import { useState } from 'react';
import { useEmailStore } from '@/lib/store';

interface ComposeProps {
  onClose: () => void;
}

export default function Compose({ onClose }: ComposeProps) {
  const { sendEmail } = useEmailStore();
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!to || !subject) {
      alert('Please fill in recipient and subject');
      return;
    }

    setSending(true);
    try {
      await sendEmail(to, subject, body);
      onClose();
    } catch (error) {
      console.error('Failed to send:', error);
      alert('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950/50 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <h2 className="text-lg font-semibold">New Message</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 space-y-4">
          {/* To */}
          <div>
            <label className="block text-sm font-medium mb-2">To</label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Body */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message..."
              rows={15}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-white/10 transition" title="Attach file">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 transition" title="Formatting">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="btn-secondary"
              disabled={sending}
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
