import React from "react";
import { createRoot } from "react-dom/client";
import "driver.js/dist/driver.css";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
