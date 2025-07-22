import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Card, CardTitle, DropdownItem, DropdownMenu, DropdownToggle, Table, UncontrolledDropdown } from "reactstrap";
import "../crm/Dashboard.css"
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { getEstimation } from "../../../redux/thunks/retailDashboard";
import { formatCurrencyInINR } from "../../../components/common/moneyFormat/moneyFormat";
import { Icon, PreviewAltCard } from "../../../components/Component";
import { useNavigate } from "react-router";

const EstimationDash = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { estimationDashList } = useSelector((state) => state.retailDashboardReducer);

    const [days, SetDays] = useState("4");
    useEffect(() => {
        dispatch(getEstimation({ view: days }));
    }, [dispatch, days]);

    // console.log(estimationDashList);
    return (
        <Card className="shadow-sm">
            <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-primary text-white rounded-top"
              
              >
                <div className="card-title-group">
                    <CardTitle>
                        <h6 className="title mb-0">
                            <FontAwesomeIcon icon={faClipboardList} className="me-2" />
                            Estimation
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
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            <Table>
                <thead>
                    <tr>
                        <th className="text-left">#</th>
                        <th className="text-center">Nos</th>
                        <th className="text-right">%</th>
                        {/* <th className="text-right">Rate</th> */}
                        <th className="text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {estimationDashList?.length > 0 ? (
                        <>
                            {estimationDashList?.map((item, idx) => (
                                <tr key={idx} style={{
                                    cursor:"pointer"
                                  }}
                                  onClick={() => {
                                    navigate(
                                      {
                                        pathname: `${process.env?.PUBLIC_URL}/retail/dashboard/reports/estimation`,
                                      },
                                      {
                                        state: {
                                          days: days,
                                          type : item.type,
                                        },
                                      }
                                    );
                                  }}>
                                    <td className="text-left">{item.lable}</td>
                                    <td className="text-right">{item.count}</td>
                                    <td className="text-right">{item.percentage}</td>
                                    {/* <td className="text-right text-info">{item.converted_amt}</td> */}
                                    <td className="text-right text-warning">{formatCurrencyInINR(item.amount)}</td>
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

export default EstimationDash;

export const trafficData = [
    {
        id: 1,
        name: "Created",
        nos: "213",
        per: "3420",
        rate: "329",
        amount: "329",
    },
    {
        id: 2,
        name: "Converted",
        nos: "213",
        per: "3420",
        rate: "329",
        amount: "329",
    },
    {
        id: 3,
        name: "Non Converted",
        nos: "213",
        per: "3420",
        rate: "329",
        amount: "329",
    },
];
