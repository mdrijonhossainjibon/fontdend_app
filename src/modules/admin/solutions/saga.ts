import { call, put, takeLatest } from 'redux-saga/effects'
import * as types from './constants'
import * as actions from './actions'
import type { FetchSolutionsParams } from './actions'
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint'

function* fetchSolutionsSaga(action: ReturnType<typeof actions.fetchSolutionsRequest>) {
    try {
        const params = action.payload
        const queryParams = new URLSearchParams()
        if (params.search) queryParams.append('search', params.search)
        if (params.service) queryParams.append('service', params.service)
        if (params.type) queryParams.append('type', params.type)
        queryParams.append('page', params.page.toString())
        queryParams.append('limit', params.limit.toString())

        const { response }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: `/admin/solutions?${queryParams.toString()}`,
        })
        const data = response as any
        yield put(
            actions.fetchSolutionsSuccess({
                solutions: data.solutions || [],
                stats: data.stats || null,
                pagination: data.pagination || null,
            }),
        )
    } catch (error: any) {
        yield put(
            actions.fetchSolutionsFailure(error?.response?.data?.error || error.message),
        )
    }
}

function* deleteSolutionSaga(
    action: ReturnType<typeof actions.deleteSolutionRequest>,
) {
    try {
        yield call(API_CALL, {
            method: 'DELETE',
            url: `/admin/solutions?solutionId=${action.payload.id}`,
        })
        yield put(actions.deleteSolutionSuccess())
        // Refetch with same filters
        if (action.payload.filters) {
            yield put(actions.fetchSolutionsRequest(action.payload.filters))
        } else {
            yield put(
                actions.fetchSolutionsRequest({ search: '', service: '', type: '', page: 1, limit: 20 }),
            )
        }
    } catch (error: any) {
        yield put(
            actions.deleteSolutionFailure(error?.response?.data?.error || error.message),
        )
    }
}

function* clearAllSolutionsSaga(
    action: ReturnType<typeof actions.clearAllSolutionsRequest>,
) {
    try {
        const params = new URLSearchParams()
        params.append('clearAll', 'true')
        if (action.payload.filters?.service) params.append('service', action.payload.filters.service)
        if (action.payload.filters?.type) params.append('type', action.payload.filters.type)

        yield call(API_CALL, {
            method: 'DELETE',
            url: `/admin/solutions?${params.toString()}`,
        })
        yield put(actions.clearAllSolutionsSuccess())
        // Refetch with same filters
        if (action.payload.filters) {
            yield put(actions.fetchSolutionsRequest(action.payload.filters))
        } else {
            yield put(
                actions.fetchSolutionsRequest({ search: '', service: '', type: '', page: 1, limit: 20 }),
            )
        }
    } catch (error: any) {
        yield put(
            actions.clearAllSolutionsFailure(error?.response?.data?.error || error.message),
        )
    }
}

export default function* adminSolutionsSaga() {
    yield takeLatest(types.FETCH_SOLUTIONS_REQUEST, fetchSolutionsSaga)
    yield takeLatest(types.DELETE_SOLUTION_REQUEST, deleteSolutionSaga)
    yield takeLatest(types.CLEAR_ALL_SOLUTIONS_REQUEST, clearAllSolutionsSaga)
}
