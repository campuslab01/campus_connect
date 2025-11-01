# Firebase Cloud Messaging - Integration Complete ✅

## 🎯 Why Both Socket.io and FCM?

**Socket.io** handles real-time updates when:
- ✅ User has the app/tab open
- ✅ User is actively browsing
- ✅ Low-latency updates needed

**Firebase FCM** handles push notifications when:
- ✅ App/tab is closed or minimized
- ✅ User is offline or on another tab
- ✅ Background notifications needed
- ✅ Better engagement and retention

## ✅ Integration Status

### Frontend ✅
- [x] Firebase config (`src/config/firebase.ts`)
- [x] Notification context (`src/contexts/NotificationContext.tsx`)
- [x] Service worker (`public/firebase-messaging-sw.js`)
- [x] NotificationProvider integrated in `App.tsx`

### Backend ✅
- [x] Firebase Admin SDK setup (`server/controllers/notificationController.js`)
- [x] Push notification utilities (`server/utils/pushNotification.js`)
- [x] NotificationToken model (`server/models/NotificationToken.js`)
- [x] Notification routes (`server/routes/notifications.js`)
- [x] **FCM integrated into chat messages** (`server/controllers/chatController.js`)
- [x] **FCM integrated into likes/matches** (`server/controllers/userController.js`)

## 🚀 Setup Instructions

### Step 1: Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create/Select your project
3. Go to **Project Settings** → **General** tab
4. Scroll down to "Your apps" → Click **Web icon** (`</>`)
5. Register app: "Campus Connection Web"
6. **Copy the Firebase config** - you'll need these values:

```javascript
{
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-ABC123"
}
```

### Step 2: Get VAPID Key (Frontend)

1. In Firebase Console, go to **Cloud Messaging**
2. Scroll to **Web Push certificates**
3. Click **Generate key pair**
4. **Copy the VAPID key** (starts with `BL...`)

### Step 3: Generate Service Account Key (Backend)

1. In Firebase Console, go to **Project Settings** → **Service accounts**
2. Click **Generate new private key**
3. **Download the JSON file** - this is your service account key

### Step 4: Environment Variables

#### Frontend (`.env` or Vercel Environment Variables)

```bash
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123
VITE_FIREBASE_VAPID_KEY=BL...your-vapid-key
```

#### Backend (`.env` or Render Environment Variables)

**Option A: Service Account as JSON String (Recommended for Production)**
```bash
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}
```

**Option B: Service Account File Path (Development Only)**
```bash
FIREBASE_SERVICE_ACCOUNT_PATH=./path/to/serviceAccountKey.json
```

### Step 5: Deploy & Test

1. **Frontend (Vercel)**:
   - Add all `VITE_FIREBASE_*` environment variables
   - Redeploy

2. **Backend (Render)**:
   - Add `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable
   - Copy the entire JSON content from service account file
   - Redeploy

## 📱 How It Works

### Message Notifications

When a user sends a message:

1. **Socket.io** (if recipient is online):
   - Real-time message appears instantly
   
2. **FCM** (if recipient is offline):
   - Backend checks if recipient is connected via Socket.io
   - If not connected → sends FCM push notification
   - User gets notification even when app is closed

### Like/Match Notifications

When a user likes someone:

1. **Socket.io**: Real-time notification if user is online
2. **FCM**: Push notification regardless of online status
3. **Match**: Both users get notifications via Socket.io + FCM

## 🔧 Testing

### Test FCM Token Registration

1. Open browser console
2. Look for: `FCM Registration token: ...`
3. Token should be sent to backend automatically
4. Check MongoDB: `NotificationToken` collection should have the token

### Test Push Notifications

1. **Send a message** when recipient has tab closed
2. **Like a user** who has app closed
3. **Match with someone** - both should get notifications

### Debug Commands

**Check if tokens are saved:**
```javascript
// In MongoDB
db.notificationtokens.find({ isActive: true })
```

**Check Firebase Admin initialization:**
```javascript
// In backend logs
// Should see: "Firebase Admin initialized"
```

## 🐛 Troubleshooting

### "Firebase Admin not initialized"
- Check `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable
- Ensure JSON is properly formatted (no newlines in env var)
- Check backend logs for initialization errors

### "No registration token available"
- Request notification permission: Browser → Settings → Notifications
- Check browser console for permission errors
- Ensure service worker is registered

### "No active tokens found"
- User hasn't granted notification permission
- FCM token wasn't saved to database
- Check `NotificationToken` collection in MongoDB

### Notifications not appearing
- Check browser notification settings
- Ensure HTTPS (required for FCM)
- Check service worker registration
- Verify VAPID key is correct

## 📝 Code Flow

```
User Action (e.g., send message)
  ↓
Backend Controller (chatController.js)
  ↓
Check if recipient is online (Socket.io)
  ├─ Online → Socket.io event only
  └─ Offline → FCM push notification
     ↓
     pushNotification.js → sendMessageNotification()
     ↓
     Firebase Admin SDK → FCM API
     ↓
     User device receives notification
```

## ✅ Checklist

- [ ] Firebase project created
- [ ] VAPID key generated and added to frontend `.env`
- [ ] Service account key downloaded and added to backend `.env`
- [ ] Frontend environment variables set (Vercel)
- [ ] Backend environment variables set (Render)
- [ ] Service worker registered (check browser console)
- [ ] FCM token generated (check browser console)
- [ ] Token saved to MongoDB (check database)
- [ ] Test notification when app is closed
- [ ] Test notification when app is open (foreground)

## 🎉 Success Indicators

- ✅ Browser console shows: `FCM Registration token: ...`
- ✅ Backend logs show: `Firebase Admin initialized`
- ✅ MongoDB has tokens in `NotificationToken` collection
- ✅ Push notifications appear when app is closed
- ✅ Foreground notifications appear when app is open

Your FCM integration is now complete! 🚀

