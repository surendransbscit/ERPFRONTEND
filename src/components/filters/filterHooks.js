import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getActiveCategory,
  getActiveProduct,
  getActivePurity,
  getActiveQualityCode,
  getActiveStoneList,
  getActiveMetal,
  getActiveDesign,
  getActiveSection,
  getActiveSubDesign,
  getDesignMappingDetails,
  getSubDesignMappingDetails,
  getCalType,
  getActiveTaxGroup,
  getAllDesign,
  getActiveCut,
  getActiveColor,
  getActiveShape,
  getActiveClarity,
  getProductSection,
  getActiveSize,
  getMcVaSettings,
  getActiveRepairDamageMaster,
  getActiveDiamondRateMaster,
} from "../../redux/thunks/catalogMaster";
import {
  getActiveAttribute,
  getActiveCharges,
  getActiveSupplier,
  getActiveTaxMaster,
  getAllArea,
  getAllCity,
  getAllCountry,
  getAllMetalPurityRate,
  getAllState,
  getCurrentMetalRate,
  getUomList,
  getAllFinancialYear,
  getActiveStockIssueType,
  getAllWeightRange,
  getActiveProfessions,
  getRelationTypeOptions,
  getActiveContainers,
  getActiveOldMetalItem,
  getActiveAccountHead,
  getAllCatMetalPurityRate,
  getAllBank,
  getDepositMasterOptions,
  getReligionMasterOptions,
  getLocalVendorSupplier,
  getCounterOptions,
  getActiveRegions,
} from "../../redux/thunks/retailMaster";
import {
  getActiveScheme,
  getActiveSchemeClass,
  getAllActiveScheme,
  getAllScheme,
  getAllSchemeClass,
} from "../../redux/thunks/scheme";
import { getAccessBranches } from "../../redux/thunks/coreComponent";
import secureLocalStorage from "react-secure-storage";
import { getAllCompany } from "../../redux/thunks/settings";
import { getActiveLot, getLotList } from "../../redux/thunks/inventory";
import {
  getActiveEmployee,
  getActiveEmployeeDropdown,
} from "../../redux/thunks/employee";
import { getAllOrderStatus } from "../../redux/thunks/Order";
import { getAllCustomer } from "../../redux/thunks/customer";
import {
  getOtherInventoryCategoryOptions,
  getOtherInventoryItemOptions,
  getOtherInventorySizeOptions,
} from "../../redux/thunks/otherInventory";
import { getGiftVoucherOptions } from "../../redux/thunks/promotionManagement";
import { getLoyaltyTierOptions } from "../../redux/thunks/loyaltyMaster";
import {
  getAdminProductMasterOption,
  getAllAdminProductMaster,
  getAllMasterClients,
  getClientOptions,
  getMasterClientsOptions,
  getMasterModuleOption,
} from "../../redux/thunks/adminMaster";
import { getProjectOptions, getTaskOptions } from "../../redux/thunks/adminProject";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const { categoryList } = useSelector((state) => state.categoryReducer);
  useEffect(() => {
    dispatch(getActiveCategory());
  }, [dispatch]);
  useEffect(() => {
    if (categoryList !== undefined) {
      setCategories(categoryList);
    }
  }, [categoryList]);
  return { categories };
};

export const usePurities = (isFilterRequired = true) => {
  const [purities, setPurities] = useState([]);
  const dispatch = useDispatch();
  const { activePurityList } = useSelector((state) => state.purityReducer);
  useEffect(() => {
    if (isFilterRequired == true) {
      dispatch(getActivePurity());
    }
  }, [dispatch, isFilterRequired]);
  useEffect(() => {
    setPurities(activePurityList);
  }, [activePurityList]);
  return { purities };
};

export const useProducts = (isFilterRequired = true) => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const { activeProductList } = useSelector((state) => state.productReducer);
  useEffect(() => {
    if (isFilterRequired === true) {
      dispatch(getActiveProduct());
    }
  }, [dispatch, isFilterRequired]);
  useEffect(() => {
    setProducts(activeProductList);
  }, [activeProductList]);
  return { products };
};

export const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const dispatch = useDispatch();
  const { countryList } = useSelector((state) => state.countryReducer);
  useEffect(() => {
    dispatch(getAllCountry());
  }, [dispatch]);
  useEffect(() => {
    if (countryList !== undefined) {
      setCountries(countryList);
    }
  }, [countryList]);
  return { countries };
};

