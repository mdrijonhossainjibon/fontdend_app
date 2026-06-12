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

export interface CreditPackageItem {
    _id: string
    name: string
    code: string
    credits: number
    price: number
    discountPrice?: number
    type: 'one_time' | 'subscription'
    billingCycle?: 'monthly' | 'yearly'
    features: string[]
    isActive: boolean
    sortOrder: number
    createdAt: string
    updatedAt: string
}

export interface CreditPackagesState {
    packages: CreditPackageItem[]
    stats: { total: number; active: number; oneTime: number; subscription: number } | null
    loading: boolean
    saving: boolean
    deleting: boolean
    error: string | null
    saveError: string | null
}

const initialState: CreditPackagesState = {
    packages: [],
    stats: null,
    loading: false,
    saving: false,
    deleting: false,
    error: null,
    saveError: null,
}

const adminCreditPackagesReducer = (state = initialState, action: any): CreditPackagesState => {
    switch (action.type) {
        case FETCH_CREDIT_PACKAGES_REQUEST:
            return { ...state, loading: true, error: null }
        case FETCH_CREDIT_PACKAGES_SUCCESS:
            return {
                ...state,
                loading: false,
                packages: action.payload.packages || [],
                stats: action.payload.stats || null,
                error: null,
            }
        case FETCH_CREDIT_PACKAGES_FAILURE:
            return { ...state, loading: false, error: action.payload }
        case CREATE_CREDIT_PACKAGE_REQUEST:
            return { ...state, saving: true, saveError: null }
        case CREATE_CREDIT_PACKAGE_SUCCESS:
            return {
                ...state,
                saving: false,
                packages: [...state.packages, action.payload],
                saveError: null,
            }
        case CREATE_CREDIT_PACKAGE_FAILURE:
            return { ...state, saving: false, saveError: action.payload }
        case UPDATE_CREDIT_PACKAGE_REQUEST:
            return { ...state, saving: true, saveError: null }
        case UPDATE_CREDIT_PACKAGE_SUCCESS:
            return { ...state, saving: false, saveError: null }
        case UPDATE_CREDIT_PACKAGE_FAILURE:
            return { ...state, saving: false, saveError: action.payload }
        case DELETE_CREDIT_PACKAGE_REQUEST:
            return { ...state, deleting: true, error: null }
        case DELETE_CREDIT_PACKAGE_SUCCESS:
            return {
                ...state,
                deleting: false,
                packages: state.packages.filter(p => p._id !== action.payload),
            }
        case DELETE_CREDIT_PACKAGE_FAILURE:
            return { ...state, deleting: false, error: action.payload }
        default:
            return state
    }
}

export default adminCreditPackagesReducer
