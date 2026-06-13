import { call, put, takeLatest } from 'redux-saga/effects'
import { API_CALL, APIResponse } from '@/lib/auth-fingerprint'
import { toast } from 'sonner'
import * as types from './constants'
import * as actions from './actions'

// ── Active Package ──
function* fetchActivePackageSaga(): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: '/topup/active-package',
        })
        if (status === 200 && (response as any).success) {
            const { balance, activePackage, pendingDeposit } = response as any
            yield put(actions.fetchActivePackageSuccess({ balance, activePackage, pendingDeposit }))
        } else {
            yield put(
                actions.fetchActivePackageFailure((response as any)?.error || 'Failed to load package info')
            )
        }
    } catch (error: any) {
        yield put(actions.fetchActivePackageFailure(error.message))
    }
}

// ── Check Pending Deposit (lightweight) ──
function* checkPendingDepositSaga(): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: '/topup/pending-deposit',
        })
        if (status === 200 && (response as any).success) {
            yield put(actions.checkPendingDepositSuccess((response as any).pendingDeposit || null))
        } else {
            yield put(actions.checkPendingDepositFailure(null))
        }
    } catch (error: any) {
        yield put(actions.checkPendingDepositFailure(null))
    }
}

// ── Buy Credits ──
function* buyCreditsSaga(action: ReturnType<typeof actions.buyCreditsRequest>): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/topup/credits',
            body: action.payload,
        })
        if (status === 200 && (response as any).success) {
            yield put(actions.buyCreditsSuccess(response as any))
            // Refresh package data after purchase
            yield put(actions.fetchActivePackageRequest())
        } else {
            yield put(
                actions.buyCreditsFailure((response as any)?.error || 'Purchase failed')
            )
        }
    } catch (error: any) {
        yield put(actions.buyCreditsFailure(error.message))
    }
}

// ── Redeem Code ──
function* redeemCodeSaga(action: ReturnType<typeof actions.redeemCodeRequest>): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/topup/redeem',
            body: action.payload,
        })
        if (status === 200 && (response as any).success) {
            yield put(actions.redeemCodeSuccess((response as any).data))
            // Refresh package data after redeem
            yield put(actions.fetchActivePackageRequest())
        } else {
            yield put(
                actions.redeemCodeFailure((response as any)?.error || 'Failed to redeem code')
            )
        }
    } catch (error: any) {
        yield put(actions.redeemCodeFailure(error.message))
    }
}

// ── History ──
function* fetchHistorySaga(): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: '/topup/history',
            params: { _t: Date.now() },
        })
        if (status === 200 && (response as any).success) {
            yield put(actions.fetchHistorySuccess((response as any).data))
        } else {
            yield put(
                actions.fetchHistoryFailure((response as any)?.error || 'Failed to load history')
            )
        }
    } catch (error: any) {
        yield put(actions.fetchHistoryFailure(error.message))
    }
}

// ── Cryptomus Invoice ──
function* createCryptomusInvoiceSaga(action: ReturnType<typeof actions.createCryptomusInvoiceRequest>): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/topup/cryptomus/create-invoice',
            body: action.payload,
        })
        if (status === 200 && (response as any).success) {
            const data = (response as any).data
            toast.success('Invoice created successfully')
            yield put(actions.createCryptomusInvoiceSuccess({
                url: data.url,
                invoiceId: data.invoiceId,
                walletAddress: data.walletAddress,
                network: data.network,
                paymentAmount: data.paymentAmount,
            }))
        } else {
            const msg = (response as any)?.detail || (response as any)?.error || 'Failed to create payment'
            toast.error(msg)
            yield put(actions.createCryptomusInvoiceFailure(msg))
            yield put(actions.resetCryptomusStatus())
        }
    } catch (error: any) {
        toast.error(error.message)
        yield put(actions.createCryptomusInvoiceFailure(error.message))
        yield put(actions.resetCryptomusStatus())
    }
}

// ── Cancel Deposit ──
function* cancelDepositSaga(action: ReturnType<typeof actions.cancelDepositRequest>): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/topup/cancel-deposit',
            body: { depositId: action.payload },
        })
        if (status === 200 && (response as any).success) {
            toast.success('Deposit cancelled')
            yield put(actions.cancelDepositSuccess((response as any).data))
            yield put(actions.fetchHistoryRequest())
        } else {
            const msg = (response as any)?.error || 'Failed to cancel deposit'
            toast.error(msg)
            yield put(actions.cancelDepositFailure(msg))
        }
    } catch (error: any) {
        toast.error(error.message)
        yield put(actions.cancelDepositFailure(error.message))
    }
}

// ── Fetch Invoice ──
function* fetchInvoiceSaga(action: ReturnType<typeof actions.fetchInvoiceRequest>): Generator {
    try {
        const invoiceId = action.payload as string
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: `/topup/invoice/${invoiceId}`,
        })
        if (status === 200 && (response as any).success) {
            yield put(actions.fetchInvoiceSuccess((response as any).data))
        } else {
            yield put(actions.fetchInvoiceFailure((response as any)?.error || 'Invoice not found'))
        }
    } catch (error: any) {
        yield put(actions.fetchInvoiceFailure(error.message))
    }
}

// ── Check Payment (Cryptomus) ──
function* checkTopupPaymentSaga(): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/topup/check-payment',
        })
        if (status === 200 && (response as any).success) {
            yield put(actions.checkTopupPaymentSuccess((response as any).data || response as any))
        } else {
            yield put(actions.checkTopupPaymentFailure((response as any)?.error || 'Check failed'))
        }
    } catch (error: any) {
        yield put(actions.checkTopupPaymentFailure(error.message))
    }
}

// ── Root Saga ──
export default function* topupSaga() {
    yield takeLatest(types.FETCH_ACTIVE_PACKAGE_REQUEST, fetchActivePackageSaga)
    yield takeLatest(types.BUY_CREDITS_REQUEST, buyCreditsSaga)
    yield takeLatest(types.REDEEM_CODE_REQUEST, redeemCodeSaga)
    yield takeLatest(types.FETCH_HISTORY_REQUEST, fetchHistorySaga)
    yield takeLatest(types.CREATE_CRYPTOMUS_INVOICE_REQUEST, createCryptomusInvoiceSaga)
    yield takeLatest(types.FETCH_INVOICE_REQUEST, fetchInvoiceSaga)
    yield takeLatest(types.CHECK_PENDING_DEPOSIT_REQUEST, checkPendingDepositSaga)
    yield takeLatest(types.CANCEL_DEPOSIT_REQUEST, cancelDepositSaga)
    yield takeLatest(types.CHECK_TOPUP_PAYMENT_REQUEST, checkTopupPaymentSaga)
}
