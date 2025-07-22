import React, { useContext, useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import Content from "../../../layout/content/Content";
import {
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import {
  Col,
  Row,
  SwitchInputField,
  TextInputField,
  NumberInputField,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  createProduct,
  getProductById,
  updateProductById,
} from "../../../redux/thunks/catalogMaster";
import IsRequired from "../../../components/erp-required/erp-required";
import {
  CategoryDropdown,
  MetalDropdown,
  UomDropdown,
  ProductCalculationTypeDropdown,
  TaxGroupDropdown,
  TaxMasterDropdown,
  SectionDropdown,
} from "../../../components/filters/retailFilters";
import {
  useCategories,
  useUom,
  useMetals,
  useCalType,
  useTaxGroup,
  useTaxMaster,
  useSections,
} from "../../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import ProfileImageUpload from "../../../components/input/profile-image/ProfileImageUpload";
import OtherWeightDownMulti from "../../../components/common/dropdown/OtherWeightDownMulti";
import { useShortCodeContext } from "../../../contexts/ShortCodeContexts";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import { useHotkeys } from "react-hotkeys-hook";

const ProductForm = () => {
  const location = useLocation();
  const { isShortCodeDisabled } = useShortCodeContext();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
    reset,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    isLoading: issubmitting,
    isError,
    productInfo,
  } = useSelector((state) => state.productReducer);

  const [hsnCode, setHsnCode] = useState();
  const [stockType, setStockType] = useState("0");
  const [stockreportType, setStockReportType] = useState("0");
  const [hasSize, setHasSize] = useState("0");
  const [hasWeightRange, setHasWeightRange] = useState("0");
  const [taxType, setTaxType] = useState(2);
  const [salesMode, setSalesMode] = useState("1");
  const [shortCode, setShortCode] = useState();
  const [productName, setProductName] = useState();
  const [status, setstatus] = useState(true);
  const [metal, setMetal] = useState();
  const [catId, setCatId] = useState();
  const [calculationBasedOn, setCalculationBasedOn] = useState();
  const [uomId, setUomId] = useState();
  const [taxId, setTaxId] = useState();
  const [image, setImage] = useState(null);
  const [sectionIds, setSectionIds] = useState([]);
  const [reorderBasedOn, setReorderBasedOn] = useState(1);
  const [wastageCalc, setWastageCalc] = useState(1);
  const [mcCalc, setMcCalc] = useState(1);
  const [fixedRateType, setFixedRateType] = useState(1);
  const [reportBasedOnWeightRange, setReportBasedOnWeightRange] = useState(1);
  const [weight_show_in_print, setweight_show_in_print] = useState(1);
  const { categories } = useCategories();
  const { uom } = useUom();
  const { metals } = useMetals();
  const { calType } = useCalType();
  // const { taxGroup } = useTaxGroup();
  const { taxMaster } = useTaxMaster();
  const { sections } = useSections();
  const [otherWeight, setotherWeight] = useState();
  const { transformWord } = useContext(WordTransformerContext);

  useEffect(() => {
    if (id !== undefined) {
      dispatch(getProductById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (productInfo !== null) {
      setHsnCode(productInfo?.hsn_code);
      setStockType(productInfo?.stock_type);
      setStockReportType(productInfo?.stock_report_type);
      setHasSize(productInfo?.has_size);
      setHasWeightRange(productInfo?.has_weight_range);
      setTaxType(productInfo?.tax_type);
      setSalesMode(productInfo?.sales_mode);
      setShortCode(productInfo?.short_code);
      setProductName(productInfo?.product_name);
      setstatus(productInfo?.status);
      setMetal(productInfo?.id_metal);
      setCatId(productInfo?.cat_id);
      setCalculationBasedOn(productInfo?.calculation_based_on);
      setUomId(productInfo?.uom_id);
      setTaxId(productInfo?.tax_id);
      setImage(productInfo?.image);
      setSectionIds(productInfo?.sections);
      setReorderBasedOn(productInfo?.reorder_based_on);
      setWastageCalc(productInfo?.wastage_calc_type);
      setMcCalc(productInfo?.mc_calc_type);
      setFixedRateType(productInfo?.fixed_rate_type);
      setReportBasedOnWeightRange(productInfo?.report_based_on_weight_range);
      setotherWeight(productInfo?.other_weight);
      setweight_show_in_print(productInfo?.weight_show_in_print);
      setAddLotExcessWt(productInfo?.add_lot_excess_weight);
      reset();
    }
  }, [productInfo, reset]);

  const saveProduct = async () => {
    let otherWt =
      otherWeight?.length > 0 ? otherWeight.map((item) => item.value) : [];
    const addData = {
      hsn_code: hsnCode,
      stock_type: stockType,
      stock_report_type: stockreportType,
      has_size: hasSize,
      has_weight_range: hasWeightRange,
      tax_type: taxType,
      sales_mode: salesMode,
      short_code: shortCode,
      product_name: productName,
      status: status,
      id_metal: metal,
      cat_id: catId,
      calculation_based_on: null,
      uom_id: uomId,
      tax_id: taxId,
      image: image,
      sections: sectionIds,
      reorder_based_on: reorderBasedOn,
      wastage_calc_type: wastageCalc,
      mc_calc_type: mcCalc,
      fixed_rate_type: fixedRateType,
      report_based_on_weight_range: reportBasedOnWeightRange,
      other_weight: otherWt,
      weight_show_in_print,
    };
    try {
      await dispatch(createProduct(addData)).unwrap();
      toastsuccess(productName + " Added successfully");
      navigate(`${process.env?.PUBLIC_URL}/catalogmaster/product/list`);
    } catch (error) {
      console.log(error);
      let message = error?.response?.data?.message;
      if (typeof message === "string" && message.includes("productName")) {
        setError("productName", {
          type: "manual",
          message: "Product with this name already exists",
        });
      }
      if (typeof message === "string" && message.includes("shortCode")) {
        setError("shortCode", {
          type: "manual",
          message: "Product with this short code already exists",
        });
      }
    }
  };

  const saveProductAndCreateNew = async () => {
    let otherWt =
      otherWeight?.length > 0 ? otherWeight.map((item) => item.value) : [];
    const addData = {
      hsn_code: hsnCode,
      stock_type: stockType,
      stock_report_type: stockreportType,
      has_size: hasSize,
      has_weight_range: hasWeightRange,
      tax_type: taxType,
      sales_mode: salesMode,
      short_code: shortCode,
      product_name: productName,
      status: status,
      id_metal: metal,
      cat_id: catId,
      calculation_based_on: null,
      uom_id: uomId,
      tax_id: taxId,
      image: image,
      sections: sectionIds,
      reorder_based_on: reorderBasedOn,
      wastage_calc_type: wastageCalc,
      mc_calc_type: mcCalc,
      fixed_rate_type: fixedRateType,
      other_weight: otherWt,
      report_based_on_weight_range: reportBasedOnWeightRange,
      weight_show_in_print,
    };
    try {
      await dispatch(createProduct(addData)).unwrap();
      toastsuccess(productName + " Added successfully");
      reset_form();
    } catch (error) {
      console.log(error);
      let message = error?.response?.data?.message;
      if (typeof message === "string" && message.includes("productName")) {
        setError("productName", {
          type: "manual",
          message: "Product with this name already exists",
        });
      }
      if (typeof message === "string" && message.includes("shortCode")) {
        setError("shortCode", {
          type: "manual",
          message: "Product with this short code already exists",
        });
      }
    }
  };

  const updateProduct = async () => {
    let otherWt =
      otherWeight?.length > 0 ? otherWeight.map((item) => item.value) : [];
    const addData = {
      hsn_code: hsnCode,
      stock_type: stockType,
      stock_report_type: stockreportType,
      has_size: hasSize,
      has_weight_range: hasWeightRange,
      tax_type: taxType,
      sales_mode: salesMode,
      short_code: shortCode,
      product_name: productName,
      status: status,
      id_metal: metal,
      cat_id: catId,
      calculation_based_on: null,
      uom_id: uomId,
      tax_id: taxId,
      image: image,
      sections: sectionIds,
      reorder_based_on: reorderBasedOn,
      wastage_calc_type: wastageCalc,
      mc_calc_type: mcCalc,
      fixed_rate_type: fixedRateType,
      report_based_on_weight_range: reportBasedOnWeightRange,
      other_weight: otherWt,
      weight_show_in_print,
    };
    const update_data = { id: id, putData: addData };
    try {
      await dispatch(updateProductById(update_data)).unwrap();
      toastsuccess(productName + " Updated successfully");
      navigate(`${process.env?.PUBLIC_URL}/catalogmaster/product/list`);
    } catch (error) {
      let message = error?.response?.data?.message;
      if (typeof message === "string" && message.includes("productName")) {
        setError("productName", {
          type: "manual",
          message: "Product with this name already exists",
        });
      }
      if (typeof message === "string" && message.includes("shortCode")) {
        setError("shortCode", {
          type: "manual",
          message: "Product with this short code already exists",
        });
      }
    }
  };

  const reset_form = async () => {
    setHsnCode();
    setStockType("0");
    setStockReportType("0");
    setHasSize("0");
    setHasWeightRange("0");
    setTaxType(2);
    setSalesMode("1");
    setProductName("");
    setstatus(true);
    setMetal();
    setCatId();
    setUomId();
    setTaxId();
    setImage(null);
    setSectionIds([]);
    setReorderBasedOn(1);
    setWastageCalc(1);
    setMcCalc(1);
    setFixedRateType(1);
    setReportBasedOnWeightRange(1);
    setotherWeight([]);
    setweight_show_in_print(1);
    setShortCode("");
    reset();
  };

  const resetCategory = () => {
    setCatId();
  };

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      if (id !== undefined) {
        handleSubmit(updateProduct)();
      } else {
        handleSubmit(saveProduct)();
      }
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/catalogmaster/product/list`);
    }
  }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title="Product" />
      <Content>
        <PreviewCard className="h-100">
          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md={2}></Col>
            {add !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit(saveProductAndCreateNew)}
                >
                  {issubmitting ? "Saving" : "Save & New"}
                </SaveButton>

                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit(saveProduct)}
                >
                  {issubmitting ? "Saving" : "Save[ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env?.PUBLIC_URL}/catalogmaster/product/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}

            {id !== undefined && (
              <Col md={5} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit(updateProduct)}
                >
                  {issubmitting ? "Saving" : "Save[ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env?.PUBLIC_URL}/catalogmaster/product/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>
          <div className="">
            <Row lg={12} className={"form-control-sm"}>
              <Col md={4}>
                <div className="custom-grid">
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="metal_name">
                          Name
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={true}
                          id={"productName"}
                          placeholder="Product Name"
                          value={productName}
                          setValue={setValue}
                          SetValue={(value) => {
                            console.log(value);
                            setProductName(transformWord(value));
                            // handleChange("product_name", value);
                            clearErrors("productName");
                          }}
                          message={
                            errors.productName &&
                            (errors.productName?.message
                              ? errors.productName.message
                              : "Product Code is Required")
                          }
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="hsn_code">
                          HSN CODE
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <NumberInputField
                          register={register}
                          isRequired={false}
                          id={"hsnCode"}
                          placeholder="HSN CODE"
                          value={hsnCode}
                          min={1}
                          max={""}
                          maxLength={8}
                          setValue={setValue}
                          SetValue={(value) => {
                            setHsnCode(value);
                            // handleChange("hsn_code", value);
                            clearErrors("hsnCode");
                          }}
                          message={errors.hsnCode && "Hsn Code is Required"}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="cat_id">
                          Category
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <CategoryDropdown
                        register={register}
                        id="catId"
                        categories={categories} // Your categories array
                        selectedCategory={catId}
                        onCategoryChange={(value) => {
                          setCatId(value);
                          setValue("catId", value);
                          clearErrors("catId");

                          let met_id = categories.find(
                            (item) => item.id_category == value
                          );
                          setMetal(met_id?.id_metal);
                          setValue("metal", met_id?.id_metal);
                          clearErrors("metal");

                          // handleChange("catId", value);
                        }}
                        // selectedMetal={metal}
                        isRequired={true}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        message={errors.catId && "Category is Required"}
                      />
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="uom_id">
                          Uom
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <UomDropdown
                        register={register}
                        isRequired={true}
                        id={"uomId"}
                        placeholder="Uom"
                        value={uomId}
                        selectedUom={uomId}
                        optionLabel="Select Uom"
                        uomOptions={uom}
                        setValue={setValue}
                        onUomChange={(value) => {
                          setUomId(value);
                          // handleChange("uom_id", value);
                          clearErrors("uomId");
                        }}
                        message={errors.uomId && "Uom is Required"}
                      />
                    </Col>
                  </Row>
                  {/* <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="calculation_based_on">
                          Calculation Based On
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <ProductCalculationTypeDropdown
                        register={register}
                        isRequired={true}
                        id={"calculationBasedOn"}
                        placeholder="Calculation Based On"
                        value={calculationBasedOn}
                        selectedCalType={calculationBasedOn}
                        optionLabel="Select Calculation Based On"
                        product_Calculation_Types={calType}
                        setValue={setValue}
                        onCalTypeChange={(value) => {
                          setCalculationBasedOn(value);
                          // handleChange("calculation_based_on", value);
                          clearErrors("calculationBasedOn");
                        }}
                        message={errors.calculationBasedOn && "Calculation Based On is Required"}
                      />
                    </Col>
                  </Row> */}
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="id_section">
                          Section
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <SectionDropdown
                        isMulti={true}
                        register={register}
                        isRequired={true}
                        id={"sectionIds"}
                        placeholder="Section"
                        value={sectionIds}
                        selectedSection={sectionIds}
                        optionLabel="Select Section"
                        sectionOptions={sections}
                        setValue={setValue}
                        onSectionChange={(value) => {
                          setSectionIds(value);
                          // handleChange("sections", value);
                          clearErrors("sectionIds");
                        }}
                        message={errors.sectionIds && "section is Required"}
                      />
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Other Weight
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <OtherWeightDownMulti
                          id={"otherWeight"}
                          optionLabel={"Choose Other Weight..."}
                          register={register}
                          value={otherWeight}
                          SetValue={setotherWeight}
                        />
                        {errors.otherWeight && (
                          <span className="invalid">
                            This field is required
                          </span>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="sales_mode">
                          Sales Mode
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="sales_mode_1"
                                name={"salesMode"}
                                value={"0"}
                                className="custom-control-input"
                                {...register("salesMode", { required: true })}
                                checked={salesMode === "0"}
                                onChange={(e) => {
                                  setSalesMode(e.target.value);
                                  setValue("salesMode", e.target.value);
                                  // handleChange("salesMode", e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="sales_mode_1"
                              >
                                {" "}
                                Fixed Rate
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="sales_mode_2"
                                name={"salesMode"}
                                value={"1"}
                                className="custom-control-input"
                                {...register("salesMode")}
                                checked={salesMode === "1"}
                                onChange={(e) => {
                                  setSalesMode(e.target.value);
                                  setValue("salesMode", e.target.value);
                                  // handleChange("salesMode", e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="sales_mode_2"
                              >
                                Flexible Rate
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="wastageCalc">
                          Wastage Calc.
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="wastageCalc_1"
                                name={"wastageCalc"}
                                value={1}
                                className="custom-control-input"
                                {...register("wastageCalc")}
                                checked={wastageCalc == 1}
                                onChange={(e) => {
                                  setWastageCalc(e.target.value);
                                  setValue("wastageCalc", e.target.value);
                                  // handleChange("salesMode", e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="wastageCalc_1"
                              >
                                {" "}
                                Gross Wt.
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="wastageCalc_2"
                                name={"wastageCalc"}
                                value={2}
                                className="custom-control-input"
                                {...register("wastageCalc")}
                                checked={wastageCalc == 2}
                                onChange={(e) => {
                                  setWastageCalc(e.target.value);
                                  setValue("wastageCalc", e.target.value);
                                  // handleChange("salesMode", e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="wastageCalc_2"
                              >
                                Net Wt.
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="mcCalc">
                          MC Calc.
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="mcCalc_1"
                                name={"mcCalc"}
                                value={1}
                                className="custom-control-input"
                                {...register("mcCalc")}
                                checked={mcCalc == 1}
                                onChange={(e) => {
                                  setMcCalc(e.target.value);
                                  setValue("mcCalc", e.target.value);
                                  // handleChange("salesMode", e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="mcCalc_1"
                              >
                                {" "}
                                Gross Wt.
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="mcCalc_2"
                                name={"mcCalc"}
                                value={2}
                                className="custom-control-input"
                                {...register("mcCalc")}
                                checked={mcCalc == 2}
                                onChange={(e) => {
                                  setMcCalc(e.target.value);
                                  setValue("mcCalc", e.target.value);
                                  // handleChange("salesMode", e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="mcCalc_2"
                              >
                                Net Wt.
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="fixedRateType">
                          Fixed Rate <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                disabled={salesMode !== "0"}
                                type="radio"
                                id="fixedRateType_1"
                                name={"fixedRateType"}
                                value={1}
                                className="custom-control-input"
                                {...register("fixedRateType")}
                                checked={fixedRateType == 1}
                                onChange={(e) => {
                                  setFixedRateType(e.target.value);
                                  setValue("fixedRateType", e.target.value);
                                  // handleChange("salesMode", e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="fixedRateType_1"
                              >
                                {" "}
                                on Weight
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                disabled={salesMode !== "0"}
                                type="radio"
                                id="fixedRateType_2"
                                name={"fixedRateType"}
                                value={2}
                                className="custom-control-input"
                                {...register("fixedRateType")}
                                checked={fixedRateType == 2}
                                onChange={(e) => {
                                  setFixedRateType(e.target.value);
                                  setValue("fixedRateType", e.target.value);
                                  // handleChange("salesMode", e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="fixedRateType_2"
                              >
                                on Price
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="">
                          Has Size
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="has_size_1"
                                name={"hasSize"}
                                value={1}
                                className="custom-control-input"
                                {...register("hasSize")}
                                checked={parseInt(hasSize) === 1}
                                onChange={(e) => {
                                  setHasSize(e.target.value);
                                  setValue("hasSize", e.target.value);
                                  // handleChange("hasSize", e.target.value);
                                }}
                              />
                              <label
                                htmlFor="has_size_1"
                                className="custom-control-label"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="has_size_2"
                                name={"hasSize"}
                                value={0}
                                className="custom-control-input"
                                {...register("hasSize")}
                                checked={parseInt(hasSize) === 0}
                                onChange={(e) => {
                                  setValue("hasSize", e.target.value);
                                  setHasSize(e.target.value);
                                  // handleChange("hasSize", e.target.value);
                                }}
                              />
                              <label
                                htmlFor="has_size_2"
                                className="custom-control-label"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col md={4}>
                <div className="custom-grid">
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="product_code">
                          Code
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          isDisabled={isShortCodeDisabled}
                          register={register}
                          isRequired={!isShortCodeDisabled}
                          id={"shortCode"}
                          placeholder="Product Code"
                          value={shortCode}
                          setValue={setValue}
                          SetValue={(value) => {
                            setShortCode(value);
                            // handleChange("short_code", value);
                            clearErrors("shortCode");
                          }}
                          message={
                            errors.shortCode &&
                            (errors.shortCode?.message
                              ? errors.shortCode.message
                              : "Product Code is Required")
                          }
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="id_metal">
                          Metal
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <MetalDropdown
                        isDisabled={true}
                        register={register}
                        isRequired={true}
                        id={"metal"}
                        selectedMetal={metal}
                        placeholder="Metal"
                        value={metal}
                        optionLabel="Select Metal"
                        metals={metals}
                        setValue={setValue}
                        onMetalChange={(value) => {
                          // handleChange("metal", value);
                          setMetal(value);
                          clearErrors("metal");
                          // resetCategory();
                        }}
                        message={errors.metal && "Metal is Required"}
                      />
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="taxId">
                          Tax
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <TaxMasterDropdown
                        register={register}
                        id={"taxId"}
                        taxMaster={taxMaster}
                        selectedTaxMaster={taxId}
                        onTaxMasterChange={(value) => {
                          setTaxId(value);
                          // handleChange("taxId", value);
                          clearErrors("taxId");
                        }}
                        isRequired={true}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        message={errors.taxId && "Tax is Required"}
                      ></TaxMasterDropdown>
                      {/* <Tax_Group_Dropdown
                  register={register}
                  isRequired={true}
                  id={"tgrp_id"}
                  placeholder="Tax Group"
                  value={product.tgrp_id}
                  selectedTax_Group={product.tgrp_id}
                  optionLabel="Select Tax Group"
                  tax_Group={taxGroup}
                  setValue={setValue}
                  taxOnChange={(value) => {
                    handleChange("tgrp_id", value);
                    clearErrors("tgrp_id");
                  }}
                  message={errors.tgrp_id && "Tax Group is Required"}
                /> */}
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="stockType">
                          Stock Type
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="stock_type_1"
                                name={"stockType"}
                                value={"0"}
                                className="custom-control-input"
                                checked={stockType === "0"}
                                {...register("stockType")}
                                onChange={(e) => {
                                  setStockType(e.target.value);
                                  // handleChange("stockType", e.target.value);
                                }}
                              />
                              <label
                                htmlFor="stock_type_1"
                                className="custom-control-label"
                              >
                                {" "}
                                Tagged
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="stock_type_2"
                                name={"stockType"}
                                value={"1"}
                                className="custom-control-input"
                                {...register("stockType")}
                                checked={stockType === "1"}
                                onChange={(e) => {
                                  setStockType(e.target.value);
                                  // handleChange("stockType", e.target.value);
                                }}
                              />
                              <label
                                htmlFor="stock_type_2"
                                className="custom-control-label"
                              >
                                Non Tagged
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="stockreportType">
                          Stock Report Type
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="stock_report_type_1"
                                name={"stockreportType"}
                                value={"0"}
                                className="custom-control-input"
                                checked={stockreportType === "0"}
                                {...register("stockreportType")}
                                onChange={(e) => {
                                  setStockReportType(e.target.value);
                                  // handleChange("stockType", e.target.value);
                                }}
                              />
                              <label
                                htmlFor="stock_report_type_1"
                                className="custom-control-label"
                              >
                                {" "}
                                Based on Product
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="stock_report_type_2"
                                name={"stockreportType"}
                                value={"1"}
                                className="custom-control-input"
                                {...register("stockreportType")}
                                checked={stockreportType === "1"}
                                onChange={(e) => {
                                  setStockReportType(e.target.value);
                                  // handleChange("stockType", e.target.value);
                                }}
                              />
                              <label
                                htmlFor="stock_report_type_2"
                                className="custom-control-label"
                              >
                                Based on Design
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="tax_type">
                          Tax Type
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="tax_type_1"
                                name={"taxType"}
                                value={1}
                                className="custom-control-input"
                                {...register("taxType")}
                                checked={parseInt(taxType) === 1}
                                onChange={(e) => {
                                  setValue("taxType", e.target.value);
                                  setTaxType(e.target.value);
                                  // handleChange("taxType", e.target.value);
                                }}
                              />
                              <label
                                htmlFor="tax_type_1"
                                className="custom-control-label"
                              >
                                Inclusive
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="tax_type_2"
                                name={"taxType"}
                                value={2}
                                className="custom-control-input"
                                {...register("taxType")}
                                checked={parseInt(taxType) === 2}
                                onChange={(e) => {
                                  setValue("taxType", e.target.value);
                                  setTaxType(e.target.value);
                                  // handleChange("tax_type", e.target.value);
                                }}
                              />
                              <label
                                htmlFor="tax_type_2"
                                className="custom-control-label"
                              >
                                Exclusive
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
                        <label className="form-label" htmlFor="reorderbasedon">
                          Re-order Based on
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="reorder_based_on_1"
                                name={"reorderBasedOn"}
                                value={"1"}
                                className="custom-control-input"
                                {...register("reorderBasedOn")}
                                checked={reorderBasedOn == 1}
                                onChange={(e) => {
                                  setValue("reorderBasedOn", e.target.value);
                                  setReorderBasedOn(e.target.value);
                                  // handleChange("reorderBasedOn", e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="reorder_based_on_1"
                              >
                                {" "}
                                Weight Range
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="reorder_based_on_2"
                                name={"reorderBasedOn"}
                                value={"2"}
                                className="custom-control-input"
                                {...register("reorderBasedOn")}
                                checked={reorderBasedOn == 2}
                                onChange={(e) => {
                                  setValue(e.target.value);
                                  setReorderBasedOn(e.target.value);
                                  // handleChange("reorder_based_on", e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="reorder_based_on_2"
                              >
                                Size
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="reorder_based_on_3"
                                name={"reorderBasedOn"}
                                value={"3"}
                                className="custom-control-input"
                                {...register("reorderBasedOn")}
                                checked={reorderBasedOn == 3}
                                onChange={(e) => {
                                  setValue("reorderBasedOn", e.target.value);
                                  setReorderBasedOn(e.target.value);
                                  // handleChange("reorderBasedOn", e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="reorder_based_on_3"
                              >
                                Both
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="product_status">
                          Status
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <SwitchInputField
                        register={register}
                        id={"status"}
                        checked={status}
                        setValue={setValue}
                        SetValue={(value) => {
                          setstatus(value);
                          // handleChange("status", value);
                          clearErrors("status");
                        }}
                        name={"status"}
                      />
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="hasWeightRange">
                          Weight Range
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="has_weight_range_1"
                                name={"hasWeightRange"}
                                value={1}
                                className="custom-control-input"
                                {...register("hasWeightRange")}
                                checked={parseInt(hasWeightRange) === 1}
                                onChange={(e) => {
                                  setValue("hasWeightRange", e.target.value);
                                  setHasWeightRange(e.target.value);
                                  // handleChange("has_weight_range", e.target.value);
                                }}
                              />
                              <label
                                htmlFor="has_weight_range_1"
                                className="custom-control-label"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="has_weight_range_2"
                                name={"hasWeightRange"}
                                value={0}
                                className="custom-control-input"
                                {...register("hasWeightRange")}
                                checked={parseInt(hasWeightRange) === 0}
                                onChange={(e) => {
                                  setValue("hasWeightRange", e.target.value);
                                  setHasWeightRange(e.target.value);
                                  // handleChange("has_weight_range", e.target.value);
                                }}
                              />
                              <label
                                htmlFor="has_weight_range_2"
                                className="custom-control-label"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  

                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label
                          className="form-label"
                          htmlFor="ReportWeightRange"
                        >
                          Report Based On Weight Range
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="report_weight_range_1"
                                name={"ReportWeightRange"}
                                value={1}
                                className="custom-control-input"
                                {...register("ReportWeightRange")}
                                checked={
                                  parseInt(reportBasedOnWeightRange) === 1
                                }
                                onChange={(e) => {
                                  setValue("hasWeightRange", e.target.value);
                                  setReportBasedOnWeightRange(e.target.value);
                                  // handleChange("has_weight_range", e.target.value);
                                }}
                              />
                              <label
                                htmlFor="report_weight_range_1"
                                className="custom-control-label"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                type="radio"
                                id="report_weight_range_2"
                                name={"ReportWeightRange"}
                                value={0}
                                className="custom-control-input"
                                {...register("ReportWeightRange")}
                                checked={
                                  parseInt(reportBasedOnWeightRange) === 0
                                }
                                onChange={(e) => {
                                  setValue("ReportWeightRange", e.target.value);
                                  setReportBasedOnWeightRange(e.target.value);
                                  // handleChange("has_weight_range", e.target.value);
                                }}
                              />
                              <label
                                htmlFor="report_weight_range_2"
                                className="custom-control-label"
                              >
                                No
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
                        <label className="form-label" htmlFor="">
                          Weight show in print
                        </label>
                      </div>
                    </Col>
                    <Col md="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="weight_show_in_print_yes"
                                type="radio"
                                name={"weight_show_in_print"}
                                value={"1"}
                                className="custom-control-input"
                                checked={weight_show_in_print == "1"}
                                onChange={(e) => {
                                  setweight_show_in_print(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="weight_show_in_print_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="weight_show_in_print_no"
                                type="radio"
                                value={"0"}
                                name={"weight_show_in_print"}
                                className="custom-control-input "
                                checked={weight_show_in_print == "0"}
                                onChange={(e) => {
                                  setweight_show_in_print(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="weight_show_in_print_no"
                              >
                                No
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>

              <Col md={4}>
                <div className="custom-grid">
                  <Row className="form-group row g-4">
                    <Col md="3"></Col>
                    <Col md="8">
                      <ProfileImageUpload
                        id={"image"}
                        image={image}
                        SetImage={setImage}
                        // SetImage={(newImage) => handleChange("image", newImage)}
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default ProductForm;
