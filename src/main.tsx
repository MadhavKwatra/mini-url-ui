import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { BrowserRouter as Router } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { Analytics } from "@vercel/analytics/react";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
        <Analytics />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
