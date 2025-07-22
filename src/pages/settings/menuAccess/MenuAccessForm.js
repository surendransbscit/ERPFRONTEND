import React, { useEffect, useState } from "react";
import {
  CancelButton,
  Icon,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { Col, Row } from "../../../components/Component";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  createAccess,
  getAccess,
  getAccessMenuOptions,
} from "../../../redux/thunks/settings";
import {
  getAllActiveProfile,
  getAllProfile,
} from "../../../redux/thunks/retailMaster";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import classnames from "classnames";
import {
  toastfunc,
  toastsuccess,
} from "../../../components/sds-toast-style/toast-style";
import { useHotkeys } from "react-hotkeys-hook";
import {
  getAllMenus,
  getPagePermission,
} from "../../../redux/thunks/coreComponent";

const MenuAccessForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
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
  const { menuAccessOptions, isLoading: issubmitting } = useSelector(
    (state) => state.menuReducer
  );
  const { accessList } = useSelector((state) => state.menuReducer);
  const { activeProfileList } = useSelector((state) => state.profileReducer);

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

  // console.log(accessList);

  // const [treeData, setTreeData] = useState(jsTreeData);
  const [selectedProfile, setSelectedProfile] = useState();
  const [modifiedAccess, setModifiedAccess] = useState([]);
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [verticalIconTab, setVerticalIconTab] = useState(null);

  const profilesData = activeProfileList?.map((obj) => {
    const container = {};
    container.label = obj?.profile_name;
    container.value = obj?.id_profile;
    return container;
  });

  useEffect(() => {
    dispatch(getAccessMenuOptions());
    dispatch(getAllActiveProfile());
  }, [dispatch]);

  useEffect(() => {
    if (accessList != null) {
      if (accessList?.checked?.length > 0) {
        setChecked(accessList?.checked);
      }
      if (accessList?.checked?.length == 0) {
        setChecked([]);
      }

      if (accessList?.expanded?.length > 0) {
        setExpanded(accessList?.expanded);
      }
      if (accessList?.expanded?.length == 0) {
        setExpanded([]);
      }
    }
  }, [accessList]);

  // console.log(checked);
  // console.log(expanded);
  // console.log(modifiedAccess);

  const iconStyles = {
    fontSize: "18px",
    color: "black",
  };

  const icons = {
    check: <Icon name="check-round-fill" style={iconStyles} />,
    uncheck: <Icon name="square" style={iconStyles} />,
    halfCheck: <Icon name="minus-round" style={iconStyles} />,
    expandClose: <Icon name="chevron-right" style={iconStyles} />,
    expandOpen: <Icon name="chevron-down" style={iconStyles} />,
    expandAll: <Icon name="angle-double-down" style={iconStyles} />,
    collapseAll: <Icon name="angle-double-up" style={iconStyles} />,
    parentClose: <Icon name="folder-fill" style={iconStyles} />,
    parentOpen: <Icon name="folder-list" style={iconStyles} />,
    leaf: <Icon name="file-fill" style={iconStyles} />,
  };

  const handleCheck = (newChecked) => {
    setChecked(newChecked);

    const expandedNodes = [...expanded];

    const updateCheckedState = (nodes) => {
      return nodes?.map((node) => {
        let modifiedNode = { value: node.value, label: node.label };

        if (node?.children) {
          modifiedNode.children = updateCheckedState(node.children);
        } else {
          // Check if the node is a permission like add/edit/view, and update accordingly
          const isChecked = newChecked.includes(node.value);
          modifiedNode.value = node.value; // Keep the same value
          modifiedNode.checked = isChecked; // Update whether it's checked or not
        }

        return modifiedNode;
      });
    };

    const updatedAccess = updateCheckedState(menuAccessOptions?.menu_access);
    setModifiedAccess(updatedAccess);

    const autoExpandParents = (nodes) => {
      nodes?.forEach((node) => {
        if (node?.children) {
          const allChildrenChecked = node?.children?.every((child) =>
            newChecked?.includes(child.value)
          );

          if (
            (newChecked?.includes(node?.value) || allChildrenChecked) &&
            !expandedNodes?.includes(node.value)
          ) {
            expandedNodes?.push(node?.value);
          }
          autoExpandParents(node?.children);
        }
      });
    };

    autoExpandParents(menuAccessOptions?.menu_access);
    setExpanded(expandedNodes);
  };

  const saveData = async () => {
    if (selectedProfile == null || selectedProfile === undefined) {
      toastfunc("Kindly select the corresponding Profile");
    }
    const combinedMenuIds = [...new Set([...checked, ...expanded].map(String))];

    if (combinedMenuIds?.length == 0) {
      toastfunc("Kindly select the menus");
    }

    const postData = {
      selectedProfile,
      combinedMenuIds,
    };
    // console.log(postData);
    try {
      await dispatch(createAccess(postData)).unwrap();
      toastsuccess("Access created successfully");
      dispatch(getAllMenus());
      // window.location.reload(true);
      // navigate(`${process.env.PUBLIC_URL}/settings/menu/list`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <Head title={title ? title : "Menu Access"} />
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
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              <SaveButton
                disabled={issubmitting || !pagePermission?.add}
                onClick={saveData}
                size="md"
                color="primary"
              >
                {issubmitting ? "Saving" : "Save"}
              </SaveButton>
              <CancelButton
                disabled={issubmitting}
                color="danger"
                size="md"
                onClick={() => navigate(`${process.env.PUBLIC_URL}/`)}
              >
                Cancel
              </CancelButton>
            </Col>
          </Row>
          <div className="">
            <Row lg={12} className={"form-control-sm"}>
              {/* <Col md={3}>
                <div className="custom-grid">
                  <ul className="nav link-list-menu ">
                    {profileList?.rows?.map((item, index) => {
                      return (
                        <li key={index}>
                          <a
                            href="#tab"
                            className={classnames({
                              active: verticalIconTab === item?.id_profile,
                            })}
                            onClick={(ev) => {
                              ev.preventDefault();
                              dispatch(getAccess({ profileID: item?.id_profile }));
                              setVerticalIconTab(item?.id_profile);
                            }}
                          >
                            <span> {item?.profile_name}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Col> */}

              <Col className="mt-2" lg="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="selectedProfile">
                    Profile
                  </label>
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
                      dispatch(getAccess({ profileID: value?.value }));
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

              <Col className="mt-2" lg={12}>
                <div className="custom-grid">
                  <CheckboxTree
                    icons={icons} // Use custom icons
                    nodes={menuAccessOptions ? menuAccessOptions : []}
                    checked={checked}
                    expanded={expanded}
                    onCheck={handleCheck} // Use the custom check handler
                    onExpand={(expanded) => setExpanded(expanded)}
                    showNodeIcon={true}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default MenuAccessForm;
