import React, { useState } from 'react';
import { useUserInfo } from '../../../hooks/useUserInfo';
import CadastralOfficerLayout from '../../components/CadastralLayout';

// --- MOCK DATA ---
const RECENT_ACTIVITIES = {
  new: [
    { id: 'HS-2026-045', date: '15/04/2026', content: 'Hồ sơ khai báo đất đai - Nguyễn Văn An', status: 'Chờ xử lý', statusType: 'pending' },
    { id: 'HS-2026-046', date: '14/04/2026', content: 'Hồ sơ cấp mới GCN - Trần Thị B', status: 'Đang kiểm tra', statusType: 'checking' },
  ],
  verified: [],
  complaint: []
};

const CadastralDashboard = () => {
  const [activeTab, setActiveTab] = useState('new');
  const user = useUserInfo();   // Lấy thông tin user

  const currentData = RECENT_ACTIVITIES[activeTab] || [];

  return (
    <CadastralOfficerLayout user={user}>
      {/* Nội dung Dashboard */}
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '30px 40px', fontFamily: 'Inter, sans-serif' }}>
        
        {/* Header */}
        <div style={{ marginBottom: 30 }}>
          <h2 style={{ margin: 0, fontWeight: 800, color: '#1e293b', fontSize: 24 }}>Bảng điều khiển</h2>
          <p style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>Theo dõi tình trạng hồ sơ đất đai và công việc của bạn</p>
        </div>

        {/* Top Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, marginBottom: 40 }}>
          
          {/* 1. Trạng thái hồ sơ */}
          <div style={statusCardStyle}>
            <div>
              <h3 style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 18 }}>Trạng thái hồ sơ</h3>
              <p style={{ margin: '4px 0 0', color: '#f8fafc', fontSize: 14 }}>
                Tổng số hồ sơ: <span style={{ fontWeight: 700 }}>2,450</span>
              </p>
            </div>

            {/* SVG Donut Chart */}
            <div style={{ position: 'relative', width: 140, height: 140, margin: '20px auto' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeWidth="4" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="80, 100" />
              </svg>
              <div style={donutCenterText}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1 }}>80%</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#fff', marginTop: 4 }}>ĐÃ XÁC THỰC</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <StatBox icon="check-circle-fill" value="1,960" label="ĐÃ XÁC THỰC" iconColor="#10b981" />
              <StatBox icon="clock-fill" value="150" label="ĐANG XỬ LÝ" iconColor="#3b82f6" />
              <StatBox icon="exclamation-circle-fill" value="320" label="CẦN BỔ SUNG" iconColor="#f59e0b" />
              <StatBox icon="exclamation-triangle-fill" value="20" label="LỆCH DỮ LIỆU" iconColor="#ef4444" />
            </div>
          </div>

          {/* 2. Cần xử lý ngay */}
          <div style={urgentCardStyle}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={urgentIconBox}><i className="bi bi-exclamation-triangle-fill"></i></div>
              <div>
                <h3 style={{ margin: 0, color: '#9a3412', fontWeight: 800, fontSize: 18 }}>Cần xử lý ngay</h3>
                <p style={{ margin: '2px 0 0', color: '#c2410c', fontSize: 13 }}><i className="bi bi-bell"></i> Ưu tiên cao</p>
              </div>
            </div>

            <div style={{ textAlign: 'center', margin: '30px 0 40px' }}>
              <span style={{ fontSize: 64, fontWeight: 800, color: '#d97706', lineHeight: 1 }}>56</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#d97706', marginLeft: 8, textTransform: 'uppercase' }}>Hồ sơ</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <UrgentRow label="Hồ sơ mới tiếp nhận" value={24} dotColor="#f59e0b" valueColor="#d97706" />
              <UrgentRow label="Hồ sơ gian lận" value={12} dotColor="#ef4444" valueColor="#dc2626" />
              <UrgentRow label="Khiếu nại quá hạn" value={20} dotColor="#eab308" valueColor="#ca8a04" />
            </div>
          </div>
        </div>

        {/* Hoạt động gần đây */}
        <div>
          <h3 style={{ fontWeight: 800, color: '#1e293b', marginBottom: 20, fontSize: 20 }}>Hoạt động gần đây</h3>
          
          <div style={tableCardStyle}>
            <div style={tabsContainer}>
              <TabButton active={activeTab === 'new'} onClick={() => setActiveTab('new')} label="Hồ sơ mới" />
              <TabButton active={activeTab === 'verified'} onClick={() => setActiveTab('verified')} label="Đã xác thực" />
              <TabButton active={activeTab === 'complaint'} onClick={() => setActiveTab('complaint')} label="Khiếu nại" />
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={thRow}>
                  <th style={thCell}>MÃ HỒ SƠ/KHIẾU NẠI</th>
                  <th style={thCell}>NGÀY THÁNG</th>
                  <th style={thCell}>NỘI DUNG</th>
                  <th style={thCell}>TRẠNG THÁI</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={index} style={tdRow}>
                      <td style={{ ...tdCell, fontWeight: 700 }}>{item.id}</td>
                      <td style={{ ...tdCell, color: '#64748b' }}>{item.date}</td>
                      <td style={tdCell}>{item.content}</td>
                      <td style={tdCell}>
                        <span style={getStatusBadge(item.statusType)}>{item.status}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CadastralOfficerLayout>
  );
};

