import React, { useEffect, useRef,useState } from "react";
import { useDispatch } from "react-redux";
import EstPrintTemplateOne from "./estPrintTemplate/estPrintTemplateOne";
import secureLocalStorage from "react-secure-storage";
import EstPrintTemplateTwo from "./estPrintTemplate/estPrintTemplateTwo";
import EstPrintTemplateTwoSilver from "./estPrintTemplate/estPrintTemplateTwoSilver";
const EstimatePrint = () => {
    const dispatch = useDispatch();
    const [itemDetails, SetItemDetails] = useState();
    const [settings, SetSettings] = useState({});

    let data = JSON.parse(secureLocalStorage?.getItem("pageState"));
    useEffect(() => {
        SetItemDetails(data.itemDetails);
        SetSettings(data.settings);
        console.log(data);
    }, [dispatch]);
    useEffect(() => {
        if(itemDetails != undefined){
            window.print();
        }
    }, [itemDetails]);


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
        { settings?.estimation_print_template == 1 && ( <EstPrintTemplateOne estimateData= {itemDetails} /> )}
        { (settings?.estimation_print_template == 2 &&  (itemDetails?.metal  == 1 ) ) && ( <EstPrintTemplateTwo estimateData= {itemDetails} /> )}
        { (settings?.estimation_print_template == 2 &&  (itemDetails?.metal  == 2 || itemDetails?.metal  == null)) && ( <EstPrintTemplateTwoSilver estimateData= {itemDetails} /> )}

        </>
    );
};

export default EstimatePrint;
