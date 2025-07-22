import React from "react";
import { useNavigate } from "react-router-dom";
import Boxcard from "../../../components/card/boxcard";

const ThisWeekDelivery = (props) => {
  const navigate = useNavigate();
  const handleValueClick = () => {
    navigate("/dashboard/ordermanagement/reports/this_week_delivery");
  };
  return (
    <div className="d-flex justify-content-center">
      <Boxcard
        title="This Week Delivery"
        value={props?.thisweekdelivery}
        color="#BF00FF"
        onValueClick={handleValueClick}
      />
    </div>
  );
};

export default ThisWeekDelivery;
