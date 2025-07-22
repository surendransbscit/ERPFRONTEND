import React from "react";
import { useNavigate } from "react-router-dom";
import Boxcard from "../../../components/card/boxcard";

const OverDueOrderSupplier = (props) => {
  const navigate = useNavigate();
  const handleValueClick = () => {
    navigate("/dashboard/ordermanagement/reports/over_due_order_supplier");
  };
  return (
    <div className="d-flex justify-content-center">
      <Boxcard
        title="Over Due Order Supplier"
        value={props?.overdueordersupplier}
        onValueClick={handleValueClick}
        color="#FFD700"
      />
    </div>
  );
};

export default OverDueOrderSupplier;
