import * as types from './constants';

export const fetchRolesRequest = () => ({
  type: types.FETCH_ROLES_REQUEST,
});

export const fetchRolesSuccess = (payload: any) => ({
  type: types.FETCH_ROLES_SUCCESS,
  payload,
});

export const fetchRolesFailure = (error: string) => ({
  type: types.FETCH_ROLES_FAILURE,
  payload: error,
});

export const createRoleRequest = (data: any) => ({
  type: types.CREATE_ROLE_REQUEST,
  payload: { data },
});

export const createRoleSuccess = (role: any) => ({
  type: types.CREATE_ROLE_SUCCESS,
  payload: role,
});

export const createRoleFailure = (error: string) => ({
  type: types.CREATE_ROLE_FAILURE,
  payload: error,
});

export const updateRoleRequest = (data: any) => ({
  type: types.UPDATE_ROLE_REQUEST,
  payload: { data },
});

export const updateRoleSuccess = () => ({
  type: types.UPDATE_ROLE_SUCCESS,
});

export const updateRoleFailure = (error: string) => ({
  type: types.UPDATE_ROLE_FAILURE,
  payload: error,
});

export const deleteRoleRequest = (roleId: string) => ({
  type: types.DELETE_ROLE_REQUEST,
  payload: { roleId },
});

export const deleteRoleSuccess = () => ({
  type: types.DELETE_ROLE_SUCCESS,
});

export const deleteRoleFailure = (error: string) => ({
  type: types.DELETE_ROLE_FAILURE,
  payload: error,
});

export const fetchPermissionUsersRequest = (params?: any) => ({
  type: types.FETCH_PERMISSION_USERS_REQUEST,
  payload: params || {},
});

export const fetchPermissionUsersSuccess = (payload: any) => ({
  type: types.FETCH_PERMISSION_USERS_SUCCESS,
  payload,
});

export const fetchPermissionUsersFailure = (error: string) => ({
  type: types.FETCH_PERMISSION_USERS_FAILURE,
  payload: error,
});

export const updateUserRoleRequest = (userId: string, role: string) => ({
  type: types.UPDATE_USER_ROLE_REQUEST,
  payload: { userId, role },
});

export const updateUserRoleSuccess = () => ({
  type: types.UPDATE_USER_ROLE_SUCCESS,
});

export const updateUserRoleFailure = (error: string) => ({
  type: types.UPDATE_USER_ROLE_FAILURE,
  payload: error,
});

export const fetchPermissionsListRequest = () => ({
  type: types.FETCH_PERMISSIONS_LIST_REQUEST,
});

export const fetchPermissionsListSuccess = (permissions: any[]) => ({
  type: types.FETCH_PERMISSIONS_LIST_SUCCESS,
  payload: permissions,
});

export const fetchPermissionsListFailure = (error: string) => ({
  type: types.FETCH_PERMISSIONS_LIST_FAILURE,
  payload: error,
});
