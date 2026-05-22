import * as types from './constants';

const initialState = {
    user: null,
    packages: [],
    activities: [],
    loading: false,
    error: null,
};

const adminUserDetailsReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.FETCH_ADMIN_USER_DETAILS_REQUEST:
            return { ...state, loading: true, error: null };
        case types.FETCH_ADMIN_USER_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                user: { ...action.payload.user, id: action.payload.user._id || action.payload.user.id },
                packages: action.payload.packages || [],
                activities: action.payload.activities || [],
                error: null,
            };
        case types.FETCH_ADMIN_USER_DETAILS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default adminUserDetailsReducer;
