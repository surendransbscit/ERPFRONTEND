import React, { useEffect, useRef,useState } from "react";
import { useDispatch } from "react-redux";
import secureLocalStorage from "react-secure-storage";
import ThermalPrint from "./IssueReceiptTemplate/ThermalPrint";
const IssueReceiptPrint = () => {
    const dispatch = useDispatch();
    const [itemDetails, SetItemDetails] = useState();
    const [settings, SetSettings] = useState({});
    const [userInfo, setUserInfo] = useState({});

    let data = JSON.parse(secureLocalStorage?.getItem("pageState"));
    useEffect(() => {
        SetItemDetails(data.itemDetails);
        SetSettings(data.settings);
        setUserInfo(data.userInfo);
    }, [dispatch]);
    useEffect(() => {
        if(itemDetails != null){
            window.print();
        }
    }, [itemDetails]);

    // Handle closing the tab after print/cancel
            useEffect(() => {
                const handleAfterPrint = () => {
                    window.close();
                };
        
                window.onafterprint = handleAfterPrint;
        
                // Backup: handle if user tries to navigate away
                window.onbeforeunload = () => {
                    window.onafterprint = null;
                };
        
                return () => {
                    // Clean up on unmount
                    window.onafterprint = null;
                    window.onbeforeunload = null;
                };
            }, []);
    
    return (
        <>
        { parseInt(settings.issue_receipt_print_format) == 2 && ( <ThermalPrint invoiceData= {itemDetails} userInfo = {userInfo} /> )}

        </>
    );
};

export default IssueReceiptPrint;
