import {
    FETCH_CACHE_SETTINGS_REQUEST,
    FETCH_CACHE_SETTINGS_SUCCESS,
    FETCH_CACHE_SETTINGS_FAILURE,
    UPDATE_CACHE_SETTING_REQUEST,
    UPDATE_CACHE_SETTING_SUCCESS,
    UPDATE_CACHE_SETTING_FAILURE,
} from './constants'

export const fetchCacheSettingsRequest = () => ({ type: FETCH_CACHE_SETTINGS_REQUEST })
export const fetchCacheSettingsSuccess = (payload: Record<string, boolean>) => ({ type: FETCH_CACHE_SETTINGS_SUCCESS, payload })
export const fetchCacheSettingsFailure = (error: string) => ({ type: FETCH_CACHE_SETTINGS_FAILURE, error })

export const updateCacheSettingRequest = (key: string, value: boolean) => ({ type: UPDATE_CACHE_SETTING_REQUEST, key, value })
export const updateCacheSettingSuccess = () => ({ type: UPDATE_CACHE_SETTING_SUCCESS })
export const updateCacheSettingFailure = (key: string, value: boolean) => ({ type: UPDATE_CACHE_SETTING_FAILURE, key, value })
