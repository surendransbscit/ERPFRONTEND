import React, { useEffect } from "react";
import { Col, Row } from "reactstrap";
import { Block } from "../components/Component";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import { useSelector, useDispatch } from "react-redux";
import UserCards from "./dashboard/digigold/UsersCards";
import UserBenefitTable from "./dashboard/digigold/UserBenefitTable";
import InvestmentChart from "./dashboard/digigold/InvestmentChart";
import UserInsightsCard from "./dashboard/digigold/UserInsightsCard ";
import RedemptionAnalytics from "./dashboard/digigold/RedemptionAnalytics";
import InvestmentTrends from "./dashboard/digigold/InvestmentTrends";
import Investment from "./dashboard/digigold/Investment";
import UpcomingMaturities from "./dashboard/digigold/UpcomingMaturities";

const DigiGoldDashboard = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.authUserReducer);
  const {
    userInfo: { dashboard_settings },
  } = useSelector((state) => state.authUserReducer);


  return (
    <React.Fragment>
      <Head title="Digi Gold Dashboard"></Head>
      <Content>
        <Block className="mb-3">
          <Row className="g-1 mb-3">
            <UserCards />
          </Row>

          <Row className="g-3 mb-4">
            <InvestmentTrends />
          </Row>

          <Row className="g-1 mb-4">
            <Col lg="4" sm="4">
              <UserBenefitTable />
            </Col>

            <Col lg="4" sm="4">
              <InvestmentChart />
            </Col>

            <Col lg="4" sm="4">
              <UpcomingMaturities />
            </Col>
          </Row>

          <Row className="g-3">
            <Col lg="6" sm="4">
              <UserInsightsCard />
            </Col>
            <Col lg="4" sm="4">
              <Investment />
            </Col>
          </Row>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default DigiGoldDashboard;
