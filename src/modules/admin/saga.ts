import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint';
import { toast } from "sonner";

function* fetchAdminStatsSaga(): Generator {
    const { response, status }: APIResponse = yield call(API_CALL, { method: 'GET', url: '/admin/dashboard' });

    if (response && status === 200) {
        const d = response.data || response;
        const mapped = {
            success: true,
            stats: {
                totalUsers: { value: d.users?.total || 0, change: '+0%', trend: 'up' },
                activePackages: { value: d.packages?.active || 0, change: '+0%', trend: 'up' },
                revenue: { monthlyRevenue: d.revenue?.monthly || 0, change: '+0%', trend: 'up' },
                totalDeposits: { value: d.system?.deposits || 0, change: '+0%', trend: 'up' },
            },
            recentDeposits: d.recentDeposits || [],
            systemMetrics: d.systemMetrics || {
                cpu: { status: 'healthy', usage: 0, cores: 0, temp: 0 },
                memory: { status: 'healthy', usage: 0, used: 0, total: 0 },
                storage: { status: 'healthy', usage: 0 },
            },
        };
        yield put(actions.fetchAdminStatsSuccess(mapped));
        return;
    }
    yield put(actions.fetchAdminStatsFailure('Failed to fetch dashboard stats'));
}

function* fetchAdminUsersSaga(action: any): Generator {
    try {
        const { searchTerm, statusFilter, page, limit } = action.payload;
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (statusFilter) params.append('status', statusFilter);
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: `/admin/users?${params.toString()}`
        });

        if (response && response.success) {
            const mappedUsers = response.users.map((u: any) => ({
                ...u,
                id: u._id || u.id,
            }));
            yield put(actions.fetchAdminUsersSuccess({ users: mappedUsers, pagination: response.pagination }));
        } else {
            yield put(actions.fetchAdminUsersFailure(response?.error || 'Failed to fetch users'));
            toast.error(response?.error || 'Failed to fetch users');
        }
    } catch (error) {
        yield put(actions.fetchAdminUsersFailure('Failed to fetch users'));
        toast.error('Failed to fetch users');
    }
}

function* updateAdminUserSaga(action: any): Generator {
    try {
        const { userId, name, balance, status: userStatus, role } = action.payload;
        const cleanBalance = typeof balance === 'string' ? parseFloat(balance.replace(/[^0-9.-]/g, '')) || 0 : balance;

        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'PATCH',
            url: `/admin/users/${userId}`,
            body: {
                name,
                balance: cleanBalance,
                status: userStatus,
                role
            }
        });

        if (response && response.success) {
            yield put(actions.updateAdminUserSuccess({ id: userId, name, balance, status: userStatus, role }));
            toast.success('User updated successfully');
        } else {
            yield put(actions.updateAdminUserFailure(response?.error || 'Failed to update user'));
            toast.error(response?.error || 'Failed to update user');
        }
    } catch (error) {
        yield put(actions.updateAdminUserFailure('Failed to update user'));
        toast.error('Failed to update user');
    }
}

function* deleteAdminUserSaga(action: any): Generator {
    try {
        const userId = action.payload;

        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'DELETE',
            url: `/admin/users/${userId}`
        });

        if (response && response.success) {
            yield put(actions.deleteAdminUserSuccess(userId));
            toast.success('User deleted successfully');
        } else {
            yield put(actions.deleteAdminUserFailure(response?.error || 'Failed to delete user'));
            toast.error(response?.error || 'Failed to delete user');
        }
    } catch (error) {
        yield put(actions.deleteAdminUserFailure('Failed to delete user'));
        toast.error('Failed to delete user');
    }
}

function* fetchAdminBotsSaga(action: any): Generator {
    try {
        const { searchTerm, statusFilter, page, limit } = action.payload || {};
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (statusFilter) params.append('status', statusFilter);
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());

        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: `/admin/bots?${params.toString()}`
        });

        if (response && response.success) {
            yield put(actions.fetchAdminBotsSuccess({ bots: response.bots, pagination: response.pagination }));
        } else {
            yield put(actions.fetchAdminBotsFailure(response?.error || 'Failed to fetch bots'));
            toast.error(response?.error || 'Failed to fetch bots');
        }
    } catch (error) {
        yield put(actions.fetchAdminBotsFailure('Failed to fetch bots'));
        toast.error('Failed to fetch bots');
    }
}

