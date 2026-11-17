/**
 * Pure TypeScript RFC 7914 scrypt implementation for Browser + Node.
 * Matches Node.js `crypto.scryptSync(password, salt, keyLen, { N: 16384, r: 8, p: 1 })`
 * so `scrypt$<salt>$<hexHash>` credentials verified on Express also verify cleanly
 * when falling back to Firestore on static hosts or cross-device networks.
 */

const utf8Encoder = new TextEncoder();

// Compact pure-TS SHA-256 + HMAC-SHA256 + PBKDF2(c=1) fallback for non-HTTPS contexts
const SHA256_K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

function sha256(data: Uint8Array): Uint8Array {
  const bitLen = data.length * 8;
  const paddedLen = Math.ceil((data.length + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLen);
  padded.set(data);
  padded[data.length] = 0x80;
  const dv = new DataView(padded.buffer);
  dv.setUint32(paddedLen - 8, Math.floor(bitLen / 0x100000000), false);
  dv.setUint32(paddedLen - 4, bitLen >>> 0, false);

  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;

  const w = new Uint32Array(64);
  for (let offset = 0; offset < paddedLen; offset += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = dv.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i++) {
      const s0 =
        ((w[i - 15] >>> 7) | (w[i - 15] << 25)) ^
        ((w[i - 15] >>> 18) | (w[i - 15] << 14)) ^
        (w[i - 15] >>> 3);
      const s1 =
        ((w[i - 2] >>> 17) | (w[i - 2] << 15)) ^
        ((w[i - 2] >>> 19) | (w[i - 2] << 13)) ^
        (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let i = 0; i < 64; i++) {
      const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + SHA256_K[i] + w[i]) >>> 0;
      const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  const out = new Uint8Array(32);
  const outView = new DataView(out.buffer);
  outView.setUint32(0, h0, false);
  outView.setUint32(4, h1, false);
  outView.setUint32(8, h2, false);
  outView.setUint32(12, h3, false);
  outView.setUint32(16, h4, false);
  outView.setUint32(20, h5, false);
  outView.setUint32(24, h6, false);
  outView.setUint32(28, h7, false);
  return out;
}

function hmacSha256(key: Uint8Array, message: Uint8Array): Uint8Array {
  const blockSize = 64;
  const normalizedKey = key.length > blockSize ? sha256(key) : key;
  const oPad = new Uint8Array(blockSize);
  const iPad = new Uint8Array(blockSize);
  for (let i = 0; i < blockSize; i++) {
    const k = i < normalizedKey.length ? normalizedKey[i] : 0;
    oPad[i] = k ^ 0x5c;
    iPad[i] = k ^ 0x36;
  }
  const inner = new Uint8Array(blockSize + message.length);
  inner.set(iPad, 0);
  inner.set(message, blockSize);
  const innerHash = sha256(inner);

  const outer = new Uint8Array(blockSize + 32);
  outer.set(oPad, 0);
  outer.set(innerHash, blockSize);
  return sha256(outer);
}

async function pbkdf2Sha256SingleIteration(
  passwordBytes: Uint8Array,
  saltBytes: Uint8Array,
  dkLen: number
): Promise<Uint8Array> {
  const subtle = typeof globalThis !== 'undefined' ? globalThis.crypto?.subtle : undefined;
  if (subtle) {
    try {
      const key = await subtle.importKey(
        'raw',
        passwordBytes as BufferSource,
        'PBKDF2',
        false,
        ['deriveBits']
      );
      const bits = await subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: saltBytes as BufferSource,
          iterations: 1,
          hash: 'SHA-256',
        },
        key,
        dkLen * 8
      );
      return new Uint8Array(bits);
    } catch {
      // Fall through to pure-TS implementation if WebCrypto fails
    }
  }

  const blocks = Math.ceil(dkLen / 32);
  const dk = new Uint8Array(blocks * 32);
  const saltPlusIndex = new Uint8Array(saltBytes.length + 4);
  saltPlusIndex.set(saltBytes, 0);
  const idxView = new DataView(saltPlusIndex.buffer);
  for (let blockNum = 1; blockNum <= blocks; blockNum++) {
    idxView.setUint32(saltBytes.length, blockNum, false);
    const u1 = hmacSha256(passwordBytes, saltPlusIndex);
    dk.set(u1, (blockNum - 1) * 32);
  }
  return dk.subarray(0, dkLen);
}

