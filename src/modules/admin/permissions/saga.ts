import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint';

function* fetchRolesSaga() {
  try {
    const { response }: APIResponse = yield call(API_CALL, {
      method: 'GET',
      url: '/admin/permissions/roles',
    });
    const raw = (response as any)?.data || response || {};
    yield put(actions.fetchRolesSuccess(raw.roles || raw));
  } catch (error: any) {
    yield put(actions.fetchRolesFailure(error?.response?.data?.error || error.message));
  }
}

function* createRoleSaga(action: any) {
  try {
    const { response }: APIResponse = yield call(API_CALL, {
      method: 'POST',
      url: '/admin/permissions/roles',
      body: action.payload.data,
    });
    const raw = (response as any)?.data || response || {};
    yield put(actions.createRoleSuccess(raw.role || raw));
    yield put(actions.fetchRolesRequest());
  } catch (error: any) {
    yield put(actions.createRoleFailure(error?.response?.data?.error || error.message));
  }
}

function* updateRoleSaga(action: any) {
  try {
    yield call(API_CALL, {
      method: 'PATCH',
      url: '/admin/permissions/roles',
      body: action.payload.data,
    });
    yield put(actions.updateRoleSuccess());
    yield put(actions.fetchRolesRequest());
  } catch (error: any) {
    yield put(actions.updateRoleFailure(error?.response?.data?.error || error.message));
  }
}

function* deleteRoleSaga(action: any) {
  try {
    yield call(API_CALL, {
      method: 'DELETE',
      url: `/admin/permissions/roles?roleId=${action.payload.roleId}`,
    });
    yield put(actions.deleteRoleSuccess());
    yield put(actions.fetchRolesRequest());
  } catch (error: any) {
    yield put(actions.deleteRoleFailure(error?.response?.data?.error || error.message));
  }
}

function* fetchPermissionUsersSaga(action: any) {
  try {
    const { page, limit, search } = action.payload || {};
    const params: any = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (search) params.search = search;

    const { response }: APIResponse = yield call(API_CALL, {
      method: 'GET',
      url: '/admin/permissions/users',
      params,
    });
    const raw = (response as any)?.data || response || {};
    yield put(actions.fetchPermissionUsersSuccess({
      users: raw.users || [],
      pagination: raw.pagination,
      roles: raw.roles || [],
    }));
  } catch (error: any) {
    yield put(actions.fetchPermissionUsersFailure(error?.response?.data?.error || error.message));
  }
}

function* updateUserRoleSaga(action: any) {
  try {
    yield call(API_CALL, {
      method: 'PATCH',
      url: '/admin/permissions/users',
      body: { userId: action.payload.userId, role: action.payload.role },
    });
    yield put(actions.updateUserRoleSuccess());
    yield put(actions.fetchPermissionUsersRequest());
  } catch (error: any) {
    yield put(actions.updateUserRoleFailure(error?.response?.data?.error || error.message));
  }
}

function* fetchPermissionsListSaga() {
  try {
    const { response }: APIResponse = yield call(API_CALL, {
      method: 'GET',
      url: '/admin/permissions',
    });
    const raw = (response as any)?.data || response || {};
    yield put(actions.fetchPermissionsListSuccess(raw.permissions || raw || []));
  } catch (error: any) {
    yield put(actions.fetchPermissionsListFailure(error?.response?.data?.error || error.message));
  }
}

export default function* adminPermissionsSaga() {
  yield takeLatest(types.FETCH_ROLES_REQUEST, fetchRolesSaga);
  yield takeLatest(types.CREATE_ROLE_REQUEST, createRoleSaga);
  yield takeLatest(types.UPDATE_ROLE_REQUEST, updateRoleSaga);
  yield takeLatest(types.DELETE_ROLE_REQUEST, deleteRoleSaga);
  yield takeLatest(types.FETCH_PERMISSION_USERS_REQUEST, fetchPermissionUsersSaga);
  yield takeLatest(types.UPDATE_USER_ROLE_REQUEST, updateUserRoleSaga);
  yield takeLatest(types.FETCH_PERMISSIONS_LIST_REQUEST, fetchPermissionsListSaga);
}
