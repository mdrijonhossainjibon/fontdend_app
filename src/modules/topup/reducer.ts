import * as types from './constants'

export interface PendingDepositInfo {
    amountUSD: number
    cryptoName: string
    networkName: string
    address: string
    createdAt: string
    expiresAt: string
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

    cryptomusStatus: string | null
    cryptomusStatusData: any

    invoice: any | null
    invoiceLoading: boolean
    invoiceError: string | null
}

const initialState: TopupState = {
    activePackage: null,
    loading: false,
    error: null,

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

    cryptomusStatus: null,
    cryptomusStatusData: null,

    invoice: null,
    invoiceLoading: false,
    invoiceError: null,
}

const topupReducer = (state = initialState, action: any): TopupState => {
    switch (action.type) {
        // Active Package
        case types.FETCH_ACTIVE_PACKAGE_REQUEST:
            return { ...state, loading: true, error: null }
        case types.FETCH_ACTIVE_PACKAGE_SUCCESS:
            return { ...state, loading: false, activePackage: action.payload }
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
            return { ...state, redeeming: true }
        case types.REDEEM_CODE_SUCCESS:
            return { ...state, redeeming: false, redeemResult: action.payload }
        case types.REDEEM_CODE_FAILURE:
            return { ...state, redeeming: false, error: action.payload }
        case types.CLEAR_REDEEM_RESULT:
            return { ...state, redeemResult: null }

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
            return { ...state, cryptomusCreating: false, cryptomusUrl: null, cryptomusInvoiceId: null, cryptomusWalletAddress: null, cryptomusNetwork: null, cryptomusPaymentAmount: null, cryptomusError: null, cryptomusStatus: null, cryptomusStatusData: null }

        // Cryptomus Payment Polling
        case types.POLL_CRYPTOMUS_STATUS_START:
            return { ...state, cryptomusStatus: 'pending' }
        case types.POLL_CRYPTOMUS_STATUS_UPDATE:
            return { ...state, cryptomusStatus: action.payload.status, cryptomusStatusData: action.payload.data }
        case types.POLL_CRYPTOMUS_PAYMENT_DETAILS:
            return {
                ...state,
                cryptomusWalletAddress: action.payload.address || state.cryptomusWalletAddress,
                cryptomusNetwork: action.payload.network || state.cryptomusNetwork,
            }
        case types.POLL_CRYPTOMUS_STATUS_STOP:
            return { ...state, cryptomusStatus: null, cryptomusStatusData: null }

        // Invoice
        case types.FETCH_INVOICE_REQUEST:
            return { ...state, invoiceLoading: true, invoiceError: null, invoice: null }
        case types.FETCH_INVOICE_SUCCESS:
            return { ...state, invoiceLoading: false, invoice: action.payload }
        case types.FETCH_INVOICE_FAILURE:
            return { ...state, invoiceLoading: false, invoiceError: action.payload }
        case types.RESET_INVOICE:
            return { ...state, invoice: null, invoiceLoading: false, invoiceError: null }

        default:
            return state
    }
}

export default topupReducer
