import React from 'react'
import { Col, Row } from 'reactstrap';
import { Block } from '../components/Component';
import Content from '../layout/content/Content';
import Head from '../layout/head/Head';
import Approvals from './dashboard/retail/Approvals';
import CreditSales from './dashboard/retail/CreditSales';
import CustomerOrder from './dashboard/retail/CustomerOrder';
import CustomerVisits from './dashboard/retail/CustomerVisits';
import EstimationDash from './dashboard/retail/EstimationDash';
import GreenTag from './dashboard/retail/GreenTag';
import KarigarOrder from './dashboard/retail/KarigarOrder';
import Lotss from './dashboard/retail/Lotss';
import OldMetalPurchase from './dashboard/retail/OldMetalPurchase';
import Sales from './dashboard/retail/Sales';
import SalesReturn from './dashboard/retail/SalesReturn';
import VirtualSalesTag from './dashboard/retail/VirtualSalesTag';
import CashAbstract from './dashboard/retail/CashAbstract';
import Statistics from './dashboard/crm/Statistics';
import TopProduct from './dashboard/crm/TopProduct';
import SupplierPayment from './dashboard/retail/SupplierPayment';
import { useSelector, useDispatch } from "react-redux";


const RetailDashboard = () => {

    const { userInfo } = useSelector((state) => state.authUserReducer);
    const { userInfo: { dashboard_settings } } = useSelector((state) => state.authUserReducer);

    return (
        <React.Fragment>
            <Head title="Homepage"></Head>
            <Content>
                <Block>
                    <Row className="g-1">
                        {dashboard_settings?.show_est_details === true && (
                            <>
                                <Col lg="4" sm="4">
                                    <EstimationDash />
                                </Col>
                            </>
                        )}
                        {dashboard_settings?.show_cus_visits === true && (
                            <Col lg="4" sm="4">
                                <CustomerVisits />
                            </Col>
                        )}
                        {dashboard_settings?.show_sales === true && (
                            <Col lg="4" sm="4">
                                <Sales />
                            </Col>
                        )}

                        {dashboard_settings?.show_sales_returns === true && (
                            <Col lg="4" sm="4">
                                <SalesReturn />
                            </Col>
                        )}
                        {dashboard_settings?.show_credit_sales === true && (
                            <Col lg="4" sm="4">
                                <CreditSales />
                            </Col>
                        )}

                        {dashboard_settings?.show_old_metal_purchase === true && (
                            <Col lg="4" sm="4">
                                <OldMetalPurchase />
                            </Col>
                        )}

                        {dashboard_settings?.show_karigar_order === true && (
                            <Col lg="6" sm="6">
                                <KarigarOrder />
                            </Col>
                        )}

                        {dashboard_settings?.show_cus_orders === true && (
                            <Col lg="6" sm="6">
                                <CustomerOrder />
                            </Col>
                        )}
                        {dashboard_settings?.show_lots === true && (
                            <Col lg="6" sm="6">
                                <Lotss />
                            </Col>
                        )}
                        {dashboard_settings?.show_approvals === true && (
                            <Col lg="6" sm="6">
                                <Approvals />
                            </Col>
                        )}
                        {dashboard_settings?.show_cash_abstract === true && (
                            <Col lg="6" sm="12">
                                <CashAbstract />
                            </Col>
                        )}

                        {dashboard_settings?.show_statistics === true && (
                            <Col lg="6" xxl="6">
                                <Statistics />
                            </Col>
                        )}
                        {dashboard_settings?.show_top_products === true && (
                            <Col lg="6" xxl="6">
                                <TopProduct />
                            </Col>
                        )}
                    </Row>
                </Block>

            </Content>
        </React.Fragment>
    )
}

export default RetailDashboard