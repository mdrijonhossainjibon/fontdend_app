import * as types from './constants';

export const fetchSettingsRequest = () => ({
    type: types.FETCH_SETTINGS_REQUEST,
});

export const fetchSettingsSuccess = (payload: any) => ({
    type: types.FETCH_SETTINGS_SUCCESS,
    payload,
});

export const fetchSettingsFailure = (error: string) => ({
    type: types.FETCH_SETTINGS_FAILURE,
    payload: error,
});

export const saveSettingsRequest = (payload: any) => ({
    type: types.SAVE_SETTINGS_REQUEST,
    payload,
});

export const saveSettingsSuccess = (payload: any) => ({
    type: types.SAVE_SETTINGS_SUCCESS,
    payload,
});

export const saveSettingsFailure = (error: string) => ({
    type: types.SAVE_SETTINGS_FAILURE,
    payload: error,
});

export const updateSettingField = (key: string, value: any) => ({
    type: types.UPDATE_SETTING_FIELD,
    payload: { key, value },
});
