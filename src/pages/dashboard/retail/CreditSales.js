import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../crm/Dashboard.css"
import { faClipboardList, faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../components/Component";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Card, CardTitle, DropdownItem, DropdownMenu, DropdownToggle, Table, UncontrolledDropdown } from "reactstrap";
import { getCreditSales } from "../../../redux/thunks/retailDashboard";
import { formatCurrencyInINR } from "../../../components/common/moneyFormat/moneyFormat";
import { useNavigate } from "react-router";

const CreditSales = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { creditSalesDashList } = useSelector((state) => state.retailDashboardReducer);

    const [days, SetDays] = useState("4");
    useEffect(() => {
        dispatch(getCreditSales({ view: days }));
    }, [dispatch, days]);

    // console.log(creditSalesDashList);
    return (
        <Card className="shadow-sm">
            <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-warning text-white rounded-top"
            
            >
                <div className="card-title-group">
                    <CardTitle>
                        <h6 className="title mb-0">
                            <FontAwesomeIcon icon={faClipboardList} className="me-2" />
                            Credit Sales
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
            <div style={{ overflowY: "auto", cursor:"pointer" }}
              onClick={() => {
                navigate(
                  {
                    pathname: `${process.env?.PUBLIC_URL}/retail/dashboard/reports/creditsales`,
                  },
                  {
                    state: {
                      days: days,
                    },
                  }
                );
              }}>
                <Table>
                    <thead>
                        <tr>
                            <th className="text-left">#</th>
                            {/* <th className="text-center">Qty</th> */}
                            <th className="text-right">Pending</th>
                            <th className="text-right">Collected</th>
                            <th className="text-right">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {creditSalesDashList?.length > 0 ? (
                            <>
                                {creditSalesDashList?.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="text-left">{item.Label}</td>
                                        {/* <td className="text-center">{item.quantiy}</td> */}
                                        <td className="text-right text-info">{formatCurrencyInINR(item.pending)}</td>
                                        <td className="text-right text-info">{formatCurrencyInINR(item.res_amount)}</td>
                                        <td className="text-right text-info">{formatCurrencyInINR(item.balance_amount)}</td>

                                    </tr>
                                ))}
                            </>
                        ) : (
                            <tr>
                                <td></td>
                                <td colSpan="4" className="text-center">
                                    <h4 style={{ marginTop: "10px", marginBottom: "10px" }}>No record found</h4>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </Card >
    );
};

export default CreditSales;

export const trafficData = [
    {
        id: 1,
        name: "Credit",
        qty: "213",
        pen: "3420",
        coll: "39",
        bal: "329",
    },
    {
        id: 2,
        name: "To Be",
        qty: "213",
        pen: "3420",
        coll: "39",
        bal: "329",
    },
    {
        id: 3,
        name: "Total",
        qty: "213",
        pen: "3420",
        coll: "39",
        bal: "329",
    },
];
