/* eslint-disable no-unused-expressions */
import React, { useEffect, useState, useRef } from "react";
import Head from "../../../layout/head/Head";
import { toastfunc } from "../../../components/sds-toast-style/toast-style";
import { useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Col,
  Row,
  PreviewCard,
  SaveButton,
  Icon,
} from "../../../components/Component";
import {
  TextInputField,
  NumberInputField,
  InputFieldWithDropdown,
} from "../../../components/form-control/InputGroup";
import Content from "../../../layout/content/Content";
import "../../../assets/css/sales_form.css";
import {
  BranchDropdown,
  LotDropdown,
  DesignDropdown,
  ProductDropdown,
  SubDesignDropdown,
  StockIssueTypeDropdown,
  SectionDropdown,
  ActiveEmployeeDropdown,
  SelectDropdown,
  MetalDropdown,
  SupplierDropdown,
} from "../../../components/filters/retailFilters";
import {
  useAllLot,
  useProducts,
  useDesigns,
  useSubDesigns,
  useUom,
  useBranches,
  useActiveStockIssueType,
  useProductSections,
  useEmployeeDropdown,
  useMetals,
  useStone,
  useQualityCode,
  useSupplierFilter,
} from "../../../components/filters/filterHooks";
import { Button } from "reactstrap";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useDispatch } from "react-redux";
import {
  createStockTransfer,
  getTagFilterdedData,
  getTagEstimatedData,
  getPartlySalesStock,
  getSalesReturnStock,
  getOldMetalStock,
} from "../../../redux/thunks/inventory";
import IsRequired from "../../../components/erp-required/erp-required";
import { calculateNetWeight } from "../../../components/common/calculations/ErpCalculations";
import { getNonTagStock } from "../../../redux/thunks/inventory";
import { Typeahead } from "react-bootstrap-typeahead";
import { searchCustomer } from "../../../redux/thunks/customer";
import { useHotkeys } from "react-hotkeys-hook";
import { DateRangePickerInput } from "../../../components/filters/dateRangeFilter";
import moment from "moment/moment";
import LessWeightInputField from "../../../components/form-control/LessWeight";
import io from "socket.io-client";

