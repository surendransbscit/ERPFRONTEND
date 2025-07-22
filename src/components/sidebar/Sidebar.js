import React from "react";
import SimpleBar from "simplebar-react";

const Sidebar = ({ toggleState, width, ...props }) => {
  return (
    <React.Fragment>
      <div
        className={`card-aside card-aside-right user-aside toggle-slide toggle-slide-right toggle-break-xxl ${
          toggleState && "content-active"
        }`}
        data-content="userAside"
        data-toggle-screen="xxl"
        data-toggle-overlay="true"
        data-toggle-body="true"
        id="sidePanel_01"
        style={{
          width: width, // Increased width from default
          padding: "10px", // Added padding to improve alignment
        }}
      >
        <SimpleBar className="card-inner-group">
          <div style={{ padding: "20px" }}>{props.children}</div>
        </SimpleBar>
      </div>
    </React.Fragment>
  );
};
export default Sidebar;
