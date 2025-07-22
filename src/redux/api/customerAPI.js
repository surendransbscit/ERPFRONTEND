import { Auth } from "../configs";

const api = {
  customer: {
    getCustomerByID: (id) => Auth.get(`/customersettings/customer/${id}/`),
    deleteCustomerByID: (id) => Auth.delete(`/customersettings/customer/${id}/`),
    getAllCustomer: (page, branch,records,search,pathname) =>
      Auth.get(`/customersettings/customer/?page=${page}&branch=${branch}&records=${records}&searchText=${search}&path_name=${pathname}`),
    createCustomer: (content) => Auth.post("/customersettings/customer/", content),
    searchCustomer: (content) => Auth.post("/customersettings/customer_search/", content),
    updateCustomerByID: (id, content) => Auth.put(`/customersettings/customer/${id}/`, content),
    changeStatusCustomer: (id) =>
      Auth.get(`/customersettings/customer/${id}/?changestatus`),
    getAllApprovalCustomer: () => Auth.get(`/customersettings/customer_approval/`),
    createApprovalCustomer: (content) => Auth.post(`/customersettings/customer_approval/`, content),
    getActiveCustomers: () => Auth.get(`/customersettings/customer/?is_active`),
  },
};

const customerAPI = { ...api };

export default customerAPI;
