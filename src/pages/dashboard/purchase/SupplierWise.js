import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Card, CardTitle, DropdownItem, DropdownMenu, DropdownToggle, Table, UncontrolledDropdown } from "reactstrap";
import "../crm/Dashboard.css"
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { getEstimation } from "../../../redux/thunks/retailDashboard";
import { Icon, PreviewAltCard } from "../../../components/Component";
import { useNavigate } from "react-router";
import { getSupplierWisePurchase } from "../../../redux/thunks/purchaseDashboard";

const SupplierWise = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { supplierWisePurchase } = useSelector((state) => state.retailDashboardReducer);

    const [days, SetDays] = useState("4");
    useEffect(() => {
        dispatch(getSupplierWisePurchase({ view: days }));
    }, [dispatch, days]);

    // console.log(estimationDashList);
    return (
        <Card className="shadow-sm">
            <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-info text-white rounded-top">
                <div className="card-title-group">
                    <CardTitle>
                        <h6 className="title mb-0">
                            <FontAwesomeIcon icon={faClipboardList} className="me-2" />
                            Supplier Wise Purchase
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
                        <th className="text-left">Supplier</th>
                        <th className="text-center">Metal</th>
                        <th className="text-center">Gross Weight</th>
                        <th className="text-center">Pure Weight</th>
                    </tr>
                </thead>
                <tbody>
                    {supplierWisePurchase?.length > 0 ? (
                        <>
                            {supplierWisePurchase?.map((item, idx) => (
                                <tr key={idx} style={{
                                    cursor:"pointer"
                                  }}
                                //   onClick={() => {
                                //     navigate(
                                //       {
                                //         pathname: `${process.env?.PUBLIC_URL}/retail/dashboard/report/supplier_wise`,
                                //       },
                                //       {
                                //         state: {
                                //           days: days,
                                //           type : item.type,
                                //         },
                                //       }
                                //     );
                                //   }}
                                  >
                                    <td className="text-left">{idx + 1}</td>
                                    <td className="text-center">{item.supplier_name}</td>
                                    <td className="text-center">{item.metal_name}</td>
                                    <td className="text-center">{item.gross_wt}</td>
                                    <td className="text-center">{item.pure_wt}</td>
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

export default SupplierWise;

