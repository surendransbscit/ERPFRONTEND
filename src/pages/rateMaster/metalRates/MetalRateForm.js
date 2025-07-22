/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from "react";
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
  createMetalRate,
  getMetalRateById,
  updateMetalRateById,
} from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import {
  Col,
  Icon,
  Row,
  SwitchInputField,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";

const MetalRateForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.metalRateReducer
  );
  const { individualMetalRateInfo } = useSelector(
    (state) => state.metalRateReducer
  );

  const [gold18ct, SetGold18ct] = useState(0);
  const [gold20ct, SetGold20ct] = useState(0);
  const [gold22ct, SetGold22ct] = useState(0);
  const [gold24ct, SetGold24ct] = useState(0);
  const [gold995ct, SetGold995ct] = useState(0);
  const [platinum, SetPlatinum] = useState("0");
  const [silverG, SetSilverG] = useState("0");
  const [silverKG, SetSilverKG] = useState("0");
  const [silver999, SetSilver999] = useState(0);
  const [marketGoldRate, setMarketGoldRate] = useState(0);
  const [marketSilverRate, setMarketSilverRate] = useState(0);

  const [status, SetStatus] = useState(true);
  const [sendNotification, setSendNotification] = useState(0);
  const postData = async () => {
    const adddata = {
      gold_18ct: gold18ct,
      gold_20ct: gold20ct,
      gold_22ct: gold22ct,
      gold_24ct: gold24ct,
      gold_99_5ct: gold995ct,
      platinum: platinum,
      silver_G: silverG,
      silver_KG: silverKG,
      silver_99_9: silver999,
      status,
      send_notification: sendNotification,
      market_gold_rate: marketGoldRate,
      market_silver_rate: marketSilverRate,
    };
    try {
      await dispatch(createMetalRate(adddata)).unwrap();
      toastsuccess("Metal Rate Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/metalrate/list`);
    } catch (error) {
      console.error(error);
    }
    // if (isError === false) {
    //   toastsuccess("Metal Rate Added successfully");
    //   navigate(`${process.env.PUBLIC_URL}/master/metalrate/list`);
    // }
  };

  const postAndCreateNew = async () => {
    const adddata = {
      gold_18ct: gold18ct,
      gold_20ct: gold20ct,
      gold_22ct: gold22ct,
      gold_24ct: gold24ct,
      gold_99_5ct: gold995ct,
      platinum: platinum,
      silver_G: silverG,
      silver_KG: silverKG,
      silver_99_9: silver999,
      status,
      send_notification: sendNotification,
      market_gold_rate: marketGoldRate,
      market_silver_rate: marketSilverRate,
    };

    try {
      await dispatch(createMetalRate(adddata));
      toastsuccess("Metal Rate Added successfully");
      SetGold18ct(0);
      SetGold20ct(0);
      SetGold22ct(0);
      SetGold24ct(0);
      SetGold995ct(0);
      SetPlatinum("0");
      SetSilverG("0");
      SetSilverKG("0");
      SetSilver999(0);
      SetStatus(1);
      setSendNotification(1);
      setMarketGoldRate(0);
      setMarketSilverRate(0);
    } catch (error) {
      console.error(error);
    }

    // await dispatch(createMetalRate(adddata));
    // if (isError === false) {
    //   toastsuccess("Metal Rate Added successfully");
    //   SetGold18ct(0);
    //   SetGold20ct(0);
    //   SetGold22ct(0);
    //   SetGold24ct(0);
    //   SetGold995ct(0);
    //   SetPlatinum("0");
    //   SetSilverG("0");
    //   SetSilverKG("0");
    //   SetSilver999(0);
    //   SetStatus(1);
    // }
  };

  useEffect(() => {
    id != undefined && dispatch(getMetalRateById(id));
  }, [dispatch, id]);

  useEffect(() => {
    id != undefined &&
      individualMetalRateInfo != undefined &&
      (SetGold18ct(individualMetalRateInfo?.gold_18ct),
      SetGold20ct(individualMetalRateInfo?.gold_20ct),
      SetGold22ct(individualMetalRateInfo?.gold_22ct),
      SetGold24ct(individualMetalRateInfo?.gold_24ct),
      SetGold995ct(individualMetalRateInfo?.gold_99_5ct),
      SetSilverG(individualMetalRateInfo?.silver_G),
      SetSilverKG(individualMetalRateInfo?.silver_KG),
      SetSilver999(individualMetalRateInfo?.silver_99_9),
      SetPlatinum(individualMetalRateInfo?.platinum),
      SetStatus(individualMetalRateInfo?.status),
      setSendNotification(individualMetalRateInfo?.send_notification),
      setMarketGoldRate(individualMetalRateInfo?.market_gold_rate),
      setMarketSilverRate(individualMetalRateInfo?.market_silver_rate),
      reset());
  }, [individualMetalRateInfo, id, reset]);

  const putData = async () => {
    const adddata = {
      gold_18ct: gold18ct,
      gold_20ct: gold20ct,
      gold_22ct: gold22ct,
      gold_24ct: gold24ct,
      gold_99_5ct: gold995ct,
      platinum: platinum,
      silver_G: silverG,
      silver_KG: silverKG,
      silver_99_9: silver999,
      status,
      send_notification: sendNotification,
      market_gold_rate: marketGoldRate,
      market_silver_rate: marketSilverRate,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    try {
      await dispatch(updateMetalRateById(reduxData));
      toastsuccess("Metal Rate Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/metalrate/list`);
    } catch (error) {
      console.error(error);
    }
    // if (isError === false) {
    //   toastsuccess("Metal Rate Edited successfully");
    //   navigate(`${process.env.PUBLIC_URL}/master/metalrate/list`);
    // }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/metalrate/list`);
    }
  }, [add, id, navigate]);

  useEffect(() => {
    (gold24ct == "" || gold24ct == 0) &&
      (SetGold18ct(0), SetGold20ct(0), SetGold22ct(0));
    gold24ct != "" &&
      gold24ct != 0 &&
      (SetGold20ct(parseFloat((parseFloat(gold24ct) / 24) * 20).toFixed(2)),
      SetGold22ct(parseFloat((parseFloat(gold24ct) / 24) * 22).toFixed(2)),
      SetGold18ct(parseFloat((parseFloat(gold24ct) / 24) * 18).toFixed(2)));
  }, [gold24ct]);

  useEffect(() => {
    silverG == "" && SetSilverKG(0);
    silverG != "" &&
      silverG != "0" &&
      SetSilverKG(parseFloat(parseFloat(silverG) * 1000).toFixed(2));
  }, [silverG]);

  useHotkeys("ctrl+s", (event) => {
    event.preventDefault();
    if (id !== undefined) {
      handleSubmit(putData)();
    } else {
      handleSubmit(postData)();
    }
  });

  return (
    <React.Fragment>
      <Head title={title ? title : "Metal Rates"} />
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
                    navigate(`${process.env.PUBLIC_URL}/master/metalrate/list`)
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
                    navigate(`${process.env.PUBLIC_URL}/master/metalrate/list`)
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>
          <div className="custom-grid">
            <Row md={12} className="form-group row g-4">
              <Col lg="1"></Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="gold24ct">
                    Gold 24 KT <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"gold24ct"}
                    placeholder="Gold 24ct"
                    value={gold24ct}
                    SetValue={SetGold24ct}
                  />
                  {errors?.gold24ct && (
                    <span className="text-danger">
                      <Icon className={"sm"} name="alert-circle" />
                      {"This field is required"}
                    </span>
                  )}
                </div>
              </Col>
              <Col lg="1"></Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="gold22ct">
                    Gold 22 KT
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"gold22ct"}
                    placeholder="Gold 22ct"
                    value={gold22ct}
                    readOnly
                    SetValue={SetGold22ct}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1"></Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="gold20ct">
                    Gold 20 KT <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"gold20ct"}
                    placeholder="Gold 20ct"
                    value={gold20ct}
                    SetValue={SetGold20ct}
                  />
                </div>
              </Col>
              <Col lg="1"></Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="gold18ct">
                    Gold 18 KT <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"gold18ct"}
                    placeholder="Gold 18ct"
                    value={gold18ct}
                    SetValue={SetGold18ct}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1"></Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="silverG">
                    Silver G<IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"silverG"}
                    placeholder="Gold 18ct"
                    value={silverG}
                    SetValue={SetSilverG}
                  />
                  {errors?.silverG && (
                    <span className="text-danger">
                      <Icon className={"sm"} name="alert-circle" />
                      {"This field is required"}
                    </span>
                  )}
                </div>
              </Col>
              <Col lg="1"></Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="silverKG">
                    Silver KG
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"silverKG"}
                    placeholder="Silver KG"
                    value={silverKG}
                    SetValue={SetSilverKG}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1"></Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="platinum">
                    Platinum
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"platinum"}
                    placeholder="platinum"
                    value={platinum}
                    SetValue={SetPlatinum}
                  />
                  {errors?.platinum && (
                    <span className="text-danger">
                      <Icon className={"sm"} name="alert-circle" />
                      {"This field is required"}
                    </span>
                  )}
                </div>
              </Col>
              <Col lg="1"></Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="status">
                    Active
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <SwitchInputField
                  register={register}
                  id={"status"}
                  checked={status}
                  SetValue={SetStatus}
                  name={"status"}
                />
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1"></Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="marketGoldRate">
                    Market Gold Rate
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"marketGoldRate"}
                    placeholder="Market Gold Rate "
                    value={marketGoldRate}
                    SetValue={setMarketGoldRate}
                  />
                  {errors?.marketGoldRate && (
                    <span className="text-danger">
                      <Icon className={"sm"} name="alert-circle" />
                      {"This field is required"}
                    </span>
                  )}
                </div>
              </Col>
              <Col lg="1"></Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="marketSilverRate">
                    Market Silver Rate
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"marketSilverRate"}
                    placeholder="Market Silver Rate"
                    value={marketSilverRate}
                    SetValue={setMarketSilverRate}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1"></Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="platinum">
                    Send notification
                  </label>
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <ul className="custom-control-group g-3 align-center flex-wrap">
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="sendNotification_yes"
                          type="radio"
                          value={1}
                          name={"sendNotification"}
                          className="custom-control-input "
                          checked={sendNotification == 1 ? true : false}
                          onChange={(e) => {
                            setSendNotification(1);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="sendNotification_yes"
                        >
                          Yes
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          id="sendNotification_no"
                          type="radio"
                          name={"sendNotification"}
                          value={0}
                          className="custom-control-input"
                          checked={sendNotification == 0 ? true : false}
                          onChange={(e) => {
                            setSendNotification(0);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="sendNotification_no"
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
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default MetalRateForm;
