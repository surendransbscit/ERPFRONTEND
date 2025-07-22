import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { toastsuccess } from "../../components/sds-toast-style/toast-style";
import { 
    getProjectOptions,
    getAllProject,
    getProjectById,
    createProject,
    updateProjectById,
    deleteProjectById,
    updateProjectStatus,
    getAllTask,
    getTaskById,
    createTask,
    updateTaskById,
    deleteTaskById,
    getTaskOptions,
    updateTaskStatus,
    getSubTaskOptions,
    getAllSubTask,
    getSubTaskById,
    createSubTask,
    updateSubTaskById,
    deleteSubTaskById,
    updateSubTaskStatus,
    getEmployeeAttedanceOptions,
    getAllEmployeeAttedance,
    getEmployeeAttedanceById,
    createEmployeeAttedance,
    updateEmployeeAttedanceById,
    deleteEmployeeAttedanceById,
    updateEmployeeAttedanceStatus,
    searchPerformanceInvoice,
    createPerformanceInvoice,
    getPerformanceInvoiceOptions,
    getAllPerformanceInvoice,
    getPerformanceInvoiceById,
    updatePerformanceInvoiceById,
    deletePerformanceInvoiceById,
    getErpAttendanceOptions,
    getAllErpAttendance,
    getErpAttendanceById,
    createErpAttendance,
    updateErpAttendanceById,
    deleteErpAttendanceById,
    updateErpAttendanceStatus,
    getAllErpEmployeeDetails,
} from "../thunks/adminProject";


const projectReducerInitialState = {
  projectList: [],
  projectOptions: [],
  projectInfo: null,
  isLoading: false,
  isError: null,
};

