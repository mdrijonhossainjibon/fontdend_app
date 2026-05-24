import { call, put, takeLatest } from 'redux-saga/effects'
import * as types from './constants'
import * as actions from './actions'
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint'

function* fetchPackagesSaga(action: any) {
  try {
    const { filterType } = action.payload
    const params: any = {}
    if (filterType && filterType !== 'all') params.type = filterType

    const { response }: APIResponse = yield call(API_CALL, {
      method: 'GET',
      url: '/admin/pricing-plans',
      params,
    })

    const raw = (response as any)?.data || response || {}
    const plans = (raw.plans || []).map((p: any) => ({
      id: p._id || p.id,
      code: p.code,
      type: p.type,
      price: p.priceDisplay || `$${p.price}`,
      priceValue: p.price,
      validity: p.validity,
      validityDays: p.validityDays,
      recognition: p.recognition,
      count: p.count,
      dailyLimit: p.dailyLimit,
      rateLimit: p.rateLimit,
      status: p.status,
      isPromo: p.isPromo,
      sortOrder: p.sortOrder,
    }))
    const stats = raw.stats || raw.data?.stats || null
    yield put(actions.fetchPackagesSuccess(plans, stats))
  } catch (error: any) {
    yield put(actions.fetchPackagesFailure(error?.response?.data?.error || error.message))
  }
}

function* createPackageSaga(action: any) {
  try {
    const { response }: APIResponse = yield call(API_CALL, {
      method: 'POST',
      url: '/admin/pricing-plans',
      body: action.payload.data,
    })

    const data = response as any
    yield put(actions.createPackageSuccess(data.plan || data))

    // Re-fetch packages after creating
    yield put(actions.fetchPackagesRequest())
  } catch (error: any) {
    yield put(actions.createPackageFailure(error?.response?.data?.error || error.message))
  }
}

function* updatePackageSaga(action: any) {
  try {
    yield call(API_CALL, {
      method: 'PATCH',
      url: '/admin/pricing-plans',
      body: action.payload.data,
    })

    yield put(actions.updatePackageSuccess())
    yield put(actions.fetchPackagesRequest())
  } catch (error: any) {
    yield put(actions.updatePackageFailure(error?.response?.data?.error || error.message))
  }
}

function* deletePackageSaga(action: any) {
  try {
    yield call(API_CALL, {
      method: 'DELETE',
      url: `/admin/pricing-plans?planId=${action.payload.planId}`,
    })

    yield put(actions.deletePackageSuccess())
    yield put(actions.fetchPackagesRequest())
  } catch (error: any) {
    yield put(actions.deletePackageFailure(error?.response?.data?.error || error.message))
  }
}

export default function* adminPackagesSaga() {
  yield takeLatest(types.FETCH_PACKAGES_REQUEST, fetchPackagesSaga)
  yield takeLatest(types.CREATE_PACKAGE_REQUEST, createPackageSaga)
  yield takeLatest(types.UPDATE_PACKAGE_REQUEST, updatePackageSaga)
  yield takeLatest(types.DELETE_PACKAGE_REQUEST, deletePackageSaga)
}
