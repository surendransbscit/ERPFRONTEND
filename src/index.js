import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./App";
import { Provider } from "react-redux";

import "./assets/scss/dashlite.scss";
import "./assets/scss/style-email.scss";
import "./index.css"
import reportWebVitals from "./reportWebVitals";
import { store } from "./redux/storeConfig";
// import store, { persistor } from "./redux/storeSetup";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={store}>
    {/* <Provider store={store}> */}
      {/* <PersistGate loading={null} persistor={persistor}> */}
        <App />
      {/* </PersistGate> */}
    </Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
