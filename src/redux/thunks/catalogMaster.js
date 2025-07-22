import { createAsyncThunk } from "@reduxjs/toolkit";
import { DispatchErrorHandler } from "../configs";
import catalogMasterAPI from "../api/catalogMasterAPI";

//Metal
export const createMetal = createAsyncThunk("metalReducer/createMetal", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.metal.createMetal(payload);
    return response || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getAllMetal = createAsyncThunk("metalReducer/getAllMetal", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.metal.getAllMetal(payload?.page, payload?.records,payload?.search,payload?.path_name);
    return response?.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getMetalById = createAsyncThunk("metalReducer/getMetalById", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.metal.getMetalByID(payload);
    return response || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const updateMetalById = createAsyncThunk(
  "metalReducer/updateMetalById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.metal.updateMetalByID(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveMetal = createAsyncThunk(
  "metalReducer/getActiveMetal",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.metal.getActiveMetal();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateMetalStatus = createAsyncThunk(
  "metalReducer/updateMetalStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.metal.changeStatusMetal(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteMetalById = createAsyncThunk(
  "metalReducer/deleteMetalById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.metal.deleteMetalByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Purity
export const createPurity = createAsyncThunk(
  "purityReducer/createPurity",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.purity.createPurity(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllPurity = createAsyncThunk(
  "purityReducer/getAllPurity",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.purity.getAllPurity(payload?.page, payload?.records,payload?.search,payload?.path_name);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getPurityById = createAsyncThunk(
  "purityReducer/getPurityById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.purity.getPurityByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updatePurityById = createAsyncThunk(
  "purityReducer/updatePurityById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.purity.updatePurityByID(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActivePurity = createAsyncThunk(
  "purityReducer/getActivePurity",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.purity.getActivePurity(payload?.status);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updatePurityStatus = createAsyncThunk(
  "purityReducer/updatePurityStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.purity.changeStatusPurity(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deletePurityById = createAsyncThunk(
  "purityReducer/deletePurityById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.purity.deletePurityByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Cut
export const createCut = createAsyncThunk("cutReducer/createCut", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.cut.createCut(payload);
    return response || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getAllCut = createAsyncThunk("cutReducer/getAllCut", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.cut.getAllCut(payload?.page, payload?.records,payload?.search,payload?.path_name);
    console.log(response);
    return response?.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getCutById = createAsyncThunk("cutReducer/getCutById", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.cut.getCutByID(payload);
    return response?.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const updateCutById = createAsyncThunk("cutReducer/updateCutById", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.cut.updateCutByID(payload?.id, payload?.putData);
    return response || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getActiveCut = createAsyncThunk("cutReducer/getActiveCut", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.cut.getActiveCut(payload?.status);
    return response.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const updateCutStatus = createAsyncThunk(
  "cutReducer/updateCutStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.cut.changeStatusCut(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteCutById = createAsyncThunk("cutReducer/deleteCutById", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.cut.deleteCutByID(payload);
    return response?.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

//Color
export const createColor = createAsyncThunk("colorReducer/createColor", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.color.createColor(payload);
    return response || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getAllColor = createAsyncThunk("colorReducer/getAllColor", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.color.getAllColor(payload?.page, payload?.records,payload?.search,payload?.path_name);
    console.log(response);
    return response?.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getColorById = createAsyncThunk("colorReducer/getColorById", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.color.getColorByID(payload);
    return response?.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const updateColorById = createAsyncThunk(
  "colorReducer/updateColorById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.color.updateColorByID(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveColor = createAsyncThunk(
  "colorReducer/getActiveColor",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.color.getActiveColor(payload?.status);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateColorStatus = createAsyncThunk(
  "colorReducer/updateColorStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.color.changeStatusColor(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteColorById = createAsyncThunk(
  "colorReducer/deleteColorById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.color.deleteColorByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Shape
export const createShape = createAsyncThunk("shapeReducer/createShape", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.shape.createShape(payload);
    return response || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getAllShape = createAsyncThunk("shapeReducer/getAllShape", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.shape.getAllShape(payload?.page, payload?.records,payload?.search,payload?.path_name);
    console.log(response);
    return response?.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getShapeById = createAsyncThunk("shapeReducer/getShapeById", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.shape.getShapeByID(payload);
    return response?.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const updateShapeById = createAsyncThunk(
  "shapeReducer/updateShapeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.shape.updateShapeByID(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveShape = createAsyncThunk(
  "shapeReducer/getActiveShape",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.shape.getActiveShape(payload?.status);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateShapeStatus = createAsyncThunk(
  "shapeReducer/updateShapeStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.shape.changeStatusShape(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteShapeById = createAsyncThunk(
  "shapeReducer/deleteShapeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.shape.deleteShapeByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Clarity
export const createClarity = createAsyncThunk(
  "clarityReducer/createClarity",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.clarity.createClarity(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllClarity = createAsyncThunk(
  "clarityReducer/getAllClarity",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.clarity.getAllClarity(payload?.page, payload?.records,payload?.search,payload?.path_name);
      console.log(response);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getClarityById = createAsyncThunk(
  "clarityReducer/getClarityById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.clarity.getClarityByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateClarityById = createAsyncThunk(
  "clarityReducer/updateClarityById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.clarity.updateClarityByID(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveClarity = createAsyncThunk(
  "clarityReducer/getActiveClarity",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.clarity.getActiveClarity(payload?.status);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateClarityStatus = createAsyncThunk(
  "clarityReducer/updateClarityStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.clarity.changeStatusClarity(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteClarityById = createAsyncThunk(
  "clarityReducer/deleteClarityById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.clarity.deleteClarityByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Quality
export const createQuality = createAsyncThunk(
  "qualityReducer/createQuality",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.quality.createQuality(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllQuality = createAsyncThunk(
  "qualityReducer/getAllQuality",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.quality.getAllQuality(payload?.page, payload?.records,payload?.search,payload?.path_name);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getQualityById = createAsyncThunk(
  "qualityReducer/getQualityById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.quality.getQualityByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateQualityById = createAsyncThunk(
  "qualityReducer/updateQualityById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.quality.updateQualityByID(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveQuality = createAsyncThunk(
  "qualityReducer/getActiveQuality",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.quality.getActiveQuality(payload?.status);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateQualityStatus = createAsyncThunk(
  "qualityReducer/updateQualityStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.quality.changeStatusQuality(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteQualityById = createAsyncThunk(
  "qualityReducer/deleteQualityById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.quality.deleteQualityByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Category
export const getActiveCategory = createAsyncThunk(
  "categoryReducer/getActiveCategory",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.category.getActiveCategory(payload?.status);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createCategory = createAsyncThunk(
  "categoryReducer/createCategory",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.category.createCategory(payload);
      return response || null;
    } catch (error) {
      console.log(error);
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllCategory = createAsyncThunk(
  "categoryReducer/getAllCategory",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.category.getAllCategory(payload?.page, payload?.records,payload?.search,payload?.path_name);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCategoryById = createAsyncThunk(
  "categoryReducer/getCategoryById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.category.getCategoryByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateCategoryStatus = createAsyncThunk(
  "categoryReducer/updateCategoryStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.category.changeStatusCategory(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteCategoryById = createAsyncThunk(
  "categoryReducer/deleteCategoryById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.category.deleteCategoryByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateCategoryById = createAsyncThunk(
  "categoryReducer/updateCategoryById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.category.updateCategoryByID(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Category Purity Rate
export const getAllCategoryPurityRate = createAsyncThunk(
  "categoryReducer/getAllCategoryPurityRate",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.categoryPurityRate.getAllCategoryPurityRate(payload?.page, payload?.records,payload?.search,payload?.path_name);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);


export const getCategoryPurityRate = createAsyncThunk(
  "categoryPurityRateReducer/getCategoryPurityRate",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.categoryPurityRate.getCategoryPurityRate();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createCategoryPurityRate = createAsyncThunk(
  "categoryPurityRateReducer/createCategoryPurityRate",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.categoryPurityRate.createCategoryPurityRate(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Product
export const getActiveProduct = createAsyncThunk(
  "productReducer/getActiveProduct",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.product.getActiveProduct(payload?.status);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Design
export const getDesignMappingDetails = createAsyncThunk(
  "designReducer/getDesignMappingDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.design.getDesignMappingDetails(payload?.status);
      //console.log('response',response.data);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteDesignMappingById = createAsyncThunk(
  "designReducer/deleteDesignMappingById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.design.deleteDesignMappingById(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createDesignMapping = createAsyncThunk(
  "designReducer/createDesignMapping",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.design.createDesignMapping(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllDesignMapping = createAsyncThunk(
  "designReducer/getAllDesignMapping",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.design.getAllDesignMapping(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Sub Design
export const getSubDesignMappingDetails = createAsyncThunk(
  "subDesignReducer/getSubDesignMappingDetails",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.subDesign.getSubDesignMappingDetails();
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveSubDesign = createAsyncThunk(
  "subDesignReducer/getActiveSubDesign",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.subDesign.getActiveSubDesign(payload?.status);
      //console.log('response',response.data);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteSubDesignMappingById = createAsyncThunk(
  "subDesignMappingReducer/deleteSubDesignMappingById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.subDesignMapping.deleteSubDesignMappingById(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createSubDesignMapping = createAsyncThunk(
  "subDesignMappingReducer/createSubDesignMapping",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.subDesignMapping.createSubDesignMapping(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllSubDesignMapping = createAsyncThunk(
  "designReducer/getAllSubDesignMapping",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.subDesignMapping.getAllSubDesignMapping(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//UOM
export const getUomList = createAsyncThunk("uomReducer/getUomList", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.uom.getUomList();
    return response || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

//Stone
//Stone
export const createStone = createAsyncThunk("stoneReducer/createStone", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.stone.createStone(payload);
    return response || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getAllStone = createAsyncThunk("stoneReducer/getAllStone", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.stone.getAllStone(payload?.page, payload?.records,payload?.search,payload?.path_name);
    return response || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getStoneById = createAsyncThunk("stoneReducer/getStoneById", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.stone.getStoneByID(payload);
    return response || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const updateStoneById = createAsyncThunk(
  "stoneReducer/updateStoneById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.stone.updateStoneByID(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveStone = createAsyncThunk(
  "stoneReducer/getActiveStone",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.stone.getActiveStone(payload?.status);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
export const updateStoneStatus = createAsyncThunk(
  "stoneReducer/updateStoneStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.stone.changeStatusStone(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteStoneById = createAsyncThunk(
  "stoneReducer/deleteStoneById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.stone.deleteStoneByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveStoneList = createAsyncThunk(
  "stoneReducer/getActiveStoneList",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.stone.getActiveStoneList();
      return response?.data?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Quality code
export const getActiveQualityCode = createAsyncThunk(
  "qualityCodeReducer/getActiveQualityCode",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.quality_code.getActiveQualityCode();
      return response?.data?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createProduct = createAsyncThunk(
  "productReducer/createProduct",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.product.createProduct(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteProductById = createAsyncThunk(
  "productReducer/deleteProductById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.product.deleteProductById(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateProductStatus = createAsyncThunk(
  "productReducer/updateProductStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.product.updateProductStatus(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getProductById = createAsyncThunk(
  "metalReducer/getMetalById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.product.getProductByID(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateProductById = createAsyncThunk(
  "metalReducer/updateMetalById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.product.updateProductByID(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllProduct = createAsyncThunk(
  "productReducer/getAllProduct",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.product.getAllProduct(payload?.page,payload?.records,payload?.search,payload?.path_name);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCalType = createAsyncThunk("calTypeReducer/getCalType", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.cal_type.getActiveCalType();
    return response.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getActiveTaxGroup = createAsyncThunk(
  "taxGroupReducer/getActiveTaxGroup",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.taxgroup.getActiveTaxGroup(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Design
export const createDesign = createAsyncThunk(
  "designReducer/createDesign",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.design.createDesign(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllDesign = createAsyncThunk(
  "designReducer/getAllDesign",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.design.getAllDesign(payload?.page,payload?.records,payload?.search,payload?.path_name);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getDesignById = createAsyncThunk(
  "designReducer/getDesignById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.design.getDesignById(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateDesignById = createAsyncThunk(
  "designReducer/updateDesignById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.design.updateDesignById(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveDesign = createAsyncThunk(
  "designReducer/getActiveDesign",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.design.getActiveDesign(payload?.page);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteDesignById = createAsyncThunk(
  "designReducer/deleteDesignById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.design.deleteDesignById(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateDesignStatus = createAsyncThunk(
  "designReducer/updateDesignStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.design.changeStatusDesign(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Sub Design
export const createSubDesign = createAsyncThunk(
  "subDesignReducer/createSubDesign",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.subDesign.createSubDesign(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllSubDesign = createAsyncThunk(
  "subDesignReducer/getAllSubDesign",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.subDesign.getAllSubDesign(payload?.page, payload?.records,payload?.search,payload?.path_name);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSubDesignById = createAsyncThunk(
  "subDesignReducer/getSubDesignById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.subDesign.getSubDesignById(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateSubDesignById = createAsyncThunk(
  "subDesignReducer/updateSubDesignById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.subDesign.updateSubDesignById(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteSubDesignById = createAsyncThunk(
  "designReducer/deleteSubDesignById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.subDesign.deleteSubDesignById(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateSubDesignStatus = createAsyncThunk(
  "designReducer/updateSubDesignStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.subDesign.changeStatusSubDesign(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Section
export const createSection = createAsyncThunk(
  "sectionReducer/createSection",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.section.createSection(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllSection = createAsyncThunk(
  "sectionReducer/getAllSection",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.section.getAllSection(payload?.page, payload?.records,payload?.search,payload?.path_name);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getSectionById = createAsyncThunk(
  "sectionReducer/getSectionById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.section.getSectionByID(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateSectionById = createAsyncThunk(
  "sectionReducer/updateSectionById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.section.updateSectionByID(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveSection = createAsyncThunk(
  "sectionReducer/getActiveSection",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.section.getActiveSection(payload?.page);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getProductSection = createAsyncThunk(
  "sectionReducer/getProductSection",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.section.getProductSection(payload?.page);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteSectionByID = createAsyncThunk(
  "sectionReducer/deleteSectionByID",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.section.deleteSectionByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateSectionStatus = createAsyncThunk(
  "sectionReducer/updateSectionStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.section.changeStatusSection(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Size
export const createSize = createAsyncThunk("sizeReducer/createSize", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.size.createSize(payload);
    return response || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getAllSize = createAsyncThunk("sizeReducer/getAllSize", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.size.getAllSize(payload?.page, payload?.records,payload?.search,payload?.path_name);
    return response?.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const getSizeById = createAsyncThunk("sizeReducer/getSizeById", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.size.getSizeById(payload);
    return response || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const updateSizeById = createAsyncThunk(
  "sizeReducer/updateSizeById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.size.updateSizeById(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveSize = createAsyncThunk(
  "sizeReducer/getActiveSize",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.size.getActiveSize(payload?.page);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteSizeById = createAsyncThunk(
  "sizeReducer/deleteSizeByID",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.size.deleteSizeById(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateSizeStatus = createAsyncThunk(
  "sizeReducer/updateSizeStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.size.changeStatusSize(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//diamond rate master

export const createDiamondRateMaster = createAsyncThunk(
  "diamondRateMasterReducer/createDiamondRateMaster",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.diamondRateMaster.createDiamondRateMaster(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createPurchaseDiamondRateMaster = createAsyncThunk(
  "diamondRateMasterReducer/createPurchaseDiamondRateMaster",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.diamondRateMaster.createPurchaseDiamondRateMaster(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const filterDiamondRateMaster = createAsyncThunk(
  "diamondRateMasterReducer/filterDiamondRateMaster",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.diamondRateMaster.filterDiamondRateMaster(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const filterPurchaseDiamondRateMaster = createAsyncThunk(
  "diamondRateMasterReducer/filterPurchaseDiamondRateMaster",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.diamondRateMaster.filterPurchaseDiamondRateMaster(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllDiamondRateMaster = createAsyncThunk(
  "diamondRateMasterReducer/getAllDiamondRateMaster",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.diamondRateMaster.getAllDiamondRateMaster(
        payload?.page,
        payload?.records
        ,payload?.search
      );
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getDiamondRateMasterById = createAsyncThunk(
  "diamondRateMasterReducer/getDiamondRateMasterById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.diamondRateMaster.getDiamondRateMasterByID(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateDiamondRateMasterById = createAsyncThunk(
  "diamondRateMasterReducer/updateDiamondRateMasterById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.diamondRateMaster.updateDiamondRateMasterByID(
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

export const updateDiamondRateMasterStatus = createAsyncThunk(
  "diamondRateMasterReducer/updateDiamondRateMasterStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.diamondRateMaster.changeStatusDiamondRateMaster(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteDiamondRateMasterById = createAsyncThunk(
  "diamondRateMasterReducer/deleteDiamondRateMasterById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.diamondRateMaster.deleteDiamondRateMasterByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//re order settings

export const createReOrderSettings = createAsyncThunk(
  "reOrderSettingsReducer/createReOrderSettings",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.reOrderSettings.createReOrderSettings(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllReOrderSettings = createAsyncThunk(
  "reOrderSettingsReducer/getAllReOrderSettings",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.reOrderSettings.getAllReOrderSettings(payload?.page, payload?.records,payload?.search);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getReOrderSettingsById = createAsyncThunk(
  "reOrderSettingsReducer/getReOrderSettingsById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.reOrderSettings.getReOrderSettingsByID(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateReOrderSettingsById = createAsyncThunk(
  "reOrderSettingsReducer/updateReOrderSettingsById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.reOrderSettings.updateReOrderSettingsByID(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateReOrderSettingsStatus = createAsyncThunk(
  "reOrderSettingsReducer/updateReOrderSettingsStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.reOrderSettings.changeStatusReOrderSettings(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteReOrderSettingsById = createAsyncThunk(
  "reOrderSettingsReducer/deleteReOrderSettingsById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.reOrderSettings.deleteReOrderSettingsByID(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getReOrderSettings = createAsyncThunk(
  "reOrderSettingsReducer/getReOrderSettings",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.reOrderSettings.getReOrderSettings(payload?.branch, payload?.product);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//mcvasettings
export const getMcVaSettings = createAsyncThunk(
  "mcVaSettingsReducer/getMcVaSettings",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.mcVaSettings.getMcVaSettings();
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getMcVa = createAsyncThunk("mcVaSettingsReducer/getMcVa", async (payload = {}, { rejectWithValue }) => {
  try {
    const response = await catalogMasterAPI.mcVaSettings.getMcVa(payload);
    return response?.data || null;
  } catch (error) {
    DispatchErrorHandler(error);
    return rejectWithValue(error);
  }
});

export const createMcVaSettings = createAsyncThunk(
  "mcVaSettingsReducer/createMcVaSettings",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.mcVaSettings.createMcVaSettings(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getCustomerMcVa = createAsyncThunk(
  "mcVaSettingsReducer/getCustomerMcVa",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.mcVaSettings.getCustomerMcVa(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const createCustomerMcVaSettings = createAsyncThunk(
  "mcVaSettingsReducer/createCustomerMcVaSettings",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.mcVaSettings.createCustomerMcVaSettings(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

//Repair Damage Master
export const createRepairDamageMaster = createAsyncThunk(
  "repairDamageMasterReducer/createRepairDamageMaster",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.repair.createRepairDamageMaster(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getAllRepairDamageMaster = createAsyncThunk(
  "repairDamageMasterReducer/getAllRepairDamageMaster",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.repair.getAllRepairDamageMaster(payload?.page);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getRepairDamageMasterById = createAsyncThunk(
  "repairDamageMasterReducer/getRepairDamageMasterById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.repair.getRepairDamageMasterById(payload);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateRepairDamageMasterById = createAsyncThunk(
  "repairDamageMasterReducer/updateRepairDamageMasterById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.repair.updateRepairDamageMasterById(payload?.id, payload?.putData);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteRepairDamageMasterById = createAsyncThunk(
  "repairDamageMasterReducer/deleteSubDesignById",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.repair.deleteRepairDamageMasterById(payload);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const updateRepairDamageMasterStatus = createAsyncThunk(
  "repairDamageMasterReducer/updateRepairDamageMasterStatus",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.repair.updateRepairDamageMasterStatus(payload?.id);
      return response || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveRepairDamageMaster = createAsyncThunk(
  "repairDamageMasterReducer/getActiveRepairDamageMaster",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.repair.getActiveRepairDamageMaster(payload?.status);
      return response?.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);

export const getActiveDiamondRateMaster = createAsyncThunk(
  "diamondRateMasterReducer/getActiveDiamondRateMaster",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await catalogMasterAPI.diamondRateMaster.getActiveDiamondRateMaster(payload);
      return response.data || null;
    } catch (error) {
      DispatchErrorHandler(error);
      return rejectWithValue(error);
    }
  }
);
