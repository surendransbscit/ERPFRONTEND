import React, { createContext, useEffect, useState } from "react";

export const McxBankRateContext = createContext();

export const McxBankRateProvider = ({ children }) => {
  const [bankRates, setBankRates] = useState([]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(
          "https://bcast.slnbullion.com/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/sln"
        );
        const text = await response.text();
        const messagesDesktopp = text.split("\n");

        const finalData = messagesDesktopp
          .map((message) => {
            const data = message.split("\t");

            if (data.length > 3) {
              return {
                id: data[1],
                name: data[2],
                price1: data[3],
                price2: data[4],
                price3: data[5],
                price4: data[6],
              };
            }
            return null;
          })
          .filter(Boolean);

        // console.log(finalData);
        setBankRates(finalData);
      } catch (error) {
        console.error("Error fetching rates:", error);
      }
    };

    fetchRates();
  }, []);

  return (
    <McxBankRateContext.Provider value={{ bankRates }}>
      {children}
    </McxBankRateContext.Provider>
  );
};
