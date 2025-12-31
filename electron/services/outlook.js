const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

class OutlookService {
  constructor() {
    this.client = null;
    this.accessToken = null;
  }

  async authenticate() {
    // TODO: Implement Microsoft Authentication Library (MSAL) flow
    // This requires Azure AD app registration and MSAL node package
    throw new Error('Outlook authentication not yet implemented. Requires MSAL setup.');
  }

  async fetchEmails({ maxResults = 50, pageToken = null }) {
    if (!this.client) throw new Error('Not authenticated');

    const response = await this.client
      .api('/me/messages')
      .top(maxResults)
      .skip(pageToken || 0)
      .select('subject,from,receivedDateTime,bodyPreview,body,toRecipients,isRead')
      .orderby('receivedDateTime DESC')
      .get();

    const emails = response.value.map(msg => ({
      id: msg.id,
      subject: msg.subject,
      from: msg.from?.emailAddress?.address || '',
      to: msg.toRecipients?.map(r => r.emailAddress?.address).join(', ') || '',
      date: new Date(msg.receivedDateTime),
      snippet: msg.bodyPreview,
      body: msg.body?.content || '',
      unread: !msg.isRead,
    }));

    return {
      emails,
      nextPageToken: response['@odata.nextLink'] ? maxResults : null,
    };
  }
}

module.exports = new OutlookService();
