import { call, put, takeLatest } from 'redux-saga/effects'
import { API_CALL } from '@/lib/auth-fingerprint'
import {
    FETCH_USER_PACKAGES_REQUEST,
    UPDATE_USER_PACKAGE_REQUEST,
    DELETE_USER_PACKAGE_REQUEST,
    ASSIGN_PACKAGE_REQUEST,
} from './constants'
import {
    fetchUserPackagesSuccess,
    fetchUserPackagesFailure,
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

function* updateUserPackageSaga(action: any): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, { method: 'PATCH', url: '/admin/users/packages', body: action.payload })
        if (response.success) {
            yield put(updateUserPackageSuccess(response))
        } else {
            yield put(updateUserPackageFailure(response.error || 'Update failed'))
        }
    } catch (error: any) {
        yield put(updateUserPackageFailure(error?.message || 'Update failed'))
    }
}

function* deleteUserPackageSaga(action: any): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, { method: 'DELETE', url: `/admin/users/packages?packageId=${action.payload}` })
        if (response.success) {
            yield put(deleteUserPackageSuccess(action.payload))
        } else {
            yield put(deleteUserPackageFailure(response.error || 'Delete failed'))
        }
    } catch (error: any) {
        yield put(deleteUserPackageFailure(error?.message || 'Delete failed'))
    }
}

function* assignPackageSaga(action: any): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, { method: 'POST', url: '/admin/users/assign-package', body: action.payload })
        if (response.success) {
            yield put(assignPackageSuccess(response.package))
            // Update user balance in store if returned
            if (response.balance !== undefined && action.payload.userId) {
                yield put(updateAdminUserSuccess({ id: action.payload.userId, balance: response.balance }))
            }
        } else {
            yield put(assignPackageFailure(response.error || 'Assign failed'))
        }
    } catch (error: any) {
        yield put(assignPackageFailure(error?.message || 'Assign failed'))
    }
}

export default function* adminUserPackagesSaga() {
    yield takeLatest(FETCH_USER_PACKAGES_REQUEST, fetchUserPackagesSaga)
    yield takeLatest(UPDATE_USER_PACKAGE_REQUEST, updateUserPackageSaga)
    yield takeLatest(DELETE_USER_PACKAGE_REQUEST, deleteUserPackageSaga)
    yield takeLatest(ASSIGN_PACKAGE_REQUEST, assignPackageSaga)
}
