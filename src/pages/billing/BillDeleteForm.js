import React, { useEffect, useState } from "react";
import Head from "../../layout/head/Head";
import { toastfunc } from "../../components/sds-toast-style/toast-style";
import Content from "../../layout/content/Content";
import CurrencyDisplay from "../../components/common/moneyFormat/moneyFormat";
import { PreviewCard, SaveButton } from "../../components/Component";
import { Col, Row, Icon } from "../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "reactstrap";
import IsRequired from "../../components/erp-required/erp-required";
import { BranchDropdown } from "../../components/filters/retailFilters";
import { useBranches } from "../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import {
  deleteInvoiceList,
  getDeleteableInvoiceList,
  convertInvoiceList,
} from "../../redux/thunks/billing";
import { format, subDays } from "date-fns";
import { DateRangePickerInput } from "../../components/filters/dateRangeFilter";
import { NumberInputField } from "../../components/form-control/InputGroup";
import { getPagePermission } from "../../redux/thunks/coreComponent";
import BillDeleteOtpModal from "../../components/modals/BillDeleteOtpModal";

const BillDeleteForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const add = location?.state?.add;
  const id = location?.state?.id;
  const {
    register,
    formState: { errors },
    clearErrors,
    reset,
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading: issubmitting, deleteableInvoiceList } = useSelector(
    (state) => state.billingReducer
  );

  const [otpModal, setOtpModal] = useState(false);

  const toggle = () => {
    setOtpModal(!otpModal);
  };

 const {
    userInfo,
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
  const [selectedDeleteIndex, setSelectedDeleteIndex] = useState(null);

  const { branches } = useBranches();
  const [list, setList] = useState([]);
  const [filterBranch, setFilterBranch] = useState();
  const [cashGreaterThan, setCashGreaterThan] = useState();
  const [selectAll, setSelectAll] = useState(false);
  const [filterType, setFilterType] = useState("1");

  const [otp, setOtp] = useState(new Array(6).fill(""));

  const [selectedDates, setSelectedDates] = useState({
    startDate: subDays(new Date(), 6),
    endDate: new Date(),
  });

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };
  const column = [
    { header: "Bill No", accessor: "invoice_no", textAlign: "center" },
    {
      header: "Tag Code",
      accessor: "tag_code",
      textAlign: "center",
      customised: true,
    },
    { header: "Item Type", accessor: "item_type", textAlign: "center" },
    { header: "Customer Name", accessor: "customer_name", textAlign: "center" },
    {
      header: "Customer Mobile",
      accessor: "customer_mobile",
      textAlign: "center",
    },
    { header: "Product Name", accessor: "product_name", textAlign: "center" },
    { header: "Design Name", accessor: "design_name", textAlign: "center" },
    {
      header: "Sub Design Name",
      accessor: "sub_design_name",
      textAlign: "center",
    },
    {
      header: "Gwt",
      accessor: "gross_wt",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Lwt",
      accessor: "less_wt",
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
    {
      header: "Dia Wt",
      accessor: "dia_wt",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Stone Wt",
      accessor: "stone_wt",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
  ];
  const [columns, setColumns] = useState(column);

  useEffect(() => {
    if (deleteableInvoiceList?.columns != undefined) {
      setColumns(deleteableInvoiceList.columns);
      setList(deleteableInvoiceList.rows);
    }
  }, [deleteableInvoiceList]);

  const form_submit = async (data, actionType) => {
    let assignData = [];
    list?.map((item, rowIndex) => {
      if (item.isChecked) {
        assignData.push(item.erp_invoice_id);
      }
    });
    if (assignData.length) {
      let data = {
        erp_invoice_ids: assignData,
      };
      createJewelDelivered(data);
    } else {
      toastfunc(" Select Item to Delete");
    }
  };

  // const form_submit = async (data = null, index = null) => {
  //   let assignData = [];

  //   if (index !== null) {
  //     assignData.push(list[index]?.erp_invoice_id);
  //   } else {
  //     list?.forEach((item) => {
  //       if (item.isChecked) assignData.push(item.erp_invoice_id);
  //     });
  //   }

  //   if (assignData.length) {
  //     let data = { erp_invoice_ids: assignData };
  //     createJewelDelivered(data);
  //   } else {
  //     toastfunc("Select Item to Delete");
  //   }
  // };

  const createJewelDelivered = async (data) => {
    try {
      let response = await dispatch(deleteInvoiceList(data)).unwrap();
      reset_form();
    } catch (error) {
      let message = error?.response?.data?.message;
      toastfunc(message);
    }
  };

  const submit = async (data, actionType) => {
    let assignData = [];
    let allow_submit = true;
    list?.map((item, rowIndex) => {
      if (item.isChecked) {
        let max_inward_cash_limit = userInfo.settings?.max_inward_cash_limit;
        if (parseFloat(item.csh_payment) > parseFloat(max_inward_cash_limit)) {
          toastfunc("Cash Amount Greater than " + max_inward_cash_limit);
          allow_submit = false;
          return true;
        } else {
          assignData.push(item.erp_invoice_id);
        }
      }
    });
    if (assignData.length && allow_submit) {
      let data = {
        erp_invoice_ids: assignData,
      };
      createConvertBill(data);
    }
  };

  const createConvertBill = async (data) => {
    try {
      let response = await dispatch(convertInvoiceList(data)).unwrap();
      reset_form();
    } catch (error) {
      let message = error?.response?.data?.message;
      toastfunc(message);
    }
  };

  const getBillDetails = () => {
    if (filterBranch) {
      const filters = {
        branch: filterBranch,
        from_date: format(selectedDates.startDate, "yyyy-MM-dd"),
        to_date: format(selectedDates.endDate, "yyyy-MM-dd"),
        filter_type: filterType,
      };

      dispatch(getDeleteableInvoiceList(filters));
    } else if (!filterBranch) {
      toastfunc("Branch Required !!");
    }
  };

  const selectAllCol = (value) => {
    list?.map((item, rowIndex) => {
      handelChange(rowIndex, "isChecked", value);
    });
  };

  const handelChange = (index, field, value) => {
    setList((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;

      return updatedValues;
    });
  };

  const reset_form = async () => {
    reset("");
    setList([]);
    setFilterBranch();
  };

  const handleFormChange = (index, field, value) => {
    setList((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;

      return updatedValues;
    });
  };

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
      navigate(`${process.env.PUBLIC_URL}/billing/list`);
    }
  }, [pagePermission, navigate]);

 const handleDelete = (index) => {
    if (settings?.is_otp_req_for_bill_delete === true) {
      setSelectedDeleteIndex(index);
      setOtpModal(true);
    } else if (settings?.is_otp_req_for_bill_delete === false) {
      form_submit();
    }
  };

  return (
    <React.Fragment>
      <Head title="Bill Delete" />
      <Content>
        <PreviewCard className="h-100">
          <Row
            lg={12}
            className={"form-control-sm"}
            style={{ marginTop: "10px" }}
          >
            <Col md={5}>
              <ModifiedBreadcrumb></ModifiedBreadcrumb>
            </Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              <SaveButton
                disabled={issubmitting || !pagePermission?.delete}
                size="md"
                color="danger"
                onClick={() => {
                  const anyChecked = list.some((item) => item.isChecked);
                  if (anyChecked) {
                    handleDelete(null); // open modal with selected rows
                  } else {
                    toastfunc("Select at least one row to delete");
                  }
                }}
              >
                Remove
              </SaveButton>

              <SaveButton
                disabled={issubmitting || !pagePermission?.add}
                size="md"
                color="primary"
                onClick={submit}
              >
                Create
              </SaveButton>

              <SaveButton
                disabled={issubmitting || !pagePermission?.view}
                color="secondary"
                size="md"
                onClick={() => getBillDetails()}
              >
                Search
              </SaveButton>
            </Col>
          </Row>

          <div className="custom-grid">
            <Row className="g-3 align-center form-control-sm">
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
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Filter Date
                  </label>
                  <br />
                  <DateRangePickerInput
                    startDate={selectedDates.startDate}
                    endDate={selectedDates.endDate}
                    onChange={handleDateChange}
                  />
                </div>
              </Col>
              <Col lg="3">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Filter Type
                  </label>
                  <br />
                  <div className="form-group">
                    <div
                      style={{ marginLeft: "5px" }}
                      className="custom-control custom-control-sm custom-radio"
                    >
                      <input
                        type="radio"
                        id="filter_type_csh"
                        name={"filterType"}
                        value={"1"}
                        className="custom-control-input"
                        checked={filterType === "1"}
                        {...register("filterType", { required: true })}
                        onChange={(e) => {
                          setFilterType(e.target.value);
                        }}
                      />
                      <label
                        htmlFor="filter_type_csh"
                        className="custom-control-label"
                      >
                        {" "}
                        Only Cash
                      </label>
                    </div>
                    &nbsp;
                    <div className="custom-control custom-control-sm custom-radio">
                      <input
                        type="radio"
                        id="filter_type_cshless"
                        name={"filterType"}
                        value={"2"}
                        className="custom-control-input"
                        {...register("filterType", { required: true })}
                        checked={filterType === "2"}
                        onChange={(e) => {
                          setFilterType(e.target.value);
                        }}
                      />
                      <label
                        htmlFor="filter_type_cshless"
                        className="custom-control-label"
                      >
                        Multiple Mode Payments
                      </label>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="mt-2" md={12}>
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
                      <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        Invoice No
                      </th>
                      <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        Customer
                      </th>
                      <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        Mobile
                      </th>
                      <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        Received Amount
                      </th>
                      <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        Cash Amount
                      </th>
                      <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        Card Amount
                      </th>
                      <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        UPI Amount
                      </th>
                      <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        NB Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {list?.length > 0 &&
                      list?.map((item, rowIndex) => (
                        <tr key={rowIndex}>
                          <td>
                            {rowIndex + 1}{" "}
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
                            />{" "}
                          </td>
                          <td>{item.invoice_no}</td>
                          <td>{item.customer_name}</td>
                          <td>{item.mobile}</td>
                          <td>{item.received_amount}</td>
                          {filterType === "1" && <td>{item.csh_payment}</td>}
                          {filterType === "2" && (
                            <td>
                              <div style={{ width: "150px" }}>
                                <NumberInputField
                                  placeholder="Cash Amount"
                                  id={"csh_amount_" + rowIndex}
                                  value={item.csh_payment}
                                  isRequired={false}
                                  min={0}
                                  type={"number"}
                                  setValue={setValue}
                                  handleKeyDownEvents={true}
                                  handleDecimalDigits={true}
                                  decimalValues={2}
                                  SetValue={(value) => {
                                    handleFormChange(
                                      rowIndex,
                                      "csh_payment",
                                      value
                                    );
                                    clearErrors("csh_amount_" + rowIndex);
                                  }}
                                  register={register}
                                />
                              </div>
                            </td>
                          )}

                          <td>{item.card_payment}</td>
                          <td>{item.upi_payment}</td>
                          <td>{item.net_banking_payment}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Row>
          </div>
        </PreviewCard>
        <BillDeleteOtpModal
          modal={otpModal}
          toggle={toggle}
          clickAction={form_submit}
          otp={otp}
          setOtp={setOtp}
        />
      </Content>
    </React.Fragment>
  );
};

export default BillDeleteForm;
