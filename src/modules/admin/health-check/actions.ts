import * as types from './constants';

export const fetchHealthStatusesRequest = () => ({
    type: types.FETCH_HEALTH_STATUSES_REQUEST,
});

export const fetchHealthStatusesSuccess = (healthStatuses: any[]) => ({
    type: types.FETCH_HEALTH_STATUSES_SUCCESS,
    payload: healthStatuses,
});

export const fetchHealthStatusesFailure = (error: string) => ({
    type: types.FETCH_HEALTH_STATUSES_FAILURE,
    payload: error,
});

export const runHealthCheckRequest = (endpointId?: string) => ({
    type: types.RUN_HEALTH_CHECK_REQUEST,
    payload: { endpointId },
});

export const runHealthCheckSuccess = (healthStatuses: any[]) => ({
    type: types.RUN_HEALTH_CHECK_SUCCESS,
    payload: healthStatuses,
});

export const runHealthCheckFailure = (error: string) => ({
    type: types.RUN_HEALTH_CHECK_FAILURE,
    payload: error,
});
