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

// ==================== IMPORT CÁC TRANG TAX OFFICER ====================
import TaxOfficerDashboard from './presentation/pages/tax-officer/TaxOfficerDashboard';
import TaxProcessing from './presentation/pages/tax-officer/TaxProcessing';
import PaymentManagement from './presentation/pages/tax-officer/PaymentManagement';
import TaxRecords from './presentation/pages/tax-officer/TaxRecords';
import ReportManagement from './presentation/pages/tax-officer/ReportManagement';
import ComplaintManagement from './presentation/pages/tax-officer/ComplaintManagement';

// ==================== IMPORT CÁC TRANG LAND OFFICER ====================
import LandOfficerDashboard from './presentation/pages/cadastral-officer/CadastralDashboard';
import CadastralReportStats from './presentation/pages/cadastral-officer/CadastralReportStats';
import ComplaintHandling from './presentation/pages/cadastral-officer/ComplaintHandling';
import DossierProcessing from './presentation/pages/cadastral-officer/DossierProcessing';
import LandPriceManagement from './presentation/pages/cadastral-officer/LandPriceManagement';
import LandRegistry from './presentation/pages/cadastral-officer/LandRegistry';
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
    // Admin đi lạc vào trang khác -> Đẩy về trang Dashboard của Admin
    if (role === 'ROLE_ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Tax Officer đi lạc vào trang khác -> Đẩy về trang Dashboard của Tax Officer
    if (role === 'ROLE_TAX_OFFICER') {
      return <Navigate to="/tax-officer/dashboard" replace />;
    }
    // Land Officer đi lạc vào trang khác -> Đẩy về trang Dashboard của Land Officer
    if (role === 'ROLE_LAND_OFFICER') {
      return <Navigate to="/dashboard" replace />;
    }
    // User đi lạc vào trang khác -> Đẩy về trang chủ User
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
      navigate('/admin/dashboard');
    } else if (role === 'ROLE_TAX_OFFICER') {
      navigate('/tax-officer/dashboard');
    } else if (role === 'ROLE_LAND_OFFICER') {
    navigate('/dashboard');
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

      {/* ==================== PROTECTED TAX OFFICER ==================== */}
      <Route 
        path="/tax-officer/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_TAX_OFFICER']}>
            <TaxOfficerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tax-officer/tax-processing" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_TAX_OFFICER']}>
            <TaxProcessing />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tax-officer/payment-management" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_TAX_OFFICER']}>
            <PaymentManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tax-officer/tax-records" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_TAX_OFFICER']}>
            <TaxRecords />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tax-officer/report-management" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_TAX_OFFICER']}>
            <ReportManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tax-officer/complaint-management" 
        element={
          <ProtectedRoute allowedRoles={['ROLE_TAX_OFFICER']}>
            <ComplaintManagement />
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

      {/* ==================== PROTECTED LAND OFFICER ==================== */}
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute allowedRoles={['ROLE_LAND_OFFICER']}><LandOfficerDashboard /></ProtectedRoute>} 
      />

      <Route 
        path="/cadastral-reports" 
        element={<ProtectedRoute allowedRoles={['ROLE_LAND_OFFICER']}><CadastralReportStats /></ProtectedRoute>} 
      />

      <Route 
        path="/digital-cadastral-map" 
        element={<ProtectedRoute allowedRoles={['ROLE_LAND_OFFICER']}><LandRegistry /></ProtectedRoute>} 
      />

      <Route 
        path="/land-price-management" 
        element={<ProtectedRoute allowedRoles={['ROLE_LAND_OFFICER']}><LandPriceManagement /></ProtectedRoute>} 
      />

      <Route 
        path="/cadastral-records" 
        element={<ProtectedRoute allowedRoles={['ROLE_LAND_OFFICER']}><DossierProcessing /></ProtectedRoute>} 
      />

      <Route 
        path="/cadastral-complaints" 
        element={<ProtectedRoute allowedRoles={['ROLE_LAND_OFFICER']}><ComplaintHandling /></ProtectedRoute>} 
      />

      {/* ==================== FALLBACK ROUTE ==================== */}
      <Route
        path="*"
        element={
          localStorage.getItem('token') 
            ? (localStorage.getItem('role') === 'ROLE_ADMIN' 
                ? <Navigate to="/admin/dashboard" replace />
                : localStorage.getItem('role') === 'ROLE_TAX_OFFICER'
                ? <Navigate to="/tax-officer/dashboard" replace />
                : localStorage.getItem('role') === 'ROLE_LAND_OFFICER'
                ? <Navigate to="/dashboard" replace />
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