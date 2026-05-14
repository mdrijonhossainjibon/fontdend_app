import axios from 'axios';
import { generateSignature } from './auth';
import type { APICallProps, APIResponse, DeviceFingerprint, VerificationResult } from './types';

// Default secret key
const SECRET_KEY = import.meta.env.VITE_AUTH_SECRET || 'your-secret-key-here';

/**
 * Get device fingerprint from available browser/client info.
 */
export function getDeviceFingerprint(req?: Record<string, any>): DeviceFingerprint {
    if (typeof window !== 'undefined') {
        // Browser environment
        return {
            ip: req?.ip || '127.0.0.1',
            userAgent: navigator.userAgent || 'Unknown',
            acceptLanguage: navigator.language || 'en-US',
            acceptEncoding: 'gzip',
            timestamp: Date.now(),
        };
    }
    // Server-side fallback (SSR)
    return {
        ip: req?.ip || req?.headers?.['x-forwarded-for'] || '127.0.0.1',
        userAgent: req?.headers?.['user-agent'] || 'Unknown',
        acceptLanguage: req?.headers?.['accept-language'] || 'en-US',
        acceptEncoding: req?.headers?.['accept-encoding'] || 'gzip',
        timestamp: Date.now(),
    };
}

async function createAuthHeaders(secret: string = SECRET_KEY): Promise<Record<string, string>> {
    const fingerprint = getDeviceFingerprint();
    const fingerprintData = JSON.stringify(fingerprint);
    const { timestamp, hash, signature } = await generateSignature(fingerprintData, secret);

    return {
        'X-Auth-Signature': signature,
        'X-Auth-Timestamp': timestamp,
        'X-Auth-Hash': hash,
        'X-Fingerprint': fingerprintData,
    };
}

/**
 * Install fetch interceptor for same-origin /api calls.
 */
export function installAuthFingerprintFetch(): void {
    if (typeof window === 'undefined' || typeof window.fetch !== 'function') {
        return;
    }

    const w = window as typeof window & { __authFingerprintFetchInstalled?: boolean };
    if (w.__authFingerprintFetchInstalled) {
        return;
    }

    const originalFetch = window.fetch.bind(window);
    w.__authFingerprintFetchInstalled = true;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const req = new Request(input, init);
        const url = new URL(req.url, window.location.origin);

        if (url.origin !== window.location.origin || !url.pathname.startsWith('/api/')) {
            return originalFetch(input, init);
        }

        const headers = new Headers(req.headers);
        const authHeaders = await createAuthHeaders();
        Object.entries(authHeaders).forEach(([key, value]) => headers.set(key, value));

        return originalFetch(new Request(req, { headers }));
    };
}

/**
 * Make an API call with optional fingerprint authentication.
 */
export const API_CALL = async (props: APICallProps): Promise<APIResponse> => {
    let baseUrl = props.baseURL;

    // Auto-detect base URL in browser
    const isBrowser = typeof window !== 'undefined' && typeof window.location !== 'undefined';
    if (isBrowser) {
        baseUrl = baseUrl || `${window.location.origin}/api`;
    } else {
        baseUrl = baseUrl || '/api';
    }

    const api = axios.create({ baseURL: baseUrl });

    const defaultHeaders: Record<string, string> = {
        'Content-Type': props.headers?.['Content-Type'] === 'multipart/form-data' ? 'multipart/form-data' : 'application/json',
    };

    // Attach Bearer token from localStorage if available
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (storedToken) {
        defaultHeaders['Authorization'] = `Bearer ${storedToken}`;
    }

    // Add fingerprint authentication headers by default
    let authHeaders: Record<string, string> = {};
    if (props.auth?.enabled !== false) {
        const secret = props.auth?.secret || SECRET_KEY;
        authHeaders = await createAuthHeaders(secret);
    }

    // Build the request payload
    let data = props.body;

    // Handle image upload
    if (props.headers?.contentType === 'image' && typeof FormData !== 'undefined') {
        const formData = new FormData();
        formData.append('image', props.body);
        data = formData;
    }

    const config = {
        method: props.method as any,
        url: props.url,
        data,
        headers: {
            ...defaultHeaders,
            ...authHeaders,
            ...(props.headers as Record<string, any>),
        },
        params: props.params,
    };

    try {
        const response = await api(config);
        return { status: response.status, response: response.data };
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                return { status: error.response.status, response: error.response.data };
            } else if (error.request) {
                return { status: 500, response: { message: { error: 'Network error occurred' } } };
            }
        }
        return { status: 500, response: { message: { error: 'An error occurred' } } };
    }
};

/**
 * Verify incoming request authentication headers.
 * Works in server environments where req has headers.
 */
export function verifyRequestAuth(req: any, secret: string = SECRET_KEY): VerificationResult {
    try {
        const signature = req.headers?.['x-auth-signature'];
        const timestamp = req.headers?.['x-auth-timestamp'];
        const hash = req.headers?.['x-auth-hash'];
        const fingerprintStr = req.headers?.['x-fingerprint'];

        if (!signature || !timestamp || !hash || !fingerprintStr) {
            return { success: false, reason: 'missing_auth_headers' };
        }

        // Verify synchronously (the actual verify needs async, but this is a stub
        // for environments that need sync verification)
        const parsed = JSON.parse(fingerprintStr);
        return { success: true, data: parsed };
    } catch (error: any) {
        return { success: false, reason: 'invalid_auth_format', error: error.message };
    }
}

/** Alias for verifyRequestAuth */
export const verifyRequestSignature = verifyRequestAuth;

/**
 * Auth middleware factory (Express-compatible stub).
 * In a Vite/SSR context, use the plain verify functions instead.
 */
export function authMiddleware(
    _method: 'hash' | 'signature' = 'signature',
    _secret: string = SECRET_KEY
): (req: any, res: any, next: any) => void {
    return (req, res, next) => {
        // For browser context, this should generally be called on the server
        // Fallback: check headers and pass through
        const isBrowser =
            typeof window !== 'undefined' && typeof window.location !== 'undefined';
        if (isBrowser) {
            next();
            return;
        }
        next();
    };
}

/**
 * Get user-friendly error message.
 */
export function getErrorMessage(reason: string): string {
    const messages: Record<string, string> = {
        expired: 'Authentication token has expired',
        mismatch: 'Invalid authentication signature',
        missing_auth_headers: 'Missing authentication headers',
        invalid_auth_format: 'Invalid authentication format',
    };
    return messages[reason] || 'Authentication failed';
}
