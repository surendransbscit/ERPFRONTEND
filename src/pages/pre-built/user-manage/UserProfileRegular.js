import React, { useState, useEffect } from "react";
import Content from "../../../layout/content/Content";
import { Button, Card } from "reactstrap";
import Head from "../../../layout/head/Head";
import DatePicker from "react-datepicker";
import { Modal, ModalBody } from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  RSelect,
  DateInputField,
  NumberInputField,
} from "../../../components/Component";
import Select from "react-select";
import UserProfileAside from "./UserProfileAside";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  getEmployeeDetails,
  updateEmployeeDetails,
} from "../../../redux/thunks/employee";
import moment from "moment";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import {
  getAllCity,
  getAllCountry,
  getAllState,
} from "../../../redux/thunks/retailMaster";
import { CityDropdown, CountryDropdown, StateDropdown } from "../../../components/filters/retailFilters";
import { useCities, useCountries, useStates } from "../../../components/filters/filterHooks";
import { company_country } from "../../../redux/configs";
import { getCompanyById } from "../../../redux/thunks/settings";

const UserProfileRegularPage = () => {
  const companyCountryID = company_country;
  const location = useLocation();
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.profileDetailsReducer
  );

  const { profileDetailsInfo } = useSelector(
    (state) => state.profileDetailsReducer
  );
  const [sm, updateSm] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  const [modalTab, setModalTab] = useState("1");
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({});

  const [firstName, setFirstname] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState(new Date());
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [designation, setDesignation] = useState("");


  const { countries } = useCountries();
  const { states } = useStates();
  const { cities } = useCities();

  // const countryOptions = countryList?.map((obj) => {
  //   const container = {};
  //   container.label = obj.name;
  //   container.value = obj.id_country;
  //   return container;
  // });

  // const stateOptions = stateList?.map((obj) => {
  //   const container = {};
  //   container.label = obj.name;
  //   container.value = obj.id_state;
  //   return container;
  // });

  // const cityOptions = cityList?.map((obj) => {
  //   const container = {};
  //   container.label = obj.name;
  //   container.value = obj.id_city;
  //   return container;
  // });

  useEffect(() => {
    profileDetailsInfo != undefined &&
      (setFirstname(profileDetailsInfo?.firstname),
        setLastName(profileDetailsInfo?.lastname),
        setMobile(profileDetailsInfo?.phone),
        setDob(moment(profileDetailsInfo?.dob).date()),
        setAddress1(profileDetailsInfo?.address1),
        setAddress2(profileDetailsInfo?.address2),
        setAddress3(profileDetailsInfo?.address3),
        setCountry(profileDetailsInfo?.country),
        setState(profileDetailsInfo?.state),
        setCity(profileDetailsInfo?.city),
        setPincode(profileDetailsInfo?.pincode),
        setDesignation(profileDetailsInfo?.designation),
        reset());
  }, [profileDetailsInfo, reset]);

  const submitForm = async () => {
    const adddata = {
      firstname: firstName,
      lastname: lastName,
      mobile,
      dob: moment(dob).format("YYYY-MM-DD"),
      address1,
      address2,
      address3,
      country,
      state,
      city,
      pincode,
    };
    try {
      await dispatch(updateEmployeeDetails(adddata)).unwrap();
      toastsuccess("Profile Updated successfully");
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
    // await dispatch(updateEmployeeDetails(adddata));
    // if (isError === false) {
    //   toastsuccess("Profile Updated successfully");
    //   // navigate(`${process.env.PUBLIC_URL}/`);
    // }
  };

  // close Modal Dialog
  const closeModal = () => {
    setModalTab("1");
    setModal(false);
    reset();
  };

  useEffect(() => {
    dispatch(getCompanyById(companyCountryID));
  }, [dispatch, companyCountryID]);

  useEffect(() => {
    dispatch(getEmployeeDetails());
    dispatch(getAllCountry());
    dispatch(getAllState());
    dispatch(getAllCity());
  }, [dispatch]);

  // function to change the design view under 990 px
  const viewChange = () => {
    if (window.innerWidth < 990) {
      setMobileView(true);
    } else {
      setMobileView(false);
      updateSm(false);
    }
  };

  useEffect(() => {
    viewChange();
    window.addEventListener("load", viewChange);
    window.addEventListener("resize", viewChange);
    document
      .getElementsByClassName("nk-header")[0]
      .addEventListener("click", function () {
        updateSm(false);
      });
    return () => {
      window.removeEventListener("resize", viewChange);
      window.removeEventListener("load", viewChange);
    };
  }, []);

  return (
    <React.Fragment>
      <Head title="User List - Profile"></Head>
      <Content>
        <Card>
          <div className="card-aside-wrap">
            <div
              className={`card-aside card-aside-left user-aside toggle-slide toggle-slide-left toggle-break-lg ${sm ? "content-active" : ""
                }`}
            >
              <UserProfileAside updateSm={updateSm} sm={sm} />
            </div>
            <div className="card-inner card-inner-lg">
              {sm && mobileView && (
                <div
                  className="toggle-overlay"
                  onClick={() => updateSm(!sm)}
                ></div>
              )}
              <BlockHead size="lg">
                <BlockBetween>
                  <BlockHeadContent>
                    <BlockTitle tag="h4">Personal Information</BlockTitle>
                    <BlockDes>
                      <p>
                        Basic info, like your name and address, that you use on
                        Nio Platform.
                      </p>
                    </BlockDes>
                  </BlockHeadContent>
                  <BlockHeadContent className="align-self-start d-lg-none">
                    <Button
                      className={`toggle btn btn-icon btn-trigger mt-n1 ${sm ? "active" : ""
                        }`}
                      onClick={() => updateSm(!sm)}
                    >
                      <Icon name="menu-alt-r"></Icon>
                    </Button>
                  </BlockHeadContent>
                </BlockBetween>
              </BlockHead>

              <Block>
                <div className="nk-data data-list">
                  <div className="data-head">
                    <h6 className="overline-title">Basics</h6>
                  </div>
                  <div className="data-item" onClick={() => setModal(true)}>
                    <div className="data-col">
                      <span className="data-label">Full Name</span>
                      <span className="data-value">
                        {profileDetailsInfo?.name}
                      </span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <Icon name="forward-ios"></Icon>
                      </span>
                    </div>
                  </div>
                  <div className="data-item">
                    <div className="data-col">
                      <span className="data-label">Email</span>
                      <span className="data-value">
                        {profileDetailsInfo?.email}
                      </span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more disable">
                        <Icon name="lock-alt"></Icon>
                      </span>
                    </div>
                  </div>
                </div>
              </Block>

              <Modal
                isOpen={modal}
                className="modal-dialog-centered"
                size="lg"
                toggle={() => setModal(false)}
              >
                <a
                  href="#dropdownitem"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setModal(false);
                  }}
                  className="close"
                >
                  <Icon name="cross-sm"></Icon>
                </a>
                <ModalBody>
                  <div className="p-2">
                    <h5 className="title">Update Profile</h5>
                    <ul className="nk-nav nav nav-tabs">
                      <li className="nav-item">
                        <a
                          className={`nav-link ${modalTab === "1" && "active"}`}
                          onClick={(ev) => {
                            ev.preventDefault();
                            setModalTab("1");
                          }}
                          href="#personal"
                        >
                          Personal
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={`nav-link ${modalTab === "2" && "active"}`}
                          onClick={(ev) => {
                            ev.preventDefault();
                            setModalTab("2");
                          }}
                          href="#address"
                        >
                          Address
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div
                        className={`tab-pane ${modalTab === "1" ? "active" : ""
                          }`}
                        id="personal"
                      >
                        <Row className="gy-4">
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="firstname">
                                First Name
                              </label>
                              <input
                                type="text"
                                id="firstname"
                                className="form-control"
                                name="firstname"
                                onChange={(e) => setFirstname(e.target.value)}
                                value={firstName}
                                placeholder="Enter First name"
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="lastname">
                                Last Name
                              </label>
                              <input
                                type="text"
                                id="lastname"
                                className="form-control"
                                name="lastname"
                                onChange={(e) => setLastName(e.target.value)}
                                value={lastName}
                                placeholder="Enter last name"
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="phone">
                                Phone Number
                              </label>
                              <input
                                type="number"
                                id="phone"
                                className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                                name="phone"
                                onChange={(e) => setMobile(e.target.value)}
                                value={mobile}
                                placeholder="Phone Number"
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="designation">
                                Designation
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                onChange={(e) => setDesignation(e.target.value)}
                                value={designation}
                                readOnly
                                disabled
                              />
                            </div>
                          </Col>
                          {/* <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="dob">
                                Date of Birth
                              </label>
                              <DateInputField
                                maxDate={new Date()}
                                showYearDropdown={true}
                                showMonthDropdown={true}
                                id={"dob"}
                                selected={dob}
                                SetValue={setDob}
                              />
                            </div>
                          </Col> */}

                          <Col size="12">
                            <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                              <li>
                                <Button
                                  color="primary"
                                  size="lg"
                                  onClick={handleSubmit(submitForm)}
                                >
                                  {"Update Profile"}
                                </Button>
                              </li>
                              <li>
                                <a
                                  href="#dropdownitem"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    closeModal();
                                  }}
                                  className="link link-light"
                                >
                                  Cancel
                                </a>
                              </li>
                            </ul>
                          </Col>
                        </Row>
                      </div>
                      <div
                        className={`tab-pane ${modalTab === "2" ? "active" : ""
                          }`}
                        id="address"
                      >
                        <Row className="gy-4">
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="address1">
                                Address Line 1
                              </label>
                              <input
                                type="text"
                                id="address1"
                                name="address1"
                                onChange={(e) => setAddress1(e.target.value)}
                                value={address1}
                                className="form-control"
                              />
                            </div>
                          </Col>
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="address2">
                                Address Line 2
                              </label>
                              <input
                                type="text"
                                id="address2"
                                name="address2"
                                onChange={(e) => setAddress2(e.target.value)}
                                value={address2}
                                className="form-control"
                              />
                            </div>
                          </Col>
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="address3">
                                Address Line 3
                              </label>
                              <input
                                type="text"
                                id="address3"
                                name="address3"
                                onChange={(e) => setAddress3(e.target.value)}
                                value={address3}
                                className="form-control"
                              />
                            </div>
                          </Col>
                          <Col md="4">
                            <div className="form-group">
                              <label
                                className="form-label"
                                htmlFor="address-st"
                              >
                                Country
                              </label>
                              <div className="form-group">
                                <CountryDropdown
                                  register={register}
                                  id={"country"}
                                  countries={countries}
                                  selectedCountry={country}
                                  onCountryChange={(val) => {
                                    setCountry(val);
                                    setState("")
                                    setCity("")
                                  }}
                                  isRequired={true}
                                  clearErrors={clearErrors}
                                  setValue={setValue}
                                  message={errors.country && "Country is Required"}
                                />
                              </div>
                            </div>
                          </Col>
                          <Col md="4">
                            <div className="form-group">
                              <label
                                className="form-label"
                                htmlFor="address-st"
                              >
                                State
                              </label>
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
                            </div>
                          </Col>
                          <Col md="4">
                            <div className="form-group">
                              <label
                                className="form-label"
                                htmlFor="address-ct"
                              >
                                City
                              </label>
                              <div className="form-group">
                                <CityDropdown
                                  register={register}
                                  id={"city"}
                                  cities={cities}
                                  selectedCity={city}
                                  onCityChange={setCity}
                                  isRequired={true}
                                  clearErrors={clearErrors}
                                  setValue={setValue}
                                  message={errors.city && "City is Required"}
                                />
                              </div>
                            </div>
                          </Col>
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="pincode">
                                Pincode
                              </label>
                              <div className="form-group">
                                <NumberInputField
                                  placeholder="Pincode"
                                  id={"pincode"}
                                  value={pincode}
                                  isRequired={true}
                                  register={register}
                                  minLength={6}
                                  maxLength={6}
                                  min={100000}
                                  max={999999}
                                  reqValueError={"This field is required"}
                                  minError={"Minimum value is 100000"}
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
                            </div>
                          </Col>
                          <Col size="12">
                            <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                              <li>
                                <Button
                                  color="primary"
                                  size="lg"
                                  onClick={() => submitForm()}
                                >
                                  Update Address
                                </Button>
                              </li>
                              <li>
                                <a
                                  href="#dropdownitem"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    setModal(false);
                                  }}
                                  className="link link-light"
                                >
                                  Cancel
                                </a>
                              </li>
                            </ul>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </ModalBody>
              </Modal>
            </div>
          </div>
        </Card>
      </Content>
    </React.Fragment>
  );
};

export default UserProfileRegularPage;
