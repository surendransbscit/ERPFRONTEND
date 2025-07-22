import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createArea,
  createBank,
  createCity,
  createCountry,
  createDepartment,
  createDesignation,
  createEmployeeType,
  createFinancialYear,
  createMetalRate,
  createProfile,
  createState,
  getAllArea,
  getAllBank,
  getAllCity,
  getAllCountry,
  getAllDepartment,
  getAllDesignation,
  getAllEmployeeType,
  getAllFinancialYear,
  getAllMetalRate,
  getCurrentMetalRate,
  getAllProfile,
  getAllState,
  getAreaById,
  getBankById,
  getCityById,
  getCountryById,
  getDepartmentById,
  getDepartmentOptions,
  getDesignationByDepartment,
  getDesignationById,
  getEmployeeTypeById,
  getEmployeeTypeOptions,
  getFinancialYearById,
  getMetalRateById,
  getProfileById,
  getStateById,
  updateAreaById,
  updateBankById,
  updateCityById,
  updateCountryById,
  updateDepartmentById,
  updateDesignationById,
  updateEmployeeTypeById,
  updateFinancialYearById,
  updateMetalRateById,
  updateProfileById,
  updateStateById,
  getAllMetalPurityRate,
  deleteAreaById,
  deleteDepartmentById,
  deleteFinancialYearById,
  updateAreaStatus,
  updateFinancialYeaStatus,
  updateDepartmentStatus,
  updateDesignationStatus,
  deleteBankById,
  updateBankStatus,
  deleteDesignationById,
  getActiveSupplier,
  getAllRetUom,
  getUomList,
  getRetUomById,
  deleteRetUomById,
  updateRetUomStatus,
  getAllTax,
  createTax,
  getTaxById,
  updateTaxById,
  updateTaxStatus,
  deleteTaxById,
  getActiveTaxMaster,
  getAllAttributeEntry,
  createAttributeEntry,
  getAttributeEntryById,
  updateAttributeEntryById,
  updateAttributeEntryStatus,
  deleteAttributeEntryById,
  getAllOtherCharges,
  getOtherChargesById,
  deleteOtherChargesById,
  updateOtherChargesStatus,
  createOtherCharges,
  updateOtherChargesById,
  getActiveCharges,
  getActiveAttribute,
  dayClose,
  getAllPayDevice,
  getPayDeviceById,
  deletePayDeviceById,
  updatePayDeviceStatus,
  createPayDevice,
  updatePayDeviceById,
  getAllStockIssueType,
  createStockIssueType,
  getStockIssueTypeById,
  deleteStockIssueTypeById,
  updateStockIssueTypeStatus,
  updateStockIssueTypeById,
  getActiveStockIssueType,
  getAllSupplier,
  getSupplierById,
  deleteSupplierById,
  updateSupplierStatus,
  createSupplier,
  updateSupplierById,
  getAllWeightRange,
  createWeightRange,
  getWeightRangeById,
  deleteWeightRangeById,
  updateWeightRangeStatus,
  updateWeightRangeById,
  getAllFloor,
  getFloorById,
  deleteFloorById,
  updateFloorStatus,
  createFloor,
  updateFloorById,
  getAllCounter,
  createCounter,
  getCounterById,
  updateCounterById,
  updateCounterStatus,
  deleteCounterById,
  getFloorOptions,
  getAllRegisteredDevice,
  getRegisteredDeviceById,
  deleteRegisteredDeviceById,
  updateRegisteredDeviceStatus,
  createRegisteredDevice,
  updateRegisteredDeviceById,
  getCounterOptions,
  createSectionWiseSales,
  getSectionWiseSalesItems,
  getAllProfession,
  getProfessionById,
  deleteProfessionById,
  updateProfessionStatus,
  createProfession,
  updateProfessionById,
  getActiveProfessions,
  getRelationTypeOptions,
  getAllContainer,
  getContainerById,
  deleteContainerById,
  updateContainerStatus,
  createContainer,
  updateContainerById,
  getAllOldMetalItem,
  getOldMetalItemById,
  deleteOldMetalItemById,
  updateOldMetalItemStatus,
  createOldMetalItem,
  updateOldMetalItemById,
  getActiveContainers,
  getContainerPdfById,
  getActiveOldMetalItem,
  getAllOtherWeight,
  getOtherWeightById,
  getActiveOtherWeight,
  deleteOtherWeightById,
  updateOtherWeightStatus,
  createOtherWeight,
  updateOtherWeightById,
  getAllCashOpeningBalance,
  getCashOpeningBalanceById,
  getActiveCashOpeningBalance,
  deleteCashOpeningBalanceById,
  updateCashOpeningBalanceStatus,
  createCashOpeningBalance,
  updateCashOpeningBalanceById,
  getAllAccountHead,
  getAccountHeadById,
  getActiveAccountHead,
  deleteAccountHeadById,
  updateAccountHeadStatus,
  createAccountHead,
  updateAccountHeadById,
  getAllService,
  getServiceById,
  getActiveService,
  deleteServiceById,
  updateServiceStatus,
  createService,
  updateServiceById,
  getServiceOptions,
  getAllCustomerProof,
  getCustomerProofById,
  getActiveCustomerProof,
  deleteCustomerProofById,
  updateCustomerProofStatus,
  createCustomerProof,
  updateCustomerProofById,
  deleteCountryById,
  deleteStateById,
  deleteCityById,
  createSupplierProduct,
  getSupplierProductById,
  getAllCatMetalPurityRate,
  getAllBankDeposit,
  getBankDepositById,
  createBankDeposit,
  updateBankDepositById,
  deleteBankDepositById,
  getCashBalance,
  getAllRelationType,
  createRelationType,
  updateRelationTypeById,
  deleteRelationTypeById,
  updateRelationTypeStatus,
  getRelationTypeById,
  getAllDepositMaster,
  getDepositMasterById,
  createDepositMaster,
  deleteDepositMasterById,
  updateDepositMasterStatus,
  updateDepositMasterById,
  getDepositMasterOptions,
  createIncentiveSettings,
  getAllIncentiveSettings,
  getIncentiveSettingsById,
  updateIncentiveSettings,
  deleteIncentiveSettingsById,
  getAllReligionMaster,
  getReligionMasterOptions,
  getReligionMasterById,
  deleteReligionMasterById,
  updateReligionMasterStatus,
  createReligionMaster,
  updateReligionMasterById,
  getCategoryMetalRate,
  getAllActiveProfile,
  getAllBanner,
  getBannerById,
  getBannerOptions,
  updateBannerById,
  createBanner,
  deleteBannerById,
  createNotification,
  getNotificationOptions,
  getAllNotification,
  getNotificationById,
  updateNotificationById,
  deleteNotificationById,
  createDailyStatus,
  getDailyStatusOptions,
  getAllDailyStatus,
  getDailyStatusById,
  updateDailyStatusById,
  deleteDailyStatusById,
  changeStatusDailyStatus,
  getLocalVendorSupplier,
  getAllRegion,
  getRegionById,
  getActiveRegions,
  deleteRegionById,
  updateRegionStatus,
  createRegion,
  updateRegionById
} from "../thunks/retailMaster";
import { toastsuccess } from "../../components/sds-toast-style/toast-style";

const relationTypeReducerInitialState = {
  relationTypeOptions: [],
  relationTypeList: [],
  relationTypeInfo: null,
  isError: null,
  isLoading: false,
};

export const relationTypeReducer = createSlice({
  name: "relationTypeReducer",
  initialState: relationTypeReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRelationTypeOptions.fulfilled, (state, action) => {
      state.relationTypeOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getAllRelationType.fulfilled, (state, action) => {
      state.relationTypeList = action.payload;
      state.relationTypeInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getRelationTypeById.fulfilled, (state, action) => {
      state.relationTypeInfo = action.payload?.data;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getRelationTypeOptions.pending,
        getAllRelationType.pending,
        createRelationType.pending,
        updateRelationTypeById.pending,
        deleteRelationTypeById.pending,
        updateRelationTypeStatus.pending,
        getRelationTypeById.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getRelationTypeOptions.rejected,
        getAllRelationType.rejected,
        createRelationType.rejected,
        updateRelationTypeById.rejected,
        deleteRelationTypeById.rejected,
        updateRelationTypeStatus.rejected,
        getRelationTypeById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createRelationType.fulfilled,
        updateRelationTypeById.fulfilled,
        deleteRelationTypeById.fulfilled,
        updateRelationTypeStatus.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.relationTypeInfo = null;
        state.isError = false;
      }
    );
  },
});

