import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import { API_CALL } from '@/lib/auth-fingerprint';

function* fetchObjectClassesSaga(): Generator {
    try {
        const { response, status }: any = yield (call as any)(API_CALL, {
            method: 'GET',
            url: '/admin/object-classes',
        });

        if (status === 200) {
            yield put(actions.fetchObjectClassesSuccess(response.objectClasses || []));
        } else {
            yield put(actions.fetchObjectClassesFailure(response?.error || 'Failed to fetch object classes'));
        }
    } catch (error: any) {
        yield put(actions.fetchObjectClassesFailure(error.message || 'An error occurred'));
    }
}

function* createObjectClassSaga(action: any): Generator {
    try {
        const { response, status }: any = yield (call as any)(API_CALL, {
            method: 'POST',
            url: '/admin/object-classes',
            body: action.payload,
        });

        if (status === 200 || status === 201) {
            yield put(actions.createObjectClassSuccess(response.data));
            yield put(actions.fetchObjectClassesRequest());
        } else {
            yield put(actions.createObjectClassFailure(response?.error || 'Failed to create object class'));
        }
    } catch (error: any) {
        yield put(actions.createObjectClassFailure(error.message || 'An error occurred'));
    }
}

function* updateObjectClassSaga(action: any): Generator {
    try {
        const { id, data } = action.payload;
        const { response, status }: any = yield (call as any)(API_CALL, {
            method: 'PATCH',
            url: `/admin/object-classes/${id}`,
            body: data,
        });

        if (status === 200) {
            yield put(actions.updateObjectClassSuccess(response.data));
            yield put(actions.fetchObjectClassesRequest());
        } else {
            yield put(actions.updateObjectClassFailure(response?.error || 'Failed to update object class'));
        }
    } catch (error: any) {
        yield put(actions.updateObjectClassFailure(error.message || 'An error occurred'));
    }
}

function* deleteObjectClassSaga(action: any): Generator {
    try {
        const id = action.payload;
        const { status }: any = yield (call as any)(API_CALL, {
            method: 'DELETE',
            url: `/admin/object-classes/${id}`,
        });

        if (status === 200) {
            yield put(actions.deleteObjectClassSuccess(id));
            yield put(actions.fetchObjectClassesRequest());
        } else {
            yield put(actions.deleteObjectClassFailure('Failed to delete object class'));
        }
    } catch (error: any) {
        yield put(actions.deleteObjectClassFailure(error.message || 'An error occurred'));
    }
}

export default function* adminObjectClassesSaga() {
    yield all([
        takeLatest(types.FETCH_OBJECT_CLASSES_REQUEST, fetchObjectClassesSaga),
        takeLatest(types.CREATE_OBJECT_CLASS_REQUEST, createObjectClassSaga),
        takeLatest(types.UPDATE_OBJECT_CLASS_REQUEST, updateObjectClassSaga),
        takeLatest(types.DELETE_OBJECT_CLASS_REQUEST, deleteObjectClassSaga),
    ]);
}
