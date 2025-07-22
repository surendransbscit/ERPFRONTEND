import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import {
  toastsuccess,
  toastfunc,
} from "../../../components/sds-toast-style/toast-style";
import Content from "../../../layout/content/Content";
import {
  BlockTitle,
  CancelButton,
  PreviewCard,
  SaveButton,
} from "../../../components/Component";
import { Col, Row, Icon, UserAvatar } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Badge } from "reactstrap";

import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { DateRangePickerInput } from "../../../components/filters/dateRangeFilter";
import { format, subDays } from "date-fns";
import {
  cancelVoucherIssue,
  getVoucherIssueStatusDetails,
} from "../../../redux/thunks/promotionManagement";

const VoucherIssueStatusForm = () => {
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
  const { isLoading: issubmitting, VoucherDetailsList } = useSelector(
    (state) => state.promotionManagementVoucherIssueReducer
  );

  const [voucherList, setVoucherList] = useState([]);
  const hasChecked = voucherList.some((item) => item.isChecked);

  const [selectAll, setSelectAll] = useState(false);

  const [selectedDates, setSelectedDates] = useState({
    startDate: subDays(new Date(), 6),
    endDate: new Date(),
  });

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
    console.log("Selected dates:", dates);
  };

  useEffect(() => {
    setVoucherList(VoucherDetailsList);
  }, [VoucherDetailsList]);

  const form_submit = async () => {
    try {
      const selectedVouchers = voucherList.filter((item) => item.isChecked);
      const issueIds = selectedVouchers.map((item) => item.issue_id);
      if (issueIds.length === 0) {
        toastfunc("Select Voucher to cancel");
        return;
      }
      const payload = {
        issue_ids: issueIds,
      };
      await cancelVoucher(payload);
    } catch (error) {
      toastfunc("An error occurred while cancelling vouchers");
      console.error(error);
    }
  };

  const cancelVoucher = async (data) => {
    try {
      await dispatch(cancelVoucherIssue(data)).unwrap();
      toastsuccess("Voucher cancelled successfully");
      resetForm();
    } catch (error) {
      let message = error?.response?.data?.message || "Something went wrong.";
      toastfunc(message);
    }
  };

  const resetForm = () => {
    reset("");
    getVoucherDetails();
  };

  const getVoucherDetails = () => {
    const filters = {
      from_date: format(selectedDates.startDate, "yyyy-MM-dd"),
      to_date: format(selectedDates.endDate, "yyyy-MM-dd"),
    };
    dispatch(getVoucherIssueStatusDetails(filters));
  };

  const selectAllCol = (value) => {
    voucherList.map((item, rowIndex) => {
      if (isCheckboxNeeded(item)) {
        handelChange(rowIndex, "isChecked", value);
      }
    });
  };

  const isCheckboxNeeded = (item) => {
    if (item) {
      return true;
    }
  };

  const handelChange = (index, field, value) => {
    setVoucherList((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;

      return updatedValues;
    });
  };

    
  const columns = [
    { header: "Voucher Name", accessor: "voucher_name", textAlign: "center" },
    { header: "Voucher Code", accessor: "voucher_code", textAlign: "center" },
    { header: "Customer Name", accessor: "customer_name", textAlign: "center" },
    { header: "Employee Name", accessor: "employee_name", textAlign: "center" },
    { header: "Supplier Name", accessor: "supplier_name", textAlign: "center" },
    { header: "Issued Date", accessor: "issued_date", textAlign: "center" },
    { header: "Amount", accessor: "amount", textAlign: "center" },
  ];

  return (
    <React.Fragment>
      <Head title="Voucher Issue Status" />
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
              <Button
                disabled={issubmitting}
                color="secondary"
                size="md"
                onClick={() => getVoucherDetails()}
              >
                {issubmitting ? "Filtering ...." : "Filter"}
              </Button>
              <SaveButton
                disabled={issubmitting || !hasChecked}
                size="md"
                color="danger"
                onClick={handleSubmit((data) =>
                  form_submit(data, "saveAndNew")
                )}
              >
                {issubmitting ? "Cancelling..." : "Cancel"}
              </SaveButton>
            </Col>
          </Row>

          <div className="custom-grid">
            <Row className="g-3 form-control-sm align-center">
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
                    </tr>
                  </thead>
                  <tbody>
                    {voucherList.length > 0 &&
                      voucherList.map((item, rowIndex) => (
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
                              {item[column.accessor] != null &&
                              item[column.accessor] !== ""
                                ? item[column.accessor]
                                : "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Row>
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default VoucherIssueStatusForm;
