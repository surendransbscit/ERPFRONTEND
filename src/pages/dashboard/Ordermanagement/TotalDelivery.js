import React from "react";
import { useNavigate } from "react-router-dom";
import Boxcard from "../../../components/card/boxcard";

const TotalDelivery = (props) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/dashboard/ordermanagement/reports/customer_total_delivery");
  };
  return (
    <div className="d-flex justify-content-center">
      <Boxcard
        title="Yet to Delivery"
        value={props?.totaldelivery}
        onValueClick={handleNavigate}
        color="#1ABC9C"
      />
    </div>
  );
};

export default TotalDelivery;
