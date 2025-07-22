import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import styled from "styled-components";
import { Block,Icon } from "../../components/Component";
import { getPagePermission } from "../../redux/thunks/coreComponent";
import {  Card, Col, Row } from "reactstrap";
import { getBillViewReport } from "../../redux/thunks/reports";
import moment from "moment";
import { useForm } from "react-hook-form";
import "../../assets/css/datatable.css";
import CurrencyDisplay from "../../components/common/moneyFormat/moneyFormat";
import ReportFilterComponent from "./ReportFilterComponent";
import FilterSidebar from "../../components/sidebar/FilterSidebar";
import { useBillSettingContext } from "../../contexts/BillSettingContext";
import { searchCustomer } from "../../redux/thunks/customer";

export const Styles = styled.div`
  padding: 2vh 0.75vw;
  .table-wrapper {
    overflow-x: auto; /* Enable horizontal scrolling */
    width: 100%;
  }
.active_row{
  background:rgb(222 213 255);
}
  .bill_details_line {
  display: flex;
  gap: 4px; /* space between label and value */
  align-items: center;
}

.bill_details_label {
  font-weight: bold;
}

.bill_details_value {
  font-weight: normal;
}


  .react_table {
    width: 100%;
    // min-width: 1000px; /* Ensures scrolling on smaller screens */
    border-spacing: 2px;
    border: 1px solid #e1e1e1;
    thead,
    tfoot {
      position: sticky;
      z-index: 1; /* Ensure the header and footer stay above the body */
      background-color: #f8f9fa; /* Background color for the header and footer */
    }

    thead {
      top: 0; /* Fix the header to the top */
    }

    tfoot {
      bottom: 0; /* Fix the footer to the bottom */
    }
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      border-bottom: 1px solid #e1e1e1;
    }
  }
`;

