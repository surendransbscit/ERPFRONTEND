import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import Loading from "../../../components/erp-loading/erp-loader";
import { useDispatch, useSelector } from "react-redux";
import {
  createAccessCheckBoxForm,
  getCheckBoxAccess,
  getCheckboxAccessMenuOptions,
} from "../../../redux/thunks/settings";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import Select from "react-select";
import {
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useNavigate } from "react-router";
import { getAllActiveProfile } from "../../../redux/thunks/retailMaster";
import { useHotkeys } from "react-hotkeys-hook";
import {
  toastfunc,
  toastsuccess,
} from "../../../components/sds-toast-style/toast-style";
import { useForm } from "react-hook-form";
import {
  getAllMenus,
  getPagePermission,
} from "../../../redux/thunks/coreComponent";

const TableStyle = styled.div`
  .table {
    td {
      padding: 0.25rem;
    }
  }
`;

const MenuAccessFormType2 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [accessData, SetAccessData] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState();
  const {
    checkBoxMenuAccessOptions,
    checkBoxAccessList,
    isLoading: loading,
    isLoading: issubmitting,
  } = useSelector((state) => state.menuReducer);
  const { activeProfileList } = useSelector((state) => state.profileReducer);

  const { handleSubmit } = useForm();

  const pathName = location?.pathname;
  const { pagePermission } = useSelector((state) => state.coreCompReducer);

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  useEffect(() => {
    if (
      pagePermission?.add === false ||
      pagePermission === undefined ||
      pagePermission === null
    ) {
      navigate(`${process.env.PUBLIC_URL}/`);
    }
  }, [pagePermission, navigate]);

  const selectionAll = async (checked) => {
    SetAccessData((prevState) =>
      prevState?.map((obj) => {
        return {
          ...obj,
          view: checked,
          add: checked,
          edit: checked,
          delete: checked,
          print: checked,
          export: checked,
        };
      })
    );
  };
  //
  const selectionViewAll = async (checked) => {
    SetAccessData((prevState) =>
      prevState?.map((obj) => {
        return {
          ...obj,
          view: checked,
        };
      })
    );
  };
  //
  //
  const selectionAddAll = async (checked) => {
    SetAccessData((prevState) =>
      prevState?.map((obj) => {
        return {
          ...obj,
          add: checked,
        };
      })
    );
  };
  // //
  const selectionEditAll = async (checked) => {
    SetAccessData((prevState) =>
      prevState?.map((obj) => {
        return {
          ...obj,
          edit: checked,
        };
      })
    );
  };
  // //
  const selectionDeleteAll = async (checked) => {
    SetAccessData((prevState) =>
      prevState?.map((obj) => {
        return {
          ...obj,
          delete: checked,
        };
      })
    );
  };

  const selectionPrintAll = async (checked) => {
    SetAccessData((prevState) =>
      prevState?.map((obj) => {
        return {
          ...obj,
          print: checked,
        };
      })
    );
  };

  const selectionExportAll = async (checked) => {
    SetAccessData((prevState) =>
      prevState?.map((obj) => {
        return {
          ...obj,
          export: checked,
        };
      })
    );
  };
  //

  //
  const selectionRowAll = async (obj, checked) => {
    SetAccessData((prevState) =>
      prevState?.map((item) => {
        if (item == obj) {
          return {
            ...item,
            view: checked,
            add: checked,
            edit: checked,
            delete: checked,
            print: checked,
            export: checked,
          };
        }
        return item;
      })
    );
  };

  //
  const selectionViewSingle = async (obj, checked) => {
    SetAccessData((prevState) =>
      prevState?.map((item) => {
        if (item == obj) {
          return {
            ...item,
            view: checked,
          };
        }
        return item;
      })
    );
  }; //
  //
  const selectionAddSingle = async (obj, checked) => {
    SetAccessData((prevState) =>
      prevState?.map((item) => {
        if (item == obj) {
          return {
            ...item,

            add: checked,
          };
        }
        return item;
      })
    );
  }; // //
  const selectionEditSingle = async (obj, checked) => {
    SetAccessData((prevState) =>
      prevState?.map((item) => {
        if (item == obj) {
          return {
            ...item,

            edit: checked,
          };
        }
        return item;
      })
    );
  }; // //
  const selectionDeleteSingle = async (obj, checked) => {
    SetAccessData((prevState) =>
      prevState?.map((item) => {
        if (item == obj) {
          return {
            ...item,

            delete: checked,
          };
        }
        return item;
      })
    );
  };
  const selectionPrintSingle = async (obj, checked) => {
    SetAccessData((prevState) =>
      prevState?.map((item) => {
        if (item == obj) {
          return {
            ...item,

            print: checked,
          };
        }
        return item;
      })
    );
  };
  const selectionExportSingle = async (obj, checked) => {
    SetAccessData((prevState) =>
      prevState?.map((item) => {
        if (item == obj) {
          return {
            ...item,

            export: checked,
          };
        }
        return item;
      })
    );
  };

  const profilesData = activeProfileList?.map((obj) => {
    const container = {};
    container.label = obj?.profile_name;
    container.value = obj?.id_profile;
    return container;
  });

  const saveData = async () => {
    if (selectedProfile == null || selectedProfile === undefined) {
      toastfunc("Kindly select the corresponding Profile");
    }

    const postData = {
      profile: selectedProfile,
      accessData,
    };
    // console.log(postData);
    try {
      await dispatch(createAccessCheckBoxForm(postData)).unwrap();
      toastsuccess("Access created successfully");
      setSelectedProfile("");
      dispatch(getCheckboxAccessMenuOptions());
      dispatch(getAllMenus());
      window.location.reload(true);
      // navigate(`${process.env.PUBLIC_URL}/settings/menu/list`);
    } catch (error) {
      console.error(error);
    }
  };

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      handleSubmit(saveData)();
    },
    {
      enableOnFormTags: true, // Enable hotkeys inside input fields
      preventDefault: true, // Prevent default browser Save
    }
  );

  useEffect(() => {
    dispatch(getCheckboxAccessMenuOptions());
    dispatch(getAllActiveProfile());
  }, [dispatch]);

  useEffect(() => {
    SetAccessData(checkBoxMenuAccessOptions);
  }, [checkBoxMenuAccessOptions]);

  useEffect(() => {
    if (checkBoxAccessList !== null && checkBoxAccessList !== undefined) {
      SetAccessData(checkBoxAccessList);
    }
  }, [checkBoxAccessList]);

  return (
    <>
      <React.Fragment>
        <Head title={"Menu Access"} />
        <Content>
          <PreviewCard className="h-100 form-control-sm">
            <Row
              lg={12}
              className={"form-control-sm"}
              style={{ marginTop: "10px" }}
            >
              <Col md={5}>
                <ModifiedBreadcrumb />
              </Col>
              <Col md={1}>
                <div className="form-group">
                  <label className="form-label" htmlFor="selectedProfile">
                    Profile
                  </label>
                </div>
              </Col>
              <Col md={2}>
                <div className="form-group">
                  <Select
                    value={
                      profilesData?.find(
                        (item) => item?.value === selectedProfile
                      ) || null
                    }
                    options={profilesData}
                    placeholder="Select Profile"
                    id={"selectedProfile"}
                    onChange={(value) => {
                      setSelectedProfile(value?.value);
                      dispatch(getCheckBoxAccess({ profileID: value?.value }));
                    }}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                        fontSize: "12px",
                      }),
                    }}
                  />
                </div>
              </Col>
              <Col md={4} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  onClick={saveData}
                  size="md"
                  color="primary"
                >
                  {issubmitting ? "Saving" : "Save"}
                </SaveButton>
                <CancelButton
                  // disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() => navigate(`${process.env.PUBLIC_URL}/`)}
                >
                  Cancel
                </CancelButton>
              </Col>
            </Row>

            {accessData?.length > 0 ? (
              loading ? (
                <Loading />
              ) : (
                <div className="mt-4">
                  <Row className="gy-2 gx-5">
                    <Col sm="12">
                      <TableStyle>
                        <table
                          className={`table-responsive overflow-x-auto `}
                          style={{ minWidth: "95%" }}
                        >
                          <thead className="tb-odr-head">
                            <tr>
                              <th style={{ minWidth: "10vw" }}>
                                <label>Menu</label>
                              </th>
                              <th>
                                <div className="custom-control custom-control-sm custom-checkbox notext">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input form-control"
                                    id="access_select_all"
                                    onChange={(e) =>
                                      selectionAll(e.target.checked)
                                    }
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="access_select_all"
                                  >
                                    Select All
                                  </label>
                                </div>
                              </th>
                              <th>
                                <div className="custom-control custom-control-sm custom-checkbox notext">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input form-control"
                                    id="access_select_allview"
                                    onChange={(e) =>
                                      selectionViewAll(e.target.checked)
                                    }
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="access_select_allview"
                                  >
                                    View
                                  </label>
                                </div>
                              </th>
                              <th>
                                <div className="custom-control custom-control-sm custom-checkbox notext">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input form-control"
                                    id="access_select_alladd"
                                    onChange={(e) =>
                                      selectionAddAll(e.target.checked)
                                    }
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="access_select_alladd"
                                  >
                                    Add
                                  </label>
                                </div>
                              </th>
                              <th>
                                <div className="custom-control custom-control-sm custom-checkbox notext">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input form-control"
                                    id="access_select_alledit"
                                    onChange={(e) =>
                                      selectionEditAll(e.target.checked)
                                    }
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="access_select_alledit"
                                  >
                                    Edit
                                  </label>
                                </div>
                              </th>
                              <th>
                                <div className="custom-control custom-control-sm custom-checkbox notext">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input form-control"
                                    id="access_select_alldel"
                                    onChange={(e) =>
                                      selectionDeleteAll(e.target.checked)
                                    }
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="access_select_alldel"
                                  >
                                    Delete
                                  </label>
                                </div>
                              </th>
                              <th>
                                <div className="custom-control custom-control-sm custom-checkbox notext">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input form-control"
                                    id="access_select_allprint"
                                    onChange={(e) =>
                                      selectionPrintAll(e.target.checked)
                                    }
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="access_select_allprint"
                                  >
                                    Print
                                  </label>
                                </div>
                              </th>
                              <th>
                                <div className="custom-control custom-control-sm custom-checkbox notext">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input form-control"
                                    id="access_select_allexport"
                                    onChange={(e) =>
                                      selectionExportAll(e.target.checked)
                                    }
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="access_select_allexport"
                                  >
                                    Export
                                  </label>
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {accessData?.map((obj) => {
                              return (
                                <tr
                                  key={obj?.id}
                                  // style={{
                                  //   background: "#f5f5f5",
                                  // }}
                                  // style={{
                                  //     backgroundColor : '#c0a5ff'
                                  // }}
                                  style={{
                                    backgroundColor:
                                      obj?.is_parent_menu == true
                                        ? "#e8dfff"
                                        : "none",
                                  }}
                                >
                                  <td>{obj.text}</td>
                                  <td>
                                    <div className="custom-control custom-control-sm custom-checkbox notext">
                                      <input
                                        type="checkbox"
                                        className="custom-control-input form-control"
                                        id={`row_all-${obj?.id}`}
                                        checked={
                                          obj.view &&
                                          obj.add &&
                                          obj.edit &&
                                          obj.delete &&
                                          obj.print &&
                                          obj.export
                                        }
                                        onChange={(e) =>
                                          selectionRowAll(obj, e.target.checked)
                                        }
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor={`row_all-${obj?.id}`}
                                      ></label>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="custom-control custom-control-sm custom-checkbox notext">
                                      <input
                                        type="checkbox"
                                        className="custom-control-input form-control"
                                        id={`${obj?.id}-view`}
                                        checked={obj.view}
                                        onChange={(e) =>
                                          selectionViewSingle(
                                            obj,
                                            e.target.checked
                                          )
                                        }
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor={`${obj?.id}-view`}
                                      ></label>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="custom-control custom-control-sm custom-checkbox notext">
                                      <input
                                        type="checkbox"
                                        className="custom-control-input form-control"
                                        id={`${obj?.id}-add`}
                                        checked={obj.add}
                                        onChange={(e) =>
                                          selectionAddSingle(
                                            obj,
                                            e.target.checked
                                          )
                                        }
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor={`${obj?.id}-add`}
                                      ></label>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="custom-control custom-control-sm custom-checkbox notext">
                                      <input
                                        type="checkbox"
                                        className="custom-control-input form-control"
                                        id={`${obj?.id}-edit`}
                                        checked={obj.edit}
                                        onChange={(e) =>
                                          selectionEditSingle(
                                            obj,
                                            e.target.checked
                                          )
                                        }
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor={`${obj?.id}-edit`}
                                      ></label>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="custom-control custom-control-sm custom-checkbox notext">
                                      <input
                                        type="checkbox"
                                        className="custom-control-input form-control"
                                        id={`${obj?.id}-del`}
                                        checked={obj.delete}
                                        onChange={(e) =>
                                          selectionDeleteSingle(
                                            obj,
                                            e.target.checked
                                          )
                                        }
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor={`${obj?.id}-del`}
                                      ></label>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="custom-control custom-control-sm custom-checkbox notext">
                                      <input
                                        type="checkbox"
                                        className="custom-control-input form-control"
                                        id={`${obj?.id}-print`}
                                        checked={obj.print}
                                        onChange={(e) =>
                                          selectionPrintSingle(
                                            obj,
                                            e.target.checked
                                          )
                                        }
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor={`${obj?.id}-print`}
                                      ></label>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="custom-control custom-control-sm custom-checkbox notext">
                                      <input
                                        type="checkbox"
                                        className="custom-control-input form-control"
                                        id={`${obj?.id}-export`}
                                        checked={obj.export}
                                        onChange={(e) =>
                                          selectionExportSingle(
                                            obj,
                                            e.target.checked
                                          )
                                        }
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor={`${obj?.id}-export`}
                                      ></label>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </TableStyle>
                    </Col>
                  </Row>
                </div>
              )
            ) : (
              <div>
                <h3 style={{ textAlign: "center", marginTop: "5px" }}>
                  No Data Found
                </h3>
              </div>
            )}
          </PreviewCard>
        </Content>
      </React.Fragment>
    </>
  );
};

export default MenuAccessFormType2;
