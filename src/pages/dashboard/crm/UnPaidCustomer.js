import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faDollarSign, faChartPie } from "@fortawesome/free-solid-svg-icons";

const UnPaidCustomer = () => {
    return (
        <div className="d-flex flex-column align-items-start">
            <Card className="shadow-sm border-0 rounded p-3 " style={{ width: '15rem', backgroundColor: '#ffffff', }}>
                <CardBody className="p-0">
                    <div className="d-flex justify-content-between align-items-left mb-2">
                        <div className="d-flex align-items-left">
                            <h6 className="ms-2 mb-0" style={{ fontWeight: 'bold', color: '#333' }}>Unpaid Customers</h6>
                        </div>
                    </div>

                    <div className="d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center">
                                <FontAwesomeIcon icon={faUserCircle} className="text-info me-2" style={{ fontSize: '1.25rem' }} />
                                <span className="text-muted">Total Customers</span>
                            </div>
                            <span className="fw-bold" style={{ color: '#333' }}>1,795</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <FontAwesomeIcon icon={faDollarSign} className="text-success me-2" style={{ fontSize: '1.25rem' }} />
                                <span className="text-muted">Unpaid Amount</span>
                            </div>
                            <span className="fw-bold" style={{ color: '#333' }}>$2,327</span>
                        </div>
                    </div>
                </CardBody>
            </Card>
            <Card className="shadow-sm border-0 rounded p-3 " style={{ width: '15rem', backgroundColor: '#ffffff', top: "-10px" }}>
                <CardBody className="p-0">
                    <div className="d-flex justify-content-between align-items-left mb-2">
                        <div className="d-flex align-items-left">
                            <h6 className="ms-2 mb-0" style={{ fontWeight: 'bold', color: '#333' }}>Customer Registration</h6>
                        </div>
                    </div>

                    <div className="d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center">
                                <FontAwesomeIcon icon={faUserCircle} className="text-info me-2" style={{ fontSize: '1.25rem' }} />
                                <span className="text-muted">Total Customers</span>
                            </div>
                            <span className="fw-bold" style={{ color: '#333' }}>1,795</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <FontAwesomeIcon icon={faDollarSign} className="text-success me-2" style={{ fontSize: '1.25rem' }} />
                                <span className="text-muted">Collection Amount</span>
                            </div>
                            <span className="fw-bold" style={{ color: '#333' }}>$2,327</span>
                        </div>
                    </div>
                </CardBody>
            </Card>

        </div>
    );
};

export default UnPaidCustomer;
