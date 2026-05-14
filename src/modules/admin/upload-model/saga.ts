import { takeLatest, call, put } from 'redux-saga/effects'
import { FETCH_BOT_ENDPOINTS_REQUEST } from './constants'
import { fetchBotEndpointsSuccess, fetchBotEndpointsFailure } from './actions'
import { API_CALL } from '@/lib/auth-fingerprint'

function* fetchBotEndpointsSaga(): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, {
            method: 'GET',
            url: '/admin/bot-endpoints',
        })
        yield put(fetchBotEndpointsSuccess(response.endpoints))
    } catch (error: any) {
        yield put(fetchBotEndpointsFailure(error?.message || 'Failed to fetch bot endpoints'))
    }
}

export default function* adminUploadModelSaga() {
    yield takeLatest(FETCH_BOT_ENDPOINTS_REQUEST, fetchBotEndpointsSaga)
}
