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

export interface UserPackagesState {
    packages: UserPackageItem[]
    loading: boolean
    updating: boolean
    assigning: boolean
    assignSuccess: boolean
    error: string | null
}

const initialState: UserPackagesState = {
    packages: [],
    loading: false,
    updating: false,
    assigning: false,
    assignSuccess: false,
    error: null,
}

const adminUserPackagesReducer = (state = initialState, action: any): UserPackagesState => {
    switch (action.type) {
        case FETCH_USER_PACKAGES_REQUEST:
            return { ...state, loading: true, error: null }
        case FETCH_USER_PACKAGES_SUCCESS:
            return { ...state, loading: false, packages: action.payload, error: null }
        case FETCH_USER_PACKAGES_FAILURE:
            return { ...state, loading: false, error: action.payload }
        case UPDATE_USER_PACKAGE_REQUEST:
            return { ...state, updating: true, error: null }
        case UPDATE_USER_PACKAGE_SUCCESS:
            return {
                ...state,
                updating: false,
                packages: state.packages.map(p => (p._id === action.payload.package._id ? { ...p, ...action.payload.package } : p)),
            }
        case UPDATE_USER_PACKAGE_FAILURE:
            return { ...state, updating: false, error: action.payload }
        case DELETE_USER_PACKAGE_REQUEST:
            return { ...state, error: null }
        case DELETE_USER_PACKAGE_SUCCESS:
            return { ...state, packages: state.packages.filter(p => p._id !== action.payload) }
        case DELETE_USER_PACKAGE_FAILURE:
            return { ...state, error: action.payload }
        case ASSIGN_PACKAGE_REQUEST:
            return { ...state, assigning: true, error: null }
        case ASSIGN_PACKAGE_SUCCESS:
            return { ...state, assigning: false, assignSuccess: true, packages: [...state.packages, action.payload] }
        case ASSIGN_PACKAGE_FAILURE:
            return { ...state, assigning: false, assignSuccess: false, error: action.payload }
        case RESET_ASSIGN_SUCCESS:
            return { ...state, assignSuccess: false }
        default:
            return state
    }
}

export default adminUserPackagesReducer
