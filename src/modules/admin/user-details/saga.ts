import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint';
import { toast } from "sonner";

function* fetchAdminUserDetailsSaga(action: any): Generator {
    try {
        const userId = action.payload;
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: `/admin/users/${userId}`,
        });

        if (response && response.success) {
            yield put(actions.fetchAdminUserDetailsSuccess({
                user: response.user,
                packages: response.packages || [],
                activities: response.activities || [],
            }));
        } else {
            yield put(actions.fetchAdminUserDetailsFailure(response?.error || 'Failed to fetch user details'));
            toast.error(response?.error || 'Failed to fetch user details');
        }
    } catch (error: any) {
        yield put(actions.fetchAdminUserDetailsFailure(error?.message || 'Failed to fetch user details'));
        toast.error('Failed to fetch user details');
    }
}

export default function* adminUserDetailsSaga() {
    yield takeLatest(types.FETCH_ADMIN_USER_DETAILS_REQUEST, fetchAdminUserDetailsSaga);
}