export const useStates = () => {
  const [states, setStates] = useState([]);
  const dispatch = useDispatch();
  const { stateList } = useSelector((state) => state.stateReducer);
  useEffect(() => {
    dispatch(getAllState());
  }, [dispatch]);
  useEffect(() => {
    if (stateList !== undefined) {
      setStates(stateList);
    }
  }, [stateList]);
  return { states };
};

export const useCities = () => {
  const [cities, setCities] = useState([]);
  const dispatch = useDispatch();
  const { cityList } = useSelector((state) => state.cityReducer);
  useEffect(() => {
    dispatch(getAllCity());
  }, [dispatch]);
  useEffect(() => {
    if (cityList !== undefined) {
      setCities(cityList);
    }
  }, [cityList]);
  return { cities };
};

export const useAreas = () => {
  const [areas, setAreas] = useState([]);
  const dispatch = useDispatch();
  const { areaList } = useSelector((state) => state.areaReducer);
  useEffect(() => {
    dispatch(getAllArea());
  }, [dispatch]);
  useEffect(() => {
    if (areaList !== undefined) {
      setAreas(areaList);
    }
  }, [areaList]);
  return { areas };
};

export const useRelationTypes = () => {
  const [relationTypes, setRelationTypes] = useState([]);
  const dispatch = useDispatch();
  const { relationTypeOptions } = useSelector(
    (state) => state.relationTypeReducer
  );
  useEffect(() => {
    dispatch(getRelationTypeOptions());
  }, [dispatch]);
  useEffect(() => {
    if (relationTypeOptions?.length > 0) {
      setRelationTypes(relationTypeOptions);
    }
  }, [relationTypeOptions]);
  return { relationTypes };
};

export const useProfessions = () => {
  const [professions, setProfessions] = useState([]);
  const dispatch = useDispatch();
  const { activeProfessionList } = useSelector(
    (state) => state.professionReducer
  );
  useEffect(() => {
    dispatch(getActiveProfessions());
  }, [dispatch]);
  useEffect(() => {
    if (activeProfessionList?.length > 0) {
      setProfessions(activeProfessionList);
    }
  }, [activeProfessionList]);
  return { professions };
};

export const useDesigns = (isFilterRequired = true) => {
  const [designs, setDesigns] = useState([]);
  const dispatch = useDispatch();
  const { activeDesignMappingList } = useSelector(
    (state) => state.designReducer
  );
  useEffect(() => {
    if (isFilterRequired === true) {
      dispatch(getDesignMappingDetails());
    }
  }, [dispatch]);
  useEffect(() => {
    setDesigns(activeDesignMappingList);
  }, [activeDesignMappingList]);
  return { designs };
};

export const useAllDesigns = () => {
  const [design, setDesigns] = useState([]);
  const dispatch = useDispatch();
  const { designList } = useSelector((state) => state.designReducer);
  useEffect(() => {
    dispatch(getActiveDesign());
  }, [dispatch]);
  useEffect(() => {
    setDesigns(designList);
  }, [designList]);
  return { design };
};

export const useBranches = () => {
  const [branches, SetBranches] = useState([]);
  const dispatch = useDispatch();
  const loginPreference = secureLocalStorage?.getItem("pref")?.pref;
  const { accessBranches } = useSelector((state) => state.coreCompReducer);
  // useEffect(() => {
  //   dispatch(getAccessBranches(loginPreference));
  // }, [dispatch, loginPreference]);
  useEffect(() => {
    SetBranches(accessBranches);
  }, [accessBranches]);
  return { branches };
};

export const useSchemes = (isFilterRequired) => {
  const [schemes, setSchemes] = useState([]);
  const dispatch = useDispatch();
  const { activeSchemeList } = useSelector((state) => state.schemesReducer);
  useEffect(() => {
    if (isFilterRequired) {
      dispatch(getAllActiveScheme());
    }
  }, [dispatch, isFilterRequired]);
  useEffect(() => {
    if (activeSchemeList) {
      setSchemes(activeSchemeList?.data);
    }
  }, [activeSchemeList]);
  return { schemes };
};

export const useContainers = () => {
  const [containers, setContainers] = useState([]);
  const dispatch = useDispatch();
  const { activeContainerList } = useSelector(
    (state) => state.containerReducer
  );
  useEffect(() => {
    dispatch(getActiveContainers());
  }, [dispatch]);
  useEffect(() => {
    if (activeContainerList?.length > 0) {
      setContainers(activeContainerList);
    }
  }, [activeContainerList]);
  return { containers };
};

