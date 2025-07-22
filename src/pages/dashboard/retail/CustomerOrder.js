import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../crm/Dashboard.css"
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../components/Component";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Card, CardTitle, DropdownItem, DropdownMenu, DropdownToggle, Table, UncontrolledDropdown } from "reactstrap";
import { getCustomerOrder } from "../../../redux/thunks/retailDashboard";
import { useNavigate } from "react-router";

const CustomerOrder = () => {
    const dispatch = useDispatch();
    const { customerOrderDashList } = useSelector((state) => state.retailDashboardReducer);
    const navigate = useNavigate();
    const [days, SetDays] = useState("4");
    useEffect(() => {
        dispatch(getCustomerOrder({ view: days }));
    }, [dispatch, days]);

    console.log(customerOrderDashList);
    return (
        <Card className="shadow-sm">
            <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-info text-white rounded-top">
                <div className="card-title-group">
                    <CardTitle>
                        <h6 className="title mb-0">
                            <FontAwesomeIcon icon={faClipboardList} className="me-2" />
                            Customer Orders
                        </h6>
                    </CardTitle>
                </div>
                {/* <div className="card-tools">
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
                </div> */}
            </div>

            <Table>
                <thead>
                    <tr>
                        <th className="text-left">#</th>
                        <th className="text-right">Qty</th>
                        <th className="text-right">Weight</th>
                    </tr>
                </thead>
                <tbody>
                    {customerOrderDashList?.length > 0 ? (
                        <>
                            {customerOrderDashList?.map((item, idx) => (
                                <tr key={idx} onClick={() => {
                                    navigate(
                                      {
                                        pathname: `${process.env?.PUBLIC_URL}/retail/dashboard/reports/customer_order`,
                                      },
                                      {
                                        state: {
                                          days: 1,
                                          type : item.type,
                                        },
                                      }
                                    );
                                  }}>
                                    <td className="text-left">{item.status_name}</td>
                                    <td className="text-right text-info">{item.piece}</td>
                                    <td className="text-right text-warning">{(isNaN(parseFloat(item.weight).toFixed(2)) ? 0.000 : parseFloat(item.weight).toFixed(3))}</td>
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
        </Card >
    );
};

export default CustomerOrder;

export const trafficData = [
    {
        id: 1,
        name: "Received",
        qty: "213",
        weight: "3420",
    },
    {
        id: 2,
        name: "Allocated",
        qty: "213",
        weight: "3420",
    },
    {
        id: 3,
        name: "Not Allocated",
        qty: "213",
        weight: "3420",
    },
    {
        id: 4,
        name: "Delivery Ready",
        qty: "213",
        weight: "3420",
    },
    {
        id: 5,
        name: "Delivered",
        qty: "213",
        weight: "3420",
    },

    {
        id: 6,
        name: "Delivery Pending",
        qty: "213",
        weight: "3420",
    },
];
