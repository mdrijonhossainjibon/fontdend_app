export const fetchDatabaseStatsRequest = () => ({ type: 'FETCH_DATABASE_STATS_REQUEST' })
export const fetchDatabaseStatsSuccess = (payload: any) => ({ type: 'FETCH_DATABASE_STATS_SUCCESS', payload })
export const fetchDatabaseStatsFailure = (error: string) => ({ type: 'FETCH_DATABASE_STATS_FAILURE', payload: error })

export const validateCollectionRequest = (collection: string) => ({ type: 'VALIDATE_COLLECTION_REQUEST', payload: { collection } })
export const validateCollectionSuccess = (payload: any) => ({ type: 'VALIDATE_COLLECTION_SUCCESS', payload })
export const validateCollectionFailure = (error: string) => ({ type: 'VALIDATE_COLLECTION_FAILURE', payload: error })

export const repairCollectionRequest = (collection: string) => ({ type: 'REPAIR_COLLECTION_REQUEST', payload: { collection } })
export const repairCollectionSuccess = (payload: any) => ({ type: 'REPAIR_COLLECTION_SUCCESS', payload })
export const repairCollectionFailure = (error: string) => ({ type: 'REPAIR_COLLECTION_FAILURE', payload: error })

export const deleteDatabaseIndexRequest = (collection: string, index: string) => ({ type: 'DELETE_INDEX_REQUEST', payload: { collection, index } })
export const deleteDatabaseIndexSuccess = (payload: any) => ({ type: 'DELETE_INDEX_SUCCESS', payload })
export const deleteDatabaseIndexFailure = (error: string) => ({ type: 'DELETE_INDEX_FAILURE', payload: error })

export const backupCollectionRequest = (collectionName: string) => ({ type: 'BACKUP_COLLECTION_REQUEST', payload: { collectionName } })
export const backupCollectionSuccess = (payload: { collectionName: string; result: any }) => ({ type: 'BACKUP_COLLECTION_SUCCESS', payload })
export const backupCollectionFailure = (error: string) => ({ type: 'BACKUP_COLLECTION_FAILURE', payload: error })
export const clearBackupResult = () => ({ type: 'CLEAR_BACKUP_RESULT' })
