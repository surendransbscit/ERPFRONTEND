import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  createMetal,
  createPurity,
  createProduct,
  createDesign,
  createSubDesign,
  createSection,
  createSize,
  createDesignMapping,
  createSubDesignMapping,
  getActiveCategory,
  getActiveProduct,
  getActiveSection,
  getActivePurity,
  getActiveMetal,
  getActiveTaxGroup,
  getActiveSubDesign,
  getCalType,
  getAllMetal,
  getAllPurity,
  getAllProduct,
  getAllDesign,
  getAllSubDesign,
  getAllSection,
  getAllSize,
  getAllDesignMapping,
  getAllSubDesignMapping,
  getMetalById,
  getPurityById,
  getProductById,
  getDesignById,
  getSubDesignById,
  getSectionById,
  getSizeById,
  updateMetalById,
  updatePurityById,
  updateProductById,
  updateDesignById,
  updateSubDesignById,
  updateSectionById,
  updateSizeById,
  getDesignMappingDetails,
  getSubDesignMappingDetails,
  getActiveStoneList,
  getActiveQualityCode,
  getActiveSize,
  getActiveDesign,
  deleteSectionByID,
  deleteSizeById,
  deleteProductById,
  deleteDesignMappingById,
  deleteSubDesignMappingById,
  getAllCategory,
  getCategoryById,
  updateCategoryStatus,
  deleteCategoryById,
  createCategory,
  updateCategoryById,
  deleteDesignById,
  updateDesignStatus,
  getAllStone,
  getStoneById,
  deleteSubDesignById,
  updateSubDesignStatus,
  deletePurityById,
  updatePurityStatus,
  updateMetalStatus,
  updateProductStatus,
  deleteMetalById,
  updateSectionStatus,
  deleteStoneById,
  updateStoneStatus,
  createCut,
  getAllCut,
  getCutById,
  updateCutById,
  getActiveCut,
  updateCutStatus,
  deleteCutById,
  createColor,
  getAllColor,
  getColorById,
  updateColorById,
  getActiveColor,
  updateColorStatus,
  deleteColorById,
  createShape,
  getAllShape,
  getShapeById,
  updateShapeById,
  getActiveShape,
  updateShapeStatus,
  deleteShapeById,
  createClarity,
  getAllClarity,
  getClarityById,
  updateClarityById,
  getActiveClarity,
  updateClarityStatus,
  deleteClarityById,
  createQuality,
  getAllQuality,
  getQualityById,
  updateQualityById,
  getActiveQuality,
  updateQualityStatus,
  deleteQualityById,
  updateSizeStatus,
  getProductSection,
  getAllDiamondRateMaster,
  createDiamondRateMaster,
  updateDiamondRateMasterById,
  getDiamondRateMasterById,
  deleteDiamondRateMasterById,
  updateDiamondRateMasterStatus,
  getAllReOrderSettings,
  getReOrderSettingsById,
  deleteReOrderSettingsById,
  updateReOrderSettingsStatus,
  createReOrderSettings,
  updateReOrderSettingsById,
  getMcVaSettings,
  getReOrderSettings,
  getMcVa,
  createMcVaSettings,
  getCustomerMcVa,
  createCustomerMcVaSettings,
  filterDiamondRateMaster,
  filterPurchaseDiamondRateMaster,
  createPurchaseDiamondRateMaster,
  createRepairDamageMaster,
  updateRepairDamageMasterStatus,
  deleteRepairDamageMasterById,
  getRepairDamageMasterById,
  getAllRepairDamageMaster,
  updateRepairDamageMasterById,
  getActiveRepairDamageMaster,
  getActiveDiamondRateMaster,
  getCategoryPurityRate,
  createCategoryPurityRate,
  getAllCategoryPurityRate,
} from "../thunks/catalogMaster";
import { toastsuccess } from "../../components/sds-toast-style/toast-style";

export const metalReducerInitialState = {
  metalList: [],
  activeMetalList: [],
  metalInfo: null,
  isError: null,
  isLoading: false,
};

