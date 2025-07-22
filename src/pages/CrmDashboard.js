import React, { useState } from "react";
import { Button, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  PreviewAltCard,
  PreviewCard,
} from "../components/Component";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import ActiveChits from "./dashboard/crm/ActiveChits";
import InActiveChits from "./dashboard/crm/InActiveChits";
import MaturedUnClaimed from "./dashboard/crm/MaturedUnClaimed";
import PaymentSummary from "./dashboard/crm/PaymentCollection";
import UnPaidCustomer from "./dashboard/crm/UnPaidCustomer";
import BranchWise from "./dashboard/crm/BranchWise";
import SchemeWise from "./dashboard/crm/SchemeWise";
import SessionByDevices from "./dashboard/SessionByDevices/SessionByDevices";
import ChitClosing from "./dashboard/crm/ChitClosing";
import SchemeAccDetails from "./dashboard/crm/RegisterThrough";
import RegisterThrough from "./dashboard/crm/RegisterThrough";
import CollectionSummary from "./dashboard/crm/CollectionSummary";
import CustomerRegistration from "./dashboard/crm/CustomerRegistration";
import OrdersList from "./dashboard/crm/OrdersList";
import Statistics from "./dashboard/crm/Statistics";
import TopProduct from "./dashboard/crm/TopProduct";
import Birthdays from "./dashboard/crm/Birthdays";
import { useSelector, useDispatch } from "react-redux";
import BranchWiseCollectionDetails from "./dashboard/crm/BranchWiseCollectionDetails";

const CrmDashboard = () => {

  const { userInfo } = useSelector((state) => state.authUserReducer);
  const { userInfo: { dashboard_settings } } = useSelector((state) => state.authUserReducer);
  return (
    <React.Fragment>
      <Head title="Homepage"></Head>
      <Content>
        <Block>
          <Row className="g-2">
            {dashboard_settings?.show_active_chits === true && (
              <Col lg="3" sm="3">
                <ActiveChits />
              </Col>
            )}
            {dashboard_settings?.show_matured_claimed === true && (
              <Col lg="3" sm="3">
                <MaturedUnClaimed />
              </Col>
            )}
            {dashboard_settings?.show_payment === true && (
              <Col lg="3" sm="3">
                <PaymentSummary />
              </Col>
            )}
            {dashboard_settings?.show_users_joined_through === true && (
              <Col lg="3" sm="3">
                <SessionByDevices />
              </Col>
            )}


            {dashboard_settings?.show_scheme_wise === true && (
              <Col lg="6" xxl="6">
                <SchemeWise />
              </Col>
            )}
            {dashboard_settings?.show_branch_wise === true && (
              <Col lg="6" xxl="6">
                <BranchWise />
              </Col>
            )}
            {dashboard_settings?.show_register_through_details === true && (
              <Col lg="6" xxl="6">
                <RegisterThrough />
              </Col>
            )}
            {dashboard_settings?.show_customer_details === true && (
              <Col lg="6" xxl="6">
                {/* <OrdersList /> */}
                <CustomerRegistration />
              </Col>
            )}


            {dashboard_settings?.show_collection_summary === true && (
              <Col lg="4" xxl="6">
                <CollectionSummary />
              </Col>
            )}
            {dashboard_settings?.show_inactive_chits === true && (
              <Col lg="4" xxl="6">
                <InActiveChits />
              </Col>
            )}
            {dashboard_settings?.show_chit_closing_details === true && (
              <Col lg="4" xxl="6">
                <ChitClosing />
              </Col>
            )}
            {dashboard_settings?.show_customer_personal_landmark === true && (
              <Col lg="4" xxl="6">
                <Birthdays />
              </Col>
            )}
            {dashboard_settings?.show_branch_wise_collection_details === true && (
              <Col lg="6" xxl="6">
                <BranchWiseCollectionDetails />
              </Col>
            )}
          </Row>
        </Block>


      </Content>
    </React.Fragment>
  );
};

export default CrmDashboard;
