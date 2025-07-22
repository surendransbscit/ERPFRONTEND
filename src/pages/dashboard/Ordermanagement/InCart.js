import React from "react";
import { useNavigate } from "react-router";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import Boxcard from "../../../components/card/boxcard";

const InCart = (props) => {
  const navigate = useNavigate();
  const handleValueClick = () => {
    navigate(`${process.env.PUBLIC_URL}/dashboard/ordermanagement/reports/customer_cart`);
  };
  return (
    <div
      className="d-flex justify-content-center"
      style={{ cursor: "pointer" }}
      onClick={handleValueClick}
    >
      <Boxcard
        title="In cart"
        value={props?.customerCartItemCount}
        color="#007BFF"
        onValueClick={handleValueClick}
        icon={faClipboardList}
      />
    </div>
  );
};

export default InCart;
