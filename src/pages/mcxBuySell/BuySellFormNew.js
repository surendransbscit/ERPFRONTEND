import React, { useEffect, useState } from "react";
import { McxRateProvider } from "../../contexts/MxcRateContext";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import { Block, CancelButton, PreviewCard } from "../../components/Component";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import IsRequired from "../../components/erp-required/erp-required";
import { Button, Col, Row } from "reactstrap";
import BuyAtBankComponent from "./BuyAtBankComponent";
import { useDispatch, useSelector } from "react-redux";
import { searchCustomer } from "../../redux/thunks/customer";
import { Typeahead } from "react-bootstrap-typeahead";
import {
  toastfunc,
  toastsuccess,
} from "../../components/sds-toast-style/toast-style";
import { createBuySell, getOpeningPosition } from "../../redux/thunks/mcx";
import McxRateComponent from "./McxRateComponent";
import BankRateComponentNew from "./BankRateComponentNew";

const BuySellFormNew = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    register: register1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm();

  const {
    register: register3,
    handleSubmit: handleSubmit3,
    formState: { errors: errors3 },
  } = useForm();

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const title = location?.state?.title;
  const { buySellOpeningPosition } = useSelector(
    (state) => state.buySellReducer
  );

  const [customer, SetCustomer] = useState();
  const [customerSearch, SetCustomerSearch] = useState([]);
  const [inputType, setInputType] = useState();
  const [navigateModalOpened, setNavigateModalOpened] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { searchCustomerList } = useSelector((state) => state.customerReducer);
  const [metal, setMetal] = useState(1);
  const [openPos, setOpenPos] = useState(0);

  //Sell
  const [sellType, setSellType] = useState(1);
  // const [sellMetal, setSellMetal] = useState(1);
  const [sellRatePerGram, setSellRatePerGram] = useState(0);
  const [sellMtRatePerGram, setSellMtRatePerGram] = useState(0);
  const [sellWeight, setSellWeight] = useState(0);
  const [sellAt, setSellAt] = useState(1);
  const [goldSellRate, setGoldSellRate] = useState(0);
  const [silverSellRate, setSilverSellRate] = useState(0);
  const [sellPremium, setSellPremium] = useState(0);
  const [goldMtSellRate, setGoldMtSellRate] = useState(0);
  const [silverMtSellRate, setSilverMtSellRate] = useState(0);

  //Buy
  const [goldMtBuyRate, setGoldMtBuyRate] = useState(0);
  const [silverMtBuyRate, setSilverMtBuyRate] = useState(0);
  const [mt5Weight, setMt5Weight] = useState(0);
  const [mt5HasToasted, setMt5HasToasted] = useState(false);
  const [mt5RatePerGram, setMt5RatePerGram] = useState(0);
  // const [mt5OpenPos, setMt5OpenPos] = useState(0);
  // const [mt5Metal, setMt5Metal] = useState(1);
  // const [bankOpenPos, setBankOpenPos] = useState(0);
  // const [bankMetal, setBankMetal] = useState(1);
  const [bankWeight, setBankWeight] = useState(0);
  const [bankHasToasted, setBankHasToasted] = useState(false);

  // const [bullionOpenPos, setBullionOpenPos] = useState(0);
  // const [bullionMetal, setBullionMetal] = useState(1);
  const [bullionWeight, setBullionWeight] = useState(0);
  const [bullionHasToasted, setBullionHasToasted] = useState(false);
  const [bullionRatePerGram, setBullionRatePerGram] = useState(0);
  const [bullionName, setBullionName] = useState("");

  const [goldBankRatePerGram, setGoldBankRatePerGram] = useState(0);
  const [goldBankRatePerKg, setGoldBankRatePerKg] = useState(0);
  const [silverBankRatePerGram, setSilverBankRatePerGram] = useState(0);
  const [silverBankRatePerKg, setSilverBankRatePerKg] = useState(0);

  const saveSellData = async () => {
    const addData = {
      type: 2,
      sell_to: sellAt,
      customer: sellAt == 1 ? customer : null,
      buy_from: null,
      metal: metal,
      weight: sellWeight,
      rate_per_gram: sellRatePerGram,
      bullion_name: null,
      open_position: openPos,
    };
    try {
      await dispatch(createBuySell(addData)).unwrap();
      toastsuccess("Selled Successfully");
      navigate(`${process.env.PUBLIC_URL}/mcxrate/buy_sell/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const saveBuyAtMt5Data = async () => {
    const addData = {
      type: 1,
      sell_to: null,
      customer: null,
      buy_from: 1,
      metal: metal,
      weight: mt5Weight,
      rate_per_gram: mt5RatePerGram,
      bullion_name: null,
      open_position: openPos,
    };
    try {
      await dispatch(createBuySell(addData)).unwrap();
      toastsuccess("Bought Successfully");
      navigate(`${process.env.PUBLIC_URL}/mcxrate/buy_sell/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const saveBuyAtBankData = async () => {
    const addData = {
      type: 1,
      sell_to: null,
      customer: null,
      buy_from: 2,
      metal: metal,
      weight: bankWeight,
      rate_per_gram: metal == 1 ? goldBankRatePerGram : silverBankRatePerGram,
      bullion_name: null,
      open_position: openPos,
    };
    try {
      await dispatch(createBuySell(addData)).unwrap();
      toastsuccess("Bought Successfully");
      navigate(`${process.env.PUBLIC_URL}/mcxrate/buy_sell/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const saveBuyAtBullionData = async () => {
    const addData = {
      type: 1,
      sell_to: null,
      customer: null,
      buy_from: 3,
      metal: metal,
      weight: bullionWeight,
      rate_per_gram: bullionRatePerGram,
      bullion_name: bullionName,
      open_position: openPos,
    };
    try {
      await dispatch(createBuySell(addData)).unwrap();
      toastsuccess("Bought Successfully");
      navigate(`${process.env.PUBLIC_URL}/mcxrate/buy_sell/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const rate = parseFloat(sellRatePerGram) || 0;
    const goldRate = parseFloat(goldSellRate) || 0;
    const silverRate = parseFloat(silverSellRate) || 0;

    if (metal == 1) {
      if (rate > 0) {
        setSellPremium(rate - goldRate);
      } else {
        setSellPremium(0);
      }
    } else if (metal == 2) {
      if (rate > 0) {
        setSellPremium(rate - silverRate);
      } else {
        setSellPremium(0);
      }
    } else {
      setSellPremium(0);
    }
  }, [goldSellRate, silverSellRate, sellRatePerGram, metal]);

  useEffect(() => {
    if (sellAt == 2) {
      setSellRatePerGram(goldSellRate || 0);
    } else if (sellAt == 1) {
      setSellRatePerGram(0);
    }
  }, [sellAt]);

  useEffect(() => {
    if (
      isSearching &&
      customerSearch?.length > 0 &&
      inputType === "text" &&
      customerSearch[0]?.label.length > 0 &&
      customer == null
    ) {
      const searchKey = inputType === "number" ? "mob_num" : "name";
      dispatch(searchCustomer({ [searchKey]: customerSearch[0]?.label }));
    }
    if (
      isSearching &&
      customerSearch?.length > 0 &&
      inputType === "number" &&
      customerSearch[0]?.label.length >= 5 &&
      customer == null
    ) {
      const searchKey = inputType === "number" ? "mob_num" : "name";
      dispatch(searchCustomer({ [searchKey]: customerSearch[0]?.label }));
    }
  }, [isSearching, customerSearch, customer, dispatch, inputType]);

  useEffect(() => {
    if (buySellOpeningPosition != null) {
      setOpenPos(buySellOpeningPosition?.opening_position);
    }
  }, [buySellOpeningPosition]);

  useEffect(() => {
    dispatch(getOpeningPosition());
  }, [dispatch]);

  return (
    <McxRateProvider>
      <React.Fragment>
        <Head title={title ? title : "Buy Sell"} />
        <Content>
          <Block size="lg">
            <PreviewCard>
              <Row
                lg={12}
                className={"form-control-sm"}
                style={{ marginTop: "10px" }}
              >
                <Col md={3}>
                  <ModifiedBreadcrumb />
                </Col>
                {/* <Col md="1"></Col> */}
                <Col md="1" className="mt-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="metal">
                      Metal
                    </label>
                  </div>
                </Col>
                <Col md="2" className="mt-2">
                  <div className="form-group">
                    <ul className="custom-control-group g-3 align-center flex-wrap">
                      <li>
                        <div className="custom-control custom-control-sm custom-radio">
                          <input
                            id="gold_metal"
                            type="radio"
                            name={"metal"}
                            value={1}
                            className="custom-control-input"
                            checked={metal == 1 ? true : false}
                            onChange={(e) => {
                              setMetal(1);
                            }}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="gold_metal"
                          >
                            Gold
                          </label>
                        </div>
                      </li>
                      <li>
                        <div className="custom-control custom-control-sm custom-radio">
                          <input
                            id="silver_metal"
                            type="radio"
                            value={2}
                            name={"metal"}
                            className="custom-control-input "
                            checked={metal == 2 ? true : false}
                            onChange={(e) => {
                              setMetal(2);
                            }}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="silver_metal"
                          >
                            Silver
                          </label>
                        </div>
                      </li>
                    </ul>
                  </div>
                </Col>
                <Col md="2" className="mt-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="openPos">
                      Open Buy Position
                      <span style={{ marginLeft: "30px", fontWeight: "bold" }}>
                        {openPos}
                      </span>
                    </label>

                    {/* <input
                      name="openPos"
                      id="openPos"
                      value={openPos}
                      readOnly
                      className="form-control"
                      placeholder="Open Position"
                      type="text"
                    /> */}
                  </div>
                </Col>
                {/* <Col md="2">
                  <div className="form-group">
                    <div className="form-control-wrap">
                      <input
                        name="mt5OpenPos"
                        id="mt5OpenPos"
                        value={mt5OpenPos}
                        readOnly
                        className="form-control"
                        placeholder="Open Position"
                        type="text"
                      />
                    </div>
                  </div>
                </Col> */}
                <Col md="1"></Col>
                <Col md={2} className="text-right flex">
                  <CancelButton
                    // disabled={isLoading}
                    color="danger"
                    size="md"
                    onClick={() =>
                      navigate(
                        `${process.env.PUBLIC_URL}/mcxrate/buy_sell/list`
                      )
                    }
                  >
                    Cancel
                  </CancelButton>
                </Col>
              </Row>

              <Row>
                <Col
                  className="form-group"
                  style={{ marginLeft: "20px" }}
                  md={5}
                >
                  <Row>
                    <div className="custom-grid">
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="sellAt">
                              Sell
                            </label>
                          </div>
                        </Col>
                        <Col lg="4">
                          <div className="form-group">
                            <ul className="custom-control-group g-3 align-center flex-wrap">
                              <li>
                                <div className="custom-control custom-control-sm custom-radio">
                                  <input
                                    id="sellAt_customer"
                                    type="radio"
                                    name={"sellAt"}
                                    value={1}
                                    className="custom-control-input"
                                    checked={sellAt == 1 ? true : false}
                                    onChange={(e) => {
                                      setSellAt(1);
                                    }}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="sellAt_customer"
                                  >
                                    Customer
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div className="custom-control custom-control-sm custom-radio">
                                  <input
                                    id="sellAt_mt5"
                                    type="radio"
                                    value={2}
                                    name={"sellAt"}
                                    className="custom-control-input "
                                    checked={sellAt == 2 ? true : false}
                                    onChange={(e) => {
                                      setSellAt(2);
                                    }}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="sellAt_mt5"
                                  >
                                    MT5
                                  </label>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </Col>
                        {/* <Col lg="4">
                          <div className="form-group">
                            <ul className="custom-control-group g-3 align-center flex-wrap">
                              <li>
                                <div className="custom-control custom-control-sm custom-radio">
                                  <input
                                    id="gold_sellMetal"
                                    type="radio"
                                    name={"sellMetal"}
                                    value={1}
                                    className="custom-control-input"
                                    checked={sellMetal == 1 ? true : false}
                                    onChange={(e) => {
                                      setSellMetal(1);
                                    }}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="gold_sellMetal"
                                  >
                                    Gold
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div className="custom-control custom-control-sm custom-radio">
                                  <input
                                    id="silver_sellMetal"
                                    type="radio"
                                    value={2}
                                    name={"sellMetal"}
                                    className="custom-control-input "
                                    checked={sellMetal == 2 ? true : false}
                                    onChange={(e) => {
                                      setSellMetal(2);
                                    }}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="silver_sellMetal"
                                  >
                                    Silver
                                  </label>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </Col> */}
                      </Row>

                      {/* <Row className="form-group row g-4">
                      <Col md="4">
                        <div className="form-group">
                          <label className="form-label" htmlFor="sellMetal">
                            Metal
                          </label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <div className="form-group">
                          <ul className="custom-control-group g-3 align-center flex-wrap">
                            <li>
                              <div className="custom-control custom-control-sm custom-radio">
                                <input
                                  id="gold_sellMetal"
                                  type="radio"
                                  name={"sellMetal"}
                                  value={1}
                                  className="custom-control-input"
                                  checked={sellMetal == 1 ? true : false}
                                  onChange={(e) => {
                                    setSellMetal(1);
                                  }}
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="gold_sellMetal"
                                >
                                  Gold
                                </label>
                              </div>
                            </li>
                            <li>
                              <div className="custom-control custom-control-sm custom-radio">
                                <input
                                  id="silver_sellMetal"
                                  type="radio"
                                  value={2}
                                  name={"sellMetal"}
                                  className="custom-control-input "
                                  checked={sellMetal == 2 ? true : false}
                                  onChange={(e) => {
                                    setSellMetal(2);
                                  }}
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="silver_sellMetal"
                                >
                                  Silver
                                </label>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </Col>
                    </Row> */}

                      {sellAt == 1 && (
                        <Row md={12} className="form-group row g-4">
                          <Col lg="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="customer">
                                Customer
                                {/* <IsRequired /> */}
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <div className="form-control-wrap">
                              <Typeahead
                                id="customerSearch"
                                labelKey="label"
                                onChange={(e) => {
                                  if (e?.length > 0) {
                                    SetCustomer(e[0]?.value);
                                    SetCustomerSearch(e);
                                  } else {
                                    SetCustomer(null);
                                    SetCustomerSearch([]);
                                    setInputType(null); // Reset input type when cleared
                                  }
                                }}
                                options={searchCustomerList}
                                placeholder="Choose a customer..."
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
                                    inputType === "number" &&
                                    /^\d*$/.test(text)
                                  ) {
                                    setIsSearching(text.length >= 5);
                                    SetCustomerSearch([{ label: text }]);
                                  }
                                  if (
                                    inputType === "text" &&
                                    /^[a-zA-Z\s]*$/.test(text)
                                  ) {
                                    setIsSearching(text.length > 0);
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
                                  if (
                                    inputType === "text" &&
                                    /\d/.test(e.key)
                                  ) {
                                    e.preventDefault(); // Prevent typing numbers if inputType is text
                                  }
                                }}
                              />
                            </div>
                          </Col>
                        </Row>
                      )}

                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="sellWeight">
                              Weight / Rate
                              <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col lg="4">
                          <div className="form-group">
                            <div className="form-control-wrap">
                              <input
                                {...register1("sellWeight", {
                                  required: {
                                    value: true,
                                    message: "Sell Weight is required",
                                  },
                                })}
                                id="sellWeight"
                                name="sellWeight"
                                placeholder="Weight"
                                className=" form-control"
                                type="text"
                                value={sellWeight}
                                onChange={(e) => {
                                  let value = e.target.value;

                                  setSellWeight(value);
                                }}
                                onKeyDown={(evt) => {
                                  let value = evt.target.value;
                                  if (
                                    (evt.keyCode > 57 || evt.keyCode < 48) &&
                                    !["Backspace", "Tab", "."].includes(evt.key)
                                  ) {
                                    evt.preventDefault();
                                  }
                                  const decimalIndex = value.indexOf(".");
                                  const digitsAfterDecimal =
                                    value.length - decimalIndex - 1;
                                  if (
                                    evt.key === "Backspace" ||
                                    evt.key === "Delete" ||
                                    evt.key === "ArrowLeft" ||
                                    evt.key === "ArrowRight" ||
                                    evt.key === "Tab"
                                  ) {
                                    return;
                                  }
                                  if (decimalIndex >= 1) {
                                    if (parseFloat(digitsAfterDecimal) >= 3) {
                                      console.log(digitsAfterDecimal);
                                      evt.preventDefault();
                                    }
                                  }
                                }}
                              />
                            </div>
                            {errors1?.sellWeight && (
                              <span className="text-danger">
                                {errors1.sellWeight.message}
                              </span>
                            )}
                          </div>
                        </Col>

                        <Col lg="4">
                          <div className="form-group">
                            <div className="form-control-wrap">
                              <input
                                {...register("sellRatePerGram", {
                                  required: {
                                    value: true,
                                    message: "Sell Rate is required",
                                  },
                                })}
                                name="sellRatePerGram"
                                id="sellRatePerGram"
                                value={sellRatePerGram}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^0-9.]/g,
                                    ""
                                  );
                                  setSellRatePerGram(value);
                                }}
                                className="form-control"
                                placeholder="Enter Rate Per Gram"
                                type="text"
                                readOnly={sellAt == 2}
                              />
                            </div>
                            {errors?.sellRatePerGram && (
                              <span className="text-danger">
                                {errors.sellRatePerGram.message}
                              </span>
                            )}
                          </div>
                        </Col>
                      </Row>

                      <Row className="form-group row g-4">
                        {/* <Col lg="2"></Col> */}
                        <Col md="2">
                          <div className="form-group">
                            <label className="form-label" htmlFor="ratePerGram">
                              Mt rate
                            </label>
                          </div>
                        </Col>
                        <Col lg="2">
                          <div>
                            {metal == 1
                              ? parseFloat(goldSellRate).toFixed(2)
                              : parseFloat(silverSellRate).toFixed(2)}
                          </div>
                        </Col>
                        {/* <Col lg="2"></Col> */}
                        <Col md="2">
                          <div className="form-group">
                            <label className="form-label" htmlFor="ratePerGram">
                              Premium
                            </label>
                          </div>
                        </Col>
                        <Col lg="2">
                          <div>{parseFloat(sellPremium).toFixed(2)}</div>
                        </Col>
                        <Col lg="1"></Col>
                        <Col md="2">
                          <Button
                            className="m-1"
                            color={"primary"}
                            size="md"
                            onClick={handleSubmit(saveSellData)}
                          >
                            SELL
                          </Button>
                        </Col>
                      </Row>

                      {/* <Row className="form-group row g-4">
                        <Col lg="5"></Col>
                        <Col md="4">
                          <Button
                            className="m-1"
                            color={"primary"}
                            size="md"
                            onClick={handleSubmit(saveSellData)}
                          >
                            SELL
                          </Button>
                        </Col>

                        <Col lg="3"></Col>
                      </Row> */}
                    </div>
                  </Row>

                  <Row className="mt-2">
                    <div className="custom-grid">
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="mt5Metal">
                              Buy at Bullion
                            </label>
                          </div>
                        </Col>
                        {/* <Col md="3">
                          <div className="form-group">
                            <label
                              className="form-label"
                              htmlFor="bullionOpenPos"
                            >
                              Open Position
                            </label>
                          </div>
                        </Col>
                        <Col lg="3">
                          <div className="form-group">
                            <div className="form-control-wrap">
                              <input
                                name="bullionOpenPos"
                                id="bullionOpenPos"
                                value={bullionOpenPos}
                                readOnly
                                className="form-control"
                                placeholder="Open Position"
                                type="text"
                              />
                            </div>
                          </div>
                        </Col> */}
                      </Row>

                      {/* <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label
                              className="form-label"
                              htmlFor="bullionMetal"
                            >
                              Metal
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <div className="form-group">
                            <ul className="custom-control-group g-3 align-center flex-wrap">
                              <li>
                                <div className="custom-control custom-control-sm custom-radio">
                                  <input
                                    id="gold_bullionMetal"
                                    type="radio"
                                    name={"bullionMetal"}
                                    value={1}
                                    className="custom-control-input"
                                    checked={bullionMetal == 1 ? true : false}
                                    onChange={(e) => {
                                      setBullionMetal(1);
                                    }}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="gold_bullionMetal"
                                  >
                                    Gold
                                  </label>
                                </div>
                              </li>
                              <li>
                                <div className="custom-control custom-control-sm custom-radio">
                                  <input
                                    id="silver_bullionMetal"
                                    type="radio"
                                    value={2}
                                    name={"bullionMetal"}
                                    className="custom-control-input "
                                    checked={bullionMetal == 2 ? true : false}
                                    onChange={(e) => {
                                      setBullionMetal(2);
                                    }}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="silver_bullionMetal"
                                  >
                                    Silver
                                  </label>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </Col>
                      </Row> */}

                      <Row className="form-group row g-4">
                        <Col md="3">
                          <div className="form-group">
                            <label className="form-label" htmlFor="bullionName">
                              Bullion Name
                            </label>
                          </div>
                        </Col>
                        <Col lg="6">
                          <div className="form-group">
                            <div className="form-control-wrap">
                              <input
                                {...register1("bullionName", {
                                  required: {
                                    value: true,
                                    message: "Name is required",
                                  },
                                })}
                                id="bullionName"
                                name="bullionName"
                                placeholder="Bullion Name"
                                className=" form-control"
                                type="text"
                                value={bullionName}
                                onChange={(e) => {
                                  let value = e.target.value;

                                  setBullionName(value);
                                }}
                              />
                            </div>
                            {errors1?.bullionName && (
                              <span className="text-danger">
                                {errors1.bullionName.message}
                              </span>
                            )}
                          </div>
                        </Col>
                      </Row>

                      <Row className="form-group row g-4">
                        <Col md="3">
                          <div className="form-group">
                            <label
                              className="form-label"
                              htmlFor="bullionWeight"
                            >
                              Weight / Rate
                              <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col lg="3">
                          <div className="form-group">
                            <div className="form-control-wrap">
                              <input
                                {...register1("bullionWeight", {
                                  required: {
                                    value: true,
                                    message: "Weight is required",
                                  },
                                })}
                                id="bullionWeight"
                                name="bullionWeight"
                                placeholder="Weight"
                                className=" form-control"
                                type="text"
                                value={bullionWeight}
                                onChange={(e) => {
                                  let value = e.target.value;

                                  if (
                                    value !== "" &&
                                    parseFloat(value) > openPos
                                  ) {
                                    setBullionWeight(0);
                                    toastfunc(
                                      `Weight cannot be greater than ${openPos}`
                                    );
                                    setBullionHasToasted(true);
                                  } else if (parseFloat(value) <= openPos) {
                                    setBullionWeight(value);
                                    setBullionHasToasted(false); // Reset if valid input
                                  }
                                }}
                                onKeyDown={(evt) => {
                                  let value = evt.target.value;
                                  if (
                                    (evt.keyCode > 57 || evt.keyCode < 48) &&
                                    !["Backspace", "Tab", "."].includes(evt.key)
                                  ) {
                                    evt.preventDefault();
                                  }
                                  const decimalIndex = value.indexOf(".");
                                  const digitsAfterDecimal =
                                    value.length - decimalIndex - 1;
                                  if (
                                    evt.key === "Backspace" ||
                                    evt.key === "Delete" ||
                                    evt.key === "ArrowLeft" ||
                                    evt.key === "ArrowRight" ||
                                    evt.key === "Tab"
                                  ) {
                                    return;
                                  }
                                  if (decimalIndex >= 1) {
                                    if (parseFloat(digitsAfterDecimal) >= 3) {
                                      console.log(digitsAfterDecimal);
                                      evt.preventDefault();
                                    }
                                  }
                                }}
                              />
                            </div>
                            {errors1?.bullionWeight && (
                              <span className="text-danger">
                                {errors1.bullionWeight.message}
                              </span>
                            )}
                          </div>
                        </Col>

                        <Col lg="3">
                          <div className="form-group">
                            <div className="form-control-wrap">
                              <input
                                {...register1("bullionRatePerGram", {
                                  required: {
                                    value: true,
                                    message: "Rate is required",
                                  },
                                })}
                                name="bullionRatePerGram"
                                id="bullionRatePerGram"
                                value={bullionRatePerGram}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^0-9.]/g,
                                    ""
                                  );
                                  setBullionRatePerGram(value);
                                }}
                                className="form-control"
                                placeholder="Enter Rate Per Gram"
                                type="text"
                                readOnly
                              />
                            </div>
                            {errors1?.bullionRatePerGram && (
                              <span className="text-danger">
                                {errors1.bullionRatePerGram.message}
                              </span>
                            )}
                          </div>
                        </Col>

                        <Col md="3">
                          <Button
                            className="m-1"
                            color={"primary"}
                            size="md"
                            onClick={handleSubmit1(saveBuyAtBullionData)}
                          >
                            BUY
                          </Button>
                        </Col>
                      </Row>

                      {/* <Row className="form-group row g-4">
                        <Col lg="5"></Col>
                        <Col md="4">
                          <Button
                            className="m-1"
                            color={"primary"}
                            size="md"
                            onClick={handleSubmit1(saveBuyAtBullionData)}
                          >
                            BUY
                          </Button>
                        </Col>

                        <Col lg="3"></Col>
                      </Row> */}
                    </div>
                  </Row>
                </Col>

                <Col
                  className="form-group"
                  style={{ marginLeft: "20px" }}
                  md={6}
                >
                  <Row>
                    <div className="custom-grid">
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="sellAt">
                              Buy at MT5
                            </label>
                          </div>
                        </Col>
                      </Row>

                      

                      <Row className="form-group row g-4">
                        <Col md="3">
                          <div className="form-group">
                            <label className="form-label" htmlFor="mt5Weight">
                              Weight / Rate
                              <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col lg="3">
                          <div className="form-group">
                            <div className="form-control-wrap">
                              <input
                                {...register1("mt5Weight", {
                                  required: {
                                    value: true,
                                    message: "Weight is required",
                                  },
                                })}
                                id="mt5Weight"
                                name="mt5Weight"
                                placeholder="Weight"
                                className=" form-control"
                                type="text"
                                value={mt5Weight}
                                onChange={(e) => {
                                  let value = e.target.value;

                                  if (
                                    value !== "" &&
                                    parseFloat(value) > openPos
                                  ) {
                                    setMt5Weight(0);
                                    toastfunc(
                                      `Weight cannot be greater than ${openPos}`
                                    );
                                    setMt5HasToasted(true);
                                  } else if (parseFloat(value) <= openPos) {
                                    setMt5Weight(value);
                                    setMt5HasToasted(false); // Reset if valid input
                                  }
                                }}
                                onKeyDown={(evt) => {
                                  let value = evt.target.value;
                                  if (
                                    (evt.keyCode > 57 || evt.keyCode < 48) &&
                                    !["Backspace", "Tab", "."].includes(evt.key)
                                  ) {
                                    evt.preventDefault();
                                  }
                                  const decimalIndex = value.indexOf(".");
                                  const digitsAfterDecimal =
                                    value.length - decimalIndex - 1;
                                  if (
                                    evt.key === "Backspace" ||
                                    evt.key === "Delete" ||
                                    evt.key === "ArrowLeft" ||
                                    evt.key === "ArrowRight" ||
                                    evt.key === "Tab"
                                  ) {
                                    return;
                                  }
                                  if (decimalIndex >= 1) {
                                    if (parseFloat(digitsAfterDecimal) >= 3) {
                                      console.log(digitsAfterDecimal);
                                      evt.preventDefault();
                                    }
                                  }
                                }}
                              />
                            </div>
                            {errors1?.mt5Weight && (
                              <span className="text-danger">
                                {errors1.mt5Weight.message}
                              </span>
                            )}
                          </div>
                        </Col>

                        <Col lg="3">
                          <div className="form-group">
                            <div className="form-control-wrap">
                              <input
                                {...register2("mt5RatePerGram", {
                                  required: {
                                    value: true,
                                    message: "Rate is required",
                                  },
                                })}
                                name="mt5RatePerGram"
                                id="mt5RatePerGram"
                                value={mt5RatePerGram}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^0-9.]/g,
                                    ""
                                  );
                                  setMt5RatePerGram(value);
                                }}
                                className="form-control"
                                placeholder="Enter Rate Per Gram"
                                type="text"
                                readOnly
                              />
                            </div>
                            {errors2?.mt5RatePerGram && (
                              <span className="text-danger">
                                {errors2.mt5RatePerGram.message}
                              </span>
                            )}
                          </div>
                        </Col>

                        <Col md="3">
                          <Button
                            className="m-1"
                            color={"primary"}
                            size="md"
                            onClick={handleSubmit2(saveBuyAtMt5Data)}
                          >
                            BUY
                          </Button>
                        </Col>

                        {/* <Col md="3">
                          <div className="form-group">
                            <label className="form-label" htmlFor="mt5OpenPos">
                              Open Position
                            </label>
                          </div>
                        </Col>
                        <Col lg="3">
                          <div className="form-group">
                            <div className="form-control-wrap">
                              <input
                                name="mt5OpenPos"
                                id="mt5OpenPos"
                                value={mt5OpenPos}
                                readOnly
                                className="form-control"
                                placeholder="Open Position"
                                type="text"
                              />
                            </div>
                          </div>
                        </Col> */}
                      </Row>

                      {/* <Row className="form-group row g-4">
                        <Col lg="5"></Col>
                        <Col md="4">
                          <Button
                            className="m-1"
                            color={"primary"}
                            size="md"
                            onClick={handleSubmit2(saveBuyAtMt5Data)}
                          >
                            BUY
                          </Button>
                        </Col>

                        <Col lg="3"></Col>
                      </Row> */}
                    </div>
                  </Row>

                  <Row className={"mt-2"}>
                    <div className="custom-grid">
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="buyAt">
                              Buy at Bank
                            </label>
                          </div>
                        </Col>
                      </Row>

                      <BuyAtBankComponent
                        bankMetal={metal}
                        setGoldSellRate={setGoldSellRate}
                        setSilverSellRate={setSilverSellRate}
                        setGoldMtBuyRate={setGoldMtBuyRate}
                        setSilverMtBuyRate={setSilverMtBuyRate}
                        setGoldBankRatePerGram={setGoldBankRatePerGram}
                        setGoldBankRatePerKg={setGoldBankRatePerKg}
                        setSilverBankRatePerGram={setSilverBankRatePerGram}
                        setSilverBankRatePerKg={setSilverBankRatePerKg}
                        //Buy
                        setMt5RatePerGram={setMt5RatePerGram}
                        setBullionRatePerGram={setBullionRatePerGram}
                      />

                      <Row className="form-group row g-4">
                        <Col md="3">
                          <div className="form-group">
                            <label className="form-label" htmlFor="bankWeight">
                              Weight
                              <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col md="3">
                          <div className="form-group">
                            <div className="form-control-wrap">
                              <input
                                {...register3("bankWeight", {
                                  required: {
                                    value: true,
                                    message: "Weight is required",
                                  },
                                })}
                                id="bankWeight"
                                name="bankWeight"
                                placeholder="Weight"
                                className=" form-control"
                                type="text"
                                value={bankWeight}
                                onChange={(e) => {
                                  let value = e.target.value;

                                  if (
                                    value !== "" &&
                                    parseFloat(value) > openPos
                                  ) {
                                    setBankWeight(0);
                                    toastfunc(
                                      `Weight cannot be greater than ${openPos}`
                                    );
                                    setBankHasToasted(true);
                                  } else if (parseFloat(value) <= openPos) {
                                    setBankWeight(value);
                                    setBankHasToasted(false); // Reset if valid input
                                  }
                                }}
                                onKeyDown={(evt) => {
                                  let value = evt.target.value;
                                  if (
                                    (evt.keyCode > 57 || evt.keyCode < 48) &&
                                    !["Backspace", "Tab", "."].includes(evt.key)
                                  ) {
                                    evt.preventDefault();
                                  }
                                  const decimalIndex = value.indexOf(".");
                                  const digitsAfterDecimal =
                                    value.length - decimalIndex - 1;
                                  if (
                                    evt.key === "Backspace" ||
                                    evt.key === "Delete" ||
                                    evt.key === "ArrowLeft" ||
                                    evt.key === "ArrowRight" ||
                                    evt.key === "Tab"
                                  ) {
                                    return;
                                  }
                                  if (decimalIndex >= 1) {
                                    if (parseFloat(digitsAfterDecimal) >= 3) {
                                      console.log(digitsAfterDecimal);
                                      evt.preventDefault();
                                    }
                                  }
                                }}
                              />
                            </div>
                            {errors3?.bankWeight && (
                              <span className="text-danger">
                                {errors3?.bankWeight.message}
                              </span>
                            )}
                          </div>
                        </Col>
                        <Col md={3}></Col>
                        <Col md="3">
                          <Button
                            className="m-1"
                            color={"primary"}
                            size="md"
                            onClick={handleSubmit3(saveBuyAtBankData)}
                          >
                            BUY
                          </Button>
                        </Col>
                        {/* <Col md="4">
                          <Button
                            className="m-1"
                            color={"primary"}
                            size="md"
                            // onClick={handleSubmit(postBuyData)}
                          >
                            BUY
                          </Button>
                        </Col> */}
                      </Row>

                      {/* <Row className="form-group row g-4">
                        <Col lg="5"></Col>
                        <Col md="4">
                          <Button
                            className="m-1"
                            color={"primary"}
                            size="md"
                            onClick={handleSubmit3(saveBuyAtBankData)}
                          >
                            BUY
                          </Button>
                        </Col>

                        <Col lg="3"></Col>
                      </Row> */}
                    </div>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col
                  className="form-group"
                  style={{ marginLeft: "20px" }}
                  md={3}
                >
                  <Row className="mt-2">
                    <div className="custom-grid">
                      <McxRateComponent
                        setGoldMtBuyRate={setGoldMtBuyRate}
                        // setGoldMtSellRate={setGoldMtSellRate}
                        setSilverMtBuyRate={setSilverMtBuyRate}
                        // setSilverMtSellRate={setSilverMtSellRate}
                      />
                    </div>
                  </Row>
                </Col>

                <Col
                  className="form-group"
                  style={{ marginLeft: "20px" }}
                  md={8}
                >
                  <Row className={"mt-2"}>
                    <div className="custom-grid">
                      <BankRateComponentNew
                        bankMetal={metal}
                        setGoldSellRate={setGoldSellRate}
                        setSilverSellRate={setSilverSellRate}
                        setGoldMtBuyRate={setGoldMtBuyRate}
                        setSilverMtBuyRate={setSilverMtBuyRate}
                        setGoldBankRatePerGram={setGoldBankRatePerGram}
                        setGoldBankRatePerKg={setGoldBankRatePerKg}
                        setSilverBankRatePerGram={setSilverBankRatePerGram}
                        setSilverBankRatePerKg={setSilverBankRatePerKg}
                        //Buy
                        setMt5RatePerGram={setMt5RatePerGram}
                        setBullionRatePerGram={setBullionRatePerGram}
                      />
                    </div>
                  </Row>
                </Col>
              </Row>
            </PreviewCard>
          </Block>
        </Content>
      </React.Fragment>
    </McxRateProvider>
  );
};

export default BuySellFormNew;
