import * as types from './constants';

const initialState = {
    configs: [],
    prices: {} as Record<string, number>,
    loading: false,
    loadingPrice: false,
    recording: false,
    depositAddress: null as string | null,
    fetchingAddress: false,
    pollingDeposits: false,
    incomingDeposits: [] as any[],
    error: null,
};

const cryptoReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.FETCH_CRYPTO_CONFIG_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case types.FETCH_CRYPTO_CONFIG_SUCCESS:
            return {
                ...state,
                loading: false,
                configs: action.payload,
            };
        case types.FETCH_CRYPTO_CONFIG_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case types.FETCH_CRYPTO_PRICE_REQUEST:
            return {
                ...state,
                loadingPrice: true,
            };
        case types.FETCH_CRYPTO_PRICE_SUCCESS:
            return {
                ...state,
                loadingPrice: false,
                prices: {
                    ...state.prices,
                    [action.payload.cryptoId]: action.payload.price,
                },
            };
        case types.FETCH_CRYPTO_PRICE_FAILURE:
            return {
                ...state,
                loadingPrice: false,
            };
        case types.RECORD_DEPOSIT_REQUEST:
            return {
                ...state,
                recording: true,
            };
        case types.RECORD_DEPOSIT_SUCCESS:
            return {
                ...state,
                recording: false,
            };
        case types.RECORD_DEPOSIT_FAILURE:
            return {
                ...state,
                recording: false,
                error: action.payload,
            };
        case types.FETCH_DEPOSIT_ADDRESS_REQUEST:
            return {
                ...state,
                fetchingAddress: true,
                depositAddress: null,
            };
        case types.FETCH_DEPOSIT_ADDRESS_SUCCESS:
            return {
                ...state,
                fetchingAddress: false,
                depositAddress: action.payload,
            };
        case types.FETCH_DEPOSIT_ADDRESS_FAILURE:
            return {
                ...state,
                fetchingAddress: false,
                error: action.payload,
            };
        case types.START_DEPOSIT_POLLING:
            return {
                ...state,
                pollingDeposits: true,
            };
        case types.STOP_DEPOSIT_POLLING:
            return {
                ...state,
                pollingDeposits: false,
            };
        case types.CHECK_INCOMING_DEPOSITS_SUCCESS:
            return {
                ...state,
                incomingDeposits: action.payload,
            };
        default:
            return state;
    }
};

export default cryptoReducer;
