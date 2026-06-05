import * as types from './constants';

export interface OrderRecord {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        username?: string;
    } | null;
    type: string;
    status: 'pending' | 'confirming' | 'completed' | 'failed';
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
}

const initialState: OrdersState = {
    orders: [],
    stats: null,
    pagination: null,
    loading: false,
    error: null,
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
                    o._id === action.payload._id ? { ...o, status: 'completed' as const } : o
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
                    o._id === action.payload._id ? { ...o, status: 'failed' as const } : o
                ),
                error: null,
            };
        case types.REJECT_ORDER_FAILURE:
            return { ...state, error: action.payload };

        default:
            return state;
    }
};

export default ordersReducer;
