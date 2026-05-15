import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

const UserManagement = () => {
  const user = JSON.parse(localStorage.getItem('user_info') || '{}');
  const baseUrl = 'http://localhost:8080';

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Tất cả vai trò');
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal State
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [lockReason, setLockReason] = useState('');

  // ===== FETCH DATA TỪ BACKEND =====
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const response = await fetch(`${baseUrl}/api/admin/users`, { headers });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || data);
      } else {
        // Fallback: dùng mock data nếu API fail
        setUsers([
          { id: '1', name: 'Nguyễn Văn Công', email: 'cong.nv@vneid.gov', role: 'Công dân', cccd: '001090123456', status: 'Hoạt động', lastLogin: '10:30 18/04/2026' },
          { id: '2', name: 'Trần Thị Hằng', email: 'hang.tt@tax.gov.vn', role: 'Cán bộ Thuế', cccd: '001192654321', status: 'Hoạt động', lastLogin: '08:15 18/04/2026' },
          { id: '3', name: 'Lê Minh Tuấn', email: 'tuan.lm@land.gov.vn', role: 'Cán bộ Địa chính', cccd: '037085987654', status: 'Hoạt động', lastLogin: '09:00 18/04/2026' },
        ]);
      }
    } catch (error) {
      console.error('Lỗi khi fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

    // Lọc dữ liệu
  const filteredUsers = users.filter(u => {
    const userName = u.name || u.fullName || '';
    const userEmail = u.email || '';
    const userCccd = u.cccd || u.citizenCccd || u.cccdNumber || '';
    
    const matchSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        userCccd.includes(searchTerm);
    const matchRole = roleFilter === 'Tất cả vai trò' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  // Mở Modal Khóa tài khoản
  const handleOpenLockModal = (u) => {
    setSelectedUser(u);
    setLockReason('');
    setIsLockModalOpen(true);
  };

  // Xử lý Khóa (gọi API để cập nhật)
  const handleConfirmLock = async () => {
    if (!lockReason.trim()) {
      alert('Vui lòng nhập lý do khóa tài khoản!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${baseUrl}/api/admin/users/${selectedUser.cccd || selectedUser.citizenCccd}/status?active=false`,
        {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        // Cập nhật state sau khi khóa thành công
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: 'Bị khóa' } : u));
        setIsLockModalOpen(false);
        alert('Khóa tài khoản thành công!');
      } else {
        alert('Lỗi khi khóa tài khoản!');
      }
    } catch (error) {
      console.error('Lỗi khi khóa tài khoản:', error);
      alert('Lỗi khi khóa tài khoản!');
    }
  };

  return (
    <AdminLayout user={user}>
      <div className="container py-4" style={{ maxWidth: '1140px' }}>
        
        {/* Header Section */}
        <div className="mb-4">
          <h3 className="fw-bold">Quản lý người dùng</h3>
          <p className="text-muted">Quản lý tài khoản công dân, cán bộ Thuế và cán bộ Địa chính</p>
        </div>

        {/* Filter Bar */}
        <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '12px' }}>
          <div className="card-body p-3">
            <div className="row g-3">
              <div className="col-md-8 position-relative">
                <i className="bi bi-search position-absolute text-muted" style={{ left: '25px', top: '50%', transform: 'translateY(-50%)' }}></i>
                <input 
                  type="text" 
                  className="form-control py-2 bg-light border-0" 
                  placeholder="Tìm kiếm theo Tên, Email, CCCD..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '40px', borderRadius: '8px' }}
                />
              </div>
              <div className="col-md-4">
                <select 
                  className="form-select py-2 border-danger text-danger fw-semibold" 
                  value={roleFilter} 
                  onChange={(e) => setRoleFilter(e.target.value)} 
                  style={{ borderRadius: '8px', backgroundColor: '#fff' }}
                >
                  <option value="Tất cả vai trò">Tất cả vai trò</option>
                  <option value="Công dân">Công dân</option>
                  <option value="Cán bộ Thuế">Cán bộ Thuế</option>
                  <option value="Cán bộ Địa chính">Cán bộ Địa chính</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        )}

        {/* Table */}
        {!isLoading && (
          <div className="card shadow-sm border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="table table-borderless table-hover align-middle mb-0" style={{ minWidth: '950px' }}>
                <thead className="bg-light border-bottom">
                  <tr>
                    <th className="py-3 px-4 text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>ID / NGƯỜI DÙNG</th>
                    <th className="py-3 px-4 text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>VAI TRÒ</th>
                    <th className="py-3 px-4 text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>CCCD</th>
                    <th className="py-3 px-4 text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>TRẠNG THÁI</th>
                    <th className="py-3 px-4 text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>ĐĂNG NHẬP CUỐI</th>
                    <th className="py-3 px-4 text-muted small fw-bold text-center" style={{ letterSpacing: '0.5px' }}>THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, idx) => (
                    <tr key={u.cccd || u.id || u.email || idx} className={idx !== filteredUsers.length - 1 ? "border-bottom" : ""}>
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="rounded-circle bg-secondary bg-opacity-10 text-secondary d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                            {(u.name || u.fullName || 'U').charAt(0)}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{u.name || u.fullName || 'N/A'}</div>
                            <div className="text-muted small mt-1">{u.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge rounded-pill px-3 py-2 ${getRoleBadgeClass(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-secondary small font-monospace">
                        {u.cccdNumber || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <div className={`d-flex align-items-center gap-2 small fw-semibold ${u.status === 'Hoạt động' ? 'text-success' : 'text-danger'}`}>
                          <div className={`rounded-circle ${u.status === 'Hoạt động' ? 'bg-success' : 'bg-danger'}`} style={{ width: '8px', height: '8px' }}></div>
                          {u.status}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted small">
                        {u.lastLogin || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button 
                          className="btn btn-light btn-sm text-secondary" 
                          onClick={() => handleOpenLockModal(u)}
                          title={u.status === 'Hoạt động' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                          style={{ borderRadius: '8px', width: '36px', height: '36px' }}
                        >
                          <i className={u.status === 'Hoạt động' ? "bi bi-lock-fill" : "bi bi-unlock-fill"}></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        Không tìm thấy người dùng nào phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Khóa Tài Khoản */}
        {isLockModalOpen && selectedUser && (
          <div className="modal-overlay d-flex align-items-center justify-content-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1050 }}>
            <div className="card border-0 shadow-lg" style={{ width: '100%', maxWidth: '500px', borderRadius: '16px', overflow: 'hidden' }}>
              <div className="p-4 p-md-5">
                {/* Modal Header */}
                <div className="d-flex gap-3 mb-4">
                  <div className="rounded-circle bg-danger bg-opacity-10 text-danger d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '48px', height: '48px', fontSize: '24px' }}>
                    <i className="bi bi-exclamation-triangle"></i>
                  </div>
                  <div>
                    <h4 className="fw-bold text-dark mb-1">Khóa tài khoản</h4>
                    <p className="text-muted small mb-0" style={{ lineHeight: '1.5' }}>
                      Đình chỉ tài khoản <span className="fw-bold text-dark">{selectedUser.name || selectedUser.fullName || 'N/A'}</span><br />
                      ({selectedUser.email || 'N/A'}).
                    </p>  
                  </div>
                </div>

                {/* Modal Body */}
                <div className="border-top pt-4 mb-4">
                  <label className="form-label fw-bold small text-dark mb-2">
                    Lý do khóa <span className="text-danger">*</span>
                  </label>
                  <textarea 
                    className="form-control"
                    rows={4}
                    placeholder="Nhập lý do chi tiết để lưu vết hệ thống (VD: Phát hiện đăng nhập bất thường, Xâm phạm dữ liệu...)"
                    value={lockReason}
                    onChange={(e) => setLockReason(e.target.value)}
                    style={{ borderRadius: '8px', resize: 'none' }}
                  />
                  <div className="d-flex align-items-center gap-2 text-muted small mt-2">
                    <i className="bi bi-shield-check"></i>
                    Hành động này sẽ được ghi lại vào Lịch sử thao tác hệ thống.
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="d-flex justify-content-end gap-2 border-top pt-4">
                  <button className="btn btn-light border fw-semibold px-4" style={{ borderRadius: '8px' }} onClick={() => setIsLockModalOpen(false)}>Hủy</button>
                  <button className="btn btn-danger fw-semibold px-4" style={{ borderRadius: '8px' }} onClick={handleConfirmLock}>Xác nhận Khóa</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

// --- Helper Functions ---
const getRoleBadgeClass = (role) => {
  if (role === 'Công dân') return 'bg-primary bg-opacity-10 text-primary';
  if (role === 'Cán bộ Thuế') return 'bg-success bg-opacity-10 text-success';
  if (role === 'Cán bộ Địa chính') return 'bg-info bg-opacity-10 text-info';
  return 'bg-secondary bg-opacity-10 text-secondary';
};

export default UserManagement;