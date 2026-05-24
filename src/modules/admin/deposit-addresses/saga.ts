import { call, put, takeLatest } from 'redux-saga/effects'
import * as types from './constants'
import * as actions from './actions'
import { API_CALL } from '@/lib/auth-fingerprint'

function* fetchDepositAddressesSaga(action: any) {
  try {
    const { page, limit, search, sync } = action.payload
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('limit', String(limit))
    if (search) params.set('search', search)
    if (sync) params.set('sync', 'true')

    const { response } = yield call(API_CALL, {
      method: 'GET',
      url: `/admin/deposit-addresses?${params.toString()}`,
    })

    const data = (response?.data || response || {}) as any
    yield put(actions.fetchDepositAddressesSuccess(data.depositAddresses || [], data.pagination || {}))
  } catch (error: any) {
    yield put(actions.fetchDepositAddressesFailure(error?.response?.data?.error || error.message))
  }
}

function* updateDepositAddressSaga(action: any) {
  try {
    const { id, isActive } = action.payload
    yield call(API_CALL, {
      method: 'PATCH',
      url: '/admin/deposit-addresses',
      body: { id, isActive },
    })
    yield put(actions.updateDepositAddressSuccess())
  } catch (error: any) {
    yield put(actions.updateDepositAddressFailure(error?.response?.data?.error || error.message))
  }
}

function* deleteDepositAddressSaga(action: any) {
  try {
    yield call(API_CALL, {
      method: 'DELETE',
      url: `/admin/deposit-addresses?id=${action.payload.id}`,
    })
    yield put(actions.deleteDepositAddressSuccess())
  } catch (error: any) {
    yield put(actions.deleteDepositAddressFailure(error?.response?.data?.error || error.message))
  }
}

// ── Balance check ────────────────────────────────────────────────────────────
function* checkBalanceSaga(action: any) {
  try {
    const { id } = action.payload
    const { response } = yield call(API_CALL, {
      method: 'POST',
      url: '/admin/deposit-addresses/balance',
      body: { id },
    })
    const data = (response?.data || response || {}) as any
    yield put(actions.checkBalanceSuccess({
      id,
      balance: data.balance ?? 0,
      cryptoId: data.cryptoId ?? '',
    }))
  } catch (error: any) {
    yield put(actions.checkBalanceFailure(error?.response?.data?.error || error.message))
  }
}

// ── Sweep ────────────────────────────────────────────────────────────────────
function* sweepSaga(action: any) {
  try {
    const { addressIds, masterWalletId } = action.payload
    const { response } = yield call(API_CALL, {
      method: 'POST',
      url: '/admin/crypto/sweep',
      body: { addressIds, masterWalletId },
    })
    const data = (response?.data || response || {}) as any
    yield put(actions.sweepSuccess(data.results || []))
  } catch (error: any) {
    yield put(actions.sweepFailure(error?.response?.data?.error || error.message))
  }
}

// ── Master wallets ───────────────────────────────────────────────────────────
function* fetchMasterWalletsSaga() {
  try {
    const { response } = yield call(API_CALL, {
      method: 'GET',
      url: '/admin/wallets',
    })
    const data = (response?.data || response || {}) as any
    yield put(actions.fetchMasterWalletsSuccess(data.wallets || data.data || []))
  } catch (error: any) {
    yield put(actions.fetchMasterWalletsFailure(error?.response?.data?.error || error.message))
  }
}

// ── Add master wallet ────────────────────────────────────────────────────────
function* addMasterWalletSaga(action: any) {
  try {
    yield call(API_CALL, {
      method: 'POST',
      url: '/admin/wallets',
      body: action.payload,
    })
    yield put(actions.addMasterWalletSuccess())
  } catch (error: any) {
    yield put(actions.addMasterWalletFailure(error?.response?.data?.error || error.message))
  }
}

export default function* adminDepositAddressesSaga() {
  yield takeLatest(types.FETCH_DEPOSIT_ADDRESSES_REQUEST, fetchDepositAddressesSaga)
  yield takeLatest(types.UPDATE_DEPOSIT_ADDRESS_REQUEST, updateDepositAddressSaga)
  yield takeLatest(types.DELETE_DEPOSIT_ADDRESS_REQUEST, deleteDepositAddressSaga)
  yield takeLatest(types.CHECK_BALANCE_REQUEST, checkBalanceSaga)
  yield takeLatest(types.SWEEP_REQUEST, sweepSaga)
  yield takeLatest(types.FETCH_MASTER_WALLETS_REQUEST, fetchMasterWalletsSaga)
  yield takeLatest(types.ADD_MASTER_WALLET_REQUEST, addMasterWalletSaga)
}
