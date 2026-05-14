import {
    FETCH_REDEEM_CODES_REQUEST,
    FETCH_REDEEM_CODES_SUCCESS,
    FETCH_REDEEM_CODES_FAILURE,
    CREATE_REDEEM_CODE_REQUEST,
    CREATE_REDEEM_CODE_SUCCESS,
    CREATE_REDEEM_CODE_FAILURE,
    UPDATE_REDEEM_CODE_REQUEST,
    UPDATE_REDEEM_CODE_SUCCESS,
    UPDATE_REDEEM_CODE_FAILURE,
    DELETE_REDEEM_CODE_REQUEST,
    DELETE_REDEEM_CODE_SUCCESS,
    DELETE_REDEEM_CODE_FAILURE,
} from './constants'

export interface RedeemCodeItem {
    id: string
    code: string
    credits: number
    maxUses: number
    usedCount: number
    usedByCount: number
    expiresAt: string | null
    isActive: boolean
    createdAt: string
    createdBy: { _id: string; name: string; email: string } | null
}

export interface RedeemCodesState {
    codes: RedeemCodeItem[]
    loading: boolean
    creating: boolean
    saving: boolean
    error: string | null
}

const initialState: RedeemCodesState = {
    codes: [],
    loading: false,
    creating: false,
    saving: false,
    error: null,
}

const adminRedeemCodesReducer = (state = initialState, action: any): RedeemCodesState => {
    switch (action.type) {
        case FETCH_REDEEM_CODES_REQUEST:
            return { ...state, loading: true, error: null }
        case FETCH_REDEEM_CODES_SUCCESS:
            return { ...state, loading: false, codes: action.payload, error: null }
        case FETCH_REDEEM_CODES_FAILURE:
            return { ...state, loading: false, error: action.payload }
        case CREATE_REDEEM_CODE_REQUEST:
            return { ...state, creating: true, error: null }
        case CREATE_REDEEM_CODE_SUCCESS:
            return { ...state, creating: false, codes: [...state.codes, action.payload] }
        case CREATE_REDEEM_CODE_FAILURE:
            return { ...state, creating: false, error: action.payload }
        case UPDATE_REDEEM_CODE_REQUEST:
            return { ...state, saving: true, error: null }
        case UPDATE_REDEEM_CODE_SUCCESS:
            return {
                ...state,
                saving: false,
                codes: state.codes.map(c => (c.id === action.payload.id ? { ...c, ...action.payload } : c)),
            }
        case UPDATE_REDEEM_CODE_FAILURE:
            return { ...state, saving: false, error: action.payload }
        case DELETE_REDEEM_CODE_REQUEST:
            return { ...state, error: null }
        case DELETE_REDEEM_CODE_SUCCESS:
            return { ...state, codes: state.codes.filter(c => c.id !== action.payload) }
        case DELETE_REDEEM_CODE_FAILURE:
            return { ...state, error: action.payload }
        default:
            return state
    }
}

export default adminRedeemCodesReducer
