import React, { useState } from 'react';

// Mock Data
const INITIAL_USERS = [
  { id: '1', name: 'Nguyễn Văn Công', email: 'cong.nv@vneid.gov', role: 'Công dân', cccd: '001090123456', status: 'Hoạt động', lastLogin: '10:30 18/04/2026' },
  { id: '2', name: 'Trần Thị Hằng', email: 'hang.tt@tax.gov.vn', role: 'Cán bộ Thuế', cccd: '001192654321', status: 'Hoạt động', lastLogin: '08:15 18/04/2026' },
  { id: '3', name: 'Lê Minh Tuấn', email: 'tuan.lm@land.gov.vn', role: 'Cán bộ Địa chính', cccd: '037085987654', status: 'Hoạt động', lastLogin: '09:00 18/04/2026' },
  { id: '4', name: 'Bùi Đức Mạnh', email: 'manh.bd@vneid.gov', role: 'Công dân', cccd: '001095111222', status: 'Bị khóa', lastLogin: '15:20 15/04/2026' },
  { id: '5', name: 'Phạm Thu Trang', email: 'trang.pt@tax.gov.vn', role: 'Cán bộ Thuế', cccd: '034199333444', status: 'Hoạt động', lastLogin: '07:45 18/04/2026' },
];

const UserManagement = () => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Tất cả vai trò');
  
  // Modal State
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [lockReason, setLockReason] = useState('');

  // Lọc dữ liệu
  const filteredUsers = users.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.cccd.includes(searchTerm);
    const matchRole = roleFilter === 'Tất cả vai trò' || user.role === roleFilter;
    return matchSearch && matchRole;
  });

  // Mở Modal Khóa tài khoản
  const handleOpenLockModal = (user) => {
    setSelectedUser(user);
    setLockReason('');
    setIsLockModalOpen(true);
  };

  // Xử lý Khóa
  const handleConfirmLock = () => {
    if (!lockReason.trim()) {
      alert('Vui lòng nhập lý do khóa tài khoản!');
      return;
    }
    // Cập nhật state (Giả lập gọi API)
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: 'Bị khóa' } : u));
    setIsLockModalOpen(false);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '30px 40px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>Quản lý người dùng</h2>
        <p style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>Quản lý tài khoản công dân, cán bộ Thuế và cán bộ Địa chính</p>
      </div>

      {/* Filter Bar */}
      <div style={filterContainerStyle}>
        <div style={searchWrapperStyle}>
          <i className="bi bi-search" style={searchIconStyle}></i>
          <input 
            type="text" 
            placeholder="Tìm kiếm theo Tên, Email, CCCD..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
        </div>
        <select 
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)} 
          style={selectStyle}
        >
          <option value="Tất cả vai trò">Tất cả vai trò</option>
          <option value="Công dân">Công dân</option>
          <option value="Cán bộ Thuế">Cán bộ Thuế</option>
          <option value="Cán bộ Địa chính">Cán bộ Địa chính</option>
        </select>
      </div>

      {/* Table */}
      <div style={tableCardStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={thRowStyle}>
              <th style={thCellStyle}>ID / NGƯỜI DÙNG</th>
              <th style={thCellStyle}>VAI TRÒ</th>
              <th style={thCellStyle}>CCCD</th>
              <th style={thCellStyle}>TRẠNG THÁI</th>
              <th style={thCellStyle}>ĐĂNG NHẬP CUỐI</th>
              <th style={{ ...thCellStyle, textAlign: 'center' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={tdRowStyle}>
                <td style={tdCellStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={avatarStyle}>{user.name.charAt(0)}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 14 }}>{user.name}</div>
                      <div style={{ color: '#64748b', fontSize: 12 }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={tdCellStyle}>
                  <span style={getRoleBadgeStyle(user.role)}>{user.role}</span>
                </td>
                <td style={{ ...tdCellStyle, color: '#475569' }}>{user.cccd}</td>
                <td style={tdCellStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: user.status === 'Hoạt động' ? '#16a34a' : '#dc2626' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: user.status === 'Hoạt động' ? '#22c55e' : '#ef4444' }}></div>
                    {user.status}
                  </div>
                </td>
                <td style={{ ...tdCellStyle, color: '#64748b', fontSize: 13 }}>{user.lastLogin}</td>
                <td style={{ ...tdCellStyle, textAlign: 'center' }}>
                  <button 
                    style={actionBtnStyle} 
                    onClick={() => handleOpenLockModal(user)}
                    title={user.status === 'Hoạt động' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                  >
                    <i className={user.status === 'Hoạt động' ? "bi bi-lock" : "bi bi-unlock"}></i>
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  Không tìm thấy người dùng nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Khóa Tài Khoản */}
      {isLockModalOpen && selectedUser && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            {/* Modal Header */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <div style={warningIconBgStyle}>
                <i className="bi bi-exclamation-triangle" style={{ color: '#dc2626', fontSize: 20 }}></i>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1e293b' }}>Khóa tài khoản</h3>
                <p style={{ margin: '4px 0 0', color: '#475569', fontSize: 14, lineHeight: 1.5 }}>
                  Đình chỉ tài khoản <span style={{ fontWeight: 700, color: '#1e293b' }}>{selectedUser.name}</span><br />
                  ({selectedUser.email}).
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 20, marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>
                Lý do khóa <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea 
                rows={4}
                placeholder="Nhập lý do chi tiết để lưu vết hệ thống (VD: Phát hiện đăng nhập bất thường, Xâm phạm dữ liệu...)"
                value={lockReason}
                onChange={(e) => setLockReason(e.target.value)}
                style={textareaStyle}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 12, marginTop: 8 }}>
                <i className="bi bi-shield-check"></i>
                Hành động này sẽ được ghi lại vào Lịch sử thao tác hệ thống.
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button style={btnCancelStyle} onClick={() => setIsLockModalOpen(false)}>Hủy</button>
              <button style={btnConfirmStyle} onClick={handleConfirmLock}>Xác nhận Khóa</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// --- Styles ---

const filterContainerStyle = { display: 'flex', gap: 16, marginBottom: 24 };
const searchWrapperStyle = { position: 'relative', flex: 1 };
const searchIconStyle = { position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' };
const searchInputStyle = { width: '100%', padding: '12px 16px 12px 42px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', color: '#1e293b' };
const selectStyle = { width: 200, padding: '12px 16px', borderRadius: 8, border: '1px solid #b91c1c', color: '#b91c1c', fontSize: 14, fontWeight: 600, outline: 'none', backgroundColor: '#fff', cursor: 'pointer' };

const tableCardStyle = { background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' };
const thRowStyle = { borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' };
const thCellStyle = { padding: '16px 24px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 0.5 };
const tdRowStyle = { borderBottom: '1px solid #f1f5f9' };
const tdCellStyle = { padding: '16px 24px', fontSize: 14 };

const avatarStyle = { width: 40, height: 40, borderRadius: '50%', backgroundColor: '#e2e8f0', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 };
const actionBtnStyle = { background: 'none', border: 'none', color: '#94a3b8', fontSize: 18, cursor: 'pointer', padding: 4 };

// Role Badges
const getRoleBadgeStyle = (role) => {
  const base = { padding: '4px 10px', borderRadius: 50, fontSize: 11, fontWeight: 700, display: 'inline-block' };
  if (role === 'Công dân') return { ...base, backgroundColor: '#eff6ff', color: '#2563eb' };
  if (role === 'Cán bộ Thuế') return { ...base, backgroundColor: '#f0fdf4', color: '#16a34a' };
  if (role === 'Cán bộ Địa chính') return { ...base, backgroundColor: '#faf5ff', color: '#9333ea' };
  return base;
};

// Modal Styles
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: '#fff', width: '100%', maxWidth: 500, borderRadius: 16, padding: '24px 32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' };
const warningIconBgStyle = { width: 48, height: 48, borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const textareaStyle = { width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14, outline: 'none', color: '#334155', resize: 'none' };
const btnCancelStyle = { padding: '10px 24px', borderRadius: 8, border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', fontSize: 14, fontWeight: 700, cursor: 'pointer' };
const btnConfirmStyle = { padding: '10px 24px', borderRadius: 8, border: 'none', backgroundColor: '#e60000', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' };

export default UserManagement;