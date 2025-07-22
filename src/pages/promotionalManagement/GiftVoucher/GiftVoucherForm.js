/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  CancelButton,
  PreviewCard,
  SaveButton,
  DateInputField,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import {
  Col,
  Icon,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import BranchDropdownMulti from "../../../components/common/dropdown/BranchDropdownMulti";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
import {
  createGiftVoucher,
  getGiftVoucherById,
  updateGiftVoucherById,
} from "../../../redux/thunks/promotionManagement";
import moment from "moment/moment";
import ReactQuill from "react-quill";
import {
  useCategories,
  useProducts,
} from "../../../components/filters/filterHooks";
import { CategoryDropdown } from "../../../components/filters/retailFilters";
import ProductDropdownMulti from "../../../components/common/dropdown/ProductDropdownMulti";

const GiftVoucherForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
    setValue,
  } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.promotionManagementGiftVoucherReducer
  );
  const { promotionManagementGiftVoucherInfo } = useSelector(
    (state) => state.promotionManagementGiftVoucherReducer
  );

  const [voucherName, SetVoucherName] = useState();
  const [shortCode, setShortCode] = useState();
  const [voucherCode, setVoucherCode] = useState("1");
  const [voucherAmount, SetVoucherAmount] = useState();
  const [redeemableOn, SetRedeemableOn] = useState("1");
  const [usageLimit, SetUsageLimit] = useState();
  const [voucherType, SetVoucherType] = useState("1");
  const [issuedTo, SetIssuedTo] = useState("1");
  const [validityFrom, SetValidityFrom] = useState(new Date());
  const [validityTo, SetValidityTo] = useState(new Date());
  const [termsAndConditions, setTermsAndConditions] = useState();
  const [conditions, setConditions] = useState("0");
  const [applyOn, SetApplyOn] = useState("1");
  const [active, setActive] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState([]);

  const { categories } = useCategories();
  const { products } = useProducts();

  const postData = async () => {
    const addData = {
      voucher_name: voucherName,
      voucher_code: voucherCode,
      voucher_amount: voucherAmount,
      redemable_on: redeemableOn,
      usage_limit: usageLimit,
      voucher_type: voucherType,
      issued_to: issuedTo,
      validity_from: moment(validityFrom).format("YYYY-MM-DD"),
      validity_to: moment(validityTo).format("YYYY-MM-DD"),
      terms_and_conditions: termsAndConditions,
      apply_on: applyOn,
      conditions,
      is_active: active,
      shortcode: shortCode,

      product: selectedProduct?.map((obj) => {
        const container = obj.value;
        return container;
      }),
    };
    try {
      await dispatch(createGiftVoucher(addData)).unwrap();
      toastsuccess("Gift Voucher Edited successfully");
      navigate(
        `${process.env.PUBLIC_URL}/promotional_management/gift_voucher/list`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const addData = {
      voucher_name: voucherName,
      voucher_code: voucherCode,

      voucher_amount: voucherAmount,
      redemable_on: redeemableOn,
      usage_limit: usageLimit,
      voucher_type: voucherType,
      issued_to: issuedTo,
      validity_from: moment(validityFrom).format("YYYY-MM-DD"),
      validity_to: moment(validityTo).format("YYYY-MM-DD"),
      terms_and_conditions: termsAndConditions,
      conditions,
      is_active: active,

      apply_on: applyOn,
      product: selectedProduct?.map((obj) => {
        const container = obj.value;
        return container;
      }),
    };

    try {
      await dispatch(createGiftVoucher(addData)).unwrap();
      toastsuccess("Gift Voucher created successfully");
      SetVoucherName("");
      setVoucherCode("1");
      SetVoucherAmount("");
      SetRedeemableOn(1);
      SetUsageLimit("");
      SetVoucherType(1);
      SetIssuedTo(1);
      SetValidityFrom();
      SetValidityTo();
      setTermsAndConditions("");
      setConditions("");
      setShortCode("");
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (value) => {
    setTermsAndConditions(value);
  };

  useEffect(() => {
    id !== undefined && dispatch(getGiftVoucherById(id));
  }, [dispatch, id]);

  useEffect(() => {
    promotionManagementGiftVoucherInfo != undefined &&
      (SetVoucherName(promotionManagementGiftVoucherInfo?.voucher_name),
      setVoucherCode(promotionManagementGiftVoucherInfo?.voucher_code),
      SetVoucherAmount(promotionManagementGiftVoucherInfo?.voucher_amount),
      SetRedeemableOn(promotionManagementGiftVoucherInfo?.redemable_on),
      SetUsageLimit(promotionManagementGiftVoucherInfo?.usage_limit),
      SetVoucherType(promotionManagementGiftVoucherInfo?.voucher_type),
      SetIssuedTo(promotionManagementGiftVoucherInfo?.issued_to),
      setActive(promotionManagementGiftVoucherInfo?.is_active),
      SetValidityFrom(
        new Date(promotionManagementGiftVoucherInfo.validity_from)
      ),
      SetValidityTo(new Date(promotionManagementGiftVoucherInfo.validity_to)),
      setTermsAndConditions(
        promotionManagementGiftVoucherInfo?.terms_and_conditions
      ),
      setConditions(promotionManagementGiftVoucherInfo?.conditions),
      SetApplyOn(promotionManagementGiftVoucherInfo?.apply_on),
      setShortCode(promotionManagementGiftVoucherInfo?.shortcode),
      setSelectedProduct(promotionManagementGiftVoucherInfo?.product));

    reset();
  }, [promotionManagementGiftVoucherInfo, reset]);

  const putData = async () => {
    const addData = {
      voucher_name: voucherName,
      voucher_code: voucherCode,

      voucher_amount: voucherAmount,
      redemable_on: redeemableOn,
      usage_limit: usageLimit,
      voucher_type: voucherType,
      issued_to: issuedTo,
      validity_from: moment(validityFrom).format("YYYY-MM-DD"),
      validity_to: moment(validityTo).format("YYYY-MM-DD"),
      terms_and_conditions: termsAndConditions,
      conditions,
      is_active: active,
      shortcode: shortCode,

      apply_on: applyOn,
      product: selectedProduct?.map((obj) => {
        const container = obj.value;
        return container;
      }),
    };
    const reduxData = {
      id: id,
      putData: addData,
    };
    try {
      await dispatch(updateGiftVoucherById(reduxData)).unwrap();
      toastsuccess("Gift Voucher Edited successfully");
      navigate(
        `${process.env.PUBLIC_URL}/promotional_management/gift_voucher/list`
      );
    } catch (error) {
      console.error(error);
    }
  };

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      if (id !== undefined) {
        handleSubmit(putData)();
      } else {
        handleSubmit(postData)();
      }
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  
  useEffect(() => {
      if (add === undefined && id === undefined) {
        navigate(`${process.env.PUBLIC_URL}/promotional_management/gift_voucher/list`);
      }
    }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title={title ? title : "Gift Voucher"} />
      <Content>
        <PreviewCard className="h-100">
          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <Col md={5}>
              <ModifiedBreadcrumb></ModifiedBreadcrumb>
            </Col>
            <Col md={1}></Col>
            {add !== undefined && (
              <Col md={6} className="text-right flex">
                {/* <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) =>
                    postAndCreateNew(data, "saveAndNew")
                  )}
                >
                  {issubmitting ? "Saving" : "Save & New"}
                </SaveButton> */}

                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) =>
                    postData(data, "saveAndClose")
                  )}
                >
                  {issubmitting ? "Saving" : "Save [Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/promotional_management/gift_voucher/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
            {id !== undefined && (
              <Col md={6} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit(putData)}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/promotional_management/gift_voucher/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>

          <div className="custom-grid">
            <Row lg={12} className={"form-control-sm"}>
              <Col md={6}>
                <div className="custom-grid">
                  <Row md={12} className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="voucherName">
                          Voucher Name
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={true}
                          id={"voucherName"}
                          placeholder="Voucher Name"
                          value={voucherName}
                          SetValue={SetVoucherName}
                        />
                        {errors?.voucherName && (
                          <span className="text-danger">
                            <Icon className={"sm"} name="alert-circle" />
                            {"This field is required"}
                          </span>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="shortCode">
                          Short Code
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={true}
                          id={"shortCode"}
                          placeholder="Short Code"
                          value={shortCode}
                          SetValue={setShortCode}
                        />
                        {errors?.shortCode && (
                          <span className="text-danger">
                            <Icon className={"sm"} name="alert-circle" />
                            {"short Code is required"}
                          </span>
                        )}
                      </div>
                    </Col>
                  </Row>

                  {/* <Row md={12} className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="voucherCode">
                          Voucher Code
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="Auto"
                                type="radio"
                                name={"voucherCode"}
                                value={"1"}
                                className="custom-control-input"
                                checked={voucherCode == "1"}
                                onChange={(e) => {
                                  setVoucherCode(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="Auto"
                              >
                                Auto
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="Manual"
                                type="radio"
                                value={"2"}
                                name={"voucherCode"}
                                className="custom-control-input "
                                checked={voucherCode == "2"}
                                onChange={(e) => {
                                  setVoucherCode(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="Manual"
                              >
                                Manual
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row> */}

                  <Row md={12} className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="voucherAmount">
                          Voucher Amount
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={true}
                          id={"voucherAmount"}
                          placeholder="Voucher Amount"
                          value={voucherAmount}
                          SetValue={SetVoucherAmount}
                        />
                        {errors?.voucherAmount && (
                          <span className="text-danger">
                            <Icon className={"sm"} name="alert-circle" />
                            {"This field is required"}
                          </span>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="redeemableOn">
                          Redeemable On
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="onlySales"
                                type="radio"
                                name={"redeemableOn"}
                                value={"1"}
                                className="custom-control-input"
                                checked={redeemableOn == "1"}
                                onChange={(e) => {
                                  SetRedeemableOn(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="onlySales"
                              >
                                Only Sales
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="onlySavingScheme"
                                type="radio"
                                value={"2"}
                                name={"redeemableOn"}
                                className="custom-control-input "
                                checked={redeemableOn == "2"}
                                onChange={(e) => {
                                  SetRedeemableOn(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="onlySavingScheme"
                              >
                                Only Saving Scheme
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="usageLimit">
                          Usage Limit
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={true}
                          id={"usageLimit"}
                          placeholder="Usage Limit"
                          value={usageLimit}
                          SetValue={SetUsageLimit}
                        />
                        {errors?.usageLimit && (
                          <span className="text-danger">
                            <Icon className={"sm"} name="alert-circle" />
                            {"This field is required"}
                          </span>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="applyOn">
                          Apply On
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
                                id="all"
                                type="radio"
                                name={"applyOn"}
                                value={"1"}
                                className="custom-control-input"
                                checked={applyOn == "1"}
                                onChange={(e) => {
                                  SetApplyOn(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="all"
                              >
                                All
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="product"
                                type="radio"
                                value={"2"}
                                name={"applyOn"}
                                className="custom-control-input "
                                checked={applyOn == "2"}
                                onChange={(e) => {
                                  SetApplyOn(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="product"
                              >
                                Product
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>

                  {applyOn === "2" && (
                    <>
                      <Row md={12} className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="site-name">
                              Category
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <CategoryDropdown
                            register={register}
                            id="selectedCategory"
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                            isRequired={false}
                            clearErrors={clearErrors}
                            setValue={setValue}
                            // message={
                            //   errors.selectedCategory &&
                            //   "Category is Required"
                            // }
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
                          <ProductDropdownMulti
                            value={selectedProduct}
                            SetValue={setSelectedProduct}
                            selectedCategory={selectedCategory}
                          />
                        </Col>
                      </Row>
                    </>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <div className="custom-grid">
                  <Row md={12} className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="voucherType">
                          Voucher Type
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="Free"
                                type="radio"
                                name={"voucherType"}
                                value={"1"}
                                className="custom-control-input"
                                checked={voucherType == "1"}
                                onChange={(e) => {
                                  SetVoucherType(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="Free"
                              >
                                Free
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="Paid"
                                type="radio"
                                value={"2"}
                                name={"voucherType"}
                                className="custom-control-input "
                                checked={voucherType == "2"}
                                onChange={(e) => {
                                  SetVoucherType(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="Paid"
                              >
                                Paid
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="issuedTo">
                          Issued To
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="Customer"
                                type="radio"
                                name={"issuedTo"}
                                value={"1"}
                                className="custom-control-input"
                                checked={issuedTo == "1"}
                                onChange={(e) => {
                                  SetIssuedTo(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="Customer"
                              >
                                Customer
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="Employee"
                                type="radio"
                                value={"2"}
                                name={"issuedTo"}
                                className="custom-control-input "
                                checked={issuedTo == "2"}
                                onChange={(e) => {
                                  SetIssuedTo(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="Employee"
                              >
                                Employee
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="Vendors"
                                type="radio"
                                value={"3"}
                                name={"issuedTo"}
                                className="custom-control-input "
                                checked={issuedTo == "3"}
                                onChange={(e) => {
                                  SetIssuedTo(e.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="Vendors"
                              >
                                Vendors
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="Others"
                                type="radio"
                                value={"4"}
                                name={"issuedTo"}
                                className="custom-control-input "
                                checked={issuedTo == "4"}
                                onChange={(e) => {
                                  SetIssuedTo(e.target.value);
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
                  <Row md={12} className="form-group row g-4">
                    <Col lg={4}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="active">
                          Active
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <SwitchInputField
                        register={register}
                        id={"active"}
                        checked={active}
                        SetValue={setActive}
                        name={"active"}
                      />
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="startdate">
                          Validity From
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <DateInputField
                        id={"validity_from"}
                        showYearDropdown={true}
                        showMonthDropdown={true}
                        selected={validityFrom}
                        SetValue={SetValidityFrom}
                        minDate={new Date()}
                      />
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="validityTo">
                          Validity To
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <DateInputField
                        showYearDropdown={true}
                        showMonthDropdown={true}
                        id={"validity_to"}
                        selected={validityTo}
                        SetValue={SetValidityTo}
                        minDate={new Date()}
                      />
                    </Col>
                  </Row>
                  <Row md={12} className="form-group row g-4">
                    <Col lg={4}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="conditions">
                          Conditions
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={true}
                          id={"conditions"}
                          placeholder="Conditions"
                          value={conditions}
                          SetValue={setConditions}
                        />
                        {errors?.conditions && (
                          <span className="text-danger">
                            <Icon className={"sm"} name="alert-circle" />
                            {"This field is required"}
                          </span>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>

              <Row md={12} className="form-group row g-4">
                <h6>Terms And Conditions:</h6>
                <Col lg="12">
                  <ReactQuill
                    value={termsAndConditions}
                    onChange={handleChange}
                  />
                </Col>
              </Row>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default GiftVoucherForm;
