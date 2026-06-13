import { call, put, takeLatest } from 'redux-saga/effects'
import { API_CALL } from '@/lib/auth-fingerprint'
import {
    FETCH_USER_PACKAGES_REQUEST,
    FETCH_ALL_USER_PACKAGES_REQUEST,
    UPDATE_USER_PACKAGE_REQUEST,
    DELETE_USER_PACKAGE_REQUEST,
    ASSIGN_PACKAGE_REQUEST,
} from './constants'
import {
    fetchUserPackagesSuccess,
    fetchUserPackagesFailure,
    fetchAllUserPackagesSuccess,
    fetchAllUserPackagesFailure,
    updateUserPackageSuccess,
    updateUserPackageFailure,
    deleteUserPackageSuccess,
    deleteUserPackageFailure,
    assignPackageSuccess,
    assignPackageFailure,
} from './actions'
import { updateAdminUserSuccess } from '../actions'

function* fetchUserPackagesSaga(action: any): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, { method: 'GET', url: `/admin/users/packages?userId=${action.payload}` })
        yield put(fetchUserPackagesSuccess(response.packages || []))
    } catch (error: any) {
        yield put(fetchUserPackagesFailure(error?.message || 'Failed to load user packages'))
    }
}

function* fetchAllUserPackagesSaga(): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, { method: 'GET', url: '/admin/users/packages/all' })
        yield put(fetchAllUserPackagesSuccess(response.packages || []))
    } catch (error: any) {
        yield put(fetchAllUserPackagesFailure(error?.message || 'Failed to load all user packages'))
    }
}

function* updateUserPackageSaga(action: any): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, { method: 'PATCH', url: '/admin/users/packages', body: action.payload })
        yield put(updateUserPackageSuccess(response.package || response))
    } catch (error: any) {
        yield put(updateUserPackageFailure(error?.message || 'Failed to update package'))
    }
}

function* deleteUserPackageSaga(action: any): Generator<any, void, any> {
    try {
        yield call(API_CALL, { method: 'DELETE', url: `/admin/users/packages`, body: { packageId: action.payload } })
        yield put(deleteUserPackageSuccess(action.payload))
    } catch (error: any) {
        yield put(deleteUserPackageFailure(error?.message || 'Failed to delete package'))
    }
}

function* assignPackageSaga(action: any): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, { method: 'POST', url: '/admin/users/assign-package', body: action.payload })
        yield put(assignPackageSuccess(response.package || response))
    } catch (error: any) {
        yield put(assignPackageFailure(error?.message || 'Failed to assign package'))
    }
}

export default function* watchUserPackages() {
    yield takeLatest(FETCH_USER_PACKAGES_REQUEST, fetchUserPackagesSaga)
    yield takeLatest(FETCH_ALL_USER_PACKAGES_REQUEST, fetchAllUserPackagesSaga)
    yield takeLatest(UPDATE_USER_PACKAGE_REQUEST, updateUserPackageSaga)
    yield takeLatest(DELETE_USER_PACKAGE_REQUEST, deleteUserPackageSaga)
    yield takeLatest(ASSIGN_PACKAGE_REQUEST, assignPackageSaga)
}
