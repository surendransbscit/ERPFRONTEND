import React, { useEffect, useState, useRef } from "react";
import Head from "../../layout/head/Head";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Col,
  Row,
  PreviewCard,
  SaveButton,
  Icon,
} from "../../components/Component";
import {
  DateInputField,
  InputFieldWithDropdown,
  InputGroupField,
  NumberInputField,
  TextInputField,
} from "../../components/form-control/InputGroup";
import Content from "../../layout/content/Content";
import "../../assets/css/sales_form.css";
import "../../assets/css/datatable.css";
import {
  BranchDropdown,
  ProductDropdown,
  SupplierDropdown,
} from "../../components/filters/retailFilters";
import {
  useCategories,
  usePurities,
  useProducts,
  useDesigns,
  useSubDesigns,
  useUom,
  useSupplierFilter,
  useBranches,
  useProductSections,
  useTaxGroup,
  useMetalPurityRate,
  useMcVaSetiings,
  useDiamondRate,
  useStone,
  useQualityCode,
} from "../../components/filters/filterHooks";
import IsRequired from "../../components/erp-required/erp-required";
import { Button, Label } from "reactstrap";
import LessWeightInputField from "../../components/form-control/LessWeight";
import usePurchaseEntryFormHandling from "./usePurchaseEntryFormHandling";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import DeleteModal from "../../components/modals/DeleteModal";
import moment from "moment";
import {
  calculateNetWeight,
  calculatePurchaseCost,
  calculatePureWeight,
  calculateWastageWeight
} from "../../components/common/calculations/ErpCalculations";
import { toastfunc } from "../../components/sds-toast-style/toast-style";
import CurrencyDisplay from "../../components/common/moneyFormat/moneyFormat";
import { getTagDetailsByCode, getTagEstimatedData } from "../../redux/thunks/inventory";
import { useHotkeys } from "react-hotkeys-hook";
import {
  createPurchaseReturnEntry,
  getPurchaseReturnById,
  updatePurchaseReturnById,
} from "../../redux/thunks/purchase";

