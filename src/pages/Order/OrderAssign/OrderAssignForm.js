import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import { toastfunc } from "../../../components/sds-toast-style/toast-style";
import Content from "../../../layout/content/Content";
import CurrencyDisplay from "../../../components/common/moneyFormat/moneyFormat";

import { PreviewCard, SaveButton } from "../../../components/Component";
import { Col, Row, UserAvatar } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Badge, Button } from "reactstrap";
import { openOrders, orderAssign } from "../../../redux/thunks/Order";
import IsRequired from "../../../components/erp-required/erp-required";
import { BranchDropdown, SupplierDropdown, SelectDropdown } from "../../../components/filters/retailFilters";
import { useBranches, useSupplierFilter, useEmployee, useFinYears } from "../../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { DateInputField, OrderNoWithFinYear } from "../../../components/form-control/InputGroup";
import OrderAssignModel from "../../../components/modals/OrderAssignModel";
import PreviewImagesModal from "../../../components/modals/PreviewImagesModal";
import moment from "moment";
import PreviewVideoModal from "../../../components/modals/PreviewVideoModal";
import PreviewVoiceModal from "../../../components/modals/PreviewVoiceModal";
import { getPagePermission } from "../../../redux/thunks/coreComponent";

const OrderAssignForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
    setValue,
    setError,
  } = useForm();
  const dispatch = useDispatch();
  const { isLoading: issubmitting, openOrdersList } = useSelector((state) => state.orderReducer);
