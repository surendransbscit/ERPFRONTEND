/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import {
  useBranches,
  useSupplierFilter,
} from "../../../components/filters/filterHooks";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import {
  Col,
  Icon,
  PreviewCard,
  Row,
  TextInputField,
  UserAvatar,
} from "../../../components/Component";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import IsRequired from "../../../components/erp-required/erp-required";
import {
  Badge,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { useForm } from "react-hook-form";
import { Typeahead } from "react-bootstrap-typeahead";
import { searchCustomer } from "../../../redux/thunks/customer";
import classnames from "classnames";
import { SupplierDropdown } from "../../../components/filters/retailFilters";
import CreateCustomerConfirmation from "../../../components/modals/CreateCustomerConfirmation";
import { toastfunc } from "../../../components/sds-toast-style/toast-style";
import {
  getSearchCustomerHistory,
  getSearchSupplierHistory,
  getSearchTagHistory,
} from "../../../redux/thunks/reports";
import CurrencyDisplay from "../../../components/common/moneyFormat/moneyFormat";
import {
  CustomerAccountDetailColumns,
  CustomerCreditColumns,
  CustomerOrderColumns,
  CustomerPurchaseColumn,
  CustomerSalesColumn,
  SupplierPurchaseEntryColumns,
  TagLogHistoryDetailsColumns,
  TagStoneDetailsColumns,
} from "./ColumnData";
import { getPagePermission } from "../../../redux/thunks/coreComponent";

const SearchCustomerSupllierHistory = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { branches } = useBranches();
  const { supplier } = useSupplierFilter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
    reset,
    setValue,
  } = useForm();
  const {
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);

  const [customer, SetCustomer] = useState();
  const [customerSearch, SetCustomerSearch] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [inputType, setInputType] = useState();
  const [navigateModal, SetNavigateModal] = useState(false);
  const [createMobNum, SetCreateMobNum] = useState();

  const [searchByOpt, setSearchByOpt] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState();
  const [selectedTagCode, setSelectedTagCode] = useState();
  const [selectedHuid, setSelectedHUID] = useState();

  const { searchCustomerList } = useSelector((state) => state.customerReducer);

  const pathName = location?.pathname;
  const { pagePermission } = useSelector((state) => state.coreCompReducer);

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  useEffect(() => {
    if (
      pagePermission?.view === false ||
      pagePermission === undefined ||
      pagePermission === null
    ) {
      navigate(`${process.env.PUBLIC_URL}/`);
    }
  }, [pagePermission, navigate]);

  const { isLoading: isSearchingCustomer, searchCustomerHistoryList } =
    useSelector((state) => state.reportReducer);

  const { isLoading: isSearchingSupplier, searchSupplierHistoryList } =
    useSelector((state) => state.reportReducer);

  const { isLoading: isSearchingTag, searchTagHistoryList } = useSelector(
    (state) => state.reportReducer
  );

  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [supplierActiveTab, setSupplierActiveTab] = useState("1");

  const supplierToggle = (tab) => {
    if (supplierActiveTab !== tab) setSupplierActiveTab(tab);
  };

  const [tagActiveTab, setTagActiveTab] = useState("1");

  const tagToggle = (tab) => {
    if (tagActiveTab !== tab) setTagActiveTab(tab);
  };

  const toggleNavigateModal = () => SetNavigateModal(!navigateModal);

  const navigateCreateCustomer = () => {
    navigate(
      {
        pathname: `${process.env.PUBLIC_URL}/master/customer/add`,
      },
      {
        state: {
          add: true,
          createMobNum: createMobNum,
          navigateLink: `/schememaster/schemeaccount/add`,
        },
      }
    );
  };

  const handleSearch = async () => {
    if (searchByOpt === 1) {
      if (customer == undefined) {
        toastfunc("Select Customer to search");
      } else {
        let result = "";
        try {
          result = await dispatch(
            getSearchCustomerHistory({ id_customer: customer })
          ).unwrap();
        } catch (error) {
          console.error(error);
        }
      }
    } else if (searchByOpt === 2) {
      if (selectedSupplier == undefined) {
        toastfunc("Select Supplier to search");
      } else {
        let result = "";
        try {
          result = await dispatch(
            getSearchSupplierHistory({ supplier: selectedSupplier })
          ).unwrap();
        } catch (error) {
          console.error(error);
        }
      }
    } else if (searchByOpt === 3) {
      if (selectedTagCode == undefined || selectedTagCode == "") {
        toastfunc("Enter Tag Code to search");
      } else {
        let result = "";
        try {
          result = await dispatch(
            getSearchTagHistory({ tag_code: selectedTagCode })
          ).unwrap();
        } catch (error) {
          console.error(error);
        }
      }
    } else if (searchByOpt === 4) {
      if (selectedHuid == undefined || selectedHuid == "") {
        toastfunc("Enter HUID Code to search");
      } else {
        let result = "";
        try {
          result = await dispatch(
            getSearchTagHistory({ tag_huid: selectedHuid })
          ).unwrap();
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  // console.log(searchCustomerHistoryList);

  const calculateCustomerSalesTotal = (field) => {
    return searchCustomerHistoryList?.sales?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = CustomerSalesColumn?.find((item) => item.accessor === field);
      let decimal_places =
        column && column.decimal_places !== undefined
          ? column.decimal_places
          : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const calculateCustomerPurchaseTotal = (field) => {
    return searchCustomerHistoryList?.purchase?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = CustomerPurchaseColumn?.find(
        (item) => item.accessor === field
      );
      let decimal_places =
        column && column.decimal_places !== undefined
          ? column.decimal_places
          : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const calculateCustomerOrderTotal = (field) => {
    return searchCustomerHistoryList?.orders?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = CustomerOrderColumns?.find(
        (item) => item.accessor === field
      );
      let decimal_places =
        column && column.decimal_places !== undefined
          ? column.decimal_places
          : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const calculateChitAccountsTotal = (field) => {
    return searchCustomerHistoryList?.chit_accounts?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = CustomerAccountDetailColumns?.find(
        (item) => item.accessor === field
      );
      let decimal_places =
        column && column.decimal_places !== undefined
          ? column.decimal_places
          : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const calculateCustomerCreditTotal = (field) => {
    return searchCustomerHistoryList?.credits?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = CustomerCreditColumns?.find(
        (item) => item.accessor === field
      );
      let decimal_places =
        column && column.decimal_places !== undefined
          ? column.decimal_places
          : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const calculateSupplierPurchaseEntryTotal = (field) => {
    return searchSupplierHistoryList?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = SupplierPurchaseEntryColumns?.find(
        (item) => item.accessor === field
      );
      let decimal_places =
        column && column.decimal_places !== undefined
          ? column.decimal_places
          : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const calculateTagStoneDetailTotal = (field) => {
    return searchTagHistoryList?.stone_details?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = TagStoneDetailsColumns?.find(
        (item) => item.accessor === field
      );
      let decimal_places =
        column && column.decimal_places !== undefined
          ? column.decimal_places
          : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  useEffect(() => {
    return () => {
      dispatch({ type: "getSearchCustomerHistory/reset" });
      dispatch({ type: "getSearchSupplierHistory/reset" });
      dispatch({ type: "getSearchTagHistory/reset" });
      // dispatch({ type: "getSearchHuidHistory/reset" });
    };
  }, []);

  useEffect(() => {
    if (searchByOpt === 1) {
      setSelectedTagCode();
      setSelectedSupplier();
      dispatch({ type: "getSearchSupplierHistory/reset" });
      dispatch({ type: "getSearchTagHistory/reset" });
    } else if (searchByOpt === 2) {
      setValue("selectedTagCode", "");
      dispatch({ type: "getSearchCustomerHistory/reset" });
      dispatch({ type: "getSearchTagHistory/reset" });
    } else if (searchByOpt === 3) {
      setSelectedSupplier();
      dispatch({ type: "getSearchCustomerHistory/reset" });
      dispatch({ type: "getSearchSupplierHistory/reset" });
    }
    // else if (searchByOpt === 4) {
    //   setValue("selectedHuidCode", "");
    //   dispatch({ type: "getSearchCustomerHistory/reset" });
    //   dispatch({ type: "getSearchHuidHistory/reset" });
    // }
  }, [searchByOpt, dispatch]);

  useEffect(() => {
    if (
      isSearching &&
      customerSearch?.length > 0 &&
      customerSearch[0]?.label.length >= 5 &&
      customer == null
    ) {
      const searchKey = inputType === "number" ? "mob_num" : "name";
      dispatch(searchCustomer({ [searchKey]: customerSearch[0]?.label }));
    }
  }, [isSearching, customerSearch, customer, dispatch, inputType]);

  useEffect(() => {
    if (
      isSearching &&
      customerSearch?.length > 0 &&
      customerSearch[0]?.label.length >= 9 &&
      customer == null &&
      searchCustomerList?.length == 0
    ) {
      SetCreateMobNum(customerSearch[0]?.label);
      SetNavigateModal(true);
    }
  }, [isSearching, customerSearch, customer, searchCustomerList]);

  return (
    <React.Fragment>
      <Head title="User History" />
      <Content>
        {/* <CreateCustomerConfirmation
          modal={navigateModal}
          toggle={toggleNavigateModal}
          title={"Create Customer"}
          mobNum={createMobNum}
          clickAction={navigateCreateCustomer}
        /> */}
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
            <Col md={5} className="text-right flex">
              <Button
                disabled={isSearchingCustomer || isSearchingSupplier}
                color="secondary"
                size="md"
                onClick={() => handleSearch()}
              >
                {isSearchingCustomer || isSearchingSupplier
                  ? "Searching.."
                  : "Search"}
              </Button>
            </Col>
          </Row>

          <div className="custom-grid">
            <Row className="form-group row g-2">
              <Col lg="3">
                <div className="form-group">
                  <label className="form-label" htmlFor="radioSize">
                    Search by Option
                    {/* <IsRequired /> */}
                  </label>
                </div>
              </Col>
              <Col lg="4">
                <div className="form-group">
                  <ul className="custom-control-group g-3 align-center flex-wrap">
                    <li>
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          register={register}
                          type="radio"
                          className="custom-control-input"
                          name="radioSize"
                          id="customRadioYes"
                          value={1}
                          onChange={(e) => {
                            setSearchByOpt(1);
                          }}
                          checked={parseInt(searchByOpt) === 1}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customRadioYes"
                        >
                          Customer
                        </label>
                      </div>
                    </li>

                    <li>
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          register={register}
                          type="radio"
                          className="custom-control-input"
                          name="radioSize"
                          id="customRadioNo"
                          value={2}
                          checked={parseInt(searchByOpt) === 2}
                          onChange={(e) => {
                            setSearchByOpt(2);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customRadioNo"
                        >
                          Supplier
                        </label>
                      </div>
                    </li>

                    <li>
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          register={register}
                          type="radio"
                          className="custom-control-input"
                          name="radiotag"
                          id="customRadiotag"
                          value={3}
                          checked={parseInt(searchByOpt) === 3}
                          onChange={(e) => {
                            setSearchByOpt(3);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customRadiotag"
                        >
                          Tag
                        </label>
                      </div>
                    </li>

                    <li>
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          register={register}
                          type="radio"
                          className="custom-control-input"
                          name="radiotag"
                          id="customRadioHuid"
                          value={4}
                          checked={parseInt(searchByOpt) === 4}
                          onChange={(e) => {
                            setSearchByOpt(4);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customRadioHuid"
                        >
                          HUID
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>

            {searchByOpt === 1 ? (
              <Row className="form-group row g-2">
                <Col lg="3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="customerSearch">
                      Customer
                      <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col md="3">
                  <div className="form-control-wrap">
                    <Typeahead
                      id="customerSearch"
                      labelKey="label"
                      onChange={(e) => {
                        if (e?.length > 0) {
                          SetCustomer(e[0]?.value), SetCustomerSearch(e);
                        } else {
                          SetCustomer(null);
                          SetCustomerSearch([]);
                        }
                      }}
                      options={searchCustomerList}
                      placeholder="Choose a customer..."
                      // defaultSelected={customerSearch}
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
                          (inputType === "number" && /^\d*$/.test(text)) ||
                          (inputType === "text" && /^[a-zA-Z\s]*$/.test(text))
                        ) {
                          setIsSearching(text.length >= 5);
                          SetCustomerSearch([{ label: text }]);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (inputType === "number" && !/\d/.test(e.key)) {
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
                        if (inputType === "text" && /\d/.test(e.key)) {
                          e.preventDefault(); // Prevent typing numbers if inputType is text
                        }
                      }}
                    />
                  </div>
                </Col>
              </Row>
            ) : searchByOpt === 2 ? (
              <Row className="form-group row g-2">
                <Col lg="3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="selectedSupplier">
                      Supplier
                      <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col md="3">
                  <SupplierDropdown
                    register={register}
                    id={"selectedSupplier"}
                    supplier={supplier}
                    selectedSupplier={selectedSupplier}
                    onSupplierChange={(value) => {
                      setSelectedSupplier(value);
                    }}
                    isRequired={false}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.selectedSupplier && "Supplier is Required"}
                  />
                </Col>
              </Row>
            ) : searchByOpt === 3 ? (
              <Row className="form-group row g-2">
                <Col lg="3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="selectedTagCode">
                      Tag Code
                    </label>
                  </div>
                </Col>
                <Col md="3">
                  <TextInputField
                    register={register}
                    placeholder="Tag Code"
                    id={"selectedTagCode"}
                    value={selectedTagCode}
                    isRequired={false}
                    type={"text"}
                    setValue={setValue}
                    SetValue={(value) => {
                      setSelectedTagCode(value);
                      clearErrors("selectedTagCode");
                    }}
                    message={
                      errors.selectedTagCode && errors.selectedTagCode.message
                    }
                  />
                </Col>
              </Row>
            ) : searchByOpt === 4 ? (
              <Row className="form-group row g-2">
                {/* HUID form */}
                <Col lg="3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="selectedHuid">
                      HUID
                    </label>
                  </div>
                </Col>
                <Col md="3">
                  <TextInputField
                    register={register}
                    placeholder="HUID"
                    id="selectedHuid"
                    value={selectedHuid}
                    isRequired={false}
                    type="text"
                    setValue={setValue}
                    SetValue={(value) => {
                      setSelectedHUID(value);
                      clearErrors("selectedHuid");
                    }}
                    message={errors.selectedHuid && errors.selectedHuid.message}
                  />
                </Col>
              </Row>
            ) : null}

            {/* Customer */}
            {searchByOpt === 1 && (
              <div style={{ marginTop: "50px" }}>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#tab"
                      className={classnames({ active: activeTab === "1" })}
                      onClick={(ev) => {
                        ev.preventDefault();
                        toggle("1");
                      }}
                    >
                      <Icon name="grid-alt-fill" /> <span>Basic Details</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#tab"
                      className={classnames({ active: activeTab === "2" })}
                      onClick={(ev) => {
                        ev.preventDefault();
                        toggle("2");
                      }}
                    >
                      <Icon name="grid-alt-fill" /> <span>Sales</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#tab"
                      className={classnames({ active: activeTab === "3" })}
                      onClick={(ev) => {
                        ev.preventDefault();
                        toggle("3");
                      }}
                    >
                      <Icon name="grid-alt-fill" /> <span>Purchase</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#tab"
                      className={classnames({ active: activeTab === "4" })}
                      onClick={(ev) => {
                        ev.preventDefault();
                        toggle("4");
                      }}
                    >
                      <Icon name="grid-alt-fill" /> <span>Orders</span>
                    </NavLink>
                  </NavItem>
                  {searchCustomerHistoryList?.chit_accounts?.length > 0 && (
                    <NavItem>
                      <NavLink
                        tag="a"
                        href="#tab"
                        className={classnames({ active: activeTab === "6" })}
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle("6");
                        }}
                      >
                        <Icon name="grid-alt-fill" /> <span>Accounts</span>
                      </NavLink>
                    </NavItem>
                  )}
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#tab"
                      className={classnames({ active: activeTab === "5" })}
                      onClick={(ev) => {
                        ev.preventDefault();
                        toggle("5");
                      }}
                    >
                      <Icon name="grid-alt-fill" /> <span>Credit Pending</span>
                    </NavLink>
                  </NavItem>
                </Nav>

                {searchCustomerHistoryList != null && (
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <div style={{ padding: "16px" }}>
                        <table style={{ width: "100%" }}>
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  width: "70%",
                                  paddingRight: "20px",
                                  verticalAlign: "top",
                                }}
                              >
                                <table style={{ width: "100%" }}>
                                  <tbody>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Cus Name:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchCustomerHistoryList?.cus_name}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Mobile:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchCustomerHistoryList?.mobile}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Address:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchCustomerHistoryList?.address}
                                        {/* <br />
                                      Pollachi */}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Active Accounts:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {
                                          searchCustomerHistoryList?.active_accounts
                                        }
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Advance in Hand:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {
                                          <CurrencyDisplay
                                            value={
                                              searchCustomerHistoryList?.advance_in_hand
                                            }
                                          />
                                        }
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Outstanding Amount:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {
                                          <CurrencyDisplay
                                            value={
                                              searchCustomerHistoryList?.outstanding_amount
                                            }
                                          />
                                        }
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              {searchCustomerHistoryList?.cus_img != null ? (
                                <td
                                  style={{
                                    width: "30%",
                                    textAlign: "center",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "200px",
                                      height: "200px",
                                      backgroundColor: "#f8f9fa",
                                      border: "1px solid #dee2e6",
                                      borderRadius: "5%",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      fontSize: "14px",
                                      color: "#666",
                                      margin: "0 auto",
                                    }}
                                  >
                                    <img
                                      alt={searchCustomerHistoryList?.cus_name}
                                      src={searchCustomerHistoryList?.cus_img}
                                    />
                                  </div>
                                </td>
                              ) : (
                                <>
                                  <td
                                    style={{
                                      width: "30%",
                                      textAlign: "center",
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "200px",
                                        height: "200px",
                                        backgroundColor: "#f8f9fa",
                                        border: "1px solid #dee2e6",
                                        borderRadius: "5%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        fontSize: "14px",
                                        color: "#666",
                                        margin: "0 auto",
                                      }}
                                    >
                                      {searchCustomerHistoryList?.cus_name}
                                    </div>
                                  </td>
                                </>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </TabPane>
                    <TabPane tabId="2">
                      {/* <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>S.NO</th>
                                                        <th>Invoice No.</th>
                                                        <th>Branch</th>
                                                        <th>Sales Amount</th>
                                                        <th>Net Amount</th>
                                                        <th>Received Amount</th>
                                                        <th>Due Amount</th>
                                                        <th>Due Date</th>
                                                        <th>Invoice Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {searchCustomerHistoryList?.sales?.map(
                                                        (obj, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{obj?.sales_invoice_no}</td>
                                                                    <td>{obj?.branch_name}</td>
                                                                    <td>
                                                                        {
                                                                            <CurrencyDisplay
                                                                                value={obj?.sales_amount}
                                                                            />
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            <CurrencyDisplay
                                                                                value={obj?.net_amount}
                                                                            />
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            <CurrencyDisplay
                                                                                value={obj?.received_amount}
                                                                            />
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            <CurrencyDisplay
                                                                                value={obj?.due_amount}
                                                                            />
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {moment(obj?.due_date).format("DD-MM-YYYY")}
                                                                    </td>
                                                                    <td>
                                                                        {moment(obj?.invoice_date).format(
                                                                            "DD-MM-YYYY"
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                                </tbody>
                                            </table>
                                        </div> */}
                      <div
                        className="table-responsive"
                        style={{ maxHeight: "300px", overflowY: "auto" }}
                      >
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th
                                style={{
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                S.NO{" "}
                              </th>
                              {CustomerSalesColumn?.map((column, index) => (
                                <th
                                  key={index}
                                  style={{
                                    textAlign: column?.textAlign,
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  {column.header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {searchCustomerHistoryList?.sales?.length > 0 &&
                              searchCustomerHistoryList?.sales?.map(
                                (item, rowIndex) => (
                                  <tr key={rowIndex}>
                                    <td>{rowIndex + 1} </td>
                                    {CustomerSalesColumn?.map(
                                      (column, colIndex) => (
                                        <td
                                          key={colIndex}
                                          style={{
                                            textAlign: column?.textAlign,
                                          }}
                                        >
                                          {column.type === "image" ? (
                                            item[column.accessor] ? (
                                              <img
                                                src={item[column.accessor]}
                                                alt={column.accessor}
                                                style={{
                                                  maxWidth: "100px",
                                                  maxHeight: "100px",
                                                }}
                                              />
                                            ) : (
                                              <UserAvatar
                                                text={item["image_text"]}
                                              />
                                            )
                                          ) : column.isCurrency ? (
                                            <CurrencyDisplay
                                              value={item[column.accessor]}
                                            />
                                          ) : column.decimal_places ? (
                                            parseFloat(
                                              item[column.accessor]
                                            ).toFixed(column.decimal_places)
                                          ) : (
                                            item[column.accessor]
                                          )}
                                        </td>
                                      )
                                    )}
                                  </tr>
                                )
                              )}
                          </tbody>

                          <tfoot>
                            <tr style={{ fontWeight: "bold" }}>
                              <th
                                style={{
                                  position: "sticky",
                                  bottom: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                Total
                              </th>
                              {CustomerSalesColumn?.map((column, index) => (
                                <td
                                  key={index}
                                  style={{
                                    textAlign: column?.textAlign,
                                    position: "sticky",
                                    bottom: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  {column.isTotalReq ? (
                                    column.isCurrency ? (
                                      <CurrencyDisplay
                                        value={calculateCustomerSalesTotal(
                                          column.accessor
                                        )}
                                      />
                                    ) : (
                                      calculateCustomerSalesTotal(
                                        column.accessor
                                      )
                                    )
                                  ) : (
                                    ""
                                  )}
                                </td>
                              ))}
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </TabPane>
                    <TabPane tabId="3">
                      {/* <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>S.NO</th>
                            <th>Product Name</th>
                            <th>Stock Type</th>
                            <th>Pieces</th>
                            <th>Gross Wt.</th>
                            <th>Less Wt</th>
                            <th>Net Wt</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchCustomerHistoryList?.purchase?.map(
                            (obj, index) => {
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{obj?.product_name}</td>
                                  <td>{obj?.stock_type}</td>
                                  <td>{obj?.pieces}</td>
                                  <td>{obj?.gross_wt}</td>
                                  <td>{obj?.less_wt}</td>
                                  <td>{obj?.net_wt}</td>

                                  <td>
                                    {<CurrencyDisplay value={obj?.amount} />}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div> */}
                      <div
                        className="table-responsive"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                      >
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th
                                style={{
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                S.NO{" "}
                              </th>
                              {CustomerPurchaseColumn?.map((column, index) => (
                                <th
                                  key={index}
                                  style={{
                                    textAlign: column?.textAlign,
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  {column.header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {searchCustomerHistoryList?.purchase?.length > 0 &&
                              searchCustomerHistoryList?.purchase?.map(
                                (item, rowIndex) => (
                                  <tr key={rowIndex}>
                                    <td>{rowIndex + 1} </td>
                                    {CustomerPurchaseColumn?.map(
                                      (column, colIndex) => (
                                        <td
                                          key={colIndex}
                                          style={{
                                            textAlign: column?.textAlign,
                                          }}
                                        >
                                          {column.type === "image" ? (
                                            item[column.accessor] ? (
                                              <img
                                                src={item[column.accessor]}
                                                alt={column.accessor}
                                                style={{
                                                  maxWidth: "100px",
                                                  maxHeight: "100px",
                                                }}
                                              />
                                            ) : (
                                              <UserAvatar
                                                text={item["image_text"]}
                                              />
                                            )
                                          ) : column.isCurrency ? (
                                            <CurrencyDisplay
                                              value={item[column.accessor]}
                                            />
                                          ) : column.decimal_places ? (
                                            parseFloat(
                                              item[column.accessor]
                                            ).toFixed(column.decimal_places)
                                          ) : (
                                            item[column.accessor]
                                          )}
                                        </td>
                                      )
                                    )}
                                  </tr>
                                )
                              )}
                          </tbody>

                          <tfoot>
                            <tr style={{ fontWeight: "bold" }}>
                              <th
                                style={{
                                  position: "sticky",
                                  bottom: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                Total
                              </th>
                              {CustomerSalesColumn?.map((column, index) => (
                                <td
                                  key={index}
                                  style={{
                                    textAlign: column?.textAlign,
                                    position: "sticky",
                                    bottom: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  {column.isTotalReq ? (
                                    column.isCurrency ? (
                                      <CurrencyDisplay
                                        value={calculateCustomerPurchaseTotal(
                                          column.accessor
                                        )}
                                      />
                                    ) : (
                                      calculateCustomerPurchaseTotal(
                                        column.accessor
                                      )
                                    )
                                  ) : (
                                    ""
                                  )}
                                </td>
                              ))}
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </TabPane>

                    <TabPane tabId="4">
                      {/* <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>S.NO</th>
                            <th>Order No.</th>
                            <th>Branch</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchCustomerHistoryList?.orders?.map(
                            (obj, index) => {
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{obj?.order_no}</td>
                                  <td>{obj?.branch_name}</td>
                                  <td>{obj?.date}</td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div> */}
                      <div
                        className="table-responsive"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                      >
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th
                                style={{
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                S.NO{" "}
                              </th>
                              {CustomerOrderColumns?.map((column, index) => (
                                <th
                                  key={index}
                                  style={{
                                    textAlign: column?.textAlign,
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  {column.header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {searchCustomerHistoryList?.orders?.length > 0 &&
                              searchCustomerHistoryList?.orders?.map(
                                (item, rowIndex) => (
                                  <tr key={rowIndex}>
                                    <td>{rowIndex + 1} </td>
                                    {CustomerOrderColumns?.map(
                                      (column, colIndex) => (
                                        <td
                                          key={colIndex}
                                          style={{
                                            textAlign: column?.textAlign,
                                          }}
                                        >
                                          {column.type === "lable" ? (
                                            <Badge
                                              className="badge-sm badge-dot has-bg d-none d-sm-inline-flex"
                                              color={item["colour"]}
                                            >
                                              {item[column.accessor]}
                                            </Badge>
                                          ) : column.type === "image" ? (
                                            item[column.accessor] ? (
                                              <img
                                                src={item[column.accessor]}
                                                alt={column.accessor}
                                                style={{
                                                  maxWidth: "100px",
                                                  maxHeight: "100px",
                                                }}
                                              />
                                            ) : (
                                              <UserAvatar
                                                text={item["image_text"]}
                                              />
                                            )
                                          ) : column.isCurrency ? (
                                            <CurrencyDisplay
                                              value={item[column.accessor]}
                                            />
                                          ) : column.decimal_places ? (
                                            parseFloat(
                                              item[column.accessor]
                                            ).toFixed(column.decimal_places)
                                          ) : (
                                            item[column.accessor]
                                          )}
                                        </td>
                                      )
                                    )}
                                  </tr>
                                )
                              )}
                          </tbody>

                          <tfoot>
                            <tr style={{ fontWeight: "bold" }}>
                              <th
                                style={{
                                  position: "sticky",
                                  bottom: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                Total
                              </th>
                              {CustomerOrderColumns?.map((column, index) => (
                                <td
                                  key={index}
                                  style={{
                                    textAlign: column?.textAlign,
                                    position: "sticky",
                                    bottom: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  {column.isTotalReq ? (
                                    column.isCurrency ? (
                                      <CurrencyDisplay
                                        value={calculateCustomerOrderTotal(
                                          column.accessor
                                        )}
                                      />
                                    ) : (
                                      calculateCustomerOrderTotal(
                                        column.accessor
                                      )
                                    )
                                  ) : (
                                    ""
                                  )}
                                </td>
                              ))}
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </TabPane>

                    <TabPane tabId="5">
                      {/* <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>S.NO</th>
                            <th>Bill No.</th>
                            <th>Branch</th>
                            <th>Issued Amount</th>
                            <th>Received Amount</th>
                            <th>Balance Amount</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchCustomerHistoryList?.credits?.map(
                            (obj, index) => {
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{obj?.bill_no}</td>
                                  <td>{obj?.branch_name}</td>
                                  <td>
                                    {
                                      <CurrencyDisplay
                                        value={obj?.issued_amount}
                                      />
                                    }
                                  </td>
                                  <td>
                                    {
                                      <CurrencyDisplay
                                        value={obj?.received_amount}
                                      />
                                    }
                                  </td>
                                  <td>
                                    {
                                      <CurrencyDisplay
                                        value={obj?.balance_amount}
                                      />
                                    }
                                  </td>
                                  <td>{obj?.bill_date}</td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div> */}
                      <div
                        className="table-responsive"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                      >
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th
                                style={{
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                S.NO{" "}
                              </th>
                              {CustomerCreditColumns?.map((column, index) => (
                                <th
                                  key={index}
                                  style={{
                                    textAlign: column?.textAlign,
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  {column.header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {searchCustomerHistoryList?.credits?.length > 0 &&
                              searchCustomerHistoryList?.credits?.map(
                                (item, rowIndex) => (
                                  <tr key={rowIndex}>
                                    <td>{rowIndex + 1} </td>
                                    {CustomerCreditColumns?.map(
                                      (column, colIndex) => (
                                        <td
                                          key={colIndex}
                                          style={{
                                            textAlign: column?.textAlign,
                                          }}
                                        >
                                          {column.type === "image" ? (
                                            item[column.accessor] ? (
                                              <img
                                                src={item[column.accessor]}
                                                alt={column.accessor}
                                                style={{
                                                  maxWidth: "100px",
                                                  maxHeight: "100px",
                                                }}
                                              />
                                            ) : (
                                              <UserAvatar
                                                text={item["image_text"]}
                                              />
                                            )
                                          ) : column.isCurrency ? (
                                            <CurrencyDisplay
                                              value={item[column.accessor]}
                                            />
                                          ) : column.decimal_places ? (
                                            parseFloat(
                                              item[column.accessor]
                                            ).toFixed(column.decimal_places)
                                          ) : (
                                            item[column.accessor]
                                          )}
                                        </td>
                                      )
                                    )}
                                  </tr>
                                )
                              )}
                          </tbody>

                          <tfoot>
                            <tr style={{ fontWeight: "bold" }}>
                              <th
                                style={{
                                  position: "sticky",
                                  bottom: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                Total
                              </th>
                              {CustomerCreditColumns?.map((column, index) => (
                                <td
                                  key={index}
                                  style={{
                                    textAlign: column?.textAlign,
                                    position: "sticky",
                                    bottom: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  {column.isTotalReq ? (
                                    column.isCurrency ? (
                                      <CurrencyDisplay
                                        value={calculateCustomerCreditTotal(
                                          column.accessor
                                        )}
                                      />
                                    ) : (
                                      calculateCustomerCreditTotal(
                                        column.accessor
                                      )
                                    )
                                  ) : (
                                    ""
                                  )}
                                </td>
                              ))}
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </TabPane>

                    {searchCustomerHistoryList?.chit_accounts?.length > 0 && (
                      <TabPane tabId={"6"}>
                        <div
                          className="table-responsive"
                          style={{ maxHeight: "400px", overflowY: "auto" }}
                        >
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th
                                  style={{
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  S.NO{" "}
                                </th>
                                {CustomerAccountDetailColumns?.map(
                                  (column, index) => (
                                    <th
                                      key={index}
                                      style={{
                                        textAlign: column?.textAlign,
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 1,
                                        backgroundColor: "#f8f9fa",
                                      }}
                                    >
                                      {column.header}
                                    </th>
                                  )
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {searchCustomerHistoryList?.chit_accounts
                                ?.length > 0 &&
                                searchCustomerHistoryList?.chit_accounts?.map(
                                  (item, rowIndex) => (
                                    <tr key={rowIndex}>
                                      <td>{rowIndex + 1} </td>
                                      {CustomerAccountDetailColumns?.map(
                                        (column, colIndex) => (
                                          <td
                                            key={colIndex}
                                            style={{
                                              textAlign: column?.textAlign,
                                            }}
                                          >
                                            {column.type === "lable" ? (
                                              <Badge
                                                className="badge-sm badge-dot has-bg d-none d-sm-inline-flex"
                                                color={item["colour"]}
                                              >
                                                {item[column.accessor]}
                                              </Badge>
                                            ) : column.type === "image" ? (
                                              item[column.accessor] ? (
                                                <img
                                                  src={item[column.accessor]}
                                                  alt={column.accessor}
                                                  style={{
                                                    maxWidth: "100px",
                                                    maxHeight: "100px",
                                                  }}
                                                />
                                              ) : (
                                                <UserAvatar
                                                  text={item["image_text"]}
                                                />
                                              )
                                            ) : column.isCurrency ? (
                                              <CurrencyDisplay
                                                value={item[column.accessor]}
                                              />
                                            ) : column.decimal_places ? (
                                              parseFloat(
                                                item[column.accessor]
                                              ).toFixed(column.decimal_places)
                                            ) : (
                                              item[column.accessor]
                                            )}
                                          </td>
                                        )
                                      )}
                                    </tr>
                                  )
                                )}
                            </tbody>

                            <tfoot>
                              <tr style={{ fontWeight: "bold" }}>
                                <th
                                  style={{
                                    position: "sticky",
                                    bottom: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  Total
                                </th>
                                {CustomerAccountDetailColumns?.map(
                                  (column, index) => (
                                    <td
                                      key={index}
                                      style={{
                                        textAlign: column?.textAlign,
                                        position: "sticky",
                                        bottom: 0,
                                        zIndex: 1,
                                        backgroundColor: "#f8f9fa",
                                      }}
                                    >
                                      {column.isTotalReq ? (
                                        column.isCurrency ? (
                                          <CurrencyDisplay
                                            value={calculateChitAccountsTotal(
                                              column.accessor
                                            )}
                                          />
                                        ) : (
                                          calculateChitAccountsTotal(
                                            column.accessor
                                          )
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </td>
                                  )
                                )}
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </TabPane>
                    )}
                  </TabContent>
                )}
              </div>
            )}

            {/* Supplier */}
            {searchByOpt === 2 && (
              <div style={{ marginTop: "50px" }}>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#tab"
                      className={classnames({
                        active: supplierActiveTab === "1",
                      })}
                      onClick={(ev) => {
                        ev.preventDefault();
                        supplierToggle("1");
                      }}
                    >
                      <Icon name="grid-alt-fill" />{" "}
                      <span>Purchase Entries</span>
                    </NavLink>
                  </NavItem>
                </Nav>

                {searchSupplierHistoryList != null && (
                  <TabContent activeTab={supplierActiveTab}>
                    <TabPane tabId="1">
                      <div
                        className="table-responsive"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                      >
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th
                                style={{
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                S.NO{" "}
                              </th>
                              {SupplierPurchaseEntryColumns?.map(
                                (column, index) => (
                                  <th
                                    key={index}
                                    style={{
                                      textAlign: column?.textAlign,
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 1,
                                      backgroundColor: "#f8f9fa",
                                    }}
                                  >
                                    {column.header}
                                  </th>
                                )
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {searchSupplierHistoryList?.length > 0 &&
                              searchSupplierHistoryList?.map(
                                (item, rowIndex) => (
                                  <tr key={rowIndex}>
                                    <td>{rowIndex + 1} </td>
                                    {SupplierPurchaseEntryColumns?.map(
                                      (column, colIndex) => (
                                        <td
                                          key={colIndex}
                                          style={{
                                            textAlign: column?.textAlign,
                                          }}
                                        >
                                          {column.type === "lable" ? (
                                            <Badge
                                              className="badge-sm badge-dot has-bg d-none d-sm-inline-flex"
                                              color={item["colour"]}
                                            >
                                              {item[column.accessor]}
                                            </Badge>
                                          ) : column.isCurrency ? (
                                            <CurrencyDisplay
                                              value={item[column.accessor]}
                                            />
                                          ) : column.decimal_places ? (
                                            parseFloat(
                                              item[column.accessor]
                                            ).toFixed(column.decimal_places)
                                          ) : (
                                            item[column.accessor]
                                          )}
                                        </td>
                                      )
                                    )}
                                  </tr>
                                )
                              )}
                          </tbody>

                          <tfoot>
                            <tr style={{ fontWeight: "bold" }}>
                              <th
                                style={{
                                  position: "sticky",
                                  bottom: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                Total
                              </th>
                              {SupplierPurchaseEntryColumns?.map(
                                (column, index) => (
                                  <td
                                    key={index}
                                    style={{
                                      textAlign: column?.textAlign,
                                      position: "sticky",
                                      bottom: 0,
                                      zIndex: 1,
                                      backgroundColor: "#f8f9fa",
                                    }}
                                  >
                                    {column.isTotalReq ? (
                                      column.isCurrency ? (
                                        <CurrencyDisplay
                                          value={calculateSupplierPurchaseEntryTotal(
                                            column.accessor
                                          )}
                                        />
                                      ) : (
                                        calculateSupplierPurchaseEntryTotal(
                                          column.accessor
                                        )
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </td>
                                )
                              )}
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </TabPane>
                  </TabContent>
                )}
              </div>
            )}

            {/* Tag */}
            {searchByOpt === 3 && (
              <div style={{ marginTop: "50px" }}>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#tab"
                      className={classnames({
                        active: tagActiveTab === "1",
                      })}
                      onClick={(ev) => {
                        ev.preventDefault();
                        tagToggle("1");
                      }}
                    >
                      <Icon name="grid-alt-fill" /> <span>Basic Details</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#tab"
                      className={classnames({
                        active: tagActiveTab === "2",
                      })}
                      onClick={(ev) => {
                        ev.preventDefault();
                        tagToggle("2");
                      }}
                    >
                      <Icon name="grid-alt-fill" /> <span>Stone Details</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#tab"
                      className={classnames({
                        active: tagActiveTab === "3",
                      })}
                      onClick={(ev) => {
                        ev.preventDefault();
                        tagToggle("3");
                      }}
                    >
                      <Icon name="grid-alt-fill" /> <span>Log Details</span>
                    </NavLink>
                  </NavItem>
                </Nav>
                {searchTagHistoryList != null && (
                  <TabContent activeTab={tagActiveTab}>
                    <TabPane tabId="1">
                      <div style={{ padding: "16px" }}>
                        <table style={{ width: "100%" }}>
                          <tbody>
                            <tr>
                              {searchTagHistoryList?.image != null ? (
                                <td
                                  style={{
                                    width: "30%",
                                    textAlign: "center",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "200px",
                                      height: "200px",
                                      backgroundColor: "#f8f9fa",
                                      border: "1px solid #dee2e6",
                                      borderRadius: "5%",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      fontSize: "14px",
                                      color: "#666",
                                      margin: "0 auto",
                                    }}
                                  >
                                    <img
                                      alt={searchTagHistoryList?.image_text}
                                      src={searchTagHistoryList?.image}
                                    />
                                  </div>
                                </td>
                              ) : (
                                <>
                                  <td
                                    style={{
                                      width: "30%",
                                      textAlign: "center",
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "200px",
                                        height: "200px",
                                        backgroundColor: "#f8f9fa",
                                        border: "1px solid #dee2e6",
                                        borderRadius: "5%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        fontSize: "14px",
                                        color: "#666",
                                        margin: "0 auto",
                                      }}
                                    >
                                      {searchTagHistoryList?.image_text}
                                    </div>
                                  </td>
                                </>
                              )}
                              <td
                                style={{
                                  width: "70%",
                                  verticalAlign: "top",
                                }}
                              >
                                <table style={{ width: "100%" }}>
                                  <tbody>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Tag Code:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tag_code}
                                      </td>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        V.A(%):
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tag_purchase_va}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Piece:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tag_pcs}
                                      </td>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        V.A (Wt):
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tag_purchase_va}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Gross Wt:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tag_gwt}
                                      </td>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        MC:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tag_mc_value}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Less Wt:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tag_lwt}
                                      </td>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Dia Wt:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tag_dia_wt}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Nwt Wt:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tag_nwt}
                                      </td>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Stn Wt:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tag_stn_wt}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Lot No:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.lot_code}
                                      </td>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Supplier:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.supplier_name}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Tag Status:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {
                                          searchTagHistoryList?.tag_current_status
                                        }
                                      </td>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Flat MC:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.flat_mc_value}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Tag Date:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tagged_date}
                                      </td>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Tag Age:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tag_age}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Product:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.product_name}
                                      </td>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Design:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.design_name}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Purity:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.purity}
                                      </td>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Size:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.size_name}
                                      </td>
                                    </tr>
                                    {(settings?.is_sub_design_req === 1 ||
                                      settings?.is_section_required === 1) && (
                                      <tr>
                                        {settings?.is_sub_design_req === 1 && (
                                          <>
                                            <td
                                              style={{
                                                fontWeight: "bold",
                                                paddingBottom: "12px",
                                              }}
                                            >
                                              Sub Design:
                                            </td>
                                            <td
                                              style={{ paddingBottom: "12px" }}
                                            >
                                              {
                                                searchTagHistoryList?.sub_design_name
                                              }
                                            </td>
                                          </>
                                        )}
                                        {settings?.is_section_required ===
                                          1 && (
                                          <>
                                            <td
                                              style={{
                                                fontWeight: "bold",
                                                paddingBottom: "12px",
                                              }}
                                            >
                                              Section:
                                            </td>
                                            <td
                                              style={{ paddingBottom: "12px" }}
                                            >
                                              {
                                                searchTagHistoryList?.section_name
                                              }
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </TabPane>
                    <TabPane tabId="2">
                      <div
                        className="table-responsive"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                      >
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th
                                style={{
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                S.NO{" "}
                              </th>
                              {TagStoneDetailsColumns?.map((column, index) => (
                                <th
                                  key={index}
                                  style={{
                                    textAlign: column?.textAlign,
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  {column.header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {searchTagHistoryList?.stone_details?.length > 0 &&
                              searchTagHistoryList?.stone_details?.map(
                                (item, rowIndex) => (
                                  <tr key={rowIndex}>
                                    <td>{rowIndex + 1} </td>
                                    {TagStoneDetailsColumns?.map(
                                      (column, colIndex) => (
                                        <td
                                          key={colIndex}
                                          style={{
                                            textAlign: column?.textAlign,
                                          }}
                                        >
                                          {column.type === "lable" ? (
                                            <Badge
                                              className="badge-sm badge-dot has-bg d-none d-sm-inline-flex"
                                              color={item["colour"]}
                                            >
                                              {item[column.accessor]}
                                            </Badge>
                                          ) : column.isCurrency ? (
                                            <CurrencyDisplay
                                              value={item[column.accessor]}
                                            />
                                          ) : column.decimal_places ? (
                                            parseFloat(
                                              item[column.accessor]
                                            ).toFixed(column.decimal_places)
                                          ) : (
                                            item[column.accessor]
                                          )}
                                        </td>
                                      )
                                    )}
                                  </tr>
                                )
                              )}
                          </tbody>

                          <tfoot>
                            <tr style={{ fontWeight: "bold" }}>
                              <th
                                style={{
                                  position: "sticky",
                                  bottom: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                Total
                              </th>
                              {TagStoneDetailsColumns?.map((column, index) => (
                                <td
                                  key={index}
                                  style={{
                                    textAlign: column?.textAlign,
                                    position: "sticky",
                                    bottom: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  {column.isTotalReq ? (
                                    column.isCurrency ? (
                                      <CurrencyDisplay
                                        value={calculateTagStoneDetailTotal(
                                          column.accessor
                                        )}
                                      />
                                    ) : (
                                      calculateTagStoneDetailTotal(
                                        column.accessor
                                      )
                                    )
                                  ) : (
                                    ""
                                  )}
                                </td>
                              ))}
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </TabPane>

                    <TabPane tabId="3">
                      <div
                        className="table-responsive"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                      >
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th
                                style={{
                                  textAlign: "center",
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                S.NO{" "}
                              </th>
                              {TagLogHistoryDetailsColumns?.map(
                                (column, index) => (
                                  <th
                                    key={index}
                                    style={{
                                      textAlign: column?.textAlign,
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 1,
                                      backgroundColor: "#f8f9fa",
                                    }}
                                  >
                                    {column.header}
                                  </th>
                                )
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {searchTagHistoryList?.tag_log_history?.length >
                              0 &&
                              searchTagHistoryList?.tag_log_history?.map(
                                (item, rowIndex) => (
                                  <tr key={rowIndex}>
                                    <td
                                      style={{
                                        textAlign: "center",
                                      }}
                                    >
                                      {rowIndex + 1}{" "}
                                    </td>
                                    {TagLogHistoryDetailsColumns?.map(
                                      (column, colIndex) => (
                                        <td
                                          key={colIndex}
                                          style={{
                                            textAlign: column?.textAlign,
                                          }}
                                        >
                                          {column.type === "lable" ? (
                                            <Badge
                                              className="badge-sm badge-dot has-bg d-none d-sm-inline-flex"
                                              color={item["colour"]}
                                            >
                                              {item[column.accessor]}
                                            </Badge>
                                          ) : column.isCurrency ? (
                                            <CurrencyDisplay
                                              value={item[column.accessor]}
                                            />
                                          ) : column.decimal_places ? (
                                            parseFloat(
                                              item[column.accessor]
                                            ).toFixed(column.decimal_places)
                                          ) : (
                                            item[column.accessor]
                                          )}
                                        </td>
                                      )
                                    )}
                                  </tr>
                                )
                              )}
                          </tbody>

                          {/* <tfoot>
                            <tr style={{ fontWeight: "bold" }}>
                              <td>Total</td>
                              {TagStoneDetailsColumns?.map((column, index) => (
                                <td
                                  key={index}
                                  style={{ textAlign: column?.textAlign }}
                                >
                                  {column.isTotalReq ? (
                                    column.isCurrency ? (
                                      <CurrencyDisplay
                                        value={calculateTagStoneDetailTotal(
                                          column.accessor
                                        )}
                                      />
                                    ) : (
                                      calculateTagStoneDetailTotal(
                                        column.accessor
                                      )
                                    )
                                  ) : (
                                    ""
                                  )}
                                </td>
                              ))}
                            </tr>
                          </tfoot> */}
                        </table>
                      </div>
                    </TabPane>
                  </TabContent>
                )}
              </div>
            )}

            {/* {searchByOpt === 4 && (
              <div style={{ marginTop: "50px" }}>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#tab"
                      className={classnames({
                        active: supplierActiveTab === "1",
                      })}
                      onClick={(ev) => {
                        ev.preventDefault();
                        supplierToggle("1");
                      }}
                    >
                      <Icon name="grid-alt-fill" />{" "}
                      <span>Purchase Entries</span>
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
            )} */}

            {searchByOpt === 4 && (
              <div style={{ marginTop: "50px" }}>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#tab"
                      className={classnames({
                        active: tagActiveTab === "1",
                      })}
                      onClick={(ev) => {
                        ev.preventDefault();
                        tagToggle("1");
                      }}
                    >
                      <Icon name="grid-alt-fill" /> <span>Basic Details</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#tab"
                      className={classnames({
                        active: tagActiveTab === "2",
                      })}
                      onClick={(ev) => {
                        ev.preventDefault();
                        tagToggle("2");
                      }}
                    >
                      <Icon name="grid-alt-fill" /> <span>Stone Details</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      tag="a"
                      href="#tab"
                      className={classnames({
                        active: tagActiveTab === "3",
                      })}
                      onClick={(ev) => {
                        ev.preventDefault();
                        tagToggle("3");
                      }}
                    >
                      <Icon name="grid-alt-fill" /> <span>Log Details</span>
                    </NavLink>
                  </NavItem>
                </Nav>
                {searchTagHistoryList != null && (
                  <TabContent activeTab={tagActiveTab}>
                    <TabPane tabId="1">
                      <div style={{ padding: "16px" }}>
                        <table style={{ width: "100%" }}>
                          <tbody>
                            <tr>
                              {searchTagHistoryList?.image != null ? (
                                <td
                                  style={{
                                    width: "30%",
                                    textAlign: "center",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "200px",
                                      height: "200px",
                                      backgroundColor: "#f8f9fa",
                                      border: "1px solid #dee2e6",
                                      borderRadius: "5%",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      fontSize: "14px",
                                      color: "#666",
                                      margin: "0 auto",
                                    }}
                                  >
                                    <img
                                      alt={searchTagHistoryList?.image_text}
                                      src={searchTagHistoryList?.image}
                                    />
                                  </div>
                                </td>
                              ) : (
                                <>
                                  <td
                                    style={{
                                      width: "30%",
                                      textAlign: "center",
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "200px",
                                        height: "200px",
                                        backgroundColor: "#f8f9fa",
                                        border: "1px solid #dee2e6",
                                        borderRadius: "5%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        fontSize: "14px",
                                        color: "#666",
                                        margin: "0 auto",
                                      }}
                                    >
                                      {searchTagHistoryList?.image_text}
                                    </div>
                                  </td>
                                </>
                              )}
                              <td
                                style={{
                                  width: "70%",
                                  verticalAlign: "top",
                                }}
                              >
                                <table style={{ width: "100%" }}>
                                  <tbody>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        HUID :
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tag_code}
                                      </td>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        V.A(%):
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tag_purchase_va}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Piece:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tag_pcs}
                                      </td>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        V.A (Wt):
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tag_purchase_va}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Gross Wt:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tag_gwt}
                                      </td>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        MC:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tag_mc_value}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Less Wt:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tag_lwt}
                                      </td>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Dia Wt:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tag_dia_wt}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Nwt Wt:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tag_nwt}
                                      </td>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Stn Wt:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.tag_stn_wt}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Lot No:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.lot_code}
                                      </td>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Supplier:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.supplier_name}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Tag Status:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {
                                          searchTagHistoryList?.tag_current_status
                                        }
                                      </td>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Flat MC:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.flat_mc_value}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Purity:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.purity}
                                      </td>
                                      <td
                                        style={{
                                          fontWeight: "bold",
                                          paddingBottom: "12px",
                                        }}
                                      >
                                        Size:
                                      </td>
                                      <td style={{ paddingBottom: "12px" }}>
                                        {searchTagHistoryList?.size_name}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </TabPane>
                    <TabPane tabId="2">
                      <div
                        className="table-responsive"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                      >
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th
                                style={{
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                S.NO{" "}
                              </th>
                              {TagStoneDetailsColumns?.map((column, index) => (
                                <th
                                  key={index}
                                  style={{
                                    textAlign: column?.textAlign,
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  {column.header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {searchTagHistoryList?.stone_details?.length > 0 &&
                              searchTagHistoryList?.stone_details?.map(
                                (item, rowIndex) => (
                                  <tr key={rowIndex}>
                                    <td>{rowIndex + 1} </td>
                                    {TagStoneDetailsColumns?.map(
                                      (column, colIndex) => (
                                        <td
                                          key={colIndex}
                                          style={{
                                            textAlign: column?.textAlign,
                                          }}
                                        >
                                          {column.type === "lable" ? (
                                            <Badge
                                              className="badge-sm badge-dot has-bg d-none d-sm-inline-flex"
                                              color={item["colour"]}
                                            >
                                              {item[column.accessor]}
                                            </Badge>
                                          ) : column.isCurrency ? (
                                            <CurrencyDisplay
                                              value={item[column.accessor]}
                                            />
                                          ) : column.decimal_places ? (
                                            parseFloat(
                                              item[column.accessor]
                                            ).toFixed(column.decimal_places)
                                          ) : (
                                            item[column.accessor]
                                          )}
                                        </td>
                                      )
                                    )}
                                  </tr>
                                )
                              )}
                          </tbody>

                          <tfoot>
                            <tr style={{ fontWeight: "bold" }}>
                              <th
                                style={{
                                  position: "sticky",
                                  bottom: 0,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                Total
                              </th>
                              {TagStoneDetailsColumns?.map((column, index) => (
                                <td
                                  key={index}
                                  style={{
                                    textAlign: column?.textAlign,
                                    position: "sticky",
                                    bottom: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  {column.isTotalReq ? (
                                    column.isCurrency ? (
                                      <CurrencyDisplay
                                        value={calculateTagStoneDetailTotal(
                                          column.accessor
                                        )}
                                      />
                                    ) : (
                                      calculateTagStoneDetailTotal(
                                        column.accessor
                                      )
                                    )
                                  ) : (
                                    ""
                                  )}
                                </td>
                              ))}
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </TabPane>

                    <TabPane tabId="3">
                      <div
                        className="table-responsive"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                      >
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th
                                style={{
                                  textAlign: "center",
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                S.NO{" "}
                              </th>
                              {TagLogHistoryDetailsColumns?.map(
                                (column, index) => (
                                  <th
                                    key={index}
                                    style={{
                                      textAlign: column?.textAlign,
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 1,
                                      backgroundColor: "#f8f9fa",
                                    }}
                                  >
                                    {column.header}
                                  </th>
                                )
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {searchTagHistoryList?.tag_log_history?.length >
                              0 &&
                              searchTagHistoryList?.tag_log_history?.map(
                                (item, rowIndex) => (
                                  <tr key={rowIndex}>
                                    <td
                                      style={{
                                        textAlign: "center",
                                      }}
                                    >
                                      {rowIndex + 1}{" "}
                                    </td>
                                    {TagLogHistoryDetailsColumns?.map(
                                      (column, colIndex) => (
                                        <td
                                          key={colIndex}
                                          style={{
                                            textAlign: column?.textAlign,
                                          }}
                                        >
                                          {column.type === "lable" ? (
                                            <Badge
                                              className="badge-sm badge-dot has-bg d-none d-sm-inline-flex"
                                              color={item["colour"]}
                                            >
                                              {item[column.accessor]}
                                            </Badge>
                                          ) : column.isCurrency ? (
                                            <CurrencyDisplay
                                              value={item[column.accessor]}
                                            />
                                          ) : column.decimal_places ? (
                                            parseFloat(
                                              item[column.accessor]
                                            ).toFixed(column.decimal_places)
                                          ) : (
                                            item[column.accessor]
                                          )}
                                        </td>
                                      )
                                    )}
                                  </tr>
                                )
                              )}
                          </tbody>
                        </table>
                      </div>
                    </TabPane>
                  </TabContent>
                )}
              </div>
            )}
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default SearchCustomerSupllierHistory;
