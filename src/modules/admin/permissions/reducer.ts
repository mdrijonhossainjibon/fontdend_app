import * as types from './constants';

export interface PermissionRole {
  id: string;
  name: string;
  slug: string;
  description: string;
  permissions: string[];
  status: 'active' | 'inactive';
}

export interface PermissionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface PermissionItem {
  key: string;
  label: string;
  category: string;
}

export interface AdminPermissionsState {
  roles: PermissionRole[];
  rolesLoading: boolean;
  rolesError: string | null;
  rolesSaving: boolean;
  rolesSaveError: string | null;
  rolesDeleting: boolean;

  users: PermissionUser[];
  usersLoading: boolean;
  usersError: string | null;
  usersPagination: any;

  permissions: PermissionItem[];
  permissionsLoading: boolean;
  permissionsError: string | null;
}

const initialState: AdminPermissionsState = {
  roles: [],
  rolesLoading: false,
  rolesError: null,
  rolesSaving: false,
  rolesSaveError: null,
  rolesDeleting: false,

  users: [],
  usersLoading: false,
  usersError: null,
  usersPagination: null,

  permissions: [],
  permissionsLoading: false,
  permissionsError: null,
};

export default function adminPermissionsReducer(
  state = initialState,
  action: any,
): AdminPermissionsState {
  switch (action.type) {
    // ── Roles ──────────────────────────────────────────────────────────────
    case types.FETCH_ROLES_REQUEST:
      return { ...state, rolesLoading: true, rolesError: null };

    case types.FETCH_ROLES_SUCCESS:
      return {
        ...state,
        rolesLoading: false,
        roles: action.payload.roles || action.payload || [],
      };

    case types.FETCH_ROLES_FAILURE:
      return { ...state, rolesLoading: false, rolesError: action.payload };

    case types.CREATE_ROLE_REQUEST:
    case types.UPDATE_ROLE_REQUEST:
      return { ...state, rolesSaving: true, rolesSaveError: null };

    case types.CREATE_ROLE_SUCCESS:
    case types.UPDATE_ROLE_SUCCESS:
      return { ...state, rolesSaving: false };

    case types.CREATE_ROLE_FAILURE:
    case types.UPDATE_ROLE_FAILURE:
      return { ...state, rolesSaving: false, rolesSaveError: action.payload };

    case types.DELETE_ROLE_REQUEST:
      return { ...state, rolesDeleting: true };

    case types.DELETE_ROLE_SUCCESS:
    case types.DELETE_ROLE_FAILURE:
      return { ...state, rolesDeleting: false };

    // ── Users ──────────────────────────────────────────────────────────────
    case types.FETCH_PERMISSION_USERS_REQUEST:
      return { ...state, usersLoading: true, usersError: null };

    case types.FETCH_PERMISSION_USERS_SUCCESS:
      return {
        ...state,
        usersLoading: false,
        users: action.payload.users,
        usersPagination: action.payload.pagination,
      };

    case types.FETCH_PERMISSION_USERS_FAILURE:
      return { ...state, usersLoading: false, usersError: action.payload };

    // ── Permissions List ──────────────────────────────────────────────────
    case types.FETCH_PERMISSIONS_LIST_REQUEST:
      return { ...state, permissionsLoading: true, permissionsError: null };

    case types.FETCH_PERMISSIONS_LIST_SUCCESS:
      return {
        ...state,
        permissionsLoading: false,
        permissions: action.payload,
      };

    case types.FETCH_PERMISSIONS_LIST_FAILURE:
      return { ...state, permissionsLoading: false, permissionsError: action.payload };

    default:
      return state;
  }
}
