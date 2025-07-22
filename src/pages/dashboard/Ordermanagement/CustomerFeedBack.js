import { faHourglass1 } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Card, CardTitle, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";



const CustomerFeedBack = () => {
    return (

        <Card className="h-100 shadow-sm border-0">
            <div className="card-inner border-bottom p-2 d-flex justify-content-between align-items-center bg-secondary text-white rounded-top">
                <div className="card-title-group">
                    <CardTitle>
                        <h6 className="title mb-0">
                            Customer Feed Backs
                        </h6>
                    </CardTitle>
                </div>
            </div>
            <div className=" align-items-center p-2" >
                <h4 className="mb-1" style={{ color:"#FFFF00"}}>Kali Jawels</h4>
                <h6>Need More Item Details</h6>
            </div>
            <div className=" align-items-center p-2" >
                <h4 className="mb-1" style={{ color:"#FFFF00"}}>Kali Jawels</h4>
                <h6>Need More Item Details</h6>
            </div>
        </Card>

    );
};

export default CustomerFeedBack;
