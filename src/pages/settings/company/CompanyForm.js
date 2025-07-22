/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  BlockTitle,
  CancelButton,
  DropdownInputField,
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
  NumberInputField,
  Row,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import {
  createCompany,
  getCompanyById,
  updateCompanyById,
} from "../../../redux/thunks/settings";
import {
  getAllCity,
  getAllCountry,
  getAllState,
} from "../../../redux/thunks/retailMaster";
import {
  CityDropdown,
  CountryDropdown,
  StateDropdown,
} from "../../../components/filters/retailFilters";
import {
  useCities,
  useCountries,
  useStates,
} from "../../../components/filters/filterHooks";
import {
  EmailInputField,
  GstInputField,
  MobileNumberFieldWithCountryCode,
} from "../../../components/form-control/InputGroup";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import ProfileImageUpload from "../../../components/input/profile-image/ProfileImageUpload";
import { useHotkeys } from "react-hotkeys-hook";

const CompanyForm = () => {
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
    (state) => state.companyReducer
  );
  const { companyInfo } = useSelector((state) => state.companyReducer);

  const [name, setName] = useState("");
  const [short_code, setShortCode] = useState("");
  const [comp_name_in_sms, setcompNameInSms] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [mobile, setMobile] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [bank_acc_number, setBankAccNumber] = useState("");
  const [bank_name, setBankName] = useState("");
  const [bank_acc_name, setBankAccName] = useState("");
  const [bank_branch, setBankBranch] = useState("");
  const [bank_ifsc, setBankIfsc] = useState("");
  const [gst_number, setGstNumber] = useState("");
  const [cin_number, setCinNumber] = useState("");
  const [whatsapp_no, setWhatsappNo] = useState("");
  const [mobCode, setMobCode] = useState(0);
  const [com_img, setcom_img] = useState();

  const postData = async () => {
    const adddata = {
      company_name: name,
      short_code,
      comp_name_in_sms,
      address1,
      address2,
      country,
      state,
      city,
      pincode,
      mobile,
      phone,
      email,
      website,
      bank_acc_number,
      bank_name,
      bank_acc_name,
      bank_branch,
      bank_ifsc,
      gst_number,
      cin_number,
      whatsapp_no,
      image: com_img ? com_img : null,
      mob_code: mobCode,
    };
    try {
      await dispatch(createCompany(adddata)).unwrap();
      toastsuccess("company Added successfully");
      navigate(`${process.env.PUBLIC_URL}/settings/company/list`);
    } catch (error) {
      console.error(error);
    }

    // await dispatch(createCompany(adddata));
    // if (isError === false) {
    //   toastsuccess("company Added successfully");
    //   navigate(`${process.env.PUBLIC_URL}/settings/company/list`);
    // }
  };

  const { countries } = useCountries();
  const { states } = useStates();
  const { cities } = useCities();

  useEffect(() => {
    dispatch(getAllCountry());
    dispatch(getAllState());
    dispatch(getAllCity());
  }, [dispatch]);

  useEffect(() => {
    id !== undefined && dispatch(getCompanyById(id));
  }, [dispatch, id]);

  useEffect(() => {
    companyInfo != undefined &&
      (setName(companyInfo?.company_name),
        setMobCode(companyInfo?.mob_code),
        setShortCode(companyInfo?.short_code),
        setcompNameInSms(companyInfo?.comp_name_in_sms),
        setAddress1(companyInfo?.address1),
        setAddress2(companyInfo?.address2),
        setCountry(companyInfo?.id_country?.value),
        setState(companyInfo?.state),
        setCity(companyInfo?.city),
        setPincode(companyInfo?.pincode),
        setMobile(companyInfo?.mobile),
        setPhone(companyInfo?.phone),
        setEmail(companyInfo?.email),
        setWebsite(companyInfo?.website),
        setBankAccNumber(companyInfo?.bank_acc_number),
        setBankName(companyInfo?.bank_name),
        setBankAccName(companyInfo?.bank_acc_name),
        setBankBranch(companyInfo?.bank_branch),
        setBankIfsc(companyInfo?.bank_ifsc),
        setGstNumber(companyInfo?.gst_number),
        setCinNumber(companyInfo?.cin_number),
        setWhatsappNo(companyInfo?.whatsapp_no),
        setcom_img(companyInfo?.image),
        reset());
  }, [companyInfo, reset]);

  const putData = async () => {
    const adddata = {
      company_name: name,
      short_code,
      comp_name_in_sms,
      address1,
      address2,
      country,
      state,
      city,
      pincode,
      mobile,
      phone,
      email,
      website,
      bank_acc_number,
      bank_name,
      bank_acc_name,
      bank_branch,
      bank_ifsc,
      gst_number,
      cin_number,
      whatsapp_no,
      image: com_img ? com_img : null,
      mob_code: mobCode,


    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    try {
      await dispatch(updateCompanyById(reduxData)).unwrap();
      toastsuccess("Company Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/settings/company/list`);
    } catch (error) {
      console.error(error);
    }
    // await dispatch(updateCompanyById(reduxData));
    // if (isError === false) {
    //   toastsuccess("Company Edited successfully");
    //   navigate(`${process.env.PUBLIC_URL}/settings/company/list`);
    // }
  };

  // useEffect(() => {
  //   if (add === undefined && id === undefined) {
  //     navigate(`${process.env.PUBLIC_URL}/settings/company/list`);
  //   }
  // }, [add, id, navigate]);

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
      <Head title={title ? title : "Company"} />
      <Content>
        <PreviewCard className="h-100 form-control-sm">
          <Row md={12}>
            <Col md={4}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md="4"></Col>
            <Col md={4}>
              {add !== undefined && (
                <div className="form-group action_button">
                  <CancelButton
                    disabled={issubmitting}
                    color="danger"
                    size="md"
                    onClick={() =>
                      navigate(
                        `${process.env.PUBLIC_URL}/settings/company/list`
                      )
                    }
                  >
                    Cancel
                  </CancelButton>
                  <SaveButton
                    disabled={issubmitting}
                    size="md"
                    color="primary"
                    onClick={handleSubmit(postData)}
                  >
                    {issubmitting ? "Saving" : "Save[Ctrl+s] "}
                  </SaveButton>
                </div>

              )}

              {id !== undefined && (

                <div className="form-group action_button">
                  <CancelButton
                    disabled={issubmitting}
                    color="danger"
                    size="md"
                    onClick={() =>
                      navigate(
                        `${process.env.PUBLIC_URL}/settings/company/list`
                      )
                    }
                  >
                    Cancel
                  </CancelButton>

                  <SaveButton
                    disabled={issubmitting}
                    size="md"
                    color="primary"
                    onClick={handleSubmit(putData)}
                  >
                    {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                  </SaveButton>
                </div>

              )}
            </Col>
          </Row>
          <div className="">
            <Row lg={12} className={"form-control-sm"}>
              <Col md={4}>
                <div className="custom-grid">
                  <Row className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="cname">
                          C.Name <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={true}
                          id={"name"}
                          placeholder="Company Name"
                          value={name}
                          SetValue={(value) => {
                            setName(value);
                            clearErrors("name");
                          }}
                          message={errors.name && " company name is Required"}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="shortcode">
                          SMS Name<IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={true}
                          id={"comp_name_in_sms"}
                          placeholder="Name in SMS"
                          value={comp_name_in_sms}
                          SetValue={(value) => {
                            setcompNameInSms(value);
                            clearErrors("comp_name_in_sms");
                          }}
                          message={errors.comp_name_in_sms && "field is Required"}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="add2">
                          Address 2
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
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
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="state">
                          State <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
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
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="pincode">
                          Pincode <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
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
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="phoneno">
                          Phone No
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <NumberInputField
                          placeholder="Whats app Number"
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
                          message={errors.phone && errors.phone.message}
                        />

                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="email">
                          Email
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
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
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="website">
                          GST
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <GstInputField
                          register={register}
                          isRequired={true}
                          id={"gst_number"}
                          placeholder="GST Number"
                          value={gst_number}
                          code={setGstNumber}
                          SetValue={(value) => {
                            setGstNumber(value);
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
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="bank_acc_name">
                          Acc.Name
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={false}
                          id={"bank_acc_name"}
                          placeholder="Bank Account Name"
                          value={bank_acc_name}
                          SetValue={(value) => {
                            setBankAccName(value);
                            clearErrors("bank_acc_name");
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="bank_branch">
                          Bank Branch
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={false}
                          id={"bank_branch"}
                          placeholder="Bank Branch"
                          value={bank_branch}
                          SetValue={(value) => {
                            setBankBranch(value);
                            clearErrors("bank_branch");
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="cin_number">
                          CIN
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={false}
                          id={"cin_number"}
                          placeholder="CIN Number"
                          value={cin_number}
                          SetValue={(value) => {
                            setCinNumber(value);
                            clearErrors("cin_number");
                          }}
                          message={errors.cin_number && "field is Required"}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>

              <Col md={4}>
                <div className="custom-grid">
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="shortcode">
                          Short Code <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={true}
                          id={"short_code"}
                          placeholder="Short Code"
                          value={short_code}
                          SetValue={(value) => {
                            setShortCode(value);
                            clearErrors("short_code");
                          }}
                          message={errors.short_code && "short code is Required"}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="add1">
                          Address 1<IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
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
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="country">
                          Country <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
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
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="city">
                          City <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
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
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="mobileno">
                          Mobile No <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        {/* <NumberInputField
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
                        /> */}
                        <MobileNumberFieldWithCountryCode
                          // disabled={customerInfo != undefined}
                          optionId={"mobCode"}
                          optionName={"mobCode"}
                          placeholder="Mobile Number"
                          id={"mobile"}
                          value={mobile}
                          text_width={100}
                          // option_width={10}
                          setValue={setValue}
                          options={countries}
                          onDropDownChange={setMobCode}
                          selectedOption={mobCode}
                          // isRequired={customerInfo == undefined}
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
                          message={errors.mobile && errors.mobile.message}
                        />
                        {errors?.mobile && (
                          <span className="text-danger">{errors.mobile.message}</span>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="whatsappno">
                          Whatsapp.No
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <NumberInputField
                          placeholder="Whats app Number"
                          id={"whatsapp_no"}
                          value={whatsapp_no}
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
                            setWhatsappNo(value);
                            clearErrors("whatsapp_no");
                          }}
                          message={errors.whatsapp_no && errors.whatsapp_no.message}
                        />

                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="website">
                          Website
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          id={"website"}
                          placeholder="Website"
                          value={website}
                          SetValue={setWebsite}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="bank_acc_number">
                          Acc.Number
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={false}
                          id={"bank_acc_number"}
                          placeholder="Bank Account Number"
                          value={bank_acc_number}
                          SetValue={(value) => {
                            setBankAccNumber(value);
                            clearErrors("bank_acc_number");
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="bank_name">
                          Bank Name
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={false}
                          id={"bank_name"}
                          placeholder="Bank Name"
                          value={bank_name}
                          SetValue={(value) => {
                            setBankName(value);
                            clearErrors("bank_name");
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="bank_ifsc">
                          Bank IFSC
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={false}
                          id={"bank_ifsc"}
                          placeholder="Bank IFSC"
                          value={bank_ifsc}
                          SetValue={(value) => {
                            setBankIfsc(value);
                            clearErrors("bank_ifsc");
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>

              <Col md={4}>
                <div className="custom-grid">
                  <Row className="form-group row g-4">
                    <Col md="3">
                      <div className="form-group">
                        <label className="form-label" htmlFor="image">
                          Image
                        </label>
                      </div>
                    </Col>
                    <Col md="8">
                      <ProfileImageUpload id={"com_img"} image={com_img} SetImage={setcom_img} />
                    </Col>
                  </Row>
                </div>
              </Col>

            </Row>
          </div>


        </PreviewCard>
      </Content>
    </React.Fragment >
  );
};

export default CompanyForm;
