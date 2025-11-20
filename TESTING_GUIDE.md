# 🧪 Testing Guide - Campus Connection

This guide provides comprehensive testing procedures for all features, real-time updates, security, and error handling.

## 📋 Table of Contents
1. [Pre-Testing Setup](#pre-testing-setup)
2. [Feature Testing Checklist](#feature-testing-checklist)
3. [Real-Time Updates Testing](#real-time-updates-testing)
4. [Security Testing](#security-testing)
5. [Error Handling Testing](#error-handling-testing)
6. [Performance Testing](#performance-testing)
7. [Browser Compatibility](#browser-compatibility)

## 🔧 Pre-Testing Setup

### Environment Variables
Ensure all required environment variables are set:

**Frontend (.env):**
```env
VITE_API_URL=https://campus-connect-server-yqbh.onrender.com/api
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Backend (server/.env):**
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
IM_API_KEY=your_instamojo_api_key
IM_AUTH_TOKEN=your_instamojo_auth_token
IM_ENDPOINT=https://test.instamojo.com/api/1.1/
IM_PRIVATE_SALT=your_webhook_mac_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
SERVER_PUBLIC_URL=https://campus-connect-server-yqbh.onrender.com
CLIENT_URL=https://campus-connect-swart-nine.vercel.app
```

### Test Accounts
Create at least 3 test accounts:
- **User A**: Primary test user
- **User B**: Secondary test user (for interactions)
- **User C**: Tertiary test user (for multiple interactions)

## ✅ Feature Testing Checklist

### Authentication (AuthPage)
- [ ] **Registration**
  - [ ] Register new user with valid email (@gmail.com only)
  - [ ] Email verification email received
  - [ ] Password meets requirements (min 8 chars)
  - [ ] Terms & conditions acceptance required
  - [ ] Permission popup appears after registration
  - [ ] Welcome notification received after registration
  - [ ] Error handling for duplicate email
  - [ ] Error handling for invalid email format

- [ ] **Login**
  - [ ] Login with valid credentials
  - [ ] Login with invalid credentials shows error
  - [ ] Remember me functionality
  - [ ] Token stored in localStorage
  - [ ] Auto-redirect to Discover page on success

- [ ] **Password Reset**
  - [ ] Forgot password link works
  - [ ] Reset email received
  - [ ] Reset link works
  - [ ] New password can be set
  - [ ] Login with new password works

### Discover Page
- [ ] **User Cards Display**
  - [ ] User cards load with profile images from MongoDB/Cloudinary
  - [ ] Images fallback to `/images/login.jpeg` on error
  - [ ] Bio text truncates after 3 lines with ellipsis
  - [ ] Multiple users displayed (not just one)
  - [ ] Age, college, interests displayed correctly

- [ ] **Actions**
  - [ ] Like button works (creates like in backend)
  - [ ] Dislike/pass button works
  - [ ] DM button navigates to ChatPage with correct user
  - [ ] Like creates match if mutual
  - [ ] Match notification appears
  - [ ] Toast messages display for all actions

- [ ] **Image Handling**
  - [ ] User-uploaded photos display correctly
  - [ ] Cloudinary URLs work
  - [ ] Local `/uploads` paths resolve correctly
  - [ ] Image errors handled gracefully

### Chat Page
- [ ] **Chat List**
  - [ ] All chats load from backend
  - [ ] Unread message counts accurate
  - [ ] Last message preview shows
  - [ ] Chat search functionality
  - [ ] Primary and Requests tabs work

- [ ] **Chat Requests**
  - [ ] New chat creates pending request
  - [ ] Request appears in "Requests" tab
  - [ ] Accept button works
  - [ ] Reject button works
  - [ ] Request banner displays correctly
  - [ ] Message input blocked until accepted
  - [ ] Socket.io events fire for requests

- [ ] **Messages**
  - [ ] Messages load from backend
  - [ ] Send message works
  - [ ] Messages appear immediately (optimistic update)
  - [ ] E2EE indicator displays
  - [ ] Messages encrypted/decrypted correctly
  - [ ] Message timestamps formatted correctly
  - [ ] Typing indicator works
  - [ ] Infinite scroll for older messages

- [ ] **Compatibility Quiz**
  - [ ] Quiz consent popup appears at 15-20 messages
  - [ ] Both users see consent popup simultaneously
  - [ ] Accept/Deny works
  - [ ] Denied user sees toast notification
  - [ ] Quiz starts when both accept
  - [ ] Quiz timer works (5 minutes)
  - [ ] Quiz submission works
  - [ ] Scores exchanged and displayed
  - [ ] Quiz doesn't reappear after completion

- [ ] **Delete Chat**
  - [ ] Delete chat button works
  - [ ] Confirmation dialog appears
  - [ ] Chat removed from list after deletion

### Likes Page
- [ ] **Likes Tab**
  - [ ] Users who liked you displayed
  - [ ] Premium blur overlay works
  - [ ] Like/Dislike/DM buttons work
  - [ ] Toast messages display

- [ ] **Matches Tab**
  - [ ] Matched users displayed
  - [ ] Compatibility scores shown
  - [ ] Mutual interests displayed

- [ ] **Premium Upgrade**
  - [ ] Premium modal opens
  - [ ] Plan selection works (Monthly/Quarterly/Semiannual)
  - [ ] Razorpay checkout opens
  - [ ] Payment processing works
  - [ ] Payment verification works
  - [ ] Premium status updates after payment
  - [ ] Likes become visible after premium upgrade

### Profile Page
- [ ] **Profile Display**
  - [ ] User data loads from backend
  - [ ] Profile images display correctly
  - [ ] Main registration photo shows first
  - [ ] Additional photos (up to 3) display
  - [ ] Top-right profile button uses dynamic image

- [ ] **Profile Edit**
  - [ ] Edit mode toggles correctly
  - [ ] All fields editable
  - [ ] Photo replacement works (click existing image)
  - [ ] New photos can be added
  - [ ] Save button updates backend
  - [ ] Toast message on success/error
  - [ ] No page reload on save
  - [ ] Settings (notifications) update correctly

- [ ] **Interests**
  - [ ] Interests can be added
  - [ ] Interests display correctly
  - [ ] No duplicate interests

### Search Page
- [ ] **Search Functionality**
  - [ ] Search by name works
  - [ ] Search results display
  - [ ] Profile images load correctly
  - [ ] User cards navigate correctly

### Confession Page
- [ ] **Confession List**
  - [ ] Confessions load from backend
  - [ ] Author avatars display correctly
  - [ ] Timestamps formatted correctly
  - [ ] Content displays correctly

- [ ] **Create Confession**
  - [ ] Create confession modal opens
  - [ ] Content validation (10-1000 chars)
  - [ ] Anonymous toggle works
  - [ ] Post button creates confession
  - [ ] New confession appears in list
  - [ ] Error handling for validation

- [ ] **Comments**
  - [ ] Comments load correctly
  - [ ] Add comment works
  - [ ] Comment likes work
  - [ ] Replies work
  - [ ] Reply likes work
  - [ ] Optimistic updates work

### Navigation Bar
- [ ] **Notification Counts**
  - [ ] Message count updates in real-time
  - [ ] Likes count updates in real-time
  - [ ] Confessions count updates in real-time
  - [ ] Profile count updates
  - [ ] Counts don't show 0 when no notifications
  - [ ] Navigation to pages works

## 🔄 Real-Time Updates Testing

### Socket.io Connection
- [ ] Socket.io connects on page load
- [ ] Connection status displayed in console
- [ ] Reconnection works after disconnect
- [ ] Authentication token sent correctly

### Global Updates (useGlobalSocketUpdates)
Test that pages refresh automatically when data changes on other pages:

- [ ] **Chat Updates**
  - [ ] Send message from User A → User B sees it on ChatPage
  - [ ] Send message while User B on DiscoverPage → chat list updates
  - [ ] Send message while User B on LikesPage → notification count updates
  - [ ] New chat created → appears in chat list immediately

- [ ] **Like/Match Updates**
  - [ ] User A likes User B from DiscoverPage
  - [ ] User B on LikesPage → likes list updates immediately
  - [ ] Match created → both users see match notification
  - [ ] Notification counts update in real-time

- [ ] **Confession Updates**
  - [ ] User A creates confession
  - [ ] User B on ConfessionPage → new confession appears
  - [ ] Comment added → appears for all users viewing confession

- [ ] **Chat Request Updates**
  - [ ] User A sends DM to User B
  - [ ] User B on ChatPage → request appears in Requests tab
  - [ ] User B accepts → User A sees acceptance immediately
  - [ ] User B rejects → User A sees rejection immediately

- [ ] **Premium Updates**
  - [ ] User A upgrades to premium
  - [ ] Profile page shows premium status
  - [ ] LikesPage shows all likes immediately

- [ ] **Profile Updates**
  - [ ] User A updates profile
  - [ ] Changes reflected immediately across all pages
  - [ ] Other users see updated profile info

## 🔒 Security Testing

### API Security
- [ ] **Authentication**
  - [ ] Protected routes require valid JWT token
  - [ ] Invalid token redirects to auth page
  - [ ] Token expiration handled correctly
  - [ ] 401 errors clear token and redirect

- [ ] **Rate Limiting**
  - [ ] Too many requests within time limit → 429 error
  - [ ] Rate limit resets after time period
  - [ ] Different endpoints have appropriate limits

- [ ] **Input Validation**
  - [ ] SQL injection attempts blocked
  - [ ] XSS attempts sanitized
  - [ ] Invalid email formats rejected
  - [ ] File uploads validated (type, size)
  - [ ] Special characters handled correctly

- [ ] **CORS**
  - [ ] Only allowed origins can access API
  - [ ] Preflight requests handled correctly
  - [ ] Credentials sent correctly

- [ ] **E2EE**
  - [ ] Messages encrypted before sending
  - [ ] Public keys exchanged correctly
  - [ ] Only recipient can decrypt messages
  - [ ] Encryption indicator displays

### Payment Security (Razorpay)
- [ ] Payment signature verification works
- [ ] Webhook signature verification works
- [ ] Payment amounts cannot be tampered
- [ ] Premium status updates only after verification
- [ ] Failed payments don't activate premium

## ⚠️ Error Handling Testing

### Network Errors
- [ ] **Offline Mode**
  - [ ] App handles offline gracefully
  - [ ] Error messages displayed
  - [ ] Retry mechanism works

- [ ] **Timeout Errors**
  - [ ] API timeouts handled (30s timeout)
  - [ ] User-friendly error messages
  - [ ] Retry options available

- [ ] **Server Errors**
  - [ ] 500 errors show user-friendly message
  - [ ] 404 errors handled correctly
  - [ ] 403 errors show appropriate message
  - [ ] Error details logged but not exposed

### Validation Errors
- [ ] Form validation errors display
- [ ] Field-specific error messages
- [ ] Validation prevents invalid submissions
- [ ] Error states clear on correction

### User Feedback
- [ ] All errors show toast notifications
- [ ] Success messages display correctly
- [ ] Loading states shown during operations
- [ ] No alerts() used (all toasts)

## 🚀 Performance Testing

- [ ] **Page Load**
  - [ ] Pages load within 3 seconds
  - [ ] Images lazy load
  - [ ] No unnecessary re-renders

- [ ] **Real-Time Performance**
  - [ ] Socket.io events processed quickly
  - [ ] No performance degradation with multiple sockets
  - [ ] Query invalidation doesn't cause lag

- [ ] **Large Data Sets**
  - [ ] Chat list handles 100+ chats
  - [ ] Message history loads efficiently
  - [ ] Infinite scroll performs well
  - [ ] Search results paginated if needed

## 🌐 Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### Mobile Testing
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] Images load correctly
- [ ] Forms usable on mobile
- [ ] Navigation accessible

## 📝 Test Scenarios

### Scenario 1: Complete User Journey
1. Register new account
2. Verify email
3. Complete profile with photos
4. Discover and like users
5. Match with user
6. Send chat request
7. Accept chat request
8. Exchange messages
9. Complete compatibility quiz
10. View scores

### Scenario 2: Real-Time Multi-User
1. User A and User B both logged in
2. User A likes User B from DiscoverPage
3. Verify User B sees like on LikesPage immediately
4. User B likes User A back
5. Verify match notification appears for both
6. User A sends DM
7. Verify User B sees request immediately
8. User B accepts
9. Both users send messages
10. Verify messages appear in real-time

### Scenario 3: Premium Upgrade Flow
1. User views blurred likes
2. Opens premium modal
3. Selects plan
4. Completes Razorpay payment
5. Verifies premium status updates
6. Verifies all likes become visible
7. Verifies premium badge appears

### Scenario 4: Error Recovery
1. Disconnect internet
2. Try to send message
3. Verify error toast appears
4. Reconnect internet
5. Verify message sends successfully
6. Verify data syncs correctly

## 🔍 Manual Testing Tools

### Browser DevTools
- Console: Check for errors, socket connections
- Network: Monitor API calls, WebSocket connections
- Application: Check localStorage, sessionStorage
- Performance: Monitor page load times

### Test Accounts Setup
```bash
# Create test accounts via registration flow
# Use different emails for each test user
# Store credentials securely for repeat testing
```

## ✅ Post-Testing Checklist

After completing all tests:
- [ ] All critical bugs fixed
- [ ] Performance acceptable
- [ ] Security vulnerabilities addressed
- [ ] Error handling comprehensive
- [ ] User experience smooth
- [ ] Documentation updated
- [ ] Ready for production deployment

## 📞 Reporting Issues

When reporting bugs, include:
1. **Environment**: Browser, OS, Device
2. **Steps to Reproduce**: Detailed steps
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Console Errors**: Any error messages
6. **Network Logs**: Failed API calls
7. **Screenshots**: If applicable

## 🎯 Priority Testing Areas

### Critical (Must Test)
- Authentication flow
- Chat messaging
- Real-time updates
- Payment processing
- Error handling

### Important (Should Test)
- Profile management
- Image uploads
- Search functionality
- Navigation bar counts

### Nice to Have (Can Test Later)
- Edge cases
- Performance optimization
- Browser compatibility
- Mobile responsiveness

---

**Last Updated**: $(date)
**Version**: 1.0.0

