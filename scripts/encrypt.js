/**
 * Encrypt a plaintext JSON file → encrypted .enc file
 *
 * Algorithm : AES-256-GCM
 * Format    : base64( iv[12] | ciphertext[n] | authTag[16] )
 *
 * Usage:
 *   node scripts/encrypt.js <input.json> <output.enc>
 *
 * Default (no args):
 *   input  = nepal_voter_data_complete.json
 *   output = public/voters.enc
 *
 * After encrypting the source, delete the plaintext file manually or pass --delete:
 *   node scripts/encrypt.js --delete
 */

import { createCipheriv, randomBytes } from 'crypto';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// ── AES-256-GCM key ────────────────────────────────────────────────────────
const KEY_HEX = 'a15e8d5e22a716a40a37df744805a39dd6501b532cc278a04e2ecf5f98feb21d';
const KEY = Buffer.from(KEY_HEX, 'hex');

// ── Parse args ─────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const shouldDelete = args.includes('--delete');
const positional = args.filter(a => !a.startsWith('--'));

const inFile  = positional[0] ? resolve(positional[0]) : resolve(root, 'nepal_voter_data_complete.json');
const outFile = positional[1] ? resolve(positional[1]) : resolve(root, 'public', 'voters.enc');

if (!existsSync(inFile)) {
  console.error(`❌  Input not found: ${inFile}`);
  process.exit(1);
}

// ── Encrypt ────────────────────────────────────────────────────────────────
const plaintext = readFileSync(inFile);
const iv = randomBytes(12);

const cipher = createCipheriv('aes-256-gcm', KEY, iv);
const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
const tag = cipher.getAuthTag();

// iv(12) | ciphertext(n) | tag(16)
const combined = Buffer.concat([iv, ciphertext, tag]);
writeFileSync(outFile, combined.toString('base64'));

console.log(`✅  Encrypted`);
console.log(`    Input  : ${inFile}  (${(plaintext.length / 1024).toFixed(1)} KB)`);
console.log(`    Output : ${outFile}  (${(combined.length / 1024).toFixed(1)} KB)`);

if (shouldDelete) {
  unlinkSync(inFile);
  console.log(`🗑️   Deleted plaintext: ${inFile}`);
}
