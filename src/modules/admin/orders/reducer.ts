import * as types from './constants';

export interface OrderRecord {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        username?: string;
        avatar?: string;
    } | null;
    type: string;
    status: 'pending' | 'confirming' | 'completed' | 'failed' | 'expired' | 'rejected' | 'approved';
    amount: number;
    amountUSD: number;
    cryptoName: string;
    networkName: string;
    address: string;
    txHash: string;
    credits: number;
    confirmations: number;
    requiredConfirmations: number;
    fee: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    expiresAt?: string;
}

export interface OrderStats {
    total: number;
    completed: number;
    pending: number;
    confirming: number;
    failed: number;
    revenue: number;
}

export interface OrderPagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface OrdersState {
    orders: OrderRecord[];
    stats: OrderStats | null;
    pagination: OrderPagination | null;
    loading: boolean;
    error: string | null;
    lastPaymentInfo: any;
}

const initialState: OrdersState = {
    orders: [],
    stats: null,
    pagination: null,
    loading: false,
    error: null,
    lastPaymentInfo: null,
};

const ordersReducer = (state = initialState, action: any): OrdersState => {
    switch (action.type) {
        case types.FETCH_ORDERS_REQUEST:
            return { ...state, loading: true, error: null };
        case types.FETCH_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload.orders,
                pagination: action.payload.pagination,
                stats: action.payload.stats,
                error: null,
            };
        case types.FETCH_ORDERS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.APPROVE_ORDER_REQUEST:
            return { ...state, error: null };
        case types.APPROVE_ORDER_SUCCESS:
            return {
                ...state,
                orders: state.orders.map((o) =>
                    o._id === action.payload._id ? { ...o, status: 'approved' as const } : o
                ),
                error: null,
            };
        case types.APPROVE_ORDER_FAILURE:
            return { ...state, error: action.payload };

        case types.REJECT_ORDER_REQUEST:
            return { ...state, error: null };
        case types.REJECT_ORDER_SUCCESS:
            return {
                ...state,
                orders: state.orders.map((o) =>
                    o._id === action.payload._id ? { ...o, status: 'rejected' as const } : o
                ),
                error: null,
            };
        case types.REJECT_ORDER_FAILURE:
            return { ...state, error: action.payload };

        case types.CHECK_ORDER_PAYMENT_SUCCESS: {
            const updated = action.payload;
            const deposit = updated?.deposit || {};
            return {
                ...state,
                orders: state.orders.map((o: any) =>
                    o._id === deposit._id
                        ? { ...o, status: deposit.status || o.status, txHash: deposit.txHash || o.txHash }
                        : o
                ),
                lastPaymentInfo: updated.paymentInfo || null,
            };
        }

        case types.DELETE_ORDER_SUCCESS:
            return { ...state };

        case types.CLEAR_PAYMENT_INFO:
            return { ...state, lastPaymentInfo: null };

        default:
            return state;
    }
};

export default ordersReducer;
