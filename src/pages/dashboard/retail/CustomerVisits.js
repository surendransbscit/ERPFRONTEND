import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Icon, PreviewAltCard } from "../../../components/Component";
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
import "../crm/Dashboard.css";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { getCustomerVists } from "../../../redux/thunks/retailDashboard";
import { formatCurrencyInINR } from "../../../components/common/moneyFormat/moneyFormat";
import { useNavigate } from "react-router";

const CustomerVisits = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { customerVisitsDashList } = useSelector(
    (state) => state.retailDashboardReducer
  );

  const [days, SetDays] = useState(4);
  useEffect(() => {
    dispatch(getCustomerVists({ view: days }));
  }, [dispatch, days]);

  return (
    <Card className="shadow-sm">
      <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-secondary text-white rounded-top"
      
      >
        <div className="card-title-group">
          <CardTitle>
            <h6 className="title mb-0">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Customer Visits
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
              <th className="text-left">#</th>
              <th className="text-center">Nos</th>
              <th className="text-right">Pcs</th>
              <th className="text-right">Weight</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {customerVisitsDashList?.map((item) => (
              <tr key={item.id} 
              style={{
                cursor:"pointer"
              }}
              onClick={() => {
                navigate(
                  {
                    pathname: `${process.env?.PUBLIC_URL}/retail/dashboard/reports/customervisits`,
                  },
                  {
                    state: {
                      days: days,
                      type : item?.type,
                    },
                  }
                );
              }}
              >
                <td className="text-left">{item.name}</td>
                <td className="text-center text-info">{item.cust_count}</td>
                <td className="text-center text-warning">{item.pieces}</td>
                <td className="text-right text-warning">
                  {parseFloat(item.weight).toFixed(3)}
                </td>
                <td className="text-right text-warning">
                  {formatCurrencyInINR(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default CustomerVisits;

export const trafficData = [
  {
    id: 1,
    name: "New",
    nos: "213",
    per: "3420",
    weight: "39",
    amount: "329",
  },
  {
    id: 2,
    name: "Chit",
    nos: "213",
    per: "3420",
    weight: "39",
    amount: "329",
  },
  {
    id: 3,
    name: "Non Chit",
    nos: "213",
    per: "3420",
    weight: "39",
    amount: "329",
  },
];
