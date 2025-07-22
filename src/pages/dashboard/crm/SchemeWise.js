import React, { useEffect, useRef, useState } from "react";
import { PreviewCard } from "../../../components/Component";
import { BarChart } from "@mui/x-charts/BarChart";
import { useDispatch, useSelector } from "react-redux";
import { getSchemeWiseJoined } from "../../../redux/thunks/dashboard";
import { useNavigate } from "react-router-dom";

// Function to dynamically calculate width based on parent container
const calculateChartWidth = (containerRef) => {
  return containerRef.current ? containerRef.current.offsetWidth : 500; // Default fallback width
};


const SchemeWise = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { schemeWiseJoinedList } = useSelector((state) => state.dashboardReducer);
  const containerRef = useRef(null); // Reference to the chart container

  const [chartWidth, setChartWidth] = useState(500); // Initial width

  const handleBarClick = (event, { data }) => {
    navigate(`${process.env?.PUBLIC_URL}/crm/dashboard/reports/schemewise`, {
      // state: {
      //   scheme: data.name, // or item.scheme_name based on your data key
      // },
    });
  };


  // Handle sidebar toggle and window resize to adjust chart width dynamically
  useEffect(() => {
    const handleResize = () => {
      setChartWidth(calculateChartWidth(containerRef));
    };

    // Fetch data and calculate initial width
    dispatch(getSchemeWiseJoined());
    setChartWidth(calculateChartWidth(containerRef));

    // Listen for window resize events
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  const chartSetting = {
    xAxis: [
      {
        label: "Accounts",
      },
    ],
    width: chartWidth, // Adjusted width
    height: 240,
    margin: { left: 100 }
  };

  const valueFormatter = (value) => `${value}`;

  return (
    <PreviewCard>
      <h6 className=" text-dark ">Scheme Wise</h6>
      <div ref={containerRef} style={{ marginTop: "-40px" }}>
        <BarChart 
          dataset={schemeWiseJoinedList}
          yAxis={[{ scaleType: "band", dataKey: "shortcode" }]}
          series={[{ dataKey: "count", valueFormatter, color: "#34985b" ,highlightScope: { highlighted: "item", faded: "global" }}]}
          layout="horizontal"
          {...chartSetting}
          onItemClick={handleBarClick}
        />
      </div>
    </PreviewCard>
  );
};

export default SchemeWise;

export const dataset = [
  {
    london: 59,
    paris: 57,
    newYork: 86,
    scheme: 21,
    month: "MKD01",
  },
  {
    london: 50,
    paris: 52,
    newYork: 78,
    scheme: 28,
    month: "KRGS1",
  },
  {
    london: 47,
    paris: 53,
    newYork: 106,
    scheme: 41,
    month: "MKKA4",
  },
  {
    london: 61,
    paris: 70,
    newYork: 103,
    scheme: 25,
    month: "HPPY1",
  },
];
