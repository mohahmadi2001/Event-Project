import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import { AuthProvider } from "./Components/AuthContext";
import "./index.css";
import App from "./App";

const initialLoggedInState = !!localStorage.getItem("authToken");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider initialLoggedInState={initialLoggedInState}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
