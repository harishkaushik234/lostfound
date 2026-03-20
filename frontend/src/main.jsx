import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";

const theme = localStorage.getItem("lost-found-theme") || "dark";
document.documentElement.classList.toggle("dark", theme === "dark");
document.documentElement.classList.toggle("light", theme === "light");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
