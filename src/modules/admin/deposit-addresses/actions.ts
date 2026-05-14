import * as types from './constants'

export interface FetchAddressesParams {
  page: number
  limit: number
  search: string
  sync?: boolean
}

export const fetchDepositAddressesRequest = (params: FetchAddressesParams) => ({
  type: types.FETCH_DEPOSIT_ADDRESSES_REQUEST,
  payload: params,
})
export const fetchDepositAddressesSuccess = (addresses: any[], pagination: any) => ({
  type: types.FETCH_DEPOSIT_ADDRESSES_SUCCESS,
  payload: { addresses, pagination },
})
export const fetchDepositAddressesFailure = (error: string) => ({
  type: types.FETCH_DEPOSIT_ADDRESSES_FAILURE,
  payload: { error },
})

export const updateDepositAddressRequest = (data: { id: string; isActive: boolean }) => ({
  type: types.UPDATE_DEPOSIT_ADDRESS_REQUEST,
  payload: data,
})
export const updateDepositAddressSuccess = () => ({
  type: types.UPDATE_DEPOSIT_ADDRESS_SUCCESS,
})
export const updateDepositAddressFailure = (error: string) => ({
  type: types.UPDATE_DEPOSIT_ADDRESS_FAILURE,
  payload: { error },
})

export const deleteDepositAddressRequest = (id: string) => ({
  type: types.DELETE_DEPOSIT_ADDRESS_REQUEST,
  payload: { id },
})
export const deleteDepositAddressSuccess = () => ({
  type: types.DELETE_DEPOSIT_ADDRESS_SUCCESS,
})
export const deleteDepositAddressFailure = (error: string) => ({
  type: types.DELETE_DEPOSIT_ADDRESS_FAILURE,
  payload: { error },
})

// ── Balance check ────────────────────────────────────────────────────────────
export const checkBalanceRequest = (id: string) => ({
  type: types.CHECK_BALANCE_REQUEST,
  payload: { id },
})
export const checkBalanceSuccess = (data: { id: string; balance: number; cryptoId: string }) => ({
  type: types.CHECK_BALANCE_SUCCESS,
  payload: data,
})
export const checkBalanceFailure = (error: string) => ({
  type: types.CHECK_BALANCE_FAILURE,
  payload: { error },
})
export const clearBalanceResult = () => ({
  type: types.CLEAR_BALANCE_RESULT,
})

// ── Sweep ────────────────────────────────────────────────────────────────────
export const sweepRequest = (data: { addressIds: string[]; masterWalletId: string }) => ({
  type: types.SWEEP_REQUEST,
  payload: data,
})
export const sweepSuccess = (results: any[]) => ({
  type: types.SWEEP_SUCCESS,
  payload: { results },
})
export const sweepFailure = (error: string) => ({
  type: types.SWEEP_FAILURE,
  payload: { error },
})
export const clearSweepResults = () => ({
  type: types.CLEAR_SWEEP_RESULTS,
})

// ── Master wallets ───────────────────────────────────────────────────────────
export const fetchMasterWalletsRequest = () => ({
  type: types.FETCH_MASTER_WALLETS_REQUEST,
})
export const fetchMasterWalletsSuccess = (wallets: any[]) => ({
  type: types.FETCH_MASTER_WALLETS_SUCCESS,
  payload: { wallets },
})
export const fetchMasterWalletsFailure = (error: string) => ({
  type: types.FETCH_MASTER_WALLETS_FAILURE,
  payload: { error },
})

// ── Add master wallet ────────────────────────────────────────────────────────
export const addMasterWalletRequest = (data: any) => ({
  type: types.ADD_MASTER_WALLET_REQUEST,
  payload: data,
})
export const addMasterWalletSuccess = () => ({
  type: types.ADD_MASTER_WALLET_SUCCESS,
})
export const addMasterWalletFailure = (error: string) => ({
  type: types.ADD_MASTER_WALLET_FAILURE,
  payload: { error },
})
export const clearAddMasterWalletStatus = () => ({
  type: types.CLEAR_ADD_MASTER_WALLET_STATUS,
})
