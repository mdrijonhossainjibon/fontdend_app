export interface AuthResult {
    timestamp: string;
    hash: string;
    signature: string;
}

export interface VerificationResult {
    success: boolean;
    reason?: string;
    data?: any;
    error?: string;
}

export interface DeviceFingerprint {
    ip: string;
    userAgent: string;
    acceptLanguage: string;
    acceptEncoding: string;
    timestamp: number;
}

export interface APICallHeaders {
    contentType?: 'json' | 'image' | 'text' | 'video';
    'X-CSRF-Token'?: string;
    'Authorization'?: string;
    [key: string]: any;
}

export interface AuthConfig {
    enabled: boolean;
    method?: 'hash' | 'signature';
    fingerprint?: any;
    secret?: string;
}

export interface APICallProps {
    method: string;
    url: string;
    baseURL?: string;
    body?: any;
    apiVersion?: string;
    headers?: APICallHeaders;
    params?: Record<string, any>;
    auth?: AuthConfig;
}

export interface APIResponse {
    status: number;
    response: any;
}

export interface TransactionObject {
    blockHash: string;
    blockNumber: string;
    from: string;
    gas: string;
    gasPrice: string;
    hash: string;
    input: string;
    nonce: string;
    to: string;
    transactionIndex: string;
    value: string;
    v: string;
    r: string;
    s: string;
}

export interface TransactionReceipt {
    transactionHash: string;
    transactionIndex: string;
    blockHash: string;
    blockNumber: string;
    from: string;
    to: string;
    cumulativeGasUsed: string;
    gasUsed: string;
    contractAddress?: string;
    logs: any[];
    logsBloom: string;
    status: string;
}

export interface RPCPayload {
    jsonrpc: string;
    method: string;
    params: any[];
    id: number;
}

export interface RPCResponse<T = any> {
    jsonrpc: string;
    id: number;
    result?: T;
    error?: { code: number; message: string };
}

export interface WalletInfo {
    privateKey: string;
    address: string;
}

export interface ValidationResult {
    success: boolean;
    error?: string;
}

export interface DepositEvent {
    from: string;
    to: string;
    amount: string;
    timestamp: string;
    txHash: string;
}

export interface SendResult {
    success: boolean;
    hash?: string;
    confirmations?: number;
    error?: string;
}
