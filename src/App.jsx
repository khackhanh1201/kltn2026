import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';

// Import các trang
import LoginPage from './presentation/pages/LoginPage';
import HomePage from './presentation/pages/HomePage';
import LandTaxPage from './presentation/pages/user/LandTaxPage';
import TaxPage from './presentation/pages/user/TaxPage';
import LandInformationPage from './presentation/pages/user/LandInformationPage';
import PropertyDeclarationPage from './presentation/pages/user/PropertyDeclarationPage';
import SubmitDeclarationPage from './presentation/pages/user/SubmitDeclarationPage';
import ComplaintPage from './presentation/pages/user/ComplaintPage';
import PaymentPage from './presentation/pages/user/PaymentPage';
import SearchPage from './presentation/pages/user/SearchPage';
import AccountPage from './presentation/pages/user/AccountPage';   // ← Trang Tài khoản

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

// Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
};

// AppRoutes
const AppRoutes = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/home');
  };

  return (
    <Routes>
      {/* ==================== PUBLIC ==================== */}
      <Route 
        path="/" 
        element={<LoginPage onLoginSuccess={handleLoginSuccess} />} 
      />

      {/* ==================== PROTECTED ==================== */}

      {/* Trang chủ */}
      <Route 
        path="/home" 
        element={<ProtectedRoute><HomePage /></ProtectedRoute>} 
      />

      {/* Đất đai - Tổng quan */}
      <Route 
        path="/land-tax" 
        element={<ProtectedRoute><LandTaxPage /></ProtectedRoute>} 
      />

      {/* Thông tin đất đai */}
      <Route 
        path="/land-information" 
        element={<ProtectedRoute><LandInformationPage /></ProtectedRoute>} 
      />

      {/* Thuế đất */}
      <Route 
        path="/tax" 
        element={<ProtectedRoute><TaxPage /></ProtectedRoute>} 
      />

      {/* Thanh toán */}
      <Route 
        path="/payment" 
        element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} 
      />

      {/* Tra cứu tổng hợp */}
      <Route 
        path="/search" 
        element={<ProtectedRoute><SearchPage /></ProtectedRoute>} 
      />

      {/* Tài khoản */}
      <Route 
        path="/account" 
        element={<ProtectedRoute><AccountPage /></ProtectedRoute>} 
      />

      {/* Kê khai tài sản / Hồ sơ đất đai */}
      <Route 
        path="/property-declaration" 
        element={<ProtectedRoute><PropertyDeclarationPage /></ProtectedRoute>} 
      />

      {/* Nộp hồ sơ mới (Wizard 4 bước) */}
      <Route 
        path="/submit-declaration" 
        element={<ProtectedRoute><SubmitDeclarationPage /></ProtectedRoute>} 
      />

      {/* Khiếu nại */}
      <Route 
        path="/complaint" 
        element={<ProtectedRoute><ComplaintPage /></ProtectedRoute>} 
      />

      {/* Fallback Route */}
      <Route
        path="*"
        element={
          localStorage.getItem('token') 
            ? <Navigate to="/home" replace /> 
            : <Navigate to="/" replace />
        }
      />
    </Routes>
  );
};

// Root App
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