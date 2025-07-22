import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import { PreviewCard, SaveButton } from "../../../components/Component";
import { Badge, Button, Col, Row } from "reactstrap";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import Select from "react-select";
import {
  useBranches,
  useOrderStatus,
  useProducts,
  useSupplierFilter,
} from "../../../components/filters/filterHooks";
import CurrencyDisplay from "../../../components/common/moneyFormat/moneyFormat";
import {
  BranchDropdown,
  ProductDropdown,
  SelectDropdown,
  SupplierDropdown,
} from "../../../components/filters/retailFilters";
import { DateRangePickerInput } from "../../../components/filters/dateRangeFilter";
import { format, subDays } from "date-fns";
import {
  cancelOrders,
  getPurchaseOrderStatusList,
  purchaseOrderStatusChange,
} from "../../../redux/thunks/Order";
import { useForm } from "react-hook-form";
import IsRequired from "../../../components/erp-required/erp-required";
import {
  toastfunc,
  toastsuccess,
} from "../../../components/sds-toast-style/toast-style";
import { getPagePermission } from "../../../redux/thunks/coreComponent";

const PurchaseOrderStatus = () => {
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
  const location = useLocation()

  const { branches } = useBranches();
  const { supplier } = useSupplierFilter();
  const { products } = useProducts();
  const { order_status } = useOrderStatus();

  const [orderList, setOrderList] = useState([]);
  const [filterBranch, setFilterBranch] = useState();
  const [filterProduct, setFilterProduct] = useState();
  const [filterOrderNo, setFilterOrderNo] = useState();
  const [filterStatus, setFilterStatus] = useState();
  const [selectSupplier, setSelectSupplier] = useState();

  const [selectAll, setSelectAll] = useState(false);

  const [selectedDates, setSelectedDates] = useState({
    startDate: subDays(new Date(), 6),
    endDate: new Date(),
  });

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
    console.log("Selected dates:", dates);
  };

  const { isLoading: issubmitting, purchaseOrderStatusList } = useSelector(
    (state) => state.orderReducer
  );

  const pathName = location?.pathname;
    const { pagePermission } = useSelector((state) => state.coreCompReducer);
    // console.log(pagePermission);
  
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

  const columns = [
    // { header: "Ref No", accessor: "ref_no", textAlign: "center" },
    { header: "Supplier", accessor: "karigar", textAlign: "left" },
    { header: "Order No.", accessor: "order_no", textAlign: "left" },
    { header: "Date", accessor: "date", textAlign: "center" },
    {
      header: "Karigar Due Date",
      accessor: "karigar_due_date",
      textAlign: "center",
    },
    { header: "Product", accessor: "product_name", textAlign: "center" },
    {
      header: "Size",
      accessor: "size",
      decimal_places: 0,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Piece",
      accessor: "pieces",
      decimal_places: 0,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Gwt",
      accessor: "gross_wt",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Nwt",
      accessor: "net_wt",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },

    // { header: "Order No", accessor: "order_no", textAlign: "center" },
    // { header: "Order Status", accessor: "order_status_name", textAlign: "center", type: "lable" },
  ];

  const orderStatusDefault = [
    { label: "Cancel", value: 6 },
    { label: "Delivered", value: 5 },
    { label: "Work in Progress", value: 3 },
  ];

  const getOrderDetails = () => {
    let filters = {
      karigar: selectSupplier,
      branch: filterBranch,
      product: filterProduct,
      order_status: filterStatus,
      from_date: format(selectedDates.startDate, "yyyy-MM-dd"),
      to_date: format(selectedDates.endDate, "yyyy-MM-dd"),
    };

    dispatch(getPurchaseOrderStatusList(filters));
  };

  const calculateTotal = (field) => {
    return orderList.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columns.find((item) => item.accessor === field);
      let decimal_places =
        column && column.decimal_places !== undefined
          ? column.decimal_places
          : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
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

  const isCheckboxNeeded = (item) => {
    if (item.order_status == 6) {
      return false;
    }
    if (item.order_status == 5) {
      return true;
    }
    if (item.order_status == 4) {
      return true;
    }
     if (item.order_status == 3) {
      return true;
    }

    return false;
  };

  const selectAllCol = (value) => {
    orderList?.map((item, rowIndex) => {
      if (isCheckboxNeeded(item)) {
        handelChange(rowIndex, "isChecked", value);
      }
    });
  };

  const form_submit = async () => {
    let assignData = [];
    orderList?.map((item, rowIndex) => {
      if (item.isChecked) {
        assignData?.push({
          detail_id: item.detail_id,
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
      await dispatch(purchaseOrderStatusChange(data)).unwrap();
      // toastsuccess("Order Status Updated successfully");
      reset_form();
      // getOrderDetails();
    } catch (error) {
      let message = error?.response?.data?.message;

      toastsuccess(message);
    }
  };

  useEffect(() => {
    setOrderList(purchaseOrderStatusList);
  }, [purchaseOrderStatusList]);

  return (
    <React.Fragment>
      <Head title="Purchase Order Status" />
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
                disabled={issubmitting}
                size="md"
                color="primary"
                onClick={handleSubmit(form_submit)}
              >
                {issubmitting ? "Saving" : "Save"}
              </SaveButton>

              <Button
                disabled={issubmitting}
                color="secondary"
                size="md"
                onClick={() => getOrderDetails()}
              >
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
                  Product
                </label>
                <div className="form-group">
                  <ProductDropdown
                    register={register}
                    id={"id_product"}
                    products={products}
                    selectedProduct={filterProduct}
                    onProductChange={(value) => {
                      setFilterProduct(value);
                    }}
                    isRequired={false}
                    clearErrors={clearErrors}
                    setValue={setValue}
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
                <label className="form-label" htmlFor="filterStatus">
                  Status
                </label>
                <div className="form-group">
                  <div>
                    <Select
                      value={
                        orderStatusDefault?.find(
                          (option) => option.value === filterStatus
                        ) || null
                      }
                      onChange={(e) => {
                        const selectedValue = parseInt(e.value, 10);
                        setFilterStatus(selectedValue);
                        setValue("filterStatus", selectedValue);
                        clearErrors("filterStatus");
                      }}
                      options={orderStatusDefault}
                      placeholder={"Select Status"}
                      id={"filterStatus"}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                          fontSize: "12px",
                        }),
                      }}
                      isClearable
                    />
                    <input
                      type="hidden"
                      value={filterStatus || ""}
                      {...register("filterStatus", { required: false })}
                    />
                    {/* {message && <span className="text-danger">{message}</span>} */}
                  </div>
                  {/* <select
                    id="filterStatus"
                    className="form-control"
                    {...register("filterStatus")}
                    value={filterStatus}
                    onChange={(e) => {
                      const selectedValue = parseInt(e.target.value, 10);
                      setFilterStatus(selectedValue);
                      setValue("filterStatus", selectedValue);
                      clearErrors("filterStatus");
                    }}
                  >
                    <option value="">Select Status</option>
                    {orderStatusDefault.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select> */}
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
            </Row>

            <Row className="mt-2" md={12}>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>
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
                        <th
                          key={index}
                          style={{ textAlign: column?.textAlign }}
                        >
                          {column.header}
                        </th>
                      ))}

                      <th>Assign Status</th>
                      <th>Cancel Reason</th>
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
                                  handelChange(
                                    rowIndex,
                                    "isChecked",
                                    event.target.checked
                                  );
                                }}
                                checked={item.isChecked}
                              />
                            )}{" "}
                          </td>
                          {columns.map((column, colIndex) => (
                            <td
                              key={colIndex}
                              style={{ textAlign: column?.textAlign }}
                            >
                              {column.type === "lable" ? (
                                <Badge
                                  className="badge-sm badge-dot has-bg d-none d-sm-inline-flex"
                                  color={item["colour"]}
                                >
                                  {item[column.accessor]}
                                </Badge>
                              ) : column.isCurrency ? (
                                <CurrencyDisplay
                                  value={item[column.accessor]}
                                />
                              ) : column.decimal_places ? (
                                parseFloat(item[column.accessor]).toFixed(
                                  column.decimal_places
                                )
                              ) : (
                                item[column.accessor]
                              )}
                            </td>
                          ))}
                          <td>
                            <div
                              className="form-group"
                              style={{ width: "150px" }}
                            >
                              <div className="form-control-wrap">
                                <Select
                                  isDisabled={
                                    item.isChecked == false ||
                                    item.order_status == 6 ||
                                    item.order_status == 5
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
                                  value={item.assign_status}
                                  {...register(`assign_status${rowIndex}`)}
                                />
                              </div>
                            </div>
                          </td>

                          <td>
                            {" "}
                            {item?.assign_status?.value == 6 &&
                              item.isChecked && (
                                <div
                                  className="form-group"
                                  style={{ width: "150px" }}
                                >
                                  <input
                                    id={"updateReson_" + rowIndex}
                                    {...register("updateReson_" + rowIndex, {
                                      required: true,
                                    })}
                                    placeholder="Cancel Reason"
                                    className="form-control form-control-sm"
                                    type="text"
                                    onChange={(event) => {
                                      handelChange(
                                        rowIndex,
                                        "cancel_reason",
                                        event.target.value
                                      );
                                      setValue(
                                        "updateReson_" + rowIndex,
                                        event.target.value
                                      );
                                    }}
                                    value={item.cancel_reason}
                                  />
                                </div>
                              )}{" "}
                            {errors["updateReson_" + rowIndex] && (
                              <span className="text-danger">
                                Cancel Reason is Required
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>

                  <tfoot>
                    <tr style={{ fontWeight: "bold" }}>
                      <td>Total</td>
                      {columns.map((column, index) => (
                        <td
                          key={index}
                          style={{ textAlign: column?.textAlign }}
                        >
                          {column.isTotalReq ? (
                            column.isCurrency ? (
                              <CurrencyDisplay
                                value={calculateTotal(column.accessor)}
                              />
                            ) : (
                              calculateTotal(column.accessor)
                            )
                          ) : (
                            ""
                          )}
                        </td>
                      ))}

                      <td></td>
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

export default PurchaseOrderStatus;