function* updateAdminBotSaga(action: any): Generator {
    try {
        const { botId, ...updateData } = action.payload;
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'PATCH',
            url: '/admin/bots',
            body: { botId, ...updateData }
        });

        if (response && response.success) {
            yield put(actions.updateAdminBotSuccess({ id: botId, ...updateData }));
            toast.success('Bot updated successfully');
        } else {
            yield put(actions.updateAdminBotFailure(response?.error || 'Failed to update bot'));
            toast.error(response?.error || 'Failed to update bot');
        }
    } catch (error) {
        yield put(actions.updateAdminBotFailure('Failed to update bot'));
        toast.error('Failed to update bot');
    }
}

function* deleteAdminBotSaga(action: any): Generator {
    try {
        const botId = action.payload;
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'DELETE',
            url: `/admin/bots?botId=${botId}`
        });

        if (response && response.success) {
            yield put(actions.deleteAdminBotSuccess(botId));
            toast.success('Bot deleted successfully');
        } else {
            yield put(actions.deleteAdminBotFailure(response?.error || 'Failed to delete bot'));
            toast.error(response?.error || 'Failed to delete bot');
        }
    } catch (error) {
        yield put(actions.deleteAdminBotFailure('Failed to delete bot'));
        toast.error('Failed to delete bot');
    }
}

// ── Email Templates ────────────────────────────────────────────────────────────
function* fetchEmailTemplatesSaga(): Generator {
    try {
        const { response }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: '/admin/email-templates'
        });
        if (response && response.success) {
            yield put(actions.fetchEmailTemplatesSuccess({ templates: response.templates || [] }));
        } else {
            yield put(actions.fetchEmailTemplatesFailure(response?.error || 'Failed to fetch templates'));
            toast.error(response?.error || 'Failed to fetch templates');
        }
    } catch (error) {
        yield put(actions.fetchEmailTemplatesFailure('Error fetching templates'));
        toast.error('Error fetching templates');
    }
}

function* createEmailTemplateSaga(action: any): Generator {
    try {
        const { response }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/admin/email-templates',
            body: action.payload
        });
        if (response && response.success) {
            yield put(actions.createEmailTemplateSuccess(response.template));
            toast.success('Template saved');
            yield put(actions.fetchEmailTemplatesRequest());
        } else {
            yield put(actions.createEmailTemplateFailure(response?.error || 'Failed to save'));
            toast.error(response?.error || 'Failed to save');
        }
    } catch (error) {
        yield put(actions.createEmailTemplateFailure('Error saving template'));
        toast.error('Error saving template');
    }
}

function* updateEmailTemplateSaga(action: any): Generator {
    try {
        const { id, ...body } = action.payload;
        const { response }: APIResponse = yield call(API_CALL, {
            method: 'PATCH',
            url: `/admin/email-templates/${id}`,
            body
        });
        if (response && response.success) {
            yield put(actions.updateEmailTemplateSuccess(response.template));
            toast.success('Template updated');
            yield put(actions.fetchEmailTemplatesRequest());
        } else {
            yield put(actions.updateEmailTemplateFailure(response?.error || 'Failed to update'));
            toast.error(response?.error || 'Failed to update');
        }
    } catch (error) {
        yield put(actions.updateEmailTemplateFailure('Error updating template'));
        toast.error('Error updating template');
    }
}

function* deleteEmailTemplateSaga(action: any): Generator {
    try {
        const id = action.payload;
        const { response }: APIResponse = yield call(API_CALL, {
            method: 'DELETE',
            url: `/admin/templates/email/${id}`
        });
        if (response && response.success) {
            yield put(actions.deleteEmailTemplateSuccess(id));
            toast.success('Template deleted');
            yield put(actions.fetchEmailTemplatesRequest());
        } else {
            yield put(actions.deleteEmailTemplateFailure(response?.error || 'Failed to delete'));
            toast.error(response?.error || 'Failed to delete');
        }
    } catch (error) {
        yield put(actions.deleteEmailTemplateFailure('Error deleting template'));
        toast.error('Error deleting template');
    }
}

