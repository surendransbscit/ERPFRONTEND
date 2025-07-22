import React from "react";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Boxcard from "../../../components/card/boxcard";

const TodayRecived = (props) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/dashboard/ordermanagement/reports/today_received");
  };
  return (
    <div className="d-flex justify-content-center">
      <Boxcard
        title="Today Recived"
        value={props?.todayrecived}
        onValueClick={handleNavigate}
        color="#7158E2"
        icon={faClipboardList}
      />
    </div>
  );
};

export default TodayRecived;
