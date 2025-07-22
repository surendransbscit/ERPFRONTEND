import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Card, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import { Icon } from "../../../components/Component";
import { getSchemeWiseClosed } from "../../../redux/thunks/dashboard";
import { useDispatch, useSelector } from "react-redux";

const SchemeWiseClosed = () => {
  const [days, SetDays] = useState();
  const dispatch = useDispatch();
  const { schemeWiseClosedList } = useSelector((state) => state.dashboardReducer);

  const colours = [
    { id: 5, colour: "#b643ff" },
    { id: 3, colour: "#b5acff" },
    { id: 7, colour: "#f5db7b" },
    { id: 4, colour: "#b4eeff" },
    { id: 8, colour: "#e5acff" },
    { id: 9, colour: "#f5eb7b" },
    { id: 6, colour: "#9cabff" },
    { id: 2, colour: "#ffa9ce" },
    { id: 10, colour: "#b8acff" },
  ];

  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  };

  const shuffledColours = shuffle([...colours]);

  const closedData = schemeWiseClosedList?.map((obj, idx) => {
    const container = {};
    container.name = obj.name;
    container.count = obj.count;
    container.colour = shuffledColours[idx].colour; // Assign a unique color
    return container;
  });

  useEffect(() => {
    dispatch(getSchemeWiseClosed({ days: days }));
  }, [dispatch, days]);

  return (
    <div>
      <Card className="card-full overflow-hidden">
        <div className="nk-ecwg nk-ecwg4 h-100">
          <div className="card-inner flex-grow-1">
            <div className="card-title-group mb-4">
              <div className="card-title">
                <h6 className="title"> Scheme Wise Closed</h6>
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
            {closedData?.length > 0 ? (
              <div className="data-group">
                <div className="nk-ecwg4-ck">
                  <TrafficSourcesChart state={closedData} />
                </div>
                <ul className="nk-ecwg4-legends">
                  {closedData?.map((item) => {
                    return (
                      <li>
                        <div className="title">
                          <span className="dot dot-lg sq" style={{ background: item?.colour }}></span>
                          <span>{item?.name}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <h4>No record found</h4>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SchemeWiseClosed;

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
          container = obj.name;
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
              container = obj.count;
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
