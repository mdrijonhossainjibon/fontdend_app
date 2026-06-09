import * as types from './constants';

export const fetchAdminStatsRequest = () => ({
    type: types.FETCH_ADMIN_STATS_REQUEST,
});

export const fetchAdminStatsSuccess = (payload: any) => ({
    type: types.FETCH_ADMIN_STATS_SUCCESS,
    payload,
});

export const fetchAdminStatsFailure = (error: string) => ({
    type: types.FETCH_ADMIN_STATS_FAILURE,
    payload: error,
});

export const fetchAdminUsersRequest = (payload: any) => ({
    type: types.FETCH_ADMIN_USERS_REQUEST,
    payload,
});

export const fetchAdminUsersSuccess = (payload: any) => ({
    type: types.FETCH_ADMIN_USERS_SUCCESS,
    payload,
});

export const fetchAdminUsersFailure = (error: string) => ({
    type: types.FETCH_ADMIN_USERS_FAILURE,
    payload: error,
});

export const updateAdminUserRequest = (payload: any) => ({
    type: types.UPDATE_ADMIN_USER_REQUEST,
    payload,
});

export const updateAdminUserSuccess = (payload: any) => ({
    type: types.UPDATE_ADMIN_USER_SUCCESS,
    payload,
});

export const updateAdminUserFailure = (error: string) => ({
    type: types.UPDATE_ADMIN_USER_FAILURE,
    payload: error,
});

export const deleteAdminUserRequest = (payload: any) => ({
    type: types.DELETE_ADMIN_USER_REQUEST,
    payload,
});

export const deleteAdminUserSuccess = (payload: any) => ({
    type: types.DELETE_ADMIN_USER_SUCCESS,
    payload,
});

export const deleteAdminUserFailure = (error: string) => ({
    type: types.DELETE_ADMIN_USER_FAILURE,
    payload: error,
});

export const clearAdminUsersRequest = (filters?: any) => ({
    type: types.CLEAR_ADMIN_USERS_REQUEST,
    payload: filters,
});

export const clearAdminUsersSuccess = (payload: any) => ({
    type: types.CLEAR_ADMIN_USERS_SUCCESS,
    payload,
});

export const clearAdminUsersFailure = (error: string) => ({
    type: types.CLEAR_ADMIN_USERS_FAILURE,
    payload: error,
});

// ── Bot Management ────────────────────────────────────────────────────────────

export const fetchAdminBotsRequest = (payload?: any) => ({
    type: types.FETCH_ADMIN_BOTS_REQUEST,
    payload,
});

export const fetchAdminBotsSuccess = (payload: any) => ({
    type: types.FETCH_ADMIN_BOTS_SUCCESS,
    payload,
});

export const fetchAdminBotsFailure = (error: string) => ({
    type: types.FETCH_ADMIN_BOTS_FAILURE,
    payload: error,
});

export const updateAdminBotRequest = (payload: any) => ({
    type: types.UPDATE_ADMIN_BOT_REQUEST,
    payload,
});

export const updateAdminBotSuccess = (payload: any) => ({
    type: types.UPDATE_ADMIN_BOT_SUCCESS,
    payload,
});

export const updateAdminBotFailure = (error: string) => ({
    type: types.UPDATE_ADMIN_BOT_FAILURE,
    payload: error,
});

export const deleteAdminBotRequest = (payload: any) => ({
    type: types.DELETE_ADMIN_BOT_REQUEST,
    payload,
});

export const deleteAdminBotSuccess = (payload: any) => ({
    type: types.DELETE_ADMIN_BOT_SUCCESS,
    payload,
});

export const deleteAdminBotFailure = (error: string) => ({
    type: types.DELETE_ADMIN_BOT_FAILURE,
    payload: error,
});

// ── Email Templates ──────────────────────────────────────────────────────────

export const fetchEmailTemplatesRequest = () => ({
    type: types.FETCH_EMAIL_TEMPLATES_REQUEST,
});

export const fetchEmailTemplatesSuccess = (payload: any) => ({
    type: types.FETCH_EMAIL_TEMPLATES_SUCCESS,
    payload,
});

export const fetchEmailTemplatesFailure = (error: string) => ({
    type: types.FETCH_EMAIL_TEMPLATES_FAILURE,
    payload: error,
});

export const createEmailTemplateRequest = (payload: any) => ({
    type: types.CREATE_EMAIL_TEMPLATE_REQUEST,
    payload,
});

export const createEmailTemplateSuccess = (payload: any) => ({
    type: types.CREATE_EMAIL_TEMPLATE_SUCCESS,
    payload,
});

export const createEmailTemplateFailure = (error: string) => ({
    type: types.CREATE_EMAIL_TEMPLATE_FAILURE,
    payload: error,
});

export const updateEmailTemplateRequest = (payload: any) => ({
    type: types.UPDATE_EMAIL_TEMPLATE_REQUEST,
    payload,
});

export const updateEmailTemplateSuccess = (payload: any) => ({
    type: types.UPDATE_EMAIL_TEMPLATE_SUCCESS,
    payload,
});

export const updateEmailTemplateFailure = (error: string) => ({
    type: types.UPDATE_EMAIL_TEMPLATE_FAILURE,
    payload: error,
});

export const deleteEmailTemplateRequest = (payload: any) => ({
    type: types.DELETE_EMAIL_TEMPLATE_REQUEST,
    payload,
});

export const deleteEmailTemplateSuccess = (payload: any) => ({
    type: types.DELETE_EMAIL_TEMPLATE_SUCCESS,
    payload,
});

export const deleteEmailTemplateFailure = (error: string) => ({
    type: types.DELETE_EMAIL_TEMPLATE_FAILURE,
    payload: error,
});

// ── Admin Analytics ────────────────────────────────────────────────────────────

export const fetchAdminAnalyticsRequest = (days: number = 30) => ({
    type: types.FETCH_ADMIN_ANALYTICS_REQUEST,
    payload: days,
});

export const fetchAdminAnalyticsSuccess = (payload: any) => ({
    type: types.FETCH_ADMIN_ANALYTICS_SUCCESS,
    payload,
});

export const fetchAdminAnalyticsFailure = (error: string) => ({
    type: types.FETCH_ADMIN_ANALYTICS_FAILURE,
    payload: error,
});

