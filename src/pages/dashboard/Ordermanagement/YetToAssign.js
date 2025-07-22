import React from "react";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Boxcard from "../../../components/card/boxcard";

const YetToAssign = (props) => {
  const navigate = useNavigate();
  const handleValueClick = () => {
    navigate("/dashboard/ordermanagement/reports/yet_to_assign");
  };
  return (
    <div className="d-flex justify-content-center">
      <Boxcard
        title="Yet To Assign"
        value={props?.yettoassign}
        color="#007BFF"
        onValueClick={handleValueClick}
        icon={faClipboardList}
      />
    </div>
  );
};

export default YetToAssign;
