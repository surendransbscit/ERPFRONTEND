/* eslint-disable no-unused-expressions */
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
  createSupplier,
  getAllCity,
  getAllCountry,
  getAllState,
  getSupplierById,
  updateSupplierById,
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
import {
  CityDropdown,
  CountryDropdown,
  StateDropdown,
} from "../../../components/filters/retailFilters";
import {
  useCities,
  useCountries,
  useStates,
  useMetals,
} from "../../../components/filters/filterHooks";
import {
  GstInputField,
  MobileNumberFieldWithCountryCode,
  PanInputField,
} from "../../../components/form-control/InputGroup";
import ProfileImageUpload from "../../../components/input/profile-image/ProfileImageUpload";
import {
  Button,
  Label,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import { v4 as uuid } from "uuid";
import Select from "react-select";
import { useHotkeys } from "react-hotkeys-hook";
import MetalDropdownMulti from "../../../components/common/dropdown/MetalDropdownMulti";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
const KarigarForm = () => {
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
    (state) => state.karigarReducer
  );
  const { karigarInfo } = useSelector((state) => state.karigarReducer);
  const { metals } = useMetals();
  let vendorTypeOptions = [
    {
      label: "Supplier",
      value: 1,
    },
    {
      label: "Smith",
      value: 2,
    },
    {
      label: "Manufacture",
      value: 3,
    },
    {
      label: "Complementary Supplier",
      value: 4,
    },
    {
      label: "Halmarking Center",
      value: 5,
    },
     {
      label: "Local Vendor",
      value: 6,
    },
  ];

  const accountTypes = [
    {
      label: "Savings",
      value: 1,
    },
    {
      label: "Current Account",
      value: 2,
    },
  ];

  const [isVendor, setIsVendor] = useState(1);
  const [shortCode, setShortCode] = useState();
  const [supplierName, setSupplierName] = useState();
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [line3, setLine3] = useState("");
  const [pincode, setPincode] = useState("");
  const [cashOpeningBal, setCashOpeningBal] = useState("0");
  const [metalOpeningBal, setMetalOpeningBal] = useState("0");
  const [silverOpeningBal, setSilverOpeningBal] = useState("0");
  const [gst_number, setGstnumber] = useState();
  const [pan_number, setPannumber] = useState();
  const [noOfDays, setNoOfDays] = useState();
  const [mob_code, setmob_code] = useState(0);
  const [mobile, setMobile] = useState();
  const [phone, setPhone] = useState();
  const [img, setImg] = useState();
  const [active, setActive] = useState(true);
  const [metal, setMetal] = useState([]);

  const { countries } = useCountries();
  const { states } = useStates();
  const { cities } = useCities();

  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [account_details, setaccount_details] = useState([]);
  const [staff_details, setstaff_details] = useState([]);

  const addAccountDetails = () => {
    setaccount_details([
      ...account_details,
      {
        bank_name: "",
        account_branch: "",
        account_number: "",
        holder_name: "",
        acc_type: {
          label: "Savings",
          value: 1,
        },
        upi: "",
        id: uuid(),
      },
    ]);
  };

  const addStaffDetails = () => {
    setstaff_details([
      ...staff_details,
      {
        staff_name: "",
        staff_mobile: "",
        id_staff_details: uuid(),
      },
    ]);
  };

  const { transformWord } = useContext(WordTransformerContext);

  useEffect(() => {
    if (account_details?.length === 0) {
      addAccountDetails();
    }
  }, [account_details]);

  useEffect(() => {
    if (staff_details?.length === 0) {
      addStaffDetails();
    }
  }, [staff_details]);

  const editAccountDetails = ({ name, val, ids }) => {
    setaccount_details((prevState) =>
      prevState?.map((obj) => {
        if (obj?.id == ids) {
          setValue(`${name + obj.id}`, val);
          return { ...obj, [name]: val };
        }
        return obj;
      })
    );
  };

  const deleteAccountDetails = (ids) => {
    setaccount_details((prevState) =>
      prevState?.filter((obj) => obj.id != ids)
    );
  };

  const editStaffDetails = ({ name, val, ids }) => {
    setstaff_details((prevState) =>
      prevState?.map((obj) => {
        if (obj?.id_staff_details == ids) {
          setValue(`${name + obj.id_staff_details}`, val);
          return { ...obj, [name]: val };
        }
        return obj;
      })
    );
  };

  const deleteStaffDetails = (ids) => {
    setstaff_details((prevState) =>
      prevState?.filter((obj) => obj.id_staff_details != ids)
    );
  };

  const postData = async () => {
    const supplier_account_details = account_details?.map((obj) => {
      const container = {};
      container.acc_type = obj.acc_type?.value;
      container.account_number = obj.account_number;
      container.bank_name = obj.bank_name;
      container.account_branch = obj.account_branch;
      container.holder_name = obj.holder_name;
      container.upi = obj.upi;
      return container;
    });
    // const supplier_staff_details = staff_details?.map((obj) => {
    //   const container = {};
    //   container.staff_name = obj.staff_name;
    //   container.staff_mobile = obj.staff_mobile;

    //   return container;
    // });
    const adddata = {
      is_vendor: isVendor,
      supplier_name: supplierName,
      short_code: shortCode,
      id_country: country,
      id_state: state,
      id_city: city,
      address1: line1,
      address2: line2,
      address3: line3,
      id_metal: metal,
      pincode,
      gst_number: gst_number ? gst_number : null,
      pan_number: pan_number ? pan_number : null,
      no_of_days_for_due: noOfDays ? noOfDays : null,
      phone_no: phone ? phone : null,
      mobile_no: mobile,
      mob_code,
      img: img ? img : null,
      status: active,
      supplier_account_details,
      staff_details,
      csh_op_blc: 0,
      metal_op_blc: 0,
      silver_op_blc: 0,
    };
    try {
      await dispatch(createSupplier(adddata)).unwrap();
      toastsuccess("Karigar Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/karigar/list`);
    } catch (error) {
      console.error(error);
    }
  };

  const postAndCreateNew = async () => {
    const supplier_account_details = account_details?.map((obj) => {
      const container = {};
      container.acc_type = obj.acc_type?.value;
      container.account_number = obj.account_number;
      container.bank_name = obj.bank_name;
      container.account_branch = obj.account_branch;
      container.holder_name = obj.holder_name;
      container.upi = obj.upi;
      return container;
    });
    const adddata = {
      is_vendor: isVendor,
      supplier_name: supplierName,
      short_code: shortCode,
      id_country: country,
      id_state: state,
      id_city: city,
      address1: line1,
      address2: line2,
      address3: line3,
      pincode,
      gst_number: gst_number ? gst_number : null,
      pan_number: pan_number ? pan_number : null,
      no_of_days_for_due: noOfDays ? noOfDays : null,
      phone_no: phone ? phone : null,
      mobile_no: mobile,
      mob_code,
      img: img ? img : null,
      status: active,
      is_active: active,
      supplier_account_details,
      staff_details,
      csh_op_blc: 0,
      metal_op_blc: 0,
      silver_op_blc: 0,
      id_metal: metal,
    };

    await dispatch(createSupplier(adddata));
    if (isError === false) {
      toastsuccess("karigar Added successfully");
      setIsVendor(1);
      setShortCode("");
      setSupplierName("");
      setCountry("");
      setState("");
      setCity("");
      setPincode("");
      setGstnumber("");
      setPannumber("");
      setNoOfDays("");
      setLine1("");
      setLine2("");
      setLine3("");
      setMobile("");
      setPhone("");
      setActive(true);
      setaccount_details([]);
      setstaff_details([]);
      // setCashOpeningBal(0);
      // setMetalOpeningBal(0);
      // setSilverOpeningBal("");
      setMetal("");
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getSupplierById(id));
  }, [dispatch, id]);

  useEffect(() => {
    karigarInfo != null &&
      (setIsVendor(karigarInfo?.is_vendor),
      setShortCode(karigarInfo?.short_code),
      setSupplierName(karigarInfo?.supplier_name),
      setCountry(karigarInfo?.id_country),
      setState(karigarInfo?.id_state),
      setCity(karigarInfo?.id_city),
      setLine1(karigarInfo?.address1),
      setLine2(karigarInfo?.address2),
      setLine3(karigarInfo?.address3),
      setPincode(karigarInfo?.pincode),
      setGstnumber(karigarInfo?.gst_number),
      setPannumber(karigarInfo?.pan_number),
      setNoOfDays(karigarInfo?.no_of_days_for_due),
      setmob_code(karigarInfo?.mob_code),
      setMobile(karigarInfo?.mobile_no),
      setPhone(karigarInfo?.phone_no),
      setImg(karigarInfo?.image),
      setActive(karigarInfo?.status),
      // setCashOpeningBal(karigarInfo?.csh_op_blc),
      // setMetalOpeningBal(karigarInfo?.metal_op_blc),
      // setSilverOpeningBal(karigarInfo?.silver_op_blc),
      setaccount_details(karigarInfo?.account_details),
      setstaff_details(karigarInfo?.staff_details),
      setMetal(karigarInfo?.id_metal));
    reset();
  }, [karigarInfo, reset]);

  const putData = async () => {
    const supplier_account_details = account_details?.map((obj) => {
      const container = {};
      container.acc_type = obj.acc_type?.value;
      container.account_number = obj.account_number;
      container.bank_name = obj.bank_name;
      container.account_branch = obj.account_branch;
      container.holder_name = obj.holder_name;
      container.upi = obj.upi;
      return container;
    });
    const adddata = {
      is_vendor: isVendor,
      supplier_name: supplierName,
      short_code: shortCode,
      id_country: country,
      id_state: state,
      id_city: city,
      address1: line1,
      address2: line2,
      address3: line3,
      pincode,
      gst_number: gst_number ? gst_number : null,
      pan_number: pan_number ? pan_number : null,
      no_of_days_for_due: noOfDays ? noOfDays : null,
      phone_no: phone ? phone : null,
      mobile_no: mobile,
      mob_code,
      img: img ? img : null,
      status: active,
      is_active: active,
      supplier_account_details,
      staff_details,
      csh_op_blc: 0,
      metal_op_blc: 0,
      silver_op_blc: 0,
      id_metal: metal,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    try {
      await dispatch(updateSupplierById(reduxData));
      toastsuccess("Karigar Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/karigar/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/karigar/list`);
    }
  }, [add, id, navigate]);

  useEffect(() => {
    dispatch(getAllCountry());
    dispatch(getAllState());
    dispatch(getAllCity());
  }, [dispatch]);

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
      <Head title={title ? title : "Karigar"} />
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
                  {issubmitting ? "Saving" : "Save & New "}
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
                    navigate(`${process.env.PUBLIC_URL}/master/karigar/list`)
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
                    navigate(`${process.env.PUBLIC_URL}/master/karigar/list`)
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>

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
                <Icon name="grid-alt-fill" /> <span>General</span>
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
                <Icon name="user-circle-fill" /> <span>Account Details</span>
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
                <Icon name="user-circle" /> <span>Staff Details</span>
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <div className="">
                <Row lg={12} className={"form-control-sm"}>
                  <Col md={4}>
                    <div className="custom-grid">
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="cus_type">
                              Supplier Type
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <div className="form-control-wrap">
                              <div className="form-control-select">
                                <select
                                  className="form-control form-select"
                                  id="isVendor"
                                  {...register("isVendor", {
                                    required: true,
                                  })}
                                  value={isVendor}
                                  onChange={(e) => {
                                    setIsVendor(e.target.value);
                                  }}
                                  placeholder="Vendor Type"
                                >
                                  <option
                                    label="Select Vendor Type"
                                    value=""
                                  ></option>
                                  {vendorTypeOptions?.map((item, index) => (
                                    <option key={index} value={item?.value}>
                                      {item.label}
                                    </option>
                                  ))}
                                </select>
                                {errors?.isVendor && (
                                  <span className="invalid">
                                    This field is required
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col lg="4">
                          <div className="form-group">
                            <label
                              className="form-label"
                              htmlFor="supplierName"
                            >
                              Name <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <div className="form-group">
                            <TextInputField
                              register={register}
                              isRequired={true}
                              id={"supplierName"}
                              placeholder="Supplier Name"
                              value={supplierName}
                              SetValue={(value) => {
                                setSupplierName(transformWord(value));
                                clearErrors("supplierName");
                              }}
                              message={
                                errors.supplierName &&
                                "Supplier name is required"
                              }
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col lg="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="shortCode">
                              Code <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <div className="form-group">
                            <TextInputField
                              placeholder="Short Code"
                              id={"shortCode"}
                              value={shortCode}
                              isRequired={true}
                              register={register}
                              reqValueError={"This field is required"}
                              SetValue={(value) => {
                                setShortCode(value);
                                clearErrors("shortCode");
                              }}
                              message={
                                errors.shortCode && "short code is required"
                              }
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="mobile">
                              Mobile
                              <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <MobileNumberFieldWithCountryCode
                              optionId={"mob_code"}
                              optionName={"mob_code"}
                              placeholder="Mobile Number"
                              id={"mobile"}
                              value={mobile}
                              text_width={110}
                              // option_width={10}
                              setValue={setValue}
                              options={countries}
                              onDropDownChange={setmob_code}
                              selectedOption={mob_code}
                              isRequired={karigarInfo == undefined}
                              register={register}
                              max={10}
                              min={10}
                              reqValueError={"This field is required"}
                              maxError={"Max Length is 10"}
                              minError={"Min Length is 10"}
                              SetValue={(value) => {
                                setMobile(value);
                                clearErrors("mobile");
                              }}
                            />
                            {errors.mobile && (
                              <span className="text-danger">
                                {errors.mobile.message}
                              </span>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="mobile">
                              Phone no
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <MobileNumberFieldWithCountryCode
                              optionId={"mob_code"}
                              optionName={"mob_code"}
                              placeholder="Phone Number"
                              id={"phone"}
                              value={phone}
                              text_width={110}
                              // option_width={10}
                              setValue={setValue}
                              options={countries}
                              onDropDownChange={setmob_code}
                              selectedOption={mob_code}
                              isRequired={false}
                              register={register}
                              max={10}
                              min={10}
                              reqValueError={"This field is required"}
                              maxError={"Max Length is 10"}
                              minError={"Min Length is 10"}
                              SetValue={(value) => {
                                setPhone(value);
                                clearErrors("phone");
                              }}
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="site-name">
                              Country
                              <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <CountryDropdown
                              register={register}
                              id={"id_country"}
                              countries={countries}
                              selectedCountry={country}
                              onCountryChange={(val) => {
                                setCountry(val);
                                setState("");
                                setCity("");
                              }}
                              isRequired={true}
                              clearErrors={clearErrors}
                              setValue={setValue}
                              message={
                                errors.id_country && "Country is Required"
                              }
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="state">
                              State
                              <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <StateDropdown
                              register={register}
                              id={"state"}
                              states={states}
                              selectedState={state}
                              onStateChange={setState}
                              isRequired={true}
                              clearErrors={clearErrors}
                              setValue={setValue}
                              message={errors.state && "State is Required"}
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col lg="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="city">
                              City
                              <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <CityDropdown
                              register={register}
                              id={"id_city"}
                              cities={cities}
                              selectedCity={city}
                              onCityChange={setCity}
                              isRequired={true}
                              clearErrors={clearErrors}
                              setValue={setValue}
                              message={errors.id_city && "City is Required"}
                            />
                          </div>
                        </Col>
                      </Row>

                      {/* <Row className="form-group row g-4">
                        <Col lg="4">
                          <div className="form-group">
                            <label
                              className="form-label"
                              htmlFor="cashOpeningBal"
                            >
                              Cash Opening Balance
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <div className="form-group">
                            <NumberInputField
                              placeholder="Cash Opening Balance"
                              id={"cashOpeningBal"}
                              value={cashOpeningBal}
                              isRequired={false}
                              register={register}
                              SetValue={(value) => {
                                setCashOpeningBal(value);
                                clearErrors("cashOpeningBal");
                              }}
                              // message={errors.cashOpeningBal && "Cash Opening Balance is Required"}
                            />
                          </div>
                        </Col>
                      </Row> */}

                      <Row className="form-group row g-4">
                        <Col lg="4">
                          <div className="form-group">
                            <label
                              className="form-label"
                              htmlFor="cashOpeningBal"
                            >
                              Metal
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <div className="form-group">
                            <MetalDropdownMulti
                              id={`metal`}
                              register={register}
                              setValue={setValue}
                              clearErrors={clearErrors}
                              selectedMetal={metal}
                              metals={metals}
                              onMetalChange={setMetal}
                              isRequired={false}
                              // message={errors?.[`metal`] && "Metal is Required"}
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="custom-grid">
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="line1">
                              Address 1
                              <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <TextInputField
                              register={register}
                              isRequired={true}
                              id={"line1"}
                              placeholder="Address 1"
                              value={line1}
                              SetValue={(value) => {
                                setLine1(value);
                                clearErrors("line1");
                              }}
                              message={errors.line1 && "address is Required"}
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="line2">
                              Address 2
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <TextInputField
                              register={register}
                              id={"line2"}
                              placeholder="Address 2"
                              value={line2}
                              SetValue={setLine2}
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="line3">
                              Address 3
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <TextInputField
                              register={register}
                              id={"line3"}
                              placeholder="Address 3"
                              value={line3}
                              SetValue={setLine3}
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="pincode">
                              Pincode
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <NumberInputField
                              placeholder="Pincode"
                              id={"pincode"}
                              value={pincode}
                              isRequired={false}
                              register={register}
                              minLength={6}
                              maxLength={6}
                              min={100000}
                              max={999999}
                              reqValueError={"This field is required"}
                              minError={"Minimum value is 6"}
                              minLengthError={"Minimum length is 6 digits"}
                              maxLengthError={"Maximum length is 6 digits"}
                              maxError={"Max Length is 6"}
                              SetValue={(value) => {
                                setPincode(value);
                                clearErrors("pincode");
                              }}
                              // message={errors.pincode && "pincode is Required"}
                            />
                            {errors.pincode && (
                              <span className="text-danger">
                                {errors.pincode.message}
                              </span>
                            )}
                          </div>
                        </Col>
                      </Row>

                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="gst_number">
                              GST
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <GstInputField
                              register={register}
                              isRequired={false}
                              id={"gst_number"}
                              placeholder="GST Number"
                              value={gst_number}
                              SetValue={(value) => {
                                setGstnumber(value);
                                clearErrors("gst_number");
                              }}
                            />
                            {errors?.gst_number && (
                              <span className="text-danger">
                                {errors?.gst_number.message}
                              </span>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="pan_number">
                              Pan
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <PanInputField
                              register={register}
                              isRequired={false}
                              id={"pan_number"}
                              placeholder="Pan Number"
                              value={pan_number}
                              SetValue={(value) => {
                                setPannumber(value);
                                clearErrors("pan_number");
                              }}
                            />
                            {errors?.pan_number && (
                              <span className="text-danger">
                                {errors?.pan_number.message}
                              </span>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="noOfDays">
                              No Days for Payment
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <NumberInputField
                              placeholder="No.of Days for Payment"
                              id={"noOfDays"}
                              value={noOfDays}
                              isRequired={false}
                              register={register}
                              SetValue={(value) => {
                                setNoOfDays(value);
                                clearErrors("noOfDays");
                              }}
                            />
                          </div>
                        </Col>
                      </Row>

                      <Row className="form-group row g-4">
                        <Col lg="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="active">
                              Status
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

                      {/* <Row className="form-group row g-4">
                        <Col lg="4">
                          <div className="form-group">
                            <label
                              className="form-label"
                              htmlFor="metalOpeningBal"
                            >
                              Metal Opening Balance
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <div className="form-group">
                            <NumberInputField
                              placeholder="Metal Opening Balance"
                              id={"metalOpeningBal"}
                              value={metalOpeningBal}
                              isRequired={false}
                              register={register}
                              SetValue={(value) => {
                                setMetalOpeningBal(value);
                                clearErrors("metalOpeningBal");
                              }}
                              // message={errors.metalOpeningBal && "Metal Opening Balance is Required"}
                            />
                          </div>
                        </Col>
                      </Row> */}

                      {/* <Row className="form-group row g-4">
                        <Col lg="4">
                          <div className="form-group">
                            <label
                              className="form-label"
                              htmlFor="silverOpeningBal"
                            >
                              Silver Opening Balance
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <div className="form-group">
                            <NumberInputField
                              placeholder="Silver Opening Balance"
                              id={"silverOpeningBal"}
                              value={silverOpeningBal}
                              isRequired={false}
                              register={register}
                              SetValue={(value) => {
                                setSilverOpeningBal(value);
                                clearErrors("silverOpeningBal");
                              }}
                              // message={errors.silverOpeningBal && "Silver Opening Balance is Required"}
                            />
                          </div>
                        </Col>
                      </Row> */}
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="custom-grid">
                      <Row className="form-group row g-4">
                        <Col md="3">
                          <Label>Image</Label>
                        </Col>
                        <Col md="8">
                          <ProfileImageUpload
                            id={"img"}
                            image={img}
                            SetImage={setImg}
                          />
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </div>
            </TabPane>
          </TabContent>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="2">
              <Row md={12} className="form-group row g-4">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>S.NO</th>
                        <th>Bank Name</th>
                        <th>Branch</th>
                        <th>Acc Number</th>
                        <th>Acc Name</th>
                        <th>Acc Type</th>
                        <th>UPI</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {account_details?.map((obj, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <input
                                name="bank_name"
                                className="form-control form-control-sm"
                                type="text"
                                {...register(`bank_name${index}`)}
                                placeholder="Bank Name"
                                value={transformWord(obj?.bank_name)}
                                onChange={(e) =>
                                  editAccountDetails({
                                    ids: obj?.id,
                                    name: "bank_name",
                                    val: e.target.value,
                                  })
                                }
                              />
                              {errors?.[`bank_name` + `${String(index)}`] && (
                                <span className="text-danger">
                                  <Icon className={"sm"} name="alert-circle" />
                                  {
                                    errors?.[`bank_name` + `${String(index)}`]
                                      .message
                                  }
                                </span>
                              )}
                            </td>

                            <td>
                              <input
                                name="account_branch"
                                {...register(`account_branch${index}`)}
                                className="form-control form-control-sm"
                                type="text"
                                placeholder="Branch"
                                value={transformWord(obj?.account_branch)}
                                onChange={(e) =>
                                  editAccountDetails({
                                    ids: obj?.id,
                                    name: "account_branch",
                                    val: e.target.value,
                                  })
                                }
                              />
                              {errors?.[
                                `account_branch` + `${String(index)}`
                              ] && (
                                <span className="text-danger">
                                  <Icon className={"sm"} name="alert-circle" />
                                  {
                                    errors?.[
                                      `account_branch` + `${String(index)}`
                                    ].message
                                  }
                                </span>
                              )}
                            </td>

                            <td>
                              <input
                                {...register(`account_number${index}`)}
                                name="account_number"
                                className="form-control form-control-sm"
                                type="text"
                                placeholder="Account Number"
                                value={obj?.account_number}
                                onChange={(e) =>
                                  editAccountDetails({
                                    ids: obj?.id,
                                    name: "account_number",
                                    val: e.target.value,
                                  })
                                }
                              />
                              {errors?.[
                                `account_number` + `${String(index)}`
                              ] && (
                                <span className="text-danger">
                                  <Icon className={"sm"} name="alert-circle" />
                                  {
                                    errors?.[
                                      `account_number` + `${String(index)}`
                                    ].message
                                  }
                                </span>
                              )}
                            </td>

                            <td>
                              <input
                                {...register(`holder_name${index}`)}
                                name="holder_name"
                                className="form-control form-control-sm"
                                type="text"
                                placeholder="Account Name"
                                value={transformWord(obj?.holder_name)}
                                onChange={(e) =>
                                  editAccountDetails({
                                    ids: obj?.id,
                                    name: "holder_name",
                                    val: e.target.value,
                                  })
                                }
                              />
                              {errors?.[`holder_name` + `${String(index)}`] && (
                                <span className="text-danger">
                                  <Icon className={"sm"} name="alert-circle" />
                                  {
                                    errors?.[`holder_name` + `${String(index)}`]
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
                                  {/* <Select
                                      value={obj?.acc_type}
                                      onChange={(value) =>
                                        editAccountDetails({
                                          ids: obj?.id_account_details,
                                          name: "acc_type",
                                          val: value,
                                        })
                                      }
                                      options={accountTypes}
                                      placeholder="Select Account Type"
                                      id={`acc_type${obj?.id_account_details}`}
                                      menuPortalTarget={document.body}
                                      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }) }}
                                    />
                                    <input
                                      type="hidden"
                                      value={obj?.acc_type}
                                      {...register(`acc_type${obj?.id_account_details}`)}
                                    /> */}

                                  <Select
                                    value={obj?.acc_type}
                                    onChange={(e) => {
                                      editAccountDetails({
                                        ids: obj?.id,
                                        name: "acc_type",
                                        val: e,
                                      });
                                    }}
                                    options={accountTypes}
                                    placeholder="Select Account type"
                                    id={`acc_type${index}`}
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
                                    value={obj?.acc_type}
                                    {...register(`acc_type${index}`)}
                                  />
                                </div>
                              </div>
                            </td>

                            <td>
                              <input
                                name="upi"
                                {...register(`upi${index}`)}
                                className="form-control form-control-sm"
                                type="text"
                                placeholder="UPI"
                                value={obj?.upi}
                                onChange={(e) =>
                                  editAccountDetails({
                                    ids: obj?.id,
                                    name: "upi",
                                    val: e.target.value,
                                  })
                                }
                              />
                              {errors?.[`upi` + `${String(index)}`] && (
                                <span className="text-danger">
                                  <Icon className={"sm"} name="alert-circle" />
                                  {errors?.[`upi` + `${String(index)}`].message}
                                </span>
                              )}
                            </td>

                            <td>
                              {index == account_details?.length - 1 && (
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="btn-icon btn-white btn-dim"
                                  onClick={() => addAccountDetails()}
                                >
                                  <Icon name="plus" />
                                </Button>
                              )}
                              <Button
                                color="primary"
                                size="sm"
                                className="btn-icon btn-white btn-dim"
                                onClick={() => deleteAccountDetails(obj?.id)}
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
            </TabPane>
          </TabContent>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="3">
              <div className="">
                <Row md={12} className="form-group row g-4">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>S.NO</th>
                          <th>Staff Name</th>
                          <th>Mobile</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staff_details?.map((obj, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <input
                                  {...register(`staff_name${index}`)}
                                  name="staff_name"
                                  className="form-control form-control-sm"
                                  type="text"
                                  placeholder="Staff Name"
                                  value={transformWord(obj?.staff_name)}
                                  onChange={(e) =>
                                    editStaffDetails({
                                      ids: obj?.id_staff_details,
                                      name: "staff_name",
                                      val: e.target.value,
                                    })
                                  }
                                />
                                {errors?.[
                                  `staff_name` + `${String(index)}`
                                ] && (
                                  <span className="text-danger">
                                    <Icon
                                      className={"sm"}
                                      name="alert-circle"
                                    />
                                    {
                                      errors?.[
                                        `staff_name` + `${String(index)}`
                                      ].message
                                    }
                                  </span>
                                )}
                              </td>
                              <td>
                                <input
                                  {...register(`staff_mobile${index}`)}
                                  name="staff_mobile"
                                  className="form-control form-control-sm"
                                  type="text"
                                  placeholder="Mobile Number"
                                  value={obj?.staff_mobile}
                                  onChange={(e) =>
                                    editStaffDetails({
                                      ids: obj?.id_staff_details,
                                      name: "staff_mobile",
                                      val: e.target.value,
                                    })
                                  }
                                />
                                {errors?.[
                                  `staff_mobile` + `${String(index)}`
                                ] && (
                                  <span className="text-danger">
                                    <Icon
                                      className={"sm"}
                                      name="alert-circle"
                                    />
                                    {
                                      errors?.[
                                        `staff_mobile` + `${String(index)}`
                                      ].message
                                    }
                                  </span>
                                )}
                              </td>
                              <td>
                                {index == staff_details?.length - 1 && (
                                  <Button
                                    color="primary"
                                    size="sm"
                                    className="btn-icon btn-white btn-dim"
                                    onClick={() => addStaffDetails()}
                                  >
                                    <Icon name="plus" />
                                  </Button>
                                )}
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="btn-icon btn-white btn-dim"
                                  onClick={() =>
                                    deleteStaffDetails(obj?.id_staff_details)
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
              </div>
            </TabPane>
          </TabContent>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default KarigarForm;
