import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DvaRoot } from "./dva/component/dva";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <DvaRoot>
      <App />
    </DvaRoot>
  </React.StrictMode>
);
