/**
 * End-to-End Encryption (E2EE) Utility
 * Uses Web Crypto API for secure encryption/decryption
 * Implements AES-GCM for message encryption and ECDH for key exchange
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits for GCM
const TAG_LENGTH = 128; // 128 bits for authentication tag

interface EncryptedMessage {
  encrypted: string; // Base64 encoded encrypted content
  iv: string; // Base64 encoded initialization vector
  tag: string; // Base64 encoded authentication tag
}

/**
 * Generate a symmetric encryption key
 */
export async function generateKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate ECDH key pair for key exchange
 */
export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return await crypto.subtle.generateKey(
    {
      name: 'ECDH',
      namedCurve: 'P-256',
    },
    true, // extractable
    ['deriveKey']
  );
}

/**
 * Derive a shared secret from ECDH keys
 */
async function deriveSharedSecret(
  privateKey: CryptoKey,
  publicKey: CryptoKey
): Promise<CryptoKey> {
  return await crypto.subtle.deriveKey(
    {
      name: 'ECDH',
      public: publicKey,
    },
    privateKey,
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    false, // not extractable
    ['encrypt', 'decrypt']
  );
}

/**
 * Export a CryptoKey to base64 string
 */
export async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(exported);
}

/**
 * Import a key from base64 string
 */
export async function importKey(keyData: string): Promise<CryptoKey> {
  const keyBuffer = base64ToArrayBuffer(keyData);
  return await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
}

/**
 * Export an ECDH public key
 */
export async function exportPublicKey(publicKey: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('spki', publicKey);
  return arrayBufferToBase64(exported);
}

/**
 * Export an ECDH private key
 */
export async function exportPrivateKey(privateKey: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('pkcs8', privateKey);
  return arrayBufferToBase64(exported);
}

/**
 * Import an ECDH public key
 */
export async function importPublicKey(
  keyData: string
): Promise<CryptoKey> {
  const keyBuffer = base64ToArrayBuffer(keyData);
  return await crypto.subtle.importKey(
    'spki',
    keyBuffer,
    {
      name: 'ECDH',
      namedCurve: 'P-256',
    },
    true,
    []
  );
}

/**
 * Import an ECDH private key
 */
export async function importPrivateKey(
  keyData: string
): Promise<CryptoKey> {
  const keyBuffer = base64ToArrayBuffer(keyData);
  return await crypto.subtle.importKey(
    'pkcs8',
    keyBuffer,
    {
      name: 'ECDH',
      namedCurve: 'P-256',
    },
    true,
    ['deriveKey']
  );
}

/**
 * Encrypt a message
 */
export async function encryptMessage(
  message: string,
  key: CryptoKey
): Promise<EncryptedMessage> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  
  // Encrypt
  const encrypted = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: iv,
      tagLength: TAG_LENGTH,
    },
    key,
    data
  );
  
  // Extract tag (last 16 bytes in GCM mode)
  const tagLength = TAG_LENGTH / 8;
  const encryptedData = new Uint8Array(encrypted);
  const tag = encryptedData.slice(-tagLength);
  const ciphertext = encryptedData.slice(0, -tagLength);
  
  return {
    encrypted: arrayBufferToBase64(ciphertext.buffer),
    iv: arrayBufferToBase64(iv.buffer),
    tag: arrayBufferToBase64(tag.buffer),
  };
}

/**
 * Decrypt a message
 */
export async function decryptMessage(
  encryptedData: EncryptedMessage,
  key: CryptoKey
): Promise<string> {
  const iv = base64ToArrayBuffer(encryptedData.iv);
  const tag = base64ToArrayBuffer(encryptedData.tag);
  const encrypted = base64ToArrayBuffer(encryptedData.encrypted);
  
  // Combine encrypted data with tag
  const combined = new Uint8Array(encrypted.byteLength + tag.byteLength);
  combined.set(new Uint8Array(encrypted), 0);
  combined.set(new Uint8Array(tag), encrypted.byteLength);
  
  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv: iv,
      tagLength: TAG_LENGTH,
    },
    key,
    combined.buffer
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

/**
 * Derive a shared key from ECDH key pair and peer's public key
 */
export async function deriveSharedKey(
  myPrivateKey: CryptoKey,
  peerPublicKey: CryptoKey
): Promise<CryptoKey> {
  return await deriveSharedSecret(myPrivateKey, peerPublicKey);
}

/**
 * Encrypt private key with user's password (for storage)
 */
export async function encryptPrivateKey(
  privateKey: string,
  password: string
): Promise<string> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    false,
    ['encrypt']
  );
  
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encrypted = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: iv,
    },
    keyMaterial,
    base64ToArrayBuffer(privateKey)
  );
  
  // Combine salt, iv, and encrypted data
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);
  
  return arrayBufferToBase64(combined.buffer);
}

/**
 * Decrypt private key with user's password
 */
export async function decryptPrivateKey(
  encryptedKey: string,
  password: string
): Promise<string> {
  const encoder = new TextEncoder();
  const combined = base64ToArrayBuffer(encryptedKey);
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 16 + IV_LENGTH);
  const encrypted = combined.slice(16 + IV_LENGTH);
  
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const keyMaterial = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    false,
    ['decrypt']
  );
  
  const decrypted = await crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv: iv,
    },
    keyMaterial,
    encrypted
  );
  
  return arrayBufferToBase64(decrypted);
}

/**
 * Helper: Convert ArrayBuffer to Base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Helper: Convert Base64 to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Format encrypted message for storage
 */
export function formatEncryptedMessage(encrypted: EncryptedMessage): string {
  return JSON.stringify({
    e: encrypted.encrypted,
    i: encrypted.iv,
    t: encrypted.tag,
  });
}

/**
 * Parse encrypted message from storage
 */
export function parseEncryptedMessage(data: string): EncryptedMessage {
  try {
    const parsed = JSON.parse(data);
    return {
      encrypted: parsed.e,
      iv: parsed.i,
      tag: parsed.t,
    };
  } catch {
    throw new Error('Invalid encrypted message format');
  }
}

/**
 * Check if a string is an encrypted message
 */
export function isEncryptedMessage(data: string): boolean {
  try {
    const parsed = JSON.parse(data);
    return parsed.e && parsed.i && parsed.t;
  } catch {
    return false;
  }
}

