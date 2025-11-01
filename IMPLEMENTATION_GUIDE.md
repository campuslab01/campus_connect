# Real-Time Features Implementation Guide

## ✅ What's Been Implemented

### 1. Socket.io Server Setup
- **File**: `campus_connect_server/utils/socket.js`
- **Features**:
  - JWT authentication middleware
  - User rooms for notifications
  - Chat rooms for real-time messaging
  - Typing indicators
  - Read receipts
  - Match/like notifications
  - Confession broadcasts

### 2. Socket.io Client Context
- **File**: `src/contexts/SocketContext.tsx`
- **Features**:
  - Auto-connect on authentication
  - Connection state management
  - Reconnection handling
  - Typing indicators
  - Real-time message handlers

### 3. React Query Setup
- **File**: `src/hooks/useQueryClient.ts`
- **Features**:
  - Query client with optimized defaults
  - 5-minute stale time
  - 10-minute garbage collection
  - Automatic refetching disabled

### 4. Custom Hooks
- **File**: `src/hooks/useChatQuery.ts`
  - `useChats()` - Fetch chats list
  - `useInfiniteChats()` - Infinite scroll for chats
  - `useChatMessages()` - Fetch messages for a chat
  - `useInfiniteMessages()` - Infinite scroll for messages
  - `useSendMessage()` - Send message with optimistic updates

- **File**: `src/hooks/useUsersQuery.ts`
  - `useUserSuggestions()` - Infinite scroll suggestions
  - `useSearchUsers()` - Infinite scroll search
  - `useUserLikes()` - Fetch likes/matches

- **File**: `src/hooks/useConfessionsQuery.ts`
  - `useConfessions()` - Infinite scroll confessions
  - `useCreateConfession()` - Create with optimistic update
  - `useLikeConfession()` - Like with optimistic update

## 🔄 How to Use in Pages

### ChatPage Example (Partially Updated)
```typescript
import { useChats, useInfiniteMessages, useSendMessage } from '../hooks/useChatQuery';
import { useSocket } from '../contexts/SocketContext';

const ChatPage = () => {
  const { data, isLoading } = useChats();
  const socket = useSocket();
  const sendMessage = useSendMessage();
  
  // Real-time updates
  useEffect(() => {
    socket.onMessage((data) => {
      // Message will be added via React Query cache invalidation
    });
  }, [socket]);
};
```

## 📝 Next Steps to Complete Integration

### 1. Update DiscoverPage.tsx
Replace direct API calls with:
```typescript
import { useUserSuggestions } from '../hooks/useUsersQuery';

const { data, fetchNextPage, hasNextPage } = useUserSuggestions();
const users = data?.pages.flatMap(page => page.users) || [];
```

### 2. Update SearchPage.tsx
Replace with:
```typescript
import { useSearchUsers } from '../hooks/useUsersQuery';

const { data, fetchNextPage } = useSearchUsers(filters, !!debouncedQuery);
```

### 3. Update ConfessionPage.tsx
Replace with:
```typescript
import { useConfessions, useCreateConfession } from '../hooks/useConfessionsQuery';

const { data, fetchNextPage } = useConfessions();
const createConfession = useCreateConfession();
```

### 4. Update LikesPage.tsx
Replace with:
```typescript
import { useUserLikes } from '../hooks/useUsersQuery';

const { data } = useUserLikes();
```

### 5. Add Infinite Scroll to All Pages

Add this component for infinite scroll:
```typescript
const InfiniteScroll = ({ fetchNext, hasMore, isLoading }: any) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNext();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current && loadMoreRef.current) {
        observerRef.current.unobserve(loadMoreRef.current);
      }
    };
  }, [fetchNext, hasMore, isLoading]);

  return (
    <div ref={loadMoreRef} className="py-4 text-center">
      {isLoading && <div className="animate-spin h-6 w-6 mx-auto border-2 border-pink-500"></div>}
    </div>
  );
};
```

## 🔧 Socket.io Events Reference

### Client → Server
- `join:chat` - Join a chat room
- `leave:chat` - Leave a chat room
- `message:send` - Send a message
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator
- `message:read` - Mark messages as read

### Server → Client
- `message:new` - New message received
- `chat:updated` - Chat list updated
- `typing:start` - User started typing
- `typing:stop` - User stopped typing
- `match:new` - New match created
- `like:new` - New like received
- `confession:new` - New confession posted

## 💡 Optimistic Updates Pattern

All mutations use optimistic updates:
1. Update UI immediately
2. Send API request
3. On success: Refetch to sync
4. On error: Rollback changes

## 🚀 Platform Recommendations

See `PLATFORM_RECOMMENDATIONS.md` for:
- Free hosting options
- Real-time service alternatives
- Notification platforms
- Database hosting
- File storage

## 📊 Estimated Monthly Costs

### MVP Phase (0-100 users)
- **Total**: $0-7/month
  - Railway/Render: Free tier
  - MongoDB Atlas: Free tier
  - Socket.io: Self-hosted (free)
  - Cloudinary: Free tier
  - Firebase FCM: Free

### Growth Phase (100-1,000 users)
- **Total**: $7-25/month
  - Always-on hosting: $7/month
  - MongoDB M0: $0-9/month
  - Everything else: Free tier

### Scale Phase (1,000+ users)
- **Total**: $25-50/month
  - Upgraded database: ~$15/month
  - Better hosting: ~$15/month
  - Everything else: Free tier

