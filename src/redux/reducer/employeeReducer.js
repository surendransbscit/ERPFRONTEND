import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { toastsuccess } from "../../components/sds-toast-style/toast-style";
import {
  createEmployee,
  deleteEmployeeById,
  getAllEmployee,
  getEmployeeById,
  getEmployeeDetails,
  updateEmployeeById,
  updateEmployeeDetails,
  updateEmployeePassword,
  updateEmployeeStatus,
  getActiveEmployee,
  getActiveEmployeeDropdown,
  deleteEmployeeSettingsById,
  updateEmployeeSettings,
  getEmployeeSettings,
  updateMenuStyleSettings,
  getSystemUserEmployee,
  updateSystemUserEmployee,
  getSystemUserEmployeeDropdown,
  updateSystemUserEmployeePassword,
} from "../thunks/employee";

const employeeReducerInitialState = {
  employeeList: [],
  activeEmployeeList: [],
  sysUserEmployeeList: [],
  sysUserEmployeeDropdown: [],
  activeEmployeeDropdown: [],
  employeeInfo: null,
  isError: null,
  isLoading: false,
};

export const employeeReducer = createSlice({
  name: "employeeReducer",
  initialState: employeeReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllEmployee.fulfilled, (state, action) => {
      state.employeeList = action.payload;
      state.employeeInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getActiveEmployee.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.activeEmployeeList = action.payload;
      state.employeeInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getActiveEmployeeDropdown.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.activeEmployeeDropdown = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getEmployeeById.fulfilled, (state, action) => {
      state.employeeInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getSystemUserEmployee.fulfilled, (state, action) => {
      state.sysUserEmployeeList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getSystemUserEmployeeDropdown.fulfilled, (state, action) => {
      state.sysUserEmployeeDropdown = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteEmployeeById.fulfilled, (state, action) => {
      toastsuccess("Employee Deleted Successfully");
      state.employeeInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateEmployeeStatus.fulfilled, (state, action) => {
      toastsuccess("Employee Status changed Successfully");
      state.employeeInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllEmployee.pending,
        getEmployeeById.pending,
        createEmployee.pending,
        updateEmployeeById.pending,
        deleteEmployeeById.pending,
        updateEmployeeStatus.pending,
        getActiveEmployeeDropdown.pending,
        getSystemUserEmployee.pending,
        updateSystemUserEmployee.pending,
        updateSystemUserEmployeePassword.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllEmployee.rejected,
        getEmployeeById.rejected,
        createEmployee.rejected,
        updateEmployeeById.rejected,
        deleteEmployeeById.rejected,
        updateEmployeeStatus.rejected,
        getActiveEmployeeDropdown.rejected,
        getSystemUserEmployee.rejected,
        updateSystemUserEmployee.rejected,
        updateSystemUserEmployeePassword.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllEmployee.fulfilled,
        createEmployee.fulfilled,
        updateEmployeeById.fulfilled,
        updateEmployeeStatus.fulfilled,
        updateSystemUserEmployee.fulfilled,
        updateSystemUserEmployeePassword.fulfilled
      ),
      (state) => {
        state.employeeInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

const profileDetailsInitialState = {
  profileDetailsList: [],
  profileDetailsInfo: {},
  isError: null,
  isLoading: false,
};

export const profileDetailsReducer = createSlice({
  name: "profileDetailsReducer",
  initialState: profileDetailsInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getEmployeeDetails.fulfilled, (state, action) => {
      state.profileDetailsInfo = action.payload;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(getEmployeeDetails.pending, updateEmployeeDetails.pending, updateEmployeePassword.pending),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getEmployeeDetails.rejected, updateEmployeeDetails.rejected, updateEmployeePassword.rejected),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(isAnyOf(updateEmployeeDetails.fulfilled, updateEmployeePassword.fulfilled), (state) => {
      state.profileDetailsInfo = null;
      state.isLoading = false;
      state.isError = false;
    });
  },
});

//employee settings

export const employeeSettingsReducerInitialState = {
  employeeSettingsList: [],
  employeeSettingsInfo: null,
  isError: null,
  isLoading: false,
};

export const employeeSettingsReducer = createSlice({
  name: "employeeSettingsReducer",
  initialState: employeeSettingsReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getEmployeeSettings.fulfilled, (state, action) => {
      state.employeeSettingsList = action.payload;
      state.employeeSettingsInfo = null;
      state.isLoading = false;
    });

    builder.addCase(deleteEmployeeSettingsById.fulfilled, (state, action) => {
      toastsuccess("Employee Settings Deleted Successfully");
      state.employeeSettingsInfo = null;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getEmployeeSettings.pending,
        deleteEmployeeSettingsById.pending,
        updateEmployeeSettings.pending,
        updateMenuStyleSettings.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        deleteEmployeeSettingsById.rejected,
        getEmployeeSettings.rejected,
        updateEmployeeSettings.rejected,
        updateMenuStyleSettings.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(isAnyOf(updateEmployeeSettings.fulfilled, updateMenuStyleSettings.fulfilled), (state) => {
      state.isLoading = false;
      state.isError = false;
    });
  },
});
