import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';

// ==================== IMPORT CÁC TRANG USER ====================
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
import AccountPage from './presentation/pages/user/AccountPage';

// ==================== IMPORT CÁC TRANG ADMIN ====================
import AdminReportStats from './presentation/pages/admin/AdminReportStats';
import AdminDashboard from './presentation/pages/admin/AdminDashboard';
import CategoryManagement from './presentation/pages/admin/CategoryManagement';
import OperationHistory from './presentation/pages/admin/OperationHistory';
import RoleDelegation from './presentation/pages/admin/RoleDelegation';
import UserManagement from './presentation/pages/admin/UserManagement';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

// 1. NÂNG CẤP PROTECTED ROUTE ĐỂ BẢO VỆ THEO ROLE
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Chưa đăng nhập -> Về trang Login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Nếu route có yêu cầu quyền cụ thể, mà người dùng không có quyền đó
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Admin đi lạc vào trang User -> Đẩy về trang Dashboard của Admin
    if (role === 'ROLE_ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // User đi lạc vào trang Admin -> Đẩy về trang chủ User
    return <Navigate to="/home" replace />;
  }

  // Hợp lệ
  return children;
};

// AppRoutes
const AppRoutes = () => {
  const navigate = useNavigate();

  // 2. CHUYỂN HƯỚNG LINH HOẠT THEO ROLE SAU KHI ĐĂNG NHẬP
  const handleLoginSuccess = () => {
    const role = localStorage.getItem('role');
    if (role === 'ROLE_ADMIN') {
      navigate('/admin/dashboard'); // Đổi trang mặc định của Admin thành Dashboard
    } else {
      navigate('/home');
    }
  };

  return (
    <Routes>
      {/* ==================== PUBLIC ==================== */}
      <Route 
        path="/" 
        element={<LoginPage onLoginSuccess={handleLoginSuccess} />} 
      />

      {/* ==================== PROTECTED ADMIN ==================== */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/report-stats" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminReportStats />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/categories" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <CategoryManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/operations" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <OperationHistory />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/roles" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <RoleDelegation />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <UserManagement />
          </ProtectedRoute>
        } 
      />

      {/* ==================== PROTECTED USER ==================== */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_CITIZEN']}>
            <HomePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/land-tax" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_CITIZEN']}>
            <LandTaxPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/land-information" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_CITIZEN']}>
            <LandInformationPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tax" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_CITIZEN']}>
            <TaxPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/payment" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_CITIZEN']}>
            <PaymentPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/search" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_CITIZEN']}>
            <SearchPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/account" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_CITIZEN']}>
            <AccountPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/property-declaration" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_CITIZEN']}>
            <PropertyDeclarationPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/submit-declaration" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_CITIZEN']}>
            <SubmitDeclarationPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/complaint" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_CITIZEN']}>
            <ComplaintPage />
          </ProtectedRoute>
        } 
      />

      {/* ==================== FALLBACK ROUTE ==================== */}
      <Route
        path="*"
        element={
          localStorage.getItem('token') 
            ? (localStorage.getItem('role') === 'ROLE_ADMIN' 
                ? <Navigate to="/admin/dashboard" replace /> 
                : <Navigate to="/home" replace />)
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