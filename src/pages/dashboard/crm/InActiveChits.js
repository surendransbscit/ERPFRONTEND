import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardTitle, Table } from "reactstrap";
import "./Dashboard.css";
import { faClipboardList, faUser, faDollarSign, faWeight, faGift } from "@fortawesome/free-solid-svg-icons";
import { getInActiveChits } from "../../../redux/thunks/dashboard";
import { useNavigate } from "react-router-dom";


const InActiveChits = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { inActiveList } = useSelector((state) => state.dashboardReducer);
  useEffect(() => {
    dispatch(getInActiveChits());
  }, [dispatch]);

  const handleRowClick = (item) => {
    navigate(`${process.env?.PUBLIC_URL}/crm/dashboard/reports/inactivechits`, {
      state: {
        days: item.days, 
      },
    });
  };

  
  return (
    <Card className="shadow-sm border-0">
      <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-warning text-white rounded-top">
        <div className="card-title-group">
          <CardTitle>
            <h6 className="title mb-0">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              In Active Chits
            </h6>
          </CardTitle>
        </div>
        <div className="card-tools">
          <button className="btn btn-sm btn-light">View All</button>
        </div>
      </div>
      <div style={{ maxHeight: "190px", overflowY: "auto" }}>
      <Table className="mb-0" style={{ fontSize: "0.75rem", lineHeight: "1" }}>
          <thead>
            <tr>
              <th className="text-left">Scheme</th>
              <th className="text-center">&gt;2 Months</th>
              <th className="text-right">&gt;4 Months</th>
              <th className="text-right">&gt;6 Months</th>
            </tr>
          </thead>
          <tbody>
            {inActiveList?.length > 0 ? (
              <>
                {inActiveList?.map((item, idx) => (
                  <tr key={idx} onClick={() => handleRowClick(item)} style={{ cursor: "pointer" }}>

                    <td className="text-left">{item.scheme_name}</td>
                    <td className="text-center text-info">{item.greater_than_two}</td>
                    <td className="text-center text-warning">{item.greater_than_four}</td>
                    <td className="text-center text-secondary">{item.greater_than_six}</td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  <h4 style={{ marginTop: "10px", marginBottom: "10px" }}>No record found</h4>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

    </Card>
  );
};

export default InActiveChits;

// export const trafficData = [
//   {
//     id: 1,
//     name: "Scheme 1",
//     gtwo: "10",
//     gfour: "20",
//     gsix: "30",
//   },
//   {
//     id: 2,
//     name: "Scheme 2",
//     gtwo: "10",
//     gfour: "20",
//     gsix: "30",
//   },
//   {
//     id: 3,
//     name: "Scheme 3",
//     gtwo: "10",
//     gfour: "20",
//     gsix: "30",
//   },
//   {
//     id: 4,
//     name: "Scheme 4",
//     gtwo: "10",
//     gfour: "20",
//     gsix: "30",
//   },
// ];
