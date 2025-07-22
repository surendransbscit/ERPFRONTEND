import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Card, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import { Icon } from "../../../components/Component";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentThrough } from "../../../redux/thunks/dashboard";

const PaymentsThrough = () => {
  const [days, SetDays] = useState();
  const dispatch = useDispatch();
  const { paymentThroughList } = useSelector((state) => state.dashboardReducer);

  useEffect(() => {
    dispatch(getPaymentThrough({ days: days }));
  }, [dispatch, days]);

  return (
    <div>
      <Card className="card-full overflow-hidden">
        <div className="nk-ecwg nk-ecwg4 h-100">
          <div className="card-inner flex-grow-1">
            <div className="card-title-group mb-4">
              <div className="card-title">
                <h6 className="title">Payment Through</h6>
              </div>
              <div className="card-tools">
                <UncontrolledDropdown>
                  <DropdownToggle
                    tag="a"
                    href="#toggle"
                    onClick={(ev) => ev.preventDefault()}
                    className="dropdown-toggle btn btn-icon btn-trigger"
                  >
                    <Icon name="more-h" />
                  </DropdownToggle>
                  <DropdownMenu end className="dropdown-menu-sm">
                    <ul className="link-list-opt no-bdr">
                      <li className={days === 7 ? "active" : ""}>
                        <DropdownItem
                          tag="a"
                          href="#dropdown"
                          onClick={(ev) => {
                            ev.preventDefault();
                            SetDays(7);
                          }}
                        >
                          <span>7 Days</span>
                        </DropdownItem>
                      </li>
                      <li className={days === 15 ? "active" : ""}>
                        <DropdownItem
                          tag="a"
                          href="#dropdown"
                          onClick={(ev) => {
                            ev.preventDefault();
                            SetDays(15);
                          }}
                        >
                          <span>15 days</span>
                        </DropdownItem>
                      </li>
                      <li className={days === 30 ? "active" : ""}>
                        <DropdownItem
                          tag="a"
                          href="#dropdown"
                          onClick={(ev) => {
                            ev.preventDefault();
                            SetDays(30);
                          }}
                        >
                          <span>30 days</span>
                        </DropdownItem>
                      </li>
                    </ul>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </div>
            {paymentThroughList?.length > 0 ? (
              <div className="data-group">
                <div className="nk-ecwg4-ck">
                  <TrafficSourcesChart state={paymentThroughList} />
                </div>
                <ul className="nk-ecwg4-legends">
                  {paymentThroughList?.map((item) => {
                    return (
                      <li>
                        <div className="title">
                          <span className="dot dot-lg sq" style={{ background: item?.colour }}></span>
                          <span>{item?.mode_name}</span>
                        </div>
                        <div className="amount amount-xs">{item?.amount}</div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <h4>No records found</h4>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentsThrough;

export const TrafficSourcesChart = ({ state }) => {
  const [data, setData] = useState();
  useEffect(() => {
    setData(state);
  }, [state]);
  return (
    <Doughnut
      data={{
        labels: data?.map((obj) => {
          let container = 0;
          container = obj.mode_name;
          return container;
        }),
        dataUnit: "People",
        legend: false,
        datasets: [
          {
            borderColor: "#fff",
            backgroundColor: data?.map((obj) => {
              let container = 0;
              container = obj.colour;
              return container;
            }),
            data: data?.map((obj) => {
              let container = 0;
              container = obj.amount;
              return container;
            }),
          },
        ],
      }}
      options={{
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            displayColors: false,
            backgroundColor: "#1c2b46",
            titleFont: {
              size: "13px",
            },
            titleColor: "#fff",
            titleMarginBottom: 6,
            bodyColor: "#fff",
            bodyFont: {
              size: "12px",
            },
            bodySpacing: 4,
            padding: 10,
            footerMarginTop: 0,
            callbacks: {
              label: function (context) {
                return context.parsed.y;
              },
            },
          },
        },
        rotation: 1,
        cutoutPercentage: 40,
        maintainAspectRatio: false,
      }}
    />
  );
};
