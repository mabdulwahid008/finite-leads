import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import './assets/additional/global.css'

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import App from "App";
import LeadMap from "components/leadMap/LeadMap";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
      {/* <App /> */}
      <LeadMap />
  </BrowserRouter>
);
