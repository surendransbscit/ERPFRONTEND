import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import Select from "react-select";
import { toastsuccess, toastfunc } from "../../../components/sds-toast-style/toast-style";
import Content from "../../../layout/content/Content";
import PreviewTable from "../../../components/sds-table/PreviewTable";
import CurrencyDisplay from "../../../components/common/moneyFormat/moneyFormat";

import { BlockTitle, CancelButton, PreviewCard, SaveButton } from "../../../components/Component";
import { Col, Row, Icon, UserAvatar } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Badge } from "reactstrap";
import { getAssignedOrders, orderStatusChange } from "../../../redux/thunks/Order";
import IsRequired from "../../../components/erp-required/erp-required";
import { BranchDropdown, SupplierDropdown, SelectDropdown } from "../../../components/filters/retailFilters";
import { useBranches, useSupplierFilter, useEmployee, useOrderStatus } from "../../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { DateRangePickerInput } from "../../../components/filters/dateRangeFilter";
import { format, subDays } from "date-fns";
import PreviewImagesModal from "../../../components/modals/PreviewImagesModal";
import PreviewVideoModal from "../../../components/modals/PreviewVideoModal";
import PreviewVoiceModal from "../../../components/modals/PreviewVoiceModal";
import { getPagePermission } from "../../../redux/thunks/coreComponent";

