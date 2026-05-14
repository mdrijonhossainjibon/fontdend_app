import * as types from './constants';

const initialState = {
    data: {
        platformName: "SparkAI",
        supportEmail: "support@sparkai.com",
        maxApiRateLimit: "1000 req/min",
        mainWalletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        twoFARequired: true,
        ipWhitelist: false,
        sessionTimeout: "30 minutes",
    },
    loading: false,
    saving: false,
    error: null,
};

const settingsReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.FETCH_SETTINGS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case types.FETCH_SETTINGS_SUCCESS:
            return {
                ...state,
                loading: false,
                data: { ...state.data, ...action.payload },
                error: null,
            };
        case types.FETCH_SETTINGS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case types.SAVE_SETTINGS_REQUEST:
            return {
                ...state,
                saving: true,
            };
        case types.SAVE_SETTINGS_SUCCESS:
            return {
                ...state,
                saving: false,
                data: { ...state.data, ...action.payload },
            };
        case types.SAVE_SETTINGS_FAILURE:
            return {
                ...state,
                saving: false,
                error: action.payload,
            };
        case types.UPDATE_SETTING_FIELD:
            return {
                ...state,
                data: {
                    ...state.data,
                    [action.payload.key]: action.payload.value,
                },
            };
        default:
            return state;
    }
};

export default settingsReducer;
