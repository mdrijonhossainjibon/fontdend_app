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

export const fetchPromoOffersRequest = () => ({ type: FETCH_PROMO_OFFERS_REQUEST })
export const fetchPromoOffersSuccess = (data: any) => ({ type: FETCH_PROMO_OFFERS_SUCCESS, payload: data })
export const fetchPromoOffersFailure = (error: string) => ({ type: FETCH_PROMO_OFFERS_FAILURE, payload: error })

export const createPromoOfferRequest = (data: any) => ({ type: CREATE_PROMO_OFFER_REQUEST, payload: data })
export const createPromoOfferSuccess = (offer: any) => ({ type: CREATE_PROMO_OFFER_SUCCESS, payload: offer })
export const createPromoOfferFailure = (error: string) => ({ type: CREATE_PROMO_OFFER_FAILURE, payload: error })

export const updatePromoOfferRequest = (data: any) => ({ type: UPDATE_PROMO_OFFER_REQUEST, payload: data })
export const updatePromoOfferSuccess = (offer: any) => ({ type: UPDATE_PROMO_OFFER_SUCCESS, payload: offer })
export const updatePromoOfferFailure = (error: string) => ({ type: UPDATE_PROMO_OFFER_FAILURE, payload: error })

export const deletePromoOfferRequest = (id: string) => ({ type: DELETE_PROMO_OFFER_REQUEST, payload: id })
export const deletePromoOfferSuccess = (id: string) => ({ type: DELETE_PROMO_OFFER_SUCCESS, payload: id })
export const deletePromoOfferFailure = (error: string) => ({ type: DELETE_PROMO_OFFER_FAILURE, payload: error })
