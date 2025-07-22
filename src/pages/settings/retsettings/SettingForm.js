import React, { useEffect, useState, useRef, useContext } from "react";
import Head from "../../../layout/head/Head";
import { useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Col,
  Row,
  Icon,
  PreviewCard,
  SaveButton,
  UserAvatar,
  TextInputField,
  CancelButton,
} from "../../../components/Component";
import Content from "../../../layout/content/Content";
import "../../../assets/css/sales_form.css";
import "../../../assets/css/datatable.css";
import { Button, ButtonGroup } from "reactstrap";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";
import { createSetting, getSettingById } from "../../../redux/thunks/settings";
import { toastsuccess } from "../../../components/sds-toast-style/toast-style";
import { useHotkeys } from "react-hotkeys-hook";
import { getUserInfo } from "../../../redux/thunks/authUser";
import secureLocalStorage from "react-secure-storage";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";
import { getPagePermission } from "../../../redux/thunks/coreComponent";

const SettingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const add = location?.state?.add;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();
  const { isLoading: issubmitting, settingInfo } = useSelector(
    (state) => state.settingReducer
  );

  const dispatch = useDispatch();

  const updateOption = [
    { label: "Tag and Lot", edit_type: 1 },
    { label: "Billing", edit_type: 2 },
    { label: "Purchase", edit_type: 3 },
    { label: "Orders", edit_type: 4 },
    { label: "General", edit_type: 5 },
  ];

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

  const [BulkEditType, setBulkEditType] = useState(1);
  const { transformWord } = useContext(WordTransformerContext);

  const [settings_list, setSettingsList] = useState([]);
  const loginpref = secureLocalStorage?.getItem("pref")?.pref;
  const searchRetailSettings = () => {
    if (BulkEditType) {
      dispatch(getSettingById(BulkEditType));
    }
  };

  const addSettingsList = () => {
    setSettingsList([
      ...settings_list,
      { name: "", value: "", description: "", id_settings: uuid() },
    ]);
    // setids((prevState) => prevState - 1);
  };

  const editSettingsList = ({ name, val, ids, ...params }) => {
    setSettingsList((prevState) =>
      prevState?.map((obj) => {
        if (obj?.id_settings == ids) {
          setValue(`${name + obj.id_settings}`, val);
          return { ...obj, [name]: val };
        }
        return obj;
      })
    );
  };

  const deleteSettingsList = (ids) => {
    setSettingsList((prevState) =>
      prevState?.filter((obj) => obj.id_settings != ids)
    );
  };

  const saveData = async () => {
    const updated_list = settings_list?.map((item) => {
      return {
        ...item,
        group_by: BulkEditType,
      };
    });
    const postData = {
      group_by: BulkEditType,
      settings_list: updated_list,
    };
    try {
      await dispatch(createSetting(postData)).unwrap();
      toastsuccess("Settings Created successfully");
      setBulkEditType(1);
      setSettingsList([]);
      dispatch(getUserInfo(loginpref));
      // navigate(`${process.env.PUBLIC_URL}/settings/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (add === undefined) {
      navigate(`${process.env.PUBLIC_URL}/settings/list`);
    }
  }, [add, navigate]);

  useEffect(() => {
    if (settings_list?.length == 0) {
      addSettingsList();
    }
  }, [settings_list]);

  useEffect(() => {
    dispatch(getSettingById(BulkEditType));
  }, [dispatch, BulkEditType]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    settingInfo !== null && (setSettingsList(settingInfo), reset());
  }, [settingInfo, reset]);

 

  return (
    <React.Fragment>
      <Head title="Ret Settings" />
      <Content>
        <PreviewCard className="h-100">
          <Row lg={12} className={""} style={{ marginTop: "10px" }}>
            <Col md={9}>
              <ModifiedBreadcrumb />
            </Col>

            <Col md={3} className="text-right flex">
              <ButtonGroup>
                <SaveButton
                  disabled={issubmitting || !pagePermission?.edit}
                  size="md"
                  color="primary"
                  onClick={handleSubmit(saveData)}
                >
                  Save
                </SaveButton>
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color=""
                  onClick={() => searchRetailSettings()}
                >
                  Search
                </SaveButton>
              </ButtonGroup>
            </Col>
          </Row>

          <Row lg={12}>
            <Col md={3} className="mt-10">
              <div className="custom-grid" style={{ marginTop: "16px" }}>
                <div className="form-label">Choose Field To Update</div>
                <div
                  className=""
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  <ul className="custom-control-group custom-control-vertical w-100">
                    {updateOption?.map((option, idx) => {
                      return (
                        <li key={idx}>
                          <div className="custom-control custom-control-sm custom-radio custom-control-pro">
                            <input
                              type="radio"
                              className="custom-control-input"
                              name="edit_type"
                              id={`${idx}edit_type`}
                              checked={
                                option?.edit_type === BulkEditType
                                  ? true
                                  : false
                              }
                              {...register(`${idx}edit_type`, {
                                required: false,
                              })}
                              onChange={() => {
                                setBulkEditType(option.edit_type);
                              }}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor={`${idx}edit_type`}
                            >
                              <span>{option.label}</span>
                            </label>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </Col>

            <Col md={9}>
              <div className="table-responsive" style={{ marginTop: "16px" }}>
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
                        S.NO{" "}
                      </th>
                      <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        Value
                      </th>
                      <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        Description
                      </th>
                      <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {settings_list?.map((obj, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <input
                              {...register(`name${obj.id_settings}`, {
                                required: "Required",
                              })}
                              name="name"
                              placeholder="Value"
                              className="form-control form-control-sm"
                              type="text"
                              value={obj?.name}
                              onChange={(e) =>
                                editSettingsList({
                                  ids: obj?.id_settings,
                                  name: e.target.name,
                                  val: e.target.value,
                                })
                              }
                            />
                            {errors?.[
                              `name` + `${String(obj.id_settings)}`
                            ] && (
                              <span className="text-danger">
                                <Icon className={"sm"} name="alert-circle" />
                                {
                                  errors?.[
                                    `name` + `${String(obj.id_settings)}`
                                  ].message
                                }
                              </span>
                            )}
                          </td>
                          <td>
                            <input
                              {...register(`value${obj.id_settings}`, {
                                required: "Required",
                              })}
                              name="value"
                              placeholder="Value"
                              className="form-control form-control-sm"
                              type="text"
                              value={obj?.value}
                              onChange={(e) =>
                                editSettingsList({
                                  ids: obj?.id_settings,
                                  name: e.target.name,
                                  val: e.target.value,
                                })
                              }
                            />
                            {errors?.[
                              `value` + `${String(obj.id_settings)}`
                            ] && (
                              <span className="text-danger">
                                <Icon className={"sm"} name="alert-circle" />
                                {
                                  errors?.[
                                    `value` + `${String(obj.id_settings)}`
                                  ].message
                                }
                              </span>
                            )}
                          </td>
                          <td>
                            <input
                              {...register(`description${obj.id_settings}`, {
                                required: "Required",
                              })}
                              name="description"
                              placeholder="Description"
                              className="form-control form-control-sm"
                              type="text"
                              value={obj?.description}
                              onChange={(e) =>
                                editSettingsList({
                                  ids: obj?.id_settings,
                                  name: e.target.name,
                                  val: e.target.value,
                                })
                              }
                            />
                            {errors?.[
                              `description` + `${String(obj.id_settings)}`
                            ] && (
                              <span className="text-danger">
                                <Icon className={"sm"} name="alert-circle" />
                                {
                                  errors?.[
                                    `description` + `${String(obj.id_settings)}`
                                  ].message
                                }
                              </span>
                            )}
                          </td>

                          <td>
                            <Button
                              color="primary"
                              size="sm"
                              className="btn-icon btn-white btn-dim"
                              onClick={() =>
                                deleteSettingsList(obj.id_settings)
                              }
                            >
                              <Icon name="trash-fill" />
                            </Button>
                            {index == settings_list?.length - 1 && (
                              <Button
                                color="primary"
                                size="sm"
                                className="btn-icon btn-white btn-dim"
                                onClick={() => addSettingsList()}
                              >
                                <Icon name="plus" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default SettingForm;
