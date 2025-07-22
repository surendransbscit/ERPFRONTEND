import { Auth } from "../configs";

const api = {
  promotion_management_discount: {
    getAllDiscount: (page, records, search) =>
      Auth.get(
        `/promotion_management/discount?page=${page}&records=${records}&searchText=${search}`
      ),
    createDiscount: (content) =>
      Auth.post("/promotion_management/discount/", content),
    getDiscountById: (id) => Auth.get(`/promotion_management/discount/${id}/`),
    updateDiscountById: (id, content) =>
      Auth.put(`/promotion_management/discount/${id}/`, content),
    deleteDiscountById: (id) =>
      Auth.delete(`/promotion_management/discount/${id}/`),
    getDiscountOptions: () =>
      Auth.get(`/promotion_management/discount?is_active`),
  },
  promotion_management_coupon: {
    getAllCoupon: (page, records, search) =>
      Auth.get(
        `/promotion_management/coupon/?page=${page}&records=${records}&searchText=${search}`
      ),
    createCoupon: (content) =>
      Auth.post("/promotion_management/coupon/", content),
    getCouponById: (id) => Auth.get(`/promotion_management/coupon/${id}/`),
    updateCouponById: (id, content) =>
      Auth.put(`/promotion_management/coupon/${id}/`, content),
    deleteCouponById: (id) =>
      Auth.delete(`/promotion_management/coupon/${id}/`),
    getCouponOptions: () => Auth.get(`/promotion_management/coupon/?is_active`),
    changeStatusCoupon: (id) =>
      Auth.get(`/promotion_management/coupon/${id}/?changestatus`),
  },
  promotion_management_gift_voucher: {
    getGiftVoucherByID: (id) =>
      Auth.get(`/promotion_management/gift_voucher/${id}/`),
    deleteGiftVoucherByID: (id) =>
      Auth.delete(`/promotion_management/gift_voucher/${id}/`),
    getAllGiftVoucher: (page, records, search) =>
      Auth.get(
        `/promotion_management/gift_voucher/?page=${page}&records=${records}&searchText=${search}`
      ),
    createGiftVoucher: (content) =>
      Auth.post("/promotion_management/gift_voucher/", content),
    updateGiftVoucherByID: (id, content) =>
      Auth.put(`/promotion_management/gift_voucher/${id}/`, content),
    changeStatusGiftVoucher: (id) =>
      Auth.get(`/promotion_management/gift_voucher/${id}/?changestatus`),
    getGiftVoucherOptions: () =>
      Auth.get(`/promotion_management/gift_voucher/?is_active`),
  },
  promotion_management_voucher_issue: {
    getVoucherIssueByID: (id) =>
      Auth.get(`/promotion_management/voucher_issue/${id}/`),
    deleteVoucherIssueByID: (id) =>
      Auth.delete(`/promotion_management/voucher_issue/${id}/`),
    getAllVoucherIssue: (page, records, search) =>
      Auth.get(
        `/promotion_management/voucher_issue/?page=${page}&records=${records}&searchText=${search}`
      ),
    createVoucherIssue: (content) =>
      Auth.post("/promotion_management/voucher_issue/", content),
    updateVoucherIssueByID: (id, content) =>
      Auth.put(`/promotion_management/voucher_issue/${id}/`, content),
    cancelVoucherIssue: (content) =>
      Auth.post(`/promotion_management/voucher_issue_status_details_update/`, content),
    getVoucherIssueDetails: (content) =>
      Auth.post(`/promotion_management/voucher_search/`, content),
    getVoucherIssueStatusDetails: (content) =>
      Auth.post(`/promotion_management/voucher_issue_status_details_list/`, content),
  },
};

const promotionManagementAPI = { ...api };

export default promotionManagementAPI;
