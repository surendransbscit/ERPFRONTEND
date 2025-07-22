import React from "react";
import { Card, CardBody } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StatCard = ({ icon, iconLabel, iconBg, label, value }) => {
  return (
    <Card className="shadow-sm border-0" style={{ maxWidth: "180px" }}>
      <CardBody className="d-flex align-items-center py-3 px-3">
        <div className="me-3">
          <div
            className={`text-white rounded-circle d-flex align-items-center justify-content-center`}
            style={{
              backgroundColor: iconBg,
              width: 30,
              height: 30,
              fontSize: 14,
            }}
          >
            {icon ? (
              <FontAwesomeIcon icon={icon} size="sm" />
            ) : (
              <strong>{iconLabel}</strong>
            )}
          </div>
        </div>
        <div>
          <div className="text-muted small">{label}</div>
          <div className="fw-bold fs-5">{value}</div>
        </div>
      </CardBody>
    </Card>
  );
};

export default StatCard;
// import React from "react";
// import { Card } from "reactstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// const StatCard = ({ title, value, color, icon, onValueClick }) => {
//   return (
//     <Card
//       className="shadow-sm border-0 text-white"
//       style={{
//         backgroundColor: color,
//         borderRadius: "12px",
//         height: "160px",
//         width: "300px",
//       }}
//     >
//       <div className="card-body d-flex flex-column justify-content-between h-100">
//         <div className="d-flex justify-content-between">
//           <h6 className="mb-2">{title}</h6>
//         </div>

//         <div className="d-flex justify-content-between align-items-center">
//           <h3
//             className="mb-0"
//             style={{ cursor: "pointer" }}
//             onClick={onValueClick}
//           >
//             {value}
//           </h3>
//           <FontAwesomeIcon icon={icon} size="2x" />
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default StatCard;
