const Imap = require('imap');
const { simpleParser } = require('mailparser');
const nodemailer = require('nodemailer');

class ImapService {
  constructor() {
    this.connections = new Map();
    this.transports = new Map();
  }

  async connect(config) {
    const { host, port, user, password, tls = true, smtpHost, smtpPort, smtpSecure } = config;

    // Validate required fields
    if (!host || !user || !password) {
      throw new Error('Missing required IMAP configuration (host, user, password)');
    }

    return new Promise((resolve, reject) => {
      const imap = new Imap({
        user,
        password,
        host,
        port: port || 993,
        tls,
        tlsOptions: { rejectUnauthorized: false }
      });

      imap.once('ready', () => {
        this.connections.set(user, imap);

        // Create SMTP transport for sending (optional - only if SMTP config provided)
        try {
        const transport = nodemailer.createTransport({
            host: smtpHost || host,
            port: smtpPort || 587,
            secure: smtpSecure || false,
          auth: { user, pass: password },
        });

        this.transports.set(user, transport);
        } catch (smtpError) {
          console.warn('SMTP transport creation failed:', smtpError.message);
          // Continue anyway - SMTP is optional for receiving emails
        }

        resolve({ success: true });
      });

      imap.once('error', (err) => {
        reject(new Error(`IMAP connection failed: ${err.message}`));
      });

      imap.once('end', () => {
        // Connection ended, clean up
        this.connections.delete(user);
      });

      try {
      imap.connect();
      } catch (err) {
        reject(new Error(`Failed to initiate IMAP connection: ${err.message}`));
      }
    });
  }

  async fetchEmails({ user, mailbox = 'INBOX', limit = 50 }) {
    const imap = this.connections.get(user);

    if (!imap) {
      throw new Error('Not connected. Please connect to IMAP server first.');
    }

    // Check if connection is still alive
    if (imap.state !== 'authenticated') {
      this.connections.delete(user);
      throw new Error('IMAP connection lost. Please reconnect.');
    }

    return new Promise((resolve, reject) => {
      imap.openBox(mailbox, false, (err, box) => {
        if (err) {
          return reject(new Error(`Failed to open mailbox: ${err.message}`));
        }

        if (box.messages.total === 0) {
          return resolve({ success: true, emails: [] });
        }

        const start = Math.max(1, box.messages.total - limit + 1);
        const end = box.messages.total;
        const fetchRange = `${start}:${end}`;

        const fetch = imap.seq.fetch(fetchRange, {
          bodies: '',
          struct: true,
          markSeen: false
        });

        const emails = [];
        let processedCount = 0;
        const expectedCount = end - start + 1;

        fetch.on('message', (msg, seqno) => {
          msg.on('body', (stream) => {
            simpleParser(stream, async (err, parsed) => {
              if (err) {
                console.error('Parse error:', err);
                processedCount++;
                return;
              }

              emails.push({
                id: `${user}-${seqno}`,
                subject: parsed.subject || '(No Subject)',
                from: parsed.from?.text || '',
                to: parsed.to?.text || '',
                cc: parsed.cc?.text || '',
                date: parsed.date || new Date(),
                snippet: parsed.text?.substring(0, 200) || '',
                body: parsed.html || parsed.textAsHtml || parsed.text || '',
                unread: true, // Would need additional IMAP FLAGS fetch to determine
                attachments: parsed.attachments?.map(a => ({
                  filename: a.filename,
                  contentType: a.contentType,
                  size: a.size,
                })) || [],
              });

              processedCount++;
            });
          });
        });

        fetch.once('end', () => {
          // Wait a bit for all parsing to complete
          setTimeout(() => {
          // Sort by date descending
          emails.sort((a, b) => b.date - a.date);
            resolve({ success: true, emails });
          }, 500);
        });

        fetch.once('error', (err) => {
          reject(new Error(`Fetch error: ${err.message}`));
        });
      });
    });
  }

  async sendEmail({ user, to, subject, body, html }) {
    const transport = this.transports.get(user);

    if (!transport) {
      throw new Error('SMTP not configured. Please provide SMTP settings when connecting.');
    }

    // Validate required fields
    if (!to || !subject) {
      throw new Error('Missing required email fields (to, subject)');
    }

    try {
    const result = await transport.sendMail({
      from: user,
      to,
      subject,
      text: body,
      html: html || body,
    });

    return { success: true, messageId: result.messageId };
    } catch (err) {
      throw new Error(`Failed to send email: ${err.message}`);
    }
  }

  async disconnect(user) {
    const imap = this.connections.get(user);
    if (imap) {
      try {
      imap.end();
      } catch (err) {
        console.error('Error closing IMAP connection:', err);
      }
      this.connections.delete(user);
    }

    const transport = this.transports.get(user);
    if (transport) {
      try {
      transport.close();
      } catch (err) {
        console.error('Error closing SMTP transport:', err);
      }
      this.transports.delete(user);
    }

    return { success: true };
  }

  // Helper method to check if user is connected
  isConnected(user) {
    const imap = this.connections.get(user);
    return imap && imap.state === 'authenticated';
  }

  // Helper method to get connection status
  getStatus(user) {
    return {
      imapConnected: this.connections.has(user),
      smtpConfigured: this.transports.has(user),
    };
  }
}

module.exports = new ImapService();
