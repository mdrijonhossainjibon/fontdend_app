import {
    FETCH_REDEEM_CODES_REQUEST,
    FETCH_REDEEM_CODES_SUCCESS,
    FETCH_REDEEM_CODES_FAILURE,
    CREATE_REDEEM_CODE_REQUEST,
    CREATE_REDEEM_CODE_SUCCESS,
    CREATE_REDEEM_CODE_FAILURE,
    UPDATE_REDEEM_CODE_REQUEST,
    UPDATE_REDEEM_CODE_SUCCESS,
    UPDATE_REDEEM_CODE_FAILURE,
    DELETE_REDEEM_CODE_REQUEST,
    DELETE_REDEEM_CODE_SUCCESS,
    DELETE_REDEEM_CODE_FAILURE,
} from './constants'

export const fetchRedeemCodesRequest = () => ({ type: FETCH_REDEEM_CODES_REQUEST })
export const fetchRedeemCodesSuccess = (data: any) => ({ type: FETCH_REDEEM_CODES_SUCCESS, payload: data })
export const fetchRedeemCodesFailure = (error: string) => ({ type: FETCH_REDEEM_CODES_FAILURE, payload: error })

export const createRedeemCodeRequest = (data: any) => ({ type: CREATE_REDEEM_CODE_REQUEST, payload: data })
export const createRedeemCodeSuccess = (code: any) => ({ type: CREATE_REDEEM_CODE_SUCCESS, payload: code })
export const createRedeemCodeFailure = (error: string) => ({ type: CREATE_REDEEM_CODE_FAILURE, payload: error })

export const updateRedeemCodeRequest = (data: any) => ({ type: UPDATE_REDEEM_CODE_REQUEST, payload: data })
export const updateRedeemCodeSuccess = (code: any) => ({ type: UPDATE_REDEEM_CODE_SUCCESS, payload: code })
export const updateRedeemCodeFailure = (error: string) => ({ type: UPDATE_REDEEM_CODE_FAILURE, payload: error })

export const deleteRedeemCodeRequest = (id: string) => ({ type: DELETE_REDEEM_CODE_REQUEST, payload: id })
export const deleteRedeemCodeSuccess = (id: string) => ({ type: DELETE_REDEEM_CODE_SUCCESS, payload: id })
export const deleteRedeemCodeFailure = (error: string) => ({ type: DELETE_REDEEM_CODE_FAILURE, payload: error })
