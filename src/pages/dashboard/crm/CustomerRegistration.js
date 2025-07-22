import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerDetails } from "../../../redux/thunks/dashboard";
import { Card, CardTitle, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { Icon } from "../../../components/Component";
import { useNavigate } from "react-router-dom";

const CustomerRegistration = () => {
  const [months, SetMonths] = useState([]);
  const navigate = useNavigate();
  const [customers, SetCustomers] = useState([]);

  const dispatch = useDispatch();
  const { customerDetailsList } = useSelector((state) => state.dashboardReducer);
  const handleChartClick = () => {
    navigate(`${process.env?.PUBLIC_URL}/crm/dashboard/reports/customer_details`);
  };

  useEffect(() => {
    dispatch(getCustomerDetails());
  }, [dispatch]);
  const [days, SetDays] = useState('4');

  useEffect(() => {
    if (customerDetailsList) {
      SetMonths(customerDetailsList.months || []);
      SetCustomers(customerDetailsList.registered_customers || []);
    }
  }, [customerDetailsList]);

  return (
    <>
      <Card>
        <div className="card-inner border-bottom p-1 d-flex justify-content-between align-items-center bg-info text-white rounded-top">
          <div className="card-title-group">
            <CardTitle>
              <h6 className="title mb-0">
                Customer Details
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
                    <li className={days == "2" ? "active" : ""}>
                      <DropdownItem
                        tag="a"
                        href="#dropdown"
                        onClick={(ev) => {
                          ev.preventDefault();
                          SetDays("2");
                        }}
                      >
                        <span>2024</span>
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
                        <span>2023</span>
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
                        <span>2022</span>
                      </DropdownItem>
                    </li>
                  </ul>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
        </div>
        <LineChart
      width={500}
      height={240}
      onClick={handleChartClick}
      series={[{ data: customers, label: "Customer", yAxisId: "leftAxisId" }]}
      xAxis={[{ scaleType: "point", data: months }]}
      yAxis={[{ id: "leftAxisId" }, { id: "rightAxisId" }]}
      rightAxis="rightAxisId"
        />
      </Card>
    </>
  );
};

export default CustomerRegistration;
