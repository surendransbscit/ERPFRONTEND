import { createAsyncThunk } from "@reduxjs/toolkit";
import { DispatchErrorHandler } from "../configs";
import employeeAPI from "../api/employeeAPI";

export const createEmployee = createAsyncThunk(
  "employeeReducer/createEmployee",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.employee.createEmployee(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllEmployee = createAsyncThunk(
  "employeeReducer/getAllEmployee",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.employee.getAllEmployee(payload?.page,payload?.records,payload?.search, payload?.path_name);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getEmployeeById = createAsyncThunk(
  "employeeReducer/getEmployeeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.employee.getEmployeeByID(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateEmployeeById = createAsyncThunk(
  "employeeReducer/updateEmployeeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.employee.updateEmployeeByID(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteEmployeeById = createAsyncThunk(
  "employeeReducer/deleteEmployeeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.employee.deleteEmployeeByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateEmployeeStatus = createAsyncThunk(
  "employeeReducer/updateEmployeeStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.employee.changeStatusEmployee(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//profile details
export const getEmployeeDetails = createAsyncThunk(
  "profileDetailsReducer/getEmployeeDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.profiledetails.getEmployeeDetails();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateEmployeeDetails = createAsyncThunk(
  "profileDetailsReducer/updateEmployeeDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.profiledetails.updateEmployeeDetails(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//change employee password
export const updateEmployeePassword = createAsyncThunk(
  "profileDetailsReducer/updateEmployeePassword",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.profiledetails.updateEmployeePassword(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveEmployee = createAsyncThunk(
  "employeeReducer/getActiveEmployee",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.employee.getActiveEmployee();
      // console.log(response);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSystemUserEmployee = createAsyncThunk(
  "employeeReducer/getSystemUserEmployee",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.employee.getSystemUserEmployee(payload?.employee);
      // console.log(response);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSystemUserEmployeeDropdown = createAsyncThunk(
  "employeeReducer/getSystemUserEmployeeDropdown",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.employee.getSystemUserEmployeeDropdown();
      // console.log(response);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateSystemUserEmployee = createAsyncThunk(
  "employeeReducer/updateSystemUserEmployee",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.employee.updateSystemUserEmployee(payload);
      // console.log(response);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateSystemUserEmployeePassword = createAsyncThunk(
  "employeeReducer/updateSystemUserEmployeePassword",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.employee.updateSystemUserEmployeePassword(payload);
      // console.log(response);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveEmployeeDropdown = createAsyncThunk(
  "employeeReducer/getActiveEmployeeDropdown",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.employee.getActiveEmployeeDropdown();
      return response?.data?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//employee settings

export const getEmployeeSettings = createAsyncThunk(
  "employeeSettingsReducer/getEmployeeSettings",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const { profiletype, employee } = payload;

      // Send a POST request to the view with profiletype and employee in the body
      const response = await employeeAPI.employeeSettings.getEmployeeSettings({ profiletype, employee });

      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateEmployeeSettings = createAsyncThunk(
  "employeeSettingsReducer/updateEmployeeSettings",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.employeeSettings.updateEmployeeSettings(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const updateMenuStyleSettings = createAsyncThunk(
  "employeeSettingsReducer/updateMenuStyleSettings",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.employeeSettings.updateMenuStyleSettings(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteEmployeeSettingsById = createAsyncThunk(
  "employeeSettingsReducer/deleteEmployeeSettingsById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.employee.deleteEmployeeSettingsByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
