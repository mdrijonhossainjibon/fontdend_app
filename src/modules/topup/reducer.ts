import * as types from './constants'

export interface PendingDepositInfo {
    amountUSD: number
    cryptoName: string
    networkName: string
    address: string
    createdAt: string
    expiresAt: string
    status?: string
    notes?: string
    cryptomusUrl?: string
    invoiceId?: string
}

export interface ActivePackageInfo {
    balance: number
    activePackage: {
        code: string
        name: string
        credits: number
        creditsUsed: number
    } | null
    pendingDeposit: PendingDepositInfo | null
}

export interface RedeemResult {
    creditsAdded: number
    totalCredits: number
    code: string
    package?: {
        code: string
        name?: string
        type: string
        credits: number
        validityDays: number
        recognition?: string
    } | null
}

export interface HistoryStats {
    totalSpent: number
    totalCreditsAdded: number
    totalCreditsUsed: number
    thisMonthSpent: number
    transactionCount: number
    redeemCount: number
}

export interface TransactionItem {
    id: string
    type: string
    credits: number
    amount: number
    label: string
    meta: string
    date: string
    time: string
    status?: string
    invoiceId?: string
    address?: string
    cryptoName?: string
    networkName?: string
    expiresAt?: string | null
}

export interface TopupState {
    activePackage: ActivePackageInfo | null
    loading: boolean
    error: string | null
    pendingDeposit: PendingDepositInfo | null

    buying: boolean

    redeeming: boolean
    redeemResult: RedeemResult | null

    history: { stats: HistoryStats; transactions: TransactionItem[] } | null
    historyLoading: boolean
    historyError: string | null

    cryptomusCreating: boolean
    cryptomusUrl: string | null
    cryptomusInvoiceId: string | null
    cryptomusWalletAddress: string | null
    cryptomusNetwork: string | null
    cryptomusPaymentAmount: number | null
    cryptomusError: string | null

    invoice: any | null
    invoiceLoading: boolean
    invoiceError: string | null

    cancelling: boolean
}

const initialState: TopupState = {
    activePackage: null,
    loading: false,
    error: null,
    pendingDeposit: null,

    buying: false,

    redeeming: false,
    redeemResult: null,

    history: null,
    historyLoading: false,
    historyError: null,

    cryptomusCreating: false,
    cryptomusUrl: null,
    cryptomusInvoiceId: null,
    cryptomusWalletAddress: null,
    cryptomusNetwork: null,
    cryptomusPaymentAmount: null,
    cryptomusError: null,

    invoice: null,
    invoiceLoading: false,
    invoiceError: null,

    cancelling: false,
}

