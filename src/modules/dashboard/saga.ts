import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint';

function* fetchDashboardDataSaga(): Generator {
    try {
        const statsRes: any = yield (call as any)(API_CALL, { method: 'GET', url: '/dashboard/stats' });
        if (!statsRes || statsRes.status !== 200) {
            yield put(actions.fetchDashboardDataFailure('Failed to fetch dashboard stats'));
            return;
        }

        const keysRes: any = yield (call as any)(API_CALL, { method: 'GET', url: '/dashboard/api-keys' });
        if (!keysRes || keysRes.status !== 200) {
            yield put(actions.fetchDashboardDataFailure('Failed to fetch API keys'));
            return;
        }

        yield put(actions.fetchDashboardDataSuccess({
            userData: statsRes.response.user,
            dailyUsage: statsRes.response.dailyUsage,
            activePackage: statsRes.response.package,
            apiKeys: keysRes.response.apiKeys
        }));
    } catch (error: any) {
        yield put(actions.fetchDashboardDataFailure(error.message || 'An error occurred'));
    }
}

function* generateKeySaga(action: any): Generator {
    try {
        const { response, status }: APIResponse = yield (call as any)(API_CALL, {
            method: 'POST',
            url: '/dashboard/api-keys',
            body : { name: action.payload.name }
        });

        if (status === 200) {
            yield put(actions.generateKeySuccess());
            yield put(actions.fetchDashboardDataRequest());
        } else {
            yield put(actions.generateKeyFailure(response?.error || 'Failed to generate key'));
        }
    } catch (error: any) {
        yield put(actions.generateKeyFailure(error.message || 'An error occurred'));
    }
}

function* deleteKeySaga(action: any): Generator {
    try {
        const { response, status }: APIResponse = yield (call as any)(API_CALL, {
            method: 'DELETE',
            url: '/dashboard/api-keys',
            body : { id: action.payload.id }
        });

        if (status === 200) {
            yield put(actions.deleteKeySuccess());
            yield put(actions.fetchDashboardDataRequest());
        } else {
            yield put(actions.deleteKeyFailure(response?.error || 'Failed to delete key'));
        }
    } catch (error: any) {
        yield put(actions.deleteKeyFailure(error.message || 'An error occurred'));
    }
}

function* regenerateKeySaga(action: any): Generator {
    try {
        const { response, status }: APIResponse = yield (call)(API_CALL, {
            method: 'PUT',
            url: `/dashboard/api-keys/${action.payload.id}`,
        });

        if (status === 200) {
            yield put(actions.regenerateKeySuccess());
            yield put(actions.fetchDashboardDataRequest());
        } else {
            yield put(actions.regenerateKeyFailure(response?.error || 'Failed to regenerate key'));
        }
    } catch (error: any) {
        yield put(actions.regenerateKeyFailure(error.message || 'An error occurred'));
    }
}

function* toggleAutoRenewSaga(action: any): Generator {
    try {
        const { response, status }: APIResponse = yield (call as any)(API_CALL, {
            method: 'PATCH',
            url: '/dashboard/package',
            data: { autoRenew: action.payload }
        });

        if (status === 200) {
            yield put(actions.toggleAutoRenewSuccess(action.payload));
        } else {
            yield put(actions.toggleAutoRenewFailure(response?.error || 'Failed to update auto-renew'));
        }
    } catch (error: any) {
        yield put(actions.toggleAutoRenewFailure(error.message || 'An error occurred'));
    }
}

function* cancelPackageSaga(): Generator {
    try {
        const { response, status }: APIResponse = yield (call as any)(API_CALL, {
            method: 'DELETE',
            url: '/dashboard/package'
        });

        if (status === 200) {
            yield put(actions.cancelPackageSuccess());
            yield put(actions.fetchDashboardDataRequest());
        } else {
            yield put(actions.cancelPackageFailure(response?.error || 'Failed to cancel package'));
        }
    } catch (error: any) {
        yield put(actions.cancelPackageFailure(error.message || 'An error occurred'));
    }
}

function* fetchActivitiesSaga(): Generator {
    try {
        const { response, status }: APIResponse = yield (call as any)(API_CALL, {
            method: 'GET',
            url: '/dashboard/activities'
        });

        if (status === 200) {
            yield put(actions.fetchActivitiesSuccess(response.activities));
        } else {
            yield put(actions.fetchActivitiesFailure(response?.error || 'Failed to fetch activities'));
        }
    } catch (error: any) {
        yield put(actions.fetchActivitiesFailure(error.message || 'An error occurred'));
    }
}

function* fetchExtensionsSaga(): Generator {
    try {
        const { response, status }: APIResponse = yield (call as any)(API_CALL, {
            method: 'GET',
            url: '/extensions'
        });

        if (status === 200 && response.success) {
            yield put(actions.fetchExtensionsSuccess(response.extensions || []));
        } else {
            yield put(actions.fetchExtensionsFailure(response?.error || 'Failed to fetch extensions'));
        }
    } catch (error: any) {
        yield put(actions.fetchExtensionsFailure(error.message || 'An error occurred'));
    }
}

function* fetchOffersSaga(): Generator {
    try {
        const { response, status }: APIResponse = yield (call as any)(API_CALL, {
            method: 'GET',
            url: '/pricing/offers'
        });

        if (status === 200 && response.success) {
            yield put(actions.fetchOffersSuccess(response.offers || []));
        } else {
            yield put(actions.fetchOffersFailure(response?.error || 'Failed to fetch offers'));
        }
    } catch (error: any) {
        yield put(actions.fetchOffersFailure(error.message || 'An error occurred'));
    }
}

export default function* dashboardSaga() {
    yield all([
        takeLatest(types.FETCH_DASHBOARD_DATA_REQUEST, fetchDashboardDataSaga),
        takeLatest(types.GENERATE_KEY_REQUEST, generateKeySaga),
        takeLatest(types.DELETE_KEY_REQUEST, deleteKeySaga),
        takeLatest(types.REGENERATE_KEY_REQUEST, regenerateKeySaga),
        takeLatest(types.TOGGLE_AUTO_RENEW_REQUEST, toggleAutoRenewSaga),
        takeLatest(types.CANCEL_PACKAGE_REQUEST, cancelPackageSaga),
        takeLatest(types.FETCH_ACTIVITIES_REQUEST, fetchActivitiesSaga),
        takeLatest(types.FETCH_EXTENSIONS_REQUEST, fetchExtensionsSaga),
        takeLatest(types.FETCH_OFFERS_REQUEST, fetchOffersSaga),
    ]);
}
