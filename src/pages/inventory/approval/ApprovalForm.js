import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import { toastfunc } from "../../../components/sds-toast-style/toast-style";
import Content from "../../../layout/content/Content";
import CurrencyDisplay from "../../../components/common/moneyFormat/moneyFormat";
import { PreviewCard, SaveButton } from "../../../components/Component";
import { Col, Row, Icon } from "../../../components/Component";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Label } from "reactstrap";
import IsRequired from "../../../components/erp-required/erp-required";
import {
  BranchDropdown,
  SelectDropdown,
} from "../../../components/filters/retailFilters";
import { useBranches } from "../../../components/filters/filterHooks";
import ModifiedBreadcrumb from "../../../components/common/breadcrumb/ModifiedBreadCrumb";
import { TextInputField } from "../../../components/form-control/InputGroup";
import { createApproval, getStockList } from "../../../redux/thunks/inventory";

const ApprovalForm = () => {
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
  const { isLoading: issubmitting, stockList } = useSelector(
    (state) => state.approvalReducer
  );
  const { branches } = useBranches();
  const [assignStockList, setAssignStockList] = useState([]);
  const [filterFromBranch, setFilterFromBranch] = useState();
  const [filterToBranch, setFilterToBranch] = useState();
  const [filterBtCode, setFilterBtCode] = useState();
  const [Type, setType] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectDownLoadAll, setSelectDownLoadAll] = useState(false);
  const [toBranches, setToBranches] = useState([]);
  const [stockType, setStockType] = useState(1);
  const [downloadedStockList, setDownloadedStockList] = useState([]);
  const [enableClose, setEnableClose] = useState(false);

  const stockTypeOption = [
    { value: 1, label: "Tagged Item" },
    { value: 2, label: "Non Tag" },
    { value: 3, label: "Old Metal" },
    { value: 4, label: "Sales Return" },
    { value: 5, label: "Partly Sale" },
  ];

  const {
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);

  useEffect(() => {
    if (stockList?.list) {
      let type = Type;
      setAssignStockList(stockList?.list);
      if (filterBtCode != "") {
        type = stockList?.list[0]["transfer_status"];
        setType(type == 0 ? 1 : 2);
      }
      console.log("stockList", stockList?.list);
      if (type == 1 && settings?.stock_download_type == 3) {
          let tag_details = stockList?.list[0]["details"];
          setDownloadedStockList(tag_details);
          console.log("tag_details", tag_details);
      }
    }
  }, [stockList?.list]);

  useEffect(() => {
    if (
      Type == 2 &&
      stockType == 1 &&
      settings?.stock_download_type == 2 &&
      assignStockList.length > 0
    ) {
      checkTableAndEnableClose();
    }
  }, [assignStockList]);

  const form_submit = async (data, actionType) => {
    let assignData = [];
    let downLoaded_stock = [];
    console.log(assignData);
    assignStockList?.map((item, rowIndex) => {
      if (item.isChecked) {
        assignData.push({
          id_stock_transfer: item.id_stock_transfer,
          tag_code: item.tag_code,
        });
      }
    });
    if(settings?.stock_download_type == 3) { 
      downloadedStockList?.map((item, rowIndex) => {
        if (item.isChecked) {
          downLoaded_stock.push(item)
        }
      })
    }
    if (assignData.length > 0 || (downLoaded_stock.length > 0 && settings?.stock_download_type == 3)) {
      const filters = {
        trans_code: filterBtCode ? filterBtCode : "",
        transfer_from: filterFromBranch ? filterFromBranch : "",
        transfer_to: filterToBranch ? filterToBranch : "",
        type: Type,
        stock_type: stockType,
      };
      let data = {
        type: Type,
        filter_data: filters,
        approval_data: assignData,
        downLoaded_stock :downLoaded_stock,
      };
      createStockApproval(data);
    } else {
      toastfunc(" Select Stock to approval");
    }
  };

  const createStockApproval = async (data) => {
    try {
      let response = await dispatch(createApproval(data)).unwrap();
      console.log(response);
      if (
        !(Type == 2 && stockType == 1 && settings?.stock_download_type == 2)
      ) {
        reset_form();
      } else {
        return response;
      }
    } catch (error) {
      let message = error?.response?.data?.message;
      toastfunc(message);
    }
  };

  const calculateTotal = (field) => {
    return stockList?.list?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columns.find((item) => item.accessor === field);
      let decimal_places =
        column && column.decimal_places !== undefined
          ? column.decimal_places
          : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const calculateTotalDownload = (field) => {
    return downloadedStockList?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = columnsDownload.find((item) => item.accessor === field);
      let decimal_places =
        column && column.decimal_places !== undefined
          ? column.decimal_places
          : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };

  const handleDelete = (index) => {
    const updatedFormData = [...assignStockList];
    updatedFormData.splice(index, 1);
    setAssignStockList(updatedFormData);
  };

  const getStockDetails = () => {
    //if (filterToBranch && filterFromBranch) {
    const filters = {
      trans_code: filterBtCode ? filterBtCode : "",
      transfer_from: filterFromBranch ? filterFromBranch : "",
      transfer_to: filterToBranch ? filterToBranch : "",
      type: Type,
      stock_type: stockType,
    };

    dispatch(getStockList(filters));
    // } else if (!filterFromBranch) {
    //   toastfunc(" From Branch Required !!")
    // }
    // else if (!filterToBranch) {
    //   toastfunc(" To Branch Required !!")
    // }
  };

  const selectAllCol = (value) => {
    assignStockList?.map((item, rowIndex) => {
      handelChange(rowIndex, "isChecked", value);
    });
  };

  const handelChange = (index, field, value) => {
    setAssignStockList((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;

      return updatedValues;
    });
    console.log(assignStockList);
  };

    const handelStockChange = (index, field, value) => {
    setDownloadedStockList((prevValues) => {
      const updatedValues = [...prevValues];
      const updatedObject = { ...updatedValues[index] };
      updatedObject[field] = value;
      updatedValues[index] = updatedObject;

      return updatedValues;
    });
  };

  const selectAllDownloadCol = (value) => {
    downloadedStockList?.map((item, rowIndex) => {
      handelStockChange(rowIndex, "isChecked", value);
    });
  };
  const reset_form = async () => {
    reset("");
    setAssignStockList([]);
    setDownloadedStockList([]);
    setFilterFromBranch();
    setFilterToBranch();
    setFilterBtCode("");
  };

  const columns = [
    { header: "Trans Code", accessor: "trans_code", textAlign: "center" },
    {
      header: "Tag Code",
      accessor: "tag_code",
      textAlign: "center",
      customised: true,
    },
    { header: "From Branch", accessor: "transfer_from", textAlign: "center" },
    { header: "To Branch", accessor: "transfer_to", textAlign: "center" },
    {
      header: "Tansfer Type",
      accessor: "transfer_type_name",
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
      accessor: "stn_wt",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
  ];

  const columnsDownload = [
    { header: "Tag Code", accessor: "tag_code", textAlign: "center" },
    { header: "Product", accessor: "product_name", textAlign: "center" },
    {
      header: "Gwt",
      accessor: "tag_gwt",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Lwt",
      accessor: "tag_lwt",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Nwt",
      accessor: "tag_nwt",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Dia Wt",
      accessor: "tag_dia_wt",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
    {
      header: "Stone Wt",
      accessor: "tag_stn_wt",
      decimal_places: 3,
      textAlign: "right",
      isTotalReq: true,
    },
  ];

  const setTagCode = (value, index) => {
    handelChange(index, "tag_code", value);
  };

  const setOldCode = (value, index) => {
    handelChange(index, "old_tag_code", value);
  };

  const handleTagSearch = (index, value) => {
    let approval_data = assignStockList[index];

    let postData = {
      tag_code: approval_data?.tag_code,
      old_tag_code: approval_data?.old_tag_code,
      id_stock_transfer: approval_data.id_stock_transfer,
    };

    let data = {
      type: Type,
      approval_data: [postData],
    };

    createStockApproval(data)
      .then((response) => {
        console.log("Response:", response);
        let tag_details = response?.data;

        let stock_downloded = response?.stock_downloded;

        if (stock_downloded) {
          handelChange(index, "stock_downloded", stock_downloded);
        }

        if (tag_details) {
          setTagCode("", index);
          setOldCode("", index);
          if(approval_data?.old_tag_code!=''){
              let input = document.getElementById("oldTagCode_" + index);
              if (input) {
              input.focus();
            } 
          }
          if(approval_data?.tag_code!=''){
              let input = document.getElementById("tagCode_" + index);
                if (input) {
                input.focus();
              } 
          }
          
          
          setDownloadedStockList([...downloadedStockList, ...[tag_details]]);
          checkTableAndEnableClose();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const checkTableAndEnableClose = () => {
    let totalDownloadedStock = assignStockList.filter(
      (item) => item.stock_downloded == true
    ).length;
    let totalStock = assignStockList.length;
    console.log("totalDownloadedStock", totalDownloadedStock, "  ", totalStock);
    if (totalDownloadedStock == totalStock) {
      setEnableClose(true);
    }
  };

  return (
    <React.Fragment>
      <Head title="Approval" />
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
              {enableClose == false && (
                <SaveButton
                  disabled={issubmitting}
                  size="md"
                  color="primary"
                  onClick={handleSubmit((data) => {
                    console.log(errors);
                    if (
                      !(
                        Type == 2 &&
                        stockType == 1 &&
                        (settings?.stock_download_type == 2)
                      )
                    ) {
                      form_submit(data, "saveAndNew");
                    } else {
                      toastfunc("Stock Only Download Through Tag Scan");
                    }
                  })}
                >
                  {issubmitting ? "Saving" : "Save"}
                </SaveButton>
              )}

              {enableClose && (
                <SaveButton
                  size="md"
                  color="warning"
                  onClick={() =>
                    navigate(
                      `${process.env.PUBLIC_URL}/inventory/stock_transfer/list`
                    )
                  }
                >
                  Close
                </SaveButton>
              )}

              <SaveButton
                disabled={issubmitting}
                color="secondary"
                size="md"
                onClick={() => getStockDetails()}
              >
                Search
              </SaveButton>
            </Col>
          </Row>

          <div className="custom-grid">
            <Row className="g-3 align-center form-control-sm">
              <Col lg="2">
                <Label>Type</Label>
                <div className="form-group">
                  <ul className="custom-control-group g-3 align-center flex-wrap">
                    <li>
                      <div className="custom-control custom-control-sm custom-radio">
                        <input
                          id="approval"
                          type="radio"
                          name={"Type"}
                          value={"1"}
                          className="custom-control-input"
                          checked={Type == "1"}
                          onChange={(e) => {
                            setAssignStockList([]);
                            setType(e.target.value);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="approval"
                        >
                          Approval
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="custom-control custom-control-sm  custom-radio">
                        <input
                          id="reciept"
                          type="radio"
                          value={"2"}
                          name={"Type"}
                          className="custom-control-input "
                          checked={Type == "2"}
                          onChange={(e) => {
                            setType(e.target.value);
                            setAssignStockList([]);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="reciept"
                        >
                          Reciept
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </Col>

              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    From Branch
                    <IsRequired />
                  </label>
                  <BranchDropdown
                    register={register}
                    id={"filterFromBranch"}
                    branches={branches}
                    selectedBranch={filterFromBranch}
                    onBranchChange={(value) => {
                      setFilterFromBranch(value);
                      let branch = branches.filter(
                        (item) => item.id_branch != value
                      );
                      setToBranches(branch);
                      setFilterToBranch("");
                    }}
                    isRequired={true}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={
                      errors.filterFromBranch && "From Branch is Required"
                    }
                  />
                </div>
              </Col>

              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="product">
                    To Branch
                  </label>
                  <BranchDropdown
                    register={register}
                    id={"filterToBranch"}
                    branches={toBranches}
                    selectedBranch={filterToBranch}
                    onBranchChange={(value) => {
                      setFilterToBranch(value);
                    }}
                    isRequired={false}
                    clearErrors={clearErrors}
                    setValue={setValue}
                    message={errors.filterToBranch && "To Branch is Required"}
                  />
                </div>
              </Col>

              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="selectedDesign">
                    Trans Code
                  </label>
                  <TextInputField
                    register={register}
                    placeholder="Trans Code"
                    id={"filterBtCode"}
                    value={filterBtCode}
                    isRequired={false}
                    type={"text"}
                    setValue={setValue}
                    SetValue={(value) => {
                      setFilterBtCode(value);
                      clearErrors("filterBtCode");
                    }}
                    message={errors.filterBtCode && errors.filterBtCode.message}
                  />
                </div>
              </Col>

              <Col lg="2">
                <div className="form-group">
                  <label className="form-label" htmlFor="selectedDesign">
                    Stock Type
                    <IsRequired />
                  </label>
                  <SelectDropdown
                    register={register}
                    id={"stockType"}
                    data={stockTypeOption}
                    selectedValue={stockType}
                    setValue={setValue}
                    clearErrors={clearErrors}
                    onChangeEvent={(value) => {
                      setStockType(value);
                    }}
                    placeholder={"Stock Type"}
                    valueField={"value"}
                    labelField={"label"}
                  />
                </div>
              </Col>
            </Row>

            <Row className="mt-2" md={12}>
              <div
                className="table-responsive"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                <table className="table table-bordered">
                  <thead
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <tr
                      style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                        backgroundColor: "#f8f9fa",
                      }}
                    >
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
                      {columns.map((column, index) => {
                        if (column?.customised !== true) {
                          return (
                            <th
                              key={index}
                              style={{
                                textAlign: column?.textAlign,
                                position: "sticky",
                                top: 0,
                                zIndex: 1,
                                backgroundColor: "#f8f9fa",
                              }}
                            >
                              {column.header}
                            </th>
                          );
                        }

                        if (
                          column?.customised == true &&
                          Type == 2 &&
                          stockType == 1 &&
                          settings?.stock_download_type == 2
                        ) {
                          return (
                            <th
                              key={index}
                              style={{
                                textAlign: column?.textAlign,
                                position: "sticky",
                                top: 0,
                                zIndex: 1,
                                backgroundColor: "#f8f9fa",
                              }}
                            >
                              {column.header}
                            </th>
                          );
                        }
                      })}
                      <th
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignStockList?.length > 0 &&
                      assignStockList?.map((item, rowIndex) => (
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
                            if (
                              column?.customised &&
                              Type == 2 &&
                              stockType == 1 &&
                              settings?.stock_download_type == 2
                            ) {
                              if (!item.stock_downloded) {
                                return (
                                  <td
                                    key={colIndex}
                                    style={{
                                      textAlign: column?.textAlign,
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 1,
                                      backgroundColor: "#f8f9fa",
                                    }}
                                  >
                                    <div className="form-control-wrap">
                                      <div className="input-group">
                                        <TextInputField
                                          register={register}
                                          isRequired={false}
                                          id={"tagCode_" + rowIndex}
                                          placeholder="Tag Code"
                                          value={item.tag_code}
                                          SetValue={(value) => {
                                            setTagCode(value, rowIndex);
                                            clearErrors("tagCode");
                                          }}
                                        />
                                        <TextInputField
                                          register={register}
                                          isRequired={false}
                                          id={"oldTagCode_" + rowIndex}
                                          placeholder="Old Tag"
                                          value={item.old_tag_code}
                                          SetValue={(value) => {
                                            setOldCode(value, rowIndex);
                                            clearErrors("oldTagCode");
                                          }}
                                        />
                                        <div className="input-group-append" style={{height: "29px"}}> 
                                          <Button
                                            outline
                                            color="primary"
                                            className="btn-dim"
                                            onClick={() =>
                                              handleTagSearch(
                                                rowIndex,
                                                item.tag_code
                                              )
                                            }
                                          >
                                            <Icon name="icon ni ni-search" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                );
                              } else {
                                return (
                                  <td
                                    key={colIndex}
                                    style={{
                                      textAlign: column?.textAlign,
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 1,
                                      backgroundColor: "#f8f9fa",
                                    }}
                                  >
                                    <div className="text-success">
                                      {" "}
                                      STOCK DOWNLOADED
                                    </div>
                                  </td>
                                );
                              }
                            }

                            if (column?.customised !== true) {
                              return (
                                <td
                                  key={colIndex}
                                  style={{
                                    textAlign: column?.textAlign,
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  {column.isCurrency ? (
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
                            }

                            // Return null if no conditions are met (optional)
                            return null;
                          })}

                          <td>
                            <Button
                              color="primary"
                              size="sm"
                              className="btn-icon btn-white btn-dim"
                              onClick={() => handleDelete()}
                            >
                              <Icon name="trash-fill" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>

                  <tfoot>
                    <tr style={{ fontWeight: "bold" }}>
                      <td
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        Total
                      </td>
                      {columns.map((column, index) => {
                        if (column?.customised !== true) {
                          return (
                            <td
                              key={index}
                              style={{
                                textAlign: column?.textAlign,
                                position: "sticky",
                                top: 0,
                                zIndex: 1,
                                backgroundColor: "#f8f9fa",
                              }}
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
                        }

                        if (
                          column?.customised == true &&
                          Type == 2 &&
                          stockType == 1 &&
                          settings?.stock_download_type == 2
                        ) {
                          return (
                            <td
                              key={index}
                              style={{
                                textAlign: column?.textAlign,
                                position: "sticky",
                                top: 0,
                                zIndex: 1,
                                backgroundColor: "#f8f9fa",
                              }}
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
                        }
                      })}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Row>
            {(downloadedStockList?.length > 0 && settings?.stock_download_type == 2) && (
              <Row className="mt-2" md={12}>
                <div
                  className="table-responsive"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  DOWNLOADED STOCK :
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
                        </th>
                        {columnsDownload.map((column, index) => {
                          if (
                            column?.customised &&
                            Type == 2 &&
                            stockType == 1 &&
                            settings?.stock_download_type == 2
                          ) {
                            return (
                              <th
                                key={index}
                                style={{
                                  textAlign: column?.textAlign,
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                Tag Code
                              </th>
                            );
                          }

                          if (!column?.customised) {
                            return (
                              <th
                                key={index}
                                style={{
                                  textAlign: column?.textAlign,
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                {column.header}
                              </th>
                            );
                          }
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {downloadedStockList?.length > 0 &&
                        downloadedStockList?.map((item, rowIndex) => (
                          <tr key={rowIndex}>
                            <td>{rowIndex + 1}</td>
                            {columnsDownload?.map((column, colIndex) => {
                              if (
                                column?.customised &&
                                Type == 2 &&
                                stockType == 1 &&
                                settings?.stock_download_type == 2
                              ) {
                                return (
                                  <td
                                    key={colIndex}
                                    style={{
                                      textAlign: column?.textAlign,
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 1,
                                      backgroundColor: "#f8f9fa",
                                    }}
                                  >
                                    <div className="form-control-wrap">
                                      <div className="input-group">
                                        <TextInputField
                                          register={register}
                                          isRequired={false}
                                          id={"tagCode_" + rowIndex}
                                          placeholder="Tag Code"
                                          value={item.tag_code}
                                          SetValue={(value) => {
                                            setTagCode(value, rowIndex);
                                            clearErrors("tagCode");
                                          }}
                                        />
                                        <div className="input-group-append">
                                          <Button
                                            outline
                                            color="primary"
                                            className="btn-dim"
                                            onClick={handleTagSearch}
                                          >
                                            <Icon name="icon ni ni-search" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                );
                              }

                              if (column?.customised !== true) {
                                return (
                                  <td
                                    key={colIndex}
                                    style={{
                                      textAlign: column?.textAlign,
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 1,
                                      backgroundColor: "#f8f9fa",
                                    }}
                                  >
                                    {column.isCurrency ? (
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
                              }

                              // Return null if no conditions are met (optional)
                              return null;
                            })}
                          </tr>
                        ))}
                    </tbody>

                    <tfoot
                      style={{
                        position: "sticky",
                        bottom: 0,
                        zIndex: 10,
                        backgroundColor: "#fff",
                      }}
                    >
                      <tr style={{ fontWeight: "bold" }}>
                        <td>Total</td>
                        {columnsDownload.map((column, index) => {
                          if (!column?.customised) {
                            return (
                              <td
                                key={index}
                                style={{
                                  textAlign: column?.textAlign,
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                {column.isTotalReq ? (
                                  column.isCurrency ? (
                                    <CurrencyDisplay
                                      value={calculateTotalDownload(
                                        column.accessor
                                      )}
                                    />
                                  ) : (
                                    calculateTotalDownload(column.accessor)
                                  )
                                ) : (
                                  ""
                                )}
                              </td>
                            );
                          }
                          if (
                            column?.customised &&
                            Type == 2 &&
                            stockType == 1 &&
                            settings?.stock_download_type == 2
                          ) {
                            return (
                              <td
                                key={index}
                                style={{
                                  textAlign: column?.textAlign,
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                {column.isTotalReq ? (
                                  column.isCurrency ? (
                                    <CurrencyDisplay
                                      value={calculateTotalDownload(
                                        column.accessor
                                      )}
                                    />
                                  ) : (
                                    calculateTotalDownload(column.accessor)
                                  )
                                ) : (
                                  ""
                                )}
                              </td>
                            );
                          }
                        })}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Row>
            )}
            {(downloadedStockList?.length > 0 && settings?.stock_download_type == 3) && (
              <Row className="mt-2" md={12}>
                <div
                  className="table-responsive"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  ISSUED STOCK :
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
                            selectAllDownloadCol(event.target.checked);
                            setSelectDownLoadAll(event.target.checked);
                          }}
                          checked={selectDownLoadAll}
                        />{" "}
                        </th>
                        {columnsDownload.map((column, index) => {
                          if (
                            column?.customised &&
                            Type == 2 &&
                            stockType == 1 &&
                            settings?.stock_download_type == 2
                          ) {
                            return (
                              <th
                                key={index}
                                style={{
                                  textAlign: column?.textAlign,
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                Tag Code
                              </th>
                            );
                          }

                          if (!column?.customised) {
                            return (
                              <th
                                key={index}
                                style={{
                                  textAlign: column?.textAlign,
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                {column.header}
                              </th>
                            );
                          }
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {downloadedStockList?.length > 0 &&
                        downloadedStockList?.map((item, rowIndex) => (
                          <tr key={rowIndex}>
                            <td>{rowIndex + 1} {" "}
                            <input
                              type="checkbox"
                              onChange={(event) => {
                                handelStockChange(
                                  rowIndex,
                                  "isChecked",
                                  event.target.checked
                                );
                              }}
                              checked={item.isChecked}
                            />{" "} </td>
                            {columnsDownload?.map((column, colIndex) => {
                              if (
                                column?.customised &&
                                Type == 2 &&
                                stockType == 1 &&
                                settings?.stock_download_type == 2
                              ) {
                                return (
                                  <td
                                    key={colIndex}
                                    style={{
                                      textAlign: column?.textAlign,
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 1,
                                      backgroundColor: "#f8f9fa",
                                    }}
                                  >
                                    <div className="form-control-wrap">
                                      <div className="input-group">
                                        <TextInputField
                                          register={register}
                                          isRequired={false}
                                          id={"tagCode_" + rowIndex}
                                          placeholder="Tag Code"
                                          value={item.tag_code}
                                          SetValue={(value) => {
                                            setTagCode(value, rowIndex);
                                            clearErrors("tagCode");
                                          }}
                                        />
                                        <div className="input-group-append">
                                          <Button
                                            outline
                                            color="primary"
                                            className="btn-dim"
                                            onClick={handleTagSearch}
                                          >
                                            <Icon name="icon ni ni-search" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                );
                              }

                              if (column?.customised !== true) {
                                return (
                                  <td
                                    key={colIndex}
                                    style={{
                                      textAlign: column?.textAlign,
                                      position: "sticky",
                                      top: 0,
                                      zIndex: 1,
                                      backgroundColor: "#f8f9fa",
                                    }}
                                  >
                                    {column.isCurrency ? (
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
                              }

                              // Return null if no conditions are met (optional)
                              return null;
                            })}
                          </tr>
                        ))}
                    </tbody>

                    <tfoot
                      style={{
                        position: "sticky",
                        bottom: 0,
                        zIndex: 10,
                        backgroundColor: "#fff",
                      }}
                    >
                      <tr style={{ fontWeight: "bold" }}>
                        <td>Total</td>
                        {columnsDownload.map((column, index) => {
                          if (!column?.customised) {
                            return (
                              <td
                                key={index}
                                style={{
                                  textAlign: column?.textAlign,
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                {column.isTotalReq ? (
                                  column.isCurrency ? (
                                    <CurrencyDisplay
                                      value={calculateTotalDownload(
                                        column.accessor
                                      )}
                                    />
                                  ) : (
                                    calculateTotalDownload(column.accessor)
                                  )
                                ) : (
                                  ""
                                )}
                              </td>
                            );
                          }
                          if (
                            column?.customised &&
                            Type == 2 &&
                            stockType == 1 &&
                            settings?.stock_download_type == 2
                          ) {
                            return (
                              <td
                                key={index}
                                style={{
                                  textAlign: column?.textAlign,
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 1,
                                  backgroundColor: "#f8f9fa",
                                }}
                              >
                                {column.isTotalReq ? (
                                  column.isCurrency ? (
                                    <CurrencyDisplay
                                      value={calculateTotalDownload(
                                        column.accessor
                                      )}
                                    />
                                  ) : (
                                    calculateTotalDownload(column.accessor)
                                  )
                                ) : (
                                  ""
                                )}
                              </td>
                            );
                          }
                        })}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Row>
            )}
          </div>
        </PreviewCard>
      </Content>
    </React.Fragment>
  );
};

export default ApprovalForm;
