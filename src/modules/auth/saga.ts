import { call, put, take, takeLatest, fork } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import { toast } from "sonner";
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint';

/**
 * Main registration flow: register → verify email → get current user.
 * Each step only runs if the previous one succeeds.
 */
function* registerFlow(): Generator<any, any, any> {
    while (true) {
        const action = yield take(types.REGISTER_REQUEST);

        // Step 1: Register
        const regResult: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/auth/register',
            body: action.payload,
        });

        if (regResult.status !== 200 && regResult.status !== 201) {
            yield put(actions.registerFailure(regResult.response?.error || 'Registration failed.'));
            toast.error('Registration Failed', {
                description: regResult.response?.error || 'Something went wrong during registration.',
            });
            continue;
        }

        yield put(actions.registerSuccess(regResult.response));
        toast.success('Account created!', {
            description: 'Please verify your email to continue.',
        });

        // Step 2: Wait for verify email action, then call API
        const verifyAction = yield take(types.VERIFY_EMAIL_REQUEST);

        const verifyResult: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/auth/verify-email',
            body: verifyAction.payload,
        });

        if (verifyResult.status !== 200) {
            yield put(actions.verifyEmailFailure(verifyResult.response?.error || 'Invalid OTP.'));
            toast.error('Invalid OTP', {
                description: verifyResult.response?.error || 'The code you entered is incorrect.',
            });
            continue;
        }

        yield put(actions.verifyEmailSuccess(verifyResult.response));
        toast.success('Email Verified', {
            description: 'Your email has been verified successfully!',
        });
        localStorage.setItem('authToken', verifyResult.response.token);
        localStorage.setItem('user', JSON.stringify(verifyResult.response.user));
        localStorage.setItem('tokenExpiry', String(Date.now() + 7 * 24 * 60 * 60 * 1000));

        // Step 3: Fetch current user
        const userResult: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: '/auth/me',
        });

        if (userResult.status === 200) {
            const user = userResult.response?.user ?? userResult.response;
            const token = localStorage.getItem('authToken');
            yield put(actions.getCurrentUserSuccess({ user, token }));
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            yield put(actions.getCurrentUserFailure(userResult.response?.error || 'Unable to load user.'));
        }
    }
}

/**
 * Independent resend handler — can be triggered at any time.
 */
function* resendVerificationSaga(action: any): Generator<any, any, any> {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/auth/resend-verification',
            body: action.payload,
        });

        if (status === 200) {
            yield put(actions.resendVerificationSuccess(response));
            toast.success('Code Resent', {
                description: 'A new verification code has been sent to your email.',
            });
        } else {
            yield put(actions.resendVerificationFailure(response?.error || 'Failed to resend verification code.'));
            toast.error('Resend Failed', {
                description: response?.error || 'Failed to resend verification code.',
            });
        }
    } catch (error: any) {
        yield put(actions.resendVerificationFailure(error.message || 'An error occurred. Please try again.'));
        toast.error('Error', {
            description: 'An error occurred. Please try again.',
        });
    }
}

/**
 * Standalone handler for fetching the current user (e.g., on app boot).
 */
function* getCurrentUserSaga(): Generator<any, any, any> {
    try {
        const userResult: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: '/auth/me',
        });

        if (userResult.status === 200) {
            const user = userResult.response?.user ?? userResult.response;
            const token = localStorage.getItem('authToken');
            yield put(actions.getCurrentUserSuccess({ user, token }));
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            yield put(actions.getCurrentUserFailure(userResult.response?.error || 'Unable to load user.'));
        }
    } catch (error: any) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        yield put(actions.getCurrentUserFailure(error.message || 'An error occurred.'));
    }
}

/**
 * Login flow: login with credentials, handle OTP requirement.
 */
