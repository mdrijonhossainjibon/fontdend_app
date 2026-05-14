import * as types from './constants'

export interface AdminExtension {
  _id: string
  name: string
  description: string
  version: string
  platform: string
  changelog: string
  fileName: string
  originalName: string
  fileSize: number
  fileType: string
  downloadUrl: string
  iconUrl?: string
  downloads: number
  isActive: boolean
  createdAt: string
}

export interface AdminExtensionsStats {
  total: number
  active: number
  totalDownloads: number
}

export interface AdminExtensionsState {
  extensions: AdminExtension[]
  stats: AdminExtensionsStats | null
  loading: boolean
  error: string | null
  uploading: boolean
  uploadError: string | null
  saving: boolean
  saveError: string | null
  deleting: boolean
  deleteError: string | null
}

const initialState: AdminExtensionsState = {
  extensions: [],
  stats: null,
  loading: false,
  error: null,
  uploading: false,
  uploadError: null,
  saving: false,
  saveError: null,
  deleting: false,
  deleteError: null,
}

export default function adminExtensionsReducer(
  state = initialState,
  action: any,
): AdminExtensionsState {
  switch (action.type) {
    case types.FETCH_EXTENSIONS_REQUEST:
      return { ...state, loading: true, error: null }

    case types.FETCH_EXTENSIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        extensions: action.payload.extensions,
        stats: action.payload.stats,
      }

    case types.FETCH_EXTENSIONS_FAILURE:
      return { ...state, loading: false, error: action.payload.error }

    case types.UPLOAD_EXTENSION_REQUEST:
      return { ...state, uploading: true, uploadError: null }

    case types.UPLOAD_EXTENSION_SUCCESS:
      return { ...state, uploading: false }

    case types.UPLOAD_EXTENSION_FAILURE:
      return { ...state, uploading: false, uploadError: action.payload.error }

    case types.UPDATE_EXTENSION_REQUEST:
      return { ...state, saving: true, saveError: null }

    case types.UPDATE_EXTENSION_SUCCESS:
      return { ...state, saving: false }

    case types.UPDATE_EXTENSION_FAILURE:
      return { ...state, saving: false, saveError: action.payload.error }

    case types.DELETE_EXTENSION_REQUEST:
      return { ...state, deleting: true, deleteError: null }

    case types.DELETE_EXTENSION_SUCCESS:
      return { ...state, deleting: false }

    case types.DELETE_EXTENSION_FAILURE:
      return { ...state, deleting: false, deleteError: action.payload.error }

    default:
      return state
  }
}
