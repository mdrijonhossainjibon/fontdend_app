import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import { API_CALL } from '@/lib/auth-fingerprint';

function* fetchHealthStatusesSaga(): Generator {
    try {
        const { response, status }: any = yield (call as any)(API_CALL, {
            method: 'GET',
            url: '/admin/health-check',
        });

        if (status === 200) {
            yield put(actions.fetchHealthStatusesSuccess(response.healthStatuses || []));
        } else {
            yield put(actions.fetchHealthStatusesFailure(response?.error || 'Failed to fetch health statuses'));
        }
    } catch (error: any) {
        yield put(actions.fetchHealthStatusesFailure(error.message || 'An error occurred'));
    }
}

function* runHealthCheckSaga(action: any): Generator {
    try {
        const { endpointId } = action.payload;
        const { response, status }: any = yield (call as any)(API_CALL, {
            method: 'POST',
            url: '/admin/health-check/run',
            body: endpointId ? { endpointId } : {},
        });

        if (status === 200) {
            yield put(actions.runHealthCheckSuccess(response.healthStatuses || []));
        } else {
            yield put(actions.runHealthCheckFailure(response?.error || 'Failed to run health check'));
        }
    } catch (error: any) {
        yield put(actions.runHealthCheckFailure(error.message || 'An error occurred'));
    }
}

export default function* adminHealthCheckSaga() {
    yield all([
        takeLatest(types.FETCH_HEALTH_STATUSES_REQUEST, fetchHealthStatusesSaga),
        takeLatest(types.RUN_HEALTH_CHECK_REQUEST, runHealthCheckSaga),
    ]);
}
