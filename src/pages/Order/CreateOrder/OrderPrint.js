import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import secureLocalStorage from "react-secure-storage";
import PrintTemplateOne from "./printTemplate/PrintTemplate";

const CustomerOrderThermalPrint = () => {
  const dispatch = useDispatch();
  const [itemDetails, SetItemDetails] = useState();
  const [settings, SetSettings] = useState({});
  const [userInfo, setUserInfo] = useState({});

  let data = JSON.parse(secureLocalStorage?.getItem("pageState"));

  useEffect(() => {
    console.log(data);
    SetItemDetails(data.itemDetails);
    SetSettings(data.settings);
    setUserInfo(data.userInfo);
  }, [dispatch]);
  useEffect(() => {
    if (itemDetails != undefined && itemDetails != null) {
      window.print();
    }
  }, [itemDetails]);
  console.log(itemDetails, "itemDetails");

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
      {itemDetails != undefined && itemDetails != null && (
        <PrintTemplateOne order={itemDetails}/>
      )}
    </>
  );
};

export default CustomerOrderThermalPrint;
