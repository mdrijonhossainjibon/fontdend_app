import {
    FETCH_USER_PACKAGES_REQUEST,
    FETCH_USER_PACKAGES_SUCCESS,
    FETCH_USER_PACKAGES_FAILURE,
    UPDATE_USER_PACKAGE_REQUEST,
    UPDATE_USER_PACKAGE_SUCCESS,
    UPDATE_USER_PACKAGE_FAILURE,
    DELETE_USER_PACKAGE_REQUEST,
    DELETE_USER_PACKAGE_SUCCESS,
    DELETE_USER_PACKAGE_FAILURE,
    ASSIGN_PACKAGE_REQUEST,
    ASSIGN_PACKAGE_SUCCESS,
    ASSIGN_PACKAGE_FAILURE,
    RESET_ASSIGN_SUCCESS,
} from './constants'

export const fetchUserPackagesRequest = (userId: string) => ({ type: FETCH_USER_PACKAGES_REQUEST, payload: userId })
export const fetchUserPackagesSuccess = (packages: any[]) => ({ type: FETCH_USER_PACKAGES_SUCCESS, payload: packages })
export const fetchUserPackagesFailure = (error: string) => ({ type: FETCH_USER_PACKAGES_FAILURE, payload: error })

export const updateUserPackageRequest = (data: { packageId: string; credits: number }) => ({ type: UPDATE_USER_PACKAGE_REQUEST, payload: data })
export const updateUserPackageSuccess = (data: any) => ({ type: UPDATE_USER_PACKAGE_SUCCESS, payload: data })
export const updateUserPackageFailure = (error: string) => ({ type: UPDATE_USER_PACKAGE_FAILURE, payload: error })

export const deleteUserPackageRequest = (packageId: string) => ({ type: DELETE_USER_PACKAGE_REQUEST, payload: packageId })
export const deleteUserPackageSuccess = (packageId: string) => ({ type: DELETE_USER_PACKAGE_SUCCESS, payload: packageId })
export const deleteUserPackageFailure = (error: string) => ({ type: DELETE_USER_PACKAGE_FAILURE, payload: error })

export const assignPackageRequest = (data: any) => ({ type: ASSIGN_PACKAGE_REQUEST, payload: data })
export const assignPackageSuccess = (pkg: any) => ({ type: ASSIGN_PACKAGE_SUCCESS, payload: pkg })
export const assignPackageFailure = (error: string) => ({ type: ASSIGN_PACKAGE_FAILURE, payload: error })
export const resetAssignSuccess = () => ({ type: RESET_ASSIGN_SUCCESS })
