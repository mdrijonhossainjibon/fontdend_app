import * as types from './constants'

export interface TxRecord {
    id: string
    type: string
    credits: number
    amount: number
    amountUSD: number
    date: string
    time: string
    status: string
    label: string
    meta: string
    userName: string
    userEmail: string
}

export interface PaginationStats {
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface AdminHistoryState {
    data: TxRecord[]
    stats: PaginationStats | null
    loading: boolean
    error: string | null
}

const initialState: AdminHistoryState = {
    data: [],
    stats: null,
    loading: false,
    error: null,
}

export default function adminHistoryReducer(
    state = initialState,
    action: any,
): AdminHistoryState {
    switch (action.type) {
        case types.FETCH_HISTORY_REQUEST:
            return { ...state, loading: true, error: null }
        case types.FETCH_HISTORY_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload.transactions || [],
                stats: action.payload.stats || null,
            }
        case types.FETCH_HISTORY_FAILURE:
            return { ...state, loading: false, error: action.payload.error }
        default:
            return state
    }
}

