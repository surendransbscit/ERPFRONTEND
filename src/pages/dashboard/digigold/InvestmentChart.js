import React from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import { BarChart } from "@mui/x-charts/BarChart";

const InvestmentChart = () => {
  const xAxisData = ["Jewellery", "Coins","payments"];
  const seriesData = [2500, 4500,3000 ];

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="bg-white border-bottom fw-bold">
        Investment by Day of W
      </CardHeader>
      <CardBody style={{ height: "230px" }}>
        <BarChart
          xAxis={[{ scaleType: "band", data: xAxisData }]}
          series={[
            {
              data: seriesData,
              label: "Value",
              color: "#1f4e79",
            },
          ]}
          height={200}
          width={350} // optional: you can use 100% width in parent
          margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
        />
      </CardBody>
    </Card>
  );
};

export default InvestmentChart;
