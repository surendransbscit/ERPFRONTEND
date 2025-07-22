import { Auth } from "../configs";

const api = {
    crmDashboards: {
        getActiveChits: (days, branch, type) => {
            const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;
            const url = `/dashboard/active_chits_reports/?filter=${days}&${branchParam}&type=${type}`;
            return Auth.get(url);
        },
        getMaturedandUnclaimed: () => Auth.get(`/dashboard/matured_and_unclaimed_chits_reports/`),
        getPayment: (days, branch, type) => {
            const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;
            const url = `/dashboard/payment_summary_reports/?days=${days}&${branchParam}&type=${type}`;
            return Auth.get(url);
        },
        getUsersJoinedThrough: (days, branch, type) => {
            const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;
            const url = `/dashboard/user_joined_through/?days=${days}&${branchParam}&type=${type}`;
            return Auth.get(url);
        },
        getschemewise: (days) => Auth.get(`/dashboard/schemewise/?days=${days}`),
        getBranchwise: (days) => Auth.get(`/dashboard/branchwise/?days=${days}`),
        getRegisterThroughDetails: (days, branch, type) => {
            const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;
            const url = `/dashboard/regsiter_details_through/?days=${days}&${branchParam}&type=${type}`;
            return Auth.get(url);
        },
        getCustomerDetails: (days, branch, type) => {
            const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;
            const url = `/dashboard/customer_details/?days=${days}&${branchParam}&type=${type}`;
            return Auth.get(url);
        },
        getCollectionSummary: (days, branch, type) => {
            const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;
            const url = `/dashboard/collection_summary/?days=${days}&${branchParam}&type=${type}`;
            return Auth.get(url);
        },
        getInActiveChits: (days, branch, type) => {
            const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;
            const url = `/dashboard/inactivechits/?days=${days}&${branchParam}&type=${type}`;
            return Auth.get(url);
        },
        getChitClosingDetails: (days, branch, type) => {
            const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;
            const url = `/dashboard/chit_closing/?days=${days}&${branchParam}&type=${type}`;
            return Auth.get(url);
        },

    },
};

const crmDashboardAPI = { ...api };

export default crmDashboardAPI;
