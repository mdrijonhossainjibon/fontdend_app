import * as types from './constants';

export const fetchAdminUserDetailsRequest = (userId: string) => ({
    type: types.FETCH_ADMIN_USER_DETAILS_REQUEST,
    payload: userId,
});

export const fetchAdminUserDetailsSuccess = (payload: any) => ({
    type: types.FETCH_ADMIN_USER_DETAILS_SUCCESS,
    payload,
});

export const fetchAdminUserDetailsFailure = (error: string) => ({
    type: types.FETCH_ADMIN_USER_DETAILS_FAILURE,
    payload: error,
});

// API Keys
export const fetchAdminUserApiKeysRequest = (userId: string) => ({
    type: types.FETCH_ADMIN_USER_API_KEYS_REQUEST,
    payload: userId,
});

export const fetchAdminUserApiKeysSuccess = (apiKeys: any[]) => ({
    type: types.FETCH_ADMIN_USER_API_KEYS_SUCCESS,
    payload: apiKeys,
});

export const fetchAdminUserApiKeysFailure = (error: string) => ({
    type: types.FETCH_ADMIN_USER_API_KEYS_FAILURE,
    payload: error,
});

export const generateAdminUserApiKeyRequest = (userId: string, name: string) => ({
    type: types.GENERATE_ADMIN_USER_API_KEY_REQUEST,
    payload: { userId, name },
});

export const generateAdminUserApiKeySuccess = (apiKey: any) => ({
    type: types.GENERATE_ADMIN_USER_API_KEY_SUCCESS,
    payload: apiKey,
});

export const generateAdminUserApiKeyFailure = (error: string) => ({
    type: types.GENERATE_ADMIN_USER_API_KEY_FAILURE,
    payload: error,
});

export const deleteAdminUserApiKeyRequest = (userId: string, keyId: string) => ({
    type: types.DELETE_ADMIN_USER_API_KEY_REQUEST,
    payload: { userId, keyId },
});

export const deleteAdminUserApiKeySuccess = (keyId: string) => ({
    type: types.DELETE_ADMIN_USER_API_KEY_SUCCESS,
    payload: keyId,
});

export const deleteAdminUserApiKeyFailure = (error: string) => ({
    type: types.DELETE_ADMIN_USER_API_KEY_FAILURE,
    payload: error,
});

export const regenerateAdminUserApiKeyRequest = (userId: string, keyId: string) => ({
    type: types.REGENERATE_ADMIN_USER_API_KEY_REQUEST,
    payload: { userId, keyId },
});

export const regenerateAdminUserApiKeySuccess = (apiKey: any) => ({
    type: types.REGENERATE_ADMIN_USER_API_KEY_SUCCESS,
    payload: apiKey,
});

export const regenerateAdminUserApiKeyFailure = (error: string) => ({
    type: types.REGENERATE_ADMIN_USER_API_KEY_FAILURE,
    payload: error,
});