const designationReducerInitialState = {
  designationList: [],
  designationOptions: [],
  designationInfo: null,
  isError: null,
  isLoading: false,
};

export const designationReducer = createSlice({
  name: "designationReducer",
  initialState: designationReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllDesignation.fulfilled, (state, action) => {
      state.designationList = action.payload.data;
      state.designationInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getDesignationById.fulfilled, (state, action) => {
      state.designationInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getDesignationByDepartment.fulfilled, (state, action) => {
      state.designationOptions = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteDesignationById.fulfilled, (state, action) => {
      toastsuccess("Designation Deleted Successfully");
      state.designationInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateDesignationStatus.fulfilled, (state, action) => {
      toastsuccess("Designation Status changed Successfully");
      state.designationInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllDesignation.pending,
        getDesignationById.pending,
        createDesignation.pending,
        updateDesignationById.pending,
        getDesignationByDepartment.pending,
        updateDesignationStatus.pending,
        deleteDesignationById.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllDesignation.rejected,
        getDesignationById.rejected,
        createDesignation.rejected,
        updateDesignationById.rejected,
        getDesignationByDepartment.rejected,
        updateDesignationStatus.rejected,
        deleteDesignationById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllDesignation.fulfilled,
        getDesignationByDepartment.fulfilled,
        createDesignation.fulfilled,
        updateDesignationById.fulfilled,
        updateDesignationStatus.fulfilled,
        deleteDesignationById.fulfilled
      ),
      (state) => {
        state.designationInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

const departmentReducerInitialState = {
  departmentList: [],
  departmentOptions: [],
  departmentInfo: null,
  isError: null,
  isLoading: false,
};

export const departmentReducer = createSlice({
  name: "departmentReducer",
  initialState: departmentReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllDepartment.fulfilled, (state, action) => {
      state.departmentList = action.payload;
      state.departmentInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getDepartmentById.fulfilled, (state, action) => {
      state.departmentInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getDepartmentOptions.fulfilled, (state, action) => {
      state.departmentOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(deleteDepartmentById.fulfilled, (state, action) => {
      toastsuccess("Department Deleted Successfully");
      state.departmentInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateDepartmentStatus.fulfilled, (state, action) => {
      toastsuccess("Department Status changed Successfully");
      state.departmentInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllDepartment.pending,
        getDepartmentById.pending,
        createDepartment.pending,
        updateDepartmentById.pending,
        getDepartmentOptions.pending,
        deleteDepartmentById.pending,
        updateDepartmentStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllDepartment.rejected,
        getDepartmentById.rejected,
        createDepartment.rejected,
        updateDepartmentById.rejected,
        getDepartmentOptions.rejected,
        deleteDepartmentById.rejected,
        updateDepartmentStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllDepartment.fulfilled,
        createDepartment.fulfilled,
        updateDepartmentById.fulfilled,
        getDepartmentOptions.fulfilled,
        updateDepartmentStatus.fulfilled
      ),
      (state) => {
        state.departmentInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

const employeeTypeInitialState = {
  employeeTypeList: [],
  employeeTypeOptions: [],
  employeeTypeInfo: null,
  isError: null,
  isLoading: false,
};

export const employeeTypeReducer = createSlice({
  name: "employeeTypeReducer",
  initialState: employeeTypeInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllEmployeeType.fulfilled, (state, action) => {
      state.employeeTypeList = action.payload;
      state.employeeTypeInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getEmployeeTypeById.fulfilled, (state, action) => {
      state.employeeTypeInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getEmployeeTypeOptions.fulfilled, (state, action) => {
      state.employeeTypeOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllEmployeeType.pending,
        getEmployeeTypeById.pending,
        createEmployeeType.pending,
        updateEmployeeTypeById.pending,
        getEmployeeTypeOptions.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllEmployeeType.rejected,
        getEmployeeTypeById.rejected,
        createEmployeeType.rejected,
        updateEmployeeTypeById.rejected,
        getEmployeeTypeOptions.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllEmployeeType.fulfilled,
        createEmployeeType.fulfilled,
        updateEmployeeTypeById.fulfilled,
        getEmployeeTypeOptions.fulfilled
      ),
      (state) => {
        state.employeeTypeInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//banner
const bannerInitialState = {
  bannerList: [],
  bannerOptions: [],
  bannerInfo: null,
  isError: null,
  isLoading: false,
};

export const bannerReducer = createSlice({
  name: "bannerReducer",
  initialState: bannerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllBanner.fulfilled, (state, action) => {
      state.bannerList = action.payload;
      state.bannerInfo = null;
      state.isLoading = false;
    });
    builder.addCase(deleteBannerById.fulfilled, (state, action) => {
      toastsuccess("Banner Deleted Successfully");
      state.bannerInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getBannerById.fulfilled, (state, action) => {
      state.bannerInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getBannerOptions.fulfilled, (state, action) => {
      state.bannerOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllBanner.pending,
        getBannerById.pending,
        createBanner.pending,
        updateBannerById.pending,
        getBannerOptions.pending,
        deleteBannerById.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllBanner.rejected,
        getBannerById.rejected,
        createBanner.rejected,
        updateBannerById.rejected,
        getBannerOptions.rejected,
        deleteBannerById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllBanner.fulfilled,
        createBanner.fulfilled,
        updateBannerById.fulfilled,
        getBannerOptions.fulfilled
      ),
      (state) => {
        state.bannerInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});


//daily status

const dailyStatusInitialState = {
  dailyStatusList: [],
  dailyStatusOptions: [],
  dailyStatusInfo: null,
  isError: null,
  isLoading: false,
};

export const dailyStatusReducer = createSlice({
  name: "dailyStatusReducer",
  initialState: dailyStatusInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllDailyStatus.fulfilled, (state, action) => {
      state.dailyStatusList = action.payload;
      state.dailyStatusInfo = null;
      state.isLoading = false;
    });
    builder.addCase(deleteDailyStatusById.fulfilled, (state, action) => {
      toastsuccess("Daily Status Deleted Successfully");
      state.dailyStatusInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getDailyStatusById.fulfilled, (state, action) => {
      state.dailyStatusInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getDailyStatusOptions.fulfilled, (state, action) => {
      state.dailyStatusOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(changeStatusDailyStatus.fulfilled, (state, action) => {
      toastsuccess("Daily status changed Successfully");
      state.dailyStatusInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllDailyStatus.pending,
        getDailyStatusById.pending,
        createDailyStatus.pending,
        updateDailyStatusById.pending,
        getDailyStatusOptions.pending,
        deleteDailyStatusById.pending,
        changeStatusDailyStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllDailyStatus.rejected,
        getDailyStatusById.rejected,
        createDailyStatus.rejected,
        updateDailyStatusById.rejected,
        getDailyStatusOptions.rejected,
        deleteDailyStatusById.rejected,
        changeStatusDailyStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllDailyStatus.fulfilled,
        createDailyStatus.fulfilled,
        updateDailyStatusById.fulfilled,
        getDailyStatusOptions.fulfilled
      ),
      (state) => {
        state.dailyStatusInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//notification

const notificationInitialState = {
  notificationList: [],
  notificationOptions: [],
  notificationInfo: null,
  isError: null,
  isLoading: false,
};

export const notificationReducer = createSlice({
  name: "notificationReducer",
  initialState: notificationInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllNotification.fulfilled, (state, action) => {
      state.notificationList = action.payload;
      state.notificationInfo = null;
      state.isLoading = false;
    });
    builder.addCase(deleteNotificationById.fulfilled, (state, action) => {
      toastsuccess("Notification Deleted Successfully");
      state.notificationInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getNotificationById.fulfilled, (state, action) => {
      state.notificationInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getNotificationOptions.fulfilled, (state, action) => {
      state.notificationOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllNotification.pending,
        getNotificationById.pending,
        createNotification.pending,
        updateNotificationById.pending,
        getNotificationOptions.pending,
        deleteNotificationById.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllNotification.rejected,
        getNotificationById.rejected,
        createNotification.rejected,
        updateNotificationById.rejected,
        getNotificationOptions.rejected,
        deleteNotificationById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllNotification.fulfilled,
        createNotification.fulfilled,
        updateNotificationById.fulfilled,
        getBannerOptions.fulfilled
      ),
      (state) => {
        state.notificationInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});




//area
const areaReducerInitialState = {
  areaList: [],
  areaInfo: null,
  isError: null,
  isLoading: false,
};

export const areaReducer = createSlice({
  name: "areaReducer",
  initialState: areaReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllArea.fulfilled, (state, action) => {
      state.areaList = action.payload;
      state.areaInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getAreaById.fulfilled, (state, action) => {
      state.areaInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteAreaById.fulfilled, (state, action) => {
      toastsuccess("Area Deleted Successfully");
      state.areaInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateAreaStatus.fulfilled, (state, action) => {
      toastsuccess("Area Status changed Successfully");
      state.areaInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllArea.pending,
        getAreaById.pending,
        createArea.pending,
        updateAreaById.pending,
        deleteAreaById.pending,
        updateAreaStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllArea.rejected,
        getAreaById.rejected,
        createArea.rejected,
        updateAreaById.rejected,
        deleteAreaById.rejected,
        updateAreaStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(isAnyOf(getAllArea.fulfilled, createArea.fulfilled, updateAreaById.fulfilled), (state) => {
      state.areaInfo = null;
      state.isLoading = false;
      state.isError = false;
    });
  },
});

//bank
const bankReducerInitialState = {
  bankList: [],
  bankInfo: null,
  isError: null,
  isLoading: false,
};

export const bankReducer = createSlice({
  name: "bankReducer",
  initialState: bankReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllBank.fulfilled, (state, action) => {
      state.bankList = action.payload;
      state.bankInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getBankById.fulfilled, (state, action) => {
      state.bankInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteBankById.fulfilled, (state, action) => {
      toastsuccess("Bank Deleted Successfully");
      state.bankInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateBankStatus.fulfilled, (state, action) => {
      toastsuccess("Bank Status changed Successfully");
      state.bankInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllBank.pending,
        getBankById.pending,
        createBank.pending,
        updateBankById.pending,
        deleteBankById.pending,
        updateBankStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllBank.rejected,
        getBankById.rejected,
        createBank.rejected,
        updateBankById.rejected,
        deleteBankById.rejected,
        updateBankStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllBank.fulfilled,
        createBank.fulfilled,
        updateBankById.fulfilled,
        deleteBankById.fulfilled,
        updateBankStatus.fulfilled
      ),
      (state) => {
        state.areaInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//Financial
const financialYearReducerInitialState = {
  financialYearList: [],
  financialYearInfo: null,
  isError: null,
  isLoading: false,
};

export const financialYearReducer = createSlice({
  name: "financialYearReducer",
  initialState: financialYearReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllFinancialYear.fulfilled, (state, action) => {
      state.financialYearList = action.payload;
      state.financialYearInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getFinancialYearById.fulfilled, (state, action) => {
      state.financialYearInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteFinancialYearById.fulfilled, (state, action) => {
      toastsuccess("Financial Year Deleted Successfully");
      state.financialYearInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateFinancialYeaStatus.fulfilled, (state, action) => {
      toastsuccess("Financial Year Status changed Successfully");
      state.financialYearInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllFinancialYear.pending,
        getFinancialYearById.pending,
        createFinancialYear.pending,
        updateFinancialYearById.pending,
        deleteFinancialYearById.pending,
        updateFinancialYeaStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllFinancialYear.rejected,
        getFinancialYearById.rejected,
        createFinancialYear.rejected,
        updateFinancialYearById.rejected,
        deleteFinancialYearById.rejected,
        updateFinancialYeaStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllFinancialYear.fulfilled,
        createFinancialYear.fulfilled,
        updateFinancialYearById.fulfilled,
        updateFinancialYeaStatus.fulfilled
      ),
      (state) => {
        state.financialYearInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

const profileReducerInitialState = {
  profileList: [],
  activeProfileList: [],
  profileInfo: null,
  isError: null,
  isLoading: false,
};

export const profileReducer = createSlice({
  name: "profileReducer",
  initialState: profileReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllProfile.fulfilled, (state, action) => {
      state.profileList = action.payload;
      state.profileInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getProfileById.fulfilled, (state, action) => {
      state.profileInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getAllActiveProfile.fulfilled, (state, action) => {
      state.activeProfileList = action.payload;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(getAllProfile.pending, getProfileById.pending, createProfile.pending, updateProfileById.pending, getAllActiveProfile.pending),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllProfile.rejected, getProfileById.rejected, createProfile.rejected, updateProfileById.rejected, getAllActiveProfile.rejected),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllProfile.fulfilled, createProfile.fulfilled, updateProfileById.fulfilled),
      (state) => {
        state.profileInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//UOM
export const uomReducerInitialState = {
  uomList: [],
  uomOptions: [],
  uomInfo: null,
  isError: null,
  isLoading: false,
};

export const uomReducer = createSlice({
  name: "uomReducer",
  initialState: uomReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllRetUom.fulfilled, (state, action) => {
      state.uomList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getUomList.fulfilled, (state, action) => {
      state.uomOptions = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getRetUomById.fulfilled, (state, action) => {
      state.uomInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteRetUomById.fulfilled, (state, action) => {
      toastsuccess("UOM Deleted Successfully");
      state.uomInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateRetUomStatus.fulfilled, (state, action) => {
      toastsuccess("UOM Status changed Successfully");
      state.uomInfo = null;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getAllRetUom.pending,
        getUomList.pending,
        getRetUomById.pending,
        deleteRetUomById.pending,
        updateRetUomStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllRetUom.rejected,
        getUomList.rejected,
        getRetUomById.rejected,
        deleteRetUomById.rejected,
        updateRetUomStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
  },
});

//country
const countryReducerInitialState = {
  countryList: [],
  countryInfo: null,
  isError: null,
  isLoading: false,
};

export const countryReducer = createSlice({
  name: "countryReducer",
  initialState: countryReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCountry.fulfilled, (state, action) => {
      state.countryList = action.payload;
      state.countryInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getCountryById.fulfilled, (state, action) => {
      state.countryInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(deleteCountryById.fulfilled, (state, action) => {
      toastsuccess("Country Deleted Successfully");
      state.countryInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllCountry.pending,
        getCountryById.pending,
        createCountry.pending,
        updateCountryById.pending,
        deleteCountryById.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllCountry.rejected,
        getCountryById.rejected,
        createCountry.rejected,
        updateCountryById.rejected,
        deleteCountryById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllCountry.fulfilled,
        createCountry.fulfilled,
        updateCountryById.fulfilled),
      (state) => {
        state.countryInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

const stateReducerInitialState = {
  stateList: [],
  stateInfo: null,
  isError: null,
  isLoading: false,
};

export const stateReducer = createSlice({
  name: "stateReducer",
  initialState: stateReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllState.fulfilled, (state, action) => {
      state.stateList = action.payload;
      state.stateInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getStateById.fulfilled, (state, action) => {
      state.stateInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(deleteStateById.fulfilled, (state, action) => {
      toastsuccess("State Deleted Successfully");
      state.stateInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllState.pending,
        getStateById.pending,
        createState.pending,
        updateStateById.pending,
        deleteStateById.pending,
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllState.rejected,
        getStateById.rejected,
        createState.rejected,
        updateStateById.rejected,
        deleteStateById.rejected),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(isAnyOf(
      getAllState.fulfilled,
      createState.fulfilled,
      updateStateById.fulfilled
    ), (state) => {
      state.stateInfo = null;
      state.isLoading = false;
      state.isError = false;
    });
  },
});

//CITY
const cityReducerInitialState = {
  cityList: [],
  cityInfo: null,
  isError: null,
  isLoading: false,
};

export const cityReducer = createSlice({
  name: "cityReducer",
  initialState: cityReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCity.fulfilled, (state, action) => {
      state.cityList = action.payload;
      state.cityInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getCityById.fulfilled, (state, action) => {
      state.cityInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(deleteCityById.fulfilled, (state, action) => {
      toastsuccess("City Deleted Successfully");
      state.cityInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllCity.pending,
        getCityById.pending,
        createCity.pending,
        updateCityById.pending,
        deleteCityById.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllCity.rejected,
        getCityById.rejected,
        createCity.rejected,
        updateCityById.rejected,
        deleteCityById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(isAnyOf(
      getAllCity.fulfilled,
      createCity.fulfilled,
      updateCityById.fulfilled
    ), (state) => {
      state.cityInfo = null;
      state.isLoading = false;
      state.isError = false;
    });
  },
});

//metal rate

const metalRateReducerInitialState = {
  metalRateList: [],
  metalRateInfo: null,
  catMetalRateInfo: null,
  individualMetalRateInfo: null,
  isError: null,
  isLoading: false,
};

export const metalRateReducer = createSlice({
  name: "metalRateReducer",
  initialState: metalRateReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllMetalRate.fulfilled, (state, action) => {
      state.metalRateList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getMetalRateById.fulfilled, (state, action) => {
      state.individualMetalRateInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getCurrentMetalRate.fulfilled, (state, action) => {
      state.metalRateInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getCategoryMetalRate.fulfilled, (state, action) => {
      state.catMetalRateInfo = action.payload;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllMetalRate.pending,
        getMetalRateById.pending,
        createMetalRate.pending,
        updateMetalRateById.pending,
        getCurrentMetalRate.pending,
        getCategoryMetalRate.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllMetalRate.rejected,
        getMetalRateById.rejected,
        createMetalRate.rejected,
        updateMetalRateById.rejected,
        getCurrentMetalRate.rejected,
        getCurrentMetalRate.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllMetalRate.fulfilled, createMetalRate.fulfilled, updateMetalRateById.fulfilled),
      (state) => {
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//Metal Rate Purity Master

const metalPurityRateReducerInitialState = {
  metalPurityRateList: [],
  catPurityRateList: [],

  isError: null,
  isLoading: false,
};

export const metalPurityRateReducer = createSlice({
  name: "metalPurityRateReducer",
  initialState: metalPurityRateReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllMetalPurityRate.fulfilled, (state, action) => {
      console.log(action.payload.data);
      state.metalPurityRateList = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(getAllCatMetalPurityRate.fulfilled, (state, action) => {
      state.catPurityRateList = action.payload;
      state.isLoading = false;
    });

    builder.addMatcher(isAnyOf(getAllMetalPurityRate.pending), (state) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getAllMetalPurityRate.rejected), (state, action) => {
      state.isLoading = false;
      state.isError = true;
    });
    builder.addMatcher(isAnyOf(getAllMetalPurityRate.fulfilled), (state) => {
      state.metalRateInfo = null;
      state.isLoading = false;
      state.isError = false;
    });
  },
});

//Karigar

const karigarReducerInitialState = {
  karigarList: [],
  activeKarigarList: [],
  localVendorKarigarList: [],
  karigarInfo: null,
  supplierProductInfo: null,
  isError: null,
  isLoading: false,
};

export const karigarReducer = createSlice({
  name: "karigarReducer",
  initialState: karigarReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllSupplier.fulfilled, (state, action) => {
      state.karigarList = action.payload;
      state.karigarInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getSupplierById.fulfilled, (state, action) => {
      state.karigarInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getSupplierProductById.fulfilled, (state, action) => {
      state.supplierProductInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteSupplierById.fulfilled, (state, action) => {
      toastsuccess("Karigar Deleted Successfully");
      state.karigarInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateSupplierStatus.fulfilled, (state, action) => {
      toastsuccess("Karigar Status changed Successfully");
      state.karigarInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getActiveSupplier.fulfilled, (state, action) => {
      state.activeKarigarList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getLocalVendorSupplier.fulfilled, (state, action) => {
      state.localVendorKarigarList = action.payload;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getAllSupplier.pending,
        getSupplierById.pending,
        createSupplier.pending,
        deleteSupplierById.pending,
        updateSupplierById.pending,
        updateSupplierStatus.pending,
        getActiveSupplier.pending,
        createSupplierProduct.pending,
        getSupplierProductById.pending,
        getLocalVendorSupplier.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllSupplier.rejected,
        getSupplierById.rejected,
        createSupplier.rejected,
        deleteSupplierById.rejected,
        updateSupplierById.rejected,
        updateSupplierStatus.rejected,
        getActiveSupplier.rejected,
        createSupplierProduct.rejected,
        getSupplierProductById.rejected,
        getLocalVendorSupplier.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(createSupplier.fulfilled, updateSupplierById.fulfilled,
        createSupplierProduct.fulfilled),
      (state) => {
        state.supplierProductInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//tax master
/*export const taxMasterInitialState = {
  taxMasterList: [],
  isError: null,
  isLoading: false,
};

export const taxmasterReducer = createSlice({
  name: "taxmasterReducer",
  initialState: taxMasterInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getActiveTaxMaster.fulfilled, (state, action) => {
      state.taxMasterList = action.payload;
      state.isLoading = false;
    });

    builder.addMatcher(isAnyOf(getActiveTaxMaster.pending), (state) => {
      state.isLoading = true;
    });
    builder.addMatcher(
      isAnyOf(getActiveTaxMaster.rejected),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(isAnyOf(getActiveTaxMaster.fulfilled), (state) => {
      state.isLoading = false;
      state.isError = false;
    });
  },
});
*/

//TaxMaster
export const taxmasterReducerInitialState = {
  taxMasterList: [],
  activeTaxList: [],
  taxInfo: null,
  isError: null,
  isLoading: false,
};

export const taxmasterReducer = createSlice({
  name: "taxmasterReducer",
  initialState: taxmasterReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllTax.fulfilled, (state, action) => {
      state.taxMasterList = action.payload;
      state.taxInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getActiveTaxMaster.fulfilled, (state, action) => {
      state.activeTaxList = action.payload;
      state.taxInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getTaxById.fulfilled, (state, action) => {
      state.taxInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteTaxById.fulfilled, (state, action) => {
      toastsuccess("Tax Deleted Successfully");
      state.taxInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateTaxStatus.fulfilled, (state, action) => {
      toastsuccess("Tax Status Changed Successfully");
      state.taxInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllTax.pending,
        getActiveTaxMaster.pending,
        getTaxById.pending,
        createTax.pending,
        updateTaxById.pending,
        deleteTaxById.pending,
        updateTaxStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllTax.rejected,
        getActiveTaxMaster.rejected,
        getTaxById.rejected,
        createTax.rejected,
        updateTaxById.rejected,
        deleteTaxById.rejected,
        updateTaxStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllTax.fulfilled, getActiveTaxMaster.fulfilled, createTax.fulfilled, updateTaxById.fulfilled),
      (state) => {
        state.taxInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//attribute entry
export const attributeEntryReducerInitialState = {
  attributeEntryList: [],
  attributeEntryInfo: null,
  isError: null,
  isLoading: false,
};

export const attributeEntryReducer = createSlice({
  name: "attributeEntryReducer",
  initialState: attributeEntryReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getActiveAttribute.fulfilled, (state, action) => {
      state.attributeEntryList = action.payload;
      state.attributeEntryInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getAllAttributeEntry.fulfilled, (state, action) => {
      state.attributeEntryList = action.payload;
      state.attributeEntryInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getAttributeEntryById.fulfilled, (state, action) => {
      state.attributeEntryInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteAttributeEntryById.fulfilled, (state, action) => {
      toastsuccess("Attribute Entry Deleted Successfully");
      state.attributeEntryInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateAttributeEntryStatus.fulfilled, (state, action) => {
      toastsuccess("Attribute Status changed Successfully");
      state.attributeEntryInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllAttributeEntry.pending,
        getAttributeEntryById.pending,
        createAttributeEntry.pending,
        updateAttributeEntryById.pending,
        deleteAttributeEntryById.pending,
        updateAttributeEntryStatus.pending,
        getActiveAttribute.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllAttributeEntry.rejected,
        getAttributeEntryById.rejected,
        createAttributeEntry.rejected,
        updateAttributeEntryById.rejected,
        deleteAttributeEntryById.rejected,
        updateAttributeEntryStatus.rejected,
        getActiveAttribute.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllAttributeEntry.fulfilled,
        createAttributeEntry.fulfilled,
        updateAttributeEntryById.fulfilled,
        getActiveAttribute.fulfilled
      ),
      (state) => {
        state.attributeEntryInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//otherCharges
export const otherChargesReducerInitialState = {
  otherChargesList: [],
  otherChargesInfo: null,
  isError: null,
  isLoading: false,
};

export const otherChargesReducer = createSlice({
  name: "otherChargesReducer",
  initialState: otherChargesReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllOtherCharges.fulfilled, (state, action) => {
      state.otherChargesList = action.payload;
      state.otherChargesInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getActiveCharges.fulfilled, (state, action) => {
      state.otherChargesList = action.payload;
      state.otherChargesInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getOtherChargesById.fulfilled, (state, action) => {
      state.otherChargesInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteOtherChargesById.fulfilled, (state, action) => {
      toastsuccess("Other Charges Entry Deleted Successfully");
      state.otherChargesInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateOtherChargesStatus.fulfilled, (state, action) => {
      toastsuccess("Other Charges Status changed Successfully");
      state.otherChargesInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllOtherCharges.pending,
        getOtherChargesById.pending,
        createOtherCharges.pending,
        updateOtherChargesById.pending,
        deleteOtherChargesById.pending,
        updateOtherChargesStatus.pending,
        getActiveCharges.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllOtherCharges.rejected,
        getOtherChargesById.rejected,
        createOtherCharges.rejected,
        updateOtherChargesById.rejected,
        deleteOtherChargesById.rejected,
        updateOtherChargesStatus.pending,
        getActiveCharges.pending
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllOtherCharges.fulfilled,
        createOtherCharges.fulfilled,
        updateOtherChargesById.fulfilled,
        getActiveCharges.fulfilled
      ),
      (state) => {
        state.otherChargesInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//day close
const dayCloseReducerInitialState = {
  isError: null,
  isLoading: false,
};

export const dayCloseReducer = createSlice({
  name: "dayCloseReducer",
  initialState: dayCloseReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(dayClose.pending), (state) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(dayClose.rejected), (state, action) => {
      state.isLoading = false;
      state.isError = true;
    });
    builder.addMatcher(isAnyOf(dayClose.fulfilled), (state) => {
      state.isLoading = false;
      state.isError = false;
    });
  },
});

//pay device

export const payDeviceReducerInitialState = {
  payDeviceList: [],
  payDeviceInfo: null,
  isError: null,
  isLoading: false,
};

export const payDeviceReducer = createSlice({
  name: "payDeviceReducer",
  initialState: payDeviceReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllPayDevice.fulfilled, (state, action) => {
      state.payDeviceList = action.payload;
      state.payDeviceInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getPayDeviceById.fulfilled, (state, action) => {
      state.payDeviceInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deletePayDeviceById.fulfilled, (state, action) => {
      toastsuccess("Pay Device Deleted Successfully");
      state.payDeviceInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updatePayDeviceStatus.fulfilled, (state, action) => {
      toastsuccess("Pay Device Status changed Successfully");
      state.payDeviceInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllPayDevice.pending,
        getPayDeviceById.pending,
        createPayDevice.pending,
        updatePayDeviceById.pending,
        deletePayDeviceById.pending,
        updatePayDeviceStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllPayDevice.rejected,
        getPayDeviceById.rejected,
        createPayDevice.rejected,
        updatePayDeviceById.rejected,
        deletePayDeviceById.rejected,
        updatePayDeviceStatus.pending
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllPayDevice.fulfilled, createPayDevice.fulfilled, updatePayDeviceById.fulfilled),
      (state) => {
        state.payDeviceInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//stock issue type

export const stockIssueTypeReducerInitialState = {
  stockIssueTypeList: [],
  stockIssueTypeInfo: null,
  isError: null,
  isLoading: false,
};

export const stockIssueTypeReducer = createSlice({
  name: "stockIssueTypeReducer",
  initialState: stockIssueTypeReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllStockIssueType.fulfilled, (state, action) => {
      state.stockIssueTypeList = action.payload;
      state.stockIssueTypeInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getStockIssueTypeById.fulfilled, (state, action) => {
      state.stockIssueTypeInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteStockIssueTypeById.fulfilled, (state, action) => {
      toastsuccess("Stock Issue Type Deleted Successfully");
      state.stockIssueTypeInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateStockIssueTypeStatus.fulfilled, (state, action) => {
      toastsuccess("Stock Issue Type Status changed Successfully");
      state.stockIssueTypeInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getActiveStockIssueType.fulfilled, (state, action) => {
      state.stockIssueTypeList = action.payload;
      state.stockIssueTypeInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllStockIssueType.pending,
        getStockIssueTypeById.pending,
        createStockIssueType.pending,
        updateStockIssueTypeById.pending,
        deleteStockIssueTypeById.pending,
        updateStockIssueTypeStatus.pending,
        getActiveStockIssueType.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllStockIssueType.rejected,
        getStockIssueTypeById.rejected,
        createStockIssueType.rejected,
        updateStockIssueTypeById.rejected,
        deleteStockIssueTypeById.rejected,
        updateStockIssueTypeStatus.rejected,
        getActiveStockIssueType.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllStockIssueType.fulfilled,
        createStockIssueType.fulfilled,
        updateStockIssueTypeById.fulfilled,
        getActiveStockIssueType.fulfilled
      ),
      (state) => {
        state.stockIssueTypeInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//weight range

export const weightRangeReducerInitialState = {
  weightRangeList: [],
  weightRangeInfo: null,
  isError: null,
  isLoading: false,
};

export const weightRangeReducer = createSlice({
  name: "weightRangeReducer",
  initialState: weightRangeReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllWeightRange.fulfilled, (state, action) => {
      state.weightRangeList = action.payload;
      state.weightRangeInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getWeightRangeById.fulfilled, (state, action) => {
      state.weightRangeInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteWeightRangeById.fulfilled, (state, action) => {
      toastsuccess("Weight Range Deleted Successfully");
      state.weightRangeInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateWeightRangeStatus.fulfilled, (state, action) => {
      toastsuccess("Weight Range Status changed Successfully");
      state.weightRangeInfo = null;
      state.isLoading = false;
    });
    builder.addCase("weightRangeInfo/reset", (state) => {
      state.weightRangeInfo = null;
    });
    builder.addMatcher(
      isAnyOf(
        getAllWeightRange.pending,
        getWeightRangeById.pending,
        createWeightRange.pending,
        updateWeightRangeById.pending,
        deleteWeightRangeById.pending,
        updateWeightRangeStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllWeightRange.rejected,
        getWeightRangeById.rejected,
        createWeightRange.rejected,
        updateWeightRangeById.rejected,
        deleteWeightRangeById.rejected,
        updateWeightRangeStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllWeightRange.fulfilled, createWeightRange.fulfilled, updateWeightRangeById.fulfilled),
      (state) => {
        state.weightRangeInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//floor

export const floorReducerInitialState = {
  floorList: [],
  floorOptions: [],
  floorInfo: null,
  isError: null,
  isLoading: false,
};

export const floorReducer = createSlice({
  name: "floorReducer",
  initialState: floorReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllFloor.fulfilled, (state, action) => {
      state.floorList = action.payload;
      state.floorInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getFloorById.fulfilled, (state, action) => {
      state.floorInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteFloorById.fulfilled, (state, action) => {
      toastsuccess("Floor Deleted Successfully");
      state.floorInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateFloorStatus.fulfilled, (state, action) => {
      toastsuccess("Floor Status changed Successfully");
      state.floorInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getFloorOptions.fulfilled, (state, action) => {
      state.floorOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllFloor.pending,
        getFloorById.pending,
        createFloor.pending,
        updateFloorById.pending,
        deleteFloorById.pending,
        updateFloorStatus.pending,
        getFloorOptions.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllFloor.rejected,
        getFloorById.rejected,
        createFloor.rejected,
        updateFloorById.rejected,
        deleteFloorById.rejected,
        updateFloorStatus.rejected,
        getFloorOptions.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllFloor.fulfilled, createFloor.fulfilled, updateFloorById.fulfilled, getFloorOptions.fulfilled),
      (state) => {
        state.floorInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//counter

export const counterReducerInitialState = {
  counterList: [],
  counterInfo: null,
  counterOptions: [],
  isError: null,
  isLoading: false,
};

export const counterReducer = createSlice({
  name: "counterReducer",
  initialState: counterReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCounter.fulfilled, (state, action) => {
      state.counterList = action.payload;
      state.counterInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getCounterById.fulfilled, (state, action) => {
      state.counterInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteCounterById.fulfilled, (state, action) => {
      toastsuccess("Counter Deleted Successfully");
      state.counterInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateCounterStatus.fulfilled, (state, action) => {
      toastsuccess("Counter Status changed Successfully");
      state.counterInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getCounterOptions.fulfilled, (state, action) => {
      state.counterOptions = action.payload.data;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllCounter.pending,
        getCounterById.pending,
        createCounter.pending,
        updateCounterById.pending,
        deleteCounterById.pending,
        updateCounterStatus.pending,
        getCounterOptions.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllCounter.rejected,
        getCounterById.rejected,
        createCounter.rejected,
        updateCounterById.rejected,
        deleteCounterById.rejected,
        updateCounterStatus.rejected,
        getCounterOptions.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllCounter.fulfilled,
        createCounter.fulfilled,
        updateCounterById.fulfilled,
        getCounterOptions.fulfilled
      ),
      (state) => {
        state.counterInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//Registered Device

export const registeredDeviceReducerInitialState = {
  registeredDeviceList: [],
  registeredDeviceInfo: null,
  isError: null,
  isLoading: false,
};

export const registeredDeviceReducer = createSlice({
  name: "registeredDeviceReducer",
  initialState: registeredDeviceReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllRegisteredDevice.fulfilled, (state, action) => {
      state.registeredDeviceList = action.payload;
      state.registeredDeviceInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getRegisteredDeviceById.fulfilled, (state, action) => {
      state.registeredDeviceInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteRegisteredDeviceById.fulfilled, (state, action) => {
      toastsuccess("Registered Device Deleted Successfully");
      state.registeredDeviceInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateRegisteredDeviceStatus.fulfilled, (state, action) => {
      toastsuccess("Registered Device Status changed Successfully");
      state.registeredDeviceInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllRegisteredDevice.pending,
        getRegisteredDeviceById.pending,
        createRegisteredDevice.pending,
        updateRegisteredDeviceById.pending,
        deleteRegisteredDeviceById.pending,
        updateRegisteredDeviceStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllRegisteredDevice.rejected,
        getRegisteredDeviceById.rejected,
        createRegisteredDevice.rejected,
        updateRegisteredDeviceById.rejected,
        deleteRegisteredDeviceById.rejected,
        updateRegisteredDeviceStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllRegisteredDevice.fulfilled, createRegisteredDevice.fulfilled, updateRegisteredDeviceById.fulfilled),
      (state) => {
        state.registeredDeviceInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//section wise sales
export const sectionWiseSalesReducerInitialState = {
  sectionWiseSalesList: [],
  sectionWiseSalesItemList: [],
  sectionWiseSalesInfo: null,
  isError: null,
  isLoading: false,
};

export const sectionWiseSalesReducer = createSlice({
  name: "sectionWiseSalesReducer",
  initialState: sectionWiseSalesReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(getAllSectionWiseSales.fulfilled, (state, action) => {
    //   state.sectionWiseSalesList = action.payload;
    //   state.sectionWiseSalesInfo = null;
    //   state.isLoading = false;
    // });
    // builder.addCase(getSectionWiseSalesById.fulfilled, (state, action) => {
    //   state.sectionWiseSalesInfo = action.payload;
    //   state.isLoading = false;
    // });
    builder.addCase(getSectionWiseSalesItems.fulfilled, (state, action) => {
      state.sectionWiseSalesItemList = action.payload?.data;
      state.isLoading = false;
    });
    // builder.addCase(deleteSectionWiseSalesById.fulfilled, (state, action) => {
    //   toastsuccess("Section wise sales Deleted Successfully");
    //   state.sectionWiseSalesInfo = null;
    //   state.isLoading = false;
    // });
    // builder.addCase(updateSectionWiseSalesStatus.fulfilled, (state, action) => {
    //   toastsuccess("Section wise sales Status changed Successfully");
    //   state.sectionWiseSalesInfo = null;
    //   state.isLoading = false;
    // });
    builder.addMatcher(
      isAnyOf(
        // getAllSectionWiseSales.pending,
        // getSectionWiseSalesById.pending,
        createSectionWiseSales.pending,
        // updateSectionWiseSalesById.pending,
        // deleteSectionWiseSalesById.pending,
        // updateSectionWiseSalesStatus.pending,
        getSectionWiseSalesItems.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        // getAllSectionWiseSales.rejected,
        // getSectionWiseSalesById.rejected,
        createSectionWiseSales.rejected,
        // updateSectionWiseSalesById.rejected,
        // deleteSectionWiseSalesById.rejected,
        // updateSectionWiseSalesStatus.rejected,
        getSectionWiseSalesItems.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        // getAllSectionWiseSales.fulfilled,
        createSectionWiseSales.fulfilled
        // updateSectionWiseSalesById.fulfilled,
      ),
      (state) => {
        state.sectionWiseSalesInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//profession
export const professionReducerInitialState = {
  professionList: [],
  activeProfessionList: [],
  professionInfo: null,
  isError: null,
  isLoading: false,
};

export const professionReducer = createSlice({
  name: "professionReducer",
  initialState: professionReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllProfession.fulfilled, (state, action) => {
      state.professionList = action.payload;
      state.professionInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getProfessionById.fulfilled, (state, action) => {
      state.professionInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getActiveProfessions.fulfilled, (state, action) => {
      state.activeProfessionList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteProfessionById.fulfilled, (state, action) => {
      toastsuccess("Profession Deleted Successfully");
      state.professionInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateProfessionStatus.fulfilled, (state, action) => {
      toastsuccess("Profession Status changed Successfully");
      state.professionInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllProfession.pending,
        getProfessionById.pending,
        createProfession.pending,
        updateProfessionById.pending,
        deleteProfessionById.pending,
        updateProfessionStatus.pending,
        getActiveProfessions.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllProfession.rejected,
        getProfessionById.rejected,
        createProfession.rejected,
        updateProfessionById.rejected,
        deleteProfessionById.rejected,
        updateProfessionStatus.rejected,
        getActiveProfessions.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllProfession.fulfilled, createProfession.fulfilled, updateProfessionById.fulfilled),
      (state) => {
        state.professionInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});


//region
export const regionReducerInitialState = {
  regionList: [],
  activeRegionList: [],
  regionInfo: null,
  isError: null,
  isLoading: false,
};

export const regionReducer = createSlice({
  name: "regionReducer",
  initialState: regionReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllRegion.fulfilled, (state, action) => {
      state.regionList = action.payload;
      state.regionInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getRegionById.fulfilled, (state, action) => {
      state.regionInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getActiveRegions.fulfilled, (state, action) => {
      state.activeRegionList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteRegionById.fulfilled, (state, action) => {
      toastsuccess("Region Deleted Successfully");
      state.regionInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateRegionStatus.fulfilled, (state, action) => {
      toastsuccess("Region Status changed Successfully");
      state.regionInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllRegion.pending,
        getRegionById.pending,
        createRegion.pending,
        updateRegionById.pending,
        deleteRegionById.pending,
        updateRegionStatus.pending,
        getActiveRegions.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllRegion.rejected,
        getRegionById.rejected,
        createRegion.rejected,
        updateRegionById.rejected,
        deleteRegionById.rejected,
        updateRegionStatus.rejected,
        getActiveRegions.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllRegion.fulfilled, createRegion.fulfilled, updateRegionById.fulfilled),
      (state) => {
        state.regionInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//container
export const containerReducerInitialState = {
  containerList: [],
  activeContainerList: [],
  containerInfo: null,
  isError: null,
  isLoading: false,
};

export const containerReducer = createSlice({
  name: "containerReducer",
  initialState: containerReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllContainer.fulfilled, (state, action) => {
      state.containerList = action.payload;
      state.containerInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getContainerById.fulfilled, (state, action) => {
      state.containerInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getActiveContainers.fulfilled, (state, action) => {
      state.activeContainerList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteContainerById.fulfilled, (state, action) => {
      toastsuccess("container Deleted Successfully");
      state.containerInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateContainerStatus.fulfilled, (state, action) => {
      toastsuccess("container Status changed Successfully");
      state.containerInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllContainer.pending,
        getContainerById.pending,
        createContainer.pending,
        updateContainerById.pending,
        deleteContainerById.pending,
        updateContainerStatus.pending,
        getActiveContainers.pending,
        getContainerPdfById.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllContainer.rejected,
        getContainerById.rejected,
        createContainer.rejected,
        updateContainerById.rejected,
        deleteContainerById.rejected,
        updateContainerStatus.rejected,
        getActiveContainers.rejected,
        getContainerPdfById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllContainer.fulfilled,
        createContainer.fulfilled,
        updateContainerById.fulfilled,
        getContainerPdfById.fulfilled
      ),
      (state) => {
        state.containerInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//old metal item
export const oldMetalItemReducerInitialState = {
  oldMetalItemList: [],
  activeOldMetalItemList: [],
  oldMetalItemInfo: null,
  isError: null,
  isLoading: false,
};

export const oldMetalItemReducer = createSlice({
  name: "oldMetalItemReducer",
  initialState: oldMetalItemReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllOldMetalItem.fulfilled, (state, action) => {
      state.oldMetalItemList = action.payload;
      state.oldMetalItemInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getOldMetalItemById.fulfilled, (state, action) => {
      state.oldMetalItemInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getActiveOldMetalItem.fulfilled, (state, action) => {
      state.activeOldMetalItemList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteOldMetalItemById.fulfilled, (state, action) => {
      toastsuccess("Old metal Status Deleted Successfully");
      state.oldMetalItemInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateOldMetalItemStatus.fulfilled, (state, action) => {
      toastsuccess("Old metal Status Status changed Successfully");
      state.oldMetalItemInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllOldMetalItem.pending,
        getOldMetalItemById.pending,
        createOldMetalItem.pending,
        updateOldMetalItemById.pending,
        deleteOldMetalItemById.pending,
        updateOldMetalItemStatus.pending,
        getActiveOldMetalItem.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllOldMetalItem.rejected,
        getOldMetalItemById.rejected,
        createOldMetalItem.rejected,
        updateOldMetalItemById.rejected,
        deleteOldMetalItemById.rejected,
        updateOldMetalItemStatus.rejected,
        getActiveOldMetalItem.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllOldMetalItem.fulfilled, createOldMetalItem.fulfilled, updateOldMetalItemById.fulfilled),
      (state) => {
        state.oldMetalItemInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//other weight
export const otherWeightReducerInitialState = {
  otherWeightList: [],
  activeOtherWeightList: [],
  otherWeightInfo: null,
  isError: null,
  isLoading: false,
};

export const otherWeightReducer = createSlice({
  name: "otherWeightReducer",
  initialState: otherWeightReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllOtherWeight.fulfilled, (state, action) => {
      state.otherWeightList = action.payload;
      state.otherWeightInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getOtherWeightById.fulfilled, (state, action) => {
      state.otherWeightInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getActiveOtherWeight.fulfilled, (state, action) => {
      state.activeOtherWeightList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteOtherWeightById.fulfilled, (state, action) => {
      toastsuccess("Other Weight Status Deleted Successfully");
      state.otherWeightInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateOtherWeightStatus.fulfilled, (state, action) => {
      toastsuccess("Other Weight Status Status changed Successfully");
      state.otherWeightInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllOtherWeight.pending,
        getOtherWeightById.pending,
        createOtherWeight.pending,
        updateOtherWeightById.pending,
        deleteOtherWeightById.pending,
        updateOtherWeightStatus.pending,
        getActiveOtherWeight.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllOtherWeight.rejected,
        getOtherWeightById.rejected,
        createOtherWeight.rejected,
        updateOtherWeightById.rejected,
        deleteOtherWeightById.rejected,
        updateOtherWeightStatus.rejected,
        getActiveOtherWeight.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllOtherWeight.fulfilled, createOtherWeight.fulfilled, updateOtherWeightById.fulfilled),
      (state) => {
        state.otherWeightInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//cash opening balance
export const cashOpeningBalanceReducerInitialState = {
  cashOpeningBalanceList: [],
  activeCashOpeningBalanceList: [],
  cashOpeningBalanceInfo: null,
  isError: null,
  isLoading: false,
};

export const cashOpeningBalanceReducer = createSlice({
  name: "cashOpeningBalanceReducer",
  initialState: cashOpeningBalanceReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCashOpeningBalance.fulfilled, (state, action) => {
      state.cashOpeningBalanceList = action.payload;
      state.cashOpeningBalanceInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getCashOpeningBalanceById.fulfilled, (state, action) => {
      state.cashOpeningBalanceInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getActiveCashOpeningBalance.fulfilled, (state, action) => {
      state.activeCashOpeningBalanceList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteCashOpeningBalanceById.fulfilled, (state, action) => {
      toastsuccess("Cash Opening Balance Status Deleted Successfully");
      state.cashOpeningBalanceInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateCashOpeningBalanceStatus.fulfilled, (state, action) => {
      toastsuccess("Cash Opening Balance Status Status changed Successfully");
      state.cashOpeningBalanceInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllCashOpeningBalance.pending,
        getCashOpeningBalanceById.pending,
        createCashOpeningBalance.pending,
        updateCashOpeningBalanceById.pending,
        deleteCashOpeningBalanceById.pending,
        updateCashOpeningBalanceStatus.pending,
        getActiveCashOpeningBalance.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllCashOpeningBalance.rejected,
        getCashOpeningBalanceById.rejected,
        createCashOpeningBalance.rejected,
        updateCashOpeningBalanceById.rejected,
        deleteCashOpeningBalanceById.rejected,
        updateCashOpeningBalanceStatus.rejected,
        getActiveCashOpeningBalance.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllCashOpeningBalance.fulfilled,
        createCashOpeningBalance.fulfilled,
        updateCashOpeningBalanceById.fulfilled
      ),
      (state) => {
        state.cashOpeningBalanceInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//account head
export const accountHeadReducerInitialState = {
  accountHeadList: [],
  activeAccountHeadList: [],
  accountHeadInfo: null,
  isError: null,
  isLoading: false,
};

export const accountHeadReducer = createSlice({
  name: "accountHeadReducer",
  initialState: accountHeadReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllAccountHead.fulfilled, (state, action) => {
      state.accountHeadList = action.payload;
      state.accountHeadInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getAccountHeadById.fulfilled, (state, action) => {
      state.accountHeadInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getActiveAccountHead.fulfilled, (state, action) => {
      state.activeAccountHeadList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteAccountHeadById.fulfilled, (state, action) => {
      toastsuccess("Account Head Status Deleted Successfully");
      state.accountHeadInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateAccountHeadStatus.fulfilled, (state, action) => {
      toastsuccess("Account Head Status Status changed Successfully");
      state.accountHeadInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllAccountHead.pending,
        getAccountHeadById.pending,
        createAccountHead.pending,
        updateAccountHeadById.pending,
        deleteAccountHeadById.pending,
        updateAccountHeadStatus.pending,
        getActiveAccountHead.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllAccountHead.rejected,
        getAccountHeadById.rejected,
        createAccountHead.rejected,
        updateAccountHeadById.rejected,
        deleteAccountHeadById.rejected,
        updateAccountHeadStatus.rejected,
        getActiveAccountHead.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllAccountHead.fulfilled, createAccountHead.fulfilled, updateAccountHeadById.fulfilled),
      (state) => {
        state.accountHeadInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//service
export const serviceReducerInitialState = {
  serviceList: [],
  serviceOptions: [],
  activeServiceList: [],
  serviceInfo: null,
  isError: null,
  isLoading: false,
};

export const serviceReducer = createSlice({
  name: "serviceReducer",
  initialState: serviceReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllService.fulfilled, (state, action) => {
      state.serviceList = action.payload;
      state.serviceInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getServiceById.fulfilled, (state, action) => {
      state.serviceInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getActiveService.fulfilled, (state, action) => {
      state.activeServiceList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getServiceOptions.fulfilled, (state, action) => {
      state.serviceOptions = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteServiceById.fulfilled, (state, action) => {
      toastsuccess("Service Status Deleted Successfully");
      state.serviceInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateServiceStatus.fulfilled, (state, action) => {
      toastsuccess("Service Status Status changed Successfully");
      state.serviceInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllService.pending,
        getServiceById.pending,
        createService.pending,
        updateServiceById.pending,
        deleteServiceById.pending,
        updateServiceStatus.pending,
        getActiveService.pending,
        getServiceOptions.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllService.rejected,
        getServiceById.rejected,
        createService.rejected,
        updateServiceById.rejected,
        deleteServiceById.rejected,
        updateServiceStatus.rejected,
        getActiveService.rejected,
        getServiceOptions.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllService.fulfilled, createService.fulfilled, updateServiceById.fulfilled),
      (state) => {
        state.serviceInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});




//Customer Proof
export const customerProofReducerInitialState = {
  customerProofList: [],
  activeCustomerProofList: [],
  customerProofInfo: null,
  isError: null,
  isLoading: false,
};

export const customerProofReducer = createSlice({
  name: "customerProofReducer",
  initialState: customerProofReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCustomerProof.fulfilled, (state, action) => {
      state.customerProofList = action.payload;
      state.customerProofInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getCustomerProofById.fulfilled, (state, action) => {
      state.customerProofInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getActiveCustomerProof.fulfilled, (state, action) => {
      state.activeCustomerProofList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteCustomerProofById.fulfilled, (state, action) => {
      toastsuccess("Customer Proof Status Deleted Successfully");
      state.customerProofInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateCustomerProofStatus.fulfilled, (state, action) => {
      toastsuccess("Customer Proof Status Status changed Successfully");
      state.customerProofInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllCustomerProof.pending,
        getCustomerProofById.pending,
        createCustomerProof.pending,
        updateCustomerProofById.pending,
        deleteCustomerProofById.pending,
        updateCustomerProofStatus.pending,
        getActiveCustomerProof.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllCustomerProof.rejected,
        getCustomerProofById.rejected,
        createCustomerProof.rejected,
        updateCustomerProofById.rejected,
        deleteCustomerProofById.rejected,
        updateCustomerProofStatus.rejected,
        getActiveCustomerProof.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllCustomerProof.fulfilled, createCustomerProof.fulfilled, updateCustomerProofById.fulfilled),
      (state) => {
        state.customerProofInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

const bankDepositReducerInitialState = {
  bankDepositList: [],
  bankDepositInfo: null,
  cashBalanceInfo: null,
  isError: null,
  isLoading: false,
};

export const bankDepositReducer = createSlice({
  name: "bankDepositReducer",
  initialState: bankDepositReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllBankDeposit.fulfilled, (state, action) => {
      state.bankDepositList = action.payload;
      state.bankDepositInfo = null;
      state.cashBalanceInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getCashBalance.fulfilled, (state, action) => {
      state.cashBalanceInfo = action.payload;
      state.bankDepositInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getBankDepositById.fulfilled, (state, action) => {
      state.bankDepositInfo = action.payload;
      state.cashBalanceInfo = null;
      state.isLoading = false;
    });
    builder.addCase(deleteBankDepositById.fulfilled, (state, action) => {
      toastsuccess("Bank Deposit Deleted Successfully");
      state.bankDepositInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllBankDeposit.pending,
        getBankDepositById.pending,
        createBankDeposit.pending,
        updateBankDepositById.pending,
        deleteBankDepositById.pending,
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllBankDeposit.rejected,
        getBankDepositById.rejected,
        createBankDeposit.rejected,
        updateBankDepositById.rejected,
        deleteBankDepositById.rejected),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllBankDeposit.fulfilled,
        getBankDepositById.fulfilled,
        createBankDeposit.fulfilled,
        updateBankDepositById.fulfilled,
        deleteBankDepositById.fulfilled,
      ),
      (state) => {
        state.areaInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});


//deposit master

export const depositMasterReducerInitialState = {
  depositMasterList: [],
  depositMasterOptions: [],
  depositMasterInfo: null,
  isError: null,
  isLoading: false,
};

export const depositMasterReducer = createSlice({
  name: "depositMasterReducer",
  initialState: depositMasterReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllDepositMaster.fulfilled, (state, action) => {
      state.depositMasterList = action.payload;
      state.depositMasterInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getDepositMasterOptions.fulfilled, (state, action) => {
      state.depositMasterOptions = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getDepositMasterById.fulfilled, (state, action) => {
      state.depositMasterInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteDepositMasterById.fulfilled, (state, action) => {
      toastsuccess("Deposit Master Deleted Successfully");
      state.depositMasterInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateDepositMasterStatus.fulfilled, (state, action) => {
      toastsuccess("Deposit Master Status changed Successfully");
      state.depositMasterInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllDepositMaster.pending,
        getDepositMasterById.pending,
        createDepositMaster.pending,
        updateDepositMasterById.pending,
        deleteDepositMasterById.pending,
        updateDepositMasterStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllDepositMaster.rejected,
        getDepositMasterById.rejected,
        createDepositMaster.rejected,
        updateDepositMasterById.rejected,
        deleteDepositMasterById.rejected,
        updateDepositMasterStatus.pending
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllDepositMaster.fulfilled,
        createDepositMaster.fulfilled,
        updateDepositMasterById.fulfilled),
      (state) => {
        state.depositMasterInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

export const incentiveSettingsReducerInitialState = {
  incentiveSettingsList: [],
  incentiveSettingsOptions: [],
  incentiveSettingsInfo: null,
  isError: null,
  isLoading: false,
};

export const incentiveSettingsReducer = createSlice({
  name: "incentiveSettingsReducer",
  initialState: incentiveSettingsReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllIncentiveSettings.fulfilled, (state, action) => {
      state.incentiveSettingsList = action.payload;
      state.incentiveSettingsInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getIncentiveSettingsById.fulfilled, (state, action) => {
      state.incentiveSettingsInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteDepositMasterById.fulfilled, (state, action) => {
      toastsuccess("Deposit Master Deleted Successfully");
      state.depositMasterInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateIncentiveSettings.fulfilled, (state, action) => {
      state.depositMasterInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllIncentiveSettings.pending,
        getIncentiveSettingsById.pending,
        createIncentiveSettings.pending,
        updateIncentiveSettings.pending,
        deleteIncentiveSettingsById.pending,
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllIncentiveSettings.rejected,
        getIncentiveSettingsById.rejected,
        createIncentiveSettings.rejected,
        updateIncentiveSettings.rejected,
        deleteIncentiveSettingsById.rejected,
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllIncentiveSettings.fulfilled,
        createIncentiveSettings.fulfilled,
        deleteIncentiveSettingsById.fulfilled,
        updateIncentiveSettings.fulfilled),
      (state) => {
        state.depositMasterInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});



//religion master
export const religionMasterReducerInitialState = {
  religionMasterList: [],
  religionMasterOptions: [],
  religionMasterInfo: null,
  isError: null,
  isLoading: false,
};

export const religionMasterReducer = createSlice({
  name: "religionMasterReducer",
  initialState: religionMasterReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllReligionMaster.fulfilled, (state, action) => {
      state.religionMasterList = action.payload;
      state.religionMasterInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getReligionMasterOptions.fulfilled, (state, action) => {
      state.religionMasterOptions = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getReligionMasterById.fulfilled, (state, action) => {
      state.religionMasterInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteReligionMasterById.fulfilled, (state, action) => {
      toastsuccess("Religion Master Deleted Successfully");
      state.religionMasterInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateReligionMasterStatus.fulfilled, (state, action) => {
      toastsuccess("Religion Master Status changed Successfully");
      state.religionMasterInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllReligionMaster.pending,
        getReligionMasterById.pending,
        createReligionMaster.pending,
        updateReligionMasterById.pending,
        deleteReligionMasterById.pending,
        updateReligionMasterStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllReligionMaster.rejected,
        getReligionMasterById.rejected,
        createReligionMaster.rejected,
        updateReligionMasterById.rejected,
        deleteReligionMasterById.rejected,
        updateReligionMasterStatus.pending
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllReligionMaster.fulfilled,
        createReligionMaster.fulfilled,
        updateReligionMasterById.fulfilled),
      (state) => {
        state.religionMasterInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});