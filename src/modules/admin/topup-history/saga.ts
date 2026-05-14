import { call, put, takeLatest } from 'redux-saga/effects'
import * as types from './constants'
import * as actions from './actions'
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint'

function* fetchTopupHistorySaga(
    action: ReturnType<typeof actions.fetchTopupHistoryRequest>,
) {
    try {
        const params = action.payload
        const queryParams = new URLSearchParams()
        if (params.search) queryParams.append('search', params.search)
        if (params.status) queryParams.append('status', params.status)
        queryParams.append('page', params.page.toString())
        queryParams.append('limit', params.limit.toString())

        const { response }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: `/admin/deposits?${queryParams.toString()}`,
        })
        const data = response as any
        yield put(
            actions.fetchTopupHistorySuccess({
                deposits: data.deposits || [],
                stats: data.stats || null,
                pagination: data.pagination || null,
            }),
        )
    } catch (error: any) {
        yield put(
            actions.fetchTopupHistoryFailure(
                error?.response?.data?.error || error.message,
            ),
        )
    }
}

export default function* adminTopupHistorySaga() {
    yield takeLatest(types.FETCH_TOPUP_HISTORY_REQUEST, fetchTopupHistorySaga)
}

