/* eslint-disable no-unused-expressions */
import React, { useEffect, useState, useContext } from "react";
import { Button, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import IsRequired from "../../../components/erp-required/erp-required";
import { Icon, NumberInputField, TextInputField } from "../../../components/Component";
import DatePicker from "react-datepicker";
import { useSelector, useDispatch } from "react-redux";
import { company_country } from "../../../redux/configs";
import BranchDropdownMulti from "../../../components/common/dropdown/BranchDropdownMulti";
import Select from "react-select";
import {
  getAllCity,
  getAllCountry,
  getAllProfile,
  getAllState,
  getDepartmentOptions,
  getDesignationByDepartment,
} from "../../../redux/thunks/retailMaster";
import { getCompanyById } from "../../../redux/thunks/settings";
import { AreaDropdown, CityDropdown, CountryDropdown, StateDropdown, SectionDropdown } from "../../../components/filters/retailFilters";
import { useCities, useCountries, useStates, useSections } from "../../../components/filters/filterHooks";
import { DateInputField, MobileNumberFieldWithCountryCode } from "../../../components/form-control/InputGroup";
import ProfileImageUpload from "../../../components/input/profile-image/ProfileImageUpload";
import classnames from "classnames";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

const EmployeeFormStep2 = ({ props }) => {
  const companyCountryID = company_country;
  const {
    register,
    control,
    setValue,
    Controller,
    errors,
    watch,
    areas,
    id_area,
    setIdarea,
    firstName,
    SetFirstName,
    lastName,
    SetLastName,
    dob,
    SetDob,
    empCode,
    SetEmpCode,
    department,
    SetDepartment,
    designation,
    SetDesignation,
    dateOfJoin,
    SetDateOfJoin,
    mobile,
    SetMobile,
    comments,
    SetComments,
    profile,
    SetProfile,
    loginBranches,
    SetLoginBranches,
    mobCode,
    SetMobCode,
    country,
    setCountry,
    state,
    setState,
    city,
    setCity,
    clearErrors,
    pincode,
    setPincode,
    line1,
    setLine1,
    line2,
    setLine2,
    line3,
    setLine3,
    emp_img,
    setemp_img,
    digi_sign_img,
    setdigi_sign_img,
    is_edit,

    username,
    SetUsername,
    email,
    SetEmail,
    oldPassword,
    SetOldPassword,
    password,
    SetPassword,
    confirmPassword,
    SetConfirmPassword,
    changepass,
    SetChangePass,
    isPasswordShown,
    setIsPasswordShown,
    isConfirmPasswordShown,
    setIsConfirmPasswordShown,
    handleClickShowPassword,
    handleClickShowConfirmPassword,
    isShortCodeDisabled,
    activeTab,
    setActiveTab,
    toggle,
    family_details,
    setfamily_details,
    addFamilyDetails,
    editFamilyDetails,
    deleteFamilyDetails,
    relationTypes,
    professions,
    is_system_user,
    setIs_system_user,
    sectionIds,
    setSectionIds,
  } = props;
  const dispatch = useDispatch();

  const { transformWord } = useContext(WordTransformerContext);

  const { departmentOptions } = useSelector((state) => state.departmentReducer);
  const { designationOptions } = useSelector((state) => state.designationReducer);
  const { profileList } = useSelector((state) => state.profileReducer);
  const { companyInfo } = useSelector((state) => state.companyReducer);

  const [mobCodeLen, SetMobCodeLen] = useState();
  const [conCodeLen, SetConCodeLen] = useState();
  const { countries } = useCountries();
  const { states } = useStates();
  const { cities } = useCities();
  const { sections } = useSections();
  // useEffect(() => {
  //   companyInfo && SetMobile(companyInfo?.mob_code),
  //     SetMobCode(companyInfo?.mob_code);
  // }, [companyInfo, SetMobile, SetMobCode]);

  // useEffect(() => {
  //   companyInfo?.mob_no_len &&
  //     SetMobCodeLen(mobCode?.length + companyInfo?.mob_no_len);
  // }, [companyInfo?.mob_no_len, mobCode]);

  // useEffect(() => {
  //   mobCode && SetConCodeLen(mobCode?.length);
  // }, [mobCode]);

  // useEffect(() => {
  //   if (is_edit) {
  //     department && dispatch(getDesignationByDepartment(department));
  //   }
  // }, [is_edit, dispatch, department]);

  // function getDropdownButtonLabel({ placeholderButtonLabel, value }) {
  //   if (value && value.some((o) => o.value === "*")) {
  //     return `${placeholderButtonLabel}: All (${value.length-1}) Employee Selected`;
  //   } else {
  //     return `${placeholderButtonLabel}: ${value.length} selected`;
  //   }
  // }

  // function onChange(value, event) {
  //   if (event.action === "select-option" && event.option.value === "*") {
  //     this.setState(this.options);
  //   } else if (
  //     event.action === "deselect-option" &&
  //     event.option.value === "*"
  //   ) {
  //     this.setState([]);
  //   } else if (event.action === "deselect-option") {
  //     this.setState(value.filter((o) => o.value !== "*"));
  //   } else if (value.length === this.options.length - 1) {
  //     this.setState(this.options);
  //   } else {
  //     this.setState(value);
  //   }
  // }
  useEffect(() => {
    dispatch(getCompanyById(companyCountryID));
  }, [dispatch, companyCountryID]);

  useEffect(() => {
    dispatch(getDepartmentOptions());
    // dispatch(getAllProfile());
    dispatch(getAllCountry());
    dispatch(getAllState());
    dispatch(getAllCity());
  }, [dispatch]);
  return (
    <>
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
                  {/* <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="username">
                          Username <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <div className="form-control-wrap">
                          <input
                            {...register("username", {
                              required: "Username is required",
                            })}
                            className="form-control form-control-sm"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => SetUsername(e.target.value)}
                          />
                          {errors?.username && (
                            <span className="invalid">
                              <Icon className={"sm"} name="alert-circle" />
                              {errors.username.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  {is_edit == true && (
                    <Row className="form-group row g-4">
                      <Col lg="4">
                        <div className="form-group">
                          <label className="form-label">Change Pass</label>
                        </div>
                      </Col>
                      <Col lg="8">
                        <div className="form-group">
                          <div className="custom-control custom-control-sm custom-switch">
                            <input
                              type="checkbox"
                              {...register(`changepass`, {
                                required: {
                                  value: false,
                                },
                              })}
                              className="custom-control-input "
                              name="changepass"
                              id="changepass"
                              checked={changepass}
                              onChange={(e) => SetChangePass(e.target.checked)}
                            />
                            <label className="custom-control-label" htmlFor="changepass">
                              {changepass == true ? "Yes" : "No"}
                            </label>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  )}

                  {!is_edit && (
                    <>
                      <Row className="form-group row g-4">
                        <Col lg="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="site-name">
                              Password <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <div className="form-group">
                            <div className="form-control-wrap">
                              <a
                                href="#password"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  handleClickShowPassword();
                                }}
                                className={`form-icon lg form-icon-right passcode-switch ${isPasswordShown ? "is-hidden" : "is-shown"
                                  }`}
                              >
                                <Icon name="eye" className="passcode-icon icon-show"></Icon>

                                <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                              </a>
                              <input
                                {...register("password", {
                                  required: "Password is required",
                                  minLength: {
                                    value: 8,
                                    message: "Min Length is 8",
                                  },
                                })}
                                className="form-control form-control-sm"
                                type={isPasswordShown ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => SetPassword(e.target.value.split(" ").join(""))}
                                autoComplete="given-password"
                              />
                              {errors?.password && (
                                <span className="invalid">
                                  <Icon className={"sm"} name="alert-circle" />
                                  {errors.password.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </>
                  )}

                  {!is_edit && (
                    <>
                      <Row className="form-group row g-4">
                        <Col lg="4">
                          <div className="form-group">
                            <label className="form-label" htmlFor="site-name">
                              C.Password <IsRequired />
                            </label>
                          </div>
                        </Col>
                        <Col lg="8">
                          <div className="form-group">
                            <div className="form-control-wrap">
                              <a
                                href="#password"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  handleClickShowConfirmPassword();
                                }}
                                className={`form-icon lg form-icon-right passcode-switch ${isConfirmPasswordShown ? "is-hidden" : "is-shown"
                                  }`}
                              >
                                <Icon name="eye" className="passcode-icon icon-show"></Icon>

                                <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                              </a>
                              <input
                                {...register("confirmPassword", {
                                  validate: (val) => {
                                    if (watch("password") != val) {
                                      return "Your passwords do no match";
                                    }
                                  },
                                  required: "Confirm Password is required",
                                  minLength: {
                                    value: 8,
                                    message: "Min Length is 8",
                                  },
                                })}
                                autoComplete="given-newpassword"
                                className="form-control form-control-sm"
                                type={isConfirmPasswordShown ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => SetConfirmPassword(e.target.value.split(" ").join(""))}
                              />
                              {errors?.confirmPassword && (
                                <span className="invalid">
                                  <Icon className={"sm"} name="alert-circle" />
                                  {errors.confirmPassword.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </>
                  )}

                  {is_edit && (
                    <>
                      {changepass == true && (
                        <>
                          <Row className="form-group row g-4">
                            <Col lg="4">
                              <div className="form-group">
                                <label className="form-label" htmlFor="oldPassword">
                                  Old Password <IsRequired />
                                </label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <div className="form-group">
                                <div className="form-control-wrap">
                                  <input
                                    {...register("oldPassword", {
                                      required: "Old Password is required",
                                      minLength: {
                                        value: 8,
                                        message: "Min Length is 8",
                                      },
                                    })}
                                    className="form-control form-control-sm"
                                    type="password"
                                    placeholder="Password"
                                    value={oldPassword}
                                    onChange={(e) => SetOldPassword(e.target.value.split(" ").join(""))}
                                  />
                                  {errors?.oldPassword && (
                                    <span className="invalid">
                                      <Icon className={"sm"} name="alert-circle" />
                                      {errors.oldPassword.message}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <Row className="form-group row g-4">
                            <Col lg="4">
                              <div className="form-group">
                                <label className="form-label" htmlFor="site-name">
                                  Password <IsRequired />
                                </label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <div className="form-group">
                                <div className="form-control-wrap">
                                  <input
                                    {...register("password", {
                                      required: "Password is required",
                                      minLength: {
                                        value: 8,
                                        message: "Min Length is 8",
                                      },
                                    })}
                                    className="form-control form-control-sm"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => SetPassword(e.target.value.split(" ").join(""))}
                                  />
                                  {errors?.password && (
                                    <span className="invalid">
                                      <Icon className={"sm"} name="alert-circle" />
                                      {errors.password.message}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <Row className="form-group row g-4">
                            <Col lg="4">
                              <div className="form-group">
                                <label className="form-label" htmlFor="site-name">
                                  C.Password <IsRequired />
                                </label>
                              </div>
                            </Col>
                            <Col lg="8">
                              <div className="form-group">
                                <div className="form-control-wrap">
                                  <input
                                    {...register("confirmPassword", {
                                      validate: (val) => {
                                        if (watch("password") != val) {
                                          return "Your passwords do no match";
                                        }
                                      },
                                      required: "Confirm Password is required",
                                      minLength: {
                                        value: 8,
                                        message: "Min Length is 8",
                                      },
                                    })}
                                    className="form-control form-control-sm"
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => SetConfirmPassword(e.target.value.split(" ").join(""))}
                                  />
                                  {errors?.confirmPassword && (
                                    <span className="invalid">
                                      <Icon className={"sm"} name="alert-circle" />
                                      {errors.confirmPassword.message}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </>
                      )}
                    </>
                  )} */}

                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="firstName">
                          First name <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <div className="form-control-wrap">
                          <input
                            {...register("firstName", {
                              required: "First Name is required",
                            })}
                            className="form-control form-control-sm"
                            type="text"
                            placeholder="Firstname"
                            value={firstName}
                            onChange={(e) => SetFirstName(transformWord(e.target.value))}
                          />
                          {errors?.firstName && (
                            <span className="invalid">
                              <Icon className={"sm"} name="alert-circle" />
                              {errors.firstName.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="lastName">
                          Last name <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <div className="form-control-wrap">
                          <input
                            {...register("lastName", {
                              required: "Last Name is required",
                            })}
                            className="form-control form-control-sm"
                            type="text"
                            placeholder="Lastname"
                            value={lastName}
                            onChange={(e) => SetLastName(transformWord(e.target.value))}
                          />
                          {errors?.lastName && (
                            <span className="invalid">
                              <Icon className={"sm"} name="alert-circle" />
                              {errors.lastName.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="email">
                          Email
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <div className="form-control-wrap">
                          <input
                            {...register("email", {
                              // required: "email id is required",
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
                              },
                            })}
                            autoComplete="given-email"
                            className="form-control form-control-sm"
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) =>
                              SetEmail(e.target.value.split(" ").join(""))
                            }
                          />
                          {/* {errors?.email && (
                            <span className="invalid">
                              <Icon className={"sm"} name="alert-circle" />
                              {errors.email.message}
                            </span>
                          )} */}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="mobile">
                          Mobile
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      {/* <div className="form-group">
              <div className="form-control-wrap">
                <input
                  {...register("mobile", {
                    required: "Mobile number is required",
                    maxLength: {
                      value: mobCodeLen,
                      message: `Maximum  Number is ${mobCodeLen}`,
                    },
                    minLength: {
                      value: mobCodeLen,
                      message: `Minimum  Number is ${mobCodeLen}`,
                    },
                  })}
                  className="form-control form-control-sm"
                  type="text"
                  placeholder="Employee Code"
                  value={mobile}
                  onChange={(e) => {
                    SetMobile(e.target.value);
                  }}
                  onKeyDown={(evt) => {
                    ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault(),
                      evt.target.value.length == mobCodeLen &&
                        !["Backspace", "Tab"].includes(evt.key) &&
                        evt.preventDefault(),
                      evt.target.value.length == conCodeLen && ["Backspace"].includes(evt.key) && evt.preventDefault();
                  }}
                />
                {errors?.mobile && (
                  <span className="invalid">
                    <Icon className={"sm"} name="alert-circle" />
                    {errors.mobile.message}
                  </span>
                )}
              </div>
            </div> */}
                      <div className="form-group">
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
                          onDropDownChange={SetMobCode}
                          selectedOption={mobCode}
                          // isRequired={customerInfo == undefined}
                          register={register}
                          max={10}
                          min={10}
                          reqValueError={"This field is required"}
                          maxError={"Max Length is 10"}
                          minError={"Min Length is 10"}
                          SetValue={(value) => {
                            SetMobile(value);
                            clearErrors("mobile");
                          }}
                        // message={errors.mobile && errors.mobile.message}
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
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="empCode">
                          Code <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <div className="form-control-wrap">
                          <input
                            disabled={isShortCodeDisabled}
                            {...register("empCode", {
                              required: !isShortCodeDisabled,
                              message: "Employee Code is required",
                            })}
                            className="form-control form-control-sm"
                            type="text"
                            placeholder="Employee Code"
                            value={empCode}
                            onChange={(e) => SetEmpCode(e.target.value)}
                          />
                          {errors?.empCode && (
                            <span className="invalid">
                              <Icon className={"sm"} name="alert-circle" />
                              {errors.empCode.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="department">
                          Department
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
                              id="department"
                              {...register("department", {
                                required: true,
                              })}
                              value={department}
                              onChange={(e) => {
                                // dispatch(getDesignationByDepartment(e.target.value));
                                SetDepartment(e.target.value);
                              }}
                              placeholder="Department"
                            >
                              <option
                                label="Select Department"
                                value=""
                              ></option>
                              {departmentOptions?.map((item, index) => (
                                <option key={index} value={item?.id_dept}>
                                  {item?.name}
                                </option>
                              ))}
                            </select>
                            {errors.department && (
                              <span className="invalid">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  {/* <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="profile">
                          Profile
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
                              id="profile"
                              {...register("profile", {
                                required: true,
                              })}
                              value={profile}
                              onChange={(e) => {
                                SetProfile(e.target.value);
                              }}
                              placeholder="Profile"
                            >
                              <option label="Select Profile" value=""></option>
                              {profileList?.rows?.map((item, index) => (
                                <option key={index} value={item?.id_profile}>
                                  {item.profile_name}
                                </option>
                              ))}
                            </select>
                            {errors?.profile && (
                              <span className="invalid">
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row> */}
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="empType">
                          Branch
                          <IsRequired />
                        </label>
                      </div>
                    </Col>

                    <Col lg="8">
                      <div className="form-group">
                        <BranchDropdownMulti
                          id={"loginBranches"}
                          optionLabel={"Choose Branch..."}
                          register={register}
                          value={loginBranches}
                          SetValue={SetLoginBranches}
                        // getDropdownButtonLabel={getDropdownButtonLabel}
                        // onChange={onChange}
                        />
                        {errors.loginBranches && (
                          <span className="invalid">
                            This field is required
                          </span>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <Row md={12} className="form-group row g-4">
                    <Col md="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="is_system_user">
                          Is System User
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col md="8">
                      <div className="form-group">
                        <ul className="custom-control-group g-3 align-center flex-wrap">
                          <li>
                            <div className="custom-control custom-control-sm custom-radio">
                              <input
                                id="is_system_user_yes"
                                type="radio"
                                name={"is_system_user"}
                                value={1}
                                className="custom-control-input"
                                checked={is_system_user == 1}
                                onChange={(e) => {
                                  setIs_system_user(1);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="is_system_user_yes"
                              >
                                Yes
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-control-sm  custom-radio">
                              <input
                                id="is_system_user_no"
                                type="radio"
                                value={0}
                                name={"is_system_user"}
                                className="custom-control-input"
                                checked={is_system_user == 0}
                                onChange={(e) => {
                                  setIs_system_user(0);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="is_system_user_no"
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
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="id_section">
                          Section
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <SectionDropdown
                        isMulti={true}
                        register={register}
                        isRequired={true}
                        id={"sectionIds"}
                        placeholder="Section"
                        value={sectionIds}
                        selectedSection={sectionIds}
                        optionLabel="Select Section"
                        sectionOptions={sections}
                        setValue={setValue}
                        onSectionChange={(value) => {
                          setSectionIds(value);
                          // handleSelectChange("sections", value);
                          clearErrors("sectionIds");
                        }}
                        message={errors.sectionIds && "section is Required"}
                      />
                    </Col>
                  </Row>

                  {/* <Row className="form-group row g-4">
                <Col lg="4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="designation">
                      Designation

                    </label>
                  </div>
                </Col>
                <Col lg="8">
                  <div className="form-group">
                    <div className="form-control-wrap">
                      <div className="form-control-select">
                        <select
                          className="form-control form-select"
                          id="designation"
                          {...register("designation", {
                            required: false,
                          })}
                          value={designation}
                          onChange={(e) => {
                            SetDesignation(e.target.value);
                          }}
                          placeholder="Designation"
                        >
                          <option label="Select Designation" value=""></option>
                          {designationOptions?.map((item, index) => (
                            <option key={index} value={item?.id_design}>
                              {item?.name}
                            </option>
                          ))}
                        </select>
                        {errors.designation && (
                          <span className="invalid">This field is required</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row> */}
                </div>
              </Col>

              <Col md={4}>
                <div className="custom-grid">
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="area">
                          Area
                          <IsRequired />
                        </label>
                      </div>
                    </Col>

                    <Col lg="8">
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
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="site-name">
                          Country
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <CountryDropdown
                          register={register}
                          id={"country"}
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
                          message={errors.country && "Country is Required"}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="state">
                          State
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
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
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="pincode">
                          Pincode
                          <IsRequired />
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
                          setValue={setValue}
                          SetValue={(value) => {
                            setPincode(value);
                            setValue("pincode", value);
                            clearErrors("pincode");
                          }}
                        // message={errors.pincode && "pincode is Required"}
                        />
                        {/* {errors.pincode && <span className="text-danger">{errors.pincode.message}</span>} */}
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="line1">
                          Address 1
                          <IsRequired />
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          isRequired={true}
                          id={"line1"}
                          placeholder="Address"
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
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="line2">
                          Address 2
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          id={"line2"}
                          placeholder="Address 1"
                          value={line2}
                          SetValue={setLine2}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="line2">
                          Address 3
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <TextInputField
                          register={register}
                          id={"line3"}
                          placeholder="Address 2"
                          value={line3}
                          SetValue={setLine3}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="dob">
                          DOB
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <DateInputField
                        maxDate={new Date()}
                        showYearDropdown={true}
                        showMonthDropdown={true}
                        id={"dob"}
                        selected={dob}
                        SetValue={SetDob}
                      />
                    </Col>
                  </Row>
                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="dateOfJoin">
                          DOJ
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <DateInputField
                        maxDate={new Date()}
                        showYearDropdown={true}
                        showMonthDropdown={true}
                        id={"dateOfJoin"}
                        selected={dateOfJoin}
                        SetValue={SetDateOfJoin}
                      />
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="comments">
                          Comments
                        </label>
                      </div>
                    </Col>
                    <Col lg="8">
                      <div className="form-group">
                        <div className="form-control-wrap">
                          <input
                            className="form-control form-control-sm"
                            type="text"
                            id="comments"
                            placeholder="Comments"
                            value={comments}
                            onChange={(e) => {
                              SetComments(e.target.value);
                            }}
                          />
                        </div>
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
                      <ProfileImageUpload
                        id={"emp_img"}
                        image={emp_img}
                        SetImage={setemp_img}
                      />
                    </Col>
                  </Row>

                  <Row className="form-group row g-4">
                    <Col md="3">
                      <div className="form-group">
                        <label className="form-label" htmlFor="image">
                          Digital Signature
                        </label>
                      </div>
                    </Col>

                    <Col md="8">
                      <ProfileImageUpload
                        id={"digi_sign_img"}
                        image={digi_sign_img}
                        SetImage={setdigi_sign_img}
                      />
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
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>S.NO</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>Name</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>Type</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>Profession</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>Mobile</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>D.O.B</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>Wedding Date</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#f8f9fa' }}>Action</th>
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
    </>
  );
};

export default EmployeeFormStep2;
