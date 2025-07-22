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

const renderPasswordFields = (
  item,
  rowIndex,
  register,
  errors,
  handleChange,
  setValue
) => {
  if (!item.showRow || !item.enableChangePass)
    return [<td key="pass">-</td>, <td key="conPass">-</td>];

  return [
    <td key="pass">
      <input
        type="password"
        className="form-control form-control-sm"
        {...register(`password-${rowIndex}`, { required: "Password required" })}
        onChange={(e) => {
          handleChange(rowIndex, "password", e.target.value);
          setValue(`password-${rowIndex}`, e.target.value);
        }}
        value={item.password || ""}
      />
      {errors[`password-${rowIndex}`] && (
        <span className="invalid">
          {errors[`password-${rowIndex}`]?.message}
        </span>
      )}
    </td>,
    <td key="conPass">
      <input
        type="password"
        className="form-control form-control-sm"
        {...register(`confirmPassword-${rowIndex}`, {
          required: "Confirm Password required",
          validate: (val) => val === item.password || "Passwords do not match",
        })}
        onChange={(e) => {
          handleChange(rowIndex, "confirmPassword", e.target.value);
          setValue(`confirmPassword-${rowIndex}`, e.target.value);
        }}
        value={item.confirmPassword || ""}
      />
      {errors[`confirmPassword-${rowIndex}`] && (
        <span className="invalid">
          {errors[`confirmPassword-${rowIndex}`]?.message}
        </span>
      )}
    </td>,
  ];
};

