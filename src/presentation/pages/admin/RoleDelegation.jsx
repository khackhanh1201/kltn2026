import React, { useState } from 'react';

// --- MOCK DATA ---
const MOCK_USERS = [
  { id: 'usr_002', name: 'Trần Thị Hằng', role: 'Cán bộ Liên thông', dept: 'Hành chính Công', permissions: ['Phân hệ Thuế', 'Phân hệ Địa chính'] },
  { id: 'usr_003', name: 'Lê Minh Tuấn', role: 'Cán bộ Địa chính', dept: 'VP Đăng ký Đất đai', permissions: ['Phân hệ Địa chính'] },
  { id: 'usr_005', name: 'Phạm Thu Trang', role: 'Cán bộ Thuế', dept: 'Cơ quan Thuế', permissions: ['Phân hệ Thuế'] },
];

const MOCK_DELEGATIONS = [
  { id: 'DEL-001', permission: 'Toàn quyền Phân hệ Thuế', assigner: 'Trần Thị Hằng (Thuế)', assignee: 'Phạm Thu Trang (Thuế)', start: '18/04/2026 08:00', end: '20/04/2026 17:00', status: 'Đang hoạt động' },
  { id: 'DEL-002', permission: 'Toàn quyền Phân hệ Địa chính', assigner: 'Lê Minh Tuấn (Địa chính)', assignee: 'Nguyễn Hải Tú (Địa chính)', start: '10/04/2026 08:00', end: '12/04/2026 17:00', status: 'Đã hết hạn' },
];

