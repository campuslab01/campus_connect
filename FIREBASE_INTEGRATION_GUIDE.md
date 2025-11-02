# Firebase Integration - Secure Setup Guide 🔐

This guide will help you securely integrate Firebase Cloud Messaging into your Campus Connection app.

## 📁 File Structure Overview

```
campus-connection-code/
├── .env                          # Frontend environment variables (LOCAL ONLY - NOT COMMITTED)
├── .gitignore                    # Ensures .env is not committed
├── src/config/firebase.ts        # Firebase frontend config (reads from .env)
├── public/firebase-messaging-sw.js # Service worker (needs config)
└── server/
    ├── .env                      # Backend environment variables (LOCAL ONLY - NOT COMMITTED)
    ├── .gitignore                # Ensures .env is not committed
    └── controllers/
        └── notificationController.js # Firebase Admin setup (reads from .env)
```

## 🔑 Step 1: Frontend Configuration

### Option A: Local Development (.env file)

Create a `.env` file in the **root directory** (same level as `package.json`):

```bash
# .env (in root directory)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123
VITE_FIREBASE_VAPID_KEY=BL...your-vapid-key-here
```

### Option B: Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with the same names (VITE_FIREBASE_*)
4. Select **Production**, **Preview**, and **Development** environments
5. Click **Save**

**Important:** Vercel will automatically use these on the next deployment.

### Update Service Worker

Open `public/firebase-messaging-sw.js` and update the config:

```javascript
// Get config from environment (build-time)
const firebaseConfig = {
  apiKey: self.__FIREBASE_CONFIG__?.apiKey || '',
  authDomain: self.__FIREBASE_CONFIG__?.authDomain || '',
  projectId: self.__FIREBASE_CONFIG__?.projectId || '',
  storageBucket: self.__FIREBASE_CONFIG__?.storageBucket || '',
  messagingSenderId: self.__FIREBASE_CONFIG__?.messagingSenderId || '',
  appId: self.__FIREBASE_CONFIG__?.appId || ''
};
```

**Note:** For Vite, we'll inject config at build time. The service worker will read from environment variables automatically.

## 🔒 Step 2: Backend Configuration

### Convert Service Account JSON to Environment Variable

Your Firebase service account JSON should **NEVER** be committed to git. Instead, convert it to an environment variable:

#### Option A: Render (Recommended for Production)

1. Open your service account JSON file (downloaded from Firebase)
2. **Copy the ENTIRE JSON content** (one line, no formatting)
3. Go to Render dashboard → Your service → **Environment** tab
4. Add new environment variable:
   - **Key:** `FIREBASE_SERVICE_ACCOUNT_KEY`
   - **Value:** Paste the entire JSON (it should be one long string)
   - **Example:**
     ```
     {"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
     ```
5. Click **Save Changes**
6. Render will redeploy automatically

#### Option B: Local Development

Create a `.env` file in the `server/` directory:

```bash
# server/.env
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk@your-project.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'
```

**Important:** 
- Wrap the entire JSON in single quotes `'...'`
- Escape any single quotes inside the JSON
- Keep it as one line

### Alternative: Using File Path (Development Only)

If you prefer using the file directly (local development only):

1. **Create a secure directory:**
   ```bash
   mkdir server/config
   ```

2. **Copy your service account JSON file:**
   ```bash
   cp ~/Downloads/your-project-firebase-adminsdk-xxxxx.json server/config/serviceAccountKey.json
   ```

3. **Update server/.env:**
   ```bash
   FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json
   ```

4. **Update server/.gitignore:**
   ```
   config/serviceAccountKey.json
   ```

**⚠️ WARNING:** Never commit this file! It's in `.gitignore` but double-check.

## 🛡️ Step 3: Security Checklist

### ✅ Ensure These Files Are in .gitignore

**Root `.gitignore`:**
```
.env
.env.local
.env.production
*.log
.DS_Store
```

**`server/.gitignore`:**
```
.env
.env.local
.env.production
config/serviceAccountKey.json
*.log
node_modules/
```

### ✅ Verify Files Are Not Committed

Run these commands to check:

```bash
# Check if .env files are tracked
git ls-files | grep .env

# Check if service account JSON is tracked
git ls-files | grep serviceAccountKey.json

# If any appear, remove them:
git rm --cached .env
git rm --cached server/.env
git rm --cached server/config/serviceAccountKey.json
```

## 📝 Step 4: Update Configuration Files

### Frontend: `src/config/firebase.ts`

Already configured to read from environment variables ✅

### Backend: `server/controllers/notificationController.js`

Already configured to read from environment variables ✅

### Service Worker: `public/firebase-messaging-sw.js`

We need to update this to use environment variables properly. See next section.

## 🔧 Step 5: Build-Time Configuration for Service Worker

Since service workers run in a separate context, we need to inject config at build time.

### Update `vite.config.ts` (if it exists) or create it:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    __FIREBASE_CONFIG__: JSON.stringify({
      apiKey: process.env.VITE_FIREBASE_API_KEY,
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VITE_FIREBASE_APP_ID
    })
  }
});
```

## 🚀 Step 6: Testing

### Test Frontend:

1. Start development server: `npm run dev`
2. Open browser console
3. Look for: `FCM Registration token: ...`
4. Check: `FCM token sent to backend`

### Test Backend:

1. Check server logs for: `Firebase Admin initialized`
2. Send a test message
3. Check if push notification is sent (when user is offline)

### Verify Environment Variables Are Loaded:

```javascript
// Frontend (browser console)
console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY ? 'SET' : 'NOT SET');

// Backend (server logs)
// Should show: "Firebase Admin initialized"
```

## 📋 Complete Setup Checklist

- [ ] Frontend `.env` file created (or Vercel env vars set)
- [ ] Backend `.env` file created (or Render env var set)
- [ ] Service account JSON converted to environment variable
- [ ] `.gitignore` files updated
- [ ] Service worker config updated
- [ ] Firebase Admin initialized in backend logs
- [ ] FCM token generated in browser console
- [ ] Test notification sent successfully

## 🔍 Troubleshooting

### "Firebase Admin not initialized"
- Check `FIREBASE_SERVICE_ACCOUNT_KEY` is set correctly
- Verify JSON is properly formatted (no newlines in env var)
- Check server logs for initialization errors

### "No registration token available"
- Request notification permission in browser
- Check browser console for permission errors
- Ensure service worker is registered

### "Environment variable not found"
- Restart development server after adding `.env` file
- Verify variable names start with `VITE_` for frontend
- Check Vercel/Render dashboard for env vars

## 🎯 Quick Reference

### Where to Find Firebase Keys:

1. **Firebase Config:** Firebase Console → Project Settings → General → Your apps → Web app
2. **VAPID Key:** Firebase Console → Project Settings → Cloud Messaging → Web Push certificates
3. **Service Account:** Firebase Console → Project Settings → Service accounts → Generate new private key

### Important URLs:

- Firebase Console: https://console.firebase.google.com
- Vercel Dashboard: https://vercel.com/dashboard
- Render Dashboard: https://dashboard.render.com

## ⚠️ Security Reminders

1. **NEVER commit** `.env` files
2. **NEVER commit** `serviceAccountKey.json` files
3. **NEVER share** keys in screenshots or messages
4. **ALWAYS use** environment variables in production
5. **ROTATE keys** if accidentally exposed

Your Firebase integration is now secure and production-ready! 🎉

