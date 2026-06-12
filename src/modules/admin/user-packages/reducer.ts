import {
    FETCH_USER_PACKAGES_REQUEST,
    FETCH_USER_PACKAGES_SUCCESS,
    FETCH_USER_PACKAGES_FAILURE,
    FETCH_ALL_USER_PACKAGES_REQUEST,
    FETCH_ALL_USER_PACKAGES_SUCCESS,
    FETCH_ALL_USER_PACKAGES_FAILURE,
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

export interface UserPackageItem {
    _id: string
    userId: string
    packageCode: string
    type: string
    name: string
    price: number
    credits: number
    creditsUsed: number
    status: string
    startDate: string
    endDate: string
    createdAt: string
}

interface UserPackageState {
    packages: UserPackageItem[]
    loading: boolean
    error: string | null
    allPackages: UserPackageItem[]
    allLoading: boolean
    allError: string | null
    updating: boolean
    deleting: boolean
    assigning: boolean
    assignSuccess: boolean
}

const initialState: UserPackageState = {
    packages: [],
    loading: false,
    error: null,
    allPackages: [],
    allLoading: false,
    allError: null,
    updating: false,
    deleting: false,
    assigning: false,
    assignSuccess: false,
}

export default function userPackageReducer(state = initialState, action: any): UserPackageState {
    switch (action.type) {
        case FETCH_USER_PACKAGES_REQUEST:
            return { ...state, loading: true, error: null }
        case FETCH_USER_PACKAGES_SUCCESS:
            return { ...state, packages: action.payload, loading: false }
        case FETCH_USER_PACKAGES_FAILURE:
            return { ...state, error: action.payload, loading: false }

        case FETCH_ALL_USER_PACKAGES_REQUEST:
            return { ...state, allLoading: true, allError: null }
        case FETCH_ALL_USER_PACKAGES_SUCCESS:
            return { ...state, allPackages: action.payload, allLoading: false }
        case FETCH_ALL_USER_PACKAGES_FAILURE:
            return { ...state, allError: action.payload, allLoading: false }

        case UPDATE_USER_PACKAGE_REQUEST:
            return { ...state, updating: true }
        case UPDATE_USER_PACKAGE_SUCCESS:
            return {
                ...state,
                updating: false,
                packages: state.packages.map((p: any) =>
                    p._id === action.payload._id ? action.payload : p
                ),
                allPackages: state.allPackages.map((p: any) =>
                    p._id === action.payload._id ? {
                        ...p,
                        ...action.payload,
                        userId: action.payload.userId && typeof action.payload.userId === 'object'
                            ? { ...(typeof p.userId === 'object' ? p.userId : {}), ...action.payload.userId }
                            : p.userId
                    } : p
                ),
            }
        case UPDATE_USER_PACKAGE_FAILURE:
            return { ...state, updating: false }

        case DELETE_USER_PACKAGE_REQUEST:
            return { ...state, deleting: true }
        case DELETE_USER_PACKAGE_SUCCESS:
            return {
                ...state,
                deleting: false,
                packages: state.packages.filter((p: any) => p._id !== action.payload),
            }
        case DELETE_USER_PACKAGE_FAILURE:
            return { ...state, deleting: false }

        case ASSIGN_PACKAGE_REQUEST:
            return { ...state, assigning: true, assignSuccess: false }
        case ASSIGN_PACKAGE_SUCCESS:
            return {
                ...state,
                assigning: false,
                assignSuccess: true,
                packages: [...state.packages, action.payload],
            }
        case ASSIGN_PACKAGE_FAILURE:
            return { ...state, assigning: false }
        case RESET_ASSIGN_SUCCESS:
            return { ...state, assignSuccess: false }

        default:
            return state
    }
}
