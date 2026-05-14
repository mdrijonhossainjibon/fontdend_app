import * as types from './constants'

export interface FetchHistoryParams {
    search?: string
    type?: string
    page: number
    limit: number
}

export const fetchHistoryRequest = (params: FetchHistoryParams) => ({
    type: types.FETCH_HISTORY_REQUEST,
    payload: params,
})
export const fetchHistorySuccess = (data: { transactions: any[]; stats: any }) => ({
    type: types.FETCH_HISTORY_SUCCESS,
    payload: data,
})
export const fetchHistoryFailure = (error: string) => ({
    type: types.FETCH_HISTORY_FAILURE,
    payload: { error },
})

