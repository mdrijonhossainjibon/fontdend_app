import * as types from './constants';

const initialState = {
    stats: null,
    loading: false,
    error: null,
    users: [],
    pagination: {
        total: 0, page: 1, limit: 10,
        totalPages: 0, hasNextPage: false, hasPrevPage: false
    },
    isSaving: false,
    // Bot Management
    bots: [],
    botPagination: {
        total: 0, page: 1, limit: 10,
        totalPages: 0, hasNextPage: false, hasPrevPage: false
    },
    // Email Templates
    emailTemplates: [],
    emailLoading: false,
};


const adminReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.FETCH_ADMIN_STATS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case types.FETCH_ADMIN_STATS_SUCCESS:
            return {
                ...state,
                loading: false,
                stats: action.payload,
                error: null,
            };
        case types.FETCH_ADMIN_STATS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case types.FETCH_ADMIN_USERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case types.FETCH_ADMIN_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                users: action.payload.users,
                pagination: action.payload.pagination,
                error: null,
            };
        case types.FETCH_ADMIN_USERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case types.UPDATE_ADMIN_USER_REQUEST:
            return {
                ...state,
                isSaving: true,
                error: null,
            };
        case types.UPDATE_ADMIN_USER_SUCCESS:
            return {
                ...state,
                isSaving: false,
                users: state.users.map((user: any) =>
                    user.id === action.payload.id ? { ...user, ...action.payload } : user
                ),
                error: null,
            };
        case types.UPDATE_ADMIN_USER_FAILURE:
            return {
                ...state,
                isSaving: false,
                error: action.payload,
            };
        case types.DELETE_ADMIN_USER_REQUEST:
            return {
                ...state,
                isSaving: true,
                error: null,
            };
        case types.DELETE_ADMIN_USER_SUCCESS:
            return {
                ...state,
                isSaving: false,
                users: state.users.filter((user: any) => user.id !== action.payload),
                error: null,
            };
        case types.DELETE_ADMIN_USER_FAILURE:
            return {
                ...state,
                isSaving: false,
                error: action.payload,
            };

        // ── Bot Management ──────────────────────────────────────────────────
        case types.FETCH_ADMIN_BOTS_REQUEST:
            return { ...state, loading: true, error: null };
        case types.FETCH_ADMIN_BOTS_SUCCESS:
            return {
                ...state,
                loading: false,
                bots: action.payload.bots,
                botPagination: action.payload.pagination,
                error: null,
            };
        case types.FETCH_ADMIN_BOTS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.UPDATE_ADMIN_BOT_REQUEST:
            return { ...state, isSaving: true, error: null };
        case types.UPDATE_ADMIN_BOT_SUCCESS:
            return {
                ...state,
                isSaving: false,
                bots: state.bots.map((bot: any) =>
                    bot.id === action.payload.id ? { ...bot, ...action.payload } : bot
                ),
            };
        case types.UPDATE_ADMIN_BOT_FAILURE:
            return { ...state, isSaving: false, error: action.payload };

        case types.DELETE_ADMIN_BOT_REQUEST:
            return { ...state, isSaving: true, error: null };
        case types.DELETE_ADMIN_BOT_SUCCESS:
            return {
                ...state,
                isSaving: false,
                bots: state.bots.filter((bot: any) => bot.id !== action.payload),
            };
        case types.DELETE_ADMIN_BOT_FAILURE:
            return { ...state, isSaving: false, error: action.payload };

        // ── Email Templates ─────────────────────────────────────────────────
        case types.FETCH_EMAIL_TEMPLATES_REQUEST:
            return { ...state, emailLoading: true, error: null };
        case types.FETCH_EMAIL_TEMPLATES_SUCCESS:
            return { ...state, emailLoading: false, emailTemplates: action.payload.templates, error: null };
        case types.FETCH_EMAIL_TEMPLATES_FAILURE:
            return { ...state, emailLoading: false, error: action.payload };

        case types.CREATE_EMAIL_TEMPLATE_REQUEST:
            return { ...state, emailLoading: true, error: null };
        case types.CREATE_EMAIL_TEMPLATE_SUCCESS:
            return { ...state, emailLoading: false, error: null };
        case types.CREATE_EMAIL_TEMPLATE_FAILURE:
            return { ...state, emailLoading: false, error: action.payload };

        case types.UPDATE_EMAIL_TEMPLATE_REQUEST:
            return { ...state, emailLoading: true, error: null };
        case types.UPDATE_EMAIL_TEMPLATE_SUCCESS:
            return { ...state, emailLoading: false, error: null };
        case types.UPDATE_EMAIL_TEMPLATE_FAILURE:
            return { ...state, emailLoading: false, error: action.payload };

        case types.DELETE_EMAIL_TEMPLATE_REQUEST:
            return { ...state, emailLoading: true, error: null };
        case types.DELETE_EMAIL_TEMPLATE_SUCCESS:
            return { ...state, emailLoading: false, error: null };
        case types.DELETE_EMAIL_TEMPLATE_FAILURE:
            return { ...state, emailLoading: false, error: action.payload };

        default:
            return state;
    }
};

export default adminReducer;

