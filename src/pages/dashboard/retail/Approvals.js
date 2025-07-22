import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import secureLocalStorage from "react-secure-storage";
import { getAccessBranches } from "../../../redux/thunks/coreComponent";
import { getStockApproval } from "../../../redux/thunks/retailDashboard";
import { Icon } from "../../../components/Component";

const Approvals = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [branches, SetBranches] = useState([]);
  const { accessBranches } = useSelector((state) => state.coreCompReducer);
  const loginpref = secureLocalStorage.getItem("pref")?.pref;

  useEffect(() => {
    dispatch(getAccessBranches(loginpref));
  }, [dispatch, loginpref]);

  useEffect(() => {
    const branchNames = accessBranches?.map((item) => item.id_branch); //[1,2,3]
    SetBranches(branchNames);
  }, [accessBranches]);
  const { stockApprovalDashList } = useSelector(
    (state) => state.retailDashboardReducer
  );

  const [days, SetDays] = useState("4");
  useEffect(() => {
    dispatch(getStockApproval({ view: days, branch: branches }));
  }, [dispatch, days, branches, accessBranches]);

  return (
    <Card className="shadow-sm">
      <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-info text-white rounded-top">
        <div className="card-title-group">
          <CardTitle>
            <h6 className="title mb-0">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Approvals
            </h6>
          </CardTitle>
        </div>

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

      {/* Wrapping the table in a scrollable div */}
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        <Table>
          <thead>
            <tr>
              <th className="text-left">#</th>
              <th className="text-center">Requested</th>
              <th className="text-right">Completed</th>
              <th className="text-right">Rejected</th>
              <th className="text-right">Pending</th>
            </tr>
          </thead>
          <tbody>
            {stockApprovalDashList?.map((item) => (
              <tr key={item.id} onClick={() => {
                navigate(
                  {
                    pathname: `${process.env?.PUBLIC_URL}/retail/dashboard/reports/stock_approval`,
                  },
                  {
                    state: {
                      days: days,
                      type: item.type
                    },
                  }
                );
              }} >
                <td className="text-left">{item.label}</td>
                <td className="text-center text-info">{item.request}</td>
                <td className="text-center text-warning">{item.completed}</td>
                <td className="text-center text-warning">{item.rejected}</td>
                <td className="text-center text-warning">{item.pending}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default Approvals;

export const trafficData = [
  {
    id: 1,
    name: "BT Approval",
    req: "0",
    can: "1",
    pen: "0",
  },
  {
    id: 2,
    name: "BT Download",
    req: "0",
    can: "1",
    pen: "0",
  },
  {
    id: 3,
    name: "BT Discount",
    req: "0",
    can: "1",
    pen: "0",
  },
];
