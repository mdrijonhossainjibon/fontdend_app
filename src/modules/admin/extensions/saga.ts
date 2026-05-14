import { call, put, takeLatest } from 'redux-saga/effects'
import * as types from './constants'
import * as actions from './actions'
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint'

function* fetchExtensionsSaga() {
  try {
    const { response }: APIResponse = yield call(API_CALL, {
      method: 'GET',
      url: '/admin/extensions',
    })

    const data = response as any
    yield put(actions.fetchExtensionsSuccess(data.extensions || [], data.stats || {}))
  } catch (error: any) {
    yield put(actions.fetchExtensionsFailure(error?.response?.data?.error || error.message))
  }
}

function* uploadExtensionSaga(action: any) {
  try {
    const { file, name, description, version, platform, changelog, icon } = action.payload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('version', version)
    formData.append('platform', platform)
    formData.append('changelog', changelog)
    if (icon) formData.append('icon', icon)

    const { response }: APIResponse = yield call(API_CALL, {
      method: 'POST',
      url: '/admin/extensions',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })

    yield put(actions.uploadExtensionSuccess())
    yield put(actions.fetchExtensionsRequest())
  } catch (error: any) {
    yield put(actions.uploadExtensionFailure(error?.response?.data?.error || error.message))
  }
}

function* updateExtensionSaga(action: any) {
  try {
    yield call(API_CALL, {
      method: 'PATCH',
      url: '/admin/extensions',
      data: action.payload.data,
    })

    yield put(actions.updateExtensionSuccess())
    yield put(actions.fetchExtensionsRequest())
  } catch (error: any) {
    yield put(actions.updateExtensionFailure(error?.response?.data?.error || error.message))
  }
}

function* deleteExtensionSaga(action: any) {
  try {
    yield call(API_CALL, {
      method: 'DELETE',
      url: `/admin/extensions/${action.payload.id}`,
    })

    yield put(actions.deleteExtensionSuccess())
    yield put(actions.fetchExtensionsRequest())
  } catch (error: any) {
    yield put(actions.deleteExtensionFailure(error?.response?.data?.error || error.message))
  }
}

export default function* adminExtensionsSaga() {
  yield takeLatest(types.FETCH_EXTENSIONS_REQUEST, fetchExtensionsSaga)
  yield takeLatest(types.UPLOAD_EXTENSION_REQUEST, uploadExtensionSaga)
  yield takeLatest(types.UPDATE_EXTENSION_REQUEST, updateExtensionSaga)
  yield takeLatest(types.DELETE_EXTENSION_REQUEST, deleteExtensionSaga)
}