// --- Sub-Components ---

const StatBox = ({ icon, value, label, iconColor }) => (
  <div style={statBoxStyle}>
    <div style={{ color: iconColor, fontSize: 20, display: 'flex', alignItems: 'center' }}>
      <i className={`bi bi-${icon}`}></i>
    </div>
    <div>
      <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{value}</div>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#f1f5f9', letterSpacing: 0.5 }}>{label}</div>
    </div>
  </div>
);

const UrgentRow = ({ label, value, dotColor, valueColor }) => (
  <div style={urgentRowStyle}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor }}></div>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>{label}</span>
    </div>
    <span style={{ fontSize: 16, fontWeight: 800, color: valueColor }}>{value}</span>
  </div>
);

const TabButton = ({ active, label, onClick }) => (
  <button onClick={onClick} style={active ? tabActiveStyle : tabInactiveStyle}>
    {label}
  </button>
);

// --- Helpers & Styles ---

const getStatusBadge = (type) => {
  const base = { padding: '6px 12px', borderRadius: 50, fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 };
  if (type === 'pending') return { ...base, background: '#fef3c7', color: '#d97706' };
  if (type === 'checking') return { ...base, background: '#ffedd5', color: '#c2410c' };
  return base;
};

// 1. Thẻ Đỏ (Trạng thái hồ sơ)
const statusCardStyle = { 
  background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)', 
  borderRadius: 20, padding: 30, boxShadow: '0 10px 25px rgba(185, 28, 28, 0.15)' 
};
const donutCenterText = { 
  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' 
};
const statBoxStyle = { 
  background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', 
  display: 'flex', alignItems: 'center', gap: 12 
};

// 2. Thẻ Vàng (Cần xử lý ngay)
const urgentCardStyle = { 
  background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 20, 
  padding: 30, boxShadow: '0 10px 25px rgba(245, 158, 11, 0.05)' 
};
const urgentIconBox = { 
  background: '#f59e0b', color: '#fff', width: 36, height: 36, 
  borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 
};
const urgentRowStyle = { 
  border: '1px solid #fde68a', borderRadius: 50, padding: '12px 24px', 
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' 
};

// 3. Bảng Hoạt động gần đây
const tableCardStyle = { background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' };
const tabsContainer = { display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '0 20px', background: '#fff' };
const tabInactiveStyle = { 
  background: 'none', border: 'none', borderBottom: '2px solid transparent', 
  padding: '20px 24px', fontSize: 14, fontWeight: 700, color: '#64748b', cursor: 'pointer' 
};
const tabActiveStyle = { ...tabInactiveStyle, color: '#b91c1c', borderBottom: '2px solid #b91c1c' };

const thRow = { background: '#fff', borderBottom: '1px solid #f1f5f9' };
const thCell = { padding: '20px 24px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: 0.5, textTransform: 'uppercase' };
const tdRow = { borderBottom: '1px solid #f1f5f9' };
const tdCell = { padding: '20px 24px', fontSize: 14, color: '#1e293b' };

export default CadastralDashboard;