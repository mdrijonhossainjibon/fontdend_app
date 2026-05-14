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

// ── Wallet Management ────────────────────────────────────────────────────────

export const fetchAdminWalletsRequest = () => ({
    type: types.FETCH_ADMIN_WALLETS_REQUEST,
});

export const fetchAdminWalletsSuccess = (payload: any) => ({
    type: types.FETCH_ADMIN_WALLETS_SUCCESS,
    payload,
});

export const fetchAdminWalletsFailure = (error: string) => ({
    type: types.FETCH_ADMIN_WALLETS_FAILURE,
    payload: error,
});

export const createAdminWalletRequest = (payload: any) => ({
    type: types.CREATE_ADMIN_WALLET_REQUEST,
    payload,
});

export const createAdminWalletSuccess = (payload: any) => ({
    type: types.CREATE_ADMIN_WALLET_SUCCESS,
    payload,
});

export const createAdminWalletFailure = (error: string) => ({
    type: types.CREATE_ADMIN_WALLET_FAILURE,
    payload: error,
});

export const deleteAdminWalletRequest = (payload: string) => ({
    type: types.DELETE_ADMIN_WALLET_REQUEST,
    payload,
});

export const deleteAdminWalletSuccess = (payload: string) => ({
    type: types.DELETE_ADMIN_WALLET_SUCCESS,
    payload,
});

export const deleteAdminWalletFailure = (error: string) => ({
    type: types.DELETE_ADMIN_WALLET_FAILURE,
    payload: error,
});
