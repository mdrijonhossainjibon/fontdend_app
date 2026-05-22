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
