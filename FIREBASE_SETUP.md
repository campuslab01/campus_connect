# Firebase Cloud Messaging (FCM) Setup Guide

This guide will help you set up Firebase Cloud Messaging for push notifications in your Campus Connection app.

## 🎯 Why FCM?

While Socket.io handles real-time updates when the app is **open**, FCM provides:
- **Push notifications when the app/tab is closed**
- **Background notifications on mobile**
- **Better user engagement and retention**

They work together: Socket.io for active users, FCM for offline users.

## 📋 Prerequisites

1. A Google account
2. Access to Firebase Console: https://console.firebase.google.com

## 🚀 Step-by-Step Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name: "Campus Connection" (or your preferred name)
   - Enable/disable Google Analytics (optional for MVP)
4. Click "Create project"

### Step 2: Register Web App

1. In Firebase Console, click the **Web icon** (`</>`)
2. Register your app:
   - **App nickname**: "Campus Connection Web"
   - **Firebase Hosting**: Not needed for now (optional)
3. Click "Register app"
4. **Copy the Firebase configuration object** - you'll need this!

### Step 3: Enable Cloud Messaging

1. In Firebase Console, go to **Build** → **Cloud Messaging**
2. Click on **Web configuration** tab
3. Click **Generate key pair** under "Web Push certificates"
4. **Copy the VAPID key** - you'll need this!
5. Note the **Sender ID** from the Firebase config

### Step 4: Generate Service Account Key (For Backend)

1. In Firebase Console, go to **Project Settings** → **Service accounts**
2. Click **Generate new private key**
3. Download the JSON file - **KEEP THIS SECRET!**
4. You'll use this in your backend environment variables

### Step 5: Configure Environment Variables

#### Frontend (`.env` file in root):
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id (optional)
VITE_FIREBASE_VAPID_KEY=your_vapid_key_here
```

#### Backend (`.env` file in `server/` folder):
```env
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}'
```

**OR** store the service account JSON file securely and reference it:

```env
FIREBASE_SERVICE_ACCOUNT_PATH=./path/to/serviceAccountKey.json
```

### Step 6: Update Service Worker

1. Open `public/firebase-messaging-sw.js`
2. Replace the `firebaseConfig` object with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID'
};
```

### Step 7: Install Backend Dependencies

```bash
cd server
npm install firebase-admin
```

### Step 8: Update Backend Notification Controller

If you're using the JSON file path instead of environment variable, update `server/controllers/notificationController.js`:

```javascript
const serviceAccount = require('../path/to/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

## ✅ Testing

1. **Start your development server**:
   ```bash
   npm run dev:full
   ```

2. **Open your app in a browser** that supports push notifications (Chrome, Firefox, Edge)

3. **Log in** to your account

4. **Check browser console** - you should see:
   - "Service Worker registered"
   - "FCM Registration token: ..."
   - "FCM token sent to backend"

5. **Request notification permission**:
   - The app will prompt you for notification permission
   - Click "Allow"

6. **Test from backend**:
   ```bash
   # Using curl or Postman
   POST /api/notifications/send
   {
     "userId": "your_user_id",
     "title": "Test Notification",
     "body": "This is a test notification",
     "data": {
       "type": "test"
     }
   }
   ```

## 🔔 Notification Types

The app supports these notification types:

1. **Messages** (`type: 'message'`) - New chat messages
2. **Matches** (`type: 'match'`) - New mutual likes
3. **Likes** (`type: 'like'`) - Someone liked your profile
4. **Confessions** (`type: 'confession'`) - Confession activity

## 🔧 Integration with Socket.io

When Socket.io events are received on the server, you can trigger push notifications:

```javascript
const { sendMessageNotification, sendMatchNotification } = require('./utils/pushNotification');

// In your Socket.io event handlers
io.on('connection', (socket) => {
  socket.on('message:new', async (data) => {
    // Emit to Socket.io clients (real-time)
    io.emit('message:new', data);
    
    // Send push notification (for offline users)
    await sendMessageNotification(data.recipientId, {
      senderName: data.senderName,
      content: data.content,
      chatId: data.chatId,
      senderAvatar: data.senderAvatar
    });
  });
});
```

## 🚨 Security Notes

1. **Never commit** service account keys or VAPID keys to Git
2. Add to `.gitignore`:
   ```
   *.json
   !package*.json
   serviceAccountKey.json
   ```
3. Use environment variables in production
4. Restrict `/api/notifications/send` endpoint to admin users in production

## 📱 Browser Support

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop)
- ✅ Safari (iOS 16.4+)
- ❌ Safari (Desktop - limited support)

## 🐛 Troubleshooting

### Service Worker Not Registering
- Ensure `firebase-messaging-sw.js` is in the `public/` folder
- Check browser console for errors
- Verify HTTPS (required for service workers, except localhost)

### Token Not Generated
- Check notification permission is granted
- Verify VAPID key is correct
- Check browser console for errors

### Notifications Not Received
- Verify FCM token is saved in database
- Check Firebase Admin is initialized correctly
- Verify service account key has correct permissions

### Background Notifications Not Working
- Ensure service worker is registered
- Check `firebase-messaging-sw.js` is accessible
- Verify Firebase config in service worker

## 📚 Additional Resources

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Protocol](https://developers.google.com/web/fundamentals/push-notifications)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## 🎉 You're All Set!

Once configured, users will receive push notifications even when:
- The browser tab is closed
- The app is in the background
- The device is locked (mobile)

This significantly improves user engagement and retention!
