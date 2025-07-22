import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../crm/Dashboard.css";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { Icon, PreviewAltCard } from "../../../components/Component";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardTitle, DropdownItem, DropdownMenu, DropdownToggle, Table, UncontrolledDropdown } from "reactstrap";
import { getSales } from "../../../redux/thunks/retailDashboard";
import { getAccessBranches } from "../../../redux/thunks/coreComponent";
import secureLocalStorage from "react-secure-storage";
import { formatCurrencyInINR } from "../../../components/common/moneyFormat/moneyFormat";
import { useNavigate } from "react-router";

const Sales = () => {
  // const dispatch = useDispatch();
  // const navigate = useNavigate()
  // const [branches, SetBranches] = useState([]);
  // const { accessBranches } = useSelector((state) => state.coreCompReducer);
  // const loginpref = secureLocalStorage.getItem("pref")?.pref;

  // useEffect(() => {
  //   dispatch(getAccessBranches(loginpref));
  // }, [dispatch, loginpref]);

  // useEffect(() => {
  //   const branchNames = accessBranches?.map((item) => item.id_branch); //[1,2,3]
  //   SetBranches(branchNames);
  // }, [accessBranches]);
  // const { salesDashList } = useSelector((state) => state.retailDashboardReducer);

  // const [days, SetDays] = useState("4");
  // useEffect(() => {
  //   dispatch(getSales({ view: days, branch: branches }));
  // }, [dispatch, days, branches, accessBranches]);



  const dispatch = useDispatch();
  const { accessBranches } = useSelector((state) => state.coreCompReducer);
  const { salesDashList } = useSelector((state) => state.retailDashboardReducer);
  const loginpref = secureLocalStorage.getItem("pref")?.pref;

  const [days, SetDays] = useState("4");
  const [branches, SetBranches] = useState([]);

  useEffect(() => {
    if (loginpref) {
      dispatch(getAccessBranches(loginpref));
    }
  }, [dispatch, loginpref]);

  useEffect(() => {
    if (accessBranches?.length) {
      const branchIds = accessBranches.map((item) => item.id_branch);
      SetBranches(branchIds);
    }
  }, [accessBranches]);

  useEffect(() => {
    if (branches.length > 0) {
      dispatch(getSales({ view: days, branch: branches }));
    }
  }, [dispatch, days, JSON.stringify(branches)]);

  let total_amount = 0
  let total_bill_count = 0
  let total_pieces = 0
  let total_weight = 0

  return (
    <Card className="shadow-sm">
      <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-info text-white rounded-top"
      >
        <div className="card-title-group">
          <CardTitle>
            <h6 className="title mb-0">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Sales
            </h6>
          </CardTitle>
        </div>
        <div className="card-tools">
          <div className="card-tools">
            <UncontrolledDropdown>
              <DropdownToggle
                tag="a"
                href="#toggle"
                onClick={(ev) => ev.preventDefault()}
                className="dropdown-toggle btn btn-icon btn-trigger"
              >
                <Icon name="more-h text-white" />
              </DropdownToggle>
              <DropdownMenu end className="dropdown-menu-sm">
                <ul className="link-list-opt no-bdr">
                  <li className={days == "4" ? "active" : ""}>
                    <DropdownItem
                      tag="a"
                      href="#dropdown"
                      onClick={(ev) => {
                        ev.preventDefault();
                        SetDays("4");
                      }}
                    >
                      <span>Today</span>
                    </DropdownItem>
                  </li>
                  <li className={days == "5" ? "active" : ""}>
                    <DropdownItem
                      tag="a"
                      href="#dropdown"
                      onClick={(ev) => {
                        ev.preventDefault();
                        SetDays("5");
                      }}
                    >
                      <span>Yesterday</span>
                    </DropdownItem>
                  </li>
                  <li className={days == "2" ? "active" : ""}>
                    <DropdownItem
                      tag="a"
                      href="#dropdown"
                      onClick={(ev) => {
                        ev.preventDefault();
                        SetDays("2");
                      }}
                    >
                      <span>This Week</span>
                    </DropdownItem>
                  </li>
                  <li className={days == "1" ? "active" : ""}>
                    <DropdownItem
                      tag="a"
                      href="#dropdown"
                      onClick={(ev) => {
                        ev.preventDefault();
                        SetDays("1");
                      }}
                    >
                      <span>This Month</span>
                    </DropdownItem>
                  </li>
                  <li className={days == "3" ? "active" : ""}>
                    <DropdownItem
                      tag="a"
                      href="#dropdown"
                      onClick={(ev) => {
                        ev.preventDefault();
                        SetDays("3");
                      }}
                    >
                      <span>Last Month</span>
                    </DropdownItem>
                  </li>
                </ul>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
      </div>
      <div style={{ maxHeight: "300px", overflowY: "auto", cursor: "pointer" }} >
        <Table>
          <thead>
            <tr>
              <th className="text-left">#</th>
              <th className="text-center">Nos</th>
              <th className="text-right">Pcs</th>
              <th className="text-right">Weight</th>
              <th className="text-right">Amount</th>
              {/* <th className="text-right">Total</th> */}
            </tr>
          </thead>
          <tbody>
            {salesDashList?.length > 0 ? (
              <>
                {salesDashList?.map((item) => {
                  total_weight += parseFloat(item.weight)
                  total_pieces += parseFloat(item.piece)
                  total_bill_count += parseFloat(item.bill_count)
                  total_amount += parseFloat(item.amount)

                  return (
                    <tr key={item.id} onClick={() => {
                      navigate(
                        {
                          pathname: `${process.env?.PUBLIC_URL}/retail/dashboard/reports/sales`,
                        },
                        {
                          state: {
                            days: days,
                            branch: branches,
                            type: item.type,
                          },
                        }
                      );
                    }}>
                      <td className="text-left">{item.metal_name}</td>
                      <td className="text-center text-info">{item.bill_count}</td>
                      <td className="text-center text-warning">{item.piece}</td>
                      <td className="text-right text-warning">{parseFloat(item.weight).toFixed(3)}</td>
                      <td className="text-right text-warning">{formatCurrencyInINR(item.amount)}</td>
                      {/* <td className="text-right text-warning">{item.total}</td> */}
                    </tr>

                  )
                })}
                <tr className="bold">
                  <td className="text-left">TOTAL</td>
                  <td className="text-center text-info">{total_bill_count}</td>
                  <td className="text-center text-warning">{total_pieces}</td>
                  <td className="text-right text-warning">{parseFloat(total_weight).toFixed(3)}</td>
                  <td className="text-right text-warning">{formatCurrencyInINR(total_amount)}</td>
                  {/* <td className="text-right text-warning">{item.total}</td> */}
                </tr>
              </>
            ) : (
              <tr>
                <td></td>
                <td colSpan="5" className="text-center">
                  <h4 style={{ marginTop: "10px", marginBottom: "10px" }}>No record found</h4>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default Sales;

export const trafficData = [
  {
    id: 1,
    name: "Gold",
    nos: "213",
    per: "3420",
    weight: "39",
    amount: "329",
    total: "2300",
  },
  {
    id: 2,
    name: "Silver",
    nos: "213",
    per: "3420",
    weight: "39",
    amount: "329",
    total: "2300",
  },
  {
    id: 3,
    name: "Diamond",
    nos: "213",
    per: "3420",
    weight: "39",
    amount: "329",
    total: "1,820",
  },
];
