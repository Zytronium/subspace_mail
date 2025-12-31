# Subspace Mail - Setup Guide

## Prerequisites

1. Node.js 18+ and npm
2. Git
3. Linux environment (Fedora tested)

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up Gmail OAuth (if using Gmail):**

a. Go to [Google Cloud Console](https://console.cloud.google.com)
b. Create a new project or select existing
c. Enable Gmail API:
- Navigate to "APIs & Services" > "Library"
- Search for "Gmail API" and enable it
  d. Create OAuth 2.0 credentials:
- Go to "APIs & Services" > "Credentials"
- Click "Create Credentials" > "OAuth client ID"
- Choose "Desktop app"
- Download the JSON file
  e. Rename it to `gmail-credentials.json` and place it in `electron/services/`

Example `gmail-credentials.json` structure:
```json
{
  "installed": {
    "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
    "project_id": "your-project",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "YOUR_CLIENT_SECRET",
    "redirect_uris": ["http://localhost"]
  }
}
```

3. **Set up Outlook (optional):**

Install MSAL Node:
```bash
npm install @azure/msal-node
```

Then update `electron/services/outlook.js` with MSAL implementation.

4. **Create .env file (optional):**
```bash
# .env
ENCRYPTION_KEY=your-secure-encryption-key-here-min-32-chars
```

## Development

**Run in development mode:**
```bash
npm run electron:dev
```

This will:
- Start Next.js dev server on port 3000
- Wait for server to be ready
- Launch Electron window

## Building for Production

**Build the application:**
```bash
npm run electron:build
```

**Package for Linux:**
```bash
npm run package
```

This creates:
- `dist/Cosmic Mail-x.x.x.AppImage` - Portable AppImage
- `dist/cosmic-mail_x.x.x_amd64.deb` - Debian package

## First Run

1. Launch the app
2. Click "Add Account"
3. Choose account type:
    - **Gmail**: Authenticate via OAuth
    - **Outlook**: Authenticate via Microsoft
    - **IMAP**: Enter server details manually

### Common IMAP Settings

**Gmail via IMAP:**
- Host: imap.gmail.com
- Port: 993
- TLS: Yes
- SMTP Host: smtp.gmail.com
- SMTP Port: 587
- Note: Enable "Less secure app access" or use App Password

**Outlook/Hotmail:**
- Host: outlook.office365.com
- Port: 993
- TLS: Yes
- SMTP Host: smtp.office365.com
- SMTP Port: 587

**Yahoo:**
- Host: imap.mail.yahoo.com
- Port: 993
- TLS: Yes
- SMTP Host: smtp.mail.yahoo.com
- SMTP Port: 465 or 587

**Custom domains (check with provider):**
- Usually: mail.yourdomain.com
- Port: 993 (IMAP) / 587 (SMTP)

## Project Structure

```
subspace_mail/
├── electron/               # Electron main process
│   ├── main.js            # App entry point
│   ├── preload.js         # IPC bridge
│   └── services/          # Email service implementations
│       ├── gmail.js       # Gmail OAuth & API
│       ├── outlook.js     # Outlook/Microsoft Graph
│       ├── yahoo.js       # Yahoo (placeholder)
│       └── imap.js        # Generic IMAP/SMTP
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Main app page
│   ├── components/        # React components
│   │   ├── Sidebar.tsx    # Navigation sidebar
│   │   ├── EmailList.tsx  # Email list view
│   │   ├── EmailViewer.tsx # Email content viewer
│   │   ├── Compose.tsx    # Compose new email
│   │   └── AccountSetup.tsx # Account configuration
│   ├── lib/              # Utilities
│   │   ├── store.ts      # Zustand state management
│   │   └── types.ts      # TypeScript definitions
│   └── styles/
│       └── globals.css   # Global styles
└── public/               # Static assets
```

## Troubleshooting

### Gmail "Less secure apps" error
- Use App Passwords: Google Account > Security > 2-Step Verification > App passwords
- Or use OAuth (recommended)

### IMAP connection timeout
- Check firewall settings
- Verify server address and port
- Ensure TLS/SSL settings match provider requirements

### Electron window not showing
- Check console for errors
- Verify Next.js built successfully: `ls out/`
- Try: `npm run build` then `npm run electron:dev`

### Missing dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

## Features

- ✅ Multi-account support (Gmail, Outlook, Yahoo, IMAP)
- ✅ Read emails with HTML rendering
- ✅ Compose and send emails
- ✅ Attachment viewing
- ✅ Encrypted credential storage
- ✅ Futuristic glassmorphic UI
- ✅ Custom title bar (frameless window)
- ✅ Cross-account unified inbox

## Roadmap

- [ ] Email search and filters
- [ ] Rich text editor for compose
- [ ] Attachment downloads
- [ ] Email rules and automation
- [ ] Push notifications
- [ ] Offline mode
- [ ] Calendar integration
- [ ] Contact management
- [ ] Dark/Light theme toggle
- [ ] Keyboard shortcuts

## Distribution

### For Personal Use
```bash
npm run package
sudo dpkg -i dist/cosmic-mail_*.deb
# or
chmod +x dist/Cosmic\ Mail-*.AppImage
./dist/Cosmic\ Mail-*.AppImage
```

### For Commercial Distribution

1. **Add License System:**
    - Integrate KeyGen.sh or Gumroad
    - Implement license validation
    - Add trial period

2. **Code Signing:**
```bash
# Install signing tools
sudo apt install osslsigncode

# Sign AppImage
osslsigncode sign -certs cert.pem -key key.pem \
  -in dist/Cosmic\ Mail.AppImage \
  -out dist/Cosmic\ Mail-signed.AppImage
```

3. **Update Mechanism:**
```bash
npm install electron-updater
```

Add to `electron/main.js`:
```javascript
const { autoUpdater } = require('electron-updater');

app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

4. **Analytics (optional):**
```bash
npm install @sentry/electron
```

## Security Notes

1. **Never commit credentials:**
    - Add `*.json` to `.gitignore` for credential files
    - Use environment variables for sensitive data

2. **Encryption:**
    - Change default encryption key in production
    - Use OS keychain for credential storage

3. **Updates:**
    - Keep dependencies updated: `npm audit fix`
    - Monitor security advisories

## Support

For issues or questions:
- Check console logs in DevTools
- Review electron logs: `~/.config/Cosmic Mail/logs/`
- File issues on GitHub (if open source)

## License

none yet.

---

Built with ❤️ using Next.js, Electron, and modern web technologies.