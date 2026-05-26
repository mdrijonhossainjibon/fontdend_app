import { call, put, takeLatest } from 'redux-saga/effects'
import { API_CALL } from '@/lib/auth-fingerprint'
import {
    FETCH_PROMO_OFFERS_REQUEST,
    CREATE_PROMO_OFFER_REQUEST,
    UPDATE_PROMO_OFFER_REQUEST,
    DELETE_PROMO_OFFER_REQUEST,
} from './constants'
import {
    fetchPromoOffersSuccess,
    fetchPromoOffersFailure,
    createPromoOfferSuccess,
    createPromoOfferFailure,
    updatePromoOfferSuccess,
    updatePromoOfferFailure,
    deletePromoOfferSuccess,
    deletePromoOfferFailure,
} from './actions'

function* fetchPromoOffersSaga(): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, { method: 'GET', url: '/admin/promo-offers' })
        yield put(fetchPromoOffersSuccess(response.data?.offers || []))
    } catch (error: any) {
        yield put(fetchPromoOffersFailure(error?.message || 'Failed to load promo offers'))
    }
}

function* createPromoOfferSaga(action: any): Generator<any, void, any> {
    try {
        const { image, ...fields } = action.payload
        let body: any = fields
        let headers: Record<string, string> | undefined

        if (image && image instanceof File) {
            const formData = new FormData()
            Object.entries(fields).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value))
                } else if (value !== undefined && value !== null) {
                    formData.append(key, String(value))
                }
            })
            formData.append('image', image)
            body = formData
            headers = { 'Content-Type': 'multipart/form-data' }
        }

        const { response } = yield call(API_CALL, { method: 'POST', url: '/admin/promo-offers', body, headers })
        if (response.success) {
            yield put(createPromoOfferSuccess(response.data?.offer))
        } else {
            yield put(createPromoOfferFailure(response.error || 'Failed to create promo offer'))
        }
    } catch (error: any) {
        yield put(createPromoOfferFailure(error?.message || 'Failed to create promo offer'))
    }
}

function* updatePromoOfferSaga(action: any): Generator<any, void, any> {
    try {
        const { image, ...fields } = action.payload
        let body: any = fields
        let headers: Record<string, string> | undefined

        if (image && image instanceof File) {
            const formData = new FormData()
            Object.entries(fields).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value))
                } else if (value !== undefined && value !== null) {
                    formData.append(key, String(value))
                }
            })
            formData.append('image', image)
            body = formData
            headers = { 'Content-Type': 'multipart/form-data' }
        }

        const { response } = yield call(API_CALL, { method: 'PATCH', url: '/admin/promo-offers', body, headers })
        if (response.success) {
            yield put(updatePromoOfferSuccess(fields))
        } else {
            yield put(updatePromoOfferFailure(response.error || 'Failed to update promo offer'))
        }
    } catch (error: any) {
        yield put(updatePromoOfferFailure(error?.message || 'Failed to update promo offer'))
    }
}

function* deletePromoOfferSaga(action: any): Generator<any, void, any> {
    try {
        const { response } = yield call(API_CALL, { method: 'DELETE', url: `/admin/promo-offers?offerId=${action.payload}` })
        if (response.success) {
            yield put(deletePromoOfferSuccess(action.payload))
        } else {
            yield put(deletePromoOfferFailure(response.error || 'Failed to delete promo offer'))
        }
    } catch (error: any) {
        yield put(deletePromoOfferFailure(error?.message || 'Failed to delete promo offer'))
    }
}

export default function* adminPromoOffersSaga() {
    yield takeLatest(FETCH_PROMO_OFFERS_REQUEST, fetchPromoOffersSaga)
    yield takeLatest(CREATE_PROMO_OFFER_REQUEST, createPromoOfferSaga)
    yield takeLatest(UPDATE_PROMO_OFFER_REQUEST, updatePromoOfferSaga)
    yield takeLatest(DELETE_PROMO_OFFER_REQUEST, deletePromoOfferSaga)
}
