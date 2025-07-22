import React, { useEffect, useState, useRef } from "react";
import Head from "../../../layout/head/Head";
import DatePicker from "react-datepicker";
import Icon from "../../../components/icon/Icon";
import { toastfunc, toastsuccess } from "../../../components/sds-toast-style/toast-style";
import secureLocalStorage from "react-secure-storage";
import { useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Col, Row, PreviewCard, SaveButton, UserAvatar } from "../../../components/Component";
import { InputFieldWithDropdown, TextInputField, NumberInputField } from "../../../components/form-control/InputGroup";
import Content from "../../../layout/content/Content";
import "../../../assets/css/sales_form.css";
import "../../../assets/css/datatable.css";
import TagPrnPrint from "../tagging/tagPrnPrint";
import DownloadTagPrint from "../tagging/tagPrnDownload";
import {
  BranchDropdown,
  LotDropdown,
  DesignDropdown,
  ProductDropdown,
  PurityDropdown,
  SectionDropdown,
  SubDesignDropdown,
  SupplierDropdown,
  ProductCalculationTypeDropdown,
  SizeDropdown,
} from "../../../components/filters/retailFilters";
import {
  useActiveLot,
  usePurities,
  useProducts,
  useDesigns,
  useSubDesigns,
  useUom,
  useSupplierFilter,
  useBranches,
  useSections,
  useProductSections,
  useCalType,
  useStone,
  useQualityCode,
} from "../../../components/filters/filterHooks";
import {
  calculateNetWeight,
  calculatePurchaseCost,
  calculatePureWeight,
  isUndefined,
  calculateWastagePercentage,
  calculateWastageWeight,
} from "../../../components/common/calculations/ErpCalculations";
import IsRequired from "../../../components/erp-required/erp-required";
import PreviewTable from "../../../components/sds-table/PreviewTable";
import { Button, ButtonGroup } from "reactstrap";
import LessWeightInputField from "../../../components/form-control/LessWeight";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useDispatch } from "react-redux";
import DeleteModal from "../../../components/modals/DeleteModal";
import Select from "react-select";
import { getTagFilterdedData, printBulkTag, updateBulkTagEdit } from "../../../redux/thunks/inventory";
import MultiImageDropzone from "../../../components/modals/MultiImageDropzone";
import { v4 as uuid } from "uuid";
import AttributeModalForm from "../../../components/common/modal/attributeModal";
import OTPModal from "../../../components/modals/OtpModel";
import { userOTPVerify } from "../../../redux/thunks/authUser";
import { getPagePermission } from "../../../redux/thunks/coreComponent";

