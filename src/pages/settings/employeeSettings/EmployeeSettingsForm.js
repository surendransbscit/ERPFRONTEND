import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import { PreviewCard, SaveButton } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { Col, Icon, Row } from "../../../components/Component";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useEmployeeDropdown } from "../../../components/filters/filterHooks";
import { Button } from "reactstrap";
import Select from "react-select";
import {
  getEmployeeSettings,
  updateEmployeeSettings,
} from "../../../redux/thunks/employee";
import DatePicker from "react-datepicker";
import "../../../assets/css/datePicker.css";
import { getAllProfile } from "../../../redux/thunks/retailMaster";
import { useHotkeys } from "react-hotkeys-hook";
import { getPagePermission } from "../../../redux/thunks/coreComponent";

const EmployeeSettingsForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let title = location?.state?.title;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const dispatch = useDispatch();
  const { isLoading: issubmitting } = useSelector(
    (state) => state.employeeSettingsReducer
  );
  const { employeeSettingsList } = useSelector(
    (state) => state.employeeSettingsReducer
  );
  const { profileList } = useSelector((state) => state.profileReducer);

  const { employees } = useEmployeeDropdown();

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

  let showDiscLimitTypeOptions = [
    {
      label: "Amount",
      value: "1",
    },
    {
      label: "Percent",
      value: "2",
    },
  ];

  let allowOptions = [
    {
      label: "Yes",
      value: 1,
    },
    {
      label: "No",
      value: 0,
    },
  ];

  const profileDropdownData = profileList?.rows?.map((obj) => {
    const container = {};
    container.label = obj.profile_name;
    container.value = obj.id_profile;
    return container;
  });

  const [employee, SetEmployee] = useState(null);
  const [profileType, SetProfileType] = useState(null);
  const [emp_settings, setemp_settings] = useState([]);

  useEffect(() => {
    const employee_settings = employeeSettingsList?.map((obj) => {
      const container = {};
      container.id = obj.id;
      container.employee = obj.employee;
      container.id_employee = obj.id_employee;
      container.disc_limit_type = obj.disc_limit_type;
      container.disc_limit = obj.disc_limit;
      container.allow_branch_transfer = obj.allow_branch_transfer;
      container.allow_pur_det_add_in_pur_entry =
        obj.allow_pur_det_add_in_pur_entry;
      container.allow_day_close = obj.allow_day_close;
      if (obj.access_time_from) {
        const [hours, minutes, seconds] = obj.access_time_from?.split(":");
        const now = new Date();
        container.access_time_from = new Date(
          now?.getFullYear(),
          now?.getMonth(),
          now?.getDate(),
          hours,
          minutes,
          seconds
        );
      }

      if (obj.access_time_to) {
        const [hours, minutes, seconds] = obj.access_time_to?.split(":");
        const now = new Date();
        container.access_time_to = new Date(
          now?.getFullYear(),
          now?.getMonth(),
          now?.getDate(),
          hours,
          minutes,
          seconds
        );
      }

      return container;
    });
    setemp_settings(employee_settings);
  }, [employeeSettingsList]);

  const editEmpSettings = ({ name, val, id, ...params }) => {
    setemp_settings((prevState) =>
      prevState?.map((obj) => {
        if (obj?.id == id) {
          setValue(`${name + obj.id}`, val);
          return { ...obj, [name]: val };
        }
        return obj;
      })
    );
  };

  // const parseTimeToDate = (timeString) => {
  //   const [hours, minutes, seconds] = timeString?.split(":");
  //   const now = new Date();
  //   return new Date(now?.getFullYear(), now?.getMonth(), now?.getDate(), hours, minutes, seconds);
  // };

  const postData = async () => {
    const editData = emp_settings?.filter((item) => item.selected == true);
    const employee_settings = editData?.map((obj) => {
      const container = {};
      container.id = obj.id;
      container.id_employee = obj.id_employee;
      container.disc_limit_type = obj.disc_limit_type?.value;
      container.disc_limit = obj.disc_limit;
      container.allow_branch_transfer = obj.allow_branch_transfer?.value;
      container.allow_pur_det_add_in_pur_entry =
        obj.allow_pur_det_add_in_pur_entry?.value;
      container.allow_day_close = obj.allow_day_close?.value;
      container.menu_style = obj?.menu_style;
      if (obj.access_time_from) {
        const fromDate = new Date(obj.access_time_from);
        container.access_time_from = fromDate.toTimeString().split(" ")[0];
      }

      if (obj.access_time_to) {
        const toDate = new Date(obj.access_time_to);
        container.access_time_to = toDate.toTimeString().split(" ")[0];
      }

      return container;
    });
    const adddata = {
      employee_settings,
    };

    try {
      await dispatch(updateEmployeeSettings(adddata)).unwrap();
      toastsuccess("Employee Settings updated successfully");
      dispatch(getEmployeeSettings({}));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(getAllProfile());
    dispatch(getEmployeeSettings({}));
  }, [dispatch]);

  return (
    <React.Fragment>
      <Head title={title ? title : "Employeee Settings"} />
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
            <Col md={5} className="text-right flex">
              <SaveButton
                disabled={issubmitting || !pagePermission?.edit}
                size="md"
                color="primary"
                onClick={handleSubmit((data) => postData(data, "save"))}
              >
                {issubmitting ? "Saving" : "Save "}
              </SaveButton>

              <Button
                disabled={issubmitting}
                color="secondary"
                size="md"
                onClick={() =>
                  dispatch(
                    getEmployeeSettings({
                      profiletype: profileType?.value,
                      employee: employee?.value,
                    })
                  )
                }
              >
                {issubmitting ? "FILTERING ...." : "FILTER"}
              </Button>
            </Col>
          </Row>
          {/* <div className="custom-grid"> */}
          <Row className="g-3 form-control-sm align-center">
            <Col lg="2">
              <div className="form-group">
                <label className="form-label" htmlFor="employee">
                  Employee
                </label>
                <div className="form-control-wrap">
                  <Select
                    value={employee}
                    onChange={(e) => {
                      SetEmployee(e);
                      SetProfileType(null);
                    }}
                    options={employees}
                    placeholder="Select Employee"
                    id={`employee`}
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
                    value={employee}
                    {...register(`employee`)}
                  />
                </div>
              </div>
            </Col>
            <Col lg="2">
              <div className="form-group">
                <label className="form-label" htmlFor="profileType">
                  Profile
                </label>
                <div className="form-control-wrap">
                  <Select
                    value={profileType}
                    onChange={(e) => {
                      SetProfileType(e);
                      SetEmployee(null);
                    }}
                    options={profileDropdownData}
                    placeholder="Select Profile type"
                    id={`profileType`}
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
                    value={profileType}
                    {...register(`profileType`)}
                  />
                </div>
              </div>
            </Col>
          </Row>
          {/* <Row md={12} className="form-group mt-1 row g-4 " > */}
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
                    #
                  </th>
                  <th
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    Employee
                  </th>
                  <th
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    Disc Limit type
                  </th>
                  <th
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    Disc Limit
                  </th>
                  <th
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    Allow Purchase Details
                  </th>
                  <th
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    Allow Branch Transfer
                  </th>
                  <th
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    Allow Day close
                  </th>
                  <th
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    Access Time from
                  </th>
                  <th
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    Access Time to
                  </th>
                </tr>
              </thead>
              <tbody>
                {emp_settings?.map((obj, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        {" "}
                        <td>
                          <div className="custom-control custom-control-sm custom-checkbox notext">
                            <input
                              type="checkbox"
                              className="custom-control-input form-control"
                              id={`selected${obj.id}`}
                              checked={obj?.selected}
                              onChange={(e) =>
                                editEmpSettings({
                                  id: obj?.id,
                                  name: "selected",
                                  val: e.target.checked,
                                })
                              }
                            />
                            <label
                              className="custom-control-label"
                              htmlFor={`selected${obj.id}`}
                            ></label>
                          </div>
                        </td>
                      </td>
                      <td>{obj.employee}</td>
                      <td>
                        <div className="form-group">
                          <div className="form-control-wrap">
                            <Select
                              value={obj?.disc_limit_type}
                              options={showDiscLimitTypeOptions}
                              onChange={(e) =>
                                editEmpSettings({
                                  id: obj?.id,
                                  name: "disc_limit_type",
                                  val: e,
                                })
                              }
                              placeholder="Select Disc limit type"
                              name="disc_limit_type"
                              id={`disc_limit_type${obj.id}`}
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
                              value={obj?.disc_limit_type}
                              {...register(`disc_limit_type${obj.id}`)}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <input
                          {...register(`disc_limit${obj.id}`, {
                            required: "Required",
                          })}
                          min={0}
                          step={0.001}
                          name="disc_limit"
                          onChange={(e) =>
                            editEmpSettings({
                              id: obj?.id,
                              name: "disc_limit",
                              val: e?.target?.value,
                            })
                          }
                          onKeyDown={(evt) =>
                            ["e", "E", "+", "-"].includes(evt.key) &&
                            evt.preventDefault()
                          }
                          className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                          type="number"
                          value={obj?.disc_limit}
                        />
                        {errors?.[`disc_limit${String(obj.id)}`] && (
                          <span className="text-danger">
                            <Icon className={"sm"} name="alert-circle" />
                            {errors?.[`disc_limit${String(obj.id)}`].message}
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="form-group">
                          <div className="form-control-wrap">
                            <Select
                              value={obj?.allow_pur_det_add_in_pur_entry}
                              options={allowOptions}
                              placeholder="Select Allow branch transfer"
                              id={`allow_pur_det_add_in_pur_entry${obj.id_emp_settings}`}
                              onChange={(e) =>
                                editEmpSettings({
                                  id: obj?.id,
                                  name: "allow_pur_det_add_in_pur_entry",
                                  val: e,
                                })
                              }
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
                              value={obj?.allow_pur_det_add_in_pur_entry}
                              {...register(
                                `allow_pur_det_add_in_pur_entry${obj.id_emp_settings}`
                              )}
                            />
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="form-group">
                          <div className="form-control-wrap">
                            <Select
                              value={obj?.allow_branch_transfer}
                              options={allowOptions}
                              placeholder="Select Allow branch transfer"
                              id={`allow_branch_transfer${obj.id_emp_settings}`}
                              onChange={(e) =>
                                editEmpSettings({
                                  id: obj?.id,
                                  name: "allow_branch_transfer",
                                  val: e,
                                })
                              }
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
                              value={obj?.allow_branch_transfer}
                              {...register(
                                `allow_branch_transfer${obj.id_emp_settings}`
                              )}
                            />
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="form-group">
                          <div className="form-control-wrap">
                            <Select
                              value={obj?.allow_day_close}
                              options={allowOptions}
                              placeholder="Select Allow day close"
                              onChange={(e) =>
                                editEmpSettings({
                                  id: obj?.id,
                                  name: "allow_day_close",
                                  val: e,
                                })
                              }
                              id={`allow_day_close${obj.id_emp_settings}`}
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
                              value={obj?.allow_day_close}
                              {...register(
                                `allow_day_close${obj.id_emp_settings}`
                              )}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="form-group">
                          <div className="form-control-wrap has-timepicker focused">
                            <DatePicker
                              // selected={obj?.access_time_from ? parseTimeToDate(obj.access_time_from) : null}
                              selected={obj?.access_time_from}
                              showTimeSelect
                              onChange={(e) =>
                                editEmpSettings({
                                  id: obj?.id,
                                  name: "access_time_from",
                                  val: e,
                                })
                              }
                              showTimeSelectOnly
                              timeIntervals={15}
                              dateFormat="h:mm aa"
                              className=" form-control"
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="form-group">
                          <div className="form-control-wrap has-timepicker focused">
                            <DatePicker
                              // selected={obj?.access_time_to ? parseTimeToDate(obj?.access_time_to) : null}
                              selected={obj?.access_time_to}
                              showTimeSelect
                              showTimeSelectOnly
                              onChange={(e) =>
                                editEmpSettings({
                                  id: obj?.id,
                                  name: "access_time_to",
                                  val: e,
                                })
                              }
                              timeIntervals={15}
                              dateFormat="h:mm aa"
                              className=" form-control"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* </Row> */}
          {/* </div> */}
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default EmployeeSettingsForm;
