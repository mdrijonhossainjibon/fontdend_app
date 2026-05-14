import * as types from './constants'

export interface PricingPackage {
    id: string
    type: 'count' | 'daily' | 'minute'
    code: string
    price: string
    priceValue: number
    validity: string
    recognition: string
    isPromo?: boolean
    count?: number
    dailyLimit?: number
    rateLimit?: number
}

export interface SubscriptionResult {
    subscriptionId: string
    planCode: string
    price: string
    credits: number
    startDate: string
    endDate: string
}

export interface PricingState {
    packages: PricingPackage[]
    loading: boolean
    error: string | null

    subscribing: boolean
    subscriptionResult: SubscriptionResult | null
    subscribeError: string | null
}

const initialState: PricingState = {
    packages: [],
    loading: false,
    error: null,

    subscribing: false,
    subscriptionResult: null,
    subscribeError: null,
}

const pricingReducer = (state = initialState, action: any): PricingState => {
    switch (action.type) {
        case types.FETCH_PRICING_PACKAGES_REQUEST:
            return { ...state, loading: true, error: null }
        case types.FETCH_PRICING_PACKAGES_SUCCESS:
            return { ...state, loading: false, packages: action.payload }
        case types.FETCH_PRICING_PACKAGES_FAILURE:
            return { ...state, loading: false, error: action.payload }

        case types.SUBSCRIBE_TO_PLAN_REQUEST:
            return { ...state, subscribing: true, subscribeError: null, subscriptionResult: null }
        case types.SUBSCRIBE_TO_PLAN_SUCCESS:
            return { ...state, subscribing: false, subscriptionResult: action.payload }
        case types.SUBSCRIBE_TO_PLAN_FAILURE:
            return { ...state, subscribing: false, subscribeError: action.payload }

        case types.CLEAR_SUBSCRIPTION_RESULT:
            return { ...state, subscriptionResult: null, subscribeError: null }

        default:
            return state
    }
}

export default pricingReducer
