import { call, put, takeLatest } from 'redux-saga/effects'
import { API_CALL } from '@/lib/auth-fingerprint'
import {
    FETCH_PRICING_PLANS_REQUEST,
    CREATE_PRICING_PLAN_REQUEST,
    UPDATE_PRICING_PLAN_REQUEST,
    DELETE_PRICING_PLAN_REQUEST,
} from './constants'
import {
    fetchPricingPlansSuccess,
    fetchPricingPlansFailure,
    createPricingPlanSuccess,
    createPricingPlanFailure,
    updatePricingPlanSuccess,
    updatePricingPlanFailure,
    deletePricingPlanSuccess,
    deletePricingPlanFailure,
} from './actions'

function* fetchPricingPlansSaga(): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, { method: 'GET', url: '/admin/pricing-plans' })
        yield put(fetchPricingPlansSuccess(response))
    } catch (error: any) {
        yield put(fetchPricingPlansFailure(error?.message || 'Failed to load pricing plans'))
    }
}

function* createPricingPlanSaga(action: any): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, { method: 'POST', url: '/admin/pricing-plans', body: action.payload })
        if (response.success) {
            yield put(createPricingPlanSuccess(response.data))
        } else {
            yield put(createPricingPlanFailure(response.error || 'Failed to create plan'))
        }
    } catch (error: any) {
        yield put(createPricingPlanFailure(error?.message || 'Failed to create plan'))
    }
}

function* updatePricingPlanSaga(action: any): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, { method: 'PATCH', url: '/admin/pricing-plans', body: action.payload })
        if (response.success) {
            yield put(updatePricingPlanSuccess(response.data))
        } else {
            yield put(updatePricingPlanFailure(response.error || 'Failed to update plan'))
        }
    } catch (error: any) {
        yield put(updatePricingPlanFailure(error?.message || 'Failed to update plan'))
    }
}

function* deletePricingPlanSaga(action: any): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, { method: 'DELETE', url: `/admin/pricing-plans?planId=${action.payload}` })
        if (response.success) {
            yield put(deletePricingPlanSuccess(action.payload))
        } else {
            yield put(deletePricingPlanFailure(response.error || 'Failed to delete plan'))
        }
    } catch (error: any) {
        yield put(deletePricingPlanFailure(error?.message || 'Failed to delete plan'))
    }
}

export default function* adminPricingPlansSaga() {
    yield takeLatest(FETCH_PRICING_PLANS_REQUEST, fetchPricingPlansSaga)
    yield takeLatest(CREATE_PRICING_PLAN_REQUEST, createPricingPlanSaga)
    yield takeLatest(UPDATE_PRICING_PLAN_REQUEST, updatePricingPlanSaga)
    yield takeLatest(DELETE_PRICING_PLAN_REQUEST, deletePricingPlanSaga)
}
