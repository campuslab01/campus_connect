# End-to-End Encryption (E2EE) Implementation

## Overview
This application implements end-to-end encryption for chat messages using the Web Crypto API. Messages are encrypted on the client side before being sent to the server, and decrypted on the recipient's device. The server cannot read the message content.

## Architecture

### Frontend Components

1. **`src/utils/e2ee.ts`** - Core encryption utilities
   - AES-GCM encryption/decryption
   - ECDH key pair generation and key exchange
   - Private key encryption with user password
   - Message formatting helpers

2. **`src/services/e2eeService.ts`** - High-level E2EE service
   - Key pair management
   - Key exchange with other users
   - Message encryption/decryption for specific users
   - LocalStorage management for keys

3. **`src/hooks/useE2EE.ts`** - React hook for E2EE
   - Initializes E2EE on login
   - Manages public key synchronization with backend
   - Provides encryption/decryption functions
   - Handles key exchange automatically

4. **`src/components/E2EEIndicator.tsx`** - UI component
   - Displays "End-to-end encrypted" badge in chat header
   - Visual indicator similar to WhatsApp

### Backend Components

1. **`server/models/User.js`** - User model
   - Added `e2eePublicKey` field to store user's public key

2. **`server/controllers/e2eeController.js`** - E2EE endpoints
   - `PUT /api/e2ee/public-key` - Save user's public key
   - `GET /api/e2ee/public-key` - Get current user's public key
   - `GET /api/e2ee/public-key/:userId` - Get another user's public key

3. **`server/routes/e2ee.js`** - E2EE routes
   - Protected routes requiring authentication

## How It Works

### 1. Key Generation (On Login)
- User logs in → E2EE service initializes
- Generates ECDH key pair (or loads from localStorage if exists)
- Encrypts private key with user password and stores locally
- Public key is sent to backend and stored in MongoDB

### 2. Key Exchange (Before First Message)
- When user opens chat with another user:
  - Frontend fetches the other user's public key from backend
  - Uses ECDH to derive a shared secret key
  - Stores shared key for this conversation
- This happens automatically and transparently

### 3. Message Encryption (Sending)
- User types message → `handleSendMessage` called
- If E2EE is initialized:
  - Gets shared key for recipient (or exchanges keys if needed)
  - Encrypts message using AES-GCM
  - Sends encrypted message to backend
- Backend stores encrypted message (cannot read it)

### 4. Message Decryption (Receiving)
- Messages are fetched from backend (encrypted)
- Frontend decrypts each message using shared key
- Decrypted messages are displayed to user

## Security Features

- **AES-GCM Encryption**: Industry-standard symmetric encryption
- **ECDH Key Exchange**: Secure key derivation without transmitting keys
- **Private Key Protection**: Encrypted with user password using PBKDF2
- **Forward Secrecy**: Keys are re-derived per session (optional enhancement)
- **No Server Access**: Server never sees plaintext messages

## Browser Compatibility

- Uses Web Crypto API (available in all modern browsers)
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- No external libraries required

## User Experience

- **Automatic**: Encryption happens transparently
- **Visual Indicator**: Green "End-to-end encrypted" badge in chat header
- **Backward Compatible**: Old unencrypted messages still display
- **Error Handling**: Falls back to unencrypted if encryption fails

## Future Enhancements

1. **Perfect Forward Secrecy**: Rotate keys periodically
2. **Key Verification**: QR code scanning to verify keys
3. **Device Key Management**: Multiple device support
4. **Key Backup**: Secure cloud backup of encrypted keys
5. **Group Chat E2EE**: Extend to group conversations

## Notes

- Private keys are stored in browser localStorage (encrypted)
- If user clears browser data, they'll need to regenerate keys
- Keys are device-specific (not synced across devices)
- Messages are encrypted end-to-end, but metadata (timestamps, sender) is not

