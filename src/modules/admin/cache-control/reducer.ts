import {
    FETCH_CACHE_SETTINGS_REQUEST,
    FETCH_CACHE_SETTINGS_SUCCESS,
    FETCH_CACHE_SETTINGS_FAILURE,
    UPDATE_CACHE_SETTING_REQUEST,
    UPDATE_CACHE_SETTING_SUCCESS,
    UPDATE_CACHE_SETTING_FAILURE,
} from './constants'

export interface CacheControlState {
    settings: Record<string, boolean>
    loading: boolean
    savingKey: string | null
    error: string | null
}

const initialState: CacheControlState = {
    settings: {},
    loading: false,
    savingKey: null,
    error: null,
}

const cacheControlReducer = (state = initialState, action: any): CacheControlState => {
    switch (action.type) {
        case FETCH_CACHE_SETTINGS_REQUEST:
            return { ...state, loading: true, error: null }
        case FETCH_CACHE_SETTINGS_SUCCESS:
            return { ...state, settings: action.payload, loading: false, error: null }
        case FETCH_CACHE_SETTINGS_FAILURE:
            return { ...state, loading: false, error: action.error }
        case UPDATE_CACHE_SETTING_REQUEST:
            return {
                ...state,
                settings: { ...state.settings, [action.key]: action.value },
                savingKey: action.key,
            }
        case UPDATE_CACHE_SETTING_SUCCESS:
            return { ...state, savingKey: null }
        case UPDATE_CACHE_SETTING_FAILURE:
            return {
                ...state,
                settings: { ...state.settings, [action.key]: action.value },
                savingKey: null,
            }
        default:
            return state
    }
}

export default cacheControlReducer
