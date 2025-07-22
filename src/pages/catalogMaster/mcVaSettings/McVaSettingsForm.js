import React, { useEffect, useState } from "react";
import Select from "react-select";
import Head from "../../../layout/head/Head";
import {
  toastfunc,
  toastsuccess,
} from "../../../components/sds-toast-style/toast-style";
import Content from "../../../layout/content/Content";
import {
  CancelButton,
  Icon,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import { Col, Row } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  createCustomerMcVaSettings,
  createMcVaSettings,
  getCustomerMcVa,
  getMcVa,
} from "../../../redux/thunks/catalogMaster";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import {
  useAllSubDesigns,
  useDesigns,
  useProducts,
  usePurities,
} from "../../../components/filters/filterHooks";
import {
  ProductDropdown,
  PurityDropdown,
  WeightRangeDropdown,
} from "../../../components/filters/retailFilters";
import { Button, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, TabContent, TabPane, UncontrolledButtonDropdown } from "reactstrap";
import { getWeightRangeById } from "../../../redux/thunks/retailMaster";
import SupplierDropDownMulti from "../../../components/common/dropdown/SupplierDropDownMulti";
import classnames from "classnames";
import { useHotkeys } from "react-hotkeys-hook";

const McVaSettingsForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
  } = useForm();
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
    reset: reset1,
    setValue: setValue1,
    clearErrors: clearErrors1,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.mcVaSettingsReducer
  );
  const { mcVaList } = useSelector((state) => state.mcVaSettingsReducer);
  const { customerMcVaSettingsList } = useSelector(
    (state) => state.mcVaSettingsReducer
  );
  const { weightRangeInfo } = useSelector((state) => state.weightRangeReducer);
  const { userInfo } = useSelector((state) => state.authUserReducer);
  let showMcTypeOptions = [
    {
      label: "Gross weight",
      value: 1,
    },
    {
      label: "Net weight",
      value: 2,
    },
  ];

  let wastageTypeOptions = [
    {
      label: "Gross weight",
      value: 1,
    },
    {
      label: "Net weight",
      value: 2,
    },
  ];

  const [selectedMcType, setSelectedMcType] = useState(null);
  const [customerBulkFlatMcMax, setCustomerBulkFlatMcMax] = useState(0);
  const [selectedVaType, setSelectedVaType] = useState(null);

  const pureCalcTypeOptions = [
    { label: "Touch+VA", value: 2, isDefault: true },
    { label: "Touch", value: 1 },
    { label: "Wt * VA %", value: 3 },
  ];

  const { products } = useProducts();
  const { designs } = useDesigns();
  const { subDesign } = useAllSubDesigns();
  const { purities } = usePurities();

  const [selectedProduct, setSelectedProduct] = useState();
  const [selectedSupplier, setSelectedSupplier] = useState();
  const [selectedPurity, setSelectedPurity] = useState(null);

  const [mcvaSettings, setMcvaSettings] = useState([]);
  const [selectedCustomerProduct, setSelectedCustomerProduct] = useState();
  const [selectedCustomerPurity, setSelectedCustomerPurity] = useState(null);
  const [customerMcvaSettings, setCustomerMcvaSettings] = useState([]);
  const [isSubDesignRequired, setIsSubDesignRequired] = useState([]);

  //supplier

  //purchase
  const [supplierBulkPurchaseTouchValue, setSupplierBulkPurchaseTouchValue] =
    useState(0);
  const [supplierBulkPurchaseVaValue, setSupplierBulkPurchaseVaValue] =
    useState(0);
  const [supplierBulkPurchaseMcValue, setSupplierBulkPurchaseMcValue] =
    useState(0);
  const [supplierBulkPurchaseFlatMcValue, setSupplierBulkPurchaseFlatMcValue] =
    useState(0);
  const [
    supplierBulkPurchaseSalesRateValue,
    setSupplierBulkPurchaseSalesRateValue,
  ] = useState(0);

  //retail
  const [supplierBulkRetailTouchValue, setSupplierBulkRetailTouchValue] =
    useState(0);
  const [supplierBulkRetailVaValue, setSupplierBulkRetailVaValue] = useState(0);
  const [supplierBulkRetailMcValue, setSupplierBulkRetailMcValue] = useState(0);
  const [supplierBulkRetailFlatMcValue, setSupplierBulkRetailFlatMcValue] =
    useState(0);

  //vip retail
  const [supplierBulkVipRetailTouchValue, setSupplierBulkVipRetailTouchValue] =
    useState(0);
  const [supplierBulkVipRetailVaValue, setSupplierBulkVipRetailVaValue] =
    useState(0);
  const [supplierBulkVipRetailMcValue, setSupplierBulkVipRetailMcValue] =
    useState(0);
  const [
    supplierBulkVipRetailFlatMcValue,
    setSupplierBulkVipRetailFlatMcValue,
  ] = useState(0);

  //customer
  const [customerBulkMaxVaValue, setCustomerBulkMaxVaValue] = useState(0);
  const [customerBulkMinVaValue, setCustomerBulkMinVaValue] = useState(0);
  const [customerBulkMaxMcValue, setCustomerBulkMaxMcValue] = useState(0);
  const [customerBulkMinMcValue, setCustomerBulkMinMcValue] = useState(0);
  const [customerBulkFlatMc, setCustomerBulkFlatMc] = useState(0);
  const [customerBulkSalesRate, setCustomerBulkSalesRate] = useState(0);
  const [customerBulkSalesRateType, setCustomerBulkSalesRateType] = useState(0);
  const [customerBulkSalesRateTypeLabel, setCustomerBulkSalesRateTypeLabel] = useState('Amount');

  const [activeTab, setActiveTab] = useState(1);
  useEffect(() => {
    console.log(userInfo?.settings?.is_sub_design_req);
    setIsSubDesignRequired(
      userInfo?.settings?.is_sub_design_req == 0 ? false : true
    );
  }, [userInfo]);

  useEffect(() => {
    const updatedList = mcVaList?.map((item) => ({
      ...item,
      isChecked: item?.isChecked ? true : false,
    }));
    setMcvaSettings(updatedList);
  }, [mcVaList]);

  useEffect(() => {
    const updatedList = customerMcVaSettingsList?.map((item) => ({
      ...item,
      isChecked: item?.isChecked ? true : false,
    }));
    setCustomerMcvaSettings(updatedList);
  }, [customerMcVaSettingsList]);
  // useEffect(() => {
  //   setMcvaSettings(mcVaList);
  // }, [mcVaList]);

  const handelChange = (index, field, value) => {
    setMcvaSettings((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;

      return updatedValues;
    });
  };

  const handleSupplierBulkChanges = (value, field = "") => {
    mcvaSettings?.map((item, rowIndex) => {
      if (field == "purchase_sales_rate") {
        if (item?.purchase_sales_rate != null) {
          handelChange(rowIndex, "purchase_sales_rate", value);
        }
      } else {
        handelChange(rowIndex, field, value);
      }
    });
  };

  const handelCustomerChange = (index, field, value) => {
    setCustomerMcvaSettings((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;

      return updatedValues;
    });
  };

  const handleCustomerBulkChanges = (value, field = "") => {
    customerMcvaSettings?.map((item, rowIndex) => {
      if (field == "sales_rate") {
        if (item?.sales_rate != null) {
          handelCustomerChange(rowIndex, "sales_rate", value);
        }
      } else {
        handelCustomerChange(rowIndex, field, value);
      }
    });
  };

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleMaxWastageChange = (e, wastageValue, index, fieldName) => {
    let value = e.target.value;
    let isValid = true;

    // Check based on wastage type
    if (wastageValue?.value === 1) {
      // Percent
      if (parseFloat(value) > 100) {
        isValid = false;
        toastfunc(
          `Entered value cannot exceed max wastage value 100 for percentage`
        );
      }
      // Allow only two decimal places
      if (value.includes(".") && value.split(".")[1].length > 2) {
        isValid = false;
        toastfunc("Only two decimal places are allowed for percentage");
      }
    } else if (wastageValue?.value === 2) {
      // Weight
      // Allow up to three decimal places
      if (value.includes(".") && value.split(".")[1].length > 3) {
        isValid = false;
        toastfunc("Only three decimal places are allowed for weight");
      }
    }

    if (isValid) {
      handelChange(index, fieldName, value);
      setValue(`${fieldName}${index}`, value);
    }
  };

  const handleDuplicate = (index) => {
    const rowToDuplicate = mcvaSettings[index];
    const newRow = { ...rowToDuplicate, id: Date.now() }; // New ID to avoid duplicate keys

    // Insert duplicated row right after the original row
    const updatedData = [
      ...mcvaSettings?.slice(0, index + 1), // Items before the duplicated row
      newRow, // Duplicated row
      ...mcvaSettings?.slice(index + 1), // Items after the duplicated row
    ];

    setMcvaSettings(updatedData);
  };

  const handleCustomerDuplicate = (index) => {
    const rowToDuplicate = customerMcvaSettings[index];
    const newRow = { ...rowToDuplicate, id: Date.now() }; // New ID to avoid duplicate keys

    // Insert duplicated row right after the original row
    const updatedData = [
      ...customerMcvaSettings?.slice(0, index + 1), // Items before the duplicated row
      newRow, // Duplicated row
      ...customerMcvaSettings?.slice(index + 1), // Items after the duplicated row
    ];

    setCustomerMcvaSettings(updatedData);
  };

  const deleteMcVaSettings = (idx) => {
    setMcvaSettings((prevState) =>
      prevState?.filter((obj, index) => index != idx)
    );
  };

  const deleteCustomerMcVaSettings = (idx) => {
    setCustomerMcvaSettings((prevState) =>
      prevState?.filter((obj, index) => index != idx)
    );
  };

  const filterSupplierMcVa = () => {
    console.log(selectedSupplier?.length);
    if (selectedProduct === "" || selectedProduct === undefined) {
      toastfunc("Please Select the Product..");
    } else if (
      selectedSupplier?.length === 0 ||
      selectedSupplier === undefined
    ) {
      toastfunc("Please Select the Supplier..");
    } else if (selectedPurity === "" || selectedPurity === null) {
      toastfunc("Please Select the Purity..");
    } else {
      dispatch(
        getMcVa({
          product: selectedProduct,
          purity: selectedPurity,
          supplier:
            selectedSupplier?.length > 0
              ? selectedSupplier?.map((obj) => {
                const container = obj.value;
                return container;
              })
              : [],
        })
      );
    }
  };

  const filterCustomerMcVa = () => {
    dispatch(
      getCustomerMcVa({
        product: selectedCustomerProduct,
        purity: selectedCustomerPurity,
      })
    );
  };

  const postData = async () => {
    if (activeTab === 1) {
      const mcva_settings = mcvaSettings?.map((obj) => {
        const container = {};
        container.id_product = selectedProduct;
        container.purity = selectedPurity;
        container.supplier = selectedSupplier?.map((obj) => {
          const container = obj.value;
          return container;
        });
        container.isChecked = obj?.isChecked ? true : false;
        container.id_design = obj.id_design;
        container.id_sub_design = obj.id_sub_design;
        container.id_weight_range = obj.id_weight_range;

        container.purchase_touch = obj.purchase_touch;
        container.purchase_mc_type = obj.purchase_mc_type?.value;
        container.purchase_mc = obj.purchase_mc;
        container.purchase_va = obj.purchase_va;
        container.purchase_flat_mc = obj.purchase_flat_mc;
        container.purchase_va_type = obj.purchase_va_type?.value;
        container.pure_wt_type = obj.pure_wt_type?.value;

        container.retail_touch = obj.retail_touch;
        container.retail_mc_type = obj.retail_mc_type?.value;
        container.retail_mc = obj.retail_mc;
        container.retail_va_type = obj.retail_va_type?.value;
        container.retail_va = obj.retail_va;
        container.retail_flat_mc = obj.retail_flat_mc;

        container.vip_retail_touch = obj.vip_retail_touch;
        container.vip_retail_mc_type = obj.vip_retail_mc_type?.value;
        container.vip_retail_mc = obj.vip_retail_mc;
        container.vip_retail_va_type = obj.vip_retail_va_type?.value;
        container.vip_retail_va = obj.vip_retail_va;
        container.vip_retail_flat_mc = obj.vip_retail_flat_mc;

        return container;
      });

      const adddata = {
        id_product: selectedProduct,
        purity: selectedPurity,
        supplier: selectedSupplier?.map((obj) => {
          const container = obj.value;
          return container;
        }),
        mcva_settings,
      };
      // console.log(adddata);

      try {
        await dispatch(createMcVaSettings(adddata)).unwrap();
        toastsuccess("Mc va settings created successfully");
        setSelectedProduct(null);
        setSelectedPurity(null);
        setSelectedSupplier(null);
        setMcvaSettings([]);
        reset();
        
      } catch (error) {
        console.error(error);
      }
    }
    if (activeTab === 2) {
      const mcva_settings = customerMcvaSettings?.map((obj) => {
        const container = {};
        container.id_product = selectedCustomerProduct;
        container.purity = selectedCustomerPurity;

        container.isChecked = obj?.isChecked ? true : false;
        container.id_design = obj.id_design;
        container.id_sub_design = obj.id_sub_design;
        container.id_weight_range = obj.id_weight_range;

        container.mc_type = obj.mc_type?.value;
        container.min_mc_value = obj.min_mc_value;
        container.max_mc_value = obj.max_mc_value;
        container.flat_mc_max = obj.flat_mc_max;
        container.flat_mc_min = obj.flat_mc_min;
        container.sales_rate = obj.sales_rate;
        container.sales_rate_type = obj.sales_rate_type;
        container.va_type = obj.va_type?.value;
        container.min_va_value = obj.min_va_value;
        container.max_va_value = obj.max_va_value;

        return container;
      });

      const adddata = {
        id_product: selectedCustomerProduct,
        purity: selectedCustomerPurity,
        mcva_settings,
      };
      // console.log(adddata);

      try {
        await dispatch(createCustomerMcVaSettings(adddata)).unwrap();
        toastsuccess("Mc va settings created successfully");
        setSelectedCustomerProduct(null);
        setSelectedCustomerPurity(null);
        setCustomerMcvaSettings([]);
        reset1();
      } catch (error) {
        console.error(error);
      }
    }
  };

  useHotkeys("ctrl+s", (event) => {
    event.preventDefault();
    if (id !== undefined) {
      handleSubmit(putData)();
    } else {
      handleSubmit(postData)();
    }
  },{
    enableOnFormTags: true, // Enable hotkeys inside input fields
    preventDefault: true, // Prevent default browser Save
  });


  return (
    <React.Fragment>
      <Head title="Mc Va Settings" />
      <Content>
        <PreviewCard className="h-100">
          <Nav tabs>
            <NavItem>
              <NavLink
                tag="a"
                href="#tab"
                className={classnames({ active: activeTab === 1 })}
                onClick={(ev) => {
                  ev.preventDefault();
                  toggle(1);
                }}
              >
                <Icon name="grid-alt-fill" /> <span>Supplier</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                tag="a"
                href="#tab"
                className={classnames({ active: activeTab === 2 })}
                onClick={(ev) => {
                  ev.preventDefault();
                  toggle(2);
                }}
              >
                <Icon name="user-circle-fill" /> <span>Customer</span>
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId={1}>
              {/* <div className="custom-grid"> */}
                <Row md={12} className="form-group row g-4">
                  <Col lg="3">
                    <div className="form-group form-control-sm">
                      <label className="form-label" htmlFor="product">
                        Product
                        <IsRequired />
                      </label>
                      <ProductDropdown
                        register={register}
                        id={"selectedProduct"}
                        products={products}
                        selectedProduct={selectedProduct}
                        onProductChange={(value) => {
                          setSelectedProduct(value);
                          dispatch(getWeightRangeById(value));
                          setMcvaSettings([]);
                          reset();
                        }}
                        isRequired={true}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        message={
                          errors.selectedProduct && "Product is Required"
                        }
                      />
                    </div>
                  </Col>
                  <Col lg="2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="supplier">
                        Supplier
                        <IsRequired />
                      </label>
                      <SupplierDropDownMulti
                        id={"selectedSupplier"}
                        optionLabel={"Choose Supplier..."}
                        register={register}
                        setError={setError}
                        clearErrors={clearErrors}
                        value={selectedSupplier}
                        SetValue={setSelectedSupplier}
                      />
                      {/* {errors?.selectedSupplier && <span className="text-danger">Selection is required</span>} */}
                    </div>
                  </Col>

                  <Col lg="2">
                    <div className="form-group form-control-sm">
                      <label className="form-label" htmlFor="selectedPurity">
                        Purity
                        <IsRequired />
                      </label>
                      <PurityDropdown
                        register={register}
                        id={"selectedPurity"}
                        purities={purities}
                        onPurityChange={(value) => setSelectedPurity(value)}
                        selectedPurity={selectedPurity}
                        isRequired={true}
                        clearErrors={clearErrors}
                        setValue={setValue}
                        message={errors.selectedPurity && "Purity is Required"}
                        readOnly={false}
                      />
                      {/* {errors.selectedSupplier && <span className="invalid">This field is required</span>} */}
                    </div>
                  </Col>

                  <Col lg={3}>
                  <div style={{ marginTop: "35px" }}>    
                        <SaveButton
                          size="md"
                          color="secondary"
                          onClick={filterSupplierMcVa}
                        >
                         Filter
                        </SaveButton>                    
                         <SaveButton
                          disabled={issubmitting}
                          size="md"
                          color="primary"
                          onClick={handleSubmit(postData)}
                        >
                          {issubmitting ? "Saving" : "Save "}
                        </SaveButton>

                        <CancelButton
                          disabled={issubmitting}
                          color="danger"
                          size="md"
                          onClick={() => navigate(`${process.env.PUBLIC_URL}/`)}
                        >
                          Cancel
                        </CancelButton></div>

                  </Col>

                </Row>

                <Row md={12} className="form-group row g-4">
                  <div className="table-responsive" style={{overflowY: 'auto' }}>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th
                            colSpan={isSubDesignRequired == true ? "4" : "3"}
                            style={{ textAlign: "center",position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}
                          >
                            General
                          </th>
                          <th
                            colSpan="8"
                            style={{
                              textAlign: "center",
                              background: "#a7a0b6",
                              color: "black",position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa',
                            }}
                          >
                            Purchase
                          </th>
                          <th colSpan="6" style={{ textAlign: "center",position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>
                            Retail
                          </th>
                          <th
                            colSpan="6"
                            style={{
                              textAlign: "center",
                              background: "#a291c7",
                              color: "black",position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa',
                            }}
                          >
                            VIP Retail
                          </th>
                          <th colSpan="2" style={{ textAlign: "center",position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>
                            Actions
                          </th>
                        </tr>
                        <tr>
                          {/* General Columns */}
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            S.NO
                            {/* <input
                          type="checkbox"
                          onChange={(event) => {
                            selectAllCol(event.target.checked);
                            setSelectAll(event.target.checked);
                          }}
                          checked={selectAll}
                        />{" "} */}
                          </th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Design</th>
                          {isSubDesignRequired && <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Sub Design</th>}
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Weight Range</th>

                          {/* Purchase Columns */}
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            Touch
                            <div>
                              <input
                                {...register(`bulk_purchase_touch`, {
                                  required: false,
                                })}
                                type="number"
                                name="bulk_purchase_touch"
                                step={1}
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="Purchase Touch"
                                min={0}
                                style={{ width: "80px" }}
                                onKeyDown={(evt) =>
                                  ["e", "E", "+", "-"].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                value={supplierBulkPurchaseTouchValue}
                                onChange={(e) => {
                                  setSupplierBulkPurchaseTouchValue(
                                    e.target.value
                                  );
                                  handleSupplierBulkChanges(
                                    e.target.value,
                                    "purchase_touch"
                                  );
                                  // handelChange(
                                  //   index,
                                  //   "purchase_touch",
                                  //   e.target.value
                                  // );
                                  setValue(
                                    "bulk_purchase_touch",
                                    e.target.value
                                  );
                                }}
                              />
                            </div>
                          </th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Pure Wt.</th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>V.A Type</th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            V.A(%)
                            <div>
                              <input
                                {...register(`bulk_purchase_va`, {
                                  required: false,
                                })}
                                type="number"
                                name="bulk_purchase_va"
                                step={1}
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="Purchase Wastage"
                                min={0}
                                onKeyDown={(evt) =>
                                  ["e", "E", "+", "-"].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                value={supplierBulkPurchaseVaValue}
                                onChange={(e) => {
                                  setSupplierBulkPurchaseVaValue(
                                    e.target.value
                                  );
                                  handleSupplierBulkChanges(
                                    e.target.value,
                                    "purchase_va"
                                  );
                                  // handelChange(
                                  //   index,
                                  //   "purchase_va",
                                  //   e.target.value
                                  // );
                                  setValue("bulk_purchase_va", e.target.value);
                                }}
                                style={{ width: "80px" }}
                              />
                            </div>
                          </th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>MC Type</th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            MC/G
                            <div>
                              <input
                                {...register(`bulk_purchase_mc`, {
                                  required: false,
                                })}
                                type="number"
                                name="bulk_purchase_mc"
                                step={1}
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="Purchase Mc value"
                                min={0}
                                onKeyDown={(evt) =>
                                  ["e", "E", "+", "-"].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                value={supplierBulkPurchaseMcValue}
                                onChange={(e) => {
                                  setSupplierBulkPurchaseMcValue(
                                    e.target.value
                                  );
                                  handleSupplierBulkChanges(
                                    e.target.value,
                                    "purchase_mc"
                                  );
                                  // handelChange(
                                  //   index,
                                  //   "purchase_mc",
                                  //   e.target.value
                                  // );
                                  setValue("bulk_purchase_mc", e.target.value);
                                }}
                                style={{ width: "80px" }}
                              />
                            </div>
                          </th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            Flat MC
                            <div>
                              <input
                                {...register(`bulk_purchase_flat_mc`, {
                                  required: false,
                                })}
                                type="number"
                                name="bulk_purchase_flat_mc"
                                step={1}
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="Purchase Flat Mc"
                                min={0}
                                onKeyDown={(evt) =>
                                  ["e", "E", "+"].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                value={supplierBulkPurchaseFlatMcValue}
                                onChange={(e) => {
                                  setSupplierBulkPurchaseFlatMcValue(
                                    e.target.value
                                  );
                                  handleSupplierBulkChanges(
                                    e.target.value,
                                    "purchase_flat_mc"
                                  );
                                  // handelChange(
                                  //   index,
                                  //   "purchase_flat_mc",
                                  //   e.target.value
                                  // );
                                  setValue(
                                    "bulk_purchase_flat_mc",
                                    e.target.value
                                  );
                                }}
                                style={{ width: "80px" }}
                              />
                            </div>
                          </th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            Sales Rate
                            {mcvaSettings?.some(
                              (item) => item?.purchase_sales_rate != null
                            ) && (
                                <div>
                                  <input
                                    {...register(`bulk_purchase_sales_rate`, {
                                      required: false,
                                    })}
                                    type="number"
                                    name="bulk_purchase_sales_rate"
                                    step={1}
                                    className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                    placeholder="Purchase Flat Mc"
                                    min={0}
                                    onKeyDown={(evt) =>
                                      ["e", "E", "+", "-"].includes(evt.key) &&
                                      evt.preventDefault()
                                    }
                                    value={supplierBulkPurchaseSalesRateValue}
                                    onChange={(e) => {
                                      setSupplierBulkPurchaseSalesRateValue(
                                        e.target.value
                                      );
                                      handleSupplierBulkChanges(
                                        e.target.value,
                                        "purchase_sales_rate"
                                      );
                                      // handelChange(
                                      //   index,
                                      //   "purchase_sales_rate",
                                      //   e.target.value
                                      // );
                                      setValue(
                                        "bulk_purchase_sales_rate",
                                        e.target.value
                                      );
                                    }}
                                    style={{ width: "80px" }}
                                  />
                                </div>
                              )}
                          </th>

                          {/* Retail */}
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            Touch
                            <div>
                              <input
                                {...register(`bulk_retail_touch`, {
                                  required: false,
                                })}
                                type="number"
                                name="bulk_retail_touch"
                                step={1}
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="Retail Touch"
                                min={0}
                                style={{ width: "80px" }}
                                onKeyDown={(evt) =>
                                  ["e", "E", "+", "-"].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                value={supplierBulkRetailTouchValue}
                                onChange={(e) => {
                                  setSupplierBulkRetailTouchValue(
                                    e.target.value
                                  );
                                  handleSupplierBulkChanges(
                                    e.target.value,
                                    "retail_touch"
                                  );
                                  // handelChange(
                                  //   index,
                                  //   "retail_touch",
                                  //   e.target.value
                                  // );
                                  setValue("bulk_retail_touch", e.target.value);
                                }}
                              />
                            </div>
                          </th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>V.A Type</th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            V.A(%)
                            <div>
                              <input
                                {...register(`bulk_retail_va`, {
                                  required: false,
                                })}
                                type="number"
                                name="bulk_retail_va"
                                step={1}
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="Retail Wastage"
                                min={0}
                                onKeyDown={(evt) =>
                                  ["e", "E", "+", "-"].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                value={supplierBulkRetailVaValue}
                                onChange={(e) => {
                                  setSupplierBulkRetailVaValue(e.target.value);
                                  handleSupplierBulkChanges(
                                    e.target.value,
                                    "retail_va"
                                  );
                                  // handelChange(
                                  //   index,
                                  //   "retail_va",
                                  //   e.target.value
                                  // );
                                  setValue("bulk_retail_va", e.target.value);
                                }}
                                style={{ width: "80px" }}
                              />
                            </div>
                          </th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>MC Type</th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            MC/G
                            <div>
                              <input
                                {...register(`bulk_retail_mc`, {
                                  required: false,
                                })}
                                type="number"
                                name="bulk_retail_mc"
                                step={1}
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="Retail Mc value"
                                min={0}
                                onKeyDown={(evt) =>
                                  ["e", "E", "+", "-"].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                value={supplierBulkRetailMcValue}
                                onChange={(e) => {
                                  setSupplierBulkRetailMcValue(e.target.value);
                                  handleSupplierBulkChanges(
                                    e.target.value,
                                    "retail_mc"
                                  );
                                  // handelChange(
                                  //   index,
                                  //   "retail_mc",
                                  //   e.target.value
                                  // );
                                  setValue("bulk_retail_mc", e.target.value);
                                }}
                                style={{ width: "80px" }}
                              />
                            </div>
                          </th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            Flat MC/G
                            <div>
                              <input
                                {...register(`bulk_retail_flat_mc`, {
                                  required: false,
                                })}
                                type="number"
                                name="bulk_retail_flat_mc"
                                step={1}
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="Retail Flat Mc"
                                min={0}
                                onKeyDown={(evt) =>
                                  ["e", "E", "+", "-"].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                value={supplierBulkRetailFlatMcValue}
                                onChange={(e) => {
                                  setSupplierBulkRetailFlatMcValue(
                                    e.target.value
                                  );
                                  handleSupplierBulkChanges(
                                    e.target.value,
                                    "retail_flat_mc"
                                  );
                                  // handelChange(
                                  //   index,
                                  //   "retail_flat_mc",
                                  //   e.target.value
                                  // );
                                  setValue(
                                    "bulk_retail_flat_mc",
                                    e.target.value
                                  );
                                }}
                                style={{ width: "80px" }}
                              />
                            </div>
                          </th>

                          {/* Vip Retail */}
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            Touch
                            <div>
                              <input
                                {...register(`bulk_vip_retail_touch`, {
                                  required: false,
                                })}
                                type="number"
                                name="bulk_vip_retail_touch"
                                step={1}
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="VIP Retail Touch"
                                min={0}
                                style={{ width: "80px" }}
                                onKeyDown={(evt) =>
                                  ["e", "E", "+", "-"].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                value={supplierBulkVipRetailTouchValue}
                                onChange={(e) => {
                                  setSupplierBulkVipRetailTouchValue(
                                    e.target.value
                                  );
                                  handleSupplierBulkChanges(
                                    e.target.value,
                                    "vip_retail_touch"
                                  );
                                  // handelChange(
                                  //   index,
                                  //   "vip_retail_touch",
                                  //   e.target.value
                                  // );
                                  setValue(
                                    "bulk_vip_retail_touch",
                                    e.target.value
                                  );
                                }}
                              />
                            </div>
                          </th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>V.A Type</th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            V.A(%)
                            <div>
                              <input
                                {...register(`bulk_vip_retail_va`, {
                                  required: false,
                                })}
                                type="number"
                                name="bulk_vip_retail_va"
                                step={1}
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="Retail Wastage"
                                min={0}
                                onKeyDown={(evt) =>
                                  ["e", "E", "+", "-"].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                value={supplierBulkVipRetailVaValue}
                                onChange={(e) => {
                                  setSupplierBulkVipRetailVaValue(
                                    e.target.value
                                  );
                                  handleSupplierBulkChanges(
                                    e.target.value,
                                    "vip_retail_va"
                                  );
                                  // handelChange(
                                  //   index,
                                  //   "vip_retail_va",
                                  //   e.target.value
                                  // );
                                  setValue(
                                    "bulk_vip_retail_va",
                                    e.target.value
                                  );
                                }}
                                style={{ width: "80px" }}
                              />
                            </div>
                          </th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>MC Type</th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            MC/G
                            <div>
                              <input
                                {...register(`bulk_vip_retail_mc`, {
                                  required: false,
                                })}
                                type="number"
                                name="bulk_vip_retail_mc"
                                step={1}
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="VIP Retail Mc value"
                                min={0}
                                onKeyDown={(evt) =>
                                  ["e", "E", "+", "-"].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                value={supplierBulkVipRetailMcValue}
                                onChange={(e) => {
                                  setSupplierBulkVipRetailMcValue(
                                    e.target.value
                                  );
                                  handleSupplierBulkChanges(
                                    e.target.value,
                                    "vip_retail_mc"
                                  );
                                  // handelChange(
                                  //   index,
                                  //   "vip_retail_mc",
                                  //   e.target.value
                                  // );
                                  setValue(
                                    "bulk_vip_retail_mc",
                                    e.target.value
                                  );
                                }}
                                style={{ width: "80px" }}
                              />
                            </div>
                          </th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            Flat MC/G
                            <div>
                              <input
                                {...register(`bulk_vip_retail_flat_mc`, {
                                  required: false,
                                })}
                                type="number"
                                name="bulk_vip_retail_flat_mc"
                                step={1}
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="VIP Retail Flat Mc"
                                min={0}
                                onKeyDown={(evt) =>
                                  ["e", "E", "+", "-"].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                value={supplierBulkVipRetailFlatMcValue}
                                onChange={(e) => {
                                  setSupplierBulkVipRetailFlatMcValue(
                                    e.target.value
                                  );
                                  handleSupplierBulkChanges(
                                    e.target.value,
                                    "vip_retail_flat_mc"
                                  );
                                  // handelChange(
                                  //   index,
                                  //   "vip_retail_flat_mc",
                                  //   e.target.value
                                  // );
                                  setValue(
                                    "bulk_vip_retail_flat_mc",
                                    e.target.value
                                  );
                                }}
                                style={{ width: "80px" }}
                              />
                            </div>
                          </th>

                          {/* Buttons */}
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Duplicate</th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mcvaSettings?.map((obj, index) => {
                          return (
                            <tr key={index}>
                              {/* General Columns */}
                              <td>
                                {index + 1}{" "}
                                <input
                                  type="checkbox"
                                  onChange={(event) => {
                                    handelChange(
                                      index,
                                      "isChecked",
                                      event.target.checked
                                    );
                                  }}
                                  checked={obj.isChecked}
                                />{" "}
                              </td>
                              <td>
                                <div>{obj?.design_name}</div>
                              </td>
                              {isSubDesignRequired === true && (
                                <td>
                                  <div>{obj.sub_design_name}</div>
                                </td>
                              )}
                              {obj?.isChecked == true ? (
                                <td>
                                  <div
                                    className="form-group"
                                    style={{ width: "150px" }}
                                  >
                                    <WeightRangeDropdown
                                      register={register}
                                      id={`id_weight_range${index}`}
                                      name="id_weight_range"
                                      weightRanges={
                                        weightRangeInfo?.weight_ranges
                                      }
                                      selectedWeightRange={obj?.id_weight_range}
                                      onWeightRangeChange={(value) => {
                                        handelChange(
                                          index,
                                          "id_weight_range",
                                          value
                                        );
                                        setValue(
                                          "id_weight_range" + index,
                                          value
                                        );
                                      }}
                                      isRequired={true}
                                      clearErrors={clearErrors}
                                      setValue={setValue}
                                      message={
                                        errors?.[
                                        `id_weight_range` + `${String(index)}`
                                        ] && "Weight Range is Required"
                                      }
                                    />
                                  </div>
                                </td>
                              ) : (
                                <td></td>
                              )}
                              {/* Purchase */}

                              <td>
                                <input
                                  {...register(`purchase_touch${index}`, {
                                    required: "Required",
                                  })}
                                  type="number"
                                  name="purchase_touch"
                                  step={1}
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  placeholder="Purchase Touch"
                                  min={0}
                                  style={{ width: "80px" }}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  value={obj?.purchase_touch}
                                  onChange={(e) => {
                                    handelChange(
                                      index,
                                      "purchase_touch",
                                      e.target.value
                                    );
                                    setValue(
                                      "purchase_touch" + index,
                                      e.target.value
                                    );
                                  }}
                                />
                                {errors?.[
                                  `purchase_touch` + `${String(index)}`
                                ] && (
                                    <span className="text-danger">
                                      <Icon
                                        className={"sm"}
                                        name="alert-circle"
                                      />
                                      {
                                        errors?.[
                                          `purchase_touch` + `${String(index)}`
                                        ].message
                                      }
                                    </span>
                                  )}
                              </td>
                              <td>
                                <div
                                  className="form-group"
                                  style={{ width: "150px" }}
                                >
                                  <div className="form-control-wrap">
                                    <Select
                                      value={obj?.pure_wt_type}
                                      onChange={(e) => {
                                        handelChange(index, "pure_wt_type", e);
                                        setValue("pure_wt_type" + index, e);
                                      }}
                                      options={pureCalcTypeOptions}
                                      placeholder="Select Pure wt type"
                                      id={`pure_wt_type${index}`}
                                      menuPortalTarget={document.body}
                                      styles={{
                                        menuPortal: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                          fontSize: "12px",
                                        }),
                                      }}
                                    />
                                    <input
                                      type="hidden"
                                      value={obj?.pure_wt_type}
                                      {...register(`pure_wt_type${index}`)}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div
                                  className="form-group"
                                  style={{ width: "150px" }}
                                >
                                  <div className="form-control-wrap">
                                    <Select
                                      value={obj?.purchase_va_type}
                                      onChange={(e) => {
                                        handelChange(
                                          index,
                                          "purchase_va_type",
                                          e
                                        );
                                        setValue("purchase_va_type" + index, e);
                                      }}
                                      options={wastageTypeOptions}
                                      placeholder="Select VA type"
                                      id={`purchase_va_type${index}`}
                                      menuPortalTarget={document.body}
                                      styles={{
                                        menuPortal: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                          fontSize: "12px",
                                        }),
                                      }}
                                    />
                                    <input
                                      type="hidden"
                                      value={obj?.purchase_va_type}
                                      {...register(`purchase_va_type${index}`)}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td>
                                <input
                                  {...register(`purchase_va${index}`, {
                                    required: "Required",
                                  })}
                                  type="number"
                                  name="purchase_va"
                                  step={1}
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  placeholder="Purchase Wastage"
                                  min={0}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  value={obj?.purchase_va}
                                  onChange={(e) => {
                                    handelChange(
                                      index,
                                      "purchase_va",
                                      e.target.value
                                    );
                                    setValue(
                                      "purchase_va" + index,
                                      e.target.value
                                    );
                                  }}
                                  style={{ width: "80px" }}
                                />
                                {errors?.[
                                  `purchase_va` + `${String(index)}`
                                ] && (
                                    <span className="text-danger">
                                      <Icon
                                        className={"sm"}
                                        name="alert-circle"
                                      />
                                      {
                                        errors?.[
                                          `purchase_va` + `${String(index)}`
                                        ].message
                                      }
                                    </span>
                                  )}
                              </td>
                              <td>
                                <div
                                  className="form-group"
                                  style={{ width: "150px" }}
                                >
                                  <div className="form-control-wrap">
                                    <Select
                                      value={obj?.purchase_mc_type}
                                      onChange={(e) => {
                                        handelChange(
                                          index,
                                          "purchase_mc_type",
                                          e
                                        );
                                        setValue("purchase_mc_type" + index, e);
                                      }}
                                      options={showMcTypeOptions}
                                      placeholder="Select MC type"
                                      id={`purchase_mc_type${index}`}
                                      menuPortalTarget={document.body}
                                      styles={{
                                        menuPortal: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                          fontSize: "12px",
                                        }),
                                      }}
                                    />
                                    <input
                                      type="hidden"
                                      value={obj?.mc_type}
                                      {...register(`purchase_mc_type${index}`)}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td>
                                <input
                                  {...register(`purchase_mc${index}`, {
                                    required: "Required",
                                  })}
                                  type="number"
                                  name="purchase_mc"
                                  step={1}
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  placeholder="Purchase Mc value"
                                  min={0}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  value={obj?.purchase_mc}
                                  onChange={(e) => {
                                    handelChange(
                                      index,
                                      "purchase_mc",
                                      e.target.value
                                    );
                                    setValue(
                                      "purchase_mc" + index,
                                      e.target.value
                                    );
                                  }}
                                  style={{ width: "80px" }}
                                />
                                {errors?.[
                                  `purchase_mc` + `${String(index)}`
                                ] && (
                                    <span className="text-danger">
                                      <Icon
                                        className={"sm"}
                                        name="alert-circle"
                                      />
                                      {
                                        errors?.[
                                          `purchase_mc` + `${String(index)}`
                                        ].message
                                      }
                                    </span>
                                  )}
                              </td>
                              <td>
                                <input
                                  {...register(`purchase_flat_mc${index}`, {
                                    required: "Required",
                                  })}
                                  type="number"
                                  name="purchase_flat_mc"
                                  step={1}
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  placeholder="Purchase Flat Mc"
                                  min={0}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  value={obj?.purchase_flat_mc}
                                  onChange={(e) => {
                                    handelChange(
                                      index,
                                      "purchase_flat_mc",
                                      e.target.value
                                    );
                                    setValue(
                                      "purchase_flat_mc" + index,
                                      e.target.value
                                    );
                                  }}
                                  style={{ width: "80px" }}
                                />
                                {errors?.[
                                  `purchase_flat_mc` + `${String(index)}`
                                ] && (
                                    <span className="text-danger">
                                      <Icon
                                        className={"sm"}
                                        name="alert-circle"
                                      />
                                      {
                                        errors?.[
                                          `purchase_flat_mc` + `${String(index)}`
                                        ].message
                                      }
                                    </span>
                                  )}
                              </td>
                              {obj?.purchase_sales_rate != null ? (
                                <td>
                                  <input
                                    {...register(
                                      `purchase_sales_rate${index}`,
                                      {
                                        required: "Required",
                                      }
                                    )}
                                    type="number"
                                    name="purchase_sales_rate"
                                    step={1}
                                    className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                    placeholder="Purchase Flat Mc"
                                    min={0}
                                    onKeyDown={(evt) =>
                                      ["e", "E", "+", "-"].includes(evt.key) &&
                                      evt.preventDefault()
                                    }
                                    value={obj?.purchase_sales_rate}
                                    onChange={(e) => {
                                      handelChange(
                                        index,
                                        "purchase_sales_rate",
                                        e.target.value
                                      );
                                      setValue(
                                        "purchase_sales_rate" + index,
                                        e.target.value
                                      );
                                    }}
                                    style={{ width: "80px" }}
                                  />
                                  {errors?.[
                                    `purchase_sales_rate` + `${String(index)}`
                                  ] && (
                                      <span className="text-danger">
                                        <Icon
                                          className={"sm"}
                                          name="alert-circle"
                                        />
                                        {
                                          errors?.[
                                            `purchase_sales_rate` +
                                            `${String(index)}`
                                          ].message
                                        }
                                      </span>
                                    )}
                                </td>
                              ) : (
                                <td>{""}</td>
                              )}

                              {/* Retail */}
                              <td>
                                <input
                                  {...register(`retail_touch${index}`, {
                                    required: "Required",
                                  })}
                                  type="number"
                                  name="retail_touch"
                                  step={1}
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  placeholder="Retail Touch"
                                  min={0}
                                  style={{ width: "80px" }}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  value={obj?.retail_touch}
                                  onChange={(e) => {
                                    handelChange(
                                      index,
                                      "retail_touch",
                                      e.target.value
                                    );
                                    setValue(
                                      "retail_touch" + index,
                                      e.target.value
                                    );
                                  }}
                                />
                                {errors?.[
                                  `retail_touch` + `${String(index)}`
                                ] && (
                                    <span className="text-danger">
                                      <Icon
                                        className={"sm"}
                                        name="alert-circle"
                                      />
                                      {
                                        errors?.[
                                          `retail_touch` + `${String(index)}`
                                        ].message
                                      }
                                    </span>
                                  )}
                              </td>
                              <td>
                                <div
                                  className="form-group"
                                  style={{ width: "150px" }}
                                >
                                  <div className="form-control-wrap">
                                    <Select
                                      value={obj?.retail_va_type}
                                      onChange={(e) => {
                                        handelChange(
                                          index,
                                          "retail_va_type",
                                          e
                                        );
                                        setValue("retail_va_type" + index, e);
                                      }}
                                      options={wastageTypeOptions}
                                      placeholder="Select VA type"
                                      id={`retail_va_type${index}`}
                                      menuPortalTarget={document.body}
                                      styles={{
                                        menuPortal: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                          fontSize: "12px",
                                        }),
                                      }}
                                    />
                                    <input
                                      type="hidden"
                                      value={obj?.mc_type}
                                      {...register(`retail_va_type${index}`)}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td>
                                <input
                                  {...register(`retail_va${index}`, {
                                    required: "Required",
                                  })}
                                  type="number"
                                  name="retail_va"
                                  step={1}
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  placeholder="Retail Wastage"
                                  min={0}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  value={obj?.retail_va}
                                  onChange={(e) => {
                                    handelChange(
                                      index,
                                      "retail_va",
                                      e.target.value
                                    );
                                    setValue(
                                      "retail_va" + index,
                                      e.target.value
                                    );
                                  }}
                                  style={{ width: "80px" }}
                                />
                                {errors?.[`retail_va` + `${String(index)}`] && (
                                  <span className="text-danger">
                                    <Icon
                                      className={"sm"}
                                      name="alert-circle"
                                    />
                                    {
                                      errors?.[`retail_va` + `${String(index)}`]
                                        .message
                                    }
                                  </span>
                                )}
                              </td>
                              <td>
                                <div
                                  className="form-group"
                                  style={{ width: "150px" }}
                                >
                                  <div className="form-control-wrap">
                                    <Select
                                      value={obj?.retail_mc_type}
                                      onChange={(e) => {
                                        handelChange(
                                          index,
                                          "retail_mc_type",
                                          e
                                        );
                                        setValue("retail_mc_type" + index, e);
                                      }}
                                      options={showMcTypeOptions}
                                      placeholder="Select MC type"
                                      id={`retail_mc_type${index}`}
                                      menuPortalTarget={document.body}
                                      styles={{
                                        menuPortal: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                          fontSize: "12px",
                                        }),
                                      }}
                                    />
                                    <input
                                      type="hidden"
                                      value={obj?.mc_type}
                                      {...register(`retail_mc_type${index}`)}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td>
                                <input
                                  {...register(`retail_mc${index}`, {
                                    required: "Required",
                                  })}
                                  type="number"
                                  name="retail_mc"
                                  step={1}
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  placeholder="Retail Mc value"
                                  min={0}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  value={obj?.retail_mc}
                                  onChange={(e) => {
                                    handelChange(
                                      index,
                                      "retail_mc",
                                      e.target.value
                                    );
                                    setValue(
                                      "retail_mc" + index,
                                      e.target.value
                                    );
                                  }}
                                  style={{ width: "80px" }}
                                />
                                {errors?.[`retail_mc` + `${String(index)}`] && (
                                  <span className="text-danger">
                                    <Icon
                                      className={"sm"}
                                      name="alert-circle"
                                    />
                                    {
                                      errors?.[`retail_mc` + `${String(index)}`]
                                        .message
                                    }
                                  </span>
                                )}
                              </td>
                              <td>
                                <input
                                  {...register(`retail_flat_mc${index}`, {
                                    required: "Required",
                                  })}
                                  type="number"
                                  name="retail_flat_mc"
                                  step={1}
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  placeholder="Retail Flat Mc"
                                  min={0}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  value={obj?.retail_flat_mc}
                                  onChange={(e) => {
                                    handelChange(
                                      index,
                                      "retail_flat_mc",
                                      e.target.value
                                    );
                                    setValue(
                                      "retail_flat_mc" + index,
                                      e.target.value
                                    );
                                  }}
                                  style={{ width: "80px" }}
                                />
                                {errors?.[
                                  `retail_flat_mc` + `${String(index)}`
                                ] && (
                                    <span className="text-danger">
                                      <Icon
                                        className={"sm"}
                                        name="alert-circle"
                                      />
                                      {
                                        errors?.[
                                          `retail_flat_mc` + `${String(index)}`
                                        ].message
                                      }
                                    </span>
                                  )}
                              </td>
                              {/* Vip Retail */}
                              <td>
                                <input
                                  {...register(`vip_retail_touch${index}`, {
                                    required: "Required",
                                  })}
                                  type="number"
                                  name="vip_retail_touch"
                                  step={1}
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  placeholder="VIP Retail Touch"
                                  min={0}
                                  style={{ width: "80px" }}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  value={obj?.vip_retail_touch}
                                  onChange={(e) => {
                                    handelChange(
                                      index,
                                      "vip_retail_touch",
                                      e.target.value
                                    );
                                    setValue(
                                      "vip_retail_touch" + index,
                                      e.target.value
                                    );
                                  }}
                                />
                                {errors?.[
                                  `vip_retail_touch` + `${String(index)}`
                                ] && (
                                    <span className="text-danger">
                                      <Icon
                                        className={"sm"}
                                        name="alert-circle"
                                      />
                                      {
                                        errors?.[
                                          `vip_retail_touch` + `${String(index)}`
                                        ].message
                                      }
                                    </span>
                                  )}
                              </td>
                              <td>
                                <div
                                  className="form-group"
                                  style={{ width: "150px" }}
                                >
                                  <div className="form-control-wrap">
                                    <Select
                                      value={obj?.vip_retail_va_type}
                                      onChange={(e) => {
                                        handelChange(
                                          index,
                                          "vip_retail_va_type",
                                          e
                                        );
                                        setValue(
                                          "vip_retail_va_type" + index,
                                          e
                                        );
                                      }}
                                      options={wastageTypeOptions}
                                      placeholder="Select VA type"
                                      id={`vip_retail_va_type${index}`}
                                      menuPortalTarget={document.body}
                                      styles={{
                                        menuPortal: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                          fontSize: "12px",
                                        }),
                                      }}
                                    />
                                    <input
                                      type="hidden"
                                      value={obj?.mc_type}
                                      {...register(
                                        `vip_retail_va_type${index}`
                                      )}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td>
                                <input
                                  {...register(`vip_retail_va${index}`, {
                                    required: "Required",
                                  })}
                                  type="number"
                                  name="vip_retail_va"
                                  step={1}
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  placeholder="Retail Wastage"
                                  min={0}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  value={obj?.vip_retail_va}
                                  onChange={(e) => {
                                    handelChange(
                                      index,
                                      "vip_retail_va",
                                      e.target.value
                                    );
                                    setValue(
                                      "vip_retail_va" + index,
                                      e.target.value
                                    );
                                  }}
                                  style={{ width: "80px" }}
                                />
                                {errors?.[
                                  `vip_retail_va` + `${String(index)}`
                                ] && (
                                    <span className="text-danger">
                                      <Icon
                                        className={"sm"}
                                        name="alert-circle"
                                      />
                                      {
                                        errors?.[
                                          `vip_retail_va` + `${String(index)}`
                                        ].message
                                      }
                                    </span>
                                  )}
                              </td>
                              <td>
                                <div
                                  className="form-group"
                                  style={{ width: "150px" }}
                                >
                                  <div className="form-control-wrap">
                                    <Select
                                      value={obj?.vip_retail_mc_type}
                                      onChange={(e) => {
                                        handelChange(
                                          index,
                                          "vip_retail_mc_type",
                                          e
                                        );
                                        setValue(
                                          "vip_retail_mc_type" + index,
                                          e
                                        );
                                      }}
                                      options={showMcTypeOptions}
                                      placeholder="Select MC type"
                                      id={`vip_retail_mc_type${index}`}
                                      menuPortalTarget={document.body}
                                      styles={{
                                        menuPortal: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                          fontSize: "12px",
                                        }),
                                      }}
                                    />
                                    <input
                                      type="hidden"
                                      value={obj?.mc_type}
                                      {...register(
                                        `vip_retail_mc_type${index}`
                                      )}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td>
                                <input
                                  {...register(`vip_retail_mc${index}`, {
                                    required: "Required",
                                  })}
                                  type="number"
                                  name="vip_retail_mc"
                                  step={1}
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  placeholder="VIP Retail Mc value"
                                  min={0}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  value={obj?.vip_retail_mc}
                                  onChange={(e) => {
                                    handelChange(
                                      index,
                                      "vip_retail_mc",
                                      e.target.value
                                    );
                                    setValue(
                                      "vip_retail_mc" + index,
                                      e.target.value
                                    );
                                  }}
                                  style={{ width: "80px" }}
                                />
                                {errors?.[
                                  `vip_retail_mc` + `${String(index)}`
                                ] && (
                                    <span className="text-danger">
                                      <Icon
                                        className={"sm"}
                                        name="alert-circle"
                                      />
                                      {
                                        errors?.[
                                          `vip_retail_mc` + `${String(index)}`
                                        ].message
                                      }
                                    </span>
                                  )}
                              </td>
                              <td>
                                <input
                                  {...register(`vip_retail_flat_mc${index}`, {
                                    required: "Required",
                                  })}
                                  type="number"
                                  name="vip_retail_flat_mc"
                                  step={1}
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  placeholder="VIP Retail Flat Mc"
                                  min={0}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  value={obj?.vip_retail_flat_mc}
                                  onChange={(e) => {
                                    handelChange(
                                      index,
                                      "vip_retail_flat_mc",
                                      e.target.value
                                    );
                                    setValue(
                                      "vip_retail_flat_mc" + index,
                                      e.target.value
                                    );
                                  }}
                                  style={{ width: "80px" }}
                                />
                                {errors?.[
                                  `vip_retail_flat_mc` + `${String(index)}`
                                ] && (
                                    <span className="text-danger">
                                      <Icon
                                        className={"sm"}
                                        name="alert-circle"
                                      />
                                      {
                                        errors?.[
                                          `vip_retail_flat_mc` +
                                          `${String(index)}`
                                        ].message
                                      }
                                    </span>
                                  )}
                              </td>

                              {/*Buttons*/}
                              <td>
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="btn-icon btn-white btn-dim"
                                  onClick={() => handleDuplicate(index)}
                                >
                                  <Icon name="copy-fill" />
                                </Button>
                              </td>
                              <td>
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="btn-icon btn-white btn-dim"
                                  onClick={() => deleteMcVaSettings(index)}
                                >
                                  <Icon name="trash-fill" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Row>
              {/* </div> */}
            </TabPane>

            <TabPane tabId={2}>
              {/* <div className="custom-grid"> */}
                <Row md={12} className="form-group row g-4">
                  <Col lg="2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="product">
                        Product
                        <IsRequired />
                      </label>
                      <ProductDropdown
                        register={register1}
                        id={"selectedCustomerProduct"}
                        products={products}
                        selectedProduct={selectedCustomerProduct}
                        onProductChange={(value) => {
                          setSelectedCustomerProduct(value);

                          dispatch(getWeightRangeById(value));
                          setCustomerMcvaSettings([]);
                          reset();
                        }}
                        isRequired={true}
                        clearErrors={clearErrors1}
                        setValue={setValue1}
                        message={
                          errors1.selectedCustomerProduct &&
                          "Product is Required"
                        }
                      />
                    </div>
                  </Col>

                  <Col lg="2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="supplier">
                        Purity
                        <IsRequired />
                      </label>
                      <PurityDropdown
                        register={register1}
                        id={"selectedCustomerPurity"}
                        purities={purities}
                        onPurityChange={setSelectedCustomerPurity}
                        selectedPurity={selectedCustomerPurity}
                        isRequired={true}
                        clearErrors={clearErrors1}
                        setValue={setValue1}
                        message={
                          errors1.selectedCustomerPurity && "Purity is Required"
                        }
                        readOnly={false}
                      />
                      {/* {errors.selectedSupplier && <span className="invalid">This field is required</span>} */}
                    </div>
                  </Col>
                  <Col lg={5}>
                    <div style={{ marginTop: "35px" }}>
                        <SaveButton
                          size="md"
                          color="secondary"
                          onClick={filterCustomerMcVa}
                        >
                          Filter
                        </SaveButton>
                        <SaveButton
                          disabled={issubmitting}
                          size="md"
                          color="primary"
                          onClick={handleSubmit1(postData)}
                        >
                          {issubmitting ? "Saving" : "Save[Ctrl+s] "}
                        </SaveButton>

                        <CancelButton
                          disabled={issubmitting}
                          color="danger"
                          size="md"
                          onClick={() => navigate(`${process.env.PUBLIC_URL}/`)}
                        >
                          Cancel
                        </CancelButton>
                    </div>
                  </Col>
                </Row>

                <Row md={12} className="form-group row g-4">
                  <div className="table-responsive" style={{ overflowY: 'auto' }}>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th
                            colSpan={isSubDesignRequired == true ? "4" : "3"}
                            style={{ textAlign: "center",position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}
                          >
                            General
                          </th>

                          <th colSpan="1" style={{ textAlign: "center",position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>
                            VA Type
                          </th>
                          <th colSpan="2" style={{ textAlign: "center",position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>
                            VA(%)
                          </th>
                          <th colSpan="1" style={{ textAlign: "center",position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>
                            MC Type
                          </th>
                          <th colSpan="2" style={{ textAlign: "center" ,position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa'}}>
                            MC/G
                          </th>
                          <th colSpan="2" style={{ textAlign: "center" ,position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa'}}>
                            Flat MC/G
                          </th>
                          <th colSpan="1" style={{ textAlign: "center" ,position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa'}}>
                            Sales Rate
                          </th>
                          <th colSpan="1" style={{ textAlign: "center" ,position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa'}}>
                            Sales Rate Type
                          </th>
                          <th colSpan="2" style={{ textAlign: "center" ,position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa'}}>
                            Actions
                          </th>
                        </tr>
                        <tr>
                          {/* General Columns */}
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            S.NO
                            {/* <input
                          type="checkbox"
                          onChange={(event) => {
                            selectAllCol(event.target.checked);
                            setSelectAll(event.target.checked);
                          }}
                          checked={selectAll}
                        />{" "} */}
                          </th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Design</th>
                          {isSubDesignRequired && <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Sub Design</th>}
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Weight Range</th>

                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                        <thead>
                          <tr >
                            <th style={{ textAlign: "left", fontWeight: "normal" ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                              <div className="form-control-wrap" style={{ display: "inline-block", width: "150px",marginLeft: "-10px"}}>
                                <Select
                                  value={selectedVaType}
                                  onChange={(e) => {
                                    setSelectedVaType(e);
                                    // Update all rows with this selection
                                    const updatedSettings = customerMcvaSettings.map(setting => ({
                                      ...setting,
                                      va_type: e
                                    }));
                                    setCustomerMcvaSettings(updatedSettings);
                                  }}
                                  options={wastageTypeOptions}
                                  placeholder="Select VA type"
                                  id="va_type"
                                  menuPortalTarget={document.body}
                                  styles={{
                                    control: (base) => ({
                                      ...base,
                                      minHeight: "30px",
                                      fontSize: "12px",
                                      fontWeight: "normal",
                                    }),
                                    singleValue: (base) => ({
                                      ...base,
                                      fontSize: "12px",
                                      fontWeight: "normal",
                                    }),
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                      fontSize: "12px",
                                    }),
                                  }}
                                />
                              </div>
                            </th>
                          </tr>
                        </thead>
                      </th>

                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            Max
                            <div>
                              <input
                                {...register1(`bulk_max_va_value`, {
                                  required: false,
                                })}
                                type="number"
                                step={1}
                                min={0}
                                name="bulk_max_va_value"
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="Max VA Value"
                                onKeyDown={(evt) =>
                                  ["e", "E", "+", "-"].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                value={customerBulkMaxVaValue}
                                onChange={(e) => {
                                  setCustomerBulkMaxVaValue(e.target.value);
                                  handleCustomerBulkChanges(
                                    e.target.value,
                                    "max_va_value"
                                  );
                                  setValue1(
                                    "bulk_max_va_value",
                                    e.target.value
                                  );
                                }}
                                style={{ width: "80px" }}
                              />
                            </div>
                          </th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            Min
                            <div>
                              <input
                                {...register1(`bulk_min_va_value`, {
                                  required: false,
                                })}
                                type="number"
                                name="bulk_min_va_value"
                                step={1}
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="Min VA value"
                                min={0}
                                onKeyDown={(evt) =>
                                  ["e", "E", "+", "-"].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                value={customerBulkMinVaValue}
                                onChange={(e) => {
                                  const enteredValue = e.target.value;
                                  if (
                                    parseFloat(enteredValue) >
                                    parseFloat(customerBulkMaxVaValue)
                                  ) {
                                    toastfunc(
                                      `Entered value cannot exceed max va value ${customerBulkMaxVaValue}`
                                    );
                                    setValue1(
                                      "bulk_min_va_value",
                                      customerBulkMinVaValue
                                    );
                                  } else {
                                    setCustomerBulkMinVaValue(enteredValue);
                                    handleCustomerBulkChanges(
                                      e.target.value,
                                      "min_va_value"
                                    );
                                    // handelCustomerChange(
                                    //   index,
                                    //   "min_va_value",
                                    //   e.target.value
                                    // );
                                    setValue1(
                                      "bulk_min_va_value",
                                      e.target.value
                                    );
                                  }
                                }}
                                style={{ width: "80px" }}
                              />
                            </div>
                          </th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            <thead>
                              <tr>
                                <th colSpan="100%" style={{ textAlign: "left" }}>
                                  <div className="form-control-wrap" style={{ display: "inline-block", width: "150px", fontWeight: "normal",marginLeft: "-10px" }}>
                                    <Select
                                      value={selectedMcType}
                                      onChange={(e) => {
                                        setSelectedMcType(e);
                                        // Update all rows with the same MC Type
                                        const updatedSettings = customerMcvaSettings.map(setting => ({
                                          ...setting,
                                          mc_type: e
                                        }));
                                        setCustomerMcvaSettings(updatedSettings);
                                      }}
                                      options={showMcTypeOptions}
                                      placeholder="Select MC type"
                                      id="mc_type"
                                      menuPortalTarget={document.body}
                                      styles={{
                                        control: (base) => ({
                                          ...base,
                                          minHeight: "30px",
                                          fontSize: "12px",
                                        }),
                                        singleValue: (base) => ({
                                          ...base,
                                          fontSize: "12px",
                                        }),
                                        menuPortal: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                          fontSize: "12px",
                                        }),
                                      }}
                                    />
                                  </div>
                                </th>
                              </tr>
                            </thead>
                          </th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            Max
                            <div>
                              <input
                                {...register1(`bulk_max_mc_value`, {
                                  required: false,
                                })}
                                type="number"
                                step={1}
                                min={0}
                                name="bulk_max_mc_value"
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="Max Mc Value"
                                onKeyDown={(evt) =>
                                  ["e", "E", "+", "-"].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                value={customerBulkMaxMcValue}
                                onChange={(e) => {
                                  setCustomerBulkMaxMcValue(e.target.value);
                                  handleCustomerBulkChanges(
                                    e.target.value,
                                    "max_mc_value"
                                  );

                                  setValue1(
                                    "bulk_max_mc_value",
                                    e.target.value
                                  );
                                }}
                                style={{ width: "80px" }}
                              />
                            </div>
                          </th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            Min
                            <div>
                              <input
                                {...register1(`bulk_min_mc_value`, {
                                  required: false,
                                })}
                                type="number"
                                name="bulk_min_mc_value"
                                step={1}
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="Min MC value"
                                min={0}
                                onKeyDown={(evt) =>
                                  ["e", "E", "+", "-"].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                value={customerBulkMinMcValue}
                                onChange={(e) => {
                                  const enteredValue = e.target.value;
                                  if (
                                    parseFloat(enteredValue) >
                                    parseFloat(customerBulkMaxMcValue)
                                  ) {
                                    toastfunc(
                                      `Entered value cannot exceed max va value ${customerBulkMaxMcValue}`
                                    );
                                    setValue1(
                                      "bulk_min_mc_value",
                                      customerBulkMinMcValue
                                    );
                                  } else {
                                    setCustomerBulkMinMcValue(enteredValue);
                                    handleCustomerBulkChanges(
                                      e.target.value,
                                      "min_mc_value"
                                    );
                                    // handelCustomerChange(
                                    //   index,
                                    //   "min_va_value",
                                    //   e.target.value
                                    // );
                                    setValue1(
                                      "bulk_min_mc_value",
                                      e.target.value
                                    );
                                  }
                                }}
                                style={{ width: "80px" }}
                              />
                            </div>
                          </th>

                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            Max
                            <div>
                              <input
                                {...register1(`bulk_flat_mc_value_max`, {
                                  required: false,
                                })}
                                type="number"
                                name="bulk_flat_mc_value_max"
                                step={1}
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="Flat Mc Max"
                                min={0}
                                onKeyDown={(evt) =>
                                  ["e", "E", "+", "-"].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                value={customerBulkFlatMcMax}
                                onChange={(e) => {
                                  setCustomerBulkFlatMcMax(e.target.value);
                                  handleCustomerBulkChanges(
                                    e.target.value,
                                    "flat_mc_max"
                                  );
                                  // handelCustomerChange(
                                  //   index,
                                  //   "flat_mc",
                                  //   e.target.value
                                  // );
                                  setValue1(
                                    "bulk_flat_mc_value_max",
                                    e.target.value
                                  );
                                }}
                                style={{ width: "80px" }}
                              />
                            </div>
                          </th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            Min
                            <div>
                              <input
                                {...register1(`bulk_flat_mc_value_min`, {
                                  required: false,
                                })}
                                type="number"
                                name="bulk_flat_mc_value_min"
                                step={1}
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                placeholder="Flat Mc Min"
                                min={0}
                                onKeyDown={(evt) =>
                                  ["e", "E", "+"].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                value={customerBulkFlatMc}
                                onChange={(e) => {
                                  const enteredValue = e.target.value;
                                  if (
                                    parseFloat(enteredValue) >
                                    parseFloat(customerBulkFlatMcMax)
                                  ) {
                                    toastfunc(
                                      `Entered value cannot exceed max va value ${customerBulkFlatMcMax}`
                                    );
                                    setValue1(
                                      "bulk_flat_mc_value_min",
                                      customerBulkFlatMc
                                    );
                                  } else {
                                      setCustomerBulkFlatMc(e.target.value);
                                      handleCustomerBulkChanges(
                                        e.target.value,
                                        "flat_mc_min"
                                      );
                                      setValue1(
                                        "bulk_flat_mc_value_min",
                                        e.target.value
                                      );
                                  }
                                  // handelCustomerChange(
                                  //   index,
                                  //   "flat_mc",
                                  //   e.target.value
                                  // );

                                }}
                                style={{ width: "80px" }}
                              />
                            </div>
                          </th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                            {customerMcvaSettings?.some(
                              (item) => item?.sales_rate != null
                            ) && (
                                <div className="form-control-wrap input-group gross_weight">
                                  <input
                                    {...register1(`bulk_sales_rate_value`, {
                                      required: false,
                                    })}
                                    type="number"
                                    name="bulk_sales_rate_value"
                                    step={1}
                                    className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                    placeholder="Sales rate"
                                    min={0}
                                    onKeyDown={(evt) =>
                                      ["e", "E", "+", "-"].includes(evt.key) &&
                                      evt.preventDefault()
                                    }
                                    value={customerBulkSalesRate}
                                    onChange={(e) => {
                                      setCustomerBulkSalesRate(e.target.value);
                                      handleCustomerBulkChanges(
                                        e.target.value,
                                        "sales_rate"
                                      );
                                      // handelCustomerChange(
                                      //   index,
                                      //   "sales_rate",
                                      //   e.target.value
                                      // );
                                      setValue1(
                                        "bulk_sales_rate_value",
                                        e.target.value
                                      );
                                    }}
                                    style={{ width: "80px" }}
                                  />
                                  
                                </div>
                              )}
                          </th>

                          <th style={{ position: 'sticky', top: 0, zIndex: 5, backgroundColor:'#f8f9fa' }}>
                            {customerMcvaSettings?.some(
                              (item) => item?.sales_rate != null
                            ) && (
                               <div className="form-control-wrap input-group gross_weight">
<UncontrolledButtonDropdown
                                                className="input-group-append"
                                                style={{ maxWidth:  "50%"  }}
                                                // tabIndex="-1"
                                              >
                                                <DropdownToggle
                                                  tag="button"
                                                  className="btn btn-outline-primary btn-dim dropdown-toggle"
                                                >
                                                  <span>{customerBulkSalesRateTypeLabel}</span>
                                                  <Icon name="chevron-down" className="mx-n1"></Icon>
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                  <ul className="link-list-opt no-bdr">
                                                    {[{label:"Amount", value:1},
                                                      {label:"Percentage", value:2}
                                                    ]?.map((option) => (
                                                      <li key={option.value}>
                                                        <DropdownItem
                                                          key={option.value}
                                                          onClick={() => {
                                                            setCustomerBulkSalesRateType(option.value);
                                                            setCustomerBulkSalesRateTypeLabel(option.label);
                                      handleCustomerBulkChanges(
                                        option.value,
                                        "sales_rate_type"
                                      );
                                      handleCustomerBulkChanges(
                                        option.label,
                                        "sales_rate_type_label"
                                      );
                                      // handelCustomerChange(
                                      //   index,
                                      //   "sales_rate",
                                      //   e.target.value
                                      // );
                                      setValue1(
                                        "bulk_sales_rate_type_value",
                                        option.value
                                      );
                                                          }}
                                                        >
                                                          {option.label}
                                                        </DropdownItem>
                                                      </li>
                                                    ))}
                                                  </ul>
                                                </DropdownMenu>
                                              </UncontrolledButtonDropdown>
                                              <input
                                                type="hidden"
                                                value={customerBulkSalesRateType || ""}
                                                {...register('bulk_sales_rate_type_value')}
                                              />
                              </div>
                              )}
                          </th>
                          {/* Buttons */}
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Duplicate</th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerMcvaSettings?.map((obj, index) => {
                          return (
                            <tr key={index}>
                              {/* General Columns */}
                              <td>
                                {index + 1}{" "}
                                <input
                                  type="checkbox"
                                  onChange={(event) => {
                                    handelCustomerChange(
                                      index,
                                      "isChecked",
                                      event.target.checked
                                    );
                                  }}
                                  checked={obj.isChecked}
                                />{" "}
                              </td>
                              <td>
                                <div>{obj?.design_name}</div>
                              </td>
                              {isSubDesignRequired === true && (
                                <td>
                                  <div>{obj.sub_design_name}</div>
                                </td>
                              )}
                              {obj?.isChecked == true ? (
                                <td>
                                  <div
                                    className="form-group"
                                    style={{ width: "150px" }}
                                  >
                                    <WeightRangeDropdown
                                      register={register1}
                                      id={`id_weight_range${index}`}
                                      name="id_weight_range"
                                      weightRanges={
                                        weightRangeInfo?.weight_ranges
                                      }
                                      selectedWeightRange={obj?.id_weight_range}
                                      onWeightRangeChange={(value) => {
                                        handelCustomerChange(
                                          index,
                                          "id_weight_range",
                                          value
                                        );
                                        setValue1(
                                          "id_weight_range" + index,
                                          value
                                        );
                                      }}
                                      isRequired={true}
                                      clearErrors={clearErrors1}
                                      setValue={setValue1}
                                      message={
                                        errors1?.[
                                        `id_weight_range` + `${String(index)}`
                                        ] && "Weight Range is Required"
                                      }
                                    />
                                  </div>
                                </td>
                              ) : (
                                <td></td>
                              )}

                              <td>
                                <div
                                  className="form-group"
                                  style={{ width: "150px" }}
                                >
                                  <div className="form-control-wrap">
                                    <Select
                                      value={obj?.va_type}
                                      onChange={(e) => {
                                        handelCustomerChange(
                                          index,
                                          "va_type",
                                          e
                                        );
                                        setValue1("va_type" + index, e);
                                      }}
                                      options={wastageTypeOptions}
                                      placeholder="Select VA type"
                                      id={`va_type${index}`}
                                      menuPortalTarget={document.body}
                                      styles={{
                                        menuPortal: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                          fontSize: "12px",
                                        }),
                                      }}
                                    />
                                    <input
                                      type="hidden"
                                      value={obj?.mc_type}
                                      {...register1(`va_type${index}`)}
                                    />
                                  </div>
                                </div>
                              </td>

                              <td>
                                <input
                                  {...register1(`max_va_value${index}`, {
                                    required: "Required",
                                  })}
                                  type="number"
                                  step={1}
                                  min={0}
                                  name="max_va_value"
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  placeholder="Max VA Value"
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  value={obj?.max_va_value}
                                  onChange={(e) => {
                                    handelCustomerChange(
                                      index,
                                      "max_va_value",
                                      e.target.value
                                    );
                                    setValue1(
                                      "max_va_value" + index,
                                      e.target.value
                                    );
                                  }}
                                  style={{ width: "80px" }}
                                />
                                {errors1?.[
                                  `max_va_value` + `${String(index)}`
                                ] && (
                                    <span className="text-danger">
                                      <Icon
                                        className={"sm"}
                                        name="alert-circle"
                                      />
                                      {
                                        errors1?.[
                                          `max_va_value` + `${String(index)}`
                                        ].message
                                      }
                                    </span>
                                  )}
                              </td>
                              <td>
                                <input
                                  {...register1(`min_va_value${index}`, {
                                    required: "Required",
                                  })}
                                  type="number"
                                  name="min_va_value"
                                  step={1}
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  placeholder="Min VA value"
                                  min={0}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  value={obj?.min_va_value}
                                  onChange={(e) => {
                                    const enteredValue = e.target.value;
                                    if (
                                      parseFloat(enteredValue) >
                                      parseFloat(obj?.max_va_value)
                                    ) {
                                      toastfunc(
                                        `Entered value cannot exceed max va value ${obj.max_va_value}`
                                      );
                                      setValue1(
                                        "min_va_value" + index,
                                        obj.min_va_value
                                      );
                                    } else {
                                      handelCustomerChange(
                                        index,
                                        "min_va_value",
                                        e.target.value
                                      );
                                      setValue1(
                                        "min_va_value" + index,
                                        e.target.value
                                      );
                                    }
                                  }}
                                  style={{ width: "80px" }}
                                />
                                {errors1?.[
                                  `min_va_value` + `${String(index)}`
                                ] && (
                                    <span className="text-danger">
                                      <Icon
                                        className={"sm"}
                                        name="alert-circle"
                                      />
                                      {
                                        errors1?.[
                                          `min_va_value` + `${String(index)}`
                                        ].message
                                      }
                                    </span>
                                  )}
                              </td>

                              <td>
                                <div
                                  className="form-group"
                                  style={{ width: "150px" }}
                                >
                                  <div className="form-control-wrap">
                                    <Select
                                      value={obj?.mc_type}
                                      onChange={(e) => {
                                        handelCustomerChange(
                                          index,
                                          "mc_type",
                                          e
                                        );
                                        setValue1("mc_type" + index, e);
                                      }}
                                      options={showMcTypeOptions}
                                      placeholder="Select MC type"
                                      id={`mc_type${index}`}
                                      menuPortalTarget={document.body}
                                      styles={{
                                        menuPortal: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                          fontSize: "12px",
                                        }),
                                      }}
                                    />
                                    <input
                                      type="hidden"
                                      value={obj?.mc_type}
                                      {...register1(`mc_type${index}`)}
                                    />
                                  </div>
                                </div>
                              </td>

                              <td>
                                <input
                                  {...register1(`max_mc_value${index}`, {
                                    required: "Required",
                                  })}
                                  type="number"
                                  step={1}
                                  min={0}
                                  name="max_mc_value"
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  placeholder="Max Mc Value"
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  value={obj?.max_mc_value}
                                  onChange={(e) => {
                                    handelCustomerChange(
                                      index,
                                      "max_mc_value",
                                      e.target.value
                                    );
                                    setValue1(
                                      "max_mc_value" + index,
                                      e.target.value
                                    );
                                  }}
                                  style={{ width: "80px" }}
                                />
                                {errors1?.[
                                  `max_mc_value` + `${String(index)}`
                                ] && (
                                    <span className="text-danger">
                                      <Icon
                                        className={"sm"}
                                        name="alert-circle"
                                      />
                                      {
                                        errors1?.[
                                          `max_mc_value` + `${String(index)}`
                                        ].message
                                      }
                                    </span>
                                  )}
                              </td>
                              <td>
                                <input
                                  {...register(`min_mc_value${index}`, {
                                    required: "Required",
                                  })}
                                  type="number"
                                  name="min_mc_value"
                                  step={1}
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  placeholder="Min Mc value"
                                  min={0}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  value={obj?.min_mc_value}
                                  onChange={(e) => {
                                    const enteredValue = e.target.value;
                                    if (
                                      parseFloat(enteredValue) >
                                      parseFloat(obj?.max_mc_value)
                                    ) {
                                      toastfunc(
                                        `Entered value cannot exceed max mc value ${obj.max_mc_value}`
                                      );
                                      setValue1(
                                        "min_mc_value" + index,
                                        obj.min_mc_value
                                      );
                                    } else {
                                      handelCustomerChange(
                                        index,
                                        "min_mc_value",
                                        e.target.value
                                      );
                                      setValue1(
                                        "min_mc_value" + index,
                                        e.target.value
                                      );
                                    }
                                  }}
                                  style={{ width: "80px" }}
                                />
                                {errors1?.[
                                  `min_mc_value` + `${String(index)}`
                                ] && (
                                    <span className="text-danger">
                                      <Icon
                                        className={"sm"}
                                        name="alert-circle"
                                      />
                                      {
                                        errors1?.[
                                          `min_mc_value` + `${String(index)}`
                                        ].message
                                      }
                                    </span>
                                  )}
                              </td>

                                                            <td>
                                <input
                                  {...register1(`flat_mc_max_${index}`, {
                                    required: "Required",
                                  })}
                                  type="number"
                                  name="flat_mc_max"
                                  step={1}
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  placeholder="Flat Mc Max"
                                  min={0}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  value={obj?.flat_mc_max}
                                  onChange={(e) => {
                                    handelCustomerChange(
                                      index,
                                      "flat_mc_max",
                                      e.target.value
                                    );
                                    setValue1(
                                      "flat_mc_max_" + index,
                                      e.target.value
                                    );
                                  }}
                                  style={{ width: "80px" }}
                                />
                                {errors1?.[`flat_mc_max_` + `${String(index)}`] && (
                                  <span className="text-danger">
                                    <Icon
                                      className={"sm"}
                                      name="alert-circle"
                                    />
                                    {
                                      errors1?.[`flat_mc_max_` + `${String(index)}`]
                                        .message
                                    }
                                  </span>
                                )}
                              </td>

                              <td>
                                <input
                                  {...register1(`flat_mc_min${index}`, {
                                    required: "Required",
                                  })}
                                  type="number"
                                  name="flat_mc_min"
                                  step={1}
                                  className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                  placeholder="Flat Mc Min"
                                  min={0}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  value={obj?.flat_mc_min}
                                  onChange={(e) => {
                                    const enteredValue = e.target.value;
                                    if (
                                      parseFloat(enteredValue) >
                                      parseFloat(obj?.flat_mc_max)
                                    ) {
                                      toastfunc(
                                        `Entered value cannot exceed max mc value ${obj.flat_mc_max}`
                                      );
                                      setValue1(
                                        "min_mc_value" + index,
                                        obj.flat_mc_min
                                      );
                                    } else {
                                    handelCustomerChange(
                                      index,
                                      "flat_mc_min",
                                      e.target.value
                                    );
                                    setValue1(
                                      "flat_mc_min" + index,
                                      e.target.value
                                    );
                                  }
                                  }}
                                  style={{ width: "80px" }}
                                />
                                {errors1?.[`flat_mc_min` + `${String(index)}`] && (
                                  <span className="text-danger">
                                    <Icon
                                      className={"sm"}
                                      name="alert-circle"
                                    />
                                    {
                                      errors1?.[`flat_mc_min` + `${String(index)}`]
                                        .message
                                    }
                                  </span>
                                )}
                              </td>



                              {obj?.sales_rate != null ? (
                                <td style={{width:"200px"}}>
                                  <div className="form-control-wrap input-group gross_weight">
                                  <input
                                    {...register1(`sales_rate${index}`, {
                                      required: "Required",
                                    })}
                                    type="number"
                                    name="sales_rate"
                                    step={1}
                                    className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                    placeholder="Sales rate"
                                    min={0}
                                    onKeyDown={(evt) =>
                                      ["e", "E", "+", "-"].includes(evt.key) &&
                                      evt.preventDefault()
                                    }
                                    value={obj?.sales_rate}
                                    onChange={(e) => {
                                      handelCustomerChange(
                                        index,
                                        "sales_rate",
                                        e.target.value
                                      );
                                      setValue1(
                                        "sales_rate" + index,
                                        e.target.value
                                      );
                                    }}
                                    style={{ width: "80px" }}
                                  />
                                 
                                </div>
                                  {errors1?.[
                                    `sales_rate` + `${String(index)}`
                                  ] && (
                                      <span className="text-danger">
                                        <Icon
                                          className={"sm"}
                                          name="alert-circle"
                                        />
                                        {
                                          errors1?.[
                                            `sales_rate` + `${String(index)}`
                                          ].message
                                        }
                                      </span>
                                    )}
                                </td>
                              ) : (
                                <td>{""}</td>
                              )}

                               {obj?.sales_rate != null ? (
                                <td style={{width:"200px"}}>
                                  <div className="form-control-wrap input-group gross_weight">
                                     <UncontrolledButtonDropdown
                                                className="input-group-append"
                                                style={{ maxWidth:  "50%"  }}
                                                tabIndex="-1"
                                              >
                                                <DropdownToggle
                                                  tag="button"
                                                  className="btn btn-outline-primary btn-dim dropdown-toggle"
                                                >
                                                  <span>{obj?.sales_rate_type_label}</span>
                                                  <Icon name="chevron-down" className="mx-n1"></Icon>
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                  <ul className="link-list-opt no-bdr">
                                                    {[{label:"Amount", value:1},
                                                      {label:"Percentage", value:2}
                                                    ]?.map((option) => (
                                                      <li key={option.value}>
                                                        <DropdownItem
                                                          key={option.value}
                                                          onClick={() => {
                                                            
                                      
                                      handelCustomerChange(
                                        index,
                                        "sales_rate_type",
                                        option.value
                                      );
                                      handelCustomerChange(
                                        index,
                                        "sales_rate_type_label",
                                        option.label
                                      );
                                      setValue1(
                                        "sales_rate_type" + index,
                                        option.value
                                      );
                                                          }}
                                                        >
                                                          {option.label}
                                                        </DropdownItem>
                                                      </li>
                                                    ))}
                                                  </ul>
                                                </DropdownMenu>
                                              </UncontrolledButtonDropdown>
                                              <input
                                                type="hidden"
                                                value={obj?.sales_rate_type_label || ""}
                                                {...register('sales_rate_type')}
                                              />
                                  </div>

                                  </td>
                              ) : (
                                <td>{""}</td>
                              )}

                              {/*Buttons*/}
                              <td>
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="btn-icon btn-white btn-dim"
                                  onClick={() => handleCustomerDuplicate(index)}
                                >
                                  <Icon name="copy-fill" />
                                </Button>
                              </td>
                              <td>
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="btn-icon btn-white btn-dim"
                                  onClick={() =>
                                    deleteCustomerMcVaSettings(index)
                                  }
                                >
                                  <Icon name="trash-fill" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Row>
              {/* </div> */}
            </TabPane>
          </TabContent>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};
export default McVaSettingsForm;
