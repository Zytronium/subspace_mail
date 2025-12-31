'use client';

import { useState } from 'react';
import { useEmailStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Frame } from '@/components/ui/frame';
import { createToaster, Toaster, ToastRoot, ToastTitle, ToastDescription, ToastCloseTrigger } from '@/components/ui/toast';
import { X, Send } from 'lucide-react';

interface ComposeProps {
  onClose: () => void;
}

const toaster = createToaster({
  placement: 'top-end',
  duration: 5000,
});

export default function Compose({ onClose }: ComposeProps) {
  const { sendEmail } = useEmailStore();
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!to || !subject || !body) {
      toaster.create({
        title: 'Missing fields',
        description: 'Please fill in all fields',
        type: 'error',
      });
      return;
    }

    setSending(true);
    try {
      await sendEmail(to, subject, body);
      toaster.create({
        title: 'Email sent',
        description: 'Your message has been sent successfully',
        type: 'success',
      });
      onClose();
    } catch (error: any) {
      toaster.create({
        title: 'Failed to send',
        description: error.message || 'An error occurred',
        type: 'error',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col animate-slide-in h-full relative">
        <Frame
          className="size-full flex flex-col"
          paths={JSON.parse(
            '[{"show":true,"style":{"strokeWidth":"1","stroke":"rgba(255,255,255,0.1)","fill":"rgba(0,0,0,0.5)"},"path":[["M","0","0"],["L","100%","0"],["L","100%","100%"],["L","0","100%"],["L","0","0"]]}]'
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
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-xl font-bold gradient-text">New Message</h2>
                  <Button
                    shape="flat"
                    variant="secondary"
                    onClick={onClose}
                    className="px-3 py-1.5"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </Frame>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">To</label>
                <Input
                  type="email"
                  placeholder="recipient@example.com"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-400">Subject</label>
                <Input
                  type="text"
                  placeholder="Email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-gray-400">Message</label>
                <Textarea
                  placeholder="Write your message..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="min-h-[300px]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="relative mt-auto">
              <Frame
                paths={JSON.parse(
                  '[{"show":true,"style":{"strokeWidth":"1","stroke":"rgba(255,255,255,0.1)","fill":"transparent"},"path":[["M","0","0"],["L","100%","0"]]}]'
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <Button
                    variant="secondary"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="default"
                    onClick={handleSend}
                    disabled={sending}
                  >
                    <Send className="size-4 mr-2" />
                    {sending ? 'Sending...' : 'Send Email'}
                  </Button>
                </div>
              </Frame>
            </div>
          </div>
        </Frame>
      </div>

      <Toaster toaster={toaster}>
        {(toast) => (
          <ToastRoot key={toast.id}>
            <ToastTitle>{toast.title}</ToastTitle>
            {toast.description && (
              <ToastDescription>{toast.description}</ToastDescription>
            )}
            <ToastCloseTrigger />
          </ToastRoot>
        )}
      </Toaster>
    </>
  );
}
