import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Card, CardTitle, DropdownItem, DropdownMenu, DropdownToggle, Table, UncontrolledDropdown } from "reactstrap";
import "./Dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { Icon, PreviewAltCard } from "../../../components/Component";
import { getPaymentThrough } from "../../../redux/thunks/dashboard";
import { formatCurrencyInINR } from "../../../components/common/moneyFormat/moneyFormat";

const CollectionSummary = () => {
  const [days, SetDays] = useState('4');
  const dispatch = useDispatch();
  const { paymentThroughList } = useSelector((state) => state.dashboardReducer);
  useEffect(() => {
    dispatch(getPaymentThrough({ days: days }));
  }, [dispatch, days]);

  // console.log(paymentThroughList);

  return (
    <Card className="shadow-sm">
      <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-secondary text-white rounded-top">
        <div className="card-title-group">
          <CardTitle>
            <h6 className="title mb-0">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Collection Summary
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
      <div style={{ overflowY: "auto" }}>
        <Table>
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th className="text-center">Name</th>
              <th className="text-right">Amount</th>
              <th className="text-right">Weight </th>
            </tr>
          </thead>
          <tbody>
            {paymentThroughList?.length > 0 ? (
              <>
                {paymentThroughList?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="text-center">{idx + 1}</td>
                    <td className="text-center">{item.mode_name}</td>
                    <td className="text-right text-info">{formatCurrencyInINR(item.amount)}</td>
                    <td className="text-right text-warning">{item.weight}</td>
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
    </Card>
  );
};

export default CollectionSummary;

export const trafficData = [
  {
    id: 1,
    name: "Showroom",
    amount: "213",
    cash: "3420",
    online: "329",
    total: "329",
  },
  {
    id: 2,
    name: "App",
    amount: "213",
    cash: "3420",
    online: "329",
    total: "329",
  },
  {
    id: 3,
    name: "Collection",
    amount: "213",
    cash: "3420",
    online: "329",
    total: "329",
  },
  {
    id: 4,
    name: "Marketing",
    amount: "213",
    cash: "3420",
    online: "329",
    total: "329",
  },
];
