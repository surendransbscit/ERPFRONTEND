import React from "react";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Boxcard from "../../../components/card/boxcard";

const CustomersYetToApprove = (props) => {
  const navigate = useNavigate();
  const handleValueClick = () => {
    navigate(`${process.env.PUBLIC_URL}/master/customer/approval`);
  };
  return (
    <div
      className="d-flex justify-content-center"
      style={{ cursor: "pointer" }}
      onClick={handleValueClick}
    >
      <Boxcard
        title="Customers Yet To Approve"
        value={props?.yetToApprove}
        color="#007BFF"
        onValueClick={handleValueClick}
        icon={faClipboardList}
      />
    </div>
  );
};

export default CustomersYetToApprove;
