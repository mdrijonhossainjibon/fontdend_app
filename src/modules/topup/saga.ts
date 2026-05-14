import { call, put, takeLatest } from 'redux-saga/effects'
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint'
import * as types from './constants'
import * as actions from './actions'

// ── Active Package ──
function* fetchActivePackageSaga(): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: '/topup/active-package',
        })
        if (status === 200 && (response as any).success) {
            const { balance, activePackage } = response as any
            yield put(actions.fetchActivePackageSuccess({ balance, activePackage }))
        } else {
            yield put(
                actions.fetchActivePackageFailure((response as any)?.error || 'Failed to load package info')
            )
        }
    } catch (error: any) {
        yield put(actions.fetchActivePackageFailure(error.message))
    }
}

// ── Buy Credits ──
function* buyCreditsSaga(action: ReturnType<typeof actions.buyCreditsRequest>): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/topup/credits',
            body: action.payload,
        })
        if (status === 200 && (response as any).success) {
            yield put(actions.buyCreditsSuccess(response as any))
            // Refresh package data after purchase
            yield put(actions.fetchActivePackageRequest())
        } else {
            yield put(
                actions.buyCreditsFailure((response as any)?.error || 'Purchase failed')
            )
        }
    } catch (error: any) {
        yield put(actions.buyCreditsFailure(error.message))
    }
}

// ── Redeem Code ──
function* redeemCodeSaga(action: ReturnType<typeof actions.redeemCodeRequest>): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/topup/redeem',
            body: action.payload,
        })
        if (status === 200 && (response as any).success) {
            yield put(actions.redeemCodeSuccess((response as any).data))
            // Refresh package data after redeem
            yield put(actions.fetchActivePackageRequest())
        } else {
            yield put(
                actions.redeemCodeFailure((response as any)?.error || 'Failed to redeem code')
            )
        }
    } catch (error: any) {
        yield put(actions.redeemCodeFailure(error.message))
    }
}

// ── History ──
function* fetchHistorySaga(): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: '/topup/history',
            params: { _t: Date.now() },
        })
        if (status === 200 && (response as any).success) {
            yield put(actions.fetchHistorySuccess((response as any).data))
        } else {
            yield put(
                actions.fetchHistoryFailure((response as any)?.error || 'Failed to load history')
            )
        }
    } catch (error: any) {
        yield put(actions.fetchHistoryFailure(error.message))
    }
}

// ── Root Saga ──
export default function* topupSaga() {
    yield takeLatest(types.FETCH_ACTIVE_PACKAGE_REQUEST, fetchActivePackageSaga)
    yield takeLatest(types.BUY_CREDITS_REQUEST, buyCreditsSaga)
    yield takeLatest(types.REDEEM_CODE_REQUEST, redeemCodeSaga)
    yield takeLatest(types.FETCH_HISTORY_REQUEST, fetchHistorySaga)
}
