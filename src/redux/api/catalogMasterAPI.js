import { Auth } from "../configs";

const api = {
  metal: {
    getMetalByID: (id) => Auth.get(`/catalogmasters/metal/${id}/`),
    deleteMetalByID: (id) => Auth.delete(`/catalogmasters/metal/${id}/`),
    getAllMetal: (page, records,search,pathname) => Auth.get(`/catalogmasters/metal/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    createMetal: (content) => Auth.post("/catalogmasters/metal/", content),
    updateMetalByID: (id, content) => Auth.put(`/catalogmasters/metal/${id}/`, content),
    getActiveMetal: () => Auth.get(`/catalogmasters/metal/?status`),
    changeStatusMetal: (id) => Auth.get(`/catalogmasters/metal/${id}/?changestatus`),
  },
  purity: {
    getPurityByID: (id) => Auth.get(`/catalogmasters/purity/${id}/`),
    deletePurityByID: (id) => Auth.delete(`/catalogmasters/purity/${id}/`),
    getAllPurity: (page, records,search,pathname) => Auth.get(`/catalogmasters/purity/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    createPurity: (content) => Auth.post("/catalogmasters/purity/", content),
    updatePurityByID: (id, content) => Auth.put(`/catalogmasters/purity/${id}/`, content),
    getActivePurity: (id) => Auth.get("/catalogmasters/purity/?status"),
    changeStatusPurity: (id) => Auth.get(`/catalogmasters/purity/${id}/?changestatus`),
  },
  cut: {
    getCutByID: (id) => Auth.get(`/catalogmasters/cut/${id}/`),
    deleteCutByID: (id) => Auth.delete(`/catalogmasters/cut/${id}/`),
    getAllCut: (page, records,search,pathname) => Auth.get(`/catalogmasters/cut/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    createCut: (content) => Auth.post("/catalogmasters/cut/", content),
    updateCutByID: (id, content) => Auth.put(`/catalogmasters/cut/${id}/`, content),
    getActiveCut: (id) => Auth.get("/catalogmasters/cut/?status"),
    changeStatusCut: (id) => Auth.get(`/catalogmasters/cut/${id}/?changestatus`),
  },

  color: {
    getColorByID: (id) => Auth.get(`/catalogmasters/color/${id}/`),
    deleteColorByID: (id) => Auth.delete(`/catalogmasters/color/${id}/`),
    getAllColor: (page, records,search,pathname) => Auth.get(`/catalogmasters/color/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    createColor: (content) => Auth.post("/catalogmasters/color/", content),
    updateColorByID: (id, content) => Auth.put(`/catalogmasters/color/${id}/`, content),
    getActiveColor: (id) => Auth.get("/catalogmasters/color/?status"),
    changeStatusColor: (id) => Auth.get(`/catalogmasters/color/${id}/?changestatus`),
  },

  shape: {
    getShapeByID: (id) => Auth.get(`/catalogmasters/shape/${id}/`),
    deleteShapeByID: (id) => Auth.delete(`/catalogmasters/shape/${id}/`),
    getAllShape: (page, records,search,pathname) => Auth.get(`/catalogmasters/shape/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    createShape: (content) => Auth.post("/catalogmasters/shape/", content),
    updateShapeByID: (id, content) => Auth.put(`/catalogmasters/shape/${id}/`, content),
    getActiveShape: (id) => Auth.get("/catalogmasters/shape/?status"),
    changeStatusShape: (id) => Auth.get(`/catalogmasters/shape/${id}/?changestatus`),
  },

  clarity: {
    getClarityByID: (id) => Auth.get(`/catalogmasters/clarity/${id}/`),
    deleteClarityByID: (id) => Auth.delete(`/catalogmasters/clarity/${id}/`),
    getAllClarity: (page, records,search,pathname) => Auth.get(`/catalogmasters/clarity/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    createClarity: (content) => Auth.post("/catalogmasters/clarity/", content),
    updateClarityByID: (id, content) => Auth.put(`/catalogmasters/clarity/${id}/`, content),
    getActiveClarity: (id) => Auth.get("/catalogmasters/clarity/?status"),
    changeStatusClarity: (id) => Auth.get(`/catalogmasters/clarity/${id}/?changestatus`),
  },

  quality: {
    getQualityByID: (id) => Auth.get(`/catalogmasters/quality/${id}/`),
    deleteQualityByID: (id) => Auth.delete(`/catalogmasters/quality/${id}/`),
    getAllQuality: (page, records,search,pathname) => Auth.get(`/catalogmasters/quality/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    createQuality: (content) => Auth.post("/catalogmasters/quality/", content),
    updateQualityByID: (id, content) => Auth.put(`/catalogmasters/quality/${id}/`, content),
    getActiveQuality: (id) => Auth.get("//quality/?status"),
    changeStatusQuality: (id) => Auth.get(`/catalogmasters/quality/${id}/?changestatus`),
  },

  category: {
    getActiveCategory: (page) => Auth.get(`/catalogmasters/category/?status`),
    getCategoryByID: (id) => Auth.get(`/catalogmasters/category/${id}/`),
    changeStatusCategory: (id) => Auth.get(`/catalogmasters/category/${id}/?changestatus`),
    getAllCategory: (page, records,search,pathname) => Auth.get(`/catalogmasters/category/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    createCategory: (content) => Auth.post("/catalogmasters/category/", content),
    updateCategoryByID: (id, content) => Auth.put(`/catalogmasters/category/${id}/`, content),
    deleteCategoryByID: (id) => Auth.delete(`/catalogmasters/category/${id}/`),
  },
  categoryPurityRate: {
    getAllCategoryPurityRate: (page, records,search) => Auth.get(`/catalogmasters/category_purity_rate_list/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    getCategoryPurityRate: () => Auth.get(`/catalogmasters/category_purity_rate/`),
    createCategoryPurityRate: (content) => Auth.post(`/catalogmasters/category_purity_rate/`, content),
  },
  product: {
    getActiveProduct: (page) => Auth.get(`/catalogmasters/product/?status=active`),
    getProductByID: (id) => Auth.get(`/catalogmasters/product/${id}/`),
    deleteProductByID: (id) => Auth.delete(`/catalogmasters/product/${id}/`),
    getAllProduct: (page,records,search,pathname) => Auth.get(`/catalogmasters/product/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    createProduct: (content) => Auth.post("/catalogmasters/product/", content),
    updateProductByID: (id, content) => Auth.put(`/catalogmasters/product/${id}/`, content),
    deleteProductById: (id) => Auth.delete(`/catalogmasters/product/${id}/`),
    updateProductStatus: (id) => Auth.get(`/catalogmasters/product/${id}/?changestatus`),
  },
  design: {
    getDesignMappingDetails: (page) => Auth.get(`/catalogmasters/design_mapping/`),
    deleteDesignMappingById: (id) => Auth.delete(`/catalogmasters/design_mapping/${id}/`),
    getAllDesignMapping: (page) => Auth.get(`/catalogmasters/design_mapping/?page=${page}`),
    createDesignMapping: (content) => Auth.post("/catalogmasters/design_mapping/", content),
    getDesignById: (id) => Auth.get(`/catalogmasters/design/${id}/`),
    deleteDesignById: (id) => Auth.delete(`/catalogmasters/design/${id}/`),
    getAllDesign: (page,records,search,pathname) => Auth.get(`/catalogmasters/design/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    getActiveDesign: (page) => Auth.get(`/catalogmasters/design/?active`),
    createDesign: (content) => Auth.post("/catalogmasters/design/", content),
    updateDesignById: (id, content) => Auth.put(`/catalogmasters/design/${id}/`, content),
    changeStatusDesign: (id) => Auth.get(`/catalogmasters/design/${id}/?changestatus`),
  },
  subDesign: {
    getSubDesignMappingDetails: (page) => Auth.get(`/catalogmasters/sub_design_mapping/`),
    getSubDesignById: (id) => Auth.get(`/catalogmasters/sub_design/${id}/`),
    deleteSubDesignById: (id) => Auth.delete(`/catalogmasters/sub_design/${id}/`),
    getAllSubDesign: (page,records,search,pathname) => Auth.get(`/catalogmasters/sub_design/?page=${page}&searchText=${search}&records=${records}&path_name=${pathname}`),
    getActiveSubDesign: (page) => Auth.get(`/catalogmasters/sub_design/?active`),
    createSubDesign: (content) => Auth.post("/catalogmasters/sub_design/", content),
    updateSubDesignById: (id, content) => Auth.put(`/catalogmasters/sub_design/${id}/`, content),
    changeStatusSubDesign: (id) => Auth.get(`/catalogmasters/sub_design/${id}/?changestatus`),
  },
  subDesignMapping: {
    getSubDesignMappingDetails: (page) => Auth.get(`/catalogmasters/sub_design_mapping/`),
    deleteSubDesignMappingById: (id) => Auth.delete(`/catalogmasters/sub_design_mapping/${id}/`),
    getAllSubDesignMapping: (page) => Auth.get(`/catalogmasters/sub_design_mapping/?page=${page}`),
    createSubDesignMapping: (content) => Auth.post("/catalogmasters/sub_design_mapping/", content),
  },
  section: {
    getActiveSection: (page) => Auth.get(`/catalogmasters/section/?active`),
    getProductSection: (page) => Auth.get(`/catalogmasters/section/?product_section`),
    getSectionByID: (id) => Auth.get(`/catalogmasters/section/${id}/`),
    deleteSectionByID: (id) => Auth.delete(`/catalogmasters/section/${id}/`),
    getAllSection: (page,records,search,pathname) => Auth.get(`/catalogmasters/section/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    createSection: (content) => Auth.post("/catalogmasters/section/", content),
    updateSectionByID: (id, content) => Auth.put(`/catalogmasters/section/${id}/`, content),
    changeStatusSection: (id) => Auth.get(`/catalogmasters/section/${id}/?changestatus`),
  },
  size: {
    getActiveSize: (page) => Auth.get(`/retailmaster/size/?active`),
    getSizeById: (id) => Auth.get(`/retailmaster/size/${id}/`),
    deleteSizeById: (id) => Auth.delete(`/retailmaster/size/${id}/`),
    getAllSize: (page,records,search,pathname) => Auth.get(`/retailmaster/size/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    createSize: (content) => Auth.post("/retailmaster/size/", content),
    updateSizeById: (id, content) => Auth.put(`/retailmaster/size/${id}/`, content),
    changeStatusSize: (id) => Auth.get(`/retailmaster/size/${id}/?changestatus`),
  },

  uom: {
    getUomList: (page) => Auth.get(`/retailmaster/uom/?active`),
  },
  stone: {
    getActiveStoneList: (page) => Auth.get(`/catalogmasters/stone/?status`),
    getStoneByID: (id) => Auth.get(`/catalogmasters/stone/${id}/`),
    deleteStoneByID: (id) => Auth.delete(`/catalogmasters/stone/${id}/`),
    getAllStone: (page,records,search,pathname) => Auth.get(`/catalogmasters/stone/?page=${page}&records=${records}&searchText=${search}&path_name=${pathname}`),
    createStone: (content) => Auth.post("/catalogmasters/stone/", content),
    changeStatusStone: (id) => Auth.get(`/catalogmasters/stone/${id}/?changestatus`),
    updateStoneByID: (id, content) => Auth.put(`/catalogmasters/stone/${id}/`, content),
  },
  quality_code: {
    getActiveQualityCode: (page) => Auth.get(`/catalogmasters/quality_code/?status`),
  },
  cal_type: {
    getActiveCalType: (page) => Auth.get(`/catalogmasters/caltype/?active`),
  },
  taxgroup: {
    getActiveTaxGroup: (page) => Auth.get(`/retailmaster/tax_group_master/?active`),
  },
  diamondRateMaster: {
    getDiamondRateMasterByID: (id) => Auth.get(`/catalogmasters/diamond_rate/${id}/`),
    deleteDiamondRateMasterByID: (id) => Auth.delete(`/catalogmasters/diamond_rate/${id}/`),
    getAllDiamondRateMaster: (page, records,search) =>
      Auth.get(`/catalogmasters/diamond_rate/?page=${page}&records=${records}&searchText=${search}`),
    createDiamondRateMaster: (content) => Auth.post("/catalogmasters/diamond_rate/", content),
    createPurchaseDiamondRateMaster: (content) => Auth.post("/catalogmasters/purchase_diamond_rate/", content),
    filterDiamondRateMaster: (content) => Auth.post("/catalogmasters/diamond_rate_filter/", content),
    filterPurchaseDiamondRateMaster: (content) => Auth.post("/catalogmasters/purchase_diamond_rate_filter/", content),
    updateDiamondRateMasterByID: (id, content) => Auth.put(`/catalogmasters/diamond_rate/${id}/`, content),
    changeStatusDiamondRateMaster: (id) => Auth.get(`/catalogmasters/diamond_rate/${id}/?changestatus`),
    getActiveDiamondRateMaster: (page, records) => Auth.get(`/catalogmasters/diamond_rate/?active`),
  },
  reOrderSettings: {
    getReOrderSettingsByID: (id) => Auth.get(`/catalogmasters/reorder_setting/${id}/`),
    deleteReOrderSettingsByID: (id) => Auth.delete(`/catalogmasters/reorder_setting/${id}/`),
    getAllReOrderSettings: (page, records,search) =>
      Auth.get(`/catalogmasters/reorder_setting/?page=${page}&records=${records}&searchText=${search}`),
    createReOrderSettings: (content) => Auth.post("/catalogmasters/reorder_setting/", content),
    updateReOrderSettingsByID: (id, content) => Auth.put(`/catalogmasters/reorder_setting/${id}/`, content),
    changeStatusReOrderSettings: (id) => Auth.get(`/catalogmasters/reorder_setting/${id}/?changestatus`),
    getReOrderSettings: (branch, product) =>
      Auth.get(`/catalogmasters/reorder_setting/?branch=${branch}&product=${product}`),
  },
  mcVaSettings: {
    getMcVaSettings: () => Auth.get(`/catalogmasters/mc_va_setting_list/`),
    getMcVa: (content) => Auth.post(`/catalogmasters/mc_va_setting_list/`, content),
    createMcVaSettings: (content) => Auth.post("/catalogmasters/mc_va_setting/", content),
    getCustomerMcVa: (content) => Auth.post(`/catalogmasters/customer_mc_va_setting_list/`, content),
    createCustomerMcVaSettings: (content) => Auth.post("/catalogmasters/customer_mc_va_setting/", content),
  },
  repair: {
    getSubDesignMappingDetails: (page) => Auth.get(`/catalogmasters/sub_design_mapping/`),
    getRepairDamageMasterById: (id) => Auth.get(`/catalogmasters/repair_master/${id}/`),
    deleteRepairDamageMasterById: (id) => Auth.delete(`/catalogmasters/repair_master/${id}/`),
    getAllRepairDamageMaster: (page) => Auth.get(`/catalogmasters/repair_master/?page=${page}`),
    getActiveRepairDamageMaster: (page) => Auth.get(`/catalogmasters/repair_master/?active`),
    createRepairDamageMaster: (content) => Auth.post("/catalogmasters/repair_master/", content),
    updateRepairDamageMasterById: (id, content) => Auth.put(`/catalogmasters/repair_master/${id}/`, content),
    updateRepairDamageMasterStatus: (id) => Auth.get(`/catalogmasters/repair_master/${id}/?changestatus`),
  },
};
const catalogMasterAPI = { ...api };

export default catalogMasterAPI;
