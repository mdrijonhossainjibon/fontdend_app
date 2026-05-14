export interface DatabaseState {
    collections: any[]
    stats: {
        totalCollections: number
        totalDocuments: number
        totalSize: number
        totalStorageSize: number
        totalIndexSize: number
        databaseName: string
        avgObjSize: number
    }
    loading: boolean
    error: string | null
    backupResult: { collectionName: string; data: any } | null
    backupError: string | null
}

const initialState: DatabaseState = {
    collections: [],
    stats: {
        totalCollections: 0,
        totalDocuments: 0,
        totalSize: 0,
        totalStorageSize: 0,
        totalIndexSize: 0,
        databaseName: '',
        avgObjSize: 0,
    },
    loading: false,
    error: null,
    backupResult: null,
    backupError: null,
}

const adminDatabaseReducer = (state = initialState, action: any): DatabaseState => {
    switch (action.type) {
        case 'FETCH_DATABASE_STATS_REQUEST':
            return { ...state, loading: true, error: null }
        case 'FETCH_DATABASE_STATS_SUCCESS':
            return { ...state, loading: false, ...action.payload, error: null }
        case 'FETCH_DATABASE_STATS_FAILURE':
            return { ...state, loading: false, error: action.payload }
        case 'BACKUP_COLLECTION_REQUEST':
            return { ...state, backupResult: null, backupError: null }
        case 'BACKUP_COLLECTION_SUCCESS':
            return { ...state, backupResult: action.payload, backupError: null }
        case 'BACKUP_COLLECTION_FAILURE':
            return { ...state, backupResult: null, backupError: action.payload }
        case 'CLEAR_BACKUP_RESULT':
            return { ...state, backupResult: null, backupError: null }
        default:
            return state
    }
}

export default adminDatabaseReducer
