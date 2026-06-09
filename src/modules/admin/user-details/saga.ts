import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint';
import { toast } from "sonner";

function* fetchAdminUserDetailsSaga(action: any): Generator {
    try {
        const userId = action.payload;
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: `/admin/users/${userId}`,
        });

        if (response && response.success) {
            yield put(actions.fetchAdminUserDetailsSuccess({
                user: response.user,
                packages: response.packages || [],
            }));
        } else {
            yield put(actions.fetchAdminUserDetailsFailure(response?.error || 'Failed to fetch user details'));
            toast.error(response?.error || 'Failed to fetch user details');
        }
    } catch (error: any) {
        yield put(actions.fetchAdminUserDetailsFailure(error?.message || 'Failed to fetch user details'));
        toast.error('Failed to fetch user details');
    }
}

function* fetchAdminUserApiKeysSaga(action: any): Generator {
    try {
        const userId = action.payload;
        const { response }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: `/admin/users/${userId}/api-keys`,
        });

        if (response && response.success) {
            yield put(actions.fetchAdminUserApiKeysSuccess(response.apiKeys || []));
        } else {
            yield put(actions.fetchAdminUserApiKeysFailure(response?.error || 'Failed to fetch API keys'));
        }
    } catch (error: any) {
        yield put(actions.fetchAdminUserApiKeysFailure(error?.message || 'Failed to fetch API keys'));
    }
}

function* generateAdminUserApiKeySaga(action: any): Generator {
    try {
        const { userId, name } = action.payload;
        const { response }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: `/admin/users/${userId}/api-keys`,
            body: { name },
        });

        if (response && response.success) {
            yield put(actions.generateAdminUserApiKeySuccess(response.apiKey));
            toast.success('API key generated successfully');
        } else {
            yield put(actions.generateAdminUserApiKeyFailure(response?.error || 'Failed to generate API key'));
            toast.error(response?.error || 'Failed to generate API key');
        }
    } catch (error: any) {
        yield put(actions.generateAdminUserApiKeyFailure(error?.message || 'Failed to generate API key'));
        toast.error('Failed to generate API key');
    }
}

function* deleteAdminUserApiKeySaga(action: any): Generator {
    try {
        const { userId, keyId } = action.payload;
        const { response }: APIResponse = yield call(API_CALL, {
            method: 'DELETE',
            url: `/admin/users/${userId}/api-keys/${keyId}`,
        });

        if (response && response.success) {
            yield put(actions.deleteAdminUserApiKeySuccess(keyId));
            toast.success('API key deleted successfully');
        } else {
            yield put(actions.deleteAdminUserApiKeyFailure(response?.error || 'Failed to delete API key'));
            toast.error(response?.error || 'Failed to delete API key');
        }
    } catch (error: any) {
        yield put(actions.deleteAdminUserApiKeyFailure(error?.message || 'Failed to delete API key'));
        toast.error('Failed to delete API key');
    }
}

function* regenerateAdminUserApiKeySaga(action: any): Generator {
    try {
        const { userId, keyId } = action.payload;
        const { response }: APIResponse = yield call(API_CALL, {
            method: 'PUT',
            url: `/admin/users/${userId}/api-keys/${keyId}`,
        });

        if (response && response.success) {
            yield put(actions.regenerateAdminUserApiKeySuccess(response.apiKey));
            toast.success('API key regenerated successfully');
        } else {
            yield put(actions.regenerateAdminUserApiKeyFailure(response?.error || 'Failed to regenerate API key'));
            toast.error(response?.error || 'Failed to regenerate API key');
        }
    } catch (error: any) {
        yield put(actions.regenerateAdminUserApiKeyFailure(error?.message || 'Failed to regenerate API key'));
        toast.error('Failed to regenerate API key');
    }
}

export default function* adminUserDetailsSaga() {
    yield takeLatest(types.FETCH_ADMIN_USER_DETAILS_REQUEST, fetchAdminUserDetailsSaga);
    yield takeLatest(types.FETCH_ADMIN_USER_API_KEYS_REQUEST, fetchAdminUserApiKeysSaga);
    yield takeLatest(types.GENERATE_ADMIN_USER_API_KEY_REQUEST, generateAdminUserApiKeySaga);
    yield takeLatest(types.DELETE_ADMIN_USER_API_KEY_REQUEST, deleteAdminUserApiKeySaga);
    yield takeLatest(types.REGENERATE_ADMIN_USER_API_KEY_REQUEST, regenerateAdminUserApiKeySaga);
}
