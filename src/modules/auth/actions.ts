import * as types from './constants';

export const registerRequest = (payload: any) => ({
    type: types.REGISTER_REQUEST,
    payload,
});

export const registerSuccess = (payload: any) => ({
    type: types.REGISTER_SUCCESS,
    payload,
});

export const registerFailure = (error: string) => ({
    type: types.REGISTER_FAILURE,
    payload: error,
});

export const verifyEmailRequest = (payload: any) => ({
    type: types.VERIFY_EMAIL_REQUEST,
    payload,
});

export const verifyEmailSuccess = (payload: any) => ({
    type: types.VERIFY_EMAIL_SUCCESS,
    payload,
});

export const verifyEmailFailure = (error: string) => ({
    type: types.VERIFY_EMAIL_FAILURE,
    payload: error,
});

export const resendVerificationRequest = (payload: any) => ({
    type: types.RESEND_VERIFICATION_REQUEST,
    payload,
});

export const resendVerificationSuccess = (payload: any) => ({
    type: types.RESEND_VERIFICATION_SUCCESS,
    payload,
});

export const resendVerificationFailure = (error: string) => ({
    type: types.RESEND_VERIFICATION_FAILURE,
    payload: error,
});

export const getCurrentUserRequest = () => ({
    type: types.GET_CURRENT_USER_REQUEST,
});

export const getCurrentUserSuccess = (payload: any) => ({
    type: types.GET_CURRENT_USER_SUCCESS,
    payload,
});

export const getCurrentUserFailure = (error: string) => ({
    type: types.GET_CURRENT_USER_FAILURE,
    payload: error,
});

export const resetAuthState = () => ({
    type: types.RESET_AUTH_STATE,
});

// Login
export const loginRequest = (payload: any) => ({
    type: types.LOGIN_REQUEST,
    payload,
});

export const loginSuccess = (payload: any) => ({
    type: types.LOGIN_SUCCESS,
    payload,
});

export const loginFailure = (error: string) => ({
    type: types.LOGIN_FAILURE,
    payload: error,
});

// OTP
export const verifyOtpRequest = (payload: any) => ({
    type: types.VERIFY_OTP_REQUEST,
    payload,
});

export const verifyOtpSuccess = (payload: any) => ({
    type: types.VERIFY_OTP_SUCCESS,
    payload,
});

export const verifyOtpFailure = (error: string) => ({
    type: types.VERIFY_OTP_FAILURE,
    payload: error,
});

export const resendOtpRequest = (payload: any) => ({
    type: types.RESEND_OTP_REQUEST,
    payload,
});

export const resendOtpSuccess = (payload: any) => ({
    type: types.RESEND_OTP_SUCCESS,
    payload,
});

export const resendOtpFailure = (error: string) => ({
    type: types.RESEND_OTP_FAILURE,
    payload: error,
});

export const googleLoginRequest = (payload: { access_token: string }) => ({
    type: types.GOOGLE_LOGIN_REQUEST,
    payload,
});

export const googleLoginSuccess = (payload: any) => ({
    type: types.GOOGLE_LOGIN_SUCCESS,
    payload,
});

export const googleLoginFailure = (error: string) => ({
    type: types.GOOGLE_LOGIN_FAILURE,
    payload: error,
});

export const logoutRequest = () => ({
    type: types.LOGOUT_REQUEST,
});

export const logoutSuccess = () => ({
    type: types.LOGOUT_SUCCESS,
});

export const logoutFailure = (error: string) => ({
    type: types.LOGOUT_FAILURE,
    payload: error,
});