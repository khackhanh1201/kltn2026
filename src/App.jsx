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

// Import trang Admin
import AdminDashboard from './presentation/pages/admin/AdminDashboard';
import AdminReportStats from './presentation/pages/admin/AdminReportStats';
import CategoryManagement from './presentation/pages/admin/CategoryManagement';
import OperationHistory from './presentation/pages/admin/OperationHistory';
import RoleDelegation from './presentation/pages/admin/RoleDelegation';
import UserManagement from './presentation/pages/admin/UserManagement';

// Import trang Cán bộ địa chính
import CadastralDashboard from './presentation/pages/cadastral-officer/CadastralDashboard';
import CadastralReportStats from './presentation/pages/cadastral-officer/CadastralReportStats';
import ComplaintHandling from './presentation/pages/cadastral-officer/ComplaintHandling';
import DossierProcessing from './presentation/pages/cadastral-officer/DossierProcessing';
import LandPriceManagement from './presentation/pages/cadastral-officer/LandPriceManagement';
import LandRegistry from './presentation/pages/cadastral-officer/LandRegistry';

// Import trang Cán bộ thuế
import TaxOfficerDashboard from './presentation/pages/tax-officials/TaxOfficerDashboard';
import ComplaintManagement from './presentation/pages/tax-officials/ComplaintManagement';
import PaymentManagement from './presentation/pages/tax-officials/PaymentManagement';
import ReportManagement from './presentation/pages/tax-officials/ReportManagement';
import TaxProcessing from './presentation/pages/tax-officials/TaxProcessing';
import TaxRecords from './presentation/pages/tax-officials/TaxRecords';
import TaxOfficerAccountPage from './presentation/pages/tax-officials/TaxOfficerAccountPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

// Lấy đường dẫn redirect dựa theo activeRole
const getRoleHomePath = (activeRole) => {
  switch (activeRole) {
    case 'ROLE_ADMIN':        return '/admin/dashboard';
    case 'ROLE_LAND_OFFICER': return '/cadastral/dashboard';
    case 'ROLE_TAX_OFFICER':  return '/tax-officer/dashboard';
    default:                  return '/home';
  }
};

// Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;
  return children;
};

// AppRoutes
const AppRoutes = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (userData) => {
    const activeRole = userData?.activeRole || userData?.data?.activeRole;
    navigate(getRoleHomePath(activeRole));
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

      {/* ==================== ADMIN ==================== */}
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/report-stats" element={<ProtectedRoute><AdminReportStats /></ProtectedRoute>} />
      <Route path="/admin/category-management" element={<ProtectedRoute><CategoryManagement /></ProtectedRoute>} />
      <Route path="/admin/operation-history" element={<ProtectedRoute><OperationHistory /></ProtectedRoute>} />
      <Route path="/admin/role-delegation" element={<ProtectedRoute><RoleDelegation /></ProtectedRoute>} />
      <Route path="/admin/user-management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />

      {/* ==================== CÁN BỘ ĐỊA CHÍNH ==================== */}
      <Route path="/cadastral/dashboard" element={<ProtectedRoute><CadastralDashboard /></ProtectedRoute>} />
      <Route path="/cadastral/report-stats" element={<ProtectedRoute><CadastralReportStats /></ProtectedRoute>} />
      <Route path="/cadastral/complaint-handling" element={<ProtectedRoute><ComplaintHandling /></ProtectedRoute>} />
      <Route path="/cadastral/dossier-processing" element={<ProtectedRoute><DossierProcessing /></ProtectedRoute>} />
      <Route path="/cadastral/land-price-management" element={<ProtectedRoute><LandPriceManagement /></ProtectedRoute>} />
      <Route path="/cadastral/land-registry" element={<ProtectedRoute><LandRegistry /></ProtectedRoute>} />

      {/* ==================== CÁN BỘ THUẾ ==================== */}
      <Route path="/tax-officer/dashboard" element={<ProtectedRoute><TaxOfficerDashboard /></ProtectedRoute>} />
      <Route path="/tax-officer/complaint-management" element={<ProtectedRoute><ComplaintManagement /></ProtectedRoute>} />
      <Route path="/tax-officer/payment-management" element={<ProtectedRoute><PaymentManagement /></ProtectedRoute>} />
      <Route path="/tax-officer/report-management" element={<ProtectedRoute><ReportManagement /></ProtectedRoute>} />
      <Route path="/tax-officer/tax-processing" element={<ProtectedRoute><TaxProcessing /></ProtectedRoute>} />
      <Route path="/tax-officer/tax-records" element={<ProtectedRoute><TaxRecords /></ProtectedRoute>} />
      <Route path="/tax-officer/account" element={<ProtectedRoute><TaxOfficerAccountPage /></ProtectedRoute>} />

      {/* Fallback Route */}
      <Route
        path="*"
        element={(() => {
          const token = localStorage.getItem('token');
          if (!token) return <Navigate to="/" replace />;
          const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
          return <Navigate to={getRoleHomePath(userInfo.activeRole)} replace />;
        })()}
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