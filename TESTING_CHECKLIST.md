# ✅ Quick Testing Checklist

Use this checklist for quick manual testing before deployment.

## 🚀 Pre-Deployment Quick Check

### Environment
- [ ] All environment variables set in Vercel/Render
- [ ] MongoDB connection working
- [ ] Cloudinary configured
- [ ] Razorpay keys configured
- [ ] Firebase configured
- [ ] Email service configured

### Authentication
- [ ] User can register
- [ ] User can login
- [ ] User can logout
- [ ] Password reset works
- [ ] Email verification works

### Core Features (5 min test)
- [ ] Discover page shows users
- [ ] Can like/dislike users
- [ ] Can send DM
- [ ] Chat page loads
- [ ] Can send messages
- [ ] Messages appear in real-time
- [ ] Profile page loads user data
- [ ] Can update profile
- [ ] Likes page shows users
- [ ] Confession page loads

### Real-Time Updates (2 min test)
- [ ] Open app in 2 browser windows (different users)
- [ ] Send message from Window 1
- [ ] Verify message appears in Window 2 immediately
- [ ] Like user in Window 1
- [ ] Verify like appears in Window 2 immediately

### Error Handling (2 min test)
- [ ] Try invalid login → error message appears
- [ ] Disconnect internet → appropriate error shown
- [ ] Try invalid form submission → validation errors shown
- [ ] All errors show toast notifications (no alerts)

### Payment (if testing premium)
- [ ] Premium modal opens
- [ ] Can select plan
- [ ] Razorpay checkout opens
- [ ] Payment flow works (test mode)

## 📱 Mobile Quick Check
- [ ] App loads on mobile browser
- [ ] Navigation works
- [ ] Forms usable
- [ ] Images load
- [ ] Touch interactions work

## 🔒 Security Quick Check
- [ ] Protected routes require auth
- [ ] Invalid tokens redirect to login
- [ ] CORS working correctly
- [ ] Images load from allowed origins only
- [ ] No sensitive data in console logs

## ⚡ Performance Quick Check
- [ ] Pages load in < 3 seconds
- [ ] Images load reasonably fast
- [ ] No console errors
- [ ] No memory leaks (check DevTools)

---

**Time Required**: ~15 minutes for full quick check
**Priority**: Complete at least Core Features + Real-Time Updates before deployment

