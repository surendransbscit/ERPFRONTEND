/* eslint-disable no-unused-expressions */
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
import { Badge, Button, Label } from "reactstrap";
import IsRequired from "../../components/erp-required/erp-required";
import {
  BranchDropdown,
  SelectDropdown,
} from "../../components/filters/retailFilters";
import { useBranches } from "../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../components/common/breadcrumb/ModifiedBreadCrumb";
import { TextInputField } from "../../components/form-control/InputGroup";
import {
  updateJewelDelivered,
  getJewelNotDeliverList,
} from "../../redux/thunks/billing";
import { Typeahead } from "react-bootstrap-typeahead";
import { searchCustomer } from "../../redux/thunks/customer";
import { useBillSettingContext } from "../../contexts/BillSettingContext";
import { getPagePermission } from "../../redux/thunks/coreComponent";

const JewelDeliverForm = () => {
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
  const { billSettingType } = useBillSettingContext();
  const { isLoading: issubmitting, jewelNotDeliverList } = useSelector(
    (state) => state.billingReducer
  );
  const { searchCustomerList } = useSelector((state) => state.customerReducer);

  const { branches } = useBranches();
  const [list, setList] = useState([]);
  const [filterBranch, setFilterBranch] = useState();
  const [selectAll, setSelectAll] = useState(false);

  const [inputType, setInputType] = useState();
  const [customer, SetCustomer] = useState();
  const [customerSearch, SetCustomerSearch] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [navigateModal, SetNavigateModal] = useState(false);
  const [navigateModalOpened, setNavigateModalOpened] = useState(false);
  const [createMobNum, SetCreateMobNum] = useState();

  useEffect(() => {
    setList(jewelNotDeliverList);
  }, [jewelNotDeliverList]);

  // const form_submit = async (data, actionType) => {
  //   let assignData = [];
  //   console.log(assignData);
  //   list?.map((item, rowIndex) => {
  //     if (item.isChecked) {
  //       assignData.push({
  //         invoice_sale_item_id: item.invoice_sale_item_id,
  //       });
  //     }
  //   });
  //   if (assignData.length) {
  //     let data = {
  //       assign_data: assignData,
  //     };
  //     createJewelDelivered(data);
  //   } else {
  //     toastfunc(" Select Item to Deliver");
  //   }
  // };

  const updateData = async () => {
    let assignData = [];
    // console.log(assignData);
    list?.map((item, rowIndex) => {
      if (item?.show_checkbox && item.isChecked) {
        assignData?.push({
          id_item_delivered: item.id_item_delivered,
        });
      }
    });
    const postData = {
      deliver_details: assignData,
    };
    try {
      let response = await dispatch(updateJewelDelivered(postData)).unwrap();
      reset_form();
    } catch (error) {
      let message = error?.response?.data?.message;
      toastfunc(message);
    }
  };

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

  // const handleDelete = (index) => {
  //   const jewelList = [...list];
  //   jewelList.splice(index, 1);
  //   setList(jewelList);
  // };

  const getjewelNotDeliverDetails = () => {
    // if (filterBranch) {
    const filters = {
      branch: filterBranch,
      customer: customer,
      bill_setting_type : billSettingType
    };

    dispatch(getJewelNotDeliverList(filters));
    // }
    // else if (!filterBranch) {
    //   toastfunc("Branch Required !!");
    // }
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

  const selectAllCol = (value) => {
    list?.map((item, rowIndex) => {
      if (item?.show_checkbox == true) {
        handelChange(rowIndex, "isChecked", value);
      } else {
        handelChange(rowIndex, "isChecked", false);
      }
    });
  };

  const reset_form = async () => {
    reset("");
    setList([]);
    setFilterBranch();
  };

  const columns = [
    { header: "Bill No", accessor: "bill_no", textAlign: "center" },
    { header: "Bill Date", accessor: "bill_date", textAlign: "center" },
    { header: "Branch Name", accessor: "branch_name", textAlign: "center" },
    { header: "Customer Name", accessor: "customer_name", textAlign: "center" },
    {
      header: "Customer Mobile",
      accessor: "customer_mobile",
      textAlign: "center",
    },
    { header: "Product Name", accessor: "product_name", textAlign: "center" },
    {
      header: "Status",
      accessor: "status",
      textAlign: "center",
      type: "lable",
    },
    {
      header: "Piece",
      accessor: "piece",
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
    { header: "Delivered By", accessor: "delivered_by", textAlign: "center" },
    { header: "Delivered On", accessor: "delivered_on", textAlign: "center" },
  ];

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

  return (
    <React.Fragment>
      <Head title="Jewel Not Deliver" />
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
                disabled={issubmitting || !pagePermission?.add}
                size="md"
                color="primary"
                onClick={updateData}
              >
                {issubmitting ? "Saving" : "Save"}
              </SaveButton>

              <SaveButton
                disabled={issubmitting || !pagePermission?.view}
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
                  <label className="form-label" htmlFor="filterBranch">
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
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}>
                        S.NO{" "}
                        {list?.some((obj) => obj?.show_checkbox === true) && (
                          <input
                            type="checkbox"
                            onChange={(event) => {
                              selectAllCol(event.target.checked);
                              setSelectAll(event.target.checked);
                            }}
                            checked={selectAll}
                          />
                        )}
                      </th>
                      {columns?.map((column, index) => {
                        return (
                          <th
                            key={index}
                            style={{ textAlign: column?.textAlign,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}
                          >
                            {column.header}
                          </th>
                        );
                      })}
                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {list?.length > 0 &&
                      list?.map((item, rowIndex) => (
                        <tr key={rowIndex}>
                          <td>
                            {rowIndex + 1}{" "}
                            {item?.show_checkbox && (
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
                            )}
                          </td>
                          {columns?.map((column, colIndex) => {
                            return (
                              <td
                                key={colIndex}
                                style={{ textAlign: column?.textAlign,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa' }}
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
                      ))}
                  </tbody>

                  <tfoot>
                    <tr style={{ fontWeight: "bold" }}>
                      <td>Total</td>
                      {columns.map((column, index) => {
                        return (
                          <td
                            key={index}
                            style={{ textAlign: column?.textAlign ,position: 'sticky', top: 0, zIndex: 1, backgroundColor:'#f8f9fa'}}
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

export default JewelDeliverForm;
