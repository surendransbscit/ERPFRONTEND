import React from "react";
import { Col, Row } from "reactstrap";
import { Block } from "../components/Component";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import RateCut from "./dashboard/purchase/RateCut";
import Purchase from "./dashboard/purchase/PurchaseTable";
import SupplierWise from "./dashboard/purchase/SupplierWise";
import MetalIssue from "./dashboard/purchase/MetalIssue";

const PurchaseDashboard = () => {
  return (
    <React.Fragment>
      <Head title="Homepage"></Head>
      <Content>
        <Block>
          <Row className="g-1">
            <Col lg="4" sm="4">
              <RateCut />
            </Col>
            <Col lg="4" sm="4">
              <Purchase/>
            </Col>
            <Col lg="4" sm="4">
              <SupplierWise/>
            </Col>
          </Row>
          <Row className="g-1">
          <Col lg="4" sm="4">
              <MetalIssue/>
            </Col>
          </Row>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default PurchaseDashboard;
