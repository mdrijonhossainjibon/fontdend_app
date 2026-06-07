import { takeLatest, call, put } from 'redux-saga/effects'
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint'
import {
    FETCH_SOURCE_INFO_REQUEST,
    CONNECT_TARGET_REQUEST,
    TRANSFER_DATABASES_REQUEST,
} from './constants'
import {
    fetchSourceInfoSuccess,
    fetchSourceInfoFailure,
    connectTargetSuccess,
    connectTargetFailure,
    transferDatabasesSuccess,
    transferDatabasesFailure,
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
    } catch (error: any) {
        yield put(transferDatabasesFailure(error?.response?.data?.error || error.message))
    }
}

export default function* adminDatabaseTransferSaga() {
    yield takeLatest(FETCH_SOURCE_INFO_REQUEST, fetchSourceInfoSaga)
    yield takeLatest(CONNECT_TARGET_REQUEST, connectTargetSaga)
    yield takeLatest(TRANSFER_DATABASES_REQUEST, transferDatabasesSaga)
}
