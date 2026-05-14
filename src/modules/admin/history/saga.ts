import { call, put, takeLatest } from 'redux-saga/effects'
import * as types from './constants'
import * as actions from './actions'
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint'

function* fetchHistorySaga(action: ReturnType<typeof actions.fetchHistoryRequest>): any {
    try {
        const params = action.payload
        const queryParams = new URLSearchParams()
        if (params.search) queryParams.append('search', params.search)
        if (params.type) queryParams.append('type', params.type)
        queryParams.append('page', params.page.toString())
        queryParams.append('limit', params.limit.toString())

        const { response }: APIResponse = yield call(API_CALL, { method: 'GET', url: `/admin/deposits?${queryParams.toString()}` })
        const { deposits = [], pagination } = (response || {}) as any
        const transactions = deposits.map((d: any) => ({
            id: d._id || d.id, type: d.type || '',
            credits: d.credits || 0, amount: d.amount || 0,
            date: d.createdAt || d.date || '', time: d.createdAt || d.time || '',
            status: d.status || '', label: d.label || '', meta: d.meta || '',
            userName: d.userId?.name || d.userName || 'Unknown',
            userEmail: d.userId?.email || d.userEmail || '',
        }))
        yield put(actions.fetchHistorySuccess({
            transactions,
            stats: pagination ? { ...pagination, totalPages: pagination.pages || pagination.totalPages || 1 } : null,
        }))
    } catch (error: any) {
        yield put(actions.fetchHistoryFailure(error?.response?.data?.error || error.message))
    }
}

export default function* adminHistorySaga() {
    yield takeLatest(types.FETCH_HISTORY_REQUEST, fetchHistorySaga)
}
