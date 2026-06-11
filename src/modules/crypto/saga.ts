import { call, put, takeLatest, select, delay, take, race } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint';
import { toast } from "sonner";
import { updateUserBalance } from '../dashboard/actions';

function* fetchCryptoConfigSaga(): Generator {
    try {
        console.log('[crypto/saga] FETCH_CRYPTO_CONFIG_REQUEST dispatched');
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: '/crypto/config'
        });

        console.log('[crypto/saga] API response status:', status);
        console.log('[crypto/saga] API response body:', JSON.stringify(response));

        if (status === 200 && response.success) {
            const data = response.data;
            console.log('[crypto/saga] SUCCESS - data length:', data?.length);
            console.log('[crypto/saga] SUCCESS - data items:', JSON.stringify(data));
            yield put(actions.fetchCryptoConfigSuccess(data));
        } else {
            console.log('[crypto/saga] FAILURE - response:', JSON.stringify(response));
            yield put(actions.fetchCryptoConfigFailure(response?.error || 'Failed to fetch config'));
        }
    } catch (error: any) {
        console.log('[crypto/saga] EXCEPTION:', error.message);
        yield put(actions.fetchCryptoConfigFailure(error.message));
    }
}

function* fetchCryptoPriceSaga(action: any): Generator {
    const cryptoId = action.payload;
    if (['usdt', 'usdc'].includes(cryptoId.toLowerCase())) {
        yield put(actions.fetchCryptoPriceSuccess(cryptoId, 1.0));
        return;
    }

    try {
        const geckoMap: Record<string, string> = {
            'eth': 'ethereum',
            'bnb': 'binancecoin',
            'matic': 'matic-network',
            'btc': 'bitcoin',
            'sol': 'solana',
            'arb': 'arbitrum'
        };
        const geckoId = geckoMap[cryptoId.toLowerCase()] || cryptoId.toLowerCase();

        const response: Response = yield call(fetch, `https://api.coingecko.com/api/v3/simple/price?ids=${geckoId}&vs_currencies=usd`);
        const data: any = yield call([response, response.json]);

        if (data[geckoId]) {
            yield put(actions.fetchCryptoPriceSuccess(cryptoId, data[geckoId].usd));
        }
    } catch (err: any) {
        yield put(actions.fetchCryptoPriceFailure(err.message));
    }
}

function* recordDepositSaga(action: any): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/crypto/deposits',
            body: action.payload
        });

        if (status === 200) {
            yield put(actions.recordDepositSuccess(response));
        } else {
            yield put(actions.recordDepositFailure(response?.error || 'Failed to record deposit'));
        }
    } catch (error: any) {
        yield put(actions.recordDepositFailure(error.message));
    }
}

function* fetchDepositAddressSaga(action: any): Generator {
    try {
        const { cryptoId, networkId } = action.payload;
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: `/crypto/address?cryptoId=${cryptoId}&networkId=${networkId}`
        });

        if (status === 200 && response.success) {
            yield put(actions.fetchDepositAddressSuccess(response.data.address));
        } else {
            yield put(actions.fetchDepositAddressFailure(response?.error || 'Failed to fetch deposit address'));
        }
    } catch (error: any) {
        yield put(actions.fetchDepositAddressFailure(error.message));
    }
}

function* checkIncomingDepositsSaga(action: any): Generator {
    try {
        const address = action.payload;
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: `/crypto/deposits/check?address=${address}`
        });

        if (status === 200 && response.success) {
            yield put(actions.checkIncomingDepositsSuccess(response.data));
            if (response.data && response.data.length > 0) {
                const totalAmount = response.data.reduce((sum: number, dep: any) => sum + (dep.amountUSD || 0), 0);
                yield put(updateUserBalance(totalAmount));
                toast.success('New Deposit Detected', {
                    description: `Successfully detected ${response.data.length} new deposit(s).`,
                });
            }
        }
    } catch (error: any) {
        yield put(actions.checkIncomingDepositsFailure(error.message));
    }
}

function* watchDepositPollingSaga(): Generator {
    while (true) {
        const action: any = yield take(types.START_DEPOSIT_POLLING);
        const address = action.payload;
        yield race({
            task: call(function* () {
                while (true) {
                    yield call(checkIncomingDepositsSaga, action);
                    yield delay(10000); // Check every 10 seconds (upped from 1s to be more reasonable)
                }
            }),
            cancel: take(types.STOP_DEPOSIT_POLLING)
        });
    }
}

export default function* cryptoSaga() {
    yield takeLatest(types.FETCH_CRYPTO_CONFIG_REQUEST, fetchCryptoConfigSaga);
    yield takeLatest(types.FETCH_CRYPTO_PRICE_REQUEST, fetchCryptoPriceSaga);
    yield takeLatest(types.RECORD_DEPOSIT_REQUEST, recordDepositSaga);
    yield takeLatest(types.FETCH_DEPOSIT_ADDRESS_REQUEST, fetchDepositAddressSaga);
    yield takeLatest(types.CHECK_INCOMING_DEPOSITS_REQUEST, checkIncomingDepositsSaga);
    yield call(watchDepositPollingSaga);
}
