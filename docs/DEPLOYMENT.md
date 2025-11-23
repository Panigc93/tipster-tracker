# Deployment Guide - Tipster Tracker React App

## Quick Start

### Development

```bash
cd react-app
npm run dev
```

Visit: `http://localhost:5173`

### Production Build

```bash
cd react-app
npm run build
```

Output: `react-app/dist/`

### Local Testing with Emulators

```bash
# Build first
cd react-app && npm run build && cd ..

# Start emulators
firebase emulators:start --only auth,firestore,hosting --import=./emulator-data --export-on-exit
```

Visit: `http://localhost:5000`

---

## Switching Between Legacy and React Apps

### Quick Switch

```bash
# Switch to React
./switch-to-react.sh

# Switch to Legacy
./switch-to-legacy.sh

# Restart emulators (required)
pkill -9 -f "firebase.*emulator"
firebase emulators:start --only auth,firestore,hosting --import=./emulator-data --export-on-exit
```

### Configuration Files

- `firebase.json` - Active configuration
- `firebase.react.json` - React app config (serves `react-app/dist/`)
- `firebase.legacy.json` - Legacy app config (serves `public/`)

---

## Production Deployment

### Prerequisites

1. **Build React app**:
   ```bash
   cd react-app
   npm run build
   ```

2. **Set production environment variables** (`.env.production`):
   ```env
   VITE_FIREBASE_API_KEY=your-production-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

3. **Ensure `firebase.json` points to React**:
   ```bash
   cp firebase.react.json firebase.json
   ```

### Deploy

```bash
firebase deploy --only hosting
```

### Verify Deployment

- Visit production URL
- Test login
- Verify all routes work
- Check browser console for errors

---

## Firebase Hosting Configuration

### React SPA Setup

**Key features**:
- **Public directory**: `react-app/dist/`
- **SPA rewrites**: All routes serve `index.html`
- **Caching**: 1 year for assets, no-cache for `index.html`

**Configuration** (`firebase.react.json`):
```json
{
  "hosting": {
    "public": "react-app/dist",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

---

## Performance Optimization

### Bundle Size

- **Main bundle**: 202.90 kB (63.89 kB gzipped)
- **Total with vendors**: ~907 kB (~303 kB gzipped)

### Vendor Chunks

- `react-vendor`: 96.67 kB
- `firebase-vendor`: 354.55 kB
- `chart-vendor`: 165.87 kB
- `ui-vendor`: 42.33 kB

### Lazy Loading

- Pages load on-demand
- Charts load when tab is active
- Modals load when opened

---

## Troubleshooting

### Issue: 404 on Page Refresh

**Solution**: Ensure SPA rewrites are configured in `firebase.json`

### Issue: Old Version Cached

**Solution**: Verify `index.html` has `no-cache` header

### Issue: Emulator Connection in Production

**Solution**: Check `firebase.config.ts` emulator detection logic

---

For more details, see:
- [Migration Guide](./MIGRATION-GUIDE.md)
- [GitHub Copilot Instructions](../.github/copilot-instructions.md)
