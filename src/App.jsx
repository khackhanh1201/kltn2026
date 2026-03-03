import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './presentation/pages/LoginPage';
import HomePage from './presentation/pages/HomePage';
import LandTaxPage from './presentation/pages/LandTaxPage'; // Đảm bảo đường dẫn chính xác
import PropertyDeclarationPage from './presentation/pages/PropertyDeclarationPage';
import ComplaintPage from './presentation/pages/ComplaintPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

// Component bao bọc để có thể sử dụng hook useNavigate
const AppRoutes = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (userData) => {
    console.log("Đăng nhập thành công, chuyển hướng...");
    navigate('/home'); // Thực hiện chuyển trang tại đây
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={<LoginPage onLoginSuccess={handleLoginSuccess} />} 
      />
      
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } 
      />
      <Route path="/land-tax" element={<ProtectedRoute><LandTaxPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/property-declaration" element={<ProtectedRoute><PropertyDeclarationPage /></ProtectedRoute>} />
      <Route path="/complaint" element={<ProtectedRoute><ComplaintPage /></ProtectedRoute>} />
    </Routes>
  );
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
};

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