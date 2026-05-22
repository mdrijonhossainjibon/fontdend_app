import {
    FETCH_PRICING_PLANS_REQUEST,
    FETCH_PRICING_PLANS_SUCCESS,
    FETCH_PRICING_PLANS_FAILURE,
    CREATE_PRICING_PLAN_REQUEST,
    CREATE_PRICING_PLAN_SUCCESS,
    CREATE_PRICING_PLAN_FAILURE,
    UPDATE_PRICING_PLAN_REQUEST,
    UPDATE_PRICING_PLAN_SUCCESS,
    UPDATE_PRICING_PLAN_FAILURE,
    DELETE_PRICING_PLAN_REQUEST,
    DELETE_PRICING_PLAN_SUCCESS,
    DELETE_PRICING_PLAN_FAILURE,
} from './constants'

export interface PricingPlanItem {
    _id: string
    code: string
    type: string
    price: number
    priceDisplay: string
    validity: string
    validityDays: number
    recognition: string
    count?: number
    dailyLimit?: number
    rateLimit?: number
    isActive: boolean
    sortOrder?: number
    createdAt?: string
}

export interface PricingPlansState {
    plans: PricingPlanItem[]
    stats: { total: number; count: number; daily: number; minute: number; active: number } | null
    loading: boolean
    creating: boolean
    saving: boolean
    error: string | null
}

const initialState: PricingPlansState = {
    plans: [],
    stats: null,
    loading: false,
    creating: false,
    saving: false,
    error: null,
}

const adminPricingPlansReducer = (state = initialState, action: any): PricingPlansState => {
    switch (action.type) {
        case FETCH_PRICING_PLANS_REQUEST:
            return { ...state, loading: true, error: null }
        case FETCH_PRICING_PLANS_SUCCESS:
            return { ...state, loading: false, plans: action.payload.plans || [], stats: action.payload.stats || null, error: null }
        case FETCH_PRICING_PLANS_FAILURE:
            return { ...state, loading: false, error: action.payload }
        case CREATE_PRICING_PLAN_REQUEST:
            return { ...state, creating: true, error: null }
        case CREATE_PRICING_PLAN_SUCCESS:
            return { ...state, creating: false, plans: [...state.plans, action.payload] }
        case CREATE_PRICING_PLAN_FAILURE:
            return { ...state, creating: false, error: action.payload }
        case UPDATE_PRICING_PLAN_REQUEST:
            return { ...state, saving: true, error: null }
        case UPDATE_PRICING_PLAN_SUCCESS:
            return {
                ...state,
                saving: false,
                plans: state.plans.map(p => (p._id === action.payload._id ? { ...p, ...action.payload } : p)),
            }
        case UPDATE_PRICING_PLAN_FAILURE:
            return { ...state, saving: false, error: action.payload }
        case DELETE_PRICING_PLAN_REQUEST:
            return { ...state, error: null }
        case DELETE_PRICING_PLAN_SUCCESS:
            return { ...state, plans: state.plans.filter(p => p._id !== action.payload) }
        case DELETE_PRICING_PLAN_FAILURE:
            return { ...state, error: action.payload }
        default:
            return state
    }
}

export default adminPricingPlansReducer
