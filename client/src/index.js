import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import App from "./App";
import {  Provider } from "react-redux";
import { createBrowserHistory } from "history";
import store from "./redux/store";
import "assets/scss/material-dashboard-pro-react.scss?v=1.7.0";
import "./css/global.css";

const hist = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
    <Router history={hist}>
      <App/>
    </Router>
  </Provider>,
  document.getElementById("root")
);