const StockTransferForm = () => {
  const location = useLocation();
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    reset,
    setError,
  } = useForm();
  const navigate = useNavigate();
  const { isLoading: issubmitting, tagList } = useSelector(
    (state) => state.tagBulkEditReducer
  );
  const { userInfo } = useSelector((state) => state.authUserReducer);

  const {
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
  const { nonTagStock } = useSelector((state) => state.lotReducer);
  const { salesReturnList, partlySoldList, oldMetalList } = useSelector(
    (state) => state.stockTransferReducer
  );
  const [preview, SetPreview] = useState([]);
  const methods = useForm();
  const { products } = useProducts();
  const { designs } = useDesigns();
  const { subDesigns } = useSubDesigns();
  const { branches } = useBranches();
  const { lot } = useAllLot();
  const { uom } = useUom();
  const { metals } = useMetals();
  const { employees } = useEmployeeDropdown();
  const { stone } = useStone();
  const { quality_code } = useQualityCode();

  const { supplier } = useSupplierFilter();

  const { searchCustomerList } = useSelector((state) => state.customerReducer);
  const { sections } = useProductSections();
  const { stockIssueType } = useActiveStockIssueType();
  const [customerSearch, SetCustomerSearch] = useState([]);
  const [customer, SetCustomer] = useState();
  const [metal, SetMetal] = useState();
  const [selectedDates, setSelectedDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
    // SetStartDate(selectedDates?.startDate);
    // SetEndDate(selectedDates?.endDate);
  };

  const dispatch = useDispatch();
  const filterValuesDefalut = {
    transferTo: 1,
    maxGrossWeight: 0,
    tagCode: "",
    oldTagCode: "",
    selectedProduct: "",
    selectedDesign: "",
    selectedSubDesign: "",
    tagDateFrom: "",
    tagDateTo: "",
    selectedPurity: "",
    lotId: "",
    selectBranch: "",
    selectStockIssueType: "",
    estNo: "",
    remarks: "",
    selectStockIssueTo: "",
    selectStockIssueEmp: "",
  };
  const [filterValues, setFilterValues] = useState(filterValuesDefalut);
  const [filterTagList, setFilterTagList] = useState(tagList);
  const [StockTransferEdit, setStockTransferEdit] = useState(1);
  const [isMrpItem, setIsMrpItem] = useState(false);
  const [prevData, setPrevData] = useState([]);
  const [toBranches, setToBranches] = useState([]);
  const [maxGrossWeight, setMaxGrossWeight] = useState("");
  const [maxPiece, setMaxPiece] = useState("");
  const [isStoneRestrict, setIsStoneRestrict] = useState(false);
  const [isOtherMetalRestrict, setIsOtherMetalRestrict] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [inputType, setInputType] = useState();
  const { activeKarigarList } = useSelector((state) => state.karigarReducer);
  const [scaleWeight, setScaleWeight] = useState("");
  const [netTotalGrossWt, setNetTotalGrossWt] = useState(0);
  const [netNonTagTotalGrossWt, setNetNonTagTotalGrossWt] = useState(0);

  const initialAddFormData = {
    id: 1,
    selectedProduct: "",
    selectedDesign: "",
    selectedSubDesign: "",
    piece: 1,
    grossWeight: 0.0,
    lessWeight: 0.0,
    netWeight: 0.0,
    diaWeight: 0.0,
    stoneWeight: 0.0,
    productName: "",
    designName: "",
    subDesignName: "",
    stoneDetails: [],
    selectStockIssueTo: "",
    selectStockIssueEmp: "",
  };
  const [addFormData, setAddFormData] = useState(initialAddFormData);

  let UomOptions = [];
  if (uom.length > 0) {
    UomOptions = uom.map((val) => ({
      value: val.uom_id,
      label: val.uom_name,
      isDefault: val.is_default,
      divided_by_value: val.divided_by_value,
    }));
  }

  const onClickSave = async () => {
    console.log(filterValues);
    if (
      filterValues?.selectBranch === "" ||
      filterValues?.selectBranch === null
    ) {
      toastfunc("Please Select From Branch");
    } else if (filterValues.length === 0) {
      toastfunc("Please Add the Stock Details");
    } else if (
      filterValues.transferTo == 2 &&
      !filterValues.selectStockIssueType
    ) {
      toastfunc("Select Stock Issue Type !!");
    } else if (
      filterValues.transferTo == 2 &&
      filterValues.selectStockIssueTo == 1 &&
      !filterValues?.selectStockIssueEmp
    ) {
      toastfunc("Select Employee !!");
    } else if (
      filterValues.transferTo == 2 &&
      filterValues.selectStockIssueTo == 2 &&
      !customer
    ) {
      toastfunc("Select Customer !!");
    } else if (
      filterValues.transferTo == 2 &&
      !filterValues.selectStockIssueTo
    ) {
      toastfunc("Select Issue To !!");
    } else {
      console.log(filterValues);
      if (StockTransferEdit == 1) {
        console.log(filterValues, "asdfg");
        const checkedTags = filterTagList.filter(
          (tag) => tag.isChecked === true
        );
        if (checkedTags.length) {
          let stock_details = stock_update_details(checkedTags);
          try {
            let responce = await dispatch(
              createStockTransfer({
                stock_details: stock_details,
                transfer_type: StockTransferEdit,
                transfer_from: filterValues?.selectBranch,
                transfer_to: filterValues?.idBranchTo,
                supplier: filterValues?.selectSupplier,
                id_customer: customer,
                id_employee: filterValues?.selectStockIssueEmp,
                remarks: filterValues?.remarks,
                stock_issue_to:
                  filterValues?.selectStockIssueTo != ""
                    ? filterValues?.selectStockIssueTo
                    : null,
                trans_to_type: filterValues?.transferTo,
                stock_issue_type: filterValues?.selectStockIssueType,
                scale_weight: scaleWeight,
              })
            ).unwrap();
            reset_form();
          } catch (error) {
            console.error("Error creating stock transfer:", error);
          }
        }
      } else if (StockTransferEdit == 2) {
        console.log(prevData, "asdfg");
        let stock_details = stock_update_details(prevData);
        if (stock_details.length) {
          try {
            let responce = await dispatch(
              createStockTransfer({
                stock_details: stock_details,
                transfer_type: StockTransferEdit,
                transfer_from: filterValues?.selectBranch,
                transfer_to: filterValues?.idBranchTo,
                scale_weight: scaleWeight,
              })
            ).unwrap();
            reset_form();
          } catch (error) {
            console.error("Error creating stock transfer:", error);
          }
        }
      }
    }
  };

  const handleChange = (field, value) => {
    setStockTransferEdit(value);
    console.log(value);
  };

  const handleFilterChange = (field, value) => {
    setFilterValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  const handleFormChange = (index, field, value) => {
    setFilterTagList((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;
      return updatedValues;
    });
  };

  const stock_update_details = (data) => {
    let updateData = [];
    data.map((item, rowIndex) => {
      if (StockTransferEdit == 1) {
        updateData.push({
          tag_id: item.tag_id,
        });
      } else if (StockTransferEdit == 2) {
        updateData.push({
          transfer_from: filterValues?.selectBranch,
          transfer_to: filterValues?.idBranchTo,
          id_product: item?.selectedProduct,
          id_design: item?.selectedDesign,
          id_sub_design: item?.selectedSubDesign,
          pieces: item?.piece,
          gross_wt: item?.grossWeight,
          less_wt: item?.lessWeight,
          net_wt: item?.netWeight,
          stone_wt: item?.stoneWeight,
          dia_wt: item?.diaWeight,
          stone_details: item?.stoneDetails,
          scale_weight: scaleWeight,
        });
      }
    });
    return updateData;
  };

  useEffect(() => {
    if (
      isSearching &&
      customerSearch?.length > 0 &&
      customerSearch[0]?.label.length >= 5 &&
      customer == null
    ) {
      const searchKey = inputType === "number" ? "mob_num" : "name";
      dispatch(searchCustomer({ [searchKey]: customerSearch[0]?.label }));
    }
  }, [isSearching, customerSearch, customer, dispatch, inputType]);

  useEffect(() => {
    let filterData = [];
    tagList.forEach((item) => {
      let vaalidate = [];
      vaalidate = filterTagList.filter((tag) => tag.tag_id === item.tag_id);
      if (vaalidate.length === 0) {
        filterData.push(item);
      }
    });
    let data = [...filterTagList, ...filterData];
    setFilterTagList(data);
  }, [tagList]);

  useEffect(() => {
    if (StockTransferEdit == 3) {
      SetPreview(oldMetalList);
    }
    if (StockTransferEdit == 4) {
      SetPreview(oldMetalList);
    }
    if (StockTransferEdit == 5) {
      SetPreview(oldMetalList);
    }
    // if (StockTransferEdit == 2){
    //     SetPreview(oldMetalList);
    // }
  }, [oldMetalList, salesReturnList, partlySoldList]);

  useEffect(() => {
    const productDetails = products.find(
      (val) => val.pro_id === addFormData.selectedProduct
    );
    console.log(productDetails);
    if (productDetails?.calculation_based_on === 4) {
      setIsMrpItem(true);
      formValues.grossWeight = 0;
    } else {
      setIsMrpItem(false);
    }
  }, [addFormData?.selectedProduct]);

  useEffect(() => {
    if (filterValues?.selectBranch) {
      const getStockDetails = async () => {
        if (filterValues?.selectBranch !== null && StockTransferEdit === 2) {
          try {
            await dispatch(getNonTagStock(filterValues?.selectBranch)).unwrap();
          } catch (error) {
            console.error(error);
          }
        }
        if (filterValues?.selectBranch !== null && StockTransferEdit === 3) {
          let postData = {
            branch: filterValues?.selectBranch,
            metal: metal,
            from_date: moment(selectedDates.startDate).format("YYYY-MM-DD"),
            to_date: moment(selectedDates.endDate).format("YYYY-MM-DD"),
          };
          try {
            await dispatch(getOldMetalStock(postData)).unwrap();
          } catch (error) {
            console.error(error);
          }
        }
      };
      getStockDetails();
    }
  }, [
    dispatch,
    filterValues?.selectBranch,
    StockTransferEdit,
    selectedDates,
    metal,
  ]);

  useEffect(() => {
    setMaxGrossWeight("");
    setMaxPiece("");
    setIsStoneRestrict(false);
    setIsOtherMetalRestrict(false);

    if (StockTransferEdit === 2) {
      // Non Tag Items
      const salesItemData = prevData ? prevData : [];

      const totalSales = [...salesItemData]
        .filter(
          (item) =>
            item.selectedProduct === addFormData.selectedProduct &&
            item.selectedDesign === addFormData.selectedDesign &&
            (settings?.is_sub_design_req === "1"
              ? item.selectedSubDesign === addFormData.selectedSubDesign
              : true) &&
            (settings?.is_section_required === "1"
              ? item.selectedSection === addFormData.selectedSection
              : true)
        )
        .reduce(
          (sum, val) => {
            return {
              totalGrossWeight:
                parseFloat(sum.totalGrossWeight) + parseFloat(val.grossWeight),
              totalPieces: parseFloat(sum.totalPieces) + parseFloat(val.piece),
            };
          },
          { totalGrossWeight: 0, totalPieces: 0 }
        );

      let nonTagStockItems = nonTagStock.find(
        (val) =>
          val.id_product_id === addFormData.selectedProduct &&
          val.id_design_id === addFormData.selectedDesign &&
          (settings?.is_sub_design_req === "1"
            ? val.id_sub_design_id === addFormData.selectedSubDesign
            : true) &&
          (settings?.is_section_required === "1"
            ? val.section_id === addFormData.selectedSection
            : true)
      );
      if (nonTagStockItems) {
        let actualStockWeight = parseFloat(
          parseFloat(nonTagStockItems?.gross_wt) -
            parseFloat(totalSales.totalGrossWeight)
        ).toFixed(3);
        let actualStockPcs = parseFloat(
          parseFloat(nonTagStockItems?.pieces) -
            parseFloat(totalSales.totalPieces)
        );
        setMaxGrossWeight(actualStockWeight);
        setMaxPiece(actualStockPcs);
      } else {
        setMaxGrossWeight(0);
        setMaxPiece(0);
        addFormData.piece = 0;
      }
    }
  }, [addFormData, nonTagStock, prevData]);

  const handleDeleteTag = (index) => {
    const updatedFormData = [...filterTagList];
    updatedFormData.splice(index, 1);
    setFilterTagList(updatedFormData);
  };
  const handleDeleteNonTag = (index) => {
    const updatedFormData = [...prevData];
    updatedFormData.splice(index, 1);
    setPrevData(updatedFormData);
  };

  const reset_form = async () => {
    reset("");
    setPrevData([]);
    setFilterTagList([]);
    setAddFormData(initialAddFormData);
    setFilterValues(filterValuesDefalut);
    setScaleWeight("");
  };

  useEffect(() => {
    if (filterValues.tagCode.length > 5 && filterValues.tagCode !== "") {
      searchTag();
    }
  }, [filterValues.tagCode]);

  useEffect(() => {
    if (filterValues.oldTagCode.length > 5 && filterValues.oldTagCode !== "") {
      searchTag();
    }
  }, [filterValues.oldTagCode]);

  const searchTag = () => {
    try {
      dispatch(
        getTagFilterdedData({
          filter_details: {
            tag_code: filterValues.tagCode.trim(),
            old_tag_code: filterValues.oldTagCode.trim(),
            tag_current_branch: filterValues.selectBranch,
            tag_product_id: filterValues.selectedProduct,
            tag_design_id: filterValues.selectedDesign,
            tag_sub_design_id: filterValues.selectedSubDesign,
            tag_purity_id: filterValues.selectedPurity,
          },
          custom_filter_details: {
            tagDateFrom: filterValues.tagDateFrom,
            tagDateTo: filterValues.tagDateTo,
            lotId: filterValues.lotId,
            tag_current_branch: filterValues.selectBranch,
          },
        })
      );
      handleFilterChange("tagCode", "");
      handleFilterChange("oldTagCode", "");
    } catch (error) {
      console.error(error);
    }

    // filterValues.tagCode = "";
  };

  const updateOption = {
    UpdateTag: { label: "Tagged Item", stock_transfer_edit: 1 },
    UpdateNonTag: { label: "Non Tag", stock_transfer_edit: 2 },
    UpdateOldMet: { label: "Old Metal", stock_transfer_edit: 3 },
    UpdateSalRet: { label: "Sales Return", stock_transfer_edit: 4 },
    UpdateParSal: { label: "Partly Sale", stock_transfer_edit: 5 },
  };

  const resetDesign = () => {
    setFilterValues((prevValues) => ({ ...prevValues, selectedDesign: "" }));
  };

  const resetSubDesign = () => {
    setFilterValues((prevValues) => ({ ...prevValues, selectedSubDesign: "" }));
  };

  useEffect(() => {
    const net_weight = calculateNetWeight({
      gross_weight: addFormData.grossWeight,
      less_weight: addFormData.lessWeight,
    });
    if (parseFloat(net_weight) > 0) {
      setAddFormData((prevData) => ({ ...prevData, netWeight: net_weight }));
      setValue("netWeight", net_weight);
    }
    if (parseFloat(net_weight) < 0) {
      toastfunc("Net Weight Should Net less than");
    }
  }, [setValue, addFormData.grossWeight, addFormData]);

  const handleSetStoneDetails = (data) => {
    console.log("Stone", data);
    data.forEach((element) => {
      element.stone_pcs = element.piece;
      element.stone_wt = element.weight;
      element.stn_rate = element.stone_rate;
      element.stn_cost = element.stone_amount;
    });
    handleInputChange("StoneDetails", data);
  };

  const handleAddPreview = () => {
    if (StockTransferEdit == 1) {
      if (
        filterValues?.selectBranch === "" ||
        filterValues?.selectBranch === null
      ) {
        toastfunc("Please Select From Branch");
      } else if (
        (filterValues?.idBranchTo === "" ||
          filterValues?.idBranchTo === null) &&
        filterValues.transferTo == "1"
      ) {
        toastfunc("Please Select To Branch");
      } else if (filterValues.estNo && filterValues.estNo !== "") {
        dispatch(
          getTagEstimatedData({
            id_branch: filterValues.selectBranch,
            est_no: filterValues.estNo,
          })
        );
        handleFilterChange("estNo", "");
      } else if (
        (filterValues?.lotId === "" || filterValues?.lotId === null) &&
        (filterValues?.tagCode === "" || filterValues?.tagCode === null)
      ) {
        toastfunc("Please Select Lot or Tag");
      } else {
        searchTag();
        let data = filterTagList?.filter((tag) => tag.isChecked === true);
        if (data.length) setPrevData((prevData) => [...prevData, data]);
      }
    }
    if (StockTransferEdit == 2) {
      if (
        filterValues?.selectBranch === "" ||
        filterValues?.selectBranch === null
      ) {
        toastfunc("Please Select From Branch");
      } else if (
        (filterValues?.idBranchTo === "" ||
          filterValues?.idBranchTo === null) &&
        filterValues.transferTo == "1"
      ) {
        toastfunc("Please Select To Branch");
      } else if (
        addFormData?.selectedProduct === "" ||
        filterValues?.selectedProduct === null
      ) {
        toastfunc("Please Select Product");
      } else if (
        addFormData?.selectedDesign === "" ||
        filterValues?.selectedDesign === null
      ) {
        toastfunc("Please Select Design");
      } else if (
        (addFormData?.selectedSubDesign === "" ||
          filterValues?.selectedSubDesign === null) &&
        settings?.is_sub_design_req === "1"
      ) {
        toastfunc("Please Select Sub Design");
      } else if (addFormData?.piece === "" || addFormData?.piece === null) {
        toastfunc("Please Enter Piece");
      } else if (
        !isMrpItem &&
        (addFormData?.grossWeight === "" ||
          addFormData?.grossWeight === null ||
          addFormData?.grossWeight <= 0)
      ) {
        toastfunc("Please Enter Gross Weight");
      } else if (
        addFormData?.netWeight === "" ||
        addFormData?.netWeight === null
      ) {
        toastfunc("Please Enter Net Weight");
      } else {
        const product = products.find(
          (val) => val.pro_id === addFormData.selectedProduct
        );
        const design = designs.find(
          (val) => val.id_design === addFormData.selectedDesign
        );
        const subDesign = subDesigns.find(
          (val) => val.id_sub_design === addFormData.selectedSubDesign
        );
        const sectionDetails = sections.find(
          (val) => val.id_section === addFormData.selectedSection
        );
        console.log("sectionDetails", sectionDetails);
        let newitem = {
          ...addFormData,
          productName: product.product_name,
          designName: design?.design_name,
          subDesignName: subDesign?.sub_design_name,
          sectionName: sectionDetails?.section_name,
        };

        console.log(newitem);

        setPrevData([newitem, ...prevData]);

        setAddFormData(initialAddFormData);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setAddFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  var totalPiece = filterTagList?.reduce(
    (sum, obj) =>
      sum + (obj?.tag_pcs != null || undefined ? parseFloat(obj?.tag_pcs) : 0),
    0
  );

  const totalGrsWt = filterTagList?.reduce(
    (sum, obj) =>
      sum + (obj?.tag_gwt != null || undefined ? parseFloat(obj?.tag_gwt) : 0),
    0
  );

  useEffect(() => {
    if (scaleWeight && scaleWeight > 0 && filterValues.transferTo == 2) {
      let calcGwt = parseFloat(totalGrsWt) - parseFloat(scaleWeight);
      setNetTotalGrossWt(calcGwt.toFixed(2));
    }
    else{
      setNetTotalGrossWt(totalGrsWt.toFixed(2));
    }
  }, [filterValues.transferTo, scaleWeight, totalGrsWt]);

  // const totalGrsWt = filterTagList?.reduce(
  //   (sum, obj) =>
  //     sum +
  //     ((parseFloat(obj?.tag_gwt) || 0),
  //   0
  // );

  var totalLessWt = filterTagList?.reduce(
    (sum, obj) =>
      sum + (obj?.tag_lwt != null || undefined ? parseFloat(obj?.tag_lwt) : 0),
    0
  );

  var totalStWt = filterTagList?.reduce(
    (sum, obj) =>
      sum +
      (obj?.tag_stn_wt != null || undefined ? parseFloat(obj?.tag_stn_wt) : 0),
    0
  );

  var totalNetWt = filterTagList?.reduce(
    (sum, obj) =>
      sum + (obj?.tag_nwt != null || undefined ? parseFloat(obj?.tag_nwt) : 0),
    0
  );

  var totalDiaWt = filterTagList?.reduce(
    (sum, obj) =>
      sum +
      (obj?.tag_dia_wt != null || undefined ? parseFloat(obj?.tag_dia_wt) : 0),
    0
  );

  var totalNonTagPiece = prevData?.reduce(
    (sum, obj) =>
      sum + (obj?.piece != null || undefined ? parseFloat(obj?.piece) : 0),
    0
  );

  const totalNonTagGrsWt = prevData?.reduce(
    (sum, obj) =>
      sum +
      (obj?.grossWeight != null || undefined
        ? parseFloat(obj?.grossWeight)
        : 0),
    0
  );

   useEffect(() => {
    if (scaleWeight && scaleWeight > 0 && filterValues.transferTo == 2) {
      let calcGwt = parseFloat(totalNonTagGrsWt) - parseFloat(scaleWeight);
      setNetNonTagTotalGrossWt(calcGwt.toFixed(2));
    }
    else{
      setNetNonTagTotalGrossWt(totalNonTagGrsWt.toFixed(2));
    }
  }, [filterValues.transferTo, scaleWeight, totalNonTagGrsWt]);

  // const totalNonTagGrsWt = prevData?.reduce(
  //   (sum, obj) =>
  //     sum +
  //     ((parseFloat(obj?.grossWeight) || 0) -
  //       (parseFloat(obj?.scaleWeight) || 0)),
  //   0
  // );

  var totalNonTagLessWt = prevData?.reduce(
    (sum, obj) =>
      sum +
      (obj?.lessWeight != null || undefined ? parseFloat(obj?.lessWeight) : 0),
    0
  );
  var totalNonTagNetWt = prevData?.reduce(
    (sum, obj) =>
      sum +
      (obj?.netWeight != null || undefined ? parseFloat(obj?.netWeight) : 0),
    0
  );

  var totalNonTagPureWt = prevData?.reduce(
    (sum, obj) =>
      sum + (obj?.pureWt != null || undefined ? parseFloat(obj?.pureWt) : 0),
    0
  );

  useEffect(() => {
    const socket = io("http://localhost:7000", {
      transports: ["websocket"],
      secure: true,
      reconnectionAttempts: 5,
      timeout: 5000,
      // path: "/",
    }); // Connect to Flask WebSocket

    // Listen for weight updates
    socket.on("weight-update", (data) => {
      // console.log("Received Weight:", data.weight);
      // setWeight(data.weight);
      let weight = data.weight;
      let [numericValue, unit] = weight.replace("ST,", "").split(",");
      numericValue = parseFloat(numericValue);
      if (
        parseFloat(numericValue) > 0 &&
        parseFloat(numericValue) != parseFloat(scaleWeight)
      ) {
        setScaleWeight(numericValue);
        setValue("scaleWeight", numericValue);
        clearErrors("scaleWeight");
      }
      console.log("SOcket Data:", data);
    });

    return () => socket.disconnect(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/inventory/stock_transfer/list`);
    }
  }, [add, id, navigate]);

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      onClickSave();
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  console.log(scaleWeight);

  return (
    <React.Fragment>
      <Head title="Stock Transfer " />
      <Content>
        <PreviewCard className="h-100">
          <FormProvider {...methods}>
            <Row
              lg={12}
              className={"form-control-sm"}
              style={{ marginTop: "10px" }}
            >
              <Col md={9}>
                <ModifiedBreadcrumb />
              </Col>

              <Col md={3} className="text-right">
                <Button
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/inventory/stock_transfer/list`
                    )
                  }
                >
                  Cancel
                </Button>{" "}
                <Button
                  color="primary"
                  disabled={issubmitting}
                  size="md"
                  onClick={onClickSave}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </Button>
              </Col>
            </Row>

            <Row lg={12} className={"form-control-sm"}>
              <Col md={4}>
                <div className="custom-grid">
                  {" "}
                  <div className="form-label">Choose Transfer Type </div>
                  <div
                    className=""
                    style={{ maxHeight: "500px", overflowY: "auto" }}
                  >
                    <ul className="custom-control-group custom-control-vertical w-100">
                      {Object.entries(updateOption)?.map(([key, option]) => (
                        <li key={key}>
                          <div className="custom-control custom-control-sm custom-radio custom-control-pro">
                            <input
                              type="radio"
                              className="custom-control-input"
                              name="stock_transfer_edit"
                              id={key}
                              checked={
                                option.stock_transfer_edit === StockTransferEdit
                                  ? true
                                  : false
                              }
                              {...register(key, { required: false })}
                              onChange={() => {
                                handleChange(key, option.stock_transfer_edit);
                              }}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor={key}
                            >
                              <span>{option.label}</span>
                            </label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="custom-grid">
                  <div className="form-label">Filters :</div>
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Transfer To
                        </label>
                      </div>
                    </Col>
                    <Col md="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="Branch"
                                type="radio"
                                name={"transferTo"}
                                value={"1"}
                                className="custom-control-input"
                                checked={filterValues.transferTo == "1"}
                                onChange={(e) => {
                                  setValue(e.target.value);
                                  handleFilterChange(
                                    "transferTo",
                                    e.target.value
                                  );
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="Branch"
                              >
                                Branch
                              </label>
                            </div>
                          </li>

                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="Others"
                                type="radio"
                                value={"2"}
                                name={"transferTo"}
                                className="custom-control-input "
                                checked={filterValues.transferTo == "2"}
                                onChange={(e) => {
                                  setValue(e.target.value);
                                  handleFilterChange(
                                    "transferTo",
                                    e.target.value
                                  );
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="Others"
                              >
                                Others
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          From Branch
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <BranchDropdown
                        register={register}
                        id={"idBranch"}
                        branches={branches}
                        selectedBranch={filterValues?.selectBranch}
                        onBranchChange={(value) => {
                          handleFilterChange("selectBranch", value);
                          let tobranch = branches.filter(
                            (item) => item.id_branch != value
                          );
                          setToBranches(tobranch);
                          handleFilterChange("idBranchTo", "");
                          setValue("idBranchTo", "");
                        }}
                        isRequired={false}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        message={errors.branch && "Branch is Required"}
                      />
                    </Col>
                  </Row>
                  {filterValues.transferTo == 1 && (
                    <Row className="form-group row g-4">
                      <Col md="4">
                        <div className="form-group">
                          <label className="form-label" htmlFor="site-name">
                            To Branch
                            <IsRequired />
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <BranchDropdown
                          register={register}
                          id={"idBranchTo"}
                          branches={toBranches}
                          selectedBranch={filterValues?.idBranchTo}
                          onBranchChange={(value) => {
                            handleFilterChange("idBranchTo", value);
                          }}
                          isRequired={false}
                          clearErrors={clearErrors}
                          setValue={setValue}
                          message={errors.branch && "idBranchTo is Required"}
                        />
                      </Col>
                    </Row>
                  )}

                  {filterValues.transferTo == 2 && (
                    <>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="site-name">
                              Issue Type
                              <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <StockIssueTypeDropdown
                            register={register}
                            id={"selectStockIssueType"}
                            stockIssueType={stockIssueType}
                            selectedStockIssueType={
                              filterValues?.selectStockIssueType
                            }
                            onStockIssueTypeChange={(value) => {
                              handleFilterChange("selectStockIssueType", value);
                            }}
                            isRequired={true}
                            clearErrors={clearErrors}
                            setValue={setValue}
                            message={
                              errors.selectStockIssueType &&
                              "Stock Issue Type is Required"
                            }
                          />
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="site-name">
                              Issue To
                              <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <SelectDropdown
                            register={register}
                            id={"selectStockIssueTo"}
                            data={[
                              { label: "Employee", value: 1 },
                              { label: "Customer", value: 2 },
                              { label: "Karigar", value: 3 },
                            ]}
                            selectedValue={filterValues?.selectStockIssueTo}
                            onChangeEvent={(value) => {
                              handleFilterChange("selectStockIssueTo", value);
                            }}
                            isRequired={true}
                            clearErrors={clearErrors}
                            setValue={setValue}
                            message={
                              errors.selectStockIssueTo &&
                              "Stock Issue To is Required"
                            }
                          />
                        </Col>
                      </Row>
                      {filterValues.selectStockIssueTo == 1 && (
                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="site-name">
                                Employee
                                <IsRequired />
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <ActiveEmployeeDropdown
                              register={register}
                              id={"selectStockIssueEmp"}
                              options={employees}
                              selectedEmployee={
                                filterValues?.selectStockIssueEmp
                              }
                              onEmployeeChange={(value) => {
                                handleFilterChange(
                                  "selectStockIssueEmp",
                                  value
                                );
                              }}
                              isRequired={true}
                              clearErrors={clearErrors}
                              setValue={setValue}
                              message={
                                errors.selectStockIssueEmp &&
                                "Stock Issue Employee is Required"
                              }
                            />
                          </Col>
                        </Row>
                      )}
                      {filterValues.selectStockIssueTo == 2 && (
                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="site-name">
                                Customer
                                <IsRequired />
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <Typeahead
                              id="customerSearch"
                              labelKey="label"
                              onChange={(e) => {
                                if (e?.length > 0) {
                                  SetCustomer(e[0]?.value),
                                    SetCustomerSearch(e);
                                } else {
                                  SetCustomer(null);
                                  SetCustomerSearch([]);
                                }
                              }}
                              options={searchCustomerList}
                              placeholder="Choose a customer..."
                              // defaultSelected={customerSearch}
                              selected={customerSearch}
                              onInputChange={(text) => {
                                if (text.length === 0) {
                                  SetCustomerSearch([]);
                                  setInputType(null);
                                  return;
                                }

                                const firstChar = text.charAt(0);
                                if (!inputType) {
                                  setInputType(
                                    /\d/.test(firstChar) ? "number" : "text"
                                  );
                                }

                                if (
                                  (inputType === "number" &&
                                    /^\d*$/.test(text)) ||
                                  (inputType === "text" &&
                                    /^[a-zA-Z\s]*$/.test(text))
                                ) {
                                  setIsSearching(text.length >= 5);
                                  SetCustomerSearch([{ label: text }]);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (
                                  inputType === "number" &&
                                  !/\d/.test(e.key)
                                ) {
                                  if (
                                    ![
                                      "Backspace",
                                      "Delete",
                                      "ArrowLeft",
                                      "ArrowRight",
                                    ].includes(e.key)
                                  ) {
                                    e.preventDefault(); // Prevent letters but allow backspace, delete, and arrows
                                  }
                                }
                                if (inputType === "text" && /\d/.test(e.key)) {
                                  e.preventDefault(); // Prevent typing numbers if inputType is text
                                }
                              }}
                            />
                          </Col>
                        </Row>
                      )}
                      {filterValues.selectStockIssueTo == 3 && (
                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="site-name">
                                Karigar
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <SupplierDropdown
                              register={register}
                              isRequired={true}
                              id={"selectSupplier"}
                              selectedSupplier={filterValues?.selectSupplier}
                              supplier={supplier}
                              setValue={setValue}
                              onSupplierChange={(value) => {
                                handleFilterChange("selectSupplier", value);
                              }}
                              clearErrors={clearErrors}
                              placeholder={"selectSupplier"}
                            ></SupplierDropdown>
                          </Col>
                        </Row>
                      )}
                    </>
                  )}
                  {StockTransferEdit == 1 && (
                    <Row className="form-group row g-4">
                      <Col md="4">
                        <div className="form-group">
                          <label className="form-label" htmlFor="site-name">
                            Tag Code
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <TextInputField
                          register={register}
                          placeholder="Tag Code"
                          id={"tagCode"}
                          value={filterValues.tagCode}
                          isRequired={false}
                          type={"text"}
                          setValue={setValue}
                          SetValue={(value) => {
                            handleFilterChange("tagCode", value);
                            clearErrors("tagCode");
                          }}
                          message={errors.tagCode && errors.tagCode.message}
                        />
                      </Col>
                    </Row>
                  )}
                  {StockTransferEdit == 1 && (
                    <Row className="form-group row g-4">
                      <Col md="4">
                        <div className="form-group">
                          <label className="form-label" htmlFor="site-name">
                            Old Tag Code
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <TextInputField
                          register={register}
                          placeholder="Old Tag Code"
                          id={"oldTagCode"}
                          value={filterValues.oldTagCode}
                          isRequired={false}
                          type={"text"}
                          setValue={setValue}
                          SetValue={(value) => {
                            handleFilterChange("oldTagCode", value);
                            clearErrors("oldTagCode");
                          }}
                          message={
                            errors.oldTagCode && errors.oldTagCode.message
                          }
                        />
                      </Col>
                    </Row>
                  )}
                  {StockTransferEdit == 1 && (
                    <Row className="form-group row g-4">
                      <Col md="4">
                        <div className="form-group">
                          <label className="form-label" htmlFor="site-name">
                            Est No
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <TextInputField
                          register={register}
                          placeholder="Estimation No"
                          id={"estNo"}
                          value={filterValues.estNo}
                          isRequired={false}
                          type={"text"}
                          setValue={setValue}
                          SetValue={(value) => {
                            handleFilterChange("estNo", value);
                            clearErrors("estNo");
                          }}
                          message={errors.estNo && errors.estNo.message}
                        />
                      </Col>
                    </Row>
                  )}
                  {StockTransferEdit == 1 && (
                    <Row className="form-group row g-4">
                      <Col md="4">
                        <div className="form-group">
                          <label className="form-label" htmlFor="site-name">
                            Lot No
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <LotDropdown
                          register={register}
                          id={"lotId"}
                          lot={lot}
                          selectedLot={filterValues.lotId}
                          onLotChange={(value) => {
                            handleFilterChange("lotId", value);
                          }}
                          isRequired={false}
                          clearErrors={clearErrors}
                          setValue={setValue}
                          message={errors.lotId && "Lot is Required"}
                        />
                      </Col>
                    </Row>
                  )}
                  {(StockTransferEdit == 3 ||
                    StockTransferEdit == 4 ||
                    StockTransferEdit == 5) && (
                    <>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="site-name">
                              Filter Date
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <DateRangePickerInput
                            startDate={selectedDates?.startDate}
                            endDate={selectedDates?.endDate}
                            onChange={handleDateChange}
                          />
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="site-name">
                              Metal
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <MetalDropdown
                            register={register}
                            id={"metal"}
                            metals={metals}
                            selectedMetal={metal}
                            onMetalChange={SetMetal}
                            isRequired={true}
                            clearErrors={clearErrors}
                            setValue={setValue}
                            placeholder={"Metal"}
                            message={errors.metal && "Metal is Required"}
                          />
                        </Col>
                      </Row>
                    </>
                  )}

                  {filterValues.transferTo == 2 && (
                    <>
                      {userInfo?.settings
                        ?.show_scale_weight_in_stock_transfer === "1" && (
                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="site-name">
                                Scale Weight (g)
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <NumberInputField
                              register={register}
                              placeholder="Scale Weight (g)"
                              id={"scaleWeight"}
                              value={scaleWeight}
                              min={0}
                              setValue={setValue}
                              SetValue={(value) => {
                                setScaleWeight(value);
                                clearErrors("scaleWeight");
                              }}
                              reqValueError={"Scale Weight is Required"}
                              message={
                                errors.scaleWeight && errors.scaleWeight.message
                              }
                              tabIndex={9}
                            />
                          </Col>
                        </Row>
                      )}
                    </>
                  )}
                </div>
              </Col>
              {StockTransferEdit == 2 && (
                <Col md={4}>
                  <div className="custom-grid">
                    <>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="site-name">
                              Product
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <ProductDropdown
                            register={register}
                            products={products}
                            id="selectedProduct"
                            selectedProduct={addFormData?.selectedProduct}
                            onProductChange={(e) => {
                              handleInputChange("selectedProduct", e);
                              resetDesign();
                              resetSubDesign();
                            }}
                            isRequired={false}
                            clearErrors={clearErrors}
                            setValue={setValue}
                            message={
                              errors.selectedProduct && "Product is Required"
                            }
                          ></ProductDropdown>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="site-name">
                              Design
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <DesignDropdown
                            register={register}
                            id={"selectedDesign"}
                            designs={designs}
                            selectedProduct={addFormData?.selectedProduct}
                            selectedDesign={addFormData?.selectedDesign}
                            onDesignChange={(e) => {
                              handleInputChange("selectedDesign", e);
                              resetSubDesign();
                            }}
                            isRequired={false}
                            clearErrors={clearErrors}
                            setValue={setValue}
                            message={
                              errors.selectedDesign && "Design is Required"
                            }
                          ></DesignDropdown>
                        </Col>
                      </Row>
                      {settings?.is_sub_design_req === "1" && (
                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="site-name">
                                Sub Design
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <SubDesignDropdown
                              register={register}
                              id={"selectedSubDesign"}
                              subDesigns={subDesigns}
                              products={products}
                              designs={designs}
                              selectedProduct={addFormData?.selectedProduct}
                              selectedDesign={addFormData?.selectedDesign}
                              selectedSubDesign={addFormData?.selectedSubDesign}
                              onSubDesignChange={(e) => {
                                handleInputChange("selectedSubDesign", e);
                              }}
                              isRequired={false}
                              clearErrors={clearErrors}
                              setValue={setValue}
                              message={
                                errors.selectedSubDesign &&
                                "Sub Design is Required"
                              }
                            ></SubDesignDropdown>
                          </Col>
                        </Row>
                      )}
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="site-name">
                              Piece
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <NumberInputField
                            register={register}
                            placeholder="Pcs"
                            id={"piece"}
                            value={addFormData?.piece}
                            isRequired={true}
                            min={1}
                            max={maxPiece !== "" ? maxPiece : ""}
                            setValue={setValue}
                            handleDot={true}
                            handleKeyDownEvents={true}
                            SetValue={(value) => {
                              handleInputChange("piece", value);
                              clearErrors("piece");
                            }}
                            minError={
                              "Pieces Should greater than or equal to 0"
                            }
                            maxError={"Pieces Should greater than or equal to "}
                            reqValueError={"Pieces is Required"}
                            message={errors.piece && "Pieces is Required"}
                          ></NumberInputField>
                          {maxPiece !== "" ? (
                            <span>Available Piece :{maxPiece}</span>
                          ) : (
                            ""
                          )}
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="site-name">
                              Gross Wt
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <InputFieldWithDropdown
                            register={register}
                            placeholder="Gross weight"
                            id={"grossWeight"}
                            min={!isMrpItem ? 1 : 0}
                            max={maxGrossWeight ? maxGrossWeight : ""}
                            value={addFormData?.grossWeight}
                            type={"number"}
                            handleKeyDownEvents={true}
                            handleDecimalDigits={true}
                            decimalValues={3}
                            setValue={setValue}
                            SetValue={(value) => {
                              handleInputChange("grossWeight", value);
                              clearErrors("grossWeight");
                            }}
                            optionId={"uomId"}
                            name={"uomId"}
                            options={UomOptions}
                            onDropDownChange={(value) => {
                              handleInputChange("uomId", value);
                            }}
                            selectedOption={addFormData.uomId}
                            minError={
                              "Gross weight should Greater than or equal to 0"
                            }
                            maxError={"Gross Weight Less than or equal to "}
                            requiredMessage={"Gross weight is Required"}
                            message={
                              errors.grossWeight && "Gross Weight is Required"
                            }
                          ></InputFieldWithDropdown>
                          {maxGrossWeight !== "" ? (
                            <span>Available Gwt : {maxGrossWeight}</span>
                          ) : (
                            ""
                          )}
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="site-name">
                              Less Wt
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <LessWeightInputField
                            register={register}
                            placeholder="Less Weight"
                            id={"lessWeight"}
                            value={addFormData.lessWeight}
                            isRequired={false}
                            min={0}
                            uom={uom}
                            setValue={setValue}
                            gross_weight={addFormData.grossWeight}
                            less_weight={addFormData.lessWeight}
                            SetValue={(value) =>
                              handleInputChange("lessWeight", value)
                            }
                            SetStnWeight={(value) =>
                              handleInputChange("stnWeight", value)
                            }
                            SetDiaWeight={(value) =>
                              handleInputChange("diaWeight", value)
                            }
                            SetStoneDetails={handleSetStoneDetails}
                            stone={stone}
                            quality_code={quality_code}
                          ></LessWeightInputField>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="site-name">
                              Net Wt
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <NumberInputField
                            register={register}
                            id="netWeight"
                            placeholder="Net Weight"
                            value={addFormData.netWeight}
                            isRequired={false}
                            readOnly
                            min={0}
                            setValue={setValue}
                            SetValue={(value) =>
                              handleInputChange("netWeight", value)
                            }
                            minError="Net weight must be greater than 0"
                            reqValueError="Net weight is Required"
                            message={
                              errors.netWeight && "net weight is required"
                            }
                          />
                        </Col>
                      </Row>
                      {settings?.is_section_required === "1" && (
                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="site-name">
                                Section
                                {settings?.is_section_required && (
                                  <IsRequired />
                                )}
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <SectionDropdown
                              isMulti={false}
                              register={register}
                              isRequired={settings?.is_section_required}
                              id={"selectedSection"}
                              placeholder="Section"
                              value={addFormData?.selectedSection}
                              selectedSection={addFormData?.selectedSection}
                              selectedProduct={addFormData?.selectedProduct}
                              optionLabel="Select Section"
                              sectionOptions={sections}
                              setValue={setValue}
                              clearErrors={clearErrors}
                              onSectionChange={(e) => {
                                handleInputChange("selectedSection", e);
                                clearErrors("selectedSection");
                              }}
                              message={
                                errors.selectedSection && "Section is Required"
                              }
                            />
                          </Col>
                        </Row>
                      )}
                    </>
                  </div>
                </Col>
              )}
            </Row>

            <Row lg={12} className={"form-control-sm"}>
              <Col md={6}>
                <div className="form-group " style={{ display: "flex" }}>
                  <div className="form-group">
                    <label className="form-label">Remarks :</label>
                  </div>
                  &nbsp;&nbsp;
                  <div className="form-control-wrap">
                    <textarea
                      style={{ width: "100%" }}
                      className="form-control form-control-sm"
                      type="text"
                      value={filterValues?.remarks}
                      onChange={(e) => {
                        handleFilterChange("remarks", e.target.value);
                      }}
                    />
                  </div>
                </div>
              </Col>

              <Col md={6}>
                <div
                  className="form-group action_button "
                  style={{ display: "flex" }}
                >
                  &nbsp;
                  <SaveButton
                    disabled={issubmitting}
                    size="md"
                    color="primary"
                    tabIndex={17}
                    onClick={handleAddPreview}
                  >
                    Add to Preview
                  </SaveButton>
                </div>
              </Col>
            </Row>

            <Row className="form-group row g-4" style={{ marginTop: "20px" }}>
              <Col md={12}>
                <Row md={12}></Row>
                {StockTransferEdit == 3 && (
                  <Row md={12}>
                    <span style={{ fontWeight: "bold" }}>
                      Old Metal Details
                    </span>
                    <div
                      className="table-responsive"
                      style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                      <table className="table table-bordered">
                        <thead>
                          {StockTransferEdit == 3 && (
                            <tr>
                              <th>S.NO</th>
                              <th>Invoice No</th>
                              <th>Product</th>
                              <th>Item Type</th>
                              <th>Piece</th>
                              <th>Gwt</th>
                              <th>Lwt</th>
                              <th>Nwt</th>
                              <th>Va</th>
                              <th>Touch</th>
                              <th>Pure</th>
                              <th>Action</th>
                            </tr>
                          )}
                        </thead>
                        <tbody>
                          {oldMetalList?.list?.map((item, rowIndex) => (
                            <tr key={rowIndex}>
                              <td>{rowIndex + 1} </td>
                              <td>{item?.invoice_no}</td>
                              <td>{item?.productName}</td>
                              <td>{item?.itemType}</td>
                              <td style={{ textAlign: "right" }}>
                                {" "}
                                {item.piece}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {item.grossWeight}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {item.lessWeight}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {item.netWeight}
                              </td>
                              <td style={{ textAlign: "right" }}>{item.va}</td>
                              <td style={{ textAlign: "right" }}>
                                {item.touch}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {item.pureWt}
                              </td>
                              <td>
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="btn-icon btn-white btn-dim"
                                  onClick={() => handleDeleteNonTag()}
                                >
                                  <Icon name="trash-fill" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot></tfoot>
                      </table>
                    </div>
                  </Row>
                )}
                <Row md={12}>
                  <div
                    className="table-responsive "
                    style={{ maxHeight: "400px", overflowY: "auto" }}
                  >
                    <span style={{ fontWeight: "bold" }}>Preview Details</span>
                    <table className="table table-bordered">
                      <thead>
                        {StockTransferEdit == 1 && (
                          <tr>
                            {/* <th></th> */}
                            <th>S.NO</th>
                            <th>Tag Code</th>
                            <th>Product</th>
                            <th>Design</th>
                            <th>S.Design</th>
                            <th>Purity</th>
                            <th>Piece</th>
                            <th>Gwt</th>
                            <th>Lwt</th>
                            <th>Nwt</th>
                            <th>Stn Wt</th>
                            <th>Dia Wt</th>
                            <th>Action</th>
                          </tr>
                        )}
                        {StockTransferEdit == 2 && (
                          <tr>
                            <th>S.NO</th>
                            <th>Product</th>
                            <th>Design</th>
                            {settings?.is_sub_design_req === "1" && (
                              <th>S.Design</th>
                            )}
                            {settings?.is_section_required === "1" && (
                              <th>Section</th>
                            )}
                            <th>Piece</th>
                            <th>Gwt</th>
                            <th>Lwt</th>
                            <th>Nwt</th>
                            <th>Action</th>
                          </tr>
                        )}
                        {StockTransferEdit == 3 && (
                          <tr>
                            <th>S.NO</th>
                            <th>Invoice No</th>
                            <th>Product</th>
                            <th>Item Type</th>
                            <th>Piece</th>
                            <th>Gwt</th>
                            <th>Lwt</th>
                            <th>Nwt</th>
                            <th>Va</th>
                            <th>Touch</th>
                            <th>Pure</th>
                            <th>Action</th>
                          </tr>
                        )}
                      </thead>
                      <tbody>
                        {StockTransferEdit == 1 &&
                          filterTagList?.map((item, rowIndex) => (
                            <tr key={rowIndex}>
                              {/* <td >
                                                                <input type="checkbox" style={{ cursor: "pointer" }}
                                                                    onChange={(event) => {
                                                                        handleFormChange(rowIndex, 'isChecked', event.target.checked)
                                                                    }}
                                                                    checked={item.isChecked}
                                                                />
                                                            </td> */}
                              <td>{rowIndex + 1} </td>
                              <td>{item.tag_code}</td>
                              <td>{item.product_name}</td>
                              <td>{item.design_name}</td>
                              <td>{item.sub_design_name}</td>
                              <td>{item.tag_purity}</td>
                              <td style={{ textAlign: "right" }}>
                                {" "}
                                {item.tag_pcs}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {item.tag_gwt}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {item.tag_lwt}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {item.tag_nwt}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {item.tag_stn_wt}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {item.tag_dia_wt}
                              </td>
                              <td>
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="btn-icon btn-white btn-dim"
                                  onClick={() => handleDeleteTag()}
                                >
                                  <Icon name="trash-fill" />
                                </Button>
                              </td>
                            </tr>
                          ))}

                        {StockTransferEdit == 2 &&
                          prevData?.map((item, rowIndex) => (
                            <tr key={rowIndex}>
                              <td>{rowIndex + 1} </td>
                              <td>{item?.productName}</td>
                              <td>{item?.designName}</td>
                              {settings?.is_sub_design_req === "1" && (
                                <td>{item.subDesignName}</td>
                              )}
                              {settings?.is_section_required === "1" && (
                                <td>{item?.sectionName}</td>
                              )}
                              <td style={{ textAlign: "right" }}>
                                {" "}
                                {item.piece}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {parseFloat(item.grossWeight).toFixed(3)}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {parseFloat(item.lessWeight).toFixed(3)}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {parseFloat(item.netWeight).toFixed(3)}
                              </td>
                              <td>
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="btn-icon btn-white btn-dim"
                                  onClick={() => handleDeleteNonTag()}
                                >
                                  <Icon name="trash-fill" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        {StockTransferEdit == 3 &&
                          prevData?.map((item, rowIndex) => (
                            <tr key={rowIndex}>
                              <td>{rowIndex + 1} </td>
                              <td>{item?.invoice_no}</td>
                              <td>{item?.productName}</td>
                              <td>{item?.itemType}</td>
                              <td style={{ textAlign: "right" }}>
                                {" "}
                                {item.piece}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {item.grossWeight}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {item.lessWeight}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {item.netWeight}
                              </td>
                              <td style={{ textAlign: "right" }}>{item.va}</td>
                              <td style={{ textAlign: "right" }}>
                                {item.touch}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {item.pureWt}
                              </td>
                              <td>
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="btn-icon btn-white btn-dim"
                                  onClick={() => handleDeleteNonTag()}
                                >
                                  <Icon name="trash-fill" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                      <tfoot>
                        {StockTransferEdit == 1 && (
                          <tr style={{ fontWeight: "bold" }}>
                            <td>Total</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style={{ textAlign: "right" }}>{totalPiece}</td>
                            <td style={{ textAlign: "right" }}>
                              {parseFloat(netTotalGrossWt).toFixed(3)}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {parseFloat(totalLessWt).toFixed(3)}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {parseFloat(totalNetWt).toFixed(3)}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {parseFloat(totalStWt).toFixed(3)}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {parseFloat(totalDiaWt).toFixed(3)}
                            </td>
                            <td></td>
                          </tr>
                        )}
                        {StockTransferEdit == 2 && (
                          <tr style={{ fontWeight: "bold" }}>
                            <td>Total</td>
                            <td></td>
                            <td></td>
                            {settings?.is_sub_design_req === "1" && <td></td>}
                            {settings?.is_section_required === "1" && <td></td>}
                            <td style={{ textAlign: "right" }}>
                              {totalNonTagPiece}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {parseFloat(netNonTagTotalGrossWt).toFixed(3)}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {parseFloat(totalNonTagLessWt).toFixed(3)}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {parseFloat(totalNonTagNetWt).toFixed(3)}
                            </td>
                          </tr>
                        )}

                        {StockTransferEdit == 3 && (
                          <tr style={{ fontWeight: "bold" }}>
                            <td>Total</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style={{ textAlign: "right" }}>
                              {totalNonTagPiece}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {parseFloat(totalNonTagGrsWt).toFixed(3)}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {parseFloat(totalNonTagLessWt).toFixed(3)}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              {parseFloat(totalNonTagNetWt).toFixed(3)}
                            </td>
                            <td></td>
                            <td></td>
                            <td style={{ textAlign: "right" }}>
                              {parseFloat(totalNonTagPureWt).toFixed(3)}
                            </td>
                          </tr>
                        )}
                      </tfoot>
                    </table>
                  </div>
                </Row>
              </Col>
            </Row>
          </FormProvider>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default StockTransferForm;
