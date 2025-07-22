import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const WordTransformerContext = createContext();

const WordTransformerProvider = ({ children }) => {
  const {
    userInfo: { settings },
  } = useSelector((state) => state.authUserReducer);
  const [transformerValue, setTransformerValue] = useState(2);

  useEffect(() => {
    setTransformerValue(settings?.master_words_type);
  }, [settings]);

  const transformWord = (e) => {
    if (transformerValue == 1) {
      return e.toUpperCase();
    } else if (transformerValue == 2) {
      return e.replace(/^(\w)(\w*)/, (_, first, rest) => first.toUpperCase() + rest.toLowerCase());
    } else if (transformerValue == 3) {
      return e
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } else {
      e.toLowerCase();
    }
  };

  return (
    <WordTransformerContext.Provider value={{ transformerValue, setTransformerValue, transformWord }}>
      {children}
    </WordTransformerContext.Provider>
  );
};

export default WordTransformerProvider;
