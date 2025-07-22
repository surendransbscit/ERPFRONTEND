import React from "react";
import { Button, Row, Col } from "reactstrap";
import { Icon, Sidebar } from "../Component";
import FilterSidebarWithTabs from "./FilterSidebarWithTabs";
import FilterSidebarWithoutTabs from "./FilterSidebarWithoutTabs";

const FilterSidebar = ({ sideBar, toggle, children }) => {
  const { register, getData, ...props } = children;

  const handleFilterClick = () => {
    getData();
    toggle();
  };

  return (
    <>
      <Sidebar
        toggleState={sideBar}
        width={props?.isFilterWithTabs ? "670px" : "500px"}
        // style={{
        //   display: "flex",
        //   flexDirection: "column",
        //   height:'auto',
        // }}
      >
        <div
          className="sidebar-header d-flex justify-content-between align-items-center p-2"
          style={{
            marginBottom: "20px",
            backgroundColor: "#F0F2F5",
            borderBottom: "1px solid #E5E5E5",
          }}
        >
          <h5 className="m-0" style={{ fontWeight: "600", fontSize: "16px" }}>
            Filters
          </h5>
          <button
            className="close d-flex justify-content-end"
            onClick={toggle}
            aria-label="Close"
            style={{
              background: "none",
              border: "none",
              fontSize: "16px",
              color: "#6c757d",
              cursor: "pointer",
            }}
          >
            <Icon name="cross" />
          </button>
        </div>
        <Row
          className="g-gs"
          style={{
            // marginTop: "250px",
            marginBottom: "20px",
            position: "sticky",
          }}
        >
          <Col md={12} className="text-center">
            <Button
              type="button"
              onClick={handleFilterClick}
              className="btn btn-secondary w-100"
            >
              <span className="d-flex justify-content-center">FILTER</span>
            </Button>
          </Col>
        </Row>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            height: "150vh",
          }}
        >
          {props?.isFilterWithTabs ? (
            <FilterSidebarWithTabs toggle={toggle} children={children} />
          ) : (
            <FilterSidebarWithoutTabs toggle={toggle} children={children} />
          )}
        </div>

        {/* <Row
          className="g-gs"
          style={{ marginTop: "250px", marginBottom: "0px" }}
        >
          <Col md={12} className="text-center">
            <div className="form-group" style={{ width: "100%" }}>
              <Button
                type="button"
                onClick={handleFilterClick}
                className="btn btn-secondary w-100"
                style={{ textAlign: "center" }} 
              >
                <span className="d-flex justify-content-center">FILTER</span>{" "}
                
              </Button>
            </div>
          </Col>
        </Row> */}

        {/* <div
          style={{
            // marginTop: "250px",
            position: "sticky",
            bottom: "0",
            backgroundColor: "#fff",
            padding: "16px",
            borderTop: "1px solid #E5E5E5",
          }}
        > */}
        {/* <Row
          className="g-gs"
          style={{
            marginTop: "250px",
            marginBottom: "0px",
            position: "sticky",
          }}
        >
          <Col md={12} className="text-center">
            <Button
              type="button"
              onClick={handleFilterClick}
              className="btn btn-secondary w-100"
            >
              <span className="d-flex justify-content-center">FILTER</span>
            </Button>
          </Col>
        </Row> */}
        {/* </div> */}
      </Sidebar>
      {sideBar && (
        <div className="toggle-overlay" onClick={() => toggle()}></div>
      )}
    </>
  );
};

export default FilterSidebar;