import React, { useEffect, useState } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Row,
  Col,
  BlockBetween,
  PreviewAltCard,
} from "../components/Component";
import { useDispatch, useSelector } from "react-redux";
import { getAllDepartment } from "../redux/thunks/retailMaster";
import ActiveUser from "./dashboard/active-user/ActiveUser";

import PaymentsStatus from "./dashboard/Dashboardpayment/PaymentsStatus";
import PaymentsThrough from "./dashboard/Dashboardpayment/PaymentsThrough";
import TotalPayments from "./dashboard/Dashboardpayment/TotalPayments";
import BranchWiseSchemeJoined from "./dashboard/DashboardSchemes/BranchWiseSchemeJoined";
import BranchWiseSchemeClosed from "./dashboard/DashboardSchemes/BranchWiseSchemeClosed";
import SessionByDevices from "./dashboard/SessionByDevices/SessionByDevices";
import UserByAreas from "./dashboard/UserByAreas/UserByAreas";
import SchemeWiseJoined from "./dashboard/DashboardSchemes/SchemeWiseJoined";
import SchemeWiseClosed from "./dashboard/DashboardSchemes/SchemeWiseClosed";
import { checkDayClose, updateDayClose } from "../redux/thunks/authUser";
import { secureStorage_login_branches } from "../redux/configs";
import UpdateDayCloseModal from "../components/modals/UpdateDayCloseModal";
import { toastsuccess } from "../components/sds-toast-style/toast-style";
import secureLocalStorage from "react-secure-storage";

const Homepage = () => {
  const [sm, updateSm] = useState(false);
  const [modal, SetModal] = useState(false);
  const [dayCloseData, SetDayCloseData] = useState([]);
  const { dayCloseInfo } = useSelector((state) => state.authUserReducer);
  const toggle = () => {
    SetModal(!modal);
  };
  const dispatch = useDispatch();

  useEffect(() => {
    SetDayCloseData(dayCloseInfo);
  }, [dayCloseInfo]);

  useEffect(() => {
    dispatch(getAllDepartment());
    dispatch(checkDayClose({ branches: secureStorage_login_branches }));
  }, [dispatch]);

  useEffect(() => {
    if (dayCloseData?.length > 0 && !secureLocalStorage.getItem("shownDayCloseModal")) {
      SetModal(true);
    }
  }, [dayCloseData]);

  const dayCloseAction = async () => {
    try {
      await dispatch(updateDayClose({ branches: dayCloseData })).unwrap();
      toastsuccess("Branches closed successfully");
      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch (error) {
      console.error(error);
    }
    // dispatch(updateDayClose({ branches: dayCloseInfo?.ids }));
  };

  return (
    <React.Fragment>
      <Head title="Homepage"></Head>
      <Content>
        <UpdateDayCloseModal
          modal={modal}
          toggle={toggle}
          title={"Day Close"}
          data={dayCloseData}
          clickAction={dayCloseAction}
          SetDayCloseData={SetDayCloseData}
        />

        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
                Dashboard
              </BlockTitle>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Row className="g-gs">
            <Col md="4" lg="4" xxl="3">
              <TotalPayments />
            </Col>
            <Col md="4" lg="4" xxl="3">
              <PaymentsStatus />
            </Col>
            <Col md="4" lg="4" xxl="3">
              <PaymentsThrough />
            </Col>
            <Col md="4" lg="4" xxl="3">
              <BranchWiseSchemeJoined />
            </Col>
            <Col md="4" lg="4" xxl="3">
              <BranchWiseSchemeClosed />
            </Col>
            <Col md="4" lg="4" xxl="3">
              <PreviewAltCard className="h-100">
                <UserByAreas />
              </PreviewAltCard>
            </Col>
            <Col md="4" lg="4" xxl="3">
              <SchemeWiseJoined />
            </Col>
            <Col md="4" lg="4" xxl="3">
              <SchemeWiseClosed />
            </Col>

            {/* <Col lg="4" xxl="6">
              <PreviewAltCard className="h-100">
                <ActiveUser />
              </PreviewAltCard>
            </Col> */}

            <Col md="4" lg="4" xxl="3">
              <PreviewAltCard className="h-100">
                <SessionByDevices />
              </PreviewAltCard>
            </Col>
          </Row>
        </Block>
      </Content>
    </React.Fragment>
  );
};
export default Homepage;
