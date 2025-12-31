const { google } = require('googleapis');
const { authenticate } = require('@google-cloud/local-auth');
const path = require('path');
const fs = require('fs').promises;

class GmailService {
  constructor() {
    this.oauth2Client = null;
    this.gmail = null;
  }

  async authenticate() {
    try {
      const credentialsPath = path.join(__dirname, 'gmail-credentials.json');
      const tokenPath = path.join(__dirname, 'gmail-token.json');

      // Check if we have a saved token
      try {
        const token = JSON.parse(await fs.readFile(tokenPath, 'utf8'));
        this.oauth2Client = new google.auth.OAuth2();
        this.oauth2Client.setCredentials(token);
      } catch (err) {
        // No saved token, need to authenticate
        this.oauth2Client = await authenticate({
          keyfilePath: credentialsPath,
          scopes: [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth/gmail.modify'
          ],
        });

        // Save the token
        await fs.writeFile(tokenPath, JSON.stringify(this.oauth2Client.credentials));
      }

      this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
      return { success: true };
    } catch (error) {
      console.error('Gmail authentication error:', error);
      throw error;
    }
  }

  async fetchEmails({ maxResults = 50, pageToken = null, query = '' }) {
    if (!this.gmail) await this.authenticate();

    const response = await this.gmail.users.messages.list({
      userId: 'me',
      maxResults,
      pageToken,
      q: query,
    });

    if (!response.data.messages) {
      return { emails: [], nextPageToken: null };
    }

    const messages = await Promise.all(
      response.data.messages.map(async (msg) => {
        const detail = await this.gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'full',
        });
        return this.parseMessage(detail.data);
      })
    );

    return {
      emails: messages,
      nextPageToken: response.data.nextPageToken,
    };
  }

  async sendEmail({ to, subject, body, html }) {
    if (!this.gmail) await this.authenticate();

    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      '',
      html || body,
    ].join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const result = await this.gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    return { success: true, messageId: result.data.id };
  }

  parseMessage(message) {
    const headers = message.payload.headers;
    const getHeader = (name) =>
      headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

    return {
      id: message.id,
      threadId: message.threadId,
      subject: getHeader('subject'),
      from: getHeader('from'),
      to: getHeader('to'),
      cc: getHeader('cc'),
      date: new Date(parseInt(message.internalDate)),
      snippet: message.snippet,
      body: this.getBody(message.payload),
      labels: message.labelIds || [],
      unread: message.labelIds?.includes('UNREAD') || false,
    };
  }

  getBody(payload) {
    let body = '';

    if (payload.body?.data) {
      body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
    } else if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/html' && part.body?.data) {
          body = Buffer.from(part.body.data, 'base64').toString('utf-8');
          break;
        } else if (part.mimeType === 'text/plain' && part.body?.data && !body) {
          body = Buffer.from(part.body.data, 'base64').toString('utf-8');
        } else if (part.parts) {
          body = this.getBody(part);
          if (body) break;
        }
      }
    }

    return body;
  }
}

module.exports = new GmailService();
