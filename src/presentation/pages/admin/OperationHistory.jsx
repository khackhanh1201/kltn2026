import React, { useState } from 'react';

// --- MOCK DATA ---
const MOCK_LOGS = [
  { 
    id: '1', 
    time: '2026-04-18 10:35:12', 
    accountName: 'Admin (Hệ thống)', 
    accountId: 'usr_sys_01', 
    ip: '192.168.1.45', 
    actionType: 'CREATE_DELEGATION', 
    target: 'Role/DEL-003', 
    detail: 'Ủy quyền "Duyệt hồ sơ thuế" từ usr_002 sa...', 
    status: 'TỐT' 
  },
  { 
    id: '2', 
    time: '2026-04-18 10:30:45', 
    accountName: 'Nguyễn Văn Công', 
    accountId: 'usr_001', 
    ip: '118.69.12.34', 
    actionType: 'LOGIN_SSO', 
    target: 'System/Auth', 
    detail: 'Đăng nhập qua cổng VNeID', 
    status: 'TỐT' 
  },
  { 
    id: '3', 
    time: '2026-04-18 10:15:02', 
    accountName: 'Trần Thị Hằng', 
    accountId: 'usr_002', 
    ip: '192.168.1.112', 
    actionType: 'UPDATE_DOSSIER', 
    target: 'Dossier/HS-26-0045', 
    detail: 'Cập nhật trạng thái "Chờ nộp thuế"', 
    status: 'TỐT' 
  },
  { 
    id: '4', 
    time: '2026-04-18 09:45:11', 
    accountName: 'Hệ thống tự động', 
    accountId: 'system', 
    ip: 'localhost', 
    actionType: 'SYNC_LAND_PRICE', 
    target: 'System/Settings', 
    detail: 'Lỗi đồng bộ bảng giá đất cơ sở dữ liệu quố...', 
    status: 'LỖI' 
  },
  { 
    id: '5', 
    time: '2026-04-18 09:00:22', 
    accountName: 'Admin (Hệ thống)', 
    accountId: 'usr_sys_01', 
    ip: '192.168.1.45', 
    actionType: 'LOCK_ACCOUNT', 
    target: 'User/usr_004', 
    detail: 'Khóa tài khoản do sai mật khẩu quá 5 lần', 
    status: 'TỐT' 
  },
];

const OperationHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('Tất cả hành động');
  const [dateFilter, setDateFilter] = useState('');

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '30px 40px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>Lịch sử thao tác</h2>
          <p style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>Tra cứu và kiểm toán các hành động trên hệ thống</p>
        </div>
        <button style={btnExportStyle}>
          <i className="bi bi-download" style={{ marginRight: 8 }}></i> Xuất dữ liệu (CSV)
        </button>
      </div>

      {/* Filter Bar */}
      <div style={filterBarStyle}>
        <div style={searchWrapperStyle}>
          <i className="bi bi-search" style={searchIconStyle}></i>
          <input 
            type="text" 
            placeholder="Tra cứu ID Log, Tên tài khoản, ID người dùng..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
        </div>
        
        <select 
          value={actionFilter} 
          onChange={(e) => setActionFilter(e.target.value)} 
          style={selectStyle}
        >
          <option value="Tất cả hành động">Tất cả hành động</option>
          <option value="LOGIN_SSO">LOGIN_SSO</option>
          <option value="UPDATE_DOSSIER">UPDATE_DOSSIER</option>
        </select>

        <input 
          type="date" 
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={dateInputStyle}
        />

        <button style={btnFilterStyle}>
          <i className="bi bi-funnel" style={{ marginRight: 6 }}></i> Lọc
        </button>
      </div>

      {/* Data Table */}
      <div style={tableCardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={thRowStyle}>
              <th style={thCellStyle}>THỜI GIAN</th>
              <th style={thCellStyle}>TÀI KHOẢN (NGƯỜI XỬ LÝ)</th>
              <th style={thCellStyle}>LOẠI THAO TÁC</th>
              <th style={thCellStyle}>ĐỐI TƯỢNG TÁC ĐỘNG</th>
              <th style={thCellStyle}>CHI TIẾT</th>
              <th style={{ ...thCellStyle, textAlign: 'right' }}>TRẠNG THÁI</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_LOGS.map((log) => (
              <tr key={log.id} style={tdRowStyle}>
                <td style={{ ...tdCellStyle, color: '#64748b', fontSize: 13, whiteSpace: 'nowrap' }}>
                  {log.time}
                </td>
                <td style={tdCellStyle}>
                  <div style={{ fontWeight: 700, color: '#1e293b' }}>{log.accountName}</div>
                  <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
                    {log.accountId} / {log.ip}
                  </div>
                </td>
                <td style={{ ...tdCellStyle, color: '#2563eb', fontWeight: 600, fontSize: 13 }}>
                  {log.actionType}
                </td>
                <td style={{ ...tdCellStyle, color: '#475569', fontSize: 13 }}>
                  {log.target}
                </td>
                <td style={{ ...tdCellStyle, color: '#475569', fontSize: 13 }}>
                  {log.detail}
                </td>
                <td style={{ ...tdCellStyle, textAlign: 'right' }}>
                  <span style={getStatusBadgeStyle(log.status)}>{log.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

// --- STYLES ---

// Buttons
const btnExportStyle = { 
  backgroundColor: '#fff', border: '1px solid #cbd5e1', color: '#1e293b', 
  padding: '10px 16px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer',
  display: 'flex', alignItems: 'center'
};
const btnFilterStyle = {
  backgroundColor: '#0f172a', color: '#fff', border: 'none',
  padding: '10px 24px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer',
  display: 'flex', alignItems: 'center', whiteSpace: 'nowrap'
};

// Filter Bar
const filterBarStyle = {
  backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
  padding: '16px', display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24
};
const searchWrapperStyle = { position: 'relative', flex: 1 };
const searchIconStyle = { position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' };
const searchInputStyle = { 
  width: '100%', padding: '10px 16px 10px 42px', borderRadius: 8, border: '1px solid #e2e8f0', 
  fontSize: 14, outline: 'none', color: '#1e293b', backgroundColor: '#f8fafc' 
};
const selectStyle = { 
  padding: '10px 16px', borderRadius: 8, border: '1px solid #e2e8f0', color: '#1e293b', 
  fontSize: 14, outline: 'none', backgroundColor: '#fff', cursor: 'pointer', minWidth: '180px' 
};
const dateInputStyle = {
  padding: '10px 16px', borderRadius: 8, border: '1px solid #e2e8f0', color: '#1e293b', 
  fontSize: 14, outline: 'none', backgroundColor: '#fff', cursor: 'pointer', minWidth: '150px' 
};

// Table
const tableCardStyle = { background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', padding: '0 24px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thRowStyle = { borderBottom: '1px solid #e2e8f0' };
const thCellStyle = { padding: '20px 0', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 0.5, textTransform: 'uppercase' };
const tdRowStyle = { borderBottom: '1px solid #f1f5f9' };
const tdCellStyle = { padding: '20px 0', fontSize: 14, verticalAlign: 'top' };

// Badges
const getStatusBadgeStyle = (status) => {
  const isGood = status === 'TỐT';
  return {
    display: 'inline-block',
    padding: '4px 12px', 
    borderRadius: 6, 
    fontSize: 11, 
    fontWeight: 800,
    backgroundColor: isGood ? '#dcfce7' : '#fee2e2', 
    color: isGood ? '#16a34a' : '#dc2626'
  };
};

export default OperationHistory;