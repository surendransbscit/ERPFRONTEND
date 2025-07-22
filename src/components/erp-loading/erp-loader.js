import React, { useState, useEffect } from "react";
import { RevolvingDot, MutatingDots, RotatingLines, TailSpin } from "react-loader-spinner";

export const Loader = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: "33vh" }}>
      <MutatingDots height="100" width="100" color="#798bff" secondaryColor="#122499" ariaLabel="loading-indicator" />
    </div>
  );
};

const Loading = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {/* <InfinitySpin color="grey" /> */}
      {/* <MutatingDots height="100" width="100" color="#798bff" secondaryColor="#122499" ariaLabel="loading-indicator" /> */}
      {/* <RotatingLines width="100" strokeColor="#FF5733" /> */}
      <TailSpin color="blue" ariaLabel="loading-indicator" />
    </div>
  );
};

export default Loading;
