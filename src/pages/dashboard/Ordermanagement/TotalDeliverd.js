import React from "react";
import { useNavigate } from "react-router-dom";
import Boxcard from "../../../components/card/boxcard";

const TotalDeliverd = (props) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/dashboard/ordermanagement/reports/total_deliverd");
  };
  return (
    <div className="d-flex justify-content-center">
      <Boxcard
        title="This Month Deliverd"
        value={props?.totaldeliverd}
        onValueClick={handleNavigate}
        color="#00CCFF"
      />
    </div>
  );
};

export default TotalDeliverd;
