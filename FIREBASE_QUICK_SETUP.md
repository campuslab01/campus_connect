# 🔥 Firebase Quick Setup Guide

## ✅ Step 1: Frontend Environment Variables

### Local Development

Create a `.env` file in the **root directory** (where `package.json` is):

```bash
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_VAPID_KEY=your-vapid-key-here
```

### Vercel Production

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add each variable (same names as above)
3. Select all environments (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** your application

## ✅ Step 2: Backend Service Account

### Option A: Environment Variable (Recommended)

#### For Render Production:

1. Open your **service account JSON file** (downloaded from Firebase)
2. **Copy the entire JSON** (one line, no formatting)
3. Go to **Render Dashboard** → Your Service → **Environment** tab
4. Click **Add Environment Variable**:
   - **Key:** `FIREBASE_SERVICE_ACCOUNT_KEY`
   - **Value:** Paste the entire JSON (should be one long string)
5. Click **Save Changes**
6. Render will automatically redeploy

#### For Local Development:

Create `server/.env`:

```bash
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk@your-project.iam.gserviceaccount.com",...}'
```

**Important:** 
- Wrap entire JSON in single quotes
- Keep it as one line
- No newlines or formatting

### Option B: File Path (Local Development Only)

1. Create directory: `server/config`
2. Copy JSON file there: `server/config/serviceAccountKey.json`
3. Add to `server/.env`:
   ```bash
   FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json
   ```

## ✅ Step 3: Verify .gitignore

Make sure these files are **NOT committed**:

**Root `.gitignore`** should have:
```
.env
.env.*
```

**`server/.gitignore`** should have:
```
.env
.env.*
config/serviceAccountKey.json
```

## ✅ Step 4: Test

### Frontend:
1. Start dev server: `npm run dev`
2. Open browser console
3. Should see: `FCM Registration token: ...`

### Backend:
1. Start server: `npm run server:dev`
2. Check logs: Should see `Firebase Admin initialized`

## 🚨 Security Reminders

- ✅ **NEVER commit** `.env` files
- ✅ **NEVER commit** `serviceAccountKey.json`
- ✅ **NEVER share** keys in screenshots
- ✅ **ALWAYS use** environment variables in production

## 📍 Where to Find Your Keys

1. **Firebase Config:** Firebase Console → ⚙️ Settings → Project settings → General → Your apps → Web app
2. **VAPID Key:** Firebase Console → ⚙️ Settings → Project settings → Cloud Messaging → Web Push certificates → Generate key pair
3. **Service Account:** Firebase Console → ⚙️ Settings → Project settings → Service accounts → Generate new private key

---

That's it! Your Firebase integration is now secure and ready to use! 🎉

