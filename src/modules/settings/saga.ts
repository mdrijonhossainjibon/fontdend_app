import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint';
import { toast } from "sonner";

function* fetchSettingsSaga(): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: '/admin/settings'
        });

        if (status === 200) {
            yield put(actions.fetchSettingsSuccess(response.settings || response));
        } else {
            yield put(actions.fetchSettingsFailure(response?.error || 'Failed to fetch settings'));
            toast.error(response?.error || 'Failed to fetch settings');
        }
    } catch (error: any) {
        yield put(actions.fetchSettingsFailure(error.message));
        toast.error(error.message);
    }
}

function* saveSettingsSaga(action: any): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/admin/settings',
            body: action.payload
        });

        if (status === 200) {
            yield put(actions.saveSettingsSuccess(response.settings || action.payload));
            toast.success('Settings updated successfully');
        } else {
            yield put(actions.saveSettingsFailure(response?.error || 'Failed to save settings'));
            toast.error(response?.error || 'Failed to save settings');
        }
    } catch (error: any) {
        yield put(actions.saveSettingsFailure(error.message));
        toast.error(error.message);
    }
}

export default function* settingsSaga() {
    yield takeLatest(types.FETCH_SETTINGS_REQUEST, fetchSettingsSaga);
    yield takeLatest(types.SAVE_SETTINGS_REQUEST, saveSettingsSaga);
}