function salsa20_8(b: Uint32Array, x: Uint32Array): void {
  for (let i = 0; i < 16; i++) x[i] = b[i];

  for (let i = 0; i < 4; i++) {
    let t: number;
    t = (x[0] + x[12]) | 0; x[4] ^= (t << 7) | (t >>> 25);
    t = (x[4] + x[0]) | 0; x[8] ^= (t << 9) | (t >>> 23);
    t = (x[8] + x[4]) | 0; x[12] ^= (t << 13) | (t >>> 19);
    t = (x[12] + x[8]) | 0; x[0] ^= (t << 18) | (t >>> 14);

    t = (x[5] + x[1]) | 0; x[9] ^= (t << 7) | (t >>> 25);
    t = (x[9] + x[5]) | 0; x[13] ^= (t << 9) | (t >>> 23);
    t = (x[13] + x[9]) | 0; x[1] ^= (t << 13) | (t >>> 19);
    t = (x[1] + x[13]) | 0; x[5] ^= (t << 18) | (t >>> 14);

    t = (x[10] + x[6]) | 0; x[14] ^= (t << 7) | (t >>> 25);
    t = (x[14] + x[10]) | 0; x[2] ^= (t << 9) | (t >>> 23);
    t = (x[2] + x[14]) | 0; x[6] ^= (t << 13) | (t >>> 19);
    t = (x[6] + x[2]) | 0; x[10] ^= (t << 18) | (t >>> 14);

    t = (x[15] + x[11]) | 0; x[3] ^= (t << 7) | (t >>> 25);
    t = (x[3] + x[15]) | 0; x[7] ^= (t << 9) | (t >>> 23);
    t = (x[7] + x[3]) | 0; x[11] ^= (t << 13) | (t >>> 19);
    t = (x[11] + x[7]) | 0; x[15] ^= (t << 18) | (t >>> 14);

    t = (x[0] + x[3]) | 0; x[1] ^= (t << 7) | (t >>> 25);
    t = (x[1] + x[0]) | 0; x[2] ^= (t << 9) | (t >>> 23);
    t = (x[2] + x[1]) | 0; x[3] ^= (t << 13) | (t >>> 19);
    t = (x[3] + x[2]) | 0; x[0] ^= (t << 18) | (t >>> 14);

    t = (x[5] + x[4]) | 0; x[6] ^= (t << 7) | (t >>> 25);
    t = (x[6] + x[5]) | 0; x[7] ^= (t << 9) | (t >>> 23);
    t = (x[7] + x[6]) | 0; x[4] ^= (t << 13) | (t >>> 19);
    t = (x[4] + x[7]) | 0; x[5] ^= (t << 18) | (t >>> 14);

    t = (x[10] + x[9]) | 0; x[11] ^= (t << 7) | (t >>> 25);
    t = (x[11] + x[10]) | 0; x[8] ^= (t << 9) | (t >>> 23);
    t = (x[8] + x[11]) | 0; x[9] ^= (t << 13) | (t >>> 19);
    t = (x[9] + x[8]) | 0; x[10] ^= (t << 18) | (t >>> 14);

    t = (x[15] + x[14]) | 0; x[12] ^= (t << 7) | (t >>> 25);
    t = (x[12] + x[15]) | 0; x[13] ^= (t << 9) | (t >>> 23);
    t = (x[13] + x[12]) | 0; x[14] ^= (t << 13) | (t >>> 19);
    t = (x[14] + x[13]) | 0; x[15] ^= (t << 18) | (t >>> 14);
  }

  for (let i = 0; i < 16; i++) {
    b[i] = (b[i] + x[i]) >>> 0;
  }
}

function scryptBlockMix(
  b: Uint32Array,
  y: Uint32Array,
  salsaX: Uint32Array,
  salsaTmp: Uint32Array,
  r: number
): void {
  const lastChunkStart = (2 * r - 1) * 16;
  for (let k = 0; k < 16; k++) {
    salsaX[k] = b[lastChunkStart + k];
  }

  for (let i = 0; i < 2 * r; i++) {
    const chunkOffset = i * 16;
    for (let k = 0; k < 16; k++) {
      salsaX[k] ^= b[chunkOffset + k];
    }
    salsa20_8(salsaX, salsaTmp);
    const outOffset = ((i & 1) === 0 ? i >>> 1 : r + (i >>> 1)) * 16;
    for (let k = 0; k < 16; k++) {
      y[outOffset + k] = salsaX[k];
    }
  }

  b.set(y);
}

