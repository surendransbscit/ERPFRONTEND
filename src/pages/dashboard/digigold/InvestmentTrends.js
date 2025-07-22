import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { LineChart, PieChart, BarChart } from "@mui/x-charts";
import { useDispatch, useSelector } from "react-redux";
import {
  getClosedAccountsSummary,
  getMonthlywiseMetalWeight,
} from "../../../redux/thunks/digiGoldDashboard";
import { Icon } from "../../../components/Component";

const InvestmentTrends = () => {
  const dispatch = useDispatch();
  const { monthwiseMetalWeight, closedAccountsSummary } = useSelector(
    (state) => state.digigoldDashboardReducer
  );
  // // Dummy line chart data
  // const dataset = Array.from({ length: 30 }, (_, i) => ({
  //   time: i,
  //   DigiGold: 10 + Math.sin(i) * 5 + (i % 3),
  //   TotalSilver: 7 + Math.cos(i) * 2,
  // }));

  // Pie chart data
  const pieData = [
    { id: 0, value: 70, label: "Redeemed After Maturity" },
    { id: 1, value: 30, label: "After" },
    { id: 2, value: 50, label: "After" },
  ];
  const startYear = 2025;
  const currentYear = new Date().getFullYear();

  const [yearOptions, setYearOptions] = useState([]);

  const [days, SetDays] = useState(currentYear);

  useEffect(() => {
    const tempYears = [];
    for (let year = currentYear; year >= startYear; year--) {
      tempYears.push({ label: year, value: year });
    }
    setYearOptions(tempYears);
  }, [currentYear, startYear]);

  useEffect(() => {
    dispatch(getMonthlywiseMetalWeight({ year: days }));
  }, [dispatch, days]);

  useEffect(() => {
    dispatch(getClosedAccountsSummary());
  }, [dispatch]);

  return (
    <Row className="g-3">
      <Col md={8}>
        {/* <Card className="shadow-sm border-0 h-100">
          <CardBody>
            <CardTitle tag="h6">Investment Trends</CardTitle>
            <LineChart
              dataset={monthwiseMetalWeight}
              xAxis={[
                { dataKey: "month_name", label: "Month", scaleType: "band" },
              ]}
              series={[
                { dataKey: "total_gold", label: "DigiGold", color: "#002F6C" },
                {
                  dataKey: "total_silver",
                  label: "DigiSilver",
                  color: "#9AA5B1",
                },
              ]}
              height={250}
            />
          </CardBody>
        </Card> */}
        <Card className="shadow-sm border-0 h-100">
          <CardBody>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <CardTitle tag="h6">Monthly Bonus Liability</CardTitle>
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
                  <ul
                    className="link-list-opt no-bdr"
                    style={{
                      maxHeight: "250px",
                      overflowY: "auto",
                      minWidth: "180px",
                    }}
                  >
                    {yearOptions?.map((item, idx) => {
                      return (
                        <li
                          className={days === item?.value ? "active" : ""}
                          key={idx}
                        >
                          <DropdownItem
                            tag="a"
                            href="#dropdown"
                            onClick={(ev) => {
                              ev.preventDefault();
                              SetDays(item?.value);
                            }}
                          >
                            <span>{item?.label}</span>
                          </DropdownItem>
                        </li>
                      );
                    })}
                  </ul>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>

            <LineChart
              dataset={monthwiseMetalWeight}
              xAxis={[
                { dataKey: "month_name", label: "Month", scaleType: "band" },
              ]}
              series={[
                { dataKey: "total_gold", label: "DigiGold", color: "#002F6C" },
                {
                  dataKey: "total_silver",
                  label: "DigiSilver",
                  color: "#9AA5B1",
                },
              ]}
              height={250}
            />
          </CardBody>
        </Card>
      </Col>

      <Col md={4}>
        <Card className="shadow-sm border-0 h-100">
          <CardBody className="d-flex flex-column align-items-center justify-content-center text-center">
            <CardTitle tag="h6">User Benefit Tracking</CardTitle>

            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: closedAccountsSummary?.map((item) => item.label),
                },
              ]}
              series={[
                {
                  data: closedAccountsSummary?.map((item) => item.value),
                  color: closedAccountsSummary?.map((item) => item.color),
                },
              ]}
              width={280}
              height={220}
            />

            <div className="mt-2 small">
              <div>
                <span style={{ color: "#00B0BD" }}>●</span> Redeemed After
                Maturity
              </div>
              <div>
                <span style={{ color: "#9AA5B1" }}>●</span> Redeemed Before
                Maturity
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default InvestmentTrends;
