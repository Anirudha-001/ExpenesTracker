
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import './index.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <App />
    <ToastContainer position="top-right" autoClose={2500} />
  </>
);
