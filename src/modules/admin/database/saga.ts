import { takeLatest, call, put } from 'redux-saga/effects'
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint'
import {
    fetchDatabaseStatsSuccess,
    fetchDatabaseStatsFailure,
    validateCollectionSuccess,
    validateCollectionFailure,
    repairCollectionSuccess,
    repairCollectionFailure,
    deleteDatabaseIndexSuccess,
    deleteDatabaseIndexFailure,
    fetchDatabaseStatsRequest,
    backupCollectionSuccess,
    backupCollectionFailure,
} from './actions'

function* fetchDatabaseStatsSaga(): any {
    try {
        const { response }: APIResponse = yield call(API_CALL, { method: 'GET', url: '/admin/database' })
        const data = response as any
        const collections = data?.data || []

        // Compute aggregated stats from collections
        const stats = {
            totalCollections: collections.length,
            totalDocuments: collections.reduce((sum: number, c: any) => sum + (c.count || 0), 0),
            totalSize: collections.reduce((sum: number, c: any) => sum + (c.size || 0), 0),
            totalStorageSize: collections.reduce((sum: number, c: any) => sum + (c.storageSize || 0), 0),
            totalIndexSize: collections.reduce((sum: number, c: any) => sum + (c.totalIndexSize || 0), 0),
            databaseName: data?.databaseName || '',
            avgObjSize: collections.reduce((sum: number, c: any) => sum + (c.avgObjSize || 0), 0) / (collections.length || 1),
        }

        yield put(fetchDatabaseStatsSuccess({ collections, stats }))
    } catch (error: any) {
        yield put(fetchDatabaseStatsFailure(error?.response?.data?.error || error.message))
    }
}

function* validateCollectionSaga(action: any): any {
    try {
        const { response }: APIResponse = yield call(API_CALL, { method: 'POST', url: '/admin/database/validate', data: action.payload })
        yield put(validateCollectionSuccess(response))
        yield put(fetchDatabaseStatsRequest())
    } catch (error: any) {
        yield put(validateCollectionFailure(error?.response?.data?.error || error.message))
    }
}

function* repairCollectionSaga(action: any): any {
    try {
        const { response }: APIResponse = yield call(API_CALL, { method: 'POST', url: '/admin/database/repair', data: action.payload })
        yield put(repairCollectionSuccess(response))
        yield put(fetchDatabaseStatsRequest())
    } catch (error: any) {
        yield put(repairCollectionFailure(error?.response?.data?.error || error.message))
    }
}

function* deleteIndexSaga(action: any): any {
    try {
        const { response }: APIResponse = yield call(API_CALL, { method: 'POST', url: '/admin/database/delete-index', data: action.payload })
        yield put(deleteDatabaseIndexSuccess(response))
        yield put(fetchDatabaseStatsRequest())
    } catch (error: any) {
        yield put(deleteDatabaseIndexFailure(error?.response?.data?.error || error.message))
    }
}

function* backupCollectionSaga(action: any): any {
    try {
        const { response }: APIResponse = yield call(API_CALL, { method: 'POST', url: '/admin/database', data: action.payload })
        yield put(backupCollectionSuccess({ collectionName: action.payload.collectionName, data: response }))
    } catch (error: any) {
        yield put(backupCollectionFailure(error?.response?.data?.error || error.message))
    }
}

export default function* adminDatabaseSaga() {
    yield takeLatest('FETCH_DATABASE_STATS_REQUEST', fetchDatabaseStatsSaga)
    yield takeLatest('VALIDATE_COLLECTION_REQUEST', validateCollectionSaga)
    yield takeLatest('REPAIR_COLLECTION_REQUEST', repairCollectionSaga)
    yield takeLatest('DELETE_INDEX_REQUEST', deleteIndexSaga)
    yield takeLatest('BACKUP_COLLECTION_REQUEST', backupCollectionSaga)
}
