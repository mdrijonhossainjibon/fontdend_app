import * as types from './constants'

export const cancelDepositRequest = (depositId: string) => ({ type: types.CANCEL_DEPOSIT_REQUEST, payload: depositId })
export const cancelDepositSuccess = (data: any) => ({ type: types.CANCEL_DEPOSIT_SUCCESS, payload: data })
export const cancelDepositFailure = (error: string) => ({ type: types.CANCEL_DEPOSIT_FAILURE, payload: error })
