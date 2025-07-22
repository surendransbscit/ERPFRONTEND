// export default StatCard;
import React from "react";
import { Card } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Boxcard = ({ title, value, color, icon, onValueClick }) => {
  return (
    <Card
      className="shadow-sm border-0 text-white"
      style={{
        backgroundColor: color,
        borderRadius: "12px",
        height: "160px",
        width: "300px",
      }}
    >
      <div className="card-body d-flex flex-column justify-content-between h-100">
        <div className="d-flex justify-content-between">
          <h6 className="mb-2">{title}</h6>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <h3
            className="mb-0"
            style={{ cursor: "pointer" }}
            onClick={onValueClick}
          >
            {value}
          </h3>
          <FontAwesomeIcon icon={icon} size="2x" />
        </div>
      </div>
    </Card>
  );
};

export default Boxcard;
