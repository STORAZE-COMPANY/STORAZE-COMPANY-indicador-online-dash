import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./Router";
import "./index.css";
import { AppProvider } from "./contexts";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <AppRouter />
    </AppProvider>
  </React.StrictMode>
);
