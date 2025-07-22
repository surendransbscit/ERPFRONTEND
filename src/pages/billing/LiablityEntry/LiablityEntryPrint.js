import React, { useEffect, useState } from "react";
import EntryThermalPrint from "./printTemplate/EntryThermalPrint";
import secureLocalStorage from "react-secure-storage";

const LiablityEntryPrint = () => {
  const [liablityDetails, setLiablityDetails] = useState();
  const [isPrinted, setIsPrinted] = useState(false);

  let data = JSON.parse(secureLocalStorage?.getItem("pageState"));

  useEffect(() => {
    setLiablityDetails(data.itemDetails);
  }, [data]);

  useEffect(() => {
    if (liablityDetails && !isPrinted) {
      window.print();
      setIsPrinted(true);
    }
  }, [isPrinted, liablityDetails]);

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
      {liablityDetails != undefined && liablityDetails != null && (
        <EntryThermalPrint liablity={liablityDetails} />
      )}
    </>
  );
};

export default LiablityEntryPrint;
