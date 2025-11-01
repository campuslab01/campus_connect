# Git Push Instructions

## For Frontend (Vercel Deployment)

Run these commands in the main directory:

```powershell
# 1. Check status
git status

# 2. Add all changes
git add .

# 3. Commit changes
git commit -m "Fix CORS for Vercel, fix linter errors, and disable matching check"

# 4. Push to GitHub (Vercel will auto-deploy)
git push origin main
```

## For Backend Server (Render Deployment)

Run these commands in the `server` directory:

```powershell
# 1. Navigate to server directory
cd server

# 2. Check status
git status

# 3. Add all changes
git add .

# 4. Commit changes
git commit -m "Fix CORS for all Vercel deployments and verify matching check disabled"

# 5. Push to GitHub (Render will auto-deploy)
git push origin main

# 6. Go back to main directory
cd ..
```

## If You Get Errors

### "Your branch is ahead of origin/main"
```powershell
git push origin main
```

### "Updates were rejected because the remote contains work"
```powershell
# Pull first, then push
git pull origin main --rebase
git push origin main
```

### "Permission denied"
- Check your SSH keys or GitHub credentials
- Make sure you're authenticated: `git config --global user.name` and `git config --global user.email`

### For Server Submodule Issues
```powershell
cd server
git pull origin main --rebase
git push origin main
```

## Files That Need to Be Pushed

### Frontend (Main Repo):
- ✅ `src/pages/ConfessionPage.tsx` - Fixed linter errors
- ✅ `src/pages/LikesPage.tsx` - Fixed linter errors  
- ✅ `src/pages/ChatPage.tsx` - Fixed require() errors
- ✅ `src/pages/ProfilePage.tsx` - Fixed require() errors

### Backend (Server Submodule):
- ✅ `server/server.js` - Fixed CORS for Vercel
- ✅ `server/controllers/chatController.js` - Disabled matching check

## After Pushing

1. **Vercel** will automatically deploy frontend changes (check Vercel dashboard)
2. **Render** will automatically deploy backend changes (check Render dashboard)
3. Wait 2-5 minutes for deployments to complete
4. Test the application - CORS errors should be resolved!

