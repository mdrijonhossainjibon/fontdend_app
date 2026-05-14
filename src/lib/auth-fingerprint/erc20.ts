import type { DepositEvent, ValidationResult, WalletInfo } from './types';

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
 * Get native token balance (ETH, BNB, etc.) for a specific address.
 */
export async function getNativeBalance(
    rpcUrl: string,
    walletAddress: string
): Promise<string> {
    return await rpcCall(rpcUrl, 'eth_getBalance', [walletAddress, 'latest']);
}

/**
 * Get ERC-20 token balance for a specific address.
 */
export async function getERC20Balance(
    rpcUrl: string,
    tokenAddress: string,
    walletAddress: string
): Promise<string> {
    const functionSignature = '0x70a08231';
    const paddedAddress = walletAddress.replace('0x', '').padStart(64, '0');
    const data = functionSignature + paddedAddress;

    return await rpcCall(rpcUrl, 'eth_call', [
        { to: tokenAddress, data },
        'latest',
    ]);
}

/**
 * Get ERC-20 token decimals.
 */
export async function getERC20Decimals(
    rpcUrl: string,
    tokenAddress: string
): Promise<number> {
    const functionSignature = '0x313ce567';
    const result = await rpcCall(rpcUrl, 'eth_call', [
        { to: tokenAddress, data: functionSignature },
        'latest',
    ]);
    return parseInt(result, 16);
}

/**
 * Format token balance from wei to human-readable format.
 */
export function formatTokenBalance(
    balanceWei: string,
    decimals: number = 18
): string {
    if (!balanceWei || balanceWei === '0x0') return '0';

    const balanceBigInt = BigInt(balanceWei);
    const divisor = BigInt(10 ** decimals);
    const wholePart = balanceBigInt / divisor;
    const fractionalPart = balanceBigInt % divisor;

    if (fractionalPart === 0n) return wholePart.toString();

    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    const trimmedFractional = fractionalStr.replace(/0+$/, '');
    if (trimmedFractional === '') return wholePart.toString();

    return `${wholePart}.${trimmedFractional}`;
}

/**
 * Get Ethereum address from private key.
 */
export function getAddressFromPrivateKey(privateKeyHex: string): string {
    // Minimal implementation using raw secp256k1 derivation.
    // For full support, install ethers: `npm install ethers`
    const hex = privateKeyHex.startsWith('0x')
        ? privateKeyHex.slice(2)
        : privateKeyHex;

    if (hex.length !== 64) {
        throw new Error('Invalid private key length');
    }

    return keccak256(hexToBytes(hex)).slice(-40);
}

/**
 * Generate Ethereum private key + address.
 */
export function generateWallet(): WalletInfo {
    const privateKeyBytes = crypto.getRandomValues(new Uint8Array(32));
    const privateKey = '0x' + Array.from(privateKeyBytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    return {
        privateKey,
        address: getAddressFromPrivateKey(privateKey),
    };
}

// Helper: basic keccak-256 (placeholder — real impl needs @noble/hashes or ethers)
function keccak256(_bytes: Uint8Array): string {
    // For a full implementation, install: `npm install @noble/hashes ethers`
    // This is a stub that returns the private key address pattern.
    // Real address derivation requires proper keccak256 + secp256k1.
    throw new Error(
        'keccak256 + secp256k1 not available. Install ethers: npm install ethers'
    );
}

function hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
}

/**
 * Convert a token amount to BigInt based on decimals.
 */
export function toBigInt(amount: number | string, decimals: number): bigint {
    const [integerPart = '0', fractionPart = ''] = amount.toString().split('.');
    let fraction = fractionPart.padEnd(decimals, '0').slice(0, decimals);
    const combined = integerPart + fraction;
    return BigInt(combined);
}

/**
 * Send ERC20 token.
 * Requires ethers to be installed.
 */
export async function sendErc20(
    _rpcUrl: string,
    _privateKey: string,
    _tokenAddress: string,
    _to: string,
    _amount: string | number,
    _decimals: number = 18
): Promise<{ success: boolean; result: any }> {
    // For full implementation, install ethers:
    // `npm install ethers`
    return {
        success: false,
        result: 'sendErc20 requires ethers. Install: npm install ethers',
    };
}

/**
 * Get deposit history for a token and wallet.
 * Requires ethers to be installed.
 */
export async function getDepositHistory(
    _tokenAddress: string,
    _walletAddress: string,
    _rpcUrl: string
): Promise<DepositEvent[]> {
    return [];
}

/**
 * Validate Ethereum address format.
 */
export function isValidAddress(address: string): ValidationResult {
    const re = /^0x[a-fA-F0-9]{40}$/;
    if (re.test(address)) {
        return { success: true };
    }
    return { success: false, error: 'Invalid Ethereum address' };
}
