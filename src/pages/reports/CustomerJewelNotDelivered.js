/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchCustomer } from "../../redux/thunks/customer";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import { Col, PreviewCard, Row, SaveButton } from "../../components/Component";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import { getCustomerJewelNotDeliveredReport } from "../../redux/thunks/reports";
import { useBillSettingContext } from "../../contexts/BillSettingContext";
import { Typeahead } from "react-bootstrap-typeahead";
import { Badge } from "reactstrap";
import CurrencyDisplay from "../../components/common/moneyFormat/moneyFormat";
import IsRequired from "../../components/erp-required/erp-required";

const CustomerJewelNotDelivered = () => {
  const dispatch = useDispatch();
  const { billSettingType } = useBillSettingContext();
  const { isLoading: issubmitting, customerJewelNotDeliveredReportList } =
    useSelector((state) => state.reportReducer);
  const { searchCustomerList } = useSelector((state) => state.customerReducer);

  const [customer, SetCustomer] = useState();
  const [customerSearch, SetCustomerSearch] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [inputType, setInputType] = useState();
  const [navigateModal, SetNavigateModal] = useState(false);
  const [createMobNum, SetCreateMobNum] = useState();

  const columns = [
    { header: "Customer Name", accessor: "customer", textAlign: "center" },
    {
      header: "Customer Mobile",
      accessor: "mobile",
      textAlign: "center",
    },
    { header: "Products", accessor: "products", textAlign: "center" },

    {
      header: "Pieces",
      accessor: "pieces",
      decimal_places: 0,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Weight",
      accessor: "weight",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Outstanding Amount",
      accessor: "outstanding_amount",
      decimal_places: 2,
      textAlign: "right",
      isTotalReq: true,
      isCurrency: true,
    },
  ];

  const getjewelNotDeliverDetails = () => {
    // if (filterBranch) {
    const filters = {
      customer: customer,
      bill_setting_type: billSettingType,
    };

    dispatch(getCustomerJewelNotDeliveredReport(filters));
    // }
    // else if (!filterBranch) {
    //   toastfunc("Branch Required !!");
    // }
  };

  const calculateTotal = (field) => {
    return customerJewelNotDeliveredReportList?.data?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columns.find((item) => item.accessor === field);
      let decimal_places =
        column && column.decimal_places !== undefined
          ? column.decimal_places
          : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  useEffect(() => {
    dispatch(getCustomerJewelNotDeliveredReport());
  }, [dispatch]);

  // useEffect(() => {
  //   if (
  //     isSearching &&
  //     customerSearch?.length > 0 &&
  //     customerSearch[0]?.label.length >= 5 &&
  //     customer == null
  //   ) {
  //     dispatch(searchCustomer({ mob_num: customerSearch[0]?.label }));
  //   }
  // }, [isSearching, customerSearch, customer, dispatch]);

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

  useEffect(() => {
    if (
      isSearching &&
      customerSearch?.length > 0 &&
      customerSearch[0]?.label.length >= 9 &&
      customer == null &&
      searchCustomerList?.length == 0
    ) {
      SetCreateMobNum(customerSearch[0]?.label);
      SetNavigateModal(true);
    }
  }, [isSearching, customerSearch, customer, searchCustomerList]);
  return (
    <React.Fragment>
      <Head title="Customer - Jewel Not Deliver" />
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
              {/* <SaveButton
                disabled={issubmitting}
                size="md"
                color="primary"
                onClick={updateData}
              >
                {issubmitting ? "Saving" : "Save"}
              </SaveButton> */}

              <SaveButton
                disabled={issubmitting}
                color="secondary"
                size="md"
                onClick={() => getjewelNotDeliverDetails()}
              >
                Search
              </SaveButton>
            </Col>
          </Row>

          <div className="custom-grid">
            <Row className="g-3 align-center form-control-sm">
              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="customerSearch">
                    Customer
                    <IsRequired />
                  </label>
                  <div className="form-control-wrap">
                    <Typeahead
                      id="customerSearch"
                      labelKey="label"
                      onChange={(e) => {
                        if (e?.length > 0) {
                          SetCustomer(e[0]?.value), SetCustomerSearch(e);
                        } else {
                          SetCustomer(null);
                          SetCustomerSearch([]);
                        }
                      }}
                      options={searchCustomerList}
                      placeholder="Choose a customer..."
                      // defaultSelected={customerSearch}
                      selected={customerSearch}
                      // onInputChange={(text) => {
                      //   if (text?.length >= 5) {
                      //     setIsSearching(true);
                      //     SetCustomerSearch([{ label: text }]);
                      //   } else {
                      //     SetCustomerSearch([]);
                      //   }
                      // }}
                      onInputChange={(text) => {
                        if (text.length === 0) {
                          SetCustomerSearch([]);
                          setInputType(null);
                          return;
                        }
  
                        const firstChar = text.charAt(0);
                        if (!inputType) {
                          setInputType(/\d/.test(firstChar) ? "number" : "text");
                        }
  
                        if (
                          (inputType === "number" && /^\d*$/.test(text)) ||
                          (inputType === "text" && /^[a-zA-Z\s]*$/.test(text))
                        ) {
                          setIsSearching(text.length >= 5);
                          SetCustomerSearch([{ label: text }]);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (inputType === "number" && !/\d/.test(e.key)) {
                          if (
                            ![
                              "Backspace",
                              "Delete",
                              "ArrowLeft",
                              "ArrowRight",
                            ].includes(e.key)
                          ) {
                            e.preventDefault(); // Prevent letters but allow backspace, delete, and arrows
                          }
                        }
                        if (inputType === "text" && /\d/.test(e.key)) {
                          e.preventDefault(); // Prevent typing numbers if inputType is text
                        }
                      }}
                    />
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="mt-2" md={12}>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>S.NO </th>
                      {columns?.map((column, index) => {
                        return (
                          <th
                            key={index}
                            style={{ textAlign: column?.textAlign }}
                          >
                            {column.header}
                          </th>
                        );
                      })}
                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {customerJewelNotDeliveredReportList?.data?.length > 0 &&
                      customerJewelNotDeliveredReportList?.data?.map(
                        (item, rowIndex) => (
                          <tr key={rowIndex}>
                            <td>{rowIndex + 1} </td>
                            {columns?.map((column, colIndex) => {
                              return (
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
                              );
                            })}

                            {/* <td>
                            <Button
                              color="primary"
                              size="sm"
                              className="btn-icon btn-white btn-dim"
                              onClick={() => handleDelete()}
                            >
                              <Icon name="trash-fill" />
                            </Button>
                          </td> */}
                          </tr>
                        )
                      )}
                  </tbody>

                  <tfoot>
                    <tr style={{ fontWeight: "bold" }}>
                      <td>Total</td>
                      {columns.map((column, index) => {
                        return (
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

export default CustomerJewelNotDelivered;
