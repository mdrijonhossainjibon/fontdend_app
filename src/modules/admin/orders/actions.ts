import * as types from './constants';

export const fetchOrdersRequest = (payload?: any) => ({
    type: types.FETCH_ORDERS_REQUEST,
    payload,
});

export const fetchOrdersSuccess = (payload: any) => ({
    type: types.FETCH_ORDERS_SUCCESS,
    payload,
});

export const fetchOrdersFailure = (error: string) => ({
    type: types.FETCH_ORDERS_FAILURE,
    payload: error,
});

export const approveOrderRequest = (payload: string) => ({
    type: types.APPROVE_ORDER_REQUEST,
    payload,
});

export const approveOrderSuccess = (payload: any) => ({
    type: types.APPROVE_ORDER_SUCCESS,
    payload,
});

export const approveOrderFailure = (error: string) => ({
    type: types.APPROVE_ORDER_FAILURE,
    payload: error,
});

export const rejectOrderRequest = (payload: string) => ({
    type: types.REJECT_ORDER_REQUEST,
    payload,
});

export const rejectOrderSuccess = (payload: any) => ({
    type: types.REJECT_ORDER_SUCCESS,
    payload,
});

export const rejectOrderFailure = (error: string) => ({
    type: types.REJECT_ORDER_FAILURE,
    payload: error,
});
