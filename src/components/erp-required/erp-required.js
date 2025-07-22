import React, { useState, useEffect, memo } from "react";

const IsRequired = () => {
  return (
    <React.Fragment>
      <span style={{ color: "red", fontWeight: "bold", fontSize: "larger" }}>
        *
      </span>
    </React.Fragment>
  );
};

export default memo(IsRequired);
