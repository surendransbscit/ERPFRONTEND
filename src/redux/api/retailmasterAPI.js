import { Auth } from "../configs";

const api = {
  relation_type: {
    getRelationTypeOptions: () => Auth.get(`/retailmaster/relation_type/?active`),
    getAllRelationType: (page, records, search) => Auth.get(`/retailmaster/relation_type/?page=${page}&records=${records}&searchText=${search}`),
    createRelationType: (content) => Auth.post("/retailmaster/relation_type/", content),
    getRelationTypeById: (id) => Auth.get(`/retailmaster/relation_type/${id}/`),
    updateRelationTypeById: (id, content) => Auth.put(`/retailmaster/relation_type/${id}/`, content),
    deleteRelationTypeById: (id) => Auth.delete(`/retailmaster/relation_type/${id}/`),
    updateRelationTypeStatus: (id) => Auth.get(`/retailmaster/relation_type/${id}/?changestatus`),
  },
  department: {
    get: (id) => Auth.get(`/retailmaster/department/${id}/`),
    changeStatusDepartment: (id) => Auth.get(`/retailmaster/department/${id}/?changestatus`),
    getAll: (page, records, search) => Auth.get(`/retailmaster/department/?page=${page}&records=${records}&searchText=${search}`),
    getOptions: () => Auth.get(`/retailmaster/department/?is_active`),
    create: (content) => Auth.post("/retailmaster/department/", content),
    update: (id, content) => Auth.put(`/retailmaster/department/${id}/`, content),
    delete: (id) => Auth.delete(`/retailmaster/department/${id}/`),
  },
  designation: {
    get: (id) => Auth.get(`/retailmaster/designation/${id}/`),
    changeStatusDesignation: (id) => Auth.get(`/retailmaster/designation/${id}/?changestatus`),
    deleteDesignation: (id) => Auth.delete(`/retailmaster/designation/${id}/`),
    getAll: (page, records, search) => Auth.get(`/retailmaster/designation/?page=${page}&records=${records}&searchText=${search}`),
    getByDepartment: (id) => Auth.get(`/retailmaster/designation/?dept=${id}`),
    create: (content) => Auth.post("/retailmaster/designation/", content),
    update: (id, content) => Auth.put(`/retailmaster/designation/${id}/`, content),
  },
  area: {
    get: (id) => Auth.get(`/retailmaster/area/${id}/`),
    changeStatus: (id) => Auth.get(`/retailmaster/area/${id}/?changestatus`),
    delete: (id) => Auth.delete(`/retailmaster/area/${id}/`),
    getAll: (page, records, search) => Auth.get(`/retailmaster/area/?page=${page}&records=${records}&searchText=${search}`),
    create: (content) => Auth.post("/retailmaster/area/", content),
    update: (id, content) => Auth.put(`/retailmaster/area/${id}/`, content),
  },
  bank: {
    get: (id) => Auth.get(`/retailmaster/bank/${id}/`),
    changeStatusbank: (id) => Auth.get(`/retailmaster/bank/${id}/?changestatus`),
    changeStatus: (id) => Auth.get(`/retailmaster/bank/${id}/?changestatus`),
    deleteBank: (id) => Auth.delete(`/retailmaster/bank/${id}/`),
    getAll: (page, records, search, pathname) => Auth.get(`/retailmaster/bank/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    create: (content) => Auth.post("/retailmaster/bank/", content),
    update: (id, content) => Auth.put(`/retailmaster/bank/${id}/`, content),
  },
  financialyear: {
    get: (id) => Auth.get(`/retailmaster/financial_year/${id}/`),
    changeStatusFinYear: (id) => Auth.get(`/retailmaster/financial_year/${id}/?changestatus`),
    delete: (id) => Auth.delete(`/retailmaster/financial_year/${id}/`),
    getAll: (page, records, search, pathname) => Auth.get(`/retailmaster/financial_year/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    create: (content) => Auth.post("/retailmaster/financial_year/", content),
    update: (id, content) => Auth.put(`/retailmaster/financial_year/${id}/`, content),
  },
  profile: {
    getProfileByID: (id) => Auth.get(`/retailmaster/profile/${id}/`),
    deleteProfileByID: (id) => Auth.delete(`/retailmaster/profile/${id}/`),
    getAllProfile: (page, records, search) => Auth.get(`/retailmaster/profile/?page=${page}&records=${records}&searchText=${search}`),
    getAllActiveProfile: () => Auth.get(`/retailmaster/profile/?is_active`),
    createProfile: (content) => Auth.post("/retailmaster/profile/", content),
    updateProfileStatus: (id) => Auth.get(`/retailmaster/profile/${id}/?changestatus`),
    updateProfileByID: (id, content) => Auth.put(`/retailmaster/profile/${id}/`, content),
  },
  country: {
    getCountryByID: (id) => Auth.get(`/retailmaster/country/${id}/`),
    deleteCountryByID: (id) => Auth.delete(`/retailmaster/country/${id}/`),
    getAllCountry: (page, records, search) => Auth.get(`/retailmaster/country/?page=${page}&records=${records}&searchText=${search}`),
    createCountry: (content) => Auth.post("/retailmaster/country/", content),
    updateCountryByID: (id, content) => Auth.put(`/retailmaster/country/${id}/`, content),
    deleteCountryByID: (id) => Auth.delete(`/retailmaster/country/${id}/`),
  },
  state: {
    getStateByID: (id) => Auth.get(`/retailmaster/state/${id}/`),
    deleteStateByID: (id) => Auth.delete(`/retailmaster/state/${id}/`),
    getAllState: (page, records, search) => Auth.get(`/retailmaster/state/?page=${page}&records=${records}&searchText=${search}`),
    createState: (content) => Auth.post("/retailmaster/state/", content),
    updateStateByID: (id, content) => Auth.put(`/retailmaster/state/${id}/`, content),
    deleteStateByID: (id) => Auth.delete(`/retailmaster/state/${id}/`),
  },
  employeeType: {
    getEmployeeTypeByID: (id) => Auth.get(`/employee/employeetype/${id}/`),
    deleteEmployeeTypeByID: (id) => Auth.delete(`/employee/employeetype/${id}/`),
    getAllEmployeeType: (page, records, search) => Auth.get(`/employee/employeetype/?page=${page}&records=${records}&searchText=${search}`),
    getEmployeeTypeOptions: () => Auth.get(`/employee/employeetype/?options`),
    createEmployeeType: (content) => Auth.post("/employee/employeetype/", content),
    updateEmployeeTypeByID: (id, content) => Auth.put(`/employee/employeetype/${id}/`, content),
  },
  banner: {
    getBannerByID: (id) => Auth.get(`/retailmaster/banner/${id}/`),
    deleteBannerByID: (id) => Auth.delete(`/retailmaster/banner/${id}/`),
    getAllBanner: (page, records, search, pathname) => Auth.get(`/retailmaster/banner/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    getBannerOptions: () => Auth.get(`/retailmaster/banner/?options`),
    createBanner: (content) => Auth.post("/retailmaster/banner/", content),
    updateBannerByID: (id, content) => Auth.put(`/retailmaster/banner/${id}/`, content),
  },
  notification: {
    getNotificationByID: (id) => Auth.get(`/retailmaster/notification/${id}/`),
    deleteNotificationByID: (id) => Auth.delete(`/retailmaster/notification/${id}/`),
    getAllNotification: (page, records, search, pathname) => Auth.get(`/retailmaster/notification/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    getNotificationOptions: () => Auth.get(`/retailmaster/notification/?options`),
    createNotification: (content) => Auth.post("/retailmaster/customer_notification/", content),
    updateNotificationByID: (id, content) => Auth.put(`/retailmaster/notification/${id}/`, content),
  },
  dailystatus: {
    getDailyStatusByID: (id) => Auth.get(`/retailmaster/daily_status/${id}/`),
    deleteDailyStatusByID: (id) => Auth.delete(`/retailmaster/daily_status/${id}/`),
    getAllDailyStatus: (page, records, search, pathname) => Auth.get(`/retailmaster/daily_status/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    getDailyStatusOptions: () => Auth.get(`/retailmaster/daily_status/?options`),
    createDailyStatus: (content) => Auth.post("/retailmaster/daily_status/", content),
    updateDailyStatusByID: (id, content) => Auth.put(`/retailmaster/daily_status/${id}/`, content),
    changeStatusDailyStatus: (id) => Auth.get(`/retailmaster/daily_status/${id}/?changestatus`),

  },
  city: {
    getCityByID: (id) => Auth.get(`/retailmaster/city/${id}/`),
    deleteCityByID: (id) => Auth.delete(`/retailmaster/city/${id}/`),
    getAllCity: (page, records, search) => Auth.get(`/retailmaster/city/?page=${page}&records=${records}&searchText=${search}`),
    createCity: (content) => Auth.post("/retailmaster/city/", content),
    updateCityByID: (id, content) => Auth.put(`/retailmaster/city/${id}/`, content),
  },
  metalRate: {
    getMetalRateByID: (id) => Auth.get(`/retailmaster/metal_rates/${id}/`),
    deleteMetalRateByID: (id) => Auth.delete(`/retailmaster/metal_rates/${id}/`),
    getAllMetalRate: (page, records, search) => Auth.get(`/retailmaster/metal_rates/?page=${records}&records=${records}&searchText=${search}`),
    createMetalRate: (content) => Auth.post("/retailmaster/metal_rates/", content),
    updateMetalRateByID: (id, content) => Auth.put(`/retailmaster/metal_rates/${id}/`, content),
    getCurrentMetalRate: (content) => Auth.get(`/retailmaster/metal_rates/?latest`),
    getCategoryMetalRate: (content) => Auth.get(`/catalogmasters/cat_metal_rates/`),

  },
  retuom: {
    getRetUomByID: (id) => Auth.get(`/retailmaster/uom/${id}/`),
    deleteRetUomByID: (id) => Auth.delete(`/retailmaster/uom/${id}/`),
    getAllRetUom: (page, records, search) => Auth.get(`/retailmaster/uom/?page=${page}&records=${records}&searchText=${search}`),
    getUomList: () => Auth.get(`/retailmaster/uom/?active`),
    createRetUom: (content) => Auth.post("/retailmaster/uom/", content),
    updateRetUomStatus: (id) => Auth.get(`/retailmaster/uom/${id}/?changestatus`),
    updateRetUomByID: (id, content) => Auth.put(`/retailmaster/uom/${id}/`, content),
  },
  metalPurityRate: {
    getAllMetalPurityRate: (content) => Auth.get(`/retailmaster/metal_purity_rate/`),
    getAllCatMetalPurityRate: (content) => Auth.get(`/catalogmasters/category_purity_rate/`),

  },
  taxmaster: {
    getActiveTaxMaster: () => Auth.get(`/retailmaster/taxmaster/?active`),
    createTax: (content) => Auth.post("/retailmaster/taxmaster/", content),
    getTaxByID: (id) => Auth.get(`/retailmaster/taxmaster/${id}/`),
    deleteTaxByID: (id) => Auth.delete(`/retailmaster/taxmaster/${id}/`),
    getAllTax: (page, records, search) => Auth.get(`/retailmaster/taxmaster/?page=${page}&records=${records}&searchText=${search}`),
    getTaxList: () => Auth.get(`/retailmaster/taxmaster/?active`),
    updateTaxStatus: (id) => Auth.get(`/retailmaster/taxmaster/${id}/?changestatus`),
    updateTaxByID: (id, content) => Auth.put(`/retailmaster/taxmaster/${id}/`, content),
  },
  attributeEntry: {
    getActiveAttribute: () => Auth.get(`/retailmaster/attribute_entry/?is_active`),
    getAttributeEntryByID: (id) => Auth.get(`/retailmaster/attribute_entry/${id}/`),
    deleteAttributeEntryByID: (id) => Auth.delete(`/retailmaster/attribute_entry/${id}/`),
    getAllAttributeEntry: (page, records, search) => Auth.get(`/retailmaster/attribute_entry/?page=${page}&records=${records}&searchText=${search}`),
    createAttributeEntry: (content) => Auth.post("/retailmaster/attribute_entry/", content),
    updateAttributeEntryByID: (id, content) => Auth.put(`/retailmaster/attribute_entry/${id}/`, content),
    changeStatusAttributeEntry: (id) => Auth.get(`/retailmaster/attribute_entry/${id}/?changestatus`),
  },
  otherCharges: {
    getActiveCharges: () => Auth.get(`/retailmaster/other_charges/?is_active`),
    getOtherChargesByID: (id) => Auth.get(`/retailmaster/other_charges/${id}/`),
    deleteOtherChargesByID: (id) => Auth.delete(`/retailmaster/other_charges/${id}/`),
    getAllOtherCharges: (page, records, search) => Auth.get(`/retailmaster/other_charges/?page=${page}&records=${records}&searchText=${search}`),
    createOtherCharges: (content) => Auth.post("/retailmaster/other_charges/", content),
    updateOtherChargesByID: (id, content) => Auth.put(`/retailmaster/other_charges/${id}/`, content),
    changeStatusOtherCharges: (id) => Auth.get(`/retailmaster/other_charges/${id}/?changestatus`),
  },
  dayClose: {
    dayCloseManual: (content) => Auth.post("/retailmaster/day_close_manual/", content),
  },
  payDevice: {
    getPayDeviceByID: (id) => Auth.get(`/retailmaster/pay_device/${id}/`),
    deletePayDeviceByID: (id) => Auth.delete(`/retailmaster/pay_device/${id}/`),
    getAllPayDevice: (page, records, search) => Auth.get(`/retailmaster/pay_device/?page=${page}&records=${records}&searchText=${search}`),
    createPayDevice: (content) => Auth.post("/retailmaster/pay_device/", content),
    updatePayDeviceByID: (id, content) => Auth.put(`/retailmaster/pay_device/${id}/`, content),
    changeStatusPayDevice: (id) => Auth.get(`/retailmaster/pay_device/${id}/?changestatus`),
  },
  stockIssueType: {
    getStockIssueTypeByID: (id) => Auth.get(`/retailmaster/stock_issue_type/${id}/`),
    deleteStockIssueTypeByID: (id) => Auth.delete(`/retailmaster/stock_issue_type/${id}/`),
    getAllStockIssueType: (page, records, search) =>
      Auth.get(`/retailmaster/stock_issue_type/?page=${page}&records=${records}&searchText=${search}`),
    createStockIssueType: (content) => Auth.post("/retailmaster/stock_issue_type/", content),
    updateStockIssueTypeByID: (id, content) => Auth.put(`/retailmaster/stock_issue_type/${id}/`, content),
    changeStatusStockIssueType: (id) => Auth.get(`/retailmaster/stock_issue_type/${id}/?changestatus`),
    getActiveStockIssueType: () => Auth.get(`/retailmaster/stock_issue_type/?is_active`),
  },
  karigar: {
    getSupplierByID: (id) => Auth.get(`/retailmaster/supplier/${id}/`),
    deleteSupplierByID: (id) => Auth.delete(`/retailmaster/supplier/${id}/`),
    getAllSupplier: (page, records, search, pathname) => Auth.get(`/retailmaster/supplier/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    createSupplier: (content) => Auth.post("/retailmaster/supplier/", content),
    updateSupplierByID: (id, content) => Auth.put(`/retailmaster/supplier/${id}/`, content),
    changeStatusSupplier: (id) => Auth.get(`/retailmaster/supplier/${id}/?changestatus`),
    getActiveSupplier: () => Auth.get(`/retailmaster/supplier/?active`),
    getLocalVendorSupplier: () => Auth.get(`/retailmaster/supplier/?local_vendors`),

    createSupplierProduct: (content) => Auth.post("/retailmaster/supplier_product/", content),
    getSupplierProductByID: (id) => Auth.get(`/retailmaster/supplier_product/${id}/`),
  },
  weightrange: {
    getWeightRangeByID: (id) => Auth.get(`/retailmaster/weight_range/${id}/`),
    deleteWeightRangeByID: (id) => Auth.delete(`/retailmaster/weight_range/${id}/`),
    getAllWeightRange: (page, records, search) => Auth.get(`/retailmaster/weight_range/?page=${page}&records=${records}&searchText=${search}`),
    createWeightRange: (content) => Auth.post("/retailmaster/weight_range/", content),
    editWeightRange: (content) => Auth.put("/retailmaster/weight_range/", content),
    updateWeightRangeByID: (id, content) => Auth.put(`/retailmaster/weight_range/${id}/`, content),
    changeStatusWeightRange: (id) => Auth.get(`/retailmaster/weight_range/${id}/?changestatus`),
  },
  floor: {
    getFloorByID: (id) => Auth.get(`/retailmaster/floor/${id}/`),
    deleteFloorByID: (id) => Auth.delete(`/retailmaster/floor/${id}/`),
    getAllFloor: (page, records, search) => Auth.get(`/retailmaster/floor/?page=${page}&records=${records}&searchText=${search}`),
    createFloor: (content) => Auth.post("/retailmaster/floor/", content),
    updateFloorByID: (id, content) => Auth.put(`/retailmaster/floor/${id}/`, content),
    changeStatusFloor: (id) => Auth.get(`/retailmaster/floor/${id}/?changestatus`),
    getFloorOptions: () => Auth.get(`/retailmaster/floor/?is_active`),
  },
  counter: {
    getCounterByID: (id) => Auth.get(`/retailmaster/counter/${id}/`),
    deleteCounterByID: (id) => Auth.delete(`/retailmaster/counter/${id}/`),
    getAllCounter: (page, records, search) => Auth.get(`/retailmaster/counter/?page=${page}&records=${records}&searchText=${search}`),
    createCounter: (content) => Auth.post("/retailmaster/counter/", content),
    updateCounterByID: (id, content) => Auth.put(`/retailmaster/counter/${id}/`, content),
    changeStatusCounter: (id) => Auth.get(`/retailmaster/counter/${id}/?changestatus`),
    getCounterOptions: () => Auth.get(`/retailmaster/counter/?is_active`),
  },
  registered_device: {
    getRegisteredDeviceByID: (id) => Auth.get(`/retailmaster/registered_device/${id}/`),
    deleteRegisteredDeviceByID: (id) => Auth.delete(`/retailmaster/registered_device/${id}/`),
    getAllRegisteredDevice: (page, records, search) =>
      Auth.get(`/retailmaster/registered_device/?page=${page}&records=${records}&searchText=${search}`),
    createRegisteredDevice: (content) => Auth.post("/retailmaster/registered_device/", content),
    updateRegisteredDeviceByID: (id, content) => Auth.put(`/retailmaster/registered_device/${id}/`, content),
    changeStatusRegisteredDevice: (id) => Auth.get(`/retailmaster/registered_device/${id}/?changestatus`),
  },
  section_wise_sales: {
    // getSectionWiseSalesByID: (id) => Auth.get(`/catalogmasters/counter_wise_target/${id}/`),
    // deleteSectionWiseSalesByID: (id) => Auth.delete(`/catalogmasters/counter_wise_target/${id}/`),
    // getAllSectionWiseSalesDevice: (page, records) => Auth.get(`/catalogmasters/counter_wise_target/?page=${page}&records=${records}`),
    createSectionWiseSales: (content) => Auth.post("/catalogmasters/counter_wise_target/", content),
    getSectionWiseSalesItems: (content) => Auth.post("/catalogmasters/counter_wise_target_items/", content),
    // updateSectionWiseSalesByID: (id, content) => Auth.put(`/catalogmasters/counter_wise_target/${id}/`, content),
    // changeStatusSectionWiseSales: (id) => Auth.get(`/catalogmasters/counter_wise_target/${id}/?changestatus`),
  },
  profession: {
    getProfessionByID: (id) => Auth.get(`/retailmaster/profession/${id}/`),
    deleteProfessionByID: (id) => Auth.delete(`/retailmaster/profession/${id}/`),
    getAllProfession: (page, records, search) => Auth.get(`/retailmaster/profession/?page=${page}&records=${records}&searchText=${search}`),
    getActiveProfessions: () => Auth.get(`/retailmaster/profession/?is_active`),
    createProfession: (content) => Auth.post("/retailmaster/profession/", content),
    updateProfessionByID: (id, content) => Auth.put(`/retailmaster/profession/${id}/`, content),
    changeStatusProfession: (id) => Auth.get(`/retailmaster/profession/${id}/?changestatus`),
  },

  region: {
    getRegionByID: (id) => Auth.get(`/retailmaster/region/${id}/`),
    deleteRegionByID: (id) => Auth.delete(`/retailmaster/region/${id}/`),
    getAllRegion:(page, records, search) => Auth.get(`/retailmaster/region/?page=${page}&records=${records}&searchText=${search}`),
    getActiveRegions: () => Auth.get(`/retailmaster/region/?is_active`),
    createRegion: (content) => Auth.post("/retailmaster/region/", content),
    updateRegionByID: (id, content) => Auth.put(`/retailmaster/region/${id}/`, content),
    changeStatusRegion: (id) => Auth.get(`/retailmaster/region/${id}/?changestatus`),
  },
  container: {
    getContainerByID: (id) => Auth.get(`/retailmaster/container/${id}/`),
    getContainerPdfByID: (id) => Auth.get(`/retailmaster/container_print/${id}/`),
    deleteContainerByID: (id) => Auth.delete(`/retailmaster/container/${id}/`),
    getAllContainer: (page, records, search) => Auth.get(`/retailmaster/container/?page=${page}&records=${records}&searchText=${search}`),
    getActiveContainers: () => Auth.get(`/retailmaster/container/?active`),
    createContainer: (content) => Auth.post("/retailmaster/container/", content),
    updateContainerByID: (id, content) => Auth.put(`/retailmaster/container/${id}/`, content),
    changeStatusContainer: (id) => Auth.get(`/retailmaster/container/${id}/?changestatus`),
  },
  oldMetalItem: {
    getOldMetalItemByID: (id) => Auth.get(`/retailmaster/old_metal_item/${id}/`),
    deleteOldMetalItemByID: (id) => Auth.delete(`/retailmaster/old_metal_item/${id}/`),
    getAllOldMetalItem: (page, records, search) => Auth.get(`/retailmaster/old_metal_item/?page=${page}&records=${records}&searchText=${search}`),
    createOldMetalItem: (content) => Auth.post("/retailmaster/old_metal_item/", content),
    updateOldMetalItemByID: (id, content) => Auth.put(`/retailmaster/old_metal_item/${id}/`, content),
    changeStatusOldMetalItem: (id) => Auth.get(`/retailmaster/old_metal_item/${id}/?changestatus`),
    getActiveOldMetalItem: () => Auth.get(`/retailmaster/old_metal_item/?active`),
  },
  otherWeight: {
    getOtherWeightByID: (id) => Auth.get(`/retailmaster/other_weight/${id}/`),
    deleteOtherWeightByID: (id) => Auth.delete(`/retailmaster/other_weight/${id}/`),
    getAllOtherWeight: (page, records, search) => Auth.get(`/retailmaster/other_weight/?page=${page}&records=${records}&searchText=${search}`),
    createOtherWeight: (content) => Auth.post("/retailmaster/other_weight/", content),
    updateOtherWeightByID: (id, content) => Auth.put(`/retailmaster/other_weight/${id}/`, content),
    changeStatusOtherWeight: (id) => Auth.get(`/retailmaster/other_weight/${id}/?changestatus`),
    getActiveOtherWeight: () => Auth.get(`/retailmaster/other_weight/?active`),
  },
  cashOpeningBalance: {
    getCashOpeningBalanceByID: (id) => Auth.get(`/retailmaster/cash_opening_balance/${id}/`),
    deleteCashOpeningBalanceByID: (id) => Auth.delete(`/retailmaster/cash_opening_balance/${id}/`),
    getAllCashOpeningBalance: (page, records, search) => Auth.get(`/retailmaster/cash_opening_balance/?page=${page}&records=${records}&searchText=${search}`),
    createCashOpeningBalance: (content) => Auth.post("/retailmaster/cash_opening_balance/", content),
    updateCashOpeningBalanceByID: (id, content) => Auth.put(`/retailmaster/cash_opening_balance/${id}/`, content),
    changeStatusCashOpeningBalance: (id) => Auth.get(`/retailmaster/cash_opening_balance/${id}/?changestatus`),
    getActiveCashOpeningBalance: () => Auth.get(`/retailmaster/cash_opening_balance/?active`),
  },
  accountHead: {
    getAccountHeadByID: (id) => Auth.get(`/retailmaster/account_head/${id}/`),
    deleteAccountHeadByID: (id) => Auth.delete(`/retailmaster/account_head/${id}/`),
    getAllAccountHead: (page, records, search) => Auth.get(`/retailmaster/account_head/?page=${page}&records=${records}&searchText=${search}`),
    createAccountHead: (content) => Auth.post("/retailmaster/account_head/", content),
    updateAccountHeadByID: (id, content) => Auth.put(`/retailmaster/account_head/${id}/`, content),
    changeStatusAccountHead: (id) => Auth.get(`/retailmaster/account_head/${id}/?changestatus`),
    getActiveAccountHead: () => Auth.get(`/retailmaster/account_head/?active`),
  },
  service: {
    getServiceByID: (id) => Auth.get(`/retailmaster/service/${id}/`),
    deleteServiceByID: (id) => Auth.delete(`/retailmaster/service/${id}/`),
    getAllService: (page, records, search) => Auth.get(`/retailmaster/service/?page=${page}&records=${records}&searchText=${search}`),
    createService: (content) => Auth.post("/retailmaster/service/", content),
    updateServiceByID: (id, content) => Auth.put(`/retailmaster/service/${id}/`, content),
    changeStatusService: (id) => Auth.get(`/retailmaster/service/${id}/?changestatus`),
    getActiveService: () => Auth.get(`/retailmaster/service/?active`),
    getServiceOptions: () => Auth.get(`/retailmaster/service/?options`),
  },
  customerProof: {
    getCustomerProofByID: (id) => Auth.get(`/retailmaster/customer_proof/${id}/`),
    deleteCustomerProofByID: (id) => Auth.delete(`/retailmaster/customer_proof/${id}/`),
    getAllCustomerProof: (page, records, search) => Auth.get(`/retailmaster/customer_proof/?page=${page}&records=${records}&searchText=${search}`),
    createCustomerProof: (content) => Auth.post("/retailmaster/customer_proof/", content),
    updateCustomerProofByID: (id, content) => Auth.put(`/retailmaster/customer_proof/${id}/`, content),
    changeStatusCustomerProof: (id) => Auth.get(`/retailmaster/customer_proof/${id}/?changestatus`),
    getActiveCustomerProof: () => Auth.get(`/retailmaster/customer_proof/?active`),
  },
  bankDeposit: {
    get: (id) => Auth.get(`/retailmaster/bank_deposit/${id}/`),
    changeStatusbank: (id) => Auth.get(`/retailmaster/bank_deposit/${id}/?changestatus`),
    changeStatus: (id) => Auth.get(`/retailmaster/bank_deposit/${id}/?changestatus`),
    deleteBank: (id) => Auth.delete(`/retailmaster/bank_deposit/${id}/`),
    getAll: () => Auth.get("/retailmaster/bank_deposit/"),
    create: (content) => Auth.post("/retailmaster/bank_deposit/", content),
    update: (id, content) => Auth.put(`/retailmaster/bank_deposit/${id}/`, content),
    getCashBalance: (id) => Auth.get(`/reports/get_cash_balance/?id_branch=${id}`),
  },
  depositMaster: {
    getDepositMasterByID: (id) => Auth.get(`/retailmaster/deposit_master/${id}/`),
    deleteDepositMasterByID: (id) => Auth.delete(`/retailmaster/deposit_master/${id}/`),
    getAllDepositMaster: (page, records, search, pathname) => Auth.get(`/retailmaster/deposit_master/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    getDepositMasterOptions: () => Auth.get(`/retailmaster/deposit_master/?active`),
    createDepositMaster: (content) => Auth.post("/retailmaster/deposit_master/", content),
    updateDepositMasterByID: (id, content) => Auth.put(`/retailmaster/deposit_master/${id}/`, content),
    changeStatusDepositMaster: (id) => Auth.get(`/retailmaster/deposit_master/${id}/?changestatus`),
  },
  incentiveSettings: {
    get: (id) => Auth.get(`/retailmaster/incentive_settings/${id}/`),
    delete: (id) => Auth.delete(`/retailmaster/incentive_settings/${id}/`),
    getAll: (page, records, search, pathname) => Auth.get(`/retailmaster/incentive_settings/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    create: (content) => Auth.post("/retailmaster/incentive_settings/", content),
    update: (id, content) => Auth.put(`/retailmaster/incentive_settings/${id}/`, content),
  },
  religionMaster: {
    getReligionMasterByID: (id) => Auth.get(`/retailmaster/religion_master/${id}/`),
    deleteReligionMasterByID: (id) => Auth.delete(`/retailmaster/religion_master/${id}/`),
    getAllReligionMaster: (page, records, search) => Auth.get(`/retailmaster/religion_master/?page=${page}&records=${records}&searchText=${search}`),
    getReligionMasterOptions: () => Auth.get(`/retailmaster/religion_master/?is_active`),
    createReligionMaster: (content) => Auth.post("/retailmaster/religion_master/", content),
    updateReligionMasterByID: (id, content) => Auth.put(`/retailmaster/religion_master/${id}/`, content),
    changeStatusReligionMaster: (id) => Auth.get(`/retailmaster/religion_master/${id}/?changestatus`),
  },
};

const retailMasterAPI = { ...api };

export default retailMasterAPI;
