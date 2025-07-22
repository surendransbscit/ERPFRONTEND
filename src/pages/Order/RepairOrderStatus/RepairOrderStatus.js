import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
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
import { getRepairs, cancelOrders, getAssignedOrders, deliverdOrders } from "../../../redux/thunks/Order";
import IsRequired from "../../../components/erp-required/erp-required";
import { BranchDropdown, SelectDropdown, SupplierDropdown } from "../../../components/filters/retailFilters";
import { useBranches, useSupplierFilter, useOrderStatus } from "../../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { DateRangePickerInput } from "../../../components/filters/dateRangeFilter";
import { format, subDays } from "date-fns";
import CustomerAutoComplete from "../../../components/common/autoComplete/CustomerAutoComplete";
import { getPagePermission } from "../../../redux/thunks/coreComponent";

const RepairOrderStatus = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    handleSubmit, formState: { errors },
    clearErrors,
    setError,
    reset,
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading: issubmitting, openOrdersList } = useSelector((state) => state.orderReducer);
  const { searchCustomerList } = useSelector((state) => state.customerReducer);

  const { branches } = useBranches();
  const [orderList, setOrderList] = useState([]);
  const { supplier } = useSupplierFilter();
  const { orderStatus } = useOrderStatus();

  const [filterBranch, setFilterBranch] = useState();
  const [filterOrderNo, setFilterOrderNo] = useState();
  const [filterStatus, setFilterStatus] = useState();
  const [selectSupplier, setSelectSupplier] = useState();

  const [selectAll, setSelectAll] = useState(false);
  const [customer, SetCustomer] = useState();
  const [customerSearch, SetCustomerSearch] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
        const [navigateModal, SetNavigateModal] = useState(false);
        const toggleNavigateModal = () => SetNavigateModal(!navigateModal);
          const [inputType, setInputType] = useState();
          const [navigateModalOpened, setNavigateModalOpened] = useState(false);
          const [createMobNum, SetCreateMobNum] = useState();

  const [selectedDates, setSelectedDates] = useState({
    startDate: subDays(new Date(), 6),
    endDate: new Date(),
  });

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
    console.log("Selected dates:", dates);
  };

  useEffect(() => {
    setOrderList(openOrdersList);
  }, [openOrdersList]);

  const form_submit = async (data, actionType) => {
    if (!customer) {
      toastfunc("Please Select the Customer");
      return;
    }
    let assignData = [];
    orderList.map((item) => {
      if (item.isChecked) {
        assignData.push({
          detail_id: item.detail_id,
          cancel_reason: item.cancel_reason ? item.cancel_reason : "",
        });
      }
    });

    if (assignData.length) {
      let payload = {
        order_detail_ids: assignData,
      };

      if (actionType === "deliver") {
        await createOrderDeliverdAssign(payload);
      } else if (actionType === "cancel") {
        await createOrderAssign(payload);
      }
    } else {
      toastfunc("Select Order To Assign");
    }
  };

  const createOrderAssign = async (data) => {
    try {
      await dispatch(cancelOrders(data)).unwrap();
      toastsuccess("Order Assigned successfully");
      reset_form();
      dispatch(getAssignedOrders());
    } catch (error) {
      let message = error?.response?.data?.message;

      toastsuccess(message);
    }
  };
  const createOrderDeliverdAssign = async (data) => {
    try {
      await dispatch(deliverdOrders(data)).unwrap();
      toastsuccess("Order Deliverd Assigned successfully");
      reset_form();
      dispatch(getAssignedOrders());
    } catch (error) {
      let message = error?.response?.data?.message;

      toastsuccess(message);
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
      karigar: selectSupplier,
      branch: filterBranch,
      order_status: filterStatus,
      order_type: 3,
      customer: customer,
      from_date: format(selectedDates.startDate, "yyyy-MM-dd"),
      to_date: format(selectedDates.endDate, "yyyy-MM-dd"),
    };

    dispatch(getRepairs(filters));
  };

  const selectAllCol = (value) => {
    orderList.map((item, rowIndex) => {
      if (isCheckboxNeeded(item)) {
        handelChange(rowIndex, "isChecked", value);
      }
    });
  };

  const isCheckboxNeeded = (item) => {
    if (item.order_status <= 3) {
      return true;
    }
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
    getOrderDetails();
  };

  const columns = [
    { header: "Order No", accessor: "order_no", textAlign: "center" },
    { header: "Order Date", accessor: "order_date", textAlign: "center" },
    { header: "Image", accessor: "image", textAlign: "center", type: "image" },
    { header: "Customer", accessor: "customer", textAlign: "left" },
    { header: "Mobile", accessor: "mobile", textAlign: "center" },
    { header: "Supplier", accessor: "karigar", textAlign: "left" },
    { header: "Order Status", accessor: "name", textAlign: "center", type: "lable" },
    { header: "Product", accessor: "product", textAlign: "center" },
    { header: "Repair Type", accessor: "repair_name", textAlign: "center" },
    { header: "Stn/Dia wt", accessor: "stn/dia_wtduct", textAlign: "center" },
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
        if (pagePermission?.view === false || pagePermission === undefined || pagePermission === null) {
          navigate(`${process.env.PUBLIC_URL}/`);
        }
      }, [pagePermission, navigate]);


  return (
    <React.Fragment>
      <Head title="Repair Order Status" />
      <Content>
        <PreviewCard className="h-100">
          <Row lg={12} className={"form-control-sm"} style={{ marginTop: "10px" }}>
            <Col md={5}>
              <ModifiedBreadcrumb></ModifiedBreadcrumb>
            </Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              <SaveButton
                disabled={issubmitting || !pagePermission?.add}
                size="md"
                color="success"
                onClick={handleSubmit((data) => form_submit(data, "deliver"))}
              >
                {issubmitting ? "DELIVERED ..." : "DELIVERED"}
              </SaveButton>
              <SaveButton
                disabled={issubmitting || !pagePermission?.add}
                size="md"
                color="warning"
                onClick={handleSubmit((data) => form_submit(data, "cancel"))}
              >
                {issubmitting ? "CANCELING ..." : "CANCEL"}
              </SaveButton>

              <Button disabled={issubmitting || !pagePermission?.view} color="secondary" size="md" onClick={() => getOrderDetails()}>
                {issubmitting ? "FILTERING ...." : "FILTER"}
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
              <Col lg="2">
                <label className="form-label" htmlFor="product">
                  customer
                </label>
                <div className="form-group">
                  <CustomerAutoComplete
                    inputType={inputType}
                    setInputType={setInputType}
                    isSearching={isSearching}
                    SetCreateMobNum={SetCreateMobNum}
                    navigateModalOpened={navigateModalOpened}
                    SetNavigateModal={SetNavigateModal}
                    setNavigateModalOpened={setNavigateModalOpened}
                    setIsSearching={setIsSearching}
                    searchCustomerList={searchCustomerList}
                    id={"customerSearch"}
                    placeholder={"Select Customer"}
                    searchValue={customerSearch}
                    SetSearchValue={SetCustomerSearch}
                    SetValue={SetCustomer}
                    customer={customer}
                  />
                </div>
              </Col>

              <Col lg="1"></Col>
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
                      <th style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#f8f9fa" }}>
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
                        <th key={index} style={{ textAlign: column?.textAlign, position: "sticky", top: 0, zIndex: 1, backgroundColor: "#f8f9fa" }}>
                          {column.header}
                        </th>
                      ))}

                      <th style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#f8f9fa" }}>CancelReason</th>
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
                                    src={item[column.accessor]}
                                    alt={column.accessor}
                                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                                  />
                                ) : (
                                  <UserAvatar text={item["image_text"]} />
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
                          <td className="w">
                            {" "}
                            {item.isChecked && item.order_status == 1 && (
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
                      <td style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#f8f9fa" }}>Total</td>
                      {columns.map((column, index) => (
                        <td key={index} style={{ textAlign: column?.textAlign, position: "sticky", top: 0, zIndex: 1, backgroundColor: "#f8f9fa" }}>
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

                      <td style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#f8f9fa" }}></td>
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

export default RepairOrderStatus;
