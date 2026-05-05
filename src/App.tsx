import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";   // ← add this
import Auth from "./pages/admin/Auth";
import Dashboard from "./pages/task/Dashboard";

const isTokenValid = () => {
  const token = localStorage.getItem("access");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  } catch {
    return false;
  }
};

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  return isTokenValid() ? children : <Navigate to="/" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactElement }) => {
  return isTokenValid() ? <Navigate to="/dashboard" replace /> : children;
};

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;