export const metalReducer = createSlice({
  name: "metalReducer",
  initialState: metalReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllMetal.fulfilled, (state, action) => {
      state.metalList = action.payload;
      state.metalInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getActiveMetal.fulfilled, (state, action) => {
      state.activeMetalList = action.payload;
      state.metalInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getMetalById.fulfilled, (state, action) => {
      state.metalInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(deleteMetalById.fulfilled, (state, action) => {
      toastsuccess("Metal Deleted Successfully");
      state.metalInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateMetalStatus.fulfilled, (state, action) => {
      toastsuccess("Metal Status changed Successfully");
      state.metalInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getActiveMetal.pending,
        getAllMetal.pending,
        getMetalById.pending,
        createMetal.pending,
        updateMetalById.pending,
        deleteMetalById.pending,
        updateMetalStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getActiveMetal.rejected,
        getAllMetal.rejected,
        getMetalById.rejected,
        createMetal.rejected,
        updateMetalById.rejected,
        deleteMetalById.rejected,
        updateMetalStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(isAnyOf(getAllMetal.fulfilled, createMetal.fulfilled, updateMetalById.fulfilled), (state) => {
      state.metalInfo = null;
      state.isLoading = false;
      state.isError = false;
    });
  },
});

//Purity
export const purityReducerInitialState = {
  purityList: [],
  activePurityList: [],
  purityInfo: null,
  isError: null,
  isLoading: false,
};

export const purityReducer = createSlice({
  name: "purityReducer",
  initialState: purityReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllPurity.fulfilled, (state, action) => {
      state.purityList = action.payload;
      state.purityInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getActivePurity.fulfilled, (state, action) => {
      state.activePurityList = action.payload;
      state.purityInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getPurityById.fulfilled, (state, action) => {
      state.purityInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deletePurityById.fulfilled, (state, action) => {
      toastsuccess("Purity Deleted Successfully");
      state.purityInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updatePurityStatus.fulfilled, (state, action) => {
      toastsuccess("Purity Status changed Successfully");
      state.purityInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllPurity.pending,
        getActivePurity.pending,
        getPurityById.pending,
        createPurity.pending,
        updatePurityById.pending,
        deletePurityById.pending,
        updatePurityStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllPurity.rejected,
        getActivePurity.rejected,
        getPurityById.rejected,
        createPurity.rejected,
        updatePurityById.rejected,
        deletePurityById.rejected,
        updatePurityStatus.pending
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllPurity.fulfilled, getActivePurity.fulfilled, createPurity.fulfilled, updatePurityById.fulfilled),
      (state) => {
        state.purityInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//Cut
export const cutReducerInitialState = {
  cutList: [],
  activeCutList: [],
  cutInfo: null,
  isError: null,
  isLoading: false,
};

export const cutReducer = createSlice({
  name: "cutReducer",
  initialState: cutReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCut.fulfilled, (state, action) => {
      console.log("SDS");
      state.cutList = action.payload;
      state.cutInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getActiveCut.fulfilled, (state, action) => {
      state.activeCutList = action.payload;
      state.cutInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getCutById.fulfilled, (state, action) => {
      state.cutInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteCutById.fulfilled, (state, action) => {
      toastsuccess("Cut Deleted Successfully");
      state.cutInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateCutStatus.fulfilled, (state, action) => {
      toastsuccess("Cut Status Changed Successfully");
      state.cutInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllCut.pending,
        getActiveCut.pending,
        getCutById.pending,
        createCut.pending,
        updateCutById.pending,
        deleteCutById.pending,
        updateCutStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllCut.rejected,
        getActiveCut.rejected,
        getCutById.rejected,
        createCut.rejected,
        updateCutById.rejected,
        deleteCutById.rejected,
        updateCutStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllCut.fulfilled, getActiveCut.fulfilled, createCut.fulfilled, updateCutById.fulfilled),
      (state) => {
        state.cutInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//Color
export const colorReducerInitialState = {
  colorList: [],
  activeColorList: [],
  colorInfo: null,
  isError: null,
  isLoading: false,
};

export const colorReducer = createSlice({
  name: "colorReducer",
  initialState: colorReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllColor.fulfilled, (state, action) => {
      state.colorList = action.payload;
      state.colorInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getActiveColor.fulfilled, (state, action) => {
      state.activeColorList = action.payload;
      state.colorInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getColorById.fulfilled, (state, action) => {
      state.colorInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteColorById.fulfilled, (state, action) => {
      toastsuccess("Color Deleted Successfully");
      state.colorInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateColorStatus.fulfilled, (state, action) => {
      toastsuccess("Color Status Changed Successfully");
      state.colorInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllColor.pending,
        getActiveColor.pending,
        getColorById.pending,
        createColor.pending,
        updateColorById.pending,
        deleteColorById.pending,
        updateColorStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllColor.rejected,
        getActiveColor.rejected,
        getColorById.rejected,
        createColor.rejected,
        updateColorById.rejected,
        deleteColorById.rejected,
        updateColorStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllColor.fulfilled, getActiveColor.fulfilled, createColor.fulfilled, updateColorById.fulfilled),
      (state) => {
        state.colorInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//Shape
export const shapeReducerInitialState = {
  shapeList: [],
  activeShapeList: [],
  shapeInfo: null,
  isError: null,
  isLoading: false,
};

export const shapeReducer = createSlice({
  name: "shapeReducer",
  initialState: shapeReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllShape.fulfilled, (state, action) => {
      state.shapeList = action.payload;
      state.shapeInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getActiveShape.fulfilled, (state, action) => {
      state.activeShapeList = action.payload;
      state.shapeInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getShapeById.fulfilled, (state, action) => {
      state.shapeInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteShapeById.fulfilled, (state, action) => {
      toastsuccess("Shape Deleted Successfully");
      state.shapeInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateShapeStatus.fulfilled, (state, action) => {
      toastsuccess("Shape Status Changed Successfully");
      state.shapeInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllShape.pending,
        getActiveShape.pending,
        getShapeById.pending,
        createShape.pending,
        updateShapeById.pending,
        deleteShapeById.pending,
        updateShapeStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllShape.rejected,
        getActiveShape.rejected,
        getShapeById.rejected,
        createShape.rejected,
        updateShapeById.rejected,
        deleteShapeById.rejected,
        updateShapeStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllShape.fulfilled, getActiveShape.fulfilled, createShape.fulfilled, updateShapeById.fulfilled),
      (state) => {
        state.shapeInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//Clarity
export const clarityReducerInitialState = {
  clarityList: [],
  activeClarityList: [],
  clarityInfo: null,
  isError: null,
  isLoading: false,
};

export const clarityReducer = createSlice({
  name: "clarityReducer",
  initialState: clarityReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllClarity.fulfilled, (state, action) => {
      state.clarityList = action.payload;
      state.clarityInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getActiveClarity.fulfilled, (state, action) => {
      state.activeClarityList = action.payload;
      state.clarityInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getClarityById.fulfilled, (state, action) => {
      state.clarityInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteClarityById.fulfilled, (state, action) => {
      toastsuccess("Clarity Deleted Successfully");
      state.clarityInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateClarityStatus.fulfilled, (state, action) => {
      toastsuccess("clarity Status Changed Successfully");
      state.clarityInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllClarity.pending,
        getActiveClarity.pending,
        getClarityById.pending,
        createClarity.pending,
        updateClarityById.pending,
        deleteClarityById.pending,
        updateClarityStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllClarity.rejected,
        getActiveClarity.rejected,
        getClarityById.rejected,
        createClarity.rejected,
        updateClarityById.rejected,
        deleteClarityById.rejected,
        updateClarityStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllClarity.fulfilled,
        getActiveClarity.fulfilled,
        createClarity.fulfilled,
        updateClarityById.fulfilled
      ),
      (state) => {
        state.clarityInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//Quality
export const qualityReducerInitialState = {
  qualityList: [],
  activeQualityList: [],
  qualityInfo: null,
  isError: null,
  isLoading: false,
};

export const qualityReducer = createSlice({
  name: "qualityReducer",
  initialState: qualityReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllQuality.fulfilled, (state, action) => {
      state.qualityList = action.payload;
      state.qualityInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getActiveQuality.fulfilled, (state, action) => {
      state.activeQualityList = action.payload;
      state.qualityInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getQualityById.fulfilled, (state, action) => {
      state.qualityInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteQualityById.fulfilled, (state, action) => {
      toastsuccess("Quality Deleted Successfully");
      state.qualityInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateQualityStatus.fulfilled, (state, action) => {
      toastsuccess("Quality Status Changed Successfully");
      state.qualityInfo = null;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getAllQuality.pending,
        getActiveQuality.pending,
        getQualityById.pending,
        createQuality.pending,
        updateQualityById.pending,
        deleteQualityById.pending,
        updateQualityStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllQuality.rejected,
        getActiveQuality.rejected,
        getQualityById.rejected,
        createQuality.rejected,
        updateQualityById.rejected,
        deleteQualityById.rejected,
        updateQualityStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllQuality.fulfilled,
        getActiveQuality.fulfilled,
        createQuality.fulfilled,
        updateQualityById.fulfilled
      ),
      (state) => {
        state.qualityInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//Category
const categoryReducerInitialState = {
  categoryList: [],
  categoryInfo: null,
  isError: null,
  isLoading: false,
};

export const categoryReducer = createSlice({
  name: "categoryReducer",
  initialState: categoryReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getActiveCategory.fulfilled, (state, action) => {
      state.categoryList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getAllCategory.fulfilled, (state, action) => {
      state.categoryList = action.payload;
      state.categoryInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getCategoryById.fulfilled, (state, action) => {
      state.categoryInfo = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteCategoryById.fulfilled, (state, action) => {
      toastsuccess("Category Deleted Successfully");
      state.categoryInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateCategoryStatus.fulfilled, (state, action) => {
      toastsuccess("Category Status changed Successfully");
      state.categoryInfo = null;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getActiveCategory.pending,
        getAllCategory.pending,
        getCategoryById.pending,
        createCategory.pending,
        updateCategoryById.pending,
        updateCategoryStatus.pending,
        deleteCategoryById.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getActiveCategory.rejected,
        getAllCategory.rejected,
        getCategoryById.rejected,
        createCategory.rejected,
        updateCategoryById.rejected,
        updateCategoryStatus.rejected,
        deleteCategoryById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getActiveCategory.fulfilled,
        getAllCategory.fulfilled,
        createCategory.fulfilled,
        updateCategoryById.fulfilled,
        updateCategoryStatus.fulfilled,
        deleteCategoryById.fulfilled
      ),
      (state) => {
        state.categoryInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

const categoryPurityRateInitialState = {
  categoryPurityRateList: [],
  allCategoryPurityRateList: [],
  isError: null,
  isLoading: false,
};

export const categoryPurityRateReducer = createSlice({
  name: "categoryPurityRateReducer",
  initialState: categoryPurityRateInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCategoryPurityRate.fulfilled, (state, action) => {
      state.categoryPurityRateList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getAllCategoryPurityRate.fulfilled, (state, action) => {
      state.allCategoryPurityRateList = action.payload;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getCategoryPurityRate.pending,
        createCategoryPurityRate.pending,
        getAllCategoryPurityRate.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getCategoryPurityRate.rejected,
        createCategoryPurityRate.rejected,
        getAllCategoryPurityRate.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(isAnyOf(createCategoryPurityRate.fulfilled), (state) => {
      state.isLoading = false;
      state.isError = false;
    });
  },
});

//Product
export const productReducerInitialState = {
  activeProductList: [],
  productList: [],
  productInfo: null,
  isError: null,
  isLoading: false,
};

export const productReducer = createSlice({
  name: "productReducer",
  initialState: productReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getActiveProduct.fulfilled, (state, action) => {
      state.activeProductList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getAllProduct.fulfilled, (state, action) => {
      state.productList = action.payload;
      state.productInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getProductById.fulfilled, (state, action) => {
      state.productInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(deleteProductById.fulfilled, (state, action) => {
      toastsuccess("Product Deleted Successfully");
      state.productInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateProductStatus.fulfilled, (state, action) => {
      toastsuccess("Product Status changed Successfully");
      state.productInfo = null;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getAllProduct.pending,
        getActiveProduct.pending,
        updateProductById.pending,
        getProductById.pending,
        createProduct.pending,
        updateProductStatus.pending,
        deleteProductById.pending
      ),
      (state) => {
        state.isLoading = true;
        console.log(state);
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllProduct.rejected,
        getActiveProduct.rejected,
        updateProductById.rejected,
        getProductById.rejected,
        createProduct.rejected,
        updateProductStatus.rejected,
        deleteProductById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(isAnyOf(updateProductById.fulfilled, createProduct.fulfilled), (state) => {
      state.isLoading = false;
      state.isError = false;
    });
  },
});

//Design
export const designReducerInitialState = {
  activeDesignMappingList: [],
  designMappingList: [],
  activeDesignList: [],
  designList: [],
  designInfo: null,
  isError: null,
  isLoading: false,
};

export const designReducer = createSlice({
  name: "designReducer",
  initialState: designReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDesignMappingDetails.fulfilled, (state, action) => {
      state.activeDesignMappingList = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(getActiveDesign.fulfilled, (state, action) => {
      state.designList = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getAllDesignMapping.fulfilled, (state, action) => {
      state.designMappingList = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(getDesignById.fulfilled, (state, action) => {
      state.designInfo = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(getAllDesign.fulfilled, (state, action) => {
      state.activeDesignList = action.payload;
      state.designInfo = null;
      state.isLoading = false;
    });
    builder.addCase(deleteDesignById.fulfilled, (state, action) => {
      toastsuccess("Design Deleted Successfully");
      state.designInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateDesignStatus.fulfilled, (state, action) => {
      toastsuccess("Design Status changed Successfully");
      state.designInfo = null;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        createDesignMapping.pending,
        deleteDesignMappingById.pending,
        getDesignMappingDetails.pending,
        createDesign.pending,
        getDesignById.pending,
        updateDesignById.pending,
        getAllDesign.pending,
        deleteDesignById.pending,
        updateDesignStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createDesignMapping.rejected,
        deleteDesignMappingById.rejected,
        getDesignMappingDetails.rejected,
        createDesign.rejected,
        getDesignById.rejected,
        updateDesignById.rejected,
        getAllDesign.rejected,
        deleteDesignById.rejected,
        updateDesignStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createDesignMapping.fulfilled,
        deleteDesignMappingById.fulfilled,
        getDesignMappingDetails.fulfilled,
        createDesign.fulfilled,
        getDesignById.fulfilled,
        updateDesignById.fulfilled,
        getAllDesign.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//Sub Design
export const subDesignReducerInitialState = {
  subDesignMappingList: [],
  activeSubDesignList: [],
  subDesignInfo: null,
  isError: null,
  isLoading: false,
};

export const subDesignReducer = createSlice({
  name: "subDesignReducer",
  initialState: subDesignReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSubDesignMappingDetails.fulfilled, (state, action) => {
      state.subDesignMappingList = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(getSubDesignById.fulfilled, (state, action) => {
      state.subDesignInfo = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(getAllSubDesign.fulfilled, (state, action) => {
      state.activeSubDesignList = action.payload;
      state.subDesignInfo = null;
      state.isLoading = false;
    });

    builder.addCase(getActiveSubDesign.fulfilled, (state, action) => {
      state.activeSubDesignList = action.payload;
      state.isLoading = false;
    });

    builder.addCase(deleteSubDesignById.fulfilled, (state, action) => {
      toastsuccess("Sub Design Deleted Successfully");
      state.subDesignInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateSubDesignStatus.fulfilled, (state, action) => {
      toastsuccess("Sub Design Status changed Successfully");
      state.subDesignInfo = null;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getSubDesignMappingDetails.pending,
        createSubDesign.pending,
        getSubDesignById.pending,
        updateSubDesignById.pending,
        getAllSubDesign.pending,
        deleteSubDesignById.pending,
        updateSubDesignStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getSubDesignMappingDetails.rejected,
        createSubDesign.rejected,
        getSubDesignById.rejected,
        updateSubDesignById.rejected,
        getAllSubDesign.rejected,
        deleteSubDesignById.rejected,
        updateSubDesignStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getSubDesignMappingDetails.fulfilled,
        createSubDesign.fulfilled,
        getSubDesignById.fulfilled,
        updateSubDesignById.fulfilled,
        getAllSubDesign.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//Sub Design Mapping
export const subDesignMappingReducerInitialState = {
  activeDesignMappingList: [],
  subDesignMappingList: [],
  isError: null,
  isLoading: false,
};

export const subDesignMappingReducer = createSlice({
  name: "subDesignMappingReducer",
  initialState: subDesignMappingReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSubDesignMappingDetails.fulfilled, (state, action) => {
      state.activeDesignMappingList = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(getAllSubDesignMapping.fulfilled, (state, action) => {
      state.subDesignMappingList = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(deleteSubDesignMappingById.fulfilled, (state, action) => {
      toastsuccess("Sub Design Mapping Deleted Successfully");
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getSubDesignMappingDetails.pending,
        getAllSubDesignMapping.pending,
        createSubDesignMapping.pending,
        deleteSubDesignMappingById.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getSubDesignMappingDetails.rejected,
        getAllSubDesignMapping.rejected,
        createSubDesignMapping.rejected,
        deleteSubDesignMappingById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getSubDesignMappingDetails.fulfilled,
        getAllSubDesignMapping.fulfilled,
        createSubDesignMapping.fulfilled,
        deleteSubDesignMappingById.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//Section
export const sectionReducerInitialState = {
  sectionList: [],
  activeSectionList: [],
  sectionInfo: null,
  isError: null,
  isLoading: false,
};

export const sectionReducer = createSlice({
  name: "sectionReducer",
  initialState: sectionReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getActiveSection.fulfilled, (state, action) => {
      state.activeSectionList = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getProductSection.fulfilled, (state, action) => {
      state.activeSectionList = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getSectionById.fulfilled, (state, action) => {
      state.sectionInfo = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(getAllSection.fulfilled, (state, action) => {
      state.sectionList = action.payload;
      state.sectionInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateSectionStatus.fulfilled, (state, action) => {
      toastsuccess("Section Status changed Successfully");
      state.sectionInfo = null;
      state.isLoading = false;
    });
    builder.addCase(deleteSectionByID.fulfilled, (state, action) => {
      toastsuccess("Section Deleted Successfully");
      state.sectionInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        deleteSectionByID.pending,
        getActiveSection.pending,
        getProductSection.pending,
        createSection.pending,
        getSectionById.pending,
        updateSectionById.pending,
        getAllSection.pending,
        updateSectionStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        deleteSectionByID.rejected,
        getActiveSection.rejected,
        getProductSection.rejected,
        createSection.rejected,
        getSectionById.rejected,
        updateSectionById.rejected,
        getAllSection.rejected,
        updateSectionStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        deleteSectionByID.fulfilled,
        getActiveSection.fulfilled,
        getProductSection.fulfilled,
        createSection.fulfilled,
        getSectionById.fulfilled,
        updateSectionById.fulfilled,
        getAllSection.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//Stone
export const stoneReducerInitialState = {
  activeStoneList: [],
  stoneList: [],
  stoneInfo: null,
  isError: null,
  isLoading: false,
};

export const stoneReducer = createSlice({
  name: "stoneReducer",
  initialState: stoneReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getActiveStoneList.fulfilled, (state, action) => {
      state.activeStoneList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getAllStone.fulfilled, (state, action) => {
      state.stoneList = action.payload.data;
      state.stoneInfo = null
      state.isLoading = false;
    });
    builder.addCase(getStoneById.fulfilled, (state, action) => {
      state.stoneInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(deleteStoneById.fulfilled, (state, action) => {
      toastsuccess("Stone Deleted Successfully");
      state.stoneInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateStoneStatus.fulfilled, (state, action) => {
      toastsuccess("Stone Status changed Successfully");
      state.stoneInfo = null;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getActiveStoneList.pending,
        getAllStone.pending,
        getStoneById.pending,
        deleteStoneById.pending,
        updateStoneStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getActiveStoneList.rejected,
        getAllStone.rejected,
        getStoneById.rejected,
        deleteStoneById.rejected,
        updateStoneStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(isAnyOf(getActiveStoneList.fulfilled), (state) => {
      state.isLoading = false;
      state.isError = false;
    });
  },
});

//Quality code
export const qualityCodeReducerInitialState = {
  activeQualityCodeList: [],
  isError: null,
  isLoading: false,
};

export const qualityCodeReducer = createSlice({
  name: "qualityCodeReducer",
  initialState: qualityCodeReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getActiveQualityCode.fulfilled, (state, action) => {
      state.activeQualityCodeList = action.payload;
      state.isLoading = false;
    });

    builder.addMatcher(isAnyOf(getActiveQualityCode.pending), (state) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getActiveQualityCode.rejected), (state, action) => {
      state.isLoading = false;
      state.isError = true;
    });
    builder.addMatcher(isAnyOf(getActiveQualityCode.fulfilled), (state) => {
      state.isLoading = false;
      state.isError = false;
    });
  },
});

//Calculation Based On
export const calTypeReducerInitialState = {
  calTypeList: [],
  isError: null,
  isLoading: false,
};

export const calTypeReducer = createSlice({
  name: "calTypeReducer",
  initialState: calTypeReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCalType.fulfilled, (state, action) => {
      state.calTypeList = action.payload;
      state.isLoading = false;
    });

    builder.addMatcher(isAnyOf(getCalType.pending), (state) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getCalType.rejected), (state, action) => {
      state.isLoading = false;
      state.isError = true;
    });
    builder.addMatcher(isAnyOf(getCalType.fulfilled), (state) => {
      state.isLoading = false;
      state.isError = false;
    });
  },
});

//Quality code
export const taxGroupInitialState = {
  taxGroupList: [],
  isError: null,
  isLoading: false,
};

export const taxGroupReducer = createSlice({
  name: "taxGroupReducer",
  initialState: taxGroupInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getActiveTaxGroup.fulfilled, (state, action) => {
      // console.log(action.payload.data);
      state.taxGroupList = action.payload.data;
      state.isLoading = false;
    });

    builder.addMatcher(isAnyOf(getActiveTaxGroup.pending), (state) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getActiveTaxGroup.rejected), (state, action) => {
      state.isLoading = false;
      state.isError = true;
    });
    builder.addMatcher(isAnyOf(getActiveTaxGroup.fulfilled), (state) => {
      state.isLoading = false;
      state.isError = false;
    });
  },
});

//Size
export const sizeReducerInitialState = {
  sizeList: [],
  activeSizeList: [],
  sizeInfo: null,
  isError: null,
  isLoading: false,
};

export const sizeReducer = createSlice({
  name: "sizeReducer",
  initialState: sizeReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getActiveSize.fulfilled, (state, action) => {
      state.activeSizeList = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getSizeById.fulfilled, (state, action) => {
      state.sizeInfo = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(getAllSize.fulfilled, (state, action) => {
      state.sizeList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteSizeById.fulfilled, (state, action) => {
      toastsuccess("Size Deleted Successfully");
      state.sizeInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateSizeStatus.fulfilled, (state, action) => {
      toastsuccess("Size Status changed Successfully");
      state.designationInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        deleteSizeById.pending,
        getActiveSize.pending,
        createSize.pending,
        getSizeById.pending,
        updateSizeById.pending,
        getAllSize.pending,
        updateSizeStatus.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        deleteSizeById.rejected,
        getActiveSize.rejected,
        createSize.rejected,
        getSizeById.rejected,
        updateSizeById.rejected,
        getAllSize.rejected,
        updateSizeStatus.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        deleteSizeById.fulfilled,
        getActiveSize.fulfilled,
        createSize.fulfilled,
        updateSizeById.fulfilled,
        getAllSize.fulfilled,
        updateSizeStatus.fulfilled
      ),
      (state) => {
        state.sizeInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//diamond rate master

export const diamondRateMasterReducerInitialState = {
  diamondRateMasterList: [],
  filteredDiamondCentsList: [],
  filteredPurchaseDiamondCentsList: [],
  activeDiamondRateList: [],
  diamondRateMasterInfo: null,
  isError: null,
  isLoading: false,
};

export const diamondRateMasterReducer = createSlice({
  name: "diamondRateMasterReducer",
  initialState: diamondRateMasterReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllDiamondRateMaster.fulfilled, (state, action) => {
      state.diamondRateMasterList = action.payload;
      state.diamondRateMasterInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getDiamondRateMasterById.fulfilled, (state, action) => {
      state.diamondRateMasterInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(filterDiamondRateMaster.fulfilled, (state, action) => {
      state.filteredDiamondCentsList = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getActiveDiamondRateMaster.fulfilled, (state, action) => {
      state.activeDiamondRateList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(filterPurchaseDiamondRateMaster.fulfilled, (state, action) => {
      state.filteredPurchaseDiamondCentsList = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(deleteDiamondRateMasterById.fulfilled, (state, action) => {
      toastsuccess("Diamond Rate Master Deleted Successfully");
      state.diamondRateMasterInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateDiamondRateMasterStatus.fulfilled, (state, action) => {
      toastsuccess("Diamond Rate Master Status changed Successfully");
      state.diamondRateMasterInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllDiamondRateMaster.pending,
        getDiamondRateMasterById.pending,
        createDiamondRateMaster.pending,
        updateDiamondRateMasterById.pending,
        deleteDiamondRateMasterById.pending,
        updateDiamondRateMasterStatus.pending,
        filterPurchaseDiamondRateMaster.pending,
        filterDiamondRateMaster.pending,
        createPurchaseDiamondRateMaster.pending,
        getActiveDiamondRateMaster.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllDiamondRateMaster.rejected,
        getDiamondRateMasterById.rejected,
        createDiamondRateMaster.rejected,
        updateDiamondRateMasterById.rejected,
        deleteDiamondRateMasterById.rejected,
        updateDiamondRateMasterStatus.rejected,
        filterPurchaseDiamondRateMaster.rejected,
        filterDiamondRateMaster.rejected,
        createPurchaseDiamondRateMaster.rejected,
        getActiveDiamondRateMaster.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllDiamondRateMaster.fulfilled,
        createDiamondRateMaster.fulfilled,
        updateDiamondRateMasterById.fulfilled,
        createPurchaseDiamondRateMaster.fulfilled,
        getActiveDiamondRateMaster.fulfilled
      ),
      (state) => {
        state.diamondRateMasterInfo = null;
        state.filteredPurchaseDiamondCentsList = [];
        state.filteredDiamondCentsList = [];
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//re order settings

export const reOrderSettingsReducerInitialState = {
  reOrderSettingsList: [],
  reOrderSettingsInfo: null,
  isError: null,
  isLoading: false,
};

export const reOrderSettingsReducer = createSlice({
  name: "reOrderSettingsReducer",
  initialState: reOrderSettingsReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllReOrderSettings.fulfilled, (state, action) => {
      state.reOrderSettingsList = action.payload;
      state.reOrderSettingsInfo = null;
      state.isLoading = false;
    });
    builder.addCase(getReOrderSettingsById.fulfilled, (state, action) => {
      state.reOrderSettingsInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getReOrderSettings.fulfilled, (state, action) => {
      state.reOrderSettingsList = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(deleteReOrderSettingsById.fulfilled, (state, action) => {
      toastsuccess("Re order Settings Deleted Successfully");
      state.reOrderSettingsInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateReOrderSettingsStatus.fulfilled, (state, action) => {
      toastsuccess("Re order Settings Status changed Successfully");
      state.reOrderSettingsInfo = null;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getAllReOrderSettings.pending,
        getReOrderSettingsById.pending,
        createReOrderSettings.pending,
        updateReOrderSettingsById.pending,
        deleteReOrderSettingsById.pending,
        updateReOrderSettingsStatus.pending,
        getReOrderSettings.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllReOrderSettings.rejected,
        getReOrderSettingsById.rejected,
        createReOrderSettings.rejected,
        updateReOrderSettingsById.rejected,
        deleteReOrderSettingsById.rejected,
        updateReOrderSettingsStatus.rejected,
        getReOrderSettings.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getAllReOrderSettings.fulfilled, createReOrderSettings.fulfilled, updateReOrderSettingsById.fulfilled),
      (state) => {
        state.reOrderSettingsInfo = null;
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

//mc va settings
export const mcVaSettingsInitialState = {
  mcVaSettingsList: [],
  customerMcVaSettingsList: [],
  mcVaList: [],
  isError: null,
  isLoading: false,
};

export const mcVaSettingsReducer = createSlice({
  name: "mcVaSettingsReducer",
  initialState: mcVaSettingsInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMcVaSettings.fulfilled, (state, action) => {
      state.mcVaSettingsList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getMcVa.fulfilled, (state, action) => {
      state.mcVaList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getCustomerMcVa.fulfilled, (state, action) => {
      state.customerMcVaSettingsList = action.payload;
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(
        getMcVaSettings.pending,
        getMcVa.pending,
        createMcVaSettings.pending,
        getCustomerMcVa.pending,
        createCustomerMcVaSettings.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getMcVaSettings.rejected,
        getMcVa.rejected,
        createMcVaSettings.rejected,
        getCustomerMcVa.rejected,
        createCustomerMcVaSettings.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getMcVaSettings.fulfilled, createMcVaSettings.fulfilled, createCustomerMcVaSettings.fulfilled),
      (state) => {
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});

export const repairDamageMasterReducerInitialState = {
  repairDamageMasterList: [],
  activeRepairDamageMasterList: [],
  repairDamageMasterInfo: null,
  isError: null,
  isLoading: false,
};

export const repairDamageMasterReducer = createSlice({
  name: "repairDamageMasterReducer",
  initialState: repairDamageMasterReducerInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRepairDamageMasterById.fulfilled, (state, action) => {
      state.repairDamageMasterInfo = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getActiveRepairDamageMaster.fulfilled, (state, action) => {
      state.activeRepairDamageMasterList = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getAllRepairDamageMaster.fulfilled, (state, action) => {
      state.repairDamageMasterList = action.payload;
      state.repairDamageMasterInfo = null;
      state.isLoading = false;
    });

    builder.addCase(deleteRepairDamageMasterById.fulfilled, (state, action) => {
      toastsuccess("Repair Damage Master Deleted Successfully");
      state.repairDamageMasterInfo = null;
      state.isLoading = false;
    });
    builder.addCase(updateRepairDamageMasterStatus.fulfilled, (state, action) => {
      toastsuccess("Repair Damage Master changed Successfully");
      state.repairDamageMasterInfo = null;
      state.isLoading = false;
    });

    builder.addMatcher(
      isAnyOf(
        getAllRepairDamageMaster.pending,
        createRepairDamageMaster.pending,
        getRepairDamageMasterById.pending,
        updateRepairDamageMasterStatus.pending,
        updateRepairDamageMasterById.pending,
        deleteRepairDamageMasterById.pending
      ),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        getAllRepairDamageMaster.rejected,
        createRepairDamageMaster.rejected,
        getRepairDamageMasterById.rejected,
        updateRepairDamageMasterStatus.rejected,
        deleteRepairDamageMasterById.rejected,
        updateRepairDamageMasterById.rejected
      ),
      (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        updateRepairDamageMasterById.fulfilled,
        getAllRepairDamageMaster.fulfilled,
        createRepairDamageMaster.fulfilled,
        getRepairDamageMasterById.fulfilled,
        updateRepairDamageMasterStatus.fulfilled,
        deleteRepairDamageMasterById.fulfilled
      ),
      (state) => {
        state.isLoading = false;
        state.isError = false;
      }
    );
  },
});
