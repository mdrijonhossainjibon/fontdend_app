import { takeLatest, call, put } from 'redux-saga/effects'
import {
    FETCH_CACHE_SETTINGS_REQUEST,
    UPDATE_CACHE_SETTING_REQUEST,
} from './constants'
import {
    fetchCacheSettingsSuccess,
    fetchCacheSettingsFailure,
    updateCacheSettingSuccess,
    updateCacheSettingFailure,
} from './actions'
import { API_CALL } from '@/lib/auth-fingerprint'

function* fetchCacheSettingsSaga(): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, {
            method: 'GET',
            url: '/admin/settings/site',
        })
        yield put(fetchCacheSettingsSuccess(response.settings))
    } catch (error: any) {
        yield put(fetchCacheSettingsFailure(error?.message || 'Failed to load cache settings'))
    }
}

function* updateCacheSettingSaga(action: any): Generator<any, void, any> {
    try {
        const { status } = yield call(API_CALL, {
            method: 'PATCH',
            url: '/admin/settings/site',
            body: { [action.key]: action.value },
        })
        if (status === 200) {
            yield put(updateCacheSettingSuccess())
        } else {
            yield put(updateCacheSettingFailure(action.key, !action.value))
        }
    } catch (error: any) {
        yield put(updateCacheSettingFailure(action.key, !action.value))
    }
}

export default function* adminCacheControlSaga() {
    yield takeLatest(FETCH_CACHE_SETTINGS_REQUEST, fetchCacheSettingsSaga)
    yield takeLatest(UPDATE_CACHE_SETTING_REQUEST, updateCacheSettingSaga)
}
