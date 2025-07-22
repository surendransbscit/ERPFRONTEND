import React, { useEffect, useState, useContext } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createAccountHead,
  getAccountHeadById,
  updateAccountHeadById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import {
  Col,
  Icon,
  NumberInputField,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import {
  createLoyaltySettings,
  getLoyaltySettingsById,
  updateLoyaltySettingsById,
} from "../../../redux/thunks/loyaltyMaster";

const LoyaltySettingsForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
  } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.LoyaltySettingsReducer
  );
  const { loyaltySettingsInfo } = useSelector(
    (state) => state.LoyaltySettingsReducer
  );

  const [baseRate, setBaseRate] = useState();
  const [pointValue, setPointValue] = useState();
  const [maxRedeemPercent, setMaxRedeemPercent] = useState();
  const [pointsValidityDays, setPointsValidityDays] = useState();
  const [redemptionWaitDays, setRedemptionWaitDays] = useState();

  const postData = async () => {
    const adddata = {
      base_rate: baseRate,
      point_value: pointValue,
      max_redeem_percent: maxRedeemPercent,
      points_validity_days: pointsValidityDays,
      redemption_wait_days: redemptionWaitDays,
    };
    try {
      await dispatch(createLoyaltySettings(adddata)).unwrap();
      toastsuccess("Loyalty Settings Added successfully");
      navigate(
        `${process.env.PUBLIC_URL}/loyalty_master/loyalty_settings/list`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      base_rate: baseRate,
      point_value: pointValue,
      max_redeem_percent: maxRedeemPercent,
      points_validity_days: pointsValidityDays,
      redemption_wait_days: redemptionWaitDays,
    };
    await dispatch(createLoyaltySettings(adddata));
    if (isError === false) {
      toastsuccess("Loyalty Settings Added successfully");
      setBaseRate("");
      setPointValue("");
      setMaxRedeemPercent("");
      setPointsValidityDays("");
      setRedemptionWaitDays("");
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getLoyaltySettingsById(id));
  }, [dispatch, id]);

  useEffect(() => {
    loyaltySettingsInfo != undefined &&
      (setBaseRate(loyaltySettingsInfo?.base_rate),
      setPointValue(loyaltySettingsInfo?.point_value),
      setMaxRedeemPercent(loyaltySettingsInfo?.max_redeem_percent),
      setPointsValidityDays(loyaltySettingsInfo?.points_validity_days),
      setRedemptionWaitDays(loyaltySettingsInfo?.redemption_wait_days),
      reset());
  }, [loyaltySettingsInfo, reset]);

  const putData = async () => {
    const adddata = {
      base_rate: baseRate,
      point_value: pointValue,
      max_redeem_percent: maxRedeemPercent,
      points_validity_days: pointsValidityDays,
      redemption_wait_days: redemptionWaitDays,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    await dispatch(updateLoyaltySettingsById(reduxData));
    if (isError === false) {
      toastsuccess("Loyalty Settings Edited successfully");
      navigate(
        `${process.env.PUBLIC_URL}/loyalty_master/loyalty_settings/list`
      );
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(
        `${process.env.PUBLIC_URL}/loyalty_master/loyalty_settings/list`
      );
    }
  }, [add, id, navigate]);

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      document.activeElement?.blur();
      setTimeout(() => {
        if (id !== undefined) {
          handleSubmit(putData)();
        } else {
          handleSubmit(postData)();
        }
      }, 0); // <-- Slight delay after blur
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );

  return (
    <React.Fragment>
      <Head title={title ? title : "Loyalty Settings"} />
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
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>
                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/loyalty_master/loyalty_settings/list`
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
                      `${process.env.PUBLIC_URL}/loyalty_master/loyalty_settings/list`
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
                  <label className="form-label" htmlFor="baseRate">
                    Base Rate
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"baseRate"}
                    placeholder="Base Rate"
                    value={baseRate}
                    SetValue={(value) => {
                      setBaseRate(value);
                      clearErrors("baseRate");
                    }}
                    message={errors.baseRate && "base Rate is required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="pointValue">
                    Point Values
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"pointValue"}
                    placeholder="Point Value"
                    value={pointValue}
                    SetValue={(value) => {
                      setPointValue(value);
                      clearErrors("pointValue");
                    }}
                    message={errors.pointValue && "point Value is required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="maxRedeemPercent">
                    Max Redeem Percent
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"maxRedeemPercent"}
                    placeholder="Max Redeem Percent"
                    value={maxRedeemPercent}
                    SetValue={(value) => {
                      setMaxRedeemPercent(value);
                      clearErrors("maxRedeemPercent");
                    }}
                    message={
                      errors.maxRedeemPercent &&
                      "max Redeem Percent is required"
                    }
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="pointsValidityDays">
                    Points Validity Days
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"pointsValidityDays"}
                    placeholder="Points Validity Days"
                    value={pointsValidityDays}
                    SetValue={(value) => {
                      setPointsValidityDays(value);
                      clearErrors("pointsValidityDays");
                    }}
                    message={
                      errors.pointsValidityDays &&
                      "Points Validity Days is required"
                    }
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="redemptionWaitDays">
                    Redemption Wait Days
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"redemptionWaitDays"}
                    placeholder="Redemption Wait Days"
                    value={redemptionWaitDays}
                    SetValue={(value) => {
                      setRedemptionWaitDays(value);
                      clearErrors("redemptionWaitDays");
                    }}
                    message={
                      errors.redemptionWaitDays &&
                      "Redemption Wait Days is required"
                    }
                  />
                </div>
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default LoyaltySettingsForm;