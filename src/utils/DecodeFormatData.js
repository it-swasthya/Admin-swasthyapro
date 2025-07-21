import CryptoJS from "crypto-js";
import { inflate } from 'pako';
export const decodeBase64 = (encoded) => {
  try {
    return JSON.parse(atob(encoded));
  } catch (e) {
    console.error("Decoding failed:", e);
    return null;
  }
};

export const decryptAES = (encryptedData) => {

  const key = CryptoJS.enc.Utf8.parse(process.env.ENCRYPTION_KEY);
  // const iv = CryptoJS.enc.Utf8.parse(
  //   ivFromServer || process.env.ENCRYPTION_IV
  // );

  const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
};

// import { inflate } from 'pako';

function base64ToArrayBuffer(base64) {
  
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function decryptEncryptedData({ encryptedData, authTag, iv }) {
  const keyRaw = '3p1sYKw8dQ0vJwExU7r4TyZhLg9Bv2aN';
  const ivRaw = 'G9hT4mX2q1Rz';


  // Ensure key is 32 bytes
  const keyBytes = new TextEncoder().encode(keyRaw);
  const keyBuffer = new Uint8Array(32);
  keyBuffer.set(keyBytes.slice(0, 32));

  // Ensure IV is 12 bytes
  const ivBytes = new TextEncoder().encode(ivRaw);
  const ivBuffer = new Uint8Array(12);
  ivBuffer.set(ivBytes.slice(0, 12));

  const encryptedBytes = base64ToArrayBuffer(encryptedData);
  const tagBytes = base64ToArrayBuffer(authTag);

  const combined = new Uint8Array(encryptedBytes.byteLength + tagBytes.byteLength);
  combined.set(new Uint8Array(encryptedBytes), 0);
  combined.set(new Uint8Array(tagBytes), encryptedBytes.byteLength);

  try {
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBuffer,
        tagLength: 128
      },
      cryptoKey,
      combined
    );

    const decompressed = inflate(new Uint8Array(decryptedBuffer), { to: 'string' });
    return JSON.parse(decompressed);
  } catch (err) {
    console.error('Decryption failed:', err);
    return null;
  }
}