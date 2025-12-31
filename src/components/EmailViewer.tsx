'use client';

import { Button } from '@/components/ui/button';
import { Frame } from '@/components/ui/frame';
import { MenuRoot, MenuTrigger, MenuPositioner, MenuContent, MenuItem } from '@/components/ui/menu';
import { Reply, Forward, Archive, Trash2, MoreVertical, Star } from 'lucide-react';
import type { Email } from '@/lib/types';

interface EmailViewerProps {
  email: Email | null;
}

export default function EmailViewer({ email }: EmailViewerProps) {
  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-lg mb-2">No email selected</p>
          <p className="text-sm">Select an email from the list to view</p>
        </div>
      </div>
    );
  }

  const formatFullDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative h-full">
      {/* Header */}
      <div className="relative">
        <Frame
          paths={JSON.parse(
            '[{"show":true,"style":{"strokeWidth":"1","stroke":"rgba(255,255,255,0.1)","fill":"transparent"},"path":[["M","0","100%"],["L","100%","100%"]]}]'
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold pr-4">{email.subject}</h1>
            <div className="flex items-center gap-2">
              <Button shape="flat" variant="secondary" className="px-3 py-1.5">
                <Star className="size-4" />
              </Button>
              <MenuRoot>
                <MenuTrigger asChild>
                  <Button shape="flat" variant="secondary" className="px-3 py-1.5">
                    <MoreVertical className="size-4" />
                  </Button>
                </MenuTrigger>
                <MenuPositioner>
                  <MenuContent>
                    <MenuItem>
                      <Archive className="size-4 mr-2" />
                      Archive
                    </MenuItem>
                    <MenuItem>
                      <Trash2 className="size-4 mr-2" />
                      Delete
                    </MenuItem>
                  </MenuContent>
                </MenuPositioner>
              </MenuRoot>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg">
              {email.from[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="font-medium">{email.from}</div>
              <div className="text-sm text-gray-400">to {email.to}</div>
            </div>
            <div className="text-sm text-gray-500">{formatFullDate(email.date)}</div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="default">
              <Reply className="size-4 mr-2" />
              Reply
            </Button>
            <Button variant="secondary">
              <Forward className="size-4 mr-2" />
              Forward
            </Button>
          </div>
        </Frame>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 relative">
        <div
          className="email-content prose prose-invert max-w-none relative z-10"
          dangerouslySetInnerHTML={{ __html: email.body }}
        />
      </div>

      {/* Attachments */}
      {email.attachments && email.attachments.length > 0 && (
        <div className="relative mt-auto">
          <Frame
            paths={JSON.parse(
              '[{"show":true,"style":{"strokeWidth":"1","stroke":"rgba(255,255,255,0.1)","fill":"transparent"},"path":[["M","0","0"],["L","100%","0"]]}]'
            )}
          >
            <h3 className="text-sm font-semibold mb-3 text-gray-300">
              Attachments ({email.attachments.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {email.attachments.map((attachment, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  className="text-sm"
                >
                  {attachment.filename}
                  <span className="text-xs text-gray-500 ml-2">
                    ({(attachment.size / 1024).toFixed(1)} KB)
                  </span>
                </Button>
              ))}
            </div>
          </Frame>
        </div>
      )}
    </div>
  );
}
