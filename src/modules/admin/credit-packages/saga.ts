import { call, put, takeLatest } from 'redux-saga/effects'
import { API_CALL } from '@/lib/auth-fingerprint'
import {
    FETCH_CREDIT_PACKAGES_REQUEST,
    CREATE_CREDIT_PACKAGE_REQUEST,
    UPDATE_CREDIT_PACKAGE_REQUEST,
    DELETE_CREDIT_PACKAGE_REQUEST,
} from './constants'
import {
    fetchCreditPackagesSuccess,
    fetchCreditPackagesFailure,
    createCreditPackageSuccess,
    createCreditPackageFailure,
    updateCreditPackageSuccess,
    updateCreditPackageFailure,
    deleteCreditPackageSuccess,
    deleteCreditPackageFailure,
} from './actions'
import { fetchCreditPackagesRequest } from './actions'

function* fetchCreditPackagesSaga(action: any): Generator<any, void, any> {
    try {
        const type = action.payload || 'all'
        const { response } = yield call(API_CALL, { method: 'GET', url: `/admin/credit-packages?type=${type}` })
        yield put(fetchCreditPackagesSuccess(response))
    } catch (error: any) {
        yield put(fetchCreditPackagesFailure(error?.message || 'Failed to load credit packages'))
    }
}

function* createCreditPackageSaga(action: any): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, { method: 'POST', url: '/admin/credit-packages', body: action.payload })
        if (response.success) {
            yield put(createCreditPackageSuccess(response.package))
            yield put(fetchCreditPackagesRequest())
        } else {
            yield put(createCreditPackageFailure(response.error || 'Create failed'))
        }
    } catch (error: any) {
        yield put(createCreditPackageFailure(error?.message || 'Create failed'))
    }
}

function* updateCreditPackageSaga(action: any): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, { method: 'PATCH', url: '/admin/credit-packages', body: action.payload })
        if (response.success) {
            yield put(updateCreditPackageSuccess(response))
            yield put(fetchCreditPackagesRequest())
        } else {
            yield put(updateCreditPackageFailure(response.error || 'Update failed'))
        }
    } catch (error: any) {
        yield put(updateCreditPackageFailure(error?.message || 'Update failed'))
    }
}

function* deleteCreditPackageSaga(action: any): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, { method: 'DELETE', url: `/admin/credit-packages?packageId=${action.payload}` })
        if (response.success) {
            yield put(deleteCreditPackageSuccess(action.payload))
        } else {
            yield put(deleteCreditPackageFailure(response.error || 'Delete failed'))
        }
    } catch (error: any) {
        yield put(deleteCreditPackageFailure(error?.message || 'Delete failed'))
    }
}

export default function* adminCreditPackagesSaga() {
    yield takeLatest(FETCH_CREDIT_PACKAGES_REQUEST, fetchCreditPackagesSaga)
    yield takeLatest(CREATE_CREDIT_PACKAGE_REQUEST, createCreditPackageSaga)
    yield takeLatest(UPDATE_CREDIT_PACKAGE_REQUEST, updateCreditPackageSaga)
    yield takeLatest(DELETE_CREDIT_PACKAGE_REQUEST, deleteCreditPackageSaga)
}
