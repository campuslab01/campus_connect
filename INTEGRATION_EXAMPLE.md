# FCM + Socket.io Integration Example

This document shows how to integrate FCM push notifications with your existing Socket.io events.

## Integration in Socket.io Event Handlers

When users are offline, Socket.io events won't reach them. Use FCM to send push notifications.

### Example: Message Notifications

```javascript
// In server/utils/socket.js or wherever you handle Socket.io events

const { sendMessageNotification } = require('./utils/pushNotification');
const User = require('../models/User');

io.on('connection', (socket) => {
  // When a new message is sent
  socket.on('message:send', async (data) => {
    const { chatId, content, recipientId, senderId } = data;
    
    // Get sender info
    const sender = await User.findById(senderId).select('name profileImage');
    
    // Emit to Socket.io (for online users)
    io.to(`chat:${chatId}`).emit('message:new', {
      chatId,
      content,
      senderId,
      senderName: sender.name,
      senderAvatar: sender.profileImage,
      timestamp: new Date()
    });
    
    // Send push notification (for offline users)
    await sendMessageNotification(recipientId, {
      senderName: sender.name,
      content,
      chatId,
      senderId,
      senderAvatar: sender.profileImage,
      messageId: data.messageId
    });
  });
});
```

### Example: Match Notifications

```javascript
const { sendMatchNotification } = require('./utils/pushNotification');

// In your match logic (e.g., userController.js)
async function handleMatch(currentUserId, targetUserId) {
  // ... your existing match logic ...
  
  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);
  
  // Send push notification to both users
  await Promise.all([
    sendMatchNotification(currentUserId, {
      userName: targetUser.name,
      userAvatar: targetUser.profileImage,
      matchId: match._id,
      userId: targetUserId
    }),
    sendMatchNotification(targetUserId, {
      userName: currentUser.name,
      userAvatar: currentUser.profileImage,
      matchId: match._id,
      userId: currentUserId
    })
  ]);
}
```

### Example: Like Notifications

```javascript
const { sendLikeNotification } = require('./utils/pushNotification');

// In userController.js - likeUser function
const likeUser = async (req, res, next) => {
  // ... existing like logic ...
  
  // Send push notification to the liked user
  if (!isMatch) { // Only send if it's not a match (match has its own notification)
    await sendLikeNotification(targetUserId, {
      userName: currentUser.name,
      userAvatar: currentUser.profileImage,
      userId: currentUserId
    });
  }
  
  // ... rest of your code ...
};
```

### Example: Confession Notifications

```javascript
const { sendConfessionNotification } = require('./utils/pushNotification');

// When someone likes/comments on a confession
async function handleConfessionLike(confessionId, userId) {
  const confession = await Confession.findById(confessionId).populate('author');
  
  // Send notification to confession author
  await sendConfessionNotification(confession.author._id, {
    title: 'Your confession got a like! ❤️',
    body: 'Someone liked your confession',
    confessionId,
    action: 'like'
  });
}
```

## Smart Notification Logic

You can add logic to check if the user is online before sending push notifications:

```javascript
const { sendMessageNotification } = require('./utils/pushNotification');

socket.on('message:send', async (data) => {
  const { recipientId } = data;
  
  // Check if recipient is online (connected via Socket.io)
  const recipientSocket = getUserSocket(recipientId);
  const isOnline = recipientSocket && recipientSocket.connected;
  
  if (!isOnline) {
    // User is offline, send push notification
    await sendMessageNotification(recipientId, data);
  }
  // If online, Socket.io will handle it
});
```

## Rate Limiting Notifications

To prevent notification spam:

```javascript
// Store last notification time per user
const lastNotificationTime = new Map();

async function sendNotificationWithRateLimit(userId, notification, cooldownMs = 60000) {
  const lastTime = lastNotificationTime.get(userId) || 0;
  const now = Date.now();
  
  if (now - lastTime < cooldownMs) {
    console.log(`Rate limiting notification for user ${userId}`);
    return;
  }
  
  lastNotificationTime.set(userId, now);
  await sendPushNotification(userId, notification);
}
```

## Notification Preferences

Add user notification preferences:

```javascript
// In User model
userSchema.add({
  notificationPreferences: {
    messages: { type: Boolean, default: true },
    matches: { type: Boolean, default: true },
    likes: { type: Boolean, default: true },
    confessions: { type: Boolean, default: true }
  }
});

// When sending notifications
if (user.notificationPreferences?.messages) {
  await sendMessageNotification(userId, data);
}
```

## Summary

- **Socket.io**: Real-time updates when app is **open**
- **FCM**: Push notifications when app is **closed/offline**
- **Best Practice**: Use Socket.io for active users, FCM for offline users
- **Smart Logic**: Check if user is online before sending push notifications
- **Rate Limiting**: Prevent notification spam
- **Preferences**: Respect user notification settings

This hybrid approach ensures users always stay informed! 🎉
