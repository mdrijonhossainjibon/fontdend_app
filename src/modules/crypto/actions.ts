import * as types from './constants';

export const fetchCryptoConfigRequest = () => ({
    type: types.FETCH_CRYPTO_CONFIG_REQUEST,
});

export const fetchCryptoConfigSuccess = (payload: any) => ({
    type: types.FETCH_CRYPTO_CONFIG_SUCCESS,
    payload,
});

export const fetchCryptoConfigFailure = (error: string) => ({
    type: types.FETCH_CRYPTO_CONFIG_FAILURE,
    payload: error,
});

export const fetchCryptoPriceRequest = (cryptoId: string) => ({
    type: types.FETCH_CRYPTO_PRICE_REQUEST,
    payload: cryptoId,
});

export const fetchCryptoPriceSuccess = (cryptoId: string, price: number) => ({
    type: types.FETCH_CRYPTO_PRICE_SUCCESS,
    payload: { cryptoId, price },
});

export const fetchCryptoPriceFailure = (error: string) => ({
    type: types.FETCH_CRYPTO_PRICE_FAILURE,
    payload: error,
});

export const recordDepositRequest = (payload: any) => ({
    type: types.RECORD_DEPOSIT_REQUEST,
    payload,
});

export const recordDepositSuccess = (payload: any) => ({
    type: types.RECORD_DEPOSIT_SUCCESS,
    payload,
});

export const recordDepositFailure = (error: string) => ({
    type: types.RECORD_DEPOSIT_FAILURE,
    payload: error,
});

export const fetchDepositAddressRequest = (cryptoId: string, networkId: string) => ({
    type: types.FETCH_DEPOSIT_ADDRESS_REQUEST,
    payload: { cryptoId, networkId },
});

export const fetchDepositAddressSuccess = (address: string) => ({
    type: types.FETCH_DEPOSIT_ADDRESS_SUCCESS,
    payload: address,
});

export const fetchDepositAddressFailure = (error: string) => ({
    type: types.FETCH_DEPOSIT_ADDRESS_FAILURE,
    payload: error,
});

export const startDepositPolling = (address: string) => ({
    type: types.START_DEPOSIT_POLLING,
    payload: address,
});

export const stopDepositPolling = () => ({
    type: types.STOP_DEPOSIT_POLLING,
});

export const checkIncomingDepositsRequest = (address: string) => ({
    type: types.CHECK_INCOMING_DEPOSITS_REQUEST,
    payload: address,
});

export const checkIncomingDepositsSuccess = (payload: any) => ({
    type: types.CHECK_INCOMING_DEPOSITS_SUCCESS,
    payload,
});

export const checkIncomingDepositsFailure = (error: string) => ({
    type: types.CHECK_INCOMING_DEPOSITS_FAILURE,
    payload: error,
});
