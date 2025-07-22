import { Auth } from "../configs";

const api = {
    purchaseDashboards: { 
        getSupplierRateCut: (days) => Auth.get(`/purchase_dashboard/supplier_rate_cut/?days=${days}`),
        getSupplierListRateCut: (days) => Auth.post(`/dashboard/purchaseentrydetailslistapi/`, { days }),       
        getSupplierWisePurchase:(days) => Auth.post(`/dashboard/supllierpurchaseentrydetailslist/`,{days}),
        getPurchaseDetailList:(days) => Auth.post(`/dashboard/purchasedetaillist/`, {days}),
    },
};

const purchaseDashboardAPI = { ...api };

export default purchaseDashboardAPI;