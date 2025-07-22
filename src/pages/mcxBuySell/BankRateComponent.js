import React, { useContext, useEffect, useState } from "react";
import { McxRateContext } from "../../contexts/MxcRateContext";

const BankRateComponent = ({
  sellType,
  setGoldMtSellRate,
  setSilverMtSellRate,
  setGoldBankRatePerGram,
  setGoldBankRatePerKg,
  setSilverBankRatePerGram,
  setSilverBankRatePerKg,
}) => {
  const { mcxRates } = useContext(McxRateContext);

  const initialMapData = [
    {
      id: 1,
      description: "Ask($)",
      goldValue: 0,
      silverValue: 0,
      type: "rate",
      goldrateId: 137,
      silverRateId: 138,
    },
    {
      id: 2,
      description: "Premium",
      goldValue: 0,
      silverValue: 0,
      type: "input",
    },
    {
      id: 3,
      description: "Conversion",
      goldValue: 31.99,
      silverValue: 31.99,
      type: "static",
    },
    {
      id: 4, description: "INR", goldValue: 0, silverValue: 0, type: "rate",
      goldrateId: 139,
      silverRateId: 139,
    },
    {
      id: 5,
      description: "INR Premium",
      goldValue: 0,
      silverValue: 0,
      type: "input",
    },
    {
      id: 6,
      description: "Custom Duty",
      goldValue: 488065.00,
      silverValue: 5309.30,
      type: "input",
    },
    {
      id: 7,
      description: "GST",
      goldValue: 0.03,
      silverValue: 0.03,
      type: "static",
    },
    {
      id: 8,
      description: "1 GRM Rate",
      goldValue: 0,
      silverValue: 0,
      type: "total",
    },
    {
      id: 9,
      description: "1 KG Rate",
      goldValue: 0,
      silverValue: 0,
      type: "total",
    },
  ];

  const [data, setData] = useState(initialMapData);

  // Reset state when sellType changes
  useEffect(() => {
    setData(initialMapData);
  }, [sellType]);


  useEffect(() => {
    if (!mcxRates.length) return;

    setData((prevData) =>
      prevData.map((item) => {
        if (item.type === "rate") {
          const goldRate = mcxRates.find((rate) => rate.id == item.goldrateId);
          const silverRate = mcxRates.find(
            (rate) => rate.id == item.silverRateId
          );

          return {
            ...item,
            goldValue: goldRate
              ? parseFloat(goldRate.price1) || 0
              : item.goldValue,
            silverValue: silverRate
              ? parseFloat(silverRate.price1) || 0
              : item.silverValue,
          };
        }
        return item;
      })
    );
  }, [mcxRates]);


  const handleInputChange = (id, key, value) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, [key]: parseFloat(value) || 0 } : item
      )
    );
  };


  useEffect(() => {
    if (!data.length) return;

    const id1 = data.find((item) => item.id === 1) || {};
    const id2 = data.find((item) => item.id === 2) || {};
    const id3 = data.find((item) => item.id === 3) || {};
    const id4 = data.find((item) => item.id === 4) || {};
    const id5 = data.find((item) => item.id === 5) || {};
    const id6 = data.find((item) => item.id === 6) || {};

    const goldGrmRate =
      (((id1.goldValue + id2.goldValue) *
        id3.goldValue *
        (id4.goldValue + id5.goldValue) +
        id6.goldValue) *
        (103 / 100)) /
      1000;

    const silverGrmRate =
      (((id1.silverValue + id2.silverValue) *
        id3.silverValue *
        (id4.silverValue + id5.silverValue) +
        id6.silverValue) *
        (103 / 100)) /
      1000;

    const goldKgRate = goldGrmRate * 1000;
    const silverKgRate = silverGrmRate * 1000;

    setData((prevData) =>
      prevData.map((item) => {
        if (item.id === 8)
          return {
            ...item,
            goldValue: goldGrmRate,
            silverValue: silverGrmRate,
          };
        if (item.id === 9)
          return { ...item, goldValue: goldKgRate, silverValue: silverKgRate };
        return item;
      })
    );

    if (sellType === 1) {
      setGoldMtSellRate(goldGrmRate);
      setSilverMtSellRate(silverGrmRate);
    } else if (sellType === 2) {
      const goldRate = mcxRates.find((rate) => rate.id == 141);
      const silverRate = mcxRates.find((rate) => rate.id == 1632);
      // console.log(goldRate);

      setGoldMtSellRate(goldRate ? parseFloat(goldRate.price1) || 0 : 0);
      //   setGoldBankRatePerGram(goldRate ? parseFloat(goldRate.price1) || 0 : 0);
      //   setGoldBankRatePerKg(goldRate ? parseFloat(goldRate.price1 * 1000) || 0 : 0);
      setSilverMtSellRate(silverRate ? parseFloat(silverRate.price1) || 0 : 0);
      //   setSilverBankRatePerGram(silverRate ? parseFloat(silverRate.price1) || 0 : 0);
      //   setSilverBankRatePerKg(silverRate ? parseFloat(silverRate.price1 * 1000) || 0 : 0);
      setData((prevData) =>
        prevData.map((item) => {
          if (item.id === 8)
            return {
              ...item,
              goldValue: goldRate ? parseFloat(goldRate.price1) || 0 : 0,
              silverValue: silverRate ? parseFloat(silverRate.price1) || 0 : 0,
            };
          if (item.id === 9)
            return {
              ...item,
              goldValue: goldRate ? parseFloat(goldRate.price1 * 1000) || 0 : 0,
              silverValue: silverRate
                ? parseFloat(silverRate.price1 * 1000) || 0
                : 0,
            };
          return item;
        })
      );
    }

    setGoldBankRatePerGram(goldGrmRate);
    setGoldBankRatePerKg(goldKgRate);
    setSilverBankRatePerGram(silverGrmRate);
    setSilverBankRatePerKg(silverKgRate);
  }, [data, sellType]);

  return (
    <div>
      <h4>Bank Rates</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Description</th>
            <th>Gold</th>
            <th>Silver</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.description}</td>
              <td style={{fontWeight:'bold'}}>
                {item.type === "input" ? (
                  <input
                    type="number"
                    className="no-spinner"
                                    onWheel={(e) => e.target.blur()}
                    value={item.goldValue}
                    onChange={(e) =>
                      handleInputChange(item.id, "goldValue", e.target.value)
                    }
                    readOnly={sellType !== 1}
                  />
                ) : (
                  item.goldValue.toFixed(2)
                )}
              </td>
              <td style={{fontWeight:'bold'}}>
                {item.type === "input" ? (
                  <input
                    type="number"
                    className="no-spinner"
                                    onWheel={(e) => e.target.blur()}
                    value={item.silverValue}
                    onChange={(e) =>
                      handleInputChange(item.id, "silverValue", e.target.value)
                    }
                    readOnly={sellType !== 1}
                  />
                ) : (
                  item.silverValue.toFixed(2)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BankRateComponent;