export const useActiveSchemes = (isFilterRequired) => {
  const [schemes, setSchemes] = useState([]);
  const dispatch = useDispatch();
  const { schemeList } = useSelector((state) => state.schemesReducer);
  useEffect(() => {
    if (isFilterRequired) {
      dispatch(getActiveScheme());
    }
  }, [dispatch, isFilterRequired]);
  useEffect(() => {
    if (schemeList) {
      setSchemes(schemeList);
    }
  }, [schemeList]);
  return { schemes };
};

export const useSubDesigns = (isFilterRequired = true) => {
  const [subDesigns, setSubDesigns] = useState([]);
  const dispatch = useDispatch();
  const { subDesignMappingList } = useSelector(
    (state) => state.subDesignReducer
  );
  useEffect(() => {
    if (isFilterRequired === true) {
      dispatch(getSubDesignMappingDetails());
    }
  }, [dispatch, isFilterRequired]);
  useEffect(() => {
    setSubDesigns(subDesignMappingList);
  }, [subDesignMappingList]);
  return { subDesigns };
};

export const useAllSubDesigns = () => {
  const [subDesign, setSubDesign] = useState([]);
  const dispatch = useDispatch();
  const { activeSubDesignList } = useSelector(
    (state) => state.subDesignReducer
  );
  useEffect(() => {
    dispatch(getActiveSubDesign());
  }, [dispatch]);
  useEffect(() => {
    setSubDesign(activeSubDesignList);
  }, [activeSubDesignList]);
  return { subDesign };
};

export const useUom = () => {
  const [uom, setUom] = useState([]);
  const dispatch = useDispatch();
  const { uomOptions } = useSelector((state) => state.uomReducer);
  useEffect(() => {
    dispatch(getUomList());
  }, [dispatch]);
  useEffect(() => {
    setUom(uomOptions);
  }, [uomOptions]);
  return { uom };
};

export const useStone = () => {
  const [stone, setStone] = useState([]);
  const dispatch = useDispatch();
  const { activeStoneList } = useSelector((state) => state.stoneReducer);
  useEffect(() => {
    dispatch(getActiveStoneList());
  }, [dispatch]);
  useEffect(() => {
    setStone(activeStoneList);
  }, [activeStoneList]);
  return { stone };
};

export const useQualityCode = () => {
  const [quality_code, setQualityCode] = useState([]);
  const dispatch = useDispatch();
  const { activeQualityCodeList } = useSelector(
    (state) => state.qualityCodeReducer
  );
  useEffect(() => {
    dispatch(getActiveQualityCode());
  }, [dispatch]);
  useEffect(() => {
    setQualityCode(activeQualityCodeList);
  }, [activeQualityCodeList]);
  return { quality_code };
};

export const useCalType = () => {
  const [calType, setCalType] = useState([]);
  const dispatch = useDispatch();
  const { calTypeList } = useSelector((state) => state.calTypeReducer);
  useEffect(() => {
    dispatch(getCalType());
  }, [dispatch]);
  useEffect(() => {
    if (calTypeList !== undefined) {
      setCalType(calTypeList);
    }
  }, [calTypeList]);
  return { calType };
};

export const useActiveSchemeClassification = () => {
  const [schemesclass, setSchemeClassifications] = useState([]);
  const dispatch = useDispatch();
  const { schemeClassList } = useSelector((state) => state.schemeClassReducer);
  useEffect(() => {
    dispatch(getActiveSchemeClass());
  }, [dispatch]);
  useEffect(() => {
    if (schemeClassList !== undefined) {
      setSchemeClassifications(schemeClassList);
    }
  }, [schemeClassList]);
  return { schemesclass };
};

export const useMetals = (isFilterRequired = true) => {
  const [metals, setMetals] = useState([]);
  const dispatch = useDispatch();
  const { activeMetalList } = useSelector((state) => state.metalReducer);
  useEffect(() => {
    if (isFilterRequired === true) {
      dispatch(getActiveMetal());
    }
  }, [dispatch, isFilterRequired]);
  useEffect(() => {
    if (activeMetalList !== undefined) {
      setMetals(activeMetalList);
    }
  }, [activeMetalList]);
  return { metals };
};

export const useTaxGroup = () => {
  const [taxGroup, setTaxGroup] = useState([]);
  const dispatch = useDispatch();
  const { taxGroupList } = useSelector((state) => state.taxGroupReducer);
  useEffect(() => {
    dispatch(getActiveTaxGroup());
  }, [dispatch]);
  useEffect(() => {
    if (taxGroupList !== undefined) {
      setTaxGroup(taxGroupList);
    }
  }, [taxGroupList]);
  return { taxGroup };
};

