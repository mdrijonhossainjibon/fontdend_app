import * as types from './constants';

export const fetchKolotiCacheRequest = (params: { search?: string; page: number; limit: number }) => ({
    type: types.FETCH_KOLOTI_CACHE_REQUEST,
    payload: params,
});

export const fetchKolotiCacheSuccess = (data: { records: any[]; pagination: any }) => ({
    type: types.FETCH_KOLOTI_CACHE_SUCCESS,
    payload: data,
});

export const fetchKolotiCacheFailure = (error: string) => ({
    type: types.FETCH_KOLOTI_CACHE_FAILURE,
    payload: error,
});

export const deleteKolotiCacheRequest = (recordId: string) => ({
    type: types.DELETE_KOLOTI_CACHE_REQUEST,
    payload: recordId,
});

export const deleteKolotiCacheSuccess = (recordId: string) => ({
    type: types.DELETE_KOLOTI_CACHE_SUCCESS,
    payload: recordId,
});

export const deleteKolotiCacheFailure = (error: string) => ({
    type: types.DELETE_KOLOTI_CACHE_FAILURE,
    payload: error,
});

export const updateKolotiCacheAnswerRequest = (data: { recordId: string; answer: number[] }) => ({
    type: types.UPDATE_KOLOTI_CACHE_ANSWER_REQUEST,
    payload: data,
});

export const updateKolotiCacheAnswerSuccess = (data: { recordId: string; answer: number[] }) => ({
    type: types.UPDATE_KOLOTI_CACHE_ANSWER_SUCCESS,
    payload: data,
});

export const updateKolotiCacheAnswerFailure = (error: string) => ({
    type: types.UPDATE_KOLOTI_CACHE_ANSWER_FAILURE,
    payload: error,
});

// Bot Endpoints Actions
export const fetchBotEndpointsRequest = () => ({
    type: types.FETCH_BOT_ENDPOINTS_REQUEST,
});

export const fetchBotEndpointsSuccess = (endpoints: any[]) => ({
    type: types.FETCH_BOT_ENDPOINTS_SUCCESS,
    payload: endpoints,
});

export const fetchBotEndpointsFailure = (error: string) => ({
    type: types.FETCH_BOT_ENDPOINTS_FAILURE,
    payload: error,
});

export const createBotEndpointRequest = (data: any) => ({
    type: types.CREATE_BOT_ENDPOINT_REQUEST,
    payload: data,
});

export const createBotEndpointSuccess = (endpoint: any) => ({
    type: types.CREATE_BOT_ENDPOINT_SUCCESS,
    payload: endpoint,
});

export const createBotEndpointFailure = (error: string) => ({
    type: types.CREATE_BOT_ENDPOINT_FAILURE,
    payload: error,
});

export const updateBotEndpointRequest = (data: { id: string; endpoint: any }) => ({
    type: types.UPDATE_BOT_ENDPOINT_REQUEST,
    payload: data,
});

export const updateBotEndpointSuccess = (endpoint: any) => ({
    type: types.UPDATE_BOT_ENDPOINT_SUCCESS,
    payload: endpoint,
});

export const updateBotEndpointFailure = (error: string) => ({
    type: types.UPDATE_BOT_ENDPOINT_FAILURE,
    payload: error,
});

export const deleteBotEndpointRequest = (id: string) => ({
    type: types.DELETE_BOT_ENDPOINT_REQUEST,
    payload: id,
});

export const deleteBotEndpointSuccess = (id: string) => ({
    type: types.DELETE_BOT_ENDPOINT_SUCCESS,
    payload: id,
});

export const deleteBotEndpointFailure = (error: string) => ({
    type: types.DELETE_BOT_ENDPOINT_FAILURE,
    payload: error,
});

export const refreshBotClassesRequest = (endpoint: any) => ({
    type: types.REFRESH_BOT_CLASSES_REQUEST,
    payload: endpoint,
});

export const refreshBotClassesSuccess = (data: any) => ({
    type: types.REFRESH_BOT_CLASSES_SUCCESS,
    payload: data,
});

export const refreshBotClassesFailure = (error: string) => ({
    type: types.REFRESH_BOT_CLASSES_FAILURE,
    payload: error,
});
