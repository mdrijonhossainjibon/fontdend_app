import { call, put, takeLatest, all } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint';
import { message } from 'antd';

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
            message.error(response?.error || 'Failed to fetch users');
        }
    } catch (error) {
        yield put(actions.fetchAdminUsersFailure('Failed to fetch users'));
        message.error('Failed to fetch users');
    }
}

function* updateAdminUserSaga(action: any): Generator {
    try {
        const { userId, name, balance, status: userStatus } = action.payload;
        const cleanBalance = typeof balance === 'string' ? parseFloat(balance.replace(/[^0-9.-]/g, '')) || 0 : balance;

        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'PATCH',
            url: `/admin/users/${userId}`,
            body: {
                name,
                balance: cleanBalance,
                status: userStatus
            }
        });

        if (response && response.success) {
            yield put(actions.updateAdminUserSuccess({ id: userId, name, balance, status: userStatus }));
            message.success('User updated successfully');
            // Optimistic update done in reducer, and success message shown.
            // Alternatively, we could refetch users if needed, but reducer update is faster.
            // If the API returns the updated user, we should use that instead.
            // Assuming response usually sends back updated data, but here user just set success.
            // But the reducer uses action.payload, which is what we sent.
            // The component also called fetchUsers() after update.
            // Let's refetch users to be safe and consistent with the previous logic.
            // Or better, just update the state locally as I did in the reducer.
        } else {
            yield put(actions.updateAdminUserFailure(response?.error || 'Failed to update user'));
            message.error(response?.error || 'Failed to update user');
        }
    } catch (error) {
        yield put(actions.updateAdminUserFailure('Failed to update user'));
        message.error('Failed to update user');
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
            message.success('User deleted successfully');
        } else {
            yield put(actions.deleteAdminUserFailure(response?.error || 'Failed to delete user'));
            message.error(response?.error || 'Failed to delete user');
        }
    } catch (error) {
        yield put(actions.deleteAdminUserFailure('Failed to delete user'));
        message.error('Failed to delete user');
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
            message.error(response?.error || 'Failed to fetch bots');
        }
    } catch (error) {
        yield put(actions.fetchAdminBotsFailure('Failed to fetch bots'));
        message.error('Failed to fetch bots');
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
            message.success('Bot updated successfully');
        } else {
            yield put(actions.updateAdminBotFailure(response?.error || 'Failed to update bot'));
            message.error(response?.error || 'Failed to update bot');
        }
    } catch (error) {
        yield put(actions.updateAdminBotFailure('Failed to update bot'));
        message.error('Failed to update bot');
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
            message.success('Bot deleted successfully');
        } else {
            yield put(actions.deleteAdminBotFailure(response?.error || 'Failed to delete bot'));
            message.error(response?.error || 'Failed to delete bot');
        }
    } catch (error) {
        yield put(actions.deleteAdminBotFailure('Failed to delete bot'));
        message.error('Failed to delete bot');
    }
}

function* fetchAdminWalletsSaga(): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: '/admin/wallet'
        });

        if (response && response.success) {
            yield put(actions.fetchAdminWalletsSuccess(response.wallets));
        } else {
            yield put(actions.fetchAdminWalletsFailure(response?.error || 'Failed to fetch wallets'));
        }
    } catch (error) {
        yield put(actions.fetchAdminWalletsFailure('Failed to fetch admin wallets'));
    }
}

function* createAdminWalletSaga(action: any): Generator {
    try {
        const walletEntries = Array.isArray(action.payload) ? action.payload : [action.payload];

        const results: any[] = yield all(walletEntries.map((entry: any) =>
            call(API_CALL, {
                method: 'POST',
                url: '/admin/wallet',
                body: entry
            })
        ));

        const successCount = results.filter(r => r.response && r.response.success).length;

        if (successCount > 0) {
            yield put(actions.createAdminWalletSuccess(results));
            message.success(`Created ${successCount} wallet entries`);
            yield put(actions.fetchAdminWalletsRequest());
        } else {
            yield put(actions.createAdminWalletFailure('Failed to create wallet entries'));
            message.error('Failed to create wallet entries');
        }
    } catch (error) {
        yield put(actions.createAdminWalletFailure('Error saving wallets'));
        message.error('Error saving wallets');
    }
}

