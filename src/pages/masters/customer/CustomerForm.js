import React, { useEffect, useState, useContext, useRef } from "react";
import Content from "../../../layout/content/Content";
import Select from "react-select";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  CancelButton,
  PreviewCard,
  SaveButton,
  DateInputField,
  Icon,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  toastfunc,
  toastsuccess,
} from "../../../components/sds-toast-style/toast-style";
import {
  Col,
  NumberInputField,
  Row,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import {
  getCustomerById,
  updateCustomerById,
} from "../../../redux/thunks/customer";
import moment from "moment/moment";
import {
  getAllArea,
  getAllCity,
  getAllCountry,
  getAllState,
} from "../../../redux/thunks/retailMaster";
import "../../../assets/css/sales_form.css";
import {
  AreaDropdown,
  BranchDropdown,
  CityDropdown,
  CountryDropdown,
  ProfessionDropdown,
  ReligionDropdown,
  StateDropdown,
} from "../../../components/filters/retailFilters";
import {
  useAreas,
  useBranches,
  useCities,
  useCountries,
  useProfessions,
  useRelationTypes,
  useReligions,
  useStates,
} from "../../../components/filters/filterHooks";
import {
  AadharInputField,
  EmailInputField,
  GstInputField,
  MobileNumberFieldWithCountryCode,
  PanInputField,
  TitleInputFieldWithDropdown,
} from "../../../components/form-control/InputGroup";
import { getAccessBranches } from "../../../redux/thunks/coreComponent";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import ProfileImageUpload from "../../../components/input/profile-image/ProfileImageUpload";
import { useHotkeys } from "react-hotkeys-hook";
import ShortCutKeys from "../../../components/shortCutKeys/ShortCutKeys";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { Button, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import { v4 as uuid } from "uuid";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

const CustomerForm = () => {
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
  const { isLoading: issubmitting, createCustomerData } = useSelector(
    (state) => state.customerReducer
  );
  const {
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);

  const { userInfo } = useSelector((state) => state.authUserReducer);

  const capitalizeWords = (e) => {
    return e
      .toLowerCase()
      .split(" ")
      .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
      .join(" ");
  };

  const fnameFieldRef = useRef(null)
  const { customerInfo } = useSelector((state) => state.customerReducer);
  const [cusTitle, SetCusTitle] = useState(1);
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [dateofbirth, setDateofbirth] = useState();
  const [date_of_wed, setDateofwed] = useState();
  const [gender, setgender] = useState("1");
  const [mobile, setMobile] = useState();
  const [comments, setComments] = useState("");
  const [active, setActive] = useState(true);
  const [date_add, setdate_add] = useState(new Date());
  const [date_upd, setdate_upd] = useState(new Date());
  const [notification, setNotification] = useState(true);
  const [gst_number, setGstnumber] = useState();
  const [pan_number, setPannumber] = useState();
  const [aadhar, setAadhar] = useState();
  const [religion, setReligion] = useState("");
  // const [kyc_status, setkyc_status] = useState(false);
  const [is_vip, setIsvip] = useState(false);
  const [cus_type, setcus_type] = useState("1");
  const [send_promo_sms, setSendpromosms] = useState(false);
  const [cus_img, setcus_img] = useState();
  const [email, setEmail] = useState();
  const [mob_code, setmob_code] = useState(0);
  const [pincode, setPincode] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [line3, setLine3] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [id_area, setIdarea] = useState("");
  const [branch, SetBranch] = useState();
  const [profession, SetProfession] = useState();
  const [profileType, setProfileType] = useState(1);
  const [is_retailer, setis_retailer] = useState("0");
  const [phone, setPhone] = useState();
  const [retailer_type, setretailer_type] = useState("1");
  const [mobileLength, setMobileLength] = useState(10);

  const { countries } = useCountries();
  const { states } = useStates();
  const { cities } = useCities();
  const { areas } = useAreas();
  const { branches } = useBranches();
  const { relationTypes } = useRelationTypes();
  const { professions } = useProfessions();
  const { religions } = useReligions();

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

  let profileTypeOptions = [
    {
      label: "Gold",
      value: 1,
    },
    {
      label: "Platinum",
      value: 2,
    },
    {
      label: "Diamond",
      value: 3,
    },
  ];

  useEffect(() => {
    dispatch(getAllCountry());
    dispatch(getAllState());
    dispatch(getAllCity());
    dispatch(getAllArea());
    dispatch(getAccessBranches());
  }, [dispatch]);

  const [family_details, setfamily_details] = useState([]);

  const addFamilyDetails = () => {
    setfamily_details([
      ...family_details,
      {
        fam_name: "",
        relation_type: "",
        profession: "",
        mobile: undefined,
        fam_dob: undefined,
        fam_wed_dob: undefined,
        id_family_details: uuid(),
      },
    ]);
  };

  useEffect(() => {
    if (family_details?.length === 0) {
      addFamilyDetails();
    }
  }, [family_details]);

  useEffect(() => {
    if (customerInfo?.relations_details?.length > 0) {
      const relation_details = customerInfo?.relations_details?.map((obj) => {
        const container = {};
        container.relation_type = obj?.relation_type;
        container.profession = obj.profession;
        container.fam_name = obj.fam_name;
        container.mobile = obj.mobile;
        container.fam_dob =
          obj?.fam_dob != null ? new Date(obj?.fam_dob) : undefined;
        container.fam_wed_dob =
          obj?.fam_wed_dob != null ? new Date(obj?.fam_wed_dob) : undefined;
        return container;
      });
      setfamily_details(relation_details);
    }
  }, [customerInfo]);

  const editFamilyDetails = ({ name, val, ids }) => {
    setfamily_details((prevState) =>
      prevState?.map((obj) => {
        if (obj?.id_family_details == ids) {
          setValue(`${name + obj.id_family_details}`, val);
          return { ...obj, [name]: val };
        }
        return obj;
      })
    );
  };

  const deleteFamilyDetails = (ids) => {
    setfamily_details((prevState) =>
      prevState?.filter((obj) => obj.id_family_details != ids)
    );
  };

  useEffect(() => {
    if (createCustomerData != null) {
      let passData = [];
      passData.push({
        label:
          createCustomerData?.firstname +
          "-" +
          String(createCustomerData?.mobile),
        value: createCustomerData?.id_customer,
      });
      //let val = createCustomerData?.firstname + " " + String(createCustomerData?.mobile);
      //passData.push(val);
      navigate(
        {
          pathname: `${process.env.PUBLIC_URL}/schememaster/schemeaccount/add`,
        },
        {
          state: {
            add: true,
            customerId: createCustomerData?.id_customer,
            customerSearchValue: passData,
          },
        }
      );
    }
  }, [createCustomerData, navigate]);

  const postData = async () => {
    const nonEmptyRelationDetails = family_details?.filter(
      (result) => result?.fam_name !== undefined && result?.fam_name !== ""
    );

    const relation_details = nonEmptyRelationDetails?.map((obj) => {
      const container = {};
      container.relation_type = obj?.relation_type?.value
        ? obj?.relation_type.value
        : "";
      container.profession = obj?.profession?.value
        ? obj?.profession.value
        : "";
      container.name = obj.fam_name;
      container.mobile = obj.mobile;
      container.date_of_birth =
        obj?.fam_dob != undefined
          ? moment(obj?.fam_dob).format("YYYY-MM-DD")
          : null;
      container.date_of_wed =
        obj?.fam_wed_dob != undefined
          ? moment(obj?.fam_wed_dob).format("YYYY-MM-DD")
          : null;
      return container;
    });
    const adddata = {
      title: cusTitle,
      mob_code,
      lastname: lastname !== "" ? lastname : null,
      firstname,
      date_of_birth:
        dateofbirth !== "" && dateofbirth !== null && dateofbirth !== undefined
          ? moment(dateofbirth).format("YYYY-MM-DD")
          : null,
      date_of_wed:
        date_of_wed !== "" && date_of_wed !== null && date_of_wed !== undefined
          ? moment(date_of_wed).format("YYYY-MM-DD")
          : null,
      gender,
      mobile,
      comments: comments != "" ? comments : null,
      img: cus_img ? cus_img : null,
      active,
      email: email ? email : null,
      notification,
      gst_number: gst_number ? gst_number : null,
      pan_number: pan_number ? pan_number : null,
      aadhar_number: aadhar ? aadhar : null,
      religion: religion ? religion : null,
      id_branch: branch,
      profession: profession,
      // kyc_status,
      is_vip,
      cus_type,
      send_promo_sms,
      relation_details,
      is_retailer,
      retailer_type,
      phone_no: phone ? phone : null,
      customer_address: {
        country,
        state,
        city,
        area: id_area,
        line1,
        line2: line2 != "" ? line2 : null,
        line3: line3 != "" ? line3 : null,
        pincode,
      },
    };

    try {
      // await dispatch(createCustomer(adddata)).unwrap();
      const data = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/customersettings/customer/`,
        adddata,
        {
          headers: {
            Authorization: `Token ${secureLocalStorage.getItem("pref")?.token}`,
          },
        }
      );
      toastsuccess("customer added successfully");
      if (navigateLink) {
        let passData = [];
        let responce = data?.data;
        // let val = data?.data?.firstname + " " + String(data?.data?.mobile);
        passData.push({
          label: responce?.firstname + "-" + String(responce?.mobile),
          value: responce?.id_customer,
          firstname: responce?.firstname,
        });
        // passData.push(val);
        navigate(
          {
            pathname: `${process.env.PUBLIC_URL}${navigateLink}`,
          },
          {
            state: {
              add: true,
              customerId: responce?.id_customer,
              customerSearchValue: passData,
            },
          }
        );
      } else {
        navigate(`${process.env.PUBLIC_URL}/master/customer/list`);
      }
    } catch (error) {
      toastfunc(error.response.data.message);
    }
  };

  useEffect(() => {
    if (createMobNum) {
      setMobile(createMobNum);
      setValue("mobile", createMobNum);
      
    }
  }, [createMobNum]);

//   useEffect(() => {
//   if (createMobNum && fnameFieldRef.current) {
//     fnameFieldRef.current.focus(); 
//   }
// }, [createMobNum]);

// useHotkeys(
//     "alt",
//     (event) => {
//       event.preventDefault();
//       fnameFieldRef.current.focus();
//     },
//     {
//       enableOnFormTags: true, // Enable hotkeys inside input fields
//       preventDefault: true, // Prevent default browser Save
//     }
//   );

  useEffect(() => {
    id !== undefined && dispatch(getCustomerById(id));
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
    if(customerInfo != null ){
      setEmail(customerInfo?.email)
      setmob_code(customerInfo?.mob_code)
      SetCusTitle(customerInfo?.title)
      setLastname(customerInfo?.lastname)
      setFirstname(customerInfo?.firstname)
      setDateofbirth(
        customerInfo?.date_of_birth
          ? moment(customerInfo?.date_of_birth).toDate()
          : null
      )
      setDateofwed(
        customerInfo?.date_of_wed
          ? moment(customerInfo?.date_of_wed).toDate()
          : null
      )
      setgender(customerInfo?.gender)
      setMobile(customerInfo?.mobile)
      setComments(customerInfo?.comments)
      setActive(customerInfo?.active)
      setdate_add(customerInfo?.date_add)
      setdate_upd(customerInfo?.date_upd)
      setNotification(customerInfo?.notification)
      setGstnumber(customerInfo?.gst_number)
      setPannumber(customerInfo?.pan_number)
      setAadhar(customerInfo?.aadhar_number)
      setReligion(customerInfo?.religion)
      // setkyc_status(customerInfo?.kyc_satus);
      setIsvip(customerInfo?.is_vip)
      setcus_img(customerInfo?.cus_img)
      setcus_type(customerInfo?.cus_type)
      setSendpromosms(customerInfo?.send_promo_sms)
      setPincode(customerInfo?.customer_address?.pincode)
      setLine1(customerInfo?.customer_address?.line1)
      setLine2(customerInfo?.customer_address?.line2)
      setLine3(customerInfo?.customer_address?.line3)
      setState(customerInfo?.customer_address?.state)
      setCity(customerInfo?.customer_address?.city)
      setCountry(customerInfo?.customer_address?.country)
      setIdarea(customerInfo?.customer_address?.area)
      SetBranch(customerInfo?.id_branch)
      SetProfession(customerInfo?.profession)
      setis_retailer(customerInfo?.is_retailer)
      setretailer_type(customerInfo?.retailer_type)
      setPhone(customerInfo?.phone_no)
      reset()}
  }, [customerInfo, reset]);

  const putData = async () => {
    const nonEmptyRelationDetails = family_details?.filter(
      (result) => result?.fam_name !== undefined && result?.fam_name !== ""
    );
    const relation_details = nonEmptyRelationDetails?.map((obj) => {
      const container = {};
      container.relation_type = obj?.relation_type?.value;
      container.profession = obj.profession?.value;
      container.name = obj.fam_name;
      container.mobile = obj.mobile;
      container.date_of_birth =
        obj?.fam_dob != undefined
          ? moment(obj?.fam_dob).format("YYYY-MM-DD")
          : null;
      container.date_of_wed =
        obj?.fam_wed_dob != undefined
          ? moment(obj?.fam_wed_dob).format("YYYY-MM-DD")
          : null;
      return container;
    });
    const adddata = {
      title: cusTitle,
      mob_code,
      lastname: lastname ? lastname : null,
      firstname: firstname ? firstname : null,
      date_of_birth:
        dateofbirth !== "" && dateofbirth !== null && dateofbirth !== undefined
          ? moment(dateofbirth).format("YYYY-MM-DD")
          : null,
      date_of_wed:
        date_of_wed !== "" && date_of_wed !== null && date_of_wed !== undefined
          ? moment(date_of_wed).format("YYYY-MM-DD")
          : null,
      gender,
      mobile,
      comments: comments != "" ? comments : null,
      img: cus_img ? cus_img : null,
      active,
      email: email ? email : null,
      notification,
      gst_number: gst_number != "" ? gst_number : null,
      pan_number: pan_number != "" ? pan_number : null,
      aadhar_number: aadhar ? aadhar : null,
      religion: religion ? religion : null,
      id_branch: branch,
      profession: profession,
      // kyc_status,
      is_vip,
      cus_type,
      send_promo_sms,
      relation_details,
      is_retailer,
      retailer_type,
      phone_no: phone ? phone : null,
      customer_address: {
        country,
        state,
        city,
        area: id_area,
        line1,
        line2: line2 != "" ? line2 : null,
        line3: line3 != "" ? line3 : null,
        pincode,
      },
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    try {
      await dispatch(updateCustomerById(reduxData)).unwrap();
      toastsuccess("Customer Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/master/customer/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/master/customer/list`);
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

  // Reload Shortcut (Ctrl+R)
  useHotkeys(
    "ctrl+r",
    (event) => {
      event.preventDefault();
      reset();
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
                      navigate(`${process.env.PUBLIC_URL}/master/customer/list`)
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
                      navigate(`${process.env.PUBLIC_URL}/master/customer/list`)
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
                <Icon name="user-circle-fill" /> <span>Family Details</span>
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <div className="">
                <Row lg={12} className={"form-control-sm"}>
                  <Col md={4}>
                    <div className="custom-grid">
                      {userInfo?.user?.customer_type_show == true && (
                        <Row className="form-group row g-4">
                          <Col md="4">
                            <div className="form-group">
                              <label className="form-label" htmlFor="cus_type">
                                Type
                              </label>
                            </div>
                          </Col>
                          <Col md="8">
                            <div className="form-group">
                              <ul className="custom-control-group g-3 align-center flex-wrap">
                                <li>
                                  <div className="custom-control custom-control-sm custom-radio">
                                    <input
                                      id="individual"
                                      type="radio"
                                      name={"cus_type"}
                                      value={"1"}
                                      className="custom-control-input"
                                      checked={cus_type == "1"}
                                      onChange={(e) => {
                                        setcus_type(e.target.value);
                                      }}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="individual"
                                    >
                                      Individual
                                    </label>
                                  </div>
                                </li>
                                <li>
                                  <div className="custom-control custom-control-sm  custom-radio">
                                    <input
                                      id="company"
                                      type="radio"
                                      value={"2"}
                                      name={"cus_type"}
                                      className="custom-control-input "
                                      checked={cus_type == "2"}
                                      onChange={(e) => {
                                        setcus_type(e.target.value);
                                      }}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="company"
                                    >
                                      Company
                                    </label>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </Col>
                        </Row>
                      )}

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
                          inputAutofocus={true}
                            register={register}
                            placeholder={
                              cus_type == "1" ? "First Name" : " Company Name"
                            }
                            // ref={fnameFieldRef}
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
                          {/* <div className="form-control-wrap input-group">
                            <select
                              className="form-control form-control-sm"
                              id={"cusTitle"}
                              name={"cusTitle"}
                              // style={{ width: props.option_width }}
                              onChange={(event) => {
                                const value = event.target.value;
                                SetCusTitle(value);
                                setValue("cusTitle", value);
                              }}
                              value={cusTitle}
                            >
                              {titleOptions?.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <input
                              //         ref={(el) => {
                              //   ref && typeof ref === "function" ? ref(el) : ref && (ref.current = el);
                              // }}
                              autoFocus={true}
                              className="form-control form-control-sm"
                              id={"firstname"}
                              type={"text"}
                              style={{ width: `110px` }}
                              placeholder={"Firstname"}
                              {...register(`firstname`, {
                                required: {
                                  value: true,
                                  message: "Name is Required",
                                },
                              })}
                              value={firstname}
                              onChange={(e) => {
                                setFirstname(capitalizeWords(e.target.value));
                                setValue("firstname", e.target.value);
                                clearErrors("firstname");
                              }}
                              // // onKeyDown={(evt) => {
                              // //   const invalidChars = ["+", "-", "=", "/", ":", ";", "[", "]", ",", ".","?"];
                              // //   if (invalidChars.includes(evt.key) || !(evt.keyCode > 57 || evt.keyCode < 48) && !["Backspace", "Tab"].includes(evt.key)) {
                              // //     evt.preventDefault();
                              // //   }
                              // // }}
                              onKeyDown={(evt) => {
                                const invalidChars = /[^a-zA-Z\s]/; // Allows only letters and spaces
                                if (
                                  invalidChars.test(evt.key) ||
                                  evt.key === "Shift"
                                ) {
                                  evt.preventDefault();
                                }
                              }}
                              // ref={ref}
                            />

                            <input
                              type="hidden"
                              value={cusTitle || ""}
                              {...register("cusTitle")}
                            />
                            
                          </div> */}
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
                              disabled={customerInfo != undefined}
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
                              isRequired={customerInfo == undefined}
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
                            <label className="form-label" htmlFor="mobile">
                              Contact No2
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
                            <label className="form-label" htmlFor="area">
                              Area
                              <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <AreaDropdown
                              register={register}
                              id={"id_area"}
                              areas={areas}
                              selectedArea={id_area}
                              onAreaChange={(value) => {
                                setIdarea(value);
                                let areaObj = areas?.rows?.find(
                                  (item) => item?.id_area == value
                                );
                                setPincode(areaObj?.pincode);
                              }}
                              isRequired={true}
                              clearErrors={clearErrors}
                              setValue={setValue}
                              message={errors.id_area && "Area is Required"}
                            ></AreaDropdown>
                          </div>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="line1">
                              Address1
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <TextInputField
                              register={register}
                              isRequired={false}
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
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="custom-grid">
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="dateofbirth">
                              DOB
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <DateInputField
                            maxDate={new Date()}
                            showYearDropdown={true}
                            showMonthDropdown={true}
                            id={"dateofbirth"}
                            selected={dateofbirth}
                            SetValue={(date) => setDateofbirth(date)}
                          />
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="aadhar">
                              Aadhar
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <AadharInputField
                              register={register}
                              isRequired={false}
                              id={"aadhar"}
                              placeholder="Aadhar Number"
                              value={aadhar}
                              SetValue={(value) => {
                                setAadhar(value);
                                clearErrors("aadhar");
                              }}
                            />
                            {errors?.aadhar && (
                              <span className="text-danger">
                                {errors?.aadhar.message}
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
                              {cus_type == "2" && <IsRequired />}
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <GstInputField
                              register={register}
                              isRequired={cus_type == "2"}
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
                            <label className="form-label" htmlFor="religion">
                              Religion
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          {/* <div className="form-group">
                            <div className="form-control-wrap">
                              <div className="form-control-select">
                                <select
                                  className="form-control form-select"
                                  id="religion"
                                  value={religion}
                                  onChange={(e) => setReligion(e.target.value)}
                                  placeholder="Religion"
                                >
                                  <option label="Select Religion" value=""></option>
                                  <option value="1">Hinduism</option>
                                  <option value="2">Islam</option>
                                  <option value="3">Christianity</option>
                                  <option value="4">Other</option>
                                </select>
                              </div>
                            </div>
                          </div> */}
                          <div className="form-group">
                            <ReligionDropdown
                              register={register}
                              id={"religion"}
                              religions={religions}
                              selectedReligion={religion}
                              onReligionChange={setReligion}
                              isRequired={false}
                              clearErrors={clearErrors}
                              setValue={setValue}
                              // message={errors.religion && "Religion is Required"}
                            />
                          </div>
                        </Col>
                      </Row>

                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="branch">
                              Branches
                              <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <BranchDropdown
                              register={register}
                              id={"branch"}
                              branches={branches}
                              selectedBranch={branch}
                              onBranchChange={SetBranch}
                              isRequired={true}
                              clearErrors={clearErrors}
                              setValue={setValue}
                              message={errors.branch && "Branch is Required"}
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="profession">
                              Profession
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <ProfessionDropdown
                              register={register}
                              id={"profession"}
                              professions={professions}
                              selectedProfession={profession}
                              onProfessionChange={SetProfession}
                              isRequired={false}
                              clearErrors={clearErrors}
                              setValue={setValue}
                              // message={errors.profession && "Profession is Required"}
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="floor">
                              Customer Type
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <div className="form-group">
                            <div className="form-control-wrap">
                              <div className="form-control-select">
                                <select
                                  className="form-control form-select"
                                  id="profileType"
                                  {...register("profileType", {
                                    required: true,
                                  })}
                                  value={profileType}
                                  onChange={(e) => {
                                    setProfileType(e.target.value);
                                  }}
                                  placeholder="Profile Type"
                                >
                                  <option
                                    label="Select Profile Type"
                                    value=""
                                  ></option>
                                  {profileTypeOptions?.map((item, index) => (
                                    <option key={index} value={item?.value}>
                                      {item.label}
                                    </option>
                                  ))}
                                </select>
                                {errors?.counter && (
                                  <span className="invalid">
                                    This field is required
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>

                      {cus_type == "2" && (
                        <>
                          <Row className="form-group row g-4">
                            <Col md="4">
                              <div className="form-group">
                                <label
                                  className="form-label"
                                  htmlFor="is_retailer"
                                >
                                  Is Retailer
                                </label>
                              </div>
                            </Col>
                            <Col md="8">
                              <div className="form-group">
                                <ul className="custom-control-group g-3 align-center flex-wrap">
                                  <li>
                                    <div className="custom-control custom-control-sm custom-radio">
                                      <input
                                        id="yes"
                                        type="radio"
                                        name={"is_retailer"}
                                        value={"1"}
                                        className="custom-control-input"
                                        checked={is_retailer == "1"}
                                        onChange={(e) => {
                                          setis_retailer(e.target.value);
                                        }}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="yes"
                                      >
                                        Yes
                                      </label>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="custom-control custom-control-sm  custom-radio">
                                      <input
                                        id="no"
                                        type="radio"
                                        value={"0"}
                                        name={"is_retailer"}
                                        className="custom-control-input "
                                        checked={is_retailer == "0"}
                                        onChange={(e) => {
                                          setis_retailer(e.target.value);
                                        }}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="no"
                                      >
                                        No
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
                                  htmlFor="is_retailer"
                                >
                                  Retailer Type
                                </label>
                              </div>
                            </Col>
                            <Col md="8">
                              <div className="form-group">
                                <ul className="custom-control-group g-3 align-center flex-wrap">
                                  <li>
                                    <div className="custom-control custom-control-sm custom-radio">
                                      <input
                                        disabled={is_retailer !== "1"}
                                        id="retail"
                                        type="radio"
                                        name={"retailer_type"}
                                        value={"1"}
                                        className="custom-control-input"
                                        checked={retailer_type == "1"}
                                        onChange={(e) => {
                                          setretailer_type(e.target.value);
                                        }}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="retail"
                                      >
                                        Retail
                                      </label>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="custom-control custom-control-sm  custom-radio">
                                      <input
                                        disabled={is_retailer !== "1"}
                                        id="vip_retail"
                                        type="radio"
                                        value={"0"}
                                        name={"retailer_type"}
                                        className="custom-control-input "
                                        checked={retailer_type == "0"}
                                        onChange={(e) => {
                                          setretailer_type(e.target.value);
                                        }}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="vip_retail"
                                      >
                                        Vip Retail
                                      </label>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </Col>
                          </Row>
                        </>
                      )}

                      <Row className="form-group row g-4">
                        <Col md="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="date_of_wed">
                              DOW
                            </label>
                          </div>
                        </Col>
                        <Col md="8">
                          <DateInputField
                            maxDate={new Date()}
                            showYearDropdown={true}
                            showMonthDropdown={true}
                            id={"date_of_wed"}
                            selected={date_of_wed}
                            SetValue={setDateofwed}
                          />
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

                      <Row className="form-group row g-4">
                        <Col md="1"></Col>
                        <Col md="10">
                          <div className="form-group">
                            <div className="custom-control custom-control-sm custom-checkbox">
                              <input
                                type="checkbox"
                                checked={notification}
                                onChange={(e) =>
                                  setNotification(e.target.checked)
                                }
                                className="custom-control-input"
                                id="notification"
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="notification"
                              >
                                {"Send The Notification to the Customer"}
                              </label>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="1"></Col>
                        <Col md="10">
                          <div className="form-group">
                            <div className="custom-control custom-control-sm custom-checkbox">
                              <input
                                type="checkbox"
                                checked={send_promo_sms}
                                onChange={(e) =>
                                  setSendpromosms(e.target.checked)
                                }
                                className="custom-control-input"
                                id="send_promo_sms"
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="send_promo_sms"
                              >
                                {"Send Promo SMS"}
                              </label>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row className="form-group row g-4">
                        <Col md="1"></Col>
                        <Col md="10">
                          <div className="form-group">
                            <div className="custom-control custom-control-sm custom-checkbox">
                              <input
                                type="checkbox"
                                checked={active}
                                onChange={(e) => setActive(e.target.checked)}
                                className="custom-control-input"
                                id="active"
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="active"
                              >
                                {"Set Customer as Active"}
                              </label>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </div>
            </TabPane>

            <TabPane tabId="2">
              <div className="">
                <Row md={12} className="form-group row g-4">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>S.NO</th>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Profession</th>
                          <th>Mobile</th>
                          <th>D.O.B</th>
                          <th>Wedding Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {family_details?.map((obj, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <input
                                  name="fam_name"
                                  className="form-control form-control-sm"
                                  type="text"
                                  placeholder="Name"
                                  value={transformWord(obj?.fam_name)}
                                  onChange={(e) =>
                                    editFamilyDetails({
                                      ids: obj?.id_family_details,
                                      name: e.target.name,
                                      val: e.target.value,
                                    })
                                  }
                                />
                              </td>
                              <td>
                                <div
                                  className="form-group"
                                  style={{ width: "100px" }}
                                >
                                  <div className="form-control-wrap">
                                    <Select
                                      value={obj?.relation_type}
                                      onChange={(value) =>
                                        editFamilyDetails({
                                          ids: obj?.id_family_details,
                                          name: "relation_type",
                                          val: value,
                                        })
                                      }
                                      options={relationTypes}
                                      placeholder="Select Relation Type"
                                      id={`relation_type${obj?.id_family_details}`}
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
                                      value={obj?.relation_type}
                                      {...register(
                                        `relation_type${obj?.id_family_details}`
                                      )}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div
                                  className="form-group"
                                  style={{ width: "100px" }}
                                >
                                  <div className="form-control-wrap">
                                    <Select
                                      value={obj?.profession}
                                      onChange={(value) =>
                                        editFamilyDetails({
                                          ids: obj?.id_family_details,
                                          name: "profession",
                                          val: value,
                                        })
                                      }
                                      options={professions?.map((item) => ({
                                        value: item.id_profession,
                                        label: item.profession_name,
                                      }))}
                                      placeholder="Select Profession"
                                      id={`profession${obj?.id_family_details}`}
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
                                      value={obj?.profession}
                                      {...register(
                                        `profession${obj?.id_family_details}`
                                      )}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="form-group">
                                  <div className="form-control-wrap">
                                    <input
                                      name="mobile"
                                      className="form-control form-control-sm"
                                      type="text"
                                      placeholder="Mobile"
                                      value={obj?.mobile}
                                      onChange={(e) =>
                                        editFamilyDetails({
                                          ids: obj?.id_family_details,
                                          name: e.target.name,
                                          val: e.target.value,
                                        })
                                      }
                                      onBlur={() => {
                                        if (
                                          parseInt(mobileLength) >
                                          parseInt(obj?.mobile?.length)
                                        ) {
                                          toastfunc(
                                            "Mobile number didn't match min length."
                                          );
                                          editFamilyDetails({
                                            ids: obj?.id_family_details,
                                            name: "mobile",
                                            val: "",
                                          });
                                        }
                                        if (
                                          parseInt(mobileLength) <
                                          parseInt(obj?.mobile?.length)
                                        ) {
                                          toastfunc(
                                            "Mobile number exceeds max length."
                                          );
                                          editFamilyDetails({
                                            ids: obj?.id_family_details,
                                            name: "mobile",
                                            val: "",
                                          });
                                        }
                                      }}
                                      onKeyDown={(evt) => {
                                        if (
                                          (evt.keyCode > 57 ||
                                            evt.keyCode < 48) &&
                                          !["Backspace", "Tab"].includes(
                                            evt.key
                                          )
                                        ) {
                                          evt.preventDefault();
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td>
                                <DateInputField
                                  maxDate={new Date()}
                                  showYearDropdown={true}
                                  showMonthDropdown={true}
                                  id={`fam_dob${obj.id_family_details}`}
                                  name="fam_dob"
                                  selected={obj?.fam_dob}
                                  SetValue={(e) =>
                                    editFamilyDetails({
                                      ids: obj?.id_family_details,
                                      name: "fam_dob",
                                      val: e,
                                    })
                                  }
                                />
                              </td>
                              <td>
                                <DateInputField
                                  maxDate={new Date()}
                                  showYearDropdown={true}
                                  showMonthDropdown={true}
                                  id={`fam_wed_dob${obj.id_family_details}`}
                                  name="fam_wed_dob"
                                  selected={obj?.fam_wed_dob}
                                  SetValue={(e) =>
                                    editFamilyDetails({
                                      ids: obj?.id_family_details,
                                      name: "fam_wed_dob",
                                      val: e,
                                    })
                                  }
                                />
                              </td>
                              <td>
                                {index == family_details?.length - 1 && (
                                  <Button
                                    color="primary"
                                    size="sm"
                                    className="btn-icon btn-white btn-dim"
                                    onClick={() => addFamilyDetails()}
                                  >
                                    <Icon name="plus" />
                                  </Button>
                                )}
                                <Button
                                  color="primary"
                                  size="sm"
                                  className="btn-icon btn-white btn-dim"
                                  onClick={() =>
                                    deleteFamilyDetails(obj?.id_family_details)
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

export default CustomerForm;