const PurchaseReturnForm = () => {
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
  } = useForm();
  const navigate = useNavigate();
  const { isLoading, purchaseReturnInfo } = useSelector(
    (state) => state.purchaseReturnReducer
  );
    const mcTypeOptions = [
    { label: "Per GM", value: 1, isDefault: true },
    { label: "Per Pcs", value: 2 },
  ];
  const {
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
  const { isLoading: issubmitting, tagList } = useSelector((state) => state.tagBulkEditReducer);
  const methods = useForm();
  const { products } = useProducts();
  const { uom } = useUom();
  const { supplier } = useSupplierFilter();
  const { branches } = useBranches();
  const { stone } = useStone();
  const { quality_code } = useQualityCode();
  const { taxGroup } = useTaxGroup();
  const { metalPurityRate } = useMetalPurityRate();
  const { diamondRate } = useDiamondRate();

  const dispatch = useDispatch();
  const [idBranch, setIdBranch] = useState("");
  const [idSupplier, setIdSupplier] = useState("");
  const [estNo, setEstNo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const lessWeightRef = useRef();
  let UomOptions = [];
  if (uom.length > 0) {
    UomOptions = uom.map((val) => ({
      value: val.uom_id,
      label: val.uom_name,
      isDefault: val.is_default,
    }));
  }
  // console.log(errors);

  let initialStateItemDetails = {
    type: 1,
    tag_id: "",
    tag_code: "",
    id_product: "",
    product_name: "",
    piece: "1",
    gross_wt: "",
    less_wt: 0,
    net_wt: "",
    uom_id: 1,
    touch: "",
    pure_wt: "",
    pure_calc_type: "2",
    rate_per_gram: 0,
    rate_calc_type: 1,
    tax_id: "",
    tax_type: "",
    tax_percentage: "",
    tax_amount: "",
    wastage_percentage: "",
    wastage_weight: "",
    mc_type: 1,
    mc_value: "",
    flat_mc: "",
    cgst: "",
    sgst: "",
    igst: "",
    item_cost: "",
    stone_details: [],
    total_mc: "",
  };
  const [itemDetails, setItemDetails] = useState([initialStateItemDetails]);

  let returnTypeOptions = [
    {
      label: "General",
      value: 1,
    },
    {
      label: "Tagged Item",
      value: 2,
    },
    {
      label: "Non Tagged Item",
      value: 3,
    },
  ];

  const PureCalcTypeOptions = [
    { label: "Touch+VA", value: 2, isDefault: true },
    { label: "Touch", value: 1 },
    { label: "Wt * VA %", value: 3 },
  ];

  const calcTypeOptions = [
    { label: "Per Gram", value: 1, isDefault: true },
    { label: "Per Piece", value: 2 },
  ];

  useEffect(() => {
    dispatch(getPurchaseReturnById({ id }));
  }, [id, dispatch]);

  useEffect(() => {
    if (purchaseReturnInfo !== null) {
      setIdBranch(purchaseReturnInfo?.branch);
      setIdSupplier(purchaseReturnInfo?.supplier);
      setItemDetails(purchaseReturnInfo?.item_details);
    }
  }, [purchaseReturnInfo]);

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/purchase/purchase_return/list`);
    }
  }, [add, id, navigate]);

  const handleFormChange = (index, field, value) => {
    setItemDetails((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;
      return updatedValues;
    });
  };

  const handleStoneDetails = (index, field, data) => {
    handleFormChange(index, field, data);
  };

  useEffect(() => {
    const updatedItemDetails = itemDetails.map((item) => {
      let taxType = "";
      let tax_id = "";
      let taxPercentage = "";
      let stone_details = item.stone_details;
      let wastageWeight = 0;
      if (item.id_product !== "") {
        const product = products.find((val) => val.pro_id === item.id_product);
        taxType = product.tax_type;
        tax_id = product.tax_id;
        taxPercentage = product.tax_percentage;
        wastageWeight = calculateWastageWeight({
        calculationType: product.wastage_calc_type,
        grossWeight: item.gross_wt,
        wastagePercentage: item.wastage_percentage,
        netWeight: item.net_wt,
      });
      }

      const net_wt = calculateNetWeight({
        gross_weight: item.gross_wt,
        less_weight: item.less_wt,
      });
      let pureWeight = calculatePureWeight({
        netWeight: item.net_wt,
        purchaseTouch: item.touch,
        purchaseWastage: item.wastage_percentage,
        pureCalcType: item.pure_calc_type,
      });


      const itemCostDetails = calculatePurchaseCost({
        pureWeight: item.pure_wt,
        purchaseMcType:item.mc_type,
        purchaseMc: item.mc_value,
        flatMcValue: item.flat_mc,
        purchaseRate: item.rate_per_gram,
        netWeight: item.net_wt,
        piece: item.piece,
        rateCalcType: 1,
        taxType: item.tax_type,
        taxPercentage: item.tax_percentage,
        otherMetalAmount: 0,
        stoneAmount: stone_details.reduce(
          (sum, item) => sum + parseFloat(item.stone_amount || 0),
          0
        ),
        grossWeight: item.gross_wt,
        settingsMcType: "",
        otherChargesAmount: 0,
      });

      // Only update if the net weight has changed
      return {
        ...item,
        net_wt: net_wt,
        pure_wt: pureWeight,
        tax_id: tax_id,
        tax_type: taxType,
        tax_percentage: taxPercentage,
        item_cost: itemCostDetails.purchaseCost,
        tax_amount: itemCostDetails.taxAmount,
        cgst: itemCostDetails.cgst,
        sgst: itemCostDetails.sgst,
        igst: itemCostDetails.igst,
        total_mc: itemCostDetails.totalPurchaseMc,
        wastage_weight: wastageWeight,
      };
    });

    // Only update state if there are changes
    if (JSON.stringify(updatedItemDetails) !== JSON.stringify(itemDetails)) {
      setItemDetails(updatedItemDetails);
    }
  }, [itemDetails]); // Run whenever itemDetails changes

  const calculateTotal = (field, decimal_places) => {
    return itemDetails.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const handleAddItem = (rowIndex) => {
    let allowAdd = true;
    let currentRowDetails = itemDetails[rowIndex];
    allowAdd = validateItemDetails(currentRowDetails);
    if (allowAdd) {
      setItemDetails((prevItemDetails) => [
        ...prevItemDetails,
        initialStateItemDetails,
      ]);
    }
    console.log(itemDetails);
  };

  useEffect(() => {
    console.log("Updated itemDetails:", itemDetails); // Logs whenever itemDetails changes
  }, [itemDetails]);

  const handleDelete = (index) => {
    const updatedFormData = [...itemDetails];
    updatedFormData.splice(index, 1);
    setItemDetails(updatedFormData);
  };

  const handleTagSearch = (rowIndex, item, event) => {
    if (event.key === "Enter") {
      const tagDetails = itemDetails?.filter(
        (result, index) =>
          index !== rowIndex && result.tag_code === item.tag_code
      );

      if (item.tag_code === "") {
        toastfunc("Please Enter The Tag Code");
      } else if (idBranch === "") {
        toastfunc("Please Select Branch");
      } else if (tagDetails.length > 0) {
        toastfunc("Tag Code already exists");
      } else {
        getTagDetails(item, rowIndex, {
          tagCode: item.tag_code,
          idBranch: idBranch,
        });
      }
    }
  };

  const getTagDetails = async (item, rowIndex, requestData) => {
    try {
      let response = {};
      response = await dispatch(getTagDetailsByCode(requestData)).unwrap();
      const updatedItemDetails = {
        ...item,
        tag_id: response.tag_id,
        id_product: response.tag_product_id,
        piece: response.tag_pcs,
        gross_wt: response.tag_gwt,
        net_wt: response.tag_nwt,
        less_wt: response.tag_lwt,
        product_name: response.product_name,
        stone_details: response.stone_details,
      };
      const updatedFormData = [...itemDetails];
      updatedFormData[rowIndex] = updatedItemDetails;
      setItemDetails(updatedFormData);
    } catch (error) {
      console.error(error);
    }
  };

  useHotkeys("ctrl+s", (event) => {
    event.preventDefault();
    onClickSave();
  });

  const validateItemDetails = (currentRowDetails) => {
    let allowSubmit = true;
    if (currentRowDetails.id_product === "") {
      toastfunc("Product is Missing");
      allowSubmit = false;
    } else if (currentRowDetails.piece === "") {
      toastfunc("Piece is Required..");
      allowSubmit = false;
    } else if (parseInt(currentRowDetails.piece) === 0) {
      toastfunc("Piece should be greater than 0..");
      allowSubmit = false;
    } else if (parseInt(currentRowDetails.piece) < 0) {
      toastfunc("Piece should not less than 0..");
      allowSubmit = false;
    } else if (parseInt(currentRowDetails.gross_wt) === 0) {
      toastfunc("Piece should be greater than 0..");
      allowSubmit = false;
    } else if (parseInt(currentRowDetails.gross_wt) < 0) {
      toastfunc("Gross weight should be greater than 0..");
      allowSubmit = false;
    } else if (parseInt(currentRowDetails.net_wt) < 0) {
      toastfunc("Net weight should be greater than 0..");
      allowSubmit = false;
    } else if (currentRowDetails.gross_wt === "") {
      toastfunc("Gross weight is required.");
      allowSubmit = false;
    } else if (
      parseInt(currentRowDetails.touch) === 0 ||
      currentRowDetails.touch === ""
    ) {
      toastfunc("Touch is required..");
      allowSubmit = false;
    } else if (
      parseInt(currentRowDetails.rate_per_gram) === 0 ||
      currentRowDetails.item_cost === ""
    ) {
      toastfunc("Rate is required..");
      allowSubmit = false;
    } else if (
      parseInt(currentRowDetails.item_cost) === 0 ||
      currentRowDetails.item_cost === ""
    ) {
      toastfunc("Cost is required..");
      allowSubmit = false;
    }
    return allowSubmit;
  };

  const onClickSave = async () => {
    let allowSubmit = true;

    for (let i = 0; i < itemDetails.length; i++) {
      const isValid = validateItemDetails(itemDetails[i]);
      if (!isValid) {
        allowSubmit = false;
        break;
      }
    }
    if (idSupplier === "" || idSupplier == null) {
      toastfunc("Please select the supplier.");
      allowSubmit = false;
    } else if (idBranch === "" || idBranch == null) {
      toastfunc("Please select the Branch.");
      allowSubmit = false;
    }
    if (allowSubmit) {
      setIsSubmitted(true);
      try {
        let postData = {
          id_supplier: idSupplier,
          id_branch: idBranch,
          item_details: itemDetails,
          remarks: remarks,
        };
        // let response = "";
        await dispatch(createPurchaseReturnEntry(postData)).unwrap();
        navigate(`${process.env.PUBLIC_URL}/purchase/purchase_return/list`);
      } catch (error) {
        setIsSubmitted(false);
      }
    }
  };

  const onClickEdit = async () => {
    let allowSubmit = true;

    for (let i = 0; i < itemDetails.length; i++) {
      const isValid = validateItemDetails(itemDetails[i]);
      if (!isValid) {
        allowSubmit = false;
        break;
      }
    }
    if (idSupplier === "" || idSupplier == null) {
      toastfunc("Please select the supplier.");
      allowSubmit = false;
    } else if (idBranch === "" || idBranch == null) {
      toastfunc("Please select the Branch.");
      allowSubmit = false;
    }
    if (allowSubmit) {
      setIsSubmitted(true);
      try {
        let postData = {
          id_supplier: idSupplier,
          id_branch: idBranch,
          item_details: itemDetails,
          remarks: remarks,
        };
        const passData = { id, content: postData };
        // let response = "";
        await dispatch(updatePurchaseReturnById(passData)).unwrap();
        navigate(`${process.env.PUBLIC_URL}/purchase/purchase_return/list`);
      } catch (error) {
        setIsSubmitted(false);
      }
    }
  };
  useEffect(() => {
    if (tagList?.length > 0) {
      const tagListCopy = [...tagList];

      const updatedItemDetails = tagListCopy?.map((item) => {
        const container = {};
        container.type = 2;
        container.tag_code = item.tag_code;
        container.tag_id = item.tag_id;
        container.id_product = item.tag_product_id;
        container.piece = item.tag_pcs;
        container.gross_wt = item.tag_gwt;
        container.net_wt = item.tag_nwt;
        container.less_wt = item.tag_lwt;
        container.product_name = item.product_name;
        container.stone_details = item.stone_details;
        return container;
      });

      setItemDetails(updatedItemDetails);
    }
  }, [tagList]);

  return (
    <React.Fragment>
      <Head title="Purchase Return" />
      <Content>
        <PreviewCard className="h-100">
          <FormProvider {...methods}>
            <Row
              lg={12}
              className={"form-control-sm"}
              style={{ marginTop: "10px" }}
            >
              <Col md={5}>
                <ModifiedBreadcrumb />
              </Col>
              <Col md={2}>
                <div className="form-group">
                  <BranchDropdown
                    register={register}
                    id={"idBranch"}
                    branches={branches}
                    selectedBranch={idBranch}
                    isRequired={true}
                    onBranchChange={setIdBranch}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.idBranch && "Branch is Required"}
                    tabIndex={1}
                  />
                </div>
              </Col>
              <Col md={2}>
                <SupplierDropdown
                  register={register}
                  id={"idSupplier"}
                  supplier={supplier}
                  isRequired={true}
                  selectedSupplier={idSupplier}
                  onSupplierChange={setIdSupplier}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  message={errors.idSupplier && "Supplier is Required"}
                  tabIndex={2}
                />
              </Col>
              <Col md={3} className="text-right">
                <Button
                  disabled={isSubmitted}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/purchase/purchase_return/list`
                    )
                  }
                >
                  Cancel
                </Button>{" "}
                {id === undefined ? (
                  <Button
                    color="primary"
                    disabled={isSubmitted}
                    size="md"
                    onClick={onClickSave}
                  >
                    {isSubmitted ? "Saving" : "Save(Ctrl+s)"}
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    disabled={isSubmitted}
                    size="md"
                    onClick={onClickEdit}
                  >
                    {isSubmitted ? "Saving" : "Save(Ctrl+s)"}
                  </Button>
                )}
              </Col>
            </Row>

            <Row className="form-group row g-4">

              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="estNo">
                    Est No
                  </label>

                  <TextInputField
                    register={register}
                    placeholder="Estimation No"
                    id={"estNo"}
                    value={estNo}
                    isRequired={false}
                    type={"text"}
                    setValue={setValue}
                    SetValue={(value) => {
                      if (idBranch) {
                        setEstNo(value);
                        clearErrors("estNo");
                        dispatch(
                          getTagEstimatedData({
                            id_branch: idBranch,
                            est_no: value,
                          })
                        );
                      }
                      else {
                        toastfunc("Select Branch")
                      }

                    }}
                    message={errors.estNo && errors.estNo.message}
                  />
                </div>
              </Col>
            </Row>

            <Row className="form-group row g-4">
              <Col md={12}>
                <div
                  className="table-responsive"
                  style={{ maxHeight: '400px', overflowY: 'auto' }}
                >
                  <table className="table table-bordered">
                  <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#fff' }}>
                      <tr
                      style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                     backgroundColor: "#f8f9fa",
                     }}
                      >
                        <th className="tableHeadFixed" >#</th>
                        <th className="tableHeadFixed" >Tag No</th>
                        <th className="tableHeadFixed" >Product</th>
                        <th className="tableHeadFixed" >Pcs</th>
                        <th className="tableHeadFixed" >Gwt</th>
                        <th className="tableHeadFixed" >Lwt</th>
                        <th className="tableHeadFixed" >Nwt</th>
                        <th className="tableHeadFixed" >Mc</th>
                        <th className="tableHeadFixed" >Flat Mc</th>
                        <th className="tableHeadFixed" >VA</th>
                        <th className="tableHeadFixed" >Touch</th>
                        <th className="tableHeadFixed" >Pure</th>
                        <th className="tableHeadFixed" >Rate</th>
                        <th className="tableHeadFixed" >Tax</th>
                        <th className="tableHeadFixed" >Item Cost</th>
                        <th className="tableHeadFixed" >Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemDetails?.map((item, rowIndex) => (
                        <tr key={rowIndex}>
                          <td>
                            <div
                              className="form-group"
                              style={{ width: "100px" }}
                            >
                              <div className="form-control-wrap">
                                <div className="form-control-select">
                                  <select
                                    className="form-control form-select"
                                    id={"type_" + rowIndex}
                                    {...register("type_" + rowIndex, {
                                      required: true,
                                    })}
                                    value={item.type}
                                    onChange={(e) => {
                                      handleFormChange(
                                        rowIndex,
                                        "type",
                                        e.target.value
                                      );
                                    }}
                                    placeholder="Type"
                                  >
                                    {returnTypeOptions?.map((item, index) => (
                                      <option key={index} value={item?.value}>
                                        {item.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ width: "100px" }}>
                              <TextInputField
                                register={register}
                                placeholder="Tag Code"
                                id={"tag_code_" + rowIndex}
                                value={item.tag_code}
                                isRequired={false}
                                isDisabled={
                                  parseInt(item.type) === 1 ||
                                    parseInt(item.type) === 3
                                    ? true
                                    : false
                                }
                                type={"text"}
                                setValue={setValue}
                                SetValue={(value) => {
                                  handleFormChange(rowIndex, "tag_code", value);
                                }}
                                handleKeyDown={(event) =>
                                  handleTagSearch(rowIndex, item, event)
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <div style={{ width: "150px" }}>
                              {parseInt(item.type) === 1 ||
                                parseInt(item.type) === 3 ? (
                                <ProductDropdown
                                  register={register}
                                  id={"id_product_" + rowIndex}
                                  products={products}
                                  selectedProduct={item.id_product}
                                  onProductChange={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "id_product",
                                      value
                                    );
                                  }}
                                  isRequired={false}
                                  clearErrors={clearErrors}
                                  setValue={setValue}
                                ></ProductDropdown>
                              ) : (
                                item.product_name
                              )}
                            </div>
                          </td>
                          <td style={{ position: 'relative', overflow: 'hidden', padding: '4px' }}>
                          <div style={{ width: '100px', position: 'relative', zIndex: 1 }}>
                            <NumberInputField
                                placeholder="Pcs"
                                id={"piece_" + rowIndex}
                                value={item.piece}
                                isRequired={true}
                                min={0}
                                type={"number"}
                                setValue={setValue}
                                handleKeyDownEvents={true}
                                handleDecimalDigits={true}
                                decimalValues={0}
                                SetValue={(value) => {
                                  handleFormChange(rowIndex, "piece", value);
                                }}
                                minError={"Pcs should less than or equal to 0"}
                                maxError={"Pcs greater than or equal to 0"}
                                reqValueError={"Pcs is Required"}
                                register={register}
                              />
                            </div>
                          </td>
                          <td>
                            <div style={{ width: "150px" }}>
                              <InputFieldWithDropdown
                                register={register}
                                placeholder="Gross weight"
                                id={"gross_wt_" + rowIndex}
                                value={item.gross_wt}
                                isRequired={true}
                                min={0}
                                type={"number"}
                                optionId={"uom_id_" + rowIndex}
                                name={"uom_id_" + rowIndex}
                                options={UomOptions}
                                setValue={setValue}
                                SetValue={(value) => {
                                  handleFormChange(rowIndex, "gross_wt", value);
                                }}
                                handleKeyDownEvents={true}
                                handleDecimalDigits={true}
                                decimalValues={3}
                                onDropDownChange={(value) => {
                                  handleFormChange(rowIndex, "uom_id", value);
                                }}
                                selectedOption={item.uom_id}
                                minError={
                                  "Gross weight should less than or equal to 0"
                                }
                                maxError={
                                  "Gross Weight greater than or equal to 0"
                                }
                                reqValueError={"Gross weight is Required"}
                              ></InputFieldWithDropdown>{" "}
                            </div>
                          </td>
                          <td>
                            <div style={{ width: "150px" }}>
                              <LessWeightInputField
                                register={register}
                                placeholder="Less Weight"
                                id={"less_wt_" + rowIndex}
                                value={item.less_wt}
                                isRequired={false}
                                min={0}
                                uom={uom}
                                gross_weight={item.gross_wt}
                                less_weight={item.less_wt}
                                SetValue={(value) => {
                                  handleFormChange(rowIndex, "less_wt", value);
                                }}
                                SetStnWeight={(value) =>
                                  handleFormChange(rowIndex, "stn_wt", value)
                                }
                                SetDiaWeight={(value) =>
                                  handleFormChange(rowIndex, "dia_wt", value)
                                }
                                SetStoneDetails={(value) => {
                                  handleStoneDetails(
                                    rowIndex,
                                    "stone_details",
                                    value
                                  );
                                }}
                                stone_details={item.stone_details}
                                stone={stone}
                                quality_code={quality_code}
                                ref={lessWeightRef}
                              />
                            </div>
                          </td>
                          <td>{item.net_wt}</td>
                          <td>
                            <div style={{ width: "190px" }}>
                              <InputFieldWithDropdown
                                register={register}
                                placeholder="MC"
                                id={"mcValue_" + rowIndex}
                                value={item?.mc_value}
                                isRequired={true}
                                min={0}
                                type={"number"}
                                SetValue={(value) => {
                                  handleFormChange(rowIndex, "mc_value", value);
                                  clearErrors("mcValue_" + rowIndex);
                                }}
                                optionId={"mcType_" + rowIndex}
                                name={"mcType"}
                                options={mcTypeOptions}
                                setValue={setValue}
                                onDropDownChange={(value) => {
                                  handleFormChange(rowIndex, "mc_type", value);
                                }}
                                selectedOption={item?.mc_type}
                                message={errors.mcValue && errors.mcValue.message}
                              ></InputFieldWithDropdown>
                            </div>
                          </td>
                          <td>
                            <div style={{ width: "75px" }}>
                              <NumberInputField
                                placeholder="Flat MC"
                                id={"flatMcValue_" + rowIndex}
                                value={item?.flat_mc}
                                isRequired={false}
                                min={0}
                                type={"number"}
                                setValue={setValue}
                                handleKeyDownEvents={true}
                                handleDecimalDigits={true}
                                decimalValues={0}
                                SetValue={(value) => {
                                  handleFormChange(rowIndex, "flat_mc", value);
                                }}
                                minError={"Pcs should less than or equal to 0"}
                                maxError={"Pcs greater than or equal to 0"}
                                reqValueError={"Pcs is Required"}
                                register={register}
                              />
                            </div>
                          </td>
                          <td>
                            <div style={{ width: "100px" }}>
                              <NumberInputField
                                placeholder="Va"
                                id={"va_" + rowIndex}
                                value={item.wastage_percentage}
                                isRequired={false}
                                min={0}
                                type={"number"}
                                setValue={setValue}
                                handleKeyDownEvents={true}
                                handleDecimalDigits={true}
                                decimalValues={2}
                                SetValue={(value) => {
                                  handleFormChange(rowIndex, "wastage_percentage", value);
                                }}
                                minError={
                                  "Wastage Percentage should less than or equal to 0"
                                }
                                maxError={
                                  "Wastage Percentage greater than or equal to 0"
                                }
                                reqValueError={"Wastage Percentage is Required"}
                                register={register}
                              />
                            </div>
                          </td>
                          <td>
                            <div style={{ width: "100px" }}>
                              <NumberInputField
                                placeholder="Touch"
                                id={"touch_" + rowIndex}
                                value={item.touch}
                                isRequired={false}
                                min={0}
                                type={"number"}
                                setValue={setValue}
                                handleKeyDownEvents={true}
                                handleDecimalDigits={true}
                                decimalValues={2}
                                SetValue={(value) => {
                                  handleFormChange(rowIndex, "touch", value);
                                }}
                                minError={
                                  "Purchase Touch should less than or equal to 0"
                                }
                                maxError={
                                  "Purchase Touch greater than or equal to 0"
                                }
                                reqValueError={"Purchase Touch is Required"}
                                register={register}
                              />
                            </div>
                          </td>
                          <td>
                            <div style={{ width: "230px" }}>
                              <InputFieldWithDropdown
                                register={register}
                                placeholder="Pure Weight"
                                id={"pure_wt_" + rowIndex}
                                value={item.pure_wt}
                                isRequired={false}
                                min={0}
                                type={"number"}
                                readOnly={true}
                                optionId={"pure_calc_type_" + rowIndex}
                                name={"pure_calc_type"}
                                options={PureCalcTypeOptions}
                                setValue={setValue}
                                onDropDownChange={(value) => {
                                  handleFormChange(rowIndex, "touch", value);
                                }}
                                selectedOption={
                                  item.setPureCalcType ||
                                  parseInt(item.pure_calc_type)
                                }
                                SetValue={(value) => {
                                  handleFormChange(rowIndex, "touch", value);
                                }}
                                minError={"Rate should less than or equal to 0"}
                                maxError={
                                  "Rate should greater than or equal to 0"
                                }
                                reqValueError={"Purchase Rate is Required"}
                              />
                            </div>
                          </td>
                          <td>
                            <div style={{ width: "230px" }}>
                              <InputFieldWithDropdown
                                register={register}
                                placeholder="Rate"
                                id={"rate_per_gram_" + rowIndex}
                                value={item.rate_per_gram}
                                isRequired={true}
                                min={0}
                                type={"number"}
                                optionId={"rate_calc_type_" + rowIndex}
                                name={"rate_calc_type"}
                                options={calcTypeOptions}
                                setValue={setValue}
                                handleKeyDownEvents={true}
                                handleDecimalDigits={true}
                                decimalValues={2}
                                onDropDownChange={(value) => {
                                  handleFormChange(
                                    rowIndex,
                                    "rate_calc_type",
                                    value
                                  );
                                }}
                                selectedOption={item.rate_calc_type}
                                SetValue={(value) => {
                                  handleFormChange(
                                    rowIndex,
                                    "rate_per_gram",
                                    value
                                  );
                                }}
                                minError={"Rate should less than or equal to 0"}
                                maxError={
                                  "Rate should greater than or equal to 0"
                                }
                                reqValueError={"Purchase MC is Required"}
                              />
                            </div>
                          </td>
                          <td>
                            {item.tax_percentage !== ""
                              ? item.tax_percentage + " %"
                              : ""}
                          </td>
                          <td>{<CurrencyDisplay value={item.item_cost} />}</td>
                          <td>
                            {rowIndex == itemDetails?.length - 1 && (
                              <Button
                                color="primary"
                                size="sm"
                                className="btn-icon btn-white btn-dim"
                                onClick={() => handleAddItem(rowIndex)}
                              >
                                <Icon name="plus" />
                              </Button>
                            )}
                            <Button
                              color="primary"
                              size="sm"
                              className="btn-icon btn-white btn-dim"
                              onClick={() => handleDelete(rowIndex)}
                            >
                              <Icon name="trash-fill" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot style={{ position: 'sticky', bottom: 0, zIndex: 10, backgroundColor: '#fff' }}>
                      <tr  
                       style={{
                       fontWeight: "bold",
                       position: "sticky",
                       bottom: 0,
                       zIndex: 1,
                       backgroundColor: "#f8f9fa",
                          }}
                        >
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Total</td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}></td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}></td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>{calculateTotal("piece", 0)}</td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>{calculateTotal("gross_wt", 3)}</td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>{calculateTotal("less_wt", 3)}</td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>{calculateTotal("net_wt", 3)}</td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}></td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}></td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}></td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}></td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>{calculateTotal("pure_wt", 3)}</td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}></td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}></td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                          {
                            <CurrencyDisplay
                              value={calculateTotal("item_cost", 2)}
                            />
                          }
                        </td>
                        <td style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}></td>

                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Col>
            </Row>

            <Row
              lg={12}
              className={"form-control-sm "}
              style={{ marginTop: "20px" }}
            >
              <Col md={6}>
                <div className="form-group " style={{ display: "flex" }}>
                  <div className="form-group">
                    <label className="form-label">Remarks :<IsRequired /></label>
                  </div>
                  &nbsp;&nbsp;
                  <div className="form-control-wrap">
                    <textarea
                      style={{ width: "200%", height: "100px" }}
                      className="form-control form-control-sm"
                      type="text"
                      isRequired={true}
                      value={remarks}
                      onChange={(e) => {
                        setRemarks(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </FormProvider>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default PurchaseReturnForm;
