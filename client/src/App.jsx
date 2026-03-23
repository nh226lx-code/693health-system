import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import HealthForm from "./pages/HealthForm";
import Chart from "./pages/Chart";
import Advice from "./pages/Advice";
import History from "./pages/History";
import Stats from "./pages/Stats";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/data-entry" element={<HealthForm />} />
      <Route path="/analysis" element={<Chart />} />
      <Route path="/advice" element={<Advice />} />
      <Route path="/history" element={<History />} />
      <Route path="/stats" element={<Stats />} />
    </Routes>
  );
}