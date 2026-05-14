import * as types from './constants'

export interface ReferralStats {
    totalReferrals: number
    activeUsers: number
    totalEarned: number
    pendingEarnings: number
    commissionRate: number
    referralCode: string
    referralLink: string
}

export interface ReferralItem {
    id: string
    user: { name: string; email: string }
    joined: string
    status: string
    commission: number
}

export interface ReferralsState {
    stats: ReferralStats | null
    loading: boolean
    error: string | null

    list: ReferralItem[]
    listLoading: boolean
    listError: string | null
}

const initialState: ReferralsState = {
    stats: null,
    loading: false,
    error: null,

    list: [],
    listLoading: false,
    listError: null,
}

const referralsReducer = (state = initialState, action: any): ReferralsState => {
    switch (action.type) {
        // Stats
        case types.FETCH_REFERRAL_STATS_REQUEST:
            return { ...state, loading: true, error: null }
        case types.FETCH_REFERRAL_STATS_SUCCESS:
            return { ...state, loading: false, stats: action.payload }
        case types.FETCH_REFERRAL_STATS_FAILURE:
            return { ...state, loading: false, error: action.payload }

        // List
        case types.FETCH_REFERRAL_LIST_REQUEST:
            return { ...state, listLoading: true, listError: null }
        case types.FETCH_REFERRAL_LIST_SUCCESS:
            return { ...state, listLoading: false, list: action.payload }
        case types.FETCH_REFERRAL_LIST_FAILURE:
            return { ...state, listLoading: false, listError: action.payload }

        default:
            return state
    }
}

export default referralsReducer
