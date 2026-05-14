import * as types from './constants'

export interface DepositRecord {
    id: string
    transactionId: string
    user: string
    userName: string
    amount: number
    amountUSD: number
    crypto: string
    network: string
    method: string
    status: string
    txHash?: string
    address: string
    confirmations: number
    requiredConfirmations: number
    fee: string
    notes?: string
    createdAt: string
    createdAtFull: string
}

export interface Stats {
    total: number
    completed: number
    pending: number
    confirming: number
    failed: number
}

export interface Pagination {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

export interface AdminTopupHistoryState {
    deposits: DepositRecord[]
    stats: Stats | null
    pagination: Pagination | null
    loading: boolean
    error: string | null
}

const initialState: AdminTopupHistoryState = {
    deposits: [],
    stats: null,
    pagination: null,
    loading: false,
    error: null,
}

export default function adminTopupHistoryReducer(
    state = initialState,
    action: any,
): AdminTopupHistoryState {
    switch (action.type) {
        case types.FETCH_TOPUP_HISTORY_REQUEST:
            return { ...state, loading: true, error: null }
        case types.FETCH_TOPUP_HISTORY_SUCCESS:
            return {
                ...state,
                loading: false,
                deposits: action.payload.deposits || [],
                stats: action.payload.stats || null,
                pagination: action.payload.pagination || null,
            }
        case types.FETCH_TOPUP_HISTORY_FAILURE:
            return { ...state, loading: false, error: action.payload.error }
        default:
            return state
    }
}

