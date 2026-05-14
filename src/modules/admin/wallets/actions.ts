import * as types from './constants'

export const fetchWalletsRequest = () => ({
  type: types.FETCH_WALLETS_REQUEST,
})
export const fetchWalletsSuccess = (wallets: any[]) => ({
  type: types.FETCH_WALLETS_SUCCESS,
  payload: { wallets },
})
export const fetchWalletsFailure = (error: string) => ({
  type: types.FETCH_WALLETS_FAILURE,
  payload: { error },
})

export const saveWalletRequest = (data: { address: string; network: string; label: string; symbol: string; isActive?: boolean; id?: string }) => ({
  type: types.SAVE_WALLET_REQUEST,
  payload: data,
})
export const saveWalletSuccess = () => ({
  type: types.SAVE_WALLET_SUCCESS,
})
export const saveWalletFailure = (error: string) => ({
  type: types.SAVE_WALLET_FAILURE,
  payload: { error },
})

export const deleteWalletRequest = (id: string) => ({
  type: types.DELETE_WALLET_REQUEST,
  payload: { id },
})
export const deleteWalletSuccess = () => ({
  type: types.DELETE_WALLET_SUCCESS,
})
export const deleteWalletFailure = (error: string) => ({
  type: types.DELETE_WALLET_FAILURE,
  payload: { error },
})
