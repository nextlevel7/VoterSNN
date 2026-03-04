/**
 * Encrypt voters.json → public/voters.enc
 *
 * Algorithm : AES-256-GCM
 * Format    : base64( iv[12] + ciphertext[n] + authTag[16] )
 *
 * Run once:  node scripts/encrypt.js
 */

import { createCipheriv, randomBytes } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// ── Key (32 bytes / 256 bits) ──────────────────────────────────────────────
// Replace with your own key (or keep this one and rotate periodically).
const KEY_HEX = 'a15e8d5e22a716a40a37df744805a39dd6501b532cc278a04e2ecf5f98feb21d';
const KEY = Buffer.from(KEY_HEX, 'hex');

// ── Encrypt ────────────────────────────────────────────────────────────────
const plaintext = readFileSync(resolve(root, 'nepal_voter_data_complete.json'));
const iv = randomBytes(12); // 96-bit IV for GCM

const cipher = createCipheriv('aes-256-gcm', KEY, iv);
const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
const tag = cipher.getAuthTag(); // 16 bytes

// Layout: iv(12) | ciphertext(n) | tag(16)
const combined = Buffer.concat([iv, encrypted, tag]);
const outPath = resolve(root, 'public', 'voters.enc');
writeFileSync(outPath, combined.toString('base64'));

console.log(`✅  Encrypted → ${outPath}`);
console.log(`    Plaintext : ${(plaintext.length / 1024).toFixed(1)} KB`);
console.log(`    Encrypted : ${(combined.length / 1024).toFixed(1)} KB`);
