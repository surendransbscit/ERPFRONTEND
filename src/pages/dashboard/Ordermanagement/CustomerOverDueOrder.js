import React from "react";
import { useNavigate } from "react-router-dom";
// import StatCard from "../../../components/card/StatCard";
import Boxcard from "../../../components/card/boxcard";

const CustomerOverDueOrder = (props) => {
  const navigate = useNavigate();
  const handleValueClick = () => {
    navigate("/dashboard/ordermanagement/reports/customer_over_due_order");
  };
  return (
    <div className="d-flex justify-content-center">
      <Boxcard
        title="Customer Over Due Order"
        value={props?.customeroverdueorder}
        onValueClick={handleValueClick}
        color="#DC143C"
      />
    </div>
  );
};

export default CustomerOverDueOrder;