export const useCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const dispatch = useDispatch();
  const { companyList } = useSelector((state) => state.companyReducer);
  useEffect(() => {
    dispatch(getAllCompany());
  }, [dispatch]);
  useEffect(() => {
    if (companyList !== undefined) {
      setCompanies(companyList);
    }
  }, [companyList]);
  return { companies };
};

export const useCurrentMetalRate = () => {
  const [metalRates, setMetalRates] = useState([]);
  const dispatch = useDispatch();
  const { metalRateInfo } = useSelector((state) => state.metalRateReducer);
  useEffect(() => {
    dispatch(getCurrentMetalRate());
  }, [dispatch]);
  useEffect(() => {
    if (metalRateInfo !== undefined) {
      setMetalRates(metalRateInfo);
    }
  }, [metalRateInfo]);
  return { metalRates };
};

export const useMetalPurityRate = () => {
  const [metalPurityRate, setMetalPurityRate] = useState([]);
  const dispatch = useDispatch();
  const { metalPurityRateList } = useSelector(
    (state) => state.metalPurityRateReducer
  );
  useEffect(() => {
    dispatch(getAllMetalPurityRate());
  }, [dispatch]);
  useEffect(() => {
    if (metalPurityRateList !== undefined) {
      setMetalPurityRate(metalPurityRateList);
    }
  }, [metalPurityRateList]);
  return { metalPurityRate };
};

export const useSupplierFilter = (isFilterRequired = true) => {
  const [supplier, setSupplier] = useState([]);
  const dispatch = useDispatch();
  const { activeKarigarList } = useSelector((state) => state.karigarReducer);
  useEffect(() => {
    if (isFilterRequired === true) {
      dispatch(getActiveSupplier());
    }
  }, [dispatch, isFilterRequired]);
  useEffect(() => {
    if (activeKarigarList !== undefined) {
      setSupplier(activeKarigarList);
    }
  }, [activeKarigarList]);
  return { supplier };
};

export const useLocalVendorSupplierFilter = (isFilterRequired = true) => {
  const [supplier, setSupplier] = useState([]);
  const dispatch = useDispatch();
  const { localVendorKarigarList } = useSelector(
    (state) => state.karigarReducer
  );
  useEffect(() => {
    if (isFilterRequired === true) {
      dispatch(getLocalVendorSupplier());
    }
  }, [dispatch, isFilterRequired]);
  useEffect(() => {
    if (
      localVendorKarigarList !== undefined &&
      localVendorKarigarList?.length > 0
    ) {
      setSupplier(localVendorKarigarList);
    }
  }, [localVendorKarigarList]);
  return { supplier };
};

export const useTaxMaster = () => {
  const [taxMaster, setTaxMaster] = useState([]);
  const dispatch = useDispatch();
  const { activeTaxList } = useSelector((state) => state.taxmasterReducer);
  useEffect(() => {
    dispatch(getActiveTaxMaster());
  }, [dispatch]);
  useEffect(() => {
    if (activeTaxList !== undefined) {
      setTaxMaster(activeTaxList);
    }
  }, [activeTaxList]);
  return { taxMaster };
};

export const useActiveLot = (isFilterRequired = true) => {
  const [lot, setLotList] = useState([]);
  const dispatch = useDispatch();
  const { activeLot } = useSelector((state) => state.lotReducer);
  useEffect(() => {
    if (isFilterRequired === true) {
      dispatch(getActiveLot());
    }
  }, [dispatch, isFilterRequired]);
  useEffect(() => {
    if (activeLot !== undefined) {
      setLotList(activeLot);
    }
  }, [activeLot]);
  return { lot };
};

export const useSections = () => {
  const [sections, setSections] = useState([]);
  const dispatch = useDispatch();
  const { activeSectionList } = useSelector((state) => state.sectionReducer);
  useEffect(() => {
    dispatch(getActiveSection());
  }, [dispatch]);
  useEffect(() => {
    if (activeSectionList !== undefined) {
      setSections(activeSectionList);
    }
  }, [activeSectionList]);
  return { sections };
};

export const useProductSections = () => {
  const [sections, setSections] = useState([]);
  const dispatch = useDispatch();
  const { activeSectionList } = useSelector((state) => state.sectionReducer);
  useEffect(() => {
    dispatch(getProductSection());
  }, [dispatch]);
  useEffect(() => {
    if (activeSectionList !== undefined) {
      setSections(activeSectionList);
    }
  }, [activeSectionList]);
  return { sections };
};

