import React, { useEffect, useState } from "react";
import Head from "../../../../layout/head/Head";
import Content from "../../../../layout/content/Content";
import { Block } from "../../../../components/Component";
import { Card, Badge } from "reactstrap";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import CurrencyDisplay from "../../../../components/common/moneyFormat/moneyFormat";
import {
  getAccessBranches,
  getPagePermission,
} from "../../../../redux/thunks/coreComponent";
import { matcherData } from "./CrmDashReportReduxMatcher";
import secureLocalStorage from "react-secure-storage";

const Styles = styled.div`
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

const CrmDashReportList = () => {
  const { register, clearErrors, setValue, errors } = useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  const pathName = location?.pathname;
  const loginpref = secureLocalStorage.getItem("pref")?.pref;
  // const branch = location?.state?.branch;
  const days = location?.state?.days;
  const type = location?.state?.type;

  const [branches, SetBranches] = useState([]);
  const { accessBranches } = useSelector((state) => state.coreCompReducer);

  useEffect(() => {
    dispatch(getAccessBranches(loginpref));
  }, [dispatch, loginpref]);

  useEffect(() => {
    const branchNames = accessBranches?.map((item) => item.id_branch); //[1,2,3]
    SetBranches(branchNames);
  }, [accessBranches]);

  //   console.log(pathName);

  const { pagePermission } = useSelector((state) => state.coreCompReducer);

  const useDynamicSelector = (sliceName, key) => {
    return useSelector((state) => state[sliceName][key]);
  };
  const calculateTotal = (field) => {
    return listingData?.data?.reduce((acc, current) => {
      let total = parseFloat(acc) + (parseFloat(current[field]) || 0);
      let column = listingData?.column.find((item) => item.accessor === field);
      let decimal_places = column && column.decimal_places !== undefined ? column.decimal_places : null;
      return parseFloat(total).toFixed(decimal_places);
    }, 0);
  };
  useEffect(() => {
    dispatch(getPagePermission({ path: pathName }));
  }, [pathName, dispatch]);

  const reduxData = matcherData?.find((element) => element?.url === pathName);
  const listingData = useDynamicSelector(
    reduxData?.sliceName,
    reduxData?.dataKey
  );
  const loadingData = useDynamicSelector(
    reduxData.sliceName,
    reduxData.loaderKey
  );

  useEffect(() => {
    let branchNames = accessBranches?.map((item) => item.id_branch);
    (reduxData &&
      branches &&
      days) &&
      dispatch(reduxData?.action({ filter: days, branch: branchNames, type: type }));
  }, [reduxData, dispatch]);

  // console.log(listingData);

  return (
    <React.Fragment>
      <Head
        title={pagePermission?.title ? pagePermission?.title : reduxData?.title}
      />
      {pagePermission?.view && (
        <Content>
          <Block size="lg">
            <Card className="card-bordered card-preview">
              <Styles>
                <div className="card-inner">
                  <div className="card-title-group">
                    <div className="toggle-wrap nk-block-tools-toggle">
                      <h5>{reduxData?.title}</h5>
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
                            //   onClick={() => exportExcel()}
                            >
                              <span>Excel</span>
                            </button>{" "}
                          </div>
                        </li>
                        {/* <li className="btn-toolbar-sep"></li>
                      <li>
                        <div className="btn btn-trigger btn-icon dropdown-toggle" onClick={toggleFilterModal}>
                          <div className="dot dot-primary"></div>
                          Filters<Icon name="filter-alt"></Icon>
                        </div>
                      </li> */}

                        {/* {FilterComponent} */}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="table-responsive dataTables_wrapper">
                  <table className="table-wrapper react_table">
                    <thead>
                      <tr>
                        {listingData?.column?.map((column, index) => (
                          <th
                            key={index}
                            style={{ textAlign: column?.textAlign }}
                          >
                            {column.Header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {listingData?.data?.length > 0 &&
                        listingData?.data?.map((item, rowIndex) => (
                          <>
                            <tr style={{ fontWeight: "bold" }}>
                              {/* <td style={{ textAlign: "left" }}>
                                {item?.scheme_name}
                              </td>
                              <td colSpan={listingData?.column?.length}></td> */}
                            </tr>

                            <tr key={rowIndex}>
                              {listingData?.column?.map((column, colIndex) => {
                                if (column.accessor === 'status') {
                                  return (<td
                                    key={colIndex}
                                    style={{ textAlign: column?.textAlign }}
                                  ><Badge className="badge-sm badge-dot has-bg d-none d-sm-inline-flex" color={item['colour']}>
                                      {item['status']}
                                    </Badge> </td>)
                                }
                                return (
                                  <td
                                    key={colIndex}
                                    style={{ textAlign: column?.textAlign }}
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
                                )
                              })}
                            </tr>
                          </>
                        ))}
                    </tbody>
                    <tfoot>
                      {listingData?.data?.length > 0 && (
                        <tr style={{ fontWeight: 'bold' }}>
                          <td>Total</td>
                          {listingData?.column?.map((column, index) => (index !== 0 && (
                            <td key={index} style={{ "textAlign": column?.textAlign }}>
                              {column.isTotalReq ? column.isCurrency ? <CurrencyDisplay value={calculateTotal(column.accessor)} /> : (calculateTotal(column.accessor)) : ''}
                            </td>
                          )))}
                        </tr>
                      )}
                    </tfoot>

                  </table>
                </div>
              </Styles>
            </Card>
          </Block>
        </Content>
      )}
    </React.Fragment>
  );
};

export default CrmDashReportList;