function* loginFlow(): Generator<any, any, any> {
    while (true) {
        const action = yield take(types.LOGIN_REQUEST);
        const result: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/auth/login',
            body: action.payload,
        });
        if (result.status === 200 && !result.response?.error) {
            yield put(actions.loginSuccess(result.response));
            if (!result.response?.requiresOTP) {
                localStorage.setItem('authToken', result.response.token);
                localStorage.setItem('user', JSON.stringify(result.response.user));
                const ms = action.payload.rememberMe ? 7 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
                localStorage.setItem('tokenExpiry', String(Date.now() + ms));
            }
        } else {
            const err = result.response?.error || 'Login failed. Please try again.';
            yield put(actions.loginFailure(err));
            toast.error('Login Failed', { description: err });
        }
    }
}

/**
 * Verify OTP during login with 2FA.
 */
function* verifyOtpSaga(action: any): Generator<any, any, any> {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/auth/verify-otp',
            body: action.payload,
        });
        if (status === 200 && !response?.error) {
            yield put(actions.verifyOtpSuccess(response));
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('tokenExpiry', String(Date.now() + 7 * 24 * 60 * 60 * 1000));
            toast.success('Verified', { description: 'Login successful!' });
        } else {
            const err = response?.error || 'Invalid verification code.';
            yield put(actions.verifyOtpFailure(err));
            toast.error('Verification Failed', { description: err });
        }
    } catch (error: any) {
        yield put(actions.verifyOtpFailure(error.message || 'An error occurred.'));
        toast.error('Error', { description: error.message || 'An error occurred.' });
    }
}

/**
 * Resend OTP for login.
 */
function* resendOtpSaga(action: any): Generator<any, any, any> {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/auth/resend-otp',
            body: action.payload,
        });
        if (status === 200) {
            yield put(actions.resendOtpSuccess(response));
            toast.success('Code Resent', { description: 'A new code has been sent to your email.' });
        } else {
            const err = response?.error || 'Failed to resend code.';
            yield put(actions.resendOtpFailure(err));
            toast.error('Resend Failed', { description: err });
        }
    } catch (error: any) {
        yield put(actions.resendOtpFailure(error.message || 'An error occurred.'));
        toast.error('Error', { description: error.message || 'An error occurred.' });
    }
}

/**
 * Google Login Saga.
 */
function* googleLoginSaga(action: any): Generator<any, any, any> {
    try {
        const result: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/auth/google',
            body: action.payload,
        });

        if (result.status === 200 && result.response.token) {
            yield put(actions.googleLoginSuccess(result.response));
            localStorage.setItem('authToken', result.response.token);
            localStorage.setItem('user', JSON.stringify(result.response.user));
            localStorage.setItem('tokenExpiry', String(Date.now() + 7 * 24 * 60 * 60 * 1000));
            toast.success('Welcome Back!', {
                description: 'Successfully signed in with Google.',
            });
        } else {
            const err = result.response?.error || 'Google Login failed.';
            yield put(actions.googleLoginFailure(err));
            toast.error('Google Login Failed', {
                description: err,
            });
        }
    } catch (error: any) {
        yield put(actions.googleLoginFailure(error.message || 'An error occurred.'));
        toast.error('Error', {
            description: error.message || 'An error occurred during Google login.',
        });
    }
}

/**
 * Logout Saga.
 */
function* logoutSaga(): Generator<any, any, any> {
    try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiry');
        yield put(actions.logoutSuccess());
        toast.success('Signed Out', {
            description: 'You have been successfully logged out.',
        });
        window.location.href = '/';
    } catch (error: any) {
        yield put(actions.logoutFailure(error.message || 'Logout failed.'));
    }
}

export default function* authSaga() {
    yield fork(registerFlow);
    yield fork(loginFlow);
    yield takeLatest(types.GET_CURRENT_USER_REQUEST, getCurrentUserSaga);
    yield takeLatest(types.RESEND_VERIFICATION_REQUEST, resendVerificationSaga);
    yield takeLatest(types.VERIFY_OTP_REQUEST, verifyOtpSaga);
    yield takeLatest(types.RESEND_OTP_REQUEST, resendOtpSaga);
    yield takeLatest(types.GOOGLE_LOGIN_REQUEST, googleLoginSaga);
    yield takeLatest(types.LOGOUT_REQUEST, logoutSaga);
}
