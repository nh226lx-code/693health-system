import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DataEntry from "./pages/DataEntry";
import Analysis from "./pages/Analysis";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/data-entry" element={<DataEntry />} />
      <Route path="/analysis" element={<Analysis />} />
    </Routes>
  );
}