const location = useLocation()
const navigate = useNavigate()
  const { branches } = useBranches();
  const { supplier } = useSupplierFilter();
  const { employees } = useEmployee();
  const [openModal, setOpenModal] = useState(false);
  const [imageModal, SetImageModal] = useState(false);
  const [previewImages, SetPreviewImages] = useState([]);
  const toggle = () => setOpenModal(!openModal);
  const imageModalClose = () => {
    SetImageModal(!imageModal);
    SetPreviewImages([]);
  };

  const [assignOrderList, setAssignOrderList] = useState([]);

  const [filterBranch, setFilterBranch] = useState();
  const [filterOrderNo, setFilterOrderNo] = useState();

  const [assignType, setAssignType] = useState(1);
  const [assignLabel, SetAssignLabel] = useState(1);
  const [selectEmployee, setSelectEmployee] = useState();
  const [selectSupplier, setSelectSupplier] = useState();
  const [selectedSupplierLabel, setSelectedSupplierLabel] = useState();
  const [selectedEmployeeLabel, setSelectedEmployeeLabel] = useState();
  const [selectAll, setSelectAll] = useState(false);
  const [finId, setFinId] = useState();

  const videoModalClose = () => SetVideoModal(!videoModal);
  const voiceModalClose = () => SetVoiceModal(!voiceModal);
  const [openVModal, setOpenVModal] = useState(false);


  const [videoModal, SetVideoModal] = useState(false);
  const [voiceModal, SetVoiceModal] = useState(false);
  const [previewVideos, SetPreviewVideos] = useState([]);
  const videotoggle = () => setOpenVModal(!openVModal);


  const [openVoModal, setOpenVoModal] = useState(false);
  const [previewVoices, SetPreviewVoices] = useState([]);
  const voicetoggle = () => setOpenVoModal(!openVoModal);

  const { finYears } = useFinYears();

  // console.log(finYears,'finyear')

  const assignTypes = [
    { lable: "Assign To Karigar", value: 1 },
    { lable: "Assign To Employee", value: 2 },
  ];

  useEffect(() => {
    getOrderDetails();
  }, [dispatch])

  useEffect(() => {
    setAssignOrderList(openOrdersList);
  }, [openOrdersList]);

  const form_submit = async (data, actionType) => {
    let assignData = [];
    assignOrderList?.map((item, rowIndex) => {
      if (item.isChecked) {
        assignData.push({
          detail_id: item.detail_id,
          remarks: item.karigar_remark,
          karigar_due_date: moment(item?.karigar_due_date).format("YYYY-MM-DD"),
        });
      }
      //assignData.push(item.detail_id)
    });
    if (assignData.length) {
      let data = {
        assigned_to: assignType,
        supplier: selectSupplier,
        added_through: 1,
        employee: assignType === 1 ? null : selectEmployee,
        order_detail_ids: assignData,
      };
      createOrderAssign(data);
    } else {
      toastfunc("Select Order To Assign");
    }
  };

  const createOrderAssign = async (data) => {
    try {
      await dispatch(orderAssign(data)).unwrap();
      reset_form();
      toggle(false);
      dispatch(openOrders());
    } catch (error) {
      let message = error?.response?.data?.error_message;
      if (Array.isArray(message)) {
        message.forEach((msg) => {
          toastfunc(msg);
        });
      }
    }
  };

  const calculateTotal = (field) => {
    return openOrdersList.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columns.find((item) => item.accessor === field);
      let decimal_places = column && column.decimal_places !== undefined ? column.decimal_places : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const getOrderDetails = () => {
    const filters = {
      finyear: finId ? finId : null,
      orderno: filterOrderNo ? filterOrderNo : null,
      branch: filterBranch ? filterBranch : null,
    };
    dispatch(openOrders(filters));
  };

  const saveFunction = async () => {
    const checkedData = assignOrderList?.filter((item) => item.isChecked === true);
    const hasInvalidDueDate = checkedData?.some((item) => item.karigar_due_date == null || item.karigar_due_date == "" || item.karigar_due_date == undefined);
    if (!selectSupplier && assignType === 1) {
      toastfunc("Supplier is  Required !!");
    } else if (!selectEmployee && assignType === 2) {
      toastfunc("Employee is  Required !!");
    } else if (hasInvalidDueDate) {
      toastfunc("Karigar Due Date is Required for Selected Items!!");
    } else {
      toggle(true);
    }
  };

  const selectAllCol = (value) => {
    assignOrderList.map((item, rowIndex) => {
      handelChange(rowIndex, "isChecked", value);
    });
  };

  const handelChange = (index, field, value) => {

    setAssignOrderList((prevValues) => {

      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      if (field === 'isChecked') {
        updatedObject['karigar_remark'] = updatedObject['remarks'];
        console.log(updatedObject);
      }
      updatedValues[index] = updatedObject;

      return updatedValues;
    });
  };

  const reset_form = async () => {
    reset("");
    setSelectEmployee("");
    setSelectSupplier("");
    setFilterOrderNo("");
    getOrderDetails();
  };

  const columns = [
    { header: "Branch", accessor: "branch_name", textAlign: "center" },
    { header: "Order No", accessor: "order_no", textAlign: "center" },
    { header: "Order Date", accessor: "order_date", textAlign: "center" },
    { header: "Order Status", accessor: "order_status_name", textAlign: "center", type: "lable" },
    { header: "Customer Due Date", accessor: "customer_due_date", textAlign: "center" },
    { header: "Karigar Due Date", accessor: "karigar_due_date", textAlign: "center", type: "dueDate" },
    { header: "Customer", accessor: "customer_name", textAlign: "center" },
    { header: "Mobile", accessor: "customer_mobile", textAlign: "center" },
    { header: "Image", accessor: "image", textAlign: "center", type: "image" },
    { header: "Video", accessor: "video", textAlign: "center", type: "video" },
    { header: "Voice", accessor: "audio", textAlign: "center", type: "voice" },
    { header: "Product", accessor: "product_name", textAlign: "center" },
    { header: "Design", accessor: "design_name", textAlign: "center" },
    { header: "Sub Design", accessor: "sub_design_name", textAlign: "center" },
    { header: "Piece", accessor: "pieces", decimal_places: 0, textAlign: "right", isTotalReq: true },
    { header: "Gwt", accessor: "gross_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Lwt", accessor: "less_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Nwt", accessor: "net_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Size", accessor: "size", textAlign: "right" },
    // { header: "MC", accessor: "mc_value", decimal_places: 2, textAlign: "right" },
    // { header: "Item Cost", accessor: "item_cost", decimal_places: 2, textAlign: "right" },
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


  const handleImagePreview = (data) => {
    if (data?.length > 0) {
      SetPreviewImages(data);
      SetImageModal(true);
    }
  };

  const handleVideoPreview = (data) => {
    if (data?.length > 0) {
      SetPreviewVideos(data);
      SetVideoModal(true);
    }
  };

  const handleVoicePreview = (data) => {
    if (data?.length > 0) {
      SetPreviewVoices(data);
      SetVoiceModal(true);
    }
  };

  return (
    <React.Fragment>
      <Head title="Order Assign" />
      <Content>
        <PreviewImagesModal modal={imageModal} toggle={imageModalClose} files={previewImages} />
        <PreviewVideoModal modal={videoModal} toggle={videoModalClose} files={previewVideos} />
        <PreviewVoiceModal modal={voiceModal} toggle={voiceModalClose} files={previewVoices} />
        <PreviewCard className="h-100">
          <Row lg={12} className={"form-control-sm"} style={{ marginTop: "10px" }}>
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              <SaveButton disabled={issubmitting || !pagePermission?.add} size="md" color="primary" onClick={handleSubmit(saveFunction)}>
                {issubmitting ? "Saving" : "Save"}
              </SaveButton>
            </Col>
          </Row>

          <div className="custom-grid">
            <Row className="g-4 form-control-sm align-center">
              <Col lg="2">
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
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <label className="form-label" htmlFor="selectedDesign">
                    Order No
                  </label>
                  <OrderNoWithFinYear
                    register={register}
                    placeholder="Order No"
                    id={"filterOrderNo"}
                    value={filterOrderNo}
                    isRequired={false}
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

              <Col lg="1"><br></br>
                <Button color="secondary" size="md" onClick={() => getOrderDetails()}>
                  Filter
                </Button>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Assign To
                  </label>
                  <SelectDropdown
                    register={register}
                    id={"assignType"}
                    data={assignTypes}
                    selectedValue={assignType}
                    setLabel={assignLabel}
                    setValue={setValue}
                    clearErrors={clearErrors}
                    onChangeEvent={(value) => {
                      setAssignType(value);
                    }}
                    placeholder={"Assign To"}
                    valueField={"value"}
                    labelField={"lable"}
                  />
                </div>
              </Col>

              {assignType == 1 && (
                <Col lg="2">
                  <label className="form-label" htmlFor="">
                    Assign Supplier
                  </label>
                  <div className="form-group">
                    <SupplierDropdown
                      register={register}
                      isRequired={assignType == 1}
                      id={"supplier"}
                      selectedSupplier={selectSupplier}
                      supplier={supplier}
                      setValue={setValue}
                      selectedSupplierLabel={setSelectedSupplierLabel}
                      onSupplierChange={(value) => {
                        setSelectSupplier(value);
                      }}
                      clearErrors={clearErrors}
                      placeholder={"Select Supplier"}
                      message={errors.supplier && "Supplier Is Required"}
                    />
                  </div>
                </Col>
              )}

              {assignType == 2 && (
                <Col lg="2">
                  <label className="form-label" htmlFor="selectedDesign">
                    Assign Employee
                  </label>
                  <div className="form-group">
                    <SelectDropdown
                      register={register}
                      id={"employee"}
                      data={employees}
                      isRequired={assignType == 2}
                      selectedValue={selectEmployee}
                      setValue={setValue}
                      clearErrors={clearErrors}
                      selectedEmployeeLabel={setSelectedEmployeeLabel}
                      onChangeEvent={(value) => {
                        setSelectEmployee(value);
                      }}
                      placeholder={"Assign To"}
                      valueField={"id_employee"}
                      labelField={"firstname"}
                      message={errors.employee && "Employee Is Required"}
                    />
                  </div>
                </Col>
              )}
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
                        disabled={!pagePermission?.add}
                          type="checkbox"
                          onChange={(event) => {
                            selectAllCol(event.target.checked);
                            setSelectAll(event.target.checked);
                          }}
                          checked={selectAll}
                        />{" "}
                      </th>
                      {columns?.map((column, index) => (
                        <th key={index} style={{ textAlign: column?.textAlign,position: "sticky",top: 0,zIndex: 1,backgroundColor: "#f8f9fa" }}>
                          {column.header}
                        </th>
                      ))}
                      <th style={{ width: "300px",position: "sticky",top: 0,zIndex: 1,backgroundColor: "#f8f9fa" }}>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignOrderList?.length > 0 &&
                      assignOrderList?.map((item, rowIndex) => (
                        <tr key={rowIndex}>
                          <td>
                            {rowIndex + 1}{" "}
                            <input
                            disabled={!pagePermission?.add}
                              type="checkbox"
                              onChange={(event) => {
                                handelChange(rowIndex, "isChecked", event.target.checked);
                              }}
                              checked={item.isChecked}
                            />{" "}
                          </td>
                          {columns?.map((column, colIndex) => (
                            <td key={colIndex} style={{ textAlign: column?.textAlign }}>
                              {column.type === "lable" ? (
                                <Badge
                                  className="badge-sm badge-dot has-bg d-none d-sm-inline-flex"
                                  color={item["colour"]}
                                >
                                  {item[column.accessor]}
                                </Badge>
                              ) : column.type === "image" ? (
                                item[column.accessor] ? (
                                  <img
                                    onClick={() => handleImagePreview(item?.preview_images)}
                                    src={item[column.accessor]}
                                    alt={column.accessor}
                                    style={{
                                      maxWidth: "200px",
                                      maxHeight: "200px",
                                      width: "60px",
                                      borderRadius: "50%",
                                      cursor: "pointer",
                                    }}
                                  />
                                ) : (
                                  <UserAvatar text={item["image_text"]} />
                                )
                              ) : column.type === "video" ? (
                                item[column.accessor] ? (
                                  <video
                                    onClick={() => handleVideoPreview(item?.preview_videos)}
                                    src={item[column.accessor]}
                                    alt={column.accessor}
                                    style={{
                                      maxWidth: "200px",
                                      maxHeight: "200px",
                                      width: "35px",
                                      borderRadius: "40%",
                                      cursor: "pointer",
                                    }}
                                  />
                                ) : (
                                  <UserAvatar text={item["video_text"]} />
                                )
                              ) : column.type === "voice" ? (
                                item[column.accessor] ? (
                                  <Button onClick={() => handleVoicePreview(item?.preview_voices)}>Play</Button>
                                ) : (
                                  <UserAvatar text={item["audio_text"]} />
                                )
                              ) : column.type === "dueDate" ? (
                                <td className="w" style={{ "padding-top": "0px !important" }}>
                                  {" "}
                                  {item.isChecked && (
                                    <DateInputField
                                      minDate={new Date()}
                                      maxDate={new Date(moment(item.customer_due_date).format("YYYY-DD-MM"))}
                                      showYearDropdown={true}
                                      showMonthDropdown={true}
                                      id={"karigar_due_date" + rowIndex}
                                      selected={item.karigar_due_date}
                                      SetValue={(date) => {
                                        handelChange(rowIndex, "karigar_due_date", date);
                                        setValue("karigar_due_date" + rowIndex, date);
                                      }}
                                    />

                                  )}
                                  <div>
                                    {(item.isChecked && item.karigar_due_date == '') && (

                                      <span className="text-danger">Date is Required</span>
                                    )}
                                  </div>
                                </td>

                              ) : column.isCurrency ? (
                                <CurrencyDisplay value={item[column.accessor]} />
                              ) : column.decimal_places ? (
                                parseFloat(item[column.accessor]).toFixed(column.decimal_places)
                              ) : (
                                item[column.accessor]
                              )}
                            </td>
                          ))}

                          <td className="w">
                            {" "}
                            {item.isChecked && (
                              <input
                                style={{ width: "200px" }}
                                id={"updateReson_" + rowIndex}
                                {...register("updateReson_" + rowIndex, { required: true })}
                                placeholder="Remarks"
                                className="form-control form-control-sm"
                                type="text"
                                onChange={(event) => {
                                  handelChange(rowIndex, "karigar_remark", event.target.value);
                                  setValue("updateReson_" + rowIndex, event.target.value);
                                }}
                                value={(item.karigar_remark !== null && item.karigar_remark !== "" ? item.karigar_remark : (item.remarks !== null && item.remarks !== "" ? item.remarks : ''))}
                              />
                            )}

                            {errors["updateReson_" + rowIndex] ? (
                              <span className="text-danger">Remarks is Required</span>
                            ) : (
                              (!item.isChecked) && item.karigar_remark && item.karigar_remark !== "" ? (
                                item.karigar_remark
                              ) : (
                                (!item.isChecked) && item.remarks && item.remarks !== "" ? item.remarks : ""
                              )
                            )}

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
      </Content>
      <OrderAssignModel
        modal={openModal}
        toggle={toggle}
        title={"Order Assign"}
        name={`${assignType == "1" ? selectedSupplierLabel : selectedEmployeeLabel} ${assignType == "1" ? "Karigar" : "employee"
          }`}
        actionName={`assign ${assignOrderList?.filter((item) => item.isChecked == true)?.length} order to`}
        clickAction={form_submit}
      />
    </React.Fragment>
  );
};

export default OrderAssignForm;
