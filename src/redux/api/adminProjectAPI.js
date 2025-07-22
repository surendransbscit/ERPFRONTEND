import { Auth } from "../configs";

const api = {
  projects: {
    getProjectOptions: () => Auth.get(`/adminproject/projects/?active`),
    getAllProject: (page, records, search) =>
      Auth.get(
        `/adminproject/projects/?page=${page}&records=${records}&searchText=${search}`
      ),
    createProject: (content) => Auth.post("/adminproject/projects/", content),
    getProjectById: (id) => Auth.get(`/adminproject/projects/${id}/`),
    updateProjectById: (id, content) =>
      Auth.put(`/adminproject/projects/${id}/`, content),
    deleteProjectById: (id) => Auth.delete(`/adminproject/projects/${id}/`),
    updateProjectStatus: (id) =>
      Auth.get(`/adminproject/projects/${id}/?changestatus`),
  },

  task: {
    getTaskOptions: () => Auth.get(`/adminproject/tasks/?active`),
    getAllTask: (page, records, search) =>
      Auth.get(
        `/adminproject/tasks/?page=${page}&records=${records}&searchText=${search}`
      ),
    createTask: (content) => Auth.post("/adminproject/tasks/", content),
    getTaskById: (id) => Auth.get(`/adminproject/tasks/${id}/`),
    updateTaskById: (id, content) =>
      Auth.put(`/adminproject/tasks/${id}/`, content),
    deleteTaskById: (id) => Auth.delete(`/adminproject/tasks/${id}/`),
    updateTaskStatus: (id) =>
      Auth.get(`/adminproject/tasks/${id}/?changestatus`),
  },

   sub_task: {   
    getSubTaskOptions: () => Auth.get(`/adminproject/subtasks/?active`),
    getAllSubTask: (page, records,search) => Auth.get(`/adminproject/subtasks/?page=${page}&records=${records}&searchText=${search}`),
    createSubTask: (content) => Auth.post("/adminproject/subtasks/", content),
    getSubTaskById: (id) => Auth.get(`/adminproject/subtasks/${id}/`),
    updateSubTaskById: (id, content) => Auth.put(`/adminproject/subtasks/${id}/`, content),
    deleteSubTaskById: (id) => Auth.delete(`/adminproject/subtasks/${id}/`),
    updateSubTaskStatus: (id) => Auth.get(`/adminproject/subtasks/${id}/?changestatus`),
  },

    employee_attedance: {   
    getEmployeeAttedanceOptions: () => Auth.get(`/adminproject/employee_attedance/?active`),
    getEmployeeAttedance: (page, records,search) => Auth.get(`/adminproject/employee_attedance/?page=${page}&records=${records}&searchText=${search}`),
    createEmployeeAttedance: (content) => Auth.post("/adminproject/employee_attedance/", content),
    getEmployeeAttedanceById: (id) => Auth.get(`/adminproject/employee_attedance/${id}/`),
    updateEmployeeAttedanceById: (id, content) => Auth.put(`/adminproject/employee_attedance/${id}/`, content),
    deleteEmployeeAttedanceById: (id) => Auth.delete(`/adminproject/employee_attedance/${id}/`),
    updateEmployeeAttedanceStatus: (id) => Auth.get(`/adminproject/employee_attedance/${id}/?changestatus`),
  },
  performance_invoice: {
    searchPerformanceInvoice: (content) => Auth.get("/adminproject/performance_invoices/", content),//Searching for Module using id_Product
    createPerformanceInvoice: (content) => Auth.put("adminproject/performance_invoices/", content),//create put Module data
    getPerformanceInvoiceOptions: () => Auth.get(`/adminproject/performance_invoices_list/?active`),//This for get all performance invoice Details Options
    getAllPerformanceInvoice: (page, records, search) =>
      Auth.get(
        `/adminproject/performance_invoices_list/?page=${page}&records=${records}&searchText=${search}`
      ),//This for get all performance invoice Details
    getPerformanceInvoiceById: (id) => Auth.get(`/adminproject/performance_invoices_list/${id}/`),//This For Get Single Preformance Invoice
    updatePerformanceInvoiceById: (id, content) =>
      Auth.put(`/adminproject/performance_invoices_list/${id}/`, content),//Update Preformance Invoice
    deletePerformanceInvoiceById: (id) => Auth.delete(`/adminproject/performance_invoices_list/${id}/`),//Delete Preformance Invoice
  },
  erpAttendance: {
    getErpAttendanceOptions: () => Auth.get(`/adminproject/erpemployeeattendance/?active`),
    getAllErpAttendance: (page, records, fromDate, toDate,search) =>
      Auth.post(
        `/adminproject/erpemployeeattendance/?page=${page}&records=${records}&searchText=${search}`, page, records, fromDate, toDate
      ),
    createErpAttendance: (content) => Auth.post("/adminproject/erpemployeeattendance/", content),
    getErpAttendanceById: (id) => Auth.get(`/adminproject/erpemployeeattendance/${id}/`),
    updateErpAttendanceById: (id, content) =>
      Auth.put(`/adminproject/erpemployeeattendance/${id}/`, content),
    deleteErpAttendanceById: (id) => Auth.delete(`/adminproject/erpemployeeattendance/${id}/`),
    updateErpAttendanceStatus: (id) =>
      Auth.get(`/adminproject/erpemployeeattendance/${id}/?changestatus`),
    getAllErpEmployeeDetails: ( ) =>
      Auth.get(
        `/adminproject/employeesdetails/`
      ),
  },
};

const adminProjectAPI = { ...api };

export default adminProjectAPI;
