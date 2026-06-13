import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint';
import { toast } from "sonner";

function* fetchOrdersSaga(action: any): Generator {
    try {
        const { search, status, page, limit } = action.payload || {};
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        params.append('page', (page || 1).toString());
        params.append('limit', (limit || 20).toString());

        const { response }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: `/admin/deposits?${params.toString()}`
        });

        if (response && response.success) {
            const deposits = response.deposits || [];
            const pagination = response.pagination || {};
            const stats = {
                total: pagination.total || 0,
                completed: deposits.filter((d: any) => d.status === 'completed').length,
                pending: deposits.filter((d: any) => d.status === 'pending').length,
                confirming: deposits.filter((d: any) => d.status === 'confirming').length,
                failed: deposits.filter((d: any) => d.status === 'failed').length,
                revenue: deposits.reduce((sum: number, d: any) => d.status === 'completed' ? sum + (d.amountUSD || 0) : sum, 0),
            };
            yield put(actions.fetchOrdersSuccess({ orders: deposits, pagination, stats }));
        } else {
            yield put(actions.fetchOrdersFailure(response?.error || 'Failed to fetch orders'));
            toast.error(response?.error || 'Failed to fetch orders');
        }
    } catch (error) {
        yield put(actions.fetchOrdersFailure('Failed to fetch orders'));
        toast.error('Failed to fetch orders');
    }
}

function* approveOrderSaga(action: any): Generator {
    try {
        const orderId = action.payload;
        const { response }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: `/admin/deposits/${orderId}/approve`
        });

        if (response && response.success) {
            yield put(actions.approveOrderSuccess(response.deposit));
            toast.success('Order approved successfully');
        } else {
            yield put(actions.approveOrderFailure(response?.error || 'Failed to approve'));
            toast.error(response?.error || 'Failed to approve');
        }
    } catch (error) {
        yield put(actions.approveOrderFailure('Failed to approve order'));
        toast.error('Failed to approve order');
    }
}

function* rejectOrderSaga(action: any): Generator {
    try {
        const orderId = action.payload;
        const { response }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: `/admin/deposits/${orderId}/reject`
        });

        if (response && response.success) {
            yield put(actions.rejectOrderSuccess(response.deposit));
            toast.success('Order rejected');
        } else {
            yield put(actions.rejectOrderFailure(response?.error || 'Failed to reject'));
            toast.error(response?.error || 'Failed to reject');
        }
    } catch (error) {
        yield put(actions.rejectOrderFailure('Failed to reject order'));
        toast.error('Failed to reject order');
    }
}

function* clearOrdersSaga(action: any): Generator {
    try {
        const params = new URLSearchParams();
        params.append('clearAll', 'true');
        if (action.payload?.status) params.append('status', action.payload.status);

        const { response }: APIResponse = yield call(API_CALL, {
            method: 'DELETE',
            url: `/admin/deposits?${params.toString()}`
        });

        if (response && response.success) {
            yield put(actions.clearOrdersSuccess(response));
            toast.success('Orders cleared successfully');
            yield put(actions.fetchOrdersRequest());
        } else {
            yield put(actions.clearOrdersFailure(response?.error || 'Failed to clear orders'));
            toast.error(response?.error || 'Failed to clear orders');
        }
    } catch (error) {
        yield put(actions.clearOrdersFailure('Failed to clear orders'));
        toast.error('Failed to clear orders');
    }
}

function* checkOrderPaymentSaga(action: any): Generator {
    try {
        const { response }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: `/admin/deposits/${action.payload}/check-payment`,
        });

        if (response && response.success) {
            // Pass full response so reducer gets status, deposit, and paymentInfo
            yield put(actions.checkOrderPaymentSuccess(response));
            toast.success(response.message || 'Payment checked');
            // Don't re-fetch — reducer patches the order locally
        } else {
            yield put(actions.checkOrderPaymentFailure(response?.error || 'Check failed'));
            toast.error(response?.error || 'Check failed');
        }
    } catch (error) {
        yield put(actions.checkOrderPaymentFailure('Check failed'));
        toast.error('Check failed');
    }
}

function* deleteOrderSaga(action: any): Generator {
    try {
        const { response }: APIResponse = yield call(API_CALL, {
            method: 'DELETE',
            url: `/admin/deposits/${action.payload}`,
        });

        if (response && response.success) {
            toast.success('Order deleted');
            yield put(actions.deleteOrderSuccess());
            yield put(actions.fetchOrdersRequest());
        } else {
            yield put(actions.deleteOrderFailure(response?.error || 'Delete failed'));
            toast.error(response?.error || 'Delete failed');
        }
    } catch (error) {
        yield put(actions.deleteOrderFailure('Delete failed'));
        toast.error('Delete failed');
    }
}

export default function* ordersSaga() {
    yield takeLatest(types.FETCH_ORDERS_REQUEST, fetchOrdersSaga);
    yield takeLatest(types.APPROVE_ORDER_REQUEST, approveOrderSaga);
    yield takeLatest(types.REJECT_ORDER_REQUEST, rejectOrderSaga);
    yield takeLatest(types.CLEAR_ORDERS_REQUEST, clearOrdersSaga);
    yield takeLatest(types.CHECK_ORDER_PAYMENT_REQUEST, checkOrderPaymentSaga);
    yield takeLatest(types.DELETE_ORDER_REQUEST, deleteOrderSaga);
}
