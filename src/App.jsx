import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './presentation/pages/LoginPage';
import HomePage from './presentation/pages/HomePage';
import LandTaxPage from './presentation/pages/LandTaxPage';
import PropertyDeclarationPage from './presentation/pages/PropertyDeclarationPage';
import ComplaintPage from './presentation/pages/ComplaintPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

// ── Protected Route ──
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
};

// ── AppRoutes (cần bọc trong Router để dùng useNavigate) ──
const AppRoutes = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (userData) => {
    console.log('Đăng nhập thành công:', userData);
    navigate('/home');
  };

  return (
    <Routes>
      {/* Trang đăng nhập */}
      <Route
        path="/"
        element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
      />

      {/* Trang chủ */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      {/* Thuế đất */}
      <Route
        path="/land-tax"
        element={
          <ProtectedRoute>
            <LandTaxPage />
          </ProtectedRoute>
        }
      />

      {/* Kê khai tài sản */}
      <Route
        path="/property-declaration"
        element={
          <ProtectedRoute>
            <PropertyDeclarationPage />
          </ProtectedRoute>
        }
      />

      {/* Khiếu nại */}
      <Route
        path="/complaint"
        element={
          <ProtectedRoute>
            <ComplaintPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback — mọi route không khớp đều về trang đăng nhập */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// ── App root ──
function App() {
  return (
    <Router>
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;