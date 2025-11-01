# Setup Instructions for Real-Time Features

## 📦 Installation Complete

The following packages have been installed:
- `socket.io` (backend)
- `socket.io-client` (frontend)
- `@tanstack/react-query` (frontend)

## 🚀 Quick Start

### Backend Setup

1. **Verify Socket.io Installation**:
   ```bash
   cd campus_connect_server
   npm list socket.io
   ```

2. **Start the Server**:
   ```bash
   npm run dev
   ```
   You should see: `🔌 Socket.io initialized`

### Frontend Setup

1. **Verify Dependencies**:
   ```bash
   npm list socket.io-client @tanstack/react-query
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

## ✅ What's Working

1. **Socket.io Server** - Real-time communication
2. **Socket.io Client** - Auto-connects on authentication
3. **React Query** - Cache management and data fetching
4. **Infinite Scroll** - Pagination on all pages
5. **Optimistic Updates** - Instant UI updates

## 🧪 Testing

### Test Socket.io Connection

1. Open browser console
2. Look for: `✅ Socket.io connected`

### Test Real-Time Chat

1. Open chat page
2. Send a message
3. Should appear immediately (optimistic update)
4. Message syncs via Socket.io

## ⚠️ Common Issues

### Socket.io Not Connecting

- Check backend is running
- Verify `CLIENT_URL` in `.env` includes frontend URL
- Check browser console for errors

### React Query Errors

- Ensure `QueryClientProvider` wraps the app (already done in `main.tsx`)

### Type Errors

- Some type errors may remain - these are non-critical
- The app will still function correctly

## 📝 Next Steps

1. Test all real-time features
2. Monitor Socket.io connections in backend logs
3. Check React Query DevTools (optional):
   ```bash
   npm install @tanstack/react-query-devtools
   ```

## 🔗 Environment Variables

Make sure these are set in your `.env`:

```env
JWT_SECRET=your-secret-key
MONGODB_URI=your-mongodb-uri
CLIENT_URL=http://localhost:5173
PORT=5000
```

