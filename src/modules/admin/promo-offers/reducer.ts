import {
    FETCH_PROMO_OFFERS_REQUEST,
    FETCH_PROMO_OFFERS_SUCCESS,
    FETCH_PROMO_OFFERS_FAILURE,
    CREATE_PROMO_OFFER_REQUEST,
    CREATE_PROMO_OFFER_SUCCESS,
    CREATE_PROMO_OFFER_FAILURE,
    UPDATE_PROMO_OFFER_REQUEST,
    UPDATE_PROMO_OFFER_SUCCESS,
    UPDATE_PROMO_OFFER_FAILURE,
    DELETE_PROMO_OFFER_REQUEST,
    DELETE_PROMO_OFFER_SUCCESS,
    DELETE_PROMO_OFFER_FAILURE,
} from './constants'

export interface PromoOfferItem {
    id: string
    title: string
    badge: string
    description: string
    features: string[]
    highlight: string
    pricingPlanCode: string
    isActive: boolean
    sortOrder: number
    image: string
    createdAt: string
}

export interface PromoOffersState {
    offers: PromoOfferItem[]
    loading: boolean
    creating: boolean
    saving: boolean
    error: string | null
}

const initialState: PromoOffersState = {
    offers: [],
    loading: false,
    creating: false,
    saving: false,
    error: null,
}

const adminPromoOffersReducer = (state = initialState, action: any): PromoOffersState => {
    switch (action.type) {
        case FETCH_PROMO_OFFERS_REQUEST:
            return { ...state, loading: true, error: null }
        case FETCH_PROMO_OFFERS_SUCCESS:
            return { ...state, loading: false, offers: action.payload, error: null }
        case FETCH_PROMO_OFFERS_FAILURE:
            return { ...state, loading: false, error: action.payload }
        case CREATE_PROMO_OFFER_REQUEST:
            return { ...state, creating: true, error: null }
        case CREATE_PROMO_OFFER_SUCCESS:
            return { ...state, creating: false, offers: [...state.offers, action.payload] }
        case CREATE_PROMO_OFFER_FAILURE:
            return { ...state, creating: false, error: action.payload }
        case UPDATE_PROMO_OFFER_REQUEST:
            return { ...state, saving: true, error: null }
        case UPDATE_PROMO_OFFER_SUCCESS:
            return {
                ...state,
                saving: false,
                offers: state.offers.map(o => (o.id === action.payload.id ? { ...o, ...action.payload } : o)),
            }
        case UPDATE_PROMO_OFFER_FAILURE:
            return { ...state, saving: false, error: action.payload }
        case DELETE_PROMO_OFFER_REQUEST:
            return { ...state, error: null }
        case DELETE_PROMO_OFFER_SUCCESS:
            return { ...state, offers: state.offers.filter(o => o.id !== action.payload) }
        case DELETE_PROMO_OFFER_FAILURE:
            return { ...state, error: action.payload }
        default:
            return state
    }
}

export default adminPromoOffersReducer
