import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { PreviewCard } from "../../../components/Component";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "../../../redux/thunks/dashboard";

const OrdersList = () => {
  const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
  const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
  const xLabels = ["Page A", "Page B", "Page C", "Page D", "Page E", "Page F", "Page G"];

  const [months, SetMonths] = useState([]);
  const [orders, SetOrders] = useState([]);

  const dispatch = useDispatch();
  const { orderDetailsList } = useSelector((state) => state.dashboardReducer);
  useEffect(() => {
    dispatch(getOrderDetails());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetailsList) {
      SetMonths(orderDetailsList.months || []);
      SetOrders(orderDetailsList.orders || []);
    }
  }, [orderDetailsList]);

  return (
    <>
      <PreviewCard>
        <LineChart
          width={500}
          height={240}
          series={[{ data: orders, label: "Orders", yAxisId: "leftAxisId" }]}
          xAxis={[{ scaleType: "point", data: months }]}
          yAxis={[{ id: "leftAxisId" }, { id: "rightAxisId" }]}
          rightAxis="rightAxisId"
        />
      </PreviewCard>
    </>
  );
};

export default OrdersList;
