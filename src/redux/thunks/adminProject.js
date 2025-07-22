import { createAsyncThunk } from "@reduxjs/toolkit";
import { DispatchErrorHandler } from "../configs";
import adminProjectAPI from "../api/adminProjectAPI";

// admin Project

export const getProjectOptions = createAsyncThunk(
  "projectReducer/getProjectOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.projects.getProjectOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllProject = createAsyncThunk(
  "projectReducer/getAllProject",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.projects.getAllProject(
        payload?.page,
        payload?.records,
        payload?.search
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const createProject = createAsyncThunk(
  "projectReducer/createProject",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.projects.createProject(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const getProjectById = createAsyncThunk(
  "projectReducer/getProjectById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.projects.getProjectById(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateProjectById = createAsyncThunk(
  "projectReducer/updateProjectById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.projects.updateProjectById(
        payload?.id,
        payload?.putData
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteProjectById = createAsyncThunk(
  "projectReducer/deleteProjectById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.projects.deleteProjectById(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const updateProjectStatus = createAsyncThunk(
  "projectReducer/updateProjectStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.projects.updateProjectStatus(
        payload?.id
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

// TASK 


export const getTaskOptions = createAsyncThunk(
  "taskReducer/getTaskOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.task.getTaskOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllTask = createAsyncThunk(
  "taskReducer/getAllTask",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.task.getAllTask(
        payload?.page,
        payload?.records,
        payload?.search
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const createTask = createAsyncThunk(
  "taskReducer/createTask",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.task.createTask(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const getTaskById = createAsyncThunk(
  "taskReducer/getTaskById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.task.getTaskById(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateTaskById = createAsyncThunk(
  "taskReducer/updateTaskById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.task.updateTaskById(
        payload?.id,
        payload?.putData
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteTaskById = createAsyncThunk(
  "taskReducer/deleteTaskById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.task.deleteTaskById(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  "taskReducer/updateTaskStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.task.updateTaskStatus(
        payload?.id
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);





//sub task
export const getSubTaskOptions = createAsyncThunk(
  "subTaskReducer/getSubTaskOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.sub_task.getSubTaskOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllSubTask = createAsyncThunk(
  "subTaskReducer/getAllSubTask",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.sub_task.getAllSubTask(payload?.page, payload?.records,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createSubTask = createAsyncThunk(
  "subTaskReducer/createSubTask",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.sub_task.createSubTask(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSubTaskById = createAsyncThunk(
  "subTaskReducer/getSubTaskById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.sub_task.getSubTaskById(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateSubTaskById = createAsyncThunk(
  "subTaskReducer/updateSubTaskById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.sub_task.updateSubTaskById(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteSubTaskById = createAsyncThunk(
  "subTaskReducer/deleteSubTaskById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.sub_task.deleteSubTaskById(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateSubTaskStatus = createAsyncThunk(
  "subTaskReducer/updateSubTaskStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.sub_task.updateSubTaskStatus(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
  


//attedance

export const getEmployeeAttedanceOptions = createAsyncThunk(
  "employeeAttedanceReducer/getEmployeeAttedanceOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.employee_attedance.getEmployeeAttedanceOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllEmployeeAttedance = createAsyncThunk(
  "employeeAttedanceReducer/getAllEmployeeAttedance",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.employee_attedance.getEmployeeAttedance(payload?.page, payload?.records,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createEmployeeAttedance = createAsyncThunk(
  "employeeAttedanceReducer/createEmployeeAttedance",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.employee_attedance.createEmployeeAttedance(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getEmployeeAttedanceById = createAsyncThunk(
  "employeeAttedanceReducer/getEmployeeAttedanceById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.employee_attedance.getEmployeeAttedanceById(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateEmployeeAttedanceById = createAsyncThunk(
  "employeeAttedanceReducer/updateEmployeeAttedanceById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.employee_attedance.updateEmployeeAttedanceById(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteEmployeeAttedanceById = createAsyncThunk(
  "employeeAttedanceReducer/deleteEmployeeAttedanceById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.employee_attedance.deleteEmployeeAttedanceById(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateEmployeeAttedanceStatus = createAsyncThunk(
  "employeeAttedanceReducer/updateEmployeeAttedanceStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.employee_attedance.updateEmployeeAttedanceStatus(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);



// Performance Invoice
   
export const getPerformanceInvoiceOptions = createAsyncThunk(
  "performanceReducer/getPerformanceInvoiceOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.performance_invoice.getPerformanceInvoiceOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllPerformanceInvoice = createAsyncThunk(
  "performanceReducer/getAllPerformanceInvoice",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.performance_invoice.getAllPerformanceInvoice(
        payload?.page,
        payload?.records,
        payload?.search
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const searchPerformanceInvoice = createAsyncThunk(
  "performanceReducer/searchPerformanceInvoice",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.performance_invoice.searchPerformanceInvoice(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createPerformanceInvoice = createAsyncThunk(
  "performanceReducer/createPerformanceInvoice",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.performance_invoice.createPerformanceInvoice(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const getPerformanceInvoiceById = createAsyncThunk(
  "performanceReducer/getPerformanceInvoiceById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.performance_invoice.getPerformanceInvoiceById(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updatePerformanceInvoiceById = createAsyncThunk(
  "performanceReducer/updatePerformanceInvoiceById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.performance_invoice.updatePerformanceInvoiceById(
        payload?.id,
        payload?.putData
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deletePerformanceInvoiceById = createAsyncThunk(
  "performanceReducer/deletePerformanceInvoiceById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.performance_invoice.deletePerformanceInvoiceById(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


// Erp Attendance

export const getErpAttendanceOptions = createAsyncThunk(
  "erpAttendanceReducer/getErpAttendanceOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.erpAttendance.getErpAttendanceOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllErpAttendance = createAsyncThunk(
  "erpAttendanceReducer/getAllErpAttendance",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.erpAttendance.getAllErpAttendance(
        payload?.page,
        payload?.records,
        payload?.search
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const createErpAttendance = createAsyncThunk(
  "erpAttendanceReducer/createErpAttendance",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.erpAttendance.createErpAttendance(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const getErpAttendanceById = createAsyncThunk(
  "erpAttendanceReducer/getErpAttendanceById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.erpAttendance.getErpAttendanceById(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateErpAttendanceById = createAsyncThunk(
  "erpAttendanceReducer/updateErpAttendanceById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.erpAttendance.updateErpAttendanceById(
        payload?.id,
        payload?.putData
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteErpAttendanceById = createAsyncThunk(
  "erpAttendanceReducer/deleteErpAttendanceById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.erpAttendance.deleteErpAttendanceById(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateErpAttendanceStatus = createAsyncThunk(
  "erpAttendanceReducer/updateErpAttendanceStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.erpAttendance.updateErpAttendanceStatus(
        payload?.id
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllErpEmployeeDetails = createAsyncThunk(
  "erpAttendanceReducer/getAllErpEmployeeDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await adminProjectAPI.erpAttendance.getAllErpEmployeeDetails(
        payload?.id
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
