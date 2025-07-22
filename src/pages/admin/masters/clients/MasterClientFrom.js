import React, { useEffect, useState, useContext } from "react";
import Content from "../../../../layout/content/Content";
import Select from "react-select";
import Head from "../../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  CancelButton,
  PreviewCard,
  SaveButton,
  DateInputField,
  Icon,
} from "../../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  toastfunc,
  toastsuccess,
} from "../../../../components/sds-toast-style/toast-style";
import {
  Col,
  NumberInputField,
  Row,
  TextInputField,
} from "../../../../components/Component";
import IsRequired from "../../../../components/erp-required/erp-required";
import {
  createMasterClients,
  getAllMasterClients,
  getMasterClientsById,
  updateClientById,
  updateMasterClientsById,
} from "../../../../redux/thunks/adminMaster";
import moment from "moment/moment";
import {
  getAllArea,
  getAllCity,
  getAllCountry,
  getAllState,
} from "../../../../redux/thunks/retailMaster";
import "../../../../assets/css/sales_form.css";
import {
  //   AreaDropdown,
  //   BranchDropdown,
  CityDropdown,
  CountryDropdown,
  StateDropdown,
} from "../../../../components/filters/retailFilters";
import {
  useAreas,
  useBranches,
  useCities,
  useCountries,
  useStates,
} from "../../../../components/filters/filterHooks";
import {
  EmailInputField,
  GstInputField,
  MobileNumberFieldWithCountryCode,
  PanInputField,
  TitleInputFieldWithDropdown,
} from "../../../../components/form-control/InputGroup";
import ModifiedBreadcrumb from "../../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { Button, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { WordTransformerContext } from "../../../../contexts/WordTransformerContexts";
import { combineReducers } from "redux";
import masterClientReducer from "../../../../redux/reducer/adminMasterReducer";
import { company_name } from "../../../../redux/configs";
import ProfileImageUpload from "../../../../components/input/profile-image/ProfileImageUpload";

const MasterClientForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const navigateLink = location?.state?.navigateLink;
  const createMobNum = location?.state?.createMobNum;
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
    (state) => state.masterClientReducer || {}
  );
  const { masterClientInfo } = useSelector(
    (state) => state.masterClientReducer || {}
  );
  // console.log("masterClientInfo", masterClientInfo);
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [mobile, setMobile] = useState();
  const [gst_number, setGstnumber] = useState();
  const [pan_number, setPannumber] = useState();
  const [email, setEmail] = useState();
  const [mob_code, setmob_code] = useState(0);
  const [address1, setAddress1] = useState("");
  const [line2, setLine2] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [gender, setgender] = useState("1");
  // const [id_area, setIdarea] = useState("");
  // const [branch, SetBranch] = useState();
  const [cusTitle, SetCusTitle] = useState(1);
  const [mobileLength, setMobileLength] = useState(10);
  const [company_name, setCompanyName] = useState("");
  const { countries } = useCountries();
  const { states } = useStates();
  const { cities } = useCities();
  const [cus_img, setcus_img] = useState();

  // const { areas } = useAreas();
  // const { branches } = useBranches();
  const [activeTab, setActiveTab] = useState("1");
  const { transformWord } = useContext(WordTransformerContext);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  let titleOptions = [
    {
      label: "Mr",
      value: 1,
    },
    {
      label: "Mrs",
      value: 2,
    },
    {
      label: "Ms",
      value: 3,
    },
    {
      label: "Misc",
      value: 4,
    },
  ];

  useEffect(() => {
    dispatch(getAllCountry());
    dispatch(getAllState());
    dispatch(getAllCity());
    //   dispatch(getAllArea());
    //   dispatch(getAccessBranches());
  }, [dispatch]);

  const postData = async () => {
    const adddata = {
      title: cusTitle,
      company_name,
      mob_code,
      last_name: lastname || null,
      first_name: firstname,
      mobile,
      email: email || null,
      gst_number: gst_number || null,
      pan_number: pan_number || null,
      id_country: country,
      id_state: state,
      id_city: city,
      address1: address1,
      address2: line2 || null,
      order_images: cus_img ? cus_img : null,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/adminmaster/clients/`,
        adddata,
        {
          headers: {
            Authorization: `Token ${secureLocalStorage.getItem("pref")?.token}`,
          },
        }
      );

      toastsuccess("Customer added successfully");

      const result = response?.data;

      if (navigateLink) {
        const passData = [
          {
            label: `${result?.firstname}-${result?.mobile}`,
            value: result?.id_customer,
            firstname: result?.firstname,
          },
        ];

        navigate(
          { pathname: `${process.env.PUBLIC_URL}${navigateLink}` },
          {
            state: {
              add: true,
              customerId: result?.id_customer,
              customerSearchValue: passData,
            },
          }
        );
      } else {
        navigate(`${process.env.PUBLIC_URL}/admin/master/masterclient/list`);
      }
    } catch (error) {
      toastfunc(error?.response?.data?.message || "Failed to add customer");
      console.error(error);
    }
  };

  useEffect(() => {
    if (createMobNum) {
      setMobile(createMobNum);
      setValue("mobile", createMobNum);
    }
  }, [createMobNum]);

  useEffect(() => {
    id !== undefined && dispatch(getMasterClientsById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (countries?.rows && country !== "" && country !== null) {
      const selectedCountryDetails = countries?.rows?.find(
        (val) => val.id_country === country
      );
      setMobileLength(selectedCountryDetails?.mob_no_len);
      setmob_code(selectedCountryDetails?.mob_code);
    }
  }, [dispatch, country]);

  useEffect(() => {
    {
      title == "4"
        ? setgender("3")
        : title == "2"
        ? setgender("2")
        : title == "3"
        ? setgender("2")
        : setgender("1");
    }
  }, [title]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    masterClientInfo != null &&
      (setCompanyName(masterClientInfo?.company_name),
      setEmail(masterClientInfo?.email),
      setmob_code(masterClientInfo?.mob_code),
      SetCusTitle(masterClientInfo?.title),
      setLastname(masterClientInfo?.last_name),
      setFirstname(masterClientInfo?.first_name),
      setMobile(masterClientInfo?.mobile),
      setGstnumber(masterClientInfo?.gst_number),
      setPannumber(masterClientInfo?.pan_number),
      setAddress1(masterClientInfo?.address1),
      setLine2(masterClientInfo?.address2),
      setState(masterClientInfo?.id_state),
      setCity(masterClientInfo?.id_city),
      setCountry(masterClientInfo?.id_country),
      // setIdarea(masterClientInfo?.customer_address?.area),
      // SetBranch(masterClientInfo?.id_branch),
      setcus_img(masterClientInfo?.client_img),
      reset());
  }, [masterClientInfo, reset]);

  const putData = async () => {
    const adddata = {
      title: cusTitle,
      mob_code,
      company_name: company_name ? company_name : null,
      last_name: lastname ? lastname : null,
      first_name: firstname ? firstname : null,
      mobile,
      email: email ? email : null,
      gst_number: gst_number != "" ? gst_number : null,
      pan_number: pan_number != "" ? pan_number : null,
      // id_branch: branch,
      id_country: country,
      id_state: state,
      id_city: city,
      address1: address1,
      address2: line2 != "" ? line2 : null,
      order_images: cus_img ? cus_img : null,
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    try {
      await dispatch(updateMasterClientsById(reduxData)).unwrap();
      toastsuccess("Customer Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/admin/master/masterclient/list`);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/admin/master/masterclient/list`);
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
      <Head title={title ? title : "Customer"} />
      <Content>
        <PreviewCard className="h-100 form-control-sm">
          <Row md={12}>
            <Col md={4}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md="4"></Col>
            <Col md={4}>
              {id !== undefined && (
                <div className="form-group action_button">
                  <CancelButton
                    disabled={issubmitting}
                    color="danger"
                    size="md"
                    onClick={() =>
                      navigate(
                        `${process.env.PUBLIC_URL}/admin/master/masterclient/list`
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
                    {issubmitting ? "Saving(Ctrl+s)" : "Save(Ctrl+s)"}
                  </SaveButton>
                </div>
              )}
              {add !== undefined && (
              <div className="form-group action_button">
                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/admin/master/masterclient/list`
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
                  {issubmitting ? "Saving[Ctrl+s]" : "Save[Ctrl+s]"}
                </SaveButton>
              </div>
              )}
            </Col>
          </Row>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <div className="">
                <Row lg={12} className={"form-control-sm"}>
                  <Col md={4}>
                    <div className="custom-grid">
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label
                              className="form-label"
                              htmlFor="company_name"
                            >
                              Company Name
                              <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <TextInputField
                              register={register}
                              isRequired={true}
                              id={"company_name"}
                              placeholder="Company Name"
                              value={company_name}
                              SetValue={(value) => {
                                setCompanyName(transformWord(value));
                                clearErrors("company_name");
                              }}
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="site-name">
                              Name
                              <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <TitleInputFieldWithDropdown
                            register={register}
                            placeholder={"First Name"}
                            id={"firstname"}
                            optionId={"cusTitle"}
                            name={"cusTitle"}
                            value={firstname}
                            type={"text"}
                            isRequired={true}
                            min={0}
                            text_width={110}
                            options={titleOptions}
                            setValue={setValue}
                            onDropDownChange={SetCusTitle}
                            selectedOption={cusTitle}
                            SetValue={(value) => {
                              setFirstname(value);
                              clearErrors("firstname");
                            }}
                            minError={"Name is required"}
                            requiredMessage={"Name is Required"}
                          />
                          {errors?.firstname && (
                            <span className="text-danger">
                              {errors?.firstname.message}
                            </span>
                          )}
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="lastname">
                              L.Name
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <TextInputField
                              register={register}
                              isRequired={false}
                              id={"lastname"}
                              placeholder="Last Name"
                              value={lastname}
                              SetValue={(value) => {
                                setLastname(transformWord(value));
                                clearErrors("lastname");
                              }}
                              handleKeyDown={(evt) => {
                                const invalidChars = /[^a-zA-Z\s]/; // Allows only letters and spaces
                                if (
                                  invalidChars.test(evt.key) ||
                                  evt.key === "Shift"
                                ) {
                                  evt.preventDefault();
                                }
                              }}
                              message={
                                errors.lastname && " last name is Required"
                              }
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="mobile">
                              Contact No1
                              <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <MobileNumberFieldWithCountryCode
                              disabled={masterClientInfo != undefined}
                              optionId={"mob_code"}
                              optionName={"mob_code"}
                              placeholder="Mobile Number"
                              id={"mobile"}
                              value={mobile}
                              text_width={110}
                              setValue={setValue}
                              options={countries}
                              onDropDownChange={setmob_code}
                              selectedOption={mob_code}
                              isRequired={masterClientInfo == undefined}
                              register={register}
                              max={mobileLength}
                              min={mobileLength}
                              reqValueError={"This field is required"}
                              maxError={"Max Length is" + mobileLength}
                              minError={"Min Length is " + mobileLength}
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
                            <label className="form-label" htmlFor="email">
                              Email
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <EmailInputField
                              register={register}
                              isRequired={false}
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
                              <span className="text-danger">
                                {errors?.email.message}
                              </span>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="address1">
                              Address1
                              <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <TextInputField
                              register={register}
                              isRequired={true}
                              id={"address1"}
                              placeholder="Address 1"
                              value={address1}
                              SetValue={(value) => {
                                setAddress1(value);
                                clearErrors("address1");
                              }}
                              message={errors.address1 && "address is Required"}
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
                            <label className="form-label" htmlFor="line2">
                              Address2
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
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="gst_number">
                              GST
                              <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <GstInputField
                              register={register}
                              isRequired={true}
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
                    </div>
                  </Col>

                  <Col md={4}>
                    <div className="custom-grid">
                      <Row className="form-group row g-4">
                        <Col md="3"></Col>
                        <Col md="8">
                          <ProfileImageUpload
                            id={"cus_img"}
                            image={cus_img}
                            SetImage={setcus_img}
                          />
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </div>
            </TabPane>
          </TabContent>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default MasterClientForm;
