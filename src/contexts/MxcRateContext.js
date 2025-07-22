import React, { createContext, useEffect, useState } from "react";

export const McxRateContext = createContext();

export const McxRateProvider = ({ children }) => {
  const [mcxRates, setMcxRates] = useState([]);

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

        setMcxRates(finalData);
      } catch (error) {
        console.error("Error fetching rates:", error);
      }
    };

    fetchRates();

    const interval = setInterval(fetchRates, 5000);
    console.log("Calling Rate for every 5 seconds");
    

    return () => clearInterval(interval);
  }, []);

  return (
    <McxRateContext.Provider value={{ mcxRates }}>
      {children}
    </McxRateContext.Provider>
  );
};
