import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import { toastfunc, toastsuccess } from "../../../components/sds-toast-style/toast-style";
import Content from "../../../layout/content/Content";
import CurrencyDisplay from "../../../components/common/moneyFormat/moneyFormat";
import { CancelButton, PreviewCard, SaveButton } from "../../../components/Component";
import { Col, Row, Icon } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "reactstrap";
import IsRequired from "../../../components/erp-required/erp-required";
import { BranchDropdown,SelectDropdown  } from "../../../components/filters/retailFilters";
import { useBranches,useBanks } from "../../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { DateRangePickerInput } from "../../../components/filters/dateRangeFilter";
import { format, subDays } from "date-fns";
import { createBankSettlementDetails, getBankSettlementDetails } from "../../../redux/thunks/billing";
import moment from "moment";
import { useLocation, useNavigate } from "react-router";

const BankSettlementForm = () => {
  const location = useLocation();
  const navigate = useNavigate()
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
  const dispatch = useDispatch();
  const { isLoading: issubmitting, bankSettlementList } = useSelector((state) => state.bankSettlementReducer);
  const { banks } = useBanks();
  const { branches } = useBranches();
  const [dataList, setDataList] = useState([]);
  const [filterBranch, setFilterBranch] = useState();
  const [bank, setBank] = useState();

  const [selectedDates, setSelectedDates] = useState({
    startDate: subDays(new Date(), 6),
    endDate: new Date(),
  });

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };

  useEffect(() => {
    const updatedList = bankSettlementList?.data?.map((item) => ({
      ...item,
      upi_received_amount: 0,
      bank_received_amount: 0,
      card_received_amount: 0,
    }));
    setDataList(updatedList);
  }, [bankSettlementList]);

  const calculateTotal = (field) => {
    return dataList?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columns?.find((item) => item.accessor === field);
      let decimal_places = column && column.decimal_places !== undefined ? column.decimal_places : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const getBankSettlements = async () => {
    const filters = {
      id_branch: filterBranch,
      from_date: format(selectedDates.startDate, "yyyy-MM-dd"),
      to_date: format(selectedDates.endDate, "yyyy-MM-dd"),
      id_bank: bank,
    };
    if (!bank){
      toastfunc("Please select a bank");
      return;
    }
    await dispatch(getBankSettlementDetails(filters));
  };

  const handelChange = (index, field, value) => {
    setDataList((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;
      return updatedValues;
    });
  };

  const reset_form = async () => {
    reset("");
    // getBankSettlementDetails();
  };

  const createBankSettlement = async () => {
    const bank_settlement_data = dataList?.map((obj) => {
      const container = {};
      container.branch = filterBranch;
      container.invoice_date = moment(obj.invoice_date).format("YYYY-MM-DD");
      container.payment_mode = obj.payment_mode_id;
      container.card_payment_amount = obj.card_payment;
      container.card_received_amount = obj.card_received_amount;
      container.net_banking_payment_amount = obj.net_banking_payment;
      container.net_banking_received_amount = obj.bank_received_amount;
      container.upi_payment_amount = obj.upi_payment;
      container.upi_received_amount = obj.upi_received_amount;
      return container;
    });
    const addData = {
      bank_settlement_data,
    };

    try {
      await dispatch(createBankSettlementDetails(addData)).unwrap();
      toastsuccess("Bank settlement created successfully");
      reset_form();
      setDataList([]);
      setFilterBranch();
    } catch (error) {
      let message = error?.response?.data?.message;
      toastsuccess(message);
    }
  };

  const columns = [
    { header: "Bill Date", accessor: "bill_date", textAlign: "center" },
    { header: "Payment Mode", accessor: "order_date", textAlign: "center" },
    { header: "Payment Amount", accessor: "payment_amount", textAlign: "center", isTotalReq: true, isCurrency: true },
    { header: "Recived Amount", accessor: "received_amount", textAlign: "center", isTotalReq: true, isCurrency: true },
  ];

  var totalCardPayment = dataList?.reduce(
    (sum, obj) => sum + (obj?.card_payment != null || undefined ? parseFloat(obj?.card_payment) : 0),
    0
  );
  var totalCardRecievedPayment = dataList?.reduce(
    (sum, obj) => sum + (obj?.card_received_amount != null || undefined ? parseFloat(obj?.card_received_amount) : 0),
    0
  );

  var totalNetBanking = dataList?.reduce(
    (sum, obj) => sum + (obj?.net_banking_payment != null || undefined ? parseFloat(obj?.net_banking_payment) : 0),
    0
  );
  var totalNetBankingRecieved = dataList?.reduce(
    (sum, obj) => sum + (obj?.bank_received_amount != null || undefined ? parseFloat(obj?.bank_received_amount) : 0),
    0
  );

  var totalUpiPayment = dataList?.reduce(
    (sum, obj) => sum + (obj?.upi_payment != null || undefined ? parseFloat(obj?.upi_payment) : 0),
    0
  );
  var totalUpiPaymentRecieved = dataList?.reduce(
    (sum, obj) => sum + (obj?.upi_received_amount != null || undefined ? parseFloat(obj?.upi_received_amount) : 0),
    0
  );

  var totalCardPaymentDiffer = dataList?.reduce(
    (sum, obj) =>
      sum +
      ((obj?.card_payment && obj.card_received_amount) != null || undefined
        ? parseFloat(parseFloat(obj.card_payment) - parseFloat(obj.card_received_amount)).toFixed(2)
        : 0),
    0
  );

  var totalNetBankingDiffer = dataList?.reduce(
    (sum, obj) =>
      sum +
      ((obj?.net_banking_payment && obj.bank_received_amount) != null || undefined
        ? parseFloat(parseFloat(obj.net_banking_payment) - parseFloat(obj.bank_received_amount)).toFixed(2)
        : 0),
    0
  );
  var totalUpiPaymentDiffer = dataList?.reduce(
    (sum, obj) =>
      sum +
      ((obj?.upi_payment && obj.upi_received_amount) != null || undefined
        ? parseFloat(parseFloat(obj.upi_payment) - parseFloat(obj.upi_received_amount)).toFixed(2)
        : 0),
    0
  );


  useEffect(() => {
    if (add === undefined && id === undefined) {
      navigate(`${process.env.PUBLIC_URL}/banksettlement/list`);
    }
  }, [add, id, navigate]);

  return (
    <React.Fragment>
      <Head title="Customer Order Status" />
      <Content>
        <PreviewCard className="h-100">
          <Row lg={12} className={"form-control-sm"} style={{ marginTop: "10px" }}>
            <Col md={5}>
              <ModifiedBreadcrumb />
            </Col>
            <Col md={2}></Col>
            <Col md={5} className="text-right flex">
              <SaveButton
                disabled={issubmitting}
                size="md"
                color="primary"
                onClick={handleSubmit(createBankSettlement)}
              >
                {issubmitting ? "Saving ..." : "Save"}
              </SaveButton>

              <Button disabled={issubmitting} color="secondary" size="md" onClick={getBankSettlements}>
                {issubmitting ? "FILTERING ...." : "FILTER"}
              </Button>

               <CancelButton
                                  disabled={issubmitting}
                                  color="danger"
                                  size="md"
                                  onClick={() =>
                                    navigate(
                                      `${process.env.PUBLIC_URL}/banksettlement/list`
                                    )
                                  }
                                >
                                  Cancel
                                </CancelButton>
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
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    Bank
                    <IsRequired />
                  </label>
                  <SelectDropdown
                    register={register}
                    id={"selectBank"}
                    data={banks}
                    selectedValue={bank}
                    onChangeEvent={(value) => {
                      setBank(value);
                      clearErrors("selectBank");
                    }}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.selectBank && "Bank is Required"}
                    valueField = "pk_id"
                    labelField = "bank_name"
                  />
                </div>
              </Col>
            </Row>

            <Row className="mt-2" md={12}>
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }} colSpan=""></th>
                      {/* {columns?.map((column, index) => (
                        <th key={index} style={{ textAlign: column?.textAlign }}>
                          {column.header}
                        </th>
                      ))} */}
                      <th colSpan="1" style={{ fontWeight: "bold" ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}></th>
                      <th colSpan="2" style={{ textAlign: "center" ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa'}}>
                        CARD
                      </th>
                      <th colSpan="2" style={{ textAlign: "center" ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa'}}>
                        BANK
                      </th>
                      <th colSpan="2" style={{ textAlign: "center" ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa'}}>
                        UPI
                      </th>
                      <th colSpan="3" style={{ textAlign: "center" ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa'}}>
                        DIFFERENCE
                      </th>
                      <th colSpan="3" style={{ textAlign: "center" ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa'}}>
                        CHARGES
                      </th>
                    </tr>
                    <tr>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>S.NO</th>
                      {/* Date Columns */}
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>DATE</th>
                      {/* Card Columns */}
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>RECEIVABLE</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>RECD</th>
                      {/* Bank Columns */}
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>RECEIVABLE</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>RECD</th>
                      {/* upi Columns */}
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>RECEIVABLE</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>RECD</th>
                      {/* difference Columns */}
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>CARD</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>BANK</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>UPI</th>
                      {/* charges Columns */}
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>CARD</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>BANK</th>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>UPI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataList?.length > 0 &&
                      dataList?.map((item, rowIndex) => (
                        <tr key={rowIndex}>
                          {/* s.NO */}
                          <td>{rowIndex + 1} </td>
                          {/* DATE */}
                          <td style={{ textAlign: "right" }}>{item?.invoice_date}</td>
                          {/* CARD */}
                          <td style={{ textAlign: "right" }}>
                            <CurrencyDisplay value={item?.card_payment} />
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <input
                              {...register(`card_received_amount${rowIndex}`, {
                                required: "Required",
                              })}
                              type="number"
                              name="card_received_amount"
                              className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                              placeholder="Enter Amount"
                              onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                              value={item?.card_received_amount}
                              onChange={(e) => {
                                const enteredAmount = e.target.value;
                                if (parseFloat(enteredAmount) > parseFloat(item.card_payment)) {
                                  toastfunc(`Entered amount cannot exceed ${item.card_payment}`);
                                  setValue("card_received_amount" + rowIndex, item.card_received_amount);
                                } else {
                                  handelChange(rowIndex, "card_received_amount", e.target.value);
                                  setValue("card_received_amount" + rowIndex, e.target.value);
                                }
                              }}
                            />
                            {errors?.[`card_received_amount` + `${String(rowIndex)}`] && (
                              <span className="text-danger">
                                <Icon className={"sm"} name="alert-circle" />
                                {errors?.[`card_received_amount` + `${String(rowIndex)}`].message}
                              </span>
                            )}
                          </td>
                          {/* BANK */}
                          <td style={{ textAlign: "right" }}>
                            <CurrencyDisplay value={item?.net_banking_payment} />{" "}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <input
                              {...register(`bank_received_amount${rowIndex}`, {
                                required: "Required",
                              })}
                              type="number"
                              name="bank_received_amount"
                              className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                              placeholder="Enter Amount"
                              onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                              value={item?.bank_received_amount}
                              onChange={(e) => {
                                const enteredAmount = e.target.value;
                                if (parseFloat(enteredAmount) > parseFloat(item.net_banking_payment)) {
                                  toastfunc(`Entered amount cannot exceed ${item.net_banking_payment}`);
                                  setValue("bank_received_amount" + rowIndex, item.bank_received_amount);
                                } else {
                                  handelChange(rowIndex, "bank_received_amount", e.target.value);
                                  setValue("bank_received_amount" + rowIndex, e.target.value);
                                }
                              }}
                            />
                            {errors?.[`bank_received_amount` + `${String(rowIndex)}`] && (
                              <span className="text-danger">
                                <Icon className={"sm"} name="alert-circle" />
                                {errors?.[`bank_received_amount` + `${String(rowIndex)}`].message}
                              </span>
                            )}
                          </td>
                          {/* UPI */}
                          <td style={{ textAlign: "right" }}>
                            <CurrencyDisplay value={item?.upi_payment} />
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <input
                              {...register(`upi_received_amount${rowIndex}`, {
                                required: "Required",
                              })}
                              type="number"
                              name="upi_received_amount"
                              className="form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                              placeholder="Enter Amount"
                              onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                              value={item?.upi_received_amount}
                              onChange={(e) => {
                                const enteredAmount = e.target.value;
                                if (parseFloat(enteredAmount) > parseFloat(item.upi_payment)) {
                                  toastfunc(`Entered amount cannot exceed ${item.upi_payment}`);
                                  setValue("upi_received_amount" + rowIndex, item.upi_received_amount);
                                } else {
                                  handelChange(rowIndex, "upi_received_amount", e.target.value);
                                  setValue("upi_received_amount" + rowIndex, e.target.value);
                                }
                              }}
                            />
                            {errors?.[`upi_received_amount` + `${String(rowIndex)}`] && (
                              <span className="text-danger">
                                <Icon className={"sm"} name="alert-circle" />
                                {errors?.[`upi_received_amount` + `${String(rowIndex)}`].message}
                              </span>
                            )}
                          </td>
                          {/* DIFF */}
                          <td style={{ textAlign: "right" }}>
                            {parseFloat(parseFloat(item.card_payment) - parseFloat(item.card_received_amount)).toFixed(
                              2
                            )}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {parseFloat(
                              parseFloat(item.net_banking_payment) - parseFloat(item.bank_received_amount)
                            ).toFixed(2)}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {parseFloat(parseFloat(item.upi_payment) - parseFloat(item.upi_received_amount)).toFixed(2)}
                          </td>
                          {/* CHARGES */}
                          <td style={{ textAlign: "right" }}>{<CurrencyDisplay value={parseFloat(parseFloat(item?.card_received_amount) / parseFloat(item?.card_payment))}/>}</td>
                          <td style={{ textAlign: "right" }}></td>
                          <td style={{ textAlign: "right" }}></td>
                        </tr>
                      ))}
                  </tbody>

                  <tfoot>
                    <tr >
                      <td style={{ fontWeight: "bold" ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>Total</td>
                      <td style={{ fontWeight: "bold" ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}></td>
                      <td style={{ textAlign: "right"  ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa'}}>
                        <CurrencyDisplay value={totalCardPayment} />
                      </td>
                      <td style={{ textAlign: "right"  ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa'}}>
                        <CurrencyDisplay value={totalCardRecievedPayment} />
                      </td>
                      <td style={{ textAlign: "right"  ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa'}}>
                        <CurrencyDisplay value={totalNetBanking} />
                      </td>
                      <td style={{ textAlign: "right"  ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa'}}>
                        <CurrencyDisplay value={totalNetBankingRecieved} />
                      </td>
                      <td style={{ textAlign: "right"  ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa'}}>
                        <CurrencyDisplay value={totalUpiPayment} />
                      </td>
                      <td style={{ textAlign: "right"  ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa'}}>
                        <CurrencyDisplay value={totalUpiPaymentRecieved} />
                      </td>
                      <td style={{ textAlign: "right"  ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa'}}>
                        <CurrencyDisplay value={totalCardPaymentDiffer} />
                      </td>
                      <td style={{ textAlign: "right"  ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa'}}>
                        <CurrencyDisplay value={totalNetBankingDiffer} />
                      </td>
                      <td style={{ textAlign: "right"  ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa'}}>
                        <CurrencyDisplay value={totalUpiPaymentDiffer} />
                      </td>
                      <td style={{ textAlign: "right"  ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa'}}></td>
                      <td style={{ textAlign: "right"  ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa'}}></td>
                      <td style={{ textAlign: "right"  ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa'}}></td>
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

export default BankSettlementForm;
