import * as types from './constants';

const initialState = {
    healthStatuses: [] as any[],
    loading: false,
    error: null as string | null,
};

type Action = { type: string; payload?: any };

const adminHealthCheckReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case types.FETCH_HEALTH_STATUSES_REQUEST:
            return { ...state, loading: true, error: null };
        case types.FETCH_HEALTH_STATUSES_SUCCESS:
            return { ...state, loading: false, healthStatuses: action.payload };
        case types.FETCH_HEALTH_STATUSES_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case types.RUN_HEALTH_CHECK_REQUEST:
            return { ...state, error: null };
        case types.RUN_HEALTH_CHECK_SUCCESS: {
            const statuses = action.payload;
            if (statuses.length === 1) {
                // Update only the single bot returned
                return {
                    ...state,
                    healthStatuses: state.healthStatuses.map((s: any) =>
                        s._id === statuses[0]._id ? statuses[0] : s
                    ),
                };
            }
            return { ...state, healthStatuses: statuses };
        }
        case types.RUN_HEALTH_CHECK_FAILURE:
            return { ...state, error: action.payload };

        default:
            return state;
    }
};

export default adminHealthCheckReducer;
