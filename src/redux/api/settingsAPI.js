import { Auth } from "../configs";

const api = {
  company: {
    get: (id) => Auth.get(`/retailmaster/company/?id=${id}`),
    deleteCompanyByID: (id) => Auth.delete(`/retailmaster/company/?id=${id}`),
    getAll: () => Auth.get("/retailmaster/company/"),
    create: (content) => Auth.post("/retailmaster/company/", content),
    update: (id, content) =>
      Auth.put(`/retailmaster/company/?id=${id}`, content),
  },

  menu: {
    getMenu: (id) => Auth.get(`/core/adminmenu/${id}/`),
    getAllMenu: (page, records,search) => Auth.get(`/core/adminmenu/?page=${page}&records=${records}&searchText=${search}`),
    getAccessMenuOptions: () => Auth.get("/core/menu_access_options/?options"),
    getCheckboxAccessMenuOptions: () => Auth.get("/core/menu_access_checkbox_options/?options"),
    createAccessCheckBoxForm: (content) => Auth.post("/core/menu_access_checkbox_options/", content),
    getCheckBoxAccess: (content) => Auth.post("/core/get_profile_access_checkbox/", content),
    createMenu: (content) => Auth.post("/core/adminmenu/", content),
    createAccess: (content) => Auth.post("/core/profile_access/", content),
    getAccess: (content) => Auth.post("/core/get_profile_access/", content),
    updateMenu: (id, content) => Auth.put(`/core/adminmenu/${id}/`, content),
    fetchMenu: (content) => Auth.get(`/core/adminmenu/?options`, content),
    deleteMenu: (id) =>
      Auth.delete(`/core/adminmenu/${id}`),
    createReportTemplate: (content) => Auth.post("/core/report_columns_template/", content),

  },
  branch: {
    getBranchByID: (id) => Auth.get(`/retailmaster/branch/?branchid=${id}`),
    changeStatusBranch: (id) =>
      Auth.get(`/retailmaster/branch_status/${id}/?changestatus`),
    deleteBranchByID: (id) =>
      Auth.delete(`/retailmaster/branch/?branchid=${id}`),
    getAllBranch: (content) =>
      Auth.get(`/retailmaster/branch/?page=${content}`),
    createBranch: (content) => Auth.post("/retailmaster/branch/", content),
    updateBranchByID: (id, content) =>
      Auth.put(`/retailmaster/branch/?branchid=${id}`, content),
  },
  setting: {
    get: (id) => Auth.get(`/retailsettings/ret_settings/${id}`),
    deleteSettingByID: (id) => Auth.delete(`/retailsettings/ret_settings/${id}`),
    getAll: () => Auth.get("/retailsettings/ret_settings/"),
    create: (content) => Auth.post("/retailsettings/ret_settings/", content),
    update: (id, content) =>
      Auth.put(`/retailsettings/ret_settings/${id}/`, content),
  },
};

const settingsAPI = { ...api };

export default settingsAPI;
