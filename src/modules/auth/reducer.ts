import * as types from './constants';

interface AuthState {
    loading: boolean;
    error: string | null;
    registrationSuccess: boolean;
    verificationSuccess: boolean;
    requiresVerification: boolean;
    loginSuccess: boolean;
    requiresOTP: boolean;
    user: any | null;
    token: string | null;
}

const initialState: AuthState = {
    loading: false,
    error: null,
    registrationSuccess: false,
    verificationSuccess: false,
    requiresVerification: false,
    loginSuccess: false,
    requiresOTP: false,
    user: null,
    token: null,
};
const authReducer = (state = initialState, action: any): AuthState => {
    switch (action.type) {
        case types.REGISTER_REQUEST:
        case types.VERIFY_EMAIL_REQUEST:
        case types.RESEND_VERIFICATION_REQUEST:
        case types.GET_CURRENT_USER_REQUEST:
        case types.LOGIN_REQUEST:
        case types.VERIFY_OTP_REQUEST:
        case types.RESEND_OTP_REQUEST:
        case types.GOOGLE_LOGIN_REQUEST:
        case types.LOGOUT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case types.REGISTER_SUCCESS:
            return {
                ...state,
                loading: false,
                registrationSuccess: true,
                requiresVerification: action.payload.requiresVerification ?? true,
            };

        case types.VERIFY_EMAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                verificationSuccess: true,
                user: action.payload.user,
                token: action.payload.token,
            };

        case types.RESEND_VERIFICATION_SUCCESS:
            return {
                ...state,
                loading: false,
            };

        case types.GET_CURRENT_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload.user,
                token: action.payload.token,
            };

        case types.LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                loginSuccess: !action.payload.requiresOTP,
                requiresOTP: !!action.payload.requiresOTP,
                user: action.payload.user || null,
                token: action.payload.token || null,
            };

        case types.VERIFY_OTP_SUCCESS:
            return {
                ...state,
                loading: false,
                requiresOTP: false,
                loginSuccess: true,
                user: action.payload.user,
                token: action.payload.token,
            };

        case types.RESEND_OTP_SUCCESS:
            return {
                ...state,
                loading: false,
            };

        case types.GOOGLE_LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                loginSuccess: true,
                user: action.payload.user,
                token: action.payload.token,
            };

        case types.LOGOUT_SUCCESS:
            return {
                ...state,
                loading: false,
                loginSuccess: false,
                user: null,
                token: null,
            };

        case types.REGISTER_FAILURE:
        case types.VERIFY_EMAIL_FAILURE:
        case types.RESEND_VERIFICATION_FAILURE:
        case types.GET_CURRENT_USER_FAILURE:
        case types.LOGIN_FAILURE:
        case types.VERIFY_OTP_FAILURE:
        case types.RESEND_OTP_FAILURE:
        case types.GOOGLE_LOGIN_FAILURE:
        case types.LOGOUT_FAILURE:
            return {
                ...state,
                loading: false,
                user: action.type === types.GET_CURRENT_USER_FAILURE ? null : state.user,
                token: action.type === types.GET_CURRENT_USER_FAILURE ? null : state.token,
                error: action.payload,
            };

        case types.RESET_AUTH_STATE:
            return initialState;

        default:
            return state;
    }
};

export default authReducer;