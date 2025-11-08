import nacl from 'tweetnacl';
import { decodeUTF8, encodeUTF8, encodeBase64, decodeBase64 } from 'tweetnacl-util';

// Generate a new key pair (public and private)
export const generateKeyPair = () => {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: encodeBase64(keyPair.publicKey),
    secretKey: encodeBase64(keyPair.secretKey),
  };
};

// Create a shared secret
export const createSharedSecret = (theirPublicKey: string, mySecretKey: string) => {
  const theirPublicKeyBytes = decodeBase64(theirPublicKey);
  const mySecretKeyBytes = decodeBase64(mySecretKey);
  const sharedSecret = nacl.box.before(theirPublicKeyBytes, mySecretKeyBytes);
  return encodeBase64(sharedSecret);
};

// Encrypt a message
export const encryptMessage = (message: string, sharedSecret: string) => {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const messageBytes = decodeUTF8(message);
  const sharedSecretBytes = decodeBase64(sharedSecret);

  const encrypted = nacl.box.after(messageBytes, nonce, sharedSecretBytes);

  const fullMessage = new Uint8Array(nonce.length + encrypted.length);
  fullMessage.set(nonce);
  fullMessage.set(encrypted, nonce.length);

  return encodeBase64(fullMessage);
};

// Decrypt a message
export const decryptMessage = (messageWithNonce: string, sharedSecret: string) => {
  const sharedSecretBytes = decodeBase64(sharedSecret);
  const messageWithNonceBytes = decodeBase64(messageWithNonce);

  const nonce = messageWithNonceBytes.slice(0, nacl.box.nonceLength);
  const message = messageWithNonceBytes.slice(nacl.box.nonceLength);

  const decrypted = nacl.box.open.after(message, nonce, sharedSecretBytes);

  if (!decrypted) {
    throw new Error('Failed to decrypt message');
  }

  return encodeUTF8(decrypted);
};