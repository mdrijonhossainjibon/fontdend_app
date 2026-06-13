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

export const clearOrdersRequest = (filters?: any) => ({
    type: types.CLEAR_ORDERS_REQUEST,
    payload: filters,
});

export const clearOrdersSuccess = (payload: any) => ({
    type: types.CLEAR_ORDERS_SUCCESS,
    payload,
});

export const clearOrdersFailure = (error: string) => ({
    type: types.CLEAR_ORDERS_FAILURE,
    payload: error,
});

export const checkOrderPaymentRequest = (payload: string) => ({
    type: types.CHECK_ORDER_PAYMENT_REQUEST,
    payload,
});

export const checkOrderPaymentSuccess = (payload: any) => ({
    type: types.CHECK_ORDER_PAYMENT_SUCCESS,
    payload,
});

export const checkOrderPaymentFailure = (error: string) => ({
    type: types.CHECK_ORDER_PAYMENT_FAILURE,
    payload: error,
});

export const deleteOrderRequest = (payload: string) => ({
    type: types.DELETE_ORDER_REQUEST,
    payload,
});

export const deleteOrderSuccess = () => ({
    type: types.DELETE_ORDER_SUCCESS,
});

export const deleteOrderFailure = (error: string) => ({
    type: types.DELETE_ORDER_FAILURE,
    payload: error,
});
