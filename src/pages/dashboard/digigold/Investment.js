import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import "./DigiGoldDash.css";

const Investment = () => {
  const userDistribution = [
    { users: 1093, value: 45 },
    { users: 1246, value: 30 },
    { users: 1582, value: 15 },
    { users: 2435, value: 10 },
  ];

  const dayLabels = ["M", "T", "W", "T", "F"];

  const investmentByDay = [
    { day: "Mon", values: [5, 5, 5, 4, 3] },
    { day: "Wed", values: [5, 5, 4, 3, 3] },
  ];

  const getShade = (value) => {

    const shades = ["#E3E8F0", "#CBD5E1", "#94A3B8", "#64748B", "#1E293B"];
    return shades[Math.min(Math.floor(value / 10), 4)];
  };

  return (
    <Card className="shadow-sm border-0">
      <CardBody>
        <CardTitle tag="h6">Investment Distribution</CardTitle>
        <div className="heatmap-table">
          <div className="heatmap-header">
            <span>Users</span>
            {dayLabels?.map((day, index) => (
              <span key={index}>{day}</span>
            ))}
          </div>
          {userDistribution?.map((row, rowIndex) => (
            <div className="heatmap-row" key={rowIndex}>
              <span>{row.users}</span>
              {dayLabels?.map((_, colIndex) => (
                <span
                  key={colIndex}
                  className="heatmap-cell"
                  style={{
                    backgroundColor: getShade(row.value - colIndex * 5),
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        <CardTitle tag="h6" className="mt-4">
          Investment by Day of Week
        </CardTitle>
        <div className="heatmap-table">
          {investmentByDay?.map((row, i) => (
            <div className="heatmap-row justify-between" key={i}>
              <span className="day-label">{row.day}</span>
              <div className="heatmap-cells">
                {row?.values?.map((val, j) => (
                  <span
                    key={j}
                    className="heatmap-cell"
                    style={{ backgroundColor: getShade(val * 10) }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default Investment;