export const useCut = () => {
  const [cut, setCut] = useState([]);
  const dispatch = useDispatch();
  const { activeCutList } = useSelector((state) => state.cutReducer);
  useEffect(() => {
    dispatch(getActiveCut());
  }, [dispatch]);
  useEffect(() => {
    setCut(activeCutList);
  }, [activeCutList]);
  return { cut };
};

export const useClarity = () => {
  const [clarity, setClarity] = useState([]);
  const dispatch = useDispatch();
  const { activeClarityList } = useSelector((state) => state.clarityReducer);
  useEffect(() => {
    dispatch(getActiveClarity());
  }, [dispatch]);
  useEffect(() => {
    setClarity(activeClarityList);
  }, [activeClarityList]);
  return { clarity };
};

export const useShape = () => {
  const [shape, setShape] = useState([]);
  const dispatch = useDispatch();
  const { activeShapeList } = useSelector((state) => state.shapeReducer);
  useEffect(() => {
    dispatch(getActiveShape());
  }, [dispatch]);
  useEffect(() => {
    setShape(activeShapeList);
  }, [activeShapeList]);
  return { shape };
};

export const useColor = () => {
  const [color, setColor] = useState([]);
  const dispatch = useDispatch();
  const { activeColorList } = useSelector((state) => state.colorReducer);
  useEffect(() => {
    dispatch(getActiveColor());
  }, [dispatch]);
  useEffect(() => {
    setColor(activeColorList);
  }, [activeColorList]);
  return { color };
};

export const useActiveCharges = () => {
  const [otherCharges, setOtherCharges] = useState([]);
  const dispatch = useDispatch();
  const { otherChargesList } = useSelector(
    (state) => state.otherChargesReducer
  );
  useEffect(() => {
    dispatch(getActiveCharges());
  }, [dispatch]);
  useEffect(() => {
    setOtherCharges(otherChargesList);
  }, [otherChargesList]);
  return { otherCharges };
};

export const useActiveAttribute = () => {
  const [attribute, setAttribute] = useState([]);
  const dispatch = useDispatch();
  const { attributeEntryList } = useSelector(
    (state) => state.attributeEntryReducer
  );
  useEffect(() => {
    dispatch(getActiveAttribute());
  }, [dispatch]);
  useEffect(() => {
    setAttribute(attributeEntryList);
  }, [attributeEntryList]);
  return { attribute };
};

export const useEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const dispatch = useDispatch();
  const { activeEmployeeList } = useSelector((state) => state.employeeReducer);
  useEffect(() => {
    dispatch(getActiveEmployee());
  }, [dispatch]);
  useEffect(() => {
    setEmployees(activeEmployeeList);
  }, [activeEmployeeList]);
  return { employees };
};

export const useEmployeeDropdown = (isFilterRequired = true) => {
  const [employees, setEmployees] = useState([]);
  const dispatch = useDispatch();
  const { activeEmployeeDropdown } = useSelector(
    (state) => state.employeeReducer
  );
  useEffect(() => {
    if(isFilterRequired === true){
    dispatch(getActiveEmployeeDropdown());
    }
  }, [dispatch, isFilterRequired]);
  useEffect(() => {
    setEmployees(activeEmployeeDropdown);
  }, [activeEmployeeDropdown]);
  return { employees };
};

export const useOrderStatus = () => {
  const [orderStatus, setOrderStatus] = useState([]);
  const dispatch = useDispatch();
  const { orderStatusList } = useSelector((state) => state.orderReducer);
  useEffect(() => {
    dispatch(getAllOrderStatus());
  }, [dispatch]);
  useEffect(() => {
    setOrderStatus(orderStatusList);
  }, [orderStatusList]);
  return { orderStatus };
};

export const useFinYears = () => {
  const [finYears, setFinYears] = useState([]);
  const dispatch = useDispatch();
  const { financialYearList } = useSelector(
    (state) => state.financialYearReducer
  );
  useEffect(() => {
    dispatch(getAllFinancialYear());
  }, [dispatch]);
  useEffect(() => {
    setFinYears(financialYearList.rows);
    if (financialYearList.rows) {
      setFinYears(financialYearList.rows);
    }
  }, [financialYearList]);
  return { finYears };
};

