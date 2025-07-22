import { Auth, AuthFD } from "../configs";

const api = {
  schemeClassification: {
    getActiveSchemeClass: (content) =>
      Auth.get(`/catalogmasters/scheme_class/?status`),
    getAllSchemeClass: (page, records,search) =>
      Auth.get(`/catalogmasters/scheme_class/?page=${page}&records=${records}&searchText=${search}`),
    getSchemeClassByID: (id) =>
      AuthFD.get(`/catalogmasters/scheme_class/${id}/`),
    createSchemeClass: (content) =>
      Auth.post(`/catalogmasters/scheme_class/`, content),
    updateSchemeClassByID: (id, content) =>
      Auth.put(`/catalogmasters/scheme_class/${id}/`, content),
    deleteSchemeClassByID: (id) =>
      Auth.delete(`/catalogmasters/scheme_class/${id}/`),
    changeSchemeClassScheme: (id) =>
      Auth.get(`/catalogmasters/scheme_class/${id}/?changestatus`),
  },
  paymentFormula: {
    getAllPaymentFormula: () => Auth.get(`/scheme/payment_setting_formula/`),
  },
  scheme: {
    getSchemeByID: (id) => Auth.get(`/scheme/scheme_by_id/${id}/`),
    deleteSchemeByID: (id) => Auth.delete(`/scheme/scheme_by_id/${id}/`),
    changeStatusScheme: (id) =>
      Auth.get(`/scheme/scheme_by_id/${id}/?changestatus`),
    getActiveScheme: (page) => Auth.get(`/scheme/list/?status`),
    getAllScheme: (page, records,search,pathname) =>
      Auth.get(`/scheme/list/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    getAllActiveScheme: () => Auth.get(`/scheme/list/?status`),
    getAllCustomerMultiScheme: (content) => Auth.post(`/scheme/customer_multi_scheme_list/`, content),
    createScheme: (content) => Auth.post("/scheme/list/", content),
    updateSchemeByID: (id, content) =>
      Auth.put(`/scheme/scheme_by_id/${id}/`, content),
  },
  schemeAccount: {
    getSchemeAccountByID: (id) =>
      Auth.get(`/managescheme/scheme_account/${id}/`),
    deleteSchemeAccountByID: (id) =>
      Auth.delete(`/managescheme/scheme_account/${id}/`),
    getAllSchemeAccount: (page, records, branch, fromDate, toDate,search, customer, scheme,pathname) =>
      Auth.get(
        `/managescheme/scheme_account/?page=${page}&records=${records}&searchText=${search}&branch=${branch}&from=${fromDate}&to=${toDate}&customer=${customer}&scheme=${scheme}&path_name=${pathname}`
      ),
    getCustomerAccount: (payload) =>
      Auth.post(`/managescheme/customer_account/`, payload),
    createSchemeAccount: (content) =>
      Auth.post("/managescheme/scheme_account/", content),
    updateSchemeAccountByID: (id, content) =>
      Auth.put(`/managescheme/scheme_account/${id}/`, content),
  },
  schemeAccountClose: {
    getAllClosedSchemeAccount: (page, records, branch, fromDate, toDate,search) =>
      Auth.get(
        `/managescheme/scheme_account_close/?page=${page}&records=${records}&searchText=${search}&branch=${branch}&from=${fromDate}&to=${toDate}`
      ),
    SchemeAccountCloseByID: (id, content) =>
      Auth.put(`/managescheme/scheme_account_close/${id}/`, content),
    schemeAccountCloseRevertById: (id, content) =>
      Auth.put(`/managescheme/scheme_account_close_revert/${id}/`, content),
  },
};

const schemeAPI = { ...api };

export default schemeAPI;
