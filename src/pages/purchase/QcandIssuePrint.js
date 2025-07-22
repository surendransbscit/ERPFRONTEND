import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import secureLocalStorage from "react-secure-storage";
import QcHmIssueReceiptPrintTemplateOne from "./qcandhmPrintTemplate/QcHmIssueReceiptPrintTemplateOne";
import QcHmIssueReceiptPrintTemplateTwo from "./qcandhmPrintTemplate/QcHmIssueReceiptPrintTemplateTwo";

const QcandIssuePrint = () => {
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
    if (itemDetails != null) {
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
  
  console.log(settings?.qc_issue_print_template);
  
  return (
    <>

         {settings?.qc_issue_print_template == 1 && (
        <QcHmIssueReceiptPrintTemplateOne issueData={itemDetails} />
      )}
      {settings?.qc_issue_print_template == 2 && (
        <QcHmIssueReceiptPrintTemplateTwo issueData={itemDetails} />
      )}
    </>
  );
};

export default QcandIssuePrint;
