import React, { useContext, useEffect } from "react";
import { McxRateContext } from "../../contexts/MxcRateContext";

const McxRateComponent = ({
  setGoldMtBuyRate,
//   setGoldMtSellRate,
  setSilverMtBuyRate,
//   setSilverMtSellRate,
}) => {
  const { mcxRates } = useContext(McxRateContext);

  useEffect(() => {
    mcxRates.forEach((rate) => {
      if (rate?.id == 141) {
        // setGoldMtSellRate(rate.price1);
        setGoldMtBuyRate(rate.price2);
      } else if (rate?.id == 1632) {
        // setSilverMtSellRate(rate.price1);
        setSilverMtBuyRate(rate.price2);
      }
    });
  }, [mcxRates, setGoldMtBuyRate, setSilverMtBuyRate]);

  if (!mcxRates.length) {
    return <div>Loading MCX rates...</div>;
  }

  return (
    <div>
      <h4>MCX Rates</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            {/* <th style={{ textAlign: "center" }}>ID</th> */}
            <th style={{ textAlign: "center" }}>Symbol</th>
            <th style={{ textAlign: "right" }}>Sell</th>
            <th style={{ textAlign: "right" }}>Buy</th>
          </tr>
        </thead>
        <tbody>
          {mcxRates
            .filter((rate) => rate?.id == 141 || rate?.id == 1632)
            .map((rate) => (
              <tr key={rate.id}>
                {/* <td style={{ textAlign: "center" }}>{rate.id}</td> */}
                <td style={{ textAlign: "center"}}>{rate.name}</td>
                <td style={{ textAlign: "right", fontWeight:'bold'}}>{rate.price1}</td>
                <td style={{ textAlign: "right",fontWeight:'bold' }}>{rate.price2}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default McxRateComponent;
