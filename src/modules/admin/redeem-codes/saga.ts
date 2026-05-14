import { call, put, takeLatest } from 'redux-saga/effects'
import { API_CALL } from '@/lib/auth-fingerprint'
import {
    FETCH_REDEEM_CODES_REQUEST,
    CREATE_REDEEM_CODE_REQUEST,
    UPDATE_REDEEM_CODE_REQUEST,
    DELETE_REDEEM_CODE_REQUEST,
} from './constants'
import {
    fetchRedeemCodesSuccess,
    fetchRedeemCodesFailure,
    createRedeemCodeSuccess,
    createRedeemCodeFailure,
    updateRedeemCodeSuccess,
    updateRedeemCodeFailure,
    deleteRedeemCodeSuccess,
    deleteRedeemCodeFailure,
} from './actions'

function* fetchRedeemCodesSaga(): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, { method: 'GET', url: '/admin/redeem-codes' })
        yield put(fetchRedeemCodesSuccess(response.data))
    } catch (error: any) {
        yield put(fetchRedeemCodesFailure(error?.message || 'Failed to load codes'))
    }
}

function* createRedeemCodeSaga(action: any): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, { method: 'POST', url: '/admin/redeem-codes', body: action.payload })
        if (response.success) {
            yield put(createRedeemCodeSuccess(response.data))
        } else {
            yield put(createRedeemCodeFailure(response.error || 'Failed to create code'))
        }
    } catch (error: any) {
        yield put(createRedeemCodeFailure(error?.message || 'Failed to create code'))
    }
}

function* updateRedeemCodeSaga(action: any): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, { method: 'PATCH', url: '/admin/redeem-codes', body: action.payload })
        if (response.success) {
            yield put(updateRedeemCodeSuccess(response.data))
        } else {
            yield put(updateRedeemCodeFailure(response.error || 'Failed to update code'))
        }
    } catch (error: any) {
        yield put(updateRedeemCodeFailure(error?.message || 'Failed to update code'))
    }
}

function* deleteRedeemCodeSaga(action: any): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, { method: 'DELETE', url: `/admin/redeem-codes?id=${action.payload}` })
        if (response.success) {
            yield put(deleteRedeemCodeSuccess(action.payload))
        } else {
            yield put(deleteRedeemCodeFailure(response.error || 'Failed to delete code'))
        }
    } catch (error: any) {
        yield put(deleteRedeemCodeFailure(error?.message || 'Failed to delete code'))
    }
}

export default function* adminRedeemCodesSaga() {
    yield takeLatest(FETCH_REDEEM_CODES_REQUEST, fetchRedeemCodesSaga)
    yield takeLatest(CREATE_REDEEM_CODE_REQUEST, createRedeemCodeSaga)
    yield takeLatest(UPDATE_REDEEM_CODE_REQUEST, updateRedeemCodeSaga)
    yield takeLatest(DELETE_REDEEM_CODE_REQUEST, deleteRedeemCodeSaga)
}
