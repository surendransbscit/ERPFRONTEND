import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { Card, CardTitle, Table } from "reactstrap";
import "./Dashboard.css";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { getChitClosingDetails } from "../../../redux/thunks/dashboard";
import { useNavigate } from "react-router-dom";

const ChitClosing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chitClosingDetailsList } = useSelector((state) => state.dashboardReducer);

  const handleRowClick = (item) => {
    navigate(`${process.env?.PUBLIC_URL}/crm/dashboard/reports/chitclosing`, {
      state: {
        scheme: item.scheme_name, 
      },
    });
  };

  useEffect(() => {
    dispatch(getChitClosingDetails());
  }, [dispatch]);

  // console.log(chitClosingDetailsList);

  return (
    <Card className="shadow-sm border-0">
      <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-primary text-white rounded-top">
        <div className="card-title-group">
          <CardTitle>
            <h6 className="title mb-0">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Chit Closing Details
            </h6>
          </CardTitle>
        </div>
        <div className="card-tools">
          <button className="btn btn-sm btn-light">View All</button>
        </div>
      </div>
      <div style={{  overflowY: "auto" }}>
      <Table className="mb-0">
        <thead>
          <tr>
            <th className="text-left"></th>
            <th className="text-center">Account</th>
            <th className="text-center">Amount</th>
            <th className="text-center">Weight</th>
          </tr>
        </thead>
        <tbody>
          {chitClosingDetailsList?.length > 0 ? (
            <>
              {chitClosingDetailsList?.map((item, idx) => (
                 <tr key={idx} onClick={() => handleRowClick(item)} style={{ cursor: "pointer" }}>
                  <td className="text-left">{item.name}</td>
                  <td className="text-center text-info">{item.account}</td>
                  <td className="text-center text-warning">{item.benefit}</td>
                  <td className="text-center text-warning">{item.weight}</td>
                </tr>
              ))}
            </>
          ) : (
            <tr>
              <td></td>
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

export default ChitClosing;

// export const trafficData = [
//   {
//     id: 1,
//     name: "Matured",
//     amount: "213",
//     benefit: "3420",
//     weight: "329",
//     weightbenefit: "329",
//   },
//   {
//     id: 2,
//     name: "One Month",
//     amount: "600000",
//     benefit: "3420",
//     weight: "329",
//     weightbenefit: "329",
//   },
//   {
//     id: 3,
//     name: "Two Months",
//     amount: "400",
//     benefit: "60000",
//     weight: "329",
//     weightbenefit: "329",
//   },
//   {
//     id: 4,
//     name: "Renewals Pending",
//     amount: "400",
//     benefit: "3420",
//     weight: "500",
//     weightbenefit: "329",
//   },
// ];
