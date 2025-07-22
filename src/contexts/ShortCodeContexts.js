import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const ShortCodeContext = createContext();

export const ShortCodeProvider = ({ children }) => {
  const {
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
  const [isShortCodeDisabled, setIsShortCodeDisabled] = useState(false);

  console.log(settings);

  useEffect(() => {
    if (settings?.is_short_code_req === 1) {
      setIsShortCodeDisabled(true);
    } else {
      setIsShortCodeDisabled(false);
    }
  }, [settings]);

  return (
    <ShortCodeContext.Provider value={{ isShortCodeDisabled, setIsShortCodeDisabled }}>
      {children}
    </ShortCodeContext.Provider>
  );
};

export const useShortCodeContext = () => useContext(ShortCodeContext);
