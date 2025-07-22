import React from "react";
import { useNavigate } from "react-router-dom";
import Boxcard from "../../../components/card/boxcard";

const NextWeekDelivery = (props) => {
  const navigate = useNavigate();
  const handleValueClick = () => {
    navigate("/dashboard/ordermanagement/reports/next_week_delivery");
  };
  return (
    <div className="d-flex justify-content-center">
      <Boxcard
        title="Next Week Delivery"
        value={props?.nextweekdelivery}
        color="#32CD32"
        onValueClick={handleValueClick}
      />
    </div>
  );
};

export default NextWeekDelivery;