// ── Admin Analytics ──────────────────────────────────────────────────────────
function* fetchAdminAnalyticsSaga(action: any): Generator {
    try {
        const days = action.payload || 30
        const { response }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: `/admin/analytics?days=${days}`
        })
        if (response && response.success) {
            yield put(actions.fetchAdminAnalyticsSuccess({
                chartData: response.chartData || [],
                metrics: response.metrics || {
                    totalCaptchas: { value: '0', change: '+0%' },
                    avgResponseTime: { value: '0s', change: '0s' },
                    successRate: { value: '0%', change: '+0%' },
                    apiCalls: { value: '0', change: '+0%' },
                    totalRevenue: { value: '$0.00', change: '+0%' },
                    activeApiKeys: { value: '0', change: '+0' },
                },
                topCountries: response.topCountries || [],
                captchaTypes: response.captchaTypes || [],
            }))
        } else {
            yield put(actions.fetchAdminAnalyticsFailure(response?.error || 'Failed to fetch analytics'))
            toast.error(response?.error || 'Failed to fetch analytics')
        }
    } catch (error: any) {
        yield put(actions.fetchAdminAnalyticsFailure(error?.message || 'Failed to fetch analytics'))
        toast.error('Failed to fetch analytics')
    }
}

function* clearAdminUsersSaga(action: any): Generator {
    try {
        const params = new URLSearchParams();
        params.append('clearAll', 'true');
        if (action.payload?.status) params.append('status', action.payload.status);

        const { response }: APIResponse = yield call(API_CALL, {
            method: 'DELETE',
            url: `/admin/users?${params.toString()}`
        });

        if (response && response.success) {
            yield put(actions.clearAdminUsersSuccess(response));
            toast.success('All users cleared successfully');
            yield put(actions.fetchAdminUsersRequest({ searchTerm: '', statusFilter: '', page: 1, limit: 10 }));
        } else {
            yield put(actions.clearAdminUsersFailure(response?.error || 'Failed to clear users'));
            toast.error(response?.error || 'Failed to clear users');
        }
    } catch (error) {
        yield put(actions.clearAdminUsersFailure('Failed to clear users'));
        toast.error('Failed to clear users');
    }
}

export default function* adminSaga() {
    yield takeLatest(types.FETCH_ADMIN_STATS_REQUEST, fetchAdminStatsSaga);
    yield takeLatest(types.FETCH_ADMIN_USERS_REQUEST, fetchAdminUsersSaga);
    yield takeLatest(types.UPDATE_ADMIN_USER_REQUEST, updateAdminUserSaga);
    yield takeLatest(types.DELETE_ADMIN_USER_REQUEST, deleteAdminUserSaga);
    yield takeLatest(types.CLEAR_ADMIN_USERS_REQUEST, clearAdminUsersSaga);

    // Bots
    yield takeLatest(types.FETCH_ADMIN_BOTS_REQUEST, fetchAdminBotsSaga);
    yield takeLatest(types.UPDATE_ADMIN_BOT_REQUEST, updateAdminBotSaga);
    yield takeLatest(types.DELETE_ADMIN_BOT_REQUEST, deleteAdminBotSaga);

    // Email Templates
    yield takeLatest(types.FETCH_EMAIL_TEMPLATES_REQUEST, fetchEmailTemplatesSaga);
    yield takeLatest(types.CREATE_EMAIL_TEMPLATE_REQUEST, createEmailTemplateSaga);
    yield takeLatest(types.UPDATE_EMAIL_TEMPLATE_REQUEST, updateEmailTemplateSaga);
    yield takeLatest(types.DELETE_EMAIL_TEMPLATE_REQUEST, deleteEmailTemplateSaga);

    // Analytics
    yield takeLatest(types.FETCH_ADMIN_ANALYTICS_REQUEST, fetchAdminAnalyticsSaga);
}
