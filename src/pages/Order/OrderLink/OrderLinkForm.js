import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import { toastsuccess, toastfunc } from "../../../components/sds-toast-style/toast-style";
import Content from "../../../layout/content/Content";
import CurrencyDisplay from "../../../components/common/moneyFormat/moneyFormat";
import { BlockTitle, CancelButton, PreviewCard, SaveButton } from "../../../components/Component";
import { Col, Row, Icon } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Label } from "reactstrap";
import { orderLink, getOrderLinkList } from "../../../redux/thunks/Order";
import IsRequired from "../../../components/erp-required/erp-required";
import { BranchDropdown, SupplierDropdown, SelectDropdown } from "../../../components/filters/retailFilters";
import { useBranches, useSupplierFilter, useEmployee, useFinYears } from "../../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { OrderNoWithFinYear, TextInputField } from "../../../components/form-control/InputGroup";
import TagCodeAutoComplete from "../../../components/common/autoComplete/TagCodeAutoComplete";
import OrderPopup from "../../../components/modals/OrderPopup";
import { getTagDetailsByCode } from "../../../redux/thunks/inventory";
import OldTagCodeAutoComplete from "../../../components/common/autoComplete/OldTagCodeAutoComplete";
import { getPagePermission } from "../../../redux/thunks/coreComponent";

const OrderLinkForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
    reset,
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading: issubmitting, orderLinkList } = useSelector((state) => state.orderReducer);

  const { branches } = useBranches();
  const { supplier } = useSupplierFilter();
  const { employees } = useEmployee();
  const { finYears } = useFinYears();
  const [openModal, setOpenModal] = useState(false);
  const toggle = () => setOpenModal(!openModal);

  const [assignOrderList, setAssignOrderList] = useState([]);

  const [filterBranch, setFilterBranch] = useState();
  const [finId, setFinId] = useState();
  const [filterOrderNo, setFilterOrderNo] = useState();
  const [orderType, setOrderType] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [tagCode, setTagCode] = useState("");

  useEffect(() => {
    setAssignOrderList(orderLinkList);
  }, [orderLinkList]);


  // const getTagDetails = async (tagCode) => {
  //   try {
  //     let orderLinkList = [];
  //     let requestData = { tagCode: tagCode, filterBranch: filterBranch };
  //     let response = {};
  //     if (itemType === 0) {
  //       response = await dispatch(getTagDetailsByCode(requestData)).unwrap();
  //     }
  //     let tagResult = {
  //       ...response,
  //       id_product: response.tag_product_id,
  //       id_design: response.tag_design_id,
  //       id_purity: response.tag_purity_id,
  //       id_sub_design: response.tag_sub_design_id,
  //       // pieces: response.tag_pcs,
  //       // gross_wt: response.tag_gwt,
  //       // net_wt: response.tag_nwt,
  //       // less_wt: response.tag_lwt,
  //       // stone_wt: response.tag_stn_wt,
  //       // dia_wt: response.tag_dia_wt,
  //       // other_metal_wt: response.tag_other_metal_wt,
  //       // wastage_weight: response.tag_wastage_wt,
  //       // wastage_percentage: response.tag_wastage_percentage,
  //       // mc_value: response.tag_mc_value,
  //       // mc_type: response.tag_mc_type,
  //     }

  //     orderLinkList.push(tagResult);
  //     setAssignOrderList(orderLinkList);
  //     setTagCode("");
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };



  // useEffect(() => {
  //   if (tagCode && tagCode.length > 5) {
  //     handleTagSearch();
  //   }
  // }, [tagCode]);

  // const handleTagSearch = async () => {
  //   const tagDetails = orderLinkList?.filter((result) => result.tag_code === tagCode);

  //   if (tagCode === "") {
  //     toastfunc("Please Enter The Tag Code");
  //   } else if (filterBranch === "") {
  //     toastfunc("Please Select Branch");
  //   } else if (tagDetails.length > 0) {
  //     toastfunc("Tag Code already exists");
  //   } else {
  //     getTagDetails(tagCode);
  //   }
  // };

  useEffect(() => {
    return () => {
      dispatch({ type: 'orderLinkList/reset' });
    };
  }, [dispatch]);

  const form_submit = async () => {
    let assignData = [];
    assignOrderList?.map((item) => {
      if (item.isChecked) {
        assignData?.push({ detail_id: item.detail_id, tag_id: item.tagId, unlink_reason: item.unlink_reason });
      }
    });
    if (assignData?.length) {
      let data = {
        type: orderType,
        orderDetailList: assignData,
      };
      createTagLink(data);
    } else {
      toastfunc("Select Order To Link Tag");
    }
  };

  const saveFunction = async () => {
    if (!filterBranch) {
      toastfunc(" Branch Required !!");
    } else if (!filterOrderNo) {
      toastfunc(" Order No Required !!");
    }
    // else if (!filterOldTagCode) {
    //   toastfunc(" Old Rag Code No Required !!");
    // }
    else {
      toggle(true)
    }
  };

  const createTagLink = async (data) => {
    try {
      await dispatch(orderLink(data)).unwrap();
      reset_form();
      toggle(false);
    } catch (error) {
      let message = error?.response?.data?.message;
      toastfunc(message);
    }
  };

  const calculateTotal = (field) => {
    return orderLinkList.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columns.find((item) => item.accessor === field);
      let decimal_places = column && column.decimal_places !== undefined ? column.decimal_places : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const getOrderDetails = () => {
    if (filterOrderNo && filterBranch) {
      const filters = {
        orderno: filterOrderNo ? filterOrderNo : null,
        branch: filterBranch ? filterBranch : null,
        type: orderType,
        finId: finId,
      };
      dispatch(getOrderLinkList(filters));
    } else if (!filterOrderNo) {
      toastfunc(" Order No Required !!");
    } else {
      toastfunc(" Branch Required !!");
    }

  };

  const selectAllCol = (value) => {
    assignOrderList?.map((item, rowIndex) => {
      handelChange(rowIndex, "isChecked", value);
    });
  };

  const handelChange = (index, field, value) => {
    setAssignOrderList((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;
      return updatedValues;
    });
  };

  const reset_form = async () => {
    reset("");
    getOrderDetails();
  };

  const columns = [
    { header: "Order No", accessor: "order_no", textAlign: "center" },
    { header: "Order Date", accessor: "order_date", textAlign: "center" },
    { header: "Product", accessor: "product_name", textAlign: "center" },
    { header: "Design", accessor: "design_name", textAlign: "center" },
    { header: "Sub Design", accessor: "sub_design_name", textAlign: "center" },
    { header: "Piece", accessor: "pieces", decimal_places: 0, textAlign: "right", isTotalReq: true },
    { header: "Gwt", accessor: "gross_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Lwt", accessor: "less_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Nwt", accessor: "net_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
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


  return (
    <React.Fragment>
      <Head title="Order Link" />
      <Content>
        <PreviewCard className="h-100">
          <Row lg={12} className={"form-control-sm"} style={{ marginTop: "10px" }}>
            <Col md={5}>
              <ModifiedBreadcrumb></ModifiedBreadcrumb>
            </Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              <SaveButton disabled={issubmitting || !pagePermission?.add || !pagePermission?.view} size="md" color="primary" onClick={() => saveFunction()}>
                {issubmitting ? "Saving" : "Save"}
              </SaveButton>

              <SaveButton disabled={issubmitting} color="secondary" size="md" onClick={() => getOrderDetails()}>
                Search
              </SaveButton>
            </Col>
          </Row>

          <div className="custom-grid">
            <Row className="g-3 form-control-sm align-center">
              <Col lg="2">
                <Label>Order Type</Label>
                <div className="form-group">
                  <ul className="custom-control-group g-3 align-center flex-wrap">
                    <li>
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          id="link"
                          type="radio"
                          name={"orderType"}
                          value={"1"}
                          className="custom-control-input"
                          checked={orderType == "1"}
                          onChange={(e) => {
                            setAssignOrderList([]);
                            setOrderType(e.target.value);
                          }}
                        />
                        <label className="custom-control-label" htmlFor="link">
                          Link
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="unlink"
                          type="radio"
                          value={"2"}
                          name={"orderType"}
                          className="custom-control-input "
                          checked={orderType == "2"}
                          onChange={(e) => {
                            setAssignOrderList([]);
                            setOrderType(e.target.value);
                          }}
                        />
                        <label className="custom-control-label" htmlFor="unlink">
                          Un Link
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </Col>

              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Branch
                    <IsRequired />
                  </label>
                  <BranchDropdown
                    register={register}
                    id={"filterBranch"}
                    branches={branches}
                    selectedBranch={filterBranch}
                    onBranchChange={(value) => {
                      setFilterBranch(value);
                    }}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.filterBranch && "Branch is Required"}
                  />
                </div>
              </Col>

              <Col lg="3">
                <div className="form-group">
                  <label className="form-label" htmlFor="selectedDesign">
                    Order no
                    <IsRequired />
                  </label>
                  <OrderNoWithFinYear
                    register={register}
                    placeholder="Order No"
                    id={"filterOrderNo"}
                    value={filterOrderNo}
                    isRequired={true}
                    readOnly={false}
                    type={"text"}
                    setValue={setValue}
                    SetValue={(value) => {
                      value = value.toUpperCase();
                      setFilterOrderNo(value);
                    }}
                    optionId={"finId"}
                    name={"finId"}
                    options={finYears}
                    onDropDownChange={(value) => {
                      setFinId(value);
                    }}
                    selectedOption={finId}
                    message={errors.filterOrderNo && errors.filterOrderNo.message}
                  />
                </div>
              </Col>


              {/* <Col md="3">
                <div className="form-control-wrap">
                  <label className="form-label" htmlFor="oldtagcode">
                    Old Tag Code
                  </label>
                  <div className="input-group">
                    <TextInputField
                      register={register}
                      isRequired={true}
                      id={"tagCode"}
                      placeholder="Tag Code"
                      value={tagCode}
                      SetValue={(value) => {
                        setTagCode(value);
                        clearErrors("tagCode");
                      }}
                    />
                    <div className="input-group-append" style={{ "height": "29px" }}>
                      <Button
                        outline
                        color="primary"
                        className="btn-dim"
                      // onClick={handleTagSearch}
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                </div>
              </Col> */}
            </Row>

            <Row className="mt-2" md={12}>
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="table table-bordered">
                <thead>
                  <tr
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    backgroundColor: "#f8f9fa",
                    }}
                  >
                      <th style={{ position: "sticky",top: 0,zIndex: 1,backgroundColor: "#f8f9fa"}}>
                        S.NO{" "}
                        <input
                          type="checkbox"
                          onChange={(event) => {
                            selectAllCol(event.target.checked);
                            setSelectAll(event.target.checked);
                          }}
                          checked={selectAll}
                        />{" "}
                      </th>
                      {columns.map((column, index) => (
                        <th key={index} style={{ textAlign: column?.textAlign,position: "sticky",top: 0,zIndex: 1,backgroundColor: "#f8f9fa"}}>
                          {column.header}
                        </th>
                      ))}
                      <th style={{ position: "sticky",top: 0,zIndex: 1,backgroundColor: "#f8f9fa"}}>Tag Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignOrderList.length > 0 &&
                      assignOrderList.map((item, rowIndex) => (
                        <tr key={rowIndex}>
                          <td>
                            {rowIndex + 1}{" "}
                            <input
                              type="checkbox"
                              onChange={(event) => {
                                handelChange(rowIndex, "isChecked", event.target.checked);
                              }}
                              checked={item.isChecked}
                            />{" "}
                          </td>
                          {columns.map((column, colIndex) => (
                            <td key={colIndex} style={{ textAlign: column?.textAlign }}>
                              {column.isCurrency ? (
                                <CurrencyDisplay value={item[column.accessor]} />
                              ) : column.decimal_places ? (
                                parseFloat(item[column.accessor]).toFixed(column.decimal_places)
                              ) : (
                                item[column.accessor]
                              )}
                            </td>
                          ))}
                          <td>
                            {item.isChecked && orderType == 1 && (
                              <div className="form-control-wrap">
                                <div className="input-group">
                                <div className="input-group-append" style={{"width":"150px"}} >
                                <TagCodeAutoComplete
                                  id={"tagSearch_" + rowIndex}
                                  placeholder={"Select Tag Code"}
                                  searchValue={item.tagcode}
                                  selectedBranch={filterBranch}
                                  SetSearchValue={(value) => {
                                    handelChange(rowIndex, "tagcode", value);
                                  }}
                                  SetValue={(value, tagDetails) => {
                                    if (
                                      tagDetails &&
                                      item.product == tagDetails.tag_product_id &&
                                      item.design == tagDetails.tag_design_id &&
                                      item.sub_design == tagDetails.tag_sub_design_id
                                    ) {
                                      handelChange(rowIndex, "tagId", value);
                                      setValue("tagId_" + rowIndex, value);
                                      clearErrors("tagId_" + rowIndex);
                                      return true;
                                    } else {
                                      if (tagDetails) {
                                        toastfunc("Tag Details Not Matched For Order Item");
                                        handelChange(rowIndex, "tagcode", []);
                                        handelChange(rowIndex, "tagId", null);
                                        return false;
                                      }
                                    }
                                  }}
                                />
                                  </div>
                                <div className="input-group-append" style={{"width":"150px"}} >
                                <OldTagCodeAutoComplete
                                  id={"oldTagSearch_" + rowIndex}
                                  placeholder={"Select Old Tag Code"}
                                  searchValue={item.old_tag_code}
                                  selectedBranch={filterBranch}
                                  SetSearchValue={(value) => {
                                    handelChange(rowIndex, "old_tag_code", value);
                                  }}
                                  SetValue={(value, tagDetails) => {
                                    if (
                                      tagDetails &&
                                      item.product == tagDetails.tag_product_id &&
                                      item.design == tagDetails.tag_design_id &&
                                      item.sub_design == tagDetails.tag_sub_design_id
                                    ) {
                                      handelChange(rowIndex, "tagId", value);
                                      setValue("tagId_" + rowIndex, value);
                                      clearErrors("tagId_" + rowIndex);
                                      return true;
                                    } else {
                                      if (tagDetails) {
                                        toastfunc("Tag Details Not Matched For Order Item");
                                        handelChange(rowIndex, "old_tag_code", []);
                                        handelChange(rowIndex, "tagId", null);
                                        return false;
                                      }
                                    }
                                  }}
                                />
                                </div>
                                </div>
                               
                                
                                <input
                                  id={"tagId_" + rowIndex}
                                  type="hidden"
                                  value={item.tagId || ""}
                                  {...register("tagId_" + rowIndex, { required: true })}
                                />

                                {errors["tagId_" + rowIndex] && <span className="text-danger">Tag is Required</span>}
                          </div>
                            )}{" "}
                          {orderType == 2 && item.tag_code}
                        </td>
                        </tr>
                      ))}
                </tbody>

            <tfoot style={{ position: 'sticky', bottom: 0, zIndex: 10, backgroundColor: '#fff' }}>
                  <tr style={{ fontWeight: "bold" }}>
                    <td style={{ position: "sticky",top: 0,zIndex: 1,backgroundColor: "#f8f9fa"}}>Total</td>
                    {columns.map((column, index) => (
                      <td key={index} style={{ textAlign: column?.textAlign,position: "sticky",top: 0,zIndex: 1,backgroundColor: "#f8f9fa" }}>
                        {column.isTotalReq ? (
                          column.isCurrency ? (
                            <CurrencyDisplay value={calculateTotal(column.accessor)} />
                          ) : (
                            calculateTotal(column.accessor)
                          )
                        ) : (
                          ""
                        )}
                      </td>
                    ))}
                    <td style={{ position: "sticky",top: 0,zIndex: 1,backgroundColor: "#f8f9fa"}}></td>
                  </tr>
                </tfoot>
              </table>
          </div>
        </Row>
      </div>
    </PreviewCard>
      </Content >
  <OrderPopup
    modal={openModal}
    toggle={toggle}
    title={"Confirm Order"}
    name={"Order"}
    actionName={`${orderType == "1" ? "link" : "unlink"}`}
    clickAction={form_submit}
  />
    </React.Fragment >
  );
};

export default OrderLinkForm;
