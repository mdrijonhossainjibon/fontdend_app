import { call, put, takeLatest } from 'redux-saga/effects'
import * as types from './constants'
import * as actions from './actions'
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint'

function* fetchWalletsSaga() {
  try {
    const { response }: APIResponse = yield call(API_CALL, {
      method: 'GET',
      url: '/admin/wallets',
    })

    const data = response as any
    yield put(actions.fetchWalletsSuccess(data.wallets || []))
  } catch (error: any) {
    yield put(actions.fetchWalletsFailure(error?.response?.data?.error || error.message))
  }
}

function* saveWalletSaga(action: any) {
  try {
    const { id, ...body } = action.payload
    const method = id ? 'PATCH' : 'POST'

    yield call(API_CALL, {
      method,
      url: '/admin/wallets',
      data: id ? { id, ...body } : body,
    })

    yield put(actions.saveWalletSuccess())
    yield put(actions.fetchWalletsRequest())
  } catch (error: any) {
    yield put(actions.saveWalletFailure(error?.response?.data?.error || error.message))
  }
}

function* deleteWalletSaga(action: any) {
  try {
    yield call(API_CALL, {
      method: 'DELETE',
      url: `/admin/wallets?id=${action.payload.id}`,
    })

    yield put(actions.deleteWalletSuccess())
    yield put(actions.fetchWalletsRequest())
  } catch (error: any) {
    yield put(actions.deleteWalletFailure(error?.response?.data?.error || error.message))
  }
}

export default function* adminWalletsSaga() {
  yield takeLatest(types.FETCH_WALLETS_REQUEST, fetchWalletsSaga)
  yield takeLatest(types.SAVE_WALLET_REQUEST, saveWalletSaga)
  yield takeLatest(types.DELETE_WALLET_REQUEST, deleteWalletSaga)
}
