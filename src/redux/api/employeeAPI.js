import { Auth } from "../configs";

const api = {
  employee: {
    getAllEmployee: (page,records,search,pathname) => Auth.get(`/employee/employee/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    getActiveEmployee: (page) => Auth.get(`/employee/employee/active/`),
    getActiveEmployeeDropdown: () => Auth.get(`/employee/active_employee/`),
    createEmployee: (content) => Auth.post("/employee/employee/", content),
    getEmployeeByID: (id) => Auth.get(`/employee/employee/${id}/`),
    updateEmployeeByID: (id, content) => Auth.put(`/employee/employee/${id}/`, content),
    deleteEmployeeByID: (id) => Auth.delete(`/employee/employee/${id}/`),
    changeStatusEmployee: (id) => Auth.get(`/employee/employee/${id}/?changestatus`),
    getSystemUserEmployee: (empId) => Auth.get(`/employee/system_user_employee/?employee=${empId}`),
    getSystemUserEmployeeDropdown: () => Auth.get(`/employee/system_users_dropdown/`),
    updateSystemUserEmployee: (content) => Auth.post(`/employee/system_user_employee/`, content),
    updateSystemUserEmployeePassword: (content) => Auth.put(`/employee/system_user_employee/`, content),
  },
  profiledetails: {
    getEmployeeDetails: () => Auth.get(`/employee/profile_details/`),
    updateEmployeeDetails: (content) => Auth.put(`/employee/profile_details/`, content),
    updateEmployeePassword: (content) => Auth.post("/employee/employee_change_pass/", content),
  },
  employeeSettings: {
    deleteEmployeeSettingsByID: (id) => Auth.delete(`/employee/employee_settings/${id}/`),
    getEmployeeSettings: async (data) => {
      return await Auth.post("/employee/employee_settings/", data);
    },
    updateEmployeeSettings: (content) => Auth.put(`/employee/employee_settings/`, content),
    updateMenuStyleSettings: (content) => Auth.post(`/employee/menu_style_update/`, content),
  },
};

const employeeAPI = { ...api };

export default employeeAPI;
