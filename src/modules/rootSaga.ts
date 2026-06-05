import { all } from 'redux-saga/effects';

import adminSaga from './admin/saga';
import adminPackagesSaga from './admin/packages/saga';
import adminExtensionsSaga from './admin/extensions/saga';
import adminSolutionsSaga from './admin/solutions/saga';
import adminOrdersSaga from './admin/orders/saga';
import adminTopupHistorySaga from './admin/topup-history/saga';
import adminHistorySaga from './admin/history/saga';
import adminObjectClassesSaga from './admin/object-classes/saga';
import adminHealthCheckSaga from './admin/health-check/saga';
import adminUploadModelSaga from './admin/upload-model/saga';
import adminCacheControlSaga from './admin/cache-control/saga';
import adminDatabaseSaga from './admin/database/saga';
import adminRedeemCodesSaga from './admin/redeem-codes/saga';
import adminPromoOffersSaga from './admin/promo-offers/saga';
import adminPricingPlansSaga from './admin/pricing-plans/saga';
import adminUserPackagesSaga from './admin/user-packages/saga';
import adminUserDetailsSaga from './admin/user-details/saga';
import adminPermissionsSaga from './admin/permissions/saga';
import dashboardSaga from './dashboard/saga';
import aiTrainingSaga from './ai-training/saga';
import authSaga from './auth/saga';
import settingsSaga from './settings/saga';
import cryptoSaga from './crypto/saga';
import topupSaga from './topup/saga';
import referralsSaga from './referrals/saga';
import pricingSaga from './pricing/saga';

export default function* rootSaga(): Generator {
    yield all([
        adminSaga(),
        adminPackagesSaga(),
        adminExtensionsSaga(),
        adminSolutionsSaga(),
        adminOrdersSaga(),
        adminTopupHistorySaga(),
        adminHistorySaga(),
        adminObjectClassesSaga(),
        adminHealthCheckSaga(),
        adminUploadModelSaga(),
        adminCacheControlSaga(),
        adminDatabaseSaga(),
        adminRedeemCodesSaga(),
        adminPromoOffersSaga(),
        adminPricingPlansSaga(),
        adminUserPackagesSaga(),
        adminUserDetailsSaga(),
        adminPermissionsSaga(),
        dashboardSaga(),
        aiTrainingSaga(),
        authSaga(),
        settingsSaga(),
        cryptoSaga(),
        topupSaga(),
        referralsSaga(),
        pricingSaga(),
    ]);
}
