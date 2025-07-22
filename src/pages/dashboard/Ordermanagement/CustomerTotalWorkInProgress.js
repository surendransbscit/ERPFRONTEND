import React from "react";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Boxcard from "../../../components/card/boxcard";

const CustomerTotalWorkInProgress = (props) => {
  const navigate = useNavigate();
  const handleValueClick = () => {
    navigate("/dashboard/ordermanagement/reports/customer_total_work_progress");
  };
  return (
    <div className="d-flex justify-content-center">
      <Boxcard
        title="Work In Progress"
        value={props?.customertotalworkinprogress}
        percentage="40"
        color="#9B59B6"
        icon={faClipboardList}
        onValueClick={handleValueClick}
      />
    </div>
  );
};

export default CustomerTotalWorkInProgress;