export const projectReducer = createSlice({
  name: "projectReducer",
  initialState: projectReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProjectOptions.fulfilled, (state, action) => {
      state.projectOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getAllProject.fulfilled, (state, action) => {
      state.projectList = action.payload;
      state.projectInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getProjectById.fulfilled, (state, action) => {
      state.projectInfo = action.payload?.data;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getProjectOptions.pending,
        getAllProject.pending,
        createProject.pending,
        getProjectById.pending,
        updateProjectById.pending,
        deleteProjectById.pending,
        updateProjectStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getProjectOptions.rejected,
        getAllProject.rejected,
        createProject.rejected,
        getProjectById.rejected,
        updateProjectById.rejected,
        deleteProjectById.rejected,
        updateProjectStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );

    builder.addMatcher(
      isAnyOf(
        createProject.fulfilled,
        updateProjectById.fulfilled,
        deleteProjectById.fulfilled,
        updateProjectStatus.fulfilled
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.projectInfo = null;
        toastsuccess("Project updated successfully!");
      }
    );
  },
});




const taskReducerInitialState = {
  taskList: [],
  taskOptions: [],
  taskInfo: null,
  isLoading: false,
  isError: null,
};

export const  taskReducer = createSlice({
  name: "taskReducer",
  initialState: taskReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTaskOptions.fulfilled, (state, action) => {
      state.taskOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getAllTask.fulfilled, (state, action) => {
      state.taskList = action.payload;
      state.taskInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getTaskById.fulfilled, (state, action) => {
      state.taskInfo = action.payload?.data;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getTaskOptions.pending,
        getAllTask.pending,
        createTask.pending,
        getTaskById.pending,
        updateTaskById.pending,
        deleteTaskById.pending,
        updateTaskStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );

    builder.addMatcher(
      isAnyOf(
        getTaskOptions.rejected,
        getAllTask.rejected,
        createTask.rejected,
        getTaskById.rejected,
        updateTaskById.rejected,
        deleteTaskById.rejected,
        updateTaskStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );

    builder.addMatcher(
      isAnyOf(
        createTask.fulfilled,
        updateTaskById.fulfilled,
        deleteTaskById.fulfilled,
        updateTaskStatus.fulfilled
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.taskInfo = null;
        toastsuccess("Task updated successfully!");
      }
    );
  },
});



const subTaskReducerInitialState = {
  subTaskOptions: [],
  subTaskList: [],
  subTaskInfo: null,
  isError: null,
  isLoading: false,
};

export const subTaskReducer = createSlice({
  name: "subTaskReducer",
  initialState: subTaskReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSubTaskOptions.fulfilled, (state, action) => {
      state.subTaskOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getAllSubTask.fulfilled, (state, action) => {
      state.subTaskList = action.payload;
      state.subTaskInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getSubTaskById.fulfilled, (state, action) => {
      state.subTaskInfo = action.payload?.data;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getSubTaskOptions.pending,
        getAllSubTask.pending,
        createSubTask.pending,
        updateSubTaskById.pending,
        deleteSubTaskById.pending,
        updateSubTaskStatus.pending,
        getSubTaskById.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getSubTaskOptions.rejected,
        getAllSubTask.rejected,
        createSubTask.rejected,
        updateSubTaskById.rejected,
        deleteSubTaskById.rejected,
        updateSubTaskStatus.rejected,
        getSubTaskById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createSubTask.fulfilled,
        updateSubTaskById.fulfilled,
        deleteSubTaskById.fulfilled,
        updateSubTaskStatus.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.subTaskInfo = null;
        state.isError = false;
      }
    );
  },
});


const employeeAttedanceReducerInitialState = {
  employeeAttedanceOptions: [],
  employeeAttedanceList: [],
  employeeAttedanceInfo: null,
  isError: null,
  isLoading: false,
};

export const employeeAttedanceReducer = createSlice({
  name: "employeeAttedanceReducer",
  initialState: employeeAttedanceReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getEmployeeAttedanceOptions.fulfilled, (state, action) => {
      state.employeeAttedanceOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getAllEmployeeAttedance.fulfilled, (state, action) => {
      state.employeeAttedanceList = action.payload;
      state.employeeAttedanceInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getEmployeeAttedanceById.fulfilled, (state, action) => {
      state.employeeAttedanceInfo = action.payload?.data;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getEmployeeAttedanceOptions.pending,
        getAllEmployeeAttedance.pending,
        createEmployeeAttedance.pending,
        updateEmployeeAttedanceById.pending,
        deleteEmployeeAttedanceById.pending,
        updateEmployeeAttedanceStatus.pending,
        getEmployeeAttedanceById.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getEmployeeAttedanceOptions.rejected,
        getAllEmployeeAttedance.rejected,
        createEmployeeAttedance.rejected,
        updateEmployeeAttedanceById.rejected,
        deleteEmployeeAttedanceById.rejected,
        updateEmployeeAttedanceStatus.rejected,
        getEmployeeAttedanceById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createEmployeeAttedance.fulfilled,
        updateEmployeeAttedanceById.fulfilled,
        deleteEmployeeAttedanceById.fulfilled,
        updateEmployeeAttedanceStatus.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.employeeAttedanceInfo = null;
        state.isError = false;
      }
    );
  },
});

const performanceReducerInitialState = {
  performanceOptions: [],
  performanceList: [],
  performanceInfo: null,
  isError: null,
  isLoading: false,
};

export const performanceReducer = createSlice({
  name: "performanceReducer",
  initialState: performanceReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPerformanceInvoiceOptions.fulfilled, (state, action) => {
      state.performanceOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getAllPerformanceInvoice.fulfilled, (state, action) => {
      state.subTaskList = action.payload;
      state.performanceInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getPerformanceInvoiceById.fulfilled, (state, action) => {
      state.performanceInfo = action.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(searchPerformanceInvoice.fulfilled, (state, action) => {
      state.performanceInfo = action.payload?.data;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getPerformanceInvoiceOptions.pending,
        getAllPerformanceInvoice.pending,
        createPerformanceInvoice.pending,
        updatePerformanceInvoiceById.pending,
        deletePerformanceInvoiceById.pending,
        searchPerformanceInvoice.pending,
        getPerformanceInvoiceById.pending,
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getPerformanceInvoiceOptions.rejected,
        getAllPerformanceInvoice.rejected,
        createPerformanceInvoice.rejected,
        updatePerformanceInvoiceById.rejected,
        deletePerformanceInvoiceById.rejected,
        searchPerformanceInvoice.rejected,
        getPerformanceInvoiceById.rejected,
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createPerformanceInvoice.fulfilled,
        updatePerformanceInvoiceById.fulfilled,
        deletePerformanceInvoiceById.fulfilled,
        searchPerformanceInvoice.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.performanceInfo = null;
        state.isError = false;
      }
    );
  },
});

const ERPAttendanceReducerInitialState = {
  erpAttendanceOptions: [],
  erpAttendanceList: [],
  erpAttendanceInfo: null,
  isError: null,
  isLoading: false,
};

export const erpAttendanceReducer = createSlice({
  name: "erpAttendanceReducer",
  initialState: ERPAttendanceReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getErpAttendanceOptions.fulfilled, (state, action) => {
      state.erpAttendanceOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getAllErpAttendance.fulfilled, (state, action) => {
      state.erpAttendanceList = action.payload;
      state.erpAttendanceInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getAllErpEmployeeDetails.fulfilled, (state, action) => {
      state.erpAttendanceList = action.payload;
      state.erpAttendanceInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getErpAttendanceById.fulfilled, (state, action) => {
      state.erpAttendanceInfo = action.payload?.data;
      state.isLoading = false;
    });
    builder.addCase(updateEmployeeAttedanceStatus.fulfilled, (state, action) => {
      toastsuccess("Department Status changed Successfully");
      state.erpAttendanceInfo = null;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getErpAttendanceOptions.pending,
        getAllErpAttendance.pending,
        createErpAttendance.pending,
        getErpAttendanceById.pending,
        updateErpAttendanceById.pending,
        deleteErpAttendanceById.pending,
        updateErpAttendanceStatus.pending,
        getAllErpEmployeeDetails.pending,
        updateEmployeeAttedanceStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getErpAttendanceOptions.rejected,
        getAllErpAttendance.rejected,
        createErpAttendance.rejected,
        getErpAttendanceById.rejected,
        updateErpAttendanceById.rejected,
        deleteErpAttendanceById.rejected,
        updateErpAttendanceStatus.rejected,
        getAllErpEmployeeDetails.rejected,
        updateEmployeeAttedanceStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createErpAttendance.fulfilled,
        updateErpAttendanceById.fulfilled,
        deleteErpAttendanceById.fulfilled,
        updateErpAttendanceStatus.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.subTaskInfo = null;
        state.isError = false;
      }
    );
  },
});
