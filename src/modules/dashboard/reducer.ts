import * as types from './constants';

const initialState: any = {
    userData: null,
    dailyUsage: null,
    activePackage: null,
    apiKeys: [],
    loading: false,
    error: null,
    generatingKey: null,
    regeneratingKey: null,
    activities: [],
    activitiesLoading: false,
    activitiesError: null,
    extensions: [],
    extensionsLoading: false,
    extensionsError: null,
    offers: [],
    offersLoading: false,
    offersError: null,
};

const dashboardReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.FETCH_DASHBOARD_DATA_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case types.FETCH_DASHBOARD_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                userData: action.payload.userData,
                dailyUsage: action.payload.dailyUsage,
                activePackage: action.payload.activePackage,
                apiKeys: action.payload.apiKeys,
                error: null,
            };
        case types.FETCH_DASHBOARD_DATA_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case types.GENERATE_KEY_REQUEST:
            return {
                ...state,
                generatingKey: action.payload.slotName,
            };
        case types.GENERATE_KEY_SUCCESS:
            return {
                ...state,
                generatingKey: null,
                apiKeys: action.payload
                    ? state.apiKeys.map((k: any) =>
                        k.status === 'empty' && !k.id
                            ? { ...action.payload, isMaster: false }
                            : k
                      )
                    : state.apiKeys,
            };
        case types.GENERATE_KEY_FAILURE:
            return {
                ...state,
                generatingKey: null,
            };

        case types.DELETE_KEY_REQUEST:
            return {
                ...state,
            };
        case types.DELETE_KEY_SUCCESS:
            return {
                ...state,
                apiKeys: state.apiKeys.map((k: any, i: number) =>
                    k.id === action.payload
                        ? { name: `Slot ${i + 1}`, key: '', fullKey: '', status: 'empty', lastUsed: '', usageCount: 0, isMaster: k.isMaster }
                        : k
                ),
            };
        case types.DELETE_KEY_FAILURE:
            return {
                ...state,
                error: action.payload,
            };

        case types.REGENERATE_KEY_REQUEST:
            return {
                ...state,
                regeneratingKey: action.payload.name,
            };
        case types.REGENERATE_KEY_SUCCESS:
            return {
                ...state,
                regeneratingKey: null,
                apiKeys: state.apiKeys.map((key: any) =>
                    key.id === action.payload?.id
                        ? { ...key, ...action.payload, isMaster: key.isMaster }
                        : key
                ),
            };
        case types.REGENERATE_KEY_FAILURE:
            return {
                ...state,
                regeneratingKey: null,
            };

        case types.TOGGLE_AUTO_RENEW_REQUEST:
            return {
                ...state,
                // Optional: Optimistic update could happen here or in component
            };
        case types.TOGGLE_AUTO_RENEW_SUCCESS:
            return {
                ...state,
                activePackage: state.activePackage ? {
                    ...state.activePackage,
                    autoRenew: action.payload
                } : null
            };
        case types.TOGGLE_AUTO_RENEW_FAILURE:
            return {
                ...state,
                error: action.payload,
            };

        case types.CANCEL_PACKAGE_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case types.CANCEL_PACKAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                activePackage: null,
            };
        case types.CANCEL_PACKAGE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case types.FETCH_ACTIVITIES_REQUEST:
            return {
                ...state,
                activitiesLoading: true,
                activitiesError: null,
            };
        case types.FETCH_ACTIVITIES_SUCCESS:
            return {
                ...state,
                activitiesLoading: false,
                activities: action.payload,
            };
        case types.FETCH_ACTIVITIES_FAILURE:
            return {
                ...state,
                activitiesLoading: false,
                activitiesError: action.payload,
            };

        case types.UPDATE_USER_BALANCE:
            return {
                ...state,
                userData: state.userData ? {
                    ...state.userData,
                    balance: (state.userData.balance || 0) + action.payload
                } : null
            };

        case types.FETCH_EXTENSIONS_REQUEST:
            return {
                ...state,
                extensionsLoading: true,
                extensionsError: null,
            };
        case types.FETCH_EXTENSIONS_SUCCESS:
            return {
                ...state,
                extensionsLoading: false,
                extensions: action.payload,
            };
        case types.FETCH_EXTENSIONS_FAILURE:
            return {
                ...state,
                extensionsLoading: false,
                extensionsError: action.payload,
            };

        case types.FETCH_OFFERS_REQUEST:
            return {
                ...state,
                offersLoading: true,
                offersError: null,
            };
        case types.FETCH_OFFERS_SUCCESS:
            return {
                ...state,
                offersLoading: false,
                offers: action.payload,
            };
        case types.FETCH_OFFERS_FAILURE:
            return {
                ...state,
                offersLoading: false,
                offersError: action.payload,
            };

        default:
            return state;
    }
};

export default dashboardReducer;
