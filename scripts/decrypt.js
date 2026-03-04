/**
 * Decrypt an .enc file → plaintext JSON
 *
 * Algorithm : AES-256-GCM
 * Format    : base64( iv[12] | ciphertext[n] | authTag[16] )
 *
 * Usage:
 *   node scripts/decrypt.js <input.enc> <output.json>
 *
 * Default (no args):
 *   input  = public/voters.enc
 *   output = nepal_voter_data_complete.json
 *
 * After editing the JSON, re-encrypt and delete the plaintext:
 *   node scripts/encrypt.js --delete
 */

import { createDecipheriv } from 'crypto';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// ── AES-256-GCM key (must match encrypt.js) ────────────────────────────────
const KEY_HEX = 'a15e8d5e22a716a40a37df744805a39dd6501b532cc278a04e2ecf5f98feb21d';
const KEY = Buffer.from(KEY_HEX, 'hex');

// ── Parse args ─────────────────────────────────────────────────────────────
const args = process.argv.slice(2).filter(a => !a.startsWith('--'));

const inFile  = args[0] ? resolve(args[0]) : resolve(root, 'public', 'voters.enc');
const outFile = args[1] ? resolve(args[1]) : resolve(root, 'nepal_voter_data_complete.json');

if (!existsSync(inFile)) {
  console.error(`❌  Encrypted file not found: ${inFile}`);
  process.exit(1);
}

// ── Decrypt ────────────────────────────────────────────────────────────────
const base64 = readFileSync(inFile, 'utf8');
const buf = Buffer.from(base64, 'base64');

// Layout: iv(12) | ciphertext(n) | tag(16)
const iv         = buf.slice(0, 12);
const tag        = buf.slice(buf.length - 16);
const ciphertext = buf.slice(12, buf.length - 16);

const decipher = createDecipheriv('aes-256-gcm', KEY, iv);
decipher.setAuthTag(tag);

let plaintext;
try {
  plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
} catch {
  console.error('❌  Decryption failed — wrong key or file is corrupted.');
  process.exit(1);
}

writeFileSync(outFile, plaintext);

console.log(`✅  Decrypted`);
console.log(`    Input  : ${inFile}  (${(buf.length / 1024).toFixed(1)} KB)`);
console.log(`    Output : ${outFile}  (${(plaintext.length / 1024).toFixed(1)} KB)`);
console.log(`\n⚠️   Remember to delete the plaintext after editing:`);
console.log(`    node scripts/encrypt.js --delete`);
