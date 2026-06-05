import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint';
import { message } from 'antd';

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
            message.error(response?.error || 'Failed to fetch orders');
        }
    } catch (error) {
        yield put(actions.fetchOrdersFailure('Failed to fetch orders'));
        message.error('Failed to fetch orders');
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
            message.success('Order approved successfully');
            yield put(actions.fetchOrdersRequest());
        } else {
            yield put(actions.approveOrderFailure(response?.error || 'Failed to approve'));
            message.error(response?.error || 'Failed to approve');
        }
    } catch (error) {
        yield put(actions.approveOrderFailure('Failed to approve order'));
        message.error('Failed to approve order');
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
            message.success('Order rejected');
            yield put(actions.fetchOrdersRequest());
        } else {
            yield put(actions.rejectOrderFailure(response?.error || 'Failed to reject'));
            message.error(response?.error || 'Failed to reject');
        }
    } catch (error) {
        yield put(actions.rejectOrderFailure('Failed to reject order'));
        message.error('Failed to reject order');
    }
}

export default function* ordersSaga() {
    yield takeLatest(types.FETCH_ORDERS_REQUEST, fetchOrdersSaga);
    yield takeLatest(types.APPROVE_ORDER_REQUEST, approveOrderSaga);
    yield takeLatest(types.REJECT_ORDER_REQUEST, rejectOrderSaga);
}
