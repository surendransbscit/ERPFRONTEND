import React, { useEffect, useState } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import { Block, CancelButton, Col, Icon, PreviewCard, Row } from "../../components/Component";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Button, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import { Typeahead } from "react-bootstrap-typeahead";
import IsRequired from "../../components/erp-required/erp-required";
import { searchCustomer } from "../../redux/thunks/customer";
import { useForm } from "react-hook-form";
import { McxRateProvider } from "../../contexts/MxcRateContext";
import McxRateComponent from "./McxRateComponent";
import BankRateComponent from "./BankRateComponent";
import { createBuySell } from "../../redux/thunks/mcx";
import { toastsuccess } from "../../components/sds-toast-style/toast-style";

const BuySellForm = () => {
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
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const title = location?.state?.title;

  const [activeIconTab, setActiveIconTab] = useState(1);

  const metalOptions = [
    { value: 1, label: "Gold" },
    { value: 2, label: "Silver" },
  ];

  const sellMetalOptions = [
    { value: 1, label: "Gold" },
    { value: 2, label: "Silver" },
  ];

  const [customer, SetCustomer] = useState();
  const [customerSearch, SetCustomerSearch] = useState([]);
  const [inputType, setInputType] = useState();
  const [navigateModalOpened, setNavigateModalOpened] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [metal, setMetal] = useState(1);
  const [ratePerGram, setRatePerGram] = useState(0);
  const [weight, setWeight] = useState();
  const [payableType, setPayableType] = useState(1);

  //Sell
  const [sellType, setSellType] = useState(1);
  const [sellMetal, setSellMetal] = useState(1);
  const [sellRatePerGram, setSellRatePerGram] = useState(0);
  const [sellWeight, setSellWeight] = useState(0);

  const [goldMtBuyRate, setGoldMtBuyRate] = useState(0);
  const [goldMtSellRate, setGoldMtSellRate] = useState(0);
  const [goldBankRatePerGram, setGoldBankRatePerGram] = useState(0);
  const [goldBankRatePerKg, setGoldBankRatePerKg] = useState(0);
  const [silverMtBuyRate, setSilverMtBuyRate] = useState(0);
  const [silverMtSellRate, setSilverMtSellRate] = useState(0);
  const [silverBankRatePerGram, setSilverBankRatePerGram] = useState(0);
  const [silverBankRatePerKg, setSilverBankRatePerKg] = useState(0);

  const [buyPremium, setBuyPremium] = useState(0);
  const [sellPremium, setSellPremium] = useState(0);

  const { isLoading } = useSelector((state) => state.buySellReducer);

  const { searchCustomerList } = useSelector((state) => state.customerReducer);

  const toggleIconTab = (icontab) => {
    if (activeIconTab !== icontab) setActiveIconTab(icontab);
  };

  const postBuyData = async () => {
    const addData = {
      type: activeIconTab,
      customer: customer,
      metal: metal,
      weight: weight,
      rate_per_gram: ratePerGram,
      payment_mode: payableType,
      mt5_rate: metal == 1 ? parseFloat(goldMtBuyRate) : parseFloat(silverMtBuyRate),
      premium: parseFloat(buyPremium)
    }
    console.log(addData);
    try {
      await dispatch(createBuySell(addData)).unwrap();
      toastsuccess("Purchased Successfully");
      navigate(`${process.env.PUBLIC_URL}/mcxrate/buy_sell/list`);
    } catch (error) {
      console.error(error);
    }

  }


  const postSellData = async () => {
    const addData = {
      type: activeIconTab,
      sell_type: sellType,
      customer: null,
      metal: sellMetal,
      weight: sellWeight,
      rate_per_gram: sellRatePerGram,
      payment_mode: null,
      mt5_rate: sellMetal == 1 ? parseFloat(goldMtSellRate) : parseFloat(silverMtSellRate),
      premium: parseFloat(buyPremium)
    }
    try {
      await dispatch(createBuySell(addData)).unwrap();
      toastsuccess("Selled Successfully");
      navigate(`${process.env.PUBLIC_URL}/mcxrate/buy_sell/list`);
    } catch (error) {
      console.error(error);
    }
  }




  useEffect(() => {
    const rate = parseFloat(ratePerGram) || 0;
    const goldRate = parseFloat(goldMtBuyRate) || 0;
    const silverRate = parseFloat(silverMtBuyRate) || 0;

    if (metal === 1) {
      if (rate > 0) {
        setBuyPremium(rate - goldRate);
      } else {
        setBuyPremium(0);
      }
    } else if (metal === 2) {
      if (rate > 0) {
        setBuyPremium(rate - silverRate);
      } else {
        setBuyPremium(0);
      }
    } else {
      setBuyPremium(0);
    }
  }, [goldMtBuyRate, silverMtBuyRate, ratePerGram, metal]);



  useEffect(() => {
    const rate = parseFloat(sellRatePerGram) || 0;
    const goldRate = parseFloat(goldMtSellRate) || 0;
    const silverRate = parseFloat(silverMtSellRate) || 0;

    if (sellMetal == 1) {
      if (rate > 0) {
        setSellPremium(rate - goldRate);
      } else {
        setSellPremium(0);
      }
    } else if (sellMetal == 2) {
      if (rate > 0) {
        setSellPremium(rate - silverRate);
      } else {
        setSellPremium(0);
      }
    } else {
      setSellPremium(0);
    }
  }, [goldMtSellRate, silverMtSellRate, sellRatePerGram, sellMetal]);

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
    if (customerSearch?.length > 0) {
      const inputValue = customerSearch[0]?.label;

      if (!inputType) {
        setInputType(/^\d/.test(inputValue) ? "number" : "text");
      }

      if (
        inputType === "number" &&
        isSearching &&
        inputValue.length >= 10 &&
        customer == null &&
        searchCustomerList?.length == 0 &&
        !navigateModalOpened
      ) {
        setNavigateModalOpened(true);
      }

      if (inputValue.length < 10) {
        setNavigateModalOpened(false);
      }
    }
  }, [isSearching, customerSearch, customer, searchCustomerList, inputType]);

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
                <Col md={4}>
                  <ModifiedBreadcrumb />
                </Col>
                <Col md={3}></Col>
                <Col md={5} className="text-right flex">
                  <CancelButton
                    disabled={isLoading}
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
                <Col md={6}>
                  <div className="custom-grid">
                    <Nav tabs>
                      <NavItem>
                        <NavLink
                          tag="a"
                          href="#tab"
                          className={classnames({
                            active: activeIconTab == 1,
                          })}
                          onClick={(ev) => {
                            ev.preventDefault();
                            toggleIconTab(1);
                          }}
                        >
                          <Icon name="grid-alt-fill" /> <span>Buy</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          tag="a"
                          href="#tab"
                          className={classnames({
                            active: activeIconTab == 2,
                          })}
                          onClick={(ev) => {
                            ev.preventDefault();
                            toggleIconTab(2);
                          }}
                        >
                          <Icon name="grid-alt-fill" /> <span>Sell</span>
                        </NavLink>
                      </NavItem>
                    </Nav>

                    <TabContent activeTab={activeIconTab}>
                      <TabPane tabId={1}>
                        <Row md={12} className="form-group row g-4">
                          <Col lg="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="customer">
                                Customer
                                <IsRequired />
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

                        {/* <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="metal">
                                Metal
                                <IsRequired />
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <div className="form-group">
                              <div className="form-control-wrap">
                                <div className="form-control-select">
                                  <select
                                    className="form-control form-select"
                                    id="metal"
                                    name="metal"
                                    {...register("metal", {
                                      required: true,
                                    })}
                                    value={metal}
                                    onChange={(e) => setMetal(e.target.value)}
                                  >
                                    {metalOptions?.map((item, index) => (
                                      <option key={index} value={item?.value}>
                                        {item?.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row> */}

                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label
                                className="form-label"
                                htmlFor="metal"
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
                        </Row>

                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="weight">
                                Weight
                                <IsRequired />
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <div className="form-group">
                              <div className="form-control-wrap">
                                <input
                                  {...register("weight", {
                                    required: {
                                      value: true,
                                      message: "Buy Weight is required",
                                    },
                                  })}
                                  id="weight"
                                  name="weight"
                                  placeholder="Weight"
                                  className=" form-control"
                                  type="text"
                                  value={weight}
                                  onChange={(e) => {
                                    let value = e.target.value;

                                    setWeight(value);
                                  }}
                                  onKeyDown={(evt) => {
                                    let value = evt.target.value;
                                    if (
                                      (evt.keyCode > 57 || evt.keyCode < 48) &&
                                      !["Backspace", "Tab", "."].includes(
                                        evt.key
                                      )
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
                              {errors?.weight && (
                                <span className="text-danger">
                                  {errors.weight.message}
                                </span>
                              )}
                            </div>
                          </Col>
                        </Row>

                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label
                                className="form-label"
                                htmlFor="ratePerGram"
                              >
                                Rate Per Gram
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <div className="form-group">
                              <div className="form-control-wrap">
                                <input
                                  {...register("ratePerGram", {
                                    required: {
                                      value: true,
                                      message: "Rate per Gram is required",
                                    },
                                  })}
                                  name="ratePerGram"
                                  id="ratePerGram"
                                  value={ratePerGram}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /[^0-9.]/g,
                                      ""
                                    );
                                    setRatePerGram(value);
                                  }}
                                  className="form-control"
                                  placeholder="Enter Rate Per Gram"
                                  type="text"
                                />
                              </div>
                              {errors?.ratePerGram && (
                                <span className="text-danger">
                                  {errors.ratePerGram.message}
                                </span>
                              )}
                            </div>
                          </Col>
                        </Row>

                        <Row className="form-group row g-4">
                          <Col lg="2"></Col>
                          <Col md="2">
                            <div className="form-group">
                              <label
                                className="form-label"
                                htmlFor="ratePerGram"
                              >
                                Mt rate
                              </label>
                            </div>
                          </Col>
                          <Col lg="2">
                            <div>
                              {metal == 1 ? parseFloat(goldMtBuyRate).toFixed(2) : parseFloat(silverMtBuyRate).toFixed(2)}
                            </div>
                          </Col>
                          <Col lg="2"></Col>
                          <Col md="2">
                            <div className="form-group">
                              <label
                                className="form-label"
                                htmlFor="ratePerGram"
                              >
                                Premium
                              </label>
                            </div>
                          </Col>
                          <Col lg="2">
                            <div>{parseFloat(buyPremium).toFixed(2)}</div>
                          </Col>
                        </Row>

                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label
                                className="form-label"
                                htmlFor="payableType"
                              >
                                Payment Mode
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <div className="form-group">
                              <ul className="custom-control-group g-3 align-center flex-wrap">
                                <li>
                                  <div className="custom-control custom-control-sm custom-radio">
                                    <input
                                      id="pay_cash"
                                      type="radio"
                                      name={"payableType"}
                                      value={1}
                                      className="custom-control-input"
                                      checked={payableType == 1 ? true : false}
                                      onChange={(e) => {
                                        setPayableType(1);
                                      }}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="pay_cash"
                                    >
                                      Cash
                                    </label>
                                  </div>
                                </li>
                                <li>
                                  <div className="custom-control custom-control-sm custom-radio">
                                    <input
                                      id="pay_bank"
                                      type="radio"
                                      value={2}
                                      name={"payableType"}
                                      className="custom-control-input "
                                      checked={payableType == 2 ? true : false}
                                      onChange={(e) => {
                                        setPayableType(2);
                                      }}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="pay_bank"
                                    >
                                      Bank
                                    </label>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </Col>
                        </Row>

                        <Row className="form-group row g-4">
                          <Col lg="5"></Col>
                          <Col md="4">
                            <Button className="m-1" color={"primary"} size="md" onClick={handleSubmit(postBuyData)}>
                              BUY
                            </Button>
                          </Col>

                          <Col lg="3"></Col>
                        </Row>
                      </TabPane>

                      <TabPane tabId={2}>
                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="sellType">
                                Type
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <div className="form-group">
                              <ul className="custom-control-group g-3 align-center flex-wrap">
                                <li>
                                  <div className="custom-control custom-control-sm custom-radio">
                                    <input
                                      id="sell_bank"
                                      type="radio"
                                      name={"sellType"}
                                      value={1}
                                      className="custom-control-input"
                                      checked={sellType == 1 ? true : false}
                                      onChange={(e) => {
                                        setSellType(1);
                                      }}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="sell_bank"
                                    >
                                      Bank
                                    </label>
                                  </div>
                                </li>
                                <li>
                                  <div className="custom-control custom-control-sm custom-radio">
                                    <input
                                      id="sell_bullion"
                                      type="radio"
                                      value={2}
                                      name={"sellType"}
                                      className="custom-control-input "
                                      checked={sellType == 2 ? true : false}
                                      onChange={(e) => {
                                        setSellType(2);
                                      }}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="sell_bullion"
                                    >
                                      Bullion
                                    </label>
                                  </div>
                                </li>
                                <li>
                                  <div className="custom-control custom-control-sm custom-radio">
                                    <input
                                      id="sell_others"
                                      type="radio"
                                      value={3}
                                      name={"sellType"}
                                      className="custom-control-input "
                                      checked={sellType == 3 ? true : false}
                                      onChange={(e) => {
                                        setSellType(3);
                                      }}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="sell_others"
                                    >
                                      Others
                                    </label>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </Col>
                        </Row>

                        {/* <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="sellMetal">
                                Metal
                                <IsRequired />
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <div className="form-group">
                              <div className="form-control-wrap">
                                <div className="form-control-select">
                                  <select
                                    className="form-control form-select"
                                    id="sellMetal"
                                    name="sellMetal"
                                    // {...register1("sellMetal", {
                                    //   required: true,
                                    // })}
                                    value={sellMetal}
                                    onChange={(e) =>
                                      setSellMetal(e.target.value)
                                    }
                                  >
                                    {sellMetalOptions?.map((item, index) => (
                                      <option key={index} value={item?.value}>
                                        {item?.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row> */}

                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label
                                className="form-label"
                                htmlFor="sellMetal"
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
                        </Row>

                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label
                                className="form-label"
                                htmlFor="sellWeight"
                              >
                                Weight
                                <IsRequired />
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
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
                                      !["Backspace", "Tab", "."].includes(
                                        evt.key
                                      )
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
                        </Row>

                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label
                                className="form-label"
                                htmlFor="sellRatePerGram"
                              >
                                Rate Per Gram
                              </label>
                            </div>
                          </Col>
                          <Col lg="8">
                            <div className="form-group">
                              <div className="form-control-wrap">
                                <input
                                  {...register1("sellRatePerGram", {
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
                                />
                              </div>
                              {errors1?.sellRatePerGram && (
                                <span className="text-danger">
                                  {errors1.sellRatePerGram.message}
                                </span>
                              )}
                            </div>
                          </Col>
                        </Row>

                        <Row className="form-group row g-4">
                          <Col lg="2"></Col>
                          <Col md="2">
                            <div className="form-group">
                              <label
                                className="form-label"
                                htmlFor="ratePerGram"
                              >
                                Mt rate
                              </label>
                            </div>
                          </Col>
                          <Col lg="2">
                            <div>
                              {sellMetal == 1
                                ? parseFloat(goldMtSellRate).toFixed(2)
                                : parseFloat(silverMtSellRate).toFixed(2)}
                            </div>
                          </Col>
                          <Col lg="2"></Col>
                          <Col md="2">
                            <div className="form-group">
                              <label
                                className="form-label"
                                htmlFor="ratePerGram"
                              >
                                Premium
                              </label>
                            </div>
                          </Col>
                          <Col lg="2">
                            <div>{parseFloat(sellPremium).toFixed(2)}</div>
                          </Col>
                        </Row>

                        <Row className="form-group row g-4">
                          <Col lg="5"></Col>
                          <Col md="4">
                            <Button className="m-1" color={"primary"} size="md" onClick={handleSubmit1(postSellData)}>
                              SELL
                            </Button>
                          </Col>

                          <Col lg="3"></Col>
                        </Row>
                      </TabPane>
                    </TabContent>
                  </div>
                </Col>

                <Col md={6}>
                  <Row>
                    {/* <div className="custom-grid"> */}
                    <McxRateComponent
                      setGoldMtBuyRate={setGoldMtBuyRate}
                      // setGoldMtSellRate={setGoldMtSellRate}
                      setSilverMtBuyRate={setSilverMtBuyRate}
                    // setSilverMtSellRate={setSilverMtSellRate}
                    />
                    {/* </div> */}
                  </Row>
                  <Row className={"mt-4"}>
                    {/* <div className="custom-grid"> */}
                    <BankRateComponent
                      sellType={sellType}
                      setGoldMtSellRate={setGoldMtSellRate}
                      setSilverMtSellRate={setSilverMtSellRate}
                      setGoldBankRatePerGram={setGoldBankRatePerGram}
                      setGoldBankRatePerKg={setGoldBankRatePerKg}
                      setSilverBankRatePerGram={setSilverBankRatePerGram}
                      setSilverBankRatePerKg={setSilverBankRatePerKg}
                    />
                    {/* </div> */}
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

export default BuySellForm;
