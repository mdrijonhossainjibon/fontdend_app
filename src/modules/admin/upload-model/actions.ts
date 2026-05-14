import {
    FETCH_BOT_ENDPOINTS_REQUEST,
    FETCH_BOT_ENDPOINTS_SUCCESS,
    FETCH_BOT_ENDPOINTS_FAILURE,
} from './constants'

export interface BotEndpoint {
    _id: string
    botName: string
    endpoint: string
    port: number
    protocol: string
    isActive: boolean
}

export const fetchBotEndpointsRequest = () => ({
    type: FETCH_BOT_ENDPOINTS_REQUEST,
})

export const fetchBotEndpointsSuccess = (endpoints: BotEndpoint[]) => ({
    type: FETCH_BOT_ENDPOINTS_SUCCESS,
    payload: endpoints,
})

export const fetchBotEndpointsFailure = (error: string) => ({
    type: FETCH_BOT_ENDPOINTS_FAILURE,
    payload: error,
})
