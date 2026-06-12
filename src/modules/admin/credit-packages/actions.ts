import {
    FETCH_CREDIT_PACKAGES_REQUEST,
    FETCH_CREDIT_PACKAGES_SUCCESS,
    FETCH_CREDIT_PACKAGES_FAILURE,
    CREATE_CREDIT_PACKAGE_REQUEST,
    CREATE_CREDIT_PACKAGE_SUCCESS,
    CREATE_CREDIT_PACKAGE_FAILURE,
    UPDATE_CREDIT_PACKAGE_REQUEST,
    UPDATE_CREDIT_PACKAGE_SUCCESS,
    UPDATE_CREDIT_PACKAGE_FAILURE,
    DELETE_CREDIT_PACKAGE_REQUEST,
    DELETE_CREDIT_PACKAGE_SUCCESS,
    DELETE_CREDIT_PACKAGE_FAILURE,
} from './constants'

export const fetchCreditPackagesRequest = (filter?: string) => ({ type: FETCH_CREDIT_PACKAGES_REQUEST, payload: filter })
export const fetchCreditPackagesSuccess = (data: any) => ({ type: FETCH_CREDIT_PACKAGES_SUCCESS, payload: data })
export const fetchCreditPackagesFailure = (error: string) => ({ type: FETCH_CREDIT_PACKAGES_FAILURE, payload: error })

export const createCreditPackageRequest = (data: any) => ({ type: CREATE_CREDIT_PACKAGE_REQUEST, payload: data })
export const createCreditPackageSuccess = (pkg: any) => ({ type: CREATE_CREDIT_PACKAGE_SUCCESS, payload: pkg })
export const createCreditPackageFailure = (error: string) => ({ type: CREATE_CREDIT_PACKAGE_FAILURE, payload: error })

export const updateCreditPackageRequest = (data: any) => ({ type: UPDATE_CREDIT_PACKAGE_REQUEST, payload: data })
export const updateCreditPackageSuccess = (data: any) => ({ type: UPDATE_CREDIT_PACKAGE_SUCCESS, payload: data })
export const updateCreditPackageFailure = (error: string) => ({ type: UPDATE_CREDIT_PACKAGE_FAILURE, payload: error })

export const deleteCreditPackageRequest = (packageId: string) => ({ type: DELETE_CREDIT_PACKAGE_REQUEST, payload: packageId })
export const deleteCreditPackageSuccess = (packageId: string) => ({ type: DELETE_CREDIT_PACKAGE_SUCCESS, payload: packageId })
export const deleteCreditPackageFailure = (error: string) => ({ type: DELETE_CREDIT_PACKAGE_FAILURE, payload: error })
