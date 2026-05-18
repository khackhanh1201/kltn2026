import React, { useState, useEffect } from 'react';
import { useUserInfo } from '../../../hooks/useUserInfo';
import CadastralLayout from '../../components/CadastralLayout';
import { cadastralApi } from '../../../infrastructure/api/cadastralApi';

const API_BASE = 'http://localhost:8080/api';
const getAuth = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` });

const CadastralDashboard = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useUserInfo();

  // Kiểm tra role
  const isLandOfficer = user?.roles?.includes('ROLE_LAND_OFFICER') || 
                       user?.role === 'ROLE_LAND_OFFICER';

  console.log("🔍 Current User Role:", user?.roles || user?.role);

  // Chuyển stats thành State để cập nhật tự động từ API
  const [stats, setStats] = useState({
    total: '2,450',       // Có thể được lấy thực tế khi Backend hỗ trợ /api/records/all
    verified: '1,960',
    processing: '0',
    needMoreDocs: '32',
    discrepancy: '5',
    urgentTotal: 0,
    urgentNew: 0,
    urgentFraud: 2,
    urgentOverdue: 0
  });

  // Lấy dữ liệu thống kê tổng quan (Hồ sơ đang chờ + Khiếu nại)
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [resRecords, resComplaints] = await Promise.all([
          fetch(`${API_BASE}/records/submitted`, { headers: getAuth() }).catch(() => null),
          // Tạm thời giả lập API complaints vì Backend chưa có phương thức GET /api/complaints
          Promise.resolve({ ok: true, json: async () => getMockData('complaint') })
        ]);
        
        let pendingRecordsCount = 0;
        if (resRecords && resRecords.ok) {
          const records = await resRecords.json();
          pendingRecordsCount = records.length;
        }

        let pendingComplaintsCount = 0;
        if (resComplaints && resComplaints.ok) {
          const complaints = await resComplaints.json();
          pendingComplaintsCount = complaints.filter(c => c.status === 'PENDING' || c.status === 'CHỜ XỬ LÝ').length;
        }

        setStats(prev => ({
          ...prev,
          processing: pendingRecordsCount.toString(),
          urgentNew: pendingRecordsCount,
          urgentOverdue: pendingComplaintsCount,
          urgentTotal: pendingRecordsCount + pendingComplaintsCount + prev.urgentFraud
        }));
      } catch (e) {
        console.error("Lỗi tải thống kê Dashboard:", e);
      }
    };
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      try {
        let responseData = [];

        if (activeTab === 'new') {
          const res = await fetch(`${API_BASE}/records/submitted`, { headers: getAuth() });
          if (res.ok) {
            const data = await res.json();
            responseData = data.map(item => ({
              id: item.recordId,
              mutationCode: `HS-${String(item.recordId).padStart(5, '0')}`,
              createdAt: item.submittedAt,
              reason: `${item.recordCategory || 'Hồ sơ địa chính'} (CD: ${item.citizenId || 'N/A'})`,
              status: item.currentStatus
            }));
          } else {
            responseData = getMockData('new');
          }
        } 
        else if (activeTab === 'verified') {
          // TODO: Nếu có endpoint API lấy lịch sử hồ sơ cán bộ đã xử lý, gọi tại đây
          responseData = getMockData('verified');
        } 
        else if (activeTab === 'complaint') {
          // Tạm thời dùng Mock Data chờ Backend viết API GET /api/complaints
          responseData = getMockData('complaint');
        }

        setTableData(responseData);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu bảng điều khiển:', error);
        setTableData(getMockData(activeTab));
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, [activeTab]);

  // Mock Data khi API bị chặn quyền
  const getMockData = (tab) => {
    if (tab === 'new') {
      return [
        { id: 101, mutationCode: "BD2025001", createdAt: "2025-05-18T08:30:00", reason: "Chuyển nhượng thửa đất số 45", status: "PENDING" },
        { id: 102, mutationCode: "BD2025002", createdAt: "2025-05-17T14:20:00", reason: "Tách thửa đất số 67", status: "PENDING" },
      ];
    }
    if (tab === 'verified') {
      return [
        { id: 201, mutationCode: "BD2024987", createdAt: "2025-05-16T10:15:00", reason: "Duyệt chuyển nhượng", status: "APPROVED" },
        { id: 202, mutationCode: "BD2024985", createdAt: "2025-05-15T09:00:00", reason: "Xác thực sổ đỏ", status: "VERIFIED" },
      ];
    }
    if (tab === 'complaint') {
      return [
        { id: 301, complaintCode: "KN2025012", createdAt: "2025-05-18T11:30:00", reason: "Khiếu nại sai diện tích thửa đất", status: "PENDING" },
      ];
    }
    return [];
  };

  return (
    <CadastralLayout user={user}>
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '30px 40px', fontFamily: 'Inter, sans-serif' }}>
        
        <div style={{ marginBottom: 30 }}>
          <h2 style={{ margin: 0, fontWeight: 800, color: '#1e293b', fontSize: 24 }}>
            Bảng điều khiển {isLandOfficer && '— Cán bộ Địa chính'}
          </h2>
          <p style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>Theo dõi tình trạng hồ sơ đất đai và công việc của bạn</p>
        </div>

        {/* Top Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, marginBottom: 40 }}>
          
          <div style={statusCardStyle}>
            <div>
              <h3 style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 18 }}>Trạng thái hồ sơ</h3>
              <p style={{ margin: '4px 0 0', color: '#f8fafc', fontSize: 14 }}>
                Tổng số hồ sơ: <span style={{ fontWeight: 700 }}>{stats.total}</span>
              </p>
            </div>

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
              <StatBox icon="check-circle-fill" value={stats.verified} label="ĐÃ XÁC THỰC" iconColor="#10b981" />
              <StatBox icon="clock-fill" value={stats.processing} label="ĐANG XỬ LÝ" iconColor="#3b82f6" />
              <StatBox icon="exclamation-circle-fill" value={stats.needMoreDocs} label="CẦN BỔ SUNG" iconColor="#f59e0b" />
              <StatBox icon="exclamation-triangle-fill" value={stats.discrepancy} label="LỆCH DỮ LIỆU" iconColor="#ef4444" />
            </div>
          </div>

          <div style={urgentCardStyle}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={urgentIconBox}><i className="bi bi-exclamation-triangle-fill"></i></div>
              <div>
                <h3 style={{ margin: 0, color: '#9a3412', fontWeight: 800, fontSize: 18 }}>Cần xử lý ngay</h3>
                <p style={{ margin: '2px 0 0', color: '#c2410c', fontSize: 13 }}><i className="bi bi-bell"></i> Ưu tiên cao</p>
              </div>
            </div>

            <div style={{ textAlign: 'center', margin: '30px 0 40px' }}>
              <span style={{ fontSize: 64, fontWeight: 800, color: '#d97706', lineHeight: 1 }}>{stats.urgentTotal}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#d97706', marginLeft: 8, textTransform: 'uppercase' }}>Hồ sơ</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <UrgentRow label="Hồ sơ mới tiếp nhận" value={stats.urgentNew} dotColor="#f59e0b" valueColor="#d97706" />
              <UrgentRow label="Hồ sơ gian lận" value={stats.urgentFraud} dotColor="#ef4444" valueColor="#dc2626" />
              <UrgentRow label="Khiếu nại quá hạn" value={stats.urgentOverdue} dotColor="#eab308" valueColor="#ca8a04" />
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
                  <th style={thCell}>MÃ GIAO DỊCH</th>
                  <th style={thCell}>NGÀY THÁNG</th>
                  <th style={thCell}>NỘI DUNG</th>
                  <th style={thCell}>TRẠNG THÁI</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Đang tải dữ liệu...</td></tr>
                ) : tableData.length > 0 ? (
                  tableData.map((item, index) => {
                    const displayId = item.mutationCode || item.recordCode || item.complaintCode || item.id || `Mã-${index}`;
                    const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'N/A';
                    const content = item.reason || item.content || 'Không có nội dung chi tiết';
                    const statusInfo = mapStatus(item.status);

                    return (
                      <tr key={item.id || index} style={tdRow}>
                        <td style={{ ...tdCell, fontWeight: 700 }}>{displayId}</td>
                        <td style={{ ...tdCell, color: '#64748b' }}>{dateStr}</td>
                        <td style={tdCell}>{content}</td>
                        <td style={tdCell}>
                          <span style={getStatusBadge(statusInfo.type)}>{statusInfo.text}</span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Không có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CadastralLayout>
  );
};

/* ===================== SUB-COMPONENTS & STYLES ===================== */
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

const mapStatus = (status) => {
  switch (status?.toUpperCase()) {
    case 'SUBMITTED':
    case 'CHỜ DUYỆT':
    case 'PENDING': return { text: 'Chờ xử lý', type: 'pending' };
    case 'CHECKING':
    case 'NEED_MORE_DOCS': return { text: 'Đang kiểm tra', type: 'checking' };
    case 'APPROVED':
    case 'VERIFIED':
    case 'RESOLVED': return { text: 'Hoàn tất', type: 'success' };
    case 'REJECTED':
    case 'CANCELLED': return { text: 'Bị từ chối', type: 'error' };
    default: return { text: status || 'Không xác định', type: 'pending' };
  }
};

const getStatusBadge = (type) => {
  const base = { padding: '6px 12px', borderRadius: 50, fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 };
  if (type === 'pending') return { ...base, background: '#fef3c7', color: '#d97706' };
  if (type === 'checking') return { ...base, background: '#ffedd5', color: '#c2410c' };
  if (type === 'success') return { ...base, background: '#d1fae5', color: '#059669' };
  if (type === 'error') return { ...base, background: '#fee2e2', color: '#dc2626' };
  return base;
};

// Styles
const statusCardStyle = { background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)', borderRadius: 20, padding: 30, boxShadow: '0 10px 25px rgba(185, 28, 28, 0.15)' };
const donutCenterText = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
const statBoxStyle = { background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 };

const urgentCardStyle = { background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 20, padding: 30, boxShadow: '0 10px 25px rgba(245, 158, 11, 0.05)' };
const urgentIconBox = { background: '#f59e0b', color: '#fff', width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 };
const urgentRowStyle = { border: '1px solid #fde68a', borderRadius: 50, padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' };

const tableCardStyle = { background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' };
const tabsContainer = { display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '0 20px', background: '#fff' };
const tabInactiveStyle = { background: 'none', border: 'none', borderBottom: '2px solid transparent', padding: '20px 24px', fontSize: 14, fontWeight: 700, color: '#64748b', cursor: 'pointer' };
const tabActiveStyle = { ...tabInactiveStyle, color: '#b91c1c', borderBottom: '2px solid #b91c1c' };

const thRow = { background: '#fff', borderBottom: '1px solid #f1f5f9' };
const thCell = { padding: '20px 24px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: 0.5, textTransform: 'uppercase' };
const tdRow = { borderBottom: '1px solid #f1f5f9' };
const tdCell = { padding: '20px 24px', fontSize: 14, color: '#1e293b' };

export default CadastralDashboard;