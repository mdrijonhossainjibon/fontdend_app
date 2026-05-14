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