function* deleteAdminWalletSaga(action: any): Generator {
    try {
        const id = action.payload;
        const { response }: APIResponse = yield call(API_CALL, {
            method: 'DELETE',
            url: `/admin/wallet?id=${id}`
        });

        if (response && response.success) {
            yield put(actions.deleteAdminWalletSuccess(id));
            message.success('Wallet deleted');
            yield put(actions.fetchAdminWalletsRequest());
        } else {
            yield put(actions.deleteAdminWalletFailure(response?.error || 'Failed to delete'));
            message.error(response?.error || 'Failed to delete');
        }
    } catch (error) {
        yield put(actions.deleteAdminWalletFailure('Error deleting wallet'));
        message.error('Error deleting wallet');
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
            message.error(response?.error || 'Failed to fetch templates');
        }
    } catch (error) {
        yield put(actions.fetchEmailTemplatesFailure('Error fetching templates'));
        message.error('Error fetching templates');
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
            message.success('Template saved');
            yield put(actions.fetchEmailTemplatesRequest());
        } else {
            yield put(actions.createEmailTemplateFailure(response?.error || 'Failed to save'));
            message.error(response?.error || 'Failed to save');
        }
    } catch (error) {
        yield put(actions.createEmailTemplateFailure('Error saving template'));
        message.error('Error saving template');
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
            message.success('Template updated');
            yield put(actions.fetchEmailTemplatesRequest());
        } else {
            yield put(actions.updateEmailTemplateFailure(response?.error || 'Failed to update'));
            message.error(response?.error || 'Failed to update');
        }
    } catch (error) {
        yield put(actions.updateEmailTemplateFailure('Error updating template'));
        message.error('Error updating template');
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
            message.success('Template deleted');
            yield put(actions.fetchEmailTemplatesRequest());
        } else {
            yield put(actions.deleteEmailTemplateFailure(response?.error || 'Failed to delete'));
            message.error(response?.error || 'Failed to delete');
        }
    } catch (error) {
        yield put(actions.deleteEmailTemplateFailure('Error deleting template'));
        message.error('Error deleting template');
    }
}

export default function* adminSaga() {
    yield takeLatest(types.FETCH_ADMIN_STATS_REQUEST, fetchAdminStatsSaga);
    yield takeLatest(types.FETCH_ADMIN_USERS_REQUEST, fetchAdminUsersSaga);
    yield takeLatest(types.UPDATE_ADMIN_USER_REQUEST, updateAdminUserSaga);
    yield takeLatest(types.DELETE_ADMIN_USER_REQUEST, deleteAdminUserSaga);

    // Bots
    yield takeLatest(types.FETCH_ADMIN_BOTS_REQUEST, fetchAdminBotsSaga);
    yield takeLatest(types.UPDATE_ADMIN_BOT_REQUEST, updateAdminBotSaga);
    yield takeLatest(types.DELETE_ADMIN_BOT_REQUEST, deleteAdminBotSaga);
    // Wallets
    yield takeLatest(types.FETCH_ADMIN_WALLETS_REQUEST, fetchAdminWalletsSaga);
    yield takeLatest(types.CREATE_ADMIN_WALLET_REQUEST, createAdminWalletSaga);
    yield takeLatest(types.DELETE_ADMIN_WALLET_REQUEST, deleteAdminWalletSaga);
    // Email Templates
    yield takeLatest(types.FETCH_EMAIL_TEMPLATES_REQUEST, fetchEmailTemplatesSaga);
    yield takeLatest(types.CREATE_EMAIL_TEMPLATE_REQUEST, createEmailTemplateSaga);
    yield takeLatest(types.UPDATE_EMAIL_TEMPLATE_REQUEST, updateEmailTemplateSaga);
    yield takeLatest(types.DELETE_EMAIL_TEMPLATE_REQUEST, deleteEmailTemplateSaga);
}

