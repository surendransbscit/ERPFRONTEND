import { createAsyncThunk } from "@reduxjs/toolkit";
import settingsAPI from "../api/settingsAPI";
import { DispatchErrorHandler } from "../configs";

//company
export const createCompany = createAsyncThunk(
  "companyReducer/createCompany",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.company.create(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllCompany = createAsyncThunk(
  "companyReducer/getAllCompany",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.company.getAll();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCompanyById = createAsyncThunk(
  "companyReducer/getCompanyById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.company.get(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateCompanyById = createAsyncThunk(
  "companyReducer/updateCompanyById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.company.update(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteCompanyById = createAsyncThunk(
  "companyReducer/deleteCompanyById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.company.deleteCompanyByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
//menu

export const createMenu = createAsyncThunk("menuReducer/createMenu", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await settingsAPI.menu.createMenu(payload);
    return response || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getAllMenu = createAsyncThunk("menuReducer/getAllMenu", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await settingsAPI.menu.getAllMenu(payload?.page, payload?.records,payload?.search);
    return response?.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getMenuById = createAsyncThunk("menuReducer/getMenuById", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await settingsAPI.menu.getMenu(payload);
    return response?.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const updateMenuById = createAsyncThunk(
  "menuReducer/updateMenuById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.menu.updateMenu(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const fetchMenu = createAsyncThunk("menuReducer/fetchMenu", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await settingsAPI.menu.fetchMenu();
    return response?.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getAccessMenuOptions = createAsyncThunk(
  "menuReducer/getAccessMenuOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.menu.getAccessMenuOptions();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getCheckboxAccessMenuOptions = createAsyncThunk(
  "menuReducer/getCheckboxAccessMenuOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.menu.getCheckboxAccessMenuOptions();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const createAccessCheckBoxForm = createAsyncThunk(
  "menuReducer/createAccessCheckBoxForm",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.menu.createAccessCheckBoxForm(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const getCheckBoxAccess = createAsyncThunk(
  "menuReducer/getCheckBoxAccess",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.menu.getCheckBoxAccess(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const createAccess = createAsyncThunk("menuReducer/createAccess", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await settingsAPI.menu.createAccess(payload);
    return response?.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});
export const getAccess = createAsyncThunk("menuReducer/getAccess", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await settingsAPI.menu.getAccess(payload);
    return response?.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const deleteMenu = createAsyncThunk("menuReducer/deleteMenu", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await settingsAPI.menu.deleteMenu(payload);
    return response?.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

//branch
export const createBranch = createAsyncThunk(
  "branchReducer/createBranch",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.branch.createBranch(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllBranch = createAsyncThunk(
  "branchReducer/getAllBranch",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.branch.getAllBranch(payload?.page);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getBranchById = createAsyncThunk(
  "branchReducer/getBranchById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.branch.getBranchByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateBranchById = createAsyncThunk(
  "branchReducer/updateBranchById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.branch.updateBranchByID(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteBranchById = createAsyncThunk(
  "branchReducer/deleteBranchById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.branch.deleteBranchByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateBranchStatus = createAsyncThunk(
  "branchReducer/updateBranchStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.branch.changeStatusBranch(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Setting
export const createSetting = createAsyncThunk(
  "settingReducer/createSetting",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.setting.create(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllSetting = createAsyncThunk(
  "settingReducer/getAllSetting",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.setting.getAll();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteSettingByID = createAsyncThunk(
  "settingReducer/deleteSettingByID",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.setting.deleteSettingByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateSettingById = createAsyncThunk(
  "settingReducer/updateSettingById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.setting.update(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSettingById = createAsyncThunk(
  "settingReducer/getSettingById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.setting.get(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createReportTemplate = createAsyncThunk(
  "menuReducer/createReportTemplate",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await settingsAPI.menu.createReportTemplate(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);