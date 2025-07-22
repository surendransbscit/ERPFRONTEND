import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import StatCard from "./StatCard";
import {
  faUser,
  faRupeeSign,
  faWallet,
  faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { formatCurrencyInINR } from "../../../components/common/moneyFormat/moneyFormat";
import { Icon } from "../../../components/Component";
import { getDashboardSummary } from "../../../redux/thunks/digiGoldDashboard";

const statsData = [
  {
    icon: faUser,
    iconBg: "#3b82f6",
    label: "Users Enrolled",
    value: "45,2 K",
    key: "enrolled_users",
  },
  {
    label: "Total Investment",
    icon: faIndianRupeeSign,
    value: "₹ 12.8 Cr",
    // iconLabel: "I",
    iconBg: "#800080",
    isMoneyFormat: true,
    key: "total_investment",
  },
  {
    iconLabel: "G",
    iconBg: "#fbbf24",
    label: "Total Gold (g)",
    value: "320,5 K",
    key: "total_gold",
  },
  {
    iconLabel: "S",
    iconBg: "#6b7280",
    label: "Total Silver (g)",
    value: "110,3 K",
    key: "total_silver",
  },
  {
    icon: faWallet,
    iconBg: "#0ea5e9",
    label: "Accounts",
    value: "5,870",
    key: "total_accounts",
  },

  // {
  //   iconLabel: "P",
  //   iconBg: "#0ea5e9",
  //   label: "Payments",
  //   value: "5,870",
  //   key: "total_accounts",
  // },
];

const UserCards = () => {
  const dispatch = useDispatch();
  const [days, SetDays] = useState("4");
  const { dashboardSummary } = useSelector(
    (state) => state.digigoldDashboardReducer
  );

  useEffect(() => {
    dispatch(getDashboardSummary({ days: days }));
  }, [dispatch, days]);

  return (
    <>
      {statsData?.map((stat, index) => (
        <>
          <Col xl="2" lg="3" md="4" sm="6" xs="12" key={index}>
            <StatCard
              icon={stat?.icon}
              iconLabel={stat?.iconLabel}
              iconBg={stat?.iconBg}
              label={stat?.label}
              value={
                stat?.isMoneyFormat
                  ? formatCurrencyInINR(dashboardSummary?.data?.[stat?.key])
                  : dashboardSummary?.data?.[stat?.key]
              }
            />
          </Col>
        </>
      ))}
      {/* <Col xl="2" lg="3" md="4" sm="6" xs="12">
        <Card className="shadow-sm border-0" style={{ maxWidth: "180px" }}>
         
          <UncontrolledDropdown>
            <DropdownToggle
              tag="a"
              href="#toggle"
              onClick={(ev) => ev.preventDefault()}
              className="dropdown-toggle btn btn-icon btn-trigger"
            >
              <Icon name="more-h text-black" />
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
         
          <CardBody className="d-flex align-items-center py-3 px-3">
            <div className="me-3">
              <div
                className={`text-white rounded-circle d-flex align-items-center justify-content-center`}
                style={{
                  backgroundColor: "#0ea5e9",
                  width: 30,
                  height: 30,
                  fontSize: 14,
                }}
              >
              
                <strong>{"P"}</strong>
              </div>
            </div>
            <div>
              <div className="text-muted small">{"Payments"}</div>
              <div className="fw-bold fs-5">{"7000"}</div>
            </div>
          </CardBody>
        </Card>
      </Col> */}

      <Col xl="2" lg="3" md="4" sm="6" xs="12">
        <Card className="shadow-sm border-0 h-100">
          <div className="d-flex justify-content-end px-2 ">
            <UncontrolledDropdown>
              <DropdownToggle
                tag="a"
                href="#toggle"
                onClick={(ev) => ev.preventDefault()}
                className="dropdown-toggle btn btn-icon btn-trigger"
              >
                <Icon name="more-h text-black" />
              </DropdownToggle>
              <DropdownMenu end className="dropdown-menu-sm">
                <ul className="link-list-opt no-bdr">
                  {[
                    { label: "Today", key: "4" },
                    { label: "Yesterday", key: "5" },
                    { label: "This Week", key: "2" },
                    { label: "This Month", key: "1" },
                    { label: "Last Month", key: "3" },
                  ].map((item) => (
                    <li
                      className={days === item.key ? "active" : ""}
                      key={item.key}
                    >
                      <DropdownItem
                        tag="a"
                        href="#dropdown"
                        onClick={(ev) => {
                          ev.preventDefault();
                          SetDays(item.key);
                        }}
                      >
                        <span>{item.label}</span>
                      </DropdownItem>
                    </li>
                  ))}
                </ul>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
          <CardBody className="d-flex align-items-center pt-0 px-3 ">
            <div className="me-3">
              <div
                className="text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "#0ea5e9",
                  width: 32,
                  height: 32,
                  fontSize: 14,
                }}
              >
                <strong>P</strong>
              </div>
            </div>
            <div>
              <div className="text-muted small">Payments</div>
              <div className="fw-bold fs-5">
                {formatCurrencyInINR(
                  dashboardSummary?.data?.total_investment_filtered
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default UserCards;