const BillViewReport = () => {
  const { register, clearErrors, setValue, errors } = useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pathName = location?.pathname;
  const [fromDate, SetFromDate] = useState(new Date());
  const [toDate, SetToDate] = useState(new Date());
  const [billDetails, SetBillDetails] = useState({});
  const tableRef = useRef();
  const { billSettingType } = useBillSettingContext();
  const { billViewReport, isLoading: loadingData } = useSelector((state) => state.reportReducer);
  const { pagePermission } = useSelector((state) => state.coreCompReducer);
  const { userInfo } = useSelector((state) => state.authUserReducer);
  const [selectedBranch, SetSelectedBranch] = useState([]);
  const [startDate, SetStartDate] = useState(new Date());
  const [endDate, SetEndDate] = useState(new Date());
  const [activeRowIndex, SetActiveRowIndex] = useState(null);
  const [customerSearch, SetCustomerSearch] = useState([]);
  const [customer, SetCustomer] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [filteredDesign, setFilteredDesign] = useState(null);
  const [filterGwtFrom, setFilterGwtFrom] = useState("");
  const [filterGwtTo, setFilterGwtTo] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [inputType, setInputType] = useState();
  const { searchCustomerList } = useSelector((state) => state.customerReducer);

  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  useEffect(() => {
    getData();
  }, [dispatch, fromDate, toDate, billSettingType]);

    useEffect(() => {
    if (
      isSearching &&
      customerSearch?.length > 0 &&
      customerSearch[0]?.label.length >= 5 &&
      customer == null
    ) {
      const searchKey = inputType === "number" ? "mob_num" : "name";
      dispatch(searchCustomer({ [searchKey]: customerSearch[0]?.label }));
    }
  }, [isSearching, customerSearch, customer, dispatch, inputType]);

  const getData = async () => {
    try {
      await dispatch(
        getBillViewReport({
          fromDate: moment(startDate).format("YYYY-MM-DD"),
          toDate: moment(endDate).format("YYYY-MM-DD"),
          bill_setting_type : billSettingType,
          product :filteredProducts,
          design: filteredDesign,
          from_wt: filterGwtFrom,
          to_wt: filterGwtTo,
          customer: customer,
          branch: selectedBranch?.map((obj) => {
            const container = obj.value;
            return container;
          }),
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const [filterModal, SetFilterModal] = useState(false);
  const toggleFilterModal = () => SetFilterModal(!filterModal);

  const calculateTotal = (field, data,decimal_places) => {
    return data.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const columns = [
    { accessor: "product_name", header: "Product", isTotalReq: false, textAlign: "left" },
    { accessor: "tag_code", header: "Tag Code", isTotalReq: false, textAlign: "left" },
    { accessor: "pieces", header: "Pcs", isTotalReq: true, textAlign: "right" },
    { accessor: "gross_wt", header: "Gwt", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "net_wt", header: "Nwt", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "less_wt", header: "Lwt", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "total_mc_value", header: "Mc", isTotalReq: true, decimal_places: 3, textAlign: "right" },
    { accessor: "wastage_weight", header: "Va.Wt", isTotalReq: true, decimal_places: 3, textAlign: "right" },
    { accessor: "tax_amount", header: "Tax", isTotalReq: true, decimal_places: 2, textAlign: "right",isCurrency:true },
    { accessor: "item_cost", header: "Total", isTotalReq: true, decimal_places: 2, textAlign: "right",isCurrency:true },
  ];

  const purchaseColumns = [
    { accessor: "product_name", header: "Product", isTotalReq: false, textAlign: "left" },
    { accessor: "pieces", header: "Pcs", isTotalReq: true, textAlign: "right" },
    { accessor: "gross_wt", header: "Gwt", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "net_wt", header: "Nwt", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "less_wt", header: "Lwt", isTotalReq: true, textAlign: "right", decimal_places: 3 },
    { accessor: "dust_wt", header: "Dust.Wt", isTotalReq: true, decimal_places: 3, textAlign: "right" },
    { accessor: "pure_weight", header: "Pure.Wt", isTotalReq: true, decimal_places: 3, textAlign: "right" },
    { accessor: "amount", header: "Total", isTotalReq: true, decimal_places: 2, textAlign: "right",isCurrency:true },
  ];

  const FilterComponent = (
    <ReportFilterComponent
      children={{
        register,
        clearErrors,
        setValue,
        errors,
        selectedBranch,
        SetSelectedBranch,
        startDate,
        SetStartDate,
        endDate,
        SetEndDate,
        getData,
        is_group_by_req: false,
        is_multi_branch_filter_req: true,
        is_scheme_filter_req: false,
        is_date_filter_req: true,
      }}
    />
  );

  const printReport = () => {
    const printUrl = `${process.env.PUBLIC_URL}/reports/cash_abstract/print`;
    const reportData = {
      columns: columns,
      data: billViewReport,
      company_name: userInfo?.user?.company_fullname,
    };
    localStorage.setItem(
      "cashAbstractData",
      JSON.stringify({
        columns: columns,
        data: billViewReport,
        company_name: userInfo?.user?.company_fullname,
        company_address: userInfo?.user?.company_address,
        comapny_mobile: userInfo?.user?.comapny_mobile,
        fromDate: startDate,
        toDate: endDate,
      })
    );

    const newWindow = window.open(printUrl, "_blank");

    newWindow.onload = () => {
      newWindow.postMessage(reportData, "*");
    };
    // navigate(
    //   {
    //     pathname: `${process.env.PUBLIC_URL}/reports/cash_abstract/print`,
    //   },
    //   {
    //     state: {
    //       columns: columns,
    //       data: billViewReport,
    //       company_name: userInfo?.user?.company_fullname,
    //     },
    //   }
    // );
  };

  return (
    <React.Fragment>
      <Head title={pagePermission?.title ? pagePermission?.title : "Bill View Reports"}></Head>
      {pagePermission?.view && (
        <Content>
          <Block size="lg">
            <Card className="card-bordered card-preview">
              <Styles>
                <div className="card-inner">
                  <div className="card-title-group">
                    <div className="toggle-wrap nk-block-tools-toggle">
                      <h5>Bill View Reports</h5>
                    </div>
                    <div className="card-tools me-n1">
                      <ul className="btn-toolbar gx-1">
                        <li className="btn-toolbar-sep"></li>
                        <li>
                          <div className="dt-buttons btn-group flex-wrap">
                            <button className="btn btn-secondary buttons-csv buttons-html5" type="button">
                              <span>CSV</span>
                            </button>{" "}
                            <button
                              className="btn btn-secondary buttons-excel buttons-html5"
                              type="button"
                              //   onClick={() => exportExcel()}
                            >
                              <span>Excel</span>
                            </button>{" "}
                            <button className="btn btn-secondary " type="button" onClick={printReport}>
                              <Icon name="printer-fill"></Icon>
                            </button>{" "}
                          </div>
                        </li>
                        <li className="btn-toolbar-sep"></li>
                        <li>
                          <div className="btn btn-trigger btn-icon dropdown-toggle" onClick={toggleFilterModal}>
                            <div className="dot dot-primary"></div>
                            Filters<Icon name="filter-alt"></Icon>
                          </div>
                        </li>
                        {/* {FilterComponent} */}
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                <div className="table-responsive dataTables_wrapper" ref={tableRef} style={{ height:"250px",overflowY: "auto" }}>
                  <table className="table-wrapper react_table">
                    <thead>
                      <tr>
                        {billViewReport?.columns?.map((column, index) => (
                          <th key={index} style={{ textAlign: column?.text_align }}>
                            {column.Header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {billViewReport?.rows?.length > 0 &&
                        billViewReport?.rows?.map((item, rowIndex) => (
                          <tr className={rowIndex == activeRowIndex ? "active_row" : ""}
                          key={rowIndex} onClick={() => {
                            SetBillDetails(item);
                            SetActiveRowIndex(rowIndex);
                            }} >
                            {billViewReport?.columns.map((column, colIndex) => (
                              <td key={colIndex} style={{ textAlign: column?.text_align }}>
                                {column.isCurrency ? (
                                  <CurrencyDisplay value={item[column.accessor]} />
                                ) : column.decimal_places ? (
                                  parseFloat(item[column.accessor]).toFixed(column.decimal_places)
                                ) : (
                                  item[column.accessor]
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}


                    </tbody>

                    <tfoot>
                    {billViewReport?.rows?.length > 0 && (
                        <tr style={{ fontWeight: "bold" }}>
                          <td>Total</td>
                          {billViewReport?.columns?.map((column, index) => {
                            return (
                              index !== 0 && (
                                <td key={index} style={{ textAlign: column?.text_align }}>
                                  {column.is_total_req ? (
                                    column.is_money_format ? (
                                      <CurrencyDisplay
                                        value={calculateTotal(column.accessor, billViewReport?.rows,column?.decimal_places)}
                                      />
                                    ) : (
                                      calculateTotal(column.accessor, billViewReport?.rows,column?.decimal_places)
                                    )
                                  ) : (
                                    ""
                                  )}
                                </td>
                              )
                            );
                          })}
                        </tr>
                      )}
                    </tfoot>
                  </table>
                </div>
                <br/>
                <div className="custom-grid" >
                   <Row className="g-3">
                    <Col md="3" >
                      <table style={{width:"100%"}}>
                        <tbody>
                          <tr>
                            <td style={{fontWeight:"bold"}}>Bill No:</td>
                            <td style={{textAlign:"right"}}>{billDetails?.invoice_no}</td>
                          </tr>
                          <tr>
                            <td style={{fontWeight:"bold"}}>Bill Date:</td>
                            <td style={{textAlign:"right"}}>{billDetails?.invoice_date}</td>
                          </tr>
                          <tr>
                            <td style={{fontWeight:"bold"}}>Emp Name:</td>
                            <td style={{textAlign:"right"}}>{billDetails?.emp_name}</td>
                          </tr>
                          <tr>
                            <td style={{fontWeight:"bold"}}>Branch:</td>
                            <td style={{textAlign:"right"}}>{billDetails?.branch_name}</td>
                          </tr>

                          <tr>
                            <td style={{fontWeight:"bold"}}>Sales Amount:</td>
                            <td style={{textAlign:"right"}}><CurrencyDisplay value={billDetails?.sales_amount} /></td>
                          </tr>
                          {parseFloat(billDetails.return_amount) > 0 && (

                            <tr>
                              <td style={{fontWeight:"bold"}}>Purchase Amount:</td>
                              <td style={{textAlign:"right"}}><CurrencyDisplay value={billDetails?.purchase_amount} /></td>
                            </tr>
                          )}

                          {parseFloat(billDetails.return_amount) > 0 && (
                          <tr>
                            <td style={{fontWeight:"bold"}}>Return Amount:</td>
                            <td style={{textAlign:"right"}}><CurrencyDisplay value={billDetails?.return_amount} /></td>
                          </tr>
                          )}
                          <tr>
                            <td style={{fontWeight:"bold"}}>Net Amount:</td>
                            <td style={{textAlign:"right",fontWeight:"bold"}}><CurrencyDisplay value={billDetails?.net_amount} /></td>
                          </tr>
                          <tr>
                            <td style={{fontWeight:"bold"}}>Received Amount:</td>
                            <td style={{textAlign:"right",fontWeight:"bold"}}><CurrencyDisplay value={billDetails?.received_amount} /></td>
                          </tr>
                         {parseFloat(billDetails?.due_amount) > 0 && (
                          <tr>
                            <td style={{fontWeight:"bold"}}>Due Amount:</td>
                            <td style={{textAlign:"right",fontWeight:"bold",color:"red"}}><CurrencyDisplay value={billDetails?.due_amount} /></td>
                          </tr>
                          )}
                        </tbody>
                      </table>
                    </Col>
                    <Col md="3" >
                      <table style={{width:"100%"}}>
                          <tbody>
                            <tr>
                              <td style={{fontWeight:"bold"}}>Customer:</td>
                              <td style={{textAlign:"right"}}>{billDetails?.customer_name}</td>
                            </tr>
                            <tr>
                              <td style={{fontWeight:"bold"}}>Mobile:</td>
                              <td style={{textAlign:"right"}}>{billDetails?.customer_mobile}</td>
                            </tr>
                            <tr>
                              <td style={{fontWeight:"bold"}}>Address:</td>
                              <td style={{textAlign:"right"}}>{billDetails?.customer_address}</td>
                            </tr>
                            <tr>
                              <td style={{fontWeight:"bold"}} colSpan={2}>Payment Details:</td>
                            </tr>
                            {billDetails?.payment_details?.map((column, index) => (
                            <tr>
                              <td style={{fontWeight:"bold"}}>{column?.mode_name}</td>
                              <td style={{textAlign:"right"}}><CurrencyDisplay value={column?.payment_amount} /></td>
                            </tr>
                            ))}
                            {parseFloat(billDetails.deposit_amount) > 0 && (

                              <tr>
                                <td style={{fontWeight:"bold"}}>Deposit Amount:</td>
                                <td style={{textAlign:"right"}}><CurrencyDisplay value={parseFloat(billDetails.deposit_amount).toFixed(2)} /></td>
                              </tr>
                            )}

                            {parseFloat(billDetails.advance_adj_amount) > 0 && (

                              <tr>
                                <td style={{fontWeight:"bold"}}>Adv Adjust:</td>
                                <td style={{textAlign:"right"}}><CurrencyDisplay value={parseFloat(billDetails.advance_adj_amount).toFixed(2)}  /></td>
                              </tr>
                            )}
                          </tbody>
                      </table>  


                    </Col>
                    <Col md="6" >
                    <Row className="g-3">
                      <div className="bill_details_label" style={{color:"#0536f3",textTransform:"uppercase"}}>Sales Details</div>
                        <table className="react_table">
                        <thead>
                          <tr>
                            {columns?.map((column, index) => (
                              <th key={index} style={{ textAlign: column?.textAlign }}>
                                {column.header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {billDetails?.sales_details?.length > 0 &&
                            billDetails?.sales_details?.map((item, rowIndex) => (
                              <tr key={rowIndex}>
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
                              </tr>
                            ))}


                        </tbody>

                        <tfoot>
                        {billDetails?.sales_details?.length > 0 && (
                            <tr style={{ fontWeight: "bold",color:"#055297" }}>
                              <td>Total</td>
                              {columns?.map((column, index) => {
                                return (
                                  index !== 0 && (
                                    <td key={index} style={{ textAlign: column?.textAlign }}>
                                      {column.isTotalReq ? (
                                        column.isCurrency ? (
                                          <CurrencyDisplay
                                            value={calculateTotal(column.accessor, billDetails?.sales_details,column.decimal_places)}
                                          />
                                        ) : (
                                          calculateTotal(column.accessor, billDetails?.sales_details,column.decimal_places)
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </td>
                                  )
                                );
                              })}
                            </tr>
                          )}
                        </tfoot>
                      </table>
                      </Row>
                      <br/>
                      {billDetails?.purchase_details?.length > 0 && (
                      <Row className="g-3">
                      <div className="bill_details_label" style={{color:"#0536f3",textTransform:"uppercase"}} >Purchase Details</div>
                      <table className="table-wrapper react_table">
                        <thead>
                          <tr>
                            {purchaseColumns?.map((column, index) => (
                              <th key={index} style={{ textAlign: column?.textAlign }}>
                                {column.header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {billDetails?.purchase_details?.length > 0 &&
                            billDetails?.purchase_details?.map((item, rowIndex) => (
                              <tr key={rowIndex}>
                                {purchaseColumns.map((column, colIndex) => (
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
                              </tr>
                            ))}


                        </tbody>

                        <tfoot>
                        {billDetails?.purchase_details?.length > 0 && (
                            <tr style={{ fontWeight: "bold",color:"#055297" }}>
                              <td>Total</td>
                              {purchaseColumns?.map((column, index) => {
                                return (
                                  index !== 0 && (
                                    <td key={index} style={{ textAlign: column?.textAlign }}>
                                      {column.isTotalReq ? (
                                        column.isCurrency ? (
                                          <CurrencyDisplay
                                            value={calculateTotal(column.accessor, billDetails?.purchase_details,column.decimal_places)}
                                          />
                                        ) : (
                                          calculateTotal(column.accessor, billDetails?.purchase_details,column.decimal_places)
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </td>
                                  )
                                );
                              })}
                            </tr>
                          )}
                        </tfoot>
                      </table>
                      </Row>)}
                      <br/>
                      {billDetails?.sales_return_details?.length > 0 && (
                      <Row className="g-3">
                      <div className="bill_details_label" style={{color:"#0536f3",textTransform:"uppercase"}}>Sales Return Details</div>
                        <table className="react_table">
                        <thead>
                          <tr>
                            {columns?.map((column, index) => (
                              <th key={index} style={{ textAlign: column?.textAlign }}>
                                {column.header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {billDetails?.sales_return_details?.length > 0 &&
                            billDetails?.sales_return_details?.map((item, rowIndex) => (
                              <tr key={rowIndex}>
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
                              </tr>
                            ))}


                        </tbody>

                        <tfoot>
                        {billDetails?.sales_return_details?.length > 0 && (
                            <tr style={{ fontWeight: "bold",color:"#055297" }}>
                              <td>Total</td>
                              {columns?.map((column, index) => {
                                return (
                                  index !== 0 && (
                                    <td key={index} style={{ textAlign: column?.textAlign }}>
                                      {column.isTotalReq ? (
                                        column.isCurrency ? (
                                          <CurrencyDisplay
                                            value={calculateTotal(column.accessor, billDetails?.sales_return_details,column.decimal_places)}
                                          />
                                        ) : (
                                          calculateTotal(column.accessor, billDetails?.sales_return_details,column.decimal_places)
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </td>
                                  )
                                );
                              })}
                            </tr>
                          )}
                        </tfoot>
                      </table>
                      </Row>)}
                    </Col>
                    </Row>

                </div>

              </div>
              </Styles>
            </Card>
          </Block>
          <FilterSidebar
            sideBar={filterModal}
            toggle={toggleFilterModal}
            children={{
              register,
              clearErrors,
              setValue,
              errors,
              selectedBranch,
              SetSelectedBranch,
              startDate,
              SetStartDate,
              endDate,
              SetEndDate,
              getData,
              customer,
              SetCustomer,
              customerSearch,
              SetCustomerSearch,
              filteredProducts,
              setFilteredProducts,
              filteredDesign,
              setFilteredDesign,
              filterGwtFrom,
              setFilterGwtFrom,
              filterGwtTo,
              setFilterGwtTo,
              inputType,
              setInputType,
              isSearching,
              setIsSearching,
              searchCustomerList,
              is_group_by_req: false,
              is_multi_branch_filter_req: true,
              is_scheme_filter_req: false,
              is_date_filter_req: true,
              isCustomerFilterReq: true,
              isProductFilterReq: true,
              isDeignFilterReq: true,
              isGwtFromToFilterReq: true,


            }}
          />
        </Content>
      )}
    </React.Fragment>
  );
};

export default BillViewReport;
