import * as types from './constants';

export const fetchObjectClassesRequest = () => ({
    type: types.FETCH_OBJECT_CLASSES_REQUEST,
});

export const fetchObjectClassesSuccess = (objectClasses: any[]) => ({
    type: types.FETCH_OBJECT_CLASSES_SUCCESS,
    payload: objectClasses,
});

export const fetchObjectClassesFailure = (error: string) => ({
    type: types.FETCH_OBJECT_CLASSES_FAILURE,
    payload: error,
});

export const createObjectClassRequest = (data: { name: string }) => ({
    type: types.CREATE_OBJECT_CLASS_REQUEST,
    payload: data,
});

export const createObjectClassSuccess = (objectClass: any) => ({
    type: types.CREATE_OBJECT_CLASS_SUCCESS,
    payload: objectClass,
});

export const createObjectClassFailure = (error: string) => ({
    type: types.CREATE_OBJECT_CLASS_FAILURE,
    payload: error,
});

export const updateObjectClassRequest = (id: string, data: { name: string }) => ({
    type: types.UPDATE_OBJECT_CLASS_REQUEST,
    payload: { id, data },
});

export const updateObjectClassSuccess = (objectClass: any) => ({
    type: types.UPDATE_OBJECT_CLASS_SUCCESS,
    payload: objectClass,
});

export const updateObjectClassFailure = (error: string) => ({
    type: types.UPDATE_OBJECT_CLASS_FAILURE,
    payload: error,
});

export const deleteObjectClassRequest = (id: string) => ({
    type: types.DELETE_OBJECT_CLASS_REQUEST,
    payload: id,
});

export const deleteObjectClassSuccess = (id: string) => ({
    type: types.DELETE_OBJECT_CLASS_SUCCESS,
    payload: id,
});

export const deleteObjectClassFailure = (error: string) => ({
    type: types.DELETE_OBJECT_CLASS_FAILURE,
    payload: error,
});
