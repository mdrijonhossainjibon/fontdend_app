import { combineReducers } from 'redux';

import adminReducer from './admin/reducer';
import adminPackagesReducer from './admin/packages/reducer';
import adminExtensionsReducer from './admin/extensions/reducer';
import adminSolutionsReducer from './admin/solutions/reducer';
import adminWalletsReducer from './admin/wallets/reducer';
import adminDepositAddressesReducer from './admin/deposit-addresses/reducer';
import adminTopupHistoryReducer from './admin/topup-history/reducer';
import adminHistoryReducer from './admin/history/reducer';
import adminObjectClassesReducer from './admin/object-classes/reducer';
import adminHealthCheckReducer from './admin/health-check/reducer';
import adminUploadModelReducer from './admin/upload-model/reducer';
import adminCacheControlReducer from './admin/cache-control/reducer';
import adminDatabaseReducer from './admin/database/reducer';
import adminRedeemCodesReducer from './admin/redeem-codes/reducer';
import dashboardReducer from './dashboard/reducer';
import aiTrainingReducer from './ai-training/reducer';
import authReducer from './auth/reducer';
import settingsReducer from './settings/reducer';
import cryptoReducer from './crypto/reducer';
import topupReducer from './topup/reducer';
import referralsReducer from './referrals/reducer';
import pricingReducer from './pricing/reducer';

const rootReducer = combineReducers({
    auth: authReducer,
    admin: adminReducer,
    adminPackages: adminPackagesReducer,
    adminExtensions: adminExtensionsReducer,
    adminSolutions: adminSolutionsReducer,
    adminWallets: adminWalletsReducer,
    adminDepositAddresses: adminDepositAddressesReducer,
    adminTopupHistory: adminTopupHistoryReducer,
    adminHistory: adminHistoryReducer,
    adminObjectClasses: adminObjectClassesReducer,
    adminHealthCheck: adminHealthCheckReducer,
    adminUploadModel: adminUploadModelReducer,
    adminCacheControl: adminCacheControlReducer,
    adminDatabase: adminDatabaseReducer,
    adminRedeemCodes: adminRedeemCodesReducer,
    dashboard: dashboardReducer,
    aiTraining: aiTrainingReducer,
    settings: settingsReducer,
    crypto: cryptoReducer,
    topup: topupReducer,
    referrals: referralsReducer,
    pricing: pricingReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
