import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import {
  getSystemUserEmployee,
  getSystemUserEmployeeDropdown,
  updateSystemUserEmployee,
  updateSystemUserEmployeePassword,
} from "../../../redux/thunks/employee";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import {
  Icon,
  PreviewCard,
  SaveButton,
  TooltipComponent,
  UserAvatar,
} from "../../../components/Component";
import { Badge, Button, Col, Row } from "reactstrap";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import CurrencyDisplay from "../../../components/common/moneyFormat/moneyFormat";
import { useForm } from "react-hook-form";
import { getAllProfile } from "../../../redux/thunks/retailMaster";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { ActiveEmployeeDropdown } from "../../../components/filters/retailFilters";
import Loading from "../../../components/erp-loading/erp-loader";

const SystemUserEmployeeList = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
    setValue,
    setError,
    watch,
  } = useForm();
  const dispatch = useDispatch();
  const location = useLocation();

  const { isLoading: issubmitting, sysUserEmployeeList } = useSelector(
    (state) => state.employeeReducer
  );
  const { sysUserEmployeeDropdown } = useSelector(
    (state) => state.employeeReducer
  );
  const { profileList } = useSelector((state) => state.profileReducer);

  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, SetSelectedEmployee] = useState();
  const [openRows, setOpenRows] = useState({});

  const toggleRow = (rowIndex) => {
    setOpenRows((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex],
    }));
  };

  const employeeOptions = sysUserEmployeeDropdown?.map((it, idx) => {
    const container = {};
    container.label = it.firstname;
    container.value = it.id_employee;
    return container;
  });

  const profileDropdownData = profileList?.rows?.map((obj) => {
    const container = {};
    container.label = obj.profile_name;
    container.value = obj.id_profile;
    return container;
  });

  const handelChange = (index, field, value) => {
    setEmployeeList((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;

      return updatedValues;
    });
  };

  const columns = [
    { header: "Name", accessor: "firstname", textAlign: "center" },
    { header: "Mobile", accessor: "mobile", textAlign: "center" },
  ];

  const saveFunction = async (index) => {
    const addData = {
      updateType: 1,
      id_employee: employeeList[index]?.id_employee,
      firstname: employeeList[index]?.firstname,
      lastname: employeeList[index]?.lastname,
      email: employeeList[index]?.email,
      profile: employeeList[index]?.profile,
      password2: employeeList[index]?.password2,
      username: employeeList[index]?.username,
    };
    // console.log(addData);
    const passData = [addData];
    try {
      await dispatch(updateSystemUserEmployee(passData)).unwrap();
      toastsuccess("Employee Updated Successfully");
      reset();
      dispatch(getSystemUserEmployee({ employee: null }));
    } catch (error) {
      console.error(error);
    }
  };

  const saveProfileFunction = async (index) => {
    const addData = {
      updateType: 2,
      id_employee: employeeList[index]?.id_employee,
      id_profile: employeeList[index]?.id_profile,
    };
    // console.log(addData);
    const passData = [addData];
    try {
      await dispatch(updateSystemUserEmployee(passData)).unwrap();
      toastsuccess("Employee Updated Successfully");
      reset();
      dispatch(getSystemUserEmployee({ employee: null }));
    } catch (error) {
      console.error(error);
    }
  };

  const editPassFunction = async (index) => {
    const addData = {
      updateType: 2,
      changepass: employeeList[index]?.changepass,
      user: employeeList[index]?.user,
      username: employeeList[index]?.username,
      newUsername: employeeList[index]?.newUsername,
      id_employee: employeeList[index]?.id_employee,
      id_profile: employeeList[index]?.id_profile,
      changePassword2: employeeList[index]?.changePassword2,
    };
    // console.log(addData);
    const passData = [addData];
    try {
      await dispatch(updateSystemUserEmployee(passData)).unwrap();
      toastsuccess("Employee Updated Successfully");
      reset();
      dispatch(getSystemUserEmployee({ employee: null }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(getSystemUserEmployee({ employee: null }));
    dispatch(getSystemUserEmployeeDropdown());
    dispatch(getAllProfile());
  }, [dispatch]);

  useEffect(() => {
    reset();
    setEmployeeList(sysUserEmployeeList);
  }, [sysUserEmployeeList]);
  return (
    <React.Fragment>
      <Head title="System User Employees" />
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
            <Col lg="4">
              <div className="form-group">
                <label className="form-label" htmlFor="selectedEmployee">
                  Filter Employee
                </label>
                <ActiveEmployeeDropdown
                  register={register}
                  id={"selectedEmployee"}
                  placeholder={"Employee"}
                  selectedEmployee={selectedEmployee}
                  onEmployeeChange={(val) => {
                    SetSelectedEmployee(val);
                    dispatch(getSystemUserEmployee({ employee: val }));
                  }}
                  isRequired={false}
                  options={employeeOptions}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  classNamePrefix="custom-select"
                />
              </div>
            </Col>
            <Col md={3} className="text-right flex">
              {/* <SaveButton
                disabled={issubmitting}
                size="md"
                color="primary"
                onClick={() => {}}
              >
                {issubmitting ? "Filtering" : "Filter"}
              </SaveButton> */}
            </Col>
          </Row>

          <Row className="g-4 form-control-sm align-center">
            {/* <Col lg="2">
                          <div className="form-group">
                            <label className="form-label" htmlFor="product">
                              Branch
                            </label>
                            <BranchDropdown
                              register={register}
                              id={"filterBranch"}
                              branches={branches}
                              selectedBranch={filterBranch}
                              onBranchChange={(value) => {
                                setFilterBranch(value);
                              }}
                              isRequired={false}
                              clearErrors={clearErrors}
                              setValue={setValue}
                              message={errors.selectedProduct && "Branch is Required"}
                            />
                          </div>
                        </Col> */}
          </Row>

          {issubmitting === true ? (
            <Loading />
          ) : (
            <Row className="mt-2" md={12}>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>S.NO </th>
                      {columns?.map((column, index) => (
                        <th
                          key={index}
                          style={{ textAlign: column?.textAlign }}
                        >
                          {column.header}
                        </th>
                      ))}
                      <th style={{ width: "260px", textAlign: "center" }}>
                        Profile
                      </th>
                      <th style={{ width: "260px", textAlign: "center" }}>
                        Username
                      </th>
                      <th style={{ width: "260px", textAlign: "center" }}>
                        Password
                      </th>
                      <th style={{ width: "260px", textAlign: "center" }}>
                        Con. Password
                      </th>
                      <th style={{ width: "260px", textAlign: "center" }}>
                        Change Password
                      </th>
                      <th style={{ width: "260px", textAlign: "center" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeList?.length > 0 &&
                      employeeList?.map((item, rowIndex) => (
                        <>
                          {item?.showRow == false &&
                            item?.enableChangePass == false && (
                              <tr key={rowIndex}>
                                <td>{rowIndex + 1}</td>
                                <td>{item?.firstname}</td>
                                <td>{item?.mobile}</td>
                                <td>{item?.profile_name}</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td style={{ textAlign: "center" }}>
                                  <Button
                                    color="primary"
                                    size="sm"
                                    className="btn-icon btn-white btn-dim mr-1"
                                    onClick={() =>
                                      handelChange(
                                        rowIndex,
                                        "showRow",
                                        !item?.showRow
                                      )
                                    }
                                  >
                                    <TooltipComponent
                                      containerClassName="btn btn-sm btn-icon btn-trigger"
                                      icon={item?.showRow ? "eye-off" : "edit"}
                                      direction="top"
                                      id={`edit`}
                                      text={"edit"}
                                    />
                                    {/* <Icon name={item?.showRow ? "eye-off" : "edit"} /> */}
                                  </Button>
                                  <Button
                                    color="primary"
                                    size="sm"
                                    className="btn-icon btn-white btn-dim"
                                    onClick={() => {
                                      if (item?.changepass) {
                                        handleSubmit(() =>
                                          editPassFunction(rowIndex)
                                        )();
                                      } else {
                                        handleSubmit(() =>
                                          saveFunction(rowIndex)
                                        )();
                                      }
                                    }}
                                  >
                                    <TooltipComponent
                                      containerClassName="btn btn-sm btn-icon btn-trigger"
                                      icon="save"
                                      direction="top"
                                      id={`save`}
                                      text={"Save"}
                                    />
                                  </Button>
                                </td>
                              </tr>
                            )}

                          {item?.showRow == true &&
                            item?.enableChangePass == false && (
                              <tr key={rowIndex}>
                                <td>{rowIndex + 1}</td>
                                <td>{item?.firstname}</td>
                                <td>{item?.mobile}</td>
                                <td>
                                  <Select
                                    value={
                                      profileDropdownData?.find(
                                        (option) =>
                                          option.value === item?.id_profile
                                      ) || null
                                    }
                                    onChange={(e) => {
                                      handelChange(
                                        rowIndex,
                                        "id_profile",
                                        e?.value
                                      );
                                      setValue(
                                        "id_profile" + rowIndex,
                                        e?.value
                                      );
                                    }}
                                    // onKeyDown={(e) => {
                                    //   if (e.key === "Enter") {
                                    //     // handleSubmit(() =>
                                    //     //   saveFunction(rowIndex)
                                    //     // )();
                                    //     if (item?.showRow === true) {
                                    //       return;
                                    //     }
                                    //     if (item?.showRow !== true) {
                                    //       saveProfileFunction(rowIndex);
                                    //     }
                                    //   }
                                    // }}
                                    options={profileDropdownData}
                                    placeholder="Select Profile type"
                                    id={"id_profile" + rowIndex}
                                    // menuPortalTarget={document.body}
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                        fontSize: "12px",
                                      }),
                                    }}
                                  />
                                  {/* <input
                              type="hidden"
                              value={item?.id_profile}
                              {...register("id_profile" + rowIndex)}
                            /> */}
                                </td>
                                <td>
                                  {" "}
                                  <div className="form-group">
                                    <div className="form-control-wrap">
                                      <input
                                        style={{ width: "200px" }}
                                        id={"username" + rowIndex}
                                        {...register("username" + rowIndex, {
                                          required: "Username is required",
                                        })}
                                        placeholder="Username"
                                        className="form-control form-control-sm"
                                        type="text"
                                        onChange={(event) => {
                                          handelChange(
                                            rowIndex,
                                            "username",
                                            event.target.value
                                          );
                                          setValue(
                                            "username" + rowIndex,
                                            event.target.value
                                          );
                                        }}
                                        value={
                                          item.username !== null &&
                                          item.username !== ""
                                            ? item.username
                                            : ""
                                        }
                                      />
                                      {errors["username" + rowIndex] && (
                                        <span className="invalid">
                                          <Icon
                                            className={"sm"}
                                            name="alert-circle"
                                          />
                                          {
                                            errors["username" + rowIndex]
                                              ?.message
                                          }
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  {" "}
                                  <div className="form-group">
                                    <div
                                      className="form-control-wrap"
                                      style={{
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        width: "fit-content",
                                      }}
                                    >
                                      <input
                                        style={{
                                          width: "200px",
                                          paddingRight: "40px", // space for eye icon
                                        }}
                                        id={"password1" + rowIndex}
                                        {...register("password1" + rowIndex, {
                                          required: "Password is required",
                                          minLength: {
                                            value: 8,
                                            message: "Min Length is 8",
                                          },
                                        })}
                                        placeholder="Password"
                                        className="form-control form-control-sm"
                                        type={
                                          item?.password1show
                                            ? "text"
                                            : "password"
                                        }
                                        onChange={(event) => {
                                          handelChange(
                                            rowIndex,
                                            "password1",
                                            event.target.value
                                          );
                                          setValue(
                                            "password1" + rowIndex,
                                            event.target.value
                                          );
                                        }}
                                        value={
                                          item.password1 !== null &&
                                          item.password1 !== ""
                                            ? item.password1
                                            : ""
                                        }
                                      />

                                      <a
                                        href="#password"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          ev.stopPropagation();
                                          handelChange(
                                            rowIndex,
                                            "password1show",
                                            !item?.password1show
                                          );
                                        }}
                                        style={{
                                          position: "absolute",
                                          right: "10px",
                                          top: "50%",
                                          transform: "translateY(-50%)",
                                          cursor: "pointer",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                        className={`form-icon lg form-icon-right passcode-switch ${
                                          item?.password1show
                                            ? "is-hidden"
                                            : "is-shown"
                                        }`}
                                      >
                                        <Icon
                                          name="eye"
                                          className="passcode-icon icon-show"
                                        ></Icon>
                                        <Icon
                                          name="eye-off"
                                          className="passcode-icon icon-hide"
                                        ></Icon>
                                      </a>

                                      {errors["password1" + rowIndex] && (
                                        <span className="invalid">
                                          <Icon
                                            className={"sm"}
                                            name="alert-circle"
                                          />
                                          {
                                            errors["password1" + rowIndex]
                                              ?.message
                                          }
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  {" "}
                                  <div className="form-group">
                                    <div
                                      className="form-control-wrap"
                                      style={{
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        width: "fit-content",
                                      }}
                                    >
                                      <input
                                        style={{
                                          width: "200px",
                                          paddingRight: "40px", // reserve space for the eye icon
                                        }}
                                        id={"password2" + rowIndex}
                                        {...register("password2" + rowIndex, {
                                          validate: (val) => {
                                            if (
                                              watch("password1" + rowIndex) !=
                                              val
                                            ) {
                                              return "Your passwords do no match";
                                            }
                                          },
                                          required:
                                            "Confirm Password is required",
                                          minLength: {
                                            value: 8,
                                            message: "Min Length is 8",
                                          },
                                        })}
                                        placeholder="Con. Password"
                                        className="form-control form-control-sm"
                                        type={
                                          item?.password2show
                                            ? "text"
                                            : "password"
                                        }
                                        onChange={(event) => {
                                          handelChange(
                                            rowIndex,
                                            "password2",
                                            event.target.value
                                          );
                                          setValue(
                                            "password2" + rowIndex,
                                            event.target.value
                                          );
                                        }}
                                        value={
                                          item.password2 !== null &&
                                          item.password2 !== ""
                                            ? item.password2
                                            : ""
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            handleSubmit(() =>
                                              saveFunction(rowIndex)
                                            )();
                                          }
                                        }}
                                      />

                                      <a
                                        href="#password"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          ev.stopPropagation();
                                          handelChange(
                                            rowIndex,
                                            "password2show",
                                            !item?.password2show
                                          );
                                        }}
                                        style={{
                                          position: "absolute",
                                          right: "10px",
                                          top: "50%",
                                          transform: "translateY(-50%)",
                                          cursor: "pointer",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                        className={`form-icon lg form-icon-right passcode-switch ${
                                          item?.password2show
                                            ? "is-hidden"
                                            : "is-shown"
                                        }`}
                                      >
                                        <Icon
                                          name="eye"
                                          className="passcode-icon icon-show"
                                        ></Icon>
                                        <Icon
                                          name="eye-off"
                                          className="passcode-icon icon-hide"
                                        ></Icon>
                                      </a>

                                      {errors["password2" + rowIndex] && (
                                        <span className="invalid">
                                          <Icon
                                            className={"sm"}
                                            name="alert-circle"
                                          />
                                          {
                                            errors["password2" + rowIndex]
                                              ?.message
                                          }
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td>-</td>
                                <td style={{ textAlign: "center" }}>
                                  <Button
                                    color="primary"
                                    size="sm"
                                    className="btn-icon btn-white btn-dim mr-1"
                                    onClick={() =>
                                      handelChange(
                                        rowIndex,
                                        "showRow",
                                        !item?.showRow
                                      )
                                    }
                                  >
                                    <TooltipComponent
                                      containerClassName="btn btn-sm btn-icon btn-trigger"
                                      icon={item?.showRow ? "eye-off" : "edit"}
                                      direction="top"
                                      id={`edit`}
                                      text={"edit"}
                                    />
                                    {/* <Icon name={item?.showRow ? "eye-off" : "edit"} /> */}
                                  </Button>
                                  <Button
                                    color="primary"
                                    size="sm"
                                    className="btn-icon btn-white btn-dim"
                                    onClick={() => {
                                      if (item?.changepass) {
                                        handleSubmit(() =>
                                          editPassFunction(rowIndex)
                                        )();
                                      } else {
                                        handleSubmit(() =>
                                          saveFunction(rowIndex)
                                        )();
                                      }
                                    }}
                                  >
                                    <TooltipComponent
                                      containerClassName="btn btn-sm btn-icon btn-trigger"
                                      icon="save"
                                      direction="top"
                                      id={`save`}
                                      text={"Save"}
                                    />
                                  </Button>
                                </td>
                              </tr>
                            )}

                          {item?.showRow == false &&
                            item?.enableChangePass == true && (
                              <tr key={rowIndex}>
                                <td>{rowIndex + 1}</td>
                                <td>{item?.firstname}</td>
                                <td>{item?.mobile}</td>
                                <td>{item?.profile_name}</td>
                                <td>{item?.username}</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td style={{ textAlign: "center" }}>
                                  <Button
                                    color="primary"
                                    size="sm"
                                    className="btn-icon btn-white btn-dim mr-1"
                                    onClick={() =>
                                      handelChange(
                                        rowIndex,
                                        "showRow",
                                        !item?.showRow
                                      )
                                    }
                                  >
                                    <TooltipComponent
                                      containerClassName="btn btn-sm btn-icon btn-trigger"
                                      icon={item?.showRow ? "eye-off" : "edit"}
                                      direction="top"
                                      id={`edit`}
                                      text={"edit"}
                                    />
                                    {/* <Icon name={item?.showRow ? "eye-off" : "edit"} /> */}
                                  </Button>
                                  <Button
                                    color="primary"
                                    size="sm"
                                    className="btn-icon btn-white btn-dim"
                                    onClick={() => {
                                      if (item?.changepass) {
                                        handleSubmit(() =>
                                          editPassFunction(rowIndex)
                                        )();
                                      } else {
                                        handleSubmit(() =>
                                          saveFunction(rowIndex)
                                        )();
                                      }
                                    }}
                                  >
                                    <TooltipComponent
                                      containerClassName="btn btn-sm btn-icon btn-trigger"
                                      icon="save"
                                      direction="top"
                                      id={`save`}
                                      text={"Save"}
                                    />
                                  </Button>
                                </td>
                              </tr>
                            )}

                          {item?.showRow == true &&
                            item?.enableChangePass == true && (
                              <tr key={rowIndex}>
                                <td>{rowIndex + 1}</td>
                                <td>{item?.firstname}</td>
                                <td>{item?.mobile}</td>
                                <td>
                                  <Select
                                    value={
                                      profileDropdownData?.find(
                                        (option) =>
                                          option.value === item?.id_profile
                                      ) || null
                                    }
                                    onChange={(e) => {
                                      handelChange(
                                        rowIndex,
                                        "id_profile",
                                        e?.value
                                      );
                                      setValue(
                                        "id_profile" + rowIndex,
                                        e?.value
                                      );
                                    }}
                                    // onKeyDown={(e) => {
                                    //   if (e.key === "Enter") {
                                    //     // handleSubmit(() =>
                                    //     //   saveFunction(rowIndex)
                                    //     // )();
                                    //     if (item?.showRow === true) {
                                    //       return;
                                    //     }
                                    //     if (item?.showRow !== true) {
                                    //       saveProfileFunction(rowIndex);
                                    //     }
                                    //   }
                                    // }}
                                    options={profileDropdownData}
                                    placeholder="Select Profile type"
                                    id={"id_profile" + rowIndex}
                                    menuPortalTarget={document.body}
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                        fontSize: "12px",
                                      }),
                                    }}
                                  />
                                  {/* <input
                              type="hidden"
                              value={item?.id_profile}
                              {...register("id_profile" + rowIndex)}
                            /> */}
                                </td>
                                <td>
                                  {" "}
                                  <div className="form-group">
                                    <div className="form-control-wrap">
                                      <input
                                        style={{ width: "200px" }}
                                        id={"newUsername" + rowIndex}
                                        {...register("newUsername" + rowIndex, {
                                          required: "Username is required",
                                        })}
                                        placeholder="Username"
                                        className="form-control form-control-sm"
                                        type="text"
                                        onChange={(event) => {
                                          handelChange(
                                            rowIndex,
                                            "newUsername",
                                            event.target.value
                                          );
                                          setValue(
                                            "newUsername" + rowIndex,
                                            event.target.value
                                          );
                                        }}
                                        value={
                                          item.newUsername !== null &&
                                          item.newUsername !== ""
                                            ? item.newUsername
                                            : ""
                                        }
                                      />
                                      {errors["newUsername" + rowIndex] && (
                                        <span className="invalid">
                                          <Icon
                                            className={"sm"}
                                            name="alert-circle"
                                          />
                                          {
                                            errors["newUsername" + rowIndex]
                                              ?.message
                                          }
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                {item?.changepass === true ? (
                                  <>
                                    <td>
                                      {" "}
                                      <div className="form-group">
                                        <div
                                          className="form-control-wrap"
                                          style={{
                                            position: "relative",
                                            display: "flex",
                                            alignItems: "center",
                                            width: "fit-content",
                                          }}
                                        >
                                          <input
                                            style={{
                                              width: "200px",
                                              paddingRight: "40px", // reserve space for the eye icon
                                            }}
                                            id={"changePassword1" + rowIndex}
                                            {...register(
                                              "changePassword1" + rowIndex,
                                              {
                                                required:
                                                  "Password is required",
                                                minLength: {
                                                  value: 8,
                                                  message: "Min Length is 8",
                                                },
                                              }
                                            )}
                                            placeholder="Password"
                                            className="form-control form-control-sm"
                                            type={
                                              item?.changePassword1show
                                                ? "text"
                                                : "password"
                                            }
                                            onChange={(event) => {
                                              handelChange(
                                                rowIndex,
                                                "changePassword1",
                                                event.target.value
                                              );
                                              setValue(
                                                "changePassword1" + rowIndex,
                                                event.target.value
                                              );
                                            }}
                                            value={
                                              item.changePassword1 !== null &&
                                              item.changePassword1 !== ""
                                                ? item.changePassword1
                                                : ""
                                            }
                                          />

                                          <a
                                            href="#password"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              ev.stopPropagation();
                                              handelChange(
                                                rowIndex,
                                                "changePassword1show",
                                                !item?.changePassword1show
                                              );
                                            }}
                                            style={{
                                              position: "absolute",
                                              right: "10px",
                                              top: "50%",
                                              transform: "translateY(-50%)",
                                              cursor: "pointer",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                            }}
                                            className={`form-icon lg form-icon-right passcode-switch ${
                                              item?.changePassword1show
                                                ? "is-hidden"
                                                : "is-shown"
                                            }`}
                                          >
                                            <Icon
                                              name="eye"
                                              className="passcode-icon icon-show"
                                            />
                                            <Icon
                                              name="eye-off"
                                              className="passcode-icon icon-hide"
                                            />
                                          </a>

                                          {errors[
                                            "changePassword1" + rowIndex
                                          ] && (
                                            <span className="invalid">
                                              <Icon
                                                className={"sm"}
                                                name="alert-circle"
                                              />
                                              {
                                                errors[
                                                  "changePassword1" + rowIndex
                                                ]?.message
                                              }
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      {" "}
                                      <div className="form-group">
                                        <div
                                          className="form-control-wrap"
                                          style={{
                                            position: "relative",
                                            display: "flex",
                                            alignItems: "center",
                                            width: "fit-content",
                                          }}
                                        >
                                          <input
                                            style={{
                                              width: "200px",
                                              paddingRight: "40px", // space for the eye icon
                                            }}
                                            id={"changePassword2" + rowIndex}
                                            {...register(
                                              "changePassword2" + rowIndex,
                                              {
                                                validate: (val) => {
                                                  if (
                                                    watch(
                                                      "changePassword1" +
                                                        rowIndex
                                                    ) !== val
                                                  ) {
                                                    return "Your passwords do not match";
                                                  }
                                                },
                                                required:
                                                  "Confirm Password is required",
                                                minLength: {
                                                  value: 8,
                                                  message: "Min Length is 8",
                                                },
                                              }
                                            )}
                                            placeholder="Con. Password"
                                            className="form-control form-control-sm"
                                            type={
                                              item?.changePassword2show
                                                ? "text"
                                                : "password"
                                            }
                                            onChange={(event) => {
                                              handelChange(
                                                rowIndex,
                                                "changePassword2",
                                                event.target.value
                                              );
                                              setValue(
                                                "changePassword2" + rowIndex,
                                                event.target.value
                                              );
                                            }}
                                            value={
                                              item.changePassword2 !== null &&
                                              item.changePassword2 !== ""
                                                ? item.changePassword2
                                                : ""
                                            }
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") {
                                                handleSubmit(() =>
                                                  editPassFunction(rowIndex)
                                                )();
                                              }
                                            }}
                                          />

                                          <a
                                            href="#password"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              ev.stopPropagation();
                                              handelChange(
                                                rowIndex,
                                                "changePassword2show",
                                                !item?.changePassword2show
                                              );
                                            }}
                                            style={{
                                              position: "absolute",
                                              right: "10px",
                                              top: "50%",
                                              transform: "translateY(-50%)",
                                              cursor: "pointer",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                            }}
                                            className={`form-icon lg form-icon-right passcode-switch ${
                                              item?.changePassword2show
                                                ? "is-hidden"
                                                : "is-shown"
                                            }`}
                                          >
                                            <Icon
                                              name="eye"
                                              className="passcode-icon icon-show"
                                            />
                                            <Icon
                                              name="eye-off"
                                              className="passcode-icon icon-hide"
                                            />
                                          </a>

                                          {errors[
                                            "changePassword2" + rowIndex
                                          ] && (
                                            <span className="invalid">
                                              <Icon
                                                className={"sm"}
                                                name="alert-circle"
                                              />
                                              {
                                                errors[
                                                  "changePassword2" + rowIndex
                                                ]?.message
                                              }
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td>-</td>
                                    <td>-</td>
                                  </>
                                )}

                                <td>
                                  {" "}
                                  <div className="form-group">
                                    <div className="custom-control custom-control-sm custom-switch">
                                      <input
                                        type="checkbox"
                                        {...register("changepass" + rowIndex, {
                                          required: {
                                            value: false,
                                          },
                                        })}
                                        className="custom-control-input "
                                        name="changepass"
                                        id={"changepass" + rowIndex}
                                        checked={item?.changepass}
                                        onChange={(e) => {
                                          handelChange(
                                            rowIndex,
                                            "changepass",
                                            e.target.checked
                                          );
                                          setValue(
                                            "changepass" + rowIndex,
                                            e.target.checked
                                          );
                                        }}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor={"changepass" + rowIndex}
                                      >
                                        {item?.changepass == true
                                          ? "Yes"
                                          : "No"}
                                      </label>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <Button
                                    color="primary"
                                    size="sm"
                                    className="btn-icon btn-white btn-dim mr-1"
                                    onClick={() =>
                                      handelChange(
                                        rowIndex,
                                        "showRow",
                                        !item?.showRow
                                      )
                                    }
                                  >
                                    <TooltipComponent
                                      containerClassName="btn btn-sm btn-icon btn-trigger"
                                      icon={item?.showRow ? "eye-off" : "edit"}
                                      direction="top"
                                      id={`edit`}
                                      text={"edit"}
                                    />
                                    {/* <Icon name={item?.showRow ? "eye-off" : "edit"} /> */}
                                  </Button>
                                  <Button
                                    color="primary"
                                    size="sm"
                                    className="btn-icon btn-white btn-dim"
                                    onClick={() => {
                                      // if (item?.changepass) {
                                      handleSubmit(() =>
                                        editPassFunction(rowIndex)
                                      )();
                                      // } else {
                                      //   handleSubmit(() =>
                                      //     saveFunction(rowIndex)
                                      //   )();
                                      // }
                                    }}
                                  >
                                    <TooltipComponent
                                      containerClassName="btn btn-sm btn-icon btn-trigger"
                                      icon="save"
                                      direction="top"
                                      id={`save`}
                                      text={"Save"}
                                    />
                                  </Button>
                                </td>
                              </tr>
                            )}
                        </>
                      ))}

                    {employeeList?.length === 0 && (
                      <tr>
                        <td
                          colSpan={columns.length + 7}
                          style={{ textAlign: "center" }}
                        >
                          No employees found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Row>
          )}
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default SystemUserEmployeeList;
