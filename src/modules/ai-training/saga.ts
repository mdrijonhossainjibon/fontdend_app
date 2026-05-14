import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint';

const getAiTrainingState = (state: any) => state.aiTraining;

function* fetchKolotiCacheSaga(action: any): Generator {
    try {
        const { search, page, limit } = action.payload;
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        const { response, status }: any = yield (call as any)(API_CALL, {
            method: 'GET',
            url: `/admin/ai-training/koloti-cache?${params.toString()}`
        });

        if (status === 200) {
            yield put(actions.fetchKolotiCacheSuccess(response));
        } else {
            yield put(actions.fetchKolotiCacheFailure(response?.error || 'Failed to fetch records'));
        }
    } catch (error: any) {
        yield put(actions.fetchKolotiCacheFailure(error.message || 'An error occurred'));
    }
}

function* deleteKolotiCacheSaga(action: any): Generator {
    try {
        const recordId = action.payload;
        const { response, status }: any = yield (call as any)(API_CALL, {
            method: 'DELETE',
            url: `/admin/ai-training/koloti-cache?recordId=${recordId}`
        });

        if (status === 200) {
            yield put(actions.deleteKolotiCacheSuccess(recordId));
            const state: any = yield select(getAiTrainingState);
            yield put(actions.fetchKolotiCacheRequest({
                search: '',
                page: state.pagination.page,
                limit: state.pagination.limit
            }));
        } else {
            yield put(actions.deleteKolotiCacheFailure(response?.error || 'Failed to delete record'));
        }
    } catch (error: any) {
        yield put(actions.deleteKolotiCacheFailure(error.message || 'An error occurred'));
    }
}

function* updateKolotiCacheAnswerSaga(action: any): Generator {
    try {
        const { recordId, answer } = action.payload;
        const { response, status }: any = yield (call as any)(API_CALL, {
            method: 'PATCH',
            url: '/admin/ai-training/koloti-cache',
            body: { recordId, answer }
        });

        if (status === 200) {
            yield put(actions.updateKolotiCacheAnswerSuccess({ recordId, answer }));
        } else {
            yield put(actions.updateKolotiCacheAnswerFailure(response?.error || 'Failed to update answer'));
        }
    } catch (error: any) {
        yield put(actions.updateKolotiCacheAnswerFailure(error.message || 'An error occurred'));
    }
}

// Bot Endpoints Sagas
function* fetchBotEndpointsSaga(): Generator {
    try {
        const { response, status }: any = yield (call as any)(API_CALL, {
            method: 'GET',
            url: '/admin/bot-endpoints'
        });

        if (status === 200) {
            yield put(actions.fetchBotEndpointsSuccess(response.endpoints || []));
        } else {
            yield put(actions.fetchBotEndpointsFailure(response?.error || 'Failed to fetch bot endpoints'));
        }
    } catch (error: any) {
        yield put(actions.fetchBotEndpointsFailure(error.message || 'An error occurred'));
    }
}

function* createBotEndpointSaga(action: any): Generator {
    try {
        const { response, status }: any = yield (call as any)(API_CALL, {
            method: 'POST',
            url: '/admin/bot-endpoints',
            body: action.payload
        });

        if (status === 200 || status === 201) {
            yield put(actions.createBotEndpointSuccess(response.endpoint));
        } else {
            yield put(actions.createBotEndpointFailure(response?.error || 'Failed to create bot endpoint'));
        }
    } catch (error: any) {
        yield put(actions.createBotEndpointFailure(error.message || 'An error occurred'));
    }
}

function* updateBotEndpointSaga(action: any): Generator {
    try {
        const { id, endpoint } = action.payload;
        const { response, status }: any = yield (call as any)(API_CALL, {
            method: 'PUT',
            url: `/admin/bot-endpoints/${id}`,
            body: endpoint
        });

        if (status === 200) {
            yield put(actions.updateBotEndpointSuccess(response.endpoint));
        } else {
            yield put(actions.updateBotEndpointFailure(response?.error || 'Failed to update bot endpoint'));
        }
    } catch (error: any) {
        yield put(actions.updateBotEndpointFailure(error.message || 'An error occurred'));
    }
}

function* deleteBotEndpointSaga(action: any): Generator {
    try {
        const id = action.payload;
        const { response, status }: any = yield (call as any)(API_CALL, {
            method: 'DELETE',
            url: `/admin/bot-endpoints/${id}`
        });

        if (status === 200) {
            yield put(actions.deleteBotEndpointSuccess(id));
        } else {
            yield put(actions.deleteBotEndpointFailure(response?.error || 'Failed to delete bot endpoint'));
        }
    } catch (error: any) {
        yield put(actions.deleteBotEndpointFailure(error.message || 'An error occurred'));
    }
}

function* refreshBotClassesSaga(action: any): Generator {
    try {
        const endpoint = action.payload;

        const { response, status }: any = yield (call as any)(API_CALL, {
            method: 'POST',
            url: '/admin/bot-endpoints/refresh',
            body: {
                protocol: endpoint.protocol,
                endpoint: endpoint.endpoint,
                port: endpoint.port
            }
        });

        if (status === 200) {
            yield put(actions.refreshBotClassesSuccess(response.data));
        } else {
            yield put(actions.refreshBotClassesFailure(response?.error || 'Failed to refresh classes'));
        }
    } catch (error: any) {
        yield put(actions.refreshBotClassesFailure(error.message || 'An error occurred'));
    }
}

export default function* aiTrainingSaga() {
    yield all([
        takeLatest(types.FETCH_KOLOTI_CACHE_REQUEST, fetchKolotiCacheSaga),
        takeLatest(types.DELETE_KOLOTI_CACHE_REQUEST, deleteKolotiCacheSaga),
        takeLatest(types.UPDATE_KOLOTI_CACHE_ANSWER_REQUEST, updateKolotiCacheAnswerSaga),
        takeLatest(types.FETCH_BOT_ENDPOINTS_REQUEST, fetchBotEndpointsSaga),
        takeLatest(types.CREATE_BOT_ENDPOINT_REQUEST, createBotEndpointSaga),
        takeLatest(types.UPDATE_BOT_ENDPOINT_REQUEST, updateBotEndpointSaga),
        takeLatest(types.DELETE_BOT_ENDPOINT_REQUEST, deleteBotEndpointSaga),
        takeLatest(types.REFRESH_BOT_CLASSES_REQUEST, refreshBotClassesSaga),
    ]);
}
