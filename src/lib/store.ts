import { create } from 'zustand';
import type { Email, Account } from './types';

interface EmailStore {
  accounts: Account[];
  activeAccount: Account | null;
  emails: Email[];
  selectedEmail: Email | null;
  isComposing: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setAccounts: (accounts: Account[]) => void;
  addAccount: (account: Account) => void;
  removeAccount: (accountId: string) => void;
  setActiveAccount: (account: Account | null) => void;
  setEmails: (emails: Email[]) => void;
  addEmails: (emails: Email[]) => void;
  setSelectedEmail: (email: Email | null) => void;
  setIsComposing: (isComposing: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Async actions
  loadAccounts: () => Promise<void>;
  saveAccounts: () => Promise<void>;
  fetchEmails: () => Promise<void>;
  sendEmail: (to: string, subject: string, body: string, html?: string) => Promise<void>;
}

export const useEmailStore = create<EmailStore>((set, get) => ({
  accounts: [],
  activeAccount: null,
  emails: [],
  selectedEmail: null,
  isComposing: false,
  isLoading: false,
  error: null,

  setAccounts: (accounts) => set({ accounts }),

  addAccount: (account) => set((state) => ({
    accounts: [...state.accounts, account]
  })),

  removeAccount: (accountId) => set((state) => ({
    accounts: state.accounts.filter(a => a.id !== accountId),
    activeAccount: state.activeAccount?.id === accountId ? null : state.activeAccount
  })),

  setActiveAccount: (account) => set({ activeAccount: account }),
  setEmails: (emails) => set({ emails }),
  addEmails: (emails) => set((state) => ({ emails: [...state.emails, ...emails] })),
  setSelectedEmail: (email) => set({ selectedEmail: email }),
  setIsComposing: (isComposing) => set({ isComposing }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  loadAccounts: async () => {
    if (typeof window === 'undefined' || !window.electron) return;

    try {
      const stored = await window.electron.store.get('accounts');
      if (stored && Array.isArray(stored)) {
        set({ accounts: stored });
        if (stored.length > 0 && !get().activeAccount) {
          set({ activeAccount: stored[0] });
        }
      }
    } catch (error) {
      console.error('Failed to load accounts:', error);
    }
  },

  saveAccounts: async () => {
    if (typeof window === 'undefined' || !window.electron) return;

    try {
      await window.electron.store.set('accounts', get().accounts);
    } catch (error) {
      console.error('Failed to save accounts:', error);
    }
  },

  fetchEmails: async () => {
    const { activeAccount } = get();
    if (!activeAccount || typeof window === 'undefined' || !window.electron) return;

    set({ isLoading: true, error: null });

    try {
      let result;

      switch (activeAccount.type) {
        case 'gmail':
          result = await window.electron.gmail.fetchEmails({ maxResults: 50 });
          break;
        case 'outlook':
          result = await window.electron.outlook.fetchEmails({ maxResults: 50 });
          break;
        case 'imap':
          if (activeAccount.config) {
            result = await window.electron.imap.fetchEmails({
              user: activeAccount.email,
              limit: 50
            });
          }
          break;
        default:
          throw new Error(`Unsupported account type: ${activeAccount.type}`);
      }

      if (result && 'emails' in result) {
        set({ emails: result.emails || result, isLoading: false });
      } else {
        set({ emails: [], isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('Failed to fetch emails:', error);
    }
  },

  sendEmail: async (to, subject, body, html) => {
    const { activeAccount } = get();
    if (!activeAccount || typeof window === 'undefined' || !window.electron) return;

    set({ isLoading: true, error: null });

    try {
      let result;

      switch (activeAccount.type) {
        case 'gmail':
          result = await window.electron.gmail.sendEmail({ to, subject, body, html });
          break;
        case 'imap':
          if (activeAccount.config) {
            result = await window.electron.imap.sendEmail({
              user: activeAccount.email,
              to,
              subject,
              body,
              html
            });
          }
          break;
        default:
          throw new Error(`Sending not supported for ${activeAccount.type}`);
      }

      if (result?.success) {
        set({ isComposing: false, isLoading: false });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}));
