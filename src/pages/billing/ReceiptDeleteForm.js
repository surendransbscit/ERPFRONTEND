import React, { useEffect, useState } from "react";
import Head from "../../layout/head/Head";
import { toastfunc } from "../../components/sds-toast-style/toast-style";
import Content from "../../layout/content/Content";
import CurrencyDisplay from "../../components/common/moneyFormat/moneyFormat";
import { PreviewCard, SaveButton } from "../../components/Component";
import { Col, Row, Icon } from "../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Button } from "reactstrap";
import IsRequired from "../../components/erp-required/erp-required";
import {
  BranchDropdown,
  IssueTypeDropdown,
  ReceiptTypeDropdown,
  SelectDropdown,
} from "../../components/filters/retailFilters";
import { useBranches } from "../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import {
  convertInvoiceList,
  getDeleteableReceiptList,
  deleteIssueReceiptList,
} from "../../redux/thunks/billing";
import { format, subDays } from "date-fns";
import { DateRangePickerInput } from "../../components/filters/dateRangeFilter";
import { NumberInputField } from "../../components/form-control/InputGroup";

const ReceiptDeleteForm = () => {
  const location = useLocation();
  let title = location?.state?.title;
  const {
    register,
    formState: { errors },
    clearErrors,
    reset,
    setValue,
  } = useForm();
  const dispatch = useDispatch();
  const { isLoading: issubmitting, deleteableReceiptList } = useSelector(
    (state) => state.billingReducer
  );
  const { branches } = useBranches();
  const [list, setList] = useState([]);
  const [filterBranch, setFilterBranch] = useState();
  const [cashGreaterThan, setCashGreaterThan] = useState();
  const [issueType, setIssueType] = useState(null);
  const [receiptType, setReceiptType] = useState(null);
  const [type, setType] = useState(2);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedDates, setSelectedDates] = useState({
    startDate: subDays(new Date(), 6),
    endDate: new Date(),
  });

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };

  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (deleteableReceiptList?.columns != null) {
      setColumns(deleteableReceiptList.columns);
      setList(deleteableReceiptList.rows);
    }
  }, [deleteableReceiptList]);

  const deleteReceiptList = async () => {
    let assignData = [];
    list?.forEach((item) => {
      if (item.isChecked) {
        assignData.push(item.id);
      }
    });

    try {
      if (assignData.length) {
        let data = {
          erp_receipt_ids: assignData,
        };
        await dispatch(deleteIssueReceiptList(data)).unwrap();
        reset_form();
      } else {
        toastfunc(" Select Item to Delete");
      }
    } catch (error) {
      let message = error?.response?.data?.message;
      toastfunc(message);
    }
  };

  //   const convertIssueReceipt = async () => {
  //     let assignData = [];
  //     list?.forEach((item) => {
  //       if (item.isChecked) {
  //         assignData.push(item.id);
  //       }
  //     });
  //     try {
  //       if (assignData.length) {
  //         let data = {
  //           erp_receipt_ids: assignData,
  //         };
  //         await dispatch(convertInvoiceList(data)).unwrap();
  //         reset_form();
  //       } else {
  //         toastfunc(" Select Item to Convert");
  //       }
  //     } catch (error) {
  //       let message = error?.response?.data?.message;
  //       toastfunc(message);
  //     }
  //   };

  const calculateTotal = (field) => {
    return list?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columns.find((item) => item.accessor === field);
      let decimal_places =
        column && column.decimal_places !== undefined
          ? column.decimal_places
          : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const getDeletableReceiptDetails = () => {
    if (filterBranch) {
      const filters = {
        branch: filterBranch,
        from_date: format(selectedDates.startDate, "yyyy-MM-dd"),
        to_date: format(selectedDates.endDate, "yyyy-MM-dd"),
        cashGreaterThan: cashGreaterThan > 0 ? cashGreaterThan : undefined,
        issue_type: issueType,
        receipt_type: receiptType,
      };

      dispatch(getDeleteableReceiptList(filters));
    } else if (!filterBranch) {
      toastfunc("Branch Required !!");
    }
  };

  const selectAllCol = (value) => {
    list?.forEach((item, rowIndex) => {
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

  return (
    <React.Fragment>
      <Head title={`${title ? title : "EDA Receipt delete"}`} />
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
                color="danger"
                onClick={() => deleteReceiptList()}
              >
                {issubmitting ? "Deleting" : "Delete"}
              </SaveButton>

              <SaveButton
                disabled={issubmitting}
                color="secondary"
                size="md"
                onClick={() => getDeletableReceiptDetails()}
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
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="issueType">
                    Issue Type
                    <IsRequired />
                  </label>

                  <IssueTypeDropdown
                    register={register}
                    id={"issueType"}
                    selectedType={issueType}
                    limitedOptions={true}
                    onTypeChange={setIssueType}
                    isRequired={true}
                    typeVal={type}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.issueType && "Issue type is Required"}
                  />
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="issueType">
                    Receipt Type
                    <IsRequired />
                  </label>

                  <SelectDropdown
                    register={register}
                    data = {[
                      { value: 6, label: "Repair Order Delivery" },]}
                    id={"receiptType"}
                    selectedValue={receiptType}
                    onChangeEvent={setReceiptType}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.receiptType && "Receipt Type is Required"}
                  />
                </div>
              </Col>
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Cash Greater Than
                  </label>
                  <NumberInputField
                    register={register}
                    placeholder="Cash Greater Than"
                    id={"CashGreaterThan"}
                    value={cashGreaterThan}
                    isRequired={false}
                    min={0}
                    type={"number"}
                    setValue={setValue}
                    handleKeyDownEvents={true}
                    handleDecimalDigits={true}
                    decimalValues={2}
                    SetValue={(value) => {
                      // handleFilterChange("grossWeightTo", value);
                      // clearErrors("grossWeightTo");
                      setCashGreaterThan(value);
                    }}
                    message={
                      errors.grossWeightTo && errors.grossWeightTo.message
                    }
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
                      {columns.map((column, index) => {
                        return (
                          <th
                            key={index}
                            style={{ textAlign: column?.text_align }}
                          >
                            {column.Header}
                          </th>
                        );
                      })}
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
                          {columns?.map((column, colIndex) => {
                            return (
                              <td
                                key={colIndex}
                                style={{ textAlign: column?.text_align }}
                              >
                                {column.is_money_format ? (
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
                            );
                          })}
                        </tr>
                      ))}
                  </tbody>

                  <tfoot>
                    <tr style={{ fontWeight: "bold" }}>
                      <td>Total</td>
                      {columns.map((column, index) => {
                        return (
                          <td
                            key={index}
                            style={{ textAlign: column?.text_align }}
                          >
                            {column.is_total_req ? (
                              column.is_money_format ? (
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
                        );
                      })}
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

export default ReceiptDeleteForm;
