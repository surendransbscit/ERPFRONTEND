import React, { useEffect, useState } from "react";
import { Card, CardTitle, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { faClipboardList, faMoneyCheck, faChartLine, faBoxOpen, faTag } from "@fortawesome/free-solid-svg-icons";
import { getPaymentSummary } from "../../../redux/thunks/dashboard";
import { formatCurrencyInINR } from "../../../components/common/moneyFormat/moneyFormat";
import { Icon, PreviewAltCard } from "../../../components/Component";
import { useNavigate } from "react-router";

const PaymentSummary = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { paymentSummary } = useSelector((state) => state.dashboardReducer);
  const [days, SetDays] = useState('4');
  useEffect(() => {
    dispatch(getPaymentSummary({ view: days }));
  }, [dispatch, days]);

  return (
    <Card className="h-100 shadow-sm border-0">
      <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-info text-white rounded-top">
        <div className="card-title-group">
          <CardTitle>
            <h6 className="title mb-0">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Payment
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
      <div style={{ maxHeight: "300px", overflowY: "auto",cursor:"pointer" }}
        onClick={() => {
          navigate(
            {
              pathname: `${process.env?.PUBLIC_URL}/crm/dashboard/reports/payment`,
            },
            {
              state: {
                days: 1,
              },
            }
          );
        }}
      >
        <div className="card-inner p-2">
          <ul className="nk-store-statistics list-unstyled">

            <li className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faMoneyCheck} className="me-2 text-primary" style={{ fontSize: "1.2rem" }} />
                <span>Total Schemes</span>
              </div>
              <span className="fw-bold">{paymentSummary?.total_schemes}</span>
            </li>

            <li className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faChartLine} className="me-2 text-success" style={{ fontSize: "1.2rem" }} />
                <span>Amount</span>
              </div>
              <span className="fw-bold">{formatCurrencyInINR(paymentSummary?.amount)}</span>
            </li>

            <li className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faBoxOpen} className="me-2 text-warning" style={{ fontSize: "1.2rem" }} />
                <span>Rate</span>
              </div>
              <span className="fw-bold">{paymentSummary?.rate}</span>
            </li>

            <li className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faTag} className="me-2 text-danger" style={{ fontSize: "1.2rem" }} />
                <span>Coverup Positions</span>
              </div>
              <span className="fw-bold">{parseFloat(paymentSummary?.coverup).toFixed(2)}</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default PaymentSummary;
