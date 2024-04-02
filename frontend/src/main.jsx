import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ApiDataProvider } from "./context/ApiContext.jsx";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  //if you use strict mode it re-renders you components twice during development mode to detect potential problems
  <>
    <ApiDataProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApiDataProvider>
  </>
);
