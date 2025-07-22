import React, { useEffect, useState } from "react";
// import { Card, CardTitle, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faClipboardList, faUser, faIndianRupeeSign, faWeight, faGift } from "@fortawesome/free-solid-svg-icons";
import { getActiveChits } from "../../../redux/thunks/dashboard";
import { formatCurrencyInINR } from "../../../components/common/moneyFormat/moneyFormat";
import { Icon, PreviewAltCard } from "../../../components/Component";
import { useNavigate } from "react-router";

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faIndianRupeeSign,
  faWeight,
  faGift,
} from "@fortawesome/free-solid-svg-icons";

const TotalCustomers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { activeList } = useSelector((state) => state.dashboardReducer);

  const [days, SetDays] = useState('4');
  useEffect(() => {
    dispatch(getActiveChits({ view: days }));
  }, [dispatch, days]);

  const data = {
    accounts: 45,
    amount: 120000,
    weight: "100g",
    bonus: "₹5000",
  };

  return (
    
    <Card
    className="shadow-sm border-0"
    style={{ cursor: "pointer", maxHeight: "330px", overflowY: "auto" }}
    // onClick={onClick}
  >
    <CardHeader className="bg-secondary text-white py-2 px-3 d-flex justify-content-between align-items-center rounded-top">
      <CardTitle tag="h6" className="mb-0 d-flex align-items-center">
        <FontAwesomeIcon icon={faUser} className="me-2" />
        Active Chits
      </CardTitle>
    </CardHeader>
    <CardBody className="py-2 px-3">
      <ListGroup flush>
        <ListGroupItem className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
            <span>No of Accounts</span>
          </div>
          <strong>{data.accounts ?? "-"}</strong>
        </ListGroupItem>
        <ListGroupItem className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon
              icon={faIndianRupeeSign}
              className="me-2 text-success"
            />
            <span>Amount</span>
          </div>
          <strong>{formatCurrencyInINR(data.amount)}</strong>
        </ListGroupItem>
        <ListGroupItem className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faWeight} className="me-2 text-info" />
            <span>Weight</span>
          </div>
          <strong>{data.weight ?? "-"}</strong>
        </ListGroupItem>
        <ListGroupItem className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faGift} className="me-2 text-warning" />
            <span>Bonus</span>
          </div>
          <strong>{data.bonus ?? "-"}</strong>
        </ListGroupItem>
      </ListGroup>
    </CardBody>
  </Card>
  );
};

export default TotalCustomers;
