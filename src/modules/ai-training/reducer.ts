import * as types from './constants';

const initialState = {
    records: [],
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
    },
    loading: false,
    error: null,
    isDeleting: false,
    isSaving: false,
    // Bot Endpoints
    botEndpoints: [],
    botEndpointsLoading: false,
    botEndpointsError: null,
    refreshResponse: null,
    isRefreshing: false,
};

const aiTrainingReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.FETCH_KOLOTI_CACHE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case types.FETCH_KOLOTI_CACHE_SUCCESS:
            return {
                ...state,
                loading: false,
                records: action.payload.records,
                pagination: action.payload.pagination,
            };
        case types.FETCH_KOLOTI_CACHE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case types.DELETE_KOLOTI_CACHE_REQUEST:
            return {
                ...state,
                isDeleting: true,
            };
        case types.DELETE_KOLOTI_CACHE_SUCCESS:
            return {
                ...state,
                isDeleting: false,
                records: state.records.filter((record: any) => record.id !== action.payload),
                pagination: {
                    ...state.pagination,
                    total: state.pagination.total - 1
                }
            };
        case types.DELETE_KOLOTI_CACHE_FAILURE:
            return {
                ...state,
                isDeleting: false,
            };
        case types.UPDATE_KOLOTI_CACHE_ANSWER_REQUEST:
            return {
                ...state,
                isSaving: true,
            };
        case types.UPDATE_KOLOTI_CACHE_ANSWER_SUCCESS:
            return {
                ...state,
                isSaving: false,
                records: state.records.map((record: any) =>
                    record.id === action.payload.recordId
                        ? { ...record, answer: action.payload.answer }
                        : record
                )
            };
        case types.UPDATE_KOLOTI_CACHE_ANSWER_FAILURE:
            return {
                ...state,
                isSaving: false,
            };

        // Bot Endpoints
        case types.FETCH_BOT_ENDPOINTS_REQUEST:
            return {
                ...state,
                botEndpointsLoading: true,
                botEndpointsError: null,
            };
        case types.FETCH_BOT_ENDPOINTS_SUCCESS:
            return {
                ...state,
                botEndpointsLoading: false,
                botEndpoints: action.payload,
            };
        case types.FETCH_BOT_ENDPOINTS_FAILURE:
            return {
                ...state,
                botEndpointsLoading: false,
                botEndpointsError: action.payload,
            };
        case types.CREATE_BOT_ENDPOINT_REQUEST:
            return {
                ...state,
                isSaving: true,
                botEndpointsError: null,
            };
        case types.CREATE_BOT_ENDPOINT_SUCCESS:
            return {
                ...state,
                isSaving: false,
                botEndpoints: [...state.botEndpoints, action.payload],
            };
        case types.CREATE_BOT_ENDPOINT_FAILURE:
            return {
                ...state,
                isSaving: false,
                botEndpointsError: action.payload,
            };
        case types.UPDATE_BOT_ENDPOINT_REQUEST:
            return {
                ...state,
                isSaving: true,
                botEndpointsError: null,
            };
        case types.UPDATE_BOT_ENDPOINT_SUCCESS:
            return {
                ...state,
                isSaving: false,
                botEndpoints: state.botEndpoints.map((endpoint: any) =>
                    endpoint._id === action.payload._id ? action.payload : endpoint
                ),
            };
        case types.UPDATE_BOT_ENDPOINT_FAILURE:
            return {
                ...state,
                isSaving: false,
                botEndpointsError: action.payload,
            };
        case types.DELETE_BOT_ENDPOINT_REQUEST:
            return {
                ...state,
                isDeleting: true,
                botEndpointsError: null,
            };
        case types.DELETE_BOT_ENDPOINT_SUCCESS:
            return {
                ...state,
                isDeleting: false,
                botEndpoints: state.botEndpoints.filter((endpoint: any) => endpoint._id !== action.payload),
            };
        case types.DELETE_BOT_ENDPOINT_FAILURE:
            return {
                ...state,
                isDeleting: false,
                botEndpointsError: action.payload,
            };
        case types.REFRESH_BOT_CLASSES_REQUEST:
            return {
                ...state,
                isRefreshing: true,
                refreshResponse: null,
            };
        case types.REFRESH_BOT_CLASSES_SUCCESS:
            return {
                ...state,
                isRefreshing: false,
                refreshResponse: action.payload,
            };
        case types.REFRESH_BOT_CLASSES_FAILURE:
            return {
                ...state,
                isRefreshing: false,
                refreshResponse: { status: 'error', message: action.payload },
            };
        default:
            return state;
    }
};

export default aiTrainingReducer;
