/**
 * Client-side AES-256-GCM decryption using the Web Crypto API.
 * The key is split and reassembled at runtime to make static scraping harder.
 *
 * Format expected: base64( iv[12] | ciphertext[n] | authTag[16] )
 */

// Key split into four segments — reassembled at call time
const _S = [
  'a15e8d5e',
  '22a716a40a37df74',
  '4805a39dd6501b53',
  '2cc278a04e2ecf5f98feb21d',
];

function _key() {
  return _S.join('').match(/.{2}/g).map(b => parseInt(b, 16));
}

export async function loadEncryptedVoters(url = '/voters.enc') {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status} fetching voter data`);

  const base64 = await response.text();

  // Decode base64 → Uint8Array
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  // Layout: iv[12] | ciphertext[n] | tag[16]
  const iv = bytes.slice(0, 12);
  const ciphertextWithTag = bytes.slice(12); // Web Crypto expects tag appended

  const rawKey = new Uint8Array(_key());
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    cryptoKey,
    ciphertextWithTag
  );

  return JSON.parse(new TextDecoder().decode(decrypted));
}
