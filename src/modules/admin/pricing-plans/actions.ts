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

export const fetchPricingPlansRequest = () => ({ type: FETCH_PRICING_PLANS_REQUEST })
export const fetchPricingPlansSuccess = (data: any) => ({ type: FETCH_PRICING_PLANS_SUCCESS, payload: data })
export const fetchPricingPlansFailure = (error: string) => ({ type: FETCH_PRICING_PLANS_FAILURE, payload: error })

export const createPricingPlanRequest = (data: any) => ({ type: CREATE_PRICING_PLAN_REQUEST, payload: data })
export const createPricingPlanSuccess = (plan: any) => ({ type: CREATE_PRICING_PLAN_SUCCESS, payload: plan })
export const createPricingPlanFailure = (error: string) => ({ type: CREATE_PRICING_PLAN_FAILURE, payload: error })

export const updatePricingPlanRequest = (data: any) => ({ type: UPDATE_PRICING_PLAN_REQUEST, payload: data })
export const updatePricingPlanSuccess = (plan: any) => ({ type: UPDATE_PRICING_PLAN_SUCCESS, payload: plan })
export const updatePricingPlanFailure = (error: string) => ({ type: UPDATE_PRICING_PLAN_FAILURE, payload: error })

export const deletePricingPlanRequest = (id: string) => ({ type: DELETE_PRICING_PLAN_REQUEST, payload: id })
export const deletePricingPlanSuccess = (id: string) => ({ type: DELETE_PRICING_PLAN_SUCCESS, payload: id })
export const deletePricingPlanFailure = (error: string) => ({ type: DELETE_PRICING_PLAN_FAILURE, payload: error })