export const useActiveStockIssueType = () => {
  const [stockIssueType, setStockIssueType] = useState([]);
  const dispatch = useDispatch();
  const { stockIssueTypeList } = useSelector(
    (state) => state.stockIssueTypeReducer
  );
  useEffect(() => {
    dispatch(getActiveStockIssueType());
  }, [dispatch]);
  useEffect(() => {
    setStockIssueType(stockIssueTypeList);
  }, [stockIssueTypeList]);
  return { stockIssueType };
};

export const useSize = () => {
  const [size, setSize] = useState([]);
  const dispatch = useDispatch();
  const { activeSizeList } = useSelector((state) => state.sizeReducer);
  useEffect(() => {
    dispatch(getActiveSize());
  }, [dispatch]);
  useEffect(() => {
    if (activeSizeList !== undefined) {
      setSize(activeSizeList);
    }
  }, [activeSizeList]);
  return { size };
};

export const useWeightRange = () => {
  const [weightRanges, setWeightRanges] = useState([]);
  const dispatch = useDispatch();
  const { weightRangeList } = useSelector((state) => state.weightRangeReducer);
  useEffect(() => {
    dispatch(getAllWeightRange());
  }, [dispatch]);
  useEffect(() => {
    if (weightRangeList !== undefined) {
      setWeightRanges(weightRangeList);
    }
  }, [weightRangeList]);
  return { weightRanges };
};

export const useMcVaSetiings = () => {
  const [mcVaSetiings, setMcVaSetiings] = useState([]);
  const dispatch = useDispatch();
  const { mcVaSettingsList } = useSelector(
    (state) => state.mcVaSettingsReducer
  );
  useEffect(() => {
    dispatch(getMcVaSettings());
  }, [dispatch]);
  useEffect(() => {
    if (mcVaSettingsList !== undefined) {
      setMcVaSetiings(mcVaSettingsList);
    }
  }, [mcVaSettingsList]);
  return { mcVaSetiings };
};

export const useOldMetalItem = () => {
  const [oldMetalItems, setOldMetalItems] = useState([]);
  const dispatch = useDispatch();
  const { activeOldMetalItemList } = useSelector(
    (state) => state.oldMetalItemReducer
  );
  useEffect(() => {
    dispatch(getActiveOldMetalItem());
  }, [dispatch]);
  useEffect(() => {
    if (activeOldMetalItemList?.length > 0) {
      setOldMetalItems(activeOldMetalItemList);
    }
  }, [activeOldMetalItemList]);
  return { oldMetalItems };
};

export const useDamageMaster = () => {
  const [damageMaster, setDamageMaster] = useState([]);
  const dispatch = useDispatch();
  const { activeRepairDamageMasterList } = useSelector(
    (state) => state.repairDamageMasterReducer
  );
  useEffect(() => {
    dispatch(getActiveRepairDamageMaster());
  }, [dispatch]);
  useEffect(() => {
    setDamageMaster(activeRepairDamageMasterList);
  }, [activeRepairDamageMasterList]);
  return { damageMaster };
};

export const useAccountHeadDropdown = ({ filterOptions, filterType }) => {
  const [accountHead, setAccountHead] = useState([]);
  const dispatch = useDispatch();
  const { activeAccountHeadList } = useSelector(
    (state) => state.accountHeadReducer
  );
  useEffect(() => {
    dispatch(getActiveAccountHead());
  }, [dispatch]);
  useEffect(() => {
    if (filterOptions === true) {
      setAccountHead(activeAccountHeadList.filter((item) => item?.type == filterType));
    } else {
      setAccountHead(activeAccountHeadList);
    }
  }, [activeAccountHeadList, filterOptions, filterType]);
  return { accountHead };
};

export const useDiamondRate = () => {
  const [diamondRate, setDiamondRate] = useState([]);
  const dispatch = useDispatch();
  const { activeDiamondRateList } = useSelector(
    (state) => state.diamondRateMasterReducer
  );
  useEffect(() => {
    dispatch(getActiveDiamondRateMaster());
  }, [dispatch]);
  useEffect(() => {
    setDiamondRate(activeDiamondRateList);
  }, [activeDiamondRateList]);
  return { diamondRate };
};

export const useCustomer = () => {
  const [customer, setCustomer] = useState([]);
  const dispatch = useDispatch();
  const { customerList } = useSelector((state) => state.customerReducer);
  useEffect(() => {
    dispatch(getAllCustomer());
  }, [dispatch]);
  useEffect(() => {
    setCustomer(customerList);
  }, [customerList]);
  return { customer };
};

