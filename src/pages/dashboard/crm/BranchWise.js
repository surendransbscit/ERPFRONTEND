import React, { useEffect, useState, useRef } from "react";
import { PreviewCard } from "../../../components/Component";
import { BarChart } from "@mui/x-charts/BarChart";
import { useDispatch, useSelector } from "react-redux";
import { getBranchWiseSchemeJoined } from "../../../redux/thunks/dashboard";
import { useNavigate } from "react-router-dom";

// Function to dynamically calculate width based on parent container
const calculateChartWidth = (containerRef) => {
  return containerRef.current ? containerRef.current.offsetWidth : 600; // Default fallback width
};

const BranchWise = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { branchWiseSchemeJoinedList } = useSelector((state) => state.dashboardReducer);
  const containerRef = useRef(null); // Reference to the chart container

  const [chartWidth, setChartWidth] = useState(600); // Initial width
    const handleBarClick = (event, barData) => {
        const branchId = barData.id; 
    const branchName = barData.name; 
    
    navigate(`${process.env?.PUBLIC_URL}/crm/dashboard/reports/branchwise`, { 
      state: { 
        branchName: branchName,
        count: barData.count 
      } 
    });
    };

  // Handle sidebar toggle and window resize to adjust chart width dynamically
  useEffect(() => {
    const handleResize = () => {
      setChartWidth(calculateChartWidth(containerRef));
    };

    // Fetch data and calculate initial width
    dispatch(getBranchWiseSchemeJoined());
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
      <h6 className=" text-dark ">Branch Wise</h6>
      {/* Use ref to measure the container width */}
      <div ref={containerRef} style={{ marginTop: "-40px" }}>
        <BarChart
          dataset={branchWiseSchemeJoinedList}
          yAxis={[{ scaleType: "band", dataKey: "name" }]}
          series={[{ dataKey: "count", valueFormatter, color: "#3498db", highlightScope: { highlighted: "item", faded: "global" },
          }]}
          layout="horizontal"
          {...chartSetting}
          onItemClick={handleBarClick} // Add click handler
        />
      </div>
    </PreviewCard>
  );
};

export default BranchWise;
