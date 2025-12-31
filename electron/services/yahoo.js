class YahooService {
  constructor() {
    this.accessToken = null;
  }

  async authenticate() {
    // Yahoo uses OAuth2, similar to Gmail but with Yahoo's endpoints
    throw new Error('Yahoo authentication not yet implemented. Use IMAP as alternative.');
  }

  async fetchEmails(params) {
    throw new Error('Yahoo not yet implemented. Use IMAP for Yahoo mail.');
  }
}

module.exports = new YahooService();
