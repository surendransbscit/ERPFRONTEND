import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Card, CardTitle, DropdownItem, DropdownMenu, DropdownToggle, Table, UncontrolledDropdown } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import "./Dashboard.css";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { getRegisterThroughDetails } from "../../../redux/thunks/dashboard";
import { Icon, PreviewAltCard } from "../../../components/Component";
import { useNavigate } from "react-router-dom";

const RegisterThrough = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { registerThroughDetailsList } = useSelector((state) => state.dashboardReducer);
  const [days, SetDays] = useState('4');

  const handleRowClick = (item) => {
    navigate(`${process.env?.PUBLIC_URL}/crm/dashboard/reports/registerthrough`, 
      {
      // state: {
      //   scheme: item.scheme_name, 
      // },
    });
  };

  useEffect(() => {
    dispatch(getRegisterThroughDetails({ view: days }));
  }, [dispatch, days]);

  return (
    <Card className="shadow-sm border-0">
      <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-primary text-white rounded-top">
        <div className="card-title-group">
          <CardTitle>
            <h6 className="title mb-0">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Register Through Details
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
      <div style={{ overflowY: "auto" ,cursor:"pointer"}}>
        <Table className="mb-0">
          <thead>
            <tr>
              <th className="text-left"></th>
              <th className="text-center">This Month</th>
              <th className="text-right">2 Months Above</th>
              <th className="text-right">6 Months Above</th>
              <th className="text-right">1 Year Above</th>
            </tr>
          </thead>
          <tbody>
            {registerThroughDetailsList?.length > 0 ? (
              <>
                {registerThroughDetailsList?.map((item, idx) => (
                  <tr key={idx} onClick={() => handleRowClick(item)} style={{ cursor: "pointer" }}>
                    <td className="text-left">{item.name}</td>
                    <td className="text-center text-info">{item.this_month}</td>
                    <td className="text-center text-warning">{item.two_months_above}</td>
                    <td className="text-center text-warning">{item.six_months_above}</td>
                    <td className="text-center text-warning">{item.one_year_above}</td>
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

export default RegisterThrough;

// export const trafficData = [
//   {
//     id: 1,
//     name: "Mobile App",
//     month: "213",
//     twomonth: "1200000",
//     sixmonth: "100",
//     oneyear: "210",
//   },
//   {
//     id: 2,
//     name: "Web App",
//     month: "213",
//     twomonth: "1200000",
//     sixmonth: "100",
//     oneyear: "210",
//   },
//   {
//     id: 3,
//     name: "Admin",
//     month: "213",
//     twomonth: "1200000",
//     sixmonth: "100",
//     oneyear: "210",
//   },
//   {
//     id: 4,
//     name: "Collection App",
//     month: "213",
//     twomonth: "1200000",
//     sixmonth: "100",
//     oneyear: "210",
//   },
//   {
//     id: 5,
//     name: "Marketing App",
//     month: "213",
//     twomonth: "1200000",
//     sixmonth: "100",
//     oneyear: "210",
//   },
// ];