const JobOrderStatusForm = () => {
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
  const { isLoading: issubmitting, jobOrderList } = useSelector((state) => state.orderReducer);

  const { branches } = useBranches();

  const { supplier } = useSupplierFilter();

  const { employees } = useEmployee();

  const { orderStatus } = useOrderStatus();

  const [orderList, setOrderList] = useState([]);

  const [filterBranch, setFilterBranch] = useState();
  const [filterOrderNo, setFilterOrderNo] = useState();

  const [assignStatus, setAssignStatus] = useState();
  const [filterStatus, setFilterStatus] = useState();
  const [selectSupplier, setSelectSupplier] = useState();
  const [supplierLabel, setSupplierLabel] = useState();
  const [selectAll, setSelectAll] = useState(false);
  const [imageModal, SetImageModal] = useState(false);
  const [previewImages, SetPreviewImages] = useState([]);

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

  const [selectedDates, setSelectedDates] = useState({
    startDate: subDays(new Date(), 6),
    endDate: new Date(),
  });

  const imageModalClose = () => {
    SetImageModal(!imageModal);
    SetPreviewImages([]);
  };

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
    console.log("Selected dates:", dates);
  };

  const orderStatusDefault = [
    { label: "Work in Process", value: 3 },
    { label: "Rejected", value: 7 },
    { label: "Cancel", value: 6 },
    { label: "Delivered", value: 5 },
  ];

  useEffect(() => {
    setOrderList(jobOrderList);
  }, [jobOrderList]);

  const form_submit = async (data, actionType) => {
    let assignData = [];
    orderList?.map((item, rowIndex) => {
      if (item.isChecked) {
        assignData?.push({
          detail_id: item.detail_id,
          id_job_order_detail: item.id_job_order_detail,
          status: item?.assign_status?.value,
          added_through: 1,
          cancel_reason: item.cancel_reason ? item.cancel_reason : null,
        });
      }
    });
    if (assignData.length) {
      setOrderStatusChange(assignData);
    } else {
      toastfunc(" Select Order To Assign");
    }
  };

  const setOrderStatusChange = async (data) => {
    try {
      await dispatch(orderStatusChange(data)).unwrap();
      // toastsuccess("Order Status Updated successfully");
      reset_form();
      // getOrderDetails();
    } catch (error) {
      let message = error?.response?.data?.message;

      toastsuccess(message);
    }
  };

  const calculateTotal = (field) => {
    return orderList.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columns.find((item) => item.accessor === field);
      let decimal_places = column && column.decimal_places !== undefined ? column.decimal_places : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const getOrderDetails = () => {
    let filters = {
      karigar: selectSupplier,
      branch: filterBranch,
      order_status: filterStatus,
      from_date: format(selectedDates.startDate, "yyyy-MM-dd"),
      to_date: format(selectedDates.endDate, "yyyy-MM-dd"),
    };

    dispatch(getAssignedOrders(filters));
  };

  const selectAllCol = (value) => {
    orderList?.map((item, rowIndex) => {
      if (isCheckboxNeeded(item)) {
        handelChange(rowIndex, "isChecked", value);
      }
    });
  };

  const isCheckboxNeeded = (item) => {
    if (item.order_status == 1) {
      return true;
    }

    if (item.order_status == 3) {
      return true;
    }

    if (item.order_status == 7) {
      return false;
    }
    if (item.order_status == 6) {
      return false;
    }
    if (item.order_status == 5) {
      return true;
    }

    return false;
  };

  const handelChange = (index, field, value) => {
    setOrderList((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;

      return updatedValues;
    });
  };

  const reset_form = async () => {
    reset("");
    setFilterStatus();
    setSelectSupplier();
    getOrderDetails();
  };

  const columns = [
    // { header: "Ref No", accessor: "ref_no", textAlign: "center" },
    { header: "Supplier", accessor: "karigar", textAlign: "left" },
    { header: "Order No.", accessor: "order_no", textAlign: "left" },
    { header: "Assiged Date", accessor: "assigned_date", textAlign: "center" },
    { header: "Customer Due Date", accessor: "customer_due_date", textAlign: "center" },
    { header: "Karigar Due Date", accessor: "karigar_due_date", textAlign: "center" },
    { header: "Image", accessor: "image", textAlign: "center", type: "image" },
    { header: "Video", accessor: "video", textAlign: "center", type: "video" },
    { header: "Voice", accessor: "audio", textAlign: "center", type: "voice" },
    { header: "Product", accessor: "product", textAlign: "center" },
    { header: "Design", accessor: "design", textAlign: "center" },
    { header: "Sub Design", accessor: "sub_design", textAlign: "center" },
    { header: "Piece", accessor: "pieces", decimal_places: 0, textAlign: "right", isTotalReq: true },
    { header: "Gwt", accessor: "gross_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Lwt", accessor: "less_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },
    { header: "Nwt", accessor: "net_wt", decimal_places: 3, textAlign: "right", isTotalReq: true },

    // { header: "Order No", accessor: "order_no", textAlign: "center" },
    // { header: "Order Status", accessor: "order_status_name", textAlign: "center", type: "lable" },
  ];

  // console.log(employees);

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

  const pathName = location?.pathname;
   const { pagePermission } = useSelector((state) => state.coreCompReducer);

   useEffect(() => {
      dispatch(getPagePermission({ path: pathName }));
    }, [pathName, dispatch]);

  useEffect(() => {
        if (pagePermission?.view === false || pagePermission === undefined || pagePermission === null) {
          navigate(`${process.env.PUBLIC_URL}/`);
        }
      }, [pagePermission, navigate]);


  return (
    <React.Fragment>
      <Head title="Job Order Status" />
      <Content>
        <PreviewImagesModal modal={imageModal} toggle={imageModalClose} files={previewImages} />
        <PreviewVideoModal modal={videoModal} toggle={videoModalClose} files={previewVideos} />
        <PreviewVoiceModal modal={voiceModal} toggle={voiceModalClose} files={previewVoices} />
        {/* <BlockTitle tag="h6" className="fw-normal">
          Add Design Mapping
        </BlockTitle> */}
        <PreviewCard className="h-100">
          <Row lg={12} className={"form-control-sm"} style={{ marginTop: "10px" }}>
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              <SaveButton
                disabled={issubmitting || !pagePermission?.add}
                size="md"
                color="primary"
                onClick={handleSubmit((data) => form_submit(data, "saveAndNew"))}
              >
                {issubmitting ? "Saving" : "Save"}
              </SaveButton>

              <Button color="secondary" size="md" onClick={() => getOrderDetails()}>
                FILTER
              </Button>
            </Col>
          </Row>

          <div className="custom-grid">
            <Row className="g-3 form-control-sm align-center">
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
                    isRequired={false}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.selectedProduct && "Branch is Required"}
                  />
                </div>
              </Col>

              <Col lg="2">
                <label className="form-label" htmlFor="">
                  Supplier
                </label>
                <div className="form-group">
                  <SupplierDropdown
                    register={register}
                    id={"supplier"}
                    selectedSupplier={selectSupplier}
                    supplier={supplier}
                    setValue={setValue}
                    selectedSupplierLabel={setSupplierLabel}
                    onSupplierChange={(value) => {
                      setSelectSupplier(value);
                    }}
                    clearErrors={clearErrors}
                    placeholder={"Select Supplier"}
                  />
                </div>
              </Col>

              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Filter Status
                  </label>
                  <SelectDropdown
                    register={register}
                    id={"filterStatus"}
                    data={orderStatus}
                    selectedValue={filterStatus}
                    setValue={setValue}
                    clearErrors={clearErrors}
                    onChangeEvent={(value) => {
                      console.log(value);
                      setFilterStatus(value);
                    }}
                    placeholder={"Filter Status"}
                    valueField={"value"}
                    labelField={"label"}
                  />
                </div>
              </Col>

              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Filter Date
                  </label>
                  <DateRangePickerInput
                    startDate={selectedDates.startDate}
                    endDate={selectedDates.endDate}
                    onChange={handleDateChange}
                  />
                </div>
              </Col>

              <Col lg="2"></Col>

              {/* <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Assign Status
                  </label>
                  <SelectDropdown
                    register={register}
                    id={"assignStatus"}
                    data={orderStatusDefault}
                    selectedValue={assignStatus}
                    setValue={setValue}
                    clearErrors={clearErrors}
                    onChangeEvent={(value) => {
                      setAssignStatus(value);
                      setOrderList(jobOrderList);
                    }}
                    placeholder={"Assign Status"}
                    valueField={"value"}
                    labelField={"label"}
                  />
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
                        disabled={!pagePermission?.add}
                          type="checkbox"
                          onChange={(event) => {
                            selectAllCol(event.target.checked);
                            setSelectAll(event.target.checked);
                          }}
                          checked={selectAll}
                        />{" "}
                      </th>
                      {columns.map((column, index) => (
                        <th key={index} style={{ textAlign: column?.textAlign, position: "sticky",top: 0,zIndex: 1,backgroundColor: "#f8f9fa"}}>
                          {column.header}
                        </th>
                      ))}

                      <th style={{ position: "sticky",top: 0,zIndex: 1,backgroundColor: "#f8f9fa"}}>Assign Status</th>
                      <th style={{ position: "sticky",top: 0,zIndex: 1,backgroundColor: "#f8f9fa"}}>Cancel Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderList.length > 0 &&
                      orderList.map((item, rowIndex) => (
                        <tr key={rowIndex}>
                          <td>
                            {rowIndex + 1}{" "}
                            {isCheckboxNeeded(item) && (
                              <input
                              disabled={!pagePermission?.add}
                                type="checkbox"
                                onChange={(event) => {
                                  handelChange(rowIndex, "isChecked", event.target.checked);
                                }}
                                checked={item.isChecked}
                              />
                            )}{" "}
                          </td>
                          {columns.map((column, colIndex) => (
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
                                      maxWidth: "100px",
                                      maxHeight: "100px",
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
                              ) : column.isCurrency ? (
                                <CurrencyDisplay value={item[column.accessor]} />
                              ) : column.decimal_places ? (
                                parseFloat(item[column.accessor]).toFixed(column.decimal_places)
                              ) : (
                                item[column.accessor]
                              )}
                            </td>
                          ))}
                          <td>
                            <div className="form-group" style={{ width: "150px" }}>
                              <div className="form-control-wrap">
                                <Select
                                  isDisabled={
                                    item.isChecked == false || item.order_status == 6 || item.order_status == 5
                                  }
                                  value={item.assign_status}
                                  onChange={(e) => {
                                    handelChange(rowIndex, "assign_status", e);
                                    setValue("assign_status" + rowIndex, e);
                                  }}
                                  options={orderStatusDefault}
                                  placeholder={"Assign Status"}
                                  id={"assign_status" + rowIndex}
                                  menuPortalTarget={document.body}
                                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999, fontSize: "12px" }) }}
                                />
                                <input
                                  type="hidden"
                                  value={item.assign_status}
                                  {...register(`assign_status${rowIndex}`)}
                                />
                              </div>
                            </div>
                          </td>

                          <td>
                            {" "}
                            {item?.assign_status?.value == 6 && item.isChecked && (
                              <div className="form-group" style={{ width: "150px" }}>
                                <input
                                  id={"updateReson_" + rowIndex}
                                  {...register("updateReson_" + rowIndex, { required: true })}
                                  placeholder="Cancel Reason"
                                  className="form-control form-control-sm"
                                  type="text"
                                  onChange={(event) => {
                                    handelChange(rowIndex, "cancel_reason", event.target.value);
                                    setValue("updateReson_" + rowIndex, event.target.value);
                                  }}
                                  value={item.cancel_reason}
                                />
                              </div>
                            )}{" "}
                            {errors["updateReson_" + rowIndex] && (
                              <span className="text-danger">Cancel Reason is Required</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>

                  <tfoot style={{ position: 'sticky', bottom: 0, zIndex: 10, backgroundColor: '#fff' }}>
                    <tr style={{ fontWeight: "bold" }}>
                      <td style={{ position: "sticky",top: 0,zIndex: 1,backgroundColor: "#f8f9fa"}}>Total</td>
                      {columns.map((column, index) => (
                        <td key={index} style={{ textAlign: column?.textAlign,position: "sticky",top: 0,zIndex: 1,backgroundColor: "#f8f9fa"}}>
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
                      {/* <td style={{ position: "sticky",top: 0,zIndex: 1,backgroundColor: "#f8f9fa"}}></td> */}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default JobOrderStatusForm;
