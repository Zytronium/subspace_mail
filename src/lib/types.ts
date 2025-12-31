export interface Email {
  id: string;
  threadId?: string;
  subject: string;
  from: string;
  to: string;
  cc?: string;
  date: Date;
  snippet: string;
  body: string;
  labels?: string[];
  unread: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  filename: string;
  contentType: string;
  size: number;
}

export interface Account {
  id: string;
  type: 'gmail' | 'outlook' | 'yahoo' | 'imap';
  email: string;
  name?: string;
  isActive: boolean;
  config?: ImapConfig;
}

export interface ImapConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  tls: boolean;
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
}

export interface Folder {
  name: string;
  count: number;
  unread: number;
}

declare global {
  interface Window {
    electron: {
      window: {
        minimize: () => Promise<void>;
        maximize: () => Promise<void>;
        close: () => Promise<void>;
      };
      gmail: {
        authenticate: () => Promise<{ success: boolean; error?: string }>;
        fetchEmails: (params: any) => Promise<{ emails: Email[]; nextPageToken?: string }>;
        sendEmail: (email: any) => Promise<{ success: boolean; messageId?: string }>;
      };
      outlook: {
        authenticate: () => Promise<{ success: boolean; error?: string }>;
        fetchEmails: (params: any) => Promise<{ emails: Email[]; nextPageToken?: string }>;
      };
      yahoo: {
        authenticate: () => Promise<{ success: boolean; error?: string }>;
        fetchEmails: (params: any) => Promise<{ emails: Email[]; nextPageToken?: string }>;
      };
      imap: {
        connect: (config: ImapConfig) => Promise<{ success: boolean; error?: string }>;
        fetchEmails: (params: any) => Promise<Email[]>;
        sendEmail: (params: any) => Promise<{ success: boolean; messageId?: string }>;
        disconnect: (user: string) => Promise<{ success: boolean }>;
      };
      store: {
        get: (key: string) => Promise<any>;
        set: (key: string, value: any) => Promise<{ success: boolean }>;
        delete: (key: string) => Promise<{ success: boolean }>;
      };
    };
  }
}
