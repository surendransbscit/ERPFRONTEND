import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardTitle,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Table,
  UncontrolledDropdown,
} from "reactstrap";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../components/Component";
import { formatCurrencyInINR } from "../../../components/common/moneyFormat/moneyFormat";
import { getSupplierListRateCut } from "../../../redux/thunks/purchaseDashboard";

const RateCut = () => {
  const dispatch = useDispatch();
  const { supplierListRateCut } = useSelector(
    (state) => state.purchaseDashboardReducer
  );

  const [days, SetDays] = useState("4");
  useEffect(() => {
    dispatch(getSupplierListRateCut({ view: days }));
  }, [dispatch, days]);
  return (
    <Card className="shadow-sm">
      <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-primary text-white rounded-top">
        <div className="card-title-group">
          <CardTitle>
            <h6 className="title mb-0">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Supplier Rate Cut
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
              <th className="text-center">Supplier</th>
              <th className="text-center">Metal</th>
              <th className="text-center">Payment Date</th>
              <th className="text-center">Ref. no</th>
              <th className="text-center">Balance Weight</th>
              <th className="text-center">Balance Amount</th>
            </tr>
          </thead>
          <tbody>
            {supplierListRateCut?.length > 0 ? (
              <>
                {supplierListRateCut?.map((item, idx) => (
                  <tr
                    key={idx}
                    style={{
                      cursor: "pointer",
                    }}
                    //   onClick={() => {
                    //     navigate(
                    //       {
                    //         pathname: `${process.env?.PUBLIC_URL}/retail/dashboard/reports/estimation`,
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
                    <td className="text-left">{item.supplier_name}</td>
                    <td className="text-left">{item.metal_name}</td>
                    <td className="text-right">{item.payment_date}</td>
                    <td className="text-right">{item.ref_no}</td>
                    <td className="text-right">{item.balance_weight}</td>
                    <td className="text-right text-warning">
                      {formatCurrencyInINR(item.balance_amount)}
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td></td>
                <td colSpan="4" className="text-center">
                  <h4 style={{ marginTop: "10px", marginBottom: "10px" }}>
                    No record found
                  </h4>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default RateCut;