const BulkEditForm = () => {
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
  const { isLoading: issubmitting, isError, tagList } = useSelector((state) => state.tagBulkEditReducer);
  const {
    userInfo: { settings, user, tag_edit_settings }, userInfo
  } = useSelector((state) => state.authUserReducer);
  const methods = useForm();
  const { purities } = usePurities();
  const { products } = useProducts();
  const { designs } = useDesigns();
  const { subDesigns } = useSubDesigns();
  const { stone } = useStone();
  const { quality_code } = useQualityCode();
  const { sections } = useProductSections();
  const { uom } = useUom();
  const { supplier } = useSupplierFilter();
  const { branches } = useBranches();
  const { lot } = useActiveLot();
  const { calType } = useCalType();
  const [firstDate, setFirstDate] = useState(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000));
  const [selectAll, setSelectAll] = useState(true);
  const dispatch = useDispatch();


  const pathName = location?.pathname;
  const { pagePermission } = useSelector((state) => state.coreCompReducer);

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  useEffect(() => {
    if (pagePermission?.view === false || pagePermission === undefined || pagePermission === null) {
      navigate(`${process.env.PUBLIC_URL}/`);
    }
  }, [pagePermission, navigate]);


  const toggle = ({ ...props }) => {
    SetModal(!modal);
    if (props?.Save === true && modal === true) {
      handleFormChange(imagesEditIndex, "tag_images", tagImages);
      SetTagImages([]);
      SetImagesEditIndex("");
    } else if (props && props.hasOwnProperty("rowIndex")) {
      console.log(tagImages);
      if (props?.imageData) {
        SetTagImages(props.imageData);
      }
      SetImagesEditIndex(props.rowIndex);
    }
  };

  const convert64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleDropChange = async (acceptedFiles, set) => {
    const filesWithPreview = await Promise.all(
      acceptedFiles?.map(async (file) => {
        const base64String = await convert64(file);
        return {
          ...file,
          preview: base64String,
          id: uuid(),
          default: false,
        };
      })
    );

    set(filesWithPreview);
  };

  const [tagImages, SetTagImages] = useState([]);

  const [modal, SetModal] = useState(false);

  const [imagesEditIndex, SetImagesEditIndex] = useState("");

  const [attrEditIndex, SetAttrEditIndex] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [tagAttr, SetTagAttr] = useState([]);

  const [bulkMcTypeUpdate, SetBulkMcTypeUpdate] = useState("");

  const [bulkMcUpdate, SetbulkMcUpdate] = useState("");

  const [buleflatMcValue, SetbuleflatMcValue] = useState("");

  const [bulkVaUpdate, SetBulkVaUpdate] = useState("");

  const [bulkMrpUpdate, SetBulkMrpUpdate] = useState("");

  const [inputOTP, setInputOTP] = useState(["", "", "", "", "", ""]);
  const [otpModal, setOtpModal] = useState(false);
  const [otpFor, setOtpFor] = useState("5");

  const otpToggle = () => {
    setOtpModal(!otpModal);
  };

  const toggleModal = (props = {}) => {
    setIsModalOpen(!isModalOpen);
    if (props?.Save === true && isModalOpen === true) {
      SetTagAttr([]);
      SetAttrEditIndex("");
    } else if (props && props.hasOwnProperty("rowIndex")) {
      if (props?.tagAttr) {
        SetTagAttr(props.tagAttr);
      }
      SetAttrEditIndex(props.rowIndex);
    }
  };

  const onClickSave = () => {
    const checkedTags = filterTagList.filter((tag) => tag.isChecked === true);

    if (checkedTags.length) {
      let tag_details = tag_update_details(checkedTags);

      dispatch(updateBulkTagEdit({ tag_details: tag_details, bulk_edit_type: BulkEditType }));
    } else {
      toastfunc("Select Tag To Update");
    }
  };

  const validate_HUID = (HUID) => {
    let re = /^[A-Z0-9]{6}$/;

    return re.test(HUID);
  };

  const lessWeightRef = useRef();
  let UomOptions = [];
  if (uom.length > 0) {
    UomOptions = uom.map((val) => ({
      value: val.uom_id,
      label: val.uom_name,
      isDefault: val.is_default,
    }));
  }

  const handleChange = (field, value) => {
    setBulkEditType(value);
    // console.log(value);
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

  const handleStoneDetails = (index, field, data) => {
    handleFormChange(index, field, data);
  };

  const handleAttributeDetails = (data) => {
    handleFormChange(attrEditIndex, "tag_attributes", data);
  };
  const [filterTagList, setFilterTagList] = useState(tagList);

  const tag_update_details = (data) => {
    let updateData = [];

    data.map((item, rowIndex) => {
      if (BulkEditType == 1) {
        updateData.push({
          tag_id: item.tag_id,
          tag_wastage_percentage: item.tag_wastage_percentage,
          tag_wastage_wt: item.tag_wastage_wt,
        });
      } else if (BulkEditType == 2) {
        updateData.push({
          tag_id: item.tag_id,
          tag_mc_type: item.tag_mc_type,
          tag_mc_value: item.tag_mc_value,
          flat_mc_value: item.flat_mc_value,
        });
      } else if (BulkEditType == 3) {
        updateData.push({
          tag_id: item.tag_id,
          tag_gwt: item.tag_gwt,
          tag_nwt: item.tag_nwt,
          tag_lwt: item.tag_lwt,
          tag_dia_wt: item.tag_dia_wt,
          tag_stn_wt: item.tag_stn_wt,
          stone_details: item.stone_details,
          tag_purchase_cost: item.tag_purchase_cost,
          tag_pure_wt: item.tag_pure_wt,
          tag_wastage_percentage: item.tag_wastage_percentage,
          tag_wastage_wt: item.tag_wastage_wt,
        });
      } else if (BulkEditType == 4) {
        updateData.push({
          tag_id: item.tag_id,
          tag_pcs: item.tag_pcs,
        });
      } else if (BulkEditType == 5) {
        updateData.push({
          tag_id: item.tag_id,
          tag_purity_id: item.tag_purity_id,
        });
      } else if (BulkEditType == 6) {
        updateData.push({
          tag_id: item.tag_id,
          tag_sell_rate: item.tag_sell_rate,
        });
      } else if (BulkEditType == 7) {
        updateData.push({
          tag_id: item.tag_id,
          tag_calculation_type: item.tag_calculation_type,
        });
      } else if (BulkEditType == 8) {
        updateData.push({
          tag_id: item.tag_id,
          tag_huid: item.tag_huid,
          tag_huid2: item.tag_huid2,
        });
      } else if (BulkEditType == 9) {
        updateData.push({
          tag_id: item.tag_id,
          tag_attributes: item.tag_attributes,
        });
      } else if (BulkEditType == 10) {
        updateData.push({
          tag_id: item.tag_id,
          tag_purchase_va: item.tag_purchase_va,
          tag_purchase_mc: item.tag_purchase_mc,
          tag_purchase_touch: item.tag_purchase_touch,
          tag_purchase_calc_type: item.tag_purchase_calc_type,
          tag_purchase_rate: item.tag_purchase_rate,
          tag_purchase_rate_calc_type: item.tag_purchase_rate_calc_type,
          tag_purchase_cost: item.tag_purchase_cost,
          tag_pure_wt: item.tag_pure_wt,
        });
      } else if (BulkEditType == 11) {
        updateData.push({
          tag_id: item.tag_id,
          tag_design_id: item.tag_design_id,
          tag_sub_design_id: item.tag_sub_design_id,
        });
      } else if (BulkEditType == 12) {
        updateData.push({
          tag_id: item.tag_id,
          tag_images: item.tag_images,
        });
      }
    });

    return updateData;
  };

  const handleBulkChanges = (value, field = "") => {
    filterTagList.map((item, rowIndex) => {
      const productDetails = products.find((prod) => prod.pro_id === item.tag_product_id);

      if (BulkEditType == 1) {
        const wastage_calc_type = productDetails.wastage_calc_type;
        handleFormChange(rowIndex, "tag_wastage_percentage", value);
        let wastageWeight = calculateWastageWeight({
          wastagePercentage: value,
          calculationType: wastage_calc_type,
          netWeight: item.tag_nwt,
          grossWeight: item.tag_gwt,
        });
        handleFormChange(rowIndex, "tag_wastage_wt", wastageWeight);
      }

      if (BulkEditType == 2) {
        handleFormChange(rowIndex, field, value);
      }

      if (BulkEditType == 6) {
        handleFormChange(rowIndex, "tag_sell_rate", value);
      }
    });
  };

  useEffect(() => {
    setFilterTagList(tagList);
  }, [tagList]);

  const searchTag = () => {
    if (filterValues.selectedProduct || filterValues.selectBranch || filterValues.tagCode || filterValues.lotId) {
      dispatch(
        getTagFilterdedData({
          filter_details: {
            tag_code: filterValues.tagCode,
            tag_current_branch: filterValues.selectBranch,
            tag_product_id: filterValues.selectedProduct,
            tag_design_id: filterValues.selectedDesign,
            tag_sub_design_id: filterValues.selectedSubDesign,
            tag_purity_id: filterValues.selectedPurity,
            tag_mc_value: filterValues.mc,
            tag_mc_type: filterValues.mcType,
            flat_mc_value: filterValues.flatmc,
          },
          custom_filter_details: {
            tagDateFrom: filterValues.tagDateFrom,
            tagDateTo: filterValues.tagDateTo,
            lotId: filterValues.lotId,
            vaWeightFrom: filterValues.vaWeightFrom,
            vaWeightTo: filterValues.vaWeightTo,
            selectedSupplier: filterValues.selectedSupplier,
            grossWeightFrom: filterValues.grossWeightFrom,
            grossWeightTo: filterValues.grossWeightTo,
          },
        })
      );
    } else {
      toastfunc("Select Any One Of these Branch,Tag Code,Product,Lot to Filter Tag");
    }
  };

  // const updateOption = {
  //   UpdateVa: { label: "Va", bulk_edit_type: 1 },
  //   UpdateMc: { label: "Mc", bulk_edit_type: 2 },
  //   UpdateGrsWt: { label: "Grs Wt", bulk_edit_type: 3 },
  //   UpdatePcs: { label: "Pcs", bulk_edit_type: 4 },
  //   UpdatePurity: { label: "Purity", bulk_edit_type: 5 },
  //   UpdateMrp: { label: "MRP Price", bulk_edit_type: 6 },
  //   // UpdateCalcType: { label: "Calculation Type", bulk_edit_type: 7 },
  //   UpdateHuid: { label: "HUID", bulk_edit_type: 8 },
  //   UpdateAttribute: { label: "Attribute", bulk_edit_type: 9 },
  //   UpdatePurchaseCost: { label: "Purchase Cost", bulk_edit_type: 10 },
  //   UpdateDesign: { label: "Design && SubDesign", bulk_edit_type: 11 },
  //   UpdateImage: { label: "Image", bulk_edit_type: 12 },
  //   PrintTags: { label: "Print", bulk_edit_type: 13 },
  // };

  const updateOption = {
    UpdateVa: { label: "Va", bulk_edit_type: 1, permissionKey: "can_edit_tag_va" },
    UpdateMc: { label: "Mc", bulk_edit_type: 2, permissionKey: "can_edit_tag_mc" },
    UpdateGrsWt: { label: "Grs Wt", bulk_edit_type: 3, permissionKey: "can_edit_tag_gwt" },
    UpdatePcs: { label: "Pcs", bulk_edit_type: 4, permissionKey: "can_edit_tag_pcs" },
    UpdatePurity: { label: "Purity", bulk_edit_type: 5, permissionKey: "can_edit_tag_purity" },
    UpdateMrp: { label: "MRP Price", bulk_edit_type: 6, permissionKey: "can_edit_tag_mrp" },
    UpdateHuid: { label: "HUID", bulk_edit_type: 8, permissionKey: "can_edit_tag_huid" },
    UpdateAttribute: { label: "Attribute", bulk_edit_type: 9, permissionKey: "can_edit_tag_attr" },
    UpdatePurchaseCost: { label: "Purchase Cost", bulk_edit_type: 10, permissionKey: "can_edit_tag_pur_cost" },
    UpdateDesign: { label: "Design && SubDesign", bulk_edit_type: 11, permissionKey: "can_edit_tag_dsgn_sub_desgn" },
    UpdateImage: { label: "Image", bulk_edit_type: 12, permissionKey: "can_edit_tag_img" },
    PrintTags: { label: "Print", bulk_edit_type: 13, permissionKey: "can_print_tag" },
  };


  const [BulkEditType, setBulkEditType] = useState(0);

  const filterValuesDefalut = {
    tagCode: "",
    selectedProduct: "",
    selectedDesign: "",
    selectedSubDesign: "",
    selectedSupplier: "",
    tagDateFrom: "",
    tagDateTo: "",
    selectedPurity: "",
    lotId: "",
    mcType: "",
    wastage: "",
    vaWeightFrom: "",
    vaWeightTo: "",
    mc: "",
    flatmc: "",
    grossWeightFrom: "",
    grossWeightTo: "",
    grossWeightTo: "",
    selectBranch: "",
  };

  const resetDesign = () => {
    setFilterValues((prevValues) => ({ ...prevValues, [selectedDesign]: "" }));
  };

  const resetSubDesign = () => {
    setFilterValues((prevValues) => ({ ...prevValues, [selectedSubDesign]: "" }));
  };

  const [filterValues, setFilterValues] = useState(filterValuesDefalut);
  const calcTypeOptions = [
    { label: "Per Gram", value: 1, isDefault: true },
    { label: "Per Piece", value: 2 },
  ];
  const PureCalcTypeOptions = [
    { label: "Touch+VA", value: 2, isDefault: true },
    { label: "Weight+VA", value: 1 },
    { label: "Wt * VA %", value: 3 },
  ];

  const selectAllCol = (value) => {
    filterTagList.map((item, rowIndex) => {
      handleFormChange(rowIndex, "isChecked", value);
    });
  };

  const printTags = async () => {
    const checkedtags = filterTagList.filter((tag) => tag.isChecked === true);
    // let data= {
    //   settings: settings,
    //   user: user,
    //   itemDetails: checkedtags,
    // };
    // secureLocalStorage.setItem("pageState", JSON.stringify(data));
    // window.open(`${process.env.PUBLIC_URL}/tag/print`, "_blank");
    console.log(checkedtags);
    let response = await dispatch(printBulkTag({ tagData: checkedtags, setOtpModal })).unwrap();
    if (response?.message !== undefined && response?.message?.includes("Enter")) {
      toastsuccess(response?.message);
      setOtpModal(true);
    } else {
      //window.open(`${process.env.PUBLIC_URL}/tag/print`, "_blank");
      DownloadTagPrint(checkedtags, userInfo);
    }
  };

  const OTPVerify = async () => {
    const checkedtags = filterTagList.filter((tag) => tag.isChecked === true);
    const adddata = {
      tagData: checkedtags,
      tag_print_otp: inputOTP.join(""),
    };

    try {
      let response = "";
      response = await dispatch(userOTPVerify(adddata)).unwrap();
      toastsuccess(response?.message);
      setOtpModal(false);
      window.open(response?.tag_url, "_blank");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <Head title="Bulk Tag Edit" />
      <Content>
        <OTPModal
          modal={otpModal}
          toggle={otpToggle}
          clickAction={OTPVerify}
          otp={inputOTP}
          setOtp={setInputOTP}
          otpFor={otpFor}
        />
        <PreviewCard className="h-100">
          <FormProvider {...methods}>
            <Row lg={12} className={""} style={{ marginTop: "10px" }}>
              <Col md={9}>
                <ModifiedBreadcrumb />
              </Col>

              <Col md={3} className="">
                <ButtonGroup>
                  <div>
                    <Button
                      disabled={
                        BulkEditType != 13 ||
                        filterTagList.filter((tag) => tag.isChecked === true)
                          ?.length == 0 ||
                        issubmitting || !pagePermission?.print
                      }
                      type="button"
                      className="m-1 btn btn-secondary"
                      onClick={() => printTags()}
                    >
                      {issubmitting ? "Printing" : "Print"}
                    </Button>
                  </div>
                  <SaveButton
                    disabled={issubmitting}
                    size="md"
                    color=""
                    onClick={handleSubmit((data) => searchTag())}
                  >
                    {issubmitting ? "Searching.." : "Search"}
                  </SaveButton>

                  <SaveButton
                    disabled={issubmitting || !pagePermission?.edit}
                    size="md"
                    color="primary"
                    onClick={onClickSave}
                  >
                    Save
                  </SaveButton>
                </ButtonGroup>
              </Col>
            </Row>

            <Row lg={12} className={"form-control-sm"}>
              <Col md={3}>
                <div className="custom-grid">
                  {" "}
                  <div className="form-label">Choose Field To Update</div>
                  <div
                    className=""
                    style={{ maxHeight: "250px", overflowY: "auto" }}
                  >
                    <ul className="custom-control-group custom-control-vertical w-100">
                      {Object.entries(updateOption)
                        .filter(
                          ([_, option]) =>
                            tag_edit_settings?.[option.permissionKey]
                        )
                        .map(([key, option]) => (
                          <li key={key}>
                            <div className="custom-control custom-control-sm custom-radio custom-control-pro">
                              <input
                                type="radio"
                                className="custom-control-input"
                                name="bulk_edit_type"
                                id={key}
                                checked={option.bulk_edit_type === BulkEditType}
                                {...register(key, { required: false })}
                                onChange={() => {
                                  handleChange(key, option.bulk_edit_type);
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
              <Col md={3}>
                <div className="custom-grid">
                  <div className="form-label">Filters :</div>
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
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Branch
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <BranchDropdown
                        register={register}
                        id={"idBranch"}
                        branches={branches}
                        selectedBranch={filterValues.selectBranch}
                        onBranchChange={(value) => {
                          handleFilterChange("selectBranch", value);
                        }}
                        isRequired={false}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        message={errors.branch && "Branch is Required"}
                      />
                    </Col>
                  </Row>

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
                        id={"selectedProduct"}
                        products={products}
                        selectedProduct={filterValues.selectedProduct}
                        onProductChange={(value) => {
                          handleFilterChange("selectedProduct", value);
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
                        products={products}
                        selectedProduct={filterValues.selectedProduct}
                        selectedDesign={filterValues.selectedDesign}
                        onDesignChange={(value) => {
                          handleFilterChange("selectedDesign", value);
                          resetSubDesign();
                        }}
                        isRequired={false}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        message={errors.selectedDesign && "Design is Required"}
                      ></DesignDropdown>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          S.Design
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
                        selectedProduct={filterValues.selectedProduct}
                        selectedDesign={filterValues.selectedDesign}
                        selectedSubDesign={filterValues.selectedSubDesign}
                        onSubDesignChange={(value) => {
                          handleFilterChange("selectedSubDesign", value);
                        }}
                        isRequired={false}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        message={
                          errors.selectedSubDesign && "Sub Design is Required"
                        }
                      ></SubDesignDropdown>
                    </Col>
                  </Row>
                </div>
                <br></br>
              </Col>

              <Col md={3}>
                <div className="custom-grid">
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Purity
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <PurityDropdown
                        register={register}
                        id={"selectedPurity"}
                        purities={purities}
                        onPurityChange={(value) => {
                          handleFilterChange("selectedPurity", value);
                        }}
                        selectedPurity={filterValues.selectedPurity}
                        isRequired={false}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        message={errors.selectedPurity && "Purity is Required"}
                      />
                    </Col>
                  </Row>

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

                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          MC type
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <Select
                        value={
                          calcTypeOptions.find(
                            (option) => option.value === filterValues.mcType
                          ) || null
                        }
                        options={calcTypeOptions}
                        placeholder="Select Mc Type"
                        id={"mcType"}
                        onChange={(value) =>
                          handleFilterChange("mcType", value)
                        }
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                            fontSize: "12px",
                          }),
                        }}
                      />
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          MC
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <NumberInputField
                        register={register}
                        placeholder="Mc"
                        id={"mc"}
                        value={filterValues.mc}
                        isRequired={false}
                        min={0}
                        type={"number"}
                        setValue={setValue}
                        handleKeyDownEvents={true}
                        handleDecimalDigits={true}
                        decimalValues={3}
                        SetValue={(value) => {
                          handleFilterChange("mc", value);
                          clearErrors("mc");
                        }}
                        minError={"Mc should less than or equal to 0"}
                        maxError={"Mc greater than or equal to 0"}
                        reqValueError={"Mc is Required"}
                        message={errors.mc && errors.mc.message}
                      />
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Date Frm
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <DatePicker
                        dateFormat="dd/MM/yyyy"
                        selected={filterValues.tagDateFrom}
                        onChange={(date) =>
                          handleFilterChange("tagDateFrom", date)
                        }
                        style={{ display: "inline-flex" }}
                        className=" form-control date-picker"
                      />
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Date To
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <DatePicker
                        dateFormat="dd/MM/yyyy"
                        selected={filterValues.tagDateTo}
                        onChange={(date) =>
                          handleFilterChange("tagDateTo", date)
                        }
                        style={{ display: "inline-flex" }}
                        className=" form-control date-picker"
                      />
                    </Col>
                  </Row>
                </div>
                <br></br>
              </Col>

              <Col md={3}>
                <div className="custom-grid">
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          VA(%)
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <NumberInputField
                        placeholder="Wastage"
                        id={"wastage"}
                        value={filterValues.wastage}
                        isRequired={false}
                        min={0}
                        type={"number"}
                        setValue={setValue}
                        handleKeyDownEvents={true}
                        handleDecimalDigits={true}
                        decimalValues={2}
                        SetValue={(value) => {
                          handleFilterChange("wastage", value);
                          clearErrors("wastage");
                        }}
                        minError={"wastage should less than or equal to 0"}
                        maxError={"wastage greater than or equal to 0"}
                        reqValueError={"wastage is Required"}
                        message={errors.wastage && errors.wastage.message}
                        register={register}
                      />
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          VA From
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <NumberInputField
                        register={register}
                        placeholder="weight Weight"
                        id={"vaWeightFrom"}
                        value={filterValues.vaWeightFrom}
                        isRequired={false}
                        min={0}
                        type={"number"}
                        setValue={setValue}
                        handleKeyDownEvents={true}
                        handleDecimalDigits={true}
                        decimalValues={3}
                        SetValue={(value) => {
                          handleFilterChange("vaWeightFrom", value);
                          clearErrors("vaWeightFrom");
                        }}
                        minError={"Va weight should less than or equal to 0"}
                        maxError={"Va Weight greater than or equal to 0"}
                        reqValueError={"Va weight is Required"}
                        message={
                          errors.vaWeightFrom && errors.vaWeightFrom.message
                        }
                      />
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          VA To
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <NumberInputField
                        register={register}
                        placeholder="Wastage wEIGHT"
                        id={"vaWeightTo"}
                        value={filterValues.vaWeightTo}
                        isRequired={false}
                        min={0}
                        type={"number"}
                        setValue={setValue}
                        handleKeyDownEvents={true}
                        handleDecimalDigits={true}
                        decimalValues={3}
                        SetValue={(value) => {
                          handleFilterChange("vaWeightTo", value);
                          clearErrors("vaWeightTo");
                        }}
                        minError={"Va weight should less than or equal to 0"}
                        maxError={"Va Weight greater than or equal to 0"}
                        reqValueError={"Va weight is Required"}
                        message={errors.vaWeightTo && errors.vaWeightTo.message}
                      />
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Gwt From
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <NumberInputField
                        register={register}
                        placeholder="Gross weight From"
                        id={"grossWeightFrom"}
                        value={filterValues.grossWeightFrom}
                        isRequired={false}
                        min={0}
                        type={"number"}
                        setValue={setValue}
                        handleKeyDownEvents={true}
                        handleDecimalDigits={true}
                        decimalValues={3}
                        SetValue={(value) => {
                          handleFilterChange("grossWeightFrom", value);
                          clearErrors("grossWeightFrom");
                        }}
                        minError={"Gross weight should less than or equal to 0"}
                        maxError={"Gross Weight greater than or equal to 0"}
                        reqValueError={"Gross weight is Required"}
                        message={
                          errors.grossWeightFrom &&
                          errors.grossWeightFrom.message
                        }
                      />
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Gwt To
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <NumberInputField
                        register={register}
                        placeholder="Gross weight To"
                        id={"grossWeightTo"}
                        value={filterValues.grossWeightTo}
                        isRequired={false}
                        min={0}
                        type={"number"}
                        setValue={setValue}
                        handleKeyDownEvents={true}
                        handleDecimalDigits={true}
                        decimalValues={3}
                        SetValue={(value) => {
                          handleFilterChange("grossWeightTo", value);
                          clearErrors("grossWeightTo");
                        }}
                        minError={"Gross weight should less than or equal to 0"}
                        maxError={"Gross Weight greater than or equal to 0"}
                        reqValueError={"Gross weight is Required"}
                        message={
                          errors.grossWeightTo && errors.grossWeightTo.message
                        }
                      />
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Supplier
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <SupplierDropdown
                        register={register}
                        id={"idSupplier"}
                        supplier={supplier}
                        selectedSupplier={filterValues.selectedSupplier}
                        onSupplierChange={(value) => {
                          handleFilterChange("selectedSupplier", value);
                        }}
                        isRequired={false}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        message={
                          errors.selectedSupplier && "Supplier is Required"
                        }
                      />
                    </Col>
                  </Row>
                </div>{" "}
                <br></br>
              </Col>
            </Row>

            {/* <Row md={12} className="form-group row g-4">
              <Col lg={10}></Col>
              <Col lg={2}>
                <div style={{ marginTop: "20px" }}>
                  <Button
                    disabled={issubmitting || filterTagList.filter((tag) => tag.isChecked === true)?.length == 0}
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => printTags()}
                  >
                    {issubmitting ? "Printing" : "Print"}
                  </Button>
                </div>
              </Col>
            </Row> */}

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
                        <th className="tableHeadFixed" >
                          S.NO
                          <input
                            type="checkbox"
                            onChange={(event) => {
                              selectAllCol(event.target.checked);
                              setSelectAll(event.target.checked);
                            }}
                            checked={selectAll}
                          />{" "}
                        </th>
                        <th className="tableHeadFixed" >Name</th>
                        <th className="tableHeadFixed" >Image</th>
                        <th className="tableHeadFixed" >Tag Code</th>
                        <th className="tableHeadFixed" width="100%;">Product</th>
                        <th className="tableHeadFixed" >Design</th>
                        <th className="tableHeadFixed" >S.Design</th>
                        <th className="tableHeadFixed" >Supplier</th>
                        <th className="tableHeadFixed" >Purity</th>
                        <th className="tableHeadFixed" >Piece</th>
                        <th className="tableHeadFixed" >Gwt</th>
                        <th className="tableHeadFixed" >Lwt</th>
                        <th className="tableHeadFixed" >Nwt</th>
                        <th className="tableHeadFixed" >Stn Wt</th>
                        <th className="tableHeadFixed" >Dia Wt</th>
                        <th className="tableHeadFixed" >
                          Mc{" "}
                          {BulkEditType == 2 && BulkEditType != 13 ? (
                            <div>
                              {" "}
                              <InputFieldWithDropdown
                                register={register}
                                placeholder="MC"
                                id={"bulkMcUpdate"}
                                value={bulkMcUpdate}
                                isRequired={false}
                                min={0}
                                type={"number"}
                                handleKeyDownEvents={true}
                                handleDecimalDigits={true}
                                decimalValues={2}
                                SetValue={(value) => {
                                  clearErrors("bulkMcUpdate");
                                  SetbulkMcUpdate(value);
                                  handleBulkChanges(value, "tag_mc_value");
                                }}
                                optionId={"bulkMcTypeUpdate"}
                                name={"bulkMcTypeUpdate"}
                                options={calcTypeOptions}
                                setValue={setValue}
                                onDropDownChange={(value) => {
                                  SetBulkMcTypeUpdate(value);
                                  handleBulkChanges(value, "tag_mc_type");
                                }}
                                selectedOption={bulkMcTypeUpdate}
                                minError={"MC should less than or equal to 0"}
                                maxError={
                                  "MC should greater than or equal to 0"
                                }
                                reqValueError={"MC is Required"}
                                message={
                                  errors["bulkMcTypeUpdate"] &&
                                  errors["bulkMcTypeUpdate"].message
                                }
                              ></InputFieldWithDropdown>
                            </div>
                          ) : (
                            ""
                          )}{" "}
                        </th>
                        <th className="tableHeadFixed" >

                          {BulkEditType == 2 && BulkEditType != 13 ? (
                            <div>
                              Flat Mc
                            </div>
                          ) : (
                            ""
                          )}{" "}
                        </th>
                        <th className="tableHeadFixed" >
                          VA(%){" "}
                          {BulkEditType == 1 && BulkEditType != 13 ? (
                            <div>
                              {" "}
                              <NumberInputField
                                placeholder="VA(%)"
                                id={"bulkVaUpdate"}
                                value={bulkVaUpdate}
                                isRequired={false}
                                min={0}
                                max={100}
                                type={"number"}
                                setValue={setValue}
                                handleKeyDownEvents={true}
                                handleDecimalDigits={true}
                                decimalValues={2}
                                SetValue={(value) => {
                                  SetBulkVaUpdate(value);
                                  handleBulkChanges(value);
                                }}
                                minError={
                                  "wastage should less than or equal to 0"
                                }
                                maxError={"wastage greater than or equal to 0"}
                                reqValueError={"wastage is Required"}
                                message={
                                  errors.bulkVaUpdate &&
                                  errors.bulkVaUpdate.message
                                }
                                register={register}
                              />{" "}
                            </div>
                          ) : (
                            ""
                          )}{" "}
                        </th>
                        <th className="tableHeadFixed">VA(Grams)</th>
                        <th className="tableHeadFixed">Attribute</th>
                        <th className="tableHeadFixed">Calculation Type</th>
                        <th className="tableHeadFixed">
                          MRP Price :{" "}
                          {BulkEditType == 6 && BulkEditType != 13 ? (
                            <div>
                              {" "}
                              <NumberInputField
                                placeholder="MRP Price"
                                id={"bulkMrpUpdate"}
                                value={bulkMrpUpdate}
                                isRequired={false}
                                min={0}
                                type={"number"}
                                setValue={setValue}
                                handleKeyDownEvents={true}
                                handleDecimalDigits={true}
                                decimalValues={2}
                                SetValue={(value) => {
                                  SetBulkMrpUpdate(value);
                                  handleBulkChanges(value);
                                }}
                                minError={"MRP should less than or equal to 0"}
                                maxError={"MRP greater than or equal to 0"}
                                reqValueError={"MRP is Required"}
                                message={
                                  errors.bulkMrpUpdate &&
                                  errors.bulkMrpUpdate.message
                                }
                                register={register}
                              />{" "}
                            </div>
                          ) : (
                            ""
                          )}{" "}
                        </th>
                        <th className="tableHeadFixed">HUID</th>
                        <th className="tableHeadFixed">HUID 2</th>
                        <th className="tableHeadFixed">Pur VA(%)</th>
                        <th className="tableHeadFixed">Pur Mc</th>
                        <th className="tableHeadFixed">Pur Touch</th>
                        <th className="tableHeadFixed">Pur Wt</th>
                        <th className="tableHeadFixed">Pur Rate</th>
                        <th className="tableHeadFixed">Pur Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterTagList.map((item, rowIndex) => (
                        <tr key={rowIndex}>
                          <td>
                            {rowIndex + 1}
                            <input
                              type="checkbox"
                              onChange={(event) => {
                                handleFormChange(
                                  rowIndex,
                                  "isChecked",
                                  event.target.checked
                                );
                              }}
                              checked={item.isChecked}
                            />{" "}
                          </td>
                          <td>{item.supplier_name}</td>
                          <td>
                            {item.image != null ? (
                              <img
                                style={{
                                  height: "44px",
                                  width: "44px",
                                  borderRadius: "50%",
                                }}
                                src={item.image}
                                alt="preview"
                                onClick={() =>
                                  toggle({
                                    rowIndex: rowIndex,
                                    imageData: item.tag_images,
                                  })
                                }
                              />
                            ) : (
                              <UserAvatar
                                text={item.image_text}
                                onClick={() =>
                                  toggle({
                                    rowIndex: rowIndex,
                                    imageData: item.tag_images,
                                  })
                                }
                              />
                            )}
                          </td>
                          <td>{item.tag_code}</td>
                          <td style={{ width: "20px" }}>{item.product_name}</td>
                          <td>
                            {BulkEditType === 11 && BulkEditType != 13 ? (
                              <div style={{ width: "150px" }}>
                                <DesignDropdown
                                  register={register}
                                  id={"updateDesign_" + rowIndex}
                                  isRequired={true}
                                  designs={designs}
                                  selectedProduct={item.tag_product_id}
                                  selectedDesign={item.tag_design_id}
                                  onDesignChange={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "tag_design_id",
                                      value
                                    );
                                    handleFormChange(
                                      rowIndex,
                                      "tag_sub_design_id",
                                      ""
                                    );
                                  }}
                                  clearErrors={clearErrors}
                                  setValue={setValue}
                                  message={
                                    errors["updateDesign_" + rowIndex] &&
                                    "Design is Required"
                                  }
                                />{" "}
                              </div>
                            ) : (
                              item.design_name
                            )}
                          </td>
                          <td>
                            {BulkEditType === 11 && BulkEditType != 13 ? (
                              <div style={{ width: "150px" }}>
                                <SubDesignDropdown
                                  register={register}
                                  id={"updateSubDesign_" + rowIndex}
                                  subDesigns={subDesigns}
                                  selectedProduct={item.tag_product_id}
                                  selectedDesign={item.tag_design_id}
                                  selectedSubDesign={item.tag_sub_design_id}
                                  onSubDesignChange={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "tag_sub_design_id",
                                      value
                                    );
                                  }}
                                  isRequired={true}
                                  clearErrors={clearErrors}
                                  setValue={setValue}
                                  message={
                                    errors["updateSubDesign_" + rowIndex] &&
                                    "Sub Design is Required"
                                  }
                                />
                              </div>
                            ) : (
                              item.sub_design_name
                            )}
                          </td>

                          <td>{item?.supplier_name}</td>

                          <td>
                            {BulkEditType === 5 && BulkEditType != 13 ? (
                              <div style={{ width: "150px" }}>
                                <PurityDropdown
                                  register={register}
                                  id={"updatePurity_" + rowIndex}
                                  purities={purities}
                                  onPurityChange={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "tag_purity_id",
                                      value
                                    );
                                  }}
                                  selectedPurity={item.tag_purity_id}
                                  isRequired={false}
                                  clearErrors={clearErrors}
                                  setValue={setValue}
                                  message={
                                    errors["updatePurity_" + rowIndex] &&
                                    "Purity is Required"
                                  }
                                />
                              </div>
                            ) : (
                              item.tag_purity
                            )}
                          </td>

                          <td>
                            {BulkEditType === 4 && BulkEditType != 13 ? (
                              <div style={{ width: "150px" }}>
                                <NumberInputField
                                  placeholder="Pcs"
                                  id={"updatePcs_" + rowIndex}
                                  value={item.tag_pcs}
                                  isRequired={true}
                                  min={0}
                                  type={"number"}
                                  setValue={setValue}
                                  handleKeyDownEvents={true}
                                  handleDecimalDigits={true}
                                  decimalValues={0}
                                  SetValue={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "tag_pcs",
                                      value
                                    );
                                    clearErrors("updatePcs_" + rowIndex);
                                  }}
                                  minError={
                                    "Pcs should less than or equal to 0"
                                  }
                                  maxError={"Pcs greater than or equal to 0"}
                                  reqValueError={"Pcs is Required"}
                                  message={
                                    errors["updatePcs_" + rowIndex] &&
                                    errors["updatePcs_" + rowIndex].message
                                  }
                                  register={register}
                                />
                              </div>
                            ) : (
                              item.tag_pcs
                            )}
                          </td>

                          <td>
                            {BulkEditType === 3 && BulkEditType != 13 ? (
                              <div style={{ width: "150px" }}>
                                <InputFieldWithDropdown
                                  register={register}
                                  placeholder="Gross weight"
                                  id={"UpdateGwt_" + rowIndex}
                                  value={item.tag_gwt}
                                  isRequired={true}
                                  min={0}
                                  type={"number"}
                                  optionId={"UpdateUomId_" + rowIndex}
                                  name={"UpdateUomId_" + rowIndex}
                                  options={UomOptions}
                                  setValue={setValue}
                                  handleKeyDownEvents={true}
                                  handleDecimalDigits={true}
                                  decimalValues={3}
                                  onDropDownChange={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "tag_uom_id",
                                      value
                                    );
                                  }}
                                  selectedOption={item.tag_uom_id}
                                  SetValue={(value) => {
                                    let net_wt = calculateNetWeight({
                                      gross_weight: value,
                                      less_weight: item.tag_lwt,
                                      other_metal_weight:
                                        item.tag_other_metal_wt,
                                    });
                                    const productDetails = products.find(
                                      (prod) =>
                                        prod.pro_id === item.tag_product_id
                                    );
                                    const wastage_calc_type =
                                      productDetails.wastage_calc_type;

                                    if (net_wt > 0) {
                                      handleFormChange(
                                        rowIndex,
                                        "tag_gwt",
                                        value
                                      );
                                      handleFormChange(
                                        rowIndex,
                                        "tag_nwt",
                                        net_wt
                                      );
                                      let wastageWeight =
                                        calculateWastageWeight({
                                          wastagePercentage:
                                            item.tag_wastage_percentage,
                                          calculationType: wastage_calc_type,
                                          netWeight: item.tag_nwt,
                                          grossWeight: value,
                                        });
                                      let pureWeight = calculatePureWeight({
                                        netWeight: item.tag_nwt,
                                        purchaseTouch: isUndefined(item.tag_purchase_touch),
                                        purchaseWastage: isUndefined(item.tag_purchase_va),
                                        pureCalcType:
                                          isUndefined(item.tag_purchase_calc_ype),
                                      });
                                      let purchaseCost = calculatePurchaseCost({
                                        purchaseRate: isUndefined(item.tag_purchase_rate),
                                        piece: item.tag_pcs,
                                        netWeight: item.tag_nwt,
                                        purchaseMc: isUndefined(item.tag_purchase_mc),
                                        pureWeight: pureWeight,
                                        purchaseMcType:
                                          item.tag_purchase_mc_type,
                                        mcType: item.tag_mc_type,
                                        mcValue: item.tag_mc_value,
                                        rateCalcType:
                                          isUndefined(item.tag_purchase_rate_calc_type),
                                      });
                                      handleFormChange(
                                        rowIndex,
                                        "tag_wastage_wt",
                                        wastageWeight
                                      );
                                      handleFormChange(
                                        rowIndex,
                                        "tag_pure_wt",
                                        pureWeight
                                      );
                                      handleFormChange(
                                        rowIndex,
                                        "tag_purchase_cost",
                                        purchaseCost.purchaseCost
                                      );
                                      clearErrors("UpdateUomId_" + rowIndex);
                                    } else {
                                      setError("UpdateUomId_" + rowIndex, {
                                        type: "manual",
                                        message: "InValid Gross weight",
                                      });

                                      handleFormChange(
                                        rowIndex,
                                        "tag_gwt",
                                        value
                                      );
                                    }
                                  }}
                                  minError={
                                    "Gross weight should less than or equal to 0"
                                  }
                                  maxError={
                                    "Gross Weight greater than or equal to 0"
                                  }
                                  reqValueError={"Gross weight is Required"}
                                  message={
                                    errors["UpdateUomId_" + rowIndex] &&
                                    errors["UpdateUomId_" + rowIndex].message
                                  }
                                ></InputFieldWithDropdown>{" "}
                              </div>
                            ) : (
                              item.tag_gwt
                            )}
                          </td>

                          <td>
                            {BulkEditType === 3 && BulkEditType != 13 ? (
                              <div style={{ width: "150px" }}>
                                <LessWeightInputField
                                  register={register}
                                  placeholder="Less Weight"
                                  id={"UpdateLwt_" + rowIndex}
                                  value={item.tag_lwt}
                                  isRequired={false}
                                  min={0}
                                  uom={uom}
                                  gross_weight={item.tag_gwt}
                                  less_weight={item.tag_lwt}
                                  SetValue={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "tag_lwt",
                                      value
                                    );
                                    let net_wt = calculateNetWeight({
                                      gross_weight: item.tag_gwt,
                                      less_weight: value,
                                      other_metal_weight:
                                        item.tag_other_metal_wt,
                                    });
                                    handleFormChange(
                                      rowIndex,
                                      "tag_nwt",
                                      net_wt
                                    );
                                  }}
                                  SetStnWeight={(value) =>
                                    handleFormChange(
                                      rowIndex,
                                      "tag_stn_wt",
                                      value
                                    )
                                  }
                                  SetDiaWeight={(value) =>
                                    handleFormChange(
                                      rowIndex,
                                      "tag_dia_wt",
                                      value
                                    )
                                  }
                                  SetStoneDetails={(value) => {
                                    handleStoneDetails(
                                      rowIndex,
                                      "stone_details",
                                      value
                                    );
                                  }}
                                  stone_details={item.stone_details}
                                  ref={lessWeightRef}
                                  stone={stone}
                                  quality_code={quality_code}
                                />
                              </div>
                            ) : (
                              item.tag_lwt
                            )}
                          </td>

                          <td>{item.tag_nwt}</td>

                          <td>{item.tag_stn_wt}</td>
                          <td>{item.tag_dia_wt}</td>

                          <td>
                            {BulkEditType === 2 && BulkEditType != 13 ? (
                              <div style={{ width: "200px" }}>
                                <InputFieldWithDropdown
                                  register={register}
                                  placeholder="MC"
                                  id={"updateMc_" + rowIndex}
                                  value={item.tag_mc_value}
                                  isRequired={false}
                                  min={0}
                                  type={"number"}
                                  handleKeyDownEvents={true}
                                  handleDecimalDigits={true}
                                  decimalValues={2}
                                  SetValue={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "tag_mc_value",
                                      value
                                    );
                                    clearErrors("updateMc_" + rowIndex);
                                  }}
                                  optionId={"updateMcType_" + rowIndex}
                                  name={"updateMcType_" + rowIndex}
                                  options={calcTypeOptions}
                                  setValue={setValue}
                                  onDropDownChange={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "tag_mc_type",
                                      value
                                    );
                                  }}
                                  selectedOption={item.tag_mc_type}
                                  minError={"MC should less than or equal to 0"}
                                  maxError={
                                    "MC should greater than or equal to 0"
                                  }
                                  reqValueError={"MC is Required"}
                                  message={
                                    errors["updateMc_" + rowIndex] &&
                                    errors["updateMc_" + rowIndex].message
                                  }
                                ></InputFieldWithDropdown>{" "}
                              </div>
                            ) : (
                              item.tag_mc_value + "/" + item.tag_mc_type_name
                            )}
                          </td>
                          <td>


                            {BulkEditType === 2 && BulkEditType != 13 ? (
                              <div style={{ width: "150px" }}>
                                <TextInputField
                                  register={register}
                                  placeholder="Flat Mc"
                                  id={"flat_mc_value" + rowIndex}
                                  value={item.flat_mc_value}
                                  isRequired={false}
                                  type={"text"}
                                  setValue={setValue}
                                  SetValue={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "flat_mc_value",
                                      value
                                    );
                                    clearErrors("flat_mc_value" + rowIndex);
                                  }}

                                  message={
                                    errors["flat_mc_value" + rowIndex] &&
                                    errors["flat_mc_value" + rowIndex].message
                                  }
                                />
                              </div>
                            ) : (
                              item.flat_mc_value
                            )}
                          </td>
                          <td>
                            {BulkEditType === 1 && BulkEditType != 13 ? (
                              <div style={{ width: "150px" }}>
                                <NumberInputField
                                  placeholder="Wastage"
                                  id={"updateWastage_" + rowIndex}
                                  value={item.tag_wastage_percentage}
                                  isRequired={false}
                                  min={0}
                                  type={"number"}
                                  setValue={setValue}
                                  handleKeyDownEvents={true}
                                  handleDecimalDigits={true}
                                  decimalValues={2}
                                  SetValue={(value) => {
                                    const productDetails = products.find(
                                      (prod) =>
                                        prod.pro_id === item.tag_product_id
                                    );
                                    const wastage_calc_type =
                                      productDetails.wastage_calc_type;

                                    handleFormChange(
                                      rowIndex,
                                      "tag_wastage_percentage",
                                      value
                                    );
                                    let wastageWeight = calculateWastageWeight({
                                      wastagePercentage: value,
                                      calculationType: wastage_calc_type,
                                      netWeight: item.tag_nwt,
                                      grossWeight: item.tag_gwt,
                                    });
                                    handleFormChange(
                                      rowIndex,
                                      "tag_wastage_wt",
                                      wastageWeight
                                    );
                                    clearErrors("updateWastage_" + rowIndex);
                                  }}
                                  minError={
                                    "wastage should less than or equal to 0"
                                  }
                                  maxError={
                                    "wastage greater than or equal to 0"
                                  }
                                  reqValueError={"wastage is Required"}
                                  message={
                                    errors["updateWastage_" + rowIndex] &&
                                    errors["updateWastage_" + rowIndex].message
                                  }
                                  register={register}
                                />
                              </div>
                            ) : (
                              item.tag_wastage_percentage
                            )}
                          </td>
                          <td>
                            {BulkEditType === 1 && BulkEditType != 13 ? (
                              <div style={{ width: "150px" }}>
                                <NumberInputField
                                  placeholder="Wastage WT"
                                  id={"updateWastageWt_" + rowIndex}
                                  value={item.tag_wastage_wt}
                                  isRequired={false}
                                  min={0}
                                  type={"number"}
                                  setValue={setValue}
                                  handleKeyDownEvents={true}
                                  handleDecimalDigits={true}
                                  decimalValues={3}
                                  SetValue={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "tag_wastage_wt",
                                      value
                                    );

                                    clearErrors("updateWastageWt_" + rowIndex);
                                  }}
                                  minError={
                                    "wastage should less than or equal to 0"
                                  }
                                  maxError={
                                    "wastage greater than or equal to 0"
                                  }
                                  reqValueError={"wastage is Required"}
                                  message={
                                    errors["updateWastageWt_" + rowIndex] &&
                                    errors["updateWastage_" + rowIndex].message
                                  }
                                  register={register}
                                />
                              </div>
                            ) : (
                              item.tag_wastage_wt
                            )}
                          </td>
                          <td>
                            <Button
                              color="primary"
                              size="md"
                              onClick={() => {
                                toggleModal({
                                  rowIndex: rowIndex,
                                  tagAttr: item.tag_attributes,
                                });
                              }}
                            >
                              Add
                            </Button>
                          </td>
                          <td>
                            {BulkEditType === 7 && BulkEditType != 13 ? (
                              <div style={{ width: "150px" }}>
                                <ProductCalculationTypeDropdown
                                  register={register}
                                  isRequired={true}
                                  id={"updateCalcType_" + rowIndex}
                                  placeholder="Calculation Based On"
                                  value={item.tag_calculation_type}
                                  selectedCalType={item.tag_calculation_type}
                                  optionLabel="Select Calculation Based On"
                                  product_Calculation_Types={calType}
                                  setValue={setValue}
                                  onCalTypeChange={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "tag_calculation_type",
                                      value
                                    );
                                    let wastageWeight = calculateWastageWeight({
                                      wastagePercentage:
                                        tag.tag_wastage_percentage,
                                      calculationType: value,
                                      netWeight: item.tag_nwt,
                                      grossWeight: item.tag_gwt,
                                    });
                                    handleFormChange(
                                      rowIndex,
                                      "tag_wastage_wt",
                                      wastageWeight
                                    );
                                    clearErrors("updateCalcType_" + rowIndex);
                                  }}
                                  message={
                                    errors["updateCalcType_" + rowIndex] &&
                                    "Calculation Based On is Required"
                                  }
                                />
                              </div>
                            ) : (
                              item.tag_calculation_type_name
                            )}
                          </td>
                          <td>
                            {BulkEditType === 6 && BulkEditType != 13 ? (
                              <div style={{ width: "150px" }}>
                                <NumberInputField
                                  placeholder="MRP Price"
                                  id={"updateSaleValue_" + rowIndex}
                                  value={item.tag_sell_rate}
                                  isRequired={false}
                                  min={0}
                                  type={"number"}
                                  setValue={setValue}
                                  handleKeyDownEvents={true}
                                  handleDecimalDigits={true}
                                  decimalValues={2}
                                  SetValue={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "tag_sell_rate",
                                      value
                                    );
                                    clearErrors("updateSaleValue_" + rowIndex);
                                  }}
                                  minError={
                                    "MRP Prise should less than or equal to 0"
                                  }
                                  maxError={
                                    "MRP Prise greater than or equal to 0"
                                  }
                                  reqValueError={"MRP Prise is Required"}
                                  message={
                                    errors["updateSaleValue_" + rowIndex] &&
                                    errors["updateSaleValue_" + rowIndex]
                                      .message
                                  }
                                  register={register}
                                />
                              </div>
                            ) : (
                              item.tag_sell_rate
                            )}
                          </td>

                          <td>
                            {BulkEditType === 8 && BulkEditType != 13 ? (
                              <div style={{ width: "150px" }}>
                                <TextInputField
                                  placeholder="HUID"
                                  id={"updateHuid_" + rowIndex}
                                  value={item.tag_huid}
                                  isRequired={false}
                                  type={"text"}
                                  SetValue={(value) => {
                                    value = value.toUpperCase();
                                    if (value && validate_HUID(value)) {
                                      handleFormChange(
                                        rowIndex,
                                        "tag_huid",
                                        value
                                      );
                                      clearErrors("updateHuid_" + rowIndex);
                                    } else {
                                      handleFormChange(
                                        rowIndex,
                                        "tag_huid",
                                        value
                                      );
                                      setError("updateHuid_" + rowIndex, {
                                        type: "manual",
                                        message: "InValid HUID",
                                      });
                                    }
                                  }}
                                  message={
                                    errors["updateHuid_" + rowIndex] &&
                                    errors["updateHuid_" + rowIndex].message
                                  }
                                  register={register}
                                />
                              </div>
                            ) : (
                              item.tag_huid
                            )}
                          </td>
                          <td>
                            {BulkEditType === 8 && BulkEditType != 13 ? (
                              <div style={{ width: "150px" }}>
                                <TextInputField
                                  placeholder="HUID 2"
                                  id={"updateHuid2_" + rowIndex}
                                  value={item.tag_huid2}
                                  isRequired={false}
                                  type={"text"}
                                  SetValue={(value) => {
                                    value = value.toUpperCase();
                                    if (value && validate_HUID(value)) {
                                      handleFormChange(
                                        rowIndex,
                                        "tag_huid2",
                                        value
                                      );
                                      clearErrors("updateHuid2_" + rowIndex);
                                    } else {
                                      handleFormChange(
                                        rowIndex,
                                        "tag_huid2",
                                        value
                                      );
                                      setError("updateHuid2_" + rowIndex, {
                                        type: "manual",
                                        message: "InValid HUID",
                                      });
                                    }
                                  }}
                                  message={
                                    errors["updateHuid2_" + rowIndex] &&
                                    errors["updateHuid2_" + rowIndex].message
                                  }
                                  register={register}
                                />
                              </div>
                            ) : (
                              item.tag_huid2
                            )}
                          </td>

                          <td>
                            {BulkEditType === 10 && BulkEditType != 13 ? (
                              <div style={{ width: "80px" }}>
                                <NumberInputField
                                  placeholder="Purchase Wastage"
                                  id={"updatePurWastage_" + rowIndex}
                                  value={item.tag_purchase_va}
                                  isRequired={false}
                                  min={0}
                                  type={"number"}
                                  setValue={setValue}
                                  handleKeyDownEvents={true}
                                  handleDecimalDigits={true}
                                  decimalValues={2}
                                  SetValue={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "tag_purchase_va",
                                      value
                                    );
                                    clearErrors("updatePurWastage_" + rowIndex);
                                    let pureWeight = calculatePureWeight({
                                      netWeight: item.tag_nwt,
                                      purchaseTouch: item.tag_purchase_touch,
                                      purchaseWastage: item.tag_purchase_va,
                                      pureCalcType: item.tag_purchase_calc_ype,
                                    });
                                    let purchaseCost = calculatePurchaseCost({
                                      purchaseRate: item.tag_purchase_rate,
                                      piece: item.tag_pcs,
                                      netWeight: item.tag_nwt,
                                      purchaseMc: item.tag_purchase_mc,
                                      pureWeight: pureWeight,
                                      purchaseMcType: item.tag_purchase_mc_type,
                                      mcType: item.tag_mc_type,
                                      mcValue: item.tag_mc_value,
                                      rateCalcType:
                                        item.tag_purchase_rate_calc_type,
                                    });
                                    handleFormChange(
                                      rowIndex,
                                      "tag_pure_wt",
                                      pureWeight
                                    );
                                    handleFormChange(
                                      rowIndex,
                                      "tag_purchase_cost",
                                      purchaseCost
                                    );
                                  }}
                                  minError={
                                    "Purchase Wastage should less than or equal to 0"
                                  }
                                  maxError={
                                    "Purchase Wastage greater than or equal to 0"
                                  }
                                  reqValueError={"Purchase Wastage is Required"}
                                  message={
                                    errors["updatePurWastage_" + rowIndex] &&
                                    errors["updatePurWastage_" + rowIndex]
                                      .message
                                  }
                                  register={register}
                                />
                              </div>
                            ) : (
                              item.tag_purchase_va
                            )}
                          </td>

                          <td>
                            {BulkEditType === 10 && BulkEditType != 13 ? (
                              <div style={{ width: "200px" }}>
                                <InputFieldWithDropdown
                                  register={register}
                                  placeholder="Purchase MC"
                                  id={"updatePurMc_" + rowIndex}
                                  value={item.tag_purchase_mc}
                                  isRequired={false}
                                  min={0}
                                  type={"number"}
                                  handleKeyDownEvents={true}
                                  handleDecimalDigits={true}
                                  decimalValues={2}
                                  SetValue={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "tag_purchase_mc",
                                      value
                                    );
                                    let pureWeight = calculatePureWeight({
                                      netWeight: item.tag_nwt,
                                      purchaseTouch: item.tag_purchase_touch,
                                      purchaseWastage: item.tag_purchase_va,
                                      pureCalcType: item.tag_purchase_calc_ype,
                                    });
                                    let purchaseCost = calculatePurchaseCost({
                                      purchaseRate: item.tag_purchase_rate,
                                      piece: item.tag_pcs,
                                      netWeight: item.tag_nwt,
                                      purchaseMc: item.tag_purchase_mc,
                                      pureWeight: pureWeight,
                                      purchaseMcType: item.tag_purchase_mc_type,
                                      mcType: item.tag_mc_type,
                                      mcValue: item.tag_mc_value,
                                      rateCalcType:
                                        item.tag_purchase_rate_calc_type,
                                    });
                                    handleFormChange(
                                      rowIndex,
                                      "tag_pure_wt",
                                      pureWeight
                                    );
                                    handleFormChange(
                                      rowIndex,
                                      "tag_purchase_cost",
                                      purchaseCost
                                    );
                                    clearErrors("updatePurMc_" + rowIndex);
                                  }}
                                  optionId={"updateMcType_" + rowIndex}
                                  name={"updateMcType_" + rowIndex}
                                  options={calcTypeOptions}
                                  setValue={setValue}
                                  onDropDownChange={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "tag_purchase_mc_type",
                                      value
                                    );
                                    let pureWeight = calculatePureWeight({
                                      netWeight: item.tag_nwt,
                                      purchaseTouch: item.tag_purchase_touch,
                                      purchaseWastage: item.tag_purchase_va,
                                      pureCalcType: item.tag_purchase_calc_ype,
                                    });
                                    let purchaseCost = calculatePurchaseCost({
                                      purchaseRate: item.tag_purchase_rate,
                                      piece: item.tag_pcs,
                                      netWeight: item.tag_nwt,
                                      purchaseMc: item.tag_purchase_mc,
                                      pureWeight: pureWeight,
                                      purchaseMcType: item.tag_purchase_mc_type,
                                      mcType: item.tag_mc_type,
                                      mcValue: item.tag_mc_value,
                                      rateCalcType:
                                        item.tag_purchase_rate_calc_type,
                                    });
                                    handleFormChange(
                                      rowIndex,
                                      "tag_pure_wt",
                                      pureWeight
                                    );
                                    handleFormChange(
                                      rowIndex,
                                      "tag_purchase_cost",
                                      purchaseCost
                                    );
                                  }}
                                  selectedOption={item.tag_purchase_mc_type}
                                  minError={
                                    "Purchase MC should less than or equal to 0"
                                  }
                                  maxError={
                                    "Purchase MC should greater than or equal to 0"
                                  }
                                  reqValueError={"Purchase MC is Required"}
                                  message={
                                    errors["updatePurMc_" + rowIndex] &&
                                    errors["updatePurMc_" + rowIndex].message
                                  }
                                />{" "}
                              </div>
                            ) : (
                              item.tag_purchase_mc +
                              "/" +
                              item.tag_purchase_mc_type_name
                            )}
                          </td>

                          <td>
                            {BulkEditType === 10 && BulkEditType != 13 ? (
                              <div style={{ width: "80px" }}>
                                <NumberInputField
                                  placeholder="Purchase Touch"
                                  id={"updatePurTouch_" + rowIndex}
                                  value={item.tag_purchase_touch}
                                  isRequired={false}
                                  min={0}
                                  type={"number"}
                                  setValue={setValue}
                                  handleKeyDownEvents={true}
                                  handleDecimalDigits={true}
                                  decimalValues={2}
                                  SetValue={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "tag_purchase_touch",
                                      value
                                    );
                                    clearErrors("updatePurTouch_" + rowIndex);
                                    let pureWeight = calculatePureWeight({
                                      netWeight: item.tag_nwt,
                                      purchaseTouch: item.tag_purchase_touch,
                                      purchaseWastage: item.tag_purchase_va,
                                      pureCalcType: item.tag_purchase_calc_ype,
                                    });
                                    let purchaseCost = calculatePurchaseCost({
                                      purchaseRate: item.tag_purchase_rate,
                                      piece: item.tag_pcs,
                                      netWeight: item.tag_nwt,
                                      purchaseMc: item.tag_purchase_mc,
                                      pureWeight: pureWeight,
                                      purchaseMcType: item.tag_purchase_mc_type,
                                      mcType: item.tag_mc_type,
                                      mcValue: item.tag_mc_value,
                                      rateCalcType:
                                        item.tag_purchase_rate_calc_type,
                                    });
                                    handleFormChange(
                                      rowIndex,
                                      "tag_pure_wt",
                                      pureWeight
                                    );
                                    handleFormChange(
                                      rowIndex,
                                      "tag_purchase_cost",
                                      purchaseCost
                                    );
                                  }}
                                  minError={
                                    "Purchase Touch should less than or equal to 0"
                                  }
                                  maxError={
                                    "Purchase Touch greater than or equal to 0"
                                  }
                                  reqValueError={"Purchase Touch is Required"}
                                  message={
                                    errors["updatePurTouch_" + rowIndex] &&
                                    errors["updatePurTouch_" + rowIndex].message
                                  }
                                  register={register}
                                />
                              </div>
                            ) : (
                              item.tag_purchase_touch
                            )}
                          </td>

                          <td>
                            {BulkEditType === 10 && BulkEditType != 13 ? (
                              <div style={{ width: "220px" }}>
                                <InputFieldWithDropdown
                                  register={register}
                                  placeholder="Pure Weight"
                                  id={"updatePurWt_" + rowIndex}
                                  value={item.tag_pure_wt}
                                  isRequired={false}
                                  min={0}
                                  type={"number"}
                                  readOnly={true}
                                  optionId={"updatePurWtCalcType_" + rowIndex}
                                  name={"updatePurWtCalcType_" + rowIndex}
                                  options={PureCalcTypeOptions}
                                  setValue={setValue}
                                  onDropDownChange={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "tag_purchase_calc_type",
                                      value
                                    );
                                    let pureWeight = calculatePureWeight({
                                      netWeight: item.tag_nwt,
                                      purchaseTouch: item.tag_purchase_touch,
                                      purchaseWastage: item.tag_purchase_va,
                                      pureCalcType: item.tag_purchase_calc_ype,
                                    });
                                    let purchaseCost = calculatePurchaseCost({
                                      purchaseRate: item.tag_purchase_rate,
                                      piece: item.tag_pcs,
                                      netWeight: item.tag_nwt,
                                      purchaseMc: item.tag_purchase_mc,
                                      pureWeight: pureWeight,
                                      purchaseMcType: item.tag_purchase_mc_type,
                                      mcType: item.tag_mc_type,
                                      mcValue: item.tag_mc_value,
                                      rateCalcType:
                                        item.tag_purchase_rate_calc_type,
                                    });
                                    handleFormChange(
                                      rowIndex,
                                      "tag_pure_wt",
                                      pureWeight
                                    );
                                    handleFormChange(
                                      rowIndex,
                                      "tag_purchase_cost",
                                      purchaseCost
                                    );
                                  }}
                                  selectedOption={item.tag_purchase_calc_type}
                                  SetValue={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "tag_pure_wt",
                                      value
                                    );
                                    let pureWeight = calculatePureWeight({
                                      netWeight: item.tag_nwt,
                                      purchaseTouch: item.tag_purchase_touch,
                                      purchaseWastage: item.tag_purchase_va,
                                      pureCalcType: item.tag_purchase_calc_ype,
                                    });
                                    let purchaseCost = calculatePurchaseCost({
                                      purchaseRate: item.tag_purchase_rate,
                                      piece: item.tag_pcs,
                                      netWeight: item.tag_nwt,
                                      purchaseMc: item.tag_purchase_mc,
                                      pureWeight: pureWeight,
                                      purchaseMcType: item.tag_purchase_mc_type,
                                      mcType: item.tag_mc_type,
                                      mcValue: item.tag_mc_value,
                                      rateCalcType:
                                        item.tag_purchase_rate_calc_type,
                                    });
                                    handleFormChange(
                                      rowIndex,
                                      "tag_pure_wt",
                                      pureWeight
                                    );
                                    handleFormChange(
                                      rowIndex,
                                      "tag_purchase_cost",
                                      purchaseCost
                                    );
                                    clearErrors("updatePurWt_" + rowIndex);
                                  }}
                                  minError={
                                    "Rate should less than or equal to 0"
                                  }
                                  maxError={
                                    "Rate should greater than or equal to 0"
                                  }
                                  reqValueError={"Purchase Rate is Required"}
                                  message={
                                    errors["updatePurWt_" + rowIndex] &&
                                    errors["updatePurWt_" + rowIndex].message
                                  }
                                />
                                {/* </div> : item.tag_pure_wt + '/ ' + item.tag_purchase_calc_type_name)}</td> */}
                              </div>
                            ) : (
                              item.tag_pure_wt
                            )}
                          </td>

                          <td>
                            {BulkEditType === 10 && BulkEditType != 13 ? (
                              <div style={{ width: "220px" }}>
                                <InputFieldWithDropdown
                                  register={register}
                                  placeholder="Purchase Rate"
                                  id={"updatePurRate_" + rowIndex}
                                  value={item.tag_purchase_rate}
                                  isRequired={false}
                                  min={0}
                                  type={"number"}
                                  readOnly={false}
                                  optionId={"updatePurRateCalcType_" + rowIndex}
                                  name={"updatePurRateCalcType_" + rowIndex}
                                  options={calcTypeOptions}
                                  setValue={setValue}
                                  onDropDownChange={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "tag_purchase_rate_calc_type",
                                      value
                                    );
                                    let pureWeight = calculatePureWeight({
                                      netWeight: item.tag_nwt,
                                      purchaseTouch: item.tag_purchase_touch,
                                      purchaseWastage: item.tag_purchase_va,
                                      pureCalcType: item.tag_purchase_calc_ype,
                                    });
                                    let purchaseCost = calculatePurchaseCost({
                                      purchaseRate: item.tag_purchase_rate,
                                      piece: item.tag_pcs,
                                      netWeight: item.tag_nwt,
                                      purchaseMc: item.tag_purchase_mc,
                                      pureWeight: pureWeight,
                                      purchaseMcType: item.tag_purchase_mc_type,
                                      mcType: item.tag_mc_type,
                                      mcValue: item.tag_mc_value,
                                      rateCalcType:
                                        item.tag_purchase_rate_calc_type,
                                    });
                                    handleFormChange(
                                      rowIndex,
                                      "tag_pure_wt",
                                      pureWeight
                                    );
                                    handleFormChange(
                                      rowIndex,
                                      "tag_purchase_cost",
                                      purchaseCost
                                    );
                                  }}
                                  selectedOption={
                                    item.tag_purchase_rate_calc_type
                                  }
                                  SetValue={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "tag_purchase_rate",
                                      value
                                    );
                                    let pureWeight = calculatePureWeight({
                                      netWeight: item.tag_nwt,
                                      purchaseTouch: item.tag_purchase_touch,
                                      purchaseWastage: item.tag_purchase_va,
                                      pureCalcType: item.tag_purchase_calc_ype,
                                    });
                                    let purchaseCost = calculatePurchaseCost({
                                      purchaseRate: item.tag_purchase_rate,
                                      piece: item.tag_pcs,
                                      netWeight: item.tag_nwt,
                                      purchaseMc: item.tag_purchase_mc,
                                      pureWeight: pureWeight,
                                      purchaseMcType: item.tag_purchase_mc_type,
                                      mcType: item.tag_mc_type,
                                      mcValue: item.tag_mc_value,
                                      rateCalcType:
                                        item.tag_purchase_rate_calc_type,
                                    });
                                    handleFormChange(
                                      rowIndex,
                                      "tag_pure_wt",
                                      pureWeight
                                    );
                                    handleFormChange(
                                      rowIndex,
                                      "tag_purchase_cost",
                                      purchaseCost
                                    );
                                  }}
                                  minError={
                                    "Rate should less than or equal to 0"
                                  }
                                  maxError={
                                    "Rate should greater than or equal to 0"
                                  }
                                  reqValueError={"Purchase Rate is Required"}
                                  message={
                                    errors["updatePurRate_" + rowIndex] &&
                                    errors["updatePurRate_" + rowIndex].message
                                  }
                                ></InputFieldWithDropdown>{" "}
                              </div>
                            ) : (
                              item.tag_purchase_rate +
                              "/" +
                              item.tag_purchase_rate_calc_type_name
                            )}
                          </td>

                          <td>{item.tag_purchase_cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>
          </FormProvider>
        </PreviewCard>
        <MultiImageDropzone
          modal={modal}
          toggle={toggle}
          files={tagImages}
          setFiles={SetTagImages}
          handleDropChange={handleDropChange}
          isDefaultReq={true}
        />
        <AttributeModalForm
          isOpen={isModalOpen}
          toggle={toggleModal}
          onSave={handleAttributeDetails}
          initialOtherChargesDetails={tagAttr}
        />
      </Content>
    </React.Fragment>
  );
};

export default BulkEditForm;
