import { createAsyncThunk } from "@reduxjs/toolkit";
import retailMasterAPI from "../api/retailmasterAPI";
import { DispatchErrorHandler } from "../configs";

//Relation Type
export const getRelationTypeOptions = createAsyncThunk(
  "relationTypeReducer/getRelationTypeOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.relation_type.getRelationTypeOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllRelationType = createAsyncThunk(
  "departmentReducer/getAllRelationType",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.relation_type.getAllRelationType(
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

export const createRelationType = createAsyncThunk(
  "departmentReducer/createRelationType",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.relation_type.createRelationType(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getRelationTypeById = createAsyncThunk(
  "departmentReducer/getRelationTypeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.relation_type.getRelationTypeById(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateRelationTypeById = createAsyncThunk(
  "departmentReducer/updateRelationTypeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.relation_type.updateRelationTypeById(
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

export const deleteRelationTypeById = createAsyncThunk(
  "departmentReducer/deleteRelationTypeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.relation_type.deleteRelationTypeById(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateRelationTypeStatus = createAsyncThunk(
  "departmentReducer/updateRelationTypeStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.relation_type.updateRelationTypeStatus(
          payload?.id
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//department
export const createDepartment = createAsyncThunk(
  "departmentReducer/createDepartment",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.department.create(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getDepartmentOptions = createAsyncThunk(
  "departmentReducer/getDepartmentOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.department.getOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllDepartment = createAsyncThunk(
  "departmentReducer/getAllDepartment",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.department.getAll(
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

export const getDepartmentById = createAsyncThunk(
  "departmentReducer/getDepartmentById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.department.get(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateDepartmentById = createAsyncThunk(
  "departmentReducer/updateDepartmentById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.department.update(
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

export const deleteDepartmentById = createAsyncThunk(
  "departmentReducer/deleteDepartmentById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.department.delete(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateDepartmentStatus = createAsyncThunk(
  "departmentReducer/updateDepartmentStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.department.changeStatusDepartment(
        payload?.id
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//employeeType
export const createEmployeeType = createAsyncThunk(
  "employeeTypeReducer/createEmployeeType",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.employeeType.createEmployeeType(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getEmployeeTypeOptions = createAsyncThunk(
  "employeeTypeReducer/getEmployeeTypeOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.employeeType.getEmployeeTypeOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllEmployeeType = createAsyncThunk(
  "employeeTypeReducer/getAllEmployeeType",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.employeeType.getAllEmployeeType(
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

export const getEmployeeTypeById = createAsyncThunk(
  "employeeTypeReducer/getEmployeeTypeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.employeeType.getEmployeeTypeByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateEmployeeTypeById = createAsyncThunk(
  "employeeTypeReducer/updateEmployeeTypeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.employeeType.updateEmployeeTypeByID(
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

///banner

export const createBanner = createAsyncThunk(
  "bannerReducer/createBanner",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.banner.createBanner(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getBannerOptions = createAsyncThunk(
  "bannerReducer/getBannerOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.banner.getBannerOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllBanner = createAsyncThunk(
  "bannerReducer/getAllBanner",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.banner.getAllBanner(
        payload?.page,
        payload?.records,
        payload?.search,
        payload?.path_name
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getBannerById = createAsyncThunk(
  "bannerReducer/getBannerById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.banner.getBannerByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateBannerById = createAsyncThunk(
  "bannerReducer/updateBannerById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.banner.updateBannerByID(
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

export const deleteBannerById = createAsyncThunk(
  "bannerReducer/deleteBannerById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.banner.deleteBannerByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//daily status

export const createDailyStatus = createAsyncThunk(
  "dailyStatusReducer/createDailyStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.dailystatus.createDailyStatus(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getDailyStatusOptions = createAsyncThunk(
  "dailyStatusReducer/getDailyStatusOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.dailystatus.getDailyStatusOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllDailyStatus = createAsyncThunk(
  "dailyStatusReducer/getAllDailyStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.dailystatus.getAllDailyStatus(
        payload?.page,
        payload?.records,
        payload?.search,
        payload?.path_name
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getDailyStatusById = createAsyncThunk(
  "dailyStatusReducer/getDailyStatusById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.dailystatus.getDailyStatusByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateDailyStatusById = createAsyncThunk(
  "dailyStatusReducer/updateDailyStatusById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.dailystatus.updateDailyStatusByID(
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

export const deleteDailyStatusById = createAsyncThunk(
  "dailyStatusReducer/deleteDailyStatusById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.dailystatus.deleteDailyStatusByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const changeStatusDailyStatus = createAsyncThunk(
  "dailyStatusReducer/changeStatusDailyStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.dailystatus.changeStatusDailyStatus(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//notification

export const createNotification = createAsyncThunk(
  "notificationReducer/createNotification",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.notification.createNotification(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getNotificationOptions = createAsyncThunk(
  "notificationReducer/getNotificationOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.notification.getNotificationOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllNotification = createAsyncThunk(
  "notificationReducer/getAllNotification",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.notification.getAllNotification(
        payload?.page,
        payload?.records,
        payload?.search,
        payload?.path_name
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getNotificationById = createAsyncThunk(
  "notificationReducer/getNotificationById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.notification.getNotificationByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateNotificationById = createAsyncThunk(
  "notificationReducer/updateNotificationById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.notification.updateNotificationByID(
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

export const deleteNotificationById = createAsyncThunk(
  "notificationReducer/deleteNotificationById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.notification.deleteNotificationByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//designation
export const createDesignation = createAsyncThunk(
  "designationReducer/createDesignation",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.designation.create(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllDesignation = createAsyncThunk(
  "designationReducer/getAllDesignation",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.designation.getAll(
        payload?.page,
        payload?.records,
        payload?.search
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getDesignationByDepartment = createAsyncThunk(
  "designationReducer/getDesignationByDepartment",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.designation.getByDepartment(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getDesignationById = createAsyncThunk(
  "designationReducer/getDesignationById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.designation.get(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateDesignationById = createAsyncThunk(
  "designationReducer/updateDesignationById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.designation.update(
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

export const updateDesignationStatus = createAsyncThunk(
  "designationReducer/updateDesignationStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.designation.changeStatusDesignation(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteDesignationById = createAsyncThunk(
  "designationReducer/deleteDesignationById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.designation.deleteDesignation(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//area
export const createArea = createAsyncThunk(
  "areaReducer/createArea",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.area.create(payload);
      return response?.data || null;
    } catch (error) {
      console.log(error);
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllArea = createAsyncThunk(
  "areaReducer/getAllArea",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.area.getAll(
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

export const getAreaById = createAsyncThunk(
  "areaReducer/getAreaById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.area.get(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateAreaStatus = createAsyncThunk(
  "areaReducer/updateAreaStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.area.changeStatus(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteAreaById = createAsyncThunk(
  "areaReducer/deleteAreaById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.area.delete(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateAreaById = createAsyncThunk(
  "areaReducer/updateAreaById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.area.update(
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

//bank

export const createBank = createAsyncThunk(
  "bankReducer/createBank",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.bank.create(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllBank = createAsyncThunk(
  "bankReducer/getAllBank",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.bank.getAll(
        payload?.page,
        payload?.records,
        payload?.search,
        payload?.path_name
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getBankById = createAsyncThunk(
  "bankReducer/getBankById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.bank.get(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateBankById = createAsyncThunk(
  "bankReducer/updateBankById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.bank.update(
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

export const updateBankStatus = createAsyncThunk(
  "bankReducer/updateBankStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.bank.changeStatusbank(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteBankById = createAsyncThunk(
  "bankReducer/deleteBankById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.bank.deleteBank(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//financial year

export const createFinancialYear = createAsyncThunk(
  "financialYearReducer/createFinancialYear",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.financialyear.create(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllFinancialYear = createAsyncThunk(
  "financialYearReducer/getAllFinancialYear",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.financialyear.getAll(
        payload?.page,
        payload?.records,
        payload?.search,
        payload?.path_name
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getFinancialYearById = createAsyncThunk(
  "financialYearReducer/getFinancialYearById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.financialyear.get(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateFinancialYearById = createAsyncThunk(
  "financialYearReducer/updateFinancialYearById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.financialyear.update(
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

export const deleteFinancialYearById = createAsyncThunk(
  "financialYearReducer/deleteFinancialYearById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.financialyear.delete(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateFinancialYeaStatus = createAsyncThunk(
  "financialYearReducer/updateFinancialYeaStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.financialyear.changeStatusFinYear(
        payload?.id
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Profile
export const createProfile = createAsyncThunk(
  "profileReducer/createProfile",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.profile.createProfile(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllProfile = createAsyncThunk(
  "profileReducer/getAllProfile",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.profile.getAllProfile(
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

export const getAllActiveProfile = createAsyncThunk(
  "profileReducer/getAllActiveProfile",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.profile.getAllActiveProfile();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getProfileById = createAsyncThunk(
  "profileReducer/getProfileById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.profile.getProfileByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateProfileById = createAsyncThunk(
  "profileReducer/updateProfileById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.profile.updateProfileByID(
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

export const updateProfileStatus = createAsyncThunk(
  "profileReducer/updateProfileStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.profile.updateProfileStatus(
        payload?.id
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const deleteProfileById = createAsyncThunk(
  "profileReducer/deleteProfileById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.profile.deleteProfileByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//RETUOM
export const createRetUom = createAsyncThunk(
  "uomReducer/createRetUom",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.retuom.createRetUom(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getRetUomById = createAsyncThunk(
  "uomReducer/getRetUomById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.retuom.getRetUomByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateRetUomById = createAsyncThunk(
  "uomReducer/updateRetUomById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.retuom.updateRetUomByID(
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

export const getAllRetUom = createAsyncThunk(
  "uomReducer/getAllRetUom",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.retuom.getAllRetUom(
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

export const getUomList = createAsyncThunk(
  "uomReducer/getUomList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.retuom.getUomList();
      return response.data.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateRetUomStatus = createAsyncThunk(
  "uomReducer/updateProfileStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.retuom.updateRetUomStatus(
        payload?.id
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const deleteRetUomById = createAsyncThunk(
  "uomReducer/deleteRetUomById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.retuom.deleteRetUomByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//country
export const createCountry = createAsyncThunk(
  "countryReducer/createCountry",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.country.createCountry(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllCountry = createAsyncThunk(
  "countryReducer/getAllCountry",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.country.getAllCountry(
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

export const getCountryById = createAsyncThunk(
  "countryReducer/getCountryById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.country.getCountryByID(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateCountryById = createAsyncThunk(
  "countryReducer/updateCountryById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.country.updateCountryByID(
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

export const deleteCountryById = createAsyncThunk(
  "countryReducer/deleteCountryById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.country.deleteCountryByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//state
export const createState = createAsyncThunk(
  "stateReducer/createState",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.state.createState(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllState = createAsyncThunk(
  "stateReducer/getAllState",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.state.getAllState(
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

export const getStateById = createAsyncThunk(
  "stateReducer/getStateById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.state.getStateByID(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateStateById = createAsyncThunk(
  "stateReducer/updateStateById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.state.updateStateByID(
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

export const deleteStateById = createAsyncThunk(
  "stateReducer/deleteStateById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.state.deleteStateByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//city

export const createCity = createAsyncThunk(
  "cityReducer/createCity",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.city.createCity(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllCity = createAsyncThunk(
  "cityReducer/getAllCity",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.city.getAllCity(
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

export const getCityById = createAsyncThunk(
  "cityReducer/getCityById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.city.getCityByID(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateCityById = createAsyncThunk(
  "cityReducer/updateCityById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.city.updateCityByID(
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

export const deleteCityById = createAsyncThunk(
  "cityReducer/deleteCityById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.city.deleteCityByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//metal rates

export const createMetalRate = createAsyncThunk(
  "metalRateReducer/createMetalRate",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.metalRate.createMetalRate(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllMetalRate = createAsyncThunk(
  "metalRateReducer/getAllMetalRate",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.metalRate.getAllMetalRate(
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

export const getMetalRateById = createAsyncThunk(
  "metalRateReducer/getMetalRateById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.metalRate.getMetalRateByID(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateMetalRateById = createAsyncThunk(
  "metalRateReducer/updateMetalRateById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.metalRate.updateMetalRateByID(
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

export const getCurrentMetalRate = createAsyncThunk(
  "metalRateReducer/getCurrentMetalRate",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.metalRate.getCurrentMetalRate(
        payload
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCategoryMetalRate = createAsyncThunk(
  "metalRateReducer/getCategoryMetalRate",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.metalRate.getCategoryMetalRate(
        payload
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Metal Purity Rate Master
export const getAllMetalPurityRate = createAsyncThunk(
  "metalPurityRateReducer/getAllMetalPurityRate",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.metalPurityRate.getAllMetalPurityRate(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Tax Master
export const getActiveTaxMaster = createAsyncThunk(
  "taxmasterReducer/getActiveTaxMaster",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.taxmaster.getActiveTaxMaster(
        payload
      );
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createTax = createAsyncThunk(
  "taxmasterReducer/createTax",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.taxmaster.createTax(payload);
      return response || null;
    } catch (error) {
      console.log(error);
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllTax = createAsyncThunk(
  "taxmasterReducer,/getAllTax",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.taxmaster.getAllTax(
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

export const getTaxById = createAsyncThunk(
  "taxmasterReducer,/getTaxById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.taxmaster.getTaxByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateTaxById = createAsyncThunk(
  "taxmasterReducer,/updateTaxById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.taxmaster.updateTaxByID(
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

export const updateTaxStatus = createAsyncThunk(
  "taxmasterReducer,/updateTaxStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.taxmaster.updateTaxStatus(
        payload?.id
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteTaxById = createAsyncThunk(
  "taxmasterReducer,/deleteTaxById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.taxmaster.deleteTaxByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//attribute entry
export const createAttributeEntry = createAsyncThunk(
  "attributeEntryReducer/createAttributeEntry",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.attributeEntry.createAttributeEntry(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllAttributeEntry = createAsyncThunk(
  "attributeEntryReducer/getAllAttributeEntry",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.attributeEntry.getAllAttributeEntry(
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

export const getAttributeEntryById = createAsyncThunk(
  "attributeEntryReducer/getAttributeEntryById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.attributeEntry.getAttributeEntryByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateAttributeEntryById = createAsyncThunk(
  "attributeEntryReducer/updateAttributeEntryById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.attributeEntry.updateAttributeEntryByID(
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

export const updateAttributeEntryStatus = createAsyncThunk(
  "attributeEntryReducer/updateAttributeEntryStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.attributeEntry.changeStatusAttributeEntry(
          payload?.id
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteAttributeEntryById = createAsyncThunk(
  "attributeEntryReducer/deleteAttributeEntryById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.attributeEntry.deleteAttributeEntryByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveAttribute = createAsyncThunk(
  "otherChargesReducer/getActiveAttribute",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.attributeEntry.getActiveAttribute(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//other charges
export const createOtherCharges = createAsyncThunk(
  "otherChargesReducer/createOtherCharges",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.otherCharges.createOtherCharges(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllOtherCharges = createAsyncThunk(
  "otherChargesReducer/getAllOtherCharges",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.otherCharges.getAllOtherCharges(
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

export const getOtherChargesById = createAsyncThunk(
  "otherChargesReducer/getOtherChargesById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.otherCharges.getOtherChargesByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateOtherChargesById = createAsyncThunk(
  "otherChargesReducer/updateOtherChargesById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.otherCharges.updateOtherChargesByID(
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

export const updateOtherChargesStatus = createAsyncThunk(
  "otherChargesReducer/updateOtherChargesStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.otherCharges.changeStatusOtherCharges(
          payload?.id
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteOtherChargesById = createAsyncThunk(
  "otherChargesReducer/deleteOtherChargesById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.otherCharges.deleteOtherChargesByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveCharges = createAsyncThunk(
  "otherChargesReducer/getActiveCharges",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.otherCharges.getActiveCharges(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//day close
export const dayClose = createAsyncThunk(
  "dayCloseReducer/dayClose",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.dayClose.dayCloseManual(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//pay device
export const createPayDevice = createAsyncThunk(
  "payDeviceReducer/createPayDevice",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.payDevice.createPayDevice(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllPayDevice = createAsyncThunk(
  "payDeviceReducer/getAllPayDevice",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.payDevice.getAllPayDevice(
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

export const getPayDeviceById = createAsyncThunk(
  "payDeviceReducer/getPayDeviceById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.payDevice.getPayDeviceByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updatePayDeviceById = createAsyncThunk(
  "payDeviceReducer/updatePayDeviceById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.payDevice.updatePayDeviceByID(
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

export const updatePayDeviceStatus = createAsyncThunk(
  "payDeviceReducer/updatePayDeviceStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.payDevice.changeStatusPayDevice(
        payload?.id
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deletePayDeviceById = createAsyncThunk(
  "payDeviceReducer/deletePayDeviceById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.payDevice.deletePayDeviceByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//stock issue type

export const createStockIssueType = createAsyncThunk(
  "stockIssueTypeReducer/createStockIssueType",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.stockIssueType.createStockIssueType(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllStockIssueType = createAsyncThunk(
  "stockIssueTypeReducer/getAllStockIssueType",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.stockIssueType.getAllStockIssueType(
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

export const getStockIssueTypeById = createAsyncThunk(
  "stockIssueTypeReducer/getStockIssueTypeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.stockIssueType.getStockIssueTypeByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateStockIssueTypeById = createAsyncThunk(
  "stockIssueTypeReducer/updateStockIssueTypeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.stockIssueType.updateStockIssueTypeByID(
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

export const updateStockIssueTypeStatus = createAsyncThunk(
  "stockIssueTypeReducer/updateStockIssueTypeStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.stockIssueType.changeStatusStockIssueType(
          payload?.id
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteStockIssueTypeById = createAsyncThunk(
  "stockIssueTypeReducer/deleteStockIssueTypeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.stockIssueType.deleteStockIssueTypeByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveStockIssueType = createAsyncThunk(
  "stockIssueTypeReducer/getActiveStockIssueType",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.stockIssueType.getActiveStockIssueType(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//karigar

export const createSupplier = createAsyncThunk(
  "karigarReducer/createSupplier",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.karigar.createSupplier(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllSupplier = createAsyncThunk(
  "karigarReducer/getAllSupplier",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.karigar.getAllSupplier(
        payload?.page,
        payload?.records,
        payload?.search,
        payload?.path_name
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSupplierById = createAsyncThunk(
  "karigarReducer/getSupplierById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.karigar.getSupplierByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateSupplierById = createAsyncThunk(
  "karigarReducer/updateSupplierById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.karigar.updateSupplierByID(
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

export const updateSupplierStatus = createAsyncThunk(
  "karigarReducer/updateSupplierStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.karigar.changeStatusSupplier(
        payload?.id
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteSupplierById = createAsyncThunk(
  "karigarReducer/deleteSupplierById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.karigar.deleteSupplierByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveSupplier = createAsyncThunk(
  "karigarReducer/getActiveSupplier",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.karigar.getActiveSupplier(payload);
      return response.data.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getLocalVendorSupplier = createAsyncThunk(
  "karigarReducer/getLocalVendorSupplier",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.karigar.getLocalVendorSupplier(
        payload
      );
      return response.data.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Supplier Product
export const createSupplierProduct = createAsyncThunk(
  "karigarReducer/createSupplierProduct",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.karigar.createSupplierProduct(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSupplierProductById = createAsyncThunk(
  "karigarReducer/getSupplierProductById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.karigar.getSupplierProductByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//weight range
export const createWeightRange = createAsyncThunk(
  "weightRangeReducer/createWeightRange",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.weightrange.createWeightRange(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const editWeightRange = createAsyncThunk(
  "weightRangeReducer/editWeightRange",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.weightrange.editWeightRange(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllWeightRange = createAsyncThunk(
  "weightRangeReducer/getAllWeightRange",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.weightrange.getAllWeightRange(
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

export const getWeightRangeById = createAsyncThunk(
  "weightRangeReducer/getWeightRangeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.weightrange.getWeightRangeByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateWeightRangeById = createAsyncThunk(
  "weightRangeReducer/updateWeightRangeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.weightrange.updateWeightRangeByID(
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

export const updateWeightRangeStatus = createAsyncThunk(
  "weightRangeReducer/updateWeightRangeStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.weightrange.changeStatusWeightRange(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteWeightRangeById = createAsyncThunk(
  "weightRangeReducer/deleteWeightRangeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.weightrange.deleteWeightRangeByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//floor
export const createFloor = createAsyncThunk(
  "floorReducer/createFloor",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.floor.createFloor(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllFloor = createAsyncThunk(
  "floorReducer/getAllFloor",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.floor.getAllFloor(
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

export const getFloorById = createAsyncThunk(
  "floorReducer/getFloorById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.floor.getFloorByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateFloorById = createAsyncThunk(
  "floorReducer/updateFloorById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.floor.updateFloorByID(
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

export const updateFloorStatus = createAsyncThunk(
  "floorReducer/updateFloorStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.floor.changeStatusFloor(
        payload?.id
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteFloorById = createAsyncThunk(
  "floorReducer/deleteFloorById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.floor.deleteFloorByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getFloorOptions = createAsyncThunk(
  "floorReducer/getFloorOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.floor.getFloorOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//counter
export const createCounter = createAsyncThunk(
  "counterReducer/createCounter",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.counter.createCounter(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllCounter = createAsyncThunk(
  "counterReducer/getAllCounter",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.counter.getAllCounter(
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

export const getCounterById = createAsyncThunk(
  "counterReducer/getCounterById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.counter.getCounterByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateCounterById = createAsyncThunk(
  "counterReducer/updateCounterById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.counter.updateCounterByID(
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

export const updateCounterStatus = createAsyncThunk(
  "counterReducer/updateCounterStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.counter.changeStatusCounter(
        payload?.id
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteCounterById = createAsyncThunk(
  "counterReducer/deleteCounterById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.counter.deleteCounterByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCounterOptions = createAsyncThunk(
  "counterReducer/getCounterOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.counter.getCounterOptions();
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//registered device
export const createRegisteredDevice = createAsyncThunk(
  "registeredDeviceReducer/createRegisteredDevice",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.registered_device.createRegisteredDevice(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllRegisteredDevice = createAsyncThunk(
  "registeredDeviceReducer/getAllRegisteredDevice",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.registered_device.getAllRegisteredDevice(
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

export const getRegisteredDeviceById = createAsyncThunk(
  "registeredDeviceReducer/getRegisteredDeviceById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.registered_device.getRegisteredDeviceByID(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateRegisteredDeviceById = createAsyncThunk(
  "registeredDeviceReducer/updateRegisteredDeviceById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.registered_device.updateRegisteredDeviceByID(
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

export const updateRegisteredDeviceStatus = createAsyncThunk(
  "registeredDeviceReducer/updateRegisteredDeviceStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.registered_device.changeStatusRegisteredDevice(
          payload?.id
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteRegisteredDeviceById = createAsyncThunk(
  "registeredDeviceReducer/deleteRegisteredDeviceById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.registered_device.deleteRegisteredDeviceByID(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//section wise sales

export const createSectionWiseSales = createAsyncThunk(
  "sectionWiseSalesReducer/createSectionWiseSales",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.section_wise_sales.createSectionWiseSales(
          payload
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSectionWiseSalesItems = createAsyncThunk(
  "sectionWiseSalesReducer/getSectionWiseSalesItems",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.section_wise_sales.getSectionWiseSalesItems(
          payload
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

// export const getAllSectionWiseSales = createAsyncThunk(
//   "sectionWiseSalesReducer/getAllSectionWiseSales",
//   async (payload = {}, { rejectWithValue }) => {
//     try {
//       const response = await retailMasterAPI.section_wise_sales.getAllSectionWiseSalesDevice(
//         payload?.page,
//         payload?.records
//       );
//       return response?.data || null;
//     } catch (error) {
//       DispatchErrorHandler(error);
//       return rejectWithValue(error);
//     }
//   }
// );

// export const getSectionWiseSalesById = createAsyncThunk(
//   "sectionWiseSalesReducer/getSectionWiseSalesById",
//   async (payload = {}, { rejectWithValue }) => {
//     try {
//       const response = await retailMasterAPI.section_wise_sales.getSectionWiseSalesByID(payload);
//       return response?.data || null;
//     } catch (error) {
//       DispatchErrorHandler(error);
//       return rejectWithValue(error);
//     }
//   }
// );

// export const updateSectionWiseSalesById = createAsyncThunk(
//   "sectionWiseSalesReducer/updateSectionWiseSalesById",
//   async (payload = {}, { rejectWithValue }) => {
//     try {
//       const response = await retailMasterAPI.section_wise_sales.updateSectionWiseSalesByID(
//         payload?.id,
//         payload?.putData
//       );
//       return response || null;
//     } catch (error) {
//       DispatchErrorHandler(error);
//       return rejectWithValue(error);
//     }
//   }
// );

// export const updateSectionWiseSalesStatus = createAsyncThunk(
//   "sectionWiseSalesReducer/updateSectionWiseSalesStatus",
//   async (payload = {}, { rejectWithValue }) => {
//     try {
//       const response = await retailMasterAPI.section_wise_sales.changeStatusSectionWiseSales(payload?.id);
//       return response || null;
//     } catch (error) {
//       DispatchErrorHandler(error);
//       return rejectWithValue(error);
//     }
//   }
// );

// export const deleteSectionWiseSalesById = createAsyncThunk(
//   "sectionWiseSalesReducer/deleteSectionWiseSalesById",
//   async (payload = {}, { rejectWithValue }) => {
//     try {
//       const response = await retailMasterAPI.section_wise_sales.deleteSectionWiseSalesByID(payload);
//       return response?.data || null;
//     } catch (error) {
//       DispatchErrorHandler(error);
//       return rejectWithValue(error);
//     }
//   }
// );

//profession
export const createProfession = createAsyncThunk(
  "professionReducer/createProfession",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.profession.createProfession(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllProfession = createAsyncThunk(
  "professionReducer/getAllProfession",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.profession.getAllProfession(
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

export const getActiveProfessions = createAsyncThunk(
  "professionReducer/getActiveProfessions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.profession.getActiveProfessions();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getProfessionById = createAsyncThunk(
  "professionReducer/getProfessionById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.profession.getProfessionByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateProfessionById = createAsyncThunk(
  "professionReducer/updateProfessionById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.profession.updateProfessionByID(
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

export const updateProfessionStatus = createAsyncThunk(
  "professionReducer/updateProfessionStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.profession.changeStatusProfession(
        payload?.id
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteProfessionById = createAsyncThunk(
  "professionReducer/deleteProfessionById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.profession.deleteProfessionByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//region
export const createRegion = createAsyncThunk(
  "regionReducer/createRegion",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.region.createRegion(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllRegion = createAsyncThunk(
  "regionReducer/getAllRegion",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.region.getAllRegion(
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

export const getActiveRegions = createAsyncThunk(
  "regionReducer/getActiveRegions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.region.getActiveRegions();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getRegionById = createAsyncThunk(
  "regionReducer/getRegionById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.region.getRegionByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateRegionById = createAsyncThunk(
  "regionReducer/updateRegionById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.region.updateRegionByID(
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

export const updateRegionStatus = createAsyncThunk(
  "regionReducer/updateRegionStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.region.changeStatusRegion(
        payload?.id
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteRegionById = createAsyncThunk(
  "regionReducer/deleteRegionById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.region.deleteRegionByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Container
export const createContainer = createAsyncThunk(
  "containerReducer/createContainer",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.container.createContainer(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllContainer = createAsyncThunk(
  "containerReducer/getAllContainer",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.container.getAllContainer(
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

export const getActiveContainers = createAsyncThunk(
  "containerReducer/getActiveContainers",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.container.getActiveContainers();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getContainerById = createAsyncThunk(
  "containerReducer/getContainerById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.container.getContainerByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getContainerPdfById = createAsyncThunk(
  "containerReducer/getContainerPdfById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.container.getContainerPdfByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateContainerById = createAsyncThunk(
  "containerReducer/updateContainerById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.container.updateContainerByID(
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

export const updateContainerStatus = createAsyncThunk(
  "containerReducer/updateContainerStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.container.changeStatusContainer(
        payload?.id
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteContainerById = createAsyncThunk(
  "containerReducer/deleteContainerById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.container.deleteContainerByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//OldMetalItem
export const createOldMetalItem = createAsyncThunk(
  "oldMetalItemReducer/createOldMetalItem",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.oldMetalItem.createOldMetalItem(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllOldMetalItem = createAsyncThunk(
  "oldMetalItemReducer/getAllOldMetalItem",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.oldMetalItem.getAllOldMetalItem(
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

export const getOldMetalItemById = createAsyncThunk(
  "oldMetalItemReducer/getOldMetalItemById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.oldMetalItem.getOldMetalItemByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateOldMetalItemById = createAsyncThunk(
  "oldMetalItemReducer/updateOldMetalItemById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.oldMetalItem.updateOldMetalItemByID(
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

export const updateOldMetalItemStatus = createAsyncThunk(
  "oldMetalItemReducer/updateOldMetalItemStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.oldMetalItem.changeStatusOldMetalItem(
          payload?.id
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteOldMetalItemById = createAsyncThunk(
  "oldMetalItemReducer/deleteOldMetalItemById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.oldMetalItem.deleteOldMetalItemByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveOldMetalItem = createAsyncThunk(
  "oldMetalItemReducer/getActiveOldMetalItem",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.oldMetalItem.getActiveOldMetalItem();
      return response?.data?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//OtherWeight
export const createOtherWeight = createAsyncThunk(
  "otherWeightReducer/createOtherWeight",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.otherWeight.createOtherWeight(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllOtherWeight = createAsyncThunk(
  "otherWeightReducer/getAllOtherWeight",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.otherWeight.getAllOtherWeight(
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

export const getOtherWeightById = createAsyncThunk(
  "otherWeightReducer/getOtherWeightById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.otherWeight.getOtherWeightByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateOtherWeightById = createAsyncThunk(
  "otherWeightReducer/updateOtherWeightById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.otherWeight.updateOtherWeightByID(
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

export const updateOtherWeightStatus = createAsyncThunk(
  "otherWeightReducer/updateOtherWeightStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.otherWeight.changeStatusOtherWeight(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteOtherWeightById = createAsyncThunk(
  "otherWeightReducer/deleteOtherWeightById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.otherWeight.deleteOtherWeightByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveOtherWeight = createAsyncThunk(
  "otherWeightReducer/getActiveOtherWeight",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.otherWeight.getActiveOtherWeight();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//CashOpeningBalance
export const createCashOpeningBalance = createAsyncThunk(
  "cashOpeningBalanceReducer/createCashOpeningBalance",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.cashOpeningBalance.createCashOpeningBalance(
          payload
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllCashOpeningBalance = createAsyncThunk(
  "cashOpeningBalanceReducer/getAllCashOpeningBalance",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.cashOpeningBalance.getAllCashOpeningBalance(
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

export const getCashOpeningBalanceById = createAsyncThunk(
  "cashOpeningBalanceReducer/getCashOpeningBalanceById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.cashOpeningBalance.getCashOpeningBalanceByID(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateCashOpeningBalanceById = createAsyncThunk(
  "cashOpeningBalanceReducer/updateCashOpeningBalanceById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.cashOpeningBalance.updateCashOpeningBalanceByID(
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

export const updateCashOpeningBalanceStatus = createAsyncThunk(
  "cashOpeningBalanceReducer/updateCashOpeningBalanceStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.cashOpeningBalance.changeStatusCashOpeningBalance(
          payload?.id
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteCashOpeningBalanceById = createAsyncThunk(
  "cashOpeningBalanceReducer/deleteCashOpeningBalanceById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.cashOpeningBalance.deleteCashOpeningBalanceByID(
          payload
        );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveCashOpeningBalance = createAsyncThunk(
  "cashOpeningBalanceReducer/getActiveCashOpeningBalance",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.cashOpeningBalance.getActiveCashOpeningBalance();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//AccountHead
export const createAccountHead = createAsyncThunk(
  "accountHeadReducer/createAccountHead",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.accountHead.createAccountHead(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllAccountHead = createAsyncThunk(
  "accountHeadReducer/getAllAccountHead",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.accountHead.getAllAccountHead(
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

export const getAccountHeadById = createAsyncThunk(
  "accountHeadReducer/getAccountHeadById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.accountHead.getAccountHeadByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateAccountHeadById = createAsyncThunk(
  "accountHeadReducer/updateAccountHeadById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.accountHead.updateAccountHeadByID(
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

export const updateAccountHeadStatus = createAsyncThunk(
  "accountHeadReducer/updateAccountHeadStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.accountHead.changeStatusAccountHead(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteAccountHeadById = createAsyncThunk(
  "accountHeadReducer/deleteAccountHeadById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.accountHead.deleteAccountHeadByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveAccountHead = createAsyncThunk(
  "accountHeadReducer/getActiveAccountHead",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.accountHead.getActiveAccountHead();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Service
export const createService = createAsyncThunk(
  "serviceReducer/createService",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.service.createService(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllService = createAsyncThunk(
  "serviceReducer/getAllService",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.service.getAllService(
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

export const getServiceById = createAsyncThunk(
  "serviceReducer/getServiceById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.service.getServiceByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateServiceById = createAsyncThunk(
  "serviceReducer/updateServiceById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.service.updateServiceByID(
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

export const updateServiceStatus = createAsyncThunk(
  "serviceReducer/updateServiceStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.service.changeStatusService(
        payload?.id
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteServiceById = createAsyncThunk(
  "serviceReducer/deleteServiceById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.service.deleteServiceByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveService = createAsyncThunk(
  "serviceReducer/getActiveService",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.service.getActiveService();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getServiceOptions = createAsyncThunk(
  "serviceReducer/getServiceOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.service.getServiceOptions();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//CustomerProof
export const createCustomerProof = createAsyncThunk(
  "customerProofReducer/createCustomerProof",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.customerProof.createCustomerProof(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllCustomerProof = createAsyncThunk(
  "customerProofReducer/getAllCustomerProof",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.customerProof.getAllCustomerProof(
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

export const getCustomerProofById = createAsyncThunk(
  "customerProofReducer/getCustomerProofById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.customerProof.getCustomerProofByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateCustomerProofById = createAsyncThunk(
  "customerProofReducer/updateCustomerProofById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.customerProof.updateCustomerProofByID(
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

export const updateCustomerProofStatus = createAsyncThunk(
  "customerProofReducer/updateCustomerProofStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.customerProof.changeStatusCustomerProof(
          payload?.id
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteCustomerProofById = createAsyncThunk(
  "customerProofReducer/deleteCustomerProofById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.customerProof.deleteCustomerProofByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveCustomerProof = createAsyncThunk(
  "customerProofReducer/getActiveCustomerProof",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.customerProof.getActiveCustomerProof();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllCatMetalPurityRate = createAsyncThunk(
  "metalPurityRateReducer/getAllCatMetalPurityRate",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.metalPurityRate.getAllCatMetalPurityRate(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createBankDeposit = createAsyncThunk(
  "bankDepositReducer/createBankDeposit",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.bankDeposit.create(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllBankDeposit = createAsyncThunk(
  "bankDepositReducer/getAllBankDeposit",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.bankDeposit.getAll(
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

export const getBankDepositById = createAsyncThunk(
  "bankDepositReducer/getBankDepositById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.bankDeposit.get(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateBankDepositById = createAsyncThunk(
  "bankDepositReducer/updateBankDepositById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.bankDeposit.update(
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

export const updateBankDepositStatus = createAsyncThunk(
  "bankDepositReducer/updateBankDepositStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.bankDeposit.changeStatusbank(
        payload?.id
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteBankDepositById = createAsyncThunk(
  "bankDepositReducer/deleteBankDepositById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.bankDeposit.deleteBank(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCashBalance = createAsyncThunk(
  "bankDepositReducer/getCashBalance",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.bankDeposit.getCashBalance(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

///deposit master

export const createDepositMaster = createAsyncThunk(
  "depositMasterReducer/createDepositMaster",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.depositMaster.createDepositMaster(
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllDepositMaster = createAsyncThunk(
  "depositMasterReducer/getAllPayDevice",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.depositMaster.getAllDepositMaster(
        payload?.page,
        payload?.records,
        payload?.search,
        payload?.path_name
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getDepositMasterOptions = createAsyncThunk(
  "depositMasterReducer/getDepositMasterOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.depositMaster.getDepositMasterOptions();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getDepositMasterById = createAsyncThunk(
  "depositMasterReducer/getDepositMasterById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.depositMaster.getDepositMasterByID(
        payload
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateDepositMasterById = createAsyncThunk(
  "depositMasterReducer/updateDepositMasterById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.depositMaster.updateDepositMasterByID(
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

export const updateDepositMasterStatus = createAsyncThunk(
  "depositMasterReducer/updateDepositMasterStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.depositMaster.changeStatusDepositMaster(
          payload?.id
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteDepositMasterById = createAsyncThunk(
  "depositMasterReducer/deleteDepositMasterById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.depositMaster.deleteDepositMasterByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createIncentiveSettings = createAsyncThunk(
  "incentiveSettingsReducer/createIncentiveSettings",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.incentiveSettings.create(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getIncentiveSettingsById = createAsyncThunk(
  "incentiveSettingsReducer/getIncentiveSettingsById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.incentiveSettings.get(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllIncentiveSettings = createAsyncThunk(
  "incentiveSettingsReducer/getAllIncentiveSettings",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.incentiveSettings.getAll(
        payload?.page,
        payload?.records,
        payload?.search,
        payload?.path_name
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateIncentiveSettings = createAsyncThunk(
  "incentiveSettingsReducer/updateIncentiveSettings",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.incentiveSettings.update(
        payload?.id,
        payload
      );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteIncentiveSettingsById = createAsyncThunk(
  "incentiveSettingsReducer/deleteIncentiveSettingsById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await retailMasterAPI.incentiveSettings.delete(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//religion master

export const createReligionMaster = createAsyncThunk(
  "religionMasterReducer/createReligionMaster",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.religionMaster.createReligionMaster(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllReligionMaster = createAsyncThunk(
  "religionMasterReducer/getAllReligionMaster",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.religionMaster.getAllReligionMaster(
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

export const getReligionMasterOptions = createAsyncThunk(
  "religionMasterReducer/getReligionMasterOptions",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.religionMaster.getReligionMasterOptions();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getReligionMasterById = createAsyncThunk(
  "religionMasterReducer/getReligionMasterById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.religionMaster.getReligionMasterByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateReligionMasterById = createAsyncThunk(
  "religionMasterReducer/updateReligionMasterById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.religionMaster.updateReligionMasterByID(
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

export const updateReligionMasterStatus = createAsyncThunk(
  "religionMasterReducer/updateReligionMasterStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.religionMaster.changeStatusReligionMaster(
          payload?.id
        );
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteReligionMasterById = createAsyncThunk(
  "religionMasterReducer/deleteReligionMasterById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response =
        await retailMasterAPI.religionMaster.deleteReligionMasterByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