export const useCatPurityRate = () => {
  const [catPurityRate, setCatPurityRate] = useState([]);
  const dispatch = useDispatch();
  const { catPurityRateList } = useSelector(
    (state) => state.metalPurityRateReducer
  );
  useEffect(() => {
    dispatch(getAllCatMetalPurityRate());
  }, [dispatch]);
  useEffect(() => {
    if (catPurityRateList !== undefined) {
      setCatPurityRate(catPurityRateList);
    }
  }, [catPurityRateList]);
  return { catPurityRate };
};

export const useBanks = () => {
  const [banks, setBanks] = useState([]);
  const dispatch = useDispatch();
  const { bankList } = useSelector((state) => state.bankReducer);
  useEffect(() => {
    dispatch(getAllBank());
  }, [dispatch]);
  useEffect(() => {
    if (bankList) {
      setBanks(bankList?.rows);
    }
  }, [bankList]);
  return { banks };
};

export const useAllLot = () => {
  const [lot, setLotList] = useState([]);
  const dispatch = useDispatch();
  const { lotList } = useSelector((state) => state.lotReducer);
  useEffect(() => {
    dispatch(getLotList());
  }, [dispatch]);
  useEffect(() => {
    if (lotList?.rows !== undefined) {
      setLotList(lotList.rows);
    }
  }, [lotList]);
  return { lot };
};

export const useDepositMaster = () => {
  const [depositMasterOptionList, setDepositMasterOptionList] = useState([]);
  const dispatch = useDispatch();
  const { depositMasterOptions } = useSelector(
    (state) => state.depositMasterReducer
  );
  useEffect(() => {
    dispatch(getDepositMasterOptions());
  }, [dispatch]);
  useEffect(() => {
    setDepositMasterOptionList(depositMasterOptions);
  }, [depositMasterOptions]);
  return { depositMasterOptionList };
};

export const useReligions = () => {
  const [religions, setReligions] = useState([]);
  const dispatch = useDispatch();
  const { religionMasterOptions } = useSelector(
    (state) => state.religionMasterReducer
  );
  useEffect(() => {
    dispatch(getReligionMasterOptions());
  }, [dispatch]);
  useEffect(() => {
    if (religionMasterOptions?.length > 0) {
      setReligions(religionMasterOptions);
    }
  }, [religionMasterOptions]);
  return { religions };
};

export const useOtherInventoryCategory = () => {
  const [otherInventoryCategories, setOtherInventoryCategories] = useState([]);
  const dispatch = useDispatch();
  const { otherInventoryCategoryOptions } = useSelector(
    (state) => state.otherInventoryCategoryReducer
  );
  useEffect(() => {
    dispatch(getOtherInventoryCategoryOptions());
  }, [dispatch]);
  useEffect(() => {
    if (otherInventoryCategoryOptions !== undefined) {
      setOtherInventoryCategories(otherInventoryCategoryOptions);
    }
  }, [otherInventoryCategoryOptions]);
  return { otherInventoryCategories };
};

export const useOtherInventorySize = () => {
  const [otherInventorySizes, setOtherInventorySizes] = useState([]);
  const dispatch = useDispatch();
  const { otherInventorySizeOptions } = useSelector(
    (state) => state.otherInventorySizeReducer
  );
  useEffect(() => {
    dispatch(getOtherInventorySizeOptions());
  }, [dispatch]);
  useEffect(() => {
    if (otherInventorySizeOptions !== undefined) {
      setOtherInventorySizes(otherInventorySizeOptions);
    }
  }, [otherInventorySizeOptions]);
  return { otherInventorySizes };
};

export const useOtherInventoryItem = () => {
  const [otherInventoryItems, setOtherInventoryItems] = useState([]);
  const dispatch = useDispatch();
  const { otherInventoryItemOptions } = useSelector(
    (state) => state.OtherInventoryItemReducer
  );
  useEffect(() => {
    dispatch(getOtherInventoryItemOptions());
  }, [dispatch]);
  useEffect(() => {
    if (otherInventoryItemOptions !== undefined) {
      setOtherInventoryItems(otherInventoryItemOptions);
    }
  }, [otherInventoryItemOptions]);
  return { otherInventoryItems };
};

export const useVouchers = () => {
  const [giftVoucherrOptionList, setGiftVoucherrOptionList] = useState([]);
  const dispatch = useDispatch();
  const { promotionManagementGiftVoucherOptions } = useSelector(
    (state) => state.promotionManagementGiftVoucherReducer
  );
  useEffect(() => {
    dispatch(getGiftVoucherOptions());
  }, [dispatch]);
  useEffect(() => {
    setGiftVoucherrOptionList(promotionManagementGiftVoucherOptions);
  }, [promotionManagementGiftVoucherOptions]);
  return { giftVoucherrOptionList };
};

