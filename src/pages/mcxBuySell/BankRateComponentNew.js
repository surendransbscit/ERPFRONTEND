import React, { useContext, useEffect, useState } from "react";
import { McxRateContext } from "../../contexts/MxcRateContext";
import { Col, Row } from "../../components/Component";
import { Table } from "reactstrap";

const BankRateComponentNew = ({
  bankMetal,
  setGoldSellRate,
  setSilverSellRate,
  setBullionRatePerGram,
  setMt5RatePerGram,
  setGoldMtBuyRate,
  setSilverMtBuyRate,
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
      id: 4,
      description: "INR",
      goldValue: 0,
      silverValue: 0,
      type: "rate",
      goldrateId: 139,
      silverRateId: 139,
    },
    {
      id: 5,
      description: "Premium",
      goldValue: 0,
      silverValue: 0,
      type: "input",
    },
    {
      id: 6,
      description: "Duty",
      goldValue: 488065.0,
      silverValue: 5309.3,
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

    setGoldMtBuyRate(goldGrmRate);
    setSilverMtBuyRate(silverGrmRate);

    setGoldBankRatePerGram(goldGrmRate);
    setGoldBankRatePerKg(goldKgRate);
    setSilverBankRatePerGram(silverGrmRate);
    setSilverBankRatePerKg(silverKgRate);
  }, [data]);

  //Sell
  useEffect(() => {
    mcxRates?.forEach((rate) => {
      if (rate?.id == 141) {
        setGoldSellRate(parseFloat(rate.price1 / 10).toFixed(2));
      } else if (rate?.id == 1632) {
        setSilverSellRate(parseFloat(rate.price2 / 1000).toFixed(2));
      }
    });
  }, [mcxRates, setGoldSellRate, setSilverSellRate]);

  useEffect(() => {
    mcxRates?.forEach((rate) => {
      if (bankMetal == 1) {
        if (rate?.id == 141) {
          setMt5RatePerGram(parseFloat(rate.price2 / 10).toFixed(2));
          setBullionRatePerGram(parseFloat(rate.price2 / 10).toFixed(2));
        }
      } else if (bankMetal == 2) {
        if (rate?.id == 1632) {
          setMt5RatePerGram(parseFloat(rate.price2 / 1000).toFixed(2));
          setBullionRatePerGram(parseFloat(rate.price2 / 1000).toFixed(2));
        }
      }
    });
  }, [mcxRates, setMt5RatePerGram, setBullionRatePerGram, bankMetal]);
  return (
    <>
      <h4>Bank Rates</h4>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Symbol</th>
              {data.map((item) => (
                <th key={item.id}>{item.description}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gold</td>
              {data?.map((item) => (
                <td key={item.id}>
                  {item.type === "input" ? (
                    <input
                    style={{width:'85px'}}
                      type="number"
                      className=" form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                      value={item.goldValue}
                      onChange={(e) =>
                        handleInputChange(item.id, "goldValue", e.target.value)
                      }
                      // readOnly={sellType !== 1}
                    />
                  ) : (
                    item.goldValue.toFixed(2)
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td>Silver</td>
              {data.map((item) => (
                <td key={item.id} >
                  {item.type === "input" ? (
                    <input
                      className=" form-control no-spinner"
                                    onWheel={(e) => e.target.blur()}
                      type="number"
                      style={{width:'85px'}}
                      value={item.silverValue}
                      onChange={(e) =>
                        handleInputChange(
                          item.id,
                          "silverValue",
                          e.target.value
                        )
                      }
                      // readOnly={sellType !== 1}
                    />
                  ) : (
                    item.silverValue.toFixed(2)
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BankRateComponentNew;
