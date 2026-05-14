import { call, put, takeLatest } from 'redux-saga/effects'
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint'
import * as types from './constants'
import * as actions from './actions'

// ── Stats ──
function* fetchReferralStatsSaga(): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: '/referrals/stats',
        })
        if (status === 200 && (response as any).success) {
            yield put(actions.fetchReferralStatsSuccess((response as any).stats || null))
        } else {
            yield put(
                actions.fetchReferralStatsFailure((response as any)?.error || 'Failed to load referral stats')
            )
        }
    } catch (error: any) {
        yield put(actions.fetchReferralStatsFailure(error.message))
    }
}

// ── List ──
function* fetchReferralListSaga(): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: '/referrals/list',
        })
        if (status === 200 && (response as any).success) {
            yield put(actions.fetchReferralListSuccess((response as any).referrals || []))
        } else {
            yield put(
                actions.fetchReferralListFailure((response as any)?.error || 'Failed to load referral list')
            )
        }
    } catch (error: any) {
        yield put(actions.fetchReferralListFailure(error.message))
    }
}

// ── Root Saga ──
export default function* referralsSaga() {
    yield takeLatest(types.FETCH_REFERRAL_STATS_REQUEST, fetchReferralStatsSaga)
    yield takeLatest(types.FETCH_REFERRAL_LIST_REQUEST, fetchReferralListSaga)
}