const SystemUserEmployeeList2 = () => {
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
      updateType: employeeList[index]?.updateType,
      id_employee: employeeList[index]?.id_employee,
      firstname: employeeList[index]?.firstname,
      lastname: employeeList[index]?.lastname,
      email: employeeList[index]?.email,
      profile: employeeList[index]?.profile,
      id_profile: employeeList[index]?.id_profile,
      password2: employeeList[index]?.password2,
      username: employeeList[index]?.username,
      newUsername: employeeList[index]?.newUsername,
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
      user: employeeList[index]?.user,
      id_employee: employeeList[index]?.id_employee,
      id_profile: employeeList[index]?.id_profile,
      changePassword2: employeeList[index]?.changePassword2,
    };
    // console.log(addData);
    const passData = [addData];
    try {
      await dispatch(updateSystemUserEmployeePassword(passData)).unwrap();
      toastsuccess("Employee Password Updated Successfully");
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

  // const renderPasswordFields = (item, rowIndex) => {
  //   if (!item?.showRow) {
  //     return (
  //       <>
  //         <td style={{ textAlign: "center" }}>-</td>
  //         <td style={{ textAlign: "center" }}>-</td>
  //       </>
  //     );
  //   }

  //   if (item?.changepass == false && item?.showRow && item?.enableChangePass) {
  //     return (
  //       <>
  //         <td style={{ textAlign: "center" }}>-</td>
  //         <td style={{ textAlign: "center" }}>-</td>
  //       </>
  //     );
  //   }

  //   if (item?.changepass == true && item?.showRow && item?.enableChangePass) {
  //     return (
  //       <>
  //         {/* Password Column */}
  //         <td style={{ textAlign: "center" }}>
  //           <PasswordInput
  //             id={`password1-${rowIndex}`}
  //             name={`password1-${rowIndex}`}
  //             value={item.password1 || ""}
  //             showPassword={item.password1show}
  //             onChange={(value) => {
  //               handelChange(rowIndex, "password1", value);
  //               setValue(`password1-${rowIndex}`, value);
  //             }}
  //             onToggleShow={() =>
  //               handelChange(rowIndex, "password1show", !item.password1show)
  //             }
  //             register={register}
  //             errors={errors}
  //             required
  //           />
  //         </td>

  //         {/* Confirm Password Column */}
  //         <td style={{ textAlign: "center" }}>
  //           <PasswordInput
  //             id={`password2-${rowIndex}`}
  //             name={`password2-${rowIndex}`}
  //             value={item.password2 || ""}
  //             showPassword={item.password2show}
  //             onChange={(value) => {
  //               handelChange(rowIndex, "password2", value);
  //               setValue(`password2-${rowIndex}`, value);
  //             }}
  //             onToggleShow={() =>
  //               handelChange(rowIndex, "password2show", !item.password2show)
  //             }
  //             register={register}
  //             errors={errors}
  //             validate={(val) =>
  //               watch(`password1-${rowIndex}`) !== val
  //                 ? "Passwords don't match"
  //                 : undefined
  //             }
  //             required
  //           />
  //         </td>
  //       </>
  //     );
  //   }
  //   return (
  //     <>
  //       {/* Password Column */}
  //       <td style={{ textAlign: "center" }}>
  //         <PasswordInput
  //           id={`password1-${rowIndex}`}
  //           name={`password1-${rowIndex}`}
  //           value={item.password1 || ""}
  //           showPassword={item.password1show}
  //           onChange={(value) => {
  //             handelChange(rowIndex, "password1", value);
  //             setValue(`password1-${rowIndex}`, value);
  //           }}
  //           onToggleShow={() =>
  //             handelChange(rowIndex, "password1show", !item.password1show)
  //           }
  //           register={register}
  //           errors={errors}
  //           required
  //         />
  //       </td>

  //       {/* Confirm Password Column */}
  //       <td style={{ textAlign: "center" }}>
  //         <PasswordInput
  //           id={`password2-${rowIndex}`}
  //           name={`password2-${rowIndex}`}
  //           value={item.password2 || ""}
  //           showPassword={item.password2show}
  //           onChange={(value) => {
  //             handelChange(rowIndex, "password2", value);
  //             setValue(`password2-${rowIndex}`, value);
  //           }}
  //           onToggleShow={() =>
  //             handelChange(rowIndex, "password2show", !item.password2show)
  //           }
  //           register={register}
  //           errors={errors}
  //           validate={(val) =>
  //             watch(`password1-${rowIndex}`) !== val
  //               ? "Passwords don't match"
  //               : undefined
  //           }
  //           required
  //         />
  //       </td>
  //     </>
  //   );
  // };

  // // PasswordInput component
  // const PasswordInput = ({
  //   id,
  //   name,
  //   value,
  //   showPassword,
  //   onChange,
  //   onToggleShow,
  //   register,
  //   errors,
  //   validate,
  //   required,
  // }) => (
  //   <div className="form-group" style={{ position: "relative" }}>
  //     <input
  //       id={id}
  //       {...register(name, {
  //         required: required ? "Password is required" : false,
  //         minLength: { value: 8, message: "Min 8 characters" },
  //         validate,
  //       })}
  //       className="form-control form-control-sm"
  //       type={showPassword ? "text" : "password"}
  //       value={value}
  //       onChange={(e) => onChange(e.target.value)}
  //       style={{ paddingRight: "30px" }}
  //     />
  //     <span
  //       onClick={onToggleShow}
  //       style={{
  //         position: "absolute",
  //         right: "10px",
  //         top: "50%",
  //         transform: "translateY(-50%)",
  //         cursor: "pointer",
  //       }}
  //     >
  //       <Icon name={showPassword ? "eye-off" : "eye"} />
  //     </span>
  //     {errors[name] && (
  //       <div className="invalid-feedback" style={{ display: "block" }}>
  //         {errors[name].message}
  //       </div>
  //     )}
  //   </div>
  // );
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
                <table
                  className="table table-bordered"
                  style={{ tableLayout: "fixed" }}
                >
                  <thead>
                    <tr>
                      <th style={{ width: "60px" }}>S.NO</th>
                      {columns?.map((column, index) => (
                        <th
                          key={index}
                          style={{
                            textAlign: column?.textAlign || "left",
                            width: column.width || "150px",
                          }}
                        >
                          {column.header}
                        </th>
                      ))}
                      <th style={{ width: "200px", textAlign: "center" }}>
                        Profile
                      </th>
                      <th style={{ width: "150px", textAlign: "center" }}>
                        Username
                      </th>
                      <th style={{ width: "150px", textAlign: "center" }}>
                        Password
                      </th>
                      <th style={{ width: "150px", textAlign: "center" }}>
                        Con. Password
                      </th>
                      <th style={{ width: "150px", textAlign: "center" }}>
                        Change Password
                      </th>
                      <th style={{ width: "120px", textAlign: "center" }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeList?.length > 0 ? (
                      employeeList?.map((item, rowIndex) => (
                        <tr
                          key={item.id || rowIndex}
                          style={{ cursor: "pointer" }}
                        >
                          {/* S.NO Column */}
                          <td>{rowIndex + 1}</td>

                          {/* Name Column */}
                          <td>{item?.firstname || "-"}</td>

                          {/* Mobile Column */}
                          <td>{item?.mobile || "-"}</td>

                          {/* Profile Column */}
                          <td style={{ textAlign: "center" }}>
                            {item?.showRow ? (
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
                                  setValue("id_profile" + rowIndex, e?.value);
                                }}
                                options={profileDropdownData}
                                placeholder="Select Profile"
                                menuPortalTarget={document.body}
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                    fontSize: "12px",
                                  }),
                                }}
                              />
                            ) : (
                              item?.profile_name || "-"
                            )}
                          </td>

                          {/* Username Column */}
                          <td style={{ textAlign: "center" }}>
                            {item?.showRow && item?.enableChangePass ? (
                              <div className="form-group">
                                <input
                                  id={`newUsername-${rowIndex}`}
                                  {...register(`newUsername-${rowIndex}`, {
                                    required: "Username is required",
                                  })}
                                  className="form-control form-control-sm"
                                  type="text"
                                  onChange={(e) => {
                                    handelChange(
                                      rowIndex,
                                      "newUsername",
                                      e.target.value
                                    );
                                    setValue(
                                      `newUsername-${rowIndex}`,
                                      e.target.value
                                    );
                                  }}
                                  value={item.newUsername || ""}
                                />
                                {errors[`newUsername-${rowIndex}`] && (
                                  <span className="invalid">
                                    {errors[`newUsername-${rowIndex}`]?.message}
                                  </span>
                                )}
                              </div>
                            ) : item?.showRow && !item?.enableChangePass ? (
                              <div className="form-group">
                                <input
                                  id={`username-${rowIndex}`}
                                  {...register(`username-${rowIndex}`, {
                                    required: "Username is required",
                                  })}
                                  className="form-control form-control-sm"
                                  type="text"
                                  onChange={(e) => {
                                    handelChange(
                                      rowIndex,
                                      "username",
                                      e.target.value
                                    );
                                    setValue(
                                      `username-${rowIndex}`,
                                      e.target.value
                                    );
                                  }}
                                  value={item.username || ""}
                                />
                                {errors[`username-${rowIndex}`] && (
                                  <span className="invalid">
                                    {errors[`username-${rowIndex}`]?.message}
                                  </span>
                                )}
                              </div>
                            ) : (
                              item?.username || "-"
                            )}
                          </td>

                          {/* Password Fields Columns */}
                          {/* {renderPasswordFields(item, rowIndex)} */}
                          {renderPasswordFields(
                            item,
                            rowIndex,
                            register,
                            errors,
                            handelChange,
                            setValue
                          )}

                          {/* Change Password Toggle */}
                          <td style={{ textAlign: "center" }}>
                            {item?.enableChangePass ? (
                              <div className="custom-control custom-control-sm custom-switch">
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id={`changepass-${rowIndex}`}
                                  checked={item?.changepass || false}
                                  onChange={(e) => {
                                    handelChange(
                                      rowIndex,
                                      "changepass",
                                      e.target.checked
                                    );
                                    setValue(
                                      `changepass-${rowIndex}`,
                                      e.target.checked
                                    );
                                  }}
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor={`changepass-${rowIndex}`}
                                >
                                  {item?.changepass ? "Yes" : "No"}
                                </label>
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>

                          {/* Action Column */}
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
                                  handleSubmit(() => saveFunction(rowIndex))();
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
                      ))
                    ) : (
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

export default SystemUserEmployeeList2;
