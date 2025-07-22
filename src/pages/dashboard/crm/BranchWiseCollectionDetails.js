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
import { useDispatch, useSelector } from "react-redux";
import "./Dashboard.css";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { getBranchWiseCollectionDetails } from "../../../redux/thunks/dashboard";
import { Icon } from "../../../components/Component";
import { formatCurrencyInINR } from "../../../components/common/moneyFormat/moneyFormat";

const BranchWiseCollectionDetails = () => {
  const dispatch = useDispatch();
  const { branchWiseCollectionDetailsList } = useSelector(
    (state) => state.dashboardReducer
  );
  const [days, SetDays] = useState("4");
  useEffect(() => {
    dispatch(getBranchWiseCollectionDetails({ view: days }));
  }, [dispatch, days]);
  console.log(branchWiseCollectionDetailsList);

  return (
    <Card className="shadow-sm border-0">
      <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-primary text-white rounded-top">
        <div className="card-title-group">
          <CardTitle>
            <h6 className="title mb-0">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Branch Wise Collection Details
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
      <div style={{ overflowY: "auto", cursor: "pointer" }}>
        <Table className="mb-0">
          <thead>
            <tr>
              <th>Branch</th>
              <th>Opening Amount</th>
              <th>Opening Weight</th>
              <th>Collection Amount</th>
              <th>Collection Weight</th>

              <th>Closing Amount</th>
              <th>Closing Weight</th>
              <th>Available Amount</th>
              <th>Available Weight</th>
            </tr>
          </thead>
          <tbody>
            {branchWiseCollectionDetailsList?.map((item, idx) => (
              <tr key={idx}>
                <td className="text-left">{item.branchName}</td>
                <td className="text-right text-info">
                  {formatCurrencyInINR(item.opening?.amount)}
                </td>
                <td className="text-right text-info">{item.opening?.weight}</td>
                <td className="text-right text-info">
                  {formatCurrencyInINR(item.collection?.amount)}
                </td>
                <td className="text-right text-info">
                  {item.collection?.weight}
                </td>
                <td className="text-right text-info">
                  {formatCurrencyInINR(item.closing?.amount)}
                </td>
                <td className="text-right text-info">{item.closing?.weight}</td>
                {/* <td className="text-center text-info">{item.opening?.weight}</td>
                <td className="text-center text-info">{item.opening?.weight}</td> */}
                <td className="text-right text-info">
                  {formatCurrencyInINR(item.available?.amount)}
                </td>
                <td className="text-right text-info">
                  {item.available?.weight}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default BranchWiseCollectionDetails;
