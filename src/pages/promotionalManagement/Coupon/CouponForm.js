/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  CancelButton,
  PreviewCard,
  SaveButton,
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
  createCoupon,
  getCouponById,
  updateCouponById,
} from "../../../redux/thunks/promotionManagement";

const DiscountForm = () => {
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
    (state) => state.promotionManagementCouponReducer
  );
  const { promotionManagementCouponInfo } = useSelector(
    (state) => state.promotionManagementCouponReducer
  );

  const [branches, SetBranches] = useState();
  const [couponCode, SetCouponCode] = useState();
  const [discountValue, SetDiscountValue] = useState();
  const [discountType, SetDiscountType] = useState("1");
  const [minimumCartValue, SetMinimumCartValue] = useState();
  const [usageLimit, SetUsageLimit] = useState();

  const postData = async () => {
    const addData = {
      branches: branches.map((obj) => {
        const container = obj.value;
        return container;
      }),
      coupon_code: couponCode,
      discount_value: discountValue,
      discount_type: discountType,
      min_cart_value: minimumCartValue,
      usage_limit: usageLimit,
    };
    try {
      await dispatch(createCoupon(addData)).unwrap();
      toastsuccess("Coupon Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/promotional_management/coupon/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const addData = {
      branches: branches.map((obj) => {
        const container = obj.value;
        return container;
      }),
      coupon_code: couponCode,
      discount_value: discountValue,
      discount_type: discountType,
      min_cart_value: minimumCartValue,
      usage_limit: usageLimit,
    };

    try {
      await dispatch(createCoupon(addData)).unwrap();
      toastsuccess("Coupon created successfully");
      SetBranches("");
      SetCouponCode("");
      SetDiscountValue("");
      SetDiscountType(1);
      SetMinimumCartValue("");
      SetUsageLimit("");
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getCouponById(id));
  }, [dispatch, id]);

  useEffect(() => {
    promotionManagementCouponInfo != undefined &&
      (SetBranches(promotionManagementCouponInfo?.branches),
      SetCouponCode(promotionManagementCouponInfo?.coupon_code),
      SetDiscountValue(promotionManagementCouponInfo?.discount_value),
      SetDiscountType(promotionManagementCouponInfo?.discount_type),
      SetMinimumCartValue(promotionManagementCouponInfo?.min_cart_value),
      SetUsageLimit(promotionManagementCouponInfo?.usage_limit));
    reset();
  }, [promotionManagementCouponInfo, reset]);

  const putData = async () => {
    const addData = {
      branches: branches.map((obj) => {
        const container = obj.value;
        return container;
      }),
      coupon_code: couponCode,
      discount_value: discountValue,
      discount_type: discountType,
      min_cart_value: minimumCartValue,
      usage_limit: usageLimit,
    };
    const reduxData = {
      id: id,
      putData: addData,
    };
    try {
      await dispatch(updateCouponById(reduxData)).unwrap();
      toastsuccess("Coupon Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/promotional_management/coupon/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
      if (add === undefined && id === undefined) {
        navigate(`${process.env.PUBLIC_URL}/promotional_management/coupon/list`);
      }
    }, [add, id, navigate]);

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

  return (
    <React.Fragment>
      <Head title={title ? title : "Coupon"} />
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
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) =>
                    postAndCreateNew(data, "saveAndNew")
                  )}
                >
                  {issubmitting ? "Saving" : "Save & New"}
                </SaveButton>

                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) =>
                    postData(data, "saveAndClose")
                  )}
                >
                  {issubmitting ? "Saving" : "Save & Close [Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/promotional_management/coupon/list`
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
                      `${process.env.PUBLIC_URL}/promotional_management/coupon/list`
                    )
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>

          <div className="custom-grid">
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="empType">
                    Branch
                    <IsRequired />
                  </label>
                </div>
              </Col>

              <Col lg="3">
                <div className="form-group">
                  <BranchDropdownMulti
                    id={"branches"}
                    optionLabel={"Choose Branch..."}
                    register={register}
                    value={branches}
                    SetValue={SetBranches}
                    // getDropdownButtonLabel={getDropdownButtonLabel}
                    // onChange={onChange}
                  />
                  {errors.branches && (
                    <span className="invalid">This field is required</span>
                  )}
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="couponCode">
                    Coupon Code
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"couponCode"}
                    placeholder="Coupon Code"
                    value={couponCode}
                    SetValue={SetCouponCode}
                  />
                  {errors?.couponCode && (
                    <span className="text-danger">
                      <Icon className={"sm"} name="alert-circle" />
                      {"This field is required"}
                    </span>
                  )}
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col md="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="discountType">
                    Discount Type
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col md="3">
                <div className="form-group">
                  <ul className="custom-control-group g-3 align-center flex-wrap">
                    <li>
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          id="Percentage"
                          type="radio"
                          name={"discountType"}
                          value={"1"}
                          className="custom-control-input"
                          checked={discountType == "1"}
                          onChange={(e) => {
                            SetDiscountType(e.target.value);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="Percentage"
                        >
                          Percentage
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="Value"
                          type="radio"
                          value={"2"}
                          name={"discountType"}
                          className="custom-control-input "
                          checked={discountType == "2"}
                          onChange={(e) => {
                            SetDiscountType(e.target.value);
                          }}
                        />
                        <label className="custom-control-label" htmlFor="Value">
                          Value
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="discountValue">
                    Discount Value
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"discountValue"}
                    placeholder="Discount Value"
                    value={discountValue}
                    SetValue={SetDiscountValue}
                  />
                  {errors?.discountValue && (
                    <span className="text-danger">
                      <Icon className={"sm"} name="alert-circle" />
                      {"This field is required"}
                    </span>
                  )}
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col md="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="minimumCartValue">
                    Minimum Cart Value
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col md="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"minimumCartValue"}
                    placeholder="Minimum Cart Value"
                    value={minimumCartValue}
                    SetValue={SetMinimumCartValue}
                  />
                  {errors?.minimumCartValue && (
                    <span className="text-danger">
                      <Icon className={"sm"} name="alert-circle" />
                      {"This field is required"}
                    </span>
                  )}
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="usageLimit">
                    Usage Limit
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
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
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default DiscountForm;
