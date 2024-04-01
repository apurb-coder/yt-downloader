import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ApiDataProvider } from "./context/ApiContext.jsx";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApiDataProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApiDataProvider>
  </React.StrictMode>
);
