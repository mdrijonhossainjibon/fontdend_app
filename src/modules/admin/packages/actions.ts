import * as types from './constants'

export const fetchPackagesRequest = (filterType?: string) => ({
  type: types.FETCH_PACKAGES_REQUEST,
  payload: { filterType },
})
export const fetchPackagesSuccess = (plans: any[], stats: any) => ({
  type: types.FETCH_PACKAGES_SUCCESS,
  payload: { plans, stats },
})
export const fetchPackagesFailure = (error: string) => ({
  type: types.FETCH_PACKAGES_FAILURE,
  payload: { error },
})

export const createPackageRequest = (data: any) => ({
  type: types.CREATE_PACKAGE_REQUEST,
  payload: { data },
})
export const createPackageSuccess = (plan: any) => ({
  type: types.CREATE_PACKAGE_SUCCESS,
  payload: { plan },
})
export const createPackageFailure = (error: string) => ({
  type: types.CREATE_PACKAGE_FAILURE,
  payload: { error },
})

export const updatePackageRequest = (data: any) => ({
  type: types.UPDATE_PACKAGE_REQUEST,
  payload: { data },
})
export const updatePackageSuccess = () => ({
  type: types.UPDATE_PACKAGE_SUCCESS,
})
export const updatePackageFailure = (error: string) => ({
  type: types.UPDATE_PACKAGE_FAILURE,
  payload: { error },
})

export const deletePackageRequest = (planId: string, code: string) => ({
  type: types.DELETE_PACKAGE_REQUEST,
  payload: { planId, code },
})
export const deletePackageSuccess = () => ({
  type: types.DELETE_PACKAGE_SUCCESS,
})
export const deletePackageFailure = (error: string) => ({
  type: types.DELETE_PACKAGE_FAILURE,
  payload: { error },
})
