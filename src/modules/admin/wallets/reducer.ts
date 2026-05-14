import * as types from './constants'

export interface AdminWallet {
  _id: string
  address: string
  network: string
  label: string
  symbol: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminWalletsState {
  wallets: AdminWallet[]
  loading: boolean
  error: string | null
  saving: boolean
  saveError: string | null
  deleting: boolean
  deleteError: string | null
}

const initialState: AdminWalletsState = {
  wallets: [],
  loading: false,
  error: null,
  saving: false,
  saveError: null,
  deleting: false,
  deleteError: null,
}

export default function adminWalletsReducer(
  state = initialState,
  action: any,
): AdminWalletsState {
  switch (action.type) {
    case types.FETCH_WALLETS_REQUEST:
      return { ...state, loading: true, error: null }

    case types.FETCH_WALLETS_SUCCESS:
      return { ...state, loading: false, wallets: action.payload.wallets }

    case types.FETCH_WALLETS_FAILURE:
      return { ...state, loading: false, error: action.payload.error }

    case types.SAVE_WALLET_REQUEST:
      return { ...state, saving: true, saveError: null }

    case types.SAVE_WALLET_SUCCESS:
      return { ...state, saving: false }

    case types.SAVE_WALLET_FAILURE:
      return { ...state, saving: false, saveError: action.payload.error }

    case types.DELETE_WALLET_REQUEST:
      return { ...state, deleting: true, deleteError: null }

    case types.DELETE_WALLET_SUCCESS:
      return { ...state, deleting: false }

    case types.DELETE_WALLET_FAILURE:
      return { ...state, deleting: false, deleteError: action.payload.error }

    default:
      return state
  }
}
