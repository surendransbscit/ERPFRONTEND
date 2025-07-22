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
import { set, useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
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
import {
  createBranch,
  getBranchById,
  updateBranchById,
} from "../../../redux/thunks/settings";
import {
  getAllCity,
  getAllCountry,
  getAllState,
} from "../../../redux/thunks/retailMaster";
import {
  useCities,
  useCompanies,
  useCountries,
  useStates,
} from "../../../components/filters/filterHooks";
import {
  CityDropdown,
  CompanyDropdown,
  CountryDropdown,
  StateDropdown,
} from "../../../components/filters/retailFilters";
import {
  DropdownInputField,
  EmailInputField,
  GstInputField,
} from "../../../components/form-control/InputGroup";
import { Button, Input } from "reactstrap";
import { ZoomImage } from "../../../components/form-control/ZoomImage";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";

const BranchForm = () => {
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
    (state) => state.branchReducer
  );

  let branchTypeOptions = [
    {
      label: "Store",
      value: 1,
    },
    {
      label: "Customer Service",
      value: 2,
    },
  ];

  let showToAllOptions = [
    {
      label: "Own",
      value: 1,
    },
    {
      label: "All",
      value: 2,
    },
  ];
  const { branchInfo } = useSelector((state) => state.branchReducer);

  const [id_company, setIdCompany] = useState("");
  const [showToAll, setShowToAll] = useState(1);
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [shortName, setShortName] = useState("");
  const [email, setEmail] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState("");
  const [cusromerCare, setCusromerCare] = useState("");
  const [pincode, setPincode] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [fbLink, setFbLink] = useState("");
  const [instaLink, setInstaLink] = useState("");
  const [sort, setSort] = useState("");
  const [otpVerifMobileNo, setotpVerifMobileNo] = useState("");
  const [branchType, setBranchType] = useState(1);
  const [isHo, setIsHo] = useState(true);
  const [note, setNote] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [logo, setlogo] = useState();
  const [mobCode, setMobCode] = useState(0);

  const { countries } = useCountries();
  const { states } = useStates();
  const { cities } = useCities();
  const { companies } = useCompanies();

  const convert64 = async (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e);
    reader.onload = () => {
      setlogo(reader.result);
    };
  };

  const isBase64 = (str) => {
    try {
      return str.startsWith("data:image");
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    if (id !== undefined) {
      dispatch(getBranchById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (branchInfo != undefined) {
      setIdCompany(branchInfo?.id_company),
        setShowToAll(branchInfo?.show_to_all),
        setName(branchInfo?.name),
        setActive(branchInfo?.active),
        setShortName(branchInfo?.short_name),
        setEmail(branchInfo?.email),
        setAddress1(branchInfo?.address1),
        setAddress2(branchInfo?.address2),
        setCountry(branchInfo?.country),
        setState(branchInfo?.state),
        setCity(branchInfo?.city),
        setMobile(branchInfo?.mobile),
        setCusromerCare(branchInfo?.cusromercare),
        setPhone(branchInfo?.phone),
        setPincode(branchInfo?.pincode),
        setMapUrl(branchInfo?.map_url),
        setFbLink(branchInfo?.fb_link),
        setInstaLink(branchInfo?.insta_link),
        setSort(branchInfo?.sort),
        setotpVerifMobileNo(branchInfo?.otp_verif_mobileno),
        setBranchType(branchInfo?.branch_type),
        setIsHo(branchInfo?.is_ho),
        setNote(branchInfo?.note),
        setGstNumber(branchInfo?.gst_number),
        setlogo(branchInfo?.logo),
        setMobCode(branchInfo?.mob_code),
        reset();
    }
  }, [branchInfo, reset]);

  const form_submit = async (data, actionType) => {
    if (id == undefined) {
      create_branch(data, actionType);
    } else {
      update_branch(data, actionType);
    }
  };

  const postData = async () => {
    const adddata = {
      id_company,
      show_to_all: showToAll,
      name,
      mob_code: mobCode,
      warehouse: null,
      expo_warehouse: null,
      active,
      short_name: shortName,
      email,
      address1,
      address2,
      country,
      state,
      city,
      phone,
      mobile,
      cusromercare: cusromerCare,
      pincode,
      metal_rate_type: 0,
      map_url: mapUrl,
      fb_link: fbLink,
      insta_link: instaLink,
      sort,
      otp_verif_mobileno: otpVerifMobileNo,
      branch_type: branchType,
      is_ho: isHo,
      note,
      gst_number: gstNumber,
      logo: logo ? logo : null,
    };
    try {
      await dispatch(createBranch(adddata)).unwrap();
      toastsuccess("Branch Added successfully");
      navigate(`${process.env.PUBLIC_URL}/master/branch/list`);
    } catch (error) {
      console.error(error);
    }
    // await dispatch(createBranch(adddata));
    // if (isError == false) {
    //   toastsuccess("Branch Added successfully");
    //   navigate(`${process.env.PUBLIC_URL}/master/branch/list`);
    // }
  };

  const putData = async () => {
    const adddata = {
      id_company,
      show_to_all: showToAll,
      name,
      mob_code: mobCode,
      warehouse: null,
      expo_warehouse: null,
      active,
      short_name: shortName,
      email,
      address1,
      address2,
      country,
      state,
      city,
      phone,
      mobile,
      cusromercare: cusromerCare,
      pincode,
      metal_rate_type: 0,
      map_url: mapUrl,
      fb_link: fbLink,
      insta_link: instaLink,
      sort,
      otp_verif_mobileno: otpVerifMobileNo,
      branch_type: branchType,
      is_ho: isHo,
      note,
      gst_number: gstNumber,
      logo: logo ? logo : null,
    };
    const update_data = { id: id, putData: adddata };
    try {
      await dispatch(updateBranchById(update_data)).unwrap();
      toastsuccess("Branch Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/branch/list`);
    } catch (error) {
      console.error(error);
    }
    // await dispatch(updateBranchById(update_data));
    // if (isError == false) {
    //   toastsuccess("Branch Edited successfully");
    //   navigate(`${process.env.PUBLIC_URL}/master/branch/list`);
    // }
  };

  const create_branch = async (data, actionType) => {
    await dispatch(createBranch(data));
    if (isError == false) {
      toastsuccess(name + " Added successfully");
      if (actionType == "saveAndNew") {
        reset_form();
      } else {
        navigate(`${process.env.PUBLIC_URL}/master/branch/list`);
      }
    }
  };

  const update_branch = async (data, actionType) => {
    const update_data = { id: id, putData: data };
    await dispatch(updateBranchById(update_data));
    if (!isError) {
      toastsuccess(name + " Updated successfully");
      if (actionType === "saveAndNew") {
        reset_form();
      } else if (actionType === "saveAndClose") {
        navigate(`${process.env.PUBLIC_URL}/master/branch/list`);
      }
    } else {
      reset_form();
    }
  };

  const reset_form = async () => {
    reset();
    setIdCompany("");
    setShowToAll(1);
    setName("");
    setActive(true);
    setShortName("");
    setEmail("");
    setAddress1("");
    setAddress2("");
    setCountry("");
    setState("");
    setCity("");
    setMobile("");
    setCusromerCare("");
    setPhone("");
    setPincode("");
    setMapUrl("");
    setFbLink("");
    setInstaLink("");
    setSort("");
    setotpVerifMobileNo("");
    setBranchType("");
    setIsHo("");
    setNote("");
    setGstNumber("");
    setlogo("");
    setMobCode("");
  };

  useEffect(() => {
    dispatch(getAllCountry());
    dispatch(getAllState());
    dispatch(getAllCity());
  }, [dispatch]);

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
      <Head title={title ? title : "Branch"} />
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
                  onClick={handleSubmit(postData)}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s] "}
                </SaveButton>
                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(`${process.env.PUBLIC_URL}/master/branch/list`)
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
                    navigate(`${process.env.PUBLIC_URL}/master/branch/list`)
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>

          <div className="custom-grid">
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Company
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group ">
                  <CompanyDropdown
                    register={register}
                    id={"id_company"}
                    companies={companies}
                    selectedCompany={id_company}
                    onCompanyChange={setIdCompany}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.id_company && "Company is Required"}
                  ></CompanyDropdown>
                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Type
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group ">
                  <DropdownInputField
                    register={register}
                    isRequired={true}
                    id={"branchType"}
                    placeholder="Select Branch Type"
                    optionLabel="Select Branch Type"
                    value={branchType}
                    SetValue={setBranchType}
                    selectOptions={branchTypeOptions}
                  />
                  {errors?.branchType && (
                    <span className="text-danger">
                      <Icon className={"sm"} name="alert-circle" />
                      {"This field is required"}
                    </span>
                  )}
                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Name
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"name"}
                    placeholder="Branch Name"
                    value={name}
                    SetValue={(value) => {
                      setName(value);
                      clearErrors("name");
                    }}
                    message={errors.name && "name is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="shortName">
                    Code
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"shortName"}
                    placeholder="Short Name"
                    value={shortName}
                    SetValue={(value) => {
                      setShortName(value);
                      clearErrors("shortName");
                    }}
                    message={errors.shortName && "shortName is Required"}
                  />
                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <EmailInputField
                    register={register}
                    isRequired={true}
                    id={"email"}
                    placeholder="Email Address"
                    value={email}
                    code={setEmail}
                    SetValue={(value) => {
                      setEmail(value);
                      clearErrors("email");
                    }}
                  />
                  {errors?.email && (
                    <span className="text-danger">{errors?.email.message}</span>
                  )}
                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="add1">
                    Address 1<IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={true}
                    id={"address1"}
                    placeholder="Address Line 1"
                    value={address1}
                    SetValue={(value) => {
                      setAddress1(value);
                      clearErrors("address1");
                    }}
                    message={errors.address1 && "field is Required"}
                  />
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="add2">
                    Address 2
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    id={"address2"}
                    placeholder="Address Line 2"
                    value={address2}
                    SetValue={setAddress2}
                  />
                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Country
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <CountryDropdown
                    register={register}
                    id={"id_country"}
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
                    message={errors.id_country && "Country is Required"}
                  ></CountryDropdown>
                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="state">
                    State
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <StateDropdown
                    register={register}
                    id={"id_state"}
                    states={states}
                    selectedState={state}
                    onStateChange={setState}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.id_state && "State is Required"}
                  ></StateDropdown>
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="city">
                    City
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
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
                  ></CityDropdown>
                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="pincode">
                    Pincode
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
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

              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">
                    Phone
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <NumberInputField
                    placeholder="Phone Number"
                    id={"phone"}
                    value={phone}
                    isRequired={false}
                    register={register}
                    minLength={10}
                    maxLength={10}
                    min={1000000000}
                    max={9999999999}
                    reqValueError={"This field is required"}
                    minError={"Minimum value is 10"}
                    minLengthError={"Minimum length is 10 digits"}
                    maxLengthError={"Maximum length is 10 digits"}
                    maxError={"Max Length is 10"}
                    SetValue={(value) => {
                      setPhone(value);
                      clearErrors("phone");
                    }}
                  // message={errors.phone && "phone no is Required"}
                  />
                  {errors.phone && (
                    <span className="text-danger">{errors.phone.message}</span>
                  )}
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="mobile">
                    Mobile
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <NumberInputField
                    placeholder="Mobile Number"
                    id={"mobile"}
                    value={mobile}
                    isRequired={true}
                    register={register}
                    minLength={10}
                    maxLength={10}
                    min={1000000000}
                    max={9999999999}
                    reqValueError={"This field is required"}
                    minError={"Minimum value is 10"}
                    minLengthError={"Minimum length is 10 digits"}
                    maxLengthError={"Maximum length is 10 digits"}
                    maxError={"Max Length is 10"}
                    SetValue={(value) => {
                      setMobile(value);
                      clearErrors("mobile");
                    }}
                    message={errors.mobile && errors.mobile.message}
                  />
                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="cusromerCare">
                    C.Care
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <NumberInputField
                    placeholder="Customer Care"
                    id={"cusromerCare"}
                    value={cusromerCare}
                    isRequired={false}
                    register={register}
                    minLength={10}
                    maxLength={10}
                    min={1000000000}
                    max={9999999999}
                    reqValueError={"This field is required"}
                    minError={"Minimum value is 10"}
                    minLengthError={"Minimum length is 10 digits"}
                    maxLengthError={"Maximum length is 10 digits"}
                    maxError={"Max Length is 10"}
                    SetValue={(value) => {
                      setCusromerCare(value);
                      clearErrors("cusromerCare");
                    }}
                    message={errors.cusromerCare && errors.cusromerCare.message}
                  />

                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="fbLink">
                    Fb Link
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={false}
                    id={"fbLink"}
                    placeholder="map URL"
                    value={fbLink}
                    SetValue={(value) => {
                      setFbLink(value);
                      clearErrors("fbLink");
                    }}
                    message={errors.fbLink && "fbLink is Required"}
                  />
                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="instaLink">
                    Insta Link
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={false}
                    id={"instaLink"}
                    placeholder="Insta Link"
                    value={instaLink}
                    SetValue={(value) => {
                      setInstaLink(value);
                      clearErrors("instaLink");
                    }}
                    message={errors.instaLink && "instaLink is Required"}
                  />
                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="sort">
                    Sort
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <NumberInputField
                    placeholder="Sort"
                    id={"sort"}
                    value={sort}
                    isRequired={true}
                    register={register}
                    max={100000}
                    reqValueError={"This field is required"}
                    maxError={"Max Length is 100000"}
                    SetValue={(value) => {
                      setSort(value);
                      clearErrors("sort");
                    }}
                  // message={errors.sort && "sort no is Required"}
                  />
                  {errors.sort && (
                    <span className="text-danger">{errors.sort.message}</span>
                  )}
                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="otpVerifMobileNo">
                    OTP.Mobile
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <NumberInputField
                    placeholder="OTP Verify Mobile No"
                    id={"otpVerifMobileNo"}
                    value={otpVerifMobileNo}
                    isRequired={false}
                    register={register}
                    minLength={10}
                    maxLength={10}
                    min={1000000000}
                    max={9999999999}
                    reqValueError={"This field is required"}
                    minError={"Minimum value is 10"}
                    minLengthError={"Minimum length is 10 digits"}
                    maxLengthError={"Maximum length is 10 digits"}
                    maxError={"Max Length is 10"}
                    SetValue={(value) => {
                      setotpVerifMobileNo(value);
                      clearErrors("otpVerifMobileNo");
                    }}
                    message={errors.otpVerifMobileNo && errors.otpVerifMobileNo.message}
                  />

                </div>
              </Col>
            </Row>

            <Row md={12} className="form-group row g-4">
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="gst_number">
                    GST
                    <IsRequired />
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <GstInputField
                    register={register}
                    isRequired={true}
                    id={"gstNumber"}
                    placeholder="GST Number"
                    value={gstNumber}
                    code={setGstNumber}
                    SetValue={(value) => {
                      setGstNumber(value);
                      clearErrors("gstNumber");
                    }}
                  />
                  {errors.gstNumber && (
                    <span className="text-danger">
                      {errors.gstNumber.message}
                    </span>
                  )}
                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="isHo">
                    Head Off
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <SwitchInputField
                  register={register}
                  id={"isHo"}
                  checked={isHo}
                  SetValue={setIsHo}
                  name={"isHo"}
                />
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="active">
                    Active
                  </label>
                </div>
              </Col>
              <Col lg="3">
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
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="logo">
                    Logo
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-control-wrap">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">Upload</span>
                    </div>
                    <div className="form-file">
                      <Input
                        type="file"
                        accept="image/*"
                        id="logo"
                        onChange={(e) => convert64(e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>
              </Col>

              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="note">
                    Note
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <TextInputField
                    register={register}
                    isRequired={false}
                    id={"note"}
                    placeholder="Note"
                    value={note}
                    SetValue={(value) => {
                      setNote(value);
                      clearErrors("note");
                    }}
                    message={errors.note && "note is Required"}
                  />
                </div>
              </Col>
              <Col lg="1">
                <div className="form-group">
                  <label className="form-label" htmlFor="site-name">
                    Show to All
                  </label>
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group ">
                  <DropdownInputField
                    register={register}
                    isRequired={true}
                    id={"showToAll"}
                    placeholder="Select Show to all"
                    optionLabel="Select Show to all"
                    value={showToAll}
                    SetValue={setShowToAll}
                    selectOptions={showToAllOptions}
                  />
                  {errors?.showToAll && (
                    <span className="text-danger">
                      <Icon className={"sm"} name="alert-circle" />
                      {"This field is required"}
                    </span>
                  )}
                </div>
              </Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              <Col lg="2"></Col>
            </Row>
            <Row md={12} className="form-group row g-4">
              {logo == undefined ||
                (logo !== null && (
                  <>
                    <Col lg="4">
                      <ZoomImage
                        alt="not found"
                        height={"300px"}
                        width={"600px"}
                        src={isBase64(logo) ? logo : logo + "?" + String()}
                      />
                      <br />
                      <Button
                        className="mt-1 bg-red-500 text-white"
                        size="xs"
                        onClick={() => setlogo(undefined)}
                      >
                        Remove
                      </Button>
                    </Col>
                  </>
                ))}
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default BranchForm;
