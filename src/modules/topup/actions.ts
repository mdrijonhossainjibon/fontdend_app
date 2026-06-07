import * as types from './constants'

// Active Package
export const fetchActivePackageRequest = () => ({
    type: types.FETCH_ACTIVE_PACKAGE_REQUEST,
})

export const fetchActivePackageSuccess = (payload: any) => ({
    type: types.FETCH_ACTIVE_PACKAGE_SUCCESS,
    payload,
})

export const fetchActivePackageFailure = (error: string) => ({
    type: types.FETCH_ACTIVE_PACKAGE_FAILURE,
    payload: error,
})

// Buy Credits
export const buyCreditsRequest = (payload: { credits: number; price: number }) => ({
    type: types.BUY_CREDITS_REQUEST,
    payload,
})

export const buyCreditsSuccess = (payload: { message: string }) => ({
    type: types.BUY_CREDITS_SUCCESS,
    payload,
})

export const buyCreditsFailure = (error: string) => ({
    type: types.BUY_CREDITS_FAILURE,
    payload: error,
})

// Redeem Code
export const redeemCodeRequest = (payload: { code: string }) => ({
    type: types.REDEEM_CODE_REQUEST,
    payload,
})

export const redeemCodeSuccess = (payload: any) => ({
    type: types.REDEEM_CODE_SUCCESS,
    payload,
})

export const redeemCodeFailure = (error: string) => ({
    type: types.REDEEM_CODE_FAILURE,
    payload: error,
})

export const clearRedeemResult = () => ({
    type: types.CLEAR_REDEEM_RESULT,
})

// History
export const fetchHistoryRequest = () => ({
    type: types.FETCH_HISTORY_REQUEST,
})

export const fetchHistorySuccess = (payload: any) => ({
    type: types.FETCH_HISTORY_SUCCESS,
    payload,
})

export const fetchHistoryFailure = (error: string) => ({
    type: types.FETCH_HISTORY_FAILURE,
    payload: error,
})

// Cryptomus Deposit
export const createCryptomusInvoiceRequest = (payload: { amount: number; currency?: string; network?: string | null }) => ({
    type: types.CREATE_CRYPTOMUS_INVOICE_REQUEST,
    payload,
})

export const createCryptomusInvoiceSuccess = (payload: { url: string; invoiceId: string; walletAddress?: string; network?: string; paymentAmount?: number }) => ({
    type: types.CREATE_CRYPTOMUS_INVOICE_SUCCESS,
    payload,
})

export const createCryptomusInvoiceFailure = (error: string) => ({
    type: types.CREATE_CRYPTOMUS_INVOICE_FAILURE,
    payload: error,
})

export const resetCryptomusStatus = () => ({
    type: types.RESET_CRYPTOMUS_STATUS,
})

// Cryptomus Payment Polling
export const startCryptomusPolling = (invoiceId: string) => ({
    type: types.POLL_CRYPTOMUS_STATUS_START,
    payload: invoiceId,
})

export const stopCryptomusPolling = () => ({
    type: types.POLL_CRYPTOMUS_STATUS_STOP,
})

export const updateCryptomusStatus = (payload: { status: string; data?: any }) => ({
    type: types.POLL_CRYPTOMUS_STATUS_UPDATE,
    payload,
})

export const pollCryptomusPaymentDetails = (payload: { address?: string; network?: string; payerCurrency?: string }) => ({
    type: types.POLL_CRYPTOMUS_PAYMENT_DETAILS,
    payload,
})

// Invoice
export const fetchInvoiceRequest = (invoiceId: string) => ({
    type: types.FETCH_INVOICE_REQUEST,
    payload: invoiceId,
})

export const fetchInvoiceSuccess = (payload: any) => ({
    type: types.FETCH_INVOICE_SUCCESS,
    payload,
})

export const fetchInvoiceFailure = (error: string) => ({
    type: types.FETCH_INVOICE_FAILURE,
    payload: error,
})

export const resetInvoice = () => ({
    type: types.RESET_INVOICE,
})

// ── Check Pending Deposit ──
export const checkPendingDepositRequest = () => ({
    type: types.CHECK_PENDING_DEPOSIT_REQUEST,
})
export const checkPendingDepositSuccess = (pendingDeposit: any) => ({
    type: types.CHECK_PENDING_DEPOSIT_SUCCESS,
    payload: pendingDeposit,
})
export const checkPendingDepositFailure = (error: string) => ({
    type: types.CHECK_PENDING_DEPOSIT_FAILURE,
    payload: error,
})
