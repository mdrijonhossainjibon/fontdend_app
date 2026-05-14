import * as types from './constants'

export interface FetchSolutionsParams {
    search?: string
    service?: string
    type?: string
    page: number
    limit: number
}

export const fetchSolutionsRequest = (params: FetchSolutionsParams) => ({
    type: types.FETCH_SOLUTIONS_REQUEST,
    payload: params,
})
export const fetchSolutionsSuccess = (data: { solutions: any[]; stats: any; pagination: any }) => ({
    type: types.FETCH_SOLUTIONS_SUCCESS,
    payload: data,
})
export const fetchSolutionsFailure = (error: string) => ({
    type: types.FETCH_SOLUTIONS_FAILURE,
    payload: { error },
})

export const deleteSolutionRequest = (id: string, filters?: Omit<FetchSolutionsParams, 'page'> & { page: number }) => ({
    type: types.DELETE_SOLUTION_REQUEST,
    payload: { id, filters },
})
export const deleteSolutionSuccess = () => ({
    type: types.DELETE_SOLUTION_SUCCESS,
})
export const deleteSolutionFailure = (error: string) => ({
    type: types.DELETE_SOLUTION_FAILURE,
    payload: { error },
})

export const clearAllSolutionsRequest = (filters?: FetchSolutionsParams) => ({
    type: types.CLEAR_ALL_SOLUTIONS_REQUEST,
    payload: { filters },
})
export const clearAllSolutionsSuccess = () => ({
    type: types.CLEAR_ALL_SOLUTIONS_SUCCESS,
})
export const clearAllSolutionsFailure = (error: string) => ({
    type: types.CLEAR_ALL_SOLUTIONS_FAILURE,
    payload: { error },
})
