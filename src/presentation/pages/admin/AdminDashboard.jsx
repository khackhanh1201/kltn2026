import React, { useState } from 'react';
// Giả định bạn có một Layout dành riêng cho Admin với menu bên trái tương ứng
// import AdminLayout from '../../components/AdminLayout'; 

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user_info') || '{}');
  
  // State quản lý tab nhật ký
  const [activeTab, setActiveTab] = useState('system'); // 'system' | 'security' | 'error'

  // Mock Data cho các Tab Nhật ký
  const logs = {
    system: [
      { id: 'SYS-001', time: '18/04/2026 10:15', content: 'Tự động mở rộng tài nguyên máy chủ', status: 'Hoàn thành', type: 'success' },
      { id: 'SYS-002', time: '18/04/2026 09:30', content: 'Đồng bộ cơ sở dữ liệu quốc gia về Dân cư', status: 'Đang xử lý', type: 'warning' },
    ],
    security: [
      { id: 'SEC-045', time: '18/04/2026 08:45', content: 'Khóa tài khoản usr_004 do phát hiện đăng nhập bất thường', status: 'Đã xử lý', type: 'success' },
      { id: 'SEC-046', time: '17/04/2026 22:10', content: 'Phát hiện 50 yêu cầu/s từ IP lạ. Đã chặn.', status: 'Đã chặn', type: 'success' },
    ],
    error: [
      { id: 'ERR-112', time: '18/04/2026 07:20', content: 'Lỗi kết nối cổng thanh toán VNPAY', status: 'Đang khắc phục', type: 'warning' },
    ]
  };

  const currentLogs = logs[activeTab];

  return (
    // Thay thẻ div này bằng <AdminLayout user={user}> của bạn
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '30px 40px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 30 }}>
        <h2 style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>Bảng điều khiển hệ thống</h2>
        <p style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>Giám sát trạng thái hoạt động toàn cục của nền tảng</p>
      </div>

      {/* Top Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 30 }}>
        
        {/* 1. Sức khỏe nền tảng (Thẻ Đỏ) */}
        <div style={healthCardStyle}>
          <div>
            <h3 style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 18 }}>Sức khỏe nền tảng</h3>
            <p style={{ margin: '4px 0 0', color: '#f1f5f9', fontSize: 13 }}>
              Trạng thái: <span style={{ color: '#4ade80', fontWeight: 600 }}>Hoạt động ổn định</span>
            </p>
          </div>

          {/* SVG Donut Chart */}
          <div style={{ position: 'relative', width: 140, height: 140, margin: '20px auto' }}>
            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="95, 100" />
            </svg>
            <div style={donutCenterText}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1 }}>95%</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#fff', marginTop: 4 }}>THÀNH CÔNG</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <StatBox icon="activity" value="45.2K" label="TRUY CẬP (24H)" iconColor="#10b981" />
            <StatBox icon="people" value="12.4K" label="TÀI KHOẢN" iconColor="#3b82f6" />
            <StatBox icon="shield-exclamation" value="34" label="HỒ SƠ KẸT" iconColor="#f59e0b" />
            <StatBox icon="person-x" value="15" label="TK BỊ KHÓA" iconColor="#ef4444" />
          </div>
        </div>

        {/* 2. Cảnh báo hệ thống (Thẻ Trắng) */}
        <div style={warningCardStyle}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={warningIconBox}><i className="bi bi-exclamation-triangle-fill"></i></div>
            <div>
              <h3 style={{ margin: 0, color: '#b91c1c', fontWeight: 700, fontSize: 18 }}>Cảnh báo hệ thống</h3>
              <p style={{ margin: 0, color: '#ef4444', fontSize: 13 }}><i className="bi bi-bell"></i> Cần chú ý ngay</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', margin: '30px 0 40px' }}>
            <span style={{ fontSize: 64, fontWeight: 800, color: '#dc2626', lineHeight: 1 }}>3</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#dc2626', marginLeft: 8 }}>sự cố</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <IncidentRow label="Độ trễ API Thanh toán cao" count={1} color="#ef4444" />
            <IncidentRow label="Truy cập bất thường (Cảnh báo DDoS)" count={2} color="#f59e0b" />
            <IncidentRow label="Lỗi đồng bộ Cơ sở dữ liệu" count={0} color="#10b981" />
          </div>
        </div>

      </div>

      {/* Nhật ký nền tảng */}
      <div style={{ marginTop: 40 }}>
        <h3 style={{ fontWeight: 800, color: '#1e293b', marginBottom: 20 }}>Nhật ký nền tảng gần đây</h3>
        
        <div style={tableCardStyle}>
          {/* Tabs */}
          <div style={tabsContainer}>
            <TabButton active={activeTab === 'system'} onClick={() => setActiveTab('system')} label="Hệ thống & Dữ liệu" />
            <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} label="Bảo mật & Tài khoản" />
            <TabButton active={activeTab === 'error'} onClick={() => setActiveTab('error')} label="Cảnh báo lỗi" />
          </div>

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={thRow}>
                <th style={thCell}>MÃ LOG</th>
                <th style={thCell}>THỜI GIAN</th>
                <th style={thCell}>NỘI DUNG SỰ KIỆN</th>
                <th style={{ ...thCell, textAlign: 'right' }}>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.map(log => (
                <tr key={log.id} style={tdRow}>
                  <td style={{ ...tdCell, fontWeight: 700 }}>{log.id}</td>
                  <td style={{ ...tdCell, color: '#64748b' }}>{log.time}</td>
                  <td style={tdCell}>{log.content}</td>
                  <td style={{ ...tdCell, textAlign: 'right' }}>
                    <span style={getStatusBadge(log.type)}>{log.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

// --- Sub-Components ---

const StatBox = ({ icon, value, label, iconColor }) => (
  <div style={statBoxStyle}>
    <div style={{ width: 32, height: 32, borderRadius: '50%', background: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
      <i className={`bi bi-${icon}`}></i>
    </div>
    <div>
      <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{value}</div>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#cbd5e1', letterSpacing: 0.5 }}>{label}</div>
    </div>
  </div>
);

const IncidentRow = ({ label, count, color }) => (
  <div style={incidentRowStyle}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }}></div>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>{label}</span>
    </div>
    <span style={{ fontSize: 16, fontWeight: 800, color: color }}>{count}</span>
  </div>
);

const TabButton = ({ active, label, onClick }) => (
  <button onClick={onClick} style={active ? tabActiveStyle : tabInactiveStyle}>
    {label}
  </button>
);

// --- Helper & Styles ---

const getStatusBadge = (type) => {
  const base = { padding: '6px 12px', borderRadius: 50, fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 };
  if (type === 'success') return { ...base, background: '#dcfce7', color: '#16a34a' };
  if (type === 'warning') return { ...base, background: '#fef3c7', color: '#d97706' };
  return base;
};

// Thẻ Đỏ (Sức khỏe nền tảng)
const healthCardStyle = { 
  background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)', 
  borderRadius: 20, padding: 30, boxShadow: '0 10px 25px rgba(185, 28, 28, 0.2)' 
};
const donutCenterText = { 
  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' 
};
const statBoxStyle = { 
  background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', 
  display: 'flex', alignItems: 'center', gap: 12 
};

// Thẻ Trắng (Cảnh báo hệ thống)
const warningCardStyle = { 
  background: '#fff', border: '1px solid #fca5a5', borderRadius: 20, 
  padding: 30, boxShadow: '0 10px 25px rgba(239, 68, 68, 0.05)' 
};
const warningIconBox = { 
  background: '#ef4444', color: '#fff', width: 40, height: 40, 
  borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 
};
const incidentRowStyle = { 
  border: '1px solid #fee2e2', borderRadius: 50, padding: '12px 24px', 
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' 
};

// Bảng Nhật ký
const tableCardStyle = { background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' };
const tabsContainer = { display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '0 20px', background: '#fff' };
const tabInactiveStyle = { 
  background: 'none', border: 'none', borderBottom: '2px solid transparent', 
  padding: '20px 24px', fontSize: 14, fontWeight: 700, color: '#64748b', cursor: 'pointer' 
};
const tabActiveStyle = { ...tabInactiveStyle, color: '#b91c1c', borderBottom: '2px solid #b91c1c' };

const thRow = { background: '#fff', borderBottom: '1px solid #f1f5f9' };
const thCell = { padding: '20px 24px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 0.5 };
const tdRow = { borderBottom: '1px solid #f1f5f9' };
const tdCell = { padding: '20px 24px', fontSize: 14, color: '#1e293b' };

export default AdminDashboard;