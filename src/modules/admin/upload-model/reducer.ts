import {
    FETCH_BOT_ENDPOINTS_REQUEST,
    FETCH_BOT_ENDPOINTS_SUCCESS,
    FETCH_BOT_ENDPOINTS_FAILURE,
} from './constants'
import type { BotEndpoint } from './actions'

export interface UploadModelState {
    endpoints: BotEndpoint[]
    loading: boolean
    error: string | null
}

const initialState: UploadModelState = {
    endpoints: [],
    loading: false,
    error: null,
}

export const adminUploadModelReducer = (state = initialState, action: any): UploadModelState => {
    switch (action.type) {
        case FETCH_BOT_ENDPOINTS_REQUEST:
            return { ...state, loading: true, error: null }
        case FETCH_BOT_ENDPOINTS_SUCCESS:
            return { ...state, endpoints: action.payload, loading: false, error: null }
        case FETCH_BOT_ENDPOINTS_FAILURE:
            return { ...state, loading: false, error: action.payload }
        default:
            return state
    }
}

export default adminUploadModelReducer
