import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ''; // Must be 32 bytes (64 hex characters)
const IV_LENGTH = 16; // For AES, this is always 16

export function encrypt(text: string): { encryptedData: string; iv: string } {
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY is not set in environment variables');
  }

  // Convert hex key to buffer if it's in hex format, otherwise use as is (if 32 bytes)
  // For robust handling, we expect a 32-byte key. 
  // If provided as hex string (64 chars), we convert it.
  const keyBuffer = Buffer.from(ENCRYPTION_KEY, 'hex');

  if (keyBuffer.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return {
    encryptedData: encrypted.toString('hex'),
    iv: iv.toString('hex')
  };
}

export function decrypt(encryptedData: string, iv: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY is not set in environment variables');
  }

  const keyBuffer = Buffer.from(ENCRYPTION_KEY, 'hex');

  if (keyBuffer.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
  }

  const ivBuffer = Buffer.from(iv, 'hex');
  const encryptedText = Buffer.from(encryptedData, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, ivBuffer);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}
