import React, { useEffect, useState ,useContext} from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { useDispatch } from "react-redux";
import {
  CancelButton,
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
  Row,
  TextInputField,
} from "../../../components/Component";
import IsRequired from "../../../components/erp-required/erp-required";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useHotkeys } from "react-hotkeys-hook";
import {
  createOtherInventoryItem,
  getOtherInventoryItemById,
  updateOtherInventoryItemById
} from "../../../redux/thunks/otherInventory";
import { OtherInventoryCategoryDropdown } from "../../../components/filters/retailFilters";
import { useOtherInventoryCategory } from "../../../components/filters/filterHooks";
import OtherInventorySizeDropdownMulti from "../../../components/common/dropdown/OtherInventorySizeDropdownMulti";
import { Button, FormGroup, Nav, NavItem, NavLink, TabContent, TabPane, Label } from "reactstrap";
import classnames from "classnames";
import {
  useBranches,
} from "../../../components/filters/filterHooks";
import {
  BranchDropdown,
} from "../../../components/filters/retailFilters";
import { FaTrash } from "react-icons/fa";
import { toastfunc } from "../../../components/sds-toast-style/toast-style";
import { WordTransformerContext } from "../../../contexts/WordTransformerContexts";

const OtherInventoryItemForm = () => {
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
    setError,
    setValue,
    onClickSave,
  } = useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isLoading: issubmitting, isError } = useSelector(
    (state) => state.OtherInventoryItemReducer
  );
  const { otherInventoryItemInfo } = useSelector((state) => state.OtherInventoryItemReducer);

  const [activeIconTab, setActiveIconTab] = useState("1");
  const toggleIconTab = (icontab) => {
    if (activeIconTab !== icontab) setActiveIconTab(icontab);
  };

  const [category, setCategory] = useState();
  const [name, setName] = useState();
  const [shortCode, setShortCode] = useState();
  const [size, setSize] = useState([]);
  const [issue, setissue] = useState("1");

  const { otherInventoryCategories } = useOtherInventoryCategory();
  const { branches } = useBranches();
  const [branch, setbranch] = useState(location?.state?.id_branch || "");
  const { transformWord } = useContext(WordTransformerContext);


  // Table rows state for Retail Order Setting tab
  const [rows, setRows] = useState([
    { id: 1, branch: "", min_pcs: "" },
  ]);


  const addRow = () => {
    setRows((prevRows) => {
      const newId = prevRows.length + 1;

      return [
        ...prevRows,
        { id: newId, branch: "", min_pcs: "" },
      ];
    });
  };

  const handleBranchChange = (rowId, value) => {
    // Check if the branch is already selected in another row
    if (rows.some(row => row.branch === value && row.id !== rowId)) {
      toastfunc("This branch is already selected! Please choose another.");
      return;
    }
    setRows(rows.map(row => row.id === rowId ? { ...row, branch: value } : row));
  };

  // Delete a row
  const deleteRow = (rowId) => {
    setRows(rows.filter((row) => row.id !== rowId));
  };

  // Get all selected branch IDs
  const selectedBranches = rows.map(row => row.branch).filter(Boolean);


  const postData = async () => {
    const adddata = {
      category: category,
      name: name,
      // size: size.map((obj) => 
      size: Array.isArray(size) && size.length > 0 ? size.map(obj => obj?.value): [],
      //   {
      //   const container = obj.value;
      //   return container;
      // }
      short_code: shortCode,
      reOrderSetting: rows.map(row => ({
        branch: row.branch,
        min_pcs: row.min_pcs || null
      })),
      issue_to: issue
    };
    try {
      await dispatch(createOtherInventoryItem(adddata)).unwrap();
      toastsuccess(name + " Added successfully");
      navigate(`${process.env.PUBLIC_URL}/other_inventory/item/list`);
    } catch (error) {
      console.error(error);
    }

  };


  const postAndCreateNew = async () => {
    const adddata = {
      category: category,
      name: name,
      size: size.map((obj) => {
        const container = obj.value;
        return container;
      }),
      short_code: shortCode,
      reOrderSetting: rows.map(row => ({
        branch: row.branch,
        min_pcs: row.min_pcs || null
      })),
      issue_to: issue
    };

    await dispatch(createOtherInventoryItem(adddata));
    if (isError === false) {
      toastsuccess("Item Added successfully");
      setCategory("");
      setName("");
      setSize("");
      setShortCode("");
      setRows("")
      setissue("")
    }
  };

  useEffect(() => {
    otherInventoryItemInfo != undefined &&
      (
        setCategory(otherInventoryItemInfo?.category),
        setName(otherInventoryItemInfo?.name),
        // setSize(otherInventoryItemInfo?.size),
        setSize(
          otherInventoryItemInfo?.size?.map((sizeItem, index) => ({
            value: sizeItem,
            label: otherInventoryItemInfo?.size_name?.[index] || '',
            id: otherInventoryItemInfo?.id
          })) || []
        ),
        setShortCode(otherInventoryItemInfo?.short_code),
        setRows(otherInventoryItemInfo?.reOrderSetting),
        reset());
  }, [otherInventoryItemInfo, reset]);

  const putData = async () => {
    const adddata = {
      category: category,
      name: name,
      size: Array.isArray(size) && size.length > 0 ? size.map(obj => obj?.value): [],
      // size: size.map((obj) => {
      //   const container = obj.value;
      //   return container;
      // }),
      short_code: shortCode,
      reOrderSetting: rows.map(row => ({
        branch: row.branch,
        min_pcs: row.min_pcs || null
      })),
      issue_to: issue
    };
    const reduxData = {
      id: id,
      putData: adddata,
    };
    await dispatch(updateOtherInventoryItemById(reduxData));
    if (isError === false) {
      toastsuccess("Item Edited successfully");
      navigate(`${process.env.PUBLIC_URL}/other_inventory/item/list`);
    }
  };

  useEffect(() => {
    id !== undefined && dispatch(getOtherInventoryItemById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/other_inventory/item/list`);
    }
  }, [add, id, navigate]);

  useHotkeys(
    "ctrl+s",
    (event) => {
      event.preventDefault();
      document.activeElement?.blur();
      setTimeout(() => {
        if (id !== undefined) {
          handleSubmit(putData)();
        } else {
          handleSubmit(postData)();
        }
      }, 0); // <-- Slight delay after blur
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    }
  );


  return (
    <React.Fragment>
      <Head title={title ? title : "Item"} />
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

            <Col md={1}></Col>
            {add !== undefined && (
              <Col md={6} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) =>
                    postAndCreateNew(data, "saveAndNew")
                  )}
                >
                  {issubmitting ? "Saving" : "Save & New"}
                </SaveButton>

                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit(id ? putData : postData)}
                >
                  {issubmitting ? "Saving" : "Save & Close[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(`${process.env.PUBLIC_URL}/other_inventory/item/list`)
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
            {id !== undefined && (
              <Col md={6} className="text-right flex">
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit(putData)}
                >
                  {issubmitting ? "Saving" : "Save[Ctrl+s]"}
                </SaveButton>

                <CancelButton
                  disabled={issubmitting}
                  color="danger"
                  size="md"
                  onClick={() =>
                    navigate(`${process.env.PUBLIC_URL}/other_inventory/item/list`)
                  }
                >
                  Cancel
                </CancelButton>
              </Col>
            )}
          </Row>
          <Nav tabs>
            <NavItem>
              <NavLink
                tag="a"
                href="#tab"
                className={classnames({ active: activeIconTab === "1" })}
                onClick={(ev) => {
                  ev.preventDefault();
                  toggleIconTab("1");
                }}
              >
                <Icon name="grid-alt-fill" /> <span>General</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                tag="a"
                href="#tab"
                className={classnames({ active: activeIconTab === "2" })}
                onClick={(ev) => {
                  ev.preventDefault();
                  toggleIconTab("2");
                }}
              >
                <Icon name="setting-fill" /> <span>ReOrder Setting</span>
              </NavLink>
            </NavItem>
          </Nav>

          {activeIconTab === "1" && (
            <div className="custom-grid" >
              <Row md={12} className="form-group row g-4">
                <Col md="2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="category">
                      Category
                      <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col md="3">
                  <div className="form-group">
                    <OtherInventoryCategoryDropdown
                      register={register}
                      id={"category"}
                      otherInventoryCategories={otherInventoryCategories}
                      selectedOtherInventoryCategory={category}
                      onOtherInventoryCategoryChange={setCategory}
                      isRequired={false}
                      clearErrors={clearErrors}
                      setValue={setValue}
                    />
                  </div>
                </Col>
              </Row>
              <Row md={12} className="form-group row g-4">
                <Col lg="2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">
                      Name <IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="3">
                  <div className="form-group">
                    <TextInputField
                      register={register}
                      isRequired={true}
                      id={"name"}
                      placeholder="Item Name"
                      value={name}
                      SetValue={(value) => {
                        setName(transformWord(value));
                        clearErrors("name");
                      }}
                      message={errors.name && " name is Required"}
                    />
                  </div>
                </Col>
              </Row>
              <Row md={12} className="form-group row g-4">
                <Col md="2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="size">
                      Size
                    </label>
                  </div>
                </Col>
                <Col md="3">
                  <div className="form-group">
                    <OtherInventorySizeDropdownMulti
                      id={"size"}
                      optionLabel={"Choose Sizes..."}
                      register={register}
                      setError={setError}
                      clearErrors={clearErrors}
                      value={size}
                      SetValue={setSize}
                    />
                  </div>
                </Col>
              </Row>
              <Row md={12} className="form-group row g-4">
                <Col lg="2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="shortCode">
                      Short Code<IsRequired />
                    </label>
                  </div>
                </Col>
                <Col lg="3">
                  <div className="form-group">
                    <TextInputField
                      register={register}
                      isRequired={true}
                      id={"shortCode"}
                      placeholder="Short code"
                      value={shortCode}
                      SetValue={(value) => {
                        setShortCode(value);
                        clearErrors("shortCode");
                      }}
                      message={errors.shortCode && " shortCode is Required"}
                    />
                  </div>
                </Col>
              </Row>

            </div>
          )}
          {activeIconTab === "2" && (
            <TabContent >
              <TabPane>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>S.NO</th>
                        <th>Branch</th>
                        <th>Min Pieces</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={row.id}>
                          <td>{index + 1}</td>
                          <td>
                            <BranchDropdown
                              register={register}
                              id={`branch-${row.id}`}
                              branches={branches.filter(b => !selectedBranches.includes(b.value) || b.value === row.branch)}
                              selectedBranch={row.branch}
                              onBranchChange={(value) => handleBranchChange(row.id, value)}
                              isRequired={true}
                              clearErrors={clearErrors}
                              setValue={setValue}
                              message={errors[`branch-${row.id}`] && "Branch is Required"}
                            />
                          </td>
                          <td>
                            <TextInputField
                              register={register}
                              isRequired={true}
                              id={`min_pcs-${row.id}`}
                              placeholder="Min Pieces"
                              value={row.min_pcs}
                              SetValue={(value) => {
                                const updatedValue = value === "" ? null : value;
                                setRows(rows.map(r => r.id === row.id ? { ...r, min_pcs: updatedValue } : r));
                                // setRows(rows.map(r => r.id === row.id ? { ...r, min_pcs: value } : r));
                                clearErrors(`min_pcs-${row.id}`);
                              }}
                              message={errors[`min_pcs-${row.id}`] && "Min Pieces is Required"}
                            />
                          </td>
                          <td>
                            <Button color="primary"
                              size="sm"
                              className="btn-icon btn-white btn-dim"
                              onClick={() => addRow(index)}>
                              <Icon name="plus" />
                            </Button>
                            <Button color="primary"
                              size="sm"
                              className="btn-icon btn-white btn-dim"
                              onClick={() => deleteRow(row.id)} style={{ marginLeft: "8px" }}>
                              <Icon name="trash-fill" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              </TabPane>
            </TabContent>
          )}
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default OtherInventoryItemForm;
