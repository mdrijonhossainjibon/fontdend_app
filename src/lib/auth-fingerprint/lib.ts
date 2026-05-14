import type { SendResult, TransactionObject } from './types';

async function rpcCall(rpcUrl: string, method: string, params: any[]): Promise<any> {
    const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            method,
            params,
            id: 1,
        }),
    });
    const data = await response.json();
    if (data.error) throw new Error(`RPC Error: ${data.error.message}`);
    return data.result;
}

/**
 * Get transaction receipt by transaction hash.
 */
export async function getTransactionReceipt(
    rpcUrl: string,
    transactionHash: string
): Promise<any> {
    return await rpcCall(rpcUrl, 'eth_getTransactionReceipt', [transactionHash]);
}

/**
 * Get the current block number (hex string).
 */
export async function getBlockNumber(rpcUrl: string): Promise<string> {
    return await rpcCall(rpcUrl, 'eth_blockNumber', []);
}

/**
 * Get transaction by hash.
 */
export async function getTransactionByHash(
    rpcUrl: string,
    transactionHash: string
): Promise<TransactionObject> {
    return await rpcCall(rpcUrl, 'eth_getTransactionByHash', [transactionHash]);
}

/**
 * Get native ETH balance for a specific address.
 */
export async function getNativeBalance(
    rpcUrl: string,
    walletAddress: string,
    _blockParameter?: string
): Promise<string> {
    return await rpcCall(rpcUrl, 'eth_getBalance', [walletAddress, 'latest']);
}

/**
 * Format native balance from wei to ETH.
 */
export function formatNativeBalance(balanceWei: string): string {
    if (!balanceWei || balanceWei === '0x0') return '0';
    const wei = BigInt(balanceWei);
    const eth = wei / BigInt(10 ** 18);
    const remainder = wei % BigInt(10 ** 18);
    if (remainder === 0n) return eth.toString();
    const remStr = remainder.toString().padStart(18, '0').replace(/0+$/, '');
    return `${eth}.${remStr}`;
}

/**
 * Estimate gas for a transaction.
 */
export async function estimateGas(
    rpcUrl: string,
    transaction: Record<string, any>
): Promise<string> {
    return await rpcCall(rpcUrl, 'eth_estimateGas', [transaction]);
}

/**
 * Send native token (ETH).
 * Requires ethers to be installed.
 */
export async function sendNativeToken(
    _rpcUrl: string,
    _privateKey: string,
    _to: string,
    _amount: string | number
): Promise<SendResult> {
    return {
        success: false,
        error: 'sendNativeToken requires ethers. Install: npm install ethers',
    };
}

/**
 * Format block number from hex to decimal.
 */
export function formatBlockNumber(blockNumberHex: string): number {
    return parseInt(blockNumberHex, 16);
}

/**
 * Generate a new wallet.
 * Requires ethers to be installed.
 */
export async function generateHotWallet(): Promise<{
    address?: string;
    privateKey?: string;
    mnemonic?: any;
    success?: boolean;
    error?: any;
}> {
    return {
        success: false,
        error: 'generateHotWallet requires ethers. Install: npm install ethers',
    };
}
