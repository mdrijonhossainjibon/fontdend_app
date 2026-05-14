import * as types from './constants'

export const fetchExtensionsRequest = () => ({
  type: types.FETCH_EXTENSIONS_REQUEST,
})
export const fetchExtensionsSuccess = (extensions: any[], stats: any) => ({
  type: types.FETCH_EXTENSIONS_SUCCESS,
  payload: { extensions, stats },
})
export const fetchExtensionsFailure = (error: string) => ({
  type: types.FETCH_EXTENSIONS_FAILURE,
  payload: { error },
})

export const uploadExtensionRequest = (data: {
  file: File
  name: string
  description: string
  version: string
  platform: string
  changelog: string
  icon?: string
}) => ({
  type: types.UPLOAD_EXTENSION_REQUEST,
  payload: data,
})
export const uploadExtensionSuccess = () => ({
  type: types.UPLOAD_EXTENSION_SUCCESS,
})
export const uploadExtensionFailure = (error: string) => ({
  type: types.UPLOAD_EXTENSION_FAILURE,
  payload: { error },
})

export const updateExtensionRequest = (data: any) => ({
  type: types.UPDATE_EXTENSION_REQUEST,
  payload: { data },
})
export const updateExtensionSuccess = () => ({
  type: types.UPDATE_EXTENSION_SUCCESS,
})
export const updateExtensionFailure = (error: string) => ({
  type: types.UPDATE_EXTENSION_FAILURE,
  payload: { error },
})

export const deleteExtensionRequest = (id: string) => ({
  type: types.DELETE_EXTENSION_REQUEST,
  payload: { id },
})
export const deleteExtensionSuccess = () => ({
  type: types.DELETE_EXTENSION_SUCCESS,
})
export const deleteExtensionFailure = (error: string) => ({
  type: types.DELETE_EXTENSION_FAILURE,
  payload: { error },
})
