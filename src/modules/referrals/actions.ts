import * as types from './constants'

// Stats
export const fetchReferralStatsRequest = () => ({
    type: types.FETCH_REFERRAL_STATS_REQUEST as typeof types.FETCH_REFERRAL_STATS_REQUEST,
})

export const fetchReferralStatsSuccess = (payload: any) => ({
    type: types.FETCH_REFERRAL_STATS_SUCCESS as typeof types.FETCH_REFERRAL_STATS_SUCCESS,
    payload,
})

export const fetchReferralStatsFailure = (error: string) => ({
    type: types.FETCH_REFERRAL_STATS_FAILURE as typeof types.FETCH_REFERRAL_STATS_FAILURE,
    payload: error,
})

// List
export const fetchReferralListRequest = () => ({
    type: types.FETCH_REFERRAL_LIST_REQUEST as typeof types.FETCH_REFERRAL_LIST_REQUEST,
})

export const fetchReferralListSuccess = (payload: any) => ({
    type: types.FETCH_REFERRAL_LIST_SUCCESS as typeof types.FETCH_REFERRAL_LIST_SUCCESS,
    payload,
})

export const fetchReferralListFailure = (error: string) => ({
    type: types.FETCH_REFERRAL_LIST_FAILURE as typeof types.FETCH_REFERRAL_LIST_FAILURE,
    payload: error,
})
