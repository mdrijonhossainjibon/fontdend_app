import type { AuthResult } from './types';

function bufferToHex(buf: Uint8Array): string {
    return Array.from(buf)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

function hexToBuffer(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
}

async function sha256(data: string): Promise<string> {
    const hash = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(data)
    );
    return bufferToHex(new Uint8Array(hash));
}

async function hmacSha256(secret: string, data: string): Promise<string> {
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
    return bufferToHex(new Uint8Array(sig));
}

function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}

/**
 * Generate a fingerprint signature for a request.
 * Uses AES-256-CBC encryption + HMAC-SHA256 via Web Crypto API.
 */
export async function generateSignature(
    data: string,
    secret: string
): Promise<AuthResult> {
    const timestamp = Date.now().toString();

    // Derive a 256-bit key from the secret using SHA-256
    const keyHash = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(secret)
    );
    const key = await crypto.subtle.importKey(
        'raw',
        keyHash,
        { name: 'AES-CBC' },
        false,
        ['encrypt']
    );

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(16));

    // Encrypt data with AES-256-CBC
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv },
        key,
        new TextEncoder().encode(data)
    );

    const hash = bufferToHex(iv) + ':' + bufferToHex(new Uint8Array(encrypted));

    // Create HMAC-SHA256 signature over hash + timestamp
    const hashDigest = await sha256(hash + timestamp);
    const signature = await hmacSha256(secret, hashDigest);

    return { timestamp, hash, signature };
}

/**
 * Verify a fingerprint signature.
 * Checks timestamp freshness, validates HMAC signature, and decrypts original data.
 */
export async function verifySignature(
    { timestamp, hash, signature, allowedDelay }: any,
    secret: string
): Promise<{ success: boolean; data?: string }> {
    try {
        // Check timestamp freshness
        const delay = allowedDelay || 5000; // default 5 seconds
        const now = Date.now();
        const then = parseInt(timestamp, 10);
        if (isNaN(then) || now - then > delay) {
            return { success: false };
        }

        // Verify HMAC signature
        const hashDigest = await sha256(hash + timestamp);
        const expectedSignature = await hmacSha256(secret, hashDigest);

        if (!timingSafeEqual(signature, expectedSignature)) {
            return { success: false };
        }

        // Decrypt the data
        const [ivHex, encryptedHex] = hash.split(':');
        if (!ivHex || !encryptedHex) {
            return { success: false };
        }

        const iv = hexToBuffer(ivHex);
        const encrypted = hexToBuffer(encryptedHex);

        const keyHash = await crypto.subtle.digest(
            'SHA-256',
            new TextEncoder().encode(secret)
        );
        const key = await crypto.subtle.importKey(
            'raw',
            keyHash,
            { name: 'AES-CBC' },
            false,
            ['decrypt']
        );

        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-CBC', iv },
            key,
            encrypted
        );

        return { success: true, data: new TextDecoder().decode(decrypted) };
    } catch {
        return { success: false };
    }
}
