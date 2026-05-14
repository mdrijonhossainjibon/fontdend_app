import { call, put, takeLatest } from 'redux-saga/effects'
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint'
import * as types from './constants'
import * as actions from './actions'

function* fetchPricingPackagesSaga(): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: '/pricing',
        })
        if (status === 200 && (response as any).success) {
            yield put(actions.fetchPricingPackagesSuccess((response as any).data || []))
        } else {
            yield put(
                actions.fetchPricingPackagesFailure((response as any)?.error || 'Failed to load pricing packages')
            )
        }
    } catch (error: any) {
        yield put(actions.fetchPricingPackagesFailure(error.message))
    }
}

function* subscribeToPlanSaga(action: ReturnType<typeof actions.subscribeToPlanRequest>): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/pricing/subscribe',
            body: action.payload,
        })
        if (status === 200 && (response as any).success) {
            yield put(actions.subscribeToPlanSuccess((response as any).data))
        } else {
            yield put(
                actions.subscribeToPlanFailure((response as any)?.error || 'Subscription failed')
            )
        }
    } catch (error: any) {
        yield put(actions.subscribeToPlanFailure(error.message))
    }
}

export default function* pricingSaga() {
    yield takeLatest(types.FETCH_PRICING_PACKAGES_REQUEST, fetchPricingPackagesSaga)
    yield takeLatest(types.SUBSCRIBE_TO_PLAN_REQUEST, subscribeToPlanSaga)
}
