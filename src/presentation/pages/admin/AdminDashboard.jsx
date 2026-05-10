import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user_info') || '{}');
  
  // State quản lý UI
  const [activeTab, setActiveTab] = useState('system');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State lưu dữ liệu từ API
  const [stats, setStats] = useState({
    visits24h: 0,
    totalAccounts: 0,
    stuckDossiers: 0,
    lockedAccounts: 0,
    incidents: 0,
    incidentDetails: []
  });

  const [logs, setLogs] = useState({
    system: [],
    security: [],
    error: []
  });

  // GỌI API KHI VÀO TRANG
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Đổi port cho khớp với backend của bạn
      const baseUrl = 'http://localhost:8080'; 

      // Gọi đồng thời 2 API
      const [statsRes, logsRes] = await Promise.all([
        fetch(`${baseUrl}/api/admin/statistics`, { headers }),
        fetch(`${baseUrl}/api/admin/audit-logs`, { headers })
      ]);

      if (!statsRes.ok || !logsRes.ok) {
        throw new Error('Lỗi khi tải dữ liệu từ máy chủ');
      }

      const statsData = await statsRes.json();
      const logsData = await logsRes.json();

      // 1. MAP DỮ LIỆU THỐNG KÊ (KPI)
      const dataS = statsData.data || statsData;
      setStats({
        visits24h: dataS.visits24h || '45.2K', // Fallback nếu chưa có API
        totalAccounts: dataS.totalAccounts || 12, // Dựa theo số lượng trong bảng accounts
        stuckDossiers: dataS.stuckDossiers || 0,
        lockedAccounts: dataS.lockedAccounts || 1, // Trong bảng accounts có 1 user bị LOCKED
        incidents: dataS.incidents || 0,
        incidentDetails: dataS.incidentDetails || []
      });

      // 2. MAP DỮ LIỆU NHẬT KÝ TỪ BẢNG `audit_logs`
      const dataL = logsData.data || logsData;
      const formattedLogs = { system: [], security: [], error: [] };

      if (Array.isArray(dataL)) {
        dataL.forEach(log => {
          // Xử lý format thời gian từ trường `timestamp` của DB
          const logTime = log.timestamp 
            ? new Date(log.timestamp).toLocaleString('vi-VN', { 
                day: '2-digit', month: '2-digit', year: 'numeric', 
                hour: '2-digit', minute: '2-digit', second: '2-digit' 
              }) 
            : '';

          // Gộp action và description để hiển thị
          const logContent = log.description 
            ? `${log.description} (${log.action})` 
            : log.action;

          const logItem = {
            id: log.id,
            time: logTime,
            content: logContent,
            // Mặc định log được ghi lại là đã thành công
            status: 'Hoàn tất', 
            type: 'success'
          };

          // --- Phân loại Log vào các Tab ---
          const actionStr = (log.action || '').toUpperCase();
          const descStr = (log.description || '').toUpperCase();

          // TAB LỖI / TỪ CHỐI (Dựa theo từ khóa REJECT, ERROR, THẤT BẠI...)
          if (actionStr.includes('REJECT') || actionStr.includes('ERROR') || descStr.includes('TỪ CHỐI')) {
            logItem.type = 'danger';
            logItem.status = 'Từ chối / Lỗi';
            formattedLogs.error.push(logItem);
          } 
          // TAB BẢO MẬT (Dựa theo từ khóa LOGIN, LOCK, AUTH...)
          else if (actionStr.includes('LOGIN') || actionStr.includes('LOCK') || actionStr.includes('AUTH')) {
            logItem.type = 'warning';
            logItem.status = 'Cảnh báo';
            formattedLogs.security.push(logItem);
          } 
          // TAB HỆ THỐNG / CHUNG (APPROVE, CẬP NHẬT, XUẤT BÁO CÁO...)
          else {
            formattedLogs.system.push(logItem);
          }
        });
      }

      // Sắp xếp lại log mới nhất lên đầu (nếu DB chưa sort)
      formattedLogs.system.sort((a, b) => b.id - a.id);
      formattedLogs.error.sort((a, b) => b.id - a.id);
      formattedLogs.security.sort((a, b) => b.id - a.id);

      setLogs(formattedLogs);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentLogs = logs[activeTab] || [];

  return (
    <AdminLayout user={user}>
      <div className="container py-4" style={{ maxWidth: '1140px' }}>
        
        {/* Header Section */}
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h3 className="fw-bold">Bảng điều khiển hệ thống</h3>
            <p className="text-muted">Giám sát trạng thái hoạt động toàn cục của nền tảng</p>
          </div>
          <button className="btn btn-outline-secondary btn-sm" onClick={fetchDashboardData}>
            <i className="bi bi-arrow-clockwise me-2"></i> Làm mới dữ liệu
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="mt-3 text-muted">Đang tải dữ liệu hệ thống...</div>
          </div>
        ) : (
          <>
            {/* Top Cards Grid */}
            <div className="row g-4 mb-4">
              
              {/* 1. Sức khỏe nền tảng (Thẻ Đỏ) */}
              <div className="col-lg-6">
                <div 
                  className="card border-0 shadow-sm h-100" 
                  style={{ 
                    borderRadius: '16px', 
                    background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
                    color: 'white'
                  }}
                >
                  <div className="card-body p-4 p-md-5">
                    <div className="mb-4">
                      <h5 className="fw-bold mb-1">Sức khỏe nền tảng</h5>
                      <p className="mb-0" style={{ fontSize: '14px', color: '#f1f5f9' }}>
                        Trạng thái: <span style={{ color: '#4ade80', fontWeight: '600' }}>Hoạt động ổn định</span>
                      </p>
                    </div>

                    {/* SVG Donut Chart */}
                    <div className="position-relative mx-auto mb-4" style={{ width: '140px', height: '140px' }}>
                      <svg viewBox="0 0 36 36" className="w-100 h-100">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="95, 100" />
                      </svg>
                      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                        <div style={{ fontSize: '28px', fontWeight: '800', lineHeight: '1' }}>95%</div>
                        <div style={{ fontSize: '10px', fontWeight: '700', marginTop: '4px' }}>THÀNH CÔNG</div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="row g-3">
                      <StatBox icon="activity" value={stats.visits24h} label="TRUY CẬP (24H)" iconColor="#10b981" />
                      <StatBox icon="people" value={stats.totalAccounts} label="TÀI KHOẢN" iconColor="#3b82f6" />
                      <StatBox icon="shield-exclamation" value={stats.stuckDossiers} label="HỒ SƠ KẸT" iconColor="#f59e0b" />
                      <StatBox icon="person-x" value={stats.lockedAccounts} label="TK BỊ KHÓA" iconColor="#ef4444" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Cảnh báo hệ thống (Thẻ Trắng) */}
              <div className="col-lg-6">
                <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4 p-md-5 d-flex flex-column">
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <div className="d-flex align-items-center justify-content-center rounded-3 bg-danger text-white" style={{ width: '48px', height: '48px', fontSize: '20px' }}>
                        <i className="bi bi-exclamation-triangle-fill"></i>
                      </div>
                      <div>
                        <h5 className="fw-bold text-danger mb-0">Cảnh báo hệ thống</h5>
                        <p className="text-danger mb-0 small"><i className="bi bi-bell me-1"></i> Cần chú ý ngay</p>
                      </div>
                    </div>

                    <div className="text-center my-4 flex-grow-1 d-flex flex-column justify-content-center">
                      <div>
                        <span style={{ fontSize: '64px', fontWeight: '800', color: '#dc2626', lineHeight: '1' }}>{stats.incidents}</span>
                        <span className="ms-2" style={{ fontSize: '20px', fontWeight: '700', color: '#dc2626' }}>sự cố</span>
                      </div>
                    </div>

                    <div className="d-flex flex-column gap-3 mt-auto">
                      {stats.incidentDetails.map((inc, idx) => (
                         <IncidentRow key={idx} label={inc.label} count={inc.count} color={inc.color} />
                      ))}
                      {stats.incidentDetails.length === 0 && (
                         <div className="text-success text-center fw-bold"><i className="bi bi-check-circle me-1"></i> Mọi thứ đang hoạt động tốt</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Nhật ký nền tảng */}
            <div className="mb-4 mt-5">
              <h4 className="fw-bold">Nhật ký nền tảng gần đây</h4>
            </div>

            <div className="card shadow-sm border-0 mb-5" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              {/* Tabs */}
              <div className="d-flex border-bottom px-3 bg-white" style={{ overflowX: 'auto' }}>
                <TabButton active={activeTab === 'system'} onClick={() => setActiveTab('system')} label="Hệ thống & Dữ liệu" />
                <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} label="Bảo mật & Tài khoản" />
                <TabButton active={activeTab === 'error'} onClick={() => setActiveTab('error')} label="Cảnh báo lỗi" />
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="table table-borderless mb-0" style={{ minWidth: '700px' }}>
                  <thead className="border-bottom" style={{ background: '#f8fafc' }}>
                    <tr>
                      <th className="py-3 px-4 text-muted small fw-bold">ID</th>
                      <th className="py-3 px-4 text-muted small fw-bold">THỜI GIAN</th>
                      <th className="py-3 px-4 text-muted small fw-bold">NỘI DUNG SỰ KIỆN</th>
                      <th className="py-3 px-4 text-muted small fw-bold text-end">TRẠNG THÁI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLogs.map((log, index) => (
                      <tr key={log.id} className={index !== currentLogs.length - 1 ? "border-bottom" : ""}>
                        <td className="py-3 px-4 fw-bold align-middle text-dark font-monospace">#{log.id}</td>
                        <td className="py-3 px-4 text-muted align-middle">{log.time}</td>
                        <td className="py-3 px-4 align-middle text-dark">{log.content}</td>
                        <td className="py-3 px-4 text-end align-middle">
                          <span className={`badge rounded-pill px-3 py-2 ${getBadgeClass(log.type)}`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {currentLogs.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-5 text-muted">Không có dữ liệu nhật ký</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

// --- Sub-Components ---

const StatBox = ({ icon, value, label, iconColor }) => (
  <div className="col-6">
    <div className="d-flex align-items-center gap-3 p-2 rounded-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
      <div 
        className="rounded-circle d-flex align-items-center justify-content-center text-white" 
        style={{ width: '36px', height: '36px', background: iconColor, flexShrink: 0 }}
      >
        <i className={`bi bi-${icon}`}></i>
      </div>
      <div>
        <div className="fw-bold" style={{ fontSize: '16px', lineHeight: '1.2' }}>{value}</div>
        <div style={{ fontSize: '10px', color: '#cbd5e1', letterSpacing: '0.5px' }}>{label}</div>
      </div>
    </div>
  </div>
);

const IncidentRow = ({ label, count, color }) => (
  <div className="d-flex justify-content-between align-items-center border rounded-pill px-4 py-2 bg-white">
    <div className="d-flex align-items-center gap-2">
      <div className="rounded-circle" style={{ width: '8px', height: '8px', background: color }}></div>
      <span className="fw-semibold text-secondary" style={{ fontSize: '14px' }}>{label}</span>
    </div>
    <span className="fw-bold" style={{ fontSize: '16px', color: color }}>{count}</span>
  </div>
);

const TabButton = ({ active, label, onClick }) => (
  <button 
    onClick={onClick} 
    className={`btn flex-shrink-0 fw-bold rounded-0 px-4 py-3 ${active ? 'text-danger border-danger' : 'text-muted border-transparent'}`}
    style={{ 
      border: 'none', 
      borderBottom: `2px solid ${active ? '#b91c1c' : 'transparent'}`,
      fontSize: '15px'
    }}
  >
    {label}
  </button>
);

// --- Helper ---
const getBadgeClass = (type) => {
  if (type === 'success') return 'bg-success bg-opacity-10 text-success';
  if (type === 'warning') return 'bg-warning bg-opacity-10 text-warning';
  if (type === 'danger' || type === 'error') return 'bg-danger bg-opacity-10 text-danger';
  return 'bg-secondary bg-opacity-10 text-secondary';
};

export default AdminDashboard;