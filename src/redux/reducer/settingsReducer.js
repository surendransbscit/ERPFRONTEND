import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createBranch,
  createCompany,
  createMenu,
  deleteBranchById,
  deleteCompanyById,
  fetchMenu,
  getAccessMenuOptions,
  getAllBranch,
  getAllCompany,
  getAllMenu,
  getBranchById,
  getCompanyById,
  getMenuById,
  updateBranchById,
  updateBranchStatus,
  updateCompanyById,
  updateMenuById,
  createSetting,
  getAllSetting,
  getSettingById,
  updateSettingById,
  deleteSettingByID,
  deleteMenu,
  createAccess,
  getAccess,
  createReportTemplate,
  getCheckBoxAccess,
  getCheckboxAccessMenuOptions,
  createAccessCheckBoxForm
} from "../thunks/settings";
import { toastsuccess } from "../../components/sds-toast-style/toast-style";

//company
export const companyReducerInitialState = {
  companyList: [],
  companyInfo: null,
  isError: null,
  isLoading: false,
};

export const companyReducer = createSlice({
  name: "companyReducer",
  initialState: companyReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCompany.fulfilled, (state, action) => {
      state.companyList = action.payload;
      state.companyInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getCompanyById.fulfilled, (state, action) => {
      state.companyInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteCompanyById.fulfilled, (state, action) => {
      toastsuccess("Company Deleted Successfully");
      state.companyInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllCompany.pending,
        getCompanyById.pending,
        createCompany.pending,
        updateCompanyById.pending,
        deleteCompanyById.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllCompany.rejected,
        getCompanyById.rejected,
        createCompany.rejected,
        updateCompanyById.rejected,
        deleteCompanyById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllCompany.fulfilled, createCompany.fulfilled, updateCompanyById.fulfilled),
      (state) => {
        state.companyInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//menu
export const menuReducerInitialState = {
  menuList: [],
  menuInfo: null,
  menuOptionList: [],
  menuAccessOptions: [],
  checkBoxMenuAccessOptions: [],
  accessList: null,
  checkBoxAccessList: null,
  isError: null,
  isLoading: false,
};

export const menuReducer = createSlice({
  name: "menuReducer",
  initialState: menuReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllMenu.fulfilled, (state, action) => {
      state.menuList = action.payload;
      state.menuInfo = null;
      state.isLoading = false;
    });
    builder.addCase(createReportTemplate.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
    });
    builder.addCase(getMenuById.fulfilled, (state, action) => {
      state.menuInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getAccess.fulfilled, (state, action) => {
      state.accessList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getCheckBoxAccess.fulfilled, (state, action) => {
      state.checkBoxAccessList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getCheckboxAccessMenuOptions.fulfilled, (state, action) => {
      state.checkBoxMenuAccessOptions = action.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchMenu.fulfilled, (state, action) => {
      state.menuOptionList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getAccessMenuOptions.fulfilled, (state, action) => {
      state.menuAccessOptions = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteMenu.fulfilled, (state, action) => {
      toastsuccess("Menu Deleted Successfully");
      state.menuInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllMenu.pending,
        getAccessMenuOptions.pending,
        getMenuById.pending,
        createMenu.pending,
        updateMenuById.pending,
        fetchMenu.pending,
        deleteMenu.pending,
        createAccess.pending,
        getAccess.pending,
        createReportTemplate.pending,
        getCheckboxAccessMenuOptions.pending,
        getCheckBoxAccess.pending,
        createAccessCheckBoxForm.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllMenu.rejected,
        getMenuById.rejected,
        createMenu.rejected,
        updateMenuById.rejected,
        fetchMenu.rejected,
        getAccessMenuOptions.rejected,
        deleteMenu.rejected,
        createAccess.rejected,
        getAccess.rejected,
        createReportTemplate.rejected,
        getCheckboxAccessMenuOptions.rejected,
        getCheckBoxAccess.rejected,
        createAccessCheckBoxForm.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(isAnyOf(createMenu.fulfilled, updateMenuById.fulfilled, createAccess.fulfilled,createAccessCheckBoxForm.fulfilled), (state) => {
      state.menuInfo = null;
      state.isLoading = false;
      state.isError = false;
    });
  },
});

//branch
const branchReducerInitialState = {
  branchList: [],
  branchInfo: null,
  isError: null,
  isLoading: false,
};

export const branchReducer = createSlice({
  name: "branchReducer",
  initialState: branchReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllBranch.fulfilled, (state, action) => {
      state.branchList = action.payload;
      state.branchInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getBranchById.fulfilled, (state, action) => {
      state.branchInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteBranchById.fulfilled, (state, action) => {
      toastsuccess("Branch Deleted Successfully");
      state.branchInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateBranchStatus.fulfilled, (state, action) => {
      toastsuccess("Branch Status changed Successfully");
      state.branchInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllBranch.pending,
        getBranchById.pending,
        createBranch.pending,
        updateBranchById.pending,
        deleteBranchById.pending,
        updateBranchStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllBranch.rejected,
        getBranchById.rejected,
        createBranch.rejected,
        updateBranchById.rejected,
        deleteBranchById.rejected,
        updateBranchStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllBranch.fulfilled, createBranch.fulfilled, updateBranchById.fulfilled, updateBranchStatus.fulfilled),
      (state, action) => {
        state.branchInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//setting
export const settingReducerInitialState = {
  settingList: [],
  settingInfo: null,
  isError: null,
  isLoading: false,
};

export const settingReducer = createSlice({
  name: "settingReducer",
  initialState: settingReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllSetting.fulfilled, (state, action) => {
      state.settingList = action.payload;
      state.settingInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getSettingById.fulfilled, (state, action) => {
      state.settingInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteSettingByID.fulfilled, (state, action) => {
      toastsuccess("Setting Deleted Successfully");
      state.settingInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllSetting.pending,
        getSettingById.pending,
        createSetting.pending,
        updateSettingById.pending,
        deleteSettingByID.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllSetting.rejected,
        getSettingById.rejected,
        createSetting.rejected,
        updateSettingById.rejected,
        deleteSettingByID.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllSetting.fulfilled, createSetting.fulfilled, updateSettingById.fulfilled),
      (state) => {
        state.settingInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});
