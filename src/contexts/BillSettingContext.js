import React, { createContext, useContext, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toastsuccess } from "../components/sds-toast-style/toast-style";
import { useSelector } from "react-redux";

const BillSettingContext = createContext();

const STORAGE_KEY = "billSettingType";

export const BillSettingProvider = ({ children }) => {
  const {
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
  const saved = localStorage.getItem(STORAGE_KEY);
  const [billSettingType, setBillSettingType] = useState();
  // const [billSettingType, setBillSettingType] = useState(() => {
  //   return saved !== null && saved !== undefined
  //     ? saved
  //     : settings?.default_login_type;
  // });
  // const [billSettingType, setBillSettingType] = useState(() => {
  //   const saved = localStorage.getItem(STORAGE_KEY);
  //   return saved !== null && saved !== undefined ? parseInt(saved) : parseInt(settings?.default_login_type);
  // });

  useEffect(() => {
    // if (settings?.default_login_type) {
    setBillSettingType(parseInt(settings?.default_login_type) === 1 ? 1 : 0);
    // }
    // setBillSettingType(settings?.default_login_type);
  }, [settings?.default_login_type]);

  useEffect(() => {
    if (
      settings?.default_login_type !== undefined &&
      billSettingType !== undefined
    ) {
      localStorage.setItem(STORAGE_KEY, billSettingType);
    }
  }, [billSettingType, settings?.default_login_type]);

  useHotkeys("ctrl+.", (event) => {
    event.preventDefault();
    setBillSettingType((prev) => {
      const newValue = prev === 1 ? 0 : 1;
      // toastsuccess("Bill Settings Updated.");
      return newValue;
    });
  });

  return (
    <BillSettingContext.Provider
      value={{ billSettingType, setBillSettingType }}
    >
      {children}
    </BillSettingContext.Provider>
  );
};

export const useBillSettingContext = () => useContext(BillSettingContext);