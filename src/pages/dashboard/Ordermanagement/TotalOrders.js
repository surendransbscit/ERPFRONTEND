import React from "react";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Boxcard from "../../../components/card/boxcard";

const TotalOrders = (props) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/dashboard/ordermanagement/reports/total_orders");
  };
  return (
    <div className="d-flex justify-content-center">
      <Boxcard
        title="Total Ordered"
        value={props?.totalOrders}
        onValueClick={handleNavigate}
        color="#FF6633"
        icon={faClipboardList}
      />
    </div>
  );
};

export default TotalOrders;
