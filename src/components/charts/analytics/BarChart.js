import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Filler, Legend, } from "chart.js";
Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Filler, Legend,);


export const BarChart = ({ sales }) => {
  return (
    <Bar
      className="sales-bar-chart chartjs-render-monitor"
      data={sales ? saleRevenue : activeSubscription}
      options={{
        plugins: {
          legend: {
              display: false,
          },
          tooltip: {
              enabled: true,
              displayColors: false,
              backgroundColor: "#eff6ff",
              titleFont: {
                size: '11px',
              },
              titleColor: "#6783b8",
              titleMarginBottom: 4,
              bodyColor: "#9eaecf",
              bodyFont: {
                size: '10px',
              },
              bodySpacing: 3,
              padding: 8,
              footerMarginTop: 0,
          },
        },
        scales: {
          y: {
              display: false,
            },
          x: {
              display: false,
            },
        },
        maintainAspectRatio: false,
      }}
    />
  );
};

export const saleRevenue = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  dataUnit: "USD",
  stacked: true,
  datasets: [
    {
      label: "Sales Revenue",
      width: "30",
      barPercentage: 0.7,
      categoryPercentage: 0.7,
      backgroundColor: [
        "rgba(133, 79, 255, 0.2)",
        "rgba(133, 79, 255, 0.2)",
        "rgba(133, 79, 255, 0.2)",
        "rgba(133, 79, 255, 0.2)",
        "rgba(133, 79, 255, 0.2)",
        "rgba(133, 79, 255, 0.2)",
        "rgba(133, 79, 255, 0.2)",
        "rgba(133, 79, 255, 0.2)",
        "rgba(133, 79, 255, 0.2)",
        "rgba(133, 79, 255, 0.2)",
        "rgba(133, 79, 255, 0.2)",
        "rgba(133, 79, 255, 1)",
      ],
      data: [11000, 8000, 12500, 5500, 9500, 14299, 11000, 8000, 12500, 5500, 9500, 14299],
    },
  ],
};

export const activeSubscription = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  dataUnit: "USD",
  stacked: true,
  datasets: [
    {
      label: "Active User",
      barPercentage: 0.7,
      categoryPercentage: 0.7,
      backgroundColor: [
        "rgba(133, 79, 255, 0.2)",
        "rgba(133, 79, 255, 0.2)",
        "rgba(133, 79, 255, 0.2)",
        "rgba(133, 79, 255, 0.2)",
        "rgba(133, 79, 255, 0.2)",
        "rgba(133, 79, 255, 1)",
      ],
      data: [8200, 7800, 9500, 5500, 9200, 9690],
    },
  ],
};

