import * as types from './constants'

export interface FetchTopupHistoryParams {
    search?: string
    status?: string
    page: number
    limit: number
}

export const fetchTopupHistoryRequest = (params: FetchTopupHistoryParams) => ({
    type: types.FETCH_TOPUP_HISTORY_REQUEST,
    payload: params,
})
export const fetchTopupHistorySuccess = (data: { deposits: any[]; stats: any; pagination: any }) => ({
    type: types.FETCH_TOPUP_HISTORY_SUCCESS,
    payload: data,
})
export const fetchTopupHistoryFailure = (error: string) => ({
    type: types.FETCH_TOPUP_HISTORY_FAILURE,
    payload: { error },
})