const RoleDelegation = () => {
  const [activeTab, setActiveTab] = useState('roles'); // 'roles' | 'delegation'
  
  // States cho Modal Phân quyền
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // States cho Modal Thu hồi ủy quyền
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [selectedDelegation, setSelectedDelegation] = useState(null);

  // Handlers
  const handleOpenRoleModal = (user) => { setSelectedUser(user); setIsRoleModalOpen(true); };
  const handleOpenRevokeModal = (del) => { setSelectedDelegation(del); setIsRevokeModalOpen(true); };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '30px 40px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>Phân & Ủy quyền</h2>
        <p style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>Quản lý vai trò truy cập và thiết lập ủy quyền tạm thời</p>
      </div>

      {/* Main Container */}
      <div style={mainCardStyle}>
        
        {/* Custom Tabs */}
        <div style={tabsHeaderStyle}>
          <button 
            style={activeTab === 'roles' ? activeTabBtnStyle : inactiveTabBtnStyle}
            onClick={() => setActiveTab('roles')}
          >
            <i className="bi bi-key" style={{ marginRight: 8 }}></i> Phân quyền
          </button>
          <button 
            style={activeTab === 'delegation' ? activeTabBtnStyle : inactiveTabBtnStyle}
            onClick={() => setActiveTab('delegation')}
          >
            <i className="bi bi-link-45deg" style={{ marginRight: 8 }}></i> Ủy quyền
          </button>
        </div>

        {/* --- TAB CONTENT: PHÂN QUYỀN --- */}
        {activeTab === 'roles' && (
          <div style={{ padding: '0 24px 24px' }}>
            <table style={tableStyle}>
              <thead>
                <tr style={thRowStyle}>
                  <th style={thCellStyle}>HỌ TÊN / MÃ TK</th>
                  <th style={thCellStyle}>CHỨC VỤ & ĐƠN VỊ</th>
                  <th style={thCellStyle}>QUYỀN HẠN HỆ THỐNG</th>
                  <th style={{ ...thCellStyle, textAlign: 'right' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map((user) => (
                  <tr key={user.id} style={tdRowStyle}>
                    <td style={tdCellStyle}>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{user.name}</div>
                      <div style={{ color: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}>{user.id}</div>
                    </td>
                    <td style={tdCellStyle}>
                      <div style={{ color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <i className="bi bi-person" style={{ color: '#94a3b8' }}></i> {user.role}
                      </div>
                      <div style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>{user.dept}</div>
                    </td>
                    <td style={tdCellStyle}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {user.permissions.map(perm => (
                          <span key={perm} style={getPermissionBadgeStyle(perm)}>{perm}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ ...tdCellStyle, textAlign: 'right' }}>
                      <button style={btnBlueLightStyle} onClick={() => handleOpenRoleModal(user)}>
                        Thiết lập quyền
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- TAB CONTENT: ỦY QUYỀN --- */}
        {activeTab === 'delegation' && (
          <div style={{ padding: '20px 24px 24px' }}>
            {/* Stats Sub-header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 14 }}>
                <div><span style={{ fontWeight: 800, color: '#1e293b' }}>12</span> <span style={{ color: '#64748b' }}>Đang hoạt động</span></div>
                <div style={{ width: 1, height: 16, backgroundColor: '#e2e8f0' }}></div>
                <div><span style={{ fontWeight: 800, color: '#1e293b' }}>3</span> <span style={{ color: '#64748b' }}>Sắp hết hạn</span></div>
                <div style={{ width: 1, height: 16, backgroundColor: '#e2e8f0' }}></div>
                <div><span style={{ fontWeight: 800, color: '#1e293b' }}>18</span> <span style={{ color: '#64748b' }}>Cán bộ được ủy quyền</span></div>
              </div>
              <select style={selectStyle}>
                <option>Tất cả trạng thái</option>
                <option>Đang hoạt động</option>
                <option>Đã hết hạn</option>
              </select>
            </div>

            <table style={tableStyle}>
              <thead>
                <tr style={thRowStyle}>
                  <th style={thCellStyle}>MÃ / QUYỀN HẠN</th>
                  <th style={thCellStyle}>NGƯỜI GIAO</th>
                  <th style={thCellStyle}>NGƯỜI NHẬN</th>
                  <th style={thCellStyle}>THỜI GIAN BẮT ĐẦU</th>
                  <th style={thCellStyle}>THỜI GIAN KẾT THÚC</th>
                  <th style={thCellStyle}>TRẠNG THÁI</th>
                  <th style={{ ...thCellStyle, textAlign: 'right' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DELEGATIONS.map((del) => (
                  <tr key={del.id} style={tdRowStyle}>
                    <td style={tdCellStyle}>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 12 }}>{del.id}</div>
                      <div style={{ color: '#dc2626', fontSize: 13, marginTop: 2 }}>{del.permission}</div>
                    </td>
                    <td style={{ ...tdCellStyle, color: '#475569' }}>{del.assigner}</td>
                    <td style={{ ...tdCellStyle, color: '#475569' }}>{del.assignee}</td>
                    <td style={{ ...tdCellStyle, color: '#64748b' }}>{del.start}</td>
                    <td style={{ ...tdCellStyle, color: '#64748b' }}>{del.end}</td>
                    <td style={tdCellStyle}>
                      <span style={getDelegationStatusBadge(del.status)}>{del.status}</span>
                    </td>
                    <td style={{ ...tdCellStyle, textAlign: 'right' }}>
                      {del.status === 'Đang hoạt động' && (
                        <button style={btnRedOutlineStyle} onClick={() => handleOpenRevokeModal(del)}>
                          Thu hồi
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODAL: CẬP NHẬT QUYỀN HẠN --- */}
      {isRoleModalOpen && selectedUser && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            {/* Modal Header Red */}
            <div style={modalHeaderRedStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="bi bi-key" style={{ fontSize: 20 }}></i>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Cập nhật Quyền hạn Tài khoản</h3>
              </div>
              <button onClick={() => setIsRoleModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}><i className="bi bi-x"></i></button>
            </div>

            <div style={{ padding: 24 }}>
              {/* User Info Box */}
              <div style={userInfoBoxStyle}>
                <div style={avatarStyle}><i className="bi bi-person" style={{ fontSize: 24 }}></i></div>
                <div>
                  <div style={{ fontWeight: 800, color: '#1e293b', fontSize: 16 }}>{selectedUser.name}</div>
                  <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>{selectedUser.role} • {selectedUser.dept}</div>
                </div>
              </div>

              <div style={{ fontWeight: 700, color: '#334155', marginBottom: 12, fontSize: 14 }}>Phân quyền vai trò hệ thống</div>

              {/* Checkbox Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label style={{ ...roleOptionStyle, borderColor: '#fca5a5', backgroundColor: '#fef2f2' }}>
                  <input type="checkbox" style={checkboxStyle} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#b91c1c' }}>Quản trị viên (Admin)</div>
                    <div style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>Cấp quyền truy cập hệ thống ở mức cao nhất, có thể phân quyền & điều phối người dùng.</div>
                  </div>
                </label>

                <label style={roleOptionStyle}>
                  <input type="checkbox" defaultChecked style={checkboxStyle} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>Cán bộ Thuế</div>
                    <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>Toàn quyền truy cập và xử lý các chức năng thuộc phân hệ Thuế đất đai.</div>
                  </div>
                </label>

                <label style={roleOptionStyle}>
                  <input type="checkbox" defaultChecked={selectedUser.permissions.includes('Phân hệ Địa chính')} style={checkboxStyle} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>Cán bộ Địa chính</div>
                    <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>Toàn quyền truy cập và xử lý các chức năng thuộc phân hệ Đất đai (Sổ địa chính, Giá đất...).</div>
                  </div>
                </label>
              </div>

              {/* Modal Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button style={btnCancelStyle} onClick={() => setIsRoleModalOpen(false)}>Hủy bỏ</button>
                <button style={btnConfirmRedStyle} onClick={() => setIsRoleModalOpen(false)}>
                  <i className="bi bi-check2"></i> Lưu thông tin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: XÁC NHẬN THU HỒI --- */}
      {isRevokeModalOpen && selectedDelegation && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: 450, padding: 32, textAlign: 'center' }}>
            
            <div style={warningIconBgStyle}>
              <i className="bi bi-exclamation-triangle" style={{ color: '#dc2626', fontSize: 24 }}></i>
            </div>
            
            <h3 style={{ margin: '20px 0 12px', fontSize: 20, fontWeight: 800, color: '#1e293b' }}>Xác nhận Thu hồi Quyền</h3>
            
            <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.5, marginBottom: 24 }}>
              Bạn có chắc chắn muốn thu hồi quyền <span style={{ fontWeight: 700, color: '#475569' }}>{selectedDelegation.permission}</span> từ <span style={{ fontWeight: 700, color: '#475569' }}>{selectedDelegation.assignee}</span> không? Cán bộ này sẽ mất quyền ngay lập tức.
            </p>

            <div style={delegationDetailsBoxStyle}>
              <div style={detailRowStyle}>
                <span style={{ color: '#64748b' }}>Mã Ủy quyền:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{selectedDelegation.id}</span>
              </div>
              <div style={detailRowStyle}>
                <span style={{ color: '#64748b' }}>Người giao:</span>
                <span style={{ color: '#334155' }}>{selectedDelegation.assigner}</span>
              </div>
              <div style={detailRowStyle}>
                <span style={{ color: '#64748b' }}>Thời hạn:</span>
                <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{selectedDelegation.start.split(' ')[0]} - {selectedDelegation.end.split(' ')[0]}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button style={{ ...btnCancelStyle, flex: 1 }} onClick={() => setIsRevokeModalOpen(false)}>Hủy bỏ</button>
              <button style={{ ...btnConfirmRedStyle, flex: 1, justifyContent: 'center' }} onClick={() => setIsRevokeModalOpen(false)}>Đồng ý Thu hồi</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// --- STYLES & HELPERS ---

const mainCardStyle = { background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' };

// Tabs
const tabsHeaderStyle = { display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '0 24px' };
const inactiveTabBtnStyle = { background: 'none', border: 'none', borderBottom: '2px solid transparent', padding: '20px 0', marginRight: 32, fontSize: 15, fontWeight: 700, color: '#64748b', cursor: 'pointer' };
const activeTabBtnStyle = { ...inactiveTabBtnStyle, color: '#b91c1c', borderBottom: '2px solid #b91c1c' };

// Table
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thRowStyle = { borderBottom: '1px solid #e2e8f0' };
const thCellStyle = { padding: '16px 0', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 0.5 };
const tdRowStyle = { borderBottom: '1px solid #f1f5f9' };
const tdCellStyle = { padding: '20px 0', fontSize: 14 };

// Buttons & Inputs
const selectStyle = { padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', color: '#1e293b', fontSize: 14, outline: 'none', backgroundColor: '#fff', cursor: 'pointer' };
const btnBlueLightStyle = { background: '#eff6ff', color: '#2563eb', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer' };
const btnRedOutlineStyle = { background: '#fff', color: '#dc2626', border: '1px solid #dc2626', padding: '6px 16px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer' };

// Badges
const getPermissionBadgeStyle = (perm) => {
  const isTax = perm.includes('Thuế');
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 50, fontSize: 12, fontWeight: 600,
    backgroundColor: isTax ? '#eff6ff' : '#f0fdf4', color: isTax ? '#2563eb' : '#16a34a'
  };
};

const getDelegationStatusBadge = (status) => {
  const isActive = status === 'Đang hoạt động';
  return {
    padding: '4px 12px', borderRadius: 50, fontSize: 12, fontWeight: 600,
    backgroundColor: isActive ? '#dcfce7' : '#f1f5f9', color: isActive ? '#16a34a' : '#64748b'
  };
};

// Modal Common
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: '#fff', width: '100%', maxWidth: 550, borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' };

// Role Modal specific
const modalHeaderRedStyle = { backgroundColor: '#b91c1c', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' };
const userInfoBoxStyle = { border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, backgroundColor: '#f8fafc' };
const avatarStyle = { width: 48, height: 48, borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #e2e8f0', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const roleOptionStyle = { display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, border: '1px solid #e2e8f0', borderRadius: 12, cursor: 'pointer', backgroundColor: '#fff' };
const checkboxStyle = { width: 18, height: 18, marginTop: 2, accentColor: '#2563eb', cursor: 'pointer' };

// Revoke Modal specific
const warningIconBgStyle = { width: 64, height: 64, borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' };
const delegationDetailsBoxStyle = { border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' };
const detailRowStyle = { display: 'flex', justifyContent: 'space-between', fontSize: 13 };

const btnCancelStyle = { padding: '10px 24px', borderRadius: 8, border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', fontSize: 14, fontWeight: 700, cursor: 'pointer' };
const btnConfirmRedStyle = { padding: '10px 24px', borderRadius: 8, border: 'none', backgroundColor: '#dc2626', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 };

export default RoleDelegation;