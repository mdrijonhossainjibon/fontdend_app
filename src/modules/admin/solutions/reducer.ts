import * as types from './constants'

export interface Solution {
    id: string
    hash: string
    question: string
    type: string
    service: string
    solution: any
    imageData: string[]
    examples: string[]
    classNames: string[]
    createdAt: string
}

export interface Stats {
    total: number
    today: number
    byService: Record<string, number>
    byType: Record<string, number>
}

export interface Pagination {
    total: number
    totalPages: number
    hasPrevPage: boolean
    hasNextPage: boolean
}

export interface AdminSolutionsState {
    solutions: Solution[]
    stats: Stats | null
    pagination: Pagination | null
    loading: boolean
    error: string | null
    deleting: string | null
    clearing: boolean
}

const initialState: AdminSolutionsState = {
    solutions: [],
    stats: null,
    pagination: null,
    loading: false,
    error: null,
    deleting: null,
    clearing: false,
}

export default function adminSolutionsReducer(
    state = initialState,
    action: any,
): AdminSolutionsState {
    switch (action.type) {
        case types.FETCH_SOLUTIONS_REQUEST:
            return { ...state, loading: true, error: null }
        case types.FETCH_SOLUTIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                solutions: action.payload.solutions,
                stats: action.payload.stats,
                pagination: action.payload.pagination,
            }
        case types.FETCH_SOLUTIONS_FAILURE:
            return { ...state, loading: false, error: action.payload.error }

        case types.DELETE_SOLUTION_REQUEST:
            return { ...state, deleting: action.payload.id }
        case types.DELETE_SOLUTION_SUCCESS:
            return { ...state, deleting: null }
        case types.DELETE_SOLUTION_FAILURE:
            return { ...state, deleting: null, error: action.payload.error }

        case types.CLEAR_ALL_SOLUTIONS_REQUEST:
            return { ...state, clearing: true }
        case types.CLEAR_ALL_SOLUTIONS_SUCCESS:
            return { ...state, clearing: false }
        case types.CLEAR_ALL_SOLUTIONS_FAILURE:
            return { ...state, clearing: false, error: action.payload.error }

        default:
            return state
    }
}
