import React, { useState, useRef, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./CustomDateRangePicker.css";
import { startOfYear, endOfYear } from "date-fns";

export const DateRangePickerInput = ({ startDate, endDate, onChange }) => {
  const [dateRange, setDateRange] = useState([
    {
      startDate: startDate || new Date(),
      endDate: endDate || new Date(),
      key: "selection",
    },
  ]);
  const [open, setOpen] = useState(false);
  const pickerRef = useRef(null);

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
    if (onChange) {
      onChange({
        startDate: ranges.selection.startDate,
        endDate: ranges.selection.endDate,
      });
    }
  };

  const toggleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pickerRef]);

  const inputStyle = {
    padding: "6px 10px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const pickerStyle = {
    position: "absolute",
    zIndex: 1000,
    background: "white",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "10px",
  };

  const handleApply = () => {
    if (onChange) {
      onChange({
        startDate: dateRange[0].startDate,
        endDate: dateRange[0].endDate,
      });
    }
    setOpen(false);
  };

  return (
    <>
      <input
        type="text"
        readOnly
        value={`${format(dateRange[0].startDate, "dd/MM/yyyy")} - ${format(
          dateRange[0].endDate,
          "dd/MM/yyyy"
        )}`}
        onClick={toggleOpen}
        style={inputStyle}
      />
      {open && (
        <div ref={pickerRef} style={pickerStyle}>
          <div className="custom-date-range-picker">
            <DateRangePicker
              ranges={dateRange}
              onChange={handleSelect}
              moveRangeOnFirstSelection={true}
              rangeColors={["#3f51b5"]}
              inputRanges={[]}
              minDate={new Date("2020-01-01")}
              maxDate={endOfYear(new Date())}
            />
            <div
              style={{
                textAlign: "left",
                marginTop: "-34px",
                marginLeft: "20px",
              }}
            >
              <button
                onClick={handleApply}
                style={{
                  padding: "6px 12px",
                  background: "#3f51b5",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
