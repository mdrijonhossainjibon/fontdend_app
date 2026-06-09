import * as types from './constants';

const initialState = {
    user: null,
    packages: [],
    apiKeys: [],
    loading: false,
    apiKeysLoading: false,
    generatingKey: false,
    error: null,
};

const adminUserDetailsReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.FETCH_ADMIN_USER_DETAILS_REQUEST:
            return { ...state, loading: true, error: null };
        case types.FETCH_ADMIN_USER_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                user: { ...action.payload.user, id: action.payload.user._id || action.payload.user.id },
                packages: action.payload.packages || [],
                error: null,
            };
        case types.FETCH_ADMIN_USER_DETAILS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // API Keys
        case types.FETCH_ADMIN_USER_API_KEYS_REQUEST:
            return { ...state, apiKeysLoading: true };
        case types.FETCH_ADMIN_USER_API_KEYS_SUCCESS:
            return { ...state, apiKeysLoading: false, apiKeys: action.payload || [] };
        case types.FETCH_ADMIN_USER_API_KEYS_FAILURE:
            return { ...state, apiKeysLoading: false };

        case types.GENERATE_ADMIN_USER_API_KEY_REQUEST:
            return { ...state, generatingKey: true };
        case types.GENERATE_ADMIN_USER_API_KEY_SUCCESS:
            return {
                ...state,
                generatingKey: false,
                apiKeys: [...state.apiKeys, action.payload],
            };
        case types.GENERATE_ADMIN_USER_API_KEY_FAILURE:
            return { ...state, generatingKey: false };

        case types.DELETE_ADMIN_USER_API_KEY_SUCCESS:
            return {
                ...state,
                apiKeys: state.apiKeys.filter((k: any) => k.id !== action.payload && k._id !== action.payload),
            };

        case types.REGENERATE_ADMIN_USER_API_KEY_SUCCESS:
            return {
                ...state,
                apiKeys: state.apiKeys.map((k: any) =>
                    (k.id === action.payload.id || k._id === action.payload._id) ? action.payload : k
                ),
            };

        default:
            return state;
    }
};

export default adminUserDetailsReducer;
