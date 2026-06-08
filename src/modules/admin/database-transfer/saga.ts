import { takeLatest, call, put, delay, race, take } from 'redux-saga/effects'
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint'
import {
    FETCH_SOURCE_INFO_REQUEST,
    CONNECT_TARGET_REQUEST,
    TRANSFER_DATABASES_REQUEST,
    FETCH_TRANSFER_PROGRESS_REQUEST,
    STOP_TRANSFER_POLLING,
} from './constants'
import {
    fetchSourceInfoSuccess,
    fetchSourceInfoFailure,
    connectTargetSuccess,
    connectTargetFailure,
    transferDatabasesSuccess,
    transferDatabasesFailure,
    fetchTransferProgressSuccess,
    fetchTransferProgressFailure,
    stopTransferPolling,
} from './actions'

function* fetchSourceInfoSaga(): any {
    try {
        const { response }: APIResponse = yield call(API_CALL, { method: 'GET', url: '/admin/database/info' })
        yield put(fetchSourceInfoSuccess(response))
    } catch (error: any) {
        yield put(fetchSourceInfoFailure(error?.response?.data?.error || error.message))
    }
}

function* connectTargetSaga(action: any): any {
    try {
        const { response }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/admin/database/connect',
            body: { target: action.payload },
        })
        yield put(connectTargetSuccess(response))
    } catch (error: any) {
        yield put(connectTargetFailure(error?.response?.data?.error || error.message))
    }
}

function* transferDatabasesSaga(action: any): any {
    try {
        const { response }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/admin/database/transfer',
            body: { target: action.payload.target, databases: action.payload.databases },
        })
        yield put(transferDatabasesSuccess(response))

        // Start polling progress if we got a transferId
        if (response.transferId) {
            yield put({ type: FETCH_TRANSFER_PROGRESS_REQUEST, payload: response.transferId })
        }
    } catch (error: any) {
        yield put(transferDatabasesFailure(error?.response?.data?.error || error.message))
    }
}

function* pollTransferProgressSaga(action: any): any {
    const transferId = action.payload
    while (true) {
        const { result, stop } = yield race({
            result: call(fetchProgressOnce, transferId),
            stop: take(STOP_TRANSFER_POLLING),
        })
        if (stop) break
        if (result === false) break // completed or failed
        yield delay(2000) // poll every 2s
    }
}

function* fetchProgressOnce(transferId: string): any {
    try {
        const { response }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: `/admin/database/progress/${transferId}`,
        })
        yield put(fetchTransferProgressSuccess(response))

        const p = response.progress
        return !(p.status === 'completed' || p.status === 'failed')
    } catch (error: any) {
        yield put(fetchTransferProgressFailure(error?.response?.data?.error || error.message))
        return false
    }
}

export default function* adminDatabaseTransferSaga() {
    yield takeLatest(FETCH_SOURCE_INFO_REQUEST, fetchSourceInfoSaga)
    yield takeLatest(CONNECT_TARGET_REQUEST, connectTargetSaga)
    yield takeLatest(TRANSFER_DATABASES_REQUEST, transferDatabasesSaga)
    yield takeLatest(FETCH_TRANSFER_PROGRESS_REQUEST, pollTransferProgressSaga)
}
