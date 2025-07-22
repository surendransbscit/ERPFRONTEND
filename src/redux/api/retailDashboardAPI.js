import { Auth } from "../configs";

const api = {
  retailDashboards: {
    getEstimation: (days) => Auth.get(`/retail_dashboard/estimation/?days=${days}`),
    getKarigarOrders: (days) => Auth.get(`/retail_dashboard/karigar_order/?days=${days}`),
    getCustomerVists: (days) => Auth.get(`/retail_dashboard/customer_vist/?days=${days}`),
    getSales: (days, branch) => {
      const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;

      const url = `/retail_dashboard/sales/?days=${days}&${branchParam}`;

      return Auth.get(url);
    },
    getCustomerOrder: (days) => Auth.get(`/retail_dashboard/customer_order/?days=${days}`),
    getSalesReturn: (days) => Auth.get(`/retail_dashboard/sales_return/?days=${days}`),
    getPurchase: (days) => Auth.get(`/retail_dashboard/purchase/?days=${days}`),
    getLot: (days) => Auth.get(`/retail_dashboard/lot/?days=${days}`),
    getCreditSales: (days) => Auth.get(`/retail_dashboard/credit_sales/?days=${days}`),
    getStoreStatistics: (days) => Auth.get(`/retail_dashboard/store_statistics/?days=${days}`),
    getTopProduct: (days, branch) => {
      const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;
      const url = `/retail_dashboard/top_products/?days=${days}`;
      return Auth.get(url);
    },
    getStockApproval: (days, branch) => {
      const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;
      const url = `/retail_dashboard/stock_approval/?days=${days}&${branchParam}`;
      return Auth.get(url);
    },
    getSupplierPayment: () => Auth.get(`/retail_dashboard/po_details/`),

    //Reports
    getEstimationReport: (days, branch, type) => {
      const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;
      const url = `/retail_dashboard/estimation_report/?days=${days}&${branchParam}&type=${type}`;
      return Auth.get(url);
      // Auth.get(`/retail_dashboard/estimation_report/?days=${days}`)
    },
    getCustomerVistsReport: (days, branch, type) =>{ 
      const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;
      const url = `/retail_dashboard/customer_vist_report/?days=${days}&${branchParam}&type=${type}`;
      return Auth.get(url);
      // Auth.get(`/retail_dashboard/customer_vist_report/?days=${days}`)
    },
    getSalesReport: (days, branch,type) => {
      const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;

      const url = `/retail_dashboard/sales_report/?days=${days}&${branchParam}&id_metal=${type}`;

      return Auth.get(url);
    },
    getSalesReturnReport: (days,branch,type) =>{
      const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;

      const url = `/retail_dashboard/sales_return_report/?days=${days}&${branchParam}&type=${type}`;

      return Auth.get(url);
    },
    getPurchaseReport: (days,branch,type) =>{
      const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;

      const url = `/retail_dashboard/purchase_report/?days=${days}&${branchParam}&type=${type}`;

      return Auth.get(url);
    },
    getStockApprovalReport: (days, branch,type) => {
      const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;
      const url = `/retail_dashboard/stock_approval_report/?days=${days}&${branchParam}&type=${type}`;
      return Auth.get(url);
    },
    getLotReport: (days, branch,type) => {
      const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;
      const url = `/retail_dashboard/lot_report/?days=${days}&${branchParam}&type=${type}`;
      return Auth.get(url);
    },
    getCreditSalesReport: (days) => Auth.get(`/retail_dashboard/credit_sales_report/?days=${days}`),
    getKarigarReport: (days, branch,type) => {
      const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;

      const url = `/retail_dashboard/karigar_order_report/?days=${days}&${branchParam}&type=${type}`;

      return Auth.get(url);
    },
    getCustomerOrderReport: (days, branch,type) => {
      const branchParam = Array.isArray(branch) ? branch.map((b) => `branch=${b}`).join("&") : `branch=${branch}`;

      const url = `/retail_dashboard/customer_order_report/?days=${days}&${branchParam}&type=${type}`;

      return Auth.get(url);
    },
  },
};

const retailDashboardAPI = { ...api };

export default retailDashboardAPI;
