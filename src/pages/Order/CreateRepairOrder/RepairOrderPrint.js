import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import PrintTemplateOne from "./printTemplate/PrintTemplateOne";

const RepairOrderPrint = () => {
  const [itemDetails, SetItemDetails] = useState();
  const [isPrinted, setIsPrinted] = useState(false);
  //   const [settings, SetSettings] = useState({});
  //   const [userInfo, setUserInfo] = useState({});

  let data = JSON.parse(secureLocalStorage?.getItem("pageState"));

  useEffect(() => {
    // console.log(data);
    SetItemDetails(data.itemDetails);
    // SetSettings(data.settings);
    // setUserInfo(data.userInfo);
  }, [data]);

  useEffect(() => {
    if (itemDetails && !isPrinted) {
      window.print();
      setIsPrinted(true);
    }
  }, [itemDetails, isPrinted]);
  //   console.log(itemDetails, "itemDetails");
  return (
    <>
      {itemDetails != undefined && itemDetails != null && (
        <PrintTemplateOne order={itemDetails} />
      )}
    </>
  );
};

export default RepairOrderPrint;
