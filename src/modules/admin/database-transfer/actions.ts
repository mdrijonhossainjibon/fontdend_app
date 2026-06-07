import {
    FETCH_SOURCE_INFO_REQUEST,
    FETCH_SOURCE_INFO_SUCCESS,
    FETCH_SOURCE_INFO_FAILURE,
    CONNECT_TARGET_REQUEST,
    CONNECT_TARGET_SUCCESS,
    CONNECT_TARGET_FAILURE,
    TRANSFER_DATABASES_REQUEST,
    TRANSFER_DATABASES_SUCCESS,
    TRANSFER_DATABASES_FAILURE,
    RESET_TRANSFER,
} from './constants'

export const fetchSourceInfoRequest = () => ({ type: FETCH_SOURCE_INFO_REQUEST })
export const fetchSourceInfoSuccess = (payload: any) => ({ type: FETCH_SOURCE_INFO_SUCCESS, payload })
export const fetchSourceInfoFailure = (error: string) => ({ type: FETCH_SOURCE_INFO_FAILURE, error })

export const connectTargetRequest = (payload: any) => ({ type: CONNECT_TARGET_REQUEST, payload })
export const connectTargetSuccess = (payload: any) => ({ type: CONNECT_TARGET_SUCCESS, payload })
export const connectTargetFailure = (error: string) => ({ type: CONNECT_TARGET_FAILURE, error })

export const transferDatabasesRequest = (payload: any) => ({ type: TRANSFER_DATABASES_REQUEST, payload })
export const transferDatabasesSuccess = (payload: any) => ({ type: TRANSFER_DATABASES_SUCCESS, payload })
export const transferDatabasesFailure = (error: string) => ({ type: TRANSFER_DATABASES_FAILURE, error })

export const resetTransfer = () => ({ type: RESET_TRANSFER })