const topupReducer = (state = initialState, action: any): TopupState => {
    switch (action.type) {
        // Active Package
        case types.FETCH_ACTIVE_PACKAGE_REQUEST:
            return { ...state, loading: true, error: null }
        case types.FETCH_ACTIVE_PACKAGE_SUCCESS:
            return { ...state, loading: false, activePackage: action.payload }
        case types.CHECK_PENDING_DEPOSIT_REQUEST:
            return { ...state, pendingDeposit: state.pendingDeposit }
        case types.CHECK_PENDING_DEPOSIT_SUCCESS:
            return { ...state, pendingDeposit: action.payload }
        case types.CHECK_PENDING_DEPOSIT_FAILURE:
            return { ...state, pendingDeposit: null }
        case types.FETCH_ACTIVE_PACKAGE_FAILURE:
            return { ...state, loading: false, error: action.payload }

        // Buy Credits
        case types.BUY_CREDITS_REQUEST:
            return { ...state, buying: true }
        case types.BUY_CREDITS_SUCCESS:
            return { ...state, buying: false }
        case types.BUY_CREDITS_FAILURE:
            return { ...state, buying: false, error: action.payload }

        // Redeem Code
        case types.REDEEM_CODE_REQUEST:
            return { ...state, redeeming: true, error: null, redeemResult: null }
        case types.REDEEM_CODE_SUCCESS:
            return { ...state, redeeming: false, redeemResult: action.payload }
        case types.REDEEM_CODE_FAILURE:
            return { ...state, redeeming: false, error: action.payload }
        case types.CLEAR_REDEEM_RESULT:
            return { ...state, redeemResult: null, error: null }

        // History
        case types.FETCH_HISTORY_REQUEST:
            return { ...state, historyLoading: true, historyError: null }
        case types.FETCH_HISTORY_SUCCESS:
            return { ...state, historyLoading: false, history: action.payload }
        case types.FETCH_HISTORY_FAILURE:
            return { ...state, historyLoading: false, historyError: action.payload }

        // Cryptomus Deposit
        case types.CREATE_CRYPTOMUS_INVOICE_REQUEST:
            return { ...state, cryptomusCreating: true, cryptomusError: null, cryptomusUrl: null, cryptomusInvoiceId: null, cryptomusWalletAddress: null, cryptomusNetwork: null, cryptomusPaymentAmount: null }
        case types.CREATE_CRYPTOMUS_INVOICE_SUCCESS:
            return { ...state, cryptomusCreating: false, cryptomusUrl: action.payload.url, cryptomusInvoiceId: action.payload.invoiceId, cryptomusWalletAddress: action.payload.walletAddress || null, cryptomusNetwork: action.payload.network || null, cryptomusPaymentAmount: action.payload.paymentAmount || null }
        case types.CREATE_CRYPTOMUS_INVOICE_FAILURE:
            return { ...state, cryptomusCreating: false, cryptomusError: action.payload }
        case types.RESET_CRYPTOMUS_STATUS:
            return { ...state, cryptomusCreating: false, cryptomusUrl: null, cryptomusInvoiceId: null, cryptomusWalletAddress: null, cryptomusNetwork: null, cryptomusPaymentAmount: null, cryptomusError: null }

        // Invoice
        case types.FETCH_INVOICE_REQUEST:
            return { ...state, invoiceLoading: true, invoiceError: null, invoice: null }
        case types.FETCH_INVOICE_SUCCESS:
            return { ...state, invoiceLoading: false, invoice: action.payload }
        case types.FETCH_INVOICE_FAILURE:
            return { ...state, invoiceLoading: false, invoiceError: action.payload }
        case types.RESET_INVOICE:
            return { ...state, invoice: null, invoiceLoading: false, invoiceError: null }
        case types.CANCEL_DEPOSIT_REQUEST:
            return { ...state, cancelling: true }
        case types.CANCEL_DEPOSIT_SUCCESS:
            return { ...state, cancelling: false, pendingDeposit: null, cryptomusUrl: null, cryptomusInvoiceId: null, cryptomusWalletAddress: null, cryptomusNetwork: null, cryptomusPaymentAmount: null }
        case types.CANCEL_DEPOSIT_FAILURE:
            return { ...state, cancelling: false }

        // Check Payment (Cryptomus)
        case types.CHECK_TOPUP_PAYMENT_SUCCESS: {
            const data = action.payload
            if (!data || !data.deposit) {
                return { ...state, cryptomusUrl: null, cryptomusInvoiceId: null, cryptomusWalletAddress: null, cryptomusNetwork: null, cryptomusPaymentAmount: null, cryptomusError: null }
            }
            const d = data.deposit
            if (d.status === 'completed' || d.status === 'failed' || d.status === 'expired') {
                return {
                    ...state,
                    pendingDeposit: d.status === 'completed' ? null : state.pendingDeposit,
                    activePackage: d.status === 'completed' && state.activePackage ? { ...state.activePackage, pendingDeposit: null } : state.activePackage,
                    cryptomusUrl: null,
                    cryptomusInvoiceId: null,
                    cryptomusWalletAddress: null,
                    cryptomusNetwork: null,
                    cryptomusPaymentAmount: null,
                    cryptomusError: null,
                }
            }
            return { ...state, pendingDeposit: d }
        }
        case types.CHECK_TOPUP_PAYMENT_FAILURE:
            return { ...state }

        default:
            return state
    }
}

export default topupReducer
