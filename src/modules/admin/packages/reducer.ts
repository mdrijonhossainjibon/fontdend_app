import * as types from './constants'

export interface PricingPackage {
  id: string
  code: string
  type: 'count' | 'daily' | 'minute'
  price: string
  priceValue: number
  validity: string
  validityDays: number
  recognition: string
  count?: number
  dailyLimit?: number
  rateLimit?: number
  active: boolean
  isPromo: boolean
  sortOrder: number
}

export interface AdminPackagesState {
  packages: PricingPackage[]
  stats: any
  loading: boolean
  error: string | null
  saving: boolean
  saveError: string | null
  deleting: boolean
}

const initialState: AdminPackagesState = {
  packages: [],
  stats: null,
  loading: false,
  error: null,
  saving: false,
  saveError: null,
  deleting: false,
}

export default function adminPackagesReducer(
  state = initialState,
  action: any,
): AdminPackagesState {
  switch (action.type) {
    case types.FETCH_PACKAGES_REQUEST:
      return { ...state, loading: true, error: null }

    case types.FETCH_PACKAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        packages: action.payload.plans,
        stats: action.payload.stats,
      }

    case types.FETCH_PACKAGES_FAILURE:
      return { ...state, loading: false, error: action.payload.error }

    case types.CREATE_PACKAGE_REQUEST:
    case types.UPDATE_PACKAGE_REQUEST:
      return { ...state, saving: true, saveError: null }

    case types.CREATE_PACKAGE_SUCCESS:
    case types.UPDATE_PACKAGE_SUCCESS:
      return { ...state, saving: false }

    case types.CREATE_PACKAGE_FAILURE:
    case types.UPDATE_PACKAGE_FAILURE:
      return { ...state, saving: false, saveError: action.payload.error }

    case types.DELETE_PACKAGE_REQUEST:
      return { ...state, deleting: true }

    case types.DELETE_PACKAGE_SUCCESS:
    case types.DELETE_PACKAGE_FAILURE:
      return { ...state, deleting: false }

    default:
      return state
  }
}
