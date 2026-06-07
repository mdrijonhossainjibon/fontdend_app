import {
    FETCH_SOURCE_INFO_REQUEST,
    FETCH_SOURCE_INFO_SUCCESS,
    FETCH_SOURCE_INFO_FAILURE,
    CONNECT_TARGET_REQUEST,
    CONNECT_TARGET_SUCCESS,
    CONNECT_TARGET_FAILURE,
    TRANSFER_DATABASES_REQUEST,
    TRANSFER_DATABASES_SUCCESS,
    TRANSFER_DATABASES_FAILURE,
    RESET_TRANSFER,
} from './constants'

export interface DatabaseInfo {
    name: string
    size?: string
    collections?: number
}

export interface SourceInfo {
    host: string
    port: number
    dbName: string
    version?: string
}

export interface TransferResult {
    db: string
    status: string
    error?: string
}

export interface DatabaseTransferState {
    sourceInfo: SourceInfo | null
    sourceLoading: boolean
    sourceError: string | null
    connecting: boolean
    connected: boolean
    databases: DatabaseInfo[]
    connectError: string | null
    transferring: boolean
    transferComplete: boolean
    transferResults: TransferResult[] | null
    transferError: string | null
    logs: { type: string; message: string; timestamp: string }[]
}

const initialState: DatabaseTransferState = {
    sourceInfo: null,
    sourceLoading: false,
    sourceError: null,
    connecting: false,
    connected: false,
    databases: [],
    connectError: null,
    transferring: false,
    transferComplete: false,
    transferResults: null,
    transferError: null,
    logs: [],
}

const databaseTransferReducer = (state = initialState, action: any): DatabaseTransferState => {
    switch (action.type) {
        case FETCH_SOURCE_INFO_REQUEST:
            return { ...state, sourceLoading: true, sourceError: null }
        case FETCH_SOURCE_INFO_SUCCESS:
            return { ...state, sourceInfo: action.payload, sourceLoading: false, sourceError: null }
        case FETCH_SOURCE_INFO_FAILURE:
            return { ...state, sourceLoading: false, sourceError: action.error }

        case CONNECT_TARGET_REQUEST:
            return { ...state, connecting: true, connectError: null }
        case CONNECT_TARGET_SUCCESS:
            return { ...state, connecting: false, connected: true, databases: action.payload.databases || [], connectError: null }
        case CONNECT_TARGET_FAILURE:
            return { ...state, connecting: false, connectError: action.error }

        case TRANSFER_DATABASES_REQUEST:
            return { ...state, transferring: true, transferComplete: false, transferError: null }
        case TRANSFER_DATABASES_SUCCESS:
            return { ...state, transferring: false, transferComplete: true, transferResults: action.payload.results || [], transferError: null }
        case TRANSFER_DATABASES_FAILURE:
            return { ...state, transferring: false, transferError: action.error }

        case RESET_TRANSFER:
            return {
                ...state,
                connecting: false,
                connected: false,
                databases: [],
                connectError: null,
                transferring: false,
                transferComplete: false,
                transferResults: null,
                transferError: null,
                logs: [],
            }

        default:
            return state
    }
}

export default databaseTransferReducer
