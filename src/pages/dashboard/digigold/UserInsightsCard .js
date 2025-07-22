import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

const UserInsightsCard = () => {
  return (
    <div className="flex justify-between items-start bg-white p-4 rounded-xl shadow-sm w-full max-w-xl">
      <div className="w-1/2 pr-4">
        <h4 className="text-sm text-gray-700 font-semibold mb-1">
          User Behavior Insights
        </h4>
        <div className="text-3xl font-bold text-gray-900 mb-1">65%</div>
        <p className="text-xs text-gray-500">
          Top 10 Cities by Total Investment
        </p>
      </div>

      <div className="w-1/2">
        <BarChart
          xAxis={[
            {
              data: [0, 20, 40, 60, 80, 100],
              min: 0,
              max: 100,
              hide: false,
            },
          ]}
          yAxis={[
            {
              data: ["City A", "City B", "City C", "City D"],
              scaleType: "band",
            },
          ]}
          series={[
            {
              data: [100, 60, 40, 30],
              color: "#1f4e79",
            },
          ]}
          layout="horizontal"
          height={180}
          width={260}
          margin={{ top: 10, bottom: 20, left: 80, right: 10 }}
          slotProps={{
            legend: { hidden: true },
          }}
        />
      </div>
    </div>
  );
};

export default UserInsightsCard;
