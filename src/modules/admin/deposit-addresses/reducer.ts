import * as types from './constants'

export interface DepositAddress {
  _id: string
  userId: { _id: string; name: string; email: string }
  cryptoId: string
  networkId: string
  address: string
  privateKey: string
  isActive: boolean
  lastBalance: number
  createdAt: string
  lastUsedAt?: string
}

export interface DepositAddressesState {
  addresses: DepositAddress[]
  loading: boolean
  error: string | null
  total: number
  saving: boolean
  saveError: string | null
  deleting: boolean
  deleteError: string | null
  checkingBalance: boolean
  balanceResult: { id: string; balance: number; cryptoId: string } | null
  sweeping: boolean
  sweepResults: any[] | null
  sweepError: string | null
  masterWallets: any[]
  fetchingMasterWallets: boolean
  masterWalletsError: string | null
  addingMasterWallet: boolean
  addMasterWalletSuccess: boolean
  addMasterWalletError: string | null
  syncingAll: boolean
}

const initialState: DepositAddressesState = {
  addresses: [],
  loading: false,
  error: null,
  total: 0,
  saving: false,
  saveError: null,
  deleting: false,
  deleteError: null,
  checkingBalance: false,
  balanceResult: null,
  sweeping: false,
  sweepResults: null,
  sweepError: null,
  masterWallets: [],
  fetchingMasterWallets: false,
  masterWalletsError: null,
  addingMasterWallet: false,
  addMasterWalletSuccess: false,
  addMasterWalletError: null,
  syncingAll: false,
}

export default function adminDepositAddressesReducer(
  state = initialState,
  action: any,
): DepositAddressesState {
  switch (action.type) {
    // ── Fetch list ──────────────────────────────────────────────────────────
    case types.FETCH_DEPOSIT_ADDRESSES_REQUEST:
      return { ...state, loading: true, error: null, syncingAll: !!action.payload.sync }

    case types.FETCH_DEPOSIT_ADDRESSES_SUCCESS:
      return {
        ...state,
        loading: false,
        syncingAll: false,
        addresses: action.payload.addresses,
        total: action.payload.pagination?.total ?? action.payload.addresses.length,
      }

    case types.FETCH_DEPOSIT_ADDRESSES_FAILURE:
      return { ...state, loading: false, syncingAll: false, error: action.payload.error }

    // ── Update status ───────────────────────────────────────────────────────
    case types.UPDATE_DEPOSIT_ADDRESS_REQUEST:
      return { ...state, saving: true, saveError: null }

    case types.UPDATE_DEPOSIT_ADDRESS_SUCCESS:
      return { ...state, saving: false }

    case types.UPDATE_DEPOSIT_ADDRESS_FAILURE:
      return { ...state, saving: false, saveError: action.payload.error }

    // ── Delete ──────────────────────────────────────────────────────────────
    case types.DELETE_DEPOSIT_ADDRESS_REQUEST:
      return { ...state, deleting: true, deleteError: null }

    case types.DELETE_DEPOSIT_ADDRESS_SUCCESS:
      return { ...state, deleting: false }

    case types.DELETE_DEPOSIT_ADDRESS_FAILURE:
      return { ...state, deleting: false, deleteError: action.payload.error }

    // ── Balance check ───────────────────────────────────────────────────────
    case types.CHECK_BALANCE_REQUEST:
      return { ...state, checkingBalance: true, balanceResult: null }

    case types.CHECK_BALANCE_SUCCESS:
      return { ...state, checkingBalance: false, balanceResult: action.payload }

    case types.CHECK_BALANCE_FAILURE:
      return { ...state, checkingBalance: false }

    case types.CLEAR_BALANCE_RESULT:
      return { ...state, balanceResult: null }

    // ── Sweep ───────────────────────────────────────────────────────────────
    case types.SWEEP_REQUEST:
      return { ...state, sweeping: true, sweepResults: null, sweepError: null }

    case types.SWEEP_SUCCESS:
      return { ...state, sweeping: false, sweepResults: action.payload.results }

    case types.SWEEP_FAILURE:
      return { ...state, sweeping: false, sweepError: action.payload.error }

    case types.CLEAR_SWEEP_RESULTS:
      return { ...state, sweepResults: null, sweepError: null }

    // ── Master wallets ──────────────────────────────────────────────────────
    case types.FETCH_MASTER_WALLETS_REQUEST:
      return { ...state, fetchingMasterWallets: true, masterWalletsError: null }

    case types.FETCH_MASTER_WALLETS_SUCCESS:
      return { ...state, fetchingMasterWallets: false, masterWallets: action.payload.wallets }

    case types.FETCH_MASTER_WALLETS_FAILURE:
      return { ...state, fetchingMasterWallets: false, masterWalletsError: action.payload.error }

    // ── Add master wallet ───────────────────────────────────────────────────
    case types.ADD_MASTER_WALLET_REQUEST:
      return { ...state, addingMasterWallet: true, addMasterWalletSuccess: false, addMasterWalletError: null }

    case types.ADD_MASTER_WALLET_SUCCESS:
      return { ...state, addingMasterWallet: false, addMasterWalletSuccess: true }

    case types.ADD_MASTER_WALLET_FAILURE:
      return { ...state, addingMasterWallet: false, addMasterWalletError: action.payload.error }

    case types.CLEAR_ADD_MASTER_WALLET_STATUS:
      return { ...state, addMasterWalletSuccess: false, addMasterWalletError: null }

    default:
      return state
  }
}
