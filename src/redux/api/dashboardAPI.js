import { Auth } from "../configs";

const api = {
  dashboards: {
    getPaymentStatus: (days) => Auth.get(`/dashboard/payment_status/?days=${days}`),
    getPaymentThrough: (days) => Auth.get(`/dashboard/payment_through/?filter=${days}`),
    getPaymentModeDash: (days) => Auth.get(`/dashboard/payment_modes/?days=${days}`),
    getUserByAreas: () => Auth.get(`/dashboard/user_by_areas/`),
    getSchemeWiseJoined: (days) => Auth.get(`/dashboard/scheme_wise_joined/?days=${days}`),
    getSchemeWiseClosed: (days) => Auth.get(`/dashboard/scheme_wise_closed/?days=${days}`),
    getUserJoinedThrough: (days) => Auth.get(`/dashboard/user_joined_through/?days=${days}`),
    getBranchWiseSchemeJoined: (days) => Auth.get(`/dashboard/branch_wise_joined/?days=${days}`),
    getBranchWiseSchemeClosed: (days) => Auth.get(`/dashboard/branch_wise_closed/?days=${days}`),

    getActiveChits: (view) => Auth.get(`/dashboard/active_chits/?filter=${view}`),
    getMaturedUnclaimedChits: () => Auth.get(`/dashboard/matured_and_unclaimed_chits/`),
    getInActiveChits: () => Auth.get(`/dashboard/inactive_chits/`),
    getPaymentSummary: (view) => Auth.get(`/dashboard/payment_summary/?filter=${view}`),
    getBranchWiseDetails: () => Auth.get(`/dashboard/branch_wise_details/`),
    getUnPaidCustomersDetails: () => Auth.get(`/dashboard/unpaid_cus_details/`),
    getCollectionSummary: () => Auth.get(`/dashboard/collection_summary/`),
    getChitClosingDetails: () => Auth.get(`/dashboard/chit_closing_detail/`),
    getRegisterThroughDetails: (view) => Auth.get(`/dashboard/registered_through/?filter=${view}`),
    getCustomerDetails: () => Auth.get(`/dashboard/customer_reg_detail/`),
    getOrderDetails: () => Auth.get(`/dashboard/orders_detail/`),
    getCustomerImportantDates: () => Auth.get(`/dashboard/cus_imp_dates/`),
    getCustomerImportantDatesList: (content) => Auth.post(`/dashboard/cus_imp_dates_list/`, content),
    getBranchWiseCollectionDetails: (view) => Auth.get(`/dashboard/branch_wise_collection/?filter=${view}`),

    // Order Management Dashboard
    fetchOrderDetails: () => Auth.get(`/orders/orderdetails/`), 

    
    fetchTotalOrderDetails: () => Auth.get(`/orders/totalorderdetails/`), 
    fetchTodayRecivedDetails: () => Auth.get(`/orders/todayreciveddetails/`), 
    fetchErpTodayDeliveredOrders: () => Auth.get(`/orders/erptodaydeliveredorders/`), 
    fetchErpYetToAssignOrders: () => Auth.get(`/orders/erpyettoassignorders/`), 
    fetchErpTotalDeliveredOrders: () => Auth.get(`/orders/erptotaldeliveredorders/`), 
    fetchErpWeekDeliveryOrders: () => Auth.get(`/orders/erpweekdeliveryorders/`), 
    fetchErpNextWeekDeliveryOrders: () => Auth.get(`/orders/erpnextweekdeliveryorders/`), 
    fetchErpOverDueOrderSupplier: () => Auth.get(`/orders/erpoverdueordersupplier/`), 
    fetchErpCustomerOverDueOrder: () => Auth.get(`/orders/erpcustomeroverdueorder/`), 

    fetchErpTotalDeliveryReady: () => Auth.get(`/orders/erptotaldeliveryready/`), 
    fetchErpWorkProgress: () => Auth.get(`/orders/erpworkprogress/`),
    getCreditCollectionReportReport: (page, records,search) => Auth.get(`/orders/erpcustomercart/?page=${page}&records=${records}&searchText=${search}`), 

  },
};

const dashboardAPI = { ...api };

export default dashboardAPI;
