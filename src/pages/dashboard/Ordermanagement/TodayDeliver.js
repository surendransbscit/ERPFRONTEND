import React from "react";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Boxcard from "../../../components/card/boxcard";

const TodayDeliver = (props) => {
  const navigate = useNavigate();
  const handleValueClick = () => {
    navigate("/dashboard/ordermanagement/reports/today_delivery");
  };
  return (
    <div className="d-flex justify-content-center">
      <Boxcard
        title="Today Delivered"
        value={props?.Todaydeliver}
        percentage="40"
        color="#20C997"
        icon={faClipboardList}
        onValueClick={handleValueClick}
      />
    </div>
  );
};

export default TodayDeliver;
