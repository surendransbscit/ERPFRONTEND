import React, { useEffect, useState } from "react";
import {
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  DropdownItem,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import { Icon, PreviewAltCard } from "../../../components/Component";
import { useDispatch, useSelector } from "react-redux";
import { getUserJoinedThrough } from "../../../redux/thunks/dashboard";
import { Doughnut } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faDollarSign, faChartPie } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; 

const SessionByDevices = () => {
  const [days, SetDays] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userJoinedThrough } = useSelector((state) => state.dashboardReducer);

  const handleChartClick = () => {
    navigate(`${process.env?.PUBLIC_URL}/crm/dashboard/reports/usersjoinedthrough`, 
    //   {
    //   state: {
    //     days: days,
    //   },
    // }
  );
  };
  

  useEffect(() => {
    dispatch(getUserJoinedThrough({ days: days }));
  }, [dispatch, days]);

  return (
    <React.Fragment>
      <PreviewAltCard className="h-100">
        <div className="card-title-group">
          <div className="card-title card-title-sm">
            <h6 className="title">Users Joined Through</h6>
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
                      <span>15 Days</span>
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
                      <span>30 Days</span>
                    </DropdownItem>
                  </li>
                </ul>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
        {userJoinedThrough?.length > 0 ? (
          <div
          className="d-flex justify-content-between align-items-center my-auto"
          style={{ top: "20px", cursor: "pointer" }}
          onClick={handleChartClick} 
        >
            {/* Align UsersJoinedDoughnut to the left */}
            <div className="device-status-ck" style={{ width: "100px", height: "100px" }}>
              <UsersJoinedDoughnut className="analytics-doughnut" state={userJoinedThrough} />
            </div>

            {/* Align nk-ecwg7-legends to the right */}
            <div className="d-flex flex-column">
              {userJoinedThrough?.map((item) => (
                <ul className="nk-ecwg7-legends" key={item.mode_name}>
                  <li>
                    <div className="title">
                      <span style={{ fontWeight: "800",fontSize:"13px" }}>{item?.mode_name}:</span>&nbsp;&nbsp;&nbsp;
                      <span className="dot dot-lg sq" style={{ top: "-4px", fontWeight: "800" ,fontSize:"13px"}}>
                        {item.count}
                      </span>
                    </div>
                  </li>
                </ul>
              ))}
            </div>
          </div>
        ) : (
          <h4>No record found</h4>
        )}
      </PreviewAltCard>
    </React.Fragment>
  );
};

export default SessionByDevices;

export const UsersJoinedDoughnut = ({ state, className }) => {
  const [data, setData] = useState();
  useEffect(() => {
    setData(state);
  }, [state]);

  return (
    <Doughnut
      className={className}
      data={{
        labels: data?.map((obj) => obj.mode_name),
        datasets: [
          {
            borderColor: "#fff",
            backgroundColor: data?.map((obj) => obj.colour),
            data: data?.map((obj) => obj.count),
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
            backgroundColor: "#eff6ff",
            titleFont: {
              size: "12px",
            },
            titleColor: "#6783b8",
            titleMarginBottom: 6,
            bodyColor: "#9eaecf",
            bodyFont: {
              size: "12px",
            },
            bodySpacing: 4,
            padding: 10,
          },
        },
        rotation: -1.5,
        cutoutPercentage: 75, // Make inner circle larger
        maintainAspectRatio: false,
      }}
      width={150} // Set width
      height={150} // Set height
    />
  );
};
