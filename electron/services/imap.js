const Imap = require('imap');
const { simpleParser } = require('mailparser');
const nodemailer = require('nodemailer');

class ImapService {
  constructor() {
    this.connections = new Map();
    this.transports = new Map();
  }

  async connect(config) {
    const { host, port, user, password, tls = true } = config;

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

        // Also create SMTP transport for sending
        const transport = nodemailer.createTransport({
          host: config.smtpHost || host,
          port: config.smtpPort || 587,
          secure: config.smtpSecure || false,
          auth: { user, pass: password },
        });

        this.transports.set(user, transport);
        resolve({ success: true });
      });

      imap.once('error', (err) => {
        reject(err);
      });

      imap.connect();
    });
  }

  async fetchEmails({ user, mailbox = 'INBOX', limit = 50 }) {
    const imap = this.connections.get(user);
    if (!imap) throw new Error('Not connected');

    return new Promise((resolve, reject) => {
      imap.openBox(mailbox, false, (err, box) => {
        if (err) return reject(err);

        if (box.messages.total === 0) {
          return resolve([]);
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

        fetch.on('message', (msg, seqno) => {
          msg.on('body', (stream) => {
            simpleParser(stream, async (err, parsed) => {
              if (err) {
                console.error('Parse error:', err);
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
            });
          });
        });

        fetch.once('end', () => {
          // Sort by date descending
          emails.sort((a, b) => b.date - a.date);
          resolve(emails);
        });

        fetch.once('error', reject);
      });
    });
  }

  async sendEmail({ user, to, subject, body, html }) {
    const transport = this.transports.get(user);
    if (!transport) throw new Error('SMTP not configured');

    const result = await transport.sendMail({
      from: user,
      to,
      subject,
      text: body,
      html: html || body,
    });

    return { success: true, messageId: result.messageId };
  }

  async disconnect(user) {
    const imap = this.connections.get(user);
    if (imap) {
      imap.end();
      this.connections.delete(user);
    }

    const transport = this.transports.get(user);
    if (transport) {
      transport.close();
      this.transports.delete(user);
    }

    return { success: true };
  }
}

module.exports = new ImapService();
