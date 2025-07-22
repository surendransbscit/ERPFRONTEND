import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import styled from "styled-components";
import { Block, Icon, NumberInputField } from "../../components/Component";
import { getPagePermission } from "../../redux/thunks/coreComponent";
import { Button, Card } from "reactstrap";
import { getReOrderAvailabilityReport } from "../../redux/thunks/reports";
import moment from "moment";
import { useForm } from "react-hook-form";
import "../../assets/css/datatable.css";
import CurrencyDisplay from "../../components/common/moneyFormat/moneyFormat";
import ReportFilterComponent from "./ReportFilterComponent";
import FilterSidebar from "../../components/sidebar/FilterSidebar";
import secureLocalStorage from "react-secure-storage";
import { isUndefined } from "../../components/common/calculations/ErpCalculations";
import { useProducts } from "../../components/filters/filterHooks";
import * as XLSX from "xlsx";
import { createPurchaseCartItem } from "../../redux/thunks/Order";
import { toastsuccess } from "../../components/sds-toast-style/toast-style";
export const Styles = styled.div`
  padding: 2vh 0.75vw;
  .table-wrapper {
    overflow-x: auto; /* Enable horizontal scrolling */
    width: 100%;
  }
  table {
    width: 100%;
    min-width: 1000px; /* Ensures scrolling on smaller screens */
    border-spacing: 2px;
    border: 1px solid #e1e1e1;
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

const ReorderReport = () => {
  const { register, clearErrors, setValue, errors } = useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pathName = location?.pathname;
  const { reOrderAvailabilityReportList, isLoading: loadingData } = useSelector(
    (state) => state.reportReducer
  );
  const { pagePermission } = useSelector((state) => state.coreCompReducer);
  const { userInfo } = useSelector((state) => state.authUserReducer);
  const [selectedBranch, SetSelectedBranch] = useState([]);
  const [startDate, SetStartDate] = useState(new Date());
  const [endDate, SetEndDate] = useState(new Date());
  const [reportType, setReportType] = useState(1);
  const [itemDetails, setItemDetails] = useState({});
  const [filteredProduct, setFilteredProduct] = useState();
  const { products } = useProducts();
  const reportTypeOption = [
    { value: 1, label: "Summary" },
    { value: 2, label: "Detail" },
  ];
  const tableRef = useRef();
  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);
  useEffect(() => {
    setItemDetails(reOrderAvailabilityReportList?.data);
  }, [reOrderAvailabilityReportList]);

  const updateData = (branch_name, index, key, value) => {
    setItemDetails((prevValues) => {
      const branchArray = [...(prevValues[branch_name] || [])]; // copy array
      const updatedObject = { ...branchArray[index], [key]: value }; // update field
      branchArray[index] = updatedObject; // replace item
      console.log(branchArray[index]);
      return {
        ...prevValues, // copy whole state
        [branch_name]: branchArray, // update only this branch
      };
    });
  };

  useEffect(() => {
    let branch = [];
    if (selectedBranch.length) {
      branch = selectedBranch?.map((obj) => {
        const container = obj.value;
        return container;
      });
    } else {
      const loginpref = secureLocalStorage.getItem("pref")?.pref;
      branch = loginpref.login_branches;
    }
    dispatch(
      getReOrderAvailabilityReport({
        fromDate: moment(startDate).format("YYYY-MM-DD"),
        toDate: moment(endDate).format("YYYY-MM-DD"),
        branch: branch,
        reportType: reportType,
      })
    );
  }, [dispatch]);

  const getData = async () => {
    let branch = [];
    if (selectedBranch.length) {
      branch = selectedBranch?.map((obj) => {
        const container = obj.value;
        return container;
      });
    } else {
      const loginpref = secureLocalStorage.getItem("pref")?.pref;
      branch = loginpref.login_branches;
    }
    try {
      await dispatch(
        getReOrderAvailabilityReport({
          fromDate: moment(startDate).format("YYYY-MM-DD"),
          toDate: moment(endDate).format("YYYY-MM-DD"),
          branch: branch,
          product: filteredProduct,
          reportType: reportType,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const [filterModal, SetFilterModal] = useState(false);
  const toggleFilterModal = () => SetFilterModal(!filterModal);

  const columns = [
    // { accessor: "sno", header: "SNO", textAlign: "left" },
    { accessor: "trans_name", header: "Trans Name", textAlign: "left" },
    {
      accessor: "debit",
      header: "Credit",
      textAlign: "right",
      isTotalReq: true,
      isCurrency: true,
      decimalPlaces: 2,
    },
    {
      accessor: "credit",
      header: "Debit",
      textAlign: "right",
      isTotalReq: true,
      isCurrency: true,
      decimalPlaces: 2,
    },
  ];

  const exportToPrint = () => {
    const titleContent = "Cash Book Report";

    // Get the HTML table content
    const tableHTML = tableRef?.current?.innerHTML || "";

    // Combine title and table content into a single div
    const combinedHTML = `<div id="tablecontainer">
        <table><tr><td style="text-align:center;" colspan="${columns.length}">${titleContent}</td></tr></table>
        ${tableHTML}
    </div>`;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = combinedHTML;

    // Ensure you're querying the intended element
    const table = tempDiv.querySelector("#tablecontainer"); // Look for a <table> inside tempDiv
    if (!table) {
      console.error("No table element found in the provided HTML string.");
      return;
    }

    // Print the content
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(`
        <html>
            <head>
                <title>${titleContent}</title>
                <style>
                    /* Add custom styles for printing here */
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f4f4f4;
                    }
                </style>
            </head>
            <body>
                ${table.outerHTML}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const exportToExcel = () => {
    const titleContent = "Cash Book Report";

    // Get the HTML table content
    const tableHTML = tableRef?.current?.innerHTML || "";

    // Combine title and table content into a single div
    const combinedHTML = `<div id="tablecontainer" >
        <table><tr><td style="text-align:center;"colspan= "${columns.length}" >${titleContent}</td></tr></table>
        ${tableHTML}
    </div>`;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = combinedHTML;

    // Ensure you're querying the intended element
    const table = tempDiv.querySelector("#tablecontainer"); // Look for a <table> inside tempDiv
    if (!table) {
      console.error("No table element found in the provided HTML string.");
      return;
    }

    // Proceed with further operations on the table
    console.log("Table found:", table);

    // Convert the table to a worksheet
    const worksheet = XLSX.utils.table_to_sheet(table);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, "export.xlsx");
  };

  const handleAddToCart = async (passObj, data, key) => {
    let addData = passObj;
    console.log(addData);
    try {
      await dispatch(createPurchaseCartItem(addData)).unwrap();
      updateData(data["branch_name"], key, "show_cart_button", false);
      toastsuccess("Successfully added to cart");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <Head
        title={
          pagePermission?.title ? pagePermission?.title : "Re-Order Reports"
        }
      ></Head>
      {pagePermission?.view && (
        <Content>
          <Block size="lg">
            <Card className="card-bordered card-preview">
              <Styles>
                <div className="card-inner">
                  <div className="card-title-group">
                    <div className="toggle-wrap nk-block-tools-toggle">
                      <h5>Re-Order Reports</h5>
                    </div>
                    <div className="card-tools me-n1">
                      <ul className="btn-toolbar gx-1">
                        <li className="btn-toolbar-sep"></li>
                        <li>
                          <div className="dt-buttons btn-group flex-wrap">
                            <button
                              className="btn btn-secondary buttons-csv buttons-html5"
                              type="button"
                            >
                              <span>CSV</span>
                            </button>{" "}
                            <button
                              className="btn btn-secondary buttons-excel buttons-html5"
                              type="button"
                              onClick={() => exportToExcel()}
                            >
                              <span>Excel</span>
                            </button>{" "}
                            <button
                              className="btn btn-secondary "
                              type="button"
                              onClick={exportToPrint}
                            >
                              <Icon name="printer-fill"></Icon>
                            </button>{" "}
                          </div>
                        </li>
                        <li className="btn-toolbar-sep"></li>
                        <li>
                          <div
                            className="btn btn-trigger btn-icon dropdown-toggle"
                            onClick={toggleFilterModal}
                          >
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
                  <div
                    className="table-responsive dataTables_wrapper"
                    ref={tableRef}
                  >
                    <table className="table-wrapper react_table table-bordered ">
                      <thead>
                        {reOrderAvailabilityReportList?.reorder_based_on ==
                          "3" && (
                          <>
                            <tr>
                              <th rowSpan={3}>Branch</th>
                              <th rowSpan={3}>Product</th>
                              <th rowSpan={3}>Design</th>
                              {reOrderAvailabilityReportList?.is_sub_design_req ==
                                "1" && <th rowSpan={3}>Sub Design</th>}
                              {reOrderAvailabilityReportList?.column?.map(
                                (column, index) => (
                                  <th
                                    key={index}
                                    colSpan={
                                      parseFloat(column.size_details.length) * 2
                                    }
                                    style={{ textAlign: column?.textAlign }}
                                  >
                                    {column.weight_range_name}
                                  </th>
                                )
                              )}
                            </tr>

                            <tr>
                              {reOrderAvailabilityReportList?.column !=
                                undefined &&
                                reOrderAvailabilityReportList?.column?.map(
                                  (column, index) => {
                                    return column.size_details?.map(
                                      (size, key) => (
                                        <th key={key} colSpan={2}>
                                          {size.size_name}
                                        </th>
                                      )
                                    );
                                  }
                                )}
                            </tr>
                            <tr>
                              {reOrderAvailabilityReportList?.column !=
                                undefined &&
                                reOrderAvailabilityReportList?.column?.map(
                                  (column, index) => {
                                    return column.size_details?.map(
                                      (size, key) => (
                                        <>
                                          <td key={key + "asas"}>Min</td>
                                          <td key={key + "sds"}>Avail</td>
                                        </>
                                      )
                                    );
                                  }
                                )}
                            </tr>
                          </>
                        )}

                        {reOrderAvailabilityReportList?.reorder_based_on ==
                          "2" && (
                          <>
                            <tr>
                              <th rowSpan={3}>Branch</th>
                              <th rowSpan={3}>Product</th>
                              <th rowSpan={3}>Design</th>
                              {reOrderAvailabilityReportList?.is_sub_design_req ==
                                "1" && <th rowSpan={3}>Sub Design</th>}
                              {reOrderAvailabilityReportList?.column?.map(
                                (column, index) => (
                                  <th
                                    key={index}
                                    colSpan={2}
                                    style={{ textAlign: column?.textAlign }}
                                  >
                                    {column.size_name}
                                  </th>
                                )
                              )}
                            </tr>

                            <tr>
                              {reOrderAvailabilityReportList?.column !=
                                undefined &&
                                reOrderAvailabilityReportList?.column?.map(
                                  (column, index) => {
                                    return (
                                      <>
                                        <th key={index + "asas"}>Min</th>
                                        <th key={index + "sds"}>Avail</th>
                                      </>
                                    );
                                  }
                                )}
                            </tr>
                          </>
                        )}

                        {reOrderAvailabilityReportList?.reorder_based_on ==
                          "1" && (
                          <>
                            <tr>
                              <th rowSpan={3}>Branch</th>
                              <th rowSpan={3}>Product</th>
                              <th rowSpan={3}>Design</th>
                              {reOrderAvailabilityReportList?.is_sub_design_req ==
                                "1" && <th rowSpan={3}>Sub Design</th>}
                              {reOrderAvailabilityReportList?.column?.map(
                                (column, index) => (
                                  <th
                                    key={index}
                                    colSpan={2}
                                    style={{ textAlign: column?.textAlign }}
                                  >
                                    {column.weight_range_name}
                                  </th>
                                )
                              )}
                            </tr>

                            <tr>
                              {reOrderAvailabilityReportList?.column !=
                                undefined &&
                                reOrderAvailabilityReportList?.column?.map(
                                  (column, index) => {
                                    return (
                                      <>
                                        <th key={index + "asas"}>Min</th>
                                        <th key={index + "sds"}>Avail</th>
                                      </>
                                    );
                                  }
                                )}
                            </tr>
                          </>
                        )}
                      </thead>
                      <tbody>
                        {itemDetails != undefined &&
                          reOrderAvailabilityReportList?.reorder_based_on ==
                            "3" &&
                          Object.values(itemDetails)?.map((column, index) => {
                            return (
                              <>
                                {" "}
                                <tr>
                                  <td rowSpan={column.length + 1}>
                                    {column[0]["branch_name"]}
                                  </td>{" "}
                                </tr>
                                {/* {console.log(column)} */}
                                {column?.map((data, key) => (
                                  <tr>
                                    <td>{data["product"]}</td>
                                    <td>{data["design"]}</td>
                                    {reOrderAvailabilityReportList?.is_sub_design_req ==
                                      1 && <td>{data["sub_design"]}</td>}
                                    {reOrderAvailabilityReportList?.column !=
                                      undefined &&
                                      reOrderAvailabilityReportList?.column?.map(
                                        (column, indexx) => {
                                          return column.size_details?.map(
                                            (size, keyyy) => (
                                              <>
                                                <td>
                                                  {
                                                    data[
                                                      `${data["temp_name"]}_${column["id_weight_range"]}_${size["size"]}_min_pcs`
                                                    ]
                                                  }
                                                </td>
                                                <td>
                                                  {/* {
                                                    data[
                                                      `${data["temp_name"]}_${column["id_weight_range"]}_${size["size"]}_pcs`
                                                    ]
                                                  } */}
                                                  <div className="input-group">
                                                    <div
                                                      style={{ width: "25%" }}
                                                    >
                                                      <input
                                                        style={{ color: "red" }}
                                                        type="number"
                                                        min={0}
                                                        className="form-control form-control-sm no-spinner"
                                                        value={
                                                          data[
                                                            `${data["temp_name"]}_${column["id_weight_range"]}_${size["size"]}_pcs`
                                                          ]
                                                        }
                                                        onChange={(e) => {
                                                          const value =
                                                            e.target.value;
                                                          updateData(
                                                            data["branch_name"],
                                                            key,
                                                            `${data["temp_name"]}_${column["id_weight_range"]}_${size["size"]}_pcs`,
                                                            value
                                                          );
                                                        }}
                                                        onWheel={(e) =>
                                                          e.target.blur()
                                                        }
                                                        onKeyDown={(evt) =>
                                                          [
                                                            "e",
                                                            "E",
                                                            "+",
                                                            "-",
                                                          ].includes(evt.key) &&
                                                          evt.preventDefault()
                                                        }
                                                      />
                                                    </div>

                                                    {data[
                                                      "show_cart_button"
                                                    ] === true && (
                                                      <div className="input-group-append">
                                                        <Button
                                                          outline
                                                          size="sm"
                                                          color="primary"
                                                          className="btn-dim"
                                                          onClick={() => {
                                                            handleAddToCart(
                                                              {
                                                                erp_tag: null,
                                                                product:
                                                                  data[
                                                                    "tag_product_id"
                                                                  ],
                                                                design:
                                                                  data[
                                                                    "tag_design_id"
                                                                  ],
                                                                pieces:
                                                                  data[
                                                                    `${data["temp_name"]}_${column["id_weight_range"]}_${size["size"]}_pcs`
                                                                  ],
                                                                gross_wt:
                                                                  data["wt"],
                                                                weight_range:
                                                                  column[
                                                                    "id_weight_range"
                                                                  ],
                                                                size: size[
                                                                  "size"
                                                                ],
                                                              },
                                                              data,
                                                              key
                                                            );
                                                          }}
                                                        >
                                                          <em class="icon ni ni-plus"></em>
                                                        </Button>
                                                      </div>
                                                    )}
                                                  </div>
                                                </td>
                                              </>
                                            )
                                          );
                                        }
                                      )}
                                  </tr>
                                ))}
                              </>
                            );
                          })}

                        {itemDetails != undefined &&
                          reOrderAvailabilityReportList?.reorder_based_on ==
                            "2" &&
                          Object.values(itemDetails)?.map((column, index) => {
                            return (
                              <>
                                {" "}
                                <tr>
                                  <td rowSpan={column.length + 1}>
                                    {column[0]["branch_name"]}
                                  </td>{" "}
                                </tr>
                                {console.log(column)}
                                {column?.map((data, key) => (
                                  <tr>
                                    <td>{data["product"]}</td>
                                    <td>{data["design"]}</td>
                                    {reOrderAvailabilityReportList?.is_sub_design_req ==
                                      1 && <td>{data["sub_design"]}</td>}
                                    {reOrderAvailabilityReportList?.column !=
                                      undefined &&
                                      reOrderAvailabilityReportList?.column?.map(
                                        (column, index) => {
                                          return (
                                            <>
                                              <td>
                                                {
                                                  data[
                                                    `${data["temp_name"]}_${column["size"]}_min_pcs`
                                                  ]
                                                }
                                              </td>
                                              <td>
                                                {
                                                  data[
                                                    `${data["temp_name"]}_${column["size"]}_pcs`
                                                  ]
                                                }
                                                {console.log(
                                                  data[
                                                    `${data["temp_name"]}_${column["size"]}_pcs`
                                                  ]
                                                )}
                                              </td>
                                            </>
                                          );
                                        }
                                      )}
                                  </tr>
                                ))}
                              </>
                            );
                          })}

                        {itemDetails != undefined &&
                          reOrderAvailabilityReportList?.reorder_based_on ==
                            "1" &&
                          Object.values(itemDetails)?.map((column, indexk) => {
                            return (
                              <>
                                {" "}
                                <tr>
                                  <td rowSpan={column.length + 1}>
                                    {column[0]["branch_name"]}
                                  </td>{" "}
                                </tr>
                                {console.log(column)}
                                {column?.map((data, key) => (
                                  <tr>
                                    <td>{data["product"]}</td>
                                    <td>{data["design"]}</td>
                                    {reOrderAvailabilityReportList?.is_sub_design_req ==
                                      1 && <td>{data["sub_design"]}</td>}
                                    {reOrderAvailabilityReportList?.column !=
                                      undefined &&
                                      reOrderAvailabilityReportList?.column?.map(
                                        (column, index) => {
                                          return (
                                            <>
                                              <td>
                                                <NumberInputField
                                                  placeholder="Pcs"
                                                  id={`${data["temp_name"]}_${column["id_weight_range"]}_pcs`}
                                                  value={
                                                    data[
                                                      `${data["temp_name"]}_${column["id_weight_range"]}_pcs`
                                                    ]
                                                  }
                                                  isRequired={false}
                                                  min={0}
                                                  type={"number"}
                                                  setValue={setValue}
                                                  handleKeyDownEvents={true}
                                                  handleDecimalDigits={true}
                                                  decimalValues={0}
                                                  SetValue={(value) => {
                                                    updateData(
                                                      data["branch_name"],
                                                      indexk,
                                                      `${data["temp_name"]}_${column["id_weight_range"]}_pcs`,
                                                      value
                                                    );
                                                  }}
                                                  minError={
                                                    "Pcs should less than or equal to 0"
                                                  }
                                                  maxError={
                                                    "Pcs greater than or equal to 0"
                                                  }
                                                  reqValueError={
                                                    "Pcs is Required"
                                                  }
                                                  register={register}
                                                />
                                                {
                                                  data[
                                                    `${data["temp_name"]}_${column["id_weight_range"]}_min_pcs`
                                                  ]
                                                }
                                              </td>
                                              <td>
                                                {
                                                  data[
                                                    `${data["temp_name"]}_${column["id_weight_range"]}_pcs`
                                                  ]
                                                }
                                                {console.log(
                                                  data[
                                                    `${data["temp_name"]}_${column["id_weight_range"]}_pcs`
                                                  ],
                                                  `${data["temp_name"]}_${column["id_weight_range"]}_pcs`
                                                )}
                                              </td>
                                            </>
                                          );
                                        }
                                      )}
                                  </tr>
                                ))}
                              </>
                            );
                          })}
                      </tbody>

                      <tfoot></tfoot>
                    </table>
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
              is_group_by_req: false,
              is_multi_branch_filter_req: true,
              is_scheme_filter_req: false,
              is_date_filter_req: true,
              isProductFilterReq: true,
              products,
              filteredProducts: filteredProduct,
              setFilteredProducts: setFilteredProduct,
              setReportType,
              reportType,
              reportTypeOption,
              isReportTypeReq: true,
            }}
          />
        </Content>
      )}
    </React.Fragment>
  );
};

export default ReorderReport;
