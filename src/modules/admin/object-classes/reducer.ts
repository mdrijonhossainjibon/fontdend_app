import * as types from './constants';

const initialState = {
    objectClasses: [] as any[],
    loading: false,
    isSaving: false,
    error: null as string | null,
};

type Action = { type: string; payload?: any };

const adminObjectClassesReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case types.FETCH_OBJECT_CLASSES_REQUEST:
            return { ...state, loading: true, error: null };
        case types.FETCH_OBJECT_CLASSES_SUCCESS:
            return { ...state, loading: false, objectClasses: action.payload };
        case types.FETCH_OBJECT_CLASSES_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.CREATE_OBJECT_CLASS_REQUEST:
        case types.UPDATE_OBJECT_CLASS_REQUEST:
        case types.DELETE_OBJECT_CLASS_REQUEST:
            return { ...state, isSaving: true, error: null };

        case types.CREATE_OBJECT_CLASS_SUCCESS:
            return { ...state, isSaving: false, objectClasses: [...state.objectClasses, action.payload] };
        case types.UPDATE_OBJECT_CLASS_SUCCESS:
            return {
                ...state,
                isSaving: false,
                objectClasses: state.objectClasses.map((c: any) =>
                    c._id === action.payload._id ? action.payload : c
                ),
            };
        case types.DELETE_OBJECT_CLASS_SUCCESS:
            return {
                ...state,
                isSaving: false,
                objectClasses: state.objectClasses.filter((c: any) => c._id !== action.payload),
            };

        case types.CREATE_OBJECT_CLASS_FAILURE:
        case types.UPDATE_OBJECT_CLASS_FAILURE:
        case types.DELETE_OBJECT_CLASS_FAILURE:
            return { ...state, isSaving: false, error: action.payload };

        default:
            return state;
    }
};

export default adminObjectClassesReducer;
