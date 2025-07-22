import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Card, CardTitle, Table } from "reactstrap";
import "../crm/Dashboard.css";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { getKarigarOrders } from "../../../redux/thunks/retailDashboard";
import { useNavigate } from "react-router";

const KarigarOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { karigarOrderList } = useSelector((state) => state.retailDashboardReducer);


  useEffect(() => {
    dispatch(getKarigarOrders());
  }, [dispatch]);
  return (
    <Card className="shadow-sm">
      <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-info text-white rounded-top">
        <div className="card-title-group">
          <CardTitle>
            <h6 className="title mb-0">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Karigar Orders
            </h6>
          </CardTitle>
        </div>
      </div>

      <Table>
        <thead>
          <tr>
            <th className="text-left">#</th>
            <th className="text-right">Qty</th>
            <th className="text-right">Weight</th>
          </tr>
        </thead>
        <tbody>
          {karigarOrderList?.map((item) => (
            <tr key={item.id} onClick={() => {
              navigate(
                {
                  pathname: `${process.env?.PUBLIC_URL}/retail/dashboard/reports/karigar_order`,
                },
                {
                  state: {
                    days: 1,
                    type : item.type,
                  },
                }
              );
            }}>
              <td className="text-left">{item.Label}</td>
              <td className="text-right text-info">{item.pcs}</td>
              <td className="text-right text-warning">{parseFloat(item.weight).toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default KarigarOrder;

export const trafficData = [
  {
    id: 1,
    name: "Today - Received",
    qty: "213",
    weight: "3420",
  },
  {
    id: 2,
    name: "Today - Pending",
    qty: "213",
    weight: "3420",
  },
  {
    id: 3,
    name: "Tommorrow Due",
    qty: "213",
    weight: "3420",
  },
  {
    id: 4,
    name: "This Week",
    qty: "213",
    weight: "3420",
  },
  {
    id: 5,
    name: "Pending Delivery",
    qty: "213",
    weight: "3420",
  },

  {
    id: 6,
    name: "Yet to Delivery",
    qty: "213",
    weight: "3420",
  },
];