export const useLoyaltyTier = () => {
  const [loyaltyTierOptionList, setLoyaltyTierOptionList] = useState([]);
  const dispatch = useDispatch();
  const { loyaltytierOptions } = useSelector(
    (state) => state.LoyaltyTierReducer
  );
  useEffect(() => {
    dispatch(getLoyaltyTierOptions());
  }, [dispatch]);
  useEffect(() => {
    setLoyaltyTierOptionList(loyaltytierOptions);
  }, [loyaltytierOptions]);
  return { loyaltyTierOptionList };
};

export const useMasterClient = () => {
  const [clientOptionList, SetClientOptionList] = useState([]);
  const dispatch = useDispatch();
  const { ClientOptions } = useSelector((state) => state.masterClientReducer);
  useEffect(() => {
    dispatch(getMasterClientsOptions());
  }, [dispatch]);
  useEffect(() => {
    SetClientOptionList(ClientOptions);
  }, [ClientOptions]);
  return { clientOptionList };
};

export const useMasterProduct = () => {
  const [masterProductOptionList, setMasterProductOptionList] = useState([]);
  const dispatch = useDispatch();
  const { adminProductMasterOptions } = useSelector(
    (state) => state.adminProductMasterReducer
  );
  useEffect(() => {
    dispatch(getAdminProductMasterOption());
  }, [dispatch]);
  useEffect(() => {
    setMasterProductOptionList(adminProductMasterOptions);
  }, [adminProductMasterOptions]);
  return { masterProductOptionList };
};

export const useCounters = () => {
  const [counters, setCounters] = useState([]);
  const dispatch = useDispatch();
  const { counterOptions } = useSelector((state) => state.counterReducer);
  useEffect(() => {
    dispatch(getCounterOptions());
  }, [dispatch]);
  useEffect(() => {
    if (counterOptions !== undefined) {
      setCounters(counterOptions);
    }
  }, [counterOptions]);
  return { counters };
};

export const useModuleMaster = () => {
  const [moduleOptionList, SetModuleOptionList] = useState([]);
  const dispatch = useDispatch();
  const { ModuleMasterOptions } = useSelector((state) => state.mastermoduleReducer);
  useEffect(() => {
    dispatch(getMasterModuleOption());
  }, [dispatch]);
  useEffect(() => {
    SetModuleOptionList(ModuleMasterOptions);
  }, [ModuleMasterOptions]);
  return { moduleOptionList };
};

export const useModuleProject = () => {
  const [moduleProject, setModuleProject] = useState([]);
  const dispatch = useDispatch();
  const { projectOptions } = useSelector(
    (state) => state.projectReducer
  );
  useEffect(() => {
    dispatch(getProjectOptions());
  }, [dispatch]);
  useEffect(() => {
    if (projectOptions !== undefined) {
      setModuleProject(projectOptions);
    }
  }, [projectOptions]);
  return { moduleProject };
};

export const useModuleTask = () => {
  const [moduleTask, setModuleTask] = useState([]);
  const dispatch = useDispatch();
  const { TaskMasterOptions } = useSelector(
    (state) => state.taskReducer
  );
  useEffect(() => {
    dispatch(getTaskOptions());
  }, [dispatch]);
  useEffect(() => {
    if (TaskMasterOptions !== undefined) {
      setModuleTask(TaskMasterOptions);
    }
  }, [TaskMasterOptions]);
  return { moduleTask };
};


export const useTasks = () => {
  const [taskList, setTaskList] = useState([]);
  const dispatch = useDispatch();
  const { taskOptions } = useSelector(
    (state) => state.taskReducer
  );
  useEffect(() => {
    dispatch(getTaskOptions());
  }, [dispatch]);
  useEffect(() => {
    if (taskOptions !== undefined) {
      setTaskList(taskOptions);
    }
  }, [taskOptions]);
  return { taskList };
};


export const useRegions = () => {
  const [regions, setRegions] = useState([]);
  const dispatch = useDispatch();
  const { activeRegionList } = useSelector(
    (state) => state.regionReducer
  );
  useEffect(() => {
    dispatch(getActiveRegions());
  }, [dispatch]);
  useEffect(() => {
    if (activeRegionList?.length > 0) {
      setRegions(activeRegionList);
    }
  }, [activeRegionList]);
  return { regions };
};