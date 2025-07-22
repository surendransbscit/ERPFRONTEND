import React, { useEffect, useRef,useState } from "react";
import { useDispatch } from "react-redux";
import BillingPrintTemplateOne from "./BillingPrintTemplate/billingPrintTemplateOne";
import secureLocalStorage from "react-secure-storage";
import BillingPrintTemplateTwo from "./BillingPrintTemplate/billingPrintTemplateTwo";
import BillingPrintTemplateThree from "./BillingPrintTemplate/billingPrintTemplateThree";
const BillingPrint = () => {
    const dispatch = useDispatch();
    const [itemDetails, SetItemDetails] = useState();
    const [settings, SetSettings] = useState({});

    let data = JSON.parse(secureLocalStorage?.getItem("pageState"));
    useEffect(() => {
        SetItemDetails(data.itemDetails);
        SetSettings(data.settings);
    }, [dispatch]);
    useEffect(() => {
        if(itemDetails != null){
            window.print();
        }
    }, [itemDetails]);

      //Handle closing the tab after print/cancel
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
        { settings.bill_print_template == 1 && ( <BillingPrintTemplateOne invoiceData= {itemDetails} /> )}
        { settings.bill_print_template == 2 && ( <BillingPrintTemplateTwo invoiceData= {itemDetails} /> )}
        { settings.bill_print_template == 3 && ( <BillingPrintTemplateThree invoiceData= {itemDetails} /> )}


        </>
    );
};

export default BillingPrint;