function scryptROMix(blockBytes: Uint8Array, N: number, r: number): void {
  const bWords = 2 * r * 16;
  const x = new Uint32Array(bWords);
  const y = new Uint32Array(bWords);
  const salsaX = new Uint32Array(16);
  const salsaTmp = new Uint32Array(16);
  const dv = new DataView(blockBytes.buffer, blockBytes.byteOffset, blockBytes.byteLength);

  for (let k = 0; k < bWords; k++) {
    x[k] = dv.getUint32(k * 4, true);
  }

  const v = new Uint32Array(N * bWords);
  for (let i = 0; i < N; i++) {
    v.set(x, i * bWords);
    scryptBlockMix(x, y, salsaX, salsaTmp, r);
  }

  const mask = N - 1;
  const intOffset = (2 * r - 1) * 16;
  for (let i = 0; i < N; i++) {
    const j = (x[intOffset] & mask) >>> 0;
    const vStart = j * bWords;
    for (let k = 0; k < bWords; k++) {
      x[k] ^= v[vStart + k];
    }
    scryptBlockMix(x, y, salsaX, salsaTmp, r);
  }

  for (let k = 0; k < bWords; k++) {
    dv.setUint32(k * 4, x[k], true);
  }
}

export async function deriveScryptBytesAsync(
  password: string,
  salt: string,
  keyLen = 64,
  N = 16384,
  r = 8,
  p = 1
): Promise<Uint8Array> {
  const pwdBytes = utf8Encoder.encode(password);
  const saltBytes = utf8Encoder.encode(salt);
  const blockSize = 128 * r;
  const b = await pbkdf2Sha256SingleIteration(pwdBytes, saltBytes, p * blockSize);
  for (let i = 0; i < p; i++) {
    scryptROMix(b.subarray(i * blockSize, (i + 1) * blockSize), N, r);
  }
  return pbkdf2Sha256SingleIteration(pwdBytes, b, keyLen);
}

function hexToBytes(hex: string): Uint8Array | null {
  if (!hex || hex.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(hex)) return null;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function bytesToHex(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i++) {
    s += bytes[i].toString(16).padStart(2, '0');
  }
  return s;
}

export function timingSafeBytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

/**
 * Verifies a plaintext password/PIN against a `scrypt$<salt>$<hexHash>` string.
 * Matches Node `server.ts` verifyPassword() semantics (checks both exact and trimmed forms).
 */
export async function verifyScryptBrowserAsync(plain: string, storedHash?: string | null): Promise<boolean> {
  if (!storedHash || !String(storedHash).trim()) return false;
  const s = String(storedHash).trim();
  if (!s.startsWith('scrypt$')) return false;

  const parts = s.split('$');
  if (parts.length !== 3) return false;
  const [, salt, hexHash] = parts;
  if (!salt || !hexHash) return false;

  const expected = hexToBytes(hexHash);
  if (!expected || expected.length === 0) return false;

  const rawCandidate = String(plain || '');
  const trimmedCandidate = rawCandidate.trim();
  const candidates = rawCandidate === trimmedCandidate ? [rawCandidate] : [rawCandidate, trimmedCandidate];

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const actual = await deriveScryptBytesAsync(candidate, salt, expected.length);
      if (timingSafeBytesEqual(actual, expected)) {
        return true;
      }
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Generates a Node-compatible `scrypt$<salt>$<hexHash>` in the browser when saving offline resets.
 */
export async function hashPasswordBrowserAsync(plain: string): Promise<string> {
  const clean = String(plain || '').trim();
  if (!clean) return '';
  if (clean.startsWith('scrypt$')) return clean;

  const saltBytes = new Uint8Array(16);
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(saltBytes);
  } else {
    for (let i = 0; i < 16; i++) {
      saltBytes[i] = Math.floor(Math.random() * 256);
    }
  }
  const salt = bytesToHex(saltBytes);
  const derived = await deriveScryptBytesAsync(clean, salt, 64);
  return `scrypt$${salt}$${bytesToHex(derived)}`;
}
