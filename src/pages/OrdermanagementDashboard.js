import React, { useEffect } from "react";
import { Col, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Block } from "../components/Component";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import TotalOrders from "./dashboard/Ordermanagement/TotalOrders";
import TodayRecived from "./dashboard/Ordermanagement/TodayRecived";
import TodayDeliver from "./dashboard/Ordermanagement/TodayDeliver";
import YetToAssign from "./dashboard/Ordermanagement/YetToAssign";
import TotalDeliverd from "./dashboard/Ordermanagement/TotalDeliverd";
import ThisWeekDelivery from "./dashboard/Ordermanagement/ThisWeekDelivery";
import NextWeekDelivery from "./dashboard/Ordermanagement/NextWeekDelivery";
import TotalDelivery from "./dashboard/Ordermanagement/TotalDelivery";
import CustomerTotalWorkInProgress from "./dashboard/Ordermanagement/CustomerTotalWorkInProgress";
import InCart from "./dashboard/Ordermanagement/InCart";
import OverDueOrderSupplier from "./dashboard/Ordermanagement/OverDueOrderSupplier";
import CustomerOverDueOrder from "./dashboard/Ordermanagement/CustomerOverDueOrder";
import { fetchOrderDetails } from "../redux/thunks/dashboard";
import CustomersYetToApprove from "./dashboard/Ordermanagement/CustomersYetToApprove";

const OrderManagementDashboard = () => {
  const dispatch = useDispatch();
  const { dashBoardOrderDetailsList } = useSelector(
    (state) => state.dashboardReducer
  );
  // console.log(dashBoardOrderDetailsList);
  useEffect(() => {
    dispatch(fetchOrderDetails());
  }, [dispatch]);

  return (
    <React.Fragment>
      <Head title="Homepage"></Head>
      <Content>
        {/* <h1 className="text-center">Order Management Dashboard</h1> */}
        <Block>
          <Row className="g-2">
            <Col lg="3" sm="3">
              <TotalOrders
                totalOrders={dashBoardOrderDetailsList.total_orders}
              />
            </Col>

            <Col lg="3" sm="3">
              <TodayRecived
                todayrecived={dashBoardOrderDetailsList.today_recived}
              />
            </Col>

            <Col lg="3" sm="3">
              <TodayDeliver
                Todaydeliver={dashBoardOrderDetailsList.today_delivary}
              />
            </Col>

            <Col lg="3" sm="3">
              <YetToAssign
                yettoassign={dashBoardOrderDetailsList.yet_to_assign}
              />
            </Col>
          </Row>

          <Row className="g-2 mt-2">
            <Col lg="3" sm="3">
              <CustomersYetToApprove
                yetToApprove={dashBoardOrderDetailsList.yet_to_approve}
              />
            </Col>

            <Col lg="3" sm="3">
              <TotalDeliverd
                totaldeliverd={dashBoardOrderDetailsList.total_delivered}
              />
            </Col>

            <Col lg="3" sm="3">
              <ThisWeekDelivery
                thisweekdelivery={dashBoardOrderDetailsList.week_delivery}
              />
            </Col>

            <Col lg="3" sm="3">
              <NextWeekDelivery
                nextweekdelivery={dashBoardOrderDetailsList.next_week_delivery}
              />
            </Col>
          </Row>

          <Row className="g-2 mt-2">

            <Col lg="3" sm="3">
              <InCart
                customerCartItemCount={
                  dashBoardOrderDetailsList.customer_cart_item_count
                }
              />
            </Col>

            <Col lg="3" sm="3">
              <OverDueOrderSupplier
                overdueordersupplier={
                  dashBoardOrderDetailsList.over_due_order_supplier
                }
              />
            </Col>

            <Col lg="3" sm="3">
              <CustomerOverDueOrder
                customeroverdueorder={
                  dashBoardOrderDetailsList.customer_over_due
                }
              />
            </Col>

            <Col lg="3" sm="3">
              <TotalDelivery
                totaldelivery={
                  dashBoardOrderDetailsList.customer_total_delivery
                }
              />
            </Col>
          </Row>

          <Row className="g-2 mt-2">
            <Col lg="3" sm="3">
              <CustomerTotalWorkInProgress
                customertotalworkinprogress={
                  dashBoardOrderDetailsList.customer_total_work_progress
                }
              />
            </Col>
          </Row>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default OrderManagementDashboard;
