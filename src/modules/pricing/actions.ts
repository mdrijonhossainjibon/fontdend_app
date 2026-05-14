import * as types from './constants'

export interface SubscribePayload {
    planId: string
    planCode: string
}

export const fetchPricingPackagesRequest = () => ({ type: types.FETCH_PRICING_PACKAGES_REQUEST } as const)
export const fetchPricingPackagesSuccess = (payload: any) => ({ type: types.FETCH_PRICING_PACKAGES_SUCCESS, payload } as const)
export const fetchPricingPackagesFailure = (payload: string) => ({ type: types.FETCH_PRICING_PACKAGES_FAILURE, payload } as const)

export const subscribeToPlanRequest = (payload: SubscribePayload) => ({ type: types.SUBSCRIBE_TO_PLAN_REQUEST, payload } as const)
export const subscribeToPlanSuccess = (payload: any) => ({ type: types.SUBSCRIBE_TO_PLAN_SUCCESS, payload } as const)
export const subscribeToPlanFailure = (payload: string) => ({ type: types.SUBSCRIBE_TO_PLAN_FAILURE, payload } as const)

export const clearSubscriptionResult = () => ({ type: types.CLEAR_SUBSCRIPTION_RESULT } as const)
