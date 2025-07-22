import React, { useEffect, useState } from "react";
import { formatCurrencyInINR } from "../../../components/common/moneyFormat/moneyFormat";
import secureLocalStorage from "react-secure-storage";
import PaymentThermalPrint from "./printTemplate/PaymentThermalPrint";

const LiablityPaymentPrint = () => {
  const [liablityPaymentDetails, setLiablityPaymentDetails] = useState();
  const [isPrinted, setIsPrinted] = useState(false);

  let data = JSON.parse(secureLocalStorage?.getItem("pageState"));
console.log(data);

  useEffect(() => {
    setLiablityPaymentDetails(data.itemDetails);
  }, [data]);

  useEffect(() => {
    if (liablityPaymentDetails && !isPrinted) {
      window.print();
      setIsPrinted(true);
    }
  }, [isPrinted, liablityPaymentDetails]);

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
      {liablityPaymentDetails != undefined &&
        liablityPaymentDetails != null && (
          <PaymentThermalPrint paymentData={liablityPaymentDetails} />
        )}
    </>
  );
};

export default LiablityPaymentPrint;
