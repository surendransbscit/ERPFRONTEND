import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React , { useEffect, useState } from "react";
import "../crm/Dashboard.css"
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { getPurchase } from "../../../redux/thunks/retailDashboard";
import { Card, CardTitle, DropdownItem, DropdownMenu, DropdownToggle, Table, UncontrolledDropdown } from "reactstrap";
import { Icon } from "../../../components/Component";
import { formatCurrencyInINR } from "../../../components/common/moneyFormat/moneyFormat";
import { useNavigate } from "react-router";


const OldMetalPurchase = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { purchaseDashList } = useSelector((state) => state.retailDashboardReducer);

    const [days, SetDays] = useState("4");
    useEffect(() => {
        dispatch(getPurchase({ view: days }));
    }, [dispatch, days]);
    let total_count = 0
    let total_rate = 0
    let total_wastage = 0
    let total_weight = 0
    return (
        <Card className="shadow-sm">
            <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-info text-white rounded-top"
            
            >
                <div className="card-title-group">
                    <CardTitle>
                        <h6 className="title mb-0">
                            <FontAwesomeIcon icon={faClipboardList} className="me-2" />
                            Old Metal Purchase
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
            <div style={{ overflowY: "auto", cursor:"pointer" }}>
            <Table>
                <thead>
                    <tr>
                        <th className="text-left">#</th>
                        <th className="text-center">Weight</th>
                        <th className="text-right">Rate</th>
                        <th className="text-right">%</th>
                    </tr>
                </thead>
                <tbody>
                {purchaseDashList?.length > 0 ? (
                        <>
                    {purchaseDashList?.map((item) => {
                        total_weight += parseFloat(item.weight)
                        total_wastage += parseFloat(item.wastage)
                        total_rate += parseFloat(item.rate)
                        total_count += 1
                    return (
                        <tr key={item.id}   onClick={() => {
                            navigate(
                              {
                                pathname: `${process.env?.PUBLIC_URL}/retail/dashboard/reports/purchase`,
                              },
                              {
                                state: {
                                  days: days,
                                  type: item.id_metal
                                },
                              }
                            );
                          }}>
                            <td className="text-left">{item.metal_name}</td>
                            <td className="text-center text-info">{parseFloat(item.weight).toFixed(3)}</td>
                            <td className="text-center text-warning">{ formatCurrencyInINR(item.rate)}</td>
                            <td className="text-right text-warning">{parseFloat(item.wastage).toFixed(2)}</td>
                        </tr>
                    )})}
                        <tr className="bold" >
                            <td className="text-left">TOTAL</td>
                            <td className="text-center text-info">{parseFloat(total_weight).toFixed(3)}</td>
                            <td className="text-center text-warning">{ formatCurrencyInINR(total_rate)}</td>
                            <td className="text-right text-warning">{parseFloat(total_wastage/total_count).toFixed(2)}</td>
                        </tr>

                       </>
                    ) : (
                        <tr>
                            
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

export default OldMetalPurchase;

export const trafficData = [
    {
        id: 1,
        name: "Gold",
        weight: "213",
        rate: "3420",
        pcs: "39",
    },
    {
        id: 2,
        name: "Silver",
        weight: "213",
        rate: "3420",
        pcs: "39",
    },
];
