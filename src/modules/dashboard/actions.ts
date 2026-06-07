import * as types from './constants';

export const fetchDashboardDataRequest = () => ({
    type: types.FETCH_DASHBOARD_DATA_REQUEST,
});

export const fetchDashboardDataSuccess = (payload: any) => ({
    type: types.FETCH_DASHBOARD_DATA_SUCCESS,
    payload,
});

export const fetchDashboardDataFailure = (error: string) => ({
    type: types.FETCH_DASHBOARD_DATA_FAILURE,
    payload: error,
});

export const generateKeyRequest = (name: string, slotName: string) => ({
    type: types.GENERATE_KEY_REQUEST,
    payload: { name, slotName },
});

export const generateKeySuccess = (apiKey?: any, slotName?: string) => ({
    type: types.GENERATE_KEY_SUCCESS,
    payload: apiKey,
    meta: { slotName },
});

export const generateKeyFailure = (error: string, slotName?: string) => ({
    type: types.GENERATE_KEY_FAILURE,
    payload: error,
    meta: { slotName },
});

export const deleteKeyRequest = (id: string) => ({
    type: types.DELETE_KEY_REQUEST,
    payload: { id },
});

export const deleteKeySuccess = (id?: string) => ({
    type: types.DELETE_KEY_SUCCESS,
    payload: id,
});

export const deleteKeyFailure = (error: string) => ({
    type: types.DELETE_KEY_FAILURE,
    payload: error,
});

export const regenerateKeyRequest = (key: any) => ({
    type: types.REGENERATE_KEY_REQUEST,
    payload: key,
});

export const regenerateKeySuccess = (apiKey?: any) => ({
    type: types.REGENERATE_KEY_SUCCESS,
    payload: apiKey,
});

export const regenerateKeyFailure = (error: string) => ({
    type: types.REGENERATE_KEY_FAILURE,
    payload: error,
});

export const toggleAutoRenewRequest = (autoRenew: boolean) => ({
    type: types.TOGGLE_AUTO_RENEW_REQUEST,
    payload: autoRenew,
});

export const toggleAutoRenewSuccess = (autoRenew: boolean) => ({
    type: types.TOGGLE_AUTO_RENEW_SUCCESS,
    payload: autoRenew,
});

export const toggleAutoRenewFailure = (error: string) => ({
    type: types.TOGGLE_AUTO_RENEW_FAILURE,
    payload: error,
});

export const cancelPackageRequest = () => ({
    type: types.CANCEL_PACKAGE_REQUEST,
});

export const cancelPackageSuccess = () => ({
    type: types.CANCEL_PACKAGE_SUCCESS,
});

export const cancelPackageFailure = (error: string) => ({
    type: types.CANCEL_PACKAGE_FAILURE,
    payload: error,
});

export const fetchActivitiesRequest = () => ({
    type: types.FETCH_ACTIVITIES_REQUEST,
});

export const fetchActivitiesSuccess = (payload: any[]) => ({
    type: types.FETCH_ACTIVITIES_SUCCESS,
    payload,
});

export const fetchActivitiesFailure = (error: string) => ({
    type: types.FETCH_ACTIVITIES_FAILURE,
    payload: error,
});

export const updateUserBalance = (amountUSD: number) => ({
    type: types.UPDATE_USER_BALANCE,
    payload: amountUSD,
});

export const fetchExtensionsRequest = () => ({
    type: types.FETCH_EXTENSIONS_REQUEST,
});

export const fetchExtensionsSuccess = (payload: any[]) => ({
    type: types.FETCH_EXTENSIONS_SUCCESS,
    payload,
});

export const fetchExtensionsFailure = (error: string) => ({
    type: types.FETCH_EXTENSIONS_FAILURE,
    payload: error,
});

export const fetchOffersRequest = () => ({
    type: types.FETCH_OFFERS_REQUEST,
});

export const fetchOffersSuccess = (payload: any[]) => ({
    type: types.FETCH_OFFERS_SUCCESS,
    payload,
});

export const fetchOffersFailure = (error: string) => ({
    type: types.FETCH_OFFERS_FAILURE,
    payload: error,
});
