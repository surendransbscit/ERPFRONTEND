import { Auth } from "../configs";

const api = {
    digiGoldDashboards: {
        getDashboardSummary : (days) => Auth.get(`/dashboard/digi_gold/summary/?filter=${days}`),
        getMonthlywiseMetalWeight : (year) => Auth.get(`/dashboard/digi_gold/monthly_wise_metal_weight/?year=${year}`),
        getClosedAccountsSummary : () => Auth.get(`/dashboard/digi_gold/closed_accounts_summary/`),
        getSchemeSlabWiseAccounts : (metalType) => Auth.get(`/dashboard/digi_gold/slab_wise_accounts/?metal_type=${metalType}`),
        getUpcomingMaturies : () => Auth.get(`/dashboard/digi_gold/upcoming_maturities/`),
        getActiveInActiveCustomer: (days, branch, type) => {
            const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;
            const url = `/digigoldDashboard/active_inactive_customer/?days=${days}&${branchParam}&type=${type}`;
            return Auth.get(url);
        },
        getNewCustomer: (days, branch, type) => {
            const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;
            const url = `/digigoldDashboard/new_customer/?days=${days}&${branchParam}&type=${type}`;
            return Auth.get(url);
        },
        getTotalCustomer: (days, branch, type) => {
            const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;
            const url = `/digigoldDashboard/total_customer/?days=${days}&${branchParam}&type=${type}`;
            return Auth.get(url);
        },
        // getChitClosingDetails: (days, branch, type) => {
        //     const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;
        //     const url = `/digigoldDashboard/chit_closing/?days=${days}&${branchParam}&type=${type}`;
        //     return Auth.get(url);
        // },

    },
};

const digigoldDashboardAPI = { ...api };

export default digigoldDashboardAPI;
