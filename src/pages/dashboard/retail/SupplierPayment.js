import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Icon, PreviewAltCard } from "../../../components/Component";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardTitle, DropdownItem, DropdownMenu, DropdownToggle, Table, UncontrolledDropdown } from "reactstrap";
import "../crm/Dashboard.css";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { getSupplierPayment } from "../../../redux/thunks/retailDashboard";
import { formatCurrencyInINR } from "../../../components/common/moneyFormat/moneyFormat";

const SupplierPayment = () => {
  const dispatch = useDispatch();
  const { supplierPaymentList } = useSelector((state) => state.retailDashboardReducer);

  useEffect(() => {
    dispatch(getSupplierPayment());
  }, [dispatch]);

  return (
    <Card className="shadow-sm">
      <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-secondary text-white rounded-top">
        <div className="card-title-group">
          <CardTitle>
            <h6 className="title mb-0">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Supplier Payment
            </h6>
          </CardTitle>
        </div>
      </div>
      <div style={{ overflowY: "auto" }}>
        <Table>
          <thead>
            <tr>
              <th className="text-left">#</th>
              <th className="text-center">PO No</th>
              <th className="text-right">Due Date</th>
              <th className="text-right">Supplier</th>
              <th className="text-right">Total Amount</th>
              <th className="text-right">Paid Amount</th>
              <th className="text-right">Balance Amount</th>
            </tr>
          </thead>
          <tbody>
            {supplierPaymentList?.last_week?.map((item) => (
              <tr key={item.id}>
                <td className="text-left"></td>
                <td className="text-left">{item.pono}</td>
                <td className="text-center text-info">{item.duedate}</td>
                <td className="text-center text-warning">{item.supp}</td>
                <td className="text-right text-warning">{item.amount}</td>
                <td className="text-right text-warning">{item.pamount}</td>
                <td className="text-right text-warning">{item.bamount}</td>
              </tr>
            ))}
            {supplierPaymentList?.this_week?.map((item) => (
              <tr key={item.id}>
                <td className="text-left"></td>
                <td className="text-left">{item.pono}</td>
                <td className="text-center text-info">{item.duedate}</td>
                <td className="text-center text-warning">{item.supp}</td>
                <td className="text-right text-warning">{item.amount}</td>
                <td className="text-right text-warning">{item.pamount}</td>
                <td className="text-right text-warning">{item.bamount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default SupplierPayment;

export const trafficData = [
  {
    id: 1,
    pono: "213",
    duedate: "3420",
    supp: "39",
    amount: "329",
    pamount: "329",
    bamount: "329",
  },
  {
    id: 1,
    pono: "213",
    duedate: "3420",
    supp: "39",
    amount: "329",
    pamount: "329",
    bamount: "329",
  },
  {
    id: 1,
    pono: "213",
    duedate: "3420",
    supp: "39",
    amount: "329",
    pamount: "329",
    bamount: "329",
  },
];
